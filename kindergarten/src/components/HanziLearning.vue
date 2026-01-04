<script setup>
import { ref, onMounted, computed, watch, nextTick, shallowRef } from 'vue'

/**
 * 汉字字库 - 扩充版
 * 总共200个汉字，分为10个等级，每级20个汉字
 */
const hanziBank = [
  // Level 1: Numbers & Basic strokes (20个)
  { char: '一', pinyin: 'yī', meaning: '一 (One)', level: 1 },
  { char: '二', pinyin: 'èr', meaning: '二 (Two)', level: 1 },
  { char: '三', pinyin: 'sān', meaning: '三 (Three)', level: 1 },
  { char: '十', pinyin: 'shí', meaning: '十 (Ten)', level: 1 },
  { char: '八', pinyin: 'bā', meaning: '八 (Eight)', level: 1 },
  { char: '六', pinyin: 'liù', meaning: '六 (Six)', level: 1 },
  { char: '七', pinyin: 'qī', meaning: '七 (Seven)', level: 1 },
  { char: '九', pinyin: 'jiǔ', meaning: '九 (Nine)', level: 1 },
  { char: '五', pinyin: 'wǔ', meaning: '五 (Five)', level: 1 },
  { char: '四', pinyin: 'sì', meaning: '四 (Four)', level: 1 },
  { char: '零', pinyin: 'líng', meaning: '零 (Zero)', level: 1 },
  { char: '百', pinyin: 'bǎi', meaning: '百 (Hundred)', level: 1 },
  { char: '千', pinyin: 'qiān', meaning: '千 (Thousand)', level: 1 },
  { char: '万', pinyin: 'wàn', meaning: '万 (Ten thousand)', level: 1 },
  { char: '亿', pinyin: 'yì', meaning: '亿 (Hundred million)', level: 1 },
  { char: '个', pinyin: 'gè', meaning: '个 (Classifier)', level: 1 },
  { char: '了', pinyin: 'le', meaning: '了 (Particle)', level: 1 },
  { char: '是', pinyin: 'shì', meaning: '是 (To be)', level: 1 },
  { char: '的', pinyin: 'de', meaning: '的 (Particle)', level: 1 },
  { char: '不', pinyin: 'bù', meaning: '不 (Not)', level: 1 },
  
  // Level 2: Body & Basic Nature (20个)
  { char: '人', pinyin: 'rén', meaning: '人 (Person)', level: 2 },
  { char: '口', pinyin: 'kǒu', meaning: '口 (Mouth)', level: 2 },
  { char: '手', pinyin: 'shǒu', meaning: '手 (Hand)', level: 2 },
  { char: '足', pinyin: 'zú', meaning: '足 (Foot)', level: 2 },
  { char: '目', pinyin: 'mù', meaning: '目 (Eye)', level: 2 },
  { char: '耳', pinyin: 'ěr', meaning: '耳 (Ear)', level: 2 },
  { char: '山', pinyin: 'shān', meaning: '山 (Mountain)', level: 2 },
  { char: '水', pinyin: 'shuǐ', meaning: '水 (Water)', level: 2 },
  { char: '日', pinyin: 'rì', meaning: '日 (Sun)', level: 2 },
  { char: '月', pinyin: 'yuè', meaning: '月 (Moon)', level: 2 },
  { char: '木', pinyin: 'mù', meaning: '木 (Wood)', level: 2 },
  { char: '禾', pinyin: 'hé', meaning: '禾 (Grain)', level: 2 },
  { char: '心', pinyin: 'xīn', meaning: '心 (Heart)', level: 2 },
  { char: '头', pinyin: 'tóu', meaning: '头 (Head)', level: 2 },
  { char: '身', pinyin: 'shēn', meaning: '身 (Body)', level: 2 },
  { char: '石', pinyin: 'shí', meaning: '石 (Stone)', level: 2 },
  { char: '田', pinyin: 'tián', meaning: '田 (Field)', level: 2 },
  { char: '雨', pinyin: 'yǔ', meaning: '雨 (Rain)', level: 2 },
  { char: '雪', pinyin: 'xuě', meaning: '雪 (Snow)', level: 2 },
  { char: '冰', pinyin: 'bīng', meaning: '冰 (Ice)', level: 2 },

  // Level 3: Directions & Opposites (20个)
  { char: '大', pinyin: 'dà', meaning: '大 (Big)', level: 3 },
  { char: '小', pinyin: 'xiǎo', meaning: '小 (Small)', level: 3 },
  { char: '上', pinyin: 'shàng', meaning: '上 (Up)', level: 3 },
  { char: '下', pinyin: 'xià', meaning: '下 (Down)', level: 3 },
  { char: '左', pinyin: 'zuǒ', meaning: '左 (Left)', level: 3 },
  { char: '右', pinyin: 'yòu', meaning: '右 (Right)', level: 3 },
  { char: '天', pinyin: 'tiān', meaning: '天 (Sky)', level: 3 },
  { char: '地', pinyin: 'dì', meaning: '地 (Earth)', level: 3 },
  { char: '火', pinyin: 'huǒ', meaning: '火 (Fire)', level: 3 },
  { char: '土', pinyin: 'tǔ', meaning: '土 (Earth)', level: 3 },
  { char: '风', pinyin: 'fēng', meaning: '风 (Wind)', level: 3 },
  { char: '云', pinyin: 'yún', meaning: '云 (Cloud)', level: 3 },
  { char: '高', pinyin: 'gāo', meaning: '高 (High)', level: 3 },
  { char: '低', pinyin: 'dī', meaning: '低 (Low)', level: 3 },
  { char: '长', pinyin: 'cháng', meaning: '长 (Long)', level: 3 },
  { char: '短', pinyin: 'duǎn', meaning: '短 (Short)', level: 3 },
  { char: '多', pinyin: 'duō', meaning: '多 (Many)', level: 3 },
  { char: '少', pinyin: 'shǎo', meaning: '少 (Few)', level: 3 },
  { char: '前', pinyin: 'qián', meaning: '前 (Front)', level: 3 },
  { char: '后', pinyin: 'hòu', meaning: '后 (Back)', level: 3 },

  // Level 4: Actions & Animals (20个)
  { char: '鸟', pinyin: 'niǎo', meaning: '鸟 (Bird)', level: 4 },
  { char: '鱼', pinyin: 'yú', meaning: '鱼 (Fish)', level: 4 },
  { char: '马', pinyin: 'mǎ', meaning: '马 (Horse)', level: 4 },
  { char: '牛', pinyin: 'niú', meaning: '牛 (Cow)', level: 4 },
  { char: '羊', pinyin: 'yáng', meaning: '羊 (Sheep)', level: 4 },
  { char: '走', pinyin: 'zǒu', meaning: '走 (Walk)', level: 4 },
  { char: '坐', pinyin: 'zuò', meaning: '坐 (Sit)', level: 4 },
  { char: '立', pinyin: 'lì', meaning: '立 (Stand)', level: 4 },
  { char: '笑', pinyin: 'xiào', meaning: '笑 (Laugh)', level: 4 },
  { char: '哭', pinyin: 'kū', meaning: '哭 (Cry)', level: 4 },
  { char: '猫', pinyin: 'māo', meaning: '猫 (Cat)', level: 4 },
  { char: '狗', pinyin: 'gǒu', meaning: '狗 (Dog)', level: 4 },
  { char: '鸡', pinyin: 'jī', meaning: '鸡 (Chicken)', level: 4 },
  { char: '鸭', pinyin: 'yā', meaning: '鸭 (Duck)', level: 4 },
  { char: '鹅', pinyin: 'é', meaning: '鹅 (Goose)', level: 4 },
  { char: '猪', pinyin: 'zhū', meaning: '猪 (Pig)', level: 4 },
  { char: '跑', pinyin: 'pǎo', meaning: '跑 (Run)', level: 4 },
  { char: '跳', pinyin: 'tiào', meaning: '跳 (Jump)', level: 4 },
  { char: '飞', pinyin: 'fēi', meaning: '飞 (Fly)', level: 4 },
  { char: '游', pinyin: 'yóu', meaning: '游 (Swim)', level: 4 },

  // Level 5: Family & People (20个)
  { char: '父', pinyin: 'fù', meaning: '父 (Father)', level: 5 },
  { char: '母', pinyin: 'mǔ', meaning: '母 (Mother)', level: 5 },
  { char: '儿', pinyin: 'ér', meaning: '儿 (Son)', level: 5 },
  { char: '女', pinyin: 'nǚ', meaning: '女 (Daughter)', level: 5 },
  { char: '兄', pinyin: 'xiōng', meaning: '兄 (Brother)', level: 5 },
  { char: '姐', pinyin: 'jiě', meaning: '姐 (Sister)', level: 5 },
  { char: '师', pinyin: 'shī', meaning: '师 (Teacher)', level: 5 },
  { char: '友', pinyin: 'yǒu', meaning: '友 (Friend)', level: 5 },
  { char: '老', pinyin: 'lǎo', meaning: '老 (Old)', level: 5 },
  { char: '少', pinyin: 'shào', meaning: '少 (Young)', level: 5 },
  { char: '男', pinyin: 'nán', meaning: '男 (Male)', level: 5 },
  { char: '女', pinyin: 'nǚ', meaning: '女 (Female)', level: 5 },
  { char: '孩', pinyin: 'hái', meaning: '孩 (Child)', level: 5 },
  { char: '子', pinyin: 'zǐ', meaning: '子 (Child)', level: 5 },
  { char: '我', pinyin: 'wǒ', meaning: '我 (I/Me)', level: 5 },
  { char: '你', pinyin: 'nǐ', meaning: '你 (You)', level: 5 },
  { char: '他', pinyin: 'tā', meaning: '他 (He)', level: 5 },
  { char: '她', pinyin: 'tā', meaning: '她 (She)', level: 5 },
  { char: '它', pinyin: 'tā', meaning: '它 (It)', level: 5 },
  { char: '们', pinyin: 'men', meaning: '们 (Plural)', level: 5 },

  // Level 6: Colors & Shapes (20个)
  { char: '红', pinyin: 'hóng', meaning: '红 (Red)', level: 6 },
  { char: '黄', pinyin: 'huáng', meaning: '黄 (Yellow)', level: 6 },
  { char: '蓝', pinyin: 'lán', meaning: '蓝 (Blue)', level: 6 },
  { char: '绿', pinyin: 'lǜ', meaning: '绿 (Green)', level: 6 },
  { char: '白', pinyin: 'bái', meaning: '白 (White)', level: 6 },
  { char: '黑', pinyin: 'hēi', meaning: '黑 (Black)', level: 6 },
  { char: '圆', pinyin: 'yuán', meaning: '圆 (Round)', level: 6 },
  { char: '方', pinyin: 'fāng', meaning: '方 (Square)', level: 6 },
  { char: '长', pinyin: 'cháng', meaning: '长 (Long)', level: 6 },
  { char: '短', pinyin: 'duǎn', meaning: '短 (Short)', level: 6 },
  { char: '宽', pinyin: 'kuān', meaning: '宽 (Wide)', level: 6 },
  { char: '窄', pinyin: 'zhǎi', meaning: '窄 (Narrow)', level: 6 },
  { char: '厚', pinyin: 'hòu', meaning: '厚 (Thick)', level: 6 },
  { char: '薄', pinyin: 'báo', meaning: '薄 (Thin)', level: 6 },
  { char: '紫', pinyin: 'zǐ', meaning: '紫 (Purple)', level: 6 },
  { char: '橙', pinyin: 'chéng', meaning: '橙 (Orange)', level: 6 },
  { char: '粉', pinyin: 'fěn', meaning: '粉 (Pink)', level: 6 },
  { char: '灰', pinyin: 'huī', meaning: '灰 (Gray)', level: 6 },
  { char: '金', pinyin: 'jīn', meaning: '金 (Gold)', level: 6 },
  { char: '银', pinyin: 'yín', meaning: '银 (Silver)', level: 6 },

  // Level 7: Food & Fruits (20个)
  { char: '米', pinyin: 'mǐ', meaning: '米 (Rice)', level: 7 },
  { char: '面', pinyin: 'miàn', meaning: '面 (Noodles)', level: 7 },
  { char: '肉', pinyin: 'ròu', meaning: '肉 (Meat)', level: 7 },
  { char: '蛋', pinyin: 'dàn', meaning: '蛋 (Egg)', level: 7 },
  { char: '果', pinyin: 'guǒ', meaning: '果 (Fruit)', level: 7 },
  { char: '菜', pinyin: 'cài', meaning: '菜 (Vegetable)', level: 7 },
  { char: '饭', pinyin: 'fàn', meaning: '饭 (Rice meal)', level: 7 },
  { char: '汤', pinyin: 'tāng', meaning: '汤 (Soup)', level: 7 },
  { char: '茶', pinyin: 'chá', meaning: '茶 (Tea)', level: 7 },
  { char: '水', pinyin: 'shuǐ', meaning: '水 (Water)', level: 7 },
  { char: '酒', pinyin: 'jiǔ', meaning: '酒 (Wine)', level: 7 },
  { char: '糖', pinyin: 'táng', meaning: '糖 (Sugar)', level: 7 },
  { char: '盐', pinyin: 'yán', meaning: '盐 (Salt)', level: 7 },
  { char: '油', pinyin: 'yóu', meaning: '油 (Oil)', level: 7 },
  { char: '鱼', pinyin: 'yú', meaning: '鱼 (Fish)', level: 7 },
  { char: '虾', pinyin: 'xiā', meaning: '虾 (Shrimp)', level: 7 },
  { char: '蟹', pinyin: 'xiè', meaning: '蟹 (Crab)', level: 7 },
  { char: '瓜', pinyin: 'guā', meaning: '瓜 (Melon)', level: 7 },
  { char: '豆', pinyin: 'dòu', meaning: '豆 (Bean)', level: 7 },
  { char: '麦', pinyin: 'mài', meaning: '麦 (Wheat)', level: 7 },

  // Level 8: Time & Seasons (20个)
  { char: '年', pinyin: 'nián', meaning: '年 (Year)', level: 8 },
  { char: '月', pinyin: 'yuè', meaning: '月 (Month)', level: 8 },
  { char: '日', pinyin: 'rì', meaning: '日 (Day)', level: 8 },
  { char: '时', pinyin: 'shí', meaning: '时 (Time)', level: 8 },
  { char: '春', pinyin: 'chūn', meaning: '春 (Spring)', level: 8 },
  { char: '夏', pinyin: 'xià', meaning: '夏 (Summer)', level: 8 },
  { char: '秋', pinyin: 'qiū', meaning: '秋 (Autumn)', level: 8 },
  { char: '冬', pinyin: 'dōng', meaning: '冬 (Winter)', level: 8 },
  { char: '早', pinyin: 'zǎo', meaning: '早 (Early)', level: 8 },
  { char: '晚', pinyin: 'wǎn', meaning: '晚 (Late)', level: 8 },
  { char: '今', pinyin: 'jīn', meaning: '今 (Today)', level: 8 },
  { char: '明', pinyin: 'míng', meaning: '明 (Tomorrow)', level: 8 },
  { char: '昨', pinyin: 'zuó', meaning: '昨 (Yesterday)', level: 8 },
  { char: '晨', pinyin: 'chén', meaning: '晨 (Morning)', level: 8 },
  { char: '午', pinyin: 'wǔ', meaning: '午 (Noon)', level: 8 },
  { char: '夜', pinyin: 'yè', meaning: '夜 (Night)', level: 8 },
  { char: '周', pinyin: 'zhōu', meaning: '周 (Week)', level: 8 },
  { char: '秒', pinyin: 'miǎo', meaning: '秒 (Second)', level: 8 },
  { char: '分', pinyin: 'fēn', meaning: '分 (Minute)', level: 8 },
  { char: '刻', pinyin: 'kè', meaning: '刻 (Quarter)', level: 8 },

  // Level 9: Transportation & Tools (20个)
  { char: '车', pinyin: 'chē', meaning: '车 (Car)', level: 9 },
  { char: '船', pinyin: 'chuán', meaning: '船 (Boat)', level: 9 },
  { char: '书', pinyin: 'shū', meaning: '书 (Book)', level: 9 },
  { char: '笔', pinyin: 'bǐ', meaning: '笔 (Pen)', level: 9 },
  { char: '桌', pinyin: 'zhuō', meaning: '桌 (Desk)', level: 9 },
  { char: '椅', pinyin: 'yǐ', meaning: '椅 (Chair)', level: 9 },
  { char: '门', pinyin: 'mén', meaning: '门 (Door)', level: 9 },
  { char: '窗', pinyin: 'chuāng', meaning: '窗 (Window)', level: 9 },
  { char: '房', pinyin: 'fáng', meaning: '房 (Room)', level: 9 },
  { char: '屋', pinyin: 'wū', meaning: '屋 (House)', level: 9 },
  { char: '桥', pinyin: 'qiáo', meaning: '桥 (Bridge)', level: 9 },
  { char: '路', pinyin: 'lù', meaning: '路 (Road)', level: 9 },
  { char: '街', pinyin: 'jiē', meaning: '街 (Street)', level: 9 },
  { char: '城', pinyin: 'chéng', meaning: '城 (City)', level: 9 },
  { char: '村', pinyin: 'cūn', meaning: '村 (Village)', level: 9 },
  { char: '机', pinyin: 'jī', meaning: '机 (Machine)', level: 9 },
  { char: '灯', pinyin: 'dēng', meaning: '灯 (Light)', level: 9 },
  { char: '钟', pinyin: 'zhōng', meaning: '钟 (Clock)', level: 9 },
  { char: '表', pinyin: 'biǎo', meaning: '表 (Watch)', level: 9 },
  { char: '镜', pinyin: 'jìng', meaning: '镜 (Mirror)', level: 9 },

  // Level 10: Common Verbs (20个)
  { char: '来', pinyin: 'lái', meaning: '来 (Come)', level: 10 },
  { char: '去', pinyin: 'qù', meaning: '去 (Go)', level: 10 },
  { char: '看', pinyin: 'kàn', meaning: '看 (Look)', level: 10 },
  { char: '听', pinyin: 'tīng', meaning: '听 (Listen)', level: 10 },
  { char: '说', pinyin: 'shuō', meaning: '说 (Speak)', level: 10 },
  { char: '读', pinyin: 'dú', meaning: '读 (Read)', level: 10 },
  { char: '写', pinyin: 'xiě', meaning: '写 (Write)', level: 10 },
  { char: '吃', pinyin: 'chī', meaning: '吃 (Eat)', level: 10 },
  { char: '喝', pinyin: 'hē', meaning: '喝 (Drink)', level: 10 },
  { char: '睡', pinyin: 'shuì', meaning: '睡 (Sleep)', level: 10 },
  { char: '做', pinyin: 'zuò', meaning: '做 (Do)', level: 10 },
  { char: '打', pinyin: 'dǎ', meaning: '打 (Hit)', level: 10 },
  { char: '拿', pinyin: 'ná', meaning: '拿 (Take)', level: 10 },
  { char: '放', pinyin: 'fàng', meaning: '放 (Put)', level: 10 },
  { char: '买', pinyin: 'mǎi', meaning: '买 (Buy)', level: 10 },
  { char: '卖', pinyin: 'mài', meaning: '卖 (Sell)', level: 10 },
  { char: '学', pinyin: 'xué', meaning: '学 (Learn)', level: 10 },
  { char: '教', pinyin: 'jiāo', meaning: '教 (Teach)', level: 10 },
  { char: '爱', pinyin: 'ài', meaning: '爱 (Love)', level: 10 },
  { char: '想', pinyin: 'xiǎng', meaning: '想 (Think)', level: 10 }
]

