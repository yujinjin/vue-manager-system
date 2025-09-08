<!--
 * @创建者: yujinjin9@126.com
 * @描述: 角色绑定菜单弹窗
-->
<template>
    <el-dialog v-model="dialogVisible" :title="'绑定角色【' + row.name + '】的菜单'" class="common-dialog" width="800px" @closed="dialogClosed">
        <div class="search-panel">
            <el-input v-model.trim="keyword" placeholder="搜索菜单名称/编码/地址" style="width: 250px; margin-right: 12px" clearable :prefix-icon="Search" />
            <el-select :model-value="row.moduleCode" disabled placeholder="搜索角色模块" style="width: 150px">
                <el-option v-for="module in moduleList" :key="module.code" :value="module.code" :label="module.name" />
            </el-select>
            <el-tooltip content="只能绑定相同系统模块的菜单">
                <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
        </div>
        <div class="data-list-panel">
            <div class="left-contents">
                <el-table
                    ref="dataTableRef"
                    :data="dataList"
                    height="250"
                    row-key="id"
                    stripe
                    border
                    :empty-text="menuList && menuList.length > 0 ? '未搜索到菜单相关数据' : '没有数据'"
                    style="width: 100%"
                    @selection-change="selectionChangeHandle"
                    @row-click="rowClickHandle"
                >
                    <el-table-column reserve-selection type="selection" label="选择" width="40" align="center" />
                    <el-table-column label="菜单名称(编码)" min-width="120" show-overflow-tooltip>
                        <template #default="scope">{{ scope.row.name }}({{ scope.row.code }})</template>
                    </el-table-column>
                    <el-table-column label="菜单地址" prop="url" min-width="150" show-overflow-tooltip />
                </el-table>
            </div>
            <div class="right-contents">
                <div class="header-row">
                    <div class="label-text">已选菜单({{ selectedMenuRows.length }})</div>
                    <div class="label-text active" @click="clearSelectionHandle">清空</div>
                </div>
                <div class="inner-row">
                    <div v-for="(menu, index) in selectedMenuRows" :key="menu.code" class="row-info">
                        <div class="name-text" :title="menu.name + '(' + menu.code + ')'">{{ menu.name }}({{ menu.code }})</div>
                        <el-icon @click="deleteSelectedHandle(index)"><Delete /></el-icon>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button :loading="isSubmiting" type="primary" @click="saveHandle">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { type PropType, ref, watch, nextTick } from "vue";
import { Search, Delete, InfoFilled } from "@element-plus/icons-vue";
import { ElLoading, ElTable, ElMessage } from "element-plus";
import { debounce } from "@yujinjin/utils";
import systemAPI from "@api/system";
import logs from "@/services/logs";

const props = defineProps({
    isShow: {
        type: Boolean
    },
    // 当前选中的用户数据列
    row: {
        type: Object,
        required: true
    },
    // 所有的模块列表
    moduleList: {
        type: Array as PropType<Record<string, any>[]>,
        default: function () {
            return [];
        }
    }
});

const emits = defineEmits(["update:isShow"]);

// 弹窗显示状态
const dialogVisible = ref(false);

// 搜索关键词
const keyword = ref("");

// 当前角色所属模块的最底部菜单列表（有菜单链接的）
const menuList = ref<Record<string, any>[]>([]);

// 数据表格ref
const dataTableRef = ref<InstanceType<typeof ElTable>>();

// 数据列表
const dataList = ref<Record<string, any>[]>([]);

// 选中的角色行(用户关联的角色列表)
const selectedMenuRows = ref<Record<string, any>[]>([]);

// 是否正在提交
const isSubmiting = ref(false);

// 弹窗关闭事件
const dialogClosed = function () {
    emits("update:isShow", false);
};

// 选择的角色数据变化
const selectionChangeHandle = function (rows: any) {
    selectedMenuRows.value = rows;
};

// 清空角色选项数据
const clearSelectionHandle = function () {
    dataTableRef.value!.clearSelection();
    selectedMenuRows.value = [];
};

