import type { ComponentPublicInstance, FunctionalComponent } from "vue";
import type { App } from "/#/app";
declare global {

    const config: App.Config;

    const logs: App.Logs;
}

declare module "vue" {
    export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
    import { CompatVue } from "@vue/runtime-dom";
    const Vue: CompatVue;
    export default Vue;
    export * from "@vue/runtime-dom";
}
