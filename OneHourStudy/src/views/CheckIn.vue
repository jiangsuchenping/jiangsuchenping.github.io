<template>
  <div class="check-in-container">
    <h2>学习打卡</h2>
    
    <!-- 日历头部 -->
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn">
        <span class="icon">◀</span>
      </button>
      <h3>{{ currentYearMonth }}</h3>
      <button @click="nextMonth" class="nav-btn">
        <span class="icon">▶</span>
      </button>
    </div>

    <!-- 星期标题 -->
    <div class="weekdays">
      <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <div v-for="(day, index) in calendarDays" 
           :key="index"
           class="calendar-day"
           :class="{
             empty: !day.date,
             today: isToday(day.date),
             'has-record': day.date && hasRecord(day.date)
           }">
        <div class="day-number">{{ day.dayNumber }}</div>
        <div v-if="day.date && hasRecord(day.date)" class="day-records">
          <div v-for="(duration, type) in getDayStudyRecords(day.date)" 
               :key="type"
               class="record-item"
               :class="type">
            {{ getTypeName(type) }}: {{ formatDuration(duration) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 图例说明 -->
    <div class="legend">
      <div class="legend-item" v-for="(name, type) in typeNames" :key="type">
        <span class="color-dot" :class="type"></span>
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  getAllRecords, 
  getTodayString 
} from '../services/studyService'

// 学习类型定义
const typeNames = {
  chinese: '识字',
  math: '算术',
  english: '英语',
  games: '游戏'
}

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 当前日期
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYearMonth = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`
})

// 学习记录数据
const studyRecords = ref(getAllRecords())

// 获取某天的记录
function getDayStudyRecords(date) {
  const dateStr = formatDate(date)
  return studyRecords.value[dateStr] || {}
}

// 检查某天是否有记录
function hasRecord(date) {
  const dateStr = formatDate(date)
  return !!studyRecords.value[dateStr]
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

// 格式化时长
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}分钟`
}

// 获取类型名称
function getTypeName(type) {
  return typeNames[type] || type
}

// 检查是否是今天
function isToday(date) {
  return date && formatDate(date) === getTodayString()
}

// 计算日历数据
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // 获取当月第一天
  const firstDay = new Date(year, month, 1)
  // 获取当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取当月第一天是星期几
  const firstDayWeek = firstDay.getDay()
  
  // 生成日历数据
  const days = []
  
  // 填充上月剩余日期
  for (let i = 0; i < firstDayWeek; i++) {
    days.push({ date: null, dayNumber: '' })
  }
  
  // 填充当月日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      dayNumber: i
    })
  }
  
  return days
})

// 切换月份
function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// 更新数据
function updateData() {
  studyRecords.value = getAllRecords()
}

// 监听数据更新事件
function handleRecordUpdate() {
  updateData()
}

// 组件挂载时
onMounted(() => {
  updateData()
  window.addEventListener('study-record-updated', handleRecordUpdate)
})

// 组件卸载时
onUnmounted(() => {
  window.removeEventListener('study-record-updated', handleRecordUpdate)
})
</script>

<style scoped>
.check-in-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--primary-color);
  transition: transform 0.2s ease;
}

.nav-btn:hover {
  transform: scale(1.1);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: var(--primary-color);
  padding: 0.5rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 100px;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-day.empty {
  background-color: #f8f9fa;
}

.calendar-day.today {
  border: 2px solid var(--primary-color);
}

.calendar-day.has-record {
  background-color: #f0f7ff;
}

.day-number {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.day-records {
  font-size: 0.9rem;
}

.record-item {
  margin-bottom: 0.3rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: white;
}

.record-item.chinese {
  background-color: #4CAF50;
}

.record-item.math {
  background-color: #2196F3;
}

.record-item.english {
  background-color: #9C27B0;
}

.record-item.games {
  background-color: #FF9800;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.color-dot.chinese {
  background-color: #4CAF50;
}

.color-dot.math {
  background-color: #2196F3;
}

.color-dot.english {
  background-color: #9C27B0;
}

.color-dot.games {
  background-color: #FF9800;
}

@media (max-width: 768px) {
  .check-in-container {
    padding: 1rem;
  }

  .calendar-day {
    min-height: 80px;
    font-size: 0.9rem;
  }

  .day-records {
    font-size: 0.8rem;
  }

  .record-item {
    padding: 0.1rem 0.3rem;
  }
}
</style> 