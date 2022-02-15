<template>
	<div class="site">
		<router-view class="page"></router-view>
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			browserType: null // 当前浏览器类型，Opera|Firefox|Chrome|Safari|IE|Edge
		};
	},
	created() {
		this.init();
	},
	mounted() {
		//TODO: 站点初始化
		this.initBrowser();
	},
	methods: {
		init: function () {},
		initBrowser() {
			let userAgent = navigator.userAgent,
				isShowBrowserWarning = true; //取得浏览器的userAgent字符串
			if (userAgent.indexOf("Opera") != -1 || userAgent.indexOf("OPR") != -1) {
				// 判断是否Opera浏览器
				this.browserType = "Opera";
			} else if (userAgent.indexOf("compatible") != -1 && userAgent.indexOf("MSIE") != -1) {
				// 判断是否IE浏览器
				this.browserType = "IE";
			} else if (!!window.ActiveXObject || "ActiveXObject" in window) {
				return "IE>=11";
			} else if (userAgent.indexOf("Edge") != -1) {
				//判断是否Edge浏览器
				this.browserType = "Edge";
			} else if (userAgent.indexOf("QQBrowser") != -1) {
				// 判断是否是QQ浏览器
				this.browserType = "QQBrowser";
			} else if (userAgent.indexOf("Firefox") != -1) {
				// 判断是否Firefox浏览器
				this.browserType = "Firefox";
			} else if (userAgent.indexOf("Chrome") != -1 && userAgent.indexOf("Safari") !== -1) {
				// 判断是否chorme浏览器
				this.browserType = "Chrome";
				isShowBrowserWarning = false;
			} else if (userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Chrome") === -1) {
				// 判断是否Safari浏览器
				this.browserType = "Safari";
			}
			if (isShowBrowserWarning) {
				this.showBrowserWarning();
			}
		},
		// 显示警告
		showBrowserWarning() {}
	}
};
</script>

<style lang="less" scoped>
.site {
	height: 100%;
	width: 100%;
}
</style>