// 数据表格中的行点击事件
const rowClickHandle = function (row: any) {
    dataTableRef.value!.toggleRowSelection(row, selectedMenuRows.value.findIndex(item => item.id === row.id) === -1);
};

// 删除已选中的角色信息
const deleteSelectedHandle = function (index: number) {
    dataTableRef.value!.toggleRowSelection(selectedMenuRows.value[index], false);
    selectedMenuRows.value.splice(index, 1);
};

// 搜索（防抖）
const searchDebounce = debounce(function () {
    const keywordReg = keyword.value && new RegExp(keyword.value.replace(/([,.+?:()*[\]^$|{}\\-])/g, "\\$1"), "i");
    dataList.value = menuList.value.filter(menu => {
        if (keywordReg && !keywordReg.test(menu.name) && !keywordReg.test(menu.code) && !keywordReg.test(menu.url)) {
            return false;
        }
        return true;
    });
}, 200);

// 查询当前选中角色绑定菜单列表
const queryRoleMenuList = async function () {
    const roleMenuList = (await systemAPI.queryMenuListByRoleId({ roleId: props.row.id })) as Array<Record<string, string>>;
    if (roleMenuList && roleMenuList.length > 0) {
        roleMenuList.forEach(item => {
            const findMenu = menuList.value.find(menuItem => menuItem.id === item.menuId);
            if (findMenu) {
                selectedMenuRows.value.push(findMenu);
            }
        });
    }
};

// 查询当前选中角色所属模块的最底部（有菜单链接）的菜单列表
const queryMenuList = async function () {
    const menus = (await systemAPI.queryMenuList({ moduleCode: props.row.moduleCode })) as Array<Record<string, string>>;
    if (menus && menus.length > 0) {
        menuList.value = menus.filter(menu => {
            return menus.findIndex(item => item.parentId === menu.id) === -1;
        });
    }
};

// 保存操作
const saveHandle = async function () {
    if (isSubmiting.value) {
        return;
    }
    isSubmiting.value = true;
    try {
        await systemAPI.updateMenusByRoleId({
            roleId: props.row.id,
            menus: selectedMenuRows.value.map(item => item.id)
        });
        ElMessage.success("操作成功");
        dialogVisible.value = false;
    } catch (error) {
        logs.error(error);
    }
    isSubmiting.value = false;
};

watch(keyword, searchDebounce);

const init = async function () {
    const loadingInstance = ElLoading.service();
    try {
        await queryMenuList();
        await queryRoleMenuList();
        dialogVisible.value = true;
        dataList.value = menuList.value;
        await nextTick();
        selectedMenuRows.value.forEach(menuRow => {
            dataTableRef.value?.toggleRowSelection(menuRow, true);
        });
    } catch (error) {
        dialogClosed();
        logs.error(error);
    }
    loadingInstance.close();
};

init();
</script>
<style lang="scss" scoped>
.cms-search-panel {
    padding-bottom: 8px;
    display: flex;
    align-items: center;

    .el-icon {
        color: var(--el-color-warning);
        font-size: 16px;
        margin-left: 4px;
        cursor: pointer;
    }
}

.data-list-panel {
    display: flex;
    color: rgba(0, 0, 0, 0.65);
    padding-bottom: 12px;

    .left-contents {
        flex: 1;
    }

    .right-contents {
        width: 25%;
        margin-left: 10px;
        border: 1px solid #d9d9d9;

        .header-row {
            display: flex;
            justify-content: space-between;
            line-height: 37px;
            font-size: 12px;
            font-weight: 400;
            padding: 0px 12px;
            border-bottom: 1px solid #d9d9d9;

            .label-text.active {
                cursor: pointer;
                color: #00a64d;
            }
        }

        .inner-row {
            padding: 0px 12px;
            overflow-y: auto;
            max-height: 210px;
            .row-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 32px;
                height: 32px;
                font-size: 12px;
                padding: 0px 5px;

                &:hover {
                    background-color: #fafafa;
                }

                .name-text {
                    font-weight: 400;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .el-icon {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
