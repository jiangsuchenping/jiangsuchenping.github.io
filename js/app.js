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

    // 初始化游戏模块
    if (document.getElementById('memory-game-page')) {
        initMemoryGame();
    }
    if (document.getElementById('puzzle-game-page')) {
        initPuzzleGame();
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
        showRestMessage('word-container', getNextEarliestReviewTime, '所有汉字都已经学习完成！', {
            onResume: () => {
                // 直接调用显示下一个汉字的函数
                showNextWord();
            }
        });
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
    
    // 计算正确率
    const accuracy = record.correctAttempts / record.totalAttempts;
    
    // 根据正确率和当前阶段调整复习间隔
    let nextInterval = EBBINGHAUS_INTERVALS[record.reviewStage];
    
    // 如果正确率低于当前阶段的要求，增加复习频率
    if (!isAccuracyMet(record.reviewStage, record.correctAttempts, record.totalAttempts)) {
        nextInterval = Math.max(5/60, nextInterval * 0.5); // 至少5分钟
    }
    
    // 设置下次复习时间
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
 * 检查是否有需要复习的题目
 * @returns {boolean} - 是否有需要复习的题目
 */
function hasReviewableProblems() {
    const now = new Date();
    return Object.values(mathProblemHistory).some(record => {
        const nextReview = new Date(record.nextReviewTime);
        return now >= nextReview;
    });
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
    const startPracticeBtn = document.getElementById('start-practice-btn');
    
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

    // 开始练习按钮点击事件
    if (startPracticeBtn) {
        startPracticeBtn.addEventListener('click', function() {
            // 检查是否有需要复习的题目
            if (!hasReviewableProblems()) {
                showRestMessage('math-problem-container', getNextEarliestMathReviewTime, '今天的数学练习已经完成！', {
                    clearOptionsId: 'math-options-container',
                    clearResultId: 'math-result',
                    onResume: () => {
                        // 直接生成新的题目
                        generateNewProblem();
                    }
                });
            } else {
                generateNewProblem();
            }
        });
    }

    // 更新得分显示
    function updateScore() {
        const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
        scoreContainer.innerHTML = `得分: ${percentage}分`;
    }

    // 生成新的数学题目
    function generateNewProblem() {
        // 检查当前阶段的正确率是否达标
        if (currentStageTotal >= 10 && isAccuracyMet(currentReviewStage, currentStageCorrect, currentStageTotal)) {
            showRestMessage('math-problem-container', getNextEarliestMathReviewTime, '今天的数学练习已经完成！', {
                clearOptionsId: 'math-options-container',
                clearResultId: 'math-result',
                onResume: () => {
                    // 直接生成新的题目
                    generateNewProblem();
                }
            });
            return;
        }

        currentProblem = generateSmartMathProblem();
        
        // 如果没有需要复习的题目，显示休息提示
        if (!currentProblem) {
            showRestMessage('math-problem-container', getNextEarliestMathReviewTime, '今天的数学练习已经完成！', {
                clearOptionsId: 'math-options-container',
                clearResultId: 'math-result',
                onResume: () => {
                    // 直接生成新的题目
                    generateNewProblem();
                }
            });
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

    // 初始化显示
    const nextReviewTime = getNextEarliestMathReviewTime();
    if (nextReviewTime !== "现在") {
        // 如果下次练习时间未到，显示休息提示
        showRestMessage('math-problem-container', getNextEarliestMathReviewTime, '今天的数学练习已经完成！', {
            clearOptionsId: 'math-options-container',
            clearResultId: 'math-result',
            onResume: () => {
                // 直接生成新的题目
                generateNewProblem();
            }
        });
    } else if (!hasReviewableProblems()) {
        // 如果没有需要复习的题目，显示休息提示
        showRestMessage('math-problem-container', getNextEarliestMathReviewTime, '今天的数学练习已经完成！', {
            clearOptionsId: 'math-options-container',
            clearResultId: 'math-result',
            onResume: () => {
                // 直接生成新的题目
                generateNewProblem();
            }
        });
    } else {
        // 检查当前阶段的正确率是否达标
        if (currentStageTotal >= 10 && isAccuracyMet(currentReviewStage, currentStageCorrect, currentStageTotal)) {
            showRestMessage('math-problem-container', getNextEarliestMathReviewTime, '今天的数学练习已经完成！', {
                clearOptionsId: 'math-options-container',
                clearResultId: 'math-result',
                onResume: () => {
                    // 直接生成新的题目
                    generateNewProblem();
                }
            });
        } else {
            generateNewProblem();
        }
    }
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
        // 如果没有记录，返回第一个复习间隔（5分钟）
        return "5分钟后";
    }
    
    // 计算时间差
    const diff = earliestTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // 如果时间差小于1分钟，返回"现在"
    if (diff < 60000) {
        return "现在";
    }
    
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
    { word: 'tree', pronunciation: '/triː/', translation: '树', image: 'img/tree.svg' },
    // 新增单词
    { word: 'book', pronunciation: '/bʊk/', translation: '书', image: 'img/book.svg' },
    { word: 'car', pronunciation: '/kɑː/', translation: '汽车', image: 'img/car.svg' },
    { word: 'desk', pronunciation: '/desk/', translation: '书桌', image: 'img/desk.svg' },
    { word: 'egg', pronunciation: '/eɡ/', translation: '鸡蛋', image: 'img/egg.svg' },
    { word: 'flower', pronunciation: '/ˈflaʊə/', translation: '花', image: 'img/flower.svg' },
    { word: 'grape', pronunciation: '/ɡreɪp/', translation: '葡萄', image: 'img/grape.svg' },
    { word: 'hat', pronunciation: '/hæt/', translation: '帽子', image: 'img/hat.svg' },
    { word: 'ice', pronunciation: '/aɪs/', translation: '冰', image: 'img/ice.svg' },
    { word: 'jacket', pronunciation: '/ˈdʒækɪt/', translation: '夹克', image: 'img/jacket.svg' },
    { word: 'key', pronunciation: '/kiː/', translation: '钥匙', image: 'img/key.svg' },
    { word: 'leaf', pronunciation: '/liːf/', translation: '叶子', image: 'img/leaf.svg' },
    { word: 'moon', pronunciation: '/muːn/', translation: '月亮', image: 'img/moon.svg' },
    { word: 'nest', pronunciation: '/nest/', translation: '鸟巢', image: 'img/nest.svg' },
    { word: 'owl', pronunciation: '/aʊl/', translation: '猫头鹰', image: 'img/owl.svg' },
    { word: 'pen', pronunciation: '/pen/', translation: '钢笔', image: 'img/pen.svg' },
    { word: 'rain', pronunciation: '/reɪn/', translation: '雨', image: 'img/rain.svg' },
    { word: 'star', pronunciation: '/stɑː/', translation: '星星', image: 'img/star.svg' },
    { word: 'tiger', pronunciation: '/ˈtaɪɡə/', translation: '老虎', image: 'img/tiger.svg' },
    { word: 'umbrella', pronunciation: '/ʌmˈbrelə/', translation: '雨伞', image: 'img/umbrella.svg' },
    { word: 'violin', pronunciation: '/ˌvaɪəˈlɪn/', translation: '小提琴', image: 'img/violin.svg' },
    { word: 'water', pronunciation: '/ˈwɔːtə/', translation: '水', image: 'img/water.svg' },
    { word: 'box', pronunciation: '/bɒks/', translation: '盒子', image: 'img/box.svg' },
    { word: 'yellow', pronunciation: '/ˈjeləʊ/', translation: '黄色', image: 'img/yellow.svg' },
    { word: 'zebra', pronunciation: '/ˈzebrə/', translation: '斑马', image: 'img/zebra.svg' }
];

// 英语单词学习记录数据结构
let englishWordHistory = JSON.parse(localStorage.getItem('englishWordHistory')) || {};

/**
 * 记录英语单词学习情况
 * @param {string} word - 英语单词
 * @param {boolean} isCorrect - 是否认识
 */
function recordEnglishWord(word, isCorrect) {
    if (!englishWordHistory[word]) {
        englishWordHistory[word] = {
            totalAttempts: 0,
            correctAttempts: 0,
            wrongAttempts: 0,
            lastAttemptTime: null,
            reviewStage: 0,
            nextReviewTime: null
        };
    }
    
    const record = englishWordHistory[word];
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
    
    // 计算正确率
    const accuracy = record.correctAttempts / record.totalAttempts;
    
    // 根据正确率和当前阶段调整复习间隔
    let nextInterval = EBBINGHAUS_INTERVALS[record.reviewStage];
    
    // 如果正确率低于当前阶段的要求，增加复习频率
    if (!isAccuracyMet(record.reviewStage, record.correctAttempts, record.totalAttempts)) {
        nextInterval = Math.max(5/60, nextInterval * 0.5); // 至少5分钟
    }
    
    // 设置下次复习时间
    record.nextReviewTime = new Date(Date.now() + nextInterval * 60 * 60 * 1000).toISOString();
    
    // 保存到本地存储
    localStorage.setItem('englishWordHistory', JSON.stringify(englishWordHistory));
}

/**
 * 计算英语单词的复习权重
 * @param {Object} record - 单词的学习记录
 * @returns {number} - 权重分数
 */
function calculateEnglishWordWeight(record) {
    if (!record) return 100; // 未学习过的单词给予最高权重
    
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
 * 智能选择下一个要学习的英语单词
 * @returns {Object|null} - 选中的单词对象，如果没有需要学习的单词则返回null
 */
function selectNextEnglishWord() {
    const now = new Date();
    
    // 计算每个单词的权重，并过滤掉未到复习时间的单词
    const weightedWords = englishWords
        .map(wordObj => {
            const record = englishWordHistory[wordObj.word];
            const weight = calculateEnglishWordWeight(record);
            const nextReview = record ? new Date(record.nextReviewTime) : now;
            
            return {
                ...wordObj,
                weight,
                nextReview,
                isReadyForReview: !record || now >= nextReview
            };
        })
        .filter(word => word.isReadyForReview); // 只保留已到复习时间的单词
    
    // 如果没有已到复习时间的单词，返回null
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
    
    // 如果出现意外情况，返回第一个已到复习时间的单词
    return weightedWords[0];
}

/**
 * 获取下一次最早的英语单词学习时间
 * @returns {string} - 下一次最早的学习时间描述
 */
function getNextEarliestEnglishReviewTime() {
    const now = new Date();
    let earliestTime = null;
    
    // 遍历所有单词记录，找出最早的下次复习时间
    Object.values(englishWordHistory).forEach(record => {
        const nextReview = new Date(record.nextReviewTime);
        if (nextReview > now && (!earliestTime || nextReview < earliestTime)) {
            earliestTime = nextReview;
        }
    });
    
    if (!earliestTime) {
        // 如果没有记录，返回第一个复习间隔（5分钟）
        return "5分钟后";
    }
    
    // 计算时间差
    const diff = earliestTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // 如果时间差小于1分钟，返回"现在"
    if (diff <= 60000) {
        return "现在";
    }
    
    if (hours > 0) {
        return `${hours}小时${minutes}分钟后`;
    } else {
        return `${minutes}分钟后`;
    }
}

/**
 * 检查是否有需要复习的英语单词
 * @returns {boolean} - 是否有需要复习的单词
 */
function hasReviewableEnglishWords() {
    const now = new Date();
    return Object.values(englishWordHistory).some(record => {
        const nextReview = new Date(record.nextReviewTime);
        return now >= nextReview;
    });
}

/**
 * 显示英语单词学习记录
 */
function showEnglishHistoryDialog() {
    const dialog = document.getElementById('english-history-dialog');
    const historyList = document.getElementById('english-history-list');
    
    // 清空历史记录列表
    historyList.innerHTML = '';
    
    // 获取所有单词记录并按权重排序
    const words = Object.entries(englishWordHistory)
        .map(([word, record]) => ({
            word,
            ...record,
            weight: calculateEnglishWordWeight(record)
        }))
        .sort((a, b) => b.weight - a.weight); // 按权重从高到低排序
    
    // 显示每个单词的记录
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
            closeEnglishHistoryDialog();
        }
    });
    
    // 添加关闭按钮
    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '×';
    closeButton.onclick = closeEnglishHistoryDialog;
    dialog.querySelector('.dialog-content').appendChild(closeButton);
}

