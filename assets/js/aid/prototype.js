;(function () {
    ;'use strict';

    //adder : leaffly
    String.prototype.tempRender = function render(context) {
        // 准备正则 匹配至少一个 字母
        // 正则的 开始是 {{  结束是 }}
        // 中间的 小括号 可以对 正则 筛选出来的 字符串 再次筛选
        var reg = /{{(\w+)}}/;
        // 准备挖好坑的字符串
        var template = this;
        // 准备 用来填坑的 对象
        var context = context;
        // 首先 使用正则对象 验证一次 字符串 while 会看 result 是否有值
        // 这一次 找到的 有两个值
        /*
            第一个  {{href}} 索引为0
            第二个 href  索引为1,小括号找到的
        */
        var result;
        while (result = reg.exec(template)) {
            //console.log(result);// 0:{{href}} 1:href
            // 获取 匹配的 key(href)
            var key = result[1];
            // 通过key 获取value
            var value = context[key];
            // 替换  替换的是 {{href}}
            template = template.replace(result[0], value);
        }
        // 执行完毕
        return template;
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    //向前推N周，考虑跨年周，返回结果数组：
    //结果：[0,1]   索引0所在的值为当前周所在的日期；索引1所在的值为当前周所在年份的的几周
    //参数num为往前推几周
    //参数type：0代表返回周的第一天，1代表返回周的最后一天
    Date.prototype.weekBefore = function (num, type) {

    };

    //截取长度
    String.prototype.cut = function (strLength, cutLenght) {
        if (this.length > strLength) {
            return this.substring(0, cutLenght) + "...";
        } else {
            return this;
        }
    };


    /**
     * 获取字符串字节长度 中文2 英文1
     * author by HL on 2017/7/5
     * modify by HL on 2017/7/5
     */
    String.prototype.gblen = function () {
        return this.replace(/[\u4e00-\u9fa5]/g, "aa").length;
    };


    String.prototype.xml2Object = function () {
        var xmlObj;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlObj = parser.parseFromString(this, "text/xml");
        } else {
            xmlObj = new ActiveXObject("Microsoft.XMLDOM");
            xmlObj.async = "false";
            xmlObj.loadXML(this);
        }
        return xmlObj;
    };

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;

    };

    Date.prototype.Add = function (interval, number) {
        switch (interval) {
            case 's':
                return new Date(Date.parse(this) + (1000 * number));
            case 'm':
                return new Date(Date.parse(this) + (60000 * number));
            case 'h':
                return new Date(Date.parse(this) + (3600000 * number));
            case 'd':
                return new Date(Date.parse(this) + (86400000 * number));
            case 'w':
                return new Date(Date.parse(this) + ((86400000 * 7) * number));
            case 'M':
                return new Date(this.getFullYear(), (this.getMonth()) + number, this.getDate());
            case 'q':
                return new Date(this.getFullYear(), (this.getMonth()) + number * 3, this.getDate());
            case 'y':
                return new Date((this.getFullYear() + number), this.getMonth(), this.getDate());
        }
    };

    Date.prototype.AddSecond = function (number) {
        return this.Add("s", number);
    };
    Date.prototype.AddMinute = function (number) {
        return this.Add("m", number);
    };
    Date.prototype.AddHour = function (number) {
        return this.Add("h", number);
    };
    Date.prototype.AddDay = function (number) {
        return this.Add("d", number);
    };
    Date.prototype.AddWeek = function (number) {
        return this.Add("w", number);
    };
    Date.prototype.AddMonth = function (number) {
        return this.Add("M", number);
    };
    Date.prototype.AddQuarter = function (number) {
        return this.Add("q", number);
    };
    Date.prototype.AddYear = function (number) {
        return this.Add("y", number);
    };
})();