<template>
	<el-dialog v-bind="dialogAttributes" custom-class="excel-import-dialog" :visible="isShow" @close="close">
		<div class="dialog-body">
			<el-steps :active="step" simple v-if="step != 3">
				<el-step title="上传文件" icon="el-icon-upload"></el-step>
				<el-step title="预览数据" icon="el-icon-s-data"></el-step>
				<el-step title="导入数据" icon="el-icon-success"></el-step>
			</el-steps>
			<template v-if="step == 1">
				<!-- 
                    上传文件
                -->
				<slot name="upload">
					<div class="upload-panel" v-if="uploadSuccess">
						<ul class="tips-list">
							<li>支持5MB以内的xls、xlsx格式文件</li>
							<li>文件中的数据不能超过10000行，100列</li>
							<li>请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除。<a v-if="excelTemplate" @click="downExcelTemplate">模板下载</a></li>
						</ul>
						<el-upload class="upload-excel" v-bind="uploadAttributes">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						</el-upload>
					</div>
					<div class="upload-fail" v-else>
						<div class="icon-box">
							<i class="el-icon-warning"></i>
						</div>
						<div class="fail-tips">
							<div class="title-text">异常提示</div>
							<div class="content" v-html="uploadErrorInfo"></div>
						</div>
					</div>
				</slot>
			</template>
			<template v-else-if="step == 2">
				<!-- 
                    数据预览
                -->
				<div class="import-result-text">
					<i class="el-icon-warning"></i>
					共 <span>{{ importData.length }}</span> 条数据， 导入<span>{{ selectColumns.length }}</span
					>列 /共<span>{{ columnList.length }}</span
					>列
				</div>
				<el-table :data="importData" border style="width: 100%" height="350">
					<el-table-column v-bind="column" :key="index" v-for="(column, index) in columnList">
						<template slot="header"> {{ column.label }} <el-checkbox :checked="selectColumns.includes(column.prop)" @change="toggleCheckColumn(column.prop, $event)"></el-checkbox> </template>
					</el-table-column>
				</el-table>
			</template>
			<template v-else-if="step == 3">
				<!-- 
                    数据导入结果
                -->
				<div class="succes-box" v-if="progress.percentage > 100">
					<i class="el-icon-success"></i>
					<div class="title-text">批量导入完成</div>
					<div class="subtitle-text">
						您已成功导入<span>{{ importData.length }}</span
						>条，<span>{{ selectColumns.length }}</span
						>列数据
					</div>
				</div>
				<div class="importing-box" v-else>
					<el-progress :text-inside="true" :stroke-width="26" :percentage="progress.percentage"></el-progress>
					<div class="state-text">
						正在导入数据<span>{{ importData.length }}</span
						>条
					</div>
				</div>
			</template>
		</div>
		<!-- Dialog 按钮操作区的内容 -->
		<div slot="footer" class="dialog-footer" v-if="step !== 3">
			<el-button v-if="step == 1 && !uploadSuccess" @click="againUpload">重新上传</el-button>
			<el-button v-if="step == 2" @click="gotoPrevStep">上一步</el-button>
			<el-dropdown split-button type="primary" :disabled="!uploadAttributes.fileList || uploadAttributes.fileList.length != 1" @click="gotoExcelUpload" @command="gotoExcelUpload" v-if="step == 1 && uploadSuccess">
				确定导入
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="success">成功</el-dropdown-item>
					<el-dropdown-item command="fail">失败</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-button type="primary" @click="gotoNexStep" v-else-if="step == 2">下一步</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { Loading } from "element-ui";
