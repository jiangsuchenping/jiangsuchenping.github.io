/**
 * 幼儿园中班学习APP的主要JavaScript文件
 * 包含应用的核心功能和页面导航逻辑
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
    
    // 初始化错题记录按钮事件
    const showHistoryBtn = document.getElementById('show-history-btn');
    if (showHistoryBtn) {
        showHistoryBtn.addEventListener('click', showHistoryDialog);
    }

    // 初始化汉字学习记录按钮事件
    const showChineseHistoryBtn = document.getElementById('show-chinese-history-btn');
    if (showChineseHistoryBtn) {
        showChineseHistoryBtn.addEventListener('click', showChineseHistoryDialog);
    }
});

/**
 * 初始化应用
 * 设置事件监听器并加载默认页面
 */
function initApp() {
    // 注册导航事件
    document.querySelectorAll('.nav-item a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            navigateTo(target);
        });
    });
    
    // 默认加载首页
    navigateTo('home');
    
    // 设置活跃导航项
    setActiveNavItem('home');
}

/**
 * 导航到指定页面
 * @param {string} pageId - 目标页面的ID
 */
function navigateTo(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(function(page) {
        page.style.display = 'none';
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.style.display = 'block';
        // 设置活跃导航项
        setActiveNavItem(pageId);
        
        // 如果是汉字学习页面，初始化页面
        if (pageId === 'chinese-word') {
            initChineseWordPage();
        }
    }
}

/**
 * 设置活跃的导航项
 * @param {string} itemId - 导航项的ID
 */
function setActiveNavItem(itemId) {
    // 移除所有导航项的活跃状态
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
    });
    
    // 设置目标导航项为活跃状态
    const activeItem = document.querySelector('.nav-item[data-id="' + itemId + '"]');
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

/**
 * 语文模块 - 识字功能
 */
