$(function () {
    let textbookListScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf textbookListScreen
         */
        v: {
            textbookListHtml: '',
            subjectRevisionCode: "2015",
            subjectCode: '0105',
            subjectId: 'subject01',
            gradeCode: "01",
            gradeCodeNoZero: "1",
            subjectTypeCode: '', // 선택값: GOV, APPRV, AUTH
            sortCode: ''
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

            getTextbookList0314: (data) => {
                const options = {
                    url: '/pages/api/textbook/midGnbMenuListNew.ax',
                    data: {
                        sortCode: "MIDDLE-" + textbookListScreen.v.sortCode,
                        subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookList response: ", res);

                        const subjectId = textbookListScreen.v.subjectId;
                        const revisionCode = textbookListScreen.v.subjectRevisionCode;

                        // subjectId를 가진 요소 내부에서 lnb-inner 클래스를 가진 요소 찾기
                        let $lnbInner = $("header[school-grade='MIDDLE'] #" + subjectId + " .lnb");

                        // 24.05.02 진로/정보/특수 GNB 하단에 특수교육 추가.
                        let extraRows = [];
                        if(textbookListScreen.v.sortCode == '008' && revisionCode == '2015'){
                            extraRows = [{name: '특수교육 (2022개정)', pageUrl: '/pages/mid/bbs/list.mrn/TBM-ltxx9qzg-2r8iu3k56w' }];
                        }

                        let lnbInnerHtml = `
                              <div class="lnb-header">
                                <div class="buttons type-rounded">
                                  <span>
                                    <input type="radio" name="${subjectId}-revision-01" id="${subjectId}-revision-01-2015" ${revisionCode === "2015" ? 'checked' : ''} />
                                    <label for="${subjectId}-revision-01-2015">2015 개정</label>
                                  </span>
                                  <!-- <span>
                                    <input type="radio" name="${subjectId}-revision-01" id="${subjectId}-revision-01-2022" data-revision="2022" ${revisionCode === "2022" ? 'checked' : ''}  >
                                    <label for="${subjectId}-revision-01-2022">2022 개정</label>
                                  </span> -->
                                </div>
                              </div>
                              <div class="lnb-contents">
                              ${res.rows.map(function (item, index) {
                                    return `<a href="#" class="text-data textbook" data-masterseq="${item.masterSeq}">${item.textbookName}${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</a>`;
                                }).join('')}
                              ${extraRows.map(function(item, index){
                                    return `<a href="${item.pageUrl}" target="_blank" class="text-data" >${item.name}</a>`;
                                }).join('')}
                              </div>
                        `

                        // 찾은 lnb-inner의 내용 변경
                        $lnbInner.html(lnbInnerHtml);

                        // 개정년도 변경 이벤트
                        $('input[id^="subject"]').on('click', function () {
                            // 클릭한 input 요소의 id 값 가져옴
                            let id = $(this).attr('id');

                            // subjectRevisionCode 값 추출
                            let revisionCode = id.split('-revision-')[1];
                            revisionCode = revisionCode.split('-')[1];

                            textbookListScreen.f.setRevisionYear(revisionCode);
                        });

                        $('.lnb-contents a.textbook').on('click', function (event) {
                            const masterSeq = $(this).data('masterseq');

                            textbookListScreen.f.showDetailPage(masterSeq);

                            event.preventDefault();
                        });

                        // ui.js가 안먹어서 임시로 넣어둠
                        $('.close-button').click(function (e) {
                            $(this).parents('li').removeClass('active');
                            $(this).closest('.site-map').find('.icon-button').removeClass('active');
                            $('html').removeClass('header-overlay');
                        });

                    }
                };

                $.ajax(options);
            },

            getTextbookList: (data) => {
                const options = {
                    url: '/pages/api/textbook/midGnbMenuList.ax',
                    data: {
                        subjectCode: textbookListScreen.v.subjectCode,
                        subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookList response: ", res);

                        const subjectId = textbookListScreen.v.subjectId;
                        const revisionCode = textbookListScreen.v.subjectRevisionCode;

                        // subjectId를 가진 요소 내부에서 lnb-inner 클래스를 가진 요소 찾기
                        let $lnbInner = $("header[school-grade='MIDDLE'] #" + subjectId + " .lnb-inner");

                        // 24.05.02 진로/정보/특수 GNB 하단에 특수교육 추가.
                        let extraRows = [];
                        if(textbookListScreen.v.sortCode == '008' && revisionCode == '2015'){
                            extraRows = [{name: '특수교육 (2022개정)', pageUrl: '/pages/mid/bbs/list.mrn/TBM-ltxx9qzg-2r8iu3k56w' }];
                        }

                        let lnbInnerHtml = `
                            <div class="lnb type-text-box">
                              <div class="lnb-header">
                                <div class="buttons type-rounded">
                                  <span>
                                    <input type="radio" name="${subjectId}-revision-01" id="${subjectId}-revision-01-2015" ${revisionCode === "2015" ? 'checked' : ''} />
                                    <label for="${subjectId}-revision-01-2015">2015 개정</label>
                                  </span>
                                  <!-- <span>
                                    <input type="radio" name="${subjectId}-revision-01" id="${subjectId}-revision-01-2022" data-revision="2022" ${revisionCode === "2022" ? 'checked' : ''}  >
                                    <label for="${subjectId}-revision-01-2022">2022 개정</label>
                                  </span> -->
                                </div>
                              </div>
                              <div class="lnb-contents">
                              ${res.rows.map(function (item, index) {
                                    return `<a href="#" class="text-data textbook" data-masterseq="${item.masterSeq}">${item.textbookName}${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</a>`;
                                }).join('')}
                              ${extraRows.map(function(item, index){
                                    return `<a href="${item.pageUrl}" target="_blank" class="text-data" >${item.name}</a>`;
                                }).join('')}
                              </div>
                            </div>
                            <div class="banners">
                                <a href="https://g.m-teacher.co.kr/pages/common/customer/notice.mrn/2502" target="_blank">
                                    <div class="banner-inner">
                                    <h2> 2024년 신학기, 새로운 엠티처를 만나세요! </h2>
                                    <p className="desc">원하는 자료를 빠르게 찾는 교과서 자료실부터, 수업을 분석하고 리포팅하는 AI 클래스까지. 더욱 편리하고 알찬 수업을 위해 엠티처가 새롭게 태어납니다.</p>
                                    <button type="button" className="banner-button">자세히보기</button>
                                    </div>
                                    <img src="/assets/images/common/img-open-banner.png" alt="GNB 배너" />
                                </a>
                            </div>
                            <button type="button" class="close-button">닫기</button>
                        `

                        // 찾은 lnb-inner의 내용 변경
                        $lnbInner.html(lnbInnerHtml);

                        // 개정년도 변경 이벤트
                        $('input[id^="subject"]').on('click', function () {
                            // 클릭한 input 요소의 id 값 가져옴
                            let id = $(this).attr('id');

                            // subjectRevisionCode 값 추출
                            let revisionCode = id.split('-revision-')[1];
                            revisionCode = revisionCode.split('-')[1];

                            textbookListScreen.f.setRevisionYear(revisionCode);
                        });

                        $('.lnb-contents a.textbook').on('click', function (event) {
                            const masterSeq = $(this).data('masterseq');

                            textbookListScreen.f.showDetailPage(masterSeq);

                            event.preventDefault();
                        });

                        // ui.js가 안먹어서 임시로 넣어둠
                        $('.close-button').click(function (e) {
                            $(this).parents('li').removeClass('active');
                            $(this).closest('.site-map').find('.icon-button').removeClass('active');
                            $('html').removeClass('header-overlay');
                        });

                    }
                };

                $.ajax(options);
            },

            getGnbBanner: (menuCode) => {
                const options = {
                    url: '/pages/mid/gnbBanner.ax',
                    data: {
                        bannerLocation: 'MIDDLE-' + textbookListScreen.v.sortCode,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("banner response: ", res);
                        console.log(res.rows[0].pcImageFileId)
                        if (res.rows.length > 0) {
                            $('.gnb li[data-sort=' + menuCode + '] .banners a').attr('href', res.rows[0].pcLink);
                            $('.gnb li[data-sort=' + menuCode + '] .banners a img').attr('src', res.rows[0].pcImage);
                        }
                    }
                };

                $.ajax(options);
            },

            /**
             * 즐겨찾기 교과서 조회
             *
             * @memberOf textbookListScreen.c
             */

            getMyFavoriteTextbookList: (data) => {
                const options = {
                    url: '/pages/api/textbook/myFavoriteTextbookList.ax',
                    data: {
                        favoriteType: 'MRN',
                        subjectLevelCode: 'MIDDLE',
                    },
                    method: 'GET',
                    async: false,
                    success: function (res) {
                        console.log("getMyFavoriteTextbookList response: ", res);

                        textbookListScreen.f.setMyFavoriteList(res.rows);
                    }
                }

                $.ajax(options);
            },

            updateFavorite: (masterSeq) => {
                let dataObj = {};

                // 즐겨찾기 해제 type을 delete로 사용
                dataObj = {
                    favoriteType: "MRN",
                    referenceSeq: masterSeq,
                }


                const options = {
                    url: '/pages/api/mypage/updateFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function (res) {
                        console.log(res);
                        personalGnbScreen.c.getPersonalGnbList();
                        textbookListScreen.c.getMyFavoriteTextbookList();
                    },
                };

                $.ajax(options);
            },

            getTextbookListForMidSiteMap: (data) => {
                const options = {
                    url: '/pages/api/textbook/midGnbMenuListNew.ax',
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        // console.log("siteMap 교과서 리스트 : ", res);
                        $('#siteMapList > li[id]').each(function() {
                            let liId = this.id.split('|');
                            let matchingData = $.grep(res.rows, function(item) {
                                return liId.includes(item.subjectCode);
                            });

                            let newData = $.map(matchingData, function (item) {
                                return `<a href="#" class="text-data textbook" data-masterseq="${item.masterSeq}">${item.textbookName}${item.leadAuthorName ? `(${item.leadAuthorName})` : ''}</a>`;
                            }).join('');

                            // 24.05.02 진로/정보/특수 GNB 하단에 특수교육 추가.
                            if(this.id == 'CA|IN|EC'){
                                newData += `<a href="/pages/mid/bbs/list.mrn/TBM-ltxx9qzg-2r8iu3k56w" class="text-data" target="_blank">특수교육 (2022개정)</a>`;
                            }
                            $(this).find('.depth-2').empty().append(newData);
                        });

                        $('#siteMapList li[id] a.textbook').off().on('click', function (event) {
                            const masterSeq = $(this).data('masterseq');

                            textbookListScreen.f.showDetailPage(masterSeq);

                            event.preventDefault();
                        });
                    }
                };
                $.ajax(options);
            }


        },

        /**
         * 내부 함수
         *
         * @memberOf textbookListScreen
         */
        f: {
            setRevisionYear: function (revisionCode) {
                textbookListScreen.v.subjectRevisionCode = revisionCode;

                console.log("subjectRevisionCode:", textbookListScreen.v.subjectRevisionCode);

                // 상단메뉴 교과서 목록 초기화
                $(this).closest('header[school-grade="MIDDLE"] .lnb-inner').find('.lnb-contents').remove();
                textbookListScreen.c.getTextbookList0314();
            },

            // 로컬스토리지에 클릭한 교과서 정보 저장
            saveToLocalStorage: function (masterSeq) {

                localStorage.setItem('masterSeq', masterSeq);
                localStorage.setItem('revisionCode', textbookListScreen.v.subjectRevisionCode);

                location.reload();
            },

            showDetailPage: function (masterSeq) {
                // textbookDetail에서 호출할 때는 textbookDetail.mrn로 이동, 아니면 textbook/textbookDetail.mrn로 이동
                const currentPath = window.location.pathname;
                const isCurrentPathDetailPage = currentPath.includes('/textbook/textbookDetail.mrn');

                // 페이지 경로와 쿼리스트링을 조합하여 URL 생성
                let targetPage = 'textbook/textbookDetail.mrn'; // 대상 페이지
                const revisionCode = textbookListScreen.v.subjectRevisionCode;
                let queryString = `?masterSeq=${masterSeq}&revisionCode=${revisionCode}`; // 쿼리스트링

                if (!isCurrentPathDetailPage) {
                    targetPage = 'textbook/textbookDetail.mrn'
                }

                // 메인메뉴에서 진입 내용 저장
                localStorage.setItem('source', 'mainMenu');

                const protocol = location.protocol;
                const host = location.host;
                const pathNameSplit = currentPath.split("/");
                const textbookHref = `${protocol}//${host}/${pathNameSplit[1]}/${pathNameSplit[2]}/${targetPage + queryString}`

                // window.location.href에 URL 설정
                // window.location.href = targetPage + queryString;
                window.location.href = textbookHref;
            },

            // data-url에서 subjectCode= 이하의 값을 가져오기 위한 함수
            getSubjectCodeFromUrl: function (url) {
                // URL에서 쿼리스트링을 추출
                let queryString = url.split('?')[1];

                // 쿼리스트링을 &를 기준으로 분리하여 배열로 만듦
                let queryParams = queryString.split('&');

                // subjectCode를 찾기
                for (let i = 0; i < queryParams.length; i++) {
                    let param = queryParams[i];
                    if (param.indexOf('subjectCode=') === 0) {
                        // subjectCode= 다음의 값을 반환
                        return param.split('=')[1];
                    }
                }

                // subjectCode가 없을 경우
                return null;
            },

            setMyFavoriteList: function (list) {
                $('header[school-grade="MIDDLE"] .mybook .mybook-inner ul').html('') // 즐겨찾기 목록 초기화

                $.each(list, function(index, item) {
                  let htmlElement = `
                    <li class="alert-button">
                        <a href="" data-path="${item.favoriteUrl}">${item.textbookName} ${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</a>
                        <button type="button" data-masterseq="${item.masterSeq}" data-btn-type="delete" class="icon-button" title="삭제">
                          <svg>
                            <title>아이콘 설정하기</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
                          </svg>
                        </button>
                    </li>
                  `
                    $('header[school-grade="MIDDLE"] .mybook .mybook-inner ul').append(htmlElement);
                })

                // 즐겨찾기한 교과서 페이지 현재창 이동
                $('.mybook .mybook-inner li a').off('click').on('click', function(e) {
                    e.preventDefault();

                    const path = $(this).data('path');

                    console.log(path);

                    if (!path) {
                        console.log("path 잘못됨");
                    } else {
                        window.open(path, "_self");
                    }
                })

                // 즐겨찾기 삭제
                $('.mybook .mybook-inner button[data-btn-type="delete"]').on('click', function(e) {
                    e.preventDefault();

                    const masterSeq = $(this).data('masterseq');
                    textbookListScreen.c.updateFavorite(masterSeq);
                })

                // '내 교과서' 텍스트 옆 svg에 마우스 포인터 기본으로 수정
                $('.mybook .mybook-inner .button').css('cursor', 'default');

            }

        },

        init: function (event) {

            // .lnb-wrap에서 data-url을 가져오고, subjectCode 추출
            $(document).ready(function() {
                let targetElement = $('header[school-grade="MIDDLE"] .gnb > ul')[0];

                if (targetElement) {
                    // Mutation Observer 생성 및 설정
                    let observer = new MutationObserver(function(mutationsList) {
                        for (let mutation of mutationsList) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                let activeLiElement = $('header[school-grade="MIDDLE"] .gnb > ul > li.active');
                                if (activeLiElement.length > 0) {
                                    let url = activeLiElement.find('.lnb-wrap').data('url');
                                    console.log('data-url:', url);

                                    textbookListScreen.v.sortCode = activeLiElement.data('sort');

                                    textbookListScreen.v.subjectCode = textbookListScreen.f.getSubjectCodeFromUrl(url);
                                    textbookListScreen.c.getTextbookList0314();
                                    textbookListScreen.c.getMyFavoriteTextbookList();
                                }
                            }
                        }
                    });

                    // Mutation Observer를 대상 엘리먼트에 연결
                    observer.observe(targetElement, { attributes: true, childList: true, subtree: true });
                }
            });

            textbookListScreen.event();
        },
        event: function () {
            $('header[school-grade="MIDDLE"] .gnb-inner > nav > ul > li > a').on("click", async function () {
                let liText = $(this).text();
                console.log("현재메뉴명: ", liText);
                localStorage.setItem('gnbMenuName', liText);

                // 클릭된 a 태그의 text 내용에 따라 subjectId 설정
                let subjectId;
                if (liText.includes("중국어")) {
                    subjectId = "subject6";
                } else if (liText.includes("영어")) {
                    subjectId = "subject1";
                } else if (liText.includes("수학")) {
                    subjectId = "subject2";
                } else if (liText.includes("사회")) {
                    subjectId = "subject3";
                } else if (liText.includes("과학")) {
                    subjectId = "subject4";
                } else if (liText.includes("음악")) {
                    subjectId = "subject5";
                } else if (liText.includes("국어")) {
                    subjectId = "subject0";
                } else if (liText.includes("진로")) {
                    subjectId = "subject7";
                }
                textbookListScreen.v.sortCode = $(this).parent().data('sort');
                console.log(textbookListScreen.v.sortCode);

                textbookListScreen.v.subjectId = subjectId;

                // 개정년도 2015를 기본으로 설정 -> 변경 가능
                textbookListScreen.v.subjectRevisionCode = '2015';


                await textbookListScreen.c.getTextbookList0314();
                textbookListScreen.c.getGnbBanner(textbookListScreen.v.sortCode)
            });

            $('#siteMapMid').off().on("click", () => {
                textbookListScreen.c.getTextbookListForMidSiteMap();
            })
        }
    };
    textbookListScreen.init();
});