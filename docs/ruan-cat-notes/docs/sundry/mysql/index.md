# mysql 数据库

我是前端，仅仅是按需学习部分的 mysql 知识点

## 解决：管理员身份运行 cmd 出现 mysql : 无法将“mysql”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次

- https://blog.csdn.net/weixin_43897803/article/details/107550000

按照教程，配置好全局的环境变量即可。

![2025-10-12-09-40-09](https://gh-img-store.ruan-cat.com/img/2025-10-12-09-40-09.png)

## 终极解决 mysql8.0 ERROR 1045 (28000): Access denied for user ‘ODBC‘@‘localhost‘ (using password: NO)

- https://blog.csdn.net/m0_47505062/article/details/122342121

手动新建 `my.ini` 文件即可：

![2025-10-12-09-49-02](https://gh-img-store.ruan-cat.com/img/2025-10-12-09-49-02.png)

```txt
[mysql]
user=root
password=123456
```
