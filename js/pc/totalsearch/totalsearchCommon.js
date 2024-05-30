/**
 * 통합검색 공통 클래스
 * 해당 클래스로 객체 생성 후 개발 진행
 * 
 * 검색엔진 요청 case : 검색버튼, 재검색버튼, 키워드추가, my on/off, 초중고 탭, 필터 체크박스
 * 초중고 탭 이동 시 하단탭 전체로 초기 세팅
 * 하단 탭 이동 시 검색필터 좌측전체 체킹상태로 초기 세팅
 */
class Totalsearch {
  constructor() {
    this.appendCategory = function (tabId, $el) {
      $(`${tabId} ul.accordion .filter-wrap`).empty();
      $(`${tabId} ul.accordion .filter-wrap`).append($el);
    };
    this.appendResult = function (tabId, $el) {
      $(`${tabId} div[name=searchResultArea]`).empty();
      $(`${tabId} div[name=searchResultArea]`).append($el);
    };
    this.totalCountAll = 0;
    this.totalCountResult = {};
    this.searchResult = {};

    // 통합 검색 API 호출
    this.getTotalsearchResult = function (param, callback) {
      const data = screen.f.searchKeywordSetting(param);

      // 검색창에 입력어가 없다면 -> 검색어를 입력해주세요
      if (!screen.v.param.keyword) {
        $alert.open('MG00074');
        $('html').removeClass('active-overlay');
        return;
      } else {

        const options = {
          url: '/pages/common/totalsearch/getTotalsearchResultList.ax',
          method: 'GET',
          data: data,
          success: function (res) {
            this.totalCountAll = res.row.totalCount;
            this.totalCountResult = res.row.totalCountResult;
            this.searchResult = res.row.searchResult;
            if (!_.isNil(callback) && typeof callback === 'function') {
              callback(res);
              $('.detailed-search .search-inner > h2').text(`검색결과 총 ${res.row.totalCount.toLocaleString()}건`);
            }
          }
        };

        $cmm.ajax(options);
      }

    };

    // 통합 검색 API 호출 (비동기 처리)
    this.getTotalsearchResultAsync = async (param, callback) => {

      const data = screen.f.searchKeywordSetting(param);

      // 검색창에 입력어가 없다면 -> 검색어를 입력해주세요
      if (!screen.v.param.keyword) {
        $alert.open('MG00074');
        $('html').removeClass('active-overlay');
        return;
      } else {
        return new Promise((resolve, reject) => {
          $cmm.ajax({
            url: '/pages/common/totalsearch/getTotalsearchResultList.ax',
            type: 'GET',
            data: data,
            success: (res, textStatus, jqXHR) => {

              this.totalCountAll = res.row.totalCount;
              this.totalCountResult = res.row.totalCountResult;
              this.searchResult = res.row.searchResult;

              if (!_.isNil(callback) && typeof callback === 'function') {
                callback(res);
                $('.detailed-search .search-inner > h2').text(`검색결과 총 ${res.row.totalCount.toLocaleString()}건`)
              }

              resolve({ res, textStatus, jqXHR });
            },
            error: (jqXHR, textStatus, error) => {
              console.error("error occurred");
              reject(error);
              // jqXHR, textStatus, error 를 Wrapping 한다.
              // ex: new RestError({jqXHR, textStatus, error});
            }
          });
        });
      }


    };

    // 쪽검색 API 호출 (비동기 처리)
    this.getTotalsearchPageResultAsync = async (param, callback) => {
        return new Promise((resolve, reject) => {
          $cmm.ajax({
            url: '/pages/common/totalsearch/getTotalsearchResultList.ax',
            type: 'GET',
            data: param,
            success: (res) => {
              if (!_.isNil(callback) && typeof callback === 'function') {
                callback(res);
              }
              resolve({res});
            },
            error: (jqXHR, textStatus, error) => {
              console.error("error occurred");
              reject(error);
            }
          });
        });
    };


    this.getMenuList = function (param, callback, type) {
      let keywordList = '';

      if (type === 'init') {
        console.log("type === init: ", screen.v.mainKeyword);
        keywordList += screen.v.mainKeyword;
        param.keyword = screen.v.mainKeyword;
      } else {
        screen.v.keywords.forEach((item, index) => {
          keywordList += `${index === 0 ? '' : ' '}${item}`;
        })
        param.keyword = JSON.stringify(keywordList);
        // console.log("type !== init: ", keywordList)
      }

      param.siteType = screen.v.schoolLevel;
      // console.log("전송 param: ", param)

      const options = {
        url: '/pages/common/totalsearch/getTotalsearchResultList.ax',
        method: 'GET',
        data: param,
        success: function (res) {

          if (!_.isNil(callback) && typeof callback === 'function') callback(res.row.searchResult);
        }
      };

      $cmm.ajax(options);
    };

    // 통합게시판 > 하위 카테고리 호출
    this.getMenuCategoryList = async (param, callback) => {
      return new Promise((resolve, reject) => {
        $cmm.ajax({
          url: '/pages/common/totalsearch/getMenuCategoryList.ax',
          type: 'GET',
          data: param,
          success: (res, textStatus, jqXHR) => {
            resolve({ res, textStatus, jqXHR });
          },
          error: (jqXHR, textStatus, error) => {
            console.error("error occurred");
            reject(error);
          }
        });
      })
    };


  }
}

