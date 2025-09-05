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
 * 检测当前访问地址是否为本机或局域网地址
 * @returns {boolean} - 是否为本机或局域网地址
 */
function isLocalOrPrivateNetwork() {
    const hostname = window.location.hostname.toLowerCase();
    
    // 本机地址
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return true;
    }
    
    // 局域网地址范围
    // IPv4 私有地址范围：
    // 10.0.0.0 - 10.255.255.255
    // 172.16.0.0 - 172.31.255.255  
    // 192.168.0.0 - 192.168.255.255
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv4Match = hostname.match(ipv4Pattern);
    
    if (ipv4Match) {
        const [, a, b, c, d] = ipv4Match.map(Number);
        
        // 检查是否为私有IP范围
        if (a === 10) return true; // 10.0.0.0/8
        if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
        if (a === 192 && b === 168) return true; // 192.168.0.0/16
        if (a === 169 && b === 254) return true; // 169.254.0.0/16 (链路本地地址)
    }
    
    // IPv6 本地地址
    if (hostname.startsWith('fe80:') || hostname.startsWith('fc00:') || hostname.startsWith('fd00:')) {
        return true;
    }
    
    // 检查是否为 .local 域名（mDNS）
    if (hostname.endsWith('.local')) {
        return true;
    }
    
    return false;
}

/**
 * 标准化工具URL，将xxx.html、xxx/、xxx/index.html三种格式合并为同一个工具
 * @param {string} url - 原始URL
 * @returns {string} - 标准化后的URL
 */
function normalizeToolUrl(url) {
    if (!url) return url;
    
    // 移除可能的查询参数和锚点
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // 移除末尾的斜杠（如果有）
    const normalizedCleanUrl = cleanUrl.replace(/\/$/, '');
    
    // 提取工具名称的正则表达式
    // 匹配以下格式：
    // 1. tools/toolname.html
    // 2. tools/toolname/
    // 3. tools/toolname/index.html
    // 4. tools/toolname（无后缀）
    const toolPattern = /tools\/(\w+(?:-\w+)*?)(?:\.html|\/(?:index\.html)?)?$/i;
    const match = normalizedCleanUrl.match(toolPattern);
    
    if (match) {
        const toolName = match[1];
        // 统一返回 tools/toolname/index.html 格式
        return `tools/${toolName}/index.html`;
    }
    
    // 如果不匹配工具模式，返回原URL
    return cleanUrl;
}

/**
 * 提取工具显示名称
 * @param {string} toolName - 传入的工具名称
 * @param {string} url - 工具URL
 * @returns {string} - 清理后的工具名称
 */
function extractToolName(toolName, url) {
    // 如果工具名称有效，直接使用
    if (toolName && toolName.trim() && !toolName.includes('undefined')) {
        return toolName.trim();
    }
    
    // 从URL提取工具名称
    // 匹配 tools/toolname.html、tools/toolname/、tools/toolname/index.html、tools/toolname 等格式
    const toolPattern = /tools\/(\w+(?:-\w+)*?)(?:\.html|\/(?:index\.html)?)?$/i;
    const match = url.match(toolPattern);
    
    if (match) {
        const extractedName = match[1];
        // 转换为友好的显示名称
        const nameMap = {
            'json-format': 'JSON格式化',
            'base64-encode': 'Base64编码/解码',
            'url-encode': 'URL编码/解码',
            'unicode-encode': 'Unicode编码/解码',
            'html-encode': 'HTML编码/解码',
            'md5-encrypt': 'MD5加密',
            'sha1-encrypt': 'SHA1加密',
            'sha256-encrypt': 'SHA256加密',
            'sha512-encrypt': 'SHA512加密',
            'aes-encrypt': 'AES加密/解密',
            'des-encrypt': 'DES加密/解密',
            '3des-encrypt': '3DES加密/解密',
            'hmac-encrypt': 'HMAC加密',
            'json-to-xml': 'JSON转XML',
            'xml-to-json': 'XML转JSON',
            'json-to-yaml': 'JSON转YAML',
            'json-to-csharp': 'JSON转C#',
            'json-to-java': 'JSON转Java',
            'timestamp': '时间戳转换',
            'number-convert': '进制转换',
            'sql-formatter': 'SQL格式化',
            'index-namer': '索引命名工具',
            'sql-to-csharp': 'SQL转C#',
            'sql-to-java': 'SQL转Java',
            'regex-test': '正则表达式测试',
            'text-compare': '文本对比',
            'qrcode': '二维码生成',
            'color-picker': '颜色选择器',
            'guid-generator': 'GUID生成器',
            'password-generator': '随机密码生成器',
            'ip-range-converter': 'IP地址范围转换工具'
        };
        
        return nameMap[extractedName] || extractedName;
    }
    
    // 如果都无法提取，返回默认名称
    return toolName || 'Unknown Tool';
}

