<!--
 * @创建者: yujinjin9@126.com
 * @描述: 当前菜单已经绑定的角色列表
-->
<template>
    <el-dialog v-model="dialogVisible" :title="'菜单【' + row.name + '】绑定的角色列表'" class="dialog-form bind-roles-dialog" width="600px" @closed="dialogClosed">
        <data-table v-bind="dataTableConfig" ref="dataTableRef">
            <template #status="scope">
                <div class="state-text" :class="{ disable: scope.row.status === '1', enable: scope.row.status === '0' }">{{ getStatusText(scope.row.status) }}</div>
            </template>
        </data-table>
    </el-dialog>
</template>
<script setup lang="ts">
import { type PropType, ref, reactive } from "vue";
import systemAPI from "@api/system";

const props = defineProps({
    // 是否显示弹窗(TODO: 待优化，实际应该是勿需此属性)
    isShow: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object,
        required: true
    },
    moduleList: {
        type: Array as PropType<Record<string, any>[]>,
        default: function () {
            return [];
        }
    }
});

const emits = defineEmits(["update:isShow"]);

// 弹窗显示状态
const dialogVisible = ref(true);

// 数据表格配置
const dataTableConfig = reactive({
    query: () => systemAPI.queryRoleListByMenuId({ menuId: props.row.id }),
    isShowPagination: false,
    columns: [
        {
            label: "角色编码",
            prop: "code",
            minWidth: 120
        },
        {
            label: "角色名称",
            prop: "name",
            minWidth: 120
        },
        {
            label: "所属模块",
            prop: "moduleCode",
            minWidth: 120,
            type: "enum",
            data: props.moduleList.map(item => ({ label: item.name, value: item.code }))
        },
        {
            label: "状态",
            prop: "status",
            width: 100,
            slot: "status"
        }
    ],
    props: {
        maxHeight: 350
    }
});

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

// 弹窗关闭事件
const dialogClosed = function () {
    emits("update:isShow", false);
};
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
<style lang="scss">
.bind-roles-dialog {
    .data-table-panel {
        padding: 0px 0px 24px;
    }
}
</style>
