$(document).ready(function() {
	// ustawiam limit w zależności od wysokości okna
	var h = $(window).height() - 184;
	// dynamiczny limit
	var limit = Math.floor(h / 130);
	// jeśli limit jest większy niż ustawiono w data-limit, to zmniejszam;
	if (limit > parseInt($(".article-menu").data("limit"))) limit = parseInt($(".article-menu").data("limit"));
	$(".article-menu").data("limit", limit);
	function updateMenu(visible, pageNum) {
		//console.info("updat menu, page: " + pageNum);
		var activeLanguage = "en";
		if ($(".article-menu").data("lang"))
			activeLanguage = $(".article-menu").data("lang");		
		
			
		var params = {
						parent:  $(".article-menu").data("parent"), 
						open: $(".article-menu").data("open"),
						limit: $(".article-menu").data("limit"),
						ishome: $(".article-menu").data("ishome")
					}
		if (visible)
			params.visible = visible;
		if (pageNum)
			params.page = pageNum;
		$.post(
						"/" + activeLanguage + "/page/box/article_menu_items", 
						params, 
						function (data) {
							
							
							$(".article-menu").html(data);

							$(".article-menu .art-list").each(function () {
								var el = $(this);
								var delay = el.index() * 0.08;

								TweenLite.to(el, 0.5, {css:{alpha: 1}, delay : delay});
							});

						}
					);
	}
	// update menu on start!
	updateMenu("false");

// jeżeli używamy AJAX'a to... 
	// $(".art-holder .article-menu .art-list a").live("click", function () {
	// 	//alert($(this).data("id"));
	// 	$(".article-menu").data("open", $(this).data("id"));
	// 	updateMenu();
	// 	return false;
	// });

	$(".article-menu-navbar a.arrow-up").live("click", function () {
		var page = parseInt($(".art-list").data("page")) - 1;
		if (page > 0)
			updateMenu("true", page);
		return false;
	});
	$(".article-menu-navbar a.arrow-down").live("click", function () {
		var page = parseInt($(".art-list").data("page")) + 1;
		// console.info($(".art-list").first().data("page"));
		// alert ("about to update, page: " + page);
		updateMenu("true", page);
		return false;
	});


});