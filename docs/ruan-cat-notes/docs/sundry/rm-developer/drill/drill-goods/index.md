<script setup >
// import DrillGoods from "@docs/rm-developer/drill/drill-goods/DrillGoods.vue";
</script>

# 钻头的商品管理页面

## 业务需求

突然有个想法，小爱丽丝卖三种药水，100 块的小型药水，200 块的中型药水，300 块的大型药水，

周一周二打折小型药水和土豆一起打折卖 20 块，
周三周四中型药水和橘子一起打折卖 20 块，
周五周六周日大型药水和葡萄一起打折卖 20 块，

这样玩家会从“我是否应该买药水”变成“今天买小型药水便宜，隔几天大型药水赚大便宜”的思维

## 业务设计

- 商品单品管理
- 套餐组合管理

## 实现方案

直接在 vuepress-theme-hope 内注册组件，直接在本 md 页面引入文件，直接实现一个简单的，可以交互的 demo。就用 element-plus 组件库。

## 语法参考资料

- https://theme-hope.vuejs.press/zh/cookbook/customize/component.html

## 可交互案例

<demo vue="./DrillGoods.vue" />
<!-- <ClientOnly>
	<DrillGoods />
</ClientOnly> -->
