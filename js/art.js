(function () {
  // 艺术乐园模块
  // 提供适合幼儿园大班小朋友的艺术知识学习

  // 艺术知识点数据
  const ART_TOPICS = [
    {
      title: "颜色的认识",
      content: "我们身边有很多美丽的颜色，比如红色、蓝色、绿色、黄色等",
      examples: ["红色的苹果", "蓝色的天空", "绿色的草地", "黄色的香蕉"]
    },
    {
      title: "基本形状",
      content: "常见的基本形状有圆形、方形、三角形等",
      examples: ["太阳是圆形的", "窗户是方形的", "屋顶是三角形的"]
    },
    {
      title: "音乐节拍",
      content: "音乐有快慢节奏，我们可以跟着节拍摆动身体",
      examples: ["快节奏可以快速拍手", "慢节奏可以慢慢摆动"]
    },
    {
      title: "绘画工具",
      content: "常用的绘画工具有画笔、颜料、画纸等",
      examples: ["用画笔蘸颜料在纸上画画", "可以用手指作画"]
    }
  ];

  // 当前显示的知识点索引
  let currentTopicIndex = 0;

  // 加载艺术乐园模块
  window.loadArt = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      // 显示第一个知识点
      showTopic(container, currentTopicIndex);
    } catch (error) {
      console.error('加载艺术乐园失败:', error);
    }
  };

  // 显示知识点
  function showTopic(container, index) {
    try {
      const topic = ART_TOPICS[index];
      if (!topic) {
        console.error('知识点不存在');
        return;
      }

      container.innerHTML = `
        <div class="art-container">
          <h2>${topic.title}</h2>
          <p class="art-content">${topic.content}</p>
          <div class="art-examples">
            <h3>例子：</h3>
            <ul>
              ${topic.examples.map(example => `<li>${example}</li>`).join('')}
            </ul>
          </div>
          <div class="art-navigation">
            <button class="nav-btn" onclick="window.artPrev()" ${index === 0 ? 'disabled' : ''}>上一个</button>
            <button class="nav-btn" onclick="window.artNext()" ${index === ART_TOPICS.length - 1 ? 'disabled' : ''}>下一个</button>
          </div>
          <button class="return-btn" onclick="window.showModule('')">返回主菜单</button>
        </div>
      `;
    } catch (error) {
      console.error('显示知识点失败:', error);
    }
  }

  // 下一个知识点
  window.artNext = function () {
    try {
      if (currentTopicIndex < ART_TOPICS.length - 1) {
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
  window.artPrev = function () {
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