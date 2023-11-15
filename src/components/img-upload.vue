<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-27 16:05:19
 * @项目的路径: \vue-manager-system\src\components\img-upload.vue
 * @描述: 图片上传组件
-->
<template>
    <div class="img-upload">
        <el-upload v-bind="uploadInnerProps" v-model:file-list="fileList" ref="updloadRef">
            <template #default>
                <slot><el-button type="primary">点击上传</el-button></slot>
            </template>
            <template #tip v-if="maxSize > 0">
                <div class="el-upload__tip">只能上传图片文件，且不超过{{ maxSize > 1024 ? numberFormat(maxSize / 1024, 1) + "M" : maxSize + "KB" }}</div>
            </template>
        </el-upload>
        <el-dialog v-model="isShowCropperDialog" class="cropper-dialog" title="图片裁剪" :append-to-body="true" :close-on-click-modal="false" width="1000px">
            <div class="cropper-panel">
                <div class="cropper-box">
                    <img :src="cropperImg" ref="cropperImgRef" />
                </div>
                <div class="preview-box">
                    <div class="tips-text">图片预览：</div>
                    <div class="preview-img-box" ref="previewImgRef"></div>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetCropper">复位</el-button>
                    <el-button @click="rotateCropper">旋转</el-button>
                    <el-button @click="changeDirectionCropper">换向</el-button>
                    <el-button type="primary" @click="saveCropper">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox , ElUpload} from "element-plus";
import type { UploadProps, UploadRequestOptions, UploadFile, UploadFiles, UploadUserFile } from "element-plus";
import type { Ref, PropType } from "vue";
import { numberFormat } from "@yujinjin/utils";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import commonAPI from "@api/common";

const props = defineProps({
    // 上传的组件的值
    modelValue: {
        type: [String, Array] as PropType<string | string[]>
    },
    // 上传属性配置选项，具体见（element-plus upload文档）
    uploadProps: {
        type: Object as PropType<Partial<UploadProps>>
    },
    // 图片裁剪的配置选项，具体见（cropperjs文档）, 如果需要裁剪一次只能上传一张图片
    cropperProps: {
        type: [Boolean, Object] as PropType<boolean | Cropper.Options>,
        default: false
    },
    // 上传图片的最大尺寸（单位KB）
    maxSize: {
        type: Number,
        default: 2048
    },
    // 分隔符，modelValue可能是多个图片的路径用"|"隔开的字符串
    separator: {
        type: String,
        default: "|"
    }
});

const emits = defineEmits(["update:modelValue"]);

// 上传组件内部属性
const uploadInnerProps: Ref<Partial<UploadProps>> = ref({});

// 当前文件上传列表
const fileList: Ref<UploadUserFile[]> = ref([]);

// 是否显示裁剪弹窗
const isShowCropperDialog: Ref<boolean> = ref(false);

const updloadRef = ref<InstanceType<typeof ElUpload>>();

// 剪切图片ref
const cropperImgRef: Ref<HTMLImageElement | null> = ref(null);

// 预览图片ref
const previewImgRef: Ref<HTMLDivElement | null> = ref(null);

// 上传的图片地址
const cropperImg: Ref<string> = ref("");

// 图片裁剪实例化对象
let cropperInstance: Cropper;

// ModelValue的string格式，解决双向绑定时与fileList的值并不是同样的数据而产生的多次修改ModelValue值
let newModelValue = "";

// 剪切图片的方向
let directionCropper = false;

// 把当前modelValue转换成upload组件所用的文件格式列表
const generateFileList = function () {
    if (!props.modelValue) {
        fileList.value = [];
    } else if (Array.isArray(props.modelValue)) {
        fileList.value = JSON.parse(JSON.stringify(props.modelValue));
    } else if (uploadInnerProps.value.limit === 1) {
        fileList.value = [{ name: props.modelValue.substring(props.modelValue.lastIndexOf("/")), url: props.modelValue }];
    } else {
        fileList.value = props.modelValue.split(props.separator).map(url => ({ name: url.substring(url.lastIndexOf("/")), url }));
    }
};

// 显示剪切图片弹窗
const showCroppDialogHandle = async function () {
    isShowCropperDialog.value = true;
    await nextTick();
    if (cropperInstance) {
        cropperInstance.replace(cropperImg.value);
    } else {
        cropperInstance = new Cropper(
            cropperImgRef.value!,
            Object.assign(
                {
                    viewMode: 1, // 0:无限制;1:将裁剪框限制为不超过画布的大小;2:限制最小画布尺寸以适应容器。如果画布和容器的比例不同，则最小画布将在其中一个维度中被额外的空格包围。3:限制最小画布尺寸以填充容器。如果画布和容器的比例不同，则容器将无法将整个画布适合其中一个尺寸。
                    aspectRatio: 1 / 1, // 默认比例
                    preview: previewImgRef.value, // 预览视图
                    guides: false, // 裁剪框的虚线(九宫格)
                    autoCropArea: 0.8, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
                    movable: false, // 是否允许移动图片
                    dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
                    cropBoxMovable: true, // 是否允许移动剪裁框
                    resizable: true, // 是否允许改变裁剪框的大小
                    zoomable: false, // 是否允许缩放图片大小
                    mouseWheelZoom: true, // 是否允许通过鼠标滚轮来缩放图片
                    touchDragZoom: true, // 是否允许通过触摸移动来缩放图片
                    rotatable: true // 是否允许旋转图片
                },
                props.cropperProps
            ) as Cropper.Options
        );
    }
};

