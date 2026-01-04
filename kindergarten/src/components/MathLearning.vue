<script setup>
import { ref, onMounted, computed, watch, nextTick, shallowRef } from 'vue'

/**
 * 智学数学等级配置 (1-12级)
 * L1-L2: 10以内加减
 * L3-L5: 20以内 (进位/退位/不进位)
 * L6: 30以内加减
 * L7: 50以内加减
 * L8: 100以内整十/整五
 * L9: 100以内所有加减
 * L10: 20以内 2步混合 (如 5+8-3)
 * L11: 50以内 2步混合
 * L12: 100以内 3步混合
 */
const currentLevel = ref(1)
const sessionCount = ref(0)
const sessionFinished = ref(false)
const showAnswer = ref(false)
const lastResult = ref(null)
const currentIndex = ref(0)
const history = ref([])
const recentHistory = ref([])
const selectionReason = ref('')
const missedQueue = ref([])
const masteryMap = ref({})
const chartInstance = shallowRef(null)
const currentOptions = ref([]) 
const streak = ref(0)
const startTime = ref(null)
const lastDuration = ref(0)
const sessionGoalProgress = computed(() => {
  const all = currentLevelList.value
  if (all.length === 0) return 0
  const exhausted = all.filter(item => {
    const m = masteryMap.value[item.q] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    return (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5) || (m.todayAttempts >= 6 && todayAcc < 0.35)
  }).length
  return Math.round((exhausted / all.length) * 100)
})
const todayStr = computed(() => new Date().toISOString().split('T')[0])

// 智能题目生成器
const generateQuestionPool = (level) => {
  let pool = []
  const add = (q, a, l) => pool.push({ q, a, level: l })
  
  if (level === 1) { // 5以内
    for(let i=0; i<=5; i++) for(let j=0; j<=5; j++) {
      if(i+j <= 5) add(`${i} + ${j}`, i+j, 1)
      if(i-j >= 0) add(`${i} - ${j}`, i-j, 1)
    }
  } else if (level === 2) { // 10以内
    for(let i=0; i<=10; i++) for(let j=0; j<=10; j++) {
      if(i+j <= 10 && i+j > 5) add(`${i} + ${j}`, i+j, 2)
      if(i-j >= 0 && i > 5) add(`${i} - ${j}`, i-j, 2)
    }
  } else if (level === 3) { // 20以内不进位不退位
    for(let i=0; i<=20; i++) {
        for(let j=0; j<=10; j++) {
            if(i+j <= 20 && (i%10 + j < 10) && i > 10) add(`${i} + ${j}`, i+j, 3)
            if(i-j >= 10 && (i%10 >= j) && i > 10) add(`${i} - ${j}`, i-j, 3)
        }
    }
  } else if (level === 4) { // 20以内进位
    for(let i=1; i<=10; i++) for(let j=1; j<=10; j++) if(i+j > 10 && i+j <= 20) add(`${i} + ${j}`, i+j, 4)
  } else if (level === 5) { // 20以内退位
    for(let i=11; i<=20; i++) for(let j=1; j<=10; j++) if(i-j < 10 && i-j >= 0) add(`${i} - ${j}`, i-j, 5)
  } else if (level === 6) { // 30以内
    for(let i=0; i<=30; i++) for(let j=0; j<=15; j++) {
        if(i+j > 20 && i+j <= 30) add(`${i} + ${j}`, i+j, 6)
        if(i-j > 10 && i > 20) add(`${i} - ${j}`, i-j, 6)
    }
  } else if (level === 7) { // 50以内
    for(let i=0; i<=50; i++) for(let j=0; j<=25; j++) {
        if(i+j > 30 && i+j <= 50) add(`${i} + ${j}`, i+j, 7)
        if(i-j > 20 && i > 30) add(`${i} - ${j}`, i-j, 7)
    }
  } else if (level === 8) { // 100以内整十整五
    const bases = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95]
    for(let a of bases) for(let b of bases) {
        if(a+b <= 100 && a+b > 50) add(`${a} + ${b}`, a+b, 8)
        if(a-b >= 0 && a > 50) add(`${a} - ${b}`, a-b, 8)
    }
  } else if (level === 9) { // 100以内全
    for(let k=0; k<200; k++) {
        let a = Math.floor(Math.random()*100), b = Math.floor(Math.random()*100)
        if(a+b <= 100) add(`${a} + ${b}`, a+b, 9)
        if(a-b >= 0) add(`${a} - ${b}`, a-b, 9)
    }
  } else if (level === 10) { // 20以内2步
    for(let k=0; k<100; k++) {
        let a = Math.floor(Math.random()*15), b = Math.floor(Math.random()*10), c = Math.floor(Math.random()*10)
        let res1 = a + b
        if(res1 - c >= 0 && res1 - c <= 20) add(`${a} + ${b} - ${c}`, res1 - c, 10)
    }
  } else if (level === 11) { // 50以内2步
    for(let k=0; k<100; k++) {
        let a = Math.floor(Math.random()*30), b = Math.floor(Math.random()*20), c = Math.floor(Math.random()*20)
        if(a+b-c >= 0 && a+b-c <= 50) add(`${a} + ${b} - ${c}`, a+b-c, 11)
    }
  } else if (level === 12) { // 100以内3步
    for(let k=0; k<100; k++) {
        let a = Math.floor(Math.random()*50), b = Math.floor(Math.random()*30), c = Math.floor(Math.random()*30), d = Math.floor(Math.random()*20)
        let res = a + b - c + d
        if(res >= 0 && res <= 100) add(`${a} + ${b} - ${c} + ${d}`, res, 12)
    }
  }
  return pool
}

