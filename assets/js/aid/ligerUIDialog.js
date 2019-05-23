/*
 * @Author : leaf.fly
 * @Create : 2019-03-19
 * @Desc : this is js for get data from parent window with liger ui
 * @Version : v1.0.0.20190319
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports, module) {
    ;'use strict';

    if (!frameElement || !frameElement.dialog) {
        console.error("sorry, this page have no frameElement or frameElement.dialog, please check it open by ligerUI dialog.");
        return;
    }

    var data = frameElement.dialog.get("data");
    if (!data) {
        console.error("sorry, this page can not find the param [data] from parent page");
        return;
    }
    exports.data = data;
});