export default {
	data() {
		return {
			dialogAttributes: {}, // 当前dialog属性
			step: 1, // 当前操作步骤
			selectColumns: [],
			importData: [],
			columnList: [],
			fileId: null, // 上传后的文件ID
			uploadSuccess: true,
			uploadErrorInfo: "",
			isLoading: false,
			progress: {
				timoutId: null,
				times: 0,
				percentage: 0,
				finish: false
			},
			uploadAttributes: {
				action: config.uploadImgServer,
				httpRequest: this.excelUpload,
				onChange: this.onFileChange,
				multiple: false,
				accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
				drag: true,
				ref: "excel-file",
				// showFileList: false,
				fileList: [],
				autoUpload: false
			}
		};
	},
	props: {
		dialog: Object, // elment的dialog的属性
		isShow: Boolean,
		upload: Object, // elment的upload上传属性
		excelTemplate: String, // excel模板下载地址
		parameters: [String, Function] // 模板数据上传参数
	},
	watch: {
		isShow(val) {
			if (!val) {
				this.step = 1; // 当前操作步骤
				this.selectColumns = [];
				this.importData = [];
				this.columnList = [];
				this.fileId = null;
				this.uploadSuccess = true;
				this.uploadErrorInfo = "";
				this.isLoading = false;
				this.progress = {
					timoutId: null,
					times: 0,
					percentage: 0,
					finish: false
				};
				this.init();
			}
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generateDialogAttributes();
			this.uploadAttributes = site.utils.extend(true, this.uploadAttributes, this.upload);
		},
		// 生成dialog属性配置
		generateDialogAttributes() {
			this.dialogAttributes = site.utils.extend(
				true,
				{
					title: "excel数据导入",
					closeOnClickModal: false
				},
				this.dialog
			);
		},
		close() {
			this.$emit("update:isShow", false);
		},
		toggleCheckColumn(columnProp, isCheck) {
			let i = this.selectColumns.findIndex(item => item == columnProp);
			if (i == -1 && isCheck) {
				this.selectColumns.push(columnProp);
			} else if (i != -1 && !isCheck) {
				this.selectColumns.splice(i, 1);
			}
		},
		onFileChange(file) {
			console.info(file);
			this.uploadAttributes.fileList = [file];
			this.uploadSuccess = true;
		},
		downExcelTemplate() {
			window.open(this.excelTemplate);
		},
		excelUpload() {
			// TODO: parameters提交
			let parameters = { excelFile: this.uploadAttributes.fileList[0].file };
			if (this.parameters && typeof this.parameters == "object") {
				parameters = site.utils.extend(true, parameters, this.parameters);
			} else if (this.parameters && typeof this.parameters == "function") {
				parameters = site.utils.extend(true, parameters, this.parameters());
			}
			return site.api.common.excelUpload(parameters);
		},
		submitUpload() {
			return site.api.common.excelImport({ fileId: this.fileId });
		},
		againUpload() {
			this.uploadSuccess = true;
			this.uploadAttributes.fileList = [];
		},
		// 测试专用
		excelUploadFail() {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					reject("第1行： 已存在名称为【 上海阿蜜科技有限公司 】的客户，如果继续导入将会更新这条客户的数据<br />第2行：【客户名称】字段不能为空");
				}, 2000);
			});
		},
		// 测试专用
		async gotoExcelUpload(command) {
			if (command == "fail") {
				let loadingInstance = Loading.service({ fullscreen: true });
				try {
					await this.excelUploadFail();
				} catch (error) {
					this.uploadSuccess = false;
					this.uploadErrorInfo = error;
					loadingInstance.close();
				}
			} else if (this.uploadAttributes.fileList.length == 0) {
				this.$message.error("请先上传exce文件");
			} else {
				this.gotoNexStep();
			}
		},
		gotoPrevStep() {
			this.step = 1;
		},
		async gotoNexStep() {
			if (this.isLoading) {
				return;
			}
			this.isLoading = true;
			if (this.step == 1) {
				let loadingInstance = Loading.service({ fullscreen: true });
				try {
					// 上传Excel文件
					let excelUploadData = await this.excelUpload();
					this.fileId = excelUploadData.fileId;
					this.importData = excelUploadData.data;
					this.columnList = excelUploadData.columns;
					this.selectColumns = [];
					this.columnList.forEach(item => {
						this.selectColumns.push(item.prop);
					});
					this.step = 2;
					this.uploadSuccess = true;
				} catch (error) {
					this.uploadSuccess = false;
				} finally {
					loadingInstance.close();
					this.isLoading = false;
				}
			} else {
				try {
					this.step = 3;
					this.importProgress();
					await this.submitUpload();
					this.progress.finish = true;
				} catch (error) {
					// 不考虑失败情况
				} finally {
					this.isLoading = false;
				}
			}
		},
		// 做一个假的加载进度条
		importProgress() {
			if (this.progress.timoutId) {
				clearInterval(this.progress.timoutId);
			}
			this.progress.times = 0;
			let ratio = 0.1;
			this.progress.timoutId = setInterval(() => {
				++this.progress.times;
				if (this.progress.percentage == 100) {
					clearInterval(this.progress.timoutId);
					this.progress.percentage = 101;
					this.progress.timoutId = null;
					return;
				} else if (this.progress.percentage > 95 && this.progress.finish) {
					this.progress.percentage = 100;
					return;
				} else if (this.progress.finish) {
					ratio = 1;
				} else if (this.progress.percentage > 80) {
					ratio = 0.2;
				} else {
					ratio = 0.1 * (this.progress.times % 10);
				}
				this.progress.percentage = parseInt(this.progress.percentage + (99 - this.progress.percentage) * ratio * Math.random(), 10);
			}, 500);
		}
	},
	beforeDestroy() {
		if (this.progress.timoutId) {
			clearInterval(this.progress.timoutId);
		}
	}
};
</script>
<style lang="less" scoped>
.excel-import-dialog {
	.dialog-body {
		min-height: 400px;

		.upload-panel {
			.tips-list {
				padding: 20px 30px;
				list-style: disc;

				li {
					line-height: 25px;
					font-size: 13px;
				}
			}
		}

		.upload-fail {
			display: flex;
			margin-top: 10px;
			border: 1px solid #e2e2e2;
			border-radius: 4px;
			min-height: 150px;

			.icon-box {
				width: 150px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-right: 1px solid #e2e2e2;
				font-size: 50px;
				color: #e6a23c;
				background-color: #f2f2f2;
			}

			.fail-tips {
				padding: 10px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				font-size: 13px;
				line-height: 20px;

				.title-text {
					font-weight: bold;
				}
			}
		}

		.import-result-text {
			padding: 10px;
			text-align: right;
			line-height: 25px;

			i {
				color: #e6a23c;
				margin-right: 5px;
				font-size: 20px;
			}

			span {
				font-size: 15px;
				display: inline-block;
				padding: 0px 2px;
				color: #f56c6c;
				font-weight: bold;
			}
		}

		.importing-box {
			padding: 150px 50px;

			.state-text {
				line-height: 20px;
				text-align: center;
				padding-top: 10px;
				font-size: 12px;

				span {
					font-size: 15px;
					display: inline-block;
					padding: 0px 2px;
					color: #f56c6c;
					font-weight: bold;
				}
			}
		}

		.succes-box {
			padding: 100px;
			text-align: center;

			i {
				font-size: 100px;
				color: #67c23a;
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
					color: #f56c6c;
					font-weight: bold;
				}
			}
		}
	}
}
</style>
<style lang="less">
.upload-excel .el-upload {
	width: 100%;

	.el-upload-dragger {
		width: 100%;
		height: 220px;
	}
}
</style>
