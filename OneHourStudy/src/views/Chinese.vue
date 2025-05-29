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
          <div v-for="(record, char) in filteredHistory" 
               :key="char" 
               class="history-item"
               :class="record.status">
            <div class="history-char">{{ char }}</div>
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

const route = useRoute()

// 常用汉字列表（按使用频率排序）
const COMMON_CHINESE_CHARS = [
  { char: '的', pinyin: 'de', meaning: '表示所属关系', example: '我的书。' },
  { char: '了', pinyin: 'le', meaning: '表示动作完成', example: '我吃完了。' },
  { char: '是', pinyin: 'shì', meaning: '表示判断', example: '我是学生。' },
  { char: '在', pinyin: 'zài', meaning: '表示存在或进行', example: '我在家。' },
  { char: '有', pinyin: 'yǒu', meaning: '表示拥有', example: '我有书。' },
  { char: '和', pinyin: 'hé', meaning: '表示并列', example: '我和你。' },
  { char: '人', pinyin: 'rén', meaning: '人类', example: '人们都很开心。' },
  { char: '这', pinyin: 'zhè', meaning: '指示代词', example: '这是书。' },
  { char: '中', pinyin: 'zhōng', meaning: '中间', example: '在中间。' },
  { char: '大', pinyin: 'dà', meaning: '大小的大', example: '大树。' },
  { char: '为', pinyin: 'wéi', meaning: '作为', example: '为人民服务。' },
  { char: '上', pinyin: 'shàng', meaning: '上面', example: '在桌子上。' },
  { char: '个', pinyin: 'gè', meaning: '量词', example: '一个人。' },
  { char: '国', pinyin: 'guó', meaning: '国家', example: '中国。' },
  { char: '我', pinyin: 'wǒ', meaning: '第一人称', example: '我喜欢。' },
  { char: '以', pinyin: 'yǐ', meaning: '用来', example: '以此为例。' },
  { char: '要', pinyin: 'yào', meaning: '需要', example: '我要喝水。' },
  { char: '他', pinyin: 'tā', meaning: '第三人称', example: '他来了。' },
  { char: '时', pinyin: 'shí', meaning: '时间', example: '什么时候。' },
  { char: '来', pinyin: 'lái', meaning: '来到', example: '我来了。' },
  { char: '用', pinyin: 'yòng', meaning: '使用', example: '用笔写字。' },
  { char: '们', pinyin: 'men', meaning: '表示复数', example: '我们。' },
  { char: '生', pinyin: 'shēng', meaning: '生命', example: '生活。' },
  { char: '到', pinyin: 'dào', meaning: '到达', example: '到家了。' },
  { char: '作', pinyin: 'zuò', meaning: '工作', example: '作业。' },
  { char: '地', pinyin: 'de', meaning: '助词', example: '慢慢地走。' },
  { char: '于', pinyin: 'yú', meaning: '在', example: '位于。' },
  { char: '出', pinyin: 'chū', meaning: '出去', example: '出门。' },
  { char: '就', pinyin: 'jiù', meaning: '就是', example: '就是这样。' },
  { char: '分', pinyin: 'fēn', meaning: '分开', example: '分数。' },
  { char: '对', pinyin: 'duì', meaning: '正确', example: '对错。' },
  { char: '成', pinyin: 'chéng', meaning: '完成', example: '成功。' },
  { char: '会', pinyin: 'huì', meaning: '能够', example: '我会游泳。' },
  { char: '可', pinyin: 'kě', meaning: '可以', example: '可以。' },
  { char: '主', pinyin: 'zhǔ', meaning: '主要', example: '主人。' },
  { char: '发', pinyin: 'fā', meaning: '发出', example: '发现。' },
  { char: '年', pinyin: 'nián', meaning: '年份', example: '新年。' },
  { char: '动', pinyin: 'dòng', meaning: '运动', example: '活动。' },
  { char: '同', pinyin: 'tóng', meaning: '相同', example: '同学。' },
  { char: '工', pinyin: 'gōng', meaning: '工作', example: '工人。' },
  { char: '也', pinyin: 'yě', meaning: '也', example: '我也去。' },
  { char: '能', pinyin: 'néng', meaning: '能够', example: '能力。' },
  { char: '下', pinyin: 'xià', meaning: '下面', example: '在下面。' },
  { char: '过', pinyin: 'guò', meaning: '经过', example: '过去。' },
  { char: '子', pinyin: 'zǐ', meaning: '儿子', example: '孩子。' },
  { char: '说', pinyin: 'shuō', meaning: '说话', example: '说话。' },
  { char: '产', pinyin: 'chǎn', meaning: '生产', example: '产品。' },
  { char: '面', pinyin: 'miàn', meaning: '脸面', example: '见面。' },
  { char: '方', pinyin: 'fāng', meaning: '方向', example: '方向。' },
  { char: '后', pinyin: 'hòu', meaning: '后面', example: '后面。' },
  { char: '多', pinyin: 'duō', meaning: '很多', example: '很多。' },
  { char: '定', pinyin: 'dìng', meaning: '确定', example: '一定。' },
  { char: '行', pinyin: 'xíng', meaning: '行走', example: '行走。' }
]

