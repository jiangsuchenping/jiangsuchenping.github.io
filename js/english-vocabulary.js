/**
 * 英语词汇学习页面脚本
 * 提供单词认读、拼写、翻译等多种学习模式
 */

// 存储键常量
const ENGLISH_STORAGE_KEYS = {
    PROGRESS: 'english_progress',           // 学习进度
    HISTORY: 'english_history',           // 学习历史
    SETTINGS: 'english_settings',         // 用户设置
    WORDS: 'english_words',               // 单词数据
    MASTERY: 'english_mastery'            // 掌握情况
};

// 单词数据库
const WORD_DATABASE = {
    words: [
        { english: 'hello', chinese: '你好', phonetic: '/həˈloʊ/', image: 'hello.jpg' },
        { english: 'world', chinese: '世界', phonetic: '/wɜːld/', image: 'world.jpg' },
        { english: 'book', chinese: '书', phonetic: '/bʊk/', image: 'book.jpg' },
        { english: 'school', chinese: '学校', phonetic: '/skuːl/', image: 'school.jpg' },
        { english: 'friend', chinese: '朋友', phonetic: '/frend/', image: 'friend.jpg' },
        { english: 'family', chinese: '家庭', phonetic: '/ˈfæməli/', image: 'family.jpg' },
        { english: 'water', chinese: '水', phonetic: '/ˈwɔːtər/', image: 'water.jpg' },
        { english: 'food', chinese: '食物', phonetic: '/fuːd/', image: 'food.jpg' },
        { english: 'house', chinese: '房子', phonetic: '/haʊs/', image: 'house.jpg' },
        { english: 'tree', chinese: '树', phonetic: '/triː/', image: 'tree.jpg' }
    ],
    animals: [
        { english: 'cat', chinese: '猫', phonetic: '/kæt/', image: 'cat.jpg' },
        { english: 'dog', chinese: '狗', phonetic: '/dɔːɡ/', image: 'dog.jpg' },
        { english: 'bird', chinese: '鸟', phonetic: '/bɜːrd/', image: 'bird.jpg' },
        { english: 'fish', chinese: '鱼', phonetic: '/fɪʃ/', image: 'fish.jpg' },
        { english: 'rabbit', chinese: '兔子', phonetic: '/ˈræbɪt/', image: 'rabbit.jpg' },
        { english: 'elephant', chinese: '大象', phonetic: '/ˈelɪfənt/', image: 'elephant.jpg' },
        { english: 'lion', chinese: '狮子', phonetic: '/ˈlaɪən/', image: 'lion.jpg' },
        { english: 'tiger', chinese: '老虎', phonetic: '/ˈtaɪɡər/', image: 'tiger.jpg' },
        { english: 'monkey', chinese: '猴子', phonetic: '/ˈmʌŋki/', image: 'monkey.jpg' },
        { english: 'panda', chinese: '熊猫', phonetic: '/ˈpændə/', image: 'panda.jpg' }
    ],
    colors: [
        { english: 'red', chinese: '红色', phonetic: '/red/', image: 'red.jpg' },
        { english: 'blue', chinese: '蓝色', phonetic: '/bluː/', image: 'blue.jpg' },
        { english: 'green', chinese: '绿色', phonetic: '/ɡriːn/', image: 'green.jpg' },
        { english: 'yellow', chinese: '黄色', phonetic: '/ˈjeləʊ/', image: 'yellow.jpg' },
        { english: 'orange', chinese: '橙色', phonetic: '/ˈɒrɪndʒ/', image: 'orange.jpg' },
        { english: 'purple', chinese: '紫色', phonetic: '/ˈpɜːpl/', image: 'purple.jpg' },
        { english: 'black', chinese: '黑色', phonetic: '/blæk/', image: 'black.jpg' },
        { english: 'white', chinese: '白色', phonetic: '/waɪt/', image: 'white.jpg' },
        { english: 'pink', chinese: '粉色', phonetic: '/pɪŋk/', image: 'pink.jpg' },
        { english: 'brown', chinese: '棕色', phonetic: '/braʊn/', image: 'brown.jpg' }
    ],
    numbers: [
        { english: 'one', chinese: '一', phonetic: '/wʌn/', image: 'one.jpg' },
        { english: 'two', chinese: '二', phonetic: '/tuː/', image: 'two.jpg' },
        { english: 'three', chinese: '三', phonetic: '/θriː/', image: 'three.jpg' },
        { english: 'four', chinese: '四', phonetic: '/fɔːr/', image: 'four.jpg' },
        { english: 'five', chinese: '五', phonetic: '/faɪv/', image: 'five.jpg' },
        { english: 'six', chinese: '六', phonetic: '/sɪks/', image: 'six.jpg' },
        { english: 'seven', chinese: '七', phonetic: '/ˈsevn/', image: 'seven.jpg' },
        { english: 'eight', chinese: '八', phonetic: '/eɪt/', image: 'eight.jpg' },
        { english: 'nine', chinese: '九', phonetic: '/naɪn/', image: 'nine.jpg' },
        { english: 'ten', chinese: '十', phonetic: '/ten/', image: 'ten.jpg' }
    ]
};

