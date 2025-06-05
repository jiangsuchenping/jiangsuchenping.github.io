class KidsSudokuGame {
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
        // 生成4x4的数独游戏板
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
        if (this.timer) clearInterval(this.timer);
        this.initializeGame();
    }

    render() {
        // 清空容器
        this.container.innerHTML = '';

        // 创建主容器
        const mainContainer = document.createElement('div');
        mainContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            gap: 30px;
        `;

        // 创建游戏区域容器
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
            width: 100%;
            max-width: 800px;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // 创建游戏标题和计时器
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
        `;
        header.innerHTML = `
            <h2 style="margin: 0 0 10px 0;">幼儿数独</h2>
            <div style="font-size: 18px;">用时: <span id="timer">00:00</span></div>
            <div style="font-size: 18px;">步数: <span id="moves">0</span></div>
        `;
        gameContainer.appendChild(header);

        // 创建游戏板
        const board = document.createElement('div');
        board.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
            background: #000;
            padding: 2px;
            max-width: 400px;
            margin: 20px auto;
        `;

        // 创建单元格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
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
        numberPanel.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            max-width: 400px;
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

        // 添加清除按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '清除';
        clearButton.style.cssText = `
            padding: 15px;
            font-size: 24px;
            border: 1px solid #ccc;
            background: #ff4444;
            color: white;
            cursor: pointer;
            border-radius: 4px;
            grid-column: span 4;
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
        historyContainer.style.cssText = `
            width: 100%;
            max-width: 800px;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // 添加历史记录标题
        const historyTitle = document.createElement('h3');
        historyTitle.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 18px; text-align: center;';
        historyTitle.textContent = '历史记录';
        historyContainer.appendChild(historyTitle);

        // 保存历史记录容器的引用
        this.historyContainer = historyContainer;

        // 将游戏区域和历史记录区域添加到主容器
        mainContainer.appendChild(gameContainer);
        mainContainer.appendChild(historyContainer);

        // 将主容器添加到页面
        this.container.appendChild(mainContainer);

        // 初始化历史记录显示
        this.updateHistoryDisplay();
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
                this.moves++; // 增加步数

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
        let isWin = true;
        // 检查每一行
        for (let i = 0; i < 4; i++) {
            const row = new Set();
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0 || row.has(this.board[i][j])) {
                    isWin = false;
                    break;
                }
                row.add(this.board[i][j]);
            }
            if (!isWin) break;
        }

        // 检查每一列
        if (isWin) {
            for (let j = 0; j < 4; j++) {
                const col = new Set();
                for (let i = 0; i < 4; i++) {
                    if (this.board[i][j] === 0 || col.has(this.board[i][j])) {
                        isWin = false;
                        break;
                    }
                    col.add(this.board[i][j]);
                }
                if (!isWin) break;
            }
        }

        // 检查每个2x2方格
        if (isWin) {
            for (let block = 0; block < 4; block++) {
                const box = new Set();
                const startRow = Math.floor(block / 2) * 2;
                const startCol = (block % 2) * 2;
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        const num = this.board[startRow + i][startCol + j];
                        if (num === 0 || box.has(num)) {
                            isWin = false;
                            break;
                        }
                        box.add(num);
                    }
                    if (!isWin) break;
                }
                if (!isWin) break;
            }
        }

        if (isWin) {
            const now = new Date();
            const timeSpent = Math.floor((now - this.startTime) / 1000);
            const minutes = Math.floor(timeSpent / 60).toString().padStart(2, '0');
            const seconds = (timeSpent % 60).toString().padStart(2, '0');

            // 保存游戏记录
            this.saveGameRecord(timeSpent);

            alert(`恭喜你赢了！\n用时：${minutes}:${seconds}\n步数：${this.moves}`);

            // 延迟重置游戏，确保历史记录已更新
            setTimeout(() => {
                this.resetGame();
            }, 100);
        }
        return isWin;
    }

    saveGameRecord(timeSpent) {
        try {
            // 验证游戏数据
            if (!this.isValidGameRecord(timeSpent)) {
                console.warn('无效的游戏记录，已跳过保存');
                return;
            }

            // 获取现有记录
            let records = JSON.parse(localStorage.getItem('kidsSudokuRecords') || '[]');

            // 清理无效记录
            records = this.cleanInvalidRecords(records);

            // 创建新记录
            const newRecord = {
                date: new Date().toLocaleString(),
                time: timeSpent,
                timeFormatted: `${Math.floor(timeSpent / 60).toString().padStart(2, '0')}:${(timeSpent % 60).toString().padStart(2, '0')}`,
                moves: this.moves,
                timestamp: new Date().getTime()
            };

            // 添加新记录到数组开头
            records.unshift(newRecord);

            // 只保留最近的10条记录
            records = records.slice(0, 10);

            // 保存到本地存储
            localStorage.setItem('kidsSudokuRecords', JSON.stringify(records));

            // 更新历史记录显示
            this.updateHistoryDisplay();
        } catch (error) {
            console.error('保存游戏记录失败:', error);
        }
    }

    isValidGameRecord(timeSpent) {
        return (
            typeof timeSpent === 'number' &&
            !isNaN(timeSpent) &&
            timeSpent >= 0
        );
    }

    cleanInvalidRecords(records) {
        return records.filter(record => {
            if (!record.time || !record.date) {
                return false;
            }

            if (
                typeof record.time !== 'number' ||
                isNaN(record.time)
            ) {
                return false;
            }

            if (record.time < 0) {
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
            let records = JSON.parse(localStorage.getItem('kidsSudokuRecords') || '[]');
            records = this.cleanInvalidRecords(records);

            // 如果清理后有变化，更新存储
            if (records.length !== JSON.parse(localStorage.getItem('kidsSudokuRecords') || '[]').length) {
                localStorage.setItem('kidsSudokuRecords', JSON.stringify(records));
            }

            // 保留标题
            const title = this.historyContainer.querySelector('h3');
            this.historyContainer.innerHTML = '';
            if (title) {
                this.historyContainer.appendChild(title);
            }

            if (records.length === 0) {
                const noRecords = document.createElement('p');
                noRecords.style.cssText = 'text-align: center; color: #666; padding: 20px; font-size: 16px;';
                noRecords.textContent = '暂无历史记录';
                this.historyContainer.appendChild(noRecords);
                return;
            }

            // 找出最佳记录（用时最短）
            const minTime = Math.min(...records.map(r => r.time));

            const table = document.createElement('table');
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
                    ${records.map(record => {
                const isMinTime = record.time === minTime;
                return `
                            <tr>
                                <td style="padding: 15px; border-bottom: 1px solid #eee;">${record.date}</td>
                                <td style="padding: 15px; text-align: center; border-bottom: 1px solid #eee; ${isMinTime ? 'color: #ff0000; font-weight: bold;' : ''}">${record.timeFormatted}</td>
                                <td style="padding: 15px; text-align: center; border-bottom: 1px solid #eee;">${record.moves}</td>
                            </tr>
                        `;
            }).join('')}
                </tbody>
            `;

            this.historyContainer.appendChild(table);
        } catch (error) {
            console.error('更新历史记录显示失败:', error);
            const errorMessage = document.createElement('p');
            errorMessage.style.cssText = 'text-align: center; color: #f44336; padding: 20px; font-size: 16px;';
            errorMessage.textContent = '加载历史记录失败，请刷新页面重试';
            this.historyContainer.appendChild(errorMessage);
        }
    }
} 