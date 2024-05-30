
let screen = {
  v: {
    mainInfoList: JSON.parse($('[name=mainInfoList]').val()),
    totalboardCategoryList: $('[name=totalboardCategoryList]').length > 0 ? JSON.parse($('[name=totalboardCategoryList]').val()) : '',
    totalboardCategoryListLength: $('[name=totalboardCategoryListLength]').length > 0 ? $('[name=totalboardCategoryListLength]').val() : 0,
    totalboardFilterReloadYn: $('[name=totalboardFilterReloadYn]').length > 0 ? $('[name=totalboardFilterReloadYn]').val() : 'N',
    totalCnt: $('[name=totalCnt]').text(),
    textbookInfoUseYn: $('[name=textbookInfoUseYn]').val() ? $('[name=textbookInfoUseYn]').val() : 'N',
    thumbnailLongYn: $('[name=thumbnailLongYn]').val() ? $('[name=thumbnailLongYn]').val() : 'N',
    thumbLogArr: $('[name=thumbLogArr]').val() || '',
    schoolLevelForItem: $('[name=schoolLevelForItem]').val() ? $('[name=schoolLevelForItem]').val() : '',
    mainId: '',
    mainInfo: {},
    tabType: $('.tab').length > 0 ? 'Y' : 'N',
    // tabList: JSON.parse($('[name=tabList]').val()),
    searchCondition: {},
    resultList: [],
    categoryList: [],
    categoryListObj: {
      termCode: [],
      subjectCode: [],
      categoryGroupName1: [],
      categoryGroupName2: [],
      categoryGroupName3: [],
      categoryGroupName4: [],
      categoryGroupName5: [],
      categoryGroupName6: [],
      categoryGroupName7: [],
      categoryGroupName8: [],
      categoryGroupName9: []
    },
    selectedCategoryLevel: null
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
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if(item.level == 2){
              let lv1_tmp = $("#sampleGnb_04 #sample_lv01").clone();
              let lv1_list_tmp = $("#sampleGnb_04 #sample_lv01_list").clone();
              lv1_tmp.find(".title").html(item.name)
              lv1_tmp.find("a").attr("href", item.pageUrl);
              lv1_tmp.find("a").prop("target", item.target);
              lv1_tmp.attr("id", item.seq);
              $("#cmmEleBoardGnbList").append(lv1_tmp);
            }else if(item.level == 3){
              let lv2_tmp = $("#sampleGnb_04 #sample_lv02").clone();
              lv2_tmp.attr("href", item.pageUrl);
              lv2_tmp.prop("target", item.target);
              lv2_tmp.find("span").html(item.name);
              lv2_tmp.attr("id", item.seq);
              $("#cmmEleBoardGnbList #" + item.parentSeq + " button").css("display", "block");
              $("#cmmEleBoardGnbList #" + item.parentSeq + " .level2List" ).append(lv2_tmp);
            }
            if(item.key3 == key3){
              $("#"+item.parentSeq ).addClass("active");
              $("#"+item.seq).addClass("active");
              if($("#" + item.parentSeq + " .pane .level2List").children().length > 0){
                $("#"+item.parentSeq+' .pane').show();
              }
            }
          }
          let li_list = $("#cmmEleBoardGnbList").children("li");
          li_list.map(function(idx){ // 하위 메뉴 없는 경우 하위 영역 삭제
            let element = li_list[idx];
            if($(element).find('.pane .level2List').children().length < 1){
              $(element).find('.pane').remove();
            }
          });
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
            element.find("a").html(item.name).attr('href', item.pageUrl).attr('target', item.target);
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
    getTotalboardSearchList: (pagingNow, isCateReload, selectedLevel)=> {
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

          $('strong[name=totalCnt]').text(res.totalCnt);
          screen.f.bindDataList();
          $paging.bindTotalboardPaging(res);
          toggleThis('.toggle-this');

          //카테고리 결과별 카테고리값 로드
          if(screen.v.totalboardFilterReloadYn === 'Y') {
            screen.v.selectedCategoryLevel = selectedLevel;
            if(!!isCateReload) screen.c.getTotalboardCategoryByResult();
          }
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


      // 상세페이지 없는 경우 - 스크랩 시
      let scrapUrl = null;
      if (type === 'scrapBtn') {
        scrapUrl = screen.v.mainInfo.viewPageYn === "Y" ? location.pathname + '/' + masterSeq : location.pathname;
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
          if(type === 'likeBtn') callback(masterSeq, scrapYn);
          else {
            if(scrapYn === 'Y') $toast.open(`toast-scrap-${masterSeq}`, 'MG00041');
            else $toast.open(`toast-scrap-${masterSeq}`, 'MG00042');
          }
        }
      };

      $cmm.ajax(options);
    },
    /**
     * 리스트 결과 별 카테고리
     */
    getTotalboardCategoryByResult: ()=> {
      
      console.log("파람확인", screen.v.searchCondition);
      const options = {
        url: '/pages/api/totalboard/common/getTotalboardCategoryByResult.ax',
        method: 'GET',
        data: {
          mainId: screen.v.mainId,
          searchCondition: JSON.stringify(screen.v.searchCondition),
        },
        success: function (res) {
          console.log(res);
          
          console.log("결과별카테고리리스트>>>", res.rows);
          //초기화
          screen.v.categoryListObj = {
            termCode: [],
            subjectCode: [],
            categoryGroupName1: [],
            categoryGroupName2: [],
            categoryGroupName3: [],
            categoryGroupName4: [],
            categoryGroupName5: [],
            categoryGroupName6: [],
            categoryGroupName7: [],
            categoryGroupName8: [],
            categoryGroupName9: []
          };

          //카테고리 항목별 배열생성        
          res.rows.map((data, idx)=> {
            screen.v.categoryListObj.termCode.push(data.termCode);
            screen.v.categoryListObj.subjectCode.push(data.subjectCode);
            screen.v.categoryListObj.categoryGroupName1.push(data.categoryGroupName1);
            screen.v.categoryListObj.categoryGroupName2.push(data.categoryGroupName2);
            screen.v.categoryListObj.categoryGroupName3.push(data.categoryGroupName3);
            screen.v.categoryListObj.categoryGroupName4.push(data.categoryGroupName4);
            screen.v.categoryListObj.categoryGroupName5.push(data.categoryGroupName5);
            screen.v.categoryListObj.categoryGroupName6.push(data.categoryGroupName6);
            screen.v.categoryListObj.categoryGroupName7.push(data.categoryGroupName7);
            screen.v.categoryListObj.categoryGroupName8.push(data.categoryGroupName8);
            screen.v.categoryListObj.categoryGroupName9.push(data.categoryGroupName9);
          });
          console.log("카테고리별 배열 생성>>>", screen.v.categoryListObj);
                  
          //배열 중복값 제거
          for(key in screen.v.categoryListObj) { 
            screen.v.categoryListObj[key] = [...new Set(screen.v.categoryListObj[key].filter((data, idx)=> !!data))];
          }
          console.log("카테고리별 배열 중복제거>>>", screen.v.categoryListObj);
          //카테고리 리로드 진행

          $('div.filters[data-level]').each(function() {
            const dataLevel = parseInt($(this).attr('data-level'));
            if (dataLevel > screen.v.selectedCategoryLevel) {
              const type = $(this).attr('data-type');
              screen.f.categoryTagUpdate(type)
            }
          });

        }
      };

      $cmm.ajax(options);
    },
  },

  f: {
    /**
     * 상태 초기화
     */
    initState: ()=> {
      //태그 영역
      $('div[name=categoryTagArea]').empty();
      //카테고리
      $('input[name^=category]').prop('checked', false);
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
          let tabSeq = $(".tab .active").data("id");
          if(!(tabSeq == undefined || tabSeq == null)){
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
      const $tagList = $('div[name=categoryTagArea]').find('span');
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

    /**
     * 카테고리 체크박스 리로드
     * */

    categoryTagUpdate: (category) => {
      const categoryList = $(`div.filters[data-type="${category}"] div.ox-group span.ox`);

      categoryList.find('input[type=checkbox]').prop('checked', false);

      categoryList.removeClass('display-hide');

      categoryList.each((index, item) => {
        const dataValue = $(item).data("value");
        const isExist = screen.v.categoryListObj[category].includes(dataValue);

        if(!isExist) {
          $(`div.filters[data-type="${category}"] div.ox-group span.ox[data-value="${dataValue}"]`).addClass('display-hide');
        }
      });

    },

    

    /**
     * 카테고리 체크박스 데이터 Tag영역 바인딩
     * @param {*} isChecked 
     * @param {*} type 
     * @param {*} categoryName 
     * @param {*} categoryValue 
     */
    bindCategoryTag: (isChecked, type, categoryName, categoryValue)=> {
      console.log('bindCategoryTag');
      const parentSelector = 'div[name=categoryTagArea]';
      const htmlTag = `
        <span class="item" name="${type}" value="${categoryValue}">
          ${categoryName}
          <button type="button" class="button size-xs type-text type-icon" name="delTagBtn">
            <svg>
              <title>아이콘 삭제</title>
              <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
            </svg>
          </button>
        </span>
      `;
      if(isChecked){
        $(parentSelector).append(htmlTag);
      }else {
        $(parentSelector).find(`[value='${categoryValue}']`).remove();
      }

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
      const $top = $(mappingTabId).find(categoryItemSelector);
      //$(mappingTabId).find(categoryItemSelector).empty();
      console.log('카테바인딩, mainInfo확인', screen.v.mainInfo);

      if(screen.v.mainInfo.bannerUseYn === "Y"){
        $top.find('.banner').removeClass('display-hide');

        if($top.find('.banner').length < 1) {
          $top.prepend('<a class="banner"><img></img></a>');
        }

        $top.find('.banner').find('img').attr('src', screen.v.mainInfo?.pcBannerFilePath);
        $top.find('.banner').find('img').attr('alt', screen.v.mainInfo?.pcBannerDisplayName);
      } else {
        if($top.find('.banner').length > 0) {
          $top.find('.banner').addClass('display-hide');
        }
      }

      if(screen.v.categoryList.length > 0 && screen.f.checkAllCategoryUseYnN(screen.v.categoryList)){
        // categoryList 배열에 모든 값이 categoryUseYn 이 N인 경우
        $top.removeClass('display-hide');
        $top.addClass('display-show');
        $('.filters').remove();
        $('.filter-items').addClass('display-hide');

        return;

      } else if(screen.v.categoryList.length > 0) {
        $top.removeClass('display-hide');
        $top.addClass('display-show');
        $('.filters').remove();
        $('.filter-items').removeClass('display-hide');
        screen.v.categoryList.map((data, dataIdx)=> {
          const $categoryItem = $('<div class="filters"></div>');
          const htmlCategoryName = `<strong class="title">${data.categoryName}</strong>`;
          const $categoryValue = $('<div class="ox-group"></div>');

          const categoryValueItem = data.categoryValue.split(';');
          categoryValueItem.map((item, itemIdx)=> {
            const htmlCategoryValueItem = `
              <span class="ox">
                <input type="checkbox" id="ox-filter${dataIdx}-${itemIdx}" name="${data.categoryType === '999' ? 'category' + data.categoryType + data.groupNum : 'category' + data.categoryType}" value="${data.categoryType !== '999' ? item.split(':')[0] : item}">
                <label for="ox-filter${dataIdx}-${itemIdx}">${data.categoryType !== '999' ? item.split(':')[1] : item}</label>
              </span>
            `;
            
            $categoryValue.append(htmlCategoryValueItem);
          });
          
          $categoryItem.append(htmlCategoryName);
          $categoryItem.append($categoryValue);

          if(data.categoryUseYn === "Y") {
            $top.find('.filter-items').before($categoryItem);
          }
        });
      } else if(!screen.v.categoryList.length && screen.v.mainInfo?.pcBannerFilePath){
        $top.removeClass('display-hide');
        $top.addClass('display-show');
        $('.filters').remove();
        $('.filter-items').addClass('display-hide');
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
        // 세로형 썸네일 설정
        let thumbnailClassName = "item";
        if(screen.v.thumbLogArr != ''){ // 탭 별 세로형 썸네일 설정이 있을 때
          if(screen.v.thumbLogArr.indexOf(screen.v.mainId) > -1 ){ // 메뉴 아이디로 판단
            thumbnailClassName = 'item size-textbook';
          }
        }else if(screen.v.thumbnailLongYn === "Y"){ // 탭별 세로형 썸네일 설정이 없을 때
          thumbnailClassName = 'item size-textbook'; // 썸내일 Long 여부로만 판단
        }

        const $item = $(`<div class="${thumbnailClassName}"></div>`);
        const $inner = $('<div class="inner-wrap"></div>');
        const $source = $('<div class="source-wrap"></div>');

        const htmlImage = `
          <div class="image-wrap">
            <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
            <div class="info-media">
              <img src="/assets/images/common/icon-clip${screen.v.schoolLevelForItem !== 'ele' ? '-' + screen.v.schoolLevelForItem : ''}.svg" 
                alt="clip 아이콘" 
                class="${data.fileYn === 'N' ? ' display-hide' : ''}"
              />
              ${!$text.isEmpty(data?.videoPlayTime) ? '<span class="time">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
            </div>
          </div>
        `;

        const htmlImage2 = `
          <div class="image-wrap">
            <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
            <div class="info-media">
              <img src="/assets/images/common/icon-clip${screen.v.schoolLevelForItem !== 'ele' ? '-' + screen.v.schoolLevelForItem : ''}.svg" 
                alt="clip 아이콘" 
                class="${data.fileYn === 'N' ? ' display-hide' : ''}"
              />
              ${!$text.isEmpty(data?.videoPlayTime) ? '<span class="time">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
            </div>
            <div class="${screen.v.mainInfo.viewPageYn === 'N' ? 'overlay' : 'display-hide'}">
              <div class="divider-group">
                <button class="${data.videoFileId ? 'button type-text type-icon' : 'display-hide'}"
                  name="previewBtn" data-id="${data.videoFileId}" data-type="${data.videoFileUploadMethod}"
                  data-path="${data.videoPath}"
                  data-cmstype="${data.cmsType ? data.cmsType : ''}"
                   data-seq="${data.masterSeq}">
                  <svg>
                    <title>미리보기 아이콘</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                  </svg>
                </button>
                <button class="${data.fileYn === 'Y' && data.fileId && data.fileDownloadYn === 'Y' ? 'button type-text type-icon' : 'button type-text type-icon display-hide'}" name="downloadBtn" 
                data-id="${data?.fileId}"
                data-type="${data['fileUploadMethod']}"
                data-path="${data['linkPath']}"
                data-downpath="${data['fileDownPath']}"
                >
                  <svg>
                    <title>다운로드 아이콘</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                  </svg>
                </button>
              </div>
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
        // source-wrap
        const $subject = $('<div class="subject"></div>');
        console.log("교과서", data.mappingSeq);
        if(!_.isNil(data?.mappingSeq)) {
          console.log("교과서", data?.mainTextbookName);

          htmlMainBadges = `
            <div class="badges">
              <span class="badge type-round-box fill-green" title="${data?.mainTextbookName}">${data?.mainTextbookName}</span>
              <span class="desc">${
                !_.isEmpty(data?.mainUnitName) && _.isEmpty(data?.mainTextbookStartPage)
                    ? data?.mainUnitNumberName + '.' + data.mainUnitName 
                    : !_.isEmpty(data?.mainTextbookStartPage) && _.isEmpty(data?.mainUnitName)
                        ? data.mainTextbookStartPage+ '~' + data?.mainTextbookEndPage + 'p  '
                        : !_.isEmpty(data?.mainTextbookStartPage) && !_.isEmpty(data?.mainUnitName) 
                            ? data.mainTextbookStartPage+ '~' + data?.mainTextbookEndPage + 'p  ' + data?.mainUnitNumberName + '.' + data.mainUnitName 
                            : ''}
              </span>
            </div>
          `;
          if(!_.isEmpty(data?.mainTextbookName)) $subject.append(htmlMainBadges);
          htmlSubBadges = `
            <div class="badges">
              <span class="badge type-round-box" title="${data?.subTextbookName}">${data?.subTextbookName}</span>
              <span class="desc">${!_.isEmpty(data?.subTextbookStartPage) ? data.subTextbookStartPage + '~' + data?.subTextbookEndPage : ''}</span>
            </div>
          `;
          if(!_.isEmpty(data?.subTextbookName)) $subject.append(htmlSubBadges);

        }
        const $tag = $('<div class="tags"></div>');
        let htmlTag = '';
        if(!_.isEmpty(data?.tag)) {
          const arrTag = data.tag.split(';');
          arrTag.map((tagData)=> {
            htmlTag = `<span class="badge type-rounded fill-light" title="${tagData}">${tagData}</span>`;
            $tag.append(htmlTag);
          });
        }
        let htmlSource = '';
        if(!_.isEmpty(data?.source)) {
          htmlSource = `<p class="source">출처: ${data.source}</p>`;
        }

        $source.append(screen.v.textbookInfoUseYn === "Y" && !_.isEmpty($subject.text()) ? $subject : '');
        $source.append(!_.isEmpty($tag.text()) ? $tag : '');
        // $source.append(!_.isEmpty(htmlSource) ? htmlSource : '');

        //buttons
        const htmlButtons = `
          <div class="board-buttons">
            <input type="hidden" name="masterSeq" value="${data.masterSeq}" />
            <div class="buttons">

              <!-- !NOTE : 스크랩버튼은 toggle-this 에 active 클래스가 on/off 됩니다.  -->
              <button type="button" name="scrapBtn" class="button type-icon size-sm toggle-primary ${data.scrapYn === 'Y' ? 'active' : ''}${scrapHide}" data-toast="toast-scrap-${data.masterSeq}">
                <svg>
                  <title>아이콘 스크랩</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                </svg>
              </button>
              <button type="button" name="shareBtn" class="button type-icon size-sm${shareHide}">
                <svg>
                  <title>아이콘 공유</title>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                </svg>
              </button>
            </div>

            <button type="button" name="likeBtn" class="like size-sm ${data.likeYn === 'Y' ? 'active' : ''}" data-toast="toast-like-${data.masterSeq}">
              <svg>
                <title>아이콘 좋아요</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-like"></use>
              </svg>
              <span>${data.likeCount}</span>
            </button>
          </div>
        `
        $inner.append(htmlText);
        $inner.append(!_.isEmpty($source.text()) ? $source : '');
        $inner.append(htmlButtons);
        $item.append(screen.v.mainInfo.viewPageYn === "Y" ? htmlImage : htmlImage2);
        $item.append($inner);
        $boardItem.append($item);
      });
    },
    
    /**
     * 스크랩, 좋아요 toggle
     * @param {*} e 
     * @returns 
     */
    toggleScrap: (e)=> {
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
        return;
      }
      
      const type = $(e.currentTarget).attr('name');

      if(type === 'scrapBtn' && $('#boardGrade').val() !== '002') {
        $alert.open('MG00011');
        $(e.currentTarget).removeClass('active');
        return;
      }
      
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
      
      const $count = $(`[name=masterSeq][value=${masterSeq}]`).siblings('button[name=likeBtn]').find('span');
      const originCnt = $count.text();
      console.log("기존좋아요수", originCnt);
      if(likeYn === 'Y') {
        $count.text(parseInt(originCnt) + 1);
        $toast.open(`toast-like-${masterSeq}`, 'MG00055');
      }else {
        $count.text(parseInt(originCnt) - 1);
        $toast.open(`toast-like-${masterSeq}`, 'MG00056');
      }
    },



    // single file 다운로드
    downSingleFile: (e) => {
      const fileId = $(e.currentTarget).data('id');
      const type = $(e.currentTarget).data('type');
      const fileDownPath = $(e.currentTarget).data('downpath');

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

          if(type === "CMS") {
            const options = {
              method: "GET",
              url: "/pages/api/preview/previewDownYn.ax",
              data: { fileId: fileId },
              success: (res) => {
                console.log(res);
                if (res.row.down_yn === 'Y') {

                  let link = document.createElement("a");
                  link.target = "_blank";
                  link.href = fileDownPath;

                  link.click();
                  link.remove();

                } else {
                  $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요.");
                }

              }
            };
            $cmm.ajax(options);
          } else {

            let link = document.createElement("a");
            link.target = "_blank";
            link.href = fileDownPath;

            link.click();
            link.remove();

          }
        }else {
          $alert.open('MG00004');
          return;
        }
      }

    },

    // 파일 미리보기
    previewFile: (e) => {
      const fileId = $(e.currentTarget).data('id');
      let fileType = $(e.currentTarget).data('type');
      const masterSeq = $(e.currentTarget).data('seq');

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
          if (fileType === 'LINK') {
            window.open($(e.currentTarget).data('path'), '_blank');
          } else {
            const options = {
              method: "GET",
              url: "/pages/api/preview/previewServiceYn.ax",
              data: { fileId: fileId },
              success: (res) => {
                console.log(res);
                if (res.row.service_yn === 'Y') {
                  let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&referenceSeq=${masterSeq}&type=TOTALBOARD`;
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

        }else {
          $alert.open('MG00004');
          return;
        }
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
          // 40개 미만인 경우만 즐겨찾기 등록 성공
          if (res.resultMsg === "exceed") {
            $alert.open("MG00012");
            $('#reg-favorite[type=checkbox]').prop("checked", false);

          } else {
            $toast.open("toast-favorite", "MG00038");
            $quick.getFavorite();
          }
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
          $toast.open("toast-favorite", "MG00039");
          $quick.getFavorite();
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
    console.log("필터 리로드 사용여부 ===", screen.v.totalboardFilterReloadYn)
    screen.f.setCombo();
    screen.event();

    // GNB 코드 정보 가져오기
    let categoryCode = $("input[name=gnbCateType]").val() || '';
    if(categoryCode != '' && document.getElementById('cmmBoardGnbList') != null){
      screen.c.getGnbList(categoryCode);
    }
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
