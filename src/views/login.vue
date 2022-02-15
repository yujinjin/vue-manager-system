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
					<template v-if="loginType == 0 || loginType == 1">
						<div class="tab-text" :class="{ active: loginType == 0 }" @click="loginType = 0">密码登录</div>
						<div class="divider-bar"></div>
						<div class="tab-text" :class="{ active: loginType == 1 }" @click="loginType = 1">验证码登录</div>
						<div class="tab-qrcode">
							<img class="qrcode-tips" src="../imgs/login/qrcode-tips.png" />
							<img class="qrcode-icon" @click="loginType = 2" src="../imgs/login/qrcode-icon.png" />
						</div>
					</template>
					<template v-else>
						<div class="tab-text active">扫码登录</div>
						<div class="tab-qrcode">
							<img class="password-tips" src="../imgs/login/password-tips.png" />
							<img class="computer-icon" @click="loginType = 0" src="../imgs/login/computer-icon.png" />
						</div>
					</template>
				</div>
				<div v-show="loginType == 0">
					<div class="input-row" :class="{ active: activeInputType == 0 }">
						<div class="input-box">
							<input type="text" @focus="activeInputType = 0" @blur="activeInputType = -1" maxlength="20" placeholder="登录用户名" v-model="inputForm.userName" />
						</div>
					</div>
					<div class="input-row" :class="{ active: activeInputType == 1 }">
						<div class="input-box">
							<input maxlength="20" @keyup.enter="submit" :type="isShowPassword ? 'text' : 'password'" @focus="activeInputType = 1" @blur="activeInputType = -1" placeholder="登录密码" v-model="inputForm.password" />
						</div>
						<div class="icon-box" @click="isShowPassword = !isShowPassword">
							<img v-if="isShowPassword" src="../imgs/login/eye-open-icon.png" />
							<img v-else src="../imgs/login/eye-close-icon.png" />
						</div>
					</div>
				</div>
				<div v-show="loginType == 1">
					<div class="input-row" :class="{ active: activeInputType == 2 }">
						<div class="label-text">中国 +86</div>
						<div class="input-box">
							<input type="text" maxlength="15" @keyup="checkNumber('mobile')" @focus="activeInputType = 2" @blur="activeInputType = -1" placeholder="登录手机号" v-model="inputForm.mobile" />
						</div>
					</div>
					<div class="input-row" :class="{ active: activeInputType == 3 }">
						<div class="input-box">
							<input type="text" maxlength="8" @keyup.enter="submit" @keyup="checkNumber('code')" @focus="activeInputType = 3" @blur="activeInputType = -1" placeholder="填写短信验证码" v-model="inputForm.code" />
						</div>
						<div class="code-text" @click="sendValidateCode" v-html="countDownSecond == null ? '获取短信验证码' : countDownSecond <= 0 ? '重新发送验证码' : countDownSecond + 's后重新发送'"></div>
					</div>
				</div>
				<div v-show="loginType == 2">
					<div class="qrcode-box" :key="0">
						<div class="qrcode-img" ref="qrcode-img" v-loading="!!!qrcodeInstances"></div>
						<div class="mask" v-show="isTimeoutForQrcode">
							<div class="timeout-tips-text">二维码已失效</div>
							<div class="btn-refresh">点击刷新</div>
						</div>
					</div>
					<div class="tips-text">请使用微信APP扫码登录</div>
					<div class="wechat-icon-box">
						<img src="../imgs/login/wechat-icon.png" />
					</div>
				</div>
				<div class="btn-panel" v-show="loginType == 0 || loginType == 1">
					<div class="btn" @click="submit">登 录</div>
				</div>
			</div>
		</div>
		<div class="footer">软件科技有限公司所有 Copyright Right @2020</div>
	</div>
