/*
 * @创建者: yujinjin9@126.com
 * @描述: 项目枚举类
 */

/** 当前项目编译环境 */
export enum BuildEnv {
    // 开发模式
    DEVELOPMENT = "development",

    // 生产模式
    PRODUCTION = "production"
}

/** 日志级别 */
export enum LogLevels {
    DEBUG = 0,

    INFO = 1,

    WARN = 2,

    ERROR = 3,

    FATAL = 4
}
