/**
 * 数字版数独游戏类
 * 适合幼儿园大班和小学低年级的6x6数独游戏
 * 使用1-6的数字，比4x4更有挑战性，但比9x9更简单
 */
class NumberSudokuGame {
  /**
   * 构造函数
   * @param {HTMLElement} container - 游戏容器
   */
  constructor(container) {
    this.container = container;
    this.board = [];
    this.solution = [];
    this.initialBoard = []; // 保存初始谜题状态
    this.selectedCell = null;
    this.selectedNumber = null;
    this.moves = 0;
    this.startTime = null;
    this.timer = null;
    this.isCompleted = false;
    this.difficulty = 'easy'; // 默认难度：简单
    this.historyContainer = null;
    this.history = [];

    // 数独尺寸 (6x6)
    this.size = 6;
    // 宫格尺寸 (2x3)
    this.boxWidth = 2;
    this.boxHeight = 3;

    // 从本地存储加载历史记录
    this.loadHistory();

    this.initializeGame();
  }

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const savedHistory = localStorage.getItem('numberSudokuHistory');
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        console.log('成功加载历史记录:', this.history);
      } else {
        console.log('没有找到历史记录');
        this.history = [];
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
      this.history = [];
    }
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
    // 初始化空解答
    this.solution = Array(this.size).fill().map(() => Array(this.size).fill(null));

    // 使用回溯算法填充解答
    this.solveSudoku(this.solution);
  }

  /**
   * 使用回溯算法解数独
   * @param {Array} grid - 数独网格
   * @returns {boolean} 是否成功解决
   */
  solveSudoku(grid) {
    // 找到一个空单元格
    let emptyCell = this.findEmptyCell(grid);
    if (!emptyCell) return true; // 没有空单元格，解答完成

    const [row, col] = emptyCell;

    // 创建1到size的数字数组并随机打乱
    const numbers = Array.from({ length: this.size }, (_, i) => i + 1);
    this.shuffleArray(numbers);

    // 尝试每个数字
    for (let num of numbers) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid)) {
          return true;
        }

        grid[row][col] = null; // 回溯
      }
    }

    return false; // 触发回溯
  }

  /**
   * 查找空单元格
   * @param {Array} grid - 数独网格
   * @returns {Array|null} 空单元格的坐标 [row, col] 或 null
   */
  findEmptyCell(grid) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (grid[row][col] === null) {
          return [row, col];
        }
      }
    }
    return null;
  }

  /**
   * 检查在指定位置放置数字是否安全
   * @param {Array} grid - 数独网格
   * @param {number} row - 行索引
   * @param {number} col - 列索引
   * @param {number} num - 要放置的数字
   * @returns {boolean} 是否安全
   */
  isSafe(grid, row, col, num) {
    // 检查行
    for (let x = 0; x < this.size; x++) {
      if (grid[row][x] === num) return false;
    }

    // 检查列
    for (let y = 0; y < this.size; y++) {
      if (grid[y][col] === num) return false;
    }

    // 检查宫格
    const boxRow = Math.floor(row / this.boxHeight) * this.boxHeight;
    const boxCol = Math.floor(col / this.boxWidth) * this.boxWidth;

    for (let i = 0; i < this.boxHeight; i++) {
      for (let j = 0; j < this.boxWidth; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  /**
   * 随机打乱数组
   * @param {Array} array - 要打乱的数组
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * 创建谜题（移除一些数字）
   */
  createPuzzle() {
    // 复制解答到游戏板
    this.board = this.solution.map(row => [...row]);

    // 根据难度确定要移除的单元格数量
    let cellsToRemove;
    switch (this.difficulty) {
      case 'easy':
        cellsToRemove = Math.floor(this.size * this.size * 0.4); // 约40%
        break;
      case 'medium':
        cellsToRemove = Math.floor(this.size * this.size * 0.5); // 约50%
        break;
      case 'hard':
        cellsToRemove = Math.floor(this.size * this.size * 0.6); // 约60%
        break;
      default:
        cellsToRemove = Math.floor(this.size * this.size * 0.4);
    }

    // 生成所有位置
    const positions = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        positions.push({ row: i, col: j });
      }
    }

    // 随机选择要移除的位置
    this.shuffleArray(positions);
    for (let i = 0; i < cellsToRemove; i++) {
      const pos = positions[i];
      this.board[pos.row][pos.col] = null;
    }

    // 保存初始谜题状态（深拷贝）
    this.initialBoard = this.board.map(row => [...row]);
  }

  /**
   * 渲染游戏界面
   */
  render() {
    const gameContainer = document.createElement('div');
    gameContainer.className = 'number-sudoku-container';

    // 创建游戏标题和信息
    const header = document.createElement('div');
    header.className = 'number-sudoku-header';
    header.innerHTML = `
      <h3>🔢 数字数独</h3>
      <div class="game-info">
        <span>移动次数: ${this.moves}</span>
        <span>用时: <span id="number-timer">00:00</span></span>
      </div>
    `;
    gameContainer.appendChild(header);

    // 创建难度选择
    const difficultySelector = document.createElement('div');
    difficultySelector.className = 'difficulty-selector';
    difficultySelector.innerHTML = `
      <p>选择难度：</p>
      <div class="difficulty-buttons">
        <button class="difficulty-btn ${this.difficulty === 'easy' ? 'selected' : ''}" onclick="this.closest('.number-sudoku-game').setDifficulty('easy')">简单</button>
        <button class="difficulty-btn ${this.difficulty === 'medium' ? 'selected' : ''}" onclick="this.closest('.number-sudoku-game').setDifficulty('medium')">中等</button>
        <button class="difficulty-btn ${this.difficulty === 'hard' ? 'selected' : ''}" onclick="this.closest('.number-sudoku-game').setDifficulty('hard')">困难</button>
      </div>
    `;
    gameContainer.appendChild(difficultySelector);

    // 创建数字选择区
    const numberSelector = document.createElement('div');
    numberSelector.className = 'number-selector';
    numberSelector.innerHTML = '<p>选择一个数字：</p>';

    const numberButtons = document.createElement('div');
    numberButtons.className = 'number-buttons';

    for (let i = 1; i <= this.size; i++) {
      const numberBtn = document.createElement('button');
      numberBtn.className = `number-btn ${this.selectedNumber === i ? 'selected' : ''}`;
      numberBtn.textContent = i;
      numberBtn.onclick = () => this.selectNumber(i);
      numberButtons.appendChild(numberBtn);
    }

    // 添加擦除按钮
    const eraseBtn = document.createElement('button');
    eraseBtn.className = 'number-btn erase-btn';
    eraseBtn.innerHTML = '🧹';
    eraseBtn.onclick = () => this.selectNumber(null);
    numberButtons.appendChild(eraseBtn);

    numberSelector.appendChild(numberButtons);
    gameContainer.appendChild(numberSelector);

    // 创建游戏板
    const board = document.createElement('div');
    board.className = 'number-sudoku-board';
    board.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'number-sudoku-cell';

        // 添加边框样式以显示宫格
        if (i % this.boxHeight === 0 && i !== 0) {
          cell.classList.add('border-top');
        }
        if (j % this.boxWidth === 0 && j !== 0) {
          cell.classList.add('border-left');
        }

        if (this.board[i][j] !== null) {
          cell.textContent = this.board[i][j];
          // 区分初始数字和用户输入的数字
          if (this.isInitialCell(i, j)) {
            cell.classList.add('filled'); // 初始数字样式
          } else {
            cell.classList.add('user-filled'); // 用户输入数字样式
          }
          // 所有已填入的单元格都可以点击，但在placeNumber中会判断是否允许修改
          cell.onclick = () => this.placeNumber(i, j);
        } else {
          cell.classList.add('empty');
          cell.onclick = () => this.placeNumber(i, j);
        }

        if (this.selectedCell && this.selectedCell.row === i && this.selectedCell.col === j) {
          cell.classList.add('selected');
        }

        // 高亮显示相同数字
        if (this.selectedNumber && this.board[i][j] === this.selectedNumber) {
          cell.classList.add('highlighted');
        }

        cell.dataset.row = i;
        cell.dataset.col = j;
        board.appendChild(cell);
      }
    }

    gameContainer.appendChild(board);

    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'number-sudoku-controls';
    controls.innerHTML = `
      <button onclick="this.closest('.number-sudoku-game').resetGame()">🔄 重新开始</button>
      <button onclick="this.closest('.number-sudoku-game').showHint()">💡 提示</button>
      <button onclick="this.closest('.number-sudoku-game').checkProgress()">✓ 检查</button>
      <button onclick="loadGame(document.getElementById('module-content'))">🏠 返回游戏列表</button>
    `;
    gameContainer.appendChild(controls);

    // 创建历史记录容器
    const historyContainer = document.createElement('div');
    historyContainer.className = 'number-sudoku-history-container';
    historyContainer.style.cssText = 'margin:20px 0; padding-top:15px; border-top:2px solid #eee;';
    gameContainer.appendChild(historyContainer);
    this.historyContainer = historyContainer;

    // 添加样式
    this.addStyles(gameContainer);

    // 保存游戏实例引用
    gameContainer.classList.add('number-sudoku-game');
    gameContainer.resetGame = () => this.resetGame();
    gameContainer.showHint = () => this.showHint();
    gameContainer.checkProgress = () => this.checkProgress();
    gameContainer.setDifficulty = (difficulty) => this.setDifficulty(difficulty);

    this.container.innerHTML = '';
    this.container.appendChild(gameContainer);

    // 更新计时器显示
    this.updateTimer();

    // 渲染历史记录
    this.renderHistory();
  }

  /**
   * 添加游戏样式
   * @param {HTMLElement} container - 容器元素
   */
  addStyles(container) {
    const style = document.createElement('style');
    style.textContent = `
      .number-sudoku-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
        text-align: center;
      }
      
      .number-sudoku-header h3 {
        color: #3498db;
        margin-bottom: 10px;
        font-size: 2em;
      }
      
      .game-info {
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;
        font-size: 1.1em;
        color: #333;
      }
      
      .difficulty-selector {
        margin: 15px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 10px;
      }
      
      .difficulty-selector p {
        margin: 0 0 10px 0;
        font-size: 1.1em;
        color: #495057;
      }
      
      .difficulty-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      
      .difficulty-btn {
        padding: 8px 15px;
        border: 2px solid #dee2e6;
        border-radius: 20px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .difficulty-btn:hover {
        border-color: #3498db;
      }
      
      .difficulty-btn.selected {
        border-color: #3498db;
        background: #e3f2fd;
        font-weight: bold;
      }
      
      .number-selector {
        margin: 15px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 10px;
      }
      
      .number-selector p {
        margin: 0 0 10px 0;
        font-size: 1.1em;
        color: #495057;
      }
      
      .number-buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .number-btn {
        width: 40px;
        height: 40px;
        font-size: 1.5em;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .number-btn:hover {
        border-color: #3498db;
        transform: scale(1.05);
      }
      
      .number-btn.selected {
        border-color: #3498db;
        background: #e3f2fd;
      }
      
      .erase-btn {
        font-size: 1.2em;
      }
      
      .number-sudoku-board {
        display: grid;
        gap: 1px;
        width: 360px;
        height: 360px;
        margin: 20px auto;
        background: #aaa;
        padding: 2px;
        border-radius: 5px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        grid-template-rows: repeat(${this.size}, 1fr);
      }
      
      .number-sudoku-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8em;
        font-weight: bold;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        min-height: 60px;
      }
      
      .number-sudoku-cell.filled {
        background: #f0f8ff;
        color: #333;
        font-weight: bold;
      }
      
      .number-sudoku-cell.user-filled {
        background: #fff3e0;
        color: #2196f3;
        font-weight: normal;
        cursor: pointer;
      }
      
      .number-sudoku-cell.user-filled:hover {
        background: #ffe0b2;
      }
      
      .number-sudoku-cell.empty {
        color: #3498db;
      }
      
      .number-sudoku-cell.empty:hover {
        background: #f0f8ff;
      }
      
      .number-sudoku-cell.selected {
        background: #bbdefb !important;
      }
      
      .number-sudoku-cell.highlighted {
        background: #e3f2fd;
      }
      
      .number-sudoku-cell.correct {
        color: #2ecc71 !important;
        animation: pulse 0.5s ease;
      }
      
      .number-sudoku-cell.wrong {
        color: #e74c3c !important;
        animation: shake 0.5s ease;
      }
      
      .number-sudoku-cell.user-filled:hover,
      .number-sudoku-cell.empty:hover {
        transform: none;
      }
      
      .number-sudoku-cell.border-top {
        border-top: 2px solid #333;
      }
      
      .number-sudoku-cell.border-left {
        border-left: 2px solid #333;
      }
      
      .number-sudoku-controls {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .number-sudoku-controls button {
        font-size: 1em;
        padding: 10px 15px;
        border: none;
        border-radius: 25px;
        background: #3498db;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .number-sudoku-controls button:hover {
        background: #2980b9;
        transform: translateY(-2px);
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
      }
      
      .completion-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        text-align: center;
        z-index: 1000;
        min-width: 300px;
        animation: popIn 0.5s ease-out;
      }
      
      .completion-message h2 {
        color: #3498db;
        margin-bottom: 20px;
        font-size: 2em;
      }
      
      .completion-message p {
        color: #666;
        margin: 10px 0;
        font-size: 1.2em;
      }
      
      .completion-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin-top: 25px;
        width: 100%;
      }
      
      .completion-buttons button {
        padding: 12px 25px;
        border: none;
        border-radius: 25px;
        font-size: 1.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        height: 48px;
        min-width: 120px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 1 auto;
      }
      
      .play-again-btn {
        background: #3498db;
        color: white;
      }
      
      .play-again-btn:hover {
        background: #2980b9;
        transform: translateY(-2px);
      }
      
      .return-btn {
        background: #e74c3c;
        color: white;
      }
      
      .return-btn:hover {
        background: #c0392b;
        transform: translateY(-2px);
      }
      
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        animation: fadeIn 0.3s ease-out;
      }
      
      @keyframes popIn {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    container.appendChild(style);
  }

  /**
   * 选择数字
   * @param {number|null} number - 选择的数字，null表示擦除
   */
  selectNumber(number) {
    this.selectedNumber = number;
    this.render();
  }

  /**
   * 在选中的单元格放置数字
   * @param {number} row - 行索引
   * @param {number} col - 列索引
   */
  placeNumber(row, col) {
    // 如果是已填充的初始数字，不允许修改
    if (this.isInitialCell(row, col)) return;
    if (this.isCompleted) return;

    if (this.selectedNumber === null) {
      // 擦除模式
      if (this.board[row][col] !== null) {
        this.board[row][col] = null;
        this.moves++;
        this.render();
      }
      return;
    }

    // 如果点击的单元格已经有数字，先删除它
    if (this.board[row][col] !== null) {
      this.board[row][col] = null;
      this.moves++;
    }

    this.board[row][col] = this.selectedNumber;
    this.moves++;

    // 检查是否正确
    const isCorrect = this.board[row][col] === this.solution[row][col];

    // 检查是否完成
    if (this.checkCompletion()) {
      this.gameCompleted();
    } else {
      this.showFeedback(row, col, isCorrect);
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

        // 如果错误，添加错误标记
        if (!isCorrect) {
          const errorNote = document.createElement('span');
          errorNote.className = 'error-note';
          errorNote.textContent = '✗';
          cell.appendChild(errorNote);
        }

        setTimeout(() => {
          cell.classList.remove('correct', 'wrong');
          // 如果错误，移除错误标记
          if (!isCorrect) {
            const errorNote = cell.querySelector('.error-note');
            if (errorNote) errorNote.remove();
          }
        }, 1000);
      }
    }, 100);
  }

  /**
   * 检查游戏是否完成
   * @returns {boolean} 是否完成
   */
  checkCompletion() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === null || this.board[i][j] !== this.solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 检查当前进度
   */
  checkProgress() {
    let correct = 0;
    let total = 0;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] !== null) {
          total++;
          if (this.board[i][j] === this.solution[i][j]) {
            correct++;
          }
        }
      }
    }

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    alert(`当前进度：${correct}/${total} 正确 (${percentage}%)`);
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

    // 保存游戏记录
    try {
      // 添加新记录
      const newRecord = {
        time: new Date().toISOString(),
        duration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        moves: this.moves,
        difficulty: this.difficulty
      };

      // 将新记录添加到历史记录开头
      this.history.unshift(newRecord);

      // 只保留最近的10条记录
      this.history = this.history.slice(0, 10);

      // 保存历史记录到本地存储
      localStorage.setItem('numberSudokuHistory', JSON.stringify(this.history));

      // 更新历史记录显示
      this.renderHistory();
    } catch (error) {
      console.error('保存游戏记录失败:', error);
    }

    setTimeout(() => {
      this.showCompletionMessage(minutes, seconds);
    }, 500);
  }

  /**
   * 保存历史记录
   * @param {Object} newRecord - 新的游戏记录
   */
  saveHistory(newRecord) {
    try {
      // 将新记录添加到历史记录开头
      this.history.unshift(newRecord);

      // 只保留最近的10条记录
      this.history = this.history.slice(0, 10);

      // 保存历史记录到本地存储
      localStorage.setItem('numberSudokuHistory', JSON.stringify(this.history));
      console.log('成功保存历史记录:', this.history);

      // 更新历史记录显示
      this.renderHistory();
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
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
      <h2>🎉 恭喜完成！</h2>
      <p>你成功完成了数字数独游戏！</p>
      <p>难度：${this.getDifficultyName()}</p>
      <p>用时：${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</p>
      <p>移动次数：${this.moves}</p>
      <div class="completion-buttons">
        <button class="play-again-btn">再玩一次</button>
        <button class="return-btn">返回游戏列表</button>
      </div>
    `;

    // 添加按钮点击事件
    const playAgainBtn = message.querySelector('.play-again-btn');
    const returnBtn = message.querySelector('.return-btn');

    playAgainBtn.addEventListener('click', () => {
      overlay.remove();
      this.resetGame();
    });

    returnBtn.addEventListener('click', () => {
      overlay.remove();
      loadGame(document.getElementById('module-content'));
    });

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    };
  }

  /**
   * 获取难度名称
   * @param {string} [difficulty] - 难度级别，如果不传则使用当前难度
   * @returns {string} 难度名称
   */
  getDifficultyName(difficulty) {
    const targetDifficulty = difficulty || this.difficulty;
    switch (targetDifficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '简单';
    }
  }

  /**
   * 设置难度
   * @param {string} difficulty - 难度级别
   */
  setDifficulty(difficulty) {
    if (this.difficulty !== difficulty) {
      this.difficulty = difficulty;
      this.resetGame();
    }
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
    const timerElement = document.getElementById('number-timer');
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  }

  /**
   * 显示提示
   */
  showHint() {
    if (this.isCompleted) return;

    // 找到第一个错误或空单元格并显示正确答案
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === null || this.board[i][j] !== this.solution[i][j]) {
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
   * 渲染历史记录
   */
  renderHistory() {
    try {
      // 获取并排序历史记录（按时间倒序）
      const records = [...this.history].sort((a, b) => new Date(b.time) - new Date(a.time));
      this.historyContainer.innerHTML = '';

      // 添加历史记录标题
      const historyTitle = document.createElement('h4');
      historyTitle.textContent = '📖 游戏历史';
      historyTitle.style.cssText = 'color:#666; margin-bottom:15px; font-size:1.2em;';
      this.historyContainer.appendChild(historyTitle);

      if (records.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = '暂无游戏记录，快完成一局吧~';
        emptyMsg.style.cssText = 'text-align:center; color:#999;';
        this.historyContainer.appendChild(emptyMsg);
        return;
      }

      // 找出最佳记录
      let bestTimeRecord = null;
      let bestMovesRecord = null;
      let minTime = Infinity;
      let minMoves = Infinity;
      let earliestTime = null;
      let earliestMoves = null;

      // 第一次遍历：找出最佳用时和步数
      records.forEach(record => {
        // 解析用时（格式：MM:SS）
        const [minutes, seconds] = record.duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;

        // 检查是否是最佳用时
        if (totalSeconds < minTime) {
          minTime = totalSeconds;
        }

        // 检查是否是最佳步数
        if (record.moves < minMoves) {
          minMoves = record.moves;
        }
      });

      // 第二次遍历：找出最早达到最佳记录的游戏
      records.forEach(record => {
        const [minutes, seconds] = record.duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        const recordTime = new Date(record.time);

        // 检查是否是最佳用时，且是最早达到的
        if (totalSeconds === minTime && (!earliestTime || recordTime < earliestTime)) {
          earliestTime = recordTime;
          bestTimeRecord = record;
        }

        // 检查是否是最佳步数，且是最早达到的
        if (record.moves === minMoves && (!earliestMoves || recordTime < earliestMoves)) {
          earliestMoves = recordTime;
          bestMovesRecord = record;
        }
      });

      const table = document.createElement('table');
      table.className = 'history-table';
      table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        font-size: 16px;
        background: white;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      `;

      table.innerHTML = `
        <thead>
          <tr>
            <th style="padding: 15px; text-align: left; border-bottom: 2px solid #ddd; background: #f5f5f5;">日期</th>
            <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">难度</th>
            <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">用时</th>
            <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">步数</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(r => {
        const isBestTime = r === bestTimeRecord;
        const isBestMoves = r === bestMovesRecord;
        const difficultyName = this.getDifficultyName(r.difficulty);
        return `
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #eee;">${new Date(r.time).toLocaleString()}</td>
                <td style="padding: 15px; text-align: center; border-bottom: 1px solid #eee;">${difficultyName}</td>
                <td style="padding: 15px; text-align: center; border-bottom: 1px solid #eee; ${isBestTime ? 'color: #ff0000; font-weight: bold;' : ''}">${r.duration}</td>
                <td style="padding: 15px; text-align: center; border-bottom: 1px solid #eee; ${isBestMoves ? 'color: #ff0000; font-weight: bold;' : ''}">${r.moves}</td>
              </tr>
            `;
      }).join('')}
        </tbody>
      `;
      this.historyContainer.appendChild(table);

      // 添加说明文字
      const note = document.createElement('p');
      note.style.cssText = 'text-align: center; color: #666; margin-top: 10px; font-size: 0.9em;';
      note.textContent = '注：红色表示最佳记录（用时最短或步数最少，相同时取最早记录）';
      this.historyContainer.appendChild(note);
    } catch (error) {
      console.error('历史记录加载失败:', error);
      const errorMsg = document.createElement('p');
      errorMsg.textContent = '历史记录加载失败，请刷新页面重试';
      errorMsg.style.cssText = 'text-align:center; color:#f44336;';
      this.historyContainer.appendChild(errorMsg);
    }
  }

  /**
   * 判断是否为初始单元格（谜题的一部分）
   * @param {number} row - 行索引
   * @param {number} col - 列索引
   * @returns {boolean} 是否为初始单元格
   */
  isInitialCell(row, col) {
    // 通过比较初始谜题状态来判断是否为初始单元格
    // 如果初始谜题中该位置有数字，则为初始单元格，不可删除
    return this.initialBoard && this.initialBoard[row] && this.initialBoard[row][col] !== null;
  }

  /**
   * 重置游戏
   */
  resetGame() {
    this.board = [];
    this.solution = [];
    this.initialBoard = [];
    this.selectedCell = null;
    this.selectedNumber = null;
    this.moves = 0;
    this.isCompleted = false;
    if (this.timer) clearInterval(this.timer);

    // 移除完成消息
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();

    this.initializeGame();
  }
}