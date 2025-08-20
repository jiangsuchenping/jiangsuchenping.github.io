/**
 * 识字学习页面JavaScript
 * 专门处理汉字学习的独立页面逻辑
 */

// 存储键常量
const CHINESE_CHARS_STORAGE = {
    PRACTICE_DATA: 'chinese_characters_practice_data',
    DAILY_GOAL: 'chinese_characters_daily_goal',
    CURRENT_INDEX: 'chinese_characters_current_index'
};

// 当前学习状态
let learningState = {
    currentCharacter: null,
    isLearning: false,
    todayLearned: 0,
    dailyGoal: 10,
    shuffledChars: []
};

/**
 * 初始化识字学习页面
 */
function initChineseCharactersPage() {
    loadDailyGoal();
    updateProgressDisplay();
    setupEventListeners();
    
    // 准备学习数据
    prepareLearningData();
}

/**
 * 准备学习数据
 */
function prepareLearningData() {
    if (!window.COMMON_CHARACTERS || !window.PINYIN_MAP) {
        console.error('汉字数据未加载');
        return;
    }
    
    // 从原始数据构建学习用的汉字对象
    const characters = window.COMMON_CHARACTERS.split('').map((char, index) => ({
        id: index,
        char: char,
        pinyin: window.PINYIN_MAP[char] || '未知',
        meaning: `常用汉字「${char}」`,
        example: `这是一个包含「${char}」的例句。`
    }));
    
    // 创建打乱的学习列表
    learningState.shuffledChars = [...characters];
    shuffleArray(learningState.shuffledChars);
}

/**
 * 加载每日目标
 */
function loadDailyGoal() {
    const savedGoal = localStorage.getItem(CHINESE_CHARS_STORAGE.DAILY_GOAL);
    if (savedGoal) {
        learningState.dailyGoal = parseInt(savedGoal);
        document.getElementById('daily-goal-select').value = savedGoal;
    }
    document.getElementById('daily-goal').textContent = learningState.dailyGoal;
}

/**
 * 更新进度显示
 */
