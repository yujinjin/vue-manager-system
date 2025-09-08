<!--
 * @创建者: yujinjin9@126.com
 * @描述: 菜单列表
-->
<template>
    <template v-for="menuItem in menuTreeData" :key="menuItem.id">
        <el-menu-item v-if="menuItem.childList.length === 0" :index="menuItem.id">
            <el-icon>
                <!-- <svg-icon class="menu-icon" :value="menuItem.icons" /> -->
                <i :class="menuItem.icons"></i>
            </el-icon>
            <template #title>
                <menu-text :menu-item="menuItem" />
            </template>
        </el-menu-item>
        <el-sub-menu v-else :index="menuItem.id" popper-class="side-bar-menu-popper">
            <template #title>
                <el-icon>
                    <!--icomoon-forward <svg-icon class="menu-icon" :value="menuItem.icons" /> -->
                    <i :class="menuItem.icons"></i>
                </el-icon>
                <menu-text :menu-item="menuItem" />
            </template>
            <menu-list :menu-tree-data="menuItem.childList" />
        </el-sub-menu>
    </template>
</template>
<script lang="ts">
import { type PropType } from "vue";
import { defineComponent } from "vue";
import { type MenuTree } from "../menu-tree";
import menuText from "./men-text.vue";

export default defineComponent({
    name: "menu-list",
    components: { menuText },
    props: {
        menuTreeData: {
            type: Array as PropType<Array<MenuTree>>,
            require: true,
            default: () => []
        }
    },
    data() {
        return {};
    }
});
</script>
