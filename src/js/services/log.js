/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-13
 * 描述：站点log日志
 */
export default function () {
	const [levels, level] = [
		{
			DEBUG: 1,
			INFO: 2,
			WARN: 3,
			ERROR: 4,
			FATAL: 5
		},
		() => (site.config && site.config.isDebug ? levels.DEBUG : levels.ERROR)
	];

	let loger = {
		log(logObject, logLevel) {
			if (!window.console || !window.console.log) {
				return;
			}
			if (logLevel != undefined && logLevel < level()) {
				return;
			}
			console.log(logObject);
		},

		debug(logObject) {
			loger.log("DEBUG: ", levels.DEBUG);
			loger.log(logObject, levels.DEBUG);
		},

		info(logObject) {
			loger.log("INFO: ", logObject);
			loger.log(logObject, levels.INFO);
		},

		warn(logObject) {
			loger.log("WARN: ", logObject);
			loger.log(logObject, levels.WARN);
		},

		error(logObject) {
			loger.log("ERROR: ", logObject);
			loger.log(logObject, levels.ERROR);
		},

		fatal(logObject) {
			loger.log("FATAL: ", logObject);
			loger.log(logObject, levels.FATAL);
		}
	};
	return loger;
}
