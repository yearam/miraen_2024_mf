$(function () {
	let screen = {
		v: {
			masterSeq: '',
      		contentType: '',
      		rowNum: '',
      		pagenm: '',
      		mediaType: '',
      		fileId: '',
      		recentSearchSeq:'',
      		grade:'',
      		depth:'',
      		depthSeq1:'',
      		depthSeq2:'',
      		depthSeq3:'',
      		textMasterSeq:'',
      		unitSeq:'',
      		searchCode:'',
      		keyword:'',
      		themenm:'',
      		revisionCode:'',
      		schoolLevelCode:'',
      		subjecCode:'',
      		html:'',
      		path:'',
      		sortType: '',
      		relate:'',
      		initChk:'',
		},
		c: {
			//북마크 처리
			setBookMarkProc: (grade) => {
				const option = {
					method: "POST",
		          	url : '/pages/api/mchive/insertBookmark.ax',
                  	async: false,
                  	data : {"masterSeq" : screen.v.masterSeq ,
                            "contentType": screen.v.contentType,
                            "mediaType" : screen.v.mediaType,
                            "fileId": screen.v.fileId
                            },
                  success: function(result) {
		           	 console.log(result);
		          } 
		        }; 

		        $cmm.ajax(option);
			},

			// 최근 검색어 리스트
			setRecentSearchedList:() => {
				const option = {
					method: "POST",
		          	url : '/pages/api/mchive/getTenRecentSearchedList.ax',
                  	async: false,
                  	data : { },
                  success: function(result) {
		           	 console.log(result);
		           	 screen.f.getRecentList(result.recentSearchedList);
		            }
	            };

		        $cmm.ajax(option);
			},

			detTenRecent:() => {
				const option = {
					type : 'post',
		            url : '/pages/api/mchive/deleteSearch.ax',
		            data : {"searchSeq" : screen.v.recentSearchSeq},
		            success: function(result) {
						console.log(result);
		           	 	screen.f.getRecentList(result.recentSearchedList);
					}
				};

		        $cmm.ajax(option);
			},
		},
		f: {
			goDetailPage: (grade) => {
				if (!$isLogin) {
	                $alert.open('MG00001');
	                return;
	            }else{
					 // 상세보기 교사권한 추가
					 if(grade != '002') {
						 $alert.open('MG00047');
						 return;
					 } else { 
						 var url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
						 if(screen.v.keyword != null && screen.v.keyword != ''){
							 // window.location.href = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&contentType='+screen.v.contentType+'&rowNum='+screen.v.rowNum+'&pagenm='+screen.v.pagenm;
							 url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&keyword='+screen.v.keyword+'&themeNm='+screen.v.themenm+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&keyword='+screen.v.keyword+'&themeNm='+screen.v.themenm+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm+'&mediaType='+screen.v.mediaType+'&sortType='+screen.v.sortType;
						 	 }
						 }else if(screen.v.depth != null && screen.v.depth != ''){
							 url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&depth='+screen.v.depth+'&schoolLevelCode='+screen.v.schoolLevelCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 if(screen.v.depthSeq1 != null && screen.v.depthSeq1 != ''){
								 url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&depth='+screen.v.depth+'&depthSeq1='+screen.v.depthSeq1+'&schoolLevelCode='+screen.v.schoolLevelCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 }
							 if(screen.v.depthSeq2 != null && screen.v.depthSeq2 != ''){
								 url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&depth='+screen.v.depth+'&depthSeq1='+screen.v.depthSeq1+'&depthSeq2='+screen.v.depthSeq2+'&schoolLevelCode='+screen.v.schoolLevelCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 }
							 if(screen.v.depthSeq3 != null && screen.v.depthSeq3 != ''){
								 url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&depth='+screen.v.depth+'&depthSeq1='+screen.v.depthSeq1+'&depthSeq2='+screen.v.depthSeq2+'&depthSeq3='+screen.v.depthSeq3+'&schoolLevelCode='+screen.v.schoolLevelCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 }
							 
							 if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = url+'&mediaType='+screen.v.mediaType;
						 	 }

							// window.location.href = url;
						 }else if(screen.v.revisionCode != null && screen.v.revisionCode != ''){
							  url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&revisionCode='+screen.v.revisionCode+'&schoolLevelCode='+screen.v.schoolLevelCode+'&subjectCode='+screen.v.subjecCode+'&textMasterSeq='+screen.v.textMasterSeq+'&searchCode='+screen.v.searchCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							  if(screen.v.unitSeq != null && screen.v.unitSeq!=''){
								  url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&revisionCode='+screen.v.revisionCode+'&schoolLevelCode='+screen.v.schoolLevelCode+'&subjectCode='+screen.v.subjecCode+'&textMasterSeq='+screen.v.textMasterSeq+'&unitSeq='+screen.v.unitSeq+'&searchCode='+screen.v.searchCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							  }
							  if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = url+'&mediaType='+screen.v.mediaType;
						 	  }
						 }else if(screen.v.textMasterSeq != null && screen.v.textMasterSeq != ''){
							 url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&textMasterSeq='+screen.v.textMasterSeq+'&searchCode='+screen.v.searchCode+'&schoolLevelCode='+screen.v.schoolLevelCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
						 	 if(screen.v.unitSeq != null && screen.v.unitSeq!=''){
								  url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&textMasterSeq='+screen.v.textMasterSeq+'&unitSeq='+screen.v.unitSeq+'&searchCode='+screen.v.searchCode+'&schoolLevelCode='+screen.v.schoolLevelCode+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 }
							 if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = url+'&mediaType='+screen.v.mediaType;
						 	 }
						 
						 }else if(screen.v.themenm != null && screen.v.themenm != ''){
							  url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&keyword='+screen.v.keyword+'&themeNm='+screen.v.themenm+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
							 // window.location.href = url;
							 if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = url+'&mediaType='+screen.v.mediaType;
						 	 }
						 }else{
							url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
						 }
						 
						 if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = url+'&mediaType='+screen.v.mediaType;
						 }
						 if(screen.v.sortType != null && screen.v.sortType != ''){
							 	url = url+'&sortType='+screen.v.sortType;
						 }
						 if(screen.v.relate != null && screen.v.relate != ''){
							 	url = url+'&sortType='+screen.v.relate;
						 }
						 if(screen.v.initChk != null && screen.v.initChk != ''){
							 	url = url+'&initChk='+screen.v.initChk;
						 }
	
						 window.location.href = url;
					 }
				} 
				
			},
			// 키워드 상세 페이지이동
			goKeywordDetailPage: (grade) => {
				if (!$isLogin) {
	                $alert.open('MG00001');
	                return;
	            }else{
					// 상세보기 교사권한 추가
					if(grade != '002') {
						 $alert.open('MG00047');
						 return;
					 } else {	
						var url = '/pages/mchive/viewDetail.mrn?masterSeq='+screen.v.masterSeq+'&keyword='+encodeURI(screen.v.keyword)+'&contentType='+screen.v.contentType+'&pagenm='+screen.v.pagenm;
						if(screen.v.mediaType != null && screen.v.mediaType != ''){
							 	url = url+'&mediaType='+screen.v.mediaType;
						}
						if(screen.v.sortType != null && screen.v.sortType != ''){
							 	url = url+'&sortType='+screen.v.sortType;
						}
						if(screen.v.initChk != null && screen.v.initChk != ''){
							 	url = url+'&initChk='+screen.v.initChk;
						}
										 
						window.location.href = url;
					 }
					 
				}
			},
			bookMarkClick:(grade)=> {
				console.log(grade);
				if (!$isLogin) {
	                $alert.open('MG00001');
	                $("#bookmark_"+screen.v.masterSeq).prop("checked", false);
	                return;
	            }else{
					// 북마크 교사권한 추가
					if(grade != '002'){
						$alert.open('MG00047');
						$("#bookmark_"+screen.v.masterSeq).prop("checked", false);
						return;
					} else {						
						screen.c.setBookMarkProc();
					}
				}
			},

			getRecentList:(list) => {
				console.log(list.length);
				const liste = $("#tenRecentSearchedList");
				liste.empty();
				if(list.length > 0){

					// <a href="#" class="searchWord" onclick="searchWord('total', 'ALL', '${item.search}')"><strong class="semi" >${item.search}</strong></a>
					$.each(list, function(idx, item) {
						liste.append(`
							<li>
		                      	<a href="/pages/mchive/keyword.mrn?keyword=${encodeURI(item.search)}" class="searchWord"><strong class="semi" >${item.search}</strong></a>
		                      	<span class="search-date">${item.createDate}</span>
		                      	<button type="button" class="button-delete-search" name="delTenRecent" data-recentseq="${item.recentSearchSeq}" >
		                        	<svg>
			                          	<title>삭제</title>
			                          	<use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
		                        	</svg>
		                      	</button>
	                    	</li>
	                    `);
					});
					$(".search-box").addClass("active");
				}else{
					$(".search-box").removeClass("active");
				}
			},

			closeRecentList:() => {
				//if($(".search-box").hasClass("active")){
					$(".search-box").removeClass("active");
				//}
			},
		},
		event:  function () {
			// 검색 클릭시
			$(document).on('click', '[name=inpHeaderKerword]', screen.c.setRecentSearchedList);
			$(document).on('click', '[name=delTenRecent]',function (){
				screen.v.recentSearchSeq = $(this).data('recentseq');
				console.log(screen.v.recentSearchSeq);
				screen.c.detTenRecent();
			});
			$(document).on('click', '[name=tenRecentClose]', screen.f.closeRecentList );
			$(document).on('click', '.container', screen.f.closeRecentList );

			// 상세보기
			$(document).on('click','#viewDetailPage',function (){
				screen.v.masterSeq = $(this).data('masterseq');
				screen.v.contentType = $(this).data('contenttype');
				//screen.v.rowNum = $(this).data('rownum');
				screen.v.pagenm = $(this).data('pagenm');
				screen.v.keyword = $(this).data('keyword');
				screen.v.grade = $(this).data('grade');
				screen.v.depth = $(this).data('depth');
				screen.v.depthSeq1 = $(this).data('depthseq1');
				screen.v.depthSeq2 = $(this).data('depthseq2');
				screen.v.depthSeq3 = $(this).data('depthseq3');
				screen.v.textMasterSeq = $(this).data('textmasterseq');
				screen.v.unitSeq = $(this).data('unitseq');
				screen.v.searchCode = $(this).data('searchcode');
				screen.v.themenm = $(this).data('themenm');
				screen.v.revisionCode = $(this).data('revisioncode');
				screen.v.schoolLevelCode = $(this).data('schoollevel');
				screen.v.subjecCode = $(this).data('subjectcode');
				screen.v.html = $(this).data('html');
				screen.v.path = $(this).data('path');
				screen.v.mediaType = $(this).data('mediatype');
				screen.v.sortType = $(this).data('sorttype');
				screen.v.relate = $(this).data('relate');
				screen.v.initChk =  $(this).data('initchk');
				if(screen.v.html == 'html'){
					
					if (!$isLogin) {
	                	$alert.open('MG00001');
	                	return;
	            	}else{
					 	 // 상세보기 교사권한 추가
						 if(screen.v.grade != '002') {
							 $alert.open('MG00047');
						 }else{
							 window.open(screen.v.path);
						 }
					}
				}else {
					screen.f.goDetailPage(screen.v.grade);
				}
			});

			// 추천 키워드 상세보기
			$(document).on('click','#keywordDetailPage',function (){
				screen.v.masterSeq = $(this).data('masterseq');
				screen.v.keyword = $(this).data('keyword');
				screen.v.contentType = $(this).data('contenttype');
				//screen.v.rowNum = $(this).data('rownum');
				screen.v.pagenm = $(this).data('pagenm');
				screen.v.grade = $(this).data('grade');
				screen.v.html = $(this).data('html');
				screen.v.path = $(this).data('path');
				screen.v.mediaType = $(this).data('mediatype');
				screen.v.sortType = $(this).data('sorttype');
				screen.v.initChk =  $(this).data('initchk');
				if(screen.v.html == 'html'){
					if (!$isLogin) {
	                	$alert.open('MG00001');
	                	return;
	            	}else{
					 	 // 상세보기 교사권한 추가
						 if(screen.v.grade != '002') {
							 $alert.open('MG00047');
						 }else{
							 window.open(screen.v.path);
						 }
					}
				}else {
					screen.f.goKeywordDetailPage(screen.v.grade);
				}
			});
			
			$(document).on('click','#mainTotalDetailPage',function (){
				screen.v.masterSeq = $(this).data('masterseq');
				screen.v.keyword = $(this).data('keyword');
				screen.v.contentType = $(this).data('contenttype');
				//screen.v.rowNum = $(this).data('rownum');
				screen.v.pagenm = $(this).data('pagenm');
				screen.v.html = $(this).data('html');
				screen.v.path = $(this).data('path');
				screen.v.initChk =  $(this).data('initchk');
				if(screen.v.html == 'html'){
					if (!$isLogin) {
	                	$alert.open('MG00001');
	                	return;
	            	}else{
					 	 // 상세보기 교사권한 추가
						 if(screen.v.grade != '002') {
							 $alert.open('MG00047');
						 }else{
							 window.open(screen.v.path);
						 }
					}
				}else {
					screen.f.goKeywordDetailPage();
				}
			});

			// 북마크 처리
			$(document).on('click',"input[id^='bookmark_']",function (){
				screen.v.masterSeq = $(this).data('masterseq');
				screen.v.contentType = $(this).data('contenttype');
				screen.v.mediaType = $(this).data('mediatype');
				screen.v.fileId = $(this).data('fileid');
				screen.v.grade = $(this).data('grade');

				screen.f.bookMarkClick(screen.v.grade);
			});

			// 즐겨찾기
			$('#addFavorites').css("cursor", "pointer");
			$(document).on('click', '#addFavorites', function (e) {
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

			//
			$('#mteacherDirect').css("cursor", "pointer");
			$(document).on('click', '#mteacherDirect', function (e) {
				$('#mteacher-shortcut').show();
			});
			//$('#mteacher-shortcut').find('[data-id=close]').on('click', () => {
			$(document).on('click', '#mteacherDirect [data-id=close]', function (e) {
				$('#mteacher-shortcut').hide();
			});
		},
		init: function () {
	      screen.event();
	    },
	};
	screen.init();
});

