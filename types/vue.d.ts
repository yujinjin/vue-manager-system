/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-10-31 17:27:09
 * @项目的路径: \vue-manager-system\types\vue.d.ts
 * @描述: vue 声明
 */
import type { App } from "/#/app";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";

/** 将第三方变量挂载到每一个 vue 示例中 */
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store<App.StoreStateType>;
        $route: RouteLocationNormalizedLoaded;
        $router: Router;
    }

    interface ComponentCustomOptions {
        beforeRouteUpdate: (to: Route, from: Route, next: () => void) => void;
    }
}

/** vue router meta 配置信息 */
declare module "vue-router" {
    interface RouteMeta {
        /** 是否需要登录，没有默认为true */
        requireAuth?: boolean;
    }
}
