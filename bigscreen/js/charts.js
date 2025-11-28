// 数据可视化图表配置文件
// 本文件使用ECharts实现各种图表的初始化和配置

// 图表颜色主题
const chartColors = {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399',
    gradient1: '#409eff',
    gradient2: '#67c23a',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(64, 158, 255, 0.2)'
};

// 图表通用配置
const commonChartOptions = {
    backgroundColor: 'transparent',
    textStyle: {
        color: '#e6f1ff'
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: chartColors.primary,
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
    },
    legend: {
        textStyle: {
            color: '#a0cfff'
        }
    }
};

/**
 * 初始化趋势分析图表
 * @param {string} chartId - 图表容器ID
 */
function initTrendChart(chartId) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        ...commonChartOptions,
        title: {
            text: '数据趋势',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#409eff',
                fontSize: 16
            }
        },
        tooltip: {
            ...commonChartOptions.tooltip,
            trigger: 'axis'
        },
        legend: {
            data: ['用户增长', '数据流量'],
            top: '10%'
        },
        grid: {
            ...commonChartOptions.grid,
            top: '20%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            axisLine: {
                lineStyle: {
                    color: chartColors.border
                }
            },
            axisLabel: {
                color: '#a0cfff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: chartColors.border
                }
            },
            axisLabel: {
                color: '#a0cfff'
            },
            splitLine: {
                lineStyle: {
                    color: chartColors.border
                }
            }
        },
        series: [
            {
                name: '用户增长',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: chartColors.primary
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                        { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
                    ])
                },
                emphasis: {
                    focus: 'series'
                }
            },
            {
                name: '数据流量',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: chartColors.success
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(103, 194, 58, 0.5)' },
                        { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
                    ])
                },
                emphasis: {
                    focus: 'series'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
    
    return chart;
}

/**
 * 初始化数据分布饼图
 * @param {string} chartId - 图表容器ID
 */
function initDistributionChart(chartId) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        ...commonChartOptions,
        title: {
            text: '数据类型分布',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#409eff',
                fontSize: 16
            }
        },
        tooltip: {
            ...commonChartOptions.tooltip,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: '5%',
            data: ['类型A', '类型B', '类型C', '类型D', '类型E']
        },
        series: [
            {
                name: '数据分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#0a0f1e',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 335, name: '类型A', itemStyle: { color: chartColors.primary } },
                    { value: 310, name: '类型B', itemStyle: { color: chartColors.success } },
                    { value: 234, name: '类型C', itemStyle: { color: chartColors.warning } },
                    { value: 135, name: '类型D', itemStyle: { color: chartColors.danger } },
                    { value: 1548, name: '类型E', itemStyle: { color: chartColors.info } }
                ]
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
    
    return chart;
}

/**
 * 初始化主要仪表盘
 * @param {string} chartId - 图表容器ID
 */
function initMainDashboard(chartId) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        ...commonChartOptions,
        title: {
            text: '系统运行状态',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#409eff',
                fontSize: 18
            }
        },
        tooltip: {
            ...commonChartOptions.tooltip,
            trigger: 'axis'
        },
        legend: {
            data: ['CPU使用率', '内存使用率', '网络流量'],
            top: '10%'
        },
        grid: {
            ...commonChartOptions.grid,
            top: '20%',
            height: '70%'
        },
        xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: {
                lineStyle: {
                    color: chartColors.border
                }
            },
            axisLabel: {
                color: '#a0cfff'
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '使用率 (%)',
                min: 0,
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: chartColors.border
                    }
                },
                axisLabel: {
                    color: '#a0cfff',
                    formatter: '{value} %'
                },
                splitLine: {
                    lineStyle: {
                        color: chartColors.border
                    }
                }
            },
            {
                type: 'value',
                name: '流量 (MB/s)',
                min: 0,
                max: 100,
                axisLine: {
                    lineStyle: {
                        color: chartColors.border
                    }
                },
                axisLabel: {
                    color: '#a0cfff',
                    formatter: '{value} MB'
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: 'CPU使用率',
                type: 'line',
                data: [40, 45, 52, 48, 55, 58, 60, 55, 50, 45, 42, 40],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: chartColors.danger
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(245, 108, 108, 0.5)' },
                        { offset: 1, color: 'rgba(245, 108, 108, 0.1)' }
                    ])
                }
            },
            {
                name: '内存使用率',
                type: 'line',
                data: [65, 68, 70, 72, 68, 65, 63, 65, 68, 70, 68, 66],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: chartColors.warning
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(230, 162, 60, 0.5)' },
                        { offset: 1, color: 'rgba(230, 162, 60, 0.1)' }
                    ])
                }
            },
            {
                name: '网络流量',
                type: 'bar',
                yAxisIndex: 1,
                data: [20, 35, 25, 40, 35, 45, 30, 35, 40, 30, 25, 35],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: chartColors.primary },
                        { offset: 1, color: chartColors.primary + '80' }
                    ])
                },
                barWidth: '60%'
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
    
    return chart;
}

/**
 * 初始化排行榜图表
 * @param {string} chartId - 图表容器ID
 */
