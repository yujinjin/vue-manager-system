<template>
	<div class="page-tabs-bar">
		<div class="icon-box" @click="scrollEvent('left')">
			<svg-icon value="backward"></svg-icon>
		</div>
		<div class="page-tabs" ref="page-tabs">
			<div class="page-tabs-inner">
				<div class="page-tab" :class="{ active: pageTab.active }" :ref="'page-tab' + index" @click="showPageTab(index)" v-for="(pageTab, index) in $store.state.pageTabs.tabBarViews" :key="pageTab.fullPath">
					{{ pageTab.title }}
					<i v-if="index != 0" @click.stop.prevent="closePageTab(index)" class="el-icon-circle-close" />
				</div>
			</div>
		</div>
		<div class="icon-box" @click="scrollEvent('right')">
			<svg-icon value="forward"></svg-icon>
		</div>
		<el-dropdown size="default" @command="pageTabHandle">
			<span class="el-dropdown-link">
				<i class="el-icon-caret-bottom"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="refresh" icon="el-icon-refresh">刷新</el-dropdown-item>
				<el-dropdown-item command="closeCurrent" icon="el-icon-close">关闭当前</el-dropdown-item>
				<el-dropdown-item command="closeOther" icon="el-icon-folder-delete">关闭其他</el-dropdown-item>
				<el-dropdown-item command="closeAll" icon="el-icon-delete">全部关闭</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>
<script>
import IScroll from "iscroll";

