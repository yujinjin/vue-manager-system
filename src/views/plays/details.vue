<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-14 15:28:35
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-14 15:41:27
 * @项目的路径: \vue-manager-system\src\views\plays\details.vue
 * @描述: 详情页路由测试
-->
<template>
    <div class="paly-details">
        <h1>详情页路由测试</h1>
        <p>
            页面参数：
            <br />
            {{ route.query }}
            <br />
            {{ route.params }}
        </p>
        <el-input v-model="input" placeholder="Please input" style="width: 350px" />
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

defineOptions({
    name: "play-details"
});

// 当前路由对象
const route = useRoute();

const input = ref("");
</script>
<style lang="scss" scoped>
.play-details {
}
</style>