// 全局变量
let currentWord = null;
let currentWords = [];
let currentIndex = 0;
let startTime = null;
let learningState = {
    isActive: false,
    type: 'mixed',
    mode: 'spelling',
    dailyGoal: 10,
    completed: 0,
    correct: 0
};

/**
 * 初始化页面
 */
function initPage() {
    loadSettings();
    loadWords();
    updateProgressDisplay();
    setupEventListeners();
}

/**
 * 加载用户设置
 */
function loadSettings() {
    const settings = safeGet(ENGLISH_STORAGE_KEYS.SETTINGS, {
        type: 'mixed',
        mode: 'spelling',
        dailyGoal: 10
    });
    
    learningState.type = settings.type;
    learningState.mode = settings.mode;
    learningState.dailyGoal = settings.dailyGoal;
    
    // 更新UI
    document.getElementById('daily-goal').textContent = settings.dailyGoal;
    document.getElementById('daily-goal-select').value = settings.dailyGoal;
    document.getElementById('learning-type').value = settings.type;
    document.getElementById('learning-mode').value = settings.mode;
}

/**
 * 加载单词数据
 */
function loadWords() {
    const savedWords = safeGet(ENGLISH_STORAGE_KEYS.WORDS, null);
    if (!savedWords) {
        // 首次加载，初始化单词数据
        safeSet(ENGLISH_STORAGE_KEYS.WORDS, WORD_DATABASE);
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    document.getElementById('daily-goal-select').addEventListener('change', saveSettings);
    document.getElementById('learning-type').addEventListener('change', saveSettings);
    document.getElementById('learning-mode').addEventListener('change', saveSettings);
}

/**
 * 保存用户设置
 */
function saveSettings() {
    const settings = {
        type: document.getElementById('learning-type').value,
        mode: document.getElementById('learning-mode').value,
        dailyGoal: parseInt(document.getElementById('daily-goal-select').value)
    };
    
    learningState.type = settings.type;
    learningState.mode = settings.mode;
    learningState.dailyGoal = settings.dailyGoal;
    
    safeSet(ENGLISH_STORAGE_KEYS.SETTINGS, settings);
    updateProgressDisplay();
}

/**
 * 开始学习
 */
function startLearning() {
    learningState.isActive = true;
    learningState.completed = 0;
    learningState.correct = 0;
    
    // 获取当前单词列表
    const words = safeGet(ENGLISH_STORAGE_KEYS.WORDS, WORD_DATABASE);
    const type = learningState.type;
    
    if (type === 'mixed') {
        // 混合所有类别
        currentWords = [
            ...words.words,
            ...words.animals,
            ...words.colors,
            ...words.numbers
        ].sort(() => Math.random() - 0.5);
    } else {
        currentWords = words[type] || [];
    }
    
    currentIndex = 0;
    
    document.getElementById('learning-area').style.display = 'block';
    document.getElementById('history-panel').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    
    showCurrentWord();
}

/**
 * 显示当前单词
 */
function showCurrentWord() {
    if (currentIndex >= currentWords.length || currentIndex >= learningState.dailyGoal) {
        showCompletion();
        return;
    }
    
    currentWord = currentWords[currentIndex];
    startTime = Date.now();
    
    const mode = learningState.mode;
    
    // 根据模式设置显示内容
    switch (mode) {
        case 'recognition':
            showRecognitionMode();
            break;
        case 'spelling':
            showSpellingMode();
            break;
        case 'translation':
            showTranslationMode();
            break;
    }
    
    // 清空输入框并聚焦
    const input = document.getElementById('user-input');
    input.value = '';
    input.focus();
}

/**
 * 显示认读模式
 */
function showRecognitionMode() {
    document.getElementById('english-word').textContent = currentWord.english;
    document.getElementById('chinese-meaning').textContent = '请说出中文意思';
    document.getElementById('phonetic').textContent = currentWord.phonetic;
    document.getElementById('word-image').innerHTML = `<div class="placeholder-image">${currentWord.english}</div>`;
    document.getElementById('user-input').placeholder = '请输入中文意思';
}

/**
 * 显示拼写模式
 */
function showSpellingMode() {
    document.getElementById('english-word').textContent = '???';
    document.getElementById('chinese-meaning').textContent = currentWord.chinese;
    document.getElementById('phonetic').textContent = '请拼写英文单词';
    document.getElementById('word-image').innerHTML = `<div class="placeholder-image">${currentWord.chinese}</div>`;
    document.getElementById('user-input').placeholder = '请输入英文单词';
}

/**
 * 显示翻译模式
 */
function showTranslationMode() {
    document.getElementById('english-word').textContent = currentWord.chinese;
    document.getElementById('chinese-meaning').textContent = '请翻译成英文';
    document.getElementById('phonetic').textContent = currentWord.phonetic;
    document.getElementById('word-image').innerHTML = `<div class="placeholder-image">翻译</div>`;
    document.getElementById('user-input').placeholder = '请输入英文单词';
}

/**
 * 播放音频
 */
function playAudio() {
    // 创建语音合成
    const utterance = new SpeechSynthesisUtterance(currentWord.english);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}

/**
 * 检查答案
 */
function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    
    if (!userInput) {
        showFeedback('请输入答案！', false);
        return;
    }
    
    const mode = learningState.mode;
    let isCorrect = false;
    let correctAnswer = '';
    
    switch (mode) {
        case 'recognition':
            isCorrect = userInput === currentWord.chinese.toLowerCase();
            correctAnswer = currentWord.chinese;
            break;
        case 'spelling':
            isCorrect = userInput === currentWord.english.toLowerCase();
            correctAnswer = currentWord.english;
            break;
        case 'translation':
            isCorrect = userInput === currentWord.english.toLowerCase();
            correctAnswer = currentWord.english;
            break;
    }
    
    const timeSpent = Date.now() - startTime;
    
    // 更新统计
    learningState.completed++;
    if (isCorrect) {
        learningState.correct++;
    }
    
    // 保存记录
    saveRecord({
        word: currentWord.english,
        chinese: currentWord.chinese,
        userInput,
        isCorrect,
        mode,
        timeSpent,
        date: new Date().toISOString().split('T')[0]
    });
    
    // 更新掌握情况
    updateMastery(currentWord.english, isCorrect);
    
    // 显示反馈
    showFeedback(
        isCorrect 
            ? `✅ 回答正确！`
            : `❌ 回答错误！正确答案是：${correctAnswer}`,
        isCorrect,
        correctAnswer
    );
    
    updateProgressDisplay();
}

