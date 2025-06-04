/**
 * 幼儿数独游戏类
 * 适合幼儿园中班小朋友的4x4数独游戏
 * 使用可爱的图形符号代替数字
 */
class KidsSudokuGame {
  /**
   * 构造函数
   * @param {HTMLElement} container - 游戏容器
   */
  constructor(container) {
    this.container = container;
    this.board = [];
    this.solution = [];
    this.selectedCell = null;
    this.moves = 0;
    this.startTime = null;
    this.timer = null;
    this.isCompleted = false;

    // 使用可爱的图形符号
    this.symbols = ['🐱', '🐶', '🐰', '🐸'];

    this.initializeGame();
  }

  /**
   * 初始化游戏
   */
  initializeGame() {
    this.generateSolution();
    this.createPuzzle();
    this.startTime = new Date();
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.updateTimer(), 1000);
    this.render();
  }

  /**
   * 生成完整的数独解答
   */
  generateSolution() {
    // 创建一个简单的4x4数独解答
    this.solution = [
      [0, 1, 2, 3],
      [2, 3, 0, 1],
      [1, 0, 3, 2],
      [3, 2, 1, 0]
    ];

    // 随机打乱行和列
    this.shuffleSolution();
  }

  /**
   * 打乱解答以增加随机性
   */
  shuffleSolution() {
    // 随机交换行
    for (let i = 0; i < 10; i++) {
      const row1 = Math.floor(Math.random() * 4);
      const row2 = Math.floor(Math.random() * 4);
      [this.solution[row1], this.solution[row2]] = [this.solution[row2], this.solution[row1]];
    }

    // 随机交换列
    for (let i = 0; i < 10; i++) {
      const col1 = Math.floor(Math.random() * 4);
      const col2 = Math.floor(Math.random() * 4);
      for (let row = 0; row < 4; row++) {
        [this.solution[row][col1], this.solution[row][col2]] =
          [this.solution[row][col2], this.solution[row][col1]];
      }
    }
  }

  /**
   * 创建谜题（移除一些数字）
   */
  createPuzzle() {
    // 复制解答到游戏板
    this.board = this.solution.map(row => [...row]);

    // 随机移除8个数字（保留8个，适合幼儿难度）
    const cellsToRemove = 8;
    const positions = [];

    // 生成所有位置
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        positions.push({ row: i, col: j });
      }
    }

    // 随机选择要移除的位置
    for (let i = 0; i < cellsToRemove; i++) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      const pos = positions.splice(randomIndex, 1)[0];
      this.board[pos.row][pos.col] = null;
    }
  }

  /**
   * 渲染游戏界面
   */
  render() {
    const gameContainer = document.createElement('div');
    gameContainer.className = 'kids-sudoku-container';

    // 创建游戏标题和信息
    const header = document.createElement('div');
    header.className = 'kids-sudoku-header';
    header.innerHTML = `
      <h3>🎮 幼儿数独</h3>
      <div class="game-info">
        <span>移动次数: ${this.moves}</span>
        <span>用时: <span id="kids-timer">00:00</span></span>
      </div>
    `;
    gameContainer.appendChild(header);

    // 创建符号选择区
    const symbolSelector = document.createElement('div');
    symbolSelector.className = 'symbol-selector';
    symbolSelector.innerHTML = '<p>选择一个图形：</p>';

    this.symbols.forEach((symbol, index) => {
      const symbolBtn = document.createElement('button');
      symbolBtn.className = 'symbol-btn';
      symbolBtn.textContent = symbol;
      symbolBtn.onclick = () => this.selectSymbol(index);
      symbolSelector.appendChild(symbolBtn);
    });

    gameContainer.appendChild(symbolSelector);

    // 创建游戏板
    const board = document.createElement('div');
    board.className = 'kids-sudoku-board';

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 'kids-sudoku-cell';

        if (this.board[i][j] !== null) {
          cell.textContent = this.symbols[this.board[i][j]];
          cell.classList.add('filled');
        } else {
          cell.classList.add('empty');
          cell.onclick = () => this.selectCell(i, j);
        }

        if (this.selectedCell && this.selectedCell.row === i && this.selectedCell.col === j) {
          cell.classList.add('selected');
        }

        cell.dataset.row = i;
        cell.dataset.col = j;
        board.appendChild(cell);
      }
    }

    gameContainer.appendChild(board);

    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'kids-sudoku-controls';
    controls.innerHTML = `
      <button onclick="this.closest('.kids-sudoku-game').resetGame()">🔄 重新开始</button>
      <button onclick="this.closest('.kids-sudoku-game').showHint()">💡 提示</button>
      <button onclick="loadGame(this.closest('#module-content'))">🏠 返回游戏列表</button>
    `;
    gameContainer.appendChild(controls);

    // 添加样式
    this.addStyles(gameContainer);

    // 保存游戏实例引用
    gameContainer.classList.add('kids-sudoku-game');
    gameContainer.resetGame = () => this.resetGame();
    gameContainer.showHint = () => this.showHint();

    this.container.innerHTML = '';
    this.container.appendChild(gameContainer);
  }

  /**
   * 添加游戏样式
   * @param {HTMLElement} container - 容器元素
   */
  addStyles(container) {
    const style = document.createElement('style');
    style.textContent = `
      .kids-sudoku-container {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
        text-align: center;
      }
      
      .kids-sudoku-header h3 {
        color: #ff6b6b;
        margin-bottom: 10px;
        font-size: 2em;
      }
      
      .game-info {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        font-size: 1.1em;
        color: #333;
      }
      
      .symbol-selector {
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
      }
      
      .symbol-selector p {
        margin: 0 0 10px 0;
        font-size: 1.2em;
        color: #495057;
      }
      
      .symbol-btn {
        font-size: 2em;
        width: 60px;
        height: 60px;
        margin: 5px;
        border: 3px solid #dee2e6;
        border-radius: 10px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .symbol-btn:hover {
        border-color: #4ecdc4;
        transform: scale(1.1);
      }
      
      .symbol-btn.selected {
        border-color: #ff6b6b;
        background: #ffe0e0;
      }
      
      .kids-sudoku-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 3px;
        width: 320px;
        height: 320px;
        margin: 20px auto;
        background: #495057;
        padding: 10px;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      
      .kids-sudoku-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5em;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        aspect-ratio: 1;
        min-height: 70px;
        height: 100%;
      }
      
      .kids-sudoku-cell.filled {
        background: #e8f5e8;
        cursor: default;
      }
      
      .kids-sudoku-cell.empty {
        background: white;
        min-height: 70px;
        height: 100%;
      }
      
      .kids-sudoku-cell.selected {
        background: #cce5ff !important;
        border: 3px solid #007bff;
      }
      
      .kids-sudoku-cell.correct {
        background: #d4edda !important;
        animation: bounce 0.5s ease;
      }
      
      .kids-sudoku-cell.wrong {
        background: #f8d7da !important;
        animation: shake 0.5s ease;
      }
      
      .kids-sudoku-controls {
        margin-top: 20px;
      }
      
      .kids-sudoku-controls button {
        font-size: 1.1em;
        padding: 10px 20px;
        margin: 5px;
        border: none;
        border-radius: 25px;
        background: #4ecdc4;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .kids-sudoku-controls button:hover {
        background: #45b7aa;
        transform: translateY(-2px);
      }
      
      @keyframes bounce {
        0%, 20%, 60%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        80% { transform: translateY(-5px); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      .completion-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        text-align: center;
        z-index: 1000;
      }
      
      .completion-message h2 {
        color: #28a745;
        margin-bottom: 15px;
      }
      
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
      }
    `;
    container.appendChild(style);
  }

  /**
   * 选择单元格
   * @param {number} row - 行索引
   * @param {number} col - 列索引
   */
  selectCell(row, col) {
    if (this.board[row][col] !== null || this.isCompleted) return;

    this.selectedCell = { row, col };
    this.render();
  }

  /**
   * 选择符号
   * @param {number} symbolIndex - 符号索引
   */
  selectSymbol(symbolIndex) {
    if (!this.selectedCell || this.isCompleted) return;

    const { row, col } = this.selectedCell;

    // 检查是否正确
    if (this.solution[row][col] === symbolIndex) {
      this.board[row][col] = symbolIndex;
      this.moves++;
      this.selectedCell = null;

      // 检查是否完成
      if (this.checkCompletion()) {
        this.gameCompleted();
      } else {
        this.showFeedback(row, col, true);
      }
    } else {
      this.showFeedback(row, col, false);
    }

    this.render();
  }

  /**
   * 显示反馈动画
   * @param {number} row - 行索引
   * @param {number} col - 列索引
   * @param {boolean} isCorrect - 是否正确
   */
  showFeedback(row, col, isCorrect) {
    setTimeout(() => {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (cell) {
        cell.classList.add(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => {
          cell.classList.remove('correct', 'wrong');
        }, 500);
      }
    }, 100);
  }

  /**
   * 检查游戏是否完成
   * @returns {boolean} 是否完成
   */
  checkCompletion() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 游戏完成处理
   */
  gameCompleted() {
    this.isCompleted = true;
    if (this.timer) clearInterval(this.timer);

    const endTime = new Date();
    const totalTime = Math.floor((endTime - this.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    setTimeout(() => {
      this.showCompletionMessage(minutes, seconds);
    }, 500);
  }

  /**
   * 显示完成消息
   * @param {number} minutes - 分钟数
   * @param {number} seconds - 秒数
   */
  showCompletionMessage(minutes, seconds) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
      <h2>🎉 太棒了！</h2>
      <p>你成功完成了数独游戏！</p>
      <p>用时: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</p>
      <p>移动次数: ${this.moves}</p>
      <button class='sudoku-modal-button primary' id='kids-retry-btn'>
  <svg viewBox='0 0 24 24'><path d='M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z'/></svg>
  再玩一次
</button>
<button class='sudoku-modal-button secondary-btn' id='kids-back-btn'>
  <svg viewBox='0 0 24 24'><path d='M11.67 3.87L9 9h12l-2.07 4.77L11.67 3.87zm-4.3 5.8l-4.38 11.46c-.37.96.55 1.87 1.47 1.43l16.01-8.05c.93-.47.93-1.83 0-2.3L8.74 2.03c-.92-.44-1.84.47-1.47 1.44l2.76 7.2z'/></svg>
  返回列表
</button>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // 绑定按钮事件
    message.querySelector('#kids-retry-btn').addEventListener('click', () => {
      this.resetGame();
      overlay.remove();
    });

    message.querySelector('#kids-back-btn').addEventListener('click', () => {
      overlay.remove();
      loadGame(document.getElementById('module-content'));
    });

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    };
  }

  /**
   * 更新计时器
   */
  updateTimer() {
    if (this.isCompleted) return;

    const now = new Date();
    const diff = Math.floor((now - this.startTime) / 1000);
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');
    const timerElement = document.getElementById('kids-timer');
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  }

  /**
   * 显示提示
   */
  showHint() {
    if (this.isCompleted) return;

    // 找到第一个空单元格并显示正确答案
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === null) {
          this.board[i][j] = this.solution[i][j];
          this.moves++;

          if (this.checkCompletion()) {
            this.gameCompleted();
          }

          this.render();
          return;
        }
      }
    }
  }

  /**
   * 重置游戏
   */
  resetGame() {
    this.moves = 0;
    this.selectedCell = null;
    this.isCompleted = false;
    if (this.timer) clearInterval(this.timer);

    // 移除完成消息
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();

    this.initializeGame();
  }
}