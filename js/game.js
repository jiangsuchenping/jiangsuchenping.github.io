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
      new KidsSudokuGame(container);
    };
    document.head.appendChild(script);
  } else {
    new KidsSudokuGame(container);
  }
}