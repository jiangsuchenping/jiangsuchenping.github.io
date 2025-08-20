/**
 * 数学基础运算学习页面脚本
 * 提供加减乘除的交互式练习功能
 */

// 存储键常量
const MATH_STORAGE_KEYS = {
    PROGRESS: 'math_progress',           // 学习进度
    HISTORY: 'math_history',             // 学习历史
    SETTINGS: 'math_settings',           // 用户设置
    STATS: 'math_stats'                 // 统计数据
};

// 全局变量
let currentProblem = null;
let startTime = null;
let learningState = {
    isActive: false,
    currentCount: 0,
    correctCount: 0,
    dailyGoal: 20,
    operationType: 'mixed',
    difficulty: 'medium'
};

/**
 * 初始化页面
 */
function initPage() {
    loadSettings();
    updateProgressDisplay();
    loadHistory();
    setupEventListeners();
}

/**
 * 加载用户设置
 */
function loadSettings() {
    const settings = safeGet(MATH_STORAGE_KEYS.SETTINGS, {
        dailyGoal: 20,
        operationType: 'mixed',
        difficulty: 'medium'
    });
    
    learningState.dailyGoal = settings.dailyGoal;
    learningState.operationType = settings.operationType;
    learningState.difficulty = settings.difficulty;
    
    // 更新UI
    document.getElementById('daily-goal').textContent = settings.dailyGoal;
    document.getElementById('daily-goal-select').value = settings.dailyGoal;
    document.getElementById('operation-type').value = settings.operationType;
    document.getElementById('difficulty-level').value = settings.difficulty;
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    document.getElementById('user-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    document.getElementById('daily-goal-select').addEventListener('change', saveSettings);
    document.getElementById('operation-type').addEventListener('change', saveSettings);
    document.getElementById('difficulty-level').addEventListener('change', saveSettings);
}

/**
 * 保存用户设置
 */
function saveSettings() {
    const settings = {
        dailyGoal: parseInt(document.getElementById('daily-goal-select').value),
        operationType: document.getElementById('operation-type').value,
        difficulty: document.getElementById('difficulty-level').value
    };
    
    learningState.dailyGoal = settings.dailyGoal;
    learningState.operationType = settings.operationType;
    learningState.difficulty = settings.difficulty;
    
    safeSet(MATH_STORAGE_KEYS.SETTINGS, settings);
    updateProgressDisplay();
}

/**
 * 开始练习
 */
function startLearning() {
    learningState.isActive = true;
    learningState.currentCount = 0;
    learningState.correctCount = 0;
    
    document.getElementById('learning-area').style.display = 'block';
    document.getElementById('history-panel').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    
    generateProblem();
}

/**
 * 生成数学题
 */
function generateProblem() {
    const { operationType, difficulty } = learningState;
    const ranges = {
        easy: { min: 1, max: 10 },
        medium: { min: 1, max: 20 },
        hard: { min: 1, max: 50 }
    };
    
    const range = ranges[difficulty];
    let num1, num2, operator, answer;
    
    const ops = operationType === 'mixed' 
        ? ['+', '-', '×', '÷'] 
        : [getOperatorSymbol(operationType)];
    
    const selectedOp = ops[Math.floor(Math.random() * ops.length)];
    
    switch (selectedOp) {
        case '+':
            num1 = getRandomInt(range.min, range.max);
            num2 = getRandomInt(range.min, range.max);
            answer = num1 + num2;
            break;
        case '-':
            num1 = getRandomInt(range.min, range.max);
            num2 = getRandomInt(range.min, num1); // 确保结果为正
            answer = num1 - num2;
            break;
        case '×':
            num1 = getRandomInt(range.min, Math.min(range.max, 12));
            num2 = getRandomInt(range.min, Math.min(range.max, 12));
            answer = num1 * num2;
            break;
        case '÷':
            answer = getRandomInt(range.min, Math.min(range.max, 12));
            num2 = getRandomInt(range.min, Math.min(range.max, 12));
            num1 = answer * num2; // 确保能整除
            break;
    }
    
    currentProblem = {
        num1,
        num2,
        operator: selectedOp,
        answer,
        problem: `${num1} ${selectedOp} ${num2}`,
        timestamp: Date.now()
    };
    
    displayProblem();
    startTime = Date.now();
    
    // 清空输入框并聚焦
    const input = document.getElementById('user-answer');
    input.value = '';
    input.focus();
}

/**
 * 显示题目
 */
function displayProblem() {
    document.getElementById('num1').textContent = currentProblem.num1;
    document.getElementById('num2').textContent = currentProblem.num2;
    document.getElementById('operator').textContent = currentProblem.operator;
}

/**
 * 检查答案
 */
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('user-answer').value);
    
    if (isNaN(userAnswer)) {
        showFeedback('请输入有效的数字！', false);
        return;
    }
    
    const isCorrect = userAnswer === currentProblem.answer;
    const timeSpent = Date.now() - startTime;
    
    // 更新统计
    learningState.currentCount++;
    if (isCorrect) {
        learningState.correctCount++;
    }
    
    // 保存记录
    saveRecord({
        ...currentProblem,
        userAnswer,
        isCorrect,
        timeSpent,
        date: new Date().toISOString().split('T')[0]
    });
    
    // 显示反馈
    showFeedback(
        isCorrect 
            ? `✅ 回答正确！${currentProblem.problem} = ${currentProblem.answer}`
            : `❌ 回答错误！正确答案是 ${currentProblem.answer}`,
        isCorrect
    );
    
    updateProgressDisplay();
}

