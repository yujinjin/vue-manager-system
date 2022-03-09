/**
 * 作者：yujinjin9@126.com
 * 时间：2020-12-30
 * 描述：日志输出
 */
import { LogLevels, BuildEnv } from "@/services/enums";
import { App } from "/#/app";
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
        console.log(...contents);
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