const currentIndex = ref(0)
const history = ref([])
const showAnswer = ref(false)
const lastResult = ref(null)
const currentLevel = ref(1)
const recentHistory = ref([])
const selectionReason = ref('')
const missedQueue = ref([]) // Queue for words missed in this session to ensure they return
const sessionCount = ref(0) // Track how many questions in this session
const sessionFinished = ref(false) // Flag for when everything is done for the day
const chartInstance = shallowRef(null)

// Mastery Map
const masteryMap = ref({})

const currentLevelList = computed(() => {
  return hanziBank.filter(h => h.level <= currentLevel.value)
})

const todayStr = computed(() => new Date().toISOString().split('T')[0])

// Level Progress Computed
const levelProgress = computed(() => {
  const levelItems = hanziBank.filter(h => h.level === currentLevel.value)
  if (levelItems.length === 0) return 0
  const masteredCount = levelItems.filter(h => {
    const m = masteryMap.value[h.char]
    return (m?.consecutiveCorrect || 0) > 2
  }).length
  return Math.round((masteredCount / levelItems.length) * 100)
})

onMounted(() => {
  const savedLevel = localStorage.getItem('hanzi_current_level')
  if (savedLevel) currentLevel.value = parseInt(savedLevel)

  const savedHistory = localStorage.getItem('hanzi_learning_history')
  if (savedHistory) {
    try {
      history.value = JSON.parse(savedHistory)
    } catch (e) {
      history.value = []
    }
  }

  rebuildMastery()
  nextHanzi()
  nextTick(() => {
    initChart()
  })
})

