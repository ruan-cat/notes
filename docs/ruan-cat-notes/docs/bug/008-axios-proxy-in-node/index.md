# axios 在 node 环境请求失败的 bug

因为 axios 默认走代理了，所以导致 bug。以后配置 axios 时，都要主动地配置 `proxy: false` 取消代理。

<<< ./axios.ts#snipaste{ts twoslash}