const chineseWords = [
    // 基础汉字
    { word: '天', pinyin: 'tiān', example: '天空很蓝。' },
    { word: '地', pinyin: 'dì', example: '地上有小花。' },
    { word: '人', pinyin: 'rén', example: '人人都喜欢吃水果。' },
    { word: '你', pinyin: 'nǐ', example: '你好吗？' },
    { word: '我', pinyin: 'wǒ', example: '我喜欢画画。' },
    { word: '他', pinyin: 'tā', example: '他是我的好朋友。' },
    { word: '她', pinyin: 'tā', example: '她喜欢唱歌。' },
    { word: '爸', pinyin: 'bà', example: '爸爸很高。' },
    { word: '妈', pinyin: 'mā', example: '妈妈很漂亮。' },
    { word: '家', pinyin: 'jiā', example: '我的家很温暖。' },
    
    // 自然现象
    { word: '日', pinyin: 'rì', example: '太阳出来了。' },
    { word: '月', pinyin: 'yuè', example: '月亮很亮。' },
    { word: '星', pinyin: 'xīng', example: '星星在闪烁。' },
    { word: '云', pinyin: 'yún', example: '白云飘在天上。' },
    { word: '雨', pinyin: 'yǔ', example: '下雨了。' },
    { word: '雪', pinyin: 'xuě', example: '下雪了。' },
    { word: '风', pinyin: 'fēng', example: '风吹树叶。' },
    { word: '雷', pinyin: 'léi', example: '打雷了。' },
    
    // 自然景物
    { word: '山', pinyin: 'shān', example: '山上有很多树。' },
    { word: '水', pinyin: 'shuǐ', example: '水是无色的。' },
    { word: '火', pinyin: 'huǒ', example: '火是热的。' },
    { word: '石', pinyin: 'shí', example: '石头很硬。' },
    { word: '土', pinyin: 'tǔ', example: '土是黑色的。' },
    { word: '田', pinyin: 'tián', example: '田里种着庄稼。' },
    { word: '河', pinyin: 'hé', example: '河水在流淌。' },
    { word: '海', pinyin: 'hǎi', example: '大海很蓝。' },
    
    // 动植物
    { word: '花', pinyin: 'huā', example: '花很香。' },
    { word: '草', pinyin: 'cǎo', example: '草是绿色的。' },
    { word: '树', pinyin: 'shù', example: '树很高大。' },
    { word: '虫', pinyin: 'chóng', example: '虫子很小。' },
    { word: '鱼', pinyin: 'yú', example: '鱼在水里游。' },
    { word: '鸟', pinyin: 'niǎo', example: '鸟儿在天上飞。' },
    { word: '猫', pinyin: 'māo', example: '小猫很可爱。' },
    { word: '狗', pinyin: 'gǒu', example: '小狗在跑。' },
    { word: '鸡', pinyin: 'jī', example: '公鸡在打鸣。' },
    { word: '鸭', pinyin: 'yā', example: '小鸭在游泳。' },
    
    // 身体部位
    { word: '头', pinyin: 'tóu', example: '我的头很圆。' },
    { word: '手', pinyin: 'shǒu', example: '我的手很干净。' },
    { word: '脚', pinyin: 'jiǎo', example: '我的脚很大。' },
    { word: '眼', pinyin: 'yǎn', example: '眼睛很亮。' },
    { word: '耳', pinyin: 'ěr', example: '耳朵能听声音。' },
    { word: '口', pinyin: 'kǒu', example: '嘴巴能说话。' },
    { word: '牙', pinyin: 'yá', example: '牙齿很白。' },
    { word: '舌', pinyin: 'shé', example: '舌头能尝味道。' },
    
    // 数字
    { word: '一', pinyin: 'yī', example: '一个苹果。' },
    { word: '二', pinyin: 'èr', example: '两个小朋友。' },
    { word: '三', pinyin: 'sān', example: '三只小鸟。' },
    { word: '四', pinyin: 'sì', example: '四个季节。' },
    { word: '五', pinyin: 'wǔ', example: '五个手指。' },
    { word: '六', pinyin: 'liù', example: '六朵花。' },
    { word: '七', pinyin: 'qī', example: '七颗星星。' },
    { word: '八', pinyin: 'bā', example: '八只小鸭。' },
    { word: '九', pinyin: 'jiǔ', example: '九个月亮。' },
    { word: '十', pinyin: 'shí', example: '十个小朋友。' },
    
    // 颜色
    { word: '红', pinyin: 'hóng', example: '红色的花。' },
    { word: '黄', pinyin: 'huáng', example: '黄色的香蕉。' },
    { word: '蓝', pinyin: 'lán', example: '蓝色的天空。' },
    { word: '绿', pinyin: 'lǜ', example: '绿色的树叶。' },
    { word: '白', pinyin: 'bái', example: '白色的云。' },
    { word: '黑', pinyin: 'hēi', example: '黑色的头发。' },
    
    // 动作
    { word: '走', pinyin: 'zǒu', example: '走路要小心。' },
    { word: '跑', pinyin: 'pǎo', example: '跑步很健康。' },
    { word: '跳', pinyin: 'tiào', example: '跳得很高。' },
    { word: '坐', pinyin: 'zuò', example: '坐着看书。' },
    { word: '站', pinyin: 'zhàn', example: '站着听讲。' },
    { word: '看', pinyin: 'kàn', example: '看书学习。' },
    { word: '听', pinyin: 'tīng', example: '听老师讲课。' },
    { word: '说', pinyin: 'shuō', example: '说话要礼貌。' },
    
    // 时间
    { word: '早', pinyin: 'zǎo', example: '早上好。' },
    { word: '晚', pinyin: 'wǎn', example: '晚安。' },
    { word: '春', pinyin: 'chūn', example: '春天来了。' },
    { word: '夏', pinyin: 'xià', example: '夏天很热。' },
    { word: '秋', pinyin: 'qiū', example: '秋天很凉爽。' },
    { word: '冬', pinyin: 'dōng', example: '冬天很冷。' },
    
    // 方位
    { word: '上', pinyin: 'shàng', example: '上面有云。' },
    { word: '下', pinyin: 'xià', example: '下面有草。' },
    { word: '左', pinyin: 'zuǒ', example: '左边是树。' },
    { word: '右', pinyin: 'yòu', example: '右边是花。' },
    { word: '前', pinyin: 'qián', example: '前面是路。' },
    { word: '后', pinyin: 'hòu', example: '后面是山。' },
    
    // 学校相关
    { word: '书', pinyin: 'shū', example: '看书学习。' },
    { word: '笔', pinyin: 'bǐ', example: '用笔写字。' },
    { word: '纸', pinyin: 'zhǐ', example: '纸上画画。' },
    { word: '本', pinyin: 'běn', example: '一本故事书。' },
    { word: '字', pinyin: 'zì', example: '写字要工整。' },
    { word: '画', pinyin: 'huà', example: '画画很开心。' },
    
    // 生活用品
    { word: '桌', pinyin: 'zhuō', example: '桌子上有书。' },
    { word: '椅', pinyin: 'yǐ', example: '椅子上坐着。' },
    { word: '床', pinyin: 'chuáng', example: '床上睡觉。' },
    { word: '门', pinyin: 'mén', example: '门是关着的。' },
    { word: '窗', pinyin: 'chuāng', example: '窗户很亮。' },
    { word: '灯', pinyin: 'dēng', example: '灯很亮。' }
];

/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * 艾宾浩斯记忆法复习间隔（小时）
 * 1. 5分钟
 * 2. 30分钟
 * 3. 12小时
 * 4. 1天
 * 5. 2天
 * 6. 4天
 * 7. 7天
 * 8. 15天
 */
const EBBINGHAUS_INTERVALS = [5/60, 0.5, 12, 24, 48, 96, 168, 360];

/**
 * 汉字学习记录数据结构
 */
