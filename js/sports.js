(function () {
  // 体育乐园模块
  // 提供适合幼儿园大班小朋友的体育知识学习

  // 体育知识点数据
  const SPORTS_TOPICS = [
    {
      title: "基本运动",
      content: "常见的基本运动有跑步、跳跃、投掷、平衡等",
      examples: ["跑步可以锻炼腿部肌肉", "跳跃可以增强弹跳力", "投掷可以锻炼手臂力量", "走平衡木可以提高平衡能力"]
    },
    {
      title: "球类运动",
      content: "常见的球类运动有足球、篮球、乒乓球、羽毛球等",
      examples: ["踢足球需要用脚", "打篮球需要用手投篮", "乒乓球很小很轻", "羽毛球有长长的球拍"]
    },
    {
      title: "户外活动",
      content: "户外活动有爬山、游泳、骑车、滑板等",
      examples: ["爬山可以锻炼体力", "游泳要在水里", "骑车需要平衡", "滑板很酷但要注意安全"]
    },
    {
      title: "运动安全",
      content: "运动时要注意安全，穿合适的运动鞋和服装",
      examples: ["运动前要做热身", "运动后要做拉伸", "不要在硬地上跳", "要多喝水"]
    }
  ];

  // 当前显示的知识点索引
  let currentTopicIndex = 0;

  // 加载体育乐园模块
  window.loadSports = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      // 显示第一个知识点
      showTopic(container, currentTopicIndex);
    } catch (error) {
      console.error('加载体育乐园失败:', error);
    }
  };

  // 显示知识点
  function showTopic(container, index) {
    try {
      const topic = SPORTS_TOPICS[index];
      if (!topic) {
        console.error('知识点不存在');
        return;
      }

      container.innerHTML = `
        <div class="sports-container">
          <h2>${topic.title}</h2>
          <p class="sports-content">${topic.content}</p>
          <div class="sports-examples">
            <h3>例子：</h3>
            <ul>
              ${topic.examples.map(example => `<li>${example}</li>`).join('')}
            </ul>
          </div>
          <div class="sports-navigation">
            <button class="nav-btn" onclick="window.sportsPrev()" ${index === 0 ? 'disabled' : ''}>上一个</button>
            <button class="nav-btn" onclick="window.sportsNext()" ${index === SPORTS_TOPICS.length - 1 ? 'disabled' : ''}>下一个</button>
          </div>
          <button class="return-btn" onclick="window.showModule('')">返回主菜单</button>
        </div>
      `;
    } catch (error) {
      console.error('显示知识点失败:', error);
    }
  }

  // 下一个知识点
  window.sportsNext = function () {
    try {
      if (currentTopicIndex < SPORTS_TOPICS.length - 1) {
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
  window.sportsPrev = function () {
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