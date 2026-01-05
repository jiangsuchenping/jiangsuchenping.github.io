<script setup>
import { ref, onMounted, computed, watch, nextTick, shallowRef } from 'vue'

/**
 * 英语单词库 - 入门版
 * 总共500个单词，分为10个等级
 */
const wordBank = [
  // Level 1: Basic Words (50个)
  { word: 'the', phonetic: 'ðə', meaning: '定冠词', level: 1 },
  { word: 'and', phonetic: 'ænd', meaning: '和', level: 1 },
  { word: 'of', phonetic: 'əv', meaning: '的', level: 1 },
  { word: 'to', phonetic: 'tuː', meaning: '到', level: 1 },
  { word: 'a', phonetic: 'ə', meaning: '不定冠词', level: 1 },
  { word: 'in', phonetic: 'ɪn', meaning: '在...里', level: 1 },
  { word: 'is', phonetic: 'ɪz', meaning: '是', level: 1 },
  { word: 'you', phonetic: 'juː', meaning: '你', level: 1 },
  { word: 'that', phonetic: 'ðæt', meaning: '那个', level: 1 },
  { word: 'it', phonetic: 'ɪt', meaning: '它', level: 1 },
  { word: 'he', phonetic: 'hiː', meaning: '他', level: 1 },
  { word: 'was', phonetic: 'wɒz', meaning: '是 (过去式)', level: 1 },
  { word: 'for', phonetic: 'fɔː', meaning: '为了', level: 1 },
  { word: 'on', phonetic: 'ɒn', meaning: '在...上', level: 1 },
  { word: 'are', phonetic: 'ɑː', meaning: '是', level: 1 },
  { word: 'as', phonetic: 'æz', meaning: '作为', level: 1 },
  { word: 'with', phonetic: 'wɪð', meaning: '和...一起', level: 1 },
  { word: 'his', phonetic: 'hɪz', meaning: '他的', level: 1 },
  { word: 'they', phonetic: 'ðeɪ', meaning: '他们', level: 1 },
  { word: 'I', phonetic: 'aɪ', meaning: '我', level: 1 },
  { word: 'at', phonetic: 'æt', meaning: '在', level: 1 },
  { word: 'be', phonetic: 'biː', meaning: '是', level: 1 },
  { word: 'this', phonetic: 'ðɪs', meaning: '这个', level: 1 },
  { word: 'have', phonetic: 'hæv', meaning: '有', level: 1 },
  { word: 'from', phonetic: 'frəm', meaning: '从', level: 1 },
  { word: 'or', phonetic: 'ɔː', meaning: '或者', level: 1 },
  { word: 'one', phonetic: 'wʌn', meaning: '一', level: 1 },
  { word: 'had', phonetic: 'hæd', meaning: '有 (过去式)', level: 1 },
  { word: 'by', phonetic: 'baɪ', meaning: '通过', level: 1 },
  { word: 'word', phonetic: 'wɜːd', meaning: '单词', level: 1 },
  { word: 'but', phonetic: 'bʌt', meaning: '但是', level: 1 },
  { word: 'what', phonetic: 'wɒt', meaning: '什么', level: 1 },
  { word: 'some', phonetic: 'sʌm', meaning: '一些', level: 1 },
  { word: 'can', phonetic: 'kæn', meaning: '能', level: 1 },
  { word: 'out', phonetic: 'aʊt', meaning: '外面', level: 1 },
  { word: 'other', phonetic: 'ˈʌðə', meaning: '其他', level: 1 },
  { word: 'were', phonetic: 'wɜː', meaning: '是 (过去式)', level: 1 },
  { word: 'all', phonetic: 'ɔːl', meaning: '所有', level: 1 },
  { word: 'there', phonetic: 'ðeə', meaning: '那里', level: 1 },
  { word: 'when', phonetic: 'wen', meaning: '当...时', level: 1 },
  { word: 'up', phonetic: 'ʌp', meaning: '向上', level: 1 },
  { word: 'use', phonetic: 'juːz', meaning: '使用', level: 1 },
  { word: 'your', phonetic: 'jɔː', meaning: '你的', level: 1 },
  { word: 'how', phonetic: 'haʊ', meaning: '如何', level: 1 },
  { word: 'said', phonetic: 'sed', meaning: '说 (过去式)', level: 1 },
  { word: 'an', phonetic: 'æn', meaning: '不定冠词', level: 1 },
  { word: 'each', phonetic: 'iːtʃ', meaning: '每个', level: 1 },
  { word: 'she', phonetic: 'ʃiː', meaning: '她', level: 1 },
  { word: 'do', phonetic: 'duː', meaning: '做', level: 1 },
  { word: 'their', phonetic: 'ðeə', meaning: '他们的', level: 1 },
  { word: 'time', phonetic: 'taɪm', meaning: '时间', level: 1 },
  
  // Level 2: Common Nouns (50个)
  { word: 'people', phonetic: 'ˈpiːpl', meaning: '人', level: 2 },
  { word: 'year', phonetic: 'jɪə', meaning: '年', level: 2 },
  { word: 'day', phonetic: 'deɪ', meaning: '天', level: 2 },
  { word: 'man', phonetic: 'mæn', meaning: '男人', level: 2 },
  { word: 'thing', phonetic: 'θɪŋ', meaning: '东西', level: 2 },
  { word: 'woman', phonetic: 'ˈwʊmən', meaning: '女人', level: 2 },
  { word: 'life', phonetic: 'laɪf', meaning: '生活', level: 2 },
  { word: 'child', phonetic: 'tʃaɪld', meaning: '孩子', level: 2 },
  { word: 'world', phonetic: 'wɜːld', meaning: '世界', level: 2 },
  { word: 'school', phonetic: 'skuːl', meaning: '学校', level: 2 },
  { word: 'state', phonetic: 'steɪt', meaning: '州', level: 2 },
  { word: 'family', phonetic: 'ˈfæməli', meaning: '家庭', level: 2 },
  { word: 'student', phonetic: 'ˈstjuːdənt', meaning: '学生', level: 2 },
  { word: 'group', phonetic: 'ɡruːp', meaning: '组', level: 2 },
  { word: 'country', phonetic: 'ˈkʌntri', meaning: '国家', level: 2 },
  { word: 'problem', phonetic: 'ˈprɒbləm', meaning: '问题', level: 2 },
  { word: 'hand', phonetic: 'hænd', meaning: '手', level: 2 },
  { word: 'part', phonetic: 'pɑːt', meaning: '部分', level: 2 },
  { word: 'place', phonetic: 'pleɪs', meaning: '地方', level: 2 },
  { word: 'case', phonetic: 'keɪs', meaning: '情况', level: 2 },
  { word: 'week', phonetic: 'wiːk', meaning: '周', level: 2 },
  { word: 'company', phonetic: 'ˈkʌmpəni', meaning: '公司', level: 2 },
  { word: 'system', phonetic: 'ˈsɪstəm', meaning: '系统', level: 2 },
  { word: 'program', phonetic: 'ˈprəʊɡræm', meaning: '程序', level: 2 },
  { word: 'question', phonetic: 'ˈkwestʃən', meaning: '问题', level: 2 },
  { word: 'work', phonetic: 'wɜːk', meaning: '工作', level: 2 },
  { word: 'government', phonetic: 'ˈɡʌvənmənt', meaning: '政府', level: 2 },
  { word: 'number', phonetic: 'ˈnʌmbə', meaning: '数字', level: 2 },
  { word: 'night', phonetic: 'naɪt', meaning: '夜晚', level: 2 },
  { word: 'point', phonetic: 'pɔɪnt', meaning: '点', level: 2 },
  { word: 'home', phonetic: 'həʊm', meaning: '家', level: 2 },
  { word: 'water', phonetic: 'ˈwɔːtə', meaning: '水', level: 2 },
  { word: 'room', phonetic: 'ruːm', meaning: '房间', level: 2 },
  { word: 'mother', phonetic: 'ˈmʌðə', meaning: '母亲', level: 2 },
  { word: 'area', phonetic: 'ˈeəriə', meaning: '区域', level: 2 },
  { word: 'money', phonetic: 'ˈmʌni', meaning: '钱', level: 2 },
  { word: 'story', phonetic: 'ˈstɔːri', meaning: '故事', level: 2 },
  { word: 'fact', phonetic: 'fækt', meaning: '事实', level: 2 },
  { word: 'month', phonetic: 'mʌnθ', meaning: '月', level: 2 },
  { word: 'lot', phonetic: 'lɒt', meaning: '许多', level: 2 },
  { word: 'right', phonetic: 'raɪt', meaning: '正确', level: 2 },
  { word: 'study', phonetic: 'ˈstʌdi', meaning: '学习', level: 2 },
  { word: 'book', phonetic: 'bʊk', meaning: '书', level: 2 },
  { word: 'eye', phonetic: 'aɪ', meaning: '眼睛', level: 2 },
  { word: 'job', phonetic: 'dʒɒb', meaning: '工作', level: 2 },
  { word: 'word', phonetic: 'wɜːd', meaning: '单词', level: 2 },
  { word: 'business', phonetic: 'ˈbɪznəs', meaning: '商业', level: 2 },
  { word: 'issue', phonetic: 'ˈɪʃuː', meaning: '问题', level: 2 },
  { word: 'side', phonetic: 'saɪd', meaning: '边', level: 2 },
  { word: 'kind', phonetic: 'kaɪnd', meaning: '种类', level: 2 },
  { word: 'head', phonetic: 'hed', meaning: '头', level: 2 },
  { word: 'house', phonetic: 'haʊs', meaning: '房子', level: 2 },
  
  // Level 3: Common Verbs (50个)
  { word: 'take', phonetic: 'teɪk', meaning: '拿', level: 3 },
  { word: 'get', phonetic: 'ɡet', meaning: '得到', level: 3 },
  { word: 'make', phonetic: 'meɪk', meaning: '制作', level: 3 },
  { word: 'know', phonetic: 'nəʊ', meaning: '知道', level: 3 },
  { word: 'want', phonetic: 'wɒnt', meaning: '想要', level: 3 },
  { word: 'come', phonetic: 'kʌm', meaning: '来', level: 3 },
  { word: 'look', phonetic: 'lʊk', meaning: '看', level: 3 },
  { word: 'see', phonetic: 'siː', meaning: '看见', level: 3 },
  { word: 'use', phonetic: 'juːz', meaning: '使用', level: 3 },
  { word: 'find', phonetic: 'faɪnd', meaning: '找到', level: 3 },
  { word: 'give', phonetic: 'ɡɪv', meaning: '给', level: 3 },
  { word: 'tell', phonetic: 'tel', meaning: '告诉', level: 3 },
  { word: 'ask', phonetic: 'ɑːsk', meaning: '问', level: 3 },
  { word: 'work', phonetic: 'wɜːk', meaning: '工作', level: 3 },
  { word: 'seem', phonetic: 'siːm', meaning: '似乎', level: 3 },
  { word: 'feel', phonetic: 'fiːl', meaning: '感觉', level: 3 },
  { word: 'try', phonetic: 'traɪ', meaning: '尝试', level: 3 },
  { word: 'leave', phonetic: 'liːv', meaning: '离开', level: 3 },
  { word: 'call', phonetic: 'kɔːl', meaning: '打电话', level: 3 },
  { word: 'good', phonetic: 'ɡʊd', meaning: '好', level: 3 },
  { word: 'should', phonetic: 'ʃʊd', meaning: '应该', level: 3 },
  { word: 'would', phonetic: 'wʊd', meaning: '会', level: 3 },
  { word: 'go', phonetic: 'ɡəʊ', meaning: '去', level: 3 },
  { word: 'come', phonetic: 'kʌm', meaning: '来', level: 3 },
  { word: 'could', phonetic: 'kʊd', meaning: '能', level: 3 },
  { word: 'say', phonetic: 'seɪ', meaning: '说', level: 3 },
  { word: 'will', phonetic: 'wɪl', meaning: '将', level: 3 },
  { word: 'can', phonetic: 'kæn', meaning: '能', level: 3 },
  { word: 'did', phonetic: 'dɪd', meaning: '做 (过去式)', level: 3 },
  { word: 'get', phonetic: 'ɡet', meaning: '得到', level: 3 },
  { word: 'make', phonetic: 'meɪk', meaning: '制作', level: 3 },
  { word: 'take', phonetic: 'teɪk', meaning: '拿', level: 3 },
  { word: 'have', phonetic: 'hæv', meaning: '有', level: 3 },
  { word: 'look', phonetic: 'lʊk', meaning: '看', level: 3 },
  { word: 'see', phonetic: 'siː', meaning: '看见', level: 3 },
  { word: 'use', phonetic: 'juːz', meaning: '使用', level: 3 },
  { word: 'find', phonetic: 'faɪnd', meaning: '找到', level: 3 },
  { word: 'give', phonetic: 'ɡɪv', meaning: '给', level: 3 },
  { word: 'tell', phonetic: 'tel', meaning: '告诉', level: 3 },
  { word: 'ask', phonetic: 'ɑːsk', meaning: '问', level: 3 },
  { word: 'work', phonetic: 'wɜːk', meaning: '工作', level: 3 },
  { word: 'seem', phonetic: 'siːm', meaning: '似乎', level: 3 },
  { word: 'feel', phonetic: 'fiːl', meaning: '感觉', level: 3 },
  { word: 'try', phonetic: 'traɪ', meaning: '尝试', level: 3 },
  { word: 'leave', phonetic: 'liːv', meaning: '离开', level: 3 },
  { word: 'call', phonetic: 'kɔːl', meaning: '打电话', level: 3 },
  { word: 'good', phonetic: 'ɡʊd', meaning: '好', level: 3 },
  { word: 'should', phonetic: 'ʃʊd', meaning: '应该', level: 3 },
  { word: 'would', phonetic: 'wʊd', meaning: '会', level: 3 },
  
  // Level 4: Common Adjectives (50个)
  { word: 'good', phonetic: 'ɡʊd', meaning: '好', level: 4 },
  { word: 'new', phonetic: 'njuː', meaning: '新', level: 4 },
  { word: 'first', phonetic: 'fɜːst', meaning: '第一', level: 4 },
  { word: 'last', phonetic: 'lɑːst', meaning: '最后', level: 4 },
  { word: 'long', phonetic: 'lɒŋ', meaning: '长', level: 4 },
  { word: 'great', phonetic: 'ɡreɪt', meaning: '伟大', level: 4 },
  { word: 'little', phonetic: 'ˈlɪtl', meaning: '小', level: 4 },
  { word: 'own', phonetic: 'əʊn', meaning: '自己的', level: 4 },
  { word: 'other', phonetic: 'ˈʌðə', meaning: '其他', level: 4 },
  { word: 'old', phonetic: 'əʊld', meaning: '旧', level: 4 },
  { word: 'right', phonetic: 'raɪt', meaning: '正确', level: 4 },
  { word: 'big', phonetic: 'bɪɡ', meaning: '大', level: 4 },
  { word: 'high', phonetic: 'haɪ', meaning: '高', level: 4 },
  { word: 'different', phonetic: 'ˈdɪfrənt', meaning: '不同', level: 4 },
  { word: 'small', phonetic: 'smɔːl', meaning: '小', level: 4 },
  { word: 'large', phonetic: 'lɑːdʒ', meaning: '大', level: 4 },
  { word: 'next', phonetic: 'nekst', meaning: '下一个', level: 4 },
  { word: 'early', phonetic: 'ˈɜːli', meaning: '早', level: 4 },
  { word: 'young', phonetic: 'jʌŋ', meaning: '年轻', level: 4 },
  { word: 'important', phonetic: 'ɪmˈpɔːtənt', meaning: '重要', level: 4 },
  { word: 'few', phonetic: 'fjuː', meaning: '少', level: 4 },
  { word: 'public', phonetic: 'ˈpʌblɪk', meaning: '公共', level: 4 },
  { word: 'bad', phonetic: 'bæd', meaning: '坏', level: 4 },
  { word: 'same', phonetic: 'seɪm', meaning: '相同', level: 4 },
  { word: 'able', phonetic: 'ˈeɪbl', meaning: '能', level: 4 },
  { word: 'to', phonetic: 'tuː', meaning: '到', level: 4 },
  { word: 'all', phonetic: 'ɔːl', meaning: '所有', level: 4 },
  { word: 'your', phonetic: 'jɔː', meaning: '你的', level: 4 },
  { word: 'how', phonetic: 'haʊ', meaning: '如何', level: 4 },
  { word: 'said', phonetic: 'sed', meaning: '说 (过去式)', level: 4 },
  { word: 'an', phonetic: 'æn', meaning: '不定冠词', level: 4 },
  { word: 'each', phonetic: 'iːtʃ', meaning: '每个', level: 4 },
  { word: 'she', phonetic: 'ʃiː', meaning: '她', level: 4 },
  { word: 'do', phonetic: 'duː', meaning: '做', level: 4 },
  { word: 'their', phonetic: 'ðeə', meaning: '他们的', level: 4 },
  { word: 'time', phonetic: 'taɪm', meaning: '时间', level: 4 },
  { word: 'if', phonetic: 'ɪf', meaning: '如果', level: 4 },
  { word: 'will', phonetic: 'wɪl', meaning: '将', level: 4 },
  { word: 'way', phonetic: 'weɪ', meaning: '方式', level: 4 },
  { word: 'about', phonetic: 'əˈbaʊt', meaning: '关于', level: 4 },
  { word: 'many', phonetic: 'ˈmeni', meaning: '许多', level: 4 },
  { word: 'then', phonetic: 'ðen', meaning: '然后', level: 4 },
  { word: 'them', phonetic: 'ðem', meaning: '他们', level: 4 },
  { word: 'write', phonetic: 'raɪt', meaning: '写', level: 4 },
  { word: 'would', phonetic: 'wʊd', meaning: '会', level: 4 },
  { word: 'like', phonetic: 'laɪk', meaning: '喜欢', level: 4 },
  { word: 'so', phonetic: 'səʊ', meaning: '所以', level: 4 },
  { word: 'these', phonetic: 'ðiːz', meaning: '这些', level: 4 },
  { word: 'her', phonetic: 'hɜː', meaning: '她的', level: 4 },
  { word: 'long', phonetic: 'lɒŋ', meaning: '长', level: 4 },
  
  // Level 5: Common Prepositions (50个)
  { word: 'at', phonetic: 'æt', meaning: '在', level: 5 },
  { word: 'by', phonetic: 'baɪ', meaning: '通过', level: 5 },
  { word: 'for', phonetic: 'fɔː', meaning: '为了', level: 5 },
  { word: 'from', phonetic: 'frəm', meaning: '从', level: 5 },
  { word: 'in', phonetic: 'ɪn', meaning: '在...里', level: 5 },
  { word: 'of', phonetic: 'əv', meaning: '的', level: 5 },
  { word: 'on', phonetic: 'ɒn', meaning: '在...上', level: 5 },
  { word: 'to', phonetic: 'tuː', meaning: '到', level: 5 },
  { word: 'with', phonetic: 'wɪð', meaning: '和...一起', level: 5 },
  { word: 'about', phonetic: 'əˈbaʊt', meaning: '关于', level: 5 },
  { word: 'above', phonetic: 'əˈbʌv', meaning: '在...上', level: 5 },
  { word: 'across', phonetic: 'əˈkrɒs', meaning: '穿过', level: 5 },
  { word: 'after', phonetic: 'ˈɑːftə', meaning: '在...后', level: 5 },
  { word: 'against', phonetic: 'əˈɡenst', meaning: '反对', level: 5 },
  { word: 'along', phonetic: 'əˈlɒŋ', meaning: '沿着', level: 5 },
  { word: 'among', phonetic: 'əˈmʌŋ', meaning: '在...中', level: 5 },
  { word: 'around', phonetic: 'əˈraʊnd', meaning: '周围', level: 5 },
  { word: 'as', phonetic: 'æz', meaning: '作为', level: 5 },
  { word: 'at', phonetic: 'æt', meaning: '在', level: 5 },
  { word: 'before', phonetic: 'bɪˈfɔː', meaning: '在...前', level: 5 },
  { word: 'behind', phonetic: 'bɪˈhaɪnd', meaning: '在...后', level: 5 },
  { word: 'below', phonetic: 'bɪˈləʊ', meaning: '在...下', level: 5 },
  { word: 'beneath', phonetic: 'bɪˈniːθ', meaning: '在...下', level: 5 },
  { word: 'beside', phonetic: 'bɪˈsaɪd', meaning: '在...旁', level: 5 },
  { word: 'between', phonetic: 'bɪˈtwiːn', meaning: '在...之间', level: 5 },
  { word: 'beyond', phonetic: 'bɪˈjɒnd', meaning: '超越', level: 5 },
  { word: 'but', phonetic: 'bʌt', meaning: '但是', level: 5 },
  { word: 'by', phonetic: 'baɪ', meaning: '通过', level: 5 },
  { word: 'concerning', phonetic: 'kənˈsɜːnɪŋ', meaning: '关于', level: 5 },
  { word: 'considering', phonetic: 'kənˈsɪdərɪŋ', meaning: '考虑到', level: 5 },
  { word: 'despite', phonetic: 'dɪˈspaɪt', meaning: '尽管', level: 5 },
  { word: 'down', phonetic: 'daʊn', meaning: '向下', level: 5 },
  { word: 'during', phonetic: 'ˈdjʊərɪŋ', meaning: '在...期间', level: 5 },
  { word: 'except', phonetic: 'ɪkˈsept', meaning: '除了', level: 5 },
  { word: 'for', phonetic: 'fɔː', meaning: '为了', level: 5 },
  { word: 'from', phonetic: 'frəm', meaning: '从', level: 5 },
  { word: 'in', phonetic: 'ɪn', meaning: '在...里', level: 5 },
  { word: 'inside', phonetic: 'ˌɪnˈsaɪd', meaning: '在...内', level: 5 },
  { word: 'into', phonetic: 'ˈɪntuː', meaning: '进入', level: 5 },
  { word: 'like', phonetic: 'laɪk', meaning: '像', level: 5 },
  { word: 'near', phonetic: 'nɪə', meaning: '附近', level: 5 },
  { word: 'of', phonetic: 'əv', meaning: '的', level: 5 },
  { word: 'off', phonetic: 'ɒf', meaning: '离开', level: 5 },
  { word: 'on', phonetic: 'ɒn', meaning: '在...上', level: 5 },
  { word: 'onto', phonetic: 'ˈɒntuː', meaning: '到...上', level: 5 },
  { word: 'out', phonetic: 'aʊt', meaning: '外面', level: 5 },
  { word: 'outside', phonetic: 'ˌaʊtˈsaɪd', meaning: '在...外', level: 5 },
  { word: 'over', phonetic: 'ˈəʊvə', meaning: '在...上', level: 5 },
  { word: 'past', phonetic: 'pɑːst', meaning: '过去', level: 5 },
  { word: 'regarding', phonetic: 'rɪˈɡɑːdɪŋ', meaning: '关于', level: 5 },
  { word: 'round', phonetic: 'raʊnd', meaning: '围绕', level: 5 },
  
  // Level 6: Common Adverbs (50个)
  { word: 'not', phonetic: 'nɒt', meaning: '不', level: 6 },
  { word: 'now', phonetic: 'naʊ', meaning: '现在', level: 6 },
  { word: 'very', phonetic: 'ˈveri', meaning: '非常', level: 6 },
  { word: 'also', phonetic: 'ˈɔːlsəʊ', meaning: '也', level: 6 },
  { word: 'here', phonetic: 'hɪə', meaning: '这里', level: 6 },
  { word: 'so', phonetic: 'səʊ', meaning: '所以', level: 6 },
  { word: 'how', phonetic: 'haʊ', meaning: '如何', level: 6 },
  { word: 'then', phonetic: 'ðen', meaning: '然后', level: 6 },
  { word: 'just', phonetic: 'dʒʌst', meaning: '刚刚', level: 6 },
  { word: 'them', phonetic: 'ðem', meaning: '他们', level: 6 },
  { word: 'there', phonetic: 'ðeə', meaning: '那里', level: 6 },
  { word: 'all', phonetic: 'ɔːl', meaning: '所有', level: 6 },
  { word: 'when', phonetic: 'wen', meaning: '当...时', level: 6 },
  { word: 'up', phonetic: 'ʌp', meaning: '向上', level: 6 },
  { word: 'only', phonetic: 'ˈəʊnli', meaning: '只有', level: 6 },
  { word: 'but', phonetic: 'bʌt', meaning: '但是', level: 6 },
  { word: 'back', phonetic: 'bæk', meaning: '回来', level: 6 },
  { word: 'down', phonetic: 'daʊn', meaning: '向下', level: 6 },
  { word: 'off', phonetic: 'ɒf', meaning: '离开', level: 6 },
  { word: 'so', phonetic: 'səʊ', meaning: '所以', level: 6 },
  { word: 'how', phonetic: 'haʊ', meaning: '如何', level: 6 },
  { word: 'then', phonetic: 'ðen', meaning: '然后', level: 6 },
  { word: 'just', phonetic: 'dʒʌst', meaning: '刚刚', level: 6 },
  { word: 'them', phonetic: 'ðem', meaning: '他们', level: 6 },
  { word: 'there', phonetic: 'ðeə', meaning: '那里', level: 6 },
  { word: 'all', phonetic: 'ɔːl', meaning: '所有', level: 6 },
  { word: 'when', phonetic: 'wen', meaning: '当...时', level: 6 },
  { word: 'up', phonetic: 'ʌp', meaning: '向上', level: 6 },
  { word: 'only', phonetic: 'ˈəʊnli', meaning: '只有', level: 6 },
  { word: 'but', phonetic: 'bʌt', meaning: '但是', level: 6 },
  { word: 'back', phonetic: 'bæk', meaning: '回来', level: 6 },
  { word: 'down', phonetic: 'daʊn', meaning: '向下', level: 6 },
  { word: 'off', phonetic: 'ɒf', meaning: '离开', level: 6 },
  { word: 'out', phonetic: 'aʊt', meaning: '外面', level: 6 },
  { word: 'over', phonetic: 'ˈəʊvə', meaning: '在...上', level: 6 },
  { word: 'again', phonetic: 'əˈɡen', meaning: '再次', level: 6 },
  { word: 'further', phonetic: 'ˈfɜːðə', meaning: '更远', level: 6 },
  { word: 'then', phonetic: 'ðen', meaning: '然后', level: 6 },
  { word: 'once', phonetic: 'wʌns', meaning: '一旦', level: 6 },
  { word: 'here', phonetic: 'hɪə', meaning: '这里', level: 6 },
  { word: 'well', phonetic: 'wel', meaning: '好', level: 6 },
  { word: 'also', phonetic: 'ˈɔːlsəʊ', meaning: '也', level: 6 },
  { word: 'now', phonetic: 'naʊ', meaning: '现在', level: 6 },
  { word: 'very', phonetic: 'ˈveri', meaning: '非常', level: 6 },
  { word: 'more', phonetic: 'mɔː', meaning: '更多', level: 6 },
  { word: 'most', phonetic: 'məʊst', meaning: '最多', level: 6 },
  { word: 'such', phonetic: 'sʌtʃ', meaning: '这样', level: 6 },
  { word: 'as', phonetic: 'æz', meaning: '作为', level: 6 },
  { word: 'too', phonetic: 'tuː', meaning: '也', level: 6 },
  
  // Level 7: Common Pronouns (50个)
  { word: 'I', phonetic: 'aɪ', meaning: '我', level: 7 },
  { word: 'you', phonetic: 'juː', meaning: '你', level: 7 },
  { word: 'he', phonetic: 'hiː', meaning: '他', level: 7 },
  { word: 'she', phonetic: 'ʃiː', meaning: '她', level: 7 },
  { word: 'it', phonetic: 'ɪt', meaning: '它', level: 7 },
  { word: 'we', phonetic: 'wiː', meaning: '我们', level: 7 },
  { word: 'they', phonetic: 'ðeɪ', meaning: '他们', level: 7 },
  { word: 'me', phonetic: 'miː', meaning: '我 (宾格)', level: 7 },
  { word: 'him', phonetic: 'hɪm', meaning: '他 (宾格)', level: 7 },
  { word: 'her', phonetic: 'hɜː', meaning: '她 (宾格)', level: 7 },
  { word: 'us', phonetic: 'ʌs', meaning: '我们 (宾格)', level: 7 },
  { word: 'them', phonetic: 'ðem', meaning: '他们 (宾格)', level: 7 },
  { word: 'my', phonetic: 'maɪ', meaning: '我的', level: 7 },
  { word: 'your', phonetic: 'jɔː', meaning: '你的', level: 7 },
  { word: 'his', phonetic: 'hɪz', meaning: '他的', level: 7 },
  { word: 'her', phonetic: 'hɜː', meaning: '她的', level: 7 },
  { word: 'its', phonetic: 'ɪts', meaning: '它的', level: 7 },
  { word: 'our', phonetic: 'ˈaʊə', meaning: '我们的', level: 7 },
  { word: 'their', phonetic: 'ðeə', meaning: '他们的', level: 7 },
  { word: 'mine', phonetic: 'maɪn', meaning: '我的 (名词性)', level: 7 },
  { word: 'yours', phonetic: 'jɔːz', meaning: '你的 (名词性)', level: 7 },
  { word: 'his', phonetic: 'hɪz', meaning: '他的 (名词性)', level: 7 },
  { word: 'hers', phonetic: 'hɜːz', meaning: '她的 (名词性)', level: 7 },
  { word: 'its', phonetic: 'ɪts', meaning: '它的 (名词性)', level: 7 },
  { word: 'ours', phonetic: 'ˈaʊəz', meaning: '我们的 (名词性)', level: 7 },
  { word: 'theirs', phonetic: 'ðeəz', meaning: '他们的 (名词性)', level: 7 },
  { word: 'myself', phonetic: 'maɪˈself', meaning: '我自己', level: 7 },
  { word: 'yourself', phonetic: 'jɔːˈself', meaning: '你自己', level: 7 },
  { word: 'himself', phonetic: 'hɪmˈself', meaning: '他自己', level: 7 },
  { word: 'herself', phonetic: 'hɜːˈself', meaning: '她自己', level: 7 },
  { word: 'itself', phonetic: 'ɪtˈself', meaning: '它自己', level: 7 },
  { word: 'ourselves', phonetic: 'ˌaʊəˈselvz', meaning: '我们自己', level: 7 },
  { word: 'yourselves', phonetic: 'jɔːˈselvz', meaning: '你们自己', level: 7 },
  { word: 'themselves', phonetic: 'ðəmˈselvz', meaning: '他们自己', level: 7 },
  { word: 'what', phonetic: 'wɒt', meaning: '什么', level: 7 },
  { word: 'which', phonetic: 'wɪtʃ', meaning: '哪个', level: 7 },
  { word: 'who', phonetic: 'huː', meaning: '谁', level: 7 },
  { word: 'whom', phonetic: 'huːm', meaning: '谁 (宾格)', level: 7 },
  { word: 'whose', phonetic: 'huːz', meaning: '谁的', level: 7 },
  { word: 'this', phonetic: 'ðɪs', meaning: '这个', level: 7 },
  { word: 'that', phonetic: 'ðæt', meaning: '那个', level: 7 },
  { word: 'these', phonetic: 'ðiːz', meaning: '这些', level: 7 },
  { word: 'those', phonetic: 'ðəʊz', meaning: '那些', level: 7 },
  { word: 'all', phonetic: 'ɔːl', meaning: '所有', level: 7 },
  { word: 'any', phonetic: 'ˈeni', meaning: '任何', level: 7 },
  { word: 'both', phonetic: 'bəʊθ', meaning: '两者都', level: 7 },
  { word: 'each', phonetic: 'iːtʃ', meaning: '每个', level: 7 },
  { word: 'either', phonetic: 'ˈaɪðə', meaning: '两者之一', level: 7 },
  { word: 'neither', phonetic: 'ˈnaɪðə', meaning: '两者都不', level: 7 },
  { word: 'none', phonetic: 'nʌn', meaning: '没有', level: 7 },
  
  // Level 8: Common Conjunctions (50个)
  { word: 'and', phonetic: 'ænd', meaning: '和', level: 8 },
  { word: 'but', phonetic: 'bʌt', meaning: '但是', level: 8 },
  { word: 'or', phonetic: 'ɔː', meaning: '或者', level: 8 },
  { word: 'so', phonetic: 'səʊ', meaning: '所以', level: 8 },
  { word: 'for', phonetic: 'fɔː', meaning: '因为', level: 8 },
  { word: 'nor', phonetic: 'nɔː', meaning: '也不', level: 8 },
  { word: 'yet', phonetic: 'jet', meaning: '但是', level: 8 },
  { word: 'although', phonetic: 'ɔːlˈðəʊ', meaning: '尽管', level: 8 },
  { word: 'because', phonetic: 'bɪˈkɒz', meaning: '因为', level: 8 },
  { word: 'if', phonetic: 'ɪf', meaning: '如果', level: 8 },
  { word: 'since', phonetic: 'sɪns', meaning: '自从', level: 8 },
  { word: 'than', phonetic: 'ðæn', meaning: '比', level: 8 },
  { word: 'that', phonetic: 'ðæt', meaning: '那个', level: 8 },
  { word: 'though', phonetic: 'ðəʊ', meaning: '尽管', level: 8 },
  { word: 'until', phonetic: 'ənˈtɪl', meaning: '直到', level: 8 },
  { word: 'when', phonetic: 'wen', meaning: '当...时', level: 8 },
  { word: 'whenever', phonetic: 'wenˈevə', meaning: '无论何时', level: 8 },
  { word: 'where', phonetic: 'weə', meaning: '哪里', level: 8 },
  { word: 'wherever', phonetic: 'weərˈevə', meaning: '无论哪里', level: 8 },
  { word: 'whether', phonetic: 'ˈweðə', meaning: '是否', level: 8 },
  { word: 'while', phonetic: 'waɪl', meaning: '当...时', level: 8 },
  { word: 'as', phonetic: 'æz', meaning: '作为', level: 8 },
  { word: 'as if', phonetic: 'æz ɪf', meaning: '好像', level: 8 },
  { word: 'as though', phonetic: 'æz ðəʊ', meaning: '好像', level: 8 },
  { word: 'as well as', phonetic: 'æz wel æz', meaning: '也', level: 8 },
  { word: 'in order that', phonetic: 'ɪn ˈɔːdə ðæt', meaning: '为了', level: 8 },
  { word: 'now that', phonetic: 'naʊ ðæt', meaning: '既然', level: 8 },
  { word: 'so that', phonetic: 'səʊ ðæt', meaning: '以便', level: 8 },
  { word: 'than', phonetic: 'ðæn', meaning: '比', level: 8 },
  { word: 'rather than', phonetic: 'ˈrɑːðə ðæn', meaning: '而不是', level: 8 },
  { word: 'such that', phonetic: 'sʌtʃ ðæt', meaning: '如此...以至于', level: 8 },
  { word: 'that', phonetic: 'ðæt', meaning: '那个', level: 8 },
  { word: 'what', phonetic: 'wɒt', meaning: '什么', level: 8 },
  { word: 'whatever', phonetic: 'wɒtˈevə', meaning: '无论什么', level: 8 },
  { word: 'when', phonetic: 'wen', meaning: '当...时', level: 8 },
  { word: 'whenever', phonetic: 'wenˈevə', meaning: '无论何时', level: 8 },
  { word: 'where', phonetic: 'weə', meaning: '哪里', level: 8 },
  { word: 'wherever', phonetic: 'weərˈevə', meaning: '无论哪里', level: 8 },
  { word: 'whether', phonetic: 'ˈweðə', meaning: '是否', level: 8 },
  { word: 'which', phonetic: 'wɪtʃ', meaning: '哪个', level: 8 },
  { word: 'whichever', phonetic: 'wɪtʃˈevə', meaning: '无论哪个', level: 8 },
  { word: 'who', phonetic: 'huː', meaning: '谁', level: 8 },
  { word: 'whoever', phonetic: 'huːˈevə', meaning: '无论谁', level: 8 },
  { word: 'whom', phonetic: 'huːm', meaning: '谁 (宾格)', level: 8 },
  { word: 'whomever', phonetic: 'huːmˈevə', meaning: '无论谁 (宾格)', level: 8 },
  { word: 'whose', phonetic: 'huːz', meaning: '谁的', level: 8 },
  { word: 'whosever', phonetic: 'huːzˈevə', meaning: '无论谁的', level: 8 },
  { word: 'and', phonetic: 'ænd', meaning: '和', level: 8 },
  
  // Level 9: Common Numbers (50个)
  { word: 'one', phonetic: 'wʌn', meaning: '一', level: 9 },
  { word: 'two', phonetic: 'tuː', meaning: '二', level: 9 },
  { word: 'three', phonetic: 'θriː', meaning: '三', level: 9 },
  { word: 'four', phonetic: 'fɔː', meaning: '四', level: 9 },
  { word: 'five', phonetic: 'faɪv', meaning: '五', level: 9 },
  { word: 'six', phonetic: 'sɪks', meaning: '六', level: 9 },
  { word: 'seven', phonetic: 'ˈsevn', meaning: '七', level: 9 },
  { word: 'eight', phonetic: 'eɪt', meaning: '八', level: 9 },
  { word: 'nine', phonetic: 'naɪn', meaning: '九', level: 9 },
  { word: 'ten', phonetic: 'ten', meaning: '十', level: 9 },
  { word: 'eleven', phonetic: 'ɪˈlevn', meaning: '十一', level: 9 },
  { word: 'twelve', phonetic: 'twelv', meaning: '十二', level: 9 },
  { word: 'thirteen', phonetic: 'ˌθɜːˈtiːn', meaning: '十三', level: 9 },
  { word: 'fourteen', phonetic: 'ˌfɔːˈtiːn', meaning: '十四', level: 9 },
  { word: 'fifteen', phonetic: 'ˌfɪfˈtiːn', meaning: '十五', level: 9 },
  { word: 'sixteen', phonetic: 'ˌsɪksˈtiːn', meaning: '十六', level: 9 },
  { word: 'seventeen', phonetic: 'ˌsevnˈtiːn', meaning: '十七', level: 9 },
  { word: 'eighteen', phonetic: 'ˌeɪˈtiːn', meaning: '十八', level: 9 },
  { word: 'nineteen', phonetic: 'ˌnaɪnˈtiːn', meaning: '十九', level: 9 },
  { word: 'twenty', phonetic: 'ˈtwenti', meaning: '二十', level: 9 },
  { word: 'thirty', phonetic: 'ˈθɜːti', meaning: '三十', level: 9 },
  { word: 'forty', phonetic: 'ˈfɔːti', meaning: '四十', level: 9 },
  { word: 'fifty', phonetic: 'ˈfɪfti', meaning: '五十', level: 9 },
  { word: 'sixty', phonetic: 'ˈsɪksti', meaning: '六十', level: 9 },
  { word: 'seventy', phonetic: 'ˈsevnti', meaning: '七十', level: 9 },
  { word: 'eighty', phonetic: 'ˈeɪti', meaning: '八十', level: 9 },
  { word: 'ninety', phonetic: 'ˈnaɪnti', meaning: '九十', level: 9 },
  { word: 'hundred', phonetic: 'ˈhʌndrəd', meaning: '百', level: 9 },
  { word: 'thousand', phonetic: 'ˈθaʊznd', meaning: '千', level: 9 },
  { word: 'million', phonetic: 'ˈmɪljən', meaning: '百万', level: 9 },
  { word: 'billion', phonetic: 'ˈbɪljən', meaning: '十亿', level: 9 },
  { word: 'first', phonetic: 'fɜːst', meaning: '第一', level: 9 },
  { word: 'second', phonetic: 'ˈsekənd', meaning: '第二', level: 9 },
  { word: 'third', phonetic: 'θɜːd', meaning: '第三', level: 9 },
  { word: 'fourth', phonetic: 'fɔːθ', meaning: '第四', level: 9 },
  { word: 'fifth', phonetic: 'fɪfθ', meaning: '第五', level: 9 },
  { word: 'sixth', phonetic: 'sɪksθ', meaning: '第六', level: 9 },
  { word: 'seventh', phonetic: 'ˈsevnθ', meaning: '第七', level: 9 },
  { word: 'eighth', phonetic: 'eɪtθ', meaning: '第八', level: 9 },
  { word: 'ninth', phonetic: 'naɪnθ', meaning: '第九', level: 9 },
  { word: 'tenth', phonetic: 'tenθ', meaning: '第十', level: 9 },
  { word: 'eleventh', phonetic: 'ɪˈlevnθ', meaning: '第十一', level: 9 },
  { word: 'twelfth', phonetic: 'twelfθ', meaning: '第十二', level: 9 },
  { word: 'thirteenth', phonetic: 'ˌθɜːˈtiːnθ', meaning: '第十三', level: 9 },
  { word: 'fourteenth', phonetic: 'ˌfɔːˈtiːnθ', meaning: '第十四', level: 9 },
  { word: 'fifteenth', phonetic: 'ˌfɪfˈtiːnθ', meaning: '第十五', level: 9 },
  { word: 'sixteenth', phonetic: 'ˌsɪksˈtiːnθ', meaning: '第十六', level: 9 },
  { word: 'seventeenth', phonetic: 'ˌsevnˈtiːnθ', meaning: '第十七', level: 9 },
  { word: 'eighteenth', phonetic: 'ˌeɪˈtiːnθ', meaning: '第十八', level: 9 },
  { word: 'nineteenth', phonetic: 'ˌnaɪnˈtiːnθ', meaning: '第十九', level: 9 },
  
  // Level 10: Common Phrases (50个)
  { word: 'a lot', phonetic: 'ə lɒt', meaning: '许多', level: 10 },
  { word: 'a little', phonetic: 'ə ˈlɪtl', meaning: '一点', level: 10 },
  { word: 'a few', phonetic: 'ə fjuː', meaning: '一些', level: 10 },
  { word: 'a great deal', phonetic: 'ə ɡreɪt diːl', meaning: '大量', level: 10 },
  { word: 'a good many', phonetic: 'ə ɡʊd ˈmeni', meaning: '许多', level: 10 },
  { word: 'a number of', phonetic: 'ə ˈnʌmbə əv', meaning: '一些', level: 10 },
  { word: 'a pair of', phonetic: 'ə peə əv', meaning: '一对', level: 10 },
  { word: 'a piece of', phonetic: 'ə piːs əv', meaning: '一片', level: 10 },
  { word: 'according to', phonetic: 'əˈkɔːdɪŋ tuː', meaning: '根据', level: 10 },
  { word: 'ahead of', phonetic: 'əˈhed əv', meaning: '在...前', level: 10 },
  { word: 'all along', phonetic: 'ɔːl əˈlɒŋ', meaning: '一直', level: 10 },
  { word: 'all at once', phonetic: 'ɔːl æt wʌns', meaning: '突然', level: 10 },
  { word: 'all but', phonetic: 'ɔːl bʌt', meaning: '几乎', level: 10 },
  { word: 'all in all', phonetic: 'ɔːl ɪn ɔːl', meaning: '总的来说', level: 10 },
  { word: 'all of a sudden', phonetic: 'ɔːl əv ə ˈsʌdn', meaning: '突然', level: 10 },
  { word: 'all over', phonetic: 'ɔːl ˈəʊvə', meaning: '到处', level: 10 },
  { word: 'all right', phonetic: 'ɔːl raɪt', meaning: '好的', level: 10 },
  { word: 'all the same', phonetic: 'ɔːl ðə seɪm', meaning: '仍然', level: 10 },
  { word: 'all the time', phonetic: 'ɔːl ðə taɪm', meaning: '一直', level: 10 },
  { word: 'and so on', phonetic: 'ænd səʊ ɒn', meaning: '等等', level: 10 },
  { word: 'anything but', phonetic: 'ˈeniθɪŋ bʌt', meaning: '根本不', level: 10 },
  { word: 'as a matter of fact', phonetic: 'æz ə ˈmætə əv fækt', meaning: '事实上', level: 10 },
  { word: 'as far as', phonetic: 'æz fɑː æz', meaning: '就...而言', level: 10 },
  { word: 'as for', phonetic: 'æz fɔː', meaning: '至于', level: 10 },
  { word: 'as if', phonetic: 'æz ɪf', meaning: '好像', level: 10 },
  { word: 'as long as', phonetic: 'æz lɒŋ æz', meaning: '只要', level: 10 },
  { word: 'as soon as', phonetic: 'æz suːn æz', meaning: '一...就', level: 10 },
  { word: 'as though', phonetic: 'æz ðəʊ', meaning: '好像', level: 10 },
  { word: 'as well', phonetic: 'æz wel', meaning: '也', level: 10 },
  { word: 'as well as', phonetic: 'æz wel æz', meaning: '也', level: 10 },
  { word: 'at all', phonetic: 'æt ɔːl', meaning: '根本', level: 10 },
  { word: 'at least', phonetic: 'æt liːst', meaning: '至少', level: 10 },
  { word: 'at most', phonetic: 'æt məʊst', meaning: '最多', level: 10 },
  { word: 'at once', phonetic: 'æt wʌns', meaning: '立即', level: 10 },
  { word: 'at present', phonetic: 'æt ˈpreznt', meaning: '目前', level: 10 },
  { word: 'at the same time', phonetic: 'æt ðə seɪm taɪm', meaning: '同时', level: 10 },
  { word: 'at times', phonetic: 'æt taɪmz', meaning: '有时', level: 10 },
  { word: 'back and forth', phonetic: 'bæk ænd fɔːθ', meaning: '来回', level: 10 },
  { word: 'because of', phonetic: 'bɪˈkɒz əv', meaning: '因为', level: 10 },
  { word: 'by all means', phonetic: 'baɪ ɔːl miːnz', meaning: '一定', level: 10 },
  { word: 'by chance', phonetic: 'baɪ tʃɑːns', meaning: '偶然', level: 10 },
  { word: 'by far', phonetic: 'baɪ fɑː', meaning: '到目前为止', level: 10 },
  { word: 'by means of', phonetic: 'baɪ miːnz əv', meaning: '通过', level: 10 },
  { word: 'by mistake', phonetic: 'baɪ mɪˈsteɪk', meaning: '错误地', level: 10 },
  { word: 'by no means', phonetic: 'baɪ nəʊ miːnz', meaning: '绝不', level: 10 },
  { word: 'by oneself', phonetic: 'baɪ wʌnˈself', meaning: '独自', level: 10 },
  { word: 'by the way', phonetic: 'baɪ ðə weɪ', meaning: '顺便说', level: 10 },
  { word: 'day after day', phonetic: 'deɪ ˈɑːftə deɪ', meaning: '日复一日', level: 10 },
  { word: 'day and night', phonetic: 'deɪ ænd naɪt', meaning: '日夜', level: 10 },
  { word: 'from time to time', phonetic: 'frəm taɪm tuː taɪm', meaning: '有时', level: 10 },
  { word: 'in a hurry', phonetic: 'ɪn ə ˈhʌri', meaning: '匆忙', level: 10 }
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

const masteryMap = ref({})
const streak = ref(0)
const startTime = ref(null)
const lastDuration = ref(0)

const sessionGoalProgress = computed(() => {
  const all = currentLevelList.value
  if (all.length === 0) return 0
  const exhausted = all.filter(item => {
    const m = masteryMap.value[item.word] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    return (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5) || (m.todayAttempts >= 6 && todayAcc < 0.35)
  }).length
  return Math.round((exhausted / all.length) * 100)
})

const currentLevelList = computed(() => {
  return wordBank.filter(h => h.level <= currentLevel.value)
})

const todayStr = computed(() => new Date().toISOString().split('T')[0])

// Level Progress Computed
const levelProgress = computed(() => {
  const levelItems = wordBank.filter(h => h.level === currentLevel.value)
  if (levelItems.length === 0) return 0
  const masteredCount = levelItems.filter(h => {
    const m = masteryMap.value[h.word]
    return (m?.consecutiveCorrect || 0) > 2
  }).length
  return Math.round((masteredCount / levelItems.length) * 100)
})

onMounted(() => {
  const savedLevel = localStorage.getItem('english_current_level')
  if (savedLevel) currentLevel.value = parseInt(savedLevel)

  const savedHistory = localStorage.getItem('english_learning_history')
  if (savedHistory) {
    try {
      history.value = JSON.parse(savedHistory)
    } catch (e) {
      history.value = []
    }
  }

  rebuildMastery()
  nextWord()
  startTime.value = Date.now()
  nextTick(() => {
    initChart()
  })
})

const rebuildMastery = () => {
  const map = {}
  wordBank.forEach(h => {
    map[h.word] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  })
  history.value.forEach(record => {
    if (map[record.word]) {
      const m = map[record.word]
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
  const levelItems = wordBank.filter(h => h.level === currentLevel.value)
  if (levelItems.length === 0) return

  const fullyKnownCount = levelItems.filter(h => {
    const m = masteryMap.value[h.word]
    // Sync with UI progress: mastered if consecutive correct > 2
    return (m.consecutiveCorrect || 0) > 2
  }).length

  if (fullyKnownCount >= levelItems.length * 0.8 && currentLevel.value < 10) {
    currentLevel.value++
    localStorage.setItem('english_current_level', currentLevel.value.toString())
  }
}

const recordAnswer = (isCorrect) => {
  const duration = Date.now() - startTime.value
  lastDuration.value = duration
  const word = currentLevelList.value[currentIndex.value].word
  const record = { word, timestamp: new Date().toISOString(), correct: isCorrect, duration }
  
  history.value.push(record)
  localStorage.setItem('english_learning_history', JSON.stringify(history.value))
  
  if (!masteryMap.value[word]) {
    masteryMap.value[word] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  }
  const m = masteryMap.value[word]

  m.totalAttempts++
  m.lastSeen = record.timestamp
  
  if (isCorrect) {
    m.avgDuration = m.avgDuration === 0 ? duration : (m.avgDuration * 0.7 + duration * 0.3)
    m.totalCorrect++
    m.consecutiveCorrect++
    m.todayCorrect++
    streak.value++
    missedQueue.value = missedQueue.value.filter(c => c !== word)
  } else {
    m.consecutiveCorrect = 0
    streak.value = 0
    if (!missedQueue.value.includes(word)) {
      missedQueue.value.push(word)
    }
  }
  m.todayAttempts++
  sessionCount.value++
  
  masteryMap.value = { ...masteryMap.value }
  checkLevelProgression()
  updateChartData()

  recentHistory.value.push(currentIndex.value)
  if (recentHistory.value.length > 5) recentHistory.value.shift()

  lastResult.value = isCorrect ? 'correct' : 'incorrect'
  showAnswer.value = true
  
  checkLevelProgression()
  updateChartData()

  setTimeout(() => {
    showAnswer.value = false
    lastResult.value = null
    nextWord()
    startTime.value = Date.now() // Reset timer for next question
  }, 1200)
}

const nextWord = () => {
  const allAvailable = currentLevelList.value
  if (allAvailable.length === 0) return

  // Adaptive Strategy:
  // 1. Warm-up Phase: Show easy reviews
  // 2. Urgent Recovery: Return missed words after a short gap
  // 3. Core Phase: Focus on the "Active Window"
  
  const isWarmUp = sessionCount.value < 4
  
  // Detect global exhaustion for the day (skip too easy or too hard)
  const exhaustedPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.word] || { todayAttempts: 0, todayCorrect: 0, consecutiveCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    
    // 已经学会了（今日掌握或长期掌握）
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5) || (m.todayAttempts >= 6 && todayAcc < 0.35)
    // 挫败感保护：测试次数较多但正确率极低，当天放弃检测
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    
    return isMastered || isTooHard
  })

  if (exhaustedPool.length >= allAvailable.length) {
    sessionFinished.value = true
    return
  }

  // Logic to pick from Missed Queue (only if not too hard/frustrated)
  if (missedQueue.value.length > 0) {
    const targetWord = missedQueue.value[0]
    const m = masteryMap.value[targetWord] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    
    // 如果该错题已经处于“气馁”状态，将其移出队列
    if (isTooHard) {
        missedQueue.value = missedQueue.value.filter(c => c !== targetWord)
    } else {
        const targetIdx = allAvailable.findIndex(h => h.word === targetWord)
        if (targetIdx !== -1 && !recentHistory.value.includes(targetIdx)) {
          currentIndex.value = targetIdx
          selectionReason.value = '克服困难'
          return
        }
    }
  }

  // Define Working Window
  const remainingPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.word] || { todayAttempts: 0, todayCorrect: 0, consecutiveCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    return !isMastered && !isTooHard
  })
  
  const currentSessionAcc = parseFloat(statsToday.value.rate)
  const windowSize = currentSessionAcc > 90 ? 10 : (currentSessionAcc < 60 ? 4 : 7)
  const workingSet = remainingPool.slice(0, windowSize)

  const weights = allAvailable.map((item, index) => {
    const m = masteryMap.value[item.word] || { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0 }
    
    // Stage 0: Absolute Blockers (History & Session Protection)
    if (recentHistory.value.includes(index) || (index === currentIndex.value && allAvailable.length > 1)) {
      return { index, weight: 0, reason: '' }
    }

    // Stage 1: Intelligence Blockers (Strict Graduation & Fatigue)
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)

    if (isMastered) return { index, weight: 0, reason: '学会了' }
    if (isTooHard) return { index, weight: 0, reason: '暂缓' }

    // Stage 2: Weighting Logic
    const isInWorkingSet = workingSet.some(w => w.word === item.word)
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

  // 4. Spaced Repetition (Ebbinghaus) & Urgency Boost
  const finalWeights = weights.map(w => {
    if (w.weight <= 0) return w
    const m = masteryMap.value[allAvailable[w.index].word] || {}
    let boost = 1

    // Ebbinghaus Urgency
    if (m.lastSeen) {
      const hoursSince = (new Date() - new Date(m.lastSeen)) / (1000 * 3600)
      boost += Math.min(5, hoursSince / 12) // Faster decay for English words
    }

    // Fluency Boost: Train recognition speed
    if (m.avgDuration > 3500) boost *= 1.5

    return { ...w, weight: w.weight * boost }
  })

  let totalWeight = finalWeights.reduce((s, w) => s + w.weight, 0)

  if (totalWeight <= 0) {
    const retryWeights = finalWeights.map(w => {
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
    for (const w of finalWeights) {
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
  const word = list[currentIndex.value].word
  const m = masteryMap.value[word] || { totalAttempts: 0, totalCorrect: 0, todayAttempts: 0, todayCorrect: 0 }
  return { word, ...m }
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
    <!-- Session Progress Bar -->
    <div class="session-progress-wrapper" v-if="!sessionFinished">
      <div class="progress-bar-inner" :style="{ width: sessionGoalProgress + '%' }"></div>
      <span class="progress-text">今日目标：{{ sessionGoalProgress }}%</span>
    </div>

    <div class="test-area" v-if="!sessionFinished && currentLevelList[currentIndex]">
      <!-- Streak Badge -->
      <div class="streak-badge" v-if="streak >= 3">
        🔥 {{ streak }} 连胜!
      </div>

      <!-- Word Card -->
      <div class="card-display" :class="{ 'correct-anim': lastResult === 'correct', 'incorrect-anim': lastResult === 'incorrect' }">
        <div class="char-reason-tag" v-if="selectionReason && !showAnswer">{{ selectionReason }}</div>
        <div class="char-level-badge" :class="{ 'current-level': currentLevelList[currentIndex].level === currentLevel }">
          L{{ currentLevelList[currentIndex].level }}
        </div>
        <div class="char-box">
          <div class="char">{{ currentLevelList[currentIndex].word }}</div>
          <div v-if="showAnswer" class="answer-overlay" :class="lastResult">
            <div class="pinyin">{{ currentLevelList[currentIndex].phonetic }}</div>
            <div class="meaning">{{ currentLevelList[currentIndex].meaning }}</div>
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
          <template v-if="lastResult === 'correct'">
            {{ lastDuration < 1500 ? '🚀 瞬间辨认！' : (lastDuration < 3000 ? '✨ 记的很牢！' : '🌟 太棒了！') }}
          </template>
          <template v-else>
            💪 加油，多看一眼
          </template>
        </div>
      </div>
    </div>

    <!-- Daily Mission Complete UI -->
    <div class="test-area" v-else-if="sessionFinished">
      <div class="card-display finish-card">
        <div class="finish-content">
          <div class="finish-icon">🏆</div>
          <div class="finish-title">今日任务达成！</div>
          <div class="finish-desc">所有待测单词已掌握或已计划休息。</div>
          <button class="action-btn restart-btn" @click="sessionFinished = false; sessionCount = 0; nextWord()">
            再次开启
          </button>
        </div>
      </div>
    </div>

    <!-- Real-time Detailed Stats for current Word -->
    <div class="stats-panel glass-card" v-if="currentCharStats && !showAnswer">
      <div class="panel-header">「{{ currentCharStats.word }}」成长档案</div>
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
              <th>单词</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, idx) in historyLog" :key="idx" :class="h.correct ? 'row-correct' : 'row-error'">
              <td>{{ new Date(h.timestamp).toLocaleTimeString() }}</td>
              <td>{{ h.word }}</td>
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
  gap: 1.2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 2rem;
}

/* Session Progress Indicator */
.session-progress-wrapper {
  width: 100%;
  height: 12px;
  background: rgba(255, 154, 162, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #FF9AA2, #FFB7B2);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.progress-text {
  position: absolute;
  right: 10px;
  top: -20px;
  font-size: 0.75rem;
  color: #FF9AA2;
  font-weight: bold;
}

.streak-badge {
  background: linear-gradient(135deg, #4ECDC4, #A29BFE);
  color: white;
  padding: 4px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: -10px;
  z-index: 5;
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Glass Card Style Base */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 1.2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
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

.char { font-size: 5rem; color: #333; font-weight: bold; }
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