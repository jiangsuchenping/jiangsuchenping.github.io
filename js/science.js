(function () {
  // 科学乐园模块
  // 提供适合幼儿园大班小朋友的科学知识学习

  // 科学知识点数据
  const SCIENCE_TOPICS = [
    {
      title: "水的三态",
      content: "水有三种状态：固态（冰）、液态（水）、气态（水蒸气）",
      image: "",
      examples: ["冰块是固态的水", "河流是液态的水", "烧开水时冒出的白气是水蒸气"]
    },
    {
      title: "植物的生长",
      content: "植物需要阳光、水分和土壤才能生长",
      image: "",
      examples: ["种子发芽", "花朵开放", "果实成熟"]
    },
    {
      title: "动物的分类",
      content: "动物可以分为家养动物和野生动物",
      image: "",
      examples: ["小狗、小猫是家养动物", "老虎、大象是野生动物"]
    },
    {
      title: "天气变化",
      content: "天气有晴天、阴天、雨天、雪天等",
      image: "",
      examples: ["太阳出来是晴天", "乌云密布是阴天", "下雨天要打伞"]
    },
    {
      title: "季节变化",
      content: "一年有春夏秋冬四个季节",
      image: "",
      examples: ["春天花开", "夏天炎热", "秋天叶落", "冬天雪白"]
    }
  ];

  // 当前显示的知识点索引
  let currentTopicIndex = 0;

  // 加载科学乐园模块
  window.loadScience = function (container) {
    try {
      if (!container) {
        console.error('容器元素不存在');
        return;
      }

      // 显示第一个知识点
      showTopic(container, currentTopicIndex);
    } catch (error) {
      console.error('加载科学乐园失败:', error);
    }
  };

  // 显示知识点
  function showTopic(container, index) {
    try {
      const topic = SCIENCE_TOPICS[index];
      if (!topic) {
        console.error('知识点不存在');
        return;
      }

      container.innerHTML = `
        <div class="science-container">
          <h2>${topic.title}</h2>
          <p class="science-content">${topic.content}</p>
          <div class="science-examples">
            <h3>例子：</h3>
            <ul>
              ${topic.examples.map(example => `<li>${example}</li>`).join('')}
            </ul>
          </div>
          <div class="science-navigation">
            <button class="nav-btn" onclick="window.sciencePrev()" ${index === 0 ? 'disabled' : ''}>上一个</button>
            <button class="nav-btn" onclick="window.scienceNext()" ${index === SCIENCE_TOPICS.length - 1 ? 'disabled' : ''}>下一个</button>
          </div>
          <button class="return-btn" onclick="window.showModule('')">返回主菜单</button>
        </div>
      `;
    } catch (error) {
      console.error('显示知识点失败:', error);
    }
  }

  // 下一个知识点
  window.scienceNext = function () {
    try {
      if (currentTopicIndex < SCIENCE_TOPICS.length - 1) {
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
  window.sciencePrev = function () {
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