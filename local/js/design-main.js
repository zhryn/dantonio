// lameBrowser : Boolean
var lameBrowser = function() {
	if ($.browser.msie) {
		if (parseInt($.browser.version, 0) < 9) {
			return true;
		}
	}
	return false;
};
var IEBrowser = function() {
	if ($.browser.msie) {
		return true;
	}
	return false;	
}

var preloaderInterval;
var preloaderPos = 0;
var showPreloader = function() {
	$(".preloader").delay(400).fadeIn(400);
	clearInterval(preloaderInterval);
	preloaderInterval = setInterval( updatePreloaderBgImg, 500 );
	var imY = $(window).height() / 2 - 25;
	// update preloader position
	var $elasticSlider = $('.elastic-slider-container');
	if ($elasticSlider.length) {
		imY = $elasticSlider.position().top + $elasticSlider.height() / 2 - 25;
	}
	var el = $(".preloader .preloader-inner");
	TweenLite.killTweensOf(el);
	el.css("margin-top", imY + "px");
	TweenLite.to(el, 0.6, {css: {marginTop: imY + "px"}, delay: 0.4, ease:Back.easeOut});
}
var hidePreloader = function() {

	var el = $(".preloader .preloader-inner");
	// TweenLite.killTweensOf(el);
	// TweenLite.to(el, 0.4, {css: {marginTop: "0"}, ease:Back.easeIn});
	$(".preloader").stop().fadeOut(400);
	clearInterval(preloaderInterval);
}

var updatePreloaderBgImg = function() {
	preloaderPos ++;
	if (preloaderPos > 8)
		preloaderPos = 0;	
	posY = -50 * preloaderPos;
	$(".preloader .preloader-inner").css("backgroundPosition", "0 " + posY + "px");
}


$(document).ready(function() {

	$(window).load( function () {
		var el = $("#main");
		TweenLite.to(el, 0.5, {css: {alpha: 1}});
	});


	// ładowanie obrazków
	$('img.wait').addClass("hidden");
	$('img.wait').imgpreload({
		each: function() {
			$(this).delay(200).fadeIn(400);
		}
	});


	// btn (redirect)
	$(".btn10.no-bg").hover(function() {
		var el = $(this);
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.2, {css:{backgroundColor: "#000"}});
		TweenLite.to(el, 0.2, {css:{color: "#FFF"}, delay: 0});
	}, function() {
		var el = $(this);
		TweenLite.killTweensOf(el);
		TweenLite.to(el, 0.4, {css:{backgroundColor: "inherit"}, delay: 0});
		TweenLite.to(el, 0.4, {css:{color: "#000"}, delay: 0});
	});


	function footerPosition() {
		var footerPos = $("#box_footer").position().top;
		var footerPosBootm = $(window).height();
		if (footerPos < footerPosBootm) {
			$("#box_footer").css("position", "fixed");
			$("#box_footer").css("top", footerPosBootm + "px").css("right", "0");
		}else {
			$("#box_footer").css("position", "static");
		}
	}

	// wyświetlam error na środku (o ile istnieje);	
	if ($(".design-error").length > 0){
		var er = $(".design-error .info");
		var erY = ($(window).height() - 200) / 2 - er.height();		
		TweenLite.to(er, 0.4, {css: {alpha : 1, marginTop: erY + "px"}, delay: 0.7, ease:Back.easeOut});
	}


	// wechat social icons widget - modal window with qr code
	var $weChatModal = $("#wechat-modal");
	if ($weChatModal.length) {
		$("body").on("click", "a.s-wechat, #wechat-modal", function(e){
			e.preventDefault();
			$weChatModal.toggleClass("active");
		});
	}

	$(window).resize(function() {
		footerPosition();
	});
	// pozycja footera
	footerPosition();

	setTimeout(function() {
		footerPosition();		
	}, 500);

});



