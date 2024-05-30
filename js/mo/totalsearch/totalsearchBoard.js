$(function () {

  let tsScreen = {
    v: {
      boardScreen: new Totalsearch(),
      schoolLevel: 'ELEMENT',
      schoolType: 'MT0021',
      selectedTabCollection: '',
      activeTab1Id: $('.tab[name=mainTab]').find('.active a').attr('href'),
      activeTab2Id: $('.tab[name=subTab]').find('.active a').attr('href'),
      activeTab2Name: '',
      pagingNow: 0,
      param: {
        pageStart: 0,          // 현재 페이지
        resultCount: 20,       // 전체 탭 - 5개, 개별 탭 - 20개
        collection: "all",     // 여러개 선택 시 , 로 구분 (all, special_ele, creative, brektime_ele ...)
        schoolGrade: "all",    // all 01,02,03
        subjectCd: "all",
        gubun: "all",
        myScrapYn: "y",
        scrapType: "TOTALBOARD"
      },
      totalboardFilters: [],
      filters: {
        schoolGrade: [],
        subjectCd: [],
        gubun: []
      },
    },

    c: {


    },

    f: {

      /**
       * 통합게시판 게시물 타입 헤더 (공통)
       * */
      getBoardHeader: (tabMenuName, totalCnt) => {
        const header = `
         <div class="inner-header is-extra">
           <h3 name="tabMenuName">${tabMenuName}<span class="text-primary" name="tabMenuTotalCnt">(${Number(totalCnt).toLocaleString()})</span></h3>
         </div>     
        `
        return header;
      },

      /**
       * 통합게시판 게시물 타입 아이템
       * */
      getBoardViewTypeItem: (data) => {
        const htmlItem = `
          <div class="item ">
            <div class="inline-wrap gutter-md">
              ${!$text.isEmpty(data?.document?.thumbnailFilePath) ? `<div class="image-wrap"><img src="${data?.document?.thumbnailFilePath}"/></div>` : ''}
              <div class="text-wrap">
                <a class="title">${data.document.title}</a>
                <div class="inline-wrap">
                  <span class="extra">${data.document.menuName}</span>
                  ${data.document.myTextbookFlag > 0 ? '<span class="badge-recently type-dark">MY</span>' : ''}
                </div>
                <div class="buttons">
                  <button
                    type="button" 
                    name="newTabBtn" 
                    data-link="${data.document.viewPageYn === 'N' && data.document.videoFilePath != '' ? data.document.videoFilePath : data.document.pageUrl}"
                    data-videoUploadMethod="${data.document.videoUploadMethod}"
                    class="button type-icon size-sm" 
                    data-seq="${data.document.masterSeq}" 
                    data-link="${data.document.pageUrl}" 
                    data-readuseyn="${data.document?.pageUseYn}"
                    data-readright="${data.document?.pageRight}"
                    data-viewpageyn="${data.document?.viewPageYn}"
                  >
                    <svg>
                      <title>아이콘 새창</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows-single"></use>
                    </svg>
                  </button>
                  <button
                    type="button" 
                    name="scrapBtn" 
                    class="button type-icon size-sm toggle-this ${data.document.scrapUseYn === 'N' ? 'disabled' : ''} ${data.document?.myScrapTotalFlag > 0 ? 'active' : ''}"
                    data-toast="toast-scrap-${data.document.masterSeq}"
                    data-seq="${data.document.masterSeq}"
                    data-viewpageyn="${data.document?.viewPageYn}"
                    data-link="${data.document.pageUrl}"
                  >
                    <svg>
                      <title>아이콘 스크랩</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                    </svg>
                  </button>
                  <button type="button" name="shareBtn" class="button type-icon size-sm ${data.document.shareUseYn === 'N' ? 'disabled' : ''}">
                    <svg>
                      <title>아이콘 공유</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
        return htmlItem;
      },


      /**
       * 통합게시판 첨부파일 타입 아이템
       * */
      getFileViewType: (data) => {
        const htmlItem = `
          <div class="item">
            <div class="inline-wrap gutter-md">
              <div class="media">
                <img src="/assets/images/common/${$extension.extensionToIcon(data.document?.extension)}" alt="pdf 아이콘">
              </div>
              <div class="text-wrap">
                <strong class="title" data-id="${data.document.fileId}">${data.document?.fileName}</strong>
                <div class="inline-wrap">
                  <span class="extra">${data.document.menuName}</span>
                  ${data.document.myTextbookFlag > 0 ? '<span class="badge-recently type-dark">MY</span>' : ''}
                </div>
                <div class="buttons">
                  <button 
                    type="button" 
                    name="previewBtn" 
                    class="button type-icon size-sm" 
                    data-id="${data.document.fileId}"
                    data-path="${data.document?.path}"
                    data-type="${data.document?.uploadMethod}"
                    data-readuseyn="${data.document?.pageUseYn}"
                    data-readright="${data.document?.pageRight}"
                  >
                    <svg>
                      <title>아이콘 돋보기</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
        return htmlItem;

      },

      getFilterItems: (tab, collection) => {
        const allCommonCode = { name: '전체', commonCode: 'all' }
        const allTotalboard = { name: '전체', sortCode: 'all' }

        const gubun = [
          { id: 'TBM-lpjfhpcs-WI3JNYQV10', name: '문학책방', sortCode: '문학책방' },
          { id: 'specialKoreanData', name: '특수교육 국어 자료실', sortCode: '특수교육국어자료실' }
        ]

        $cmm.getCmmCd(['T05', 'T04', 'ST10']).then(r => {
          const { T05, T04, ST10 } = r.row;
          const schoolLevel = tsScreen.v.schoolLevel;

          const cleanGrade = T05.filter(v => { return v.commonCode !== '00' }); // 학년 공통코드에서 공통학년 삭제
          const cleanSubjectCd = T04.filter(v => { return !_.isNil(v.rem1) && v.rem1.includes(schoolLevel) && v.commonCode !== 'CO' });

          tsScreen.v.filters.schoolGrade = schoolLevel === "ELEMENT" ? [allCommonCode, ...cleanGrade] : [allTotalboard, ...ST10];
          tsScreen.v.filters.subjectCd = [allCommonCode, ...cleanSubjectCd];
          tsScreen.v.filters.gubun = collection === "contentsplus_midhigh" ? [allTotalboard, ...gubun] : [allTotalboard, ...tsScreen.v.totalboardFilters];

          // 필터 엘리먼트 생성
          tsScreen.f.setFilterList(tab, collection);
        })
      },

      setFilterList: (tab, collection) => {
        let filterName = ''

        const eleFilterName = {
          schoolGrade: '학년',
          gubun: '분류'
        }
        const midHighFilterName = {
          schoolGrade: '학년군',
          subjectCd: '과목',
          gubun: '영역'
        }

        tsScreen.v.schoolLevel === "ELEMENT" ? (filterName = eleFilterName) : (filterName = midHighFilterName)

        const filterBySubTab = {
          // 초등
          special_ele: ['schoolGrade', 'gubun'],
          creative: ['gubun'],
          breaktime_ele: ['gubun'],

          // 중고등
          creative: ['gubun'],
          innovative_midhigh: ['schoolGrade', 'subjectCd', 'gubun'],
          contentsplus_midhigh: ['gubun']
        }

        let el = ``;
        let btn = ``;
        let filter_list = ``;

        filterBySubTab[collection].forEach((ft, index) => {
          let el2 = ``;
          let filter_item = ``;

          tsScreen.v.filters[ft].forEach((ftItem, k) => {
            const a = `
            ${ftItem.id != 'TBM-lqdcl3tf-jtsJ38gg2a' ? `
              <div class="swiper-slide">
                <button type="button"
                    class="${k ? '' : 'active all'}"
                    id="${k ? ftItem.id : collection + ftItem.commonCode + index}"
                    data-cmCode="${ftItem.sortCode}">${ftItem.name}
                </button>
              </div>
              ` : ``}
            `;

            const b = `
                <div class="swiper-slide">
                    <button type="button"
                        class="${k ? '' : 'active all'}"
                        id="${collection + ftItem.commonCode + index}"
                        data-cmCode="${ftItem.commonCode}">${ftItem.name}
                    </button>
                </div>
            `;

            ft === "gubun" ? (el2 += a) : (el2 += b);

            const c = `
                <button type="button"
                    class="${k ? '' : 'active all'}"
                    id="${k ? ftItem.id : collection + ftItem.commonCode + index}"
                    data-cmCode="${ftItem.sortCode}">${ftItem.name}</button>
            `;

            const d = `
                <button type="button"
                    class="${k ? '' : 'active all'}"
                    id="${collection + ftItem.commonCode + index}"
                    data-cmCode="${ftItem.commonCode}">${ftItem.name}</button>
            `;

            ft === "gubun" ? (filter_item += c) : (filter_item += d);
          })

          if (tsScreen.v.filters[ft].length > 6) {
            for (let i = 0; i < (tsScreen.v.filters[ft].length / 6); i++) {
              el2 += `<div class="swiper-slide"><button type="button"></button></div>`;
            }
          }

          filter_list += `
            <li class="filter-group" id="${collection + ft + index}">
              <a href="javascript:void(0);" class="list-depth action" data-filter-key="${ft}">
                <div class="header-wrap">
                  <h3>${filterName[ft]}</h3>
                  <span class="extra"></span>
                </div>
              </a>
              <div class="pane">
                <div class="filter-items">
                  ${filter_item}
                </div>
              </div>
            </li>
          `;

          btn += `
            <button type="button" name="${index}"> ${filterName[ft]} <svg>
              <title>화살표 아이콘</title>
              <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
              </svg>
            </button>
          `;

          el += `
            <div class="filter-items display-hide filter-items-${index}" id="${collection + ft + index}">
              <div class="slides">
                <div class="swiper-wrapper" data-filter-key="${ft}">
                  ${el2}
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          `;

        });

        tsScreen.v.boardScreen.appendCategory(tab, el, btn, filter_list);

        // 필터 input click
        $('.filter-items .swiper-wrapper button').on('click', (e) => tsScreen.f.changeFilter(e));
        $('.filter-group .filter-items button').on('click', (e) => tsScreen.f.changePopupFilter(e));

        // 필터 초기화 click
        $('button[name=clearTagBtn]').off('click').on('click', (e) => tsScreen.f.clearFilter());
      },

      // 통합검색 API 요청 후 리스트 아이템 바인딩
      setTotalboardDataList: (response) => {
        // [API] 통합검색 응답 값
        const { totalCount, searchResult } = response.res.row

        // 통합게시판 헤더 세팅
        const resultHeader = tsScreen.f.getBoardHeader(tsScreen.v.activeTab2Name, totalCount);

        // 통합게시판 아이템 목록
        const dataList = searchResult[tsScreen.v.selectedTabCollection]?.documentList;

        let resultList = '';
        let resultItems = '';

        resultItems += '<div class="result-items">'
        dataList?.map((data) => {
          if (data.document.dataType === "DATA") {
            resultItems += tsScreen.f.getBoardViewTypeItem(data);
          } else if (data.document.dataType === "FILE") {
            resultItems += tsScreen.f.getFileViewType(data);
          }
        })
        if (totalCount > 20) {
          resultItems += '<div class="pagination"></div>'
        }
        resultItems += '</div>'

        resultList += resultHeader;
        resultList += resultItems;

        tsScreen.v.boardScreen.appendResult(tsScreen.v.activeTab2Id, resultList);

        if (totalCount > 20) {
          $paging.bindTotalboardPaging(response.res);
        }
      },

      changeMainTab: (e) => {
        // 카테고리 영역 초기화
        $(`.filter-wrap .buttons`).empty();
        $(`.filter-wrap .filter-items`).remove();

        //active 체크
        const mainTab = $(e.currentTarget).attr('href');
        const schoolLevel = $(e.currentTarget).data('id');
        const schoolType = $(e.currentTarget).data('type');

        tsScreen.v.activeTab1Id = mainTab;
        tsScreen.v.schoolLevel = schoolLevel === "ele" ? "ELEMENT" : schoolLevel === "mid" ? "MIDDLE" : "HIGH";
        tsScreen.v.schoolType = schoolType;

      },

      changeSubTab: async (e) => {
        // 통합게시판 하위 탭 이동 시
        const subTabId = $(e.currentTarget).attr('href');
        tsScreen.v.activeTab2Id = subTabId;
        screen.v.activeTab2Id = subTabId;

        const subTabName = $(e.currentTarget).text();
        tsScreen.v.activeTab2Name = subTabName;

        const collection = $(e.currentTarget).data('collection');
        tsScreen.v.selectedTabCollection = collection;
        tsScreen.v.param.collection = collection;
        screen.v.activeTab2Collection = collection;

        tsScreen.v.pagingNow = 0;
        tsScreen.v.param.pageStart = 0;

        tsScreen.v.param.schoolGrade = "all";
        tsScreen.v.param.subjectCd = "all";
        tsScreen.v.param.gubun = "all";

        tsScreen.v.schoolLevel = $('div[name=mainTab]').find('li.active').find('a').data('id') === "ele" ? "ELEMENT" : $('div[name=mainTab]').find('li.active').data('id') === "mid" ? "MIDDLE" : "HIGH";
        tsScreen.v.schoolType = $('div[name=mainTab]').find('li.active').find('a').data('type');
        // $('.accordion li').addClass('active');

        // 하위 카테고리(필터) API 호출
        const sortcode = $(e.currentTarget).data('sortcode');
        const filterParam = {
          categoryType: tsScreen.v.schoolType,
          sortCode: sortcode
        }
        const filter = await tsScreen.v.boardScreen.getMenuCategoryList(filterParam);
        tsScreen.v.totalboardFilters = filter.res.rows;

        // 하위 카테고리(필터) 바인딩
        tsScreen.f.getFilterItems(subTabId, collection);

        // [API] 통합검색 API 요청
        const response = await tsScreen.v.boardScreen.getTotalsearchResultAsync(tsScreen.v.param);

        if (response) {
          // 결과 리스트 화면 그리기
          tsScreen.f.setTotalboardDataList(response);

          $(document).ready(function() {
            screen.f.addButtonEventsForTotalBoard(document);
          })
          // 페이징
          $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsScreen.f.changePaging);


        }

      },

      // 페이지 이동
      changePaging: async (e) => {
        const pagingNow = e.currentTarget.value;

        tsScreen.v.pagingNow = Number(pagingNow);
        tsScreen.v.param.pageStart = Number(pagingNow);

        // [API] 통합검색 API 요청
        const response = await tsScreen.v.boardScreen.getTotalsearchResultAsync(tsScreen.v.param);

        if (response) {
          // 결과 리스트 화면 그리기
          tsScreen.f.setTotalboardDataList(response);
        }
      },

      setParam: (key, val) => {
        return tsScreen.v.param[key] = val;
      },

      // 필터 초기화
      clearFilter: async () => {
        closePopup({id:'popup-sheet'});

        $('.filter-items button').removeClass('active');
        $('.filter-items button[data-cmcode="all"]').addClass('active');
        $('.filter-group').removeClass('active');
        $('.filter-group').find('div.pane').css('display', 'none');
        $('.filter-group .header-wrap span.extra').text('');

        tsScreen.v.param.gubun = "all";
        tsScreen.v.param.schoolGrade = "all";
        tsScreen.v.param.subjectCd = "all";

        tsScreen.v.pagingNow = 0;
        tsScreen.v.param.pageStart = 0;

        // [API] 통합검색 API 요청
        const response = await tsScreen.v.boardScreen.getTotalsearchResultAsync(tsScreen.v.param);

        if (response) {
          // 결과 리스트 화면 그리기
          tsScreen.f.setTotalboardDataList(response);
        }
      },

      // 필터 조건 변경
      changeFilter: async (e) => {
        const parentId = $(e.currentTarget).parents('.filter-items').attr('id');

        if ($(e.currentTarget).hasClass('active')) {
          $(`#${parentId} .filter-items button[data-cmcode="${$(e.currentTarget).data('cmcode')}"]`).addClass('active');
        } else {
          $(`#${parentId} .filter-items button[data-cmcode="${$(e.currentTarget).data('cmcode')}"]`).removeClass('active');
        }

        // 전체 아닌 값 선택
        if (!$(e.currentTarget).hasClass('all')) {
          $(`#${parentId} .swiper-wrapper button.all`).removeClass('active');
          $(`#${parentId} .filter-items button.all`).removeClass('active');
        } else {
          $(`#${parentId} .swiper-wrapper button`).not('.all').removeClass('active');
          $(`#${parentId} .filter-items button`).not('.all').removeClass('active');
        }

        const key = $(`#${parentId} .swiper-wrapper`).attr('data-filter-key');
        const checkedInputList = tsAllScreen.f.getCheckedInputs(e, parentId);

        // 모든 필터 해제시 자동으로 "전체" 체크
        if (!checkedInputList.length) {
          $(`#${parentId} .swiper-wrapper button`).eq(0).addClass('active'); // "전체" on
          $(`#${parentId} .filter-items button`).eq(0).addClass('active'); // "전체" on
          checkedInputList.push("all");
        }

        tsScreen.v.param[key] = checkedInputList.join();

        tsScreen.v.pagingNow = 0;
        tsScreen.v.param.pageStart = 0;

        // [API] 통합검색 API 요청
        const response = await tsScreen.v.boardScreen.getTotalsearchResultAsync(tsScreen.v.param);

        if (response) {
          // 결과 리스트 화면 그리기
          tsScreen.f.setTotalboardDataList(response);
        }
      },

      changePopupFilter: async (e) => {
        const parentId = $(e.currentTarget).parents('.filter-group').attr('id');

        if ($(e.currentTarget).hasClass('active')) {
          $(`#${parentId} .swiper-wrapper button[data-cmcode="${$(e.currentTarget).data('cmcode')}"]`).addClass('active');
        } else {
          $(`#${parentId} .swiper-wrapper button[data-cmcode="${$(e.currentTarget).data('cmcode')}"]`).removeClass('active');
        }

        // 전체 아닌 값 선택
        if (!$(e.currentTarget).hasClass('all')) {
          $(`#${parentId} .filter-items button.all`).removeClass('active');
          $(`#${parentId} .swiper-wrapper button.all`).removeClass('active');
        } else {
          $(`#${parentId} .filter-items button`).not('.all').removeClass('active');
          $(`#${parentId} .swiper-wrapper button`).not('.all').removeClass('active');
        }

        const key = $(`#${parentId} .list-depth`).attr('data-filter-key');
        const checkedInputList = tsAllScreen.f.getCheckedInputs(e, parentId);

        // 모든 필터 해제시 자동으로 "전체" 체크
        if (!checkedInputList.length) {
          $(`#${parentId} .filter-items button`).eq(0).addClass('active'); // "전체" on
          $(`#${parentId} .swiper-wrapper button`).eq(0).addClass('active'); // "전체" on
          checkedInputList.push("all");
        }

        tsScreen.v.param[key] = checkedInputList.join();

        tsScreen.v.pagingNow = 0;
        tsScreen.v.param.pageStart = 0;

        // [API] 통합검색 API 요청
        const response = await tsScreen.v.boardScreen.getTotalsearchResultAsync(tsScreen.v.param);

        if (response) {
          // 결과 리스트 화면 그리기
          tsScreen.f.setTotalboardDataList(response);
        }
      },

    },

    event: function () {
      // 초중고 메인 탭 이동
      $('.tab[name=mainTab] li a').on('click', tsScreen.f.changeMainTab);

      // 학교급 밑 탭 이동
      $('.tab[name=subTab] li a[data-boardtype=totalboard]').on('click', tsScreen.f.changeSubTab);

      // 페이징
      // $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsScreen.f.changePaging);

    },

    init: function () {
      tsScreen.event();

      // 카테고리 필터 초기화
      $('.tab[name=subTab] li a').on('click', function() {
        $('.filter-wrap').addClass('display-hide');
      });

      const schoolType = $('#schoolType').val();
      if (!!schoolType) {
        // $('.tab[name=mainTab] li').addClass('active');
        $('.tab[name=mainTab] li').removeClass('active');
        $('.tab[name=mainTab] li a[data-id=' + schoolType + ']').parent('li').addClass('active');

        $(document).ready(() => {
          $('div[name=mainTab] > ul  > li > a[data-id=' + schoolType + ']').trigger('click');
        });
      }

    },
  };
  tsScreen.init();


});