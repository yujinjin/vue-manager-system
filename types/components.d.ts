/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-12-07 14:34:02
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-01-04 10:57:44
 * @项目的路径: \vue-manager-system\types\components.d.ts
 * @描述: 自定义组件声明
 */
import { HandleCodes } from "@/services/enums";
import type { ButtonProps, TableProps, TableColumnCtx, PaginationProps, FormProps, FormItemProps } from "element-plus";
declare namespace Components {
    /** 自定义按钮组件 */
    interface Button {
        /** 按钮文案内容 */
        text: string;

        /** 按钮是否正在加载 */
        isLoading?: boolean;

        /** 是否显示(通过当前固定展示数目来判断是否展示) */
        isShow?: boolean;

        /** 按钮点击函数事件 */
        click?: (button: Components.Button) => Promise<void>;

        /** element-plus里的button属性，具体见element-plus button文档 */
        props?: Partial<ButtonProps>;
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
        click?: (inputFormValue: Record<string, any>, button: Components.Button) => Promise<void>;
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
        events?: Record<string, Function>;

        /** 自定义插槽名称（如有值其他选项无效） */
        slot?: string;
    }

    /** 查询表单字段 */
    interface SearchFormField extends FormField {
        /** 组件的类型 */
        type?: "input" | "select" | "datePicker";
    }

    /** 数据输入表单字段 */
    interface InputFormField extends FormField {
        /** 组件的类型 */
        type?:
            | "input"
            | "select"
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
            | "colorPicker";

        /** 组件所占的列数,默认是24 */
        span?: number;

        /** 表单验证规则 */
        // rules: FormItemRule | FormItemRule[];

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
        slotHeader: string;

        /** 默认插槽 */
        slot: string;
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
        events?: Record<string, Function>;

        /** 表单默认值 */
        value?: Record<string, any>;
    }

    /** 搜索表单实例 */
    interface SearchFormRef {
        formFields: Components.SearchFormField[];

        getSearchFormValue: () => Record<string, any>;
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
        events?: Record<string, Function>;

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

    /** 数据表格实例 */
    interface DataTableRef {
        /** 查询数据函数 */
        queryDataList: (isInit?: boolean) => Promise<any>;

        /** 初始化表格最大高度 */
        initTableMaxHeight: () => Promise<void>;
    }

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
}
