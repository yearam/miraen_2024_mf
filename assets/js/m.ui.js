$(function () {
  $( document ).ready(function() {
    // renderLayout();
    renderCommonUI();
    renderPage();
    renderForm();
    renderPlugin();
  });
});

let sitemapObj = {};

//grouping function ////////////////////////////////////////////////////////////////////////////////////////////////
const renderCommonUI = function(){
  tabs('.tab');
  accordion('.accordion');
  filterFunc();
  accordionFilter();
}

const renderForm = function(){
  renderFileUpload('.file-upload');
  toggleThis('.toggle-this');
  toggleThis('.filter-items button');
  // toggleThis('.textbook-wrap .bookmark'); // 교과 즐겨찾기
  toggleGroup('header nav:not(.navigation-bar, .literature-book-nav)', 'a');
  toggleGroup('.nav-tab .buttons', '.button');
  toggleGroup('.sitemap .text-divider.semester', 'li');
  // toggleGroup('.grade-link', 'li');
  toggleGroup('.list-items.type-check', 'a');

  /* font적용 후 동작하기 위한 딜레이 */
  setTimeout(() => {
    selectFunc();
  }, 200);
}

const renderPage = function(){
  sortCard(".area-selector", "area");
  sortCard(".era-selector", "era");
  sortCard(".buttons.type-tab", "tabs");
  clearInput('.members');
};

