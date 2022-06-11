$(document).ready(function() {


	$("#project-info a.btn10").click(function() {
		toggleInfo();
		return false;
	});
	$("#project-info a.close-info-btn").click(function() {
		if ($("#project-info a.btn10").hasClass("active"))
			toggleInfo();
		return false;		
	});

	function toggleInfo() {
		$("#project-info a.btn10").toggleClass("active");
		$("#project-info .row").each(function () {
			if ($(this).is(":visible"))
				delay = $(this).index() * 50;
			else
				delay = 200 - $(this).index() * 50;
			$(this).delay(delay).fadeToggle({duration : 500, easing : 'easeInOutSine' });
		});		
	}
	// open info / intro on start
	toggleInfo();

	var offsetY = $('#box_header').outerHeight();
	// elasticSlider
	$("#about10").elasticFader({
		'min-width' : 800,
		'autoRotate'			: true,
		'easing' : 'easeInOutExpo',
		'animationSpeed' : 1300,
		'loop' : true,
		'preloadImages' : true,
		'onStartLoading' : onPreloadImage,		
		'sliderOffsetY' : offsetY,
		'navContainer' : '#about10-list-nav',
		'navClickToSlide' : true,
		'onAnimationStart' : onAnimationStart,
		'onAnimationComplete' : onAnimationComplete
	});	
	initAnimations();

	var art = $("#art-about10 .art-full");
	var marginL = ($(window).width() - art.width()) / 2;
	art.css("marginLeft", marginL + "px");

	function onPreloadImage() {
		showPreloader();
	}
	function initAnimations() {
		// wygaszam wszystkie opisy dla elementów nieaktywnych
		var notActiveDescr = $('#about10 li:not(.active) .home-description');
		notActiveDescr.children().each( function () {
			var el = $(this);
			var h = -10;
			TweenLite.to(el, 0.001, {css:{autoAlpha: 0, marginTop: h + "px"}});
		});
		// zapalam opis dla elementu aktywnego
		$("#about10 li").first().addClass("active");
		//onAnimationComplete(500);
	}
	function onAnimationStart() {
		hidePreloader();
		var activeDescr = $("#about10 li.active .home-description");
		activeDescr.children().each( function () {
			var el = $(this);
			TweenLite.to(el, 0.3, {css:{autoAlpha: 0, marginTop: "-8px"}, ease:Back.easeOut});
		});
	}
	function onAnimationComplete(delay) {
		if (!delay) delay = 0;
		var activeDescr = $("#about10 li.active .home-description");
		activeDescr.children().each( function () {
			var myDelay = (delay + $(this).index() * 100) / 1000;
			var el = $(this);

			TweenLite.to(el, 0.5, {css:{autoAlpha: 1, marginTop: "0"}, delay:myDelay, ease:Back.easeOut});
		});
	}

});

