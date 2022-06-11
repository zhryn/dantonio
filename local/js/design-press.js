$(document).ready(function() {

	var masonryUpdateTimeout = false;
	var mOptions = {
		itemSelector : ".press-list-item",		
		gutterWidth: 10,
		isFitWidth : true, // if true remove the container width: 990px in CSS
		isAnimated : false
		// animationOptions: {
  //   		duration: 200
  // 		}
	};

	var updateMasonryOptions = function() {
		var containerW = window.innerWidth;
		if (window.innerWidth < 650) {
			mOptions.columnWidth = containerW - 20;
			mOptions.isFitWidth = true;
			// mOptions.gutterWidth = 0;
		} else if (window.innerWidth < 768) {
			mOptions.columnWidth = containerW * .5 - 20;
			mOptions.isFitWidth = true;
			// mOptions.gutterWidth = 0;
		} else if (window.innerWidth < 1100) {
			mOptions.columnWidth = containerW * .33 - 20;
			mOptions.isFitWidth = true;
			// mOptions.gutterWidth = 0;
		} else {
			mOptions.columnWidth = 240;
			mOptions.isFitWidth = false;
			// mOptions.gutterWidth = 10;		
		}		
	}
	updateMasonryOptions();

	$(".press-dir").masonry(mOptions);

	// imagesloaded
	var imgsL = new imagesLoaded($(".press-dir"));	
	imgsL.on("progress", function(){		
		$(".press-dir").masonry();
	});

	var myW = window.innerWidth;

	$(window).on("resize", function(e){
		if (window.innerWidth == myW) {
			return;
		}
		myW = window.innerWidth;
		updateMasonryOptions();
		$(".press-dir").css("opacity", 0);
		$(".press-dir").masonry("destroy");
		$(".press-dir").masonry(mOptions);

		clearTimeout(masonryUpdateTimeout);
		masonryUpdateTimeout = setTimeout(function() {
			if (myW >= 1100) {
				$(".press-lp").css("width", "990px");
			}
			$(".press-dir").masonry();
			$(".press-dir").css("opacity", 1);
		}, 200);
	});

	// Gutter Hack
	// $("#main img").each(function() {
	// 	$(this).one('load', function() {			
	// 		$(".press-dir").masonry(mOptions);
	// 	});
	// 	if (this.complete){
	// 		$(this).load();	
	// 	} 

	// });






});



