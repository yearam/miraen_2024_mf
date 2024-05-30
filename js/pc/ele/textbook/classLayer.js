let classLayerScreen


classLayerScreen = {
    /**
     * 내부 전역변수
     *
     * @memberOf classLayerScreen
     */
    v: {
        subjectInfo         : {
            subjectSeq          : 2,
            subjectName         : "",
            startSubject        : 1,
            endSubject          : 2,
            textbookStartPage   : 1,
            nextSubjectSeq      : 3,
            textbookName        : "",
            mainTextbookYn      : "Y",
            subMasterYn         : "N",
            masterSeq           : 1,
            gradeCode           : "01",
            termCode            : "01",
            subjectCode         : "KOA",
            depth1UnitSeq       : 1,
            depth2UnitSeq       : 0,
            depth3UnitSeq       : 0,
            textbookEndPage     : '',
            subTextbookStartPage: '',
            subTextbookEndPage  : '',
        },
        drake               : '',
        draggedItemInfo     : null,
        targetElement       : '',
        isItemFromContainer1: '',
        isItem1to1          : '',
        isItem2to1          : '',
        isItem2to2          : '',
        isItem1to2          : '',
        masterSeq           : 1,
        unitSeq             : '',
        subjectSeq          : '',
        subjectRevisionCode : '2015',
        gradeCode           : '01',
        termCode            : '01',
        bigUnitSeq          : '',
        middleUnitSeq       : '',
        smallUnitSeq        : '',
        coursewareCode      : '',
        subjectTypeCode     : '',
        isClickEventRunning : false, // 다른 차시보기 a 태그 클릭 이벤트 활성화 여부
        otherClassOpened    : false, // 다른 차시보기 레이어 열림 여부
        classListSaveData   : [],
        classListSaveType   : 'SAVE',
        isClassEverSaved    : false,
        prevSubjectSeq      : '',
        nextSubjectSeq      : '',
    },

    /**
     * 통신 객체- call
     *
     * @memberOf classLayerScreen
     */
    c: {

        /**
         *  교과서(과목) 목록 가져오기
         *
         * @memberOf classLayerScreen.c
         */
        getTextbookList: () => {
            // let queryString = window.location.search;
            // let searchParams = new URLSearchParams(queryString);
            //
            // classLayerScreen.v.subjectRevisionCode = searchParams.get('revisionCode');

            const options = {
                url    : '/pages/ele/textbook/textbookList.ax',
                data   : {
                    subjectRevisionCode: classLayerScreen.v.subjectRevisionCode,
                    gradeCode          : classLayerScreen.v.gradeCode,
                    termCode           : classLayerScreen.v.termCode,
                    subjectTypeCode    : classLayerScreen.v.subjectTypeCode,
                    otherChasi         : "Y"
                },
                method : 'GET',
                async  : false,
                success: function (res) {
                    // 교과서 리스트 세팅
                    classLayerScreen.f.setTextSubjectList(res, '');
                }
            };

            $.ajax(options);
        },


        /**
         * 차시, 수업의 상세 정보 및 현재 수업중인 아이템 정보
         *
         * @memberOf classLayerScreen.c
         */
        getClassList: () => {
            const options = {
                url    : '/pages/api/textbook-class/classList.ax',
                data   : {
                    subjectSeq         : classLayerScreen.v.subjectSeq,
                    saveType           : classLayerScreen.v.classListSaveType,
                    subjectRevisionCode: classLayerScreen.v.subjectRevisionCode,
                    otherChasi         : "Y",
                    // saveType: 'DEFAULT'
                },
                method : 'GET',
                async  : false,
                success: function (res) {
                    // 차시 정보를 전역변수로 세팅
                    const {
                        masterSeq,
                        subjectSeq,
                        gradeCode,
                        termCode,
                        depth1UnitSeq,
                        depth2UnitSeq,
                        depth3UnitSeq
                    } = res?.row.subjectInfo;

                    classLayerScreen.v = {
                        masterSeq,
                        subjectSeq,
                        gradeCode,
                        termCode,
                        depth1UnitSeq,
                        depth2UnitSeq,
                        depth3UnitSeq,
                    };


                    // 단원 리스트 저장
                    const {unit1List, unit2List, unit3List} = res?.row;

                    // 각 단원 리스트 전역변수에 할당
                    classLayerScreen.v.unit1List = unit1List;
                    classLayerScreen.v.unit2List = unit2List;
                    classLayerScreen.v.unit3List = unit3List;

                    // 이전, 다음 차시 저장
                    classLayerScreen.v.prevSubjectSeq = res?.row.subjectInfo?.prevSubjectSeq;
                    classLayerScreen.v.nextSubjectSeq = res?.row.subjectInfo?.nextSubjectSeq;

                    // subjectInfo 배열 전역에 저장
                    classLayerScreen.v.subjectInfo = res?.row.subjectInfo;
                    classLayerScreen.v.subjectRevisionCode = classLayerScreen.v.subjectInfo.subjectRevisionCode;

                    let termFilteredList = res.row.textSubjectList.filter(function (item) {
                        return item.termCode === "00" || item.termCode === classLayerScreen.v.termCode;
                    });

                    // 차시창 초기 진입시, 현재 차시에 해당하는 정보 세팅
                    classLayerScreen.f.setSubjectInfo(res.row);
                    classLayerScreen.f.setClassList(res.rows);
                    classLayerScreen.f.setTextSubjectList(termFilteredList, 'init');
                    classLayerScreen.f.setUnitList('init', unit1List, unit2List, unit3List, 'init');
                    classLayerScreen.f.setSubjectList(res.row.subjectList, 'init');


                    // 현재 차시의 학년/학기 active
                    const gradeDiv = $('.item-wrap div[data-type="grade"]');
                    const termDiv = $('.item-wrap div[data-type="term"]');

                    gradeDiv.find('a').removeClass('active');
                    termDiv.find('a').removeClass('active');

                    // 학년 active 및 상단 breadcrumbs 세팅
                    let gradeIndex = parseInt(gradeCode);

                    if (gradeIndex >= 1 && gradeIndex <= 6) {
                        gradeDiv.find('a:nth-child(' + gradeIndex + ')').addClass('active');
                        $('.breadcrumbs ul li:nth-child(1) a').text(gradeIndex + '학년');
                    }

                    classLayerScreen.v.termCode = res?.row?.subjectInfo.termCode;
                    let termCodeForBreadcrumbs = res?.row?.subjectInfo.termCodeForBreadcrumbs;

                    // 학기 active 및 상단 breadcrumbs 세팅
                    if (termCodeForBreadcrumbs === "00") {
                        $('.breadcrumbs ul li:nth-child(2) a').text('공통학기');
                    } else {
                        if (classLayerScreen.v.termCode === "01") {
                            $('.breadcrumbs ul li:nth-child(2) a').text('1학기');
                        } else if (classLayerScreen.v.termCode === "02") {
                            $('.breadcrumbs ul li:nth-child(2) a').text('2학기');
                        }
                    }

                    if (classLayerScreen.v.termCode === "01") {
                        termDiv.find('a:nth-child(1)').addClass('active');
                    } else if (classLayerScreen.v.termCode === "02") {
                        termDiv.find('a:nth-child(2)').addClass('active');
                    }

                    // 링크형 특화자료 세팅
                    $('.swiper-wrapper-classLayer').html('');

                    let tempReferenceItem = '';
                    res.row.referenceList.forEach(function (item) {
                        return tempReferenceItem += `
                            <div class="swiper-slide">
                                <button class="button size-md" data-path="${item.linkPath}" data-reference-seq="${item.referenceSeq}"> ${item.referenceName} <svg>
                                    <title>새창 아이콘</title>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                </svg>
                                </button>
                            </div>`
                    })

                    $('.swiper-wrapper-classLayer').html(tempReferenceItem);
                    $('.swiper-slide button').on('click', function () {
                        const link = $(this).attr('data-path');

                        if (link) {
                            window.open(link, '_blank');
                        }
                    })


                    // 수업 목차에 자료가 추가되었을 경우 기타 버튼 숨기고 삭제버튼 활성화
                    $(document).on('DOMNodeInserted', '#dragContainer1', function (e) {
                        // 새로 추가된 요소가 .new-item 클래스를 가지고 있는지 확인
                        if ($(e.target).hasClass('referenceData')) {
                            // 새로운 아이템 내부의 버튼들을 선택하여 CSS를 제어
                            $(e.target).find('.buttons button:nth-child(1), .buttons button:nth-child(2), .buttons button:nth-child(3)').css({
                                'display': 'none'
                            });

                            $(e.target).find('.buttons button:nth-child(4)').attr('data-type', 'closeBtn').css({
                                'display': 'block'
                            });
                        }
                    });

                    // tb_my_class에 저장 이력 체크
                    classLayerScreen.v.isClassEverSaved = res.row.myClassCount > 0 ? true : false;

                    // 기본목차 / 저장목차 버튼
                    if (classLayerScreen.v.isClassEverSaved) {
                        $('.lesson-header > button').css('display', 'block');
                        $('.lesson-header > button').html(`
                        기본목차보기
                        <svg>
                            <title>리스트 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                        </svg>
                        `);
                    } else {
                        $('.lesson-header > button').css('display', 'none');
                    }

                    // 다른차시보기 내부 아이템의 클릭 핸들러 추가
                    classLayerScreen.f.registerClickEvent();

                    // dragula 불러오기
                    classLayerScreen.f.dragDrop();

                    if ($('.scrollbar-styled').length != 0) {
                        $(".scrollbar-styled").mCustomScrollbar({
                            theme              : "minimal-dark",
                            scrollInertia      : 150,
                            autoExpandScrollbar: true,
                            scrollEasing       : "linear"
                        });
                    }
                }
            }
            $.ajax(options);
        },

        /**
         * 단원 리스트 순차적 호출을 위한 분리 선언
         *
         * @memberOf classLayerScreen.c
         */

        // 첫 번째 GetUnitListByDepth 호출 함수
        firstGetUnitListByDepth: function (dataObj, unit1List, unit2List, unit3List, type) {
            return $.ajax({
                url   : '/pages/api/textbook-unit/unitListByDepth.ax',
                data  : dataObj,
                method: 'GET',
                async : false,
            })
                .done(function (res) {
                    console.info("First getUnitListByDepth result: ", res);

                    dataObj.masterSeq = classLayerScreen.v.masterSeq;

                    // 대단원 목록 초기화
                    unit1List = [];
                    // 결과에 대단원 목록이 존재하는 경우 unit1List에 하나씩 넣기
                    if (res.rows.length !== 0) {
                        res.rows.forEach((el) => unit1List.push(el));

                        // 대단원중 첫번째 아이템이 선택되도록 + 해당 대단원 seq 전역변수 설정
                        unit1List[0].selectedYn = "Y";
                        classLayerScreen.v.bigUnitSeq = unit1List[0].unitSeq;

                        // 첫 번째 아이템 이하에 unit이 더 있으면 두 번째 ajax 호출
                        if (unit1List[0].unitCount !== 0) {
                            dataObj.unitSeq = unit1List[0].unitSeq;
                            dataObj.depth = 2;

                            classLayerScreen.c.secondGetUnitListByDepth(dataObj, unit1List, unit2List, unit3List, '');
                        } else {
                            $('.sub-item[data-type="subject"] .depth-2').html('');
                            unit2List = [];
                            unit3List = [];
                            classLayerScreen.c.getSubjectListByUnit(unit1List[0].unitSeq);

                            classLayerScreen.f.setUnitList('firstGet', unit1List, unit2List, unit3List);
                        }

                        // 대단원 리스트 세팅
                    } else { // 대단원 목록이 존재하지 않는 경우 -> 대단원 리스트, 중/소 영역 삭제하고 차시 비우기
                        $('.sub-item[data-type="bigunit"] .depth-2').html('');
                        $('.sub-item[data-type="middleunit"]').remove();
                        $('.sub-item[data-type="smallunit"]').remove();
                        $('.sub-item[data-type="subject"] .depth-2').html('');
                    }
                })
                .fail(function (error) {
                    console.error("First first getUnitListByDepth failed: ", error);
                })
        },

        // 두 번째 GetUnitListByDepth 호출 함수
        secondGetUnitListByDepth: function (dataObj, unit1List, unit2List, unit3List, type) {
            return $.ajax({
                url   : '/pages/api/textbook-unit/unitListByDepth.ax',
                data  : dataObj,
                method: 'GET',
                async : false,
            })
                .done(function (res2) {
                    console.info("Second getUnitListByDepth result: ", res2);

                    let bigunitElement = $('.sub-item[data-type="bigunit"]');
                    let middleunitElement = $('.sub-item[data-type="middleunit"]');

                    const middleunitHTML = `
                    <div class="sub-item grow-4" data-type="middleunit">
                        <strong>중단원</strong>
                    </div>
                    `;

                    if (middleunitElement.length === 0 && bigunitElement.length > 0) {
                        bigunitElement.after(middleunitHTML);
                    }

                    // 중, 소단원 목록 초기화 후 채움
                    unit2List = [];

                    // 중단원 목록이 존재하는 경우
                    if (res2.rows.length !== 0) {
                        res2.rows.forEach((el) => unit2List.push(el));

                        // 중단원의 첫번째 아이템이 선택되도록 설정
                        unit2List[0].selectedYn = "Y";
                        classLayerScreen.v.middleUnitSeq = unit2List[0].unitSeq;

                        // 중단원 첫 번째 아이템 이하에 unit이 더 있으면 세번째 ajax 호출
                        if (unit2List[0].unitCount !== 0) {
                            dataObj.unitSeq = unit2List[0].unitSeq;
                            dataObj.depth = 3;

                            classLayerScreen.c.thirdGetUnitListByDepth(dataObj, unit1List, unit2List, unit3List)
                        } // 중단원의 첫 번째 아이템 이하에 소단원이 더 없으면 소단원 목록 초기화 및 차시목록 호출
                        else {
                            $('.sub-item[data-type="subject"] .depth-2').html('');
                            unit3List = [];
                            classLayerScreen.c.getSubjectListByUnit(classLayerScreen.v.middleUnitSeq);

                            classLayerScreen.f.setUnitList('secondGet', unit1List, unit2List, unit3List);
                        }
                    } else { // 중단원 목록이 존재하지 않으면 -> 중/소 영역 삭제하고 차시 비우기
                        $('.sub-item[data-type="middleunit"]').remove();
                        $('.sub-item[data-type="smallunit"]').remove();
                        $('.sub-item[data-type="subject"] .depth-2').html('');

                        classLayerScreen.c.getSubjectListByUnit(classLayerScreen.v.bigUnitSeq);
                    }
                })
                .fail(function (error) {
                    console.error("First second getUnitListByDepth failed: ", error);
                })
        },

        // 세 번째 GetUnitListByDepth 호출 함수
        thirdGetUnitListByDepth: function (dataObj, unit1List, unit2List, unit3List, type) {
            return $.ajax({
                url   : '/pages/api/textbook-unit/unitListByDepth.ax',
                data  : dataObj,
                method: 'GET',
                async : false,
            })
                .done(function (res3) {
                    console.info("Third getUnitListByDepth result: ", res3)

                    let middleunitElement = $('.sub-item[data-type="middleunit"]');
                    let smallunitElement = $('.sub-item[data-type="smallunit"]');

                    const smallunitHTML = `
                    <div class="sub-item grow-4" data-type="smallunit">
                        <strong>소단원</strong>
                    </div>
                    `;

                    if (smallunitElement.length === 0 && middleunitElement.length > 0) {
                        middleunitElement.after(smallunitHTML);
                    }

                    unit3List = []; // 소단원 목록 초기화
                    if (res3.rows.length !== 0) { // 소단원 목록이 존재하는 경우
                        res3.rows.forEach((el) => unit3List.push(el));

                        // 소단원의 첫번째 아이템이 선택되도록 설정
                        unit3List[0].selectedYn = "Y";
                        classLayerScreen.v.smallUnitSeq = unit3List[0].unitSeq;

                        classLayerScreen.f.setUnitList('thirdGet', unit1List, unit2List, unit3List);
                        classLayerScreen.c.getSubjectListByUnit(classLayerScreen.v.smallUnitSeq);
                    } else { // 소단원 목록이 존재하지 않으면 -> 소단원 영역 삭제하고 차시 비우기
                        $('.sub-item[data-type="smallunit"]').remove();
                        $('.sub-item[data-type="subject"] .depth-2').html('');

                        if (type === 'direct') {
                            unit2List = [];
                        }

                        classLayerScreen.c.getSubjectListByUnit(classLayerScreen.v.middleUnitSeq);
                    }
                })
                .fail(function (error) {
                    console.error("First third getUnitListByDepth failed: ", error);
                })
        },

        getUnitListByDepth: (type) => {
            let dataObj = {};
            if (type === 'textbook') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq  : 0,
                    depth    : 1,
                }
            } else if (type === 'bigunit') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq  : classLayerScreen.v.bigUnitSeq,
                    depth    : 2,
                }
                // 중단원을 클릭했다면 소단원/차시 call
            } else if (type === 'middleunit') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq  : classLayerScreen.v.middleUnitSeq,
                    depth    : 3,
                }
                // 소단원을 클릭했다면 차시 call
            } else if (type === 'smallunit') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq  : classLayerScreen.v.smallUnitSeq,
                    depth    : 3,
                }
            }

            let unit1List = classLayerScreen.v.unit1List;
            let unit2List = classLayerScreen.v.unit2List;
            let unit3List = classLayerScreen.v.unit3List;

            // 교과서를 클릭했다면 대/중/소단원/차시 call
            if (type === "textbook") {
                classLayerScreen.c.firstGetUnitListByDepth(dataObj, unit1List, unit2List, unit3List, '');
                // 대단원을 클릭했다면 중/소단원/차시 call
            } else if (type === "bigunit") {
                classLayerScreen.c.secondGetUnitListByDepth(dataObj, unit1List, unit2List, unit3List, 'direct');
                // 중단원을 클릭했다면 소단원/차시 call
            } else if (type === "middleunit") {
                classLayerScreen.c.thirdGetUnitListByDepth(dataObj, unit1List, unit2List, unit3List, 'direct');
                // 소단원을 클릭했다면 차시 call
            } else if (type === "smallunit") {
                classLayerScreen.c.getSubjectListByUnit(classLayerScreen.v.smallUnitSeq);
            }
        },

        /**
         *  단원 이하 차시 불러오기
         *
         * @memberOf classLayerScreen.c
         */
        getSubjectListByUnit: (unitSeq) => {
            const options = {
                url    : '/pages/api/textbook-unit/subjectListByUnit.ax',
                data   : {
                    unitSeq: unitSeq,
                },
                method : 'GET',
                async  : false,
                success: function (res) {

                    if (res.rows.length !== 0) {
                        classLayerScreen.f.setSubjectList(res.rows); // 차시 리스트 세팅
                    } else {
                        $('.sub-item[data-type="subject"]').find('.depth-2').html(''); // 차시 리스트가 없으면 영역 비우기
                    }

                    // 차시 리스트를 새로 가져올 때마다 각 항목의 이벤트 등록
                    classLayerScreen.f.registerClickEvent();

                    if ($('.scrollbar-styled').length != 0) {
                        $(".scrollbar-styled").mCustomScrollbar({
                            theme              : "minimal-dark",
                            scrollInertia      : 150,
                            autoExpandScrollbar: true,
                            scrollEasing       : "linear"
                        });
                    }
                }
            };

            $.ajax(options);

        },

        /**
         *  학습 목차 저장
         *
         * @memberOf classLayerScreen.c
         */
        saveClassList: () => {
            let url;
            const options = {
                url        : '/pages/api/mypage/addMyclass.ax',
                contentType: 'application/json',
                data       : JSON.stringify(classLayerScreen.v.classListSaveData),
                method     : 'POST',
                async      : false,
                success    : function (res) {

                    // 저장 레이어 닫기
                    $('.period-float .float-inner').removeClass('active');
                    $('.lesson-header > button').html(`
                        기본목차보기
                        <svg>
                            <title>리스트 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                        </svg>
                    `);
                    $('.lesson-header > button').css('display', 'block');
                }
            };

            $.ajax(options);

        },

    },


    /**
     * 내부 함수
     *
     * @memberOf classLayerScreen
     */
    f: {
        setClassInfo: function () {
            // 현재 URL에서 쿼리스트링 부분을 가져오기
            let queryString = window.location.search;

            // URLSearchParams 객체를 사용하여 쿼리스트링 파싱
            let searchParams = new URLSearchParams(queryString);

            // 매개변수 값 가져오기
            classLayerScreen.v.subjectSeq = searchParams.get('subjectSeq');
            // classLayerScreen.v.subjectRevisionCode = searchParams.get('revisionCode');

            classLayerScreen.c.getClassList();
        },

        // 현재 차시 관련 정보 세팅
        setSubjectInfo: function (row) {
            classLayerScreen.v.subjectInfo = {...row.subjectInfo}
            const startSubject = classLayerScreen.v.subjectInfo.startSubject;
            const endSubject = classLayerScreen.v.subjectInfo.endSubject;
            const subjectName = classLayerScreen.v.subjectInfo.subjectName;
            const textbookName = classLayerScreen.v.subjectInfo.textbookName;
            const textbookStartPage = classLayerScreen.v.subjectInfo.textbookStartPage;
            const textbookEndPage = classLayerScreen.v.subjectInfo.textbookEndPage;
            const subTextbookName = classLayerScreen.v.subjectInfo.subTextbookName;
            const subTextbookStartPage = classLayerScreen.v.subjectInfo.subTextbookStartPage;
            const subTextbookEndPage = classLayerScreen.v.subjectInfo.subTextbookEndPage;

            let subjectNumber = '';
            let mainTextbookPage = '';
            let subTextbookPage = '';

            // 상단 교과서명 세팅
            $('.breadcrumbs ul li:nth-child(3) a').text(textbookName);

            // 차시 번호
            if (startSubject) {
                subjectNumber = `[${startSubject}`;

                if (endSubject) {
                    subjectNumber += `~${endSubject}`;
                }

                subjectNumber += ' 차시]';
            }

            // 주교과서 & 페이지 번호
            if (textbookName) {
                mainTextbookPage = `${textbookName}`;

                if (textbookStartPage) {
                    mainTextbookPage += ` ${textbookStartPage}`;

                    if (textbookEndPage) {
                        mainTextbookPage += `~${textbookEndPage}`;
                    }

                    mainTextbookPage += '쪽';
                }
            }

            // 부교과서명 & 페이지 번호
            if (subTextbookName) {
                subTextbookPage = `${subTextbookName}`;

                if (subTextbookStartPage) {
                    subTextbookPage += ` ${subTextbookStartPage}`;

                    if (subTextbookEndPage) {
                        subTextbookPage += `~${subTextbookEndPage}`;
                    }

                    subTextbookPage += '쪽';
                }
            }

            // 차시명 셋팅
            $('.contents-header .header-inner h2').text(`${subjectNumber} ${subjectName}`);
            $('.number-pages .badge:nth-child(1)').text(`${mainTextbookPage}`)
            $('.number-pages .badge:nth-child(2)').text(`${subTextbookPage}`)
        },

        // 학습 목차 세팅
        setClassList: function (rows) {
            // 단계별 - 단원도입/도입/전개/정리 -로 수업 나열
            // let introduction = [];  // 단원도입
            // let development = [];   // 도입
            // let expansion = [];     // 전개
            // let summary = [];       // 정리

            let introductionElement = '';
            let developmentElement = '';
            let expansionElement = '';
            let summaryElement = '';

            let tempInnerElement = '';
            let tempOuterElement = '';

            let groupedByPhase = rows.reduce((result, currentObj) => {
                let phaseCodeName = '';
                if (currentObj.phaseCodeName === "단원도입") {
                    phaseCodeName = "introduction";
                } else if (currentObj.phaseCodeName === "도입") {
                    phaseCodeName = "development";
                } else if (currentObj.phaseCodeName === "전개") {
                    phaseCodeName = "expansion";
                } else {
                    phaseCodeName = "summary"
                }

                // 해당 phaseCodeName에 대한 배열이 이미 존재하는지 확인
                if (!result[phaseCodeName]) {
                    // 존재하지 않으면 해당 phaseCodeName에 대한 빈 배열을 생성
                    result[phaseCodeName] = [];
                }

                // 현재 객체를 해당 phaseCodeName의 배열에 추가
                result[phaseCodeName].push(currentObj);

                return result;
            }, {});

            // 학습 목차 엘리먼트들 초기화
            $('.lesson-items').html('');

            // 각 단계의 한글이름 세팅, 각 단계 이하 수업 생성
            const phases = ['introduction', 'development', 'expansion', 'summary'];
            for (const phaseName of phases) {

                let koreanPhaseName = '';

                switch (phaseName) {
                    case 'introduction':
                        koreanPhaseName = '단원 도입';
                        break;
                    case 'development':
                        koreanPhaseName = '도입';
                        break;
                    case 'expansion':
                        koreanPhaseName = '전개';
                        break;
                    default:
                        koreanPhaseName = '정리';
                }


                // 해당 단계에 대한 배열이 없는 경우 'no-data' 클래스를 가진 div를 추가
                if (groupedByPhase[phaseName] && groupedByPhase[phaseName].length > 0) {
                    $('.lesson-items').append(`
                            <div class="item" data-phase="${phaseName}">
                                <span class="badge-lesson">${koreanPhaseName}</span>
                                <div class="lesson-data"></div>
                            </div>
                        `);

                    for (const lesson of groupedByPhase[phaseName]) {
                        let mainPageInfoElement = '';
                        let subPageInfoElement = '';
                        const subTextbookName = classLayerScreen.v.subjectInfo.subTextbookName;

                        if (!lesson.textbookStartPage) {
                            mainPageInfoElement = '';
                        } else {
                            if (lesson.textbookStartPage && lesson.textbookEndPage) {
                                mainPageInfoElement = `<span class="badge fill-light"> ${classLayerScreen.v.subjectInfo.textbookName} ${lesson.textbookStartPage}~${lesson.textbookEndPage}p </span>`
                            } else if (lesson.textbookStartPage && !lesson.textbookEndPage) {
                                mainPageInfoElement = `<span class="badge fill-light"> ${classLayerScreen.v.subjectInfo.textbookName} ${lesson.textbookStartPage}p </span>`
                            }
                        }

                        if (!subTextbookName) {
                            subPageInfoElement = '';
                        } else if (subTextbookName && lesson.subPageUseYn === 'Y') {
                            if (lesson.subTextbookStartPage && lesson.subTextbookEndPage) {
                                subPageInfoElement = `<span class="badge fill-light">${subTextbookName} ${lesson.subTextbookStartPage}~${lesson.subTextbookEndPage}p</span>`;
                            } else if (lesson.subTextbookStartPage && !lesson.subTextbookEndPage) {
                                subPageInfoElement = `<span class="badge fill-light">${subTextbookName} ${lesson.subTextbookStartPage}p</span>`;
                            } else {
                                subPageInfoElement = '';
                            }
                        }


                        let itemClass = lesson.classType === 'CLASS' || !lesson.classType ? 'data' : 'data referenceData'
                        let classSeq = lesson.classType === 'CLASS' ? lesson.referenceSeq : !lesson.classType ? lesson.classSeq : '';
                        let className = lesson.displayName ? lesson.displayName : lesson.className;

                        tempInnerElement = `
                                <div class="${itemClass}" 
                                    data-class-seq="${lesson.classSeq ? lesson.classSeq : ''}" 
                                    data-phase-code="${lesson.phasecode ? lesson.phasecode : ''}"
                                    data-reference-seq="${lesson.referenceSeq ? lesson.referenceSeq : ''}"
                                  
                                    data-file-id="${lesson.classFileId ? lesson.classFileId : ''}"
                                    data-drag-yn="${lesson.dragyn ? lesson.dragyn : 'Y'}"
                                    style="cursor:pointer;"
                                >
                                    <div class="inner-wrap">
                                        <div class="image-wrap">
                                            <img src="${lesson.thumbnailPath ? lesson.thumbnailPath : '/assets/images/temp/img-lesson02.png'}" alt="">
                                        </div>
                                        <a>
                                            <div class="badges">
                                            ${lesson.cornerName ? `
                                                <span class="badge type-round-box" 
                                                style="background-color:${lesson.cornerBgRgbCode ? `#${lesson.cornerBgRgbCode}` : '#36BAC1'}; 
                                                color:${lesson.cornerTextRgbCode ? `#${lesson.cornerTextRgbCode}` : '#FFFFFF'};">${lesson.cornerName}</span>
                                            ` : ''}
                                            ${lesson.classType === 'TEXTBOOK' ? `<span class="text-primary text-xxs">교과자료</span>`
                            : lesson.classType === 'TOTALBOARD' ? `<span class="text-primary text-xxs">${lesson.code2Name}</span>`
                                : lesson.classType === 'SCRAP' ? `<span class="text-primary text-xxs">스크랩 자료</span>`
                                    : lesson.classType === 'MYDATA' ? `<span class="text-primary text-xxs">내 링크 자료</span>` : ''}
                                            </div>
                                            <strong data-reference-url="${lesson.referenceUrl ? lesson.referenceUrl : ''}">${className ? className : "(수업명이 없습니다)"}</strong>
                                            ${lesson.classType === 'CLASS' || !lesson.classType ? `
                                                <div class="number-pages">
                                                ${mainPageInfoElement}
                                                ${subPageInfoElement}
                                                </div>
                                            ` : ''}
                                        </a>
                                    </div>
                                    <button class="icon-button" data-type="closeBtn">
                                        <svg>
                                            <title>삭제 아이콘</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close-round"></use>
                                        </svg>
                                    </button>
                                </div>
                            `

                        $('.lesson-items [data-phase="' + phaseName + '"] .lesson-data').append(tempInnerElement);
                    }
                }

            }

            $('.inner-wrap strong').on('click', function (event) {
                if ($(this).data('reference-url')) {
                    window.open($(this).data('reference-url'), '_blank');
                } else {
                    event.stopPropagation();
                }
            })

            $('.lesson-data').on('click', '.data', function (event) {
                event.stopPropagation();
            });

            // classLayerScreen.f.dragDrop();

        },

        // 교과목 리스트 및 active 세팅
        setTextSubjectList: function (list, callType) {
            // 이전에 등록된 click 이벤트 제거
            $('.item-wrap a').off('click');
            // active 제거
            $('.item-wrap div[data-type="textbook"] a').removeClass('active');

            if (callType !== 'init' && list.length > 0) {
                list[0].selectedYn = 'Y';
            }

            let tempList = '';
            let textbookNameList = '';
            let textbookNameListElement = '';
            const masterSeq = classLayerScreen.v.masterSeq;

            $.each(list, function (index, item) {
                let author = item.leadAuthorName ? item.leadAuthorName : null;
                tempList = `
                        <a href="" 
                            data-masterseq="${item.masterSeq}" 
                            class="${item.selectedYn === 'Y' ? 'active' : ''}">
                            ${item.textbookName} ${author !== "" && author !== null && author !== undefined ? `(${author})` : ''}
                        </a>
                    `
                textbookNameList += tempList
            })

            textbookNameListElement = `
                    <strong>과목</strong>
                    <div class="depth-2 scrollbar-styled" data-type="textbook">
                    ${textbookNameList}
                    </div>
                `

            $('.sub-item.grow-2:first').html(textbookNameListElement);

            if (callType !== 'init') {
                classLayerScreen.v.masterSeq = $('.depth-2[data-type="textbook"] a:first-child').data('masterseq');
                classLayerScreen.c.getUnitListByDepth('textbook');
            }

            // 클릭 이벤트 다시 등록
            classLayerScreen.f.registerClickEvent();

            $('.scrollbar-styled').each(function () {
                $(this).mCustomScrollbar({
                    theme              : "minimal-dark",
                    scrollInertia      : 150,
                    autoExpandScrollbar: true,
                    scrollEasing       : "linear"
                });
            })

        },

        // 단원 리스트 및 active 세팅
        setUnitList: function (callType, unit1List, unit2List, unit3List) {
            classLayerScreen.v.unit1List = unit1List;
            classLayerScreen.v.unit2List = unit2List;
            classLayerScreen.v.unit3List = unit3List;

            // item-wrap 클래스 이하의 하위 엘리먼트들을 선택
            const itemWrap = $('.item-wrap');

            // 추가할 대중소 단원 html 코드
            const bigunitHTML = `
                    <div class="sub-item grow-4" data-type="bigunit">
                        <strong>대단원</strong>
                    </div>
                `;

            const middleunitHTML = `
                    <div class="sub-item grow-4" data-type="middleunit">
                        <strong>중단원</strong>
                    </div>
                `;

            const smallunitHTML = `
                    <div class="sub-item grow-3" data-type="smallunit">
                        <strong>소단원</strong>
                    </div>
                `;


            let bigunitElement = $('.sub-item[data-type="bigunit"]');
            let middleunitElement = $('.sub-item[data-type="middleunit"]');
            let smallunitElement = $('.sub-item[data-type="smallunit"]');

            bigunitElement.find('.depth-2.scrollbar-styled').remove();
            middleunitElement.find('.depth-2.scrollbar-styled').remove();
            smallunitElement.find('.depth-2.scrollbar-styled').remove();


            // 대,중,소단원 엘리먼트가 존재하는지 확인 후 없다면 추가
            if (unit1List.length !== 0) {
                if (bigunitElement.length === 0) {
                    itemWrap.append(bigunitHTML);
                }
            }

            if (unit2List.length !== 0) {
                // middleunit 타입이 bigunit 다음에 있는지 확인하고 없다면 추가
                if (middleunitElement.length === 0 && bigunitElement.length > 0) {
                    bigunitElement.after(middleunitHTML);
                }
            }


            if (unit3List.length !== 0) {
                // smallunit 타입이 middleunit 다음에 있는지 확인하고 없다면 추가
                if (smallunitElement.length === 0 && $('.sub-item[data-type="middleunit"]').length > 0) {
                    $('.sub-item[data-type="middleunit"]').after(smallunitHTML);
                }
            }

            if (bigunitElement.find('.depth-2.scrollbar-styled').length === 0) {
                bigunitElement.append('<div class="depth-2 scrollbar-styled"></div>');
            }

            if (middleunitElement.find('.depth-2.scrollbar-styled').length === 0) {
                middleunitElement.append('<div class="depth-2 scrollbar-styled"></div>');
            }

            if (smallunitElement.find('.depth-2.scrollbar-styled').length === 0) {
                smallunitElement.append('<div class="depth-2 scrollbar-styled"></div>');
            }


            let bigUnitDepth2 = $('.sub-item[data-type="bigunit"]').find('.depth-2');
            let middleUnitDepth2 = $('.sub-item[data-type="middleunit"]').find('.depth-2');
            let smallUnitDepth2 = $('.sub-item[data-type="smallunit"]').find('.depth-2');


            // 상위 breadcrumbs 제어
            if (unit1List.length === 0) {
                $('.breadcrumbs ul li').slice(3, 6).remove();
            } else if (unit2List.length === 0) {
                $('.breadcrumbs ul li').slice(4, 6).remove();
            } else if (unit3List.length === 0) {
                $('.breadcrumbs ul li').slice(5, 6).remove();
            }

            // 각 단원별 단원명 엘리먼트 만들기
            let eachBigUnit = '';
            let eachMiddleUnit = '';
            let eachSmallUnit = '';

            // 차시창 초기 시작 or 과목명 클릭시
            if (callType === 'firstGet') {
                // 대단원 이하 depth-2 리스트 초기화
                bigUnitDepth2.html('');

                // ----- 대단원 이름 하나씩 추가
                unit1List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(4) a').text(item.unitName).prop('data-unit1-seq', item.unitSeq);

                    // callType이 init 이거나 first 일 경우에만 selectedYn 값에 따라서 active 할당?
                    return eachBigUnit += `<a href="" class="${classLayerScreen.v.bigUnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                // 단원명 리스트 넣기
                bigUnitDepth2.html(eachBigUnit);
            } else if (callType === 'secondGet') {
                // 대단원 이하 depth-2 리스트 초기화
                bigUnitDepth2.html('');

                // ----- 대단원 이름 하나씩 추가
                unit1List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(4) a').text(item.unitName).prop('data-unit1-seq', item.unitSeq);

                    // callType이 init 이거나 first 일 경우에만 selectedYn 값에 따라서 active 할당?
                    return eachBigUnit += `<a href="" class="${classLayerScreen.v.bigUnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                // 단원명 리스트 넣기
                bigUnitDepth2.html(eachBigUnit);

                // 중단원 이하 depth-2 리스트 초기화
                middleUnitDepth2.html('');

                // ----- 중단원 이름 하나씩 추가
                unit2List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(5) a').text(item.unitName).prop('data-unit2-seq', item.unitSeq);

                    return eachMiddleUnit += `<a href="" class="${classLayerScreen.v.middleUnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                middleUnitDepth2.html(eachMiddleUnit);
            } else if (callType === 'thirdGet') {
                // 대단원 이하 depth-2 리스트 초기화
                bigUnitDepth2.html('');

                // ----- 대단원 이름 하나씩 추가
                unit1List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(4) a').text(item.unitName).prop('data-unit1-seq', item.unitSeq);

                    // callType이 init 이거나 first 일 경우에만 selectedYn 값에 따라서 active 할당?
                    return eachBigUnit += `<a href="" class="${classLayerScreen.v.bigUnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                // 단원명 리스트 넣기
                bigUnitDepth2.html(eachBigUnit);

                // 중단원 이하 depth-2 리스트 초기화
                middleUnitDepth2.html('');

                // ----- 중단원 이름 하나씩 추가
                unit2List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(5) a').text(item.unitName).prop('data-unit2-seq', item.unitSeq);

                    return eachMiddleUnit += `<a href="" class="${classLayerScreen.v.middleUnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                middleUnitDepth2.html(eachMiddleUnit);

                // 소단원 이하 depth-2 리스트 초기화
                smallUnitDepth2.html('');

                // ----- 소단원 이름 하나씩 추가
                unit3List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(6) a').text(item.unitName).prop('data-unit3-seq', item.unitSeq);

                    return eachSmallUnit += `<a href="" class="${classLayerScreen.v.smallUnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                smallUnitDepth2.html(eachSmallUnit);
            } else {
                // 대단원 이하 depth-2 리스트 초기화
                bigUnitDepth2.html('');

                // ----- 대단원 이름 하나씩 추가
                unit1List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(4) a').text(item.unitName).prop('data-unit1-seq', item.unitSeq);

                    // callType이 init 이거나 first 일 경우에만 selectedYn 값에 따라서 active 할당?
                    return eachBigUnit += `<a href="" class="${classLayerScreen.v.depth1UnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                // 단원명 리스트 넣기
                bigUnitDepth2.html(eachBigUnit);

                // 중단원 이하 depth-2 리스트 초기화
                middleUnitDepth2.html('');

                // ----- 중단원 이름 하나씩 추가
                unit2List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(5) a').text(item.unitName).prop('data-unit2-seq', item.unitSeq);

                    return eachMiddleUnit += `<a href="" class="${classLayerScreen.v.depth2UnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                middleUnitDepth2.html(eachMiddleUnit);

                // 소단원 이하 depth-2 리스트 초기화
                smallUnitDepth2.html('');

                // ----- 소단원 이름 하나씩 추가
                unit3List?.forEach(item => {
                    item.selectedYn === 'Y' && $('.breadcrumbs ul li:nth-child(6) a').text(item.unitName).prop('data-unit3-seq', item.unitSeq);

                    return eachSmallUnit += `<a href="" class="${classLayerScreen.v.depth3UnitSeq === item.unitSeq ? 'active' : ''}" data-unitseq="${item.unitSeq}">
                            ${item.unitNumberName}${item.unitNumberName.includes('.') ? '' : '.'}
                            ${item.unitName}</a>`
                })

                smallUnitDepth2.html(eachSmallUnit);
            }

            // 리스트 삭제 - 1. 대단원만 있는 경우
            if (unit1List.length > 0 && unit2List.length === 0 && unit3List.length === 0) {
                middleunitElement.remove();
                smallunitElement.remove();
                // 리스트 삭제 - 2. 대단원 + 중단원이 있는 경우
            } else if (unit1List.length > 0 && unit2List.length > 0 && unit3List.length === 0) {
                smallunitElement.remove();
            }

            // 클릭 이벤트 다시 등록
            classLayerScreen.f.registerClickEvent();

            $('.scrollbar-styled').each(function () {
                $(this).mCustomScrollbar({
                    theme              : "minimal-dark",
                    scrollInertia      : 150,
                    autoExpandScrollbar: true,
                    scrollEasing       : "linear"
                })
            })
        },

        // 차시 리스트 및 active 세팅
        setSubjectList: function (list, callType) {
            const subjectListElement = $('#other-items > div.item-wrap > .sub-item[data-type="subject"]');
            let eachSubject = '';

            subjectListElement.find('.depth-2.scrollbar-styled').remove();

            // 리스트 초기화
            subjectListElement.find('.depth-2').html('');

            if (callType !== 'init') {
                list[0].selectedYn = 'Y'
            } // 첫 번째 아이템 active

            // 차시명 하나씩 추가
            list?.forEach(item => {

                let subjectNumber = '';

                if (item.startSubject) {
                    subjectNumber += `[${item.startSubject}`;

                    if (item.endSubject) {
                        subjectNumber += `~${item.endSubject}`;
                    }

                    subjectNumber += '차시]';
                }

                const activeClass = item.selectedYn === 'Y' ? 'active' : '';

                eachSubject += `
                        <a href="" class="${activeClass}" data-subjectseq="${item.subjectSeq}">
                            ${subjectNumber} ${item.subjectName}
                        </a>`;
            })

            if (subjectListElement.find('.depth-2.scrollbar-styled').length === 0) {
                subjectListElement.append('<div class="depth-2 scrollbar-styled"></div>');
            }

            subjectListElement.find('.depth-2').html(eachSubject);
        },

        // 자료 없는경우 div 넣기
        setNoDataDiv: function (phaseName) {
            const lessonDataElement = $('.lesson-items [data-phase="' + phaseName + '"] .lesson-data');

            // lesson-data 이하의 div.data 중 data-type이 "reference"인 div가 없으면 no-data를 추가
            if (!lessonDataElement.find('.data[data-type="reference"]').length) {
                lessonDataElement.append(`
                        <div class="no-data">
                            <strong>자료를 드래그하여 추가할 수 있습니다.</strong>
                        </div>
                    `);
            }
        },

        registerClickEvent: function () {
            const aTags = $('.item-wrap a');
            aTags.off('click');

            aTags.on('click', function (e) {
                e.preventDefault();
                classLayerScreen.f.onClickHandler(e);
            });
        },

        // 학년, 학기, 과목, 단원, 차시 클릭 핸들러
        onClickHandler: function (e) {
            e.preventDefault();

            let isClickEventRunning = classLayerScreen.v.isClickEventRunning;

            // 클릭 이벤트 중첩 방지 변수가 true일 때는 추가 클릭 이벤트를 막음
            if (isClickEventRunning) {
                e.stopImmediatePropagation();
                return;
            }

            if (!isClickEventRunning) {
                classLayerScreen.v.isClickEventRunning = true;

                const clickedATag = $(e.target);
                const parentType = clickedATag.closest('div.depth-2').data('type');

                if (parentType === 'grade') {
                    let gradeCode = '';
                    if (clickedATag.text().includes('1')) {
                        gradeCode = '01';
                    } else if (clickedATag.text().includes('2')) {
                        gradeCode = '02';
                    } else if (clickedATag.text().includes('3')) {
                        gradeCode = '03';
                    } else if (clickedATag.text().includes('4')) {
                        gradeCode = '04';
                    } else if (clickedATag.text().includes('5')) {
                        gradeCode = '05';
                    } else {
                        gradeCode = '06';
                    }

                    classLayerScreen.v.gradeCode = gradeCode;

                } else if (parentType === 'term') {
                    let termCode = '';
                    clickedATag.text().includes('1학기') ? termCode = '01' : termCode = '02';

                    classLayerScreen.v.termCode = termCode;

                }

                // 학년이나 학기 변경시 getTextbookList Ajax호출
                if (parentType === 'grade' || parentType === 'term') {
                    classLayerScreen.c.getTextbookList();
                }


                let dataType = clickedATag.closest('[data-type]').attr('data-type');

                // active 클래스 제어
                // clickedATag.siblings('a').removeClass('active');
                // clickedATag.addClass('active');
                clickedATag.closest('div.depth-2').find('a').removeClass('active'); // 현재 클릭된 요소의 부모 div 내의 모든 a 태그에서 active 클래스 제거
                clickedATag.addClass('active'); // 클릭된 a 태그에 active 클래스 추가

                // masterSeq, unitSeq, subjectSeq 변경시 세팅
                if (dataType === 'textbook') {
                    classLayerScreen.v.masterSeq = $(e.target).data('masterseq');
                } else if (dataType === 'bigunit') {
                    classLayerScreen.v.bigUnitSeq = $(e.target).data('unitseq');
                } else if (dataType === 'middleunit') {
                    classLayerScreen.v.middleUnitSeq = $(e.target).data('unitseq');
                } else if (dataType === 'smallunit') {
                    classLayerScreen.v.smallUnitSeq = $(e.target).data('unitseq');
                } else if (dataType === 'subject') {
                    classLayerScreen.v.subjectSeq = $(e.target).data('subjectseq');
                }

                // 교과서, 단원, 차시 변경시 unitListByDepth Ajax호출
                if (dataType === 'textbook') {
                    classLayerScreen.c.getUnitListByDepth('textbook');
                } else if (dataType === 'bigunit') {
                    classLayerScreen.c.getUnitListByDepth('bigunit');
                } else if (dataType === 'middleunit') {
                    classLayerScreen.c.getUnitListByDepth('middleunit');
                } else if (dataType === 'smallunit') {
                    classLayerScreen.c.getUnitListByDepth('smallunit');
                } else if (dataType === 'subject') {
                    // 현재 주소를 가져오기
                    let currentUrl = window.location.href;
                    let newSubjectSeq = classLayerScreen.v.subjectSeq;

                    if (newSubjectSeq) {
                        let newUrl = currentUrl.replace(/subjectSeq=\d+/, 'subjectSeq=' + newSubjectSeq);
                        window.location.href = newUrl;
                    }
                }


                // 클릭 이벤트 중첩 방지 해제
                classLayerScreen.v.isClickEventRunning = false;

            }
        },

        // 드래그앤드롭
        dragDrop: function () {
            let draggedItemInfo = classLayerScreen.v.draggedItemInfo; // 드래그 중인 아이템의 정보 저장 변수

            // new
            // 드래그 앤 드롭 라이브러리 초기화 및 설정

            // 이전 인스턴스 정리
            if (classLayerScreen.v.drake) {
                classLayerScreen.v.drake.destroy();
            }

            classLayerScreen.v.drake = dragula({
                copy: function (el, source) {
                    return $(el).closest('section').attr('id') === 'dragContainer2';
                }
            });

            classLayerScreen.v.drake.containers = []; // 추가

            // 모든 lesson-data 클래스를 가진 요소에 대해 반복
            $('.lesson-data').each(function () {
                // 해당 lesson-data를 drake에 추가
                classLayerScreen.v.drake.containers.push(this);
            });


            // 첫 번째 섹션에서 아이템을 드래그할 때 이벤트 리스너
            classLayerScreen.v.drake.on('drag', function (el, source) {

                // 이동 전의 요소 정보 저장
                draggedItemInfo = {
                    sourceSectionId: $(el).closest('section').attr('id'),
                    isLastItem     : isLastItem(el, source),
                    draggedItemEl  : $(source),
                };

                // no-data 클래스 div는 이동을 막음
                if ($(el).hasClass('no-data') || $(el).data('dragYn') !== 'Y') {
                    classLayerScreen.v.drake.cancel(true);
                }

            });

            // 1->2, 2->2의 이동을 막음
            classLayerScreen.v.drake.on('drop', function (el, target, source, sibling) {
                try {
                    let targetElement = classLayerScreen.v.targetElement;
                    let isItemFromContainer1 = classLayerScreen.v.isItemFromContainer1;
                    targetElement = $(el).closest('section').attr('id');
                    isItemFromContainer1 = draggedItemInfo && draggedItemInfo.sourceSectionId === 'dragContainer1';

                    let isItem1to1 = classLayerScreen.v.isItem1to1;
                    let isItem2to1 = classLayerScreen.v.isItem2to1;
                    let isItem1to2 = classLayerScreen.v.isItem1to2;
                    let isItem2to2 = classLayerScreen.v.isItem2to2;


                    // 1에서 1로 이동인지 여부
                    isItem1to1 = draggedItemInfo !== null && (targetElement === 'dragContainer1' && draggedItemInfo.sourceSectionId === 'dragContainer1');

                    // 2에서 2로 이동인지 여부
                    isItem2to2 = draggedItemInfo !== null && (targetElement === 'dragContainer2' && draggedItemInfo.sourceSectionId === 'dragContainer2')

                    // 1에서 2로 이동인지 여부
                    isItem1to2 = draggedItemInfo !== null && (targetElement === 'dragContainer2' && draggedItemInfo.sourceSectionId === 'dragContainer1')

                    if (isItem2to2 || isItem1to2) {
                        classLayerScreen.v.drake.cancel(true);
                    } else if (targetElement === 'dragContainer1') {
                        // 첫번째 section에 아이템이 추가되었을 때 저장하기 레이어 띄우기, 취소시 감추기
                        $('.period-float .float-inner').addClass('active');
                        $('.float-inner button:first-child').on('click', function () {
                            $('.period-float .float-inner').removeClass('active');
                            location.reload(true);
                        })
                        classLayerScreen.f.handleSaveLayer();
                    }

                    // 마지막 아이템인 경우, 드래그가 시작된 위치에 no-data를 추가
                    if (draggedItemInfo && draggedItemInfo.isLastItem && $(source).find('.data').length === 0) {
                        $(source).append(`
                                <div class="no-data">
                                    <strong>자료를 드래그하여 추가할 수 있습니다.</strong>
                                </div>
                            `);
                    }

                    // 아이템이 없는 위치에 드롭시, 드롭된 위치에서 no-data 아이템을 제거
                    if ($(target).find('.no-data').length > 0) {
                        $(target).find('.no-data').remove();
                    }

                    // 이동 후에는 드래그 정보 초기화
                    classLayerScreen.v.draggedItemInfo = null;

                    // 마우스 호버 이벤트 추가
                    $('.lesson-data .data').mouseover(function () {
                        $(this).css("cursor", "pointer");
                    });

                    classLayerScreen.f.handleDeleteBtn();
                } catch (e) {
                    console.log("drop event error: ", e)
                }

            });

            // 드래그 중인 아이템이 마지막인지 확인하는 함수
            function isLastItem(item, source) {
                const items = $(source).children('.data');
                const lastItem = items.last()[0];
                return item === lastItem;
            }
        },

        // 삭제 버튼 핸들러
        handleDeleteBtn: function () {
            $('button[data-type="closeBtn"]').off('click');
            $('button[data-type="closeBtn"]').on('click', function (e) {
                e.preventDefault();
                let dataDivCount = $(this).parents('.lesson-data').find('.data').length;

                if (dataDivCount === 1) {
                    $(this).closest('.lesson-data').append(`
                        <div class="no-data">
                            <strong>자료를 드래그하여 추가할 수 있습니다.</strong>
                        </div>
                    `);
                }

                $(this).closest('.data').remove();

                if (!$('.period-float .float-inner').hasClass('active')) {
                    $('.period-float .float-inner').addClass('active');
                    $('.float-inner button:first-child').on('click', function () {
                        $('.period-float .float-inner').removeClass('active');
                        location.reload(true);
                    })
                    classLayerScreen.f.handleSaveLayer();
                }
            });
        },

        // 저장 버튼 핸들러
        handleSaveLayer: function () {
            $('.float-inner button[data-type="saveBtn"]').off('click').on('click', function (e) {
                classLayerScreen.v.classListSaveData = [];

                let orderingCounter = 1;
                $('.lesson-items .data').each(function () {
                    let currentItem = {};
                    let phase = $(this).closest('.item').data('phase');

                    currentItem.subjectSeq = classLayerScreen.v.subjectInfo.subjectSeq;
                    currentItem.phaseCode = phase === 'introduction' ? 'UNIT_INTRO'
                        : phase === 'development' ? 'INTRO'
                            : phase === 'expansion' ? 'DEVELOP'
                                : phase === 'summary' ? 'FINISH'
                                    : '';

                    if ($(this).hasClass('referenceData')) {
                        let spanText = $(this).find('a span').text();

                        if (spanText.includes('교과')) {
                            currentItem.classType = 'TEXTBOOK';
                        } else if (spanText.includes('스크랩')) {
                            currentItem.classType = 'SCRAP';
                        } else if (spanText.includes('내 링크')) {
                            currentItem.classType = 'MYDATA';
                        } else {
                            currentItem.classType = 'TOTALBOARD';
                        }

                        currentItem.referenceSeq = $(this).data('reference-seq');
                        currentItem.classFileId = $(this).data('file-id');
                    } else {
                        currentItem.classType = 'CLASS';
                        currentItem.referenceSeq = $(this).data('class-seq');
                    }

                    currentItem.ordering = orderingCounter++;
                    classLayerScreen.v.classListSaveData.push(currentItem);
                });

                classLayerScreen.f.alertClassListSave();
                classLayerScreen.c.saveClassList();
            });
        },

        showDefaultSaveClassList: function (type) {
            // 현재 URL에서 쿼리스트링 부분을 가져오기
            let queryString = window.location.search;

            // URLSearchParams 객체를 사용하여 쿼리스트링 파싱
            let searchParams = new URLSearchParams(queryString);

            classLayerScreen.v.subjectSeq = searchParams.get('subjectSeq');

            if (type === 'save') {
                classLayerScreen.v.classListSaveType = 'SAVE';
            } else if (type === 'default') {
                classLayerScreen.v.classListSaveType = 'DEFAULT';
            }
            classLayerScreen.c.getClassList();
        },

        // 이전, 다음 차시 버튼 기능
        handlePrevNextSubject: function (subjectInfo) {
            $('.contents-header .toggle-group button').off('click').on('click', function (e) {
                let index = $(this).index();

                // 현재 주소를 가져오기
                let currentUrl = window.location.href;
                let newSubjectSeq = '';

                if (index === 0) {
                    if (!subjectInfo.prevSubjectSeq) {
                        e.preventDefault();
                        $alert.open("MG00028");
                    }

                    newSubjectSeq = subjectInfo.prevSubjectSeq;
                } else if (index === 1) {
                    if (!subjectInfo.nextSubjectSeq) {
                        e.preventDefault();
                        $alert.open("MG00029");
                    }

                    newSubjectSeq = subjectInfo.nextSubjectSeq;
                }


                if (newSubjectSeq) {
                    let newUrl = currentUrl.replace(/subjectSeq=\d+/, 'subjectSeq=' + newSubjectSeq);
                    window.location.href = newUrl;
                }
            });
        },

        // 학습목차 저장 dialog
        alertClassListSave: function () {
            if (classLayerScreen.v.isClassEverSaved) {
                $alert.open("MG00024", function () {
                    $alert.open("MG00025");
                    classLayerScreen.c.saveClassList();
                    $('.lesson-header > button').html(`
                        기본목차보기
                        <svg>
                            <title>리스트 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                        </svg>
                    `);
                });
            } else {
                $alert.open("MG00025");
                classLayerScreen.c.saveClassList();
                $('.lesson-header > button').html(`
                    저장목차보기
                    <svg>
                        <title>리스트 아이콘</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                    </svg>
                `);
            }
        },

        // 로그인 안내 alert
        loginAlert: () => {
            $alert.alert('로그인이 필요합니다.', 'negative', 'info', () => {
                window.location.href = "/pages/common/User/Login.mrn";
            })
        },

        // 정회원 교사만 사용 가능 alert
        needAuthAlert: () => {
            $alert.open("MG00011", () => {
                window.location.href = '/pages/common/mypage/myinfo.mrn';
            });
        },

        loginCheck: function () {
            console.log($isLogin);
            console.log($('#userGrade').val());

            if ($isLogin) {
                if ($('#userGrade').val() === '001') {
                    classLayerScreen.f.needAuthAlert();
                }
            } else {
                classLayerScreen.f.loginAlert();
                if ($('.wrapper-lesson').length > 0) {
                    $('[name="btnCancle"]').off('click').on('click', () => {
                        window.location.href = '/pages/ele/Main.mrn';
                    })
                }
            }

        }
    },

    init: function (event) {
        classLayerScreen.f.loginCheck();
        if ($isLogin) {
            classLayerScreen.f.setClassInfo();
        }
        classLayerScreen.event();
        classLayerScreen.f.handleDeleteBtn();

        $('.period-float .float-inner').removeClass('active');

    },

    event: function () {
        let masterSeq = classLayerScreen.v.masterSeq;
        let unitSeq = classLayerScreen.v.unitSeq;
        let subjectSeq = classLayerScreen.v.subjectSeq;

        $("#other-items a").click(function (event) {
            event.preventDefault();
        });

        $('.lesson-data .data').mouseover(function () {
            $(this).css("cursor", "pointer");
        });

        $('.customQnA').on('click', function () {
            window.location.href = `/pages/common/customer/request.mrn?chasi=${classLayerScreen.v.subjectSeq}`;
        })

        /*  기본 목차 보기 / 저장 목차 보기 (Toggle Button)
            - 학습 목차 List 편집 이력 여부에 따라 본 버튼 노출/미노출 처리
                ■ 버튼 노출 Case
                 해당 User 학습 목차 수정 이력이 존재하는 차시(주제) 페이지의 경우 본 버튼을 노출하며,
                버튼 선택에 따라 토글 버튼 출력 처리
                    ◆ 기본 목차 보기(Default)  해당 차시 학습 목차 수정 이력 존재 시 본 버튼 출력
                     선택 시 해당 차시에 기본(관리자)으로 설정된 목차 순으로 학습 목차 출력되며, 해당 버튼 저장 목차 보기‘ 버튼으로 변경 처리
                    ◆ 저장 목차 보기  선택 시 해당 User가 편집한 목차 순으로 학습 목차 출력되며, 해당 버튼 ‘기본 목차 보기’버튼으로 변경 처리
                ■ 버튼 미노출 Case
                 해당 User 학습 목차 수정 이력이 존재하지 않을 경우, 본 버튼 미노출 처리
         */

        $('.lesson-header > button').off('click').on('click', function (event) {
            if ($(this).text().includes("저장")) {
                classLayerScreen.f.showDefaultSaveClassList("save");
                $('.lesson-header > button').html(`
                    기본목차보기
                    <svg>
                        <title>리스트 아이콘</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                    </svg>
                `);
            } else {
                classLayerScreen.f.showDefaultSaveClassList("default");
                $('.lesson-header > button').html(`
                    저장목차보기
                    <svg>
                        <title>리스트 아이콘</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                    </svg>
                `);
            }
        })

        classLayerScreen.f.handlePrevNextSubject(classLayerScreen.v.subjectInfo);

        $('button[data-type="openClass"]').on('click', function () {
            // const classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
            // const urlWithParameters = `${classLayerUrl}${classLayerScreen.v.subjectSeq}`;
            // window.open(urlWithParameters, '_blank');
        })


        // Mutation Observer 생성
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 'other-items' ID를 가진 요소의 display 속성이 변경될 때
                if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                    const otherItemsElement = $('#other-items');

                    // display 속성이 'block'이 될 때
                    // if (otherItemsElement.length > 0 && otherItemsElement.css('display') === 'block') {
                    //     $('#other-items > div.item-wrap > .sub-item[data-type="subject"]').find('.depth-2').removeClass('scrollbar-styled')
                    //
                    //     $('#other-items > div.item-wrap > .sub-item[data-type="subject"]').find('.depth-2').css({
                    //         overflow: 'auto'
                    //     })
                    //
                    //     $('#other-items > div.item-wrap > .sub-item[data-type="subject"]').find('.depth-2').each(function () {
                    //         // 스크롤이 발생하는 경우
                    //         if (this.scrollHeight > this.clientHeight) {
                    //             $(this).css({
                    //                 'overflow-y': 'scroll',
                    //                 'scrollbar-width': 'thin',
                    //                 'scrollbar-color': '#ccc #f1f1f1',
                    //                 'border-right': '1px solid #e6e6e6',
                    //                 'touch-action': 'pinch-zoom',
                    //                 'padding-bottom': '40px',
                    //                 'padding-top': '40px',
                    //                 'scrollbar-base-color': 'transparent',
                    //             })
                    //         } else {
                    //             // 스크롤이 발생하지 않는 경우, 스크롤 영역을 감추기
                    //             $(this).css({
                    //                 'overflow-y': 'hidden',
                    //                 'scrollbar-width': 'initial',
                    //                 'scrollbar-color': 'initial',
                    //                 'border-right': 'initial',
                    //                 'touch-action': 'initial',
                    //             });
                    //         }
                    //     });
                    // }
                }
            });
        });

        // 'other-items' ID를 가진 요소를 감시
        const targetElement = $('#other-items');
        if (targetElement.length > 0) {
            observer.observe(targetElement[0], {attributes: true});
        }

    }
};
classLayerScreen.init();