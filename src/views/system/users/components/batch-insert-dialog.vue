<!--
 * @创建者: yujinjin9@126.com
 * @描述: 批量新增用户弹窗
-->
<template>
    <el-dialog v-model="dialogVisible" title="批量导入用户" class="common-dialog" width="800px" @closed="dialogClosed">
        <el-steps :active="uploadInfo.step" simple>
            <el-step title="上传文件" :icon="Upload" />
            <el-step title="预览数据" :icon="Histogram" />
            <el-step title="导入数据" :icon="Finished" />
        </el-steps>
        <!-- 上传文件 -->
        <div v-if="uploadInfo.step === 1" class="upload-excel-panel">
            <virtually-progress v-if="uploadInfo.isShowProgress" :finished="!uploadInfo.isLoading" @after-finished="progressFinishedHandle">
                <div class="state-text">正在导入数据...</div>
            </virtually-progress>
            <div v-else class="upload-box">
                <ul class="tips-list">
                    <li>支持5MB以内的xls、xlsx格式文件</li>
                    <li>文件中的数据不能超过10000行，100列</li>
                    <li>
                        请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除。
                        <el-link type="primary" @click="downExcelTemplateHandle">模板下载</el-link>
                    </li>
                </ul>
                <el-upload
                    ref="uploadExcelRef"
                    v-model:file-list="uploadInfo.fileList"
                    class="upload-excel"
                    action="#"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    :auto-upload="false"
                    :limit="1"
                    :http-request="httpRequest"
                    :on-exceed="uploadExceedHandle"
                >
                    <template #trigger>
                        <el-button type="primary">选择文件</el-button>
                    </template>
                </el-upload>
                <el-alert v-if="uploadInfo.uploadErrorMessage" title="异常提示" type="error" show-icon>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="content" v-html="uploadInfo.uploadErrorMessage"></div>
                </el-alert>
            </div>

            <!-- <div v-if="uploadInfo.uploadErrorMessage" class="error-box">
                <el-icon><Warning /></el-icon>
                <div class="fail-tips">
                    <div class="title-text">异常提示</div>
                    <div class="content" v-html="uploadInfo.uploadErrorMessage"></div>
                </div>
            </div> -->
        </div>
        <!-- 数据预览 -->
        <div v-else-if="uploadInfo.step === 2" class="preview-data-panel">
            <div class="import-tips-box">
                <el-icon><Warning /></el-icon>
                <div class="tips-text">
                    共
                    <span>{{ uploadInfo.dataList.length }}</span>
                    条数据，导入
                    <span>{{ uploadInfo.selectColumns.length }}</span>
                    列 / 共
                    <span>{{ uploadInfo.tableColumnList.length }}</span>
                    列
                </div>
            </div>
            <el-table :data="uploadInfo.dataList" border stripe style="width: 100%" max-height="300">
                <el-table-column v-for="(column, index) in uploadInfo.tableColumnList" v-bind="column" :key="index">
                    <template #header>
                        {{ column.label }}
                        <el-checkbox :checked="uploadInfo.selectColumns.includes(column.prop)" @change="value => toggleCheckColumn(column.prop, value)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="60" align="center">
                    <template #default="{ $index }">
                        <el-button link type="primary" @click="deleteDataHandle($index)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 数据导入结果 -->
        <div v-else-if="uploadInfo.step === 3" class="import-result-panel">
            <div v-if="uploadInfo.batchInsertErrorMessage" class="error-box">
                <el-icon><CircleCloseFilled /></el-icon>
                <div class="fail-tips">
                    <div class="title-text">异常提示</div>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="subtitle-text" v-html="uploadInfo.batchInsertErrorMessage"></div>
                </div>
            </div>
            <!-- <el-alert title="异常提示" type="error" show-icon v-if="uploadInfo.batchInsertErrorMessage">
                <div class="content" v-html="uploadInfo.batchInsertErrorMessage"></div>
            </el-alert> -->
            <div v-else class="succes-box">
                <el-icon><SuccessFilled /></el-icon>
                <div class="title-text">批量导入完成</div>
                <div class="subtitle-text">
                    您已成功导入
                    <span>{{ uploadInfo.dataList.length }}</span>
                    条，
                    <span>{{ uploadInfo.selectColumns.length }}</span>
                    列数据
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button v-if="uploadInfo.step === 2 || (uploadInfo.step === 3 && !!uploadInfo.batchInsertErrorMessage)" @click="uploadInfo.step = uploadInfo.step - 1">上一步</el-button>
                <el-button
                    v-if="uploadInfo.step === 1"
                    type="primary"
                    :loading="uploadInfo.isShowProgress"
                    :disabled="uploadInfo.fileList.length === 0 || !!uploadInfo.uploadErrorMessage"
                    @click="excelUploadHandle"
                >
                    提交
                </el-button>
                <el-button
                    v-else-if="uploadInfo.step === 2"
                    type="primary"
                    :loading="uploadInfo.isLoading"
                    :disabled="uploadInfo.dataList.length === 0 || uploadInfo.selectColumns.length === 0"
                    @click="batchInsertHandle"
                >
                    确定
                </el-button>
                <el-button v-else-if="uploadInfo.step === 3" type="primary" @click="againUploadHandle">{{ !uploadInfo.batchInsertErrorMessage ? "再次" : "重新" }}上传</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { type CheckboxValueType, type UploadRequestOptions, type UploadUserFile, type UploadRawFile, ElUpload, genFileId, ElMessage } from "element-plus";