/**
 * 关闭英语单词学习记录弹窗
 */
function closeEnglishHistoryDialog() {
    const dialog = document.getElementById('english-history-dialog');
    dialog.style.display = 'none';
}

/**
 * 显示休息提示
 * @param {string} containerId - 容器的ID
 * @param {Function} getNextReviewTime - 获取下次复习时间的函数
 * @param {string} message - 休息提示信息
 * @param {Object} options - 额外选项
 * @param {string} options.clearOptionsId - 需要清空的选项容器ID
 * @param {string} options.clearResultId - 需要清空的结果容器ID
 * @param {Function} options.onResume - 恢复学习的回调函数
 */
function showRestMessage(containerId, getNextReviewTime, message, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const nextReviewTime = getNextReviewTime();
    const restMessage = document.createElement('div');
    restMessage.className = 'word-card';
    restMessage.innerHTML = `
        <div class="word">休息一下</div>
        <div class="pinyin">xiū xi yí xià</div>
        <div class="example">${message}</div>
        <div class="review-info">下次学习时间：<span class="next-review-time">${nextReviewTime}</span></div>
    `;
    
    container.innerHTML = '';
    container.appendChild(restMessage);

    // 清空选项容器（如果指定）
    if (options.clearOptionsId) {
        const optionsContainer = document.getElementById(options.clearOptionsId);
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
        }
    }

    // 清空结果容器（如果指定）
    if (options.clearResultId) {
        const resultContainer = document.getElementById(options.clearResultId);
        if (resultContainer) {
            resultContainer.innerHTML = '';
        }
    }

    // 清除之前的定时器（如果存在）
    if (window.timeUpdateInterval) {
        clearInterval(window.timeUpdateInterval);
    }

    // 如果时间已经到了，立即恢复学习
    if (nextReviewTime === "现在" && options.onResume) {
        options.onResume();
        return;
    }

    // 获取下次复习时间的具体时间戳
    function getNextReviewTimestamp() {
        const now = new Date();
        let earliestTime = null;
        
        // 遍历所有记录，找出最早的下次复习时间
        Object.values(englishWordHistory).forEach(record => {
            const nextReview = new Date(record.nextReviewTime);
            if (nextReview > now && (!earliestTime || nextReview < earliestTime)) {
                earliestTime = nextReview;
            }
        });
        
        // 如果没有找到英语单词的复习时间，检查数学题目
        if (!earliestTime) {
            Object.values(mathProblemHistory).forEach(record => {
                const nextReview = new Date(record.nextReviewTime);
                if (nextReview > now && (!earliestTime || nextReview < earliestTime)) {
                    earliestTime = nextReview;
                }
            });
        }
        
        // 如果没有找到数学题目的复习时间，检查汉字
        if (!earliestTime) {
            Object.values(chineseWordHistory).forEach(record => {
                const nextReview = new Date(record.nextReviewTime);
                if (nextReview > now && (!earliestTime || nextReview < earliestTime)) {
                    earliestTime = nextReview;
                }
            });
        }
        
        return earliestTime;
    }

    // 更新显示的时间
    function updateTimeDisplay() {
        const nextReview = getNextReviewTimestamp();
        if (!nextReview) {
            if (options.onResume) {
                options.onResume();
            }
            return;
        }

        const now = new Date();
        const diff = nextReview - now;
        
        // 如果时间差小于等于0，恢复学习
        if (diff <= 0) {
            clearInterval(window.timeUpdateInterval);
            if (options.onResume) {
                options.onResume();
            }
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const timeElement = restMessage.querySelector('.next-review-time');
        if (timeElement) {
            if (hours > 0) {
                timeElement.textContent = `${hours}小时${minutes}分钟后`;
            } else if (minutes > 0) {
                timeElement.textContent = `${minutes}分钟后`;
            } else {
                timeElement.textContent = `${seconds}秒后`;
            }
        }

        // 如果剩余时间小于1分钟，使用1秒的更新间隔
        if (diff < 60000) {
            clearInterval(window.timeUpdateInterval);
            window.timeUpdateInterval = setInterval(updateTimeDisplay, 1000);
        }
    }

    // 初始更新显示
    updateTimeDisplay();

    // 添加定时器，每分钟更新一次时间
    window.timeUpdateInterval = setInterval(updateTimeDisplay, 60000);

    // 当页面隐藏时清除定时器
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(window.timeUpdateInterval);
        } else {
            // 页面重新显示时，立即更新一次时间
            updateTimeDisplay();
            // 重新设置定时器
            const nextReview = getNextReviewTimestamp();
            if (nextReview) {
                const diff = nextReview - new Date();
                if (diff < 60000) {
                    window.timeUpdateInterval = setInterval(updateTimeDisplay, 1000);
                } else {
                    window.timeUpdateInterval = setInterval(updateTimeDisplay, 60000);
                }
            }
        }
    });
}

