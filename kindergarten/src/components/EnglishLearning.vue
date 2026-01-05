<script setup>
import { ref, onMounted, computed, watch, nextTick, shallowRef } from 'vue'

/**
 * 英语单词库 - 入门版
 * 总共500个单词，分为10个等级
 */
const wordBank = ref([]);

const currentIndex = ref(0)
const history = ref([])
const showAnswer = ref(false)
const lastResult = ref(null)
const currentLevel = ref(1)
const recentHistory = ref([])
const selectionReason = ref('')
const missedQueue = ref([]) // Queue for words missed in this session to ensure they return
const sessionCount = ref(0) // Track how many questions in this session
const sessionFinished = ref(false) // Flag for when everything is done for the day
const chartInstance = shallowRef(null)

const masteryMap = ref({})
const streak = ref(0)
const startTime = ref(null)
const lastDuration = ref(0)

const sessionGoalProgress = computed(() => {
  const all = currentLevelList.value
  if (all.length === 0) return 0
  const exhausted = all.filter(item => {
    const m = masteryMap.value[item.word] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    return (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5) || (m.todayAttempts >= 6 && todayAcc < 0.35)
  }).length
  return Math.round((exhausted / all.length) * 100)
})

const currentWord = computed(() => wordBank.value[currentIndex.value] || {})
const currentLevelList = computed(() => {
  return wordBank.value.filter(w => w.level <= currentLevel.value)
})

const todayStr = computed(() => new Date().toISOString().split('T')[0])

// Level Progress Computed
const levelProgress = computed(() => {
  const levelItems = wordBank.value.filter(w => w.level === currentLevel.value)
  if (levelItems.length === 0) return 0
  const masteredCount = levelItems.filter(w => {
    const m = masteryMap.value[w.word]
    return (m?.consecutiveCorrect || 0) > 2
  }).length
  return Math.round((masteredCount / levelItems.length) * 100)
})

onMounted(async () => {
  const savedLevel = localStorage.getItem('english_current_level')
  if (savedLevel) currentLevel.value = parseInt(savedLevel)

  // Load English Bank dynamically
  const data = await import('../data/englishBank.js')
  wordBank.value = data.wordBank

  const savedHistory = localStorage.getItem('english_learning_history')
  if (savedHistory) {
    try {
      history.value = JSON.parse(savedHistory)
    } catch (e) {
      history.value = []
    }
  }

  rebuildMastery()
  nextWord()
  startTime.value = Date.now()
  nextTick(() => {
    initChart()
  })
})

const rebuildMastery = () => {
  const map = {}
  wordBank.value.forEach(w => {
    map[w.word] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  })
  history.value.forEach(record => {
    if (map[record.word]) {
      const m = map[record.word]
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
    }
  })
  masteryMap.value = map
  checkLevelProgression()
}

const checkLevelProgression = () => {
  const levelItems = wordBank.value.filter(w => w.level === currentLevel.value)
  if (levelItems.length === 0) return

  const fullyKnownCount = levelItems.filter(h => {
    const m = masteryMap.value[h.word]
    // Sync with UI progress: mastered if consecutive correct > 2
    return (m.consecutiveCorrect || 0) > 2
  }).length

  if (fullyKnownCount >= levelItems.length * 0.8 && currentLevel.value < 10) {
    currentLevel.value++
    localStorage.setItem('english_current_level', currentLevel.value.toString())
  }
}

const recordAnswer = (isCorrect) => {
  const duration = Date.now() - startTime.value
  lastDuration.value = duration
  const word = currentLevelList.value[currentIndex.value].word
  const record = { word, timestamp: new Date().toISOString(), correct: isCorrect, duration }
  
  history.value.push(record)
  localStorage.setItem('english_learning_history', JSON.stringify(history.value))
  
  if (!masteryMap.value[word]) {
    masteryMap.value[word] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  }
  const m = masteryMap.value[word]

  m.totalAttempts++
  m.lastSeen = record.timestamp
  
  if (isCorrect) {
    m.avgDuration = m.avgDuration === 0 ? duration : (m.avgDuration * 0.7 + duration * 0.3)
    m.totalCorrect++
    m.consecutiveCorrect++
    m.todayCorrect++
    streak.value++
    missedQueue.value = missedQueue.value.filter(c => c !== word)
  } else {
    m.consecutiveCorrect = 0
    streak.value = 0
    if (!missedQueue.value.includes(word)) {
      missedQueue.value.push(word)
    }
  }
  m.todayAttempts++
  sessionCount.value++
  
  masteryMap.value = { ...masteryMap.value }
  checkLevelProgression()
  updateChartData()

  recentHistory.value.push(currentIndex.value)
  if (recentHistory.value.length > 5) recentHistory.value.shift()

  lastResult.value = isCorrect ? 'correct' : 'incorrect'
  showAnswer.value = true
  
  checkLevelProgression()
  updateChartData()

  setTimeout(() => {
    showAnswer.value = false
    lastResult.value = null
    nextWord()
    startTime.value = Date.now() // Reset timer for next question
  }, 1200)
}

