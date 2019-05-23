;define(function (require, exports) {
    ;'use strict';

    //param check
    var buildLigerParamCheck = function (fnWay, target, param, fn) {

        if (undefined == target) {
            console.error("sorry, the builder.js builderLigerTree param named [target] is can not be undefined.");
            return;
        }

        //todo.. delete Timeout
        setTimeout(function () {
            if (undefined == target["ligerTree"]) {
                console.error("sorry, can not load ligerTree .");
                return;
            }
            fnWay();

            //callback
            if (fn != undefined && "function" == typeof fn) {
                fn();
            }
        }, 100);
        //todo.. add css
    };

    var builder = {
        buildLigerTree: function (target, param, fn) {
            // return buildLigerParamCheck(function () {
            //     target.ligerTree(param);
            // }, target, param, fn);
            setTimeout(function () {
               ;
            },200);
            return target.ligerTree(param);
        },
        buildLigerGrid: function (target, param, fn) {
            return buildLigerParamCheck(function () {
                target.ligerGrid(param);
            }, target, param, fn)
        },
        buildToolBar: function (tools, target, param, fn) {
            return buildLigerParamCheck(function () {
                //listTools
                for (var item in param) {
                    if (!tools[item]) {
                        console.warn("sorry, the tools you config is not find.");
                        continue;
                    }
                    if ("function" == typeof tools[item]["event"]) {
                        var $thisButton = $(tools[item]["show"]);
                        tools[item]["event"]($thisButton, param[item]);
                        $thisButton.appendTo(target);
                    }
                }

            }, target, param, fn);
        },
        buildLineTools: function (tools, $target, param, fn) {
            for (var item in param) {
                if (!tools[item]) {
                    console.warn("sorry, the tools you config is not find.");
                    continue;
                }
                if ("function" == typeof tools[item]["event"]) {
                    var $thisButton = $(tools[item]["show"]);
                    tools[item]["event"]($thisButton, param[item]);
                    $thisButton.appendTo($target);
                }
            }
            if ('function' == typeof fn) {
                fn();
            }
        }
    };

    exports.builder = builder;
});