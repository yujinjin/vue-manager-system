<template>
	<div class="main">
		<v-header></v-header>
		<div class="page-container">
			<sidebar class="side-bar" :customMenuName="customMenuName"></sidebar>
			<div class="page-content">
				<!-- <transition name="move" mode="out-in"> -->
				<!-- 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们, TODO: 需要测试 -->
				<keep-alive :include="$store.state.appData.cachedViews">
					<router-view :key="routeKey" class="page-body"></router-view>
				</keep-alive>
				<!-- </transition> -->
			</div>
		</div>
	</div>
</template>
<script>
import vHeader from "./components/header.vue";
import sidebar from "./components/sidebar.vue";
// import store from "@js/store";

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
		sidebar,
		vHeader
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
	min-height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	min-width: 1366px;
	min-height: 768px;

	.page-container {
		width: 100%;
		display: flex;
		padding-left: 240px;
		padding-top: 60px;
		box-sizing: border-box;
		.side-bar {
			position: fixed;
			left: 0;
			width: 240px;
			height: 100%;
			z-index: 98;
		}

		.page-content {
			flex: 1;
			width: 100%;
			min-height: 100%;
			padding-left: 20px;
			background-color: #f4f4f4;
			box-sizing: border-box;
			.page-body {
				background-color: #fff;
				height: 100%;
				width: 100%;
			}
		}
	}
}
</style>
