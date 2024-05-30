$(function () {
  var headerHeight = $("header.header").height();
  const targetPos = $("header.header").height() - $(".header-contents").height();
  
  // header scroll
  $(window).on("scroll", scrollSticky = function() {
    // var headerHeight =  $(".lnb-bg").hasClass("active") ? $("header.header").height() + $(".lnb-bg").height() : $("header.header").height();
    // var contentsHeight = $(".lnb-bg").length > 0 ? $(".header-contents").height() + $(".lnb-bg").height() : $(".header-contents").height();
    var contentsHeight = $(".header-contents").height();
    headerHeight = targetPos + contentsHeight;
    
    if ($(this).scrollTop() > targetPos) {
      $("body").css({"padding-top" : `${headerHeight}px`});
      $('header.header').addClass('fixed');
      if($(".wrapper").hasClass("personal-sticky")){
        $(".header-personal").fadeIn(100);
      }
    } else {
      $('header.header').removeClass('fixed');
      $("body").css({"padding-top" : `0px`});
      if($(".wrapper").hasClass("personal-sticky")){
        $(".header-personal").fadeOut(100);
      }
    }

    if($(".layout-footer").length > 0){
      if($(this).scrollTop() + $(this).outerHeight() >= $(".layout-footer").offset().top){
        $(`[href="#top"]`).css({"position" : "absolute", "bottom" : `${$(".layout-footer").innerHeight() + 15}px`});
        $(`.quick-menu`).css({"position" : "absolute", "bottom" : `${$(".layout-footer").innerHeight() + 10}px`});
      } else {
        $(`[href="#top"]`).removeAttr("style");
        $(`.quick-menu`).removeAttr("style");
      }
    }
  });

  // $(window).on('resize', function(){

  // });

  // ajax 처리 후에 동작하기 위해 window.load 이후로 묶음.
  // $(window).on('load', function(){
  renderLayout();
  renderCommonUI();
  renderPage();
  renderForm();
  renderPlugin();
});
//grouping function ////////////////////////////////////////////////////////////////////////////////////////////////
const renderCommonUI = function(){
  applytabletZoom();
  tabs('.tab');
  accordion('.accordion');
  accordion('.snb-inner');
  accordion('.snb-extra');
  //popupFunc();
}
const renderForm = function(){
  toggleGroup('.toggle-group', '.button'); //wrapper , target
  toggleGroup('.extra-buttons', '.extra-button'); //wrapper , target
  toggleGroup('.sort', 'button');
  toggleGroup('.buttons.type-rounded:not(.no-toggle)', 'a, button');
  toggleThis('.toggle-this');
  renderFileUpload('.file-upload');

  /* font적용 후 동작하기 위한 딜레이 */
  setTimeout(() => {
    selectFunc();
  }, 200);
}
const renderPage = function(){
  // 특화자료실, 사회
  sortCard(".area-selector", "area");
  sortCard(".era-selector", "era");
  sortCard(".service-guide .slider-tab", "service-slider");

  clearInput('.members');
};