const currentLevelList = computed(() => {
    let combinedPool = []
    for(let i=1; i<=currentLevel.value; i++) {
        combinedPool = [...combinedPool, ...generateQuestionPool(i)]
    }
    return combinedPool
})

const statsToday = computed(() => {
  const todayRecords = history.value.filter(h => h.timestamp.split('T')[0] === todayStr.value)
  const total = todayRecords.length
  const correct = todayRecords.filter(r => r.correct).length
  return {
    total,
    correct,
    rate: total > 0 ? ((correct / total) * 100).toFixed(1) : 0
  }
})

const currentCharStats = computed(() => {
  const pool = currentLevelList.value
  if (!pool[currentIndex.value]) return null
  const question = pool[currentIndex.value].q
  const m = masteryMap.value[question] || { totalAttempts: 0, totalCorrect: 0, todayAttempts: 0, todayCorrect: 0 }
  return { q: question, ...m }
})

onMounted(() => {
  const savedLevel = localStorage.getItem('math_current_level')
  if (savedLevel) currentLevel.value = parseInt(savedLevel)

  const savedHistory = localStorage.getItem('math_learning_history')
  if (savedHistory) {
    try {
      history.value = JSON.parse(savedHistory)
    } catch (e) {
      history.value = []
    }
  }

  rebuildMastery()
  nextQuestion()
  startTime.value = Date.now()
  nextTick(() => {
    initChart()
  })
})

const rebuildMastery = () => {
  const map = {}
  currentLevelList.value.forEach(item => {
    map[item.q] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  })
  history.value.forEach(record => {
    // History might contain questions from other levels or sessions
    if (!map[record.q]) {
        map[record.q] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0 }
    }
    const m = map[record.q]
    m.totalAttempts++
    m.lastSeen = record.timestamp
    if (record.correct) {
      m.totalCorrect++
      m.consecutiveCorrect++
    } else {
      m.consecutiveCorrect = 0
    }
    if (record.timestamp.split('T')[0] === todayStr.value) {
      m.todayAttempts++
      if (record.correct) m.todayCorrect++
    }
  })
  masteryMap.value = map
}

