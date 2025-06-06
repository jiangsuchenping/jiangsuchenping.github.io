(function () {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

  // 常用英语单词库（初级）
  const COMMON_WORDS = [
    { word: "hello", translation: "你好" },
    { word: "goodbye", translation: "再见" },
    { word: "thank you", translation: "谢谢" },
    { word: "please", translation: "请" },
    { word: "sorry", translation: "对不起" },
    { word: "yes", translation: "是的" },
    { word: "no", translation: "不是" },
    { word: "morning", translation: "早上" },
    { word: "afternoon", translation: "下午" },
    { word: "evening", translation: "晚上" },
    { word: "school", translation: "学校" },
    { word: "teacher", translation: "老师" },
    { word: "student", translation: "学生" },
    { word: "book", translation: "书" },
    { word: "pencil", translation: "铅笔" },
    { word: "pen", translation: "钢笔" },
    { word: "paper", translation: "纸" },
    { word: "table", translation: "桌子" },
    { word: "chair", translation: "椅子" },
    { word: "classroom", translation: "教室" },
    { word: "window", translation: "窗户" },
    { word: "door", translation: "门" },
    { word: "family", translation: "家庭" },
    { word: "father", translation: "爸爸" },
    { word: "mother", translation: "妈妈" },
    { word: "brother", translation: "兄弟" },
    { word: "sister", translation: "姐妹" },
    { word: "water", translation: "水" },
    { word: "food", translation: "食物" },
    { word: "fruit", translation: "水果" },
    { word: "apple", translation: "苹果" },
    { word: "banana", translation: "香蕉" },
    { word: "orange", translation: "橙子" },
    { word: "red", translation: "红色" },
    { word: "blue", translation: "蓝色" },
    { word: "green", translation: "绿色" },
    { word: "yellow", translation: "黄色" },
    { word: "black", translation: "黑色" },
    { word: "white", translation: "白色" },
    { word: "one", translation: "一" },
    { word: "two", translation: "二" },
    { word: "three", translation: "三" },
    { word: "four", translation: "四" },
    { word: "five", translation: "五" },
    { word: "six", translation: "六" },
    { word: "seven", translation: "七" },
    { word: "eight", translation: "八" },
    { word: "nine", translation: "九" },
    { word: "ten", translation: "十" }
  ];

  let currentWord = null;
  let nextReviewTime = null;

  // 从本地存储加载练习数据
  function loadPracticeData() {
    try {
      const data = localStorage.getItem('englishPracticeData');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('加载练习数据失败:', error);
      return {};
    }
  }

  // 保存练习数据到本地存储
  function savePracticeData(data) {
    try {
      localStorage.setItem('englishPracticeData', JSON.stringify(data));
    } catch (error) {
      console.error('保存练习数据失败:', error);
    }
  }

  // 从本地存储加载排序设置
  function loadSortSettings() {
    try {
      const settings = localStorage.getItem('englishSortSettings');
      return settings ? JSON.parse(settings) : { field: 'lastTestTime', direction: 'desc' };
    } catch (error) {
      console.error('加载排序设置失败:', error);
      return { field: 'lastTestTime', direction: 'desc' };
    }
  }

  // 保存排序设置到本地存储
  function saveSortSettings(field, direction) {
    try {
      localStorage.setItem('englishSortSettings', JSON.stringify({ field, direction }));
    } catch (error) {
      console.error('保存排序设置失败:', error);
    }
  }

  // 从本地存储加载每日学习量设置
  function loadDailyLimit() {
    try {
      const limit = localStorage.getItem('englishDailyLimit');
      return limit ? parseInt(limit) : 20; // 默认20个
    } catch (error) {
      console.error('加载每日学习量设置失败:', error);
      return 20;
    }
  }

  // 保存每日学习量设置到本地存储
  function saveDailyLimit(limit) {
    try {
      localStorage.setItem('englishDailyLimit', limit.toString());
    } catch (error) {
      console.error('保存每日学习量设置失败:', error);
    }
  }

  // 获取今日已学习的单词数量
  function getTodayLearnedCount() {
    try {
      const data = loadPracticeData();
      const today = new Date().toDateString();
      return Object.values(data).filter(item =>
        new Date(item.lastTestTime).toDateString() === today
      ).length;
    } catch (error) {
      console.error('获取今日学习数量失败:', error);
      return 0;
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
      if (!word) {
        console.error('更新练习数据失败: 单词为空');
        return null;
      }

      const data = loadPracticeData();
      if (!data) {
        console.error('更新练习数据失败: 无法加载练习数据');
        return null;
      }

      if (!data[word.word]) {
        data[word.word] = {
          word: word.word,
          translation: word.translation,
          totalTests: 0,
          correctCount: 0,
          round: 0,
          lastTestTime: new Date().toISOString(),
          nextReviewTime: getNextReviewTime(0).toISOString()
        };
      }

      data[word.word].totalTests++;
      if (isCorrect) {
        data[word.word].correctCount++;
        data[word.word].round = Math.min(data[word.word].round + 1, REVIEW_INTERVALS.length - 1);
      } else {
        data[word.word].round = Math.max(data[word.word].round - 1, 0);
      }

      data[word.word].lastTestTime = new Date().toISOString();
      data[word.word].nextReviewTime = getNextReviewTime(data[word.word].round).toISOString();

      savePracticeData(data);
      return data[word.word];
    } catch (error) {
      console.error('更新练习数据失败:', error);
      return null;
    }
  }

  // 获取需要练习的单词
  function getWordsToPractice() {
    try {
      const data = loadPracticeData();
      const now = new Date();
      const dailyLimit = loadDailyLimit();
      const todayLearned = getTodayLearnedCount();
      const remainingToday = Math.max(0, dailyLimit - todayLearned);

      if (remainingToday === 0) {
        return []; // 今日已达到学习上限
      }

      // 首先获取所有需要复习的单词（根据艾宾浩斯记忆法计算的时间）
      const reviewWords = Object.entries(data)
        .filter(([_, value]) => {
          try {
            return new Date(value.nextReviewTime) <= now;
          } catch (error) {
            console.error('解析复习时间失败:', error);
            return false;
          }
        })
        .map(([key, value]) => ({
          word: key,
          translation: value.translation,
          round: value.round || 0,
          accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0
        }));

      // 如果有需要复习的单词，优先返回这些单词
      if (reviewWords.length > 0) {
        // 按照正确率从低到高排序，优先练习正确率低的单词
        reviewWords.sort((a, b) => a.accuracy - b.accuracy);
        return reviewWords.slice(0, remainingToday);
      }

      // 如果没有需要复习的单词，从单词库中找出未学习的单词
      const learnedWords = new Set(Object.keys(data));
      const unlearnedWords = COMMON_WORDS.filter(word => !learnedWords.has(word.word));

      if (unlearnedWords.length > 0) {
        // 随机选择未学习的单词
        const selectedWords = [];
        const maxWords = Math.min(remainingToday, unlearnedWords.length);

        for (let i = 0; i < maxWords; i++) {
          const randomIndex = Math.floor(Math.random() * unlearnedWords.length);
          const word = unlearnedWords[randomIndex];
          selectedWords.push({
            word: word.word,
            translation: word.translation,
            round: 0,
            accuracy: 0
          });
          unlearnedWords.splice(randomIndex, 1);
        }
        return selectedWords;
      }

      // 如果所有单词都学习过了，随机返回已学习的单词
      const allWords = Object.entries(data).map(([key, value]) => ({
        word: key,
        translation: value.translation,
        round: value.round || 0,
        accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0
      }));

      if (allWords.length === 0) {
        // 如果没有学习记录，返回一些基础单词
        return COMMON_WORDS.slice(0, remainingToday);
      }

      const randomWords = [];
      const maxWords = Math.min(remainingToday, allWords.length);
      const availableWords = [...allWords]; // 创建副本，避免修改原始数组

      for (let i = 0; i < maxWords; i++) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        randomWords.push(availableWords[randomIndex]);
        availableWords.splice(randomIndex, 1);
      }

      return randomWords;
    } catch (error) {
      console.error('获取练习单词失败:', error);
      // 发生错误时返回一些基础单词
      return COMMON_WORDS.slice(0, 10);
    }
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
            max-height: 300px;
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
      const style = document.createElement('style');
      style.textContent = `
        .word-display {
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
        .word {
          font-size: 42px;
          color: #333;
          line-height: 1;
          margin-bottom: 5px;
        }
        .translation {
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
          max-height: 300px;
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
      const learnBtn = document.querySelector('.learn-btn');
      const forgetBtn = document.querySelector('.forget-btn');
      if (learnBtn) learnBtn.disabled = true;
      if (forgetBtn) forgetBtn.disabled = true;

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
            const feedback = document.querySelector('.feedback');
            if (feedback) {
              feedback.className = 'feedback wrong';
              feedback.textContent = '加载下一题失败，请刷新页面重试';
            }

            // 恢复按钮状态
            if (learnBtn) learnBtn.disabled = false;
            if (forgetBtn) forgetBtn.disabled = false;
          }
        } catch (error) {
          console.error('加载下一题失败:', error);
          const feedback = document.querySelector('.feedback');
          if (feedback) {
            feedback.className = 'feedback wrong';
            feedback.textContent = '加载下一题失败，请刷新页面重试';

            // 恢复按钮状态
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
      }
    }
  };
})(); 