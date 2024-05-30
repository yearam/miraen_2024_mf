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

                // TODO - 탭이동 체크
                $('#main-contents .textbook-intro-mobile').remove(); // 상단 교과서 정보 초기화

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
                            ebookUseElement = `<span class="view" data-path="${encodedPath}">
                                              <svg><use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use></svg>
                                              </span>`

                            if (res.ebookFilePath) {
                                ebookPath = res.ebookFilePath.replace(/ /g, "%20");
                            } else {
                                ebookPath = ''
                            }

                            ebookCopyElement = `<!-- Target -->
                                                <input id="ebookPathInput" type="hidden" value=${ebookPath}>
                                                <!-- Trigger -->
                                                <button id="ebookLinkCopyBtn" data-toast="toast-copy" type="button" class="button size-md type-text type-icon" data-clipboard-target="#ebookPathInput">
                                                    <title>공유 아이콘</title>
                                                    <svg><use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use></svg>
                                                </button>`
                        }

                        if (res.allSmartPptUseYn === "Y" && res.allSmartPptDisplayYn === "Y") {
                            const encodedPath = res.allSmartPptFilePath?.replace(/ /g, "%20");
                            smartPptElement = `<button id="smartPptDownloadBtn" class="button size-md type-primary fluid" type="button" data-path=${encodedPath} target-obj="alert">
                                                스마트수업
                                            </button>`
                        }

                        /* usbDownloadElement(전자 저작물), allFilesDownloadElement(전체파일) - 모바일 X */

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
                                <section class="full textbook-intro-mobile">
                                    <div class="textbook-wrap">
                                        <a class="${res.ebookUseYn === 'Y' && res.ebookDisplayYn === "Y" ? 'textbook is-ebook' : 'textbook'}" href="javascript:void(0);">
                                            <!--!NOTE : is-ebook 클래스 있으면 호버 시 돋보기 아이콘 노출 -->
                                            ${res.coverImageFilePath ? `<img alt=${res.textbookName} src="${res.coverImageFilePath}"/>` : ''}
                                            ${ebookUseElement}
                                        </a>
                                        <div class="inner-wrap">
                                          <div class="unit">
                                            <span class="badge">${res.subjectRevisionCode} 개정</span>
                                            <input type="hidden" name="masterSeq" value="${res.masterSeq}"/>
                                            <!--<div class="toast"></div>-->
                                            <div class="buttons">
                                             ${ebookCopyElement}
                                              <button id="reg-favorite" type="button" data-type="eleTextbook" class="bookmark">즐겨찾기</button>
                                            </div>
                                          </div>
                                          <h2>${res.textbookName + (!!res.leadAuthorName ? ' (' + res.leadAuthorName + ')' : '')}</h2>
                                          ${smartPptElement}
                                        </div>
                                    </div>
                                </section>
                                <section class="type-thick special-data textbook-intro-mobile">
                                  <div class="data-items">
                                    ${referenceList ?
                                        referenceList.map(item =>
                                            `<a data-save-code="${item.referenceSaveCode}"
                                                 data-path="${item.path ? item.path.replace(/ /g, "%20") : item.originFileName.replace(/ /g, "%20")}"
                                                 data-type="specialData"
                                                 data-extension="${item.extension}"
                                              >
                                                  <span>${item.referenceName}</span>
                                                  <i class="icon">
                                                      ${(item.extension === 'LINK' || item.extension === 'link') ? `
                                                            <svg>
                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows-single"></use>
                                                            </svg>
                                                        ` : `
                                                            <svg>
                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                            </svg>
                                                        `}
                                                  </i>
                                              </a>`
                                        ).join('')
                                     : ''}
                                  </div>
                                </section>
                            `;

                        $('#main-contents').prepend(classScreen.v.textbookDetailHtml);

                        // 즐겨찾기 여부에 따른 토글 설정
                        if ($isLogin) {
                            if (res.favoriteCount) {
                                $('#reg-favorite').addClass('active');
                            } else {
                                $('#reg-favorite').removeClass('active');
                            }
                        }

                        // 즐겨찾기 버튼 이벤트
                        //TODO - m.ui.js에 toggleThis('.textbook-wrap .bookmark'); 주석처리 필요
                        $('#reg-favorite').click(function() {
                            if ($isLogin) {
                                // if ($(this).is(':checked')) {
                                if ($(this).prop('class').indexOf('active') > -1) {
                                    classScreen.c.updateFavorite('delete');
                                } else {
                                    classScreen.c.addFavorite('add');
                                }
                            } else {
                                // $('#reg-favorite').prop('checked', false);
                                $('#reg-favorite').removeClass('active');
                                $('.reg-favorite-msg-mobile').addClass('display-hide');
                                $('.reg-favorite-msg-mobile p.toast-message').text('');
                                classScreen.f.loginAlert();
                            }
                        })

                        // TODO - 디폴트 체크
                        // $(document).ready(() => {
                        //     // 전체 펼쳐보기 디폴트: 오픈
                        //     $('.folding-all').trigger('click');
                        // })

                        /* 특화자료 swiper 플러그인 초기화(특화자료 페이지 처리) - 모바일 X */


                        $('a[data-type="specialData"]').on('click', function () {
                            if ($(this).data('extension').toLowerCase() !== 'link') {
                                if ($isLogin) {
                                    // if ($('#userGrade').val() === '001') {
                                    //     classScreen.f.needAuthAlert();
                                    // } else if ($('#userGrade').val() === '002') {
                                    //     classScreen.f.copyrightAlert($(this).data('path'));
                                    // }
                                    // TODO - 모바일 alert
                                    alert("MO 다운로드 지원 불가");
                                } else {
                                    classScreen.f.loginAlert();
                                }
                            } else {
                                window.open($(this).data('path'), '_blank');
                            }
                        });

                        $('.is-ebook .view').on('click', function () {
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

                        /* usbDownloadBtn, allFileDownloadBtn - 모바일 사용 X */

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

                                            $('.reg-favorite-msg-mobile').removeClass('display-hide');
                                            $('.reg-favorite-msg-mobile p.toast-message').text('링크가 복사되었습니다.');
                                            setTimeout(() => { $('.reg-favorite-msg-mobile').addClass('display-hide'); }, 1500);
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

                        /* sub(좌측 aside) - 모바일 X */

                        // 열람 이력 저장
                        let depth1 = res.subjectName;
                        let depth2 = res.subjectRevisionCode;
                        let depth3 = res.textbookName;
                        if (res.leadAuthorName != null && res.leadAuthorName != '') depth3 = res.textbookName + ' (' + res.leadAuthorName + ')';

                        let queryStringArr = location.search.split('&tabType');

                        $cmm.setHistoryCookie(7, 'history-ele', `${depth1}:${depth2}:${depth3}:${location.pathname + queryStringArr[0]}`, '/pages/ele');

                        // header에 GNB 제거 -> 교과서 이름(+ 저자명), 뒤로가기 버튼 추가
                        let textbookNameAndAuthor = res.textbookName;

                        if (res.leadAuthorName !== null && res.leadAuthorName !== '' && res.leadAuthorName !== undefined) {
                            textbookNameAndAuthor = res.textbookName + ' (' + res.leadAuthorName + ')';
                        }

                        const headerTextbookHtml = `
                            <h2>${textbookNameAndAuthor}</h2>
                            <button class="icon-button back" title="버튼명" onclick="window.history.back();">
                              <svg>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-left"></use>
                              </svg>
                            </button>
                        `;

                        // $header.empty(); // section.header-bar, section.gnb 제거
                        $('header > section.header-bar, header > section.gnb').remove();
                        $('header').append(headerTextbookHtml); // 헤더에 교과서 이름(+ 저자명), 뒤로가기 버튼 추가
                    }
                };

                $.ajax(options);

                classScreen.c.getSubjectList();

            },

            /* TODO - getSingleFileDown(파일 다운로드시 사용) - 모바일 X로 파악됨 */

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
                            $alert.open("MG00012");
                        } else {
                            $('#reg-favorite').addClass('active');
                            $('.reg-favorite-msg-mobile').removeClass('display-hide');
                            $('.reg-favorite-msg-mobile p.toast-message').text('즐겨찾기에 등록되었습니다.');
                            setTimeout(() => { $('.reg-favorite-msg-mobile').addClass('display-hide'); }, 1500);
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

                        $('#reg-favorite').removeClass('active');
                        $('.reg-favorite-msg-mobile').removeClass('display-hide');
                        $('.reg-favorite-msg-mobile p.toast-message').text('즐겨찾기가 해제되었습니다.');
                        setTimeout(() => { $('.reg-favorite-msg-mobile').addClass('display-hide'); }, 1500);
                    },
                };

                $.ajax(options);
            },

            // TODO
            getUnitCommonRefList: (unitSeq, webuiTarget) => {
                const options = {
                    url: '/pages/ele/textbook/class/unitCommonRefList.ax',
                    data: {
                        masterSeq: classScreen.v.masterSeq,
                        unitSeq: unitSeq,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log('getUnitCommonRefList called');
                        let unitCommonRefElement = '';
                        let refItem = '';

                        res?.map(function (item, index) {
                            refItem += `
                                <!-- split여부에 따라 나눠짐 -->
                                <div class="item">
                                  <i class="icon size-md type-round-box"
                                  data-extension="${item.extension}"
                                  data-fileid="${item.referenceFileId}"
                                  data-path="${item.path}">
                                  ${item.extension && item.extension === 'youtube' ? `
                                  <img src="/assets/images/common/icon-youtube.svg" alt="자료아이콘">
                                  ` : `
                                  <img src="/assets/images/common/${$extension.extensionToIcon(item.extension)}" alt="자료아이콘">
                                  `}
                                  </i>
                                  <span class="title">${item.referenceName}</span>
                                </div>
                            `
                        })

                        unitCommonRefElement = `
                              ${refItem}
                        `

                        // 가져온 unitSeq 값에 따라 다른 작업 수행
                        // $('.webui-popover-content').html(unitCommonRefElement);
                        $('.common-data-popup-mobile').html(unitCommonRefElement);

                        /* 모바일 다운로드 X */
                        // $('.unit-list-items li a').on('click', function () {
                        //     let refFileId = $(this).data('fileid');
                        //     let path = $(this).data('path')
                        //     let extension = $(this).data('extension')
                        //
                        //     console.log(`refFileId: ${refFileId}, path: ${path}`);
                        //
                        //     classScreen.f.downloadOrLink(extension, refFileId, path);
                        //
                        // })
                    },
                };

                $.ajax(options);
            },

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

                        const masterSeqForSubjectList = classScreen.v.masterSeq;
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


                        let recentElement = `<span class="badge-recently">최근진도</span>`

                        let openClassUnitSeq = '';
                        let openClassSubjectSeq = '';
                        let openClassElement = `<button class="button size-sm" data-btnname="openclass" data-subjectseq="${openClassSubjectSeq}" data-unitseq="openClassUnitSeq" target-obj="classLayer-popup-sheet">수업열기</button>`


                        // 초기화
                        $('#tab2-1 .accordion ul.chapter-list').html('');

                        // 대단원 loop > 중/소단원 loop 렌더
                        $.each(result, function (outerIndex, outerItem) {
                            tempSubjectList = '' // 초기화

                            // 중/소단원/차시 loop
                            $.each(outerItem, function(innerIndex, innerItem) {
                                tempSubjectList += `
                                  <!-- (분류)단원 -->
                                  ${innerItem.depth === 1 ? `
                                    <a href="#" class="list-depth action">
                                        <div class="header-wrap">
                                          <!-- 대단원 -->
                                          ${innerItem.unitNumberName? `<span class="number-unit">${innerItem.unitNumberName}.</span>` : ''}
                                          <h3>${innerItem.unitName}</h3>
                                        </div>
                                        ${innerItem.unitCommonRefCnt > 0 ? `
                                            <div class="extra">
                                                <button type="button" class="button size-sm" data-unitseq="${innerItem.unitSeq}" data-title="단원공통자료" data-placement="bottom" data-style="unit-list" data-backdrop="" data-focus="" data-target="webuiPopover1">
                                                    단원공통자료
                                                </button>
                                            </div>
                                  ` : ''}
                                    </a>
                                    <div class="pane">
                                    ${(innerItem.isLastItem === true && innerItem.subjectList.length === 0)
                                || (innerIndex === outerItem.length - 1 && innerItem.subjectList.length === 0) // 해당 교과의 마지막 순서의 단원이면서 차시목록이 비어있는 경우
                                    ? `<div class="box-no-data">
                                        등록된 자료가 없습니다.
                                       </div>`
                                    :
                                    ('<ul class="hour-list">' + 
                                        innerItem.subjectList.map(function (subject) {
                                        // 시작/끝 차시가 없으면 차시명만 노출
                                        // 1. singleSubjectYN이 Y인 경우
                                        let singleSubjectInfo = subject.startSubject ? `[${subject.startSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;

                                        // 2. singleSubjectYN이 N인 경우
                                        let subjectInfo = subject.startSubject && subject.endSubject ? `[${subject.startSubject}~${subject.endSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;

                                        <!-- 차시(주제) 목록-->
                                        return `
                                                    <!--'교과서자료' 유형의 차시만 노출-->
                                                    <li>
                                                        <div class="header-wrap">
                                                            ${subject.coursewareKindCode === "100"
                                            ? `<span class="badge type-round-box fill-skyblue" title="교과서자료">교과서자료</span>`
                                            : `<span class="badge type-round-box fill-purple" title="교과서자료">비주얼씽킹</span>`
                                        }
                                                            ${subject.singleSubjectUseYn === "Y" ? `
                                                               <a href="" class="title">${singleSubjectInfo}</a>`
                                            : `<a href="" class="title">${subjectInfo}</a>`}
                                                        </div>
                                                        
                                                            ${subject.mySubjectYn === 'Y' ? `<div class="inline-wrap">`
                                            : ''}
                                                            ${classScreen.v.subTextbookName === '' ? `
                                                                <!-- 부교과서 X -->
                                                                ${subject.textbookPageUseYn === 'Y' ? `
                                                                    <div class="number-pages">
                                                                        <span>
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
                                                                            <span>
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                            <span>
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                         ` : subject.subPageUseYn === "Y" ? `
                                                                        <div class="number-pages">
                                                                            <span>
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                         ` : subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span>
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                 ` : ''}
                                                            `}
                                                        ${subject.mySubjectYn === 'Y' ? `</div>` : ''}
                                                        
                                                        <div class="page-buttons">
                                                            <!-- subTextbookPlayUseYn === "Y" 여부 체크해서 부교과서 수업버튼 노출 -->
                                                            ${classScreen.v.entireClassDisplayYn === "Y" && subject.subTextbookPlayUseYn === 'Y' ? `
                                                                <button class="button size-sm" data-btnname="opensubclass" data-reference-path="${subject.referenceUrl}">
                                                                    ${subject.subTextbookPlayButtonName ? subject.subTextbookPlayButtonName : subject.simpleSubTextbookName}
                                                                </button>
                                                            ` : ''}
                                                            ${classScreen.v.entireClassDisplayYn === "Y" && subject.classOpenYn === "Y" ? `
                                                                <!-- 임시로 AS-IS 수업열기 버튼 추가 -->
                                                                <button class="button size-sm" data-btnname="asisOpenclass" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}" target-obj="classLayer-popup-sheet" data-asis="true">
                                                                    수업열기
                                                                </button>
                                                                <!-- 임시로 TO-BE 수업열기 버튼 hide -->
                                                                <!--<button class="button size-sm" data-btnname="openclass" data-masterseq="${masterSeqForSubjectList}" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}" target-obj="classLayer-popup-sheet">
                                                                    수업열기
                                                                </button>-->
                                                            ` : ''}
                                                        </div>
                                                    </li>
                                                `
                                    }).join('') + '</ul>' || '')}
                                    </div>
                                      ` : innerItem.depth === 2 ? `
                                    <!-- !NOTE : 중분류엔 type-middle , 소분류엔 type-small 이 붙습니다. -->
                                    <!-- 중단원이 있을 때 이하 show --> <!-- 여기부터 -->
                                    <div class="pane">
                                        <div class="list-depth type-middle">
                                            <div class="header-wrap">
                                                ${innerItem.unitNumberName ? `<span class="number-unit">${innerItem.unitNumberName}.</span>` : ''}
                                                <h4>${innerItem.unitName}</h4>
                                            </div>
                                          ${innerItem.unitCommonRefCnt > 0 ? `
                                            <div class="extra">
                                                <button type="button" class="button size-sm" data-unitseq="${innerItem.unitSeq}" data-title="단원공통자료" data-placement="bottom" data-style="unit-list" data-backdrop="" data-focus="" data-target="webuiPopover1">
                                                    단원공통자료
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
                                    ('<ul class="hour-list">' + 
                                        innerItem.subjectList.map(function (subject) {
                                        // 1. singleSubjectYN이 Y인 경우
                                        let singleSubjectInfo = subject.startSubject ? `[${subject.startSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;

                                        // 2. singleSubjectYN이 N인 경우
                                        let subjectInfo = subject.startSubject && subject.endSubject ? `[${subject.startSubject}~${subject.endSubject}차시]${subject.subjectName}` : `${subject.subjectName}`;

                                        <!-- 차시(주제) 목록-->
                                        return `
                                                    <!--'교과서자료' 유형의 차시만 노출-->
                                                    <li>
                                                        <div class="header-wrap">
                                                            ${subject.coursewareKindCode === "100" ? `
                                                                <span class="badge type-round-box fill-skyblue" title="교과서자료">교과서자료</span>
                                                                `
                                            : `
                                                                <span class="badge type-round-box fill-purple" title="교과서자료">비주얼씽킹</span>
                                                            `}
                                                            ${subject.singleSubjectUseYn === "Y" ? `
                                                               <a href="" class="title">${singleSubjectInfo}</a>`
                                            : `<a href="" class="title">${subjectInfo}</a>`}
                                                        </div>
                                                        
                                                            ${subject.mySubjectYn === 'Y' ? `<div class="inline-wrap">`
                                            : ''}
                                                            ${classScreen.v.subTextbookName === '' ? `
                                                                <!-- 부교과서 X -->
                                                                <div class="number-pages">
                                                                     <span>
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
                                                                        <span>
                                                                            ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                        </span>
                                                                        <span>
                                                                            ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                        </span>
                                                                    </div>
                                                                    ${subject.mySubjectYn === "Y" ?
                                                                    recentElement
                                                                    : ''}
                                                                    ` : subject.subPageUseYn === "Y" ? `
                                                                    <div class="number-pages">
                                                                        <span>
                                                                            ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${subject.simpleSubTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                        </span>
                                                                    </div>
                                                                    ${subject.mySubjectYn === "Y" ?
                                                                    recentElement
                                                                    : ''}
                                                                    ` : subject.textbookPageUseYn === 'Y' ? `
                                                                    <div class="number-pages">
                                                                        <span>
                                                                            ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                        </span>
                                                                    </div>
                                                                    ${subject.mySubjectYn === "Y" ?
                                                                    recentElement
                                                                    : ''}
                                                                ` : ''}
                                                            `}
                                                        ${subject.mySubjectYn === 'Y' ? `</div>` : ''}
                                                        
                                                        <div class="page-buttons">
                                                            <!-- subTextbookPlayUseYn === "Y" 여부 체크해서 부교과서 수업버튼 노출 -->
                                                            ${classScreen.v.entireClassDisplayYn === "Y" && subject.subTextbookPlayUseYn === 'Y' ? `
                                                                <button class="button size-sm" data-btnname="opensubclass" data-reference-path="${subject.referenceUrl}">
                                                                    ${subject.subTextbookPlayButtonName ? subject.subTextbookPlayButtonName : subject.simpleSubTextbookName}
                                                                </button>
                                                            ` : ''}
                                                            ${classScreen.v.entireClassDisplayYn === "Y" && subject.classOpenYn === "Y" ? `
                                                                <!-- 임시로 AS-IS 차시창 수업열기 버튼 추가 -->
                                                                <button class="button size-sm" data-btnname="asisOpenclass" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}" target-obj="classLayer-popup-sheet" data-asis="true">
                                                                    수업열기
                                                                </button>
                                                                <!-- 임시로 TO-BE 수업열기 버튼 hide -->
                                                                <!--<button class="button size-sm" data-btnname="openclass" data-masterseq="${masterSeqForSubjectList}" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}" target-obj="classLayer-popup-sheet">
                                                                    수업열기
                                                                </button>-->
                                                            ` : ''}
                                                        </div>
                                                    </li>
                                                `
                                    }).join('') + '</ul>' || '')}
                                    </div>
                                        ` : innerItem.depth === 3
                                    ? `
                                            <!-- 소단원이 있을 때 show -->
                                            <div class="pane">
                                                <div class="list-depth type-small">
                                                    <div class="header-wrap">
                                                        ${innerItem.unitNumberName? `<span class="number-unit">${innerItem.unitNumberName}.</span>` : ''}
                                                        <h4>${innerItem.unitName}</h4>
                                                    </div>
                                                  ${innerItem.unitCommonRefCnt > 0 ? `
                                                    <div class="extra">
                                                        <button type="button" class="button size-sm" data-unitseq="${innerItem.unitSeq}" data-title="단원공통자료" data-placement="bottom" data-style="unit-list" data-backdrop="" data-focus="" data-target="webuiPopover1">
                                                            단원공통자료
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
                                                                    <span class="badge type-round-box fill-skyblue" title="교과서자료">교과서자료</span>
                                                                   `
                                                    : `
                                                                    <span class="badge type-round-box fill-purple" title="교과서자료">비주얼씽킹</span> 
                                                                `}
                                                                ${subject.singleSubjectUseYn === "Y" ? `
                                                                    <a href="" class="title">${singleSubjectInfo}</a>`
                                                    : `<a href="" class="title">${subjectInfo}</a>`}
                                                            </div>
                                                            
                                                                ${subject.mySubjectYn === 'Y' ? `<div class="inline-wrap">`
                                                    : ''}
                                                                ${classScreen.v.subTextbookName === '' ? `
                                                                    <!-- 부교과서 X -->
                                                                    <div class="number-pages">
                                                                         <span>
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
                                                                            <span>
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${subject.simpleTextbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${subject.simpleTextbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                            <span>
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.subPageUseYn === "Y" ? `
                                                                        <div class="number-pages">
                                                                            <span>
                                                                                ${subject.subTextbookStartPage ? subject.subTextbookEndPage ? `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}~${subject.subTextbookEndPage}p` : `${classScreen.v.subTextbookName} ${subject.subTextbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : subject.textbookPageUseYn === 'Y' ? `
                                                                        <div class="number-pages">
                                                                            <span>
                                                                                ${subject.textbookStartPage ? subject.textbookEndPage ? `${classScreen.v.textbookName} ${subject.textbookStartPage}~${subject.textbookEndPage}p` : `${classScreen.v.textbookName} ${subject.textbookStartPage}p` : ''}
                                                                            </span>
                                                                        </div>
                                                                        ${subject.mySubjectYn === "Y" ?
                                                                        recentElement
                                                                        : ''}
                                                                    ` : ''}
                                                                `}
                                                            ${subject.mySubjectYn === 'Y' ? `</div>` : ''}
                                                            
                                                            <div class="page-buttons">
                                                                <!-- subTextbookPlayUseYn === "Y" 여부 체크해서 부교과서 수업버튼 노출 -->
                                                                ${classScreen.v.entireClassDisplayYn === "Y" && subject.subTextbookPlayUseYn === 'Y' ? `
                                                                    <button class="button size-sm" data-btnname="opensubclass" data-reference-path="${subject.referenceUrl}">
                                                                        ${subject.subTextbookPlayButtonName ? subject.subTextbookPlayButtonName : subject.simpleSubTextbookName}
                                                                    </button>
                                                                ` : ''}
                                                                ${classScreen.v.entireClassDisplayYn === "Y" && subject.classOpenYn === "Y" ? `
                                                                    <!-- 임시로 AS-IS 차시창 수업열기 버튼 추가 -->
                                                                    <button class="button size-sm" data-btnname="asisOpenclass" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}" target-obj="classLayer-popup-sheet" data-asis="true">
                                                                        수업열기
                                                                    </button>
                                                                    <!-- 임시로 TO-BE 수업열기 버튼 주석 처리 -->
                                                                    <!--<button class="button size-sm" data-btnname="openclass" data-masterseq="${masterSeqForSubjectList}" data-subjectseq="${subject.subjectSeq}" data-unitseq="${innerItem.unitSeq}" data-lessonseq="${subject.originLessonSeq}" target-obj="classLayer-popup-sheet">
                                                                        수업열기
                                                                    </button>-->
                                                                ` : ''}
                                                            </div>
                                                        </li>` : ''
                                        }).join('')} 
                                                    </ul>`}
                                            </div>
                                        ` : ''}
                                    </div>
                                `
                            })

                            // .active 추가시 아코디언 오픈
                            $('#tab2-1 .accordion ul.chapter-list').append(`<li data-type="firstLi" class="">${tempSubjectList}</li>`);

                            // TODO: ui.js가 안돼서 임시로 넣음 (단원공통자료 제어파트)
                            $('.tooltip-trigger').each(function(idx, el){
                                $(el).webuiPopover({
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
                                    }
                                })
                            })

                            function debounce(func, wait) {
                                let timeout;

                                // 디바운스된 함수
                                const debounced = function(...args) {
                                    const context = this;

                                    clearTimeout(timeout);

                                    // 지연된 호출 이후에 원래 함수를 호출
                                    timeout = setTimeout(function() {
                                        func.apply(context, args);
                                    }, wait);
                                };

                                // 초기 호출을 지연시키지 않고 바로 호출
                                debounced.immediate = function(...args) {
                                    clearTimeout(timeout);
                                    func.apply(this, args);
                                };

                                return debounced;  // debounced 함수를 반환하도록 수정
                            }

                            const debouncedFunction = debounce(classScreen.c.getUnitCommonRefList, 1000);

                            $('.list-depth div.extra > button').off('click').on('click', function(e) {
                                e.preventDefault();

                                // 클릭된 버튼의 data-unitSeq 값을 가져옴
                                let unitSeq = $(this).data('unitseq');
                                const webuiTarget = $(this).data("target");

                                // 디바운스된 함수 호출
                                debouncedFunction.immediate(unitSeq, webuiTarget, function() {
                                });
                                openPopup({id:'popup-common-data'});
                            });
                        })

                        // 단원공통자료 버튼에 대한 클릭 이벤트 핸들러

                        // TODO: ui.js가 안돼서 임시로 넣음 (단원공통자료 제어파트)
                        $('.tooltip-trigger').each(function(idx, el){
                            $(el).webuiPopover({
                                multi:true,
                                backdrop: $(el).is("[data-backdrop]") ? true : false,
                                closeable:true,
                                style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
                                container: $(el).is("[data-container]") ? `.${$(el).attr("data-container")}` : false,
                                onShow: function(){
                                    if($(el).is("[data-focus]")){
                                        $(el).addClass('focus');
                                    }
                                },
                                onHide: function(){
                                    if($(el).is("[data-focus]")){
                                        $(el).removeClass('focus');
                                    }
                                }
                            })
                        })

                        // 차시명 클릭 및 hover 막음
                        classScreen.f.preventEvent();

                        // 수업열기 버튼 이벤트
                        // $('button[data-btnname="openclass"]').on('click', function() {
                        //     if ($isLogin) {
                        //         if ($('#userGrade').val() === '001') {
                        //             classScreen.f.needAuthAlert();
                        //         } else if ($('#userGrade').val() === '002'){
                        //             // TO-BE 차시창 사용
                        //             const classLayerUrl = '/pages/ele/textbook/classLayer.mrn';
                        //             const masterSeq = classScreen.v.masterSeq;
                        //             const subjectSeq = $(this).data('subjectseq');
                        //             const revisionCode = classScreen.v.subjectRevisionCode;
                        //
                        //             // const urlWithParameters = `${classLayerUrl}?masterSeq=${masterSeq}&subjectSeq=${subjectSeq}&revisionCode=${revisionCode}`;
                        //             // window.open(urlWithParameters, '_blank');
                        //
                        //             openPopup({id: $(this).attr("target-obj"), target: $(this)});
                        //
                        //
                        //
                        //             // let ticket = $('input[name="ticket"]').val();
                        //
                        //             // AS-IS 차시창 사용
                        //             // const classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
                        //             // const subjectSeq = $(this).data('subjectseq');
                        //             // const urlWithParameters = `${classLayerUrl}${subjectSeq}&ticket=${ticket}`;
                        //             // window.open(urlWithParameters, '_blank');
                        //         }
                        //     } else {
                        //         classScreen.f.loginAlert();
                        //     }
                        // });

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

                                    /* 모바일 추가 - AS-IS 부교과서 수업열기와 동일한 파라미터를 넘기도록 수정 */
                                    const questionIdx = convertedUrl.indexOf('?');
                                    const user = $('#miraenId').val(); // qs에 추가 할 miraenId
                                    let qs = convertedUrl.substring(questionIdx + 1); // '?' 뒤에 쿼리스트링 추출
                                    qs += `&user=${user}`;

                                    let finalUrl = `https://ele.m-teacher.co.kr/assets/viewer/mv2.html?${qs}`;

                                    window.open(finalUrl, '_blank');
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
            /* setSnbList, getTextbookList - sub(좌측 aside) - 모바일 X */

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

                        // $('.breadcrumbs li[data-type="page"]').text('평가자료'); // dept - 모바일 X
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

            // sitemap 또는 교과활동/평가자료 리스트에서 교과서상세(detail) 접속시
            // classTab 또는 referenceTab 일 때 gnb에 .active 추가
            if (classScreen.v.tabType === 'classTab') { // 교과활동
                $('#gnbAreaEle a').removeClass('active');
                $('#gnbAreaEle a').each(function() {
                    if ($(this).text() === '교과활동') {
                        $(this).addClass('active');
                    }
                })
            } else if (classScreen.v.tabType === 'referenceTab') { // 평가자료
                $('#gnbAreaEle a').removeClass('active');
                $('#gnbAreaEle a').each(function() {
                    if ($(this).text() === '평가자료') {
                        $(this).addClass('active');
                    }
                })
            }
            classScreen.event();
        },
        event: function () {
        }
    };
    classScreen.init();
});