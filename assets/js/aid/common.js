// JavaScript Document

$(function(){
	setGridStyle();
	switchMenu();
	setLiStyle();
	menuList();
});

//设置表格样式
function setGridStyle(){
	$(".error-list table tr td:first-child").css({
		"width":"30px",
		"padding-left":"26px"
	});
	$(".error-list table tr td:nth-child(3)").css({
		"width":"50%",
		"text-align":"left"
	});
}


//头部菜单切换
function switchMenu(){
	var $menuLi = $(".head-menu ul li");
	$menuLi.on("click",function(){
		$(this).addClass("current").siblings().removeClass("current");
	});
}

//设置li样式
function setLiStyle(){
	$(".chart-brief .type-list ul li:last .block").css("border-right",0);
}

//主机监控左侧菜单
function menuList(){
	var $menuA = $(".menu-list li span");
	$menuA.on("click",function(){
        $(this).addClass("select").parents("li").siblings().children("span").removeClass("select"); 
   });
   $menuA.hover(function(e) {
    	$(this).parent("li").addClass("hover");
	},function(){
		$(this).parent("li").removeClass("hover");
	});
}


