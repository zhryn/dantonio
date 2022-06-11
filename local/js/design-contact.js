$(document).ready(function() {
	$(".mappoint").each(function() {
		var del = $(this).index() * 200 + 300;
		var xy = $(this).data("xy");
		var pos = xy.split(",");
		if (pos.length == 2){
			x = pos[0];
			y = pos[1];
			$(this).css("left", x + "px");
			$(this).css("top", y + "px");
		}
		$(this).delay(del).fadeIn(500);
		var it = $(".office-list[data-id='" + $(this).data("id") + "']");
		it.delay(del).fadeIn(500);
	});

	$(".contact-enquiries h3.enq-label").delay(500).fadeIn(300);
	$(".contact-enquiries .art-enquiry").each(function() {
		var del = $(this).index() * 150 + 600;
		$(this).delay(del).fadeIn(300);
	});

	$(".mappoint").hover(function() {
		var it = $(".office-list[data-id='" + $(this).data("id") + "']");
		it.addClass("active");
	}, function() {
		$(".office-list.active").removeClass("active");
	});
	
	$(".office-list").hover(function() {
		var it = $(".mappoint[data-id='" + $(this).data("id") + "']");		
		it.addClass("active");
	}, function() {
		$(".mappoint.active").removeClass("active");
	});
});

