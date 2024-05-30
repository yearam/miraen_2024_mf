$(function () {
  let screen = {
    v: {
      areaFileId: 'FILE-ELE-AREA-',
      areaIdNum: '01',
      eraFileId: 'FILE-ELE-ERA-',
      eraIdNum: '01'
    },

    c: {

    },

    f: {

      sliderGrid: (item, view, row, group, gap) => {
        const swiper = new Swiper(item,
          {
            slidesPerView: view,
            grid:
            {
              fill: "row",
              rows: row,
            },
            slidesPerGroup: group,
            spaceBetween: gap,
            navigation:
            {
              nextEl: `.swiper-button-next`,
              prevEl: `.swiper-button-prev`,
            },
            pagination:
            {
              el: `.swiper-pagination`,
              clickable: true,
            },
            on:
            {
              beforeInit: function () {
                for (var i = 0; i < $(item).length; i++) {
                  let slideLength = $(item).eq(i).find('.swiper-slide').length;
                  if (slideLength / (view * row) <= 1) {
                    $(item).eq(i).siblings('.swiper-button-next').addClass("disabled").hide();
                    $(item).eq(i).siblings('.swiper-button-prev').addClass("disabled").hide();
                  }
                  else {
                    $(item).eq(i).parent(".card-list-slider").addClass("move");
                  }
                }
              },
            },
          });
      },

      // single file 다운로드
      downSingleFile: (downloadLink) => {
        let link = document.createElement("a");

        link.target = "_blank";
        link.href = `${downloadLink}`;
        link.click();
        link.remove();
      },

      checkRight: () => {
        let isRight = false;

        /*
        * 정회원 0010
          준회원 0020
          일반회원 0030
          예비교사 회원 0040
          학원 강사 회원 0050
        * */

        if ($('#boardRight').val() === "0010") {
          isRight = true;
        }

        return isRight
      },

      // 권한 체크 후 다운로드
      fileDownloadAfterRightCheck: (e) => {
        e.preventDefault();

        const link = $(e.currentTarget).attr('href');

        if (!$isLogin) {
          $alert.open('MG00001');
          return;
        }

        const isRight = screen.f.checkRight();

        if (isRight) {
          screen.f.downSingleFile(link);
        } else {
          $alert.open('MG00047');
          return;
        }

      },

      // 카테고리 필터 팝업에서 검색시 데이터 세팅
      setFilter: (type) => {
        let id = $('.popup-sheet input:radio[name^=' + type + ']:checked').data('id');

        if (type == 'area') {
          screen.v.areaIdNum = id.split('-')[1].padStart(2, '0');
          closePopup({id: 'pop-area'});
        } else {
          screen.v.eraIdNum = id.split('-')[1].padStart(2, '0');
          closePopup({id: 'pop-era'});
        }

        $(`[data-${type}]`).hide();
        $(`[data-${type}="${id}"]`).show();

        $(`.filter-wrap .filters input:radio[id=${id}]`).prop('checked', true);
      }

    },

    event: function () {

      // 퍼블리싱 js
      screen.f.sliderGrid('.card-list-slider .slider', 4, 2, 4, 16);


      /**
       * 지역별 카드
       * */

      // 지역별 카드 > 선택된 지역
      $(document).on('click', '.area-selector input[name=area]', function () {
        const areaId = $(this).attr('id');
        screen.v.areaIdNum = areaId.split('-')[1].padStart(2, '0');
      });

      $(document).on('click', 'button[name=searchBtn]', function () {
        const type = $(this).data('type');
        screen.f.setFilter(type);
      });

      // 지역별 카드 > 카드 다운로드 (전체, 지역별)
      $(document).on('click', '#downloadAreaAll', screen.f.fileDownloadAfterRightCheck);

      /*$(document).on('click', 'section[data-area] .inner-header button', screen.f.areaFileDownload);*/
      $(document).on('click', 'section[data-area] .inner-header a', screen.f.fileDownloadAfterRightCheck);


      /**
       * 시대별 카드
       * */

      // 시대별 카드 > 선택된 시대
      $(document).on('click', '.era-selector input[name=era]', function () {
        const eraId = $(this).attr('id');
        screen.v.eraIdNum = eraId.split('-')[1].padStart(2, '0');
      });

      // 시대별 카드 > 카드 다운로드 (전체, 시대별)
      $(document).on('click', '#downloadEraAll', screen.f.fileDownloadAfterRightCheck);

      /*$(document).on('click', 'section[data-era] .inner-header button', screen.f.eraFileDownload);*/
      $(document).on('click', 'section[data-era] .inner-header a', screen.f.fileDownloadAfterRightCheck);

    },

    init: function () {
      console.log('문화유산 - init!');
      screen.event();
    },
  };
  screen.init();
});