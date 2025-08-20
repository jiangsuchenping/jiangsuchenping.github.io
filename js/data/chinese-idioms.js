/**
 * 成语数据文件
 * 提供语文乐园模块使用的成语数据
 */

// 常用成语库
const COMMON_IDIOMS = [
  {
    idiom: "一心一意",
    pinyin: "yī xīn yī yì",
    meaning: "心思、意念专一。",
    example: "他一心一意地学习，从不三心二意。"
  },
  {
    idiom: "一帆风顺",
    pinyin: "yī fān fēng shùn",
    meaning: "比喻非常顺利，没有任何阻碍。",
    example: "祝你一帆风顺，前程似锦。"
  },
  {
    idiom: "一马当先",
    pinyin: "yī mǎ dāng xiān",
    meaning: "原指作战时策马冲锋在前，形容领先或带头。",
    example: "在比赛中，他一马当先，冲在最前面。"
  },
  {
    idiom: "一鸣惊人",
    pinyin: "yī míng jīng rén",
    meaning: "比喻平时没有突出的表现，一下子做出惊人的成绩。",
    example: "他在这次比赛中一鸣惊人，获得了冠军。"
  },
  {
    idiom: "一言为定",
    pinyin: "yī yán wéi dìng",
    meaning: "一句话说定了，不再更改。比喻说话算数，决不反悔。",
    example: "我们一言为定，明天早上八点在这里见面。"
  },
  {
    idiom: "一心二用",
    pinyin: "yī xīn èr yòng",
    meaning: "同时做两件事，注意力分散。",
    example: "他一边听音乐一边做作业，一心二用。"
  },
  {
    idiom: "一石二鸟",
    pinyin: "yī shí èr niǎo",
    meaning: "比喻做一件事情达到两个目的。",
    example: "这个计划真是一石二鸟，既省钱又省时间。"
  },
  {
    idiom: "一箭双雕",
    pinyin: "yī jiàn shuāng diāo",
    meaning: "原指射箭技术高超，一箭射中两只雕。后比喻做一件事达到两个目的。",
    example: "这个方案真是一箭双雕，既提高了效率又降低了成本。"
  },
  {
    idiom: "一帆风顺",
    pinyin: "yī fān fēng shùn",
    meaning: "比喻非常顺利，没有任何阻碍。",
    example: "祝你一帆风顺，前程似锦。"
  },
  {
    idiom: "一马平川",
    pinyin: "yī mǎ píng chuān",
    meaning: "能够纵马疾驰的平地。比喻广阔的平原。",
    example: "这里是一马平川的大草原。"
  },
  {
    idiom: "爱不释手",
    pinyin: "ài bù shì shǒu",
    meaning: "喜欢得舍不得放手。",
    example: "这本书写得太好了，他爱不释手。"
  },
  {
    idiom: "百发百中",
    pinyin: "bǎi fā bǎi zhòng",
    meaning: "形容射箭或射击精准，也比喻做事有把握。",
    example: "他是神枪手，百发百中。"
  },
  {
    idiom: "半途而废",
    pinyin: "bàn tú ér fèi",
    meaning: "做事中途放弃，不能坚持到底。",
    example: "学习不能半途而废，要持之以恒。"
  },
  {
    idiom: "精益求精",
    pinyin: "jīng yì qiú jīng",
    meaning: "已经很好还追求更好。",
    example: "他对自己的作品总是精益求精。"
  },
  {
    idiom: "各司其职",
    pinyin: "gè sī qí zhí",
    meaning: "各自负责自己的职责。",
    example: "在一个团队中，每个人都应该各司其职。"
  },
  {
    idiom: "推心置腹",
    pinyin: "tuī xīn zhì fù",
    meaning: "真心待人。",
    example: "他们两人推心置腹地交谈了很久。"
  },
  {
    idiom: "肝胆相照",
    pinyin: "gān dǎn xiāng zhào",
    meaning: "比喻以真心相见。",
    example: "他们是肝胆相照的好朋友。"
  },
  {
    idiom: "言而有信",
    pinyin: "yán ér yǒu xìn",
    meaning: "说话讲信用。",
    example: "他言而有信，说到做到。"
  },
  {
    idiom: "和蔼可亲",
    pinyin: "hé ǎi kě qīn",
    meaning: "态度温和容易接近。",
    example: "这位老师和蔼可亲，深受学生喜爱。"
  },
  {
    idiom: "雪中送炭",
    pinyin: "xuě zhōng sòng tàn",
    meaning: "在别人困难时给予帮助。",
    example: "在他最困难的时候，朋友的雪中送炭让他感动不已。"
  },
  {
    idiom: "心花怒放",
    pinyin: "xīn huā nù fàng",
    meaning: "形容非常高兴。",
    example: "听到这个好消息，他心花怒放。"
  },
  {
    idiom: "怒发冲冠",
    pinyin: "nù fà chōng guān",
    meaning: "愤怒到头发竖起顶起帽子。",
    example: "他听到这个消息后怒发冲冠。"
  },
  {
    idiom: "忧心忡忡",
    pinyin: "yōu xīn chōng chōng",
    meaning: "形容心事重重。",
    example: "他最近忧心忡忡，不知道在担心什么。"
  },
  {
    idiom: "泰然自若",
    pinyin: "tài rán zì ruò",
    meaning: "镇定不慌乱。",
    example: "面对突发情况，他泰然自若。"
  },
  {
    idiom: "喜出望外",
    pinyin: "xǐ chū wàng wài",
    meaning: "遇到意外喜事特别高兴。",
    example: "他收到了录取通知书，喜出望外。"
  },
  {
    idiom: "风和日丽",
    pinyin: "fēng hé rì lì",
    meaning: "天气晴朗暖和。",
    example: "今天风和日丽，适合外出游玩。"
  },
  {
    idiom: "电闪雷鸣",
    pinyin: "diàn shǎn léi míng",
    meaning: "雷电交加的天气。",
    example: "突然电闪雷鸣，下起了大雨。"
  },
  {
    idiom: "鸟语花香",
    pinyin: "niǎo yǔ huā xiāng",
    meaning: "形容春天美好景象。",
    example: "春天来了，鸟语花香，万物复苏。"
  },
  {
    idiom: "山清水秀",
    pinyin: "shān qīng shuǐ xiù",
    meaning: "山水风景优美。",
    example: "这里山清水秀，是旅游的好地方。"
  },
  {
    idiom: "十全十美",
    pinyin: "shí quán shí měi",
    meaning: "形容十分完美，没有缺陷。",
    example: "这幅画堪称十全十美。"
  },
  {
    idiom: "七上八下",
    pinyin: "qī shàng bā xià",
    meaning: "形容心中慌乱、不安。",
    example: "考试成绩还没出来，他心里七上八下。"
  },
  {
    idiom: "三心二意",
    pinyin: "sān xīn èr yì",
    meaning: "心里想这样又想那样。形容犹豫不决或意志不坚定。",
    example: "学习不能三心二意，要专心致志。"
  },
  {
    idiom: "九牛一毛",
    pinyin: "jiǔ niú yī máo",
    meaning: "许多头牛身上的一根毛。形容极大数量中的微不足道的数量。",
    example: "这点捐款对整个项目来说只是九牛一毛。"
  },
  {
    idiom: "七零八落",
    pinyin: "qī líng bā luò",
    meaning: "散乱，不整齐的样子。",
    example: "经过一场暴风雨，院子里的东西七零八落。"
  },
  {
    idiom: "五花八门",
    pinyin: "wǔ huā bā mén",
    meaning: "变幻多端或比喻花样繁多。",
    example: "市场上的商品五花八门。"
  },
  {
    idiom: "五光十色",
    pinyin: "wǔ guāng shí sè",
    meaning: "形容色泽艳丽，花样繁多。",
    example: "节日的烟花五光十色，非常美丽。"
  },
  {
    idiom: "四面八方",
    pinyin: "sì miàn bā fāng",
    meaning: "指各个地方或各个方面。",
    example: "来自四面八方的朋友欢聚一堂。"
  }
];

// 导出数据
window.COMMON_IDIOMS = COMMON_IDIOMS;