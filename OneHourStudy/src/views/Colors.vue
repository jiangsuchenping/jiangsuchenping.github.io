<template>
  <div class="colors-page">
    <h2>颜色认知</h2>
    
    <div class="color-display">
      <div 
        class="current-color" 
        :style="{ backgroundColor: currentColor.color }"
        :class="{ 'animate': isAnimating }"
      >
        <span class="color-name">{{ currentColor.name }}</span>
      </div>
    </div>

    <div class="controls">
      <button @click="previousColor" class="control-btn" :disabled="currentIndex <= 0">
        上一个
      </button>
      <button @click="playColorSound" class="control-btn play-btn">
        播放声音
      </button>
      <button @click="nextColor" class="control-btn" :disabled="currentIndex >= colors.length - 1">
        下一个
      </button>
    </div>

    <div class="color-grid">
      <button 
        v-for="(color, index) in colors" 
        :key="color.name"
        @click="selectColor(index)"
        class="color-btn"
        :style="{ backgroundColor: color.color }"
        :class="{ 'active': currentIndex === index }"
      >
        {{ color.name }}
      </button>
    </div>

    <div class="color-game">
      <h3>颜色配对游戏</h3>
      <div class="game-container">
        <div 
          v-for="(color, index) in shuffledColors" 
          :key="index"
          class="game-card"
          :class="{ 'flipped': flippedCards.includes(index) }"
          @click="flipCard(index)"
        >
          <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back" :style="{ backgroundColor: color.color }">
              {{ color.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const colors = [
  { name: '红色', color: '#ff0000' },
  { name: '蓝色', color: '#0000ff' },
  { name: '黄色', color: '#ffff00' },
  { name: '绿色', color: '#00ff00' },
  { name: '紫色', color: '#800080' },
  { name: '橙色', color: '#ffa500' },
  { name: '粉色', color: '#ffc0cb' },
  { name: '棕色', color: '#a52a2a' }
]

const currentIndex = ref(0)
const isAnimating = ref(false)
const flippedCards = ref([])
const matchedPairs = ref([])

const currentColor = computed(() => colors[currentIndex.value])

const shuffledColors = computed(() => {
  const pairs = [...colors, ...colors]
  return pairs.sort(() => Math.random() - 0.5)
})

const selectColor = (index) => {
  currentIndex.value = index
  playAnimation()
  playColorSound()
}

const nextColor = () => {
  if (currentIndex.value < colors.length - 1) {
    currentIndex.value++
    playAnimation()
    playColorSound()
  }
}

const previousColor = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    playAnimation()
    playColorSound()
  }
}

const playAnimation = () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

const playColorSound = () => {
  // 这里可以添加播放颜色名称的音频
  const audio = new Audio(`/sounds/colors/${currentColor.value.name}.mp3`)
  audio.play().catch(error => {
    console.log('音频播放失败:', error)
  })
}

const flipCard = (index) => {
  if (flippedCards.value.length < 2 && !flippedCards.value.includes(index)) {
    flippedCards.value.push(index)
    
    if (flippedCards.value.length === 2) {
      const [first, second] = flippedCards.value
      if (shuffledColors.value[first].name === shuffledColors.value[second].name) {
        matchedPairs.value.push(first, second)
        flippedCards.value = []
      } else {
        setTimeout(() => {
          flippedCards.value = []
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>
.colors-page {
  text-align: center;
  padding: 2rem;
}

h2 {
  color: #ff6b6b;
  margin-bottom: 2rem;
}

.color-display {
  margin: 2rem 0;
}

.current-color {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.color-name {
  color: white;
  font-size: 2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.animate {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 25px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background-color: #357abd;
  transform: scale(1.05);
}

.control-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.play-btn {
  background-color: #ff6b6b;
}

.play-btn:hover {
  background-color: #ff5252;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.color-btn {
  padding: 1rem;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.color-btn:hover {
  transform: scale(1.05);
}

.color-game {
  margin-top: 3rem;
}

.game-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin: 2rem auto;
}

.game-card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.game-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-front {
  background-color: #4a90e2;
}

.card-back {
  background-color: white;
  transform: rotateY(180deg);
  color: white;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
</style> 