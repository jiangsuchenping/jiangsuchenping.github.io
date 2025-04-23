@echo off
:: 切换到根目录
cd\
:: 遍历所有 .git 目录并执行 git gc 命令进行垃圾回收
FOR  /f "delims=" %%i in ('dir .git /ad /b /s') do cd %%~dpi && git gc
 