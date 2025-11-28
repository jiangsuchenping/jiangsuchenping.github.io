// 数据模拟文件
// 生成模拟数据并提供数据更新功能

/**
 * 生成随机数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {boolean} isInteger - 是否为整数
 * @returns {number} 随机数
 */
function getRandomNumber(min, max, isInteger = true) {
    const random = Math.random() * (max - min) + min;
    return isInteger ? Math.floor(random) : random;
}

/**
 * 生成随机时间字符串
 * @returns {string} 时间字符串，格式为HH:MM:SS
 */
function getRandomTimeString() {
    const hours = getRandomNumber(0, 23).toString().padStart(2, '0');
    const minutes = getRandomNumber(0, 59).toString().padStart(2, '0');
    const seconds = getRandomNumber(0, 59).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * 生成随机告警级别
 * @returns {string} 告警级别 (normal, warning, critical)
 */
function getRandomAlarmLevel() {
    const levels = ['normal', 'warning', 'critical'];
    const weights = [0.7, 0.2, 0.1]; // 权重分布
    
    const rand = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
            return levels[i];
        }
    }
    
    return levels[0];
}

/**
 * 生成随机状态
 * @returns {string} 状态 (normal, warning, error)
 */
function getRandomStatus() {
    const statuses = ['normal', 'warning', 'error'];
    const weights = [0.85, 0.1, 0.05]; // 权重分布
    
    const rand = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
            return statuses[i];
        }
    }
    
    return statuses[0];
}

/**
 * 生成模拟告警消息
 * @returns {string} 告警消息
 */
function getRandomAlarmMessage() {
    const messages = [
        '服务器CPU使用率过高',
        '内存使用率超过阈值',
        '网络连接异常',
        '磁盘空间不足',
        '数据库响应超时',
        '服务重启成功',
        '数据同步完成',
        '新用户登录',
        '配置更新成功',
        '系统负载正常'
    ];
    
    return messages[getRandomNumber(0, messages.length - 1)];
}

/**
 * 生成数据卡片模拟数据
 * @returns {Array} 数据卡片数组
 */
function generateDataCardsData() {
    return [
        {
            value: getRandomNumber(10000, 50000),
            label: '总用户数',
            icon: 'fas fa-users'
        },
        {
            value: getRandomNumber(5000, 20000),
            label: '在线用户',
            icon: 'fas fa-user-check'
        },
        {
            value: getRandomNumber(100000, 1000000),
            label: '数据总量',
            icon: 'fas fa-database'
        },
        {
            value: getRandomNumber(50, 200),
            label: '响应时间(ms)',
            icon: 'fas fa-tachometer-alt'
        }
    ];
}

/**
 * 生成监控项模拟数据
 * @returns {Array} 监控项数组
 */
function generateMonitorItemsData() {
    return [
        {
            name: 'CPU使用率',
            value: getRandomNumber(40, 95)
        },
        {
            name: '内存占用',
            value: getRandomNumber(50, 90)
        },
        {
            name: '磁盘使用率',
            value: getRandomNumber(30, 85)
        },
        {
            name: '网络流量',
            value: getRandomNumber(20, 80)
        },
        {
            name: '请求成功率',
            value: getRandomNumber(90, 100)
        },
        {
            name: '服务可用性',
            value: getRandomNumber(95, 100)
        }
    ];
}

/**
 * 生成告警列表模拟数据
 * @param {number} count - 告警数量
 * @returns {Array} 告警数组
 */
function generateAlarmListData(count = 5) {
    const alarms = [];
    
    for (let i = 0; i < count; i++) {
        alarms.push({
            time: getRandomTimeString(),
            message: getRandomAlarmMessage(),
            level: getRandomAlarmLevel()
        });
    }
    
    // 按时间排序（最新的在前）
    return alarms.sort((a, b) => b.time.localeCompare(a.time));
}

/**
 * 生成状态指示器模拟数据
 * @param {number} count - 状态数量
 * @returns {Array} 状态数组
 */
function generateStatusIndicatorsData(count = 4) {
    const statuses = [];
    
    for (let i = 0; i < count; i++) {
        statuses.push({
            status: getRandomStatus()
        });
    }
    
    return statuses;
}

/**
 * 生成趋势图表模拟数据
 * @param {number} points - 数据点数量
 * @returns {Object} 趋势数据对象
 */
function generateTrendChartData(points = 7) {
    const userGrowth = [];
    const dataFlow = [];
    
    for (let i = 0; i < points; i++) {
        userGrowth.push(getRandomNumber(50, 300));
        dataFlow.push(getRandomNumber(100, 400));
    }
    
    return {
        userGrowth,
        dataFlow
    };
}

/**
 * 生成分布图表模拟数据
 * @returns {Array} 分布数据数组
 */
function generateDistributionChartData() {
    return [
        { value: getRandomNumber(100, 500), name: '类型A' },
        { value: getRandomNumber(100, 500), name: '类型B' },
        { value: getRandomNumber(100, 500), name: '类型C' },
        { value: getRandomNumber(100, 500), name: '类型D' },
        { value: getRandomNumber(500, 2000), name: '类型E' }
    ];
}

/**
 * 生成仪表盘模拟数据
 * @returns {Object} 仪表盘数据对象
 */
function generateDashboardData() {
    const cpuData = [];
    const memoryData = [];
    const networkData = [];
    
    for (let i = 0; i < 12; i++) {
        cpuData.push(getRandomNumber(30, 95));
        memoryData.push(getRandomNumber(40, 90));
        networkData.push(getRandomNumber(10, 50));
    }
    
    return {
        cpuData,
        memoryData,
        networkData
    };
}

