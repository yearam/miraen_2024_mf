let screenP

$(function(){
    screenP= {
        v :{
            masterSeq : 1,
            tbOptions : {
                gradeCode : null, //학년코드
                termCode : null, //학기코드
                subjectRevisionCode : null, //교과 개정 코드 (교육과정)
                subjectTypeCode : null //교과서 구분 코드 (국정,검정,인정)
            },
            tbInfoList : [], // 과목정보
            unit1List : [], // 대단원 정보
            unit2List : [], // 중단원 정보
            unit3List : [], // 소단원 정보
            sbList : [], // 차시 정보
            dataObj : {
                masterSeq: null,
                unitSeq: null,
                depth: null,
            },
            defaultCallObj : {
                tbInfo: false,
                bigUnit : false,
                midUnit: false,
                chasi: false
            },
            callObj : {},
            isTxPopupOpen : false,
            currentChasiInfo : {},
            currentTbFormObj : {}

        },
        c:{
            getTextbookList : function (data){
                const options = {
                    url: '/pages/ele/textbook/textbookList.ax',
                    data: screenP.v.tbOptions,
                    method: 'GET',
                    beforeSend: function() {$cmm.ui.loadingShow()},
                    complete: function() {$cmm.ui.loadingHide()},
                    success: async function (tbList){
                        // console.log(tbList);
                        screenP.v.tbInfoList = tbList;

                        // 교과서 데이터 바인드
                        _.isNil(data.masterSeq) ? await screenP.f.bindTextbookData() : "";

                        // 교과서 & 단원 변경시
                        if(Object.keys(data).length !== 0){
                            // console.log(`교과서 & 단원 변경 변경됨!!!`);

                            if(data.depth === 0) screenP.v.dataObj.masterSeq = data.masterSeq;
                            screenP.v.dataObj.unitSeq = data.unitSeq ? data.unitSeq : null;

                            await screenP.c.getUnitListByDepth(screenP.v.dataObj,screenP.v.dataObj.depth);
                        }
                        return true;
                    },
                    error : function (err){
                        console.log('err :', err);
                    }
                }
                $.ajax(options);
            },

            // 단원 목록
            getUnitListByDepth: function (dataObj,depth) {
                dataObj = _.isNil(dataObj) ? screenP.v.dataObj : dataObj;

                // console.log(`getUnitListByDepth${depth}${depth}${depth}${depth}`, dataObj);

                return $.ajax({
                    url: '/pages/api/textbook-unit/unitListByDepth.ax',
                    data: dataObj,
                    method: 'GET',
                })
                    .done(async function (res) {
                        // console.info("getUnitListByDepth result: ", res);

                        if(dataObj.depth === 0 && screenP.v.callObj.tbInfo){ // 교과서 변경시
                            // console.log("교과서 변경! 대단원 짜식 바인딩", res.rows);

                            screenP.v.unit1List = res.rows;
                            await screenP.f.bindBigUnitData();

                        }else if(dataObj.depth === 1 && screenP.v.callObj.bigUnit){ // 대단원 변경시
                            // console.log("대단원 변경! 중단원 짜식 바인딩", res.rows);

                            screenP.v.unit2List = res.rows;

                            screenP.v.unit2List.length === 0 ? await screenP.c.getSubjectListByUnit(screenP.v.dataObj.unitSeq) : "";
                            await screenP.f.bindMidUnitData();

                        }else if(dataObj.depth === 2 && screenP.v.callObj.midUnit){ // 중단원 변경시
                            // screenP.v.unit2List = res.rows;
                            // console.log("중단원 변경! 차시 짜식 변경", res.rows);
                            await screenP.c.getSubjectListByUnit(screenP.v.dataObj.unitSeq);
                        }
                    })
                    .fail(function (error) {
                        console.error("getUnitListByDepth failed: ", error);
                    })
            },

            // 교과서 차시, 수업 정보
            getClassList: (subjectSeq) => {
                subjectSeq = _.isNil(subjectSeq) ? screenP.v.currentChasiInfo.subjectSeq : subjectSeq;
                const options = {
                    url: '/pages/api/textbook-class/classList.ax',
                    data: {
                        subjectSeq: subjectSeq,
                        saveType: 'DEFAULT' // or SAVE
                    },
                    method: 'GET',
                    async: false,
                    success: function (res) {
                        // 부족한 차시 정보를 추가해줌
                        const keyList = Object.keys(res.row.subjectInfo);

                        keyList.forEach(v=>{
                            screenP.v.currentChasiInfo[v] = res.row.subjectInfo[v];
                        });
                    }
                };
                $.ajax(options);
            },


            // 단원 이하 차시 불러옴
            getSubjectListByUnit: (unitSeq) => {
                const options = {
                    url: '/pages/api/textbook-unit/subjectListByUnit.ax',
                    data: {
                        unitSeq: unitSeq,
                    },
                    method: 'GET',
                    async: false,
                    success: async function (res) {
                        // console.log("getSubjectListByUnit response: ", res);
                        screenP.v.sbList = res.rows;

                        screenP.f.bindChasiData();

                        return true;
                    }
                };
                $.ajax(options);
            },

            // 폼 데이터 등록
            addMydata: (formDataObj) => {
                // console.log("addMydata param : ", formDataObj);
                const options = {
                    url: '/pages/api/mypage/addMydata.ax',
                    data: formDataObj,
                    method: 'POST',
                    async: false,
                    success: function (res) {
                        alert('내링크 등록 완료');

                        // 팝업 닫기
                        $('[close-obj]').trigger('click');

                        // 폼 리셋
                        screenP.f.resetForm();

                        clRepScreen.c.getReplenishDataList(clRepScreen.v.getTabListOption);
                    }
                };
                $.ajax(options);
            },

        },

        f:{
            setCombo: () => {
                return $combo.setCmmCd(['T05','T06']);
            },

            // 과목(교과서) 정보 데이터 바인딩
            bindTextbookData : async()=>{
                screenP.f.resetCallObj();

                const target = $('select[id="subject"]');

                target.empty();

                screenP.v.tbInfoList.forEach(v=>{
                    const author = v.leadAuthorName !== "" ? `(${v.leadAuthorName})` : ""
                    target.append(`
                        <option 
                        value="${v.masterSeq}"
                        ${v.masterSeq === screenP.v.currentChasiInfo.masterSeq ? "selected": ""}
                        data-subject-code="${v.subjectCode}"
                        data-subject-type-code="${v.subjectTypeCode}"
                        data-subject-level-code="${v.subjectLevelCode}"
                        data-subject-revision-code="${v.subjectRevisionCode}"
                        >[${v.subjectRevisionCode}] ${v.textbookName}${author}</option>
                    `);
                });

                screenP.v.dataObj.masterSeq = target.find('option:selected').val();

                screenP.v.dataObj.depth = 0;
                screenP.v.dataObj.unitSeq = 0;
                screenP.v.callObj.tbInfo = true;
                await screenP.c.getUnitListByDepth(null,screenP.v.dataObj.depth);
            },

            // 대단원 데이터 바인딩
            bindBigUnitData : async()=>{
                screenP.f.resetCallObj();

                const target = $('select[id="textbook_unit1_seq"]');

                target.empty();

                screenP.v.unit1List.forEach(v=>{
                    target.append(`
                    <option value="${v.unitSeq}" data-text="${v.unitNumberName}. ${v.unitName}">${v.unitNumberName}. ${v.unitName}</option>
                    `);
                });

                target.find(`option[value=${screenP.v.currentChasiInfo.depth1UnitSeq}]`).prop('selected', true);

                screenP.v.dataObj.unitSeq = target.find('option:selected').val();

                screenP.v.dataObj.depth = 1;
                screenP.v.callObj.bigUnit = true;
                await screenP.c.getUnitListByDepth(null,screenP.v.dataObj.depth);
            },

            // 중단원 데이터 바인딩
            bindMidUnitData : async()=>{

                screenP.f.resetCallObj();

                const target = $('select[id="textbook_unit2_seq"]');

                target.empty();

                if(screenP.v.unit2List.length === 0 ){
                    target.css('display','none');
                    $('span[aria-labelledby="select2-textbook_unit2_seq-container"]').css('display','none');
                }else {
                    screenP.v.unit2List.forEach(v => {
                        target.css('display','block');
                        $('span[aria-labelledby="select2-textbook_unit2_seq-container"]').css('display','block');

                        target.append(`
                    <option value="${v.unitSeq}">${v.unitNumberName}. ${v.unitName}</option>
                    `);
                    })
                    screenP.v.currentChasiInfo.depth2UnitSeq !==0 ?
                        target.find(`option[value=${screenP.v.currentChasiInfo.depth2UnitSeq}]`).prop('selected', true) : "";

                    screenP.v.dataObj.unitSeq = target.find('option:selected').val();

                    screenP.v.dataObj.depth = 2;
                    screenP.v.callObj.midUnit = true;
                    await screenP.c.getUnitListByDepth(null,screenP.v.dataObj.depth);
                }
            },

            // 차시 데이터 바인딩
            bindChasiData : ()=>{
                screenP.f.resetCallObj();

                const target = $('[id="textbook_subject_seq"]');
                const displaySelected = $('#myLinkUploadPopup .select-button');

                target.empty();

                displaySelected.empty();

                screenP.v.sbList.forEach((v,k) => {
                    let pageInfo='';
                    if(!_.isNil(v.textbookName)) pageInfo += v.textbookName;
                    if(!_.isNil(v.textbookPage)) pageInfo += ` ${v.textbookPage}쪽`;
                    if(!_.isNil(v.subTextbookName) && v.subTextbookName !== '' && !_.isNil(v.subTextbookPage)) pageInfo += ` / ${v.subTextbookName} ${v.subTextbookPage}쪽`;

                    target.append(`
                        <li class="" name="chasi" value="${v.subjectSeq}">
                            <button type="button">
                                <span>[${v.chasiName}] ${v.subjectName}</span>
                                <span class="badge type-rounded fill-light">${pageInfo!=='' && "(" + pageInfo + ")"}</span>
                            </button>
                        </li>
                    `);

                    if(k === 0){
                        displaySelected.append(`
                            <span name="subject" value="${v.subjectSeq}">[${v.chasiName}] ${v.subjectName}</span>
                            <span class="badge type-rounded fill-light">${pageInfo!==`` && "(" + pageInfo + ")"}</span>
                        `);
                    };
                })
            },


            mainSubTextbookInfo : function (){
                let {
                    textbookStartPage,textbookEndPage,
                    subTextbookStartPage,subTextbookEndPage,
                    subMasterYn, mainTextbookYn,
                    textbookName,subTextbookName
                } = screenP.v.currentChasiInfo;

                let mainTxPage = "";
                let subTxPage = "";


                if(mainTextbookYn==='Y'){
                    mainTxPage = !_.isNil(textbookEndPage) ? textbookStartPage : textbookStartPage + "~" + textbookEndPage;
                }

                if(subMasterYn==='Y'){
                    subTxPage = !_.isNil(subTextbookEndPage) ? subTextbookStartPage : subTextbookStartPage + "~" + subTextbookEndPage;
                }

                let pageInfo = ``;
                mainTextbookYn === 'Y' ? pageInfo += `${textbookName} ${mainTxPage}쪽` : ``;
                subTxPage.length > 0 && subMasterYn === 'Y' ? pageInfo +=`gg ${subTextbookName} ${subTxPage}쪽` : ``;
                return pageInfo;
            },

            resetCallObj : function (){
                screenP.v.callObj = {...screenP.v.defaultCallObj};
            },

            // 등록할 데이터 세팅
            setParams : function (){
                const formData = $('form#textbookSelectForm').serializeArray();
                const seqObj = {};

                formData.forEach(function(field) {
                    if(field.name === 'combo-T05') field.name = 'gradeCode';
                    if(field.name === 'combo-T06') field.name = 'termCode';
                    seqObj[field.name] = field.value;
                });

                seqObj.masterSeq = screenP.v.dataObj.masterSeq;
                seqObj.subjectCode = $('select#subject option:selected').data('subjectCode');
                seqObj.subjectLevelCode = $('select#subject option:selected').data('subjectLevelCode');
                seqObj.subjectRevisionCode = $('select#subject option:selected').data('subjectRevisionCode');
                seqObj.subjectTypeCode = $('select#subject option:selected').data('subjectTypeCode');
                seqObj.textbookSeq = $('select#subject option:selected').val();
                seqObj.textbookSubjectSeq = $('#textbook_subject_seq li[name=chasi]').val();

                screenP.v.currentTbFormObj = seqObj; // 저장시 보낼 객체
            },

            // 폼 초기화
            resetForm : async function(){
                document.getElementById("myLinkUploadForm").reset();
                document.getElementById("textbookSelectForm").reset();
                $('input[value="ONLYFORME"]').trigger('click');

                screenP.f.resetCallObj();

                await screenP.setCurrentChasiInfo(); // 현재 차시 관련 정보
                await screenP.setDeafult(); // 현재 차시 관련 정보(화면단)
            },

            tooltip: () => {
                $("[data-name=my-link]").each(function (idx, el) {
                    $(el).webuiPopover({
                        multi: true,
                        backdrop: $(el).is("[data-backdrop]"),
                        closeable: $(el).is("[data-closeable]"),
                        style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
                        container: $(el).is("[data-container]") ? $(`${$(el).attr("data-container")}`) : false,
                        onShow: function () {
                            if ($(el).is("[data-focus]")) {
                                $(el).addClass('focus');
                            }
                        },
                        onHide: function () {
                            if ($(el).is("[data-focus]")) {
                                $(el).removeClass('focus');
                            }
                        }
                    });
                });
            },

        },

        event : function(){
            // 폼 등록 버튼 클릭
            $('form#myLinkUploadForm').on('click','button#upload-btn',function (e){

                e.preventDefault();

                if($('input[name=dataGubun]:checked').val() === "TOGETHER" && !$('input[name=agree]').prop('checked')){
                    alert('저작권 및 활용 동의 필수');
                }else{
                    const formData = $('form#myLinkUploadForm').serializeArray();
                    const formObject = {};

                    formData.forEach(function(field) {
                        let key = field.name;
                        formObject[key] = field.value;
                    });

                    // 교과서 정보
                    if(Object.keys(screenP.v.currentTbFormObj).length === 0){
                        // default
                        const { gradeCode,termCode,masterSeq,depth1UnitSeq,depth2UnitSeq,depth3UnitSeq,subjectSeq,subjectTypeCode,subjectRevisionCode,subjectLevelCode,subjectCode } = screenP.v.currentChasiInfo;
                        formObject.gradeCode = gradeCode;
                        formObject.termCode = termCode;
                        formObject.textbookSeq = masterSeq;
                        formObject.textbookUnit1Seq = depth1UnitSeq;
                        formObject.textbookUnit2Seq = depth2UnitSeq;
                        formObject.textbookUnit3Seq = depth3UnitSeq;
                        formObject.textbookSubjectSeq = subjectSeq;
                        formObject.subjectTypeCode = subjectTypeCode;
                        formObject.subjectRevisionCode = subjectRevisionCode;
                        formObject.subjectLevelCode = subjectLevelCode;
                        formObject.subjectCode = subjectCode;
                    }else{
                        // 교과목 변경시
                        Object.keys(screenP.v.currentTbFormObj).map(v=>{
                            formObject[v] = screenP.v.currentTbFormObj[v];
                        });
                    }

                    formObject.mapping_type = 'MYDATA'; // tb_totalboard_curriculum_mapping
                    formObject.dataType = 'MYDATA'; // tb_my_data
                    formObject.useYn = 'Y'; // tb_my_data
                    formObject.curriculum_info_use_yn = 'Y'; // tb_my_data

                    // 교과서 매핑 여부
                    formObject.mappingType = 'MYDATA';
                    formObject.curriculumInfoUseYn = 'Y';

                    screenP.c.addMydata(formObject);
                }
            })

            // 폼 닫기 버튼 클릭
            $('#myLinkUploadPopup').on('click','[close-obj]',function (e){
                e.preventDefault();

                const targetDiv = $(this).data('targetDiv');
                $(`#${targetDiv}`).removeClass('display-show');

                // 교과서 선택폼을 닫은 경우에는 폼 리셋 X
                targetDiv !== 'select-tex-info' ? screenP.f.resetForm() : "";
            })

            // 교과서 선택 버튼 클릭
            $('#myLinkUploadPopup').on('click','[target-obj=select-tex-info]',async function (e){
                e.preventDefault();

                // 학년, 학기 공통코드 호출
                await screenP.f.setCombo();

                // '공통학년', '공통학기' 표시 안함
                $('select[name="combo-T05"]').find('option[value="00"]').remove();
                $('select[name="combo-T06"]').find('option[value="00"]').remove();

                // 현재 학년, 학기 바인딩
                $('select[name="combo-T05"]').find(`option[value=${screenP.v.currentChasiInfo.gradeCode}]`).prop('selected',true);
                $('select[name="combo-T06"]').find(`option[value=${screenP.v.currentChasiInfo.termCode}]`).prop('selected',true);

                screenP.v.tbOptions.gradeCode = screenP.v.currentChasiInfo.gradeCode;
                screenP.v.tbOptions.termCode = screenP.v.currentChasiInfo.termCode;

                screenP.v.callObj.tbInfo = true;
                // 교과서 정보 바인딩
                screenP.c.getTextbookList({});
                screenP.f.resetCallObj();
            })

            // 교과서 변경 확인 버튼 클릭
            $('form#textbookSelectForm').on('click','button[type=submit]', async function (e){
                e.preventDefault();

                const formObject = {};

                $('form#textbookSelectForm select').map( function() {
                    let name = $(this).attr('name');
                    const value = $(this).find('option:selected').text();

                    if(name === 'combo-T05') name = "gradeCode";
                    if(name === 'combo-T06') name = "termCode";

                    return formObject[name] = value;
                });

                formObject.textbook_subject_seq = $('button.select-button span:eq(0)').text(); // 차시 value
                formObject.textbook_main_sub = $('button.select-button span:eq(1)').text(); // 주,부교과서 value

                const targetDiv = $(this).data('targetDiv');

                // 선택한 데이터 화면단 그려주기
                await screenP.setTotalTextbookInfo(formObject);

                // 선택한 데이터 객체 담기
                await screenP.f.setParams();

                $(`#${targetDiv}`).removeClass('display-show');

                $('#select-tex-info').find('.dimd.type-transparent').remove();
            });

            // 교과 선택 팝업 - 학년 학기 교과서 onChange
            $('form#textbookSelectForm').on('change','select',async function (){
                const selectedVal = $(this).val();
                const target = $(this).data('key');
                const data = {}
                // console.log(`학년 학기 교과서 onChange : ${target} 변경됨!!!`);

                screenP.v.tbOptions[target] = selectedVal;

                if(target === 'master'){ // 교과서를 변경할 경우
                    data.masterSeq = selectedVal;
                    data.depth = 0
                    screenP.v.dataObj.depth = 0;
                    screenP.v.callObj.tbInfo = true;
                }else if(target === 'unit1'){ // 대단원을 변경할 경우
                    data.masterSeq = screenP.v.dataObj.masterSeq;
                    data.depth = 1
                    data.unitSeq = selectedVal;
                    screenP.v.dataObj.depth = 1;
                    screenP.v.callObj.bigUnit = true;
                }else if(target === 'unit2'){ // 중단원을 변경할 경우
                }

                // 교과서 데이터 패치 //차시 데이터 패치
                await target !== 'unit2' ? await screenP.c.getTextbookList(data) : await screenP.c.getSubjectListByUnit(selectedVal);
            })

            // 차시 변경시
            $('form#textbookSelectForm div.dropdown-select div.options ul').delegate('li','click',function(e){
                const subjectSeq = e.currentTarget.value;
                screenP.v.currentTbFormObj.subjectSeq = subjectSeq;
            })

            // 저작권 동의
            $('input[name="dataGubun"]').on('click',function (){
                const value = $(this).prop('value');
                value !== 'TOGETHER' ? $('#copyrightInfoBox').css('display','none') : $('#copyrightInfoBox').css('display','block');
            })
        },

        // 교과서 정보 변경한 경우 화면단 데이터
        setTotalTextbookInfo : function (data){
            // console.log("set total textbook info : ", data);

            $('#textbook-info-container ul').empty();
            $('#textbook-info-container ul').append(`
                <li>${data.gradeCode}</li>
                <li>${data.termCode}</li>
                <li>${data.textbookUnit1Seq}</li>
                <li>${data.subjectCode}</li>
            `);

            $('#textbook-info-container .chasi-name').empty();
            $('#textbook-info-container .chasi-name').append(`
                <strong class="semi"> ${data.textbook_subject_seq}</strong>
            `);

            $('#textbook-info-container span').text(data.textbook_main_sub);
        },

        // 현재 차시(default) 정보 화면단 데이터
        setDeafult : function (){
            const {
                startSubject, endSubject,gradeCode,termCode
                ,textbookName, depth1UnitNumberName, depth1UnitName, subjectName
            } = screenP.v.currentChasiInfo;

            const chasi = !_.isNil(endSubject) ? startSubject + "~" + endSubject : startSubject;

            $('#textbook-info-container ul').empty();
            $('#textbook-info-container ul').append(`
                <li>${gradeCode.startsWith('0') ? gradeCode.replace('0','') : gradeCode}학년</li>
                <li>${termCode.startsWith('0') ? termCode.replace('0','') : termCode}학기</li>
                <li>${textbookName}</li>
                <li>${depth1UnitNumberName}.${depth1UnitName}</li>
            `);

            $('#textbook-info-container p').empty();
            $('#textbook-info-container p').append(`
        <strong class="semi"> [${chasi}차시] ${subjectName} </strong>
        `);

            $('#textbook-info-container span').text(screenP.f.mainSubTextbookInfo());
        },

        // 현재 차시의 정보 담기
        setCurrentChasiInfo: async function(){
            screenP.v.currentChasiInfo = {...classLayerScreen.v.subjectInfo}; // 차시정보1

            await screenP.c.getClassList(); // 차시정보2

            const {depth1UnitSeq,depth2UnitSeq,depth3UnitSeq} = screenP.v.currentChasiInfo;
            const lastUnitSeq = depth3UnitSeq!== 0 ? depth3UnitSeq :  depth2UnitSeq!== 0 ? depth2UnitSeq : depth1UnitSeq;

            screenP.v.dataObj.unitSeq = lastUnitSeq; // 차시가 물려있는 unitSeq
        },

        init : async function (){
            screenP.f.tooltip();

            $('#reg-my-link').prop('init-show');

            await screenP.setCurrentChasiInfo(); // 현재 차시 관련 정보

            await screenP.setDeafult();

            screenP.event();
        }
    };

    // 팝업 열었을 때에만 호출
    screenP.init();
})