let chineseWordHistory = JSON.parse(localStorage.getItem('chineseWordHistory')) || {};

/**
 * 记录汉字学习情况
 * @param {string} word - 汉字
 * @param {boolean} isCorrect - 是否认识
 */
function recordChineseWord(word, isCorrect) {
    if (!chineseWordHistory[word]) {
        chineseWordHistory[word] = {
            totalAttempts: 0,
            correctAttempts: 0,
            wrongAttempts: 0,
            lastAttemptTime: null,
            reviewStage: 0,
            nextReviewTime: null
        };
    }
    
    const record = chineseWordHistory[word];
    record.totalAttempts++;
    if (isCorrect) {
        record.correctAttempts++;
        // 如果答对了，进入下一个复习阶段
        if (record.reviewStage < EBBINGHAUS_INTERVALS.length - 1) {
            record.reviewStage++;
        }
    } else {
        record.wrongAttempts++;
        // 如果答错了，回到上一个复习阶段
        if (record.reviewStage > 0) {
            record.reviewStage--;
        }
    }
    
    record.lastAttemptTime = new Date().toISOString();
    // 设置下次复习时间
    const nextInterval = EBBINGHAUS_INTERVALS[record.reviewStage];
    record.nextReviewTime = new Date(Date.now() + nextInterval * 60 * 60 * 1000).toISOString();
    
    // 保存到本地存储
    localStorage.setItem('chineseWordHistory', JSON.stringify(chineseWordHistory));
}

/**
 * 计算汉字的复习权重
 * @param {Object} record - 汉字的学习记录
 * @returns {number} - 权重分数
 */
function calculateWordWeight(record) {
    if (!record) return 100; // 未学习过的汉字给予最高权重
    
    const now = new Date();
    const nextReview = new Date(record.nextReviewTime);
    
    // 如果已经超过复习时间，权重最高
    if (now > nextReview) {
        return 100;
    }
    
    // 计算距离下次复习的时间（小时）
    const hoursUntilReview = (nextReview - now) / (1000 * 60 * 60);
    
    // 计算正确率
    const accuracy = record.correctAttempts / record.totalAttempts;
    
    // 综合权重计算
    // 1. 时间权重：距离复习时间越近，权重越高
    const timeWeight = Math.max(0, 100 - hoursUntilReview);
    
    // 2. 正确率权重：正确率越低，权重越高
    const accuracyWeight = (1 - accuracy) * 100;
    
    // 3. 复习阶段权重：阶段越低，权重越高
    const stageWeight = (EBBINGHAUS_INTERVALS.length - record.reviewStage) * 10;
    
    // 综合权重：时间权重40%，正确率权重40%，复习阶段权重20%
    return timeWeight * 0.4 + accuracyWeight * 0.4 + stageWeight * 0.2;
}

/**
 * 智能选择下一个要学习的汉字
 * @returns {Object|null} - 选中的汉字对象，如果没有需要学习的汉字则返回null
 */
function selectNextChineseWord() {
    const now = new Date();
    
    // 计算每个汉字的权重，并过滤掉未到复习时间的汉字
    const weightedWords = chineseWords
        .map(wordObj => {
            const record = chineseWordHistory[wordObj.word];
            const weight = calculateWordWeight(record);
            const nextReview = record ? new Date(record.nextReviewTime) : now;
            
            return {
                ...wordObj,
                weight,
                nextReview,
                isReadyForReview: !record || now >= nextReview
            };
        })
        .filter(word => word.isReadyForReview); // 只保留已到复习时间的汉字
    
    // 如果没有已到复习时间的汉字，返回null
    if (weightedWords.length === 0) {
        return null;
    }
    
    // 根据权重随机选择
    const totalWeight = weightedWords.reduce((sum, word) => sum + word.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const word of weightedWords) {
        random -= word.weight;
        if (random <= 0) {
            return word;
        }
    }
    
    // 如果出现意外情况，返回第一个已到复习时间的汉字
    return weightedWords[0];
}

/**
 * 获取下一次最早的学习时间
 * @returns {string} - 下一次最早的学习时间描述
 */
