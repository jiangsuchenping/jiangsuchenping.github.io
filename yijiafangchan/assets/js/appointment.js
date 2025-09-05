/**
 * 在线预约看房系统
 * 提供完整的预约流程管理
 */

class AppointmentSystem {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 5;
        this.appointmentData = {
            property: null,
            date: null,
            timeSlot: null,
            advisor: null,
            customer: {}
        };
        
        this.properties = [];
        this.advisors = [];
        this.timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        
        this.init();
    }
    
    /**
     * 初始化预约系统
     */
    init() {
        this.loadData();
        this.setupDatePicker();
        this.renderProperties();
        this.renderTimeSlots();
        this.renderAdvisors();
        this.updateUI();
        
        console.log('[AppointmentSystem] 预约系统初始化完成');
    }
    
    /**
     * 加载数据
     */
    loadData() {
        // 房源数据
        this.properties = [
            {
                id: 1,
                name: '金桂花园',
                location: '大丰区新丰镇',
                price: '150万起',
                image: 'assets/images/property1.jpg',
                features: ['精装修', '学区房', '地铁沿线'],
                description: '品质住宅小区，环境优美，配套齐全'
            },
            {
                id: 2,
                name: '海景公寓',
                location: '大丰区海洋新城',
                price: '85万起',
                image: 'assets/images/property2.jpg',
                features: ['海景房', '现房', '投资热点'],
                description: '海景公寓，视野开阔，投资自住两相宜'
            },
            {
                id: 3,
                name: '书香别墅',
                location: '大丰区恒北村',
                price: '380万起',
                image: 'assets/images/property3.jpg',
                features: ['独栋别墅', '私家花园', '高端社区'],
                description: '独栋别墅，园林式设计，高端生活品质'
            },
            {
                id: 4,
                name: '阳光花城',
                location: '大丰区城东新区',
                price: '125万起',
                image: 'assets/images/property4.jpg',
                features: ['现房', '学区房', '商业配套'],
                description: '现代化小区，交通便利，生活配套完善'
            }
        ];
        
        // 置业顾问数据
        this.advisors = [
            {
                id: 1,
                name: '王小美',
                title: '高级置业顾问',
                experience: '5年经验',
                specialty: '住宅、学区房',
                phone: '138****8888',
                avatar: 'assets/images/advisor1.jpg',
                rating: 4.9,
                sales: 128
            },
            {
                id: 2,
                name: '李建国',
                title: '资深置业顾问',
                experience: '8年经验',
                specialty: '别墅、高端物业',
                phone: '139****9999',
                avatar: 'assets/images/advisor2.jpg',
                rating: 4.8,
                sales: 95
            },
            {
                id: 3,
                name: '张雅丽',
                title: '置业顾问',
                experience: '3年经验',
                specialty: '公寓、投资项目',
                phone: '137****7777',
                avatar: 'assets/images/advisor3.jpg',
                rating: 4.7,
                sales: 76
            },
            {
                id: 4,
                name: '陈志华',
                title: '高级置业顾问',
                experience: '6年经验',
                specialty: '新房、二手房',
                phone: '136****6666',
                avatar: 'assets/images/advisor4.jpg',
                rating: 4.9,
                sales: 112
            }
        ];
    }
    
    /**
     * 设置日期选择器
     */
    setupDatePicker() {
        const dateInput = document.getElementById('appointmentDate');
        const today = new Date();
        const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天后
        
        // 设置最小日期为明天
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
        
        // 监听日期变化
        dateInput.addEventListener('change', () => {
            this.appointmentData.date = dateInput.value;
            this.updateTimeSlots();
        });
    }
    
    /**
     * 渲染房源列表
     */
    renderProperties() {
        const container = document.getElementById('propertyList');
        
        const html = this.properties.map(property => `
            <div class="col-md-6 mb-3">
                <div class="property-selection" data-property-id="${property.id}" onclick="appointmentSystem.selectProperty(${property.id})">
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img src="${property.image}" alt="${property.name}" class="img-fluid rounded"
                                 onerror="this.src='assets/images/placeholder.jpg'">
                        </div>
                        <div class="col-8">
                            <h6 class="mb-1">${property.name}</h6>
                            <p class="text-muted mb-1">${property.location}</p>
                            <p class="text-primary fw-bold mb-2">${property.price}</p>
                            <div class="mb-2">
                                ${property.features.slice(0, 2).map(feature => 
                                    `<span class="badge bg-light text-dark me-1">${feature}</span>`
                                ).join('')}
                            </div>
                            <p class="small text-muted mb-0">${property.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 渲染时间段
     */
    renderTimeSlots() {
        const container = document.getElementById('timeSlots');
        
        const html = this.timeSlots.map(time => `
            <div class="time-slot" data-time="${time}" onclick="appointmentSystem.selectTimeSlot('${time}')">
                ${time}
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 渲染置业顾问
     */
    renderAdvisors() {
        const container = document.getElementById('advisorList');
        
        const html = this.advisors.map(advisor => `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="advisor-card" data-advisor-id="${advisor.id}" onclick="appointmentSystem.selectAdvisor(${advisor.id})">
                    <img src="${advisor.avatar}" alt="${advisor.name}" class="advisor-avatar"
                         onerror="this.src='assets/images/default-avatar.jpg'">
                    <h6>${advisor.name}</h6>
                    <p class="text-muted mb-1">${advisor.title}</p>
                    <p class="small text-muted mb-2">${advisor.experience}</p>
                    <p class="small mb-2"><strong>专长：</strong>${advisor.specialty}</p>
                    <div class="d-flex justify-content-between small text-muted">
                        <span>评分: ${advisor.rating}★</span>
                        <span>成交: ${advisor.sales}套</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 选择房源
     */
    selectProperty(propertyId) {
        this.appointmentData.property = this.properties.find(p => p.id === propertyId);
        
        // 更新UI选中状态
        document.querySelectorAll('.property-selection').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-property-id="${propertyId}"]`).classList.add('selected');
        
        this.updateNextButton();
    }
    
    /**
     * 选择时间段
     */
    selectTimeSlot(time) {
        this.appointmentData.timeSlot = time;
        
        // 更新UI选中状态
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        document.querySelector(`[data-time="${time}"]`).classList.add('selected');
        
        this.updateNextButton();
    }
    
    /**
     * 选择顾问
     */
    selectAdvisor(advisorId) {
        this.appointmentData.advisor = this.advisors.find(a => a.id === advisorId);
        
        // 更新UI选中状态
        document.querySelectorAll('.advisor-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-advisor-id="${advisorId}"]`).classList.add('selected');
        
        this.updateNextButton();
    }
    
    /**
     * 更新时间段可用性
     */
    updateTimeSlots() {
        const selectedDate = new Date(this.appointmentData.date);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        const currentHour = today.getHours();
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            const time = slot.dataset.time;
            const slotHour = parseInt(time.split(':')[0]);
            
            // 如果是今天，禁用已过时间
            if (isToday && slotHour <= currentHour + 1) {
                slot.classList.add('disabled');
                slot.onclick = null;
            } else {
                slot.classList.remove('disabled');
                slot.onclick = () => this.selectTimeSlot(time);
            }
            
            // 随机标记一些时间段为已预约（模拟真实情况）
            if (Math.random() < 0.2) {
                slot.classList.add('disabled');
                slot.innerHTML = time + '<br><small>已预约</small>';
                slot.onclick = null;
            }
        });
    }
    
    /**
     * 下一步
     */
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // 如果是最后一步，提交预约
        if (this.currentStep === this.maxSteps) {
            this.submitAppointment();
            return;
        }
        
        // 如果是第四步，收集用户信息
        if (this.currentStep === 4) {
            this.collectCustomerInfo();
        }
        
        this.currentStep++;
        this.updateUI();
        
        // 如果进入确认步骤，显示确认信息
        if (this.currentStep === 5) {
            this.showConfirmation();
        }
    }
    
    /**
     * 上一步
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }
    
    /**
     * 验证当前步骤
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.appointmentData.property) {
                    alert('请选择一个楼盘');
                    return false;
                }
                break;
                
            case 2:
                if (!this.appointmentData.date || !this.appointmentData.timeSlot) {
                    alert('请选择预约日期和时间');
                    return false;
                }
                break;
                
            case 3:
                if (!this.appointmentData.advisor) {
                    alert('请选择一位置业顾问');
                    return false;
                }
                break;
                
            case 4:
                const name = document.getElementById('customerName').value.trim();
                const phone = document.getElementById('customerPhone').value.trim();
                
                if (!name || !phone) {
                    alert('请填写姓名和手机号码');
                    return false;
                }
                
                if (!/^1[3-9]\d{9}$/.test(phone)) {
                    alert('请输入正确的手机号码');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    /**
     * 收集客户信息
     */
    collectCustomerInfo() {
        this.appointmentData.customer = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            wechat: document.getElementById('customerWechat').value.trim(),
            intent: document.getElementById('purchaseIntent').value,
            budget: document.getElementById('budgetRange').value,
            requirements: document.getElementById('specialRequests').value.trim()
        };
    }
    
    /**
     * 显示确认信息
     */
    showConfirmation() {
        const container = document.getElementById('confirmationDetails');
        
        const html = `
            <div class="confirmation-item">
                <h6><i class="fas fa-building me-2"></i>选择楼盘</h6>
                <div class="row align-items-center">
                    <div class="col-3">
                        <img src="${this.appointmentData.property.image}" alt="${this.appointmentData.property.name}" 
                             class="img-fluid rounded" onerror="this.src='assets/images/placeholder.jpg'">
                    </div>
                    <div class="col-9">
                        <p class="mb-1"><strong>${this.appointmentData.property.name}</strong></p>
                        <p class="text-muted mb-1">${this.appointmentData.property.location}</p>
                        <p class="text-primary mb-0">${this.appointmentData.property.price}</p>
                    </div>
                </div>
            </div>
            
            <div class="confirmation-item">
                <h6><i class="fas fa-calendar-alt me-2"></i>预约时间</h6>
                <p class="mb-0">${this.formatDate(this.appointmentData.date)} ${this.appointmentData.timeSlot}</p>
            </div>
            
            <div class="confirmation-item">
                <h6><i class="fas fa-user-tie me-2"></i>置业顾问</h6>
                <div class="d-flex align-items-center">
                    <img src="${this.appointmentData.advisor.avatar}" alt="${this.appointmentData.advisor.name}" 
                         class="rounded-circle me-3" style="width: 50px; height: 50px; object-fit: cover;"
                         onerror="this.src='assets/images/default-avatar.jpg'">
                    <div>
                        <p class="mb-0"><strong>${this.appointmentData.advisor.name}</strong> - ${this.appointmentData.advisor.title}</p>
                        <p class="text-muted mb-0">${this.appointmentData.advisor.experience} • ${this.appointmentData.advisor.specialty}</p>
                    </div>
                </div>
            </div>
            
            <div class="confirmation-item">
                <h6><i class="fas fa-user me-2"></i>联系信息</h6>
                <div class="row">
                    <div class="col-6">
                        <p class="mb-1"><strong>姓名：</strong>${this.appointmentData.customer.name}</p>
                        <p class="mb-1"><strong>手机：</strong>${this.appointmentData.customer.phone}</p>
                        ${this.appointmentData.customer.wechat ? `<p class="mb-1"><strong>微信：</strong>${this.appointmentData.customer.wechat}</p>` : ''}
                    </div>
                    <div class="col-6">
                        ${this.appointmentData.customer.intent ? `<p class="mb-1"><strong>购房需求：</strong>${this.appointmentData.customer.intent}</p>` : ''}
                        ${this.appointmentData.customer.budget ? `<p class="mb-1"><strong>预算范围：</strong>${this.appointmentData.customer.budget}</p>` : ''}
                    </div>
                </div>
                ${this.appointmentData.customer.requirements ? `
                    <div class="mt-2">
                        <strong>特殊要求：</strong>
                        <p class="text-muted mt-1">${this.appointmentData.customer.requirements}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>温馨提示：</strong>请确保以上信息准确无误，我们的置业顾问将按照预约时间为您提供专业的看房服务。
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * 提交预约
     */
    submitAppointment() {
        // 显示加载状态
        const nextBtn = document.getElementById('nextBtn');
        const originalText = nextBtn.innerHTML;
        nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>提交中...';
        nextBtn.disabled = true;
        
        // 模拟提交过程
        setTimeout(() => {
            // 生成预约编号
            const appointmentNumber = 'YJ' + Date.now().toString().slice(-8);
            
            // 保存到localStorage（模拟数据库）
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push({
                number: appointmentNumber,
                ...this.appointmentData,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            // 显示成功信息
            document.getElementById('appointmentNumber').textContent = appointmentNumber;
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();
            
            // 恢复按钮状态
            nextBtn.innerHTML = originalText;
            nextBtn.disabled = false;
            
        }, 2000);
    }
    
    /**
     * 更新UI
     */
    updateUI() {
        // 更新步骤指示器
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.querySelector('.step-circle').innerHTML = '<i class="fas fa-check"></i>';
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.querySelector('.step-circle').textContent = stepNumber;
            } else {
                step.querySelector('.step-circle').textContent = stepNumber;
            }
        });
        
        // 更新表单部分显示
        document.querySelectorAll('.form-section').forEach((section, index) => {
            section.classList.remove('active');
            if (index + 1 === this.currentStep) {
                section.classList.add('active');
            }
        });
        
        // 更新导航按钮
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        
        if (this.currentStep === this.maxSteps) {
            nextBtn.innerHTML = '<i class="fas fa-check me-2"></i>确认预约';
        } else {
            nextBtn.innerHTML = '下一步<i class="fas fa-chevron-right ms-2"></i>';
        }
        
        this.updateNextButton();
    }
    
    /**
     * 更新下一步按钮状态
     */
    updateNextButton() {
        const nextBtn = document.getElementById('nextBtn');
        let canProceed = false;
        
        switch (this.currentStep) {
            case 1:
                canProceed = !!this.appointmentData.property;
                break;
            case 2:
                canProceed = !!(this.appointmentData.date && this.appointmentData.timeSlot);
                break;
            case 3:
                canProceed = !!this.appointmentData.advisor;
                break;
            default:
                canProceed = true;
        }
        
        nextBtn.disabled = !canProceed;
    }
    
    /**
     * 格式化日期
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekDay = weekDays[date.getDay()];
        
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${weekDay}`;
    }
    
    /**
     * 新预约
     */
    newAppointment() {
        // 重置数据
        this.currentStep = 1;
        this.appointmentData = {
            property: null,
            date: null,
            timeSlot: null,
            advisor: null,
            customer: {}
        };
        
        // 清空表单
        document.getElementById('appointmentForm').reset();
        document.getElementById('appointmentDate').value = '';
        
        // 清除选中状态
        document.querySelectorAll('.property-selection, .time-slot, .advisor-card').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 关闭模态框并更新UI
        bootstrap.Modal.getInstance(document.getElementById('successModal')).hide();
        this.updateUI();
    }
    
    /**
     * 获取预约统计
     */
    getStats() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        return {
            total: appointments.length,
            today: appointments.filter(apt => {
                const today = new Date().toISOString().split('T')[0];
                return apt.createdAt.split('T')[0] === today;
            }).length,
            byStatus: appointments.reduce((acc, apt) => {
                acc[apt.status] = (acc[apt.status] || 0) + 1;
                return acc;
            }, {}),
            byProperty: appointments.reduce((acc, apt) => {
                const propertyName = apt.property ? apt.property.name : 'Unknown';
                acc[propertyName] = (acc[propertyName] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// 全局实例
let appointmentSystem;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    appointmentSystem = new AppointmentSystem();
});

// 暴露到全局
window.AppointmentSystem = AppointmentSystem;
window.appointmentSystem = appointmentSystem;