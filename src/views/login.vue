<template>
	<div class="login">
		<div class="header">
			<div class="logo-img">
				<img src="../imgs/static/logo.png" />
			</div>
			<div class="title-text">平台管理系统</div>
		</div>
		<div class="form-panel">
			<div class="form-box">
				<div class="tabs">
					<div class="tab-text active">密码登录</div>
					<div class="tab-text">验证码登录</div>
					<div class="tab-qrcode">
						<img src="../imgs/login/qrcode-tips.png" />
						<img src="../imgs/login/qrcode-icon.png" />
					</div>
					<div class="tab-text active">扫码登录</div>
					<div class="tab-qrcode">
						<img src="../imgs/login/password-tips.png" />
						<img src="../imgs/login/computer-icon.png" />
					</div>
				</div>
				<div class="input-row">
					<div class="label-text">中国 +86</div>
					<div class="input-box">
						<input type="text" />
					</div>
				</div>
				<div class="input-row">
					<div class="input-box">
						<input type="password" />
					</div>
					<div class="icon-box">
						<img src="../imgs/login/eye-close-icon.png" />
					</div>
				</div>
				<div class="btn-panel">
					<div class="btn">登录</div>
				</div>
			</div>
		</div>
		<div class="footer">
			南京蜜家健康科技公司所有 Copyright Right @2020
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			loginType: 0, // 登录方式 0: 密码登录, 1: 验证码登录 2: 扫码登录
			inputForm: {
				userName: "", // 用户名|手机号
				password: "", // 密码
				code: "" // 验证码
			}
		};
	},
	methods: {
		init() {}
	}
};
</script>
<style lang="less" scoped>
	.login {
		
	}
</style>
