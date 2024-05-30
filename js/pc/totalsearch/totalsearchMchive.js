$(function () {

  let mScreen = {
    v: {
      msearch: new Totalsearch(),
      activeTab1Id: $('.tab[name=mainTab]').find('.active a').attr('href'),
      activeTab2Id: $('.tab[name=subTab]').find('.active a').attr('href'),
      activeTab2Name: '',
      pagingNow: 0,
      param: {
        pageStart: 0,          // 현재 페이지
        resultCount: 20,  // 페이지 당 20개
        siteType: 'ele',     
        myYn: 'n',   
        collection: "mchive",  
      },
    },

    c: {
    },

    f: {

      //헤더
      getHeader: (tabMenuName, totalCnt) => {
        const header = `
         <div class="inner-header is-extra">
           <h3 name="tabMenuName">${tabMenuName}<span class="text-primary" name="tabMenuTotalCnt">(${Number(totalCnt).toLocaleString()})</span></h3>
         </div>     
        `
        return header;
      },
      // 통합검색 API 요청 후 리스트 아이템 바인딩
      setMchiveDataList: (response) => {
        const { totalCount, searchResult } = response.res.row
        // 갯수 제외한 이름 추출
        const subTabName = mScreen.v.activeTab2Name?.match(/^(.*?)(?=\()/);
        //헤더
        const resultHeader = mScreen.f.getHeader(subTabName[1], totalCount);
        //리스트 목록
        const dataList = searchResult[mScreen.v.selectedTabCollection]?.documentList;

        let resultList = '';
        let resultItems = '';

        resultItems += '<div class="result-items type-gallery">';
        dataList?.map((data) => {
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
			}
			else if(data.document.mediaType == 'AUDIO'){
				resultItems += '<img src="/assets/images/common/icon-music.svg" alt="music 아이콘" />';
				if(null != data.document.videoPlayTime && '' != data.document.videoPlayTime) {
					resultItems += '<span class="time">'+min + ':' + sec+'</span>';
				}
				
	        }
			else if(data.document.mediaType == 'VIDEO'){
				resultItems += '<img src="/assets/images/common/icon-youtube.svg" alt="youtube 아이콘" />';
				if(null != data.document.videoPlayTime && '' != data.document.videoPlayTime) {
					resultItems += '<span class="time">'+min + ':' + sec+'</span>';
				}
	        }
			else if(data.document.mediaType == 'IMAGE'){
				resultItems += '<img src="/assets/images/common/icon-img.svg" alt="img 아이콘" />';
	        }
	        resultItems += '</div>';
	        resultItems += '</div>';
	        resultItems += '<div class="text-wrap">';
	        resultItems += '<a href="javascript:void(0);" class="title" name="title" data-masterseq="'+data.document.masterSeq+'" data-contenttype="'+data.document.categoryType+'">'+data.document.title+'</a>';
	        resultItems += '</div>';
	        resultItems += '</div>';
        })
        resultItems += '</div>'
		if (totalCount > 20) {
          resultItems += '<div class="pagination"></div>'
        }
        resultList += resultHeader;
        resultList += resultItems;
        //리스트 html 붙이기
        mScreen.v.msearch.appendResult(mScreen.v.activeTab2Id, resultList);

		//페이징
        if (totalCount > 20) {
            $paging.bindTotalboardPaging(response.res);
        }
      },
	   
      changeSubTab: async (e) => {
        // 통합게시판 하위 탭 이동 시
        const subTabId = $(e.currentTarget).attr('href');
        mScreen.v.activeTab2Id = subTabId;

        const subTabName = $(e.currentTarget).text();
        mScreen.v.activeTab2Name = subTabName;

        const collection = $(e.currentTarget).data('collection');
        mScreen.v.selectedTabCollection = collection;
        mScreen.v.param.collection = collection;

        mScreen.v.pagingNow = 0;
        mScreen.v.param.pageStart = 0;

        // API 요청
        const response = await mScreen.v.msearch.getTotalsearchResultAsync(mScreen.v.param);

        if (response) {
          // 결과 리스트 화면 그리기
          mScreen.f.setMchiveDataList(response);
          $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', mScreen.f.changePaging);
          mScreen.f.addPageEventsForMchive(document);
        }

      },

      // 페이지 이동
      changePaging: async (e) => {
        const pagingNow = e.currentTarget.value;

        mScreen.v.pagingNow = Number(pagingNow);
        mScreen.v.param.pageStart = Number(pagingNow);
        // [API] 통합검색 API 요청
        const response = await mScreen.v.msearch.getTotalsearchResultAsync(mScreen.v.param);
        if (response) {
          // 결과 리스트 화면 그리기
          mScreen.f.setMchiveDataList(response);
          mScreen.f.addPageEventsForMchive(document); 
        }
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
	  
      addPageEventsForMchive: (parentNode) => {
        // 새창열기
        $(parentNode).off('click', 'a[name=title]', function (e) {
        	mScreen.f.moveNewDetail(e);
        })
      },
   

      setParam: (key, val) => {
        return mScreen.v.param[key] = val;
      },

  

    },

    event: function () {
      // 초중고 메인 탭 이동
      $('.tab[name=mainTab] li a').on('click', mScreen.f.changeMainTab);

      // 학교급 밑 탭 이동
      $('.tab[name=subTab] li a[data-boardtype=mchive]').on('click', mScreen.f.changeSubTab);

      // 페이징
     // $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', mScreen.f.changePaging);

    },

    init: function () {
      mScreen.event();
    },
  };
  mScreen.init();
});

function renderListUnitNoImg(item) {
	if(item.mediaType == "IMAGE") {
		return "no-image";
	} else if(item.mediaType == "VIDEO") {
		return "no-video";
	} else if(item.mediaType == "AUDIO") {
		return "no-sound";
	}
	return "";
}