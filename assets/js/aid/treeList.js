/**
 * Created by crsu on 2019/3/12.
 */
;define(function (require, exports) {
    ;'use strict';

    //use init need
    //样式
    seajs.use(['{dir}../css/aid/layout.css', '{dir}../css/aid/treeList.css']);
    //创建者
    var builder = require("{dir}aid/builder")["builder"];
    var listTools = require("{dir}aid/listTools")["listTools"];
    var treeTools = require("{dir}aid/treeTools")["treeTools"];
    //创建树
    var buildTree = builder["buildLigerTree"];
    var buildGrid = builder["buildLigerGrid"];
    var buildToolBar = builder["buildToolBar"];

    //declare variable for use
    // 树上一次操作的缓存：search: 是否执行关键字查询 | keyWord: 关键字 | param: 选中节点
    var topWin = window["extender"].getTopWin();
    var cache = topWin["extender"]["GlobalCache"];

    //declare exector to export
    var cacheTreeKey = "exector.treeTemporary";
    var exector = {
        treeTemporary: {},
        doTree: function (doTreeParam) {
            var treeManager = null;
            //check param
            if (!doTreeParam) {
                console.error("sorry, doTree function you invoke is can not be empty.");
                return;
            }

            var left = $("#dvLeft");
            var right = $("#dvRight");
            var txtSearch = left.find("#txtTreeSearch");
            var dvTree = left.find("#dvTree");

            // 输入关键字回车过滤树
            // fn 树查询
            //tool think
            //dvTreeTools
            if (doTreeParam["treeTools"]) {
                //tool bar
                buildToolBar(
                    treeTools,
                    left.find("#pTreeTools"),
                    doTreeParam["treeTools"],
                    doTreeParam["treeTools"]["after"]);
            }

            var searchTree = function (keyWord) {
                if (keyWord == undefined) {
                    keyWord = txtSearch.val();
                }
                var paramData = {
                    keyWord: keyWord
                };
                var _doNodeSelectedStyle = function (id, isChecked) {
                    var li = dvTree.find("#" + id);
                    var div = li.find("div").first();
                    if (isChecked) {
                        div.addClass("l-selected");
                    } else {
                        div.removeClass("l-selected");
                    }
                }
                var _doOneCheckStyle = function (id, isChecked) {
                    //li.find(".l-checkbox-unchecked").click();
                    var li = dvTree.find("#" + id);
                    if (isChecked) {
                        dvTree.find(".l-checkbox-checked").removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                        li.find(".l-checkbox-unchecked").addClass("l-checkbox-checked");
                    } else {
                        li.find(".l-checkbox-checked")
                            .removeClass("l-checkbox-checked")
                            .addClass("l-checkbox-unchecked");
                    }
                }
                ajaxApi({
                    url: doTreeParam["url"],//"./treeList/getTree"
                    data: paramData,
                    successOKResult: function (data) {
                        var treeParam = {
                            nodeWidth: 200,
                            data: data["result"],
                            checkbox: doTreeParam["checkbox"],
                            idFieldName: doTreeParam["id"],//'id',
                            parentIDFieldName: doTreeParam["pid"],//'pid',
                            isExpand: doTreeParam["isExpand"],
                            slide: false,
                            onCancelselect: function (node, e) {

                                if (!node || !node["data"]) {
                                    return;
                                }
                                _doOneCheckStyle(node["data"]["id"], false);

                                if ("function" == typeof doTreeParam["onCancelSelect"]) {
                                    doTreeParam["onCancelSelect"](node, e);
                                }
                            },
                            onSelect: function (node, e) {

                                if (!node || !node["data"]) {
                                    return;
                                }
                                _doOneCheckStyle(node["data"]["id"], true);

                                if ("function" == typeof doTreeParam["onSelect"]) {
                                    doTreeParam["onSelect"](node, e, treeManager);
                                }

                                var param = node["data"];// node param
                                // 记录操作
                                exector.treeTemporary["param"] = param;
                                cache.save(cacheTreeKey, exector.treeTemporary);

                                //click search
                                right.find("#btnListSearch").click();
                            },
                            onAfterAppend: function (parentNode, newdata) {
                                // 选中缓存里的节点
                                // var selected = cache.get(cacheTreeKey);
                                // if (selected) {
                                //     if (selected["param"]) {
                                //         this.selectNode(selected["param"]);
                                //     }
                                // }
                                if (doTreeParam["onAfterAppend"] && "function" == typeof doTreeParam["onAfterAppend"]) {
                                    doTreeParam["onAfterAppend"](parentNode, newdata);
                                }
                                // 设置默认选中第一个，过滤列表
                                if (doTreeParam["isSelectFirst"]) {
                                    var firstId = newdata[0]["id"];
                                    var param = {
                                        id: firstId
                                    };
                                    // 记录操作
                                    exector.treeTemporary["param"] = param;
                                    cache.save(cacheTreeKey, exector.treeTemporary);
                                }
                                // todo 根据缓存选中的节点刷新列表，这里由于列表在这之前就会默认执行一次查询，所以要等查询执行完
                                setTimeout(function () {
                                    right.find("#btnListSearch").click();
                                }, 200);
                            },
                            onCheck: function (note, checked) {
                                _doNodeSelectedStyle(note["data"]["id"], checked);

                                if (doTreeParam["onCheck"] && "function" == typeof doTreeParam["onCheck"]) {
                                    doTreeParam["onCheck"](note, checked);
                                }
                                //click search
                                right.find("#btnListSearch").click();
                            },
                            delay: function (e) {
                                if (doTreeParam["delay"] && "function" == typeof doTreeParam["delay"]) {
                                    doTreeParam["delay"](e);
                                }
                            },
                            isLeaf: doTreeParam["isLeaf"]
                        };

                        if (doTreeParam["doTreeParam"]) {
                            treeParam = doTreeParam["doTreeParam"];
                        }
                        treeManager = buildTree(dvTree, treeParam, doTreeParam["after"]);
                    }
                });
            };
            txtSearch.keyup(function (event) {
                exector.treeTemporary["keyWord"] = this.value;
                if (event.keyCode == "13") {// 回车
                    // 过滤树
                    searchTree(this.value);
                    // 记录操作
                    exector.treeTemporary["treeSearch"] = true;
                } else {
                    exector.treeTemporary["treeSearch"] = false;
                }
                cache.save(cacheTreeKey, exector.treeTemporary);
            });

            var cacheContent = cache.get(cacheTreeKey);
            //tree
            if (cacheContent) {
                txtSearch.val(cacheContent["keyWord"]);
            }
            var clickSearch = txtSearch.val();
            if (cacheContent) {
                if (cacheContent["treeSearch"]) {
                    clickSearch = cacheContent["keyWord"];
                }
            }
            searchTree(clickSearch);
        },
        doList: function (doListParam) {

            if (!doListParam) {
                console.error("sorry, the param [doListParam] doList you invoke is can not be empty.");
                return;
            }

            var right = $("#dvRight");

            var listParam = {
                url: doListParam["url"],//"./treeList/getList",
                columns: doListParam["columns"],
                tree: doListParam["tree"],
                checkbox: doListParam["checkbox"],
                alternatingRow: doListParam["alternatingRow"],
                usePager: doListParam["usePager"],
                rownumbers: true,
                rownumbersColWidth: 26,
                noRecordMessage: "没有符合条件的记录存在",
                isContinueByDataChanged: "数据已经改变,如果继续将丢失数据,是否继续?",
                headerRowHeight: 28,
                pageSize: 20,
                height: "100%",
                // data: data["result"],
                dataType: 'server',
                // groupColumnName: 'City',
                // groupColumnDisplay: '城市',
                root: "rows",
                record: "total",
                onAfterShowData: function (currentData) {

                    //css adapter
                    //page bar
                    $(".l-panel-bbar-inner").css({
                        "margin-top": "-3px"
                    });

                    if (doListParam["onAfterShowData"] && "function" == typeof doListParam["onAfterShowData"]) {
                        doListParam["onAfterShowData"](currentData, right.find("#dvGrid").ligerGetGridManager());
                    }
                },
                onBeforeShowData: function (currentData) {
                    if (doListParam["onBeforeShowData"] && "function" == typeof doListParam["onBeforeShowData"]) {
                        doListParam["onBeforeShowData"](currentData);
                    }
                },
                onCheckRow: function (checked, data, rowid, rowdata) {
                    if (doListParam["onCheckRow"] && "function" == typeof doListParam["onCheckRow"]) {
                        doListParam["onCheckRow"](right.find("#dvGrid").ligerGetGridManager(), checked, data, rowid, rowdata);
                    }
                }
            };
            if (doListParam["doListParam"]) {
                listParam = doListParam["doListParam"];
            }
            //grid
            buildGrid(right.find("#dvGrid"), listParam, doListParam["after"]);

            //give button event
            right.find("#btnListSearch").click(function () {

                var ligerGrid = $.ligerui.get("dvGrid");

                //setparam
                var keyWord = $("#txtListSearch").val();
                ligerGrid.set("page", 1);
                ligerGrid.set("newPage", 1);
                ligerGrid.setParm("keyWord", keyWord);
                //todo.. handler  lower ie
                ligerGrid.setParm("apiTree", JSON.stringify(cache.get(cacheTreeKey)["param"]));

                ligerGrid.reload();
            });

            if (doListParam["listTools"]) {
                //tool bar
                buildToolBar(
                    listTools,
                    right.find("#ulListTools"),
                    doListParam["listTools"],
                    doListParam["listTools"]["after"]);
            }
        }

    };


    //show body
    setTimeout(function () {
        $("body").show();
    }, 100);

    exports.exector = exector;
});