/*
 * @创建者: yujinjin9@126.com
 * @描述: app数据管理入口文件
 */
import { createPinia } from "pinia";
import eventsStore from "./event";
import dataStore from "./data";
import pageViewsStore from "./page-views";
import storageStore from "./storage";

const store = createPinia();

export default store;

// export function useStore(app) {
//     app.use(store);
// }

export { eventsStore, storageStore, dataStore, pageViewsStore };
