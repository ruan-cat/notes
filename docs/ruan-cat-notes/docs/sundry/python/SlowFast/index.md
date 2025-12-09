# SlowFast

## 参考资料

### 官方安装依赖清单表

https://github.com/facebookresearch/SlowFast/blob/main/INSTALL.md

### window 环境安装

- [Win10 配置 SlowFast 全过程并使用 slowfast 进行视频行为识别检测](https://zhuanlan.zhihu.com/p/484637273)

- [[SlowFast 代码复现] 并用自己的视频进行检测](https://blog.csdn.net/weixin_43720054/article/details/126051206)

- [【SlowFast 复现】SlowFast Networks for Video Recognition 复现代码 使用自己的视频进行 demo 检测](https://blog.csdn.net/WhiffeYF/article/details/113527759)

- [三分钟快速安装 facebookresearch SlowFast](https://blog.csdn.net/WhiffeYF/article/details/124727403)

- [Windows10 下 SlowFast 环境安装和运行](https://blog.csdn.net/weixin_39377720/article/details/121403411)

- [行为识别 SlowFast 笔记--环境配置和 Demo 展示](https://blog.csdn.net/weixin_43863869/article/details/129801523)

别人是怎么做的？别人曾遇到了什么坑？别人怎么解决的？

在 window10、云平台、linux 等平台下，运行 slowfast 程序的环境是否正确？

### linux 环境安装

## 新建一个全新的 anaconda 环境

```bash
conda create -n slowfast python=3.8
```

## 安装依赖

### pytorch

```bash
conda install pytorch==1.8.0 torchvision==0.9.0 torchaudio==0.8.0 cudatoolkit=11.1 -c pytorch -c conda-forge
```

### fvcore √

参考资料

- https://blog.csdn.net/weixin_43720054/article/details/126051206#t6
- https://github.com/facebookresearch/fvcore#install

```bash
git clone https://github.com/facebookresearch/fvcore
cd fvcore
python setup.py install
```

[这篇文章](https://blog.csdn.net/hxxjxw/article/details/106433907)称 pip 会下载额外所需的子依赖。根据[官方文章](https://pip.pypa.io/en/stable/cli/pip_install/#description)所述，这里选择本地克隆项目，然后让 pip 自己安装指定包依赖，并首先索引到本地目录做安装。

```bash
git clone https://github.com/facebookresearch/fvcore
pip install -e fvcore
```

使用正确的克隆地址：

```bash
git clone https://github.com/facebookresearch/fvcore.git
pip install -e fvcore
```

### torchvision √

### simplejson √

```bash
pip install simplejson
```

### GCC >= 4.9 √

- [windows 下安装 gcc12（mingw-w64）](https://zhuanlan.zhihu.com/p/565370467)

### PyAV √

```bash
conda install av -c conda-forge
```

这里走清华镜像，故命令为：

```bash
conda install av
```

速度太慢，最终选择 pip

```bash
pip install av
```

### iopath √

```bash
pip install -U iopath
```

### psutil √

```bash
pip install psutil
```

### OpenCV √

```bash
pip install opencv-python
```

pip install tensorboard
pip install pytorchvideo
pip install moviepy
pip install pytorchvideo

### fairscale √

```bash
git clone https://github.com/facebookresearch/fairscale.git
pip install fairscale
```

### cython √

根据[文章](https://blog.csdn.net/weixin_39377720/article/details/121403411)所述，这里的命令为：

```bash
pip install -U cython
```

### Detectron2

开始逐步执行这些语句

```bash
git clone https://github.com/cocodataset/cocoapi.git#subdirectory=PythonAPI
git clone https://github.com/facebookresearch/detectron2 detectron2_repo
```

#### git clone https://github.com/cocodataset/cocoapi.git#subdirectory=PythonAPI

根据[文章所述](https://pip.pypa.io/en/stable/topics/vcs-support/#url-fragments)，这里的命令为：

```bash
pip install -U git+https://github.com/cocodataset/cocoapi.git#subdirectory=PythonAPI
```

出错：

```bash
ERROR: Could not find a version that satisfies the requirement matplotlib>=2.1.0 (from pycocotools) (from versions: none)
ERROR: No matching distribution found for matplotlib>=2.1.0
```

尝试换成：

```bash
git clone https://github.com/cocodataset/cocoapi.git
cd cocoapi/PythonAPI
pip install -U PythonAPI
```

`pip install -U PythonAPI`失败。不存在该依赖包。根据[官方文档](https://pip.pypa.io/en/latest/topics/local-project-installs/#editable-installs)，改写为：

```bash
pip install -e cocoapi/PythonAPI
```

缺少指定版本依赖，根据[官方文档](https://pip.pypa.io/en/latest/cli/pip_install/#examples)，自主编写命令：

```bash
pip install 'matplotlib>=2.1.0'
```

取消翻墙，使用镜像。顺利完成。

再次执行：

```bash
pip install -e cocoapi/PythonAPI
```

出错。尝试换成：

```bash
pip install pycocotools
```

#### git clone https://github.com/facebookresearch/detectron2 detectron2_repo

```bash
pip install -e detectron2_repo
```

顺利完成。

### $PYTHONPATH

```bash
export PYTHONPATH=/path/to/SlowFast/slowfast:$PYTHONPATH
```

根据[参考资料](https://blog.csdn.net/NeverLate_gogogo/article/details/107615838)，自主编写设置临时环境变量：

```bash
set PTYTHONPATH=slowfast
echo %PYTHONPATH%
```

```bash
set PTYTHONPATH=D:\code\web-dev-work-place\github-desktop-store\SlowFast\slowfast
echo %PYTHONPATH%
```

```bash
set PTYTHONPATH=%PYTHONPATH%;D:\code\web-dev-work-place\github-desktop-store\SlowFast\slowfast
echo %PYTHONPATH%
```

无法校验是否正确。跳转到下一个阶段。

### Build PySlowFast

开始构建

```bash
python setup.py build develop
```

根据[文章](https://blog.csdn.net/weixin_43720054/article/details/126051206)，更改文件 setup.py。

顺利。无任何错误。

## 开始运行？

```bash
python tools/run_net.py --cfg configs/Kinetics/C2D_8x8_R50.yaml NUM_GPUS 1 TRAIN.BATCH_SIZE 8 SOLVER.BASE_LR 0.0125 DATA.PATH_TO_DATA_DIR path_to_your_data_folder
```

### 报错 ImportError: DLL load failed while importing \_imaging: 找不到指定的模块

```bash
Traceback (most recent call last):
  File "tools/run_net.py", line 6, in <module>
    from slowfast.utils.misc import launch_job
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\misc.py", line 12, in <module>
    import torchvision.io as io
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torchvision\__init__.py", line 7, in <module>
    from torchvision import datasets
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torchvision\datasets\__init__.py", line 1, in <module>
    from .lsun import LSUN, LSUNClass
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torchvision\datasets\lsun.py", line 2, in <module>
    from PIL import Image
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\PIL\Image.py", line 100, in <module>
    from . import _imaging as core
ImportError: DLL load failed while importing _imaging: 找不到指定的模块。
```

尝试升级

```bash
pip install -U pillow
```

### 报错 ImportError: cannot import name 'cat_all_gather' from 'pytorchvideo.layers.distributed'

```bash
Traceback (most recent call last):
  File "tools/run_net.py", line 6, in <module>
    from slowfast.utils.misc import launch_job
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\misc.py", line 19, in <module>
    import slowfast.utils.logging as logging
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\logging.py", line 15, in <module>
    import slowfast.utils.distributed as du
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\distributed.py", line 12, in <module>
    from pytorchvideo.layers.distributed import (  # noqa
ImportError: cannot import name 'cat_all_gather' from 'pytorchvideo.layers.distributed' (D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\pytorchvideo\layers\distributed.py)
```

根据[issue](https://github.com/facebookresearch/SlowFast/issues/636#issuecomment-1410492746)，处理方式为

```bash
git clone https://github.com/facebookresearch/pytorchvideo.git
cd pytorchvideo
pip install -e .
```

根据上述的操作方式，这里改写为以下命令：

```bash
git clone https://github.com/facebookresearch/pytorchvideo.git
pip install -e pytorchvideo
```

### 报错 ModuleNotFoundError: No module named 'scipy'

```bash
Traceback (most recent call last):
  File "tools/run_net.py", line 6, in <module>
    from slowfast.utils.misc import launch_job
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\misc.py", line 21, in <module>
    from slowfast.datasets.utils import pack_pathway_output
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\datasets\__init__.py", line 4, in <module>
    from .ava_dataset import Ava  # noqa
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\datasets\ava_dataset.py", line 10, in <module>
    from . import transform as transform
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\datasets\transform.py", line 14, in <module>
    from scipy.ndimage import gaussian_filter
ModuleNotFoundError: No module named 'scipy'
```

根据报错，自主安装依赖：

```bash
pip install scipy
```

### ModuleNotFoundError: No module named 'sklearn'

```bash
Traceback (most recent call last):
  File "tools/run_net.py", line 9, in <module>
    from demo_net import demo
  File "D:\code\web-dev-work-place\github-desktop-store\SlowFast\tools\demo_net.py", line 10, in <module>
    from slowfast.visualization.async_predictor import AsyncDemo, AsyncVis
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\visualization\async_predictor.py", line 12, in <module>
    from slowfast.visualization.predictor import Predictor
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\visualization\predictor.py", line 15, in <module>
    from slowfast.visualization.utils import process_cv2_inputs
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\visualization\utils.py", line 8, in <module>
    from sklearn.metrics import confusion_matrix
ModuleNotFoundError: No module named 'sklearn'
```

自主编写的命令

```bash
pip install sklearn
```

根据[文章](https://blog.csdn.net/liupeng19970119/article/details/106456620)得知，sklearn 是 scikit-learn 的缩写，应该改为：

```bash
pip install scikit-learn
```

### RuntimeError: Distributed package doesn't have NCCL built in

注意到 window 必须要用 gloo，linux 用 nccl。

#### try 1

- [Distributed pytorch with mpi](https://discuss.pytorch.org/t/distributed-pytorch-with-mpi/77106)

```bash
git clone --recursive https://github.com/pytorch/pytorch
cd pytorch
pip install numpy ninja pyyaml mkl mkl-include setuptools cmake cffi
```

这里仅且克隆，但是不安装了。发现 git clone pytorch 会下载太多的子模块。很容易导致后续的失败。这里放弃了。

#### try 2

- https://discuss.pytorch.org/t/runtimeerror-distributed-package-doesnt-have-nccl-built-in/176744

```python
import torch
torch.cuda.is_available()
```

```python
import torch
torch.__version__
# '1.8.0+cu111'
torch.cuda.nccl.is_available(torch.randn(1).cuda())
# True
torch.cuda.nccl.version()
```

运行了上述代码，为 false：

```bash
>>> import torch
>>> torch.__version__
'1.8.0'
>>> torch.cuda.nccl.is_available(torch.randn(1).cuda())
D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torch\cuda\nccl.py:16: UserWarning: PyTorch is not compiled with NCCL support
  warnings.warn('PyTorch is not compiled with NCCL support')
False
>>> torch.cuda.nccl.version()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torch\cuda\nccl.py", line 36, in version
    return torch._C._nccl_version()
AttributeError: module 'torch._C' has no attribute '_nccl_version'
```

参考资料的说法无头无尾的。说不清楚到底应该用什么方式处理。都是在分析能不能用，而不是怎么兼容。这个方式不合适，放弃了。

#### try 3

- https://github.com/ray-project/ray_lightning/issues/13

这篇 issue 给出的解决方案是增加环境变量。设置环境变量 PL_TORCH_DISTRIBUTED_BACKEND=gloo

尝试了。效果不好。正如 issue 所述，效果不好。

#### try 4

按照同事郭睿的说法，更改代码。这里先选择在自定义配置内改写为 gloo

D:\code\web-dev-work-place\github-desktop-store\SlowFast\build\lib\slowfast\config\custom_config.py

事实上根本判断不出来，到底是应该在那个地方改动，改成 gloo。内容过多。

### 终止此命令

经过一系列的查询资料。发现在 window 内硬装该项目，太容易暴毙了。环境很不适合。这里考虑参考别人的资料，下载模型权重文件，再看看本地运行效果。

如果情况不好。按照这两个策略来做：

- 笔记本电脑或者是台式机，本地新建 linux 虚拟机，看看是否可以使用到 gpu。在 linux 环境下，再完成 slowfast 的环境搭建和训练。
- 用云服务器搭建。

## 编纂 SLOWFAST_32x2_R101_50_50.yaml

- https://zhuanlan.zhihu.com/p/484637273

教程的配置：

```yaml
TRAIN:
  ENABLE: False
  DATASET: ava
  BATCH_SIZE: 16
  EVAL_PERIOD: 1
  CHECKPOINT_PERIOD: 1
  AUTO_RESUME: True
  # 刚刚下载的官方权重文件的路径
  CHECKPOINT_FILE_PATH: "D:/python/video_classify/SlowFast-main/weights/SLOWFAST_32x2_R101_50_50.pkl" #path to pretrain model
  CHECKPOINT_TYPE: pytorch
DATA:
  NUM_FRAMES: 32
  SAMPLING_RATE: 2
  TRAIN_JITTER_SCALES: [256, 320]
  TRAIN_CROP_SIZE: 224
  TEST_CROP_SIZE: 256
  INPUT_CHANNEL_NUM: [3, 3]
DETECTION:
  ENABLE: True
  ALIGNED: False
AVA:
  BGR: False
  DETECTION_SCORE_THRESH: 0.8
  TEST_PREDICT_BOX_LISTS: ["person_box_67091280_iou90/ava_detection_val_boxes_and_labels.csv"]
SLOWFAST:
  ALPHA: 4
  BETA_INV: 8
  FUSION_CONV_CHANNEL_RATIO: 2
  FUSION_KERNEL_SZ: 5
RESNET:
  ZERO_INIT_FINAL_BN: True
  WIDTH_PER_GROUP: 64
  NUM_GROUPS: 1
  DEPTH: 101
  TRANS_FUNC: bottleneck_transform
  STRIDE_1X1: False
  NUM_BLOCK_TEMP_KERNEL: [[3, 3], [4, 4], [6, 6], [3, 3]]
  SPATIAL_DILATIONS: [[1, 1], [1, 1], [1, 1], [2, 2]]
  SPATIAL_STRIDES: [[1, 1], [2, 2], [2, 2], [1, 1]]
NONLOCAL:
  LOCATION: [[[], []], [[], []], [[6, 13, 20], []], [[], []]]
  GROUP: [[1, 1], [1, 1], [1, 1], [1, 1]]
  INSTANTIATION: dot_product
  POOL: [[[2, 2, 2], [2, 2, 2]], [[2, 2, 2], [2, 2, 2]], [[2, 2, 2], [2, 2, 2]], [[2, 2, 2], [2, 2, 2]]]
BN:
  USE_PRECISE_STATS: False
  NUM_BATCHES_PRECISE: 200
SOLVER:
  MOMENTUM: 0.9
  WEIGHT_DECAY: 1e-7
  OPTIMIZING_METHOD: sgd
MODEL:
  NUM_CLASSES: 80
  ARCH: slowfast
  MODEL_NAME: SlowFast
  LOSS_FUNC: bce
  DROPOUT_RATE: 0.5
  HEAD_ACT: sigmoid
TEST:
  ENABLE: False
  DATASET: ava
  BATCH_SIZE: 8
DATA_LOADER:
  NUM_WORKERS: 2
  PIN_MEMORY: True

NUM_GPUS: 1
NUM_SHARDS: 1
RNG_SEED: 0
OUTPUT_DIR: .
#TENSORBOARD:
#  MODEL_VIS:
#    TOPK: 2
DEMO:
  ENABLE: True
  LABEL_FILE_PATH: "./demo/AVA/ava.json" #刚刚生成的label文件
  INPUT_VIDEO: "./input/1.mp4" #视频输入路径
  OUTPUT_FILE: "./output/1.mp4" #视频输出路径

  DETECTRON2_CFG: "COCO-Detection/faster_rcnn_R_50_FPN_3x.yaml"
  DETECTRON2_WEIGHTS: detectron2://COCO-Detection/faster_rcnn_R_50_FPN_3x/137849458/model_final_280758.pkl
```

当前配置：

```yaml
TRAIN:
  ENABLE: False
  DATASET: ava
  BATCH_SIZE: 16
  EVAL_PERIOD: 1
  CHECKPOINT_PERIOD: 1
  AUTO_RESUME: True
  CHECKPOINT_FILE_PATH: ./SLOWFAST_32x2_R101_50_50.pkl #path to pretrain model
  CHECKPOINT_TYPE: pytorch
DATA:
  NUM_FRAMES: 32
  SAMPLING_RATE: 2
  TRAIN_JITTER_SCALES: [256, 320]
  TRAIN_CROP_SIZE: 224
  TEST_CROP_SIZE: 256
  INPUT_CHANNEL_NUM: [3, 3]
DETECTION:
  ENABLE: True
  ALIGNED: False
AVA:
  BGR: False
  DETECTION_SCORE_THRESH: 0.8
  TEST_PREDICT_BOX_LISTS:
    ["person_box_67091280_iou90/ava_detection_val_boxes_and_labels.csv"]
SLOWFAST:
  ALPHA: 4
  BETA_INV: 8
  FUSION_CONV_CHANNEL_RATIO: 2
  FUSION_KERNEL_SZ: 5
RESNET:
  ZERO_INIT_FINAL_BN: True
  WIDTH_PER_GROUP: 64
  NUM_GROUPS: 1
  DEPTH: 101
  TRANS_FUNC: bottleneck_transform
  STRIDE_1X1: False
  NUM_BLOCK_TEMP_KERNEL: [[3, 3], [4, 4], [6, 6], [3, 3]]
  SPATIAL_DILATIONS: [[1, 1], [1, 1], [1, 1], [2, 2]]
  SPATIAL_STRIDES: [[1, 1], [2, 2], [2, 2], [1, 1]]
NONLOCAL:
  LOCATION: [[[], []], [[], []], [[6, 13, 20], []], [[], []]]
  GROUP: [[1, 1], [1, 1], [1, 1], [1, 1]]
  INSTANTIATION: dot_product
  POOL:
    [
      [[2, 2, 2], [2, 2, 2]],
      [[2, 2, 2], [2, 2, 2]],
      [[2, 2, 2], [2, 2, 2]],
      [[2, 2, 2], [2, 2, 2]],
    ]
BN:
  USE_PRECISE_STATS: False
  NUM_BATCHES_PRECISE: 200
SOLVER:
  MOMENTUM: 0.9
  WEIGHT_DECAY: 1e-7
  OPTIMIZING_METHOD: sgd
MODEL:
  NUM_CLASSES: 80
  ARCH: slowfast
  MODEL_NAME: SlowFast
  LOSS_FUNC: bce
  DROPOUT_RATE: 0.5
  HEAD_ACT: sigmoid
TEST:
  ENABLE: False
  DATASET: ava
  BATCH_SIZE: 8
DATA_LOADER:
  NUM_WORKERS: 2
  PIN_MEMORY: True

NUM_GPUS: 1
NUM_SHARDS: 1
RNG_SEED: 0
OUTPUT_DIR: .
TENSORBOARD:
  MODEL_VIS:
    TOPK: 2
DEMO:
  ENABLE: True

	LABEL_FILE_PATH: "./ava.json" #刚刚生成的label文件
  INPUT_VIDEO: "./input/demo.mp4"			#视频输入路径
  OUTPUT_FILE: "./output/demo.mp4"			#视频输出路径

  DETECTRON2_CFG: "COCO-Detection/faster_rcnn_R_50_FPN_3x.yaml"
  DETECTRON2_WEIGHTS: detectron2://COCO-Detection/faster_rcnn_R_50_FPN_3x/137849458/model_final_280758.pkl
```

执行命令：

```bash
python tools/run_net.py --cfg demo/AVA/SLOWFAST_32x2_R101_50_50.yaml
```

### `_pickle.UnpicklingError: pickle data was truncated`

```bash
Traceback (most recent call last):
  File "tools/run_net.py", line 57, in <module>
    main()
  File "tools/run_net.py", line 53, in main
    demo(cfg)
  File "D:\code\web-dev-work-place\github-desktop-store\SlowFast\tools\demo_net.py", line 114, in demo
    for task in tqdm.tqdm(run_demo(cfg, frame_provider)):
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\tqdm\std.py", line 1178, in __iter__
    for obj in iterable:
  File "D:\code\web-dev-work-place\github-desktop-store\SlowFast\tools\demo_net.py", line 59, in run_demo
    model = ActionPredictor(cfg=cfg, async_vis=async_vis)
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\visualization\predictor.py", line 132, in __init__
    self.predictor = Predictor(cfg=cfg, gpu_id=gpu_id)
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\visualization\predictor.py", line 46, in __init__
    cu.load_test_checkpoint(cfg, self.model)
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\checkpoint.py", line 692, in load_test_checkpoint
    load_checkpoint(
  File "d:\code\web-dev-work-place\github-desktop-store\slowfast\slowfast\utils\checkpoint.py", line 298, in load_checkpoint
    checkpoint = torch.load(f, map_location="cpu")
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torch\serialization.py", line 593, in load
    return _legacy_load(opened_file, map_location, pickle_module, **pickle_load_args)
  File "D:\dev-evn\anaconda\envs\slowfast\lib\site-packages\torch\serialization.py", line 762, in _legacy_load
    magic_number = pickle_module.load(f, **pickle_load_args)
_pickle.UnpicklingError: pickle data was truncated
```

- https://github.com/pytorch/pytorch/issues/18104

根据 issue，

```bash
python tools/run_net.py --cfg demo/AVA/SLOWFAST_32x2_R101_50_50.yaml long_size=8
```

无效。

- https://github.com/pytorch/pytorch/issues/18104#issuecomment-480599656

此讨论说明不要再 window 系统内加载数据。而是在 linux 内就加载。
