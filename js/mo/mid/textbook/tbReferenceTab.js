let tbReferenceTab;

$(function(){
    let resetV = {
        refUrl : "/pages/api/textbook-refer", // ajax 요청시 공통 url
        masterSeq : new URLSearchParams(window.location.search).get("masterSeq"),
        lastClickedRefTab : "",
        multiMediaRefLastPage : 1,
        displayNoData : '<div class="pane" style="display: block;"><div class="box-no-data" style="border: none">등록된 자료가 없습니다.</div></div>',
        pageLength : 12,
        moreBtn : true
    }
    tbReferenceTab= {
        v: {
            refUrl : "/pages/api/textbook-refer", // ajax 요청시 공통 url
            masterSeq : new URLSearchParams(window.location.search).get("masterSeq"),
            lastClickedRefTab : "",
            multiMediaRefLastPage : 1,
            displayNoData : '<div class="pane" style="display: block;"><div class="box-no-data" style="border: none">등록된 자료가 없습니다.</div></div>',
            pageLength : 12,
            moreBtn : true,
            currentUnit : null,
            currentUnitDepth : 2
        },
        c: {
            // 교과서 공통자료 목록 가져옴
            commonItemList: () => {
                $.ajax({
                    type: "GET",
                    url: `/pages/mid/textbook/reference/commonList.ax?masterSeq=${tbReferenceTab.v.masterSeq}`,

                    success: function (res) {
                        console.log("교과서 공통 자료 가져옴", res);

                        // 총건수
                        $('#refTotalCnt').text(res.totalCnt);
                        // checked 건수 - 디폴트 전체 선택
                        //$('#checkedRefCnt').text(res.totalCnt);

                        let displayList;

                        if (res.rows.length > 0) {
                            // 교과서 공통자료 목록
                            $.each(res.rows, function (index, item) {
                                displayList = $(`
                                    <li id="commonItems-${index}" class="item commonItems">
                                        <div class="inner-wrap">
                                            <i class="icon size-md type-round-box">
                                                <img alt="" src="/assets/images/common/${$extension.extensionToIcon(item.extension)}"/>
                                            </i>
                                            <a class="title"
                                            data-seq="${item.referenceSeq}"
                                            data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                                            data-file-id ="${item.referenceFileId}"
                                            data-source="${item.source}"
                                            >${cjs.text.left(item.referenceName, 40)}</a>
                                        </div>
                                        <div class="buttons">
                                            <button class="button type-icon size-sm preview-btn"
                                                    type="button"
                                                    data-seq="${item.referenceSeq}"
                                                    data-file-id="${item.referenceFileId}"
                                                    data-source="${item.source}"
                                                    data-upload-method="${item.uploadMethod}"
                                                    data-url="${item.path}"
                                                    ${ynToBoolean(item.referencePreviewUseYn) ? '' : 'disabled'}>
                                                <svg>
                                                    <title>아이콘 돋보기</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#${item.uploadMethod === "NEWWIN" ? 'icon-new-windows-single' : 'icon-search'}"></use>
                                                </svg>
                                            </button>
                                            <!-- <button class="button type-icon size-sm ai-share" type="button" ${ynToBoolean(item.referenceShareUseYn) ? '' : 'disabled'}>
                                                <svg>
                                                    <title>아이콘 공유</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                </svg>
                                            </button> -->
                                        </div>
                                    </li>
                                `);
                                $('#commonItemList').append(displayList);

                                // 개별 스크랩 - 모바일 x
                                // displayList.off('click').on('click', 'button.scrap', function () {
                                //     const teacher = checkTeacher('scrap');
                                //     const refSeq = $(this).prop('name');
                                //     const isAdd = $(this).hasClass('active') ? false : true;
                                //
                                //     teacher ? tbReferenceTab.c.scrapCommonRef([refSeq],isAdd) : "";
                                //     teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') :"";
                                //
                                // })

                                // 미리보기
                                displayList.find('div.buttons button.preview-btn').on('click',function (){
                                    const teacher = checkTeacher('');
                                    const source = $(this).data('source');
                                    const fileId = $(this).data('fileId');
                                    const path = $(this).data('url');
                                    const uploadMethod = $(this).data('uploadMethod');
                                    const seq = $(this).data('seq');


                                    if(teacher){
                                        // 새창이동
                                        if(uploadMethod === 'NEWWIN'){
                                            window.open(path, "_blank");

                                            // 뷰어
                                        }else{
                                            previewFile(fileId,source,seq);
                                        }
                                    }
                                })

                            });
                        } else {
                            // 자료 없음
                            $('#commonItemList').css({"margin": "0 auto"});
                            $('#commonItemList').empty();
                            $('#commonItemList').append(tbReferenceTab.v.displayNoData);
                        }
                        // 체크박스 핸들링 - 모바일 x
                        //handleCheckbox('#ox1-common-1', '.common-ref-checkbox', '#checkedRefCnt', '#refTotalCnt');

                        // 전체 스크랩 - 모바일 x
                        // $('#commonRefContainer').off('click').on('click','button.scrap', async function (e) {
                        //     const teacher = checkTeacher('scrap');
                        //     const checkedObj = checkedInputList('#commonItemList','refSeq');
                        //
                        //     let checkedList = checkedObj.checkedInputs;
                        //     const isAddList = checkedObj.isAddList;
                        //
                        //     checkedList = checkedList.filter((v, k) => {
                        //         return isAddList[k]
                        //     });
                        //
                        //     checkedList.length > 0 ? $(this).attr('hasInputs',true) : $(this).attr('hasInputs',false);
                        //
                        //     let result = teacher ? checkedList.length > 0 ? await tbReferenceTab.c.scrapCommonRef(checkedList, true, 'totalScrap') : checkFirst() : "";
                        //
                        //     !_.isNil(result) && result.length > 0 ? toastScreen.f.scrapTextbook(e) : "";
                        // })

                        // 멀티 다운로드 - 모바일 x
                        // $('#commonRefContainer').find("button.multi-down-btn").on('click', function () {
                        //     if(multi_use_yn){
                        //         const checkedList = checkedInputList('#commonItemList','multiDownload');
                        //
                        //         // dialog - 로그인 & 정교사 여부 확인
                        //         const check = checkTeacher('multiDownload');
                        //
                        //         // dialog - 선택한 자료 없음
                        //         if(check && checkedList.length === 0){
                        //             checkFirst();
                        //
                        //         }else {
                        //             check ? copyrightAlert(checkedList) : "";
                        //         }
                        //     }else{
                        //         $alert.open('MG00060');
                        //     }
                        // })
                    },
                    error: function () {
                        alert("오류발생");
                    }
                });
            },

            // 카테고리별 체크박스 목록 가져옴
            // 수업자료tab:"001", 평가자료tab:"002", 멀티미디어자료tab:"003", 특화자료tab:"004"
            filterList: (selectedCategory) => {
                $.ajax({
                    type: "GET",
                    url: tbReferenceTab.v.refUrl + `/referenceCategoryList.ax?classGubun=${selectedCategory}&masterSeq=${tbReferenceTab.v.masterSeq}&unitSeq=${tbReferenceTab.v.currentUnit}`,
                    success: function (res) {
                        // 수업자료 요청 param
                        let refDivCd4sList = [];
                        //let pageType = selectedCategory === '003' ? 'PAGE' : 'LIST'; // 멀티미디어 자료만 페이징
                        let pageType = 'LIST'; // 멀티미디어 자료만 페이징 - 모방일 x
                        let parentContent = $(`.categoryCheckbox[data-category-contain=${selectedCategory}] .ox-group-mobile`);
                        let categoryRows = [...res.rows];

                        if (categoryRows.length !== 0) {
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div.filters`).css({"display": "block"});
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div.filters .ox-group-mobile`).removeAttr('style');

                            // 체크박스 영역
                            let checkboxContent = ``;

                            let popupDisplayList = ``;

                            // 데이터 패치 후 append
                            $.each(categoryRows, async function (index, item) {
                                // 가져온 카테고리seq 모두 담기
                                refDivCd4sList.push(item.seq1);
                                refDivCd4sList.push(item.seq2);

                                // 화면단 렌더
                                checkboxContent += `<span class="ox-mobile">
                                <input
                                class="filter-list-checkbox"
                                id="ox-filter1-${index + 1}"
                                name="oxName${index}"
                                data-name="oxFilter${index}"
                                type="checkbox" checked
                                data-seq1="${item.seq1}"
                                data-seq2="${item.seq2}"/>
                                <label for="ox-filter1-${index + 1}">${item.name}</label>
                                </span>`

                                popupDisplayList += `<span class="ox-mobile">
                                <input
                                class="filter-list-checkbox"
                                id="ox-popup-filter1-${index + 1}"
                                name="oxFilter${index}"
                                data-name="oxName${index}"
                                type="checkbox" checked
                                data-seq1="${item.seq1}"
                                data-seq2="${item.seq2}"/>
                                <label for="ox-popup-filter1-${index + 1}">${item.name}</label>
                                </span>`
                            });

                            // 데이터 append
                            parentContent.append(checkboxContent);

                            // 모바일 필터 팝업에 추가
                            $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').append(popupDisplayList);

                            let checkedItems = [...refDivCd4sList];

                            // 체크박스 클릭 핸들링 - 모바일 상단 필터 핸들링
                            parentContent.find('span.ox-mobile input').off('click').on('click', async function () {
                            //$('span.ox-mobile input').on('click', function() {

                                const isChecked = $(this).prop('checked');
                                const isCategoryAll = $(this).hasClass('all');
                                const seq1 = $(this).data('seq1');
                                const seq2 = $(this).data('seq2');

                                if (isCategoryAll) {
                                    checkedItems = isChecked ? [...refDivCd4sList] : [];
                                } else if (!isCategoryAll && isChecked) {
                                    checkedItems.push(seq1);
                                    checkedItems.push(seq2);
                                } else {
                                    checkedItems = checkedItems.filter(v => v !== seq1);
                                    checkedItems = checkedItems.filter(v => v !== seq2);
                                }

                                // 초기화 - 카테고리 탭 자료 영역
                                $(".classRefList").empty();
                                $(".classRefList").find('tr.item-mobile').remove();

                                // 자료 요청
                                tbReferenceTab.c.classList(selectedCategory, checkedItems.toString(), pageType);
                            });

                            //handleCheckbox('#ox-filter1-0', '.filter-list-checkbox');

                            // 모바일 - 상단 필터 클릭시 active 상태 팝업 필터에 바인딩
                            $('input[name^=oxName]').on('click', function(e) {
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
                                console.log("oxFilter");
                                let name = $(e.currentTarget).data('name');

                                $('input[name=' + name + ']').trigger('click');
                            });


                            // // 모바일 - 초기화 버튼 클릭 이벤트 - 초기상태(카테고리 전체 선택)
                            // $('button.reset-btn-mobile1').on('click', function() {
                            //
                            //     console.log('초기화버튼')
                            //     $('.ox-group-mobile span.ox-mobile input').prop('checked', true); // 상단 필터 checked
                            //     $('.ox-group-popup-mobile span.ox-mobile input').prop('checked', true); // 팝업 필터 checked
                            //     //$('button.apply-btn-mobile').trigger('click');
                            // });
                            //
                            // // 모바일 - 선택적용 버튼 클릭 이벤트
                            // $('button.apply-btn-mobile1').off('click').on('click', function() {
                            //     console.log("선택적용버튼")
                            //     // const checkedInputs = $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').find('span.ox-mobile input:checked');
                            //     //
                            //     // let selectedCategory = tbReferenceTab.v.lastClickedRefTab;
                            //     // let pageType = 'LIST';
                            //     // let checkedItems = [];
                            //     //
                            //     // for (let i=0; i<checkedInputs.length; i++){
                            //     //     checkedItems.push(`${checkedInputs.eq(i).data('seq1')}`);
                            //     //     checkedItems.push(`${checkedInputs.eq(i).data('seq2')}`);
                            //     // }
                            //     //
                            //     // // 초기화 - 카테고리 탭 자료 영역
                            //     // $(".classRefList").empty();
                            //     // $(".classRefList").find('tr.item-mobile').remove();
                            //     //
                            //     // // 자료 요청
                            //     // tbReferenceTab.c.classList(selectedCategory, checkedItems.toString(), pageType);
                            // });
                        } else {
                            // 표시될 체크박스가 없는 경우
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div.filters`).css({"display": "flex"});
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div div.ox-group-mobile`).css({"margin": "0 auto"});
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div div.ox-group-mobile`).empty();
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div button.filter-button`).addClass('display-hide');

                        }

                        // 자료 목록
                        tbReferenceTab.c.classList(selectedCategory, refDivCd4sList.toString(), pageType);
                    },

                    error: function (err) {
                        console.log(err);
                        alert("오류발생")
                    }
                })
            },

            // 자료 가져옴
            classList: (selectedCategory, refDivCd4s, pageType) => {
                let multiMediaRefCurrentPage = 1;
                $.ajax({
                    type: "GET",
                    url: tbReferenceTab.v.refUrl +`/referenceDataListByCategory.ax?`
                        +`masterSeq=${tbReferenceTab.v.masterSeq}`
                        +`&unitSeq=${tbReferenceTab.v.currentUnit}`
                        +`&classGubun=${selectedCategory}`
                        +`&categorySeq=${refDivCd4s.length > 0 ? refDivCd4s : null}`
                        +`&pageType=${pageType}`
                        +`&pageNo=${multiMediaRefCurrentPage}`
                        +`&pageCount=${tbReferenceTab.v.pageLength}`,
                    success: function (res) {
                        console.log(`${selectedCategory} 자료 가져옴 : `, res);

                        let itemLength = res.rows.length;
                        let refListData = res.rows;
                        const totalPage = res.pagingSize;
                        //const appendParent = $(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.chapter-items li`);
                        const appendParent = $(`.categoryDataList[data-category-contain="${selectedCategory}"] div.table-items`);

                        //if (selectedCategory === "003") {
                        if (false) {
                            // tbReferenceTab.resetMoreBtnOption();
                            //
                            // $.each(refListData, function (index, item) {
                            //     let accordionContent = $(`
                            //         <div class="item ${$extension.extensionToNoData(item.fileExtension)}">
                            //             <div class="image-wrap">
                            //                 <span class="ox">
                            //                     <input
                            //                     class="${selectedCategory}-checkbox"
                            //                     checked=""
                            //                     id="board1-${index}"
                            //                     name="${item.referenceSeq}"
                            //                     data-origin-file-name="${item.originFileName}"
                            //                     data-params="${item.params}"
                            //                     type="checkbox"
                            //                     />
                            //                     <label for="board1-${index}"></label>
                            //                 </span>
                            //                 <img src="${item.thumbnailPath}" style="display: ${item.thumbnailPath === '' ? "none" : ""}" alt=""/>
                            //                 <div class="info-media">
                            //                     <img alt="" src="/assets/images/common/${$extension.extensionToIcon(item.fileExtension)}"/>
                            //                     <span class="time">${timeChanger(item.duration)}</span>
                            //                 </div>
                            //             </div>
                            //             <div class="inner-wrap">
                            //                 <div class="text-wrap">
                            //                     <a class="title"
                            //                     data-seq="${item.referenceSeq}"
                            //                     data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                            //                     data-file-id ="${item.fileFileId}"
                            //                     data-source="${item.fileUploadMethod === 'CMS' ? 'CMS' : 'LINK'}"
                            //                     >${item.referenceName}</a>
                            //                 </div>
                            //                 <div class="board-buttons">
                            //                     <div class="buttons">
                            //                         <button class="button type-icon size-sm preview-btn"
                            //                         data-file-id="${item.fileFileId}"
                            //                         data-source="${item.fileUploadMethod}"
                            //                         data-url="${item.filePath}"
                            //                         data-seq="${item.referenceSeq}"
                            //                         ${ynToBoolean(item.referencePreviewUseYn) ? "" : "disabled"}
                            //                         type="button">
                            //                             <svg>
                            //                                 <title>아이콘 돋보기</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                            //                             </svg>
                            //                         </button>
                            //                         <button
                            //                             class="button type-icon size-sm down-btn"
                            //                             type="button"
                            //                             ${ynToBoolean(item.referenceDownloadUseYn) ? "" : "disabled"}
                            //                             name="${item.referenceSeq}"
                            //                             data-parameter="${item.filePath}"
                            //                             data-origin-name="${item.referenceName}"
                            //                             data-upload-method="${item.fileUploadMethod}"
                            //                             onclick="downloadFile(event)">
                            //                             <svg>
                            //                                 <title>아이콘 다운로드</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                            //                             </svg>
                            //                         </button>
                            //                         <!-- !NOTE : 스크랩버튼은 toggle-this 에 active 클래스가 on/off 됩니다.  -->
                            //                         <button class="button type-icon size-sm toggle-this scrap ${item.myScrapYn === 'Y' ? 'active' : ''}"
                            //                                 type="button"
                            //                                 ${ynToBoolean(item.referenceScrapUseYn) ? "" : "disabled"}
                            //                                 name="${item.referenceSeq}"
                            //                                 data-toast="toast-scrap-m-${item.referenceSeq}"
                            //                                 >
                            //                             <svg>
                            //                                 <title>아이콘 핀</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                            //                             </svg>
                            //                         </button>
                            //                         <button class="button type-icon size-sm ai-share" type="button" ${ynToBoolean(item.referenceShareUseYn) ? "" : "disabled"}>
                            //                             <svg>
                            //                                 <title>아이콘 공유</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                            //                             </svg>
                            //                         </button>
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     `);
                            //
                            //     // // 개별 스크랩
                            //     accordionContent.off('click').on('click','button.scrap', async function () {
                            //         const teacher = checkTeacher('scrap');
                            //         const refSeq = $(this).prop('name');
                            //         const isAdd = $(this).hasClass('active') ? false : true;
                            //
                            //         teacher ? await tbReferenceTab.c.scrapCommonRef([refSeq],isAdd) : "";
                            //         teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') :"";
                            //
                            //     })
                            //
                            //     // 미리보기
                            //     accordionContent.find('div.buttons button.preview-btn').on('click',function (){
                            //         const teacher = checkTeacher('');
                            //         const source = $(this).data('source');
                            //         const fileId = $(this).data('fileId');
                            //         const seq = $(this).data('seq');
                            //
                            //         teacher ? previewFile(fileId,source,seq) : "";
                            //     })
                            //
                            //     // gallery / list 보기형식 바꿈
                            //     appendParent.find('div.toggle-group button').on('click', function () {
                            //         let multiRefDisplayType = $(this).data("displayType");
                            //         multiRefDisplayType === "list" ? appendParent.find('div#accordionContainMulti').addClass('type-vertical') : appendParent.find('div#accordionContainMulti').removeClass('type-vertical')
                            //     })
                            //
                            //     $('button.moreBtn').text(`더보기 ${multiMediaRefCurrentPage} / ${totalPage}`);
                            //     totalPage === 1 ? $('button.moreBtn').prop('disabled', true) : $('button.moreBtn').prop('disabled', false);
                            //
                            //
                            //     // 선택한 카테고리탭별 html 렌더
                            //     appendParent.find('div.classRefList').append(accordionContent);
                            //
                            //
                            //     // duration 없는 경우
                            //     item.duration > 0 ? "" : accordionContent.find('div.image-wrap div.info-media span.time').css({"display": "none"});
                            //
                            //     // 체크박스 컨트롤
                            //     handleCheckbox(`#ox-${selectedCategory}`, `.${selectedCategory}-checkbox`, `.scrapCnt-${selectedCategory}`, `.totalCnt-003`);
                            // })
                            //
                            // // 더보기 버튼
                            // appendParent.find('button.moreBtn').off('click').on('click', async function () {
                            //     if (tbReferenceTab.v.moreBtn){
                            //         // 현재 페이지
                            //         multiMediaRefCurrentPage = tbReferenceTab.v.multiMediaRefLastPage + 1;
                            //
                            //         // 데이터 패치
                            //         const data = await tbReferenceTab.c.multimediaListMore(selectedCategory, refDivCd4s, pageType, multiMediaRefCurrentPage);
                            //
                            //         // 데이터 append
                            //         $.each(data.rows, function (index, item) {
                            //             let accordionChild = $(`<div class="item ${$extension.extensionToNoData(item.fileExtension)}">
                            //             <div class="image-wrap">
                            //                 <span class="ox">
                            //                   <input
                            //                   class="${selectedCategory}-checkbox"
                            //                   checked=""
                            //                   id="board1-${itemLength + index}"
                            //                   name="${item.referenceSeq}"
                            //                   type="checkbox"
                            //                   data-origin-file-name="${item.originFileName}"
                            //                   data-params="${item.params}"
                            //                   />
                            //                   <label for="board1-${ itemLength + index}"></label>
                            //                 </span>
                            //                 <img src="${item.thumbnailPath}" style=" display: ${item.thumbnailPath === '' ? "none" : ""}" alt=""/>
                            //                 <div class="info-media">
                            //                     <img alt=""
                            //                          src="/assets/images/common/${$extension.extensionToIcon(item.fileExtension)}"/>
                            //                     <span class="time">${timeChanger(item.duration)}</span>
                            //                 </div>
                            //             </div>
                            //             <div class="inner-wrap">
                            //                 <div class="text-wrap">
                            //                     <a class="title"
                            //                     data-seq="${item.referenceSeq}"
                            //                     data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                            //                     data-file-id ="${item.fileFileId}"
                            //                     data-source="${item.fileUploadMethod === 'CMS' ? 'CMS' : 'LINK'}"
                            //                     >${item.referenceName}</a>
                            //                 </div>
                            //                 <div class="board-buttons">
                            //                     <div class="buttons">
                            //                         <button class="button type-icon size-sm preview-btn" data-file-id="${item.fileFileId}"
                            //                         data-source="${item.fileUploadMethod}"
                            //                         data-url="${item.filePath}"
                            //                         data-seq="${item.referenceSeq}"
                            //                         ${ynToBoolean(item.referencePreviewUseYn) ? "" : "disabled"}
                            //                         type="button">
                            //                             <svg>
                            //                                 <title>아이콘 돋보기</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                            //                             </svg>
                            //                         </button>
                            //                         <button
                            //                             class="button type-icon size-sm down-btn"
                            //                             type="button"
                            //                             ${ynToBoolean(item.referenceDownloadUseYn) ? "" : "disabled"}
                            //                             name="${item.referenceSeq}"
                            //                             data-parameter="${item.filePath}"
                            //                             data-origin-name="${item.referenceName}"
                            //                             data-upload-method="${item.fileUploadMethod}"
                            //                             onclick="downloadFile(event)">
                            //                             <svg>
                            //                                 <title>아이콘 다운로드</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                            //                             </svg>
                            //                         </button>
                            //                         <!-- !NOTE : 스크랩버튼은 toggle-this 에 active 클래스가 on/off 됩니다.  -->
                            //                         <button class="button type-icon size-sm toggle-this scrap ${item.myScrapYn === 'Y' ? 'active' : ''}"
                            //                                 type="button"
                            //                                 ${ynToBoolean(item.referenceScrapUseYn) ? "" : "disabled"}
                            //                                 name="${item.referenceSeq}"
                            //                                 data-toast="toast-scrap-m-${item.referenceSeq}"
                            //                                 >
                            //                             <svg>
                            //                                 <title>아이콘 핀</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                            //                             </svg>
                            //                         </button>
                            //                         <button class="button type-icon size-sm ai-share" type="button" ${ynToBoolean(item.referenceShareUseYn) ? "" : "disabled"}>
                            //                             <svg>
                            //                                 <title>아이콘 공유</title>
                            //                                 <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                            //                             </svg>
                            //                         </button>
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //         </div>`);
                            //
                            //             // 더보기 데이터 append
                            //             appendParent.find('div.classRefList').append(accordionChild);
                            //
                            //             // duration 없을 시 시간 표시 없음
                            //             item.duration > 0 ? "" : accordionChild.find('div.image-wrap div.info-media span.time').css({"display": "none"});
                            //
                            //             // 체크박스 컨트롤
                            //             handleCheckbox(`#ox-${selectedCategory}`, `.${selectedCategory}-checkbox`, `.scrapCnt-${selectedCategory}`,`.totalCnt-003`);
                            //
                            //             // 개별 스크랩
                            //             accordionChild.off('click').on('click', 'button.scrap',async function () {
                            //                 const teacher = checkTeacher('scrap');
                            //                 const refSeq = $(this).prop('name');
                            //                 const isAdd = $(this).hasClass('active') ? false : true;
                            //
                            //                 teacher ? await tbReferenceTab.c.scrapCommonRef([refSeq],isAdd) : "";
                            //                 teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') :"";
                            //
                            //             })
                            //
                            //             // 미리보기
                            //             accordionChild.find('div.buttons button.preview-btn').on('click',function (){
                            //                 const teacher = checkTeacher('');
                            //                 const source = $(this).data('source');
                            //                 const fileId = $(this).data('fileId');
                            //                 const seq = $(this).data('seq');
                            //
                            //                 teacher ? previewFile(fileId,source,seq) : "";
                            //             })
                            //         });
                            //
                            //         // 화면단
                            //         tbReferenceTab.v.moreBtn = (multiMediaRefCurrentPage!==totalPage); // 버튼 flag값
                            //
                            //         $('button.moreBtn').prop('disabled', !tbReferenceTab.v.moreBtn);
                            //         $('button.moreBtn').text(`더보기 ${multiMediaRefCurrentPage} / ${totalPage}`);
                            //
                            //         // 선택된 체크박스 갯수 default
                            //         itemLength += data.rows.length; // 총 아이템 갯수
                            //         appendParent.find(`strong.totalCnt-${selectedCategory}`).text(itemLength);
                            //         appendParent.find(`strong.downloadCnt-${selectedCategory}`).text(itemLength);
                            //         appendParent.find(`strong.scrapCnt-${selectedCategory}`).text(itemLength);
                            //
                            //         // 다음 페이지
                            //         tbReferenceTab.v.multiMediaRefLastPage += 1;
                            //     }
                            // });
                        } else {
                            $.each(refListData, function (index, item) {
                                let itemContent = $(`
                                    <tr class="item-mobile">
                                        <td class="flex-align-start">
                                            <i class="icon size-md type-round-box">
                                                <img alt="pdf 아이콘" src="/assets/images/common/${$extension.extensionToIcon(item.fileExtension)}"/>
                                            </i>
                                            <span class="text-left"
                                            data-seq="${item.referenceSeq}"
                                            data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                                            data-file-id ="${item.fileFileId}"
                                            data-source="${item.fileUploadMethod === 'CMS' ? 'CMS' : 'LINK'}"
                                            >${item.referenceName}</span>
                                        </td>
                                        <td>
                                            <button class="button type-icon size-sm preview-btn" type="button"
                                            data-seq="${item.referenceSeq}"
                                            data-file-id="${item.fileFileId}"
                                            data-source="${item.fileUploadMethod}"
                                            data-url="${item.path}">
                                                <svg>
                                                    <title>아이콘 돋보기</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                                </svg>
                                            </button>
                                        </td>
                                       <!-- <td>
                                            <button class="button type-icon size-sm ai-share aiShare" type="button" ${ynToBoolean(item.referenceShareUseYn) ? '' : 'disabled'}>
                                                <svg>
                                                    <title>아이콘 공유</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                </svg>
                                            </button>
                                        </td> -->
                                    </tr>
                                    `);

                                // 개별 스크랩 - 모바일 x
                                // itemContent.off('click').on('click','button.scrap', function () {
                                //     const teacher = checkTeacher('scrap');
                                //     const refSeq = $(this).prop('name');
                                //     const isAdd = $(this).hasClass('active') ? false : true;
                                //
                                //     teacher ? tbReferenceTab.c.scrapCommonRef([refSeq],isAdd) : "";
                                //     teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";
                                // })

                                // 미리보기
                                itemContent.find('td button.preview-btn').on('click',function (){
                                    const teacher = checkTeacher('');
                                    const source = $(this).data('source');
                                    const fileId = $(this).data('fileId');
                                    const seq = $(this).data('seq');

                                    teacher ? previewFile(fileId,source,seq) : "";
                                })

                                // 선택한 카테고리탭별 html 렌더
                                appendParent.find('tbody.classRefList').append(itemContent);

                                // 체크박스 컨트롤
                                //handleCheckbox(`#ox1-${selectedCategory}`, `.${selectedCategory}-checkbox`, `.downloadCnt-${selectedCategory}`, `.scrapCnt-${selectedCategory}`, `strong.totalCnt-${selectedCategory}`)
                            })
                        }

                        // 전체 스크랩 - 모바일 x
                        // appendParent.off('click').on('click','button.total-scrap', async function (e) {
                        //     const teacher = checkTeacher('scrap');
                        //     const checkedObj = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.chapter-items li`,'refSeq');
                        //
                        //     let checkedList =checkedObj.checkedInputs;
                        //     const isAddList = checkedObj.isAddList;
                        //
                        //     checkedList = checkedList.filter((v, k) => {
                        //         return isAddList[k]
                        //     });
                        //
                        //     checkedList.length > 0 ? $(this).attr('hasInputs',true) : $(this).attr('hasInputs',false);
                        //
                        //     let result = teacher ? checkedList.length > 0 ? await tbReferenceTab.c.scrapCommonRef(checkedList, true, 'totalScrap') : checkFirst() : "";
                        //
                        //     !_.isNil(result) && result.length > 0 ? toastScreen.f.scrapTextbook(e) : "";
                        //
                        // })


                        // 멀티 다운로드 - 모바일 x
                        // appendParent.find("button.multi-down-btn").on('click', function () {
                        //     if(multi_use_yn){
                        //         const checkedList = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.chapter-items .classRefList`,'multiDownload');
                        //
                        //         // dialog - 로그인 & 정교사 여부 확인
                        //         const check = checkTeacher('multiDownload');
                        //
                        //         // dialog - 선택한 자료 없음
                        //         if(checkedList.length === 0){
                        //             check ? checkFirst() : "";
                        //
                        //         }else {
                        //             check ? copyrightAlert(checkedList) : "";
                        //         }
                        //     }else{
                        //         $alert.open('MG00060');
                        //     }
                        // })

                        // 화면단
                        // refListData.length > 0 ? appendParent.find('tbody.classRefList').removeAttr('style') : appendParent.find('tbody.classRefList').css({
                        //     "margin": "0 auto",
                        //     "display": "block"
                        // })
                        // 아래 2줄은 멀티미디어 갤러리/리스트 - 모바일 x
                        //refListData.length > 0 ? appendParent.find('div.page-buttons').removeAttr('style') : appendParent.find('div.page-buttons').css({"display": "none"});
                        //refListData.length > 0 ? appendParent.find('div.toggle-group button').removeAttr('style') : appendParent.find('div.toggle-group button').css({"display": "none"});
                        refListData.length === 0 ? appendParent.find('tbody.classRefList').empty() : '';
                        //refListData.length === 0 ? appendParent.find('tbody.classRefList').append(tbReferenceTab.v.displayNoData) : '';
                        refListData.length === 0 ? appendParent.find('tbody.classRefList').append(`<tr><td colspan="2" class="box-no-data" style="border: none">등록된 자료가 없습니다.</td></tr>`) : '';

                        // 선택된 체크박스 갯수 default - 모바일 x
                        // appendParent.find(`strong.totalCnt-${selectedCategory}`).text(itemLength);
                        // appendParent.find(`strong.downloadCnt-${selectedCategory}`).text(itemLength);
                        // appendParent.find(`strong.scrapCnt-${selectedCategory}`).text(itemLength);

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
                    url: `/pages/api/textbook/teacherShareList.ax?masterSeq=${tbReferenceTab.v.masterSeq}`,

                    /* 전송 후 세팅 */
                    success: function (res) {
                        res = res.rows;
                        console.log("teacher 자료 가져옴", res);
                        // 표시될 데이터가 없는 경우
                        if (res.length > 0) {
                            // 선생님 공유 자료 데이터 렌더 영역
                            $.each(res, function (index, item) {
                                const upper = $(`.categoryDataList[data-category-contain="005"] div.table-items`);
                                let accordionContent = $(`<tr class="item-mobile">
                                <td class="flex-align-start">
                                    <i class="icon size-md type-round-box">
                                        <img alt="${item.fileType} 아이콘" src="/assets/images/common/${$extension.extensionToIcon(item.fileType)}"/>
                                    </i>
                                    <span class="text-left"
                                    data-seq="${item.referenceSeq}"
                                    data-is-disabled="${ynToBoolean(item.referencePreviewUseYn)}"
                                    data-file-id ="${item.fileFileId}"
                                    data-source="${item.fileUploadMethod === 'CMS' ? 'CMS' : 'LINK'}"
                                    >${item.referenceName}</span>
                                </td>
                                <td>
                                     <button class="button type-icon size-sm" onclick="" type="button" ${!ynToBoolean(item.referencePreviewUseYn) ? "disabled" : ""}>
                                        <svg>
                                            <title>아이콘 돋보기</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                        </svg>
                                    </button>
                                </td>
                                <!-- <td>
                                    <button class="button type-icon size-sm ai-share" type="button" ${!ynToBoolean(item.referenceShareUseYn) ? "disabled" : ""}>
                                        <svg>
                                            <title>아이콘 공유</title>
                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                        </svg>
                                    </button>
                                </td> -->
                            </tr>`);
                                upper.find('tbody.classRefList').append(accordionContent);
                            })
                        } else {
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] tbody.classRefList`).empty();
                            $(`.categoryCheckbox[data-category-contain=${selectedCategory}] tbody.classRefList`).append(`<tr><td colspan="2" class="box-no-data" style="border: none">등록된 자료가 없습니다.</td></tr>`);
                        }
                    },
                    error: function () { //시스템에러
                        alert("오류발생");
                    }
                });
            },

            // 더보기 - 모바일 x
            // multimediaListMore: (selectedCategory, refDivCd4s, pageType,pageNo) => {
            //     return $.ajax({
            //         type: "GET",
            //         url: tbReferenceTab.v.refUrl + `/referenceDataListByCategory.ax?masterSeq=${tbReferenceTab.v.masterSeq}&unitSeq=${tbReferenceTab.v.currentUnit}&classGubun=${selectedCategory}&categorySeq=${refDivCd4s.length > 0 ? refDivCd4s : null}&pageType=${pageType}&pageNo=${pageNo}&pageCount=12`,
            //         success: function (res) {
            //             console.log(`${selectedCategory} 더보기 자료 가져옴 : `, res);
            //         },
            //         error: function () {
            //             alert("오류발생");
            //         }
            //     })
            // },

            //스크랩 - 모바일 x
            // scrapCommonRef: (scrapList,isAdd,btnType) => {
            //     console.log('scrap refId list : ', scrapList, isAdd);
            //
            //     const scrapUrl = isAdd ? '/pages/api/mypage/addScrap.ax' : '/pages/api/mypage/updateScrap.ax'
            //
            //     return scrapList.map((refId)=>{
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
            //                 if(res.resultCode === '0000' && isAdd && btnType === "totalScrap"){
            //                     scrapList.map((v)=>{
            //                         return $(`button.scrap[name=${v}]`).addClass('active');
            //                     })
            //                 }
            //             },
            //             error: function (){
            //                 alert('스크랩 실패하였습니다');
            //             }
            //         })
            //     });
            // }
        },

        reset : function (){

            let keys = Object.keys(tbReferenceTab.v);
            keys.forEach(v=>{
                tbReferenceTab.v[v] = resetV[v];
            });

            $('#commonItemList').empty();
        },

        // resetMoreBtnOption : ()=>{
        //     $('button.moreBtn').removeAttr("disabled");
        //     tbReferenceTab.v.moreBtn = true;
        //     tbReferenceTab.v.multiMediaRefLastPage = 1;
        // },


        event: async function() {
            // 교과서 명 호버시 cursor - 모바일 x
            // $('#commonItemList, .classRefList').on('mouseover','a.title',function (){
            //     $(this).data('isDisabled') ? $(this).css({cursor:"pointer"}) : "";
            // })
            // 교과서 명 클릭시 미리보기 뷰어 오픈
            $('#commonItemList, .classRefList').on('click','a',function (){
                const check = checkTeacher();
                const isDisabled = $(this).data('isDisabled');
                const fileId = $(this).data('fileId');
                const source = $(this).data('source');
                const seq = $(this).data('seq');
                check && isDisabled ? previewFile(fileId,source,seq) : "";
            })
            $('#commonItemList, .classRefList').on('click','span',function (){
                const check = checkTeacher();
                const isDisabled = $(this).data('isDisabled');
                const fileId = $(this).data('fileId');
                const source = $(this).data('source');
                const seq = $(this).data('seq');
                check && isDisabled ? previewFile(fileId,source,seq) : "";
            })

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

            // 카테고리 탭 클릭시 - 카테고리 리스트 체크박스 영역
            $('#categoryTabMid ul').on('click','li', async function () {
                //클릭한 카테고리
                let selectedCategory = $(this).data('categoryTabIndex');

                // 자료 탭 변경시에만 데이터 패치
                if (tbReferenceTab.v.lastClickedRefTab !== selectedCategory) {
                    // 초기화 - 카테고리 탭 체크박스 영역
                    $(`.categoryCheckbox[data-category-contain=${selectedCategory}] div div.ox-group-mobile`).empty();
                    $(".categoryCheckbox .ox-group-mobile").find('span').remove();
                    $(".categoryCheckbox .ox-group-mobile").empty();
                    // 모바일 팝업필터 초기화
                    $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').find('span').remove();
                    $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').empty();
                    if (selectedCategory === "005") {
                        // 초기화 - 선생님 공유자료
                        $(".classRefList").find('tr.item-mobile').remove();
                        // 선생님 공유자료 호출
                        tbReferenceTab.c.teacherShareList(selectedCategory);
                    } else {
                        console.log("call filterList")
                        // 초기화 - 카테고리 탭 자료 영역
                        $(".classRefList").find('tr.item-mobile').remove();
                        //$(".classRefList").find('div.pane').remove();
                        // 카테고리 목록 호출
                        tbReferenceTab.c.filterList(selectedCategory);
                    }
                }
                // 탭을 변경했는지 확인하기 위한 플래그값
                tbReferenceTab.v.lastClickedRefTab = selectedCategory;
                closePopup({id: 'popup-textbook'});
            })

            // 교과서 공통자료 ajax 호출
            tbReferenceTab.c.commonItemList();

            // 선생님 공유자료탭 - 2월 오픈에서 미반영
            $('#categoryTabMid').find('ul li[data-category-tab-index="005"]').css({"display": "none"});

            // 단원 선택시 데이터 변경
            if($('#snbUnitList') !== null || $('#snbUnitList') !== undefined){
                $('#snbUnitList a').off().on('click', async function (e) {
                    e.preventDefault();
                    console.log("교과서필터 클릭")
                    tbReferenceTab.v.currentUnit = $(this).data('unitseq');
                    tbReferenceTab.v.lastClickedRefTab = "";
                    const textbookPopupTitle = $(this).text();

                    $('.type-thick .type-textbook').empty();

                    $('.type-thick .type-textbook').html(
                        `<strong>${textbookPopupTitle}</strong>
                        <svg>
                            <title> 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                        </svg>`
                    );

                    $('#categoryTabMid ul li a').first().trigger('click');
                });
            }

            // 최최 init시 최상단 단원 선택
            $('#snbUnitList a').first().trigger('click');

            // 모바일 - 초기화 버튼 클릭 이벤트 - 초기상태(카테고리 전체 선택)
            $('button.reset-btn-mobile').on('click', function() {
                console.log('초기화버튼')
                $('.ox-group-mobile span.ox-mobile input').prop('checked', true); // 상단 필터 checked
                $('.ox-group-popup-mobile span.ox-mobile input').prop('checked', true); // 팝업 필터 checked
                $('button.apply-btn-mobile').trigger('click');
                closePopup({id: 'popup-sheet'});
            });

            // 모바일 - 선택적용 버튼 클릭 이벤트
            $('button.apply-btn-mobile').off('click').on('click', function() {
                console.log("선택적용버튼")
                const checkedInputs = $('#popup-sheet .popup-container  div.body .ox-group-popup-mobile').find('span.ox-mobile input:checked');

                let selectedCategory = tbReferenceTab.v.lastClickedRefTab;
                let pageType = 'LIST';
                let checkedItems = [];

                for (let i=0; i<checkedInputs.length; i++){
                    checkedItems.push(`${checkedInputs.eq(i).data('seq1')}`);
                    checkedItems.push(`${checkedInputs.eq(i).data('seq2')}`);
                }

                // 초기화 - 카테고리 탭 자료 영역
                $(".classRefList").empty();
                $(".classRefList").find('tr.item-mobile').remove();

                // 자료 요청
                tbReferenceTab.c.classList(selectedCategory, checkedItems.toString(), pageType);

                closePopup({id: 'popup-sheet'});
            });
        },

        init: async function() {

            tbReferenceTab.v.currentUnit = textbookDetailScreen.v.currentDepth2UnitSeq ? textbookDetailScreen.v.currentDepth2UnitSeq : textbookDetailScreen.v.currentDepth1UnitSeq;

            await tbReferenceTab.reset();

            await tbReferenceTab.event();
        },
    };
})


// 체크박스 컨트롤
/*
* checkAll: 전체 체크/해제 하는 input 구분자
* checkedItem: 체크박스 개별 input
* downloadCnt: 선택된 체크박스 갯수
* */
function handleCheckbox(checkAll, checkedItem, downloadCnt, scrapCnt, totalCnt) {
    // 부모 인풋 클릭시
    $(checkAll).on('click', (e) => {
        const {checked} = e.currentTarget;
        const checkedYn = [];

        // 부모 인풋 체크/해제시 하위인풋 모두 체크/해제
        $(checkedItem).prop('checked', checked);

        $(checkedItem).each(function () {
            // checked true인 경우 리스트에 fileId push
            if ($(this).prop('checked')) checkedYn.push($(this).data('fileId'));
        });

        // 총건수 화면 렌더
        checked ? $(downloadCnt).text($(checkedItem).length) : $(downloadCnt).text(0);
        checked ? $(scrapCnt).text($(checkedItem).length) : $(scrapCnt).text(0);
        checked ? $(totalCnt).text($(checkedItem).length) : $(totalCnt).text(0);
    });


    // 하위 인풋 클릭시
    $(checkedItem).on('click', function (e) {
        const {checked} = e.currentTarget;
        const checkedYn = [];

        // 하위 인풋 체크 해제한 경우 부모 인풋도 체크 해제
        if (!checked) $(checkAll).prop('checked', false);

        // 하위 인풋 모두 체크상태이면 부모 인풋도 체크
        $(checkedItem).each(function () {
            // checked true인 경우 리스트에 fileId push
            if ($(this).prop('checked')) checkedYn.push($(this).data('fileId'));
        });
        if ($(checkedItem).length === checkedYn.length) $(checkAll).prop('checked', true);

        // 총건수 화면 렌더
        $(downloadCnt).text(checkedYn.length);
        $(scrapCnt).text(checkedYn.length);
        $(totalCnt).text(checkedYn.length);
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
        result = $text.lpad(minutes.toString(), 2, "0") + ":" + $text.lpad(seconds.toString(), 2, "0");
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
            checkedInputs.push($(checkbox).attr('name'));
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

// 파일 미리보기
function previewFile(fileId,source,seq){
    const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${fileId}&referenceSeq=${seq}&type=TEXTBOOK`;
    screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview");
}

// 개별 다운로드
function downloadFile(e){
    const teacher = checkTeacher('');
    if(teacher){
        let parameter = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('parameter');
        let name = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('originName');
        let url;
        const uploadMethod = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('uploadMethod');

        if(parameter.includes('https')){
            url = parameter;
        }else{
            if(uploadMethod === 'CMS') url = `https://api-cms.mirae-n.com/down_content?service=mteacher&params=${parameter}`
        }

        console.log(url, name);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.target = '_blank'; // 다운로드를 새 창에서 열도록 설정
        downloadLink.download = name; // 다운로드되는 파일의 이름 설정

        // 가상의 링크 엘리먼트를 문서에 추가하고 클릭 이벤트 발생
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // 가상의 링크 엘리먼트를 제거
        document.body.removeChild(downloadLink);
    }
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