function getNextEarliestReviewTime() {
    const now = new Date();
    let earliestTime = null;
    
    // 遍历所有汉字记录，找出最早的下次复习时间
    Object.values(chineseWordHistory).forEach(record => {
        const nextReview = new Date(record.nextReviewTime);
        if (nextReview > now && (!earliestTime || nextReview < earliestTime)) {
            earliestTime = nextReview;
        }
    });
    
    if (!earliestTime) {
        return "现在";
    }
    
    // 计算时间差
    const diff = earliestTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}小时${minutes}分钟后`;
    } else {
        return `${minutes}分钟后`;
    }
}

/**
 * 初始化识字页面
 */
function initChineseWordPage() {
    const wordContainer = document.getElementById('word-container');
    if (!wordContainer) return;
    
    // 清空容器
    wordContainer.innerHTML = '';
    
    // 智能选择一个汉字
    const selectedWord = selectNextChineseWord();
    
    if (!selectedWord) {
        // 如果没有需要学习的汉字，显示提示信息
        const nextReviewTime = getNextEarliestReviewTime();
        wordContainer.innerHTML = `
            <div class="word-card">
                <div class="word">休息一下</div>
                <div class="pinyin">xiū xi yí xià</div>
                <div class="example">所有汉字都已经学习完成！</div>
                <div class="review-info">下次学习时间：${nextReviewTime}</div>
            </div>
        `;
        return;
    }
    
    // 创建字卡
    const wordCard = document.createElement('div');
    wordCard.className = 'word-card';
    wordCard.innerHTML = `
        <div class="word">${selectedWord.word}</div>
        <div class="pinyin">${selectedWord.pinyin}</div>
        <div class="example">${selectedWord.example}</div>
        <div class="word-buttons">
            <button class="btn know-btn" data-word="${selectedWord.word}">认识</button>
            <button class="btn dont-know-btn" data-word="${selectedWord.word}">不认识</button>
        </div>
    `;
    wordContainer.appendChild(wordCard);
    
    // 添加按钮事件
    wordCard.querySelector('.know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordChineseWord(word, true);
        showNextWord();
    });
    
    wordCard.querySelector('.dont-know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordChineseWord(word, false);
        showNextWord();
    });
}

/**
 * 显示下一个汉字
 */
function showNextWord() {
    // 清空容器
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    
    // 智能选择下一个汉字
    const selectedWord = selectNextChineseWord();
    
    if (!selectedWord) {
        // 如果没有需要学习的汉字，显示提示信息
        const nextReviewTime = getNextEarliestReviewTime();
        wordContainer.innerHTML = `
            <div class="word-card">
                <div class="word">休息一下</div>
                <div class="pinyin">xiū xi yí xià</div>
                <div class="example">所有汉字都已经学习完成！</div>
                <div class="review-info">下次学习时间：${nextReviewTime}</div>
            </div>
        `;
        return;
    }
    
    // 创建字卡
    const wordCard = document.createElement('div');
    wordCard.className = 'word-card';
    wordCard.innerHTML = `
        <div class="word">${selectedWord.word}</div>
        <div class="pinyin">${selectedWord.pinyin}</div>
        <div class="example">${selectedWord.example}</div>
        <div class="word-buttons">
            <button class="btn know-btn" data-word="${selectedWord.word}">认识</button>
            <button class="btn dont-know-btn" data-word="${selectedWord.word}">不认识</button>
        </div>
    `;
    wordContainer.appendChild(wordCard);
    
    // 添加按钮事件
    wordCard.querySelector('.know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordChineseWord(word, true);
        showNextWord();
    });
    
    wordCard.querySelector('.dont-know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordChineseWord(word, false);
        showNextWord();
    });
}

/**
 * 数学模块 - 20以内加减法
 */
let currentMathProblem = null;
let mathScore = 0;
let mathProblemsCount = 0;
let currentRoundCount = 0; // 添加当前轮次答题数计数

// 错题记录数据结构
let mathProblemHistory = JSON.parse(localStorage.getItem('mathProblemHistory')) || {};

/**
 * 记录答题历史
 * @param {Object} problem - 题目对象
 * @param {boolean} isCorrect - 是否答对
 */
function recordMathAnswer(problem, isCorrect) {
    const problemKey = problem.problem;
    if (!mathProblemHistory[problemKey]) {
        mathProblemHistory[problemKey] = {
            totalAttempts: 0,
            correctAttempts: 0,
            wrongAttempts: 0,
            lastAttemptTime: null,
            reviewStage: 0,
            nextReviewTime: null
        };
    }
    
    const record = mathProblemHistory[problemKey];
    record.totalAttempts++;
    if (isCorrect) {
        record.correctAttempts++;
        // 如果答对了，进入下一个复习阶段
        if (record.reviewStage < EBBINGHAUS_INTERVALS.length - 1) {
            record.reviewStage++;
        }
    } else {
        record.wrongAttempts++;
        // 如果答错了，回到上一个复习阶段
        if (record.reviewStage > 0) {
            record.reviewStage--;
        }
    }
    
    record.lastAttemptTime = new Date().toISOString();
    // 设置下次复习时间
    const nextInterval = EBBINGHAUS_INTERVALS[record.reviewStage];
    record.nextReviewTime = new Date(Date.now() + nextInterval * 60 * 60 * 1000).toISOString();
    
    // 保存到本地存储
    localStorage.setItem('mathProblemHistory', JSON.stringify(mathProblemHistory));

    // 如果错题记录弹窗是打开的，更新其内容
    if (isHistoryDialogOpen) {
        showHistoryDialog();
    }
}

/**
 * 获取题目的正确率
 * @param {string} problemKey - 题目
 * @returns {number} - 正确率（0-1之间的小数）
 */
function getProblemAccuracy(problemKey) {
    const record = mathProblemHistory[problemKey];
    if (!record || record.totalAttempts === 0) return 1; // 新题目默认正确率为1
    return record.correctAttempts / record.totalAttempts;
}

/**
 * 计算题目的权重分数
 * @param {Object} record - 题目的答题记录
 * @returns {number} - 权重分数
 */
function calculateProblemWeight(record) {
    if (!record) return 100; // 未答过的题目给予最高权重
    
    const now = new Date();
    const lastAttempt = new Date(record.lastAttemptTime);
    const hoursSinceLastAttempt = (now - lastAttempt) / (1000 * 60 * 60);
    
    // 计算时间权重（0-100分）
    // 24小时内答过的题目权重较低，超过24小时权重逐渐增加
    const timeWeight = Math.min(100, Math.max(0, hoursSinceLastAttempt / 24 * 100));
    
    // 计算正确率权重（0-100分）
    // 正确率越低，权重越高
    const accuracy = record.correctAttempts / record.totalAttempts;
    const accuracyWeight = (1 - accuracy) * 100;
    
    // 计算错误次数权重（0-100分）
    // 错误次数越多，权重越高
    const wrongAttemptsWeight = Math.min(100, record.wrongAttempts * 20);
    
    // 计算总答题次数权重（0-100分）
    // 答题次数越少，权重越高
    const totalAttemptsWeight = Math.max(0, 100 - record.totalAttempts * 10);
    
    // 综合权重计算
    // 时间权重占30%，正确率权重占30%，错误次数权重占20%，总答题次数权重占20%
    return (timeWeight * 0.3 + accuracyWeight * 0.3 + wrongAttemptsWeight * 0.2 + totalAttemptsWeight * 0.2);
}

/**
 * 获取下一次最早的学习时间
 * @returns {string} - 下一次最早的学习时间描述
 */
function getNextEarliestMathReviewTime() {
    const now = new Date();
    let earliestTime = null;
    
    // 遍历所有题目记录，找出最早的下次复习时间
    Object.values(mathProblemHistory).forEach(record => {
        const nextReview = new Date(record.nextReviewTime);
        if (nextReview > now && (!earliestTime || nextReview < earliestTime)) {
            earliestTime = nextReview;
        }
    });
    
    if (!earliestTime) {
        return "现在";
    }
    
    // 计算时间差
    const diff = earliestTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}小时${minutes}分钟后`;
    } else {
        return `${minutes}分钟后`;
    }
}

