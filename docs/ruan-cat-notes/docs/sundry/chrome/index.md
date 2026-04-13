# chrome 浏览器

## 常用快捷键

- 清除浏览器缓存： `Ctrl+Shift+Del`

## 谷歌浏览器，去掉 http 不安全的下载限制

- https://blog.csdn.net/sunny_day_day/article/details/135084250

默认使用最新版本的谷歌浏览器，步骤如下：

1. 进入 chrome://flags/
2. 搜索词条`Warn on insecure downloads`。
3. 勾选为`Disabled`。
4. 按照提示重启浏览器即可。

## 在 360 浏览器内恢复误点击取消而导致无法实现网站打开本地应用的情况

本地电脑应用，在需要完成登录时，需要进入浏览器来登录，这个时候需要反向的允许浏览器打开本地应用，这会申请当前网站打开本地应用的权限，会打开一个弹框索要永久的权限。但是我误点击取消按钮，结果导致我再也没办法授权打开本地应用了。

我单独换了别的浏览器，才能复现以下的弹框：

> ![2026-04-13-10-50-29](https://gh-img-store.ruan-cat.com/img/2026-04-13-10-50-29.png)

---

用相当脏的方式来解决，首先定位本地数据存储到那个文件夹内。

- chrome://settings/advanced

如图，定位到本地数据在 `F:\common\360-fast-browser\360ChromeX\Chrome\User Data\Default` 目录内，

> ![2026-04-13-10-53-17](https://gh-img-store.ruan-cat.com/img/2026-04-13-10-53-17.png)

---

然后用 vscode 打开 `F:\common\360-fast-browser\360ChromeX\Chrome\User Data\Default` 目录，直接搜索 `js.design` 这个误点击取消授权的站点。将本地应用权限从 false 换成 true。

为了让这个配置生效，我不得不重启电脑，在不打开浏览器的情况下，先修改配置，然后再打开浏览器。否则数据修改失败，总是被覆写。

```json
{
	"https://js.design": {
		"login-empower": true
	}
}
```

> ![2026-04-13-10-54-17](https://gh-img-store.ruan-cat.com/img/2026-04-13-10-54-17.png)

---

最后成功实现浏览器打开本地应用。
