// 初始化函数
window.init = function() {
  try {
    window.showModule('');
  } catch (error) {
    console.error('初始化失败:', error);
  }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', window.init);

window.showModule = function(module) {
  const moduleContent = document.getElementById('module-content');
  if (!moduleContent) {
    console.error('找不到module-content元素');
    return;
  }

  try {
    switch(module) {
      case 'chinese':
        if (typeof window.loadChinese === 'function') {
          window.loadChinese(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'math':
        if (typeof window.loadMath === 'function') {
          window.loadMath(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'english':
        if (typeof window.loadEnglish === 'function') {
          window.loadEnglish(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'science':
        if (typeof window.loadScience === 'function') {
          window.loadScience(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'art':
        if (typeof window.loadArt === 'function') {
          window.loadArt(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'music':
        if (typeof window.loadMusic === 'function') {
          window.loadMusic(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'sports':
        if (typeof window.loadSports === 'function') {
          window.loadSports(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      case 'game':
        if (typeof window.loadGame === 'function') {
          window.loadGame(moduleContent);
        }
        moduleContent.style.display = 'block';
        break;
      default:
        moduleContent.style.display = 'none';
        break;
    }
  } catch (error) {
    console.error('切换模块失败:', error);
  }
};