/**
 * 生成排行榜模拟数据
 * @returns {Array} 排行榜数据数组
 */
function generateRankingChartData() {
    return [
        { name: '服务器E', value: getRandomNumber(50, 200) },
        { name: '服务器D', value: getRandomNumber(100, 300) },
        { name: '服务器C', value: getRandomNumber(200, 400) },
        { name: '服务器B', value: getRandomNumber(300, 500) },
        { name: '服务器A', value: getRandomNumber(400, 600) }
    ];
}

/**
 * 生成地理分布模拟数据
 * @returns {Array} 地理数据数组
 */
function generateGeoChartData() {
    const cities = [
        { name: '北京', value: [116.46, 39.92] },
        { name: '上海', value: [121.48, 31.22] },
        { name: '广州', value: [113.26, 23.13] },
        { name: '深圳', value: [114.07, 22.55] },
        { name: '成都', value: [104.07, 30.67] },
        { name: '杭州', value: [120.19, 30.26] },
        { name: '武汉', value: [114.31, 30.52] },
        { name: '西安', value: [108.95, 34.34] },
        { name: '重庆', value: [106.55, 29.56] },
        { name: '南京', value: [118.78, 32.04] }
    ];
    
    return cities.map(city => ({
        name: city.name,
        value: [...city.value, getRandomNumber(100, 500)]
    }));
}

/**
 * 生成完整的模拟数据
 * @returns {Object} 包含所有模拟数据的对象
 */
function generateMockData() {
    return {
        dataCards: generateDataCardsData(),
        monitorItems: generateMonitorItemsData(),
        alarmList: generateAlarmListData(),
        statusIndicators: generateStatusIndicatorsData(),
        trendChart: generateTrendChartData(),
        distributionChart: generateDistributionChartData(),
        dashboard: generateDashboardData(),
        rankingChart: generateRankingChartData(),
        geoChart: generateGeoChartData()
    };
}

/**
 * 模拟数据更新函数
 * 此函数会动态更新图表数据
 */
function simulateDataUpdate() {
    try {
        // 尝试导入图表模块
        // 注意：在某些环境中，可能需要全局变量来访问图表实例
        let charts = {};
        
        try {
            // 尝试从全局变量获取图表实例
            if (window.charts) {
                charts = window.charts;
            } else {
                // 尝试重新初始化图表以获取实例
                import('./charts.js').then(module => {
                    charts = module.initAllCharts();
                    // 存储到全局变量以便后续使用
                    window.charts = charts;
                }).catch(err => {
                    console.log('无法重新初始化图表:', err);
                });
            }
        } catch (e) {
            console.log('无法直接获取图表实例，将使用备用更新方式');
        }
        
        // 更新趋势图数据
        if (charts.trendChart) {
            const trendData = generateTrendChartData();
            charts.trendChart.setOption({
                series: [
                    { name: '用户增长', data: trendData.userGrowth },
                    { name: '数据流量', data: trendData.dataFlow }
                ]
            });
        }
        
        // 更新分布图数据
        if (charts.distributionChart) {
            const distributionData = generateDistributionChartData();
            charts.distributionChart.setOption({
                series: [{
                    data: distributionData.map((item, index) => ({
                        ...item,
                        itemStyle: {
                            color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'][index]
                        }
                    }))
                }]
            });
        }
        
        // 更新仪表盘数据
        if (charts.mainDashboard) {
            const dashboardData = generateDashboardData();
            charts.mainDashboard.setOption({
                series: [
                    { name: 'CPU使用率', data: dashboardData.cpuData },
                    { name: '内存使用率', data: dashboardData.memoryData },
                    { name: '网络流量', data: dashboardData.networkData }
                ]
            });
        }
        
        // 更新排行榜数据
        if (charts.rankingChart) {
            const rankingData = generateRankingChartData();
            charts.rankingChart.setOption({
                yAxis: {
                    data: rankingData.map(item => item.name).reverse()
                },
                series: [{
                    data: rankingData.map(item => item.value).reverse()
                }]
            });
        }
        
        // 更新地理分布图数据
        if (charts.geoChart) {
            const geoData = generateGeoChartData();
            charts.geoChart.setOption({
                series: [
                    {
                        name: '数据分布',
                        data: geoData.map(item => ({
                            name: item.name,
                            value: [item.value[0], item.value[1]],
                            size: item.value[2] / 10
                        }))
                    },
                    {
                        name: '数据热力',
                        data: geoData.map(item => item.value)
                    }
                ]
            });
        }
        
    } catch (error) {
        console.error('模拟数据更新失败:', error);
    }
}

/**
 * 获取增量更新数据（基于当前数据的小幅变化）
 * @param {number} currentValue - 当前值
 * @param {number} maxChangePercent - 最大变化百分比（默认5%）
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 更新后的值
 */
function getIncrementalUpdate(currentValue, maxChangePercent = 5, min = 0, max = 100) {
    // 计算最大变化量
    const maxChange = currentValue * (maxChangePercent / 100);
    
    // 随机生成变化量（可正可负）
    const change = (Math.random() - 0.5) * 2 * maxChange;
    
    // 计算新值并确保在有效范围内
    let newValue = currentValue + change;
    newValue = Math.max(min, Math.min(max, newValue));
    
    return newValue;
}

// 全局导出函数
window.generateMockData = generateMockData;
window.simulateDataUpdate = simulateDataUpdate;
window.getRandomNumber = getRandomNumber;
window.getRandomTimeString = getRandomTimeString;
window.getIncrementalUpdate = getIncrementalUpdate;