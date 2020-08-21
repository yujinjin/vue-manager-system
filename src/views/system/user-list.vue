<template>
	<!--
        作者：yujinjin9@126.com
        时间：2019-01-21
        描述：列表查询页
    -->
	<div class="user-list">
		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：列表过滤栏
        -->
		<search-form :searchForm="searchForm" @search="queryList" @change="filterChange"></search-form>
		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：列表操作栏
        -->
		<div class="handle-box">2</div>

		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：数据列表栏
        -->
		<div class="data-table-box">3</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			searchForm: [
				{
					name: "filter",
					label: "系统用户"
				},
				{
					slot: "other"
				}
			]
		};
	},
	methods: {
		init() {}
	}
};
</script>
<style lang="less" scoped></style>
