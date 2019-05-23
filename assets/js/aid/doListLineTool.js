/**
 * @Author : leaffly
 * @Create : 2019-04-10
 * @Version : v1.0.0.20190410
 * @Desc : this is js about line tool
 */
;define(function (require, exports, module) {
    ;'use strict';
    var lineTools = require('{dir}aid/listTools')["listTools"];
    var builder = require('{dir}aid/builder')["builder"];

    exports.doListLineTool = function (targetId, param, fn) {

        if (!targetId) {
            console.error("sorry, the doListLineTool you invoke is can not empty targetId.");
            return;
        }

        var fnTimeOut = function () {
            setTimeout(function () {
                var $target = $("#" + targetId);
                if (0 == $target.length) {
                    fnTimeOut();
                    return;
                }
                $target.html("");
                builder["buildLineTools"](lineTools, $target, param, fn);
            }, 300)
        };
        fnTimeOut();
    }
});