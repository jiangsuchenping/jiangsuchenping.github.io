/**
 * 社交分享组件
 * 支持多种平台的内容分享功能
 */

class SocialShareComponent {
    constructor() {
        this.platforms = {
            wechat: {
                name: '微信',
                icon: 'fab fa-weixin',
                color: '#7BB32E',
                shareMethod: 'qr'
            },
            weibo: {
                name: '微博',
                icon: 'fab fa-weibo',
                color: '#E6162D',
                shareMethod: 'url',
                url: 'https://service.weibo.com/share/share.php'
            },
            qq: {
                name: 'QQ空间',
                icon: 'fab fa-qq',
                color: '#12B7F5',
                shareMethod: 'url',
                url: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'
            },
            copy: {
                name: '复制链接',
                icon: 'fas fa-copy',
                color: '#666',
                shareMethod: 'copy'
            },
            email: {
                name: '邮件分享',
                icon: 'fas fa-envelope',
                color: '#EA4335',
                shareMethod: 'email'
            },
            print: {
                name: '打印页面',
                icon: 'fas fa-print',
                color: '#333',
                shareMethod: 'print'
            }
        };
        
        this.shareHistory = [];
        this.maxHistoryItems = 50;
        
        this.init();
    }
    
    /**
     * 初始化组件
     */
    init() {
        this.loadShareHistory();
        this.setupEventListeners();
        this.injectCSS();
        
        console.log('[SocialShareComponent] 社交分享组件初始化完成');
    }
    
