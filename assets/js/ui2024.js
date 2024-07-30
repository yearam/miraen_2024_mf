function accordionInit() {
    var $target = $('.contents-list-wrap .item-group-list'),
        $btn = $target.find('button'),
        $panel = $target.find('ul');

    if (!$target.length) {
        return false;
    }

    $btn.off().on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).next('ul').slideUp(300);
        } else {
            $btn.removeClass('active')
            $(this).addClass('active');
            $panel.slideUp(300);
            $(this).next('ul').slideDown(300);
        }
    })
}

function txtLineBr(){
    var $target = $('.badge-lesson');
    $target.each(function(){
        var $len = $(this).text().length;
        if($len > 2){
            $(this).addClass('txt-br');
        }
    })
}

function dataGroupSlide(){
	var $obj = $('.data.group-content'),
		$btn = $obj.find('.group-content-slide-btn'),
		$panel = $obj.find('.data-group-child-area')

    if (!$obj.length) {
        return false;
    }

    $obj.each(function(){
        if($(this).hasClass('active')){
            $(this).find('.data-group-child-area').slideDown(300);
        }
    });

	$btn.off().on('click' , function(e){
		e.preventDefault();

        $(this).parents($obj).toggleClass('active');
        $(this).parents('.data.group-content').find('.data-group-child-area').slideToggle(300);
	});
}

function txtEllipsis(){
	var $obj = $('body.lesson-2024 .period-contents .lesson-items .item .data');

	if (!$obj.length) {
        return false;
    }

	$obj.each(function(){
		if($(this).find('.number-pages .badge').length === 0){
			$(this).find('strong').addClass('ellipsis-multi')
		}
	})
}

function popOverInit(){
    $('.tooltip-trigger').each(function(){
        $(this).webuiPopover();
    });
}

function radioTabInit(){
    var $radio = $('.data-upload-category input[type="radio"]'),
        $panel = $('.data-upload-category-parent').children()

    if(!$('.data-upload-category').length){
        return false;
    }

    $radio.each(function(){
        var $idx = $('.data-upload-category input[type="radio"]:checked').parent().index();
        $panel.removeClass('active');
        $panel.eq($idx).addClass('active');
    })

    $radio.on('click' , function(){
        var $idx = $(this).parent().index();
        $panel.removeClass('active');
        $panel.eq($idx).addClass('active');
    });
}

function getWindowHeight(){
	var wIh = $(window).innerHeight();
	var wOh = $(window).outerHeight();
	var target = $('body.lesson-2024 .wrapper-lesson');

	function setScrH(){
        var wWidth = $(window).width();
		var wIh = $(window).innerHeight();
		var wOh = $(window).outerHeight();
        var scrH = wOh - wIh;
        var vh = window.innerHeight * 0.01;

        if(wWidth > 1320){
            target.css('--vh',`${vh}px`)
        }

        target.css('--scroll-height',`${scrH}px`)
	}

	setScrH();

	$(window).on('resize' , function(){
		setScrH();
	})
}

function myUploadBtnSlide(){
	var $obj = $('.float-bottom-buttons'),
		$btn = $obj.find('.float-button');
	$btn.on('click' , function(){
		$obj.toggleClass('active');
	})
}

$(function () {
    accordionInit();
    $('.swiper-button-prev,.swiper-button-next').show();
    popOverInit();
    txtLineBr();
    dataGroupSlide();
    txtEllipsis();
    radioTabInit();
    getWindowHeight();
    myUploadBtnSlide();
});