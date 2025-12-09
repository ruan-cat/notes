# turbo 无法添加包到工作区

turbo 报 `Failed to add workspace` 的错误。

运行 turbo 时，识别包的范围深度过深，把一些垃圾 package.json 也识别成工作区了，恰好出现两个包的 name 重名冲突的情况。

## 情况说明

turbo 对 package.json 的识别有误。不应该识别无意义的包。

## 尝试解决

- https://turbo.build/repo/docs/reference/configuration#inputs

## 已处理该 bug

问题的起因是这样的

1. `.vercel/**/package.json`

   > vc 的 build 命令，即 `vc build` 会直接运行 vercel.json 配置的 buildCommand 配置的命令，在目前（2024-10-18）的设计内，该配置为 null，故 vercel 的部署行为会实行静态部署，即把整个目录内的东西全部拷贝下来。会多出一个 `.vercel/**/package.json` 文件，这是符合预期的。

2. `pnpm-workspace.yaml` 的匹配语法变化了

   > 为了适应 `commitlint.config.cjs` 的包索引配置，需要使用该配置提供的 glob 语法，来查询项目内全部的 package.json 包信息。
   >
   > ```yaml
   > packages:
   >   - "packages/**"
   >   - "demos/**"
   > ```
   >
   > 这个包语法是两个星星。查询的是目录内全部深度的，含有 package.json 文件的目录。那么 `.vercel/**/package.json` 也会被索引到。

3. turbo 运行报错
   > 目前我还不清楚 turbo 是怎么处理项目内的 package.json 文件的，不清楚 turbo 会如何使用 `pnpm-workspace.yaml` 提供的查询配置。在更改 glob 语法，更改查询范围时，turbo 就工作正常了。
