<template>
  <div class="chinese-container">
    <h2>识字乐园</h2>
    <div class="main-content">
      <!-- 左侧：汉字学习区域 -->
      <div class="learning-section">
        <div class="word-display" :class="{ 'animate': isAnimating }">
          <div class="chinese-char">{{ currentWord.char }}</div>
          <div class="pinyin">{{ currentWord.pinyin }}</div>
          <div class="meaning">{{ currentWord.meaning }}</div>
          <div class="example">{{ currentWord.example }}</div>
        </div>
        <div class="status-buttons">
          <button @click="recordStatus('known')" class="status-btn known">
            <span class="icon">😊</span> 认识
          </button>
          <button @click="recordStatus('fuzzy')" class="status-btn fuzzy">
            <span class="icon">🤔</span> 模糊
          </button>
          <button @click="recordStatus('unknown')" class="status-btn unknown">
            <span class="icon">😢</span> 忘记
          </button>
        </div>
      </div>

      <!-- 右侧：历史记录区域 -->
      <div class="history-section" :class="{ 'show': showHistory }">
        <div class="history-header">
          <h3>学习历史</h3>
          <div class="history-filters">
            <select v-model="historyFilter">
              <option value="all">全部</option>
              <option value="known">已掌握</option>
              <option value="fuzzy">模糊</option>
              <option value="unknown">未掌握</option>
            </select>
          </div>
        </div>
        <div class="history-list">
          <div v-for="record in filteredHistory" 
               :key="record.char" 
               class="history-item"
               :class="record.status">
            <div class="history-char">{{ record.char }}</div>
            <div class="history-info">
              <div class="history-pinyin">{{ record.pinyin }}</div>
              <div class="history-meaning">{{ record.meaning }}</div>
              <div class="history-counts">
                <span class="count known">认识: {{ record.knownCount }}</span>
                <span class="count fuzzy">模糊: {{ record.fuzzyCount }}</span>
                <span class="count unknown">忘记: {{ record.unknownCount }}</span>
              </div>
            </div>
            <div class="history-status">
              <span class="status-tag" :class="record.status">
                {{ getStatusText(record.status) }}
              </span>
              <div class="history-time">{{ formatTime(record.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史记录切换按钮 -->
    <button @click="showHistory = !showHistory" class="history-btn">
      {{ showHistory ? '隐藏历史' : '查看历史' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { addStudyRecord } from '../services/studyService'
import chineseData from '../data/chinese.json'

const route = useRoute()

// 汉字数据
const chineseChars = ref(chineseData.characters)
const commonChars = ref(chineseData.commonChars)

// 艾宾浩斯复习时间点（单位：毫秒）
const REVIEW_INTERVALS = [
  5 * 60 * 1000,      // 5分钟
  30 * 60 * 1000,     // 30分钟
  12 * 60 * 60 * 1000, // 12小时
  24 * 60 * 60 * 1000, // 1天
  2 * 24 * 60 * 60 * 1000, // 2天
  4 * 24 * 60 * 60 * 1000, // 4天
  7 * 24 * 60 * 60 * 1000, // 7天
  15 * 24 * 60 * 60 * 1000 // 15天
]

const currentIndex = ref(0)
const isAnimating = ref(false)
const startTime = ref(Date.now())
const learningStats = ref({
  totalCount: 0,
  knownCount: 0,
  fuzzyCount: 0,
  unknownCount: 0,
  wordStats: {} // 记录每个字的学习情况
})

// 修改历史记录相关状态
const showHistory = ref(false)
const historyFilter = ref('all')
const learningHistory = ref({}) // 改为对象，以汉字为键

// 计算属性：过滤后的历史记录
const filteredHistory = computed(() => {
  const records = Object.entries(learningHistory.value).map(([char, record]) => ({
    char,
    ...record
  }))
  if (historyFilter.value === 'all') {
    return records
  }
  return records.filter(record => record.status === historyFilter.value)
})

// 计算属性：总学习次数
const totalLearningCount = computed(() => {
  return Object.keys(learningHistory.value).length
})

// 计算属性：掌握程度
const masteryRate = computed(() => {
  if (totalLearningCount.value === 0) return 0
  const knownCount = Object.values(learningHistory.value).filter(record => record.status === 'known').length
  return Math.round((knownCount / totalLearningCount.value) * 100)
})

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    known: '已掌握',
    fuzzy: '模糊',
    unknown: '未掌握'
  }
  return statusMap[status] || status
}

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 重置组件状态
function resetComponentState() {
  currentIndex.value = 0
  isAnimating.value = false
  startTime.value = Date.now()
  loadLearningStats()
  // 重置时智能推荐第一个字
  recommendNextWord()
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/chinese') {
      resetComponentState()
      // 路由切换时智能推荐第一个字
      recommendNextWord()
    }
  }
)

// 组件挂载时初始化
onMounted(() => {
  // 确保数据正确加载
  if (!chineseData || !chineseData.characters || !chineseData.commonChars) {
    console.error('汉字数据加载失败')
    return
  }

  // 初始化汉字数据
  chineseChars.value = chineseData.characters
  commonChars.value = chineseData.commonChars

  // 初始化学习统计
  initializeLearningStats()
  
  // 加载历史记录
  loadLearningHistory()
  
  // 重置组件状态
  resetComponentState()
  
  // 设置开始时间
  startTime.value = Date.now()

  // 确保有当前汉字
  if (chineseChars.value.length > 0) {
    currentIndex.value = 0
  }

  // 添加调试日志
  console.log('初始化完成:', {
    chineseChars: chineseChars.value,
    commonChars: commonChars.value,
    currentWord: currentWord.value
  })
})

// 组件卸载时清理
onUnmounted(() => {
  saveLearningStats()
  saveLearnedWords()
  saveLearningHistory()
  
  // 计算学习时长（秒）
  const duration = Math.floor((Date.now() - startTime.value) / 1000)
  if (duration > 0) {
    addStudyRecord('chinese', duration)
  }
})

// 从本地存储加载学习记录
function loadLearningStats() {
  const savedStats = localStorage.getItem('chineseLearningStats')
  if (savedStats) {
    try {
      const parsed = JSON.parse(savedStats)
      learningStats.value = parsed
    } catch (error) {
      console.error('加载学习记录失败:', error)
      initializeLearningStats()
    }
  } else {
    initializeLearningStats()
  }
}

// 初始化学习统计
function initializeLearningStats() {
  learningStats.value = {
    totalCount: 0,
    knownCount: 0,
    fuzzyCount: 0,
    unknownCount: 0,
    wordStats: {}
  }
  
  // 初始化每个字的学习统计
  chineseChars.value.forEach(char => {
    if (!learningStats.value.wordStats[char.char]) {
      learningStats.value.wordStats[char.char] = {
        knownCount: 0,
        fuzzyCount: 0,
        unknownCount: 0,
        lastReviewTime: null,
        reviewHistory: [],
        nextReviewTime: null,
        reviewStage: 0
      }
    }
  })
}

// 保存学习记录到本地存储
function saveLearningStats() {
  localStorage.setItem('chineseLearningStats', JSON.stringify(learningStats.value))
}

// 保存已学习的汉字列表
function saveLearnedWords() {
  localStorage.setItem('learnedWords', JSON.stringify(chineseChars.value.map(w => w.char)))
}

// 加载已学习的汉字列表
function loadLearnedWords() {
  const saved = localStorage.getItem('learnedWords')
  return saved ? JSON.parse(saved) : []
}

// 获取更多汉字
async function fetchMoreWords() {
  try {
    const learnedWords = loadLearnedWords()
    const newWords = commonChars.value.filter(word => !learnedWords.includes(word.char))
    
    // 添加新汉字到学习列表
    if (newWords.length > 0) {
      chineseChars.value.push(...newWords)
      // 初始化新汉字的学习统计
      newWords.forEach(word => {
        learningStats.value.wordStats[word.char] = {
          knownCount: 0,
          fuzzyCount: 0,
          unknownCount: 0,
          lastReviewTime: null,
          reviewHistory: [],
          nextReviewTime: null,
          reviewStage: 0
        }
      })
      saveLearningStats()
      return true
    }
    return false
  } catch (error) {
    console.error('获取更多汉字失败:', error)
    return false
  }
}

// 检查是否需要获取更多汉字
function checkNeedMoreWords() {
  const allWordsLearned = chineseChars.value.every(word => {
    const stats = learningStats.value.wordStats[word.char]
    return stats.knownCount > 0
  })
  
  if (allWordsLearned) {
    const hasNewWords = fetchMoreWords()
    if (!hasNewWords) {
      // 如果没有新汉字了，显示完成提示
      alert('恭喜！您已经完成了所有常用汉字的学习！')
    }
  }
}

// 添加 currentWord 计算属性
const currentWord = computed(() => {
  if (!chineseChars.value || chineseChars.value.length === 0) {
    return { char: '', pinyin: '', meaning: '', example: '' }
  }
  return chineseChars.value[currentIndex.value] || { char: '', pinyin: '', meaning: '', example: '' }
})

const formatLearningTime = computed(() => {
  const totalSeconds = Math.floor((Date.now() - startTime.value) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}分${seconds}秒`
})

function playAnimation() {
  isAnimating.value = true
  requestAnimationFrame(() => {
    setTimeout(() => {
      isAnimating.value = false
    }, 300) // 减少动画时间
  })
}

// 计算下次复习时间
function calculateNextReviewTime(stats) {
  const now = Date.now()
  const stage = stats.reviewStage || 0
  
  if (stage >= REVIEW_INTERVALS.length) {
    return null // 已完成所有复习阶段
  }
  
  return now + REVIEW_INTERVALS[stage]
}

// 更新复习状态
function updateReviewStatus(word, status) {
  const stats = learningStats.value.wordStats[word.char]
  const now = Date.now()
  
  // 记录复习历史
  if (!stats.reviewHistory) {
    stats.reviewHistory = []
  }
  
  stats.reviewHistory.push({
    time: now,
    status,
    stage: stats.reviewStage || 0
  })
  
  // 根据状态更新复习阶段
  if (status === 'known') {
    stats.reviewStage = (stats.reviewStage || 0) + 1
  } else if (status === 'unknown') {
    // 如果忘记，回退一个阶段
    stats.reviewStage = Math.max(0, (stats.reviewStage || 0) - 1)
  }
  
  // 更新下次复习时间
  stats.nextReviewTime = calculateNextReviewTime(stats)
  stats.lastReviewTime = now
}

// 获取需要复习的汉字
function getWordsToReview() {
  const now = Date.now()
  return chineseChars.value.filter(word => {
    const stats = learningStats.value.wordStats[word.char]
    return stats && stats.nextReviewTime && stats.nextReviewTime <= now
  })
}

// 检查是否需要复习
function checkNeedReview() {
  const wordsToReview = getWordsToReview()
  if (wordsToReview.length > 0) {
    // 如果有需要复习的字，优先显示
    const randomIndex = Math.floor(Math.random() * wordsToReview.length)
    const wordToReview = wordsToReview[randomIndex]
    const newIndex = chineseChars.value.findIndex(w => w.char === wordToReview.char)
    if (newIndex !== -1) {
      currentIndex.value = newIndex
      return true
    }
  }
  return false
}

// 添加学习效果评估函数
function evaluateLearningEffect(record) {
  const recentStatuses = record.recentStatuses || []
  if (recentStatuses.length < 2) return 0
  
  // 计算最近状态的变化趋势
  let improvement = 0
  for (let i = 1; i < recentStatuses.length; i++) {
    const prev = recentStatuses[i - 1]
    const curr = recentStatuses[i]
    if (curr === 'known' && prev !== 'known') improvement++
    if (curr === 'unknown' && prev !== 'unknown') improvement--
  }
  
  // 计算稳定性得分
  const stability = recentStatuses.reduce((acc, curr, i, arr) => {
    if (i > 0 && curr === arr[i - 1]) acc++
    return acc
  }, 0) / (recentStatuses.length - 1)
  
  return (improvement + stability) / 2
}

// 添加难度评估函数
function evaluateDifficulty(record) {
  const totalCount = record.knownCount + record.fuzzyCount + record.unknownCount
  if (totalCount === 0) return 0.5 // 默认中等难度
  
  const unknownRate = record.unknownCount / totalCount
  const fuzzyRate = record.fuzzyCount / totalCount
  const knownRate = record.knownCount / totalCount
  
  // 计算难度系数（0-1，越大越难）
  return (unknownRate * 0.7 + fuzzyRate * 0.3) / (knownRate + 0.1)
}

// 添加学习节奏控制
function calculateLearningPace(record) {
  const recentStatuses = record.recentStatuses || []
  if (recentStatuses.length < 2) return 1
  
  // 计算最近状态的变化频率
  const statusChanges = recentStatuses.reduce((acc, curr, i, arr) => {
    if (i > 0 && curr !== arr[i - 1]) acc++
    return acc
  }, 0)
  
  // 如果状态变化频繁，降低学习节奏
  return Math.max(0.5, 1 - (statusChanges / recentStatuses.length) * 0.5)
}

// 修改智能推荐函数，添加随机因子
function recommendNextWord() {
  const now = Date.now()
  const wordScores = new Map()
  
  // 使用 Map 优化查找性能
  chineseChars.value.forEach((word, index) => {
    const record = learningHistory.value[word.char]
    if (!record) {
      wordScores.set(index, -1000 + Math.random() * 100)
      return
    }
    
    // 简化评分计算
    const daysSinceLastReview = (now - record.timestamp) / (24 * 60 * 60 * 1000)
    const timeWeight = Math.log(daysSinceLastReview + 1) * 15
    
    const totalCount = record.knownCount + record.fuzzyCount + record.unknownCount
    const masteryWeight = (record.unknownCount * 4 + record.fuzzyCount * 2 - record.knownCount) / totalCount * 60
    
    const score = timeWeight + masteryWeight + (Math.random() * 20 - 10)
    wordScores.set(index, score)
  })
  
  // 找到分数最低的索引
  let minScore = Infinity
  let minIndex = 0
  
  wordScores.forEach((score, index) => {
    if (score < minScore) {
      minScore = score
      minIndex = index
    }
  })
  
  currentIndex.value = minIndex
}

// 修改记录状态函数，添加最近状态记录
function recordStatus(status) {
  if (!currentWord.value || !currentWord.value.char) {
    console.error('当前汉字无效')
    return
  }
  
  // 立即播放动画
  playAnimation()
  
  const char = currentWord.value.char
  const now = Date.now()
  
  // 使用 requestAnimationFrame 优化状态更新
  requestAnimationFrame(() => {
    // 更新历史记录
    const existingRecord = learningHistory.value[char] || {
      char: char,
      pinyin: currentWord.value.pinyin,
      meaning: currentWord.value.meaning,
      knownCount: 0,
      fuzzyCount: 0,
      unknownCount: 0,
      recentStatuses: [],
      timestamp: now
    }
    
    // 更新状态计数
    existingRecord[status + 'Count']++
    existingRecord.status = status
    existingRecord.timestamp = now
    
    // 优化最近状态记录更新
    if (!existingRecord.recentStatuses) {
      existingRecord.recentStatuses = []
    }
    existingRecord.recentStatuses.unshift(status)
    if (existingRecord.recentStatuses.length > 5) {
      existingRecord.recentStatuses.length = 5
    }
    
    learningHistory.value[char] = existingRecord
    
    // 使用 requestAnimationFrame 延迟执行非关键操作
    requestAnimationFrame(() => {
      // 保存到本地存储
      saveLearningHistory()
      
      // 检查是否需要获取更多汉字
      checkNeedMoreWords()
      
      // 智能推荐下一个字
      recommendNextWord()
    })
  })
}

// 修改保存历史记录函数
function saveLearningHistory() {
  try {
    const historyString = JSON.stringify(learningHistory.value)
    localStorage.setItem('learningHistory', historyString)
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

// 修改加载历史记录函数
function loadLearningHistory() {
  try {
    const saved = localStorage.getItem('learningHistory')
    if (saved) {
      const parsed = JSON.parse(saved)
      learningHistory.value = parsed
    } else {
      learningHistory.value = {}
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
    learningHistory.value = {}
  }
}

// 添加复习进度显示
const reviewProgress = computed(() => {
  const stats = learningStats.value.wordStats[currentWord.value.char]
  if (!stats) return '未开始'
  
  const stage = stats.reviewStage
  const total = REVIEW_INTERVALS.length
  
  if (stage >= total) return '已完成'
  return `第 ${stage + 1}/${total} 阶段`
})

// 添加下次复习时间显示
const nextReviewTime = computed(() => {
  const stats = learningStats.value.wordStats[currentWord.value.char]
  if (!stats || !stats.nextReviewTime) return '无需复习'
  
  const now = Date.now()
  const timeLeft = stats.nextReviewTime - now
  
  if (timeLeft <= 0) return '需要复习'
  
  const minutes = Math.floor(timeLeft / (60 * 1000))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天后`
  if (hours > 0) return `${hours}小时后`
  return `${minutes}分钟后`
})
</script>

<style scoped>
.chinese-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.main-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.learning-section {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.history-section {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.word-display {
  text-align: center;
  margin-bottom: 2rem;
  will-change: transform;
}

.chinese-char {
  font-size: 8rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.pinyin {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.meaning {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.example {
  font-size: 1.2rem;
  color: var(--accent-color);
  font-style: italic;
  margin-bottom: 2rem;
}

.status-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.status-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  will-change: transform;
  user-select: none;
}

.status-btn:active {
  transform: scale(0.95);
}

.status-btn.known {
  background-color: #4CAF50;
  color: white;
}

.status-btn.fuzzy {
  background-color: #FFC107;
  color: white;
}

.status-btn.unknown {
  background-color: #F44336;
  color: white;
}

.word-display.animate {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  background-color: white;
  padding: 1rem 0;
  z-index: 1;
}

.history-filters select {
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-char {
  font-size: 2rem;
  margin-right: 1.5rem;
  min-width: 3rem;
  text-align: center;
}

.history-info {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.history-pinyin {
  color: var(--accent-color);
  margin-bottom: 0.3rem;
}

.history-meaning {
  color: #666;
  margin-bottom: 0.5rem;
}

.history-counts {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.count {
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.count.known {
  background-color: #4CAF50;
  color: white;
}

.count.fuzzy {
  background-color: #FFC107;
  color: black;
}

.count.unknown {
  background-color: #F44336;
  color: white;
}

.history-status {
  text-align: right;
  margin-left: 1rem;
  min-width: 120px;
}

.status-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.status-tag.known {
  background-color: #4CAF50;
  color: white;
}

.status-tag.fuzzy {
  background-color: #FFC107;
  color: black;
}

.status-tag.unknown {
  background-color: #F44336;
  color: white;
}

.history-time {
  font-size: 0.8rem;
  color: #999;
}

.history-btn {
  display: none; /* 默认隐藏，在移动端显示 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chinese-container {
    padding: 1rem;
  }

  .main-content {
    flex-direction: column;
  }

  .history-section {
    display: none;
    margin-top: 2rem;
  }

  .history-section.show {
    display: block;
  }

  .history-btn {
    display: block;
    width: 100%;
    margin: 1rem 0;
    padding: 0.8rem;
    font-size: 1.2rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .history-btn:hover {
    background-color: var(--accent-color);
  }

  .chinese-char {
    font-size: 6rem;
  }

  .pinyin {
    font-size: 1.5rem;
  }

  .meaning {
    font-size: 1.2rem;
  }

  .example {
    font-size: 1rem;
  }

  .status-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .status-btn {
    width: 100%;
  }

  .history-item {
    flex-direction: column;
    text-align: center;
  }

  .history-char {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .history-status {
    margin-left: 0;
    margin-top: 1rem;
    text-align: center;
  }

  .history-counts {
    justify-content: center;
  }
}
</style> 