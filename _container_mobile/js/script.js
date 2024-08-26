function getWindowHeight(){
	var target = $('body');
	function setScrH(){
        var vh = window.innerHeight * 0.01;
        target.css('--vh',`${vh}px`)
	}
	setScrH();
	$(window).on('resize' , function(){
		setScrH();
	})
}

function viewStudyInfo(){
    var $obj = $('.btm-study-area'),
        $btn = $obj.find('.btn-study-info')

    $btn.on('click' , function(){
        $obj.toggleClass('active');
    })

    $(document).on('click' , function(e){
        if($(e.target).parents('.btm-study-area').length < 1){
            $obj.removeClass('active');
        }
    });
}

function layerChk(){
    var $layer = $('.layer-popup');

    $layer.each(function(){
        if($(this).hasClass('active')){
            $(this).addClass('active');
        }
    })
}

function layerOpen(target){
    var target = $(target);
    target.addClass('active');
};

function layerClose(target){
    var target = $(target);
    target.removeClass('active');
}

function btnLenChk(){
    var btns = $('.footer-inner'),
        target = $('#footer .right-btns button:visible').length;

    if(target == 2){
        btns.addClass('type01');
    } else {
        btns.removeClass('type01');
    }
};

$(function(){
    getWindowHeight();
    layerChk();
    viewStudyInfo();
    btnLenChk();
})