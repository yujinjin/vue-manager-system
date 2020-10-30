<template>
	<!--
		本次侧边菜单栏只支持3级菜单，而且一级菜单的文案只能是2个字
	-->
	<div class="side-nav-bar">
		<div class="main-menu-panel" v-if="menuData">
			<div class="menu-item" :class="{ active: menuItem.isActive, open: menuItem.isOpen }" v-for="menuItem in menuData" :key="menuItem.name" @click.stop.prevent="openMenu(menuItem)">
				<div class="icons-box">
					<svg-icon :value="menuItem.icon"></svg-icon>
				</div>
				<div class="menu-text">
					{{ menuItem.displayName }}
				</div>
			</div>
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
					<div class="menu-item" :class="{ active: childMenItem.isActive }" v-for="childMenItem in menuItem.items" :key="childMenItem.name" @click.stop.prevent="activeSubMenu(childMenItem)">
						<div class="menu-text">
							{{ childMenItem.displayName }}
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			menuData: null, // 菜单数据
			subMenuData: null, // 子菜单数据
			currentActiveMenu: null, // 当前激活的菜单数据
			currentMenuName: null, // 当前自定义菜单的名称
			isHasMenuEventTrigger: false // 是否有手动的菜单事件触发
		};
	},
	props: {
		customMenuName: {
			type: String,
			default: null
		},
		currentRouter: {
			type: Object,
			default: null
		}
	},
	watch: {
		customMenuName(val) {
			this.currentMenuName = val;
			this.$nextTick(() => {
				this.activeMenuData();
			});
		},
		currentRouter: {
			handler() {
				this.$nextTick(() => {
					this.activeMenuData();
				});
			},
			deep: true
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
				this.$message.error("没有主菜单数据");
				return;
			}
			//初始化菜单状态，不然不会跟踪变化
			let initMenuStatus = menus => {
				for (let i = 0; i < menus.length; i++) {
					menus[i].isOpen = false;
					menus[i].isActive = false;
					if (menus[i].items && menus[i].items.length > 0) {
						initMenuStatus(menus[i].items);
					}
				}
			};
			initMenuStatus(menuData);
			this.menuData = menuData;
			this.activeMenuData();
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
							menus[i].isOpen = true;
							menus[i].isActive = true;
							if (level == 1) {
								// 找到第二菜单层级
								this.subMenuData = menus[i].items;
							}
							return true;
						} else if (menus[i].items && menus[i].items.length > 0 && activeMenuDataByName(menus[i].items, level + 1)) {
							menus[i].isOpen = true;
							menus[i].isActive = true;
							if (level == 1) {
								// 找到第二菜单层级
								this.subMenuData = menus[i].items;
							}
						}
					}
					return false;
				};
				activeMenuDataByName(this.menuData, 1);
				this.currentMenuName = null;
			} else {
				let currentRouter = { name: this.currentRouter.name, query: this.currentRouter.query, params: this.currentRouter.params };
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
								this.subMenuData = menus[i].items;
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
								this.subMenuData = menus[i].items;
							}
							return true;
						}
					}
					return false;
				};
				activeMenuDataByRoute(this.menuData, 1);
			}
		},

		openMenu(menuItem) {
			if (menuItem.isOpen) return;
			// 把已经open状态的关闭掉
			this.menuData.find(item => {
				if (item.isOpen) {
					item.isOpen = false;
					item.isActive = false;
					return true;
				}
			});
			menuItem.isOpen = true;
			menuItem.isActive = true;
			this.subMenuData = menuItem.items;
		},

		activeSubMenu(menuItem) {
			if (!menuItem.items || menuItem.items.length == 0) {
				// 没有子菜单的菜单
				if (menuItem.isActive) {
					// 如果当前菜单已经跳转过了，无需再次跳转
					return;
				}
				if (!menuItem.route) {
					// 如果当前菜单没有路由
					this.$message.error("当前菜单没有配置路由地址，请去配置路由地址");
					return;
				}
				if (this.currentActiveMenu) {
					this.currentActiveMenu.isActive = false;
				}
				this.currentActiveMenu = menuItem;
				menuItem.isActive = true;
				this.$router.push(menuItem.route);
			} else {
				menuItem.isOpen = !menuItem.isOpen;
			}
		},
		// 冻结所有的菜单
		frozenMenuStatus(menuData) {
			if (!menuData || menuData.length == 0) {
				return;
			}
			for (let i = 0; i < menuData.length; i++) {
				menuData[i].isActive = false;
				menuData[i].isOpen = false;
				if (menuData[i].items && menuData[i].items.length > 0) {
					this.frozenMenuStatus(menuData[i].items);
				}
			}
		}
	},
	destroyed() {}
};
</script>
<style lang="less" scoped>
.side-nav-bar {
	display: flex;
	position: relative;

	&::after {
		content: "";
		position: absolute;
		left: 5px;
		right: 0px;
		top: 0px;
		bottom: 0px;
		background-color: #fff;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	.main-menu-panel,
	.sub-menu-panel {
		font-size: 14px;
		line-height: 40px;
		height: 100%;
		font-weight: 500;
		position: relative;
		z-index: 10;

		.menu-item {
			height: 40px;
			padding: 0px 10px;
			display: flex;
			cursor: pointer;

			&:hover {
				opacity: 0.9;
			}
		}
	}

	.main-menu-panel {
		width: 80px;
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
				font-size: 18px;
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
				font-size: 13px;
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
