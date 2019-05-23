;define(function (require, exports, module) {

    var temp = require('{dir}components/mydatatext/mydatatext.html');
    var mydatatext = {
        props: [
            'require',
            'column_number',
            'fieldname'
        ],
        data: function () {
            this["column_number"] = "column-" + num[this["column_number"] - 1].name;
        },
        template: temp
    };

    var num = [{name: "one"}, {name: "two"}, {name: "three"}];
    //register
    Vue.component('mydatatext', mydatatext);
    exports.text = text;
});