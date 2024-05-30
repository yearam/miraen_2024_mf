
let classLayerScreen


classLayerScreen = {
    /**
     * 내부 전역변수
     *
     * @memberOf classLayerScreen
     */
    v: {
        subjectInfo: {
            subjectSeq: 2,
            subjectName: "",
            startSubject: 1,
            endSubject: 2,
            textbookStartPage: 1,
            nextSubjectSeq: 3,
            textbookName: "",
            mainTextbookYn: "Y",
            subMasterYn: "N",
            masterSeq: 1,
            gradeCode: "01",
            termCode: "01",
            subjectCode: "KOA",
            depth1UnitSeq: 1,
            depth2UnitSeq: 0,
            depth3UnitSeq: 0,
            textbookEndPage: '',
            subTextbookStartPage: '',
            subTextbookEndPage: '',
        },
        drake: '',
        draggedItemInfo: null,
        targetElement: '',
        isItemFromContainer1: '',
        isItem1to1: '',
        isItem2to1: '',
        isItem2to2: '',
        isItem1to2: '',
        masterSeq: 1,
        unitSeq: '',
        subjectSeq: '',
        subjectRevisionCode: '2015',
        gradeCode: '01',
        termCode: '01',
        bigUnitSeq: '',
        middleUnitSeq: '',
        smallUnitSeq: '',
        coursewareCode: '',
        subjectTypeCode: '',
        isClickEventRunning: false, // 다른 차시보기 a 태그 클릭 이벤트 활성화 여부
        otherClassOpened: false, // 다른 차시보기 레이어 열림 여부
        classListSaveData: [],
        classListSaveType: 'SAVE',
        isClassEverSaved: false,
        prevSubjectSeq: '',
        nextSubjectSeq: '',
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
                url: '/pages/ele/textbook/textbookList.ax',
                data: {
                    subjectRevisionCode: classLayerScreen.v.subjectRevisionCode,
                    gradeCode: classLayerScreen.v.gradeCode,
                    termCode: classLayerScreen.v.termCode,
                    subjectTypeCode: classLayerScreen.v.subjectTypeCode,
                    otherChasi: "Y"
                },
                method: 'GET',
                async: false,
                success: function (res) {
                    console.log('getTextbookList=' + res);
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
                url: '/pages/api/textbook-class/classList.ax',
                data: {
                    subjectSeq: classLayerScreen.v.subjectSeq,
                    saveType: classLayerScreen.v.classListSaveType,
                    subjectRevisionCode: classLayerScreen.v.subjectRevisionCode,
                    otherChasi: "Y",
                    // saveType: 'DEFAULT'
                },
                method: 'GET',
                async: false,
                success: function (res) {
                    // prev, next 버튼 data-prev-subjectSeq, data-next-subjectSeq 추가
                    // const masterSeqForPrevNextBtn = $('select[data-type=textbook] > option:selected').data('masterseq');

                    // const prevHtml = `<button class="button size-sm type-icon" data-name="prevBtn" data-masterseq="${masterSeqForPrevNextBtn}" data-prev-subjectseq="${res?.row.subjectInfo?.prevSubjectSeq}">
                    const prevHtml = `<button class="button size-sm type-icon" data-name="prevBtn" data-prev-subjectseq="${res?.row.subjectInfo?.prevSubjectSeq}">
                                                  <svg>
                                                      <title>아이콘 다운로드</title>
                                                      <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-left"></use>
                                                  </svg>
                                              </button>`;

                    // const nextHtml = `<button class="button size-sm type-icon" data-name="nextBtn" data-masterseq="${masterSeqForPrevNextBtn}" data-next-subjectseq="${res?.row.subjectInfo?.nextSubjectSeq}">
                    const nextHtml = `<button class="button size-sm type-icon" data-name="nextBtn" data-next-subjectseq="${res?.row.subjectInfo?.nextSubjectSeq}">
                                                  <svg>
                                                      <title>아이콘 다운로드</title>
                                                      <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                                                  </svg>
                                               </button>`;

                    const $prevNextBtnGroup = $('#classLayer-popup-sheet div.prev-next-btn-group');
                    $prevNextBtnGroup.empty();
                    $prevNextBtnGroup.append(prevHtml);
                    $prevNextBtnGroup.append(nextHtml);

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

                    // 차시창 초기 진입시, 현재 차시에 해당하는 정보 세팅
                    classLayerScreen.f.setSubjectInfo(res.row);
                    classLayerScreen.f.setClassList(res.rows);
                    classLayerScreen.f.setTextSubjectList(res.row.textSubjectList, 'init'); // TODO
                    classLayerScreen.c.getSubjectList(); // 모바일 추가
                    classLayerScreen.f.setUnitList('init', unit1List, unit2List, unit3List, 'init'); // TODO
                    classLayerScreen.f.setSubjectList(res.row.subjectList, 'init'); // TODO

                    // 현재 차시의 학년/학기 active
                    const gradeDiv = $('.padding-side select[data-type="grade"]');
                    const termDiv = $('.padding-side select[data-type="term"]');

                    gradeDiv.find('option').removeAttr('selected');
                    termDiv.find('option').removeAttr('selected');

                    // 학년 active 및 상단 breadcrumbs 세팅
                    let gradeIndex = parseInt(gradeCode);

                    if (gradeIndex >= 1 && gradeIndex <= 6) {
                        gradeDiv.find('option:nth-child(' + gradeIndex + ')').prop('selected', true);
                        $('.breadcrumbs-mobile li:nth-child(1)').text(gradeIndex + '학년');
                    }

                    classLayerScreen.v.termCode = res?.row?.subjectInfo.termCode;
                    let termCodeForBreadcrumbs = res?.row?.subjectInfo.termCodeForBreadcrumbs;

                    // 학기 active 및 상단 breadcrumbs 세팅
                    if (termCodeForBreadcrumbs === "00") {
                        $('.breadcrumbs-mobile li:nth-child(2)').text('공통학기');
                    } else {
                        if (classLayerScreen.v.termCode === "01") {
                            $('.breadcrumbs-mobile li:nth-child(2)').text('1학기');
                        } else if (classLayerScreen.v.termCode === "02"){
                            $('.breadcrumbs-mobile li:nth-child(2)').text('2학기');
                        }
                    }

                    if (classLayerScreen.v.termCode === "01") {
                        termDiv.find('option:nth-child(1)').prop('selected', true);
                    } else if (classLayerScreen.v.termCode === "02"){
                        termDiv.find('option:nth-child(2)').prop('selected', true);
                    }

                    // tb_my_class에 저장 이력 체크
                    classLayerScreen.v.isClassEverSaved = res.row.myClassCount > 0 ?  true : false;

                    // 다른차시보기 내부 아이템의 클릭 핸들러 추가
                    classLayerScreen.f.registerClickEvent();

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
                url: '/pages/api/textbook-unit/unitListByDepth.ax',
                data: dataObj,
                method: 'GET',
                async: false,
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
                            // 국어 1-1 - 대분류 / 차시 존재
                            // $('.sub-item[data-type="subject"] .depth-2').html('');
                            $('.other-lesson ul.chapter-list').empty();
                            unit2List = [];
                            unit3List = [];
                            classLayerScreen.c.getSubjectListByUnit(unit1List[0].unitSeq);
                        }

                        // 대단원 리스트 세팅
                        classLayerScreen.f.setUnitList('firstGet', unit1List, unit2List, unit3List);
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
                url: '/pages/api/textbook-unit/unitListByDepth.ax',
                data: dataObj,
                method: 'GET',
                async: false,
            })
                .done(function (res2) {
                    console.info("Second getUnitListByDepth result: ", res2);

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
                        }
                        classLayerScreen.f.setUnitList('secondGet', unit1List, unit2List, unit3List);

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
                url: '/pages/api/textbook-unit/unitListByDepth.ax',
                data: dataObj,
                method: 'GET',
                async: false,
            })
                .done(function (res3) {
                    console.info("Third getUnitListByDepth result: ", res3)

                    unit3List = []; // 소단원 목록 초기화
                    if (res3.rows.length !== 0) { // 소단원 목록이 존재하는 경우
                        res3.rows.forEach((el) => unit3List.push(el));

                        // 소단원의 첫번째 아이템이 선택되도록 설정
                        unit3List[0].selectedYn = "Y";
                        classLayerScreen.v.smallUnitSeq = unit3List[0].unitSeq;

                        classLayerScreen.f.setUnitList('thirdGet', unit1List, unit2List, unit3List);
                        classLayerScreen.c.getSubjectListByUnit(classLayerScreen.v.smallUnitSeq);
                    }  else { // 소단원 목록이 존재하지 않으면 -> 소단원 영역 삭제하고 차시 비우기
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
                    unitSeq: 0,
                    depth: 1,
                }
            } else if (type === 'bigunit') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq: classLayerScreen.v.bigUnitSeq,
                    depth: 2,
                }
                // 중단원을 클릭했다면 소단원/차시 call
            } else if (type === 'middleunit') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq: classLayerScreen.v.middleUnitSeq,
                    depth: 3,
                }
                // 소단원을 클릭했다면 차시 call
            } else if (type === 'smallunit') {
                dataObj = {
                    masterSeq: classLayerScreen.v.masterSeq,
                    unitSeq: classLayerScreen.v.smallUnitSeq,
                    depth: 3,
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
                url: '/pages/api/textbook-unit/subjectListByUnit.ax',
                data: {
                    unitSeq: unitSeq,
                },
                method: 'GET',
                async: false,
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
                            theme:"minimal-dark",
                            scrollInertia: 150,
                            autoExpandScrollbar: true,
                            scrollEasing: "linear"
                        });
                    }
                }
            };

            $.ajax(options);

        },

        /**
         *  단원 이하 차시 불러오기
         *
         * @memberOf classLayerScreen.c
         */
        // tbClassTab.js에서 사용하는 함수를 가져옴. 대,중,소,차시를 기존 classLayer.js의 api와 동일한 쿼리에서 가져오는 것 확인.
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
                    //$('#tab2-1 .accordion ul li').remove(); // 리스트 초기화
                    $('#classLayer-search-popup-sheet .other-lesson ul.chapter-list').empty(); // 리스트 초기화

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
                    // $('#tab2-1 .accordion ul.chapter-list').html('');
                    $('#classLayer-search-popup-sheet .other-lesson ul.chapter-list').empty();

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
                                    let singleSubjectInfo = subject.startSubject ? `[${subject.startSubject}차시] ${subject.subjectName}` : `${subject.subjectName}`;

                                    // 2. singleSubjectYN이 N인 경우
                                    let subjectInfo = subject.startSubject && subject.endSubject ? `[${subject.startSubject}~${subject.endSubject}차시] ${subject.subjectName}` : `${subject.subjectName}`;

                                    let subjectSeq = subject.subjectSeq ? subject.subjectSeq : '';
                                    
                                    <!-- 차시(주제) 목록-->
                                    return `
                                                <!--'교과서자료' 유형의 차시만 노출-->
                                                <li data-subjectseq="${subjectSeq}"
                                                    data-masterseq="${masterSeqForSubjectList}">
                                                    ${subject.singleSubjectUseYn === "Y" ? `
                                                       ${singleSubjectInfo}`
                                                    : `${subjectInfo}`}
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

                                    let subjectSeq = subject.subjectSeq ? subject.subjectSeq : '';
                                    
                                    <!-- 차시(주제) 목록-->
                                    return `
                                                <!--'교과서자료' 유형의 차시만 노출-->
                                                <li data-subjectseq="${subjectSeq}"
                                                    data-masterseq="${masterSeqForSubjectList}">
                                                    ${subject.singleSubjectUseYn === "Y" ? `
                                                        ${singleSubjectInfo}`
                                                    : `${subjectInfo}`}
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
                                                    <h5>${innerItem.unitName}</h5>
                                                </div>
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

                                        let subjectSeq = subject.subjectSeq ? subject.subjectSeq : '';
                                        
                                        // 차시(주제) 목록
                                        return subject.coursewareKindCode === "100" ?
                                            `<li data-subjectseq="${subjectSeq}"
                                                 data-masterseq="${masterSeqForSubjectList}">
                                                <div class="header-wrap">
                                                    ${subject.singleSubjectUseYn === "Y" ? `
                                                        ${singleSubjectInfo}`
                                                    : `${subjectInfo}`}
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
                        $('#classLayer-search-popup-sheet .other-lesson ul.chapter-list').append(`<li data-type="firstLi" class="">${tempSubjectList}</li>`);
                    })

                    // 차시창2 차시 클릭 이벤트
                    $('#classLayer-search-popup-sheet ul.hour-list li').on('click', function(e) {
                        if ($isLogin) {
                            if ($('#userGrade').val() === '001') {
                                classScreen.f.needAuthAlert();
                            } else if ($('#userGrade').val() === '002'){
                                // const masterSeq = classScreen.v.masterSeq;
                                // const masterSeq = $('select[data-type=textbook] > option:selected').data('masterseq');
                                const masterSeq = $(e.currentTarget).data('masterseq');
                                const subjectSeq = $(this).data('subjectseq');
                                const revisionCode = classScreen.v.subjectRevisionCode;

                                clRepScreen.v.getTabListOption.classGubun1 = '';
                                clRepScreen.v.getTabListOption.classGubun2 = '';

                                // classLayer.js - setClassInfo
                                classLayerScreen.v.subjectSeq = subjectSeq;
                                classLayerScreen.f.setClassInfo();
                                classLayerScreen.event();

                                // clReplenishDataList.js
                                clRepScreen.v.getTabListOption.masterSeq = masterSeq;
                                clRepScreen.v.getTabListOption.subjectSeq = subjectSeq;
                                clRepScreen.init();

                                closePopup({id: 'classLayer-search-popup-sheet'});
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
     * @memberOf classLayerScreen
     */
    f: {
        setClassInfo: function () {
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
            //$('.breadcrumbs ul li:nth-child(3) a').text(textbookName);
            $('.breadcrumbs-mobile li:nth-child(3)').text(textbookName);

            // 차시 번호
            if (startSubject) {
                subjectNumber = `[${startSubject}`;

                if (endSubject) {
                    subjectNumber += `~${endSubject}`;
                }

                subjectNumber += ' 차시]';
            }

            // 모바일 - 주교과서, 부교과서 태그 초기화. 모바일 css 문제로 text() -> append()로 변경.
            $('.period-card .number-pages').empty();

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
                $('.period-card .number-pages').append(`<span>${mainTextbookPage}</span>`);
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
                $('.period-card .number-pages').append(`<span>${subTextbookPage}</span>`);
            }

            // 차시명 셋팅
            $('#classLayer-popup-sheet .inner-wrap p').text(`${subjectNumber} ${subjectName}`);
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
            $('#classLayer-tab1-1 .lesson-items').html('');

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
                    $('#classLayer-tab1-1 .lesson-items').append(`
                            <li data-phase="${phaseName}">
                                <p class="title">${koreanPhaseName}</p>
                                <div class="lesson-data"></div>
                            </li>
                        `);

                    for (const lesson of groupedByPhase[phaseName]) {
                        let mainPageInfoElement = '';
                        let subPageInfoElement = '';
                        const subTextbookName = classLayerScreen.v.subjectInfo.subTextbookName;
                        let prevBracket = '';
                        let nextBracket = '';
                        let slash = '';

                        if (lesson.textbookStartPage || (subTextbookName && lesson.subPageUseYn === 'Y' && lesson.subTextbookStartPage)) {
                            prevBracket = '(';
                        }

                        if (!lesson.textbookStartPage) {
                            mainPageInfoElement = '';
                        } else {
                            if (lesson.textbookStartPage && lesson.textbookEndPage) {
                                mainPageInfoElement = `${classLayerScreen.v.subjectInfo.textbookName} ${lesson.textbookStartPage}~${lesson.textbookEndPage}p`
                            } else if (lesson.textbookStartPage && !lesson.textbookEndPage) {
                                mainPageInfoElement = `${classLayerScreen.v.subjectInfo.textbookName} ${lesson.textbookStartPage}p`
                            }
                        }

                        if (lesson.textbookStartPage && subTextbookName && lesson.subPageUseYn === 'Y' && lesson.subTextbookStartPage) {
                            slash = ' / ';
                        }

                        if (!subTextbookName) {
                            subPageInfoElement = '';
                        } else if (subTextbookName && lesson.subPageUseYn === 'Y') {
                            if (lesson.subTextbookStartPage && lesson.subTextbookEndPage) {
                                subPageInfoElement = `${subTextbookName} ${lesson.subTextbookStartPage}~${lesson.subTextbookEndPage}p`;
                            } else if (lesson.subTextbookStartPage && !lesson.subTextbookEndPage) {
                                subPageInfoElement = `${subTextbookName} ${lesson.subTextbookStartPage}p`;
                            } else {
                                subPageInfoElement = '';
                            }
                        }

                        if (lesson.textbookStartPage || (subTextbookName && lesson.subPageUseYn === 'Y' && lesson.subTextbookStartPage)) {
                            nextBracket = ')';
                        }


                        let itemClass = lesson.classType === 'CLASS' || !lesson.classType ? 'data' : 'data referenceData'
                        let classSeq = lesson.classType === 'CLASS' ? lesson.referenceSeq : !lesson.classType ? lesson.classSeq : '';
                        let className = lesson.displayName ? lesson.displayName : lesson.className;

                        tempInnerElement = `
                                <div class="${itemClass} size-short" 
                                    data-class-seq="${lesson.classSeq ? lesson.classSeq : ''}" 
                                    data-phase-code="${lesson.phasecode ? lesson.phasecode : ''}"
                                    data-reference-seq="${lesson.referenceSeq ? lesson.referenceSeq : ''}"
                                  
                                    data-file-id="${lesson.classFileId ? lesson.classFileId : ''}"
                                    data-drag-yn="${lesson.dragyn ? lesson.dragyn : 'Y'}"
                                >
                                    <div class="image-wrap">
                                        <img src="${lesson.thumbnailPath ? lesson.thumbnailPath : '/assets/images/temp/img-board01.png'}" alt="">
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
                                        <strong class="class-name-mobile" data-reference-url="${lesson.referenceUrl ? lesson.referenceUrl : ''}">${className ? className : "(수업명이 없습니다)"}</strong>
                                        ${lesson.classType === 'CLASS' || !lesson.classType ? `
                                            <span class="number">
                                            ${prevBracket}${mainPageInfoElement}${slash}${subPageInfoElement}${nextBracket}
                                            </span>
                                        `: ''}
                                    </a>
                                </div>
                            `

                        $('#classLayer-tab1-1 .lesson-items [data-phase="' + phaseName + '"] .lesson-data').append(tempInnerElement);
                    }
                }

            }

            $('strong.class-name-mobile').on('click', function (event) {
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
            // $('.item-wrap a').off('click');
            // $('#classLayer-search-popup-sheet .forms button').off('click');
            // active 제거
            $('.padding-side select[data-type="textbook"]').empty();

            if (callType !== 'init' && list.length > 0) {
                list[0].selectedYn = 'Y';
            }

            let tempList = '';
            let textbookNameList = '';
            let textbookNameListElement = '';
            const masterSeq = classLayerScreen.v.masterSeq;

            $.each(list, function (index, item) { // todo - pc에서 저자 정보 가져오면 추가해야함. 현재 author 변수에 '22 개정' 개정정보 들어감.
                let subjectRevisionCode = item.subjectRevisionCode ? item.subjectRevisionCode : null;
                tempList = `
                        <option
                            data-masterseq="${item.masterSeq}"
                            ${item.selectedYn === 'Y' ? 'selected' : ''}>
                            ${subjectRevisionCode !== "" && subjectRevisionCode !== null && subjectRevisionCode !== undefined ? `[${subjectRevisionCode}]` : ''} ${item.textbookName}
                        </option>
                    `
                textbookNameList += tempList
            })

            $('select[data-type=textbook]').append(textbookNameList);

            $('select[data-type=textbook]').find('option[data-masterseq=' + masterSeq + ']').prop('selected', true);

            // prev, next 버튼에 masterseq 추가
            $('#classLayer-popup-sheet div.prev-next-btn-group > button').attr('data-masterseq', masterSeq);

            // TODO - classLayerScreen.c.getUnitListByDepth('textbook');
            // if (callType !== 'init') {
            //     classLayerScreen.v.masterSeq = $('select[data-type="textbook"] option:first-child').data('masterseq');
            //     classLayerScreen.c.getUnitListByDepth('textbook');
            // }
            //
            // // 클릭 이벤트 다시 등록
            // classLayerScreen.f.registerClickEvent();
        },

        // 단원 리스트 및 active 세팅
        setUnitList: function (callType, unit1List, unit2List, unit3List) {
            classLayerScreen.v.unit1List = unit1List;
            classLayerScreen.v.unit2List = unit2List;
            classLayerScreen.v.unit3List = unit3List;

            // 상위 breadcrumbs 제어
            if (unit1List.length === 0) {
                $('ul.breadcrumbs-mobile li').slice(3, 6).remove();
            } else if (unit2List.length === 0) {
                $('ul.breadcrumbs-mobile li').slice(4, 6).remove();
            } else if (unit3List.length === 0) {
                $('ul.breadcrumbs-mobile li').slice(5, 6).remove();
            }

            // 차시창 초기 시작 or 과목명 클릭시
            if (callType === 'init' || callType === 'firstGet') {
                // ----- 대단원 이름 하나씩 추가
                unit1List?.forEach(item => {
                    item.selectedYn === 'Y' && $('ul.breadcrumbs-mobile li:nth-child(4)').text(item.unitName).prop('data-unit1-seq',item.unitSeq);
                })
            }

            if (callType === 'init' || callType === 'secondGet') {
                // ----- 중단원 이름 하나씩 추가
                unit2List?.forEach(item => {
                    item.selectedYn === 'Y' && $('ul.breadcrumbs-mobile li:nth-child(5)').text(item.unitName).prop('data-unit2-seq',item.unitSeq);
                })
            }

            if (callType === 'init' || callType === 'thirdGet') {
                // ----- 소단원 이름 하나씩 추가
                unit3List?.forEach(item => {
                    item.selectedYn === 'Y' && $('ul.breadcrumbs-mobile li:nth-child(6)').text(item.unitName).prop('data-unit3-seq',item.unitSeq);
                })
            }

            // 클릭 이벤트 다시 등록
            classLayerScreen.f.registerClickEvent();
        },

        // 차시 리스트 및 active 세팅
        setSubjectList: function (list, callType) {
            if (callType !== 'init') { list[0].selectedYn = 'Y' }
        },

        // 자료 없는경우 div 넣기
        setNoDataDiv: function (phaseName) {
            const lessonDataElement = $('#classLayer-tab1-1 .lesson-items [data-phase="' + phaseName + '"] .lesson-data');

            // lesson-data 이하의 div.data 중 data-type이 "reference"인 div가 없으면 no-data를 추가
            if (!lessonDataElement.find('.data[data-type="reference"]').length) {
                lessonDataElement.append(`
                        <div class="no-data">
                            <strong>자료를 드래그하여 추가할 수 있습니다.</strong>
                        </div>
                    `);
            }
        },
        // TODO - init(m.ui) -> setClassInfo -> getClassList -> setTextSubjectList -> registerClickEvent -> onClickHandler
        registerClickEvent: function () {
            // const searchBtnTag = $('#classLayer-search-popup-sheet .forms button');
            // searchBtnTag.off('click');
            //
            // searchBtnTag.on('click', function (e) {
            //     e.preventDefault();
            //     //classLayerScreen.f.onClickHandler(e); // todo
            // });
        },

        // 이전, 다음 차시 버튼 기능
        handlePrevNextSubject: function (subjectInfo) {
            $('.period-card .toggle-group button').off('click').on('click', function(e) {
                const masterSeq = $(this).data('masterseq');
                let subjectSeq = '';
                if ($(this).data('name') === 'prevBtn') {
                    subjectSeq = $(this).data('prevSubjectseq')
                    if (subjectSeq == '0') { // 첫 페이지, 마지막 페이지 일 때
                        $alert.open("MG00028");
                        return false;
                    }
                } else if ($(this).data('name') === 'nextBtn') {
                    subjectSeq = $(this).data('nextSubjectseq')
                    if (subjectSeq == '0') { // 첫 페이지, 마지막 페이지 일 때
                        $alert.open("MG00029");
                        return false;
                    }
                }

                const revisionCode = classScreen.v.subjectRevisionCode;

                clRepScreen.v.getTabListOption.classGubun1 = '';
                clRepScreen.v.getTabListOption.classGubun2 = '';

                // classLayer.js - setClassInfo
                classLayerScreen.v.subjectSeq = subjectSeq;
                classLayerScreen.f.setClassInfo();
                classLayerScreen.event();

                // clReplenishDataList.js
                clRepScreen.v.getTabListOption.masterSeq = masterSeq;
                clRepScreen.v.getTabListOption.subjectSeq = subjectSeq;
                clRepScreen.init();
            });
        },

        // 로그인 안내 alert
        loginAlert: () => {
            $alert.alert('로그인이 필요합니다.', 'negative','info', () => {
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

        },
    },

    init: function (event) {
        // classLayerScreen.f.setClassInfo();
        // classLayerScreen.event();
        // classLayerScreen.f.handleDeleteBtn();
        //
        // $('.period-float .float-inner').removeClass('active');

    },

    event: function () {
        let masterSeq = classLayerScreen.v.masterSeq;
        let unitSeq = classLayerScreen.v.unitSeq;
        let subjectSeq = classLayerScreen.v.subjectSeq;

        classLayerScreen.f.handlePrevNextSubject(classLayerScreen.v.subjectInfo);

        // 수업열기 버튼 클릭 이벤트(pc와 동일하게 주석처리 해놓음)
        $('button[data-type="openClassMobile"]').on('click', function() {
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
            observer.observe(targetElement[0], { attributes: true });
        }

        // 차시창2 학년, 학기 selectbox change 이벤트
        $('#classLayer-search-popup-sheet select[data-type=grade], #classLayer-search-popup-sheet select[data-type=term]').on('change', function() {
            const gradeTypeVal = $(this).parent().find('select[data-type=grade]').find('option:selected').val();
            const termTypeVal = $(this).parent().find('select[data-type=term]').find('option:selected').val();

            let gradeCode = '';
            if (gradeTypeVal.includes('1')) {
                gradeCode = '01';
            } else if (gradeTypeVal.includes('2')) {
                gradeCode = '02';
            } else if (gradeTypeVal.includes('3')) {
                gradeCode = '03';
            } else if (gradeTypeVal.includes('4')) {
                gradeCode = '04';
            } else if (gradeTypeVal.includes('5')) {
                gradeCode = '05';
            } else {
                gradeCode = '06';
            }

            classLayerScreen.v.gradeCode = gradeCode;

            let termCode = '';
            termTypeVal.includes('1학기') ? termCode = '01' : termCode = '02';

            classLayerScreen.v.termCode = termCode;

            console.log(gradeCode);
            console.log(termCode);
            classLayerScreen.c.getTextbookList();
        });

        // 차시창2 검색 버튼 이벤트
        $('#classLayer-search-popup-sheet div.padding-side button.type-primary').off('click').on('click', function() {
            classScreen.v.masterSeq = $(this).parent().find('select[data-type=textbook]').find('option:selected').data('masterseq');
            classLayerScreen.c.getSubjectList();
        });

        // 차시창2 차시 클릭 이벤트 - getSubjectList() 콜백에도 추가
        $('#classLayer-search-popup-sheet ul.hour-list li').on('click', function(e) {
            if ($isLogin) {
                if ($('#userGrade').val() === '001') {
                    classScreen.f.needAuthAlert();
                } else if ($('#userGrade').val() === '002'){
                    // TO-BE 차시창 사용
                    //const classLayerUrl = '/pages/ele/textbook/classLayer.mrn';
                    // const masterSeq = classScreen.v.masterSeq;
                    const masterSeq = $(e.currentTarget).data('masterseq');
                    const subjectSeq = $(this).data('subjectseq');
                    const revisionCode = classScreen.v.subjectRevisionCode;

                    clRepScreen.v.getTabListOption.classGubun1 = '';
                    clRepScreen.v.getTabListOption.classGubun2 = '';

                    // classLayer.js - setClassInfo
                    classLayerScreen.v.subjectSeq = subjectSeq;
                    classLayerScreen.f.setClassInfo();
                    classLayerScreen.event();

                    // clReplenishDataList.js
                    clRepScreen.v.getTabListOption.masterSeq = masterSeq;
                    clRepScreen.v.getTabListOption.subjectSeq = subjectSeq;
                    clRepScreen.init();

                    // openPopup({id: $(this).attr("target-obj"), target: $(this)});

                    closePopup({id: 'classLayer-search-popup-sheet'});

                    // AS-IS 차시창 사용
                    // let ticket = $('input[name="ticket"]').val();
                    // const classLayerUrl = 'https://ele.m-teacher.co.kr/Textbook/PopPeriod.mrn?playlist=';
                    // const subjectSeq = $(this).data('subjectseq');
                    // const urlWithParameters = `${classLayerUrl}${subjectSeq}&ticket=${ticket}`;
                    // window.open(urlWithParameters, '_blank');
                }
            } else {
                classScreen.f.loginAlert();
            }
        });

        // 다른 차시 보기 버튼 클릭 이벤트 - data-type=textbook 관련 정보 출력 추가
        $('.other-chapter-view-button').off('click').on('click', function(e) {
            // const gradeTypeVal = $(this).parent().find('select[data-type=grade]').find('option:selected').val();
            // const termTypeVal = $(this).parent().find('select[data-type=term]').find('option:selected').val();
            const gradeTypeVal = $('#classLayer-search-popup-sheet').find('select[data-type=grade]').find('option:selected').val();
            const termTypeVal = $('#classLayer-search-popup-sheet').find('select[data-type=term]').find('option:selected').val();

            let gradeCode = '';
            if (gradeTypeVal.includes('1')) {
                gradeCode = '01';
            } else if (gradeTypeVal.includes('2')) {
                gradeCode = '02';
            } else if (gradeTypeVal.includes('3')) {
                gradeCode = '03';
            } else if (gradeTypeVal.includes('4')) {
                gradeCode = '04';
            } else if (gradeTypeVal.includes('5')) {
                gradeCode = '05';
            } else {
                gradeCode = '06';
            }

            classLayerScreen.v.gradeCode = gradeCode;

            let termCode = '';
            termTypeVal.includes('1학기') ? termCode = '01' : termCode = '02';

            classLayerScreen.v.termCode = termCode;

            console.log(gradeCode);
            console.log(termCode);
            classLayerScreen.c.getTextbookList();
        });
    }
};
classLayerScreen.init();