const chineseWords = [
  { char: '日', pinyin: 'rì', words: ['日子', '日记', '日历'] },
  { char: '月', pinyin: 'yuè', words: ['月亮', '月饼', '月光'] },
  { char: '山', pinyin: 'shān', words: ['山峰', '山水', '高山'] },
  { char: '水', pinyin: 'shuǐ', words: ['水果', '水杯', '喝水'] },
  { char: '木', pinyin: 'mù', words: ['树木', '木头', '木马'] },
  { char: '火', pinyin: 'huǒ', words: ['火车', '火柴', '火锅'] },
  { char: '土', pinyin: 'tǔ', words: ['土地', '泥土', '土豆'] },
  { char: '人', pinyin: 'rén', words: ['人民', '人们', '好人'] }
];

// 艾宾浩斯记忆法复习间隔（分钟）
const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

let currentIndex = 0;
let learnedWords = new Set();
let forgottenWords = new Set();
let nextReviewTime = null;
let reviewTimer = null;

// 从本地存储加载学习数据
function loadLearningData() {
  const data = localStorage.getItem('chineseLearningData');
  if (data) {
    return JSON.parse(data);
  }
  return {};
}

// 保存学习数据到本地存储
function saveLearningData(data) {
  localStorage.setItem('chineseLearningData', JSON.stringify(data));
}

// 获取下一个复习时间
function getNextReviewTime(round) {
  const now = new Date();
  const interval = REVIEW_INTERVALS[round] || REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1];
  return new Date(now.getTime() + interval * 60000);
}

// 更新学习数据
function updateLearningData(char, isCorrect) {
  const data = loadLearningData();
  if (!data[char]) {
    data[char] = {
      totalTests: 0,
      correctCount: 0,
      round: 0,
      lastTestTime: new Date().toISOString(),
      nextReviewTime: getNextReviewTime(0).toISOString()
    };
  }
  
  data[char].totalTests++;
  if (isCorrect) {
    data[char].correctCount++;
    data[char].round = Math.min(data[char].round + 1, REVIEW_INTERVALS.length - 1);
  } else {
    data[char].round = Math.max(data[char].round - 1, 0);
  }
  
  data[char].lastTestTime = new Date().toISOString();
  data[char].nextReviewTime = getNextReviewTime(data[char].round).toISOString();
  
  saveLearningData(data);
  return data[char];
}

// 获取需要复习的汉字
function getWordsToReview() {
  const data = loadLearningData();
  const now = new Date();
  return chineseWords.filter(word => {
    const wordData = data[word.char];
    if (!wordData) return true;
    return new Date(wordData.nextReviewTime) <= now;
  });
}

// 更新倒计时显示
function updateCountdown() {
  if (!nextReviewTime) return;
  
  const now = new Date();
  const diff = nextReviewTime - now;
  
  if (diff <= 0) {
    clearInterval(reviewTimer);
    loadChinese(document.getElementById('module-content'));
    return;
  }
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  const countdownElement = document.querySelector('.countdown');
  if (countdownElement) {
    countdownElement.textContent = `下次学习时间：${minutes}分${seconds}秒`;
  }
  
  // 根据剩余时间调整更新频率
  if (diff > 60000) {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(updateCountdown, 60000); // 每分钟更新
  } else {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(updateCountdown, 1000); // 每秒更新
  }
}

function loadChinese(container) {
  const wordsToReview = getWordsToReview();
  if (wordsToReview.length === 0) {
    container.innerHTML = `
      <h2>语文乐园</h2>
      <div class="rest-message">
        <p>今天的任务已经完成啦！</p>
        <p>休息一下，稍后再来学习吧！</p>
      </div>
      <div class="countdown"></div>
      <button class="return-btn" onclick="showModule('')">返回首页</button>
    `;
    
    // 设置下一次复习时间
    const data = loadLearningData();
    const nextTimes = Object.values(data).map(d => new Date(d.nextReviewTime));
    nextReviewTime = new Date(Math.min(...nextTimes));
    updateCountdown();
    return;
  }
  
  currentIndex = chineseWords.indexOf(wordsToReview[Math.floor(Math.random() * wordsToReview.length)]);
  const wordData = loadLearningData()[chineseWords[currentIndex].char] || {
    totalTests: 0,
    correctCount: 0,
    round: 0
  };
  
  const accuracy = wordData.totalTests > 0 
    ? Math.round((wordData.correctCount / wordData.totalTests) * 100) 
    : 0;
  
  container.innerHTML = `
    <h2>语文乐园</h2>
    <div class="progress">
      <div>已学习: ${learnedWords.size}/${chineseWords.length} 个汉字</div>
      <div>检测次数: ${wordData.totalTests} | 正确率: ${accuracy}%</div>
    </div>
    <div class="chinese-container">
      <div class="word-card">
        <div class="char">${chineseWords[currentIndex].char}</div>
        <div class="pinyin">${chineseWords[currentIndex].pinyin}</div>
        <div class="words">
          ${chineseWords[currentIndex].words.map(word => 
            `<span class="word-item">${word}</span>`
          ).join('')}
        </div>
      </div>
      <div class="controls">
        <button onclick="markAsLearned()" class="learn-btn">认识</button>
        <button onclick="markAsForgotten()" class="forget-btn">忘记</button>
      </div>
    </div>
    <button class="return-btn" onclick="showModule('')">返回首页</button>
  `;
}

function markAsLearned() {
  learnedWords.add(chineseWords[currentIndex].char);
  forgottenWords.delete(chineseWords[currentIndex].char);
  
  const wordData = updateLearningData(chineseWords[currentIndex].char, true);
  
  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  feedback.textContent = '太棒了！继续加油！';
  document.querySelector('.chinese-container').appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
    loadChinese(document.getElementById('module-content'));
  }, 2000);
}

function markAsForgotten() {
  forgottenWords.add(chineseWords[currentIndex].char);
  learnedWords.delete(chineseWords[currentIndex].char);
  
  const wordData = updateLearningData(chineseWords[currentIndex].char, false);
  
  const feedback = document.createElement('div');
  feedback.className = 'feedback';
  feedback.textContent = '没关系，我们再来一次！';
  document.querySelector('.chinese-container').appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
    loadChinese(document.getElementById('module-content'));
  }, 2000);
} 