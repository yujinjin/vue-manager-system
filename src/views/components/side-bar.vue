<template>
	<div class="side-nav-bar" :class="{ 'side-fixed': isFixed, collapse: menuCollapseState }">
		<div class="menu-list" v-if="menuSidebarData && menuSidebarData.length > 0">
			<div class="menu-item" @click.stop.prevent="menuClickEvent(menuItem, menuSidebarData)" v-for="menuItem in menuSidebarData" :key="menuItem.name">
				<a class="menu-dropdown" v-bind="{ href: getLink(menuItem) }" :class="{ active: menuItem.isActive && (!menuItem.items || menuItem.items.length == 0), open: menuItem.isOpen && menuItem.items && menuItem.items.length > 0 }">
					<svg-icon class="menu-icon" :value="menuItem.icon"></svg-icon>
					<span class="menu-text" v-show="!menuCollapseState"> {{ menuItem.displayName }} </span>
					<svg-icon class="menu-expand" v-show="!menuCollapseState" :class="{ open: menuItem.isOpen }" value="angle-right" v-if="menuItem.items && menuItem.items.length > 0"></svg-icon>
				</a>
				<div v-show="menuCollapseState" class="side-menu-box" :class="{ dropdown: menuItem.items && menuItem.items.length > 0 }">
					<span class="menu-text"> {{ menuItem.displayName }} </span>
					<svg-icon class="menu-expand" :class="{ open: menuItem.items && menuItem.items.length }" value="angle-right" v-if="menuItem.items && menuItem.items.length > 0"></svg-icon>
				</div>
				<div class="children-menu-list" :class="{ open: menuItem.isOpen }" v-if="menuItem.items && menuItem.items.length > 0">
					<div class="children-menu-item" @click.stop.prevent="menuClickEvent(childMenuItem, menuItem.items)" v-for="childMenuItem in menuItem.items" :key="childMenuItem.name" :class="{ active: childMenuItem.isActive }">
						<a class="menu-dropdown" v-bind="{ href: getLink(childMenuItem) }" :class="{ active: childMenuItem.isActive && (!childMenuItem.items || childMenuItem.items.length == 0), open: childMenuItem.isOpen && childMenuItem.items && childMenuItem.items.length > 0 }">
							<span class="menu-text"> {{ childMenuItem.displayName }} </span>
							<svg-icon class="menu-expand" :class="{ open: childMenuItem.isOpen }" value="angle-right" v-if="childMenuItem.items && childMenuItem.items.length > 0"></svg-icon>
						</a>
						<side-inner-menu v-show="childMenuItem.isOpen" @menuClick="menuClickEvent" :menuData="childMenuItem.items" v-if="childMenuItem.items && childMenuItem.items.length > 0"></side-inner-menu>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import sideInnerMenu from "./side-inner-menu";

