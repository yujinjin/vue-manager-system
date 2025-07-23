<template>
    <div class="not-found">
        <div class="error-header"></div>
        <el-row>
            <el-col :span="24">
                <div class="error-body">
                    <el-row>
                        <el-col :offset="2" :span="20">
                            <div class="error-container">
                                <h1>404</h1>
                                <div class="error-divider">
                                    <h2>page not found</h2>
                                    <p class="description">We Couldn’t Find This Page</p>
                                </div>
                                <a href="/">
                                    <el-button type="text">Home</el-button>
                                </a>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="scss" scoped>
.not-found {
    position: absolute;
    top: 0;
    width: 100%;
    background-color: #2dc3e8;
    min-height: 670px;
    height: 100%;
    .error-header {
        background: #fff;
        height: 280px;
        width: 100%;
    }
    .error-body {
        .error-container {
            background: rgba(0, 0, 0, 0.05);
            text-align: center;
            h1 {
                font-size: 110px;
                font-weight: 300;
                margin: -120px 0 0 0;
                text-align: center;
                color: #2dc3e8;
                font-family: "Open Sans", "Segoe UI";
            }
            .error-divider {
                margin-top: -27px;
                padding: 30px 0;
                h2 {
                    font-size: 58px;
                    font-weight: 300;
                    margin: 0;
                    text-transform: uppercase;
                    color: #fff;
                    font-family: "Open Sans", "Segoe UI";
                }
                p {
                    color: #e5e5e5;
                    font-size: 40px;
                    font-weight: 300;
                    margin: 0;
                    line-height: 22px;
                    font-family: "Open Sans", "Segoe UI";
                }
            }
            .el-button {
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 10px 20px;
                margin-top: 100px;
                margin-bottom: 30px;
                border-radius: 5px;
                background-clip: padding-box;
                color: #fff;
                font-size: 16px;
                font-weight: 300;
            }
            .el-button:hover {
                background-color: #fff;
                color: #2dc3e8;
            }
        }
    }
}
</style>
