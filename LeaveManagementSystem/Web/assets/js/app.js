const UI = {
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.marginBottom = '10px';
        toast.style.background = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#6366f1');
        toast.style.color = 'white';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    alert(message) {
        window.alert(`【系统提示】\n${message}`);
    }
};

/**
 * Views
 */
const Views = {
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

    dashboard() {
        const user = Auth.currentUser;
        const entitlements = API.getEntitlements(user.id);
        const leaveTypes = API.getLeaveTypes();
        const nowStr = new Date().toISOString().split('T')[0];

        // Find the "closest unexpired" period among all entitlements to show in the header
        // Safety check: Filter out any legacy data missing date ranges
        const validRangeItems = entitlements.filter(e => e.startDate && e.endDate);

        const allValid = validRangeItems.filter(e => e.endDate >= nowStr).sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
        const activePeriod = allValid[0] || [...validRangeItems].sort((a, b) => (b.endDate || '').localeCompare(a.endDate || ''))[0];
        const periodStr = activePeriod ? `(${formatDateChinese(activePeriod.startDate)}~${formatDateChinese(activePeriod.endDate)})` : '';

        const balanceHTML = leaveTypes.map(type => {
            const ent = API.getEntitlement(user.id, type.id); // Internal logic finds best match
            const total = ent ? ent.totalDays : 0;
            const used = ent ? ent.usedDays : 0;
            const remaining = total - used;
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

        // 绑定编辑事件
        setTimeout(() => {
            document.querySelectorAll('.btn-edit-leave').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const leaveId = btn.dataset.id;
                    const leave = API.getLeaves().find(l => l.id === leaveId);
                    if (leave) {
                        this.showEditModal(leave);
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
                <div style="margin-bottom: 1rem; display: flex; gap: 10px;">
                    <input type="text" id="user-search" class="form-control" placeholder="搜索姓名/工号..." style="flex: 1; margin: 0;">
                    <button id="btn-add-user" class="btn btn-primary" style="width: auto; padding: 0 1rem; margin: 0;">新增员工</button>
                </div>
                <div id="user-list">
                    ${rows}
                </div>
            </div>
        `;
    },

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
                <div style="margin-bottom: 1rem; text-align: right;">
                    <button id="btn-add-type" class="btn btn-primary" style="width: auto; padding: 0 1rem; margin: 0;">新增假期类型</button>
                </div>
                <div id="type-list">
                    ${rows}
                </div>
            </div>
        `;
    },

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
                <div style="margin-bottom: 1rem; display: flex; gap: 10px;">
                    <button id="btn-add-ent" class="btn btn-primary" style="flex: 1; margin: 0;">新增员工额度</button>
                </div>
                <div id="ent-list">
                    ${rows}
                </div>
            </div>
        `;
    }
};

/**
 * App Controller
 */
async function initApp() {
    await API.init();
    Auth.init();

    // Setup Routes
    Router.on('#/login', () => {
        const html = Views.login();
        setTimeout(bindLoginEvents, 0);
        return html;
    });

    Router.on('#/', () => Views.dashboard());
    Router.on('#/leave/apply', () => {
        const html = Views.leaveApply();
        setTimeout(bindApplyEvents, 0);
        return html;
    });
    Router.on('#/leave/list', () => Views.leaveList());
    Router.on('#/audit', () => {
        const html = Views.audit();
        setTimeout(bindAuditEvents, 0);
        return html;
    });
    Router.on('#/admin', () => Views.admin());
    Router.on('#/admin/users', () => {
        const html = Views.adminUsers();
        setTimeout(bindAdminUsersEvents, 0);
        return html;
    });
    Router.on('#/admin/leave-types', () => {
        const html = Views.adminLeaveTypes();
        setTimeout(bindAdminLeaveTypesEvents, 0);
        return html;
    });
    Router.on('#/admin/entitlements', () => {
        const html = Views.adminEntitlements();
        setTimeout(bindAdminEntitlementsEvents, 0);
        return html;
    });

    Router.init();
    updateUIForRole();
}

function updateUIForRole() {
    if (!Auth.currentUser) return;
    const isManager = Auth.hasRole('manager') || Auth.hasRole('hr');
    const isHR = Auth.hasRole('hr');

    document.getElementById('nav-audit').style.display = isManager ? 'flex' : 'none';
    document.getElementById('nav-admin').style.display = isHR ? 'flex' : 'none';
}

function bindLoginEvents() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        try {
            await Auth.login(u, p);
            UI.toast('登录成功', 'success');
            updateUIForRole();
            window.location.hash = '#/';
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    };
}

/**
 * Helpers
 */
function formatDateChinese(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function calculateWorkdays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    let cur = new Date(start);
    while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) { // Not Sat or Sun
            count++;
        }
        cur.setDate(cur.getDate() + 1);
    }
    return count;
}

function bindApplyEvents() {
    const form = document.getElementById('apply-form');
    if (!form) return;

    const typeSelect = document.getElementById('leaveTypeId');
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    const durInput = document.getElementById('duration');
    const durLabel = document.getElementById('duration-label');

    const updateCalculations = () => {
        const user = Auth.currentUser;
        const typeId = typeSelect.value;
        const start = startInput.value;
        const end = endInput.value;

        // 1. Calculate work days
        if (start && end) {
            const count = calculateWorkdays(start, end);
            durInput.value = count;
        }

        // 2. Show remaining balance in label
        // Find entitlement for the START date (enforce single-year rule during submission)
        const ent = API.getEntitlement(user.id, typeId, start);
        if (ent) {
            durLabel.innerHTML = `请假天数 <span style="color: var(--primary-hover); font-weight: normal;">(剩余 ${ent.totalDays - ent.usedDays} 天)</span>`;
        } else {
            durLabel.innerHTML = `请假天数 <span style="color: var(--danger); font-weight: normal;">(未找到该时段额度)</span>`;
        }
    };

    typeSelect.onchange = updateCalculations;
    startInput.onchange = updateCalculations;
    endInput.onchange = updateCalculations;
    updateCalculations();

    form.onsubmit = (e) => {
        e.preventDefault();
        const user = Auth.currentUser;
        const leaveTypeId = typeSelect.value;
        const duration = parseFloat(durInput.value);
        const start = startInput.value;
        const end = endInput.value;

        // Validation: Must span across a single period
        const entStart = API.getEntitlement(user.id, leaveTypeId, start);
        const entEnd = API.getEntitlement(user.id, leaveTypeId, end);

        if (!entStart) {
            UI.alert('开始日期不在任何可用额度周期内');
            return;
        }

        if (!entEnd || entStart.startDate !== entEnd.startDate || entStart.endDate !== entEnd.endDate) {
            UI.alert('请假申请不可跨年度额度周期申请。\n若确实需要跨年度，请分两次申请（分别在两个周期的时间范围内）。');
            return;
        }

        // Validation: Balance
        if ((entStart.totalDays - entStart.usedDays) < duration) {
            UI.alert(`请假天数 (${duration}天) 超过剩余天数 (${entStart.totalDays - entStart.usedDays}天)`);
            return;
        }

        UI.alert(`演示逻辑：\n1. 扣除 ${entStart.startDate} 至 ${entStart.endDate} 周期的余额\n2. 增加请假记录`);

        const newLeave = {
            userId: user.id,
            leaveTypeId,
            startDate: start,
            endDate: end,
            duration,
            reason: document.getElementById('reason').value,
            status: 'Pending',
            createTime: new Date().toLocaleString()
        };

        API.saveLeave(newLeave);

        // Update entitlement
        entStart.usedDays += duration;
        API.updateEntitlement(entStart);

        UI.toast('申请已提交', 'success');
        window.location.hash = '#/leave/list';
    };
}

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

function bindAdminUsersEvents() {
    const searchInput = document.getElementById('user-search');
    const userList = document.getElementById('user-list');

    searchInput.oninput = () => {
        const q = searchInput.value.toLowerCase();
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
        // Re-bind click events for dynamic search results
        userList.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.onclick = () => showUserEditModal(API.getUser(btn.dataset.id));
        });
    };

    document.getElementById('btn-add-user').onclick = () => showUserEditModal();

    document.querySelectorAll('.btn-edit-user').forEach(btn => {
        btn.onclick = () => showUserEditModal(API.getUser(btn.dataset.id));
    });
}

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

function bindAdminLeaveTypesEvents() {
    document.getElementById('btn-add-type').onclick = () => showLeaveTypeEditModal();
    document.querySelectorAll('.btn-edit-type').forEach(btn => {
        btn.onclick = () => showLeaveTypeEditModal(API.getLeaveTypes().find(t => t.id === btn.dataset.id));
    });
}

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

    document.getElementById('type-form').onsubmit = (e) => {
        e.preventDefault();
        const data = {
            id: type ? type.id : null,
            name: document.getElementById('edit-type-name').value,
            color: document.getElementById('edit-type-color').value,
            hasAnnualLimit: document.getElementById('edit-hasLimit').checked,
            requiresAttachment: document.getElementById('edit-reqAttach').checked
        };

        UI.alert(`已模拟操作：\n1. 假期类型 [${data.name}] 已保存\n2. 同步更新所有员工额度选择项`);
        API.saveLeaveType(data);
        modal.remove();
        UI.toast('保存成功', 'success');
        Router.navigate();
    };
}

function bindAdminEntitlementsEvents() {
    document.getElementById('btn-add-ent').onclick = () => showEntitlementEditModal();
    document.querySelectorAll('.btn-edit-ent').forEach(btn => {
        btn.onclick = () => showEntitlementEditModal(JSON.parse(btn.dataset.json));
    });
}

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
    document.body.appendChild(modal);

    if (ent) {
        document.getElementById('btn-del-ent').onclick = () => {
            if (confirm('确定要删除这条额度记录吗？')) {
                API.deleteEntitlement(ent);
                modal.remove();
                UI.toast('已删除', 'success');
                Router.navigate();
            }
        };
    }

    document.getElementById('ent-form').onsubmit = (e) => {
        e.preventDefault();
        const data = {
            userId: document.getElementById('edit-ent-userId').value,
            leaveTypeId: document.getElementById('edit-ent-typeId').value,
            startDate: document.getElementById('edit-ent-start').value,
            endDate: document.getElementById('edit-ent-end').value,
            totalDays: parseFloat(document.getElementById('edit-ent-total').value),
            usedDays: parseFloat(document.getElementById('edit-ent-used').value)
        };

        try {
            API.updateEntitlement(data);
            UI.alert(`已模拟操作：\n1. 员工额度已更新\n2. 校验通过（无时间重叠）\n3. 记录已同步至 LocalStorage`);
            modal.remove();
            UI.toast('保存成功', 'success');
            Router.navigate();
        } catch (err) {
            UI.alert(err.message);
        }
    };
}

// Start
document.addEventListener('DOMContentLoaded', initApp);
