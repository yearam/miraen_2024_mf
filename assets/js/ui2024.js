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
		$btn = $obj.find('.inner-wrap a'),
		$panel = $obj.find('.data-group-child-area');

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
		if($(this).parents('.data.group-content').hasClass('active')){
			$(this).parents($obj).removeClass('active');
			$(this).parents('.data.group-content').find('.data-group-child-area').slideUp(300);
		} else {
			$obj.removeClass('active');
			$(this).parents($obj).addClass('active');
			$panel.slideUp(300);
			$(this).parents('.data.group-content').find('.data-group-child-area').slideDown(300);
		}
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

$(function () {
    accordionInit();
    $('.swiper-button-prev,.swiper-button-next').show();
    $('.tooltip-trigger').webuiPopover();
    txtLineBr();
    dataGroupSlide();
    txtEllipsis();
});