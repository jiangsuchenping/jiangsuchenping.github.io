// 版本信息
const APP_VERSION = {
    current: '1.0.0',
    latest: '1.0.0',
    updateUrl: 'https://your-update-url.com' // 替换为实际的更新地址
};

// 存储上次检查的版本号
let lastCheckedVersion = localStorage.getItem('lastCheckedVersion') || APP_VERSION.current;

// 检查更新
function checkForUpdates() {
    // 使用HBuilder API读取版本文件
    plus.io.resolveLocalFileSystemURL('_www/version.json', function(entry) {
        entry.file(function(file) {
            const reader = new plus.io.FileReader();
            reader.onloadend = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    // 如果发现新版本
                    if (data.version > APP_VERSION.current) {
                        // 如果版本号与上次检查的不同，说明有更新
                        if (data.version !== lastCheckedVersion) {
                            localStorage.setItem('lastCheckedVersion', data.version);
                            showUpdateNotification(data);
                        }
                    }
                } catch (error) {
                    console.log('解析版本信息失败:', error);
                }
            };
            reader.onerror = function(e) {
                console.log('读取版本文件失败:', e);
            };
            reader.readAsText(file);
        }, function(error) {
            console.log('获取文件失败:', error);
        });
    }, function(error) {
        console.log('解析文件路径失败:', error);
    });
}

// 显示更新提示
function showUpdateNotification(updateInfo) {
    const updateDialog = document.createElement('div');
    updateDialog.className = 'update-dialog';
    updateDialog.innerHTML = `
        <div class="update-content">
            <h3>发现新版本</h3>
            <p>当前版本：${APP_VERSION.current}</p>
            <p>最新版本：${updateInfo.version}</p>
            <p>更新内容：${updateInfo.description || '优化体验，修复问题'}</p>
            <div class="update-buttons">
                <button class="btn update-now">立即更新</button>
                <button class="btn update-later">稍后再说</button>
            </div>
        </div>
    `;

    document.body.appendChild(updateDialog);

    // 添加按钮事件
    updateDialog.querySelector('.update-now').addEventListener('click', () => {
        // 保存更新状态
        localStorage.setItem('needsUpdate', 'true');
        // 重新加载页面
        if (plus && plus.webview) {
            // 获取当前窗口
            const currentWebview = plus.webview.currentWebview();
            // 重新加载当前页面
            currentWebview.reload();
        } else {
            // 如果plus API不可用，使用普通的重载方法
            window.location.reload();
        }
    });

    updateDialog.querySelector('.update-later').addEventListener('click', () => {
        document.body.removeChild(updateDialog);
    });
}

// 检查是否需要更新
function checkIfNeedsUpdate() {
    if (localStorage.getItem('needsUpdate') === 'true') {
        localStorage.removeItem('needsUpdate');
        // 清除缓存
        if (plus && plus.cache) {
            plus.cache.clear(function() {
                console.log('缓存已清除');
                // 重新加载页面
                if (plus.webview) {
                    const currentWebview = plus.webview.currentWebview();
                    currentWebview.reload();
                } else {
                    window.location.reload();
                }
            }, function(error) {
                console.log('清除缓存失败:', error);
            });
        } else {
            // 如果plus API不可用，直接重载
            window.location.reload();
        }
    }
}

// 等待plus ready
document.addEventListener('plusready', function() {
    // 定期检查更新（每分钟检查一次）
    setInterval(checkForUpdates, 60000);
    // 立即检查一次更新
    checkForUpdates();
    checkIfNeedsUpdate();
}); 