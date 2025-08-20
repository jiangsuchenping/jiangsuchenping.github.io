(function () {
  // 音乐乐园模块
  // 提供适合幼儿园大班小朋友的音乐知识学习

  // 音乐知识点数据
  const MUSIC_TOPICS = [
    {
      title: "认识乐器",
      content: "常见的乐器有钢琴、小提琴、吉他、鼓等",
      examples: ["钢琴有黑白键", "小提琴需要拉弓", "吉他有六根弦", "鼓需要用鼓棒敲击"]
    },
    {
      title: "音符的认识",
      content: "基本音符有四分音符、八分音符等，它们的时值不同",
      examples: ["四分音符唱一拍", "八分音符唱半拍"]
    },
    {
      title: "节拍和节奏",
      content: "音乐有2/4拍、3/4拍、4/4拍等不同的节拍",
      examples: ["2/4拍强弱交替", "3/4拍强弱弱", "4/4拍强弱次强弱"]
    },
    {
      title: "音乐表情",
      content: "音乐有不同的表情，如欢快的、悲伤的、激昂的等",
      examples: ["欢快的音乐让人想跳舞", "悲伤的音乐让人想哭", "激昂的音乐让人心情振奋"]
    }
  ];

  // 当前显示的知识点索引
  let currentTopicIndex = 0;

  // 加载音乐乐园模块
  window.loadMusic = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      // 显示第一个知识点
      showTopic(container, currentTopicIndex);
    } catch (error) {
      console.error('加载音乐乐园失败:', error);
    }
  };

  // 显示知识点
  function showTopic(container, index) {
    try {
      const topic = MUSIC_TOPICS[index];
      if (!topic) {
        console.error('知识点不存在');
        return;
      }

      container.innerHTML = `
        <div class="music-container">
          <h2>${topic.title}</h2>
          <p class="music-content">${topic.content}</p>
          <div class="music-examples">
            <h3>例子：</h3>
            <ul>
              ${topic.examples.map(example => `<li>${example}</li>`).join('')}
            </ul>
          </div>
          <div class="music-navigation">
            <button class="nav-btn" onclick="window.musicPrev()" ${index === 0 ? 'disabled' : ''}>上一个</button>
            <button class="nav-btn" onclick="window.musicNext()" ${index === MUSIC_TOPICS.length - 1 ? 'disabled' : ''}>下一个</button>
          </div>
          <button class="return-btn" onclick="window.showModule('')">返回主菜单</button>
        </div>
      `;
    } catch (error) {
      console.error('显示知识点失败:', error);
    }
  }

  // 下一个知识点
  window.musicNext = function () {
    try {
      if (currentTopicIndex < MUSIC_TOPICS.length - 1) {
        currentTopicIndex++;
        const container = document.getElementById('module-content');
        if (container) {
          showTopic(container, currentTopicIndex);
        }
      }
    } catch (error) {
      console.error('下一个知识点失败:', error);
    }
  };

  // 上一个知识点
  window.musicPrev = function () {
    try {
      if (currentTopicIndex > 0) {
        currentTopicIndex--;
        const container = document.getElementById('module-content');
        if (container) {
          showTopic(container, currentTopicIndex);
        }
      }
    } catch (error) {
      console.error('上一个知识点失败:', error);
    }
  };

})();