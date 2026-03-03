const Auth = {
    currentUser: null,

    init() {
        const user = sessionStorage.getItem('current_user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    },

    async login(username, password) {
        // 登录时从模拟数据文件重新加载最新数据到本地存储
        await API.reloadFromMockData();
        
        const users = API.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            if (user.status !== 'Active') {
                throw new Error('用户账号已停用');
            }
            this.currentUser = user;
            sessionStorage.setItem('current_user', JSON.stringify(user));
            return user;
        }
        throw new Error('用户名或密码错误');
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('current_user');
        window.location.hash = '#/login';
    },

    isLoggedIn() {
        return !!this.currentUser;
    },

    hasRole(role) {
        if (!this.currentUser) return false;
        if (this.currentUser.role === 'hr') return true; // HR has all perms
        if (role === 'manager' && this.currentUser.role === 'manager') return true;
        return this.currentUser.role === role;
    }
};
window.Auth = Auth;