// 关闭裁剪弹窗
const closeCroppDialog = function () {
    if (cropperInstance) {
        cropperInstance.destroy();
    }
    isShowCropperDialog.value = false;
};

// 图片上传API
const imageUploadApi = async function (file: File) {
    const img = (await commonAPI.uploadImage({ file })) as string;
    if (uploadInnerProps.value.limit === 1) {
        fileList.value = [{ name: img.substring(img.lastIndexOf("/")), url: img }];
    } else {
        fileList.value.splice(0, 0, { name: img.substring(img.lastIndexOf("/")), url: img });
    }
};

// 文件列表变化
const fileListChange = function () {
    if (Array.isArray(props.modelValue)) {
        newModelValue = JSON.stringify(fileList.value);
        emits("update:modelValue", JSON.parse(newModelValue));
    } else {
        newModelValue = fileList.value.map(item => item.url).join(props.separator);
        emits("update:modelValue", newModelValue);
    }
};

// 复位
const resetCropper = function () {
    cropperInstance?.reset();
};

// 旋转
const rotateCropper = function () {
    cropperInstance?.rotate(45);
};
// 换向
const changeDirectionCropper = function () {
    cropperInstance?.scaleX(directionCropper ? -1 : 1);
    directionCropper = !directionCropper;
};

// 保存剪切的图
const saveCropper = function () {
    try {
        cropperInstance.getCroppedCanvas().toBlob(async blob => {
            if (blob!.size / 1024 > props.maxSize) {
                ElMessage.error("文件大小超出限制！");
                return;
            }
            await imageUploadApi(new File([blob!], Date.now() + ".jpg", { type: "image/jpeg", lastModified: Date.now() }));
            fileListChange();
            closeCroppDialog();
        }, "image/jpeg");
    } catch (error) {
        logs.error(error);
    }
};

// 默认上传属性
const defaultUploadProps = {
    action: "", // 图片上传地址
    // 覆盖默认的 Xhr 行为，允许自行实现上传文件的请求
    httpRequest: function (options: UploadRequestOptions): Promise<void> {
        return imageUploadApi(options.file).then(() => {
            fileListChange();
            return;
        });
    },
    // 图片上传变化
    onChange: function (file: UploadFile, files: UploadFiles) {
        // 由于element plus upload组件上传之后会自动添加一个预览文件。
        // 这里是自定义实现的文件上传请求，所以必须是上传完文件之后才展示处理， 这里删除掉
        files.pop();
        if (!props.cropperProps) {
            // 当前图片无需剪切
            return;
        }
        const imgFileReader = new FileReader();
        imgFileReader.onload = e => {
            cropperImg.value = e.target!.result as string;
            showCroppDialogHandle();
        };
        imgFileReader.readAsDataURL(file.raw!);
    },
    // 图片上传前操作
    beforeUpload: async function (file) {
        if (file.size / 1024 > props.maxSize) {
            ElMessage.error("文件大小超出限制！");
            return false;
        }
    },
    onExceed() {
        if (uploadInnerProps.value.limit && uploadInnerProps.value.limit > 1) {
            ElMessageBox.alert("您最多只能上传" + uploadInnerProps.value.limit + "个图片!", "上传图片", {
                confirmButtonText: "确定",
                type: "warning"
            });
        }
    },
    listType: "picture",
    onRemove: function (uploadFile: UploadFile, uploadFiles: UploadFiles) {
        fileList.value = uploadFiles;
        fileListChange();
    },
    accept: "image/*",
    multiple: false
};

watch(
    () => [props.uploadProps, props.cropperProps],
    () => {
        uploadInnerProps.value = Object.assign({}, defaultUploadProps, props.uploadProps, {
            autoUpload: !props.cropperProps
        });
    },
    { immediate: true, deep: true }
);

watch(
    () => props.modelValue,
    value => {
        if ((!value && !newModelValue) || value === newModelValue || JSON.stringify(value) === newModelValue) {
            return;
        }
        generateFileList();
    },
    {
        immediate: true,
        deep: true
    }
);
</script>
<style lang="less" scoped>
// 因为是dialog是放在body上的，所以不能在img-upload下写样式
// 由于该插件不能动态计算宽高，所以只能在样式里指定宽高才会展示
.cropper-panel {
    display: flex;
    width: 100%;
    height: 500px;

    .cropper-box {
        width: 780px;
        height: 500px;
        border: solid 1px #ddd;
    }

    .preview-box {
        display: inline-block;
        width: 180px;
        padding-left: 20px;

        .tips-text {
            line-height: 40px;
            color: #000;
        }

        .preview-img-box {
            width: 160px;
            height: 160px;
            overflow: hidden;
        }
    }
}
</style>
<style lang="less">
.el-dialog.cropper-dialog {
    .el-dialog__body {
        padding: 12px 20px 0px;
        overflow-y: auto;
    }

    .el-dialog__footer {
        padding: 8px 20px;
        box-shadow: 0px -1px 0px 0px #f5f5f5, 0px 1px 30px 0px rgba(0, 21, 41, 0.12);

        .el-button {
            min-width: 80px;
        }
    }
}
</style>
