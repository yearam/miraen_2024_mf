function accordionInit(){
    var $target = $('.contents-list-wrap .item-group-list'),
        $btn = $target.find('button'),
        $panel = $target.find('ul');

    if(!$target.length){
        return false;
    }

    $btn.off().on('click' , function(){
        if($(this).hasClass('active')){
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

  $(function(){
    accordionInit();
  })