var preloaderInterval;
var preloaderPos = 0;

var showPreloader = function () {
    $(".preloader").delay(400).fadeIn(400);
    clearInterval(preloaderInterval);
    preloaderInterval = setInterval(updatePreloaderBgImg, 500);
    var imY = $(window).height() / 2 - 25;
    // update preloader position
    var $elasticSlider = $('.elastic-slider-container');
    if ($elasticSlider.length) {
        imY = $elasticSlider.position().top + $elasticSlider.height() / 2 - 25;
    }
    var el = $(".preloader .preloader-inner");
    TweenLite.killTweensOf(el);
    el.css("margin-top", imY + "px");
    TweenLite.to(el, 0.6, { css: { marginTop: imY + "px" }, delay: 0.4, ease: Back.easeOut });
}

var hidePreloader = function () {

    var el = $(".preloader .preloader-inner");
    // TweenLite.killTweensOf(el);
    // TweenLite.to(el, 0.4, {css: {marginTop: "0"}, ease:Back.easeIn});
    $(".preloader").stop().fadeOut(400);
    clearInterval(preloaderInterval);
}

var updatePreloaderBgImg = function () {
    preloaderPos++;
    if (preloaderPos > 8)
        preloaderPos = 0;
    posY = -50 * preloaderPos;
    $(".preloader .preloader-inner").css("backgroundPosition", "0 " + posY + "px");
}

$(document).ready(function () {

    $(window).load(function () {
        var el = $("#main");
        TweenLite.to(el, 0.5, { css: { alpha: 1 } });
    });

    // ładowanie obrazków
    $('img.wait').addClass("hidden");
    $('img.wait').imgpreload({
        each: function () {
            $(this).delay(200).fadeIn(400);
        }
    });

    function footerPosition() {
        var footerPos = $("#box_footer").position().top;
        var footerPosBootm = $(window).height();
        if (footerPos < footerPosBootm) {
            $("#box_footer").css("position", "fixed");
            $("#box_footer").css("top", footerPosBootm + "px").css("right", "0");
        } else {
            $("#box_footer").css("position", "static");
        }
    }

    // $(window).resize(function () {
    //     footerPosition();
    // });

    footerPosition();

    // setTimeout(function () {
    //     footerPosition();
    // }, 500);

});



