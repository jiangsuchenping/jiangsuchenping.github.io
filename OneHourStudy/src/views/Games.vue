<template>
  <div class="games-container">
    <h2>趣味游戏</h2>
    <div class="game-grid">
      <div v-for="game in games" 
           :key="game.id" 
           class="game-card"
           @click="startGame(game.id)">
        <div class="game-icon">{{ game.icon }}</div>
        <h3>{{ game.name }}</h3>
        <p>{{ game.description }}</p>
      </div>
    </div>

    <!-- 华容道游戏 -->
    <div v-if="currentGame === 'klotski'" class="game-container">
      <div class="game-header">
        <h3>华容道</h3>
        <div class="game-stats">
          <div class="moves">移动次数: {{ klotskiMoves }}</div>
          <div class="time">时间: {{ formatTime(klotskiTime) }}</div>
        </div>
      </div>
      <div class="klotski-grid">
        <div v-for="(piece, index) in klotskiPieces" 
             :key="index"
             class="klotski-piece"
             :class="{ 'empty': piece === 0 }"
             @click="moveKlotskiPiece(index)">
          {{ piece === 0 ? '' : piece }}
        </div>
      </div>
      <div class="game-controls">
        <button @click="resetKlotskiGame" class="reset-btn">重新开始</button>
      </div>
      <div v-if="isKlotskiWin" class="win-message">
        恭喜你成功完成！
      </div>
    </div>

    <!-- 节奏游戏 -->
    <div v-if="currentGame === 'rhythm'" class="game-container">
      <div class="game-header">
        <h3>节奏游戏</h3>
        <div class="score">得分: {{ rhythmScore }}</div>
      </div>
      <div class="rhythm-grid">
        <div v-for="(beat, index) in beats" 
             :key="index"
             class="rhythm-beat"
             :class="{ 'active': currentBeat === index }">
        </div>
      </div>
      <button @click="toggleRhythmGame" class="control-btn">
        {{ isPlaying ? '暂停' : '开始' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { addStudyRecord } from '../services/studyService'

const games = [
  {
    id: 'klotski',
    name: '华容道',
    description: '移动方块，完成拼图',
    icon: '🧩'
  },
  {
    id: 'rhythm',
    name: '节奏游戏',
    description: '跟着节奏，培养乐感',
    icon: '🎵'
  }
]

// 游戏状态
const currentGame = ref(null)
const canvas = ref(null)
const ctx = ref(null)
const isDrawing = ref(false)
const currentColor = ref('#000000')
const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
const startTime = ref(0)

// 华容道游戏状态
const klotskiPieces = ref([])
const klotskiMoves = ref(0)
const klotskiTime = ref(0)
const isKlotskiWin = ref(false)
let klotskiTimer = null

// 节奏游戏状态
const beats = ref(Array(8).fill(false))
const currentBeat = ref(-1)
const isPlaying = ref(false)
const rhythmScore = ref(0)
let rhythmInterval = null

// 初始化华容道游戏
function initKlotskiGame() {
  klotskiPieces.value = [1, 2, 3, 4, 5, 6, 7, 8, 0]
  klotskiMoves.value = 0
  klotskiTime.value = 0
  isKlotskiWin.value = false
  
  // 随机打乱方块
  for (let i = klotskiPieces.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[klotskiPieces.value[i], klotskiPieces.value[j]] = 
      [klotskiPieces.value[j], klotskiPieces.value[i]]
  }
  
  // 启动计时器
  if (klotskiTimer) clearInterval(klotskiTimer)
  klotskiTimer = setInterval(() => {
    klotskiTime.value++
  }, 1000)
}

// 华容道游戏函数
function moveKlotskiPiece(index) {
  if (isKlotskiWin.value) return
  
  const emptyIndex = klotskiPieces.value.indexOf(0)
  const row = Math.floor(index / 3)
  const emptyRow = Math.floor(emptyIndex / 3)
  const col = index % 3
  const emptyCol = emptyIndex % 3

  if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
    [klotskiPieces.value[index], klotskiPieces.value[emptyIndex]] = 
      [klotskiPieces.value[emptyIndex], klotskiPieces.value[index]]
    klotskiMoves.value++
    
    // 检查是否完成
    checkKlotskiWin()
  }
}

// 检查华容道游戏是否胜利
function checkKlotskiWin() {
  const isWin = klotskiPieces.value.slice(0, -1).every((piece, index) => piece === index + 1)
  if (isWin) {
    isKlotskiWin.value = true
    clearInterval(klotskiTimer)
  }
}

// 重置华容道游戏
function resetKlotskiGame() {
  initKlotskiGame()
}

// 格式化时间
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

// 节奏游戏函数
function toggleRhythmGame() {
  if (isPlaying.value) {
    clearInterval(rhythmInterval)
    isPlaying.value = false
  } else {
    isPlaying.value = true
    currentBeat.value = -1
    rhythmInterval = setInterval(() => {
      currentBeat.value = (currentBeat.value + 1) % 8
      if (currentBeat.value === 0) {
        rhythmScore.value++
      }
    }, 500)
  }
}

// 游戏控制
function startGame(gameId) {
  currentGame.value = gameId
  switch (gameId) {
    case 'klotski':
      initKlotskiGame()
      break
    case 'rhythm':
      toggleRhythmGame()
      break
  }
}

// 组件挂载时
onMounted(() => {
  startTime.value = Date.now()
})

// 组件卸载时
onUnmounted(() => {
  if (rhythmInterval) {
    clearInterval(rhythmInterval)
  }
  if (klotskiTimer) {
    clearInterval(klotskiTimer)
  }
  
  // 计算学习时长（秒）
  const duration = Math.floor((Date.now() - startTime.value) / 1000)
  if (duration > 0) {
    addStudyRecord('games', duration)
  }
})
</script>

<style scoped>
.games-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.game-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--box-shadow);
}

.game-card:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: white;
}

.game-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.game-container {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--box-shadow);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* 华容道游戏样式 */
.klotski-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;
  max-width: 300px;
  margin: 0 auto 2rem;
}

.klotski-piece {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: transform 0.2s;
}

.klotski-piece:hover {
  transform: scale(1.05);
}

.klotski-piece.empty {
  background-color: transparent;
  cursor: default;
}

.game-stats {
  display: flex;
  gap: 1rem;
}

.win-message {
  text-align: center;
  color: var(--accent-color);
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 节奏游戏样式 */
.rhythm-grid {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.rhythm-beat {
  width: 50px;
  height: 50px;
  background-color: var(--primary-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.rhythm-beat.active {
  background-color: var(--accent-color);
  transform: scale(1.2);
}

.reset-btn,
.control-btn {
  display: block;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .game-grid {
    grid-template-columns: 1fr;
  }

  .klotski-grid {
    max-width: 250px;
  }

  .rhythm-beat {
    width: 40px;
    height: 40px;
  }
}
</style>