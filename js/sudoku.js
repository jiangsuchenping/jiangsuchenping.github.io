class SudokuGame {
    constructor(container) {
        this.container = container;
        this.board = [];
        this.moves = 0;
        this.startTime = null;
        this.timer = null;
        this.historyContainer = null;
        this.history = [];

        // 从本地存储加载历史记录
        try {
            const savedHistory = localStorage.getItem('sudokuHistory');
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('加载历史记录失败:', error);
            this.history = [];
        }

        this.initializeGame();
    }

    initializeGame() {
        // 生成数独游戏板
        this.board = this.generateSudoku();

        // 初始化计时器
        this.startTime = new Date();
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.updateTimer(), 1000);

        this.render();
    }

    generateSudoku() {
        // 创建9x9的空数组
        const board = Array(9).fill().map(() => Array(9).fill(0));

        // 填充对角线上的3个3x3方格
        for (let i = 0; i < 9; i += 3) {
            this.fillBox(board, i, i);
        }

        // 填充剩余的方格
        this.solveSudoku(board);

        // 移除一些数字来创建游戏
        this.removeNumbers(board);

        return board;
    }

    fillBox(board, row, col) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * nums.length);
                board[row + i][col + j] = nums[randomIndex];
                nums.splice(randomIndex, 1);
            }
        }
    }

    solveSudoku(board) {
        const emptyCell = this.findEmptyCell(board);
        if (!emptyCell) return true;

        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;
                if (this.solveSudoku(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    findEmptyCell(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) return [i, j];
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        // 检查行
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }

        // 检查列
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }

        // 检查3x3方格
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }

        return true;
    }

    removeNumbers(board) {
        const cellsToRemove = 40; // 移除40个数字
        let count = 0;

        while (count < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (board[row][col] !== 0) {
                board[row][col] = 0;
                count++;
            }
        }
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

    resetGame() {
        this.moves = 0;
        if (this.timer) clearInterval(this.timer);
        this.initializeGame();
    }

    render() {
        const gameContainer = document.createElement('div');
        gameContainer.className = 'sudoku-container';

        // 创建游戏标题和移动次数显示
        const header = document.createElement('div');
        header.className = 'sudoku-header';
        header.innerHTML = `
            <h3>数字数独</h3>
            <p>用时: <span id="timer">00:00</span></p>
        `;
        gameContainer.appendChild(header);

        // 创建游戏板
        const board = document.createElement('div');
        board.className = 'sudoku-board';
        board.style.cssText = `
            display: grid;
            grid-template-columns: repeat(9, 1fr);
            gap: 1px;
            background: #000;
            padding: 1px;
            max-width: 450px;
            margin: 20px auto;
        `;

        // 创建单元格
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.style.cssText = `
                    background: white;
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    cursor: pointer;
                    user-select: none;
                    border: ${(i % 3 === 0 && i !== 0) || (j % 3 === 0 && j !== 0) ? '2px solid #000' : '1px solid #ccc'};
                `;

                if (this.board[i][j] !== 0) {
                    cell.textContent = this.board[i][j];
                    cell.style.backgroundColor = '#f0f0f0';
                } else {
                    cell.addEventListener('click', () => this.handleCellClick(cell, i, j));
                }

                board.appendChild(cell);
            }
        }
        gameContainer.appendChild(board);

        // 创建数字选择面板
        const numberPanel = document.createElement('div');
        numberPanel.className = 'number-panel';
        numberPanel.style.cssText = `
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            max-width: 450px;
            margin: 20px auto;
            padding: 10px;
        `;

        for (let i = 1; i <= 9; i++) {
            const numberButton = document.createElement('button');
            numberButton.textContent = i;
            numberButton.style.cssText = `
                padding: 10px;
                font-size: 20px;
                border: 1px solid #ccc;
                background: white;
                cursor: pointer;
                border-radius: 4px;
            `;
            numberButton.addEventListener('click', () => this.handleNumberClick(i));
            numberPanel.appendChild(numberButton);
        }

        // 添加清除按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '清除';
        clearButton.style.cssText = `
            padding: 10px;
            font-size: 20px;
            border: 1px solid #ccc;
            background: #ff4444;
            color: white;
            cursor: pointer;
            border-radius: 4px;
        `;
        clearButton.addEventListener('click', () => this.handleClearClick());
        numberPanel.appendChild(clearButton);

        gameContainer.appendChild(numberPanel);

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

        // 创建历史记录容器
        const historyContainer = document.createElement('div');
        historyContainer.className = 'sudoku-history-container';
        historyContainer.style.cssText = 'margin:20px 0; padding-top:15px; border-top:2px solid #eee;';
        gameContainer.appendChild(historyContainer);
        this.historyContainer = historyContainer;

        this.container.innerHTML = '';
        this.container.appendChild(gameContainer);

        // 渲染历史记录
        this.renderHistory();
    }

    handleCellClick(cell, row, col) {
        // 移除其他单元格的选中状态
        const cells = document.querySelectorAll('.sudoku-cell');
        cells.forEach(c => c.classList.remove('selected'));

        // 添加选中状态
        cell.classList.add('selected');

        // 保存当前选中的单元格位置
        this.selectedCell = { row, col, element: cell };
    }

    handleNumberClick(number) {
        if (this.selectedCell) {
            const { row, col, element } = this.selectedCell;

            // 检查是否可以填入该数字
            if (this.isValid(this.board, row, col, number)) {
                this.board[row][col] = number;
                element.textContent = number;
                element.style.backgroundColor = '#e8f5e9';

                // 检查是否获胜
                if (this.checkWin()) {
                    // 游戏胜利处理
                }
            } else {
                // 显示错误提示
                element.style.backgroundColor = '#ffebee';
                setTimeout(() => {
                    element.style.backgroundColor = 'white';
                }, 500);
            }
        }
    }

    handleClearClick() {
        if (this.selectedCell) {
            const { row, col, element } = this.selectedCell;
            this.board[row][col] = 0;
            element.textContent = '';
            element.style.backgroundColor = 'white';
        }
    }

    checkWin() {
        // 检查是否所有单元格都已填写
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) return false;
            }
        }

        // 检查行
        for (let i = 0; i < 9; i++) {
            const row = new Set();
            for (let j = 0; j < 9; j++) {
                row.add(this.board[i][j]);
            }
            if (row.size !== 9) return false;
        }

        // 检查列
        for (let j = 0; j < 9; j++) {
            const col = new Set();
            for (let i = 0; i < 9; i++) {
                col.add(this.board[i][j]);
            }
            if (col.size !== 9) return false;
        }

        // 检查3x3方格
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const box = new Set();
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        box.add(this.board[boxRow * 3 + i][boxCol * 3 + j]);
                    }
                }
                if (box.size !== 9) return false;
            }
        }

        // 游戏胜利，保存记录
        const endTime = new Date();
        const totalTime = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        try {
            // 添加新记录
            const newRecord = {
                time: new Date().toISOString(),
                duration: duration,
                moves: this.moves
            };

            // 将新记录添加到历史记录开头
            this.history.unshift(newRecord);

            // 只保留最近的10条记录
            this.history = this.history.slice(0, 10);

            // 保存历史记录到本地存储
            localStorage.setItem('sudokuHistory', JSON.stringify(this.history));

            // 更新历史记录显示
            this.renderHistory();
        } catch (error) {
            console.error('保存游戏记录失败:', error);
        }

        return true;
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
                        <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">用时</th>
                        <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd; background: #f5f5f5;">步数</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(r => {
                const isBestTime = r === bestTimeRecord;
                const isBestMoves = r === bestMovesRecord;
                return `
                            <tr>
                                <td style="padding: 15px; border-bottom: 1px solid #eee;">${new Date(r.time).toLocaleString()}</td>
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
} 