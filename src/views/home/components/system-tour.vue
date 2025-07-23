<!--
 * @创建者: yujinjin9@126.com
 * @描述: 进入系统给出引导提示
-->
<template>
    <el-tour v-model="isShow" @close="closeHandle">
        <el-tour-step title="引导提示开始">
            欢迎来到中后台内容管理系统
            <br />
            本系统是vue3 + element-plus + ts + vue-cli5的技术架构，基于element-plus再次封装，为快速搭建企业级中后台内容管理功能并实现统一UI、编码风格的一套前端解决方案。
        </el-tour-step>
        <el-tour-step target=".main > .side-bar" placement="right" title="菜单">当前登录用户的菜单列表，鼠标点击跳转不同的页面</el-tour-step>
        <el-tour-step target=".main > .side-bar > .search-box > .el-select" placement="right" title="查找菜单">
            当菜单比较多的时候可以根据搜索菜单的名字快速匹配出相关菜单列表，点击下拉框就会跳转到对应菜单页面并定位到菜单中的位置
        </el-tour-step>
        <el-tour-step target=".main > .header-bar > .left-inner > .icon-box" placement="bottom" title="菜单最小化">
            鼠标点击可以最小化菜单栏，最小化的菜单栏通过鼠标移动才会自动展示其菜单列表
        </el-tour-step>
        <el-tour-step target=".main > .header-bar > .center-inner > .el-breadcrumb" placement="bottom" title="页面路径">
            显示当前页面的菜单路径，如果当前页面是非菜单页面会显示出它来源菜单页面路径
        </el-tour-step>
        <el-tour-step target=".main > .header-bar > .right-inner > .message-box" placement="bottom" title="消息列表">显示当前未读消息列表，可清空，可查看详情</el-tour-step>
        <el-tour-step target=".main > .header-bar > .right-inner > .icon-box" placement="bottom" title="刷新">刷新当前正在展示的页面内容区域</el-tour-step>
        <el-tour-step target=".main > .header-bar > .right-inner > .login-info-box" placement="bottom" title="登录用户">
            展示当前登录用户的头像和登录名，点击展示下拉菜单可查看我的账户信息、修改登录密码、退出登录操作
        </el-tour-step>
        <el-tour-step target=".main > .page-content > .page-tabs-bar" placement="bottom" title="页面导航">
            展示当前已经打开页面和固定展示页面列表，对于已设置固定的导航页面右上角会有绿点状态标记，可
            <el-tag type="primary">切换</el-tag>
            、
            <el-tag type="primary">关闭</el-tag>
            页面，当页面导航过多时会自动显示左右滑动的图标进行滑动。
            <br />
            <br />
            右键点击导航页面可进行
            <el-tag type="primary">切换</el-tag>
            、
            <el-tag type="primary">取消固定</el-tag>
            、
            <el-tag type="primary">固定展示</el-tag>
            、
            <el-tag type="primary">关闭当前</el-tag>
            、
            <el-tag type="primary">关闭其他</el-tag>
            、
            <el-tag type="primary">全部关闭</el-tag>
            操作。
            <br />
            <br />
            对于
            <el-tag type="primary">固定展示</el-tag>
            操作只能针对通过菜单跳转的页面，而且目前最多只能展示4个。
        </el-tour-step>
        <el-tour-step target=".main > .page-content > .page-view" placement="left" title="页面内容">页面内容区域</el-tour-step>
    </el-tour>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storageStore } from "@/stores";

const storageData = storageStore();

const isShow = ref(false);

const init = function () {
    const systemTourVersionValue = storageData.getSystemTourVersionValue();
    if (!systemTourVersionValue) {
        // 没有展示过系统引导提示
        isShow.value = true;
    } else {
        // 获取到上次展示的版本号，根据实际的业务这次是否展示
        isShow.value = false;
    }
};

const closeHandle = function () {
    storageData.setSystemTourVersionValue("1");
};

onMounted(() => {
    init();
});
</script>
