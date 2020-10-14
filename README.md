## [vue-manager-system](https://github.com/yujinjin/vue-manager-system)(后台管理系统)

## 目录

- [目录](#目录)
- [介绍](#介绍)
- [快速开始](#快速开始)
- [组件的API文档](#组件的api文档)
- [项目所用到的第三方组件列表](#项目所用到的第三方组件列表)
- [项目UI及页面示例](#项目ui及页面示例)
    - [1.登录界面](#1登录界面)
    - [2.主界面布局](#2主界面布局)
    - [3.简单查询页面示例](#3简单查询页面示例)
    - [4.复杂查询页面示例](#4复杂查询页面示例)
    - [5.普通页面表单示例](#5普通页面表单示例)
    - [6.复杂表单](#6复杂表单)
- [独立组件示例](#独立组件示例)
    - [1. 图片上传（img-upload）](#1-图片上传img-upload)
    - [2. 视频上传（video-upload）](#2-视频上传video-upload)
    - [3. 视频播放（web-player）](#3-视频播放web-player)
    - [4. 富文本框（web-editor）](#4-富文本框web-editor)
    - [5. 数据列表栏显示隐藏状态的切换（toggle-table-column）](#5-数据列表栏显示隐藏状态的切换toggle-table-column)
    - [6. 数据列表的操作列（table-column-action）](#6-数据列表的操作列table-column-action)
    - [7. 数据列表的枚举列（table-column-enum）](#7-数据列表的枚举列table-column-enum)
    - [8. 数据列表的图片列（table-column-img）](#8-数据列表的图片列table-column-img)
    - [9. 数据列表的链接列（table-column-link）](#9-数据列表的链接列table-column-link)
    - [10. 数据列表的标签列（table-column-tags）](#10-数据列表的标签列table-column-tags)
    - [11. 数据列表的二维码预览（table-column-qrcode）](#11-数据列表的二维码预览table-column-qrcode)
- [页面级组件示例](#页面级组件示例)
    - [1. 查询表单（search-form）](#1-查询表单search-form)
    - [2. 操作栏（action-bar）](#2-操作栏action-bar)
    - [3. 数据列表（table-data)](#3-数据列表table-data)
    - [4. form表单（form-input)](#4-form表单form-input)
    - [5. 信息表单（view-info)](#5-信息表单view-info)
    - [6. 弹窗表单（dialog-form)](#6-弹窗表单dialog-form)
    - [7. 页面表单（page-form)](#7-页面表单page-form)
    - [8.excel导入（excel-import-dialog）](#8excel导入excel-import-dialog)
    - [9.excel导出（excel-export-dialog）](#9excel导出excel-export-dialog)
- [项目框架的目录规范说明](#项目框架的目录规范说明)
- [最后](#最后)

## 介绍
> 这是一个使用vue-cli作为脚手架，基于vue、elementUI搭建的一套后台管理系统。
> 
> 与其他后台管理系统不一样的地方就在于这套系统的开发主要给后端开发人员来做（针对于小公司节省开发资源，尽量快的上手），曾经作为后端开发的我来做前端开发的角度来说，最痛苦的就是写CSS、UI。
> 
> 所以本项目框架把一些组件做了组合再次封装，其原则就是尽量少写些UI层面的代码，多用JS配置的方式来实现业务开发。

## 快速开始
- [在线demo](https://yujinjin.github.io/vue-manager-system/)
- 克隆仓库： `git clone https://github.com/yujinjin/vue-manager-system`
- 使用npm安装： `npm install`
- 使用npm运行： `npm run R_UAT`
- 使用npm打包： `npm run B_UAT`

## 组件的API文档
正在编撰，敬请期待...

## 项目所用到的第三方组件列表
- vue
- vue-router
- vuex
- axios
- element-ui
- jquery(v1.12.4,部分插件需要依赖于jquery)
- toastr(由于element-ui中的Message组件同时调用多次显示有问题，所以采用了它，[官方文档](https://github.com/CodeSeven/toastr))
- cropperjs(图片裁剪，[官方文档](https://github.com/fengyuanchen/cropperjs))
- echarts(百度echarts，[官方文档](https://echarts.apache.org/zh/index.html))
- aliyun-oss-sdk(阿里云OSS SDK)
- aliyun-upload-sdk(阿里云OSS 上传)
- summernote(一个不依赖于boostrap的富文本框组件，发现部分功能有BUG，所以把源代码做了修复改动。因此如果使用该插件就不能再升级版本了)
- qrcode(二维码)

## 项目UI及页面示例
#### 1.登录界面
> 用户名密码登录

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/D7ABD0716EA347D7B1FEC79B15A28D84/21970)

> 验证码登录

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/438F80E4923C486097354390C26A382D/22104)

> 扫码登录

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/29E976769C97493C9A8208B6DAC4AABD/21972)

#### 2.主界面布局
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/2FD471648BE74372B3BC707B29C23EAF/21974)

```
说明：主界面的整体布局是上（如上图1标示）、下左（如上图2标示）、下右布局（如上图3标示）。
其1固定是logo、打开的页面tabbar、当前登录用户信息；
其2固定放置菜单，菜单可分三级；
其3是页面的操作信息。
```

#### 3.简单查询页面示例
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/035F3B54AEE14273B6D0174AD29BBF68/21976)

#### 4.复杂查询页面示例
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/22F39D16CEA142F08D6981A089ADDB01/21978)

```
其1查询的选项超过一行，会自动隐藏
其2操作按钮超过一行，会自动隐藏
其3数据列表项太多，可以手动隐藏
```

#### 5.普通页面表单示例
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/0B3AD713045147098A4F3B1BA58C7D67/21980)

```
默认会一行显示3列字段
```

#### 6.复杂表单
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/FF9A248FE3924764821AFC665B180963/21982)

```
分组的方式展示表单信息
```

## 独立组件示例
#### 1. 图片上传（img-upload）
> 表单字段展示

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/8FC8645C62CF47D9917FF64050ABC3BE/21984)

> 图片裁剪

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/017D8303124B4A0E95CDAC1E9CC931DB/21986)

```
说明：在elemenet UI中的Upload的基础上进行了扩展，主要是支持图片的裁剪功能，以及针对于图片的上传做了公用的配置，使其业务开发代码更少。
```

#### 2. 视频上传（video-upload）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/2AA83C4577D641FF9266A9C1382A46CD/21988)
```
说明：使用elemenet Upload的UI，通过阿里云SDK来上传视频。这里针对于视频上传做了公用的配置和封装，使其业务开发代码更少。
```

#### 3. 视频播放（web-player）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/A6114CACAF6F4665A67FB063456B5C7B/21991)

```
说明：弹窗的方式去播放视频，这里是使用了第三方西瓜视频的插件。
```

#### 4. 富文本框（web-editor）

> 常用tool

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/C3360DA26013482A9683E5D3C72F9C7A/22263)

> 插入视频链接

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/8C20BD1326024F0B8EEE070F1301BDA5/22265)

> 上传视频

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/10BE13EE7C274E0AA6557366B729233E/22272)

```
说明：基于第三方插件summernote的扩展，去除了基于boostrap的依赖的样式及JS，在使用的时候发现部分功能有BUG，所以把源代码做了修复改动。因此如果使用该插件就不能再升级版本了，同时根据常用的业务做了自定义视频按钮插入扩展。
```

#### 5. 数据列表栏显示隐藏状态的切换（toggle-table-column）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/73C2D13FEB3E4F7C80D0A0E4B3A19D48/21995)
```
说明：手动隐藏不需要展示的列，框架支持自动保存当前数据列的显示或隐藏状态，以便下次进入展示。
```

#### 6. 数据列表的操作列（table-column-action）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/61C872E344DD489E8E9C86DFD65943C2/22001)

```
说明：默认只显示4个操作按钮，当超过4个时会自动隐藏。
```

#### 7. 数据列表的枚举列（table-column-enum）

> 枚举列

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/B76C80C6D0F04FC184643197FCB22259/22019)

> 点击修改操作

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/92983C2CBAF546988608A9DAB69E9115/22005)

```
说明：针对对于列数据是一个枚举值，比如：订单状态、性别、启用\禁用状态等，同时也支持修改当前列的枚举值，如果当前的枚举值只有2个默认直接修改。
```

#### 8. 数据列表的图片列（table-column-img）

> 图片列

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/800FE76DB65843D5BC161852058FAF36/22021)

> 点击图片预览

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/89BE78B733EC481AAFE48395C886B7BD/22014)

```
说明：图片列数据展示，支持点击预览。
```

#### 9. 数据列表的链接列（table-column-link）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/B71AF66386634ED6864D546B1CCCC8CA/22045)

```
说明：当前列数据带有链接，点击直接跳转。
```

#### 10. 数据列表的标签列（table-column-tags）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/711DE1EFD54F400485B8095A1F13F47B/22024)

```
说明：数据列表的标签列
```

#### 11. 数据列表的二维码预览（table-column-qrcode）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/AD9F09F04B15479FACB1DF67F9C36F31/22135)

```
说明：当前列数据点击展示一个二维码。
```

## 页面级组件示例

#### 1. 查询表单（search-form）

> 查询项较少时
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/F213AE81521D4D868F3591ED34693A6E/21999)

> 查询项较多时，超过一行。（默认隐藏状态）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/0D8A63ABB52945C49E0B7E82DD6DD30A/22029)

> 查询项较多时，超过一行。（点击展开状态）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/BAB603BA9BDA4E9F9AFA14D59A2D6B33/22031)

```
说明：查询表单组件，默认表单中的值有变化时会自动查询，每行显示4个查询项，多于4个会自动隐藏。
```

#### 2. 操作栏（action-bar）

> 操作按钮较少时

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/8031EC0EC64D48C2ADC0EA55BBFC4DF6/22033)

> 操作按钮较多时，超过一行。（默认隐藏状态）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/7B129F761FC4424F826E65F8FD6BE0EE/22035)

> 操作按钮较多时，超过一行。（点击展开状态）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/40FA99E37CA949A1AE6394AED0EDBDEC/22037)

```
说明：操作栏较多，组件计算当前的按钮超过一行时，会自动隐藏剩下的按钮。
```

#### 3. 数据列表（table-data)

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/A4B441775E6642DCB27C1AD92BBEE57E/22147)

```
说明：当前数据列表封装分页组件、数据列组件等
```

#### 4. form表单（form-input)

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/B2F953812BEA48F1BCD41B4DC7F10B58/22051)

```
说明：封装的表单组件。
```

#### 5. 信息表单（view-info)

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/06E5ED3BCD4341AABB9C77F81821F310/22049)

```
说明：显示当前表单的信息
```

#### 6. 弹窗表单（dialog-form)

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/7F172F6CABEC49109A7ADA057B24ACC6/22047)

```
说明：以弹窗形式封装的表单，默认一行显示2个表单字段。本组件是在form表单组件的基础上做的封装。
```

#### 7. 页面表单（page-form)

> 简单表单

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/B2F953812BEA48F1BCD41B4DC7F10B58/22051)

> 分组表单

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/D5662DC6009143ACB80261A0F569D1F8/22053)

```
说明：以页面形式封装的表单，默认一行显示3个表单字段。本组件是在form表单组件的基础上做的封装。
```

#### 8.excel导入（excel-import-dialog）

> excel文件选择

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/C1D013B41FD64341821253CD650DAAE2/22057)

> 数据导入解析成功
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/DAECB846228A43B39D402DBF584E5950/22060)

> 数据导入解析失败

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/65E4D3C270F1464387A403630BE803A4/22062)

> 数据导入解析中

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/BFA2337D8D0C4404AC5B93B32F92B7A2/22064)

> 数据导入解析成功提示
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/BD9ADD4ECB4C49F7A1A2265E85E085AF/22066)

```
说明：excel导入功能的封装
```

#### 9.excel导出（excel-export-dialog）

> 导出筛选条件及字段选择（2者可任选或都不选）

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/B39D406120E048B291701C9E54A85079/22303)

> 数据导出生成中

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/ACAF35C1FC4F42E39F66191BF2ED8DE5/22305)

> 数据导出生成成功，提示下载Excel
![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/419A30ADB62E452DB611C42CD333D748/22307)

> 数据导出失败提示

![image](http://note.youdao.com/yws/public/resource/98e1d331e4f783143e752a0e985a4aaa/xmlnote/E1D94BF1464148598D93BAFE97C06F2C/22309)

```
说明：excel导出功能的封装，可做条件筛选条件、导出的字段选择，2者可任选，如果都没有就直接导出。
```

## 项目框架的目录规范说明
```
|-- dist                                // webapck打包压缩后的文件目录
|-- tests                               // vue-cli测试环境目录
|-- src                                 // 源码目录
|   |-- imgs                            // 存放各种图片文件目录
|       |-- test                        // 存放开发测试的图片文件目录
|           |-- ...                     // 其他测试图片文件
|       |-- fonts                       // 页面引用的字体文件
|       |-- static                      // 静态图片，该目录下图片不会被压缩
|       |-- ...                         // 其他图片等
|   |-- js                              // 存放js文件目录
|       |-- api                         // 后端接口API目录
|           |-- index.js                // 业务后端接口API 入口
|           |-- common.js               // 公用用API接口
|           |-- ...                     // 其他业务模块API接口
|       |-- components                  // 项目全局组件目录
|           |-- icons                   // SVG icon 目录
|           |-- views                   // 全局组件的视图（vue）文件目录
|           |-- index.js                // 全局组件入口
|       |-- config                      // 存放打包各种环境的目录
|           |-- DEV.js                  // DEV环境配置文件
|           |-- UAT.js                  // UAT环境配置文件
|           |-- PRD.js                  // PRD环境配置文件
|           |-- ...                     // 其他环境配置文件
|       |-- data                        // 测试数据目录
|       |-- lib                         // 第三方JS lib目录
|           |-- aliyun                  // 阿里云的插件目录
|           |-- summernote              // 富文本框summernote插件目录
|           |-- qrcode.js               // 生成二维码的插件
|           |-- ...                     // 其他第三方JS插件
|       |-- page-factory                // 创建页面的工厂目录
|           |-- index.js                // 创建页面基类入口页
|           |-- form.js                 // 表单页面类型的基类
|           |-- query.js                // 搜索查询页面类型的基类
|           |-- ...                     // 其他页面类型的基类
|       |-- plugins                     // 项目全局插件目录
|           |-- views                   // 项目全局插件使用的视图(vue)目录
|           |-- index.js                // 项目全局插件目录入口
|           |-- message.js              // 全局消息提示插件
|           |-- ...                     // 其他插件
|       |-- routers                     // 项目页面路由目录
|           |-- index.js                // 项目页面路由入口
|           |-- ...                     // 项目业务模块的路由配置
|       |-- services                    // 项目全局业务目录
|           |-- global-service.js       // 项目全局业务逻辑方法，主要处理登录信息、本地存储等业务逻辑
|           |-- ajax.js                 // 项目全局ajax数据请求封装
|           |-- constants.js            // 项目全局业务的常量集合
|           |-- directives.js           // vue全局自定义指令集合
|           |-- filters.js              // vue全局自定义过滤器集合
|           |-- log.js                  // 项目全局log日志封装
|       |-- store                       // vuex管理webApp的数据状态目录
|           |-- index.js                // 数据管理入口文件
|           |-- data.js                 // 临时数据管理
|           |-- event.js                // 全局自定义事件管理
|           |-- ...                     // 其他数据状态管理
|       |-- utils                       // 项目全局工具方法目录
|           |-- index.js                // 项目全局工具入口文件
|           |-- extend.js               // 对象深复制，创建对象和继承
|           |-- ....                    // 其他工具JS文件
|   		|-- index.js                // 项目的入口文件
|   		|-- site.js                 // 项目中默认业务的配置文件
|   |-- style                           // 项目样式文件目录
|       |-- css                         // 项目css样式文件目录
|       |-- less                        // 项目less样式文件目录
|   		|-- site.less               // 项目基础样式，包含其他less文件的入口
|   		|-- ...                     // 其他less样式文件
|       |-- scss                        // 项目scss样式文件目录
|   |-- views                      		// 项目页面视图目录
|   		|-- components              // 页面内应用的公用组件目录
|   		|-- error                   // 存放错误视图组件目录
|   				|-- not-found.vue   // 404页面视图
|   		|-- ...                     // 其他业务功能模块目录
|   		|-- site.vue                // 整个项目页面入口文件
|   		|-- home.vue                // 整个项目的主页面入口
|   		|-- login.vue               // 登录页
|   |-- index.html                      // 项目html模板页面
|-- .env.XXX                            // vue-cli环境变量配置文件
|-- .eslintignore                       // eslint忽略的文件配置
|-- .eslintrc.js                        // eslint文件配置
|-- .babelrc                            // ES6语法编译配置
|-- .editorconfig                       // 编辑器编码规范配置
|-- .prettierignore                     // 格式化规范配置
|-- .gitignore                          // git忽略文件
|-- index.html                          // webapp的首页加载文件
|-- manifest.json                       // 打包app的配置文件
|-- package.json                        // 配置项目相关信息，通过执行 npm init 命令创建
|-- vue.config.js                       // vue-cli配置文件
```

## 最后
- 如果喜欢一定要 star哈!!!（谢谢!!）

- 如果有意见和问题 请在 lssues提出，我会在线解答。