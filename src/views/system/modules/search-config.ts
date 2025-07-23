/*
 * @创建者: yujinjin9@126.com
 * @描述: 模块搜索配置
 */
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

export default function ({ showDialogHandle, deleteHandle }: any) {
    return {
        searchFormProps: {
            isShowCollapse: false,
            fields: [
                {
                    name: "moduleName",
                    type: "input",
                    label: "模块名称"
                }
            ]
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
                }
            ]
        },
        dataTableProps: {
            query: systemAPI.queryPageModuleList,
            columns: [
                {
                    label: "模块名称",
                    prop: "name",
                    minWidth: 150
                },
                {
                    label: "模块编号",
                    prop: "code",
                    minWidth: 150
                },
                {
                    label: "更新人",
                    prop: "updated",
                    minWidth: 150
                },
                {
                    label: "更新时间",
                    prop: "updateTime",
                    type: "date",
                    formate: "YYYY-MM-DD HH:mm:ss",
                    minWidth: 150
                },
                {
                    type: "action",
                    width: 100,
                    buttons: [
                        {
                            contents: "修改",
                            handleCode: HANDLE_CODES.UPDATE,
                            click: showDialogHandle
                        },
                        {
                            contents: "删除",
                            handleCode: HANDLE_CODES.DELETE,
                            click: deleteHandle
                        }
                    ]
                }
            ]
        }
    };
}
