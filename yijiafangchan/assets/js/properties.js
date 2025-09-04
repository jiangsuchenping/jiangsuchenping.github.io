// 楼盘展示页面专用JavaScript
class PropertiesPage {
    constructor() {
        this.allProperties = [];
        this.filteredProperties = [];
        this.currentPage = 1;
        this.pageSize = 9;
        this.viewMode = 'grid';
        this.filters = { type: '', price: '', area: '', sort: 'default' };
        this.init();
    }

    init() {
        this.loadAllProperties();
        this.setupEventListeners();
        this.setupViewToggle();
    }

    loadAllProperties() {
        this.allProperties = [
            {
                id: 1, title: "维罗纳花园", location: "大丰区维罗纳步行街", type: "new",
                price: 8800, priceUnit: "/㎡起", area: "89-128", rooms: "2-4室", floor: "18层",
                image: "assets/images/property-1.jpg", badge: "热销",
                description: "位于维罗纳步行街核心地段，交通便利，配套完善",
                features: ["南北通透", "精装修", "地铁沿线", "商业配套"]
            },
            {
                id: 2, title: "建发珺和府", location: "大丰区新城区", type: "new",
                price: 9200, priceUnit: "/㎡起", area: "108-138", rooms: "3-4室", floor: "26层",
                image: "assets/images/property-2.jpg", badge: "新盘",
                description: "大丰唯一建发品牌项目，品质住宅典范",
                features: ["品牌开发商", "高层视野", "智能化", "会所配套"]
            },
            {
                id: 3, title: "月湖花城", location: "大丰区南环路", type: "second-hand",
                price: 7500, priceUnit: "/㎡", area: "125", rooms: "3室2厅", floor: "11/18层",
                image: "assets/images/property-3.jpg", badge: "精装",
                description: "成熟社区，精装修，拎包入住",
                features: ["拎包入住", "成熟社区", "学区房", "交通便利"]
            },
            {
                id: 4, title: "杰仕豪庭", location: "大丰区人民路", type: "second-hand",
                price: 8200, priceUnit: "/㎡", area: "142", rooms: "4室2厅", floor: "8/15层",
                image: "assets/images/property-4.jpg", badge: "优质",
                description: "黄金地段，成熟配套，投资自住两相宜",
                features: ["黄金地段", "户型方正", "采光良好", "配套成熟"]
            },
            {
                id: 5, title: "馥桂名居", location: "大丰区西环路", type: "rental",
                price: 2800, priceUnit: "/月", area: "85", rooms: "2室1厅", floor: "6/12层",
                image: "assets/images/property-5.jpg", badge: "出租",
                description: "精装修，家电齐全，随时看房",
                features: ["精装修", "家电齐全", "随时看房", "交通便利"]
            },
            {
                id: 6, title: "荣沁苑", location: "大丰区东环路", type: "rental",
                price: 1800, priceUnit: "/月", area: "55", rooms: "1室1厅", floor: "3/6层",
                image: "assets/images/property-6.jpg", badge: "出租",
                description: "单身公寓，配套完善，交通便利",
                features: ["单身公寓", "配套完善", "交通便利", "性价比高"]
            }
        ];

        this.filteredProperties = [...this.allProperties];
        this.renderProperties();
        this.updateResultsCount();
        this.renderPagination();
    }

    setupEventListeners() {
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('priceFilter').addEventListener('change', (e) => {
            this.filters.price = e.target.value;
            this.applyFilters();
        });

        document.getElementById('areaFilter').addEventListener('change', (e) => {
            this.filters.area = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applySorting();
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            this.applyFilters();
        });
    }

    setupViewToggle() {
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');

        gridViewBtn.addEventListener('click', () => {
            this.viewMode = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            this.renderProperties();
        });

        listViewBtn.addEventListener('click', () => {
            this.viewMode = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            this.renderProperties();
        });
    }

