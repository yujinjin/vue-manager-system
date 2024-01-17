/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-01-16 14:52:33
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-01-16 17:18:09
 * @项目的路径: \vue-manager-system\src\views\system\messages\search-config.ts
 * @描述: 站内信查询配置
 */
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

export default function ({ showDialogHandle }) {
    return {
        searchFormProps: {
            isShowCollapse: false,
            fields: [
                {
                    name: "keyword",
                    type: "input",
                    label: "站内信标题/内容"
                },
                {
                    name: "module",
                    type: "select",
                    label: "模块",
                    data: []
                }
            ]
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
                }
            ]
        },
        dataTableProps: {
            query: systemAPI.queryPageMessageList,
            columns: [
                {
                    label: "标题",
                    prop: "title",
                    minWidth: 150
                },
                {
                    label: "内容",
                    prop: "content",
                    minWidth: 150,
                    showOverflowTooltip: true
                },
                {
                    label: "所属模块",
                    prop: "moduleCode",
                    minWidth: 100,
                    type: "enum",
                    data: [] as Record<string, any>[]
                },
                {
                    label: "所选角色",
                    prop: "roles",
                    minWidth: 150,
                    type: "enum",
                    data: [] as Record<string, any>[]
                },
                {
                    label: "状态",
                    prop: "status",
                    width: 100,
                    slot: "dataTable_status"
                },
                {
                    label: "预计发送数量",
                    prop: "estimateSendNumber",
                    type: "number",
                    width: 100
                },
                {
                    label: "实际发送数量",
                    prop: "realSendNumber",
                    width: 100
                },
                {
                    label: "更新人",
                    prop: "created",
                    minWidth: 100
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    type: "date",
                    formate: "YYYY-MM-DD HH:mm:ss",
                    minWidth: 150
                }
            ]
        }
    };
}
