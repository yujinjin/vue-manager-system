/**
 * 作者：yujinjin9@126.com
 * 时间：2018-09-13
 * 描述：常量集合
 */
export default {
	// 每页记录数
	PAGE_ITEMS: 20,
	// 本地存储的数据列表栏状态最多数量
	MAX_NUMBER_TABLE_OLUMN_STATE: 50,
	// 查询表单中的组件默认属性
	SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES: {
		input: {
			size: "small",
			placeholder: "请输入"
		}, // input 输入框默认配置选项(具体见element Input 输入框文档)
		select: {
			clearable: true,
			size: "small",
			placeholder: "请选择"
		}, // select 选择器默认配置选项（具体见element Select 选择器文档）
		timeSelect: {
			clearable: true,
			size: "small",
			placeholder: "请选择"
		}, // TimePicker 时间选择器默认配置（具体见TimePicker 时间选择器文档）
		datePicker: {
			clearable: true,
			size: "small",
			placeholder: "请选择",
			type: "date"
		}, // DatePicker 日期选择器默认配置（具体见DatePicker 日期选择器文档）
		dateTimePicker: {
			clearable: true,
			size: "small",
			placeholder: "请选择",
			type: "datetime"
		} // DateTimePicker 日期时间选择器（具体见DateTimePicker 日期时间文档）
	},
	// 当前表单弹窗中的dialog 默认属性
	FORM_DIALOG_DEFAULT_ATTRIBUTES: {
		title: "提示"
	},
	// 操作栏中的按钮默认属性
	ACTION_BAR_BUTTON_DEFAULT_ATTRIBUTES: {
		size: "small"
	},
	// 表单默认属性
	FORM_DEFAULT_ATTRIBUTES: {
		model: "formInput",
		labelWidth: "80px",
		size: "small",
		ref: "formInput"
	},
	// 表单中常用的类型默认属性
	FORM_FIELD_DEFAULT_ATTRIBUTES: {
		label: {}, // 文案显示
		input: {
			size: "small",
			placeholder: "请输入"
		}, // input 输入框默认配置选项(具体见element Input 输入框文档)
		select: {
			clearable: true,
			size: "small",
			placeholder: "请选择"
		}, // select 选择器默认配置选项（具体见element Select 选择器文档）
		timeSelect: {
			clearable: true,
			size: "small",
			placeholder: "请选择"
		}, // TimePicker 时间选择器默认配置（具体见TimePicker 时间选择器文档）
		datePicker: {
			clearable: true,
			size: "small",
			placeholder: "请选择",
			type: "date"
		}, // DatePicker 日期选择器默认配置（具体见DatePicker 日期选择器文档）
		dateTimePicker: {
			clearable: true,
			size: "small",
			placeholder: "请选择",
			type: "datetime"
		}, // DateTimePicker 日期时间选择器（具体见DateTimePicker 日期时间文档）
		inputNumber: {
			size: "small",
			placeholder: "请输入"
		}, // InputNumber 计数器（具体见InputNumber 计数器文档）
		switch: {}, // switch 开关（具体见Switch 开关文档）
		checkbox: {
			size: "small"
		}, // Checkbox 多选框（具体见Checkbox 多选框文档）
		radio: {
			size: "small"
		}, // Radio 单选框（具体见Radio 单选框文档）
		image: {
			lazy: true
		}, // Image 图片（具体见Image 图片文档）
		imgUpload: {}, // 项目基于element 的upload再次封装的图片上传组件
		rate: {}, // Rate 评分（具体见Rate 评分文档）
		colorPicker: {
			size: "small"
		}, // ColorPicker 颜色选择器（具体见ColorPicker 颜色选择器文档）
		htmlEditor: {} // html富文本框编辑器，TODO：该插件待实现
	}
};
