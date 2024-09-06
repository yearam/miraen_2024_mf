function teacherLiveGnb() {
    let $target = $('.gnb.teacher-live .gnb-menus > li');

    if (!$target.length) {
        return false;
    }

    $target.each(function () {
        if ($(this).find('.lnb-wrap').length > 0) {
            $(this).find('a').on('click', function (e) {
                e.preventDefault();
                $('html').addClass('header-overlay');
            })
        }
    })

    $(document).on('click', function (e) {
        if ($(e.target).parents('.header-contents').length < 1) {
            $target.removeClass('active');
            $('html').removeClass('header-overlay');
        }
    });

}

function mainSwiper(){
    var $slider = $('.live-talk-slider');

    if(!$slider.length){
        return false;
    }

    var swiper = new Swiper(".live-talk-slider", {
        slidesPerView: 2,
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        scrollbar: {
            el: ".swiper-scrollbar",
            hide: true
        },
        pagination: {
            el: ".live-talk-pagination",
            clickable: true,
            type: "fraction"
        },
        navigation: {
            nextEl: ".live-talk-button-next",
            prevEl: ".live-talk-button-prev"
        }
    });
}



$(function () {
    teacherLiveGnb();
    mainSwiper();
})