@echo off
cd\
FOR  /f "delims=" %%i in ('dir .git /ad /b /s') do cd %%~dpi && git gc
 