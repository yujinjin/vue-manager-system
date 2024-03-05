<!--
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-12-14 16:51:57
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-03-01 10:41:55
 * @项目的路径: \vue-manager-system\src\views\others\welcome.vue
 * @描述: 欢迎页面
-->
<template>
    <div class="welcome">
        <img alt="Vue logo" src="@assets/logo.png" />
        <h2>{{ loginUserInfo.userName }}，</h2>
        <h3>{{ civilityText }}，欢迎来到中台管理系统</h3>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import dayjs from "dayjs";
import { storageStore } from "@/stores"; // @ is an alias to /src

export default defineComponent({
    name: "welcome",
    computed: {
        ...mapState(storageStore, ["loginUserInfo"]),
        civilityText() {
            const hour = dayjs().hour();
            if (hour < 6) {
                return "现在是凌晨" + hour + "点了";
            } else if (hour < 10) {
                return "早上好";
            } else if (hour < 14) {
                return "中午好";
            } else if (hour < 18) {
                return "下午好";
            } else if (hour < 22) {
                return "晚上好";
            }
            return "夜深了现在是晚上" + hour + "点";
        }
    }
});
</script>
<style lang="scss" scoped>
.welcome {
    text-align: center;
}
</style>
