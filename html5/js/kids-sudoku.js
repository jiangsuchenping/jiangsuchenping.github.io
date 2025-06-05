class KidsSudokuGame {
    constructor(container) {
        this.container = container;
        this.board = [];
        this.moves = 0;
        this.startTime = null;
        this.timer = null;
        this.historyContainer = null;
        this.history = [];
        this.isCompleted = false;

        // 从本地存储加载历史记录
        this.loadHistory();

        this.initializeGame();
    }

    /**
     * 加载历史记录
     */
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('kidsSudokuHistory');
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
     * 保存历史记录
     */
    saveHistory(newRecord) {
        try {
            // 将新记录添加到历史记录开头
            this.history.unshift(newRecord);

            // 只保留最近的10条记录
            this.history = this.history.slice(0, 10);

            // 保存历史记录到本地存储
            localStorage.setItem('kidsSudokuHistory', JSON.stringify(this.history));
            console.log('成功保存历史记录:', this.history);

            // 更新历史记录显示
            this.renderHistory();
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
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
        // 创建4x4的空数组
        const board = Array(4).fill().map(() => Array(4).fill(0));

        // 填充对角线上的2个2x2方格
        for (let i = 0; i < 4; i += 2) {
            this.fillBox(board, i, i);
        }

        // 填充剩余的方格
        this.solveSudoku(board);

        // 移除一些数字来创建游戏
        this.removeNumbers(board);

        return board;
    }

    fillBox(board, row, col) {
        const nums = [1, 2, 3, 4];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
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
        for (let num = 1; num <= 4; num++) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;
                if (this.solveSudoku(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    findEmptyCell(board) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) return [i, j];
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        // 检查行
        for (let x = 0; x < 4; x++) {
            if (board[row][x] === num) return false;
        }

        // 检查列
        for (let x = 0; x < 4; x++) {
            if (board[x][col] === num) return false;
        }

        // 检查2x2方格
        const startRow = Math.floor(row / 2) * 2;
        const startCol = Math.floor(col / 2) * 2;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }

        return true;
    }

    removeNumbers(board) {
        const cellsToRemove = 8; // 移除8个数字
        let count = 0;

        while (count < cellsToRemove) {
            const row = Math.floor(Math.random() * 4);
            const col = Math.floor(Math.random() * 4);

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
        this.isCompleted = false;
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
            <h3>幼儿数独</h3>
            <p>用时: <span id="timer">00:00</span></p>
            <p>步数: ${this.moves}</p>
        `;
        gameContainer.appendChild(header);

        // 创建游戏板
        const board = document.createElement('div');
        board.className = 'sudoku-board';
        board.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background: #000;
            padding: 1px;
            max-width: 300px;
            margin: 20px auto;
        `;

        // 创建单元格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.style.cssText = `
                    background: white;
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    cursor: pointer;
                    user-select: none;
                    border: ${(i % 2 === 0 && i !== 0) || (j % 2 === 0 && j !== 0) ? '2px solid #000' : '1px solid #ccc'};
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
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            max-width: 300px;
            margin: 20px auto;
            padding: 10px;
        `;

        for (let i = 1; i <= 4; i++) {
            const numberButton = document.createElement('button');
            numberButton.textContent = i;
            numberButton.style.cssText = `
                padding: 15px;
                font-size: 24px;
                border: 1px solid #ccc;
                background: white;
                cursor: pointer;
                border-radius: 4px;
            `;
            numberButton.addEventListener('click', () => this.handleNumberClick(i));
            numberPanel.appendChild(numberButton);
        }

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
        historyContainer.style.cssText = `
            margin: 20px auto;
            padding: 20px;
            max-width: 800px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        gameContainer.appendChild(historyContainer);
        this.historyContainer = historyContainer;

        // 清空容器并添加游戏界面
        this.container.innerHTML = '';
        this.container.appendChild(gameContainer);

        // 立即渲染历史记录
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
                this.moves++; // 增加移动次数

                // 检查是否获胜
                if (this.checkWin()) {
                    // 游戏胜利处理
                    this.showWinMessage();
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

    /**
     * 显示胜利消息
     */
    showWinMessage() {
        const endTime = new Date();
        const totalTime = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // 保存游戏记录
        const newRecord = {
            time: new Date().toISOString(),
            duration: duration,
            moves: this.moves
        };
        this.saveHistory(newRecord);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            animation: fadeIn 0.3s ease-out;
        `;

        // 创建胜利消息框
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.style.cssText = `
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
        `;

        message.innerHTML = `
            <h2 style="color: #4CAF50; margin-bottom: 20px; font-size: 2em;">🎉 恭喜通关！</h2>
            <p style="color: #666; margin: 10px 0; font-size: 1.2em;">用时: ${duration}</p>
            <p style="color: #666; margin: 10px 0; font-size: 1.2em;">步数: ${this.moves}</p>
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">
                <button class="play-again-btn" style="padding: 12px 25px; border: none; border-radius: 25px; background: #4CAF50; color: white; cursor: pointer; font-size: 1.1em;">再玩一次</button>
                <button class="return-btn" style="padding: 12px 25px; border: none; border-radius: 25px; background: #ff6b6b; color: white; cursor: pointer; font-size: 1.1em;">返回游戏列表</button>
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
            window.showModule('game');
        });

        overlay.appendChild(message);
        document.body.appendChild(overlay);

        // 点击遮罩层关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
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
        `;
        document.head.appendChild(style);
    }

    checkWin() {
        if (this.isCompleted) return false; // 防止重复触发

        // 检查是否所有单元格都已填写
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) return false;
            }
        }

        // 检查行
        for (let i = 0; i < 4; i++) {
            const row = new Set();
            for (let j = 0; j < 4; j++) {
                row.add(this.board[i][j]);
            }
            if (row.size !== 4) return false;
        }

        // 检查列
        for (let j = 0; j < 4; j++) {
            const col = new Set();
            for (let i = 0; i < 4; i++) {
                col.add(this.board[i][j]);
            }
            if (col.size !== 4) return false;
        }

        // 检查2x2方格
        for (let boxRow = 0; boxRow < 2; boxRow++) {
            for (let boxCol = 0; boxCol < 2; boxCol++) {
                const box = new Set();
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        box.add(this.board[boxRow * 2 + i][boxCol * 2 + j]);
                    }
                }
                if (box.size !== 4) return false;
            }
        }

        this.isCompleted = true; // 标记游戏已完成
        return true;
    }

    /**
     * 渲染历史记录
     */
    renderHistory() {
        try {
            console.log('开始渲染历史记录:', this.history); // 调试日志

            if (!this.historyContainer) {
                console.error('历史记录容器不存在');
                return;
            }

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

            console.log('历史记录渲染完成'); // 调试日志
        } catch (error) {
            console.error('历史记录加载失败:', error);
            const errorMsg = document.createElement('p');
            errorMsg.textContent = '历史记录加载失败，请刷新页面重试';
            errorMsg.style.cssText = 'text-align:center; color:#f44336;';
            this.historyContainer.appendChild(errorMsg);
        }
    }
} 