const renderPlugin = function () {
  renderSelect2();
  renderSwiper();
  renderTooltip();

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

//Form render function //////////////////////////////////////////////////////////////////////////////////////////
const clearInput = function(target){
  var $input = $(target).find('input[type=search], input[type=text], input[type=password]').not(':disabled');
    
  for(var i = 0; i < $input.length; i++){
    $input.eq(i).wrap($('<div/>', {'class': "clear-container" + `${$input.eq(i).attr("class") !== undefined ? " " + $input.eq(i).attr("class") : ''}`})).after('<button type="button" class="button-clear"><svg><title>삭제</title><use href="/assets/images/svg-sprite-solid.svg#icon-close-round" /</svg></button></div>');
  }
  
  $(target).on('click', '.button-clear', function(e) {
    $(this).siblings('input').val("");
  });
}

const renderFileUpload = function (item) {
  // $(item).each(function (index, element) {
    var $placeholder = $(item).find("input[type='file']").attr('placeholder');
    $(item)
      .children('.inner-form')
      .prepend("<div class='placeholder'>" + $placeholder + '</div>');
  
    $(item).on('click','.placeholder', function () {
        $(this).parents(item).find("input[type='file']").trigger('click');
    });
  
    $(item).find("input[type='file']").on('change', function () {
        $(document).find(this).siblings('.placeholder').remove();
        $(this).addClass('text-black');
        // $(this).val();
    });
  // });

};
const toggleGroup = function (wrapper, target) {
  $(wrapper).each(function(idx, el){
    let counter = 0;
    for(var i = 0; i < $(el).find(target).length; i++){
      if($(el).find(target).eq(i).hasClass("active")){
        counter++;
      }
    }

    if(counter <= 0){
      $(el).find(target).eq(0).addClass("active")
    }

    $(el).on('click', target , function () {
      if ($(el).find(target).hasClass('active')) {
        $(this).siblings().removeClass('active');
      }
      $(this).addClass('active');
    });
  });
  
  // var $target = $(wrapper).find(target);
  //   $(wrapper).on('click', target , function () {
  //     if ($(wrapper).find('active')) {
  //       $(this).siblings().removeClass('active');
  //     }
  //     $(this).addClass('active');
  //   });
  // });
};
const toggleThis = function (target) {
  $(target).each(function (index, element) {
    $(this).on('click', function () {
      $(this).toggleClass('active');
    });
  });
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
    $(document).find(item).on('click','a', function (e) {
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

const renderTooltip = function (){
  $('.tooltip-trigger').each(function(idx, el){
    $(el).webuiPopover({
      multi:true,
      backdrop: $(el).is("[data-backdrop]"),
      closeable: $(el).is("[data-closeable]"),
      style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
      container: $(el).is("[data-container]") ? `.${$(el).attr("data-container")}` : false,
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
    dropdownAutoWidth: true,
    // width: 'auto',
    // dropdownParent: $('#myModal'),
  });

  $('select:disabled').select2({
    // placeholder: '값을 선택하세요',
    minimumResultsForSearch: Infinity,
    disabled: true,
    dropdownAutoWidth: true,
    // width: 'auto',
  });

  for(var i = 0; i < $(".select2").length; i++){
    var select = $(".select2").eq(i);
    // if(select.parent().css("display") !== "flex"){ 
      select.css({"width": `${parseFloat(select.css("width")) + parseFloat(select.find(".select2-selection__rendered").css("paddingRight")) + parseFloat(select.find(".select2-selection__rendered").css("paddingLeft"))}`});
    // }
  }
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

const filterFunc = function () {
  var $filterButton =  $('.filters > .buttons button');
  $filterButton.on('click', function (e) {
    let className = '.filter-items-' + this.name;
    $(this).parents('.filter-wrap').find('.filter-items').addClass('display-hide');
    if($(this).hasClass('active')) {
      $(this).removeClass('active');
      $(this).parents('.filter-wrap').find('.filter-items').removeClass('display-show');
      $(this).parents('.filter-wrap').find(className).removeClass('display-show');
    } else {
      $filterButton.removeClass('active');
      $(this).addClass('active');
      $(this).parents('.filter-wrap').find('.filter-items').addClass('display-show');
      $(this).parents('.filter-wrap').find('.filter-items').removeClass('display-show');
      $(this).parents('.filter-wrap').find(className).addClass('display-show');
      $(this).parents('.filter-wrap').find(className).removeClass('display-hide');
    }
  });
}

//창체 계기교육 필터 아코디언
const accordionFilter = function () {
  var $accordionButton = $('.accordion-filters').find('li > button');
  $accordionButton.on('click', function (e) {
    $(this).parents('li').toggleClass('active');
  });
}
// swiper //////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderSwiper = function (){
  //공통 게시판 필터
  sliderFilter('.filter-items .slides', 2, 2); //item, view number, group
  sliderMinCheck('.recommend .board-items .swiper-slide', 3);
  sliderPerView('.recommend .board-items .slides', 2, 2, 16);
  sliderMinCheck('.slider-board-item', 3);
  sliderMinCheck('.card-list-slider', 4);
  sliderEducation('.edu-slider .slides');
  sliderBookmark('.bookmark-wrap .slides');
  sliderNotice('.notice .slider-vertical');
  sliderMainVisual(); // 중등메인비주얼
  sliderDefault({item: ".slider-board-item .board-items .slides", navigation: true, pagination: true}); //item, arrows, pagination
  sliderDefault({item: ".helpers-slider .slides", navigation: true, slidesPerView: 2, spaceBetween: 4}); //item, arrows, pagination
  //사회 보물찾기 리스트(시대별)
  sliderDefault({
    item: ".card-list-slider .slides",
    navigation: true,
    pagination: true,
    grid: true,
    grid_fill: "row",
    grid_rows: 2,
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 8,
  }); //item, arrows, pagination
  sliderDefault({item: ".faq-section .slides", pagination: true, slidesPerView: 1.8, spaceBetween: 8});
  sliderDefault({item: ".popup-slider .slides", autoHeight : true, pagination: true, pagination_type: 'fraction'});
  sliderDefault({item: ".service-slider .slides", pagination: true});
  sliderDefault({item: ".recommend-channel .slider", pagination: true, slidesPerView: 3.275, spaceBetween: 12, loop: true});
  sliderDefault({item: ".review-slider .slides", pagination: true, navigation: true, spaceBetween: 20, allowTouchMove: false});
  sliderDefault({item: ".slider-banner .swiper", pagination: true});
}

// 슬라이더
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

  if(obj.loop === true){
    options.speed = obj.speed ? obj.speed : 400;
  }
  
  options.slidesPerView = obj.slidesPerView ? obj.slidesPerView : 1;
  options.slidesPerGroup = obj.slidesPerGroup ? obj.slidesPerGroup : 1;
  options.spaceBetween = obj.spaceBetween ? obj.spaceBetween : 0;
  options.autoHeight = obj.autoHeight ? obj.autoHeight : false;
  options.loop = obj.loop ? obj.loop : false;
  options.allowTouchMove = obj.allowTouchMove === false ? obj.allowTouchMove : true;

  const swiper = new Swiper(obj.item, options);
}

const sliderMinCheck = function (item, min) {
  $(item).each(function (index, el) {
    // console.log('length' + $(this).find('.swiper-slide').length);
    if ($(el).find('.swiper-slide').length > min) {
      $(el).addClass('move');
    }
  });
};

const sliderPerView = function(item, views, group, gap) {
  const swiper = new Swiper(item, {
    slidesPerView: views,
    slidesPerGroup: group,
    spaceBetween: gap,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// 나의 즐겨찾기 slider
const sliderBookmark = function(item) {
  const swiper = new Swiper(item, {
    speed: 800,
    slidesPerView: 2.8,
    spaceBetween: 8,
    loop: false,
    autoplay: false,
    centeredSlides: false,
    mousewheel: false,
    keyboard: {
      enabled: true,
    },
    slidesOffsetAfter: 20
  });
}

// 슬라이드배너 slider
const sliderBanner = function(item) {
  const swiper = new Swiper(item, {
    speed: 800,
    //slidesPerView: 1,
    loop: false,
    autoplay: true,
    centeredSlides: false,
    mousewheel: false,
    keyboard: {
      enabled: true,
    },
  });
}

// 계기교육 slider
const sliderEducation = function(item) {
  const swiper = new Swiper(item, {
    speed: 800,
    slidesPerView: 1.5,
    spaceBetween: 12,
    loop: false,
    autoplay: false,
    centeredSlides: false,
    mousewheel: false,
    slidesOffsetAfter: 20,
    keyboard: {
      enabled: true,
    }
  });
}

// 공지사항 slider
const sliderNotice = function(item) {
  const swiper = new Swiper(item, {
    direction: "vertical",
    speed: 500,
    loop: true,
    autoplay: {
      disableOnInteraction: false,
    }
  });
}

// 중등메인 메인비주얼 slider
const sliderMainVisual = function () {
  const $slider = $('.visual-slider');
  const mainVisualSwiper = new Swiper('.visual-slider', {
    autoHeight: true,
    speed: 400,
    loop: true,
    autoplay: {
      disableOnInteraction: false,
    },
    on: {
      activeIndexChange: function () {
        var currentIndex = this.realIndex + 1;
        $slider.find('.this-index').html(`${currentIndex}`);

        var slideLength = $slider.find('.swiper-slide:not(.swiper-slide-duplicate)').length;
        $slider.find('.last-index').html(`${slideLength}`);
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
  
  if(obj.id === "sitemap"){
    setTimeout(() => {
      sitemapScroll();
    }, 200);
  }

  $('body').addClass('active-overlay');
  
  object.popup.show();
  object.popup.attr("showed-obj", "");
  renderSelect2();
  selectFunc();
}

const closePopup = function(obj){
  for(var i = 0; i < popupArr.length; i++){
    if(popupArr[i].id === obj.id){
      popupArr[i].popup.hide();
      popupArr[i].popup.removeAttr("showed-obj");
      popupArr[i].popup.find(".dimd").remove();
    
      $('body').removeClass('active-overlay');

      if(popupArr[i].btnType === "toggle"){
        popupArr[i].btn.removeClass("active");
      }

      popupArr.splice(i, 1);
    }
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
  // 모바일 "교과서 > 수업하기" 에서 사용
  if($(this).data('btnname') === 'openclass') {
    if ($isLogin) {
      if ($('#userGrade').val() === '001') {
        classScreen.f.needAuthAlert();
      } else if ($('#userGrade').val() === '002'){
        // TO-BE 차시창 사용
        // const classLayerUrl = '/pages/ele/textbook/classLayer.mrn';

        // const masterSeq = classScreen.v.masterSeq;
        const masterSeq = classScreen.v.masterSeq = $(this).data('masterseq');
        const subjectSeq = $(this).data('subjectseq');
        const revisionCode = classScreen.v.subjectRevisionCode;

        // classLayer.js - setClassInfo
        classLayerScreen.f.loginCheck();
        classLayerScreen.v.subjectSeq = subjectSeq;
        if ($isLogin) {
          classLayerScreen.f.setClassInfo();
        }
        classLayerScreen.event();

        // clReplenishDataList.js
        clRepScreen.v.getTabListOption.masterSeq = masterSeq;
        clRepScreen.v.getTabListOption.subjectSeq = subjectSeq;
        clRepScreen.init();

        openPopup({id: $(this).attr("target-obj"), target: $(this)});

        // AS-IS 차시창 사용
        // let ticket = $('input[name="ticket"]').val();
        // const classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
        // const subjectSeq = $(this).data('subjectseq');
        // const urlWithParameters = `${classLayerUrl}${subjectSeq}&ticket=${ticket}`;
        // window.open(urlWithParameters, '_blank');
      }
    } else {
      classScreen.f.loginAlert();
    }
  } else if ($(this).data('btnname') === 'asisOpenclass') {
      // AS-IS 차시창 사용 (PC 참고)
      // let ticket = $('input[name="ticket"]').val();
      // let classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
      // const subjectSeq = $(this).data('subjectseq');
      // let urlWithParameters = `${classLayerUrl}${subjectSeq}&ticket=${ticket}`;
      // if(document.location.host == 'deve.m-teacher.co.kr' || document.location.host == 'localhost:8100' ){ // 로컬 OR dev 인 경우
      //     classLayerUrl = 'https://devele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
      // }
      // const lessonSeq = $(this).data('lessonseq') || '';
      // if(lessonSeq != ''){ // 2022년 개정교과의 경우 차시번호가 맞지 않아 구엠티처 차시번호 사용.
      //     urlWithParameters = `${classLayerUrl}${lessonSeq}&ticket=${ticket}`;
      // }
      // window.open(urlWithParameters, '_blank');

    // AS-IS 모바일 수업열기(playlist(subjectseq), user(miraenId), start(1부터 시작))
    if ($isLogin) {
      if ($('#userGrade').val() === '001') {
        classScreen.f.needAuthAlert();
      } else if ($('#userGrade').val() === '002') {
        const subjectSeq = $(this).data('subjectseq');
        const lessonSeq = $(this).data('lessonseq');
        const user = $('#miraenId').val();

        let qs = '';

        if (!!lessonSeq) { // 2022년 개정교과의 경우 차시번호가 맞지 않아 구엠티처 차시번호 사용.
          qs = `playlist=${lessonSeq}&user=${user}&start=1`;
        } else {
          qs = `playlist=${subjectSeq}&user=${user}&start=1`;
        }

        let classLayerUrl = `https://ele.m-teacher.co.kr/assets/viewer/mv2.html?${qs}`;

        window.open(classLayerUrl, '_blank');
      }
    }
    else {
      classScreen.f.loginAlert();
    }
  } else {
    openPopup({id: $(this).attr("target-obj"), target: $(this)});
  }
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

// 사이트맵 클릭 이벤트
$(document).one("click", "[target-obj='sitemap']", function(){
  setTimeout(() => {
    sitemapScrollObject($(`#${$(this).attr("target-obj")}`));
  }, 100);
})


// 닫기 버튼 클릭 이벤트
$(document).on("click", "[close-obj]", function(){
  closePopup({id: $(this).attr("close-obj")});
});

/* ---------------sitemap---------------- */
/* 스크롤 연결하기!! */

const sitemapScrollObject = function(wrapper){
  sitemapObj.nav = {};
  sitemapObj.nav.el = wrapper.find(".nav-container");
  sitemapObj.nav.top = sitemapObj.nav.el.position().top;
  sitemapObj.nav.bottom = sitemapObj.nav.top + sitemapObj.nav.el.outerHeight();
  sitemapObj.nav.item = [];

  for(var i = 0; i < sitemapObj.nav.el.find(".nav-item").length; i++){
    var obj = {};
    obj.el = sitemapObj.nav.el.find(".nav-item").eq(i);
    obj.pos = Math.ceil(obj.el.position().top);
    sitemapObj.nav.item[i] = obj;
  }

  sitemapObj.tab = {};
  sitemapObj.tab.el = wrapper.find(".nav-tab");
  sitemapObj.tab.scrollWrap = sitemapObj.tab.el.find(".scrollable-x");  
  sitemapObj.tab.item = []
  
  var scrollWrap_width = 0;
  for(var i = 0; i < sitemapObj.tab.scrollWrap.find("[href]").length; i++){
    var obj = {};
    obj.el = sitemapObj.tab.scrollWrap.find("[href]").eq(i);
    obj.pos = Math.ceil(Math.ceil(obj.el.position().left) + (obj.el.outerWidth() / 2));
    if(i >= sitemapObj.tab.scrollWrap.find("[href]").length - 1){
      scrollWrap_width += obj.el.outerWidth();
      } else {
      scrollWrap_width += obj.el.outerWidth() + parseFloat(sitemapObj.tab.scrollWrap.find(".buttons").css("gap"));
    }

    sitemapObj.tab.item[i] = obj;
  }

  sitemapObj.tab.scrollWrap.width = scrollWrap_width;

  for(var i = 0; i < sitemapObj.tab.item.length; i++){
    if(sitemapObj.tab.item[i].el.hasClass("active")){
      sitemapObj.itemIdx = i;
    }
  }
}

const sitemapScroll = function(){
  let animateSpeed = 400;
  
  const tabArrowVisibleFunc = function(){
    if(sitemapObj.tab.scrollWrap.width <= $(sitemapObj.tab.scrollWrap).outerWidth()){
      $(sitemapObj.tab.el).find(".icon-button").hide();
    } else {
      $(sitemapObj.tab.el).find(".icon-button").show();
      if($(sitemapObj.tab.scrollWrap).scrollLeft() <= 0){
        $(sitemapObj.tab.el).find(".icon-button.prev").hide();
      } else if($(sitemapObj.tab.scrollWrap).scrollLeft() >= sitemapObj.tab.scrollWrap.width - sitemapObj.tab.scrollWrap.outerWidth()){
        $(sitemapObj.tab.el).find(".icon-button.next").hide();
      }
    }
  }

  const tabActiveFunc = function(el, idx){
    el.addClass("active").siblings().removeClass("active");
    let scrollPos = sitemapObj.tab.item[idx].pos - (sitemapObj.tab.el.outerWidth() / 2);
    $(sitemapObj.tab.scrollWrap).stop().animate({scrollLeft: `${scrollPos}`}, animateSpeed);
  }

  $(sitemapObj.tab.el).find(".icon-button").off().on("click", clickHandler = function(){
    $(sitemapObj.nav.el).off("scroll");

    if(sitemapObj.itemIdx > 0 && $(this).hasClass("prev")){
      sitemapObj.itemIdx--;
      $(sitemapObj.nav.el).stop().animate({scrollTop: `${sitemapObj.nav.item[sitemapObj.itemIdx].pos - ($(sitemapObj.tab.el).position().top + ($(sitemapObj.tab.el).outerHeight()))}`}, animateSpeed);
      tabActiveFunc(sitemapObj.tab.item[sitemapObj.itemIdx].el, sitemapObj.itemIdx);
    } else if (sitemapObj.itemIdx < (sitemapObj.tab.item.length - 1) && $(this).hasClass("next")){
      sitemapObj.itemIdx++;
      $(sitemapObj.nav.el).stop().animate({scrollTop: `${sitemapObj.nav.item[sitemapObj.itemIdx].pos - ($(sitemapObj.tab.el).position().top + ($(sitemapObj.tab.el).outerHeight()))}`}, animateSpeed);
      tabActiveFunc(sitemapObj.tab.item[sitemapObj.itemIdx].el, sitemapObj.itemIdx);
    }
    $(this).off("click");
    setTimeout(() => {
      $(this).on("click", clickHandler);
      $(sitemapObj.nav.el).on("scroll", navScrollHandler);
    }, animateSpeed);
  });

  $(sitemapObj.nav.el).off("scroll").on("scroll", navScrollHandler = function(){
    /* 가장 밑에 닿을 때 */
    if(sitemapObj.nav.item[sitemapObj.nav.item.length - 1].el.position().top + sitemapObj.nav.item[sitemapObj.nav.item.length - 1].el.outerHeight() <= sitemapObj.nav.bottom
    && sitemapObj.nav.item[sitemapObj.nav.item.length - 1].el.outerHeight() < sitemapObj.nav.el.outerHeight()){
      sitemapObj.itemIdx = sitemapObj.nav.item.length - 1;
      tabActiveFunc(sitemapObj.tab.item[sitemapObj.itemIdx].el, sitemapObj.itemIdx);
    } else { /* 나머지 */
      if((sitemapObj.itemIdx + 1) < sitemapObj.nav.item.length && sitemapObj.nav.item[sitemapObj.itemIdx + 1].el.position().top <= sitemapObj.nav.top){
        sitemapObj.itemIdx++;
        tabActiveFunc(sitemapObj.tab.item[sitemapObj.itemIdx].el, sitemapObj.itemIdx);
      }
      if(sitemapObj.itemIdx > 0 && sitemapObj.nav.item[sitemapObj.itemIdx - 1].el.position().top + sitemapObj.nav.item[sitemapObj.itemIdx - 1].el.outerHeight() > sitemapObj.nav.top){
        sitemapObj.itemIdx--;
        tabActiveFunc(sitemapObj.tab.item[sitemapObj.itemIdx].el, sitemapObj.itemIdx);
      }
    }
  });

  /* tab눌렀을 때 */
  $(sitemapObj.tab.el).find("[href]").on("click", function(){
    sitemapObj.itemIdx = $(this).index();
    $(sitemapObj.nav.el).off("scroll", navScrollHandler);
    $(sitemapObj.nav.el).stop().animate({scrollTop: `${sitemapObj.nav.item[sitemapObj.itemIdx].pos - ($(sitemapObj.tab.el).position().top + ($(sitemapObj.tab.el).outerHeight()))}`}, animateSpeed);
    setTimeout(() => {
      $(sitemapObj.nav.el).on("scroll", navScrollHandler);
    }, animateSpeed);

    tabActiveFunc($(this), sitemapObj.itemIdx);
  });

  $(sitemapObj.tab.scrollWrap).on("scroll", function(){
    tabArrowVisibleFunc();
  })

  tabArrowVisibleFunc();

  $(window).on("resize", function(){
    sitemapObj.nav.bottom = sitemapObj.nav.bottom = sitemapObj.nav.top + sitemapObj.nav.el.outerHeight();
    tabArrowVisibleFunc();
  });
}


/* -----------------Swiper------------------ */
//공통 게시판 필터
const sliderFilter = function (item, viewNo, group) {
  const swiper = new Swiper(item, {
    slidesPerView: viewNo,
    grid: {
      fill: "row",
      rows: 3,
    },
    slidesPerGroup: group,
    loopFillGroupWithBlank: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
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

$(document).on("click", ".accordion-filters [href]", function(e){
  e.preventDefault();
  let target = $(`${$(this).attr("href")}`);
  let pos = target.offset().top - ($("header").height() - parseFloat(target.css("borderWidth")));
  $(window).scrollTop(pos);
})