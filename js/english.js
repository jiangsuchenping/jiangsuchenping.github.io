(function () {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = LearningUtil.REVIEW_INTERVALS;

  // 使用从数据文件加载的单词库
  // ENGLISH_WORDS 从 english-words.js 引入

  let currentWord = null;
  let nextReviewTime = null;

  // 从本地存储加载练习数据
  function loadPracticeData() {
    return StorageUtil.load(STORAGE_KEYS.ENGLISH_PRACTICE_DATA, {});
  }

  // 保存练习数据到本地存储
  function savePracticeData(data) {
    return StorageUtil.save(STORAGE_KEYS.ENGLISH_PRACTICE_DATA, data);
  }

  // 从本地存储加载排序设置
  function loadSortSettings() {
    return StorageUtil.load(STORAGE_KEYS.ENGLISH_SORT_SETTINGS, { field: 'lastTestTime', direction: 'desc' });
  }

  // 保存排序设置到本地存储
  function saveSortSettings(field, direction) {
    return StorageUtil.save(STORAGE_KEYS.ENGLISH_SORT_SETTINGS, { field, direction });
  }

  // 从本地存储加载每日学习量设置
  function loadDailyLimit() {
    return StorageUtil.loadNumber(STORAGE_KEYS.ENGLISH_DAILY_LIMIT, LEARNING_CONSTANTS.DEFAULT_DAILY_LIMIT);
  }

  // 保存每日学习量设置到本地存储
  function saveDailyLimit(limit) {
    return StorageUtil.saveNumber(STORAGE_KEYS.ENGLISH_DAILY_LIMIT, limit, LEARNING_CONSTANTS.DEFAULT_DAILY_LIMIT);
  }

  // 获取今日已学习的单词数量
  function getTodayLearnedCount() {
    return LearningUtil.getTodayLearnedCount(STORAGE_KEYS.ENGLISH_PRACTICE_DATA);
  }

  // 获取下一个复习时间
  function getNextReviewTime(round) {
    return LearningUtil.getNextReviewTime(round);
  }

  // 更新练习数据
  function updatePracticeData(word, isCorrect) {
    try {
      if (!word) {
        console.error('更新练习数据失败: 单词为空');
        return null;
      }

      return LearningUtil.updateLearningItem(
        STORAGE_KEYS.ENGLISH_PRACTICE_DATA,
        word.word,
        {
          word: word.word,
          phonetic: word.phonetic || "",
          translation: word.translation
        },
        isCorrect
      );
    } catch (error) {
      console.error('更新练习数据失败:', error);
      return null;
    }
  }

  // 获取需要练习的单词
  function getWordsToPractice() {
    return LearningUtil.getItemsToLearn(
      STORAGE_KEYS.ENGLISH_PRACTICE_DATA,
      ENGLISH_WORDS,
      'word',
      STORAGE_KEYS.ENGLISH_DAILY_LIMIT,
      (item) => {
        // 确保词典中的拼音和翻译都包含在学习项目中
        if (item.word) {
          // 如果是从词库中新获取的单词，需要添加音标和翻译
          if (!item.phonetic || !item.translation) {
            const dictWord = ENGLISH_WORDS.find(w => w.word === item.word);
            if (dictWord) {
              item.phonetic = dictWord.phonetic || "";
              item.translation = dictWord.translation;
            }
          }
        }
        return item;
      }
    );
  }

  // 将函数绑定到window对象
  window.loadEnglish = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      const words = getWordsToPractice();
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
            .map(([word, value]) => ({
              word: word,
              phonetic: value.phonetic || "",
              translation: value.translation,
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
                    <th class="sortable" data-sort="word" title="点击按单词排序">单词</th>
                    <th class="sortable" data-sort="phonetic" title="点击按音标排序">音标</th>
                    <th class="sortable" data-sort="translation" title="点击按翻译排序">翻译</th>
                    <th class="sortable" data-sort="totalTests" title="点击按练习次数排序">练习次数</th>
                    <th class="sortable" data-sort="accuracy" title="点击按正确率排序">正确率</th>
                    <th class="sortable" data-sort="lastTestTime" title="点击按上次练习时间排序">上次练习</th>
                    <th class="sortable" data-sort="nextReviewTime" title="点击按下次复习时间排序">下次复习</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.map(item => `
                    <tr>
                      <td>${item.word}</td>
                      <td>${item.phonetic || ""}</td>
                      <td>${item.translation}</td>
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
                  <td>${item.word}</td>
                  <td>${item.phonetic || ""}</td>
                  <td>${item.translation}</td>
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
                    <td>${item.word}</td>
                    <td>${item.phonetic || ""}</td>
                    <td>${item.translation}</td>
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

      if (!words || words.length === 0) {
        container.innerHTML = `
          <h2>英语乐园</h2>
          <div class="daily-progress">
            <p>今日学习进度：${todayLearned}/${dailyLimit}</p>
            ${remainingToday === 0 ? '<p class="limit-reached">今日学习目标已完成，明天再来吧！</p>' : ''}
          </div>
          <div class="settings-section">
            <h3>学习设置</h3>
            <div class="setting-item">
              <label for="englishDailyLimit">每日学习量：</label>
              <input type="number" id="englishDailyLimit" min="1" max="100" value="${dailyLimit}">
              <button onclick="window.updateEnglishDailyLimit()">保存设置</button>
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
        `

        // 加载历史记录
        requestAnimationFrame(loadHistory);
        return;
      }

      // 随机选择一个单词
      const randomIndex = Math.floor(Math.random() * words.length);
      currentWord = words[randomIndex];

      if (!currentWord || !currentWord.word) {
        container.innerHTML = `
          <h2>英语乐园</h2>
          <p>加载失败，请刷新页面重试。</p>
          <button class="return-btn" onclick="window.showModule('')">返回首页</button>
        `;
        return;
      }

      container.innerHTML = `
        <h2>英语乐园</h2>
        <div class="daily-progress">
          <p>今日学习进度：${todayLearned}/${dailyLimit}</p>
        </div>
        <div class="word-display">
          <div class="word">${currentWord.word}</div>
          <div class="phonetic">${currentWord.phonetic || ""}</div>
          <div class="translation">${currentWord.translation}</div>
        </div>
        <div class="options">
          <button class="learn-btn" onclick="window.handleEnglishAnswer(true)">认识</button>
          <button class="forget-btn" onclick="window.handleEnglishAnswer(false)">不认识</button>
        </div>
        <div class="feedback"></div>
        <div class="settings-section">
          <h3>学习设置</h3>
          <div class="setting-item">
            <label for="englishDailyLimit">每日学习量：</label>
            <input type="number" id="englishDailyLimit" min="1" max="100" value="${dailyLimit}">
            <button onclick="window.updateEnglishDailyLimit()">保存设置</button>
          </div>
        </div>
        <div class="history-section">
          <h3>练习历史（点击表头可排序）</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;

      // 添加样式
      UIUtil.addStyles(CSS_TEMPLATES.COMMON);
      UIUtil.addStyles(CSS_TEMPLATES.ENGLISH);

      // 加载历史记录
      requestAnimationFrame(loadHistory);
    } catch (error) {
      console.error('加载英语模块失败:', error);
      container.innerHTML = `
        <h2>英语乐园</h2>
        <p>加载失败，请刷新页面重试。</p>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;
    }
  };

  window.handleEnglishAnswer = function (isCorrect) {
    try {
      if (!currentWord || !currentWord.word) {
        console.error('当前没有单词');
        const feedback = document.querySelector('.feedback');
        if (feedback) {
          feedback.className = 'feedback wrong';
          feedback.textContent = '题目加载失败，请刷新页面重试';
        }
        return;
      }

      // 禁用按钮，避免重复答题
      UIUtil.disableButtons(['.learn-btn', '.forget-btn']);

      const wordData = updatePracticeData(currentWord, isCorrect);
      if (!wordData) {
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
          if (moduleContent && typeof window.loadEnglish === 'function') {
            window.loadEnglish(moduleContent);
          } else {
            console.error('找不到模块容器或加载函数');
            UIUtil.showError('.feedback', '加载下一题失败，请刷新页面重试');
            UIUtil.enableButtons(['.learn-btn', '.forget-btn']);
          }
        } catch (error) {
          console.error('加载下一题失败:', error);
          UIUtil.showError('.feedback', '加载下一题失败，请刷新页面重试');
          UIUtil.enableButtons(['.learn-btn', '.forget-btn']);
        }
      }, 1000);
    } catch (error) {
      console.error('处理答案失败:', error);
      UIUtil.showError('.feedback', '发生错误，请刷新页面重试');
      UIUtil.enableButtons(['.learn-btn', '.forget-btn']);
    }
  };

  // 添加全局清理函数
  window.addEventListener('beforeunload', () => {
    if (window.cleanupEnglish) {
      window.cleanupEnglish();
    }
  });

  // 更新每日学习量设置
  window.updateEnglishDailyLimit = function () {
    const input = document.getElementById('englishDailyLimit');
    if (input) {
      const newLimit = parseInt(input.value);
      if (newLimit >= 1 && newLimit <= 100) {
        saveDailyLimit(newLimit);
        // 重新加载页面以应用新设置
        window.loadEnglish(document.getElementById('module-content'));
      } else {
        alert('请输入1-100之间的数字');
        // 聚焦并全选输入框内容
        UIUtil.focusAndSelectInput('englishDailyLimit');
      }
    }
  };
})();