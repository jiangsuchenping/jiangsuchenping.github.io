@echo off
 

rem 定义项目路径，需替换为实际项目路径
set PROJECT_PATH=%~dp0
rem 定义远程仓库分支，一般为 master 或 main，按需修改
set REMOTE_BRANCH=main
rem 进入项目目录
cd /d %PROJECT_PATH%
  

rem 拉取远程仓库最新代码
git pull origin %REMOTE_BRANCH%
 
    rem 有变更，添加所有变更文件到暂存区
    git add .
    rem 获取当前日期时间作为提交信息
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set "MYDATE=%%c-%%a-%%b")
    for /f "tokens=1-2 delims=:. " %%a in ('time /t') do (set "MYTIME=%%a%%b")
   set COMMIT_MSG=Auto commit at %MYDATE% %MYTIME% 
  
    rem 提交暂存区文件到本地仓库
   git commit -m "%COMMIT_MSG%"
  
   rem 将本地仓库的变更推送到远程仓库
    git push origin %REMOTE_BRANCH%
 

 
 