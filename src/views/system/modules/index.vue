<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-27 11:25:18
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-27 15:42:00
 * @项目的路径: \vue-manager-system\src\views\system\modules\index.vue
 * @描述: 模块管理页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef">
        <info-form-dialog v-if="isShowDialog" v-model:isShow="isShowDialog" @refresh="refreshHandle" :row="selectedRow" />
    </search-page>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Components } from "/#/components";
import { HANDLE_CODES } from "@/services/constants";
import searchConfig from "./search-config";
import infoFormDialog from "./components/info-form-dialog.vue";

// search page 组件
const searchPageRef = ref<Components.SearchPageRef>();

// 是否显示信息弹窗
const isShowDialog = ref(false);

// 当前选中数据列
const selectedRow = ref();

// 显示弹窗操作
const showDialogHandle = function (rows, { handleCode }) {
    if (handleCode === HANDLE_CODES.CREATE) {
        selectedRow.value = null;
    } else {
        selectedRow.value = rows;
    }
    isShowDialog.value = true;
};

// 数据刷新操作
const refreshHandle = async function () {
    await searchPageRef.value!.query();
};

// 搜索页配置数据
const searchConfigData = searchConfig({ showDialogHandle });
</script>
