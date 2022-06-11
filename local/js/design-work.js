// popup video / youtube
var popup = function(videoid, isYoutube) {
	var vcode;
	if (isYoutube)
		vcode = getYoutubeCode(videoid);
	else 
		vcode = getVimeoCode(videoid);
	cont = '<div class="video-full">' + vcode + '</div>';
	cont = '<div class="content">' + cont + '</div>';
	$(".popup").html(cont);
	showPopup();
	var h = ($(window).height() - $(".popup .content").height()) / 2 - 40;
	//console.info("content h: " + $(".popup .content").height());
	$(".popup .content").css("margin-top", h + "px");	
}
function getVimeoCode(videoid) {
	return '<iframe src="https://player.vimeo.com/video/' + videoid + '?title=0&amp;byline=0&amp;color=bca88f" width="600" height="338" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
}
function getYoutubeCode(videoid) {
	return '<iframe width="600" height="338" src="https://www.youtube.com/embed/' + videoid + '?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>';
}

// popup partner
var parnersAnimation = false;
function gotoPartner($listItem) {
	// console.info("goto partner: " + $listItem.attr("id"));
	parnersAnimation = true;
	$(".partner-wrapper .dynamic").fadeOut(300, function() {
		$(this).find("img").attr("src", "");
		$(this).find("img").attr("src", $listItem.data("image"));
		$(this).find("h1").html($listItem.find('a.partner-title').html());
		$(this).find("h2").html($listItem.find('a.partner-position').html());
		$(this).find(".partner-info").html($listItem.find('.full-content').html());
		$(".partner-wrapper .nav-partner.next").attr("data-id", $listItem.attr("id"));
		$(".partner-wrapper .nav-partner.prev").attr("data-id", $listItem.attr("id"));
		// console.info("change: " + $listItem.attr("id") + ", length: " + $(".partner-wrapper .nav-partner.next").length);

		$(".partner-wrapper .dynamic").fadeIn(300, function() {
			parnersAnimation = false;
		});
	});

}

var popupPartner = function($listItem) {

	cont = '<div class="content partner-wrapper">';
	cont += '';
	cont += '<div class="img dynamic fl">';
	cont += '<img src="' + $listItem.data("image") + '" alt="" />';
	cont += '</div>'; // img fl
	cont += '<div class="partner-descr dynamic fl">';
	cont += '<h1>' + $listItem.find('a.partner-title').html() + '</h1>';
	cont += '<h2>' + $listItem.find('a.partner-position').html() + '</h2>';
	cont += '<div class="partner-info">' + $listItem.find('.full-content').html() + '</div>';
	cont += '</div>'; // partner-descr
	cont += '<div class="cf"></div>';
	cont += '<a href="#" class="nav-partner prev" data-id="' + $listItem.attr("id") + '"></a>';
	cont += '<a href="#" class="nav-partner next" data-id="' + $listItem.attr("id") + '"></a>';
	cont += '<a href="#" class="partner-back close">' + $listItem.data("closetxt") + '</a>';
	cont += '</div>'; // partner-wrapper


	$(".popup").html(cont);
	



	// *** Partners Page Navigation	
	$(".nav-partner.prev").click(function() {		
		if (parnersAnimation) return;
		var myID = $(this).attr("data-id");		
		$prev = $("#" + myID).prev();
		if (!$prev.length) $prev = $(".partner-item:eq(" + ($(".partner-item").length - 1) + ")");		
		// console.info("myID: " + myID);
		// console.info("prev ID: " + $prev.attr("id"));
		gotoPartner($prev);
		return false;
	});
	$(".nav-partner.next").click(function() {
		if (parnersAnimation) return;
		var myID = $(this).attr("data-id");		
		$next = $("#" + myID).next();
		if (!$next.hasClass("partner-item")) $next = $(".partner-item:eq(0)");
		gotoPartner($next);
		return false;
	});

	showPopup();
	
	var h = ($(window).height() - $(".popup .content").height()) / 2 + 10;
	//console.info("content h: " + $(".popup .content").height());
	$(".popup .content").css("margin-top", h + "px");

}

var showPopup = function() {
	$(".popup").fadeIn(400);
}

var hidePopup = function(onHideCompleteFunc) {
	$(".popup").stop().fadeOut(400, function() {
		$(this).html('<div class="content"></div>');
		if (typeof(onHideCompleteFunc) == "function") {
			onHideCompleteFunc();
		}
	});
}