//grouping function ////////////////////////////////////////////////////////////////////////////////////////////////
const renderLayout = function () {
  renderHeader();
  renderFooter();
};
const renderPlugin = function () {
  renderSelect2();
  renderSwiper();
  renderTooltip(".guide");

  if ($('.dropdown').length != 0) {
    $('.dropdown').dropdown();
  }

  if ($('.scrollbar-styled').length != 0) {
    $(".scrollbar-styled").mCustomScrollbar({
      theme:"minimal-dark",
      scrollInertia: 150,
      autoExpandScrollbar: true,
      scrollEasing: "linear"
    });
  }
};
const renderHeader = function () {
  //초등 sitemap scroll
  $('.theme-elementary .site-map-inner .depth-items').wrap('<div class="depth-items-scroll"></div>')

  //click
  $(".header.teacher-live").on("mouseleave", function(){
    $(".gnb > ul > li").removeClass("active");
  });
  $(`header.header:not(".util-menu")`).find('.gnb > ul > li > a').each(function (index, element) {
    $(element).on('click', function (e) {
      if($(this).attr("href").startsWith("#")){
        e.preventDefault();  
        if(!$(this).parents("header.header").hasClass("teacher-live")){
        }
        if ($(this).closest('.gnb-wrap').find('.site-map .icon-button').hasClass('active')) {
          $('.site-map .close-button').trigger('click');
        }

        $('html').addClass('header-overlay');
        target_id = $(this).attr('href');
        $(this).parent().siblings('li').removeClass('active');
        // 교과서 뿌려지는 부분
        $(target_id).parent('li').addClass('active').find('.grade-contents > .pane:first-of-type').show();
        if ($(this).parents('[school-grade]').attr('school-grade') === 'ELEMENT') {
          gnbBookListFunc(target_id, $(this).parents('[school-grade]').attr('school-grade'));
        }
      }
    });
  });
  $(`header.header.util-menu`).find('.gnb > ul > li > a').each(function (index, element) {
    $(element).on('click', function (e) {
      $(this).parent().addClass("active").siblings('li').removeClass('active');
    })
  });
  $('.close-button').click(function (e) {
    $(this).parents('li').removeClass('active');
    $(this).closest('.site-map').find('.icon-button').removeClass('active');
    $('html').removeClass('header-overlay');
    //sitemap button
    $('.site-map .icon-button use').attr('xlink:href' , '/assets/images/svg-sprite-solid.svg#icon-menu');
  });
  // site-map
  sliderSiteMap();

  $('.site-map').on('click','.icon-button', function () {
    if($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('html').removeClass('header-overlay');
      //sitemap button
      $('.site-map .icon-button use').attr('xlink:href' , '/assets/images/svg-sprite-solid.svg#icon-menu');
    } else {
      if ($(this).closest('.gnb-wrap').find('.gnb > ul > li').hasClass('active')) {
        $('.gnb .close-button').trigger('click');
      }
      $(this).addClass('active');
      $('html').addClass('header-overlay');
      //sitemap button
      $('.site-map .icon-button use').attr('xlink:href' , '/assets/images/svg-sprite-solid.svg#icon-close');
    }
  });
  
  // $('.gnb-dim').on('click', function () {
  //   $('.gnb .close-button').trigger('click');
  //   $('.site-map .close-button').trigger('click');
  // });
};
const renderFooter = function () {
  $('body').on('click','.button-family-site', function () {
    $('.family-site-pop').fadeToggle();
  });
};

//event function ////////////////////////////////////////////////////////////////////////////////////////////////
$.easing.customEasing = function (x, t, b, c, d) {
  // You can adjust the cubic-bezier values here
  return c * ((t = t / d - 1) * t * t + 1) + b;
};

