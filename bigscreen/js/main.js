// 主JavaScript文件
// 实现页面主要交互功能、数据刷新和动画效果

// 全局变量引用 - 这些函数将通过全局作用域提供
// 对应 charts.js 和 data-simulation.js 中的全局函数

// 全局配置对象
const config = {
    dataRefreshInterval: 5000, // 数据刷新间隔（毫秒）
    animationDuration: 1000,   // 动画持续时间（毫秒）
    warningThreshold: 80,      // 警告阈值
    criticalThreshold: 90      // 严重阈值
};

// 页面元素引用
const elements = {};

/**
 * 初始化页面元素引用
 */
function initElements() {
    // 获取数据卡片元素
    elements.dataCards = document.querySelectorAll('.data-card');
    
    // 获取监控项元素
    elements.monitorItems = document.querySelectorAll('.monitor-item');
    
    // 获取告警列表元素
    elements.alarmList = document.querySelector('.alarm-list');
    
    // 获取状态指示器元素
    elements.statusIndicators = document.querySelectorAll('.status-indicator');
    
    // 获取实时数据元素
    elements.realTimeData = document.querySelectorAll('.real-time-data');
    
    // 获取刷新按钮
    elements.refreshButton = document.getElementById('refresh-button');
    
    // 获取时间显示元素
    elements.currentTime = document.getElementById('current-time');
    
    // 获取全屏按钮
    elements.fullscreenButton = document.getElementById('fullscreen-button');
}

/**
 * 更新时间显示
 */
function updateTimeDisplay() {
    if (!elements.currentTime) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    elements.currentTime.textContent = `${formattedDate} ${formattedTime}`;
}

/**
 * 更新数据卡片显示
 * @param {Array} data - 数据卡片数据数组
 */
function updateDataCards(data) {
    if (!elements.dataCards.length || !data.length) return;
    
    elements.dataCards.forEach((card, index) => {
        if (data[index]) {
            const valueElement = card.querySelector('.data-value');
            const labelElement = card.querySelector('.data-label');
            const iconElement = card.querySelector('.data-icon i');
            
            if (valueElement) {
                // 数字动画效果
                animateValue(valueElement, parseFloat(valueElement.textContent) || 0, data[index].value);
            }
            
            if (labelElement && data[index].label) {
                labelElement.textContent = data[index].label;
            }
            
            if (iconElement && data[index].icon) {
                iconElement.className = data[index].icon;
            }
        }
    });
}

/**
 * 更新监控项进度条
 * @param {Array} data - 监控项数据数组
 */
function updateMonitorItems(data) {
    if (!elements.monitorItems.length || !data.length) return;
    
    elements.monitorItems.forEach((item, index) => {
        if (data[index]) {
            const nameElement = item.querySelector('.monitor-name');
            const valueElement = item.querySelector('.monitor-value');
            const progressBar = item.querySelector('.progress-bar');
            
            if (nameElement && data[index].name) {
                nameElement.textContent = data[index].name;
            }
            
            if (valueElement) {
                valueElement.textContent = `${data[index].value}%`;
            }
            
            if (progressBar) {
                // 更新进度条宽度并添加动画
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = `${data[index].value}%`;
                    
                    // 根据值设置不同颜色
                    if (data[index].value >= config.criticalThreshold) {
                        progressBar.className = 'progress-bar critical';
                    } else if (data[index].value >= config.warningThreshold) {
                        progressBar.className = 'progress-bar warning';
                    } else {
                        progressBar.className = 'progress-bar normal';
                    }
                }, 50);
            }
        }
    });
}

/**
 * 更新告警列表
 * @param {Array} alarms - 告警数据数组
 */
function updateAlarmList(alarms) {
    if (!elements.alarmList || !alarms.length) return;
    
    // 清空现有告警
    elements.alarmList.innerHTML = '';
    
    // 添加新告警
    alarms.forEach(alarm => {
        const alarmItem = document.createElement('div');
        alarmItem.className = `alarm-item ${alarm.level}`;
        
        const time = document.createElement('span');
        time.className = 'alarm-time';
        time.textContent = alarm.time;
        
        const message = document.createElement('span');
        message.className = 'alarm-message';
        message.textContent = alarm.message;
        
        alarmItem.appendChild(time);
        alarmItem.appendChild(message);
        
        // 添加淡入动画
        alarmItem.style.opacity = '0';
        alarmItem.style.transform = 'translateY(10px)';
        
        elements.alarmList.appendChild(alarmItem);
        
        // 触发动画
        setTimeout(() => {
            alarmItem.style.opacity = '1';
            alarmItem.style.transform = 'translateY(0)';
        }, 10);
    });
}

