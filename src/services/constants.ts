/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 16:36:48
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-22 17:27:21
 * @项目的路径: \vue-manager-system\src\services\constants.ts
 * @描述: 常量集合
 */

// 分页每页记录数
export const PAGE_ITEMS = 50;

// 常用操作CODE列表
export const HANDLE_CODES = {
    CREATE: "CREATE", // 创建
    DELETE: "DELETE", // 删除
    UPDATE: "UPDATE", // 更新
    QUERY: "QUERY", // 查询
    IMPORT: "IMPORT", // 导入
    LOGS: "LOGS", // 日志
    EXPORT: "EXPORT", // 导出
    DOWNLOAD: "DOWNLOAD", // 下载
    RESET: "RESET", // 重置
    ONSHELF: "ONSHELF", // 上线
    OFFSHELF: "OFFSHELF", // 下线
    ENABLE: "ENABLE", // 启用
    DISABLE: "DISABLE", // 禁用
    SEARCH: "SEARCH", // 查看
    CUSTOM: "CUSTOM", // 自定义列
    AUTH: "AUTH", // 授权
    SUBMIT: "SUBMIT", // 提交
    COPY: "COPY", //复制
    PASTE: "PASTE", //粘贴
    PASS: "PASS", //通过
    REFUSE: "REFUSE", //拒绝
    MONITOR: "MONITOR", //监控
    CANCEL: "CANCEL", // 取消
    BATCHCREATE: "BATCHCREATE", // 批量新增
    BATCHCANCEL: "BATCHCANCEL", // 批量取消
    BATCHDELETE: "BATCHDELETE", // 批量删除
    BATCHEXAMINE: "BATCHEXAMINE", //批量审核
    BATCHUPDATE: "BATCHUPDATE", //批量修改
    BATCHSUBMIT: "BATCHSUBMIT", //批量提交
    BATCHRESET: "BATCHRESET", //批量撤回
    BATCHAUTH: "BATCHAUTH" //批量授权
};

// 查询表单中的组件默认属性
export const SEARCH_FORM_FIELD_DEFAULT_ATTRIBUTES = {
    // input 输入框默认配置选项(具体见element Input 输入框文档)
    input: {
        placeholder: "请输入",
        clearable: true
    },
    // Input Number 数字输入框默认配置选项(具体见element plus Input Number 输入框文档)
    inputNumber: {
        placeholder: "请输入",
        controls: false,
        valueOnClear: null
    },
    // select 选择器默认配置选项（具体见element Select 选择器文档）
    select: {
        clearable: true,
        collapseTags: true,
        filterable: true,
        placeholder: "请选择"
    },
    // date-picker 日期时间选择器（具体见element plus date-picker文档）
    datePicker: {
        //year/month/date/dates/datetime/week/datetimerange/daterange/monthrange
        year: {
            type: "year",
            placeholder: "请选择"
        },
        month: {
            type: "month",
            placeholder: "请选择",
            valueFormat: "YYYY-MM"
        },
        date: {
            type: "date",
            placeholder: "请选择",
            valueFormat: "YYYY-MM-DD",
            disabledDate: function (time) {
                return time.getTime() > Date.now();
            }
        },
        dates: {
            type: "dates",
            placeholder: "请选择一个或者多个日期",
            valueFormat: "YYYY-MM-DD"
        },
        datetime: {
            type: "datetime",
            placeholder: "请选择日期和时间",
            valueFormat: "YYYY-MM-DD HH:mm:ss"
        },
        week: {
            type: "week",
            placeholder: "请选择",
            format: "[第]ww[周]"
        },
        datetimerange: {
            type: "datetimerange",
            startPlaceholder: "开始日期时间",
            endPlaceholder: "结束日期时间",
            valueFormat: "YYYY-MM-DD HH:mm:ss",
            rangeSeparator: "-"
        },
        daterange: {
            type: "daterange",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            valueFormat: "YYYY-MM-DD",
            rangeSeparator: " - "
        },
        monthrange: {
            type: "monthrange",
            startPlaceholder: "开始月份",
            endPlaceholder: "结束月份",
            valueFormat: "YYYY-MM",
            rangeSeparator: "-"
        }
    }
};

// 数据输入表单中的组件默认属性
export const INPUT_FORM_FIELD_DEFAULT_ATTRIBUTES = {
    // input 输入框默认配置选项(具体见element plus Input 输入框文档)
    input: {
        placeholder: "请输入",
        clearable: true
    },
    // autocomplete 自动补全输入框默认配置选项(具体见element plus Autodcomplete 输入框文档)
    autocomplete: {
        placeholder: "请输入",
        clearable: true
    },
    // select 选择器默认配置选项（具体见element plus Select 选择器文档）
    select: {
        clearable: true,
        collapseTags: true,
        filterable: true,
        placeholder: "请选择"
    },
    // Cascader 级联选择器默认配置选项（具体见element plus Cascader 选择器文档）
    cascader: {
        clearable: true,
        collapseTags: true,
        filterable: true,
        placeholder: "请选择"
    },
    // Checkbox 多选框默认配置选项（具体见element plus Checkbox 文档）
    checkbox: {},
    // Radio 单选框默认配置选项（具体见element plus Radio文档）
    radio: {},
    // ColorPicker 颜色选择器默认配置选项（具体见element plus ColorPicker 文档）
    colorPicker: {},
    // date-picker 日期时间选择器（具体见element plus date-picker文档）
    datePicker: {
        //year/month/date/dates/datetime/week/datetimerange/daterange/monthrange
        year: {
            type: "year",
            placeholder: "请选择"
        },
        month: {
            type: "month",
            placeholder: "请选择",
            valueFormat: "YYYY-MM"
        },
        date: {
            type: "date",
            placeholder: "请选择",
            valueFormat: "YYYY-MM-DD",
            disabledDate: function (time) {
                return time.getTime() > Date.now();
            }
        },
        dates: {
            type: "dates",
            placeholder: "请选择一个或者多个日期",
            valueFormat: "YYYY-MM-DD"
        },
        datetime: {
            type: "datetime",
            placeholder: "请选择日期和时间",
            valueFormat: "YYYY-MM-DD HH:mm:ss"
        },
        week: {
            type: "week",
            placeholder: "请选择",
            format: "[第]ww[周]"
        },
        datetimerange: {
            type: "datetimerange",
            startPlaceholder: "开始日期时间",
            endPlaceholder: "结束日期时间",
            valueFormat: "YYYY-MM-DD HH:mm:ss",
            rangeSeparator: "-"
        },
        daterange: {
            type: "daterange",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            valueFormat: "YYYY-MM-DD",
            rangeSeparator: " - "
        },
        monthrange: {
            type: "monthrange",
            startPlaceholder: "开始月份",
            endPlaceholder: "结束月份",
            valueFormat: "YYYY-MM",
            rangeSeparator: "-"
        }
    },
    // TimePicker 时间选择器默认配置选项（具体见element plus TimePicker文档）
    timePicker: {
        placeholder: "请选择"
    },
    // TimeSelect 时间选择默认配置选项（具体见element plus TimeSelect文档）
    timeSelect: {
        placeholder: "请选择"
    },
    // Input Number 数字输入框默认配置选项（具体见element plus Input Number文档）
    inputNumber: {
        placeholder: "请输入",
        valueOnClear: null
    },
    // Slider 滑块默认配置选项（具体见element plus Slider文档）
    slider: {},
    // Switch 开关默认配置选项（具体见element plus Switch文档）
    switch: {},
    // 图片上传配置选项
    imgUpload: {},
    // web 富文本框编辑器
    webEditor: {
        style: {
            width: "100%"
        }
    }
};