    /**
     * 注入CSS样式
     */
    injectCSS() {
        const css = `
            .social-share-container {
                position: relative;
                display: inline-block;
            }
            
            .share-btn {
                background: var(--primary-color, #007bff);
                color: white;
                border: none;
                border-radius: 25px;
                padding: 10px 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .share-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
            }
            
            .share-panel {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                padding: 20px;
                min-width: 300px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            
            .share-panel.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .share-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .share-panel-title {
                font-weight: bold;
                color: #333;
            }
            
            .share-close-btn {
                background: none;
                border: none;
                font-size: 18px;
                color: #666;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .share-platforms {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .share-platform {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid #e9ecef;
            }
            
            .share-platform:hover {
                background: #f8f9fa;
                transform: translateY(-1px);
            }
            
            .platform-icon {
                width: 24px;
                text-align: center;
            }
            
            .platform-name {
                font-size: 14px;
                color: #333;
            }
            
            .share-info {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .share-title {
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            
            .share-description {
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .share-url {
                background: #e9ecef;
                border-radius: 4px;
                padding: 8px;
                font-size: 12px;
                color: #666;
                word-break: break-all;
                margin-top: 10px;
            }
            
            .qr-code-container {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
                margin-top: 10px;
            }
            
            .qr-code {
                max-width: 200px;
                margin: 0 auto;
            }
            
            .share-stats {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #999;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #e9ecef;
            }
            
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .modal-backdrop.show {
                opacity: 1;
                visibility: visible;
            }
            
            .share-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translate(-50%, -50%) scale(0.8);
                transition: all 0.3s ease;
            }
            
            .share-modal.show {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .success-message {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
                padding: 10px;
                margin-top: 10px;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .success-message.show {
                opacity: 1;
            }
            
            @media (max-width: 768px) {
                .share-panel {
                    position: fixed;
                    top: auto;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    border-radius: 12px 12px 0 0;
                    min-width: auto;
                }
                
                .share-platforms {
                    grid-template-columns: repeat(3, 1fr);
                }
                
                .share-platform {
                    flex-direction: column;
                    text-align: center;
                    padding: 15px 5px;
                }
                
                .platform-name {
                    font-size: 12px;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 点击其他地方关闭分享面板
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.social-share-container')) {
                this.hideSharePanel();
            }
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }
    
    /**
     * 创建分享按钮
     */
    createShareButton(options = {}) {
        const {
            text = '分享',
            icon = 'fas fa-share-alt',
            className = 'btn btn-primary',
            position = 'bottom-right'
        } = options;
        
        const container = document.createElement('div');
        container.className = 'social-share-container';
        
        const button = document.createElement('button');
        button.className = `share-btn ${className}`;
        button.innerHTML = `<i class="${icon}"></i><span>${text}</span>`;
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showSharePanel(container, options);
        });
        
        container.appendChild(button);
        
        return container;
    }
    
    /**
     * 显示分享面板
     */
    showSharePanel(container, options = {}) {
        // 移除现有面板
        this.hideSharePanel();
        
        const panel = this.createSharePanel(options);
        container.appendChild(panel);
        
        // 延迟显示以触发动画
        setTimeout(() => {
            panel.classList.add('show');
        }, 10);
    }
    
    /**
     * 创建分享面板
     */
    createSharePanel(options = {}) {
        const {
            title = document.title,
            description = document.querySelector('meta[name="description"]')?.content || '',
            url = window.location.href,
            image = this.getPageImage()
        } = options;
        
        const panel = document.createElement('div');
        panel.className = 'share-panel';
        
        panel.innerHTML = `
            <div class="share-panel-header">
                <div class="share-panel-title">分享到</div>
                <button class="share-close-btn" onclick="socialShare.hideSharePanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="share-info">
                <div class="share-title">${title}</div>
                <div class="share-description">${description}</div>
                <div class="share-url">${url}</div>
            </div>
            
            <div class="share-platforms">
                ${Object.entries(this.platforms).map(([key, platform]) => `
                    <div class="share-platform" onclick="socialShare.shareToPlatform('${key}', ${JSON.stringify({ title, description, url, image }).replace(/"/g, '&quot;')})">
                        <div class="platform-icon">
                            <i class="${platform.icon}" style="color: ${platform.color}"></i>
                        </div>
                        <div class="platform-name">${platform.name}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="share-stats">
                <span>分享次数: ${this.getShareCount(url)}</span>
                <span>最近分享: ${this.getLastShareTime(url)}</span>
            </div>
        `;
        
        return panel;
    }
    
    /**
     * 分享到指定平台
     */
    shareToPlatform(platformKey, shareData) {
        const platform = this.platforms[platformKey];
        if (!platform) return;
        
        switch (platform.shareMethod) {
            case 'url':
                this.shareViaUrl(platform, shareData);
                break;
            case 'qr':
                this.shareViaQR(shareData);
                break;
            case 'copy':
                this.copyToClipboard(shareData);
                break;
            case 'email':
                this.shareViaEmail(shareData);
                break;
            case 'print':
                this.printPage();
                break;
        }
        
        // 记录分享
        this.recordShare(platformKey, shareData);
        
        // 显示成功消息
        this.showSuccessMessage(`已分享到${platform.name}`);
    }
    
    /**
     * 通过URL分享
     */
    shareViaUrl(platform, shareData) {
        let shareUrl = platform.url;
        
        const params = new URLSearchParams();
        
        switch (platform.name) {
            case '微博':
                params.append('title', shareData.title);
                params.append('url', shareData.url);
                params.append('content', shareData.description);
                params.append('pic', shareData.image);
                break;
            case 'QQ空间':
                params.append('url', shareData.url);
                params.append('title', shareData.title);
                params.append('summary', shareData.description);
                params.append('pics', shareData.image);
                break;
        }
        
        const finalUrl = `${shareUrl}?${params.toString()}`;
        window.open(finalUrl, '_blank', 'width=600,height=400');
    }
    
    /**
     * 通过二维码分享
     */
    shareViaQR(shareData) {
        this.showModal({
            title: '微信分享',
            content: `
                <div class="qr-code-container">
                    <div class="mb-3">扫描二维码分享到微信</div>
                    <div class="qr-code" id="qrCode"></div>
                    <div class="mt-3 text-muted small">使用微信扫一扫功能</div>
                </div>
            `,
            onShow: () => {
                this.generateQRCode('qrCode', shareData.url);
            }
        });
    }
    
    /**
     * 复制到剪贴板
     */
    async copyToClipboard(shareData) {
        const textToCopy = `${shareData.title}\n${shareData.description}\n${shareData.url}`;
        
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            this.showSuccessMessage('内容已复制到剪贴板');
        } catch (err) {
            console.error('复制失败:', err);
            this.showModal({
                title: '复制内容',
                content: `
                    <div class="mb-3">请手动复制以下内容:</div>
                    <textarea class="form-control" rows="4" readonly>${textToCopy}</textarea>
                `
            });
        }
    }
    
    /**
     * 邮件分享
     */
    shareViaEmail(shareData) {
        const subject = encodeURIComponent(shareData.title);
        const body = encodeURIComponent(
            `${shareData.description}\n\n查看详情: ${shareData.url}\n\n来自宜家房产`
        );
        
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
    
    /**
     * 打印页面
     */
    printPage() {
        window.print();
    }
    
    /**
     * 生成二维码
     */
    generateQRCode(containerId, text) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // 使用在线二维码生成服务（实际项目中建议使用本地库）
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
        
        const img = document.createElement('img');
        img.src = qrUrl;
        img.alt = '分享二维码';
        img.className = 'img-fluid';
        
        container.appendChild(img);
    }
    
    /**
     * 显示模态框
     */
    showModal({ title, content, onShow }) {
        // 移除现有模态框
        this.hideModal();
        
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.onclick = () => this.hideModal();
        
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        
        modal.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">${title}</h5>
                <button class="btn-close" onclick="socialShare.hideModal()"></button>
            </div>
            <div class="modal-content">${content}</div>
        `;
        
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        
        // 触发动画
        setTimeout(() => {
            backdrop.classList.add('show');
            modal.classList.add('show');
            
            if (onShow) {
                onShow();
            }
        }, 10);
    }
    
    /**
     * 隐藏模态框
     */
    hideModal() {
        const backdrop = document.querySelector('.modal-backdrop');
        const modal = document.querySelector('.share-modal');
        
        if (backdrop) backdrop.remove();
        if (modal) modal.remove();
    }
    
    /**
     * 隐藏分享面板
     */
    hideSharePanel() {
        const panel = document.querySelector('.share-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => {
                panel.remove();
            }, 300);
        }
    }
    
    /**
     * 显示成功消息
     */
    showSuccessMessage(message) {
        // 移除现有消息
        const existing = document.querySelector('.success-message');
        if (existing) existing.remove();
        
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.textContent = message;
        
        // 添加到面板或body
        const panel = document.querySelector('.share-panel');
        if (panel) {
            panel.appendChild(messageEl);
        } else {
            document.body.appendChild(messageEl);
        }
        
        // 显示动画
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);
        
        // 自动隐藏
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
    
    /**
     * 获取页面图片
     */
    getPageImage() {
        // 尝试获取页面主要图片
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;
        
        const firstImg = document.querySelector('img');
        if (firstImg) return firstImg.src;
        
        return '';
    }
    
    /**
     * 记录分享
     */
    recordShare(platform, shareData) {
        const shareRecord = {
            platform,
            url: shareData.url,
            title: shareData.title,
            timestamp: new Date().toISOString()
        };
        
        this.shareHistory.unshift(shareRecord);
        
        // 限制历史记录数量
        if (this.shareHistory.length > this.maxHistoryItems) {
            this.shareHistory = this.shareHistory.slice(0, this.maxHistoryItems);
        }
        
        this.saveShareHistory();
    }
    
    /**
     * 获取分享次数
     */
    getShareCount(url) {
        return this.shareHistory.filter(record => record.url === url).length;
    }
    
    /**
     * 获取最近分享时间
     */
    getLastShareTime(url) {
        const record = this.shareHistory.find(record => record.url === url);
        if (record) {
            return new Date(record.timestamp).toLocaleDateString();
        }
        return '无';
    }
    
    /**
     * 保存分享历史
     */
    saveShareHistory() {
        try {
            localStorage.setItem('socialShareHistory', JSON.stringify(this.shareHistory));
        } catch (err) {
            console.warn('保存分享历史失败:', err);
        }
    }
    
    /**
     * 加载分享历史
     */
    loadShareHistory() {
        try {
            const saved = localStorage.getItem('socialShareHistory');
            if (saved) {
                this.shareHistory = JSON.parse(saved);
            }
        } catch (err) {
            console.warn('加载分享历史失败:', err);
            this.shareHistory = [];
        }
    }
    
    /**
     * 获取统计信息
     */
    getStats() {
        const platformCounts = {};
        
        this.shareHistory.forEach(record => {
            platformCounts[record.platform] = (platformCounts[record.platform] || 0) + 1;
        });
        
        return {
            totalShares: this.shareHistory.length,
            platformCounts,
            mostSharedPlatform: Object.keys(platformCounts).sort((a, b) => 
                platformCounts[b] - platformCounts[a]
            )[0] || null
        };
    }
}

// 全局实例
let socialShare;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    socialShare = new SocialShareComponent();
});

// 暴露到全局
window.SocialShareComponent = SocialShareComponent;
window.socialShare = socialShare;