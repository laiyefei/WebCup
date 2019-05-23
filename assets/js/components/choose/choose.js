;define(function (require, exports, module) {
    ;'use strict';
    //require need css
    module.exports = function (target) {

        var componentSign = "choose";

        var topWin = window["extender"].getTopWin();
        var temp = require('{dir}components/choose/choose.html');
        var choose = {
            props: [
                'require',
                'fieldcode',
                'fieldname',
                "buttonshow",
                "dialogtitle",
                "dialogurl",
                "dialogwidth",
                "dialogheight",
                "dialoggridurl",
                "dialoggridcolumns",
                "maxselect",
                "minselect",
                "selectcode",
                "selectname",
                "savecodes",
                "savenames",
                "selectonly"
            ],
            data: function () {

            },
            template: temp,
            methods: {
                componentLink: function () {

                    //for link
                    var _this = this;
                    window["extender"]["vue"]["components"][componentSign] = window["extender"]["vue"]["components"][componentSign] || {};
                    window["extender"]["vue"]["components"][componentSign][this["targetfield"]] = {};
                    window["extender"]["vue"]["components"][componentSign][this["targetfield"]]["extendDo"] = function (fn) {
                        fn(_this);
                    };
                },
                doChoose: function () {

                    var columns = this["dialoggridcolumns"],
                        maxSelect = this["maxselect"],
                        minSelect = this["minselect"],
                        selectcode = this["selectcode"],
                        selectname = this["selectname"];

                    if ("string" == typeof columns) {
                        columns = eval("(" + columns + ")");
                    }
                    if ("string" == typeof maxSelect) {
                        maxSelect = eval("(" + maxSelect + ")");
                    }
                    if ("string" == typeof minSelect) {
                        minSelect = eval("(" + minSelect + ")");
                    }

                    var _this = this;
                    var param = {
                            title: this["dialogtitle"],
                            width: this["dialogwidth"],
                            height: this["dialogheight"],
                            url: this["dialogurl"] || "../organization/chooseHosType",
                            data: {
                                saveItems: this["saveItems"] || [],
                                selectOnly: eval("(" + this["selectonly"] + ")") || false,
                                url: this["dialoggridurl"],
                                columns: columns,
                                maxSelect: maxSelect,
                                minSelect: minSelect,
                                selectCode: selectcode,
                                selectName: selectname
                            },
                            buttons: [
                                {
                                    text: "确定",
                                    onclick: function (item, dialog, submited) {

                                        var chooseDatas = dialog.frame["extender"].GlobalCache.get("selectData");

                                        //save
                                        _this["savecodes"] = chooseDatas["codes"].join(",");
                                        _this["savenames"] = chooseDatas["names"].join(",");
                                        _this["saveItems"] = chooseDatas["saveItems"];

                                        if (submited) {
                                            submited();
                                        }
                                        topWin.extender.jsmsgSuccess("操作成功。");
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

                    topWin.$.ligerDialog.open(param);
                }
            }
        };


        //register
        Vue.component(componentSign, choose);
    };
});