//Form render function //////////////////////////////////////////////////////////////////////////////////////////
const clearInput = function(target){
  var $input = $(target).find('input[type=search], input[type=text], input[type=password]').not(':disabled, [readonly]');

  // 페이지 내부 마크업으로 실제 추가함.
  // if( !$input.parent(".clear-container")){
  //   for(var i = 0; i < $input.length; i++){
  //     $input.eq(i).wrap($('<div/>', {'class': "clear-container" + `${$input.eq(i).attr("class") !== undefined ? " " + $input.eq(i).attr("class") : ''}`})).after('<button type="button" class="button-clear"><svg><title>삭제</title><use href="/assets/images/svg-sprite-solid.svg#icon-close-round" /></svg></button>');
  //   }
  // }

  $(target).on('click', '.button-clear', function(e) {
    $(this).siblings('input').val("");
  });
}
const renderFileUpload = function (item) {
  // $(item).each(function (index, element) {
    var $el = $(item).find("input[type='file']");
    var $placeholder = $el.attr('placeholder');
    var $id = $el.attr('id');
    // console.log("id" + $id);

      $(item)
      .children('.inner-form')
      .prepend("<div class='placeholder'>" + $placeholder + '</div>');

  
    $(item).on('click','.placeholder', function () {
        $(this).parents(item).find("input[type='file']").trigger('click');
    });
  
    $(item).find("input[type='file']").on('change', function () {
        $(document).find(this).siblings('.placeholder').remove();
        // $(this).addClass('text-black');
        // $(this).val();
    });



    // if( $id.var == "" ){
    //   $el.parents(item).find('.placeholder').remove();
    // }
  // });

};
const toggleGroup = function (wrapper, target) {
  var $target = $(wrapper).find(target);
    $(wrapper).on('click', target , function () {
      if ($(wrapper).find('active')) {
        $(this).siblings().removeClass('active');
      }
      $(this).addClass('active');
    });
  // });
};
const toggleThis = function (target) {
  $(target).each(function (index, element) {
    $(this).on('click', function () {
      $(this).toggleClass('active');
    });
  });
};
const quickMenuButtonFunc = function (obj) {
  if($(obj).parents('.quick-menu').hasClass("init-show")){
    $(obj).parents('.quick-menu').removeClass("init-show");
    $(obj).siblings('.body').slideUp({
      duration: 700,
      easing: 'customEasing',
    });
  }else{
    $(obj).parents('.quick-menu').toggleClass('on');
    $(obj).siblings('.body').slideToggle({
      duration: 700,
      easing: 'customEasing',
    });
  }
  if($(obj).parents('.quick-menu').hasClass("on")){
    $(obj).attr("title", "클릭 시 퀵메뉴가 닫힙니다.");
  } else {
    $(obj).attr("title", "클릭 시 퀵메뉴가 열립니다.");
  }
};
// UI render function //////////////////////////////////////////////////////////////////////////////////////////
const tabs = function (item) {
  $(item).each(function (index, element) {
    // init
    // $(this).siblings('.pane-wrap').children('.pane').hide();

    if($(this).parent().hasClass("scrollable-container")){
      checkActive(this , 'display-show-flex');
      tabClick('display-show-flex');
    }else{
      checkActive(this , 'display-show');
      tabClick('display-show')
    }

  });
  
  function checkActive(item, showType) {
    if ($(item).find('li').hasClass('active')) {
      $target = $(item).find('.active > a').attr('href');
      $($target).addClass(showType);
    } else {
      $(item).parents('.tabs').find('.pane:first').addClass(showType);
      $(item).find('li:first').addClass('active');
    }
  }

  function tabClick(showType) {
    $(item).on('click','a', function (e) {
        e.preventDefault();

        $target = $(this).attr('href');
        $(this).parent('li').siblings('li').removeClass('active');
        $(this).parents('.tabs').find($target).siblings('.pane').removeClass(showType);
        $(this).parent('li').addClass('active');
        // $($target).show();
        $($target).addClass(showType);
        renderSelect2();
        selectFunc();
      });
  }
};
var accordion = function (item) {
  $(item).find('.pane').hide();
  // active tab check
  if ($(item).find('li').hasClass('active')) {
    $target = $(item).find('.active');
    $($target).children('.pane').show();
  }

  $(item).on('click', '.action', function(e) {
    e.preventDefault();

    // $this = $(this).parent('li');
    $this = $(this).closest('li');
    if (!$this.hasClass('active')) {
      $this.addClass('active');
      $this.children('.pane').slideDown();
      // jsSwiper(); //swiper4 사용시 필요함.
    } else {
      $this.children('.pane').slideUp();
      $this.removeClass('active');
    }
  });

  //ox click event
  $(item).on('click', `.ox, .button`, function (e) {
    // e.preventDefault();
    e.stopPropagation();
  });

  // 전체 접기/펼치기
  $(item).on('change', '.folding-all', function(e) {

    $(item).find(this).css("border","3px solid blue");
    $(this).css("border","1px solid red");
    if ($(this).is(':checked')) {
      console.log("checked");
      $(this).parents(item).find('.pane').parents('li').siblings().addClass('active');
      $(this).parents(item).find('.pane').slideDown();
      // $(this).siblings('label').html(str.replace('펼쳐보기', '접기'));
    } else {
      console.log("unchecked");
      $(this).parents(item).find('.action, .pane').parents('li').siblings().removeClass('active');
      $(this).parents(item).find('.pane').slideUp();
      // $(this).siblings('label').html(str.replace('접기', '펼쳐보기'));
    }
  });
};
//plugin /////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderTooltip = function (item){
  $(`${item} .tooltip-trigger`).each(function(idx, el){
    $(el).webuiPopover({
      multi:true,
      backdrop: $(el).is("[data-backdrop]"),
      closeable: $(el).is("[data-closeable]"),
      style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
      container: $(el).is("[data-container]") ? $(`${$(el).attr("data-container")}`) : false,
      onShow: function(){
        if($(el).is("[data-focus]")){
          $(el).addClass('focus');
        }
      },
      onHide: function(){
        if($(el).is("[data-focus]")){
          $(el).removeClass('focus');
        }
      }
    })
  })
}
const renderSelect2 = function () {
  $('select').select2({
    //placeholder: '값을 선택하세요',
    minimumResultsForSearch: Infinity,
    // dropdownAutoWidth: true,
    // width: 'auto',
    // dropdownParent: $('#myModal'),
  });

  $('select:disabled').select2({
    // placeholder: '값을 선택하세요',
    minimumResultsForSearch: Infinity,
    disabled: true,
    // dropdownAutoWidth: true,
    // width: 'auto',
  });

  for(var i = 0; i < $(".select2").length; i++){
    var select = $(".select2").eq(i);
    // if(select.parent().css("display") !== "flex"){ 
      select.css({"width": `${parseFloat(select.css("width")) + parseFloat(select.find(".select2-selection__rendered").css("paddingRight")) + parseFloat(select.find(".select2-selection__rendered").css("paddingLeft"))}`});
    // }
  }
};
const sliderMinCheck = function (item, min) {
  $(item).each(function (index, item) {
    // console.log('length' + $(this).find('.swiper-slide').length);
    if ($(this).find('.swiper-slide').length > min) {
      $(this).children('.slides').addClass('move');
    }
  });
};

