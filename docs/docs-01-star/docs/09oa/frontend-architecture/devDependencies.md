# 开发环境依赖

开发环境依赖非常多，冗杂，混乱。他们是前端百（军）花（阀）齐（割）放（据）的表现。

## 我也来插一脚

这些依赖包是阮喵喵自己做的，用于实现特定的业务需求。不过多介绍。

```json
{
	"@ruan-cat/utils": "^1.1.0",
	"@ruan-cat/vercel-deploy-tool": "^0.1.0",
	"@ruan-cat/vuepress-preset-config": "^0.1.11"
}
```

## eslint 和 prettier

`前端工程化`的一部分。我个人认为是臭名昭著的，这里不过多介绍，请看外链：

- https://notes.ruan-cat.com/eslint/struggle-with-eslint.html

## cz

`前端工程化`的一部分，全称 [commitizen](https://github.com/commitizen/cz-cli)，cz 是其命令行简写。

通过主动运行 commitizen 命令行，在交互式的 cli 内，编写 git commit 提交信息。是帮助我们写出满足常见提交规范的工具。

- https://notes.ruan-cat.com/cz/

## 类型声明库

前端写 typescript 时，要求提供第三方库的类型声明文件。

```json
{
	"@types/eslint-config-prettier": "^6.11.3",
	"@types/lodash": "^4.17.12",
	"@types/lodash-es": "^4.17.12",
	"@types/node": "^22.7.7",
	"@types/qs": "^6.9.16",
	"@types/rollup-plugin-visualizer": "^4.2.4"
}
```

## 其他的东西

### 部署

```json
{
	"vercel": "^37.8.0"
}
```

### node 运行中间件

```json
{
	"tsx": "^4.19.1"
}
```

### 删除文件

```json
{
	"del": "^8.0.0"
}
```

### 控制台输出

```json
{
	"consola": "^3.2.3"
}
```