import { Upload, Histogram, Finished, Warning, SuccessFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import commonApi from "@/api/common";
import systemAPI from "@api/system";
import virtuallyProgress from "@views/components/virtually-progress.vue";
import templateFile from "/templates/批量新增用户模板.xlsx?url";

defineProps({
    isShow: {
        type: Boolean
    }
});

const emits = defineEmits(["update:isShow"]);

// 弹窗显示状态
const dialogVisible = ref(true);

const uploadExcelRef = ref<InstanceType<typeof ElUpload>>();

// excel上传信息
const uploadInfo = reactive({
    step: 1, // 当前操作步骤
    isLoading: false, // 是否正在加载
    isShowProgress: false, // 是否显示当前上传EXCEL的进度条 (当前进度条动画完成)
    fileList: [] as UploadUserFile[], // 上传的文件列表
    uploadErrorMessage: "", // 上传失败错误信息
    dataList: [] as Record<string, any>[], // 上传的数据列表
    selectColumns: ["loginName", "name", "gender", "email", "phoneNumber"] as string[], // 选择上传的列
    tableColumnList: [
        {
            label: "用户号",
            prop: "loginName",
            minWidth: 120
        },
        {
            label: "用户姓名",
            prop: "name",
            minWidth: 120
        },
        {
            label: "性别",
            prop: "gender",
            width: 80,
            formatter: (row: any, column: any, cellValue: string) => {
                if (!cellValue) {
                    return "-";
                } else if (cellValue === "1") {
                    return "男";
                } else if (cellValue === "2") {
                    return "女";
                }
                return "未知";
            }
        },
        {
            label: "Email",
            prop: "email",
            minWidth: 150
        },
        {
            label: "手机号码",
            prop: "phoneNumber",
            minWidth: 120
        }
    ] as Record<string, any>[], // 表格数据列
    batchInsertErrorMessage: "" // 批量新增失败错误信息
});

// 初始化
const init = function () {
    uploadInfo.step = 1;
    uploadInfo.uploadErrorMessage = "";
    uploadInfo.dataList = [];
    uploadInfo.batchInsertErrorMessage = "";
    uploadInfo.isShowProgress = false;
};

// 弹窗关闭事件
const dialogClosed = function () {
    emits("update:isShow", false);
};

// 下载EXCEL模板
const downExcelTemplateHandle = function () {
    commonApi.download({
        type: "a",
        url: templateFile,
        fileName: "批量新增用户模板.xlsx"
    });
};

// 文件上传请求
const httpRequest = async function (options: UploadRequestOptions) {
    try {
        uploadInfo.isLoading = true;
        uploadInfo.isShowProgress = true;
        const dataList = (await systemAPI.uploadUsersExcel(options.file, { isShowError: false })) as Record<string, any>[];
        uploadInfo.dataList = dataList;
    } catch (e: any) {
        uploadInfo.uploadErrorMessage = e.error.message;
    }
    uploadInfo.isLoading = false;
};

// 当前进度条加载动画完成操作
const progressFinishedHandle = function () {
    uploadInfo.isShowProgress = false;
    if (uploadInfo.uploadErrorMessage) {
        ElMessage.error(uploadInfo.uploadErrorMessage);
    } else {
        uploadInfo.step = 2;
    }
};

// 当超出限制时，执行的钩子函数
const uploadExceedHandle = function (files: File[]) {
    uploadExcelRef.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    uploadExcelRef.value!.handleStart(file);
};

// 切换选择列
const toggleCheckColumn = function (columnProp: string, isCheck: CheckboxValueType) {
    if (isCheck) {
        uploadInfo.selectColumns.push(columnProp);
    } else {
        uploadInfo.selectColumns.splice(uploadInfo.selectColumns.indexOf(columnProp), 1);
    }
};

// 删除数据
const deleteDataHandle = function (index: number) {
    uploadInfo.dataList.splice(index, 1);
};

// excel 上传
const excelUploadHandle = function () {
    if (uploadInfo.dataList.length > 0) {
        // 当前数据已经处理过（是从第二步返回到第一步过去的）
        uploadInfo.step = 2;
    } else {
        uploadExcelRef.value!.submit();
    }
};

// 批量添加
const batchInsertHandle = async function () {
    if (uploadInfo.isLoading) {
        return;
    }
    try {
        uploadInfo.batchInsertErrorMessage = "";
        uploadInfo.isLoading = true;
        await systemAPI.batchInsertUers(
            uploadInfo.dataList.map(item => {
                const newItem: Record<string, any> = {};
                uploadInfo.selectColumns.forEach(value => (newItem[value] = item[value]));
                return newItem;
            })
        );
    } catch (e: any) {
        uploadInfo.batchInsertErrorMessage = e.error.message;
    }
    uploadInfo.step = 3;
    uploadInfo.isLoading = false;
};

// 再次上传
const againUploadHandle = function () {
    uploadInfo.fileList = [];
};

watch(
    () => uploadInfo.fileList[0]?.uid,
    () => {
        // 文件变化，重新初始化
        init();
    }
);
</script>
<style lang="scss" scoped>
// .error-box {
//     display: flex;
//     margin-top: 10px;
//     border: 1px solid #e2e2e2;
//     border-radius: 4px;
//     min-height: 150px;

//     .el-icon {
//         width: 150px;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         border-right: 1px solid #e2e2e2;
//         font-size: 50px;
//         color: var(--el-color-warning);
//         background-color: #f2f2f2;
//     }

//     .fail-tips {
//         padding: 10px;
//         display: flex;
//         flex-direction: column;
//         justify-content: center;
//         font-size: 13px;
//         line-height: 20px;

//         .title-text {
//             font-weight: bold;
//         }
//     }
// }

.upload-excel-panel {
    height: 350px;
    .state-text {
        line-height: 20px;
        text-align: center;
        padding-top: 10px;
        font-size: 12px;
    }

    .upload-box {
        padding: 0px 30px;
        .tips-list {
            padding: 12px;
            list-style: disc;

            li {
                line-height: 25px;
                font-size: 13px;
            }
        }
    }

    :deep(.upload-excel) {
        padding-left: 20px;

        .el-upload-list__item {
            line-height: 24px;
        }
    }

    :deep(.virtually-progress) {
        padding: 100px 30px 0px;
    }
}

.preview-data-panel {
    height: 350px;
    .import-tips-box {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .el-icon {
            color: var(--el-color-warning);
            margin-right: 5px;
            font-size: 20px;
        }

        .tips-text {
            line-height: 25px;

            span {
                font-size: 15px;
                display: inline-block;
                padding: 0px 2px;
                color: var(--el-color-danger);
                font-weight: bold;
            }
        }
    }
}

.import-result-panel {
    height: 350px;
    padding-top: 80px;
    .succes-box,
    .error-box {
        text-align: center;

        .el-icon {
            font-size: 100px;
            color: var(--el-color-primary);
        }

        .title-text {
            font-weight: bold;
            font-size: 20px;
            padding: 8px 0px;
            line-height: 30px;
        }

        .subtitle-text {
            font-size: 13px;
            color: #666;

            span {
                font-size: 15px;
                display: inline-block;
                padding: 0px 2px;
                color: var(--el-color-danger);
                font-weight: bold;
            }
        }
    }

    .error-box {
        .el-icon {
            color: var(--el-color-danger);
        }
    }
}
</style>
