/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-07-31 14:51:06
 * @项目的路径: \vue-manager-system\src\services\logs.ts
 * @描述: 日志输出
 */
import type { App } from "/#/app";
import { LogLevels, BuildEnv } from "@/services/enums";
class Log {
    private level: LogLevels;

    constructor() {
        if (config.buildEnv === BuildEnv.DEVELOPMENT) {
            this.level = LogLevels.DEBUG;
        } else if (config.buildEnv === BuildEnv.TEST) {
            this.level = LogLevels.INFO;
        } else {
            this.level = LogLevels.ERROR;
        }
    }

    print(logLevel: LogLevels, ...contents: any[]) {
        if (!window.console || !window.console.log) {
            return;
        }
        if (logLevel < this.level) {
            return;
        }
        // 避免被代码打包把console的代码删除，同时eslint 配置不要使用console
        window["console"]["log"](...contents);
    }
}
const log = new Log();
export default <App.Logs>{
    debug(...contents: any[]) {
        log.print(LogLevels.DEBUG, "DEBUG: ");
        log.print(LogLevels.DEBUG, ...contents);
    },

    info(...contents: any[]) {
        log.print(LogLevels.INFO, "INFO: ");
        log.print(LogLevels.INFO, ...contents);
    },

    warn(...contents: any[]) {
        log.print(LogLevels.WARN, "WARN: ");
        log.print(LogLevels.WARN, ...contents);
    },

    error(...contents: any[]) {
        log.print(LogLevels.ERROR, "ERROR: ");
        log.print(LogLevels.ERROR, ...contents);
    },

    fatal(...contents: any[]) {
        log.print(LogLevels.FATAL, "FATAL: ");
        log.print(LogLevels.FATAL, ...contents);
    }
};
