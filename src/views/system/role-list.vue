<template>
	<div class="role-list">
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-17
            描述：列表过滤栏
        -->
		<search-form :fields="queryFields" @search="search" @change="filterChange"></search-form>
		<!--
            作者：yujinjin9@126.com
            时间：2020-09-17
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons"></action-bar>

		<!--
            作者：yujinjin9@126.com
            时间：2020-09-17
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable" :filters="filters" @selection-change="selectRows = arguments[0]" />

		<!-- 修改或者新增角色信息 -->
		<el-dialog :title="roleDialog.title" :visible.sync="roleDialog.isShow" width="50%" heigth="60%">
			<el-form ref="role-dialog-form" class="role-dialog-form" :model="roleDialog.formInput" label-width="80px">
				<el-tabs type="border-card">
					<el-tab-pane label="角色名称">
						<el-form-item label="名称：" prop="name" :rules="{ required: true, message: '请输入角色名称' }">
							<el-input v-model="roleDialog.formInput.name" placeholder="请填写角色名称"></el-input>
						</el-form-item>
						<el-form-item label="是否默认" prop="isDefault">
							<el-switch v-model="roleDialog.formInput.isDefault"> </el-switch>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="权限">
						<el-tree node-key="value" show-checkbox check-strictly highlight-current check-on-click-node :data="allPermissions" ref="permissions-tree" :props="{ label: 'name' }" :default-expand-all="true"></el-tree>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="roleDialog.isShow = false">取 消</el-button>
				<el-button size="small" type="primary" @click="save">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			queryFields: [
				{
					name: "filter",
					label: "角色名称"
				}
			],
			handleButtons: [
				{
					action: "add",
					label: "新增",
					click: this.gotoAdd
				},
				{
					action: "delete",
					label: "删除",
					click: this.delete
				},
				{
					action: "refresh",
					label: "刷新",
					click: () => this.refresh(true)
				}
			],
			dataTable: {
				query: site.api.system.queryRoleList,
				dbClick: this.gotoUpdate,
				hasPagination: false,
				columns: [
					{
						type: "selection"
					},
					{
						type: "action",
						label: "操作",
						width: "50px",
						buttons: [
							{
								label: "编辑",
								click: this.gotoUpdate
							}
						]
					},
					{
						prop: "name",
						label: "角色名称"
					},
					{
						prop: "createTime",
						label: "创建时间",
						type: "datetime"
					}
				]
			},
			roleDialog: {
				title: "",
				isShow: false,
				formInput: {
					id: null,
					name: null,
					isDefault: false,
					permission: []
				}
			},
			allPermissions: [] // 当前系统的所有操作权限
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.queryAllPermissions();
		},
		queryAllPermissions() {
			return site.api.system.queryAllPermissions().then(data => {
				this.allPermissions = data;
			});
		},
		gotoAdd() {
			this.roleDialog.title = "新增角色信息";
			Object.assign(this.roleDialog.formInput, { id: null, name: null, isDefault: false, permission: [] });
			this.roleDialog.isShow = true;
		},
		gotoUpdate(row) {
			return site.api.system.queryUserPermission().then(data => {
				this.roleDialog.title = "修改角色:" + row.name;
				Object.assign(this.roleDialog.formInput, { id: row.id, name: row.name, isDefault: false, permission: data });
				this.roleDialog.isShow = true;
				this.$nextTick(() => {
					this.$refs["permissions-tree"].setCheckedKeys(data);
				});
			});
		},
		delete() {
			this.preBatchDelete(id => {
				return Promise.resolve({ data: true });
			});
		},
		save() {
			this.$refs["role-dialog-form"].validate(valid => {
				if (!valid) return;
				console.info("选中的值", this.$refs["permissions-tree"].getCheckedKeys());
				this.roleDialog.isShow = false;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.role-dialog-form {
	max-height: 500px;
	overflow-y: auto;
}
</style>
