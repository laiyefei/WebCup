/**
 * this class is for ajax temp function
 *
 * author : leaffly
 * version : v1.0.0.20190312
 */
;define(function (require, exports) {
    var ajaxApi = function (param) {
        $.ajax({
            url: param["url"],
            type: param["type"] || "POST",
            data: param["data"],
            success: function (data) {

                //if have success, invoke self
                if (param["success"] != undefined && "function" == typeof param) {
                    return param["success"](data);
                }

                if ("string" == typeof data) {
                    data = eval("(" + data + ")");
                }
                if (!data["ok"]) {
                    if (param["successNOOK"] != undefined && "function" == typeof param["successNOOK"]) {
                        return param["successNOOK"](data);
                    }
                    console.error(data["msg"] || "ERROR:服务端请求状态出错。");
                    return;
                }

                if (param["successOK"] != undefined && "function" == typeof param["successOK"]) {
                    return param["successOK"](data);
                }

                if (!data["result"] || 0 == data["result"].length) {
                    if (param["successOKNoResult"] != undefined && "function" == typeof param["successOKNoResult"]) {
                        return param["successOKNoResult"](data);
                    }
                    console.error("ERROR：获取数据出错！");
                    return;
                }
                if (param["successOKResult"] != undefined && "function" == typeof param["successOKResult"]) {
                    if (!param["noObjectResult"]) {
                        if ("string" == typeof data["result"]) {
                            data["result"] = eval("(" + data["result"] + ")");
                        }
                    }
                    return param["successOKResult"](data);
                }

                console.warn("ajaxApi success, but no anything then do.");
            },
            error: function (data) {
                //if have error, invoke self
                if (param["error"] != undefined && "function" == typeof param) {
                    return param["error"](data);
                }
                console.log(data);
            }
        });
    };

    ajaxApi({
        url: "/system/getapisign",
        noObjectResult: true,
        async: false,
        successOKResult: function (data) {
            window["apiSign"] = data["result"];
        }
    });
    window["apiSign"] = window["apiSign"] || ",";
    window["ajaxApi"] = ajaxApi;
    exports.ajaxApi = ajaxApi;
});