let screen;
$(function () {
  screen = {
    v: {
      activeTab1Id: $('.tab[name="mainTab"]').find('.active a').attr('href'),
      activeTabSchoolLevel: $('.tab[name="mainTab"]').find('li.active > a').data('id'),
      activeTab2Id: $('.tab[name="subTab"]').find('.active a').attr('href'),
      schoolLevel: 'ele',
      schoolLevelCode: 'MT0021', // 초: MT0021, 중: MT0022, 고: MT0023
      eHostElement: $('[id=eHostElement]').val(),
      mHostMiddle: $('[id=mHostMiddle]').val(),
      hHostHigh: $('[id=hHostHigh]').val(),
      myYn: 'n', // MY 토글 on/off (default = N)
      activeTab2Collection : $('.tab[name="subTab"]').find('.active a').attr('data-collection'),
      param: {
        keyword: '',
        pageStart: 0,
        resultCount: 100,
        siteType: 'ele',
        collection: 'all',
        myYn: 'n', // MY 토글 on/off (default = N)
        // myTextBookSeq: ""   // 사용자가 즐겨찾기 설정한 교과서 자료
      },
      menuParam: {
        pageStart: 0,
        resultCount: 100,
        siteType: 'ele',
        collection: "menushortcuts",
      },
      mainKeyword: '',
      keywords: [],
      totalsearch: new Totalsearch(),
      swiperInstance: new Swiper('#totalsearch-section .search-item-slider.move', {
        slidesPerView: 'auto',
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        mousewheel: true,
        keyboard: true,
        watchOverflow: true,
        slidesOffsetBefore: 40,
        slidesOffsetAfter: 150,
      }),
      thumbLogArr: $('[name=thumbLogArr]').val() || ''
    },
    c: {
      /**
       * 통합게시판 스크랩
       * @param {*} type scrapBtn: 스크랩
       * @param {*} scrapYn Y: 활성화 / N: 비활성화(취소)
       * @param {*} masterSeq
       * @param {*} callback
       */
      doSearchTotalBoardScrap: (type, scrapYn, viewPageYn, masterSeq, link)=> {
        let url = '';
        let method = '';
        if(scrapYn === 'Y') {
          method = 'POST';
          url = '/pages/api/totalboard/common/insertTotalboardScrap.ax';
        } else {
          method = 'PUT';
          url = '/pages/api/totalboard/common/deleteTotalboardScrap.ax';
        }


        // 상세페이지 없는 경우 - 스크랩 시
        let scrapUrl = null;
        if (type === 'scrapBtn') {
          scrapUrl = viewPageYn === "Y" ? link + '/' + masterSeq : link;
        }

        const options = {
          url: url,
          method: method,
          data: {
            masterSeq: masterSeq,
            scrapType: type === 'scrapBtn' ? 'TOTALBOARD' : 'TOTALBOARD-LIKE',
            scrapUrl: scrapUrl
          },
          success: function (res) {
            if(scrapYn === 'Y') $toast.open(`toast-scrap-${masterSeq}`, 'MG00041');
            else $toast.open(`toast-scrap-${masterSeq}`, 'MG00042');
          }
        };

        $cmm.ajax(options);
      }
    },
    f: {
      changeTab: (e) => {
        //active 체크
      },

      changeMainTab: (e) => {
        // 초중고 탭 이동 시
        const mainTabId = $(e.currentTarget).attr('href');
        const schoolLevel = $(e.currentTarget).data('id');
        const schoolLevelCode = $(e.currentTarget).data('type');

        screen.v.activeTab1Id = mainTabId;
        screen.v.schoolLevel = schoolLevel;
        screen.v.schoolLevelCode = schoolLevelCode;

        screen.v.param.siteType = schoolLevel;

        // 전체탭 active
        $('li.active').not('a[href="' + mainTabId + '-0"]').removeClass('active');
        $('a[href="' + mainTabId + '-0"]').closest('li').addClass('active');
        $('a[href="' + mainTabId + '-0"]').click();

        if (screen.v.param.keyword) {
          const currentUrl = window.location.origin + window.location.pathname;
          const updatedUrl = currentUrl + `?searchTxt=${screen.v.mainKeyword}&schoolLevel=${schoolLevel}`;
          history.pushState(null, '', updatedUrl);

          // 검색 API 요청
          screen.v.totalsearch.getTotalsearchResult(screen.v.param, tsAllScreen.f.renderResults);

          // 메뉴리스트 API 요청
          screen.v.totalsearch.getMenuList(screen.v.menuParam, tsAllScreen.f.displayMenuList, '');
        }
      },

      checkMyOnOff: (e) => {
        // MY on / off 변화 시

        // MY off -> on
        if (!$isLogin && screen.v.myYn === 'n') {
          $alert.open('MG00001');
          $(e.currentTarget).prop('checked', false);
          return;
        }

        const checked = $('#switcher3-1[type=checkbox]').prop("checked");

        checked ? screen.v.myYn = 'y' : screen.v.myYn = 'n';  // myYn 전역변수
        checked ? screen.v.param.myYn = 'y' : screen.v.param.myYn = 'n';  // myYn 요청 파람

        if (screen.v.param.keyword) {
          // 검색 API 요청
          if(screen.v.activeTab2Collection === "all"){
            screen.v.totalsearch.getTotalsearchResult(screen.v.param, tsAllScreen.f.renderResults);
          }else{
            $(`div${screen.v.activeTab1Id} li a[data-collection=${screen.v.activeTab2Collection}]`).trigger('click');
          }
        }
      },

      executeSearch: () => {
        let keyword = $('div[data-type="re-search-div"] input').val();

        console.log(screen.v.keywords.length)
        if (keyword) {
          if (screen.v.keywords.length > 10) {
            $alert.alert('재 검색어는 10개까지 등록 가능합니다.');
            $('html').removeClass('active-overlay');
          } else {
            screen.f.addKeyword(keyword);
          }
        }
      },

      searchKeywordSetting: (param) => {

        let setParam = { ...param };

        // console.log("screen.v.keywords: ", screen.v.keywords)
        screen.v.keywords = screen.v.keywords.filter(Boolean);

        screen.f.executeSearch();

        let searchKeywords = '';
        let urlSearchKeywords = '';

        screen.v.keywords.forEach((item, index) => {
          searchKeywords += item;
          urlSearchKeywords += item;

          if (index < screen.v.keywords.length - 1) {
            searchKeywords += ' ';
            // urlSearchKeywords += ',';
          }
        });

        setParam.keyword = searchKeywords;

        // URL 검색어 쿼리 세팅
        const currentUrl = window.location.origin + window.location.pathname;
        const schoolLevel = screen.v.param.siteType;
        const updatedUrl = currentUrl + `?searchTxt=${screen.v.mainKeyword}&schoolLevel=${schoolLevel}`;

        history.pushState(null, '', updatedUrl);

        setParam.siteType = screen.v.schoolLevel;
        setParam.myYn = screen.v.myYn;
        setParam.myScrapYn = 'y';

        // console.log("param: ", setParam)

        if (screen.v.keywords.length > 1) {
          screen.v.totalsearch.getMenuList(screen.v.menuParam, tsAllScreen.f.displayMenuList, '');
        }

        return setParam;
      },

      addKeyword: (keyword) => {
        screen.v.keywords.push(keyword);

        screen.f.displayKeywords();
        let $ul = $('.search-item-slider.totalsearch > .swiper-wrapper');
        let $div = $('.search-item-slider.totalsearch');
        let totalWidth = 0;

        $ul.find('li').each(function() {
          let $li = $(this);
          totalWidth += $li.outerWidth(true);
        });

        let divWidth = $div.width();

        // ul의 너비가 div의 너비보다 크면 move 클래스를 추가
        if (totalWidth > divWidth * 0.93) {
          $div.addClass('move');
        }
      },

      deleteKeyword: (keyword) => {
        screen.v.keywords = screen.v.keywords.filter((item) => {

          return item !== keyword;
        })

        screen.f.displayKeywords();

        screen.v.totalsearch.getTotalsearchResult(screen.v.param, tsAllScreen.f.renderResults);

        screen.v.totalsearch.getMenuList(screen.v.menuParam, tsAllScreen.f.displayMenuList, '');
      },

      displayKeywords: (type) => {
        $('.search-items ul').html('');

        // 현재 검색어 아이콘 나열
        if (type !== 'init') {
          screen.v.keywords.forEach((item, index) => {
            $('.search-items ul').append(`
            <li class="swiper-slide alert-button type-rounded-primary-light">
              <span>${item}</span>
              <button type="button" class="icon-button ${index === 0 ? 'display-hide' : ''}"}>
               <svg>
                 <title>삭제 아이콘</title>
                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
               </svg>
             </button>
             <button type="button" class="icon-button ${index > 0 ? 'display-hide' : ''}" style="cursor: default">
             </button>
            </li>
          `)
          })

          screen.f.sliderNav('.search-item-slider.move', 'auto', 40, 145); //item, view number, leftMargin, rightMargin
        }

        // 검색결과 갯수 아래 키워드 나열
        let keywordList = $('.detailed-search p[data-type="keyword-list"]');
        keywordList.html('');

        screen.v.keywords = screen.v.keywords.filter((item) => {
          return item.trim() !== '';
        });

        screen.v.keywords.forEach((item, index) => {
          keywordList.append(item);

          // 마지막 아이템이 아니면 쉼표를 추가
          if (screen.v.keywords.length > 1 && (index < screen.v.keywords.length - 1)) {
            keywordList.append(', ');
          }
        })

        screen.f.addDeleteEvent();
      },

      sliderNav: (item, count, leftMargin, rightMargin) => {
        new Swiper(item, {
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
      },

      addDeleteEvent: () => {
        $('.search-items ul li').on('click', 'button.icon-button', function () {
          let keyword;
          let listItem = $(this).closest('li');

          keyword = listItem.find('span').text();

          screen.f.deleteKeyword(keyword);
        })
      },

      // 최상단 검색창에 입력된 검색어 핸들러
      handleMainKeyword: (urlKeyword) => {
        screen.v.keywords = [];

        const inputValue = $('header[data-type="totalsearch-header"] .search-box > input').val().trim();

        // 검색창에 입력어가 없다면 -> 검색어를 입력해주세요
        if (!inputValue && !urlKeyword) {
          $alert.open('MG00074');
          $('html').removeClass('active-overlay');
          return;
        }

        // 검색창에 입력어가 있다면 -> mainKeyword에 할당, keywords 배열에 추가
        if (inputValue || urlKeyword) {
          screen.v.mainKeyword = urlKeyword ? urlKeyword : inputValue;
          screen.v.keywords.push(urlKeyword ? urlKeyword : inputValue);

          // 재검색 기본 비활성화 처리 -> 검색어 있을 때 활성화
          $('div[data-type="re-search-div"] > input').prop('disabled', false);
          $('div[data-type="re-search-div"] > button').prop('disabled', false);

          // subTab 비활성화 해제
          $('.tab[name=subTab]').prop('disabled', false);

          // 해당 검색어에 대한 메뉴 리스트 호출
          screen.v.totalsearch.getMenuList(screen.v.menuParam, tsAllScreen.f.displayMenuList, '');
        }

        // 키워드 리스트에 검색어 띄우기
        let keywordList = $('.detailed-search p[data-type="keyword-list"]');
        keywordList.html(screen.v.mainKeyword);

        let param = screen.v.param;
        param.keyword = screen.v.mainKeyword;

        const tabType = $('div[name="mainTab"] > ul > li.active > a').data('id');
        console.log("현재탭: ", tabType);
        param.siteType = screen.v.param.siteType;

        // 쪽검색 페이지에서 요청하는 경우 param 변경
        const searchType = window.location.pathname.split("/").pop();

        // 메인 키워드 검색시 호출, 재검색 호출은 각 JS 파일에서 진행
        if(searchType === "totalPageSearch.mrn"){
          const tsLink = document.createElement('a');
          tsLink.href = `/pages/common/totalsearch/totalSearch.mrn?searchTxt=${screen.v.param.keyword}&schoolLevel=ele`;
          tsLink.click();

        }else{
          console.log("screen.v.param.siteType: ", screen.v.param.siteType);
          if (screen.v.param.siteType === "mid") {
            $('div[name="mainTab"] li').removeClass('active');
            // $('a[href="#srchtab1"]').closest('li').addClass('active');
            $('a[href="#srchtab1"]').trigger('click');
          } else if (screen.v.param.siteType === "high"){
            $('div[name="mainTab"] li').removeClass('active');
            // $('a[href="#srchtab2"]').closest('li').addClass('active');
            $('a[href="#srchtab2"]').trigger('click');
          } else {
            $('div[name="mainTab"] li').removeClass('active');
            // $('a[href="#srchtab0"]').closest('li').addClass('active');
            $('a[href="#srchtab0"]').trigger('click');
          }

          screen.v.totalsearch.getTotalsearchResult(param, tsAllScreen.f.renderResults);
        }

        screen.f.displayKeywords('init');
      },

      // single file 다운로드
      downSingleFile: (e) => {
        const type = $(e.currentTarget).data('type');
        const fileId = $(e.currentTarget).data('id');
        const linkPath = $(e.currentTarget).data('path');
        let link = document.createElement("a");

        // 권한 체크
        const readUseYn = $(e.currentTarget)?.data('readuseyn');
        const readRight = $(e.currentTarget)?.data('readright');

        if (readUseYn === 'N' || !readRight) {

          link.target = "_blank";
          if (type === 'LINK') {
            link.href = linkPath;
          } else {
            link.href = `/pages/api/file/down/${fileId}`;
          }

          link.click();
          link.remove();

        } else {
          const arrRight = readRight.split(';');
          let isRight = false;
          for (let i = 0; i < arrRight.length; i++) {
            if (arrRight[i] === $('#boardRight').val()) {
              isRight = true;
              break;
            }
          }
          if (!$isLogin) {
            $alert.open('MG00001');
            return;
          }
          if (isRight) {

            link.target = "_blank";
            if (type === 'LINK') {
              link.href = linkPath;
            } else {
              link.href = `/pages/api/file/down/${fileId}`;
            }

            link.click();
            link.remove();

          } else {
            $alert.open('MG00004');
            return;
          }
        }
      },

      // 파일 미리보기 (통합게시판)
      previewFileTotal: (e) => {
        const fileId = $(e.currentTarget).data('id');
        const path = $(e.currentTarget).data('path');
        const fileType = $(e.currentTarget).data('type');


        // 권한 체크
        const readUseYn = $(e.currentTarget)?.data('readuseyn');
        const readRight = $(e.currentTarget)?.data('readright');

        if (readUseYn === 'N' || !readRight) {
          if (fileType === 'LINK') {
            window.open(path, '_blank');
          } else {
            const options = {
              method: "GET",
              url: "/pages/api/preview/previewServiceYn.ax",
              data: { fileId: fileId },
              success: (res) => {
                console.log(res);
                if (res.row.service_yn === 'Y') {
                  let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&type=TOTALBOARD`;
                  if(screen.v.thumbLogArr.indexOf(screen.v.mainId) > -1 ){ // 메뉴 아이디로 판단
                    previewUrl += '&vertical=video-vertical';
                  }
                  mteacherViewer.get_file_info(fileId).then(res => {
                    screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
                  }).catch(err => {
                    console.error(err);
                    alert("서버 에러");
                  });
                } else {
                  $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요.")
                }
              }
            };
            $cmm.ajax(options);

          }
        } else {
          const arrRight = readRight.split(';');
          let isRight = false;
          for (let i = 0; i < arrRight.length; i++) {
            if (arrRight[i] === $('#boardRight').val()) {
              isRight = true;
              break;
            }
          }
          if (!$isLogin) {
            $alert.open('MG00001');
            $('html').removeClass('active-overlay');
            return;
          }
          if (isRight) {
            if (fileType === 'LINK') {
              window.open(path, '_blank');
            } else {
              let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&type=TOTALBOARD`;
              mteacherViewer.get_file_info(fileId).then(res => {

                screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
              }).catch(err => {
                console.error(err);
                alert("서버 에러");
              });
            }
          } else {
            $alert.open('MG00004');
            return;
          }
        }
      },

      // 파일 미리보기 (교과서 자료)
      previewReference: (e) => {
        console.log("자료 미리보기 함수")
        const useYn = $(e.currentTarget).data('isDisabled');
        const fileId = $(e.currentTarget).data('fileId');
        const source = $(e.currentTarget).data('uploadMethod');
        const seq = $(e.currentTarget).data('seq');
        const uploadMethod = $(`input[name="${seq}"]`).data('uploadMethod');

        console.log("useYn", useYn);
        console.log("source", source);

        if (useYn === 'Y' && uploadMethod !== "NEWWIN") {
          const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${fileId}&referenceSeq=${seq}&type=TEXTBOOK`;
          console.log("previewUrl", previewUrl)
          screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview");
        }
      },

      // 새 탭으로 이동하기 (통합게시판)
      moveLinkNewTab: (e) => {
        const urlSchoolLevel = new URLSearchParams(location.search).get('schoolLevel');
        const hostUrl = urlSchoolLevel === "ele" ? screen.v.eHostElement : urlSchoolLevel === "mid" ? screen.v.mHostMiddle : screen.v.hHostHigh;

        const masterSeq = $(e.currentTarget).data('seq');
        const link = $(e.currentTarget).data('link');
        const viewPageYn = $(e.currentTarget).data('viewpageyn');
        const uploadMethod = $(e.currentTarget).data('videouploadmethod');

        // 권한 체크
        const readUseYn = $(e.currentTarget)?.data('readuseyn');
        const readRight = $(e.currentTarget)?.data('readright');

        if (readUseYn === 'N' || !readRight) {
          if (viewPageYn === "Y") {
            let url = (hostUrl + link + '/' + masterSeq);
            window.open(url, '_blank');
          } else {
            screen.f.openVideoLayer(uploadMethod, link, masterSeq);
          }
        } else {
          const arrRight = readRight.split(';');
          let isRight = false;
          for (let i = 0; i < arrRight.length; i++) {
            if (arrRight[i] === $('#boardRight').val()) {
              isRight = true;
              break;
            }
          }
          if (!$isLogin) {
            $alert.open('MG00001');
            $('html').removeClass('active-overlay');
            return;
          }
          if (isRight) {
            if (viewPageYn === "Y") {
              let url = (hostUrl + link + '/' + masterSeq);
              window.open(url, '_blank');
            } else {
              screen.f.openVideoLayer(uploadMethod, link, masterSeq);
            }
          } else {
            $alert.open('MG00004');
            return;
          }
        }

      },

      openVideoLayer: (uploadMethod, link, masterSeq) => {
        if (uploadMethod === 'LINK' || uploadMethod == '') {
          window.open(link, '_blank');
        } else {
          let fileId = '';

          const options = {
            method: "GET",
            url: "/pages/common/totalsearch/getFileList.ax",
            data: { masterSeq: masterSeq },
            success: (res) => {
              if (res.row.videoRow != null && res.row.videoRow != '') {
                fileId = res.row.videoRow.videoFileId;

                const options2 = {
                  method: "GET",
                  url: "/pages/api/preview/previewServiceYn.ax",
                  data: { fileId: fileId },
                  success: (res) => {
                    console.log(res);
                    if (res.row.service_yn === 'Y') {
                      let previewUrl = `/pages/api/preview/viewer.mrn?source=${uploadMethod}&file=${fileId}&referenceSeq=${masterSeq}&type=TOTALBOARD`;
                      if(screen.v.thumbLogArr.indexOf(screen.v.mainId) > -1 ){ // 메뉴 아이디로 판단
                        previewUrl += '&vertical=video-vertical';
                      }
                      mteacherViewer.get_file_info(fileId).then(res => {
                        screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
                      }).catch(err => {
                        console.error(err);
                        alert("서버 에러");
                      });
                    } else {
                      $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요.")
                    }
                  }
                };
                $cmm.ajax(options2);
              }
            }
          };

          $cmm.ajax(options);
        }
      },

      // 스마트 수업 버튼 이벤트 -> 차시창 열기
      openClassLayer: (e) => {
        if ($isLogin) {
          if ($('#userGrade').val() === '001') {
            $alert.open("MG00011", () => {});
          } else if ($('#userGrade').val() === '002'){
            let ticket = $('input[name="ticket"]').val();
            console.log($('input[name="ticket"]'),ticket);

            // AS-IS 차시창 사용
            let classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
            const subjectSeq = $(e.currentTarget).data('subjectseq');
            let urlWithParameters = `${classLayerUrl}${subjectSeq}&ticket=${ticket}`;
            if(document.location.host == 'deve.m-teacher.co.kr' || document.location.host == 'localhost:8100' ){ // 로컬 OR dev 인 경우
              classLayerUrl = 'https://devele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
            }
            const lessonSeq = $(this).data('lessonseq') || '';
            if(lessonSeq != ''){ // 2022년 개정교과의 경우 차시번호가 맞지 않아 구엠티처 차시번호 사용.
              urlWithParameters = `${classLayerUrl}${lessonSeq}&ticket=${ticket}`;
            }

            window.open(urlWithParameters, '_blank');
          }
        } else {
          $alert.open("MG00001");
        }
      },


      openSmartClass : function (e){
        const teacher = tsAllScreen.f.checkTeacher('smartClass');
        const path = $(e.currentTarget).data('path');

        teacher ? window.open(path, '_blank') : "";
      },


      /**
       * 스크랩 toggle
       * @param {*} e
       * @returns
       */
      toggleSearchTotalBoardScrap: (e)=> {
        let scrapYn = $(e.currentTarget).attr('class').indexOf('active');
        if(scrapYn > -1) {
          $(e.currentTarget).removeClass('active');
          scrapYn = 'N';
        }else {
          $(e.currentTarget).addClass('active');
          scrapYn = 'Y';
        }

        console.log(scrapYn);

        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');
          $('html').removeClass('active-overlay');
          return;
        }

        const type = $(e.currentTarget).attr('name');

        if(type === 'scrapBtn' && $('#userGrade').val() !== '002') {
          $alert.open('MG00011');
          $(e.currentTarget).removeClass('active');
          return;
        }

        console.log("toggleScrap>>", scrapYn);
        const masterSeq = $(e.currentTarget).data('seq');
        const link = $(e.currentTarget).data('link');
        const viewPageYn = $(e.currentTarget).data('viewpageyn');

        screen.c.doSearchTotalBoardScrap(type, scrapYn, viewPageYn, masterSeq, link);
      },

      // URL 검색어 확인
      getSearchText: () => {
        const queryString = window.location.search;
        if (!queryString) { return; }

        const searchTxtValue = new URLSearchParams(queryString).get('searchTxt');
        const searchSchoolLevel = new URLSearchParams(queryString).get('schoolLevel');
        const search = searchTxtValue.replace(',', ' ');

        if (searchSchoolLevel) {
          screen.v.param.siteType = searchSchoolLevel;
          screen.v.schoolLevel = searchSchoolLevel;
        } else {
          screen.v.param.siteType = 'ele';
          screen.v.schoolLevel = 'ele';
        }

        console.log("search in getSearchText:::", search);

        if (search && (search !== 'undefined') && search.trim().length > 0) {
          screen.f.handleMainKeyword(search);
        } else {
          if (screen.v.param.siteType === "mid") {
            $('div[name="mainTab"] li').removeClass('active');
            // $('a[href="#srchtab1"]').closest('li').addClass('active');
            $('a[href="#srchtab1"]').trigger('click');
          } else if (screen.v.param.siteType === "high"){
            $('div[name="mainTab"] li').removeClass('active');
            // $('a[href="#srchtab2"]').closest('li').addClass('active');
            $('a[href="#srchtab2"]').trigger('click');
          } else {
            $('div[name="mainTab"] li').removeClass('active');
            // $('a[href="#srchtab0"]').closest('li').addClass('active');
            $('a[href="#srchtab0"]').trigger('click');
          }
        }

        $('.tab[name=mainTab] li a').off('click').on('click', screen.f.changeMainTab);
      },

      addButtonEventsForTotalBoard: (parentNode) => {
        // 파일 미리보기
        $(parentNode).off('click', 'button[name=previewBtn]').on('click', 'button[name=previewBtn]', function (e) {
          screen.f.previewFileTotal(e);
        })

        // 새창열기
        $(parentNode).off('click', 'button[name=newTabBtn]').on('click', 'button[name=newTabBtn]', function (e) {
          screen.f.moveLinkNewTab(e);
        })

        // 스크랩
        $(parentNode).off('click', 'button[name=scrapBtn]').on('click', 'button[name=scrapBtn]', function (e) {
          screen.f.toggleSearchTotalBoardScrap(e);
        })

        // 다운로드
        $(parentNode).off('click', 'button[name=downloadBtn]').on('click', 'button[name=downloadBtn]', function (e) {
          screen.f.downSingleFile(e);
        })

        // 공유하기
        $(parentNode).on('click', '[name=shareBtn]', function (e) {
          if (!$isLogin) {
            $alert.open('MG00001');
            $('html').removeClass('active-overlay');
            return;
          }

          openPopup({id: 'popup-share-sns'});
          let masterSeq = '';
          if($('.board-list').length > 0) {
            masterSeq = '/' + $(e.currentTarget).closest('div.buttons').siblings('input[name=masterSeq]').val();

            // 모바일에서 사용
            if (masterSeq == '/undefined') {
              masterSeq = '/' + $(e.currentTarget).closest('div.board-buttons').children('input[name=masterSeq]').val();
            }
          }
          $('#user-pnum').val(location.origin + location.pathname + masterSeq);
        })

        // 공유하기 닫기
        $(parentNode).on('click', '[name=shareCloseBtn]', function (e) {
          closePopup({id: 'popup-share-sns'});
        })

      },


    },

    event: function () {
      // 초중고 탭 이동 시
      $('.tab[name=mainTab] li a').on('click', screen.f.changeMainTab);

      // MY 체크 / 체크 해제 시
      $('#switcher3-1').on('change', screen.f.checkMyOnOff);

      $('header[data-type="totalsearch-header"] .search-box > button').on('click', () => {
        screen.f.handleMainKeyword();
      })

      $('header[data-type="totalsearch-header"] .search-box > input').on('keypress', (e) => {
        if (e.which === 13) {
          screen.f.handleMainKeyword();
          $('header[data-type="totalsearch-header"] .search-box > input').val('');
        }
      })

      // single file 다운로드
      // $(document).on('click', 'button[name=downloadBtn]', screen.f.downSingleFile);

      // 파일 미리보기
      // $(document).on('click', 'button[name=previewBtn]', screen.f.previewFileTotal);
      $(document).on('click', 'button[name=previewRefBtn]', screen.f.previewReference);

      // 새창으로 이동하기
      // $(document).on('click', 'button[name=newTabBtn], a[name=newTabBtn]', screen.f.moveLinkNewTab);

      // 스크랩
      // $(document).on('click', '[name=scrapBtn]', screen.f.toggleSearchTotalBoardScrap);

      // My on off 툴팁
      $('button[name=onOffTooltip]').hover(function () {
        const msg = `<strong>[ON]</strong> 선택 시 검색 결과 중 <br /> 즐겨찾기한 정보를 먼저 보실 수 있도록 <br /> 상단에 노출시킵니다.`
        $toast.openText('my-on-off', msg);
      }, function () {
        $toast.close('my-on-off');
      })
    },

    init: function () {
      console.log("totalsearchYn: ", $('#totalsearchYn').val());

      $('div[name="subTab"] li.active').not('a[href="#srchtab0-0"]').removeClass('active');
      $('a[href="#srchtab0-0"]').closest('li').addClass('active');
      $('a[href="#srchtab0-0"]').closest('li').click();

      // subTab 기본 비활성화 처리 -> 검색어 있을 때 활성화
      $('.tab[name=subTab]').prop('disabled', true);
      $('.subtab-li > a').off('click').on('click', (e) => {
        $('.accordion li').addClass('active');

        e.preventDefault();
        if (!screen.v.mainKeyword) {
          if ($(e.currentTarget).data('collection') !== 'all') {
            $alert.open('MG00074');
            $('html').removeClass('active-overlay');
          }

          return false;
        }
      })

      screen.event();
    }
  };

  screen.init();
});