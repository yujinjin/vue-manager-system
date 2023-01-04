<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-03 17:31:38
 * @项目的路径: \vue-manager-system\src\components\web-editor.vue
 * @描述: web 富文本框编辑器
-->
<template>
    <div class="web-editor" ref="webEditorRef"></div>
    <input type="file" @change="imgFileChangeHandle" accept="image/*" ref="inputFileRef" v-show="false" />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, inject } from "vue";
import type { Ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { debounce } from "@/utils/others";
import CommonAPI from "@api/common";
import { formItemContextKey, formContextKey } from "element-plus";
import type { FormContext, FormItemContext } from "element-plus";

const props = defineProps({
    moduleValue: String,
    disabled: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:moduleValue"]);

//
const webEditorRef = ref(null);

const inputFileRef: Ref<HTMLInputElement | null> = ref(null);

const elForm = inject(formContextKey, {} as FormContext);

const elFormItem = inject(formItemContextKey, {} as FormItemContext);

let quillInstance;

const textChangeHandle = debounce(() => {
    emits("update:moduleValue", quillInstance.getText());
    elFormItem?.validate("change");
}, 300);

const imgFileChangeHandle = async function (e) {
    const img = (await CommonAPI.uploadImage({ file: e.target.files[0] })) as string;
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
    if (props.moduleValue) {
        quillInstance.setText(props.moduleValue);
    }
    quillInstance.on("text-change", function () {
        textChangeHandle();
    });
};

watch(
    () => props.moduleValue,
    value => {
        if (!quillInstance || value === quillInstance.getText()) return;
        quillInstance.setText(props.moduleValue);
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
.web-editor {
    width: 100%;
    min-height: 100px;
}
</style>
