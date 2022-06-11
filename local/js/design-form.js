var popup = function(cont) {
	cont = '<div class="content">' + cont + '</div>';
	$(".popup").html(cont);
	showPopup();
	var h = ($(window).height() - $(".popup .content").height()) / 2 - 40;
	//console.info("content h: " + $(".popup .content").height());
	$(".popup .content").css("margin-top", h + "px");
	
}

var showPopup = function() {
	$(".popup").fadeIn(400);
}

var hidePopup = function() {
	$(".popup").stop().fadeOut(400);
}

$(function() {
	$(".popup").click(function() {
		hidePopup();
	});
});