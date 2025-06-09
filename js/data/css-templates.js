/**
 * CSS模板文件
 * 集中管理学习模块的CSS样式
 */
const CSS_TEMPLATES = {
    // 通用样式
    COMMON: `
    .daily-progress {
      text-align: center;
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .limit-reached {
      color: #4CAF50;
      font-weight: bold;
      margin-top: 10px;
    }
    .settings-section {
      margin: 20px 0;
      padding: 15px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .setting-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 10px 0;
    }
    .setting-item input {
      width: 80px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .setting-item button {
      padding: 5px 15px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .setting-item button:hover {
      background: #45a049;
    }
    .history-section {
      margin: 20px 0;
      padding: 15px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .history-table thead {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #f0f0f0;
    }
    .history-table th,
    .history-table td {
      padding: 10px;
      text-align: center;
      border: 1px solid #ddd;
    }
    .history-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .history-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .history-table tr:hover {
      background-color: #f0f0f0;
    }
    .history-table th.sortable {
      cursor: pointer;
      user-select: none;
      position: relative;
      padding-right: 20px;
    }
    .history-table th.sortable:hover {
      background-color: #e0e0e0;
    }
    .history-table th.ascending::after {
      content: " ↑";
      position: absolute;
      right: 5px;
    }
    .history-table th.descending::after {
      content: " ↓";
      position: absolute;
      right: 5px;
    }
    .history-list {
      max-height: 500px;
      overflow-y: auto;
      margin-top: 10px;
    }
    .no-history {
      text-align: center;
      color: #666;
      padding: 20px;
    }
    .error-message {
      text-align: center;
      color: #f44336;
      padding: 20px;
    }
    .return-btn {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    .return-btn:hover {
      background: #0b7dda;
    }
    .feedback {
      text-align: center;
      margin: 20px 0;
      min-height: 30px;
      font-size: 24px;
      font-weight: bold;
    }
    .feedback.correct {
      color: #4CAF50;
    }
    .feedback.wrong {
      color: #f44336;
    }
    
    /* 动画反馈 */
    .animated-feedback {
      position: absolute;
      font-size: 28px;
      font-weight: bold;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      pointer-events: none;
      z-index: 100;
      text-align: center;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .animated-feedback.show {
      opacity: 1;
      transform: translateY(0);
    }
    .animated-feedback.success {
      color: #4CAF50;
    }
    .animated-feedback.error {
      color: #f44336;
    }
    .animated-feedback.neutral {
      color: #2196F3;
    }
    
    /* 防止重复点击效果 */
    .options button:active {
      transform: scale(0.95);
    }
    .button-clicked {
      transform: scale(0.95) !important;
      opacity: 0.8;
      transition: transform 0.1s;
    }
    
    /* 倒计时动画 */
    .countdown-timer {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0;
      transition: color 0.3s;
    }
    .countdown-timer.warning {
      color: #f44336;
    }
  `,

    // 英语模块样式
    ENGLISH: `
    .word-display {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .word {
      font-size: 42px;
      color: #333;
      line-height: 1;
      margin-bottom: 0;
    }
    .phonetic {
      font-size: 20px;
      color: #888;
      font-style: italic;
      margin: 5px 0;
      display: block;
    }
    .translation {
      font-size: 24px;
      color: #666;
      margin-top: 5px;
      font-weight: 500;
    }
    .options {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px auto;
      max-width: 400px;
    }
    .options button {
      padding: 15px 40px;
      font-size: 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      max-width: 180px;
    }
    .learn-btn {
      background: #4CAF50;
      color: white;
    }
    .learn-btn:hover {
      background: #45a049;
      transform: translateY(-3px);
    }
    .forget-btn {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 4px;
      font-size: 1.1em;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .forget-btn:hover {
      background: #d32f2f;
      transform: translateY(-3px);
    }
    .learn-btn:disabled,
    .forget-btn:disabled {
      background-color: #cccccc;
      color: #999999;
      cursor: not-allowed;
      transform: none;
      opacity: 0.7;
    }
  `,

    // 语文模块样式
    CHINESE: `
    .character-display {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .character {
      font-size: 72px;
      color: #333;
      line-height: 1;
      margin-bottom: 5px;
    }
    .pinyin {
      font-size: 24px;
      color: #666;
      margin-top: 5px;
      font-weight: 500;
    }
    .options {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px auto;
      max-width: 400px;
    }
    .options button {
      padding: 15px 40px;
      font-size: 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      max-width: 180px;
    }
    .learn-btn {
      background: #4CAF50;
      color: white;
    }
    .learn-btn:hover {
      background: #45a049;
      transform: translateY(-3px);
    }
    .forget-btn {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 4px;
      font-size: 1.1em;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .forget-btn:hover {
      background: #d32f2f;
      transform: translateY(-3px);
    }
    .learn-btn:disabled,
    .forget-btn:disabled {
      background-color: #cccccc;
      color: #999999;
      cursor: not-allowed;
      transform: none;
      opacity: 0.7;
    }
  `,

    // 数学模块样式
    MATH: `
    .problem-display {
      font-size: 36px;
      margin: 20px 0;
      text-align: center;
    }
    .options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      max-width: 300px;
      margin: 0 auto;
    }
    .options button {
      padding: 15px 20px;
      margin: 10px;
      font-size: 1.5em;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 60px;
    }
    .options button:hover {
      background: #45a049;
      transform: translateY(-3px);
    }
    .options button:disabled {
      background-color: #cccccc;
      color: #999999;
      cursor: not-allowed;
      transform: none;
      opacity: 0.7;
    }
    .options button.correct {
      background-color: #4CAF50 !important;
      color: white !important;
      font-weight: bold;
      box-shadow: 0 0 10px rgba(76, 175, 80, 0.7);
      opacity: 1 !important;
      border: 2px solid #2E7D32;
    }
    .options button.wrong {
      background-color: #f44336 !important;
      color: white !important;
      font-weight: bold;
      box-shadow: 0 0 10px rgba(244, 67, 54, 0.7);
      opacity: 1 !important;
      border: 2px solid #C62828;
    }
    .options button.processing {
      animation: pulse 1s infinite;
      position: relative;
      pointer-events: none;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .locked-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
      z-index: 10;
      cursor: not-allowed;
      display: none;
    }
    .locked-overlay.active {
      display: block;
    }
    .rest-message {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #e3f2fd;
      border-radius: 10px;
    }
    .rest-message p {
      margin: 10px 0;
      font-size: 18px;
    }
    /* 自定义滚动条样式 */
    .history-list::-webkit-scrollbar {
      width: 8px;
    }
    .history-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    .history-list::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .history-list::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `
};

// 导出模板
window.CSS_TEMPLATES = CSS_TEMPLATES; 