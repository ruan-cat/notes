# pip

## 常用命令？

## 命令行指令参数加上等号？

如下命令：

```bash
pip install requests -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
pip3 install -r requirements.txt  -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com
```

这些参数可以加上等号么？可以实现清晰的赋值么？

## pip 包依赖缓存

### 查看 pip 缓存的存储位置和存储大小

目前不能在 powershell 内看到 pip 包。

![2023-06-25-11-32-47](https://gh-img-store.ruan-cat.com/img/2023-06-25-11-32-47.png)

仅能在 Anaconda Powershell Prompt 内看到 pip 包。使用以下[命令](https://pip.pypa.io/en/stable/cli/pip_cache/#usage)查看到 pip 的缓存目录。

```bash
pip cache dir
```

如下图所示：

![2023-06-25-11-33-29](https://gh-img-store.ruan-cat.com/img/2023-06-25-11-33-29.png)

存储在 C 盘：

```bash
(base) PS C:\Users\ruanzhongnan> pip cache dir
c:\users\ruanzhongnan\appdata\local\pip\cache
(base) PS C:\Users\ruanzhongnan>
```

使用 SpaceSniffer 也能看到 pip 缓存占用的空间很大，约为 5.1G

![2023-06-25-11-36-40](https://gh-img-store.ruan-cat.com/img/2023-06-25-11-36-40.png)

### 配置缓存位置

- https://www.cnblogs.com/lehoso/p/15550091.html

在 C:\Users\ruanzhongnan\AppData\Roaming\pip 内找到了 pip.ini 配置文件。

使用命令手动配置存储的缓存，存储到其他位置：

```bash
pip config set global.cache-dir "D:\store\pip-pkg-install-cache"
```

如下图所示：

![2023-06-25-11-46-04](https://gh-img-store.ruan-cat.com/img/2023-06-25-11-46-04.png)

如期望所示，pip.ini 配置文件被修改了。

![2023-06-25-11-46-38](https://gh-img-store.ruan-cat.com/img/2023-06-25-11-46-38.png)

最后按照参考资料，手动剪切缓存到新目录下。