function initRankingChart(chartId) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        ...commonChartOptions,
        title: {
            text: '数据量排行榜',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#409eff',
                fontSize: 16
            }
        },
        tooltip: {
            ...commonChartOptions.tooltip,
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            ...commonChartOptions.grid,
            top: '15%',
            height: '75%'
        },
        xAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: chartColors.border
                }
            },
            axisLabel: {
                color: '#a0cfff'
            },
            splitLine: {
                lineStyle: {
                    color: chartColors.border
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['服务器E', '服务器D', '服务器C', '服务器B', '服务器A'],
            axisLine: {
                lineStyle: {
                    color: chartColors.border
                }
            },
            axisLabel: {
                color: '#a0cfff'
            }
        },
        series: [
            {
                name: '数据量',
                type: 'bar',
                data: [100, 200, 300, 400, 500],
                itemStyle: {
                    color: function(params) {
                        // 渐变色
                        const colorList = [
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                                { offset: 1, color: chartColors.primary }
                            ]),
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(64, 158, 255, 0.6)' },
                                { offset: 1, color: chartColors.primary }
                            ]),
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(64, 158, 255, 0.7)' },
                                { offset: 1, color: chartColors.primary }
                            ]),
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(64, 158, 255, 0.8)' },
                                { offset: 1, color: chartColors.primary }
                            ]),
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(64, 158, 255, 0.9)' },
                                { offset: 1, color: chartColors.primary }
                            ])
                        ];
                        return colorList[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    color: '#fff'
                },
                barWidth: '60%'
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
    
    return chart;
}

/**
 * 初始化地理分布图表
 * @param {string} chartId - 图表容器ID
 */
function initGeoChart(chartId) {
    const chartDom = document.getElementById(chartId);
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    // 模拟中国地图数据（由于没有实际的中国地图JSON，使用散点图代替）
    const geoData = [
        { name: '北京', value: [116.46, 39.92, 200] },
        { name: '上海', value: [121.48, 31.22, 300] },
        { name: '广州', value: [113.26, 23.13, 250] },
        { name: '深圳', value: [114.07, 22.55, 280] },
        { name: '成都', value: [104.07, 30.67, 180] },
        { name: '杭州', value: [120.19, 30.26, 220] },
        { name: '武汉', value: [114.31, 30.52, 190] },
        { name: '西安', value: [108.95, 34.34, 170] },
        { name: '重庆', value: [106.55, 29.56, 210] },
        { name: '南京', value: [118.78, 32.04, 200] }
    ];
    
    const option = {
        ...commonChartOptions,
        title: {
            text: '数据地理分布',
            left: 'center',
            top: 0,
            textStyle: {
                color: '#409eff',
                fontSize: 16
            }
        },
        tooltip: {
            ...commonChartOptions.tooltip,
            trigger: 'item',
            formatter: function(params) {
                return params.name + '<br/>数据量: ' + params.value[2];
            }
        },
        grid: {
            ...commonChartOptions.grid,
            top: '15%',
            height: '75%'
        },
        xAxis: {
            type: 'value',
            min: 73,
            max: 135,
            show: false
        },
        yAxis: {
            type: 'value',
            min: 18,
            max: 53,
            show: false
        },
        series: [
            {
                name: '数据分布',
                type: 'scatter',
                coordinateSystem: 'cartesian2d',
                data: geoData.map(function(item) {
                    return {
                        name: item.name,
                        value: [item.value[0], item.value[1]],
                        size: item.value[2] / 10
                    };
                }),
                symbolSize: function(data) {
                    return data[2];
                },
                itemStyle: {
                    color: chartColors.primary,
                    opacity: 0.8
                },
                emphasis: {
                    itemStyle: {
                        color: chartColors.warning,
                        opacity: 1
                    },
                    label: {
                        show: true,
                        formatter: '{b}',
                        position: 'top',
                        color: '#fff'
                    }
                }
            },
            {
                name: '数据热力',
                type: 'heatmap',
                coordinateSystem: 'cartesian2d',
                data: geoData.map(function(item) {
                    return [item.value[0], item.value[1], item.value[2]];
                }),
                label: {
                    show: false
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                progressive: 1000,
                animation: false
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
    
    return chart;
}

/**
 * 更新图表数据
 * @param {Object} chart - ECharts实例
 * @param {Array} data - 新数据
 * @param {string} seriesName - 系列名称
 */
function updateChartData(chart, data, seriesName) {
    if (!chart || !data) return;
    
    chart.setOption({
        series: [
            {
                name: seriesName,
                data: data
            }
        ]
    });
}

/**
 * 初始化所有图表
 * @returns {Object} 包含所有图表实例的对象
 */
function initAllCharts() {
    // 初始化各个图表
    const trendChart = initTrendChart('trend-chart');
    const distributionChart = initDistributionChart('distribution-chart');
    const mainDashboard = initMainDashboard('main-dashboard');
    const rankingChart = initRankingChart('ranking-chart');
    const geoChart = initGeoChart('geo-chart');
    
    // 创建图表对象
    const charts = {
        trendChart,
        distributionChart,
        mainDashboard,
        rankingChart,
        geoChart
    };
    
    // 存储到全局对象中
    window.charts = charts;
    
    return charts;
}

// 全局导出函数
window.initAllCharts = initAllCharts;
window.updateChartData = updateChartData;
window.chartColors = chartColors;

// 存储图表实例到全局变量
window.charts = {};