const checkLevelProgression = () => {
    const levelPool = generateQuestionPool(currentLevel.value)
    if (levelPool.length === 0) return

    // 统计当前级别的掌握情况
    const stats = levelPool.map(item => masteryMap.value[item.q] || { consecutiveCorrect: 0, todayAttempts: 0, todayCorrect: 0 })
    const masteredCount = stats.filter(s => s.consecutiveCorrect > 2).length
    const masteredRate = masteredCount / levelPool.length

    // 智能跳级逻辑：如果当日正确率极高 (>95%) 且已完成一定量，尝试提前升级
    const todayStats = statsToday.value
    const isSuperKid = todayStats.total >= 10 && parseFloat(todayStats.rate) > 95

    if ((masteredRate >= 0.6 || isSuperKid) && currentLevel.value < 12) {
        currentLevel.value++
        localStorage.setItem('math_current_level', currentLevel.value.toString())
        rebuildMastery() // Sync map with new level pool
        console.log(`恭喜！进入第 ${currentLevel.value} 级`)
    }
}

const nextQuestion = () => {
  const allAvailable = currentLevelList.value
  if (allAvailable.length === 0) return

  const isWarmUp = sessionCount.value < 3

  // 1. 错题优先 (Missed Queue)
  if (missedQueue.value.length > 0) {
      const targetQ = missedQueue.value[0]
      const targetIdx = allAvailable.findIndex(h => h.q === targetQ)
      if (targetIdx !== -1 && !recentHistory.value.includes(targetIdx)) {
          currentIndex.value = targetIdx
          selectionReason.value = '攻坚'
          return
      }
  }

  // 2. 检查当日是否已刷完 (过滤掉过于简单或过于困难的题目)
  const exhaustedPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.q] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    
    // 过于简单：今日已全对3次；或者长期连续正确超过5次（视为已完全掌握，当日不再出）
    const isTooEasy = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    // 过于困难：今日尝试超过6次且正确率极低（防止挫败感）
    const isTooHard = m.todayAttempts >= 6 && todayAcc < 0.35
    
    return isTooEasy || isTooHard
  })

  if (exhaustedPool.length >= allAvailable.length) {
    sessionFinished.value = true
    return
  }

  // 3. 定义动态窗口
  const remainingPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.q] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    return !((m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.todayAttempts >= 5 && todayAcc >= 0.8) || (m.todayAttempts >= 6 && todayAcc < 0.4))
  })

  const windowSize = parseFloat(statsToday.value.rate) > 85 ? 12 : 6
  const workingSet = remainingPool.slice(0, windowSize)

  const weights = allAvailable.map((item, index) => {
    const m = masteryMap.value[item.q] || { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0 }
    
    if (recentHistory.value.includes(index) || (index === currentIndex.value && allAvailable.length > 1)) {
        return { index, weight: 0 }
    }

    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.todayAttempts >= 5 && todayAcc >= 0.8)
    const isFrustrated = m.todayAttempts >= 6 && todayAcc < 0.4
    if (isMastered || isFrustrated) return { index, weight: 0 }

    const isInWorkingSet = workingSet.some(w => w.q === item.q)
    let weight = 0
    let reason = '练习'

    if (isWarmUp) {
        if (m.consecutiveCorrect > 3) { weight = 100; reason = '热身' }
        else weight = 5
    } else if (isInWorkingSet) {
        weight = 100
        if (m.totalAttempts === 0) { weight *= 10; reason = '新题' }
        if (m.consecutiveCorrect === 1 && m.totalAttempts > 1) { weight *= 5; reason = '巩固' }
        if (m.todayAttempts > 0) weight *= (1 / (m.todayAttempts * 2 + 1))
    } else {
        weight = 0.5; reason = '预选'
    }

    return { index, weight, reason }
  })

  // 4. Spaced Repetition (Ebbinghaus) & Urgency Boost
  const finalWeights = weights.map(w => {
    if (w.weight <= 0) return w
    const m = masteryMap.value[allAvailable[w.index].q] || {}
    let boost = 1

    // Ebbinghaus: If not seen for a long time, boost priority
    if (m.lastSeen) {
        const hoursSince = (new Date() - new Date(m.lastSeen)) / (1000 * 3600)
        boost += Math.min(5, hoursSince / 24) // Daily urgency cap
    }

    // Accuracy Momentum: If struggling globally with this item, keep it hot
    const totalAcc = m.totalAttempts > 0 ? m.totalCorrect / m.totalAttempts : 1
    if (totalAcc < 0.5) boost *= 2

    // Fluency Boost: If the average response time is too high (> 5s), increase weight to train speed
    if (m.avgDuration > 5000) boost *= 1.5

    return { ...w, weight: w.weight * boost }
})

  let totalWeight = finalWeights.reduce((s, w) => s + (w.weight || 0), 0)
  if (totalWeight <= 0) {
      const possiblePool = finalWeights.filter(w => w.reason !== '学会了' && w.reason !== '暂缓')
      if (possiblePool.length > 0) {
        currentIndex.value = possiblePool[Math.floor(Math.random() * possiblePool.length)].index
      } else {
        currentIndex.value = Math.floor(Math.random() * allAvailable.length)
      }
      selectionReason.value = '练习'
      generateOptions()
  } else {
    let random = Math.random() * totalWeight
    for (const w of finalWeights) {
      random -= w.weight
      if (random <= 0) {
        currentIndex.value = w.index
        selectionReason.value = w.reason
        generateOptions()
        return
      }
    }
  }
}