const rebuildMastery = () => {
  const map = {}
  hanziBank.forEach(h => {
    map[h.char] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0 }
  })
  history.value.forEach(record => {
    if (map[record.char]) {
      const m = map[record.char]
      m.totalAttempts++
      m.lastSeen = record.timestamp
      if (record.correct) {
        m.totalCorrect++
        m.consecutiveCorrect++
      } else {
        m.consecutiveCorrect = 0
      }
      
      if (record.timestamp.split('T')[0] === todayStr.value) {
        m.todayAttempts++
        if (record.correct) m.todayCorrect++
      }
    }
  })
  masteryMap.value = map
  checkLevelProgression()
}

const checkLevelProgression = () => {
  const levelItems = hanziBank.filter(h => h.level === currentLevel.value)
  if (levelItems.length === 0) return

  const fullyKnownCount = levelItems.filter(h => {
    const m = masteryMap.value[h.char]
    // Sync with UI progress: mastered if consecutive correct > 2
    return (m.consecutiveCorrect || 0) > 2
  }).length

  if (fullyKnownCount >= levelItems.length * 0.8 && currentLevel.value < 10) {
    currentLevel.value++
    localStorage.setItem('hanzi_current_level', currentLevel.value.toString())
  }
}

const recordAnswer = (isCorrect) => {
  const char = currentLevelList.value[currentIndex.value].char
  const record = { char, timestamp: new Date().toISOString(), correct: isCorrect }
  
  history.value.push(record)
  localStorage.setItem('hanzi_learning_history', JSON.stringify(history.value))
  
  // Update state immediately for reactivity
  const m = masteryMap.value[char]
  m.totalAttempts++
  m.lastSeen = record.timestamp
  if (isCorrect) {
    m.totalCorrect++
    m.consecutiveCorrect++
    m.todayCorrect++
  } else {
    m.consecutiveCorrect = 0
  }
  m.todayAttempts++
  
  // Mandatory: Force trigger reactivity for nested updates if needed
  masteryMap.value = { ...masteryMap.value }

  recentHistory.value.push(currentIndex.value)
  if (recentHistory.value.length > 6) recentHistory.value.shift()

  if (isCorrect) {
    m.totalCorrect++
    m.consecutiveCorrect++
    m.todayCorrect++
    // If it was in the missed queue, remove it since user got it right now
    missedQueue.value = missedQueue.value.filter(c => c !== char)
  } else {
    m.consecutiveCorrect = 0
    // If missed, add to queue for urgent return (if not already there)
    if (!missedQueue.value.includes(char)) {
      missedQueue.value.push(char)
    }
  }
  m.todayAttempts++
  sessionCount.value++
  
  // Clean up missed queue if the word is now mastered or "abandoned" for the day
  const todayAccuracy = m.todayCorrect / m.todayAttempts
  if (isCorrect || (m.todayAttempts >= 6 && todayAccuracy < 0.3)) {
    missedQueue.value = missedQueue.value.filter(c => c !== char)
  }
  
  // Mandatory: Force trigger reactivity for nested updates if needed
  masteryMap.value = { ...masteryMap.value }

  recentHistory.value.push(currentIndex.value)
  if (recentHistory.value.length > 5) recentHistory.value.shift()

  lastResult.value = isCorrect ? 'correct' : 'incorrect'
  showAnswer.value = true
  
  checkLevelProgression()
  updateChartData()

  setTimeout(() => {
    showAnswer.value = false
    lastResult.value = null
    nextHanzi()
  }, 1200)
}

