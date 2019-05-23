;define(function (require, exports, module) {
    ;'use strict';

    require("{dir}aid/prototype");
    var temp = require("{dir}components/mydates/simpledates/mydates.html");
    var iMyDates = require("{dir}components/mydates/IMyDates")["IMyDates"];

    var param = iMySwitch["props"];
    //param
    var status;
    exports.mydates = {
        id: "",
        require: "",

        load: function (data) {
            for (var iData in data) {
                var key = "";
                for (var i = 0; i < param.length; i++) {
                    if (iData == param[i]) {
                        key = param[i];
                        break;
                    }
                }
                if (key == "") {
                    console.warn("sorry, the myswitch load param is not allow..");
                    continue;
                }
                this[key] = data[key];
            }

            this.listening();
        },
        doChange: function () {
            var changeStatus = true;
            if (this["changeable"] != undefined && this["changeable"] != "") {
                changeStatus = !eval("(" + this["changeable"] + ")");
            }
            if (!changeStatus) {
                extender.jsmsgError("此选项不可修改")
            } else {
                status = !status;
                // change value and showRender
                var ajaxUrl = this["url"];
                var value = this["show"];
                var id = this["id"];
                var param = {};
                if ("btn-switch btn-switch-off" == value) {// switch-on
                    param = {
                        id: id,
                        show: "on"
                    };
                } else {// switch-off
                    param = {
                        id: id,
                        show: "off"
                    };
                }
                ajaxApi({
                    url: ajaxUrl,
                    data: param,
                    successOKResult: function (data) {

                    }
                });
                this.showRender();
            }
        },
        showRender: function () {
            switch (this["show"]) {
                case "on" :
                    status = true;
                    break;
                case "off" :
                    status = false;
                    break;
                default:
                    console.error("sorry, the param [show] is not allow .. ");
                    break;
            }
            this["show"] = status ? "on" : "off";
            this["savecode"] = status ? 1 : 0;
            this["show"] = "btn-switch btn-switch-" + this["show"];
        },
        listening: function () {
            var _this = this;
            var listening = function () {
                setTimeout(function () {
                    var jqObj = $("#" + _this.id);
                    if (jqObj == undefined || jqObj.length == 0) {
                        listening();
                        return;
                    }
                    //find bind
                    jqObj.bind("click", function () {
                        _this.doChange();
                        //render
                        jqObj.find(">span").attr("class", _this["show"]);
                    });
                }, 500);
            };

            listening();
        },
        packing: function () {
            this.showRender();
            return temp.tempRender({
                "id": this["id"],
                "class": this["show"]
            });
        }
    };

});