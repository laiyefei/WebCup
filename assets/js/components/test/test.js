;define(function (require, exports, module) {

    var temp = require('{dir}components/test/test.html');


    var test = {
        data: {
            message: ''
        },
        template: temp,
        // components: {
        //     "index": {
        //         template: "<h1>test index</h1>"
        //     }
        // }
    };

    //register
    Vue.component('test', test);
    exports.test = test;
});