const nextHanzi = () => {
  const allAvailable = currentLevelList.value
  if (allAvailable.length === 0) return

  // Adaptive Strategy:
  // 1. Warm-up Phase: Show easy reviews
  // 2. Urgent Recovery: Return missed words after a short gap
  // 3. Core Phase: Focus on the "Active Window"
  
  const isWarmUp = sessionCount.value < 4
  
  // Logic to pick from Missed Queue
  if (missedQueue.value.length > 0 && !recentHistory.value.some(idx => missedQueue.value.includes(allAvailable[idx]?.char))) {
    const targetChar = missedQueue.value[0]
    const targetIdx = allAvailable.findIndex(h => h.char === targetChar)
    if (targetIdx !== -1 && !recentHistory.value.includes(targetIdx)) {
      currentIndex.value = targetIdx
      selectionReason.value = '克服困难'
      return
    }
  }

  // Detect global exhaustion for the day
  const exhaustedPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.char] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMasteredThisSession = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.todayAttempts >= 5 && todayAcc >= 0.85)
    const isFrustrated = m.todayAttempts >= 6 && todayAcc < 0.4
    return isMasteredThisSession || isFrustrated
  })

  if (exhaustedPool.length >= allAvailable.length) {
    sessionFinished.value = true
    return
  }

  // Define Working Window
  const remainingPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.char] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMasteredThisSession = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.todayAttempts >= 5 && todayAcc >= 0.85)
    const isFrustrated = m.todayAttempts >= 6 && todayAcc < 0.4
    return !isMasteredThisSession && !isFrustrated
  })
  
  const currentSessionAcc = parseFloat(statsToday.value.rate)
  const windowSize = currentSessionAcc > 90 ? 10 : (currentSessionAcc < 60 ? 4 : 7)
  const workingSet = remainingPool.slice(0, windowSize)

  const weights = allAvailable.map((item, index) => {
    const m = masteryMap.value[item.char] || { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0 }
    
    // Stage 0: Absolute Blockers (History & Session Protection)
    if (recentHistory.value.includes(index) || (index === currentIndex.value && allAvailable.length > 1)) {
      return { index, weight: 0, reason: '' }
    }

    // Stage 1: Intelligence Blockers (Strict Graduation & Fatigue)
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMasteredThisSession = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.todayAttempts >= 5 && todayAcc >= 0.85)
    const isFrustrated = m.todayAttempts >= 6 && todayAcc < 0.4

    if (isMasteredThisSession) return { index, weight: 0, reason: '学会了' }
    if (isFrustrated) return { index, weight: 0, reason: '暂缓' }

    // Stage 2: Weighting Logic
    const isInWorkingSet = workingSet.some(w => w.char === item.char)
    let weight = 0
    let reason = '复习'

    if (isWarmUp) {
      if (m.consecutiveCorrect > 4) {
        weight = 100
        reason = '热身'
      } else {
        weight = 5
      }
    } else {
      if (isInWorkingSet) {
        weight = 100
        
        const sessionAcc = parseFloat(statsToday.value.rate) / 100
        const pacingMultiplier = sessionAcc < 0.7 ? 0.5 : 1.0

        if (m.totalAttempts === 0) {
          weight *= (15 * pacingMultiplier)
          reason = '初见'
        }
        
        if (m.consecutiveCorrect === 1 && m.totalAttempts > 1) {
          weight *= 4
          reason = '巩固'
        }

        const totalAcc = m.totalAttempts > 0 ? m.totalCorrect / m.totalAttempts : 1
        if (totalAcc < 0.6) {
          weight *= 8
          reason = '攻坚'
        }

        if (m.lastSeen) {
          const hours = (new Date() - new Date(m.lastSeen)) / (1000 * 3600)
          weight *= (1 + Math.min(10, hours))
        }

        if (m.todayAttempts > 0) {
          weight *= (1 / (m.todayAttempts * 1.5 + 1))
        }
      } else {
        weight = 0.2
        reason = '预见'
      }
    }

    return { index, weight, reason }
  })

  let totalWeight = weights.reduce((s, w) => s + w.weight, 0)

  if (totalWeight <= 0) {
    const retryWeights = weights.map(w => {
      if (w.reason === '学会了' || w.reason === '暂缓') return w
      return { ...w, weight: 1 } 
    })
    const retryTotal = retryWeights.reduce((s, w) => s + w.weight, 0)
    
    if (retryTotal <= 0) {
      sessionFinished.value = true
    } else {
      let random = Math.random() * retryTotal
      for (const w of retryWeights) {
        random -= w.weight
        if (random <= 0) {
          currentIndex.value = w.index
          selectionReason.value = '收尾'
          return
        }
      }
    }
  } else {
    let random = Math.random() * totalWeight
    for (const w of weights) {
      random -= w.weight
      if (random <= 0) {
        currentIndex.value = w.index
        selectionReason.value = w.reason
        return
      }
    }
  }
}

