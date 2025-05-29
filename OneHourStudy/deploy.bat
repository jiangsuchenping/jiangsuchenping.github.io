@echo off

REM 构建
call npm run build

REM 进入生成的构建文件夹
cd dist

REM 初始化 git 仓库
git init
git add -A
git commit -m "deploy"

REM 推送到 GitHub Pages
git push -f git@github.com:jiangsuchenping/jiangsuchenping.github.io.git master:gh-pages

REM 返回上级目录
cd .. 