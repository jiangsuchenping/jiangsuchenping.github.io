(function () {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

  // 常用英语单词库（初级）
  const COMMON_WORDS = [
    { word: "hello", phonetic: "/həˈləʊ/", translation: "你好" },
    { word: "goodbye", phonetic: "/ˌɡʊdˈbaɪ/", translation: "再见" },
    { word: "thank you", phonetic: "/ˈθæŋk juː/", translation: "谢谢" },
    { word: "please", phonetic: "/pliːz/", translation: "请" },
    { word: "sorry", phonetic: "/ˈsɒri/", translation: "对不起" },
    { word: "yes", phonetic: "/jes/", translation: "是的" },
    { word: "no", phonetic: "/nəʊ/", translation: "不是" },
    { word: "morning", phonetic: "/ˈmɔːnɪŋ/", translation: "早上" },
    { word: "afternoon", phonetic: "/ˌɑːftəˈnuːn/", translation: "下午" },
    { word: "evening", phonetic: "/ˈiːvnɪŋ/", translation: "晚上" },
    { word: "school", phonetic: "/skuːl/", translation: "学校" },
    { word: "teacher", phonetic: "/ˈtiːtʃə/", translation: "老师" },
    { word: "student", phonetic: "/ˈstjuːdnt/", translation: "学生" },
    { word: "book", phonetic: "/bʊk/", translation: "书" },
    { word: "pencil", phonetic: "/ˈpensl/", translation: "铅笔" },
    { word: "pen", phonetic: "/pen/", translation: "钢笔" },
    { word: "paper", phonetic: "/ˈpeɪpə/", translation: "纸" },
    { word: "table", phonetic: "/ˈteɪbl/", translation: "桌子" },
    { word: "chair", phonetic: "/tʃeə/", translation: "椅子" },
    { word: "classroom", phonetic: "/ˈklɑːsruːm/", translation: "教室" },
    { word: "window", phonetic: "/ˈwɪndəʊ/", translation: "窗户" },
    { word: "door", phonetic: "/dɔː/", translation: "门" },
    { word: "family", phonetic: "/ˈfæməli/", translation: "家庭" },
    { word: "father", phonetic: "/ˈfɑːðə/", translation: "爸爸" },
    { word: "mother", phonetic: "/ˈmʌðə/", translation: "妈妈" },
    { word: "brother", phonetic: "/ˈbrʌðə/", translation: "兄弟" },
    { word: "sister", phonetic: "/ˈsɪstə/", translation: "姐妹" },
    { word: "water", phonetic: "/ˈwɔːtə/", translation: "水" },
    { word: "food", phonetic: "/fuːd/", translation: "食物" },
    { word: "fruit", phonetic: "/fruːt/", translation: "水果" },
    { word: "apple", phonetic: "/ˈæpl/", translation: "苹果" },
    { word: "banana", phonetic: "/bəˈnɑːnə/", translation: "香蕉" },
    { word: "orange", phonetic: "/ˈɒrɪndʒ/", translation: "橙子" },
    { word: "red", phonetic: "/red/", translation: "红色" },
    { word: "blue", phonetic: "/bluː/", translation: "蓝色" },
    { word: "green", phonetic: "/ɡriːn/", translation: "绿色" },
    { word: "yellow", phonetic: "/ˈjeləʊ/", translation: "黄色" },
    { word: "black", phonetic: "/blæk/", translation: "黑色" },
    { word: "white", phonetic: "/waɪt/", translation: "白色" },
    { word: "one", phonetic: "/wʌn/", translation: "一" },
    { word: "two", phonetic: "/tuː/", translation: "二" },
    { word: "three", phonetic: "/θriː/", translation: "三" },
    { word: "four", phonetic: "/fɔː/", translation: "四" },
    { word: "five", phonetic: "/faɪv/", translation: "五" },
    { word: "six", phonetic: "/sɪks/", translation: "六" },
    { word: "seven", phonetic: "/ˈsevn/", translation: "七" },
    { word: "eight", phonetic: "/eɪt/", translation: "八" },
    { word: "nine", phonetic: "/naɪn/", translation: "九" },
    { word: "ten", phonetic: "/ten/", translation: "十" },
    // 扩充的单词
    { word: "cat", phonetic: "/kæt/", translation: "猫" },
    { word: "dog", phonetic: "/dɒɡ/", translation: "狗" },
    { word: "bird", phonetic: "/bɜːd/", translation: "鸟" },
    { word: "fish", phonetic: "/fɪʃ/", translation: "鱼" },
    { word: "rabbit", phonetic: "/ˈræbɪt/", translation: "兔子" },
    { word: "elephant", phonetic: "/ˈelɪfənt/", translation: "大象" },
    { word: "pig", phonetic: "/pɪɡ/", translation: "猪" },
    { word: "horse", phonetic: "/hɔːs/", translation: "马" },
    { word: "duck", phonetic: "/dʌk/", translation: "鸭子" },
    { word: "chicken", phonetic: "/ˈtʃɪkɪn/", translation: "鸡" },
    { word: "cow", phonetic: "/kaʊ/", translation: "奶牛" },
    { word: "sheep", phonetic: "/ʃiːp/", translation: "羊" },
    { word: "tiger", phonetic: "/ˈtaɪɡə/", translation: "老虎" },
    { word: "lion", phonetic: "/ˈlaɪən/", translation: "狮子" },
    { word: "monkey", phonetic: "/ˈmʌŋki/", translation: "猴子" },
    { word: "zebra", phonetic: "/ˈzebrə/", translation: "斑马" },
    { word: "bear", phonetic: "/beə/", translation: "熊" },
    { word: "panda", phonetic: "/ˈpændə/", translation: "熊猫" },
    { word: "sun", phonetic: "/sʌn/", translation: "太阳" },
    { word: "moon", phonetic: "/muːn/", translation: "月亮" },
    { word: "star", phonetic: "/stɑː/", translation: "星星" },
    { word: "sky", phonetic: "/skaɪ/", translation: "天空" },
    { word: "cloud", phonetic: "/klaʊd/", translation: "云" },
    { word: "rain", phonetic: "/reɪn/", translation: "雨" },
    { word: "snow", phonetic: "/snəʊ/", translation: "雪" },
    { word: "wind", phonetic: "/wɪnd/", translation: "风" },
    { word: "flower", phonetic: "/ˈflaʊə/", translation: "花" },
    { word: "tree", phonetic: "/triː/", translation: "树" },
    { word: "grass", phonetic: "/ɡrɑːs/", translation: "草" },
    { word: "leaf", phonetic: "/liːf/", translation: "叶子" },
    { word: "house", phonetic: "/haʊs/", translation: "房子" },
    { word: "room", phonetic: "/ruːm/", translation: "房间" },
    { word: "bed", phonetic: "/bed/", translation: "床" },
    { word: "toy", phonetic: "/tɔɪ/", translation: "玩具" },
    { word: "ball", phonetic: "/bɔːl/", translation: "球" },
    { word: "doll", phonetic: "/dɒl/", translation: "娃娃" },
    { word: "car", phonetic: "/kɑː/", translation: "汽车" },
    { word: "bus", phonetic: "/bʌs/", translation: "公共汽车" },
    { word: "train", phonetic: "/treɪn/", translation: "火车" },
    { word: "airplane", phonetic: "/ˈeəpleɪn/", translation: "飞机" },
    { word: "boat", phonetic: "/bəʊt/", translation: "船" },
    { word: "bicycle", phonetic: "/ˈbaɪsɪkl/", translation: "自行车" },
    { word: "eye", phonetic: "/aɪ/", translation: "眼睛" },
    { word: "ear", phonetic: "/ɪə/", translation: "耳朵" },
    { word: "nose", phonetic: "/nəʊz/", translation: "鼻子" },
    { word: "mouth", phonetic: "/maʊθ/", translation: "嘴巴" },
    { word: "hand", phonetic: "/hænd/", translation: "手" },
    { word: "foot", phonetic: "/fʊt/", translation: "脚" },
    { word: "head", phonetic: "/hed/", translation: "头" },
    { word: "face", phonetic: "/feɪs/", translation: "脸" },
    { word: "hair", phonetic: "/heə/", translation: "头发" },
    { word: "body", phonetic: "/ˈbɒdi/", translation: "身体" },
    { word: "leg", phonetic: "/leɡ/", translation: "腿" },
    { word: "arm", phonetic: "/ɑːm/", translation: "手臂" },
    { word: "circle", phonetic: "/ˈsɜːkl/", translation: "圆形" },
    { word: "triangle", phonetic: "/ˈtraɪæŋɡl/", translation: "三角形" },
    { word: "square", phonetic: "/skweə/", translation: "正方形" },
    { word: "rectangle", phonetic: "/ˈrektæŋɡl/", translation: "长方形" },
    { word: "big", phonetic: "/bɪɡ/", translation: "大的" },
    { word: "small", phonetic: "/smɔːl/", translation: "小的" },
    { word: "long", phonetic: "/lɒŋ/", translation: "长的" },
    { word: "short", phonetic: "/ʃɔːt/", translation: "短的" },
    { word: "tall", phonetic: "/tɔːl/", translation: "高的" },
    { word: "heavy", phonetic: "/ˈhevi/", translation: "重的" },
    { word: "light", phonetic: "/laɪt/", translation: "轻的" },
    { word: "hot", phonetic: "/hɒt/", translation: "热的" },
    { word: "cold", phonetic: "/kəʊld/", translation: "冷的" },
    { word: "new", phonetic: "/njuː/", translation: "新的" },
    { word: "old", phonetic: "/əʊld/", translation: "旧的" },
    { word: "happy", phonetic: "/ˈhæpi/", translation: "开心的" },
    { word: "sad", phonetic: "/sæd/", translation: "伤心的" },
    { word: "good", phonetic: "/ɡʊd/", translation: "好的" },
    { word: "bad", phonetic: "/bæd/", translation: "坏的" },
    { word: "fast", phonetic: "/fɑːst/", translation: "快的" },
    { word: "slow", phonetic: "/sləʊ/", translation: "慢的" },
    { word: "up", phonetic: "/ʌp/", translation: "上" },
    { word: "down", phonetic: "/daʊn/", translation: "下" },
    { word: "left", phonetic: "/left/", translation: "左边" },
    { word: "right", phonetic: "/raɪt/", translation: "右边" },
    { word: "in", phonetic: "/ɪn/", translation: "在里面" },
    { word: "out", phonetic: "/aʊt/", translation: "在外面" },
    { word: "on", phonetic: "/ɒn/", translation: "在上面" },
    { word: "under", phonetic: "/ˈʌndə/", translation: "在下面" },
    { word: "here", phonetic: "/hɪə/", translation: "这里" },
    { word: "there", phonetic: "/ðeə/", translation: "那里" },
    { word: "boy", phonetic: "/bɔɪ/", translation: "男孩" },
    { word: "girl", phonetic: "/ɡɜːl/", translation: "女孩" },
    { word: "friend", phonetic: "/frend/", translation: "朋友" },
    { word: "baby", phonetic: "/ˈbeɪbi/", translation: "婴儿" },
    { word: "man", phonetic: "/mæn/", translation: "男人" },
    { word: "woman", phonetic: "/ˈwʊmən/", translation: "女人" },
    { word: "eat", phonetic: "/iːt/", translation: "吃" },
    { word: "drink", phonetic: "/drɪŋk/", translation: "喝" },
    { word: "sleep", phonetic: "/sliːp/", translation: "睡觉" },
    { word: "run", phonetic: "/rʌn/", translation: "跑" },
    { word: "walk", phonetic: "/wɔːk/", translation: "走" },
    { word: "jump", phonetic: "/dʒʌmp/", translation: "跳" },
    { word: "sing", phonetic: "/sɪŋ/", translation: "唱歌" },
    { word: "dance", phonetic: "/dɑːns/", translation: "跳舞" },
    { word: "play", phonetic: "/pleɪ/", translation: "玩" },
    { word: "read", phonetic: "/riːd/", translation: "读" },
    { word: "write", phonetic: "/raɪt/", translation: "写" },
    { word: "draw", phonetic: "/drɔː/", translation: "画" },
    { word: "love", phonetic: "/lʌv/", translation: "爱" },
    { word: "like", phonetic: "/laɪk/", translation: "喜欢" },
    { word: "want", phonetic: "/wɒnt/", translation: "想要" },
    { word: "give", phonetic: "/ɡɪv/", translation: "给" },
    { word: "take", phonetic: "/teɪk/", translation: "拿" },
    { word: "open", phonetic: "/ˈəʊpən/", translation: "打开" },
    { word: "close", phonetic: "/kləʊz/", translation: "关闭" },
    { word: "help", phonetic: "/help/", translation: "帮助" },
    { word: "milk", phonetic: "/mɪlk/", translation: "牛奶" },
    { word: "juice", phonetic: "/dʒuːs/", translation: "果汁" },
    { word: "rice", phonetic: "/raɪs/", translation: "米饭" },
    { word: "bread", phonetic: "/bred/", translation: "面包" },
    { word: "egg", phonetic: "/eɡ/", translation: "鸡蛋" },
    { word: "meat", phonetic: "/miːt/", translation: "肉" },
    { word: "vegetable", phonetic: "/ˈvedʒtəbl/", translation: "蔬菜" },
    { word: "potato", phonetic: "/pəˈteɪtəʊ/", translation: "土豆" },
    { word: "tomato", phonetic: "/təˈmɑːtəʊ/", translation: "番茄" },
    { word: "carrot", phonetic: "/ˈkærət/", translation: "胡萝卜" },
    { word: "cookie", phonetic: "/ˈkʊki/", translation: "饼干" },
    { word: "ice cream", phonetic: "/ˈaɪs kriːm/", translation: "冰淇淋" },
    { word: "candy", phonetic: "/ˈkændi/", translation: "糖果" },
    { word: "cake", phonetic: "/keɪk/", translation: "蛋糕" }
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
          phonetic: word.phonetic || "",
          translation: word.translation,
          totalTests: 0,
          correctCount: 0,
          round: 0,
          lastTestTime: new Date().toISOString(),
          nextReviewTime: getNextReviewTime(0).toISOString()
        };
      } else if (!data[word.word].phonetic && word.phonetic) {
        // 确保旧数据也有音标信息
        data[word.word].phonetic = word.phonetic;
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
          phonetic: value.phonetic,
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
            phonetic: word.phonetic,
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
        phonetic: value.phonetic,
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
          gap: 5px;
        }
        .word {
          font-size: 42px;
          color: #333;
          line-height: 1;
          margin-bottom: 0;
        }
        .phonetic {
          font-size: 20px;
          color: #888;
          font-style: italic;
          margin: 5px 0;
          display: block; /* 确保音标显示 */
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
        // 聚焦并全选输入框内容
        setTimeout(() => {
          input.focus();
          input.select();
        }, 0);
      }
    }
  };
})(); 