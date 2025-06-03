(function() {
  // 艾宾浩斯记忆法复习间隔（分钟）
  const REVIEW_INTERVALS = [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200];

  // 常用汉字库（一级字库）
  const COMMON_CHARACTERS = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';

  // 汉字拼音对照表
  const PINYIN_MAP = {
    '的': 'de', '一': 'yī', '是': 'shì', '在': 'zài', '不': 'bù', '了': 'le',
    '有': 'yǒu', '和': 'hé', '人': 'rén', '这': 'zhè', '中': 'zhōng', '大': 'dà',
    '为': 'wéi', '上': 'shàng', '个': 'gè', '国': 'guó', '我': 'wǒ', '以': 'yǐ',
    '要': 'yào', '他': 'tā', '时': 'shí', '来': 'lái', '用': 'yòng', '们': 'men',
    '生': 'shēng', '到': 'dào', '作': 'zuò', '地': 'dì', '于': 'yú', '出': 'chū',
    '就': 'jiù', '分': 'fēn', '对': 'duì', '成': 'chéng', '会': 'huì', '可': 'kě',
    '主': 'zhǔ', '发': 'fā', '年': 'nián', '动': 'dòng', '同': 'tóng', '工': 'gōng',
    '也': 'yě', '能': 'néng', '下': 'xià', '过': 'guò', '子': 'zǐ', '说': 'shuō',
    '产': 'chǎn', '种': 'zhǒng', '面': 'miàn', '而': 'ér', '方': 'fāng', '后': 'hòu',
    '多': 'duō', '定': 'dìng', '行': 'xíng', '学': 'xué', '法': 'fǎ', '所': 'suǒ',
    '民': 'mín', '得': 'dé', '经': 'jīng', '十': 'shí', '三': 'sān', '之': 'zhī',
    '进': 'jìn', '着': 'zhe', '等': 'děng', '部': 'bù', '度': 'dù', '家': 'jiā',
    '电': 'diàn', '力': 'lì', '里': 'lǐ', '如': 'rú', '水': 'shuǐ', '化': 'huà',
    '高': 'gāo', '自': 'zì', '二': 'èr', '理': 'lǐ', '起': 'qǐ', '小': 'xiǎo',
    '物': 'wù', '现': 'xiàn', '实': 'shí', '加': 'jiā', '量': 'liàng', '都': 'dōu',
    '两': 'liǎng', '体': 'tǐ', '制': 'zhì', '机': 'jī', '当': 'dāng', '使': 'shǐ',
    '点': 'diǎn', '从': 'cóng', '业': 'yè', '本': 'běn', '去': 'qù', '把': 'bǎ',
    '性': 'xìng', '好': 'hǎo', '应': 'yīng', '开': 'kāi', '它': 'tā', '合': 'hé',
    '还': 'hái', '因': 'yīn', '由': 'yóu', '其': 'qí', '些': 'xiē', '然': 'rán',
    '前': 'qián', '外': 'wài', '天': 'tiān', '政': 'zhèng', '四': 'sì', '日': 'rì',
    '那': 'nà', '社': 'shè', '义': 'yì', '事': 'shì', '平': 'píng', '形': 'xíng',
    '相': 'xiāng', '全': 'quán', '表': 'biǎo', '间': 'jiān', '样': 'yàng', '与': 'yǔ',
    '关': 'guān', '各': 'gè', '重': 'zhòng', '新': 'xīn', '线': 'xiàn', '内': 'nèi',
    '数': 'shù', '正': 'zhèng', '心': 'xīn', '反': 'fǎn', '你': 'nǐ', '明': 'míng',
    '看': 'kàn', '原': 'yuán', '又': 'yòu', '么': 'me', '利': 'lì', '比': 'bǐ',
    '或': 'huò', '但': 'dàn', '质': 'zhì', '气': 'qì', '第': 'dì', '向': 'xiàng',
    '道': 'dào', '命': 'mìng', '此': 'cǐ', '变': 'biàn', '条': 'tiáo', '只': 'zhǐ',
    '没': 'méi', '结': 'jié', '解': 'jiě', '问': 'wèn', '意': 'yì', '建': 'jiàn',
    '月': 'yuè', '公': 'gōng', '无': 'wú', '系': 'xì', '军': 'jūn', '很': 'hěn',
    '情': 'qíng', '者': 'zhě', '最': 'zuì', '立': 'lì', '代': 'dài', '想': 'xiǎng',
    '已': 'yǐ', '通': 'tōng', '并': 'bìng', '提': 'tí', '直': 'zhí', '题': 'tí',
    '党': 'dǎng', '程': 'chéng', '展': 'zhǎn', '五': 'wǔ', '果': 'guǒ', '料': 'liào',
    '象': 'xiàng', '员': 'yuán', '革': 'gé', '位': 'wèi', '入': 'rù', '常': 'cháng',
    '文': 'wén', '总': 'zǒng', '次': 'cì', '品': 'pǐn', '式': 'shì', '活': 'huó',
    '设': 'shè', '及': 'jí', '管': 'guǎn', '特': 'tè', '件': 'jiàn', '长': 'cháng',
    '求': 'qiú', '老': 'lǎo', '头': 'tóu', '基': 'jī', '资': 'zī', '边': 'biān',
    '流': 'liú', '路': 'lù', '级': 'jí', '少': 'shǎo', '图': 'tú', '山': 'shān',
    '统': 'tǒng', '接': 'jiē', '知': 'zhī', '较': 'jiào', '将': 'jiāng', '组': 'zǔ',
    '见': 'jiàn', '计': 'jì', '别': 'bié', '她': 'tā', '手': 'shǒu', '角': 'jiǎo',
    '期': 'qī', '根': 'gēn', '论': 'lùn', '运': 'yùn', '农': 'nóng', '指': 'zhǐ',
    '几': 'jǐ', '九': 'jiǔ', '区': 'qū', '强': 'qiáng', '放': 'fàng', '决': 'jué',
    '西': 'xī', '被': 'bèi', '干': 'gàn', '做': 'zuò', '必': 'bì', '战': 'zhàn',
    '先': 'xiān', '回': 'huí', '则': 'zé', '任': 'rèn', '取': 'qǔ', '据': 'jù',
    '处': 'chù', '队': 'duì', '南': 'nán', '给': 'gěi', '色': 'sè', '光': 'guāng',
    '门': 'mén', '即': 'jí', '保': 'bǎo', '治': 'zhì', '北': 'běi', '造': 'zào',
    '百': 'bǎi', '规': 'guī', '热': 'rè', '领': 'lǐng', '七': 'qī', '海': 'hǎi',
    '口': 'kǒu', '东': 'dōng', '导': 'dǎo', '器': 'qì', '压': 'yā', '志': 'zhì',
    '世': 'shì', '金': 'jīn', '增': 'zēng', '争': 'zhēng', '济': 'jì', '阶': 'jiē',
    '油': 'yóu', '思': 'sī', '术': 'shù', '极': 'jí', '交': 'jiāo', '受': 'shòu',
    '联': 'lián', '什': 'shén', '认': 'rèn', '六': 'liù', '共': 'gòng', '权': 'quán',
    '收': 'shōu', '证': 'zhèng', '改': 'gǎi', '清': 'qīng', '己': 'jǐ', '美': 'měi',
    '再': 'zài', '采': 'cǎi', '转': 'zhuǎn', '更': 'gèng', '单': 'dān', '风': 'fēng',
    '切': 'qiē', '打': 'dǎ', '白': 'bái', '教': 'jiào', '速': 'sù', '花': 'huā',
    '带': 'dài', '安': 'ān', '场': 'chǎng', '身': 'shēn', '车': 'chē', '例': 'lì',
    '真': 'zhēn', '务': 'wù', '具': 'jù', '万': 'wàn', '每': 'měi', '目': 'mù',
    '至': 'zhì', '达': 'dá', '走': 'zǒu', '积': 'jī', '示': 'shì', '议': 'yì',
    '声': 'shēng', '报': 'bào', '斗': 'dòu', '完': 'wán', '类': 'lèi', '八': 'bā',
    '离': 'lí', '华': 'huá', '名': 'míng', '确': 'què', '才': 'cái', '科': 'kē',
    '张': 'zhāng', '信': 'xìn', '马': 'mǎ', '节': 'jié', '话': 'huà', '米': 'mǐ',
    '整': 'zhěng', '空': 'kōng', '元': 'yuán', '况': 'kuàng', '今': 'jīn', '集': 'jí',
    '温': 'wēn', '传': 'chuán', '土': 'tǔ', '许': 'xǔ', '步': 'bù', '群': 'qún',
    '广': 'guǎng', '石': 'shí', '记': 'jì', '需': 'xū', '段': 'duàn', '研': 'yán',
    '界': 'jiè', '拉': 'lā', '林': 'lín', '律': 'lǜ', '叫': 'jiào', '且': 'qiě',
    '究': 'jiū', '观': 'guān', '越': 'yuè', '织': 'zhī', '装': 'zhuāng', '影': 'yǐng',
    '算': 'suàn', '低': 'dī', '持': 'chí', '音': 'yīn', '众': 'zhòng', '书': 'shū',
    '布': 'bù', '复': 'fù', '容': 'róng', '儿': 'ér', '须': 'xū', '际': 'jì',
    '商': 'shāng', '非': 'fēi', '验': 'yàn', '连': 'lián', '断': 'duàn', '深': 'shēn',
    '难': 'nán', '近': 'jìn', '矿': 'kuàng', '千': 'qiān', '周': 'zhōu', '委': 'wěi',
    '素': 'sù', '技': 'jì', '备': 'bèi', '半': 'bàn', '办': 'bàn', '青': 'qīng',
    '省': 'shěng', '列': 'liè', '习': 'xí', '响': 'xiǎng', '约': 'yuē', '支': 'zhī',
    '般': 'bān', '史': 'shǐ', '感': 'gǎn', '劳': 'láo', '便': 'biàn', '团': 'tuán',
    '往': 'wǎng', '酸': 'suān', '历': 'lì', '市': 'shì', '克': 'kè', '何': 'hé',
    '除': 'chú', '消': 'xiāo', '构': 'gòu', '府': 'fǔ', '称': 'chēng', '太': 'tài',
    '准': 'zhǔn', '精': 'jīng', '值': 'zhí', '号': 'hào', '率': 'lǜ', '族': 'zú',
    '维': 'wéi', '划': 'huà', '选': 'xuǎn', '标': 'biāo', '写': 'xiě', '存': 'cún',
    '候': 'hòu', '毛': 'máo', '亲': 'qīn', '快': 'kuài', '效': 'xiào', '斯': 'sī',
    '院': 'yuàn', '查': 'chá', '江': 'jiāng', '型': 'xíng', '眼': 'yǎn', '王': 'wáng',
    '按': 'àn', '格': 'gé', '养': 'yǎng', '易': 'yì', '置': 'zhì', '派': 'pài',
    '层': 'céng', '片': 'piàn', '始': 'shǐ', '却': 'què', '专': 'zhuān', '状': 'zhuàng',
    '育': 'yù', '厂': 'chǎng', '京': 'jīng', '识': 'shí', '适': 'shì', '属': 'shǔ',
    '圆': 'yuán', '包': 'bāo', '火': 'huǒ', '住': 'zhù', '调': 'diào', '满': 'mǎn',
    '县': 'xiàn', '局': 'jú', '照': 'zhào', '参': 'cān', '红': 'hóng', '细': 'xì',
    '引': 'yǐn', '听': 'tīng', '该': 'gāi', '铁': 'tiě', '价': 'jià', '严': 'yán',
    '龙': 'lóng', '飞': 'fēi'
  };

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
      if (!character) {
        console.error('更新练习数据失败: 字符为空');
        return null;
      }

      const data = loadPracticeData();
      if (!data) {
        console.error('更新练习数据失败: 无法加载练习数据');
        return null;
      }
      
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
      
      // 首先获取所有需要复习的汉字（根据艾宾浩斯记忆法计算的时间）
      const reviewCharacters = Object.entries(data)
        .filter(([_, value]) => {
          try {
            return new Date(value.nextReviewTime) <= now;
          } catch (error) {
            console.error('解析复习时间失败:', error);
            return false;
          }
        })
        .map(([key, value]) => ({
          character: key,
          round: value.round || 0,
          accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0
        }));
      
      // 如果有需要复习的汉字，优先返回这些汉字
      if (reviewCharacters.length > 0) {
        // 按照正确率从低到高排序，优先练习正确率低的汉字
        reviewCharacters.sort((a, b) => a.accuracy - b.accuracy);
        return reviewCharacters.slice(0, 10); // 最多返回10个汉字
      }
      
      // 如果没有需要复习的汉字，从字库中找出未学习的汉字
      const learnedCharacters = new Set(Object.keys(data));
      const unlearnedCharacters = COMMON_CHARACTERS.split('')
        .filter(char => !learnedCharacters.has(char));
      
      if (unlearnedCharacters.length > 0) {
        // 随机选择10个未学习的汉字
        const selectedCharacters = [];
        const maxChars = Math.min(10, unlearnedCharacters.length);
        
        for (let i = 0; i < maxChars; i++) {
          const randomIndex = Math.floor(Math.random() * unlearnedCharacters.length);
          const char = unlearnedCharacters[randomIndex];
          selectedCharacters.push({
            character: char,
            round: 0,
            accuracy: 0
          });
          unlearnedCharacters.splice(randomIndex, 1);
        }
        return selectedCharacters;
      }
      
      // 如果所有汉字都学习过了，随机返回10个已学习的汉字
      const allCharacters = Object.keys(data);
      if (allCharacters.length === 0) {
        // 如果没有学习记录，返回一些基础汉字
        return COMMON_CHARACTERS.split('').slice(0, 10).map(char => ({
          character: char,
          round: 0,
          accuracy: 0
        }));
      }
      
      const randomCharacters = [];
      const maxChars = Math.min(10, allCharacters.length);
      
      for (let i = 0; i < maxChars; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        const char = allCharacters[randomIndex];
        randomCharacters.push({
          character: char,
          round: data[char].round || 0,
          accuracy: data[char].totalTests > 0 ? Math.round((data[char].correctCount / data[char].totalTests) * 100) : 0
        });
        allCharacters.splice(randomIndex, 1);
      }
      
      return randomCharacters;
    } catch (error) {
      console.error('获取练习汉字失败:', error);
      // 发生错误时返回一些基础汉字
      return COMMON_CHARACTERS.split('').slice(0, 10).map(char => ({
        character: char,
        round: 0,
        accuracy: 0
      }));
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
      if (!characters || characters.length === 0) {
        container.innerHTML = `
          <h2>语文乐园</h2>
          <p>加载失败，请刷新页面重试。</p>
          <button class="return-btn" onclick="window.showModule('')">返回首页</button>
        `;
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
        <div class="character-display">
          <div class="character">${currentCharacter.character}</div>
          <div class="pinyin">${getPinyin(currentCharacter.character)}</div>
        </div>
        <div class="options">
          <button class="learn-btn" onclick="window.handleChineseAnswer(true)">认识</button>
          <button class="forget-btn" onclick="window.handleChineseAnswer(false)">不认识</button>
        </div>
        <div class="feedback"></div>
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
          background: #45a049;
          transform: translateY(-2px);
        }
        .forget-btn {
          background: #f44336;
          color: white;
        }
        .forget-btn:hover {
          background: #d32f2f;
          transform: translateY(-2px);
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
        .history-section {
          margin-top: 30px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 10px;
        }
        .history-list {
          margin-top: 10px;
          max-height: 300px;
          overflow-y: auto;
          position: relative;
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
        .rest-message {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: #e3f2fd;
          border-radius: 10px;
        }
        .rest-message p {
          margin: 10px 0;
          font-size: 18px;
        }
        .countdown {
          text-align: center;
          margin: 1em 0;
          color: #4caf50;
          font-size: 1.2em;
          font-weight: bold;
        }
        /* 自定义滚动条样式 */
        .history-list::-webkit-scrollbar {
          width: 8px;
        }
        .history-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .history-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .history-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;
      document.head.appendChild(style);

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
                    <th class="sortable" data-sort="character" title="点击按汉字排序">汉字 ↕</th>
                    <th class="sortable" data-sort="totalTests" title="点击按练习次数排序">练习次数 ↕</th>
                    <th class="sortable" data-sort="accuracy" title="点击按正确率排序">正确率 ↕</th>
                    <th class="sortable" data-sort="lastTestTime" title="点击按上次练习时间排序">上次练习 ↕</th>
                    <th class="sortable" data-sort="nextReviewTime" title="点击按下次复习时间排序">下次复习 ↕</th>
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

            // 添加表头排序事件监听
            const headers = historyList.querySelectorAll('th.sortable');
            headers.forEach(header => {
              header.addEventListener('click', () => {
                const field = header.dataset.sort;
                const currentDirection = header.classList.contains('ascending') ? 'desc' : 'asc';
                
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

  window.handleChineseAnswer = function(isCorrect) {
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
    }
  };

  // 添加全局清理函数
  window.addEventListener('beforeunload', () => {
    if (window.cleanupChinese) {
      window.cleanupChinese();
    }
  });
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