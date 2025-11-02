# 更新底部依赖触发上层依赖更新

配置 `updateInternalDependents` 和 `onlyUpdatePeerDependentsWhenOutOfRange` 即可。

值得注意的是，这个配置现在是普遍关闭的，因为大家很不喜欢这种发版版本号变更策略，因为版本号变更过于频繁，而且语义化不强。

除非需要做到那种强制通知的效果，才需要这种配置。

核心配置如下：

<<< ./config.json

## 专门的博客文章

[点此阅读专门对外发文的文章](../../../posts/2025-11-2-changeset-config-updateInternalDependents/index.md)。
