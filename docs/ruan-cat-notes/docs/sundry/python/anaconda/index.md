# anaconda

## 初始化？

- https://zhuanlan.zhihu.com/p/459601766

## anaconda 和 conda

anaconda 是平台。conda 是环境。不过在目前的笔记中，默认把 anaconda 和 conda 混称，相互指代。

## 安装

### 参考资料

- [python 最详细的安装与完全卸载](https://blog.csdn.net/hgnuxc_1993/article/details/114675594)

### 官网下载

### 手动删除之前自己安装的 python 环境

需要指定版本。先去官网下载指定版本的安装包，然后再用安装包来卸载。下载安装包的目的是为了卸载。

查看本机的 python 环境。必须写成大写。

```bash
python -V
```

### 安装校验

```bash
conda --version
conda info
```

如果校验失败，就自己手动配置以下的环境变量。按照参考资料做即可。

### 环境变量

```bash
D:\dev-tool\Anaconda\Anaconda3
D:\dev-tool\Anaconda\Anaconda3\Scripts
```

### 解决 .condarc 文件找不到的问题

- https://blog.csdn.net/ljx0951/article/details/104121844

如下图，看不到 .condarc 文件：

![2023-06-15-14-57-20](https://gh-img-store.ruan-cat.com/img/2023-06-15-14-57-20.jpg)

运行一次 conda config 命令：

![2023-06-15-14-58-09](https://gh-img-store.ruan-cat.com/img/2023-06-15-14-58-09.jpg)

好了。可以看到了：

![2023-06-15-14-58-37](https://gh-img-store.ruan-cat.com/img/2023-06-15-14-58-37.jpg)

### 镜像配置 .condarc 文件

用`conda info`获取到 .condarc 配置文件的路径，手动配置镜像。

文件路径

```bash
C:\Users\ruanzhongnan\.condarc
```

原来的配置

```yaml
channels:
  - https://mirrors.bfsu.edu.cn/anaconda/cloud/pytorch/
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/free/
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/main/
  - defaults
show_channel_urls: true
```

按照教程填写的配置。换成国内的清华大学镜像。

```yaml
channels:
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
  - http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - defaults
show_channel_urls: true
```

根据[文章](https://blog.csdn.net/weixin_42001274/article/details/127209878)增加额外的镜像，

```bash
conda config --add channels https://mirrors.bfsu.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.bfsu.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.bfsu.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.bfsu.edu.cn/anaconda/cloud/bioconda/
conda config --add channels http://mirrors.aliyun.com/anaconda/cloud/bioconda/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
```

## 基础命令

官方参考资料：

- [Command reference](https://docs.conda.io/projects/conda/en/latest/commands.html)

### 版本

```bash
conda --version
```

### 基础信息

```bash
conda info
```

### 查看配置信息

```bash
conda config --show
```

### 查看通道地址

```bash
conda config --show channels
```

### 查看所有虚拟环境

```bash
conda env list
```

### 新建环境

```bash
conda create -n 环境名 python=3.7
```

这里举例为新建的 anaconda 的环境的 python 版本指定为 3.7 。

### ？？ 有疑惑

```bash
conda config --append channels conda-forge
```

## 常用环境

```bash
conda activate pytorch
```

## 常见错误

### PackagesNotFoundError: The following packages are not available from current channels

```bash
PackagesNotFoundError: The following packages are not available from current channels:

  - pytorch-cuda=11.7
  - torchaudio
```

参考资料

https://blog.csdn.net/weixin_45552562/article/details/109668589

## 重新安装用于 pytorch 的环境

参考资料

- https://www.bilibili.com/video/BV1S5411X7FY?p=22

```bash
conda create -n pytorch python=3.8 -c  https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
```
