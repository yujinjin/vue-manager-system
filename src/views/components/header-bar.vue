<template>
	<div class="header">
		<div class="left-inner">
			<div class="logo-box">
				<img src="../../imgs/static/logo.png" height="45" width="45" />
			</div>
			<div class="title-text">后台管理系统框架</div>
			<div class="icon-box" @click="toggleMenuCollapseState">
				<svg-icon :value="menuCollapseState ? 'hand-right' : 'hand-left'"></svg-icon>
			</div>
		</div>
		<div class="center-inner">
			<div class="menu-list" ref="menu-list">
				<div class="menus-inner" v-if="menuData && menuData.length > 0">
					<!-- <div class="menu-item" @click="menuClickEvent($event, {})">
						<svg-icon value="comment"></svg-icon>
						<span class="menu-text">产品中心</span>
					</div> -->
					<div class="menu-item" v-for="menuItem in menuData" :class="{ active: menuItem.isOpen }" :key="menuItem.name" @click="menuClickEvent(menuItem)">
						<svg-icon :value="menuItem.icon"></svg-icon>
						<span class="menu-text">{{ menuItem.displayName }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="right-inner">
			<div class="message-box">
				<el-dropdown @command="handleCommand">
					<span class="el-dropdown-link">
						<svg-icon value="message"></svg-icon>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<div class="message-item">
								<div class="avatar-img">
									<img src="../../imgs/test/head.png" />
								</div>
								<div class="inner-info">
									<div class="title-text">提现审核请求</div>
									<div class="subtitle-text">张三申请提现256元</div>
									<div class="time-text">刚刚</div>
								</div>
							</div>
						</el-dropdown-item>
						<el-dropdown-item>
							<div class="message-item">
								<div class="avatar-img">
									<img src="../../imgs/test/head.png" />
								</div>
								<div class="inner-info">
									<div class="title-text">订单处理</div>
									<div class="subtitle-text">李四申请部分退款售后</div>
									<div class="time-text">5分钟前</div>
								</div>
							</div>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div class="login-info-box">
				<el-dropdown @command="handleCommand" size="big">
					<span class="el-dropdown-link name-info">
						<div class="avatar-box">
							<img src="../../imgs/test/head.png" height="24" width="24" />
						</div>
						<div class="user-name-text">{{ userInfoDialogForm.fields[0].value }}</div>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="showUserInfoDialog">
							<svg-icon class="dropdown-icon" value="cog"></svg-icon>
							<span class="dropdown-text">我的账户</span>
						</el-dropdown-item>
						<el-dropdown-item command="showUpdateInfoDialog">
							<svg-icon class="dropdown-icon" value="edit"></svg-icon>
							<span class="dropdown-text">修改密码</span>
						</el-dropdown-item>
						<el-dropdown-item command="logout" divided>
							<svg-icon class="dropdown-icon" value="remove"></svg-icon>
							<span class="dropdown-text">退出</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<!-- 用户信息 -->
		<dialog-form v-bind="userInfoDialogForm" :isShow.sync="userInfoDialogForm.isShow">
			<template v-slot:headImg="{ formInput }">
				<img-upload :upload="imgUpload" :cropp="true" v-model="formInput.headImgURL">
					<img v-if="formInput.headImgURL" :src="formInput.headImgURL" class="avatar" />
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</img-upload>
			</template>
		</dialog-form>

		<!-- 修改密码 -->
		<dialog-form v-bind="updatePasswordDialogForm" :isShow.sync="updatePasswordDialogForm.isShow" @input-change="passwordInfoForm = arguments[0]"></dialog-form>
	</div>
</template>
<script>
import IScroll from "iscroll";
export default {
	data() {
		return {
			menuSrollInstance: null,
			// 用户信息弹窗
			userInfoDialogForm: {
				dialog: {
					title: "我的账户"
				},
				isShow: false,
				submitForm: this.updateUserInfo,
				fields: [
					{
						name: "userName",
						value: null,
						type: "label",
						label: "登录名"
					},
					{
						name: "name",
						value: null,
						label: "登录名",
						rules: [
							{ required: true, message: "姓名不能为空" },
							{ min: 2, max: 25, message: "长度在 2 到 25 个字符", trigger: "blur" }
						],
						option: {
							style: { width: "250px" }
						}
					},
					{
						name: "emailAddress",
						value: null,
						label: "邮箱",
						rules: [
							{ required: true, message: "邮箱不能为空" },
							{ min: 6, max: 35, message: "长度在 6 到35 个字符", trigger: "blur" },
							{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur,change" }
						],
						option: {
							style: { width: "250px" }
						}
					},
					{
						name: "headImgURL",
						slot: "headImg",
						label: "头像"
					}
				]
			},
			passwordInfoForm: null,
			// 修改密码弹窗
			updatePasswordDialogForm: {
				dialog: {
					title: "修改我的登录密码"
				},
				isShow: false,
				form: {
					rules: {
						confirmPassword: [
							{ required: true, message: "请确认新密码" },
							{
								validator: this.confirmPasswordValidator,
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
						label: "原密码",
						rules: [{ required: true, message: "密码不能为空" }],
						option: {
							type: "password",
							style: { width: "250px" }
						}
					},
					{
						name: "newPassword",
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
						name: "confirmPassword",
						value: "",
						label: "确认新密码",
						option: {
							type: "password",
							style: { width: "250px" }
						}
					}
				]
			},
			imgUpload: {
				class: "avatar-uploader",
				showFileList: false,
				limit: 1
			}
		};
	},
	props: {
		menuData: {
			type: Array,
			require: true
		},
		menuCollapseState: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		menuData() {
			this.initMenuScroll();
		}
	},
	created() {
		$(window).off("load resize", this.initMenuScroll);
		this.userInfoDialogForm.fields[0].value = "admin";
		this.userInfoDialogForm.fields[1].value = this.$store.state.data.locationInfo.loginUserInfo.name;
		this.userInfoDialogForm.fields[3].value = this.$store.state.data.locationInfo.loginUserInfo.headImgURL || require("../../imgs/test/head.png");
	},
	mounted() {
		this.initMenuScroll();
	},
	methods: {
		initMenuScroll() {
			if (!this.menuData || this.menuData.length == 0) {
				return;
			}
			this.$nextTick(() => {
				let allWidth = $(this.$refs["menu-list"]).outerWidth();
				let buttonBoxs = $(this.$refs["menu-list"]).find(".menu-item");
				let realWidth = 0;
				for (let i = 0; i < buttonBoxs.length; i++) {
					realWidth += buttonBoxs[i].getBoundingClientRect().width;
				}
				if (realWidth >= allWidth) {
					$(this.$refs["menu-list"]).find(".menus-inner").width(realWidth);
					if (!this.menuSrollInstance) {
						this.menuSrollInstance = new IScroll(this.$refs["menu-list"], {
							eventPassthrough: true,
							scrollX: true,
							scrollY: false,
							preventDefault: false
						});
					} else {
						this.menuSrollInstance.refresh();
					}
				} else if (realWidth < allWidth) {
					if (this.menuSrollInstance) {
						this.menuSrollInstance.destroy();
						this.menuSrollInstance = null;
					}
				}
			});
		},
		menuClickEvent(menuItem) {
			if (menuItem.isOpen) {
				return;
			}
			this.$emit("menuClick", menuItem);
		},
		toggleMenuCollapseState() {
			this.$emit("toggleMenuCollapseState");
		},
		// 下拉菜单事件处理
		handleCommand(command) {
			// 处理退出事件
			if (command === "logout") {
				site.globalService.logOut();
				this.$router.push({ name: "login" });
			} else if (command === "showUserInfoDialog") {
				this.userInfoDialogForm.isShow = true;
			} else if (command === "showUpdateInfoDialog") {
				this.updatePasswordDialogForm.isShow = true;
			}
		},
		handleAvatarSuccess(res, file) {
			this.userInfo.headImgURL = URL.createObjectURL(file.raw);
		},
		// 确认密码验证
		confirmPasswordValidator(rule, value, callback) {
			if (value === "") {
				callback(new Error("请输入原密码"));
			} else if (value.length < 6 || value.length > 20) {
				callback(new Error("长度在 6 到20 个字符"));
			} else if (value !== this.passwordInfoForm.newPassword) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		},
		// 修改用户信息
		updateUserInfo(formInput) {
			return new Promise((resolve, reject) => {
				console.info(formInput);
				resolve(true);
			});
		},
		// 信息当前登录用户的密码
		updatePassword(formInput) {
			return new Promise((resolve, reject) => {
				console.info(formInput);
				resolve(true);
			});
		}
	},
	destroyed() {
		$(window).off("load resize", this.initMenuScroll);
		if (this.menuSrollInstance) {
			this.menuSrollInstance.destroy();
		}
	}
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.header {
	width: 100%;
	padding: 0;
	margin: 0;
	border: none;
	height: 45px;
	background-color: #2dc3e8;
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: space-between;
	position: absolute;
	left: 0px;
	right: 0px;
	top: 0px;
	// z-index: 99;

	.left-inner {
		display: flex;
		flex: 0 0 224px;
		.logo-box {
			width: 51px;
			text-align: center;
		}

		.title-text {
			flex: 1;
			font-size: 15px;
			padding-left: 5px;
			line-height: 45px;
			color: #fff;
			display: -webkit-box;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.icon-box {
			width: 30px;
			color: #fff;
			cursor: pointer;
			font-size: 20px;
			transition: color 0.318s ease 0s;
			display: flex;
			justify-content: center;
			align-items: center;

			&:hover {
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
			}
		}
	}

	.center-inner {
		width: calc(100% - 384px);
		flex: 0 0 calc(100% - 384px);
		display: flex;
		align-items: flex-end;
		position: relative;

		.menu-list {
			width: 100%;
			overflow: hidden;

			.menus-inner {
				height: 45px;
				width: 100%;

				.menu-item {
					line-height: 45px;
					height: 45px;
					border-left: 1px solid #b6cbd8;
					min-width: 50px;
					padding: 0 10px;
					cursor: pointer;
					background-position: 0% 0%;
					background-image: linear-gradient(to bottom, #2dc3e8 0, #57a1d5 100%);
					background-repeat: repeat-x;
					filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff75b5e6', endColorstr='#ff57a1d5', GradientType=0);
					background-color: #68adde;
					background-attachment: scroll;
					color: #fff;
					display: inline-flex;

					&.active {
						background-image: linear-gradient(to bottom, #2dc3b1 0, #57a1d5 100%);
					}

					&:last-child {
						border-right: 1px solid #b6cbd8;
					}

					.menu-text {
						margin-left: 5px;
						display: inline-block;
						font-weight: 600;
						font-size: 13px;
					}

					i {
						font-size: 20px;
						display: inline-block;
						width: auto;
						height: auto;
					}
				}
			}
		}
	}

	.right-inner {
		flex: 0 0 160px;
		display: flex;
		padding: 0px 10px;
		color: #fff;
		font-size: 12px;
		align-items: center;

		.message-box {
			cursor: pointer;
			padding-right: 10px;

			i.icon {
				font-size: 22px;
				margin-right: 5px;
				color: #fff;
			}
		}

		.login-info-box {
			cursor: pointer;

			.name-info {
				display: flex;
				position: relative;
				color: #fff;

				.avatar-box {
					padding: 0px 5px;

					img {
						border-radius: 50%;
					}
				}

				.user-name-text,
				.role-name-text {
					padding: 0px 5px;
					line-height: 24px;
				}

				.el-icon-arrow-down {
					margin-top: 6px;
					font-size: 15px;
				}
			}
		}
	}

	.avatar-uploader {
		.el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}

		.el-upload:hover {
			border-color: #409eff;
		}

		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 60px;
			height: 60px;
			line-height: 60px;
			text-align: center;
		}
		.avatar {
			width: 60px;
			height: 60px;
			display: block;
			border-radius: 50%;
		}

		.avatar {
			height: 50px;
			width: 50px;
			border-radius: 50%;
		}
	}
}

.dropdown-icon {
	color: #000000;
	font-size: 15px;
}

.dropdown-text {
	font-size: 13px;
	padding-left: 3px;
	display: inline-block;
}

.message-item {
	width: 250px;
	padding: 8px 0px;
	display: flex;
	align-items: center;

	.avatar-img {
		height: 40px;
		width: 40px;
	}

	.inner-info {
		flex: 1;
		padding-left: 5px;
		line-height: 18px;

		.time-text {
			text-align: right;
			font-size: 11px;
			color: #2dc3e8;
			line-height: 12px;
		}

		.title-text {
			font-size: 12px;
			display: -webkit-box;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.subtitle-text {
			font-size: 12px;
			color: #999999;
			display: -webkit-box;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}
	}
}
</style>
