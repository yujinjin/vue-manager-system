<template>
	<div class="audit-logs">
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-23
            描述：列表过滤栏
        -->
		<search-form :fields="queryFields" @search="search" @change="filterChange" />

		<!--
            作者：yujinjin9@126.com
            时间：2020-09-23
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable" :filters="filters">
			<template v-slot:expand="{ row }">
				<div>
					<span style="width: 80px; text-align: right; display: inline-block;">浏览器：</span>
					{{ row["browser"] }}
				</div>
				<div>
					<span style="width: 80px; text-align: right; display: inline-block;">参数：</span>
					{{ row["parameters"] }}
				</div>
			</template>
		</data-table>
	</div>
</template>
<script>
export default {
	data() {
		return {
			queryFields: [
				{
					name: "filter",
					label: "关键词"
				}
			],
			dataTable: {
				query: site.api.system.queryAuditLogs,
				columns: [
					{
						type: "expand"
					},
					{
						prop: "ip",
						label: "ip地址"
					},
					{
						prop: "userName",
						label: "用户名"
					},
					{
						prop: "action",
						label: "操作"
					},
					{
						prop: "error",
						label: "异常"
					},
					{
						prop: "createTime",
						label: "创建时间",
						type: "datetime"
					}
				]
			}
		};
	},
	methods: {
		init() {}
	}
};
</script>
<style lang="less" scoped></style>
