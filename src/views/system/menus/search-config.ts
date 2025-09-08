/*
 * @创建者: yujinjin9@126.com
 * @描述: 菜单查询配置
 */
import { type DataTableColumn, type SearchFormField } from "@yujinjin/cms-components";
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

export default function ({ showDialogHandle, toggleMenuLockStatusHandle, deleteHandle }: any) {
    return {
        searchFormProps: {
            labelWidth: 124,
            isShowCollapse: false,
            fields: [
                {
                    name: "keyword",
                    type: "input",
                    label: "菜单名称/编码/URL"
                },
                {
                    name: "moduleCodes",
                    type: "checkSelect",
                    label: "模块",
                    data: []
                },
                {
                    name: "status",
                    type: "select",
                    label: "状态",
                    data: [
                        {
                            label: "正常",
                            value: "0"
                        },
                        {
                            label: "锁定",
                            value: "1"
                        }
                    ]
                }
            ] as SearchFormField[]
        },
        actionBarProps: {
            buttons: [
                {
                    contents: "新增",
                    handleCode: HANDLE_CODES.CREATE,
                    click: showDialogHandle,
                    props: {
                        type: "primary"
                    }
                },
                {
                    contents: "批量新增",
                    handleCode: HANDLE_CODES.BATCHCREATE,
                    click: showDialogHandle
                }
            ]
        },
        dataTableProps: {
            query: systemAPI.queryPageMenuList,
            columns: [
                {
                    label: "菜单编码",
                    prop: "code",
                    minWidth: 120
                },
                {
                    label: "菜单名称",
                    prop: "name",
                    minWidth: 120
                },
                {
                    label: "所属模块",
                    prop: "moduleCode",
                    minWidth: 120,
                    type: "enum",
                    data: [] as Record<string, any>[]
                },
                {
                    label: "地址",
                    prop: "url",
                    showOverflowTooltip: true,
                    minWidth: 150
                },
                {
                    label: "图标",
                    prop: "icons",
                    minWidth: 100,
                    align: "center",
                    slot: "dataTable_icons"
                },
                {
                    label: "状态",
                    prop: "status",
                    minWidth: 100,
                    slot: "dataTable_status"
                },
                {
                    label: "更新人",
                    prop: "updated",
                    minWidth: 100
                },
                {
                    label: "更新时间",
                    prop: "updateTime",
                    type: "date",
                    formate: "YYYY-MM-DD HH:mm:ss",
                    width: 150
                },
                {
                    type: "action",
                    width: 180,
                    buttons: [
                        {
                            contents: "修改",
                            handleCode: HANDLE_CODES.UPDATE,
                            click: showDialogHandle
                        },
                        {
                            contents: "绑定的角色",
                            handleCode: HANDLE_CODES.SEARCH,
                            click: showDialogHandle
                        },
                        {
                            contents: "锁定",
                            handleCode: HANDLE_CODES.DISABLE,
                            display: row => row.status === "0",
                            click: toggleMenuLockStatusHandle
                        },
                        {
                            contents: "解锁",
                            handleCode: HANDLE_CODES.ENABLE,
                            display: row => row.status === "1",
                            click: toggleMenuLockStatusHandle
                        },
                        {
                            contents: "删除",
                            handleCode: HANDLE_CODES.DELETE,
                            click: deleteHandle
                        }
                    ]
                }
            ] as DataTableColumn<any>[]
        }
    };
}
