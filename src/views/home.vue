<template>
	<div class="main">
		<header-bar></header-bar>
		<side-bar class="side-bar" :customMenuName="customMenuName"></side-bar>
		<keep-alive :include="$store.state.data.cachedViews">
			<router-view :key="routeKey" class="page-content"></router-view>
		</keep-alive>
	</div>
</template>
<script>
import headerBar from "./components/header-bar.vue";
import sideBar from "./components/side-bar.vue";

export default {
	data: function() {
		return {
			menuData: [], // 菜单数据
			menuSidebarData: {}, // 侧边栏菜单数据
			menuCollapseState: false, // 菜单折叠状态
			isHideSidebar: false, // 是否隐藏侧边栏
			currentRouter: {
				fullPath: null, //当前路由路径
				name: null, // 当前路由名称
				query: {}, // 当前路由query参数
				params: {}, // 当前路由params参数
				title: null // 当前路由名称
			}, // 当前路由信息
			currentRouterPath: null, // 当前指定路由的path
			customMenuName: null, // 自定义菜单标识，这是针对于某些页面不知道是属于哪个菜单，然后在页面里去指定属于某个菜单的标识
			isLoading: true // 当前数据是否正在加载
		};
	},
	components: {
		headerBar,
		sideBar
	},
	beforeRouteEnter(to, from, next) {
		//必须先拿到权限才能做页面操作
		// site.api.system.queryPermission().then(data => {
		// 	store.dispatch("updatePermissions", data.items);
		// 	next();
		// });
		next();
	},
	beforeRouteUpdate(to, from, next) {
		Object.assign(this.currentRouter, {
			fullPath: to.fullPath, //当前路由路径
			name: to.name, // 当前路由名称
			query: JSON.parse(JSON.stringify(to.query)), // 当前路由query参数
			params: JSON.parse(JSON.stringify(to.params)), // 当前路由params参数
			title: to.meta.title // 当前路由名称
		});
		next();
	},
	watch: {
		customMenuId(val) {
			if (val) {
				this.currentRouterPath = val;
				// this.selectMenuSidebarItem();
			}
		}
	},
	computed: {
		routeKey() {
			return this.$route.fullPath;
		}
	},
	created() {
		if ($(window).height() < 766 || $(window).width() < 1366) {
			this.$message.warning("当前管理系统屏幕分辨率最佳体验不低于1366*768!");
		}
		this.currentRouterPath = this.$route.meta.menuPath || this.$route.path;
		Object.assign(this.currentRouter, {
			fullPath: this.$route.fullPath, //当前路由路径
			name: this.$route.name, // 当前路由名称
			query: JSON.parse(JSON.stringify(this.$route.query)), // 当前路由query参数
			params: JSON.parse(JSON.stringify(this.$route.params)), // 当前路由params参数
			title: this.$route.meta.title // 当前路由名称
		});
	},
	methods: {
		// 修改当前路由path
		changeRouterPath(path) {
			this.currentRouterPath = path;
		}
	}
};
</script>
<style lang="less">
.main {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	min-width: 1366px;
	min-height: 768px;
	padding-top: 60px;

	.side-bar {
		width: 240px;
		height: 100%;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		margin-right: 10px;
	}

	.page-content {
		flex: 1;
		height: 100%;
		background-color: #fff;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
}
</style>
