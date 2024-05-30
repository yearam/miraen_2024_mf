let tsAllScreen;
$(function () {
  /*
      * 초등 섹션 노출 순서 : 전체/M카이브/스마트수업/교과활동/특화자료실/창의적 체험활동/쉬는 시간/티처 LIVE
      * 중고등 섹션 노출 순서 : 전체, 스마트 수업자료, 교과서 자료, 수업혁신자료, 창의적 체험활동, 콘텐츠 플러스, 티처 LIVE, M카이브

   */

  tsAllScreen = {
    v: {
      totalSearch: new Totalsearch(),
      activeTab1Id: $('.tab[name=mainTab]').find('.active a').attr('href'),
      activeTabType: $('.tab[name=mainTab]').find('.active a').data('id'),
      keyword: "국어",
    },

    c: {
      scrapTextbookRef : (el,itemList)=>{

        const itemIndex = el.parent().data('itemIndex');
        const isScrap = !el.hasClass('active');
        const {DOCID} = itemList[itemIndex].document;

        let scrapUrl;
        let option;

        // console.log(itemIndex,isScrap,DOCID)

        if(isScrap){
          scrapUrl = '/pages/api/mypage/addScrap.ax';
          option = {scrapType : "TEXTBOOK", referenceSeq : DOCID, useYn : "Y" };
        }else{
          scrapUrl = '/pages/api/mypage/updateScrap.ax';
          option = {scrapType : "TEXTBOOK", referenceSeqList : DOCID };
        }

        $.ajax({
          url: scrapUrl,
          method : 'POST',
          data : option,
          success: ()=>{
            if(isScrap){
              el.addClass('active');
              $toast.open(el.data("toast"), "MG00041");
            }else{
              el.removeClass('active');
              $toast.open(el.data("toast"), "MG00042");
            }
          },
          error: function (){
            alert('스크랩 실패하였습니다');
          }
        })
      }


    },

    f: {
      /**
       * 전체 tab 결과 상단 메뉴리스트
       *
       * @memberOf tsAllScreen.f
       */
      executeSearch: () => {
        const tabType = $('div[name="mainTab"] > ul > li.active > a').data('id');
        tsAllScreen.v.tabType = tabType;

        const param = {
          keyword: '',
          pageStart: 0,
          resultCount: 10000,
          siteType: tabType,
          collection: 'all',
          myYn: 'N',
          myTextBookSeq: ""   // 사용자가 즐겨찾기 설정한 교과서 자료
        };

        tsAllScreen.v.totalSearch.getTotalsearchResult(param, tsAllScreen.f.renderResults);
        // tsAllScreen.v.totalSearch.getMenuList(tsAllScreen.f.displayMenuList);
      },

      changeMainTab: (e) => {
        // 카테고리 영역 초기화
        $(`.filter-wrap .buttons`).empty();
        $(`.filter-wrap .filter-items`).remove();

        //active 체크
        const mainTabId = $(e.currentTarget).attr('href');
        const mainTabType = $(e.currentTarget).data('id');
        tsAllScreen.v.activeTab1Id = mainTabId;
        tsAllScreen.v.activeTabType = mainTabType;
        console.log(tsAllScreen.v.activeTab1Id, tsAllScreen.v.activeTabType);
      },

      /**
       * 전체 tab 결과 상단 메뉴리스트
       *
       * @memberOf tsAllScreen.f
       */
      displayMenuList: (list) => {
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const menuList = list.menushortcuts?.documentList;
        tsAllScreen.v.menuListLength = list.menushortcuts ? menuList.length : 0;

        let resultArea = tabId + '-0 div[name="searchResultArea"]';

        if (tsAllScreen.v.menuListLength) {
          $(resultArea).css('display', 'block');
        }

        let $el = ''
        let tempEl = '';

        // console.log("menuList length", menuList?.length);
        if (menuList?.length > 0) {
          menuList.forEach((item) => {
            tempEl += `
              <a href="${item.document.menuLink}" class="block-button">
                <strong class="text-xl">${item.document.menuName}</strong>
                <span>${item.document.menuDescription}</span>
                <i class="icon">
                  <svg>
                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                  </svg>
                </i>
              </a>
            `
          })

          $el = `
                    <div class="inner-header"><h3>메뉴 바로가기</h3></div>
                    <div class="buttons type-row2">${tempEl}</div>
                 `

          tsAllScreen.v.totalSearch.appendResult(tabId+'-0', $el)
        } else {
          let resultArea = tabId + '-0 div[name="searchResultArea"]';
          $(resultArea).length && $(resultArea).css('display', 'none');
        }
      },

      /**
       * 통합게시판 게시물 타입 헤더 (공통)
       * */
      getBoardHeader: (subTabType, tabMenuName, totalCnt) => {
        const tabIndex = $('.tab[name=subTab]').find('.active a').attr('href').split('-')[1];
        let header = `
          <div data-type="${subTabType}">
             <div class="inner-header is-extra">
               <h3 name="tabMenuName">${tabMenuName}<span class="text-primary" name="tabMenuTotalCnt">(${totalCnt ? Number(totalCnt).toLocaleString() : 0})</span></h3>
               <a href="" class="button size-md type-text" data-a-type="move_subtab" data-type="${subTabType}" style="display: ${parseInt(tabIndex) === 0 && totalCnt >= 5 ? 'block' : 'none'}"> 더보기 <svg>
                  <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                </svg>
              </a>
             </div>
          </div>     
        `

        if (subTabType === 'mchive') {
          header = `
            <div data-type="${subTabType}">
               <div class="inner-header is-extra">
                 <h3 name="tabMenuName">${tabMenuName}<span class="text-primary" name="tabMenuTotalCnt">(${totalCnt ? Number(totalCnt).toLocaleString() : 0})</span></h3>
                 <a href="" class="button size-md type-text" data-a-type="move_subtab" data-type="${subTabType}" style="display: ${parseInt(tabIndex) === 0 && totalCnt >= 8 ? 'block' : 'none'}"> 더보기 <svg>
                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                  </svg>
                </a>
               </div>
            </div>     
        `
        }

        return header;
      },

      /**
       * 통합게시판 게시물 타입 아이템
       * */
      getBoardViewTypeItem: (data) => {
        const htmlItem = `
          <div class="item">
            <div class="inline-wrap gutter-md">
              <div class="image-wrap ${data.document.thumbnailFilePath ? 'display-show' : 'display-hide'}">
                <img src="${data.document.thumbnailFilePath}" alt="">
              </div>
              <div class="text-wrap">
                  <a class="title"> ${data.document.title}</a>
                <div class="inline-wrap">
                  <span class="extra">${data.document.menuName}</span>
                  ${data.document.myTextbookFlag > 0 ? '<span class="badge-recently type-dark">MY</span>' : ''}
                </div>
              </div>
            </div>
            <div class="buttons">
              <button 
                type="button" 
                name="newTabBtn" 
                class="button type-icon size-sm " 
                data-seq="${data.document.masterSeq}" 
                data-link="${data.document.viewPageYn === 'N' && data.document.videoFilePath != '' ? data.document.videoFilePath : data.document.pageUrl}"
                data-videoUploadMethod="${data.document.videoUploadMethod}"
                data-readuseyn="${data.document?.pageUseYn}"
                data-readright="${data.document?.pageRight}"
                data-viewpageyn="${data.document?.viewPageYn}"
              >
                <svg>
                  <title>아이콘 새창</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
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
        `
        return htmlItem;
      },


      /**
       * 통합게시판 첨부파일 타입 아이템
       * */
      getFileViewType: (data) => {
        // console.log("file data: ", data);
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

      renderResults: async (res) => {
        const count = res.row.totalCountResult;
        const result = res.row.searchResult;
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const tabType = $('.tab[name=mainTab]').find('.active a').data('id');
        const totalCount = res.row.totalCount;

        // 전체탭 오픈
        $('a[href="' + tabId + '-0"]').click();

        // subTab 결과 갯수 세팅
        if (screen.v.param.siteType === 'ele') {
          for (const subTab in count) {
            let tabName = subTab === 'smartclass' ? '스마트수업' : subTab === 'textbook' ? '교과활동' : subTab === 'special_ele' ? '특화자료실' : subTab === 'creative' ? '창의적 체험활동' : subTab === 'breaktime_ele' ? '쉬는시간' : subTab === 'mchive' ? 'M카이브' : subTab === 'teacherlive' ? '티처 LIVE' : '';
            $(tabId + ' a[data-collection="' + subTab + '"]').text(`${tabName}`);
          }
        } else {
          for (const subTab in count) {
            let tabName = subTab === 'smartclass' ? '스마트 수업자료' : subTab === 'textbook' ? '교과서 자료' : subTab === 'innovative_midhigh' ? '수업혁신자료' : subTab === 'creative' ? '창의적 체험활동' : subTab === 'contentsplus_midhigh' ? '콘텐츠 플러스' : subTab === 'mchive' ? 'M카이브' : subTab === 'teacherlive' ? '티처 LIVE' : '';
            $(tabId + ' a[data-collection="' + subTab + '"]').text(`${tabName}`);
          }
        }

        // 검색결과 0건
        if (!tsAllScreen.v.menuListLength && !totalCount) {
          $('div[data-page="totalsearch"].inner-section').css('display', 'block');

          let keywords = '';
          screen.v.keywords.forEach((kw, index) => {
            if (index > 0) {
              keywords += ', ';
            }
            keywords += kw;
          })

          $('div[data-page="totalsearch"].inner-section span').text(keywords);
        } else {
          $('div[data-page="totalsearch"].inner-section').css('display', 'none');
        }

        // 초기화
        $(tabId + '-0' + ' div[data-type="smartclass"]').remove();
        $(tabId + '-0' + ` div[data-type="textbook"], div[data-type="textbook"] + div.result-items`).remove();
        $(tabId + '-0' + ` div[data-type="special_ele"], div[data-type="special_ele"] + div.result-items`).remove();
        $(tabId + '-0' + ` div[data-type="creative"], div[data-type="creative"] + div.result-items`).remove();
        $(tabId + '-0' + ` div[data-type="breaktime_ele"], div[data-type="breaktime_ele"] + div.result-items`).remove();
        $(tabId + '-0' + ` div[data-type="teacherlive"], div[data-type="teacherlive"] + div.result-items`).remove();
        $(tabId + '-0' + ` div[data-type="mchive"], div[data-type="mchive"] + div.result-items`).remove();

        // 초기화 + 중고등
        $(tabId + '-0' + ` div[data-type="contentsplus_midhigh"], div[data-type="contentsplus_midhigh"] + div.result-items`).remove();
        $(tabId + '-0' + ` div[data-type="innovative_midhigh"], div[data-type="innovative_midhigh"] + div.result-items`).remove();

        /*
          * 초등 섹션 노출 순서 : 전체/M카이브/스마트수업/교과활동/특화자료실/창의적 체험활동/쉬는 시간/티처 LIVE
          * 중고등 섹션 노출 순서 : 전체, 스마트 수업자료, 교과서 자료, 수업혁신자료, 창의적 체험활동, 콘텐츠 플러스, 티처 LIVE, M카이브
       */

        // 각 함수를 순차적으로 실행
        if (result) {
          // 초등 / 중고등에 따라 순차 호출
          if (tabType === 'ele') {
            count.mchive > 0 ? await tsAllScreen.f.renderMchive(res, result.mchive) : null;
            count.smartclass > 0 ? await tsAllScreen.f.renderSmartClass(res, result.smartclass) : null;
            count.textbook > 0 ? await tsAllScreen.f.renderTextbookReference(res, result.textbook) : null;

            const eleItems = ['special_ele', 'creative', 'breaktime_ele'];

            for (const eleItem of eleItems) {
              count[eleItem] > 0 ? await tsAllScreen.f.setTotalboardDataList(res, eleItem) : null;
            }
            count.teacherlive > 0 ? await tsAllScreen.f.renderTeacherLive(res, result.teacherlive) : null;
          } else {
            count.smartclass > 0 ? await tsAllScreen.f.renderSmartClass(res, result.smartclass) : null;
            count.textbook > 0 ? await tsAllScreen.f.renderTextbookReference(res, result.textbook) : null;

            const midhighItems = ['innovative_midhigh', 'creative', 'contentsplus_midhigh'];

            for (const midhighItem of midhighItems) {
              count[midhighItem] > 0 ? await tsAllScreen.f.setTotalboardDataList(res, midhighItem) : null;
            }

            count.teacherlive > 0 ? await tsAllScreen.f.renderTeacherLive(res, result.teacherlive) : null;
            count.mchive > 0 ? await tsAllScreen.f.renderMchive(res, result.mchive) : null;
          }

          // 기존 호출
          // count.smartclass > 0 ? await tsAllScreen.f.renderSmartClass(res, result.smartclass) : null;
          // count.textbook > 0 ? await tsAllScreen.f.renderTextbookReference(res, result.textbook) : null;
          // count.special_ele > 0 ? await tsAllScreen.f.setTotalboardDataList(res, 'special_ele') : null;
          // count.innovative_midhigh > 0 ? await tsAllScreen.f.setTotalboardDataList(res, 'innovative_midhigh') : null;
          // count.creative > 0 ? await tsAllScreen.f.setTotalboardDataList(res, 'creative') : null;
          // count.contentsplus_midhigh > 0 ? await tsAllScreen.f.setTotalboardDataList(res, 'contentsplus_midhigh') : null;
          // count.breaktime_ele > 0 ? await tsAllScreen.f.setTotalboardDataList(res, 'breaktime_ele') : null;
          // count.teacherlive > 0 ? await tsAllScreen.f.renderTeacherLive(res, result.teacherlive) : null;
        }


        $('a[data-a-type="move_subtab"]').off('click').on('click', function (e) {
          e.preventDefault();

          // 초등 tabId: srchtab0
          // srchtab0 - 전체 / 1 - M카이브 / 2 - 스마트수업 / 3 - 교과활동 / 4 - 특화자료실 / 5 - 창의적 체험활동 / 6 - 쉬는시간 or 콘텐츠플러스 / 7 - 티처 LIVE
          // 중고등 tabId: srchtab1 or srchtab2
          // 0 - 전체  / 1 - 스마트 수업자료 / 2 - 교과서 자료 / 3 - 수업혁신자료 / 4 - 창의적 체험활동 / 5 - 콘텐츠플러스 / 6 - 티처 LIVE / 7 - M카이브
          const tabType = $(this).data('type');
          const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
          const mainTabType = tsAllScreen.v.activeTabType;

          if (tabType === 'smartclass') {
            tabId === "#srchtab0" ? $('a[href="' + tabId + '-2"]').click() : $('a[href="' + tabId + '-1"]').click()
          } else if (tabType === 'textbook') {
            tabId === "#srchtab0" ? $('a[href="' + tabId + '-3"]').click() : $('a[href="' + tabId + '-2"]').click();
          } else if (tabType === 'special_ele') {
            $('a[href="' + tabId + '-4"]').click();
          } else if (tabType === 'innovative_midhigh') {
            $('a[href="' + tabId + '-3"]').click();
          } else if (tabType === 'creative') {
            tabId === "#srchtab0" ? $('a[href="' + tabId + '-5"]').click() : $('a[href="' + tabId + '-4"]').click();
          } else if (tabType === 'contentsplus_midhigh') {
            $('a[href="' + tabId + '-5"]').click();
          } else if (tabType === 'breaktime_ele') {
            $('a[href="' + tabId + '-6"]').click();
          } else if (tabType === 'mchive') {
            tabId === "#srchtab0" ? $('a[href="' + tabId + '-1"]').click() : $('a[href="' + tabId + '-7"]').click();
          } else if (tabType === 'teacherlive') {
            tabId === "#srchtab0" ? $('a[href="' + tabId + '-7"]').click() : $('a[href="' + tabId + '-6"]').click();
          }
        })

        tsAllScreen.f.addPageEventsForMchive(document);

      },

      renderSmartClass: async (res, result, idx) => {
        let resultList = '';
        let smartClassEle = '';
        let tabIndex = 0;
        tabIndex = !_.isNil(idx) && idx !== "" ? idx : 0;

        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const activeTabType = $('.tab[name=mainTab]').find('.active a').data('id');
        const resultArea = $(`${tabId}-${tabIndex}`);

        for (let i = 0; i < Math.min(tabIndex ? 20 : 5 , result?.documentList?.length); i++) {
          const document = result?.documentList[i].document;
          const documentHtml = `
            <div class="item size-textbook">
              <div class="inline-wrap gutter-md">
                <div class="image-wrap">
                  <img src="${document.coverPath}" alt="">
                  ${document.myTextbookFlag !== 0 ? `<span class="badge type-round-box fill-dark">MY</span>` : ''}
                </div>
                <div class="text-wrap">
                  <strong class="title">${document.textbookName}</strong>
                  ${document.subjectName ? `<p class="desc">${document.subjectName}</p>` : ''}
                  ${document.unitName1 ? `
                    <div class="inline-wrap">
                        <span class="extra">${document.unitName1}</span>
                    </div>
                  ` : ''}
                  ${document.unitName2 ? `
                    <div class="inline-wrap">
                        <span class="extra"> | ${document.unitName2}</span>
                    </div>
                  ` : ''}
                  ${document.unitName3 ? `
                    <div class="inline-wrap">
                        <span class="extra"> | ${document.unitName3}</span>
                    </div>
                  ` : ''}
                  
                  <div class="buttons fluid">
                    ${activeTabType === 'ele' ? `
                      <button 
                        type="button" 
                        class="button size-sm type-secondary" 
                        data-btn-type="classLayer" 
                        data-subjectseq="${document.subjectSeq}">
                        <svg>
                          <title>책 아이콘</title>
                          <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                        </svg> 스마트 수업 
                      </button>
                    ` : document.ebookPath ? `
                      <div 
                        class="buttons fluid"
                        data-btn-type="smartppt" 
                        data-subjectseq="${document.myTextBookSeq}"
                        >
                        <button 
                          type="button" 
                          class="button size-sm"
                          data-btn-type="ebook"
                          data-path="${document.ebookPath}"
                        >
                          <svg>
                            <title>새창 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                          </svg> E-Book 
                        </button>
                        ${document.smartpptFilePath ? `
                          <button 
                            type="button" 
                            class="button size-sm type-secondary" 
                            data-btn-type="smartppt" 
                            data-path="${document.smartpptFilePath}">
                            <svg>
                              <title>책 아이콘</title>
                              <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                            </svg> 스마트 수업 
                          </button>
                        ` : ''}
                      </div>
                    ` : `
                      ${document.smartpptFilePath ? `
                        <button 
                          type="button" 
                          class="button size-sm type-secondary" 
                          data-btn-type="smartppt" 
                          data-path="${document.smartpptFilePath}">
                          <svg>
                            <title>책 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                          </svg> 스마트 수업 
                        </button>
                      ` : ''}
                    `}
                  </div>
              
                </div>
              </div>
            </div>
          `;

          smartClassEle += documentHtml;
        }

        resultList += `
          <div class="inner-section">
            <div data-type="smartclass">
              <div class="inner-header is-extra">
                <h3>${activeTabType === 'ele' ? '스마트수업' : '스마트 수업자료'} <span class="text-primary">(${result?.count ? result?.count : 0})</span></h3>
                <a href="" class="button size-md type-text" data-a-type="move_subtab" data-type="smartclass" style="display: ${tabIndex === 0 && result?.count >= 5 ? 'block' : 'none'}"> 더보기 <svg>
                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                  </svg>
                </a>
              </div>
              <div class="result-items">
              ${smartClassEle}            
              </div>
            </div>
          </div>
        `
        if (result?.count > 20 && parseInt(tabIndex) === (tabId === '#srchtab0' ? 2 : 1)) {
          resultList += '<div class="pagination"></div>'
        }

        await resultArea.append(resultList);

        if (result?.count > 20 && parseInt(tabIndex) === (tabId === '#srchtab0' ? 2 : 1)) {
          $paging.bindTotalboardPaging(res);

          // 페이징
          $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsEleScreen.f.changePaging);
        }

        // 차시창 오픈
        $('button[data-btn-type="classLayer"]').off('click').on('click', screen.f.openClassLayer);
        // 스마트ppt 오픈
        $('button[data-btn-type="smartppt"], button[data-btn-type="ebook"]').off('click').on('click', screen.f.openSmartClass);
      },

      setTotalboardDataList: (response, type)=> {
        // const tabId = tsAllScreen.v.tabType === 'ele' ? '#srchtab0-0' : tsAllScreen.v.tabType === 'mid' ? '#srchtab1-0' : '#srchtab2-0';
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        let subTabName = '';

        if (type === 'special_ele') {
          subTabName = '특화자료실';
        } else if (type === 'creative') {
          subTabName = '창의적 체험활동';
        } else if (type === 'breaktime_ele') {
          subTabName = '쉬는 시간';
        } else if (type === 'contentsplus_midhigh') {
          subTabName = '콘텐츠 플러스';
        } else if (type === 'innovative_midhigh') {
          subTabName = '수업혁신자료';
        }

        // [API] 통합검색 응답 값
        const { searchResult } = response.row

        // 통합게시판 헤더 세팅
        const resultHeader = tsAllScreen.f.getBoardHeader(type, subTabName, searchResult[type].count ? searchResult[type].count : 0);
        const dataList = searchResult[type]?.documentList;

        let resultList = '';
        let resultItems = '';

        resultItems += '<div class="result-items">'
        dataList.slice(0, 5).map((data) => {
          if (data.document.dataType === "DATA") {
            resultItems += tsAllScreen.f.getBoardViewTypeItem(data);
          } else if (data.document.dataType === "FILE") {
            resultItems += tsAllScreen.f.getFileViewType(data);
          }
        })

        resultItems += '</div>'

        resultList += `<div class="inner-section">`;
        resultList += resultHeader;
        resultList += resultItems;
        resultList += `</div>`;

        // tsAllScreen.v.totalSearch.appendResult(tabId, resultList);
        const resultArea = $(`${tabId}-0`);
        resultArea.append(resultList);

        screen.f.addButtonEventsForTotalBoard(document);

      },

      renderTextbookReference: async (res, result, idx) => {
        let tabIndex = 0;
        tabIndex = !_.isNil(idx) && idx !== "" ? idx : 0;
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const resultArea = $(`${tabId}-${tabIndex}`);
        const headName = tsAllScreen.v.activeTabType === 'ele' ? '교과활동' : '교과서 자료';

        // 통합게시판 헤더 세팅
        const resultHeader = tsAllScreen.f.getBoardHeader('textbook', headName, result ? result.count : 0);
        const dataList = result?.documentList;

        let resultList = '';
        let resultItems = '';

        resultItems += '<div class="result-items">'
        dataList?.slice(0, tabIndex ? 20 : 5).map((data,key) => {
          const TB = data.document;
          resultItems += `
          <div class="item">
            <div class="inline-wrap gutter-md">
              <div class="media">
                <img src="/assets/images/common/${$extension.extensionToIcon(TB.extension)}" alt="${TB.extension} 아이콘">
              </div>
              <div class="text-wrap">
                <strong class="title" data-tab-name="tsText" data-type="refName" data-item-index="${key}">${TB.referenceName}</strong>
                <div class="inline-wrap">
                  <span class="extra">${TB.textbookName}</span>
                  <span class="badge-recently type-dark" style="display: ${TB.myTextbookFlag ? "" : "none"}">MY</span>
                </div>
              </div>
            </div>
            <div class="buttons" data-item-index="${key}" data-tab-name="tsText">
              <button 
                type="button" 
                class="button type-icon size-sm" 
                data-type="preview"
                ${tsAllScreen.f.ynToBooleanDisabled(TB.reference_preview_use_yn)}
                >
                <svg>
                  <title>아이콘 돋보기</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#${TB.uploadMethod !== "NEWWIN" ? 'icon-search' : 'icon-new-windows-single'}"></use>
                </svg>
              </button>
              <button
                data-toast="${TB.DOCID}-tsAll"
                type="button" 
                class="button type-icon size-sm toggle-this ${TB.myScrapTextFlag ? 'active' : ''}"
                data-type="scrap"
                ${tsAllScreen.f.ynToBooleanDisabled(TB.reference_scrap_use_yn)}
                >
                <svg>
                  <title>아이콘 스크랩</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                </svg>
              </button>
              <button data-type="share" type="button" class="button type-icon size-sm" ${tsAllScreen.f.ynToBooleanDisabled(TB.reference_share_use_yn)}>
                <svg>
                  <title>아이콘 공유</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                </svg>
              </button>
            </div>
          </div>
          `;
        })

        if (result?.count > 20 && parseInt(tabIndex) === (tabId === '#srchtab0' ? 3 : 2)) {
          resultItems += '<div class="pagination"></div>'
        }

        resultItems += '</div>'

        resultList += `<div class="inner-section">`;
        resultList += resultHeader;
        resultList += resultItems;
        resultList += `</div>`;

        await resultArea.append(resultList);

        $(document).ready(function() {
          tsAllScreen.f.addButtonEvents(`${tabId}-${tabIndex}`, dataList?.slice(0, tabIndex ? 20 : 5), `tsText`);
        });

        if (result?.count > 20 && parseInt(tabIndex) === (tabId === '#srchtab0' ? 3 : 2)) {
          $paging.bindTotalboardPaging(res);

          // 페이징
          $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsEleScreen.f.changePaging);
        }

        return;
      },

      renderTeacherLive: async (res, result, idx= null) => {
        let tabIndex = 0;
        tabIndex = !_.isNil(idx) && idx !== "" ? idx : 0;
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const resultArea = $(`${tabId}-${tabIndex}`);
        const headName = '티처Live';

        // 헤더 세팅
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
                    ${TB.thumbImageFileId != '' ? ` <div class="image-wrap">
                      <img src="/pages/api/file/view/${TB.thumbImageFileId}" alt="">
                    </div>
                    ` : ''}
              ` : `<div class="media">
                    <img src="/assets/images/common/${$extension.extensionToIcon(TB.extension)}" alt="${TB.extension} 아이콘">
                  </div>
              `}
              <div class="text-wrap">
                <strong class="title">${TB.title}</strong>
                <div class="inline-wrap">
                  <span class="extra">${TB.menuName}</span>
                </div>
                <div class="buttons" data-item-index="${key}">
                    ${TB.contentType == 'BOARD' ? `
                  <button 
                    type="button" 
                    name="newTabBtn" 
                    class="button type-icon size-sm " 
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
                      data-type="previewBtn"
                      ${tsAllScreen.f.ynToBooleanDisabled(TB.previewUseYn)}
                      data-link="${TB.previewUrl}" 
                      data-id="${TB.fileId}"
                      data-path="${TB.previewUrl}"
                      data-type="${TB.uploadMethod}"
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
                    data-type="downloadBtn"
                    type="button"
                   ${tsAllScreen.f.ynToBooleanDisabled(TB.downloadUseYn)}
                    data-path="${TB.downloadUrl}"
                    data-path="${TB.previewUrl}"
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
                    class="button type-icon size-sm toggle-this ${TB.scrapUseYn === 'N' ? 'disabled' : ''} ${TB.menuName == '자료나눔' ? TB.myScrapShareFlag == '1' ? 'active' : '' : TB.myScrapOttFlag == '1' ? 'active' : ''}"
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
            </div>
          </div>
          `;
        })


        resultItems += '</div>'

        resultList += `<div class="inner-section">`;
        resultList += resultHeader;
        resultList += resultItems;
        resultList += `</div>`;

        await resultArea.append(resultList);

        $(document).off('click', '[name=scrapBtnLive], [name=scrapBtnLiveOtt]').on('click', '[name=scrapBtnLive], [name=scrapBtnLiveOtt]', tsLiveScreen.f.toggleScrapLive);

        screen.f.addButtonEventsForTotalBoard(document);

      },

      addPageEventsForMchive: (parentNode) => {
        // 새창열기
        $(parentNode).off('click', 'a[name=title]').on('click', 'a[name=title]', function (e) {
          tsAllScreen.f.moveNewDetail(e);
        })
      },

      moveNewDetail: (e) => {
        const masterSeq = e.currentTarget.dataset.masterseq;
        const contentType = e.currentTarget.dataset.contenttype;

        const url = '/pages/mchive/viewDetail.mrn?masterSeq='+masterSeq+'&contentType='+contentType+'&pagenm=main';

        const grade = $('#userGrade').val();


        if (!$isLogin) {
          $alert.open('MG00001');
          return;
        }else if(grade == '002'){
          window.open(url, '_blank');
        }else{
          $alert.open('MG00047');
          return;
        }
      },

      renderMchive: async (res, result, idx= null) => {
        let tabIndex = 0;
        tabIndex = !_.isNil(idx) && idx !== "" ? idx : 0;
        const tabId = $('.tab[name=mainTab]').find('.active a').attr('href');
        const resultArea = $(`${tabId}-${tabIndex}`);
        const headName = 'M카이브';

        // 헤더 세팅
        const resultHeader = tsAllScreen.f.getBoardHeader('mchive', headName, result ? result.count : 0);
        const dataList = result?.documentList;

        let resultList = '';
        let resultItems = '';

        resultItems += '<div class="result-items type-gallery">'
        dataList?.slice(0, 8).map((data) => {
          var min = 0;
          var sec = 0;
          //비디오 플레이 시간 계산
          if(null != data.document.videoPlayTime && '' != data.document.videoPlayTime) {
            var seconds = data.document.videoPlayTime;
            min = parseInt(seconds/60);
            sec = seconds%60;
            if (min.toString().length==1) min = "0" + min;
            if (sec.toString().length==1) sec = "0" + sec;
          }

          resultItems += '<div class="item '+renderListUnitNoImg(data.document)+'">';
          resultItems += '<div class="image-wrap">';
          resultItems += '<span class="badge type-round-box fill-dark" style="display:none">MY</span>';
          resultItems += '<img src="'+data.document.thumbnailFileId+'" onerror="this.style.display=\'none\';">';
          resultItems += '<div class="info-media">';

          if(data.document.mediaType == 'DIGITAL'){
            resultItems += '<img src="/assets/images/common/icon-union.svg" alt="union 아이콘">';
            resultItems += '<span class="time">실감형</span>';
          } else if(data.document.mediaType == 'AUDIO'){
            resultItems += '<img src="/assets/images/common/icon-music.svg" alt="music 아이콘" />';

            if(null != data.document.videoPlayTime && '' != data.document.videoPlayTime) {
              resultItems += '<span class="time">'+min + ':' + sec+'</span>';
            }
          } else if(data.document.mediaType == 'VIDEO'){
            resultItems += '<img src="/assets/images/common/icon-youtube.svg" alt="youtube 아이콘" />';

            if(null != data.document.videoPlayTime && '' != data.document.videoPlayTime) {
              resultItems += '<span class="time">'+min + ':' + sec+'</span>';
            }
          } else if(data.document.mediaType == 'IMAGE'){
            resultItems += '<img src="/assets/images/common/icon-img.svg" alt="img 아이콘" />';
          }

          resultItems += '</div>';
          resultItems += '</div>';
          resultItems += '<div class="text-wrap">';
          resultItems += '<a href="javascript:void(0);" class="title" name="title" data-masterseq="'+data.document.masterSeq+'" data-contenttype="'+data.document.categoryType+'" data-readuseyn="'+data.document?.pageUseYn+'"  data-readright="'+data.document?.readright+'" data-viewpageyn="'+data.document?.viewpageyn+'">'+data.document.title+'</a>';
          resultItems += '</div>';
          resultItems += '</div>';
        })

        resultItems += '</div>'

        resultList += `<div class="inner-section">`;
        resultList += resultHeader;
        resultList += resultItems;
        resultList += `</div>`;

        await resultArea.append(resultList);
      },

      addButtonEvents: (parentNode,itemList,tabName) => {
        // 파일 미리보기
        $(`${parentNode} [data-tab-name=${tabName}] [data-type=preview]`).off('click').on('click',function () {
          const teacher = tsAllScreen.f.checkTeacher('');

          if(teacher){
            const itemIndex = $(this).parent().data('itemIndex');

            const {DOCID,referenceFileId,uploadMethod,reference_preview_use_yn,path} = itemList[itemIndex].document;
            const source = uploadMethod === "LINK" ? uploadMethod : "CMS";
            const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${referenceFileId}&referenceSeq=${DOCID}&type=TEXTBOOK`;

            reference_preview_use_yn === 'Y' && uploadMethod !== "NEWWIN" ? screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview") : window.open(path,"_blank");
          }
        })


        // 파일 다운로드
        $(`${parentNode} [data-tab-name=${tabName}] [data-type=download]`).off('click').on('click',function () {
          const teacher = tsAllScreen.f.checkTeacher('');

          if(teacher){
            const itemIndex = $(this).parent().data('itemIndex');
            const {originFileName,path} = itemList[itemIndex].document;

            const downloadLink = document.createElement('a');
            downloadLink.href = path;
            downloadLink.target = '_blank'; // 다운로드를 새 창에서 열도록 설정
            downloadLink.download = originFileName; // 다운로드되는 파일의 이름 설정

            // 가상의 링크 엘리먼트를 문서에 추가하고 클릭 이벤트 발생
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // 가상의 링크 엘리먼트를 제거
            document.body.removeChild(downloadLink);
          }
        })


        // 스크랩
        $(`${parentNode} [data-tab-name=${tabName}]`).off('click').on('click','[data-type=scrap]',function () {
          // console.log('scrap() :', $(this));
          const teacher = tsAllScreen.f.checkTeacher('scrap');

          if(teacher){
            tsAllScreen.c.scrapTextbookRef($(this), itemList);
          }
        })


        // 공유하기
        $(`${parentNode} [data-tab-name=${tabName}] [data-type=share]`).off('click').on('click',function () {
          const teacher = tsAllScreen.f.checkTeacher('');

          if(teacher){
            const itemIndex = $(this).parent().data('itemIndex');
            const {DOCID} = itemList[itemIndex].document;
            const options = "width=997.3, height=455.9, resizable=no, scrollbars=no, top=50% ,left=50%"
            const grade = tsAllScreen.v.activeTabType === "ele" ? "elem" : tsAllScreen.v.activeTabType === "mid" ? "mid" : tsAllScreen.v.activeTabType === "high" ? "high" : "mid";

            if(ai_class_popup_yn){
              window.open(`${ai_site}/#/teacher/ai-class-share?worksheetId=${DOCID}&schoolType=${grade}`,"_blank",options)
            }else{
              $alert.open('MG00054', function () { // ~ AI클래스를 미리 만나보세요!
                const url = 'https://ele.m-teacher.co.kr/mevent/aiClass/';
                window.open(url,"_blank");
              });
            }
          }
        })


        // 자료명 클릭
        $(`a[data-tab-name=${tabName}][data-type=refName],strong[data-tab-name=${tabName}][data-type=refName]`).off('click').on('click',function(){
            const teacher = tsAllScreen.f.checkTeacher('');

            if(teacher){
              const itemIndex = $(this).data('itemIndex');

              const {DOCID,referenceFileId,uploadMethod,reference_preview_use_yn,path} = itemList[itemIndex].document;
              const source = uploadMethod === "LINK" ? uploadMethod : "CMS";
              const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${referenceFileId}&referenceSeq=${DOCID}&type=TEXTBOOK`;

              reference_preview_use_yn === 'Y' && uploadMethod !== "NEWWIN" ? screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview") : window.open(path,"_blank");
            }
          })
      },

      // parentId 하위의 체크된 input의 data-cmCode 값을 Array로 가져옴
      getCheckedInputs : (e, parentId)=>{
        const checkedFilter = $(e.currentTarget).parents('.filter-items').find('button').filter('.active');

        let checkedList = [];
        let textList = [];

        $.each(checkedFilter,(index,item)=>{
          checkedList.push($(item).attr('data-cmCode'));
          console.log($(item).attr('data-cmCode'))
          if ($(item).attr('data-cmCode') !== 'all') textList.push($(item).html());
        });

        $(`#${parentId} .header-wrap span.extra`).text(textList);

        return checkedList;
      },

      // 'Y','N' -> true,false
      ynToBooleanDisabled : function(yn) {
        if (yn == 'Y' || yn == 'y') {
            return "";
        } else if (yn == 'N' || yn == 'n') {
          return "disabled";
        } else {
          return yn;
        }
      },

      checkTeacher : function (type){
        if ($isLogin) {
          if ($('#userGrade').val() === '001') {
            if(type === 'scrap'){
              $alert.open("MG00003", () => {}); //교사인증을 하시면 이용이 가능합니다.
            }else if(type === 'smartClass'){
              $alert.open('MG00004'); // 열람/다운로드 권한이 없습니다.
            }else{
              $alert.open("MG00011", () => {}); //교사 인증이 필요합니다.
            }
            return false;
          } else if ($('#userGrade').val() === '002') {
            return true;
          }
        } else {
          $alert.open("MG00001", () => {}); // 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?

          return false;
        }
      },
    },


    event: function () {
      //$('div[data-type="re-search-div"] button').on('click', () => {
      //  tsAllScreen.f.executeSearch();
      //  $('div[data-type="re-search-div"] input').val('');
      //})
//
      //$('div[data-type="re-search-div"] input').on('keypress', (e) => {
      //  if (e.which === 13) {
      //    tsAllScreen.f.executeSearch();
      //    $('div[data-type="re-search-div"] input').val('');
      //  }
      //});

      // 초중고 메인 탭 이동
      $('.tab[name=mainTab] li a').on('click', tsAllScreen.f.changeMainTab);

      $(`div${screen.v.activeTab1Id} .tab[name=subTab] li a[data-collection=all]`).on('click',()=>{
        screen.v.activeTab2Collection = 'all';
      })

    },

    init: function () {
      console.log("totalserachAll init")
      if($('#totalsearchYn').val() === 'false') {
        $alert.open('MG00059', ()=> { // 준비중입니다.
          location.href = '/pages/ele/Main.mrn';
        });
      }

      // 검색어 URL 체크
      screen.f.getSearchText();

      tsAllScreen.event();
    },
  };

  tsAllScreen.init();
});