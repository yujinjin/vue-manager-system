<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-03-01 11kw
 * @描述: 外部系统home页（此页面仅做框架测试用）
-->
<template>
    <div class="home">
        <img alt="Vue logo" src="/logo.png" />
        <div class="button-panel">
            <el-button type="primary" @click="newIFramePage">打开新页面</el-button>
            <el-button type="primary" @click="closeCurrentIFramePage">关闭当前页面</el-button>
            <template v-if="pageId">
                <el-button type="primary" @click="gotoNewIFramePage">跳转刚刚打开的新页面</el-button>
                <el-button type="primary" @click="closeNewIFramePage">关闭刚刚打开的新页面</el-button>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import iframeMessage from "@/services/iframe-message";
import config from "@/config";
import logs from "@/services/logs";

iframeMessage.init();

// 当前页面ID值
const pageId = ref<string>("");
// 打开新页面
const newIFramePage = function () {
    pageId.value = Date.now() + "";
    iframeMessage.openNewTabPage({
        url: window.location.origin + config.projectContentPath + (config.isWebHash ? "/#" : "") + "/outside/about",
        title: "外部about页面",
        pageId: pageId.value
    });
};

// 关闭当前页面
const closeCurrentIFramePage = function () {
    iframeMessage.closeTabPage();
};

// 跳转刚刚打开的新页面
const gotoNewIFramePage = function () {
    iframeMessage.gotoTabPage({
        pageId: pageId.value,
        callback: function (result: boolean) {
            logs.info("打开页面回调函数结果: " + result);
        }
    });
};

// 关闭刚刚打开的新页面
const closeNewIFramePage = function () {
    iframeMessage.closeTabPage(pageId.value);
};
</script>
<style lang="scss" scoped>
.home {
    text-align: center;

    .button-panel {
        display: flex;
        flex-direction: column;
        align-items: center;

        .el-button {
            width: 300px;
            margin-top: 20px;

            & + .el-button {
                margin-left: 0px;
            }
        }
    }
}
</style>
