<template>
	<div class="side-nav-bar" :class="{ 'side-fixed': isFixed }">
		<div class="main-menu-panel" v-if="menuData">
			<div class="menu-item" :class="{ active: menuItem.isActive, open: menuItem.isOpen }" v-for="menuItem in menuData" :key="menuItem.name" @click.stop.prevent="openMenu(menuItem)">
				<div class="icons-box">
					<svg-icon :value="menuItem.icon"></svg-icon>
				</div>
				<div class="menu-text">
					{{ menuItem.displayName }}
				</div>
			</div>
			<!-- <div class="menu-item">
				<div class="icons-box">
					<svg-icon value="table"></svg-icon>
				</div>
				<div class="menu-text">
					概况
				</div>
			</div>
			<div class="menu-item active">
				<div class="icons-box">
					<svg-icon value="table"></svg-icon>
				</div>
				<div class="menu-text">
					测试
				</div>
			</div>
			<div class="menu-item">
				<div class="icons-box">
					<svg-icon value="table"></svg-icon>
				</div>
				<div class="menu-text">
					测试
				</div>
			</div> -->
		</div>
		<div class="sub-menu-panel" v-if="subMenuData">
			<template v-for="menuItem in subMenuData">
				<div class="menu-item" :class="{ active: menuItem.isActive }" :key="menuItem.name" @click.stop.prevent="activeSubMenu(menuItem)">
					<div class="menu-text">
						{{ menuItem.displayName }}
					</div>
					<div class="icons-box" v-if="menuItem.items && menuItem.items.length > 0">
						<svg-icon value="angle-right" :class="{ open: menuItem.isOpen }"></svg-icon>
					</div>
				</div>
				<div class="child-menu-panel" :key="menuItem.name + '_child'" v-if="menuItem.items && menuItem.items.length > 0" v-show="menuItem.isOpen">
					<div class="menu-item" :class="{ active: childMenItem.isActive }" v-for="childMenItem in menuItem.items" :key="childMenItem.name" @click.stop.prevent="activeSubMenu(menuItem)">
						<div class="menu-text">
							{{ childMenItem.displayName }}
						</div>
					</div>
				</div>
			</template>

			<!-- <div class="menu-item">
				<div class="menu-text">
					测试
				</div>
				<div class="icons-box">
					<svg-icon value="angle-right"></svg-icon>
				</div>
			</div>
			<div class="menu-item">
				<div class="menu-text">
					测试
				</div>
				<div class="icons-box">
					<svg-icon value="angle-right" class="open"></svg-icon>
				</div>
			</div>
			<div class="child-menu-panel">
				<div class="menu-item">
					<div class="menu-text">
						测试
					</div>
				</div>
				<div class="menu-item active">
					<div class="menu-text">
						测试
					</div>
				</div>
			</div>
			<div class="menu-item">
				<div class="menu-text">
					测试
				</div>
				<div class="icons-box">
					<svg-icon value="angle-right"></svg-icon>
				</div>
			</div> -->
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			isFixed: true, // 边栏是否固定
			menuData: null, // 菜单数据
			subMenuData: null, // 子菜单数据
			isHasMenuEventTrigger: false, // 是否有手动的菜单事件触发
			menuConfig: {
				"Boss.Application.Main.AuthCenter": {
					icon: "form"
				}, // 认证
				"Boss.Application.Main.AuthCenter.Identity.Roles": {
					route: {
						name: "home"
					}
				}, // 角色管理
				"Boss.Application.Main.AuthCenter.Identity.Users": {
					route: {
						name: "home"
					}
				}, // 用户管理
				"Boss.Application.Main.AuthCenter.IdentityServer": {
					icon: "table"
				}, // 授权
				"Boss.Application.Main.AuthCenter.IdentityServer.IdentityResources": {
					route: {
						name: "home"
					}
				}, // 身份资源
				"Boss.Application.Main.AuthCenter.IdentityServer.Clients": {
					route: {
						name: "home"
					}
				}, // 客户端管理
				"Boss.Application.Main.AuthCenter.IdentityServer.ApiResources": {
					route: {
						name: "home"
					}
				}, // Api资源管理
				"Boss.Application.Main.AuthCenter.IdentityServer.PersistedGrants": {
					route: {
						name: "home"
					}
				},
				commonTable: {
					route: {
						name: "commonTable"
					}
				},
				commonForm: {
					route: {
						name: "commonForm"
					}
				}
			} // 菜单数据配置
		};
	},
	props: {
		customMenuName: {
			type: String,
			default: null
		}
	},
	watch: {
		customMenuName() {
			if (!this.isHasMenuEventTrigger && this.menuData) {
				// 如果没有手动菜单事件触发过，可以重新初始化激活菜单
				this.initActiveMenuData();
			}
		}
	},
	created() {
		this.queryMenuList();
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
				site.toastr.error("没有主菜单数据");
				return;
			}
			// 找到main菜单数据，目前这个对象写死
			let mainMenu = menuData.find(menuItem => menuItem.name == "Main");
			if (!mainMenu) {
				site.toastr.error("没有主菜单数据");
				return;
			}
			mainMenu = mainMenu.items;
			//初始化菜单状态，不然不会跟踪变化
			let initMenuStatus = menus => {
				for (let i = 0; i < menus.length; i++) {
					menus[i].isOpen = false;
					menus[i].isActive = false;
					if (this.menuConfig[menus[i].name]) {
						Object.assign(menus[i], this.menuConfig[menus[i].name]);
					}
					if (menus[i].items && menus[i].items.length > 0) {
						initMenuStatus(menus[i].items);
					}
				}
			};
			initMenuStatus(mainMenu);
			this.menuData = mainMenu;
			console.info(".........initMenuData");
			this.initActiveMenuData();
		},

		// 初始化激活菜单数据
		initActiveMenuData() {
			let menuName = this.customMenuName;
			if (!menuName) {
				let currentRouter = { name: this.$route.name, query: this.$route.query, params: this.$route.params };
				if (JSON.stringify(currentRouter.query) == "{}") {
					delete currentRouter.query;
				}
				if (JSON.stringify(currentRouter.params) == "{}") {
					delete currentRouter.params;
				}
				for (let key in this.menuConfig) {
					if (this.menuConfig[key].route && site.utils.isEqual(currentRouter, JSON.parse(JSON.stringify(this.menuConfig[key].route)))) {
						menuName = key;
						break;
					}
				}
			}
			if (!menuName) {
				site.log.info("没有此菜单数据");
				return;
			}
			let activeMenuData = (menus, level) => {
				for (let i = 0; i < menus.length; i++) {
					if (menus[i].name == menuName) {
						menus[i].isOpen = true;
						menus[i].isActive = true;
						if (level == 1) {
							// 找到第二菜单层级
							this.subMenuData = menus[i].items;
						}
						return true;
					} else if (menus[i].items && menus[i].items.length > 0 && activeMenuData(menus[i].items, level + 1)) {
						menus[i].isOpen = true;
						menus[i].isActive = true;
						return true;
					}
				}
				return false;
			};
			activeMenuData(this.menuData, 1);
		},

		// 激活菜单事件状态
		avtiveMenuEventTriggerStatus() {
			if (!this.isHasMenuEventTrigger) {
				this.isHasMenuEventTrigger = true;
			}
		},

		openMenu(menuItem) {
			this.avtiveMenuEventTriggerStatus();
			if (menuItem.isOpen) return;
			// 把已经open状态的关闭掉
			this.menuData.find(item => {
				if (item.isOpen) {
					item.isOpen = false;
					return true;
				}
			});
			menuItem.isOpen = true;
			this.subMenuData = menuItem.items;
		},

		activeSubMenu(menuItem) {
			this.avtiveMenuEventTriggerStatus();
			if (!menuItem.items || menuItem.items.length == 0) {
				// 没有子菜单的菜单
				if (menuItem.isActive) {
					// 如果当前菜单已经跳转过了，无需再次跳转
					return;
				}
				if (!menuItem.route) {
					// 如果当前菜单没有路由
					site.toastr.error("当前菜单没有配置路由地址，请去配置路由地址");
					return;
				}
				this.changeMenuStatus();
				menuItem.isActive = true;
				this.$router.push(menuItem.route);
			} else {
				menuItem.isOpen = !menuItem.isOpen;
			}
		},
		changeMenuStatus() {
			let activeMenuData = this.menuData.find(item => item.isActive);
			if (activeMenuData) {
				activeMenuData.isActive = false;
				activeMenuData.items.find(item => {
					if (item.items && item.items.length > 0) {
						item = item.items.find(childItem => childItem.isActive);
					}
					if (item && item.isActive) {
						item.isActive = false;
						return true;
					}
				});
			}
			let openMenuData = this.menuData.find(item => item.isOpen);
			if (openMenuData) {
				openMenuData.isActive = true;
			}
		}
	},
	destroyed() {}
};
</script>
<style lang="less" scoped>
.side-nav-bar {
	height: 100%;
	display: flex;

	.side-fixed {
		position: fixed;
		left: 0px;
		top: 0px;
		bottom: 0px;
		padding-top: 60px;
	}

	.main-menu-panel,
	.sub-menu-panel {
		font-size: 14px;
		line-height: 40px;
		height: 100%;
		font-weight: 500;

		.menu-item {
			height: 40px;
			padding: 0px 20px;
			display: flex;
			cursor: pointer;

			&:hover {
				opacity: 0.9;
			}
		}
	}

	.main-menu-panel {
		width: 100px;
		background-color: #001529;
		height: 100%;
		// padding: 10px 0px;

		.menu-item {
			color: #cccccc;

			&:hover {
				background-color: #00498d;
			}

			&.open {
				background-color: #00498d;
				color: #ffff;
			}

			&.active {
				background-color: #1890ff;
				color: #ffff;
			}

			.icons-box {
				width: 20px;
			}

			.menu-text {
				flex: 1;
				padding-left: 5px;
			}
		}
	}

	.sub-menu-panel {
		flex: 1;
		background-color: #e8eff5;
		// padding: 10px 0px;

		.menu-item {
			justify-content: space-between;
			color: #333333;
			background-color: #ffff;
			border-bottom: 1px solid #e8eff5;

			&.active {
				color: #209fff;
			}

			&:hover {
				background-color: #f5f5f5;
			}

			.icons-box {
				width: 10px;

				i.icon {
					transition: all 300ms ease-in-out;

					&.open {
						transform: rotate(90deg);
					}
				}
			}

			.menu-text {
				flex: 1;
				padding-left: 5px;
			}
		}

		.child-menu-panel .menu-item {
			color: #666666;
			font-weight: normal;

			&.active {
				color: #209fff;
			}
		}
	}
}
</style>
