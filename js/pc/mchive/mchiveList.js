$(function () {
    let mchiveListScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf mchiveListScreen
         */
        v: {
            //totalContentListHtml: '',
            //changeEducationListHtml: '',
            //textbookListHtml: '',
            //totalboardListHtml: '',

            //subjectRevisionCode: "2015",
            //gradeCode: "01",
            //gradeCodeNoZero: "1",
            //termCode: "01",
            //subjectTypeCode: '', // 선택값: GOV, APPRV, AUTH
            //textbookNameList: [],
            totalContentList: [],
            changeEducationList: [],
            textbookList: [],
            totalboardList: [],
        }, 

        /**
         * 통신 객체- call
         *
         * @memberOf mchiveListScreen
         */
        c: {
            /**
             * 교과서 리스트 조회
             *
             * @memberOf mchiveListScreen.c
             */

            getMchiveList: () => {
                const options = {
                    url: '/api/mchive/getMchiveMainList.ax',
                    data: {
                        //subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                        //gradeCode: textbookListScreen.v.gradeCode,
                       // termCode: textbookListScreen.v.termCode,
                        //subjectTypeCode: textbookListScreen.v.subjectTypeCode,
                        initChk: "Y",	// 사용자 검색값이 없을 때
                        pageLength: 10,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
						console.info(res);
                        console.info("getTotalContentList response: ", res.totalContentList);
                        console.info("textbookList response: ", res.textbookList.rows);
                        console.info("totalboardList response: ", res.totalboardList.rows);

                        mchiveListScreen.v.totalContentList = []; // 초기화
                        mchiveListScreen.v.changeEducationList = []; // 초기화
                        mchiveListScreen.v.textbookList = []; // 초기화
                        mchiveListScreen.v.totalboardList = []; // 초기화
						/*
                        $.each(res, function (index, item) {
                            // 메뉴 아래 교과서 리스트 렌더링
                            mchiveListScreen.v.textbookListHtml = `
                              <a href="#">
                                <div class="thumb">
                                  <img src="/pages/api/file/view/${item.coverImageFileId}" data-masterSeq=${item.masterSeq} alt=${item.textbookName} />
                                </div>
                                <div class="badges">
                                  <span class="badge">${item.subjectRevisionCode}</span>
                                  ${item.subjectTypeCode === "GOV"
                                    ? `<span class="text-data">${item.textbookName}</span>`
                                    : `<span class="text-data">${item.textbookName}(${item.leadAuthorName})</span>`}
                                </div>
                              </a>
                            `;

                            mchiveListScreen.v.gradeCodeNoZero = (mchiveListScreen.v.gradeCode).replace(/^0+/, "");
                            $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} .lnb-contents`).append(mchiveListScreen.v.textbookListHtml);
                            //mchiveListScreen.v.totalContentList.push(item.textbookName);
                        })
						*/

						//mchiveListScreen.v.totalContentList.push(res.totalContentList.rows);
 						mchiveListScreen.v.totalContentList = res.totalContentList.rows;
						mchiveListScreen.v.totalboardList = res.totalboardList.rows;
						 mchiveListScreen.v.changeEducationList = res.changeEducationList.rows;
						//console.info(mchiveListScreen.v.textbookList);

                        // 교과서 썸네일 클릭시 masterSeq 로컬스토리지에 저장
                        /*
                        $('.thumb').on('click', function(event) {


                            let masterSeq = $(this).find('img').data('masterseq');

                            localStorage.setItem('masterSeq', masterSeq);
                            localStorage.setItem('gradeCode', mchiveListScreen.v.gradeCode);
                            localStorage.setItem('termCode', mchiveListScreen.v.termCode);
                            localStorage.setItem('revisionCode', mchiveListScreen.v.subjectRevisionCode);

                            location.reload();
                            // event.stopPropagation();
                        })*/
                        mchiveListScreen.f.setContentsList();


                    }
                };

                $.ajax(options);

            },

            getTextbookSearchFilterList: () => {
                const options = {
                    url: '/api/mchive/getTextbookSearchFilterList.ax',
                    data: {
                        //subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                        //gradeCode: textbookListScreen.v.gradeCode,
                       // termCode: textbookListScreen.v.termCode,
                        //subjectTypeCode: textbookListScreen.v.subjectTypeCode,
                        pageLength: 10,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
						console.info(res);
                        console.info("revisionList response: ", res.revisionList.rows);
                        console.info("schoolLevelList response: ", res.schoolLevelList.rows);

                        mchiveListScreen.v.totalContentList = []; // 초기화
                        mchiveListScreen.v.changeEducationList = []; // 초기화
                        mchiveListScreen.v.textbookList = []; // 초기화
                        mchiveListScreen.v.totalboardList = []; // 초기화

 						mchiveListScreen.v.totalContentList = res.totalContentList.rows;
						mchiveListScreen.v.totalboardList = res.totalboardList.rows;
						 mchiveListScreen.v.changeEducationList = res.changeEducationList.rows;

                        mchiveListScreen.f.setContentsList();


                    }
                };

                $.ajax(options);

            },
        },

        /**
         * 내부 함수
         *
         * @memberOf mchiveListScreen
         */
        f: {
			setContentsList: () => {
                const $content = $('.slides')
                const $content2 = $('.slides2')
                const $content3 = $('.slides3')
                $content.empty();
                $content2.empty();
                $content3.empty();

                mchiveListScreen.v.totalContentList.map((data, k) => {
					let level = "";
					if(data.level == 'ELEMENT'){
						level = '초등';
					}else if(data.level == 'MIDDLE'){
						level = '중학';
					}else if(data.level == 'HIGH'){
						level = '고등';
					}else{
						level = '공통';
					}
					console.info(data.path);
                    let res = `
                        <div class="swiper-wrapper">
                            <div class="item-inner">
                            	<img src="${!(data.path) ? '/assets/images/common/img-no-img.png' : data.path}" alt="" />
                            	<br>
                                <span class="level">
                                	[${level}]
                                </span>
                                <a href="/pages/mchive/contentDetail.mrn?masterSeq=${data.masterSeq}&contentType=${data.contentType}">${data.title}</a>
                            </div>
                        </div>
                    `
                    $content.append(res);
                })

                mchiveListScreen.v.totalboardList.map((data, k) => {
					let level = "";
					if(data.level == 'ELEMENT'){
						level = '초등';
					}else if(data.level == 'MIDDLE'){
						level = '중학';
					}else if(data.level == 'HIGH'){
						level = '고등';
					}else{
						level = '공통';
					}

                    let res = `
                        <div class="swiper-wrapper">
                            <div class="item-inner">
                            	<img src="${!(data.path) ? '/assets/images/common/img-no-img.png' : data.path}" alt="" />
                            	<br>
                                <span class="level">
                                	[${level}]
                                </span>
                                <a href="/pages/mchive/contentDetail.mrn?masterSeq=${data.masterSeq}&contentType=${data.contentType}">${data.title}</a>
                            </div>
                        </div>
                    `
                    $content2.append(res);
                })

                mchiveListScreen.v.changeEducationList.map((data, k) => {
					let level = "";
					if(data.level == 'ELEMENT'){
						level = '초등';
					}else if(data.level == 'MIDDLE'){
						level = '중학';
					}else if(data.level == 'HIGH'){
						level = '고등';
					}else{
						level = '공통';
					}

                    let res = `
                        <div class="swiper-wrapper">
                            <div class="item-inner">
                            	<img src="${!(data.path) ? '/assets/images/common/img-no-img.png' : data.path}" alt="" />
                            	<br>
                                <span class="level">
                                	[${level}]
                                </span>
                                <a href="/pages/mchive/contentDetail.mrn?masterSeq=${data.masterSeq}&contentType=${data.contentType}">${data.title}</a>
                            </div>
                        </div>
                    `
                    $content3.append(res);
                })
            },
            /*
            view: (seq, type) => {
				console.info(seq);
				console.info(type);
			}
			*/
        },

        init: function (event) {
            // 1학년 1학기에 active 클래스 넣어놓기
            /*
            $(".grade-lnb > ul > li:first").addClass("active");

            $(".gnb > ul > li:first").on("click", function(event) {
                if ($(this).hasClass("active")) {
                    if ($(event.target).is('img')) {
                        console.log("img clicked");
                        return;
                    }

                    console.log("Menu 1 is opened!");
                    $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove(); // 초기화
                    mchiveListScreen.c.getTextbookList();
                }
            });
			*/
            //mchiveListScreen.c.getMchiveList();
        },
        event: function () {
            // 학년 클릭시 교과서 목록 새로 가져오기
            /*
            $(".grade-lnb li").on("click", function () {
                console.log("grade clicked!: ", $(this).data("grade"))
                let gradeCode = $(this).data("grade");
                mchiveListScreen.v.gradeCodeNoZero = $(this).data("grade").replace(/^0+/, "");
                mchiveListScreen.v.gradeCode = gradeCode;

                let revisionYearText = $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} span label`).text();
                let revisionYear = revisionYearText.match(/\d+/)[0]
                let revisionInputName = `menu1-revision-${gradeCode}-${revisionYear}`
                console.log("revisionYear", revisionYear);

                mchiveListScreen.v.termCode = '01'; // 학기 1학기로 초기화
                $(`input[id=${revisionInputName}]`).prop('checked', true); // 개정년도 버튼 초기화
                $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} .lnb-header .sort button:first`).addClass("active");
                $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} .lnb-header .sort button:nth-child(2)`).removeClass("active");

                // 교과서 리스트 초기화 후 새로 불러오기
                $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove();
                mchiveListScreen.v.subjectRevisionCode = revisionYear;
                mchiveListScreen.c.getTextbookList();

                $(this).addClass("active");
                $(".grade-lnb li").not(this).removeClass("active");

            })

            // 학기 클릭시 교과서 목록 새로 가져오기
            $(".lnb-header .sort button").on("click", function () {
                let semester = $(this).data("semester");

                mchiveListScreen.v.termCode = semester;
                $(this).addClass("active");
                !$(this).removeClass("active");

                // 초기화
                $(`#menu1-grade-${mchiveListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove();
                mchiveListScreen.c.getTextbookList();

                if($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
            })
            */



        }
    };
   mchiveListScreen.init();
});