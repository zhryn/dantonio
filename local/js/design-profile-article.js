$(document).ready(function() {
	$(window).resize(function() {
		fitElements();
	})
	function fitElements() {
		var offsetY = $('#box_header').outerHeight();
		var h = window.innerHeight - offsetY;
		//$(".art-profile-bg").height(h);
		$(".art-full").css("min-height", (h) + "px");
		$("#box_footer").css("margin-top", "0");
		// $("#box_footer").css("background-color", "#FFF");
		// $("#box_footer").css("right", "0");
	}
	fitElements();
});