const nextWord = () => {
  const allAvailable = currentLevelList.value
  if (allAvailable.length === 0) return

  // Adaptive Strategy:
  // 1. Warm-up Phase: Show easy reviews
  // 2. Urgent Recovery: Return missed words after a short gap
  // 3. Core Phase: Focus on the "Active Window"
  
  const isWarmUp = sessionCount.value < 4
  
  // Detect global exhaustion for the day (skip too easy or too hard)
  const exhaustedPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.word] || { todayAttempts: 0, todayCorrect: 0, consecutiveCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    
    // 已经学会了（今日掌握或长期掌握）
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5) || (m.todayAttempts >= 6 && todayAcc < 0.35)
    // 挫败感保护：测试次数较多但正确率极低，当天放弃检测
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    
    return isMastered || isTooHard
  })

  if (exhaustedPool.length >= allAvailable.length) {
    sessionFinished.value = true
    return
  }

  // Logic to pick from Missed Queue (only if not too hard/frustrated)
  if (missedQueue.value.length > 0) {
    const targetWord = missedQueue.value[0]
    const m = masteryMap.value[targetWord] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    
    // 如果该错题已经处于“气馁”状态，将其移出队列
    if (isTooHard) {
        missedQueue.value = missedQueue.value.filter(c => c !== targetWord)
    } else {
        const targetIdx = allAvailable.findIndex(h => h.word === targetWord)
        if (targetIdx !== -1 && !recentHistory.value.includes(targetIdx)) {
          currentIndex.value = targetIdx
          selectionReason.value = '克服困难'
          return
        }
    }
  }

  // Define Working Window
  const remainingPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.word] || { todayAttempts: 0, todayCorrect: 0, consecutiveCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    return !isMastered && !isTooHard
  })
  
  const currentSessionAcc = parseFloat(statsToday.value.rate)
  const windowSize = currentSessionAcc > 90 ? 10 : (currentSessionAcc < 60 ? 4 : 7)
  const workingSet = remainingPool.slice(0, windowSize)

  const weights = allAvailable.map((item, index) => {
    const m = masteryMap.value[item.word] || { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0 }
    
    // Stage 0: Absolute Blockers (History & Session Protection)
    if (recentHistory.value.includes(index) || (index === currentIndex.value && allAvailable.length > 1)) {
      return { index, weight: 0, reason: '' }
    }

    // Stage 1: Intelligence Blockers (Strict Graduation & Fatigue)
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)

    if (isMastered) return { index, weight: 0, reason: '学会了' }
    if (isTooHard) return { index, weight: 0, reason: '暂缓' }

    // Stage 2: Weighting Logic
    const isInWorkingSet = workingSet.some(w => w.word === item.word)
    let weight = 0
    let reason = '复习'

    if (isWarmUp) {
      if (m.consecutiveCorrect > 4) {
        weight = 100
        reason = '热身'
      } else {
        weight = 5
      }
    } else {
      if (isInWorkingSet) {
        weight = 100
        
        const sessionAcc = parseFloat(statsToday.value.rate) / 100
        const pacingMultiplier = sessionAcc < 0.7 ? 0.5 : 1.0

        if (m.totalAttempts === 0) {
          weight *= (15 * pacingMultiplier)
          reason = '初见'
        }
        
        if (m.consecutiveCorrect === 1 && m.totalAttempts > 1) {
          weight *= 4
          reason = '巩固'
        }

        const totalAcc = m.totalAttempts > 0 ? m.totalCorrect / m.totalAttempts : 1
        if (totalAcc < 0.6) {
          weight *= 8
          reason = '攻坚'
        }

        if (m.todayAttempts > 0) {
          weight *= (1 / (m.todayAttempts * 1.5 + 1))
        }
      } else {
        weight = 0.2
        reason = '预见'
      }
    }

    return { index, weight, reason }
  })

  // 4. Spaced Repetition (Ebbinghaus) & Urgency Boost
  const finalWeights = weights.map(w => {
    if (w.weight <= 0) return w
    const m = masteryMap.value[allAvailable[w.index].word] || {}
    let boost = 1

    // Ebbinghaus Urgency
    if (m.lastSeen) {
      const hoursSince = (new Date() - new Date(m.lastSeen)) / (1000 * 3600)
      boost += Math.min(5, hoursSince / 12) // Faster decay for English words
    }

    // Fluency Boost: Train recognition speed
    if (m.avgDuration > 3500) boost *= 1.5

    return { ...w, weight: w.weight * boost }
  })

  let totalWeight = finalWeights.reduce((s, w) => s + w.weight, 0)

  if (totalWeight <= 0) {
    const retryWeights = finalWeights.map(w => {
      if (w.reason === '学会了' || w.reason === '暂缓') return w
      return { ...w, weight: 1 } 
    })
    const retryTotal = retryWeights.reduce((s, w) => s + w.weight, 0)
    
    if (retryTotal <= 0) {
      sessionFinished.value = true
    } else {
      let random = Math.random() * retryTotal
      for (const w of retryWeights) {
        random -= w.weight
        if (random <= 0) {
          currentIndex.value = w.index
          selectionReason.value = '收尾'
          return
        }
      }
    }
  } else {
    let random = Math.random() * totalWeight
    for (const w of finalWeights) {
      random -= w.weight
      if (random <= 0) {
        currentIndex.value = w.index
        selectionReason.value = w.reason
        return
      }
    }
  }
}