const generateOptions = () => {
  const item = currentLevelList.value[currentIndex.value]
  if (!item) return
  const correct = item.a
  const options = new Set([correct])
  
  // 智能干扰项逻辑 (Smart Distractors)
  // 1. 邻近干扰 (±1, ±2)
  const nearOffsets = [1, -1, 2, -2]
  nearOffsets.sort(() => Math.random() - 0.5).forEach(o => {
    if (options.size < 4 && correct + o >= 0) options.add(correct + o)
  })

  // 2. 进位/退位错误干扰 (±10)
  if (options.size < 4 && correct >= 10) options.add(correct - 10)
  if (options.size < 4) options.add(correct + 10)

  // 3. 随机干扰填充
  let attempts = 0
  while (options.size < 4 && attempts < 50) {
    attempts++
    const offset = Math.floor(Math.random() * 11) - 5
    const distractor = Math.max(0, correct + offset)
    if (distractor !== correct) options.add(distractor)
  }

  // 4. 极端兜底
  const backups = [0, 1, 2, 3, 5, 8, 10, 12, 15, 20]
  for (const v of backups) {
    if (options.size >= 4) break
    options.add(v)
  }
  
  currentOptions.value = Array.from(options).sort(() => Math.random() - 0.5)
}

const recordAnswer = (userAnswer) => {
  const duration = Date.now() - startTime.value
  lastDuration.value = duration
  const item = currentLevelList.value[currentIndex.value]
  const isCorrect = userAnswer === item.a
  const record = { q: item.q, a: item.a, timestamp: new Date().toISOString(), correct: isCorrect, duration }
  
  history.value.push(record)
  localStorage.setItem('math_learning_history', JSON.stringify(history.value))
  
  if (!masteryMap.value[item.q]) {
    masteryMap.value[item.q] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  }
  const m = masteryMap.value[item.q]

  m.totalAttempts++
  m.lastSeen = record.timestamp
  
  // Update moving average for duration
  if (isCorrect) {
    m.avgDuration = m.avgDuration === 0 ? duration : (m.avgDuration * 0.7 + duration * 0.3)
    m.totalCorrect++
    m.consecutiveCorrect++
    m.todayCorrect++
    streak.value++
    missedQueue.value = missedQueue.value.filter(q => q !== item.q)
  } else {
    m.consecutiveCorrect = 0
    streak.value = 0
    if (!missedQueue.value.includes(item.q)) missedQueue.value.push(item.q)
  }
  m.todayAttempts++
  sessionCount.value++
  
  // Re-calculate level progression AFTER updating the map
  masteryMap.value = { ...masteryMap.value }
  checkLevelProgression()
  
  recentHistory.value.push(currentIndex.value)
  if (recentHistory.value.length > 5) recentHistory.value.shift()

  lastResult.value = isCorrect ? 'correct' : 'incorrect'
  showAnswer.value = true
  
  checkLevelProgression()
  updateChartData()

  setTimeout(() => {
    showAnswer.value = false
    lastResult.value = null
    nextQuestion()
    startTime.value = Date.now() // Reset timer for next question
  }, 1200)
}

