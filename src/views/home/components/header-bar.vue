<!--
 * @创建者: yujinjin9@126.com
 * @描述: home 头部
-->
<template>
    <div class="header-bar">
        <div class="left-inner">
            <div class="logo-box">
                <i class="svg-icon">
                    <icon-vue-logo />
                </i>
            </div>
            <div class="title-text">中台内容管理系统</div>
            <div class="icon-box" @click="toggleMenuCollapseState">
                <i class="svg-icon" :class="{ actived: menuCollapseState }">
                    <icon-fold />
                </i>
            </div>
        </div>
        <div class="center-inner">
            <el-breadcrumb v-if="omitBreadcrumbNames.length > 0" :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(name, index) in omitBreadcrumbNames" :key="index">{{ name || "-" }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right-inner">
            <div class="message-box"><messages /></div>
            <div class="icon-box">
                <el-tooltip content="刷新当前正在展示的内容页">
                    <el-icon @click="refreshCurrentPageHandle"><Refresh /></el-icon>
                </el-tooltip>
            </div>
            <div class="login-info-box">
                <el-dropdown @command="loginUserCommandHandle">
                    <span class="el-dropdown-link name-info">
                        <div class="avatar-box">
                            <img :src="storageData.loginUserInfo.avatar" height="24" width="24" />
                        </div>
                        <div class="user-name-text text-ellipsis-block">{{ storageData.loginUserInfo.userName }}</div>
                        <el-icon class="el-icon--right"><CaretBottom /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="showUserInfoDialog">
                                <i class="icomoon-user"></i>
                                <span class="dropdown-text">我的账户</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="showUpdatePasswordDialog">
                                <i class="icomoon-cog"></i>
                                <span class="dropdown-text">修改密码</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="logout" divided>
                                <i class="icomoon-switch"></i>
                                <span class="dropdown-text">退出</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <login-info-dialog v-model:is-show="isShowUserInfoDialog" />
        <update-password-dialog v-model:is-show="isShowUpdatePasswordDialog" />
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { type PropType, type Ref, ref } from "vue";
import { Refresh, CaretBottom, ArrowRight } from "@element-plus/icons-vue";
import { type Router, useRouter } from "vue-router";
import messages from "./messages.vue";
import loginInfoDialog from "./login-info-dialog.vue";
import updatePasswordDialog from "./update-password-dialog.vue";
import { transitRoutePath } from "@/utils/index";
import { storageStore, pageViewsStore, eventsStore } from "@/stores";
import { IconFold, IconVueLogo } from "@/components/icon-svg";

const props = defineProps({
    menuCollapseState: {
        type: Boolean
    },
    breadcrumbNames: {
        type: Array as PropType<Array<string>>,
        default: () => []
    }
});

const emits = defineEmits(["toggleMenuCollapseState"]);

// 全局路由对象
const router: Router = useRouter();

// 存储data
const storageData = storageStore();

// vuex
const pageViews = pageViewsStore();

// 系统事件
const events = eventsStore();

// 是否显示修改用户信息弹窗
const isShowUserInfoDialog: Ref<boolean> = ref(false);

// 是否显示修改用户密码弹窗
const isShowUpdatePasswordDialog = ref<boolean>(false);

// 省略面包屑名称（导航的名称最多显示6层，超过之后用省略号表示）
const omitBreadcrumbNames = computed(() => {
    if (props.breadcrumbNames && props.breadcrumbNames.length > 5) {
        return [props.breadcrumbNames![0], "...", ...props.breadcrumbNames!.slice(-4)];
    }
    return props.breadcrumbNames || [];
});

const refreshCurrentPageHandle = function () {
    const index = pageViews.currentVisiteIndex;
    if (pageViews.visitedViews[index].isIframe) {
        // 刷新iframe
        (document.querySelector("iframe[id='" + pageViews.visitedViews[index].id + "']") as HTMLIFrameElement).src = pageViews.visitedViews[index].fullPath;
    } else {
        // 当前正在展示的单页刷新
        router.push(transitRoutePath({ pageIndex: index }));
    }
};

// 切换菜单折叠状态
const toggleMenuCollapseState = function () {
    emits("toggleMenuCollapseState");
};

const loginUserCommandHandle = function (command: string) {
    if (command === "showUserInfoDialog") {
        isShowUserInfoDialog.value = true;
    } else if (command === "showUpdatePasswordDialog") {
        isShowUpdatePasswordDialog.value = true;
    } else if (command === "logout") {
        events.trigger({ eventName: "gotoLogout" });
    }
};
</script>
<style lang="scss" scoped>
.header-bar {
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    height: 45px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 99;

    .left-inner {
        display: flex;
        width: 224px;
        .logo-box {
            width: 60px;
            text-align: center;
            i {
                height: 44px;
                width: 44px;
                svg {
                    height: 44px;
                    width: 44px;
                }
            }
        }

        .title-text {
            flex: 1;
            font-size: 15px;
            padding-left: 5px;
            text-align: left;
            line-height: 45px;
            font-weight: bold;
            display: -webkit-box;
            word-break: break-all;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }

        .icon-box {
            width: 30px;
            cursor: pointer;
            font-size: 20px;
            transition: color 0.318s ease 0s;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #606266;

            .actived {
                transform: rotate(180deg);
            }

            &:hover {
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            }
        }
    }

    .center-inner {
        flex: 1;
        display: flex;
        align-items: flex-end;
        position: relative;
        align-items: center;

        :deep(.el-breadcrumb) {
            margin-left: 12px;
            .el-breadcrumb__item[aria-current="page"] .el-breadcrumb__inner {
                color: #ccc;
            }
        }
    }

    .right-inner {
        width: 200px;
        display: flex;
        padding: 0px 10px;
        font-size: 12px;
        align-items: center;
        line-height: 24px;

        .message-box,
        .icon-box {
            cursor: pointer;
            padding-right: 16px;
            color: #606266;
            font-size: 18px;
            display: flex;
            align-items: center;
        }

        .login-info-box {
            cursor: pointer;

            .name-info {
                display: flex;
                position: relative;
                align-items: center;

                .avatar-box {
                    flex-shrink: 0;

                    img {
                        border-radius: 50%;
                    }
                }

                .user-name-text {
                    padding-left: 5px;
                    width: 80px;
                }

                .el-icon {
                    font-size: 15px;
                }
            }
        }
    }
}
.dropdown-text {
    width: 80px;
    padding-left: 4px;
}
</style>
