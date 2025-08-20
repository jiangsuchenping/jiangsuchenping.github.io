/**
 * 首页JavaScript文件
 * 负责首页的交互逻辑和进度显示
 */

// 存储键常量
const HOME_STORAGE_KEYS = {
    CHINESE_CHARS_PROGRESS: 'chinese_chars_progress',
    CHINESE_IDIOMS_PROGRESS: 'chinese_idioms_progress',
    MATH_PRACTICE_PROGRESS: 'math_practice_progress',
    ENGLISH_VOCABULARY_PROGRESS: 'english_vocabulary_progress',
    SCIENCE_EXPLORATION_PROGRESS: 'science_exploration_progress',
    ART_CREATIVITY_PROGRESS: 'art_creativity_progress',
    PHYSICAL_ACTIVITY_PROGRESS: 'physical_activity_progress'
};

// 每日目标设置
const DAILY_GOALS = {
    CHINESE_CHARS: 10,
    CHINESE_IDIOMS: 5,
    MATH_PRACTICE: 20,
    ENGLISH_VOCABULARY: 15,
    SCIENCE_EXPLORATION: 3,
    ART_CREATIVITY: 30,
    PHYSICAL_ACTIVITY: 15
};

/**
 * 初始化首页
 */
function initHomePage() {
    loadAllProgress();
    setupEventListeners();
    animateSections();
}

/**
 * 加载所有学习进度
 */
function loadAllProgress() {
    const progressMap = {
        'chinese-char-progress': { key: HOME_STORAGE_KEYS.CHINESE_CHARS_PROGRESS, goal: DAILY_GOALS.CHINESE_CHARS },
        'chinese-idiom-progress': { key: HOME_STORAGE_KEYS.CHINESE_IDIOMS_PROGRESS, goal: DAILY_GOALS.CHINESE_IDIOMS },
        'math-practice-progress': { key: HOME_STORAGE_KEYS.MATH_PRACTICE_PROGRESS, goal: DAILY_GOALS.MATH_PRACTICE },
        'english-vocabulary-progress': { key: HOME_STORAGE_KEYS.ENGLISH_VOCABULARY_PROGRESS, goal: DAILY_GOALS.ENGLISH_VOCABULARY },
        'science-exploration-progress': { key: HOME_STORAGE_KEYS.SCIENCE_EXPLORATION_PROGRESS, goal: DAILY_GOALS.SCIENCE_EXPLORATION },
        'art-creativity-progress': { key: HOME_STORAGE_KEYS.ART_CREATIVITY_PROGRESS, goal: DAILY_GOALS.ART_CREATIVITY },
        'physical-activity-progress': { key: HOME_STORAGE_KEYS.PHYSICAL_ACTIVITY_PROGRESS, goal: DAILY_GOALS.PHYSICAL_ACTIVITY }
    };

    Object.keys(progressMap).forEach(elementId => {
        const { key, goal } = progressMap[elementId];
        const progress = loadProgress(key, goal);
        updateProgressBar(elementId, progress);
    });
}

/**
 * 从本地存储加载进度
 * @param {string} key - 存储键
 * @param {number} goal - 每日目标
 * @returns {number} - 进度百分比
 */
function loadProgress(key, goal) {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    const todayCount = data[today] || 0;
    return Math.min((todayCount / goal) * 100, 100);
}

/**
 * 更新进度条显示
 * @param {string} elementId - 元素ID
 * @param {number} percentage - 进度百分比
 */
function updateProgressBar(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        
        // 添加颜色变化
        if (percentage >= 100) {
            progressBar.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
        } else if (percentage >= 75) {
            progressBar.style.background = 'linear-gradient(90deg, #ffc107, #fd7e14)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
        }
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 为功能卡片添加悬停效果
    const cards = document.querySelectorAll('.function-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 页面可见时刷新进度
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            loadAllProgress();
        }
    });

    // 窗口获得焦点时刷新进度
    window.addEventListener('focus', loadAllProgress);
}

/**
 * 添加区域动画效果
 */
function animateSections() {
    const sections = document.querySelectorAll('.subject-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 显示关于对话框
 */
function showAbout() {
    const aboutHtml = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <h2>关于儿童学习乐园</h2>
                <p>这是一个专为儿童设计的综合性学习平台，提供语文、数学、英语、科学、艺术、体育等多学科的学习内容。</p>
                <p>我们的目标是让学习变得有趣，让孩子们在快乐中成长。</p>
                <button class="btn btn-primary" onclick="closeModal()">关闭</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', aboutHtml);
}

/**
 * 显示帮助对话框
 */
function showHelp() {
    const helpHtml = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <h2>使用帮助</h2>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>点击任意功能卡片即可开始学习</li>
                    <li>进度条显示今日学习完成情况</li>
                    <li>完成每日目标可获得成就奖励</li>
                    <li>学习记录会自动保存到本地</li>
                </ul>
                <button class="btn btn-primary" onclick="closeModal()">关闭</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', helpHtml);
}

/**
 * 显示设置对话框
 */
function showSettings() {
    const settingsHtml = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <h2>设置</h2>
                <div class="form-group">
                    <label>每日学习目标设置</label>
                    <p style="font-size: 0.9rem; color: #666;">
                        每日目标可在各个学习页面单独设置
                    </p>
                </div>
                <button class="btn btn-primary" onclick="closeModal()">关闭</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', settingsHtml);
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

/**
 * 增加学习进度
 * @param {string} key - 存储键
 * @param {number} count - 增加的计数
 */
function incrementProgress(key, count = 1) {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (!data[today]) {
        data[today] = 0;
    }
    
    data[today] += count;
    localStorage.setItem(key, JSON.stringify(data));
    
    // 刷新首页进度
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        loadAllProgress();
    }
}

/**
 * 获取今日进度
 * @param {string} key - 存储键
 * @returns {number} - 今日完成数量
 */
function getTodayProgress(key) {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return data[today] || 0;
}

/**
 * 获取每日目标
 * @param {string} type - 学习类型
 * @returns {number} - 每日目标
 */
function getDailyGoal(type) {
    return DAILY_GOALS[type] || 10;
}

// 添加CSS样式
const modalStyles = `
    <style>
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-content h2 {
            margin-bottom: 1rem;
            color: #333;
        }
        
        .modal-content p {
            margin-bottom: 1rem;
            color: #666;
            line-height: 1.6;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
`;

// 添加样式到页面
if (!document.querySelector('#modal-styles')) {
    document.head.insertAdjacentHTML('beforeend', modalStyles.replace('<style>', '<style id="modal-styles">'));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        initHomePage();
    }
});

// 导出全局函数供其他页面使用
window.HomeUtils = {
    incrementProgress,
    getTodayProgress,
    getDailyGoal,
    loadAllProgress
};