// List Unit 관련 함수 : 내자료실과 연관검색어는 unitall을 사용하지 않음

// li 로 이루어진 unit
	// menukn : 디테일에서 목록으로 넘어올때 사용
	// keyword : 키워드 검색 시 사용
	// datakn : level / code 두개로 구분, 초중고 구분할 때 level로 구분하는지 다른 변수로 구분하는지 확인하는데 사용
function renderListUnitAll (item, menukn, keyword, col, datakn, grade, param) {
	var seconds = item.videoPlayTime;
	var min = parseInt(seconds/60);
	var sec = seconds%60;
	if (min.toString().length==1) min = "0" + min;
	if (sec.toString().length==1) sec = "0" + sec;
	item._min = min; item._sec = sec;
	var textMasterSeq= '';
	var unitSeq= '';
	var searchCode = '';
	var themeName = '';
	var revisionCode = '';
	var schoolLevelCode = '';
	var subjectCode = '';
	var sortType = '';
	var mediaType = '';
	var keyword = '';
	var initChk = '';
	console.log(param);
	if(param != null){
		
		if(param.textMasterSeq != null && param.textMasterSeq !=''){
			textMasterSeq = param.textMasterSeq;
		}
		if(param.keyword != null && param.keyword !=''){
			keyword = param.keyword.replaceAll('|', ',');
		}
		if(param.unitSeq != null && param.unitSeq !=''){
			unitSeq = param.unitSeq;
		}
		if(param.code != null && param.code !=''){
			searchCode = param.code;
		}
		if(param.themeName != null && param.themeName !=''){
			themeName = param.themeName;
		}
		if(param.themeNm != null && param.themeNm !=''){
			themeName = param.themeNm;
		}
		if(param.revisionCode != null && param.revisionCode !=''){
			keyword = '';
			
			revisionCode = param.revisionCode;
		}
		if(param.schoolLevelCode != null && param.schoolLevelCode !=''){
			schoolLevelCode = param.schoolLevelCode;
		}
		if(param.subjectCode != null && param.subjectCode !=''){
			subjectCode = param.subjectCode;
		}
		
		if(param.sortType != null && param.sortType !=''){
			sortType = param.sortType;
		}
		if(param.mediaType != null && param.mediaType !=''){
			mediaType = param.mediaType;
		}
		if(param.schoolLevelCode != null && param.schoolLevelCode !=''){
			schoolLevelCode = param.schoolLevelCode;
		}
		if(param.initChk != null && param.initChk !=''){
			initChk = param.initChk;
		}
	}
	
	let tmpl = "";
	if(menukn == 'rec') {
		tmpl += `
		<div class="item ${renderListUnitNoImg(item)}">
			<div class="image-wrap">
				<!-- Cover -->
				${renderListUnitCover(item)}

				<!-- Util -->
				${renderListUnitUtil(item, grade)}

				<!-- Media Info -->
				${renderListUnitMediaInfo(item)}

				<!-- Group Info -->
				${renderListUnitGroupInfo(item,menukn)}
			</div>

			<!-- Title / link -->				
			<div class="inner-wrap">
				<a href="javascript:void(0);" id="keywordDetailPage" data-masterseq="${item.masterSeq}" data-contenttype="${item.contentType}" data-sorttype="${sortType}" data-mediatype="${mediaType}"
						data-pagenm="${menukn}" data-keyword="${keyword}" data-grade="${grade}" data-html="${item.html}" data-path="${item.filePath}" data-initchk="${initChk}">
					${datakn == "level" ? renderListUnitTitle(item.level,item.title) : ""}
					${datakn == "code" ? renderListUnitTitle(item.subjectLevelCode,item.referenceName) : ""}
				</a>
			</div>
		</div>`
		;
	} else {
		tmpl += `
		<div class="item ${renderListUnitNoImg(item)}">
			<div class="image-wrap">
				<!-- Cover -->
				${renderListUnitCover(item)}

				<!-- Util -->
				${renderListUnitUtil(item, grade)}

				<!-- Media Info -->
				${renderListUnitMediaInfo(item)}

				<!-- Group Info -->
				${renderListUnitGroupInfo(item,menukn)}
			</div>

			<!-- Title / link -->				
			<div class="inner-wrap">
				<a href="javascript:void(0);" id="viewDetailPage" data-masterseq="${item.masterSeq}" data-contenttype="${item.contentType}"
						data-pagenm="${menukn}" data-keyword="${keyword}" data-grade="${grade}" data-col="${col}"  data-mediatype="${mediaType}" data-sorttype="${sortType}" data-initchk="${initChk}"
						data-col="${col}" data-textMasterSeq="${textMasterSeq}" data-unitSeq="${unitSeq}" data-searchCode="${searchCode}" data-themenm="${themeName}" data-revisionCode="${revisionCode}" data-schoolLevel="${schoolLevelCode}" data-subjectCode="${subjectCode}" data-html="${item.html}" data-path="${item.filePath}">
					${datakn == "level" ? renderListUnitTitle(item.level,item.title) : ""}
					${datakn == "code" ? renderListUnitTitle(item.subjectLevelCode,item.referenceName) : ""}
				</a>
			</div>
		</div>`
		;
	}
	
	
	return tmpl;
}