/* 1차 오픈을 위해 필터링 처리 되어 있습니다. 교과서 이미지명 데이터가 들어가면 필터링 처리 됩니다.  데이터 바인딩 후 삭제하시면 됩니다. */
const gnbBookListFunc = function (menu_id, school) {
  initBookCover(school, menu_id);

  let current_id = $(menu_id).find('[data-grade].active').find('a').attr('href');
  let grade = $(menu_id).find('[data-grade].active').attr('data-grade');
  let revision = $(current_id).find('[data-revision]:checked').attr('data-revision');
  let semester = $(current_id).find('[data-semester].active').attr('data-semester');
  let filtercode = `${revision}-${school}-${grade}-${semester}`;

  $(document).on('click', '[data-grade]', function (e) {
    e.preventDefault();
    $(this).addClass('active').siblings('li').removeClass('active');
    $($(this).find('a').attr('href')).show().siblings().hide();
    current_id = $(this).find('a').attr('href');
    grade = $(this).attr('data-grade');
    revision = $(current_id).find('[data-revision]:checked').attr('data-revision');
    semester = $(current_id).find('[data-semester].active').attr('data-semester');
  });

  $(document).on('change', '[data-revision]', function () {
    revision = $(this).attr('data-revision');
    filtercode = `${revision}-${school}-${grade}-${semester}`;
    $(current_id).find('[data-filter]').attr('data-filter', filtercode);
    bookcodeFilter($(current_id).find('[data-filter]'), $(current_id).find('[data-filter]').attr('data-filter'));
  });

  $(document).on('click', '[data-semester]', function () {
    $(this).addClass('active').siblings('li').removeClass('active');
    semester = $(this).attr('data-semester');
    filtercode = `${revision}-${school}-${grade}-${semester}`;
    $(current_id).find('[data-filter]').attr('data-filter', filtercode);
    bookcodeFilter($(current_id).find('[data-filter]'), $(current_id).find('[data-filter]').attr('data-filter'));
  });
};
const initBookCover = function (school, menu_id) {
  let grades = $(menu_id).find('[data-grade]');

  for (var i = 0; i < grades.length; i++) {
    let current_id = grades.eq(i).find('a').attr('href');

    let grade = grades.eq(i).attr('data-grade');
    let revision = $(current_id).find('[data-revision]:checked').attr('data-revision');
    let semester = $(current_id).find('[data-semester].active').attr('data-semester');
    let code = `${revision}-${school}-${grade}-${semester}`;
    $(current_id).find('.lnb-contents').attr('data-filter', code);
    let cover = $(current_id).find('.lnb-contents').find('a');

    for (var j = 0; j < cover.length; j++) {
      cover.eq(j).attr('data-bookcode', createBookcode(cover.eq(j)));
    }
    bookcodeFilter($(current_id).find('[data-filter]'), $(current_id).find('[data-filter]').attr('data-filter'));
  }

  $($(menu_id).find('[data-grade].active a').attr('href')).show().siblings().hide();
};
const bookcodeFilter = function (box, code) {
  let cover = box.find('[data-bookcode]');
  for (var i = 0; i < cover.length; i++) {
    cover.eq(i).attr('data-bookcode').includes(code) ? cover.eq(i).show() : cover.eq(i).hide();
    let temp = cover.eq(i).attr('data-bookcode').split('-');
    if (temp[3] === '00') {
      cover.eq(i).show();
    }
  }
};
const createBookcode = function (obj) {
  let src = obj.find('img').attr('src');
  let split = src.split('/');
  let bookcode = split[split.length - 1].split('.')[0];

  return bookcode;
};

