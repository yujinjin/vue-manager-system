/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-31
 * 描述：视频播放(引用的是西瓜视频播放组件)
 */
export default function () {
	site = site || {};
	return {
		install(Vue, options) {
			site.player = Vue.prototype.$player = async function (playerOptions) {
				playerOptions = Object.assign({ playsinline: true }, playerOptions, options || {});
				await site.utils.loadScript("https://cdn.jsdelivr.net/npm/xgplayer/browser/index.js", "xgplayer");
				if (/\.m3u8$/.test(playerOptions.url)) {
					await site.utils.loadScript("https://cdn.jsdelivr.net/npm/xgplayer-hls.js/browser/index.js", "xgplayer-hls");
					return new HlsJsPlayer(playerOptions);
				} else {
					return new Player(playerOptions);
				}
			};
		}
	};
}
