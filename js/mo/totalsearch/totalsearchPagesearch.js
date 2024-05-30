let tsPageScreen;

$(function(){
    tsPageScreen = {
        v : {
            params : {
                searchType : "page",
                keyword : "",
                pageStart : 0,
                resultCount : 20,
                siteType : "mid",
                collection : "all",
                myYn : "n",
                pageUseYn : "n",
                pageStartPoint : "",
                pageEndPoint : "",
                subjectCd : "",
                textbookName : "",
                gubun : "all", //수업자료,평가자료,멀티미디어자료,특화자료
                scrapType : "TEXTBOOK",
                myScrapYn : "y"
            },

            Totalsearch : new Totalsearch(),

            activeTabId : $('#textbookPageSearch .tab li.active a').attr('href'),

            isSetCount : false

        },
        c : {
            getTextbookList : function (school){
                return $.ajax({
                    url : `/pages/${tsPageScreen.v.params.siteType}/textbook/textbookList.ax`,
                    data : {subjectLevelCode : school , subjectCode :tsPageScreen.v.params.subjectCd },
                    success : (res)=>{
                        return res;
                    }
                })
            },

            // 검색 조건 세팅
            setCmCode : (keyName) =>{
                $cmm.getCmmCd(['T03','T04']).then(async(r)=>{
                    const {T03, T04} = r.row;
                    const school = keyName === "init" ? "MIDDLE" : $('div[name="T03_div"] a.active').data('cmCode'); // 학교급
                    let cleanSubjectCd = T04.filter(v=>{ return !_.isNil(v.rem1) && v.rem1.includes(school)}); // 과목
                    cleanSubjectCd.splice(0,1);
                    cleanSubjectCd = [{name : "선택해 주세요", commonCode : "all"},...cleanSubjectCd];

                    let options_T03 = ``;
                    let options_T04 = ``;
                    let options_TXBOOK = ``;

                    if(keyName === "init"){
                        T03.forEach(v=>{
                            options_T03 += `<a href="javascript:void(0);" name="T03" data-cm-code="${v.commonCode}" class="${v.commonCode === "MIDDLE" ? "active" : ""}"> ${v.name} </a>`
                        });
                        $('div[name="T03_div"]').append(options_T03);
                    }

                    if(keyName === "init" || keyName === "siteType"){
                        $('.tsPageParamForm div.list-items').not('[data-param-key=siteType]').empty();

                        cleanSubjectCd.forEach((v,i)=>{
                            options_T04 += `<a href="javascript:void(0);" name="T04" class="${i == 0 ? 'active' : ''}" data-cm-code="${v.commonCode}"> ${v.name} </a>`
                        });
                        $('div[name="TO4_div"]').append(options_T04);
                        $('div[name="TXBOOK_div"]').append('<a href="javascript:void(0);" class="active" name="TXBOOK" data-cm-code=""> 선택해 주세요 </a>');
                        tsPageScreen.f.setParam("subjectCd","");
                        tsPageScreen.f.setParam("textbookName","");
                        $('button[name="T04"]').text($('a[name="T04"].active').html());
                    }

                    if(keyName === "subjectCd"){
                        $('div[name="TXBOOK_div"]').empty();

                        let textbookList = await tsPageScreen.c.getTextbookList(school);
                        textbookList = [{textbookName : "선택해 주세요"},...textbookList];

                        textbookList.forEach((v,i)=>{
                            options_TXBOOK += `<a href="javascript:void(0);" name="TXBOOK" class="${i == 0 ? 'active' : ''}" data-cm-code="${v.textbookName.replace(/\s/g, '') === "선택해주세요" ? "" : v.textbookName.replace(/\s/g, '')}"> ${v.textbookName} </a>`
                        })
                        $('div[name="TXBOOK_div"]').append(options_TXBOOK);
                        tsPageScreen.f.setParam("textbookName","");
                    }

                    $('button[name="T03"]').text($('a[name="T03"].active').html());
                    $('button[name="T04"]').text($('a[name="T04"].active').html());
                    $('button[name="TXBOOK"]').text($('a[name="TXBOOK"].active').html());
                })
            },

            // 검색 요청
            search : async function (){
                await tsPageScreen.v.Totalsearch.getTotalsearchPageResultAsync(tsPageScreen.v.params).then(res=>{
                    tsPageScreen.f.renderResults(res.res);
                });

                return;
            },

        },
        
        f : {
            setParam : function (key,value){
                // console.log(`setParam() : {${key},${value}}`)

                tsPageScreen.v.params[key] = value;
            },


            // 검색 조건 체크
            checkValid : function (){
                if(tsPageScreen.v.params.subjectCd === "" || tsPageScreen.v.params.textbookName === ""){
                    $alert.open('MG00076',()=>{});
                }else if(tsPageScreen.v.params.pageStartPoint === "") {
                    $alert.open('MG00077', () => {});
                }else{
                    return true;
                }
            },


            // 검색
            clickPageSearch : function(){
                const checkVal = tsPageScreen.f.checkValid();
                tsPageScreen.v.isSetCount = true;

                checkVal ? $('[data-collection=all]').click() : "";
            },

            
            // 데이터 순서대로 노출
            resultArray : function(resultObj){
                // console.log(resultObj);
                const arrayByOrder = ['smartclass','lesson','evaluation','multimedia','specialization'];
                let newArray = [];

                arrayByOrder.map(v=>{
                    newArray.push({ [v]: _.isNil(resultObj[v]) ? null : resultObj[v]});
                });

                return newArray;
            },


            // 검색 결과 그려주기
            renderResults: async (res) => {
                // console.log(res);
                const result = res.row.searchResult;
                const totalCount = res.row.totalCount;
                const counts = res.row.totalCountResult;
                const resultArray = tsPageScreen.f.resultArray(result);

                let resultEl = ``;
                let titleName = ``;

                $(`div${tsPageScreen.v.activeTabId}`).empty(); //전체 초기화

                for (let i=0; i< resultArray.length; i++){
                    const tab = Object.keys(resultArray[i]).toString();

                    titleName = tab === 'smartclass' ? '스마트수업' : tab === 'lesson' ? '수업자료' : tab === 'evaluation' ? '평가자료' : tab === 'multimedia' ? '멀티미디어자료' : tab === 'specialization' ? '특화자료' : '전체'

                    tsPageScreen.v.isSetCount ? $(`a[data-collection=${titleName}]`).text(`${titleName}`) : "";

                    if(totalCount > 0){
                        if(counts[tab] > 0 ){
                            resultEl += `<div class="inner-section">`;
                            resultEl += tsPageScreen.f.renderInnderHeader(titleName, counts[tab]);
                            resultEl += (titleName === "스마트수업") ? tsPageScreen.f.renderSmartClass(result[tab]) : tsPageScreen.f.renderTextbookReference(titleName,result[tab]);
                            if(counts[tab] > 2 && tsPageScreen.v.activeTabId !== '#srchtab0'){
                                resultEl += '<div class="pagination"></div>';
                            }
                            resultEl += `</div>`;
                        }
                    }else{
                        tsPageScreen.f.renderNoData('', titleName);
                    }
                }

                if(tsPageScreen.v.activeTabId === "#srchtab0" && !totalCount) tsPageScreen.f.renderNoData('', '전체');
                await $(`div${tsPageScreen.v.activeTabId}`).append(resultEl);

                // 스마트 클래스 버튼 이벤트
                await tsPageScreen.f.addSmartClassButtonEvents();
                
                // 페이지네이션
                if (res.totalCnt> 20 && tsPageScreen.v.activeTabId !== '#srchtab0') {
                    $paging.bindTotalboardPaging(res);

                    // 페이징
                    $(document).off('click', 'button[type=button][name=pagingNow]').on('click', 'button[type=button][name=pagingNow]', tsPageScreen.f.changePaging);
                };

                // 탭이동시 카운트 변경 막음. 검색시에만 리카운트
                tsPageScreen.v.isSetCount = false;
            },


            // 소제목
            renderInnderHeader : function(title, count){
                return `<div class="inner-header is-extra"><h3>${title}<span class="text-primary"> (${count.toLocaleString()})</span></h3></div>`;
            },


            // 스마트 수업
            renderSmartClass : function (data){
                let el = ``;

                let dataList = tsPageScreen.v.activeTabId === '#srchtab0' ? data.documentList.slice(0, 5) : data.documentList;

                dataList.forEach(async item =>{
                    const {textbookName,smartpptFilePath,ebookPath,subjectName,unitName1,unitName2,unitName3,coverPath,ebookUseYn,myTextbookFlag,subjectSeq} = item.document;

                    let unitName = '';
                    if(unitName1.length > 0) unitName += unitName1;
                    if(unitName2.length > 0) unitName += ` ${unitName2}`;
                    if(unitName3.length > 0) unitName += ` ${unitName3}`;

                    el += `
                        <div class="result-items">
                            <div class="item size-textbook">
                                <div class="inline-wrap gutter-md">
                                    <div class="image-wrap">
                                        <img src="${coverPath}" alt="">
                                        <span class="badge type-round-box fill-dark ${!myTextbookFlag ? "hidden" : ""}">MY</span>
                                    </div>
                                    <div class="text-wrap">
                                        <strong class="title">${textbookName}</strong>
                                        <p class="desc">${subjectName}</p>
                                        <div class="inline-wrap">
                                            <span class="extra">${unitName}</span>
                                        </div>
                                        <div class="buttons fluid">
                                            <button 
                                            type="button" 
                                            class="button size-sm ${ebookUseYn === "N" || ebookPath === "" ? "hidden" : ""}" 
                                            data-btn-type="ebook"
                                            data-path="${ebookPath}"
                                            >
                                                <svg>
                                                    <title>새창 아이콘</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows"></use>
                                                </svg> E-Book 
                                            </button>
                                            <button 
                                            type="button" 
                                            class="button size-sm type-secondary ${tsPageScreen.v.params.siteType !== "ele" && smartpptFilePath === "" ? "hidden" : ""}" 
                                            data-btn-type="${tsPageScreen.v.params.siteType === "ele" ? "classLayer" : "smartppt"}" 
                                            data-subjectseq="${subjectSeq}"
                                            data-path="${smartpptFilePath}"
                                            ${tsPageScreen.v.params.siteType !== "ele" ? "disabled" : ""}
                                            >
                                                <svg>
                                                    <title>책 아이콘</title>
                                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                                </svg> 스마트 수업 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                })

                return el;
            },


            // 교과서 자료 목록
            renderTextbookReference : function (tabName,data){
                let el = ``;
                let el2 = ``;

                let dataList = tsPageScreen.v.activeTabId === '#srchtab0' ? data.documentList.slice(0, 5) : data.documentList;

                dataList.forEach((item,key) => {
                    const {textbookName,referenceName,extension
                        ,reference_preview_use_yn,reference_download_use_yn,reference_scrap_use_yn,reference_share_use_yn
                        ,myTextbookFlag,uploadMethod,myScrapTextFlag,DOCID} = item.document;

                    el2 += `
                        <div class="item" id="${tabName}-${key}">
                            <div class="inline-wrap gutter-md">
                                <div class="media">
                                    <img src="/assets/images/common/${$extension.extensionToIcon(extension)}" alt="${extension} 아이콘">
                                </div>
                                <div class="text-wrap">
                                    <a class="title" data-type="refName" data-item-index="${key}" data-tab-name="${tabName}">${referenceName}</a>
                                    <div class="inline-wrap ${!myTextbookFlag ? "hidden" : ""}">
                                        <span class="extra">${textbookName}</span>
                                        <span class="badge-recently type-dark">MY</span>
                                    </div>
                                    <div class="buttons" data-item-index="${key}" data-tab-name="${tabName}">
                                        <button data-type="preview" type="button" class="button type-icon size-sm" ${tsAllScreen.f.ynToBooleanDisabled(reference_preview_use_yn)}>
                                            <svg>
                                                <title>아이콘 새창/돋보기</title>
                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                            </svg>
                                        </button>
                                        <button 
                                            data-type="scrap" type="button" 
                                            class="button type-icon size-sm toggle-this ${myScrapTextFlag ? "active" : ""}"
                                            ${tsAllScreen.f.ynToBooleanDisabled(reference_scrap_use_yn)}
                                            data-toast="scrap=${DOCID}-pg"
                                            >
                                            <svg>
                                                <title>아이콘 스크랩</title>
                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                            </svg>
                                        </button>
                                        <button data-type="share" type="button" class="button type-icon size-sm" ${tsAllScreen.f.ynToBooleanDisabled(reference_share_use_yn)}>
                                            <svg>
                                                <title>아이콘 공유</title>
                                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;


                    // 교과서 버튼 클릭 이벤트
                    $(document).ready(function(){
                        tsAllScreen.f.addButtonEvents(`#${tabName}-${key}`, data.documentList, tabName); // 버튼이벤트
                    })
                })


                el += `
                    <div class="result-items">
                    ${el2}
                    </div>
                `;


                return el;
            },


            // 검색 결과 없음 & 초기 화면
            renderNoData : function(type,tabName){
                let message = type !== 'init' ? '검색 결과가 없습니다.<br />' : '';

                const noData =  `
                    <div class="inner-section">
                        <div class="box-no-data">
                            <p class="title">${message} 수업할 교과서 쪽수를 검색해 주세요.</p>
                        </div>
                        <ul class="ul-dot">
                            <li>쪽수에는 숫자만 입력해 주세요.</li>
                            <li>수업에 활용하실 수 있는 자료들을 함께 안내해 드립니다.</li>
                        </ul>
                    </div>
                `;

                $(`div[data-page-type=${tabName}]`).empty();
                $(`div[data-page-type=${tabName}]`).prepend(noData);
            },


            // 탭 변경
            changeGubunTab : async (e) => {
                const value = $(e.currentTarget).find('a').data('collection');
                tsPageScreen.v.activeTabId = $(e.currentTarget).find('a').attr('href');
                await tsPageScreen.f.setParam("gubun",value);
                await tsPageScreen.f.setParam("pageStart",0);
                await tsPageScreen.f.setParam("pagingNow",1);
                value === "all" ? await tsPageScreen.f.setParam("collection","all") : await tsPageScreen.f.setParam("collection","textbook");


                await tsPageScreen.c.search();
            },


            // 페이지네이션
            changePaging : async (e) => {
                const pagingNow = e.currentTarget.value;
                tsPageScreen.v.params.pagingNow = Number(pagingNow);
                tsPageScreen.v.params.pageStart = Number(pagingNow);

                await tsPageScreen.c.search();
            },

            addSmartClassButtonEvents : function(parentNode){
                // 차시창 오픈
                $('button[data-btn-type="classLayer"]').on('click',screen.f.openClassLayer);

                // 스마트ppt 오픈
                $('button[data-btn-type=smartppt], button[data-btn-type=ebook]').off('click').on('click',screen.f.openSmartClass);
            },

            checkMyOnOff: (e) => {
                if (!$isLogin) {
                    $alert.open('MG00001');
                    $(e.currentTarget).prop('checked', false);
                    return;
                }

                const checked = $('#switcher3-1[type=checkbox]').prop("checked");

                checked ? tsPageScreen.v.params.myYn = 'y' : tsPageScreen.v.params.myYn = 'n';

                if(tsPageScreen.v.params.subjectCd != "" || tsPageScreen.v.params.textbookName != "" && tsPageScreen.v.params.pageStartPoint != ""){
                    tsPageScreen.c.search();
                }
            },
        },



        event : function (){
            // 쪽검색 옵션 변경
            $('[data-param-key]').on('click',async function(e){
                const keyName = $(e.currentTarget).data('paramKey');
                let value = $(e.currentTarget).find('a.active').data("cmCode");

                value = value === "ELEMENT" ? "ele" : value === "MIDDLE" ? "mid" : value === "HIGH" ? "high" : value; // 학교급
                keyName === "siteType" ? tsAllScreen.v.activeTabType = value : ""; // 학교급
                await tsPageScreen.f.setParam(keyName,value);
                await tsPageScreen.c.setCmCode(keyName);

                if ($(e.currentTarget).data('paramKey') === 'siteType') closePopup({id : 'popup-school'});
                if ($(e.currentTarget).data('paramKey') === 'subjectCd') closePopup({id : 'popup-subject'});
                if ($(e.currentTarget).data('paramKey') === 'textbookName') closePopup({id : 'popup-textbook'});
            });


            // 쪽검색 버튼 클릭
            $('#pageSearchBtn').on('click',tsPageScreen.f.clickPageSearch);


            // 탭이동
            $('#textbookPageSearch .tab ul').on('click','li', (e)=> tsPageScreen.f.changeGubunTab(e));


            // 키워드 검색창
            $('.search-box input,.pageStartPoint').off('change').on('change',function (){
                const paramKey = $(this).data('paramName');
                const val = $(this).val();

                tsPageScreen.f.setParam(paramKey,val);
            })

            // MY 체크 / 체크 해제 시
            $('#switcher3-1').on('change', tsPageScreen.f.checkMyOnOff);
        },



        init : async function(){
            tsPageScreen.c.setCmCode("init");
            tsPageScreen.event();

            tsPageScreen.f.renderNoData('init','전체');
        }
    }

    tsPageScreen.init();
});