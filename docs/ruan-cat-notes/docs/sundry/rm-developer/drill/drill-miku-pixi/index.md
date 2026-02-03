<script setup>
import DrillMikuPixi from './DrillMikuPixi.vue'
</script>

# Pixi.js 半圆柱贴图渲染

通过 Pixi.js 把一张资源图片，渲染到半圆柱的圆面上。

## 效果演示

<DrillMikuPixi />

## 核心原理

要在 2D 屏幕上模拟半圆柱，我们需要修改网格顶点的坐标：

1.  **X轴映射 (Mapping)**: 图片的水平 $x$ 坐标原本是线性的。在圆柱体上，图片是“卷”起来的。
    *   原本的 $0 \rightarrow 1$ (纹理坐标) 对应圆柱的角度 $-\frac{\pi}{2} \rightarrow \frac{\pi}{2}$。
    *   屏幕上的 $x$ 坐标应该是 $R \cdot \sin(\theta)$。
    *   这将导致图像中间宽，两边窄（透视压缩）。
2.  **Y轴透视 (Perspective)**: 为了增加立体感，离屏幕越远（圆柱边缘），图像应该显得稍微小一点（近大远小）。
3.  **光影 (Shading)**: 圆柱体边缘应该比中间暗。我们会通过叠加一层带有透明度渐变的遮罩来实现伪 3D 光照。