/**
 * 智能生成数学题目
 * @returns {Object|null} - 题目对象，如果没有需要复习的题目则返回null
 */
function generateSmartMathProblem() {
    const now = new Date();
    
    // 生成所有可能的题目
    const allProblems = [];
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            // 加法题目
            if (i + j <= 20) {
                allProblems.push({
                    problem: `${i} + ${j} = ?`,
                    answer: i + j,
                    type: 'addition'
                });
            }
            // 减法题目
            if (i > j) {
                allProblems.push({
                    problem: `${i} - ${j} = ?`,
                    answer: i - j,
                    type: 'subtraction'
                });
            }
        }
    }
    
    // 计算每个题目的权重，并过滤掉未到复习时间的题目
    const weightedProblems = allProblems
        .map(problem => {
            const record = mathProblemHistory[problem.problem];
            const weight = calculateProblemWeight(record);
            const nextReview = record ? new Date(record.nextReviewTime) : now;
            
            return {
                ...problem,
                weight,
                nextReview,
                isReadyForReview: !record || now >= nextReview
            };
        })
        .filter(problem => problem.isReadyForReview); // 只保留已到复习时间的题目
    
    // 如果没有已到复习时间的题目，返回null
    if (weightedProblems.length === 0) {
        return null;
    }
    
    // 根据权重随机选择题目
    const totalWeight = weightedProblems.reduce((sum, problem) => sum + problem.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const problem of weightedProblems) {
        random -= problem.weight;
        if (random <= 0) {
            return problem;
        }
    }
    
    // 如果出现意外情况，返回第一个已到复习时间的题目
    return weightedProblems[0];
}

// 全局变量，用于跟踪错题记录弹窗状态
let isHistoryDialogOpen = false;

/**
 * 显示错题记录
 */
