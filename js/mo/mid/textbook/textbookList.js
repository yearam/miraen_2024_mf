$(function () {
    let textbookListScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf textbookListScreen
         */
        v: {
            subjectCode: '',
            textbookListHtml: '',
            subjectRevisionCode: "2022",
            //subjectCode: '0105',
            subjectId: 'subject0',
            gradeCode: "01",
            gradeCodeNoZero: "1",
            subjectTypeCode: '', // 선택값: GOV, APPRV, AUTH
            mobileTextbookListYn: '',
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

            getTextbookList: (data) => {
                const options = {
                    url: '/pages/api/textbook/midGnbMenuList.ax',
                    data: {
                        subjectCode: textbookListScreen.v.subjectCode,
                        subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                        mobileTextbookListYn: textbookListScreen.v.mobileTextbookListYn,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookList response: ", res);

                        let $lnbInner = $(".mid-list-textbook");

                        let lnbInnerHtml = `
                            ${res.rows.map(function (item, index) {
                                //return `<a href="javascript:void(0);" data-masterseq="${item.masterSeq}" data-revisionCode="${item.subjectRevisionCode}">
                                return `<a href="/pages/mid/textbook/textbookDetail.mrn?masterSeq=${item.masterSeq}&revisionCode=${item.subjectRevisionCode}&subjectCode=${item.subjectCode}" data-masterseq="${item.masterSeq}" data-revisionCode="${item.subjectRevisionCode}">
                                            <span class="badge type-rounded fill-light">${item.subjectRevisionCode}</span>
                                            <p class="title">${item.textbookName}${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</p>
                                        </a>`
                        }).join('')}
                        `

                        $lnbInner.append(lnbInnerHtml);
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
                    url: '/pages/api/textbook/midGnbMenuList.ax',
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("siteMap 교과서 리스트 : ", res);
                        $('#siteMapList > div[id]').each(function() {
                            let liId = this.id.split('|');
                            let matchingData = $.grep(res.rows, function(item) {
                                return liId.includes(item.subjectCode);
                            });
                            let newData = $.map(matchingData, function (item) {
                                return `<li><a href="#" class="text-data" data-masterseq="${item.masterSeq}">${item.textbookName}${item.leadAuthorName ? `(${item.leadAuthorName})` : ''}</a></li>`;
                            }).join('');
                            $(this).find('.depth2').empty().append(newData);
                        });

                        $('#siteMapList div[id] a').off().on('click', function (event) {
                            const masterSeq = $(this).data('masterseq');
                            let subjectCode = $(this).closest('div.nav-item').attr('id');

                            // 교과서 코드에 '|' 구분자가 있을 때 쿼리스트링으로 넘길 수 없어서 '/'로 변경
                            if (subjectCode.includes('|')) {
                                subjectCode = subjectCode.split('|').join('/');
                            }

                            // textbookListScreen.f.showDetailPage(masterSeq);
                            textbookListScreen.f.showDetailPage(masterSeq, subjectCode);

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
                textbookListScreen.c.getTextbookList();
            },

            // 로컬스토리지에 클릭한 교과서 정보 저장
            saveToLocalStorage: function (masterSeq) {

                localStorage.setItem('masterSeq', masterSeq);
                localStorage.setItem('revisionCode', textbookListScreen.v.subjectRevisionCode);

                location.reload();
            },

            showDetailPage: function (masterSeq, subjectCode) {
                // textbookDetail에서 호출할 때는 textbookDetail.mrn로 이동, 아니면 textbook/textbookDetail.mrn로 이동
                const currentPath = window.location.pathname;
                const isCurrentPathDetailPage = currentPath.includes('/textbook/textbookDetail.mrn');

                // 페이지 경로와 쿼리스트링을 조합하여 URL 생성
                let targetPage = 'textbook/textbookDetail.mrn'; // 대상 페이지
                const revisionCode = textbookListScreen.v.subjectRevisionCode;
                let queryString = `?masterSeq=${masterSeq}&revisionCode=${revisionCode}`; // 쿼리스트링

                if (subjectCode !== null && subjectCode !== undefined) {
                    queryString = `?masterSeq=${masterSeq}&revisionCode=${revisionCode}&subjectCode=${subjectCode}`; // 쿼리스트링
                }

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

            // setMyFavoriteList: function (list) {
            //     $('header[school-grade="MIDDLE"] .mybook .mybook-inner ul').html('') // 즐겨찾기 목록 초기화
            //
            //     $.each(list, function(index, item) {
            //         let htmlElement = `
            //         <li class="alert-button">
            //             <a href="" data-path="${item.favoriteUrl}">${item.textbookName} ${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</a>
            //             <button type="button" data-masterseq="${item.masterSeq}" data-btn-type="delete" class="icon-button" title="삭제">
            //               <svg>
            //                 <title>아이콘 설정하기</title>
            //                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
            //               </svg>
            //             </button>
            //         </li>
            //       `
            //         $('header[school-grade="MIDDLE"] .mybook .mybook-inner ul').append(htmlElement);
            //     })
            //
            //     // 즐겨찾기한 교과서 페이지 현재창 이동
            //     $('.mybook .mybook-inner li a').off('click').on('click', function(e) {
            //         e.preventDefault();
            //
            //         const path = $(this).data('path');
            //
            //         console.log(path);
            //
            //         if (!path) {
            //             console.log("path 잘못됨");
            //         } else {
            //             window.open(path, "_self");
            //         }
            //     })
            //
            //     // 즐겨찾기 삭제 - 모바일 x
            //     // $('.mybook .mybook-inner button[data-btn-type="delete"]').on('click', function(e) {
            //     //     e.preventDefault();
            //     //
            //     //     const masterSeq = $(this).data('masterseq');
            //     //     textbookListScreen.c.updateFavorite(masterSeq);
            //     // })
            //
            //     // '내 교과서' 텍스트 옆 svg에 마우스 포인터 기본으로 수정
            //     $('.mybook .mybook-inner .button').css('cursor', 'default');
            //
            // }

        },

        init: function (event) {
            $(document).ready(function() {
                $('.mid-list-textbook').empty();
                // $('.gnb > nav.mid-nav').find('a[data-subjectId=subject0]').trigger('click');
                const moSubjectCodeVal = $('#moSubjectCode').val();
                const mobileTextbookListYn = $('#mobileTextbookListYn').val();
                if (moSubjectCodeVal !== null && moSubjectCodeVal !== undefined
                    && mobileTextbookListYn !== null && mobileTextbookListYn !== undefined) {
                    textbookListScreen.v.subjectCode = moSubjectCodeVal;
                    textbookListScreen.v.mobileTextbookListYn = mobileTextbookListYn;
                }

                textbookListScreen.v.subjectRevisionCode = '2022';
                textbookListScreen.c.getTextbookList();

                textbookListScreen.v.subjectRevisionCode = '2015';
                textbookListScreen.c.getTextbookList();
            });

            textbookListScreen.event();
        },
        event: function () {
            // TODO - nav 위치에 따라 selector 수정 필요
            $('.gnb > nav.mid-nav > a').on("click", function () {

                let liText = $(this).text();
                console.log("현재메뉴명: ", liText);
                localStorage.setItem('gnbMenuName', liText);

                // 클릭된 a 태그의 text 내용에 따라 subjectId 설정
                let subjectId;
                if (liText.includes("외국어")) {
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

                if(!subjectId) { return; }

                textbookListScreen.v.subjectId = subjectId;

                // TODO - 2015, 2022 둘 다 한번에 띄우는듯? DB에 ordering 필드 값이 null이 있어서 2번 조회하도록. empty()를 클릭, 초기화에 넣음
                // 개정년도 2015를 기본으로 설정 -> 변경 가능
                $('.mid-list-textbook').empty();
                
                textbookListScreen.v.subjectRevisionCode = '2022';
                textbookListScreen.c.getTextbookList();

                textbookListScreen.v.subjectRevisionCode = '2015';
                textbookListScreen.c.getTextbookList();

            });

            // 사이트맵 - 모바일
             $('#mo_siteMapMid').off().on("click", () => {
                 textbookListScreen.c.getTextbookListForMidSiteMap();
             })

            $("#gnbAreaMid > a").each(function() {
                let curUrl = $(this).attr('href').split('/');
                let menuSearch = '';
                if(curUrl.length > 3){
                    menuSearch = curUrl[3] + '/' + curUrl[4];
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