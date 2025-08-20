/**
 * 常量定义文件
 * 统一管理系统中使用的常量值
 */

// 存储相关常量
const STORAGE_KEYS = {
    // 语文模块
    CHINESE_PRACTICE_DATA: 'chinesePracticeData',
    CHINESE_SORT_SETTINGS: 'chineseSortSettings',
    CHINESE_CHARACTERS_DAILY_LIMIT: 'chineseCharactersDailyLimit',
    CHINESE_IDIOMS_DAILY_LIMIT: 'chineseIdiomsDailyLimit',

    // 英语模块
    ENGLISH_PRACTICE_DATA: 'englishPracticeData',
    ENGLISH_SORT_SETTINGS: 'englishSortSettings',
    ENGLISH_DAILY_LIMIT: 'englishDailyLimit',

    // 数学模块
    MATH_PRACTICE_DATA: 'mathPracticeData',
    MATH_SORT_SETTINGS: 'mathSortSettings',
    MATH_DAILY_LIMIT: 'mathDailyLimit'
};

// 学习相关常量
const LEARNING_CONSTANTS = {
    // 艾宾浩斯记忆法复习间隔（分钟）
    REVIEW_INTERVALS: [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200],

    // 每日学习量默认值
    DEFAULT_DAILY_LIMIT: 20,

    // 限制范围
    MIN_DAILY_LIMIT: 1,
    MAX_DAILY_LIMIT: 100
};

// UI相关常量
const UI_CONSTANTS = {
    // 反馈显示时间（毫秒）
    FEEDBACK_DISPLAY_TIME: 1000,

    // 按钮状态
    BUTTON_STATES: {
        NORMAL: 'normal',
        DISABLED: 'disabled',
        LOADING: 'loading'
    },

    // CSS类名
    CSS_CLASSES: {
        CORRECT: 'correct',
        WRONG: 'wrong',
        ACTIVE: 'active',
        DISABLED: 'disabled',
        ASCENDING: 'ascending',
        DESCENDING: 'descending'
    }
};

// 模块类型
const MODULE_TYPES = {
    CHINESE: 'chinese',
    ENGLISH: 'english',
    MATH: 'math',
    GAME: 'game'
};

// 错误消息
const ERROR_MESSAGES = {
    INVALID_DAILY_LIMIT: '请输入1-100之间的数字',
    LOAD_FAILED: '加载失败，请刷新页面重试',
    SAVE_FAILED: '保存数据失败，请刷新页面重试',
    NEXT_QUESTION_FAILED: '加载下一题失败，请刷新页面重试'
};

// 导出常量
window.STORAGE_KEYS = STORAGE_KEYS;
window.LEARNING_CONSTANTS = LEARNING_CONSTANTS;
window.UI_CONSTANTS = UI_CONSTANTS;
window.MODULE_TYPES = MODULE_TYPES;
window.ERROR_MESSAGES = ERROR_MESSAGES;