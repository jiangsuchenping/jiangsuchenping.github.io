const Router = {
    routes: {},

    on(path, handler) {
        this.routes[path] = handler;
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
