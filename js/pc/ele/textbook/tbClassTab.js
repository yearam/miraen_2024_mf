let classScreen;

$(function () {
    classScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf classScreen
         */
        v: {
            textbookDetailHtml: '',
            masterSeq: 2,
            textbookNameList: [],
            subjectRevisionCode: '2015',
            gradeCode: '01',
            termCode: '01',
            coursewareCode: '100',
            entireClassDisplayYn: 'Y',
            subTextbookName: '',
            subTextbookPlayButtonName: '',
            favoriteUrl: '',
            favoriteName: '',
            favoriteSeq: '',
            tabType: ''
        },

        /**
         * 통신 객체- call
         *
         * @memberOf classScreen
         */
        c: {
            /**
             * 교과서 상세정보 조회
             *
             * @memberOf classScreen.c
             */
            getTextbookDetail: (type) => {
                let queryString = window.location.search;

                let searchParams = new URLSearchParams(queryString);

                // type 'snb'는 snb에서 클릭해서 호출된 경우
                if (type !== 'snb') {
                    if (searchParams.get('masterSeq')) {
                        classScreen.v.masterSeq = searchParams.get('masterSeq');
                    }
                }

                
                $('#main-contents .textbook-intro').remove(); // 상단 교과서 정보 초기화

                const options = {
                    url: '/pages/ele/textbook/textbookDetail.ax',
                    data: { masterSeq : classScreen.v.masterSeq },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookDetail response: ", res);

                        // 주교과서에 해당하는 부교과서명
                        classScreen.v.subTextbookName = res.subTextbookName ? res.subTextbookName : '';
                        classScreen.v.subTextbookPlayButtonName = res.subTextbookPlayButtonName && res.subTextbookPlayButtonName;
                        classScreen.v.textbookName = res.textbookName;
                        classScreen.v.subjectRevisionCode = res.subjectRevisionCode;
                        classScreen.v.subjectCode = res.subjectCode;
                        classScreen.v.entireClassDisplayYn = res.displayYn;

                        let ebookUseElement = '';
                        let ebookCopyElement = '';
                        let smartPptElement = '';
                        let usbDownloadElement = '';
                        let allFilesDownloadElement = '';
                        let ebookPath = '';
                        const referenceList = res.referenceList ? res.referenceList : null;

                        if (res.ebookUseYn === "Y" && res.ebookDisplayYn === "Y") {
                            const encodedPath = res.ebookFilePath?.replace(/ /g, "%20");
                            ebookUseElement = `<div class="ebook-box" data-path="${encodedPath}">
                                              <span><svg><use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use></svg></span>
                                              <p class="text-white text-xs">교과서 e-book 보기</p>
                                            </div>`

                            if (res.ebookFilePath) {
                                ebookPath = res.ebookFilePath?.replace(/ /g, "%20");
                            } else {
                                ebookPath = ''
                            }

                            ebookCopyElement = `<li>
                                                    <!-- Target -->
                                                    <input id="ebookPathInput" type="hidden" value=${ebookPath}>
                                                    <!-- Trigger -->
                                                    <button id="ebookLinkCopyBtn" data-toast="toast-copy" class="button button-md type-text" type="button" data-clipboard-target="#ebookPathInput">
                                                        <svg>
                                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-copy"></use>
                                                        </svg>
                                                        교과서 링크 복사
                                                    </button>
                                                </li>`
                        }

                        if (res.allSmartPptUseYn === "Y" && res.allSmartPptDisplayYn === "Y") {
                            const encodedPath = res.allSmartPptFilePath?.replace(/ /g, "%20");
                            smartPptElement = `<button id="smartPptDownloadBtn" class="button size-md type-primary" type="button" data-path=${encodedPath} target-obj="alert">
                                                스마트수업
                                                <svg>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-file-filled"></use>
                                                </svg>
                                            </button>`
                        }

                        if (res.usbDownloadUseYn === "Y" && res.usbDownloadDisplayYn === "Y") {
                            const encodedPath = res.usbDownloadFilePath?.replace(/ /g, "%20");
                            usbDownloadElement = `<button id="usbDownloadBtn" class="button size-md" type="button" data-path=${encodedPath}>
                                                    전자저작물
                                                    <svg>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                </button>`
                        }

                        if (res.allFilesUseYn === "Y" && res.allFilesDisplayYn === "Y") {
                            const encodedPath = res.allFilesPath?.replace(/ /g, "%20");
                            allFilesDownloadElement = `<button id="allFileDownloadBtn" class="button size-md" type="button" data-path=${encodedPath}>
                                                    전체 파일
                                                    <svg>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                </button>`
                        }

                        // 즐겨찾기용 favoriteName 설정
                        classScreen.v.favoriteName = `${res.textbookName}${res.leadAuthorName ? ` (${res.leadAuthorName})` : ''}`

                        // 즐겨찾기 url 설정
                        if (type === 'snb') {
                            let entireUrl = window.location.href;
                            let queryString = entireUrl.split('?')[1];
                            let queryParams = {};
                            if (queryString) {
                                queryParams = Object.fromEntries(new URLSearchParams(decodeURIComponent(queryString)));
                            }

                            queryParams.masterSeq = classScreen.v.masterSeq;
                            queryParams.gradeCode = classScreen.v.gradeCode;
                            queryParams.termCode = classScreen.v.termCode;
                            queryParams.revisionCode = classScreen.v.subjectRevisionCode;

                            let newUrl = entireUrl.split('?')[0] + '?' + $.param(queryParams);

                            classScreen.v.favoriteUrl = newUrl;

                            // sessionStorage.setItem('textbookUrlFromSnb', newUrl);

                        } else {
                            let entireUrl = window.location.href;
                            let urlObject = new URL(entireUrl);
                            // 특정 쿼리 매개변수(tabType) 제외
                            urlObject.searchParams.delete('tabType');
                            classScreen.v.favoriteUrl = urlObject.href;
                        }

                        classScreen.v.textbookDetailHtml = `
                              <div class="textbook-intro">
                                <div class="textbook-wrap">
                                    <a class="${res.ebookUseYn === 'Y' && res.ebookDisplayYn === "Y" ? 'book-link is-ebook' : 'book-link'}" href="javascript:void(0);">
                                        <!--!NOTE : is-ebook 클래스 있으면 호버 시 돋보기 아이콘 노출 -->
                                        ${res.coverImageFilePath ? `<img alt=${res.textbookName} src="${res.coverImageFilePath}"/>` : ''}
                                        ${ebookUseElement}
                                    </a>
                                    <div class="info-box">
                                        <div class="info-inner">
                                            <span class="badge">${res.subjectRevisionCode} 개정</span>
                                            <div class="title">
                                                <ul class="divider-group">
                                                    <li><h2>${res.textbookName}</h2></li>
                                                    ${res.leadAuthorName ? `<li><h2>(${res.leadAuthorName})</h2></li>` : ''}
                                                </ul>
                                            </div>
                                            <div class="toast"></div>
                                            <ul class="divider-group">
                                                ${ebookCopyElement}
                                                <li>
                                                  <span class="switcher">
                                                    <input id="reg-favorite" type="checkbox" data-type="eleTextbook" />
                                                    <label data-toast="toast-favorite" for="reg-favorite">즐겨찾기 등록</label>
                                                  </span>
                                                </li>
                                            </ul>
                                        </div>
                    
                                        <div class="info-buttons">
                                            ${smartPptElement}
                                            <div class="buttons">
                                                ${usbDownloadElement}
                                                ${allFilesDownloadElement}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="special-data-wrap">
                                    <div class="special-data-header">
                                        <a class="title" href="">교과서 특화자료</a>
                                        <div class="special-data-pagination">
                                            <button class="button-prev" type="button">
                                                <svg>
                                                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-left"></use>
                                                </svg>
                                            </button>
                                            <button class="button-next" type="button">
                                                <svg>
                                                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-right"></use>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="swiper special-data-body">
                                        <div class="swiper-wrapper">
<!--                                        const encodedPath = res.ebookFilePath.replace(/ /g, "%20");-->
                                        ${referenceList ? 
                                            referenceList.map(item =>
                                                `<a class="swiper-slide"
                                                    data-save-code="${item.referenceSaveCode}"
                                                    data-path="${item.path ? item.path.replace(/ /g, "%20") : item.originFileName.replace(/ /g, "%20")}" 
                                                    data-type="specialData" 
                                                    data-extension="${item.extension}"
                                                    style="cursor: pointer"
                                                >
                                                    <span class="ellipsis-single">${item.referenceName}</span>
                                                    ${(item.extension === 'LINK' || item.extension === 'link') ? `
                                                        <svg>
                                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                                        </svg>
                                                    ` : `
                                                        <svg>
                                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                        </svg>
                                                    `}
                                                </a>`
                                            ).join('')
                                        : ''}
                                        </div>
                                    </div>
                                </div>
                              </div>
                            `;

                        $('#main-contents').prepend(classScreen.v.textbookDetailHtml);

                        // 즐겨찾기 여부에 따른 토글 설정
                        if ($isLogin) {
                            if (res.favoriteCount) {
                                $('#reg-favorite').prop('checked', true);
                            } else {
                                $('#reg-favorite').prop('checked', false);
                            }
                        }

                        // 즐겨찾기 버튼 이벤트
                        $('#reg-favorite').change(function() {
                            if ($isLogin) {
                                if ($(this).is(':checked')) {
                                    classScreen.c.addFavorite('add');
                                } else {
                                    classScreen.c.updateFavorite('delete');
                                }
                            } else {
                                $('#reg-favorite').prop('checked', false);
                                classScreen.f.loginAlert();
                            }
                        })

                        // 전체 펼쳐보기 디폴트: 오픈
                        $('#folding-all').trigger('click');


                        // 특화자료 swiper 플러그인 초기화
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

                        sliderTextbookSpecialData();


                        $('a[data-type="specialData"]').on('click', function () {
                            if ($(this).data('extension').toLowerCase() !== 'link') {
                                if ($isLogin) {
                                    if ($('#userGrade').val() === '001') {
                                        classScreen.f.needAuthAlert();
                                    } else if ($('#userGrade').val() === '002') {
                                        classScreen.f.copyrightAlert($(this).data('path'));
                                    }
                                } else {
                                    classScreen.f.loginAlert();
                                }
                            } else {
                                window.open($(this).data('path'), '_blank');
                            }
                        });

                        $('.is-ebook .ebook-box').on('click', function () {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    classScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002') {
                                    let ebookPath = $(this).data('path');
                                    window.open(ebookPath, '_blank');
                                }
                            } else {
                                classScreen.f.loginAlert();
                            }
                        });

                        $('#usbDownloadBtn').on('click', function () {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    classScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002') {
                                    classScreen.f.copyrightAlert($(this).data('path'));
                                }
                            } else {
                                classScreen.f.loginAlert();
                            }
                        });

                        $('#allFileDownloadBtn').on('click', function () {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    classScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002'){
                                    let path = $(this).data('path');
                                    let encodedUrl = path?.replace(/ /g, "%20")

                                    console.log("path: ", path)
                                    console.log("encodedUrl: ", encodedUrl);

                                    classScreen.f.copyrightAlert(encodedUrl);
                                }
                            } else {
                                classScreen.f.loginAlert();
                            }
                        })

                        $('#smartPptDownloadBtn').on('click', function () {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    classScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002'){
                                    classScreen.f.copyrightAlert($(this).data('path'));
                                }
                            } else {
                                classScreen.f.loginAlert();
                            }
                        })

                        $('#ebookLinkCopyBtn').off('click').on('click', function () {
                            if (ebookPath) {
                                if ($isLogin) {
                                    if ($('#userGrade').val() === '001') {
                                        classScreen.f.needAuthAlert();
                                    } else if ($('#userGrade').val() === '002') {

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
                                    }
                                } else {
                                    classScreen.f.loginAlert();
                                }
                            }
                        })

                        if (type !== 'snb') {
                            classScreen.f.setSnbList();
                        }
                    }
                };

                $.ajax(options);

                // 단원 및 차시 목록 호출
                classScreen.c.getSubjectList();

                $('.breadcrumbs li[data-type="grade"] a').text(`${parseInt(classScreen.v.gradeCode, 10)}학년`).click(function (e) {
                    e.preventDefault();
                });

                $('.breadcrumbs li[data-type="textbook"] a').text(`${classScreen.v.textbookName}`).click(function (e) {
                    e.preventDefault();
                });

            },

            // 파일 다운로드시 사용
            getSingleFileDown: (fileId) => {
                const options = {
                    url: `/pages/api/file/down/${fileId}`,
                    method: 'GET',
                    xhrFields: {
                        responseType: 'blob'  // 서버로부터 Blob으로 응답 받기
                    },
                    success: function(data, textStatus, jqXHR) {
                        let fileName = classScreen.f.getFileNameFromResponse(jqXHR);  // 응답 헤더에서 파일 이름 추출

                        let blob = data;

                        // 다운로드 링크를 생성
                        let downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = fileName || 'downloaded_file';  // 다운로드될 파일의 이름을 설정
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Failed to fetch file');
                    }
                };

                $.ajax(options);

            },

            getTextbookList: (type) => {
                const options = {
                    url: '/pages/ele/textbook/textbookList.ax',
                    data: {
                        // subjectRevisionCode: classScreen.v.subjectRevisionCode,
                        gradeCode: classScreen.v.gradeCode,
                        termCode: classScreen.v.termCode,
                    },
                    method: 'GET',
                    async: false,
                    success: function (res) {
                        let queryString = window.location.search;
                        let searchParams = new URLSearchParams(queryString);

                        let tempList = '';
                        let textbookNameList = '';
                        let textbookNameListElement = '';

                        // snb에서 클릭한 게 아니라 교과활동 메뉴에서 클릭해서 들어온 경우
                        let masterSeq = parseInt(searchParams.get('masterSeq'), 10)
                        let gradeCode = classScreen.v.gradeCode;
                        let termCode = classScreen.v.termCode;
                        let revisionCode = classScreen.v.subjectRevisionCode;

                        // res 배열을 ordering 값에 따라 오름차순으로 정렬
                        res.sort((a, b) => a.ordering - b.ordering);

                        $('.snb-inner .subject-items').remove(); // 교과서 이름 리스트 초기화

                        $.each(res, function (index, item) {
                            let author = (item.leadAuthorName !== null && item.leadAuthorName !== undefined) ? item.leadAuthorName : null;
                            tempList = `
                                <li ${item.masterSeq === masterSeq ? 'class="active"' : ''} 
                                  data-masterseq=${item.masterSeq} 
                                  data-class-display-yn="${item.displayYn}">
                                  <a href="#">${item.textbookName} ${author !== "" && author !== null && author !== undefined ? `(${author})` : ''}</a>
                                </li>
                            `
                            textbookNameList += tempList
                        })

                        if (classScreen.v.gradeCode === '06') {
                            textbookNameList += `
                                <li ${masterSeq === 111 ? 'class="active"' : ''} data-masterseq="111" data-class-display-yn="Y">
                                  <a href="#">사회과 부도 5~6 (전종한)</a>
                                </li>`
                        }

                        textbookNameListElement = `
                            <ul class="subject-items">
                            ${textbookNameList}
                            </ul>
                        `

                        $('.snb-inner').append(textbookNameListElement);

                        // snb에서 교과서 클릭했을 경우 디테일 뿌려주기
                        $('.snb-inner > ul > li').on('click', function() {
                            classScreen.v.masterSeq = $(this).data('masterseq');
                            classScreen.f.handleSnbTextbookClick($(this));

                            const targetPage = '/pages/ele/textbook/textbookDetail.mrn';
                            let masterSeq = classScreen.v.masterSeq
                            const gradeCode = classScreen.v.gradeCode;
                            const termCode = classScreen.v.termCode;
                            const revisionCode = classScreen.v.subjectRevisionCode
                            let tabType = '';

                            let queryString2 = window.location.search;
                            let regex = /[?&]tabType=([^&#]*)/;
                            let match = regex.exec(queryString2);

                            if (match !== null) {
                                tabType = decodeURIComponent(match[1].replace(/\+/g, ' '));
                                console.log("tabType 값:", tabType);
                            } else {
                                console.log("tabType 값이 존재하지 않습니다.");
                            }

                            let queryString = `?masterSeq=${masterSeq}&gradeCode=${gradeCode}&termCode=${termCode}&revisionCode=${revisionCode}&tabType=${tabType}`;

                            window.location.href = targetPage + queryString;
                        });

                        if (type === 'snb') {
                            // 목록의 첫번째 아이템 클릭
                            $('.snb-inner > ul > li:first-child').click();
                        }
                    },
                }

                $.ajax(options);
            },


            // 즐겨찾기 추가
            addFavorite: (type) => {
                let dataObj = {};
                if (type === "add") {
                    dataObj = {
                        favoriteType: 'MRN',
                        referenceSeq: classScreen.v.masterSeq,
                        favoriteName: classScreen.v.favoriteName, // 교과서이름(저자명)
                        favoriteUrl: classScreen.v.favoriteUrl, // 교과서 디테일 url
                        useYn: 'Y',
                    }
                }
                const options = {
                    url: '/pages/api/mypage/addFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function(res) {
                        classScreen.v.favoriteSeq = res.returnInt;

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
                        referenceSeq: classScreen.v.masterSeq,
                    }
                }

                const options = {
                    url: '/pages/api/mypage/updateFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function(res) {
                        console.log(res);
                        $toast.open("toast-favorite", "MG00039");
                        $quick.getFavorite();
                    },
                };

                $.ajax(options);
            },


            // getUnitCommonRefList: (unitSeq, webuiTarget) => {
            //     const options = {
            //         url: '/pages/ele/textbook/class/unitCommonRefList.ax',
            //         data: {
            //             masterSeq: classScreen.v.masterSeq,
            //             unitSeq: unitSeq,
            //         },
            //         method: 'GET',
            //         async: false,
            //         success: function(res) {
            //             console.log('getUnitCommonRefList called');
            //             let unitCommonRefElement = '';
            //             let refItem = '';
            //
            //             res?.map(function (item, index) {
            //                 refItem += `
            //                     <!-- split여부에 따라 나눠짐 -->
            //
            //                     <li>
            //                       <a href="javascript:void(0);"
            //                       data-extension="${item.extension}"
            //                       data-fileid="${item.referenceFileId}"
            //                       data-path="${item.path}">
            //                       ${item.extension && item.extension === 'youtube' ? `
            //                       <img src="/assets/images/common/icon-youtube.svg" alt="자료아이콘">
            //                       ` : `
            //                       <img src="/assets/images/common/${$extension.extensionToIcon(item.extension)}" alt="자료아이콘">
            //                       `}
            //                         <p>${item.referenceName}</p>
            //                       </a>
            //                     </li>
            //                 `
            //             })
            //
            //             unitCommonRefElement = `
            //                 <div class="">
            //                   <ul class="unit-list-items">
            //                   ${refItem}
            //                   </ul>
            //                 </div>
            //             `
            //
            //             // 가져온 unitSeq 값에 따라 다른 작업 수행
            //             // $('.webui-popover-content').html(unitCommonRefElement);
            //             $(`#${webuiTarget} .webui-popover-content`).html(unitCommonRefElement);
            //
            //             $('.unit-list-items li a').on('click', function () {
            //                 if ($('#userGrade').val() === '002') {
            //                     let refFileId = $(this).data('fileid');
            //                     let path = $(this).data('path')
            //                     let extension = $(this).data('extension')
            //
            //                     console.log(`refFileId: ${refFileId}, path: ${path}`);
            //
            //                     classScreen.f.downloadOrLink(extension, refFileId, path);
            //                 } else {
            //                     classScreen.f.needAuthAlert();
            //                 }
            //
            //             })
            //         },
            //     };
            //
            //     $.ajax(options);
            // },

            getSubjectList: () => {
                const options = {
                    url: '/pages/ele/textbook/class/subjectList.ax',
                    data: {
                        masterSeq: classScreen.v.masterSeq,
                        coursewareCode: classScreen.v.coursewareCode
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("getSubjectList result: ", res);
                        $('#tab2-1 .accordion ul li').remove(); // 리스트 초기화

                        let tempSubjectList = '';
                        let subjectListElement = ''
                        let groupedData = [];
                        let eachSubjectList = '';

                        res.sort((a, b) => {
                            return a.sort.localeCompare(b.sort, undefined, { numeric: true, sensitivity: 'base' })
                        })

                        // 결과 배열을 순회하면서 그룹화
                        res.forEach((item, index) => {
                            // 정렬값에서 맨 앞자리를 추출하여 그룹 키로 사용
                            let groupKey = item.sort.split('-')[0];

                            // 해당 그룹이 존재하지 않으면 새로운 배열로 초기화
                            if (!groupedData[groupKey]) {
                                groupedData[groupKey] = [];
                            }

                            groupedData[groupKey].push(item);

                            // 현재 값이 이전 값보다 길이가 작은 경우 isLastItem을 true로 설정
                            if (index > 0 && item.sort.length <= res[index - 1].sort.length) {
                                res[index - 1].isLastItem = true;
                            }

                            // depth에 따라 unitNumber에 값을 할당
                            switch (item.depth) {
                                case 1:
                                    item.unitNumber = parseInt(item.sort.split('-')[0]);
                                    break;
                                case 2:
                                    item.unitNumber = parseInt(item.sort.split('-')[1]);
                                    break;
                                case 3:
                                    item.unitNumber = parseInt(item.sort.split('-')[2]);
                                    break;
                                default:
                                    break;
                            }
                        });

                        // 객체를 배열로 변환
                        let result = Object.values(groupedData);

                        // '등록된 자료가 없습니다' 띄우는 논리
                        // sort 값의 길이가 줄어드는 경우 + subjectList가 빈배열인 경우 !
                        //              --> isLastItem : true
                        // 아예 마지막 아이템의 경우에는 다음 sort 없음
                        //              --> 마지막 아이템 여부 + subjectList가 빈배열인 경우로 체크
                        // 차시가 있는 경우 --> 차시 목록 출력


                        let recentElement = `
                        <span class="badge-recently">
                            최근
                        </span>`

                        let openClassUnitSeq = '';
                        let openClassSubjectSeq = '';
                        let openClassElement = `
                            <li>
                                <button class="button size-md type-text" data-btnname="openclass" data-subjectseq="${openClassSubjectSeq}" data-unitseq="openClassUnitSeq">
                                    <svg>
                                        <title>아이콘 - icon-link-new-window</title>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                    </svg>
                                    수업열기
                                </button>
                            </li>
                        `


                        // 초기화
                        $('#tab2-1 .accordion ul.chapter-items').html('');

                        // 대단원 loop > 중/소단원 loop 렌더
                        $.each(result, function (outerIndex, outerItem) {
                            tempSubjectList = '' // 초기화

                            // 중/소단원/차시 loop
                            $.each(outerItem, function(innerIndex, innerItem) {
                                tempSubjectList += `
                                  <!-- (분류)단원 -->
                                  ${innerItem.depth === 1 ? `
                                    <a href="#" class="chapter-depth action">
                                        <div class="header-wrap">
                                          <!-- 대단원 -->
                                          <span class="number-unit">${innerItem.unitNumberName? `${innerItem.unitNumberName}.` : ''}</span>
                                          <h3>${innerItem.unitName}</h3>
                                        </div>
                                        ${innerItem.unitCommonRefCnt > 0 ? `
                                            <div class="extra">
                                                <button type="button" class="button size-md tooltip-trigger" data-unitseq="${innerItem.unitSeq}" data-title="단원공통자료" data-placement="bottom-left" data-style="unit-list" data-backdrop="" data-focus="" data-target="webuiPopover1">
                                                    단원공통자료
                                                    <svg>
                                                      <title>아이콘 - 자료</title>
                                                      <use href="/assets/images/svg-sprite-solid.svg#icon-folder"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        ` : ''}
                                    </a>
                                    <div class="pane" style="display: block">
                                          ${(innerItem.isLastItem === true && innerItem.subjectList.length === 0)
                                            || (innerIndex === outerItem.length - 1 && innerItem.subjectList.length === 0) // 해당 교과의 마지막 순서의 단원이면서 차시목록이 비어있는 경우
                                            ?
                                            `<div class="box-no-data">
                                              등록된 자료가 없습니다.
                                            </div>` :
                                            (innerItem.subjectList.map(function (subject) {
                                                // 시작/끝 차시가 없으면 차시명만 노출
                                                // 1. singleSubjectYN이 Y인 경우
                                                let singleSubjectInfo = subject.startSubject ? `[${subject.startSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;
          
                                                // 2. singleSubjectYN이 N인 경우
                                                let subjectInfo = subject.startSubject && subject.endSubject ? `[${subject.startSubject}~${subject.endSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;
                                                
                                                <!-- 차시(주제) 목록-->
                                                return `<ul class="hour-list">
                                                    <!--'교과서자료' 유형의 차시만 노출-->
                                                    <li>
                                                        <div class="header-wrap">
                                                            ${subject.coursewareKindCode === "100" ? `
                                                                <div class="badges">
                                                                    <span class="badge type-round-box fill-skyblue" title="교과서자료">교과서자료</span>
                                                                </div>`
                                                            : `
                                                                <div class="badges">
                                                                <span class="badge type-round-box fill-purple" title="교과서자료">비주얼씽킹</span>
                                                                </div>
                                                            `}
                                                            ${subject.singleSubjectUseYn === "Y" ? `
                                                                    <a href="" class="title" style="cursor: default">${singleSubjectInfo}</a>`
                                                            : `<a href="" class="title" style="cursor: default">${subjectInfo}</a>`}
                                                            ${classScreen.v.subTextbookName === '' ? `
                                                                <!-- 부교과서 X -->
                                                                ${subject.textbookPageUseYn === 'Y' ? `
                                                                    <div class="number-pages">
                                                                         <span class="badge fill-light">
                                                                          ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                        </span>
                                                                    </div>
                                                                    ${subject.mySubjectYn === "Y" ? 
                                                                        recentElement
                                                                    : ''}
                                                                `: ''}
                                                                ` : `
                                                                <!-- 부교과서 O && 부교과서 페이지 사용 O-->
                                                                 ${subject.subPageUseYn === "Y" && subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                            <span class="badge fill-light">
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.subPageUseYn === "Y" ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : ''}
                                                            `}

                                                        </div>
                                                        <div class="extra">
                                                            <ul class="divider-group">
                                                                <!-- subTextbookPlayUseYn === "Y" 여부 체크해서 부교과서 수업버튼 노출 -->
                                                                ${classScreen.v.entireClassDisplayYn === "Y" && subject.subTextbookPlayUseYn === 'Y' ? `
                                                                    <li>
                                                                        <button class="button size-md type-text" data-btnname="opensubclass" data-reference-path="${subject.referenceUrl}">
                                                                            <svg>
                                                                                <title>아이콘 - icon-link-new-window</title>
                                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                                                            </svg>
                                                                            ${subject.subTextbookPlayButtonName ? subject.subTextbookPlayButtonName : subject.simpleSubTextbookName}
                                                                        </button>
                                                                    </li>` : ''}
                                                                ${classScreen.v.entireClassDisplayYn === "Y" && subject.classOpenYn === "Y" ? `
                                                                    <li>
                                                                        <button class="button size-md type-text" data-btnname="openclass" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}">
                                                                        <svg>
                                                                        <title>아이콘 - icon-link-new-window</title>
                                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                                                        </svg>수업열기
                                                                        </button>
                                                                    </li>
                                                                 ` : ''}
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>`
                                            }).join('') || '')}
                                    </div>
                                      ` : innerItem.depth === 2 ? `
                                    <!-- !NOTE : 중분류엔 type-middle , 소분류엔 type-small 이 붙습니다. -->
                                    <!-- 중단원이 있을 때 이하 show -->
                                    <div class="pane" style="display: block">
                                        <div class="chapter-depth type-middle">
                                          <div class="title">${innerItem.unitNumberName ? `${innerItem.unitNumberName}.` : ''} ${innerItem.unitName}</div>
                                          ${innerItem.unitCommonRefCnt > 0 ? `
                                            <div class="extra">
                                                <button type="button" class="button size-md tooltip-trigger" data-unitseq="${innerItem.unitSeq}" data-title="단원공통자료" data-placement="bottom-left" data-style="unit-list" data-backdrop="" data-focus="" data-target="webuiPopover1">
                                                    단원공통자료
                                                    <svg>
                                                      <title>아이콘 - 자료</title>
                                                      <use href="/assets/images/svg-sprite-solid.svg#icon-folder"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        ` : ''}
                                        </div>
                                        ${(innerItem.isLastItem === true && innerItem.subjectList.length === 0)
                                || (innerIndex === outerItem.length - 1 && innerItem.subjectList.length === 0)
                                    ?
                                    `<div class="box-no-data">
                                                  등록된 자료가 없습니다.
                                        </div>` :
                                    (innerItem.subjectList.map(function (subject) {
                                        // 1. singleSubjectYN이 Y인 경우
                                        let singleSubjectInfo = subject.startSubject ? `[${subject.startSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;

                                        // 2. singleSubjectYN이 N인 경우
                                        let subjectInfo = subject.startSubject && subject.endSubject ? `[${subject.startSubject}~${subject.endSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;

                                        <!-- 차시(주제) 목록-->
                                        return `<ul class="hour-list">
                                                    <!--'교과서자료' 유형의 차시만 노출-->
                                                    <li>
                                                        <div class="header-wrap">
                                                            ${subject.coursewareKindCode === "100" ? `
                                                                <div class="badges">
                                                                    <span class="badge type-round-box fill-skyblue" title="교과서자료">교과서자료</span>
                                                                </div>`
                                                            : `
                                                                <div class="badges">
                                                                <span class="badge type-round-box fill-purple" title="교과서자료">비주얼씽킹</span>
                                                                </div>
                                                            `}
                                                            ${subject.singleSubjectUseYn === "Y" ? `
                                                                <a href="" class="title" style="cursor: default">${singleSubjectInfo}</a>`
                                                            : `<a href="" class="title" style="cursor: default">${subjectInfo}</a>`}
                                                            ${classScreen.v.subTextbookName === '' ? `
                                                                    <!-- 부교과서 X -->
                                                                    <div class="number-pages">
                                                                         <span class="badge fill-light">
                                                                          ${subject.simpleTextbookName} ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.textbookStartPage}p` : ''}
                                                                        </span>
                                                                    </div>
                                                                    ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : `
                                                                    <!-- 부교과서 O && 부교과서 페이지 사용 O-->
                                                                      ${subject.subPageUseYn === "Y" && subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                            <span class="badge fill-light">
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.subTextbookStartPage} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.subPageUseYn === "Y" ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.subTextbookStartPage} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : ''}
                                                            `}

                                                        </div>
                                                        <div class="extra">
                                                            <ul class="divider-group">
                                                                <!-- subTextbookPlayUseYn === "Y" 여부 체크해서 부교과서 수업버튼 노출 -->
                                                                ${classScreen.v.entireClassDisplayYn === "Y" && subject.subTextbookPlayUseYn === 'Y' ? `
                                                                    <li>
                                                                        <button class="button size-md type-text" data-btnname="opensubclass" data-reference-path="${subject.referenceUrl}">
                                                                            <svg>
                                                                                <title>아이콘 - icon-link-new-window</title>
                                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                                                            </svg>
                                                                            ${subject.subTextbookPlayButtonName ? subject.subTextbookPlayButtonName : subject.simpleSubTextbookName}
                                                                        </button>
                                                                    </li>` : ''}
                                                                ${classScreen.v.entireClassDisplayYn === "Y" && subject.classOpenYn === "Y" ? `
                                                                    <li>
                                                                        <button class="button size-md type-text" data-btnname="openclass" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}">
                                                                        <svg>
                                                                        <title>아이콘 - icon-link-new-window</title>
                                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                                                        </svg>수업열기
                                                                        </button>
                                                                    </li>
                                                                 ` : ''}
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>`
                                          }).join('') || '')}
                                    </div>
                                        ` : innerItem.depth === 3 
                                        ? `
                                            <!-- 소단원이 있을 때 show -->
                                            <div class="pane" style="display: block">
                                                <div class="chapter-depth type-small">
                                                  <div class="title">${innerItem.unitNumberName? `${innerItem.unitNumberName}.` : ''} ${innerItem.unitName}</div>
                                                  ${innerItem.unitCommonRefCnt > 0 ? `
                                                    <div class="extra">
                                                        <button type="button" class="button size-md tooltip-trigger" data-unitseq="${innerItem.unitSeq}" data-title="단원공통자료" data-placement="bottom-left" data-style="unit-list" data-backdrop="" data-focus="" data-target="webuiPopover1">
                                                            단원공통자료
                                                            <svg>
                                                              <title>아이콘 - 자료</title>
                                                              <use href="/assets/images/svg-sprite-solid.svg#icon-folder"></use>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    ` : ''}
                                                </div>
                                                ${(innerItem.isLastItem === true && innerItem.subjectList.length === 0)
                                                || (innerIndex === outerItem.length - 1 && innerItem.subjectList.length === 0)
                                                    ?
                                                    `<div class="box-no-data">
                                                      등록된 자료가 없습니다.
                                                    </div>` 
                                                    : 
                                                    `<ul class="hour-list">
                                                        ${innerItem.subjectList.map(function (subject) {
                                                            // 1. singleSubjectYN이 Y인 경우
                                                            let singleSubjectInfo = subject.startSubject ? `[${subject.startSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;
    
                                                            // 2. singleSubjectYN이 N인 경우
                                                            let subjectInfo = subject.startSubject && subject.endSubject ? `[${subject.startSubject}~${subject.endSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;
                                                        
                                                            // 차시(주제) 목록
                                                            return subject.coursewareKindCode === "100" ?
                                                            `<li>
                                                            <div class="header-wrap">
                                                                ${subject.coursewareKindCode === "100" ? `
                                                                    <div class="badges">
                                                                        <span class="badge type-round-box fill-skyblue" title="교과서자료">교과서자료</span>
                                                                    </div>`
                                                                    : `
                                                                    <div class="badges">
                                                                    <span class="badge type-round-box fill-purple" title="교과서자료">비주얼씽킹</span>
                                                                    </div>
                                                                `}
                                                                ${subject.singleSubjectUseYn === "Y" ? `
                                                                    <a href="" class="title" style="cursor: default">${singleSubjectInfo}</a>`
                                                                    : `<a href="" class="title" style="cursor: default">${subjectInfo}</a>`}
                                                                ${classScreen.v.subTextbookName === '' ? `
                                                                    <!-- 부교과서 X -->
                                                                    <div class="number-pages">
                                                                         <span class="badge fill-light">
                                                                          ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                        </span>
                                                                    </div>
                                                                    ${subject.mySubjectYn === "Y" ?
                                                                    recentElement
                                                                    : ''}
                                                                    ` : `
                                                                    <!-- 부교과서 O && 부교과서 페이지 사용 O-->
                                                                     ${subject.subPageUseYn === "Y" && subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                            <span class="badge fill-light">
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.subPageUseYn === "Y" ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span class="badge fill-light">
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${classScreen.v.textbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${classScreen.v.textbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : ''}
                                                                `}
                                                            </div>
                                                            <div class="extra">
                                                                <ul class="divider-group">
                                                                    <!-- subTextbookPlayUseYn === "Y" 여부 체크해서 부교과서 수업버튼 노출 -->
                                                                    ${classScreen.v.entireClassDisplayYn === "Y" && subject.subTextbookPlayUseYn === 'Y' ? `
                                                                        <li>
                                                                            <button class="button size-md type-text" data-btnname="opensubclass" data-reference-path="${subject.referenceUrl}">
                                                                                <svg>
                                                                                    <title>아이콘 - icon-link-new-window</title>
                                                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                                                                </svg>
                                                                                ${subject.subTextbookPlayButtonName ? subject.subTextbookPlayButtonName : subject.simpleSubTextbookName}
                                                                            </button>
                                                                        </li>` : ''}
                                                                    ${classScreen.v.entireClassDisplayYn === "Y" && subject.classOpenYn === "Y" ? `
                                                                        <li>
                                                                            <button class="button size-md type-text" data-btnname="openclass" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}">
                                                                            <svg>
                                                                            <title>아이콘 - icon-link-new-window</title>
                                                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                                                            </svg>수업열기
                                                                            </button>
                                                                        </li>
                                                                     ` : ''}
                                                                </ul>
                                                            </div>
                                                        </li>` : ''
                                                        }).join('')} 
                                                    </ul>`}
                                            </div>
                                        ` : ''}
                                    </div>
                                `
                            })


                            $('#tab2-1 .accordion ul.chapter-items').append(`<li data-type="firstLi" class="active">${tempSubjectList}</li>`);

                            // 단원공통자료 제어파트
                            $('.tooltip-trigger').each(function(idx, el){
                                const unitSeq = $(el).data('unitseq');
                                $(el).webuiPopover({
                                    type: 'async',
                                    url: '/pages/ele/textbook/class/unitCommonRefList.ax?masterSeq=' + classScreen.v.masterSeq + '&unitSeq=' + unitSeq,
                                    multi:true,
                                    backdrop: $(el).is("[data-backdrop]") ? true : false,
                                    closeable:true,
                                    style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
                                    container: $(el).is("[data-container]") ? `${$(el).attr("data-container")}` : false,
                                    onShow: function(){
                                        if($(el).is("[data-focus]")){
                                            $(el).addClass('focus');
                                        }
                                    },
                                    onHide: function(){
                                        if($(el).is("[data-focus]")){
                                            $(el).removeClass('focus');
                                        }
                                    },
                                    content: function (res) {
                                        console.log("e==========단원 공통자료으~ ==?res", res)
                                        let unitCommonRefElement = '';
                                        let refItem = '';
                                        const webuiTarget = $(this).data("target");

                                        res?.map(function (item, index) {
                                            refItem += `
                                <!-- split여부에 따라 나눠짐 -->

                                <li>
                                  <a href="javascript:void(0);" 
                                  data-extension="${item.extension}" 
                                  data-fileid="${item.referenceFileId}" 
                                  data-seq="${item.referenceSeq}" 
                                  data-path="${item.path}"
                                  data-source="${item.uploadMethod}"
                                  data-type="${item.cmsType}">
                                  ${item.extension && item.extension === 'youtube' ? `
                                  <img src="/assets/images/common/icon-youtube.svg" alt="자료아이콘">
                                  ` : `
                                  <img src="/assets/images/common/${$extension.extensionToIcon(item.extension)}" alt="자료아이콘">
                                  `}
                                    <p>${item.referenceName}</p>
                                  </a>
                                </li>
                            `
                                        })

                                        unitCommonRefElement = `
                            <div class="">
                              <ul class="unit-list-items">
                              ${refItem}
                              </ul>
                            </div>      
                        `

                                        // 가져온 unitSeq 값에 따라 다른 작업 수행
                                        // $('.webui-popover-content').html(unitCommonRefElement);
                                        $(`#${webuiTarget} .webui-popover-content`).html(unitCommonRefElement);

                                        $('.unit-list-items li a').on('click', function () {
                                            if ($('#userGrade').val() === '002') {
                                                let refFileId = $(this).data('fileid');
                                                let path = $(this).data('path')
                                                let extension = $(this).data('extension')
                                                let seq = $(this).data('seq');
                                                let source = $(this).data('source') || 'CMS';
                                                let type = $(this).data('type') || '';

                                                if(type == 'video'){
                                                    const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${refFileId}&referenceSeq=${seq}&type=TEXTBOOK`;
                                                    screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview");
                                                }else{
                                                    classScreen.f.downloadOrLink(extension, refFileId, path);
                                                }
                                            } else {
                                                classScreen.f.needAuthAlert();
                                            }

                                        })
                                    }
                                })
                            })
                        })

                        // 차시명 클릭 및 hover 막음
                        classScreen.f.preventEvent();

                        // 수업열기 버튼 이벤트
                        $('button[data-btnname="openclass"]').on('click', function() {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    classScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002'){
                                    // TO-BE 차시창 사용
                                     const classLayerUrl = '/pages/ele/textbook/classLayer.mrn';
                                     const masterSeq = classScreen.v.masterSeq;
                                     const subjectSeq = $(this).data('subjectseq');
                                     const revisionCode = classScreen.v.subjectRevisionCode;
                                    
                                     const urlWithParameters = `${classLayerUrl}?masterSeq=${masterSeq}&subjectSeq=${subjectSeq}&revisionCode=${revisionCode}`;
                                     window.open(urlWithParameters, '_blank');
                                
                                    //let ticket = $('input[name="ticket"]').val();

                                    //// AS-IS 차시창 사용
                                    //let classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
                                    //const subjectSeq = $(this).data('subjectseq');
                                    //let urlWithParameters = `${classLayerUrl}${subjectSeq}&ticket=${ticket}`;
                                    //if(document.location.host == 'deve.m-teacher.co.kr' || document.location.host == 'localhost:8100' ){ // 로컬 OR dev 인 경우
                                    //    classLayerUrl = 'https://devele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
                                    //}
                                    //const lessonSeq = $(this).data('lessonseq') || '';
                                    //if(lessonSeq != ''){ // 2022년 개정교과의 경우 차시번호가 맞지 않아 구엠티처 차시번호 사용.
                                    //    urlWithParameters = `${classLayerUrl}${lessonSeq}&ticket=${ticket}`;
                                    //}
                                    //window.open(urlWithParameters, '_blank');
                                }
                            } else {
                                classScreen.f.loginAlert();
                            }
                        });

                        // 부교과서 수업열기 버튼 이벤트
                        $('button[data-btnname="opensubclass"]').on('click', function() {
                            if ($isLogin) {
                                if ($('#userGrade').val() === '001') {
                                    classScreen.f.needAuthAlert();
                                } else if ($('#userGrade').val() === '002'){
                                    let referencePath = $(this).data('reference-path');
                                    let parameter;

                                    if (classScreen.v.subjectCode === 'KOA' || classScreen.v.subjectCode === 'KOB' || classScreen.v.subjectCode === 'KO') {
                                        parameter = 'k&indexclose=N';
                                    } else if (classScreen.v.subjectCode === 'MA') {
                                        parameter = 'm&indexclose=N';
                                    } else if (classScreen.v.subjectCode === 'SC') {
                                        parameter = 's&indexclose=N';
                                    }

                                    let keyword = "filerole=";
                                    let startIndex = referencePath.indexOf(keyword);
                                    let fileroleValue = referencePath.substring(startIndex + keyword.length);

                                    // 변환된 URL
                                    let convertedUrl = referencePath.replace("filerole=" + fileroleValue, `filerole=${parameter}`);
                                    convertedUrl += '&user='+cmmUserIdx;

                                    window.open(convertedUrl, '_blank');
                                }
                            } else {
                                classScreen.f.loginAlert();
                            }
                        });
                    }
                };

                $.ajax(options);
            },
        },

        /**
         * 내부 함수
         *
         * @memberOf classScreen
         */
        f: {
            getFileNameFromResponse(xhr) {
                let contentDispositionHeader = xhr.getResponseHeader('Content-Disposition');
                if (contentDispositionHeader) {
                    let match = contentDispositionHeader.match(/filename="(.+)"/);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
                return null;
            },

            setSnbList: function () {
                // 현재 URL에서 쿼리스트링 부분을 가져오기
                let queryString = window.location.search;
                let searchParams = new URLSearchParams(queryString);

                let masterSeq = searchParams.get('masterSeq');
                let grade = searchParams.get('gradeCode')?.replace(/^0+/, "");
                let term = searchParams.get('termCode')?.replace(/^0+/, "");
                $('.snb-header .dropdown button').html(`${grade}학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`);

                // snb에서 현재 학기 active
                if (term === '1') {
                    $('.snb-inner .divider-group li:first-child > button').addClass('active');
                    $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');
                } else {
                    $('.snb-inner .divider-group li:nth-child(2) > button').addClass('active');
                    $('.snb-inner .divider-group li:not(:nth-child(2)) > button').removeClass('active');
                }

                // 교과서 이름 목록 호출
                classScreen.v.masterSeq = masterSeq;
                classScreen.v.gradeCode = searchParams.get('gradeCode');
                classScreen.v.termCode = searchParams.get('termCode');
                classScreen.v.subjectRevisionCode = searchParams.get('revisionCode');

                classScreen.c.getTextbookList();
            },

            handleSnbTextbookClick: function (clickElement) {

                clickElement.addClass('active');
                $('.snb-inner > ul > li').not(clickElement).removeClass('active');
                // classScreen.v.masterSeq = $(this).data('masterseq');
                classScreen.c.getTextbookDetail('snb');
            },

            downloadOrLink: function(extension, fileId, path) {
                console.log("extension: " + extension);
                let link;
                switch (extension) {
                    case "png" :
                    case "jpg" :
                    case "jpeg" :
                    case "webp" :
                    case "pdf" :
                    case "hwp" :
                    case "xlsx" :
                    case "pptx" :
                    case "docx" :
                    case "zip" :
                    case "txt" :
                    case "webp" :
                        link = document.createElement('a');
                        link.target = '_blank';
                        link.href = `/pages/api/file/down/${fileId}`;
                        link.click();
                        link.remove();
                        break;
                    case "link" :
                        window.open(path, "_blank");
                        break;
                    default :
                        if (path !== undefined && path !== "") {
                            window.open(path, "_blank");
                        } else {
                            let link = document.createElement('a');
                            link.target = '_blank';
                            link.href = `/pages/api/file/down/${fileId}`;
                            link.click();
                            link.remove();
                        }
                }
            },

            // 차시명 클릭 이벤트 및 포인터 변경 막는 이벤트
            preventEvent: function () {
                let subjectTag = $('.hour-list > li .title');

                subjectTag.on('mouseover', function(event) { // css 파일때문에 적용되지 않음
                    event.preventDefault();
                    event.stopPropagation();
                });

                subjectTag.on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            },

            // 메인에서 수업하기 버튼 or 평가자료 클릭한 경우
            setClassOrReferenceTab: function () {
                // 현재 URL에서 쿼리 문자열 가져오기
                let queryString = window.location.search;
                let regex = /[?&]tabType=([^&#]*)/;
                let match = regex.exec(queryString);
                let tabTypeValue

                if (match !== null) {
                    tabTypeValue = decodeURIComponent(match[1].replace(/\+/g, ' '));
                    classScreen.v.tabType = tabTypeValue;
                    console.log("tabType 값:", tabTypeValue);
                } else {
                    console.log("tabType 값이 존재하지 않습니다.");
                }

                // tabType이 있는 경우에만 => 모든 탭에서 active 클래스 제거
                if (tabTypeValue) {
                    $('.tabs [data-tab-index]').removeClass('active');

                    // tabType이 classTab인 경우
                    if (tabTypeValue === 'classTab') {
                        $('.tabs li[data-tab-index="tab1"]').addClass('active');
                    }
                    // tabType이 referenceTab인 경우
                    else if (tabTypeValue === 'referenceTab') {
                        $('.tabs li[data-tab-index="tab2"]').addClass('active');

                        $(document).ready(async ()=>{
                            await $('.tabs li[data-tab-index="tab2"] a').trigger('click');
                            $('#categoryTab ul li a').eq(1).trigger('click');
                        })

                        $('.breadcrumbs li[data-type="page"]').text('평가자료');
                    }
                }

                // 아래 교과서 수업하기 탭 숨기기
                // masterSeq: 3학년 미술 41, 3학년 체육 45, 3학년 도덕 88
                // masterSeq: 4학년 미술 42, 4학년 체육 46, 4학년 도덕 89
                // masterSeq: 5학년 미술 43, 5학년 체육 47, 5학년 도덕 90
                // masterSeq: 6학년 미술 44, 6학년 체육 48, 6학년 도덕 91
                // masterSeq: 5~6학년 사회과부도 111

                let searchParams = new URLSearchParams(queryString);
                let masterSeq = parseInt(searchParams.get('masterSeq'));

                const disableMasterSeq = [41, 42, 43, 44, 45, 46, 47, 48, 88, 89, 90, 91, 111]

                if (disableMasterSeq.includes(masterSeq)) {
                    console.log("현재 masterSeq: ", masterSeq);

                    // 자료 모아보기 tab에 active 하고 클릭하기
                    $('.tabs li[data-tab-index="tab1"]').removeClass('active');
                    $('.tabs li[data-tab-index="tab2"]').addClass('active');

                    $(document).ready(()=>{
                        $('.tabs li[data-tab-index="tab2"] a').trigger('click');
                    })

                    $('.theme-elementary .tabs > #textbookActiveTab').css('display', 'none');
                }
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
                console.log("path: ", path)
                $alert.open("MG00010", () => {
                    if (!path) {
                        // alert("링크가 없습니다.")
                    } else {
                        window.open(path, '_blank');
                    }
                });
            },
        },

        init: function () {
            classScreen.c.getTextbookDetail();
            classScreen.f.setClassOrReferenceTab();

            if ($('.badge-recently').length > 0 && classScreen.v.tabType === 'classTab') {
                let closestLi = $(".badge-recently").closest('li[data-type="firstLi"]');

                closestLi.addClass('active');
                closestLi.find('.pane').css('display', 'block');

                let headerHeight = $('header').outerHeight(); // 헤더의 높이를 가져옴

                $(".badge-recently").get(0).scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest"
                });

                // 헤더의 높이만큼 스크롤을 위로 조정
                $('html, body').animate({
                    scrollTop: $('.badge-recently').offset().top - headerHeight
                }, 500); // 500은 애니메이션 속도 조절, 필요에 따라 수정
            }
            classScreen.event();
        },
        event: function () {

            // snb 학기 클릭시 교과서 목록 새로 가져오기
            $('.snb-inner .divider-group li > button').on("click", function () {
                $('.snb-inner .subject-items').remove(); // snb 목록 초기화

                if ($(this).text() === "1학기") {
                    $('.snb-inner .divider-group li:first-child > button').addClass('active');
                    $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');

                    classScreen.v.termCode = "01";
                    classScreen.c.getTextbookList('snb');
                } else {
                    $('.snb-inner .divider-group li:nth-child(2) > button').addClass('active');
                    $('.snb-inner .divider-group li:not(:nth-child(2)) > button').removeClass('active');

                    classScreen.v.termCode = "02";
                    classScreen.c.getTextbookList('snb');
                }
            })

            // snb 학년 선택시 교과서 목록 새로 가져오기
            $('div.snb-inner > div > div > ul > li').on("click", function (e) {
                e.preventDefault();

                console.log("snb 학년 클릭됨");

                $('.snb-inner .subject-items').remove(); // snb 목록 초기화

                switch ($(this).text()) {
                    case "1학년":
                        $('.snb-header .dropdown button').html(`1학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`)

                        classScreen.v.gradeCode = "01";
                        classScreen.v.termCode = "01";
                        classScreen.v.subjectRevisionCode = '2015';

                        $('.snb-inner .divider-group li:first-child > button').addClass('active');
                        $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');

                        classScreen.c.getTextbookList('snb');
                        break;
                    case "2학년":
                        $('.snb-header .dropdown button').html(`2학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`)

                        classScreen.v.gradeCode = "02";
                        classScreen.v.termCode = "01";
                        classScreen.v.subjectRevisionCode = '2015';

                        $('.snb-inner .divider-group li:first-child > button').addClass('active');
                        $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');

                        classScreen.c.getTextbookList('snb');
                        break;
                    case "3학년":
                        $('.snb-header .dropdown button').html(`3학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`)

                        classScreen.v.gradeCode = "03";
                        classScreen.v.termCode = "01";
                        classScreen.v.subjectRevisionCode = '2015';

                        $('.snb-inner .divider-group li:first-child > button').addClass('active');
                        $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');


                        classScreen.c.getTextbookList('snb');
                        break;
                    case "4학년":
                        $('.snb-header .dropdown button').html(`4학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`)

                        classScreen.v.gradeCode = "04";
                        classScreen.v.termCode = "01";
                        classScreen.v.subjectRevisionCode = '2015';
                        classScreen.c.getTextbookList('snb');

                        $('.snb-inner .divider-group li:first-child > button').addClass('active');
                        $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');


                        break;
                    case "5학년":
                        $('.snb-header .dropdown button').html(`5학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`)

                        classScreen.v.gradeCode = "05";
                        classScreen.v.termCode = "01";
                        classScreen.v.subjectRevisionCode = '2015';

                        $('.snb-inner .divider-group li:first-child > button').addClass('active');
                        $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');


                        classScreen.c.getTextbookList('snb');
                        break;
                    case "6학년":
                        $('.snb-header .dropdown button').html(`6학년<svg><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use></svg>`)

                        classScreen.v.gradeCode = "06";
                        classScreen.v.termCode = "01";
                        classScreen.v.subjectRevisionCode = '2015';

                        $('.snb-inner .divider-group li:first-child > button').addClass('active');
                        $('.snb-inner .divider-group li:not(:first-child) > button').removeClass('active');

                        classScreen.c.getTextbookList('snb');
                        break;
                    default:
                        break;
                }
            })

            // 수업 선택 라디오 버튼 : 교과서자료 or 비주얼씽킹
            // $('#tab2-1 input[name="radio1"]').change(function() {
            //     if ($(this).attr('id') === 'ox-radio1-1') {
            //         classScreen.v.coursewareCode = '100';
            //     } else {
            //         classScreen.v.coursewareCode = '200';
            //     }
            //
            //     classScreen.c.getSubjectList();
            // })

        }
    };
    classScreen.init();
});
// let $classScreenV = classScreen.v;

/*
    <img src="/assets/images/common/icon-pdf.svg" alt="pdf 아이콘">
    <img src="/assets/images/common/icon-hangul.svg" alt="한글 아이콘">
    <img src="/assets/images/common/icon-zip.svg" alt="zip 아이콘">
    <img src="/assets/images/common/icon-link.svg" alt="링크 아이콘">
    <img src="/assets/images/common/icon-word.svg" alt="워드 아이콘">
    <img src="/assets/images/common/icon-youtube.svg" alt="유튜브 아이콘">
    <img src="/assets/images/common/icon-media.svg" alt="영상 아이콘">
    <img src="/assets/images/common/icon-excel.svg" alt="엑셀 아이콘">
    <img src="/assets/images/common/icon-clip.svg" alt="클립 아이콘">
    <img src="/assets/images/common/icon-ppt.svg" alt="파워포인트 아이콘">
    <img src="/assets/images/common/icon-text.svg" alt="텍스트파일 아이콘">
    <img src="/assets/images/common/icon-img.svg" alt="이미지파일 아이콘">
    <img src="/assets/images/common/icon-music.svg" alt="음악파일 아이콘">
 */
