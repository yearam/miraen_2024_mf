$(function () {
  let screen = {
    v: {
      commonDomain: null,
      isLogin: false,
      userRight: null,

    },

    c: {},

    f: {
      setMybookInfo: () => {
        const activeInput = $(".swiper .swiper-slide-active input");
        const smartPpt = $("#smartPpt");

        const name = activeInput.data("name");
        const url = activeInput.data("url");
        const revision = activeInput.data("year");
        const isPpt = activeInput.data("pptyn") === "Y";
        const pptUrl = activeInput.data("ppturl");

        $(".book-title p").text(`${revision}개정`);
        $(".book-title h4").text(name);

        $("#textUrl").attr("href", url);

        if (isPpt) {
          smartPpt.show();
          smartPpt.attr("href", pptUrl);
        } else smartPpt.hide();
      },

      mouseSlide: () => {
        const curRevision = $(".book-title p").text();
        const curName = $(".book-title h4").text();

        const activeInput = $(".swiper .swiper-slide-active input");
        const activeName = activeInput.data("name");
        const activeRevision = `${activeInput.data("year")}개정`;

        if (!(curRevision === activeRevision && curName === activeName)) {
          screen.f.setMybookInfo();
        }
      },

      openSetFavorite: (e) => {
        if (!$isLogin) {
          $(e.currentTarget).removeClass('active');
          $alert.open('MG00001');
          return;
        } else {
            $('button[name=setFavMid]').attr("target-obj", "popupBookMark");
            $('#setFavoriteForm').append($('<input>', {
                type: "hidden",
                name: "subjectLevelCode",
                value: "MIDDLE"
            }));
            $('#setFavoriteForm').append($('<input>', {
                type: 'hidden',
                name: 'urlLevel',
                value: '/mid/'
            }));
            $('#setFavoritePopup').removeAttr("src");
            // $('#popupBookMark').addClass("display-show");
            $('#setFavoriteForm').submit();
            $('#loading').addClass("display-show");
        }
      },

      goSmartPpt: (e) => {
        e.preventDefault();

        if (screen.v.userRight !== "0010") $alert.open("MG00003");
        else window.open(e.currentTarget.href);
      },

      noMybook: () => {
        if (screen.v.isLogin) $("button[name=setFavMid]").trigger("click");
        else $alert.open("MG00001");
      },

    },

    event: () => {

      // 내 교과서 > swiper > 버튼
      $(".swiper .slider-button").off("click").on("click", screen.f.setMybookInfo);

      // 내 교과서 > swiper > 마우스
      $(".swiper-slide").on("mouseenter mouseleave", screen.f.mouseSlide);

      // 내 교과서 > 스마트 수업
      $("#smartPpt").off("click").on("click", screen.f.goSmartPpt);

      // 내 교과서 > 즐겨찾기 없을 때 이미지 클릭
      $("#no-mybook").off("click").on("click", screen.f.noMybook);

      // 즐겨찾기 > 설정
      $("button[name=setFavMid]").off("click").on("click", screen.f.openSetFavorite);

      // 즐겨찾기 설정 이벤트
      $('#setFavoritePopup').on('load', function () {
        // 취소 버튼
        $(this).contents().find('#cancelBtn').off().on("click", () => {
          $alert.open("MG00019", () => {
            $('#popupBookMark').removeClass('display-show');
            $('#setFavoritePopup').attr('src', 'about:blank');
            window.scrollTo(0, 0);
            location.reload();
          });
        });

        // 닫기 버튼
        $(this).contents().find('#closeBtn').off().on("click", () => {
          $('#popupBookMark').removeClass('display-show');
          $('#setFavoritePopup').attr('src', 'about:blank');
          $('body').removeClass('active-overlay');

          window.scrollTo(0, 0);
          location.reload();
        });

        $('#loading').removeClass("display-show");
      });

      if(!$isLogin){
        // 혁신수업 로그인 로직 추가
        //$(".innovation  a").prop("href", "javascript:void(0)").prop("target","").on("click", function(){
        //  $alert.open('MG00001');
        //});
      }

    },


    init: () => {
      screen.v.commonDomain = $("#gHostCommon").val();
      screen.v.isLogin = $("#isLogin").val() === "true";
      screen.v.userRight = $("#userRight").val();

      screen.f.setMybookInfo();

      screen.event();

    },
  };

  screen.init();
});