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
      max-height: 300px;
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
    .question-display {
      text-align: center;
      margin: 30px auto;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 500px;
    }
    .question {
      font-size: 32px;
      color: #333;
      margin-bottom: 20px;
    }
    .options {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      margin: 20px auto;
    }
    .option-btn {
      padding: 15px 25px;
      font-size: 20px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 80px;
    }
    .option-btn:hover {
      background: #0b7dda;
      transform: translateY(-3px);
    }
    .option-btn:disabled {
      background-color: #cccccc;
      color: #999999;
      cursor: not-allowed;
      transform: none;
      opacity: 0.7;
    }
    .option-btn.correct {
      background-color: #4CAF50;
    }
    .option-btn.wrong {
      background-color: #f44336;
    }
  `
};

// 导出模板
window.CSS_TEMPLATES = CSS_TEMPLATES; 