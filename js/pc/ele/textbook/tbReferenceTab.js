let tbReferenceTab;

$(function () {
    let commonUrl = "/pages/ele/textbook"; // ajax 요청시 공통 url
    let lastClickedTab = ""; // 탭 변경 확인하기 위한 플래그값
    let lastClickedRefTab = ""; // 탭 변경 확인하기 위한 플래그값
    let displayNoData = '<div class="box-no-data" style="border: none">등록된 자료가 없습니다.</div>';
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
                        $('#checkedRefCnt').text(res.totalCnt);

                        if(res.rows.length > 0) {
                            $('#commonRefContainer .pane').empty();
                            $('#commonRefContainer .pane').append('<div class="chapter-wrap"><div class="chapter-list" id="commonItemList"></div></div>');

                            // 교과서 공통자료 목록
                            $.each(res.rows, function (index, item) {
                                const scrapKey = 'scrap' + item.referenceSeq;
                                tbReferenceTab.v.scrapObj[scrapKey] = false;

                                let displayList = $(`
                                    <div  id="commonItems-${index}" class="item">
                                        <span class="ox">
                                          <input 
                                          class="common-ref-checkbox" 
                                          id="board10-${index}" name="${item.referenceSeq}" 
                                          type="checkbox" 
                                          data-ref-seq ="${item.referenceSeq}" 
                                          data-file-id="${item.referenceFileId}" 
                                          data-origin-file-name="${item.originFileName}"
                                          data-params="${item.params}"
                                          data-extension="${item.extension}"
                                          data-upload-method="${item.uploadMethod}"
                                          data-down-yn="${item.referenceDownloadUseYn}"
                                          checked
                                          />
                                          <label for="board10-${index}"></label>
                                        </span>
                                        <div class="inner-wrap">
                                            <div class="text-wrap">
                                                <div class="extra">
                                                    <img alt=""
                                                         src="/assets/images/common/${$extension.extensionToIcon(item.extension)}"/>
                                                </div>
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
                                                        ${ynToBoolean(item.referencePreviewUseYn) && item.extension !== "zip" ? '' : 'disabled'}>
                                                    <svg>
                                                        <title>아이콘 돋보기</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#${item.uploadMethod === "NEWWIN" ? 'icon-new-windows' : 'icon-search'}"></use>
                                                    </svg>
                                                </button>
                                                <button
                                                class="button type-icon size-sm ref-down-btn down-btn" 
                                                type="button" ${ynToBoolean(item.referenceDownloadUseYn) ? '' : 'disabled'}
                                                name="${item.referenceSeq}"
                                                data-url="${item.params}"
                                                data-file-id="${item.referenceFileId}" 
                                                data-origin-name="${item.originFileName}"
                                                data-upload-method="${item.uploadMethod}"
                                                onclick="clickDown(event)">
                                                    <svg>
                                                        <title>아이콘 다운로드</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                </button>
                                                <button 
                                                ${ynToBoolean(item.referenceScrapUseYn) ? '' : 'disabled'}
                                                class="button type-icon size-sm scrap toggle-this ${item.myScrapYn === 'Y' ? 'active' : ''}" 
                                                type="button"
                                                name="${item.referenceSeq}"
                                                data-toast="toast-scrap-m-${item.referenceSeq}-comm"
                                                data-seq="${item.referenceSeq}"
                                                data-Yua="scrap"
                                                >
                                                    <svg>
                                                        <title>아이콘 핀</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                                    </svg>
                                                </button>
                                                <!-- <button class="button type-icon size-sm ai-share" type="button" ${ynToBoolean(item.referenceShareUseYn) ? '' : 'disabled'}>
                                                    <svg>
                                                        <title>아이콘 공유</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                    </svg>
                                                </button> -->
                                            </div>
                                        </div>
                                    </div>
                                `);
                                $('#commonItemList').append(displayList);
                                $(`#commonItems-${index}`).find('a.title').text(item.referenceName);

                                // 개별 스크랩 & 미리보기
                                displayList.off('click').on('click', 'div.buttons button', function () {
                                    const seq = $(this).data('seq');
                                    let fileId = $(this).data('fileId');
                                    let source = $(this).data('source');
                                    let url = $(this).data('newWinUrl');
                                    let uploadMethod = $(this).data('uploadMethod');

                                    if ($(this).hasClass('scrap')) {
                                        // dialog - 로그인 & 정교사 여부 확인
                                        const teacher = checkTeacher('scrap');
                                        const isAdd = $(this).hasClass('active') ? false : true;

                                        teacher ? tbReferenceTab.c.scrapCommonRef([seq], isAdd) : "";
                                        teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";

                                    } else if ($(this).hasClass('preview-btn')) {
                                        // dialog - 로그인 & 정교사 여부 확인
                                        const options = {
                                            method: "GET",
                                            url: "/pages/api/preview/previewServiceYn.ax",
                                            data: { fileId: fileId },
                                            success: (res) => {
                                                console.log(res);
                                                if (res.row.service_yn === 'Y') {
                                                    const teacher = checkTeacher('');
                                                    if(teacher){
                                                        if(uploadMethod === 'NEWWIN'){
                                                            window.open(url, "_blank");
                                                        }else{
                                                            tbReferenceTab.c.previewFile(fileId,source,seq);
                                                        }
                                                    }
                                                } else {
                                                    $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요")
                                                }

                                            }
                                        };
                                        $cmm.ajax(options);
                                    }
                                })
                            });
                        } else {
                            // 자료 없음
                            $('#commonRefContainer .pane').empty();
                            $('#commonRefContainer .pane').append(displayNoData);

                        }
                        // 체크박스 핸들링
                        handleCheckbox('#ox1-common-1', '.common-ref-checkbox','#checkedRefCnt');

                        // 멀티 다운로드
                        $('#commonRefContainer').find("button[name='multi-down-btn']").on('click', async function () {
                            if(multi_use_yn){
                                const checkedList = checkedInputList("#commonItemList",'multiDownload');

                                // dialog - 로그인 & 정교사 여부 확인
                                const check = checkTeacher('multiDownload',checkedList.length);

                                // dialog - 선택한 자료 없음
                                if(check && checkedList.length === 0){
                                    checkFirst();

                                }else {
                                    check ? copyrightAlert(checkedList) : "";
                                }
                            }else{
                                $alert.open('MG00060');
                            }
                        })
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
                    success: async function (res) {
                        // 수업자료 요청 param
                        let refDivCd4s = "";
                        let parentContent = $(`.categoryCheckbox[data-category-contain=${selectedCategory}] .filters`);
                        const appendHead = `
                        <div class="ox-group"></div>
                        `
                        // 필터 영역 비우기
                        await parentContent.empty();

                        // 표시될 체크박스가 없는 경우
                        if(res.length === 0){
                            parentContent.append(displayNoData);
                            parentContent.css({"display": "block"});

                        }else {
                            // 체크박스 영역
                            // 전체 체크박스
                            let defaultCheckbox = `
                                <span class="ox all" id="all-category">
                                    <input id="check-all-${selectedCategory}" type="checkbox" checked class="all"/>
                                    <label for="check-all-${selectedCategory}">전체</label>
                                </span>
                            `;

                            parentContent.append(appendHead);
                            parentContent.find('.ox-group').append(defaultCheckbox);

                            // 데이터 패치 후 append
                            $.each(res, function (index, item) {
                                // 선택한 카테고리 목록 시퀀스 담기
                                refDivCd4s += `,${item.seq}`
                                if (refDivCd4s.startsWith(",")) refDivCd4s = refDivCd4s.slice(1);

                                // 화면단 렌더
                                let displayList = `
                                <span class="ox">
                                    <input class="filter-list-checkbox" id="ox-filter1-${index}-${selectedCategory}" type="checkbox" data-seq="${item.seq}" checked/>
                                    <label for="ox-filter1-${index}-${selectedCategory}">${item.name}</label>
                                </span>
                                `
                                $(`.categoryCheckbox[data-category-contain=${selectedCategory}]`).find('.ox-group').append(displayList);
                            });

                            // 체크박스 클릭 핸들링
                            handleCheckbox(`#check-all-${selectedCategory}`,'.filter-list-checkbox');

                            parentContent.find('span.ox input').on('click', async function () {
                                const checkedInputs = parentContent.find('span.ox input:checked').not('input.all');

                                let checkedListStr = '';

                                for (let i=0; i<checkedInputs.length; i++){
                                    checkedListStr += `,${checkedInputs.eq(i).data('seq')}`;
                                };

                                checkedListStr = checkedListStr.slice(1);

                                // 초기화 - 카테고리 탭 자료 영역
                                $(".classRefList").empty();
                                $(".classRefList").find('li').remove();
                                $(".classRefList").find('div.item').remove();

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

                        if (selectedCategory === "multimedia") {
                            $.each(res, function (index, item) {
                                let multiMediaRefCurrentPage = 'currentPage' + index;
                                let multiMediaRefLastPage = 'lastPage' + index;
                                let itemLength = 'itemLength' + index;
                                let moreBtn = 'moreBtn' + index;


                                moreBtnObj[multiMediaRefCurrentPage] = 1;
                                moreBtnObj[multiMediaRefLastPage] = 1;
                                moreBtnObj[itemLength] = _.isNil(item.refList) ? 0 : item.refList.length;
                                moreBtnObj[moreBtn] = false;


                                let refList = item.refList ? [...item.refList] : [];
                                let totalPage = Math.ceil(item.totalCount/pageLength);

                                const upper = `div.pane div.board-list div#accordionContainMulti${index}`;

                                let accordionContent = $(`<li class="active">
                                    <a class="chapter-depth action">
                                        <div class="header-wrap">
                                            <span class="ox">
                                              <input id="ox${index}" type="checkbox" checked class="all"/>
                                              <label for="ox${index}"></label>
                                            </span>
                                            <h3>${item.unitNumberName}. ${item.unitName}</h3>
                                        </div>
                                        <div class="buttons">
                                            <button class="button size-md total-scrap scrap" data-toast="toast-scrap-l-${selectedCategory}${index}" hasInputs="">
                                                스크랩
                                                <svg>
                                                    <title>아이콘 스크랩</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                                </svg>
                                            </button>
                                            <button class="button size-md" name="multi-down-btn">
                                            <span> 총 <strong class="text-primary" id="${selectedCategory}${index}-downloadCnt"></strong>건 다운로드 </span>
                                                <svg>
                                                    <title>아이콘 다운로드</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                </svg>
                                            </button>
                                        </div>
                                    </a>
                                    <div class="pane" style="display: block;">
                                        <div class="board-list">
                                            <div class="sort">
                                                <div class="sort-inner">
                                                </div>
                                                <div class="toggle-group displayTypeBtn">
                                                    <button class="button size-sm type-icon active"
                                                            title="갤러리 형식으로 보기" data-selected-btn="album">
                                                        <svg>
                                                            <title>아이콘 - icon-gallery</title>
                                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-gallery"></use>
                                                        </svg>
                                                    </button>
                                                    <!-- !NOTE : 선택된 항목에 active -->
                                                    <button class="button size-sm type-icon"
                                                            title="리스트 형식으로 보기" data-selected-btn="list">
                                                        <svg>
                                                            <title>아이콘 - icon-list</title>
                                                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-list"></use>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="board-items ${selectedCategory}${index}-ref-contain" id="accordionContainMulti${index}"></div>
                                        </div>
                                        ${moreBtnObj[multiMediaRefCurrentPage] !== totalPage ?
                                    `<div class="page-buttons">
                                                <button class="button size-xl moreBtn${index}" type="button">
                                                    <svg>
                                                        <title>아이콘 더보기</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                                                    </svg>
                                                    더보기 ( ${moreBtnObj[multiMediaRefCurrentPage]} / ${totalPage} )
                                                </button>
                                            </div>` : '' }
                                        </div>
                                    </li>
                                `);

                                if(refList.length > 0){
                                    $.each(refList, function (idx, itm) {
                                        let subject;

                                        if(_.isNil(itm.singleSubjectUseYn)){
                                            subject = "공통자료";
                                        }else{
                                            subject = itm.singleSubjectUseYn === 'Y' ? itm.startSubject + "차시" :  itm.startSubject + "~" + itm.endSubject + "차시";
                                        }

                                        let accordionChild = $(`
                                            <div class="item ${$extension.extensionToNoData(itm.extension)}">
                                                <div class="image-wrap">
                                                    <span class="ox">
                                                        <input 
                                                        class="${selectedCategory}${item.unitSeq}-checkbox" 
                                                        id="board1-${index}${idx}" 
                                                        name="${itm.referenceSeq}" 
                                                        data-file-id="${itm.referenceFileId}" 
                                                        data-origin-file-name="${itm.originFileName}" 
                                                        data-params="${itm.params}" 
                                                        data-extension="${itm.extension}"
                                                        data-upload-method="${itm.uploadMethod}"
                                                        type="checkbox"
                                                        data-down-yn="${itm.referenceDownloadUseYn}"
                                                        data-ref-seq="${itm.referenceSeq}"
                                                        checked
                                                        />
                                                        <label for="board1-${index}${idx}"></label>
                                                    </span>
                                                    <img alt="" src="${itm.thumbnailFileId}"/>
                                                    <div class="info-media">
                                                        <img alt=""
                                                             src="/assets/images/common/${$extension.extensionToIcon(itm.extension)}"/>
                                                        <span class="time">${timeChanger(itm.duration)}</span>
                                                    </div>
                                                </div>
                                                <div class="inner-wrap">
                                                    <div class="text-wrap">
                                                        <ul class="divider-group">
                                                            <li>${itm.unitSort}단원</li>
                                                            <li>${subject}</li>
                                                        </ul>
                                                        <a class="title" 
                                                        data-is-disabled="${ynToBoolean(itm.referencePreviewUseYn) && itm.extension !== "zip"}"
                                                        data-file-id ="${itm.referenceFileId}"
                                                        data-source="${itm.source}"
                                                        data-seq="${itm.referenceSeq}">${itm.referenceName}</a>
                                                    </div>
                                                    <div class="board-buttons">
                                                        <div class="buttons">
                                                            <button class="button type-icon size-sm preview-btn"
                                                                    data-seq="${itm.referenceSeq}"
                                                                    name="${itm.referenceSeq}"
                                                                    data-file-id ="${itm.referenceFileId}"
                                                                    data-upload-method="${itm.uploadMethod}"
                                                                    data-source="${itm.source}"
                                                                    type="button" ${ynToBoolean(itm.referencePreviewUseYn) && itm.extension !== "zip" ? "" : "disabled"}
                                                                    data-new-win-url="${itm.originFileName}"
                                                                    >
                                                                <svg>
                                                                    <title>아이콘 돋보기</title>
                                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#${itm.uploadMethod === "NEWWIN" ? 'icon-new-windows' : 'icon-search'}"></use>
                                                                </svg>
                                                            </button>
                                                            <button class="button type-icon size-sm down-btn"
                                                                    type="button" ${ynToBoolean(itm.referenceDownloadUseYn) ? "" : "disabled"}
                                                                    name="${itm.referenceSeq}"
                                                                    data-file-id="${itm.referenceFileId}"
                                                                    data-url="${itm.parameter}"
                                                                    data-origin-name="${itm.originFileName}"
                                                                    data-upload-method="${itm.uploadMethod}"
                                                                    onclick="clickDown(event)">
                                                                <svg>
                                                                    <title>아이콘 다운로드</title>
                                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                                </svg>
                                                            </button>
                                                            <button 
                                                            class="button type-icon size-sm toggle-this scrap ${itm.myScrapYn === 'Y' ? 'active' : ''}" 
                                                            name="${itm.referenceSeq}"
                                                            type="button" 
                                                            ${ynToBoolean(itm.referenceScrapUseYn) ? "" : "disabled"}
                                                            data-toast="toast-scrap-m-${itm.referenceSeq}"
                                                            data-seq="${itm.referenceSeq}"
                                                            >
                                                                <svg>
                                                                    <title>아이콘 핀</title>
                                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                                                </svg>
                                                            </button>
                                                            <!-- <button class="button type-icon size-sm ai-share"
                                                                    type="button" ${ynToBoolean(itm.referenceShareUseYn) ? "" : "disabled"}>
                                                                <svg>
                                                                    <title>아이콘 공유</title>
                                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                                </svg>
                                                            </button> -->
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `);
                                        accordionContent.find(upper).append(accordionChild);

                                        // duration 없을 시 시간 표시 없음
                                        itm.duration > 0 ? "" : accordionChild.find('div.image-wrap div.info-media').css({"display": "none"});


                                        // 개별 스크랩 & 미리보기
                                        accordionChild.off('click').on('click','.buttons button', async function (){
                                            const seq = $(this).data('seq');
                                            let fileId = $(this).data('fileId') ? $(this).data('fileId') : $(this).prop('data-file-id');
                                            let source = $(this).data('source');
                                            let uploadMethod = $(this).data('uploadMethod');
                                            let url = $(this).data('newWinUrl');

                                            if($(this).hasClass('scrap')){
                                                const teacher = checkTeacher('scrap');
                                                const isAdd = $(this).hasClass('active') ? false : true;

                                                teacher ? await tbReferenceTab.c.scrapCommonRef([seq],isAdd) : "";
                                                teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";

                                            }else if ($(this).hasClass('preview-btn')){
                                                const options = {
                                                    method: "GET",
                                                    url: "/pages/api/preview/previewServiceYn.ax",
                                                    data: { fileId: fileId },
                                                    success: (res) => {
                                                        console.log(res);
                                                        if (res.row.service_yn === 'Y') {
                                                            const teacher = checkTeacher('');
                                                            if(teacher){
                                                                if(uploadMethod === 'NEWWIN'){
                                                                    window.open(url, "_blank");
                                                                }else{
                                                                    tbReferenceTab.c.previewFile(fileId,source,seq);
                                                                }
                                                            }
                                                        } else {
                                                            $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요")
                                                        }

                                                    }
                                                };
                                                $cmm.ajax(options);
                                            }
                                        })

                                        // 더보기 버튼 화면단
                                        if(`${moreBtnObj[multiMediaRefCurrentPage]} !== ${totalPage}`) {
                                            $(`button.moreBtn${index}`).text(`더보기 ${moreBtnObj[multiMediaRefCurrentPage]} / ${totalPage}`);
                                        }
                                    });
                                }else{
                                    // 자료 없음
                                    accordionContent.find('div.pane').empty();
                                    accordionContent.find('div.pane').append(displayNoData);
                                }

                                // gallery / list 보기형식 바꿈
                                accordionContent.find('div.sort div.displayTypeBtn button').on('click', function () {
                                    let multiRefDisplayType = $(this).data("selectedBtn");

                                    $(this).addClass('active');
                                    $(this).siblings('button').removeClass('active');

                                    multiRefDisplayType === "list" ? accordionContent.find(`div#accordionContainMulti${index}`).addClass('type-vertical') : accordionContent.find(`div#accordionContainMulti${index}`).removeClass('type-vertical');
                                })

                                let iconPlus = `
                                    <svg>
                                        <title>아이콘 더보기</title>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                                    </svg>
                                `

                                // 더보기 버튼 화면단
                                if(totalPage > 1){
                                    $(`button.moreBtn${index}`).empty().append(iconPlus+`더보기 ( ${moreBtnObj[multiMediaRefCurrentPage]} / ${totalPage})`);
                                    moreBtnObj[moreBtn] = true;
                                }else{
                                    $(`button.moreBtn${index}`).css({display : "none"})
                                }

                                // 더보기 버튼 onClick
                                accordionContent.find(`button.moreBtn${index}`).on('click', async function () {
                                    if(moreBtnObj[moreBtn] === true){
                                        const data = await tbReferenceTab.c.multimediaListMore(refDivCd4s,item.unitSeq,selectedCategory,moreBtnObj[multiMediaRefCurrentPage]);

                                        // 더보기 데이터 append
                                        $.each(data, function (idx, itm){
                                            let accordionChild = $(`
                                                <div class="item">
                                                    <div class="image-wrap">
                                                        <span class="ox">
                                                            <input 
                                                            class="${selectedCategory}${item.unitSeq}-checkbox" 
                                                            checked="" 
                                                            id="board1-${index}${idx + (pageLength * moreBtnObj[multiMediaRefCurrentPage])}" 
                                                            type="checkbox" 
                                                            data-file-id="${itm.referenceFileId}" 
                                                            data-file-id="${itm.referenceSeq}"
                                                            data-origin-file-name="${itm.originFileName}"
                                                            data-params="${itm.params}" 
                                                            data-extension="${itm.extension}"
                                                            data-upload-method="${itm.uploadMethod}"
                                                            data-down-yn="${itm.referenceDownloadUseYn}"
                                                            data-ref-seq="${itm.referenceSeq}"
                                                            />
                                                            <label for="board1-${index}${idx + (pageLength * moreBtnObj[multiMediaRefCurrentPage])}"></label>
                                                        </span>
                                                        <img alt="" src="${itm.thumbnailFileId}" style="display: ${itm.thumbnailFileId === "" ? "none" : ""}"/>
                                                        <div class="info-media">
                                                            <img alt=""
                                                                 src="/assets/images/common/${$extension.extensionToIcon(itm.extension)}"/>
                                                            <span class="time">${timeChanger(itm.duration)}</span>
                                                        </div>
                                                    </div>
                                                    <div class="inner-wrap">
                                                        <div class="text-wrap">
                                                            <ul class="divider-group">
                                                                <li>${itm.unitSort}단원</li>
                                                                <li>${itm.subjectSeq === null ? "공통자료" : ynToBoolean(itm.singleSubjectUseYn) ? itm.startSubject + "차시" : itm.startSubject + '~' + itm.endSubject + "차시"}</li>
                                                            </ul>
                                                            <a class="title" 
                                                            data-is-disabled="${ynToBoolean(itm.referencePreviewUseYn) && itm.extension !== "zip"}"
                                                            data-file-id ="${itm.referenceFileId}"
                                                            data-source="${itm.source}"
                                                            data-seq="${itm.referenceSeq}"
                                                            >
                                                            ${itm.referenceName}
                                                            </a>
                                                        </div>
                                                        <div class="board-buttons">
                                                            <div class="buttons">
                                                                <button class="button type-icon size-sm preview-btn"
                                                                        data-seq="${itm.referenceSeq}"
                                                                        data-file-id ="${itm.referenceFileId}"
                                                                        data-upload-method="${itm.uploadMethod}"
                                                                        data-source="${itm.source}"
                                                                        type="button" ${ynToBoolean(itm.referencePreviewUseYn) && itm.extension !== "zip"? "" : "disabled"}
                                                                        data-new-win-url="${itm.originFileName}"
                                                                        >
                                                                    <svg>
                                                                        <title>아이콘 돋보기</title>
                                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#${itm.uploadMethod === "NEWWIN" ? 'icon-new-windows' : 'icon-search'}"></use>
                                                                    </svg>
                                                                </button>
                                                                <button class="button type-icon size-sm down-btn"
                                                                        type="button" ${ynToBoolean(itm.referenceDownloadUseYn) ? "" : "disabled"}
                                                                        name="${itm.referenceSeq}"
                                                                        data-file-id="${itm.referenceFileId}"
                                                                        data-url="${itm.parameter}"
                                                                        data-origin-name="${itm.originFileName}"
                                                                        data-upload-method="${itm.uploadMethod}"
                                                                        onclick="clickDown(event)">
                                                                    <svg>
                                                                        <title>아이콘 다운로드</title>
                                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                                    </svg>
                                                                </button>
        
                                                                <button class="button type-icon size-sm toggle-this scrap ${itm.myScrapYn === 'Y' ? 'active' : ''}"
                                                                        name="${itm.referenceSeq}"
                                                                        type="button" ${ynToBoolean(itm.referenceScrapUseYn) ? "" : "disabled"}
                                                                        data-toast="toast-scrap-m-${itm.referenceSeq}"
                                                                        data-seq="${itm.referenceSeq}"
                                                                        >
                                                                    <svg>
                                                                        <title>아이콘 핀</title>
                                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                                                    </svg>
                                                                </button>
                                                                <!-- <button class="button type-icon size-sm ai-share"
                                                                        type="button" ${ynToBoolean(itm.referenceShareUseYn) ? "" : "disabled"}>
                                                                    <svg>
                                                                        <title>아이콘 공유</title>
                                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                                    </svg>
                                                                </button> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            `);
                                            accordionContent.find(upper).append(accordionChild);

                                            // duration 없을 시 시간 표시 없음
                                            itm.duration > 0 ? "" : accordionChild.find('div.image-wrap div.info-media').css({"display": "none"});

                                            // 개별 스크랩 & 미리보기
                                            accordionChild.off('click').on('click','.buttons button', async function (){
                                                const seq = $(this).data('seq');
                                                let fileId = $(this).data('fileId') ? $(this).data('fileId') : $(this).prop('data-file-id');
                                                let source = $(this).data('source');
                                                let uploadMethod = $(this).data('uploadMethod');
                                                let url = $(this).data('newWinUrl');

                                                if($(this).hasClass('scrap')){
                                                    const teacher = checkTeacher('scrap');
                                                    const isAdd = $(this).hasClass('active') ? false : true;

                                                    teacher ? await tbReferenceTab.c.scrapCommonRef([seq],isAdd) : "";
                                                    teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";

                                                }else if ($(this).hasClass('preview-btn')){
                                                    const options = {
                                                        method: "GET",
                                                        url: "/pages/api/preview/previewServiceYn.ax",
                                                        data: { fileId: fileId },
                                                        success: (res) => {
                                                            console.log(res);
                                                            if (res.row.service_yn === 'Y') {
                                                                const teacher = checkTeacher('');
                                                                if(teacher){
                                                                    if(uploadMethod === 'NEWWIN'){
                                                                        window.open(url, "_blank");
                                                                    }else{
                                                                        tbReferenceTab.c.previewFile(fileId,source,seq);
                                                                    }
                                                                }
                                                            } else {
                                                                $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요")
                                                            }

                                                        }
                                                    };
                                                    $cmm.ajax(options);
                                                }
                                            })
                                        });

                                        // 체크박스 컨트롤
                                        handleCheckbox(`#ox${index}`,`.${selectedCategory}${item.unitSeq}-checkbox`,`#${selectedCategory}${index}-downloadCnt`);

                                        // 체크된 input 개수
                                        let checkedItems = $(`div#accordionContainMulti${index} input[type="checkbox"]:checked`).length // 기존에 체크된 input
                                        checkedItems += data.length;// moreBtn 클릭후 추가로 체크된 input
                                        appendParent.find(`#${selectedCategory}${index}-downloadCnt`).text(checkedItems);

                                        //더보기 버튼 페이지 화면단
                                        $(`button.moreBtn${index}`).empty().append(iconPlus+`더보기 ( ${moreBtnObj[multiMediaRefCurrentPage]+1} / ${totalPage} )`);

                                        // 더보기 버튼 활.비활
                                        moreBtnObj[itemLength] += data.length;
                                        moreBtnObj[moreBtn] = (moreBtnObj[itemLength] !== item.totalCount); // 버튼 flag값
                                        // $(`button.moreBtn${index}`).prop('disabled', !moreBtnObj[moreBtn]);

                                        //현재 페이지
                                        moreBtnObj[multiMediaRefCurrentPage] += 1

                                        console.log(`${moreBtnObj[multiMediaRefCurrentPage]}`)
                                        console.log(`${totalPage}`)

                                        if (moreBtnObj[multiMediaRefCurrentPage] === totalPage) {
                                            $(`button.moreBtn${index}`).parent().addClass('display-hide');
                                        }
                                    }

                                    // 전체 스크랩
                                    accordionContent.off('click').on('click', 'button.total-scrap', async function () {
                                        const teacher = checkTeacher('scrap');

                                        let checkedList = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.classRefList li div#accordionContainMulti${index}`, "refSeq").checkedInputs;
                                        let isAddList = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.classRefList li div#accordionContainMulti${index}`,"refSeq").isAddList;

                                        checkedList = checkedList.filter((v, k) => {
                                            return isAddList[k]
                                        });

                                        checkedList.length > 0 ? $(this).attr('hasInputs',true) : $(this).attr('hasInputs',false);

                                        teacher ? checkedList.length > 0 ? await tbReferenceTab.c.scrapCommonRef(checkedList, true, 'totalScrap') : checkFirst() : "";
                                    });
                                });

                                // 선택한 카테고리탭별 html 렌더
                                appendParent.append(accordionContent);

                                // 선택된 체크박스 갯수 default
                                $(`#${selectedCategory}${index}-downloadCnt`).text(refList.length);

                                // 체크박스 컨트롤
                                handleCheckbox(`#ox${index}`,`.${selectedCategory}${item.unitSeq}-checkbox`,`#${selectedCategory}${index}-downloadCnt`);

                                // 전체 스크랩
                                accordionContent.off('click').on('click', 'button.total-scrap', async function () {
                                    const teacher = checkTeacher('scrap');

                                    let checkedList = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.classRefList li div#accordionContainMulti${index}`, "refSeq").checkedInputs;
                                    let isAddList = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.classRefList li div#accordionContainMulti${index}`,"refSeq").isAddList;

                                    checkedList = checkedList.filter((v, k) => {
                                        return isAddList[k]
                                    });

                                    checkedList.length > 0 ? $(this).attr('hasInputs',true) : $(this).attr('hasInputs',false);

                                    teacher ? checkedList.length > 0 ? await tbReferenceTab.c.scrapCommonRef(checkedList, true, 'totalScrap') : checkFirst() : "";
                                });

                                // 멀티 다운로드
                                accordionContent.find('a button[name="multi-down-btn"]').on('click', function () {
                                    if(multi_use_yn){
                                        const checkedList = checkedInputList(`.categoryDataList[data-category-contain="${selectedCategory}"] ul.classRefList li div#accordionContainMulti${index}`,'multiDownload');

                                        // dialog - 로그인 & 정교사 여부 확인
                                        const check = checkTeacher('multiDownload',checkedList.length);

                                        // dialog - 선택한 자료 없음
                                        if(check && checkedList.length === 0){
                                            checkFirst();

                                        }else {
                                            check ? copyrightAlert(checkedList) : "";
                                        }
                                    }else{
                                        $alert.open('MG00060');
                                    }
                                })
                            })
                        } else {
                            $.each(res, function (index, item) {
                                let refList = item.refList ? [...item.refList] : [];
                                let uNN = item.referenceListUnitName !== '' ? item.referenceListUnitName : item.unitNumberName !== '' ? item.unitNumberName : '';

                                let accordionContent = $(`
                                    <li class="active classRefItems" style="display: ${uNN.length === 0 ? 'none' : ''}" >
                                        <a class="chapter-depth action">
                                            <div class="header-wrap">
                                                <span class="ox">
                                                  <input id="ox${index}${selectedCategory}" class="ox${index}-check-all all" type="checkbox" checked/>
                                                  <label for="ox${index}${selectedCategory}"></label>
                                                </span>
                                                <h3>${uNN}. ${item.unitName}</h3>
                                            </div>
                                            <div class="buttons">
                                                <button class="button size-md total-scrap scrap toggle-this" data-toast="toast-scrap-l-${selectedCategory}${index}">
                                                    스크랩
                                                    <svg>
                                                        <title>아이콘 핀</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                                    </svg>
                                                </button>
                                                <button class="button size-md" name="multi-down-btn">
                                                    <span> 총 <strong class="text-primary" id="${selectedCategory}${index}-downloadCnt"></strong>건 다운로드 </span>
                                                    <svg>
                                                        <title>아이콘 다운로드</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        </a>
                                        <div class="pane" style="display: block;">
                                            <div class="chapter-wrap">
                                                <div class="chapter-list">
                                                </div>
                                            </div>
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
                                            <div class="item">
                                                <span class="ox class-ref class-ref${index}">
                                                    <input 
                                                    class="${selectedCategory}${index}-checkbox" 
                                                    checked="" 
                                                    id="board1-${index}-${idx + 1}" 
                                                    name="${itm.referenceSeq}" 
                                                    type="checkbox" 
                                                    data-ref-seq="${itm.referenceSeq}"
                                                    data-file-id="${itm.referenceFileId}"
                                                    data-origin-file-name="${itm.originFileName}"
                                                    data-params="${itm.params}"
                                                    data-extension="${itm.extension}"
                                                    data-upload-method="${itm.uploadMethod}"
                                                    data-down-yn = "${itm.referenceDownloadUseYn}"
                                                    data-scrap-yn = "${itm.referenceScrapUseYn}"
                                                    />
                                                    <label for="board1-${index}-${idx + 1}"></label>
                                                </span>
                                                <div class="inner-wrap" id="accordion-idx-${idx}">
                                                    <div class="text-wrap">
                                                        <div class="extra">
                                                            <ul class="divider-group">
                                                                <li>${itm.unitSort} 단원</li>
                                                                <li>${subject}</li>
                                                            </ul>
                                                            <img alt="${itm.fileType} 아이콘"
                                                                 src="/assets/images/common/${$extension.extensionToIcon(itm.extension)}"/>
                                                        </div>
                                                        <a class="title" 
                                                        data-is-disabled="${ynToBoolean(itm.referencePreviewUseYn) && itm.extension !== "zip"}"
                                                        data-file-id ="${itm.referenceFileId}"
                                                        data-source="${itm.source}"
                                                        data-seq="${itm.referenceSeq}"
                                                        >${itm.referenceName}</a>
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
                                                                ${ynToBoolean(itm.referencePreviewUseYn) && itm.extension !== "zip" ? "" : "disabled"}>
                                                            <svg>
                                                                <title>아이콘 돋보기</title>
                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#${itm.uploadMethod === "NEWWIN" ? 'icon-new-windows' : 'icon-search'}"></use>
                                                            </svg>
                                                        </button>
                                                        <button class="button type-icon size-sm ref-down-btn down-btn"
                                                                type="button"
                                                                ${ynToBoolean(itm.referenceDownloadUseYn) ? "" : "disabled"}
                                                                data-file-id="${itm.referenceFileId}"
                                                                data-url="${itm.parameter}"
                                                                data-origin-name="${itm.originFileName}"
                                                                name="${itm.referenceSeq}"
                                                                data-upload-method="${itm.uploadMethod}"
                                                                onclick="clickDown(event)"
                                                                >
                                                            <svg>
                                                                <title>아이콘 다운로드</title>
                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                            </svg>
                                                        </button>
                                                        <button class="button type-icon size-sm scrap toggle-this ${itm.myScrapYn === 'Y' ? 'active' : ''}"
                                                                type="button"
                                                                ${ynToBoolean(itm.referenceScrapUseYn) ? "" : "disabled"}
                                                                name="${itm.referenceSeq}"
                                                                data-seq="${itm.referenceSeq}"
                                                                data-toast="toast-scrap-m-${itm.referenceSeq}"
                                                                >
                                                            <svg>
                                                                <title>아이콘 핀</title>
                                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
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
                                                </div>
                                            </div>
                                        `);

                                        accordionContent.find('div.chapter-list').append(accordionChildList);

                                        // 개별 스크랩 & 미리보기
                                        accordionChildList.off('click').on('click','button',function (){
                                            const seq = $(this).data('seq');
                                            const source = $(this).data('source');
                                            let uploadMethod = $(this).data('uploadMethod');
                                            let fileId = $(this).data('fileId');
                                            let url = $(this).data('newWinUrl');

                                            if($(this).hasClass('scrap')){
                                                const isAdd = $(this).hasClass('active') ? false : true;
                                                // dialog - 로그인 & 정교사 여부 확인
                                                const teacher = checkTeacher('scrap');
                                                teacher ? tbReferenceTab.c.scrapCommonRef([seq],isAdd) : "";
                                                teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";


                                            }else if ($(this).hasClass('preview-btn')){
                                                // dialog - 로그인 & 정교사 여부 확인
                                                const options = {
                                                    method: "GET",
                                                    url: "/pages/api/preview/previewServiceYn.ax",
                                                    data: { fileId: fileId },
                                                    success: (res) => {
                                                        console.log(res);
                                                        if (res.row.service_yn === 'Y') {
                                                            const teacher = checkTeacher('');
                                                            if(teacher){
                                                                if(uploadMethod === 'NEWWIN'){
                                                                    window.open(url, "_blank");
                                                                }else{
                                                                    tbReferenceTab.c.previewFile(fileId,source,seq);
                                                                }
                                                            }
                                                        } else {
                                                            $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요")
                                                        }

                                                    }
                                                };
                                                $cmm.ajax(options);
                                            }
                                        });
                                    })
                                    // 자료 없음
                                }else{
                                    accordionContent.find('.pane').empty();
                                    accordionContent.find('.pane').append(displayNoData);
                                    accordionContent.find('.pane').css({"display": "block"});
                                }
                                // 선택한 카테고리탭별 html 렌더
                                appendParent.append(accordionContent);


                                // 선택된 체크박스 갯수 default
                                $(`#${selectedCategory}${index}-downloadCnt`).text(refList.length);

                                // 체크박스 컨트롤
                                handleCheckbox(`#ox${index}${selectedCategory}`, `.${selectedCategory}${index}-checkbox`, `#${selectedCategory}${index}-downloadCnt`);

                                // 전체 스크랩
                                accordionContent.off('click').on('click', 'a button.total-scrap', function () {
                                    const teacher = checkTeacher('scrap');
                                    const type = 'refSeq'
                                    let checkedList = checkedInputList(`.class-ref${index}`, type).checkedInputs;
                                    const isAddList = checkedInputList(`.class-ref${index}`, type).isAddList;

                                    checkedList = checkedList.filter((v, k) => {
                                        return isAddList[k]
                                    });

                                    checkedList.length > 0 ? $(this).attr('hasInputs',true) : $(this).attr('hasInputs',false);

                                    teacher ? checkedList.length > 0 ? tbReferenceTab.c.scrapCommonRef(checkedList, true, 'totalScrap') : checkFirst() : "";
                                });

                                // 멀티 다운로드
                                accordionContent.find('a button[name="multi-down-btn"]').on('click', function () {
                                    if(multi_use_yn){
                                        const checkedList = checkedInputList(`.class-ref${index}`,'multiDownload');

                                        // dialog - 로그인 & 정교사 여부 확인
                                        const check = checkTeacher('multiDownload',checkedList.length);

                                        // dialog - 선택한 자료 없음
                                        if(check && checkedList.length === 0){
                                            checkFirst();

                                        }else {
                                            check ? copyrightAlert(checkedList) : "";
                                        }
                                    }else{
                                        $alert.open('MG00060');
                                    }
                                })
                            });

                            tbReferenceTab.totalDownload(selectedCategory,null,res.length);
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
                        const parent = $(`.categoryCheckbox[data-category-contain=${selectedCategory}]`);
                        const appendHead = `
                            <div class="chapter-wrap type-outlined">
                                <div class="chapter-list classRefList">
                                </div>
                            </div>
                        `

                        parent.empty();

                        // 표시될 데이터가 없는 경우
                        if(res.length === 0 || res.resultCode === "999"){
                            parent.append('<div class="filters type-row7"></div>');
                            parent.find('.filters').append(displayNoData);
                            parent.find('.filters').css({"display" : "block"});
                        }else{
                            parent.append(appendHead);

                            // 선생님 공유 자료 데이터 렌더 영역
                            $.each(res, function (index, item) {
                                const referenceUnitName = item.unit2NumberName !== undefined ? item.unit1NumberName + "-(" + item.unit2NumberName + ")단원" : item.unit1NumberName + "단원"
                                const subject = _.isNil(item.subjectSeq) ? "공통 자료" : item.singleSubjectUseYn === "Y" ? item.startSubject + "차시" : item.startSubject + "~" + item.endSubject + "차시"
                                const upper = parent.find('.classRefList');

                                let accordionContent = $(`
                                    <div class="item">
                                        <input name="${item.mappingSeq}" data-upload-method="NEWWIN" style="display: none"/>
                                        <div class="inner-wrap">
                                            <div class="text-wrap">
                                                <div class="extra">
                                                    <ul class="divider-group">
                                                        <li>${referenceUnitName}</li>
                                                        <li>${subject}</li>
                                                    </ul>
                                                    <img alt="${item.fileType} 아이콘"
                                                         src="/assets/images/common/${$extension.extensionToIcon(item.fileType)}"/>
                                                </div>
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
                                                <button 
                                                class="button type-icon size-sm ref-down-btn" 
                                                type="button" disabled
                                                name="${item.dataSeq}"
                                                data-file-id="${item.fileId}"
                                                data-origin-name="${item.originFileName}"
                                                data-extension="${item.extension}" data-url="${item.path}"
                                                onclick="clickDown(event)">
                                                    <svg>
                                                        <title>아이콘 다운로드</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                </button>
                                                <button 
                                                    ${!ynToBoolean(item.referenceScrapUseYn) ? "disabled" : ""}
                                                    class="button type-icon size-sm toggle-this scrap" 
                                                    type="button" 
                                                    name="${item.dataSeq}"
                                                    data-toast="toast-scrap-m-${item.mappingSeq}-ai"
                                                    data-seq="${item.mappingSeq}"
                                                    >
                                                    <svg>
                                                        <title>아이콘 핀</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                                    </svg>
                                                </button>
                                                <!-- <button 
                                                class="button type-icon size-sm ai-share ${item.myScrapYn === 'Y' ? 'active' : ''}" 
                                                type="button" 
                                                ${!ynToBoolean(item.referenceShareUseYn) ? "disabled" : ""}
                                                >
                                                    <svg>
                                                        <title>아이콘 공유</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                                    </svg>
                                                </button> -->
                                            </div>
                                        </div>
                                    </div>
                                `);

                                upper.append(accordionContent);

                                // 새창열기
                                $('button.new-win').on('click',function (){
                                    const url = $(this).data('path');
                                    return window.open(url,"_blank");
                                });

                                // 개별 스크랩
                                accordionContent.off('click').on('click','button.scrap',function (){
                                    const teacher = checkTeacher();
                                    const seq = $(this).prop('name');
                                    const isAdd = $(this).hasClass('active') ? false : true;
                                    teacher ? tbReferenceTab.c.scrapCommonRef([seq],isAdd) : "";
                                    teacher ? $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active') : "";

                                });
                            })
                        }
                    },
                    error: function () { //시스템에러
                        alert("오류발생");
                    }
                });
            },

            //스크랩
            scrapCommonRef: (scrapList,isAdd,btnType) => {
                const scrapUrl = isAdd ? '/pages/api/mypage/addScrap.ax' : '/pages/api/mypage/updateScrap.ax'

                scrapList.map((refId)=>{
                    let opt = {scrapType : "TEXTBOOK"};

                    if(isAdd) {
                        opt.referenceSeq = refId;
                        opt.useYn = "Y";
                    }else{
                        opt.referenceSeqList = refId;
                    }

                    return $.ajax({
                        url: scrapUrl,
                        method : 'POST',
                        data : opt,
                        success: function (res){
                            if(res.resultCode === '0000' && isAdd && btnType === "totalScrap"){
                                scrapList.map((v)=>{
                                    return $(`button.scrap[name=${v}]`).addClass('active');
                                })
                                return true;
                            }
                        },
                        error: function (){
                            alert('스크랩 실패하였습니다');
                        }
                    })
                })
            },

            // 더보기
            multimediaListMore: (refDivCd4s,bigUnitSeq,selectedCategory,page)=>{
                return $.ajax({
                    type: "GET",
                    url: commonUrl + `/reference/multimediaListMore.ax?masterSeq=${classScreen.v.masterSeq}&refDivCd4s=${refDivCd4s}&pageLength=${pageLength}&moreCount=${page}&bigUnitSeq=${bigUnitSeq}`,
                    success: function (res) {
                        console.log(`${selectedCategory} 더보기 자료 가져옴 : `, res);
                    },
                    error: function () {
                        alert("오류발생");
                    }
                })

            },

            // 파일 미리보기
            previewFile: (fileId,source,seq) => {
                console.log(fileId, source);
                const previewUrl = `/pages/api/preview/viewer.mrn?source=${source}&file=${fileId}&referenceSeq=${seq}&type=TEXTBOOK`;
                screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview");
            },
        },

        // 전체 파일 다운로드
        totalDownload : function (selectedCategory,parent,bigUnitLength){
            $(`div[data-category-contain=${selectedCategory}]`).find('a.total-download').on('click',()=>{
                if(multi_use_yn){
                    let totalCheckedList = [];
                    let checkedListNew = [];
                    let parentEl = `.categoryDataList[data-category-contain="${selectedCategory}"] div ul.classRefList`;

                    for (let i=0; i<bigUnitLength; i++){
                        checkedListNew = [...checkedInputList(_.isNil(parent) ? `${parentEl} .class-ref${i}` : parent,'multiDownload')];
                        totalCheckedList = totalCheckedList.concat(checkedListNew);
                    };

                    // dialog - 로그인 & 정교사 여부 확인
                    const check = checkTeacher('multiDownload');

                    // dialog - 선택한 자료 없음
                    if(check && totalCheckedList.length === 0){
                        checkFirst();

                    } else {
                        check ? copyrightAlert(totalCheckedList): "";
                    }
                }else{
                    $alert.open('MG00060');
                }
            })
        },


        event: function (){

            // 공유하기 버튼 클릭
            $(".categoryDataList, .classRefList, #commonItemList, #commonRefContainer").on('click','button.ai-share',function (){
                $alert.alert("[안내] AI클래스 4월 오픈!<br/>"
                    + "학생들에게 공유하면,<br/>"
                    + "분석 리포트를 확인 할 수 있습니다.");

                /* [운영/1023] AI 클래서 오픈 연기로인해 기능 주석처리
                const seq = $(this).siblings("button.scrap").data("seq");
                const options = "width=997.3, height=455.9, resizable=no, scrollbars=no, top=50% ,left=50%"

                if(checkTeacher()){
                    if(ai_class_popup_yn){
                        window.open(`${ai_site}/#/teacher/ai-class-share?worksheetId=${seq}&schoolType=elem`,"_blank",options)
                    }else{
                        $alert.open('MG00054', function () {
                            const url = 'https://ele.m-teacher.co.kr/mevent/aiClass/';
                            window.open(url,"_blank");
                        });
                    }
                }
                 */
            })

            // 교과서 명 호버시 cursor
            $('#commonItemList, .classRefList').on('mouseover','a.title',function (){
                $(this).data('isDisabled') ? $(this).css({cursor:"pointer"}) : "";
            })

            $('.total-download').on('mouseover',function (){
                $(this).css({cursor:"pointer"});
            })

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


            $('.buttons').off('click').on('click','.total-scrap',function(e){
                totalScrap(e)
            });

            // snb 변경시 (교과서 변경)
            $('.snb-inner ul.subject-items li').on('click',function (){
                lastClickedTab = 'clickSnb';
                lastClickedRefTab = '';
                $('#textbookActiveTab ul li').eq(1).trigger('click');
            });

            // 학년, 학기 변경시
            $('.snb-inner .snb-header ul li').on('click',function (){
                lastClickedTab = 'clickSnb';
                lastClickedRefTab = '';
                $('#textbookActiveTab ul li').eq(1).trigger('click');
            });

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
                $(".categoryCheckbox .ox-group").empty();

                if (selectedCategory === "teacher") {
                    $(".classRefList").find('div.item').remove();

                    // 카테고리 목록 호출
                    tbReferenceTab.c.teacherShareList(selectedCategory);
                } else {
                    // 초기화 - 카테고리 탭 자료 영역
                    $(".classRefList").find('li').remove();
                    $(".classRefList").find('div').remove();
                    // 카테고리 목록 호출
                    tbReferenceTab.c.filterList(selectedCategory);
                }
                // }
                // 탭을 변경했는지 확인하기 위한 플래그값
                lastClickedRefTab = selectedCategory;
            });

            if (tbReferenceTab.v.tabType === 'referenceTab') {
                $(document).ready(()=>{
                })
                let headerHeight = $('header').outerHeight(); // 헤더의 높이를 가져옴

                // console.log("headerHeight", headerHeight);

                $("#categoryTab").get(0).scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest"
                });

                // 헤더의 높이만큼 스크롤을 위로 조정
                // $('html, body').animate({
                //     scrollTop: $('#categoryTab').getBoundingClientRect().top- headerHeight
                // }, 500); // 500은 애니메이션 속도 조절, 필요에 따라 수정
            }

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
    $(checkAll).off('click').on('click',(e)=>{
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
    $(checkedItem).off('click').on('click',function(e){
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

    console.log(parent,type)
    console.log($(`${parent} input[type="checkbox"]:checked`).not('input.all'))

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


// 다운로드
const clickDown = (e)=>{
    const fileId = $(`button.down-btn[name="${e.currentTarget.name}"]`).data('fileId');
    const currentTargetName = e.currentTarget.name;
    const options = {
        method: "GET",
        url: "/pages/api/preview/previewDownYn.ax",
        data: { fileId: fileId },
        success: (res) => {
            console.log(res);
            if (res.row.down_yn === 'Y') {
                const teacher = checkTeacher('');

                if(teacher){
                    let path = $(`button.down-btn[name="${currentTargetName}"]`).data('url');
                    let name = $(`button.down-btn[name="${currentTargetName}"]`).data('originName');
                    let fileId = $(`button.down-btn[name="${currentTargetName}"]`).data('fileId');
                    const uploadMethod = $(`button.down-btn[name="${currentTargetName}"]`).data('uploadMethod');

                    if(uploadMethod === 'CMS') path = `https://api-cms.mirae-n.com/down_content?service=mteacher&params=${path}`
                    if(uploadMethod === 'DIRECT') path = downDirectFile(fileId);

                    console.log(uploadMethod, path,name)

                    const downloadLink = document.createElement('a');
                    downloadLink.href = path;
                    downloadLink.target = '_blank'; // 다운로드를 새 창에서 열도록 설정
                    downloadLink.download = name; // 다운로드되는 파일의 이름 설정

                    // 가상의 링크 엘리먼트를 문서에 추가하고 클릭 이벤트 발생
                    document.body.appendChild(downloadLink);
                    downloadLink.click();

                    // 가상의 링크 엘리먼트를 제거
                    document.body.removeChild(downloadLink);
                }
            } else {
                $alert.alert("유효하지 않은 자료입니다. 고객센터에 문의해 주세요");
            }

        }
    };
    $cmm.ajax(options);


}

// 전체 스크랩
function totalScrap(e){
    const teacher = checkTeacher('scrap');

    let checkedList = checkedInputList('#commonItemList', 'refSeq').checkedInputs;
    let isAddList = checkedInputList('#commonItemList', 'refSeq').isAddList;

    checkedList = checkedList.filter((v, k) => {
        return isAddList[k]
    });

    checkedList.length > 0 ? $(e.currentTarget).attr('hasInputs',true) : $(e.currentTarget).attr('hasInputs',false);

    if(teacher){
        checkedList.length > 0 ? tbReferenceTab.c.scrapCommonRef(checkedList,true, 'totalScrap') : checkFirst();
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
