/*
 * @创建者: yujinjin9@126.com
 * @描述: 自定义指令
 */
import { type Directive, type DirectiveBinding } from "vue";
import { storeToRefs } from "pinia";
import { dataStore } from "@/stores";

export default <Record<string, Directive>>{
    // 用户操作权限指令
    permission: function (el: HTMLElement, binding: DirectiveBinding) {
        if (!binding.value) {
            return;
        }
        const { pageName, value } = binding.value as { pageName: string; value: string };
        if (!value) {
            return;
        }
        const store = dataStore();
        const { buttonPermissions } = storeToRefs(store);
        el.style.display = buttonPermissions.value[pageName]?.includes(value) ? "" : "none";
    }
};
