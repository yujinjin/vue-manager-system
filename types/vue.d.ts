/*
 * @创建者: yujinjin9@126.com
 * @描述: vue 声明
 */
import { type ComponentPublicInstance, type FunctionalComponent } from "vue";
import { type Router, type RouteLocationNormalizedLoaded } from "vue-router";

/** 将第三方变量挂载到每一个 vue 示例中 */
declare module "vue" {
    export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
    import { type CompatVue } from "vue";
    const Vue: CompatVue;
    export default Vue;
    export * from "vue";
    interface ComponentCustomProperties {
        $store: Store;
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

declare module "*.vue" {
    import { type DefineComponent } from "vue";
    const Component: DefineComponent<object, object, any>;
    export default Component;
}
