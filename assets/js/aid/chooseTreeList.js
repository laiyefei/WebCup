/*
 * @Author : crsu
 * @Create : 2019-03-27
 * @Desc : this js is about choose page
 * @Version : v1.0.0.20190327
 */
;define(function (require, exports) {
    ;'use strict';

    require("{dir}aid/extender");

    seajs.use(['{dir}../css/aid/layout.css', '{dir}../css/aid/choose.css', '{dir}../css/aid/chooseTreeList.css'], function () {

        var id = "dvChooseTree";

        var $target = $("#" + id);
        var parentData = require("{dir}aid/ligerUIDialog")["data"];

        //var topWin = window["extender"].getTopWin();
        var manager = null;// ligerGetTreeManager
        //创建者
        var builder = require("{dir}aid/builder")["builder"];
        var buildTree = builder["buildLigerTree"];

        var selectLiTemp = '<li id="{{id}}" class="item" title="{{text}}" item="{{code}}"><a class="close" id="{{aid}}">X</a>{{title}}</li>';
        var selectLiItems = parentData["saveItems"] || [];
        var jqUL = $("#ulSelected");

        var addToUlSelected = function (item) {
            var id = item["id"];
            // check not exist and append
            if (jqUL.find("#" + id).length == 0) {
                var code = item["code"];
                var text = item["text"];
                // todo.. bug : can not get tree[2] parentText by id
                var parentText = manager.getTextByID(item["pid"]);
                var aid = "a_" + id;
                jqUL.append(selectLiTemp.tempRender({
                    id: id,
                    text: text,
                    code: code,
                    title: parentText + " | " + text,
                    aid: aid
                }));
                // click X 已选择项中点击删除
                (function (aid, item) {
                    $("#" + aid).click(function () {
                        // remove li
                        jqUL.children("#" + id).remove();
                        // update selectLiItems
                        var existOther = have(item);
                        if (existOther["exist"]) {
                            selectLiItems = existOther["other"];
                        }
                        // unchecked node
                        $("#" + id).find(".l-checkbox-checked").removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                    });
                })(aid, item);
            }
        };

        var showSelected = function () {
            if (selectLiItems.length > 0) {
                for (var i = 0; i < selectLiItems.length; i++) {
                    var item = selectLiItems[i];
                    addToUlSelected(item);
                }
            }

            extender.GlobalCache.save("selectLiItems", selectLiItems);

        };


        /**
         * 选中节点(非父节点)
         * @param node
         */
        var selectItem = function (node) {
            // push to selectLiItems
            selectLiItems.push(node["data"]);
            showSelected();
        };
        /**
         * 取消选中
         * @param node
         */
        var unSelectItem = function (node) {
            // remove from selectLiItems
            var existOther = have(node["data"]);
            if (existOther["exist"]) {
                // remove
                selectLiItems = existOther["other"];
                jqUL.children().filter('li').remove();
                showSelected();
            }
        };

        /**
         * 选中所有
         * @param node
         */
        var selectAll = function (node) {
            var items = node["data"]["children"];// 所有子节点
            for (var i = 0; i < items.length; i++) {
                // push to selectLiItems
                selectLiItems.push(items[i]);
            }
            showSelected();
        };

        /**
         * 取消选中所有
         * @param node
         */
        var unSelectAll = function (node) {
            var items = node["data"]["children"];// 当前待取消的所有子节点
            cleanSelectedByItems(items);
        };

        var treeData = [];
        // get tree data from url
        var treeUrl = parentData["treeUrl"];
        ajaxApi({
            url: treeUrl,
            data: null,// todo.. 关键字检索
            successOKResult: function (data) {
                treeData = data["result"];
                var treeParam = {
                    nodeWidth: 200,
                    data: treeData,
                    checkbox: true,
                    idFieldName: "id",//'id',
                    parentIDFieldName: "pid",//'pid',
                    isExpand: true,
                    slide: false,
                    // autoCheckboxEven: false,
                    onCheck: function (node, select) {
                        var isPar = manager.hasChildren(node["data"]);
                        if (!isPar) {
                            return select ? selectItem(node) : unSelectItem(node);
                        } else {
                            return select ? selectAll(node) : unSelectAll(node);
                        }
                    }
                };

                buildTree($target, treeParam, function () {
                    console.log("tree loaded");
                    manager = $("#" + id).ligerGetTreeManager();
                });
            }
        });


        // 清除
        $("#aClean").click(function () {
            cleanSelected();
        });

        var cleanSelected = function () {
            // tree clean and remove selected
            for (var i = 0; i < selectLiItems.length; i++) {
                var id = selectLiItems[i]["id"];
                $("#" + id).find(".l-checkbox-checked").removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                jqUL.children("#" + id).remove();
            }
            // 清空selectLiItems
            selectLiItems = [];
            // 父节点，两种情况(全选与非全选状态)
            $("div").find(".l-checkbox-checked").removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
            $("div").find(".l-checkbox-incomplete").removeClass("l-checkbox-incomplete").addClass("l-checkbox-unchecked");
        };

        var cleanSelectedByItems = function (items) {
            // tree clean and remove selected by items
            for (var i = 0; i < selectLiItems.length; i++) {
                var selectedID = selectLiItems[i]["id"];
                for (var j = 0; j < items.length; j++) {
                    if (selectedID == items[j]["id"]) {
                        $("#" + selectedID).find(".l-checkbox-checked").removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                        jqUL.children("#" + selectedID).remove();
                    }
                }
            }
            // todo..bug: 删除不彻底
            for (var j = 0; j < items.length; j++) {
                var id = items[j]["id"];
                for (var i = 0; i < selectLiItems.length; i++) {
                    if (id == selectLiItems[i]["id"]) {
                        selectLiItems.splice(i - 1, 1);
                    }
                }
            }
        };

        var have = function (item, liid) {
            if (0 == selectLiItems.length) {
                return false;
            }
            var itemLiId;
            if (liid != undefined) {
                itemLiId = liid.replace("li_", "");
            } else {
                itemLiId = item["id"] || item["ID"] || item["Id"] || item["iD"];
                if (!itemLiId) {
                    for (var index in item) {
                        itemLiId += item[index];
                    }
                }
            }

            var exist = false;
            var other = [];
            var self;
            for (var i = 0; i < selectLiItems.length; i++) {
                var forId = selectLiItems[i]["id"] || selectLiItems[i]["ID"] || selectLiItems[i]["Id"] || selectLiItems[i]["iD"];
                if (!forId) {
                    for (var item in selectLiItems[i]) {
                        forId += selectLiItems[i][item];
                    }
                }
                if (itemLiId == forId) {
                    exist = true;
                    self = selectLiItems[i];
                } else {
                    other.push(selectLiItems[i]);
                }
            }

            return {
                exist: exist,
                self: self,
                other: other
            };
        };
    });
});