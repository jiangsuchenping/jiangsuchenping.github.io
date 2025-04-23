:: 设置当前脚本所在目录为变量
set currentDir=%~dp0
:: 切换到当前脚本所在目录
cd %currentDir%
:: 执行 git gc 命令进行垃圾回收
git gc