// noimg class
function renderListUnitNoImg(item) {
	console.log(item.mediaType)
	if(item.mediaType == "IMAGE") {
		return "no-image";
	} else if(item.mediaType == "VIDEO") {
		return "no-video";
	} else if(item.mediaType == "AUDIO") {
		return "no-sound";
	}
	return "";
}

// 썸네일
function renderListUnitCover(item) {
	let tmpl = "";
	if("DIGITAL,AUDIO,VIDEO,".indexOf(item.mediaType) >  -1 || item.coverPath.indexOf("api-cms.mirae-n") > -1) {
		if(item.coverPath != '-' && item.coverPath.indexOf("params=-") == -1) {
			tmpl += `<img src='${item.coverPath}' />`;
		}
	} else if(item.mediaType == "IMAGE" && item.thumbnailFileId != '-' && item.thumbnailFileId != '') {
		tmpl += `<img src='/pages/api/file/view/${item.thumbnailFileId}' onerror='onErrorFn(this)'/>`;
	}
	return tmpl;
}

// util bookmark
function renderListUnitUtil(item, grade) {
	let tmpl = "";
	if(item.watched > 0) {
		tmpl += `
		<i class="icon size-md">
			<img src="/assets/images/common/icon-saw-post.svg" alt="이미 본 컨텐츠 아이콘">
		</i>
		`; 
	}
 
	tmpl += `
		<span class="ox ox-bookmark">
	  		<input type="checkbox" name="bookmark" ${item.bookmark > 0 ? 'checked' : ''} id="bookmark_${item.masterSeq}")" data-grade="${grade}"
	  			data-masterseq="${item.masterSeq}" data-contenttype="${item.contentType}" data-fileid="${item.fileId}" data-mediatype="${item.mediaType}" />
			<label for="bookmark_${item.masterSeq}"></label>
		</span>
	`;
	return tmpl;
}

