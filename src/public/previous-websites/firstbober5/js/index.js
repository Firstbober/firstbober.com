$("#arrow_hitbox").on("click", () => {
    $("body, html").animate({
        scrollTop: $("main").offset().top
    }, 850);
})