const chooseByWeight = (weights, totalWeight) => {
  let random = Math.random() * totalWeight
  for (const w of weights) {
    random -= w.weight
    if (random <= 0) {
      currentIndex.value = w.index
      return
    }
  }
}

// History aggregation
const historyLog = computed(() => {
  return [...history.value].reverse().slice(0, 30) // Show last 30
})

const dailyAggregates = computed(() => {
  const days = {}
  history.value.forEach(h => {
    const day = h.timestamp.split('T')[0]
    if (!days[day]) days[day] = { count: 0, correct: 0 }
    days[day].count++
    if (h.correct) days[day].correct++
  })
  
  // Ensure today is always in the list for the chart
  if (!days[todayStr.value]) {
    days[todayStr.value] = { count: 0, correct: 0 }
  }
  
  return days
})

const statsToday = computed(() => {
  const today = dailyAggregates.value[todayStr.value] || { count: 0, correct: 0 }
  return {
    total: today.count,
    correct: today.correct,
    rate: today.count > 0 ? ((today.correct / today.count) * 100).toFixed(1) : 0
  }
})

const currentWordStats = computed(() => {
  const list = currentLevelList.value
  if (!list[currentIndex.value]) return null
  const word = list[currentIndex.value].word
  const m = masteryMap.value[word] || { totalAttempts: 0, totalCorrect: 0, todayAttempts: 0, todayCorrect: 0 }
  return { word, ...m }
})

const initChart = () => {
  const el = document.getElementById('learningChart')
  if (!el) return
  const ctx = el.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: '学习量', data: [], borderColor: '#FF9AA2', backgroundColor: 'rgba(255, 154, 162, 0.2)', tension: 0.4, fill: true },
        { label: '正确率 %', data: [], borderColor: '#4ECDC4', backgroundColor: 'rgba(78, 205, 196, 0.2)', tension: 0.4, fill: true, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: '数量' } },
        y1: { position: 'right', beginAtZero: true, max: 100, title: { display: true, text: '正确率' } }
      }
    }
  })
  updateChartData()
}

const updateChartData = () => {
  if (!chartInstance.value) return
  const sortedDays = Object.keys(dailyAggregates.value).sort().slice(-7)
  const counts = sortedDays.map(d => dailyAggregates.value[d].count)
  const rates = sortedDays.map(d => dailyAggregates.value[d].count > 0 ? (dailyAggregates.value[d].correct / dailyAggregates.value[d].count * 100).toFixed(1) : 0)
  
  chartInstance.value.data.labels = sortedDays.map(d => d.split('-').slice(1).join('/'))
  chartInstance.value.data.datasets[0].data = counts
  chartInstance.value.data.datasets[1].data = rates
  chartInstance.value.update()
}

