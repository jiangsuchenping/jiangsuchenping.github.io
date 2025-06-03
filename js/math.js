(function() {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

  window.currentProblem = null;
  let nextReviewTime = null;
  let reviewTimer = null;

  // 从本地存储加载练习数据
  function loadPracticeData() {
    try {
      const data = localStorage.getItem('mathPracticeData');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('加载练习数据失败:', error);
      return {};
    }
  }

  // 保存练习数据到本地存储
  function savePracticeData(data) {
    try {
      localStorage.setItem('mathPracticeData', JSON.stringify(data));
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
  function updatePracticeData(problem, isCorrect) {
    try {
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
    } catch (error) {
      console.error('更新练习数据失败:', error);
      return null;
    }
  }

  // 获取需要练习的题目
  function getProblemsToPractice() {
    try {
      const data = loadPracticeData();
      const now = new Date();
      const problems = [];
      
      // 生成新的题目
      for (let i = 0; i < 10; i++) {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = Math.random() < 0.5 ? '+' : '-';
        
        // 如果是减法，确保第一个数大于等于第二个数
        const problem = {
          num1: operator === '-' ? Math.max(num1, num2) : num1,
          num2: operator === '-' ? Math.min(num1, num2) : num2,
          operator: operator,
          answer: operator === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2)
        };
        problems.push(problem);
      }
      
      // 如果没有需要复习的题目，返回新生成的题目
      const reviewProblems = problems.filter(problem => {
        const problemKey = `${problem.num1}${problem.operator}${problem.num2}`;
        const problemData = data[problemKey];
        if (!problemData) return true;
        return new Date(problemData.nextReviewTime) <= now;
      });

      return reviewProblems.length > 0 ? reviewProblems : problems;
    } catch (error) {
      console.error('获取练习题目失败:', error);
      // 发生错误时返回新生成的题目
      const problems = [];
      for (let i = 0; i < 10; i++) {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = Math.random() < 0.5 ? '+' : '-';
        
        // 如果是减法，确保第一个数大于等于第二个数
        const problem = {
          num1: operator === '-' ? Math.max(num1, num2) : num1,
          num2: operator === '-' ? Math.min(num1, num2) : num2,
          operator: operator,
          answer: operator === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2)
        };
        problems.push(problem);
      }
      return problems;
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
        if (typeof window.loadMath === 'function') {
          window.loadMath(document.getElementById('module-content'));
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
          problem: value.problem,
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
  window.loadMath = function(container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      const problemsToPractice = getProblemsToPractice();
      if (problemsToPractice.length === 0) {
        container.innerHTML = `
          <h2>数学乐园</h2>
          <div class="rest-message">
            <p>今天的练习已经完成啦！</p>
            <p>休息一下，稍后再来练习吧！</p>
          </div>
          <div class="countdown"></div>
          <div class="history-section">
            <h3>练习历史</h3>
            <div class="history-list"></div>
          </div>
          <button class="return-btn" onclick="window.showModule('')">返回首页</button>
        `;
        
        // 设置下一次复习时间
        const data = loadPracticeData();
        const nextTimes = Object.values(data).map(d => new Date(d.nextReviewTime));
        nextReviewTime = new Date(Math.min(...nextTimes));
        updateCountdown();
        
        // 显示历史记录
        const historyList = container.querySelector('.history-list');
        const history = getHistory();
        if (history.length > 0) {
          historyList.innerHTML = `
            <table class="history-table">
              <thead>
                <tr>
                  <th>题目</th>
                  <th>练习次数</th>
                  <th>正确率</th>
                  <th>上次练习</th>
                  <th>下次复习</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(item => `
                  <tr>
                    <td>${item.problem.num1} ${item.problem.operator} ${item.problem.num2} = ?</td>
                    <td>${item.totalTests}</td>
                    <td>${item.accuracy}%</td>
                    <td>${item.lastTestTime}</td>
                    <td>${item.nextReviewTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        } else {
          historyList.innerHTML = '<p class="no-history">还没有练习记录哦，开始练习吧！</p>';
        }
        window.currentProblem = null;
        return;
      }
      
      // 随机选择一个题目
      const randomIndex = Math.floor(Math.random() * problemsToPractice.length);
      window.currentProblem = problemsToPractice[randomIndex];
      
      if (!window.currentProblem) {
        console.error('无法生成题目');
        container.innerHTML = `
          <h2>数学乐园</h2>
          <p>题目生成失败，请刷新页面重试。</p>
          <button class="return-btn" onclick="window.showModule('')">返回首页</button>
        `;
        return;
      }
      
      container.innerHTML = `
        <h2>数学乐园</h2>
        <div class="problem-display">
          ${window.currentProblem.num1} ${window.currentProblem.operator} ${window.currentProblem.num2} = ?
        </div>
        <div class="options">
          <button onclick="window.handleAnswer(${window.currentProblem.answer})">${window.currentProblem.answer}</button>
          <button onclick="window.handleAnswer(${window.currentProblem.answer + 1})">${window.currentProblem.answer + 1}</button>
          <button onclick="window.handleAnswer(${window.currentProblem.answer - 1})">${window.currentProblem.answer - 1}</button>
          <button onclick="window.handleAnswer(${window.currentProblem.answer + 2})">${window.currentProblem.answer + 2}</button>
        </div>
        <div class="feedback"></div>
        <div class="history-section">
          <h3>练习历史</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;
      
      // 显示历史记录
      const historyList = container.querySelector('.history-list');
      const history = getHistory();
      if (history.length > 0) {
        historyList.innerHTML = `
          <table class="history-table">
            <thead>
              <tr>
                <th>题目</th>
                <th>练习次数</th>
                <th>正确率</th>
                <th>上次练习</th>
                <th>下次复习</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(item => `
                <tr>
                  <td>${item.problem.num1} ${item.problem.operator} ${item.problem.num2} = ?</td>
                  <td>${item.totalTests}</td>
                  <td>${item.accuracy}%</td>
                  <td>${item.lastTestTime}</td>
                  <td>${item.nextReviewTime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else {
        historyList.innerHTML = '<p class="no-history">还没有练习记录哦，开始练习吧！</p>';
      }
    } catch (error) {
      console.error('加载数学模块失败:', error);
      window.currentProblem = null;
      container.innerHTML = `
        <h2>数学乐园</h2>
        <p>加载失败，请刷新页面重试。</p>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;
    }
  };

  window.handleAnswer = function(answer) {
    try {
      if (!window.currentProblem) {
        console.error('当前没有题目');
        const feedback = document.querySelector('.feedback');
        if (feedback) {
          feedback.className = 'feedback wrong';
          feedback.textContent = '题目加载失败，请刷新页面重试';
        }
        return;
      }

      const isCorrect = answer === window.currentProblem.answer;
      const problemData = updatePracticeData(window.currentProblem, isCorrect);
      
      const feedback = document.querySelector('.feedback');
      if (feedback) {
        feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.textContent = isCorrect ? '太棒了！' : '继续加油！';
      }
      
      setTimeout(() => {
        if (typeof window.loadMath === 'function') {
          window.loadMath(document.getElementById('module-content'));
        }
      }, 2000);
    } catch (error) {
      console.error('处理答案失败:', error);
      const feedback = document.querySelector('.feedback');
      if (feedback) {
        feedback.className = 'feedback wrong';
        feedback.textContent = '发生错误，请刷新页面重试';
      }
    }
  };
})(); 