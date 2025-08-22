# 历史记录功能扩展指南

本文档说明如何为其他练习类型添加历史记录功能，基于已实现的通用架构。

## 🎉 已实现的练习类型

目前系统已经实现了以下练习类型，可作为参考：

1. **加法练习** (`addition`)：数学加法运算练习
2. **减法练习** (`subtraction`)：数学减法运算练习
3. **识字测试** (`character`)：语文汉字拼音测试

每种练习类型都包含完整的功能：
- 随机题目生成
- 四选一选择题形式
- 今日统计和累计统计
- 智能历史记录系统
- 可展开的详细记录表格

## 🏗️ 架构概述

历史记录系统采用模块化设计，核心包含：

1. **数据结构**：每种练习类型独立的历史记录和统计数据
2. **通用方法**：`recordPracticeAnswer()` 和 `clearPracticeHistory()`
3. **界面组件**：可复用的统计卡片和历史记录表格
4. **存储机制**：localStorage 自动保存和加载

## 📝 添加新练习类型的步骤

### 步骤1：定义数据结构

```javascript
// 例如：减法练习
const subtractionHistory = reactive({});

// 今日统计数据
const subtractionStats = reactive({
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  accuracy: 0
});

// 今日记录（动态筛选）
const subtractionTodayHistory = reactive({});

// 累计统计数据
const subtractionAllTimeStats = reactive({
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  accuracy: 0
});
```

### 步骤2：创建保存和加载方法

```javascript
// 保存减法练习历史记录
const saveSubtractionHistory = () => {
  localStorage.setItem('subtractionHistory', JSON.stringify(subtractionHistory));
  localStorage.setItem('subtractionStats', JSON.stringify(subtractionStats));
};

// 加载减法练习历史记录
const loadSubtractionHistory = () => {
  const savedHistory = localStorage.getItem('subtractionHistory');

  if (savedHistory) {
    const parsedHistory = JSON.parse(savedHistory);
    Object.assign(subtractionHistory, parsedHistory);
  }

  // 加载完成后计算今日和累计统计
  calculateSubtractionStats();
};

// 计算减法练习统计数据
const calculateSubtractionStats = () => {
  let todayCorrect = 0, todayWrong = 0, todayTotal = 0;
  let allTimeCorrect = 0, allTimeWrong = 0, allTimeTotal = 0;

  // 清空今日历史记录
  Object.keys(subtractionTodayHistory).forEach(key => delete subtractionTodayHistory[key]);

  // 遍历所有历史记录
  Object.entries(subtractionHistory).forEach(([question, record]) => {
    // 累计所有时间的统计
    allTimeCorrect += record.correct;
    allTimeWrong += record.wrong;
    allTimeTotal += record.correct + record.wrong;

    // 筛选今日的记录
    if (isToday(record.lastTime)) {
      subtractionTodayHistory[question] = { ...record };
      todayCorrect += record.correct;
      todayWrong += record.wrong;
      todayTotal += record.correct + record.wrong;
    }
  });

  // 更新今日统计
  subtractionStats.totalQuestions = todayTotal;
  subtractionStats.correctAnswers = todayCorrect;
  subtractionStats.wrongAnswers = todayWrong;
  subtractionStats.accuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;

  // 更新累计统计
  subtractionAllTimeStats.totalQuestions = allTimeTotal;
  subtractionAllTimeStats.correctAnswers = allTimeCorrect;
  subtractionAllTimeStats.wrongAnswers = allTimeWrong;
  subtractionAllTimeStats.accuracy = allTimeTotal > 0 ? Math.round((allTimeCorrect / allTimeTotal) * 100) : 0;
};
```

### 步骤3：扩展通用方法

```javascript
// 在 recordPracticeAnswer 方法中添加新的 case
case 'subtraction':
  history = subtractionHistory;
  stats = subtractionStats;
  saveFunction = saveSubtractionHistory;
  break;

// 在 clearPracticeHistory 方法中添加新的 case
case 'subtraction':
  Object.keys(subtractionHistory).forEach(key => delete subtractionHistory[key]);
  subtractionStats.totalQuestions = 0;
  subtractionStats.correctAnswers = 0;
  subtractionStats.wrongAnswers = 0;
  subtractionStats.accuracy = 0;
  saveSubtractionHistory();
  break;
```

### 步骤4：创建专用记录方法

