/**
 * 作者：yujinjin9@126.com
 * 时间：2022-02-28
 * 页面视图管理
 */
import { App } from "/#/app";
import { defineStore } from "pinia";
import { randomId } from "@/utils/generate";
import { changeUrlParameter } from "@/utils/url";
import { Router, useRouter } from "vue-router";

export default defineStore("pageViews", {
    state: () => ({
        currentVisiteIndex: -1, // 当前正在访问的页面视图索引
        visitedViews: [] as App.PageView[] // 当前已经访问的页面视图列表
    }),
    actions: {
        /**
         * 通过点击菜单打开页面路由
         * @param menuId 菜单ID
         * @param menuName 菜单名称
         * @param menuUrl 菜单URL
         */
        openPageByMenu({ menuId, menuName, menuUrl }: { menuId: string; menuName: string; menuUrl: string }) {
            const findVisiteIndex = this.visitedViews.findIndex(item => item.menuId === menuId);
            if (findVisiteIndex === -1) {
                const pageView: App.PageView = {
                    id: randomId(),
                    menuId,
                    routeName: "",
                    routePath: "",
                    title: menuName,
                    fullPath: menuUrl,
                    isIframe: !/^\/\w{2}/.test(menuUrl) && menuUrl.indexOf(config.localDomain + "/") === -1,
                    isFixed: false
                };
                const router: Router = useRouter();
                if (pageView.isIframe) {
                    pageView.routeName = "external";
                    pageView.routePath = router.resolve({ name: "external", params: { id: pageView.id }, query: { fromMenuId: menuId } }).fullPath;
                } else {
                    menuUrl = changeUrlParameter(/^\/\w{2}/.test(menuUrl) ? menuUrl : menuUrl.substring(config.localDomain.length), "menuId", menuId);
                    pageView.routeName = router.resolve(menuUrl).name?.toString() || "";
                    pageView.routePath = menuUrl;
                }
                this.visitedViews.push(pageView);
                this.currentVisiteIndex = this.visitedViews.length;
            } else {
                this.currentVisiteIndex = findVisiteIndex;
            }
        },

        /**
         * 通过iframe外部页面打开页面
         * @param pageId 新开一个页面ID, 可不传。如果有传值判断当前已经打开的 tab 页里是否存在该 ID，存在的情况展示该 tab 页,不存在就新增一个 tab 页
         * @param fromPageId 来自当前页面的ID
         * @param title 页面标题
         * @param url 页面URL（也支持内部页面地址）
         */
        openPageByTabPage({ pageId, fromPageId, title, url }: { pageId?: string; fromPageId: string; title: string; url: string }) {
            const findPageIndex = this.visitedViews.findIndex(item => item.id === fromPageId);
            if (findPageIndex === -1) {
                logs.error("无法找到iframe页面");
                return;
            }
            if (pageId && this.visitedViews.findIndex(item => item.id === pageId) !== -1) {
                // 当前已经打开的 tab 页里是否存在该ID，直接展示该页面
                this.currentVisiteIndex = this.visitedViews.findIndex(item => item.id === pageId);
                return;
            }
            const pageView: App.PageView = {
                id: pageId || randomId(),
                fromPageId,
                routeName: "",
                routePath: "",
                title,
                fullPath: url,
                isIframe: !/^\/\w{2}/.test(url) && url.indexOf(config.localDomain + "/") === -1,
                isFixed: false
            };
            const router: Router = useRouter();
            if (pageView.isIframe) {
                pageView.routeName = "external";
                pageView.routePath = router.resolve({ name: "external", params: { id: pageView.id }, query: { fromPageId } }).fullPath;
            } else {
                url = changeUrlParameter(/^\/\w{2}/.test(url) ? url : url.substring(config.localDomain.length), "pageId", pageView.id);
                url = changeUrlParameter(url, "fromPageId", fromPageId);
                pageView.routeName = router.resolve(url).name?.toString() || "";
                pageView.routePath = url;
            }
            // 当前iframe所在是tab位置索引后面新增一个tab
            this.visitedViews.splice(findPageIndex, 0, pageView);
            this.currentVisiteIndex = findPageIndex + 1;
        },
        /**
         * 关闭所有的page
         */
        closeAllPageViews() {
            this.visitedViews = [];
        },
        /**
         * 关闭除此之外所有的page
         * @param index 除此的page索引
         */
        closeOtherPageViews(index: number) {
            this.visitedViews = [this.visitedViews[index]];
            this.currentVisiteIndex = 0;
        },
        /**
         * 关闭当前的page
         * @param index 当前的page索引
         */
        closePageViews(index: number) {
            this.visitedViews.splice(index, 1);
            if (this.visitedViews.length === 0) {
                this.currentVisiteIndex = -1;
            } else if (index === 0) {
                this.currentVisiteIndex = 0;
            } else {
                this.currentVisiteIndex = index - 1;
            }
        },
        /**
         * 切换page的固定状态
         * @param index 当前的page索引
         */
        toggleFixStatus(state, index: number) {
            state.visitedViews[index].isFixed = !state.visitedViews[index].isFixed;
        }
    }
});
