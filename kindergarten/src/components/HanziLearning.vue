<script setup>
import { ref, onMounted, computed, watch, nextTick, shallowRef } from 'vue'

/**
 * 汉字字库 - 扩充版
 * 总共260个汉字，分为10个等级
 */
const hanziBank = [
  { char: '八', pinyin: 'bā', meaning: '八 (Eight)', level: 1 },
  { char: '百', pinyin: 'bǎi', meaning: '百 (Hundred)', level: 1 },
  { char: '不', pinyin: 'bù', meaning: '不 (Not)', level: 1 },
  { char: '的', pinyin: 'de', meaning: '的 (Particle)', level: 1 },
  { char: '二', pinyin: 'èr', meaning: '二 (Two)', level: 1 },
  { char: '个', pinyin: 'gè', meaning: '个 (Classifier)', level: 1 },
  { char: '国', pinyin: 'guó', meaning: '国 (Country)', level: 1 },
  { char: '好', pinyin: 'hǎo', meaning: '好 (Good)', level: 1 },
  { char: '九', pinyin: 'jiǔ', meaning: '九 (Nine)', level: 1 },
  { char: '了', pinyin: 'le', meaning: '了 (Particle)', level: 1 },
  { char: '零', pinyin: 'líng', meaning: '零 (Zero)', level: 1 },
  { char: '六', pinyin: 'liù', meaning: '六 (Six)', level: 1 },
  { char: '七', pinyin: 'qī', meaning: '七 (Seven)', level: 1 },
  { char: '千', pinyin: 'qiān', meaning: '千 (Thousand)', level: 1 },
  { char: '三', pinyin: 'sān', meaning: '三 (Three)', level: 1 },
  { char: '十', pinyin: 'shí', meaning: '十 (Ten)', level: 1 },
  { char: '是', pinyin: 'shì', meaning: '是 (To be)', level: 1 },
  { char: '四', pinyin: 'sì', meaning: '四 (Four)', level: 1 },
  { char: '万', pinyin: 'wàn', meaning: '万 (Ten thousand)', level: 1 },
  { char: '五', pinyin: 'wǔ', meaning: '五 (Five)', level: 1 },
  { char: '一', pinyin: 'yī', meaning: '一 (One)', level: 1 },
  { char: '亿', pinyin: 'yì', meaning: '亿 (Hundred million)', level: 1 },
  { char: '中', pinyin: 'zhōng', meaning: '中 (Middle)', level: 1 },
  { char: '鼻', pinyin: 'bí', meaning: '鼻 (Nose)', level: 1 },
  { char: '冰', pinyin: 'bīng', meaning: '冰 (Ice)', level: 1 },
  { char: '草', pinyin: 'cǎo', meaning: '草 (Grass)', level: 1 },
  { char: '耳', pinyin: 'ěr', meaning: '耳 (Ear)', level: 1 },
  { char: '发', pinyin: 'fà', meaning: '发 (Hair)', level: 1 },
  { char: '光', pinyin: 'guāng', meaning: '光 (Light)', level: 1 },
  { char: '海', pinyin: 'hǎi', meaning: '海 (Sea)', level: 1 },
  { char: '禾', pinyin: 'hé', meaning: '禾 (Grain)', level: 1 },
  { char: '河', pinyin: 'hé', meaning: '河 (River)', level: 1 },
  { char: '口', pinyin: 'kǒu', meaning: '口 (Mouth)', level: 1 },
  { char: '脸', pinyin: 'liǎn', meaning: '脸 (Face)', level: 1 },
  { char: '木', pinyin: 'mù', meaning: '木 (Wood)', level: 1 },
  { char: '目', pinyin: 'mù', meaning: '目 (Eye)', level: 1 },
  { char: '人', pinyin: 'rén', meaning: '人 (Person)', level: 1 },
  { char: '日', pinyin: 'rì', meaning: '日 (Sun)', level: 1 },
  { char: '山', pinyin: 'shān', meaning: '山 (Mountain)', level: 1 },
  { char: '舌', pinyin: 'shé', meaning: '舌 (Tongue)', level: 1 },
  { char: '身', pinyin: 'shēn', meaning: '身 (Body)', level: 1 },
  { char: '石', pinyin: 'shí', meaning: '石 (Stone)', level: 1 },
  { char: '手', pinyin: 'shǒu', meaning: '手 (Hand)', level: 1 },
  { char: '水', pinyin: 'shuǐ', meaning: '水 (Water)', level: 1 },
  { char: '田', pinyin: 'tián', meaning: '田 (Field)', level: 1 },
  { char: '头', pinyin: 'tóu', meaning: '头 (Head)', level: 1 },
  { char: '心', pinyin: 'xīn', meaning: '心 (Heart)', level: 1 },
  { char: '星', pinyin: 'xīng', meaning: '星 (Star)', level: 1 },
  { char: '雪', pinyin: 'xuě', meaning: '雪 (Snow)', level: 1 },
  { char: '牙', pinyin: 'yá', meaning: '牙 (Tooth)', level: 1 },
  { char: '雨', pinyin: 'yǔ', meaning: '雨 (Rain)', level: 2 },
  { char: '月', pinyin: 'yuè', meaning: '月 (Moon)', level: 2 },
  { char: '足', pinyin: 'zú', meaning: '足 (Foot)', level: 2 },
  { char: '北', pinyin: 'běi', meaning: '北 (North)', level: 2 },
  { char: '大', pinyin: 'dà', meaning: '大 (Big)', level: 2 },
  { char: '地', pinyin: 'dì', meaning: '地 (Earth)', level: 2 },
  { char: '低', pinyin: 'dī', meaning: '低 (Low)', level: 2 },
  { char: '东', pinyin: 'dōng', meaning: '东 (East)', level: 2 },
  { char: '短', pinyin: 'duǎn', meaning: '短 (Short)', level: 2 },
  { char: '多', pinyin: 'duō', meaning: '多 (Many)', level: 2 },
  { char: '风', pinyin: 'fēng', meaning: '风 (Wind)', level: 2 },
  { char: '高', pinyin: 'gāo', meaning: '高 (High)', level: 2 },
  { char: '后', pinyin: 'hòu', meaning: '后 (Back)', level: 2 },
  { char: '火', pinyin: 'huǒ', meaning: '火 (Fire)', level: 2 },
  { char: '间', pinyin: 'jiān', meaning: '间 (Between)', level: 2 },
  { char: '近', pinyin: 'jìn', meaning: '近 (Near)', level: 2 },
  { char: '旧', pinyin: 'jiù', meaning: '旧 (Old)', level: 2 },
  { char: '里', pinyin: 'lǐ', meaning: '里 (Inside)', level: 2 },
  { char: '南', pinyin: 'nán', meaning: '南 (South)', level: 2 },
  { char: '前', pinyin: 'qián', meaning: '前 (Front)', level: 2 },
  { char: '上', pinyin: 'shàng', meaning: '上 (Up)', level: 2 },
  { char: '少', pinyin: 'shǎo', meaning: '少 (Few)', level: 2 },
  { char: '天', pinyin: 'tiān', meaning: '天 (Sky)', level: 2 },
  { char: '土', pinyin: 'tǔ', meaning: '土 (Earth)', level: 2 },
  { char: '外', pinyin: 'wài', meaning: '外 (Outside)', level: 2 },
  { char: '西', pinyin: 'xī', meaning: '西 (West)', level: 2 },
  { char: '下', pinyin: 'xià', meaning: '下 (Down)', level: 2 },
  { char: '小', pinyin: 'xiǎo', meaning: '小 (Small)', level: 2 },
  { char: '新', pinyin: 'xīn', meaning: '新 (New)', level: 2 },
  { char: '右', pinyin: 'yòu', meaning: '右 (Right)', level: 2 },
  { char: '远', pinyin: 'yuǎn', meaning: '远 (Far)', level: 2 },
  { char: '云', pinyin: 'yún', meaning: '云 (Cloud)', level: 2 },
  { char: '长', pinyin: 'cháng', meaning: '长 (Long)', level: 2 },
  { char: '左', pinyin: 'zuǒ', meaning: '左 (Left)', level: 2 },
  { char: '唱', pinyin: 'chàng', meaning: '唱 (Sing)', level: 2 },
  { char: '鹅', pinyin: 'é', meaning: '鹅 (Goose)', level: 2 },
  { char: '飞', pinyin: 'fēi', meaning: '飞 (Fly)', level: 2 },
  { char: '狗', pinyin: 'gǒu', meaning: '狗 (Dog)', level: 2 },
  { char: '虎', pinyin: 'hǔ', meaning: '虎 (Tiger)', level: 2 },
  { char: '鸡', pinyin: 'jī', meaning: '鸡 (Chicken)', level: 2 },
  { char: '哭', pinyin: 'kū', meaning: '哭 (Cry)', level: 2 },
  { char: '立', pinyin: 'lì', meaning: '立 (Stand)', level: 2 },
  { char: '马', pinyin: 'mǎ', meaning: '马 (Horse)', level: 2 },
  { char: '猫', pinyin: 'māo', meaning: '猫 (Cat)', level: 2 },
  { char: '鸟', pinyin: 'niǎo', meaning: '鸟 (Bird)', level: 2 },
  { char: '牛', pinyin: 'niú', meaning: '牛 (Cow)', level: 2 },
  { char: '爬', pinyin: 'pá', meaning: '爬 (Crawl)', level: 2 },
  { char: '跑', pinyin: 'pǎo', meaning: '跑 (Run)', level: 2 },
  { char: '狮', pinyin: 'shī', meaning: '狮 (Lion)', level: 2 },
  { char: '跳', pinyin: 'tiào', meaning: '跳 (Jump)', level: 2 },
  { char: '兔', pinyin: 'tù', meaning: '兔 (Rabbit)', level: 3 },
  { char: '舞', pinyin: 'wǔ', meaning: '舞 (Dance)', level: 3 },
  { char: '象', pinyin: 'xiàng', meaning: '象 (Elephant)', level: 3 },
  { char: '笑', pinyin: 'xiào', meaning: '笑 (Laugh)', level: 3 },
  { char: '熊', pinyin: 'xióng', meaning: '熊 (Bear)', level: 3 },
  { char: '鸭', pinyin: 'yā', meaning: '鸭 (Duck)', level: 3 },
  { char: '羊', pinyin: 'yáng', meaning: '羊 (Sheep)', level: 3 },
  { char: '游', pinyin: 'yóu', meaning: '游 (Swim)', level: 3 },
  { char: '鱼', pinyin: 'yú', meaning: '鱼 (Fish)', level: 3 },
  { char: '猪', pinyin: 'zhū', meaning: '猪 (Pig)', level: 3 },
  { char: '走', pinyin: 'zǒu', meaning: '走 (Walk)', level: 3 },
  { char: '坐', pinyin: 'zuò', meaning: '坐 (Sit)', level: 3 },
  { char: '爸', pinyin: 'bà', meaning: '爸 (Dad)', level: 3 },
  { char: '弟', pinyin: 'dì', meaning: '弟 (Younger brother)', level: 3 },
  { char: '儿', pinyin: 'ér', meaning: '儿 (Son)', level: 3 },
  { char: '父', pinyin: 'fù', meaning: '父 (Father)', level: 3 },
  { char: '哥', pinyin: 'gē', meaning: '哥 (Brother)', level: 3 },
  { char: '姑', pinyin: 'gū', meaning: '姑 (Aunt)', level: 3 },
  { char: '孩', pinyin: 'hái', meaning: '孩 (Child)', level: 3 },
  { char: '姐', pinyin: 'jiě', meaning: '姐 (Sister)', level: 3 },
  { char: '舅', pinyin: 'jiù', meaning: '舅 (Maternal uncle)', level: 3 },
  { char: '老', pinyin: 'lǎo', meaning: '老 (Old)', level: 3 },
  { char: '妈', pinyin: 'mā', meaning: '妈 (Mom)', level: 3 },
  { char: '们', pinyin: 'men', meaning: '们 (Plural)', level: 3 },
  { char: '母', pinyin: 'mǔ', meaning: '母 (Mother)', level: 3 },
  { char: '奶', pinyin: 'nǎi', meaning: '奶 (Grandmother)', level: 3 },
  { char: '男', pinyin: 'nán', meaning: '男 (Male)', level: 3 },
  { char: '你', pinyin: 'nǐ', meaning: '你 (You)', level: 3 },
  { char: '女', pinyin: 'nǚ', meaning: '女 (Daughter)', level: 3 },
  { char: '朋', pinyin: 'péng', meaning: '朋 (Friend)', level: 3 },
  { char: '婶', pinyin: 'shěn', meaning: '婶 (Aunt)', level: 3 },
  { char: '甥', pinyin: 'shēng', meaning: '甥 (Niece)', level: 3 },
  { char: '师', pinyin: 'shī', meaning: '师 (Teacher)', level: 3 },
  { char: '叔', pinyin: 'shū', meaning: '叔 (Uncle)', level: 3 },
  { char: '他', pinyin: 'tā', meaning: '他 (He)', level: 3 },
  { char: '它', pinyin: 'tā', meaning: '它 (It)', level: 3 },
  { char: '她', pinyin: 'tā', meaning: '她 (She)', level: 3 },
  { char: '我', pinyin: 'wǒ', meaning: '我 (I/Me)', level: 3 },
  { char: '兄', pinyin: 'xiōng', meaning: '兄 (Brother)', level: 3 },
  { char: '爷', pinyin: 'yé', meaning: '爷 (Grandfather)', level: 3 },
  { char: '姨', pinyin: 'yí', meaning: '姨 (Aunt)', level: 3 },
  { char: '友', pinyin: 'yǒu', meaning: '友 (Friend)', level: 3 },
  { char: '侄', pinyin: 'zhí', meaning: '侄 (Nephew)', level: 3 },
  { char: '子', pinyin: 'zǐ', meaning: '子 (Child)', level: 3 },
  { char: '暗', pinyin: 'àn', meaning: '暗 (Dark)', level: 3 },
  { char: '白', pinyin: 'bái', meaning: '白 (White)', level: 3 },
  { char: '薄', pinyin: 'báo', meaning: '薄 (Thin)', level: 3 },
  { char: '彩', pinyin: 'cǎi', meaning: '彩 (Colorful)', level: 3 },
  { char: '橙', pinyin: 'chéng', meaning: '橙 (Orange)', level: 3 },
  { char: '淡', pinyin: 'dàn', meaning: '淡 (Light)', level: 3 },
  { char: '方', pinyin: 'fāng', meaning: '方 (Square)', level: 4 },
  { char: '粉', pinyin: 'fěn', meaning: '粉 (Pink)', level: 4 },
  { char: '黑', pinyin: 'hēi', meaning: '黑 (Black)', level: 4 },
  { char: '红', pinyin: 'hóng', meaning: '红 (Red)', level: 4 },
  { char: '厚', pinyin: 'hòu', meaning: '厚 (Thick)', level: 4 },
  { char: '黄', pinyin: 'huáng', meaning: '黄 (Yellow)', level: 4 },
  { char: '灰', pinyin: 'huī', meaning: '灰 (Gray)', level: 4 },
  { char: '金', pinyin: 'jīn', meaning: '金 (Gold)', level: 4 },
  { char: '宽', pinyin: 'kuān', meaning: '宽 (Wide)', level: 4 },
  { char: '蓝', pinyin: 'lán', meaning: '蓝 (Blue)', level: 4 },
  { char: '亮', pinyin: 'liàng', meaning: '亮 (Bright)', level: 4 },
  { char: '绿', pinyin: 'lǜ', meaning: '绿 (Green)', level: 4 },
  { char: '清', pinyin: 'qīng', meaning: '清 (Clear)', level: 4 },
  { char: '深', pinyin: 'shēn', meaning: '深 (Deep)', level: 4 },
  { char: '透', pinyin: 'tòu', meaning: '透 (Transparent)', level: 4 },
  { char: '艳', pinyin: 'yàn', meaning: '艳 (Bright)', level: 4 },
  { char: '银', pinyin: 'yín', meaning: '银 (Silver)', level: 4 },
  { char: '圆', pinyin: 'yuán', meaning: '圆 (Round)', level: 4 },
  { char: '窄', pinyin: 'zhǎi', meaning: '窄 (Narrow)', level: 4 },
  { char: '浊', pinyin: 'zhuó', meaning: '浊 (Turbid)', level: 4 },
  { char: '紫', pinyin: 'zǐ', meaning: '紫 (Purple)', level: 4 },
  { char: '棕', pinyin: 'zōng', meaning: '棕 (Brown)', level: 4 },
  { char: '菜', pinyin: 'cài', meaning: '菜 (Vegetable)', level: 4 },
  { char: '茶', pinyin: 'chá', meaning: '茶 (Tea)', level: 4 },
  { char: '蛋', pinyin: 'dàn', meaning: '蛋 (Egg)', level: 4 },
  { char: '豆', pinyin: 'dòu', meaning: '豆 (Bean)', level: 4 },
  { char: '饭', pinyin: 'fàn', meaning: '饭 (Rice meal)', level: 4 },
  { char: '瓜', pinyin: 'guā', meaning: '瓜 (Melon)', level: 4 },
  { char: '果', pinyin: 'guǒ', meaning: '果 (Fruit)', level: 4 },
  { char: '蕉', pinyin: 'jiāo', meaning: '蕉 (Banana)', level: 4 },
  { char: '酒', pinyin: 'jiǔ', meaning: '酒 (Wine)', level: 4 },
  { char: '梨', pinyin: 'lí', meaning: '梨 (Pear)', level: 4 },
  { char: '麦', pinyin: 'mài', meaning: '麦 (Wheat)', level: 4 },
  { char: '檬', pinyin: 'méng', meaning: '檬 (Lemon)', level: 4 },
  { char: '米', pinyin: 'mǐ', meaning: '米 (Rice)', level: 4 },
  { char: '面', pinyin: 'miàn', meaning: '面 (Noodles)', level: 4 },
  { char: '柠', pinyin: 'níng', meaning: '柠 (Lemon)', level: 4 },
  { char: '苹', pinyin: 'píng', meaning: '苹 (Apple)', level: 4 },
  { char: '葡', pinyin: 'pú', meaning: '葡 (Grape)', level: 4 },
  { char: '肉', pinyin: 'ròu', meaning: '肉 (Meat)', level: 4 },
  { char: '汤', pinyin: 'tāng', meaning: '汤 (Soup)', level: 4 },
  { char: '糖', pinyin: 'táng', meaning: '糖 (Sugar)', level: 4 },
  { char: '桃', pinyin: 'táo', meaning: '桃 (Peach)', level: 4 },
  { char: '萄', pinyin: 'táo', meaning: '萄 (Grape)', level: 4 },
  { char: '虾', pinyin: 'xiā', meaning: '虾 (Shrimp)', level: 4 },
  { char: '蟹', pinyin: 'xiè', meaning: '蟹 (Crab)', level: 4 },
  { char: '盐', pinyin: 'yán', meaning: '盐 (Salt)', level: 4 },
  { char: '油', pinyin: 'yóu', meaning: '油 (Oil)', level: 4 },
  { char: '柚', pinyin: 'yòu', meaning: '柚 (Pomelo)', level: 4 },
  { char: '晨', pinyin: 'chén', meaning: '晨 (Morning)', level: 4 },
  { char: '春', pinyin: 'chūn', meaning: '春 (Spring)', level: 5 },
  { char: '冬', pinyin: 'dōng', meaning: '冬 (Winter)', level: 5 },
  { char: '分', pinyin: 'fēn', meaning: '分 (Minute)', level: 5 },
  { char: '季', pinyin: 'jì', meaning: '季 (Season)', level: 5 },
  { char: '今', pinyin: 'jīn', meaning: '今 (Today)', level: 5 },
  { char: '刻', pinyin: 'kè', meaning: '刻 (Quarter)', level: 5 },
  { char: '秒', pinyin: 'miǎo', meaning: '秒 (Second)', level: 5 },
  { char: '明', pinyin: 'míng', meaning: '明 (Tomorrow)', level: 5 },
  { char: '年', pinyin: 'nián', meaning: '年 (Year)', level: 5 },
  { char: '秋', pinyin: 'qiū', meaning: '秋 (Autumn)', level: 5 },
  { char: '时', pinyin: 'shí', meaning: '时 (Time)', level: 5 },
  { char: '晚', pinyin: 'wǎn', meaning: '晚 (Late)', level: 5 },
  { char: '午', pinyin: 'wǔ', meaning: '午 (Noon)', level: 5 },
  { char: '夏', pinyin: 'xià', meaning: '夏 (Summer)', level: 5 },
  { char: '夜', pinyin: 'yè', meaning: '夜 (Night)', level: 5 },
  { char: '早', pinyin: 'zǎo', meaning: '早 (Early)', level: 5 },
  { char: '周', pinyin: 'zhōu', meaning: '周 (Week)', level: 5 },
  { char: '昨', pinyin: 'zuó', meaning: '昨 (Yesterday)', level: 5 },
  { char: '笔', pinyin: 'bǐ', meaning: '笔 (Pen)', level: 5 },
  { char: '表', pinyin: 'biǎo', meaning: '表 (Watch)', level: 5 },
  { char: '车', pinyin: 'chē', meaning: '车 (Car)', level: 5 },
  { char: '城', pinyin: 'chéng', meaning: '城 (City)', level: 5 },
  { char: '船', pinyin: 'chuán', meaning: '船 (Boat)', level: 5 },
  { char: '窗', pinyin: 'chuāng', meaning: '窗 (Window)', level: 5 },
  { char: '村', pinyin: 'cūn', meaning: '村 (Village)', level: 5 },
  { char: '灯', pinyin: 'dēng', meaning: '灯 (Light)', level: 5 },
  { char: '电', pinyin: 'diàn', meaning: '电 (Electricity)', level: 5 },
  { char: '房', pinyin: 'fáng', meaning: '房 (Room)', level: 5 },
  { char: '机', pinyin: 'jī', meaning: '机 (Machine)', level: 5 },
  { char: '街', pinyin: 'jiē', meaning: '街 (Street)', level: 5 },
  { char: '镜', pinyin: 'jìng', meaning: '镜 (Mirror)', level: 5 },
  { char: '路', pinyin: 'lù', meaning: '路 (Road)', level: 5 },
  { char: '门', pinyin: 'mén', meaning: '门 (Door)', level: 5 },
  { char: '桥', pinyin: 'qiáo', meaning: '桥 (Bridge)', level: 5 },
  { char: '书', pinyin: 'shū', meaning: '书 (Book)', level: 5 },
  { char: '屋', pinyin: 'wū', meaning: '屋 (House)', level: 5 },
  { char: '椅', pinyin: 'yǐ', meaning: '椅 (Chair)', level: 5 },
  { char: '钟', pinyin: 'zhōng', meaning: '钟 (Clock)', level: 5 },
  { char: '桌', pinyin: 'zhuō', meaning: '桌 (Desk)', level: 5 },
  { char: '爱', pinyin: 'ài', meaning: '爱 (Love)', level: 5 },
  { char: '吃', pinyin: 'chī', meaning: '吃 (Eat)', level: 5 },
  { char: '打', pinyin: 'dǎ', meaning: '打 (Hit)', level: 5 },
  { char: '读', pinyin: 'dú', meaning: '读 (Read)', level: 5 },
  { char: '放', pinyin: 'fàng', meaning: '放 (Put)', level: 5 },
  { char: '喝', pinyin: 'hē', meaning: '喝 (Drink)', level: 5 },
  { char: '画', pinyin: 'huà', meaning: '画 (Draw)', level: 5 },
  { char: '教', pinyin: 'jiāo', meaning: '教 (Teach)', level: 5 },
  { char: '看', pinyin: 'kàn', meaning: '看 (Look)', level: 5 },
  { char: '来', pinyin: 'lái', meaning: '来 (Come)', level: 5 },
  { char: '买', pinyin: 'mǎi', meaning: '买 (Buy)', level: 5 },
  { char: '卖', pinyin: 'mài', meaning: '卖 (Sell)', level: 6 },
  { char: '拿', pinyin: 'ná', meaning: '拿 (Take)', level: 6 },
  { char: '去', pinyin: 'qù', meaning: '去 (Go)', level: 6 },
  { char: '睡', pinyin: 'shuì', meaning: '睡 (Sleep)', level: 6 },
  { char: '说', pinyin: 'shuō', meaning: '说 (Speak)', level: 6 },
  { char: '听', pinyin: 'tīng', meaning: '听 (Listen)', level: 6 },
  { char: '想', pinyin: 'xiǎng', meaning: '想 (Think)', level: 6 },
  { char: '写', pinyin: 'xiě', meaning: '写 (Write)', level: 6 },
  { char: '学', pinyin: 'xué', meaning: '学 (Learn)', level: 6 },
  { char: '做', pinyin: 'zuò', meaning: '做 (Do)', level: 6 },
  { char: '在', pinyin: 'pinyin', meaning: '在 (Meaning)', level: 6 },
  { char: '有', pinyin: 'pinyin', meaning: '有 (Meaning)', level: 6 },
  { char: '和', pinyin: 'pinyin', meaning: '和 (Meaning)', level: 6 },
  { char: '这', pinyin: 'pinyin', meaning: '这 (Meaning)', level: 6 },
  { char: '为', pinyin: 'pinyin', meaning: '为 (Meaning)', level: 6 },
  { char: '以', pinyin: 'pinyin', meaning: '以 (Meaning)', level: 6 },
  { char: '要', pinyin: 'pinyin', meaning: '要 (Meaning)', level: 6 },
  { char: '用', pinyin: 'pinyin', meaning: '用 (Meaning)', level: 6 },
  { char: '生', pinyin: 'pinyin', meaning: '生 (Meaning)', level: 6 },
  { char: '到', pinyin: 'pinyin', meaning: '到 (Meaning)', level: 6 },
  { char: '作', pinyin: 'pinyin', meaning: '作 (Meaning)', level: 6 },
  { char: '于', pinyin: 'pinyin', meaning: '于 (Meaning)', level: 6 },
  { char: '出', pinyin: 'pinyin', meaning: '出 (Meaning)', level: 6 },
  { char: '就', pinyin: 'pinyin', meaning: '就 (Meaning)', level: 6 },
  { char: '对', pinyin: 'pinyin', meaning: '对 (Meaning)', level: 6 },
  { char: '成', pinyin: 'pinyin', meaning: '成 (Meaning)', level: 6 },
  { char: '会', pinyin: 'pinyin', meaning: '会 (Meaning)', level: 6 },
  { char: '可', pinyin: 'pinyin', meaning: '可 (Meaning)', level: 6 },
  { char: '主', pinyin: 'pinyin', meaning: '主 (Meaning)', level: 6 },
  { char: '动', pinyin: 'pinyin', meaning: '动 (Meaning)', level: 6 },
  { char: '同', pinyin: 'pinyin', meaning: '同 (Meaning)', level: 6 },
  { char: '工', pinyin: 'pinyin', meaning: '工 (Meaning)', level: 6 },
  { char: '也', pinyin: 'pinyin', meaning: '也 (Meaning)', level: 6 },
  { char: '能', pinyin: 'pinyin', meaning: '能 (Meaning)', level: 6 },
  { char: '过', pinyin: 'pinyin', meaning: '过 (Meaning)', level: 6 },
  { char: '产', pinyin: 'pinyin', meaning: '产 (Meaning)', level: 6 },
  { char: '种', pinyin: 'pinyin', meaning: '种 (Meaning)', level: 6 },
  { char: '而', pinyin: 'pinyin', meaning: '而 (Meaning)', level: 6 },
  { char: '定', pinyin: 'pinyin', meaning: '定 (Meaning)', level: 6 },
  { char: '行', pinyin: 'pinyin', meaning: '行 (Meaning)', level: 6 },
  { char: '法', pinyin: 'pinyin', meaning: '法 (Meaning)', level: 6 },
  { char: '所', pinyin: 'pinyin', meaning: '所 (Meaning)', level: 6 },
  { char: '民', pinyin: 'pinyin', meaning: '民 (Meaning)', level: 6 },
  { char: '得', pinyin: 'pinyin', meaning: '得 (Meaning)', level: 6 },
  { char: '经', pinyin: 'pinyin', meaning: '经 (Meaning)', level: 6 },
  { char: '之', pinyin: 'pinyin', meaning: '之 (Meaning)', level: 6 },
  { char: '进', pinyin: 'pinyin', meaning: '进 (Meaning)', level: 6 },
  { char: '着', pinyin: 'pinyin', meaning: '着 (Meaning)', level: 6 },
  { char: '等', pinyin: 'pinyin', meaning: '等 (Meaning)', level: 6 },
  { char: '部', pinyin: 'pinyin', meaning: '部 (Meaning)', level: 6 },
  { char: '度', pinyin: 'pinyin', meaning: '度 (Meaning)', level: 7 },
  { char: '家', pinyin: 'pinyin', meaning: '家 (Meaning)', level: 7 },
  { char: '力', pinyin: 'pinyin', meaning: '力 (Meaning)', level: 7 },
  { char: '如', pinyin: 'pinyin', meaning: '如 (Meaning)', level: 7 },
  { char: '化', pinyin: 'pinyin', meaning: '化 (Meaning)', level: 7 },
  { char: '自', pinyin: 'pinyin', meaning: '自 (Meaning)', level: 7 },
  { char: '理', pinyin: 'pinyin', meaning: '理 (Meaning)', level: 7 },
  { char: '起', pinyin: 'pinyin', meaning: '起 (Meaning)', level: 7 },
  { char: '物', pinyin: 'pinyin', meaning: '物 (Meaning)', level: 7 },
  { char: '现', pinyin: 'pinyin', meaning: '现 (Meaning)', level: 7 },
  { char: '实', pinyin: 'pinyin', meaning: '实 (Meaning)', level: 7 },
  { char: '加', pinyin: 'pinyin', meaning: '加 (Meaning)', level: 7 },
  { char: '量', pinyin: 'pinyin', meaning: '量 (Meaning)', level: 7 },
  { char: '都', pinyin: 'pinyin', meaning: '都 (Meaning)', level: 7 },
  { char: '两', pinyin: 'pinyin', meaning: '两 (Meaning)', level: 7 },
  { char: '体', pinyin: 'pinyin', meaning: '体 (Meaning)', level: 7 },
  { char: '制', pinyin: 'pinyin', meaning: '制 (Meaning)', level: 7 },
  { char: '当', pinyin: 'pinyin', meaning: '当 (Meaning)', level: 7 },
  { char: '使', pinyin: 'pinyin', meaning: '使 (Meaning)', level: 7 },
  { char: '点', pinyin: 'pinyin', meaning: '点 (Meaning)', level: 7 },
  { char: '从', pinyin: 'pinyin', meaning: '从 (Meaning)', level: 7 },
  { char: '业', pinyin: 'pinyin', meaning: '业 (Meaning)', level: 7 },
  { char: '本', pinyin: 'pinyin', meaning: '本 (Meaning)', level: 7 },
  { char: '把', pinyin: 'pinyin', meaning: '把 (Meaning)', level: 7 },
  { char: '性', pinyin: 'pinyin', meaning: '性 (Meaning)', level: 7 },
  { char: '应', pinyin: 'pinyin', meaning: '应 (Meaning)', level: 7 },
  { char: '开', pinyin: 'pinyin', meaning: '开 (Meaning)', level: 7 },
  { char: '合', pinyin: 'pinyin', meaning: '合 (Meaning)', level: 7 },
  { char: '还', pinyin: 'pinyin', meaning: '还 (Meaning)', level: 7 },
  { char: '因', pinyin: 'pinyin', meaning: '因 (Meaning)', level: 7 },
  { char: '由', pinyin: 'pinyin', meaning: '由 (Meaning)', level: 7 },
  { char: '其', pinyin: 'pinyin', meaning: '其 (Meaning)', level: 7 },
  { char: '些', pinyin: 'pinyin', meaning: '些 (Meaning)', level: 7 },
  { char: '然', pinyin: 'pinyin', meaning: '然 (Meaning)', level: 7 },
  { char: '政', pinyin: 'pinyin', meaning: '政 (Meaning)', level: 7 },
  { char: '那', pinyin: 'pinyin', meaning: '那 (Meaning)', level: 7 },
  { char: '社', pinyin: 'pinyin', meaning: '社 (Meaning)', level: 7 },
  { char: '义', pinyin: 'pinyin', meaning: '义 (Meaning)', level: 7 },
  { char: '事', pinyin: 'pinyin', meaning: '事 (Meaning)', level: 7 },
  { char: '平', pinyin: 'pinyin', meaning: '平 (Meaning)', level: 7 },
  { char: '形', pinyin: 'pinyin', meaning: '形 (Meaning)', level: 7 },
  { char: '相', pinyin: 'pinyin', meaning: '相 (Meaning)', level: 7 },
  { char: '全', pinyin: 'pinyin', meaning: '全 (Meaning)', level: 7 },
  { char: '样', pinyin: 'pinyin', meaning: '样 (Meaning)', level: 7 },
  { char: '与', pinyin: 'pinyin', meaning: '与 (Meaning)', level: 7 },
  { char: '关', pinyin: 'pinyin', meaning: '关 (Meaning)', level: 7 },
  { char: '各', pinyin: 'pinyin', meaning: '各 (Meaning)', level: 7 },
  { char: '共', pinyin: 'pinyin', meaning: '共 (Meaning)', level: 7 },
  { char: '线', pinyin: 'pinyin', meaning: '线 (Meaning)', level: 7 },
  { char: '治', pinyin: 'pinyin', meaning: '治 (Meaning)', level: 7 },
  { char: '活', pinyin: 'pinyin', meaning: '活 (Meaning)', level: 8 },
  { char: '据', pinyin: 'pinyin', meaning: '据 (Meaning)', level: 8 },
  { char: '处', pinyin: 'pinyin', meaning: '处 (Meaning)', level: 8 },
  { char: '队', pinyin: 'pinyin', meaning: '队 (Meaning)', level: 8 },
  { char: '给', pinyin: 'pinyin', meaning: '给 (Meaning)', level: 8 },
  { char: '色', pinyin: 'pinyin', meaning: '色 (Meaning)', level: 8 },
  { char: '即', pinyin: 'pinyin', meaning: '即 (Meaning)', level: 8 },
  { char: '保', pinyin: 'pinyin', meaning: '保 (Meaning)', level: 8 },
  { char: '造', pinyin: 'pinyin', meaning: '造 (Meaning)', level: 8 },
  { char: '规', pinyin: 'pinyin', meaning: '规 (Meaning)', level: 8 },
  { char: '热', pinyin: 'pinyin', meaning: '热 (Meaning)', level: 8 },
  { char: '领', pinyin: 'pinyin', meaning: '领 (Meaning)', level: 8 },
  { char: '思', pinyin: 'pinyin', meaning: '思 (Meaning)', level: 8 },
  { char: '改', pinyin: 'pinyin', meaning: '改 (Meaning)', level: 8 },
  { char: '导', pinyin: 'pinyin', meaning: '导 (Meaning)', level: 8 },
  { char: '组', pinyin: 'pinyin', meaning: '组 (Meaning)', level: 8 },
  { char: '林', pinyin: 'pinyin', meaning: '林 (Meaning)', level: 8 },
  { char: '农', pinyin: 'pinyin', meaning: '农 (Meaning)', level: 8 },
  { char: '器', pinyin: 'pinyin', meaning: '器 (Meaning)', level: 8 },
  { char: '入', pinyin: 'pinyin', meaning: '入 (Meaning)', level: 8 },
  { char: '员', pinyin: 'pinyin', meaning: '员 (Meaning)', level: 8 },
  { char: '单', pinyin: 'pinyin', meaning: '单 (Meaning)', level: 8 },
  { char: '位', pinyin: 'pinyin', meaning: '位 (Meaning)', level: 8 },
  { char: '己', pinyin: 'pinyin', meaning: '己 (Meaning)', level: 8 },
  { char: '技', pinyin: 'pinyin', meaning: '技 (Meaning)', level: 8 },
  { char: '术', pinyin: 'pinyin', meaning: '术 (Meaning)', level: 8 },
  { char: '才', pinyin: 'pinyin', meaning: '才 (Meaning)', level: 8 },
  { char: '向', pinyin: 'pinyin', meaning: '向 (Meaning)', level: 8 },
  { char: '话', pinyin: 'pinyin', meaning: '话 (Meaning)', level: 8 },
  { char: '军', pinyin: 'pinyin', meaning: '军 (Meaning)', level: 8 },
  { char: '报', pinyin: 'pinyin', meaning: '报 (Meaning)', level: 8 },
  { char: '气', pinyin: 'pinyin', meaning: '气 (Meaning)', level: 8 },
  { char: '先', pinyin: 'pinyin', meaning: '先 (Meaning)', level: 8 },
  { char: '真', pinyin: 'pinyin', meaning: '真 (Meaning)', level: 8 },
  { char: '此', pinyin: 'pinyin', meaning: '此 (Meaning)', level: 8 },
  { char: '乐', pinyin: 'pinyin', meaning: '乐 (Meaning)', level: 8 },
  { char: '件', pinyin: 'pinyin', meaning: '件 (Meaning)', level: 8 },
  { char: '指', pinyin: 'pinyin', meaning: '指 (Meaning)', level: 8 },
  { char: '变', pinyin: 'pinyin', meaning: '变 (Meaning)', level: 8 },
  { char: '道', pinyin: 'pinyin', meaning: '道 (Meaning)', level: 8 },
  { char: '战', pinyin: 'pinyin', meaning: '战 (Meaning)', level: 8 },
  { char: '文', pinyin: 'pinyin', meaning: '文 (Meaning)', level: 8 },
  { char: '运', pinyin: 'pinyin', meaning: '运 (Meaning)', level: 8 },
  { char: '再', pinyin: 'pinyin', meaning: '再 (Meaning)', level: 8 },
  { char: '怎', pinyin: 'pinyin', meaning: '怎 (Meaning)', level: 8 },
  { char: '展', pinyin: 'pinyin', meaning: '展 (Meaning)', level: 8 },
  { char: '代', pinyin: 'pinyin', meaning: '代 (Meaning)', level: 8 },
  { char: '建', pinyin: 'pinyin', meaning: '建 (Meaning)', level: 8 },
  { char: '设', pinyin: 'pinyin', meaning: '设 (Meaning)', level: 8 },
  { char: '革', pinyin: 'pinyin', meaning: '革 (Meaning)', level: 8 },
  { char: '总', pinyin: 'pinyin', meaning: '总 (Meaning)', level: 9 },
  { char: '计', pinyin: 'pinyin', meaning: '计 (Meaning)', level: 9 },
  { char: '邓', pinyin: 'pinyin', meaning: '邓 (Meaning)', level: 9 },
  { char: '志', pinyin: 'pinyin', meaning: '志 (Meaning)', level: 9 },
  { char: '党', pinyin: 'pinyin', meaning: '党 (Meaning)', level: 9 },
  { char: '初', pinyin: 'pinyin', meaning: '初 (Meaning)', level: 9 },
  { char: '级', pinyin: 'pinyin', meaning: '级 (Meaning)', level: 9 },
  { char: '阶', pinyin: 'pinyin', meaning: '阶 (Meaning)', level: 9 },
  { char: '段', pinyin: 'pinyin', meaning: '段 (Meaning)', level: 9 },
  { char: '基', pinyin: 'pinyin', meaning: '基 (Meaning)', level: 9 },
  { char: '团', pinyin: 'pinyin', meaning: '团 (Meaning)', level: 9 },
  { char: '结', pinyin: 'pinyin', meaning: '结 (Meaning)', level: 9 },
  { char: '族', pinyin: 'pinyin', meaning: '族 (Meaning)', level: 9 },
  { char: '济', pinyin: 'pinyin', meaning: '济 (Meaning)', level: 9 },
  { char: '坚', pinyin: 'pinyin', meaning: '坚 (Meaning)', level: 9 },
  { char: '持', pinyin: 'pinyin', meaning: '持 (Meaning)', level: 9 },
  { char: '项', pinyin: 'pinyin', meaning: '项 (Meaning)', level: 9 },
  { char: '原', pinyin: 'pinyin', meaning: '原 (Meaning)', level: 9 },
  { char: '则', pinyin: 'pinyin', meaning: '则 (Meaning)', level: 9 },
  { char: '更', pinyin: 'pinyin', meaning: '更 (Meaning)', level: 9 },
  { char: '艰', pinyin: 'pinyin', meaning: '艰 (Meaning)', level: 9 },
  { char: '苦', pinyin: 'pinyin', meaning: '苦 (Meaning)', level: 9 },
  { char: '创', pinyin: 'pinyin', meaning: '创 (Meaning)', level: 9 },
  { char: '富', pinyin: 'pinyin', meaning: '富 (Meaning)', level: 9 },
  { char: '强', pinyin: 'pinyin', meaning: '强 (Meaning)', level: 9 },
  { char: '奋', pinyin: 'pinyin', meaning: '奋 (Meaning)', level: 9 },
  { char: '斗', pinyin: 'pinyin', meaning: '斗 (Meaning)', level: 9 },
  { char: '牢', pinyin: 'pinyin', meaning: '牢 (Meaning)', level: 9 },
  { char: '握', pinyin: 'pinyin', meaning: '握 (Meaning)', level: 9 },
  { char: '抓', pinyin: 'pinyin', meaning: '抓 (Meaning)', level: 9 },
  { char: '硬', pinyin: 'pinyin', meaning: '硬 (Meaning)', level: 9 },
  { char: '针', pinyin: 'pinyin', meaning: '针 (Meaning)', level: 9 },
  { char: '推', pinyin: 'pinyin', meaning: '推 (Meaning)', level: 9 },
  { char: '步', pinyin: 'pinyin', meaning: '步 (Meaning)', level: 9 },
  { char: '精', pinyin: 'pinyin', meaning: '精 (Meaning)', level: 9 },
  { char: '神', pinyin: 'pinyin', meaning: '神 (Meaning)', level: 9 },
  { char: '提', pinyin: 'pinyin', meaning: '提 (Meaning)', level: 9 },
  { char: '德', pinyin: 'pinyin', meaning: '德 (Meaning)', level: 9 },
  { char: '素', pinyin: 'pinyin', meaning: '素 (Meaning)', level: 9 },
  { char: '质', pinyin: 'pinyin', meaning: '质 (Meaning)', level: 9 },
  { char: '科', pinyin: 'pinyin', meaning: '科 (Meaning)', level: 9 },
  { char: '供', pinyin: 'pinyin', meaning: '供 (Meaning)', level: 9 },
  { char: '证', pinyin: 'pinyin', meaning: '证 (Meaning)', level: 9 },
  { char: '智', pinyin: 'pinyin', meaning: '智 (Meaning)', level: 9 },
  { char: '支', pinyin: 'pinyin', meaning: '支 (Meaning)', level: 9 },
  { char: '必', pinyin: 'pinyin', meaning: '必 (Meaning)', level: 9 },
  { char: '须', pinyin: 'pinyin', meaning: '须 (Meaning)', level: 9 },
  { char: '求', pinyin: 'pinyin', meaning: '求 (Meaning)', level: 9 },
  { char: '切', pinyin: 'pinyin', meaning: '切 (Meaning)', level: 9 },
  { char: '际', pinyin: 'pinyin', meaning: '际 (Meaning)', level: 9 },
  { char: '论', pinyin: 'pinyin', meaning: '论 (Meaning)', level: 10 },
  { char: '联', pinyin: 'pinyin', meaning: '联 (Meaning)', level: 10 },
  { char: '系', pinyin: 'pinyin', meaning: '系 (Meaning)', level: 10 },
  { char: '践', pinyin: 'pinyin', meaning: '践 (Meaning)', level: 10 },
  { char: '检', pinyin: 'pinyin', meaning: '检 (Meaning)', level: 10 },
  { char: '验', pinyin: 'pinyin', meaning: '验 (Meaning)', level: 10 },
  { char: '群', pinyin: 'pinyin', meaning: '群 (Meaning)', level: 10 },
  { char: '众', pinyin: 'pinyin', meaning: '众 (Meaning)', level: 10 },
  { char: '密', pinyin: 'pinyin', meaning: '密 (Meaning)', level: 10 },
  { char: '倾', pinyin: 'pinyin', meaning: '倾 (Meaning)', level: 10 },
  { char: '呼', pinyin: 'pinyin', meaning: '呼 (Meaning)', level: 10 },
  { char: '声', pinyin: 'pinyin', meaning: '声 (Meaning)', level: 10 },
  { char: '疾', pinyin: 'pinyin', meaning: '疾 (Meaning)', level: 10 },
  { char: '办', pinyin: 'pinyin', meaning: '办 (Meaning)', level: 10 },
  { char: '解', pinyin: 'pinyin', meaning: '解 (Meaning)', level: 10 },
  { char: '决', pinyin: 'pinyin', meaning: '决 (Meaning)', level: 10 },
  { char: '问', pinyin: 'pinyin', meaning: '问 (Meaning)', level: 10 },
  { char: '题', pinyin: 'pinyin', meaning: '题 (Meaning)', level: 10 },
  { char: '集', pinyin: 'pinyin', meaning: '集 (Meaning)', level: 10 },
  { char: '充', pinyin: 'pinyin', meaning: '充 (Meaning)', level: 10 },
  { char: '扬', pinyin: 'pinyin', meaning: '扬 (Meaning)', level: 10 },
  { char: '内', pinyin: 'pinyin', meaning: '内 (Meaning)', level: 10 },
  { char: '障', pinyin: 'pinyin', meaning: '障 (Meaning)', level: 10 },
  { char: '权', pinyin: 'pinyin', meaning: '权 (Meaning)', level: 10 },
  { char: '利', pinyin: 'pinyin', meaning: '利 (Meaning)', level: 10 },
  { char: '统', pinyin: 'pinyin', meaning: '统 (Meaning)', level: 10 },
  { char: '执', pinyin: 'pinyin', meaning: '执 (Meaning)', level: 10 },
  { char: '断', pinyin: 'pinyin', meaning: '断 (Meaning)', level: 10 },
  { char: '增', pinyin: 'pinyin', meaning: '增 (Meaning)', level: 10 },
  { char: '凝', pinyin: 'pinyin', meaning: '凝 (Meaning)', level: 10 },
  { char: '聚', pinyin: 'pinyin', meaning: '聚 (Meaning)', level: 10 },
  { char: '始', pinyin: 'pinyin', meaning: '始 (Meaning)', level: 10 },
  { char: '终', pinyin: 'pinyin', meaning: '终 (Meaning)', level: 10 },
  { char: '特', pinyin: 'pinyin', meaning: '特 (Meaning)', level: 10 },
  { char: '核', pinyin: 'pinyin', meaning: '核 (Meaning)', level: 10 },
  { char: '完', pinyin: 'pinyin', meaning: '完 (Meaning)', level: 10 },
  { char: '善', pinyin: 'pinyin', meaning: '善 (Meaning)', level: 10 },
  { char: '独', pinyin: 'pinyin', meaning: '独 (Meaning)', level: 10 },
  { char: '交', pinyin: 'pinyin', meaning: '交 (Meaning)', level: 10 },
  { char: '策', pinyin: 'pinyin', meaning: '策 (Meaning)', level: 10 },
  { char: '构', pinyin: 'pinyin', meaning: '构 (Meaning)', level: 10 },
  { char: '类', pinyin: 'pinyin', meaning: '类 (Meaning)', level: 10 },
  { char: '命', pinyin: 'pinyin', meaning: '命 (Meaning)', level: 10 },
  { char: '环', pinyin: 'pinyin', meaning: '环 (Meaning)', level: 10 },
  { char: '境', pinyin: 'pinyin', meaning: '境 (Meaning)', level: 10 },
  { char: '记', pinyin: 'pinyin', meaning: '记 (Meaning)', level: 10 },
  { char: '意', pinyin: 'pinyin', meaning: '意 (Meaning)', level: 10 },
  { char: '服', pinyin: 'pinyin', meaning: '服 (Meaning)', level: 10 },
  { char: '务', pinyin: 'pinyin', meaning: '务 (Meaning)', level: 10 },
  { char: '根', pinyin: 'pinyin', meaning: '根 (Meaning)', level: 10 }
];;;


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
    const m = masteryMap.value[item.char] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    return (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5) || (m.todayAttempts >= 6 && todayAcc < 0.35)
  }).length
  return Math.round((exhausted / all.length) * 100)
})

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
  startTime.value = Date.now()
  nextTick(() => {
    initChart()
  })
})

