/**
 * the interface param
 */
;define(function (require, exports, module) {

    exports.IMySwitch = {
        props: [
            'id',
            'require',
            'colspan',
            "targetfield",
            "tablecode",
            'fieldname',
            'fieldcode',
            'savecode',
            'changeable',
            "show",
            "url"
        ]
    };
});