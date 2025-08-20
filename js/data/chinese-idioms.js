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
  },
  {
    idiom: "千军万马",
    pinyin: "qiān jūn wàn mǎ",
    meaning: "形容兵马众多或声势浩大。",
    example: "改革开放的浪潮如千军万马，势不可挡。"
  },
  {
    idiom: "万紫千红",
    pinyin: "wàn zǐ qiān hóng",
    meaning: "形容百花齐放，色彩绚丽。也比喻事物丰富多彩。",
    example: "春天来了，公园里万紫千红，美不胜收。"
  },
  {
    idiom: "千方百计",
    pinyin: "qiān fāng bǎi jì",
    meaning: "想尽或用尽一切办法。",
    example: "老师千方百计地帮助学生提高学习成绩。"
  },
  {
    idiom: "千钧一发",
    pinyin: "qiān jūn yī fà",
    meaning: "比喻情况万分危急。",
    example: "在这千钧一发的时刻，他挺身而出救了那个孩子。"
  },
  {
    idiom: "万无一失",
    pinyin: "wàn wú yī shī",
    meaning: "非常有把握，绝对不会出差错。",
    example: "这次考试我准备得很充分，万无一失。"
  },
  {
    idiom: "一举两得",
    pinyin: "yī jǔ liǎng dé",
    meaning: "做一件事得到两方面的好处。",
    example: "骑自行车上班既环保又锻炼身体，一举两得。"
  },
  {
    idiom: "三长两短",
    pinyin: "sān cháng liǎng duǎn",
    meaning: "指意外的灾祸或事故。",
    example: "他一个人去那么危险的地方，万一有个三长两短怎么办？"
  },
  {
    idiom: "四分五裂",
    pinyin: "sì fēn wǔ liè",
    meaning: "形容分散，不完整。",
    example: "这个团队现在已经四分五裂，无法继续合作了。"
  },
  {
    idiom: "六神无主",
    pinyin: "liù shén wú zhǔ",
    meaning: "形容惊慌着急，没了主意，不知如何才好。",
    example: "听到这个消息，他顿时六神无主，不知所措。"
  },
  {
    idiom: "七嘴八舌",
    pinyin: "qī zuǐ bā shé",
    meaning: "形容人多嘴杂，其说不一。",
    example: "大家七嘴八舌地讨论着这个计划的可行性。"
  },
  {
    idiom: "八面玲珑",
    pinyin: "bā miàn líng lóng",
    meaning: "形容人处世圆滑，待人接物面面俱到。",
    example: "他在商界多年，早已练就了八面玲珑的本事。"
  },
  {
    idiom: "九死一生",
    pinyin: "jiǔ sǐ yī shēng",
    meaning: "形容经历极大危险而幸存。",
    example: "这位老战士经历过战争的残酷，九死一生才活到今天。"
  },
  {
    idiom: "百折不挠",
    pinyin: "bǎi zhé bù náo",
    meaning: "意志坚强，无论受到多少次挫折都不退缩。",
    example: "他百折不挠的精神终于使他获得了成功。"
  },
  {
    idiom: "千锤百炼",
    pinyin: "qiān chuí bǎi liàn",
    meaning: "比喻经历多次艰苦斗争的锻炼和考验。",
    example: "这篇文章经过千锤百炼，终于成为传世佳作。"
  },
  {
    idiom: "万古长青",
    pinyin: "wàn gǔ cháng qīng",
    meaning: "比喻崇高的精神或深厚的友谊永远不会消失。",
    example: "革命先烈的精神万古长青，永远激励着我们。"
  },
  {
    idiom: "日新月异",
    pinyin: "rì xīn yuè yì",
    meaning: "每天都在更新，每月都有变化。指发展或进步迅速。",
    example: "科技发展日新月异，给我们的生活带来了巨大变化。"
  },
  {
    idiom: "蒸蒸日上",
    pinyin: "zhēng zhēng rì shàng",
    meaning: "形容事业一天天向上发展。",
    example: "在大家的努力下，公司业绩蒸蒸日上。"
  },
  {
    idiom: "欣欣向荣",
    pinyin: "xīn xīn xiàng róng",
    meaning: "形容草木长得茂盛。比喻事业蓬勃发展。",
    example: "春天来了，花园里百花盛开，欣欣向荣。"
  },
  {
    idiom: "步步高升",
    pinyin: "bù bù gāo shēng",
    meaning: "形容职位不断上升。",
    example: "祝愿你在新的一年里工作顺利，步步高升。"
  },
  {
    idiom: "前程似锦",
    pinyin: "qián chéng sì jǐn",
    meaning: "形容前途十分美好。",
    example: "年轻人只要努力，前程似锦。"
  },
  {
    idiom: "鹏程万里",
    pinyin: "péng chéng wàn lǐ",
    meaning: "比喻前程远大。",
    example: "祝你学业有成，鹏程万里。"
  },
  {
    idiom: "锦上添花",
    pinyin: "jǐn shàng tiān huā",
    meaning: "在锦上再绣花。比喻好上加好，美上添美。",
    example: "这个好消息真是锦上添花，让我们更加高兴。"
  },
  {
    idiom: "雪中送炭",
    pinyin: "xuě zhōng sòng tàn",
    meaning: "在下雪天给人送炭取暖。比喻在别人急需时给以物质上或精神上的帮助。",
    example: "在我最困难的时候，朋友的雪中送炭让我终生难忘。"
  },
  {
    idiom: "画蛇添足",
    pinyin: "huà shé tiān zú",
    meaning: "画蛇时给蛇添上脚。比喻做了多余的事，非但无益，反而不合适。",
    example: "这篇文章已经很完美了，你再修改就是画蛇添足。"
  },
  {
    idiom: "守株待兔",
    pinyin: "shǒu zhū dài tù",
    meaning: "比喻希望不经过努力而得到成功的侥幸心理。",
    example: "我们不能守株待兔，要主动去寻找机会。"
  },
  {
    idiom: "掩耳盗铃",
    pinyin: "yǎn ěr dào líng",
    meaning: "比喻自己欺骗自己。",
    example: "他以为别人不知道他的秘密，这简直是掩耳盗铃。"
  },
  {
    idiom: "井底之蛙",
    pinyin: "jǐng dǐ zhī wā",
    meaning: "比喻见识狭窄的人。",
    example: "我们不能做井底之蛙，要多出去看看外面的世界。"
  },
  {
    idiom: "狐假虎威",
    pinyin: "hú jiǎ hǔ wēi",
    meaning: "比喻依仗别人的威势来欺压人。",
    example: "他只是个小职员，却狐假虎威地欺负新人。"
  },
  {
    idiom: "亡羊补牢",
    pinyin: "wáng yáng bǔ láo",
    meaning: "出了问题以后想办法补救，可以防止继续受损失。",
    example: "虽然这次考试没考好，但亡羊补牢为时未晚，下次努力就行。"
  },
  {
    idiom: "对牛弹琴",
    pinyin: "duì niú tán qín",
    meaning: "比喻对不懂道理的人讲道理，或对外行人说内行话。",
    example: "跟他谈艺术简直是对牛弹琴，他完全不懂。"
  },
  {
    idiom: "杯弓蛇影",
    pinyin: "bēi gōng shé yǐng",
    meaning: "比喻因疑神疑鬼而引起恐惧。",
    example: "他最近总是杯弓蛇影，疑神疑鬼的。"
  },
  {
    idiom: "草木皆兵",
    pinyin: "cǎo mù jiē bīng",
    meaning: "把山上的草木都当做敌兵。形容人在惊慌时疑神疑鬼。",
    example: "他做了亏心事，现在草木皆兵，连风声都害怕。"
  },
  {
    idiom: "胸有成竹",
    pinyin: "xiōng yǒu chéng zhú",
    meaning: "比喻在做事之前已经有通盘的考虑和把握。",
    example: "看他胸有成竹的样子，这次比赛一定能赢。"
  },
  {
    idiom: "水滴石穿",
    pinyin: "shuǐ dī shí chuān",
    meaning: "比喻只要有恒心，不断努力，事情就一定能成功。",
    example: "学习贵在坚持，水滴石穿，总有一天会成功。"
  },
  {
    idiom: "铁杵成针",
    pinyin: "tiě chǔ chéng zhēn",
    meaning: "比喻只要有毅力，肯下苦功，事情就能成功。",
    example: "只要功夫深，铁杵成针，没有办不到的事。"
  },
  {
    idiom: "愚公移山",
    pinyin: "yú gōng yí shān",
    meaning: "比喻坚持不懈地改造自然和坚定不移地进行斗争。",
    example: "我们要学习愚公移山的精神，坚持不懈地追求梦想。"
  },
  {
    idiom: "精卫填海",
    pinyin: "jīng wèi tián hǎi",
    meaning: "比喻意志坚决，不畏艰难。",
    example: "他这种精卫填海的精神值得我们学习。"
  },
  {
    idiom: "女娲补天",
    pinyin: "nǚ wā bǔ tiān",
    meaning: "比喻改造天地的雄伟气魄和大无畏的斗争精神。",
    example: "面对困难，我们要有女娲补天的勇气和决心。"
  },
  {
    idiom: "盘古开天",
    pinyin: "pán gǔ kāi tiān",
    meaning: "比喻人类开始有了历史。",
    example: "从盘古开天到现在，人类文明已经发展了几千年。"
  },
  {
    idiom: "夸父追日",
    pinyin: "kuā fù zhuī rì",
    meaning: "比喻人有大志，也比喻不自量力。",
    example: "他的梦想虽然像夸父追日一样困难，但他依然坚持。"
  },
  {
    idiom: "叶公好龙",
    pinyin: "yè gōng hào lóng",
    meaning: "比喻口头上爱好某事物，实际上并不真爱好。",
    example: "他口口声声说喜欢读书，其实只是叶公好龙，书架上的书都没翻过。"
  },
  {
    idiom: "滥竽充数",
    pinyin: "làn yú chōng shù",
    meaning: "比喻无本领的冒充有本领，次货冒充好货。",
    example: "这个乐团里有些人滥竽充数，影响了整体演奏水平。"
  },
  {
    idiom: "买椟还珠",
    pinyin: "mǎi dú huán zhū",
    meaning: "比喻没有眼光，取舍不当。",
    example: "他只看包装不看内容，真是买椟还珠。"
  },
  {
    idiom: "塞翁失马",
    pinyin: "sài wēng shī mǎ",
    meaning: "比喻虽然暂时遭受损失，却可能因此得到好处，坏事也可能变成好事。",
    example: "这次考试没考好，但塞翁失马，让我发现了学习中的问题。"
  },
  {
    idiom: "杞人忧天",
    pinyin: "qǐ rén yōu tiān",
    meaning: "比喻不必要的忧虑。",
    example: "别总是杞人忧天，事情没有你想象的那么糟糕。"
  },
  {
    idiom: "夜郎自大",
    pinyin: "yè láng zì dà",
    meaning: "比喻人无知而又狂妄自大。",
    example: "他刚取得一点成绩就夜郎自大，看不起别人。"
  },
  {
    idiom: "邯郸学步",
    pinyin: "hán dān xué bù",
    meaning: "比喻模仿人不到家，反把原来自己会的东西忘了。",
    example: "学习他人要取其精华，不能邯郸学步，连自己的特点都丢了。"
  },
  {
    idiom: "东施效颦",
    pinyin: "dōng shī xiào pín",
    meaning: "比喻胡乱模仿，效果极坏。",
    example: "她盲目模仿明星穿衣，结果东施效颦，反而更难看。"
  },
  {
    idiom: "班门弄斧",
    pinyin: "bān mén nòng fǔ",
    meaning: "在鲁班门前舞弄斧子。比喻在行家面前卖弄本领，不自量力。",
    example: "在专家面前班门弄斧，只会暴露自己的无知。"
  },
  {
    idiom: "毛遂自荐",
    pinyin: "máo suì zì jiàn",
    meaning: "比喻自告奋勇，自己推荐自己担任某项工作。",
    example: "他毛遂自荐担任班长，得到了同学们的支持。"
  },
  {
    idiom: "纸上谈兵",
    pinyin: "zhǐ shàng tán bīng",
    meaning: "比喻空谈理论，不能解决实际问题。",
    example: "只会纸上谈兵是不够的，还需要实践经验。"
  },
  {
    idiom: "望梅止渴",
    pinyin: "wàng méi zhǐ kě",
    meaning: "比喻愿望无法实现，用空想安慰自己。",
    example: "光靠望梅止渴解决不了实际问题，要采取实际行动。"
  },
  {
    idiom: "指鹿为马",
    pinyin: "zhǐ lù wéi mǎ",
    meaning: "比喻故意颠倒黑白，混淆是非。",
    example: "他这样指鹿为马，歪曲事实，实在令人气愤。"
  },
  {
    idiom: "按图索骥",
    pinyin: "àn tú suǒ jì",
    meaning: "比喻办事机械死板，也比喻按照线索去寻找事物。",
    example: "做事不能太死板，不能总是按图索骥，要学会变通。"
  },
  {
    idiom: "唇亡齿寒",
    pinyin: "chún wáng chǐ hán",
    meaning: "比喻利害关系密切。",
    example: "我们是一个团队，要互相帮助，唇亡齿寒的道理大家都懂。"
  },
  {
    idiom: "鹤立鸡群",
    pinyin: "hè lì jī qún",
    meaning: "比喻一个人的才能或仪表在一群人里头显得很突出。",
    example: "她在舞蹈队里鹤立鸡群，技艺远超其他人。"
  },
  {
    idiom: "鱼目混珠",
    pinyin: "yú mù hùn zhū",
    meaning: "比喻用假的冒充真的。",
    example: "市场上有些商品鱼目混珠，消费者要仔细辨别。"
  },
  {
    idiom: "虎头蛇尾",
    pinyin: "hǔ tóu shé wěi",
    meaning: "比喻开始时声势很大，到后来劲头很小，有始无终。",
    example: "他做事总是虎头蛇尾，开始时很积极，后来就懈怠了。"
  },
  {
    idiom: "狗尾续貂",
    pinyin: "gǒu wěi xù diāo",
    meaning: "比喻拿不好的东西补接在好的东西后面，前后两部分非常不相称。",
    example: "这部小说前半部分精彩，后半部分却狗尾续貂，令人失望。"
  },
  {
    idiom: "凤毛麟角",
    pinyin: "fèng máo lín jiǎo",
    meaning: "比喻珍贵而稀少的人或物。",
    example: "像他这样的人才真是凤毛麟角，不可多得。"
  },
  {
    idiom: "惊弓之鸟",
    pinyin: "jīng gōng zhī niǎo",
    meaning: "比喻受过惊吓的人遇到一点动静就害怕。",
    example: "他经历过那次事故后，变得像惊弓之鸟，稍有响动就紧张。"
  },
  {
    idiom: "如鱼得水",
    pinyin: "rú yú dé shuǐ",
    meaning: "比喻得到跟自己非常投合的人或对自己很合适的环境。",
    example: "他调到新部门后如鱼得水，工作起来得心应手。"
  },
  {
    idiom: "画龙点睛",
    pinyin: "huà lóng diǎn jīng",
    meaning: "比喻写文章或讲话时，在关键处用几句话点明实质，使内容生动有力。",
    example: "这篇文章最后一句画龙点睛，道出了全文的主题。"
  }
];

// 导出数据
window.COMMON_IDIOMS = COMMON_IDIOMS;