<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-11-14 16:14:46
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-19 15:30:01
 * @项目的路径: \vue-manager-system\src\views\home\components\menu-list.vue
 * @描述: 菜单列表
-->
<template>
    <template v-for="menuItem in menuTreeData" :key="menuItem.id">
        <el-menu-item v-if="menuItem.childList.length === 0" :index="menuItem.id">
            <el-icon>
                <!-- <svg-icon class="menu-icon" :value="menuItem.icons" /> -->
                <i class="icomoon-forward" :class="menuItem.icons"></i>
            </el-icon>
            <template #title>
                <menu-text :menuItem="menuItem" />
            </template>
        </el-menu-item>
        <el-sub-menu v-else :index="menuItem.id" popper-class="side-bar-menu-popper">
            <template #title>
                <el-icon>
                    <!-- <svg-icon class="menu-icon" :value="menuItem.icons" /> -->
                    <i class="icomoon-forward" :class="menuItem.icons"></i>
                </el-icon>
                <menu-text :menuItem="menuItem" />
            </template>
            <menu-list :menuTreeData="menuItem.childList" />
        </el-sub-menu>
    </template>
</template>
<script lang="ts">
import type { PropType } from "vue";
import type { System } from "/#/modules/system";
import { defineComponent } from "vue";
import menuText from "./men-text.vue";

export default defineComponent({
    name: "menuList",
    components: { menuText },
    data() {
        return {};
    },
    props: {
        menuTreeData: {
            type: Array as PropType<Array<System.MenuTree>>,
            require: true
        }
    }
});
</script>
