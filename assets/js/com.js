//this js load command
;define(function (require) {
    ;'use strict';

    seajs.use([

        //region global css for website
        //'{dir}../css/base/lockScreen.css',

        //endregion

        //region  extend plugins
        '{dir}base.extends/jq-cookie',
        '{dir}base.extends/jq-form.v3.50.0',
        '{dir}base.extends/jq-validform.5.3.2',

        //endregion

        //region self
        '{dir}aid/prototype',
        '{dir}aid/guid',
        '{dir}aid/base64',
        '{dir}aid/extender',


        //endregion

        //region third
        //ligerui
        //'{dir}aid/prototype',
        //'{dir}../_mix/ligerui/V1.3.2/js/ligerui.all.buff',
        //'{dir}../_mix/ligerui/V1.3.2/js/ligerui.all',
        //'{dir}../_mix/ligerui/V1.3.2/skins/Aqua/css/ligerui-all.css',
        //'{dir}../_mix/ligerui/V1.3.2/skins/Gray/css/all.css',

        //ztree
        //'{dir}../_mix/ztree/V3.5/js/jquery.ztree.all-3.5',
        //'{dir}../_mix/ztree/V3.5/css/zTreeStyle/zTreeStyle.css'


        //endregion
    ]);
});