// Chart.js Logic (Similar to Hanzi)
const initChart = () => {
  const el = document.getElementById('mathChart')
  if (!el) return
  const ctx = el.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: '练习量', data: [], borderColor: '#A29BFE', backgroundColor: 'rgba(162, 155, 254, 0.2)', tension: 0.4, fill: true },
        { label: '正确率 %', data: [], borderColor: '#FAB1A0', backgroundColor: 'rgba(250, 177, 160, 0.2)', tension: 0.4, fill: true, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true }, y1: { position: 'right', max: 100 } }
    }
  })
  updateChartData()
}

const updateChartData = () => {
  if (!chartInstance.value) return
  const daily = {}
  history.value.forEach(h => {
    const d = h.timestamp.split('T')[0]
    if (!daily[d]) daily[d] = { c: 0, r: 0 }
    daily[d].c++
    if (h.correct) daily[d].r++
  })

  const sortedDays = Object.keys(daily).sort().slice(-7)
  chartInstance.value.data.labels = sortedDays.map(d => d.split('-').slice(1).join('/'))
  chartInstance.value.data.datasets[0].data = sortedDays.map(d => daily[d].c)
  chartInstance.value.data.datasets[1].data = sortedDays.map(d => (daily[d].r / daily[d].c * 100).toFixed(1))
  chartInstance.value.update()
}

const historyLog = computed(() => [...history.value].reverse().slice(0, 20))

</script>

