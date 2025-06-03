(function() {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

  // 常用汉字库（一级字库）
  const COMMON_CHARACTERS = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';

  let currentCharacter = null;
  let nextReviewTime = null;
  let reviewTimer = null;
  let countdownTimer = null;

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
  function updatePracticeData(character, isCorrect) {
    try {
      const data = loadPracticeData();
      
      if (!data[character]) {
        data[character] = {
          character: character,
          totalTests: 0,
          correctCount: 0,
          round: 0,
          lastTestTime: new Date().toISOString(),
          nextReviewTime: getNextReviewTime(0).toISOString()
        };
      }
      
      data[character].totalTests++;
      if (isCorrect) {
        data[character].correctCount++;
        data[character].round = Math.min(data[character].round + 1, REVIEW_INTERVALS.length - 1);
      } else {
        data[character].round = Math.max(data[character].round - 1, 0);
      }
      
      data[character].lastTestTime = new Date().toISOString();
      data[character].nextReviewTime = getNextReviewTime(data[character].round).toISOString();
      
      savePracticeData(data);
      return data[character];
    } catch (error) {
      console.error('更新练习数据失败:', error);
      return null;
    }
  }

  // 获取需要练习的汉字
  function getCharactersToPractice() {
    try {
      const data = loadPracticeData();
      const now = new Date();
      const characters = [];
      
      // 首先获取所有需要复习的汉字（根据艾宾浩斯记忆法计算的时间）
      const reviewCharacters = Object.entries(data)
        .filter(([_, value]) => new Date(value.nextReviewTime) <= now)
        .map(([key, value]) => ({
          character: key,
          round: value.round || 0,
          accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0
        }));
      
      // 如果有需要复习的汉字，优先返回这些汉字
      if (reviewCharacters.length > 0) {
        // 按照正确率从低到高排序，优先练习正确率低的汉字
        reviewCharacters.sort((a, b) => a.accuracy - b.accuracy);
        return reviewCharacters;
      }
      
      // 如果没有需要复习的汉字，从字库中找出未学习的汉字
      const learnedCharacters = new Set(Object.keys(data));
      const unlearnedCharacters = COMMON_CHARACTERS.split('')
        .filter(char => !learnedCharacters.has(char));
      
      if (unlearnedCharacters.length > 0) {
        // 随机选择10个未学习的汉字
        const selectedCharacters = [];
        while (selectedCharacters.length < 10 && unlearnedCharacters.length > 0) {
          const randomIndex = Math.floor(Math.random() * unlearnedCharacters.length);
          selectedCharacters.push({
            character: unlearnedCharacters[randomIndex],
            round: 0,
            accuracy: 0
          });
          unlearnedCharacters.splice(randomIndex, 1);
        }
        return selectedCharacters;
      }
      
      return [];
    } catch (error) {
      console.error('获取练习汉字失败:', error);
      return [];
    }
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
  window.loadChinese = function(container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      const characters = getCharactersToPractice();
      if (characters.length === 0) {
        // 获取最近的复习时间
        const data = loadPracticeData();
        const nextTimes = Object.values(data)
          .map(d => new Date(d.nextReviewTime))
          .filter(time => time > new Date()); // 只考虑未来的时间
        
        if (nextTimes.length > 0) {
          nextReviewTime = new Date(Math.min(...nextTimes));
          
          container.innerHTML = `
            <h2>语文乐园</h2>
            <div class="rest-message">
              <p>今天的练习已经完成啦！</p>
              <p class="countdown">休息一下，稍后可以继续练习哦！</p>
            </div>
            <div class="history-section">
              <h3>练习历史</h3>
              <div class="history-list"></div>
            </div>
            <button class="return-btn" onclick="window.showModule('')">返回首页</button>
          `;
          
          // 显示历史记录
          const historyList = container.querySelector('.history-list');
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
            historyList.innerHTML = `
              <table class="history-table">
                <thead>
                  <tr>
                    <th>汉字</th>
                    <th>练习次数</th>
                    <th>正确率</th>
                    <th>上次练习</th>
                    <th>下次复习</th>
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
          } else {
            historyList.innerHTML = '<p class="no-history">还没有练习记录哦，开始练习吧！</p>';
          }
          
          // 启动倒计时更新
          if (countdownTimer) {
            clearInterval(countdownTimer);
          }
          countdownTimer = setInterval(updateCountdown, 1000);
          updateCountdown(); // 立即更新一次
          
          return;
        }
      }
      
      // 随机选择一个汉字
      const randomIndex = Math.floor(Math.random() * characters.length);
      currentCharacter = characters[randomIndex];
      
      container.innerHTML = `
        <h2>语文乐园</h2>
        <div class="character-display">
          ${currentCharacter.character}
        </div>
        <div class="options">
          <button onclick="window.handleAnswer(true)">认识</button>
          <button onclick="window.handleAnswer(false)">不认识</button>
        </div>
        <div class="feedback"></div>
        <div class="history-section">
          <h3>练习历史</h3>
          <div class="history-list"></div>
        </div>
        <button class="return-btn" onclick="window.showModule('')">返回首页</button>
      `;

      // 异步加载历史记录
      requestAnimationFrame(() => {
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
            historyList.innerHTML = `
              <table class="history-table">
                <thead>
                  <tr>
                    <th>汉字</th>
                    <th>练习次数</th>
                    <th>正确率</th>
                    <th>上次练习</th>
                    <th>下次复习</th>
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
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      };

      // 添加清理函数到window对象
      window.cleanupChinese = cleanup;
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
      if (!currentCharacter) {
        console.error('当前没有汉字');
        const feedback = document.querySelector('.feedback');
        if (feedback) {
          feedback.className = 'feedback wrong';
          feedback.textContent = '题目加载失败，请刷新页面重试';
        }
        return;
      }

      const characterData = updatePracticeData(currentCharacter.character, isCorrect);
      
      const feedback = document.querySelector('.feedback');
      if (feedback) {
        feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.textContent = isCorrect ? '太棒了！' : '继续加油！';
      }
      
      // 延迟加载下一题，确保用户能看到反馈
      setTimeout(() => {
        const moduleContent = document.getElementById('module-content');
        if (moduleContent && typeof window.loadChinese === 'function') {
          window.loadChinese(moduleContent);
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

  // 添加全局清理函数
  window.addEventListener('beforeunload', () => {
    if (window.cleanupChinese) {
      window.cleanupChinese();
    }
  });
})();

function loadChinese(container) {
  container.innerHTML = `
    <h2>语文乐园</h2>
    <p>请认一认这些汉字：</p>
    <div class="chinese-list">
      <div class="character-card">
        <div class="character">日</div>
        <div class="pinyin">rì</div>
        <div class="meaning">太阳</div>
      </div>
      <div class="character-card">
        <div class="character">月</div>
        <div class="pinyin">yuè</div>
        <div class="meaning">月亮</div>
      </div>
      <div class="character-card">
        <div class="character">水</div>
        <div class="pinyin">shuǐ</div>
        <div class="meaning">水</div>
      </div>
      <div class="character-card">
        <div class="character">火</div>
        <div class="pinyin">huǒ</div>
        <div class="meaning">火</div>
      </div>
      <div class="character-card">
        <div class="character">山</div>
        <div class="pinyin">shān</div>
        <div class="meaning">山</div>
      </div>
      <div class="character-card">
        <div class="character">木</div>
        <div class="pinyin">mù</div>
        <div class="meaning">树木</div>
      </div>
      <div class="character-card">
        <div class="character">土</div>
        <div class="pinyin">tǔ</div>
        <div class="meaning">土地</div>
      </div>
      <div class="character-card">
        <div class="character">石</div>
        <div class="pinyin">shí</div>
        <div class="meaning">石头</div>
      </div>
      <div class="character-card">
        <div class="character">天</div>
        <div class="pinyin">tiān</div>
        <div class="meaning">天空</div>
      </div>
      <div class="character-card">
        <div class="character">地</div>
        <div class="pinyin">dì</div>
        <div class="meaning">大地</div>
      </div>
      <div class="character-card">
        <div class="character">人</div>
        <div class="pinyin">rén</div>
        <div class="meaning">人</div>
      </div>
      <div class="character-card">
        <div class="character">口</div>
        <div class="pinyin">kǒu</div>
        <div class="meaning">嘴巴</div>
      </div>
    </div>
    <div class="controls">
      <button class="prev-btn" onclick="prevPage()">上一页</button>
      <button class="next-btn" onclick="nextPage()">下一页</button>
    </div>
    <button class="return-btn" onclick="showModule('')">返回首页</button>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .chinese-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .character-card {
      background: #fff;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .character-card:hover {
      transform: translateY(-5px);
    }
    .character {
      font-size: 48px;
      margin-bottom: 10px;
      color: #333;
    }
    .pinyin {
      font-size: 18px;
      color: #666;
      margin-bottom: 5px;
    }
    .meaning {
      font-size: 16px;
      color: #888;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    }
    .prev-btn, .next-btn {
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      background: #4CAF50;
      color: white;
      cursor: pointer;
      transition: background 0.2s;
    }
    .prev-btn:hover, .next-btn:hover {
      background: #45a049;
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
  `;
  document.head.appendChild(style);
}

// 分页功能
let currentPage = 0;
const charactersPerPage = 12;

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    loadChinese(document.getElementById('module-content'));
  }
}

function nextPage() {
  currentPage++;
  loadChinese(document.getElementById('module-content'));
} 