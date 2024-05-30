let screen = {
    v: {
        subjectLevelCode: null,
        tab: null,
        isLogin: null,
        searchKey: '',
        searchText: '',
        searchSelf: '',
        searchOrder: '',
        subjectCode: '',
        gradeCode: '',
        unitCode: '',
        termCode: '',
        categoryCode1: '',
        categoryCode3: '',
        pagingNum: 10, // 페이징 limit
        searchCondition: {},
    },

    c: {
        getDataShareTagList: () => {
            let codeList = []
            let codeNameList = []

            screen.f.initState()
            screen.f.removeAllTag()

            if (screen.v.tab === '01') {
                if (screen.v.subjectLevelCode === 'ELEMENT') {
                    codeList = ['T05','T06','DS200','DS500']
                    codeNameList = ['학년','학기','과목','단원']
                } else {
                    codeList = ['DS200']
                    codeNameList = ['과목']
                }

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row
                    $('.filters').remove()

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], codeNameList[idx], idx + 1)
                    })

                    if (screen.v.subjectLevelCode === 'ELEMENT') {
                        $('[name=영역] input').each((idx, item) => {
                            if($(item).val().indexOf('E') < 0) {
                                if ($(item).val() !== '') {
                                    $(item).parent().remove()
                                }
                            }
                        })
                    } else if (screen.v.subjectLevelCode === 'MIDDLE') {
                        $('[name=영역] input').each((idx, item) => {
                            if($(item).val().indexOf('M') < 0) {
                                if ($(item).val() !== '') {
                                    $(item).parent().remove()
                                }
                            }
                        })
                    } else if (screen.v.subjectLevelCode === 'HIGH') {
                        $('[name=영역] input').each((idx, item) => {
                            if($(item).val().indexOf('H') < 0) {
                                if ($(item).val() !== '') {
                                    $(item).parent().remove()
                                }
                            }
                        })
                    }
                })
            } else if (screen.v.tab === '02') {
                codeList = ['DS400']
                codeNameList = ['주제']

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row
                    $('.filters').remove()

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], codeNameList[idx], idx + 1)
                    })

                    $('[name=주제] input').each((idx, item) => {
                        if($(item).val().indexOf('CM_') > -1) {
                            if ($(item).val() !== '') {
                                $(item).parent().remove()
                            }
                        }
                    })
                })
            } else if (screen.v.tab === '03') {
                codeList = ['DS400']
                codeNameList = ['주제']

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row
                    $('.filters').remove()

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], codeNameList[idx], idx + 1)
                    })

                    $('[name=주제] input').each((idx, item) => {
                        if($(item).val().indexOf('CE_') > -1) {
                            if ($(item).val() !== '') {
                                $(item).parent().remove()
                            }
                        }
                    })
                })
            } else if (screen.v.tab === '04') {
                codeList = ['A04']
                codeNameList = ['지역']

                $cmm.getCmmCd(codeList).then((res) => {
                    let tag = res.row
                    $('.filters').remove()

                    codeList.forEach((item, idx) => {
                        screen.f.setTagForm(tag[item], codeNameList[idx], idx + 1)
                    })

                })
            } else {
                alert('파라미터 오류입니다.');
                return;
            }


        },

        getDataShareSearchList: () => {
            screen.v.searchKey = $("#searchKey").val() || "";
            screen.v.searchText = $("input[name=searchText]").val();
            screen.v.gradeCode = '';
            screen.v.termCode = '';
            screen.v.subjectCode = '';
            screen.v.categoryCode1 = '';
            screen.v.categoryCode3 = '';
            screen.v.searchSelf = $('#searchSelf').is(':checked') ? 'Y' : 'N';
            screen.v.searchOrder = $('#sortMethod').val();

            $('.filters').find('input:checked').each((idx, item) => {
                let code = item.id.substring(item.id.indexOf('_') + 1)

                console.log(item.name);
                if (item.name === '학년') {
                    screen.v.gradeCode += code + ','
                } else if (item.name === '학기') {
                    screen.v.termCode += code + ','
                } else if (item.name === '과목') {
                    screen.v.subjectCode += code + ','
                } else if (item.name === '단원') {
                    screen.v.categoryCode3 += code + ','
                } else {
                    screen.v.categoryCode1 += code + ','
                }
            })

            $.ajax({
                method: "GET",
                url: `/pages/api/live/dataShare/getDataShareList.ax`,
                data: {
                    searchKey: screen.v.searchKey,
                    searchText: screen.v.searchText,
                    searchSelf: screen.v.searchSelf,
                    searchOrder: screen.v.searchOrder,
                    pagingNow: screen.v.searchCondition.pagingNow,
                    subjectLevelCode: screen.v.subjectLevelCode,
                    tab: screen.v.tab,
                    subjectCode: screen.v.subjectCode,
                    gradeCode: screen.v.gradeCode,
                    unitCode: screen.v.unitCode,
                    termCode: screen.v.termCode,
                    categoryCode1: screen.v.categoryCode1,
                    categoryCode3: screen.v.categoryCode3
                },
                dataType: 'html',
                success: (res) => {
                    if (res.status !== false) {
                        $('#list').html(res);
                        $('#sortMethod').select2({minimumResultsForSearch: Infinity})
                    } else {
                        alert('서버에러')
                    }
                },
                error: (e) => {
                    console.log(e)
                }
            })

        },

    },

    f: {
        initState: () => {
            //검색어
            $("input[name=searchText]").val("");
            $("#searchKey option:eq(0)").prop("selected", true);

            screen.v.searchKey = '';
            screen.v.searchText = '';
            screen.v.searchCondition = {};
            screen.v.termCode = '';
            screen.v.gradeCode = '';
            screen.v.subjectCode = '';
            screen.v.unitCode = '';
            screen.v.categoryCode1 = '';
            screen.v.categoryCode3 = '';
        },

        // 로그인 안내 alert
        loginAlert: () => {
            $alert.open("MG00001", () => {});
        },

        // 정회원 교사만 사용 가능 alert
        needAuthAlert: () => {
            $alert.open("MG00011", () => {});
        },

        checkValidation: (requiredFields) => {
            let isValid = true;

            // 각 필드를 순회하면서 값이 비어있는지 확인
            for (let i = 0; i < requiredFields.length; i++) {
                let fieldId = requiredFields[i];
                let fieldValue = document.getElementById(fieldId).value.trim();

                if (fieldValue === '') {
                    alert('필수 입력 항목을 모두 작성해주세요.');
                    isValid = false;
                    break; // 하나라도 비어있으면 더 이상 검증하지 않고 종료
                }
            }
            return isValid;
        },

        // 페이징
        setPaging: (e) => {
            const pagingNow = e.currentTarget.value;

            screen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;

            screen.c.getDataShareSearchList(pagingNow);
        },

        setTagForm: (tagData, tabName, index) => {
            let titleHtml = '';
            let tagHtml = '';

            titleHtml = `
                <!-- 카테고리 하나 -->
                <div class="filters">
                    <strong class="title">${tabName}</strong>
                    <div class="ox-group" name="${tabName}">
                    
                    </div>
                </div>
                <!-- 카테고리 하나 -->
            `
            $('#tagIconDiv').before(titleHtml)

            tagData.forEach((item, idx) => {
                tagHtml = `
                    <!-- 아이템 하나 -->
                    <span class="ox">
                        <input type="checkbox" id="ox-filter${index}_${item.commonCode}" name="${tabName}" value="${item.commonCode}">
                        <label for="ox-filter${index}_${item.commonCode}">${item.name}</label>
                    </span>
                    <!-- 아이템 하나 -->
                `
                $(`div[name=${tabName}]`).append(tagHtml)

            })
        },

        // 카테고리 검색 전체 해제
        disableAllCategory: () => {
            // 데이터 초기화
            screen.v.searchCondition = {};

            // 체크박스 초기화
            // $('input[name^=category]').prop("checked", false).trigger('change');
            // 전체 해제시에 체크박스 하나당 ajax호출되는 문제 방지, 마지막 체크박스 해제시에만 트리거 적용
            const $categoryList = $("input[name^=category]");

            for (let i = 0; i < $categoryList.length; i++) {
                $($categoryList[i]).prop("checked", false);
                if (i === $categoryList.length - 1) $($categoryList[i]).prop("checked", false).trigger("change");
            }

            // 태그 초기화
            $("div[name=categoryTagArea]").empty();
        },

        // 검색 버튼
        clickSearchBtn: (e) => {
            e.preventDefault()
            screen.c.getDataShareSearchList();
        },

        setPage: (e) => {
            screen.f.initState();

            screen.v.tab = e.currentTarget.id
            $('#tab').val(e.currentTarget.id)
            screen.c.getDataShareTagList();
            // screen.c.getDataShareSearchList();
        },

        clickTag: (e) => {
            let $el = $(e.currentTarget)
            let id = $el[0].id

            console.log($el)

            if ($el.is(':checked')) {
                console.log('체크 됨')

                let selectTag = `
                    <span class="item" id="${id}"> ${$el.closest('span').text()} 
                        <button type="button" class="button size-xs type-text type-icon" name="delTagBtn">
                            <svg>
                                <title>아이콘 삭제</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
                            </svg>
                        </button>
                    </span>
                `

                $('#selectTagDiv').append(selectTag)
            } else {
                console.log('체크 안됨')

                $('#selectTagDiv').find(`#${id}`).remove()
            }
            screen.c.getDataShareSearchList();
        },

        removeTag: (e) => {
            let $el = $(e.currentTarget)
            let id = $el.parent()[0].id
            console.log($el.parent()[0])

            $(`.ox-group .ox #${id}`).prop('checked', false)
            $('#selectTagDiv').find(`#${id}`).remove()
            screen.c.getDataShareSearchList();
        },

        removeAllTag: () => {
            $(`.ox-group .ox input`).prop('checked', false)
            $('#selectTagDiv').empty()
            screen.c.getDataShareSearchList();
        },

        clickLikeBtn: (e) => {
            let $el = $(e.currentTarget)
            let targetSeq = $el.closest('.item').find('[name=shareSeq]').val()

            let param = new FormData();

            param.append('referenceSeq', targetSeq)
            param.append('scrapType', "DATASHARE-LIKE")

            if ($isLogin) {
                $.ajax({
                    type: "POST",
                    url: "/pages/api/live/dataShare/setLike.ax",
                    data: param,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.resultCode == '0000') {
                            $el.find('#likeCnt').text(res.returnInt)

                            if(res.resultMsg == 'D') {
                                $alert.open('MG00056')
                            } else if (res.resultMsg == 'A') {
                                $alert.open('MG00055')
                            }

                            if ($el.hasClass('active')) {
                                $el.removeClass('active')
                            } else {
                                $el.addClass('active')
                            }

                        } else {
                            alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                        }
                    },
                    error: function () { //시스템에러
                        alert("오류발생");
                    }
                });
            } else {
                screen.f.loginAlert();
            }
        },

        clickScrapBtn: (e) => {
            let $el = $(e.currentTarget)
            let targetSeq = $el.closest('.item').find('[name=shareSeq]').val()

            let param = new FormData();

            param.append('referenceSeq', targetSeq)
            param.append('scrapType', "DATASHARE")

            $.ajax({
                type: "POST",
                url: "/pages/api/live/dataShare/setLike.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {

                        if(res.resultMsg == 'D') {
                            $alert.open('MG00042')
                        } else if (res.resultMsg == 'A') {
                            $alert.open('MG00041')
                        }

                        if ($el.hasClass('active')) {
                            $el.removeClass('active')
                        } else {
                            $el.addClass('active')
                        }
                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
        },

        /**
         * 공유하기
         * @param {*} e
         * @returns
         */
        shareCheck: (e) => {
            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                $alert.open('MG00001');
                $('#popup-share-sns').css('display', 'none');
                return;
            }

            if (isRight) {
                let seq = $(e.currentTarget).closest('.item').find('input').val()
                let tab = $('#tab').val()
                let protocol = window.location.protocol
                let hostUri = window.location.host
                let subjectLevel = screen.v.subjectLevelCode == 'ELEMENT' ? 'ele' : (screen.v.subjectLevelCode == 'MIDDLE' ? 'mid' : 'high')
                let url = `${protocol}//${hostUri}/pages/live/${subjectLevel}/dataShare/detail.mrn?tab=${tab}&seq=${seq}`

                $('input[name=hrefName]').val(url)
                $('#popup-share-sns').css('display', 'block');
            } else {
                $alert.open('MG00047');
                $('#popup-share-sns').css('display', 'none');
                return;
            }
        },

        scrapCheck: (e) => {
            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                $alert.open('MG00001');
                return;
            }

            if (isRight) {
                screen.f.clickScrapBtn(e)
            } else {
                $alert.open('MG00047');
                $('#popup-share-sns').css('display', 'none');
                return;
            }
        },

        checkRight: () => {
            let isRight = false;

            if ($('#userGrade').val() === "002") {
                isRight = true;
            }

            return isRight
        },

        goDetailPage: (e) => {
            if (!$isLogin) {
                $alert.open('MG00001');
                return;
            }
            if (!screen.f.checkRight()) {
                $alert.open('MG00047');
                return;
            };

            let seq = $(e.currentTarget).find('input').val()
            let tab = $('#tab').val()

            let param = new FormData();
            param.append("shareSeq", seq)

            $.ajax({
                type: "POST",
                url: "/pages/api/live/dataShare/updateHitCnt.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {

                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
            window.location.href = `./detail.mrn?tab=${tab}&seq=${seq}`
        },

        goCreatePage: () => {
            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                $alert.open('MG00001');
                return;
            }

            if (isRight) {
                location.href = `./create.mrn?tab=${screen.v.tab}`
            } else {
                $alert.open('MG00047');
                return;
            }
        },

        searchSelf: (e) => {
            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                e.preventDefault()
                $('#searchSelf').prop(':checked', false)
                $alert.open('MG00001');
                return;
            } else {
                screen.c.getDataShareSearchList()

            }
        },

        searchEnter: (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                screen.c.getDataShareSearchList()
            }
        },
    },

    event: function () {
        // 탭 변경
        $('#categoryTab li').on("click", screen.f.setPage);

        // 태그삭제
        $(document).on("click", "button[name=delTagBtn]", screen.f.removeTag);

        // 카테고리 전체해제
        $(document).on("click", "#clearTagBtn", screen.f.removeAllTag);

        // 카테고리 선택
        $(document).on("click", ".ox-group .ox input[id^=ox-filter]", screen.f.clickTag)

        // 검색
        $(document).on("click", 'button[name=searchBtn]', screen.f.clickSearchBtn);

        // 페이징
        $(document).on("click", 'button[name=pagingNow]', screen.f.setPaging);

        $(document).on("change", '#sortMethod', screen.c.getDataShareSearchList);

        $(document).on("click", 'button[name=btnScrap]', screen.f.scrapCheck);

        $(document).on("click", 'button[name=btnShare]', screen.f.shareCheck);

        $(document).on("click", 'button[name=btnLike]', screen.f.clickLikeBtn);

        $(document).on("click", '.pageBtn', screen.f.goDetailPage);

        $(document).on("click", 'button[name=createDataShare]', screen.f.goCreatePage);

        $(document).on("keypress", 'input[name=searchText]', screen.f.searchEnter);

        $(document).on("click", '#searchSelf', screen.f.searchSelf);

    },

    init: function () {
        console.log('Main init start!!')
        screen.v.subjectLevelCode = $("#subjectLevelCode").val();
        screen.v.tab = $("#tab").val();

        screen.c.getDataShareTagList();

        screen.event();

        console.log('Main init success!!')
    },
};

screen.init();


let $ttbdAjax = screen.c;
