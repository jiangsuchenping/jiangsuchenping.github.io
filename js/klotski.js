class KlotskiGame {
  constructor(container) {
    this.container = container;
    this.board = [];
    this.moves = 0;
    this.startTime = null;
    this.timer = null;
    this.initializeGame();
  }

  initializeGame() {
    // 初始化游戏板
    this.board = [];
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.push('');

    // 随机打乱数字
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // 转换为3x3的棋盘
    for (let i = 0; i < 3; i++) {
      this.board[i] = numbers.slice(i * 3, (i + 1) * 3);
    }

    // 检查是否可解
    if (!this.isSolvable()) {
      // 如果不可解，交换最后两个非空格数字
      let last1 = -1, last2 = -1;
      outer: for (let i = 2; i >= 0; i--) {
        for (let j = 2; j >= 0; j--) {
          if (this.board[i][j] !== '') {
            if (last1 === -1) {
              last1 = { i, j };
            } else {
              last2 = { i, j };
              break outer;
            }
          }
        }
      }
      if (last1 !== -1 && last2 !== -1) {
        [this.board[last1.i][last1.j], this.board[last2.i][last2.j]] =
          [this.board[last2.i][last2.j], this.board[last1.i][last1.j]];
      }
    }

    this.startTime = new Date();
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.updateTimer(), 1000);

    this.render();
  }

  render() {
    const gameContainer = document.createElement('div');
    gameContainer.className = 'klotski-container';

    // 创建游戏标题和移动次数显示
    const header = document.createElement('div');
    header.className = 'klotski-header';
    header.innerHTML = `
      <h3>数字华容道</h3>
      <p>移动次数: ${this.moves} | 用时: <span id="timer">00:00</span></p>
    `;
    gameContainer.appendChild(header);

    // 创建游戏板
    const board = document.createElement('div');
    board.className = 'klotski-board';
    board.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      width: 300px;
      height: 300px;
      margin: 20px auto;
      background: #f0f0f0;
      padding: 5px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const cell = document.createElement('div');
        cell.className = 'klotski-cell';
        cell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2em;
          font-weight: bold;
          background: ${this.board[i][j] ? '#4CAF50' : 'transparent'};
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          height: 100%;
        `;
        cell.textContent = this.board[i][j];
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', (e) => this.handleCellClick(e));
        board.appendChild(cell);
      }
    }

    gameContainer.appendChild(board);

    // 添加重置按钮
    const resetButton = document.createElement('button');
    resetButton.textContent = '重新开始';
    resetButton.addEventListener('click', () => this.resetGame());
    gameContainer.appendChild(resetButton);

    this.container.innerHTML = '';
    this.container.appendChild(gameContainer);
  }

  handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // 如果点击的是空格，不做任何操作
    if (this.board[row][col] === '') return;

    // 查找相邻的空白块位置
    const blankPos = this.findBlankPosition();
    if (!blankPos) return;

    // 检查当前点击块是否与空白块相邻
    if (this.isAdjacent(row, col, blankPos.row, blankPos.col)) {
      // 交换位置
      [this.board[row][col], this.board[blankPos.row][blankPos.col]] =
        [this.board[blankPos.row][blankPos.col], this.board[row][col]];

      this.moves++;
      this.render();

      if (this.checkWin()) {
        const now = new Date();
        const timeSpent = Math.floor((now - this.startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60).toString().padStart(2, '0');
        const seconds = (timeSpent % 60).toString().padStart(2, '0');
        alert(`恭喜你赢了！\n总共移动了 ${this.moves} 步\n用时：${minutes}:${seconds}`);
        this.resetGame();
      }
    }
  }

  findBlankPosition() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === '') {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }

  isAdjacent(r1, c1, r2, c2) {
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  checkWin() {
    // 检查数字是否按顺序排列
    let expected = 1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // 最后一个位置（右下角）应该是空格
        if (i === 2 && j === 2) {
          if (this.board[i][j] !== '') {
            return false;
          }
          continue;
        }
        // 其他位置应该按顺序排列1-8
        if (this.board[i][j] !== expected) {
          return false;
        }
        expected++;
      }
    }
    return true;
  }

  updateTimer() {
    const now = new Date();
    const diff = Math.floor((now - this.startTime) / 1000);
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  }

  isSolvable() {
    // 将二维数组转换为一维数组，计算逆序数
    const flatBoard = this.board.flat();
    let inversions = 0;

    // 计算逆序数（不包括空格）
    for (let i = 0; i < flatBoard.length - 1; i++) {
      if (flatBoard[i] === '') continue;
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[j] === '') continue;
        if (flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }

    // 获取空格所在的行数（从下往上数）
    let emptyRow = -1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          emptyRow = 2 - i;
          break;
        }
      }
      if (emptyRow !== -1) break;
    }

    // 修改可解性判断规则
    // 当空格在偶数行时，逆序数必须为偶数
    // 当空格在奇数行时，逆序数必须为奇数
    return (emptyRow % 2 === 0 && inversions % 2 === 0) ||
      (emptyRow % 2 === 1 && inversions % 2 === 1);
  }

  resetGame() {
    this.moves = 0;
    if (this.timer) clearInterval(this.timer);
    this.initializeGame();
  }
}

function loadKlotski(container) {
  new KlotskiGame(container);
}