</template>
<script>
import QRCode from "@js/lib/qrcode.js";
import { Loading } from "element-ui";
export default {
	data() {
		return {
			loginType: 0, // 登录方式 0: 密码登录, 1: 验证码登录 2: 扫码登录
			isShowPassword: false, // 是否显示输入的密码
			isTimeoutForQrcode: false, // 二维码是否超时
			qrcodeInstances: null, // 二维码实例
			qrcodeTimerId: null, // 二维码超时定时器
			countDownTimerId: null, // 定时器ID
			countDownSecond: null, // 倒计时（秒）
			activeInputType: -1, // 输入框激活类型
			inputForm: {
				userName: "", // 用户名|手机号
				password: "", // 密码
				mobile: "", // 手机号
				code: "" // 验证码
			}
		};
	},
	watch: {
		loginType(val) {
			if (val == 2 && !this.qrcodeInstances) {
				this.initQrcode();
			}
		}
	},
	methods: {
		init() {},
		initQrcode() {
			setTimeout(() => {
				if (this.qrcodeInstances) {
					this.qrcodeInstances.makeCode("https://github.com/yujinjin/vue-manager-system.git");
				} else {
					this.qrcodeInstances = new QRCode(this.$refs["qrcode-img"], {
						text: "https://github.com/yujinjin/vue-manager-system.git",
						width: 120,
						height: 120,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.H
					});
				}
				this.qrcodeTimerId = setTimeout(() => {
					this.isTimeoutForQrcode = true;
				}, 6000);
			}, 1000);
		},
		refreshQrcode() {
			this.isTimeoutForQrcode = false;
			this.initQrcode();
		},
		// 验证数字
		checkNumber(name) {
			if (!this.inputForm[name]) return false;
			let reg = /[^\d]/g;
			if (reg.test(this.inputForm[name])) {
				this.inputForm[name] = this.inputForm[name].replace(reg, "");
			}
		},
		// 发送手机验证码
		async sendValidateCode() {
			if (!this.inputForm.mobile) {
				this.$message.error("请输入手机号!");
				return;
			} else if (!site.utils.validateMobile(this.inputForm.mobile)) {
				this.$message.error("请输入正确格式的手机号!");
				return;
			} else if (this.countDownSecond > 0) {
				this.$message.error("验证码已发送，请耐心等待!");
				return;
			}
			this.countDownSecond = 60;
			if (this.countDownTimerId) clearInterval(this.countDownTimerId);
			await site.api.common.sendValidateCode();
			this.$message.success("验证码已发送，请耐心等待!");
			this.countDownTimerId = setInterval(() => {
				if (this.countDownSecond <= 0) {
					clearInterval(this.countDownTimerId);
					return;
				}
				--this.countDownSecond;
			}, 1000);
		},
		submit() {
			if (this.loginType == 0) {
				if (!this.inputForm.userName) {
					this.$message.error("请输入用户名!");
					return;
				} else if (!this.inputForm.password) {
					this.$message.error("请输入密码!");
					return;
				}
			} else if (this.loginType == 1) {
				if (!this.inputForm.mobile) {
					this.$message.error("请输入手机号!");
					return;
				} else if (!site.utils.validateMobile(this.inputForm.mobile)) {
					this.$message.error("请输入正确格式的手机号!");
					return;
				} else if (!this.inputForm.code) {
					this.$message.error("请输入验证码!");
					return;
				}
			}
			site.api.system.login({ isShowLoading: true }).then(data => {
				site.globalService.setLoginUserInfo(data);
				this.go();
			});
		},
		go() {
			// 默认情况下当路由跳转的路径是：A->B(登录页,replace)->C，此时必须要传toName参数。toName(参数):跳转的页面路由名称, toParams（参数）:命令路由的参数对象，query:默认参数
			// 传入goBack参数是表示返回跳转：A->B(登录页,back)->A
			let [_toName, _go, _current_query, _current_params] = [this.$route.query.toName, this.$route.query.goBack, this.$route.query.toQuery, this.$route.query.toParams];
			if (_toName) {
				if (_current_query) {
					try {
						_current_query = JSON.parse(_current_query);
					} catch (e) {
						_current_query = {};
					}
				}
				if (_current_params) {
					try {
						_current_params = JSON.parse(_current_params);
					} catch (e) {
						_current_params = {};
					}
				}
				this.$router.replace({ name: _toName, query: _current_query, params: _current_params });
			} else if (_go) {
				_go = /^-?\d+$/.test(_go) ? parseInt(_go, 10) : -1;
				this.$router.go(_go);
			} else {
				this.$router.replace({ name: "home" });
			}
		}
	},
	destroyed() {
		if (this.qrcodeTimerId) {
			clearTimeout(this.qrcodeTimerId);
		}
		if (this.countDownTimerId) {
			clearTimeout(this.countDownTimerId);
		}
	}
};
</script>
<style lang="less" scoped>
.login {
	position: relative;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;

	.header {
		position: absolute;
		left: 0px;
		top: 0px;
		right: 0px;
		height: 60px;
		padding: 15px 25%;
		line-height: 30px;
		background-color: #000000;
		opacity: 0.3;
		display: flex;

		.logo-img {
			height: 30px;
			width: 30px;
			display: inline-block;
		}

		.title-text {
			display: inline-block;
			font-size: 20px;
			color: #ffffff;
			padding-left: 10px;
		}
	}

	.form-panel {
		flex: 1;
		background-image: url("../imgs/login/login-bg.png");
		background-size: cover;
		background-repeat: no-repeat;
		background-position-x: center;
		// display: flex;
		padding-top: 140px;
		// justify-content: center;

		.form-box {
			background-color: #ffffff;
			border-radius: 8px;
			box-shadow: 0px -1px 6px 0px rgba(0, 0, 0, 0.15);
			padding: 20px 30px;
			width: 320px;
			margin: 0px auto;
			text-align: center;

			.tabs {
				display: flex;
				padding-bottom: 10px;

				.tab-text {
					font-size: 14px;
					line-height: 20px;
					color: #aaaaaa;
					cursor: pointer;

					&.active {
						color: #333333;
					}
				}

				.divider-bar {
					margin: 3px 10px;
					width: 1px;
					height: 14px;
					background-color: #aaaaaa;
				}

				.tab-qrcode {
					flex: 1;
					text-align: right;

					.qrcode-tips,
					.password-tips {
						width: 64px;
						height: 20px;
						margin-right: 3px;
					}

					.qrcode-icon,
					.computer-icon {
						cursor: pointer;
						height: 30px;
						width: 30px;
					}
				}
			}

			.input-row {
				padding: 20px 0px 10px;
				line-height: 20px;
				display: flex;
				border-bottom: 1px solid #dddddd;

				&.active {
					border-bottom: 1px solid #209fff;
				}

				.label-text {
					width: 60px;
					font-size: 12px;
				}

				.input-box {
					flex: 1;

					input {
						width: 100%;
						border: 0px;
						height: 20px;
						line-height: 20px;
						font-size: 16px;
						letter-spacing: 1px;
						padding: 0px 10px;

						&::placeholder {
							font-size: 12px;
						}

						&:focus {
							outline: none;
						}

						&:-webkit-autofill {
							-webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
							-webkit-text-fill-color: #333;
						}
					}
				}

				.icon-box {
					width: 18px;
				}

				.code-text {
					color: #209fff;
					font-size: 12px;
					cursor: pointer;
					min-width: 80px;
				}
			}

			.qrcode-box {
				padding: 5px;
				border: 1px solid #f2f2f2;
				position: relative;
				display: inline-block;

				.qrcode-img {
					height: 120px;
					width: 120px;
				}

				.mask {
					position: absolute;
					left: 0px;
					right: 0px;
					top: 0px;
					bottom: 0px;
					background-color: #ffffff;
					opacity: 0.95;
					padding: 20px 0px;

					.timeout-tips-text {
						color: #000000;
						text-align: center;
						padding: 20px 0px;
					}

					.btn-refresh {
						border-radius: 2px;
						height: 30px;
						line-height: 30px;
						width: 82px;
						background-color: #209fff;
						text-align: center;
						color: #ffffff;
						font-size: 12px;
						margin: 0px auto;
						cursor: pointer;
					}
				}
			}

			.tips-text {
				text-align: center;
				color: #666666;
				font-size: 12px;
				padding: 10px 0px;
				line-height: 20px;
			}

			.wechat-icon-box {
				text-align: center;

				img {
					height: 22px;
					width: 22px;
				}
			}

			.btn-panel {
				padding: 33px 0px 20px;
				.btn {
					width: 100%;
					height: 40px;
					background-color: #209fff;
					border-radius: 2px;
					text-align: center;
					font-size: 14px;
					line-height: 40px;
					color: #ffffff;
					cursor: pointer;
				}
			}
		}
	}

	.footer {
		height: 40px;
		background-color: #ffffff;
		font-size: 13px;
		line-height: 40px;
		text-align: center;
		color: #666666;
	}
}
</style>