function updateProgressDisplay() {
    const today = new Date().toISOString().split('T')[0];
    const practiceData = JSON.parse(localStorage.getItem(CHINESE_CHARS_STORAGE.PRACTICE_DATA) || '{}');
    
    let todayCount = 0;
    if (practiceData[today]) {
        todayCount = Object.keys(practiceData[today]).length;
    }
    
    learningState.todayLearned = todayCount;
    document.getElementById('today-progress').textContent = todayCount;
    
    const percentage = Math.min((todayCount / learningState.dailyGoal) * 100, 100);
    document.getElementById('progress-fill').style.width = percentage + '%';
    
    // 更新首页进度
    if (window.HomeUtils) {
        HomeUtils.incrementProgress('chinese_characters_practice_data', todayCount);
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 每日目标选择
    document.getElementById('daily-goal-select').addEventListener('change', function(e) {
        learningState.dailyGoal = parseInt(e.target.value);
        localStorage.setItem(CHINESE_CHARS_STORAGE.DAILY_GOAL, learningState.dailyGoal);
        document.getElementById('daily-goal').textContent = learningState.dailyGoal;
        updateProgressDisplay();
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (!learningState.isLearning) return;
        
        if (e.key === '1' || e.key === 'y' || e.key === 'Y') {
            handleAnswer(true);
        } else if (e.key === '2' || e.key === 'n' || e.key === 'N') {
            handleAnswer(false);
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (document.getElementById('feedback').style.display !== 'none') {
                nextCharacter();
            }
        }
    });
}

/**
 * 开始学习
 */
function startLearning() {
    if (learningState.todayLearned >= learningState.dailyGoal) {
        alert(`恭喜！今日学习目标 ${learningState.dailyGoal} 个汉字已完成！`);
        return;
    }
    
    if (learningState.shuffledChars.length === 0) {
        prepareLearningData();
    }
    
    learningState.isLearning = true;
    document.getElementById('learning-area').style.display = 'block';
    document.getElementById('history-panel').style.display = 'none';
    
    nextCharacter();
}

/**
 * 显示下一个汉字
 */
function nextCharacter() {
    if (learningState.todayLearned >= learningState.dailyGoal) {
        completeLearning();
        return;
    }
    
    // 获取下一个汉字
    const currentIndex = parseInt(localStorage.getItem(CHINESE_CHARS_STORAGE.CURRENT_INDEX) || '0');
    
    if (currentIndex >= learningState.shuffledChars.length) {
        // 重新开始一轮
        prepareLearningData();
        localStorage.setItem(CHINESE_CHARS_STORAGE.CURRENT_INDEX, '0');
    }
    
    const character = learningState.shuffledChars[currentIndex];
    learningState.currentCharacter = character;
    
    // 显示汉字
    document.getElementById('current-character').textContent = character.char;
    document.getElementById('current-pinyin').textContent = character.pinyin;
    document.getElementById('current-meaning').textContent = character.meaning;
    document.getElementById('current-example').textContent = `例：${character.example}`;
    
    // 隐藏反馈区域
    document.getElementById('feedback').style.display = 'none';
    
    // 启用答案按钮
    const buttons = document.querySelectorAll('.answer-buttons .btn');
    buttons.forEach(btn => btn.disabled = false);
}

/**
 * 处理答案
 * @param {boolean} isCorrect - 是否正确
 */
function handleAnswer(isCorrect) {
    if (!learningState.currentCharacter) return;
    
    const char = learningState.currentCharacter;
    const today = new Date().toISOString().split('T')[0];
    
    // 更新练习数据
    const practiceData = JSON.parse(localStorage.getItem(CHINESE_CHARS_STORAGE.PRACTICE_DATA) || '{}');
    if (!practiceData[today]) {
        practiceData[today] = {};
    }
    
    if (!practiceData[today][char.id]) {
        practiceData[today][char.id] = {
            char: char.char,
            attempts: 0,
            correct: 0
        };
    }
    
    practiceData[today][char.id].attempts++;
    if (isCorrect) {
        practiceData[today][char.id].correct++;
    }
    
    localStorage.setItem(CHINESE_CHARS_STORAGE.PRACTICE_DATA, JSON.stringify(practiceData));
    
    // 更新学习计数
    if (isCorrect && practiceData[today][char.id].correct === 1) {
        learningState.todayLearned++;
    }
    
    // 显示反馈
    showFeedback(isCorrect, char);
    
    // 更新进度
    updateProgressDisplay();
    
    // 禁用答案按钮
    const buttons = document.querySelectorAll('.answer-buttons .btn');
    buttons.forEach(btn => btn.disabled = true);
    
    // 移动到下一个索引
    const currentIndex = parseInt(localStorage.getItem(CHINESE_CHARS_STORAGE.CURRENT_INDEX) || '0');
    localStorage.setItem(CHINESE_CHARS_STORAGE.CURRENT_INDEX, (currentIndex + 1).toString());
}

/**
 * 显示反馈
 * @param {boolean} isCorrect - 是否正确
 * @param {Object} character - 汉字信息
 */
function showFeedback(isCorrect, character) {
    const feedbackDiv = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    
    if (isCorrect) {
        feedbackText.innerHTML = `
            <div style="color: #28a745; font-size: 1.2rem; margin-bottom: 1rem;">
                ✅ 正确！你认识「${character.char}」！
            </div>
            <div>拼音：${character.pinyin}</div>
            <div>含义：${character.meaning}</div>
        `;
    } else {
        feedbackText.innerHTML = `
            <div style="color: #dc3545; font-size: 1.2rem; margin-bottom: 1rem;">
                ❌ 再试试看！
            </div>
            <div>汉字：${character.char}</div>
            <div>拼音：${character.pinyin}</div>
            <div>含义：${character.meaning}</div>
            <div>例句：${character.example}</div>
        `;
    }
    
    feedbackDiv.style.display = 'block';
}

/**
 * 完成学习
 */
function completeLearning() {
    learningState.isLearning = false;
    document.getElementById('learning-area').style.display = 'none';
    
    // 显示完成消息
    alert(`🎉 恭喜完成今日学习目标！共学习了 ${learningState.todayLearned} 个汉字。`);
    
    // 更新首页进度
    if (window.HomeUtils) {
        HomeUtils.incrementProgress('chinese_characters_practice_data', learningState.todayLearned);
    }
}

/**
 * 显示学习历史
 */
function showHistory() {
    document.getElementById('learning-area').style.display = 'none';
    document.getElementById('history-panel').style.display = 'block';
    
    loadHistoryData();
}

/**
 * 隐藏学习历史
 */
function hideHistory() {
    document.getElementById('history-panel').style.display = 'none';
}

/**
 * 加载历史数据
 */
function loadHistoryData() {
    const practiceData = JSON.parse(localStorage.getItem(CHINESE_CHARS_STORAGE.PRACTICE_DATA) || '{}');
    
    // 计算统计数据
    let totalLearned = 0;
    let totalCorrect = 0;
    let totalAttempts = 0;
    let todayCompleted = 0;
    
    const today = new Date().toISOString().split('T')[0];
    
    if (practiceData[today]) {
        todayCompleted = Object.keys(practiceData[today]).length;
    }
    
    Object.keys(practiceData).forEach(date => {
        const dayData = practiceData[date];
        Object.keys(dayData).forEach(charId => {
            const charData = dayData[charId];
            totalLearned++;
            totalCorrect += charData.correct;
            totalAttempts += charData.attempts;
        });
    });
    
    // 更新统计显示
    document.getElementById('total-learned').textContent = totalLearned;
    document.getElementById('today-completed').textContent = todayCompleted;
    
    const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    document.getElementById('accuracy-rate').textContent = accuracyRate + '%';
    
    // 填充历史表格
    populateHistoryTable(practiceData);
}

/**
 * 填充历史表格
 * @param {Object} practiceData - 练习数据
 */
function populateHistoryTable(practiceData) {
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    
    // 按日期倒序排序
    const sortedDates = Object.keys(practiceData).sort().reverse();
    
    sortedDates.forEach(date => {
        const dayData = practiceData[date];
        Object.keys(dayData).forEach(charId => {
            const charData = dayData[charId];
            const row = document.createElement('tr');
            
            const formattedDate = new Date(date).toLocaleDateString('zh-CN');
            const result = charData.correct >= charData.attempts ? '✅ 掌握' : '❌ 学习中';
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${charData.char}</td>
                <td>${result}</td>
                <td>${charData.correct}/${charData.attempts}</td>
            `;
            
            tbody.appendChild(row);
        });
    });
}

/**
 * 重置学习进度
 */
function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
        localStorage.removeItem(CHINESE_CHARS_STORAGE.PRACTICE_DATA);
        localStorage.removeItem(CHINESE_CHARS_STORAGE.CURRENT_INDEX);
        
        // 重置显示
        learningState.todayLearned = 0;
        updateProgressDisplay();
        
        // 隐藏学习区域
        document.getElementById('learning-area').style.display = 'none';
        document.getElementById('history-panel').style.display = 'none';
        
        alert('学习进度已重置！');
    }
}

/**
 * 打乱数组
 * @param {Array} array - 要打乱的数组
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initChineseCharactersPage);