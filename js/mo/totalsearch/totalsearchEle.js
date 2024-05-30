let tsEleScreen;

$(function () {
  tsEleScreen = {
    v: {
      params : {
        pageStart : 0,
        resultCount : 20,
        siteType : "ele",
        collection : "smartclass",
        myYn : "y",
        scrapType : "TEXTBOOK"
      },

      filters : {
        schoolGrade: [],
        termcd: [],
        subjectCd: [],
        category3Name: [],
        fileFormat: [],
      },

      Totalsearch : new Totalsearch(),

      activeTab1Id : $('.tab[name=mainTab]').find('.active a').attr('href'),
      activeTab2Id : $('.tab[name=subTab]').find('.active a').attr('href'),
      collection : "all",
      pagingNow: 0,

    },

    c: {
      search : function (){
        tsEleScreen.v.Totalsearch.getTotalsearchResultAsync(tsEleScreen.v.params).then(res=>{
          const result = res?.res.row.searchResult[tsEleScreen.v.collection];
          const tabIndex = tsEleScreen.v.activeTab2Id.split('-')[1];
          const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');

          $(`${tsEleScreen.v.activeTab2Id} div[data-type=${tsEleScreen.v.collection}]`).remove(); // 검색 결과 초기화
          if(tsEleScreen.v.collection === "smartclass"){
            $(tabId + `-${tabIndex} div[name="searchResultArea"]`).remove();
            $(tabId + `-${tabIndex} div.result-items`).remove();
            $(tabId + `-${tabIndex} div.pagination`).remove();
            tsAllScreen.f.renderSmartClass(res?.res, result, tabIndex);
          }else if(tsEleScreen.v.collection === "textbook"){
            $(tabId + `-${tabIndex} div[name="searchResultArea"]`).remove();
            $(tabId + `-${tabIndex} div.result-items`).remove();
            $(tabId + `-${tabIndex} div.pagination`).remove();
            tsAllScreen.f.renderTextbookReference(res?.res, result, tabIndex);
          }
        })
      }
    },

    f: {
      setParam : (key,val)=>{
        return tsEleScreen.v.params[key] = val;
      },

      // subTab 변경시
      changeEleTab : async function (e){
        // console.log("changeEleTab()")
        const tab = $(e.currentTarget).attr('href');
        const collection = $(e.currentTarget).data('collection');
        tsEleScreen.v.activeTab2Id = tab; // active subTab id
        screen.v.activeTab2Id = tab;
        tsEleScreen.v.collection = collection; // active collection
        screen.v.activeTab2Collection = collection;


        await tsEleScreen.f.setParam('collection',collection); // set search param
        await tsEleScreen.f.getFilterItems(tab,collection); // 필터 목록 가져옴
        tsEleScreen.f.setFilterList(tab,collection); // 필터 ele 그려줌

        tsEleScreen.v.pagingNow = 0;
        tsEleScreen.v.params.pageStart = 0;

        tsEleScreen.c.search(); // 검색 결과 그려줌
      },


      // 필터 목록
      getFilterItems : function (tab,collection){
        const category3Name = [
          {name : '수업자료' , commonCode : [448,557]},
          {name : '평가자료' , commonCode : [467,559]},
          {name : '멀티미디어자료' , commonCode : [501,560]},
          {name : '공통자료' , commonCode : [425,425]},
          {name : '특화자료' , commonCode : [531,561]},
        ];

        $cmm.getCmmCd(['T05', 'T06', 'T04','TS0110']).then(r => {
          const {T05, T06, T04,TS0110} = r.row;
          const cleanGrade = T05.filter(v => { return v.commonCode !== '00' && v.rem1.includes(tsAllScreen.v.activeTabType.toUpperCase()) }); // 학년 공통코드에서 공통학년 삭제
          const cleanSubjectCd = T04.filter(v=>{ return !_.isNil(v.rem1) && v.rem1.includes(tsAllScreen.v.activeTabType.toUpperCase())});
          const all = {name : '전체', commonCode : 'all'};

          tsEleScreen.v.filters.schoolGrade = [all,...cleanGrade]; // 학년 필터
          tsEleScreen.v.filters.termcd = [all,...T06]; // 학기 필터
          tsEleScreen.v.filters.subjectCd = [all,...cleanSubjectCd]; // 과목 필터

          if(collection === 'textbook'){
            tsEleScreen.v.filters.category3Name = [all,...category3Name]; // 자료유형 필터
            tsEleScreen.v.filters.fileFormat = [all,...TS0110]; // 파일형식 필터
          }
        })
      },


      // 필터 영역 그려줌
      setFilterList : function (tab,collection){
        const filterName = {
          schoolGrade : '학년',
          termcd : '학기',
          subjectCd : '과목',
          category3Name : '자료유형',
          fileFormat : '파일형식'
        }

        // subTab에 따라 필터 key 목록 지정 (smartclass인 경우 학년,학기,과목)
        const filterBySubTab = {
          smartclass : ['schoolGrade','termcd','subjectCd'],
          textbook : ['schoolGrade','termcd','subjectCd','category3Name','fileFormat']
        }

        let el = ``;
        let btn = ``;
        let filter_list = ``;

        filterBySubTab[collection].forEach((ft,index)=>{
          let el2 = ``;
          let filter_item = ``;

          tsEleScreen.v.filters[ft].forEach((ftItem,k) => {
            el2 += `
              <div class="swiper-slide">
                <button type="button" 
                    class="${k ? '' : 'active all'}"
                    id="${collection + ftItem.commonCode + index}"
                    data-cmCode="${ft === 'fileFormat' || ft === 'category3Name' ? ftItem.name : ftItem.commonCode}">${ftItem.name}
                </button>
              </div>
            `;

            filter_item += `
              <button type="button"
                  class="${k ? '' : 'active all'}"
                  id="${collection + ftItem.commonCode + index}"
                  data-cmCode="${ft === 'fileFormat' || ft === 'category3Name' ? ftItem.name : ftItem.commonCode}">${ftItem.name}</button>
            `;
          })

          if (tsEleScreen.v.filters[ft].length > 6) {
            for (let i = 0; i < (tsEleScreen.v.filters[ft].length / 6); i++) {
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
        })

        tsEleScreen.v.Totalsearch.appendCategory(tab, el, btn, filter_list);

        filterBySubTab[collection].forEach(key=>{
          tsEleScreen.f.setParam(key ,'all');
        })

        // 필터 input click
        $('.filter-items .swiper-wrapper button').on('click', (e) => tsEleScreen.f.changeFilter(e));
        $('.filter-group .filter-items button').on('click', (e) => tsEleScreen.f.changePopupFilter(e));

        // 필터 초기화 click
        $('button[name=clearTagBtn]').off('click').on('click', (e) => tsEleScreen.f.clearFilter());
      },

      // 필터 초기화
      clearFilter: async () => {
        closePopup({id:'popup-sheet'});

        $('.filter-items button').removeClass('active');
        $('.filter-items button[data-cmcode="all"]').addClass('active');
        $('.filter-items button[data-cmcode="전체"]').addClass('active');
        $('.filter-group').removeClass('active');
        $('.filter-group').find('div.pane').css('display', 'none');
        $('.filter-group .header-wrap span.extra').text('');

        tsEleScreen.v.params.category3Name = "all";
        tsEleScreen.v.params.fileFormat = "all";
        tsEleScreen.v.params.schoolGrade = "all";
        tsEleScreen.v.params.subjectCd = "all";
        tsEleScreen.v.params.termcd = "all";

        tsEleScreen.v.pagingNow = 0;
        tsEleScreen.v.params.pageStart = 0;

        // 검색 요청
        tsEleScreen.c.search();
      },

      // 필터 조건 변경
      changeFilter : async function (e){
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

        const checkedList = tsAllScreen.f.getCheckedInputs(e, parentId);

        // 모든 필터 해제시 자동으로 "전체" 체크
        if (!checkedList.length) {
          $(`#${parentId} .swiper-wrapper button`).eq(0).addClass('active'); // "전체" on
          $(`#${parentId} .filter-items button`).eq(0).addClass('active'); // "전체" on
          checkedList.push("all");
        }

        // param 담기
        checkedList.toString() === "전체" ? tsEleScreen.f.setParam(key,"all") : tsEleScreen.f.setParam(key,checkedList.toString());

        tsEleScreen.v.pagingNow = 0;
        tsEleScreen.v.params.pageStart = 0;

        // 검색 요청
        tsEleScreen.c.search();
      },

      changePopupFilter : async function (e){
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

        const checkedList = tsAllScreen.f.getCheckedInputs(e, parentId);

        // 모든 필터 해제시 자동으로 "전체" 체크
        if (!checkedList.length) {
          $(`#${parentId} .filter-items button`).eq(0).addClass('active'); // "전체" on
          $(`#${parentId} .swiper-wrapper button`).eq(0).addClass('active'); // "전체" on
          checkedList.push("all");
        }

        // param 담기
        checkedList.toString() === "전체" ? tsEleScreen.f.setParam(key,"all") : tsEleScreen.f.setParam(key,checkedList.toString());

        tsEleScreen.v.pagingNow = 0;
        tsEleScreen.v.params.pageStart = 0;

        // 검색 요청
        tsEleScreen.c.search();
      },

      // 페이지 이동
      changePaging: async (e) => {
        const pagingNow = e.currentTarget.value;

        console.log("pagingNow: ", pagingNow);

        tsEleScreen.v.pagingNow = Number(pagingNow);
        tsEleScreen.v.params.pageStart = Number(pagingNow);

        // [API] 통합검색 API 요청
        const response = await tsEleScreen.c.search();

        if (response) {
          // 결과 리스트 화면 그리기
          tsAllScreen.f.setTotalboardDataList(response);
        }
      },

    },

    event: function () {
      // subTab 변경
      $('.tab[name=subTab] li').off('click').on('click','a[data-boardtype=textbook]' ,(e)=> tsEleScreen.f.changeEleTab(e));
    },

    init: function () {
      if($('#totalsearchYn').val() === 'false') {
        $alert.open('MG00059', ()=> {
          location.href = '/pages/ele/Main.mrn';
        });
      }

      tsEleScreen.event();
    },
  };

  tsEleScreen.init();
});