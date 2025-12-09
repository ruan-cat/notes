# yolov5

## 快速入门？

一次性完成全部的环境搭建？

- https://www.bilibili.com/video/BV1pP41137r1/
  这个教程太简陋了，什么都说不清楚。

- https://www.bilibili.com/video/BV1f44y187Xg/
  附带有 csdn 文章的教程，正在看。
  放弃了。不敢看了。太简短，也没有说明清楚更多细节。PyTorch 怎么成功安装的。都没说清楚。

- https://www.bilibili.com/video/BV1S5411X7FY/
  郭睿提供的教程。初步完成 pytorch 环境搭建。

## 官方教程

https://github.com/ultralytics/yolov5/blob/master/README.zh-CN.md

## 初始化 具体实践

### 安装依赖

在 anaconda prompt 内进入到特定的目录内，然后开始输入命令安装。

![2023-05-22-11-28-46](https://gh-img-store.ruan-cat.com/img/2023-05-22-11-28-46.png)

称版本不满足。这里暂时跳过，到下一步骤。

![2023-05-22-11-32-58](https://gh-img-store.ruan-cat.com/img/2023-05-22-11-32-58.png)

### 权重文件？

## linux 环境下常用的命令行

```bash
conda activate pytorch
cd /home/ai_rzn/code/yolov5-master/
nohup python train.py &
```

查看指定用户的进程

```bash
ps -u root
```

在指定目录内，查看日志。这里默认特指 /home/ai_rzn/code/yolov5-master/ 目录

```bash
cat nohup.out
```

### 常用的路径

/home/ai_rzn/code/yolov5-master/business/person-drop-litter/

/home/ai_rzn/code/yolov5-master/

## yolo 训练速度慢

## 错误

### NotImplementedError: Could not run 'torchvision::nms' with arguments from the 'CUDA' backend

- [解决“NotImplementedError: Could not run ‘torchvision::nms‘ with arguments from the ‘CUDA‘ backend.”](https://blog.csdn.net/weixin_51179975/article/details/119082342)

- [Getting "NotImplementedError: Could not run 'torchvision::nms' with arguments from CUDA backend" despite having all necessary libraries and imports](https://stackoverflow.com/questions/75103127/getting-notimplementederror-could-not-run-torchvisionnms-with-arguments-fr)

- [NotImplementedError: Could not run 'torchvision::nms' with arguments from the 'CUDA' backend.](https://github.com/ultralytics/yolov5/issues/6205)

#### 本地包冲突 重装 pytorch

删除包

```bash
pip uninstall torch torchvision torchaudio
```

重新安装，不走任何节点加速

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### AssertionError: train: No labels found in XXXXX\train.cache, can not start training

因为文件组织格式错了，文件夹名称应该是强约束的。

- [一文彻底解决 YOLOv5 训练找不到标签问题](https://blog.csdn.net/IYXUAN/article/details/124339385)

### 无法使用 device 参数实现 GPU 训练 重装 pytorch

这里先新建一个新的环境，在新的环境内安装，自己挑选的，低版本的安装命令如下：

```bash
conda install pytorch==1.12.0 torchvision==0.13.0 torchaudio==0.12.0 cudatoolkit=11.6
```

```bash
pip install torch==1.12.0+cu116 torchvision==0.13.0+cu116 torchaudio==0.12.0 --extra-index-url https://download.pytorch.org/whl/cu116
```

这里最终选择的是 pip 命令，结果如下：

![2023-05-24-17-34-44](https://gh-img-store.ruan-cat.com/img/2023-05-24-17-34-44.png)

出现错误：

```bash
ERROR: pip's dependency resolver does not currently take into account all the packages that are installed. This behaviour is the source of the following dependency conflicts.
imgviz 1.7.2 requires matplotlib, which is not installed.
imgviz 1.7.2 requires PyYAML, which is not installed.
labelme 5.2.0.post4 requires colorama, which is not installed.
labelme 5.2.0.post4 requires matplotlib, which is not installed.
labelme 5.2.0.post4 requires PyYAML, which is not installed.
labelme 5.2.0.post4 requires qtpy!=1.11.2, which is not installed.
```

尝试手动安装，但是无法保证版本对应

```bash
pip install matplotlib PyYAML colorama qtpy!=1.11.2
```

### AssertionError: Invalid CUDA '--device 1' requested, use '--device cpu' or pass valid CUDA device(s)

- [解决：AssertionError: CUDA unavailable, invalid device gpu requested](https://blog.csdn.net/qq_42709514/article/details/121168753)

### linux 服务器运行出错

```bash
(pytorch) [root@localhost yolov5-master]# python train.py
Traceback (most recent call last):
  File "/home/ai_rzn/code/yolov5-master/train.py", line 33, in <module>
    import yaml
ModuleNotFoundError: No module named 'yaml'
```

## 早停机制（Early Stopping）

- https://blog.csdn.net/flyfish1986/article/details/120163286

```bash
Stopping training early as no improvement observed in last 100 epochs. Best results observed at epoch 110, best model saved as best.pt. To update EarlyStopping(patience=100) pass a new patience value, i.e. `python train.py --patience 300` or use `--patience 0` to disable EarlyStopping.
```

## 数据增强

- https://blog.csdn.net/flyfish1986/article/details/119968461

对于 yolov8，这里也借用和 yolov5 相同的参数。
