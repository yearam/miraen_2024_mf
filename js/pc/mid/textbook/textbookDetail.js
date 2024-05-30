let textbookDetailScreen

$(function() {
    textbookDetailScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf textbookDetailScreen
         */
        v: {
            masterSeq: 1157,
            textbookName: '',
            leadAuthorName: '',
            textbookDetailHtml: '',
            subjectRevisionCode: "2015",
            subjectCode: '0105',
            coursewareCode: '100',
            currentDepth1UnitSeq: '',
            currentDepth1UnitName: '',
            currentDepth1UnitNumber: '',
            currentDepth2UnitSeq: '',
            currentDepth2UnitName: '',
            currentDepth2UnitNumber: '',
            favoriteUrl: '',
            favoriteName: '',
            favoriteSeq: '',
            allDepth1: false,
        },



        /**
         * 통신 객체- call
         *
         * @memberOf textbookDetailScreen
         */
        c: {

            /**
             * 교과서 상단 상세 정보
             *
             * @memberOf textbookDetailScreen.c
             */

            getMasterInfo: async () => {
                // 상단 교과서 정보 초기화
                $('#main-contents .textbook-intro').remove();

                const options = {
                    url: '/pages/api/textbook/masterInfo.ax',
                    data: {
                        masterSeq: textbookDetailScreen.v.masterSeq,
                    },
                    method: 'GET',
                    success: async function (res) {
                        console.log("getMasterInfo response: ", res.row);
                        const masterInfo = res.row;

                        textbookDetailScreen.v.textbookName = res.row.textbookName;
                        textbookDetailScreen.v.leadAuthorName = res.row.leadAuthorName;
                        textbookDetailScreen.v.subjectName = res.row.subjectName;

                        $('.snb-header .dropdown button').html(`
                            ${res.row.textbookName}
                            <span class="name">${res.row.leadAuthorName ? `${res.row.leadAuthorName}` : ''}</span>
                            ${textbookDetailScreen.v.relatedTextbookLength >= 2 ? `
                                <svg>
                                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
                                </svg>
                            ` : ''}
                        `)

                        if (textbookDetailScreen.v.relatedTextbookLength <= 1) {
                            $('.snb-inner .dropdown > button').css('cursor', 'auto');
                            $('.snb-inner .dropdown > svg').css('display', 'none');
                            $('.snb-inner .dropdown').on('click', function() {
                                $('.snb-inner .dropdown > ul').css('display', 'none');
                            })
                        }

                        // 교과서 정보 영역 초기화
                        $('#main-contents .textbook-intro').remove();

                        // 현재 URL에서 쿼리스트링 부분을 가져오기
                        let queryString = window.location.search;

                        // URLSearchParams 객체를 사용하여 쿼리스트링 파싱
                        let searchParams = new URLSearchParams(queryString);

                        let ebookUseElement = ''; // ebook 연결 버튼 엘리먼트
                        let ebookCopyElement = ''; // 교과서 링크 복사 버튼 엘리먼트
                        let smartPptElement = ''  // 스마트 수업 버튼 엘리먼트
                        let dvdElement = ''; // 교사용 DVD 다운로드 버튼 엘리먼트
                        let teacherTextbookElement = ''; // 교사용 교과서 다운로드 버튼 엘리먼트
                        let textbookReferenceElement = ''; // 교과서 자료 다운로드 버튼 엘리먼트
                        let guidebookElement = ''; // 지도서 다운로드 버튼 엘리먼트
                        let unitReferenceElement = ''; // 단원별 자료 다운로드 버튼 엘리먼트
                        let categoryReferenceElement = ''; // 유형별 자료 다운로드 버튼 엘리먼트
                        let midEndTermElement = ''; // 중간/기말 평가 다운로드 버튼 엘리먼트

                        let ebookFilePath = masterInfo?.ebookFilePath;
                        let referenceCount = {};
                        let specialDataList = []

                        try {
                            [referenceCount, specialDataList] = await Promise.all([
                                textbookDetailScreen.c.getReferenceCountAndFavorite(),
                                textbookDetailScreen.c.getSpecialDataList(),
                            ]);
                        } catch (error) {
                            console.error("Error in getMasterInfo: ", error);
                        }

                        /*
                            >> api에서 제공하는 카운트
                            "favoriteCount": 0,
                            "teacherDvdCount": 1,
                            "teacherbookCount": 0, // 교사용 교과서
                            "guidebookCount": 0, // 지도서
                            "textbookCount": 0, // 교과서 자료
                            "testCount": 0  // 중간/기말평가 자료

                            중등에서 사용 : teacherDvdCount, teacherbookCount, guidebookCount, testCount
                         */

                        if (masterInfo.ebookUseYn === "Y" && masterInfo.ebookDisplayYn === "Y") {
                            ebookUseElement = `
                            <div class="ebook-box">
                            <span>
                                <svg>
                                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                </svg>
                            </span>
                            <p class="text-white text-xs">교과서 e-book 보기</p>
                         </div>`

                            ebookCopyElement = `
                                <li>
                                <!-- Target -->
                                <input id="ebookPathInput" type="hidden" value=${ebookFilePath}>
                                <!-- Trigger -->
                                <button id="ebookLinkCopyBtn" data-toast="toast-copy" type="button" class="button button-md type-text"  data-clipboard-target="#ebookPathInput">
                                    <svg>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-copy"></use>
                                    </svg> 교과서 링크 복사 
                                </button>
                            </li>`
                        }

                        if (masterInfo.allSmartPptUseYn === "Y" && masterInfo.allSmartPptDisplayYn === "Y") {
                            smartPptElement = `
                             <button data-type="smartPptDownloadBtn" data-btn-type="page-open" data-path="${masterInfo.allSmartPptFilePath ? masterInfo.allSmartPptFilePath.replace(/ /g, "%20") : ''}" type="button" class="button size-md type-primary"> 스마트수업 
                                <svg>
                                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-file-filled"></use>
                                </svg>
                            </button>`
                        }

                        if (masterInfo.teacherDvdUseYn === "Y" && masterInfo.teacherDvdDisplayYn === "Y" && masterInfo.teacherDvdCount >= 1) {
                            dvdElement = `
                                <button data-type="dvdDownloadBtn" data-btn-type="download-btn" data-count="${masterInfo.teacherDvdCount}" data-path="${masterInfo.teacherDvdFilePath ? masterInfo.teacherDvdFilePath.replace(/ /g, "%20") : ''}" type="button" class="button size-md"> 교사용 DVD 
                                  <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                            `
                        }

                        if (masterInfo.teacherTextbookUseYn === "Y" && masterInfo.teacherTextbookDisplayYn === "Y" && masterInfo.teacherbookCount >= 1) {
                            teacherTextbookElement = `
                                <button data-type="teacherTextbookDownloadBtn" data-btn-type="download-btn" data-count="${masterInfo.teacherbookCount}" data-path="${masterInfo.teacherTextbookFilePath ? masterInfo.teacherTextbookFilePath.replace(/ /g, "%20") : ''}" type="button" class="button size-md"> 교사용 교과서 
                                  <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                            `
                        }

                        if (masterInfo.textbookCount && masterInfo.textbookCount > 0) {
                            textbookReferenceElement = `
                                <button type="button" data-type="textbookReferenceDownloadBtn" data-btn-type="download-btn" data-count="${masterInfo.textbookCount}" data-path="${masterInfo.textbookPath ? masterInfo.textbookPath.replace(/ /g, "%20") : ''}" class="button size-md"> 교과서 <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                            `
                        }

                        if (masterInfo.guidebookUseYn === "Y" && masterInfo.guidebookDisplayYn === "Y" && masterInfo.guidebookCount >= 1) {
                            guidebookElement = `
                                <button data-type="guidebookDownloadBtn" data-btn-type="download-btn" data-count="${masterInfo.guidebookCount}" data-path="${masterInfo.guidebookFilePath ? masterInfo.guidebookFilePath.replace(/ /g, "%20") : ''}" type="button" class="button size-md"> 지도서 
                                  <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                            `
                        }

                        if (referenceCount.unitCount !== 0) {
                            unitReferenceElement = `
                                <button type="button" data-btn-type="download-unit" data-path="" class="button size-md type-primary-light"> 단원별 자료
                                  <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                              `
                        }

                        if (referenceCount.categoryCount !== 0) {
                            categoryReferenceElement = `
                                <button type="button" data-btn-type="download-category" data-path="" class="button size-md type-primary-light"> 유형별 자료
                                  <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                            `
                        }

                        if (masterInfo.testCount >= 1) {
                            midEndTermElement = `
                                <button type="button" data-type="testDownloadBtn" data-btn-type="download-btn" data-count="${res.row.testCount}" class="button size-md type-primary-light"> 중간/기말평가 
                                  <svg>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                  </svg>
                                </button>
                            `
                        }

                        // 즐겨찾기용 favoriteName 설정
                        textbookDetailScreen.v.favoriteName = `${res.row.textbookName}${res.row.leadAuthorName ? ` (${res.row.leadAuthorName})` : ''}`

                        // 즐겨찾기 url 설정
                        let entireUrl = window.location.href;
                        textbookDetailScreen.v.favoriteUrl = entireUrl;

                        textbookDetailScreen.v.textbookDetailHtml = `
                           <div class="textbook-intro">
                              <div class="textbook-wrap">
                                <a href="javascript:void(0);" class="book-link is-ebook" data-path="${ebookFilePath?.replace(/ /g, "%20")}" data-btn-type="page-open">
                                  <!--!NOTE : is-ebook 클래스 있으면 호버 시 돋보기 아이콘 노출 -->
                                  <img alt=${masterInfo.textbookName} src="${masterInfo.coverImageFilePath ? masterInfo.coverImageFilePath : ''}"
                                  data-path="${ebookFilePath.replace(/ /g, "%20")}"/>
                                  ${ebookUseElement}
                                </a>
                                <div class="info-box">
                                  <div class="info-inner">
                                    <span class="badge">${masterInfo.subjectRevisionCode} 개정</span>
                                    <div class="title">
                                      <ul class="divider-group">
                                        <li><h2>${masterInfo.textbookName}</h2></li>
                                        <li><h2>${(masterInfo.leadAuthorName !== null && masterInfo.leadAuthorName !== undefined) ? `(${masterInfo.leadAuthorName})` : ''}</h2></li>
                                      </ul>
                                    </div>
                                    <ul class="divider-group">
                                      ${ebookCopyElement}
                                      <li>
                                          <span class="switcher">
                                            <input type="checkbox" id="reg-favorite" />
                                            <label data-toast="toast-favorite" for="reg-favorite">즐겨찾기 등록</label>
                                          </span>
                                      </li>
                                    </ul>
                                  </div>
                                  <div class="info-buttons">
                                    ${smartPptElement}
                                    <div class="buttons">
                                        <div>
                                            ${dvdElement}
                                            ${teacherTextbookElement}
                                            ${textbookReferenceElement}
                                            ${guidebookElement}
                                        </div>
                                        <div>
                                            ${unitReferenceElement}
                                            ${categoryReferenceElement}
                                            ${midEndTermElement}
                                        </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="special-data-wrap">
                                <div class="special-data-header">
                                    <a href="" class="title">교과서 특화자료</a>
                                    <div class="special-data-pagination">
                                      <button type="button" class="button-prev">
                                        <svg>
                                          <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-left"></use>
                                        </svg>
                                      </button>
                                      <button type="button" class="button-next">
                                        <svg>
                                          <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-right"></use>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                <div class="swiper special-data-body">
                                  <div class="swiper-wrapper">
                                  ${specialDataList.length !== 0 ?
                            specialDataList.map(item =>
                                `<a href="javascript:void(0);" class="swiper-slide" data-type="specialData" data-extension="${item.fileExtension}" data-save-code=${item.fileUploadMethod} data-path=${item.filePath?.replace(/ /g, "%20")}>
                                    <span class="ellipsis-single">${item.referenceName}</span>
                                    <svg>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-${item.fileUploadMethod.toLowerCase() === 'link' || item.fileUploadMethod.toLowerCase() === 'newwin'? 'new-windows' : 'download'}"></use>
                                    </svg>
                                </a>`
                            ).join('') : ''}
                                  </div>
                                </div>
                              </div>
                           </div>
                        `

                        $('#main-contents').prepend(textbookDetailScreen.v.textbookDetailHtml);
                        $('.swiper-wrapper .swiper-slide[data-type="specialData"]').on('click', function () {
                            if ($(this).data('extension') === 'LINK' || $(this).data('extension') === 'YOUTUBE') {
                                window.open($(this).data('path'), '_blank');
                            } else {
                                if ($isLogin) {
                                    if ($('#userGrade').val() === '001') {
                                        textbookDetailScreen.f.needAuthAlert();
                                    } else if ($('#userGrade').val() === '002') {
                                        textbookDetailScreen.f.copyrightAlert($(this).data('path'));
                                    }
                                } else {
                                    textbookDetailScreen.f.loginAlert();
                                }
                            }
                        })

                        // 즐겨찾기 여부에 따른 토글 설정
                        if (masterInfo.favoriteCount) {
                            $('#reg-favorite').prop('checked', true);
                        } else {
                            $('#reg-favorite').prop('checked', false);
                        }

                        // 즐겨찾기 버튼 이벤트
                        $('#reg-favorite').change(function() {
                            if ($isLogin) {
                                if ($(this).is(':checked')) {
                                    textbookDetailScreen.c.addFavorite('add');
                                } else {
                                    textbookDetailScreen.c.updateFavorite('delete')
                                }
                            } else {
                                $('#reg-favorite').prop('checked', false);
                                textbookDetailScreen.f.loginAlert();
                            }
                        })

                        $('.book-link, button[data-btn-type="page-open"]').on('click', function () {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    textbookDetailScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002') {
                                    let ebookPath = $(this).data('path');
                                    window.open(ebookPath, '_blank');
                                }
                            } else {
                                textbookDetailScreen.f.loginAlert();
                            }
                        })

                        // 단원별 자료 다운로드 버튼 클릭
                        $('button[data-btn-type="download-unit"]').on('click', function () {
                            if (multi_use_yn === true) {
                                if ($isLogin) {
                                    if ($('#userGrade').val() === '001') {
                                        textbookDetailScreen.f.needAuthAlert();
                                    } else if ($('#userGrade').val() === '002') {
                                        $alert.open("MG00010", () => {
                                            openPopup({id: 'popup-chapter'});
                                        });
                                    }
                                } else {
                                    textbookDetailScreen.f.loginAlert();
                                }
                            } else if (multi_use_yn === false) {
                                $alert.open('MG00060');
                            }
                        })

                        // 유형별 자료 다운로드 버튼 클릭
                        $('button[data-btn-type="download-category"]').on('click', function () {
                            if (multi_use_yn === true) {
                                if ($isLogin) {
                                    if ($('#userGrade').val() === '001') {
                                        textbookDetailScreen.f.needAuthAlert();
                                    } else if ($('#userGrade').val() === '002') {
                                        $alert.open("MG00010", () => {
                                            openPopup({id: 'popup-type-data'});
                                            categoryPopupScreen.c.getReferenceCategoryList('001');
                                            categoryPopupScreen.c.getReferenceCategoryList('002');
                                            categoryPopupScreen.c.getReferenceCategoryList('003');
                                            categoryPopupScreen.c.getReferenceCategoryList('004');
                                        });
                                    }
                                } else {
                                    textbookDetailScreen.f.loginAlert();
                                }
                            } else if (multi_use_yn === false) {
                                $alert.open('MG00060');
                            }
                        })

                        $('button[data-btn-type="download-btn"]').on('click', function () {
                            // data-type: dvdDownloadBtn, teacherTextbookDownloadBtn, guidebookDownloadBtn, testDownloadBtn
                            let type = $(this).attr('data-type');
                            let path = $(this).data('path');
                            let count = $(this).data('count');

                            // [운영 멀티다운로드 에러] 임시 로직: 자료가 1건일 때만 로그인 체크 및 저작권 안내
                            // if ($(this).data('count') >= 0) {
                            //     if ($(this).data('count') === 1) {
                            //         if ($isLogin) {
                            //             if ($('#userGrade').val() === '001') {
                            //                 textbookDetailScreen.f.needAuthAlert();
                            //             } else if ($('#userGrade').val() === '002') {
                            //                 $alert.open("MG00010", () => {
                            //                     window.open(path, '_blank');
                            //                 })
                            //             }
                            //         } else {
                            //             textbookDetailScreen.f.loginAlert();
                            //         }
                            //     } else {
                            //         // 준비중입니다 팝업
                            //         $alert.open('MG00060');
                            //     }
                            // }


                            // ------------------------------ 기존 코드 ----------------------------
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    textbookDetailScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002') {
                                    $alert.open("MG00010", () => {
                                        if ($(this).data('count') >= 0) {
                                            if ($(this).data('count') === 1) {
                                                window.open(path, '_blank');
                                            } else {
                                                // 멀티다운로드 연결
                                                if (multi_use_yn === true) {
                                                    textbookDetailScreen.c.getReferenceParams(type);
                                                } else if (multi_use_yn === false) {
                                                    // 준비중입니다 팝업
                                                    $alert.open('MG00060');
                                                }
                                            }
                                        }
                                    });
                                }
                            } else {
                                textbookDetailScreen.f.loginAlert();
                            }
                        })

                        $('#ebookLinkCopyBtn').off('click').on('click', function () {
                            if (ebookFilePath) {
                                if ($isLogin) {
                                    let clipboard = new ClipboardJS('#ebookLinkCopyBtn')

                                    clipboard.on('success', function (e) {
                                        console.info('Action:', e.action);
                                        console.info('Text:', e.text);
                                        console.info('Trigger:', e.trigger);

                                        e.clearSelection();
                                    });

                                    // Clipboard.js 오류 이벤트 핸들러
                                    clipboard.on('error', function (e) {
                                        console.log(e);
                                        console.error('ClipboardJS error:', e.action)
                                    });
                                } else {
                                    textbookDetailScreen.f.loginAlert();
                                }
                            }
                        })

                        // ui.js가 안먹어서 임시로 넣어둠
                        $('.close-button').click(function (e) {
                            $(this).parents('li').removeClass('active');
                            $(this).closest('.site-map').find('.icon-button').removeClass('active');
                            $('html').removeClass('header-overlay');
                        });

                        // 사이드메뉴 이벤트 핸들러
                        textbookDetailScreen.f.handleAsideMenu();

                        // 상단 breadcrumbs 세팅
                        const source = localStorage.getItem('source');
                        let gnbMenuName = '';
                        if (source === 'mainMenu') {
                            gnbMenuName = localStorage.getItem('gnbMenuName');
                        } else if (source === 'personalGnb') {
                            const subjectName = sessionStorage.getItem('subjectName');
                            if (subjectName === '국어') {
                                gnbMenuName = '국어';
                            } else if (subjectName === '영어') {
                                gnbMenuName = '영어';
                            } else if (subjectName === '수학') {
                                gnbMenuName = '수학';
                            } else if (subjectName.includes('사회') || subjectName.includes('역사') || subjectName.includes('도덕')) {
                                gnbMenuName = '사회/역사/도덕';
                            } else if (subjectName.includes('과학') || subjectName.includes('기술') || subjectName.includes('가정')) {
                                gnbMenuName = '과학/기술·가정';
                            } else if (subjectName.includes('음악') || subjectName.includes('미술') || subjectName.includes('체육')) {
                                gnbMenuName = '음악/미술/체육';
                            } else if (subjectName.includes('중국어') || subjectName.includes('일본어') || subjectName.includes('한문')) {
                                gnbMenuName = '중국어/일본어/한문';
                            } else if (subjectName.includes('진로') || subjectName.includes('정보') || subjectName.includes('기타')) {
                                gnbMenuName = '진로/정보';
                            }
                        }

                        $('.breadcrumbs li[data-type="subject"] a').text(gnbMenuName).click(function (e) {
                            e.preventDefault();
                        });

                        $('.breadcrumbs li[data-type="textbook"] a').text(`${textbookDetailScreen.v.textbookName}`).click(function (e) {
                            e.preventDefault();
                        });


                        // $(document).ready(function () {
                        const sliderTextbookSpecialData = function () {
                            const thisSlider = $('.swiper.special-data-body');
                            const swiper = new Swiper('.swiper.special-data-body', {
                                speed: 400,
                                slidesPerView: 1,
                                grid: {
                                    rows: 4,
                                },
                                navigation: {
                                    nextEl: '.special-data-pagination .button-next',
                                    prevEl: '.special-data-pagination .button-prev',
                                },
                                on: {
                                    beforeInit: function () {
                                        let slideLength = thisSlider.find('.swiper-slide').length;

                                        if (slideLength / 4 < 1) {
                                            $('.special-data-pagination').hide();
                                        }
                                    },
                                },
                            });
                        };

                        // sliderTextbookSpecialData 함수 호출
                        sliderTextbookSpecialData();
                        // })
                    }
                };

                $.ajax(options);
            },


            /**
             * 교과서 단원별/유형별/중간/기말 평가자료 정보
             *
             *  @memberOf textbookDetailScreen.c
             */
            // getTextbookDetail: () => {
            //     console.log("masterSeq: ", textbookDetailScreen.v.masterSeq);
            //     const options = {
            //         url: '/pages/mid/textbook/textbookDetail.ax',
            //         data: { masterSeq : textbookDetailScreen.v.masterSeq },
            //         method: 'GET',
            //         async: false,
            //         success: function(res) {
            //             console.log("textbookDetail response: ", res);
            //
            //         }
            //     };
            //
            //     $.ajax(options);
            // },

            /**
             * 연관 교과서 리스트
             *
             * @memberOf textbookDetailScreen.c
             */
            getRelatedTextbookList: (data) => {
                const options = {
                    url: '/pages/api/textbook/relatedTextbookList.ax',
                    data: {
                        masterSeq: textbookDetailScreen.v.masterSeq,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        let textbookListArr = res.rows;
                        let textbookData2022 = [];
                        let textbookData2015 = [];

                        textbookListArr.forEach(function(item) {
                            // subjectRevisionCode에 따라서 적절한 배열에 오브젝트 추가
                            if (item.subjectRevisionCode === "2022") {
                                textbookData2022.push(item);
                            } else if (item.subjectRevisionCode === "2015") {
                                textbookData2015.push(item);
                            }
                        });

                        textbookDetailScreen.v.relatedTextbookLength = textbookListArr.length;

                        if (textbookListArr.length !== 0) {
                            $.each(textbookListArr, function (index, item) {
                                // 메뉴 아래 교과서 상세정보 렌더링
                                // 가데이터 교과서 정보
                                let textbookName = item.textbookName;
                                let leadAuthorName = item.leadAuthorName;

                                // snb header 영역 : 현재 교과서, 저자 이름 + 다른 교과서 목록
                                let dropdownButton = $('#snb .snb-header .dropdown button');

                                dropdownButton.next('ul.items').empty(); // 기존 ul 제거

                                // snb header 영역 : 현재 교과서, 저자 이름 + 다른 교과서 목록
                                dropdownButton.next('ul.items').html(`
        
                                <!-- !NOTE 2015, 2022개정은 li에 .revise가 붙습니다. -->
                                <!-- 2022 개정판 있다면 리스트 뿌리기 -->
                                ${textbookData2022.length !== 0 ? `
                                    <li class="revise"><strong>2022 개정</strong></li>
                                    ${textbookData2022.map(function (item) {
                                    return `<li><a href="#" data-masterseq="${item.masterSeq}">${item.textbookName}<span class="name" data-masterseq="${item.masterSeq}">${item.leadAuthorName}</span></a></li>`
                                }).join('')}
                                    ` : ''}
                                
                                <!-- 2015 개정판 있다면 리스트 뿌리기 -->
                                ${textbookData2015.length !== 0 ? `
                                    <li class="revise"><strong>2015 개정</strong></li>
                                    ${textbookData2015.map(function (item) {
                                    return `<li> <a href="#" data-masterseq="${item.masterSeq}">${item.textbookName}<span class="name" data-masterseq="${item.masterSeq}">${item.leadAuthorName}</span></a></li>`
                                }).join('')}
                                    ` : ''}
                                `)

                                $('.snb-inner .snb-header .dropdown ul li').on('click', 'a, span', function (e) {
                                    e.preventDefault();

                                    // 이벤트가 발생한 요소가 <a> 태그면 해당 요소, <span> 태그면 부모 <a> 태그를 선택
                                    let targetAnchor = $(e.target).is('a') ? $(e.target) : $(e.target).closest('a');

                                    textbookDetailScreen.v.masterSeq = $(this).data('masterseq');
                                    textbookDetailScreen.f.showDetailPage(textbookDetailScreen.v.masterSeq);
                                    textbookDetailScreen.f.callTextbookDetailFunctions(false);
                                });
                            })
                        } else {
                            $('.snb-inner .dropdown > button').css('cursor', 'auto');
                            $('.snb-inner .dropdown > svg').css('display', 'none');
                        }

                        // snb로 화면 새로고침 되어서 이벤트 한번 더 등록해줘야함
                        textbookDetailScreen.f.handleAsideMenu();

                        if (textbookListArr.length <= 1) {
                            $('.snb-inner .dropdown').on('click', function() {
                                $('.snb-inner .dropdown > ul').css('display', 'none');
                            })
                        }
                    }
                };

                $.ajax(options);
            },

            /**
             * 단원 리스트
             *
             * @memberOf textbookDetailScreen.c
             */
            getUnitListTo2Depth: async (data) => {
                const options = {
                    url: '/pages/api/textbook-unit/unitListTo2Depth.ax',
                    data: {
                        masterSeq: textbookDetailScreen.v.masterSeq,
                    },
                    method: 'GET',
                };

                try {
                    const res = await $.ajax(options);

                    let unitList = res.rows;
                    let groupedData = [];

                    if (unitList.length !== 0) {
                        unitList.sort((a, b) => {
                            const sortA = typeof a.sort === 'string' ? a.sort : ''; // 문자열이 아닌 경우 빈 문자열로 처리
                            const sortB = typeof b.sort === 'string' ? b.sort : ''; // 문자열이 아닌 경우 빈 문자열로 처리
                            return sortA.localeCompare(sortB, undefined, {numeric: true, sensitivity: 'base'})
                        })

                        // 결과 배열을 순회하면서 그룹화
                        unitList.forEach((item, index) => {
                            // 정렬값에서 맨 앞자리를 추출하여 그룹 키로 사용
                            let groupKey = item.sort.split('-')[0];

                            // 해당 그룹이 존재하지 않으면 새로운 배열로 초기화
                            if (!groupedData[groupKey]) {
                                groupedData[groupKey] = [];
                            }

                            groupedData[groupKey].push(item);

                            // 현재 값이 이전 값보다 길이가 작은 경우 isLastItem을 true로 설정
                            if (index > 0 && item.sort.length <= unitList[index - 1].sort.length) {
                                unitList[index - 1].isLastItem = true;
                            }

                            // depth에 따라 unitNumber에 값을 할당
                            switch (item.depth) {
                                case 1:
                                    item.unitNumber = parseInt(item.sort.split('-')[0]);
                                    break;
                                case 2:
                                    item.unitNumber = parseInt(item.sort.split('-')[1]);
                                    break;
                                default:
                                    break;
                            }
                        });

                        // 객체를 배열로 변환
                        let result = Object.values(groupedData);

                        // 모든 객체의 depth가 1인지 확인 (= 대단원만 존재)
                        const allDepth1 = result.every(subArr => subArr.every(obj => obj.depth === 1));
                        if (allDepth1) { textbookDetailScreen.v.allDepth1 = true; }

                        // 기본 오픈되는 단원 셋팅
                        textbookDetailScreen.f.setCurrentUnitInfo(result);

                        // 교과서 정보 하단에 현재 단원명 표시
                        textbookDetailScreen.f.setUnitName('unit');

                        const unitListContainer = $('#snb .snb-inner .subject-items');

                        const unitResult =(`
                            ${result.map(function (item, index) {
                            if (item.length >= 2) {
                                return `
                                    <li data-depth="2">
                                        <div class="depth-2">
                                            <a href="#" data-depth="1" data-unitseq="${item[0].unitSeq}">
                                                <span data-depth="1" data-unitNumberName="${item[0].unitNumberName ? (item[0].unitNumberName.includes('.') ? item[0].unitNumberName : item[0].unitNumberName + '.') : ''}">
                                                    ${item[0].unitNumberName ? (item[0].unitNumberName.includes('.') ? item[0].unitNumberName : item[0].unitNumberName + '.') : ''}
                                                </span>
                                                <span data-depth="1" class="title" data-unitName="${item[0].unitName}">${item[0].unitName}</span>
                                            </a>
                                            <button type="button" class="action">펼치기</button>
                                        </div>
                                        <div class="pane" style="${index === 0 ? '' : 'display: none'}">
                                            <div class="hour-list">
                                                <!-- !NOTE : 현재 페이지와 같은 링크를 가진 <a>에 .active가 붙습니다. -->
                                                ${item.map(function (el, index) {
                                                if (index >= 1) {
                                                    return `<a href="#" data-unitseq="${el.unitSeq}">
                                                                <span style="${el.unitNumberName ? 'display: block' : 'display: none'}" data-unitseq="${el.unitSeq}" data-unitNumberName="${el.unitNumberName ? (el.unitNumberName.includes('.') ? el.unitNumberName : el.unitNumberName + '.') : ''}">${el.unitNumberName ? (el.unitNumberName.includes('.') ? el.unitNumberName : el.unitNumberName + '.') : ''}</span>
                                                                <span class="title" data-unitseq="${el.unitSeq}" data-unitName="${el.unitName}">${el.unitName}</span>
                                                            </a>`;
                                                }
                                                return '';
                                            }).join('')}
                                                        </div>
                                                    </div>
                                                </li>
                                            `
                            } else {
                                return `
                                    <li data-depth="1">
                                        <a href="#" data-unitseq="${item[0].unitSeq}">
                                            <span data-unitseq="${item[0].unitSeq}" data-unitNumberName="${item[0].unitNumberName ? (item[0].unitNumberName.includes('.') ? item[0].unitNumberName : item[0].unitNumberName + '.') : ''}">
                                                 ${item[0].unitNumberName ? (item[0].unitNumberName.includes('.') ? item[0].unitNumberName : item[0].unitNumberName + '.') : ''}
                                            </span>
                                            <span class="title" data-unitseq="${item[0].unitSeq}" data-unitName="${item[0].unitName}">${item[0].unitName}</span>
                                        </a>
                                    </li>
                                `
                            }
                        }).join('')}
                        `);

                        unitListContainer.empty();
                        unitListContainer.append(unitResult);

                    } else {
                        $('#snb .snb-inner .subject-items').html(`
                            ${unitList.length === 0 ? `
                                <a>
                                    <span class="title">등록된 단원이 없습니다.</span>
                                </a>
                            ` : ''}
                        `)

                        // 교과서 정보 하단에 현재 단원명 표시
                        textbookDetailScreen.f.setUnitName('noUnit');
                    }

                    $('#snb .snb-inner .subject-items li:first').addClass('active');
                    // 해당 li 태그 이하에 hour-list 클래스명을 가진 엘리먼트가 있다면
                    if ($('#snb .snb-inner .subject-items li:first .hour-list').length > 0) {
                        // 그 엘리먼트 이하의 첫 번째 a 태그에 'active' 클래스 추가
                        $('#snb .snb-inner .subject-items li:first .hour-list a:first').addClass('active');
                    }
                } catch (err) {
                    console.error("Error in getUnitTo2Depth", err);
                    return null;
                }

                $.ajax(options);
            },

            /**
             * 유형별/단원별/중간/기말고사 카운트
             *
             * @memberOf textbookDetailScreen.c
             */
            getReferenceCountAndFavorite: async () => {
                // 각 유형별 자료 건수 담을 객체
                let referenceCount = {
                    categoryCount: 0,
                    favoriteCount: 0,
                    testCount: 0,
                    unitCount: 0,
                }

                const options = {
                    url: '/pages/api/textbook-refer/referenceCountAndFavorite.ax',
                    data: {
                        masterSeq: textbookDetailScreen.v.masterSeq,
                    },
                    method: 'GET',
                };

                try {
                    const res = await new Promise((resolve, reject) => {
                        options.success = function (response) {
                            resolve(response);
                        };
                        options.error = function (err) {
                            reject(err);
                        };
                        $.ajax(options);
                    });

                    referenceCount = { ...res.row };
                } catch (err) {
                    console.error('Error fetching data:', err);
                }

                return referenceCount;
            },

            getSpecialDataList: async () => {
                // 각 유형별 자료 건수 담을 객체
                let specialDataList = [];

                const options = {
                    url: '/pages/api/textbook-refer/specialDataList.ax',
                    data: {
                        masterSeq: textbookDetailScreen.v.masterSeq,
                    },
                    method: 'GET',
                };

                try {
                    const res = await new Promise((resolve, reject) => {
                        options.success = function (response) {
                            specialDataList = [...response.rows];
                            resolve(response);
                        };
                        options.error = function (err) {
                            reject(err);
                        };
                        $.ajax(options);
                    });
                } catch (err) {
                    console.error('Error fetching data:', err);
                }

                return specialDataList;
            },

            // 즐겨찾기 추가
            addFavorite: (type) => {
                let dataObj = {};
                if (type === "add") {
                    dataObj = {
                        favoriteType: 'MRN',
                        referenceSeq: textbookDetailScreen.v.masterSeq,
                        favoriteName: textbookDetailScreen.v.favoriteName, // 교과서이름(저자명)
                        favoriteUrl: textbookDetailScreen.v.favoriteUrl, // 교과서 디테일 url
                        useYn: 'Y',
                    }
                }
                const options = {
                    url: '/pages/api/mypage/addFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function(res) {
                        textbookDetailScreen.v.favoriteSeq = res.returnInt;
                        personalGnbScreen.c.getPersonalGnbList();

                        if (res.resultMsg === "exceed") {
                            $('#reg-favorite').prop('checked', false);
                            $alert.open("MG00012");
                        } else {
                            $toast.open("toast-favorite", "MG00038")
                            $quick.getFavorite();
                        }
                    },
                };

                $.ajax(options);
            },

            // 즐겨찾기 해제
            updateFavorite: (type) => {
                let dataObj = {};
                // 즐겨찾기 해제 type을 delete로 사용
                if (type === "delete") {
                    dataObj = {
                        favoriteType: "MRN",
                        referenceSeq: textbookDetailScreen.v.masterSeq,
                    }
                }

                const options = {
                    url: '/pages/api/mypage/updateFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function(res) {
                        console.log(res);
                        personalGnbScreen.c.getPersonalGnbList();
                        $toast.open("toast-favorite", "MG00039");
                        $quick.getFavorite();
                    },
                };

                $.ajax(options);
            },

            getReferenceParams: (type, fileId) => {
                const options = {
                    url: '/pages/mid/textbook/reference/getReferenceParams.ax',
                    data: {
                        masterSeq: textbookDetailScreen.v.masterSeq,
                        dataType: type,
                    },
                    method: 'GET',
                    success: function(res) {
                        console.log("getReferenceParams result: ", res.rows)

                        let paramsArray = [];

                        for (let i = 0; i < res.rows.length; i++) {
                            let currentItem = res.rows[i];

                            if (currentItem !== null && currentItem !== undefined) {
                                if (currentItem && currentItem.parameter) {
                                    let newItem = {
                                        params: currentItem.parameter
                                    };
                                    paramsArray.push(newItem);
                                }
                            }
                        }

                        console.log("paramsArray: ", paramsArray)

                        $multidown.open(paramsArray);
                    },
                };

                $.ajax(options);
            },
        },

        /**
         * 내부 함수
         *
         * @memberOf textbookDetailScreen
         */
        f: {
            setCurrentUnitInfo: function (result) {
                if (result.length > 1) {
                    // 대단원이 2개 이상인 경우
                    if (result[0].length > 1) {
                        // 첫번째 대단원 이하에 중단원이 있는 경우
                        textbookDetailScreen.v.currentDepth1UnitSeq = result[0][0].unitSeq;
                        textbookDetailScreen.v.currentDepth1UnitName = result[0][0].unitName;
                        textbookDetailScreen.v.currentDepth1UnitNumber = result[0][0].unitNumberName ? result[0][0].unitNumberName + (result[0][0].unitNumberName.includes('.') ? '' : '.') : '';

                        textbookDetailScreen.v.currentDepth2UnitSeq = result[0][1].unitSeq;
                        textbookDetailScreen.v.currentDepth2UnitName = result[0][1].unitName;
                        textbookDetailScreen.v.currentDepth2UnitNumber = result[0][1].unitNumberName ? result[0][1].unitNumberName + (result[0][1].unitNumberName.includes('.') ? '' : '.') : '';
                    } else {
                        // 첫번째 대단원 이하에 중단원이 없는 경우
                        textbookDetailScreen.v.currentDepth1UnitSeq = result[0].unitSeq;
                        textbookDetailScreen.v.currentDepth1UnitName = result[0].unitName;
                        textbookDetailScreen.v.currentDepth1UnitNumber = result[0].unitNumberName ? result[0].unitNumberName + (result[0].unitNumberName.includes('.') ? '' : '.') : '';

                        textbookDetailScreen.v.currentDepth2UnitSeq = '';
                        textbookDetailScreen.v.currentDepth2UnitName = '';
                        textbookDetailScreen.v.currentDepth2UnitNumber = '';
                    }
                } else {
                    // 대단원이 1개인 경우
                    textbookDetailScreen.v.currentDepth1UnitSeq = result[0].unitSeq;
                    textbookDetailScreen.v.currentDepth1UnitName = result[0].unitName;
                    textbookDetailScreen.v.currentDepth1UnitNumber = result[0].unitNumberName ? result[0].unitNumberName + (result[0].unitNumberName.includes('.') ? '' : '.') : '';

                    textbookDetailScreen.v.currentDepth2UnitSeq = '';
                    textbookDetailScreen.v.currentDepth2UnitName = '';
                    textbookDetailScreen.v.currentDepth2UnitNumber = '';
                }

                // TODO: 단원이 아예 없는 경우 추가해야함
            },

            setUnitName: async function (type) {
                let depth1UnitSeq = textbookDetailScreen.v.currentDepth1UnitSeq;
                let depth2UnitSeq = textbookDetailScreen.v.currentDepth2UnitSeq;
                let depth1UnitNumber = textbookDetailScreen.v.currentDepth1UnitNumber;
                let depth2UnitNumber = textbookDetailScreen.v.currentDepth2UnitNumber;
                let depth1UnitName = textbookDetailScreen.v.currentDepth1UnitName;
                let depth2UnitName = textbookDetailScreen.v.currentDepth2UnitName;

                if (type === 'unit') {
                    await $('#main-contents .breadcrumbs ul').html(`
                            <li><span class="number-unit">${depth1UnitNumber}</span>${depth1UnitName}</li>
                            ${depth2UnitName !== '' ? `
                            <li>${depth2UnitNumber}${depth2UnitName}</li>
                            ` : ''}
                    `)
                } else {
                    await $('#main-contents .breadcrumbs ul').html(``);
                }
            },

            handleAsideMenu: function () {
                // aside 메뉴 active 클래스 제어하기
                $('#snb .snb-inner .subject-items li').off('click').on('click', function (e) {
                    e.preventDefault();

                    // 클릭된 요소가 펼치기 버튼인 경우 이하 무시
                    if ($(e.target).is('button')) {
                        return;
                    }

                    if ($(e.target).is('a') || $(e.target).is('span')) {
                        e.stopPropagation();
                        $('#snb .snb-inner .subject-items a.active').removeClass('active');
                        $('#snb .snb-inner .subject-items span.active').removeClass('active');

                        // 대단원명이 클릭된 경우
                        if ($(e.target).data('depth') === 1) {
                            $('li[data-depth="1"]').removeClass('active');

                            if (!$(e.target).closest('li').hasClass('active')) {
                                $(e.target).closest('li .depth-2').find('> button').click();
                            }
                        } else {
                            // 클릭된 a 태그의 상위에 .hour-list 클래스가 있는지 확인 : 단원 depth 파악
                            if ($(e.target).parents('.hour-list').first().length > 0) {
                                $('li[data-depth="1"]').removeClass('active');

                                // 단원이 2depth인 경우
                                if (!$(e.target).closest('a').hasClass('active')) {
                                    $(e.target).closest('a').addClass('active');
                                }
                            } else {
                                // 단원이 1depth인 경우
                                // 현재 클릭된 단원에 active 클래스가 있는지 확인
                                if (!$(e.target).closest('li').hasClass('active')) {
                                    // 현재 클릭된 li 태그에 active 클래스 추가
                                    $(e.target).closest('li').addClass('active');

                                    if (textbookDetailScreen.v.allDepth1) {
                                        // 다른 li에서 active 클래스 해제
                                        $('#snb .snb-inner .subject-items li.active').not($(e.target).closest('li')).removeClass('active');
                                    }
                                }
                            }
                        }

                        // 선택된 아이템의 부모 혹은 부모의 부모 중에서 depth-2 클래스를 가진 li 태그를 찾음
                        const depth2div = $(e.target).closest('li').children('div.depth-2');

                        // depth-2 클래스를 가진 li 태그가 있다면 : 대단원 + 중단원 존재
                        if (depth2div.length > 0) {
                            // 첫 번째 span에서 data-unitNumberName 값을 읽어옴
                            const depth1UnitNumber = depth2div.find('span:first-child').data('unitnumbername');

                            // 두 번째 span에서 data-unitName 값을 읽어옴
                            const depth1UnitName = depth2div.find('span:nth-child(2)').data('unitname');

                            // 대단원 정보 셋팅
                            textbookDetailScreen.v.currentDepth1UnitNumber = depth1UnitNumber;
                            textbookDetailScreen.v.currentDepth1UnitName = depth1UnitName;


                            if ($(e.target).data('depth') === 1) {
                                // 대단원명 클릭된 경우, 중단원 정보 초기화
                                textbookDetailScreen.v.currentDepth2UnitNumber = '';
                                textbookDetailScreen.v.currentDepth2UnitName = '';
                            } else {
                                // 중단원명 클릭된 경우, 중단원 정보 셋팅
                                const depth2Unit = $(e.target).closest('.hour-list').children('a.active');
                                const depth2UnitNumber = depth2Unit.find('span:first-child').data('unitnumbername');
                                const depth2UnitName = depth2Unit.find('span:nth-child(2)').data('unitname');

                                textbookDetailScreen.v.currentDepth2UnitNumber = depth2UnitNumber;
                                textbookDetailScreen.v.currentDepth2UnitName = depth2UnitName;
                            }
                        } else {
                            // 대단원만 존재
                            const clickedItem = $(e.target);
                            const liElement = clickedItem.closest('li');

                            const firstSpanValue = liElement.find('span:first-child').data('unitnumbername');
                            const secondSpanValue = liElement.find('span:nth-child(2)').data('unitname');

                            // 대단원 정보 셋팅
                            textbookDetailScreen.v.currentDepth1UnitNumber = firstSpanValue;
                            textbookDetailScreen.v.currentDepth1UnitName = secondSpanValue;

                            // 중단원 정보 초기화
                            textbookDetailScreen.v.currentDepth2UnitNumber = '';
                            textbookDetailScreen.v.currentDepth2UnitName = '';

                        }

                        // 단원 클릭시 우측에 단원명 뿌려주기
                        textbookDetailScreen.f.setUnitName('unit');


                    } else {
                        console.log("error occurred.")
                    }
                });

                // 펼치기 닫았다가 열리면 active 제거
                $('.depth-2 button').on('click', function () {
                    $('#snb .snb-inner .subject-items a.active').removeClass('active');
                    $('#snb .snb-inner .subject-items span.active').removeClass('active');
                })
            },

            callTextbookDetailFunctions: async function (isPageLoad) {

                // 수정된 코드 - 중복 호출 방지를 위한 플래그 추가
                if (!this._isGetUnitListTo2DepthInProgress && !this._isGetMasterInfoInProgress) {
                    this._isGetUnitListTo2DepthInProgress = true;
                    this._isGetMasterInfoInProgress = true;

                    // 두 번째 호출
                    await textbookDetailScreen.c.getUnitListTo2Depth();

                    await textbookDetailScreen.c.getMasterInfo();

                    if (isPageLoad) {
                        textbookDetailScreen.c.getRelatedTextbookList();
                        textbookDetailScreen.f.handleAsideMenu();
                    }

                    // 중복 호출 방지 플래그 초기화
                    this._isGetUnitListTo2DepthInProgress = false;
                    this._isGetMasterInfoInProgress = false;
                }
            },

            showDetailPage: function (masterSeq) {
                // textbookDetail에서 호출할 때는 textbookDetail.mrn로 이동, 아니면 textbook/textbookDetail.mrn로 이동
                const currentPath = window.location.pathname;
                const isCurrentPathDetailPage = currentPath.includes('/textbook/textbookDetail.mrn');

                // 페이지 경로와 쿼리스트링을 조합하여 URL 생성
                let targetPage = 'textbook/textbookDetail.mrn'; // 대상 페이지
                const revisionCode = textbookDetailScreen.v.subjectRevisionCode;
                let queryString = `?masterSeq=${masterSeq}&revisionCode=${revisionCode}`; // 쿼리스트링

                if (!isCurrentPathDetailPage) {
                    targetPage = 'textbook/textbookDetail.mrn'
                }

                const protocol = location.protocol;
                const host = location.host;
                const pathNameSplit = currentPath.split("/");
                const textbookHref = `${protocol}//${host}/${pathNameSplit[1]}/${pathNameSplit[2]}/${targetPage + queryString}`

                // window.location.href에 URL 설정
                // window.location.href = targetPage + queryString;
                window.location.href = textbookHref;
            },

            // 로그인 안내 alert
            loginAlert: () => {
                $alert.open("MG00001");
            },

            // 정회원 교사만 사용 가능 alert
            needAuthAlert: () => {
                $alert.open("MG00011", () => {});
            },

            // 저작권 안내 alert
            copyrightAlert: (path) => {
                // 다운로드형 버튼을 클릭한 경우 콜백으로 다운로드 open
                $alert.open("MG00010", () => {
                    if (!path) {
                        // alert("링크가 없습니다.")
                    } else {
                        window.open(path, '_blank');
                    }
                });
            },
        },

        init: async function (event) {
            let queryString = window.location.search;
            let searchParams = new URLSearchParams(queryString);
            textbookDetailScreen.v.masterSeq = searchParams.get('masterSeq');
            await textbookDetailScreen.f.callTextbookDetailFunctions(true);
            await textbookDetailScreen.event();
        },

        event: function () {
            $(document).ready(()=>{
                tbReferenceTab.init();
            })
        }
    };

    textbookDetailScreen.init();
})