const selectFunc = function(){
  $(".dropdown-select").each(function(idx, el){
    if($(el).find(".options li.selected").length > 0){
      $(el).find(".select-button").html($(el).find(".options li.selected button").html());
    }
    var option_btn = $(el).find(".options li button");

    var total = 0;

    for(var i = 0; i < $(option_btn).length; i++){
      var this_btn = $(option_btn).eq(i);
      var sum = 0;
      
      
      for(var j = 0; j < $(this_btn).children().length; j++){
        var child = $(this_btn.children().eq(j));
        sum += Math.ceil(child.outerWidth()) + parseFloat($(el).find(".select-button").css("gap"));
      }

      if(sum > total){
        total = sum;
      }
    }
    
    $(el).css({"width": `${(total) + parseFloat($(el).find(".select-button").css("paddingLeft")) + parseFloat($(el).find(".select-button").css("paddingRight"))}px`});
    
    $(el).find(".options").hide();

    $(el).not(".disabled").find(".select-button").on("click", function(){
      let $this = $(this);
      let $options = $this.siblings(".options");

      $(el).addClass("active");
      $options.show().css({"opacity":"1"});

      if($options.find("li").hasClass("selected")){
        $options.find("li button").removeClass("hover");
        $options.find("li.selected button").addClass("hover");
      }

      $options.find("button").not(":disabled").on("mouseover", function(){
        $(this).addClass("hover").parent("li").siblings("li").find("button").removeClass("hover");
      });

      $options.find("button").on("click", function(){
        $(this).parent("li").addClass("selected").siblings("li").removeClass("selected");
        $(el).removeClass("active")
        $this.html($(this).html());
        $(this).parents(".options").hide();
      });

      $(document).on("click", function(e){
        if(!$(el).is(e.target) && $(el).has(e.target).length === 0){
          $(el).removeClass("active");
          $options.hide();
        }
      })
    });
  })
}
// swiper //////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderSwiper = function (){
  //슬라이더 갯수 체크 변수값 이상인 경우 슬라이더 동작하도록 .active 부여
  sliderMinCheck('.slider-view-auto', 9); 
  sliderMinCheck('.slider-view-auto.type-card', 5);
  sliderMinCheck('.review-slider', 3);
  // sliderMinCheck('.period-slider', 4);

  //main
  sliderMainVisual();
  sliderMyBook();
  sliderBanner();
  sliderBookmark('.slider-view-auto.type-bookmark .move', 'auto');
  sliderBookmark('.slider-view-auto.type-card .move', 'auto');
  sliderVertical();
  //common
  sliderQuickmenu();

  //sub
  sliderTextbookSpecialData();
  //  // 교과 차시창
  sliderNav('.nav-slider', 'auto', 0, 57); //item, view number, leftMargin, rightMargin
  sliderNav('.period-slider', 'auto', 0, 67); //item, view number, leftMargin, rightMargin
  sliderNav('.search-item-slider.move', 'auto', 40, 145); //item, view number, leftMargin, rightMargin
  sliderNav('.search-tab-slider', 5, 0, 0); //item, view number, leftMargin, rightMargin
  // sliderPeriod(); // 교과 차시창 footer

  // 특화자료실 사회 자료협조 슬라이더
  sliderLoop('.helpers-slider', 4, 8); //item, view number , gap
  
  // 쌤OTT 채널 슬라이더
  sliderPerView('.recommend-channel .slider', 6, 6, 36); //item, slidesPerView, slidesPerGroup, gap
  
  //고객센터 faq
  sliderFaq('.faq-section .slides', 5, 12); //item, view number , gap
  
  // 혁신수업 N
  // 독자후기
  sliderReview('.review-slider .slides.move', 3, 16); //item, view number , gap
  // 연도별 웹진 목록 탭슬라이더
  sliderWebzine('.webzine-slider', 5); //item, view number , gap

  //서비스 안내
  sliderService(".service-slider .slides");
  
  // M카이브 배너 슬라이더
  sliderDefault({item: ".banner-slider .slides", pagination: true,});
  
  // M카이브 gnb 슬라이더
  sliderDefault({item: ".header-mchive .gnb.slides", navigation: true, slidesPerView: 9, spaceBetween: 60,});
  sliderMinCheck('.header-mchive .gnb.slides', 9);
  
  // M카이브 팝업 슬라이더
  sliderDefault({item: ".ignore-duration .slides", navigation: true, pagination: true, autoHeight: true,});
}