function showHistoryDialog() {
    const dialog = document.getElementById('history-dialog');
    const historyList = document.getElementById('history-list');
    
    // 清空历史记录列表
    historyList.innerHTML = '';
    
    // 获取所有题目记录并按权重排序
    const problems = Object.entries(mathProblemHistory)
        .map(([problem, record]) => ({
            problem,
            ...record,
            weight: calculateProblemWeight(record)
        }))
        .sort((a, b) => b.weight - a.weight); // 按权重从高到低排序
    
    // 显示每个题目的记录
    problems.forEach(record => {
        const accuracy = (record.correctAttempts / record.totalAttempts * 100).toFixed(1);
        const lastAttempt = new Date(record.lastAttemptTime).toLocaleString();
        const nextReview = new Date(record.nextReviewTime).toLocaleString();
        const hoursUntilReview = ((new Date(record.nextReviewTime) - new Date()) / (1000 * 60 * 60)).toFixed(1);
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        if (hoursUntilReview < 0) {
            historyItem.classList.add('needs-review');
        }
        historyItem.innerHTML = `
            <div class="problem">${record.problem}</div>
            <div class="stats">
                <span>总次数: ${record.totalAttempts}</span>
                <span>正确: ${record.correctAttempts}</span>
                <span>错误: ${record.wrongAttempts}</span>
                <span class="accuracy">正确率: ${accuracy}%</span>
            </div>
            <div class="review-info">
                <div>最后答题时间: ${lastAttempt}</div>
                <div>下次复习时间: ${nextReview}</div>
                <div>复习阶段: ${record.reviewStage + 1}/${EBBINGHAUS_INTERVALS.length}</div>
            </div>
            ${hoursUntilReview < 0 ? '<div class="review-tag">需要复习</div>' : ''}
        `;
        historyList.appendChild(historyItem);
    });
    
    // 显示弹窗
    dialog.style.display = 'flex';
    
    // 添加点击事件监听器
    dialog.addEventListener('click', function(e) {
        // 如果点击的是弹窗背景（而不是内容区域），则关闭弹窗
        if (e.target === dialog) {
            closeHistoryDialog();
        }
    });
    
    // 添加关闭按钮
    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = closeHistoryDialog;
    dialog.querySelector('.dialog-content').appendChild(closeButton);
}

/**
 * 关闭错题记录弹窗
 */
function closeHistoryDialog() {
    const dialog = document.getElementById('history-dialog');
    dialog.style.display = 'none';
    isHistoryDialogOpen = false;
}

/**
 * 显示汉字学习记录
 */
function showChineseHistoryDialog() {
    const dialog = document.getElementById('chinese-history-dialog');
    const historyList = document.getElementById('chinese-history-list');
    
    // 清空历史记录列表
    historyList.innerHTML = '';
    
    // 获取所有汉字记录并按权重排序
    const words = Object.entries(chineseWordHistory)
        .map(([word, record]) => ({
            word,
            ...record,
            weight: calculateWordWeight(record)
        }))
        .sort((a, b) => b.weight - a.weight); // 按权重从高到低排序
    
    // 显示每个汉字的记录
    words.forEach(record => {
        const accuracy = (record.correctAttempts / record.totalAttempts * 100).toFixed(1);
        const lastAttempt = new Date(record.lastAttemptTime).toLocaleString();
        const nextReview = new Date(record.nextReviewTime).toLocaleString();
        const hoursUntilReview = ((new Date(record.nextReviewTime) - new Date()) / (1000 * 60 * 60)).toFixed(1);
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        if (hoursUntilReview < 0) {
            historyItem.classList.add('needs-review');
        }
        historyItem.innerHTML = `
            <div class="problem">${record.word}</div>
            <div class="stats">
                <span>总次数: ${record.totalAttempts}</span>
                <span>正确: ${record.correctAttempts}</span>
                <span>错误: ${record.wrongAttempts}</span>
                <span class="accuracy">正确率: ${accuracy}%</span>
            </div>
            <div class="review-info">
                <div>最后学习时间: ${lastAttempt}</div>
                <div>下次复习时间: ${nextReview}</div>
                <div>复习阶段: ${record.reviewStage + 1}/${EBBINGHAUS_INTERVALS.length}</div>
            </div>
            ${hoursUntilReview < 0 ? '<div class="review-tag">需要复习</div>' : ''}
        `;
        historyList.appendChild(historyItem);
    });
    
    // 显示弹窗
    dialog.style.display = 'flex';
    
    // 添加点击事件监听器
    dialog.addEventListener('click', function(e) {
        // 如果点击的是弹窗背景（而不是内容区域），则关闭弹窗
        if (e.target === dialog) {
            closeChineseHistoryDialog();
        }
    });
    
    // 添加关闭按钮
    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = closeChineseHistoryDialog;
    dialog.querySelector('.dialog-content').appendChild(closeButton);
}

/**
 * 关闭汉字学习记录弹窗
 */
function closeChineseHistoryDialog() {
    const dialog = document.getElementById('chinese-history-dialog');
    dialog.style.display = 'none';
}

/**
 * 检查当前复习阶段的正确率是否达标
 * @param {number} reviewStage - 当前复习阶段
 * @param {number} correctCount - 当前阶段的正确次数
 * @param {number} totalCount - 当前阶段的总次数
 * @returns {boolean} - 是否达标
 */
