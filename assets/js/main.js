//this js is main entry
;(function (window) {

    //config sea js
    seajs.config({
        // 别名配置
        alias: {

            //base
            'jq': '{dir}base/jquery-1.11.0.min',
            'vue': '{dir}base/vue.v2.6.9',

            //base-plugins
            'sea-preload': '{dir}base.extends/sea-preload',
            'sea-css': '{dir}base.extends/sea-css',
            'sea-text': '{dir}base.extends/sea-text',
            //'vue-route': '{dir}base-plugins/vue-route.v0.7.10',


            //react use
            'babel': '{dir}plugins/browser.min',
            'rt': '{dir}base/react-15.3.1.min',
            'rt-dom': '{dir}base.extends/rt-dom-15.3.1.min',
            'rt-addons': '{dir}base.extends/rt-with-addons-0.13.3',


            //rq plugins
            'rq-domReady': '{dir}base.extends/rq-domReady-2.0.1',
            'rq-css': '{dir}base.extends/rq-css.min',

            //rq jsx need
            'rq-jsx': '{dir}base.extends/rq-jsx',
            'rq-text': '{dir}base.extends/rq-text-2.0.13',
            'rq-JSXTransformer': '{dir}base.extends/rq-JSXTransformer-0.13.3',

            //aid third use
            'sg': '{dir}aid/superagent.min'
        },
        //根路径
        base: window["jsRoot"],
        // 变量配置
        vars: {
            'dir': window["jsRoot"],
            'staticDir': window["jsRoot"]
        },
        // 路径配置
        paths: {
            'modules': '{dir}'
        },
        // preload: [
        //     'jq',
        //     'sea-css',
        //     'sea-text'
        //     //'seajs-log'
        // ],
        // 调试模式，测试环境开启
        debug: false,
        // 文件编码
        charset: 'utf-8',
        //版本管理
        map: [[/^(.*\.(?:css|js))(.*)$/i, '$1?version=' + Math.random()]]  //map,批量更新时间戳
    });

    //after dom loaded.
    seajs.use(['sea-css', 'sea-text', 'jq'], function () {
        $(function () {
            if(!window["bizPath"] || 0 == window["bizPath"].length){
                window["bizPath"] = "biz/login/index";
            }
            var bizScript = '{dir}' + window["bizPath"];
            seajs.use(['{dir}com', '{dir}aid/ajaxApiTemp'], function () {
                seajs.use(bizScript);
            });
        });
    });
})(window);