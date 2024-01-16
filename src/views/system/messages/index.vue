<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-16 15:15:37
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-16 16:57:07
 * @项目的路径: \vue-manager-system\src\views\system\messages\index.vue
 * @描述: 站内信页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef">
        <add-form-dialog v-if="isShowAddDialog" v-model:isShow="isShowAddDialog" :moduleList="moduleList" :roleList="roleList" @refresh="refreshHandle" />
    </search-page>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import { ref, reactive } from "vue";
import systemAPI from "@api/system";
import searchConfig from "./search-config";
import addFormDialog from "./components/add-form-dialog.vue";

// search page 组件
const searchPageRef = ref<Components.SearchPageRef>();

// 是否显示信息弹窗
const isShowAddDialog = ref(false);

// 模块列表
const moduleList = ref<Record<string, any>[]>([]);

// 角色列表
const roleList = ref<Record<string, any>[]>([]);

// 数据刷新操作
const refreshHandle = async function () {
    await searchPageRef.value!.query();
};

// 显示新增信息弹窗
const showDialogHandle = function () {
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
