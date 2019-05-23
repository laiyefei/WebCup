;define(function (require, exports, module) {
    ;'use strict';

    module.exports = function (param) {

        var componentSign = "mytext";

        if (!param) {
            param = {};
        }

        var temp = require('{dir}components/mytext/mytext.html');
        var text = {
            props: [
                'required',
                'columnstyle',
                "targetfield",
                "tablecode",
                'fieldcode',
                'fieldname',
                "disabled",
                "fieldvalue",
                "type"
            ],
            data: function () {

                //init
                this._init();
                this.renderClumnStyle();
                this.renderData();

                this.componentLink();
            },
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
                renderData: function () {
                    for (var item in param) {
                        if (this["targetfield"] == item) {
                            this["fieldvalue"] = param[item];
                            break;
                        }
                    }
                },
                renderClumnStyle: function () {
                    this["columnstyle"] = (function (num) {
                        num = parseInt(num);
                        var nowShow;
                        //对外列转换样式
                        switch (num) {
                            case 1 :
                                nowShow = "one";
                                break;
                            case 2:
                                nowShow = "two";
                                break;
                            case 3 :
                                nowShow = "three";
                                break;
                            default:
                                nowShow = "one";
                                //console.error("sorry, can not find for [num] is can not find.");
                                break;
                        }
                        return "column-" + nowShow;
                    })(this["colspan"]);
                },
                _init: function () {
                    this["targetfield"] = this["tablecode"] + window["apiSign"] + this["fieldcode"];

                    if ("undefined" == this["type"]) {
                        this["type"] = "text";
                    }

                    if (undefined == this["disabled"]) {
                        this["disabled"] = true;
                    } else {
                        this["disabled"] = parseInt(this["disabled"]);
                        if (NaN == this["disabled"]) {
                            this["disabled"] = 0;
                        }
                        if (!this["disabled"]) {
                            this["disabled"] = false;
                        }
                    }
                }
            },
            template: temp
        };
        //register
        Vue.component(componentSign, text);
    };
});