/**
 * 更新状态指示器
 * @param {Array} statuses - 状态数据数组
 */
function updateStatusIndicators(statuses) {
    if (!elements.statusIndicators.length || !statuses.length) return;
    
    elements.statusIndicators.forEach((indicator, index) => {
        if (statuses[index]) {
            // 移除所有状态类
            indicator.className = 'status-indicator';
            
            // 添加新状态类
            indicator.classList.add(statuses[index].status);
            
            // 添加脉冲动画
            const pulse = document.createElement('div');
            pulse.className = 'pulse';
            indicator.innerHTML = '';
            indicator.appendChild(pulse);
        }
    });
}

/**
 * 数字动画效果
 * @param {HTMLElement} element - 目标元素
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 */
function animateValue(element, start, end) {
    let startTime = null;
    const duration = config.animationDuration;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutQuad = t => t * (2 - t);
        const current = start + (end - start) * easeOutQuad(progress);
        
        // 格式化数字显示
        if (Number.isInteger(end)) {
            element.textContent = Math.round(current);
        } else {
            element.textContent = current.toFixed(2);
        }
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(animation);
}

/**
 * 为元素添加进入动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} delay - 延迟时间（毫秒）
 */
function addEntryAnimation(element, delay = 0) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${config.animationDuration}ms ease-out, transform ${config.animationDuration}ms ease-out`;
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

/**
 * 初始化页面动画
 */
function initAnimations() {
    // 为卡片添加进入动画，依次延迟
    elements.dataCards.forEach((card, index) => {
        addEntryAnimation(card, index * 100);
    });
    
    // 为监控项添加进入动画
    elements.monitorItems.forEach((item, index) => {
        addEntryAnimation(item, 300 + index * 100);
    });
    
    // 为图表容器添加进入动画
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach((container, index) => {
        addEntryAnimation(container, 600 + index * 150);
    });
    
    // 为告警列表添加进入动画
    if (elements.alarmList) {
        addEntryAnimation(elements.alarmList, 1000);
    }
}

/**
 * 设置页面交互事件
 */
function setupEventListeners() {
    // 刷新按钮事件
    if (elements.refreshButton) {
        elements.refreshButton.addEventListener('click', () => {
            // 添加旋转动画
            elements.refreshButton.classList.add('rotating');
            
            // 手动刷新数据
            refreshAllData();
            
            // 移除动画
            setTimeout(() => {
                elements.refreshButton.classList.remove('rotating');
            }, 1000);
        });
    }
    
    // 全屏按钮事件
    if (elements.fullscreenButton) {
        elements.fullscreenButton.addEventListener('click', toggleFullscreen);
    }
    
    // 添加卡片点击效果
    elements.dataCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('card-active');
            setTimeout(() => {
                card.classList.remove('card-active');
            }, 200);
        });
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', debounce(() => {
        // 重新调整图表大小
        const charts = initAllCharts();
    }, 300));
}

/**
 * 切换全屏模式
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`全屏切换错误: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 刷新所有数据
 */
function refreshAllData() {
    // 生成新的模拟数据
    const mockData = generateMockData();
    
    // 更新各个组件
    updateDataCards(mockData.dataCards);
    updateMonitorItems(mockData.monitorItems);
    updateAlarmList(mockData.alarmList);
    updateStatusIndicators(mockData.statusIndicators);
    
    // 更新图表数据（通过模拟数据更新函数）
    simulateDataUpdate();
}

/**
 * 页面初始化函数
 */
function init() {
    // 初始化页面元素引用
    initElements();
    
    // 初始化时间显示
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
    
    // 初始化所有图表
    const charts = initAllCharts();
    
    // 初始化页面动画
    initAnimations();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始加载数据
    refreshAllData();
    
    // 设置定期数据刷新
    setInterval(refreshAllData, config.dataRefreshInterval);
    
    console.log('大屏页面初始化完成');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 全局初始化函数
window.init = init;
window.refreshAllData = refreshAllData;
window.updateDataCards = updateDataCards;