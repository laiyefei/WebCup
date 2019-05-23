/*
 * @Author : leaf.fly
 * @Create : 2019-03-21
 * @Desc : this is js for list
 * @Version : v1.0.0.20190321
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;define(function (require, exports, module) {
    ;'use strict';

    //use need
    seajs.use(['{dir}../css/aid/layout.css', '{dir}../css/aid/list.css']);

    //创建者
    var builder = require("{dir}aid/builder")["builder"];
    var listTools = require("{dir}aid/listTools")["listTools"];
    var treeTools = require("{dir}aid/treeTools")["treeTools"];
    //创建树
    var buildTree = builder["buildLigerTree"];
    var buildGrid = builder["buildLigerGrid"];
    var buildToolBar = builder["buildToolBar"];

    //show body
    setTimeout(function () {
        $("body").show();
    }, 100);
    exports.doList = function (doListParam) {

        if (!doListParam) {
            console.error("sorry, the param [doListParam] doList you invoke is can not be empty.");
            return;
        }

        var mainContent = $("#dvMain");

        var listParam = {
            url: doListParam["url"],//"./treeList/getList",
            columns: doListParam["columns"],
            checkbox: doListParam["checkbox"],
            tree: doListParam["tree"],
            alternatingRow: doListParam["alternatingRow"],
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
            onLoaded : doListParam["onLoaded"],
            onAfterShowData: function (currentData) {

                //css adapter
                //page bar
                $(".l-panel-bbar-inner").css({
                    "margin-top": "-3px"
                });
                if (doListParam["onAfterShowData"] && "function" == typeof doListParam["onAfterShowData"]) {
                    doListParam["onAfterShowData"](currentData, mainContent.find("#dvGrid").ligerGetGridManager());
                }
            }
        };
        if (doListParam["doListParam"]) {
            listParam = doListParam["doListParam"];
        }
        //grid
        buildGrid(mainContent.find("#dvGrid"), listParam, doListParam["after"]);
        //give button event
        mainContent.find("#btnListSearch").click(function () {

            var ligerGrid = $.ligerui.get("dvGrid");

            //setparam
            var keyWord = $("#txtListSearch").val();
            ligerGrid.set("page", 1);
            ligerGrid.set("newPage", 1);
            ligerGrid.setParm("keyWord", keyWord);

            ligerGrid.reload();
        });

        if (doListParam["listTools"]) {
            //tool bar
            buildToolBar(
                listTools,
                mainContent.find("#ulListTools"),
                doListParam["listTools"],
                doListParam["listTools"]["after"]);
        }
    };
});