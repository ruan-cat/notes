# 自己配置 cursor 的供应商

因为 cursor 的 pro 订阅，每个月只有 20 美元的额度，很快就用完了。所以不得不考虑自己折腾配置。使用自己提供的代理商，进而使用高级模型。

## 用 www.dmxapi.cn 供应商实现自主配置

供应商地址：

- 国内版： https://dmxapi.cn/
- 国际版： https://ssvip.dmxapi.com/

配置 cursor 教程：

- http://doc.dmxapi.cn/cursor.html
- http://cursor.dmxapi.cn/

::: warning 区分清楚供应商的地址

这个供应商是有国内版和国际版两个版本的。使用要注意。

:::

### 供应商文档非常混乱

#### 教程 1

- http://doc.dmxapi.cn/baseurl.html

该供应商有很多域名，注意配置正确的地址。我注册并充值的域名是 `www.dmxapi.cn` ，故尾缀应该选择 cn。

![2025-08-04-15-58-52](https://gh-img-store.ruan-cat.com/img/2025-08-04-15-58-52.png)

根据上述教程和注意事项，实际配置到 cursor 的 url 应为： `https://www.dmxapi.cn/v1` 。

增加 v1 尾缀就错了，无法在 cursor 内完成 key 的校验。

#### 教程 2

根据[常见问题](http://qa.dmxapi.com/)，应该换成 `https://www.dmxapi.cn` ，无尾缀的情况。

![2025-08-04-16-41-03](https://gh-img-store.ruan-cat.com/img/2025-08-04-16-41-03.png)

在 cursor 内我们配置的是 openai 格式的地址，要满足要求才行。

### 根据不同的情况，配置不同的 baseUrl

上述文档确实是很前后矛盾的，经过实验，我们应该这样动态的，手动更改 baseUrl 才行。

分为`验证`和`使用`，两个不同的场景来配置 baseUrl。先验证，后使用。

- key 值验证时 ： https://www.dmxapi.cn
- 使用时 ： https://www.dmxapi.cn/v1

### 增加正确的模型名称

::: details 获取正确的模型名称

- 模型列表： https://www.dmxapi.cn/pricing

用关键词 `DMXAPI` 来搜索。

![2025-08-04-16-16-21](https://gh-img-store.ruan-cat.com/img/2025-08-04-16-16-21.png)

:::

::: warning 国内版域名 `dmxapi.cn` 供应商才需要选择模型

经过国际版的充值和实验，发现仅仅只有国内版的供应商，才需要选择 `DMXAPI` 关键词的模型。

:::

按照以上教程，我们仅仅配置包含 `DMXAPI` 关键词的模型。

- DMXAPI-cls4-0514
- DMXAPI-gem25-0506

### 阶段性总结

1. 供应商还要有两套域名，配置还要看清楚文档做好 baseUrl 区分。
2. 验证和使用 url 还有暗坑，文档看似冲突，实则说的都对。因为文档没说清楚`验证`和`使用`这两个过程是不一样的。
3. 扣费太狠毒。国内版模型运行速度慢，也能用。国际版模型运行速度很快，就是原版的 Anthropic 模型体验。效果非常好，但是扣费也是真的狠毒。

该供应商确实有技术可行性，但是扣费太厉害了。所以没有实用性。
