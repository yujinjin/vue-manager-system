<template>
	<div class="customer-menu">当前页面的路由不属于配置菜单中的任何一个路由，所以需要手动指定属于哪个菜单的配置。最好是定位到父级菜单就可以了</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	created() {
		// 指定菜单名称
		this.$parent.customMenuName = "Demo";
	}
};
</script>
<style lang="less" scoped>
.customer-menu {
	padding: 40px;
	font-size: 15px;
}
</style>
