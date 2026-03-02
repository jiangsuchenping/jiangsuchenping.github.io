## 项目说明
开发过程中产生的临时文件都保存到_Temp文件夹中   
Document文件夹记录了需求文档，C:\Git\jiangsuchenping\jiangsuchenping.github.io\LeaveManagementSystem\Document\请假系统.txt为原始需求文档。
Src文件夹记录了源代码，所有源代码都保存在这个目录
Web为最终的H5站点目录，可以使用github pages进行部署，访问 https://jiangsuchenping.github.io/LeaveManagementSystem/web 即可访问最终的H5站点
这是一个H5版的请假系统演示站点，实际演示时对于需要进行写入操作的，都使用页面警告提示的方式提示用户，帮我细化一下上方的需求，并且注意所需数据都使用本地json文件模拟，实际演示时对于需要进行写入操作的，都使用页面警告提示的方式提示用户，代码中注释这段省略了实际业务逻辑，最终可以尽可能接近实际系统，各页面切换逻辑符合系统要求，包括必要的登录、用户管理、角色管理、请假管理（普通员工、人事具有不同的功能）
所需要的第三方库，不要使用CDN，都使用本地文件