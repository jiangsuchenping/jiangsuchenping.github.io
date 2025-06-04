function loadGame(container) {
  container.innerHTML = `
    <h2>趣味游戏</h2>
    <div class="game-list">
      <div class="game-item" onclick="loadKlotski(document.getElementById('module-content'))">
        <h3>华容道</h3>
        <p>经典数字华容道游戏，考验你的逻辑思维！</p>
      </div>
    </div>
    <button class="game-return-btn" onclick="showModule('')">返回首页</button>
  `;
}

function loadKlotski(container) {
  new KlotskiGame(container);
}