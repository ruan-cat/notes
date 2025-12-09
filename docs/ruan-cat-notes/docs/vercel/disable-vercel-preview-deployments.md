# 禁用 vercel 的预览部署

<!-- TODO: 润色，并发文到掘金 -->

只要不是主分支的提交，都被认定是`预览分支`的提交。

`预览分支`的提交也是会消耗掉每日额度的。而免费账号的每日免费额度也就 100 次。

而 vercel 项目是**默认开启**对`预览分支`的部署的，只要检测到更改，就开始触发部署。

## 在 vercel 项目配置内手动关闭

1. 在控制台内进入需要被更改的项目。
2. 顶部 tab 栏，选择设置。
3. 左侧侧边栏，选择环境。
4. 顶部下拉单选框，选择预览环境。
5. 第一个选项卡，分支跟踪选项卡，关闭掉对预览分支的跟踪。
6. 记得点击底部的保存按钮。

![2025-09-12-18-27-58](https://gh-img-store.ruan-cat.com/img/2025-09-12-18-27-58.png)

要点击保存按钮才能生效。

![2025-09-12-18-30-53](https://gh-img-store.ruan-cat.com/img/2025-09-12-18-30-53.png)

## 环境变量 ？

## 其他方式

- https://www.cnblogs.com/duanguyuan/p/16126649.html
- https://stackoverflow.com/questions/68232548/how-can-i-stop-vercel-preview-deployments-from-appearing-on-pull-requests