/**
 * 防重复调用的工具使用记录
 */
let recordingInProgress = new Set();
let sessionRecorded = new Set();

/**
 * 记录工具使用频次（优化版，解决重复计数问题）
 * @param {string} toolName - 工具名称
 * @param {string} toolUrl - 工具URL（可选，如果不提供会从当前页面URL获取）
 */
function recordToolUsage(toolName, toolUrl) {
    // 如果没有提供URL，从当前页面获取
    if (!toolUrl) {
        toolUrl = window.location.pathname + window.location.search;
    }
    
    // 标准化URL
    const normalizedUrl = normalizeToolUrl(toolUrl);
    const recordKey = `${normalizedUrl}_${Date.now()}`;
    
    // 检查是否在当前会话中已经记录过（防止同一页面多次调用）
    const sessionKey = `session_${normalizedUrl}`;
    if (sessionRecorded.has(sessionKey)) {
        console.log('本次会话已记录，跳过重复记录:', normalizedUrl);
        return;
    }
    
    // 防止并发记录
    if (recordingInProgress.has(normalizedUrl)) {
        console.log('正在记录中，跳过重复调用:', normalizedUrl);
        return;
    }
    
    recordingInProgress.add(normalizedUrl);
    
    try {
        // 从localStorage获取工具使用记录
        let toolUsage = localStorage.getItem('toolUsage');
        let usageData = toolUsage ? JSON.parse(toolUsage) : {};
        
        // 提取和清理工具名称
        const cleanToolName = extractToolName(toolName, normalizedUrl);
        
        // 更新使用次数（使用标准化URL作为key）
        if (usageData[normalizedUrl]) {
            usageData[normalizedUrl].count += 1;
            usageData[normalizedUrl].lastUsed = new Date().getTime();
            // 更新工具名称（可能有优化）
            usageData[normalizedUrl].name = cleanToolName;
        } else {
            usageData[normalizedUrl] = {
                name: cleanToolName,
                count: 1,
                lastUsed: new Date().getTime(),
                originalUrls: [toolUrl] // 记录所有访问过的原始URL
            };
        }
        
        // 如果原始URL与标准化URL不同，记录到originalUrls数组中
        if (toolUrl !== normalizedUrl && usageData[normalizedUrl].originalUrls) {
            if (!usageData[normalizedUrl].originalUrls.includes(toolUrl)) {
                usageData[normalizedUrl].originalUrls.push(toolUrl);
            }
        }
        
        // 保存回localStorage
        localStorage.setItem('toolUsage', JSON.stringify(usageData));
        
        // 标记当前会话已记录
        sessionRecorded.add(sessionKey);
        
        console.log(`工具使用已记录: ${cleanToolName} (${normalizedUrl}) - 使用次数: ${usageData[normalizedUrl].count}`);
        
        // 更新常用工具显示（如果在主页）
        if (document.getElementById('frequent-tools-grid')) {
            setTimeout(createFrequentToolsMenu, 100);
        }
        
    } catch (error) {
        console.error('记录工具使用时发生错误:', error);
    } finally {
        recordingInProgress.delete(normalizedUrl);
    }
}

/**
 * 清理和迁移旧的重复数据
 */
