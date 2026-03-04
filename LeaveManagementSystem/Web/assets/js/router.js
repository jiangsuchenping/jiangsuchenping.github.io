/**
 * 前端路由模块（Router）
 * ============================================================
 * 基于 URL Hash（锚点）实现单页应用路由，监听 hashchange 事件
 * 来切换页面内容，无需刷新整个页面。
 *
 * 路由格式示例：
 *   #/          → 首页（仪表盘）
 *   #/leave/apply → 发起请假申请
 *   #/admin/users → HR管理 - 员工列表
 *
 * 路由参数支持（尚未大量使用）：
 *   '#/leaves/:id' → 可通过 :id 传递参数
 * ============================================================
 */
const Router = {
    /** 路由表：{ hash路径: 处理函数 } */
    routes: {},

    /**
     * 页面标题映射表：根据当前 hash 更新顶部标题栏的文字
     * 未在此表中配置的路由标题默认显示空字符串
     */
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

    /** 页面内容区的 CSS 选择器，路由渲染的目标容器 */
    containerSelector: '.main-content',
    /** 导航栏项目的 CSS 选择器，用于更新 active 高亮样式 */
    navSelector: '.nav-item',

    /**
     * 注册一条路由规则
     * @param {string} path       - URL Hash 路径，如 '#/leave/apply'
     * @param {Function} handler  - 对应的渲染函数；应返回 HTML 字符串或 Promise<string>
     */
    on(path, handler) {
        this.routes[path] = handler;
    },

    /**
     * 覆盖默认的页面内容容器选择器
     * Admin 端使用 '#page-content'，Web 端使用 '.main-content'
     * @param {string} selector - CSS 选择器字符串
     */
    setContainer(selector) {
        this.containerSelector = selector;
    },

    /**
     * 覆盖默认的导航项目选择器
     * Admin 端侧边栏导航与 Web 端底部导航的选择器不同
     * @param {string} selector - CSS 选择器字符串
     */
    setNavSelector(selector) {
        this.navSelector = selector;
    },

    /**
     * 根据当前路由 Hash 更新页面顶部标题文字
     * 登录页特殊处理：只显示系统名称，不拼接子页面名称
     * @param {string} hash - 当前路由 hash 值，如 '#/leave/list'
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

    /**
     * 执行路由导航：根据当前 URL Hash 渲染对应页面
     * 流程：
     *   1. 读取 window.location.hash
     *   2. 在路由表中查找对应处理函数（支持动态参数）
     *   3. 未登录时强制重定向到登录页
     *   4. 调用处理函数获取 HTML 字符串并渲染到容器
     *   5. 重新初始化图标库（Lucide Icons）
     *   6. 更新导航栏高亮状态
     */
    async navigate() {
        const hash = window.location.hash || '#/';
        let handler = this.routes[hash]; // 优先精确匹配

        // 精确匹配失败时，尝试动态路由参数匹配（如 '#/leaves/:id'）
        if (!handler) {
            for (const route in this.routes) {
                if (route.includes(':')) {
                    // 将路由模式中的 :param 替换为正则捕获组
                    const regex = new RegExp('^' + route.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
                    const match = hash.match(regex);
                    if (match) {
                        // 将捕获到的参数传入路由处理函数
                        handler = () => this.routes[route](...match.slice(1));
                        break;
                    }
                }
            }
        }

        // 未登录保护：非登录页面自动跳转到登录页
        if (!Auth.isLoggedIn() && hash !== '#/login') {
            window.location.hash = '#/login';
            return;
        }

        // 同步更新顶部页面标题
        this.updatePageTitle(hash);

        const container = document.querySelector(this.containerSelector);
        if (handler && container) {
            // 显示加载中占位符，防止白屏/闪烁
            container.innerHTML = '<div class="loader">加载中...</div>';
            try {
                const content = await handler(); // handler 可能是异步函数
                container.innerHTML = content;
                // 重新初始化 Lucide 图标（innerHTML 替换后图标需要重新解析）
                if (window.lucide) window.lucide.createIcons();
            } catch (e) {
                console.error(e);
                document.querySelector('.main-content').innerHTML = '<div class="error">发生错误</div>';
            }
        } else {
            // 路由表中无此路径
            document.querySelector('.main-content').innerHTML = '404 - 页面未找到';
        }

        // 更新导航栏高亮状态
        this.updateActiveNav();
    },

    /**
     * 刷新导航栏的激活（高亮）状态
     * 将 href 与当前 hash 匹配的导航项标记为 active
     * 特殊处理：在登录页隐藏底部导航栏
     */
    updateActiveNav() {
        const hash = window.location.hash || '#/';
        // 遍历所有导航项，切换 active class
        document.querySelectorAll(this.navSelector).forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('href') === hash);
        });

        // 登录页面不显示底部导航栏
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = hash === '#/login' ? 'none' : 'flex';
        }
    },

    /**
     * 启动路由系统：
     *   1. 监听 hashchange 事件（用户点击浏览器前进/后退或直接修改 URL）
     *   2. 立即执行一次导航，渲染当前 URL 对应的页面
     */
    init() {
        window.addEventListener('hashchange', () => this.navigate());
        this.navigate(); // 初始化时立即渲染当前页面
    }
};

// 挂载到全局，方便其他模块直接使用 Router.xxx()
window.Router = Router;
