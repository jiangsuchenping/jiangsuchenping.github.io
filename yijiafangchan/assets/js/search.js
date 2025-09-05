/**
 * 智能搜索系统
 * 实现全文搜索、智能筛选和推荐功能
 */

class PropertySearch {
    constructor() {
        this.properties = [];
        this.filteredResults = [];
        this.currentFilters = {
            keyword: '',
            type: 'all',
            priceMax: 600,
            area: 'all',
            location: 'all',
            features: []
        };
        this.currentSort = 'relevance';
        this.savedSearches = [];
        this.searchHistory = [];
        
        this.init();
    }
    
    /**
     * 初始化搜索系统
     */
    init() {
        this.loadPropertyData();
        this.loadSavedSearches();
        this.setupEventListeners();
        this.initializeFilters();
        
        console.log('[PropertySearch] 智能搜索系统初始化完成');
    }
    
    /**
     * 加载房源数据
     */
    loadPropertyData() {
        // 扩展房源数据，包含更多搜索字段
        this.properties = [
            {
                id: 1,
                name: '金桂花园',
                type: 'house',
                price: 150,
                priceUnit: '万',
                location: '大丰区新丰镇',
                address: '新丰镇金桂大道188号',
                area: 120,
                areaUnit: '㎡',
                buildYear: '2022',
                floors: '18层',
                households: '288户',
                developer: '宜家房产',
                image: 'assets/images/property1.jpg',
                features: ['精装修', '学区房', '地铁沿线', '停车位'],
                description: '品质住宅小区，环境优美，配套齐全',
                avgPrice: 12500,
                totalPrice: 150,
                tags: ['住宅', '学区', '地铁', '精装'],
                searchKeywords: '金桂花园 新丰镇 学区房 地铁沿线 精装修 停车位'
            },
            {
                id: 2,
                name: '海景公寓',
                type: 'apartment',
                price: 85,
                priceUnit: '万',
                location: '大丰区海洋新城',
                address: '海洋新城滨海大道66号',
                area: 89,
                areaUnit: '㎡',
                buildYear: '2023',
                floors: '26层',
                households: '156户',
                developer: '宜家房产',
                image: 'assets/images/property2.jpg',
                features: ['海景房', '现房', '投资热点', '配套成熟'],
                description: '海景公寓，视野开阔，投资自住两相宜',
                avgPrice: 9551,
                totalPrice: 85,
                tags: ['公寓', '海景', '投资', '现房'],
                searchKeywords: '海景公寓 海洋新城 海景房 现房 投资热点 配套成熟'
            },
            {
                id: 3,
                name: '书香别墅',
                type: 'villa',
                price: 380,
                priceUnit: '万',
                location: '大丰区恒北村',
                address: '恒北村书香路8号',
                area: 280,
                areaUnit: '㎡',
                buildYear: '2023',
                floors: '3层',
                households: '68户',
                developer: '宜家房产',
                image: 'assets/images/property3.jpg',
                features: ['独栋别墅', '私家花园', '高端社区', '品质装修'],
                description: '独栋别墅，园林式设计，高端生活品质',
                avgPrice: 13571,
                totalPrice: 380,
                tags: ['别墅', '独栋', '高端', '花园'],
                searchKeywords: '书香别墅 恒北村 独栋别墅 私家花园 高端社区 品质装修'
            },
            {
                id: 4,
                name: '阳光花城',
                type: 'house',
                price: 125,
                priceUnit: '万',
                location: '大丰区城东新区',
                address: '城东新区康乐路168号',
                area: 98,
                areaUnit: '㎡',
                buildYear: '2022',
                floors: '11层',
                households: '368户',
                developer: '宜家房产',
                image: 'assets/images/property4.jpg',
                features: ['现房', '学区房', '商业配套', '交通便利'],
                description: '现代化小区，交通便利，生活配套完善',
                avgPrice: 12755,
                totalPrice: 125,
                tags: ['住宅', '现房', '学区', '配套'],
                searchKeywords: '阳光花城 城东新区 现房 学区房 商业配套 交通便利'
            },
            {
                id: 5,
                name: '翡翠湾',
                type: 'apartment',
                price: 195,
                priceUnit: '万',
                location: '大丰区港城路',
                address: '港城路翡翠湾小区',
                area: 135,
                areaUnit: '㎡',
                buildYear: '2023',
                floors: '22层',
                households: '198户',
                developer: '宜家房产',
                image: 'assets/images/property5.jpg',
                features: ['高端装修', '物业优质', '地段优越', '升值潜力'],
                description: '高端公寓，品质生活，投资首选',
                avgPrice: 14444,
                totalPrice: 195,
                tags: ['公寓', '高端', '地段', '投资'],
                searchKeywords: '翡翠湾 港城路 高端装修 物业优质 地段优越 升值潜力'
            },
            {
                id: 6,
                name: '绿野仙踪',
                type: 'villa',
                price: 520,
                priceUnit: '万',
                location: '大丰区港北新城',
                address: '港北新城绿野大道1号',
                area: 320,
                areaUnit: '㎡',
                buildYear: '2024',
                floors: '4层',
                households: '32户',
                developer: '宜家房产',
                image: 'assets/images/property6.jpg',
                features: ['顶级别墅', '私家泳池', '会所配套', '24小时保安'],
                description: '顶级别墅区，私密性好，尊享品质生活',
                avgPrice: 16250,
                totalPrice: 520,
                tags: ['别墅', '顶级', '泳池', '会所'],
                searchKeywords: '绿野仙踪 港北新城 顶级别墅 私家泳池 会所配套 保安'
            }
        ];
        
        // 添加索引以提高搜索性能
        this.buildSearchIndex();
    }
    
