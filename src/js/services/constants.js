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
			placeholder: "请选择",
			optionValueKey: "key",
			optionLabelKey: "name"
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
		title: "提示",
		closeOnClickModal: false,
		customClass: "form-dialog"
	},
	// 操作栏中的按钮默认属性
	ACTION_BAR_BUTTON_DEFAULT_ATTRIBUTES: {
		size: "small"
	},
	// 表单默认属性
	FORM_DEFAULT_ATTRIBUTES: {
		labelWidth: "200px",
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
			placeholder: "请选择",
			optionValueKey: "key",
			optionLabelKey: "name"
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
			size: "small",
			optionValueKey: "key",
			optionLabelKey: "name"
		}, // Checkbox 多选框（具体见Checkbox 多选框文档）
		radio: {
			size: "small",
			optionValueKey: "key",
			optionLabelKey: "name"
		}, // Radio 单选框（具体见Radio 单选框文档）
		image: {
			lazy: true
		}, // Image 图片（具体见Image 图片文档）
		imgUpload: {}, // 项目基于element 的upload再次封装的图片上传组件
		videoUpload: {}, // 视频上传组件
		rate: {}, // Rate 评分（具体见Rate 评分文档）
		colorPicker: {
			size: "small"
		}, // ColorPicker 颜色选择器（具体见ColorPicker 颜色选择器文档）
		htmlEditor: {
			placeholder: "请编辑"
		} // html富文本框编辑器，TODO：该插件待实现
	},
	// 默认数据查询列表配置
	QUERY_TABLE_DEFAULT_ATTRIBUTES: {
		border: true,
		size: "small",
		rowKey: "id"
	},
	// 默认数据查询列表配置
	QUERY_TABLE_DEFAULT_PARAMETERS: {
		filter: "", //默认关键词搜索名称
		maxResultCount: 20, //最大结果集（等同每页记录数）
		skipCount: 0,
		sorting: "creationTime desc" //默认按时间降序排序
	},
	// 枚举（是否，激活|冻结，上下架、成功|失败、启用|禁用）
	ENUM: {
		// 性别
		SEX: [
			{ name: "男", key: 1 },
			{ name: "女", key: 2 }
		],
		YES_NO: [
			{ name: "是", key: true },
			{ name: "否", key: false }
		],
		ACTIVE_FROZEN: [
			{ name: "激活", key: true },
			{ name: "冻结", key: false }
		],
		ONLINE_OFFLINE: [
			{ name: "上架", key: true },
			{ name: "下架", key: false }
		],
		SUCCESS_FAIL: [
			{ name: "成功", key: true },
			{ name: "失败", key: false }
		],
		ENABLE_DISABLE: [
			{ name: "启用", key: true },
			{ name: "禁用", key: false }
		],
		PASS_REFUSE: [
			{ name: "通过", key: true },
			{ name: "拒绝", key: false }
		]
	}
};
