<template>
	<el-dialog v-bind="dialogAttributes" custom-class="excel-export-dialog" :visible="isShow" @close="close">
		<div class="dialog-body">
			<!-- 导入初始化时状态 -->
			<template v-if="loadType == 0">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>筛选条件</span>
					</div>
					<form-input v-if="fields && fields.length > 0" :fields="fields" :form="form" :column="column" ref="form-input" @input-change="formInputChange">
						<template v-for="slotName in formInputSlotNameList" v-slot:[slotName]="{ formInput }">
							<slot :name="slotName" v-bind:formInput="formInput"></slot>
						</template>
					</form-input>
				</el-card>
				<el-card class="box-card" style="margin-top: 10px;" shadow="hover" v-if="exportFields && exportFields.length > 0">
					<div slot="header" class="clearfix">
						<span>请选择导出的字段</span>
					</div>
					<div class="export-table-panel">
						<div class="row-header">
							<el-checkbox :indeterminate="indeterminateCheckState" v-model="checkAll" @change="handleCheckAllChange">字段名称</el-checkbox>
						</div>
						<el-checkbox-group v-model="selectExportFields" @change="handleCheckedFieldsChange">
							<div class="row-info" v-for="(exportField, index) in exportFields" :key="index">
								<el-checkbox :label="exportField.name">{{ exportField.label }}</el-checkbox>
							</div>
						</el-checkbox-group>
					</div>
				</el-card>
			</template>
			<!-- 导入中 -->
			<div class="exporting-box" v-else-if="loadType == 1">
				<el-progress :text-inside="true" :stroke-width="26" :percentage="progress.percentage"></el-progress>
				<div class="state-text">
					正在批量导出数据，请稍后...
				</div>
			</div>
			<!-- 导入成功 -->
			<div class="succes-box" v-else-if="loadType == 2">
				<el-button size="default" type="primary" @click="downExcelFile"><i class="el-icon-download"></i>下载导出的文件</el-button>
				<div class="title-text">批量导出完成...</div>
			</div>
			<!-- 导入失败 -->
			<div class="fail-box" v-else-if="loadType == 3">
				<div class="icon-box">
					<i class="el-icon-warning"></i>
				</div>
				<div class="fail-tips">
					<div class="title-text">异常提示</div>
					<div class="content" v-html="exportErrorInfo"></div>
				</div>
			</div>
		</div>
		<!-- Dialog 按钮操作区的内容 -->
		<div slot="footer" class="dialog-footer" v-if="loadType == 0 || loadType == 3">
			<el-button v-if="loadType == 3" @click="againExport">重新导出</el-button>
			<el-dropdown split-button type="primary" @click="gotoExcelExport" @command="gotoExcelExport" v-if="loadType == 0">
				确定导出
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="success">成功</el-dropdown-item>
					<el-dropdown-item command="fail">失败</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</el-dialog>
