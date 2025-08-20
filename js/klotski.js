class KlotskiGame {
  constructor(container) {
    this.container = container;
    this.board = [];
    this.moves = 0;
    this.startTime = null;
    this.timer = null;
    this.historyContainer = null;
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

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    `;

    // 添加重置按钮
    const resetButton = document.createElement('button');
    resetButton.textContent = '重新开始';
    resetButton.className = 'return-btn';
    resetButton.style.background = '#4CAF50';
    resetButton.addEventListener('click', () => this.resetGame());
    buttonContainer.appendChild(resetButton);

    // 添加返回游戏列表按钮
    const returnButton = document.createElement('button');
    returnButton.textContent = '返回游戏列表';
    returnButton.className = 'return-btn';
    returnButton.addEventListener('click', () => window.showModule('game'));
    buttonContainer.appendChild(returnButton);

    gameContainer.appendChild(buttonContainer);

    // 添加历史记录容器
    this.historyContainer = document.createElement('div');
    this.historyContainer.className = 'klotski-history';
    this.historyContainer.style.cssText = `
      margin-top: 20px;
      padding: 15px;
      background: #f8f8f8;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    `;
    gameContainer.appendChild(this.historyContainer);

    // 初始化历史记录显示
    this.updateHistoryDisplay();

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

        // 保存游戏记录
        this.saveGameRecord(timeSpent);

        alert(`恭喜你赢了！\n总共移动了 ${this.moves} 步\n用时：${minutes}:${seconds}`);

        // 延迟重置游戏，确保历史记录已更新
        setTimeout(() => {
          this.resetGame();
        }, 100);
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

    // 获取空格所在的行数（从上往下数，0-based）
    let emptyRow = -1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          emptyRow = i;
          break;
        }
      }
      if (emptyRow !== -1) break;
    }

    // 修正可解性判断规则
    // 对于3x3的华容道，当逆序数为偶数时游戏可解
    return inversions % 2 === 0;
  }

  resetGame() {
    this.moves = 0;
    if (this.timer) clearInterval(this.timer);
    this.initializeGame();
  }

  saveGameRecord(timeSpent) {
    try {
      // 验证游戏数据
      if (!this.isValidGameRecord(timeSpent)) {
        console.warn('无效的游戏记录，已跳过保存');
        return;
      }

      // 获取现有记录
      let records = JSON.parse(localStorage.getItem('klotskiRecords') || '[]');

      // 清理无效记录
      records = this.cleanInvalidRecords(records);

      // 创建新记录
      const newRecord = {
        date: new Date().toLocaleString(),
        moves: this.moves,
        time: timeSpent,
        timeFormatted: `${Math.floor(timeSpent / 60).toString().padStart(2, '0')}:${(timeSpent % 60).toString().padStart(2, '0')}`,
        timestamp: new Date().getTime()
      };

      // 添加新记录到数组开头
      records.unshift(newRecord);

      // 只保留最近的10条记录
      records = records.slice(0, 10);

      // 保存到本地存储
      localStorage.setItem('klotskiRecords', JSON.stringify(records));

      // 更新历史记录显示
      this.updateHistoryDisplay();
    } catch (error) {
      console.error('保存游戏记录失败:', error);
    }
  }

  isValidGameRecord(timeSpent) {
    // 验证游戏数据是否有效
    return (
      typeof timeSpent === 'number' &&
      !isNaN(timeSpent) &&
      timeSpent >= 0 &&
      this.moves > 0
    );
  }

  cleanInvalidRecords(records) {
    // 清理无效记录
    return records.filter(record => {
      // 检查必要字段是否存在
      if (!record.time || !record.moves || !record.date) {
        return false;
      }

      // 检查数据类型是否正确
      if (
        typeof record.time !== 'number' ||
        typeof record.moves !== 'number' ||
        isNaN(record.time) ||
        isNaN(record.moves)
      ) {
        return false;
      }

      // 检查数值是否合理
      if (record.time < 0 || record.moves <= 0) {
        return false;
      }

      return true;
    });
  }

  updateHistoryDisplay() {
    try {
      if (!this.historyContainer) {
        console.warn('历史记录容器未初始化');
        return;
      }

      // 获取并清理记录
      let records = JSON.parse(localStorage.getItem('klotskiRecords') || '[]');
      records = this.cleanInvalidRecords(records);

      // 如果清理后有变化，更新存储
      if (records.length !== JSON.parse(localStorage.getItem('klotskiRecords') || '[]').length) {
        localStorage.setItem('klotskiRecords', JSON.stringify(records));
      }

      if (records.length === 0) {
        this.historyContainer.innerHTML = '<p class="no-records" style="text-align: center; color: #666;">暂无历史记录</p>';
        return;
      }

      // 找出最佳记录
      const minMoves = Math.min(...records.map(r => r.moves));
      const minTime = Math.min(...records.map(r => r.time));

      const table = document.createElement('table');
      table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        font-size: 14px;
        background: white;
        border-radius: 4px;
        overflow: hidden;
      `;

      table.innerHTML = `
        <thead>
          <tr>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; background: #f5f5f5;">日期</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">步数</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">用时</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(record => {
        const isMinMoves = record.moves === minMoves;
        const isMinTime = record.time === minTime;
        return `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${record.date}</td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee; ${isMinMoves ? 'color: #ff0000; font-weight: bold;' : ''}">${record.moves}步</td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee; ${isMinTime ? 'color: #ff0000; font-weight: bold;' : ''}">${record.timeFormatted}</td>
              </tr>
            `;
      }).join('')}
        </tbody>
      `;

      // 使用文档片段来减少重绘
      const fragment = document.createDocumentFragment();
      const title = document.createElement('h4');
      title.style.cssText = 'margin: 0 0 15px 0; color: #333; font-size: 16px; text-align: center;';
      title.textContent = '历史记录';
      fragment.appendChild(title);
      fragment.appendChild(table);

      // 一次性更新DOM
      this.historyContainer.innerHTML = '';
      this.historyContainer.appendChild(fragment);
    } catch (error) {
      console.error('更新历史记录显示失败:', error);
    }
  }
}

function loadKlotski(container) {
  new KlotskiGame(container);
}