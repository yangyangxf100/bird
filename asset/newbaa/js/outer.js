$(function() {
    $("button.navbar-toggle").click(function() {
        $(this).toggleClass("active");
    });

    $(document).scroll(function() {
        if($(this).scrollTop() > 400) {
            $("nav.scroll-nav").fadeIn(500);
        } else {
            $("nav.scroll-nav").fadeOut(500);
        }
    });

    // Mobile Nav
    var toggle = function() {
        var current = 0,
            args = arguments;

        return function() {
            if(current >= args.length) current = 0;
            args[current++].apply(this, arguments);
        }
    };

    var toggleFn = toggle(function(e) {
        $(this).find("menu").slideDown();
    }, function(e) {
        $(this).find("menu").slideUp();
    });

    $(".mobile-item").click(function(e) {
        $(this).toggleClass("active")
            .siblings()
            .removeClass("active");
    });

    $(window).on("resize", function(e) {
        if($(window).width() > 768) {
            $(".navbar-toggle").removeClass("active");
            $(".mobile-nav").removeClass("in");
        }
    })

});