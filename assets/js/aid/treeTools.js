/*
 * @Author : leaf.fly
 * @Create : 2019-03-21
 * @Desc : this is js for declare tools to list
 * @Version : v1.0.0.20190321
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports, module) {
    ;'use strict';

    var topWin = window["extender"].getTopWin();
    exports.treeTools = {
        "add": {
            show: "<a class=\"icon-grid icon-grid-add\" title=\"添加\"></a>",
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
                                haveBtns[i]["onclick"] = function (item, dialog, submited) {

                                    //todo..check
                                    if (submited) {
                                        submited();
                                    }
                                    topWin.extender.jsmsgSuccess("新增成功。");
                                    dialog.close();
                                };
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
        "edit": {
            show: "<a class=\"icon-grid icon-grid-edit\" title=\"编辑\"></a>",
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
                                haveBtns[i]["onclick"] = function (item, dialog, submited) {

                                    //todo..check
                                    if (submited) {
                                        submited();
                                    }
                                    topWin.extender.jsmsgSuccess("新增成功。");
                                    dialog.close();
                                };
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
        "delete": {
            show: "<a class=\"icon-grid icon-grid-del\" title=\"删除\"></a>",
            event: function ($thisTag, param) {

            }
        }
    };
});