/**
 * 初始化英语单词学习页面
 */
function initEnglishWordPage() {
    const wordContainer = document.getElementById('english-word-container');
    const showHistoryBtn = document.getElementById('show-english-history-btn');
    
    if (!wordContainer) return;
    
    // 显示历史记录
    if (showHistoryBtn) {
        showHistoryBtn.addEventListener('click', showEnglishHistoryDialog);
    }
    
    // 清空容器
    wordContainer.innerHTML = '';
    
    // 智能选择一个单词
    const selectedWord = selectNextEnglishWord();
    
    if (!selectedWord) {
        // 如果没有需要学习的单词，显示提示信息
        showRestMessage('english-word-container', getNextEarliestEnglishReviewTime, '所有单词都已经学习完成！', {
            onResume: () => {
                // 直接调用显示下一个单词的函数
                showNextEnglishWord();
            }
        });
        return;
    }
    
    // 创建单词卡片
    const wordCard = document.createElement('div');
    wordCard.className = 'word-card';
    wordCard.innerHTML = `
        <div class="word">${selectedWord.word}</div>
        <div class="pinyin">${selectedWord.pronunciation}</div>
        <div class="example">${selectedWord.translation}</div>
        <img src="${selectedWord.image}" alt="${selectedWord.word}" class="word-image">
        <div class="word-buttons">
            <button class="btn know-btn" data-word="${selectedWord.word}">认识</button>
            <button class="btn dont-know-btn" data-word="${selectedWord.word}">不认识</button>
        </div>
    `;
    wordContainer.appendChild(wordCard);
    
    // 添加按钮事件
    wordCard.querySelector('.know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordEnglishWord(word, true);
        showNextEnglishWord();
    });
    
    wordCard.querySelector('.dont-know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordEnglishWord(word, false);
        showNextEnglishWord();
    });
}

