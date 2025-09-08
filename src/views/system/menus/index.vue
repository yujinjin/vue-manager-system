<!--
 * @创建者: yujinjin9@126.com
 * @描述: 系统菜单管理页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef">
        <template #dataTable_icons="{ row }">
            <i v-if="row.icons?.startsWith('icomoon')" class="icon" :class="row.icons"></i>
            <el-image v-else-if="row.icons?.startsWith('http')" :src="row.icons" fit="contain" style="width: 30px; height: 30px" />
            <template v-else>{{ row.icons }}</template>
        </template>
        <template #dataTable_status="scope">
            <div class="state-text" :class="{ disable: scope.row.status === '1', enable: scope.row.status === '0' }">{{ getStatusText(scope.row.status) }}</div>
        </template>
        <info-form-dialog v-if="isShowInfoDialog" v-model:is-show="isShowInfoDialog" :module-list="moduleList" :row="selectedRow" @refresh="refreshHandle" />
        <bind-roles-dialog v-if="isShowBindRolesDialog" v-model:is-show="isShowBindRolesDialog" :row="selectedRow" :module-list="moduleList" />
        <batch-insert-dialog v-if="isShowBatchInsertDialog" v-model:is-show="isShowBatchInsertDialog" :module-list="moduleList" />
    </search-page>
</template>
<script setup lang="ts">
import { type SearchPageRef } from "@yujinjin/cms-components";
import { ref, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchConfig from "./search-config";
import infoFormDialog from "./components/info-form-dialog.vue";
import bindRolesDialog from "./components/bind-roles-dialog.vue";
import batchInsertDialog from "./components/batch-insert-dialog.vue";
import { HANDLE_CODES } from "@/services/constants";
import systemAPI from "@api/system";

// search page 组件
const searchPageRef = ref<SearchPageRef>();

// 是否显示信息弹窗
const isShowInfoDialog = ref(false);

// 是否显示绑定菜单绑定的角色弹窗
const isShowBindRolesDialog = ref(false);

// 是否显示批量新增用户弹窗
const isShowBatchInsertDialog = ref(false);

// 当前选中数据列
const selectedRow = ref();

// 模块列表
const moduleList = ref<Record<string, any>[]>([]);

// 获取状态的内容
const getStatusText = function (status: string) {
    if (!status) return "-";
    if (status === "0") {
        return "正常";
    } else if (status === "1") {
        return "锁定";
    }
    return "未知";
};

// 数据刷新操作
const refreshHandle = async function () {
    await searchPageRef.value!.query();
};

// 显示菜单相关操作信息弹
const showDialogHandle = function (rows: any, { handleCode }: { handleCode: string }) {
    if (handleCode === HANDLE_CODES.CREATE) {
        selectedRow.value = null;
    } else {
        selectedRow.value = rows;
    }
    if ([HANDLE_CODES.CREATE, HANDLE_CODES.UPDATE].includes(handleCode)) {
        // 新增/修改菜单信息弹窗
        isShowInfoDialog.value = true;
    } else if (handleCode === HANDLE_CODES.SEARCH) {
        // 显示绑定角色信息弹窗
        isShowBindRolesDialog.value = true;
    } else if (handleCode === HANDLE_CODES.BATCHCREATE) {
        // 显示批量新增菜单信息弹窗
        isShowBatchInsertDialog.value = true;
    }
};

// 切换菜单的锁定状态
const toggleMenuLockStatusHandle = async function (row: any, { handleCode }: { handleCode: string }) {
    await ElMessageBox.confirm("确定" + (handleCode === HANDLE_CODES.DISABLE ? "锁定" : "解锁") + "当前菜单信息吗?", "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await systemAPI.toggleMenuLockStatus({ id: row.id, status: handleCode === HANDLE_CODES.DISABLE ? "1" : "0" });
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// 删除操作
const deleteHandle = async function (row: any) {
    await ElMessageBox.confirm("确定删除当前菜单信息吗?", "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await systemAPI.deleteRole({ id: row.id });
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// 搜索页配置数据
const searchConfigData = reactive(searchConfig({ showDialogHandle, toggleMenuLockStatusHandle, deleteHandle }));

const init = async function () {
    // 查询模块列表
    moduleList.value = ((await systemAPI.queryModuleList({})) as Array<Record<string, any>>) || [];

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
        searchConfigData.dataTableProps.columns.find(item => {
            if (item.prop === "moduleCode") {
                item.data = moduleList.value.map(item => ({ label: item.name, value: item.code }));
                return true;
            }
            return false;
        });
    }
};

init();
</script>
<style lang="scss" scoped>
.state-text {
    padding-left: 12px;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background: #909399;
        border-radius: 50%;
    }

    &.disable::before {
        background: #e63948;
    }

    &.enable::before {
        background: #00b85c;
    }
}

i.icon {
    font-size: 20px;
    border: 1px solid #ccc;
    padding: 4px;
    display: inline-block;
    border-radius: 4px;
}
</style>
