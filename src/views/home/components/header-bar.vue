<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-16 13:53:57
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-11-15 16:14:56
 * @项目的路径: \vue-manager-system\src\views\home\components\header-bar.vue
 * @描述: home 头部
-->
<template>
    <div class="header-bar">
        <div class="left-inner">
            <div class="logo-box">
                <svg-icon class="logo" value="vue-logo" />
            </div>
            <div class="title-text">中台管理系统</div>
            <div class="icon-box" @click="toggleMenuCollapseState">
                <svg-icon :class="{ actived: menuCollapseState }" value="fold" />
            </div>
        </div>
        <div class="center-inner">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>商城管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>品牌管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right-inner">
            <div class="message-box"><messages /></div>
            <div class="icon-box">
                <el-icon><Refresh /></el-icon>
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
        <login-info-dialog v-model:isShow="isShowUserInfoDialog" />
        <update-password-dialog v-model:isShow="isShowUpdatePasswordDialog" />
    </div>
</template>
<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { Refresh, CaretBottom, ArrowRight } from "@element-plus/icons-vue";
import { storageStore } from "@/stores";
import messages from "./messages.vue";
import loginInfoDialog from "./login-info-dialog.vue";
import updatePasswordDialog from "./update-password-dialog.vue";

defineProps({
    menuCollapseState: {
        type: Boolean
    }
});

const emits = defineEmits(["toggleMenuCollapseState"]);

// 存储data
const storageData = storageStore();

// 是否显示修改用户信息弹窗
const isShowUserInfoDialog: Ref<boolean> = ref(false);

// 是否显示修改用户密码弹窗
const isShowUpdatePasswordDialog = ref<boolean>(false);

// 切换菜单折叠状态
const toggleMenuCollapseState = function () {
    emits("toggleMenuCollapseState");
};

const loginUserCommandHandle = function (command) {
    if (command === "showUserInfoDialog") {
        isShowUserInfoDialog.value = true;
    } else if (command === "showUpdatePasswordDialog") {
        isShowUpdatePasswordDialog.value = true;
    }
};
</script>
<style lang="less" scoped>
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

    .left-inner {
        display: flex;
        width: 224px;
        .logo-box {
            width: 60px;
            text-align: center;
            :deep(.svg-icon) {
                height: 44px;
                width: 44px;
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
