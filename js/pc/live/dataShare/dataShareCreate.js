let screen = {
    v: {
        subjectLevelCode: null,
        subjectLevelPath: null,
        tab: null,
        shareSeq: null,
        subjectCode: '',
        gradeCode: '',
        unitCode: '',
        termCode: '',
        categoryCode1: '',
        categoryCode2: '',
        tagStr: '',
        editor: [],
        content: null,

        imageFile: {
            id: null,
            info: null,
        },
        delImageFileId: null,
        delImageGroupId: null,

        attachFileList: [],
        delAttachFileId: null,
        delAttachGroupId: null,

        masterSeq: 1,
        tbOptions: {
            gradeCode: null, //학년코드
            termCode: null, //학기코드
            subjectRevisionCode: null, //교과 개정 코드 (교육과정)
            subjectTypeCode: null //교과서 구분 코드 (국정,검정,인정)
        },
        tbInfoList: [], // delImageGroupId
        unit1List: [], // 대단원 정보
        unit2List: [], // 중단원 정보
        unit3List: [], // 소단원 정보
        sbList: [], // 차시 정보
        dataObj: {
            masterSeq: null,
            unitSeq: null,
            depth: null,
        },
        defaultCallObj: {
            tbInfo: false,
            bigUnit: false,
            midUnit: false,
            chasi: false
        },
        callObj: {},
        isTxPopupOpen: false,
        currentChasiInfo: {},
        currentTbFormObj: {
            gradeCode: null,
            masterSeq: null,
            subjectCode: null,
            subjectLevelCode: null,
            subjectRevisionCode: null,
            subjectTypeCode: null,
            termCode: null,
            textbookSeq: null,
            textbookSubjectSeq: null,
            textbookUnit1Seq: null,
            textbookUnit2Seq: null,
            textbookUnit3Seq: null,
        },
    },

    c: {
        getDataShareTagList: () => {
            let codeList = []
            let tabNameList = []
            let codeNameList = []

            if (screen.v.tab === '01') {
                if (screen.v.subjectLevelCode === 'ELEMENT') {
                    codeList = ['T05','T06','DS200', 'DS500']
                    tabNameList = ['학년','학기','과목','단원']
                    codeNameList = ['gradeCode','termCode','subjectCode','unitCode']
                } else {
                    codeList = ['DS200']
                    tabNameList = ['과목']
                    codeNameList = ['subjectCode']
                }

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], tabNameList[idx], codeNameList[idx], idx + 1)
                    })

                    if (screen.v.subjectLevelCode === 'ELEMENT') {
                        $('[name=subjectCodeDiv] input').each((idx, item) => {
                            if($(item).val().indexOf('E') < 0) {
                                if ($(item).val() !== '') {
                                    $(item).parent().remove()
                                }
                            }
                        })
                    } else if (screen.v.subjectLevelCode === 'MIDDLE') {
                        $('[name=subjectCodeDiv] input').each((idx, item) => {
                            if($(item).val().indexOf('M') < 0) {
                                if ($(item).val() !== '') {
                                    $(item).parent().remove()
                                }
                            }
                        })
                    } else if (screen.v.subjectLevelCode === 'HIGH') {
                        $('[name=subjectCodeDiv] input').each((idx, item) => {
                            if($(item).val().indexOf('H') < 0) {
                                if ($(item).val() !== '') {
                                    $(item).parent().remove()
                                }
                            }
                        })
                    }

                    if (screen.v.subjectCode != null && screen.v.subjectCode != '') {
                        $(`input[name=subjectCode][value=${screen.v.subjectCode}]`).prop('checked', true);
                    }

                    if (screen.v.termCode != null && screen.v.termCode != '') {
                        $(`input[name=termCode][value=${screen.v.termCode}]`).prop('checked', true);
                    }

                    if (screen.v.gradeCode != null && screen.v.gradeCode != '') {
                        $(`input[name=gradeCode][value=${screen.v.gradeCode}]`).prop('checked', true);
                    }

                    if (screen.v.unitCode != null && screen.v.unitCode != '') {
                        $(`input[name=unitCode][value=${screen.v.unitCode}]`).prop('checked', true);
                    }
                })
            } else if (screen.v.tab === '02') {
                codeList = ['DS400']
                tabNameList = ['주제']
                codeNameList = ['categoryCode1']

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], tabNameList[idx], codeNameList[idx], idx + 1)
                    })

                    $('[name=categoryCode1Div] input').each((idx, item) => {
                        if($(item).val().indexOf('CM_') > -1) {
                            if ($(item).val() !== '') {
                                $(item).parent().remove()
                            }
                        }
                    })

                    if (screen.v.categoryCode1 != null && screen.v.categoryCode1 != '') {
                        $(`input[name=categoryCode1][value=${screen.v.categoryCode1}]`).prop('checked', true);
                    }
                })
            } else if (screen.v.tab === '03') {
                codeList = ['DS400']
                tabNameList = ['주제']
                codeNameList = ['categoryCode1']

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], tabNameList[idx], codeNameList[idx], idx + 1)
                    })

                    $('[name=categoryCode1Div] input').each((idx, item) => {
                        if($(item).val().indexOf('CE_') > -1) {
                            if ($(item).val() !== '') {
                                $(item).parent().remove()
                            }
                        }
                    })

                    if (screen.v.categoryCode1 != null && screen.v.categoryCode1 != '') {
                        $(`input[name=categoryCode1][value=${screen.v.categoryCode1}]`).prop('checked', true);
                    }
                })
            } else if (screen.v.tab === '04') {
                codeList = ['A04']
                tabNameList = ['지역']
                codeNameList = ['categoryCode2']

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], tabNameList[idx], codeNameList[idx], idx + 1)
                    })

                    if (screen.v.categoryCode2 != null && screen.v.categoryCode2 != '') {
                        $(`input[name=categoryCode2][value=${screen.v.categoryCode2}]`).prop('checked', true);
                    }
                })
            } else {
                alert('파라미터 오류입니다.');
                return;
            }

        },

        // ==================================== 연계교과 관련 ====================================
        getTextbookList : function (data) {
            const options = {
                url: `/pages/${screen.v.subjectLevelPath}/textbook/textbookList.ax`,
                data: screen.v.tbOptions,
                method: 'GET',
                beforeSend: function() {$cmm.ui.loadingShow()},
                complete: function() {$cmm.ui.loadingHide()},
                success: async function (tbList){
                    // console.log(tbList);
                    screen.v.tbInfoList = tbList;

                    // 교과서 데이터 바인드
                    await screen.f.bindTextbookData()

                    // 교과서 & 단원 변경시
                    if(Object.keys(data).length !== 0){
                        // console.log(`교과서 & 단원 변경 변경됨!!!`);

                        if(data.depth == 0) screen.v.dataObj.masterSeq = data.masterSeq;
                        screen.v.dataObj.unitSeq = data.unitSeq ? data.unitSeq : screen.v.dataObj.unitSeq;

                        await screen.c.getUnitListByDepth(screen.v.dataObj,screen.v.dataObj.depth);
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
            dataObj = _.isNil(dataObj) ? screen.v.dataObj : dataObj;

            console.log(`getUnitListByDepth${depth}${depth}${depth}${depth}`, dataObj);

            return $.ajax({
                url: '/pages/api/textbook-unit/unitListByDepth.ax',
                data: dataObj,
                method: 'GET',
            })
                .done(async function (res) {
                    console.info("getUnitListByDepth result: ", res);


                    if(dataObj.depth == 0 && screen.v.callObj.tbInfo){ // 교과서 변경시
                        console.log("교과서 변경! 대단원 바인딩", res.rows);

                        screen.v.unit1List = res.rows;
                        await screen.f.bindBigUnitData();

                    }else if(dataObj.depth == 1 && screen.v.callObj.bigUnit){ // 대단원 변경시
                        console.log("대단원 변경! 중단원 바인딩", res.rows);

                        screen.v.unit2List = res.rows;

                        // screen.v.unit2List.length == 0 ? await screen.c.getSubjectListByUnit(screen.v.dataObj.unitSeq) : "";
                        await screen.f.bindMidUnitData();

                    }else if(dataObj.depth == 2 && screen.v.callObj.midUnit){ // 중단원 변경시
                        screen.v.unit2List = res.rows;
                        console.log("중단원 변경! 차시 변경", res.rows);
                        // await screen.c.getSubjectListByUnit(screen.v.dataObj.unitSeq);
                    }
                })
                .fail(function (error) {
                    console.error("getUnitListByDepth failed: ", error);
                })
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
                    console.log("getSubjectListByUnit response: ", res);
                    screen.v.sbList = res.rows;

                    screen.f.bindChasiData();

                    return true;
                }
            };
            $.ajax(options);
        },
        // ==================================== !연계교과 관련! ====================================

    },

    f: {
        setCombo: () => {
            return $combo.setCmmCd(['T05','T06']);
        },

        setTagForm: (tagData, tabName, codeName, index) => {
            let titleHtml = '';
            let tagHtml = '';

            titleHtml = `
                <tr>
                    <th scope="row" class="required">${tabName}</th>
                    <td>
                        <div class="ox-group" name="${codeName}Div">
                        
                        </div>
                    </td>
                </tr>
            `
            $('#titleTr').before(titleHtml)

            tagData.forEach((item, idx) => {
                tagHtml = `
                    <!-- 아이템 하나 -->
                    <span class="ox">
                        <input type="radio" id="ox-filter${index}_${item.commonCode}" name="${codeName}" value="${item.commonCode}" required>
                        <label for="ox-filter${index}_${item.commonCode}">${item.name}</label>
                    </span>
                    <!-- 아이템 하나 -->
                `
                $(`div[name=${codeName}Div]`).append(tagHtml)

            })
        },

        // ==================================== 연계교과 관련 ====================================
        // 과목(교과서) 정보 데이터 바인딩
        bindTextbookData : async()=>{
            console.log("학기, 학년 변경! 교과서 바인딩!");
            screen.f.resetCallObj();

            const target = $('select[id="subject"]');

            if (target.children().length > 0) {
                screen.v.dataObj.masterSeq = target.find('option:selected').val();
            }

            target.empty();


            screen.v.tbInfoList.forEach(v=>{
                const author = v.leadAuthorName !== "" ? `(${v.leadAuthorName})` : ""
                target.append(`
                        <option 
                        value="${v.masterSeq}"
                        ${v.masterSeq == screen.v.dataObj.masterSeq ? "selected": ""}
                        data-subject-code="${v.subjectCode}"
                        data-subject-type-code="${v.subjectTypeCode}"
                        data-subject-level-code="${v.subjectLevelCode}"
                        data-subject-revision-code="${v.subjectRevisionCode}"
                        >${v.textbookName}${author}</option>
                    `);
            });

            screen.v.dataObj.masterSeq = target.find('option:selected').val();

            screen.v.dataObj.depth = 0;
            screen.v.dataObj.unitSeq = 0;
            screen.v.callObj.tbInfo = true;

            await screen.c.getUnitListByDepth(null,screen.v.dataObj.depth);
        },

        // 대단원 데이터 바인딩
        bindBigUnitData : async()=>{
            screen.f.resetCallObj();

            const target = $('select[id="textbook_unit1_seq"]');
            if (target.children().length > 0) {
                screen.v.dataObj.unit1 = target.find('option:selected').val() ? target.find('option:selected').val() : 0;
                screen.v.dataObj.unitSeq = target.find('option:selected').val() ? target.find('option:selected').val() : 0;
            }
            target.empty();

            screen.v.unit1List.forEach(v=>{
                target.append(`
                    <option value="${v.unitSeq}" data-text="${v.unitName}">${v.unitName}</option>
                    `);
            });

            target.find(`option[value=${screen.v.dataObj.unit1}]`).prop('selected', true);

            screen.v.dataObj.unit1 = target.find('option:selected').val() ? target.find('option:selected').val() : 0;
            screen.v.dataObj.unitSeq = target.find('option:selected').val() ? target.find('option:selected').val() : 0;

            screen.v.dataObj.depth = 1;
            screen.v.callObj.bigUnit = true;
            await screen.c.getUnitListByDepth(null,screen.v.dataObj.depth);
        },


        // 중단원 데이터 바인딩
        bindMidUnitData : async()=>{

            screen.f.resetCallObj();

            const target = $('select[id="textbook_unit2_seq"]');
            if (target.children().length > 0) {
                screen.v.dataObj.unit2 = target.find('option:selected').val() ? target.find('option:selected').val() : 0;
                screen.v.dataObj.unitSeq = target.find('option:selected').val() ? target.find('option:selected').val() : 0;
            }
            target.empty();

            if(screen.v.unit2List.length === 0 ){
                target.css('display','none');
                $('span[aria-labelledby="select2-textbook_unit2_seq-container"]').css('display','none');
            }else {
                screen.v.unit2List.forEach(v => {
                    target.css('display','block');
                    $('span[aria-labelledby="select2-textbook_unit2_seq-container"]').css('display','block');

                    if (v.unitNumberName.indexOf('.') == -1 && v.unitNumberName != '') {
                        target.append(`
                        <option value="${v.unitSeq}">${v.unitNumberName}. ${v.unitName}</option>
                        `);
                    } else {
                        target.append(`
                        <option value="${v.unitSeq}">${v.unitNumberName} ${v.unitName}</option>
                        `);
                    }
                })
                screen.v.dataObj.unit2 !== 0 && screen.v.dataObj.unit2 !== ''?
                    target.find(`option[value=${screen.v.dataObj['unit2']}]`).prop('selected', true) : "";

                screen.v.dataObj.unit2 = target.find('option:selected').val() ? target.find('option:selected').val() : 0;
                screen.v.dataObj.unitSeq = target.find('option:selected').val() ? target.find('option:selected').val() : 0;

                screen.v.dataObj.depth = 2;
                screen.v.callObj.midUnit = true;
                await screen.c.getUnitListByDepth(null,screen.v.dataObj.depth);
            }
        },

        // 차시 데이터 바인딩
        bindChasiData : ()=>{
            screen.f.resetCallObj();

            console.log("차시 데이터 바인딩!!!",screen.v.sbList)
            const target = $('[id="textbook_subject_seq"]');
            const displaySelected = $('.select-button');
            target.empty();

            displaySelected.empty();

            screen.v.sbList.forEach((v,k) => {

                let pageInfo='';
                if(!_.isNil(v.textbookName)) pageInfo += v.textbookName;
                if(!_.isNil(v.textbookPage)) pageInfo += ` ${v.textbookPage}쪽`;
                if(!_.isNil(v.subTextbookName) && v.subTextbookName !== '' && !_.isNil(v.subTextbookPage)) pageInfo += ` / ${v.subTextbookName} ${v.subTextbookPage}쪽`;

                target.append(`
                        <li class="" name="chasi" value="${v.subjectSeq}">
                            <button type="button">
                                <span value="${v.subjectSeq}">${v.subjectName}</span>
                                <span class="badge type-rounded fill-light">${pageInfo!=='' && "(" + pageInfo + ")"}</span>
                            </button>
                        </li>
                    `);

                if (_.isNil(screen.v.dataObj.subjectSeq)) {
                    if(k === 0){
                        displaySelected.append(`
                                <span name="subject" value="${v.subjectSeq}">${v.subjectName}</span>
                                <span class="badge type-rounded fill-light">${pageInfo!==`` && "(" + pageInfo + ")"}</span>
                            `)
                    }
                } else {
                    if(screen.v.dataObj.subjectSeq == v.subjectSeq){
                        displaySelected.html(`
                            <span name="subject" value="${v.subjectSeq}">${v.subjectName}</span>
                            <span class="badge type-rounded fill-light">${pageInfo!==`` && "(" + pageInfo + ")"}</span>
                        `)
                    } else {
                        if(k === 0){
                            displaySelected.html(`
                                <span name="subject" value="${v.subjectSeq}">${v.subjectName}</span>
                                <span class="badge type-rounded fill-light">${pageInfo!==`` && "(" + pageInfo + ")"}</span>
                            `)
                        }
                    }
                }
            })
        },

        openTextbookPopup: async function (e) {
            e.preventDefault();

            if(screen.v.subjectLevelCode == 'ELEMENT') {
                // 학년, 학기 공통코드 호출
                await screen.f.setCombo();

                // '공통학년', '공통학기' 표시 안함
                $('select[name="combo-T05"]').find('option[value="00"]').remove();
                // $('select[name="combo-T06"]').find('option[value="00"]').remove();

                // 현재 학년, 학기 바인딩
                $('select[name="combo-T05"]').find(`option[value=${screen.v.currentTbFormObj['gradeCode']}]`).prop('selected',true);
                $('select[name="combo-T06"]').find(`option[value=${screen.v.currentTbFormObj['termCode']}]`).prop('selected',true);

                screen.v.tbOptions.gradeCode = screen.v.currentTbFormObj['gradeCode'];
                screen.v.tbOptions.termCode = screen.v.currentTbFormObj['termCode'];
            }

            screen.v.callObj.tbInfo = true;
            // 교과서 정보 바인딩
            screen.c.getTextbookList(screen.v.currentTbFormObj);
            screen.f.resetCallObj();

            $('.popup-container .subjectUnitDiv').addClass('hidden')
        },

        resetCallObj : function (){
            screen.v.callObj = {...screen.v.defaultCallObj};
        },

        changeTextbook: async function () {
            const selectedVal = $(this).val();
            const target = $(this).data('key');
            const data = {}
            console.log(`학년 학기 교과서 onChange : ${target} 변경됨!!!`);

            screen.v.tbOptions[target] = selectedVal;

            if(target === 'master'){ // 교과서를 변경할 경우
                data.masterSeq = selectedVal;
                data.depth = 0
                screen.v.dataObj.depth = 0;
                screen.v.callObj.tbInfo = true;
            }else if(target === 'unit1'){ // 대단원을 변경할 경우
                data.masterSeq = screen.v.dataObj.masterSeq;
                data.depth = 1
                data.unitSeq = selectedVal;
                screen.v.dataObj.depth = 1;
                screen.v.callObj.bigUnit = true;
            }else if(target === 'unit2'){ // 중단원을 변경할 경우
            }

            // 교과서 데이터 패치 //차시 데이터 패치
            await target !== 'unit2' ? await screen.c.getTextbookList(data) : '';
        },

        // 교과서 정보 변경한 경우 화면단 데이터
        setTotalTextbookInfo : function (data){
            // console.log("set total textbook info : ", data);
            console.log(data)
            $('#textbook-info-container ul').empty();

            if (screen.v.subjectLevelCode == 'ELEMENT') {
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.gradeCode}</li>`);
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.termCode}</li>`);
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.subjectCode}</li>`);
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.textbookUnit1Seq}</li>`);
            } else {
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.subjectCode}</li>`);
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.textbookUnit1Seq}</li>`);
                $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.textbookUnit2Seq}</li>`);
            }
            // $('#textbook-info-container ul').append(`<li class="text-black text-sm">${data.textbook_subject_seq}</li>`);

            // $('#textbook-info-container p.chasi-name').empty();
            // $('#textbook-info-container p.chasi-name').append(`
            //     <strong class="semi"> ${data.textbook_subject_seq}</strong>
            // `);
            //
            // $('#textbookText').text(data.textbook_main_sub);
        },

        // 등록할 데이터 세팅
        setParams : function (data){
            const formData = $('form#textbookSelectForm').serializeArray();
            const seqObj = {};

            formData.forEach(function(field) {
                if(field.name === 'combo-T05') field.name = 'gradeCode';
                if(field.name === 'combo-T06') field.name = 'termCode';
                seqObj[field.name] = field.value;
            });

            seqObj.masterSeq = screen.v.dataObj.masterSeq;
            seqObj.subjectCode = $('select#subject option:selected').data('subjectCode');
            seqObj.subjectLevelCode = $('select#subject option:selected').data('subjectLevelCode');
            seqObj.subjectRevisionCode = $('select#subject option:selected').data('subjectRevisionCode');
            seqObj.subjectTypeCode = $('select#subject option:selected').data('subjectTypeCode');
            seqObj.textbookSeq = $('select#subject option:selected').val();
            seqObj.textbookSubjectSeq = screen.v.dataObj.subjectSeq;

            screen.v.currentTbFormObj = seqObj; // 저장시 보낼 객체
            screen.v.dataObj.gradeCode = seqObj.gradeCode
            screen.v.dataObj.termCode = seqObj.termCode
            console.log("사용자가 저장한 교과서 정보",screen.v.currentTbFormObj);
        },

        procTextBook: async function (e){
            e.preventDefault();

            const formObject = {};

            // inner text
            $('form#textbookSelectForm select').map( function() {
                let name = $(this).attr('name');
                const value = $(this).find('option:selected').text();

                if(name === 'combo-T05') name = "gradeCode";
                if(name === 'combo-T06') name = "termCode";

                return formObject[name] = value;
            });

            // formObject.textbook_subject_seq = $('button.select-button span:eq(0)').text(); // 차시 value
            formObject.textbook_main_sub = $('button.select-button span:eq(1)').text(); // 주,부교과서 value
            screen.v.dataObj.subjectSeq = $('button.select-button span:eq(0)').attr('value')

            const targetDiv = $(this).data('targetDiv');
            $(`#${targetDiv}`).css('display', 'none');

            // 선택한 데이터 화면단 그려주기
            await screen.f.setTotalTextbookInfo(formObject);

            // 선택한 데이터 객체 담기
            await screen.f.setParams();

            $('#select-tex-info').removeClass('display-show')
        },
        // ==================================== !연계교과 관련! ====================================


        insertAttachFile: function(e) {
            // 파일 데이터 저장
            let files = e.currentTarget.files

            let maxSize = 50 * 1024 * 1024;
            console.log(files)
            // 파일 확장자 검사
            let validExtensions = ['jpg','png','bmp','jpeg','mp4','mp3','hwp','doc','docx','ppt','pptx','pdf','xls','xlsx','zip'];  // 허용되는 확장자
            console.log(files.length + $('.fileItem').length)
            if(files.length + $('.fileItem').length > 10) {
                return $alert.open("MG00063");
            }

            // 파일 크기 검사
            Array.from(files).forEach((file, index) => {
                let fileName = file.name;
                let fileExtension = fileName.split('.').pop().toLowerCase();
                if (!validExtensions.includes(fileExtension)) {
                    e.target.value = '';
                    return $alert.open('MG00064');
                }

                if (file.size > maxSize) {
                    e.target.value = '';
                    console.log(e);
                    return $alert.open("MG00065");
                }

                // 파일 배열에 담기
                let reader = new FileReader();
                reader.onload = function (e) {
                    console.log(e);
                    screen.v.attachFileList.push({
                        fileId: null,
                        fileInfo: file,
                    });
                };
                reader.readAsDataURL(file);

                screen.f.appendFileForm('', '', fileName)

            })

        },

        appendFileForm: (fileId, groupId, fileName) => {
            let html = `
                <div class="item fileItem">
                    <span>${fileName}</span>
                    <button type="button" class="button size-md type-gray" name="delAttachFileBtn">삭제</button>
                </div>
            `

            $('.file-items').append(html);
        },

        deleteAttachFile: (e) => {
            if ($(e.currentTarget).parent().children('#attachFileId').val() != null
                && $(e.currentTarget).parent().children('#attachFileId').val() !== '') {
                screen.v.delAttachFileId =
                    screen.v.delAttachFileId == null ?
                        $(e.currentTarget).parent().children('#attachFileId').val() :
                        screen.v.delAttachFileId + ',' + $(e.currentTarget).parent().children('#attachFileId').val()
                screen.v.delAttachGroupId =
                    screen.v.delAttachGroupId == null ?
                        $(e.currentTarget).parent().children('#attachGroupId').val() :
                        screen.v.delAttachGroupId + ',' + $(e.currentTarget).parent().children('#attachGroupId').val()
            } else {
                screen.v.attachFileList.forEach((item, index) => {
                    console.log(item.fileInfo.name, $(e.currentTarget).parent().children('span').text())
                    if (item.fileInfo.name === $(e.currentTarget).parent().children('span').text()) {
                        screen.v.attachFileList.splice(index, 1);
                    }

                })

            }

            $(e.currentTarget).parent().remove();
        },

        insertImage: (e) => {
            let fileName = e.currentTarget.files[0].name;

            // 파일 데이터 저장
            let file = e.currentTarget.files[0];
            let maxSize = 10 * 1024 * 1024;

            // 파일 확장자 검사
            let validExtensions = ['jpg', 'jpeg', 'png', 'bmp'];  // 허용되는 확장자
            let fileExtension = fileName.split('.').pop().toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                e.target.value = '';
                return $alert.open("MG00063");
            }

            // 파일 크기 검사
            if (file.size > maxSize) {
                e.target.value = '';
                console.log(e);
                return $alert.open("MG00065");
            }

            // 파일 배열에 담기
            let reader = new FileReader();
            reader.onload = function (e) {
                console.log(e);
                // 화면에 이미지 그리기
                const imageRender = `<img src="${e.target.result}"  alt=""/>`;
                $('.image-wrap').html('');
                $('.image-wrap').append(imageRender);
                screen.v.imageFile.info = file;
            };
            reader.readAsDataURL(file);

            // 화면제어
            $('.image-wrap').removeClass('hidden')
            $('.button-wrap').removeClass('hidden')
        },

        changeFile: (e) => {
            screen.f.deleteImage(e);
            screen.f.insertImage(e);
        },

        deleteImage: (e) => {
            screen.v.imageFile.id = null
            screen.v.imageFile.info = null
            screen.v.delImageFileId = $('#imageFileId').val()
            screen.v.delImageGroupId = $('#imageGroupId').val()

            // 화면제어
            $('.image-wrap').addClass('hidden')
            $('.button-wrap').addClass('hidden')
        },

        setFormData: () => {
            let formData = new FormData();

            formData.append('shareSeq', screen.v.shareSeq)
            formData.append('subjectLevelCode', screen.v.subjectLevelCode)
            formData.append('tab', screen.v.tab)

            formData.append('gradeCode', screen.v.gradeCode)
            formData.append('termCode', screen.v.termCode)
            formData.append('subjectCode', screen.v.subjectCode)
            formData.append('unitCode', screen.v.unitCode)

            formData.append('title', $('input[name=title]').val())

            formData.append('content', screen.v.editor.getById["content"].getIR());

            screen.v.tagStr = ''
            $('input[name=tag]').each((idx, item) => {
                console.log(item)
                screen.v.tagStr += item.value + ';'
            })
            formData.append('tagStr', screen.v.tagStr)

            formData.append('imageFileId', screen.v.imageFile.id)
            formData.append('imageFileInfo', screen.v.imageFile.info)
            formData.append('delImageFileId', screen.v.delImageFileId)
            formData.append('delImageGroupId', screen.v.delImageGroupId)

            screen.v.attachFileList.forEach((file, index) => {
                formData.append('attachFileId', screen.v.attachFileList[index].fileId);
                formData.append('attachFileInfo', file.fileInfo);
            })
            formData.append('delAttachFileId', screen.v.delAttachFileId);
            formData.append('delAttachGroupId', screen.v.delAttachGroupId);

            if(screen.v.tab == '01') {
                formData.append('textbookGradeCode', screen.v.currentTbFormObj.gradeCode !== undefined ? screen.v.currentTbFormObj.gradeCode : '');
                formData.append('textbookMasterSeq', screen.v.currentTbFormObj.masterSeq !== undefined ? screen.v.currentTbFormObj.masterSeq : '');
                formData.append('textbookSubjectCode', screen.v.currentTbFormObj.subjectCode !== undefined ? screen.v.currentTbFormObj.subjectCode : '');
                formData.append('textbookSubjectLevelCode', screen.v.currentTbFormObj.subjectLevelCode !== undefined ? screen.v.currentTbFormObj.subjectLevelCode : '');
                formData.append('textbookSubjectRevisionCode', screen.v.currentTbFormObj.subjectRevisionCode !== undefined ? screen.v.currentTbFormObj.subjectRevisionCode : '');
                formData.append('textbookSubjectTypeCode', screen.v.currentTbFormObj.subjectTypeCode !== undefined ? screen.v.currentTbFormObj.subjectTypeCode : '');
                formData.append('textbookTermCode', screen.v.currentTbFormObj.termCode !== undefined ? screen.v.currentTbFormObj.termCode : '');
                formData.append('textbookSeq', screen.v.currentTbFormObj.textbookSeq !== undefined ? screen.v.currentTbFormObj.textbookSeq : '');
                formData.append('textbookSubjectSeq', screen.v.currentTbFormObj.textbookSubjectSeq !== undefined ? screen.v.currentTbFormObj.textbookSubjectSeq : '');
                formData.append('textbookUnit1Seq', screen.v.currentTbFormObj.textbookUnit1Seq !== undefined ? screen.v.currentTbFormObj.textbookUnit1Seq : '');
                formData.append('textbookUnit2Seq', screen.v.currentTbFormObj.textbookUnit2Seq !== undefined ? screen.v.currentTbFormObj.textbookUnit2Seq : '');
                formData.append('textbookUnit3Seq', screen.v.currentTbFormObj.textbookUnit3Seq !== undefined ? screen.v.currentTbFormObj.textbookUnit3Seq : '');
            } else if (screen.v.tab == '04') {
                formData.append('categoryCode2', screen.v.categoryCode2)
            } else {
                formData.append('categoryCode1', screen.v.categoryCode1)
            }

            return formData;
        },

        checkValid: () => {
            if (screen.v.tab == '01') {
                if (screen.v.subjectLevelCode == 'ELEMENT') {
                    if (screen.v.gradeCode == '' || screen.v.gradeCode == undefined) {
                        return false;
                    }
                    if (screen.v.termCode == '' || screen.v.termCode == undefined) {
                        return false;
                    }
                    if (screen.v.subjectCode == '' || screen.v.subjectCode == undefined) {
                        return false;
                    }
                    if (screen.v.unitCode == '' || screen.v.unitCode == undefined) {
                        return false;
                    }
                } else {
                    if (screen.v.subjectCode == '' || screen.v.subjectCode == undefined) {
                        return false;
                    }
                }
            } else if (screen.v.tab == '04') {
                if (screen.v.categoryCode2 == '' || screen.v.categoryCode2 == undefined) {
                    return false;
                }
            } else {
                if (screen.v.categoryCode1 == '' || screen.v.categoryCode1 == undefined) {
                    return false;
                }
            }

            /* 24.04.08 초등_연계교과 필수체크 제거 */
            if (screen.v.subjectLevelCode != 'ELEMENT'  && $('#textbookText').length > 0) {
                return false;
            }

            if ($('input[name=title]').val() == '') {
                return false;
            }

            $('#content').val(screen.v.editor.getById['content'].getIR());

            if ($('#content').val() == '' || $('#content').val() == '<p><br></p>') {
                return false;
            }

            return true;
        },

        saveShare: () => {
            screen.v.subjectCode = $('input[name=subjectCode]:checked').val()
            screen.v.gradeCode = $('input[name=gradeCode]:checked').val()
            screen.v.termCode = $('input[name=termCode]:checked').val()
            screen.v.unitCode = $('input[name=unitCode]:checked').val() || '';
            if (screen.v.tab == '04') {
                screen.v.categoryCode2 = $('input[name=categoryCode2]:checked').val()
            } else if (screen.v.tab != '01' && screen.v.tab != '04') {
                screen.v.categoryCode1 = $('input[name=categoryCode1]:checked').val()
            }

            console.log(screen.v.subjectCode)

            let isValid = screen.f.checkValid()

            if(!isValid) {
                $alert.open('MG00020')
                return;
            }

            if (screen.v.shareSeq == null || screen.v.shareSeq == '') {
                if (!$('#ox2').is(':checked')) {
                    $alert.open('MG00078')
                    return;
                }
            }

            let param = screen.f.setFormData();

            console.log(param)

            if (screen.v.shareSeq == null || screen.v.shareSeq == '') {
                $.ajax({
                    type: "POST",
                    url: "/pages/api/live/dataShare/insertDataShare.ax",
                    data: param,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.resultCode == '0000') {
                            alert('등록되었습니다.')
                            screen.f.goBack()
                        } else {
                            alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                        }
                    },
                    error: function () { //시스템에러
                        alert("오류발생");
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: "/pages/api/live/dataShare/updateDataShare.ax",
                    data: param,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.resultCode == '0000') {
                            alert('수정되었습니다.')
                            screen.f.goBack()
                        } else {
                            alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                        }
                    },
                    error: function () { //시스템에러
                        alert("오류발생");
                    }
                });
            }
        },

        goBack: () => {
            if (screen.v.shareSeq != null && screen.v.shareSeq != '') {
                location.href = `./detail.mrn?seq=${screen.v.shareSeq}&tab=${screen.v.tab}`
            } else {
                location.href = `./Main.mrn`
            }
        },

    },

    event: function () {
        // ==================================== 연계교과 관련 ====================================
        $(document).on('click','[target-obj=select-tex-info]', screen.f.openTextbookPopup)

        // 교과 선택 팝업 - 학년 학기 교과서 onChange
        $('form#textbookSelectForm').on('change','select', screen.f.changeTextbook)

        // 차시 변경시
        $('form#textbookSelectForm div.dropdown-select div.options ul').delegate('li','click',function(e){
            screen.v.currentTbFormObj.subjectSeq = e.currentTarget.value;
            screen.v.dataObj.subjectSeq = e.currentTarget.value;
        })

        // 폼 닫기 버튼 클릭
        $('#select-tex-info').on('click','[close-obj]',function (e){
            e.preventDefault();

            const targetDiv = $(this).data('targetDiv');
            $(`#${targetDiv}`).css('display', 'none');
        })

        // 교과서 변경 확인 버튼 클릭
        $('form#textbookSelectForm').on('click','button[name=changeTextbookBtn]', screen.f.procTextBook)
        // ==================================== !연계교과 관련! ====================================


        $(document).on('click', 'button[name=saveShareBtn]', screen.f.saveShare)


        // 첨부파일 등록
        $(document).on('change', 'input[type=file][name=attachFile]', screen.f.insertAttachFile)

        // 파일 삭제
        $(document).on('click', 'button[name=delAttachFileBtn]', screen.f.deleteAttachFile)

        // 이미지 등록
        $(document).on('change', '[name=image]', screen.f.changeFile);

        // 이미지 삭제
        $(document).on('click', 'button[name=delImageBtn]', screen.f.deleteImage);
    },

    init: function () {
        screen.v.subjectLevelCode = $("#subjectLevelCode").val();
        screen.v.subjectLevelPath = $("#subjectLevelPath").val();
        screen.v.tab = $("#tab").val();
        screen.v.shareSeq = $('#shareSeq').val();
        screen.v.subjectCode = $('#subjectCode').val();
        screen.v.termCode = $('#termCode').val();
        screen.v.gradeCode = $('#gradeCode').val();
        screen.v.categoryCode1 = $('#categoryCode1').val();
        screen.v.unitCode = $('#unitCode').val();

        screen.v.content = $('#content').val();

        if (screen.v.shareSeq != null && screen.v.shareSeq != '') {
            screen.v.dataObj.masterSeq = $('input[name=textbookSeq]').val()
            screen.v.dataObj.gradeCode = $('input[name=textbookGradeCode]').val()
            screen.v.dataObj.termCode = $('input[name=textbookTermCode]').val()

            screen.v.dataObj.unit3 = $('input[name=textbookUnit3Seq]').val()
            screen.v.dataObj.unit2 = $('input[name=textbookUnit2Seq]').val()
            screen.v.dataObj.unit1 = $('input[name=textbookUnit1Seq]').val()
            if ($('input[name=textbookUnit3Seq]').val() != '') {
                screen.v.dataObj.unitSeq = $('input[name=textbookUnit3Seq]').val()
                screen.v.dataObj.depth = 2
            } else if ($('input[name=textbookUnit2Seq]').val() != '') {
                screen.v.dataObj.unitSeq = $('input[name=textbookUnit2Seq]').val()
                screen.v.dataObj.depth = 1
            } else if ($('input[name=textbookUnit1Seq]').val() != '') {
                screen.v.dataObj.unitSeq = $('input[name=textbookUnit1Seq]').val()
                screen.v.dataObj.depth = 0
            }
            screen.v.dataObj.subjectSeq = $('input[name=textbookSubjectSeq]').val()

            screen.v.currentTbFormObj = screen.v.dataObj;
        }

        screen.c.getDataShareTagList();

        nhn.husky.EZCreator.createInIFrame({
            oAppRef: screen.v.editor,
            elPlaceHolder: 'content',
            sSkinURI: "/assets/plugins/custom/smartEditor2/SmartEditor2Skin.html",
            htParams: {
                bUseToolbar: true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                bUseVerticalResizer: true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                bUseModeChanger: true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                fOnBeforeUnload: function () {
                    //alert("완료!");
                }
            }, //boolean
            fOnAppLoad: function () {
                //로딩이 완료된 후에 본문에 삽입되는 text
                //oEditors.getById["contents"].exec("PASTE_HTML", [$('#desc').html()]);
                screen.v.editor.getById['content'].setIR(screen.v.content)
            },
            fCreator: "createSEditor2"
        });

        screen.event();

        console.log('Main init!!')
    },
}


screen.init();
