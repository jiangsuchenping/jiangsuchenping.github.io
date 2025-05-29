<template>
  <div class="math-container">
    <h2>算术乐园</h2>
    <div class="content">
      <div class="level-selector">
        <button 
          v-for="level in levels" 
          :key="level.id"
          :class="['level-btn', { active: currentLevel === level.id }]"
          @click="selectLevel(level.id)">
          {{ level.name }}
        </button>
      </div>

      <div class="problem-display" :class="{ 'animate': isAnimating }">
        <div class="problem">
          {{ currentProblem.num1 }} {{ currentProblem.operator }} {{ currentProblem.num2 }} = ?
        </div>
        <div class="answer-input">
          <input 
            type="number" 
            v-model="userAnswer" 
            @keyup.enter="checkAnswer"
            placeholder="输入答案"
            :disabled="showResult"
          >
        </div>
        <div v-if="showResult" class="result" :class="{ 'correct': isCorrect }">
          {{ resultMessage }}
        </div>
      </div>

      <div class="controls">
        <button @click="generateProblem" class="control-btn">
          <span class="icon">🔄</span> 新题目
        </button>
        <button @click="checkAnswer" class="control-btn" :disabled="showResult">
          <span class="icon">✓</span> 检查答案
        </button>
      </div>

      <div class="score-display">
        <div class="score">得分: {{ score }}</div>
        <div class="streak">连续正确: {{ streak }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { addStudyRecord } from '../services/studyService'

const levels = [
  { id: 1, name: '简单', maxNum: 10, operators: ['+', '-'] },
  { id: 2, name: '中等', maxNum: 20, operators: ['+', '-'] },
  { id: 3, name: '挑战', maxNum: 50, operators: ['+', '-', '*'] }
]

const currentLevel = ref(1)
const currentProblem = ref({
  num1: 0,
  num2: 0,
  operator: '+',
  answer: 0
})
const userAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const isAnimating = ref(false)
const score = ref(0)
const streak = ref(0)
const startTime = ref(0)

function selectLevel(levelId) {
  currentLevel.value = levelId
  generateProblem()
}

function generateProblem() {
  const level = levels.find(l => l.id === currentLevel.value)
  const num1 = Math.floor(Math.random() * level.maxNum) + 1
  const num2 = Math.floor(Math.random() * level.maxNum) + 1
  const operator = level.operators[Math.floor(Math.random() * level.operators.length)]
  
  let answer
  switch (operator) {
    case '+':
      answer = num1 + num2
      break
    case '-':
      // 确保结果为正数
      if (num1 < num2) {
        [num1, num2] = [num2, num1]
      }
      answer = num1 - num2
      break
    case '*':
      answer = num1 * num2
      break
  }

  currentProblem.value = { num1, num2, operator, answer }
  userAnswer.value = ''
  showResult.value = false
  playAnimation()
}

function checkAnswer() {
  if (showResult.value) return
  
  const answer = parseInt(userAnswer.value)
  isCorrect.value = answer === currentProblem.value.answer
  showResult.value = true
  
  if (isCorrect.value) {
    score.value += 10
    streak.value++
  } else {
    streak.value = 0
  }
  
  playAnimation()
}

function playAnimation() {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

const resultMessage = computed(() => {
  if (!showResult.value) return ''
  return isCorrect.value ? '答对了！' : `答错了，正确答案是 ${currentProblem.value.answer}`
})

// 组件挂载时
onMounted(() => {
  startTime.value = Date.now()
})

// 组件卸载时
onUnmounted(() => {
  // 计算学习时长（秒）
  const duration = Math.floor((Date.now() - startTime.value) / 1000)
  if (duration > 0) {
    addStudyRecord('math', duration)
  }
})

// 初始化第一道题目
generateProblem()
</script>

<style scoped>
.math-container {
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

.level-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.level-btn {
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.level-btn:hover {
  background-color: var(--primary-color);
  color: white;
}

.level-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.problem-display {
  text-align: center;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.problem-display.animate {
  animation: bounce 0.5s ease;
}

.problem {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.answer-input {
  margin: 1rem 0;
}

.answer-input input {
  font-size: 2rem;
  width: 150px;
  text-align: center;
  padding: 0.5rem;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
}

.result {
  font-size: 1.5rem;
  margin-top: 1rem;
  color: var(--accent-color);
}

.result.correct {
  color: #4CAF50;
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

.score-display {
  display: flex;
  gap: 2rem;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .problem {
    font-size: 2rem;
  }

  .answer-input input {
    font-size: 1.5rem;
    width: 120px;
  }

  .controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .score-display {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style> 