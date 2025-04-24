/**
 * 页面版本检测器
 * 功能：
 * 1. 配置页面版本号
 * 2. 定期检测并比较版本号
 * 3. 版本不一致时自动刷新页面
 */

// 配置常量
const VERSION_CHECKER_CONFIG = {
    version: new Date().toISOString(), // 使用当前ISO时间作为版本号
    checkInterval: 60000, // 检查间隔(毫秒)，默认60秒
    versionParam: 'v' // URL版本参数名
};

/**
 * 版本检测器主函数
 * @param {Object} config - 配置对象
 */
function initVersionChecker(config = VERSION_CHECKER_CONFIG) {
    // 获取当前URL中的版本参数
    const currentVersion = getUrlVersion(config.versionParam);

    // 设置定时器定期检查版本
    setInterval(() => {
        checkVersion(currentVersion, config.version, config.versionParam);
    }, config.checkInterval);
}

/**
 * 从URL获取版本号
 * @param {string} paramName - 版本参数名
 * @returns {string|null} 版本号或null(如果不存在)
 */
function getUrlVersion(paramName) {
    const url = new URL(window.location.href);
    return url.searchParams.get(paramName);
}

/**
 * 检查版本并处理不一致情况
 * @param {string} currentVersion - 当前URL中的版本
 * @param {string} newVersion - 配置中的新版本
 * @param {string} paramName - 版本参数名
 */
function checkVersion(currentVersion, newVersion, paramName) {
    if (currentVersion !== newVersion) {
        reloadWithNewVersion(newVersion, paramName);
    }
}

/**
 * 使用新版本号重新加载页面
 * @param {string} version - 新版本号
 * @param {string} paramName - 版本参数名
 */
function reloadWithNewVersion(version, paramName) {
    const url = new URL(window.location.href);
    url.searchParams.set(paramName, version);
    window.location.href = url.toString();
}

// 初始化版本检测器
document.addEventListener('DOMContentLoaded', () => {
    initVersionChecker();
});