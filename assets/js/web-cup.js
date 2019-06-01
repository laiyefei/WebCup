//this js is the entry
;(function (window) {
    'use strict';
    var rhin = {
        init: function () {
            var oTagHeads = window.document.getElementsByTagName('head');
            if (oTagHeads.length == 0) {
                window.console.warn('sorry, you can not detect the head tag, in order to standardize the HTML document flow, please add the head tag, or you can not use full use this js');
                return;
            }
            var oHead = oTagHeads[0];
            //find all scripts from oHead
            var allScripts = oHead.getElementsByTagName('script');
            var jsroot;//have / to easy set path
            for (var ish = 0; ish < allScripts.length; ish++) {
                var sSrc = allScripts[ish].getAttribute('src');
                if (!sSrc) continue;
                var iIndexLast = sSrc.lastIndexOf('/');
                if (sSrc && sSrc.substr(iIndexLast + 1).toLowerCase() == 'web-cup.js') {
                    jsroot = sSrc.substring(0, iIndexLast + 1);
                }
            }
            if (!jsroot) {
                window.console.warn('sorry, can not find the jsroot in the document, please check this js is in the head tag and it named sherlock.js');
                return;
            }

            window["jsRoot"] = jsroot;

            //create sea
            rhin.createEleTag(oHead, {
                'tagname': 'script',
                'type': 'text/javascript',
                'src': jsroot + 'base/sea-debug.2.3.0.min.js',
                // 'defer': 'defer',
                'async': 'false',
                // 'data-main': jsroot + 'config'
            });

            var afterHaveSea = function () {
                setTimeout(function () {

                    if (undefined == typeof seajs) {
                        afterHaveSea();
                        return;
                    }

                    //create config
                    rhin.createEleTag(oHead, {
                        'tagname': 'script',
                        'type': 'text/javascript',
                        'src': jsroot + 'main.js',
                        'defer': 'defer',
                        'async': 'false'
                    });
                    var bizScript = location.pathname.substr(1);//location.href.substr(location.href.indexOf('/') + 1);
                    // bizScript = bizScript.substr(0, bizScript.lastIndexOf('.'));
                    window["bizPath"] = bizScript;
                    // rhin.createEleTag(oHead, {
                    //     'tagname': 'script',
                    //     'type': 'text/javascript',
                    //     'src': jsroot + bizScript + '.js',
                    //     'defer': 'defer',
                    //     'async': 'false'
                    // });
                }, 100)
            };
            afterHaveSea();
        },
        createEleTag: function (oEl, oTagInfo) {
            //first see condition
            if (!oEl || !oTagInfo || 'object' !== rhin.type.get(oTagInfo) || !oTagInfo['tagname']) {
                window.console.error('sorry, the function createEleTag was be used with wrong params !');
                return;
            }
            //create
            var oTag = window.document.createElement(oTagInfo['tagname']);
            var fnfdos = [];
            for (var item in oTagInfo) {
                if ('childinfo' == item
                    && rhin.judg.isObject(oTagInfo[item])) {
                    //if(oTagInfo[item] instanceof Array)
                    //Array.isArray()	IE9+, Firefox 4+, Safari 5+, Opera 10.5+ chrome
                    //Object.prototype.toString.call(o) === '[object Array]'
                    if (oTagInfo[item].constructor === Array) {
                        for (var i = 0; i < oTagInfo[item].length; i++) {
                            rhin.createEleTag(oTag, oTagInfo[item][i]);
                        }
                    }
                } else if ('tagname' != item
                    && 'childinfo' != item) {
                    if ('string' === rhin.type.get(oTagInfo[item])) {
                        if ('innerHTML' == item) {
                            oTag.innerHTML = oTagInfo[item];
                        } else {
                            oTag.setAttribute(item, oTagInfo[item]);
                        }
                    } else if (rhin.judg.isFunction(oTagInfo[item])) {
                        if ('fnfdo' == item) {
                            fnfdos.push(oTagInfo[item]);
                        } else {
                            if (oTag.addEventListener) {
                                oTag.addEventListener(item.indexOf('on') == 0 ? item.substr(2) : item, oTagInfo[item], false);
                            } else if (oTag.attachEvent) {
                                oTag.attachEvent(item.indexOf('on') == 0 ? item : 'on' + item, oTagInfo[item]);
                            }
                            //if the function is define by myself it will set to object as attribute
                            oTag[item] = oTagInfo[item];
                        }
                    } else if (rhin.judg.isObject(oTagInfo[item])) {
                        oTag[item] = oTagInfo[item];
                    }
                }
            }
            oEl.appendChild(oTag);
            if (fnfdos.length > 0) {
                for (var ifn = fnfdos.length - 1; ifn >= 0; ifn--) {
                    fnfdos[ifn]();
                }
            }
            //prevent memory leak
            oTag = null;
        },
        type: {
            FRCLASS: {
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object String]': 'string',
                '[object Function]': 'function',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object RegExp]': 'regexp',
                '[object Object]': 'object',
                '[object Error]': 'error',
                '[object Symbol]': 'symbol'
            },
            get: function (obj) {
                //if undefined return undefined to string
                if (obj == null) {
                    return String(obj);
                }
                //if easy object return sample, or return the type from FRCLASS
                return rhin.type.FRCLASS[String.call(obj)] || typeof obj;
            }
        },
        judg: {
            documentIsHTML: true,
            support: {
                'sortStable': false,
                'detectDuplicates': false,
                'attributes': true,
                'getElementsByTagName': true,
                'getElementsByClassName': true,
                'getById': true,
                'qsa': true,
                'matchesSelector': true,
                'disconnectedMatch': true,
                'sortDetached': true
            },
            isBrowserType: function (sType) {
                //depart param first
                if (rhin.type.get(sType) !== 'string') {
                    window.console.error('sorry, the function of sherlock.judg must need the param of string');
                    return false;
                }
                var Sys = {}, ua = navigator.userAgent.toLowerCase(), s, sKeyType = sType.toUpperCase(),
                    ob_reg = rhin.cstan.b_reg[sKeyType];
                if (rhin.judg.isArray(ob_reg)) {
                    for (var i = 0; i < ob_reg.length; i++) {
                        if ((s = ua.match(ob_reg[i]))) {
                            Sys[sType] = s[1];
                        }
                    }
                } else if ((s = ua.match(ob_reg))) {
                    Sys[sType] = s[1];
                }
                return Sys[sType];
            },
            isWindow: function (obj) {
                return obj != null && obj === obj.window;
            },
            isArray: function (obj) {
                return Array.isArray(obj);
            },
            isArrayLike: function (obj) {
                //support: real ios 8.2 only
                var length = !!obj && 'length' in obj && obj.length, type = rhin.type.get(obj);
                if (type === 'function' || rhin.judg.isWindow(obj)) {
                    return false;
                }
                return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
            },
            isFunction: function (obj) {
                return rhin.type.get(obj) === 'function';
            },
            isPlainObject: function (obj) {
                //think it sample first
                if (!obj || toString.call(obj) !== '[object Object]') {
                    return false;
                }
                //declare the variable
                var oPro, fnCtor;
                //if it not have prototype, it will be plain object
                if (!oPro) {
                    return true;
                }
                //the ctor function think
                fnCtor = window.hasOwnProperty(oPro, 'constructor') && oPro.constructor;
                return typeof fnCtor === 'function' && toString.call(fnCtor) === '[object Function]';
            },
            isObject: function (obj) {
                return rhin.type.get(obj) === 'object';
            },
            contains: function (a, b) {
                if (!a || !b) {
                    window.console.error('sorry, the arguments of sherlock.contains is can not be empty ! ');
                    return false;
                }
                var adown = a.nodeType === 9 ? a.documentElement : [], bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (
                    adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            },
            inArray: function (ele, arr, i) {
                return arr == null ? -1 : indexOf.call(arr, ele, i);
            },
            isXMLDoc: function (elem) {
                //documentElement is verified for cases where it doesn't yet exist (such as loading iframe in ie)
                var oDocElem = elem && (elem.ownerDocument || elem).documentElement;
                return oDocElem ? oDocElem.nodeName !== 'HTML' : false;
            }
        },
        cstan: {
            b_reg: {
                'IE': [/rv:([\d.]+)\) like gecko/, /msie ([\d.]+)/],
                'FIREFOX': /firefox\/([\d.]+)/,
                'CHROME': /chrome\/([\d.]+)/,
                'OPERA': /opera.([\d.]+)/,
                'SAFARI': /version\/([\d.]+).*safari/
            }
        }
    };

    //init create need
    rhin.init();
})(window);

