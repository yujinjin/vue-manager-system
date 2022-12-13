/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-07 14:53:57
 * @项目的路径: \vue-manager-system\src\services\enums.ts
 * @描述: 项目枚举类
 */

/** 当前项目编译环境 */
export enum BuildEnv {
    // 开发模式
    DEVELOPMENT = "development",

    // 生产模式
    PRODUCTION = "production",

    // 测试模式
    TEST = "test"
}

/** 日志级别 */
export enum LogLevels {
    DEBUG = 0,

    INFO = 1,

    WARN = 2,

    ERROR = 3,

    FATAL = 4
}

export enum HandleCodes {
    // 创建
    CREATE = "CREATE",

    // 删除
    DELETE = "DELETE",

    // 更新
    UPDATE = "UPDATE",

    // 查询
    QUERY = "QUERY",

    // 导入
    IMPORT = "IMPORT",

    // 日志
    LOGS = "LOGS",

    // 转换名称
    CONVERTNAME = "CONVERTNAME",

    // 导出
    EXPORT = "EXPORT",

    // 非组件封装导出
    SELFEXPORT = "SELFEXPORT",

    // 下载
    DOWNLOAD = "DOWNLOAD",

    // 重置
    RESET = "RESET",

    // 上线
    ONSHELF = "ONSHELF",

    // 下线
    OFFSHELF = "OFFSHELF",

    // 查看
    SEARCH = "SEARCH",

    // 查看审核详情
    SEARCHEXAMINE = "SEARCHEXAMINE",

    // 自定义列
    CUSTOM = "CUSTOM",

    // 授权
    AUTH = "AUTH",

    // 提交
    SUBMIT = "SUBMIT",

    //补充素材
    SUPPLEMENT = "SUPPLEMENT",

    //关联计划
    RELATED = "RELATED",

    //复制
    COPY = "COPY",

    //通过
    PASS = "PASS",

    //拒绝
    REFUSE = "REFUSE",

    //监控
    MONITOR = "MONITOR",

    // 批量删除
    BATCHDELETE = "BATCHDELETE",

    //批量审核
    BATCHEXAMINE = "BATCHEXAMINE",

    //批量修改
    BATCHUPDATE = "BATCHUPDATE",

    //批量提交
    BATCHSUBMIT = "BATCHSUBMIT",

    //批量撤回
    BATCHRESET = "BATCHRESET",

    //批量授权
    BATCHAUTH = "BATCHAUTH",

    //权限管理
    PERMISSION = "PERMISSION"
}
