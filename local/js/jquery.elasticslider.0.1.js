(function($) {

	$.fn.elasticSlider = function( options ) {

		// Defaults extended with options
		var settings = $.extend({
			'autoRotate'			: false,
			'autoRotateDelay'		: 6000,
			'minWidth'				: 1024, 
			'navContainer'			: '#elasticSlider-nav',
			'navDots'				: true,
			'navArrows'				: false,
			'navArrowsClassPrefix'	: 'arrow',
			'loop'					: false,
			'navClickToSlide'		: false,
			'animationSpeed'		: 500,
			'easing'				: false,
			'forceCoverScreen'		: true, // czy ma robić cover także na pionowych zdjęciach?
			'onAnimationStart'		: false, // przed rozpoczęciem animacji
			'onAnimationComplete'	: false,
			'preloadImages'			: false,
			'onStartLoading'		: false, // przed rozpoczęciem ładowania (po zakończeniu ładowania wywoływana jest onAnimationStart)
			'centerImage' 			: true, 
			'alignTop'				: false, // czy ma przyciągać zdjęcia do górnej krawędzi
			'sliderOffsetY' 		: 0 // zmniejszenie obliczanej wysokości
		}, options);

		return this.each(function() {
			// nadrzędny element z posiotion relative;
			$(this).wrap('<div class="elastic-slider-container" />');
			var wrapper = $('div.elastic-slider-container');
			var sliderContainer = $(this);
			// wysokość sliderContainer ustawiona na wysokośc okna (z uwzględnieniem sliderOffsetY)
			$(sliderContainer).css("height", ($(window).height() - settings.sliderOffsetY) + "px");
			var i = 0;
			sliderContainer.children().each(function() {
				// dodaję element nawigacji do elementu navContainer
				$(settings.navContainer).append('<li class="'+ i +'" ><a onclick="return false;" href="#"></a></li>');
				// dodaję nazwę klasy (numer)
				$(this).addClass(i.toString());
				// jeżeli jest zdefiniowany obrazek tła to wstawiam <img>
				if ($(this).data("background")){
					$(this).append('<img class="background-img" ' + (settings.preloadImages ? 'data-' : '')  + 'path="' + $(this).data("background") + '" alt="" />');
					// ustawiam z-index dla elementów <div> (aby były wyświetlane powyżej obrazka)
					$(this).find("div").each(function() {
						$(this).css("z-index", "99");
						$(this).css("position", "relative");
					});
				} else {
					$(this).css("height", ($(window).height() - settings.sliderOffsetY) + "px");
				}
				// ustawiam pozycję X elementu
				var elementPosition = $(window).width();
				if ($(window).width() < settings.minWidth) { elementPosition = settings.minWidth; };
				elementPosition = i * elementPosition;
				$(this).css('left', elementPosition.toString() + 'px');	
				 i++;
			});
			
			var activeElementIndex = 0;
			// load first!
			loadSlide(0);
			var autoRotateInterval;
			if (settings.autoRotate == true) {
				autoRotateInterval = setInterval(function() {
					nextSlide();
				}, settings.autoRotateDelay);

			}


			// *** RESIZE
			$(window).resize(function() {
				// wysokość sliderContainer ustawiona na wysokośc okna (z uwzględnieniem sliderOffsetY)
				$(sliderContainer).css("height", ($(window).height() - settings.sliderOffsetY) + "px");
				i = 0;
				// ilości elementów po lewej i po prawej
				var elementsToTheRight = activeElementIndex;
				var elementsToTheLeft = $("#" + sliderContainer.attr("id") + " li").length - (activeElementIndex + 1);
				
				//$("#" + sliderContainer.attr("id") + " li").each(function() {
				sliderContainer.children().each(function() {
					// wysokość elementu
					$(this).css("height", ($(window).height() - settings.sliderOffsetY) + "px");
					
					// ustawiam pozycję X elementu z rozpoznaniem aktywnego elementu
					var elementPosition = $(window).width();
					if (elementPosition < settings.minWidth) { elementPosition = settings.minWidth; };
					if ($(this).index() < activeElementIndex) {
						elementPosition = elementPosition * (-(activeElementIndex - $(this).index()));
					} else if ($(this).index() > activeElementIndex) {
						elementPosition = elementPosition * (($(this).index()) - activeElementIndex);
					} else {
						elementPosition = 0;
					}
					$(this).css('left', (elementPosition).toString() + 'px');
					// dopasowuję aktywny obrazek
					if ($(this).hasClass("active"))
						prepareImage($(this));
					i++;
				});
			});

			// Prepare Image - skaluje i ustawia obrazek na podstawie wymiarów i wielkości okna (zamiennik background-cover)
			function prepareImage(object) {					
				// ustalam jaka jest oryginalna wielkość, a następnie skaluję; dane o wielkości zapisuję jako data-imgWidth, data-imgHeight
				if (!object.data("imgWidth")){
					var img = new Image();
					img.onload = function() {
						object.data("imgWidth", this.width);
						object.data("imgHeight", this.height);
						fitImage(object, object.find("img"), this.width, this.height);
					}
					img.src = object.find("img").attr("src");
				}else {
					fitImage(object, object.find("img"), object.data("imgWidth"), object.data("imgHeight"));
				}

			}
			function fitImage(container, img, imgW, imgH) {
				
				var scX = parseInt(container.width()) / imgW;
				var scY = parseInt(container.height()) / imgH;
				var sc = (scX > scY) ? scX : scY;

				if (imgH > imgW){
					if (!settings.forceCoverScreen)
						sc = (scX < scY) ? scX : scY;
				}

				
				img.width(Math.round(imgW * sc));
				img.height(Math.round(imgH * sc));
								
				if (settings.centerImage) {
					// reset
					img.css("top", "0");
					img.css("margin-left", "0");
					// center Y					
					var imgOffsetY = (container.height() - img.height()) / 2;
					img.css("top", imgOffsetY + "px");
					// console.info("imgOffsetY: " + imgOffsetY, " / contH: " + container.height());
					
					//center X
					var imgOffsetX = (container.width() - img.width()) / 2;					
					img.css("margin-left", imgOffsetX + "px");

					// console.info("imgOffsetX: " + imgOffsetX, "imgW: " + img.width() + " // containerW: " + container.width() + " sc: " + sc);
		
				}
				if (settings.alignTop) {
					img.css("top", "0");
				}
				// console.info("imgW: " + img.width() + " // containerW: " + container.width() + " sc: " + sc, "container: ", container.width(), container.height(), "position: ", img.css("top"), img.css("margin-left"));
			}


			$.fn.elasticSlider.gotoSlide = function(slideNumber) {
				//console.info("click: " + slideNumber);
				loadSlide(slideNumber);
			}
			// ładuje (o ile trzeba) a następnie otwiera wybrany slajd
			function loadSlide(slideNumber) {
				// jeżeli nie ma ustawionego preload to otwieram slajd od razu
				if (!settings.preloadImages) {
					openSlide(slideNumber);
					return;
				}

				// aktywny element
				$activeElement = $("#" + sliderContainer.attr("id") + " li." + slideNumber);
				$img = $activeElement.find("img");
								

				// jeżeli obrazek był już załadowany to otwieram slajd od razu (rozpoznaję po data-path)
				if ($img.attr("src")) {
					openSlide(slideNumber);
					return;
				}

				// ładuję obrazek
				if (settings.onStartLoading instanceof Function) { settings.onStartLoading.call(); }
								
				$img.css("display", "none");				
				var url = $img.data("path");
				$img.bind('load error', function(e) {
					$.data($img, 'loaded', ('error'==e.type)?false:true);
					openSlide(slideNumber);
					$img.delay(200).fadeIn(500);
					$(this).unbind('load error');
				});
				$img.attr("src", url);
				

			}
			// otwiera i animuje (UWAGA! z zewnętrznych interfejsów wywoływać loadSlide!!!)
			function openSlide(slideNumber) {
				// uruchamiam funkcję onAnimationStart()
				if (settings.onAnimationStart instanceof Function) { settings.onAnimationStart.call(slideNumber); }
				//settings.onAnimationStart();
				var activeSlideIndex = parseInt($("#" + sliderContainer.attr("id") + " li.active").data('slidenum'));
				var slideDifference = activeSlideIndex - slideNumber;
				if (slideDifference < 0) {
					var animationLengthPrefix = "-=";
				} else {
					var animationLengthPrefix = "+=";
				};
				
				$activeElement = $("#" + sliderContainer.attr("id") + " li." + slideNumber);

				// przygotowuję do wyświetlenia
				prepareImage($activeElement);
				var elementWidth;
				if ($(window).width() < settings.minWidth) { elementWidth = settings.minWidth; } else { elementWidth = $(window).width(); }
				var animationLength = animationLengthPrefix + "" + (elementWidth * Math.abs(slideDifference)).toString() + "";
				$(settings.navContainer + " li.active").removeClass('active');
				var i = 0;
				$("#" + sliderContainer.attr("id") + " li").each(function() {
					var functionOnComplete = null;
					if (activeSlideIndex == i)
						if (settings.onAnimationComplete instanceof Function)
							functionOnComplete = settings.onAnimationComplete;
					$(this).animate({
						left: animationLength
					}, settings.animationSpeed, settings.easing, functionOnComplete);
					i++
				});
				$("#" + sliderContainer.attr("id") + " li.active").removeClass('active');
				$(settings.navContainer + " li." + slideNumber).addClass('active');
				$activeElement.addClass('active');

				activeElementIndex = slideNumber;
				updateArrowsState();
			};
			// update arrow state - dodaje usuwa klasę disabled strzałkom jeśli wyłączono loop
			function updateArrowsState() {
				if (!settings.navArrows) return;
				if (settings.loop) return;

				var activeSlideIndex = parseInt($("#" + sliderContainer.attr("id") + " li.active").data('slidenum'));
				if (activeSlideIndex == 0)
					wrapper.find("div." + classPrefix + "-prev").addClass("disabled");
				else 
					wrapper.find("div." + classPrefix + "-prev").removeClass("disabled");
				if (activeSlideIndex == (sliderContainer.children().length - 1))
					wrapper.find("div." + classPrefix + "-next").addClass("disabled");
				else 
					wrapper.find("div." + classPrefix + "-next").removeClass("disabled");
				

			}

			function getActiveSlideIndex() {
				//var activeSlideIndex = parseInt($("#" + sliderContainer.attr("id") + " li.active").attr('class'));
				var activeSlideIndex = parseInt($("#" + sliderContainer.attr("id") + " li.active").data('slidenum'));

				return activeSlideIndex;
			}

			// Następny slajd
			function nextSlide() {
				var activeSlideIndex = getActiveSlideIndex();
				var openTo = activeSlideIndex + 1;

				if (openTo < sliderContainer.children().length) {
					loadSlide(openTo);
				} else {
					if (settings.loop)
						loadSlide(0);
				}
				// jeśli autoRotate - to restartuję interval;
				if (settings.autoRotate == true) {
					clearInterval(autoRotateInterval);
					autoRotateInterval = setInterval(function() {
						nextSlide();
					}, settings.autoRotateDelay);
				}

			}
			// Poprzedni slajd
			function prevSlide() {
				
				var activeSlideIndex = getActiveSlideIndex();
				var openTo = activeSlideIndex - 1;

				if (openTo >= 0) {
					loadSlide(openTo);
				} else {
					if (settings.loop)
						loadSlide((sliderContainer.children().length - 1));
				}
			}


			// konfiguracja pluginu
			if(settings.navDots) {
				$(settings.navContainer).addClass("elastic-slider-nav");
				$(settings.navContainer + " li ").click(function() {
					if ($(this).hasClass("active")) return;
					var clickedSlideIndex = parseInt($(this).data('slidenum'));
					loadSlide(clickedSlideIndex);
					return false;
				});

				// jeśli autoRotate to na najazd zatrzymuję timer
				if (settings.autoRotate == true) {
					$(settings.navContainer + " li ").hover(function() {
						clearInterval(autoRotateInterval);
					}, function() {
						autoRotateInterval = setInterval(function() {
							nextSlide();
						}, settings.autoRotateDelay);
					});
				}

			}
			if(settings.navClickToSlide) {
				$("#" + sliderContainer.attr("id") + " li").click(function() {
					nextSlide();
					return false;
				});
			}

			// jeśli wymagane dodaję strzałki
			if (settings.navArrows){
				var classPrefix = settings.navArrowsClassPrefix;
				wrapper.append('<div class="' + classPrefix + ' ' + classPrefix + '-prev"></div>');
				wrapper.append('<div class="' + classPrefix + ' ' + classPrefix + '-next"></div>');
				wrapper.find("div." + classPrefix + "-prev").click(function() {
					prevSlide();
					return false;
				});
				wrapper.find("div." + classPrefix + "-next").click(function() {
					nextSlide();
					return false;
				});
			}

			// uaktualniam status strzałek
			updateArrowsState();


		});	
	};

})(jQuery);