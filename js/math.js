(function () {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = LearningUtil.REVIEW_INTERVALS;

  window.currentProblem = null;
  let nextReviewTime = null;
  let reviewTimer = null;

  // 答题倒计时（秒）
  const ANSWER_TIMEOUT = 5;
  let answerTimer = null;

  // 添加排序状态变量
  let lastSortField = 'nextReviewTime';
  let lastSortAscending = true;

  // 添加答题锁定状态，防止重复答题
  let isAnswerLocked = false;

  // 从本地存储加载练习数据
  function loadPracticeData() {
    return StorageUtil.load(STORAGE_KEYS.MATH_PRACTICE_DATA, {});
  }

  // 保存练习数据到本地存储
  function savePracticeData(data) {
    return StorageUtil.save(STORAGE_KEYS.MATH_PRACTICE_DATA, data);
  }

  // 获取下一个复习时间
  function getNextReviewTime(round) {
    return LearningUtil.getNextReviewTime(round);
  }

  // 更新练习数据
  function updatePracticeData(problem, isCorrect) {
    try {
      const problemKey = `${problem.num1}${problem.operator}${problem.num2}`;

      return LearningUtil.updateLearningItem(
        STORAGE_KEYS.MATH_PRACTICE_DATA,
        problemKey,
        {
          problem: `${problem.num1} ${problem.operator} ${problem.num2} = ?`
        },
        isCorrect
      );
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
    return UIUtil.sortData(history, sortBy, ascending, {
      'lastTestTime': item => item.lastTestTimeValue,
      'nextReviewTime': item => item.nextReviewTimeValue
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

  // 使用防抖处理选项点击事件
  const handleOptionClick = UIUtil.debounce((optionElement, isCorrect) => {
    if (isAnswerLocked) return;

    // 设置答题锁定状态，防止重复点击
    isAnswerLocked = true;

    // 清除答题计时器
    if (answerTimer) {
      clearInterval(answerTimer);
      answerTimer = null;
    }

    // 添加按钮点击效果
    optionElement.classList.add('button-clicked');
    setTimeout(() => {
      optionElement.classList.remove('button-clicked');
    }, 200);

    // 显示动画反馈
    UIUtil.showAnimatedFeedback(
      'math-problem-container',
      isCorrect ? '答对了！' : '答错了',
      isCorrect ? 'success' : 'error'
    );

    // 给选项添加正确/错误状态标记
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
      const option = parseInt(btn.textContent);
      if (option === window.currentProblem.answer) {
        btn.classList.add('correct');
      } else if (btn === optionElement && !isCorrect) {
        btn.classList.add('wrong');
      }
      // 禁用所有按钮
      btn.disabled = true;
    });

    // 更新练习数据
    const updatedData = updatePracticeData(window.currentProblem, isCorrect);

    // 延迟显示下一题
    setTimeout(() => {
      // 重置答题锁定状态
      isAnswerLocked = false;

      // 如果在主容器中，加载下一题
      const moduleContent = document.getElementById('module-content');
      if (moduleContent) {
        window.loadMath(moduleContent);
      }
    }, 1500); // 延长一点时间，让用户能看清正确答案
  }, 300);

  // 加载数学乐园
  window.loadMath = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      // 重置答题锁定状态
      isAnswerLocked = false;

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

        // 添加样式
        UIUtil.addStyles(CSS_TEMPLATES.COMMON);
        UIUtil.addStyles(CSS_TEMPLATES.MATH);

        // 显示历史记录
        setTimeout(() => displayHistory(container), 100);
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
        <div class="problem-display" id="math-problem-container">
          ${window.currentProblem.num1} ${window.currentProblem.operator} ${window.currentProblem.num2} = ?
        </div>
        <div class="options">
          ${options.map(option => `
            <button class="option-btn">${option}</button>
          `).join('')}
        </div>
        <div class="feedback"></div>
        <div class="history-section">
          <h3>练习历史（点击表头可排序）</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;

      // 添加样式 - 使用CSS模板
      UIUtil.addStyles(CSS_TEMPLATES.COMMON);
      UIUtil.addStyles(CSS_TEMPLATES.MATH);

      // 添加选项点击事件
      const optionButtons = container.querySelectorAll('.option-btn');
      optionButtons.forEach(button => {
        const option = parseInt(button.textContent);
        button.addEventListener('click', () => {
          handleOptionClick(button, option === window.currentProblem.answer);
        });
      });

      // 异步加载历史记录
      setTimeout(() => {
        try {
          displayHistory(container);
        } catch (error) {
          console.error('加载历史记录失败:', error);
          const historyList = container.querySelector('.history-list');
          if (historyList) {
            historyList.innerHTML = '<div class="error-message">加载历史记录失败，请刷新页面重试</div>';
          }
        }
      }, 100);

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

  function startPractice(container) {
    // 清除所有计时器
    if (answerTimer) {
      clearInterval(answerTimer);
      answerTimer = null;
    }

    // 重置答题锁定状态
    isAnswerLocked = false;

    try {
      const problems = getProblemsToPractice();

      // 重置容器内容，设置好所有需要的元素
      container.innerHTML = `
        <h2>数学乐园</h2>
        <div class="problem-display" id="problem-display"></div>
        <div id="options"></div>
        <div id="feedback" class="feedback"></div>
        <div id="countdown-display" class="countdown-timer"></div>
        <div class="history-section">
          <h3>练习历史（点击表头可排序）</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;

      const problemDisplay = document.getElementById('problem-display');
      const optionsContainer = document.getElementById('options');
      const feedback = document.getElementById('feedback');
      const countdownDisplay = document.getElementById('countdown-display');

      if (!problemDisplay || !optionsContainer || !feedback) {
        console.error('获取元素失败');
        return;
      }

      // 清空反馈和倒计时
      feedback.textContent = '';
      if (countdownDisplay) countdownDisplay.textContent = '';

      if (problems.length === 0) {
        window.loadMath(container);
        return;
      }

      // 随机选择一个问题
      const randomIndex = Math.floor(Math.random() * problems.length);
      window.currentProblem = problems[randomIndex];
      const problem = window.currentProblem;

      // 设置问题容器ID用于动画反馈
      problemDisplay.id = 'math-problem-container';
      problemDisplay.innerHTML = `<div class="problem">${problem.num1} ${problem.operator} ${problem.num2} = ?</div>`;

      // 生成随机选项
      const options = generateOptions(problem.answer);

      // 显示选项
      optionsContainer.innerHTML = `<div class="options">
        ${options.map(option => `<button class="option-btn">${option}</button>`).join('')}
      </div>`;

      // 添加选项点击事件
      const optionButtons = optionsContainer.querySelectorAll('.option-btn');
      optionButtons.forEach(button => {
        const option = parseInt(button.textContent);
        button.addEventListener('click', () => {
          handleOptionClick(button, option === problem.answer);
        });
      });

      // 启动倒计时
      let timeLeft = ANSWER_TIMEOUT;
      countdownDisplay.textContent = `${timeLeft}秒`;

      answerTimer = setInterval(() => {
        timeLeft--;
        if (countdownDisplay) countdownDisplay.textContent = `${timeLeft}秒`;

        // 最后3秒警告效果
        if (timeLeft <= 3) {
          if (countdownDisplay) {
            countdownDisplay.className = 'countdown-timer warning';
          }
        }

        if (timeLeft <= 0) {
          clearInterval(answerTimer);
          answerTimer = null;

          // 显示动画反馈
          UIUtil.showAnimatedFeedback(
            'math-problem-container',
            '时间到了',
            'neutral'
          );

          // 禁用所有选项
          optionButtons.forEach(btn => {
            btn.disabled = true;
          });

          // 延迟显示下一题
          setTimeout(() => {
            startPractice(container);
          }, 1000);
        }
      }, 1000);
    } catch (error) {
      console.error('开始练习失败:', error);
      container.innerHTML = `
        <h2>数学乐园</h2>
        <p>加载失败，请刷新页面重试。错误: ${error.message}</p>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;
    }
  }

  function displayHistory(container) {
    try {
      // 清除可能存在的定时器
      if (answerTimer) {
        clearInterval(answerTimer);
        answerTimer = null;
      }

      const history = getHistory();

      // 直接使用容器中的历史记录列表区域
      const historyList = container.querySelector('.history-list');
      if (!historyList) {
        console.error('找不到历史记录列表容器');
        return;
      }

      // 清空之前的内容
      historyList.innerHTML = '';

      if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">暂无练习历史</div>';
        return;
      }

      // 定义表格列
      const columns = [
        { field: 'problem', title: '题目', sortable: true },
        { field: 'totalTests', title: '练习次数', sortable: true },
        { field: 'accuracy', title: '正确率', sortable: true },
        { field: 'lastTestTime', title: '上次练习', sortable: true },
        { field: 'nextReviewTime', title: '下次复习', sortable: true }
      ];

      // 定义行渲染函数
      const rowRenderer = (item) => `
        <tr>
          <td>${item.problem}</td>
          <td>${item.totalTests}</td>
          <td>${item.accuracy}%</td>
          <td>${item.lastTestTime}</td>
          <td>${item.nextReviewTime}</td>
        </tr>
      `;

      // 使用UIUtil.renderHistoryTable渲染历史表格
      UIUtil.renderHistoryTable(historyList, history, columns, rowRenderer, {
        sortSettingsKey: STORAGE_KEYS.MATH_SORT_SETTINGS,
        defaultSort: { field: 'nextReviewTime', direction: 'asc' }
      });
    } catch (error) {
      console.error('显示历史记录失败:', error);
      const historyList = container.querySelector('.history-list');
      if (historyList) {
        historyList.innerHTML = '<div class="error-message">加载历史记录失败，请刷新页面重试</div>';
      }
    }
  }

  // 添加排序功能到window对象
  window.sortHistoryTable = function (sortBy) {
    try {
      const historyList = document.querySelector('.history-list');
      if (!historyList) return;

      // 如果点击的是当前排序字段，则切换排序方向
      const isAscending = sortBy === lastSortField ? !lastSortAscending : true;

      // 更新排序状态
      lastSortField = sortBy;
      lastSortAscending = isAscending;

      // 更新显示
      const container = historyList.closest('.history-section');
      if (container) {
        displayHistory(container);
      }
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