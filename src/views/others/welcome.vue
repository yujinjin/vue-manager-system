<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-14 16:51:57
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-12-14 17:11:19
 * @项目的路径: \vue-manager-system\src\views\others\welcome.vue
 * @描述: 欢迎页面
-->
<template>
    <div class="welcome">
        <img alt="Vue logo" src="@assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@views/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
    name: "welcome",
    components: {
        HelloWorld
    }
});
</script>
<style lang="scss" scoped>
.welcome {
    text-align: center;
}
</style>
