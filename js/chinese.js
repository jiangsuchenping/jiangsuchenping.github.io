(function () {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = LearningUtil.REVIEW_INTERVALS;

  // 使用从数据文件加载的常量
  // COMMON_CHARACTERS 和 PINYIN_MAP 从 chinese-chars.js 引入

  // 获取汉字拼音
  function getPinyin(char) {
    const pinyin = PINYIN_MAP[char];
    if (!pinyin) {
      console.warn(`未找到汉字"${char}"的拼音`);
      return char;
    }
    return pinyin;
  }

  let currentCharacter = null;
  let nextReviewTime = null;
  let reviewTimer = null;
  let countdownTimer = null;

  // 从本地存储加载练习数据
  function loadPracticeData() {
    return StorageUtil.load(STORAGE_KEYS.CHINESE_PRACTICE_DATA, {});
  }

  // 保存练习数据到本地存储
  function savePracticeData(data) {
    return StorageUtil.save(STORAGE_KEYS.CHINESE_PRACTICE_DATA, data);
  }

  // 从本地存储加载排序设置
  function loadSortSettings() {
    return StorageUtil.load(STORAGE_KEYS.CHINESE_SORT_SETTINGS, { field: 'lastTestTime', direction: 'desc' });
  }

  // 保存排序设置到本地存储
  function saveSortSettings(field, direction) {
    return StorageUtil.save(STORAGE_KEYS.CHINESE_SORT_SETTINGS, { field, direction });
  }

  // 从本地存储加载每日学习量设置
  function loadDailyLimit() {
    return StorageUtil.loadNumber(STORAGE_KEYS.CHINESE_DAILY_LIMIT, LEARNING_CONSTANTS.DEFAULT_DAILY_LIMIT);
  }

  // 保存每日学习量设置到本地存储
  function saveDailyLimit(limit) {
    return StorageUtil.saveNumber(STORAGE_KEYS.CHINESE_DAILY_LIMIT, limit, LEARNING_CONSTANTS.DEFAULT_DAILY_LIMIT);
  }

  // 获取今日已学习的汉字数量
  function getTodayLearnedCount() {
    return LearningUtil.getTodayLearnedCount(STORAGE_KEYS.CHINESE_PRACTICE_DATA);
  }

  // 获取下一个复习时间
  function getNextReviewTime(round) {
    return LearningUtil.getNextReviewTime(round);
  }

  // 更新练习数据
  function updatePracticeData(character, isCorrect) {
    return LearningUtil.updateLearningItem(
      STORAGE_KEYS.CHINESE_PRACTICE_DATA,
      character,
      { character: character },
      isCorrect
    );
  }

  // 获取需要练习的汉字
  function getCharactersToPractice() {
    return LearningUtil.getItemsToLearn(
      STORAGE_KEYS.CHINESE_PRACTICE_DATA,
      COMMON_CHARACTERS,
      'character',
      STORAGE_KEYS.CHINESE_DAILY_LIMIT,
      (item) => {
        // 添加拼音信息
        if (item && item.character) {
          item.pinyin = getPinyin(item.character);
        }
        return item;
      }
    );
  }

  // 更新倒计时显示
  function updateCountdown() {
    if (!nextReviewTime) return;

    const now = new Date();
    const timeUntilNext = Math.ceil((nextReviewTime - now) / 60000); // 转换为分钟

    const countdownElement = document.querySelector('.countdown');
    if (countdownElement) {
      countdownElement.textContent = `休息一下，${timeUntilNext}分钟后可以继续练习哦！`;
    }

    // 如果时间到了，自动刷新页面
    if (timeUntilNext <= 0) {
      location.reload();
    }
  }

  // 将函数绑定到window对象
  window.loadChinese = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      const characters = getCharactersToPractice();
      const dailyLimit = loadDailyLimit();
      const todayLearned = getTodayLearnedCount();
      const remainingToday = Math.max(0, dailyLimit - todayLearned);

      // 加载历史记录
      const loadHistory = () => {
        try {
          const historyList = container.querySelector('.history-list');
          if (!historyList) return;

          const data = loadPracticeData();
          const history = Object.entries(data)
            .map(([char, value]) => ({
              character: char,
              totalTests: value.totalTests,
              correctCount: value.correctCount,
              accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0,
              lastTestTime: new Date(value.lastTestTime).toLocaleString(),
              nextReviewTime: new Date(value.nextReviewTime).toLocaleString()
            }))
            .sort((a, b) => new Date(b.lastTestTime) - new Date(a.lastTestTime));

          if (history.length > 0) {
            // 获取上次的排序设置
            const sortSettings = loadSortSettings();

            historyList.innerHTML = `
              <table class="history-table">
                <thead>
                  <tr>
                    <th class="sortable" data-sort="character" title="点击按汉字排序">汉字</th>
                    <th class="sortable" data-sort="totalTests" title="点击按练习次数排序">练习次数</th>
                    <th class="sortable" data-sort="accuracy" title="点击按正确率排序">正确率</th>
                    <th class="sortable" data-sort="lastTestTime" title="点击按上次练习时间排序">上次练习</th>
                    <th class="sortable" data-sort="nextReviewTime" title="点击按下次复习时间排序">下次复习</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.map(item => `
                    <tr>
                      <td>${item.character}</td>
                      <td>${item.totalTests}</td>
                      <td>${item.accuracy}%</td>
                      <td>${item.lastTestTime}</td>
                      <td>${item.nextReviewTime}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `;

            // 应用上次的排序设置
            const lastSortHeader = historyList.querySelector(`th[data-sort="${sortSettings.field}"]`);
            if (lastSortHeader) {
              // 设置初始排序状态
              lastSortHeader.classList.add(sortSettings.direction === 'asc' ? 'ascending' : 'descending');

              // 直接排序数据
              const sortedHistory = [...history].sort((a, b) => {
                let valueA = a[sortSettings.field];
                let valueB = b[sortSettings.field];

                if (sortSettings.field === 'lastTestTime' || sortSettings.field === 'nextReviewTime') {
                  valueA = new Date(valueA).getTime();
                  valueB = new Date(valueB).getTime();
                } else if (sortSettings.field === 'totalTests' || sortSettings.field === 'accuracy') {
                  valueA = Number(valueA);
                  valueB = Number(valueB);
                }

                if (sortSettings.direction === 'asc') {
                  return valueA > valueB ? 1 : -1;
                } else {
                  return valueA < valueB ? 1 : -1;
                }
              });

              // 更新表格内容
              const tbody = historyList.querySelector('tbody');
              tbody.innerHTML = sortedHistory.map(item => `
                <tr>
                  <td>${item.character}</td>
                  <td>${item.totalTests}</td>
                  <td>${item.accuracy}%</td>
                  <td>${item.lastTestTime}</td>
                  <td>${item.nextReviewTime}</td>
                </tr>
              `).join('');
            }

            // 添加表头排序事件监听
            const headers = historyList.querySelectorAll('th.sortable');
            headers.forEach(header => {
              header.addEventListener('click', () => {
                const field = header.dataset.sort;
                const currentDirection = header.classList.contains('ascending') ? 'desc' : 'asc';

                // 保存排序设置
                saveSortSettings(field, currentDirection);

                // 移除所有表头的排序状态
                headers.forEach(h => {
                  h.classList.remove('ascending', 'descending');
                });

                // 添加当前排序状态
                header.classList.add(currentDirection === 'asc' ? 'ascending' : 'descending');

                // 重新排序数据
                const sortedHistory = [...history].sort((a, b) => {
                  let valueA = a[field];
                  let valueB = b[field];

                  if (field === 'lastTestTime' || field === 'nextReviewTime') {
                    valueA = new Date(valueA).getTime();
                    valueB = new Date(valueB).getTime();
                  } else if (field === 'totalTests' || field === 'accuracy') {
                    valueA = Number(valueA);
                    valueB = Number(valueB);
                  }

                  if (currentDirection === 'asc') {
                    return valueA > valueB ? 1 : -1;
                  } else {
                    return valueA < valueB ? 1 : -1;
                  }
                });

                // 更新表格内容
                const tbody = historyList.querySelector('tbody');
                tbody.innerHTML = sortedHistory.map(item => `
                  <tr>
                    <td>${item.character}</td>
                    <td>${item.totalTests}</td>
                    <td>${item.accuracy}%</td>
                    <td>${item.lastTestTime}</td>
                    <td>${item.nextReviewTime}</td>
                  </tr>
                `).join('');
              });
            });
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
      };

      if (!characters || characters.length === 0) {
        container.innerHTML = `
          <h2>语文乐园</h2>
          <div class="daily-progress">
            <p>今日学习进度：${todayLearned}/${dailyLimit}</p>
            ${remainingToday === 0 ? '<p class="limit-reached">今日学习目标已完成，明天再来吧！</p>' : ''}
          </div>
          <div class="settings-section">
            <h3>学习设置</h3>
            <div class="setting-item">
              <label for="dailyLimit">每日学习量：</label>
              <input type="number" id="dailyLimit" min="1" max="100" value="${dailyLimit}">
              <button onclick="window.updateDailyLimit()">保存设置</button>
            </div>
          </div>
          <div class="history-section">
            <h3>练习历史（点击表头可排序）</h3>
            <div class="history-list"></div>
          </div>
          <button class="return-btn" onclick="window.showModule('')">返回首页</button>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
          .daily-progress {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
          }
          .limit-reached {
            color: #4CAF50;
            font-weight: bold;
            margin-top: 10px;
          }
          .settings-section {
            margin: 20px 0;
            padding: 15px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .setting-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
          }
          .setting-item input {
            width: 80px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .setting-item button {
            padding: 5px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .setting-item button:hover {
            background: #45a049;
          }
          .history-section {
            margin: 20px 0;
            padding: 15px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          .history-list {
            max-height: 500px;
            overflow-y: auto;
            margin-top: 10px;
          }
          .no-history {
            text-align: center;
            color: #666;
            padding: 20px;
          }
          .error-message {
            text-align: center;
            color: #f44336;
            padding: 20px;
          }
        `;
        document.head.appendChild(style);

        // 加载历史记录
        requestAnimationFrame(loadHistory);
        return;
      }

      // 随机选择一个汉字
      const randomIndex = Math.floor(Math.random() * characters.length);
      currentCharacter = characters[randomIndex];

      if (!currentCharacter || !currentCharacter.character) {
        container.innerHTML = `
          <h2>语文乐园</h2>
          <p>加载失败，请刷新页面重试。</p>
          <button class="return-btn" onclick="window.showModule('')">返回首页</button>
        `;
        return;
      }

      container.innerHTML = `
        <h2>语文乐园</h2>
        <div class="daily-progress">
          <p>今日学习进度：${todayLearned}/${dailyLimit}</p>
        </div>
        <div class="character-display">
          <div class="character">${currentCharacter.character}</div>
          <div class="pinyin">${getPinyin(currentCharacter.character)}</div>
        </div>
        <div class="options">
          <button class="learn-btn" onclick="window.handleChineseAnswer(true)">认识</button>
          <button class="forget-btn" onclick="window.handleChineseAnswer(false)">不认识</button>
        </div>
        <div class="feedback"></div>
        <div class="settings-section">
          <h3>学习设置</h3>
          <div class="setting-item">
            <label for="dailyLimit">每日学习量：</label>
            <input type="number" id="dailyLimit" min="1" max="100" value="${dailyLimit}">
            <button onclick="window.updateDailyLimit()">保存设置</button>
          </div>
        </div>
        <div class="history-section">
          <h3>练习历史（点击表头可排序）</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;

      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .character-display {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .character {
          font-size: 72px;
          color: #333;
          line-height: 1;
          margin-bottom: 5px;
        }
        .pinyin {
          font-size: 24px;
          color: #666;
          margin-top: 5px;
          font-weight: 500;
        }
        .options {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px auto;
          max-width: 400px;
        }
        .options button {
          padding: 15px 40px;
          font-size: 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          max-width: 180px;
        }
        .learn-btn {
          background: #4CAF50;
          color: white;
        }
        .learn-btn:hover {
          background: #4CAF50;
          transform: translateY(-3px);
        }
        .forget-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 4px;
          font-size: 1.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .forget-btn:hover {
          background: #d32f2f;
          transform: translateY(-3px);
        }
        .learn-btn:disabled,
        .forget-btn:disabled {
          background-color: #cccccc;
          color: #999999;
          cursor: not-allowed;
          transform: none;
          opacity: 0.7;
        }
        .feedback {
          text-align: center;
          margin: 20px 0;
          min-height: 30px;
          font-size: 24px;
          font-weight: bold;
        }
        .feedback.correct {
          color: #4CAF50;
        }
        .feedback.wrong {
          color: #f44336;
        }
        .daily-progress {
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .settings-section {
          margin: 20px 0;
          padding: 15px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .setting-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
        }
        .setting-item input {
          width: 80px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .setting-item button {
          padding: 5px 15px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .setting-item button:hover {
          background: #45a049;
        }
        .history-section {
          margin: 20px 0;
          padding: 15px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
        .history-list {
          max-height: 500px;
          overflow-y: auto;
          margin-top: 10px;
        }
        .no-history {
          text-align: center;
          color: #666;
          padding: 20px;
        }
        .error-message {
          text-align: center;
          color: #f44336;
          padding: 20px;
        }
      `;
      document.head.appendChild(style);

      // 加载历史记录
      requestAnimationFrame(loadHistory);
    } catch (error) {
      console.error('加载语文模块失败:', error);
      container.innerHTML = `
        <h2>语文乐园</h2>
        <p>加载失败，请刷新页面重试。</p>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;
    }
  };

  window.handleChineseAnswer = function (isCorrect) {
    try {
      if (!currentCharacter || !currentCharacter.character) {
        console.error('当前没有汉字');
        const feedback = document.querySelector('.feedback');
        if (feedback) {
          feedback.className = 'feedback wrong';
          feedback.textContent = '题目加载失败，请刷新页面重试';
        }
        return;
      }

      // 禁用按钮，避免重复答题
      const learnBtn = document.querySelector('.learn-btn');
      const forgetBtn = document.querySelector('.forget-btn');
      if (learnBtn) learnBtn.disabled = true;
      if (forgetBtn) forgetBtn.disabled = true;

      const characterData = updatePracticeData(currentCharacter.character, isCorrect);
      if (!characterData) {
        console.error('更新练习数据失败');
        const feedback = document.querySelector('.feedback');
        if (feedback) {
          feedback.className = 'feedback wrong';
          feedback.textContent = '保存数据失败，请刷新页面重试';
        }
        return;
      }

      const feedback = document.querySelector('.feedback');
      if (feedback) {
        feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.textContent = isCorrect ? '太棒了！' : '继续加油！';
      }

      // 延迟加载下一题，确保用户能看到反馈
      setTimeout(() => {
        try {
          const moduleContent = document.getElementById('module-content');
          if (moduleContent && typeof window.loadChinese === 'function') {
            window.loadChinese(moduleContent);
          } else {
            console.error('找不到模块容器或加载函数');
            const feedback = document.querySelector('.feedback');
            if (feedback) {
              feedback.className = 'feedback wrong';
              feedback.textContent = '加载下一题失败，请刷新页面重试';
            }
          }
        } catch (error) {
          console.error('加载下一题失败:', error);
          const feedback = document.querySelector('.feedback');
          if (feedback) {
            feedback.className = 'feedback wrong';
            feedback.textContent = '加载下一题失败，请刷新页面重试';

            // 恢复按钮状态
            const learnBtn = document.querySelector('.learn-btn');
            const forgetBtn = document.querySelector('.forget-btn');
            if (learnBtn) learnBtn.disabled = false;
            if (forgetBtn) forgetBtn.disabled = false;
          }
        }
      }, 1000);
    } catch (error) {
      console.error('处理答案失败:', error);
      const feedback = document.querySelector('.feedback');
      if (feedback) {
        feedback.className = 'feedback wrong';
        feedback.textContent = '发生错误，请刷新页面重试';
      }

      // 恢复按钮状态
      const learnBtn = document.querySelector('.learn-btn');
      const forgetBtn = document.querySelector('.forget-btn');
      if (learnBtn) learnBtn.disabled = false;
      if (forgetBtn) forgetBtn.disabled = false;
    }
  };

  // 添加全局清理函数
  window.addEventListener('beforeunload', () => {
    if (window.cleanupChinese) {
      window.cleanupChinese();
    }
  });

  // 更新每日学习量设置
  window.updateDailyLimit = function () {
    const input = document.getElementById('dailyLimit');
    if (input) {
      const newLimit = parseInt(input.value);
      if (newLimit >= 1 && newLimit <= 100) {
        saveDailyLimit(newLimit);
        // 重新加载页面以应用新设置
        window.loadChinese(document.getElementById('module-content'));
      } else {
        alert('请输入1-100之间的数字');
        // 聚焦并全选输入框内容
        setTimeout(() => {
          input.focus();
          input.select();
        }, 0);
      }
    }
  };
})();

// 分页功能
let currentPage = 0;
const charactersPerPage = 12;

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    window.loadChinese(document.getElementById('module-content'));
  }
}

function nextPage() {
  currentPage++;
  window.loadChinese(document.getElementById('module-content'));
}

function showCharacterCard(char) {
  const container = document.getElementById('chinese-container');
  container.innerHTML = `
    <div class="character-display">
      <div class="character">${char}</div>
      <div class="pinyin">${getPinyin(char)}</div>
    </div>
    <div class="options">
      <button class="learn-btn">认识</button>
      <button class="forget-btn">不认识</button>
    </div>
    <div class="feedback"></div>
  `;

  container.querySelector('.learn-btn').addEventListener('click', () => window.handleChineseAnswer(true));
  container.querySelector('.forget-btn').addEventListener('click', () => window.handleChineseAnswer(false));
}