// media info
function renderListUnitMediaInfo (item) {
	let tmpl = "";
	if (item.mediaType == "DIGITAL") {
		tmpl += `
			<div class="info-media">
				<img src="/assets/images/common/icon-union.svg" alt="union 아이콘" />
				<span class="time">실감형</span>
			</div>
		`;
	}
	if (item.mediaType == "AUDIO") {
		tmpl += `
			<div class="info-media">
				<img src="/assets/images/common/icon-music.svg" alt="music 아이콘" />
				${item.videoPlayTime != '-' ? '<span class="time" rev="${item.videoPlayTime}">'+item._min+':'+item._sec+'</span>' : ''}
			</div>
		`;
	}
	if (item.mediaType == "VIDEO") {
		tmpl += `
			<div class="info-media">
				<img src="/assets/images/common/icon-youtube.svg" alt="youtube 아이콘" />
				${item.videoPlayTime != '-' ? '<span class="time" rev="${item.videoPlayTime}">'+item._min+':'+item._sec+'</span>' : ''}
			</div>
		`;
	}
	if (item.mediaType == "IMAGE") {
		tmpl += `
			<div class="info-media">
				<img src="/assets/images/common/icon-img.svg" alt="img 아이콘" />
			</div>
		`;
	}
	return tmpl;
}

