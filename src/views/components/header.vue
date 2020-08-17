<template>
	<div class="header fixed-top">
		<div class="left-inner">
			<div class="logo-box">
				<img src="../../imgs/static/logo.png" height="40" width="40" />
			</div>
			<div class="title-text">后台管理系统框架</div>
		</div>
		<div class="right-inner">
			<div class="icons-box">
				<svg-icon value="message"></svg-icon>
			</div>
			<div class="login-info-box">
				<div class="avatar-box">
					<img src="../../imgs/test/head.png" height="24" width="24" />
				</div>
				<div class="user-name-text">{{ name }}</div>
				<!--<div class="role-name-text">{{ role }}</div>
				<div class="right-arrow">
					<svg-icon value="angle-right"></svg-icon>
				</div>-->
				<el-dropdown @command="handleCommand">
					<span class="el-dropdown-link role-name-text">
						{{ role }}
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>个人中心</el-dropdown-item>
						<el-dropdown-item command="logout" divided>退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from "vuex";
export default {
	data() {
		return {
			isFixed: true // 是否固定顶部导航栏
		};
	},
	computed: {
		...mapState({
			name: store => {
				if (store.appData.locationInfo && store.appData.locationInfo.loginUserInfo) {
					return store.appData.locationInfo.loginUserInfo.name;
				} else {
					return "";
				}
			},
			role: store => {
				if (store.appData.locationInfo && store.appData.locationInfo.loginUserInfo) {
					return store.appData.locationInfo.loginUserInfo.role;
				} else {
					return "";
				}
			}
		})
	},
	created() {},
	methods: {
		// 保存用户信息
		saveUserInfo() {},

		// 隐藏修改密码弹出
		showPasswordDialog() {},

		// 更新密码
		updatePassword() {},
		// 下拉菜单事件处理
		handleCommand(command) {
			// 处理退出事件
			if (command === "logout") {
				site.globalService.logOut();
			}
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

	&.fixed-top {
		position: fixed;
		left: 0px;
		right: 0px;
		top: 0px;
		z-index: 99;
	}

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
		padding: 18px 20px;
		color: #fff;
		line-height: 24px;
		font-size: 12px;

		.icons-box {
			padding-right: 20px;

			i.icon {
				font-size: 22px;
				margin-right: 5px;
			}
		}

		.login-info-box {
			display: flex;
			position: relative;

			.avatar-box {
				padding: 0px 5px;

				img {
					border-radius: 50%;
				}
			}

			.user-name-text,
			.role-name-text {
				padding: 0px 5px;
				color: #fff;
			}

			.right-arrow {
				padding-left: 10px;
				font-size: 15px;
			}
		}
	}
}
</style>