    applyFilters() {
        this.filteredProperties = this.allProperties.filter(property => {
            if (this.filters.type && property.type !== this.filters.type) return false;
            
            if (this.filters.price) {
                const price = property.price;
                const range = this.filters.price;
                if (range === '0-5000' && price >= 5000) return false;
                if (range === '5000-8000' && (price < 5000 || price > 8000)) return false;
                if (range === '8000-10000' && (price < 8000 || price > 10000)) return false;
                if (range === '10000+' && price < 10000) return false;
            }

            if (this.filters.area && !property.location.includes(this.filters.area)) return false;
            
            return true;
        });

        this.currentPage = 1;
        this.applySorting();
    }

    applySorting() {
        switch (this.filters.sort) {
            case 'price-asc':
                this.filteredProperties.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProperties.sort((a, b) => b.price - a.price);
                break;
            default:
                this.filteredProperties.sort((a, b) => a.id - b.id);
        }

        this.renderProperties();
        this.updateResultsCount();
        this.renderPagination();
    }

    renderProperties() {
        const container = document.getElementById('propertiesContainer');
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageProperties = this.filteredProperties.slice(start, end);

        container.innerHTML = '';

        if (pageProperties.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>没有找到符合条件的楼盘</h4>
                    <p class="text-muted">请尝试调整筛选条件</p>
                </div>
            `;
            return;
        }

        pageProperties.forEach(property => {
            const propertyElement = this.createPropertyCard(property);
            container.appendChild(propertyElement);
        });
    }

    createPropertyCard(property) {
        const col = document.createElement('div');
        col.className = this.viewMode === 'grid' ? 'col-lg-4 col-md-6 mb-4' : 'col-12 mb-4';
        
        col.innerHTML = `
            <div class="property-card h-100">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" 
                         onerror="this.src='https://via.placeholder.com/400x250/e9ecef/6c757d?text=暂无图片'">
                    <div class="property-badge">${property.badge}</div>
                </div>
                <div class="property-content">
                    <h4 class="property-title">${property.title}</h4>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                    <div class="property-features mb-3">
                        <span><i class="fas fa-bed"></i> ${property.rooms}</span>
                        <span><i class="fas fa-expand-arrows-alt"></i> ${property.area}㎡</span>
                        <span><i class="fas fa-building"></i> ${property.floor}</span>
                    </div>
                    <div class="property-price">
                        ¥${property.price.toLocaleString()}<small>${property.priceUnit}</small>
                    </div>
                    <p class="property-description small text-muted">${property.description}</p>
                    <div class="property-actions">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="propertiesPage.viewDetail(${property.id})">
                            <i class="fas fa-eye me-1"></i>查看详情
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="propertiesPage.contactProperty(${property.id})">
                            <i class="fas fa-phone me-1"></i>咨询
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    updateResultsCount() {
        document.getElementById('resultsCount').textContent = `共找到 ${this.filteredProperties.length} 个楼盘`;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProperties.length / this.pageSize);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';
        
        if (this.currentPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="propertiesPage.goToPage(${this.currentPage - 1})">上一页</a></li>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
            } else {
                html += `<li class="page-item"><a class="page-link" href="#" onclick="propertiesPage.goToPage(${i})">${i}</a></li>`;
            }
        }

        if (this.currentPage < totalPages) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="propertiesPage.goToPage(${this.currentPage + 1})">下一页</a></li>`;
        }

        pagination.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProperties();
        this.renderPagination();
        document.querySelector('#propertiesContainer').scrollIntoView({ behavior: 'smooth' });
    }

    viewDetail(id) {
        const property = this.allProperties.find(p => p.id === id);
        if (property) {
            alert(`查看 ${property.title} 的详细信息\n地址：${property.location}\n价格：¥${property.price}${property.priceUnit}`);
        }
    }

    contactProperty(id) {
        const property = this.allProperties.find(p => p.id === id);
        if (property) {
            window.location.href = `contact.html?property=${encodeURIComponent(property.title)}`;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.propertiesPage = new PropertiesPage();
});