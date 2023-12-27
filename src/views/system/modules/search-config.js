/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-27 11:41:13
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-27 15:34:17
 * @项目的路径: \vue-manager-system\src\views\system\modules\search-config.js
 * @描述: 模块搜索配置
 */
import systemAPI from "@api/system";
import { HANDLE_CODES } from "@/services/constants";

export default function ({ showDialogHandle }) {
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
            query: systemAPI.queryModuleList,
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
                    minWidth: 150
                },
                {
                    type: "action",
                    width: 100,
                    buttons: [
                        {
                            text: "修改",
                            handleCode: HANDLE_CODES.SEARCH,
                            click: showDialogHandle
                        }
                    ]
                }
            ],
            queryResponseProcess: function ({ rows, total }) {
                return { items: rows, totalCount: total };
            }
        }
    };
}