const sliderDefault = function(obj){
  let options = {}

  if(obj.navigation === true){
    options.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
  }
  if(obj.pagination === true){
    options.pagination = {
      el: ".swiper-pagination",
      clickable: obj.pagination_clickable ? obj.pagination_clickable : true,
      type: obj.pagination_type ? obj.pagination_type : "bullets",
    }
  }

  if(obj.grid === true){
    options.grid = {
      fill: obj.grid_fill,
      rows: obj.grid_rows,
    }
  }

  options.slidesPerView = obj.slidesPerView ? obj.slidesPerView : 1;
  options.slidesPerGroup = obj.slidesPerGroup ? obj.slidesPerGroup : 1;
  options.spaceBetween = obj.spaceBetween ? obj.spaceBetween : 0;
  options.autoHeight = obj.autoHeight ? obj.autoHeight : false;

  const swiper = new Swiper(obj.item, options);
}

const sliderNav = function (item, count, leftMargin, rightMargin) {
  const swiper = new Swiper(item, {
    slidesPerView: count,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    mousewheel: true,
    keyboard: true,
    slidesOffsetBefore: leftMargin,
    slidesOffsetAfter: rightMargin,
    // cssMode: true,
    // freeMode: true,
      // watchSlidesProgress: true,
  });
};