/**
 * 显示下一个英语单词
 */
function showNextEnglishWord() {
    // 清空容器
    const wordContainer = document.getElementById('english-word-container');
    wordContainer.innerHTML = '';
    
    // 智能选择下一个单词
    const selectedWord = selectNextEnglishWord();
    
    if (!selectedWord) {
        // 如果没有需要学习的单词，显示提示信息
        showRestMessage('english-word-container', getNextEarliestEnglishReviewTime, '所有单词都已经学习完成！', {
            onResume: () => {
                // 直接调用显示下一个单词的函数
                showNextEnglishWord();
            }
        });
        return;
    }
    
    // 创建单词卡片
    const wordCard = document.createElement('div');
    wordCard.className = 'word-card';
    wordCard.innerHTML = `
        <div class="word">${selectedWord.word}</div>
        <div class="pinyin">${selectedWord.pronunciation}</div>
        <div class="example">${selectedWord.translation}</div>
        <img src="${selectedWord.image}" alt="${selectedWord.word}" class="word-image">
        <div class="word-buttons">
            <button class="btn know-btn" data-word="${selectedWord.word}">认识</button>
            <button class="btn dont-know-btn" data-word="${selectedWord.word}">不认识</button>
        </div>
    `;
    wordContainer.appendChild(wordCard);
    
    // 添加按钮事件
    wordCard.querySelector('.know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordEnglishWord(word, true);
        showNextEnglishWord();
    });
    
    wordCard.querySelector('.dont-know-btn').addEventListener('click', function() {
        const word = this.getAttribute('data-word');
        recordEnglishWord(word, false);
        showNextEnglishWord();
    });
}

/**
 * 游戏模块 - 华容道
 */
let klotskiMoves = 0;
let klotskiStartTime = null;
let klotskiTimerInterval = null;
let klotskiPieces = [];
let emptyIndex = 8; // 空白格子的位置

// 游戏时间记录数据结构
let gameTimeHistory = JSON.parse(localStorage.getItem('gameTimeHistory')) || {
    totalTime: 0, // 总游戏时间（分钟）
    lastPlayTime: null, // 上次游戏时间
    nextPlayTime: null // 下次可游戏时间
};

/**
 * 记录游戏时间
 * @param {number} minutes - 本次游戏时长（分钟）
 */
function recordGameTime(minutes) {
    gameTimeHistory.totalTime += minutes;
    gameTimeHistory.lastPlayTime = new Date().toISOString();
    
    // 计算下次可游戏时间
    calculateNextGameTime();
    
    // 保存到本地存储
    localStorage.setItem('gameTimeHistory', JSON.stringify(gameTimeHistory));
}

/**
 * 计算下次可游戏时间
 */
