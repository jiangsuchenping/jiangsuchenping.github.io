// 学习记录管理服务
const STORAGE_KEY = 'study_records'

// 获取所有学习记录
export function getAllRecords() {
  const records = localStorage.getItem(STORAGE_KEY)
  return records ? JSON.parse(records) : {}
}

// 保存所有学习记录
export function saveAllRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

// 获取今天的日期字符串 (YYYY-MM-DD)
export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

// 获取指定日期的记录
export function getDayRecords(date) {
  const records = getAllRecords()
  return records[date] || {}
}

// 添加学习记录
export function addStudyRecord(type, duration) {
  const today = getTodayString()
  const records = getAllRecords()
  
  // 获取今天的记录
  const todayRecords = records[today] || {}
  
  // 更新或添加新的学习时长
  todayRecords[type] = (todayRecords[type] || 0) + duration
  
  // 保存更新后的记录
  records[today] = todayRecords
  saveAllRecords(records)
  
  // 触发自定义事件，通知其他组件数据已更新
  window.dispatchEvent(new CustomEvent('study-record-updated', {
    detail: { type, duration, date: today }
  }))
}

// 获取最近的学习记录
export function getRecentRecords(limit = 5) {
  const records = getAllRecords()
  const dates = Object.keys(records).sort().reverse()
  const recentRecords = []
  
  dates.forEach(date => {
    const dayRecords = records[date]
    Object.entries(dayRecords).forEach(([type, duration]) => {
      recentRecords.push({
        date,
        type,
        duration
      })
    })
  })
  
  return recentRecords.slice(0, limit)
}

// 获取今日学习统计
export function getTodayStats() {
  const today = getTodayString()
  return getDayRecords(today)
}

// 获取总学习时长
export function getTotalDuration(records) {
  return Object.values(records).reduce((sum, duration) => sum + duration, 0)
}

// 获取完成的模块数
export function getCompletedModules(records) {
  return Object.keys(records).length
} 