    /**
     * 构建搜索索引
     */
    buildSearchIndex() {
        this.searchIndex = {};
        
        this.properties.forEach(property => {
            const searchText = `${property.name} ${property.location} ${property.address} ${property.features.join(' ')} ${property.description} ${property.searchKeywords}`.toLowerCase();
            
            const words = searchText.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];
            words.forEach(word => {
                if (!this.searchIndex[word]) {
                    this.searchIndex[word] = [];
                }
                if (!this.searchIndex[word].includes(property.id)) {
                    this.searchIndex[word].push(property.id);
                }
            });
        });
    }
    
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const priceRange = document.getElementById('priceRange');
        
        // 搜索输入事件
        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // 价格滑块事件
        priceRange.addEventListener('input', () => {
            this.updatePriceDisplay();
        });
        
        // 筛选选项事件
        this.setupFilterListeners();
        
        // 排序选项事件
        this.setupSortListeners();
        
        // 点击其他地方隐藏搜索建议
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                this.hideSuggestions();
            }
        });
    }
    
    /**
     * 设置筛选监听器
     */
    setupFilterListeners() {
        ['type', 'area', 'location'].forEach(filterType => {
            const container = document.getElementById(`${filterType}Filters`);
            if (container) {
                container.addEventListener('click', (e) => {
                    if (e.target.classList.contains('filter-option')) {
                        this.handleFilterClick(e.target, filterType);
                    }
                });
            }
        });
        
        // 特色标签筛选（支持多选）
        const featureContainer = document.getElementById('featureFilters');
        if (featureContainer) {
            featureContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-option')) {
                    this.handleFeatureFilterClick(e.target);
                }
            });
        }
    }
    
    /**
     * 设置排序监听器
     */
    setupSortListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sort-btn')) {
                this.handleSortChange(e.target);
            }
        });
    }
    
    /**
     * 初始化筛选器
     */
    initializeFilters() {
        // 默认选中"不限"选项
        ['type', 'area', 'location'].forEach(filterType => {
            const container = document.getElementById(`${filterType}Filters`);
            if (container) {
                const firstOption = container.querySelector('.filter-option');
                if (firstOption) {
                    firstOption.classList.add('active');
                }
            }
        });
        
        this.updatePriceDisplay();
    }
    
    /**
     * 处理搜索输入
     */
    handleSearchInput(value) {
        this.currentFilters.keyword = value;
        
        if (value.length > 0) {
            this.showSuggestions(value);
        } else {
            this.hideSuggestions();
        }
        
        // 实时搜索（防抖）
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (value.length > 0) {
                this.performSearch(false);
            } else {
                this.clearResults();
            }
        }, 300);
    }
    
    /**
     * 显示搜索建议
     */
    showSuggestions(keyword) {
        const suggestions = this.generateSuggestions(keyword);
        const container = document.getElementById('searchSuggestions');
        
        if (suggestions.length > 0) {
            const html = suggestions.map(suggestion => `
                <div class="suggestion-item" onclick="propertySearch.selectSuggestion('${suggestion}')">
                    <i class="fas fa-search me-2 text-muted"></i>${suggestion}
                </div>
            `).join('');
            
            container.innerHTML = html;
            container.style.display = 'block';
        } else {
            this.hideSuggestions();
        }
    }
    
    /**
     * 生成搜索建议
     */
    generateSuggestions(keyword) {
        const suggestions = new Set();
        const lowerKeyword = keyword.toLowerCase();
        
        // 从房源名称生成建议
        this.properties.forEach(property => {
            if (property.name.toLowerCase().includes(lowerKeyword)) {
                suggestions.add(property.name);
            }
            
            if (property.location.toLowerCase().includes(lowerKeyword)) {
                suggestions.add(property.location);
            }
            
            property.features.forEach(feature => {
                if (feature.toLowerCase().includes(lowerKeyword)) {
                    suggestions.add(feature);
                }
            });
        });
        
        // 添加常见搜索词
        const commonKeywords = ['学区房', '地铁沿线', '海景房', '别墅', '公寓', '精装修', '现房', '投资', '新房'];
        commonKeywords.forEach(kw => {
            if (kw.toLowerCase().includes(lowerKeyword)) {
                suggestions.add(kw);
            }
        });
        
        return Array.from(suggestions).slice(0, 8);
    }
    
    /**
     * 隐藏搜索建议
     */
    hideSuggestions() {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
    
    /**
     * 选择搜索建议
     */
    selectSuggestion(suggestion) {
        document.getElementById('searchInput').value = suggestion;
        this.currentFilters.keyword = suggestion;
        this.hideSuggestions();
        this.performSearch();
    }
    
    /**
     * 快速搜索
     */
    quickSearch(keyword) {
        document.getElementById('searchInput').value = keyword;
        this.currentFilters.keyword = keyword;
        this.performSearch();
    }
    
    /**
     * 处理筛选点击
     */
    handleFilterClick(element, filterType) {
        const container = element.parentElement;
        container.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('active');
        });
        element.classList.add('active');
        
        const value = element.dataset[filterType];
        this.currentFilters[filterType] = value;
        
        this.performSearch(false);
    }
    
    /**
     * 处理特色筛选点击（多选）
     */
    handleFeatureFilterClick(element) {
        const feature = element.dataset.feature;
        
        if (element.classList.contains('active')) {
            element.classList.remove('active');
            const index = this.currentFilters.features.indexOf(feature);
            if (index > -1) {
                this.currentFilters.features.splice(index, 1);
            }
        } else {
            element.classList.add('active');
            this.currentFilters.features.push(feature);
        }
        
        this.performSearch(false);
    }
    
    /**
     * 更新价格显示
     */
    updatePriceDisplay() {
        const priceRange = document.getElementById('priceRange');
        const maxPrice = parseInt(priceRange.value);
        
        document.getElementById('minPriceDisplay').textContent = '0万';
        document.getElementById('maxPriceDisplay').textContent = maxPrice + '万';
        
        this.currentFilters.priceMax = maxPrice;
    }
    
    /**
     * 处理排序变化
     */
    handleSortChange(element) {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        element.classList.add('active');
        
        this.currentSort = element.dataset.sort;
        this.renderResults();
    }
    
    /**
     * 执行搜索
     */
    performSearch(showLoading = true) {
        const startTime = performance.now();
        
        if (showLoading) {
            this.showLoading();
        }
        
        // 模拟搜索延迟
        setTimeout(() => {
            this.filteredResults = this.filterProperties();
            this.sortResults();
            
            const searchTime = Math.round(performance.now() - startTime);
            this.updateSearchStats(this.filteredResults.length, searchTime);
            this.renderResults();
            
            // 保存搜索历史
            this.saveToHistory();
            
            if (showLoading) {
                this.hideLoading();
            }
        }, showLoading ? 500 : 0);
    }
    
    /**
     * 筛选房源
     */
    filterProperties() {
        let results = [...this.properties];
        
        // 关键词搜索
        if (this.currentFilters.keyword) {
            results = this.searchByKeyword(results, this.currentFilters.keyword);
        }
        
        // 房源类型筛选
        if (this.currentFilters.type !== 'all') {
            results = results.filter(property => property.type === this.currentFilters.type);
        }
        
        // 价格筛选
        results = results.filter(property => property.price <= this.currentFilters.priceMax);
        
        // 面积筛选
        if (this.currentFilters.area !== 'all') {
            results = this.filterByArea(results, this.currentFilters.area);
        }
        
        // 位置筛选
        if (this.currentFilters.location !== 'all') {
            results = results.filter(property => 
                property.location.includes(this.currentFilters.location)
            );
        }
        
        // 特色筛选
        if (this.currentFilters.features.length > 0) {
            results = results.filter(property => 
                this.currentFilters.features.every(feature => 
                    property.features.includes(feature)
                )
            );
        }
        
        return results;
    }
    
    /**
     * 关键词搜索
     */
    searchByKeyword(properties, keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const results = [];
        
        properties.forEach(property => {
            let score = 0;
            const searchText = `${property.name} ${property.location} ${property.address} ${property.features.join(' ')} ${property.description} ${property.searchKeywords}`.toLowerCase();
            
            // 精确匹配得分最高
            if (property.name.toLowerCase() === lowerKeyword) {
                score += 100;
            }
            
            // 名称包含关键词
            if (property.name.toLowerCase().includes(lowerKeyword)) {
                score += 50;
            }
            
            // 位置匹配
            if (property.location.toLowerCase().includes(lowerKeyword)) {
                score += 30;
            }
            
            // 特色匹配
            property.features.forEach(feature => {
                if (feature.toLowerCase().includes(lowerKeyword)) {
                    score += 20;
                }
            });
            
            // 描述匹配
            if (property.description.toLowerCase().includes(lowerKeyword)) {
                score += 10;
            }
            
            // 地址匹配
            if (property.address.toLowerCase().includes(lowerKeyword)) {
                score += 15;
            }
            
            if (score > 0) {
                results.push({ ...property, matchScore: score });
            }
        });
        
        return results;
    }
    
    /**
     * 按面积筛选
     */
    filterByArea(properties, areaRange) {
        switch (areaRange) {
            case '0-90':
                return properties.filter(p => p.area < 90);
            case '90-120':
                return properties.filter(p => p.area >= 90 && p.area < 120);
            case '120-150':
                return properties.filter(p => p.area >= 120 && p.area < 150);
            case '150+':
                return properties.filter(p => p.area >= 150);
            default:
                return properties;
        }
    }
    
    /**
     * 排序结果
     */
    sortResults() {
        switch (this.currentSort) {
            case 'relevance':
                this.filteredResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
                break;
            case 'price-asc':
                this.filteredResults.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredResults.sort((a, b) => b.price - a.price);
                break;
            case 'area-desc':
                this.filteredResults.sort((a, b) => b.area - a.area);
                break;
            case 'newest':
                this.filteredResults.sort((a, b) => parseInt(b.buildYear) - parseInt(a.buildYear));
                break;
        }
    }
    
    /**
     * 渲染搜索结果
     */
    renderResults() {
        const container = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        const resultHeader = document.getElementById('resultHeader');
        
        if (this.filteredResults.length === 0) {
            container.innerHTML = '';
            resultHeader.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        resultHeader.style.display = 'block';
        
        const html = this.filteredResults.map((property, index) => {
            const isHighlight = property.matchScore && property.matchScore >= 50;
            return `
                <div class="property-result position-relative ${isHighlight ? 'property-highlight' : ''}">
                    ${property.matchScore ? `<div class="match-score">${Math.round(property.matchScore)}% 匹配</div>` : ''}
                    
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <img src="${property.image}" alt="${property.name}" 
                                 class="img-fluid rounded" 
                                 onerror="this.src='assets/images/placeholder.jpg'">
                        </div>
                        <div class="col-md-8">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="text-primary mb-0">${property.name}</h5>
                                <div class="text-end">
                                    <div class="h4 text-success mb-0">${property.price}${property.priceUnit}</div>
                                    <small class="text-muted">${property.avgPrice.toLocaleString()}元/㎡</small>
                                </div>
                            </div>
                            
                            <div class="row mb-2">
                                <div class="col-sm-6">
                                    <p class="text-muted mb-1">
                                        <i class="fas fa-map-marker-alt me-1"></i>${property.location}
                                    </p>
                                    <p class="text-muted mb-1">
                                        <i class="fas fa-expand-arrows-alt me-1"></i>${property.area}${property.areaUnit}
                                    </p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="text-muted mb-1">
                                        <i class="fas fa-calendar me-1"></i>${property.buildYear}年建成
                                    </p>
                                    <p class="text-muted mb-1">
                                        <i class="fas fa-building me-1"></i>${property.floors} · ${property.households}
                                    </p>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                ${property.features.map(feature => 
                                    `<span class="badge bg-primary me-1">${feature}</span>`
                                ).join('')}
                            </div>
                            
                            <p class="text-muted mb-3">${property.description}</p>
                            
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="propertySearch.viewDetails(${property.id})">
                                    <i class="fas fa-eye me-1"></i>查看详情
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="propertySearch.addToCompare(${property.id})">
                                    <i class="fas fa-balance-scale me-1"></i>加入对比
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="propertySearch.contact(${property.id})">
                                    <i class="fas fa-phone me-1"></i>立即咨询
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 应用筛选
     */
    applyFilters() {
        this.currentFilters.priceMax = parseInt(document.getElementById('priceRange').value);
        this.performSearch();
    }
    
    /**
     * 清空筛选
     */
    clearFilters() {
        // 重置筛选条件
        this.currentFilters = {
            keyword: '',
            type: 'all',
            priceMax: 600,
            area: 'all',
            location: 'all',
            features: []
        };
        
        // 重置UI
        document.getElementById('searchInput').value = '';
        document.getElementById('priceRange').value = 600;
        
        // 清除所有active状态
        document.querySelectorAll('.filter-option.active').forEach(el => {
            el.classList.remove('active');
        });
        
        // 重新激活"不限"选项
        ['type', 'area', 'location'].forEach(filterType => {
            const container = document.getElementById(`${filterType}Filters`);
            if (container) {
                const firstOption = container.querySelector('.filter-option');
                if (firstOption) {
                    firstOption.classList.add('active');
                }
            }
        });
        
        this.updatePriceDisplay();
        this.clearResults();
    }
    
    /**
     * 清空搜索结果
     */
    clearResults() {
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('resultHeader').style.display = 'none';
        document.getElementById('searchStats').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
        this.filteredResults = [];
    }
    
    /**
     * 显示加载动画
     */
    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
    }
    
    /**
     * 隐藏加载动画
     */
    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('searchResults').style.display = 'block';
    }
    
    /**
     * 更新搜索统计
     */
    updateSearchStats(count, time) {
        document.getElementById('resultCount').textContent = `找到 ${count} 个匹配的房源`;
        document.getElementById('searchTime').textContent = time;
        document.getElementById('searchStats').style.display = 'block';
    }
    
    /**
     * 查看详情
     */
    viewDetails(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            // 这里可以跳转到详情页面或显示详情模态框
            window.open(`property-detail.html?id=${propertyId}`, '_blank');
        }
    }
    
    /**
     * 加入对比
     */
    addToCompare(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            // 将房源ID保存到sessionStorage，用于对比页面
            let compareList = JSON.parse(sessionStorage.getItem('compareList') || '[]');
            
            if (!compareList.includes(propertyId)) {
                if (compareList.length >= 4) {
                    alert('最多只能对比4个房源');
                    return;
                }
                compareList.push(propertyId);
                sessionStorage.setItem('compareList', JSON.stringify(compareList));
                alert(`已将 ${property.name} 加入对比列表`);
            } else {
                alert('该房源已在对比列表中');
            }
        }
    }
    
    /**
     * 联系咨询
     */
    contact(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            const message = `您好，我对 ${property.name} 感兴趣，希望了解更多信息。\n价格：${property.price}${property.priceUnit}\n位置：${property.location}\n面积：${property.area}${property.areaUnit}`;
            window.location.href = `tel:+86-515-8888-8888`;
        }
    }
    
    /**
     * 显示推荐房源
     */
    showRecommendations() {
        // 推荐热门房源
        this.currentFilters = {
            keyword: '',
            type: 'all',
            priceMax: 600,
            area: 'all',
            location: 'all',
            features: []
        };
        
        this.filteredResults = this.properties.slice(0, 3);
        document.getElementById('resultCount').textContent = '为您推荐以下热门房源';
        document.getElementById('searchStats').style.display = 'block';
        this.renderResults();
    }
    
    /**
     * 保存到搜索历史
     */
    saveToHistory() {
        if (this.currentFilters.keyword) {
            const searchItem = {
                keyword: this.currentFilters.keyword,
                filters: { ...this.currentFilters },
                timestamp: new Date().toISOString(),
                resultCount: this.filteredResults.length
            };
            
            // 避免重复
            const existIndex = this.searchHistory.findIndex(item => 
                item.keyword === searchItem.keyword
            );
            
            if (existIndex > -1) {
                this.searchHistory.splice(existIndex, 1);
            }
            
            this.searchHistory.unshift(searchItem);
            
            // 只保留最近10次搜索
            if (this.searchHistory.length > 10) {
                this.searchHistory = this.searchHistory.slice(0, 10);
            }
            
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }
    
    /**
     * 加载保存的搜索
     */
    loadSavedSearches() {
        const saved = localStorage.getItem('savedSearches');
        const history = localStorage.getItem('searchHistory');
        
        if (saved) {
            this.savedSearches = JSON.parse(saved);
        }
        
        if (history) {
            this.searchHistory = JSON.parse(history);
        }
        
        this.renderSavedSearches();
    }
    
    /**
     * 渲染保存的搜索
     */
    renderSavedSearches() {
        const container = document.getElementById('savedSearchesList');
        
        if (this.searchHistory.length === 0) {
            container.innerHTML = '<p class="text-muted small">暂无搜索历史</p>';
            return;
        }
        
        const html = this.searchHistory.slice(0, 5).map(item => `
            <div class="saved-search-item">
                <div class="flex-grow-1" onclick="propertySearch.loadSearch('${item.keyword}')" style="cursor: pointer;">
                    <div class="fw-bold">${item.keyword}</div>
                    <small class="text-muted">找到 ${item.resultCount} 个结果</small>
                </div>
                <small class="text-muted">${new Date(item.timestamp).toLocaleDateString()}</small>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 加载搜索
     */
    loadSearch(keyword) {
        document.getElementById('searchInput').value = keyword;
        this.currentFilters.keyword = keyword;
        this.performSearch();
    }
    
    /**
     * 获取搜索统计
     */
    getStats() {
        return {
            totalProperties: this.properties.length,
            searchHistory: this.searchHistory.length,
            savedSearches: this.savedSearches.length,
            currentResults: this.filteredResults.length
        };
    }
}

// 全局实例
let propertySearch;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    propertySearch = new PropertySearch();
});

// 暴露到全局
window.PropertySearch = PropertySearch;
window.propertySearch = propertySearch;