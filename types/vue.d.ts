import { App } from "/#/app";
import { Router, RouteLocationNormalizedLoaded } from "vue-router";

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
