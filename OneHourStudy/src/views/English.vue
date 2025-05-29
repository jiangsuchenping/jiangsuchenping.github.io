<template>
  <div class="english-container">
    <h2>英语乐园</h2>
    <div class="content">
      <div class="category-selector">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: currentCategory === category.id }]"
          @click="selectCategory(category.id)">
          {{ category.name }}
        </button>
      </div>

      <div class="word-display" :class="{ 'animate': isAnimating }">
        <div class="word">{{ currentWord.english }}</div>
        <div class="phonetic">[{{ currentWord.phonetic }}]</div>
        <div class="meaning">{{ currentWord.chinese }}</div>
        <div class="example" v-if="currentWord.example">
          {{ currentWord.example }}
        </div>
      </div>

      <div class="controls">
        <button @click="playSound" class="control-btn">
          <span class="icon">🔊</span> 发音
        </button>
        <button @click="previousWord" class="control-btn">
          <span class="icon">⬅️</span> 上一个
        </button>
        <button @click="nextWord" class="control-btn">
          <span class="icon">➡️</span> 下一个
        </button>
      </div>

      <div class="word-grid">
        <div v-for="(word, index) in currentCategoryWords" 
             :key="index" 
             class="word-card"
             :class="{ 'active': currentIndex === index }"
             @click="selectWord(index)">
          {{ word.english }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = [
  { id: 1, name: '动物' },
  { id: 2, name: '水果' },
  { id: 3, name: '颜色' },
  { id: 4, name: '数字' }
]

const words = {
  1: [
    { english: 'cat', phonetic: 'kæt', chinese: '猫', example: 'I have a cat.' },
    { english: 'dog', phonetic: 'dɒɡ', chinese: '狗', example: 'The dog is running.' },
    { english: 'bird', phonetic: 'bɜːd', chinese: '鸟', example: 'The bird is flying.' },
    { english: 'fish', phonetic: 'fɪʃ', chinese: '鱼', example: 'The fish is swimming.' },
    { english: 'rabbit', phonetic: 'ˈræbɪt', chinese: '兔子', example: 'The rabbit is jumping.' }
  ],
  2: [
    { english: 'apple', phonetic: 'ˈæpl', chinese: '苹果', example: 'I eat an apple.' },
    { english: 'banana', phonetic: 'bəˈnɑːnə', chinese: '香蕉', example: 'The banana is yellow.' },
    { english: 'orange', phonetic: 'ˈɒrɪndʒ', chinese: '橙子', example: 'The orange is sweet.' },
    { english: 'grape', phonetic: 'ɡreɪp', chinese: '葡萄', example: 'I like grapes.' },
    { english: 'strawberry', phonetic: 'ˈstrɔːbəri', chinese: '草莓', example: 'The strawberry is red.' }
  ],
  3: [
    { english: 'red', phonetic: 'red', chinese: '红色', example: 'The apple is red.' },
    { english: 'blue', phonetic: 'bluː', chinese: '蓝色', example: 'The sky is blue.' },
    { english: 'green', phonetic: 'ɡriːn', chinese: '绿色', example: 'The grass is green.' },
    { english: 'yellow', phonetic: 'ˈjeləʊ', chinese: '黄色', example: 'The sun is yellow.' },
    { english: 'purple', phonetic: 'ˈpɜːpl', chinese: '紫色', example: 'The grape is purple.' }
  ],
  4: [
    { english: 'one', phonetic: 'wʌn', chinese: '一', example: 'I have one apple.' },
    { english: 'two', phonetic: 'tuː', chinese: '二', example: 'I have two hands.' },
    { english: 'three', phonetic: 'θriː', chinese: '三', example: 'I have three books.' },
    { english: 'four', phonetic: 'fɔː', chinese: '四', example: 'I have four pencils.' },
    { english: 'five', phonetic: 'faɪv', chinese: '五', example: 'I have five fingers.' }
  ]
}

const currentCategory = ref(1)
const currentIndex = ref(0)
const isAnimating = ref(false)

const currentCategoryWords = computed(() => words[currentCategory.value])
const currentWord = computed(() => currentCategoryWords.value[currentIndex.value])

function selectCategory(categoryId) {
  currentCategory.value = categoryId
  currentIndex.value = 0
  playAnimation()
}

function selectWord(index) {
  currentIndex.value = index
  playAnimation()
}

function nextWord() {
  if (currentIndex.value < currentCategoryWords.value.length - 1) {
    currentIndex.value++
    playAnimation()
  }
}

function previousWord() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    playAnimation()
  }
}

function playAnimation() {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

function playSound() {
  // 这里可以添加播放发音的功能
  playAnimation()
}
</script>

<style scoped>
.english-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.category-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.category-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.word-display {
  text-align: center;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.word-display.animate {
  animation: bounce 0.5s ease;
}

.word {
  font-size: 4rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.phonetic {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.meaning {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.example {
  font-size: 1.2rem;
  color: var(--accent-color);
  font-style: italic;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
}

.icon {
  font-size: 1.4rem;
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
}

.word-card {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: all 0.3s ease;
}

.word-card:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: white;
}

.word-card.active {
  background-color: var(--accent-color);
  color: white;
}

@media (max-width: 768px) {
  .word {
    font-size: 3rem;
  }

  .phonetic {
    font-size: 1.2rem;
  }

  .meaning {
    font-size: 1.5rem;
  }

  .example {
    font-size: 1rem;
  }

  .controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .word-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style> 