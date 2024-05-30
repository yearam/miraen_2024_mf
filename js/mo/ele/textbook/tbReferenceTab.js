let tbReferenceTab;

$(function () {
    let commonUrl = "/pages/ele/textbook"; // ajax 요청시 공통 url
    let lastClickedTab = ""; // 탭 변경 확인하기 위한 플래그값
    let lastClickedRefTab = ""; // 탭 변경 확인하기 위한 플래그값
    let displayNoData = '<div class="pane"><div class="box-no-data" style="border: none">등록된 자료가 없습니다.</div></div>';
    let displayNoDataForTeacher = `<div class="box-no-data" style="border: none">등록된 자료가 없습니다.</div>`;
    let pageLength = 12;
    let moreBtnObj = {};

    tbReferenceTab= {
        v : {
            isOnlyCMS : true,
            scrapObj : {},
            tabType : new URLSearchParams(window.location.search).get('tabType')
        },
        c: {
            // 교과서 공통자료 목록 가져옴
            commonItemList: () => {
                $.ajax({
                    type: "GET",
                    url: commonUrl + `/reference/commonList.ax?masterSeq=${classScreen.v.masterSeq}`,

                    success: function (res) {
                        console.log("교과서 공통 자료 가져옴", res.rows);
                        // 총건수
                        $('#refTotalCnt').text(res.totalCnt);
                        // checked 건수 - 디폴트 전체 선택
                        // $('#checkedRefCnt').text(res.totalCnt); // 다운로드 총건수 - 모바일 X

                        if(res.rows.length > 0){
                            $('#commonItemList').empty();

                            // 교과서 공통자료 목록
                            $.each(res.rows, function (index, item) {
                                const scrapKey = 'scrap' + item.referenceSeq;
                                tbReferenceTab.v.scrapObj[scrapKey] = false;

                                let displayList = $(`
                                    <li id="commonItems-${index}">
                                        <div class="inner-wrap">
                                            <i class="icon size-md type-round-box">
                                                <img alt="pdf 아이콘"
                                                     src="/assets/images/common/${$extension.extensionToIcon(item.extension)}"/>
                                            </i>
                                            <a class="title" 
                                            data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                                            data-file-id ="${item.referenceFileId}"
                                            data-source="${item.source}"
                                            data-seq="${item.referenceSeq}"
                                            data-uploadMethod="${item.uploadMethod}"
                                            ></a>
                                        </div>    
                                        <div class="buttons">
                                            <button class="button type-icon size-sm preview-btn"
                                                    type="button"
                                                    name="${item.referenceSeq}"
                                                    data-seq="${item.referenceSeq}"
                                                    data-file-id ="${item.referenceFileId}"
                                                    data-source="${item.source}"
                                                    data-upload-method="${item.uploadMethod}"
                                                    data-new-win-url="${item.originFileName}"
                                                    ${ynToBoolean(item.referencePreviewUseYn) ? '' : 'disabled'}>
                                                <svg>
                                                    <title>아이콘 돋보기</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#${item.uploadMethod === "NEWWIN" ? 'icon-new-windows' : 'icon-search'}"></use>
                                                </svg>
                                            </button>
                                            <!-- <button class="button type-icon size-sm ai-share" type="button" ${ynToBoolean(item.referenceShareUseYn) ? '' : 'disabled'}>
                                                <svg>
                                                    <title>아이콘 공유</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                </svg>
                                            </button>
                                        </div>  
                                    </li>
                                `);
                                $('#commonItemList').append(displayList);
                                $(`#commonItems-${index}`).find('a.title').text(cjs.text.left(item.referenceName, 40));

                                // 개별 스크랩 & 미리보기
                                displayList.off('click').on('click','div.buttons button',function (){
                                    const seq = $(this).data('seq');
                                    let fileId = $(this).data('fileId') ;
                                    let source = $(this).data('source');
                                    let url = $(this).data('newWinUrl');
                                    let uploadMethod = $(this).data('uploadMethod');

                                    if($(this).hasClass('scrap')){ // 스크랩 버튼 - 모바일 사용 X
                                        // dialog - 로그인 & 정교사 여부 확인
                                        // const teacher = checkTeacher('scrap');
                                        // const isAdd = $(this).hasClass('active') ? false : true;
                                        //
                                        // teacher ? tbReferenceTab.c.scrapCommonRef([seq],isAdd) : "";
                                        // console.log($(this).hasClass('active'));
                                        // teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";
                                    }else if ($(this).hasClass('preview-btn')){
                                        // dialog - 로그인 & 정교사 여부 확인
                                        const teacher = checkTeacher('');

                                        if(teacher){
                                            if(uploadMethod === 'NEWWIN'){
                                                window.open(url, "_blank");
                                            }else{
                                                tbReferenceTab.c.previewFile(fileId,source,seq);
                                            }
                                        }
                                    }
                                })
                            });
                        }else{
                            // 자료 없음
                            $('#commonItemList').empty();
                            $('#commonItemList').append(displayNoData);
                        }
                    },
                    error: function () {
                        alert("오류발생");
                    }
                });
            },

            // 카테고리별 체크박스 목록 가져옴
            // 수업자료tab:"class", 평가자료tab:"test", 멀티미디어자료tab:"multimedia", 특화자료tab:"special"
            filterList: (selectedCategory) => {
                $.ajax({
                    type: "GET",
                    url: commonUrl + `/reference/filterList.ax?tabName=${selectedCategory}&masterSeq=${classScreen.v.masterSeq}`,
                    success: function (res) {
                        // 수업자료 요청 param
                        let refDivCd4s = "";
                        let parentContent = $(`.categoryCheckbox[data-category-contain=${selectedCategory}] .ox-group-mobile`)

                        // 표시될 체크박스가 없는 경우 - TODO
                        if(res.length === 0){
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div div.ox-group-mobile`).empty();
                        }else {
                            // 데이터 패치 후 append
                            $.each(res, function (index, item) {
                                // 선택한 카테고리 목록 시퀀스 담기
                                refDivCd4s += `,${item.seq}`
                                if (refDivCd4s.startsWith(",")) refDivCd4s = refDivCd4s.slice(1);

                                // 화면단 렌더
                                let displayList = `<span class="ox">
                                <input class="filter-list-checkbox" id="ox-filter1-${index}" name="oxName${index}" data-name="oxFilter${index}" type="checkbox" data-seq="${item.seq}" checked/>
                                <label for="ox-filter1-${index}">${item.name}</label>
                                </span>`
                                // 상단 필터 영역에 추가
                                $(`.categoryCheckbox[data-category-contain=${selectedCategory}] .ox-group-mobile`).append(displayList);

                                let popupDisplayList = `<span class="ox">
                                <input class="filter-list-checkbox" id="ox-popup-filter1-${index}" name="oxFilter${index}" data-name="oxName${index}" type="checkbox" data-seq="${item.seq}" checked/>
                                <label for="ox-popup-filter1-${index}">${item.name}</label>
                                </span>`

                                // 모바일 필터 팝업에 추가
                                $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').append(popupDisplayList);
                            });

                            // 모바일 - 상단 필터 클릭시 active 상태 팝업 필터에 바인딩
                            $('input[name^=oxName]').off('click').on('click', function(e) {
                                let name = $(e.currentTarget).data('name');
                                let thisComponent = $('input[name=' + this.name + ']')

                                let target = $('input[name=' + name + ']')
                                if(thisComponent.is(':checked')) {
                                    target.prop('checked', true);
                                } else {
                                    target.prop('checked', false);
                                }
                            });

                            $('input[name^=oxFilter]').on('click', function(e) {
                                let name = $(e.currentTarget).data('name');

                                $('input[name=' + name + ']').trigger('click');
                            });

                            // 모바일 - 초기화 버튼 클릭 이벤트 - 초기상태(카테고리 전체 선택)
                            $('button.reset-btn-mobile').on('click', function() {
                                $('.ox-group-mobile span.ox input').prop('checked', true); // 상단 필터 checked
                                $('.ox-group-popup-mobile span.ox input').prop('checked', true); // 팝업 필터 checked
                                $('button.apply-btn-mobile').trigger('click');
                            });

                            // 모바일 - 선택적용 버튼 클릭 이벤트
                            $('button.apply-btn-mobile').on('click', async function() {
                                const checkedInputs = $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').find('span.ox input:checked');

                                let checkedListStr = '';

                                for (let i=0; i<checkedInputs.length; i++){
                                    checkedListStr += `,${checkedInputs.eq(i).data('seq')}`;
                                };

                                checkedListStr = checkedListStr.slice(1);

                                // 초기화 - 카테고리 탭 자료 영역
                                $(".classRefList").empty();
                                // $(".classRefList").find('li').remove();
                                // $(".classRefList").find('div.item').remove();

                                // 자료 요청
                                tbReferenceTab.c.classList(checkedListStr,selectedCategory);

                                closePopup({id: 'popup-sheet'});
                            });

                            parentContent.find('span.ox input').on('click', async function () {
                                const checkedInputs = parentContent.find('span.ox input:checked').not('input.all');

                                let checkedListStr = '';

                                for (let i=0; i<checkedInputs.length; i++){
                                    checkedListStr += `,${checkedInputs.eq(i).data('seq')}`;
                                };

                                checkedListStr = checkedListStr.slice(1);

                                // 초기화 - 카테고리 탭 자료 영역
                                $(".classRefList").empty();
                                // $(".classRefList").find('li').remove();
                                // $(".classRefList").find('div.item').remove();

                                // 자료 요청
                                tbReferenceTab.c.classList(checkedListStr,selectedCategory);
                            });
                        }
                        tbReferenceTab.c.classList(refDivCd4s, selectedCategory);
                    },

                    error: function (err) {
                        console.log(err);
                        alert("오류발생")
                    }
                })
            },

            // 자료 가져옴
            classList: (refDivCd4s, selectedCategory) => {
                let url = commonUrl + `/reference/${selectedCategory}List.ax?masterSeq=${classScreen.v.masterSeq}&refDivCd4s=${refDivCd4s}`;
                if(selectedCategory === 'multimedia') url += `&pageLength=${pageLength}`
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (res) {
                        console.log(`${selectedCategory} 자료 가져옴 : `, res);
                        const appendParent = $(`.categoryDataList[data-category-contain="${selectedCategory}"] div ul.classRefList`);

                        if (res.length !== 0) {
                            $.each(res, function (index, item) {
                                let refList = item.refList ? [...item.refList] : [];
                                let uNN = item.referenceListUnitName !== '' ? item.referenceListUnitName : item.unitNumberName !== '' ? item.unitNumberName : '';

                                let accordionContent = $(`
                                <li class="classRefItems" style="display: ${uNN.length === 0 ? 'none' : ''}" >
                                    <a class="list-depth action">
                                        <div class="header-wrap">
                                            <span class="number-unit">${uNN}.</span>
                                            <h3>${item.unitName}</h3>
                                        </div>
                                    </a>
                                    <div class="pane">
                                        <ul class="chapter-items">
                                        </ul>
                                    </div>
                                </li>
                            `);

                                if(refList.length > 0){
                                    // 아코디언 콘텐츠
                                    $.each(refList, function (idx, itm) {
                                        let subject;

                                        if(_.isNil(itm.subjectSeq)){
                                            subject = "공통자료";
                                        }else{
                                            subject = itm.singleSubjectUseYn === 'Y' ? `${itm.startSubject}차시` :  `${itm.startSubject}~${itm.endSubject}차시`;
                                        }

                                        let accordionChildList = $(`
                                        <li>
                                            <ul class="divider-group">
                                                <li>${itm.unitSort} 단원</li>
                                                <li>${subject}</li>
                                            </ul>
                                            <div class="inner-wrap">
                                              <i class="icon size-md type-round-box">
                                                <img alt="${itm.fileType} 아이콘"
                                                         src="/assets/images/common/${$extension.extensionToIcon(itm.extension)}"/>
                                              </i>
                                              <a class="title" 
                                              data-is-disabled="${ynToBoolean(itm.referencePreviewUseYn)}"
                                              data-file-id ="${itm.referenceFileId}"
                                              data-source="${itm.source}"
                                              data-seq="${itm.referenceSeq}"
                                              >${cjs.text.left(itm.referenceName, 40)}</a>
                                            </div>
                                            <div class="buttons">
                                                <button class="button type-icon size-sm preview-btn"
                                                        data-file-id="${itm.referenceFileId}"
                                                        data-new-win-url="${itm.originFileName}"
                                                        data-upload-method="${itm.uploadMethod}"
                                                        name="${itm.referenceFileId}"
                                                        type="button"
                                                        data-source="${itm.source}"
                                                        data-seq="${itm.referenceSeq}"
                                                        ${ynToBoolean(itm.referencePreviewUseYn) ? "" : "disabled"}>
                                                    <svg>
                                                        <title>아이콘 돋보기</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#${itm.uploadMethod === "NEWWIN" ? 'icon-new-windows' : 'icon-search'}"></use>
                                                    </svg>
                                                </button>
                                                <!-- <button class="button type-icon size-sm ai-share"
                                                        type="button"
                                                        ${ynToBoolean(itm.referenceShareUseYn) ? "" : "disabled"}>
                                                    <svg>
                                                        <title>아이콘 공유</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                    </svg>
                                                </button> -->
                                            </div>  
                                        </li>
                                    `);

                                        accordionContent.find('ul.chapter-items').append(accordionChildList);

                                        // 개별 스크랩 & 미리보기
                                        accordionChildList.off('click').on('click','button',function (){
                                            const seq = $(this).data('seq');
                                            const source = $(this).data('source');
                                            let uploadMethod = $(this).data('uploadMethod');
                                            let fileId = $(this).data('fileId');
                                            let url = $(this).data('newWinUrl');

                                            if($(this).hasClass('scrap')){ // 스크랩 버튼 - 모바일 사용 X
                                                // const isAdd = $(this).hasClass('active') ? false : true;
                                                // // dialog - 로그인 & 정교사 여부 확인
                                                // const teacher = checkTeacher('scrap');
                                                // teacher ? tbReferenceTab.c.scrapCommonRef([seq],isAdd) : "";
                                                // teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";

                                            }else if ($(this).hasClass('preview-btn')){
                                                // dialog - 로그인 & 정교사 여부 확인
                                                const teacher = checkTeacher('');

                                                if(teacher){
                                                    if(uploadMethod === 'NEWWIN'){
                                                        window.open(url, "_blank");
                                                    }else{
                                                        tbReferenceTab.c.previewFile(fileId,source,seq);
                                                    }
                                                }
                                            }
                                        });
                                    })
                                    // 자료 없음
                                } else{
                                    accordionContent.append(displayNoData);
                                }
                                // 선택한 카테고리탭별 html 렌더
                                appendParent.append(accordionContent);

                                // 펼친상태에서는 통신 후 동일하게 펼친 상태가 되도록 추가
                                const $foldingBtn = $(`.categoryDataList[data-category-contain=${selectedCategory}] span.switcher > input.folding-all`);
                                const isFoldingBtnChecked = $foldingBtn.is(':checked');

                                if (isFoldingBtnChecked) { // true면 checked
                                    appendParent.find('li').addClass('active');
                                    appendParent.find('li div.pane').css('display', 'block');
                                } else {
                                    appendParent.find('li').removeClass('active');
                                    appendParent.find('li div.pane').css('display', 'none');
                                }
                            });
                        } else if (res.length === 0) { // 자료가 없는 경우
                            const $selectedCategory = $(`.categoryCheckbox[data-category-contain=${selectedCategory}]`); // 카테고리 탭(ex: 자료모아보기 > 수업자료)
                            // 카테고리 필터의 개수가 0이고 자료도 없는 경우 // classList 렌더링 전 카테고리 필터가 먼저 렌더링
                            if ($selectedCategory.find('.ox-group-mobile span.ox').length === 0) {
                                // 선생님 공유자료와 동일한 구조로 렌더링
                                $selectedCategory.empty();
                                $selectedCategory.append(`<ul class="chapter-items classRefList">${displayNoDataForTeacher}</ul>`);
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        alert("오류발생")
                    }
                })
            },

            // 선생님 공유자료
            teacherShareList: (selectedCategory) => {
                $.ajax({
                    type: "GET",
                    url: commonUrl + `/reference/teacherShareList.ax?masterSeq=${classScreen.v.masterSeq}`,

                    /* 전송 후 세팅 */
                    success: function (res) {
                        console.log("teacher 자료 가져옴", res);
                        // 표시될 데이터가 없는 경우
                        if(res.length === 0 || res.resultCode === "999"){
                            // $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div div.ox-group`).css({"width": 100 , "margin": "0 auto"});
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] ul.classRefList`).empty();
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] ul.classRefList`).append(displayNoDataForTeacher);
                        }else{
                            // 선생님 공유 자료 데이터 렌더 영역
                            $.each(res, function (index, item) {
                                const referenceUnitName = item.unit2NumberName !== undefined ? item.unit1NumberName + "-(" + item.unit2NumberName + ")단원" : item.unit1NumberName + "단원"
                                const subject = _.isNil(item.subjectSeq) ? "공통 자료" : item.singleSubjectUseYn === "Y" ? item.startSubject + "차시" : item.startSubject + "~" + item.endSubject + "차시"

                                const upper = $(`.categoryDataList[data-category-contain="teacher"] ul.classRefList`);
                                let accordionContent = $(`
                            <input name="${item.mappingSeq}" data-upload-method="NEWWIN" style="display: none"/>
                            <li>
                                <ul class="divider-group">
                                    <li>${referenceUnitName}</li>
                                    <li>${subject}</li>
                                </ul>
                                <div class="inner-wrap">
                                    <i class="icon size-md type-round-box">
                                        <img alt="${item.fileType} 아이콘"
                                                 src="/assets/images/common/${$extension.extensionToIcon(item.fileType)}"/>
                                    </i>
                                    <a class="title" 
                                    data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                                    data-file-id ="${item.referenceFileId}"
                                    data-seq="${item.mappingSeq}"
                                    data-source="${item.source}"
                                    >${item.referenceName}</a>
                                </div>
                                <div class="buttons">
                                    <button class="button type-icon size-sm new-win" data-path="${item.path}"
                                            type="button" name="${item.mappingSeq}">
                                        <svg>
                                            <title>아이콘 새창</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                        </svg>
                                    </button>
                                    <!-- <button class="button type-icon size-sm ai-share" type="button" ${!ynToBoolean(item.referenceShareUseYn) ? "disabled" : ""}>
                                        <svg>
                                            <title>아이콘 공유</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                        </svg>
                                    </button> -->
                                </div>
                            </li>`);

                                upper.append(accordionContent);

                                // 새창열기
                                $('button.new-win').on('click',function (){
                                    const url = $(this).data('path');
                                    return window.open(url,"_blank");
                                });
                            })
                        }
                    },
                    error: function () { //시스템에러
                        alert("오류발생");
                    }
                });
            },

            //스크랩 - 모바일 X
            // scrapCommonRef: (scrapList,isAdd) => {
            //     console.log('scrap refId list : ', scrapList);
            //     const scrapUrl = isAdd ? '/pages/api/mypage/addScrap.ax' : '/pages/api/mypage/updateScrap.ax'
            //
            //     scrapList.map((refId)=>{
            //         let opt = {scrapType : "TEXTBOOK"};
            //
            //         if(isAdd) {
            //             opt.referenceSeq = refId;
            //             opt.useYn = "Y";
            //         }else{
            //             opt.referenceSeqList = refId;
            //         }
            //
            //         return $.ajax({
            //             url: scrapUrl,
            //             method : 'POST',
            //             data : opt,
            //             success: function (res){
            //                 if(res.resultCode === '0000'){
            //                     return true;
            //                 }
            //             },
            //             error: function (){
            //                 alert('스크랩 실패하였습니다');
            //             }
            //         })
            //     })
            // },

            // 더보기 - 멀티미디어탭 - 모바일 X
            // multimediaListMore: (refDivCd4s,bigUnitSeq,selectedCategory,page)=>{
            //     return $.ajax({
            //         type: "GET",
            //         url: commonUrl + `/reference/multimediaListMore.ax?masterSeq=${classScreen.v.masterSeq}&refDivCd4s=${refDivCd4s}&pageLength=${pageLength}&moreCount=${page}&bigUnitSeq=${bigUnitSeq}`,
            //         success: function (res) {
            //             console.log(`${selectedCategory} 더보기 자료 가져옴 : `, res);
            //         },
            //         error: function () {
            //             alert("오류발생");
            //         }
            //     })
            //
            // },

            // 파일 미리보기
            previewFile: (fileId,source,seq) => {
                console.log(fileId, source);
                const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${fileId}&referenceSeq=${seq}&type=TEXTBOOK`;
                screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview");
            },
        },

        // 전체 파일 다운로드 - 모바일 X
        // totalDownload : function (selectedCategory,parent,bigUnitLength){
        //     $(`div[data-category-contain=${selectedCategory}]`).find('a.total-download').on('click',()=>{
        //         $alert.open('MG00060');
        //         // let totalCheckedList = [];
        //         // let checkedListNew = [];
        //         // let parentEl = `.categoryDataList[data-category-contain="${selectedCategory}"] div ul.classRefList`;
        //         //
        //         // for (let i=0; i<bigUnitLength; i++){
        //         //     checkedListNew = [...checkedInputList(_.isNil(parent) ? `${parentEl} .class-ref${i}` : parent,'multiDownload')];
        //         //     totalCheckedList = totalCheckedList.concat(checkedListNew);
        //         // };
        //         //
        //         // // dialog - 로그인 & 정교사 여부 확인
        //         // const check = checkTeacher('multiDownload');
        //         //
        //         // // dialog - 선택한 자료 없음
        //         // if(check && totalCheckedList.length === 0){
        //         //     checkFirst();
        //         //
        //         // } else {
        //         //     check ? copyrightAlert(totalCheckedList): "";
        //         // }
        //     })
        // },


        event: function (){

            // 공유하기 버튼 클릭
            $('.classRefList, #commonItemList').on('click','button.ai-share',function (){
                $alert.alert("[안내] AI클래스 4월 오픈!<br/>"
                    + "학생들에게 공유하면,<br/>"
                    + "분석 리포트를 확인 할 수 있습니다.");
                /* [운영/1023] AI 클래서 오픈 연기로인해 기능 주석처리
                $alert.open('MG00054', function () {
                    const url = 'https://ele.m-teacher.co.kr/mevent/aiClass/';
                    window.open(url,"_blank");
                });
                */
            })

            // // 교과서 명 호버시 cursor
            // $('#commonItemList, .classRefList').on('mouseover','a.title',function (){
            //     $(this).data('isDisabled') ? $(this).css({cursor:"pointer"}) : "";
            // })
            //
            // $('.total-download').on('mouseover',function (){
            //     $(this).css({cursor:"pointer"});
            // })

            // 교과서 명 클릭시 미리보기 뷰어 오픈
            $('#commonItemList, .classRefList').on('click','a.title',function (){
                console.log('check title');

                const check = checkTeacher();
                const isDisabled = $(this).data('isDisabled');
                const fileId = $(this).data('fileId');
                const source = $(this).data('source');
                const seq = $(this).data('seq');
                const uploadMethod = $(`input[name="${seq}"]`).data('uploadMethod');
                console.log(uploadMethod);

                isDisabled && check ? uploadMethod !== "NEWWIN" ? tbReferenceTab.c.previewFile(fileId,source,seq) : $(`button.new-win[name="${seq}"]`).trigger('click') : "";
            })

            // // 전체 스크랩 - 모바일 X
            // $('button.total-scrap').off('click').on('click',(e)=> totalScrap(e));

            // // snb 변경시 (교과서 변경)
            // $('.snb-inner ul.subject-items li').on('click',function (){
            //     lastClickedTab = 'clickSnb';
            //     lastClickedRefTab = '';
            //     $('#textbookActiveTab ul li').eq(1).trigger('click');
            // });
            //
            // // 학년, 학기 변경시
            // $('.snb-inner .snb-header ul li').on('click',function (){
            //     lastClickedTab = 'clickSnb';
            //     lastClickedRefTab = '';
            //     $('#textbookActiveTab ul li').eq(1).trigger('click');
            // });

            // '자료 모아보기' 탭 클릭시 초기 화면 렌더
            $('#textbookActiveTab ul').on('click', 'li', function () {
                const currentClickedTab = $(this).data('tabIndex');

                // '자료 모아보기' 탭으로 변경시에만 ajax 호출
                if (lastClickedTab !== 'tab2' && currentClickedTab === 'tab2') {
                    // 기존 데이터 및 플래그값 초기화
                    $('#commonItemList').empty();

                    // 교과서 공통자료 ajax 호출
                    tbReferenceTab.c.commonItemList();

                    // '자료 모아보기' 탭으로 변경시 첫번째 카테고리 체크박스 영역 함께 렌더
                    $('#categoryTab ul li a').first().trigger('click');
                    lastClickedRefTab = $('#categoryTab ul li').first().data('categoryTabIndex');
                }

                // 탭을 변경했는지 확인하기 위한 플래그값
                lastClickedTab = $(this).data('tabIndex');
            });

            // 카테고리 탭 클릭시 - 카테고리 리스트 체크박스 영역
            $('#categoryTab ul').on('click', 'li', function () {
                //클릭한 카테고리
                let selectedCategory = $(this).data('categoryTabIndex');

                // 자료 탭 변경시에만 데이터 패치
                // if (lastClickedRefTab !== selectedCategory) {
                // 초기화 - 카테고리 탭 체크박스 영역
                $(".categoryCheckbox .ox-group-mobile").empty();

                // 초기화 - 모바일 카테고리 탭 팝업 영역
                $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').empty();

                if (selectedCategory === "teacher") {
                    $(".classRefList").find('li').remove();

                    // 카테고리 목록 호출 /* 24.02.26 여기 */
                    tbReferenceTab.c.teacherShareList(selectedCategory);
                } else {
                    // 초기화 - 카테고리 탭 자료 영역
                    $(".classRefList").find('li').remove();
                    //$(".classRefList").find('div').remove();

                    // 카테고리 목록 호출
                    tbReferenceTab.c.filterList(selectedCategory);
                }
                // }
                // 탭을 변경했는지 확인하기 위한 플래그값
                lastClickedRefTab = selectedCategory;
            });

            // if (tbReferenceTab.v.tabType === 'referenceTab') {
            //     $(document).ready(()=>{
            //     })
            //     let headerHeight = $('header').outerHeight(); // 헤더의 높이를 가져옴
            //
            //     // console.log("headerHeight", headerHeight);
            //
            //     $("#categoryTab").get(0).scrollIntoView({
            //         behavior: "smooth",
            //         block: "start",
            //         inline: "nearest"
            //     });
            //
            //     // 헤더의 높이만큼 스크롤을 위로 조정
            //     // $('html, body').animate({
            //     //     scrollTop: $('#categoryTab').getBoundingClientRect().top- headerHeight
            //     // }, 500); // 500은 애니메이션 속도 조절, 필요에 따라 수정
            // }
            //

        },

        init: function () {
            tbReferenceTab.event();
        },
    };
    tbReferenceTab.init();
});


// 체크박스 컨트롤
/*
* checkAll: 전체 체크/해제 하는 input 구분자
* checkedItem: 체크박스 개별 input
* downloadCnt: 선택된 체크박스 갯수
* */
function handleCheckbox(checkAll, checkedItem, downloadCnt, scrapCnt){
    // 부모 인풋 클릭시 화면제어
    $(checkAll).on('click',(e)=>{
        const {checked} = e.currentTarget;
        const checkedYn = [];

        // 부모 인풋 체크/해제시 하위인풋 모두 체크/해제
        $(checkedItem).prop('checked', checked);

        $(checkedItem).each(function (){
            // checked true인 경우 리스트에 fileId push
            if($(this).prop('checked')) checkedYn.push($(this).data('fileId'));
        });

        // 총건수 화면 렌더
        checked ? $(downloadCnt).text($(checkedItem).length) : $(downloadCnt).text(0);
        checked ? $(scrapCnt).text($(checkedItem).length) : $(scrapCnt).text(0);
    });


    // 하위 인풋 클릭시 화면제어
    $(checkedItem).on('click',function(e){
        const {checked} = e.currentTarget;
        const checkedYn = [];

        // 하위 인풋 체크 해제한 경우 부모 인풋도 체크 해제
        if(!checked) $(checkAll).prop('checked', false);

        // 하위 인풋 모두 체크상태이면 부모 인풋도 체크
        $(checkedItem).each(function (){
            // checked true인 경우 리스트에 fileId push
            if($(this).prop('checked')) checkedYn.push($(this).data('fileId'));
        });
        if($(checkedItem).length === checkedYn.length) $(checkAll).prop('checked', true);

        // 총건수 화면 렌더
        $(downloadCnt).text(checkedYn.length);
        $(scrapCnt).text(checkedYn.length);
    });
}

// 'Y','N' -> true,false
function ynToBoolean(yn) {
    if (yn == 'Y' || yn == 'y') {
        return true;
    } else if (yn == 'N' || yn == 'n') {
        return false;
    } else {
        return yn;
    }
}


// 초단위 시간을 시,분,초 로 변경 (10:2:6 -> 10:02:06 형태)
function timeChanger(second) {
    // 시간, 분, 초 계산
    const minutes = Math.floor(second / 60);
    const seconds = second % 60;
    let result;
    if (second > 3599) {
        result = "1시간 초과 불가"
    } else {
        result = $text.lpad(minutes, 2, "0") + ":" + $text.lpad(seconds, 2, "0");
    }
    return result
}


// 선택된 체크박스 목록
function checkedInputList(parent,type) {
    let checkedInputs = [];
    let isAddList = [];

    $.each($(`${parent} input[type="checkbox"]:checked`).not('input.all'), function (index, checkbox) {
        const seq = $(checkbox).attr('name');

        if(type === 'fileId'){
            checkedInputs.push($(checkbox).attr('data-file-id'));
        }else if(type === 'refSeq'){
            checkedInputs.push($(checkbox).attr('data-ref-seq'));
            isAddList.push(!$(`button.scrap[name="${seq}"]`).hasClass('active'));
        }else if(type === 'multiDownload'){
            const params = $(checkbox).attr('data-params');
            const uploadMethod = $(checkbox).attr('data-upload-method');
            const useDownloadYn = $(checkbox).attr('data-down-yn');

            let multiParam = {params: null };

            multiParam.params = params;

            if(uploadMethod === 'CMS' && useDownloadYn === "Y"){
                checkedInputs.push(multiParam);
            }
        }else{
            checkedInputs.push($(checkbox).attr('name'));
        }
    });

    // console.log(checkedInputs);
    if(type === "refSeq") return {checkedInputs,isAddList}
    return checkedInputs;
}


// 다이렉트 업로드인 경우 -> 꼭 ajax 거쳐서 createObjectURL 해줘야 할지.. 그냥 바로 clickDown 에서 path 로 지정해서 테스트 해볼것
function downDirectFile(fileId){
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
    $.ajax(options);
};


// 다운로드 - 모바일 X
// const clickDown = (e)=>{
//     const teacher = checkTeacher('');
//
//     if(teacher){
//         let path = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('url');
//         let name = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('originName');
//         let fileId = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('fileId');
//         const uploadMethod = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('uploadMethod');
//
//         if(uploadMethod === 'CMS') path = `https://api-cms.mirae-n.com/down_content?service=mteacher&params=${path}`
//         if(uploadMethod === 'DIRECT') path = downDirectFile(fileId);
//
//         console.log(uploadMethod, path,name)
//
//         const downloadLink = document.createElement('a');
//         downloadLink.href = path;
//         downloadLink.target = '_blank'; // 다운로드를 새 창에서 열도록 설정
//         downloadLink.download = name; // 다운로드되는 파일의 이름 설정
//
//         // 가상의 링크 엘리먼트를 문서에 추가하고 클릭 이벤트 발생
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//
//         // 가상의 링크 엘리먼트를 제거
//         document.body.removeChild(downloadLink);
//     }
// }

// // 전체 스크랩 - 모바일 X
// function totalScrap(e){
//     const teacher = checkTeacher('scrap');
//
//     let checkedList = checkedInputList('#commonItemList', 'refSeq').checkedInputs;
//     let isAddList = checkedInputList('#commonItemList', 'refSeq').isAddList;
//
//     checkedList = checkedList.filter((v, k) => {
//         return isAddList[k]
//     });
//
//     teacher ? tbReferenceTab.c.scrapCommonRef(checkedList,true) : "";
// }

// Toastify.js로 토스트 메시지 표시 함수
function showToast(message) {
    Toastify({
        text: message,
        duration: 3000,  // 토스트 메시지가 표시되는 시간 (밀리초)
        gravity: 'top',  // 토스트 메시지 위치 (top, center, bottom)
        position: 'center',  // 토스트 메시지 위치 (left, center, right)
        style: {backgroundColor: '#2ecc71'},  // 토스트 메시지 배경색
        stopOnFocus: true,  // 포커스 시 토스트 메시지 중지 여부
    }).showToast();
}

function loginAlert() {
    $alert.open("MG00001", () => {
        let url = '';
        let cookies = document.cookie.split(`; `).map((el) => el.split('='));
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i][0] === 'loginUrl') {
                url = cookies[i][1]+cookies[i][2];
                break;
            }
        }
        location.href = url;
    });
}

// 정회원 교사만 사용 가능 - 멀티 다운로드, 미리보기, 다운로드, 공유
function needAuthAlert1(){
    //교사 인증이 필요합니다.
    $alert.open("MG00011", () => {});
}


// 정회원 교사만 사용 가능 - 스크랩
function needAuthAlert2(){
    //교사인증을 하시면 이용이 가능합니다.
    $alert.open("MG00003", () => {});
}

// 선택항목 여부 체크
function checkFirst(){
    //선택할 항목을 먼저 체크해 주세요.
    $alert.open('MG00023',()=>{});
}

// 저작권 안내 alert
function copyrightAlert(itemList){
    $alert.open("MG00010", () => {
        $multidown.open(itemList);
    });
}

function checkTeacher(type){
    if ($isLogin) {
        if ($('#userGrade').val() === '001') {
            if(type !== 'scrap') needAuthAlert1();
            if(type === 'scrap') needAuthAlert2();
            return false;
        } else if ($('#userGrade').val() === '002') {
            return true;
        }
    } else {
        loginAlert();
        return false;
    }
}