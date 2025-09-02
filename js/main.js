// 平滑滚动功能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 工具卡片悬停效果增强
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// 简单的搜索功能
function searchTools() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * 记录工具使用频次
 * @param {string} toolName - 工具名称
 * @param {string} toolUrl - 工具URL
 */
function recordToolUsage(toolName, toolUrl) {
    // 从localStorage获取工具使用记录
    let toolUsage = localStorage.getItem('toolUsage');
    let usageData = toolUsage ? JSON.parse(toolUsage) : {};
    
    // 更新使用次数
    if (usageData[toolUrl]) {
        usageData[toolUrl].count += 1;
        usageData[toolUrl].lastUsed = new Date().getTime();
    } else {
        usageData[toolUrl] = {
            name: toolName,
            count: 1,
            lastUsed: new Date().getTime()
        };
    }
    
    // 保存回localStorage
    localStorage.setItem('toolUsage', JSON.stringify(usageData));
}

/**
 * 保存选项设置
 * @param {string} toolId - 工具ID
 * @param {string} optionId - 选项ID
 * @param {any} value - 选项值
 */
function saveOption(toolId, optionId, value) {
    // 从localStorage获取选项设置
    let savedOptions = localStorage.getItem('savedOptions');
    let optionsData = savedOptions ? JSON.parse(savedOptions) : {};
    
    // 如果该工具没有记录，创建一个新对象
    if (!optionsData[toolId]) {
        optionsData[toolId] = {};
    }
    
    // 保存选项值
    optionsData[toolId][optionId] = value;
    
    // 保存回localStorage
    localStorage.setItem('savedOptions', JSON.stringify(optionsData));
}

/**
 * 获取保存的选项值
 * @param {string} toolId - 工具ID
 * @param {string} optionId - 选项ID
 * @param {any} defaultValue - 默认值
 * @returns {any} 保存的选项值或默认值
 */
function getOption(toolId, optionId, defaultValue) {
    // 从localStorage获取选项设置
    let savedOptions = localStorage.getItem('savedOptions');
    let optionsData = savedOptions ? JSON.parse(savedOptions) : {};
    
    // 如果该工具或选项没有记录，返回默认值
    if (!optionsData[toolId] || optionsData[toolId][optionId] === undefined) {
        return defaultValue;
    }
    
    return optionsData[toolId][optionId];
}

/**
 * 创建常用工具快捷菜单
 */
