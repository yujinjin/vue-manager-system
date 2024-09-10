<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2024-04-24 11:11:38
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-04-26 16:58:00
 * @项目的路径: \vue-manager-system\src\views\plays\form-design\index.vue
 * @描述: PC端动态表单设计器
-->
<template>
    <div class="form-design">
        <div class="widgest-panel">
            <div v-for="item in dataList" :key="item.value">{{ item.name }}</div>
        </div>
        <div class="privew-panel"></div>
        <div class="edit-panel"></div>
    </div>
</template>
<script setup lang="ts">
// import { onMounted, onUnmounted, ref, reactive, watch, computed, nextTick } from "vue";
// import type { Ref, ComputedRef } from "vue";
// import { Router, useRouter } from "vue-router";
// import { storageStore, eventsStore } from "@/stores";

// 全局路由对象
// const router: Router = useRouter();

// vuex
// const storageData = storageStore();

// const props = defineProps({})

// const emits = defineEmits([""])
const dataList = new Array(20).fill(0).map(item => ({ name: "name" + item, value: item }));
</script>
<style lang="scss" scoped>
.tpl {
}
</style>
