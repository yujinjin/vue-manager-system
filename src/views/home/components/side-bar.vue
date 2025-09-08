<template>
    <div v-loading="isLoadingForMenus" class="side-bar" :class="{ collapse: menuCollapseState }" element-loading-text="加载菜单中...">
        <div v-show="!menuCollapseState" class="search-box">
            <el-select v-model="searchSelectValue" filterable remote default-first-option value-key="id" placeholder="搜索菜单" :remote-method="searchMenuHandle" @change="menuSelectChange">
                <el-option v-for="item in searchMenuList" :key="item.value.id" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <el-scrollbar ref="scrollbarRef" class="menus-wrapper">
            <el-menu :default-active="currentMenuId" :collapse="menuCollapseState" @select="selectedMenuHandle">
                <menu-list :menu-tree-data="menuTreeData" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import { type Router } from "vue-router";
import { ref, watch } from "vue";
import { ElMessageBox, ElScrollbar } from "element-plus";
import { useRouter } from "vue-router";
import { type MenuTree } from "../menu-tree";
import menuList from "./menu-list.vue";
import systemAPI from "@api/system";
import { pageViewsStore } from "@/stores";
import logs from "@/services/logs";

defineProps({
    menuCollapseState: Boolean
});

const emits = defineEmits(["loaded", "navigationChange"]);

const pageViews = pageViewsStore();

const router: Router = useRouter();

// 当前选中的菜单ID
const currentMenuId = ref<string>();

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

const isLoadingForMenus = ref(true);

// 菜单搜索所选中的选项
const searchSelectValue = ref<MenuTree>();

// 当前菜单搜索出来的选项列表
const searchMenuList = ref<
    Array<{
        label: string;
        value: MenuTree;
    }>
>([]);

// 菜单树数据
const menuTreeData = ref<MenuTree[]>([]);

// 初始化当前页面导航（面包屑）名称列表
const initCurrentNavigationNames = function () {
    if (menuTreeData.value.length === 0) {
        return;
    }

    const breadcrumbNames: Array<string> = [];

    // 查找菜单名称
    const findMenuNames = function (menuList: MenuTree[], menuId: string) {
        menuList.find(menu => {
            if (menuId.startsWith(menu.id)) {
                breadcrumbNames.push(menu.name);
                if (menu.childList.length > 0) {
                    findMenuNames(menu.childList, menuId);
                }
                return true;
            }
            return false;
        });
    };
    let menuId = pageViews.visitedViews[pageViews.currentVisiteIndex]?.menuId;
    if (pageViews.visitedViews[pageViews.currentVisiteIndex]?.id === "welcome") {
        breadcrumbNames.push("首页");
    } else if (!menuId) {
        // 如果当前页不是从菜单里进来的，这里追溯到来自菜单的名称
        let findIndex = pageViews.currentVisiteIndex;
        while (!menuId && findIndex !== -1) {
            findIndex = pageViews.visitedViews.findIndex(view => view.id === pageViews.visitedViews[findIndex].fromPageId);
            menuId = pageViews.visitedViews[findIndex]?.menuId;
        }
        if (pageViews.visitedViews[findIndex]?.id === "welcome") {
            breadcrumbNames.push("首页");
        } else if (menuId) {
            findMenuNames(menuTreeData.value, menuId!);
        }
        breadcrumbNames.push(pageViews.visitedViews[pageViews.currentVisiteIndex].title);
    } else {
        findMenuNames(menuTreeData.value, menuId!);
    }
    emits("navigationChange", breadcrumbNames);
};

// 初始化菜单树数据
const initMenuTreeData = async function () {
    const menuTreeList: Array<Record<string, any>> = (await systemAPI.queryLoginUserMenus<Array<Record<string, any>>>()) as Array<Record<string, any>>;
    isLoadingForMenus.value = false;
    if (!menuTreeList || menuTreeList.length === 0) {
        // 当前用户还没有配置任何菜单
        ElMessageBox.alert("当前用户还没有配置任何菜单信息，请联系系统管理员", "提示", { type: "warning" });
        return;
    }
    const tempMenuTreeList: MenuTree[] = [];
    menuTreeList.forEach(item => {
        const menuTree: MenuTree = {
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            icons: item.icons,
            url: item.url,
            moduleCode: item.moduleCode,
            childList: []
        };
        if (!item.parentId) {
            menuTreeData.value.push(menuTree);
        } else {
            tempMenuTreeList.push(menuTree);
        }
    });
    let newMenuList: MenuTree[] = menuTreeData.value;
    while (newMenuList.length > 0 && tempMenuTreeList.length > 0) {
        const tempNewMenuList: MenuTree[] = [];
        for (let i = 0; i < tempMenuTreeList.length; i++) {
            const findMenu = newMenuList.find(tree => tree.id === tempMenuTreeList[i].parentId);
            if (findMenu) {
                findMenu.childList.push(tempMenuTreeList[i]);
                tempNewMenuList.push(tempMenuTreeList[i]);
                tempMenuTreeList.splice(i, 1);
                --i;
            }
        }
        newMenuList = tempNewMenuList;
    }
    emits("loaded", menuTreeData.value);
    initCurrentNavigationNames();
    // // 查找父级菜单
    // const findParentMenu = function(menuList: MenuTree[], menuTree: MenuTree): MenuTree | null {
    //     if(menuList.length === 0) {
    //         return null;
    //     }
    //     const findMenu = menuList.find(tree => menuTree.id.startsWith(tree.id));
    //     if(!findMenu || findMenu.childList.length === 0) {
    //         return null;
    //     } else if(findMenu.id === menuTree.id) {
    //         return findMenu;
    //     } else {
    //         return findParentMenu(findMenu.childList, menuTree);
    //     }
    // }
};

