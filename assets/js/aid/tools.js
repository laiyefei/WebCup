/**
 * Created by linqinghuang on 2016/3/15.
 */

define(function (require, exports, module) {
    var internal = {
        req: require("./req.js").req,
        grid: require("./buildGrid").grid,
        init: function (options) {
        },
        btns: {
            "add": '<li class="list"><input type="button" class="btn btn-add" value="新增"/></li>',
            "del": '<li class="list"><input type="button" class="btn btn-del" value="删除"/></li>',
            "refresh": '<li class="list"><input type="button" class="btn btn-refresh" value="刷新"/>',
            "importfile": '<li class="list"><input type="button" class="btn btn-import" value="导入"/></li>',
            "exportfile": '<li class="list"><input type="button" class="btn btn-export" value="导出"/></li>',
            "downloadfile":'<li class="list"><input type="button"  class="btn btn-download" value="下载模板"/> </li>',
            "custom": function (text, cls) {
                var btncls = cls || "btn-little btn-little-blue";
                return '<li class="list"><a class = "' + btncls + '"><span class="text-outer">' + text + '<span class="text-inner">' + text + '</span></span></a></li>';
            }
        },
        btnBuild: function (options) {
            var btnbox = options["tools"]["btnbox"];
            var toolsBoxId = options["toolsBoxId"];
            var jqbtnBox = $("#" + toolsBoxId).find("[op='btns']");
            $.each(btnbox, function (index, item) {
                if (item) {
                    switch (index) {
                        case "add":
                        case "del":
                        case "refresh":
                        case "importfile":
                        case "exportfile":
                        case "downloadfile":
                            var jqBtn = $(internal.btns[index]).on("click", function () {
                                if ($.isFunction(item)) {
                                    item.call(this);
                                } else {
                                    if (internal.event[index]) {
                                        internal.event[index](options);
                                    }
                                }
                            });
                            jqbtnBox.append(jqBtn);
                            break;
                        case "importfileDict" :
                            var jqBtn = $("<li class = 'list'><div id = 'importBtn' class = 'clearfix'></div></li>");
                            jqbtnBox.append(jqBtn);
                            break;
                        default:

                            if (index.indexOf("custom") >= 0) {
                                var btnName = 'custom'
                                var btnHtml = internal.btns[btnName](item["text"], item["cls"]);
                                var jqBtn = $(btnHtml).on("click", function () {
                                    item["click"]();
                                });
                                jqbtnBox.append(jqBtn);
                            }
                            break;

                    }
                }

            });
        },
        searchBox: function (options, searchCallback) {

            var searchBoxParam = options["tools"]["searchbox"];
            var toolsBoxId = options["toolsBoxId"];
            var jqbtnBox = $("#" + toolsBoxId).find("[op='search']");

            $.each(searchBoxParam, function (index, item) {

                switch (item["type"]) {
                    case "text":
                        var jqLi = $("<li></li>").addClass("list");
                        if (item["hide"] == true) {
                            jqLi.hide();
                        }
                        var jqLabel = $("<label></label>").addClass("label").html(item["label"] + "：");
                        var jqText = $("<input/>").attr({
                            type: 'text',
                            name: item["name"],
                            id: item["id"]
                        }).addClass("text").on("keydown", function (e) {

                            if (e.keyCode == 13 && typeof (searchCallback) == "function") {
                                var isSuccess = true;

                                if (typeof (options["beforeSearch"]) == "function") {
                                    isSuccess = options["beforeSearch"]();
                                }
                                if (!isSuccess) {
                                    return;
                                }
                                $.each(searchBoxParam, function (index, item) {
                                    data[item["name"]] = jqbtnBox.find("[name='" + item["name"] + "']").val();
                                });
                                searchCallback(data);
                            }
                        });
                        jqLi.append(jqLabel).append(jqText);
                        jqbtnBox.append(jqLi);
                        break;
                    case  "select" :
                        var jqLi = $("<li></li>").addClass("list");
                        var jqLabel = $("<label></label>").addClass("label").html(item["label"] + "：");
                        var jqSelect = $("<select/>").attr({
                            name: item["name"]
                        });
                        jqLi.append(jqLabel).append(jqSelect);
                        jqbtnBox.append(jqLi);
                        break;
                    case  "date" :
                        var jqLi = $("<li></li>").addClass("list");
                        var jqLabel = $("<label></label>").addClass("label").html(item["label"] + "：");
                        var jqSpan = $("<span></span>").addClass("text-line-outer" );
                        var initValue = !item["initValue"] ? "" : item["initValue"]; //默认值
                        var jqText = $("<input/>").attr({
                            type: 'text',
                            name: item["name"],
                            id: item["id"],
                            edittype : "date",
                            groupname : item["groupname"],
                            compare : item["compare"],
                            value : initValue,
                            comparemsg : item["comparemsg"]
                        }).addClass("text");
                        jqText.css("width", "180px");
                        jqSpan.append(jqText);
                        jqLi.append(jqLabel).append(jqSpan );
                        jqbtnBox.append(jqLi);
                        break;
                }
            });

            if (searchBoxParam.length > 0) {
                var data = {};
                var jqLi = $("<li></li>").addClass("list").on("click", function () {
                    var isSuccess = true;

                    if (typeof (options["beforeSearch"]) == "function") {
                        isSuccess = options["beforeSearch"]();
                    }
                    if (!isSuccess) {
                        return;
                    }

                    if (typeof (searchCallback) == "function") {
                        $.each(searchBoxParam, function (index, item) {
                            data[item["name"]] = jqbtnBox.find("[name='" + item["name"] + "']").val();
                        });
                        searchCallback(data);
                    }
                });
                var jqBtn = $("<input/>").attr({type: "button"}).addClass("btn btn-search").val("搜索");
                jqLi.append(jqBtn);
                jqbtnBox.append(jqLi);
            }


        },
        event: {
            "add": function (options) {

                var addParam = $.extend(true, {}, options["dialogParam"]["common"], options["dialogParam"]["add"]);
                addParam["winName"] = options["dialogParam"]["winName"];
                addParam["winCallback"] = options["dialogParam"]["winCallback"];
                //自定义确定按钮位置 czs
                var addButtonNum = 0;
                if (addParam["addButtonNum"]) {
                    addButtonNum = addParam["addButtonNum"];
                }
                addParam.buttons[addButtonNum]["onclick"] = function (item, dialog, submited) {
                    var top = common.getTopWindowDom();
                    var callback = function () {
                        var gridId = options["gridId"];
                        var gridObj = liger.get(gridId);
                        gridObj.reload();
                    }
                    top[options["dialogParam"]["winCallback"]](callback, submited);
                }

                if (typeof (addParam["beforeAdd"]) == "function") {
                    var result = addParam["beforeAdd"]();
                    if (result == false) {
                        return;
                    }
                }
                var urlParam = "";
                if (typeof (addParam["otherUrlParam"]) == "function") {
                    $.each(addParam["otherUrlParam"](), function (key, value) {
                        urlParam += key + "=" + encodeURIComponent(value) + "&";
                    });
                }
                addParam["url"] = addParam["url"] + "?" + urlParam;
                top[options["dialogParam"]["winName"]] = common.dialog(addParam);
            },
            "del": function (options) {
                internal.grid.deleteList(options);
            },
            "refresh": function (options) {
            },
            "importfile": function (options) {
                if (options["exportParam"]["importUrl"] != null) {
                    var req = new Request(options["exportParam"]["importUrl"]);
                    req.get({
                        isTip: false,//是否有请求结果消息提示（成功||失败）
                        success: function (data) {
                            if(data != null && data.result != null){
                                if (window.exceljs && window.exceljs["importTable"] && typeof (window.exceljs["importTable"]) == "function") {
                                    window.exceljs["importTable"](options["exportParam"]["tableName"]);
                                }
                            }else{

                            }

                        }
                    })
                }else{
                    if (window.exceljs && window.exceljs["importTable"] && typeof (window.exceljs["importTable"]) == "function") {
                        window.exceljs["importTable"](options["exportParam"]["tableName"]);
                    }
                }




            },
            "exportfile": function (options) {
                if (options["exportParam"]["exportUrl"] != null) {
                    var req = new Request(options["exportParam"]["exportUrl"]);
                    req.get({
                        isTip: false,//是否有请求结果消息提示（成功||失败）
                        success: function (data) {
                            if(data != null && data.result != null){
                                if (window.exceljs && window.exceljs["exportTable"] && typeof (window.exceljs["exportTable"]) == "function") {
                                    window.exceljs["exportTable"](options["exportParam"]["tableName"]);
                                }
                            }else{

                            }

                        }
                    })
                }else{
                    if (window.exceljs && window.exceljs["exportTable"] && typeof (window.exceljs["exportTable"]) == "function") {
                        window.exceljs["exportTable"](options["exportParam"]["tableName"]);
                    }
                }

            },
            "downloadfile": function(options){
                if (options["exportParam"]["downLoadUrl"] != null) {
                    var req = new Request(options["exportParam"]["downLoadUrl"]);
                    req.get({
                        isTip: false,//是否有请求结果消息提示（成功||失败）
                        success: function (data) {
                            if(data != null && data.result != null){
                                if (window.exceljs && window.exceljs["downTable"] && typeof (window.exceljs["downTable"]) == "function") {
                                    window.exceljs["downTable"](options["exportParam"]["tableName"]);
                                }
                            }else{

                            }

                        }
                    })
                }else{
                    if (window.exceljs && window.exceljs["downTable"] && typeof (window.exceljs["downTable"]) == "function") {
                        window.exceljs["downTable"](options["exportParam"]["tableName"]);
                    }
                }

            }
        }
    };
    exports.init = function (options) {
        internal.init(options);
    }
    exports.tools = {
        btnBuild: internal.btnBuild,
        searchBoxBuild: internal.searchBox
    }

});
