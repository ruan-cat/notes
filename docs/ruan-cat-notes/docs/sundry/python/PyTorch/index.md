# PyTorch

应 yolov5 的 github 中文教程要求，额外安装 pytorch。

## cuda + pytorch ？

应要求升级 cuda

升级英伟达显卡驱动并升级 CUDA 到较高的版本

参考资料
https://zhuanlan.zhihu.com/p/349729620

## 安装命令

根据[官网](https://pytorch.org/get-started/locally/)的要求生成的命令。

```bash
conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia
```

根据[文章](https://blog.csdn.net/didiaopao/article/details/119787139)所述，这里移除掉多余的内容：

```bash
conda install pytorch torchvision torchaudio pytorch-cuda=11.7
```

![2023-05-22-15-52-11](https://gh-img-store.ruan-cat.com/img/2023-05-22-15-52-11.png)

```bash
PackagesNotFoundError: The following packages are not available from current channels:

  - pytorch-cuda=11.7
  - torchaudio
```

称镜像源找不到指定依赖包，需要拓展镜像源。

- pytorch-cuda=11.7
- torchaudio

https://anaconda.org

根据[文章](https://blog.csdn.net/weixin_45552562/article/details/109668589)的做法：

```bash
conda config --append channels conda-forge
```

仍旧不行。出错。

### 尝试更换命令

安装 11.8 版本，而不是 11.7 版本

```bash
conda install pytorch torchvision torchaudio pytorch-cuda=11.8
```

新错误如下：

```bash
(rpytorch) C:\Users\ruanzhongnan>conda install -c pytorch pytorch-cuda
Collecting package metadata (current_repodata.json): done
Solving environment: failed with initial frozen solve. Retrying with flexible solve.
Solving environment: failed with repodata from current_repodata.json, will retry with next repodata source.
Collecting package metadata (repodata.json): done
Solving environment: failed with initial frozen solve. Retrying with flexible solve.
Solving environment: /
Found conflicts! Looking for incompatible packages.
This can take several minutes.  Press CTRL-C to abort.
failed

UnsatisfiableError:
```

尝试了很多方式更改。目前卡在这里。就是安装不成功。

### 尝试更换命令-2

根据[参考资料](https://www.bilibili.com/video/BV1S5411X7FY?p=26)，自己写 conda 安装命令如下：

#### pytorch 2.0.1

```bash
conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/win-64/
```

#### pip 增加指定镜像

上述命令仍旧非常缓慢，这里考虑使用[网课](https://www.bilibili.com/video/BV1S5411X7FY?p=27)所述的 pip3 来完成：

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

#### pip 本地安装

pip3 仍旧出现错误。接下来参考本地安装。根据[教程](https://blog.csdn.net/qq_45704942/article/details/114647667)在 conda 环境内 pip3 指定安装相对路径文件。

经过版本确定，下载此文件。[torch-2.0.1+cu118-cp38-cp38-win_amd64.whl](https://download.pytorch.org/whl/cu118/torch-2.0.1%2Bcu118-cp38-cp38-win_amd64.whl)。

本地安装命令：

```bash
pip3 install D:\temp-store\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

```bash
pip install D:\temp-store\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

#### pip 嵌入到 conda 的 pkg 文件夹内安装

上述命令出错，总是默认走镜像：

```bash
Looking in indexes: https://mirrors.ustc.edu.cn/pypi/web/simple
Processing d:\temp-store\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
WARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))': /pypi/web/simple/typing-extensions/
WARNING: Retrying (Retry(total=3, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))': /pypi/web/simple/typing-extensions/
WARNING: Retrying (Retry(total=2, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))': /pypi/web/simple/typing-extensions/
WARNING: Retrying (Retry(total=1, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))': /pypi/web/simple/typing-extensions/
WARNING: Retrying (Retry(total=0, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))': /pypi/web/simple/typing-extensions/
Could not fetch URL https://mirrors.ustc.edu.cn/pypi/web/simple/typing-extensions/: There was a problem confirming the ssl certificate: HTTPSConnectionPool(host='mirrors.ustc.edu.cn', port=443): Max retries exceeded with url: /pypi/web/simple/typing-extensions/ (Caused by SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))) - skipping
ERROR: Could not find a version that satisfies the requirement typing-extensions (from torch) (from versions: none)
ERROR: No matching distribution found for typing-extensions
Could not fetch URL https://mirrors.ustc.edu.cn/pypi/web/simple/pip/: There was a problem confirming the ssl certificate: HTTPSConnectionPool(host='mirrors.ustc.edu.cn', port=443): Max retries exceeded with url: /pypi/web/simple/pip/ (Caused by SSLError(SSLEOFError(8, 'EOF occurred in violation of protocol (_ssl.c:1131)'))) - skipping
```

根据[教程](https://blog.csdn.net/MRMOUNTAI/article/details/111544211)写的命令：

```bash
conda install --use-local D:\dev-evn\anaconda\pkgs\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

```bash
pip install D:\dev-evn\anaconda\pkgs\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

#### 重新 cd 到绝对路径内再实行

出错，还是在查询远程的东西，而不是本地安装：

```bash
Collecting package metadata (current_repodata.json): done
Solving environment: failed with initial frozen solve. Retrying with flexible solve.
Collecting package metadata (repodata.json): done
Solving environment: failed with initial frozen solve. Retrying with flexible solve.

PackagesNotFoundError: The following packages are not available from current channels:

  - \dev-evn\anaconda\pkgs\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl

Current channels:

  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/noarch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/noarch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/noarch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/noarch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/noarch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/noarch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/win-64
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/noarch
  - https://repo.anaconda.com/pkgs/main/win-64
  - https://repo.anaconda.com/pkgs/main/noarch
  - https://repo.anaconda.com/pkgs/r/win-64
  - https://repo.anaconda.com/pkgs/r/noarch
  - https://repo.anaconda.com/pkgs/msys2/win-64
  - https://repo.anaconda.com/pkgs/msys2/noarch

To search for alternate channels that may provide the conda package you're
looking for, navigate to

    https://anaconda.org

and use the search bar at the top of the page.
```

根据[教程](https://zhuanlan.zhihu.com/p/107487229)，新的命令为：

- [Anaconda Prompt 切换路径/工作目录](https://blog.csdn.net/qq_39691492/article/details/120409839)

```bash
conda install --use-local torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

仍旧出错，仍旧在查询远程镜像。

#### 进入终端改文件存储

- [用 Anaconda 安装本地 python 包](https://www.cnblogs.com/bjwu/p/9225479.html)

根据资料改的命令：

```bash
pip install ./anaconda/pkgs/torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

```bash
pip install torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

```bash
pip install ./torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

```bash
pip install ./dev-evn/anaconda/pkgs/torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

失败。要么查询不到文件，要么还是走镜像。

#### pip install 安装指定版本或本地 WHL 文件

- [pip install 安装指定版本或本地 WHL 文件](https://zhuanlan.zhihu.com/p/372290278)

```bash
pip install --user ./dev-evn/anaconda/pkgs/torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

#### 关闭 v2rayN 翻墙节点 再次本地安装

```bash
pip install D:\dev-evn\anaconda\pkgs\torch-2.0.1+cu118-cp38-cp38-win_amd64.whl
```

成功。

![2023-05-23-16-39-29](https://gh-img-store.ruan-cat.com/img/2023-05-23-16-39-29.png)

初步结论。在已经安装好清华镜像的情况下，就不要再翻墙了。

## 验证

- https://www.bilibili.com/video/BV1S5411X7FY?p=28

```python
import torch
torch.cuda.is_available()
```

## cuda toolkit ？

执行以下命令，出错，找不到内容

```bash
nvcc --version
```

历史下载版本：

https://developer.nvidia.com/cuda-toolkit-archive

CUDA Toolkit 安装教程（Windows）
值得注意的是，包括了环境变量等内容。

https://blog.csdn.net/qq_42951560/article/details/116131410

## 尝试实现 docker 镜像安装 pytorch 环境

bing keys：

docker Python 机器学习环境搭建 最佳实践
