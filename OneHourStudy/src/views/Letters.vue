<template>
  <div class="letters-page">
    <h2>字母学习</h2>
    
    <div class="letter-display">
      <div class="current-letter" :class="{ 'animate': isAnimating }">
        {{ currentLetter }}
      </div>
      <div class="letter-example">
        {{ letterExample }}
      </div>
    </div>

    <div class="controls">
      <button @click="previousLetter" class="control-btn" :disabled="currentIndex <= 0">
        上一个
      </button>
      <button @click="playLetterSound" class="control-btn play-btn">
        播放声音
      </button>
      <button @click="nextLetter" class="control-btn" :disabled="currentIndex >= letters.length - 1">
        下一个
      </button>
    </div>

    <div class="letter-grid">
      <button 
        v-for="(letter, index) in letters" 
        :key="letter.letter"
        @click="selectLetter(index)"
        class="letter-btn"
        :class="{ 'active': currentIndex === index }"
      >
        {{ letter.letter }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const letters = [
  { letter: 'A', example: '苹果 (Apple)' },
  { letter: 'B', example: '香蕉 (Banana)' },
  { letter: 'C', example: '猫 (Cat)' },
  { letter: 'D', example: '狗 (Dog)' },
  { letter: 'E', example: '大象 (Elephant)' },
  { letter: 'F', example: '鱼 (Fish)' },
  { letter: 'G', example: '长颈鹿 (Giraffe)' },
  { letter: 'H', example: '房子 (House)' },
  { letter: 'I', example: '冰淇淋 (Ice cream)' },
  { letter: 'J', example: '果汁 (Juice)' },
  { letter: 'K', example: '风筝 (Kite)' },
  { letter: 'L', example: '狮子 (Lion)' },
  { letter: 'M', example: '猴子 (Monkey)' },
  { letter: 'N', example: '鼻子 (Nose)' },
  { letter: 'O', example: '橙子 (Orange)' },
  { letter: 'P', example: '熊猫 (Panda)' },
  { letter: 'Q', example: '女王 (Queen)' },
  { letter: 'R', example: '兔子 (Rabbit)' },
  { letter: 'S', example: '太阳 (Sun)' },
  { letter: 'T', example: '老虎 (Tiger)' },
  { letter: 'U', example: '雨伞 (Umbrella)' },
  { letter: 'V', example: '蔬菜 (Vegetable)' },
  { letter: 'W', example: '水 (Water)' },
  { letter: 'X', example: '盒子 (Box)' },
  { letter: 'Y', example: '黄色 (Yellow)' },
  { letter: 'Z', example: '斑马 (Zebra)' }
]

const currentIndex = ref(0)
const isAnimating = ref(false)

const currentLetter = computed(() => letters[currentIndex.value].letter)
const letterExample = computed(() => letters[currentIndex.value].example)

const selectLetter = (index) => {
  currentIndex.value = index
  playAnimation()
  playLetterSound()
}

const nextLetter = () => {
  if (currentIndex.value < letters.length - 1) {
    currentIndex.value++
    playAnimation()
    playLetterSound()
  }
}

const previousLetter = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    playAnimation()
    playLetterSound()
  }
}

const playAnimation = () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

const playLetterSound = () => {
  // 这里可以添加播放字母发音的音频
  const audio = new Audio(`/sounds/letters/${currentLetter.value.toLowerCase()}.mp3`)
  audio.play().catch(error => {
    console.log('音频播放失败:', error)
  })
}
</script>

<style scoped>
.letters-page {
  text-align: center;
  padding: 2rem;
}

h2 {
  color: #ff6b6b;
  margin-bottom: 2rem;
}

.letter-display {
  margin: 2rem 0;
}

.current-letter {
  font-size: 8rem;
  font-weight: bold;
  color: #4a90e2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.letter-example {
  font-size: 1.5rem;
  color: #666;
  margin-top: 1rem;
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

.letter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.letter-btn {
  font-size: 2rem;
  padding: 1rem;
  border: 2px solid #4a90e2;
  border-radius: 10px;
  background-color: white;
  color: #4a90e2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.letter-btn:hover {
  background-color: #e3f2fd;
  transform: scale(1.05);
}

.letter-btn.active {
  background-color: #4a90e2;
  color: white;
}
</style> 