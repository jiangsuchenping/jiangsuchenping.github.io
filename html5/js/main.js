// 全局变量
let currentGame = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航菜单
    initializeNavigation();
    // 初始化游戏列表
    initializeGameList();
});

// 初始化导航菜单
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.getAttribute('data-module');
            showModule(module);
        });
    });

    // 初始化CTA按钮
    const ctaButtons = document.querySelectorAll('.cta-buttons a');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const module = button.getAttribute('data-module');
            showModule(module);
        });
    });
}

// 初始化游戏列表
function initializeGameList() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        const playBtn = card.querySelector('.play-btn');
        playBtn.addEventListener('click', () => {
            const gameType = card.getAttribute('data-game');
            startGame(gameType);
        });
    });
}

// 显示指定模块
function showModule(moduleName) {
    // 隐藏所有模块
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        module.classList.remove('active');
    });

    // 显示选中的模块
    const selectedModule = document.getElementById(moduleName);
    if (selectedModule) {
        selectedModule.classList.add('active');
    }

    // 如果切换到游戏列表，停止当前游戏
    if (moduleName === 'game' && currentGame) {
        currentGame = null;
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
    }
}

// 开始游戏
function startGame(gameType) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    switch (gameType) {
        case 'kids-sudoku':
            currentGame = new KidsSudokuGame(gameContainer);
            break;
        default:
            console.error('未知的游戏类型:', gameType);
            return;
    }

    // 隐藏游戏列表，显示游戏容器
    document.querySelector('.game-list').style.display = 'none';
    gameContainer.style.display = 'block';
} 