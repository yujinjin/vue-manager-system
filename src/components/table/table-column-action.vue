<template>
    <div class="table-column-action">
        <el-button
            v-for="(button, index) in showStatusButtons"
            :key="(button.handleCode || '') + '_' + index"
            v-bind="button.props"
            @click="clickHandle(button)"
            :loading="button.isLoading"
            type="primary"
        >
            {{ button.text }}
        </el-button>
        <el-dropdown v-if="hideStatusButtons.length > 0" @command="dropdownCommandHandle">
            <span>
                <i class="icomoon-more"></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <!-- v-loading="button.isLoading" -->
                    <el-dropdown-item v-for="(button, index) in hideStatusButtons" :command="index" :key="(button.handleCode || '') + '_' + index">
                        <el-icon class="is-loading" v-if="button.isLoading">
                            <Loading />
                        </el-icon>
                        {{ button.text }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { Ref, PropType } from "vue";
import { ref, watch, computed } from "vue";
import { Loading } from "@element-plus/icons-vue";

const props = defineProps({
    buttons: {
        type: Array as PropType<Array<Components.TableButton>>,
        default: function () {
            return [];
        }
    },
    row: {
        type: Object,
        default: function () {
            return {};
        }
    },
    // 最多显示操作的按钮，超过之后就会隐藏起来
    maxNumShow: {
        type: Number,
        default: 3
    }
});

// 实际数据列中的操作按钮列表
const actionButtons: Ref<Components.TableButton[]> = ref([]);

const showStatusButtons = computed(() => {
    return actionButtons.value.filter(button => button.isShow);
});

const hideStatusButtons = computed(() => {
    return actionButtons.value.filter(button => !button.isShow);
});

// 初始化操作按钮列表
const initActionButtons = function () {
    actionButtons.value = [];
    props.buttons.forEach(button => {
        if (!button.display || button.display(props.row)) {
            button = Object.assign({ isLoading: false, isShow: true }, button);
            button.props = Object.assign({ link: true }, button.props);
            actionButtons.value.push(button);
        }
    });
    if (props.maxNumShow && actionButtons.value.length > props.maxNumShow) {
        actionButtons.value.slice(props.maxNumShow - 1).forEach(button => {
            button.isShow = false;
        });
    }
};

// 按钮点击操作
const clickHandle = async function (button) {
    if (button.isLoading) {
        return;
    }
    button.isLoading = true;
    try {
        if (button.click) {
            await button.click(props.row, button);
        }
    } catch (error) {
        logs.error(error);
    }
    button.isLoading = false;
};

// dropdown 按钮点击事件
const dropdownCommandHandle = function (index) {
    clickHandle(actionButtons.value[showStatusButtons.value.length + index]);
};

watch(
    () => [props.buttons, props.row],
    () => {
        initActionButtons();
    },
    { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.table-column-action {
    display: flex;
    align-items: center;

    i.icomoon-more {
        font-size: 24px;
        color: #babac2;
        cursor: pointer;
    }

    .el-button {
        height: 28px;

        + .el-button {
            margin-left: 6px;
        }
    }
}
</style>
<style lang="less">
.el-popper.custom-action-dropdown {
    min-width: 80px;

    .el-dropdown-menu__item {
        font-size: 12px;
        font-weight: 400;
        color: #595959;
    }
}
</style>
