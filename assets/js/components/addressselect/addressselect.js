;define(function (require, exports, module) {
    ;'use strict';
    module.exports = function (target) {

        var componentSign = "addressselect";

        var topWin = window["extender"].getTopWin();
        var temp = require('{dir}components/addressselect/addressselect.html');
        var addressselect = {
            props: [
                'require',
                'fieldcode',
                'fieldname'
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

                    var param = {
                        title: "选择医院类别",
                        width: 560,
                        height: 600,
                        url: "../organization/selectHosType",
                        buttons: [
                            {
                                text: "确定",
                                onclick: function (item, dialog, submited) {

                                    //todo..check
                                    if (submited) {
                                        submited();
                                    }

                                    topWin.extender.jsmsgSuccess("新增成功。");
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
                    };

                    topWin.$.ligerDialog.open(param);
                }
            }
        };

        //register
        Vue.component(componentSign, addressselect);
    };
});