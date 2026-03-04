/**
 * UI 工具类（UI）
 * 提供全局复用的轻量级 UI 交互方法：顶部浮动提示（Toast）和系统弹窗（Alert）
 */
const UI = {
    /**
     * 显示一条浮动 Toast 提示消息，3秒后自动消失
     * @param {string} message - 提示文字内容
     * @param {string} [type='info'] - 消息类型：'success'（绿色）| 'error'（红色）| 'info'（蓝紫色）
     */
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.marginBottom = '10px';
        // 根据消息类型设置不同背景色：成功绿、错误红、信息蓝紫
        toast.style.background = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#6366f1');
        toast.style.color = 'white';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000); // 3 秒后自动移除 Toast 元素
    },

    /**
     * 显示原生系统弹窗（alert），主要用于操作确认提示
     * 演示环境下使用原生 alert 代替自定义 Modal，简化实现
     * @param {string} message - 弹窗内容
     */
    alert(message) {
        window.alert(`【系统提示】\n${message}`);
    }
};

/**
 * Views 视图对象
 * ============================================================
 * 包含所有页面的 HTML 模板生成函数，每个函数返回对应页面的 HTML 字符串。
 * 渲染时由 Router 将返回的 HTML 注入到页面内容容器中。
 * 各视图函数均为纯渲染（无副作用），事件绑定由对应的 bind*Events 函数负责。
 * ============================================================
 */
