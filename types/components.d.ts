/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-07 14:34:02
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-25 21:14:54
 * @项目的路径: \vue-manager-system\types\components.d.ts
 * @描述: 自定义组件声明
 */
import type { HandleCodes } from "@/services/enums";
import type { ButtonProps, TableProps, TableColumnCtx, PaginationProps, FormProps, FormItemProps, FormItemRule, FormInstance, FormValidateCallback, FormValidationResult } from "element-plus";
import type { Component } from "vue";
import type { NotReadonly } from "./global";
declare namespace Components {
    /** 自定义按钮组件 */
    interface Button {
        /** 按钮文案内容 */
        text: string;

        /** 自定义插槽名称（如有值其他选项无效） */
        slot?: string;

        /** 按钮自定义的图标 */
        icon?: string | Component;

        /** 按钮是否正在加载 */
        isLoading?: boolean;

        /** 是否显示(通过当前固定展示数目来判断是否展示) */
        isShow?: boolean;

        /** 按钮点击函数事件 */
        click?: (button: Components.Button) => Promise<void>;

        /** element-plus里的button属性，具体见element-plus button文档 */
        props?: NotReadonly<Partial<ButtonProps>>;
    }

    /** 数据表格按钮 */
    interface TableButton extends Button {
        /** 当前按钮操作CODE */
        handleCode?: HandleCodes;

        /** 是否显示(根据当前列的数据情况来判断是否展示) */
        display?: (row: any) => boolean;

        /** 按钮点击函数事件 */
        click?: (selectRows: any[], button: Components.TableButton) => Promise<void>;
    }

    /** form表单按钮 */
    interface FormButton extends Button {
        /** 按钮点击函数事件 */
        click?: (inputFormValue: Record<string, any>, formRef: FormInstance | null, button: Components.Button) => Promise<void>;
    }

    /** 表单字段 */
    interface FormField {
        /** 查询项的名称，同时也是组件的双向绑定值属性 */
        name: string;

        /**  选项的标签名称 */
        label?: string;

        /** 选项的值 */
        value?: any;

        /** 组件的类型 */
        type?: string;

        /** label宽度 */
        labelWidth?: number;

        /** 表单组件的宽度 */
        inputWidth?: number;

        /** 数据（比如：select的选项值列表） */
        data?: Array<Record<string, any>>;

        /** data选项值value key属性名，默认是:value(type是select时有意义) */
        optionValueKey?: string;

        /** data选项值label key属性名, 默认值是:label(type是select时有意义) */
        optionLabelKey?: string;

        /** 组件自定义属性 */
        props?: Record<string, any>;

        /** 组件自定义事件 */
        events?: Record<string, (...args: any[]) => any>;

        /** 自定义插槽名称（如有值其他选项无效） */
        slot?: string;
    }

    /** 查询表单字段 */
    interface SearchFormField extends FormField {
        /** 组件的类型 */
        type?: "input" | "inputNumber" | "select" | "checkboxSelect" | "datePicker";
    }

    /** 数据输入表单字段 */
    interface InputFormField extends FormField {
        /** 组件的类型 */
        type?:
            | "input"
            | "textarea"
            | "password"
            | "select"
            | "selectV2"
            | "checkboxSelect"
            | "datePicker"
            | "timePicker"
            | "timeSelect"
            | "label"
            | "inputNumber"
            | "radio"
            | "slider"
            | "switch"
            | "imgUpload"
            | "webEditor"
            | "autocomplete"
            | "cascader"
            | "checkbox"
            | "colorPicker"
            | "upload";

        /** 组件所占的列数,默认是24 */
        span?: number;

        /** 是否显示 */
        isShow?: boolean;

        /** 表单验证规则 */
        rules?: FormItemRule | FormItemRule[];

        /** Form Item 属性 */
        formItemProps?: Partial<NotReadonly<FormItemProps>>;
    }

    /** 数据表格列组件属性 */
    interface TableColumn<T> extends Partial<TableColumnCtx<T>> {
        /** 数据列的自定义类型 */
        type?: "selection" | "index" | "expand" | "number" | "action" | "date" | "enum" | "image";

        /** 操作按钮列表(type是action有用) */
        buttons?: Components.TableButton[];

        /** 数字格式化小数点位数(默认是0, type是number有用) */
        digit?: number;

        /** 日期格式化字符串(默认是YYYY-MM-DD, type是date有用) */
        formate?: string;

        /** 数据枚举列表(type是enum有用) */
        data?: Array<Record<string, any>>;

        /** header 插槽 */
        slotHeader?: string;

        /** 默认插槽 */
        slot?: string;

        /** 是否展示数据列 */
        isShow?: boolean;
    }

    /** 列表操作栏组件属性 */
    interface ActionBar {
        /** 自定按钮列表 */
        buttons?: Components.TableButton[];

        /** 选择的数据列 */
        selectRows?: Array<any>;

        /** 按钮的位置（默认值：right） */
        align?: TextAlignProperty;

        /** 所属的页面名称（用于判断按钮的操作权限、存储的数据情况等） */
        pageName?: string;
    }

    /** 搜索表单组件属性 */
    interface SearchForm {
        /** 自定按钮列表 */
        fields: Components.SearchFormField[];

        /** 是否正在搜索加载 */
        isSearchLoading?: boolean;

        /** 是否显示折叠 */
        isShowCollapse?: boolean;

        /** label宽度 */
        labelWidth?: number;

