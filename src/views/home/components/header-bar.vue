<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-16 13:53:57
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-04 15:40:33
 * @项目的路径: \vue-manager-system\src\views\home\components\header-bar.vue
 * @描述: home 头部
-->
<template>
    <div class="header-bar">
        <div class="left-inner">
            <div class="logo-box">
                <img src="@assets/static/logo.png" height="45" width="45" />
            </div>
            <div class="title-text">中台管理系统</div>
            <div class="icon-box" @click="toggleMenuCollapseState">
                <i :class="menuCollapseState ? 'icomoon-point-right' : 'icomoon-point-left'"></i>
            </div>
        </div>
        <div class="center-inner"></div>
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
                            <el-dropdown-item command="showUpdateInfoDialog">
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
        <login-info-dialog :isShow="isShowUserInfoDialog" />
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import messages from "./messages.vue";
import loginInfoDialog from "./login-info-dialog.vue";
import { Refresh, CaretBottom } from "@element-plus/icons-vue";
import { storageStore } from "@/stores";

defineProps({
    menuCollapseState: {
        type: Boolean
    }
});

const emits = defineEmits(["toggleMenuCollapseState"]);

// 存储data
const storageData = storageStore();

const isShowUserInfoDialog: Ref<boolean> = ref(false);

// 切换菜单折叠状态
const toggleMenuCollapseState = function () {
    emits("toggleMenuCollapseState");
};

const loginUserCommandHandle = function (command) {
    if (command === "showUserInfoDialog") {
        isShowUserInfoDialog.value = true;
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
    background-color: #2dc3e8;
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
            width: 51px;
            text-align: center;
        }

        .title-text {
            flex: 1;
            font-size: 15px;
            padding-left: 5px;
            text-align: left;
            line-height: 45px;
            color: #fff;
            display: -webkit-box;
            word-break: break-all;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }

        .icon-box {
            width: 30px;
            color: #fff;
            cursor: pointer;
            font-size: 20px;
            transition: color 0.318s ease 0s;
            display: flex;
            justify-content: center;
            align-items: center;

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
    }

    .right-inner {
        width: 200px;
        display: flex;
        padding: 0px 10px;
        color: #fff;
        font-size: 12px;
        align-items: center;
        line-height: 24px;

        .message-box,
        .icon-box {
            cursor: pointer;
            padding-right: 16px;
            color: #fff;
            font-size: 18px;
            display: flex;
            align-items: center;
        }

        .login-info-box {
            cursor: pointer;

            .name-info {
                display: flex;
                position: relative;
                color: #fff;
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