function cleanupDuplicateRecords() {
    try {
        let toolUsage = localStorage.getItem('toolUsage');
        if (!toolUsage) return;
        
        let usageData = JSON.parse(toolUsage);
        let cleanedData = {};
        let hasChanges = false;
        
        // 遍历所有记录，合并重复的工具
        for (const [url, data] of Object.entries(usageData)) {
            const normalizedUrl = normalizeToolUrl(url);
            
            if (cleanedData[normalizedUrl]) {
                // 合并数据
                cleanedData[normalizedUrl].count += data.count;
                cleanedData[normalizedUrl].lastUsed = Math.max(cleanedData[normalizedUrl].lastUsed, data.lastUsed);
                
                // 合并原始URL记录
                if (!cleanedData[normalizedUrl].originalUrls) {
                    cleanedData[normalizedUrl].originalUrls = [url];
                } else if (!cleanedData[normalizedUrl].originalUrls.includes(url)) {
                    cleanedData[normalizedUrl].originalUrls.push(url);
                }
                
                hasChanges = true;
                console.log(`合并重复记录: ${url} -> ${normalizedUrl}`);
                console.log(`  [支持格式: .html, /, /index.html]`);
            } else {
                // 使用标准化URL作为新的key
                cleanedData[normalizedUrl] = {
                    ...data,
                    name: extractToolName(data.name, normalizedUrl),
                    originalUrls: data.originalUrls || [url]
                };
                
                if (url !== normalizedUrl) {
                    hasChanges = true;
                }
            }
        }
        
        // 如果有变化，保存清理后的数据
        if (hasChanges) {
            localStorage.setItem('toolUsage', JSON.stringify(cleanedData));
            console.log('重复记录清理完成，数据已更新');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('清理重复记录时发生错误:', error);
        return false;
    }
}

/**
 * 获取工具使用统计（包含详细信息）
 * @returns {Array} 工具使用统计数组
 */
function getToolUsageStats() {
    try {
        let toolUsage = localStorage.getItem('toolUsage');
        if (!toolUsage) return [];
        
        let usageData = JSON.parse(toolUsage);
        
        return Object.keys(usageData).map(url => {
            const data = usageData[url];
            return {
                url: url,
                name: data.name,
                count: data.count,
                lastUsed: data.lastUsed,
                lastUsedDate: new Date(data.lastUsed).toLocaleString(),
                originalUrls: data.originalUrls || [url]
            };
        }).sort((a, b) => b.count - a.count);
    } catch (error) {
        console.error('获取工具使用统计时发生错误:', error);
        return [];
    }
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
 * 创建常用工具快捷菜单（优化版）
 */
function createFrequentToolsMenu() {
    // 检测是否为本机或局域网地址
    const showStats = isLocalOrPrivateNetwork();
    
    // 从localStorage获取工具使用记录
    let toolUsage = localStorage.getItem('toolUsage');
    
    // 如果是外网访问且没有本地数据，显示空状态
    if (!showStats && !toolUsage) {
        showEmptyFrequentTools();
        return;
    }
    
    // 如果是本机访问且没有数据，显示空状态
    if (showStats && !toolUsage) {
        showEmptyFrequentTools();
        return;
    }
    
    let usageData = JSON.parse(toolUsage);
    
    // 转换为数组并按使用次数排序
    let toolsArray = Object.keys(usageData).map(url => {
        const data = usageData[url];
        return {
            url: url,
            name: data.name,
            count: data.count,
            lastUsed: data.lastUsed,
            lastUsedDate: new Date(data.lastUsed).toLocaleString(),
            originalUrls: data.originalUrls || [url]
        };
    });
    
    // 按使用次数降序排序，相同次数按最近使用时间排序
    toolsArray.sort((a, b) => {
        if (a.count !== b.count) {
            return b.count - a.count;
        }
        return b.lastUsed - a.lastUsed;
    });
    
    // 查找已存在的常用工具区域
    const existingFrequentTools = document.getElementById('frequent-tools');
    const existingToolGrid = document.getElementById('frequent-tools-grid');
    
    // 如果已存在常用工具区域，则直接使用它
    if (existingFrequentTools && existingToolGrid) {
        updateFrequentToolsGrid(existingToolGrid, toolsArray);
        return;
    }
    
    // 如果不存在常用工具区域，则创建一个新的（这种情况不应该发生，因为HTML中已经有了）
    createNewFrequentToolsSection(toolsArray);
}

/**
 * 更新常用工具网格
 * @param {HTMLElement} toolGrid - 工具网格元素
 * @param {Array} toolsArray - 工具数组
 */
function updateFrequentToolsGrid(toolGrid, toolsArray) {
    // 清空现有内容
    toolGrid.innerHTML = '';
    
    // 检测是否为本机或局域网地址
    const showStats = isLocalOrPrivateNetwork();
    
    // 添加工具卡片（最多显示8个，每行4个）
    const maxTools = Math.min(8, toolsArray.length);
    
    for (let i = 0; i < maxTools; i++) {
        const tool = toolsArray[i];
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card frequent-tool-card';
        
        // 根据地址类型创建不同的工具卡片HTML
        if (showStats) {
            // 本机/局域网访问：显示使用统计
            toolCard.innerHTML = `
                <h3><a href="${tool.url}" data-usage-tracking="true">${tool.name}</a></h3>
                <p>
                    <span class="usage-count">使用次数: ${tool.count}</span><br>
                    <small class="last-used">最近使用: ${formatRelativeTime(tool.lastUsed)}</small>
                </p>
            `;
        } else {
            // 外网访问：不显示使用统计
            toolCard.innerHTML = `
                <h3><a href="${tool.url}" data-usage-tracking="true">${tool.name}</a></h3>                
            `;
        }
        
        toolGrid.appendChild(toolCard);
        
        // 为动态创建的工具卡片添加点击事件，记录使用频次
        const link = toolCard.querySelector('h3 a');
        if (link) {
            link.addEventListener('click', function(e) {
                // 延迟记录，确保页面跳转不受影响
                setTimeout(() => {
                    recordToolUsage(tool.name, tool.url);
                }, 50);
            });
        }
    }
    
    // 如果没有工具使用记录，显示提示信息
    if (toolsArray.length === 0) {
        showEmptyFrequentTools(toolGrid);
    } else {
        // 仅在本机/局域网访问时显示“查看全部”按钮
        if (showStats && toolsArray.length > maxTools) {
            const viewAllButton = document.createElement('div');
            viewAllButton.className = 'tool-card view-all-card';
            viewAllButton.innerHTML = `
                <h3><a href="javascript:void(0)" onclick="showAllUsageStats()">查看全部 (${toolsArray.length})</a></h3>
                <p>查看所有工具使用统计</p>
            `;
            toolGrid.appendChild(viewAllButton);
        }
    }
}

/**
 * 显示空的常用工具提示
 * @param {HTMLElement} toolGrid - 工具网格元素（可选）
 */
function showEmptyFrequentTools(toolGrid) {
    const targetGrid = toolGrid || document.getElementById('frequent-tools-grid');
    if (!targetGrid) return;
    
    targetGrid.innerHTML = '';
    const noToolsMessage = document.createElement('div');
    noToolsMessage.className = 'no-tools-message';
    
    // 检测是否为本机或局域网地址
    const showStats = isLocalOrPrivateNetwork();
    
    if (showStats) {
        // 本机/局域网访问：显示统计相关提示
        noToolsMessage.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools" style="font-size: 3em; color: #ccc; margin-bottom: 1rem;"></i>
                <h4>暂无常用工具记录</h4>
                <p class="text-muted">请先使用一些工具，它们将显示在这里</p>
            </div>
        `;
    } else {
        // 外网访问：显示通用提示
        noToolsMessage.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tools" style="font-size: 3em; color: #ccc; margin-bottom: 1rem;"></i>
                <h4>常用工具</h4>
                <p class="text-muted">您可以在下面的工具列表中找到所需的工具</p>
            </div>
        `;
    }
    
    targetGrid.appendChild(noToolsMessage);
}

/**
 * 创建新的常用工具区域（备用方法）
 * @param {Array} toolsArray - 工具数组
 */
function createNewFrequentToolsSection(toolsArray) {
    const frequentToolsContainer = document.createElement('section');
    frequentToolsContainer.id = 'frequent-tools';
    frequentToolsContainer.className = 'tool-category';
    frequentToolsContainer.innerHTML = `
        <h2>您的常用工具</h2>
        <div class="tool-grid" id="frequent-tools-grid"></div>
    `;
    
    // 获取主内容区域和JSON工具部分
    const mainContainer = document.querySelector('main.container');
    const jsonToolsSection = document.getElementById('json-tools');
    
    // 在JSON工具部分前插入快捷菜单
    if (mainContainer && jsonToolsSection) {
        mainContainer.insertBefore(frequentToolsContainer, jsonToolsSection);
        
        // 更新工具网格
        const newToolGrid = document.getElementById('frequent-tools-grid');
        updateFrequentToolsGrid(newToolGrid, toolsArray);
    }
}

/**
 * 格式化相对时间
 * @param {number} timestamp - 时间戳
 * @returns {string} - 格式化后的相对时间
 */
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // 不到1分钟
        return '刚刚';
    } else if (diff < 3600000) { // 不到1小时
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 不到1天
        return `${Math.floor(diff / 3600000)}小时前`;
    } else if (diff < 604800000) { // 不到1周
        return `${Math.floor(diff / 86400000)}天前`;
    } else {
        return new Date(timestamp).toLocaleDateString();
    }
}

