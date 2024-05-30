let tsLiveScreen;

$(function () {
  tsLiveScreen = {
    v: {
      params : {
        pageStart : 0,
        resultCount : 20,
        siteType : "ele",
        collection : "teacherlive",
        myYn : "y",
        scrapType : "OTT"
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
        tsLiveScreen.v.Totalsearch.getTotalsearchResultAsync(tsLiveScreen.v.params).then(res=>{
          const result = res?.res.row.searchResult[tsLiveScreen.v.collection];
          const tabIndex = tsLiveScreen.v.activeTab2Id.split('-')[1];
          const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');

          $(`${tsLiveScreen.v.activeTab2Id} div[data-type=${tsLiveScreen.v.collection}]`).remove(); // 검색 결과 초기화
          $(tabId + `-${tabIndex} div[name="searchResultArea"]`).remove();
          $(tabId + `-${tabIndex} div.result-items`).remove();
          $(tabId + `-${tabIndex} div.pagination`).remove();
          tsLiveScreen.f.renderTeacherLive(res?.res, result, tabIndex);

        })
      },

      /**
       * 스크랩, 좋아요
       * @param {*} type scrapBtn: 스크랩 / likeBtn: 좋아요
       * @param {*} scrapYn Y: 활성화 / N: 비활성화(취소)
       * @param {*} masterSeq
       * @param {*} callback
       */
      doLiveScrap: (type, scrapYn, masterSeq)=> {
        let url = '';
        let method = '';
        if(scrapYn === 'Y') {
          method = 'POST';
          url = '/pages/api/totalboard/common/insertTotalboardScrap.ax';
        }else {
          method = 'PUT';
          url = '/pages/api/totalboard/common/deleteTotalboardScrap.ax';
        }


        // 상세페이지 없는 경우 - 스크랩 시
        let scrapUrl = null;
        scrapUrl = location.pathname;

        const options = {
          url: url,
          method: method,
          data: {
            masterSeq: masterSeq,
            scrapType: type === 'scrapBtnLive' ? 'DATASHARE' : 'OTT',
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
      setParam : (key,val)=>{
        return tsLiveScreen.v.params[key] = val;
      },

      // subTab 변경시
      changeEleTab : async function (e){
        const tab = $(e.currentTarget).attr('href');
        const collection = $(e.currentTarget).data('collection');
        tsLiveScreen.v.activeTab2Id = tab; // active subTab id
        tsLiveScreen.v.collection = collection; // active collection

        await tsLiveScreen.f.setParam('collection',collection); // set search param
        await tsLiveScreen.f.getFilterItems(tab,collection); // 필터 목록 가져옴
        tsLiveScreen.f.setFilterList(tab,collection); // 필터 ele 그려줌

        tsLiveScreen.v.pagingNow = 0;
        tsLiveScreen.v.params.pageStart = 0;

        tsLiveScreen.c.search(); // 검색 결과 그려줌

        $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsLiveScreen.f.changePaging);
      },

      /**
       * 스크랩 toggle
       * @param {*} e
       * @returns
       */
      toggleScrapLive: (e)=> {
        let scrapYn = $(e.currentTarget).attr('class').indexOf('active');
        if(scrapYn > -1) {
          $(e.currentTarget).removeClass('active');
          scrapYn = 'N';
        }else {
          $(e.currentTarget).addClass('active');
          scrapYn = 'Y';
        }

        //console.log(scrapYn);

        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');
          return;
        }

        const type = $(e.currentTarget).attr('name');

        console.log("live toggleScrap>>", scrapYn);
        const masterSeq = $(e.currentTarget).data('seq');
        tsLiveScreen.c.doLiveScrap(type, scrapYn, masterSeq);
      },

      downSingleFile: (e) => {
        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');
          return;
        }

        const linkPath = $(e.currentTarget).data('path');
        let link = document.createElement("a");

        link.target = "_blank";
        link.href = linkPath;

        link.click();
        link.remove();
      },

      moveLinkNewTab: (e) => {
        const link = $(e.currentTarget).data('link');

        if (!$isLogin) {
          $alert.open('MG00001');
          return;
        }
        window.open(link, '_blank');

      },

      // 파일 미리보기 (통합게시판)
      previewFileTotal: (e) => {
        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');
          return;
        }

        const fileId = $(e.currentTarget).data('id');
        const path = $(e.currentTarget).data('path');
        const fileType = $(e.currentTarget).data('type');

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
      },


      // 필터 목록
      getFilterItems : function (tab,collection){
        const allCommonCode = { name: '전체', sortCode: 'all' }

        const gubun = [
          { id: '쌤OTT', name: '쌤OTT', sortCode: '쌤OTT' },
          { id: '자료나눔', name: '자료나눔', sortCode: '자료나눔' },
          { id: 'LIVE강연', name: 'LIVE강연', sortCode: 'LIVE강연' }
        ]

        tsLiveScreen.v.filters.gubun = [allCommonCode, ...gubun];

        // 필터 엘리먼트 생성
        tsLiveScreen.f.setFilterList(tab, collection);
      },


      // 필터 영역 그려줌
      setFilterList : function (tab,collection){
        const filterName = {
          gubun : '분류'
        }

        // subTab에 따라 필터 key 목록 지정 (teacherlive인 경우 분류)
        const filterBySubTab = {
          teacherlive : ['gubun']
        }

        let el = ``;

        filterBySubTab[collection].forEach((ft,index)=>{
          let el2 = ``;

          tsLiveScreen.v.filters[ft].forEach((ftItem, k) => {
            const a = `
              <span class="ox" data-name="filter">
                <input 
                type="checkbox" 
                id="${k ? ftItem.id : collection + ftItem.commonCode + index}" 
                data-cmCode="${ftItem.sortCode}"
                class="${k ? '' : 'all'}"
                ${k ? "" : "checked"}
                >
                <label for="${k ? ftItem.id : collection + ftItem.commonCode + index}">${ftItem.name}</label>
              </span>
            `;

            el2 += a;
          })

          el += `
            <div class="filters" id="${collection + ft + index}">
              <strong class="title" data-filter-key="${ft}">${filterName[ft]}</strong>
              <div class="ox-group" id="${index}">
              ${el2}
              </div>
            </div>
          `;
        });

        tsLiveScreen.v.Totalsearch.appendCategory(tab,el);

        // 필터 input click
        $('div[name=searchTab][data-boardtype=teacherlive] .ox').on('click','input', (e)=> tsLiveScreen.f.changeFilter(e))

      },


      // 필터 조건 변경
      changeFilter : async function (e){
        const parentId = $(e.currentTarget).parents('.filters').attr('id');
        const key = $(`#${parentId} .title`).attr('data-filter-key');

        await tsAllScreen.f.handleFilter(e);

        const checkedList = tsAllScreen.f.getCheckedInputs(parentId);

        // param 담기
        tsLiveScreen.f.setParam(key,checkedList.toString());

        // 검색 요청
        tsLiveScreen.c.search();
      },

      // 페이지 이동
      changePaging: async (e) => {
        const pagingNow = e.currentTarget.value;

        console.log("pagingNow: ", pagingNow);

        tsLiveScreen.v.pagingNow = Number(pagingNow);
        tsLiveScreen.v.params.pageStart = Number(pagingNow);

        // [API] 통합검색 API 요청
        const response = await tsLiveScreen.c.search();

        if (response) {
          // 결과 리스트 화면 그리기
          tsLiveScreen.f.renderTeacherLive(response);
        }
      },

      renderTeacherLive: async (res, result, idx) => {
        let tabIndex = 0;
        tabIndex = !_.isNil(idx) && idx !== "" ? idx : 0;
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const resultArea = $(`${tabId}-${tabIndex}`);
        const headName = '티처Live';

        // 통합게시판 헤더 세팅
        const resultHeader = tsAllScreen.f.getBoardHeader('teacherlive', headName, result ? result.count : 0);
        const dataList = result?.documentList;

        let resultList = '';
        let resultItems = '';

        resultItems += '<div class="result-items">'
        dataList?.slice(0, tabIndex ? 20 : 5).map((data,key) => {
          const TB = data.document;
          resultItems += `
          <div class="item ">
            <div class="inline-wrap gutter-md">
                ${TB.contentType == 'BOARD' ? `
                  ${TB.thumbImageFileId != '' && TB.thumbImageFileId != '/pages/api/file/view/undefined'  ? `
                    ${TB.menuName == '쌤OTT' ? `
                      ${TB.contentType != 'CMS' ? `
                        <div class="image-wrap">
                          <img src="/pages/api/file/view/${TB.thumbImageFileId}" alt="">
                        </div>
                      ` : ` <div class="image-wrap">
                          <img src="${cmsurl}${TB.parameter}" alt="">
                        </div>`}
                    ` : ` <div class="image-wrap">
                        <img src="${TB.thumbImageFileId}" alt="">
                      </div>`}
                   ` : ``}
              ` : `<div class="media">
                    <img src="/assets/images/common/${$extension.extensionToIcon(TB.extension)}" alt="${TB.extension} 아이콘">
                  </div>
              `}
              <div class="text-wrap">
                ${TB.contentType == 'FILE' ? `
                <a class="title">${TB.originFileName}</a>
                ` : `
                <a class="title">${TB.title}</a>
                `}
                <div class="inline-wrap">
                  <span class="extra">${TB.menuName}</span>
                </div>
              </div>
            </div>
            <div class="buttons" data-item-index="${key}">
                ${TB.contentType == 'BOARD' ? `
              <button 
                type="button" 
                name="newTabBtnLive" 
                class="button type-icon size-sm" 
                data-link="${TB.linkUrl}" 
                >
                <svg>
                  <title>아이콘 새창</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                </svg>
              </button>
              ` : ''}
              ${TB.contentType == 'FILE' ? `
                ${TB.menuName != '자료나눔' ? `
                <button 
                  type="button" 
                  class="button type-icon size-sm" 
                  name="previewBtn"
                  ${tsAllScreen.f.ynToBooleanDisabled(TB.previewUseYn)}
                  data-path="${TB.previewUrl}"
                  data-type="${TB.uploadMethod}"
                  data-id="${TB.fildId}"
                  >
                  <svg>
                    <title>아이콘 돋보기</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                  </svg>
                </button>
                ` : ''}
              ` : ''}
              ${TB.contentType == 'FILE' ? `
              <button 
                type="button" 
                class="button type-icon size-sm" 
                name="downloadBtn"
                type="button"
               ${tsAllScreen.f.ynToBooleanDisabled(TB.downloadUseYn)}
                data-path="${TB.downloadUrl}"
                data-type="${TB.uploadMethod}"
                >
                <svg>
                  <title>아이콘 다운로드</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                </svg>
              </button>
              ` : ''}
              ${TB.contentType == 'BOARD' && TB.menuName != 'LIVE 강연' ? `
              <button 
                type="button" 
                  name="${TB.menuName == '자료나눔' ? 'scrapBtnLive' : 'scrapBtnLiveOtt' }"
                class="button type-icon size-sm toggle-this ${TB.scrapUseYn === 'N' ? 'disabled' : ''} ${TB.menuName == '자료나눔' ? `${TB.myScrapShareFlag == '1' ? 'active' : ''}` : `${TB.myScrapOttFlag == '1' ? 'active' : ''}`} 
                data-toast="toast-scrap-${TB.masterSeq}"
                data-seq="${TB.masterSeq}"
                >
                <svg>
                  <title>아이콘 스크랩</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                </svg>
              </button>
              ` : ''}
              ${TB.contentType == 'BOARD' ? `
              <button data-type=share type="button" name="shareBtn" class="button type-icon size-sm" ${tsAllScreen.f.ynToBooleanDisabled(TB.shareUseYn)}>
                <svg>
                  <title>아이콘 공유</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                </svg>
              </button>
              ` : ''}
            </div>
          </div>
          `;
        })


        if (result?.count > 20 ) {
          resultItems += '<div class="pagination"></div>'
        }

        resultItems += '</div>'

        resultList += resultHeader;
        resultList += resultItems;

        await resultArea.append(resultList);

        if (result?.count > 20) {
          $paging.bindTotalboardPaging(res);
        }

        $(document).off('click', '[name=newTabBtnLive]').on('click', '[name=newTabBtnLive]', tsLiveScreen.f.moveLinkNewTab);

        $(document).off('click', '[name=scrapBtnLive], [name=scrapBtnLiveOtt]').on('click', '[name=scrapBtnLive], [name=scrapBtnLiveOtt]', tsLiveScreen.f.toggleScrapLive);

        // 다운로드
        $(document).off('click', '[name=downloadBtn]').on('click', '[name=downloadBtn]', tsLiveScreen.f.downSingleFile);

        $(document).off('click', '[name=previewBtn]').on('click', '[name=previewBtn]', tsLiveScreen.f.previewFileTotal);


        //screen.f.addButtonEventsForTotalBoard(document);

      }


    },

    event: function () {
      // subTab 변경
      $('.tab[name=subTab] li').on('click','a[data-boardtype=teacherlive]' ,(e)=> tsLiveScreen.f.changeEleTab(e));

      $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsLiveScreen.f.changePaging);
    },

    init: function () {

      tsLiveScreen.event();
    },
  };

  tsLiveScreen.init();
});