function calculateNextGameTime() {
    const now = new Date();
    
    // 获取各模块的学习情况
    const chineseProgress = getModuleProgress(chineseWordHistory);
    const mathProgress = getModuleProgress(mathProblemHistory);
    const englishProgress = getModuleProgress(englishWordHistory);
    
    // 计算总体学习进度（0-100）
    const totalProgress = (chineseProgress + mathProgress + englishProgress) / 3;
    
    // 根据学习进度和游戏时间计算下次可游戏时间
    let nextInterval;
    if (totalProgress >= 80) {
        // 学习进度很好，1小时后可以再玩
        nextInterval = 60;
    } else if (totalProgress >= 60) {
        // 学习进度一般，2小时后可以再玩
        nextInterval = 120;
    } else {
        // 学习进度较差，4小时后可以再玩
        nextInterval = 240;
    }
    
    // 如果今天游戏时间超过2小时，增加等待时间
    const todayGameTime = getTodayGameTime();
    if (todayGameTime >= 120) {
        nextInterval = Math.max(nextInterval, 240); // 至少4小时
    }
    
    // 设置下次可游戏时间
    gameTimeHistory.nextPlayTime = new Date(now.getTime() + nextInterval * 60 * 1000).toISOString();
}

/**
 * 获取模块学习进度
 * @param {Object} history - 模块的学习记录
 * @returns {number} - 学习进度（0-100）
 */
function getModuleProgress(history) {
    if (!history || Object.keys(history).length === 0) return 0;
    
    let totalProgress = 0;
    let count = 0;
    
    Object.values(history).forEach(record => {
        if (record.totalAttempts > 0) {
            const accuracy = record.correctAttempts / record.totalAttempts;
            const stageProgress = (record.reviewStage + 1) / EBBINGHAUS_INTERVALS.length;
            totalProgress += (accuracy * 0.7 + stageProgress * 0.3) * 100;
            count++;
        }
    });
    
    return count > 0 ? totalProgress / count : 0;
}

/**
 * 获取今天的游戏时间（分钟）
 * @returns {number} - 今天的游戏时间
 */
function getTodayGameTime() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!gameTimeHistory.lastPlayTime) return 0;
    
    const lastPlay = new Date(gameTimeHistory.lastPlayTime);
    if (lastPlay < today) return 0;
    
    return gameTimeHistory.totalTime;
}

/**
 * 检查是否可以开始游戏
 * @returns {boolean} - 是否可以开始游戏
 */
function canStartGame() {
    const now = new Date();
    if (!gameTimeHistory.nextPlayTime) {
        calculateNextGameTime();
    }
    
    const nextPlay = new Date(gameTimeHistory.nextPlayTime);
    return now >= nextPlay;
}

/**
 * 获取下次可游戏时间
 * @returns {string} - 下次可游戏时间描述
 */
