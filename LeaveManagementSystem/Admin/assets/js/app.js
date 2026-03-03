/**
 * Admin Portal Logic
 */

const UI = {
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => toast.remove(), 3000);
    },

    alert(message) {
        window.alert(`【管理系统提请】\n${message}`);
    },

    showModal(title, content, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content fade-in" style="${options.width ? `max-width: ${options.width}` : ''}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" style="background:none; border:none; cursor:pointer;"><i data-lucide="x"></i></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        if (window.lucide) window.lucide.createIcons();

        const close = () => overlay.remove();
        overlay.querySelector('.modal-close').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        return {
            close,
            container: overlay.querySelector('.modal-body')
        };
    }
};

const Views = {
    login() {
        return `
            <div class="login-card fade-in">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <i data-lucide="calendar-check" style="width: 48px; height: 48px; color: var(--primary); margin-bottom: 1rem;"></i>
                    <h2>请假管理系统</h2>
                    <p style="color: var(--text-light)">管理后台登录</p>
                </div>
                <form id="admin-login-form">
                    <div class="form-group">
                        <label>用户名</label>
                        <input type="text" id="username" class="form-control" placeholder="输入用户名" required>
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input type="password" id="password" class="form-control" placeholder="输入密码" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">立即登录</button>
                </form>
                <div style="margin-top: 1.5rem; font-size: 0.75rem; color: var(--text-light); text-align: center;">
                    演示账号：zhangsan (员工) / lisi (经理) / wangwu (HR)
                </div>
            </div>
        `;
    },

    dashboard() {
        const user = Auth.currentUser;
        const entitlements = API.getEntitlements(user.id);
        const leaveTypes = API.getLeaveTypes();
        const leaves = API.getMyLeaves(user.id);

        const stats = leaveTypes.map(type => {
            const ent = API.getEntitlement(user.id, type.id);
            const total = ent ? ent.totalDays : 0;
            const used = ent ? ent.usedDays : 0;
            return {
                name: type.name,
                remaining: total - used,
                total,
                color: type.color
            };
        });

        const statCards = stats.map(s => `
            <div class="stat-card">
                <div class="stat-icon" style="background: ${s.color}20; color: ${s.color}">
                    <i data-lucide="calendar"></i>
                </div>
                <div style="flex: 1">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem;">
                        <div style="font-size: 0.75rem; color: var(--text-light)">${s.name}</div>
                        <div style="font-size: 1.25rem; font-weight: 700;">${s.remaining} <small style="font-size: 0.75rem; font-weight: 400;">天</small></div>
                    </div>
                    <div style="height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden;">
                        <div style="height: 100%; background: ${s.color}; width: ${s.total > 0 ? (s.remaining / s.total * 100) : 0}%"></div>
                    </div>
                </div>
            </div>
        `).join('');

        const pendingCount = API.getLeaves().filter(l => l.status === 'Pending' && (Auth.hasRole('hr') || (Auth.hasRole('manager') && API.getUser(l.userId).managerId === user.id))).length;

        return `
            <div class="dashboard-view">
                <div style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; font-weight: 700;">欢迎回来, ${user.name}</h2>
                    <p style="color: var(--text-light)">今天是 ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                </div>

                <div class="stat-grid">
                    ${statCards}
                    ${(Auth.hasRole('manager') || Auth.hasRole('hr')) ? `
                        <div class="stat-card" style="background: #eef2ff; border: 1px dashed var(--primary);">
                            <div class="stat-icon" style="background: var(--primary); color: white;">
                                <i data-lucide="bell"></i>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: var(--text-light)">待处理审批</div>
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${pendingCount} <small style="font-size: 0.75rem; font-weight: 400;">项</small></div>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.125rem;">近期请假记录</h3>
                            <a href="#/leave/list" style="font-size: 0.875rem; color: var(--primary); text-decoration: none;">查看全部</a>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>类型</th>
                                    <th>时间范围</th>
                                    <th>天数</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${leaves.slice(0, 5).map(l => `
                                    <tr>
                                        <td>${API.getLeaveTypes().find(t => t.id === l.leaveTypeId)?.name}</td>
                                        <td>${l.startDate} ~ ${l.endDate}</td>
                                        <td>${l.duration}天</td>
                                        <td><span class="badge badge-${l.status.toLowerCase()}">${l.status}</span></td>
                                    </tr>
                                `).join('') || '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">暂无记录</td></tr>'}
                            </tbody>
                        </table>
                    </div>

                    <div class="card">
                        <h3 style="margin-bottom: 1.5rem; font-size: 1.125rem;">快速操作</h3>
                        <a href="#/leave/apply" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                            <i data-lucide="plus-circle"></i> 发起请假申请
                        </a>
                        ${Auth.hasRole('hr') ? `
                            <button onclick="window.location.hash='#/admin/users'" class="btn" style="width: 100%; background: #f1f5f9; margin-bottom: 0.5rem;">
                                <i data-lucide="users"></i> 员工管理
                            </button>
                            <button onclick="window.location.hash='#/admin/entitlements'" class="btn" style="width: 100%; background: #f1f5f9;">
                                <i data-lucide="bar-chart-3"></i> 额度调整
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    leaveApply() {
        const user = Auth.currentUser;
        const leaveTypes = API.getLeaveTypes();
        const options = leaveTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        const now = new Date().toISOString().split('T')[0];

        return `
            <div class="card" style="max-width: 800px; margin: 0 auto;">
                <h2 style="margin-bottom: 1.5rem; font-size: 1.25rem;">发起请假申请</h2>
                <form id="pc-apply-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <div class="form-group">
                                <label>申请人</label>
                                <input type="text" class="form-control" value="${user.name} (${user.employeeId})" disabled>
                            </div>
                            <div class="form-group">
                                <label>请假类型</label>
                                <select id="leaveTypeId" class="form-control" required>
                                    ${options}
                                </select>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label>开始日期</label>
                                    <input type="date" id="startDate" class="form-control" value="${now}" required>
                                </div>
                                <div class="form-group">
                                    <label>结束日期</label>
                                    <input type="date" id="endDate" class="form-control" value="${now}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label id="pc-duration-label">预计请假天数</label>
                                <input type="number" id="duration" class="form-control" readonly style="background: #f1f5f9;" step="0.5">
                            </div>
                        </div>
                        <div>
                            <div class="form-group">
                                <label>请假原因</label>
                                <textarea id="reason" class="form-control" rows="6" placeholder="请详细填写请假原因..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label>相关证明 (模拟)</label>
                                <div style="border: 2px dashed var(--border); border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-light); cursor: pointer;">
                                    <i data-lucide="upload" style="width: 32px; height: 32px; margin-bottom: 0.5rem;"></i>
                                    <p>点击选择附件或拖拽到此处</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
                        <button type="button" class="btn" onclick="history.back()" style="background: #f1f5f9;">取消返回</button>
                        <button type="submit" class="btn btn-primary" style="padding-left: 3rem; padding-right: 3rem;">提交申请</button>
                    </div>
                </form>
            </div>
        `;
    },

    leaveList() {
        const user = Auth.currentUser;
        const leaves = Auth.hasRole('hr') ? API.getLeaves() : API.getMyLeaves(user.id);
        const types = API.getLeaveTypes();

        // 存储当前排序状态
        if (!this.leaveListSort) {
            this.leaveListSort = { field: 'createTime', direction: 'desc' };
        }

        // 排序函数
        const sortedLeaves = [...leaves].sort((a, b) => {
            const field = this.leaveListSort.field;
            const dir = this.leaveListSort.direction === 'asc' ? 1 : -1;

            if (field === 'type') {
                const typeA = types.find(t => t.id === a.leaveTypeId)?.name || '';
                const typeB = types.find(t => t.id === b.leaveTypeId)?.name || '';
                return dir * typeA.localeCompare(typeB, 'zh-CN');
            } else if (field === 'applicant') {
                const userA = API.getUser(a.userId)?.name || '';
                const userB = API.getUser(b.userId)?.name || '';
                return dir * userA.localeCompare(userB, 'zh-CN');
            } else if (field === 'duration') {
                return dir * (a.duration - b.duration);
            } else if (field === 'status') {
                return dir * a.status.localeCompare(b.status);
            } else if (field === 'dateRange') {
                return dir * (a.startDate + a.endDate).localeCompare(b.startDate + b.endDate);
            } else if (field === 'createTime') {
                return dir * a.createTime.localeCompare(b.createTime);
            }
            return 0;
        });

        const rows = sortedLeaves.map(l => {
            const type = types.find(t => t.id === l.leaveTypeId);
            const applicant = API.getUser(l.userId);
            return `
                <tr>
                    ${Auth.hasRole('hr') ? `<td>${applicant?.name} (${applicant?.employeeId})</td>` : ''}
                    <td>${type?.name}</td>
                    <td>${l.startDate} 至 ${l.endDate}</td>
                    <td>${l.duration}天</td>
                    <td><span class="badge badge-${l.status.toLowerCase()}">${l.status}</span></td>
                    <td>${l.createTime}</td>
                    <td>
                        ${l.status === 'Pending' ? `
                            <button class="btn btn-edit-leave" data-id="${l.id}" style="padding: 2px 10px; font-size: 0.75rem; background: #f1f5f9; border: 1px solid var(--border); cursor: pointer;">编辑</button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');

        // 生成带排序图标的表头
        const getSortIcon = (field) => {
            if (this.leaveListSort.field !== field) return '↕';
            return this.leaveListSort.direction === 'asc' ? '↑' : '↓';
        };

        const createSortableHeader = (text, field) => {
            return `<th style="cursor: pointer; user-select: none;" onclick="App.sortLeaveList('${field}')">
                ${text} ${getSortIcon(field)}
            </th>`;
        };

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.25rem;">${Auth.hasRole('hr') ? '全员请假记录' : '我的请假记录'}</h2>
                    <div style="display: flex; gap: 0.5rem;">
                         <input type="text" class="form-control" placeholder="筛选搜索..." style="width: 250px; margin: 0;">
                         <button class="btn btn-primary">导出报表</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${Auth.hasRole('hr') ? createSortableHeader('申请人', 'applicant') : ''}
                            ${createSortableHeader('假种', 'type')}
                            ${createSortableHeader('时间范围', 'dateRange')}
                            ${createSortableHeader('天数', 'duration')}
                            ${createSortableHeader('审批状态', 'status')}
                            ${createSortableHeader('申请时间', 'createTime')}
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="7" style="text-align: center; color: var(--text-light); padding: 3rem;">暂无相关记录</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    audit() {
        const user = Auth.currentUser;
        let leaves = API.getLeaves().filter(l => l.status === 'Pending');
        if (user.role === 'manager') {
            leaves = leaves.filter(l => API.getUser(l.userId).managerId === user.id);
        }

        // 存储当前排序状态
        if (!this.auditSort) {
            this.auditSort = { field: 'createTime', direction: 'desc' };
        }

        // 排序函数
        const sortedLeaves = [...leaves].sort((a, b) => {
            const field = this.auditSort.field;
            const dir = this.auditSort.direction === 'asc' ? 1 : -1;

            if (field === 'applicant') {
                const userA = API.getUser(a.userId)?.name || '';
                const userB = API.getUser(b.userId)?.name || '';
                return dir * userA.localeCompare(userB, 'zh-CN');
            } else if (field === 'type') {
                const typeA = API.getLeaveTypes().find(t => t.id === a.leaveTypeId)?.name || '';
                const typeB = API.getLeaveTypes().find(t => t.id === b.leaveTypeId)?.name || '';
                return dir * typeA.localeCompare(typeB, 'zh-CN');
            } else if (field === 'dateRange') {
                return dir * (a.startDate + a.endDate).localeCompare(b.startDate + b.endDate);
            } else if (field === 'duration') {
                return dir * (a.duration - b.duration);
            } else if (field === 'createTime') {
                return dir * a.createTime.localeCompare(b.createTime);
            }
            return 0;
        });

        const rows = sortedLeaves.map(l => {
            const applicant = API.getUser(l.userId);
            const type = API.getLeaveTypes().find(t => t.id === l.leaveTypeId);
            return `
                <tr>
                    <td>
                        <div style="font-weight: 500;">${applicant?.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${applicant?.employeeId}</div>
                    </td>
                    <td>${type?.name}</td>
                    <td>${l.startDate} ~ ${l.endDate}</td>
                    <td>${l.duration}天</td>
                    <td><div style="max-width: 200px; font-size: 0.8rem; color: var(--text-light);" title="${l.reason}">${l.reason}</div></td>
                    <td>${l.createTime}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-approve" data-id="${l.id}" style="padding: 4px 12px; font-size: 0.75rem;">通过</button>
                            <button class="btn btn-reject" data-id="${l.id}" style="padding: 4px 12px; font-size: 0.75rem; background: #fee2e2; color: #991b1b;">拒绝</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // 生成带排序图标的表头
        const getSortIcon = (field) => {
            if (this.auditSort.field !== field) return '↕';
            return this.auditSort.direction === 'asc' ? '↑' : '↓';
        };

        const createSortableHeader = (text, field) => {
            return `<th style="cursor: pointer; user-select: none;" onclick="App.sortAuditList('${field}')">
                ${text} ${getSortIcon(field)}
            </th>`;
        };

        return `
            <div class="card">
                <h2 style="margin-bottom: 2rem; font-size: 1.25rem;">审批中心 - 待处理</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${createSortableHeader('申请人', 'applicant')}
                            ${createSortableHeader('假种', 'type')}
                            ${createSortableHeader('请假时间', 'dateRange')}
                            ${createSortableHeader('天数', 'duration')}
                            <th>申请理由</th>
                            ${createSortableHeader('提交时间', 'createTime')}
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="7" style="text-align: center; color: var(--text-light); padding: 3rem;">暂时没有待办审批任务</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    adminUsers() {
        const users = API.getUsers();

        // 存储当前排序状态
        if (!this.usersSort) {
            this.usersSort = { field: 'name', direction: 'asc' };
        }

        // 排序函数
        const sortedUsers = [...users].sort((a, b) => {
            const field = this.usersSort.field;
            const dir = this.usersSort.direction === 'asc' ? 1 : -1;

            if (field === 'name') {
                return dir * a.name.localeCompare(b.name, 'zh-CN');
            } else if (field === 'employeeId') {
                return dir * a.employeeId.localeCompare(b.employeeId);
            } else if (field === 'username') {
                return dir * a.username.localeCompare(b.username);
            } else if (field === 'role') {
                return dir * a.role.localeCompare(b.role);
            } else if (field === 'status') {
                return dir * a.status.localeCompare(b.status);
            } else if (field === 'joinDate') {
                return dir * (a.joinDate || '').localeCompare(b.joinDate || '');
            }
            return 0;
        });

        const rows = sortedUsers.map(u => `
            <tr>
                <td><img src="${u.avatar}" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle; margin-right: 0.5rem;"> <strong>${u.name}</strong></td>
                <td>${u.employeeId}</td>
                <td>${u.username}</td>
                <td><span class="badge ${u.role === 'staff' ? '' : 'badge-approved'}">${u.role}</span></td>
                <td><span class="badge ${u.status === 'Active' ? 'badge-approved' : 'badge-rejected'}">${u.status}</span></td>
                <td>${u.joinDate || '-'}</td>
                <td>
                    <button class="btn btn-edit-user" data-id="${u.id}" style="padding: 2px 8px; font-size: 0.75rem; background: #f1f5f9; border: 1px solid var(--border);">编辑</button>
                </td>
            </tr>
        `).join('');

        // 生成带排序图标的表头
        const getSortIcon = (field) => {
            if (this.usersSort.field !== field) return '↕';
            return this.usersSort.direction === 'asc' ? '↑' : '↓';
        };

        const createSortableHeader = (text, field) => {
            return `<th style="cursor: pointer; user-select: none;" onclick="App.sortUsersList('${field}')">
                ${text} ${getSortIcon(field)}
            </th>`;
        };

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.25rem;">员工管理</h2>
                    <div style="display: flex; gap: 0.5rem;">
                         <input type="text" id="user-search" class="form-control" placeholder="搜索姓名/工号..." style="width: 250px; margin: 0;">
                         <button id="btn-add-user" class="btn btn-primary"><i data-lucide="plus"></i> 新增员工</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${createSortableHeader('姓名', 'name')}
                            ${createSortableHeader('工号', 'employeeId')}
                            ${createSortableHeader('用户名', 'username')}
                            ${createSortableHeader('角色', 'role')}
                            ${createSortableHeader('状态', 'status')}
                            ${createSortableHeader('入职日期', 'joinDate')}
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="user-table-body">
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    },

    adminLeaveTypes() {
        const types = API.getLeaveTypes();

        // 存储当前排序状态
        if (!this.typesSort) {
            this.typesSort = { field: 'name', direction: 'asc' };
        }

        // 排序函数
        const sortedTypes = [...types].sort((a, b) => {
            const field = this.typesSort.field;
            const dir = this.typesSort.direction === 'asc' ? 1 : -1;

            if (field === 'name') {
                return dir * a.name.localeCompare(b.name, 'zh-CN');
            } else if (field === 'hasAnnualLimit') {
                return dir * (a.hasAnnualLimit === b.hasAnnualLimit ? 0 : (a.hasAnnualLimit ? 1 : -1));
            } else if (field === 'requiresAttachment') {
                return dir * (a.requiresAttachment === b.requiresAttachment ? 0 : (a.requiresAttachment ? 1 : -1));
            } else if (field === 'id') {
                return dir * a.id.localeCompare(b.id);
            }
            return 0;
        });

        const rows = sortedTypes.map(t => `
            <tr>
                <td><div style="width: 12px; height: 12px; border-radius: 50%; background: ${t.color}; display: inline-block; margin-right: 0.5rem;"></div> <strong>${t.name}</strong></td>
                <td>${t.hasAnnualLimit ? '有' : '无'}</td>
                <td>${t.requiresAttachment ? '是' : '否'}</td>
                <td>${t.id}</td>
                <td>
                    <button class="btn btn-edit-type" data-id="${t.id}" style="padding: 2px 8px; font-size: 0.75rem; background: #f1f5f9; border: 1px solid var(--border);">配置</button>
                </td>
            </tr>
        `).join('');

        // 生成带排序图标的表头
        const getSortIcon = (field) => {
            if (this.typesSort.field !== field) return '↕';
            return this.typesSort.direction === 'asc' ? '↑' : '↓';
        };

        const createSortableHeader = (text, field) => {
            return `<th style="cursor: pointer; user-select: none;" onclick="App.sortTypesList('${field}')">
                ${text} ${getSortIcon(field)}
            </th>`;
        };

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.25rem;">假期配置</h2>
                    <button id="btn-add-type" class="btn btn-primary"><i data-lucide="plus"></i> 新增假期类型</button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${createSortableHeader('类型名称', 'name')}
                            ${createSortableHeader('上限控制', 'hasAnnualLimit')}
                            ${createSortableHeader('强制附件', 'requiresAttachment')}
                            ${createSortableHeader('内部代码', 'id')}
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    },

    adminEntitlements() {
        const ents = API.getAllEntitlements();
        const users = API.getUsers();
        const types = API.getLeaveTypes();

        // 存储当前排序状态
        if (!this.entsSort) {
            this.entsSort = { field: 'user', direction: 'asc' };
        }

        // 排序函数
        const sortedEnts = [...ents].sort((a, b) => {
            const field = this.entsSort.field;
            const dir = this.entsSort.direction === 'asc' ? 1 : -1;

            if (field === 'user') {
                const userA = users.find(u => u.id === a.userId)?.name || '';
                const userB = users.find(u => u.id === b.userId)?.name || '';
                return dir * userA.localeCompare(userB, 'zh-CN');
            } else if (field === 'type') {
                const typeA = types.find(t => t.id === a.leaveTypeId)?.name || '';
                const typeB = types.find(t => t.id === b.leaveTypeId)?.name || '';
                return dir * typeA.localeCompare(typeB, 'zh-CN');
            } else if (field === 'validity') {
                return dir * (a.startDate + a.endDate).localeCompare(b.startDate + b.endDate);
            } else if (field === 'totalDays') {
                return dir * (a.totalDays - b.totalDays);
            } else if (field === 'usedDays') {
                return dir * (a.usedDays - b.usedDays);
            }
            return 0;
        });

        const rows = sortedEnts.map(e => {
            const user = users.find(u => u.id === e.userId);
            const type = types.find(t => t.id === e.leaveTypeId);
            return `
                <tr>
                    <td><strong>${user ? user.name : 'Unknown User'}</strong> (${user ? user.employeeId : '-'})</td>
                    <td>${type ? type.name : 'Unknown'}</td>
                    <td>${e.startDate} ~ ${e.endDate}</td>
                    <td><strong style="color: var(--primary);">${e.totalDays} 天</strong></td>
                    <td>${e.usedDays} 天</td>
                    <td>
                        <button class="btn btn-edit-ent" data-json='${JSON.stringify(e)}' style="padding: 2px 8px; font-size: 0.75rem; background: #f1f5f9; border: 1px solid var(--border);">调整</button>
                    </td>
                </tr>
            `;
        }).join('');

        // 生成带排序图标的表头
        const getSortIcon = (field) => {
            if (this.entsSort.field !== field) return '↕';
            return this.entsSort.direction === 'asc' ? '↑' : '↓';
        };

        const createSortableHeader = (text, field) => {
            return `<th style="cursor: pointer; user-select: none;" onclick="App.sortEntsList('${field}')">
                ${text} ${getSortIcon(field)}
            </th>`;
        };

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.25rem;">年度额度管理</h2>
                    <div style="display: flex; gap: 0.5rem;">
                         <input type="text" id="ent-search" class="form-control" placeholder="筛选员工..." style="width: 250px; margin: 0;">
                         <button id="btn-add-ent" class="btn btn-primary"><i data-lucide="plus"></i> 新增额度周期</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${createSortableHeader('员工', 'user')}
                            ${createSortableHeader('假期类型', 'type')}
                            ${createSortableHeader('有效期', 'validity')}
                            ${createSortableHeader('额度总量', 'totalDays')}
                            ${createSortableHeader('已用天数', 'usedDays')}
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="ent-table-body">
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }
};

/**
 * App Controller
 */
const App = {
    async init() {
        // Initialize API with data path from Admin folder to Web/data
        await API.init('../Web/data/');
        Auth.init();

        this.setupRouter();
        this.updateGlobalUI();

        Router.init();

        // 绑定侧边栏切换事件
        this.bindSidebarToggle();
    },

    setupRouter() {
        Router.setContainer('#page-content');
        Router.setNavSelector('.side-nav .nav-item');

        Router.on('#/login', () => {
            document.getElementById('main-layout').style.display = 'none';
            document.getElementById('login-container').style.display = 'flex';
            document.getElementById('login-container').innerHTML = Views.login();
            this.bindLoginEvents();
        });

        Router.on('#/', () => {
            this.requireAuth();
            return Views.dashboard();
        });

        Router.on('#/leave/apply', () => {
            this.requireAuth();
            const html = Views.leaveApply();
            setTimeout(() => this.bindApplyEvents(), 0);
            return html;
        });

        Router.on('#/leave/list', () => {
            this.requireAuth();
            const html = Views.leaveList();
            setTimeout(() => this.bindLeaveListEvents(), 0);
            return html;
        });

        Router.on('#/audit', () => {
            this.requireAuth();
            const html = Views.audit();
            setTimeout(() => this.bindAuditEvents(), 0);
            return html;
        });

        // HR Admin Routes
        Router.on('#/admin/users', () => {
            this.requireAuth('hr');
            const html = Views.adminUsers();
            setTimeout(() => this.bindAdminUsersEvents(), 0);
            return html;
        });

        Router.on('#/admin/leave-types', () => {
            this.requireAuth('hr');
            const html = Views.adminLeaveTypes();
            setTimeout(() => this.bindAdminLeaveTypesEvents(), 0);
            return html;
        });

        Router.on('#/admin/entitlements', () => {
            this.requireAuth('hr');
            const html = Views.adminEntitlements();
            setTimeout(() => this.bindAdminEntitlementsEvents(), 0);
            return html;
        });

        // Add override for updateActiveNav to handle display/hide based on roles
    },

    requireAuth(role = null) {
        if (!Auth.isLoggedIn()) {
            window.location.hash = '#/login';
            throw new Error('Unauthorized');
        }
        if (role && !Auth.hasRole(role)) {
            UI.alert('权限不足');
            window.location.hash = '#/';
            throw new Error('Forbidden');
        }

        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-layout').style.display = 'flex';
        this.updateGlobalUI();
    },

    updateGlobalUI() {
        const user = Auth.currentUser;
        if (!user) return;

        // Top info
        const info = document.getElementById('top-user-info');
        if (info) {
            info.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="text-align: right;">
                        <div style="font-weight: 600; font-size: 0.875rem;">${user.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${user.role}</div>
                    </div>
                    <img src="${user.avatar}" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border);">
                </div>
            `;
        }

        // Role based menu visibility
        const isManager = Auth.hasRole('manager') || Auth.hasRole('hr');
        const isHR = Auth.hasRole('hr');

        document.querySelectorAll('.is-manager').forEach(el => el.style.display = isManager ? '' : 'none');
        document.querySelectorAll('.is-hr').forEach(el => el.style.display = isHR ? '' : 'none');
    },

    bindSidebarToggle() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (!toggle || !sidebar) return;

        // 从 localStorage 恢复状态
        const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
        if (collapsed) {
            sidebar.classList.add('collapsed');
        }

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebar-collapsed', isCollapsed);

            // 重新渲染图标
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    },

    sortLeaveList(field) {
        if (!Views.leaveListSort) {
            Views.leaveListSort = { field: 'createTime', direction: 'desc' };
        }

        if (Views.leaveListSort.field === field) {
            Views.leaveListSort.direction = Views.leaveListSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            Views.leaveListSort.field = field;
            Views.leaveListSort.direction = 'desc';
        }

        Router.navigate();
    },

    sortAuditList(field) {
        if (!Views.auditSort) {
            Views.auditSort = { field: 'createTime', direction: 'desc' };
        }

        if (Views.auditSort.field === field) {
            Views.auditSort.direction = Views.auditSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            Views.auditSort.field = field;
            Views.auditSort.direction = 'desc';
        }

        Router.navigate();
    },

    sortUsersList(field) {
        if (!Views.usersSort) {
            Views.usersSort = { field: 'name', direction: 'asc' };
        }

        if (Views.usersSort.field === field) {
            Views.usersSort.direction = Views.usersSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            Views.usersSort.field = field;
            Views.usersSort.direction = 'asc';
        }

        Router.navigate();
    },

    sortTypesList(field) {
        if (!Views.typesSort) {
            Views.typesSort = { field: 'name', direction: 'asc' };
        }

        if (Views.typesSort.field === field) {
            Views.typesSort.direction = Views.typesSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            Views.typesSort.field = field;
            Views.typesSort.direction = 'asc';
        }

        Router.navigate();
    },

    sortEntsList(field) {
        if (!Views.entsSort) {
            Views.entsSort = { field: 'user', direction: 'asc' };
        }

        if (Views.entsSort.field === field) {
            Views.entsSort.direction = Views.entsSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            Views.entsSort.field = field;
            Views.entsSort.direction = 'asc';
        }

        Router.navigate();
    },

    bindLeaveListEvents() {
        // 绑定编辑按钮事件
        document.querySelectorAll('.btn-edit-leave').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const leave = API.getLeaves().find(l => l.id === id);
                if (leave) {
                    this.showLeaveEditModal(leave);
                }
            };
        });
    },

    showLeaveEditModal(leave) {
        const user = Auth.currentUser;
        const leaveTypes = API.getLeaveTypes();
        const typeOptions = leaveTypes.map(t =>
            `<option value="${t.id}" ${t.id === leave.leaveTypeId ? 'selected' : ''}>${t.name}</option>`
        ).join('');

        const formHtml = `
            <form id="edit-leave-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>申请人</label>
                        <input type="text" class="form-control" value="${user.name} (${user.employeeId})" disabled>
                    </div>
                    <div class="form-group">
                        <label>请假类型</label>
                        <select id="edit-leaveTypeId" class="form-control" required>
                            ${typeOptions}
                        </select>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>开始日期</label>
                        <input type="date" id="edit-startDate" class="form-control" value="${leave.startDate}" required>
                    </div>
                    <div class="form-group">
                        <label>结束日期</label>
                        <input type="date" id="edit-endDate" class="form-control" value="${leave.endDate}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label id="edit-duration-label">请假天数</label>
                    <input type="number" id="edit-duration" class="form-control" value="${leave.duration}" step="0.5" required>
                </div>
                <div class="form-group">
                    <label>请假原因</label>
                    <textarea id="edit-reason" class="form-control" rows="4" required>${leave.reason}</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" onclick="this.closest('.modal-overlay').remove()" style="background: #f1f5f9;">取消</button>
                    <button type="submit" class="btn btn-primary">保存修改</button>
                </div>
            </form>
        `;

        const modal = UI.showModal('编辑请假申请', formHtml, { width: '600px' });

        // 自动计算天数
        const startInput = document.getElementById('edit-startDate');
        const endInput = document.getElementById('edit-endDate');
        const durationInput = document.getElementById('edit-duration');

        const calculateDays = () => {
            if (startInput.value && endInput.value) {
                let start = new Date(startInput.value);
                let end = new Date(endInput.value);
                let count = 0;
                let current = new Date(start);
                while (current <= end) {
                    const day = current.getDay();
                    if (day !== 0 && day !== 6) count++;
                    current.setDate(current.getDate() + 1);
                }
                durationInput.value = count;
            }
            updateRemainingHint();
        };

        const updateRemainingHint = () => {
            const typeId = document.getElementById('edit-leaveTypeId').value;
            const startDate = startInput.value;
            const label = document.getElementById('edit-duration-label');

            if (startDate) {
                const ent = API.getEntitlement(leave.userId, typeId, startDate);
                if (ent) {
                    // 扣除当前这条请假记录已占用的天数，计算出真实剩余
                    const remaining = ent.totalDays - ent.usedDays + leave.duration;
                    label.innerHTML = `请假天数 <span style="color: var(--primary); font-weight: 400;">(该周期总剩余 ${remaining} 天)</span>`;
                } else {
                    label.innerHTML = `请假天数 <span style="color: #ef4444; font-weight: 400;">(未查到额度周期)</span>`;
                }
            }
        };

        startInput.onchange = calculateDays;
        endInput.onchange = calculateDays;
        document.getElementById('edit-leaveTypeId').onchange = updateRemainingHint;

        // 初始化显示
        updateRemainingHint();

        document.getElementById('edit-leave-form').onsubmit = (e) => {
            e.preventDefault();

            const updatedLeave = {
                ...leave,
                leaveTypeId: document.getElementById('edit-leaveTypeId').value,
                startDate: startInput.value,
                endDate: endInput.value,
                duration: parseFloat(durationInput.value),
                reason: document.getElementById('edit-reason').value
            };

            // 验证额度
            const ent = API.getEntitlement(user.id, updatedLeave.leaveTypeId, updatedLeave.startDate);
            if (!ent) {
                UI.alert('未找到对应的假期额度，请联系 HR！');
                return;
            }

            // 计算已用天数的变化
            const oldDuration = leave.duration;
            const newDuration = updatedLeave.duration;
            const diff = newDuration - oldDuration;

            if (diff > 0 && (ent.totalDays - ent.usedDays + oldDuration) < newDuration) {
                UI.alert('剩余额度不足，无法增加请假天数！');
                return;
            }

            // 更新请假记录
            API.updateLeave(updatedLeave);

            // 调整额度
            ent.usedDays += diff;
            API.updateEntitlement(ent);

            UI.toast('请假信息已更新', 'success');
            modal.close();
            Router.navigate();
        };
    },

    bindLoginEvents() {
        const form = document.getElementById('admin-login-form');
        if (!form) return;
        form.onsubmit = async (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            try {
                await Auth.login(u, p);
                UI.toast('登录成功，欢迎访问管理后台', 'success');
                window.location.hash = '#/';
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };
    },

    bindApplyEvents() {
        const form = document.getElementById('pc-apply-form');
        if (!form) return;

        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');
        const durInput = document.getElementById('duration');
        const lbl = document.getElementById('pc-duration-label');
        const typeSelect = document.getElementById('leaveTypeId');

        const calculateWorkdays = (s, e) => {
            let start = new Date(s);
            let end = new Date(e);
            let count = 0;
            let current = new Date(start);
            while (current <= end) {
                const day = current.getDay();
                if (day !== 0 && day !== 6) count++;
                current.setDate(current.getDate() + 1);
            }
            return count;
        };

        const update = () => {
            const s = startInput.value;
            const e = endInput.value;
            if (s && e) {
                const count = calculateWorkdays(s, e);
                durInput.value = count;
            }

            const ent = API.getEntitlement(Auth.currentUser.id, typeSelect.value, s);
            if (ent) {
                lbl.innerHTML = `预计请假天数 <span style="color: var(--primary); font-weight: 400;">(余额 ${ent.totalDays - ent.usedDays} 天)</span>`;
            } else {
                lbl.innerHTML = `预计请假天数 <span style="color: #ef4444; font-weight: 400;">(未查到额度周期)</span>`;
            }
        };

        startInput.onchange = update;
        endInput.onchange = update;
        typeSelect.onchange = update;
        update();

        form.onsubmit = (e) => {
            e.preventDefault();
            const user = Auth.currentUser;
            const duration = parseFloat(durInput.value);
            const start = startInput.value;
            const end = endInput.value;
            const typeId = typeSelect.value;

            // Simple validation
            const entStart = API.getEntitlement(user.id, typeId, start);
            const entEnd = API.getEntitlement(user.id, typeId, end);

            if (!entStart || !entEnd || entStart.startDate !== entEnd.startDate) {
                UI.alert('请假申请不可跨年度额度周期申请，请分两次提交。');
                return;
            }

            if ((entStart.totalDays - entStart.usedDays) < duration) {
                UI.alert('申请天数超过剩余额度！');
                return;
            }

            UI.alert('【演示环境】业务逻辑：\n1. 扣除相应额度天数\n2. 写入请假明细\n3. 触发审批通知流');

            const newLeave = {
                userId: user.id,
                leaveTypeId: typeId,
                startDate: start,
                endDate: end,
                duration,
                reason: document.getElementById('reason').value,
                status: 'Pending',
                createTime: new Date().toLocaleString()
            };
            API.saveLeave(newLeave);

            entStart.usedDays += duration;
            API.updateEntitlement(entStart);

            UI.toast('申请已成功提交', 'success');
            window.location.hash = '#/leave/list';
        };
    },

    bindAuditEvents() {
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const leave = API.getLeaves().find(l => l.id === id);
                if (leave) {
                    UI.alert(`已批准 ${API.getUser(leave.userId).name} 的申请。\n状态已改为 Approved。`);
                    leave.status = 'Approved';
                    API.updateLeave(leave);
                    Router.navigate();
                }
            };
        });
        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const leave = API.getLeaves().find(l => l.id === id);
                if (leave) {
                    UI.alert(`已拒绝申请，额度已自动原路返还。`);
                    leave.status = 'Rejected';
                    const ent = API.getEntitlement(leave.userId, leave.leaveTypeId, leave.startDate);
                    if (ent) {
                        ent.usedDays -= leave.duration;
                        API.updateEntitlement(ent);
                    }
                    API.updateLeave(leave);
                    Router.navigate();
                }
            };
        });
    },

    bindAdminUsersEvents() {
        const searchInput = document.getElementById('user-search');
        if (searchInput) {
            searchInput.oninput = () => {
                const q = searchInput.value.toLowerCase();
                const users = API.getUsers().filter(u => u.name.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q));
                document.getElementById('user-table-body').innerHTML = users.map(u => `
                    <tr>
                        <td><img src="${u.avatar}" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle; margin-right: 0.5rem;"> <strong>${u.name}</strong></td>
                        <td>${u.employeeId}</td>
                        <td>${u.username}</td>
                        <td><span class="badge ${u.role === 'staff' ? '' : 'badge-approved'}">${u.role}</span></td>
                        <td><span class="badge ${u.status === 'Active' ? 'badge-approved' : 'badge-rejected'}">${u.status}</span></td>
                        <td>${u.joinDate || '-'}</td>
                        <td>
                            <button class="btn btn-edit-user" data-id="${u.id}" style="padding: 2px 8px; font-size: 0.75rem; background: #f1f5f9; border: 1px solid var(--border);">编辑</button>
                        </td>
                    </tr>
                `).join('');
                this.rebindUserEditLinks();
            };
        }
        document.getElementById('btn-add-user').onclick = () => this.showUserEditModal();
        this.rebindUserEditLinks();
    },

    rebindUserEditLinks() {
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.onclick = () => this.showUserEditModal(API.getUser(btn.dataset.id));
        });
    },

    showUserEditModal(user = null) {
        const managers = API.getUsers().filter(u => u.role === 'manager' || u.role === 'hr');
        const managerOptions = managers.map(m => `<option value="${m.id}" ${user && user.managerId === m.id ? 'selected' : ''}>${m.name}</option>`).join('');

        const formHtml = `
            <form id="edit-user-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>工号</label>
                        <input type="text" id="m-employeeId" class="form-control" value="${user ? user.employeeId : ''}" required>
                    </div>
                    <div class="form-group">
                        <label>姓名</label>
                        <input type="text" id="m-name" class="form-control" value="${user ? user.name : ''}" required>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>用户名</label>
                        <input type="text" id="m-username" class="form-control" value="${user ? user.username : ''}" required>
                    </div>
                    <div class="form-group">
                        <label>重置密码</label>
                        <input type="password" id="m-password" class="form-control" value="${user ? user.password : '123'}">
                    </div>
                </div>
                <div class="form-group">
                    <label>直线经理</label>
                    <select id="m-managerId" class="form-control">
                        <option value="">(无)</option>
                        ${managerOptions}
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>角色</label>
                        <select id="m-role" class="form-control">
                            <option value="staff" ${user && user.role === 'staff' ? 'selected' : ''}>普通员工</option>
                            <option value="manager" ${user && user.role === 'manager' ? 'selected' : ''}>直线经理</option>
                            <option value="hr" ${user && user.role === 'hr' ? 'selected' : ''}>人事专员</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>状态</label>
                        <select id="m-status" class="form-control">
                            <option value="Active" ${user && user.status === 'Active' ? 'selected' : ''}>在职</option>
                            <option value="Inactive" ${user && user.status === 'Inactive' ? 'selected' : ''}>离职</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                     <label>入职日期</label>
                     <input type="date" id="m-joinDate" class="form-control" value="${user ? user.joinDate : ''}">
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">保存用户信息</button>
                </div>
            </form>
        `;

        const modal = UI.showModal(user ? '编辑员工信息' : '新增员工', formHtml, { width: '600px' });

        document.getElementById('edit-user-form').onsubmit = (e) => {
            e.preventDefault();
            const data = {
                id: user ? user.id : null,
                employeeId: document.getElementById('m-employeeId').value,
                name: document.getElementById('m-name').value,
                username: document.getElementById('m-username').value,
                password: document.getElementById('m-password').value,
                managerId: document.getElementById('m-managerId').value || null,
                role: document.getElementById('m-role').value,
                status: document.getElementById('m-status').value,
                joinDate: document.getElementById('m-joinDate').value,
                avatar: user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
            };
            API.saveUser(data);
            UI.toast('用户信息已更新', 'success');
            modal.close();
            Router.navigate();
        };
    },

    bindAdminLeaveTypesEvents() {
        document.getElementById('btn-add-type').onclick = () => this.showLeaveTypeEditModal();
        document.querySelectorAll('.btn-edit-type').forEach(btn => {
            btn.onclick = () => this.showLeaveTypeEditModal(API.getLeaveTypes().find(t => t.id === btn.dataset.id));
        });
    },

    showLeaveTypeEditModal(type = null) {
        const formHtml = `
            <form id="edit-type-form">
                <div class="form-group">
                    <label>假期名称</label>
                    <input type="text" id="mt-name" class="form-control" value="${type ? type.name : ''}" required>
                </div>
                <div class="form-group">
                    <label>颜色标识</label>
                    <input type="color" id="mt-color" class="form-control" value="${type ? type.color : '#4f46e5'}" style="height: 40px; padding: 2px;">
                </div>
                <div style="display: flex; gap: 2rem; margin-top: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="mt-hasLimit" ${type && type.hasAnnualLimit ? 'checked' : ''}> 年度限额
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" id="mt-reqAttach" ${type && type.requiresAttachment ? 'checked' : ''}> 强制附件
                    </label>
                </div>
                <div class="modal-footer" style="padding-bottom:0">
                    <button type="submit" class="btn btn-primary">应用配置</button>
                </div>
            </form>
        `;
        const modal = UI.showModal(type ? '配置假期类型' : '新增假期类型', formHtml);
        document.getElementById('edit-type-form').onsubmit = (e) => {
            e.preventDefault();
            const data = {
                id: type ? type.id : null,
                name: document.getElementById('mt-name').value,
                color: document.getElementById('mt-color').value,
                hasAnnualLimit: document.getElementById('mt-hasLimit').checked,
                requiresAttachment: document.getElementById('mt-reqAttach').checked
            };
            API.saveLeaveType(data);
            UI.toast('假期规则已更新', 'success');
            modal.close();
            Router.navigate();
        };
    },

    bindAdminEntitlementsEvents() {
        const searchInput = document.getElementById('ent-search');
        if (searchInput) {
            searchInput.oninput = () => {
                const q = searchInput.value.toLowerCase();
                const ents = API.getAllEntitlements().filter(e => {
                    const u = API.getUser(e.userId);
                    return u.name.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q);
                });
                document.getElementById('ent-table-body').innerHTML = ents.map(e => {
                    const u = API.getUser(e.userId);
                    const t = API.getLeaveTypes().find(lt => lt.id === e.leaveTypeId);
                    return `
                        <tr>
                            <td><strong>${u ? u.name : ''}</strong> (${u ? u.employeeId : ''})</td>
                            <td>${t ? t.name : ''}</td>
                            <td>${e.startDate} ~ ${e.endDate}</td>
                            <td><strong style="color: var(--primary);">${e.totalDays} 天</strong></td>
                            <td>${e.usedDays} 天</td>
                            <td>
                                <button class="btn btn-edit-ent" data-json='${JSON.stringify(e)}' style="padding: 2px 8px; font-size: 0.75rem; background: #f1f5f9; border: 1px solid var(--border);">调整</button>
                            </td>
                        </tr>
                    `;
                }).join('');
                this.rebindEntEditLinks();
            };
        }
        document.getElementById('btn-add-ent').onclick = () => this.showEntitlementEditModal();
        this.rebindEntEditLinks();
    },

    rebindEntEditLinks() {
        document.querySelectorAll('.btn-edit-ent').forEach(btn => {
            btn.onclick = () => this.showEntitlementEditModal(JSON.parse(btn.dataset.json));
        });
    },

    showEntitlementEditModal(ent = null) {
        const users = API.getUsers();
        const types = API.getLeaveTypes();
        const userOptions = users.map(u => `<option value="${u.id}" ${ent && ent.userId === u.id ? 'selected' : ''}>${u.name} (${u.employeeId})</option>`).join('');
        const typeOptions = types.map(t => `<option value="${t.id}" ${ent && ent.leaveTypeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

        const formHtml = `
            <form id="edit-ent-form">
                <div class="form-group">
                    <label>选择员工</label>
                    <select id="me-userId" class="form-control" ${ent ? 'disabled' : ''}>${userOptions}</select>
                </div>
                <div class="form-group">
                    <label>假期类型</label>
                    <select id="me-typeId" class="form-control" ${ent ? 'disabled' : ''}>${typeOptions}</select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>周期开始</label>
                        <input type="date" id="me-start" class="form-control" value="${ent ? ent.startDate : ''}" ${ent ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group">
                        <label>周期结束</label>
                        <input type="date" id="me-end" class="form-control" value="${ent ? ent.endDate : ''}" ${ent ? 'disabled' : ''} required>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>总额度 (天)</label>
                        <input type="number" id="me-total" class="form-control" value="${ent ? ent.totalDays : '0'}" required step="0.5">
                    </div>
                    <div class="form-group">
                        <label>已使用 (天)</label>
                        <input type="number" id="me-used" class="form-control" value="${ent ? ent.usedDays : '0'}" required step="0.5">
                    </div>
                </div>
                <div class="modal-footer" style="justify-content: space-between;">
                    ${ent ? `<button type="button" id="me-delete" class="btn" style="background: #fee2e2; color: #991b1b;">删除记录</button>` : '<div></div>'}
                    <button type="submit" class="btn btn-primary">同步调整额度</button>
                </div>
            </form>
        `;
        const modal = UI.showModal(ent ? '调整员工额度' : '新增额度周期', formHtml);

        if (ent) {
            document.getElementById('me-delete').onclick = () => {
                if (confirm('确定要彻底删除这条额度记录吗？')) {
                    API.deleteEntitlement(ent);
                    UI.toast('记录已移除', 'success');
                    modal.close();
                    Router.navigate();
                }
            };
        }

        document.getElementById('edit-ent-form').onsubmit = (e) => {
            e.preventDefault();
            const data = {
                userId: document.getElementById('me-userId').value,
                leaveTypeId: document.getElementById('me-typeId').value,
                startDate: document.getElementById('me-start').value,
                endDate: document.getElementById('me-end').value,
                totalDays: parseFloat(document.getElementById('me-total').value),
                usedDays: parseFloat(document.getElementById('me-used').value)
            };
            try {
                API.updateEntitlement(data);
                UI.toast('额度同步成功', 'success');
                modal.close();
                Router.navigate();
            } catch (err) {
                UI.alert(err.message);
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
