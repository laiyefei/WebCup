;define(function (require, exports, module) {
    ;'use strict';

    module.exports = function (param) {

        var compontSign = "myselect";

        if (!param) {
            param = {};
        }

        var temp = require('{dir}components/myselect/myselect.html');
        var myselect = {
            props: [
                'require',
                'colspan',
                "targetfield",
                "tablecode",
                'fieldname',
                'fieldcode',
                'fieldvalue',
                'title',
                'dataurl',
                'datas'
            ],
            data: function () {
                this._init();
                this.doRender();
                this.getDatas();
                this.renderData();

                this.componentLink();
            },
            template: temp,
            methods: {
                componentLink: function () {

                    //for link
                    var _this = this;
                    window["extender"]["vue"]["components"][compontSign] = window["extender"]["vue"]["components"][compontSign] || {};
                    window["extender"]["vue"]["components"][compontSign][this["targetfield"]] = {};
                    window["extender"]["vue"]["components"][compontSign][this["targetfield"]]["extendDo"] = function (fn) {
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
                _init: function () {
                    this["targetfield"] = this["tablecode"] + window["apiSign"] + this["fieldcode"];
                },
                getDatas: function () {
                    if (!this["dataurl"]) {
                        return;
                    }
                    //datas
                    //this["dataurl"]

                    var _this = this;
                    ajaxApi({
                        url: this["dataurl"],
                        successOKResult: function (data) {
                            _this["datas"] = data["result"];
                        }
                    });

                },
                doRender: function () {
                    var _num = {
                        1: "one",
                        2: "two",
                        3: "three"
                    };
                    this["colspan"] = "column-" + _num[parseInt(this["colspan"] || "3")];
                },
                doChoose: function () {
                    this.$refs.lists.style.display = (this.$refs.lists.style.display == 'block') ? 'none' : 'block';
                },
                getValue: function (e) {
                    this["title"] = e.text;
                    this["fieldvalue"] = e.code;
                }
            }
        };

        //register
        Vue.component(compontSign, myselect);
    };
});