// 搜索菜单操作
const searchMenuHandle = function (query: string) {
    if (menuTreeData.value.length === 0) {
        return;
    }
    logs.debug("..........searchMenuHandle");
    // 匹配菜单名称
    const matchMenuTreeName = function (menuList: MenuTree[], menuNames: Array<string>, isAllInsert: boolean) {
        menuList.forEach(menu => {
            if (menu.childList.length > 0 || isAllInsert || menu.name.includes(query)) {
                const newMenuNames = menuNames.slice(0);
                newMenuNames.push(menu.name);
                if (menu.childList.length > 0) {
                    matchMenuTreeName(menu.childList, newMenuNames, isAllInsert || menu.name.includes(query));
                } else {
                    searchMenuList.value.push({ label: newMenuNames.join(" / "), value: menu });
                }
            }
        });
    };
    searchMenuList.value = [];
    query = query?.trim();
    if (query) {
        matchMenuTreeName(menuTreeData.value, [], false);
    }
};

// 菜单链接跳转
const gotoPage = function (menu: MenuTree) {
    pageViews.openPageByMenu({ id: menu.id, url: menu.url, name: menu.name });
    router.push(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
};

// 菜单选择变化
const menuSelectChange = function (menu: MenuTree) {
    searchSelectValue.value = undefined;
    gotoPage(menu);
};

// 菜单激活回调
const selectedMenuHandle = function (key: string, keyPath: string[]) {
    let findMenu = menuTreeData.value.find(menu => menu.id === keyPath[0]);
    let i = 1;
    while (findMenu && i < keyPath.length) {
        findMenu = findMenu.childList.find(menu => menu.id === keyPath[i]);
        i++;
    }
    if (findMenu) {
        gotoPage(findMenu);
    }
};

// 监控当前页面tab page 的变化
watch(
    () => pageViews.visitedViews[pageViews.currentVisiteIndex]?.id,
    () => {
        if (pageViews.visitedViews[pageViews.currentVisiteIndex]?.menuId) {
            currentMenuId.value = pageViews.visitedViews[pageViews.currentVisiteIndex].menuId;
        }
        initCurrentNavigationNames();
    },
    {
        immediate: true
    }
);

initMenuTreeData();
</script>
<style lang="scss" scoped>
.side-bar {
    width: 224px;
    height: 100%;
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    position: relative;
    // transition: all 300ms ease-in-out;

    &.collapse {
        width: 58px;
    }

    &::after {
        content: "";
        position: absolute;
        right: 1px;
        top: 0px;
        bottom: 0px;
        width: 1px;
        background-color: #fff;
        box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.1);
        z-index: 1;
    }

    .search-box {
        width: 100%;
        padding: 10px;

        :deep(.el-select) {
            width: 100%;

            .el-input__wrapper {
                border-radius: 4px;
            }
        }
    }

    .menus-wrapper {
        flex: 1;
        // padding-right: 4px;

        :deep(.el-menu) {
            border-right: 0px;
            --el-menu-base-level-padding: 12px;
            --el-menu-level-padding: 12px;
            --el-menu-icon-width: 24px;
            --el-menu-item-height: 44px;
            --el-menu-item-font-size: 14px;
            --el-menu-sub-item-height: 44px;

            .el-sub-menu__title,
            .el-menu-item {
                .el-icon {
                    color: #909399;
                    font-size: 14px;
                }
                .menu-text {
                    width: 100%;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: left;
                    color: #303133;
                }

                &:hover {
                    .menu-text,
                    .el-icon {
                        color: var(--el-color-primary);
                    }
                }

                &.is-active {
                    background-color: var(--el-menu-hover-bg-color);

                    &::after {
                        position: absolute;
                        content: "";
                        z-index: 1;
                        right: 0px;
                        top: 0px;
                        bottom: 0px;
                        width: 1px;
                        background-color: #15c359;
                    }

                    .menu-text,
                    .el-icon {
                        color: var(--el-color-primary);
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.side-bar-menu-popper {
    --el-menu-base-level-padding: 12px;
    --el-menu-level-padding: 12px;
    --el-menu-icon-width: 24px;
    --el-menu-item-height: 44px;
    --el-menu-item-font-size: 12px;
    --el-menu-sub-item-height: 44px;

    .el-sub-menu__title,
    .el-menu-item {
        .el-icon {
            color: #909399;
            font-size: 14px;
        }
        .menu-text {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            color: #303133;
        }

        &:hover {
            .menu-text,
            .el-icon {
                color: var(--el-color-primary);
            }
        }

        &.is-active {
            background-color: var(--el-menu-hover-bg-color);

            &::after {
                position: absolute;
                content: "";
                z-index: 1;
                right: 0px;
                top: 0px;
                bottom: 0px;
                width: 1px;
                background-color: #15c359;
            }

            .menu-text,
            .el-icon {
                color: var(--el-color-primary);
            }
        }
    }
}
</style>
