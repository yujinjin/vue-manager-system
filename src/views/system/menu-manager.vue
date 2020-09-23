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
		<!-- 修改或新增菜单信息 -->
		<dialog-form v-bind="updateMenuDialogForm" ref="update-menu-dialog-form" @close="updateMenuDialogForm.isShow = false">
			<template v-slot:permissions="{ formInput }">
				<el-input placeholder="请输入权限值" v-model="formInput.permissions">
					<template slot="prepend" v-if="updateMenuDialogForm.permissionsPrefix">{{ updateMenuDialogForm.permissionsPrefix }}</template>
				</el-input>
			</template>
			<template v-slot:icon="{ formInput }">
				<el-select v-model="formInput.icon" placeholder="请选择">
					<el-option v-for="item in icons" :key="item" :label="item" :value="item">
						<span style="float: left; color: #8492a6; font-size: 13px">{{ item }}</span>
						<svg-icon style="font-size: 20px; float: right" :value="item"></svg-icon>
					</el-option>
				</el-select>
				<svg-icon v-if="formInput.icon" style="font-size: 20px; margin-left: 20px;" :value="formInput.icon"></svg-icon>
			</template>
		</dialog-form>
		<!-- 批量新增按钮 -->
		<el-dialog title="新增操作按钮" :visible.sync="addButtonsDialog.isShow" width="50%">
			<el-form :model="addButtonsDialog" ref="add-buttons-form" label-width="0px">
				<el-table :data="addButtonsDialog.formInput" border style="width: 100%">
					<el-table-column label="操作内容">
						<template slot-scope="{ $index }">
							<div class="form-column">
								<el-form-item :prop="'formInput.' + $index + '.label'" :rules="{ required: true, message: '请输入操作内容' }">
									<el-input v-model="addButtonsDialog.formInput[$index].label" placeholder="请输入按钮操作内容"></el-input>
								</el-form-item>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="权限" class-name="form-column">
						<template slot-scope="{ $index }">
							<div class="form-column">
								<el-form-item :prop="'formInput.' + $index + '.permissions'" :rules="{ required: true, message: '请输入操作内容' }">
									<el-input placeholder="请输入权限值" v-model="addButtonsDialog.formInput[$index].permissions">
										<template slot="prepend">{{ addButtonsDialog.permissionsPrefix }}</template>
									</el-input>
								</el-form-item>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="{ $index }">
							<el-button size="small" @click="moveButton($index, -1)" v-if="$index != 0">上移</el-button>
							<el-button size="small" @click="moveButton($index, 1)" v-if="$index != addButtonsDialog.formInput.length - 1">下移</el-button>
							<el-button size="small" @click="gotoAddButton" type="primary" v-else>添加</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addButtonsDialog.isShow = false">取 消</el-button>
				<el-button type="primary" @click="addButtons">确 定</el-button>
			</div>
		</el-dialog>
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
						label: "路由地址"
					},
					{
						type: "action",
						label: "操作",
						width: "180px",
						buttons: this.generatorActionButtons
					}
				]
			},
			icons: ["calendar", "clock-o", "envelope", "cog", "edit", "email", "system-manage"],
			updateMenuDialogForm: {
				isShow: false,
				dialog: {
					title: "修改菜单信息"
				},
				permissionsPrefix: null,
				fields: [
					{
						name: "name",
						label: "ID值",
						rules: [{ required: true, message: "ID值不能为空" }]
					},
					{
						name: "displayName",
						label: "名称",
						rules: [{ required: true, message: "名称不能为空" }]
					},
					{
						name: "permissions",
						slot: "permissions",
						label: "权限值",
						rules: [{ required: true, message: "权限值不能为空" }]
					},
					{
						name: "route",
						label: "路由"
					},
					{
						name: "icon",
						slot: "icon",
						label: "图标"
					}
				],
				submitForm: this.updateMenu
			},
			addButtonsDialog: {
				isShow: false,
				permissionsPrefix: null,
				formInput: []
			}
		};
	},
	methods: {
		init() {},
		delete() {
			this.preBatchDelete(inputData => {
				console.info(inputData);
				return Promise.resolve(true);
			});
		},
		generatorActionButtons(row) {
			let buttons = [];
			if (row.type == "menu") {
				buttons = [
					{
						label: "新增按钮",
						click: this.gotoAddButtons
					},
					{
						label: "新增子菜单",
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
		gotoAddButtons(row) {
			this.addButtonsDialog.formInput = [
				{
					label: "",
					permissions: "",
					type: "button"
				}
			];
			this.addButtonsDialog.isShow = true;
			this.addButtonsDialog.permissionsPrefix = row.permissions + ".";
		},
		gotoAddButton() {
			this.addButtonsDialog.formInput.push({
				label: "",
				permissions: "",
				type: "button"
			});
		},
		moveButton(index, number) {
			if (number > 0) {
				this.addButtonsDialog.formInput.splice(index + number + 1, 0, this.addButtonsDialog.formInput[index]);
				this.addButtonsDialog.formInput.splice(index, 1);
			} else if (number < 0) {
				this.addButtonsDialog.formInput.splice(index + number, 0, this.addButtonsDialog.formInput[index]);
				this.addButtonsDialog.formInput.splice(index + 1, 1);
			}
		},
		gotoAddMenus(row) {
			this.$refs["update-menu-dialog-form"].setFieldsValue({ route: '{"name": ""}', type: "menu" }, ["type"]);
			this.updateMenuDialogForm.isShow = true;
			this.updateMenuDialogForm.permissionsPrefix = row.permissions + ".";
			this.updateMenuDialogForm.dialog.title = "新增" + row.displayName + "的子菜单信息:";
		},
		gotoUpdate(row) {
			if (row.permissions && row.permissions.indexOf(".") != -1) {
				this.updateMenuDialogForm.permissionsPrefix = row.permissions.substr(0, row.permissions.lastIndexOf(".") + 1);
				row = Object.assign({}, row, { permissions: row.permissions.replace(this.updateMenuDialogForm.permissionsPrefix, "") });
			} else {
				this.updateMenuDialogForm.permissionsPrefix = "";
			}
			this.$refs["update-menu-dialog-form"].setFieldsValue(row, ["type"]);
			this.updateMenuDialogForm.isShow = true;
			if (row.type == "menu") {
				this.updateMenuDialogForm.fields = [
					{
						name: "name",
						label: "ID值",
						rules: [{ required: true, message: "ID值不能为空" }]
					},
					{
						name: "displayName",
						label: "名称",
						rules: [{ required: true, message: "名称不能为空" }]
					},
					{
						name: "permissions",
						slot: "permissions",
						label: "权限值",
						rules: [{ required: true, message: "权限值不能为空" }]
					},
					{
						name: "route",
						label: "路由"
					},
					{
						name: "icon",
						slot: "icon",
						label: "图标"
					}
				];
				this.updateMenuDialogForm.dialog.title = "修改菜单信息:" + row.displayName;
			} else if(row.type == "button") {
				this.updateMenuDialogForm.fields = [
					{
						name: "label",
						label: "操作内容",
						rules: [{ required: true, message: "操作内容不能为空" }]
					},
					{
						name: "permissions",
						slot: "permissions",
						label: "权限值",
						rules: [{ required: true, message: "权限值不能为空" }]
					}
				];
				this.updateMenuDialogForm.dialog.title = "修改按钮信息:" + row.label;
			}
		},
		updateMenu(formInput) {
			return new Promise((resolve, reject) => {
				console.info(formInput);
				resolve(true);
			});
		},
		addButtons() {
			this.$refs["add-buttons-form"].validate(valid => {
				if (!valid) {
					return;
				}
				console.info(this.addButtonsDialog.formInput);
				this.addButtonsDialog.isShow = false;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.menu-manager {
	.form-column {
		padding-top: 18px;
	}
}
</style>
