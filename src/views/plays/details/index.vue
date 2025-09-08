<!--
 * @创建者: yujinjin9@126.com
 * @描述: 详情页路由测试
-->
<template>
    <div class="play-details">
        <div class="params-box">
            <el-alert title="说明" description="这里是验证中台框架内部同一个页面但不同参数展示的内容，比如：菜单配置了多个订单详情页的入口" type="info" show-icon />
            <img alt="Vue logo" src="/logo.png" />
            <el-form-item label-width="120" label="页面ID：">
                <el-input v-model="inputForm.parameterId" placeholder="Please input" style="width: 350px" />
            </el-form-item>
            <el-form-item label-width="120" label="输入内容：">
                <el-input v-model="inputForm.content" placeholder="Please input" style="width: 350px" />
            </el-form-item>
            <el-alert
                title="最终结论"
                description="同一个页面路由引用的同一个实例被打开多次，在这几个页面路由切换时是无法缓存每一个地址页面输入的内容，只会缓存最后一次输入的内容,这里最好是通过onBeforeRouteUpdate API 来监控路由更新来实现业务数据的变化"
                type="warning"
                show-icon
            />
            <br />
            <el-button style="margin-top: 24px; width: 100%" type="primary" @click="openNewTabPageHandle">打开另外一个详情页验证一下</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { randomId } from "@yujinjin/utils";
import { pageViewsStore } from "@/stores";

defineOptions({
    name: "play-details"
});

const router = useRouter();

// 当前路由对象
const route = useRoute();

const inputForm = reactive({
    parameterId: route.query.id as string,
    content: ""
});

const pageViews = pageViewsStore();

onBeforeRouteUpdate(to => {
    inputForm.parameterId = to.query.id as string;
});

// 打开新tab页
const openNewTabPageHandle = function () {
    const id = randomId();
    pageViews.openPageByTabPage({ url: "/play/details?id=" + id, fromPageId: pageViews.visitedViews[pageViews.currentVisiteIndex].id, title: "详情路由(" + id + ")" });
    router.push(pageViews.visitedViews[pageViews.currentVisiteIndex].routePath);
};
</script>
<style lang="scss" scoped>
.play-details {
    text-align: center;
    .params-box {
        margin: 0px auto;
        width: 600px;
        text-align: left;

        img {
            margin: 0px auto;
            display: block;
        }
    }
}
</style>
