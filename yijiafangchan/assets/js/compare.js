/**
 * 房产对比系统
 * 支持多个房产信息的并排对比分析
 */

class PropertyCompare {
    constructor() {
        this.properties = [];
        this.selectedProperties = [];
        this.maxCompareCount = 4;
        
        this.init();
    }
    
    /**
     * 初始化对比系统
     */
    init() {
        this.loadPropertyData();
        this.renderPropertySelector();
        this.updateUI();
        
        console.log('[PropertyCompare] 房产对比系统初始化完成');
    }
    
    /**
     * 加载房产数据
     */
    loadPropertyData() {
        // 扩展房产数据，包含更多对比信息
        this.properties = [
            {
                id: 1,
                name: '金桂花园',
                type: 'house',
                price: 150,
                priceUnit: '万',
                location: '大丰区新丰镇',
                area: '120㎡',
                buildYear: '2022',
                floors: '18层',
                households: '288户',
                developer: '宜家房产',
                image: 'assets/images/property1.jpg',
                features: ['精装修', '学区房', '地铁沿线', '停车位'],
                avgPrice: 12500,
                totalPrice: 150,
                downPayment: 45,
                greenRate: '40%',
                parkingRate: '1:1.2',
                
                // 各项评分 (1-5分)
                transport: { subway: 4, bus: 5, highway: 3, airport: 2 },
                education: { kindergarten: 5, primary: 5, middle: 4, university: 2 },
                medical: { hospital: 4, clinic: 5, pharmacy: 5 },
                commercial: { shopping: 4, supermarket: 5, restaurant: 4, bank: 5 },
                environment: { park: 4, greenRate: 4, airQuality: 4, noise: 4 },
                facilities: { parking: 5, gym: 3, pool: 2, security: 5 }
            },
            {
                id: 2,
                name: '海景公寓',
                type: 'apartment',
                price: 85,
                priceUnit: '万',
                location: '大丰区海洋新城',
                area: '89㎡',
                buildYear: '2023',
                floors: '26层',
                households: '156户',
                developer: '宜家房产',
                image: 'assets/images/property2.jpg',
                features: ['海景房', '现房', '投资热点', '配套成熟'],
                avgPrice: 9551,
                totalPrice: 85,
                downPayment: 25.5,
                greenRate: '35%',
                parkingRate: '1:0.8',
                
                transport: { subway: 2, bus: 4, highway: 4, airport: 5 },
                education: { kindergarten: 3, primary: 3, middle: 3, university: 1 },
                medical: { hospital: 3, clinic: 4, pharmacy: 4 },
                commercial: { shopping: 5, supermarket: 4, restaurant: 5, bank: 4 },
                environment: { park: 5, greenRate: 3, airQuality: 5, noise: 3 },
                facilities: { parking: 3, gym: 4, pool: 5, security: 4 }
            },
            {
                id: 3,
                name: '书香别墅',
                type: 'villa',
                price: 380,
                priceUnit: '万',
                location: '大丰区恒北村',
                area: '280㎡',
                buildYear: '2023',
                floors: '3层',
                households: '68户',
                developer: '宜家房产',
                image: 'assets/images/property3.jpg',
                features: ['独栋别墅', '私家花园', '高端社区', '品质装修'],
                avgPrice: 13571,
                totalPrice: 380,
                downPayment: 114,
                greenRate: '60%',
                parkingRate: '1:2',
                
                transport: { subway: 1, bus: 3, highway: 2, airport: 1 },
                education: { kindergarten: 4, primary: 4, middle: 5, university: 3 },
                medical: { hospital: 2, clinic: 3, pharmacy: 3 },
                commercial: { shopping: 2, supermarket: 3, restaurant: 2, bank: 3 },
                environment: { park: 5, greenRate: 5, airQuality: 5, noise: 5 },
                facilities: { parking: 5, gym: 5, pool: 4, security: 5 }
            },
            {
                id: 4,
                name: '阳光花城',
                type: 'house',
                price: 125,
                priceUnit: '万',
                location: '大丰区城东新区',
                area: '98㎡',
                buildYear: '2022',
                floors: '11层',
                households: '368户',
                developer: '宜家房产',
                image: 'assets/images/property4.jpg',
                features: ['现房', '学区房', '商业配套', '交通便利'],
                avgPrice: 12755,
                totalPrice: 125,
                downPayment: 37.5,
                greenRate: '38%',
                parkingRate: '1:1',
                
                transport: { subway: 5, bus: 5, highway: 4, airport: 3 },
                education: { kindergarten: 5, primary: 5, middle: 5, university: 4 },
                medical: { hospital: 5, clinic: 5, pharmacy: 5 },
                commercial: { shopping: 5, supermarket: 5, restaurant: 5, bank: 5 },
                environment: { park: 3, greenRate: 3, airQuality: 3, noise: 3 },
                facilities: { parking: 4, gym: 4, pool: 3, security: 4 }
            }
        ];
    }
    
