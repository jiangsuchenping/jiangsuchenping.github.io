/**
 * 房源地图功能
 * 展示房源位置，支持筛选和查看详情
 */

class PropertyMap {
    constructor() {
        this.properties = [];
        this.currentFilter = 'all';
        this.currentPriceFilter = 'all';
        this.selectedProperty = null;
        this.markers = [];
        
        this.init();
    }
    
    /**
     * 初始化地图功能
     */
    init() {
        this.loadPropertyData();
        this.initEventListeners();
        this.renderPropertyList();
        this.renderMap();
        
        console.log('[PropertyMap] 房源地图功能初始化完成');
    }
    
    /**
     * 加载房源数据
     */
    loadPropertyData() {
        // 模拟房源数据
        this.properties = [
            {
                id: 1,
                name: '金桂花园',
                type: 'house',
                price: 150,
                priceUnit: '万',
                area: '120㎡',
                location: '大丰区新丰镇',
                address: '新丰镇金桂大道188号',
                coordinates: { lat: 33.2001, lng: 120.4851 },
                image: 'assets/images/property1.jpg',
                description: '品质住宅小区，环境优美，配套齐全',
                features: ['精装修', '学区房', '地铁沿线', '停车位'],
                developer: '宜家房产',
                buildYear: '2022',
                floors: '18层',
                households: '288户'
            },
            {
                id: 2,
                name: '海景公寓',
                type: 'apartment',
                price: 85,
                priceUnit: '万',
                area: '89㎡',
                location: '大丰区海洋新城',
                address: '海洋新城滨海大道66号',
                coordinates: { lat: 33.1985, lng: 120.4901 },
                image: 'assets/images/property2.jpg',
                description: '海景公寓，视野开阔，投资自住两相宜',
                features: ['海景房', '现房', '投资热点', '配套成熟'],
                developer: '宜家房产',
                buildYear: '2023',
                floors: '26层',
                households: '156户'
            },
            {
                id: 3,
                name: '书香别墅',
                type: 'villa',
                price: 380,
                priceUnit: '万',
                area: '280㎡',
                location: '大丰区恒北村',
                address: '恒北村书香路8号',
                coordinates: { lat: 33.2103, lng: 120.4775 },
                image: 'assets/images/property3.jpg',
                description: '独栋别墅，园林式设计，高端生活品质',
                features: ['独栋别墅', '私家花园', '高端社区', '品质装修'],
                developer: '宜家房产',
                buildYear: '2023',
                floors: '3层',
                households: '68户'
            },
            {
                id: 4,
                name: '阳光花城',
                type: 'house',
                price: 125,
                priceUnit: '万',
                area: '98㎡',
                location: '大丰区城东新区',
                address: '城东新区康乐路168号',
                coordinates: { lat: 33.1945, lng: 120.4825 },
                image: 'assets/images/property4.jpg',
                description: '现代化小区，交通便利，生活配套完善',
                features: ['现房', '学区房', '商业配套', '交通便利'],
                developer: '宜家房产',
                buildYear: '2022',
                floors: '11层',
                households: '368户'
            },
            {
                id: 5,
                name: '翡翠湾',
                type: 'apartment',
                price: 195,
                priceUnit: '万',
                area: '135㎡',
                location: '大丰区港城路',
                address: '港城路翡翠湾小区',
                coordinates: { lat: 33.2055, lng: 120.4889 },
                image: 'assets/images/property5.jpg',
                description: '高端公寓，品质生活，投资首选',
                features: ['高端装修', '物业优质', '地段优越', '升值潜力'],
                developer: '宜家房产',
                buildYear: '2023',
                floors: '22层',
                households: '198户'
            },
            {
                id: 6,
                name: '绿野仙踪',
                type: 'villa',
                price: 520,
                priceUnit: '万',
                area: '320㎡',
                location: '大丰区港北新城',
                address: '港北新城绿野大道1号',
                coordinates: { lat: 33.2125, lng: 120.4695 },
                image: 'assets/images/property6.jpg',
                description: '顶级别墅区，私密性好，尊享品质生活',
                features: ['顶级别墅', '私家泳池', '会所配套', '24小时保安'],
                developer: '宜家房产',
                buildYear: '2024',
                floors: '4层',
                households: '32户'
            }
        ];
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 筛选按钮事件
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTypeFilter(e.target.dataset.filter);
            });
        });
        
        // 价格筛选事件
        document.getElementById('priceFilter').addEventListener('change', (e) => {
            this.handlePriceFilter(e.target.value);
        });
        
        // 联系按钮事件
        document.getElementById('contactBtn').addEventListener('click', () => {
            this.handleContact();
        });
    }
    
    /**
     * 处理类型筛选
     */
    handleTypeFilter(filter) {
        this.currentFilter = filter;
        
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.filterAndRender();
    }
    
    /**
     * 处理价格筛选
     */
    handlePriceFilter(filter) {
        this.currentPriceFilter = filter;
        this.filterAndRender();
    }
    
    /**
     * 筛选并渲染
     */
    filterAndRender() {
        this.renderPropertyList();
        this.renderMap();
    }
    
    /**
     * 渲染房源列表
     */
    renderPropertyList() {
        const filteredProperties = this.getFilteredProperties();
        const listContainer = document.getElementById('propertyList');
        const countBadge = document.getElementById('propertyCount');
        
        // 更新数量
        countBadge.textContent = filteredProperties.length;
        
        // 生成列表HTML
        const html = filteredProperties.map(property => `
            <div class="property-card" data-property-id="${property.id}" onclick="propertyMap.selectProperty(${property.id})">
                <div class="d-flex">
                    <div class="flex-shrink-0">
                        <img src="${property.image}" alt="${property.name}" class="rounded" 
                             style="width: 80px; height: 60px; object-fit: cover;" 
                             onerror="this.src='assets/images/placeholder.jpg'">
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-1">${property.name}</h6>
                        <p class="mb-1 text-muted">${property.location}</p>
                        <div class="d-flex justify-content-between align-items-end">
                            <span class="text-primary fw-bold">${property.price}${property.priceUnit}</span>
                            <small class="text-muted">${property.area}</small>
                        </div>
                        <div class="distance-info">
                            <i class="fas fa-map-marker-alt me-1"></i>
                            ${this.calculateDistance(property.coordinates)}km
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        listContainer.innerHTML = html;
    }
    
    /**
     * 渲染地图
     */
    renderMap() {
        const filteredProperties = this.getFilteredProperties();
        const mapContainer = document.getElementById('propertyMap');
        
        // 清空现有标记
        this.markers = [];
        
        // 创建模拟地图标记
        const mapHTML = `
            <div class="position-relative h-100" style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); overflow: hidden;">
                ${filteredProperties.map(property => this.createMapMarker(property)).join('')}
                <div class="position-absolute bottom-0 end-0 p-3">
                    <small class="text-muted">模拟地图视图 - 实际项目中集成真实地图API</small>
                </div>
            </div>
        `;
        
        mapContainer.innerHTML = mapHTML;
        
        // 绑定标记点击事件
        mapContainer.querySelectorAll('.property-marker').forEach(marker => {
            marker.addEventListener('click', (e) => {
                const propertyId = parseInt(e.target.closest('.property-marker').dataset.propertyId);
                this.selectProperty(propertyId);
            });
        });
    }
    
    /**
     * 创建地图标记
     */
    createMapMarker(property) {
        const colors = {
            house: '#2B5BB5',
            apartment: '#28a745',
            villa: '#ffc107'
        };
        
        // 根据坐标计算在模拟地图中的位置（转换为百分比）
        const left = ((property.coordinates.lng - 120.46) / 0.04) * 100;
        const top = 100 - ((property.coordinates.lat - 33.19) / 0.03) * 100;
        
        return `
            <div class="property-marker" 
                 data-property-id="${property.id}"
                 style="position: absolute; left: ${left}%; top: ${top}%; background: ${colors[property.type]};">
                ${property.id}
                <div class="marker-popup d-none">
                    <h6>${property.name}</h6>
                    <div class="property-info">${property.location}</div>
                    <div class="property-info">${property.area} • ${property.features[0]}</div>
                    <div class="property-price">${property.price}${property.priceUnit}</div>
                </div>
            </div>
        `;
    }
    
    /**
     * 选择房源
     */
    selectProperty(propertyId) {
        this.selectedProperty = this.properties.find(p => p.id === propertyId);
        
        // 更新列表选中状态
        document.querySelectorAll('.property-card').forEach(card => {
            card.classList.remove('active');
            if (parseInt(card.dataset.propertyId) === propertyId) {
                card.classList.add('active');
            }
        });
        
        // 更新地图标记状态
        document.querySelectorAll('.property-marker').forEach(marker => {
            marker.classList.remove('active');
            if (parseInt(marker.dataset.propertyId) === propertyId) {
                marker.classList.add('active');
            }
        });
        
        // 显示详情模态框
        this.showPropertyModal(this.selectedProperty);
    }
    
    /**
     * 显示房源详情模态框
     */
    showPropertyModal(property) {
        const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
        const titleElement = document.getElementById('propertyModalTitle');
        const bodyElement = document.getElementById('propertyModalBody');
        
        titleElement.textContent = property.name;
        
        bodyElement.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${property.image}" alt="${property.name}" class="img-fluid rounded mb-3"
                         onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="col-md-6">
                    <h5 class="text-primary mb-3">${property.price}${property.priceUnit}</h5>
                    
                    <div class="row mb-3">
                        <div class="col-6">
                            <strong>面积：</strong>${property.area}
                        </div>
                        <div class="col-6">
                            <strong>建筑年份：</strong>${property.buildYear}
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-6">
                            <strong>楼层：</strong>${property.floors}
                        </div>
                        <div class="col-6">
                            <strong>总户数：</strong>${property.households}
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <strong>地址：</strong>${property.address}
                    </div>
                    
                    <div class="mb-3">
                        <strong>开发商：</strong>${property.developer}
                    </div>
                    
                    <div class="mb-3">
                        <strong>房源特色：</strong>
                        <div class="mt-2">
                            ${property.features.map(feature => `<span class="badge bg-primary me-1">${feature}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <strong>项目描述：</strong>
                        <p class="mt-2 text-muted">${property.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        modal.show();
    }
    
    /**
     * 获取筛选后的房源
     */
    getFilteredProperties() {
        return this.properties.filter(property => {
            // 类型筛选
            if (this.currentFilter !== 'all' && property.type !== this.currentFilter) {
                return false;
            }
            
            // 价格筛选
            if (this.currentPriceFilter !== 'all') {
                const price = property.price;
                switch (this.currentPriceFilter) {
                    case '0-100':
                        return price < 100;
                    case '100-200':
                        return price >= 100 && price < 200;
                    case '200-300':
                        return price >= 200 && price < 300;
                    case '300-500':
                        return price >= 300 && price < 500;
                    case '500+':
                        return price >= 500;
                }
            }
            
            return true;
        });
    }
    
    /**
     * 计算距离（模拟）
     */
    calculateDistance(coordinates) {
        // 模拟计算到市中心的距离
        const centerLat = 33.2001;
        const centerLng = 120.4851;
        
        const distance = Math.sqrt(
            Math.pow(coordinates.lat - centerLat, 2) + 
            Math.pow(coordinates.lng - centerLng, 2)
        ) * 100; // 转换为大概的公里数
        
        return Math.max(0.1, distance.toFixed(1));
    }
    
    /**
     * 处理联系咨询
     */
    handleContact() {
        if (!this.selectedProperty) return;
        
        const message = `您好，我对${this.selectedProperty.name}感兴趣，请提供更详细的信息。\n\n房源信息：\n名称：${this.selectedProperty.name}\n价格：${this.selectedProperty.price}${this.selectedProperty.priceUnit}\n面积：${this.selectedProperty.area}\n地址：${this.selectedProperty.address}`;
        
        // 模拟联系方式，实际项目中可以集成在线客服或跳转到联系页面
        alert('联系信息已复制到剪贴板，我们的置业顾问将尽快与您联系！\n\n' + message);
        
        // 尝试复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(message).catch(err => {
                console.warn('复制到剪贴板失败:', err);
            });
        }
    }
    
    /**
     * 获取统计信息
     */
    getStats() {
        const stats = {
            total: this.properties.length,
            byType: {},
            priceRange: {
                min: Math.min(...this.properties.map(p => p.price)),
                max: Math.max(...this.properties.map(p => p.price)),
                average: this.properties.reduce((sum, p) => sum + p.price, 0) / this.properties.length
            }
        };
        
        // 按类型统计
        this.properties.forEach(property => {
            stats.byType[property.type] = (stats.byType[property.type] || 0) + 1;
        });
        
        return stats;
    }
}

// 全局实例
let propertyMap;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    propertyMap = new PropertyMap();
    
    // 默认激活"全部"筛选按钮
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
});

// 暴露到全局
window.PropertyMap = PropertyMap;
window.propertyMap = propertyMap;