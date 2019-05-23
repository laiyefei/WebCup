/*
 * @Author : leaf.fly
 * @Create : 2019-03-14
 * @Desc : this is js for declare tools to list
 * @Version : v1.0.0.20190314
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports) {
    ;'use strict';

    var topWin = window["extender"].getTopWin();
    exports.listTools = {
        "add": {
            show: "<li class=\"list\"><input type=\"button\" class=\"btn btn-add\" value=\"新增\"></li>",
            open: function (param) {
                var haveBtns = param["buttons"];
                if (haveBtns && haveBtns.length && 0 < haveBtns.length) {
                    for (var i = 0; i < haveBtns.length; i++) {
                        var text = haveBtns[i]["text"];
                        if (undefined == text) {
                            console.warn("sorry, can not find the logic to handler button index " + i);
                            continue;
                        }
                        if (haveBtns[i]["onclick"]) {
                            continue;
                        }
                        //default handler
                        switch (text) {
                            case "确定":
                                (function (theButton) {
                                    var saveURL = theButton["saveURL"];
                                    theButton["onclick"] = function (item, dialog, submited) {
                                        if (!dialog.frame.window.extender || !dialog.frame.window.extender.form) {
                                            console.error("sorry, the js you load is lost something.");
                                            return;
                                        }
                                        dialog.frame.window.extender.form.push(saveURL, function (data) {
                                            topWin.extender.jsmsgError(data["msg"] || "校验出错，字段校验未通过！");
                                            if (submited) {
                                                submited();
                                            }
                                        }, function (data) {
                                            topWin.extender.jsmsgSuccess(data["msg"] || "新增成功。");
                                            if (submited) {
                                                submited(data);
                                            }
                                            if ("function" == typeof theButton["success"]) {
                                                theButton["success"](data);
                                            }
                                            dialog.close();
                                        }, function (data) {
                                            topWin.extender.jsmsgError(data["msg"] || "新增失敗。");
                                            if (submited) {
                                                submited();
                                            }
                                        });
                                    }
                                })(haveBtns[i]);
                                break;
                            case "取消":
                                haveBtns[i]["onclick"] = function (item, dialog) {
                                    dialog.close();
                                };
                                break;
                            default:
                                console.warn("sorry, this button [" + text + "] have no handler function");
                                break;
                        }

                    }
                }

                topWin.$.ligerDialog.open(param);
                // top[internal.param["winName"]].close();
            },
            event: function ($thisTag, param) {
                var _this = this;
                $thisTag.find("input[type='button']").click(function () {

                    //else change
                    if (undefined != param["text"]) {
                        this["value"] = param["text"];
                    }

                    _this.open(param);
                });
            }
        },
        "delete": {
            show: "<li class=\"list\"><input type=\"button\" class=\"btn btn-del\" value=\"删除\"></li>",
            event: function ($thisTag, param) {

                $thisTag.find("input[type='button']").click(function () {

                    var thisLigerGrid = $.ligerui.get("dvGrid");
                    var selRows = thisLigerGrid.getSelectedRows();

                    if (!selRows || 0 == selRows.length) {
                        topWin.extender.jsmsgError("请选择数据行...");
                        return;
                    }

                    var ids = [];
                    var lineColumns = [];
                    var lines = [];
                    for (var i = 0; i < selRows.length; i++) {
                        if (selRows[i]["id"] == undefined
                            && selRows[i]["ID"] == undefined
                            && selRows[i]["Id"] == undefined
                            && selRows[i]["iD"] == undefined) {
                            var line = "";
                            var itemColumns = [];
                            var columns = $.ligerui.get("dvGrid").getColumns();
                            for (var j = 0; j < columns.length; j++) {
                                if (!columns[j]["name"]) {
                                    continue;
                                }
                                itemColumns.push(columns[j]["name"]);
                                line += selRows[i][columns[j]["name"]];
                            }
                            lineColumns.push(itemColumns.join(","));
                            lines.push(line);
                        } else {
                            ids.push(selRows[i]["id"] || selRows[i]["ID"] || selRows[i]["Id"] || selRows[i]["iD"]);
                        }
                    }

                    var data = {};
                    if (ids.length > 0) {
                        data["ids"] = ids.join(apiSign);
                    }
                    if (lineColumns.length > 0 && lines.length > 0) {
                        data["lineColumns"] = lineColumns.join(apiSign);
                        data["lines"] = lines.join(apiSign);
                    }
                    topWin.$.ligerDialog.confirm("是否删除选中记录？", function (ok) {
                        if (!ok) {
                            return;
                        }
                        ajaxApi({
                            url: param["url"],
                            data: data,
                            successOKNoResult: function (data) {
                                topWin.extender.jsmsgSuccess("删除成功！");
                                thisLigerGrid.reload();
                            }
                        })
                    })
                });

            }
        },
        "import": {
            show: "<li class=\"list\"><input type=\"file\" class=\"uploadlay\" id=\"file_import\" name=\"file\" accept=\"application/vnd.ms-excel\" style=\"width: 66px;cursor: pointer;vertical-align: middle; top: 5px;height: 22px;font-size:0;\">" +
                "<input type=\"button\" class=\"btn btn-import\" value=\"导入\">" +
                "</li>",
            event: function ($thisTag, param) {

            }
        },
        "export": {
            show: "<li class=\"list\"><input type=\"button\" class=\"btn btn-export\" value=\"导出\"></li>",
            event: function ($thisTag, param) {

            }
        },
        "exportTemp": {
            show: "<li class=\"list\"><input type=\"button\" class=\"btn btn-download\" value=\"下载模板\"></li>",
            event: function ($thisTag, param) {

            }
        },
        "choose": {
            show: "<li class=\"list\"><input type=\"button\" class=\"btn btn-add\" value=\"新增\"></li>",
            open: function (param) {
                var ligerDialogParam = {
                        title: param["title"],
                        width: param["width"],
                        height: param["height"],
                        url: param["url"],
                        data: param["data"],
                        // data: {
                        //     // saveItems: param["saveItems"] || [],
                        //     // selectOnly: eval("(" + this["selectonly"] + ")") || false,
                        //     // url: this["dialoggridurl"],
                        //     // columns: columns,
                        //     // maxSelect: maxSelect,
                        //     // minSelect: minSelect,
                        //     // selectCode: selectcode,
                        //     // selectName: selectname
                        // },
                        buttons: [
                            {
                                text: "确定",
                                onclick: function (item, dialog, submited) {

                                    var chooseDatas = dialog.frame["extender"].GlobalCache.get("selectLiItems");

                                    //save
                                    if (param["afterSelected"] && "function" == typeof param["afterSelected"]) {
                                        param["afterSelected"](chooseDatas);
                                    }

                                    if (submited) {
                                        submited();
                                    }
                                    // topWin.extender.jsmsgSuccess("操作成功。");
                                    dialog.close();
                                }
                            },
                            {
                                text: "取消",
                                onclick: function (item, dialog) {
                                    dialog.close();
                                }
                            }
                        ]
                    }
                ;

                topWin.$.ligerDialog.open(ligerDialogParam);
            },
            event: function ($thisTag, param) {
                var _this = this;
                $thisTag.find("input[type='button']").click(function () {

                    //else change
                    if (undefined != param["text"]) {
                        this["value"] = param["text"];
                    }
                    // beforeOpen 验证操作
                    var ok = true;
                    if (param["onBeforeOpen"] && "function" == typeof param["onBeforeOpen"]) {
                        ok = param["onBeforeOpen"](param);
                    }
                    if (ok) {
                        _this.open(param);
                    }
                    // else {
                    //     console.error("sorry,beforeOpen return false,please check again.");
                    // }
                });
            }
        },
        "lineEdit": {
            show: "<a class=\"icon-grid icon-grid-edit\" title=\"编辑\" value=\"编辑\" ></a>",
            open: function (param) {
                var haveBtns = param["buttons"];
                if (haveBtns && haveBtns.length && 0 < haveBtns.length) {
                    for (var i = 0; i < haveBtns.length; i++) {
                        var text = haveBtns[i]["text"];
                        if (undefined == text) {
                            console.warn("sorry, can not find the logic to handler button index " + i);
                            continue;
                        }
                        if (haveBtns[i]["onclick"]) {
                            continue;
                        }
                        //default handler
                        switch (text) {
                            case "确定":
                                (function (theButton) {
                                    var saveURL = theButton["saveURL"];
                                    theButton["onclick"] = function (item, dialog, submited) {
                                        if (!dialog.frame.window.extender || !dialog.frame.window.extender.form) {
                                            console.error("sorry, the js you load is lost something.");
                                            return;
                                        }
                                        dialog.frame.window.extender.form.push(saveURL, function (data) {
                                            topWin.extender.jsmsgError(data["msg"] || "校验出错，字段校验未通过！");
                                            if (submited) {
                                                submited();
                                            }
                                        }, function (data) {
                                            topWin.extender.jsmsgSuccess(data["msg"] || "新增成功。");
                                            if (submited) {
                                                submited(data);
                                            }
                                            if ("function" == typeof theButton["success"]) {
                                                theButton["success"](data);
                                            }
                                            dialog.close();
                                        }, function (data) {
                                            topWin.extender.jsmsgError(data["msg"] || "新增失敗。");
                                            if (submited) {
                                                submited();
                                            }
                                        });
                                    }
                                })(haveBtns[i]);
                                break;
                            case "取消":
                                haveBtns[i]["onclick"] = function (item, dialog) {
                                    dialog.close();
                                };
                                break;
                            default:
                                console.warn("sorry, this button [" + text + "] have no handler function");
                                break;
                        }

                    }
                }

                topWin.$.ligerDialog.open(param);
            },
            event: function ($thisTag, param) {
                var _this = this;
                $thisTag.click(function () {
                    _this.open(param);
                });
            }
        },
        "lineDel": {
            show: "<a class=\"icon-grid icon-grid-del\" title=\"删除\" value=\"删除\" ></a>",
            doIt: function (param) {
                if (!param) {
                    console.error("sorry, the param is can not be empty.");
                    return;
                }
                if (!param["url"]) {
                    console.error("sorry, the delete button you invoke [url] is can not be empty.");
                    return;
                }

                var fn = function () {
                    ajaxApi({
                        url: param["url"],
                        data: param["data"] || {},
                        successNOOK: function (data) {
                            topWin.extender.jsmsgError(data["msg"] || "删除失败。");
                        },
                        successOKNoResult: function (data) {
                            topWin.extender.jsmsgSuccess(data["msg"] || "删除成功。");
                            if ("function" == typeof param["success"]) {
                                param["success"](data);
                            }
                        }
                    });
                };
                topWin.$.ligerDialog.confirm(param["word"] || "是否删除目标？",
                    function (status) {
                        if (status) {
                            if ("function" == typeof param["before"]) {
                                var before = param["before"]();
                                if ("undefined" != typeof before && !before) {
                                    return;
                                }
                            }
                            fn();
                        }
                    });

            },
            event: function ($thisTag, param) {
                var _this = this;
                $thisTag.click(function () {
                    _this.doIt(param);
                });
            }
        }
    };
});