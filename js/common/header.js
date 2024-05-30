$(function () {
  let screen = {
    v: {
      /*
      * EL - 영어
      * KO - 국어
      * SO - 사회
      * SI - 과학 (코드 SC)
      * MT - 수학 (코드 MA)
      * EI - 도덕 (코드 MO)
      * PC - 체육 (코드 PE)
      * AT - 미술 (코드 AR)
      * MU - 음악 (코드 MU)
      * */
      subjectCode: {
        'EL': 'EL',
        'KO': 'KO',
        'KOA': 'KO',
        'KOB': 'KO',
        'SO': 'SO',
        'SC': 'SC',
        'MA': 'MA',
        'MO': 'MO',
        'PC': 'PC',
        'AR': 'AR',
        'MU': 'MU',
        'PE': 'PE'
      },
      // icon-favorite-link.svg
      mainFavoriteList: [],
      gHostCommon: $('[id=gHostCommon]').val()

    },

    c: {

      /**
       *  나의 즐겨찾기 목록 가져오기
       *
       * @memberOf getMainFavoriteList
       */
      getMainFavoriteList: () => {
        const options = {
          method: 'GET',
          url: '/pages/ele/main/getMainFavoriteList.ax',
          data: {
            subjectLevelCode: 'ELEMENT',
          },
          success: function (res) {
            console.log(res);
            screen.v.mainFavoriteList = res?.rows;

            if (res.rows) {
              screen.f.setMainFavoriteList();

              screen.f.sliderMinCheck('.slider-view-auto', 9);

              screen.f.sliderSiteMap();

            }
          }
        };

        $.ajax(options);
      },
    },

    f: {

      // 나의 즐겨찾기 리스트 뿌려주기
      setMainFavoriteList: () => {
        const favoriteListWrap = $('header[school-grade="ELEMENT"] .slider-view-auto');
        const favoriteList = $('header[school-grade="ELEMENT"] .swiper-wrapper');

        $(favoriteList).empty();

        screen.v.mainFavoriteList.map((data, k) => {
          let res = '';

          if (data.favoriteType === "MRN" || data.favoriteType === "VIEW") {
            // 미래엔 교과서
            res = `
              <a href="${data?.favoriteUrl}" class="swiper-slide">
                <div class="images">
                  <img src="/assets/images/elementary/icon-${screen.v.subjectCode[data?.subjectCode] ? 'subject-' + screen.v.subjectCode[data?.subjectCode] : 'external'}.svg" alt="과목 아이콘" />
                </div>
                <div class="inner-wrap">
                  <p class="title">${data?.textbookName}</p>
                  <p class="desc text-xs">미래엔</p>
                </div>
              </a>
            `
          } else if (data.favoriteType === "OTHER") {
            // 타사교과서
            res = `
              <a href="${data?.favoriteUrl}" class="swiper-slide" target="_blank">
                <div class="images">
                  <img src="/assets/images/elementary/icon-${screen.v.subjectCode[data?.subjectCode] ? 'subject-' + screen.v.subjectCode[data?.subjectCode] : 'external'}.svg" alt="과목 아이콘" />
                </div>
                <div class="inner-wrap">
                  <p class="title">${data.textbookName}</p>
                  <p class="desc text-xs">${data?.publisherName}</p>
                </div>
              </a>
            `
          } else if (data.favoriteType === "MTEACHER") {
            // 서비스
            res = `
              <a href="${data.favoriteUrl}" class="swiper-slide">
                <div class="images">
                  <img src="/assets/images/elementary/icon-${screen.v.subjectCode[data?.subjectCode] ? 'subject-' + screen.v.subjectCode[data?.subjectCode] : 'external'}.svg" alt="과목 아이콘" />
                </div>
                <div class="inner-wrap">
                  <p class="title">${data.textbookName}</p>
                </div>
              </a>
            `
          } else if (data.favoriteType === "LINK") {
            // 링크
            res = `
              <a href="${data.favoriteUrl}" class="swiper-slide" target="_blank">
                <div class="images">
                  <img src="/assets/images/elementary/icon-favorite-link.svg" alt="링크 즐겨찾기 아이콘" />
                </div>
                <div class="inner-wrap">
                  <p class="title">${data.favoriteName}</p>
                </div>
              </a>
            `
          }

          $(favoriteList).append(res);
        })

        $(favoriteListWrap).append(`
          <div class="swiper-buttons">
            <button class="swiper-button-prev"></button>
            <button class="swiper-button-next"></button>
          </div>
        `)
      },

      moveTotalSearch: function (e) {
        const hostUrl = screen.v.gHostCommon;

        if (!$('header[data-type="totalsearch-header"]').length) {
          let totalSearchUrl = '/pages/common/totalsearch/totalSearch.mrn'
          let searchVal = '';
          const headerSchoolGrade = $(e.currentTarget).closest('header').attr('school-grade');
          let schoolLevel = headerSchoolGrade === 'MIDDLE' ? 'mid' : headerSchoolGrade === 'HIGH' ? 'high' : 'ele';

          if ($('.search-inner > input').length || $('.search-box > input[type="search"]').length) {
            if ($('.search-inner > input').val()) {
              searchVal = $('.search-inner > input').val();
            } else {
              searchVal = $('.search-box > input[type="search"]').val();
            }

            const totalSearchUrlWithParam = hostUrl + totalSearchUrl + `?searchTxt=${encodeURIComponent(searchVal)}&schoolLevel=${schoolLevel}`

            console.log("searchVal", searchVal)

            let link = document.createElement("a");

            link.target = "_blank";
            link.href = totalSearchUrlWithParam;

            link.click();
            link.remove();
          }
        }
      },

      // header site map slider
      sliderSiteMap: function () {
        new Swiper('.site-map .slides', {
          speed: 400,
          slidesPerView: 10,
          spaceBetween: 8,
          mousewheel: true,
          navigation: {
            nextEl: '.site-map .swiper-button-next',
            prevEl: '.site-map .swiper-button-prev',
          },
        });
      },

      sliderMinCheck: function (item, min) {
        $(item).each(function (index, item) {
          // console.log('length' + $(this).find('.swiper-slide').length);
          if ($(this).find('.swiper-slide').length > min) {
            $(this).children('.slides').addClass('move');
          }
        });
      }

    },

    event: function () {
      document?.getElementById('mteacherDirect')?.addEventListener('click', function () {
        // 클릭 이벤트가 발생했을 때 수행할 동작
        const modal = document.getElementById('mteacher-shortcut');
        modal.style.display = 'block';
        // 여기에 원하는 동작을 추가하면 됩니다.
      });

      $('#mteacher-shortcut').find('[data-id=close]').on('click', () => {
        $('#mteacher-shortcut').hide();
      });


      $(document).ready(function () {

        $('#addFavorites').on('click', function (e) {

          var bookmarkURL = window.location.href;

          var bookmarkTitle = document.title;

          var triggerDefault = false;


          if (window.sidebar && window.sidebar.addPanel) {

            // Firefox version < 23

            window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');

          } else if ((window.sidebar && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) || (window.opera && window.print)) {

            // Firefox version >= 23 and Opera Hotlist

            var $this = $(this); $this.attr('href', bookmarkURL);

            $this.attr('title', bookmarkTitle);

            $this.attr('rel', 'sidebar');

            $this.off(e);

            triggerDefault = true;

          } else if (window.external && ('AddFavorite' in window.external)) {

            // IE Favorite

            window.external.AddFavorite(bookmarkURL, bookmarkTitle);

          } else {
            // WebKit - Safari/Chrome

            alert((navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D 키를 눌러 즐겨찾기에 등록하실 수 있습니다.');

          }


          return triggerDefault;

        });

      });

      // 커서 포인터 임시 추가 (href="") html에 직접 넣은 경우 페이지 리로드됨
      $('#mteacherDirect').css("cursor", "pointer");
      $('#addFavorites').css("cursor", "pointer");


      // 초등 GNB - 즐겨찾기 영역
      $('header[school-grade="ELEMENT"] .site-map .icon-button').off('click').on('click', screen.c.getMainFavoriteList)

      // 검색영역 클릭시 alert (무조건 막음 처리)
      // $('.search-inner > input, .search-inner > button, .search-box > input[type="search"], .search-box > button').on("click", () => {
      //   if (!$('header[data-type="totalsearch-header"]').length) {
      //     $alert.open("MG00059");
      //   }
      // })

      // 초중고 헤더 검색창에서 검색시 통합검색 페이지 연결
      $('.search-inner > input, .search-box > input[type="search"]').on("click", (e) => {
        if ($('#totalsearchYn').val() === 'false' && !window.location.href.includes('totalSearch.mrn') && !window.location.href.includes('totalPageSearch.mrn')) {
          $alert.open("MG00059");
        }
      });

      $('.search-inner > button, .search-box > button').on("click", (e) => {
        console.log("totalsearchYn: ", $('#totalsearchYn').val());
        if ($('#totalsearchYn').val() === 'true' || window.location.href.includes('totalSearch.mrn') || window.location.href.includes('totalPageSearch.mrn')) {
          screen.f.moveTotalSearch(e);
        } else {
          $alert.open("MG00059");
        }
      });

      $('.search-inner > input, .search-box > input[type="search"]').on("keypress", (e) => {
        if (e.which === 13) {
          console.log("totalsearchYn: ", $('#totalsearchYn').val());
          e.preventDefault();
          if ($('#totalsearchYn').val() === 'true' || window.location.href.includes('totalSearch.mrn') || window.location.href.includes('totalPageSearch.mrn')) {
            screen.f.moveTotalSearch(e);
          } else {
            $alert.open("MG00059");
          }
        }
      });


    },

    init: function () {
      console.log('header init!');
      screen.event();


    },
  };
  screen.init();
});