$(function() {
	$(".popup").click(function(e) {
		if ($(e.target).hasClass("popup") || $(e.target).hasClass("close"))
			hidePopup();
	});
});



$(document).ready(function() {
	//var containerWidth = $("#work-dir").width();
	$("#work-dir").masonry({
		itemSelector : ".project-item",
		columnWidth : function( containerWidth ) {
			return containerWidth / 4;
		},
		 // isFitWidth : false,		 
		 isAnimated : false
	});

	// imagesloaded
	var imgsL = new imagesLoaded($("#work-dir"));
	imgsL.on("progress", function(){
		$("#work-dir").masonry();
	});

	// zapalam na starcie;
	$(".project-item").each(function() {
		var el = $(this);
		var del = el.index() * 0.05 + 0.2;
		TweenLite.to(el, 0.6, {css: {alpha : 1}, delay: del});

		// IE hack
		if (IEBrowser())
			el.height(el.height() - 3);
	});
	// click on project item
	$(".project-item:not(.video-item, .partner-item)").click( function() {
		document.location = $(this).find('.info').data("url");
		return false;
	});
	// click on video item (MEDIA)
	$(".project-item.video-item .info").click( function() {
		// console.info($(this).data("videoid"));
		popup($(this).data("videoid"), $(this).hasClass("youtube"));
		return false;
	});
	// click on partner
	$(".partner-item").click(function() {
		// console.info("click partner");
		if (window.innerWidth >= 992) {
			popupPartner($(this));
		} else {
			document.location = $(this).find('.info').data("url");
		}			
		return false;
	});


	$(".project-item").hover( function() {
		if (window.innerWidth < 768) {
			return;
		}
		var el = $(this).find(".info");
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.6, {css: {alpha : 1}, delay: 0.1});
		el = el.find(".inner");
		var infoY = $(this).height() / 2 - el.height() / 2;
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.4, {css: {paddingTop: infoY + "px"}, ease:Expo.easeOut});
		
		el = $(this).find(".ceils");
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.4, {css: {alpha: 0.3}});


	}, function() {
		if (window.innerWidth <= 768) {
			return;
		}
		var el = $(this).find(".info");
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.7, {css: {alpha : 0}});

		el = el.find(".inner");
		var infoY = $(this).height() / 2 - el.height() / 2 + 50;
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.25, {css: {paddingTop: infoY + "px"}, ease:Expo.easeIn});

		el = $(this).find(".ceils");
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.4, {css: {alpha: 1}});

	});


	// Gutter Hack
	$("#main img").each(function() {
		$(this).one('load', function() {
			// gutter hack
			// console.info("format image, complete? " + $(this).prop("complete") + " h: " + $(this).height());
			formatImage($(this));
		});
		if (this.complete){
			// console.info("image complete");
			$(this).load();	
		} 

	});

	// *** window resize gutter hack
	// var initialResize = true;
	$(window).resize( function() {

		$(".project-item").each(function() {
			$(this).height("auto");
			if (IEBrowser())
				$(this).height($(this).height() - 3);
		});
		$(".project-item-img").each(function() {
			$(this).height("auto");
		});
		$(".project-item-img").each(function() {
			$(this).find("img").height("auto");
			// formatImage($(this).find("img"));
		});

		// tmp HACK
		$small = $(".project-item:not(.large,.vertical,.horizontal)");
		if (!$small.length) 
			return;

		var h = $small.height();
		$(".project-item.large .project-item-img img, .project-item.vertical .project-item-img img").each(function() {
			$(this).height(h*2);
		});

		if (IEBrowser()) {
		
			$(".project-item.large .project-item-img, .project-item.vertical .project-item-img").each(function() {
				$(this).height(h*2);
			});
			$(".project-item.large, .project-item.vertical").each(function() {
				$(this).height(h*2);
			});

		}

	});

	var waitForFinalEvent = (function () {
	  var timers = {};
	  return function (callback, ms, uniqueId) {
		if (!uniqueId) {
		  uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout (timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	  };
	})();	


	function formatImage(img) {

		// var w = img.width();
		// var h = img.height();
		// h = h/100.2 * 100;
		// // ustawiam wysokość elementu
		// var it = $("#work-dir").find(".project-item-img[data-id='" + img.data("id") + "']");
		// it.height(Math.round(h));
		// if (img.hasClass("large")) {
		// 	img.height(h);
		// }

	}

	$(window).load( function () {		
		$(window).resize();
	});

});




