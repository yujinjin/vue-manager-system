<template>
	<div class="main">
		<header-bar :menuData="menuData" :menuCollapseState="menuCollapseState" @menuClick="menuClickEvent" @toggleMenuCollapseState="toggleMenuCollapseState" />
		<side-bar class="side-bar" :menuSidebarData="menuSidebarData" :menuCollapseState="menuCollapseState" @menuSidebarClick="menuSidebarClickEvent" />
		<div class="page-content">
			<page-tabs class="page-navbar"></page-tabs>
			<keep-alive :include="$store.state.pageTabs.cachedViews">
				<router-view :key="routeKey" class="page-body"></router-view>
			</keep-alive>
		</div>
	</div>
</template>
<script>
import headerBar from "./components/header-bar.vue";
import sideBar from "./components/side-bar.vue";
import pageTabs from "./components/page-tabs.vue";
import store from "@js/store/";
import routers from "@/js/routers";

export default {
	data: function () {
		return {
			menuData: [], // 菜单数据
			menuSidebarData: [], // 侧边栏菜单数据
			menuCollapseState: false, // 菜单折叠状态
			currentRouter: {
				fullPath: null, //当前路由路径
				name: null, // 当前路由名称
				query: {}, // 当前路由query参数
				params: {}, // 当前路由params参数
				title: null, // 当前路由名称
				menuName: null // 自定义菜单名称
			}, // 当前路由信息
			currentActiveMenu: null, // 当前激活的菜单
			customMenuName: null, // 自定义菜单标识，这是针对于某些页面不知道是属于哪个菜单，然后在页面里去指定属于某个菜单的标识
			isLoading: true // 当前数据是否正在加载
		};
	},
	components: {
		headerBar,
		sideBar,
		pageTabs
	},
	beforeRouteEnter(to, from, next) {
		console.info("...beforeRouteEnter");
		console.info(to);
		console.info(from);
		//必须先拿到权限才能做页面操作
		// site.api.system.queryPermission().then(data => {
		// 	store.dispatch("updatePermissions", data.items);
		// 	next();
		// });
		// console.log(this)
		// to.$store.dispatch("updatePermissions", routers.routes);
		// console.log()
		next();
		// 添加页面路由
		store.dispatch("addVisitedRoute", {
			name: to.name,
			title: to.meta.title,
			fullPath: to.fullPath,
			query: to.query,
			params: to.params,
			keepAlive: to.meta.keepAlive != false
		});
	},
	beforeRouteUpdate(to, from, next) {
		console.info("...beforeRouteUpdate");
		console.info(to);
		console.info(from);
		next();
		Object.assign(this.currentRouter, {
			fullPath: to.fullPath, //当前路由路径
			name: to.name, // 当前路由名称
			query: JSON.parse(JSON.stringify(to.query)), // 当前路由query参数
			params: JSON.parse(JSON.stringify(to.params)), // 当前路由params参数
			title: to.meta.title, // 当前路由页面标题
			menuName: to.meta.menuName // 当前页面所属的菜单,可为null
		});
		// 添加页面路由
		store.dispatch("addVisitedRoute", {
			name: to.name,
			title: to.meta.title,
			fullPath: to.fullPath,
			query: to.query,
			params: to.params,
			keepAlive: to.meta.keepAlive != false
		});
	},
	watch: {
		currentRouter: {
			handler() {
				this.activeMenuData(this.menuData);
			},
			deep: true
		}
	},
	computed: {
		routeKey() {
			return this.$route.fullPath;
		}
	},
	created() {
		this.queryMenuList();
		// this.$store.dispatch("updatePermissions", routers.routes);
		if ($(window).height() < 650 || $(window).width() < 1366) {
			this.$message.warning("当前管理系统屏幕分辨率最佳体验不低于1366*768!");
		}
		Object.assign(this.currentRouter, {
			fullPath: this.$route.fullPath, //当前路由路径
			name: this.$route.name, // 当前路由名称
			query: JSON.parse(JSON.stringify(this.$route.query)), // 当前路由query参数
			params: JSON.parse(JSON.stringify(this.$route.params)), // 当前路由params参数
			title: this.$route.meta.title, // 当前路由页面标题
			menuName: this.$route.meta.menuName // 当前页面所属的菜单,可为null
		});
	},
	methods: {
		//查询菜单数据列表
		queryMenuList() {
			return site.api.system.queryMenus().then(data => {
				this.initMenuData(data);
			});
		},
		// 初始化菜单数据
		initMenuData(menuData) {
			if (!menuData || menuData.length == 0) {
				this.$message.error("没有主菜单数据");
				return;
			}
			//初始化菜单状态，不然不会跟踪变化
			this.menuData = this.initMenuStatus(menuData);
			this.activeMenuData(this.menuData);
		},
		initMenuStatus(menus) {
			for (let i = 0; i < menus.length; i++) {
				menus[i].isOpen = false;
				menus[i].isActive = false;
				if (menus[i].items && menus[i].items.length > 0) {
					this.initMenuStatus(menus[i].items);
				}
			}
			return menus;
		},
		// 初始化激活菜单数据
		activeMenuData() {
			if (!this.menuData || this.menuData.length == 0) {
				return;
			}
			if (!this.currentMenuName && !this.currentRouter) {
				return;
			}
			if (this.currentMenuName) {
				if (this.currentActiveMenu && this.currentActiveMenu.name == this.currentMenuName) {
					return;
				}
				let activeMenuDataByName = (menus, level) => {
					for (let i = 0; i < menus.length; i++) {
						if (menus[i].name == this.currentMenuName) {
							this.frozenMenuStatus(this.menuData);
							menus[i].isOpen = true;
							menus[i].isActive = true;
							if (level == 1) {
								// 找到第二菜单层级
								this.menuSidebarData = menus[i].items;
							}
							this.currentActiveMenu = menus[i];
							return true;
						} else if (menus[i].items && menus[i].items.length > 0 && activeMenuDataByName(menus[i].items, level + 1)) {
							menus[i].isOpen = true;
							menus[i].isActive = true;
							if (level == 1) {
								// 找到第二菜单层级
								this.menuSidebarData = menus[i].items;
							}
							return true;
						}
					}
					return false;
				};
				activeMenuDataByName(this.menuData, 1);
				this.currentMenuName = null;
			} else {
				let currentRouter = { name: this.currentRouter.name, query: JSON.parse(JSON.stringify(this.currentRouter.query)), params: JSON.parse(JSON.stringify(this.currentRouter.params)) };
				if (JSON.stringify(currentRouter.query) == "{}") {
					delete currentRouter.query;
				}
				if (JSON.stringify(currentRouter.params) == "{}") {
					delete currentRouter.params;
				}
				if (this.currentActiveMenu && (this.currentRouter.menuName == this.currentActiveMenu.name || site.utils.isEqual(currentRouter, JSON.parse(JSON.stringify(this.currentActiveMenu.route))))) {
					return;
				}
				let activeMenuDataByRoute = (menus, level) => {
					for (let i = 0; i < menus.length; i++) {
						if (menus[i].route && site.utils.isEqual(currentRouter, JSON.parse(JSON.stringify(menus[i].route)))) {
							this.frozenMenuStatus(this.menuData);
							if (level == 1) {
								// 找到第二菜单层级
								this.menuSidebarData = menus[i].items;
							}
							menus[i].isOpen = true;
							menus[i].isActive = true;
							this.currentActiveMenu = menus[i];
							return true;
						} else if (menus[i].items && menus[i].items.length > 0 && activeMenuDataByRoute(menus[i].items, level + 1)) {
							menus[i].isOpen = true;
							menus[i].isActive = true;
							if (level == 1) {
								// 找到第二菜单层级
								this.menuSidebarData = menus[i].items;
							}
							return true;
						}
					}
					return false;
				};
				// this.frozenMenuStatus(this.menuData);
				activeMenuDataByRoute(this.menuData, 1);
			}
		},
		// 修改当前页面所属的菜单名称
		changeMenuName(name) {
			this.customMenuName = name;
			this.activeMenuData();
		},
		toggleMenuCollapseState() {
			this.menuCollapseState = !this.menuCollapseState;
		},
		/**
		 * 顶部菜单点击事件
		 * @param menuData 当前点击的菜单数据
		 */
		menuClickEvent(menuData) {
			if (menuData.isOpen) {
				// 如果当前页面的菜单已经激活了，无需操作
				return;
			}
			// 其他菜单状态设置为false
			for (let i = 0; i < this.menuData.length; i++) {
				if (this.menuData[i].isActive) {
					this.menuData[i].isActive = false;
					this.menuData[i].isOpen = false;
					break;
				}
			}
			menuData.isActive = true;
			menuData.isOpen = true;
			this.menuSidebarData = menuData.items;
			// 第一个可以跳转路由的URL
			let firstMenus = [];
			let findMenuData = (menus, isAdd) => {
				if (isAdd) {
					firstMenus.push(menus[0]);
				}
				for (let i = 0; i < menus.length; i++) {
					if (menus[i].isActive && (!menus[i].items || menus[i].items.length == 0)) {
						return menus[i];
					} else if (menus[i].items && menus[i].items.length > 0) {
						let activeMenuData = findMenuData(menus[i].items, i == 0);
						if (activeMenuData) {
							return activeMenuData;
						}
					}
				}
				return null;
			};
			// 查找当前侧边菜单已经open状态的菜单
			let currentActiveMenu = findMenuData(this.menuSidebarData, true);
			if (!currentActiveMenu) {
				// 如果当前侧边菜单没有open状态的菜单就默认打开第一个
				for (let i = 0; i < firstMenus.length; i++) {
					firstMenus[i].isActive = true;
					firstMenus[i].isOpen = true;
				}
				currentActiveMenu = firstMenus[firstMenus.length - 1];
			}
			this.currentActiveMenu = currentActiveMenu;
			if (currentActiveMenu.route) {
				this.$router.push(currentActiveMenu.route);
			} else {
				site.log.error("当前菜单没有路由!");
			}
		},
		/**
		 * 侧边栏菜单点击事件
		 * @param menuData 当前点击的菜单数据
		 */
		menuSidebarClickEvent(menuData, parentMenuItem) {
			if (this.currentActiveMenu == menuData) {
				// 判断当前菜单是否是重复点击
				return;
			} else if (menuData.items && menuData.items.length > 0) {
				// 当前点击的是子菜单
				if (!menuData.isOpen) {
					parentMenuItem.find(function (item, index) {
						// 如果点击的菜单不是当前菜单且同级的菜单中有open状态的
						if (item.name != menuData.name && item.isOpen) {
							// 如果当前的菜单是激活状态
							if (!item.isActive) item.isOpen = false;
						}
					});
				}
				menuData.isOpen = !menuData.isOpen;
			} else {
				this.currentMenuName = menuData.name;
				this.activeMenuData(this.menuSidebarData);
				if (this.currentActiveMenu.route) {
					this.$router.push(this.currentActiveMenu.route);
				} else {
					site.log.error("当前菜单没有路由!");
				}
			}
		},
		// 只冻结已经open状态下的菜单
		// TOOD: 优化，只冻结已经open状态下的菜单
		frozenMenuStatus(menuData) {
			if (!menuData || menuData.length == 0) {
				return;
			}
			for (let i = 0; i < menuData.length; i++) {
				if (menuData[i].isActive) {
					menuData[i].isActive = false;
					menuData[i].isOpen = false;
					if (menuData[i].items && menuData[i].items.length > 0) {
						this.frozenMenuStatus(menuData[i].items);
					}
				}
			}
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
	min-height: 650px;
	padding-top: 45px;

	.side-bar {
		width: 224px;
		height: 100%;
		flex-shrink: 0;
	}

	.page-content {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.page-navbar {
			height: 38px;
			line-height: 38px;
			width: 100%;
			overflow: hidden;
			position: relative;
			z-index: 1;
			background-color: #fafafa;
			box-shadow: 4px 2px 4px 0 rgba(0, 0, 0, 0.15);
		}

		.page-body {
			flex: 1;
			height: 100%;
			background-color: #fff;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			position: relative;
			padding-left: 8px;
		}
	}
}
</style>
