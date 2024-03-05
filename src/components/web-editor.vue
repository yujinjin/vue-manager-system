<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-05 17:53:55
 * @项目的路径: \vue-manager-system\src\components\web-editor.vue
 * @描述: web 富文本框编辑器
-->
<template>
    <div class="web-editor-container">
        <div class="web-editor" ref="webEditorRef"></div>
        <input type="file" @change="imgFileChangeHandle" accept="image/*" ref="inputFileRef" v-show="false" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, inject } from "vue";
import type { Ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { debounce } from "@yujinjin/utils";
import commonAPI from "@api/common";
import { formItemContextKey, formContextKey } from "element-plus";
import type { FormContext, FormItemContext } from "element-plus";

const props = defineProps({
    modelValue: String,
    disabled: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:modelValue"]);

// web 编辑器ref
const webEditorRef = ref(null);

// inputFile ref
const inputFileRef: Ref<HTMLInputElement | null> = ref(null);

// 当前elForm实例
const elForm = inject(formContextKey, {} as FormContext);

// 当前elFormItem实例
const elFormItem = inject(formItemContextKey, {} as FormItemContext);

// quill富文本框编辑器实例
let quillInstance;

// 输入内容变化操作
const textChangeHandle = debounce(() => {
    emits("update:modelValue", quillInstance.getText());
    elFormItem?.validate("change");
}, 300);

// 图片文件选择变化
const imgFileChangeHandle = async function (e) {
    const img = (await commonAPI.uploadImage({ file: e.target.files[0] })) as string;
    //图片上传成功之后的回调
    let range = quillInstance.getSelection();
    if (!range) {
        quillInstance.focus();
        range = quillInstance.getSelection();
    }
    quillInstance.insertEmbed(range.index, "image", img); //将上传好的图片，插入到富文本的range.index（当前光标处）
};

// 初始化quill
const initQuill = function () {
    quillInstance = new Quill(webEditorRef.value, {
        modules: {
            toolbar: {
                container: ["bold", "italic", "underline", { header: 1 }, { header: 2 }, "blockquote", "code-block", "code", "link", { list: "ordered" }, { list: "bullet" }, "image", ["clean"]],
                handlers: {
                    image: function () {
                        inputFileRef.value!.click();
                    }
                }
            }
        },
        theme: "snow",
        readOnly: props.disabled === true,
        placeholder: "输入内容..."
    });
    if (props.modelValue) {
        quillInstance.setText(props.modelValue);
    }
    quillInstance.on("text-change", function () {
        textChangeHandle();
    });
};

watch(
    () => props.modelValue,
    value => {
        if (!quillInstance || value === quillInstance.getText()) return;
        quillInstance.setText(props.modelValue);
    }
);

watch(
    () => props.disabled === true || (elForm?.disabled === true && props.disabled !== false),
    value => {
        if (!quillInstance) return;
        quillInstance.enable(!value);
    }
);

onMounted(() => {
    initQuill();
});

onUnmounted(() => {
    if (quillInstance) {
        // quillInstance.dis;
    }
});
</script>
<style lang="less" scoped>
.web-editor-container {
    width: 100%;
    min-height: 200px;
    display: flex;
    flex-direction: column;

    .web-editor {
        width: 100%;
        flex: 1;
    }

    .ql-toolbar.ql-snow {
        width: 100%;
    }
}
</style>