<template>
  <div class="math-container">
    <!-- Session Progress Bar -->
    <div class="session-progress-wrapper" v-if="!sessionFinished">
      <div class="progress-bar-inner" :style="{ width: sessionGoalProgress + '%' }"></div>
      <span class="progress-text">今日目标：{{ sessionGoalProgress }}%</span>
    </div>

    <div class="test-area" v-if="!sessionFinished && currentLevelList[currentIndex]">
      <!-- Streak Badge -->
      <div class="streak-badge" v-if="streak >= 3">
        🔥 {{ streak }} 连胜!
      </div>

      <!-- Question Card -->
      <div class="card-display math-card" :class="{ 'correct-anim': lastResult === 'correct', 'incorrect-anim': lastResult === 'incorrect' }">
        <div class="char-reason-tag" v-if="selectionReason && !showAnswer">{{ selectionReason }}</div>
        <div class="math-box">
          <div class="equation">{{ currentLevelList[currentIndex].q }} = ?</div>
          <div v-if="showAnswer" class="answer-overlay" :class="lastResult">
            <div class="result-val">{{ currentLevelList[currentIndex].a }}</div>
          </div>
        </div>
      </div>
      
      <!-- Multiple Choice Options -->
      <div class="options-grid" v-if="!showAnswer">
        <button 
          v-for="opt in currentOptions" 
          :key="opt" 
          class="option-btn" 
          @click="recordAnswer(opt)"
        >
          {{ opt }}
        </button>
      </div>
      <div class="controls" v-else>
        <div class="feedback-text" :class="lastResult">
          <template v-if="lastResult === 'correct'">
            {{ lastDuration < 2000 ? '⚡ 闪电般神速！' : (lastDuration < 4000 ? '🌟 算得太准啦！' : '🎉 棒极了！') }}
          </template>
          <template v-else>
            💪 别灰心，再想一想
          </template>
        </div>
      </div>
    </div>

    <!-- Daily Mission Complete -->
    <div class="test-area" v-else-if="sessionFinished">
      <div class="card-display finish-card">
        <div class="finish-content">
          <div class="finish-icon">🎋</div>
          <div class="finish-title">数学达人！</div>
          <div class="finish-desc">今日口算任务已圆满完成。</div>
          <button class="action-btn restart-btn" @click="sessionFinished = false; sessionCount = 0; nextQuestion()">
            再练一组
          </button>
        </div>
      </div>
    </div>

    <!-- Real-time Stats -->
    <div class="stats-panel glass-card" v-if="currentCharStats && !showAnswer">
      <div class="panel-header">「{{ currentCharStats.q }}」掌握情况</div>
      <div class="panel-grid">
        <div class="panel-item"><span>练习</span><b>{{ currentCharStats.todayAttempts }}</b></div>
        <div class="panel-item"><span>正确</span><b>{{ currentCharStats.todayCorrect }}</b></div>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card glass-card">
        <div class="sum-title">今日口算</div>
        <div class="sum-val">{{ statsToday.total }}</div>
      </div>
      <div class="summary-card glass-card">
        <div class="sum-title">正确率</div>
        <div class="sum-val">{{ statsToday.rate }}%</div>
      </div>
    </div>

    <!-- History -->
    <div class="history-log glass-card">
      <div class="panel-header">📋 最近口算详情</div>
      <div class="log-scroll">
        <table class="log-table">
          <thead><tr><th>时间</th><th>题目</th><th>结果</th></tr></thead>
          <tbody>
            <tr v-for="(h, idx) in historyLog" :key="idx" :class="h.correct ? 'row-correct' : 'row-error'">
              <td>{{ new Date(h.timestamp).toLocaleTimeString() }}</td>
              <td>{{ h.q }} = {{ h.a }}</td>
              <td>{{ h.correct ? '✅ 正确' : '❌ 错误' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Chart -->
    <div class="chart-section glass-card">
      <div class="panel-header">📈 数学能力曲线</div>
      <div class="chart-box-inner">
        <canvas id="mathChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.math-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
}

/* Session Progress Indicator */
.session-progress-wrapper {
  width: 100%;
  height: 12px;
  background: rgba(162, 155, 254, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #A29BFE, #6C5CE7);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.progress-text {
  position: absolute;
  right: 10px;
  top: -20px;
  font-size: 0.75rem;
  color: #6C5CE7;
  font-weight: bold;
}

.streak-badge {
  background: linear-gradient(135deg, #FF9F43, #FF6B6B);
  color: white;
  padding: 4px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: -10px;
  z-index: 5;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1rem;
}

.math-card {
  width: 90%;
  max-width: 400px;
  height: 200px;
  background: white;
  border: none;
  border-radius: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 20px 45px rgba(162, 155, 254, 0.18);
  margin: 0 auto; /* Explicitly center horizontally */
}

.math-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.equation { 
  font-size: min(3.5rem, 12vw); 
  color: #333; 
  font-weight: 800;
  font-family: 'Fredoka', cursive;
}
.result-val { font-size: 5rem; color: #A29BFE; font-weight: bold; }

.char-reason-tag {
  position: absolute; 
  top: 15px; 
  left: 15px;
  background: rgba(162, 155, 254, 0.15); 
  color: #6C5CE7;
  padding: 4px 10px; 
  border-radius: 10px; 
  font-size: 0.8rem; 
  font-weight: bold;
  z-index: 10;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
  margin: 1rem auto;
}

.option-btn {
  background: white;
  border: 2px solid #F0F0FF;
  border-radius: 20px;
  padding: 1.2rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: #6C5CE7;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.option-btn:hover {
  transform: translateY(-5px);
  background: #A29BFE;
  color: white;
  border-color: #A29BFE;
  box-shadow: 0 10px 20px rgba(162, 155, 254, 0.3);
}

.option-btn:active {
  transform: scale(0.95);
}

.feedback-text { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; }
.feedback-text.correct { color: #4ECDC4; }
.feedback-text.incorrect { color: #FF9AA2; }

.stats-panel { margin-top: 1rem; }
.panel-header { font-size: 0.9rem; color: #888; margin-bottom: 0.8rem; font-weight: bold; }
.panel-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.panel-item { display: flex; flex-direction: column; }
.panel-item span { font-size: 0.75rem; color: #999; }
.panel-item b { font-size: 1.2rem; color: #333; }

.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.summary-card { text-align: center; }
.sum-title { font-size: 0.8rem; color: #888; }
.sum-val { font-size: 1.5rem; font-weight: bold; color: #333; }

.log-scroll { max-height: 200px; overflow-y: auto; }
.log-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.log-table th { text-align: left; color: #999; padding: 0.5rem; border-bottom: 1px solid #eee; }
.log-table td { padding: 0.5rem; border-bottom: 1px solid #f9f9f9; }
.row-correct { color: #4ECDC4; }
.row-error { color: #FF9AA2; }

.chart-section { height: 250px; }
.chart-box-inner { height: 180px; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes correct { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.correct-anim { animation: correct 0.5s ease-in-out; }
</style>
