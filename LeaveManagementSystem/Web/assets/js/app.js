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

        const balanceHTML = leaveTypes.map(type => {
            const ent = entitlements.find(e => e.leaveTypeId === type.id) || { totalDays: 0, usedDays: 0 };
            const remaining = ent.totalDays - ent.usedDays;
            return `
                <div class="balance-item" style="flex: 1; min-width: 45%; padding: 1rem; background: var(--bg); border-radius: var(--radius); margin: 5px;">
                    <div style="font-size: 0.8rem; color: var(--text-light)">${type.name}</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${type.color}">${remaining} <span style="font-size: 0.8rem">天</span></div>
                </div>
            `;
        }).join('');

        return `
            <div class="fade-in">
                <header style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h1 style="font-size: 1.25rem;">你好, ${user.name}</h1>
                        <p style="font-size: 0.875rem; color: var(--text-light)">${user.employeeId} · ${user.role.toUpperCase()}</p>
                    </div>
                    <img src="${user.avatar}" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--primary);">
                </header>

                <div class="card">
                    <h3 style="margin-bottom: 1rem; font-size: 1rem;">假期余额</h3>
                    <div style="display: flex; flex-wrap: wrap; margin: -5px;">
                        ${balanceHTML}
                    </div>
                </div>

                <div class="card" style="background: linear-gradient(135deg, var(--primary), #818cf8); color: white; border: none;">
                    <h3>快速申请</h3>
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
            return `
                <div class="card fade-in" style="padding: 1rem; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                            <span class="badge ${statusClass}">${l.status}</span>
                            <strong style="margin-left: 8px;">${type ? type.name : 'Unknown'}</strong>
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-light)">${l.duration}天</div>
                    </div>
                    <div style="font-size: 0.875rem; margin-bottom: 4px;">${l.startDate} 至 ${l.endDate}</div>
                    <div style="font-size: 0.8rem; color: var(--text-light)">原因: ${l.reason}</div>
                    ${Auth.hasRole('hr') ? `<div style="font-size: 0.75rem; margin-top: 8px; border-top: 1px solid var(--border); padding-top: 4px;">申请人: ${API.getUser(l.userId)?.name}</div>` : ''}
                </div>
            `;
        }).join('') || '<div style="text-align: center; color: var(--text-light); padding: 2rem;">暂无请假记录</div>';

        return `
            <div class="fade-in">
                <header style="margin-bottom: 1.5rem;">
                    <h1 style="font-size: 1.25rem;">${Auth.hasRole('hr') ? '全员记录' : '我的记录'}</h1>
                </header>
                ${rows}
                <div class="card" style="text-align: center; color: var(--primary); font-size: 0.875rem;">
                    <i data-lucide="download" style="width: 16px; height: 16px; vertical-align: middle;"></i> 导出报表 (演示)
                </div>
            </div>
        `;
    },

    leaveApply() {
        const user = Auth.currentUser;
        const leaveTypes = API.getLeaveTypes();
        const now = new Date().toISOString().split('T')[0];

        const options = leaveTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

        return `
            <div class="fade-in">
                <header style="margin-bottom: 1.5rem;">
                    <h1 style="font-size: 1.25rem;">申请请假</h1>
                </header>
                <div class="card">
                    <form id="apply-form">
                        <div class="form-group">
                            <label>申请人</label>
                            <input type="text" class="form-control" value="${user.name}" disabled>
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
                            <label>请假天数</label>
                            <input type="number" id="duration" class="form-control" placeholder="计算中..." required step="0.5">
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
                <header style="margin-bottom: 1.5rem;">
                    <h1 style="font-size: 1.25rem;">审批中心</h1>
                </header>
                ${items}
            </div>
        `;
    },

    admin() {
        return `
            <div class="fade-in">
                <header style="margin-bottom: 1.5rem;">
                    <h1 style="font-size: 1.25rem;">系统管理</h1>
                </header>
                <div class="card" onclick="UI.toast('进入员工管理(演示)')">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="padding: 10px; background: #e0e7ff; color: #4338ca; border-radius: 10px;"><i data-lucide="users"></i></div>
                        <div>
                            <strong>员工管理</strong>
                            <div style="font-size: 0.75rem; color: var(--text-light)">维护员工信息、入职与角色</div>
                        </div>
                    </div>
                </div>
                <div class="card" onclick="UI.toast('进入假期配置(演示)')">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="padding: 10px; background: #fef3c7; color: #92400e; border-radius: 10px;"><i data-lucide="calendar"></i></div>
                        <div>
                            <strong>假期配置</strong>
                            <div style="font-size: 0.75rem; color: var(--text-light)">维护假期类型、规则及周期</div>
                        </div>
                    </div>
                </div>
                <div class="card" onclick="UI.toast('进入额度调整(演示)')">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="padding: 10px; background: #d1fae5; color: #065f46; border-radius: 10px;"><i data-lucide="bar-chart"></i></div>
                        <div>
                            <strong>额度调整</strong>
                            <div style="font-size: 0.75rem; color: var(--text-light)">手动调整员工特定类型天数</div>
                        </div>
                    </div>
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

function bindApplyEvents() {
    const form = document.getElementById('apply-form');
    if (!form) return;

    // Auto-calculate duration simulation
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    const durInput = document.getElementById('duration');

    const calc = () => {
        if (startInput.value && endInput.value) {
            const s = new Date(startInput.value);
            const e = new Date(endInput.value);
            const diff = (e - s) / (1000 * 60 * 60 * 24) + 1;
            durInput.value = diff > 0 ? diff : 0;
        }
    };
    startInput.onchange = calc;
    endInput.onchange = calc;
    calc();

    form.onsubmit = (e) => {
        e.preventDefault();
        const user = Auth.currentUser;
        const leaveTypeId = document.getElementById('leaveTypeId').value;
        const duration = parseFloat(durInput.value);

        // Validation with balance
        const ent = API.getEntitlement(user.id, leaveTypeId);
        if (ent && (ent.totalDays - ent.usedDays) < duration) {
            UI.alert(`申请失败：${document.querySelector('#leaveTypeId option:checked').text}余额不足（剩余 ${ent.totalDays - ent.usedDays} 天）`);
            return;
        }

        UI.alert(`已进入模拟写入逻辑：\n1. 扣除余额 ${duration} 天\n2. 发送邮件通知经理\n3. 记录存入 LocalStorage`);

        const newLeave = {
            userId: user.id,
            leaveTypeId,
            startDate: startInput.value,
            endDate: endInput.value,
            duration,
            reason: document.getElementById('reason').value,
            status: 'Pending',
            createTime: new Date().toLocaleString()
        };

        API.saveLeave(newLeave);

        // Update entitlement
        if (ent) {
            ent.usedDays += duration;
            API.updateEntitlement(ent);
        }

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

// Start
document.addEventListener('DOMContentLoaded', initApp);
