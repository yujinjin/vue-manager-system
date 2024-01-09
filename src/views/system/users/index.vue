<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-28 09:43:38
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-08 14:30:19
 * @项目的路径: \vue-manager-system\src\views\system\users\index.vue
 * @描述: 用户管理页面
-->
<template>
    <search-page v-bind="searchConfigData" ref="searchPageRef">
        <template #dataTable_status="scope">
            <div class="state-text" :class="{ disable: scope.row.status === '1', enable: scope.row.status === '0' }">{{ getStatusText(scope.row.status) }}</div>
        </template>
        <info-form-dialog v-if="isShowInfoDialog" v-model:isShow="isShowInfoDialog" @refresh="refreshHandle" :row="selectedRow" />
        <bind-roles-dialog v-if="isShowBindRolesDialog" v-model:isShow="isShowBindRolesDialog" :row="selectedRow" :roleList="roleList" :moduleList="moduleList" />
        <batch-insert-dialog v-if="isShowBatchInsertDialog" v-model:isShow="isShowBindRolesDialog" />
    </search-page>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";
import searchConfig from "./search-config";
import infoFormDialog from "./components/info-form-dialog.vue";
import bindRolesDialog from "./components/bind-roles-dialog.vue";
import batchInsertDialog from "./components/batch-insert-dialog.vue";

// search page 组件
const searchPageRef = ref<Components.SearchPageRef>();

// 是否显示信息弹窗
const isShowInfoDialog = ref(false);

// 是否显示绑定角色弹窗
const isShowBindRolesDialog = ref(false);

// 是否显示批量新增用户弹窗
const isShowBatchInsertDialog = ref(false);

// 当前选中数据列
const selectedRow = ref();

// 角色列表
const roleList = ref<Record<string, any>[]>([]);

// 模块列表
const moduleList = ref<Record<string, any>[]>([]);

// 获取状态的内容
const getStatusText = function (status) {
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

// 显示用户信息弹窗操作
const showDialogHandle = function (rows, { handleCode }) {
    if (handleCode === HANDLE_CODES.CREATE) {
        selectedRow.value = null;
    } else {
        selectedRow.value = rows;
    }
    if ([HANDLE_CODES.CREATE, HANDLE_CODES.UPDATE].includes(handleCode)) {
        // 修改用户信息弹窗
        isShowInfoDialog.value = true;
    } else if (handleCode === HANDLE_CODES.AUTH) {
        // 显示绑定角色信息弹窗
        isShowBindRolesDialog.value = true;
    } else if (handleCode === HANDLE_CODES.BATCHCREATE) {
        // 显示批量新增用户信息弹窗
        isShowBatchInsertDialog.value = true;
    }
};

// 重置用户密码
const resetUserPasswordHandle = async function (row) {
    await ElMessageBox.confirm("重置后的新密码会以邮件的形式发送给用户，确定重置当前用户密码吗?", "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await systemAPI.resetUerPassword({ id: row.id });
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// 切换用户的锁定状态
const toggleUserLockStatusHandle = async function (row, { handleCode }) {
    await ElMessageBox.confirm("确定" + (handleCode === HANDLE_CODES.DISABLE ? "锁定" : "解锁") + "当前用户信息吗?", "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await systemAPI.toggleUserLockStatus({ id: row.id, status: handleCode === HANDLE_CODES.DISABLE ? "1" : "0" });
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// 删除操作
const deleteHandle = async function (row) {
    await ElMessageBox.confirm("确定删除当前用户信息吗?", "信息确认", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    });
    await systemAPI.deleteUser({ id: row.id });
    ElMessage({
        customClass: "custom-message",
        message: "操作成功",
        type: "success"
    });
    refreshHandle();
};

// 搜索页配置数据
const searchConfigData = searchConfig({ showDialogHandle, toggleUserLockStatusHandle, resetUserPasswordHandle, deleteHandle });

const init = async function () {
    // 查询模块列表
    moduleList.value = ((await systemAPI.queryModuleList({})) as Array<Record<string, any>>) || [];
    // 查询角色列表
    roleList.value = ((await systemAPI.queryRoleList({})) as Array<Record<string, any>>) || [];
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
</style>
