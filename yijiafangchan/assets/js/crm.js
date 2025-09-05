/**
 * 客户关系管理系统 (CRM)
 * 提供客户管理、线索跟进、数据统计等功能
 */

class CRMSystem {
    constructor() {
        this.customers = [];
        this.activities = [];
        this.currentSection = 'dashboard';
        this.editingCustomerId = null;
        
        this.init();
    }
    
    /**
     * 初始化CRM系统
     */
    init() {
        this.loadData();
        this.renderDashboard();
        this.setupEventListeners();
        
        console.log('[CRMSystem] 客户管理系统初始化完成');
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 搜索框事件
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.searchCustomers();
                }, 300);
            });
        }
        
        // 筛选器事件
        ['statusFilter', 'priorityFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.searchCustomers());
            }
        });
    }
    
    /**
     * 加载示例数据
     */
    loadData() {
        // 从localStorage加载，如果没有则使用示例数据
        const savedCustomers = localStorage.getItem('crm_customers');
        const savedActivities = localStorage.getItem('crm_activities');
        
        if (savedCustomers) {
            this.customers = JSON.parse(savedCustomers);
        } else {
            this.customers = this.generateSampleCustomers();
            this.saveData();
        }
        
        if (savedActivities) {
            this.activities = JSON.parse(savedActivities);
        } else {
            this.activities = this.generateSampleActivities();
            this.saveData();
        }
    }
    
    /**
     * 生成示例客户数据
     */
    generateSampleCustomers() {
        return [
            {
                id: 1,
                name: '张三',
                phone: '13800138001',
                email: 'zhangsan@example.com',
                status: 'interested',
                priority: 'high',
                source: '网站咨询',
                notes: '对金桂花园很感兴趣，计划近期看房',
                createTime: '2024-01-15T10:30:00',
                lastFollowUp: '2024-01-20T14:20:00'
            },
            {
                id: 2,
                name: '李四',
                phone: '13800138002',
                email: 'lisi@example.com',
                status: 'deal',
                priority: 'high',
                source: '朋友推荐',
                notes: '已成功购买海景公寓，客户满意度高',
                createTime: '2024-01-10T09:15:00',
                lastFollowUp: '2024-01-25T11:00:00'
            },
            {
                id: 3,
                name: '王五',
                phone: '13800138003',
                email: 'wangwu@example.com',
                status: 'contacted',
                priority: 'medium',
                source: '电话咨询',
                notes: '首次购房，需要详细了解贷款流程',
                createTime: '2024-01-20T16:45:00',
                lastFollowUp: '2024-01-22T10:30:00'
            },
            {
                id: 4,
                name: '赵六',
                phone: '13800138004',
                email: 'zhaoliu@example.com',
                status: 'new',
                priority: 'low',
                source: '广告推广',
                notes: '刚刚注册，尚未联系',
                createTime: '2024-01-25T08:20:00',
                lastFollowUp: null
            },
            {
                id: 5,
                name: '钱七',
                phone: '13800138005',
                email: 'qianqi@example.com',
                status: 'lost',
                priority: 'medium',
                source: '展会',
                notes: '价格超出预算，暂时不考虑购买',
                createTime: '2024-01-12T13:30:00',
                lastFollowUp: '2024-01-18T15:45:00'
            }
        ];
    }
    
    /**
     * 生成示例活动数据
     */
    generateSampleActivities() {
        return [
            {
                id: 1,
                type: 'customer_add',
                description: '新增客户：张三',
                time: '2024-01-15T10:30:00'
            },
            {
                id: 2,
                type: 'follow_up',
                description: '跟进客户：李四，已成交',
                time: '2024-01-25T11:00:00'
            },
            {
                id: 3,
                type: 'customer_contact',
                description: '联系客户：王五，了解需求',
                time: '2024-01-22T10:30:00'
            }
        ];
    }
    
    /**
     * 保存数据到localStorage
     */
    saveData() {
        localStorage.setItem('crm_customers', JSON.stringify(this.customers));
        localStorage.setItem('crm_activities', JSON.stringify(this.activities));
    }
    
    /**
     * 显示指定部分
     */
    showSection(sectionId) {
        // 隐藏所有部分
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        
        // 移除所有导航项的active状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // 显示指定部分
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // 激活对应导航项
        const activeLink = document.querySelector(`[onclick="crm.showSection('${sectionId}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = sectionId;
        
        // 根据部分渲染相应内容
        switch (sectionId) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'customers':
                this.renderCustomers();
                break;
        }
    }
    
    /**
     * 渲染数据概览
     */
    renderDashboard() {
        this.updateStats();
        this.renderRecentActivities();
    }
    
    /**
     * 更新统计数据
     */
    updateStats() {
        const stats = {
            totalCustomers: this.customers.length,
            totalDeals: this.customers.filter(c => c.status === 'deal').length,
            newLeads: this.customers.filter(c => c.status === 'new').length,
            pendingFollowUps: this.customers.filter(c => 
                c.status === 'contacted' || c.status === 'interested'
            ).length
        };
        
        // 动画更新数字
        Object.keys(stats).forEach(key => {
            this.animateNumber(key, stats[key]);
        });
    }
    
    /**
     * 数字动画效果
     */
    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const increment = Math.ceil((targetValue - currentValue) / 20);
        
        const animate = () => {
            const current = parseInt(element.textContent) || 0;
            if (current < targetValue) {
                element.textContent = Math.min(current + increment, targetValue);
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetValue;
            }
        };
        
        animate();
    }
    
    /**
     * 渲染最近活动
     */
    renderRecentActivities() {
        const container = document.getElementById('recentActivities');
        if (!container) return;
        
        const recentActivities = this.activities
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 10);
        
        if (recentActivities.length === 0) {
            container.innerHTML = '<p class="text-muted">暂无最近活动</p>';
            return;
        }
        
        const html = recentActivities.map(activity => `
            <div class="d-flex align-items-center mb-3">
                <div class="me-3">
                    <i class="fas ${this.getActivityIcon(activity.type)} text-primary"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="fw-bold">${activity.description}</div>
                    <small class="text-muted">${this.formatDateTime(activity.time)}</small>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }
    
    /**
     * 获取活动图标
     */
    getActivityIcon(type) {
        const icons = {
            customer_add: 'fa-user-plus',
            follow_up: 'fa-calendar-check',
            customer_contact: 'fa-phone',
            deal_closed: 'fa-handshake'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    /**
     * 渲染客户列表
     */
    renderCustomers() {
        const tbody = document.getElementById('customerTableBody');
        if (!tbody) return;
        
        const filteredCustomers = this.getFilteredCustomers();
        
        if (filteredCustomers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="fas fa-users fa-2x mb-2"></i><br>
                        暂无客户数据
                    </td>
                </tr>
            `;
            return;
        }
        
        const html = filteredCustomers.map(customer => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="customer-avatar me-3">
                            ${customer.name.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-bold">${customer.name}</div>
                            <small class="text-muted">${customer.source || '未知来源'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div>${customer.phone}</div>
                    ${customer.email ? `<small class="text-muted">${customer.email}</small>` : ''}
                </td>
                <td>
                    <span class="status-badge status-${customer.status}">
                        ${this.getStatusText(customer.status)}
                    </span>
                </td>
                <td>
                    <i class="fas fa-circle priority-${customer.priority}"></i>
                    ${this.getPriorityText(customer.priority)}
                </td>
                <td>
                    ${customer.lastFollowUp ? this.formatDateTime(customer.lastFollowUp) : '从未跟进'}
                </td>
                <td>
                    ${this.formatDateTime(customer.createTime)}
                </td>
                <td>
                    <button class="btn btn-primary btn-action" onclick="crm.editCustomer(${customer.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-success btn-action" onclick="crm.followUpCustomer(${customer.id})" title="跟进">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="btn btn-danger btn-action" onclick="crm.deleteCustomer(${customer.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = html;
    }
    
    /**
     * 获取筛选后的客户列表
     */
    getFilteredCustomers() {
        let filtered = [...this.customers];
        
        // 搜索筛选
        const searchTerm = document.getElementById('customerSearch')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm) ||
                customer.phone.includes(searchTerm) ||
                (customer.email && customer.email.toLowerCase().includes(searchTerm))
            );
        }
        
        // 状态筛选
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            filtered = filtered.filter(customer => customer.status === statusFilter);
        }
        
        // 优先级筛选
        const priorityFilter = document.getElementById('priorityFilter')?.value;
        if (priorityFilter) {
            filtered = filtered.filter(customer => customer.priority === priorityFilter);
        }
        
        return filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    }
    
    /**
     * 搜索客户
     */
    searchCustomers() {
        this.renderCustomers();
    }
    
    /**
     * 显示客户表单
     */
    showCustomerForm(customerId = null) {
        this.editingCustomerId = customerId;
        
        if (customerId) {
            // 编辑模式
            const customer = this.customers.find(c => c.id === customerId);
            if (customer) {
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerPhone').value = customer.phone;
                document.getElementById('customerEmail').value = customer.email || '';
                document.getElementById('customerStatus').value = customer.status;
                document.getElementById('customerPriority').value = customer.priority;
                document.getElementById('customerSource').value = customer.source || '';
                document.getElementById('customerNotes').value = customer.notes || '';
            }
        } else {
            // 新增模式
            document.getElementById('customerForm').reset();
        }
    }
    
    /**
     * 保存客户
     */
    saveCustomer() {
        const form = document.getElementById('customerForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const customerData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            status: document.getElementById('customerStatus').value,
            priority: document.getElementById('customerPriority').value,
            source: document.getElementById('customerSource').value,
            notes: document.getElementById('customerNotes').value
        };
        
        if (this.editingCustomerId) {
            // 更新客户
            const customerIndex = this.customers.findIndex(c => c.id === this.editingCustomerId);
            if (customerIndex > -1) {
                this.customers[customerIndex] = {
                    ...this.customers[customerIndex],
                    ...customerData
                };
                this.addActivity('customer_update', `更新客户：${customerData.name}`);
            }
        } else {
            // 新增客户
            const newCustomer = {
                id: Date.now(),
                ...customerData,
                createTime: new Date().toISOString(),
                lastFollowUp: null
            };
            this.customers.push(newCustomer);
            this.addActivity('customer_add', `新增客户：${customerData.name}`);
        }
        
        this.saveData();
        this.renderCustomers();
        this.updateStats();
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
        modal.hide();
        
        this.showMessage('客户信息保存成功！', 'success');
    }
    
    /**
     * 编辑客户
     */
    editCustomer(customerId) {
        this.showCustomerForm(customerId);
        const modal = new bootstrap.Modal(document.getElementById('customerModal'));
        modal.show();
    }
    
    /**
     * 跟进客户
     */
    followUpCustomer(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer) {
            // 更新最后跟进时间
            customer.lastFollowUp = new Date().toISOString();
            
            // 如果是新客户，更新状态为已联系
            if (customer.status === 'new') {
                customer.status = 'contacted';
            }
            
            this.addActivity('follow_up', `跟进客户：${customer.name}`);
            this.saveData();
            this.renderCustomers();
            this.showMessage(`已记录对 ${customer.name} 的跟进`, 'success');
        }
    }
    
    /**
     * 删除客户
     */
    deleteCustomer(customerId) {
        if (confirm('确定要删除这个客户吗？此操作不可恢复。')) {
            const customerIndex = this.customers.findIndex(c => c.id === customerId);
            if (customerIndex > -1) {
                const customer = this.customers[customerIndex];
                this.customers.splice(customerIndex, 1);
                this.addActivity('customer_delete', `删除客户：${customer.name}`);
                this.saveData();
                this.renderCustomers();
                this.updateStats();
                this.showMessage('客户已删除', 'warning');
            }
        }
    }
    
    /**
     * 添加活动记录
     */
    addActivity(type, description) {
        const activity = {
            id: Date.now(),
            type,
            description,
            time: new Date().toISOString()
        };
        this.activities.unshift(activity);
        
        // 只保留最近100条记录
        if (this.activities.length > 100) {
            this.activities = this.activities.slice(0, 100);
        }
        
        this.saveData();
        this.renderRecentActivities();
    }
    
    /**
     * 刷新数据概览
     */
    refreshDashboard() {
        this.renderDashboard();
        this.showMessage('数据已刷新', 'info');
    }
    
    /**
     * 切换侧边栏（移动端）
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('show');
    }
    
    /**
     * 获取状态文本
     */
    getStatusText(status) {
        const statusMap = {
            new: '新客户',
            contacted: '已联系',
            interested: '有意向',
            deal: '已成交',
            lost: '已流失'
        };
        return statusMap[status] || status;
    }
    
    /**
     * 获取优先级文本
     */
    getPriorityText(priority) {
        const priorityMap = {
            low: '低',
            medium: '中',
            high: '高'
        };
        return priorityMap[priority] || priority;
    }
    
    /**
     * 格式化日期时间
     */
    formatDateTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        // 如果是今天
        if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
            return date.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        // 如果是本年
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('zh-CN', { 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // 其他情况
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * 显示消息提示
     */
    showMessage(message, type = 'info') {
        // 创建提示元素
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // 3秒后自动关闭
        setTimeout(() => {
            if (alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 3000);
    }
    
    /**
     * 获取统计信息
     */
    getStats() {
        const statusCounts = {};
        const priorityCounts = {};
        
        this.customers.forEach(customer => {
            statusCounts[customer.status] = (statusCounts[customer.status] || 0) + 1;
            priorityCounts[customer.priority] = (priorityCounts[customer.priority] || 0) + 1;
        });
        
        return {
            totalCustomers: this.customers.length,
            totalActivities: this.activities.length,
            statusCounts,
            priorityCounts,
            recentCustomers: this.customers
                .filter(c => {
                    const createDate = new Date(c.createTime);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return createDate > weekAgo;
                }).length
        };
    }
}

// 全局实例
let crm;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    crm = new CRMSystem();
});

// 暴露到全局
window.CRMSystem = CRMSystem;
window.crm = crm;