let clRepScreen;

$(function (){
    clRepScreen = {
        v: {
            getTabListOption: {
                masterSeq: classLayerScreen.v.masterSeq,
                unitSeq: classLayerScreen.v.subjectInfo.depth1UnitSeq,
                subjectSeq: classLayerScreen.v.subjectSeq,
                classGubun1: '',
                classGubun2: '',
                pageNo: 1,
                pageCount: 4,
                pageType: 'PAGE'
            },
            tabDepth1List: [],
            tabDepth2List: [],
            totalTab: {},
            tabUl1: $('div.tabs div#TB0221-tab ul'), // tab1 container
            // tabUl2: $('div.depth2-tab div.tab2List'), // tab2 container
            tabUl2: $('select.tab2List'), // tab2 container
            totalPage: null,
            currentPage:1,
            totalItemList : [],
            // 전체 탭 카테고리 별 데이터 개수
            getTotalCntObj: {
                multimediaDataCnt: 0,
                classDataCnt: 0,
                testDataCnt: 0,
                researchDataCnt: 0,
                myDataCnt: 0,
            },
            // 전체 탭 카테고리 별 현재 페이지
            getCategoryPageObj: {
                multimediaDataPage: 1,
                classDataPage: 1,
                testDataPage: 1,
                researchDataPage: 1,
                myDataPage: 1,
            },
            // 전체 탭 카테고리 별 페이지 개수
            getCategoryTotalPageObj: {
                multimediaDataTotalPage: 1,
                classDataTotalPage: 1,
                testDataTotalPage: 1,
                researchDataTotalPage: 1,
                myDataTotalPage: 1,
            },
        },
        c: {
            getReplenishDataList: (dataOption, selectOption) => {
                // console.log(dataOption);
                const {masterSeq, unitSeq, subjectSeq, classGubun1, classGubun2, pageNo, pageCount, pageType} = dataOption;

                let qs = `masterSeq=${masterSeq}&unitSeq=${unitSeq}&subjectSeq=${subjectSeq}&pageNo=${pageNo}&pageCount=${pageCount}&pageType=${pageType}`;
                (classGubun1) ? qs += `&classGubun1=${classGubun1}` : qs += `&classGubun1=`;
                (classGubun2) ? qs += `&classGubun2=${classGubun2}` : qs += `&classGubun2=`;

                const options = {
                    url: `/pages/api/textbook-refer/classReplenishDataList.ax?${qs}`,
                    method: 'GET',
                    success: function (res) {
                        console.log('보충자료 목록 요청', res);

                        const activeLiTagLinkedTo = $('div#TB0221-tab > ul').find('li.active').data('linkedTo');
                        if (activeLiTagLinkedTo === 1) { // 전체 탭 일 때
                            Object.keys(res.row).forEach((key) => { // 전체 탭 더보기 버튼을 위해 각 카테고리 별 totalCnt를 저장
                                // 각 카테고리 별 데이터가 있으면
                                if (res.row[key].length > 0) {
                                    switch (key) {
                                        case '멀티미디어 자료' :
                                            clRepScreen.v.getTotalCntObj.multimediaDataCnt = res.row[key][0].totalCnt;
                                            break;
                                        case '수업 자료' :
                                            clRepScreen.v.getTotalCntObj.classDataCnt = res.row[key][0].totalCnt;
                                            break;
                                        case '연구 자료' :
                                            clRepScreen.v.getTotalCntObj.researchDataCnt = res.row[key][0].totalCnt;
                                            break;
                                        case '평가 자료' :
                                            clRepScreen.v.getTotalCntObj.testDataCnt = res.row[key][0].totalCnt;
                                            break;
                                        case '내 자료' :
                                            clRepScreen.v.getTotalCntObj.myDataCnt = res.row[key][0].totalCnt;
                                            break;
                                    }
                                }
                            });
                        }

                        clRepScreen.v.totalPage = res.pagingSize;

                        const keyList = clRepScreen.f.keyNameToDisplay(classGubun1.toString());
                        const newDataList = [];
                        const newDataListWithKey = {};

                        // 전체탭, 내자료탭을 제외한 카테고리 탭 중에서 데이터 개수가 0인 탭 hide 처리
                        let hideCategoryTabList = []; // 제외할 탭의 key값을 담음
                        const parentUlTagTmp = $('div#TB0221-tab > ul');

                        Object.keys(res.row).forEach((title) => {
                           const thisLength = res.row[title].length;
                           if (thisLength === 0 && title !== '내 자료') {
                               hideCategoryTabList.push(title);
                           }
                        });

                        if (hideCategoryTabList.length > 0) {
                            let dataCommonCode = '';

                            parentUlTagTmp.find('li').removeClass('display-hide');

                            hideCategoryTabList.forEach((item, index) => {
                               switch (item) {
                                   case '멀티미디어 자료' :
                                       dataCommonCode = '01';
                                       break;
                                   case '수업 자료' :
                                       dataCommonCode = '92';
                                       break;
                                   case '평가 자료' :
                                       dataCommonCode = '02';
                                       break;
                                   case '연구 자료' :
                                       dataCommonCode = '91';
                                       break;
                               }

                                parentUlTagTmp.find('li[data-common-code=' + dataCommonCode + ']').addClass('display-hide');
                            });
                        }

                        // 화면단 표시되는 순서 고정
                        Object.keys(res.row).forEach((title, titleIndex) => {
                            const key = keyList[titleIndex];
                            newDataList.push(res.row[key]);
                            newDataListWithKey[key] = res.row[key];
                        });

                        // clRepScreen.f.fetchTabData();

                        // tab1 리스트(없는 데이터 삭제된 탭)
                        const displayTabList = clRepScreen.f.checkDataNull(newDataListWithKey,classGubun1,keyList);

                        // clRepScreen.f.displayDataList(displayTabList, newDataList);
                        clRepScreen.f.displayDataList(displayTabList, newDataList, newDataListWithKey,classGubun1,keyList);
                        if (selectOption) { // 모바일 추가 - 보충자료 depth2 필터 선택시 새로 렌더링 후 선택한 option selected
                            const selectedTabIdx = selectOption.selectedTabIdx;
                            const selectedCmCode = selectOption.selectedCmCode;
                            $(`#${selectedTabIdx}`).find(`select option[data-common-code=${selectedCmCode}]`).prop('selected', true);
                        }
                    },
                    error: function () {
                        console.log('getReplenishDataList Error()');
                    }
                };

                $cmm.ajax(options);
            },

            getCommonCd: function (commonGrCode) {
                return $cmm.getCmmCd(commonGrCode).then(data => {
                    const cleanData = data.row[commonGrCode].filter(v => v.useYn === 'Y');
                    return cleanData;
                });
            },

            getReplenishDataListOnlyForAllTab: function(dataOption, parentLiTag) {
                const {masterSeq, unitSeq, subjectSeq, pageCount, pageType} = dataOption;
                const categoryName = parentLiTag.find('p.title').text();
                const titleIndex = parentLiTag.attr('class').split(' ')[0].replace('index', '');

                let categoryPageNo = 1;
                let classGubun1 = ''; // 카테고리 구분 값

                switch (categoryName) {
                    case '멀티미디어 자료' :
                        classGubun1 = '01';
                        categoryPageNo = clRepScreen.v.getCategoryPageObj.multimediaDataPage += 1;
                        break;
                    case '수업 자료' :
                        classGubun1 = '92';
                        categoryPageNo = clRepScreen.v.getCategoryPageObj.classDataPage += 1;
                        break;
                    case '평가 자료' :
                        classGubun1 = '02'
                        categoryPageNo = clRepScreen.v.getCategoryPageObj.testDataPage += 1;
                        break;
                    case '연구 자료' :
                        classGubun1 = '91';
                        categoryPageNo = clRepScreen.v.getCategoryPageObj.researchDataPage += 1;
                        break;
                    // case '내 자료' :
                    //     classGubun1 = '99';
                    //     break;
                }

                let qs = `masterSeq=${masterSeq}&unitSeq=${unitSeq}&subjectSeq=${subjectSeq}&pageCount=${pageCount}&pageType=${pageType}`;
                (categoryPageNo) ? qs += `&categoryPageNo=${categoryPageNo}` : qs += `&categoryPageNo=`;
                (classGubun1) ? qs += `&classGubun1=${classGubun1}` : qs += `&classGubun1=`;

                const options = {
                    url: `/pages/api/textbook-refer/classRepleishDataListOnlyForAllTab.ax?${qs}`,
                    method: 'GET',
                    success: function(res) {
                        console.log('[전체 탭] 보충자료 목록 요청', res);

                        // categoryName으로 부모 태그를 체크해서 해당 카테고리에 내용 및 더보기 버튼 추가
                        // classGubun1, 카테고리 탭 현재 page를 param으로 api에서 데이터를 가져옴
                        if (res.rows.length > 0) {
                            res.rows.forEach((data, index) => {
                                let key = `${titleIndex}-${(categoryPageNo-1)*pageCount + index}`;
                                let appendItem = `
                                <div class="data size-short referenceData ${$extension.extensionToNoData(data.referenceExtension)}" 
                                data-drag-yn="${data.dragYn}"
                                data-index="${key}"
                                data-reference-seq="${data.referenceSeq}"
                                data-file-id="${data.referenceFileId}"
                                data-upload-method="${data.referenceUploadMethod}"
                                data-path="${data.referencePath}"
                                data-code2-name="${data.code2Name}">
                                    <div class="image-wrap clPreview">
                                      <img src="${data.thumbnailPath}" alt="">
                                    </div>
                                    <a
                                    class="clPreview"
                                    href="javascript:void(0)">
                                    <strong>${data.code2Name}</strong>
                                    <span class="desc">${data.referenceName}</span>
                                    </a>
                                    <button type="button" class="button type-icon size-sm share clShare" ${clRepScreen.f.ynToBoolean(data.referenceShareUseYn) ? '' : 'disabled'}">
                                      <svg>
                                        <title>아이콘 공유</title>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                      </svg>
                                    </button>
                                </div>
                                `;

                                parentLiTag.find('div.lesson-data').append(appendItem);
                            });
                            switch (classGubun1) {
                                case '01' : // 멀티미디어
                                    clRepScreen.v.getCategoryTotalPageObj.multimediaDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.multimediaDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.multimediaDataTotalPage > 1) {
                                        parentLiTag.find('button.moreBtnForAllTab').remove();
                                        parentLiTag.append(clRepScreen.m.multimedeaMoreBtn());
                                        clRepScreen.v.getCategoryPageObj.multimediaDataPage === clRepScreen.v.getCategoryTotalPageObj.multimediaDataTotalPage
                                            ? parentLiTag.find('button.moreBtnForAllTab').addClass('display-hide') : parentLiTag.find('button.moreBtnForAllTab').removeClass('display-hide');
                                    }
                                    break;
                                case '92' : // 수업 자료
                                    clRepScreen.v.getCategoryTotalPageObj.classDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.classDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.classDataTotalPage > 1) {
                                        parentLiTag.find('button.moreBtnForAllTab').remove();
                                        parentLiTag.append(clRepScreen.m.classDataMoreBtn());
                                        clRepScreen.v.getCategoryPageObj.classDataPage === clRepScreen.v.getCategoryTotalPageObj.classDataTotalPage
                                            ? parentLiTag.find('button.moreBtnForAllTab').addClass('display-hide') : parentLiTag.find('button.moreBtnForAllTab').removeClass('display-hide');
                                    }
                                    break;
                                case '02' : // 평가 자료
                                    clRepScreen.v.getCategoryTotalPageObj.testDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.testDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.testDataTotalPage > 1) {
                                        parentLiTag.find('button.moreBtnForAllTab').remove();
                                        parentLiTag.append(clRepScreen.m.testDataMoreBtn());
                                        clRepScreen.v.getCategoryPageObj.testDataPage === clRepScreen.v.getCategoryTotalPageObj.testDataTotalPage
                                            ? parentLiTag.find('button.moreBtnForAllTab').addClass('display-hide') : parentLiTag.find('button.moreBtnForAllTab').removeClass('display-hide');
                                    }
                                    break;
                                case '91' : // 연구 자료
                                    clRepScreen.v.getCategoryTotalPageObj.researchDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.researchDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.researchDataTotalPage > 1) {
                                        parentLiTag.find('button.moreBtnForAllTab').remove();
                                        parentLiTag.append(clRepScreen.m.researchDataMoreBtn());
                                        clRepScreen.v.getCategoryPageObj.researchDataPage === clRepScreen.v.getCategoryTotalPageObj.researchDataTotalPage
                                            ? parentLiTag.find('button.moreBtnForAllTab').addClass('display-hide') : parentLiTag.find('button.moreBtnForAllTab').removeClass('display-hide');
                                    }
                                    break;
                                // case '99' : // "내 자료"는 전체 탭 노출 X
                                //
                                //     break;
                            }
                        }
                    },
                    error: function() {
                        console.log('getReplenishDataListOnlyForAllTab Error()');
                    }
                };
                $cmm.ajax(options);
            },
        },

        f: {
            checkDataNull : function (dataRow,classGubun1, displayNameList){
                let tabObj2 = [];

                 const tab = $('li').filter(function () {
                    return $(this).data('commonCode') === classGubun1;
                });

                displayNameList.forEach((title,titleIdx)=>{
                    // title = [멀티미디어, 수업, 평가, 연구, 내자료]
                    if(title !== '내 자료' ) {
                        // tab1 삭제
                        //if (dataRow[title].length === 0) {
                        //    const tab1 = $('li').filter(function () {
                        //        return $(this).data('linkedTo') === titleIdx+2;
                        //    });
                        //    tab1.remove();

                        //} else {
                        // tab1 != '전체' 인 경우에만
                        if(classGubun1 !=='' && clRepScreen.v.getTabListOption.classGubun2 === ""){
                            // 자료 존재하는 tab2
                            dataRow[title].forEach(item => {
                                tabObj2.push(item.code2Name);
                            })

                            // 자료 존재하는 tab2 list
                            let dataTabArr = Array.from(new Set(tabObj2)); // 중복제거
                            dataTabArr = dataTabArr.map(v => v === '교과자료' ? '교과서 자료' : v); // key 이름 변경

                            // tab2 삭제
                            if(Object.keys(dataRow).length === 1){
                                const linkedTo = tab.data('linkedTo');
                                const tab2Container = $(`div#tab4-${linkedTo}`);
                                // const tab2List = tab2Container.find('.depth2-tab span label');
                                const tab2List = tab2Container.find('.depth2-tab option');
                                const tab2NameList = Array.from(tab2List).map(tab2 => {
                                    return tab2.textContent.trim();
                                });

                                const removeTab2 = tab2NameList.filter(v=> {
                                    return !dataTabArr.includes(v);
                                });

                                removeTab2.map(v=>{
                                    const tab2 = $(`#classLayer-tab1-2 select option`).filter(function () {
                                        // return $(this).text() === v;
                                        return $(this).text().trim() === v;
                                    });

                                    if (classGubun1 !== 99) {
                                        // tab2.not('.tab2-all').remove();
                                    } else {
                                        tab2.not('.tab2-all').remove();
                                    }
                                })
                            }
                        }
                        tabObj2 = [];
                        //}
                    }
                })
                return displayNameList;
            },

            // 상단 탭1 createElement
            createTab1Element : function (){
                // 모바일 추가
                clRepScreen.v.tabUl1.find('li').not('.TB0221-tab-first').remove();
                clRepScreen.v.tabDepth1List.forEach((data, index)=>{
                    const ele = `
                    <li class="" data-common-code='${data.commonCode}' data-linked-to='${index + 2}'>
                        <a href='#tab4-${index + 2}' data-path='#tab4-${index + 2}'>${data.name}</a>
                    </li>
                `;
                    clRepScreen.v.tabUl1.append(ele);
                });
            },

            // 상단 탭 데이터 바인딩
            fetchTabData: function (tabIdx) {
                if (tabIdx != 1) {

                    let html = '';

                    if (tabIdx != 6) {
                        html += `
                          <option value="전체" class="tab2-all">전체</option>
                          <option value="option1" data-common-code="00">교과서 자료</option>
                        `;
                    }

                    clRepScreen.v.tabDepth2List.forEach((cData, cIndex) => {
                        if (cData.rem1 == clRepScreen.v.tabDepth1List[tabIdx - 2].commonCode) {
                            // id 명을 동적으로 생성(2뎁스 탭 인덱스를 지정해줌) ex. 2번째 메뉴의 3번째 탭이면 id="buttons2-3" (멀티미디어 - 국어 작품 감상실)
                            html += `
                              <option data-common-code="${cData.commonCode}">
                                ${cData.name}
                              </option>
                            `;
                        }
                    });

                    return html;
                }
            },

            // 구분값 옵션 변경
            // parameter - null: 기존값 유지 / 그 외: 값 변경
            setReqGubunOption: function (classGubun1, classGubun2) {
                classGubun1 !== null ? clRepScreen.v.getTabListOption.classGubun1 = classGubun1 : "";
                classGubun2 !== null ? clRepScreen.v.getTabListOption.classGubun2 = classGubun2 : "";
            },

            // 페이지 옵션 변경
            setPageNo: function (pageNo) {
                pageNo ? clRepScreen.v.getTabListOption.pageNo = pageNo : "";
            },

            // 전체 탭 > 모든 카테고리 동일한 페이지(pageNo)로 변경
            setPageNoOnlyForAllTab: (pageNo) => {
                const categoryPageObjKeys = Object.keys(clRepScreen.v.getCategoryPageObj);
                categoryPageObjKeys.forEach((item) => {
                    clRepScreen.v.getCategoryPageObj[item] = pageNo;
                });
            },

            buttonEvents: (data) => {
                // 미리보기
                $(document).off('click','.clPreview').on('click','.clPreview',function (){
                    const titleIndex = $(this).parent().data('index').split('-')[0];
                    const itemIndex = $(this).parent().data('index').split('-')[1];

                    let referenceFileId;
                    let referenceSeq;
                    let referenceUploadMethod;
                    let referencePath;
                    let code2Name;

                    if (clRepScreen.v.getTabListOption.classGubun1 !== "") { // 전체 탭 X
                        referenceFileId = data[itemIndex]['referenceFileId'];
                        referenceSeq = data[itemIndex]['referenceSeq'];
                        referenceUploadMethod = data[itemIndex]['referenceUploadMethod'];
                        referencePath = data[itemIndex]['referencePath'];
                        code2Name = data[itemIndex]['code2Name'];
                    } else { // 전체 탭
                        referenceFileId = $(this).parent().data('fileId');
                        referenceSeq = $(this).parent().data('referenceSeq');
                        referenceUploadMethod = $(this).parent().data('referenceUploadMethod');
                        referencePath = $(this).parent().data('referencePath');
                        code2Name = $(this).parent().data('code2Name');
                    }

                    const source = referenceUploadMethod === "LINK" ? "LINK" : "CMS";
                    const refType = code2Name === "교과자료" ? "TEXTBOOK" : "TOTALBOARD";

                    const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${referenceFileId}&referenceSeq=${referenceSeq}&type=${refType}`;
                    code2Name !== "내 링크 자료" && referenceUploadMethod !== "NEWWIN" ? screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview") : window.open(referencePath,"_blank");
                });

                // 공유
                $(document).off('click','.clShare').on('click','.clShare',function (){
                    const titleIndex = $(this).parent().data('index').split('-')[0];
                    const itemIndex = $(this).parent().data('index').split('-')[1];

                    if (clRepScreen.v.getTabListOption.classGubun1 !== "") {

                    }
                    // const refData = clRepScreen.v.getTabListOption.classGubun1 !== "" ? data[itemIndex] : data[titleIndex][itemIndex];


                    $alert.alert("[안내] AI클래스 4월 오픈!<br/>"
                        + "학생들에게 공유하면,<br/>"
                        + "분석 리포트를 확인 할 수 있습니다.");
                    /*[운영/1023] AI 클래서 오픈 연기로인해 기능 주석처리
                    // const seq = refData.referenceSeq;
                    const seq = $(this).parent().data('referenceSeq');
                    const options = "width=997.3, height=455.9, resizable=no, scrollbars=no, top=100% ,left=100%"

                    if(ai_class_popup_yn){
                        window.open(`${ai_site}/#/teacher/ai-class-share?worksheetId=${seq}&schoolType=ele`,"_blank",options)
                    }else{
                        $alert.open('MG00054', function () {
                            const url = 'https://ele.m-teacher.co.kr/mevent/aiClass/';
                            window.open(url,"_blank");
                        });
                    }
                    */
                });
            },

            // 자료 리스트 그리기
            displayDataList: async (keyList, valueList, newDataListWithKey, classGubun1, keyList2)=> {
                let tab1 = clRepScreen.v.getTabListOption.classGubun1; // 현재 탭1 commonCode
                let tab2 = clRepScreen.v.getTabListOption.classGubun2; // 현재 탭2 commonCode
                clRepScreen.v.totalItemList = tab1 !== "" ? [...clRepScreen.v.totalItemList].flat().concat([...valueList].flat()) :[...valueList]; // 각 배열을 평탄화하여 하나의 배열로 합침

                if (tab1 == '') {
                    $('div[id^=tab4-]').removeClass('display-show');
                    $('div[id=tab4-1]').addClass('display-show');
                }

                // 현재 탭1 인덱스
                const tabIdx = clRepScreen.v.tabUl1.find(`li[data-common-code="${tab1}"]`).data('linkedTo');
                console.log(tabIdx)
                const parentTab = $(document).find(`div#tab4-${tabIdx}`);
                // 목록 데이터 초기화
                clRepScreen.v.getTabListOption.pageNo === 1 ? tabIdx === 1 ? parentTab.find('ul.lesson-items').empty() : parentTab.find('ul.lesson-items').empty() : "";

                keyList.forEach((title, titleIndex) => {
                    // 선택한 tab1의 자료 목록
                    const dataList = valueList[titleIndex];

                    let appendData = $(`
                        <li class="index${titleIndex} ${title}">
                            <select name="" id="" class="size-xl fluid depth2-tab tab2List">
                                ${clRepScreen.f.fetchTabData(tabIdx)}
                            </select>
                            <p class="title">${title}</p>
                            <div class="lesson-data">
                            </div>
                        </li>
                    `);

                    let moreBtn = $(`
                    ${ tabIdx!== 1 ? clRepScreen.m.moreBtn() : ""}
                    `);

                    // 더보기버튼, data append, tab1 title 삭제
                    if (clRepScreen.v.getTabListOption.pageNo === 1) {
                        parentTab.find('ul.lesson-items').append(appendData);
                        // 모바일 추가 (tab4-6 내자료)

                        if (tabIdx !== 1) { // 전체 탭 X면
                            if (clRepScreen.v.totalPage > 1 && dataList.length >= 4) parentTab.find('ul.lesson-items li.index' + titleIndex).append(moreBtn);
                        } else if (tabIdx === 1) { // 전체 탭 O면
                            switch (title) {
                                case '멀티미디어 자료' :
                                    clRepScreen.v.getCategoryTotalPageObj.multimediaDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.multimediaDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.multimediaDataTotalPage > 1) {
                                        parentTab.find('ul.lesson-items li.index' + titleIndex).append(clRepScreen.m.multimedeaMoreBtn());
                                    }
                                    break;
                                case '수업 자료' :
                                    clRepScreen.v.getCategoryTotalPageObj.classDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.classDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.classDataTotalPage > 1) {
                                        parentTab.find('ul.lesson-items li.index' + titleIndex).append(clRepScreen.m.classDataMoreBtn());
                                    }
                                    break;
                                case '연구 자료' :
                                    clRepScreen.v.getCategoryTotalPageObj.researchDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.researchDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.researchDataTotalPage > 1) {
                                        parentTab.find('ul.lesson-items li.index' + titleIndex).append(clRepScreen.m.researchDataMoreBtn());
                                    }
                                    break;
                                case '평가 자료' :
                                    clRepScreen.v.getCategoryTotalPageObj.testDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.testDataCnt / 4);
                                    if (clRepScreen.v.getCategoryTotalPageObj.testDataTotalPage > 1) {
                                        parentTab.find('ul.lesson-items li.index' + titleIndex).append(clRepScreen.m.testDataMoreBtn());
                                    }
                                    break;
                                // case '내 자료' : // 전체 탭에서 내 자료 영역 X
                                //
                                //     break;
                            }
                        }
                    }

                    // 전체 탭 > 내 자료 hide(데이터 유무에 관계 없이)
                    if (tabIdx === 1 && title === '내 자료') {
                        parentTab.find(`li.index${titleIndex}`).addClass('display-hide');
                    }

                    if (dataList.length > 0) {
                        // title 하위 자료 목록 append
                        dataList.forEach((data, index) => {
                            let key = `${titleIndex}-${(clRepScreen.v.getTabListOption.pageNo-1)*clRepScreen.v.getTabListOption.pageCount + index}`;
                            let appendItem = `
                            <div class="data size-short referenceData ${$extension.extensionToNoData(data.referenceExtension)}" 
                            data-drag-yn="${data.dragYn}"
                            data-index="${key}"
                            data-reference-seq="${data.referenceSeq}"
                            data-file-id="${data.referenceFileId}"
                            data-upload-method="${data.referenceUploadMethod}"
                            data-path="${data.referencePath}"
                            data-code2-name="${data.code2Name}">
                                <div class="image-wrap clPreview">
                                  <img src="${data.thumbnailPath}" alt="">
                                </div>
                                <a
                                class="clPreview"
                                href="javascript:void(0)">
                                <strong>${data.code2Name}</strong>
                                <span class="desc">${data.referenceName}</span>
                                </a>
                                <button type="button" class="button type-icon size-sm share clShare" ${clRepScreen.f.ynToBoolean(data.referenceShareUseYn) ? '' : 'disabled'}">
                                  <svg>
                                    <title>아이콘 공유</title>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                  </svg>
                                </button>
                            </div>
                        `;

                            // 데이터 담기
                            parentTab.find(`li.index${titleIndex}`).find('div.lesson-data').append(appendItem);

                            // tabIdx가 1(전체 탭) && title이 "내 자료"인 경우 li 태그 hide
                            if (tabIdx === 1 && title === '내 자료') {
                                parentTab.find(`li.index${titleIndex}`).addClass('display-hide');
                            }

                            // tab1- 내자료 화면단 케이스 분류
                            if (tabIdx === 6) {
                                if (tab2 === 'MYDATA') {
                                    // 함께보기 flag추가
                                    const together = `<span class="badge type-round-box">함께 보기</span>`;
                                    data.myDataGubun === 'TOGETHER' ? parentTab.find(`.image-wrap[data-seq=${data.referenceSeq}]`).prepend(together) : "";
                                } else {

                                }
                                // 교과서 매핑정보 추가
                                const textbookInfo = `
                                <a>
                                    <ul class="divider-group type-brace">
                                        <li class="category">${data.code2Name}</li>
                                        <!--<li>${!_.isNil(data.textbookName) ? data.textbookName : ""}</li>-->
                                    </ul>
                                    <strong class="ellipsis-multi">${data.referenceName}</strong>
                                </a>
                                <button type="button" class="button type-icon size-sm share ${clRepScreen.f.ynToBoolean(data.referenceShareUseYn) ? '' : 'disabled'}">
                                  <svg>
                                    <title>아이콘 공유</title>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                  </svg>
                                </button>
                                `;

                                parentTab.find(`.image-wrap[data-seq=${data.referenceSeq}]`).siblings('a').remove();
                                parentTab.find(`.image-wrap[data-seq=${data.referenceSeq}]`).siblings('button').remove();
                                parentTab.find(`.image-wrap[data-seq=${data.referenceSeq}]`).parent('div').append(textbookInfo);

                                // 모바일 추가. pc는 textbookName에 학년, 학기 등 정보 다 있는데 모바일은 나눠서 li태그로 넣음.
                                let textbookInfoArr = [];
                                if (data.textbookName) {
                                    textbookInfoArr = data.textbookName.split('>');
                                }
                                if (textbookInfoArr.length !== 0) {
                                    textbookInfoArr.forEach((bookInfo, index) => {
                                        parentTab.find(`.image-wrap[data-seq=${data.referenceSeq}]`).siblings('a').find('ul.type-brace').append(`<li>${bookInfo}</li>`);
                                    });
                                }

                                // 더미 썸네일만 출력
                                data.thumbnailPath === '' ? parentTab.find('img').remove() : "";
                            }
                        });
                    } else {
                        if (tabIdx === 1) { // 전체 탭에서 데이터 없는 카테고리 hide
                            parentTab.find(`li.index${titleIndex}`).addClass('display-hide');
                        }

                        let appendItem = `
                            <div class="box-no-data" data-name="initNoDataBox">
                              등록된 자료가 없습니다.
                            </div>
                        `;

                        parentTab.find(`li.index${titleIndex}`).find('div.lesson-data').append(appendItem);
                    }

                    // 모바일 추가 - 현재 탭에 active 추가
                    $(`div#TB0221-tab li[data-linked-to=${tabIdx}]`).addClass('active');

                    // tab1 - 전체탭 화면단
                    if (tabIdx === 1) {
                        // 내 자료 삭제
                        parentTab.find(`div.내.자료`).remove();
                        // 검색 selectbox 삭제
                        parentTab.find('select.tab2List').remove();
                    }
                });

                await clRepScreen.f.checkDataNull(newDataListWithKey,classGubun1,keyList2);

                // select2.js init
                renderPlugin();

                // 탭2 변경시
                $('select.tab2List').off('change');
                $('select.tab2List').change(function(e){
                    clRepScreen.v.totalItemList = []; // 현재 탭 데이터 목록 초기화

                    // const selectedCmCode = $(this).data('commonCode'); // '전체'인 경우 undefined
                    const selectedCmCode = $(this).find('option:selected').data('commonCode'); // '전체'인 경우 undefined // 1.
                    const selectedTabIdx = $(this).closest('.display-show').attr('id');  // 2.
                    const selectOption = {selectedCmCode:selectedCmCode, selectedTabIdx:selectedTabIdx};

                    // param 옵션 변경
                    selectedCmCode ? clRepScreen.f.setReqGubunOption(null, selectedCmCode) : clRepScreen.f.setReqGubunOption(null, '');
                    clRepScreen.f.setPageNo(1);

                    // 보충 자료 목록 렌더
                    if ($isLogin) {
                        clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption, selectOption);
                    }
                });

                clRepScreen.f.buttonEvents(clRepScreen.v.totalItemList);
            },

            // 'Y','N' -> true,false
            ynToBoolean: function (yn) {
                if (yn == 'Y' || yn == 'y') {
                    return true;
                } else if (yn == 'N' || yn == 'n') {
                    return false;
                } else {
                    return yn;
                }
            },

            keyNameToDisplay: function (tabType) {
                let keyList = [];

                if (tabType === '01') {
                    keyList.push("멀티미디어 자료");
                } else if (tabType === '92') {
                    keyList.push("수업 자료");
                } else if (tabType === '02') {
                    keyList.push("평가 자료");
                } else if (tabType === '91') {
                    keyList.push("연구 자료");
                } else if(tabType === '99'){
                    keyList.push("내 자료");
                } else {
                    keyList.push('멀티미디어 자료');
                    keyList.push('수업 자료');
                    keyList.push('평가 자료');
                    keyList.push('연구 자료');
                    keyList.push('내 자료');
                }

                return keyList;
            },
        },

        event: async function () {
            let lastClickedTabDepth1 = '';

            // 탭1 변경시
            clRepScreen.v.tabUl1.off('click');

            await clRepScreen.v.tabUl1.on('click', 'li', async function () {
                clRepScreen.v.totalItemList = []; // 현재 탭 데이터 목록 초기화

                const selectedCmCode = $(this).data('commonCode');
                const parentIndex = $(this).data('linkedTo');
                const selectedTab2List = $(`#tab4-${parentIndex}`).find(clRepScreen.v.tabUl2);

                // 탭이 변경되는 경우에만 ajax 호출
                if (selectedCmCode !== lastClickedTabDepth1) {
                    // 탭2 초기화
                    selectedCmCode !== 99 ? selectedTab2List.find('option:gt(1)').remove() : selectedTab2List.find('option').remove();
                    // 탭2 리로드
                    //await clRepScreen.f.fetchTabData();

                    // param 옵션 변경
                    if (selectedCmCode === '') { // 전체
                        clRepScreen.f.setReqGubunOption('', '');
                        // clRepScreen.v.getTabListOption.pageCount = 10;
                        clRepScreen.v.getTabListOption.pageCount = 4;
                    } else {
                        clRepScreen.f.setReqGubunOption(selectedCmCode, '');
                        // clRepScreen.v.getTabListOption.pageCount = 10;
                        clRepScreen.v.getTabListOption.pageCount = 12;
                    }
                    clRepScreen.f.setPageNo(1);
                    clRepScreen.f.setPageNoOnlyForAllTab(1); // 전체 탭 모든 카테고리 페이지 1로 변경

                    // const classGubun2 = selectedTab2List.find('span input').eq(0).data('commonCode');
                    const classGubun2 = selectedTab2List.find('option').eq(0).data('commonCode');
                    clRepScreen.v.getTabListOption.classGubun2 = _.isNil(classGubun2) ? '' : classGubun2;

                    // 데이터 목록 요청
                    if ($isLogin) {
                        await clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption);
                    }
                }
                // 탭 변경 플래그값
                lastClickedTabDepth1 = selectedCmCode;
            })

            // 더보기 버튼 클릭시
            $(document).off('click','button.moreBtn').delegate('button.moreBtn','click',function (e){
                clRepScreen.f.setPageNo(clRepScreen.v.getTabListOption.pageNo + 1); // 현재 페이지 +1
                clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption); // 목록에 데이터 추가

                // 버튼 화면단
                let moreBtn = $(`${clRepScreen.m.moreBtn()}`);
                // $(this).parent().empty().append(moreBtn);
                $(this).parent().append(moreBtn);
                $(this).remove();
                // clRepScreen.v.getTabListOption.pageNo === clRepScreen.v.totalPage ? moreBtn.prop('disabled', true) : moreBtn.prop('disabled', false);
                clRepScreen.v.getTabListOption.pageNo === clRepScreen.v.totalPage ? moreBtn.addClass('display-hide') : moreBtn.removeClass('display-hide');
            });

            // 전테 탭 > 더보기 버튼 클릭시
            $(document).off('click','button.moreBtnForAllTab').delegate('button.moreBtnForAllTab','click',function (e){
                const parentLiTag = $(this).closest('li');
                clRepScreen.c.getReplenishDataListOnlyForAllTab(clRepScreen.v.getTabListOption, parentLiTag);
            });
        },

        m : {
            moreBtn : function(){
                return `
                <button type="button" class="more-button button moreBtn">
                    <svg>
                        <title>아이콘 더보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                    </svg> 더보기 <span class="replace-text-area">${clRepScreen.v.getTabListOption.pageNo}<em>/${clRepScreen.v.totalPage}</em></span>
                </button>
            `;
            },
            multimedeaMoreBtn: () => {
                const multimediaDataTotalPage = clRepScreen.v.getCategoryTotalPageObj.multimediaDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.multimediaDataCnt / 4);
                const multimediaDataPage = clRepScreen.v.getCategoryPageObj.multimediaDataPage;
                return `
                <button type="button" class="more-button button moreBtnForAllTab">
                    <svg>
                        <title>아이콘 더보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                    </svg> 더보기 <span class="replace-text-area">${multimediaDataPage}<em>/${multimediaDataTotalPage}</em></span>
                </button>
            `;
            },
            classDataMoreBtn: () => {
                const classDataTotalPage = clRepScreen.v.getCategoryTotalPageObj.classDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.classDataCnt / 4);
                const classDataPage = clRepScreen.v.getCategoryPageObj.classDataPage;
                return `
                <button type="button" class="more-button button moreBtnForAllTab">
                    <svg>
                        <title>아이콘 더보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                    </svg> 더보기 <span class="replace-text-area">${classDataPage}<em>/${classDataTotalPage}</em></span>
                </button>
            `;
            },
            researchDataMoreBtn: () => {
                const researchDataTotalPage = clRepScreen.v.getCategoryTotalPageObj.researchDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.researchDataCnt / 4);
                const researchDataPage = clRepScreen.v.getCategoryPageObj.researchDataPage;
                return `
                <button type="button" class="more-button button moreBtnForAllTab">
                    <svg>
                        <title>아이콘 더보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                    </svg> 더보기 <span class="replace-text-area">${researchDataPage}<em>/${researchDataTotalPage}</em></span>
                </button>
            `;
            },
            testDataMoreBtn: () => {
                const testDataTotalPage = clRepScreen.v.getCategoryTotalPageObj.testDataTotalPage = Math.ceil(clRepScreen.v.getTotalCntObj.testDataCnt / 4);
                const testDataPage = clRepScreen.v.getCategoryPageObj.testDataPage;
                return `
                <button type="button" class="more-button button moreBtnForAllTab">
                    <svg>
                        <title>아이콘 더보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                    </svg> 더보기 <span class="replace-text-area">${testDataPage}<em>/${testDataTotalPage}</em></span>
                </button>
            `;
            },
            // myDataMoreBtn: () => { // 전체 탭에 내 자료 영역 X
            //
            // },
        },


        init: async function () {
            // // 과목 세팅
            // _.isNil(clRepScreen.v.getTabListOption.masterSeq) ? clRepScreen.v.getTabListOption.masterSeq = new URLSearchParams(window.location.search).get('masterSeq') : '';
            //
            // // 차시 세팅
            // _.isNil(clRepScreen.v.getTabListOption.subjectSeq) ? clRepScreen.v.getTabListOption.subjectSeq = new URLSearchParams(window.location.search).get('subjectSeq') : '';

            // pageNo, pageCount 초기화 (전체 탭으로 세팅)
            clRepScreen.v.getTabListOption.pageNo = 1;
            clRepScreen.v.getTabListOption.pageCount = 4;

            // class 구분 값 초기화
            clRepScreen.v.getTabListOption.classGubun1 = '';
            clRepScreen.v.getTabListOption.classGubun2 = '';

            // 전체 탭 카테고리 전역변수 초기화
            // 1. 카테고리 별 데이터 개수 초기화
            const totalCntObjKeys = Object.keys(clRepScreen.v.getTotalCntObj);
            totalCntObjKeys.forEach((item) => {
                clRepScreen.v.getTotalCntObj[item] = 0;
            });

            // 2. 카테고리 별 현재 페이지 초기화
            const categoryPageObjKeys = Object.keys(clRepScreen.v.getCategoryPageObj);
            categoryPageObjKeys.forEach((item) => {
                clRepScreen.v.getCategoryPageObj[item] = 1;
            });

            // 3. 카테고리 별 총 페이지 초기화
            const categoryTotalPageObj = Object.keys(clRepScreen.v.getCategoryTotalPageObj);
            categoryTotalPageObj.forEach((item) => {
                clRepScreen.v.getCategoryTotalPageObj[item] = 1;
            });

            // 단원 세팅
            const unit1Seq = $('ul.breadcrumbs-mobile li:nth-child(4)').data('unit1Seq');
            const unit2Seq = $('ul.breadcrumbs-mobile li:nth-child(5)').data('unit2Seq');
            const unit3Seq = $('ul.breadcrumbs-mobile li:nth-child(6)').data('unit3Seq');

            if(unit3Seq){
                clRepScreen.v.getTabListOption.unitSeq = unit3Seq
            }else if(unit2Seq){
                clRepScreen.v.getTabListOption.unitSeq = unit2Seq
            }else if(unit1Seq){
                clRepScreen.v.getTabListOption.unitSeq = unit1Seq
            };

            clRepScreen.v.getTabListOption.unitSeq = classLayerScreen.v.subjectInfo.depth1UnitSeq;

            // 보충 자료 목록 렌더
            if ($isLogin) {
                clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption);
            }

            // 탭1, 탭2 데이터 바인딩
            clRepScreen.v.tabDepth1List = await clRepScreen.c.getCommonCd(['TB0221']); // ok
            clRepScreen.v.tabDepth2List = await clRepScreen.c.getCommonCd(['TB0230']); // ok

            // 탭1 렌더
            await clRepScreen.f.createTab1Element(); // ok

            // 탭2 렌더 - pc는 필터를 만들고 루프 렌더링. but 모바일은 루프 렌더링 후 selectbox(pc의 필터)를 생성.
            // 따라서 displayDataList에서 렌더링 후 fetchTabData()를 아래에 추가할 예정.
            // await clRepScreen.f.fetchTabData(); // ok???

            await clRepScreen.event();
        }
    };

    //clRepScreen.init();
})