const rebuildMastery = () => {
  const map = {}
  hanziBank.forEach(h => {
    map[h.char] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
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
  const duration = Date.now() - startTime.value
  lastDuration.value = duration
  const char = currentLevelList.value[currentIndex.value].char
  const record = { char, timestamp: new Date().toISOString(), correct: isCorrect, duration }
  
  history.value.push(record)
  localStorage.setItem('hanzi_learning_history', JSON.stringify(history.value))
  
  if (!masteryMap.value[char]) {
    masteryMap.value[char] = { totalAttempts: 0, totalCorrect: 0, consecutiveCorrect: 0, lastSeen: null, todayAttempts: 0, todayCorrect: 0, avgDuration: 0 }
  }
  const m = masteryMap.value[char]

  m.totalAttempts++
  m.lastSeen = record.timestamp
  
  if (isCorrect) {
    m.avgDuration = m.avgDuration === 0 ? duration : (m.avgDuration * 0.7 + duration * 0.3)
    m.totalCorrect++
    m.consecutiveCorrect++
    m.todayCorrect++
    streak.value++
    missedQueue.value = missedQueue.value.filter(c => c !== char)
  } else {
    m.consecutiveCorrect = 0
    streak.value = 0
    if (!missedQueue.value.includes(char)) {
      missedQueue.value.push(char)
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
    nextHanzi()
    startTime.value = Date.now() // Reset timer for next question
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
  
  // Detect global exhaustion for the day (skip too easy or too hard)
  const exhaustedPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.char] || { todayAttempts: 0, todayCorrect: 0, consecutiveCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    
    // 已经学会了（今日掌握或长期掌握）
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
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
    const targetChar = missedQueue.value[0]
    const m = masteryMap.value[targetChar] || { todayAttempts: 0, todayCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    
    // 如果该错题已经处于“气馁”状态，将其移出队列
    if (isTooHard) {
        missedQueue.value = missedQueue.value.filter(c => c !== targetChar)
    } else {
        const targetIdx = allAvailable.findIndex(h => h.char === targetChar)
        if (targetIdx !== -1 && !recentHistory.value.includes(targetIdx)) {
          currentIndex.value = targetIdx
          selectionReason.value = '克服困难'
          return
        }
    }
  }

  // Define Working Window
  const remainingPool = allAvailable.filter(item => {
    const m = masteryMap.value[item.char] || { todayAttempts: 0, todayCorrect: 0, consecutiveCorrect: 0 }
    const todayAcc = m.todayAttempts > 0 ? m.todayCorrect / m.todayAttempts : 1
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)
    return !isMastered && !isTooHard
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
    const isMastered = (m.todayAttempts >= 3 && todayAcc >= 1.0) || (m.consecutiveCorrect >= 5)
    const isTooHard = (m.todayAttempts >= 5 && todayAcc <= 0.2) || (m.todayAttempts >= 8 && todayAcc < 0.4)

    if (isMastered) return { index, weight: 0, reason: '学会了' }
    if (isTooHard) return { index, weight: 0, reason: '暂缓' }

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
    const m = masteryMap.value[allAvailable[w.index].char] || {}
    let boost = 1

    // Ebbinghaus Urgency
    if (m.lastSeen) {
      const hoursSince = (new Date() - new Date(m.lastSeen)) / (1000 * 3600)
      boost += Math.min(5, hoursSince / 12) // Faster decay for Hanzi
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