        /** 表单组件的宽度 */
        inputWidth?: number;

        /** 自定按钮列表 */
        buttons?: Components.TableButton[];

        /** 所属的页面名称（用于判断按钮的操作权限、存储的数据情况等） */
        pageName?: string;
    }

    /** 数据输入表单组件属性 */
    interface InputForm {
        /** 自定按钮列表 */
        fields: InputFormField[];

        /** 当前表单数据是否正在加载中 */
        isLoading?: boolean;

        /** 一行表单数 */
        columns?: number;

        /** form表单属性 */
        props?: Partial<FormProps>;

        /** form表单事件 */
        events?: Record<string, (...args: any[]) => any>;

        /** 表单默认值 */
        value?: Record<string, any>;
    }

    /**  搜索表单组件属性 */
    interface DataTable {
        /** 当前列表查询函数 */
        query: (...args) => Promise<T>;

        /** 数据表格列表 */
        columns: TableColumn<T>[];

        /** 是否自动初始化查询 */
        autoInitQuery?: boolean;

        /** 当前选中的行数据列表 */
        selectRows?: Array<any>;

        /** 当前列表查询滤参数 */
        filters?: Record<string, any>;

        /** table 其他属性具体参照element plus table文档 */
        props?: TableProps;

        /** table 其他事件具体参照element plus table文档 */
        events?: Record<string, (...args: any[]) => any>;

        /** 查询参数数据加工（查询前参数处理函数） */
        queryParametersProcess?: (parameters?: any) => any;

        /** 查询数据结果加工（查询后数据结果处理函数） */
        queryResponseProcess?: (reponseData: any) => any;

        /** 是否显示分页 */
        isShowPagination?: boolean;

        /** 数据分页属性 */
        pagination?: Partial<PaginationProps>;

        /** 所属的页面名称（用于判断按钮的操作权限、存储的数据情况等） */
        pageName?: string;
    }

    /**  搜索页组件属性 */
    interface SearchPage {
        /** 初始化时正在加载(用于dataTable组件初始化是否默认查询，适用场景：筛选项中需要先查询数据后来初始化筛选项值) */
        isLoadingForInit?: boolean;

        /** 搜索表单组件属性 */
        searchFormProps?: SearchForm;

        /** 操作栏组件属性 */
        actionBarProps?: ActionBar;

        /** 数据表格组件属性 */
        dataTableProps?: DataTable;

        /** 所属的页面名称（用于判断按钮的操作权限、存储的数据情况等） */
        pageName?: string;
    }

    /** 搜索表单实例 */
    interface SearchFormRef {
        getValue: () => Record<string, any>;

        /** 获取表单的value */
        changeFormFields: (callback: (formFields: Components.SearchFormField[]) => void) => void;
    }

    /** 数据表格实例 */
    interface DataTableRef {
        /** 查询数据函数 */
        queryDataList: (isInit?: boolean) => Promise<any>;

        /** 初始化表格最大高度 */
        initTableMaxHeight: () => Promise<void>;

        /**
         * 更新数据列显示状态
         * @param columnKeys 显示列key值数组（不传值表示都展示）
         */
        updateTableColumnsShowStatus: (columnKeys?: string[]) => void;
    }

    /** 列表操作栏实例 */
    interface ActionBarRef {
        /** 修改当前生成的button按钮值 */
        changeButtons: (callback: (actionButtons: Components.TableButton[]) => void) => void;
    }

    /** 数据输入表单实例 */
    interface InputFormRef {
        /** 获取表单的value */
        getInputValue: () => Record<string, any> | null;

        /** 设置表单的属性值 */
        setInputPropertyValue: (propertyName: string, value: any) => void;

        /** 获取表单的value */
        changeFormFields: (callback: (formFields: Components.InputFormField[]) => void) => void;

        // 获取form Ref
        getFormRef: () => FormInstance;

        // 表单验证
        validate: (callback?: FormValidateCallback) => FormValidationResult;
    }

    /** form 弹窗组件实例 */
    interface DialogFormRef {
        // 获取表单的value
        getInputValue: () => Record<string, any>;

        /** 设置表单的属性值 */
        setInputPropertyValue: (propertyName: string, value: any) => void;

        // 修改当前form字段的属性
        changeFormFields: (callback: (formFields: Components.InputFormField[]) => void) => void;

        // 修改当前生成的button按钮值
        changeButtons: (callback: (actionButtons: Components.FormButton[]) => void) => void;

        // 获取form Ref
        getFormRef: () => FormInstance;

        // 表单验证
        validate: (callback?: FormValidateCallback) => FormValidationResult;
    }

    /** 搜索页实例 */
    interface SearchPageRef {
        // 搜索查询函数
        query: (isInit?: boolean) => Promise<any> | undefined;

        // 获取当前搜索表单实时值
        getSearchingValue: () => Record<string, any>;

        // 获取当前已经搜索出来的结果值，与getSearchFormValue区别是当前已经用它查询出来结果的搜索表单值
        getSearchedValue: () => Record<string, any>;

        // 修改当前form字段的属性
        changeFormFields: (callback: (formFields: Components.InputFormField[]) => void) => void;

        // 修改当前生成的button按钮值
        changeButtons: (callback: (actionButtons: Components.TableButton[]) => void) => void;

        /**
         * 更新数据列显示状态
         * @param columnKeys 显示列key值数组（不传值表示都展示）
         */
        updateTableColumnsShowStatus: (columnKeys?: string[]) => void;
    }
}