    /**
     * 渲染房源选择器
     */
    renderPropertySelector() {
        const container = document.getElementById('propertySelector');
        
        const html = this.properties.map(property => `
            <div class="col-lg-4 col-md-6 mb-3">
                <div class="property-card-mini ${this.isSelected(property.id) ? 'selected' : ''}" 
                     onclick="propertyCompare.toggleProperty(${property.id})">
                     ${this.isSelected(property.id) ? `<div class="select-badge">${this.getSelectedIndex(property.id)}</div>` : ''}
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img src="${property.image}" alt="${property.name}" class="img-fluid rounded"
                                 onerror="this.src='assets/images/placeholder.jpg'">
                        </div>
                        <div class="col-8">
                            <h6 class="mb-1">${property.name}</h6>
                            <p class="text-muted mb-1 small">${property.location}</p>
                            <p class="text-primary fw-bold mb-2">${property.price}${property.priceUnit}</p>
                            <div class="mb-1">
                                ${property.features.slice(0, 2).map(feature => 
                                    `<span class="badge bg-light text-dark me-1" style="font-size: 10px;">${feature}</span>`
                                ).join('')}
                            </div>
                            <p class="small text-muted mb-0">${property.area}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 切换房源选择状态
     */
    toggleProperty(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (!property) return;
        
        const selectedIndex = this.selectedProperties.findIndex(p => p.id === propertyId);
        
        if (selectedIndex > -1) {
            // 取消选择
            this.selectedProperties.splice(selectedIndex, 1);
        } else {
            // 添加选择
            if (this.selectedProperties.length >= this.maxCompareCount) {
                alert(`最多只能对比 ${this.maxCompareCount} 个房源`);
                return;
            }
            this.selectedProperties.push(property);
        }
        
        this.updateUI();
    }
    
    /**
     * 清空所有选择
     */
    clearAll() {
        this.selectedProperties = [];
        this.updateUI();
    }
    
    /**
     * 检查是否已选择
     */
    isSelected(propertyId) {
        return this.selectedProperties.some(p => p.id === propertyId);
    }
    
    /**
     * 获取选中序号
     */
    getSelectedIndex(propertyId) {
        const index = this.selectedProperties.findIndex(p => p.id === propertyId);
        return index > -1 ? index + 1 : '';
    }
    
    /**
     * 更新UI
     */
    updateUI() {
        this.renderPropertySelector();
        this.updateSelectedCount();
        
        if (this.selectedProperties.length >= 2) {
            this.renderCompareTable();
            this.renderSummary();
            document.getElementById('compareTable').style.display = 'block';
            document.getElementById('comparisonSummary').style.display = 'block';
            document.getElementById('quickActions').style.display = 'block';
        } else {
            document.getElementById('compareTable').style.display = 'none';
            document.getElementById('comparisonSummary').style.display = 'none';
            document.getElementById('quickActions').style.display = 'none';
        }
    }
    
    /**
     * 更新选择计数
     */
    updateSelectedCount() {
        document.getElementById('selectedCount').textContent = 
            `已选择: ${this.selectedProperties.length}/${this.maxCompareCount}`;
    }
    
    /**
     * 渲染对比表格
     */
    renderCompareTable() {
        this.renderTableHeader();
        this.renderTableBody();
    }
    
    /**
     * 渲染表格头部
     */
    renderTableHeader() {
        const header = document.getElementById('compareTableHeader');
        
        let headerHtml = '<th class="row-label">对比项目</th>';
        this.selectedProperties.forEach((property, index) => {
            headerHtml += `
                <th class="property-column position-relative">
                    <button class="remove-property" onclick="propertyCompare.removeProperty(${property.id})" title="移除对比">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${property.image}" alt="${property.name}" class="property-image"
                         onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="property-name">${property.name}</div>
                    <div class="property-price">${property.price}${property.priceUnit}</div>
                    <div class="text-muted small">${property.location}</div>
                    <div class="text-muted small">${property.area}</div>
                </th>
            `;
        });
        
        // 填充空槽位
        for (let i = this.selectedProperties.length; i < this.maxCompareCount; i++) {
            headerHtml += `
                <th class="property-column">
                    <div class="empty-slot">
                        <i class="fas fa-plus fa-2x mb-2"></i>
                        <p>点击左侧楼盘<br>添加到对比</p>
                    </div>
                </th>
            `;
        }
        
        header.innerHTML = headerHtml;
    }
    
    /**
     * 渲染表格主体
     */
    renderTableBody() {
        const tbody = document.getElementById('compareTableBody');
        let bodyHtml = '';
        
        // 基本信息
        bodyHtml += this.renderCompareCategory('基本信息', [
            { label: '建设年份', key: 'buildYear' },
            { label: '总楼层', key: 'floors' },
            { label: '总户数', key: 'households' },
            { label: '开发商', key: 'developer' },
            { label: '单价', key: 'avgPrice', format: '￥/㎡' },
            { label: '首付', key: 'downPayment', format: '万' },
            { label: '绿化率', key: 'greenRate' },
            { label: '停车配比', key: 'parkingRate' }
        ]);
        
        // 交通配套
        bodyHtml += this.renderScoreCategory('交通配套', 'transport', {
            subway: '地铁', bus: '公交', highway: '高速', airport: '机场'
        });
        
        // 教育配套
        bodyHtml += this.renderScoreCategory('教育配套', 'education', {
            kindergarten: '幼儿园', primary: '小学', middle: '中学', university: '大学'
        });
        
        // 医疗配套
        bodyHtml += this.renderScoreCategory('医疗配套', 'medical', {
            hospital: '医院', clinic: '诊所', pharmacy: '药店'
        });
        
        // 商业配套
        bodyHtml += this.renderScoreCategory('商业配套', 'commercial', {
            shopping: '商场', supermarket: '超市', restaurant: '餐饮', bank: '银行'
        });
        
        // 环境配套
        bodyHtml += this.renderScoreCategory('环境配套', 'environment', {
            park: '公园', greenRate: '绿化', airQuality: '空气质量', noise: '噪音控制'
        });
        
        // 小区配套
        bodyHtml += this.renderScoreCategory('小区配套', 'facilities', {
            parking: '停车位', gym: '健身房', pool: '游泳池', security: '安保'
        });
        
        // 房源特色
        bodyHtml += this.renderFeatureComparison();
        
        tbody.innerHTML = bodyHtml;
    }
    
    /**
     * 渲染对比类别
     */
    renderCompareCategory(categoryName, fields) {
        let html = `<tr class="compare-row"><td class="row-label" colspan="${this.maxCompareCount + 1}" style="text-align: center; background: var(--primary-color); color: white;">${categoryName}</td></tr>`;
        
        fields.forEach(field => {
            html += '<tr class="compare-row">';
            html += `<td class="row-label">${field.label}</td>`;
            
            this.selectedProperties.forEach(property => {
                let value = property[field.key];
                if (field.format && value) {
                    if (field.format === '￥/㎡') {
                        value = value.toLocaleString() + field.format;
                    } else {
                        value = value + field.format;
                    }
                }
                html += `<td class="row-value">${value || '-'}</td>`;
            });
            
            // 填充空列
            for (let i = this.selectedProperties.length; i < this.maxCompareCount; i++) {
                html += '<td class="row-value">-</td>';
            }
            
            html += '</tr>';
        });
        
        return html;
    }
    
    /**
     * 渲染评分类别
     */
    renderScoreCategory(categoryName, categoryKey, fieldNames) {
        let html = `<tr class="compare-row"><td class="row-label" colspan="${this.maxCompareCount + 1}" style="text-align: center; background: var(--primary-color); color: white;">${categoryName}</td></tr>`;
        
        Object.keys(fieldNames).forEach(fieldKey => {
            html += '<tr class="compare-row">';
            html += `<td class="row-label">${fieldNames[fieldKey]}</td>`;
            
            // 找出最高分用于标记优势
            const scores = this.selectedProperties.map(p => p[categoryKey] && p[categoryKey][fieldKey] || 0);
            const maxScore = Math.max(...scores);
            
            this.selectedProperties.forEach(property => {
                const score = property[categoryKey] && property[categoryKey][fieldKey] || 0;
                const stars = '★'.repeat(score) + '☆'.repeat(5 - score);
                const isAdvantage = score > 0 && score === maxScore && maxScore > 3;
                
                html += `<td class="row-value ${isAdvantage ? 'advantage' : ''}">
                    <span class="rating-stars">${stars}</span>
                    ${isAdvantage ? '<i class="fas fa-trophy ms-1"></i>' : ''}
                </td>`;
            });
            
            // 填充空列
            for (let i = this.selectedProperties.length; i < this.maxCompareCount; i++) {
                html += '<td class="row-value">-</td>';
            }
            
            html += '</tr>';
        });
        
        return html;
    }
    
    /**
     * 渲染特色对比
     */
    renderFeatureComparison() {
        let html = `<tr class="compare-row"><td class="row-label" colspan="${this.maxCompareCount + 1}" style="text-align: center; background: var(--primary-color); color: white;">房源特色</td></tr>`;
        
        html += '<tr class="compare-row">';
        html += '<td class="row-label">特色标签</td>';
        
        this.selectedProperties.forEach(property => {
            const featuresHtml = property.features.map(feature => 
                `<span class="feature-badge">${feature}</span>`
            ).join('');
            html += `<td class="row-value">${featuresHtml}</td>`;
        });
        
        // 填充空列
        for (let i = this.selectedProperties.length; i < this.maxCompareCount; i++) {
            html += '<td class="row-value">-</td>';
        }
        
        html += '</tr>';
        return html;
    }
    
    /**
     * 移除房源
     */
    removeProperty(propertyId) {
        const index = this.selectedProperties.findIndex(p => p.id === propertyId);
        if (index > -1) {
            this.selectedProperties.splice(index, 1);
            this.updateUI();
        }
    }
    
    /**
     * 渲染智能推荐
     */
    renderSummary() {
        const container = document.getElementById('summaryContent');
        
        if (this.selectedProperties.length < 2) {
            container.innerHTML = '';
            return;
        }
        
        const analysis = this.analyzeProperties();
        
        let html = `
            <div class="summary-item">
                <div class="summary-icon"><i class="fas fa-crown"></i></div>
                <div><strong>性价比之王：</strong>${analysis.bestValue.name} - 综合评分最高，性价比突出</div>
            </div>
        `;
        
        if (analysis.mostAffordable.id !== analysis.bestValue.id) {
            html += `
                <div class="summary-item">
                    <div class="summary-icon"><i class="fas fa-piggy-bank"></i></div>
                    <div><strong>经济实惠：</strong>${analysis.mostAffordable.name} - 价格最低，适合首次置业</div>
                </div>
            `;
        }
        
        html += `
            <div class="summary-item">
                <div class="summary-icon"><i class="fas fa-graduation-cap"></i></div>
                <div><strong>学区房推荐：</strong>${analysis.bestEducation.name} - 教育资源最丰富</div>
            </div>
            <div class="summary-item">
                <div class="summary-icon"><i class="fas fa-car"></i></div>
                <div><strong>交通便利：</strong>${analysis.bestTransport.name} - 出行最方便</div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * 分析房源数据
     */
    analyzeProperties() {
        const analysis = {
            bestValue: null,
            mostAffordable: null,
            bestEducation: null,
            bestTransport: null
        };
        
        // 找出最便宜的
        analysis.mostAffordable = this.selectedProperties.reduce((prev, current) => 
            (prev.price < current.price) ? prev : current
        );
        
        // 计算综合评分
        const scores = this.selectedProperties.map(property => {
            let totalScore = 0;
            let categories = 0;
            
            ['transport', 'education', 'medical', 'commercial', 'environment', 'facilities'].forEach(category => {
                if (property[category]) {
                    const categoryScore = Object.values(property[category]).reduce((sum, score) => sum + score, 0);
                    totalScore += categoryScore;
                    categories++;
                }
            });
            
            // 考虑性价比因素
            const priceScore = 5 - (property.price / analysis.mostAffordable.price - 1) * 2;
            totalScore += Math.max(1, priceScore) * 4;
            
            return {
                property,
                score: categories > 0 ? totalScore / (categories + 1) : 0
            };
        });
        
        analysis.bestValue = scores.reduce((prev, current) => 
            prev.score > current.score ? prev : current
        ).property;
        
        // 教育最好的
        const educationScores = this.selectedProperties.map(property => ({
            property,
            score: property.education ? Object.values(property.education).reduce((sum, score) => sum + score, 0) : 0
        }));
        analysis.bestEducation = educationScores.reduce((prev, current) => 
            prev.score > current.score ? prev : current
        ).property;
        
        // 交通最好的
        const transportScores = this.selectedProperties.map(property => ({
            property,
            score: property.transport ? Object.values(property.transport).reduce((sum, score) => sum + score, 0) : 0
        }));
        analysis.bestTransport = transportScores.reduce((prev, current) => 
            prev.score > current.score ? prev : current
        ).property;
        
        return analysis;
    }
    
    /**
     * 导出对比报告
     */
    exportComparison() {
        if (this.selectedProperties.length < 2) {
            alert('请至少选择2个房源进行对比');
            return;
        }
        
        const analysis = this.analyzeProperties();
        
        let report = '宜家房产 - 房源对比报告\n';
        report += '='.repeat(40) + '\n\n';
        report += `对比时间: ${new Date().toLocaleString()}\n`;
        report += `对比房源: ${this.selectedProperties.map(p => p.name).join('、')}\n\n`;
        
        // 基本信息对比
        report += '基本信息对比:\n';
        report += '-'.repeat(20) + '\n';
        this.selectedProperties.forEach(property => {
            report += `${property.name}:\n`;
            report += `  位置: ${property.location}\n`;
            report += `  价格: ${property.price}${property.priceUnit}\n`;
            report += `  面积: ${property.area}\n`;
            report += `  建设年份: ${property.buildYear}\n\n`;
        });
        
        // 智能推荐
        report += '智能推荐:\n';
        report += '-'.repeat(20) + '\n';
        report += `性价比之王: ${analysis.bestValue.name}\n`;
        report += `经济实惠: ${analysis.mostAffordable.name}\n`;
        report += `学区房推荐: ${analysis.bestEducation.name}\n`;
        report += `交通便利: ${analysis.bestTransport.name}\n\n`;
        
        // 创建下载链接
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `房源对比报告_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('对比报告已下载到本地！');
    }
    
    /**
     * 分享对比
     */
    shareComparison() {
        if (this.selectedProperties.length < 2) {
            alert('请至少选择2个房源进行对比');
            return;
        }
        
        const propertyNames = this.selectedProperties.map(p => p.name).join('、');
        const shareText = `我在宜家房产网站对比了${propertyNames}，快来看看哪个更适合！`;
        const shareUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: '房源对比 - 宜家房产',
                text: shareText,
                url: shareUrl
            });
        } else {
            // 复制到剪贴板
            const textToCopy = `${shareText} ${shareUrl}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('对比链接已复制到剪贴板！');
                });
            } else {
                alert('分享链接：' + shareUrl);
            }
        }
    }
    
    /**
     * 获取对比统计
     */
    getStats() {
        return {
            totalProperties: this.properties.length,
            selectedCount: this.selectedProperties.length,
            selectedProperties: this.selectedProperties.map(p => p.name)
        };
    }
}

// 全局实例
let propertyCompare;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    propertyCompare = new PropertyCompare();
});

// 暴露到全局
window.PropertyCompare = PropertyCompare;
window.propertyCompare = propertyCompare;