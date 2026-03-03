const Router = {
    routes: {},

    // 页面标题映射配置
    pageTitles: {
        '#/': '首页',
        '#/leave/apply': '申请请假',
        '#/leave/list': '我的记录',
        '#/audit': '审批中心',
        '#/admin': '系统管理',
        '#/admin/users': '员工管理',
        '#/admin/leave-types': '假期配置',
        '#/admin/entitlements': '额度调整',
        '#/login': '登录'
    },

    on(path, handler) {
        this.routes[path] = handler;
    },

    /**
     * 更新页面顶部标题
     * @param {string} hash - 当前路由hash
     */
    updatePageTitle(hash) {
        const pageTitle = this.pageTitles[hash] || '';
        const appTitle = document.querySelector('.app-title');
        if (appTitle) {
            if (pageTitle && hash !== '#/login') {
                appTitle.textContent = `请假管理系统 - ${pageTitle}`;
            } else {
                appTitle.textContent = '请假管理系统';
            }
        }
    },

    async navigate() {
        const hash = window.location.hash || '#/';
        let handler = this.routes[hash];

        // Simple wildcard support if needed, otherwise exact match
        if (!handler) {
            // Check for patterns like #/leaves/edit/123
            for (const route in this.routes) {
                if (route.includes(':')) {
                    const regex = new RegExp('^' + route.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
                    const match = hash.match(regex);
                    if (match) {
                        handler = () => this.routes[route](...match.slice(1));
                        break;
                    }
                }
            }
        }

        if (!Auth.isLoggedIn() && hash !== '#/login') {
            window.location.hash = '#/login';
            return;
        }

        // 更新页面标题
        this.updatePageTitle(hash);

        if (handler) {
            document.querySelector('.main-content').innerHTML = '<div class="loader">加载中...</div>';
            try {
                const content = await handler();
                document.querySelector('.main-content').innerHTML = content;
                // Re-init icons if using lucide
                if (window.lucide) window.lucide.createIcons();
            } catch (e) {
                console.error(e);
                document.querySelector('.main-content').innerHTML = '<div class="error">发生错误</div>';
            }
        } else {
            document.querySelector('.main-content').innerHTML = '404 - 页面未找到';
        }

        this.updateActiveNav();
    },

    updateActiveNav() {
        const hash = window.location.hash || '#/';
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('href') === hash);
        });

        // Hide bottom nav on login page
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = hash === '#/login' ? 'none' : 'flex';
        }
    },

    init() {
        window.addEventListener('hashchange', () => this.navigate());
        this.navigate();
    }
};
window.Router = Router;
