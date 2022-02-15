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
		<search-form :fields="queryFields" @search="search" @change="filterChange"></search-form>
		<!--
            作者：yujinjin9@126.com
            时间：2019-01-21
            描述：列表操作栏
        -->
		<action-bar :buttons="handleButtons"></action-bar>

		<!--
            作者：yujinjin9@126.com
            时间：2020-09-17
            描述：数据列表栏
        -->
		<data-table v-bind="dataTable" :filters="filters" :select-rows.sync="selectRows" />

		<!-- 修改密码 -->
		<dialog-form v-bind="updatePasswordDialogForm" :isShow.sync="updatePasswordDialogForm.isShow" @input-change="updatePasswordDialogForm.formInput = arguments[0]"></dialog-form>

		<!-- 用户信息弹窗 -->
		<!-- 修改或者新增角色信息 -->
		<el-dialog :title="userDialog.title" :close-on-click-modal="false" :visible.sync="userDialog.isShow" width="50%">
			<el-form ref="user-dialog-form" class="user-dialog-form" :model="userDialog.formInput" label-width="100px">
				<el-tabs type="border-card">
					<el-tab-pane label="基本信息">
						<el-form-item label="姓名：" prop="name" :rules="{ required: true, message: '请输入姓名' }">
							<el-input v-model="userDialog.formInput.name" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<el-form-item label="登录名：" prop="loginName" :rules="{ required: true, message: '请输入登录名' }">
							<el-input v-model="userDialog.formInput.loginName" placeholder="请输入登录名"></el-input>
						</el-form-item>
						<el-form-item label="手机号：" prop="mobile">
							<el-input v-model="userDialog.formInput.mobile" placeholder="请输入登录名"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" prop="email" :rules="{ required: true, type: 'email', message: '请输入邮箱' }">
							<el-input v-model="userDialog.formInput.email" placeholder="请输入邮箱"></el-input>
						</el-form-item>
						<el-form-item
							prop="password"
							v-if="!userDialog.formInput.id"
							label="密码："
							auto-complete="off"
							:rules="[
								{ required: true, message: '请输入密码', trigger: 'blur' },
								{ min: 6, message: '大于或等于6位', trigger: 'change' }
							]"
						>
							<el-input type="password" v-model="userDialog.formInput.password"></el-input>
						</el-form-item>
						<el-form-item prop="passwordRepeat" v-if="!userDialog.formInput.id" label="确认密码：" auto-complete="off" :rules="userDialog.passwordRule">
							<el-input type="password" v-model="userDialog.formInput.passwordRepeat"></el-input>
						</el-form-item>
						<el-form-item prop="roles" label="角色：" :rules="{ required: true, message: '请选择角色' }">
							<el-select v-model="userDialog.formInput.roles" multiple placeholder="请选择">
								<el-option v-for="roleItem in userDialog.roleList" :key="roleItem.id" :label="roleItem.name" :value="roleItem.id"> </el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="部门信息">
						<el-table :data="userDialog.departmentList" height="300px" highlight-current-row row-key="id" default-expand-all :tree-props="{ children: 'children' }" @current-change="departmentSelectChange" border>
							<el-table-column type="index" width="40">
								<template slot-scope="scope">
									<el-radio v-model="userDialog.formInput.departmentId" :label="scope.row.id">
										{{ "" }}
									</el-radio>
								</template>
							</el-table-column>
							<el-table-column type="index" width="80" label="索引"></el-table-column>
							<el-table-column prop="name" label="名称"></el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="userDialog.isShow = false">取 消</el-button>
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
					label: "系统用户"
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
					click: this.refresh
				}
			],
			dataTable: {
				query: site.api.system.queryUserList,
				dbClick: this.gotoUpdate,
				columns: [
					{
						type: "selection"
					},
					{
						type: "action",
						label: "操作",
						width: "90px",
						align: "center",
						buttons: [
							{
								label: "编辑",
								click: this.gotoUpdate
							},
							{
								label: "改密码",
								click: this.gotoUpdatePassword
							}
						]
					},
					{
						prop: "name",
						label: "姓名"
					},
					{
						prop: "loginName",
						label: "登录名"
					},
					{
						prop: "mobile",
						label: "手机号"
					},
					{
						prop: "email",
						label: "邮箱"
					},
					{
						prop: "state",
						label: "状态",
						type: "enum",
						list: "ACTIVE_FROZEN",
						click: this.changeStatus,
						tips: "【{0}】该用户"
					},
					{
						prop: "departmentName",
						label: "部门",
						width: "70px"
					},
					{
						prop: "lastLoginTime",
						label: "最后登录",
						type: "datetime"
					},
					{
						prop: "createTime",
						label: "创建时间",
						type: "datetime"
					}
				]
			},
			userDialog: {
				title: "",
				isShow: false,
				roleList: [],
				departmentList: [],
				formInput: {
					id: null,
					name: null,
					loginName: null,
					departmentId: null,
					mobile: null,
					email: null,
					password: null,
					passwordRepeat: null,
					roles: []
				},
				passwordRule: [{ required: true, validator: this.passwordValidator, trigger: "blur" }]
			},
			// 修改密码弹窗
			updatePasswordDialogForm: {
				dialog: {
					title: "修改登录密码"
				},
				formInput: {},
				isShow: false,
				form: {
					rules: {
						passwordRepeat: [
							{ required: true, message: "请确认新密码" },
							{
								validator: this.passwordValidator,
								trigger: "blur"
							}
						]
					}
				},
				submitForm: this.updatePassword,
				fields: [
					{
						name: "password",
						value: "",
						label: "新密码",
						rules: [
							{ required: true, message: "新密码不能为空" },
							{ min: 6, max: 20, message: "长度在 6 到20 个字符", trigger: "blur" }
						],
						option: {
							type: "password",
							style: { width: "250px" }
						}
					},
					{
						name: "passwordRepeat",
						value: "",
						label: "确认新密码",
						option: {
							type: "password",
							style: { width: "250px" }
						}
					}
				]
			}
		};
	},
	created() {
		this.init();
	},
	methods: {
		async init() {
			let { items } = await site.api.system.queryRoleList();
			this.userDialog.roleList = items;
			this.userDialog.departmentList = await site.api.system.queryDepartmentList();
		},
		gotoAdd() {
			this.userDialog.isShow = true;
			this.userDialog.title = "新增用户信息";
			Object.assign(this.userDialog.formInput, {
				id: null,
				name: null,
				loginName: null,
				departmentId: null,
				mobile: null,
				email: null,
				password: null,
				passwordRepeat: null,
				roles: []
			});
		},
		gotoUpdate(row) {
			this.userDialog.isShow = true;
			this.userDialog.title = "修改用户信息:" + row.name;
			Object.assign(this.userDialog.formInput, row, {
				roles: [parseInt(Math.random() * 10, 10) + 1],
				departmentId: parseInt(Math.random() * 20, 10) + 1
			});
		},
		gotoUpdatePassword(row) {
			this.updatePasswordDialogForm.isShow = true;
			this.updatePasswordDialogForm.dialog.title = "修改用户密码:" + row.name;
		},
		delete() {
			this.preBatchDelete(inputData => {
				console.info(inputData);
				return Promise.resolve(true);
			});
		},
		save() {
			this.$refs["user-dialog-form"].validate(valid => {
				if (!valid) return;
				// console.info("选中的值", this.$refs["permissions-tree"].getCheckedKeys());
				this.userDialog.isShow = false;
			});
		},
		changeStatus(val) {
			return Promise.resolve(true);
		},
		departmentSelectChange(row) {
			this.userDialog.formInput.departmentId = row.id;
		},
		// 信息当前登录用户的密码
		updatePassword(formInput) {
			return new Promise((resolve, reject) => {
				console.info(formInput);
				resolve(true);
			});
		},
		// 确认密码验证
		passwordValidator(rule, value, callback) {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.userDialog.formInput.password) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		}
	}
};
</script>
<style lang="less" scoped></style>