export default {
	components: { sideInnerMenu },
	data() {
		return {
			isFixed: true // 边栏是否固定
		};
	},
	props: {
		menuSidebarData: {
			type: Array,
			require: true
		},
		menuCollapseState: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		getLink(menuItem) {
			if (menuItem.route) {
				return this.$router.resolve(menuItem.route).href || false;
			} else {
				return false;
			}
		},
		menuClickEvent(menuItem, parentMenuItem) {
			this.$emit("menuSidebarClick", menuItem, parentMenuItem);
		}
	},
	destroyed() {}
};
</script>
<style lang="less" scoped>
.side-nav-bar {
	height: 100%;
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

	.menu-list {
		position: absolute;
		left: 5px;
		right: 0px;
		top: 0px;
		bottom: 0px;
		z-index: 10;
		overflow-y: auto;
		overflow-x: hidden;

		&::-webkit-scrollbar {
			width: 4px;
			height: 1px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 6px;
			-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
			background: #BEBEBE;
		}

		&::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
			border-radius: 6px;
			background: #EDEDED;
		}

		> .menu-item {
			position: relative;

			&:last-child > a {
				border-bottom: 1px solid #f3f3f3;
			}

			a {
				display: flex;
				height: 38px;
				line-height: 36px;
				margin: 0;
				padding: 0 8px;
				text-shadow: none;
				font-size: 13px;
				text-decoration: none;
				color: #737373;
				cursor: pointer;
				position: relative;

				&::before {
					display: none;
					content: "";
					position: absolute;
					top: 0;
					bottom: 0;
					left: -4px;
					width: 4px;
					max-width: 4px;
					overflow: hidden;
					background-color: #2dc3e8;
				}

				&.active {
					color: #262626;
					background-color: #f5f5f5;

					&::before {
						display: block;
					}
				}

				&:hover {
					color: #262626;

					&:not(.open)::before {
						display: block;
						background-color: #fb6e52;
					}
				}

				.menu-icon {
					display: inline-block;
					vertical-align: middle;
					width: 30px;
					flex-shrink: 0;
					text-align: center;
					font-size: 14px;
					font-weight: normal;
					font-style: normal;
				}

				.menu-text {
					flex: 1;
					display: -webkit-box;
					word-break: break-all;
					text-overflow: ellipsis;
					overflow: hidden;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}

				.menu-expand {
					width: 30px;
					flex-shrink: 0;
					display: inline-block;
					font-size: 14px;
					text-align: center;
					padding: 0;
					text-shadow: none;
					color: #666;
					transition: all 300ms ease-in-out;

					&.open {
						transform: rotate(90deg);
					}
				}
			}

			> a {
				border-top: 1px solid #f3f3f3;
			}

			// &.active {
			// 	> a {
			// 		color: #262626;
			// 		background-color: #f5f5f5;
			// 	}

			// 	&:not(.open) > a::before {
			// 		display: block;
			// 	}

			// 	&.open > a {
			// 		background-color: #ffffff;
			// 	}
			// }

			// &:hover {
			// 	> a {
			// 		color: #262626;
			// 	}
			// }

			// &:not(.open) {
			// 	> a:hover::before {
			// 		display: block;
			// 		background-color: #fb6e52;
			// 	}
			// }

			.children-menu-list {
				box-shadow: inset 0 4px 4px -2px rgba(0, 0, 0, 0.15), inset 0 -4px 4px -2px rgba(0, 0, 0, 0.15);
				position: relative;
				display: none;

				&.open {
					display: block;
				}

				&::before {
					content: "";
					display: block;
					position: absolute;
					z-index: 1;
					left: 23px;
					top: 0;
					bottom: 19px;
					border-left: 1px solid #e2e2e2;
				}

				.children-menu-item {
					position: relative;

					&::before {
						content: "";
						display: inline-block;
						position: absolute;
						width: 5px;
						height: 5px;
						left: 21px;
						top: 17px;
						background-color: #fff;
						border: 1px solid #e2e2e2;
						z-index: 2;
					}

					&.active::before {
						background-color: #e2e2e2;
					}

					> a {
						padding-left: 40px;
					}
				}
			}
		}
	}

	&.collapse {
		width: 48px;

		> .menu-list > .menu-item {
			> a {
				padding: 0px 5px;
			}
			.side-menu-box {
				display: none;
				position: absolute;
				border: 0;
				top: 0;
				left: 45px;
				width: 195px;
				height: 38px;
				line-height: 38px;
				background-color: #fff;
				border-bottom: 1px solid #f3f3f3;
				padding-left: 10px;
				z-index: 101;
				cursor: pointer;
				box-shadow: 5px 5px 5px -5px rgba(0, 0, 0, 0.3), 5px 5px 5px -5px rgba(0, 0, 0, 0.3), 5px -5px 5px -5px rgba(0, 0, 0, 0.3);

				&.dropdown {
					box-shadow: none;
				}

				.menu-text {
					flex: 1;
					display: -webkit-box;
					word-break: break-all;
					text-overflow: ellipsis;
					overflow: hidden;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}

				.menu-expand {
					width: 40px;
					flex-shrink: 0;
					display: inline-block;
					font-size: 14px;
					text-align: center;
					padding: 0;
					text-shadow: none;
					color: #666;
					transition: all 300ms ease-in-out;

					&.open {
						transform: rotate(90deg);
					}
				}
			}

			.children-menu-list {
				background: #fbfbfb;
				position: absolute;
				z-index: 100;
				left: 45px;
				top: 0;
				width: 195px;
				padding-top: 38px;
				border-left: 1px solid #f3f3f3;
				display: none;
				box-shadow: 5px 5px 5px -5px rgba(0, 0, 0, 0.3), 5px 5px 5px -5px rgba(0, 0, 0, 0.3), 5px -5px 5px -5px rgba(0, 0, 0, 0.3);

				&::before {
					display: none;
				}

				.children-menu-item {
					> a {
						padding-left: 25px;
					}

					&::before {
						display: none;
					}
				}
			}

			&:hover {
				.children-menu-list {
					display: block;
				}

				.side-menu-box {
					display: flex;
				}
			}
		}
	}
}
</style>
