/**
 * 认证模块（Auth）
 * ============================================================
 * 负责用户登录、登出及权限判断。
 * 当前登录用户信息存储在 sessionStorage 中，关闭标签页后自动清除，
 * 保证每次打开浏览器都需要重新登录。
 *
 * 角色体系（role）：
 *   staff   - 普通员工：只能查看和申请自己的请假
 *   manager - 直线经理：可审批下属的请假申请
 *   hr      - 人事专员：拥有所有权限（超级管理员）
 * ============================================================
 */
const Auth = {
    /** 当前登录用户对象，未登录时为 null */
    currentUser: null,

    /**
     * 初始化：从 sessionStorage 恢复登录状态
     * 在页面加载时调用，保证刷新后仍保持登录
     */
    init() {
        const user = sessionStorage.getItem('current_user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    },

    /**
     * 用户登录
     * 登录前会重新从 JSON 文件加载最新模拟数据，以便演示时数据保持新鲜
     * @param {string} username - 登录用户名
     * @param {string} password - 登录密码（演示环境为明文）
     * @returns {Promise<Object>} 登录成功后返回用户对象
     * @throws {Error} 账号不存在、密码错误或账号已停用时抛出错误
     */
    async login(username, password) {
        // 每次登录时重新从 JSON 文件加载最新模拟数据，确保数据与源文件同步
        await API.reloadFromMockData();

        const users = API.getUsers();
        // 查找用户名和密码均匹配的用户（演示环境密码明文比对）
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            // 拒绝已停用账号登录
            if (user.status !== 'Active') {
                throw new Error('用户账号已停用');
            }
            this.currentUser = user;
            // 将用户信息序列化后存入 sessionStorage，刷新页面后可恢复
            sessionStorage.setItem('current_user', JSON.stringify(user));
            return user;
        }
        throw new Error('用户名或密码错误');
    },

    /**
     * 用户登出：清空当前用户信息并跳转到登录页
     */
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('current_user'); // 清除 sessionStorage 中的登录状态
        window.location.hash = '#/login';
    },

    /**
     * 检查当前是否已登录
     * @returns {boolean} 已登录返回 true，否则返回 false
     */
    isLoggedIn() {
        return !!this.currentUser;
    },

    /**
     * 检查当前用户是否拥有指定角色权限
     * 规则：HR 拥有所有角色权限（向下兼容）
     * @param {string} role - 目标角色，可为 'staff' | 'manager' | 'hr'
     * @returns {boolean} 有权限返回 true，否则返回 false
     */
    hasRole(role) {
        if (!this.currentUser) return false;
        // HR 是超级角色，拥有所有权限
        if (this.currentUser.role === 'hr') return true;
        // manager 拥有 manager 权限
        if (role === 'manager' && this.currentUser.role === 'manager') return true;
        // 其他情况：精确匹配角色
        return this.currentUser.role === role;
    }
};

// 挂载到全局，方便其他模块直接使用 Auth.xxx()
window.Auth = Auth;
