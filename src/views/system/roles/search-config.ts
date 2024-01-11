import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

export default function ({ showDialogHandle, toggleRoleLockStatusHandle, deleteHandle }) {
    return {
        searchFormProps: {
            fields: [
                {
                    name: "name",
                    type: "input",
                    label: "角色编码/名称"
                },
                {
                    name: "module",
                    type: "select",
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
            ],
            isShowCollapse: false
        },
        actionBarProps: {
            buttons: [
                {
                    text: "新增",
                    handleCode: HANDLE_CODES.CREATE,
                    click: showDialogHandle,
                    props: {
                        type: "primary"
                    }
                },
                {
                    text: "批量新增",
                    handleCode: HANDLE_CODES.BATCHCREATE,
                    click: showDialogHandle
                }
            ]
        },
        dataTableProps: {
            query: systemAPI.queryPageRoleList,
            columns: [
                {
                    label: "角色编码",
                    prop: "code",
                    minWidth: 120
                },
                {
                    label: "角色名称",
                    prop: "name",
                    minWidth: 120
                },
                {
                    label: "所属模块",
                    prop: "moduleCode",
                    minWidth: 150,
                    type: "enum",
                    data: [] as Record<string, any>[]
                },
                {
                    label: "状态",
                    prop: "status",
                    minWidth: 100,
                    slot: "dataTable_status"
                },
                {
                    type: "action",
                    width: 180,
                    buttons: [
                        {
                            text: "编辑",
                            handleCode: HANDLE_CODES.UPDATE,
                            click: showDialogHandle
                        },
                        {
                            text: "绑定菜单",
                            handleCode: HANDLE_CODES.AUTH,
                            click: showDialogHandle
                        },
                        {
                            text: "锁定",
                            handleCode: HANDLE_CODES.DISABLE,
                            display: row => row.status === "0",
                            click: toggleRoleLockStatusHandle
                        },
                        {
                            text: "解锁",
                            handleCode: HANDLE_CODES.ENABLE,
                            display: row => row.status === "1",
                            click: toggleRoleLockStatusHandle
                        },
                        {
                            text: "删除",
                            handleCode: HANDLE_CODES.DELETE,
                            click: deleteHandle
                        }
                    ]
                }
            ]
        }
    };
}
