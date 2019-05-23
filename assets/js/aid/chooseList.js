/*
 * @Author : leaf.fly
 * @Create : 2019-03-19
 * @Desc : this js is about choose page
 * @Version : v1.0.0.20190319
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports) {
    ;'use strict';

    //use need
    //css
    seajs.use(['{dir}../css/aid/layout.css', '{dir}../css/aid/choose.css'], function () {

        var id = "dvChooseGrid";

        var $target = $("#" + id);
        var parentData = require("{dir}aid/ligerUIDialog")["data"];

        var topWin = window["extender"].getTopWin();
        //创建者
        var builder = require("{dir}aid/builder")["builder"];
        var buildGrid = builder["buildLigerGrid"];


        var selectOnly = parentData["selectOnly"] || false;
        var maxSelect = parentData["maxSelect"] || -1;
        var minSelect = parentData["minSelect"] || -1;

        if (selectOnly) {
            maxSelect = -1;
            minSelect = -1;
        }

        var selectCode = parentData["selectCode"];
        var selectName = parentData["selectName"];
        //error show
        if (!selectCode || !selectName) {
            console.error("sorry, this attr [selectcode][selectname] must be set or i can not know what you want to get.");
            return;
        }

        var selectLiTemp = '<li id="{{liid}}" class="item" item="{{code}}" title="{{name}}" ><a class="close" id="{{aId}}">X</a>{{name}}</li>';
        var selectLiItems = parentData["saveItems"] || [];
        var cleanSelect = function () {
            var jqUL = $("#ulSelected");
            var jqNodes = jqUL.find("li");

            jqNodes.each(function (index, item) {
                if (index < minSelect) {
                    return;
                }
                var ligerGrid = $.ligerui.get("dvChooseGrid");
                var haveSelf = have({}, $(this).attr("id"));
                ligerGrid.unselect(haveSelf["self"]);
                item.remove();
            });
            if (0 < minSelect) {
                selectLiItems = selectLiItems.slice(0, minSelect);
                topWin.extender.jsmsgSuccess("至少保留【" + minSelect + "】项。");
            } else {
                selectLiItems = [];
            }
            $("#spanCountSelect").html(minSelect > 0 ? minSelect : 0);
            selectAllThink();
        };
        //ulSelected
        var fnRenderSelectUL = function () {
            if (0 < selectLiItems.length) {

                //remove no jq ul no in selects
                var jqUL = $("#ulSelected");
                var jqNodes = jqUL.find("li");
                if (jqNodes && 0 < jqNodes.length) {
                    var liids = [];
                    jqNodes.each(function (index, item) {
                        var exist = false;
                        var thisliid = $(this).attr("id");
                        for (var i = 0; i < selectLiItems.length; i++) {
                            var id = selectLiItems[i]["id"] || selectLiItems[i]["ID"] || selectLiItems[i]["Id"] || selectLiItems[i]["iD"];
                            if (!id) {
                                for (var item in selectLiItems[i]) {
                                    id += selectLiItems[i][item];
                                }
                            }
                            var liid = "li_" + id;
                            if (thisliid == liid) {
                                exist = true;
                                break;
                            }
                        }
                        if (!exist) {
                            liids.push(thisliid);
                        }
                    });
                    if (0 < liids.length) {
                        for (var i = 0; i < liids.length; i++) {
                            jqUL.children("#" + liids[i]).remove();
                        }
                    }
                }

                var codes = [], names = [];
                var saveItems = [];
                for (var i = 0; i < selectLiItems.length; i++) {
                    var id = selectLiItems[i]["id"] || selectLiItems[i]["ID"] || selectLiItems[i]["Id"] || selectLiItems[i]["iD"];
                    if (!id) {
                        for (var item in selectLiItems[i]) {
                            id += selectLiItems[i][item];
                        }
                    }
                    codes.push(selectLiItems[i][selectCode]);
                    names.push(selectLiItems[i][selectName]);
                    saveItems.push(selectLiItems[i]);

                    var liid = "li_" + id;
                    var aid = "a_" + id;

                    //think and no more times op dom
                    if (0 == jqUL.find("#" + liid).length) {
                        jqUL.append(selectLiTemp.tempRender({
                            liid: liid,
                            code: selectLiItems[i][selectCode],
                            name: selectLiItems[i][selectName],
                            aId: aid
                        }));
                        (function (aid, selItem) {
                            $("#" + aid).click(function () {
                                //prethink
                                if (preUnSelectLis(selItem)) {
                                    //unselect row
                                    var ligerGrid = $.ligerui.get("dvChooseGrid");
                                    var haveSelf = have(selItem);
                                    ligerGrid.unselect(haveSelf["self"]);

                                    jqUL.children("#" + liid).remove();
                                    var existOther = have(selItem);
                                    if (existOther["exist"]) {
                                        //remove
                                        selectLiItems = existOther["other"];
                                    }
                                }
                            });
                        })(aid, selectLiItems[i]);
                    }
                }

                //show count
                $("#spanCountSelect").html(selectLiItems.length);

                //save to cache
                window["extender"].GlobalCache.save("selectData", {
                    saveItems: saveItems,
                    codes: codes,
                    names: names
                });
            }
        };
        var preSelectLis = function (item) {
            if (maxSelect > 0 && maxSelect <= selectLiItems.length) {
                topWin.extender.jsmsgError("最多只能选择【" + maxSelect + "】项。");
                return false;
            }
            return true;
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

        var selectAllThink = function () {
            var selectedCount = $(".l-grid-row-cell-btn-checkbox").parents(".l-grid-row.l-selected").length;
            var ligerGrid = $.ligerui.get("dvChooseGrid");
            if (ligerGrid.rows.length <= selectedCount) {
                $(".l-grid-header-table").find(".l-grid-hd-row").addClass("l-checked");
            } else {
                $(".l-grid-header-table").find(".l-grid-hd-row").removeClass("l-checked");
            }
        };
        var selectLis = function (item) {

            if (selectOnly) {
                cleanSelect();
            }

            if (!have(item)["exist"]) {
                selectLiItems.push(item);
                fnRenderSelectUL();
            }
            selectAllThink();
        };
        var preUnSelectLis = function (item) {
            if (0 < minSelect && selectLiItems.length <= minSelect) {
                topWin.extender.jsmsgError("至少选择【" + minSelect + "】项。");
                return false;
            }
            if (selectOnly) {
                if (have(item)["exist"]) {
                    return false;
                }
            }
            return true;
        };
        var unSelectLis = function (item) {
            var existOther = have(item);
            if (existOther["exist"]) {
                //remove
                selectLiItems = existOther["other"];
                fnRenderSelectUL();
            }
            selectAllThink();
        };
        var listParam = {
            url: parentData["url"],
            columns: parentData["columns"],
            checkbox: true,
            rownumbers: true,
            rownumbersColWidth: 26,
            noRecordMessage: "没有符合条件的记录存在",
            isContinueByDataChanged: "数据已经改变,如果继续将丢失数据,是否继续?",
            headerRowHeight: 28,
            pageSize: 20,
            height: $target.height(),
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

                var allRows = currentData.rows;
                for (var i = 0; i < allRows.length; i++) {
                    var haveSelf = have(allRows[i]);
                    if (haveSelf["exist"]) {
                        $.ligerui.get("dvChooseGrid").select(allRows[i]);
                    }
                }

                //render select area
                fnRenderSelectUL();

            },
            onBeforeCheckRow: function (checked, data, rowid, rowdata) {
                return checked ? preSelectLis(data) : preUnSelectLis(data);
            },
            onCheckRow: function (checked, data, rowid, rowdata) {
                return checked ? selectLis(data) : unSelectLis(data);
            },
            onBeforeCheckAllRow: function (checked, element) {
                if (checked) {
                    var ligerGrid = $.ligerui.get("dvChooseGrid");
                    var rows = ligerGrid.rows;
                    if (0 < maxSelect) {
                        if (selectLiItems.length < maxSelect && maxSelect < rows.length) {
                            var gap = (maxSelect - selectLiItems.length) || 0;
                            if (gap > 0) {
                                for (var i = 0; i < rows.length; i++) {
                                    var thinkHave = have(rows[i]);
                                    if (thinkHave["exist"]) {
                                        ligerGrid.select(rows[i]);
                                        continue;
                                    }
                                    if (0 == selectLiItems.length - maxSelect) {
                                        break;
                                    }
                                    selectLiItems.push(rows[i]);
                                    ligerGrid.select(rows[i]);
                                }
                            }

                            topWin.extender.jsmsgSuccess("最多只能选择【" + maxSelect + "】项。");
                            fnRenderSelectUL();
                            return false;
                        }
                        if (maxSelect <= selectLiItems.length) {
                            topWin.extender.jsmsgError("最多只能选择【" + maxSelect + "】项。");
                            return false;
                        }
                    }
                    return true;
                } else {
                    cleanSelect();
                    $(".l-grid-header-table").find(".l-grid-hd-row").removeClass("l-checked");
                }
                return false;
            }
        };

        //grid build
        buildGrid($target, listParam, function () {
            var ligerGrid = $.ligerui.get(id);

            //add event listen
            // if (countSelect == allRows.length) {
            //     $(".l-grid-header-table").find(".l-grid-hd-row").addClass("l-checked");
            // }


            $("#btnSearch").click(function () {
                ligerGrid.setParm("keyWord", $("#txtKeyWord").val());
                ligerGrid.reload();
                // cleanSelect();
            });
            $("#aClean").click(function () {
                cleanSelect();
            });
        });
    });
});