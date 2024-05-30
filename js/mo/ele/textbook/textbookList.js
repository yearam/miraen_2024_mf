$(function () {
    let textbookListScreen = {
        v: {
            textbookListHtml: '',
            gradeCode: "01",
            termCode: "01",
        },

        /**
         * 통신 객체- call
         *
         * @memberOf textbookListScreen
         */
        c: {
            /**
             * 교과서 리스트 조회
             *
             * @memberOf textbookListScreen.c
             */
            getTextbookList: () => {
                const options = {
                    url: '/pages/ele/textbook/textbookList.ax',
                    data: {
                        gradeCode: textbookListScreen.v.gradeCode,
                        termCode: textbookListScreen.v.termCode,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {

                        $('.list-textbook').empty();

                        // 평가자료 탭 구분 FLAG
                        const evaludateDataListYn = $('#evaluateDataListYn').val();

                        $.each(res, function (index, item) {
                            // 메뉴 아래 교과서 리스트 렌더링
                            textbookListScreen.v.textbookListHtml = `
                              <a href="/pages/ele/textbook/textbookDetail.mrn?masterSeq=${item.masterSeq}&gradeCode=${item.gradeCode}&termCode=${item.termCode}&revisionCode=${item.subjectRevisionCode}&tabType=${evaludateDataListYn !== null && evaludateDataListYn !== 'Y' ? 'classTab' : 'referenceTab'}">
                                <span class="badge type-rounded fill-light">${item.subjectRevisionCode}</span>
                                ${item.leadAuthorName != null && item.leadAuthorName != ''
                                ? `<p class="title">${item.textbookName} (${item.leadAuthorName})</p>`
                                : `<p class="title">${item.textbookName}</p>`}
                              </a>
                            `;

                            $('.list-textbook').append(textbookListScreen.v.textbookListHtml);
                        })


                        // 교과서 썸네일 클릭시 교과서 상세페이지로 이동
                        /*$('.thumb').on('click', function(event) {

                            const targetPage = '/pages/ele/textbook/textbookDetail.mrn';
                            let masterSeq = $(this).find('img').data('masterseq');
                            let menuText = textbookListScreen.v.activeMenu;

                            const gradeCode = textbookListScreen.v.gradeCode;
                            const termCode = textbookListScreen.v.termCode;
                            const revisionCode = textbookListScreen.v.subjectRevisionCode
                            let tabType = '';

                            console.log("activeMenu: ", menuText)

                            if (menuText === 'menu7') {
                                tabType = 'referenceTab'
                            } else if (menuText === 'menu0') {
                                tabType = 'classTab'
                            }
                            const queryString = `?masterSeq=${masterSeq}&gradeCode=${gradeCode}&termCode=${termCode}&revisionCode=${revisionCode}&tabType=${tabType}`;

                            window.location.href = targetPage + queryString;
                        })*/

                    }
                };

                $.ajax(options);

            },

            getTextbookListForEleSiteMap: (termCode) => {
                console.log("sitemap termCode:" + termCode);
                if(termCode == '' || termCode == undefined ){
                    termCode = '01'
                }
                let dataObj = {};

                dataObj = {
                    termCode : termCode
                }

                const options = {
                    url: '/pages/api/textbook/eleGnbMenuList.ax',
                    data: dataObj,
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("siteMap 교과서 리스트 : ", res);
                        $('#siteMapList > div > div[id]').each(function() {
                            let liId = this.id.split('|');
                            let matchingData = $.grep(res.rows, function(item) {
                                return liId.includes(item.gradeCode) && item.mainTextbookYn === 'Y';
                            });
                            let newData = $.map(matchingData, function (item) {
                                return `<li><a href="#" class="text-data" data-masterseq="${item.masterSeq}">${item.textbookName}${item.leadAuthorName ? `(${item.leadAuthorName})` : ''}</a></li>`;
                            }).join('');
                            $(this).find('.depth3').empty().append(newData);
                        });

                        $('#siteMapList > div > div[id] a').off().on('click', function (event) {
                            const masterSeq = $(this).data('masterseq');

                            //textbookListScreen.f.showDetailPage(masterSeq);

                            const targetPage = '/pages/ele/textbook/textbookDetail.mrn';
                            let menuText = textbookListScreen.v.activeMenu;

                            const gradeCode = textbookListScreen.v.gradeCode;
                            const termCode = textbookListScreen.v.termCode;
                            const revisionCode = textbookListScreen.v.subjectRevisionCode
                            let tabType = '';

                            //console.log("activeMenu: ", menuText)

                            if (menuText === 'menu7') {
                                tabType = 'referenceTab'
                            } else if (menuText === 'menu0') {
                                tabType = 'classTab'
                            }

                            // 탭 구분 추가
                            const $textbookActivityMobile = $(this).closest('.nav-item').hasClass('textbook-activity-mobile');
                            const $testDataMobile = $(this).closest('.nav-item').hasClass('test-data-mobile');

                            if ($textbookActivityMobile === true) {
                                tabType = 'classTab'
                            } else if ($testDataMobile === true) {
                                tabType = 'referenceTab'
                            }

                            const queryString = `?masterSeq=${masterSeq}&gradeCode=${gradeCode}&termCode=${termCode}&revisionCode=${revisionCode}&tabType=${tabType}`;

                            window.location.href = targetPage + queryString;


                            event.preventDefault();
                        });
                    }
                };
                $.ajax(options);
            }

        },

        f: {
            /**
             * 탭 전환
             * @param {*} e
             */
            changeGradeTab: (e)=> {
                textbookListScreen.v.gradeCode = $(e.currentTarget).data('type');
                textbookListScreen.v.termCode = "01";

                // 학기 탭 초기화
                $('.semester-list nav a').removeClass('active');
                $('.semester-list nav a[data-type="01"]').addClass('active');

                textbookListScreen.c.getTextbookList();
            },

            changeSemesterTab: (e)=> {
                textbookListScreen.v.termCode = $(e.currentTarget).data('type');
                textbookListScreen.c.getTextbookList();
            },
        },

        init: function () {

            textbookListScreen.c.getTextbookList();
            textbookListScreen.event();
        },

        event: function () {

            // 학년 선택
            $('.grade-list nav a').on('click', textbookListScreen.f.changeGradeTab);
            
            // 학기 선택
            $('.semester-list nav a').on('click', textbookListScreen.f.changeSemesterTab);

            // 사이트맵 - 모바일
            $('#mo_siteMapEle').off().on("click", () => {
                textbookListScreen.c.getTextbookListForEleSiteMap();
            })

            $('#gnbTermCode01_001').on("click", () => {
                textbookListScreen.c.getTextbookListForEleSiteMap('01');
                $("#gnbTermCode01_001").parent().addClass("active");
                $("#gnbTermCode01_002").parent().addClass("active");
                $("#gnbTermCode02_001").parent().removeClass("active");
                $("#gnbTermCode02_002").parent().removeClass("active");
            })

            $('#gnbTermCode01_002').on("click", () => {
                textbookListScreen.c.getTextbookListForEleSiteMap('01');
                $("#gnbTermCode01_001").parent().addClass("active");
                $("#gnbTermCode01_002").parent().addClass("active");
                $("#gnbTermCode02_001").parent().removeClass("active");
                $("#gnbTermCode02_002").parent().removeClass("active");
            })

            $('#gnbTermCode02_001').on("click", () => {
                textbookListScreen.c.getTextbookListForEleSiteMap('02');
                $("#gnbTermCode02_001").parent().addClass("active");
                $("#gnbTermCode02_002").parent().addClass("active");
                $("#gnbTermCode01_001").parent().removeClass("active");
                $("#gnbTermCode01_002").parent().removeClass("active");
            })

            $('#gnbTermCode02_002').on("click", () => {
                textbookListScreen.c.getTextbookListForEleSiteMap('02');
                $("#gnbTermCode02_001").parent().addClass("active");
                $("#gnbTermCode02_002").parent().addClass("active");
                $("#gnbTermCode01_001").parent().removeClass("active");
                $("#gnbTermCode01_002").parent().removeClass("active");
            })

            $("#gnbAreaEle > a").each(function() {
                let curUrl = $(this).attr('href').split('/');
                let menuSearch = '';
                if(curUrl.length > 3){
                    menuSearch = curUrl[3] + '/' + curUrl[4];
                }
                if(menuSearch != '') {
                    if (window.location.href.indexOf(menuSearch) > -1) {
                        $(this).addClass('active');
                    } else if (window.location.href.indexOf('bbs') > -1  // 특화자료실 > 특수교육 경우 gnb에 .active 추가
                            && menuSearch === 'board/specializeddata') {
                        $(this).addClass('active');
                    }
                }
            });

            $("#myPageGnbArea > a").each(function() {
                let curUrl = $(this).attr('href').split('/');
                let menuSearch = '';
                if(curUrl.length > 3){
                    menuSearch = curUrl[2] + '/' + curUrl[3] + '/' + curUrl[4];
                }
                if(menuSearch != '') {
                    if (window.location.href.indexOf(menuSearch) > -1) {
                        $(this).addClass('active');
                    }
                }
            });

            $("#cusGnbArea > a").each(function() {
                let curUrl = $(this).attr('href').split('/');
                let menuSearch = '';
                const curUrlLen = curUrl.length;
                // if(curUrl.length > 3){
                if(curUrlLen > 3){
                    // menuSearch = curUrl[2] + '/' + curUrl[3] + '/' + curUrl[4];
                    menuSearch = curUrl[curUrlLen - 3] + '/' + curUrl[curUrlLen - 2] + '/' + curUrl[curUrlLen - 1];
                }

                if(menuSearch != '') {
                    if (window.location.href.indexOf(menuSearch) > -1) {
                        $(this).addClass('active');
                    }
                }
            });

        }
    };
    textbookListScreen.init();
});