/**
 * 显示反馈
 */
function showFeedback(message, isSuccess, correctAnswer = '') {
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackDetails = document.getElementById('feedback-details');
    
    feedbackText.textContent = message;
    feedbackText.className = isSuccess ? 'success' : 'error';
    
    // 显示详细信息
    feedbackDetails.innerHTML = `
        <div class="word-details">
            <strong>${currentWord.english}</strong> - ${currentWord.chinese}
            <br>
            <em>${currentWord.phonetic}</em>
        </div>
    `;
    
    feedback.style.display = 'block';
    
    document.getElementById('learning-area').style.display = 'none';
}

/**
 * 显示提示
 */
function showHint() {
    const mode = learningState.mode;
    let hint = '';
    
    switch (mode) {
        case 'recognition':
            hint = `提示：中文意思是 ${currentWord.chinese}`;
            break;
        case 'spelling':
            hint = `提示：英文单词是 ${'*'.repeat(currentWord.english.length - 1)}${currentWord.english.slice(-1)}`;
            break;
        case 'translation':
            hint = `提示：英文单词是 ${currentWord.english.slice(0, 1)}${'*'.repeat(currentWord.english.length - 1)}`;
            break;
    }
    
    showFeedback(hint, false, currentWord.english);
}

/**
 * 下一个单词
 */
function nextWord() {
    currentIndex++;
    
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('learning-area').style.display = 'block';
    
    showCurrentWord();
}

