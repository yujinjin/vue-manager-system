<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-07 14:27:44
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-03 18:19:18
 * @项目的路径: \vue-manager-system\src\components\action-bar.vue
 * @描述: 列表操作栏
-->
<template>
    <div class="action-bar-panel">
        <slot></slot>
        <div class="buttons-panel" :style="{ textAlign: align }" v-if="actionButtons.length > 0">
            <el-button v-for="(button, index) in actionButtons" :key="(button.handleCode || '') + '_' + index" v-bind="button.props" @click="clickHandle(button)" :loading="button.isLoading">
                {{ button.text }}
            </el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Components } from "/#/components";
import type { PropType, Ref } from "vue";
import { ref, watch } from "vue";
import { dataStore } from "@/stores/";
import { TextAlignProperty } from "csstype";

const props = defineProps({
    buttons: {
        type: Array as PropType<Components.TableButton[]>,
        default: function () {
            return [];
        }
    },
    // 当前选中的行数据列表
    selectRows: {
        type: Array,
        default: function () {
            return [];
        }
    },
    // 按钮默认位置
    align: {
        type: String as PropType<TextAlignProperty>,
        default: "right"
    },
    // 页面名称，用于获取有权限的按钮数据
    pageName: {
        type: String
    }
});

const emits = defineEmits(["selectRowsChange"]);

// 实际数据列中的操作按钮列表
// isLoading: 当前按钮是否正在加载
// handleCode: 用户操作CODE
// text: 按钮操作文案
// click: 按钮点击事件
const actionButtons: Ref<Components.TableButton[]> = ref([]);

const store = dataStore();

// 初始化操作按钮列表
const initActionButtons = function () {
    actionButtons.value = [];
    props.buttons.forEach(button => {
        if (!button.handleCode || !props.pageName || store.buttonPermissions[props.pageName].includes(button.handleCode)) {
            button = Object.assign({ isLoading: false }, button);
            button.props = Object.assign({}, button.props);
            actionButtons.value.push(button);
        }
    });
};

// 按钮点击操作
const clickHandle = async function (button) {
    if (button.isLoading) {
        return;
    }
    button.isLoading = true;
    try {
        if (button.click) {
            await button.click(props.selectRows, button);
        }
    } catch (error) {
        logs.error(error);
    }
    button.isLoading = false;
};

watch(
    () => props.buttons,
    () => {
        initActionButtons();
    },
    { deep: true, immediate: true }
);

watch(
    () => props.selectRows,
    () => {
        emits("selectRowsChange", props.selectRows, actionButtons.value);
    },
    { deep: true, immediate: true }
);
</script>
<style lang="less" scoped>
.action-bar-panel {
    padding: 16px 16px 0px;

    .el-button {
        height: 28px;

        + .el-button {
            margin-left: 6px;
        }
    }
}
</style>