const words = ref([
  { char: '日', pinyin: 'rì', meaning: '太阳，一天', example: '今天是个好日子。' },
  { char: '月', pinyin: 'yuè', meaning: '月亮，月份', example: '月亮挂在天上。' },
  { char: '水', pinyin: 'shuǐ', meaning: '水，液体', example: '河水哗哗地流。' },
  { char: '火', pinyin: 'huǒ', meaning: '火，火焰', example: '小心火烛。' },
  { char: '木', pinyin: 'mù', meaning: '树木，木头', example: '树木长得很高。' },
  { char: '土', pinyin: 'tǔ', meaning: '土地，土壤', example: '土地很肥沃。' },
  { char: '山', pinyin: 'shān', meaning: '山，山峰', example: '山很高。' },
  { char: '石', pinyin: 'shí', meaning: '石头，岩石', example: '石头很硬。' },
  { char: '天', pinyin: 'tiān', meaning: '天空，天气', example: '天空很蓝。' },
  { char: '人', pinyin: 'rén', meaning: '人，人类', example: '人们都很开心。' }
])

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
  const records = Object.values(learningHistory.value)
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
  resetComponentState()
  loadLearningHistory()
})

// 组件卸载时清理
onUnmounted(() => {
  saveLearningStats()
  saveLearnedWords()
  saveLearningHistory()
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
  words.value.forEach(word => {
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
}

// 保存学习记录到本地存储
function saveLearningStats() {
  localStorage.setItem('chineseLearningStats', JSON.stringify(learningStats.value))
}

// 保存已学习的汉字列表
function saveLearnedWords() {
  localStorage.setItem('learnedWords', JSON.stringify(words.value.map(w => w.char)))
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
    const newWords = COMMON_CHINESE_CHARS.filter(word => !learnedWords.includes(word.char))
    
    // 添加新汉字到学习列表
    if (newWords.length > 0) {
      words.value.push(...newWords)
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
  const allWordsLearned = words.value.every(word => {
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

const currentWord = computed(() => words.value[currentIndex.value])

const formatLearningTime = computed(() => {
  const totalSeconds = Math.floor((Date.now() - startTime.value) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}分${seconds}秒`
})

function playAnimation() {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
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
  return words.value.filter(word => {
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
    const newIndex = words.value.findIndex(w => w.char === wordToReview.char)
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
  const wordScores = words.value.map((word, index) => {
    const record = learningHistory.value[word.char]
    if (!record) {
      // 未学习过的字，优先级最高，但添加随机因子
      return { index, score: -1000 + Math.random() * 100 }
    }
    
    // 1. 时间权重（距离上次学习时间越长，权重越高）
    const daysSinceLastReview = (now - record.timestamp) / (24 * 60 * 60 * 1000)
    const timeWeight = Math.log(daysSinceLastReview + 1) * 15
    
    // 2. 掌握程度权重
    const totalCount = record.knownCount + record.fuzzyCount + record.unknownCount
    const masteryWeight = (record.unknownCount * 4 + record.fuzzyCount * 2 - record.knownCount) / totalCount * 60
    
    // 3. 艾宾浩斯记忆权重
    const reviewIntervals = {
      known: 7 * 24 * 60 * 60 * 1000,    // 7天
      fuzzy: 3 * 24 * 60 * 60 * 1000,    // 3天
      unknown: 24 * 60 * 60 * 1000       // 1天
    }
    const expectedReviewTime = record.timestamp + reviewIntervals[record.status]
    const daysUntilReview = (expectedReviewTime - now) / (24 * 60 * 60 * 1000)
    const reviewWeight = Math.log(Math.abs(daysUntilReview) + 1) * (daysUntilReview < 0 ? 25 : -15)
    
    // 4. 学习效果权重
    const learningEffect = evaluateLearningEffect(record)
    const effectWeight = learningEffect * 30
    
    // 5. 难度权重
    const difficulty = evaluateDifficulty(record)
    const difficultyWeight = difficulty * 40
    
    // 6. 学习节奏控制
    const learningPace = calculateLearningPace(record)
    
    // 7. 连续错误权重
    const recentStatuses = record.recentStatuses || []
    const consecutiveErrors = recentStatuses.filter(s => s === 'unknown').length
    const errorWeight = consecutiveErrors * 20
    
    // 8. 学习频率权重
    const frequencyWeight = Math.min(totalCount * 5, 30)
    
    // 9. 状态稳定性权重
    const statusChanges = recentStatuses.reduce((acc, curr, i, arr) => {
      if (i > 0 && curr !== arr[i - 1]) acc++
      return acc
    }, 0)
    const stabilityWeight = statusChanges * 15
    
    // 综合得分（分数越低越需要复习）
    const baseScore = timeWeight + 
                     masteryWeight + 
                     reviewWeight + 
                     effectWeight + 
                     difficultyWeight + 
                     errorWeight - 
                     frequencyWeight + 
                     stabilityWeight
    
    // 添加随机因子（±10%）
    const randomFactor = 1 + (Math.random() * 0.2 - 0.1)
    const finalScore = baseScore * learningPace * randomFactor
    
    return { index, score: finalScore }
  })
  
  // 按分数排序，分数越低越需要复习
  wordScores.sort((a, b) => a.score - b.score)
  
  // 选择分数最低的字
  if (wordScores.length > 0) {
    currentIndex.value = wordScores[0].index
  }
}

// 修改记录状态函数，添加最近状态记录
function recordStatus(status) {
  if (!currentWord.value) return
  
  playAnimation()
  
  const char = currentWord.value.char
  const now = Date.now()
  
  // 更新历史记录
  const existingRecord = learningHistory.value[char] || {
    char: char,
    pinyin: currentWord.value.pinyin,
    meaning: currentWord.value.meaning,
    knownCount: 0,
    fuzzyCount: 0,
    unknownCount: 0,
    recentStatuses: []
  }
  
  // 更新状态计数
  existingRecord[status + 'Count']++
  existingRecord.status = status
  existingRecord.timestamp = now
  
  // 更新最近状态记录（保留最近5次）
  existingRecord.recentStatuses = [status, ...(existingRecord.recentStatuses || [])].slice(0, 5)
  
  learningHistory.value[char] = existingRecord
  
  // 保存到本地存储
  saveLearningHistory()
  
  // 检查是否需要获取更多汉字
  checkNeedMoreWords()
  
  // 智能推荐下一个字
  recommendNextWord()
}

// 修改保存历史记录函数
function saveLearningHistory() {
  try {
    localStorage.setItem('learningHistory', JSON.stringify(learningHistory.value))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

// 修改加载历史记录函数
function loadLearningHistory() {
  try {
    const saved = localStorage.getItem('learningHistory')
    if (saved) {
      learningHistory.value = JSON.parse(saved)
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
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-btn:hover {
  transform: translateY(-2px);
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