const sliderQuickmenu = function () {
  if($('.quick-menu .swiper .slide-item').length > 1){
    $('.swiper-button-next , .swiper-button-prev').show();
    const swiper = new Swiper('.quick-menu .swiper', {
      speed: 400,
      loop: true,
      navigation: {
        // 버튼
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }else{
    $('.swiper-button-next , .swiper-button-prev').hide();
  };
};
const sliderMainVisual = function () {
  const $slider = $('.swiper.visual-slider');
  const mainVisualSwiper = new Swiper('.swiper.visual-slider', {
    speed: 400,
    effect: "fade",
    loop: true,
    autoplay: {
      disableOnInteraction: false,
    },
    navigation: {
      // 버튼
      nextEl: '.controller .button-next',
      prevEl: '.controller .button-prev',
    },
    on: {
      activeIndexChange: function () {
        var currentIndex = this.realIndex + 1;
        $slider.find('.this-index').html(`0${currentIndex}`);

        var slideLength = $slider.find('.swiper-slide:not(.swiper-slide-duplicate)').length;
        $slider.find('.last-index').html(`0${slideLength}`);

        var barThumbWidth = (100 / slideLength) * currentIndex;
        $slider.find('.bar-thumb').css('width', `${barThumbWidth}%`);
      },
    },
  });

  $slider.on('click','.button-player', function () {
    var str = $(this).find('use').attr('xlink:href');
    if ($(this).hasClass('pause')) {
      $(this).addClass('play').removeClass('pause').attr('title', '슬라이드 자동재생 재생');
      mainVisualSwiper.autoplay.stop();
      var replaced = str.replace('pause', 'play');
    } else if ($(this).hasClass('play')) {
      $(this).addClass('pause').removeClass('play').attr('title', '슬라이드 자동재생 정지');
      mainVisualSwiper.autoplay.start();
      var replaced = str.replace('play', 'pause');
    }
    $(this).find('use').attr('xlink:href', replaced);
  });
};
const sliderBookmark = function (item, count) {
  var mySwiper = new Swiper(item, {
    slidesPerView: count,
    // slidesOffsetBefore: 18,
    // slidesOffsetAfter: 18,
    rewind: true,
    loop: true,
    mousewheel: true,
    keyboard: {
      enabled: true,
    },
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    //   pauseOnMouseEnter: true,
    // },

    a11y: true,
    roundLengths: true,
    loopAdditionalSlides: 1, // 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
    // resistance: false, // 슬라이드 터치 저항 여부
    // slideToClickedSlide: true, // 해당 슬라이드 클릭시 슬라이드 위치로 이동
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};
const sliderMyBook = function () {
  const swiper = new Swiper('.swiper.mybook-slider', {
    speed: 400,
    loop: true,
    navigation: {
      // 버튼
      nextEl: '.mybook-slider .button-next',
      prevEl: '.mybook-slider .button-prev',
    },
  });
};
const sliderBanner = function () {
  const swiper = new Swiper('.swiper.banner-slider', {
    speed: 400,
    loop: true,
    pagination: {
      el: '.swiper-pagination.default-pagination',
      // clickable: true,
    },
    autoplay: {
      disableOnInteraction: true,
    },
  });

  $('.swiper-slide').on('mouseover', function () {
    swiper.autoplay.stop();
  });
  $('.swiper-slide').on('mouseleave', function () {
    swiper.autoplay.start();
  });
};
const sliderTextbookSpecialData = function () {
  const thisSlider = $('.swiper.special-data-body');
  const swiper = new Swiper('.swiper.special-data-body', {
    speed: 400,
    slidesPerView: 1,
    grid: {
      rows: 4,
    },
    navigation: {
      nextEl: '.special-data-pagination .button-next',
      prevEl: '.special-data-pagination .button-prev',
    },
    on: {
      beforeInit: function () {
        let slideLength = thisSlider.find('.swiper-slide').length;

        if (slideLength / 4 < 1) {
          $('.special-data-pagination').hide();
        }
      },
    },
  });
};

const sliderLoop = function(item, viewNo, gap) {
  const swiper = new Swiper(item, {
    slidesPerView: viewNo,
    spaceBetween: gap,
    // loop: true,
    // centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

const sliderPerView = function(item, viewNo, groupNo, gap) {
  const swiper = new Swiper(item, {
    slidesPerView: viewNo,
    slidesPerGroup: groupNo,
    spaceBetween: gap,
    // loop: loop,
    // centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    }
  });
}

const sliderVertical = function(){
  const swiper = new Swiper('.slider-vertical', {
    direction: "vertical",
    speed: 400,
    loop: true,
    autoplay: {
      disableOnInteraction: false,
    },

  });
}
// header site map slider
const sliderSiteMap = function () {
  const swiper = new Swiper('.site-map .slides', {
    speed: 400,
    slidesPerView: 10,
    spaceBetween: 8,
    mousewheel: true,
    navigation: {
      nextEl: '.site-map .swiper-button-next',
      prevEl: '.site-map .swiper-button-prev',
    },
  });
};

// 고객센터 faq slider
const sliderFaq = function(item, viewNo, gap) {
  const swiper = new Swiper(item, {
    speed: 800,
    slidesPerView: viewNo,
    spaceBetween: gap,
    loop: true,
    autoplay: true,
    centeredSlides: true,
    mousewheel: true,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// 혁신수업 N 독자후기 review-slider
const sliderReview = function(item, viewNo, gap) {
  const swiper = new Swiper(item, {
    speed: 800,
    slidesPerView: viewNo,
    spaceBetween: gap,
    loop: true,
    autoplay: true,
    centeredSlides: true,
    // mousewheel: true,
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    }
  });
}
// 혁신수업 N 연도별 웹진 목록 탭슬라이더 webzine-slider
const sliderWebzine = function(item, viewNo) {
  const swiper = new Swiper(item, {
    slidesPerView: viewNo,
    // loop: true,
    // centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

const sliderService = function(item){
  const swiper = new Swiper(item, {
    simulateTouch: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    }
  })
}

const sortCard = function(wrapper, name){
  let selector = $(wrapper).find(`[name=${name}]`);

  $(`[data-${name}]`).hide();

  for(var i = 0; i < selector.length; i++){
    if(selector.eq(i).prop("checked")){
      $(`[data-${name}="${selector.eq(i).attr("id")}"]`).show();
    }
  }

  selector.on("change", function(){
    $(`[data-${name}]`).hide();
    $(`[data-${name}="${$(this).attr("id")}"]`).show();
  });
}

const applytabletZoom = function() {
  var meta = $('meta[name="viewport"]');
  var content = meta.attr('content');
  var windowWidth = $(window).innerWidth();
  var zoomRatio = (windowWidth / 1400);
  // console.log("zoomRatio" + zoomRatio);

  if(zoomRatio < 1){
    meta.attr('content', content.replace(/initial-scale=[^\ ]+/gi, 'initial-scale=' + zoomRatio));
  }
}
/* -----------------popup------------------ */

let popupArr = [];

const setOptions = function(data){
  let obj = {};
  obj.id = data.id;
  obj.popup = $(`#${obj.id}`);
  obj.popup.find(".dimd").remove();
  obj.dimd = $("[showed-obj]").find(".dimd").length > 0 ? `<div class="dimd type-transparent"/>` : `<div class="dimd"/>`; /* close-obj 삭제로 변경됨.*/
  obj.is_dimd = obj.popup.is("[no-dimd]") ? false : obj.popup.prepend(obj.dimd);
  if(data.target){
    obj.btn = data.target;
    obj.btnType = obj.btn.is("[method-type]") ? obj.btn.attr("method-type") : "";
  }

  popupArr[popupArr.length] = obj;

  for(var i = 0; i < obj.popup.find("[close-obj]").length; i++){
    obj.popup.find("[close-obj]").eq(i).attr("close-obj", obj.id);
  }

  return obj;
}

const openPopup = function(obj){
  
  let object = setOptions(obj);
  
  
  object.popup.addClass("display-show");
  object.popup.attr("showed-obj", "");
  
  $('html').addClass('active-overlay');
  renderSelect2();
  selectFunc();
}

const closePopup = function(obj){
  for(var i = 0; i < popupArr.length; i++){
    if(popupArr[i].id === obj.id){
      popupArr[i].popup.removeClass("display-show");
      popupArr[i].popup.removeAttr("showed-obj");
      popupArr[i].popup.find(".dimd").remove();
          
      if(popupArr[i].btnType === "toggle"){
        popupArr[i].btn.removeClass("active");
      }
      
      popupArr.splice(i, 1);

    }
  }

  if(popupArr.length <= 0){
    $('html').removeClass('active-overlay');
  }
}

// init-show
$(window).on("load", function(){
  if($("[init-show]").length > 0){
    openPopup({id: $("[init-show]").attr("id")});
  }
})

// 기본 클릭 이벤트
$(document).on("click","[target-obj]:not([method-type])", function(){
  openPopup({id: $(this).attr("target-obj"), target: $(this)});
});

// 토글 클릭 이벤트
$(document).on("click","[target-obj][method-type='toggle']", function(){
  if($(this).hasClass("active")){
    $(this).removeClass("active");
    closePopup({id: $(this).attr("target-obj")});
  } else if(!$(this).hasClass("active")){
    $(this).addClass("active");
    openPopup({id: $(this).attr("target-obj"), target: $(this)});
  }
});

// 닫기 버튼 클릭 이벤트
$(document).on("click", "[close-obj]", function(){
  closePopup({id: $(this).attr("close-obj")});
});

$(document).on("click", ".filters [href]", function(e){
  e.preventDefault();
  let target = $(`${$(this).attr("href")}`);
  let pos = target.offset().top - ($(".header-contents").height() + 15);
  $(window).scrollTop(pos);
});