function createFrequentToolsMenu() {
    // 从localStorage获取工具使用记录
    let toolUsage = localStorage.getItem('toolUsage');
    if (!toolUsage) return;
    
    let usageData = JSON.parse(toolUsage);
    
    // 转换为数组并按使用次数排序
    let toolsArray = Object.keys(usageData).map(url => {
        return {
            url: url,
            name: usageData[url].name,
            count: usageData[url].count,
            lastUsed: usageData[url].lastUsed
        };
    });
    
    // 按使用次数降序排序
    toolsArray.sort((a, b) => b.count - a.count);
    
    // 查找已存在的常用工具区域
    const existingFrequentTools = document.getElementById('frequent-tools');
    const existingToolGrid = document.getElementById('frequent-tools-grid');
    
    // 如果已存在常用工具区域，则直接使用它
    if (existingFrequentTools && existingToolGrid) {
        // 清空现有内容
        existingToolGrid.innerHTML = '';
        
        // 添加工具卡片（最多显示8个，每行4个）
        const maxTools = Math.min(8, toolsArray.length);
        
        for (let i = 0; i < maxTools; i++) {
            const tool = toolsArray[i];
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.innerHTML = `
                <h3><a href="${tool.url}">${tool.name}</a></h3>
                <p>使用次数: ${tool.count}</p>
            `;
            existingToolGrid.appendChild(toolCard);
            
            // 为动态创建的工具卡片添加点击事件，记录使用频次
            const link = toolCard.querySelector('h3 a');
            if (link) {
                link.addEventListener('click', function(e) {
                    recordToolUsage(tool.name, tool.url);
                });
            }
        }
        
        // 如果没有工具使用记录，显示提示信息
        if (toolsArray.length === 0) {
            const noToolsMessage = document.createElement('p');
            noToolsMessage.className = 'no-tools-message';
            noToolsMessage.textContent = '暂无常用工具记录，请先使用一些工具';
            existingToolGrid.appendChild(noToolsMessage);
        }
        
        return; // 已处理完毕，直接返回
    }
    
    // 如果不存在常用工具区域，则创建一个新的（这种情况不应该发生，因为HTML中已经有了）
    // 但为了代码的健壮性，仍然保留这部分逻辑
    const frequentToolsContainer = document.createElement('section');
    frequentToolsContainer.id = 'frequent-tools';
    frequentToolsContainer.className = 'frequent-tools';
    frequentToolsContainer.innerHTML = `
        <h2>常用工具</h2>
        <div class="tool-grid" id="frequent-tools-grid"></div>
    `;
    
    // 获取主内容区域和JSON工具部分
    const mainContainer = document.querySelector('main.container');
    const jsonToolsSection = document.getElementById('json-tools');
    
    // 在JSON工具部分前插入快捷菜单
    if (mainContainer && jsonToolsSection) {
        mainContainer.insertBefore(frequentToolsContainer, jsonToolsSection);
        
        // 添加工具卡片（最多显示8个，每行4个）
        const toolGrid = document.getElementById('frequent-tools-grid');
        const maxTools = Math.min(8, toolsArray.length);
        
        for (let i = 0; i < maxTools; i++) {
            const tool = toolsArray[i];
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.innerHTML = `
                <h3><a href="${tool.url}">${tool.name}</a></h3>
                <p>使用次数: ${tool.count}</p>
            `;
            toolGrid.appendChild(toolCard);
            
            // 为动态创建的工具卡片添加点击事件，记录使用频次
            const link = toolCard.querySelector('h3 a');
            if (link) {
                link.addEventListener('click', function(e) {
                    recordToolUsage(tool.name, tool.url);
                });
            }
        }
        
        // 如果没有工具使用记录，显示提示信息
        if (toolsArray.length === 0) {
            const noToolsMessage = document.createElement('p');
            noToolsMessage.className = 'no-tools-message';
            noToolsMessage.textContent = '暂无常用工具记录，请先使用一些工具';
            toolGrid.appendChild(noToolsMessage);
        }
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('在线工具箱已加载');
    
    // 添加搜索框（如果需要）
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="search-input" placeholder="搜索工具...">
        <button onclick="searchTools()">搜索</button>
    `;
    
    // 可以将搜索框添加到页面的适当位置
    // document.querySelector('header').appendChild(searchContainer);
    
    // 创建常用工具快捷菜单
    createFrequentToolsMenu();
    
    // 为所有工具链接添加点击事件，记录使用频次
    document.querySelectorAll('.tool-card h3 a').forEach(link => {
        link.addEventListener('click', function(e) {
            const toolName = this.textContent;
            const toolUrl = this.getAttribute('href');
            recordToolUsage(toolName, toolUrl);
        });
    });
});

/**
 * 为表单元素添加自动保存功能
 * @param {string} toolId - 工具ID
 * @param {string} elementId - 元素ID
 * @param {string} eventType - 事件类型，如'change'、'input'等
 */
function setupAutoSave(toolId, elementId, eventType = 'change') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // 加载保存的值
    const savedValue = getOption(toolId, elementId, null);
    if (savedValue !== null) {
        // 根据元素类型设置值
        if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = savedValue;
        } else if (element.tagName === 'SELECT') {
            element.value = savedValue;
        } else {
            element.value = savedValue;
        }
    }
    
    // 添加事件监听器保存值
    element.addEventListener(eventType, function() {
        let valueToSave;
        if (element.type === 'checkbox' || element.type === 'radio') {
            valueToSave = element.checked;
        } else {
            valueToSave = element.value;
        }
        saveOption(toolId, elementId, valueToSave);
    });
}