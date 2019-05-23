;define(function (require, exports, module) {
    ;'use strict';

    require("{dir}aid/prototype");
    require("{dir}aid/extender");
    var temp = require("{dir}components/myswitch/simpleswitch/myswitch.html");
    var iMySwitch = require("{dir}components/myswitch/IMySwitch")["IMySwitch"];

    var param = iMySwitch["props"];
    //param
    exports.mySwitch = {
        id: "",
        _id: "",
        require: "",
        colspan: "",
        targetfield: "",
        tablecode: "",
        fieldname: "",
        fieldcode: "",
        savecode: "",
        changeable: "",
        show: "",
        url: "",

        _status: false,
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

            if (this["id"]) {
                this["_id"] = this["id"] + "_" + new Date().getTime();
            }

            switch (this["show"]) {
                case "on" :
                    this._status = true;
                    break;
                case "off" :
                    this._status = false;
                    break;
                default:
                    console.error("sorry, the param [show] is not allow .. ");
                    break;
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
                this._status = !this._status;
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
                    successOKNoResult: function (data) {
                        extender.jsmsgSuccess(data["msg"]);
                    },
                    successNOOK: function (data) {
                        extender.jsmsgError(data["msg"]);
                    }
                });
                this.showRender();
            }
        },
        showRender: function () {
            this["show"] = this._status ? "on" : "off";
            this["savecode"] = this._status ? 1 : 0;
            this["show"] = "btn-switch btn-switch-" + this["show"];
        },
        listening: function () {
            var _this = this;
            var listening = function () {
                setTimeout(function () {
                    var jqObj = $("#" + _this._id);
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
                "id": this["_id"],
                "class": this["show"]
            });
        }
    };

});