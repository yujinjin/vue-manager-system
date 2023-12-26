/**
 * 作者：yujinjin9@126.com
 * 时间：2022-02-28
 * 页面视图管理
 */
import type { App } from "/#/app";
import { defineStore } from "pinia";
import { randomId } from "@yujinjin/utils";
import { isExternalLink } from "@/utils/index";
import { externalRoutePath, innerRoutePath } from "@/routers";


export default defineStore("pageViews", {
    state: () => ({
        currentVisiteIndex: 0, // 当前正在访问的页面视图索引
        visitedViews: [] as App.PageView[] // 当前已经访问的页面视图列表
    }),
    actions: {
        /**
         * 通过点击菜单打开页面路由
         * @param object { id: 菜单ID, name: 菜单名称, url: 菜单URL, routePath: 路由路径, externalLink: 是否外链 }
         */
        openPageByMenu({ id, name, url, routePath = "", externalLink = false }: { id: string; name: string; url: string, routePath?: string, externalLink?: boolean }) {
            const findVisiteIndex = this.visitedViews.findIndex(item => item.menuId === id);
            if (findVisiteIndex === -1) {
                if(!routePath) {
                    // 如果当前菜单没有传地址
                    externalLink = isExternalLink(url);
                    if(externalLink) {
                        routePath = externalRoutePath({ menuId: id });
                    } else {
                        routePath = innerRoutePath(url, { menuId: id })
                    }
                }
                const pageView: App.PageView = {
                    id: randomId(),
                    menuId: id,
                    routePath,
                    title: name,
                    fullPath: url,
                    isIframe: externalLink,
                    isFixed: false
                };
                this.visitedViews.push(pageView);
                this.currentVisiteIndex = this.visitedViews.length - 1;
            } else {
                this.currentVisiteIndex = findVisiteIndex;
            }
        },

        /**
         * 通过iframe外部页面打开（展示）页面
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
                routePath: "",
                title,
                fullPath: url,
                isIframe: isExternalLink(url),
                isFixed: false
            };
            if (pageView.isIframe) {
                pageView.routePath = externalRoutePath({ pageId: pageView.id });
            } else {
                pageView.routePath = innerRoutePath(url, { pageId: pageView.id })
            }
            // 当前iframe所在是tab位置索引后面新增一个tab
            this.visitedViews.splice(findPageIndex + 1, 0, pageView);
            this.currentVisiteIndex = findPageIndex + 1;
        },
        /**
         * 关闭所有的page(除固定的page外)
         */
        closeAllPageViews() {
            this.visitedViews = this.visitedViews.filter(item => item.isFixed);
        },
        /**
         * 关闭除此之外所有的page(除固定的page外)
         * @param index 除此之外的page索引
         */
        closeOtherPageViews(index: number) {
            const currentPageId = this.visitedViews[index].id;
            this.visitedViews = this.visitedViews.filter((item, i) => item.isFixed || index === i);
            this.currentVisiteIndex = this.visitedViews.findIndex(item => item.id === currentPageId);
        },
        /**
         * 关闭当前的page
         * @param index 当前的page索引
         */
        closePageViews(index: number) {
            this.visitedViews.splice(index, 1);
            if(this.currentVisiteIndex === index) {
                if (this.visitedViews.length === 0) {
                    this.currentVisiteIndex = -1;
                } else if (index === 0) {
                    this.currentVisiteIndex = 0;
                } else {
                    this.currentVisiteIndex = index - 1;
                }
            }
        },
        /**
         * 切换page的固定状态
         * @param index 当前的page索引
         */
        toggleFixStatus(index: number) {
            this.visitedViews[index].isFixed = !this.visitedViews[index].isFixed;
        }
    }
});
