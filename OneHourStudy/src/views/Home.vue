<template>
  <div class="home-container">
    <h2>欢迎来到快乐学习乐园</h2>
    
    <!-- 学习模块卡片 -->
    <div class="module-grid">
      <router-link to="/chinese" class="module-card chinese">
        <div class="module-icon">📝</div>
        <h3>识字乐园</h3>
        <p>学习汉字，培养语感</p>
        <div class="module-stats" v-if="todayStats.chinese">
          今日学习: {{ formatDuration(todayStats.chinese) }}
        </div>
      </router-link>

      <router-link to="/math" class="module-card math">
        <div class="module-icon">🔢</div>
        <h3>算术乐园</h3>
        <p>趣味数学，提升思维</p>
        <div class="module-stats" v-if="todayStats.math">
          今日学习: {{ formatDuration(todayStats.math) }}
        </div>
      </router-link>

      <router-link to="/english" class="module-card english">
        <div class="module-icon">🔤</div>
        <h3>英语乐园</h3>
        <p>快乐英语，开拓视野</p>
        <div class="module-stats" v-if="todayStats.english">
          今日学习: {{ formatDuration(todayStats.english) }}
        </div>
      </router-link>

      <router-link to="/games" class="module-card games">
        <div class="module-icon">🎮</div>
        <h3>游戏乐园</h3>
        <p>趣味游戏，寓教于乐</p>
        <div class="module-stats" v-if="todayStats.games">
          今日学习: {{ formatDuration(todayStats.games) }}
        </div>
      </router-link>
    </div>

    <!-- 今日学习概览 -->
    <div class="today-overview" v-if="hasTodayRecords">
      <h3>今日学习概览</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalTodayTime }}</div>
          <div class="stat-label">总学习时长</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ completedModules }}</div>
          <div class="stat-label">完成模块数</div>
        </div>
      </div>
    </div>

    <!-- 最近学习记录 -->
    <div class="recent-records" v-if="recentRecords.length > 0">
      <h3>最近学习记录</h3>
      <div class="records-list">
        <div v-for="record in recentRecords" 
             :key="record.date" 
             class="record-item"
             :class="record.type">
          <div class="record-date">{{ formatDate(record.date) }}</div>
          <div class="record-info">
            <span class="record-type">{{ getTypeName(record.type) }}</span>
            <span class="record-duration">{{ formatDuration(record.duration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速打卡入口 -->
    <div class="quick-check-in">
      <router-link to="/check-in" class="check-in-btn">
        <span class="icon">📅</span>
        查看学习日历
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  getTodayStats, 
  getRecentRecords, 
  getTotalDuration, 
  getCompletedModules 
} from '../services/studyService'

// 学习类型定义
const typeNames = {
  chinese: '识字',
  math: '算术',
  english: '英语',
  games: '游戏'
}

// 今日学习记录
const todayStats = ref(getTodayStats())

// 最近学习记录
const recentRecords = ref(getRecentRecords())

// 计算今日总学习时长
const totalTodayTime = computed(() => {
  return formatDuration(getTotalDuration(todayStats.value))
})

// 计算今日完成的模块数
const completedModules = computed(() => {
  return getCompletedModules(todayStats.value)
})

// 检查今日是否有学习记录
const hasTodayRecords = computed(() => {
  return completedModules.value > 0
})

// 格式化时长
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}分钟`
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取类型名称
function getTypeName(type) {
  return typeNames[type] || type
}

// 更新数据
function updateData() {
  todayStats.value = getTodayStats()
  recentRecords.value = getRecentRecords()
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
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.module-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
}

.module-card:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: white;
}

.module-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.module-card h3 {
  margin: 0.5rem 0;
  color: var(--primary-color);
}

.module-card p {
  color: #666;
  margin: 0.5rem 0;
}

.module-stats {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--accent-color);
}

.today-overview {
  margin: 2rem 0;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-color);
}

.recent-records {
  margin: 2rem 0;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.record-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-date {
  font-weight: bold;
  color: var(--text-color);
}

.record-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.record-type {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  color: white;
}

.record-type.chinese {
  background-color: #4CAF50;
}

.record-type.math {
  background-color: #2196F3;
}

.record-type.english {
  background-color: #9C27B0;
}

.record-type.games {
  background-color: #FF9800;
}

.record-duration {
  color: var(--accent-color);
}

.quick-check-in {
  text-align: center;
  margin-top: 2rem;
}

.check-in-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.check-in-btn:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
}

.icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .module-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .record-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .record-info {
    flex-direction: column;
  }
}
</style> 