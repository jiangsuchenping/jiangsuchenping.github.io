// 宜家房产 - JavaScript交互功能
// Author: 宜家房产技术团队
// Version: 1.0.0

class YijiaRealEstate {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadProperties();
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupBackToTop();
        this.initContactForm();
        this.setupSmoothScroll();
    }

    // 楼盘数据
    loadProperties() {
        this.properties = [
            {
                id: 1,
                title: "维罗纳花园",
                location: "大丰区维罗纳步行街",
                type: "new",
                price: "8800",
                priceUnit: "/㎡起",
                image: "assets/images/property-1.jpg",
                features: {
                    rooms: "2-4室",
                    area: "89-128㎡",
                    floor: "18层"
                },
                badge: "热销",
                description: "位于维罗纳步行街核心地段，交通便利，配套完善"
            },
            {
                id: 2,
                title: "建发珺和府",
                location: "大丰区新城区",
                type: "new",
                price: "9200",
                priceUnit: "/㎡起",
                image: "assets/images/property-2.jpg",
                features: {
                    rooms: "3-4室",
                    area: "108-138㎡",
                    floor: "26层"
                },
                badge: "新盘",
                description: "大丰唯一建发品牌项目，品质住宅典范"
            },
            {
                id: 3,
                title: "月湖花城",
                location: "大丰区南环路",
                type: "second-hand",
                price: "7500",
                priceUnit: "/㎡",
                image: "assets/images/property-3.jpg",
                features: {
                    rooms: "3室2厅",
                    area: "125㎡",
                    floor: "11/18层"
                },
                badge: "精装",
                description: "成熟社区，精装修，拎包入住"
            },
            {
                id: 4,
                title: "杰仕豪庭",
                location: "大丰区人民路",
                type: "second-hand",
                price: "8200",
                priceUnit: "/㎡",
                image: "assets/images/property-4.jpg",
                features: {
                    rooms: "4室2厅",
                    area: "142㎡",
                    floor: "8/15层"
                },
                badge: "优质",
                description: "黄金地段，成熟配套，投资自住两相宜"
            },
            {
                id: 5,
                title: "馥桂名居",
                location: "大丰区西环路",
                type: "rental",
                price: "2800",
                priceUnit: "/月",
                image: "assets/images/property-5.jpg",
                features: {
                    rooms: "2室1厅",
                    area: "85㎡",
                    floor: "6/12层"
                },
                badge: "出租",
                description: "精装修，家电齐全，随时看房"
            },
            {
                id: 6,
                title: "荣沁苑",
                location: "大丰区东环路",
                type: "rental",
                price: "1800",
                priceUnit: "/月",
                image: "assets/images/property-6.jpg",
                features: {
                    rooms: "1室1厅",
                    area: "55㎡",
                    floor: "3/6层"
                },
                badge: "出租",
                description: "单身公寓，配套完善，交通便利"
            }
        ];

        this.filteredProperties = [...this.properties];
        this.renderProperties();
    }

    // 事件监听器设置
    setupEventListeners() {
        // 筛选按钮
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // 导航栏滚动效果 - 使用节流优化性能，防止频闪
        const throttledNavbarScroll = throttle(() => {
            this.handleNavbarScroll();
        }, 16); // 约60fps
        
        window.addEventListener('scroll', throttledNavbarScroll, { passive: true });

        // 表单提交
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleContactForm(e);
            });
        }

        // 电话链接点击追踪
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackPhoneCall();
            });
        });

        // 响应式菜单
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });

            // 点击导航链接后关闭菜单
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navbarCollapse.classList.remove('show');
                });
            });
        }
    }

    // 楼盘筛选
    handleFilter(filter) {
        this.currentFilter = filter;
        
        // 更新筛选按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // 筛选数据
        if (filter === 'all') {
            this.filteredProperties = [...this.properties];
        } else {
            this.filteredProperties = this.properties.filter(property => property.type === filter);
        }

        // 重新渲染
        this.renderProperties();
    }

    // 渲染楼盘列表
    renderProperties() {
        const container = document.getElementById('propertiesGrid');
        if (!container) return;

        container.innerHTML = '';

        this.filteredProperties.forEach((property, index) => {
            const propertyCard = this.createPropertyCard(property);
            propertyCard.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(propertyCard);
        });

        // 如果没有结果
        if (this.filteredProperties.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="no-results">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h4>暂无相关楼盘</h4>
                        <p class="text-muted">请尝试其他筛选条件或联系我们获取更多信息</p>
                        <a href="#contact" class="btn btn-primary">联系我们</a>
                    </div>
                </div>
            `;
        }
    }

    // 创建楼盘卡片
    createPropertyCard(property) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4 fade-in-up';
        
        const typeNames = {
            'new': '新房',
            'second-hand': '二手房',
            'rental': '租赁'
        };

        col.innerHTML = `
            <div class="property-card">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}" loading="lazy" 
                         onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="property-badge">${property.badge}</div>
                </div>
                <div class="property-content">
                    <h4 class="property-title">${property.title}</h4>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </div>
                    <div class="property-features">
                        <span><i class="fas fa-bed"></i> ${property.features.rooms}</span>
                        <span><i class="fas fa-expand-arrows-alt"></i> ${property.features.area}</span>
                        <span><i class="fas fa-building"></i> ${property.features.floor}</span>
                    </div>
                    <div class="property-price">
                        ¥${property.price}<small>${property.priceUnit}</small>
                    </div>
                    <p class="property-description">${property.description}</p>
                    <div class="property-actions">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="yijiaApp.viewProperty(${property.id})">
                            <i class="fas fa-eye me-1"></i>查看详情
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="yijiaApp.contactAboutProperty(${property.id})">
                            <i class="fas fa-phone me-1"></i>立即咨询
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    // 查看楼盘详情
    viewProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (property) {
            // 这里可以跳转到详情页面或显示模态框
            this.showPropertyModal(property);
        }
    }

    // 显示楼盘详情模态框
    showPropertyModal(property) {
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${property.title}</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${property.image}" alt="${property.title}" class="img-fluid rounded" 
                                     onerror="this.src='assets/images/placeholder.jpg'">
                            </div>
                            <div class="col-md-6">
                                <h4 class="text-primary">¥${property.price}<small>${property.priceUnit}</small></h4>
                                <p><i class="fas fa-map-marker-alt text-primary"></i> ${property.location}</p>
                                <hr>
                                <div class="property-details">
                                    <p><strong>户型：</strong> ${property.features.rooms}</p>
                                    <p><strong>面积：</strong> ${property.features.area}</p>
                                    <p><strong>楼层：</strong> ${property.features.floor}</p>
                                </div>
                                <hr>
                                <p>${property.description}</p>
                                <div class="mt-3">
                                    <button class="btn btn-primary me-2" onclick="yijiaApp.contactAboutProperty(${property.id})">
                                        <i class="fas fa-phone me-1"></i>立即咨询
                                    </button>
                                    <a href="tel:+86-515-8888-8888" class="btn btn-outline-primary">
                                        <i class="fas fa-phone me-1"></i>直接拨打
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 咨询特定楼盘
    contactAboutProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (property) {
            // 滚动到联系表单
            document.getElementById('contact').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // 预填表单
            setTimeout(() => {
                const serviceSelect = document.getElementById('service');
                const messageTextarea = document.getElementById('message');
                
                if (serviceSelect) {
                    const typeMapping = {
                        'new': '新房购买',
                        'second-hand': '二手房交易',
                        'rental': '房屋租赁'
                    };
                    serviceSelect.value = typeMapping[property.type] || '其他';
                }
                
                if (messageTextarea) {
                    messageTextarea.value = `我对${property.title}很感兴趣，希望了解更多详细信息。位置：${property.location}，价格：¥${property.price}${property.priceUnit}`;
                }
            }, 500);
        }
    }

    // 导航栏滚动效果
    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const scrollY = window.scrollY;
        const threshold = 50;
        
        // 避免频繁的DOM操作，只在状态改变时才更新
        if (scrollY > threshold && !navbar.classList.contains('scrolled')) {
            // 使用requestAnimationFrame保证动画流畅
            requestAnimationFrame(() => {
                navbar.classList.add('scrolled');
            });
        } else if (scrollY <= threshold && navbar.classList.contains('scrolled')) {
            requestAnimationFrame(() => {
                navbar.classList.remove('scrolled');
            });
        }
    }

    // 平滑滚动
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 滚动动画效果
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        const animatedElements = document.querySelectorAll('.service-card, .property-card, .contact-form, .about-content');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // 返回顶部
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            // 使用节流优化滚动事件，防止频闪
            const throttledBackToTopScroll = throttle(() => {
                const scrollY = window.scrollY;
                const threshold = 300;
                
                // 只在状态改变时才更新DOM
                if (scrollY > threshold && !backToTopBtn.classList.contains('show')) {
                    requestAnimationFrame(() => {
                        backToTopBtn.classList.add('show');
                    });
                } else if (scrollY <= threshold && backToTopBtn.classList.contains('show')) {
                    requestAnimationFrame(() => {
                        backToTopBtn.classList.remove('show');
                    });
                }
            }, 16);

            window.addEventListener('scroll', throttledBackToTopScroll, { passive: true });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // 联系表单处理
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // 表单验证
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    // 字段验证
    validateField(field) {
        const isValid = field.value.trim() !== '';
        const phonePattern = /^1[3-9]\d{9}$/;
        
        // 移除之前的错误信息
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('is-invalid', 'is-valid');

        if (!isValid) {
            field.classList.add('is-invalid');
            this.showFieldError(field, '此字段为必填项');
            return false;
        }

        // 电话号码验证
        if (field.type === 'tel' && !phonePattern.test(field.value)) {
            field.classList.add('is-invalid');
            this.showFieldError(field, '请输入正确的手机号码');
            return false;
        }

        field.classList.add('is-valid');
        return true;
    }

    // 显示字段错误
    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger small mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // 处理联系表单提交
    handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // 验证所有字段
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('请填写所有必填字段', 'error');
            return;
        }

        // 显示加载状态
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner me-2"></span>提交中...';
        submitBtn.disabled = true;

        // 模拟提交过程
        setTimeout(() => {
            // 这里应该是实际的提交逻辑
            this.submitContactForm(data).then(success => {
                if (success) {
                    this.showMessage('感谢您的咨询！我们将尽快与您联系。', 'success');
                    form.reset();
                    form.querySelectorAll('.is-valid').forEach(field => {
                        field.classList.remove('is-valid');
                    });
                } else {
                    this.showMessage('提交失败，请稍后重试或直接联系我们。', 'error');
                }
            }).finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        }, 1000);
    }

    // 提交联系表单
    async submitContactForm(data) {
        try {
            // 这里应该调用实际的API
            console.log('提交的表单数据:', data);
            
            // 模拟API调用
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(true); // 模拟成功
                }, 1000);
            });
        } catch (error) {
            console.error('表单提交错误:', error);
            return false;
        }
    }

    // 显示消息
    showMessage(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'error'} alert-custom`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
        `;

        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(alertDiv, form);

        // 3秒后自动移除
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // 跟踪电话点击
    trackPhoneCall() {
        // 这里可以添加分析跟踪代码
        console.log('电话点击事件被跟踪');
    }

    // 获取用户位置（用于推荐附近楼盘）
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    console.log('用户位置:', { lat, lng });
                    // 这里可以根据位置推荐附近楼盘
                },
                (error) => {
                    console.log('无法获取位置信息:', error);
                }
            );
        }
    }

    // 初始化地图（如果需要）
    initMap() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // 这里可以集成百度地图或高德地图
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <i class="fas fa-map-marked-alt fa-3x text-primary mb-2"></i>
                    <p class="text-muted">盐城市大丰区维罗纳步行街</p>
                    <small class="text-muted">点击查看详细位置</small>
                </div>
            `;
            
            mapContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 250px;
                background: #f8f9fa;
                border-radius: 8px;
                cursor: pointer;
            `;

            mapContainer.addEventListener('click', () => {
                // 打开地图应用或显示详细地址
                window.open('https://map.baidu.com/search/盐城市大丰区维罗纳步行街');
            });
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.yijiaApp = new YijiaRealEstate();
    
    // 初始化地图
    yijiaApp.initMap();
    
    // 获取用户位置（可选）
    yijiaApp.getUserLocation();
});

// 防抖函数
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

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 图片懒加载
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YijiaRealEstate;
}