</template>
<script>
export default {
	data() {
		return {
			dialogAttributes: {}, // 当前dialog属性
			formInput: {}, // 当前表单的值
			formInputSlotNameList: [], // form-input组件中的插槽名称列表
			loadType: 0, // 当前加载类型，0：初始化状态，1: 正在导入，2: 导入成功，3：导入失败
			excelExportFileUrl: null, // 导入的excel文件地址URL
			exportErrorInfo: "",
			selectExportFields: [], // 当前选中的导出的字段
			checkAll: true, // 选中所有字段
			indeterminateCheckState: false, // 当前全选checkbox的不确定状态
			progress: {
				timoutId: null,
				times: 0,
				percentage: 0,
				finish: false
			}
		};
	},
	props: {
		// dialog的属性（具体见Elemnet Dialog 对话框文档）
		dialog: {
			type: Object,
			default() {
				return null;
			}
		},
		// 是否显示弹窗
		isShow: {
			type: Boolean,
			default: false
		},
		// 表单字段列表[{name: 表单项名称, label: 选项的标签名称, value: 选项的值, type: 组件的类型,
		// data: 数据（比如：select的选项值列表）, option: 组件的自定义选项(可无), span: 占用的栅格数（布局）
		// rules: 表单的验证方式, slot: 自定义插槽名称（可无，如有值其他选项无效）}]
		fields: {
			type: Array,
			default() {
				return [];
			}
		},
		// 当前可以导出的字段列表[{name: 字段code, lable: 字段名称}]
		exportFields: {
			type: Array,
			default() {
				return [];
			}
		},
		// 表单属性
		form: {
			type: Object,
			deault() {
				return null;
			}
		},
		// excel导入函数，返回excel文件地址
		excelExport: Function,
		// 表单每栏显示数目，不要初始化后又有变化，这里不做监控
		column: {
			type: Number,
			default: 2
		}
	},
	computed: {
		// 判断当前的查询表单、导出的字段2个都没有的情况下就认为是直接导出Excel
		directExport() {
			if (!this.isShow) {
				return false;
			}
			return this.fields.length == 0 && this.exportFields.length == 0 && typeof this.excelExport == "function";
		}
	},
	watch: {
		dialog: {
			handler(val) {
				this.generateDialogAttributes();
			},
			deep: true
		},
		fields: {
			handler(val) {
				this.$nextTick(() => {
					if (this.$refs["form-input"]) {
						this.formInputSlotNameList = this.$refs["form-input"].getSlotNameList();
					}
				});
			},
			deep: true
		},
		isShow(val) {
			if (val) {
				this.$nextTick(() => {
					if (this.$refs["form-input"]) {
						this.formInputSlotNameList = this.$refs["form-input"].getSlotNameList();
					}
				});
				this.loadType = 0;
				this.excelExportFileUrl = null;
				this.exportErrorInfo = "";
			}
		},
		exportFields: {
			handler(val) {
				this.generateSelectExportFields();
			},
			deep: true
		},
		directExport(val) {
			if (val) {
				this.submit();
			}
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.generateDialogAttributes();
			this.generateSelectExportFields();
		},
		// 生成dialog属性配置
		generateDialogAttributes() {
			this.dialogAttributes = site.utils.extend(
				true,
				{
					title: "excel数据导出",
					closeOnClickModal: false
				},
				this.dialog
			);
		},
		// 生成选中导出的字段
		generateSelectExportFields() {
			if (!this.exportFields || this.exportFields.length == 0) {
				this.selectExportFields = [];
				return;
			}
			if (this.checkAll) {
				let selectExportFields = [];
				this.exportFields.forEach(field => {
					selectExportFields.push(field.name);
				});
				this.selectExportFields = selectExportFields;
			}
		},
		close() {
			this.$emit("update:isShow", false);
		},
		formInputChange(formInput, name, value) {
			this.$emit("input-change", formInput, name, value);
		},
		handleCheckAllChange(checked) {
			let selectExportFields = [];
			if (checked) {
				this.exportFields.forEach(field => {
					selectExportFields.push(field.name);
				});
			}
			this.selectExportFields = selectExportFields;
			this.indeterminateCheckState = false;
		},
		handleCheckedFieldsChange(value) {
			this.checkAll = this.exportFields.length === value.length;
			this.indeterminateCheckState = value.length > 0 && value.length < this.exportFields.length;
		},
		gotoExcelExport(command) {
			if (command == "fail") {
				this.loadType = 3;
				this.exportErrorInfo = "导出数据太多，请更改查询条件分段导出!";
			} else {
				this.submit();
			}
		},
		async submit() {
			if (this.loadType == 1) {
				return;
			}
			let formInput = {};
			if (this.fields && this.fields.length > 0) {
				formInput = await this.$refs["form-input"].validate();
			}
			formInput.selectExportFields = this.selectExportFields;
			this.loadType = 1;
			this.importProgress();
			try {
				this.excelExportFileUrl = await this.excelExport(formInput);
				this.loadType = 2;
			} catch (error) {
				this.loadType = 3;
				this.exportErrorInfo = error.message;
			} finally {
				this.progress.finish = true;
			}
		},
		againExport() {
			this.loadType = 0;
			if (this.directExport) {
				this.submit();
			}
		},
		downExcelFile() {
			window.open(this.excelExportFileUrl);
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
.excel-export-dialog {
	.dialog-body {
		min-height: 400px;

		.title-text {
			line-height: 20px;
			padding: 10px 0px;
		}

		.export-table-panel {
			border: 1px solid #e4e4e4;
			max-height: 150px;
			overflow-y: auto;

			.row-header,
			.row-info {
				line-height: 20px;
				padding: 5px 20px;
			}

			.row-header {
				background-color: #f9f9f9;
			}

			.row-info {
				border-top: 1px solid #e4e4e4;
			}
		}

		.fail-box {
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

		.exporting-box {
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

			.title-text {
				padding: 8px 0px;
				line-height: 30px;
			}
		}
	}
}
</style>