// Group Info
function renderListUnitGroupInfo (item, menukn) {
	let tmpl = `
		<div class="overlay">
			<ul class="divider-group type-brace">
				${item.rootTitle != '-' ? '<li>'+item.rootTitle+'</li>' : ''}
				${item.topTitle != '-' ? '<li>'+item.topTitle+'</li>' : ''}
				${menukn != 'board' && menukn != 'edu'
					&& item.middleUnitSeq != '-' ? '<li>'+item.middleUnitSeq+'</li>' : ''}
				${item.parentTitle != '-' ? '<li>'+item.parentTitle+'</li>' : ''}
				${(menukn == 'board' || menukn == 'edu')
					&& item.tabTitle != '-' ? '<li>'+item.tabTitle+'</li>' : ''}
			</ul>
		</div>
	`;
	return tmpl;
}

// title 공통
function renderListUnitTitle(level,title) {
	let tmpl = '<p class="title">';
		if(level =='ELEMENT'){
			tmpl += '<span class="grades text-elementary">[초등]</span>';
		} else if(level =='MIDDLE'){
			tmpl += '<span class="grades text-middle">[중학]</span>';
		} else if(level =='HIGH'){
			tmpl += '<span class="grades text-high">[고등]</span>';
		} else if(level =='ALL'){
			tmpl += '<span class="grades text-all-grade">[공통]</span>]';
		}
		tmpl += '<span>'+title+'</span>';
	tmpl += '</p>';
	return tmpl;
}
