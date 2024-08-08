function getWindowHeight(){
	var target = $('.viewer-contents, .layer-popup .layer-body .layer-body-inner');
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

$(function(){
    getWindowHeight();
    layerChk();
    viewStudyInfo();
})