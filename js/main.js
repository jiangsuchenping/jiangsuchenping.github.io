function showModule(module) {
  const content = document.getElementById('module-content');
  switch(module) {
    case 'chinese':
      loadChinese(content);
      break;
    case 'math':
      loadMath(content);
      break;
    case 'english':
      loadEnglish(content);
      break;
    case 'game':
      loadGame(content);
      break;
    default:
      content.innerHTML = '';
  }
} 