function isAccuracyMet(reviewStage, correctCount, totalCount) {
    if (totalCount === 0) return false;
    
    const accuracy = correctCount / totalCount;
    // 根据复习阶段设置不同的正确率要求
    const requiredAccuracy = [
        0.8,  // 5分钟阶段：80%
        0.85, // 30分钟阶段：85%
        0.9,  // 12小时阶段：90%
        0.9,  // 1天阶段：90%
        0.95, // 2天阶段：95%
        0.95, // 4天阶段：95%
        0.95, // 7天阶段：95%
        0.95  // 15天阶段：95%
    ][reviewStage];
    
    return accuracy >= requiredAccuracy;
}

/**
 * 初始化数学测试页面
 */
function initMathTestPage() {
    const problemContainer = document.getElementById('math-problem-container');
    const optionsContainer = document.getElementById('math-options-container');
    const resultContainer = document.getElementById('math-result');
    const scoreContainer = document.getElementById('math-score');
    const showHistoryBtn = document.getElementById('show-history-btn');
    
    let currentProblem = null;
    let score = 0;
    let totalAnswered = 0;
    let isAnswered = false;
    let currentStageCorrect = 0;
    let currentStageTotal = 0;
    let currentReviewStage = 0;

    // 显示历史记录
    showHistoryBtn.addEventListener('click', function() {
        isHistoryDialogOpen = true;
        showHistoryDialog();
    });

    // 更新得分显示
    function updateScore() {
        const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
        scoreContainer.innerHTML = `得分: ${percentage}分`;
    }

    // 生成新的数学题目
    function generateNewProblem() {
        // 检查当前阶段的正确率是否达标
        if (currentStageTotal >= 5 && isAccuracyMet(currentReviewStage, currentStageCorrect, currentStageTotal)) {
            const nextReviewTime = getNextEarliestMathReviewTime();
            problemContainer.innerHTML = `
                <div class="math-problem">
                    <div class="rest-message">
                        <h3>休息一下</h3>
                        <p>当前阶段的练习已经达标！</p>
                        <p>正确率：${Math.round((currentStageCorrect / currentStageTotal) * 100)}%</p>
                        <p>下次练习时间：${nextReviewTime}</p>
                    </div>
                </div>
            `;
            optionsContainer.innerHTML = '';
            resultContainer.innerHTML = '';
            return;
        }

        currentProblem = generateSmartMathProblem();
        
        // 如果没有需要复习的题目，显示休息提示
        if (!currentProblem) {
            const nextReviewTime = getNextEarliestMathReviewTime();
            problemContainer.innerHTML = `
                <div class="math-problem">
                    <div class="rest-message">
                        <h3>休息一下</h3>
                        <p>今天的数学练习已经完成！</p>
                        <p>下次练习时间：${nextReviewTime}</p>
                    </div>
                </div>
            `;
            optionsContainer.innerHTML = '';
            resultContainer.innerHTML = '';
            return;
        }
        
        isAnswered = false;
        
        // 清空结果提示
        resultContainer.innerHTML = '';
        resultContainer.className = '';
        
        // 显示题目
        problemContainer.innerHTML = `<div class="math-problem">${currentProblem.problem}</div>`;

        // 生成选项
        const options = generateMathOptions(currentProblem.answer);
        optionsContainer.innerHTML = '';
        options.forEach(function(option) {
            const optionElem = document.createElement('div');
            optionElem.className = 'math-option';
            optionElem.textContent = option;
            optionElem.addEventListener('click', function() {
                checkAnswer(option);
            });
            optionsContainer.appendChild(optionElem);
        });

        // 初始化得分显示
        updateScore();
    }

    // 检查答案
    window.checkAnswer = function(selectedAnswer) {
        if (isAnswered) return;
        
        isAnswered = true;
        totalAnswered++;
        const isCorrect = selectedAnswer === currentProblem.answer;
        
        // 更新当前阶段的统计
        currentStageTotal++;
        if (isCorrect) {
            score++;
            currentStageCorrect++;
        }
        
        // 禁用所有选项并添加相应的样式
        const options = optionsContainer.getElementsByClassName('math-option');
        for (let option of options) {
            option.style.pointerEvents = 'none';
            const optionValue = parseInt(option.textContent);
            if (optionValue === currentProblem.answer) {
                option.classList.add('correct');
            } else if (optionValue === selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        }
        
        if (isCorrect) {
            resultContainer.innerHTML = '<div class="success">答对了！真棒！</div>';
        } else {
            resultContainer.innerHTML = `<div class="error">答错了！正确答案是 ${currentProblem.answer}</div>`;
        }

        // 记录答题历史（无论对错）
        recordMathAnswer(currentProblem, isCorrect);

        // 更新得分显示
        updateScore();

        // 1秒后生成新题目
        setTimeout(generateNewProblem, 1000);
    };

    // 初始化显示第一道题
    generateNewProblem();
}

/**
 * 生成数学题目的选项
 * @param {number} correctAnswer - 正确答案
 * @returns {Array} - 选项数组
 */
function generateMathOptions(correctAnswer) {
    const options = [correctAnswer];
    
    // 生成3个不同的干扰项
    while (options.length < 4) {
        const option = Math.floor(Math.random() * 20) + 1;
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    
    // 打乱选项顺序
    return shuffleArray(options);
}

/**
 * 辅助函数 - 从数组中随机获取指定数量的元素
 * @param {Array} array - 源数组
 * @param {number} count - 需要的元素数量
 * @returns {Array} - 随机选择的元素数组
 */
function getRandomItems(array, count) {
    const shuffled = shuffleArray([...array]);
    return shuffled.slice(0, count);
}

/**
 * 辅助函数 - 打乱数组顺序
 * @param {Array} array - 要打乱的数组
 * @returns {Array} - 打乱后的数组
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * 英语模块 - 单词学习
 */
const englishWords = [
    { word: 'apple', pronunciation: '/ˈæpl/', translation: '苹果', image: 'img/apple.svg' },
    { word: 'banana', pronunciation: '/bəˈnɑːnə/', translation: '香蕉', image: 'img/banana.svg' },
    { word: 'cat', pronunciation: '/kæt/', translation: '猫', image: 'img/cat.svg' },
    { word: 'dog', pronunciation: '/dɒɡ/', translation: '狗', image: 'img/dog.svg' },
    { word: 'elephant', pronunciation: '/ˈelɪfənt/', translation: '大象', image: 'img/elephant.svg' },
    { word: 'fish', pronunciation: '/fɪʃ/', translation: '鱼', image: 'img/fish.svg' },
    { word: 'giraffe', pronunciation: '/dʒɪˈrɑːf/', translation: '长颈鹿', image: 'img/giraffe.svg' },
    { word: 'house', pronunciation: '/haʊs/', translation: '房子', image: 'img/house.svg' },
    { word: 'ice cream', pronunciation: '/ˌaɪs ˈkriːm/', translation: '冰淇淋', image: 'img/ice-cream.svg' },
    { word: 'juice', pronunciation: '/dʒuːs/', translation: '果汁', image: 'img/juice.svg' },
    { word: 'kite', pronunciation: '/kaɪt/', translation: '风筝', image: 'img/kite.svg' },
    { word: 'lion', pronunciation: '/ˈlaɪən/', translation: '狮子', image: 'img/lion.svg' },
    { word: 'monkey', pronunciation: '/ˈmʌŋki/', translation: '猴子', image: 'img/monkey.svg' },
    { word: 'nose', pronunciation: '/nəʊz/', translation: '鼻子', image: 'img/nose.svg' },
    { word: 'orange', pronunciation: '/ˈɒrɪndʒ/', translation: '橙子', image: 'img/orange.svg' },
    { word: 'panda', pronunciation: '/ˈpændə/', translation: '熊猫', image: 'img/panda.svg' },
    { word: 'queen', pronunciation: '/kwiːn/', translation: '女王', image: 'img/queen.svg' },
    { word: 'rabbit', pronunciation: '/ˈræbɪt/', translation: '兔子', image: 'img/rabbit.svg' },
    { word: 'sun', pronunciation: '/sʌn/', translation: '太阳', image: 'img/sun.svg' },
    { word: 'tree', pronunciation: '/triː/', translation: '树', image: 'img/tree.svg' }
];

/**
 * 初始化英语单词学习页面
 */
function initEnglishWordPage() {
    const wordContainer = document.getElementById('english-word-container');
    if (!wordContainer) return;
    
    // 清空容器
    wordContainer.innerHTML = '';
    
    // 随机选择1个单词进行展示
    const selectedWords = getRandomItems(englishWords, 1);
    
    // 创建单词卡片
    selectedWords.forEach(function(wordObj) {
        const wordCard = document.createElement('div');
        wordCard.className = 'english-card';
        wordCard.innerHTML = `
            <div class="word">${wordObj.word}</div>
            <div class="pronunciation">${wordObj.pronunciation}</div>
            <div class="translation">${wordObj.translation}</div>
            <img src="${wordObj.image}" alt="${wordObj.word}" class="word-image">
            <button class="btn pronounce-btn" data-word="${wordObj.word}">读一读</button>
        `;
        wordContainer.appendChild(wordCard);
    });
    
    // 添加发音按钮事件
    document.querySelectorAll('.pronounce-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const word = this.getAttribute('data-word');
            pronounceEnglishWord(word);
        });
    });
}

/**
 * 英语单词发音功能（模拟）
 * @param {string} word - 要发音的英语单词
 */
function pronounceEnglishWord(word) {
    // 在实际应用中，这里可以调用语音API
    alert('发音: ' + word);
}
