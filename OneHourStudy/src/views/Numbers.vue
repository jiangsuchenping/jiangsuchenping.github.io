<template>
  <div class="numbers-page">
    <h2>数字学习</h2>
    
    <div class="number-display">
      <div class="current-number" :class="{ 'animate': isAnimating }">
        {{ currentNumber }}
      </div>
    </div>

    <div class="controls">
      <button @click="previousNumber" class="control-btn" :disabled="currentNumber <= 1">
        上一个
      </button>
      <button @click="playNumberSound" class="control-btn play-btn">
        播放声音
      </button>
      <button @click="nextNumber" class="control-btn" :disabled="currentNumber >= 10">
        下一个
      </button>
    </div>

    <div class="number-grid">
      <button 
        v-for="num in 10" 
        :key="num"
        @click="selectNumber(num)"
        class="number-btn"
        :class="{ 'active': currentNumber === num }"
      >
        {{ num }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentNumber = ref(1)
const isAnimating = ref(false)

const selectNumber = (num) => {
  currentNumber.value = num
  playAnimation()
  playNumberSound()
}

const nextNumber = () => {
  if (currentNumber.value < 10) {
    currentNumber.value++
    playAnimation()
    playNumberSound()
  }
}

const previousNumber = () => {
  if (currentNumber.value > 1) {
    currentNumber.value--
    playAnimation()
    playNumberSound()
  }
}

const playAnimation = () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

const playNumberSound = () => {
  // 这里可以添加播放数字发音的音频
  const audio = new Audio(`/sounds/numbers/${currentNumber.value}.mp3`)
  audio.play().catch(error => {
    console.log('音频播放失败:', error)
  })
}
</script>

<style scoped>
.numbers-page {
  text-align: center;
  padding: 2rem;
}

h2 {
  color: #ff6b6b;
  margin-bottom: 2rem;
}

.number-display {
  margin: 2rem 0;
}

.current-number {
  font-size: 8rem;
  font-weight: bold;
  color: #4a90e2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.animate {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
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

.number-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.number-btn {
  font-size: 2rem;
  padding: 1rem;
  border: 2px solid #4a90e2;
  border-radius: 10px;
  background-color: white;
  color: #4a90e2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.number-btn:hover {
  background-color: #e3f2fd;
  transform: scale(1.05);
}

.number-btn.active {
  background-color: #4a90e2;
  color: white;
}
</style> 