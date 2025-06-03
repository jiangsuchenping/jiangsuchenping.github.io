(function() {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

  window.currentProblem = null;
  let nextReviewTime = null;
  let reviewTimer = null;

  // 答题倒计时（秒）
  const ANSWER_TIMEOUT = 5;
  let answerTimer = null;

  // 添加排序状态变量
  let lastSortField = 'nextReviewTime';
  let lastSortAscending = true;

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
          problem: `${problem.num1} ${problem.operator} ${problem.num2} = ?`,
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
      
      // 首先获取所有需要复习的题目（根据艾宾浩斯记忆法计算的时间）
      const reviewProblems = Object.entries(data)
        .filter(([_, value]) => new Date(value.nextReviewTime) <= now)
        .map(([key, value]) => {
          // 从key中解析题目信息
          const match = key.match(/(\d+)([+-])(\d+)/);
          if (!match) {
            console.error('无法解析题目:', key);
            return null;
          }
          const [_, num1, operator, num2] = match;
          return {
            num1: parseInt(num1),
            operator: operator,
            num2: parseInt(num2),
            answer: operator === '+' ? parseInt(num1) + parseInt(num2) : parseInt(num1) - parseInt(num2),
            round: value.round || 0,
            accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0
          };
        })
        .filter(problem => problem !== null); // 过滤掉解析失败的题目
      
      // 如果有需要复习的题目，优先返回这些题目
      if (reviewProblems.length > 0) {
        // 按照正确率从低到高排序，优先练习正确率低的题目
        reviewProblems.sort((a, b) => a.accuracy - b.accuracy);
        return reviewProblems;
      }
      
      // 如果没有需要复习的题目，生成新的题目
      // 从历史记录中找出正确率最低的题目类型
      const accuracyByType = {};
      Object.entries(data).forEach(([key, value]) => {
        const match = key.match(/(\d+)([+-])(\d+)/);
        if (!match) return;
        const [_, num1, operator, num2] = match;
        const type = `${operator}`;
        const accuracy = value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0;
        
        if (!accuracyByType[type]) {
          accuracyByType[type] = { total: 0, count: 0 };
        }
        accuracyByType[type].total += accuracy;
        accuracyByType[type].count += 1;
      });
      
      // 计算每种题型的平均正确率
      const typeAccuracies = Object.entries(accuracyByType).map(([type, data]) => ({
        type,
        accuracy: data.total / data.count
      }));
      
      // 按照正确率从低到高排序题型
      typeAccuracies.sort((a, b) => a.accuracy - b.accuracy);
      
      // 生成新题目时，优先使用正确率低的题型
      for (let i = 0; i < 10; i++) {
        let operator;
        if (typeAccuracies.length > 0) {
          // 70%的概率使用正确率最低的题型，30%的概率随机选择
          operator = Math.random() < 0.7 ? typeAccuracies[0].type : (Math.random() < 0.5 ? '+' : '-');
        } else {
          operator = Math.random() < 0.5 ? '+' : '-';
        }
        
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        
        // 如果是减法，确保第一个数大于等于第二个数
        const problem = {
          num1: operator === '-' ? Math.max(num1, num2) : num1,
          num2: operator === '-' ? Math.min(num1, num2) : num2,
          operator: operator,
          answer: operator === '+' ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2),
          round: 0,
          accuracy: 0
        };
        problems.push(problem);
      }
      
      return problems;
    } catch (error) {
      console.error('获取练习题目失败:', error);
      return [];
    }
  }

  // 获取历史记录
  function getHistory() {
    try {
      const data = loadPracticeData();
      const history = [];
      
      for (const [key, value] of Object.entries(data)) {
        // 从key中解析题目信息
        const match = key.match(/(\d+)([+-])(\d+)/);
        if (!match) {
          console.error('无法解析题目:', key);
          continue;
        }
        const [_, num1, operator, num2] = match;
        const problemStr = `${num1} ${operator} ${num2} = ?`;
        
        history.push({
          problem: problemStr,
          totalTests: value.totalTests,
          correctCount: value.correctCount,
          accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0,
          lastTestTime: new Date(value.lastTestTime).toLocaleString(),
          nextReviewTime: new Date(value.nextReviewTime).toLocaleString(),
          lastTestTimeValue: new Date(value.lastTestTime),
          nextReviewTimeValue: new Date(value.nextReviewTime)
        });
      }
      
      // 默认按照下次复习时间从近到远排序
      return history.sort((a, b) => a.nextReviewTimeValue - b.nextReviewTimeValue);
    } catch (error) {
      console.error('获取历史记录失败:', error);
      return [];
    }
  }

  // 排序历史记录
  function sortHistory(history, sortBy, ascending = true) {
    return [...history].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'problem':
          comparison = a.problem.localeCompare(b.problem);
          break;
        case 'totalTests':
          comparison = a.totalTests - b.totalTests;
          break;
        case 'accuracy':
          comparison = a.accuracy - b.accuracy;
          break;
        case 'lastTestTime':
          comparison = a.lastTestTimeValue - b.lastTestTimeValue;
          break;
        case 'nextReviewTime':
          comparison = a.nextReviewTimeValue - b.nextReviewTimeValue;
          break;
        default:
          comparison = 0;
      }
      return ascending ? comparison : -comparison;
    });
  }

  // 生成随机选项
  function generateOptions(answer) {
    const options = [answer];
    const usedNumbers = new Set([answer]);
    
    // 生成3个不同的错误选项
    while (options.length < 4) {
      const offset = Math.random() < 0.5 ? 
        Math.floor(Math.random() * 3) + 1 : 
        -(Math.floor(Math.random() * 3) + 1);
      
      const newOption = answer + offset;
      
      // 确保选项在1-20之间且不重复
      if (newOption > 0 && newOption <= 20 && !usedNumbers.has(newOption)) {
        options.push(newOption);
        usedNumbers.add(newOption);
      }
    }
    
    // 随机打乱选项顺序
    return options.sort(() => Math.random() - 0.5);
  }

  // 加载数学乐园
  window.loadMath = function(container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      // 清除可能存在的定时器
      if (answerTimer) {
        clearInterval(answerTimer);
        answerTimer = null;
      }

      const problems = getProblemsToPractice();
      if (problems.length === 0) {
        // 获取最近的复习时间
        const data = loadPracticeData();
        const nextTimes = Object.values(data)
          .map(d => new Date(d.nextReviewTime))
          .filter(time => time > new Date()); // 只考虑未来的时间
        
        if (nextTimes.length > 0) {
          nextReviewTime = new Date(Math.min(...nextTimes));
          const timeUntilNext = Math.ceil((nextReviewTime - new Date()) / 60000); // 转换为分钟
          
          container.innerHTML = `
            <h2>数学乐园</h2>
            <div class="rest-message">
              <p>今天的练习已经完成啦！</p>
              <p>休息一下，${timeUntilNext}分钟后可以继续练习哦！</p>
            </div>
            <div class="history-section">
              <h3>练习历史（点击表头可排序）</h3>
              <div class="history-list"></div>
            </div>
            <button class="return-btn" onclick="window.showModule('')">返回首页</button>
          `;
        } else {
          container.innerHTML = `
            <h2>数学乐园</h2>
            <div class="rest-message">
              <p>今天的练习已经完成啦！</p>
              <p>休息一下，稍后再来练习吧！</p>
            </div>
            <div class="history-section">
              <h3>练习历史（点击表头可排序）</h3>
              <div class="history-list"></div>
            </div>
            <button class="return-btn" onclick="window.showModule('')">返回首页</button>
          `;
        }
        
        // 显示历史记录
        const historyList = container.querySelector('.history-list');
        const history = getHistory();
        if (history.length > 0) {
          // 使用上次的排序方式
          const sortedHistory = sortHistory(history, lastSortField, lastSortAscending);
          
          historyList.innerHTML = `
            <table class="history-table">
              <thead>
                <tr>
                  <th onclick="window.sortHistoryTable('problem')" class="sortable ${lastSortField === 'problem' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">题目 ↕</th>
                  <th onclick="window.sortHistoryTable('totalTests')" class="sortable ${lastSortField === 'totalTests' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">练习次数 ↕</th>
                  <th onclick="window.sortHistoryTable('accuracy')" class="sortable ${lastSortField === 'accuracy' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">正确率 ↕</th>
                  <th onclick="window.sortHistoryTable('lastTestTime')" class="sortable ${lastSortField === 'lastTestTime' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">上次练习 ↕</th>
                  <th onclick="window.sortHistoryTable('nextReviewTime')" class="sortable ${lastSortField === 'nextReviewTime' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">下次复习 ↕</th>
                </tr>
              </thead>
              <tbody>
                ${sortedHistory.map(item => `
                  <tr>
                    <td>${item.problem}</td>
                    <td>${item.totalTests}</td>
                    <td>${item.accuracy}%</td>
                    <td>${item.lastTestTime}</td>
                    <td>${item.nextReviewTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;

          // 添加表头样式
          const style = document.createElement('style');
          style.textContent = `
            .history-table th.sortable {
              cursor: pointer;
              user-select: none;
              position: relative;
              padding-right: 20px;
            }
            .history-table th.sortable:hover {
              background-color: #f0f0f0;
            }
            .history-table th.ascending::after {
              content: " ↑";
              position: absolute;
              right: 5px;
            }
            .history-table th.descending::after {
              content: " ↓";
              position: absolute;
              right: 5px;
            }
          `;
          document.head.appendChild(style);
        } else {
          historyList.innerHTML = '<p class="no-history">还没有练习记录哦，开始练习吧！</p>';
        }
        return;
      }
      
      // 随机选择一个题目
      const randomIndex = Math.floor(Math.random() * problems.length);
      window.currentProblem = problems[randomIndex];
      
      // 生成随机选项
      const options = generateOptions(window.currentProblem.answer);
      
      // 先更新DOM
      container.innerHTML = `
        <h2>数学乐园</h2>
        <div class="problem-display">
          ${window.currentProblem.num1} ${window.currentProblem.operator} ${window.currentProblem.num2} = ?
        </div>
        <div class="options">
          ${options.map(option => `
            <button onclick="window.handleAnswer(${option})">${option}</button>
          `).join('')}
        </div>
        <div class="feedback"></div>
        <div class="history-section">
          <h3>练习历史（点击表头可排序）</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;

      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .problem-display {
          font-size: 36px;
          margin: 20px 0;
          text-align: center;
        }
        .options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          max-width: 300px;
          margin: 0 auto;
        }
        .options button {
          padding: 15px;
          font-size: 24px;
          border: none;
          border-radius: 5px;
          background: #4CAF50;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .options button:hover {
          background: #45a049;
        }
        .feedback {
          text-align: center;
          margin: 20px 0;
          font-size: 24px;
        }
        .feedback.correct {
          color: #4CAF50;
        }
        .feedback.wrong {
          color: #f44336;
        }
        .history-section {
          margin-top: 30px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 10px;
        }
        .history-list {
          margin-top: 10px;
          max-height: 300px;
          overflow-y: auto;
          position: relative;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .history-table thead {
          position: sticky;
          top: 0;
          z-index: 1;
          background: #f0f0f0;
        }
        .history-table th,
        .history-table td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }
        .history-table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .history-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .history-table tr:hover {
          background-color: #f0f0f0;
        }
        .history-table th.sortable {
          cursor: pointer;
          user-select: none;
          position: relative;
          padding-right: 20px;
        }
        .history-table th.sortable:hover {
          background-color: #e0e0e0;
        }
        .history-table th.ascending::after {
          content: " ↑";
          position: absolute;
          right: 5px;
        }
        .history-table th.descending::after {
          content: " ↓";
          position: absolute;
          right: 5px;
        }
        .rest-message {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: #e3f2fd;
          border-radius: 10px;
        }
        .rest-message p {
          margin: 10px 0;
          font-size: 18px;
        }
        .return-btn {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          background: #2196F3;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .return-btn:hover {
          background: #1976D2;
        }
        /* 自定义滚动条样式 */
        .history-list::-webkit-scrollbar {
          width: 8px;
        }
        .history-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .history-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .history-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;
      document.head.appendChild(style);

      // 异步加载历史记录
      requestAnimationFrame(() => {
        try {
          const historyList = container.querySelector('.history-list');
          if (!historyList) return;

          const history = getHistory();
          if (history.length > 0) {
            // 使用上次的排序方式
            const sortedHistory = sortHistory(history, lastSortField, lastSortAscending);
            
            historyList.innerHTML = `
              <table class="history-table">
                <thead>
                  <tr>
                    <th onclick="window.sortHistoryTable('problem')" class="sortable ${lastSortField === 'problem' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">题目 ↕</th>
                    <th onclick="window.sortHistoryTable('totalTests')" class="sortable ${lastSortField === 'totalTests' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">练习次数 ↕</th>
                    <th onclick="window.sortHistoryTable('accuracy')" class="sortable ${lastSortField === 'accuracy' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">正确率 ↕</th>
                    <th onclick="window.sortHistoryTable('lastTestTime')" class="sortable ${lastSortField === 'lastTestTime' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">上次练习 ↕</th>
                    <th onclick="window.sortHistoryTable('nextReviewTime')" class="sortable ${lastSortField === 'nextReviewTime' ? (lastSortAscending ? 'ascending' : 'descending') : ''}">下次复习 ↕</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedHistory.map(item => `
                    <tr>
                      <td>${item.problem}</td>
                      <td>${item.totalTests}</td>
                      <td>${item.accuracy}%</td>
                      <td>${item.lastTestTime}</td>
                      <td>${item.nextReviewTime}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `;

            // 添加表头样式
            const style = document.createElement('style');
            style.textContent = `
              .history-table th.sortable {
                cursor: pointer;
                user-select: none;
                position: relative;
                padding-right: 20px;
              }
              .history-table th.sortable:hover {
                background-color: #f0f0f0;
              }
              .history-table th.ascending::after {
                content: " ↑";
                position: absolute;
                right: 5px;
              }
              .history-table th.descending::after {
                content: " ↓";
                position: absolute;
                right: 5px;
              }
            `;
            document.head.appendChild(style);
          } else {
            historyList.innerHTML = '<p class="no-history">还没有练习记录哦，开始练习吧！</p>';
          }
        } catch (error) {
          console.error('显示历史记录失败:', error);
          const historyList = container.querySelector('.history-list');
          if (historyList) {
            historyList.innerHTML = '<p class="error-message">加载历史记录失败，请刷新页面重试。</p>';
          }
        }
      });

      // 在组件卸载时清理定时器
      const cleanup = () => {
        if (answerTimer) {
          clearInterval(answerTimer);
          answerTimer = null;
        }
      };

      // 添加清理函数到window对象
      window.cleanupMath = cleanup;
    } catch (error) {
      console.error('加载数学模块失败:', error);
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
      
      // 延迟加载下一题，确保用户能看到反馈
      setTimeout(() => {
        const moduleContent = document.getElementById('module-content');
        if (moduleContent && typeof window.loadMath === 'function') {
          window.loadMath(moduleContent);
        }
      }, 1000);
    } catch (error) {
      console.error('处理答案失败:', error);
      const feedback = document.querySelector('.feedback');
      if (feedback) {
        feedback.className = 'feedback wrong';
        feedback.textContent = '发生错误，请刷新页面重试';
      }
    }
  };

  // 添加排序功能到window对象
  window.sortHistoryTable = function(sortBy) {
    try {
      const historyList = document.querySelector('.history-list');
      if (!historyList) return;

      const table = historyList.querySelector('table');
      if (!table) return;

      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      // 获取当前排序方向
      const th = table.querySelector(`th[onclick="window.sortHistoryTable('${sortBy}')"]`);
      if (!th) return;

      // 如果点击的是当前排序字段，则切换排序方向
      const isAscending = sortBy === lastSortField ? !lastSortAscending : true;
      
      // 更新排序状态
      lastSortField = sortBy;
      lastSortAscending = isAscending;
      
      // 更新所有表头的排序状态
      table.querySelectorAll('th').forEach(header => {
        header.classList.remove('ascending', 'descending');
      });
      
      // 设置当前表头的排序状态
      th.classList.add(isAscending ? 'ascending' : 'descending');

      // 获取所有行数据
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const history = rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          problem: cells[0].textContent,
          totalTests: parseInt(cells[1].textContent),
          accuracy: parseInt(cells[2].textContent),
          lastTestTime: cells[3].textContent,
          nextReviewTime: cells[4].textContent,
          lastTestTimeValue: new Date(cells[3].textContent),
          nextReviewTimeValue: new Date(cells[4].textContent)
        };
      });

      // 排序数据
      const sortedHistory = sortHistory(history, sortBy, isAscending);

      // 更新表格内容
      tbody.innerHTML = sortedHistory.map(item => `
        <tr>
          <td>${item.problem}</td>
          <td>${item.totalTests}</td>
          <td>${item.accuracy}%</td>
          <td>${item.lastTestTime}</td>
          <td>${item.nextReviewTime}</td>
        </tr>
      `).join('');
    } catch (error) {
      console.error('排序历史记录失败:', error);
    }
  };

  // 添加全局清理函数
  window.addEventListener('beforeunload', () => {
    if (window.cleanupMath) {
      window.cleanupMath();
    }
  });
})(); 