const chooseByWeight = (weights, totalWeight) => {
  let random = Math.random() * totalWeight
  for (const w of weights) {
    random -= w.weight
    if (random <= 0) {
      currentIndex.value = w.index
      return
    }
  }
}

// History aggregation
const historyLog = computed(() => {
  return [...history.value].reverse().slice(0, 30) // Show last 30
})

const dailyAggregates = computed(() => {
  const days = {}
  history.value.forEach(h => {
    const day = h.timestamp.split('T')[0]
    if (!days[day]) days[day] = { count: 0, correct: 0 }
    days[day].count++
    if (h.correct) days[day].correct++
  })
  
  // Ensure today is always in the list for the chart
  if (!days[todayStr.value]) {
    days[todayStr.value] = { count: 0, correct: 0 }
  }
  
  return days
})

const statsToday = computed(() => {
  const today = dailyAggregates.value[todayStr.value] || { count: 0, correct: 0 }
  return {
    total: today.count,
    correct: today.correct,
    rate: today.count > 0 ? ((today.correct / today.count) * 100).toFixed(1) : 0
  }
})

const currentCharStats = computed(() => {
  const list = currentLevelList.value
  if (!list[currentIndex.value]) return null
  const char = list[currentIndex.value].char
  const m = masteryMap.value[char] || { totalAttempts: 0, totalCorrect: 0, todayAttempts: 0, todayCorrect: 0 }
  return { char, ...m }
})

