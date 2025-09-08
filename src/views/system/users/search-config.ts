/*
 * @创建者: yujinjin9@126.com
 * @描述: 用户查询配置
 */
import { type DataTableColumn } from "@yujinjin/cms-components";
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

export default function ({ showDialogHandle, toggleUserLockStatusHandle, resetUserPasswordHandle, deleteHandle }: any) {
    return {
        searchFormProps: {
            fields: [
                {
                    name: "name",
                    type: "input",
                    label: "用户号/姓名"
                },
                {
                    name: "email",
                    type: "input",
                    label: "Email"
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
            query: systemAPI.queryPageUserList,
            columns: [
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
                    label: "Email",
                    prop: "email",
                    minWidth: 150
                },
                {
                    label: "手机号码",
                    prop: "phoneNumber",
                    minWidth: 120
                },
                {
                    label: "状态",
                    prop: "status",
                    minWidth: 100,
                    slot: "dataTable_status"
                },
                {
                    label: "最后登录时间",
                    prop: "lastLoginTime",
                    type: "date",
                    formate: "YYYY-MM-DD HH:mm:ss",
                    minWidth: 150
                },
                {
                    type: "action",
                    width: 180,
                    buttons: [
                        {
                            contents: "编辑",
                            handleCode: HANDLE_CODES.UPDATE,
                            click: showDialogHandle
                        },
                        {
                            contents: "绑定角色",
                            handleCode: HANDLE_CODES.AUTH,
                            click: showDialogHandle
                        },
                        {
                            contents: "锁定",
                            handleCode: HANDLE_CODES.DISABLE,
                            display: row => row.status === "0",
                            click: toggleUserLockStatusHandle
                        },
                        {
                            contents: "解锁",
                            handleCode: HANDLE_CODES.ENABLE,
                            display: row => row.status === "1",
                            click: toggleUserLockStatusHandle
                        },
                        {
                            contents: "重置密码",
                            handleCode: HANDLE_CODES.RESET,
                            click: resetUserPasswordHandle
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