/**
 * 显示完成信息
 */
function showCompletion() {
    const accuracy = Math.round((learningState.correct / learningState.completed) * 100);
    
    showFeedback(
        `🎉 今日学习完成！\n共学习 ${learningState.completed} 个单词，正确率 ${accuracy}%`,
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
    const history = safeGet(ENGLISH_STORAGE_KEYS.HISTORY, []);
    history.unshift(record);
    
    // 限制历史记录数量
    if (history.length > 1000) {
        history.splice(1000);
    }
    
    safeSet(ENGLISH_STORAGE_KEYS.HISTORY, history);
    updateStats(record);
}

/**
 * 更新掌握情况
 */
function updateMastery(word, isCorrect) {
    const mastery = safeGet(ENGLISH_STORAGE_KEYS.MASTERY, {});
    
    if (!mastery[word]) {
        mastery[word] = {
            correct: 0,
            total: 0,
            streak: 0,
            lastDate: null
        };
    }
    
    mastery[word].total++;
    if (isCorrect) {
        mastery[word].correct++;
        mastery[word].streak++;
    } else {
        mastery[word].streak = 0;
    }
    mastery[word].lastDate = new Date().toISOString().split('T')[0];
    
    safeSet(ENGLISH_STORAGE_KEYS.MASTERY, mastery);
}

/**
 * 更新统计数据
 */
function updateStats(record) {
    const stats = safeGet(ENGLISH_STORAGE_KEYS.STATS, {
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
    
    safeSet(ENGLISH_STORAGE_KEYS.STATS, stats);
}

/**
 * 更新进度显示
 */
function updateProgressDisplay() {
    const progress = safeGet(ENGLISH_STORAGE_KEYS.PROGRESS, {
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
    const history = safeGet(ENGLISH_STORAGE_KEYS.HISTORY, []);
    const mastery = safeGet(ENGLISH_STORAGE_KEYS.MASTERY, {});
    const stats = safeGet(ENGLISH_STORAGE_KEYS.STATS, { total: 0, correct: 0 });
    
    // 更新统计摘要
    document.getElementById('total-words').textContent = stats.total;
    document.getElementById('mastery-rate').textContent = 
        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) + '%' : '0%';
    
    // 计算今日完成
    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = history.filter(h => h.date === today).length;
    document.getElementById('today-completed').textContent = todayCompleted;
    
    // 计算连续学习天数
    document.getElementById('streak-days').textContent = stats.streak || 0;
    
    // 更新掌握情况网格
    updateMasteryGrid(mastery);
    
    // 更新历史表格
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    
    history.slice(0, 20).forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.word} - ${record.chinese}</td>
            <td class="${record.isCorrect ? 'correct' : 'incorrect'}">
                ${record.isCorrect ? '✅' : '❌'}
            </td>
            <td>${record.mode}</td>
            <td>${record.timeSpent ? Math.round(record.timeSpent / 1000) + 's' : '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * 更新掌握情况网格
 */
function updateMasteryGrid(mastery) {
    const grid = document.getElementById('mastery-grid');
    grid.innerHTML = '';
    
    Object.entries(mastery).forEach(([word, data]) => {
        const accuracy = Math.round((data.correct / data.total) * 100);
        const level = getMasteryLevel(accuracy);
        
        const item = document.createElement('div');
        item.className = `mastery-item ${level}`;
        item.innerHTML = `
            <div class="word">${word}</div>
            <div class="accuracy">${accuracy}%</div>
            <div class="count">${data.correct}/${data.total}</div>
        `;
        
        grid.appendChild(item);
    });
}

/**
 * 获取掌握等级
 */
function getMasteryLevel(accuracy) {
    if (accuracy >= 90) return 'excellent';
    if (accuracy >= 70) return 'good';
    if (accuracy >= 50) return 'fair';
    return 'poor';
}

/**
 * 重置进度
 */
function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复。')) {
        safeSet(ENGLISH_STORAGE_KEYS.HISTORY, []);
        safeSet(ENGLISH_STORAGE_KEYS.MASTERY, {});
        safeSet(ENGLISH_STORAGE_KEYS.STATS, {
            total: 0,
            correct: 0,
            streak: 0,
            lastDate: null
        });
        safeSet(ENGLISH_STORAGE_KEYS.PROGRESS, {
            today: 0,
            streak: 0,
            total: 0
        });
        
        loadHistory();
        updateProgressDisplay();
    }
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