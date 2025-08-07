<!--
 * @创建者: yujinjin9@126.com
 * @描述: html编辑器
-->
<template>
    <div class="html-editor-container" :class="{ dragging: state.dragging }" ref="containerRef" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd">
        <div class="left-panel" :style="{ width: state.split + '%' }">
            <div class="editor" ref="editorRef"></div>
            <div class="dragger" @mousedown.prevent="dragStart"></div>
        </div>
        <div class="right-panel" ref="rightRef" :style="{ width: 100 - state.split + '%' }">
            <div v-show="state.dragging" class="preview-size">{{ `${state.previewWidth}px x ${state.previewHeight}px` }}</div>
            <iframe ref="previewIFrameRef" frameborder="0"></iframe>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, nextTick } from "vue";
import { useDebounceFn } from "@vueuse/core";
import * as monacoEditor from "monaco-editor";
// 导入各个语言的Worker
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// 配置Worker工厂
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === "json") {
            return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
            return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return new htmlWorker();
        }
        if (label === "typescript" || label === "javascript") {
            return new tsWorker();
        }
        // 默认使用编辑器Worker
        return new editorWorker();
    }
};

// 双向绑定的value
const modelValue = defineModel({ type: String, default: "" });

// 整个容器
const containerRef = ref<HTMLDivElement>();

// 编辑器容器
const editorRef = ref<HTMLDivElement>();

// 预览容器
const previewIFrameRef = ref<HTMLIFrameElement>();

// 右侧容器
const rightRef = ref<HTMLDivElement>();

// 拖拽状态
const state = reactive({
    dragging: false,
    split: 50,
    previewHeight: 0,
    previewWidth: 0
});

// 开始位置
let startPosition = 0;

// 开始分割
let startSplit = 0;

// 编辑器示例
let editorInstance: monacoEditor.editor.IStandaloneCodeEditor | null = null;

let isValueChanging = false;

watch(modelValue, newValue => {
    if (!isValueChanging && editorInstance && newValue !== editorInstance.getValue()) {
        editorInstance.setValue(newValue);
        previewIFrameRef.value!.contentWindow!.document.body.innerHTML = modelValue.value;
    }
});

// 修改预览尺寸
const changePreviewSize = function () {
    state.previewHeight = rightRef.value?.offsetHeight || 0;
    state.previewWidth = rightRef.value?.offsetWidth || 0;
};

// 拖动开始事件
const dragStart = function (e: MouseEvent) {
    state.dragging = true;
    startPosition = e.pageX;
    startSplit = state.split;
    changePreviewSize();
};

// 拖动过程
const dragMove = function (e: MouseEvent) {
    if (!state.dragging) {
        return;
    }
    const currentPosition = e.pageX;
    const totalWidth = containerRef.value?.offsetWidth || 0;
    const split: number = startSplit + parseFloat((((currentPosition - startPosition) / totalWidth) * 100).toFixed(2));
    if (split > 80) {
        state.split = 80;
    } else if (split < 20) {
        state.split = 20;
    } else {
        state.split = split;
    }
    changePreviewSize();
};

// 拖动结束事件
const dragEnd = function () {
    state.dragging = false;
};

onMounted(() => {
    if (editorInstance) {
        return;
    }

    const STYLES_CODE = `
        body {
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            font-size: 14px;
            color: #333333;
        }

        * {
            box-sizing: border-box;
            outline: none;
            scrollbar-color: #ddd #fafafa;
            scrollbar-track-color: #fafafa;
            scrollbar-width: thin;
        }
        /*滚动条整体样式*/
        ::-webkit-scrollbar {
            width: 6px; /*竖向滚动条的宽度*/
            height: 6px; /*横向滚动条的高度*/
        }
        ::-webkit-scrollbar-thumb {
            /*滚动条里面的小方块*/
            background: #ddd;
            border-radius: 5px;
        }
        ::-webkit-scrollbar-track {
            /*滚动条轨道的样式*/
            background: #fafafa;
            border-radius: 5px;
        }
    `;
    const style: HTMLStyleElement = document.createElement("style");
    // style.rel = "stylesheet";
    // style.type = "text/css";
    style.appendChild(document.createTextNode(STYLES_CODE));
    previewIFrameRef.value!.contentWindow!.document.head.appendChild(style);

    editorInstance = monacoEditor.editor.create(editorRef.value!, {
        value: modelValue.value,
        language: "html",
        automaticLayout: true, // 自动布局
        theme: "vs-dark", // 官方自带三种主题vs, hc-black, or vs-dark
        minimap: {
            enabled: false // 关闭小地图
        }
        // lineNumbers: "off" // 隐藏控制行号
    });

    const debouncedFn = useDebounceFn(() => {
        modelValue.value = editorInstance!.getValue();
        previewIFrameRef.value!.contentWindow!.document.body.innerHTML = editorInstance!.getValue();
        nextTick(() => {
            isValueChanging = false;
        });
    }, 100);

    editorInstance.onDidChangeModelContent(() => {
        isValueChanging = true;
        debouncedFn();
    });

    if (modelValue.value) {
        previewIFrameRef.value!.contentWindow!.document.body.innerHTML = modelValue.value;
    }
});

onUnmounted(() => {
    if (editorInstance) {
        editorInstance.dispose();
    }
});
</script>
<style lang="scss" scoped>
.html-editor-container {
    display: flex;
    height: 100%;
    position: relative;
    --border: #383838;
    --text-light: #aaa;

    .left-panel,
    .right-panel {
        position: relative;
        height: 100%;
    }

    &.dragging {
        cursor: ew-resize;

        .left-panel,
        .right-panel {
            pointer-events: none;
        }
    }

    .left-panel {
        // border-right: 1px solid var(--border);

        .dragger {
            position: absolute;
            z-index: 3;
            top: 0;
            bottom: 0;
            right: -5px;
            width: 10px;
            cursor: ew-resize;
        }

        .editor {
            height: 100%;
            width: 100%;
            overflow: hidden;
            position: relative;
        }
    }

    .right-panel {
        border: 1px solid #ced4da;
        .preview-size {
            position: absolute;
            top: 0px;
            left: 0px;
            font-size: 12px;
            color: var(--text-light);
            z-index: 100;
            padding: 10px;
            background-color: #fff;
        }

        iframe {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
