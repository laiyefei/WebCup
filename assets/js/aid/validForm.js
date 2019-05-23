/*
 * @Author : leaf.fly
 * @Create : 2019-03-15
 * @Desc : this js is for check form
 * @Version : v1.0.0.20190315
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports, module) {
    ;'use strict';

    //use init need
    module.exports = function (param, fn) {
        seajs.use([
            '{dir}../css/aid/validateform.css',
            '{dir}../css/aid/layout.css',
            '{dir}base-plugins/jq-form.v3.50.0',
            '{dir}base-plugins/jq-validate.min.v1.14.0',
            "{dir}base-plugins/jq-metadata",
            '{dir}aid/validForm.msg'], function () {
            var formId = "myFormId_" + new Date().getTime();
            var ok = false;
            seajs.use(['{dir}components/_manager'], function (fnInner) {
                fnInner(param, function () {
                    var $form = $("form");
                    $form.attr("id", formId);
                    $form.attr("autocomplete", "off");


                    //开启验证
                    // $form.validate({
                    //     submitHandler: function (form) {
                    //         $(form).ajaxSubmit();
                    //     }
                    // });
                    $form.validate({
                        debug: true//不提交表单
                    });
                    $form.submit(function (data) {
                        if (!data["result"]) {
                            return false;
                        }
                        ok = true;
                    });


                    // $("<input type=\"text\" style=\"width:0;height:0;display: none\"/>" +
                    //     "<input type=\"password\" style=\"width:0;height:0;display: none\"/>").insertBefore($form.find("*").first());
                    //$form.find("input").attr("autocomplete", "new-password");
                    //$form.find("input").attr("autocomplete", "off");
                    //var $inputs = $form.find("input");
                    // $inputs.each(function () {
                    //     var $this = $(this);
                    //     //$this.attr("class", "{required:true}");
                    //     // if ($this.attr("type") == "password") {
                    //     //     $("<input type=\"password\" style=\"width:0;height:0;display: none\"/>").insertBefore($this);
                    //     // }
                    // });
                    if ('function' == typeof fn) {
                        fn(formId);
                    }
                });
            });
            window["extender"]["form"] = {
                push: function (url, beforeNoAllow, success, error) {
                    var $form = $("#" + formId);
                    if (0 == $form.length) {
                        console.error("sorry, this form is not runned after vue.");
                        return false;
                    }

                    $form.submit();

                    if (!ok) {
                        if ("function" == typeof beforeNoAllow) {
                            beforeNoAllow({
                                msg: "校验出错，字段校验未通过！"
                            });
                        }
                        return false;
                    }

                    $form.ajaxSubmit({
                        //target: "#" + formId,
                        url: url,
                        type: "POST",
                        success: function (data) {
                            if ("string" == typeof data) {
                                data = eval("(" + data + ")");
                            }
                            if (data["ok"]) {
                                if ("function" == typeof success) {
                                    success(data);
                                }
                            } else {
                                if ("function" == typeof error) {
                                    error(data);
                                }
                            }
                        },
                        error: function (data) {
                            if ("string" == typeof data) {
                                data = eval("(" + data + ")");
                            }
                            if ("function" == typeof error) {
                                error(data);
                            }
                        }
                    })
                }
            };
        });
    }

});