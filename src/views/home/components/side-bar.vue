<template>
    <div class="side-bar" :class="{ collapse: menuCollapseState }" v-loading="isLoadingForMenus" element-loading-text="加载菜单中...">
        <div class="search-box" v-show="!menuCollapseState">
            <el-select v-model="searchSelectValue" filterable remote default-first-option value-key="id" placeholder="搜索菜单" :remote-method="searchMenuHandle">
                <el-option v-for="item in searchMenuList" :key="item.value.id" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <el-scrollbar class="menus-wrapper" ref="scrollbarRef">
            <el-menu :default-active="currentMenuId" :collapse="menuCollapseState" @select="gotoPage">
                <menu-list :menuTreeData="menuTreeData" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import type { System } from "/#/modules/system";
import { ref } from "vue";
import { ElScrollbar } from "element-plus";
import systemAPI from "@api/system";
import menuList from "./menu-list.vue";

// import type { Ref, ComputedRef } from "vue";
// import { Router, useRouter } from "vue-router";
// import { storageStore, eventsStore } from "@/stores";

// 全局路由对象
// const router: Router = useRouter();

// vuex
// const storageData = storageStore();

defineProps({
    menuCollapseState: Boolean,
    currentMenuId: String
});

// const emits = defineEmits([""])

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

const isLoadingForMenus = ref(true);

// 菜单搜索所选中的选项
const searchSelectValue = ref<System.MenuTree>();

// 当前菜单搜索出来的选项列表
const searchMenuList = ref<
    Array<{
        label: string;
        value: System.MenuTree;
    }>
>([]);

// 菜单树数据
const menuTreeData = ref<System.MenuTree[]>([]);

// 初始化菜单树数据
const initMenuTreeData = async function () {
    const menuTreeList: Array<Record<string, any>> = (await systemAPI.queryLoginUserMenus<Array<Record<string, any>>>()) as Array<Record<string, any>>;
    isLoadingForMenus.value = false;
    if (!menuTreeList || menuTreeList.length === 0) {
        return;
    }
    const tempMenuTreeList: System.MenuTree[] = [];
    menuTreeList.forEach(item => {
        const menuTree: System.MenuTree = {
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            icons: item.icons,
            url: item.url,
            moduleCode: item.moduleCode,
            isActive: false,
            isOpen: false,
            childList: []
        };
        if (!item.parentId) {
            menuTreeData.value.push(menuTree);
        } else {
            tempMenuTreeList.push(menuTree);
        }
    });
    let newMenuList: System.MenuTree[] = menuTreeData.value;
    while (newMenuList.length > 0 && tempMenuTreeList.length > 0) {
        const tempNewMenuList: System.MenuTree[] = [];
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
    // 匹配菜单名称
    const matchMenuTreeName = function (menuList: System.MenuTree[], menuNames: Array<string>, isAllInsert: boolean) {
        menuList.forEach(menu => {
            if (menu.childList.length > 0) {
                menuNames = menuNames.slice(0);
                menuNames.push(menu.name);
                matchMenuTreeName(menu.childList, menuNames, isAllInsert || menu.name.includes(query));
            } else if (isAllInsert || menu.name.includes(query)) {
                searchMenuList.value.push({ label: menuNames.join(" / "), value: menu });
            }
        });
    };
    searchMenuList.value = [];
    matchMenuTreeName(menuTreeData.value, [], false);
};

// 获取菜单链接
const gotoPage = function (key: string, keyPath: string[]) {
    logs.info(key, keyPath);
};

initMenuTreeData();
</script>
<style lang="less" scoped>
.side-bar {
    width: 224px;
    height: 100%;
    flex-shrink: 0;
}
</style>