watch(history, () => updateChartData(), { deep: true })
</script>

<template>
  <div class="english-container">
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

      <!-- Word Card -->
      <div class="card-display" :class="{ 'correct-anim': lastResult === 'correct', 'incorrect-anim': lastResult === 'incorrect' }">
        <div class="char-reason-tag" v-if="selectionReason && !showAnswer">{{ selectionReason }}</div>
        <div class="char-level-badge" :class="{ 'current-level': currentLevelList[currentIndex].level === currentLevel }">
          L{{ currentLevelList[currentIndex].level }}
        </div>
        <div class="char-box">
          <div class="char">{{ currentLevelList[currentIndex].word }}</div>
          <div v-if="showAnswer" class="answer-overlay" :class="lastResult">
            <div class="pinyin">{{ currentLevelList[currentIndex].phonetic }}</div>
            <div class="meaning">{{ currentLevelList[currentIndex].meaning }}</div>
          </div>
        </div>
      </div>
      
      <!-- Interactive Buttons -->
      <div class="controls" v-if="!showAnswer">
        <button class="action-btn unknown" @click="recordAnswer(false)">❓ 不认识</button>
        <button class="action-btn known" @click="recordAnswer(true)">✅ 认识</button>
      </div>
      <div class="controls" v-else>
        <div class="feedback-text" :class="lastResult">
          <template v-if="lastResult === 'correct'">
            {{ lastDuration < 1500 ? '🚀 瞬间辨认！' : (lastDuration < 3000 ? '✨ 记的很牢！' : '🌟 太棒了！') }}
          </template>
          <template v-else>
            💪 加油，多看一眼
          </template>
        </div>
      </div>
    </div>

    <!-- Daily Mission Complete UI -->
    <div class="test-area" v-else-if="sessionFinished">
      <div class="card-display finish-card">
        <div class="finish-content">
          <div class="finish-icon">🏆</div>
          <div class="finish-title">今日任务达成！</div>
          <div class="finish-desc">所有待测单词已掌握或已计划休息。</div>
          <button class="action-btn restart-btn" @click="sessionFinished = false; sessionCount = 0; nextWord()">
            再次开启
          </button>
        </div>
      </div>
    </div>

    <!-- Real-time Detailed Stats for current Word -->
    <div class="stats-panel glass-card" v-if="currentWordStats && !showAnswer">
      <div class="panel-header">「{{ currentWordStats.word }}」成长档案</div>
      <div class="panel-grid">
        <div class="panel-item"><span>总次数</span><b>{{ currentWordStats.totalAttempts }}</b></div>
        <div class="panel-item"><span>总正确</span><b>{{ currentWordStats.totalCorrect }}</b></div>
        <div class="panel-item"><span>今日练习</span><b>{{ currentWordStats.todayAttempts }}</b></div>
        <div class="panel-item"><span>今日正确</span><b>{{ currentWordStats.todayCorrect }}</b></div>
      </div>
    </div>

    <!-- History Log Table -->
    <div class="history-log glass-card">
      <div class="panel-header">📋 最近答题详情</div>
      <div class="log-scroll">
        <table class="log-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>单词</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, idx) in historyLog" :key="idx" :class="h.correct ? 'row-correct' : 'row-error'">
              <td>{{ new Date(h.timestamp).toLocaleTimeString() }}</td>
              <td>{{ h.word }}</td>
              <td>{{ h.correct ? '✅ 认识' : '❌ 不认识' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Daily Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card glass-card">
        <div class="sum-title">今日答题</div>
        <div class="sum-val">{{ statsToday.total }}</div>
      </div>
      <div class="summary-card glass-card">
        <div class="sum-title">今日正确</div>
        <div class="sum-val success">{{ statsToday.correct }}</div>
      </div>
      <div class="summary-card glass-card">
        <div class="sum-title">正确率</div>
        <div class="sum-val">{{ statsToday.rate }}%</div>
      </div>
    </div>

    <!-- Trends Chart -->
    <div class="chart-section glass-card">
      <div class="panel-header">📈 学习进步曲线</div>
      <div class="chart-box-inner">
        <canvas id="learningChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.english-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 2rem;
}

/* Session Progress Indicator */
.session-progress-wrapper {
  width: 100%;
  height: 12px;
  background: rgba(255, 154, 162, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #FF9AA2, #FFB7B2);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.progress-text {
  position: absolute;
  right: 10px;
  top: -20px;
  font-size: 0.75rem;
  color: #FF9AA2;
  font-weight: bold;
}

.streak-badge {
  background: linear-gradient(135deg, #4ECDC4, #A29BFE);
  color: white;
  padding: 4px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: -10px;
  z-index: 5;
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Glass Card Style Base */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 1.2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.top-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.level-box { font-size: 1.1rem; color: #666; font-weight: bold; }
.level-box span { color: #FF9AA2; font-size: 1.6rem; }
.progress-info { font-size: 0.9rem; color: #888; }

.test-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.card-display {
  background: white;
  border-radius: 35px;
  width: 220px;
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border: 6px solid #fff;
  overflow: hidden;
  position: relative;
}

.char { font-size: 5rem; color: #333; font-weight: bold; }
.answer-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  background: rgba(255,255,255,0.96); animation: fadeIn 0.3s;
}
.answer-overlay.correct { background: rgba(226, 240, 203, 0.96); }
.answer-overlay.incorrect { background: rgba(255, 218, 193, 0.96); }
.pinyin { font-size: 2.2rem; color: #4ECDC4; font-weight: bold; }
.meaning { font-size: 1.3rem; color: #666; }

.controls { display: flex; gap: 1rem; }
.action-btn {
  padding: 0.8rem 1.6rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.2s;
}
.action-btn.known { background: #E2F0CB; color: #557A46; }
.action-btn.unknown { background: #FFDAC1; color: #8E6E5D; }
.action-btn:hover { transform: translateY(-3px); box-shadow: 0 5px 10px rgba(0,0,0,0.1); }

.panel-header { font-size: 1rem; color: #4A4A4A; font-weight: bold; margin-bottom: 0.8rem; border-left: 4px solid #FF9AA2; padding-left: 0.5rem; }

/* Detail statistics grid */
.panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.panel-item { background: rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 10px; display: flex; justify-content: space-between; font-size: 0.85rem; }
.panel-item b { color: #FF9AA2; }

/* History Log */
.history-log { max-height: 250px; display: flex; flex-direction: column; }
.log-scroll { overflow-y: auto; flex: 1; border-radius: 10px; }
.log-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.log-table th { background: rgba(0,0,0,0.03); padding: 0.5rem; text-align: left; }
.log-table td { padding: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.02); }
.row-correct { color: #557A46; }
.row-error { color: #FF6B6B; background: rgba(255, 107, 107, 0.03); }

/* Summary Cards */
.summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; }
.summary-card { padding: 0.8rem; text-align: center; }
.sum-title { font-size: 0.75rem; color: #888; margin-bottom: 0.3rem; }
.sum-val { font-size: 1.4rem; font-weight: bold; color: #4A4A4A; }
.sum-val.success { color: #4ECDC4; }

/* Chart Area */
.chart-box-inner { height: 180px; width: 100%; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.correct-anim { animation: pulse-green 0.5s; }
.incorrect-anim { animation: shake 0.5s; }
@keyframes pulse-green { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }

/* Responsive Adjustments */
@media (max-width: 500px) {
  .summary-grid { grid-template-columns: 1fr; }
  .panel-grid { grid-template-columns: 1fr; }
}

.char-level-badge {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1rem;
  color: #ccc;
  font-weight: bold;
  z-index: 10;
}
.char-level-badge.current-level {
  color: #FF9AA2;
}

.char-reason-tag {
  position: absolute;
  top: 10px;
  left: 15px;
  background: rgba(255, 154, 162, 0.15);
  color: #FF9AA2;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 10;
}

.finish-card {
  background: linear-gradient(135deg, #FF9AA2 0%, #FFB7B2 100%) !important;
  color: white;
  border: none !important;
}

.finish-content {
  text-align: center;
  padding: 20px;
}

.finish-icon {
  font-size: 4rem;
  margin-bottom: 10px;
}

.finish-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.finish-desc {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.restart-btn {
  background: white !important;
  color: #FF9AA2 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>