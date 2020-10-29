<template>
	<div class="test">
		<p>{{ $route.path }}</p>
		<p>{{ $route.fullPath }}</p>
	</div>
</template>
<script>
export default {
	data: function() {
		return {};
	},
	created() {
		//重写当前页面的菜单路由
		//this.$parent.customMenuId = this.$route.fullPath;
	}
};
</script>
<style lang="less" scoped>
.test {
	padding: 50px;
	font-size: 30px;
}
</style>
