/*
 * @创建者: yujinjin9@126.com
 * @描述: demo 查询API
 */
import request, { type RequestConfig } from "./request";

export default {
    /**
     * 常用页面 demo 分页查询列表
     */
    queryPageListForCommon(inputData: Record<string, any>, ajaxOptions?: RequestConfig) {
        return request(
            Object.assign(
                {
                    // /api/show/plan/list(模拟资源位的计划列表)
                    url: "/demo/queryPageList",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 获取配置数据
     */
    queryConfigData(ajaxOptions?: RequestConfig) {
        return request(
            Object.assign(
                {
                    // /api/show/rule/configCache.do(模拟资源位的配置数据)
                    url: "/demo/config.do"
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 分页查询订单列表(demo演示页面)
     */
    queryPageOrderList(inputData: Record<string, any>, ajaxOptions?: RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/demo/queryPageOrderList",
                    method: "GET",
                    params: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 新增订单信息
     */
    addOrder(inputData: Record<string, any>, ajaxOptions?: RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/demo/addOrder",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 查询订单详情信息(demo演示页面)
     */
    queryOrderDetails(orderNo: string, ajaxOptions?: RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/demo/queryOrderDetails",
                    method: "GET",
                    params: { orderNo }
                },
                ajaxOptions || {}
            )
        );
    },

    /**
     * 批量修改订单状态(demo演示页面)
     */
    batchUpdateOrderStatus(inputData: Record<string, any>, ajaxOptions?: RequestConfig) {
        return request(
            Object.assign(
                {
                    url: "/demo/batchUpdateOrderStatus",
                    data: inputData
                },
                ajaxOptions || {}
            )
        );
    }
};
