@echo off
chcp 65001 > nul
taskkill /F /IM python.exe /T
start "WebServer" python -m http.server 8000
echo 服务已重启，访问地址：http://localhost:8000