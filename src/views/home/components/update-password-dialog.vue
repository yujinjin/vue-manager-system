<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-20 09:52:48
 * @项目的路径: \vue-manager-system\src\views\home\components\update-password-dialog.vue
 * @描述: 修改密码弹窗
-->
<template>
    <el-dialog :model-value="isShow" @update:model-value="value => emits('update:isShow', value)" title="修改登录密码" :close-on-click-modal="false">
        <el-form />
    </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, computed, nextTick } from "vue";
// import type { Ref, ComputedRef } from "vue";
// import { Router, useRouter } from "vue-router";
// import { storageStore, eventsStore } from "@/stores";
// 全局路由对象
// const router: Router = useRouter();
// vuex
// const storageData = storageStore();
defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["update:isShow"]);

const inputForm = reactive({});
</script>
<style lang="less" scoped>
.tpl {
}
</style>