const Views = {
    /**
     * 渲染登录页
     * 包含系统 Logo、用户名/密码输入框和登录按钮
     * 表单提交事件由 bindLoginEvents() 绑定
     * @returns {string} 登录页面的 HTML 字符串
     */
    login() {
        return `
            <div class="login-view fade-in" style="padding-top: 2rem;">
                <div style="text-align: center; margin-bottom: 3rem;">
                    <div style="font-size: 2.5rem; color: var(--primary); margin-bottom: 0.5rem;">
                        <i data-lucide="calendar-check" style="width: 64px; height: 64px;"></i>
                    </div>
                    <h2>请假系统</h2>
                    <p style="color: var(--text-light)">演示环境 - 默认密码 123</p>
                </div>
                <div class="card">
                    <form id="login-form">
                        <div class="form-group">
                            <label>用户名</label>
                            <input type="text" id="username" class="form-control" placeholder="输入用户名 (如 zhangsan)" required>
                        </div>
                        <div class="form-group">
                            <label>密码</label>
                            <input type="password" id="password" class="form-control" placeholder="输入密码" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">登录</button>
                    </form>
                </div>
            </div>
        `;
    },

    /**
     * 渲染首页仪表盘
     * 显示当前登录用户的基本信息、各类假期余额（按最近有效额度周期计算）
     * 以及快速申请入口，HR/经理可见管理快捷入口
     * @returns {string} 首页 HTML 字符串
     */
    dashboard() {
        const user = Auth.currentUser;
        const entitlements = API.getEntitlements(user.id); // 获取当前用户的全部额度记录
        const leaveTypes = API.getLeaveTypes();
        const nowStr = new Date().toISOString().split('T')[0]; // 今天日期字符串 YYYY-MM-DD

        // 过滤出含有有效日期范围的额度记录（防止旧数据字段缺失导致报错）
        const validRangeItems = entitlements.filter(e => e.startDate && e.endDate);

        // 找出最近未过期的额度周期用于展示周期标注；若全部过期则取 endDate 最大的一条历史记录
        const allValid = validRangeItems.filter(e => e.endDate >= nowStr).sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
        const activePeriod = allValid[0] || [...validRangeItems].sort((a, b) => (b.endDate || '').localeCompare(a.endDate || ''))[0];
        // 生成"(xxxx年x月x日~xxxx年x月x日)"格式的周期描述字符串
        const periodStr = activePeriod ? `(${formatDateChinese(activePeriod.startDate)}~${formatDateChinese(activePeriod.endDate)})` : '';

        // 遍历所有假期类型，生成每种假期的余额卡片 HTML
        const balanceHTML = leaveTypes.map(type => {
            const ent = API.getEntitlement(user.id, type.id); // 自动匹配最近有效额度
            const total = ent ? ent.totalDays : 0;
            const used = ent ? ent.usedDays : 0;
            const remaining = total - used; // 剩余天数 = 总额度 - 已使用
            return `
                <div class="balance-item" style="flex: 1; min-width: 45%; padding: 1rem; background: var(--bg); border-radius: var(--radius); margin: 5px;">
                    <div style="font-size: 0.8rem; color: var(--text-light)">${type.name}</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${type.color}">${remaining} <span style="font-size: 0.8rem">天</span></div>
                </div>
            `;
        }).join('');

        return `
            <div class="fade-in">
                <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="font-size: 1rem; font-weight: 500; margin-bottom: 0.25rem;">你好, ${user.name}</p>
                        <p style="font-size: 0.875rem; color: var(--text-light)">${user.employeeId} · ${user.role.toUpperCase()}</p>
                    </div>
                    <img src="${user.avatar}" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--primary);">
                </div>

                <div class="card">
                    <p style="margin-bottom: 1rem; font-size: 1rem; font-weight: 500;">假期余额 <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-light); margin-left: 4px;">${periodStr}</span></p>
                    <div style="display: flex; flex-wrap: wrap; margin: -5px;">
                        ${balanceHTML}
                    </div>
                </div>

                <div class="card" style="background: linear-gradient(135deg, var(--primary), #818cf8); color: white; border: none;">
                    <p style="font-size: 1rem; font-weight: 500; margin-bottom: 0.5rem;">快速申请</p>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">点击下方按钮立即开启请假流程</p>
                    <a href="#/leave/apply" class="btn" style="background: white; color: var(--primary);">去请假</a>
                </div>
            </div>
        `;
    },

    /**
     * 渲染请假记录列表页（移动端卡片式布局）
     * - 普通员工：只看自己的记录
     * - HR：可看全员记录
     * - 待审批且 editable=true 的记录右侧显示「编辑」按钮
     * @returns {string} 请假记录页 HTML 字符串
     */
    leaveList() {
        const user = Auth.currentUser;
        const leaves = Auth.hasRole('hr') ? API.getLeaves() : API.getMyLeaves(user.id);
        const leaveTypes = API.getLeaveTypes();

        const rows = leaves.map(l => {
            const type = leaveTypes.find(t => t.id === l.leaveTypeId);
            const statusClass = `badge-${l.status.toLowerCase()}`;
            // 审批中的记录显示编辑按钮
            const canEdit = l.status === 'Pending' && l.editable === true;
            const editButton = canEdit ? `<button class="btn-edit-leave" data-id="${l.id}" style="margin-left: 8px; padding: 2px 8px; font-size: 0.75rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">编辑</button>` : '';
            return `
                <div class="card fade-in leave-item" data-id="${l.id}" style="padding: 1rem; margin-bottom: 10px; ${canEdit ? 'border-left: 3px solid var(--primary);' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                            <span class="badge ${statusClass}">${l.status}</span>
                            <strong style="margin-left: 8px;">${type ? type.name : 'Unknown'}</strong>
                            ${editButton}
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-light)">${l.duration}天</div>
                    </div>
                    <div style="font-size: 0.875rem; margin-bottom: 4px;">${l.startDate} 至 ${l.endDate}</div>
                    <div style="font-size: 0.8rem; color: var(--text-light)">原因: ${l.reason}</div>
                    ${Auth.hasRole('hr') ? `<div style="font-size: 0.75rem; margin-top: 8px; border-top: 1px solid var(--border); padding-top: 4px;">申请人: ${API.getUser(l.userId)?.name}</div>` : ''}
                </div>
            `;
        }).join('') || '<div style="text-align: center; color: var(--text-light); padding: 2rem;">暂无请假记录</div>';

        // 延迟绑定编辑按钮事件（等 innerHTML 渲染完成后再查询 DOM 元素）
        setTimeout(() => {
            document.querySelectorAll('.btn-edit-leave').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
                    const leaveId = btn.dataset.id;
                    const leave = API.getLeaves().find(l => l.id === leaveId);
                    if (leave) {
                        this.showEditModal(leave); // 打开编辑弹窗
                    }
                });
            });
        }, 0);

        return `
            <div class="fade-in">
                ${rows}
                <div class="card" style="text-align: center; color: var(--primary); font-size: 0.875rem;">
                    <i data-lucide="download" style="width: 16px; height: 16px; vertical-align: middle;"></i> 导出报表 (演示)
                </div>
            </div>
        `;
    },

    /**
     * 显示编辑请假申请弹窗
     * @param {Object} leave - 请假记录对象
     */
    /**
     * 显示编辑请假申请弹窗（仅限 Pending 状态的单据）
     * 支持修改：假期类型、开始/结束日期、请假原因
     * 天数自动按工作日计算，实时展示剩余额度
     * @param {Object} leave - 待编辑的请假记录对象
     */
    showEditModal(leave) {
        const user = Auth.currentUser;
        const leaveTypes = API.getLeaveTypes();
        const type = leaveTypes.find(t => t.id === leave.leaveTypeId);
        const options = leaveTypes.map(t => `<option value="${t.id}" ${t.id === leave.leaveTypeId ? 'selected' : ''}>${t.name}</option>`).join('');

        // 创建弹窗遮罩
        const modal = document.createElement('div');
        modal.id = 'edit-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 1000;
            display: flex; align-items: center; justify-content: center;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: var(--radius); padding: 1.5rem; width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto;">
                <h3 style="margin-bottom: 1rem;">编辑请假申请</h3>
                <form id="edit-form">
                    <div class="form-group">
                        <label>请假类型</label>
                        <select id="edit-leaveTypeId" class="form-control">${options}</select>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div class="form-group" style="flex: 1">
                            <label>开始日期</label>
                            <input type="date" id="edit-startDate" class="form-control" value="${leave.startDate}" required>
                        </div>
                        <div class="form-group" style="flex: 1">
                            <label>结束日期</label>
                            <input type="date" id="edit-endDate" class="form-control" value="${leave.endDate}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label id="edit-duration-label">请假天数 <span style="color: var(--primary-hover); font-weight: normal;"></span></label>
                        <input type="number" id="edit-duration" class="form-control" value="${leave.duration}" step="0.5" readonly style="background: var(--bg);">
                    </div>
                    <div class="form-group">
                        <label>请假原因</label>
                        <textarea id="edit-reason" class="form-control" rows="2" required>${leave.reason}</textarea>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 1rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">保存修改</button>
                        <button type="button" id="edit-cancel" class="btn" style="flex: 1; background: var(--bg);">取消</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // 获取DOM元素
        const typeSelect = document.getElementById('edit-leaveTypeId');
        const startInput = document.getElementById('edit-startDate');
        const endInput = document.getElementById('edit-endDate');
        const durInput = document.getElementById('edit-duration');
        const durLabel = document.getElementById('edit-duration-label');

        /**
         * 更新计算和剩余天数显示
         */
        const updateCalculations = () => {
            const typeId = typeSelect.value;
            const start = startInput.value;
            const end = endInput.value;

            // 计算工作日天数
            if (start && end) {
                const count = calculateWorkdays(start, end);
                durInput.value = count;
            }

            // 显示剩余天数
            const ent = API.getEntitlement(user.id, typeId, start);
            if (ent) {
                const remaining = ent.totalDays - ent.usedDays;
                durLabel.innerHTML = `请假天数 <span style="color: var(--primary-hover); font-weight: normal;">(剩余 ${remaining} 天)</span>`;
            } else {
                durLabel.innerHTML = `请假天数 <span style="color: var(--danger); font-weight: normal;">(未找到该时段额度)</span>`;
            }
        };

        // 绑定事件
        typeSelect.onchange = updateCalculations;
        startInput.onchange = updateCalculations;
        endInput.onchange = updateCalculations;

        // 初始化计算
        updateCalculations();

        // 绑定取消事件
        document.getElementById('edit-cancel').onclick = () => {
            modal.remove();
        };

        // 绑定表单提交事件
        document.getElementById('edit-form').onsubmit = (e) => {
            e.preventDefault();

            const typeId = typeSelect.value;
            const start = startInput.value;
            const end = endInput.value;
            const duration = parseFloat(durInput.value);

            // 验证：检查日期是否在额度周期内
            const entStart = API.getEntitlement(user.id, typeId, start);
            const entEnd = API.getEntitlement(user.id, typeId, end);

            if (!entStart) {
                UI.alert('开始日期不在任何可用额度周期内');
                return;
            }

            if (!entEnd || entStart.startDate !== entEnd.startDate || entStart.endDate !== entEnd.endDate) {
                UI.alert('请假申请不可跨年度额度周期申请。\n若确实需要跨年度，请分两次申请（分别在两个周期的时间范围内）。');
                return;
            }

            // 验证：检查天数是否超过剩余天数
            const remaining = entStart.totalDays - entStart.usedDays;
            if (remaining < duration) {
                UI.alert(`请假天数 (${duration}天) 超过剩余天数 (${remaining}天)`);
                return;
            }

            // 更新请假记录
            leave.leaveTypeId = typeId;
            leave.startDate = start;
            leave.endDate = end;
            leave.duration = duration;
            leave.reason = document.getElementById('edit-reason').value;

            // 保存到API
            API.updateLeave(leave);

            // 关闭弹窗并刷新页面
            modal.remove();
            UI.toast('请假申请已更新', 'success');
            Router.navigate();
        };

        // 点击遮罩关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    },

    /**
     * 渲染发起请假申请表单页（移动端单列布局）
     * 包含申请人信息、假期类型选择、日期范围、水感天数计算及请假原因输入
     * 表单事件由 bindApplyEvents() 绑定
     * @returns {string} 申请页 HTML 字符串
     */
    leaveApply() {
        const user = Auth.currentUser;
        const leaveTypes = API.getLeaveTypes();
        const now = new Date().toISOString().split('T')[0];
        const todayDisplay = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

        const options = leaveTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

        return `
            <div class="fade-in">
                <div class="card">
                    <form id="apply-form">
                        <div style="display: flex; gap: 10px;">
                            <div class="form-group" style="flex: 1">
                                <label>申请人</label>
                                <input type="text" class="form-control" value="${user.name}" disabled>
                            </div>
                            <div class="form-group" style="flex: 1">
                                <label>入职日期</label>
                                <input type="text" class="form-control" value="${user.joinDate || '未设置'}" disabled>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>申请日期</label>
                            <input type="text" class="form-control" value="${todayDisplay}" disabled>
                        </div>
                        <div class="form-group">
                            <label>请假类型</label>
                            <select id="leaveTypeId" class="form-control" required>
                                ${options}
                            </select>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <div class="form-group" style="flex: 1">
                                <label>开始日期</label>
                                <input type="date" id="startDate" class="form-control" value="${now}" required>
                            </div>
                            <div class="form-group" style="flex: 1">
                                <label>结束日期</label>
                                <input type="date" id="endDate" class="form-control" value="${now}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label id="duration-label">请假天数</label>
                            <input type="number" id="duration" class="form-control" placeholder="自动计算工作日..." readonly step="0.5">
                        </div>
                        <div class="form-group">
                            <label>请假原因</label>
                            <textarea id="reason" class="form-control" rows="3" placeholder="填写详细原因..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label>附件上传 (模拟)</label>
                            <div style="border: 2px dashed var(--border); border-radius: var(--radius); padding: 1rem; text-align: center; color: var(--text-light);">
                                <i data-lucide="upload-cloud"></i> <br> 点击或拖拽上传
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">提交申请</button>
                    </form>
                </div>
            </div>
        `;
    },

    /**
     * 渲染审批页（仅经理/HR 可见）
     * - 经理：只看到直接下属的待审批申请
     * - HR：可看全员待审批申请
     * 包含通过/拒绝按钮，事件由 bindAuditEvents() 绑定
     * @returns {string} 审批页 HTML 字符串
     */
    audit() {
        const user = Auth.currentUser;
        let leaves = API.getLeaves().filter(l => l.status === 'Pending');
        if (user.role === 'manager') {
            leaves = leaves.filter(l => API.getUser(l.userId).managerId === user.id);
        }

        const items = leaves.map(l => {
            const type = API.getLeaveTypes().find(t => t.id === l.leaveTypeId);
            const applicant = API.getUser(l.userId);
            return `
                <div class="card fade-in">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <strong>${applicant.name}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-light)">类型: ${type.name} (${l.duration}天)</div>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${l.createTime}</div>
                    </div>
                    <div style="margin: 10px 0; font-size: 0.875rem;">${l.startDate} ~ ${l.endDate}</div>
                    <p style="font-size: 0.85rem; background: var(--bg); padding: 8px; border-radius: 4px;">理由: ${l.reason}</p>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn btn-primary btn-approve" data-id="${l.id}" style="height: 36px; padding: 0;">通过</button>
                        <button class="btn btn-reject" data-id="${l.id}" style="height: 36px; padding: 0; background: var(--danger); color: white;">拒绝</button>
                    </div>
                </div>
            `;
        }).join('') || '<div style="text-align: center; padding: 2rem; color: var(--text-light)">暂无待审批项</div>';

        return `
            <div class="fade-in">
                ${items}
            </div>
        `;
    },

    /**
     * 渲染管理功能入口菜单页（HR 专用）
     * 展示三个管理入口卡片：员工管理、假期配置、额度调整
     * @returns {string} 管理菜单页 HTML 字符串
     */
    admin() {
        return `
            <div class="fade-in">
                <a href="#/admin/users" class="card" style="display: block; text-decoration: none; color: inherit;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="padding: 10px; background: #e0e7ff; color: #4338ca; border-radius: 10px;"><i data-lucide="users"></i></div>
                        <div>
                            <strong>员工管理</strong>
                            <div style="font-size: 0.75rem; color: var(--text-light)">维护员工信息、入职与角色</div>
                        </div>
                    </div>
                </a>
                <a href="#/admin/leave-types" class="card" style="display: block; text-decoration: none; color: inherit;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="padding: 10px; background: #fef3c7; color: #92400e; border-radius: 10px;"><i data-lucide="calendar"></i></div>
                        <div>
                            <strong>假期配置</strong>
                            <div style="font-size: 0.75rem; color: var(--text-light)">维护假期类型、规则及周期</div>
                        </div>
                    </div>
                </a>
                <a href="#/admin/entitlements" class="card" style="display: block; text-decoration: none; color: inherit;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="padding: 10px; background: #d1fae5; color: #065f46; border-radius: 10px;"><i data-lucide="bar-chart"></i></div>
                        <div>
                            <strong>额度调整</strong>
                            <div style="font-size: 0.75rem; color: var(--text-light)">手动调整员工特定类型天数</div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    },

    /**
     * 渲染员工管理列表页（移动端卸置式布局）
     * 每条员工卡片展示头像、姓名、工号、角色和在职状态
     * 顶部提供搜索框和新增按钮，事件由 bindAdminUsersEvents() 绑定
     * @returns {string} 员工管理页 HTML 字符串
     */
    adminUsers() {
        const users = API.getUsers();
        const rows = users.map(u => `
            <div class="card fade-in" style="padding: 1rem; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${u.avatar}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <div style="font-weight: 500;">${u.name} (${u.employeeId})</div>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${u.role} · ${u.status}</div>
                    </div>
                </div>
                <button class="btn-edit-user" data-id="${u.id}" style="background: var(--bg); border: 1px solid var(--border); padding: 4px 12px; border-radius: 4px; font-size: 0.75rem;">编辑</button>
            </div>
        `).join('');

        return `
            <div class="fade-in">
                <div style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 10px;">
                    <input type="text" id="user-search" class="form-control" placeholder="搜索姓名/工号..." style="width: 100%; margin: 0;">
                    <button id="btn-add-user" class="btn btn-primary" style="width: 100%; margin: 0;">新增员工</button>
                </div>
                <div id="user-list">
                    ${rows}
                </div>
            </div>
        `;
    },

    /**
     * 渲染假期配置列表页（移动端）
     * 展示全部假期类型，左边彩色条区分
     * 顶部提供新增按钮，当前枚为全宽呈现
     * 事件由 bindAdminLeaveTypesEvents() 绑定
     * @returns {string} 假期配置页 HTML 字符串
     */
    adminLeaveTypes() {
        const types = API.getLeaveTypes();
        const rows = types.map(t => `
            <div class="card fade-in" style="padding: 1rem; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; border-left: 4px solid ${t.color}">
                <div>
                    <div style="font-weight: 500;">${t.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-light)">
                        年度上限: ${t.hasAnnualLimit ? '有' : '无'} · 
                        需附件: ${t.requiresAttachment ? '是' : '否'}
                    </div>
                </div>
                <button class="btn-edit-type" data-id="${t.id}" style="background: var(--bg); border: 1px solid var(--border); padding: 4px 12px; border-radius: 4px; font-size: 0.75rem;">修改</button>
            </div>
        `).join('');

        return `
            <div class="fade-in">
                <div style="margin-bottom: 1rem;">
                    <button id="btn-add-type" class="btn btn-primary" style="width: 100%; margin: 0;">新增假期类型</button>
                </div>
                <div id="type-list">
                    ${rows}
                </div>
            </div>
        `;
    },

    /**
     * 渲染员工额度管理页（移动端）
     * 展示所有员工的假期额度记录，包含周期、总额度和已用天数
     * 顶部提供新增按钮，每条记录右侧有「调整」按钮
     * 事件由 bindAdminEntitlementsEvents() 绑定
     * @returns {string} 额度管理页 HTML 字符串
     */
    adminEntitlements() {
        const ents = API.getAllEntitlements();
        const users = API.getUsers();
        const types = API.getLeaveTypes();

        const rows = ents.map(e => {
            const user = users.find(u => u.id === e.userId);
            const type = types.find(t => t.id === e.leaveTypeId);
            return `
                <div class="card fade-in" style="padding: 1rem; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <strong>${user ? user.name : 'Unknown User'}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-light)">类型: ${type ? type.name : 'Unknown'}</div>
                        </div>
                        <button class="btn-edit-ent" data-json='${JSON.stringify(e)}' style="background: var(--bg); border: 1px solid var(--border); padding: 4px 12px; border-radius: 4px; font-size: 0.75rem;">调整</button>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-light)">
                        周期: ${e.startDate} 至 ${e.endDate}
                    </div>
                    <div style="margin-top: 4px; font-weight: 500;">
                        额度: ${e.totalDays} 天 (已用 ${e.usedDays} 天)
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="fade-in">
                <div style="margin-bottom: 1rem;">
                    <button id="btn-add-ent" class="btn btn-primary" style="width: 100%; margin: 0;">新增员工额度</button>
                </div>
                <div id="ent-list">
                    ${rows}
                </div>
            </div>
        `;
    }
};

/**
 * 应用入口函数
 * 应用启动流程：
 *   1. 初始化 API（加载或恢复数据）
 *   2. 初始化 Auth（恢复登录状态）
 *   3. 注册各路由对应的视图渲染函数
 *   4. 启动路由监听并渲染当前页面
 *   5. 根据角色更新导航栏显示隐藏
 */
async function initApp() {
    await API.init(); // 初始化数据层（优先 localStorage，否则加载 JSON）
    Auth.init(); // 恢复 sessionStorage 中的登录状态

    // 注册路由：将每个 URL Hash 路径映射到对应的视图函数
    Router.on('#/login', () => {
        const html = Views.login();
        setTimeout(bindLoginEvents, 0); // 等渲染完成后再绑定表单事件
        return html;
    });

    Router.on('#/', () => Views.dashboard()); // 首页：无事件绑定需求
    Router.on('#/leave/apply', () => {
        const html = Views.leaveApply();
        setTimeout(bindApplyEvents, 0); // 等渲染完成后绑定申请表单事件
        return html;
    });
    Router.on('#/leave/list', () => Views.leaveList()); // 请假列表：内嵌 setTimeout 绑定事件
    Router.on('#/audit', () => {
        const html = Views.audit();
        setTimeout(bindAuditEvents, 0); // 等渲染完成后绑定审批按钮事件
        return html;
    });
    Router.on('#/admin', () => Views.admin()); // 管理菜单页
    Router.on('#/admin/users', () => {
        const html = Views.adminUsers();
        setTimeout(bindAdminUsersEvents, 0); // 等渲染完成后绑定员工管理事件
        return html;
    });
    Router.on('#/admin/leave-types', () => {
        const html = Views.adminLeaveTypes();
        setTimeout(bindAdminLeaveTypesEvents, 0); // 等渲染完成后绑定假期配置事件
        return html;
    });
    Router.on('#/admin/entitlements', () => {
        const html = Views.adminEntitlements();
        setTimeout(bindAdminEntitlementsEvents, 0); // 等渲染完成后绑定额度管理事件
        return html;
    });

    Router.init(); // 启动路由监听并渲染当前页面
    updateUIForRole(); // 根据当前用户角色展示/隐藏导航项
}

/**
 * 根据登录用户的角色，动态显示或隐藏导航栏内的复权项目
 * - 审批导航：经理和 HR 可见
 * - 管理导航：仅 HR 可见
 */
function updateUIForRole() {
    if (!Auth.currentUser) return;
    const isManager = Auth.hasRole('manager') || Auth.hasRole('hr');
    const isHR = Auth.hasRole('hr');

    // 根据角色切换待审批导航项的显示状态
    document.getElementById('nav-audit').style.display = isManager ? 'flex' : 'none';
    // HR 才能看到管理导航项
    document.getElementById('nav-admin').style.display = isHR ? 'flex' : 'none';
}

/**
 * 绑定登录表单的提交事件
 * 调用 Auth.login() 进行登录，成功后跳转首页，失败则显示 Toast 错误提示
 */
function bindLoginEvents() {
    const form = document.getElementById('login-form');
    if (!form) return; // 若 DOM 渲染延迟导致元素不存在，安全退出
    form.onsubmit = async (e) => {
        e.preventDefault(); // 阻止表单默认跳转行为
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        try {
            await Auth.login(u, p);
            UI.toast('登录成功', 'success');
            updateUIForRole(); // 登录后立即更新导航栏显示隐藏
            window.location.hash = '#/'; // 跳转首页
        } catch (err) {
            UI.toast(err.message, 'error'); // 登录失败显示错误 Toast
        }
    };
}

/**
 * 辅助工具函数
 */

/**
 * 将 'YYYY-MM-DD' 格式的日期字符串转换为中文显示，如：2025年1月1日
 * @param {string} dateStr - 日期字符串，格式 YYYY-MM-DD
 * @returns {string} 中文日期字符串，如«2025年1月1日»；入参为空时返回空字符串
 */
function formatDateChinese(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 计算两个日期之间的工作日天数（不含周六、周日，未排除法定节假日）
 * 计算方式：逐天遍历 [startDate, endDate] 间展的全部日期，统计工作日数量
 * @param {string} startDate - 开始日期，格式 YYYY-MM-DD
 * @param {string} endDate   - 结束日期，格式 YYYY-MM-DD
 * @returns {number} 工作日天数（包含首尾两天）
 */
function calculateWorkdays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    let cur = new Date(start);
    while (cur <= end) {
        const day = cur.getDay(); // 0=周日, 1-5=周一至周五, 6=周六
        if (day !== 0 && day !== 6) { // 跳过周末日
            count++;
        }
        cur.setDate(cur.getDate() + 1); // 逾历到下一天
    }
    return count;
}

/**
 * 绑定请假申请表单的交互事件
 * 包括：天数实时计算、剩余额度展示、表单提交验证和保存逻辑
 */
function bindApplyEvents() {
    const form = document.getElementById('apply-form');
    if (!form) return; // 验证表单元素存在

    // 获取表单内各个交互元素
    const typeSelect = document.getElementById('leaveTypeId');
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    const durInput = document.getElementById('duration'); // 天数（只读）
    const durLabel = document.getElementById('duration-label'); // 天数标签（展示剩余天数）

    /**
     * 实时计算函数——当假期类型、开始日期、结束日期任一变化时触发
     * 1. 重新计算工作日天数并写入天数输入框
     * 2. 查找开始日期对应周期的剩余额度，展示在标签中
     */
    const updateCalculations = () => {
        const user = Auth.currentUser;
        const typeId = typeSelect.value;
        const start = startInput.value;
        const end = endInput.value;

        // 1. 计算工作日天数
        if (start && end) {
            const count = calculateWorkdays(start, end);
            durInput.value = count;
        }

        // 2. 展示剩余额度（以开始日期匹配额度周期，强制单周期申请规则）
        const ent = API.getEntitlement(user.id, typeId, start);
        if (ent) {
            durLabel.innerHTML = `请假天数 <span style="color: var(--primary-hover); font-weight: normal;">(剩余 ${ent.totalDays - ent.usedDays} 天)</span>`;
        } else {
            durLabel.innerHTML = `请假天数 <span style="color: var(--danger); font-weight: normal;">(未找到该时段额度)</span>`;
        }
    };

    // 将计算更新函数分别挂载到三个输入元素的 change 事件
    typeSelect.onchange = updateCalculations;
    startInput.onchange = updateCalculations;
    endInput.onchange = updateCalculations;
    updateCalculations(); // 初始化时立即计算一次

    form.onsubmit = (e) => {
        e.preventDefault();
        const user = Auth.currentUser;
        const leaveTypeId = typeSelect.value;
        const duration = parseFloat(durInput.value); // 请假天数支持小数（如 0.5 天）
        const start = startInput.value;
        const end = endInput.value;

        // 验证：开始与结束日期必须都在某一额度周期内，且必须属于同一周期
        const entStart = API.getEntitlement(user.id, leaveTypeId, start);
        const entEnd = API.getEntitlement(user.id, leaveTypeId, end);

        if (!entStart) {
            UI.alert('开始日期不在任何可用额度周期内');
            return;
        }

        // 开始和结束日期必须属于同一周期，不允许跨年度申请
        if (!entEnd || entStart.startDate !== entEnd.startDate || entStart.endDate !== entEnd.endDate) {
            UI.alert('请假申请不可跨年度额度周期申请。\n若确实需要跨年度，请分两次申请（分别在两个周期的时间范围内）。');
            return;
        }

        // 验证剩余额度是否充足
        if ((entStart.totalDays - entStart.usedDays) < duration) {
            UI.alert(`请假天数 (${duration}天) 超过剩余天数 (${entStart.totalDays - entStart.usedDays}天)`);
            return;
        }

        UI.alert(`演示逻辑：\n1. 扮除 ${entStart.startDate} 至 ${entStart.endDate} 周期的余额\n2. 增加请假记录`);

        // 构建新的请假申请对象
        const newLeave = {
            userId: user.id,
            leaveTypeId,
            startDate: start,
            endDate: end,
            duration,
            reason: document.getElementById('reason').value,
            status: 'Pending', // 初始状态为待审批
            createTime: new Date().toLocaleString()
        };

        API.saveLeave(newLeave); // 保存请假申请记录

        // 同步扣除对应额度周期的已用天数
        entStart.usedDays += duration;
        API.updateEntitlement(entStart);

        UI.toast('申请已提交', 'success');
        window.location.hash = '#/leave/list'; // 提交后跳转到记录列表页
    };
}

/**
 * 绑定审批页的通过/拒绝按钮事件
 * - 通过：将请假记录状态更新为 'Approved'，然后刷新页面
 * - 拒绝：将状态更新为 'Rejected'，并将已扣减的天数返还至员工对应额度周期
 */
function bindAuditEvents() {
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            UI.alert(`已模拟操作：\n1. 标识为“已通过”\n2. 触发邮件提醒下一级或本人`);
            const leave = API.getLeaves().find(l => l.id === id);
            if (leave) {
                leave.status = 'Approved';
                API.updateLeave(leave);
                Router.navigate();
            }
        };
    });
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            UI.alert(`已模拟操作：\n1. 标识为“已拒绝”\n2. 自动返还余额天数`);
            const leave = API.getLeaves().find(l => l.id === id);
            if (leave) {
                leave.status = 'Rejected';
                const ent = API.getEntitlement(leave.userId, leave.leaveTypeId);
                if (ent) {
                    ent.usedDays -= leave.duration;
                    API.updateEntitlement(ent);
                }
                API.updateLeave(leave);
                Router.navigate();
            }
        };
    });
}

/**
 * 绑定员工管理页的交互事件
 * - 搜索框实时过滤：按姓名或工号关键字匹配，动态重新渲染列表并重新绑定编辑按钮
 * - 新增按钮：传入 null 打开空白员工编辑弹窗
 * - 编辑按钮：传入员工对象，打开预填弹窗
 */
function bindAdminUsersEvents() {
    const searchInput = document.getElementById('user-search');
    const userList = document.getElementById('user-list');

    // 实时搜索：每次键入时过滤并重新渲染员工卡片列表
    searchInput.oninput = () => {
        const q = searchInput.value.toLowerCase();
        // 同时支持按姓名或工号进行模糊匹配
        const users = API.getUsers().filter(u => u.name.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q));
        userList.innerHTML = users.map(u => `
            <div class="card fade-in" style="padding: 1rem; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${u.avatar}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <div style="font-weight: 500;">${u.name} (${u.employeeId})</div>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${u.role} · ${u.status}</div>
                    </div>
                </div>
                <button class="btn-edit-user" data-id="${u.id}" style="background: var(--bg); border: 1px solid var(--border); padding: 4px 12px; border-radius: 4px; font-size: 0.75rem;">编辑</button>
            </div>
        `).join('');
        // 搜索结果是动态渲染的，需要重新绑定每个编辑按钮的点击事件
        userList.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.onclick = () => showUserEditModal(API.getUser(btn.dataset.id));
        });
    };

    // 新增按钮：不传参数进入新增模式
    document.getElementById('btn-add-user').onclick = () => showUserEditModal();

    // 初始列表中各编辑按钮：传入对应员工对象进入编辑模式
    document.querySelectorAll('.btn-edit-user').forEach(btn => {
        btn.onclick = () => showUserEditModal(API.getUser(btn.dataset.id));
    });
}

/**
 * 显示员工新增/编辑弹窗（全屏遮罩 + 中心表单卡片）
 * 新增模式（user=null）：表单字段全部为空，密码默认 '123'，头像随机生成
 * 编辑模式（user=对象）：表单预填该员工现有信息，保留原头像
 * @param {Object|null} user - 要编辑的员工对象；为 null 时表示新增
 */
function showUserEditModal(user = null) {
    const managers = API.getUsers().filter(u => u.role === 'manager' || u.role === 'hr');
    const managerOptions = managers.map(m => `<option value="${m.id}" ${user && user.managerId === m.id ? 'selected' : ''}>${m.name}</option>`).join('');

    const modal = document.createElement('div');
    modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;`;
    modal.innerHTML = `
        <div style="background: white; border-radius: var(--radius); padding: 1.5rem; width: 90%; max-width: 400px; max-height: 90vh; overflow-y: auto;">
            <h3 style="margin-bottom: 1rem;">${user ? '编辑员工' : '新增员工'}</h3>
            <form id="user-form">
                <div class="form-group">
                    <label>工号</label>
                    <input type="text" id="edit-employeeId" class="form-control" value="${user ? user.employeeId : ''}" required>
                </div>
                <div class="form-group">
                    <label>姓名</label>
                    <input type="text" id="edit-name" class="form-control" value="${user ? user.name : ''}" required>
                </div>
                <div class="form-group">
                    <label>用户名 (登录用)</label>
                    <input type="text" id="edit-username" class="form-control" value="${user ? user.username : ''}" required>
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" id="edit-password" class="form-control" value="${user ? user.password : '123'}" required>
                </div>
                <div class="form-group">
                    <label>直线经理</label>
                    <select id="edit-managerId" class="form-control">
                        <option value="">(无)</option>
                        ${managerOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>角色</label>
                    <select id="edit-role" class="form-control">
                        <option value="staff" ${user && user.role === 'staff' ? 'selected' : ''}>普通员工</option>
                        <option value="manager" ${user && user.role === 'manager' ? 'selected' : ''}>直线经理</option>
                        <option value="hr" ${user && user.role === 'hr' ? 'selected' : ''}>人事专员</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>在职状态</label>
                    <select id="edit-status" class="form-control">
                        <option value="Active" ${user && user.status === 'Active' ? 'selected' : ''}>在职</option>
                        <option value="Inactive" ${user && user.status === 'Inactive' ? 'selected' : ''}>离职</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>入职日期</label>
                    <input type="date" id="edit-joinDate" class="form-control" value="${user ? user.joinDate : ''}">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">提交保存</button>
                    <button type="button" class="btn" onclick="this.closest('#user-form').parentElement.parentElement.remove()" style="flex: 1; background: var(--bg);">取消</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('user-form').onsubmit = (e) => {
        e.preventDefault();
        const data = {
            id: user ? user.id : null,
            employeeId: document.getElementById('edit-employeeId').value,
            name: document.getElementById('edit-name').value,
            username: document.getElementById('edit-username').value,
            password: document.getElementById('edit-password').value,
            managerId: document.getElementById('edit-managerId').value || null,
            role: document.getElementById('edit-role').value,
            status: document.getElementById('edit-status').value,
            joinDate: document.getElementById('edit-joinDate').value,
            avatar: user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        };

        UI.alert(`已模拟写入员工信息：\n工号: ${data.employeeId}\n姓名: ${data.name}\n变更已存入 LocalStorage`);
        API.saveUser(data);
        modal.remove();
        UI.toast('保存成功', 'success');
        Router.navigate();
    };
}

/**
 * 绑定假期配置页的按钮事件
 * - 新增按钮：不传参数，打开空白假期类型弹窗
 * - 配置按钮：传入对应假期类型对象，打开预填编辑弹窗
 */
function bindAdminLeaveTypesEvents() {
    document.getElementById('btn-add-type').onclick = () => showLeaveTypeEditModal();
    document.querySelectorAll('.btn-edit-type').forEach(btn => {
        btn.onclick = () => showLeaveTypeEditModal(API.getLeaveTypes().find(t => t.id === btn.dataset.id));
    });
}

/**
 * 显示假期类型新增/编辑弹窗
 * 字段：类型名称、颜色标识（用于卡片彩色条）、是否有年度上限、是否需要附件
 * @param {Object|null} type - 要编辑的假期类型对象；为 null 时表示新增
 */
function showLeaveTypeEditModal(type = null) {
    const modal = document.createElement('div');
    modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;`;
    modal.innerHTML = `
        <div style="background: white; border-radius: var(--radius); padding: 1.5rem; width: 90%; max-width: 400px;">
            <h3 style="margin-bottom: 1rem;">${type ? '修改假期类型' : '新增假期类型'}</h3>
            <form id="type-form">
                <div class="form-group">
                    <label>类型名称</label>
                    <input type="text" id="edit-type-name" class="form-control" value="${type ? type.name : ''}" required>
                </div>
                <div class="form-group">
                    <label>颜色标识</label>
                    <input type="color" id="edit-type-color" class="form-control" value="${type ? type.color : '#6366f1'}" style="height: 40px; padding: 2px;">
                </div>
                <div class="form-group" style="display: flex; gap: 20px; align-items: center; margin-top: 10px;">
                    <label style="margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="edit-hasLimit" ${type && type.hasAnnualLimit ? 'checked' : ''}> 有年度上限
                    </label>
                    <label style="margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="edit-reqAttach" ${type && type.requiresAttachment ? 'checked' : ''}> 需要附件
                    </label>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">确认保存</button>
                    <button type="button" class="btn" onclick="this.closest('#type-form').parentElement.parentElement.remove()" style="flex: 1; background: var(--bg);">取消</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // 绑定假期类型表单的提交事件
    document.getElementById('type-form').onsubmit = (e) => {
        e.preventDefault();
        const data = {
            id: type ? type.id : null, // 编辑时保留原 id，新增时由 saveLeaveType 自动生成
            name: document.getElementById('edit-type-name').value,
            color: document.getElementById('edit-type-color').value, // hex 颜色值
            hasAnnualLimit: document.getElementById('edit-hasLimit').checked, // 是否有年度总天数上限
            requiresAttachment: document.getElementById('edit-reqAttach').checked // 请假是否强制需要上传附件
        };

        UI.alert(`已模拟操作：\n1. 假期类型 [${data.name}] 已保存\n2. 同步更新所有员工额度选择项`);
        API.saveLeaveType(data); // 保存（新增或更新）假期类型
        modal.remove();
        UI.toast('保存成功', 'success');
        Router.navigate();
    };
}

/**
 * 绑定额度管理页的按钮事件
 * - 新增按钮：不传参数，打开空白额度新增弹窗
 * - 调整按钮：从 data-json 属性反序列化额度对象，打开预填编辑弹窗
 */
function bindAdminEntitlementsEvents() {
    // 新增按钮：进入新增模式
    document.getElementById('btn-add-ent').onclick = () => showEntitlementEditModal();
    // 各行「调整」按钮：从 HTML 属性中反序列化 JSON 获取额度对象
    document.querySelectorAll('.btn-edit-ent').forEach(btn => {
        btn.onclick = () => showEntitlementEditModal(JSON.parse(btn.dataset.json));
    });
}

/**
 * 显示员工额度新增/调整弹窗
 * 新增模式（ent=null）：员工、假期类型、周期均可自由输入
 * 编辑模式（ent=对象）：定位字段（员工/类型/周期）禁用，只允许修改总天数和已用天数
 * 编辑模式下额外提供「删除」按钮，删除后余额永久清除
 * 保存调用 API.updateEntitlement() 会进行周期重叠校验，重叠时弹出错误提示
 * @param {Object|null} ent - 要调整的额度记录对象；为 null 时表示新增
 */
function showEntitlementEditModal(ent = null) {
    const users = API.getUsers();
    const types = API.getLeaveTypes();

    const userOptions = users.map(u => `<option value="${u.id}" ${ent && ent.userId === u.id ? 'selected' : ''}>${u.name} (${u.employeeId})</option>`).join('');
    const typeOptions = types.map(t => `<option value="${t.id}" ${ent && ent.leaveTypeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

    const modal = document.createElement('div');
    modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;`;
    modal.innerHTML = `
        <div style="background: white; border-radius: var(--radius); padding: 1.5rem; width: 90%; max-width: 400px;">
            <h3 style="margin-bottom: 1rem;">${ent ? '调整员工额度' : '新增员工额度'}</h3>
            <form id="ent-form">
                <div class="form-group">
                    <label>选择员工</label>
                    <select id="edit-ent-userId" class="form-control" ${ent ? 'disabled' : ''}>
                        ${userOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>假期类型</label>
                    <select id="edit-ent-typeId" class="form-control" ${ent ? 'disabled' : ''}>
                        ${typeOptions}
                    </select>
                </div>
                <div style="display: flex; gap: 10px;">
                    <div class="form-group" style="flex: 1">
                        <label>周期开始</label>
                        <input type="date" id="edit-ent-start" class="form-control" value="${ent ? ent.startDate : ''}" ${ent ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group" style="flex: 1">
                        <label>周期结束</label>
                        <input type="date" id="edit-ent-end" class="form-control" value="${ent ? ent.endDate : ''}" ${ent ? 'disabled' : ''} required>
                    </div>
                </div>
                <div class="form-group" style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                         <label>总额度 (天)</label>
                         <input type="number" id="edit-ent-total" class="form-control" value="${ent ? ent.totalDays : '0'}" required step="0.5">
                    </div>
                    <div style="flex: 1;">
                         <label>已使用 (天)</label>
                         <input type="number" id="edit-ent-used" class="form-control" value="${ent ? ent.usedDays : '0'}" required step="0.5">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">确认提交</button>
                    ${ent ? `<button type="button" id="btn-del-ent" class="btn" style="flex: 0.6; background: var(--danger); color: white;">删除</button>` : ''}
                    <button type="button" class="btn" onclick="this.closest('#ent-form').parentElement.parentElement.remove()" style="flex: 1; background: var(--bg);">取消</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal); // 将弹窗挂载到 body

    // 编辑模式下才绑定「删除」按钮事件
    if (ent) {
        document.getElementById('btn-del-ent').onclick = () => {
            // 二次确认，防止误删重要额度记录
            if (confirm('确定要删除这条额度记录吗？')) {
                API.deleteEntitlement(ent); // 从数据库中删除该额度记录
                modal.remove();
                UI.toast('已删除', 'success');
                Router.navigate();
            }
        };
    }

    // 绑定额度表单的提交事件
    document.getElementById('ent-form').onsubmit = (e) => {
        e.preventDefault();
        // 收集表单各字段值，构建额度数据对象
        const data = {
            userId: document.getElementById('edit-ent-userId').value,
            leaveTypeId: document.getElementById('edit-ent-typeId').value,
            startDate: document.getElementById('edit-ent-start').value,
            endDate: document.getElementById('edit-ent-end').value,
            totalDays: parseFloat(document.getElementById('edit-ent-total').value), // 支持小数天数（如 0.5）
            usedDays: parseFloat(document.getElementById('edit-ent-used').value)    // 支持小数天数
        };

        try {
            // API 内部会校验该周期与已有记录是否存在时间重叠，重叠时抛出错误
            API.updateEntitlement(data);
            UI.alert(`已模拟操作：\n1. 员工额度已更新\n2. 校验通过（无时间重叠）\n3. 记录已同步至 LocalStorage`);
            modal.remove();
            UI.toast('保存成功', 'success');
            Router.navigate();
        } catch (err) {
            // 周期重叠或其他验证失败时，展示错误提示
            UI.alert(err.message);
        }
    };
}

// 等待页面 DOM 完全加载后再启动应用，确保所有 HTML 元素就绪
document.addEventListener('DOMContentLoaded', initApp);