function getNextGameTime() {
    const now = new Date();
    if (!gameTimeHistory.nextPlayTime) {
        calculateNextGameTime();
    }
    
    const nextPlay = new Date(gameTimeHistory.nextPlayTime);
    if (now >= nextPlay) {
        return "现在";
    }
    
    const diff = nextPlay - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}小时${minutes}分钟后`;
    } else {
        return `${minutes}分钟后`;
    }
}

/**
 * 初始化华容道游戏
 */
function initKlotskiGame() {
    const container = document.getElementById('klotski-container');
    const restartBtn = document.getElementById('restart-klotski-btn');
    const movesDisplay = document.getElementById('klotski-moves');
    const timeDisplay = document.getElementById('klotski-time');
    
    if (!container) return;
    
    // 检查是否可以开始游戏
    if (!canStartGame()) {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.innerHTML = '';
            const restMessage = document.createElement('div');
            restMessage.className = 'word-card';
            restMessage.innerHTML = `
                <div class="word">休息一下</div>
                <div class="pinyin">xiū xi yí xià</div>
                <div class="example">游戏时间已用完，请先完成学习任务！</div>
                <div class="review-info">下次游戏时间：<span class="next-review-time">${getNextGameTime()}</span></div>
            `;
            gameContainer.appendChild(restMessage);
            
            // 清除之前的定时器
            if (window.timeUpdateInterval) {
                clearInterval(window.timeUpdateInterval);
            }
            
            // 更新显示的时间
            function updateTimeDisplay() {
                const nextPlay = new Date(gameTimeHistory.nextPlayTime);
                const now = new Date();
                const diff = nextPlay - now;
                
                // 如果时间差小于等于0，恢复游戏
                if (diff <= 0) {
                    clearInterval(window.timeUpdateInterval);
                    initKlotskiGame();
                    return;
                }
                
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                const timeElement = restMessage.querySelector('.next-review-time');
                if (timeElement) {
                    if (hours > 0) {
                        timeElement.textContent = `${hours}小时${minutes}分钟后`;
                    } else if (minutes > 0) {
                        timeElement.textContent = `${minutes}分钟后`;
                    } else {
                        timeElement.textContent = `${seconds}秒后`;
                    }
                }
                
                // 如果剩余时间小于1分钟，使用1秒的更新间隔
                if (diff < 60000) {
                    clearInterval(window.timeUpdateInterval);
                    window.timeUpdateInterval = setInterval(updateTimeDisplay, 1000);
                }
            }
            
            // 初始更新显示
            updateTimeDisplay();
            
            // 添加定时器，每分钟更新一次时间
            window.timeUpdateInterval = setInterval(updateTimeDisplay, 60000);
            
            // 当页面隐藏时清除定时器
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(window.timeUpdateInterval);
                } else {
                    // 页面重新显示时，立即更新一次时间
                    updateTimeDisplay();
                    // 重新设置定时器
                    const nextPlay = new Date(gameTimeHistory.nextPlayTime);
                    const diff = nextPlay - new Date();
                    if (diff < 60000) {
                        window.timeUpdateInterval = setInterval(updateTimeDisplay, 1000);
                    } else {
                        window.timeUpdateInterval = setInterval(updateTimeDisplay, 60000);
                    }
                }
            });
        }
        return;
    }
    
    // 重置游戏状态
    klotskiMoves = 0;
    klotskiStartTime = null;
    if (klotskiTimerInterval) {
        clearInterval(klotskiTimerInterval);
    }
    movesDisplay.textContent = '0';
    timeDisplay.textContent = '00:00';
    
    // 初始化拼图块
    klotskiPieces = [1, 2, 3, 4, 5, 6, 7, 8, null];
    emptyIndex = 8;
    
    // 清空容器
    container.innerHTML = '';
    
    // 打乱拼图
    shuffleKlotski();
    
    // 添加拼图块
    klotskiPieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'klotski-piece';
        if (piece === null) {
            pieceElement.classList.add('empty');
        } else {
            pieceElement.textContent = piece;
            pieceElement.dataset.index = index;
            pieceElement.addEventListener('click', moveKlotskiPiece);
        }
        container.appendChild(pieceElement);
    });
    
    // 重新开始按钮事件
    if (restartBtn) {
        restartBtn.addEventListener('click', initKlotskiGame);
    }
}

/**
 * 打乱华容道拼图
 */
function shuffleKlotski() {
    // 随机移动空白格子100次
    for (let i = 0; i < 100; i++) {
        const possibleMoves = getPossibleMoves(emptyIndex);
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [klotskiPieces[emptyIndex], klotskiPieces[randomMove]] = 
        [klotskiPieces[randomMove], klotskiPieces[emptyIndex]];
        emptyIndex = randomMove;
    }
}

/**
 * 获取可能的移动位置
 */
function getPossibleMoves(emptyIndex) {
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    // 上
    if (row > 0) moves.push(emptyIndex - 3);
    // 下
    if (row < 2) moves.push(emptyIndex + 3);
    // 左
    if (col > 0) moves.push(emptyIndex - 1);
    // 右
    if (col < 2) moves.push(emptyIndex + 1);
    
    return moves;
}

/**
 * 移动拼图块
 */
function moveKlotskiPiece() {
    // 开始计时
    if (!klotskiStartTime) {
        klotskiStartTime = Date.now();
        klotskiTimerInterval = setInterval(updateKlotskiTimer, 1000);
    }
    
    const clickedIndex = parseInt(this.dataset.index);
    const possibleMoves = getPossibleMoves(emptyIndex);
    
    if (possibleMoves.includes(clickedIndex)) {
        // 移动拼图块
        [klotskiPieces[clickedIndex], klotskiPieces[emptyIndex]] = 
        [klotskiPieces[emptyIndex], klotskiPieces[clickedIndex]];
        
        // 更新显示
        updateKlotskiDisplay();
        
        // 更新移动次数
        klotskiMoves++;
        document.getElementById('klotski-moves').textContent = klotskiMoves;
        
        // 检查是否完成
        if (isKlotskiComplete()) {
            clearInterval(klotskiTimerInterval);
            // 记录游戏时间
            const elapsedMinutes = Math.ceil((Date.now() - klotskiStartTime) / (1000 * 60));
            recordGameTime(elapsedMinutes);
            
            setTimeout(() => {
                alert(`恭喜你完成了华容道！\n用时：${document.getElementById('klotski-time').textContent}\n移动次数：${klotskiMoves}`);
            }, 500);
        }
    }
}

/**
 * 更新华容道显示
 */
function updateKlotskiDisplay() {
    const container = document.getElementById('klotski-container');
    container.innerHTML = '';
    
    klotskiPieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'klotski-piece';
        if (piece === null) {
            pieceElement.classList.add('empty');
            emptyIndex = index;
        } else {
            pieceElement.textContent = piece;
            pieceElement.dataset.index = index;
            pieceElement.addEventListener('click', moveKlotskiPiece);
        }
        container.appendChild(pieceElement);
    });
}

/**
 * 检查华容道是否完成
 */
function isKlotskiComplete() {
    return klotskiPieces.every((piece, index) => {
        if (index === klotskiPieces.length - 1) {
            return piece === null;
        }
        return piece === index + 1;
    });
}

/**
 * 更新华容道计时器
 */
function updateKlotskiTimer() {
    const timeDisplay = document.getElementById('klotski-time');
    const elapsed = Math.floor((Date.now() - klotskiStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
    
    // 每完成一分钟记录一次游戏时间
    if (elapsed % 60 === 0) {
        recordGameTime(1);
    }
}

/**
 * 游戏模块 - 记忆配对游戏
 */
let memoryMoves = 0;
let memoryPairs = 0;
let memoryStartTime = null;
let memoryTimerInterval = null;
let flippedCards = [];
let matchedPairs = 0;

// 记忆配对游戏卡片数据
const memoryCards = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
];

/**
 * 初始化记忆配对游戏
 */
function initMemoryGame() {
    const container = document.getElementById('memory-container');
    const restartBtn = document.getElementById('restart-memory-btn');
    const movesDisplay = document.getElementById('memory-moves');
    const pairsDisplay = document.getElementById('memory-pairs');
    
    if (!container) return;
    
    // 重置游戏状态
    memoryMoves = 0;
    memoryPairs = 0;
    memoryStartTime = null;
    if (memoryTimerInterval) {
        clearInterval(memoryTimerInterval);
    }
    flippedCards = [];
    matchedPairs = 0;
    
    movesDisplay.textContent = '0';
    pairsDisplay.textContent = '0';
    
    // 清空容器
    container.innerHTML = '';
    
    // 打乱卡片
    const shuffledCards = shuffleArray([...memoryCards]);
    
    // 添加卡片
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.card = card;
        cardElement.dataset.index = index;
        
        const frontElement = document.createElement('div');
        frontElement.className = 'memory-card-front';
        frontElement.textContent = '?';
        
        const backElement = document.createElement('div');
        backElement.className = 'memory-card-back';
        backElement.textContent = card;
        
        cardElement.appendChild(frontElement);
        cardElement.appendChild(backElement);
        
        cardElement.addEventListener('click', flipCard);
        container.appendChild(cardElement);
    });
    
    // 重新开始按钮事件
    if (restartBtn) {
        restartBtn.addEventListener('click', initMemoryGame);
    }
}

/**
 * 翻转卡片
 */
function flipCard() {
    // 如果已经翻开两张卡片，或者这张卡片已经翻开或已配对，则返回
    if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    // 开始计时
    if (!memoryStartTime) {
        memoryStartTime = Date.now();
        memoryTimerInterval = setInterval(updateMemoryTimer, 1000);
    }
    
    // 翻转卡片
    this.classList.add('flipped');
    flippedCards.push(this);
    
    // 更新翻牌次数
    memoryMoves++;
    document.getElementById('memory-moves').textContent = memoryMoves;
    
    // 如果翻开了两张卡片，检查是否匹配
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

/**
 * 检查卡片是否匹配
 */
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.card === card2.dataset.card;
    
    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('memory-pairs').textContent = matchedPairs;
        
        // 检查是否完成游戏
        if (matchedPairs === memoryCards.length / 2) {
            clearInterval(memoryTimerInterval);
            setTimeout(() => {
                alert(`恭喜你完成了记忆配对游戏！\n用时：${document.getElementById('memory-time').textContent}\n翻牌次数：${memoryMoves}`);
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    flippedCards = [];
}

/**
 * 更新记忆配对游戏计时器
 */
function updateMemoryTimer() {
    const timeDisplay = document.getElementById('memory-time');
    const elapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

/**
 * 游戏模块 - 拼图游戏
 */
let puzzleMoves = 0;
let puzzleStartTime = null;
let puzzleTimerInterval = null;
let puzzlePieces = [];
let emptyPieceIndex = 8;

// 拼图游戏图片
const puzzleImage = 'img/puzzle.jpg';

/**
 * 初始化拼图游戏
 */
function initPuzzleGame() {
    const container = document.getElementById('puzzle-container');
    const restartBtn = document.getElementById('restart-puzzle-btn');
    const movesDisplay = document.getElementById('puzzle-moves');
    const timeDisplay = document.getElementById('puzzle-time');
    
    if (!container) return;
    
    // 重置游戏状态
    puzzleMoves = 0;
    puzzleStartTime = null;
    if (puzzleTimerInterval) {
        clearInterval(puzzleTimerInterval);
    }
    puzzlePieces = [0, 1, 2, 3, 4, 5, 6, 7, null];
    emptyPieceIndex = 8;
    
    movesDisplay.textContent = '0';
    timeDisplay.textContent = '00:00';
    
    // 清空容器
    container.innerHTML = '';
    
    // 打乱拼图
    shufflePuzzle();
    
    // 添加拼图块
    puzzlePieces.forEach((piece, index) => {
        if (piece !== null) {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.dataset.index = index;
            
            // 设置拼图块背景图片位置
            const row = Math.floor(piece / 3);
            const col = piece % 3;
            pieceElement.style.backgroundImage = `url(${puzzleImage})`;
            pieceElement.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
            
            pieceElement.addEventListener('click', movePuzzlePiece);
            container.appendChild(pieceElement);
        }
    });
    
    // 重新开始按钮事件
    if (restartBtn) {
        restartBtn.addEventListener('click', initPuzzleGame);
    }
}

/**
 * 打乱拼图
 */
function shufflePuzzle() {
    // 随机移动空白格子100次
    for (let i = 0; i < 100; i++) {
        const possibleMoves = getPossibleMoves(emptyPieceIndex);
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [puzzlePieces[emptyPieceIndex], puzzlePieces[randomMove]] = 
        [puzzlePieces[randomMove], puzzlePieces[emptyPieceIndex]];
        emptyPieceIndex = randomMove;
    }
}

/**
 * 移动拼图块
 */
function movePuzzlePiece() {
    // 开始计时
    if (!puzzleStartTime) {
        puzzleStartTime = Date.now();
        puzzleTimerInterval = setInterval(updatePuzzleTimer, 1000);
    }
    
    const clickedIndex = parseInt(this.dataset.index);
    const possibleMoves = getPossibleMoves(emptyPieceIndex);
    
    if (possibleMoves.includes(clickedIndex)) {
        // 移动拼图块
        [puzzlePieces[clickedIndex], puzzlePieces[emptyPieceIndex]] = 
        [puzzlePieces[emptyPieceIndex], puzzlePieces[clickedIndex]];
        
        // 更新显示
        updatePuzzleDisplay();
        
        // 更新移动次数
        puzzleMoves++;
        document.getElementById('puzzle-moves').textContent = puzzleMoves;
        
        // 检查是否完成
        if (isPuzzleComplete()) {
            clearInterval(puzzleTimerInterval);
            setTimeout(() => {
                alert(`恭喜你完成了拼图游戏！\n用时：${document.getElementById('puzzle-time').textContent}\n移动次数：${puzzleMoves}`);
            }, 500);
        }
    }
}

/**
 * 更新拼图显示
 */
function updatePuzzleDisplay() {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    
    puzzlePieces.forEach((piece, index) => {
        if (piece !== null) {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.dataset.index = index;
            
            // 设置拼图块背景图片位置
            const row = Math.floor(piece / 3);
            const col = piece % 3;
            pieceElement.style.backgroundImage = `url(${puzzleImage})`;
            pieceElement.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
            
            pieceElement.addEventListener('click', movePuzzlePiece);
            container.appendChild(pieceElement);
        } else {
            emptyPieceIndex = index;
        }
    });
}

/**
 * 检查拼图是否完成
 */
function isPuzzleComplete() {
    return puzzlePieces.every((piece, index) => {
        if (index === puzzlePieces.length - 1) {
            return piece === null;
        }
        return piece === index;
    });
}

/**
 * 更新拼图游戏计时器
 */
function updatePuzzleTimer() {
    const timeDisplay = document.getElementById('puzzle-time');
    const elapsed = Math.floor((Date.now() - puzzleStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

/**
 * 游戏模块 - 找不同游戏
 */
let spotDifferenceStartTime = null;
let spotDifferenceTimerInterval = null;
let differencesFound = 0;

// 找不同游戏的差异点坐标
const differenceSpots = [
    { x: 100, y: 150 },
    { x: 250, y: 200 },
    { x: 400, y: 300 },
    { x: 550, y: 250 },
    { x: 700, y: 350 }
];

/**
 * 初始化找不同游戏
 */
function initSpotDifferenceGame() {
    const container = document.getElementById('spot-difference-container');
    const restartBtn = document.getElementById('restart-spot-difference-btn');
    const foundDisplay = document.getElementById('differences-found');
    const timeDisplay = document.getElementById('spot-difference-time');
    
    if (!container) return;
    
    // 重置游戏状态
    spotDifferenceStartTime = null;
    if (spotDifferenceTimerInterval) {
        clearInterval(spotDifferenceTimerInterval);
    }
    differencesFound = 0;
    
    foundDisplay.textContent = '0';
    timeDisplay.textContent = '00:00';
    
    // 清空容器
    container.innerHTML = `
        <div class="image-container">
            <img src="img/spot-difference-1.png" alt="图片1" class="difference-image">
            <img src="img/spot-difference-2.png" alt="图片2" class="difference-image">
        </div>
    `;
    
    // 添加点击事件
    const images = container.getElementsByClassName('difference-image');
    Array.from(images).forEach(image => {
        image.addEventListener('click', checkDifference);
    });
    
    // 重新开始按钮事件
    if (restartBtn) {
        restartBtn.addEventListener('click', initSpotDifferenceGame);
    }
}

/**
 * 检查点击位置是否在差异点上
 */
function checkDifference(e) {
    // 开始计时
    if (!spotDifferenceStartTime) {
        spotDifferenceStartTime = Date.now();
        spotDifferenceTimerInterval = setInterval(updateSpotDifferenceTimer, 1000);
    }
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查是否点击到差异点
    const spot = differenceSpots.find(spot => {
        const dx = Math.abs(spot.x - x);
        const dy = Math.abs(spot.y - y);
        return dx < 20 && dy < 20;
    });
    
    if (spot) {
        // 标记已找到的差异点
        const spotElement = document.createElement('div');
        spotElement.className = 'difference-spot';
        spotElement.style.left = `${spot.x - 10}px`;
        spotElement.style.top = `${spot.y - 10}px`;
        e.target.parentElement.appendChild(spotElement);
        
        // 更新找到的差异点数量
        differencesFound++;
        document.getElementById('differences-found').textContent = differencesFound;
        
        // 检查是否完成游戏
        if (differencesFound === differenceSpots.length) {
            clearInterval(spotDifferenceTimerInterval);
            setTimeout(() => {
                alert(`恭喜你找到了所有不同！\n用时：${document.getElementById('spot-difference-time').textContent}`);
            }, 500);
        }
    }
}

/**
 * 更新找不同游戏计时器
 */
function updateSpotDifferenceTimer() {
    const timeDisplay = document.getElementById('spot-difference-time');
    const elapsed = Math.floor((Date.now() - spotDifferenceStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

// 添加游戏标签切换事件
document.addEventListener('DOMContentLoaded', function() {
    const gameTabs = document.querySelectorAll('.game-tab');
    gameTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的活跃状态
            gameTabs.forEach(t => t.classList.remove('active'));
            // 设置当前标签为活跃状态
            this.classList.add('active');
            
            // 隐藏所有游戏区域
            document.querySelectorAll('.game-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // 显示对应的游戏区域
            const gameId = this.dataset.game;
            document.getElementById(`${gameId}-game`).classList.add('active');
            
            // 初始化对应的游戏
            switch (gameId) {
                case 'klotski':
                    initKlotskiGame();
                    break;
                case 'memory':
                    initMemoryGame();
                    break;
                case 'puzzle':
                    initPuzzleGame();
                    break;
                case 'spot-difference':
                    initSpotDifferenceGame();
                    break;
            }
        });
    });
});
