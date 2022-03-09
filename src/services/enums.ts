/**
 * 作者：yujinjin9@126.com
 * 时间：2022-12-29
 * 描述：项目枚举类
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
