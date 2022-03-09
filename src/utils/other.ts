/**
 * 作者：yujinjin9@126.com
 * 时间：2022-01-14
 * 站点其他常用工具类方法
 */

/**
 * @param url JS文件的路径
 * @param id 当前加载js文件标签的ID，防止同一个文件重复加载
 * @param callback JS文件加载成功或失败后的回调函数
 * 描述：页面动态加载JS文件，如果超过10S文件还未加载表示超时
 */
export function loadScript(url: string, id: string): Promise<boolean> {
    return new Promise(resolve => {
        //如果URL不存在或者该ID已经加载过了
        if (document.getElementById(id)) {
            resolve(true);
            return;
        }
        const script: HTMLScriptElement = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        //默认10S超时就立即执行回调函数
        let timer: number | null = window.setTimeout(function () {
            timer = null;
            resolve(false);
        }, 10000);
        script.onload = function () {
            if (timer) {
                clearTimeout(timer);
                resolve(true);
            }
        };
        script.src = url;
        document.body.appendChild(script);
    });
}
