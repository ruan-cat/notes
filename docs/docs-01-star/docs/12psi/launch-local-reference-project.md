# 启动本地参考项目

## 启动后端服务+默认打包好的前端

根据 01 星球提供的参考项目压缩文件，按照以下步骤启动：

1. 阅读 `package\dky-psi\database\README.md` 文档，本地运行 `package\dky-psi\database\dky_init.sql` 文件，初始化数据库。
2. 阅读 `package\dky-psi\ReadME.md` 文档，确定自己不需要更改什么启动配置。
3. 运行 `package\dky-psi\run.bat` ，弹出两个 cmd 窗口。说明正常启动了 php 和 nginx 服务。
4. 阅读 `package\ReadME.md` 文档，在浏览器访问 http://localhost:8080 即可，输入对应的账号密码。
5. 完成。

![2025-10-12-10-13-30](https://gh-img-store.ruan-cat.com/img/2025-10-12-10-13-30.png)

## 启动后端服务+自己的前端服务

1. 在已经跑起来本地后端服务的前提下，后端服务在 8080 。
2. 直接克隆 https://gitee.com/diankeyun/erp-community 项目，用 npm 安装前端项目依赖。
3. 修改本地前端的 baseUrl，读取为本地后端地址，在我这里的情况是 http://localhost:8080/ 。

![2025-10-12-11-34-38](https://gh-img-store.ruan-cat.com/img/2025-10-12-11-34-38.png)

4. 运行本地前端，在 8081 端口访问项目。按照数据库提供的账密登录即可访问本地前端。

![2025-10-12-11-34-54](https://gh-img-store.ruan-cat.com/img/2025-10-12-11-34-54.png)

5. 验证本地前端热更新是否生效，修改 src\views\Home.vue 的文本。

![2025-10-12-11-35-11](https://gh-img-store.ruan-cat.com/img/2025-10-12-11-35-11.png)

6. 可以即可修改，证明前端本地服务流程可用。

![2025-10-12-11-35-25](https://gh-img-store.ruan-cat.com/img/2025-10-12-11-35-25.png)
