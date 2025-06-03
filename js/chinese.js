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

window.currentWord = null;
let nextReviewTime = null;
let reviewTimer = null;

// 从本地存储加载练习数据
function loadPracticeData() {
  try {
    const data = localStorage.getItem('chinesePracticeData');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('加载练习数据失败:', error);
    return {};
  }
}

// 保存练习数据到本地存储
function savePracticeData(data) {
  try {
    localStorage.setItem('chinesePracticeData', JSON.stringify(data));
  } catch (error) {
    console.error('保存练习数据失败:', error);
  }
}

// 获取下一个复习时间
function getNextReviewTime(round) {
  const now = new Date();
  const interval = REVIEW_INTERVALS[round] || REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1];
  return new Date(now.getTime() + interval * 60000);
}

// 更新练习数据
function updatePracticeData(word, isCorrect) {
  try {
    const data = loadPracticeData();
    const wordKey = word.char;
    
    if (!data[wordKey]) {
      data[wordKey] = {
        word: word,
        totalTests: 0,
        correctCount: 0,
        round: 0,
        lastTestTime: new Date().toISOString(),
        nextReviewTime: getNextReviewTime(0).toISOString()
      };
    }
    
    data[wordKey].totalTests++;
    if (isCorrect) {
      data[wordKey].correctCount++;
      data[wordKey].round = Math.min(data[wordKey].round + 1, REVIEW_INTERVALS.length - 1);
    } else {
      data[wordKey].round = Math.max(data[wordKey].round - 1, 0);
    }
    
    data[wordKey].lastTestTime = new Date().toISOString();
    data[wordKey].nextReviewTime = getNextReviewTime(data[wordKey].round).toISOString();
    
    savePracticeData(data);
    return data[wordKey];
  } catch (error) {
    console.error('更新练习数据失败:', error);
    return null;
  }
}

// 获取需要练习的汉字
function getWordsToPractice() {
  try {
    const data = loadPracticeData();
    const now = new Date();
    
    // 过滤出需要练习的汉字
    const wordsToPractice = chineseWords.filter(word => {
      const wordData = data[word.char];
      if (!wordData) return true;
      return new Date(wordData.nextReviewTime) <= now;
    });

    // 如果没有需要练习的汉字，返回所有汉字
    return wordsToPractice.length > 0 ? wordsToPractice : chineseWords;
  } catch (error) {
    console.error('获取练习汉字失败:', error);
    return chineseWords;
  }
}

// 更新倒计时显示
function updateCountdown() {
  try {
    if (!nextReviewTime) return;
    
    const now = new Date();
    const diff = nextReviewTime - now;
    
    if (diff <= 0) {
      clearInterval(reviewTimer);
      if (typeof window.loadChinese === 'function') {
        window.loadChinese(document.getElementById('module-content'));
      }
      return;
    }
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    const countdownElement = document.querySelector('.countdown');
    if (countdownElement) {
      countdownElement.textContent = `下次练习时间：${minutes}分${seconds}秒`;
    }
    
    // 根据剩余时间调整更新频率
    if (diff > 60000) {
      clearInterval(reviewTimer);
      reviewTimer = setInterval(updateCountdown, 60000); // 每分钟更新
    } else {
      clearInterval(reviewTimer);
      reviewTimer = setInterval(updateCountdown, 1000); // 每秒更新
    }
  } catch (error) {
    console.error('更新倒计时失败:', error);
  }
}

// 获取历史记录
function getHistory() {
  try {
    const data = loadPracticeData();
    const history = [];
    
    for (const [key, value] of Object.entries(data)) {
      history.push({
        word: value.word.char,
        pinyin: value.word.pinyin,
        totalTests: value.totalTests,
        correctCount: value.correctCount,
        accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0,
        lastTestTime: new Date(value.lastTestTime).toLocaleString(),
        nextReviewTime: new Date(value.nextReviewTime).toLocaleString()
      });
    }
    
    return history.sort((a, b) => new Date(b.lastTestTime) - new Date(a.lastTestTime));
  } catch (error) {
    console.error('获取历史记录失败:', error);
    return [];
  }
}

// 将函数绑定到window对象
window.loadChinese = function(container) {
  try {
    if (!container) {
      console.error('容器元素不存在');
      return;
    }

    container.innerHTML = `
      <h2>语文乐园</h2>
      <div class="chinese-container">
        <p>更多功能，敬请期待！</p>
      </div>
      <button class="return-btn" onclick="window.showModule('')">返回首页</button>
    `;
  } catch (error) {
    console.error('加载语文模块失败:', error);
    container.innerHTML = `
      <h2>语文乐园</h2>
      <p>加载失败，请刷新页面重试。</p>
      <button class="return-btn" onclick="window.showModule('')">返回首页</button>
    `;
  }
};

window.handleAnswer = function(isCorrect) {
  try {
    const container = document.getElementById('module-content');
    if (!container) {
      console.error('容器元素不存在');
      return;
    }

    if (!window.currentWord) {
      console.error('当前没有汉字');
      const feedback = container.querySelector('.feedback');
      if (feedback) {
        feedback.className = 'feedback wrong';
        feedback.textContent = '题目加载失败，请刷新页面重试';
      }
      // 重新加载页面
      setTimeout(() => {
        if (typeof window.loadChinese === 'function') {
          window.loadChinese(container);
        }
      }, 2000);
      return;
    }

    const problemData = updatePracticeData(window.currentWord, isCorrect);
    if (!problemData) {
      console.error('更新练习数据失败');
      const feedback = container.querySelector('.feedback');
      if (feedback) {
        feedback.className = 'feedback wrong';
        feedback.textContent = '保存练习记录失败，请刷新页面重试';
      }
      return;
    }
    
    const feedback = container.querySelector('.feedback');
    if (feedback) {
      feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
      feedback.textContent = isCorrect ? '太棒了！' : '继续加油！';
    }
    
    // 清除当前汉字状态
    window.currentWord = null;
    
    // 延迟加载新题目
    setTimeout(() => {
      if (typeof window.loadChinese === 'function') {
        window.loadChinese(container);
      }
    }, 2000);
  } catch (error) {
    console.error('处理答案失败:', error);
    const container = document.getElementById('module-content');
    if (container) {
      const feedback = container.querySelector('.feedback');
      if (feedback) {
        feedback.className = 'feedback wrong';
        feedback.textContent = '发生错误，请刷新页面重试';
      }
      // 发生错误时重新加载页面
      setTimeout(() => {
        if (typeof window.loadChinese === 'function') {
          window.loadChinese(container);
        }
      }, 2000);
    }
  }
}; 