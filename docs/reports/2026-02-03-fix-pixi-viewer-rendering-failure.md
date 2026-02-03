# 2026-02-03 修复 PixiViewer 圆柱体渲染严重故障复盘

## 1. 背景

在 `DrillMikuPixi.vue` 组件中，用户反馈上传图片后无法正常显示圆柱体效果，仅显示为“一条黑线”或“微小的黑色细线”，且图片存在严重的扭曲和比例失调。经过排查，该组件的 `createCylinderPlane` 函数在网格构建、坐标变换、纹理映射及阴影处理等多个环节均存在严重的逻辑错误。

## 2. 故障现象与原因分析

本次故障并非单一原因造成，而是多个严重的逻辑缺陷叠加的结果。

### 2.1. 核心故障：网格拓扑撕裂（导致“黑线”或“一团糟”）

*   **现象**：图片无法展开为圆柱面，视觉上坍缩或缠绕。
*   **代码逻辑错误**：
    ```typescript
    const segmentsX = 40;
    // 错误：分段数为 40 时，需要 41 个顶点来定义这些段
    const plane = new PIXI.MeshPlane({ texture, verticesX: segmentsX, ... });

    // 后续循环逻辑
    const cols = segmentsX + 1; // 41
    const colIndex = vertexIndex % cols; // 模 41
    ```
*   **深度分析**：`MeshPlane` 被初始化为 40 个顶点（列），但后续的数学变换逻辑是按照 41 个顶点（列）来计算 UV 和坐标的。这导致了严重的**越界和回绕（Off-by-one Error）**。
    *   第 1 行的最后一个点（Index 39）本应在右侧，但第 2 行的第一个点（Index 40）被错误地计算为第 1 行的“第 41 个点”（实际上并不存在于第 1 行），导致网格在行与行之间发生了错误的拓扑连接。
    *   结果是圆柱体的左边缘和右边缘被错误地缝合在一起，甚至在内部发生穿插，导致图形完全不可读。

### 2.2. 定位故障：坐标系混淆（导致“内容消失”）

*   **现象**：修复网格后，内容依然不可见，或位于屏幕边缘。
*   **代码逻辑错误**：
    ```typescript
    // 错误：试图混合使用 原始宽度(0..W) 和 中心化坐标(-R..R) 的逻辑
    plane.x = -imgWidth / 2 + (imgWidth - (radius * 2)) / 2;
    plane.pivot.set(imgWidth / 2, imgHeight / 2);
    ```
*   **深度分析**：
    *   代码在 `for` 循环中手动修改了顶点数据 (`data[i] = cylinderX`)，将 X 坐标重置为以 0 为中心 (`[-R, R]`)。
    *   然而，`plane.x` 和 `plane.pivot` 的计算逻辑却依然假设顶点坐标是基于原始纹理尺寸 (`[0, imgWidth]`) 的。
    *   **计算复盘**：
        *   Pivot X 设为 `W/2` (比如 400)。
        *   顶点 X 均值为 0。
        *   本地渲染位置 = `0 - 400 = -400`。
        *   `plane.x` 再次减去了 `W/2` 附近的数值。
        *   最终结果导致整个 Mesh 被绘制在画布左侧极远的位置（例如 X = -600），完全超出了 800px 宽度的画布可视范围。

### 2.3. 畸变故障：魔法数字导致拉伸（导致“扭曲”）

*   **现象**：图片看起来变宽了，人物变胖。
*   **代码逻辑错误**：
    ```typescript
    // 错误：人为引入 1.2 倍系数
    const radius = (imgWidth / Math.PI) * 1.2;
    ```
*   **深度分析**：
    *   圆柱体表面的弧长公式为 `Arc = PI * r`。
    *   若要 1:1 映射图片宽度 `W`，则 `W = PI * r` => `r = W / PI`。
    *   原代码乘以 `1.2`，使得圆柱体表面积比图片宽 20%。当图片纹理映射上去时，不得不横向拉伸以覆盖更大的面积，导致严重的宽高比失真。

