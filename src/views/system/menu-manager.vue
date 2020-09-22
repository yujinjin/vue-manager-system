<template>
	<div class="menu-manager">
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-22
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons"></action-bar>
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-17
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable" :select-rows.sync="selectRows">
			<template v-slot:icon="{ row }">
				<svg-icon style="font-size: 20px" v-if="row.icon" :value="row.icon"></svg-icon>
			</template>
		</data-table>
	</div>
</template>
<script>
export default {
	data() {
		return {
			handleButtons: [
				{
					action: "delete",
					label: "删除",
					click: this.delete
				},
				{
					action: "refresh",
					label: "刷新",
					click: this.refresh
				}
			],
			dataTable: {
				query: site.api.system.queryMenuPermissionList,
				queryDataHandle: data => {
					return { items: data };
				},
				dbClick: this.gotoUpdate,
				hasPagination: false,
				table: {
					rowKey: "permissions",
					// defaultExpandAll: true,
					treeProps: {
						children: "items"
					}
				},
				columns: [
					{
						type: "selection"
					},
					{
						prop: "name",
						label: "名称",
						formatter: this.nameFormatter
					},
					{
						prop: "permissions",
						label: "权限值"
					},
					{
						prop: "type",
						label: "类型",
						type: "enum",
						list: [
							{ name: "菜单", key: "menu" },
							{ name: "按钮", key: "button" }
						]
					},
					{
						slot: "icon",
						label: "图标",
						align: "center",
						width: "80px"
					},
					{
						prop: "route",
						label: "路由地址",
						formatter: this.routeFormatter
					},
					{
						type: "action",
						label: "操作",
						width: "180px",
						buttons: this.generatorActionButtons
					}
				]
			}
		};
	},
	methods: {
		init() {},
		delete() {},
		generatorActionButtons(row) {
			let buttons = [];
			if (row.type == "menu") {
				buttons = [
					{
						label: "新增按钮",
						click: this.gotoAddButtons
					},
					{
						label: "新增菜单",
						click: this.gotoAddMenus
					}
				];
			}
			buttons.push({
				label: "编辑",
				click: this.gotoUpdate
			});
			return buttons;
		},
		nameFormatter(row, column, cellValue, index) {
			return row.displayName || row.label;
		},
		routeFormatter(row, column, cellValue, index) {
			if (row.route) {
				return JSON.stringify(row.route);
			} else {
				return "";
			}
		},
		gotoAddButtons(row) {},
		gotoAddMenus(row) {},
		gotoUpdate(row) {}
	}
};
</script>
