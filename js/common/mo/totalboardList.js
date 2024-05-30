
let screen = {
  v: {
    mainInfoList: JSON.parse($('[name=mainInfoList]').val()),
    totalboardCategoryList: $('[name=totalboardCategoryList]').length > 0 ? JSON.parse($('[name=totalboardCategoryList]').val()) : '',
    totalCnt: $('[name=totalCnt]').val(),
    textbookInfoUseYn: $('[name=textbookInfoUseYn]').val() ? $('[name=textbookInfoUseYn]').val() : 'N',
    thumbnailLongYn: $('[name=thumbnailLongYn]').val() ? $('[name=thumbnailLongYn]').val() : 'N',
    schoolLevelForItem: $('[name=schoolLevelForItem]').val() ? $('[name=schoolLevelForItem]').val() : '',
    mainId: '',
    mainInfo: {},
    tabType: $('.tab').length > 0 ? 'Y' : 'N',
    // tabList: JSON.parse($('[name=tabList]').val()),
    searchCondition: {},
    resultList: [],
    categoryList: []
  },

  c: {
    getEleGnbList: function(categoryCode){
      let mainId = $("input[name=mainId]").val();
      let categorySeq = $("input[name=lnbCateSeq]").val();
      let key3 = mainId;
      if(mainId == null || mainId == ""){
        key3 = categorySeq;
      }else{
        categorySeq = '';
      }
      $cmm.ajax({
        url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
        method: 'GET',
        data: {
          mainId: mainId,
          categorySeq: categorySeq,
          categoryType: categoryCode
        },
        success: function (res) {
          let list = res.rows || [];

          let parentSortCode = '';
          list.filter((v) => {
            if (v.webName1.indexOf(window.location.pathname) > -1) {
              parentSortCode = v.sortCode.substr(0,6);
            }
          });

          let lv1_section = $("#sample_lv01");
          lv1_section.empty();

          let lv2_section = $("#sample_lv02");
          lv2_section.empty();

          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if(item.level == 2){
              lv1_section.append(`
                <a href="${item.webName1}" class="${parentSortCode === item.sortCode ? 'active history-depth-1' : 'history-depth-1'}">${item.name}</a>
              `);
            }else if(item.level == 3){
              if (parentSortCode === item.sortCode.substr(0,6)) {
                lv2_section.append(`
                    <a href="${item.webName1}" class="${item.webName1 != null && item.webName1 != '' && item.webName1.indexOf(window.location.pathname) > -1 ? 'active history-depth-2' : 'history-depth-2'}">${item.name}</a>
                `);
              }
            }
          }

        }
      });
    },
    getGnbList: function (categoryCode){ // 현재 1depth 만 작업됨.
      let mainId = $("input[name=mainId]").val();
      $cmm.ajax({
        url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
        method: 'GET',
        data: {
          mainId: mainId,
          categoryType: categoryCode
        },
        success: function (res) {
          let list = res.rows || [];
          for(let i=0; i<list.length; i++){
            let item = list[i];
            let element = $("#sampleGnb").clone();
            element.html(item.name).attr('href', item.pageUrl).attr('target', item.target);
            if(item.key3 == mainId){
              element.addClass('active');
            }
            element.attr("id", item.seq);
            $("#cmmBoardGnbList").append(element);
          }
        }
      });
    },

    getTotalboardCategoryList: ()=> {
      const options = {
        url: '/pages/api/totalboard/common/getTotalboardCategoryList.ax',
        method: 'GET',
        data: {
          mainId: screen.v.mainId
        },
        success: function (res) {
          console.log(res);
          screen.v.categoryList = res.rows;
          //카테고리 리스트 바인딩
          screen.f.bindCategoryList();
        }
      };

      $cmm.ajax(options);
    },
    /**
     * 목록 조회
     * @param {*} pagingNow 
     */
    getTotalboardSearchList: (pagingNow)=> {
      let url = screen.v.mainInfo.viewPageYn === "Y" ? 'getTotalboardSearchList' : 'getTotalboardSearchList2'

      screen.f.setSearchCondition(pagingNow);
      const options = {
        url: `/pages/api/totalboard/common/${url}.ax`,
        method: 'GET',
        data: {
          searchCondition: JSON.stringify(screen.v.searchCondition),
          mainId: screen.v.mainId
        },
        success: function (res) {
          console.log(res);
          screen.v.resultList = res.rows;

          $("[data-name='initNoDataBox']").addClass("display-hide");

          if(res.totalCnt > 0){
            $("[data-name='noDataBox']").addClass("display-hide");
            $("[data-name='noDataBox']").removeClass("display-show");

            if(res.totalCnt > 12) {
              $('.pagination').removeClass('display-hide');
              $('.pagination').addClass('display-show-flex');
            } else {
              $('.pagination').removeClass('display-show-flex');
              $('.pagination').addClass('display-hide');
            }
          } else {
            $("[data-name='noDataBox']").removeClass("display-hide");
            $("[data-name='noDataBox']").addClass("display-show");

            $('.pagination').removeClass('display-show-flex');
            $('.pagination').addClass('display-hide');
          }

          screen.f.bindDataList();
          $paging.bindTotalboardPaging(res);
          toggleThis('.toggle-this');
        }
      };

      $cmm.ajax(options);
    },
    
    /**
     * 스크랩, 좋아요 
     * @param {*} type scrapBtn: 스크랩 / likeBtn: 좋아요
     * @param {*} scrapYn Y: 활성화 / N: 비활성화(취소)
     * @param {*} masterSeq
     * @param {*} callback 
     */
    doTotalboardScrap: (type, scrapYn, masterSeq, callback)=> {
      let url = '';
      let method = '';
      if(scrapYn === 'Y') {
        method = 'POST';
        url = '/pages/api/totalboard/common/insertTotalboardScrap.ax';
      }else {
        method = 'PUT';
        url = '/pages/api/totalboard/common/deleteTotalboardScrap.ax';
      }
      const options = {
        url: url,
        method: method,
        data: {
          masterSeq: masterSeq,
          scrapType: type === 'scrapBtn' ? 'TOTALBOARD' : 'TOTALBOARD-LIKE',
          scrapUrl: type === 'scrapBtn' ? location.pathname + '/' + masterSeq : null
        },
        success: function (res) {
          if(type === 'likeBtn') callback(masterSeq, scrapYn);
        }
      };

      $cmm.ajax(options);
    }
  },

  f: {
    /**
     * 상태 초기화
     */
    initState: ()=> {
      //태그 영역
      //$('div[name=categoryTagArea]').empty();
      //카테고리
      $('input:hidden[name^=category]').remove();
      //검색어
      $('input[name=searchTxt]').val('');
      //검색조건
      $('#searchType option:eq(0)').prop('selected', true);
      $('#searchType').next('span.select2-selection__rendered').text($('#searchType').text());
      $('#searchType').next('span.select2-selection__rendered').attr('title', $('#searchType').text())
      //정렬조건
      $('#sortType option:eq(0)').prop('selected', true);
      $('#sortType').next('span.select2-selection__rendered').text($('#sortType').text());
      $('#sortType').next('span.select2-selection__rendered').attr('title', $('#sortType').text())

      screen.v.searchCondition = {};
    },

    /**
     * 탭 전환
     * @param {*} e 
     */
    changeTab: (e)=> {
      console.log($(e.currentTarget).attr('name'));
      //초기화
      screen.f.initState();
      //mainId 세팅
      screen.v.mainId = $(e.currentTarget).attr('name');
      //mainInfo 세팅
      screen.v.mainInfo = screen.v.mainInfoList.filter((data)=> data.mainId === screen.v.mainId)[0];
      //영역 id 재설정
      $('#main-contents .pane').attr('id', $(e.currentTarget).attr('href').replace('#', ''));

      screen.c.getTotalboardCategoryList();
      screen.c.getTotalboardSearchList();
    },

    goDetail: (e)=> {
      const readUseYn = screen.v.mainInfo?.listPageUseYn;
      const readRight = screen.v.mainInfo?.listPageRight;
      if(readUseYn === 'N' || !readRight) {
        location.href = location.pathname + '/' + $(e.currentTarget).data('seq');
      }else {
        const arrRight = readRight.split(';');
        let isRight = false;
        for(let i=0; i<arrRight.length; i++) {
          if(arrRight[i] === $('#boardRight').val()) {
            isRight = true;
            break;
          }
        }
        if(!$isLogin) {
          $alert.open('MG00001');
          return;
        }
        if(isRight) {
          let detailPath = location.pathname + '/' + $(e.currentTarget).data('seq');
          let tabSeq = $(".tab .active").data("id") || null;
          if(tabSeq != null){
            detailPath += '?tabSeq='+tabSeq;
          }
          location.href = detailPath;
        }else {
          $alert.open('MG00004');
          return;
        }
      }
    },

    /**
     * 검색조건 세팅
     * @param {*} pagingNow 
     */
    setSearchCondition: (pagingNow)=> {
      screen.v.searchCondition = {};
      const $tagList = $('input:hidden[name^=category]');
      $tagList.map((idx, data)=> {
        const key = $(data).attr('name');
        const val = $(data).attr('value');
        console.log(key, val);
        if(!screen.v.searchCondition[key]) screen.v.searchCondition[key] = new Array();
        screen.v.searchCondition[key].push(val);
      });
      screen.v.searchCondition.searchType = $('#searchType').val();
      screen.v.searchCondition.searchTxt = $('input[name=searchTxt]').val();
      screen.v.searchCondition.sortType = $('#sortType').val();
      screen.v.searchCondition.intervalType = $("#searchVideoTime").val();
      screen.v.searchCondition.pagingNow = _.isNil(pagingNow)?0:pagingNow;
      console.log("검색조건", screen.v.searchCondition);
    },

    /**
     * 공통코드 콤보박스 바인딩
     */
    setCombo: ()=> {
      $combo.setCmmCd(['TB0310', 'TB0320', 'TB0330', 'TB0340']);
    },

    checkAllCategoryUseYnN: (arrayOfObjects) => {
      // 카테고리 UseYn이 전부 N인 경우
      return arrayOfObjects.every(obj => obj.categoryUseYn === "N");
    },

    /**
     * 카테고리 바인딩
     */
    bindCategoryList: ()=> {

      const mappingTabId = $('.tab li.active a').attr('href');
      const categoryItemSelector = '.filter-wrap';
      const popupItemSelector = '.popup-sheet';
      const $top = $(mappingTabId).find(categoryItemSelector);
      const $popup = $(mappingTabId).find(popupItemSelector);

      //$(mappingTabId).find(categoryItemSelector).empty();
      console.log('카테바인딩, mainInfo확인', screen.v.mainInfo);

      if(screen.v.mainInfo.bannerUseYn === "Y"){
        $(mappingTabId).find('.banner').removeClass('display-hide');

        if($(mappingTabId).find('.banner').length < 1) {
          $top.before('<section class="banner"><a href="javascript:void(0)"><img></img></a></section>');
        }

        $(mappingTabId).find('.banner').find('img').attr('src', screen.v.mainInfo?.moBannerFilePath);
        $(mappingTabId).find('.banner').find('img').attr('alt', screen.v.mainInfo?.moBannerDisplayName);
      } else {
        if($(mappingTabId).find('.banner').length > 0) {
          $(mappingTabId).find('.banner').addClass('display-hide');
        }
      }

      if(screen.v.categoryList.length > 0) {
        let categoryUseYn = 'N';

        $top.removeClass('display-hide');
        $top.addClass('display-show');
        $('.filter-group').remove();

        $top.empty();
        const $filtersItem = $('<div class="filters"></div>');
        const $buttonsDiv = $('<div class="buttons type-rounded scrollable-x"></div>');

        const $filterItemTemp = $('<div></div>');

        screen.v.categoryList.map((data, dataIdx)=> {
          if (data.categoryUseYn == 'Y') {
            categoryUseYn = 'Y';
            // 필터 탭
            const $buttonsItem = `<button name="${dataIdx}">${data.categoryName}
                                    <svg>
                                      <title>화살표 아이콘</title>
                                      <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
                                    </svg>
                                  </button>`;
            $buttonsDiv.append($buttonsItem);

            // 전체 필터
            const $categoryItemPopup = $('<li class="filter-group"></li>');
            const htmlCategoryNamePopup = `<a href="javascript:void(0);" class="list-depth action">
                                          <div class="header-wrap">
                                              <h3>${data.categoryName}</h3>
                                              <span class="extra category-text"></span>
                                          </div>
                                      </a>`;
            const $categoryValueBoxPopup = $('<div class="pane"></div>');
            const $categoryValuePopup = $('<div class="filter-items"></div>');

            const categoryValueItem = data.categoryValue.split(';');

            const $filterItem = $('<div class="filter-items filter-items-' + dataIdx + ' display-hide"></div>');
            const $filterSlide = $('<div class="slides"></div>');
            const $filterSwiper = $('<div class="swiper-wrapper"></div>');
            const $filterSwiperPagination = $('<div class="swiper-pagination"></div>');

            categoryValueItem.map((item, itemIdx) => {
              const htmlCategoryValueItem = `
                  <div class="swiper-slide"><button type="button" name="filterSet" data-name="${data.categoryType === '999' ? 'category' + data.categoryType + data.groupNum : 'category' + data.categoryType}" value="${data.categoryType !== '999' ? item.split(':')[0] : item}">${data.categoryType !== '999' ? item.split(':')[1] : item}</button></div>
              `;

              $filterSwiper.append(htmlCategoryValueItem);

              const htmlCategoryValueItemPopup = `
                  <button type="button" value="${data.categoryType !== '999' ? item.split(':')[0] : item}" name="${data.categoryType === '999' ? 'category' + data.categoryType + data.groupNum : 'category' + data.categoryType}">${data.categoryType !== '999' ? item.split(':')[1] : item}</button>
              `;

              $categoryValuePopup.append(htmlCategoryValueItemPopup);
            });

            $filterSlide.append($filterSwiper);
            $filterSlide.append($filterSwiperPagination);
            $filterItem.append($filterSlide);
            $filterItemTemp.append($filterItem);

            $categoryValueBoxPopup.append($categoryValuePopup);

            $categoryItemPopup.append(htmlCategoryNamePopup);
            $categoryItemPopup.append($categoryValueBoxPopup);

            $popup.find('.filter-list').append($categoryItemPopup);
          }
        });

        const $filterPopupBtn = `<button type="button" class="filter-button" target-obj="popup-sheet">
                                      <svg>
                                          <title>필터 아이콘</title>
                                          <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-filter"></use>
                                      </svg>
                                  </button>`;

        if (categoryUseYn == 'Y') {
          $filtersItem.append($buttonsDiv);
          $filtersItem.append($filterPopupBtn);
          $top.append($filtersItem);
          $top.append($filterItemTemp);

          toggleThis('.filter-items button');
          filterFunc();
          renderSwiper();
        }
      } else {
        $top.removeClass('display-show');
        $top.addClass('display-hide');
      }
    },

    /**
     * 목록 바인딩
     * item list 구조
     * image-wrap
     *  (썸네일)
     * inner-wrap
     *  text-wrap(카테고리, 타이틀, 요약) 공통
     *  source-wrap (subject, 태그, 출처) 분기
     *  board-buttons(미리보기, 다운로드, 스크랩, 공유하기, 좋아요) 분기
     */
    bindDataList: ()=> {

      const scrapHide = screen.v.mainInfo.scrapUseYn === 'Y' ? '' : ' display-hide';
      const shareHide = screen.v.mainInfo.shareUseYn === 'Y' ? '' : ' display-hide';
      const $boardItem = screen.v.tabType === 'Y' ? $($('.tab li.active a').attr('href')).find('.board-items') : $('.board-items');

      $boardItem.empty();
      screen.v.resultList.map((data, idx)=> {
        const numFormat = (num) => {
          let variable = Number(num).toString();
          if(Number(variable) < 10 && variable.length === 1) {
            variable = '0' + variable;
          }
          return variable;
        }
        const $item = $(`<div class="${screen.v.thumbnailLongYn === "Y" ? 'item size-textbook' : 'item'}"></div>`);
        const $inner = $('<div class="item-inner"></div>');
        const $source = $('<div class="inner-wrap"></div>');

        const htmlImage = `
          <div class="image-wrap">
            <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
            <div class="info-media">
              <img src="/assets/images/common/icon-clip${screen.v.schoolLevelForItem !== 'ele' ? '-' + screen.v.schoolLevelForItem : ''}.svg"
              alt="clip 아이콘" 
              class="${data.fileYn === 'N' ? ' display-hide' : ''}"/>
              ${!$text.isEmpty(data?.videoPlayTime) ? '<span class="time">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
            </div>
          </div>
        `;
        const htmlText = `
          <div class="text-wrap">
            <ul class="divider-group">
              ${!$text.isEmpty(data.gradeName)          ? '<li>' + data.gradeName           + '</li>' : ''}
              ${!$text.isEmpty(data.termName)           ? '<li>' + data.termName            + '</li>' : ''}
              ${!$text.isEmpty(data.subjectName)        ? '<li>' + data.subjectName         + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName1) ? '<li>' + data.categoryGroupName1  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName2) ? '<li>' + data.categoryGroupName2  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName3) ? '<li>' + data.categoryGroupName3  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName4) ? '<li>' + data.categoryGroupName4  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName5) ? '<li>' + data.categoryGroupName5  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName6) ? '<li>' + data.categoryGroupName6  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName7) ? '<li>' + data.categoryGroupName7  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName8) ? '<li>' + data.categoryGroupName8  + '</li>' : ''}
              ${!$text.isEmpty(data.categoryGroupName9) ? '<li>' + data.categoryGroupName9  + '</li>' : ''}
            </ul>
            
            ${screen.v.mainInfo.viewPageYn === "Y" ? '<a name="detailLink" href="javascript:void(0);" data-seq="'+ data.masterSeq + '"' + '>' : '<div>'}
              <p class="title">${data.title}</p>
              ${!$text.isEmpty(data?.summary) ? '<p class="desc">' + data.summary + '</p>' : ''}
            ${screen.v.mainInfo.viewPageYn === "Y" ? '</a>' : '</div>'}

          </div>
        `;

        const $subject = $('<div class="source-wrap"></div>');
        if(!_.isNil(data?.mappingSeq)) {
          htmlMainBadges = `
            <div class="subject">
              <div class="badges">
                <span class="badge type-round-box fill-green" title="${data?.mainTextbookName}">${data?.mainTextbookName}</span>
                <span class="desc">${
                !_.isEmpty(data?.mainUnitName) && _.isEmpty(data?.mainTextbookStartPage)
                    ? data.mainUnitName
                    : !_.isEmpty(data?.mainTextbookStartPage) && _.isEmpty(data?.mainUnitName)
                        ? data.mainTextbookStartPage+ '~' + data?.mainTextbookEndPage + 'p  '
                        : !_.isEmpty(data?.mainTextbookStartPage) && !_.isEmpty(data?.mainUnitName)
                            ? data.mainTextbookStartPage+ '~' + data?.mainTextbookEndPage + 'p  ' + data.mainUnitName
                            : ''}
              </span>
              </div>
            </div>
          `;
          if(!_.isEmpty(data?.mainTextbookName)) $subject.append(htmlMainBadges);
        }

        const $preview = $('<div class="buttons fluid"></div>');
        if (screen.v.mainInfo.viewPageYn === 'N') {
          if (data.videoFileId) {
            htmlPreview = `
              <button type="button" class="button size-sm" name="previewBtn" 
                  data-id="${data.videoFileId}"
                  data-type="${data.videoFileUploadMethod}"
                  data-path="${data.videoPath}"
                  data-cmstype="${!_.isEmpty(data?.cmsType) ? data.cmsType : ''}">
                  <svg>
                      <title>아이콘 돋보기</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                  </svg> 미리보기
              </button>
            `;
            $preview.append(htmlPreview);
          }

          if(data.fileYn === 'Y' && data.fileDownloadYn === 'Y') {
            htmlDownload = `
            <button type="button" class="button size-sm" onclick="alert('다운로드는 PC에서만 가능합니다.');">
                <svg>
                    <title>아이콘 다운로드</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                </svg> 다운로드
            </button>
            
          `;
           $preview.append(htmlDownload);
          }
        }

        //buttons
        const htmlButtons = `
          <div class="board-buttons">
            <input type="hidden" name="masterSeq" value="${data.masterSeq}" />

            <button type="button" name="scrapBtn" class="icon-button size-sm toggle-this ${data.scrapYn === 'Y' ? 'active' : ''}${scrapHide}">
              <svg>
                <title>아이콘 스크랩</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
              </svg>
            </button>
            <button type="button" name="shareBtn" class="icon-button size-sm ${shareHide}">
              <svg>
                <title>아이콘 공유</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
              </svg>
            </button>
            <button type="button" name="likeBtn" class="like toggle-this ${data.likeYn === 'Y' ? 'active' : ''}">
              <svg>
                <title>아이콘 좋아요</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-like"></use>
              </svg>
              <span>${data.likeCount}</span>
            </button>
           
          </div>
        `

        const type = $('button[name=listType]').not('.display-hide').data('id');

        if (screen.v.thumbnailLongYn == 'Y' || type === 'list-type') {
          $source.append(htmlText);
          $source.append(screen.v.textbookInfoUseYn === "Y" && !_.isEmpty($subject.text()) ? $subject : '');
          $source.append(htmlButtons);
          $source.append(screen.v.textbookInfoUseYn === "Y" && !_.isEmpty($preview.text()) ? $preview : '');
          $item.append(htmlImage);
          $item.append($source);
        } else {
          $inner.append(htmlImage);
          $inner.append(htmlButtons);
          $item.append($inner);
          $source.append(htmlText);
          $source.append(screen.v.textbookInfoUseYn === "Y" && !_.isEmpty($subject.text()) ? $subject : '');
          $source.append(screen.v.textbookInfoUseYn === "Y" && !_.isEmpty($preview.text()) ? $preview : '');
        }

        $item.append(!_.isEmpty($source.text()) ? $source : '');
        $boardItem.append($item);
      });
    },
    
    /**
     * 스크랩, 좋아요 toggle
     * @param {*} e 
     * @returns 
     */
    toggleScrap: (e)=> {
      if(!$isLogin) {
        $alert.open('MG00001');
        $(e.currentTarget).removeClass('active');
        return;
      }

      const type = $(e.currentTarget).attr('name');

      if(type === 'scrapBtn' && $('#boardGrade').val() !== '002') {
        $alert.open('MG00011');
        $(e.currentTarget).removeClass('active');
        return;
      }

      let scrapYn = $(e.currentTarget).attr('class').indexOf('active');
      if(scrapYn > -1) scrapYn = 'Y';
      else scrapYn = 'N';
      console.log("toggleScrap>>", scrapYn);
      const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();
      
      screen.c.doTotalboardScrap(type, scrapYn, masterSeq, screen.f.syncLikeCount);
    },

    /**
     * 좋아요 count
     * @param {*} masterSeq 
     * @param {*} likeYn 
     */
    syncLikeCount: (masterSeq, likeYn)=> {
      
      const $count = $(`[name=masterSeq][value=${masterSeq}]`).parents('.board-buttons').not('.display-hide').children('button[name=likeBtn]').find('span');
      const originCnt = $count.text();
      console.log("기존좋아요수", originCnt);
      if(likeYn === 'Y') {
        $count.text(parseInt(originCnt) + 1);
      }else {
        $count.text(parseInt(originCnt) - 1);
      }
    },



    // single file 다운로드
    downSingleFile: (e) => {
      const fileId = $(e.currentTarget).data('id');
      const type = $(e.currentTarget).data('type');
      let link = document.createElement("a");

      link.target = "_blank";
      if(type === 'LINK') {
        link.href = $(e.currentTarget).data('path');
      }else {
        link.href = `/pages/api/file/down/${fileId}`;
      }

      link.click();
      link.remove();
    },

    // 파일 미리보기
    previewFile: (e) => {
      const fileId = $(e.currentTarget).data('id');
      let fileType = $(e.currentTarget).data('type');
      const masterSeq = $(e.currentTarget).data('seq');
      // if (fileType === 'CMS' && $(e.currentTarget).data('cmstype') === 'video') {
      //   fileType = 'HLS';
      // }

      if (fileType === 'LINK') {
        window.open($(e.currentTarget).data('path'), '_blank');
      } else {
        let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&referenceSeq=${masterSeq}&type=TOTALBOARD`;
        mteacherViewer.get_file_info(fileId).then(res => {

          screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      }

    },

    /**
     * 영상길이 form
     * @param {*} type 분/초
     * @returns
     */
    getVideoTimeForm: (type, duration) => {
      let result = '';

      type === 'min' ?
          result = parseInt(!duration ? 0 : duration / 60)
          : result = parseInt(!duration ? 0 : duration % 60);

      return String(result).padStart(2,'0');
    },

    /**
     * 로그인 체크
     * @param {*} type
     * @returns
     */
    loginCheck: (e) => {
      e.preventDefault();
      $alert.open('MG00001');
      return;
    },

    getCurrentLocationByName: () => {
      let concatenatedText = "";
      $(".breadcrumbs ul").find("li:not(.home)").each(function (index) {
        let $this = $(this);
        let text = $this[0].childNodes.length > 0 ? $this[0].childNodes[0].textContent : $this.text();
        if (index !== 0) {
          concatenatedText += " > ";
        }
        concatenatedText += text;
      });

      return concatenatedText;
    },

    // 즐겨찾기 추가
    addFavorite: () => {
      let dataObj = {};

      const currentLocationName = screen.f.getCurrentLocationByName();
      const currentUrl = window.location.origin + window.location.pathname;
      const referenceSeq = window.location.pathname.split('/');

      dataObj = {
        favoriteType: 'MTEACHER',
        referenceSeq: referenceSeq[referenceSeq.length - 1],
        favoriteName: currentLocationName, // 게시판명
        favoriteUrl: currentUrl, // 게시판 url
        useYn: 'Y',
      }

      const options = {
        url: '/pages/api/mypage/addFavorite.ax',
        data: dataObj,
        method: 'POST',
        async: false,
        success: function (res) {
          console.log(res)
          // 등록 성공시 Toast Msg - MG00038

        },
      };

      $.ajax(options);
    },

    // 즐겨찾기 해제
    updateFavorite: () => {
      let dataObj = {};
      // 즐겨찾기 해제 type을 delete로 사용
      const referenceSeq = window.location.pathname.split('/');

      dataObj = {
        favoriteType: "MTEACHER",
        referenceSeq: referenceSeq[referenceSeq.length - 1],
      }

      const options = {
        url: '/pages/api/mypage/updateFavorite.ax',
        data: dataObj,
        method: 'POST',
        async: false,
        success: function (res) {
          console.log(res);
          // 해제 성공시 Toast Msg - MG00039

        },
      };

      $.ajax(options);
    },

    setMyFavorite: () => {
      if(!$isLogin) {
        $alert.open('MG00001');
        $('#reg-favorite[type=checkbox]').prop("checked", false)
        return;
      }

      const addFavorite = $('#reg-favorite[type=checkbox]').is(':checked');

      if (addFavorite) {
        // 즐겨찾기 등록하는 경우
        screen.f.addFavorite();
      } else {
        // 즐겨찾기 해제하는 경우
        screen.f.updateFavorite();
      }
    }

  },

  event: function () {

    //탭전환
    $('.tab li a').on('click', screen.f.changeTab);

    $(document).on('click', 'a[name=detailLink]', screen.f.goDetail);

    //검색
    $('button[name=searchBtn]').on('click', ()=> {
      screen.c.getTotalboardSearchList();
    });
    $('input[name=searchTxt]').on('keyup', (e)=> {
      if(e.keyCode === 13) screen.c.getTotalboardSearchList();
    });

    //정렬방식 변경
    $(document).on('change', '#sortType', (e)=> {
      screen.c.getTotalboardSearchList();
    });

    $(document).on('change', '#searchVideoTime', (e)=> {
      screen.c.getTotalboardSearchList();
    });

    //스크랩, 좋아요
    $(document).on('click', '[name=likeBtn],[name=scrapBtn]', screen.f.toggleScrap);

    //공유하기
    // $(document).on('click', '[name=shareBtn]', screen.f.openShare);

    //페이징
    $(document).on('click', 'button[type=button][name=pagingNow]', (e)=> {
      const pagingNow = e.currentTarget.value;
      
      screen.c.getTotalboardSearchList(pagingNow);
    });


    // single file 다운로드
    $(document).on("click", "button[name=downloadBtn]", screen.f.downSingleFile);

    // 파일 미리보기
    $(document).on("click", "button[name=previewBtn]", screen.f.previewFile);

    // 즐겨찾기 등록
    $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);

  },

  init: function () {
    console.log('totalboard init!');
    console.log("교과 정보 사용여부 ===", screen.v.textbookInfoUseYn)
    screen.f.setCombo();
    screen.event();

    // GNB 코드 정보 가져오기
    let categoryCode = $("input[name=gnbCateType]").val() || '';
    if(categoryCode != '' && document.getElementById('cmmEleBoardGnbList') != null){
      screen.c.getEleGnbList(categoryCode); // 특화 자료실 쪽만 자동 불러오기 작업 됨.
    }

    if(screen.v.tabType === 'Y') {
      screen.v.mainId = $('.tab').find('li.active').find('a').attr('name');
      console.log('mainId', screen.v.mainId);
      screen.v.mainInfo = screen.v.mainInfoList.filter((data)=> data.mainId === screen.v.mainId)[0];
    }else {
      screen.v.mainInfo = screen.v.mainInfoList[0];
      screen.v.mainId = screen.v.mainInfo.mainId;
      console.log('mainId', screen.v.mainId);
    }

    if(screen.v.totalboardCategoryList && screen.f.checkAllCategoryUseYnN(screen.v.totalboardCategoryList)){
      $('.filter-wrap').removeClass('display-show');
      $('.filter-wrap').addClass('display-hide');
    }

    // 페이징영역 show/hide
    if(screen.v.totalCnt > 12){

      $('.pagination').removeClass('display-hide');
      $('.pagination').addClass('display-show-flex');
    } else {

      $('.pagination').removeClass('display-show-flex');
      $('.pagination').addClass('display-hide');
    }

  },
};
screen.init();


let $ttbdVar = screen.v;
let $ttbdAjax = screen.c;
let $ttbdFunc = screen.f;
