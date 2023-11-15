<template>
    <div class="side-inner-menu">
        <div class="menu-item" @click.stop.prevent="menuClickEvent(menuItem, menuTreeData!)" v-for="menuItem in menuTreeData" :key="menuItem.id">
            <a
                :href="getLink(menuItem)"
                class="menu-dropdown"
                :style="{ paddingLeft: level * 20 + 40 + 'px' }"
                :class="{ active: menuItem.isActive && menuItem.childList.length === 0, open: menuItem.isOpen && menuItem.childList.length > 0 }"
            >
                <svg-icon class="menu-icon" :value="menuItem.icons" />
                <span class="menu-text">{{ menuItem.name }}</span>
                <svg-icon class="menu-expand" :class="{ open: menuItem.isOpen }" value="angle-right" v-if="menuItem.childList.length > 0" />
            </a>
            <side-inner-menu v-show="menuItem.isOpen" @menuClick="menuClickEvent" :menuData="menuItem.childList" v-if="menuItem.childList.length > 0" :level="level + 1" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { System } from "/#/modules/system";
import { isExternalLink } from "@/utils/index";

export default defineComponent({
    name: "sideInnerMenu",
    data() {
        return {};
    },
    emits: {
        menuClick(menuItem: System.MenuTree, brotherMenuList: System.MenuTree[]) {
            // 执行运行时校验
            return !!menuItem && !!brotherMenuList;
        }
    },
    props: {
        menuTreeData: {
            type: Array as PropType<Array<System.MenuTree>>,
            require: true
        },
        level: {
            type: Number,
            default: 0
        }
    },
    methods: {
        // 获取菜单链接
        getLink(menuItem: System.MenuTree) {
            if (menuItem.url && menuItem.childList.length === 0) {
                return isExternalLink(menuItem.url) ? "/external/" + menuItem.id : menuItem.url;
            }
        },
        menuClickEvent(menuItem: System.MenuTree, brotherMenuList: System.MenuTree[]) {
            this.$emit("menuClick", menuItem, brotherMenuList);
        }
    }
});
</script>
<style lang="less" scoped>
.side-inner-menu {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    background-color: #fbfbfb;
    position: relative;
    z-index: 10;

    .menu-item {
        .menu-dropdown {
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
    }
}
</style>
