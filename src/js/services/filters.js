/**
 * 作者：yujinjin9@126.com
 * 时间：2017-04-12
 * 描述：自定义过滤器
 */
import utils from "@js/utils/";

export default {
	dateFormat(data, format) {
		if (!data) {
			return "-";
		}
		return utils.dateFormat(data, format);
	},

	currencyFormat(num, digit = 2) {
		if (typeof num != "number" && !num) {
			num = 0;
		}
		if (typeof num === "string") {
			num = parseFloat(num);
		}
		if ((num * 100) % 100 == 0) {
			// 如果金额格式化2位，判断当前的数字是否有2位小数位，如果没有就直接显示整数
			digit = 0;
		} else if ((num * 100) % 10 == 0) {
			// 如果金额格式化2位，判断当前的数字是否有一位小数位，如果没有就直接显示整数
			digit = 1;
		}
		return utils.numberFormat(num, digit);
	},

	changeNumMoneyToChinese(money) {
		return utils.changeNumMoneyToChinese(money);
	},

	timeDifferenceFormat(data) {
		return utils.timeDifferenceFormat(data);
	},

	// 资源图片URL
	imageUrl(url, size, height) {
		return utils.perfectImageUrl(url, size, height);
	},

	// 头像图片URL
	imageAvatarsUrl(url, size, height) {
		return utils.perfectAvatarImageUrl(url, size, height);
	},

	// 本地图片
	localImageUrl(url) {
		return require(`@imgs/${url}`);
	}
};
