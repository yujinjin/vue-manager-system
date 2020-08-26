<template>
	<div class="header">
		<div class="left-inner">
			<div class="logo-box">
				<img src="../../imgs/static/logo.png" height="40" width="40" />
			</div>
			<div class="title-text">后台管理系统框架</div>
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
						<div class="user-name-text">{{ userInfo.name }}</div>
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
		<el-dialog title="我的账户" :visible="isShowUserInfo">
			<el-form label-width="200px" :model="userInfo">
				<el-form-item label="登录名：">
					<strong>admin</strong>
				</el-form-item>
				<el-form-item
					label="姓名："
					prop="name"
					:rules="[
						{ required: true, message: '姓名不能为空' },
						{ min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
					]"
				>
					<el-input style="width: 250px;" v-model="userInfo.name"></el-input>
				</el-form-item>
				<el-form-item
					label="邮箱："
					prop="emailAddress"
					:rules="[
						{ required: true, message: '邮箱不能为空' },
						{ min: 6, max: 35, message: '长度在 6 到35 个字符', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
					]"
				>
					<el-input style="width: 250px;" v-model="userInfo.emailAddress" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="头像：">
					<!-- <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess">
						<img v-if="userInfo.headImgURL" :src="userInfo.headImgURL" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload> -->
					<img-upload :uploadAttributes="imgUpload" :cropp="true" v-model="userInfo.headImgURL">
						<img v-if="userInfo.headImgURL" :src="userInfo.headImgURL" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</img-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isShowUserInfo = false">取 消</el-button>
				<el-button type="primary" @click="isShowUserInfo = false">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 修改密码 -->
		<el-dialog title="修改密码" :visible="isShowPassword">
			<el-form :rules="passwordRules" :model="passwordInfo" ref="passwordInfoForm" label-width="200px">
				<el-form-item label="原密码：" prop="password" :rules="[{ required: true, message: '密码不能为空' }]">
					<el-input style="width: 250px;" type="password" v-model="passwordInfo.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item
					label="新密码："
					prop="newPassword"
					:rules="[
						{ required: true, message: '新密码不能为空' },
						{ min: 6, max: 20, message: '长度在 6 到20 个字符', trigger: 'blur' }
					]"
				>
					<el-input style="width: 250px;" type="password" v-model="passwordInfo.newPassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码：" prop="confirmPassword" :required="true">
					<el-input style="width: 250px;" type="password" v-model="passwordInfo.confirmPassword" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isShowPassword = false">取 消</el-button>
				<el-button type="primary" @click="isShowPassword = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		return {
			isShowUserInfo: false,
			isShowPassword: false,
			userInfo: {
				name: null,
				headImgURL: null,
				emailAddress: null
			},
			passwordInfo: {
				isShow: false,
				password: "", //旧密码
				newPassword: "", // 新密码
				confirmPassword: "" // 确认密码
			},
			passwordRules: {
				confirmPassword: [
					{
						validator(rule, value, callback) {
							if (value === "") {
								callback(new Error("请输入原密码"));
							} else if (value.length < 6 || value.length > 20) {
								callback(new Error("长度在 6 到20 个字符"));
							} else if (value !== _this.passwordInfo.newPassword) {
								callback(new Error("两次输入密码不一致!"));
							} else {
								callback();
							}
						},
						trigger: "blur"
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
	created() {
		this.userInfo.name = this.$store.state.data.locationInfo.loginUserInfo.name;
		this.userInfo.headImgURL = this.$store.state.data.locationInfo.loginUserInfo.headImgURL || require("../../imgs/test/head.png");
	},
	methods: {
		// 下拉菜单事件处理
		handleCommand(command) {
			// 处理退出事件
			if (command === "logout") {
				site.globalService.logOut();
				this.$router.push({ name: "login" });
			} else if (command === "showUserInfoDialog") {
				this.isShowUserInfo = true;
			} else if (command === "showUpdateInfoDialog") {
				this.isShowPassword = true;
			}
		},
		handleAvatarSuccess(res, file) {
			this.userInfo.headImgURL = URL.createObjectURL(file.raw);
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
	height: 60px;
	background: linear-gradient(270deg, rgba(0, 47, 83, 1) 0%, rgba(0, 21, 41, 1) 100%);
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

		.logo-box {
			width: 100px;
			text-align: center;
			padding-top: 10px;
		}

		.title-text {
			flex: 1;
			font-size: 20px;
			line-height: 30px;
			padding: 15px 0px;
			color: #fff;
		}
	}

	.right-inner {
		display: flex;
		padding: 10px 20px;
		color: #fff;
		font-size: 12px;
		align-items: center;

		.message-box {
			cursor: pointer;
			padding-right: 20px;

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
