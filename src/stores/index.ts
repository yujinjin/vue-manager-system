/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-05 17:23:19
 * @项目的路径: \vue-manager-system\src\store\index.ts
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
