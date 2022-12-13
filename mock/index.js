/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-17 17:26:30
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2022-12-05 17:53:19
 * @项目的路径: \vue-manager-system\mock\index.js
 * @描述: dev server mock数据
 */

const Mock = require("mockjs");

function wrapResponse(template, randomFlag = false, dataSize, codes) {
    const wrapTemplate = {
        "code|1": codes || [""],
        "flag|1": randomFlag ? ["S", "F"] : ["S"],
        msg: function () {
            if (this.flag === "F") {
                return Mock.Random.ctitle(5, 20);
            }
        }
    };
    if (dataSize) {
        wrapTemplate["data|" + dataSize] = template;
    } else {
        wrapTemplate.data = template;
    }
    return Mock.mock(wrapTemplate);
}

module.exports.init = function (app) {
    app.get("/some/path", function (request, response) {
        const time = new Date().getTime();
        response.json(
            wrapResponse({
                "total|10-1000": 0,
                "rows|50": [
                    {
                        activityBelongName: "@cword(4, 20)", // 活动名称
                        materialCode: "SC@date('yyyyMMddHH')@string('number', 8)", // 素材ID
                        picture: "@image()", // 素材缩略图
                        "genre|1": [1, 2], // 素材类型
                        pictureLength: "@string('number', 2, 4)", // 素材高度
                        state: [0, 1, 2, 3], // 素材状态
                        refuseRemark: "@cword(4, 20)",
                        eleType: "", // 关联资源位
                        eleState: "", // 关联资源位状态
                        dateCreated: "@integer(" + (time - 30 * 24 * 60 * 60 * 1000) + ", " + time + ")", // 创建时间
                        createdBy: "@cname()", // 创建人
                        pictureSize: "@string('number', 1, 4)", // 素材大小
                        pictureWidth: "@string('number', 2, 4)" // 素材宽度
                    }
                ]
            })
        );
    });
};
