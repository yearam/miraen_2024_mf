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
                pageCount: 10,
                pageType: 'PAGE'
            },
            tabDepth1List: [],
            tabDepth2List: [],
            totalTab: {},
            tabUl1: $('div.tabs div#TB0221-tab ul'), // tab1 container
            tabUl2: $('div.depth2-tab div.tab2List'), // tab2 container
            totalPage: null,
            currentPage:1,
            totalItemList : [],
        },
        c: {
            getReplenishDataList: (dataOption) => {
                // console.log(dataOption);
                const {masterSeq, unitSeq, subjectSeq, classGubun1, classGubun2, pageNo, pageCount, pageType} = dataOption;

                let qs = `masterSeq=${masterSeq}&unitSeq=${unitSeq}&subjectSeq=${subjectSeq}&pageNo=${pageNo}&pageCount=${pageCount}&pageType=${pageType}`;
                (classGubun1) ? qs += `&classGubun1=${classGubun1}` : qs += `&classGubun1=`;
                (classGubun2) ? qs += `&classGubun2=${classGubun2}` : qs += `&classGubun2=`;

                const options = {
                    url: `/pages/api/textbook-refer/classReplenishDataList.ax?${qs}`,
                    method: 'GET',
                    success: function (res) {
                        // console.log('보충자료 목록 요청', res);

                        clRepScreen.v.totalPage = res.pagingSize;

                        const keyList = clRepScreen.f.keyNameToDisplay(classGubun1.toString());
                        const newDataList = [];
                        const newDataListWithKey = {};

                        // 화면단 표시되는 순서 고정
                        Object.keys(res.row).forEach((title, titleIndex) => {
                            const key = keyList[titleIndex];
                            newDataList.push(res.row[key]);
                            newDataListWithKey[key] = res.row[key];
                        });

                        // tab1 리스트(없는 데이터 삭제된 탭)
                        const displayTabList = clRepScreen.f.checkDataNull(newDataListWithKey,classGubun1,keyList);

                        clRepScreen.f.displayDataList(displayTabList, newDataList);
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

            //스크랩
            scrapCommonRef: function(isScrap, refSeq,el){
                let scrapUrl;
                let option;

                if(isScrap){
                    scrapUrl = '/pages/api/mypage/addScrap.ax';
                    option = {scrapType : "TEXTBOOK", referenceSeq : refSeq, useYn : "Y" };
                }else{
                    scrapUrl = '/pages/api/mypage/updateScrap.ax';
                    option = {scrapType : "TEXTBOOK", referenceSeqList : refSeq };
                }

                return $.ajax({
                    url: scrapUrl,
                    method : 'POST',
                    data : option,
                    success: function (res){
                        if(res.resultCode === '0000'){
                            if(isScrap){
                                const els = $(`div[data-reference-seq=${refSeq}]`);
                                els.find('.buttons .clScrap').addClass('active');
                                $toast.open(el.data("toast"), "MG00041");
                            }else{
                                const els = $(`div[data-reference-seq=${refSeq}]`);
                                els.find('.buttons .clScrap').removeClass('active');
                                $toast.open(el.data("toast"), "MG00042");
                            }
                        }
                    },
                    error: function (){
                        alert('스크랩 실패하였습니다');
                    }
                })
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
                        if (dataRow[title].length === 0) {
                            const tab1 = $('li').filter(function () {
                                return $(this).data('linkedTo') === titleIdx+2;
                            });
                            tab1.remove();

                        } else {
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
                                    const tab2List = tab2Container.find('.depth2-tab span label');
                                    const tab2NameList = Array.from(tab2List).map(tab2 => {
                                        return tab2.textContent.trim();
                                    });

                                    const removeTab2 = tab2NameList.filter(v=> {
                                        return !dataTabArr.includes(v);
                                    });

                                    removeTab2.map(v=>{
                                        const tab2 = $(`span label`).filter(function () {
                                            return $(this).text() === v;
                                        });

                                        tab2.not('.tab2-all').remove();
                                    })
                                }
                            }
                            tabObj2 = [];
                        }
                    }
                })
                return displayNameList;
            },

            // 상단 탭1 createElement
            createTab1Element : function (){
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
            fetchTabData: function () {

                // 탭2
                clRepScreen.v.tabDepth1List.forEach((data, index) => {
                    const tab2Container = $(`div#tab4-${index + 2}`).find(clRepScreen.v.tabUl2);
                    const createChildrenIndex = tab2Container.find('input').length+1;

                    clRepScreen.v.tabDepth2List.forEach((cData, cIndex) => {
                        if (cData.rem1 === data.commonCode) {
                            // id 명을 동적으로 생성(2뎁스 탭 인덱스를 지정해줌) ex. 2번째 메뉴의 3번째 탭이면 id="buttons2-3" (멀티미디어 - 국어 작품 감상실)
                            const tab2AppendString = $(`
                              <span class="${data.commonCode === '01' ? "swiper-slide" : ""}" data-flag="tab2-${index + 2}" tab2 data-linked-to-2="cData.commonCode">
                                <input type="radio" name="radio${index + 2}" id="buttons${index + 2}-${createChildrenIndex+cIndex}" data-common-code="${cData.commonCode}">
                                <label for="buttons${index + 2}-${createChildrenIndex+cIndex}">${cData.name}</label>
                              </span>
                            `);

                            tab2Container.append(tab2AppendString);
                            tab2Container.find('span input').first().prop('checked',true);
                        }
                    });
                });
            },

            // 구분값 옵션 변경
            // parameter = null: 기존값 유지
            setReqGubunOption: function (classGubun1, classGubun2) {
                classGubun1 !== null ? clRepScreen.v.getTabListOption.classGubun1 = classGubun1 : "";
                classGubun2 !== null ? clRepScreen.v.getTabListOption.classGubun2 = classGubun2 : "";
            },

            // 페이지 옵션 변경
            setPageNo: function (pageNo) {
                pageNo ? clRepScreen.v.getTabListOption.pageNo = pageNo : "";
            },

            downDirectFile: (fileId)=>{
                const options = {
                    url: `/pages/api/file/down/${fileId}`,
                    method: 'GET',
                    xhrFields: {
                        responseType: 'blob'  // 서버로부터 Blob으로 응답 받기
                    },
                    success: function(data) {
                        // 다운로드 링크를 생성
                        return URL.createObjectURL(data);
                    },
                    error: function (error) {
                        console.error('Failed to fetch file : ',error);
                    }
                };
                return $.ajax(options);
            },

            openNewWin: function(url){
                const openLink = document.createElement('a');

                openLink.href = url;
                openLink.target = '_blank'; // 새 창에서 열도록 설정

                // 가상의 링크 엘리먼트를 문서에 추가하고 클릭 이벤트 발생
                document.body.appendChild(openLink);
                openLink.click();

                // 가상의 링크 엘리먼트를 제거
                document.body.removeChild(openLink);
            },

            buttonEvents : (data)=>{

                // 미리보기
                $(document).off('click','.clPreview').on('click','.clPreview',function (){
                    const titleIndex = $(this).parent().data('index').split('-')[0];
                    const itemIndex = $(this).parent().data('index').split('-')[1];
                    const refData = clRepScreen.v.getTabListOption.classGubun1 !== "" ? data[itemIndex] : data[titleIndex][itemIndex];
                    const {referenceFileId,referenceSeq,referenceUploadMethod,referencePath,code2Name,referenceName} = refData;

                    const source = referenceUploadMethod;
                    const refType = code2Name === "교과자료" ? "TEXTBOOK" : "TOTALBOARD";

                    const previewUrl = referenceUploadMethod === "PLAY" ? `/pages/api/preview/viewer.mrn?playlist=${referenceFileId}&playname=${referenceName}` : `/pages/api/preview/viewer.mrn?source=${source}&file=${referenceFileId}&referenceSeq=${referenceSeq}&type=${refType}`;
                    if(referenceUploadMethod !== "DIRECT"){
                        if (referenceUploadMethod === "LINK" && code2Name!== "교과자료"){ // 외부링크
                            window.open(referencePath,"_blank")
                        }else{
                            code2Name !== "내 링크 자료" && referenceUploadMethod !== "NEWWIN" ? screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview") : window.open(referencePath,"_blank");
                        }
                    }
                });

                // 다운로드
                $(document).off('click','.clDown').on('click','.clDown',function (){
                    const titleIndex = $(this).parent().data('index').split('-')[0];
                    const itemIndex = $(this).parent().data('index').split('-')[1];
                    const refData = clRepScreen.v.getTabListOption.classGubun1 !== "" ? data[itemIndex] : data[titleIndex][itemIndex];
                    const {referenceFileId,referenceUploadMethod,referencePath,referenceName} = refData;
                    let url;

                    if(referenceUploadMethod === 'DIRECT'){
                        url = clRepScreen.f.downDirectFile(referenceFileId);
                    }else{
                        url = `https://api-cms.mirae-n.com/down_content?service=mteacher&params=${referencePath.split("params=")[1]}`;
                    }

                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.target = '_blank'; // 다운로드를 새 창에서 열도록 설정
                    downloadLink.download = referenceName; // 다운로드되는 파일의 이름 설정

                    // 가상의 링크 엘리먼트를 문서에 추가하고 클릭 이벤트 발생
                    document.body.appendChild(downloadLink);

                    // 새창 열기
                    if(referenceUploadMethod === 'NEWWIN' || clRepScreen.v.getTabListOption.classGubun2 === 'MYDATA'){
                        clRepScreen.f.openNewWin(referencePath);

                        // 다운로드
                    }else{
                        downloadLink.click();
                    }

                    // 가상의 링크 엘리먼트를 제거
                    document.body.removeChild(downloadLink);
                });

                // 스크랩
                $(document).off('click','.clScrap').on('click','.clScrap',function (){
                    const titleIndex = $(this).parent().data('index').split('-')[0];
                    const itemIndex = $(this).parent().data('index').split('-')[1];
                    const refData = clRepScreen.v.getTabListOption.classGubun1 !== "" ? data[itemIndex] : data[titleIndex][itemIndex];
                    const isScrap = !$(this).hasClass('active');

                    clRepScreen.c.scrapCommonRef(isScrap,refData.referenceSeq,$(this));
                });

                // 공유
                $(document).off('click','.clShare').on('click','.clShare',function (){
                    const titleIndex = $(this).parent().data('index').split('-')[0];
                    const itemIndex = $(this).parent().data('index').split('-')[1];
                    const refData = clRepScreen.v.getTabListOption.classGubun1 !== "" ? data[itemIndex] : data[titleIndex][itemIndex];

                    $alert.alert("[안내] AI클래스 4월 오픈!<br/>"
                        + "학생들에게 공유하면,<br/>"
                        + "분석 리포트를 확인 할 수 있습니다.");
                    /*[운영/1023] AI 클래서 오픈 연기로인해 기능 주석처리
                    const seq = refData.referenceSeq;
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
            displayDataList: (keyList, valueList)=> {
                let tab1 = clRepScreen.v.getTabListOption.classGubun1; // 현재 탭1 commonCode
                let tab2 = clRepScreen.v.getTabListOption.classGubun2; // 현재 탭2 commonCode
                clRepScreen.v.totalItemList = tab1 !== "" ? [...clRepScreen.v.totalItemList].flat().concat([...valueList].flat()) :[...valueList]; // 각 배열을 평탄화하여 하나의 배열로 합침

                // 현재 탭1 인덱스
                const tabIdx = clRepScreen.v.tabUl1.find(`li[data-common-code="${tab1}"]`).data('linkedTo');
                const parentTab = $(document).find(`div#tab4-${tabIdx}`);

                // 목록 데이터 초기화
                clRepScreen.v.getTabListOption.pageNo === 1 ? tabIdx === 1 ? parentTab.empty() : parentTab.children(":not('div.depth2-tab')").remove() : "";

                keyList.forEach((title, titleIndex) => {
                    // 선택한 tab1의 자료 목록
                    const dataList = valueList[titleIndex];

                    let appendData = $(`
                        <div class="sub-lessons index${titleIndex} ${title}">
                            <h4>${title}</h4>
                            <div class="lesson-data"></div>
                        </div>
                    `);

                    let moreBtn = $(`
                    <div class="page-buttons">
                    ${ tabIdx!== 1 ? clRepScreen.m.moreBtn() : ""}
                    </div>
                `)

                    // 더보기버튼, data append, tab1 title 삭제
                    if(clRepScreen.v.getTabListOption.pageNo === 1){
                        if(clRepScreen.v.totalPage > 1) appendData.append(moreBtn);
                        if(dataList.length > 0) parentTab.append(appendData);
                        if(tabIdx !== 1) parentTab.find(`div.index${titleIndex}`).find('h4').remove();
                    }

                    // title 하위 자료 목록 append
                    dataList.forEach((data, index) => {
                        let key = `${titleIndex}-${(clRepScreen.v.getTabListOption.pageNo-1)*clRepScreen.v.getTabListOption.pageCount + index}`;
                        let appendItem = `
                            <div class="data referenceData ${$extension.extensionToNoData(data.referenceExtension)}" 
                            data-drag-yn="${data.dragYn}" 
                            data-reference-seq="${data.referenceSeq}"
                            data-file-id="${data.referenceFileId}">
                                <div class="inner-wrap" data-index="${key}">
                                    <div class="image-wrap clPreview">
                                        <img src="${data.thumbnailPath}" alt="">
                                    </div>
                                    <a 
                                    class="clPreview"
                                    href="javascript:void(0)">
                                    <span class="text-primary text-xxs">${data.code2Name}</span>
                                    <strong class="title-ellipsis">${data.referenceName}</strong>
                                    </a>
                                </div>
                                <div class="buttons" data-index="${key}">
                                    <button type="button" class="button type-icon size-sm clDown"
                                    ${(data.code1Name !== 'MYDATA' && !clRepScreen.f.ynToBoolean(data.referenceDownloadUseYn)) || data.referenceUploadMethod === 'NEWWIN' || (data.code1Name !== 'MYDATA' && data.referenceUploadMethod === 'LINK') || data.referenceUploadMethod === 'DIRECT' || data.referenceUploadMethod === 'YOUTUBE' ? 'disabled' : ''}>
                                        <svg>
                                            <title>아이콘 다운로드</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-${tab2 === 'MYDATA' || data.referenceUploadMethod === 'NEWWIN' ? "new-windows" : "download"}"></use>
                                        </svg>
                                    </button>
                                    <button 
                                    data-toast="cl-${key}"
                                    type="button" 
                                    class="button type-icon size-sm scrap toggle-this clScrap ${data.myScrapYn ===  'Y' || data.code1Name === 'SCRAP'? 'active' : ''}" ${clRepScreen.f.ynToBoolean(data.referenceScrapUseYn) ? '' : 'disabled'}
                                    >
                                        <svg>
                                            <title>아이콘 핀</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                        </svg>
                                    </button>
                                    <button type="button" class="button type-icon size-sm share clShare" ${clRepScreen.f.ynToBoolean(data.referenceShareUseYn) ? '' : 'disabled'}>
                                        <svg>
                                            <title>아이콘 공유</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                        </svg>
                                    </button>
                                    <button class="icon-button" style="display: none">
                                        <svg>
                                            <title>삭제 아이콘</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close-round"></use>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        `;


                        // 데이터 담기
                        parentTab.find(`div.index${titleIndex}`).find('div.lesson-data').append(appendItem);

                        // tab1- 내자료 화면단 케이스 분류
                        if(tabIdx === 6){
                            if(tab2 === 'MYDATA'){
                                // 함께보기 flag추가
                                const together = `<span class="badge type-round-box">함께 보기</span>`;
                                parentTab.find(`div[data-seq=${data.referenceSeq}] div.image-wrap`).empty()
                                data.myDataGubun === 'TOGETHER' ? parentTab.find(`div[data-seq=${data.referenceSeq}] div.image-wrap`).append(together) : "";

                                // 스크랩&공유버튼 삭제
                                parentTab.find('button.scrap').remove();
                                parentTab.find('button.share').remove();
                            }else {

                            }
                            // 교과서 매핑정보 추가
                            const textbookInfo = `
                                <a>
                                    <ul class="divider-group">
                                        <li class="text-primary">${data.code2Name}</li>
                                        <li>${!_.isNil(data.textbookName) ? data.textbookName : ""}</li>
                                    </ul>
                                    <strong>${data.referenceName}</strong>
                                </a>
                                `;

                            parentTab.find(`div[data-seq=${data.referenceSeq}].inner-wrap a`).remove();
                            parentTab.find(`div[data-seq=${data.referenceSeq}].inner-wrap`).append(textbookInfo);

                            // 더미 썸네일만 출력
                            data.thumbnailPath === '' ? parentTab.find('img').remove() : "";
                        }

                        // 드래그 드롭
                        (dataList.length === parentTab.find(`div.index${titleIndex}`).find('div.lesson-data').children().length) ? classLayerScreen.f.dragDrop() : "";

                    });

                    // tab1 - 전체탭 화면단
                    if(tabIdx === 1){
                        // 내 자료 삭제
                        parentTab.find(`div.내.자료`).remove();
                    }
                });

                clRepScreen.f.buttonEvents(clRepScreen.v.totalItemList);
            },

            // 'Y','N' -> true,false
            ynToBoolean: function (yn) {
                if (yn === 'Y' || yn === 'y' || yn === '' || yn === undefined) {
                    return true;
                } else if (yn === 'N' || yn === 'n') {
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
            await clRepScreen.v.tabUl1.on('click', 'li', async function () {
                clRepScreen.v.totalItemList = []; // 현재 탭 데이터 목록 초기화

                const selectedCmCode = $(this).data('commonCode');
                const parentIndex = $(this).data('linkedTo');
                const selectedTab2List = $(`#tab4-${parentIndex}`).find(clRepScreen.v.tabUl2);


                // 탭이 변경되는 경우에만 ajax 호출
                if (selectedCmCode !== lastClickedTabDepth1) {
                    // 탭2 초기화
                    selectedCmCode !== 99 ? selectedTab2List.find('span:gt(1)').remove() : selectedTab2List.find('span').remove();
                    // 탭2 리로드
                    await clRepScreen.f.fetchTabData();

                    // param 옵션 변경
                    if (selectedCmCode === '') { // 전체
                        clRepScreen.f.setReqGubunOption('', '');
                        clRepScreen.v.getTabListOption.pageCount = 10;
                    } else {
                        clRepScreen.f.setReqGubunOption(selectedCmCode, '');
                        clRepScreen.v.getTabListOption.pageCount = 10;
                    }
                    clRepScreen.f.setPageNo(1);

                    const classGubun2 = selectedTab2List.find('span input').eq(0).data('commonCode');
                    clRepScreen.v.getTabListOption.classGubun2 = _.isNil(classGubun2) ? '' : classGubun2;

                    // 데이터 목록 요청
                    if ($isLogin) {
                        await clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption);
                    }
                }
                // 탭 변경 플래그값
                lastClickedTabDepth1 = selectedCmCode;
            })

            // 탭2 변경시
            await clRepScreen.v.tabUl2.on('change', 'span input', function () {
                clRepScreen.v.totalItemList = []; // 현재 탭 데이터 목록 초기화

                const selectedCmCode = $(this).data('commonCode'); // '전체'인 경우 undefined

                // param 옵션 변경
                selectedCmCode ? clRepScreen.f.setReqGubunOption(null, selectedCmCode) : clRepScreen.f.setReqGubunOption(null, '');
                clRepScreen.f.setPageNo(1);

                // 보충 자료 목록 렌더
                if ($isLogin) {
                    clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption);
                }
            })

            // 더보기 버튼 클릭시
            $(document).off('click','button.moreBtn').on('click','button.moreBtn',function (){
                clRepScreen.f.setPageNo(clRepScreen.v.getTabListOption.pageNo + 1); // 현재 페이지 +1
                clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption); // 목록에 데이터 추가

                // 버튼 화면단
                let moreBtn = $(`${clRepScreen.m.moreBtn()}`);
                $(this).parent().empty().append(moreBtn);
                clRepScreen.v.getTabListOption.pageNo === clRepScreen.v.totalPage ? moreBtn.prop('disabled', true) : moreBtn.prop('disabled', false);
            });


            $('.cl-search-btn').on('click',function (e){
                if($('.cl-search-input').val() === ''){
                    $alert.alert('검색어를 입력해 주세요','negative','info');
                }else{
                    window.open(`/pages/common/totalsearch/totalSearch.mrn?searchTxt=${$('.cl-search-input').val()}&schoolLevel=ele`,'_blank');
                }
            })

            $('.cl-search-input').on('keypress',function (e){
                if(e.which === 13){
                    if($('.cl-search-input').val() === ''){
                        $alert.alert('검색어를 입력해 주세요','negative','info');
                    }else{
                        window.open(`/pages/common/totalsearch/totalSearch.mrn?searchTxt=${$('.cl-search-input').val()}&schoolLevel=ele`,'_blank');
                    }
                }
            })
        },

        m : {
            moreBtn : function(){
                return `
                <button type="button" class="button size-xl moreBtn"> 더보기 ${clRepScreen.v.getTabListOption.pageNo} / ${clRepScreen.v.totalPage}
                    <svg>
                        <title>아이콘 더보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                    </svg>
                </button>
            `;
            },
        },


        init: async function () {
            // 과목 세팅
            _.isNil(clRepScreen.v.getTabListOption.masterSeq) ? clRepScreen.v.getTabListOption.masterSeq = new URLSearchParams(window.location.search).get('masterSeq') : '';

            // 차시 세팅
            _.isNil(clRepScreen.v.getTabListOption.subjectSeq) ? clRepScreen.v.getTabListOption.subjectSeq = new URLSearchParams(window.location.search).get('subjectSeq') : '';

            // 단원 세팅
            const unit1Seq = $('.breadcrumbs ul li:nth-child(4) a').data('unit1Seq');
            const unit2Seq = $('.breadcrumbs ul li:nth-child(5) a').data('unit2Seq');
            const unit3Seq = $('.breadcrumbs ul li:nth-child(6) a').data('unit3Seq');

            if(unit3Seq){
                clRepScreen.v.getTabListOption.unitSeq = unit3Seq
            }else if(unit2Seq){
                clRepScreen.v.getTabListOption.unitSeq = unit2Seq
            }else if(unit1Seq){
                clRepScreen.v.getTabListOption.unitSeq = unit1Seq
            };

            // 보충 자료 목록 렌더
            if ($isLogin) {
                await clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption);
            }

            // 탭1, 탭2 데이터 바인딩
            clRepScreen.v.tabDepth1List = await clRepScreen.c.getCommonCd(['TB0221']);
            clRepScreen.v.tabDepth2List = await clRepScreen.c.getCommonCd(['TB0230']);

            // 탭1 렌더
            await clRepScreen.f.createTab1Element();

            // 탭2 렌더
            await clRepScreen.f.fetchTabData();

            await clRepScreen.event();
        }
    };

    clRepScreen.init();
})
