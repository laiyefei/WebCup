/*
 * @Author : leaf.fly
 * @Create : 2019-03-15
 * @Desc : this is js manage components
 * @Version : v1.0.0.20190315
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports, module) {
    ;'use strict';
    module.exports = function (param, callBack) {
        require('{dir}aid/extender');
        seajs.use(['vue'], function () {
            if (!window["extender"]) {
                window["extender"] = {};
            }
            window["extender"]["vue"] = {};
            //require its
            seajs.use(['{dir}components/mytext/mytext',
                    '{dir}components/myselect/myselect',
                    '{dir}components/choose/choose',
                    '{dir}components/myswitch/vueswitch/myswitch',
                    '{dir}components/addressselect/addressselect'],
                function (fnMyText, fnMySelect, fnChoose, fnMySwitch, fnAddressSelect) {

                    window["extender"]["vue"]["components"] = {};

                    fnMyText(param);
                    fnMySelect(param);
                    fnChoose(param);
                    fnMySwitch(param);
                    fnAddressSelect(param);

                    //create this instance
                    var app = new Vue({
                        el: '#app'
                    });

                    if ('function' == typeof callBack) {
                        callBack();
                    }
                });
        });
    }
});