# `<el-input>` 输入框组件

## 限定输入框组件仅能输入数字

目前的最佳实践：

- https://github.com/ElemeFE/element/issues/14330#issuecomment-1286585815

总有不同的需求的，这里简单罗列针对 el-input 组件输入数字的常见需求，以及出现的各种技术困境。

## 输入的过程中仅能输入数字

## 仅能小数

## 仅能整数

## 仅能输入有意义的货币值

## 在校验的时候提示用户不允许输入数字

## 直接就不允许用户输入任何非数字

## 不能输入小数点

## 不能输入负号

## 配置尽可能简单

## 当前的最佳实践

```html
<el-input type="number" v-model.number="amount"></el-input>
```

```scss
.el-input /deep/ input::-webkit-inner-spin-button {
	display: none !important;
}
```

尽管官方 issue 称，该组件不能使用 v-model 的 number 修饰符。但是作为 vue 本身就具有的 v-model 功能，我们应该要直接使用。

注意两个细节，我们同时使用：

- v-model 的 number 修饰符。
- `<input>` 标签原生的 type="number"。

使用该写法后，不容易出现混乱和错误。就目前来说是如此的。
