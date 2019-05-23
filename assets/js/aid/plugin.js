(function () {
    //获取表单控件值
    $.fn.form2json = function () {
        var obj = {};
        $.each(this.serializeArray(), function (i, o) {
            var n = o.name, v = $.trim(o.value);
            obj[n] = obj[n] === undefined ? v
                : $.isArray(obj[n]) ? obj[n].concat(v)
                : [obj[n], v];
        });
        return obj;
    }
    //时间初始化
    $.fn.formInitDate = function (options) {
        var target = this;
        var defaultParam = {
            format: "yyyy-MM-dd",
            cancelable: true,
            absolute: false,
            showTime: false,
            isToday: true,//今天true，昨天为false
            pro: []
        };
        var param = $.extend(true, {}, defaultParam, options || {});
        var list = $("[edittype='date']", $(this));
        $.each(list, function (index, item) {
            var unNeed = $(item).attr("unneed");
            if (unNeed) {
                list.splice(index, 1);
            }
        })
        list.ligerDateEditor({
            format: param["format"],
            cancelable: param["cancelable"],
            showTime: param["showTime"],
            absolute: param["absolute"],
            isToday: param["isToday"],
            onChangeDate: function (value, jqDate) {
                $.each(param["pro"], function (index, item) {
                    if (!jqDate.attr("isProNoValid")) {
                        if (jqDate.attr("name") == item["name"]) {
                            var dateValue = value;
                            var dateValue = dateValue.replace(/-/g, '/');
                            var dDate = new Date(dateValue);
                            if (item["min"]) {
                                if (Date.parse(dDate) < Date.parse(item["min"])) {
                                    jqDate.val("");
                                    common.jsmsgError(item["minTip"]);
                                    return
                                }
                            }
                            if (item["max"]) {
                                if (Date.parse(dDate) > Date.parse(item["max"])) {
                                    jqDate.val("");
                                    common.jsmsgError(item["maxTip"]);
                                    return
                                }
                            }
                        }
                    }
                })

                //此处有修改ligerui的参数:value;obj;两个参数
                var groupname = jqDate.attr("groupname");
                var compare = jqDate.attr("compare");
                var comparemsg = jqDate.attr("comparemsg");
                var moreday = jqDate.attr("moreday");
                var moremsg = jqDate.attr("moremsg");
                var bigDate = "", smallDate = "";
                if (groupname) {
                    if (compare == "big") {
                        bigDate = value;
                        smallDate = $("input[groupname='" + groupname + "'][compare='small']").val();
                        if (bigDate && smallDate) {
                            smallDate = smallDate.replace(/-/g, '/');
                            bigDate = bigDate.replace(/-/g, '/');
                            var sDate = new Date(smallDate);
                            var bDate = new Date(bigDate);
                            if (Date.parse(sDate) > Date.parse(bDate)) {
                                jqDate.val("");
                                common.jsmsgError(comparemsg)
                            }
                            if (moreday != "" && moreday != undefined && moreday != null) {
                                var timeDifference = new Date(bigDate).getTime() - new Date(smallDate).getTime();   //时间差的毫秒数
                                var days = Math.ceil(timeDifference / (24 * 3600 * 1000));
                                if (days < moreday) {
                                    jqDate.val("");
                                    common.jsmsgError(moremsg)
                                }
                            }
                        }
                    } else {
                        smallDate = value;
                        bigDate = $("input[groupname='" + groupname + "'][compare='big']").val();
                        if (bigDate && smallDate) {
                            smallDate = smallDate.replace(/-/g, '/');
                            bigDate = bigDate.replace(/-/g, '/');
                            var sDate = new Date(smallDate);
                            var bDate = new Date(bigDate);
                            if (Date.parse(sDate) > Date.parse(bDate)) {
                                jqDate.val("");
                                common.jsmsgError(comparemsg);
                            }
                            if (moreday != "" && moreday != undefined && moreday != null) {
                                var timeDifference = new Date(bDate).getTime() - new Date(sDate).getTime();   //时间差的毫秒数
                                var days = Math.ceil(timeDifference / (24 * 3600 * 1000));
                                if (days < moreday) {
                                    jqDate.val("");
                                    common.jsmsgError(moremsg)
                                }
                            }

                        }
                    }
                }
            }
        });
    }
    //表单绑定值
    $.fn.json2form = function (obj) {
        if (obj == null || typeof (obj) == 'undefined')
            return false;
        var param = obj;
        $.each(obj, function (i, o) {
            var jqObj = $("[name='" + i + "']");
            var type = jqObj.attr("type");
            var isSelect = $(jqObj).is('select');
            if (isSelect) {
                type = "select";
            }
            if ($(jqObj).is('span')) {
                type = "span";
            }
            var edittype = jqObj.attr("edittype");
            switch (type) {
                case "text":
                    if (edittype == "date") {
                        var format = "yyyy-MM-dd";
                        if (jqObj.attr("format")) {
                            format = jqObj.attr("format");
                        }
                        var longReg = /^\d*$/;
                        if (o && longReg.test(o) ) {
                            o = common.dateTimeStamp2dateTime(o, format);
                        }
                        jqObj.val(o);
                        jqObj.trigger("change");
                    } else {
                        if (jqObj.attr("readonly") && jqObj.attr("format") ) { //如果文本框只读且数据是日期格式
                            format = jqObj.attr("format");
                            var longReg = /^\d*$/;
                            if (o && longReg.test(o) ) {
                                o = common.dateTimeStamp2dateTime(o, format);
                            }
                        }
                        jqObj.val(o);
                        jqObj.trigger("setValue", obj);//配合dialogSelect使用
                    }
                    break;
                case "select":
                    jqObj.find("option[value='" + o + "']").attr("selected", "selected");
                    jqObj.val(o);
                    jqObj.trigger("setValue", obj);//配合select插件用
                    break;
                case "radio":
                    $("input[name='" + i + "'][value='" + o + "']").prop("checked", true);
                    var checkValue = $("input[name='" + i + "']:checked").val();
                    $("input[name='" + i + "'][value='" + o + "']").trigger("setValue");//配合switch插件用；radio值绑定时,switch会自动切换；
                    break;
                case "span":
                    jqObj.text(o);
                    break;
                default:
                    jqObj.val(o);
                    break;
            }
        });
    }

    //switch开关按钮
    $.fn.btnSwitch = function (options) {
        var internal = {
            defaultOptions: {
                //跟实体的属性对应（支持自动绑定）
                name: '',
                //switchOff或switchOn为开关时的值：正常情况下值可以是：true,false;0,1;也可以是其他任意值
                switchOff: 0,
                switchOn: 1,
                initBindEvent: null,//初始化绑定事件
                onAfterChange: null
            },
            init: function (self) {
                var toggle = $(self).find(".btn-switch");
                var name = self["param"]["name"];
                var jqRadioOn = $('<input  />').attr({
                    type: 'radio',
                    name: name
                }).val(self["param"]["switchOn"]).css({display: "none"});
                var jqRadioOff = $('<input />').attr({
                    type: 'radio',
                    name: name
                }).val(self["param"]["switchOff"]).css({display: "none"});
                $(self).after(jqRadioOn).after(jqRadioOff);
                //初始化前先判断绑定的值
                if (toggle.hasClass("btn-switch-on")) {
                    $("[name='" + name + "'][value='" + self["param"]["switchOn"] + "']").trigger("click");
                } else {
                    $("[name='" + name + "'][value='" + self["param"]["switchOff"] + "']").trigger("click");
                }
                $('input[name="' + name + '"]').on("setValue", function () {
                    var checkValue = $('input[name=' + name + ']:checked').val();
                    if (checkValue == self["param"]["switchOn"]) {
                        toggle.animate({
                            "margin-left": 0
                        }, 500, function () {
                            toggle.removeClass("btn-switch-off").addClass("btn-switch-on");
                        });
                    } else {
                        toggle.animate({
                            "margin-left": -35
                        }, 500, function () {
                            toggle.removeClass("btn-switch-on").addClass("btn-switch-off");
                        });
                    }
                    if (typeof(self["param"]["initBindEvent"]) == "function") {
                        self["param"]["initBindEvent"](checkValue)
                    }
                });
                $(self).click(function (e) {
                    var checkValue = null;
                    if (toggle.hasClass("btn-switch-on")) {
                        toggle.animate({
                            "margin-left": -35
                        }, 500, function () {
                            toggle.removeClass("btn-switch-on").addClass("btn-switch-off");
                        });
                        $("[name='" + name + "'][value='" + self["param"]["switchOff"] + "']").click();
                        checkValue = self["param"]["switchOff"];
                    }
                    else {
                        toggle.animate({
                            "margin-left": 0
                        }, 500, function () {
                            toggle.removeClass("btn-switch-off").addClass("btn-switch-on");
                        });
                        $("[name='" + name + "'][value='" + self["param"]["switchOn"] + "']").click();
                        checkValue = self["param"]["switchOn"];
                    }

                    if (typeof(self["param"]["onAfterChange"]) == "function") {
                        self["param"]["onAfterChange"](checkValue);
                    }
                });
            }
        }
        var target = this;
        $(target).each(function () {
            var self = this;
            self.param = $.extend(true, {}, internal.defaultOptions, options);
            internal.init(self);
        })
    }

    var mxSelect = function (target, options) {
        this.target = target;
        this.width = options["width"];
        this.maxHeight = options["maxHeight"];
        this.initLoad = options["initLoad"];
        this.preText = options["preText"];
        this.preValue = options["preValue"];
        this.localData = options["localData"];
        this.data = options["data"];
        this.name = options["name"];
        this.display = options["display"];
        this.value = options["value"];
        this.text = options["text"];
        this.ajaxParam = options["ajaxParam"];
        this.renderData = options["renderData"];
        this.onAfterSelected = options["onAfterSelected"];
        this.isApply = options["isApply"];
        this._buildHtml();
        var t = this;
        if (t.initLoad) {
            t._loadData();
        }
        this.target.closest(".simulate-select").on("click", function () {
            if (!t.isReadOnly) {
                if (!t._hasLoad) {
                    if (!t.isApply) {
                        t._loadData();
                        t.isApply = true;
                    }
                }
                t._show();
            }
        }).hover(null, function () {
            t.target.closest(".simulate-select").find("ul").hide();
        });

        //配合单使用值使用
        this.target.on("setValue", function (event, argument) {
            if (t.localData) {
                if (t.data && t.data.length > 0) {

                } else {
                    t.target.val(argument[t.name]);
                    var text = t.target.find("option[value='" + argument[t.name] + "']").text();
                    t.target.closest(".simulate-select").find(".text").text(text);
                }
            } else {
                t.target.closest(".simulate-select").find(".text").text(argument[t.display]);
                if (!t._hasLoad) {
                    var jqOption = $("<option></option>").attr({"value": argument[t.name]}).text(argument[t.display]);
                    t.target.closest(".simulate-select").find("select").append(jqOption);
                }
                t.bindValue(argument[t.name], "value");
            }

        });
    }
    //是否数据已经加载
    mxSelect.prototype._hasLoad = false;
    //目标
    mxSelect.prototype.target = null;
    mxSelect.prototype.width = null;
    mxSelect.prototype.maxHeight = null;
    mxSelect.prototype.initLoad = null;
    mxSelect.prototype.preText = null;
    mxSelect.prototype.preValue = null;
    mxSelect.prototype.localData = null;
    mxSelect.prototype.data = null;
    mxSelect.prototype.name = null;
    mxSelect.prototype.display = null;
    mxSelect.prototype.value = null;
    mxSelect.prototype.text = null;
    mxSelect.prototype.ajaxParam = null;
    mxSelect.prototype.renderData = null;
    mxSelect.prototype.onAfterSelected = null;

    mxSelect.prototype._buildHtml = function () {
        var width = this.width;
        var jqSelectBox = $('<span class="simulate-select"> </span>').css({width: width});
        this.target.hide().wrap(jqSelectBox);
        var jqSelectText = $('<span class="text"></span>').css({width: width - 20});
        var jqSelectIcon = $('<i class="icon-grid icon-grid-fold-gray"></i>').css({
            position: "absolute",
            top: "1px",
            left: width - 20
        });
        var ulCss = {
            width: width - 1,
            display: "none",
            "max-height": this.maxHeight
        }
        var jqSelectUl = $('<ul class="simulate-select-lists"></ul>').css(ulCss);
        this.target.before(jqSelectText);
        this.target.before(jqSelectIcon);
        this.target.after(jqSelectUl);
        this._bindPre();
    };
    mxSelect.prototype._getPreText = function () {
        var t = this;
        //本地且是从界面中读取中读取
        if (t.localData && t.data.length == 0) {
            t.preText = "";
        } else if (t.localData && t.data.length > 0) {
            t.preText = t.preText;
        } else {
            var text = t.target.find("option:first").text();
            var preText = t.preText || text || "";
            t.preText = preText;
            text = null;
            preText = null;
        }
    };
    mxSelect.prototype._getPreValue = function () {
        var t = this;
        //本地且是从界面中读取中读取
        if (t.localData && t.data.length == 0) {
            t.preValue = "";
        } else if (t.localData && t.data.length > 0) {
            t.preValue = t.preValue;
        } else {
            var value = t.target.find("option:first").attr("value");
            var preValue = t.preValue || value || "";
            t.preValue = preValue;
            value = null;
            preValue = null;
        }
    };
    mxSelect.prototype._bindPre = function () {
        var t = this;
        t._getPreText();
        t._getPreValue();

        if ((!t.localData || (t.localData && t.localData && t.data.length > 0))) {

            if (t.preText || this.preValue) {
                t.target.empty();
                var jqOptionPre = $("<option></option>").attr({value: this.preValue}).text(this.preText);
                t.target.append(jqOptionPre);
                var jqUl = t.target.closest(".simulate-select").find("ul").empty();
                var jqLiPre = $("<li></li>").addClass("simulate-select-list").attr("value", this.preValue).text(this.preText).on("click", function () {
                    t.target.closest(".simulate-select").find(".text").text(t.preText);
                    t.target.closest(".simulate-select").find("select").val(t.preValue);
                    var oldValue = t.target.val() || "";
                    var curData = "";

                    t.bindValue(t.preValue, "value");

                    if (typeof(t.onAfterSelected) == "function") {
                        var newValue = $(this).attr("value") || "";
                        t.onAfterSelected(curData, newValue, oldValue);
                    }
                    common.stopBubble();
                    jqUl.hide();
                });
                jqUl.append(jqLiPre);
                t.target.closest(".simulate-select").find(".text").text(this.preText);
                t.target.closest(".simulate-select").find("select").val(this.preValue);
            }
        } else {
            var value = t.target.find("option:first").attr("value");
            var text = t.target.find("option:first").text();
            this.target.closest(".simulate-select").find(".text").text(text);
            this.target.closest(".simulate-select").find("select").val(value);
        }
    };
    mxSelect.prototype._loadData = function () {
        if (this.localData) {
            this._loadLocalData();
        } else {
            this._loadServiceData();
        }
    };
    mxSelect.prototype._loadServiceData = function (callback) {
        var t = this;
        if (!t._hasLoad) {
            var initValue = t.target.val() || "";
            var url = t.ajaxParam["url"];
            var param = t.ajaxParam["data"];
            if(typeof param == "function"){
                param = param();
            }
            var req = new Request(url);
            var type = t.ajaxParam["type"];
            req[type]({
                isTip: false,
                data: param,
                success: function (data) {
                    if (typeof (t.renderData) == "function") {
                        data = t.renderData(data);
                    }
                    var value = t.value;
                    var text = t.text;
                    $.each(data, function (index, item) {
                        var jqUl = t.target.closest(".simulate-select").find("ul");
                        var jqLi = $("<li></li>").data("itemInfo", item).attr({"value": item[value]}).addClass("simulate-select-list").text(item[text]).on("click", function () {

                            var oldValue = t.target.val() || "";
                            t.bindValue(item[value], "value");
                            if (typeof(t.onAfterSelected) == "function") {
                                var curData = $(this).data("itemInfo");
                                var newValue = $(this).attr("value") || "";
                                t.onAfterSelected(curData, newValue, oldValue);
                            }
                            common.stopBubble();
                            jqUl.hide();
                        });
                        jqUl.append(jqLi);
                        var jqOption = $("<option></option>").attr({"value": item[value]}).text(item[text]);
                        t.target.append(jqOption);
                    });

                    if (initValue) {
                        t.target.val(initValue);

                    } else {
                        initValue = t.target.find("option:eq(0)").attr("value");
                        var initText = t.target.find("option:eq(0)").text();
                        t.target.val(initValue);
                        t.target.closest(".simulate-select").find(".text").text(initText);
                    }

                    t._setHasLoad();
                    if (typeof(callback) == "function") {
                        callback();
                    }
                }
            });
        }
    };
    mxSelect.prototype._loadLocalData = function () {
        var t = this;

        if (!t._hasLoad) {


            if (t.data && t.data.length > 0) {

                t.target.closest(".simulate-select").find("ul").empty();
                t.target.empty();
                var value = t.value;
                var text = t.text;
                $.each(t.data, function (index, item) {
                    var jqUl = t.target.closest(".simulate-select").find("ul");
                    var jqLi = $("<li></li>").data("itemInfo", item).attr({"value": item[value]}).addClass("simulate-select-list").text(item[text]).on("click", function () {

                        var oldValue = t.target.val() || "";
                        t.bindValue(item[value], "value");
                        if (typeof(t.onAfterSelected) == "function") {
                            var curData = $(this).data("itemInfo");
                            var newValue = $(this).attr("value") || "";
                            t.onAfterSelected(curData, newValue, oldValue);
                        }
                        common.stopBubble();
                        jqUl.hide();
                    });
                    jqUl.append(jqLi);
                    var jqOption = $("<option></option>").attr({"value": item[value]}).text(item[text]);
                    t.target.append(jqOption);
                    t.target.val("");
                })


            } else {
                /*从界面上取值*/
                $.each(t.target.find("option"), function (index, item) {
                    var jqUl = t.target.closest(".simulate-select").find("ul");
                    var jqLiPre = $("<li></li>").addClass("simulate-select-list").attr("value", $(item).attr("value")).text($(item).text()).on("click", function () {
                        var oldValue = t.target.val();
                        t.bindValue(item.getAttribute("value"), "value");
                        if (typeof(t.onAfterSelected) == "function") {
                            if (typeof(t.onAfterSelected) == "function") {
                                var curData = $(this).data("itemInfo");
                                var newValue = $(this).attr("value") || "";
                                t.onAfterSelected(curData, newValue, oldValue);
                            }
                        }
                        common.stopBubble();
                        jqUl.hide();
                    });
                    jqUl.append(jqLiPre);
                })
            }
            t._setHasLoad();
        }
    }
    mxSelect.prototype._show = function () {
        this.target.closest(".simulate-select").find("ul").show();
    }
    mxSelect.prototype._setHasLoad = function () {
        this._hasLoad = true;
        this.isApply = true;
    }
    mxSelect.prototype.isReadOnly = false;
    mxSelect.prototype.setReadOnly = function (isBoolen) {
        this.isReadOnly = isBoolen ? true : false;
        if (isBoolen) {
            this.target.closest(".simulate-select").find(".text").css({background: "#f3f3f3"});
        } else {
            this.target.closest(".simulate-select").find(".text").css({background: "#fff"});
        }

    };

    mxSelect.prototype.bindValue = function (value, type) {
        var t = this;
        var v = null;
        switch (type) {
            case "text":
                t.target.find("option").each(function () {
                    if ($(this).text() == value) {
                        v = $(this).attr("value");
                    }
                });
                break;
            case "value":
                v = value;
                break;
            default:
                v = t.target.find("option:eq('" + value + "')").attr("value");
                break;
        }
        t.target.val(v);

        var text = t.target.find("option:selected").text();
         t.target.closest(".simulate-select").find(".text").text(text);
    };
    mxSelect.prototype.reset = function (param) {
        if (param["data"] && param["data"].length > 0) {
            this.data = param["data"];
        }
        this.ajaxParam = $.extend(true, {}, this.ajaxParam, param["ajaxParam"] || {});
        this._hasLoad = false;
        this.isApply = false;
        if (!this.localData) {
            this._bindPre();
        } else {
            this._loadData();
        }
    };

    //select 选择封装
    $.fn.select = function (options) {
        var internal = {
            selectValue: "",//选中的值
            preText: null,//提示显示内容（--请选择--）
            defaultOptions: {
                initLoad: false,
                defaultValue: '',
                selectIndex: 0,
                name: '',
                display: '',
                localData: false,//是否本地数据
                ajaxParam: {
                    type: "post",
                    url: '',//url 请求的地址
                    data: {},
                    success: function (data) {
                    }
                },
                renderData: function (data) {
                    return data.result.rows;
                },
                value: '',//值
                text: '',//展示的内容
                rows: 6,//显示几行，如果超过的则出现滚动条，如果少于不影响
                //选择后事件
                onAfterSelected: null// function (data, newValue, oldValue) {}
            },
            //方法
            method: {
                //重置
                reset: function (self, param) {
                    self["param"] = $.extend(true, {}, self["param"], param || {});
                    internal.reset(self);
                }
            },
            //插件使用
            init: function (self) {
                internal.render(self);
            },
            //渲染插件
            render: function (self) {
                var name = self["param"]["name"], display = self["param"]["display"];
                if (!internal.preText) {
                    internal.preText = $(self).find("ul li:first-child").text();
                }
                $('select[name="' + name + '"]').on("setValue", function (event, argument) {
                    if (argument[name] === 0) {
                        argument[name] = "0";
                    }
                    internal.selectValue = argument[name] || "";
                    var jqSelect = $('select[name="' + name + '"]');

                    if (self["param"]["localData"]) {
                        $(self).find("span").text($(jqSelect).find("option:selected").text());
                        if ((!argument[name] && argument[name] != 0 && internal.preText) || argument[name] == "") {
                            $(self).find("span").text(internal.preText);
                        }
                    } else {
                        $(self).find("span").text(argument[display]);
                        if (!argument[display] && internal.preText) {
                            $(self).find("span").text(internal.preText);
                        }
                        var jqOptions = $("<option></option>").attr({"value": argument[name]}).text(argument[display]);
                        jqSelect.append(jqOptions);
                        jqSelect.val(argument[name]);

                    }
                });
                if (self["param"]["initLoad"]) {
                    var jqUl = $(self).find("ul"), jqSelect = $('select[name="' + name + '"]');
                    jqUl.empty();
                    jqSelect.empty();
                    if (internal.preText) {
                        var jqLi = $("<li></li>");
                        jqLi.addClass("simulate-select-list")
                            .text(internal.preText);
                        jqUl.append(jqLi);
                        var jqOptions = $("<option></option>");
                        jqOptions.text(internal.preText);
                        jqSelect.append(jqOptions);
                    }
                    if (typeof (self["param"]["ajaxParam"]["data"]) == "function") {
                        self["param"]["ajaxParam"]["data"] = self["param"]["ajaxParam"]["data"]();
                    }
                    internal.req(self["param"], function (data) {
                        data = self["param"]["renderData"](data);
                        var value = self["param"]["value"];
                        var text = self["param"]["text"];
                        $.each(data, function (index, item) {
                            var jqLi = $("<li></li>").data("itemInfo", item);
                            jqLi.attr({"value": item[value]})
                                .addClass("simulate-select-list")
                                .text(item[text]);
                            jqUl.append(jqLi);
                            var jqOptions = $("<option></option>");
                            jqOptions.attr({value: item[value]})
                                .text(item[text]);
                            jqSelect.append(jqOptions);
                        });
                        internal.selectValue = self["param"]["defaultValue"];
                        $(jqSelect).val(internal.selectValue);
                        if (internal.selectValue && internal.selectValue.length > 0) {
                            var text = $(jqSelect).find("option:selected").text();
                            self["param"]["onAfterSelected"]({}, internal.selectValue, "");
                            $(self).find("span").text(text);
                        } else {
                            var selectIndex = self["param"]["selectIndex"];
                            $(jqSelect).get(0).selectedIndex = selectIndex;
                            var text = $(jqSelect).find("option:selected").text();
                            self["param"]["onAfterSelected"]({}, $(jqSelect).val(), "");
                            $(self).find("span").text(text);
                        }
                        self.isLoadData = true;
                        $(jqUl).find("li").on("click", function () {
                            var jqLi = $(this);
                            var oldValue = jqSelect.val();
                            internal.selectValue = $(this).attr("value") || "";
                            var newValue = $(this).attr("value") || "";
                            $(self).find("span").text($(this).text());
                            $(jqSelect).val(internal.selectValue);
                            if (typeof(self["param"]["onAfterSelected"]) == "function") {
                                var itemInfo = jqLi.data("itemInfo");
                                self["param"]["onAfterSelected"](itemInfo, newValue, oldValue);
                            }
                        });
                        self.isFirstReset = false;


                    });
                }
                $(self).on("click", function (e) {
                    common.stopBubble();
                    var jqUl = $(self).find("ul"), jqSelect = $('select[name="' + name + '"]');
                    if (self["param"]["localData"] && !self.isLoadData) {
                        self.isLoadData = true;
                        $(jqUl).find("li").on("click", function () {
                            // common.stopBubble();
                            internal.selectValue = $(this).attr("value") || "";
                            $(self).find("span").text($(this).text());
                            var oldValue = jqSelect.val();
                            $(jqSelect).val(internal.selectValue);
                            var jqLi = $(this);

                            internal.selectValue = $(this).attr("value") || "";
                            var newValue = $(this).attr("value") || "";
                            $(self).find("span").text($(this).text());
                            $(jqSelect).val(internal.selectValue);
                            if (typeof(self["param"]["onAfterSelected"]) == "function") {
                                self["param"]["onAfterSelected"](null, newValue, oldValue);
                            }
                        });
                    } else {
                        //从服务端请求的数据处理方式
                        if (!(self.isLoadData) || self.isFirstReset) {
                            jqUl.empty();
                            jqSelect.empty();
                            if (internal.preText) {
                                var jqLi = $("<li value=''></li>");
                                jqLi.addClass("simulate-select-list")
                                    .text(internal.preText);
                                jqUl.append(jqLi);
                                var jqOptions = $("<option value=''></option>");
                                jqOptions.text(internal.preText);
                                jqSelect.append(jqOptions);
                            }
                            if (typeof (self["param"]["ajaxParam"]["data"]) == "function") {
                                self["param"]["ajaxParam"]["data"] = self["param"]["ajaxParam"]["data"]();
                            }
                            internal.req(self["param"], function (data) {
                                data = self["param"]["renderData"](data);
                                var value = self["param"]["value"];
                                var text = self["param"]["text"];
                                $.each(data, function (index, item) {
                                    var jqLi = $("<li></li>").data("itemInfo", item);
                                    jqLi.attr({"value": item[value]})
                                        .addClass("simulate-select-list")
                                        .text(item[text]);
                                    jqUl.append(jqLi);
                                    var jqOptions = $("<option></option>");
                                    jqOptions.attr({value: item[value]})
                                        .text(item[text]);
                                    jqSelect.append(jqOptions);
                                });
                                $(jqSelect).val(internal.selectValue);
                                self.isLoadData = true;
                                self.isFirstReset ? jqSelect.val("") : "";
                                $(jqUl).find("li").on("click", function () {
                                    var jqLi = $(this);
                                    var oldValue = jqSelect.val();
                                    internal.selectValue = $(this).attr("value") || "";
                                    var newValue = $(this).attr("value") || "";
                                    $(self).find("span").text($(this).text());
                                    $(jqSelect).val(internal.selectValue);
                                    var vaildform = common.vaildform(null, true);
                                    if (vaildform && $(jqSelect).attr("datatype")) {
                                        vaildform.check(false, jqSelect);
                                    }
                                    if (typeof(self["param"]["onAfterSelected"]) == "function") {
                                        common.stopBubble();
                                        var itemInfo = jqLi.data("itemInfo");
                                        self["param"]["onAfterSelected"](itemInfo, newValue, oldValue);

                                    }
                                });
                                self.isFirstReset = false;
                            });
                        }
                    }
                    if (jqUl.is(":hidden")) {
                        jqUl.show();
                    } else {
                        jqUl.hide();
                    }
                });
                $(document).on("click", function () {
                    $(self).find("ul").hide();
                });
                $(self).hover(null, function () {
                    //兼容FF
                    function setHide() {
                        if (!$(self).find("ul").is(":hidden")) {
                            $(self).find("ul").hide();
                        }
                        if (timer) {
                            clearInterval(timer);
                        }

                    }

                    var timer = setInterval(setHide, 100);
                    $("ul", $(self)).hover(
                        function () {
                            clearInterval(timer);
                        }, null
                    );
                });
            },
            reset: function (self) {
                self.isFirstReset = true;
                var name = self["param"]["name"];
                var display = self["param"]["display"];
                var jqUl = $(self).find("ul");
                var jqSelect = $('select[name="' + name + '"]');
                self.preText = $(self).find("ul li:first-child").text();
                $(self).find("span").text(self.preText);
                jqSelect.val("");
                jqSelect.empty();
                jqUl.empty();
                var jqLi = $("<li></li>");
                jqLi.addClass("simulate-select-list").text(self.preText);
                jqUl.append(jqLi);
                var jqOptions = $("<option></option>").text(self.preText);
                jqSelect.append(jqOptions);

                if (typeof (self["param"]["onAfterSelected"]) == "function") {
                    self["param"]["onAfterSelected"](null, "newValue", "oldValue");
                }
            },

            //ajax请求
            //need reuqest.js
            req: function (options, callback) {
                options = $.extend(true, {}, options);
                options["ajaxParam"]["isTip"] = false;
                options["ajaxParam"]["async"] = true;
                options["ajaxParam"]["success"] = function (data) {
                    if ($.isFunction(callback) && data.isSuccess) {
                        callback(data);
                    }
                }
                var url = options["ajaxParam"]["url"]
                var req = new Request(url);
                $.each(options["ajaxParam"], function (index, item) {
                    if (index == "url") {
                        delete  options["ajaxParam"]["url"];
                    }
                })
                if (options["ajaxParam"]["type"] == "get") {
                    req.get(options["ajaxParam"]);
                } else {
                    req.post(options["ajaxParam"]);
                }
            }
        }
        var target = this;
        $(target).each(function () {
            var self = this;
            self.param = $.extend(true, {}, internal.defaultOptions, options);
            internal.init(self);
            target.reset = function (param) {
                internal.method.reset(self, param);
            }
        });
        return target;
    }
    //jqSelect 封装
    $.fn.jqSelect = function (options) {
        var defaultOptions = {
            width: 190,
            maxHeight: null,
            initLoad: false,//初始化加载
            preText: '',//提示显示内容（--请选择--）
            preValue: '',//提示显示内容对应的值（一般为空）
            localData: false,//是否本地数据，本地数据不考虑异步加载
            data: [],//本地数据来源，如果本地数据是空，则从界面中解析
            name: 'value',
            display: 'text',//
            isApply : false, //避免重复请求数据
            ajaxParam: {
                type: "post",
                url: '',//url 请求的地址
                data: {}
            },
            renderData: function (data) {
                return data.result.rows || [];
            },
            value: 'value',//值
            text: 'text',//展示的内容
            //选择后事件
            onAfterSelected: null// function (data, newValue, oldValue) {}
        };
        options = $.extend(true, {}, defaultOptions, options);
        var t = $(this);
        $(t).hide();
        var __mxSelect = new mxSelect(t, options);
        return __mxSelect;
    }
})();