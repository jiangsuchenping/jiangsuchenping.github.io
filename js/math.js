// 艾宾浩斯记忆法复习间隔（分钟）
const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

let score = 0;
let total = 0;
let currentProblem = null;
let nextReviewTime = null;
let reviewTimer = null;

// 从本地存储加载练习数据
function loadPracticeData() {
  const data = localStorage.getItem('mathPracticeData');
  if (data) {
    return JSON.parse(data);
  }
  return {};
}

// 保存练习数据到本地存储
function savePracticeData(data) {
  localStorage.setItem('mathPracticeData', JSON.stringify(data));
}

// 获取下一个复习时间
function getNextReviewTime(round) {
  const now = new Date();
  const interval = REVIEW_INTERVALS[round] || REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1];
  return new Date(now.getTime() + interval * 60000);
}

// 更新练习数据
function updatePracticeData(problem, isCorrect) {
  const data = loadPracticeData();
  const problemKey = `${problem.num1}${problem.operator}${problem.num2}`;
  
  if (!data[problemKey]) {
    data[problemKey] = {
      problem: problem,
      totalTests: 0,
      correctCount: 0,
      round: 0,
      lastTestTime: new Date().toISOString(),
      nextReviewTime: getNextReviewTime(0).toISOString()
    };
  }
  
  data[problemKey].totalTests++;
  if (isCorrect) {
    data[problemKey].correctCount++;
    data[problemKey].round = Math.min(data[problemKey].round + 1, REVIEW_INTERVALS.length - 1);
  } else {
    data[problemKey].round = Math.max(data[problemKey].round - 1, 0);
  }
  
  data[problemKey].lastTestTime = new Date().toISOString();
  data[problemKey].nextReviewTime = getNextReviewTime(data[problemKey].round).toISOString();
  
  savePracticeData(data);
  return data[problemKey];
}

// 获取需要练习的题目
function getProblemsToPractice() {
  const data = loadPracticeData();
  const now = new Date();
  const problems = [];
  
  // 生成所有可能的20以内加减法题目
  for (let i = 0; i <= 20; i++) {
    for (let j = 0; j <= 20; j++) {
      if (i + j <= 20) {
        problems.push({ num1: i, operator: '+', num2: j });
      }
      if (i - j >= 0) {
        problems.push({ num1: i, operator: '-', num2: j });
      }
    }
  }
  
  // 过滤出需要练习的题目
  return problems.filter(problem => {
    const problemKey = `${problem.num1}${problem.operator}${problem.num2}`;
    const problemData = data[problemKey];
    if (!problemData) return true;
    return new Date(problemData.nextReviewTime) <= now;
  });
}

// 更新倒计时显示
function updateCountdown() {
  if (!nextReviewTime) return;
  
  const now = new Date();
  const diff = nextReviewTime - now;
  
  if (diff <= 0) {
    clearInterval(reviewTimer);
    loadMath(document.getElementById('module-content'));
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
}

function generateProblem() {
  const problemsToPractice = getProblemsToPractice();
  if (problemsToPractice.length === 0) {
    return null;
  }
  return problemsToPractice[Math.floor(Math.random() * problemsToPractice.length)];
}

function generateOptions(problem) {
  const answer = problem.operator === '+' ? problem.num1 + problem.num2 : problem.num1 - problem.num2;
  const options = [answer];
  
  while (options.length < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const newOption = answer + (offset * sign);
    
    if (newOption >= 0 && newOption <= 20 && !options.includes(newOption)) {
      options.push(newOption);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function loadMath(container) {
  const problem = generateProblem();
  if (!problem) {
    container.innerHTML = `
      <h2>数学乐园</h2>
      <div class="rest-message">
        <p>今天的练习已经完成啦！</p>
        <p>休息一下，稍后再来练习吧！</p>
      </div>
      <div class="countdown"></div>
      <button class="return-btn" onclick="showModule('')">返回首页</button>
    `;
    
    // 设置下一次复习时间
    const data = loadPracticeData();
    const nextTimes = Object.values(data).map(d => new Date(d.nextReviewTime));
    nextReviewTime = new Date(Math.min(...nextTimes));
    updateCountdown();
    return;
  }
  
  currentProblem = problem;
  const options = generateOptions(problem);
  const problemData = loadPracticeData()[`${problem.num1}${problem.operator}${problem.num2}`] || {
    totalTests: 0,
    correctCount: 0,
    round: 0
  };
  
  const accuracy = problemData.totalTests > 0 
    ? Math.round((problemData.correctCount / problemData.totalTests) * 100) 
    : 0;
  
  container.innerHTML = `
    <h2>数学乐园</h2>
    <div class="progress">
      <div>得分: ${score}/${total}</div>
      <div>练习次数: ${problemData.totalTests} | 正确率: ${accuracy}%</div>
    </div>
    <div class="problem">
      <div class="numbers">${problem.num1} ${problem.operator} ${problem.num2} = ?</div>
    </div>
    <div class="options">
      ${options.map(option => `
        <button class="option-btn" onclick="handleAnswer(${option})">${option}</button>
      `).join('')}
    </div>
    <div class="feedback"></div>
    <button class="return-btn" onclick="showModule('')">返回首页</button>
  `;
}

function handleAnswer(selectedAnswer) {
  const correctAnswer = currentProblem.operator === '+' 
    ? currentProblem.num1 + currentProblem.num2 
    : currentProblem.num1 - currentProblem.num2;
  
  const isCorrect = selectedAnswer === correctAnswer;
  const problemData = updatePracticeData(currentProblem, isCorrect);
  
  total++;
  if (isCorrect) {
    score++;
  }
  
  const feedback = document.querySelector('.feedback');
  feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
  feedback.textContent = isCorrect ? '太棒了！' : `正确答案是 ${correctAnswer}`;
  
  setTimeout(() => {
    loadMath(document.getElementById('module-content'));
  }, 2000);
} 