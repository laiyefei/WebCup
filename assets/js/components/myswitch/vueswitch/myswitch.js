;define(function (require, exports, module) {
    ;'use strict';
    module.exports = function (param) {

        var componentSign = "myswitch";

        if (!param) {
            param = {};
        }

        var iMySwitch = require("{dir}components/myswitch/IMySwitch")["IMySwitch"];
        //use
        var temp = require('{dir}components/myswitch/vueswitch/myswitch.html');
        var myswitch = {
            props: iMySwitch["props"],
            data: function () {

                //init
                this._init();
                this.renderHandler();
                this.showRender();
                this.renderClumnStyle();
                this.renderData();

                this.componentLink();
            },
            _status: undefined,
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
                renderData: function () {
                    for (var item in param) {
                        if (this["targetfield"] == item) {
                            this["savecode"] = param[item];
                            break;
                        }
                    }
                },
                _init: function () {
                    this["targetfield"] = this["tablecode"] + window["apiSign"] + this["fieldcode"];
                },
                renderClumnStyle: function () {
                    this["colspan"] = (function (num) {
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
                showRender: function () {

                    if (undefined == this["_status"]) {
                        switch (this["show"]) {
                            case "on" :
                                this["_status"] = true;
                                break;
                            case "off" :
                                this["_status"] = false;
                                break;
                            default:
                                console.error("sorry, the param [show] is not allow .. ");
                                break;
                        }
                        if (undefined != param) {
                            this["_status"] = 1 == param[this["targetfield"]];
                        }
                    }
                    this["show"] = this["_status"] ? "on" : "off";
                    this["savecode"] = this["_status"] ? 1 : 0;
                    this["show"] = "btn-switch btn-switch-" + this["show"];
                },
                renderHandler: function () {

                    //fieldname
                    if (this["fieldname"] != undefined) {
                        this["fieldname"] += "：";
                    }
                },
                doChange: function () {
                    var changeStatus = true;
                    if (this["changeable"] != undefined && this["changeable"] != "") {
                        changeStatus = !eval("(" + this["changeable"] + ")");
                    }
                    if (!changeStatus) {
                        extender.jsmsgError("此选项不可修改")
                    } else {
                        this["_status"] = !this["_status"];
                        this.showRender();
                    }

                    if (window["extender"]
                        && window["extender"]["vue"]
                        && window["extender"]["vue"]["components"]
                        && window["extender"]["vue"]["components"]["linkDo"]) {
                        window["extender"]["vue"]["components"]["linkDo"]();
                    }
                }
            }
        };
        //register
        Vue.component(componentSign, myswitch);
    };
});