const initChart = () => {
  const el = document.getElementById('learningChart')
  if (!el) return
  const ctx = el.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: '学习量', data: [], borderColor: '#FF9AA2', backgroundColor: 'rgba(255, 154, 162, 0.2)', tension: 0.4, fill: true },
        { label: '正确率 %', data: [], borderColor: '#4ECDC4', backgroundColor: 'rgba(78, 205, 196, 0.2)', tension: 0.4, fill: true, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: '数量' } },
        y1: { position: 'right', beginAtZero: true, max: 100, title: { display: true, text: '正确率' } }
      }
    }
  })
  updateChartData()
}

const updateChartData = () => {
  if (!chartInstance.value) return
  const sortedDays = Object.keys(dailyAggregates.value).sort().slice(-7)
  const counts = sortedDays.map(d => dailyAggregates.value[d].count)
  const rates = sortedDays.map(d => dailyAggregates.value[d].count > 0 ? (dailyAggregates.value[d].correct / dailyAggregates.value[d].count * 100).toFixed(1) : 0)
  
  chartInstance.value.data.labels = sortedDays.map(d => d.split('-').slice(1).join('/'))
  chartInstance.value.data.datasets[0].data = counts
  chartInstance.value.data.datasets[1].data = rates
  chartInstance.value.update()
}

