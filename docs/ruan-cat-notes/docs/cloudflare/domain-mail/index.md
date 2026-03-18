<script setup>
import RoutingEmailList from "./routing-email-list.vue";
</script>

# 基于 cloudflare 的域名邮箱，无限邮箱

使用域名，实现无限邮箱的制作。并实现邮件转发。基于 cloudflare 提供的邮件路由实现。

## 动机

用于实现无限量的邮箱，用于申请注册大量的账号。比如申请账号实现注册 cursor，大量试用 cursor 的新用户。

或者其他需要无限邮箱申请新账号白嫖的场景。

## 参考资料

- https://juejin.cn/post/7493720445750034470#heading-6

## 个人自己申请的全部邮箱

<demo vue="./routing-email-list.vue" />
<!-- <ClientOnly>
	<div class="vp-raw">
		<RoutingEmailList />
	</div>
</ClientOnly> -->