/**
 * 显示反馈
 */
function showFeedback(message, isSuccess) {
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    
    feedbackText.textContent = message;
    feedbackText.className = isSuccess ? 'success' : 'error';
    feedback.style.display = 'block';
    
    document.getElementById('learning-area').style.display = 'none';
}

/**
 * 下一题
 */
function nextProblem() {
    if (learningState.currentCount >= learningState.dailyGoal) {
        showCompletion();
        return;
    }
    
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('learning-area').style.display = 'block';
    
    generateProblem();
}

/**
 * 跳过题目
 */
function skipProblem() {
    saveRecord({
        ...currentProblem,
        userAnswer: null,
        isCorrect: false,
        timeSpent: Date.now() - startTime,
        date: new Date().toISOString().split('T')[0],
        skipped: true
    });
    
    generateProblem();
}

/**
 * 显示完成信息
 */
function showCompletion() {
    const accuracy = Math.round((learningState.correctCount / learningState.currentCount) * 100);
    
    showFeedback(
        `🎉 今日目标达成！\n共完成 ${learningState.currentCount} 题，正确率 ${accuracy}%`,
        true
    );
    
    document.getElementById('feedback').innerHTML += `
        <button class="btn btn-secondary" onclick="location.reload()">重新开始</button>
    `;
}

/**
 * 保存学习记录
 */
function saveRecord(record) {
    const history = safeGet(MATH_STORAGE_KEYS.HISTORY, []);
    history.unshift(record);
    
    // 限制历史记录数量
    if (history.length > 1000) {
        history.splice(1000);
    }
    
    safeSet(MATH_STORAGE_KEYS.HISTORY, history);
    updateStats(record);
}

/**
 * 更新统计数据
 */
function updateStats(record) {
    const stats = safeGet(MATH_STORAGE_KEYS.STATS, {
        total: 0,
        correct: 0,
        streak: 0,
        lastDate: null
    });
    
    stats.total++;
    if (record.isCorrect) {
        stats.correct++;
        if (stats.lastDate === record.date) {
            stats.streak++;
        } else {
            stats.streak = 1;
        }
    }
    stats.lastDate = record.date;
    
    safeSet(MATH_STORAGE_KEYS.STATS, stats);
}

/**
 * 更新进度显示
 */
function updateProgressDisplay() {
    const progress = safeGet(MATH_STORAGE_KEYS.PROGRESS, {
        today: 0,
        streak: 0,
        total: 0
    });
    
    document.getElementById('today-progress').textContent = progress.today || 0;
    document.getElementById('daily-goal').textContent = learningState.dailyGoal;
    
    const percentage = Math.min((progress.today / learningState.dailyGoal) * 100, 100);
    document.getElementById('progress-fill').style.width = percentage + '%';
}

/**
 * 显示学习历史
 */
function showHistory() {
    document.getElementById('learning-area').style.display = 'none';
    document.getElementById('history-panel').style.display = 'block';
    
    loadHistory();
}

/**
 * 隐藏历史记录
 */
function hideHistory() {
    document.getElementById('history-panel').style.display = 'none';
}

/**
 * 加载历史记录
 */
function loadHistory() {
    const history = safeGet(MATH_STORAGE_KEYS.HISTORY, []);
    const stats = safeGet(MATH_STORAGE_KEYS.STATS, { total: 0, correct: 0 });
    
    // 更新统计摘要
    document.getElementById('total-practice').textContent = stats.total;
    document.getElementById('accuracy-rate').textContent = 
        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) + '%' : '0%';
    
    // 计算今日完成
    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = history.filter(h => h.date === today).length;
    document.getElementById('today-completed').textContent = todayCompleted;
    
    // 更新历史表格
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    
    history.slice(0, 20).forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.problem}</td>
            <td>${record.userAnswer ?? '跳过'}</td>
            <td class="${record.isCorrect ? 'correct' : 'incorrect'}">
                ${record.isCorrect ? '✅' : '❌'}
            </td>
            <td>${record.timeSpent ? Math.round(record.timeSpent / 1000) + 's' : '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * 重置进度
 */
function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
        safeSet(MATH_STORAGE_KEYS.HISTORY, []);
        safeSet(MATH_STORAGE_KEYS.STATS, {
            total: 0,
            correct: 0,
            streak: 0,
            lastDate: null
        });
        safeSet(MATH_STORAGE_KEYS.PROGRESS, {
            today: 0,
            streak: 0,
            total: 0
        });
        
        loadHistory();
        updateProgressDisplay();
    }
}

/**
 * 获取运算符符号
 */
function getOperatorSymbol(operationType) {
    const symbols = {
        addition: '+',
        subtraction: '-',
        multiplication: '×',
        division: '÷'
    };
    return symbols[operationType] || '+';
}

/**
 * 获取随机整数
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 安全获取本地存储
 */
function safeGet(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('读取本地存储失败:', e);
        return defaultValue;
    }
}

/**
 * 安全设置本地存储
 */
function safeSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('写入本地存储失败:', e);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);