```javascript
// 减法练习专用的记录方法
const recordSubtractionAnswer = (answer) => {
  const question = `${subtractionQuestion.a} - ${subtractionQuestion.b}`;
  const correctAnswer = subtractionQuestion.a - subtractionQuestion.b;
  recordPracticeAnswer('subtraction', question, answer, correctAnswer);
};
```

### 步骤5：添加界面组件

```html
<!-- 减法练习页面 -->
<div class="tab-pane fade" 
     :class="{ 'show active': activeMathTab === 'subtraction' }" 
     id="subtraction" 
     role="tabpanel">
  <h3 class="mt-3">减法练习</h3>
  
  <!-- 练习区域 -->
  <div class="practice-area">
    <!-- 题目和选项 -->
  </div>
  
  <!-- 统计卡片 -->
  <div class="stats-section mt-5">
    <h4 class="mb-3">
      <i class="bi bi-graph-up"></i> 练习统计
    </h4>
    <div class="row">
      <div class="col-md-3 col-6 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body text-center">
            <h5>总题数</h5>
            <h3>{{ subtractionStats.totalQuestions }}</h3>
          </div>
        </div>
      </div>
      <!-- 其他统计卡片... -->
    </div>
  </div>
  
  <!-- 历史记录区域 -->
  <div class="history-section mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">
        <i class="bi bi-clock-history"></i> 答题历史
      </h4>
      <div>
        <button class="btn btn-outline-primary btn-sm me-2" 
                @click="toggleHistoryExpanded">
          <i class="bi" :class="historyExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          {{ historyExpanded ? '收起' : '展开' }}详细记录
        </button>
        <button class="btn btn-outline-warning btn-sm" 
                @click="clearPracticeHistory('subtraction')"
                v-if="Object.keys(subtractionHistory).length > 0">
          <i class="bi bi-trash"></i> 清空
        </button>
      </div>
    </div>
    
    <!-- 简要统计和详细记录表格... -->
  </div>
</div>
```

### 步骤6：更新组件返回值

```javascript
return {
  // 现有返回值...
  subtractionHistory,
  subtractionStats,
  recordSubtractionAnswer,
  // 其他方法...
};
```

### 步骤7：初始化加载

```javascript
onMounted(() => {
  // 现有初始化...
  loadSubtractionHistory(); // 添加新的加载方法
});
```

## 🎯 完整示例：数数练习

以下是为数数练习添加历史记录的完整示例：

```javascript
// 1. 数据结构
const countingHistory = reactive({});
const countingStats = reactive({
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  accuracy: 0
});

// 2. 存储方法
const saveCountingHistory = () => {
  localStorage.setItem('countingHistory', JSON.stringify(countingHistory));
  localStorage.setItem('countingStats', JSON.stringify(countingStats));
};

const loadCountingHistory = () => {
  const savedHistory = localStorage.getItem('countingHistory');
  const savedStats = localStorage.getItem('countingStats');
  
  if (savedHistory) {
    Object.assign(countingHistory, JSON.parse(savedHistory));
  }
  if (savedStats) {
    Object.assign(countingStats, JSON.parse(savedStats));
  }
};

// 3. 记录方法
const recordCountingAnswer = (answer) => {
  const question = `数一数：${countingQuestion.count}个`;
  const correctAnswer = countingQuestion.count;
  recordPracticeAnswer('counting', question, answer, correctAnswer);
};

// 4. 在现有方法中添加支持
// recordPracticeAnswer 中添加 case 'counting'
// clearPracticeHistory 中添加 case 'counting'
```

## 🔧 最佳实践

1. **命名规范**：使用一致的命名模式（如 `practiceTypeHistory`, `practiceTypeStats`）
2. **数据隔离**：每种练习类型使用独立的存储键名
3. **错误处理**：在加载历史记录时添加 try-catch 处理
4. **性能优化**：大量数据时考虑分页或虚拟滚动
5. **用户体验**：保持界面一致性，使用相同的样式和交互模式

## 📊 数据结构说明

### 历史记录格式
```javascript
{
  "3 + 5": {
    correct: 2,      // 正确次数
    wrong: 1,        // 错误次数
    lastTime: "2024-12-19T10:30:00.000Z"  // 最后答题时间
  }
}
```

### 统计数据格式
```javascript
{
  totalQuestions: 10,    // 总题数
  correctAnswers: 8,     // 答对次数
  wrongAnswers: 2,       // 答错次数
  accuracy: 80          // 正确率（百分比）
}
```

通过遵循这个扩展指南，可以轻松为任何新的练习类型添加完整的历史记录功能。
