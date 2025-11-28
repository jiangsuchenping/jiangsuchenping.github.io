const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // 记录请求的URL用于调试
    console.log('Request URL:', req.url);
    
    // 移除URL中的查询参数部分
    const cleanUrl = req.url.split('?')[0];
    console.log('Clean URL (without query params):', cleanUrl);
    
    // 使用path.join确保路径分隔符在Windows环境下正确
    let filePath = path.join('.', cleanUrl);
    console.log('Calculated filePath:', filePath);
    
    if (filePath === path.join('.', '/') || filePath === path.join('.', '')) {
        filePath = path.join('.', 'youeryuan', 'cube-unfold.html');
        console.log('Root path requested, using default file:', filePath);
    }

    // 检查文件是否存在，且是否是目录
    fs.stat(filePath, (statError, stats) => {
        if (statError) {
            // 文件不存在
            console.error('File not found:', filePath, statError);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`<h1>404 - File Not Found</h1><p>Path: ${req.url}</p><p>Resolved to: ${filePath}</p>`, 'utf-8');
            return;
        }
        
        // 如果是目录，尝试查找index.html
        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
            console.log('Directory requested, looking for index.html:', filePath);
        }
        
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        
        fs.readFile(filePath, (readError, content) => {
            if (readError) {
                console.error('Error reading file:', filePath, readError);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<h1>404 - File Not Found</h1><p>Path: ${filePath}</p>`, 'utf-8');
            } else {
                console.log('Serving file:', filePath, 'Content-Type:', contentType);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Opening http://localhost:${PORT}/youeryuan/cube-unfold.html`);
});