### 2.4. 阴影故障：属性覆盖导致坍缩（导致“微小黑线”）

*   **现象**：图片中央出现一条 1 像素高的黑色细线。
*   **代码逻辑错误**：
    ```typescript
    shadow.height = height;       // 1. 设置 Scale Y 为 height (假设 600)
    shadow.scale.y = 0.85;        // 2. 错误：直接覆写 Scale Y 为 0.85
    ```
*   **深度分析**：
    *   PixiJS 的 `height` setter 本质上是修改 `scale.y`。
    *   代码本意是“将高度缩放为原来的 0.85 倍”。
    *   但实际执行顺序导致 `scale.y` 被重置为绝对值 `0.85`。
    *   由于阴影纹理本身只有 1px 高，最终渲染出来的阴影高度仅为 `0.85px`。这导致原本应该覆盖圆柱体的阴影，变成了一条横亘在画面中央的黑色细线。

## 3. 修复方案实施

针对上述四个维度的问题，实施了以下修复：

1.  **拓扑修正**：`verticesX` 设置为 `segmentsX + 1`，确保逻辑自洽。
2.  **坐标系重构**：
    *   承认顶点已“中心化”的事实。
    *   将 `plane.x` 设为 0（相对于父容器中心）。
    *   将 `plane.pivot.x` 设为 0（匹配顶点中心）。
    *   仅保留 Y 轴 Pivot 以处理垂直居中。
3.  **比例还原**：移除半径计算中的 `1.2` 系数。
4.  **阴影逻辑修复**：改为 `shadow.height = height * 0.85`，确保相对缩放。
5.  **新增自动缩放**：根据 Mesh 的 Bounds 和 Canvas 尺寸计算缩放比，防止大图溢出。

## 4. 经验教训与反思

### 4.1. 为什么代码会有初始严重问题？
这反映了对底层图形编程（Graphics Programming）逻辑的生搬硬套。原作者（或生成的原始代码）试图组合“网格变形”和“PixiJS容器操作”，但没有统一坐标系标准：
*   **混用坐标系**：在修改底层 Vertex Buffer（局部坐标）的同时，还在使用基于原始尺寸的 Pivot（世界坐标假设），导致精神分裂般的定位逻辑。
*   **缺乏验证**：`* 1.2` 系数和 `scale.y = 0.85` 的写法显示了对 API 行为（尤其是 Setter 的副作用）缺乏深入理解。

### 4.2. 为什么我（AI）没有一次性修好？
在第一次修复中，我陷入了**“管状视野”（Tunnel Vision）**：
*   我敏锐地发现了 `verticesX` 的 Off-by-one 错误，这是导致 crash 或严重拓扑错误的元凶。
*   **由于无法看到渲染结果**，我过度自信地认为“只要拓扑对了，东西就会显示出来”。
*   我忽略了 `plane.x` 那行复杂的计算公式背后隐含的坐标系假设，没有去验算最终的 X 坐标值。
*   对于“黑线”的描述，我首先归因于几何塌缩，而忽略了“阴影 Sprite”这一外部因素可能造成的视觉干扰。

**改进措施**：
1.  **全局验算**：在处理图形渲染问题时，必须手动验算 0 点、Pivot 点和最终 World Transform 坐标，不能只看算法逻辑。
2.  **API 副作用审查**：对于 `width/height` 和 `scale` 这种互相关联的属性，修改时需格外小心其覆盖关系。

日志如下：

```log
[Failure Analysis]
Component: PixiViewer.vue
Severity: Critical (Rendering Failure)
Root Causes:
  1. Topology Mismatch: verticesX(40) != logic_cols(41) -> Mesh tearing.
  2. Coordinate System: Local Vertex(0-centered) vs Pivot(W/2) -> Off-screen rendering.
  3. Aspect Ratio: Radius multiplier 1.2 -> Horizontal stretching.
  4. Sprite Scaling: scale.y overwrite -> 1px height artifact.
Resolution: Refactored mesh generation, normalized coordinate space, corrected math, fixed shadow scaling.
```
