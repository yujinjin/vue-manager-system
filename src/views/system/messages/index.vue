<!--
 * @创建者: yujinjin9@126.com
 * @描述: 站内信页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef">
        <template #dataTable_status="scope">
            <el-tag v-if="scope.row.status === '0'" type="info">发送中</el-tag>
            <el-tag v-else-if="scope.row.status === '1'" type="success">发送完成</el-tag>
            <el-tag v-else-if="scope.row.status === '2'" type="danger">发送失败</el-tag>
        </template>
        <template #dataTable_title="scope">
            <el-link type="primary" @click="showDialogHandle(scope.row, { handleCode: HANDLE_CODES.VIEW })">
                <tooltip-dynamics-text :content="scope.row.title" />
            </el-link>
        </template>
        <add-form-dialog
            v-if="isShowAddDialog"
            v-model:is-show="isShowAddDialog"
            :action-type="actionType"
            :row="selectedRow"
            :module-list="moduleList"
            :role-list="roleList"
            @refresh="refreshHandle"
        />
    </search-page>
</template>
<script setup lang="ts">
import { type SearchPageRef } from "@yujinjin/cms-components";
import { ref, reactive } from "vue";
import searchConfig from "./search-config";
import addFormDialog from "./components/add-form-dialog.vue";
import systemAPI from "@api/system";
import tooltipDynamicsText from "@views/components/tooltip-dynamics-text.vue";
import { HANDLE_CODES } from "@/services/constants";

// search page 组件
const searchPageRef = ref<SearchPageRef>();

// 是否显示信息弹窗
const isShowAddDialog = ref(false);

// 模块列表
const moduleList = ref<Record<string, any>[]>([]);

// 角色列表
const roleList = ref<Record<string, any>[]>([]);

// 当前选中数据列
const selectedRow = ref();

// 操作类型
const actionType = ref<string>();

// 数据刷新操作
const refreshHandle = async function () {
    await searchPageRef.value!.query();
};

// 显示新增信息弹窗
const showDialogHandle = function (rows: any, { handleCode }: { handleCode: string }) {
    actionType.value = handleCode;
    if (handleCode === HANDLE_CODES.CREATE) {
        selectedRow.value = null;
    } else {
        selectedRow.value = rows;
    }
    isShowAddDialog.value = true;
};

// 搜索页配置数据
const searchConfigData = reactive(searchConfig({ showDialogHandle }));

const init = async function () {
    // 查询模块列表
    moduleList.value = ((await systemAPI.queryModuleList({})) as Array<Record<string, any>>) || [];

    // 查询角色列表
    roleList.value = ((await systemAPI.queryRoleList({})) as Array<Record<string, any>>) || [];

    if (moduleList.value.length > 0) {
        // 设置模块筛选项中的下拉框数据
        searchPageRef.value?.changeFormFields(formFields => {
            formFields.find(item => {
                if (item.name === "module") {
                    item.data = moduleList.value.map(item => ({ label: item.name, value: item.code }));
                    return true;
                }
                return false;
            });
        });
        // 设置数据表格中的模块信息回显
        searchConfigData.dataTableProps.columns.find(item => {
            if (item.prop === "moduleCode") {
                item.data = moduleList.value.map(item => ({ label: item.name, value: item.code }));
                return true;
            }
            return false;
        });
    }
    if (roleList.value.length > 0) {
        // 设置数据表格中角色信息回显
        searchConfigData.dataTableProps.columns.find(item => {
            if (item.prop === "roles") {
                item.data = roleList.value.map(item => ({ label: item.name, value: item.code }));
                return true;
            }
            return false;
        });
    }
};

init();
</script>
