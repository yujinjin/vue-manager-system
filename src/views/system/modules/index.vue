<!--
 * @创建者: yujinjin9@126.com
 * @描述: 模块管理页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef">
        <info-form-dialog v-if="isShowDialog" v-model:is-show="isShowDialog" :row="selectedRow" @refresh="refreshHandle" />
    </search-page>
</template>
<script setup lang="ts">
import { type SearchPageRef } from "@yujinjin/cms-components";
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchConfig from "./search-config";
import infoFormDialog from "./components/info-form-dialog.vue";
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

// search page 组件
const searchPageRef = ref<SearchPageRef>();

// 是否显示信息弹窗
const isShowDialog = ref(false);

// 当前选中数据列
const selectedRow = ref();

// 数据刷新操作
const refreshHandle = async function () {
    await searchPageRef.value!.query();
};

// 显示弹窗操作
const showDialogHandle = function (rows: any, { handleCode }: { handleCode: string }) {
    if (handleCode === HANDLE_CODES.CREATE) {
        selectedRow.value = null;
    } else {
        selectedRow.value = rows;
    }
    isShowDialog.value = true;
};

// 删除操作
const deleteHandle = async function (row: any) {
    await ElMessageBox.confirm("是否删除当前模块信息?", "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await systemAPI.deleteModuleById(row.id);
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// 搜索页配置数据
const searchConfigData = searchConfig({ showDialogHandle, deleteHandle });
</script>