export default {
	data() {
		return {
			iscrollInstance: null,
			activeIndex: 0, // 当前激活的
			pageTabNumber: 0 // 当前页面的tab数量
		};
	},
	watch: {
		"$store.state.pageTabs.tabBarViews": {
			handler(val) {
				this.initPageTabsStore();
			},
			deep: true
		}
	},
	mounted() {
		this.initPageTabsStore();
		$(window).on("load resize", this.initPageTabs);
	},
	methods: {
		initPageTabsStore() {
			let activeIndex = this.$store.state.pageTabs.tabBarViews.findIndex(item => item.active);
			if (this.$store.state.pageTabs.tabBarViews.length != this.pageTabNumber) {
				this.initPageTabs().then(() => {
					this.scrollToElement(activeIndex);
				});
				this.pageTabNumber = this.$store.state.pageTabs.tabBarViews.length;
				this.activeIndex = activeIndex;
			} else if (this.activeIndex != activeIndex) {
				this.activeIndex = activeIndex;
				this.scrollToElement(this.activeIndex);
			}
		},
		initPageTabs() {
			return new Promise(resolve => {
				this.$nextTick(() => {
					let allWidth = $(this.$refs["page-tabs"]).outerWidth();
					let buttonBoxs = $(this.$refs["page-tabs"]).find(".page-tab");
					let realWidth = 0;
					for (let i = 0; i < buttonBoxs.length; i++) {
						realWidth += buttonBoxs[i].getBoundingClientRect().width;
					}
					if (realWidth >= allWidth) {
						$(this.$refs["page-tabs"])
							.find(".page-tabs-inner")
							.width(realWidth);
						if (!this.iscrollInstance) {
							this.iscrollInstance = new IScroll(this.$refs["page-tabs"], {
								eventPassthrough: true,
								scrollX: true,
								scrollY: false,
								preventDefault: false
							});
						} else {
							this.iscrollInstance.refresh();
						}
					} else if (realWidth < allWidth) {
						if (this.iscrollInstance) {
							this.iscrollInstance.destroy();
							this.iscrollInstance = null;
						}
					}
				});
				resolve();
			});
		},
		scrollToElement(index) {
			if (!this.iscrollInstance) {
				return;
			}
			let tabElement = this.$refs["page-tab" + index];
			if (tabElement.length == 1) {
				tabElement = tabElement[0];
			}
			this.iscrollInstance.scrollToElement(tabElement, 1000, -100, 0);
		},
		/**
		 * 手动滑动事件
		 * @param direction 滑动的方向 left|right
		 */
		scrollEvent(direction) {
			if (!this.iscrollInstance) {
				return;
			}
			if (direction == "left") {
				this.iscrollInstance.scrollTo(0, 0, 1000);
			} else if (direction == "right") {
				this.iscrollInstance.scrollTo(
					$(this.$refs["page-tabs"]).outerWidth() -
						$(this.$refs["page-tabs"])
							.find(".page-tabs-inner")
							.outerWidth(),
					0,
					1000
				);
			}
		},
		// 关闭当前页面
		closePageTab(index) {
			if (index == this.activeIndex) {
				this.pageTabHandle("closeCurrent");
			} else {
				this.$store.dispatch("deleteRouteByIndex", index);
			}
		},
		showPageTab(index) {
			if (index == this.activeIndex) {
				return;
			}
			let pageTab = this.$store.state.pageTabs.tabBarViews[index];
			this.$router.push({ name: pageTab.name, query: JSON.parse(pageTab.query), params: JSON.parse(pageTab.params) });
			this.scrollToElement(index);
		},
		/**
		 * 页面tab操作
		 */
		pageTabHandle(command) {
			if (command == "refresh") {
				// 刷新
				let pageTab = this.$store.state.pageTabs.tabBarViews[this.activeIndex];
				this.$router.replace({ name: "redirect", query: { route: JSON.stringify({ name: pageTab.name, query: JSON.parse(pageTab.query), params: JSON.parse(pageTab.params) }) } });
			} else if (command == "closeCurrent") {
				if (this.activeIndex == 0 || this.pageTabNumber == 1) {
					return;
				}
				let pageTab = null;
				// 关闭当前
				if (this.activeIndex == this.pageTabNumber - 1) {
					pageTab = this.$store.state.pageTabs.tabBarViews[this.activeIndex - 1];
				} else {
					pageTab = this.$store.state.pageTabs.tabBarViews[this.activeIndex + 1];
				}
				this.$store.dispatch("deleteRouteByIndex", this.activeIndex);
				this.$router.push({ name: pageTab.name, query: JSON.parse(pageTab.query), params: JSON.parse(pageTab.params) });
			} else if (command == "closeOther") {
				// 关闭其他
				this.$store.dispatch("deleteOtherRoute");
			} else if (command == "closeAll") {
				// 关闭其他
				this.$store.dispatch("deleteAllRoute");
				this.$router.push({ name: "home" });
			}
		}
	},
	destroyed() {
		$(window).off("load resize", this.initPageTabs);
		if (this.iscrollInstance) {
			this.iscrollInstance.destroy();
		}
	}
};
</script>
<style lang="less" scoped>
.page-tabs-bar {
	display: flex;

	.icon-box {
		width: 35px;
		color: #999;
		display: flex;
		font-size: 15px;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		background-color: #ffffff;
		border-left: 1px solid #eee;
		border-right: 1px solid #eee;
		flex-shrink: 0;

		&:hover {
			background-color: #f2f2f2;
		}
	}

	.page-tabs {
		flex: 1;
		width: 100%;
		overflow: hidden;

		.page-tabs-inner {
			height: 38px;
			width: 100%;

			.page-tab {
				display: inline-block;
				padding: 0 15px;
				transition: all 0.3s ease-out 0s;
				color: #999;
				border-right: 1px solid #eeeeee;
				cursor: pointer;

				i {
					color: #ccc;
					margin-left: 3px;
					font-size: 14px;
					width: 14px;
					display: inline-block;

					&:hover {
						color: #f56c6c;
					}
				}

				&:hover {
					background-color: #f2f2f2;
				}

				&.active {
					color: #409eff;
					background-color: #eaedf1;
				}
			}
		}
	}

	.el-dropdown .el-dropdown-link {
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 30px;
		cursor: pointer;
		color: #999;
		background-color: #ffffff;

		&:hover {
			background-color: #ffffff;
		}
	}
}
</style>
