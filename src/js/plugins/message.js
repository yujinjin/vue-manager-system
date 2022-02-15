/**
 * 作者：yujinjin9@126.com
 * 时间：2020-08-12
 * 描述：封装全局消息提示
 */
import { Message } from "element-ui";

export default function () {
	site = site || {};
	site.message = Message;
}
