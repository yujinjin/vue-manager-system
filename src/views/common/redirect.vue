<template>
	<div></div>
</template>
<script>
// 刷新页面（中间页）
export default {
	data() {
		return {};
	},
	created() {
		let route = JSON.parse(this.$route.query.route);
		this.$router.replace(route);
	}
};
</script>