/**
 * 显示所有使用统计（可以在控制台调用）
 */
function showAllUsageStats() {
    const stats = getToolUsageStats();
    console.log('工具使用统计:', stats);
    
    // 可以在这里添加显示所有统计的模态框或页面
    let message = '工具使用统计：\n\n';
    stats.forEach((tool, index) => {
        message += `${index + 1}. ${tool.name} - ${tool.count}次 (最近: ${tool.lastUsedDate})\n`;
        if (tool.originalUrls && tool.originalUrls.length > 1) {
            message += `   合并自: ${tool.originalUrls.join(', ')}\n`;
        }
    });
    
    alert(message);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('在线工具箱已加载');
    
    // 清理重复记录（一次性操作）
    const hasCleanedKey = 'usageDataCleaned_v3'; // v3: 支持三种格式 (.html, /, /index.html)
    if (!localStorage.getItem(hasCleanedKey)) {
        console.log('开始清理重复的工具使用记录...');
        const cleaned = cleanupDuplicateRecords();
        if (cleaned) {
            console.log('重复记录清理完成');
        }
        localStorage.setItem(hasCleanedKey, 'true');
    }
    
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
    // 排除常用工具区域，因为它们已经在createFrequentToolsMenu函数中添加了点击事件
    const toolLinks = document.querySelectorAll('.tool-card h3 a:not(#frequent-tools-grid .tool-card h3 a)');
    toolLinks.forEach(link => {
        // 检查是否已经添加过事件监听器
        if (!link.hasAttribute('data-usage-tracking')) {
            link.setAttribute('data-usage-tracking', 'true');
            link.addEventListener('click', function(e) {
                const toolName = this.textContent;
                const toolUrl = this.getAttribute('href');
                
                // 延迟记录，确保页面跳转不受影响
                setTimeout(() => {
                    recordToolUsage(toolName, toolUrl);
                }, 50);
            });
        }
    });
    
    // 自动记录当前页面访问（如果是工具页面）
    const currentUrl = window.location.pathname + window.location.search;
    const isToolPage = /\/tools\//.test(currentUrl);
    
    if (isToolPage) {
        // 延迟记录，确保页面完全加载
        setTimeout(() => {
            // 优先从URL提取工具名称，避免页面标题中的描述信息
            const extractedToolName = extractToolName('', currentUrl);
            recordToolUsage(extractedToolName, currentUrl);
        }, 1000);
    }
    
    // 添加调试功能（仅在开发环境）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // 在控制台提供调试命令
        window.getUsageStats = getToolUsageStats;
        window.cleanupRecords = cleanupDuplicateRecords;
        window.clearAllUsage = function() {
            localStorage.removeItem('toolUsage');
            localStorage.removeItem('usageDataCleaned_v2');
            localStorage.removeItem('usageDataCleaned_v3');
            console.log('所有使用记录已清除');
        };
        console.log('调试功能已启用：getUsageStats(), cleanupRecords(), clearAllUsage()');
    }
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