function loadGame(container) {
  container.innerHTML = `
    <h2>趣味游戏</h2>
    <div class="game-list">
      <div class="game-item" onclick="loadKlotski(document.getElementById('module-content'))">
        <h3>华容道</h3>
        <p>经典数字华容道游戏，考验你的逻辑思维！</p>
      </div>
      <div class="game-item" onclick="loadKidsSudoku(document.getElementById('module-content'))">
        <h3>幼儿数独</h3>
        <p>适合幼儿园中班的简单数独游戏，用可爱的图形来玩！</p>
      </div>
      <div class="game-item" onclick="loadNumberSudoku(document.getElementById('module-content'))">
        <h3>数字数独</h3>
        <p>适合幼儿园大班和小学低年级的6x6数字数独游戏，更有挑战性！</p>
      </div>
    </div>
    <button class="game-return-btn" onclick="showModule('')">返回首页</button>
  `;
}

function loadKlotski(container) {
  new KlotskiGame(container);
}

/**
 * 加载幼儿数独游戏
 * @param {HTMLElement} container - 游戏容器
 */
function loadKidsSudoku(container) {
  // 动态加载kidsSudoku.js文件
  if (typeof KidsSudokuGame === 'undefined') {
    const script = document.createElement('script');
    script.src = 'js/kidsSudoku.js';
    script.onload = () => {
      // 确保脚本完全加载后再初始化游戏
      setTimeout(() => {
        if (typeof KidsSudokuGame !== 'undefined') {
          new KidsSudokuGame(container);
        } else {
          console.error('KidsSudokuGame 类未定义');
        }
      }, 100);
    };
    document.head.appendChild(script);
  } else {
    new KidsSudokuGame(container);
  }
}

/**
 * 加载数字数独游戏
 * @param {HTMLElement} container - 游戏容器
 */
function loadNumberSudoku(container) {
  // 动态加载numberSudoku.js文件
  if (typeof NumberSudokuGame === 'undefined') {
    const script = document.createElement('script');
    script.src = 'js/numberSudoku.js';
    script.onload = () => {
      new NumberSudokuGame(container);
    };
    document.head.appendChild(script);
  } else {
    new NumberSudokuGame(container);
  }
}