watch(history, () => updateChartData(), { deep: true })
</script>

<template>
  <div class="hanzi-container">
    <div class="test-area" v-if="!sessionFinished && currentLevelList[currentIndex]">
      <!-- Char Card -->
      <div class="card-display" :class="{ 'correct-anim': lastResult === 'correct', 'incorrect-anim': lastResult === 'incorrect' }">
        <div class="char-reason-tag" v-if="selectionReason && !showAnswer">{{ selectionReason }}</div>
        <div class="char-level-badge" :class="{ 'current-level': currentLevelList[currentIndex].level === currentLevel }">
          L{{ currentLevelList[currentIndex].level }}
        </div>
        <div class="char-box">
          <div class="char">{{ currentLevelList[currentIndex].char }}</div>
          <div v-if="showAnswer" class="answer-overlay" :class="lastResult">
            <div class="pinyin">{{ currentLevelList[currentIndex].pinyin }}</div>
            <div class="meaning">{{ currentLevelList[currentIndex].meaning.split(' ')[1] }}</div>
          </div>
        </div>
      </div>
      
      <!-- Interactive Buttons -->
      <div class="controls" v-if="!showAnswer">
        <button class="action-btn unknown" @click="recordAnswer(false)">❓ 不认识</button>
        <button class="action-btn known" @click="recordAnswer(true)">✅ 认识</button>
      </div>
      <div class="controls" v-else>
        <div class="feedback-text" :class="lastResult">
          {{ lastResult === 'correct' ? '🌟 太棒了！' : '💪 加油，多看一眼' }}
        </div>
      </div>
    </div>

    <!-- Daily Mission Complete UI -->
    <div class="test-area" v-else-if="sessionFinished">
      <div class="card-display finish-card">
        <div class="finish-content">
          <div class="finish-icon">🏆</div>
          <div class="finish-title">今日任务达成！</div>
          <div class="finish-desc">所有待测汉字已掌握或已计划休息。</div>
          <button class="action-btn restart-btn" @click="sessionFinished = false; sessionCount = 0; nextHanzi()">
            再次开启
          </button>
        </div>
      </div>
    </div>

    <!-- Real-time Detailed Stats for current Char -->
    <div class="stats-panel glass-card" v-if="currentCharStats && !showAnswer">
      <div class="panel-header">「{{ currentCharStats.char }}」成长档案</div>
      <div class="panel-grid">
        <div class="panel-item"><span>总次数</span><b>{{ currentCharStats.totalAttempts }}</b></div>
        <div class="panel-item"><span>总正确</span><b>{{ currentCharStats.totalCorrect }}</b></div>
        <div class="panel-item"><span>今日练习</span><b>{{ currentCharStats.todayAttempts }}</b></div>
        <div class="panel-item"><span>今日正确</span><b>{{ currentCharStats.todayCorrect }}</b></div>
      </div>
    </div>

    <!-- History Log Table -->
    <div class="history-log glass-card">
      <div class="panel-header">📋 最近答题详情</div>
      <div class="log-scroll">
        <table class="log-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>汉字</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, idx) in historyLog" :key="idx" :class="h.correct ? 'row-correct' : 'row-error'">
              <td>{{ new Date(h.timestamp).toLocaleTimeString() }}</td>
              <td>{{ h.char }}</td>
              <td>{{ h.correct ? '✅ 认识' : '❌ 不认识' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Daily Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card glass-card">
        <div class="sum-title">今日答题</div>
        <div class="sum-val">{{ statsToday.total }}</div>
      </div>
      <div class="summary-card glass-card">
        <div class="sum-title">今日正确</div>
        <div class="sum-val success">{{ statsToday.correct }}</div>
      </div>
      <div class="summary-card glass-card">
        <div class="sum-title">正确率</div>
        <div class="sum-val">{{ statsToday.rate }}%</div>
      </div>
    </div>

    <!-- Trends Chart -->
    <div class="chart-section glass-card">
      <div class="panel-header">📈 学习进步曲线</div>
      <div class="chart-box-inner">
        <canvas id="learningChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hanzi-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Glass Card Style Base */
.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
}

.top-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.level-box { font-size: 1.1rem; color: #666; font-weight: bold; }
.level-box span { color: #FF9AA2; font-size: 1.6rem; }
.progress-info { font-size: 0.9rem; color: #888; }

.test-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.card-display {
  background: white;
  border-radius: 35px;
  width: 220px;
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border: 6px solid #fff;
  overflow: hidden;
  position: relative;
}

.char { font-size: 8rem; color: #333; font-weight: bold; }
.answer-overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  background: rgba(255,255,255,0.96); animation: fadeIn 0.3s;
}
.answer-overlay.correct { background: rgba(226, 240, 203, 0.96); }
.answer-overlay.incorrect { background: rgba(255, 218, 193, 0.96); }
.pinyin { font-size: 2.2rem; color: #4ECDC4; font-weight: bold; }
.meaning { font-size: 1.3rem; color: #666; }

.controls { display: flex; gap: 1rem; }
.action-btn {
  padding: 0.8rem 1.6rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.2s;
}
.action-btn.known { background: #E2F0CB; color: #557A46; }
.action-btn.unknown { background: #FFDAC1; color: #8E6E5D; }
.action-btn:hover { transform: translateY(-3px); box-shadow: 0 5px 10px rgba(0,0,0,0.1); }

.panel-header { font-size: 1rem; color: #4A4A4A; font-weight: bold; margin-bottom: 0.8rem; border-left: 4px solid #FF9AA2; padding-left: 0.5rem; }

/* Detail statistics grid */
.panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.panel-item { background: rgba(255,255,255,0.3); padding: 0.5rem; border-radius: 10px; display: flex; justify-content: space-between; font-size: 0.85rem; }
.panel-item b { color: #FF9AA2; }

/* History Log */
.history-log { max-height: 250px; display: flex; flex-direction: column; }
.log-scroll { overflow-y: auto; flex: 1; border-radius: 10px; }
.log-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.log-table th { background: rgba(0,0,0,0.03); padding: 0.5rem; text-align: left; }
.log-table td { padding: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.02); }
.row-correct { color: #557A46; }
.row-error { color: #FF6B6B; background: rgba(255, 107, 107, 0.03); }

/* Summary Cards */
.summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; }
.summary-card { padding: 0.8rem; text-align: center; }
.sum-title { font-size: 0.75rem; color: #888; margin-bottom: 0.3rem; }
.sum-val { font-size: 1.4rem; font-weight: bold; color: #4A4A4A; }
.sum-val.success { color: #4ECDC4; }

/* Chart Area */
.chart-box-inner { height: 180px; width: 100%; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.correct-anim { animation: pulse-green 0.5s; }
.incorrect-anim { animation: shake 0.5s; }
@keyframes pulse-green { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }

/* Responsive Adjustments */
@media (max-width: 500px) {
  .summary-grid { grid-template-columns: 1fr; }
  .panel-grid { grid-template-columns: 1fr; }
}

.char-level-badge {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1rem;
  color: #ccc;
  font-weight: bold;
  z-index: 10;
}
.char-level-badge.current-level {
  color: #FF9AA2;
}

.char-reason-tag {
  position: absolute;
  top: 10px;
  left: 15px;
  background: rgba(255, 154, 162, 0.15);
  color: #FF9AA2;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 10;
}

.finish-card {
  background: linear-gradient(135deg, #FF9AA2 0%, #FFB7B2 100%) !important;
  color: white;
  border: none !important;
}

.finish-content {
  text-align: center;
  padding: 20px;
}

.finish-icon {
  font-size: 4rem;
  margin-bottom: 10px;
}

.finish-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.finish-desc {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.restart-btn {
  background: white !important;
  color: #FF9AA2 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>
```