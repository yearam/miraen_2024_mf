let screen = {
    v: {

    },

    c: {


    },

    f: {
        // 로그인 안내 alert
        loginAlert: () => {
            $alert.open("MG00001", () => {});
        },

        // 정회원 교사만 사용 가능 alert
        needAuthAlert: () => {
            $alert.open("MG00011", () => {});
        },

        saveReview: () => {
            let requiredFields = ['reviewContent'];

            let isValid = screen.f.checkValidation(requiredFields);
            if(!isValid) return;
            if(!$('#ox1').is(':checked')) {
                alert('개인정보 수집 및 활용 동의에 동의해주세요.')
                return;
            }

            // 팝업 열기 코드
            screenReviewParticModal.f.open();
        },

        savePeople: () => {
            let requiredFields = ['recommendName', 'recommendPhone', 'recommendContent'];

            let isValid = screen.f.checkValidation(requiredFields);
            if(!isValid) return;
            if(!$('#ox2').is(':checked')) {
                alert('개인정보 수집 및 활용 동의에 동의해주세요.')
                return;
            }


            let param = new FormData();

            param.append("contentSeq", $('input[name=contentSeq]').val())
            param.append("innovationSeq", $('input[name=innovationSeq]').val())
            param.append("recommendName", $('input[name=recommendName]').val())
            param.append("recommendPhone", $('input[name=recommendPhone]').val())
            param.append("recommendContent", $('textarea[name=recommendContent]').val())
            param.append("agreeYn", $('#ox2').is(':checked') ? 'Y' : 'N')

            $.ajax({
                type: "POST",
                url: "/pages/api/live/innovation/savePeople.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {
                        alert('커버피플추천이 완료되었습니다.')
                        window.location.reload()
                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
        },

        saveSuggest: () => {
            let requiredFields = ['suggestContent'];

            let isValid = screen.f.checkValidation(requiredFields);
            if(!isValid) return;

            let param = new FormData();

            param.append("contentSeq", $('input[name=contentSeq]').val())
            param.append("innovationSeq", $('input[name=innovationSeq]').val())
            param.append("suggestContent", $('textarea[name=suggestContent]').val())

            $.ajax({
                type: "POST",
                url: "/pages/api/live/innovation/saveSuggest.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {
                        alert('기자 제안이 완료되었습니다.')
                        window.location.reload()
                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
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

        getYearsInnovation: (year) => {
            const urlParams = new URL(location.href).searchParams;

            const schoolLevel = urlParams.get('schoolLevel');

            $.ajax({
                method: "GET",
                url: '/pages/api/live/innovation/getInnovationListByYear.ax',
                data: {
                    'year': year,
                    'schoolLevel': schoolLevel
                },
                success: function (res) {
                    $('#innovationDiv').html('');

                    if (res.resultMsg == 'S') {
                        let data = res.rows;

                        if(data.length > 0) {
                            let innovationWrap = `
                                <div id="tab3-1" class="pane display-show" name="innovationWrap">
                                    <div class="webzine-items">
                                    </div>
                                </div>`

                            $('#innovationDiv').append(innovationWrap);

                            data.forEach((item, idx) => {
                                console.log(item)
                                let html = ''
                                if (item.contentType == 'SELF') {
                                    html = `
                                        <div class="item">
                                            <a href="./Main.mrn?schoolLevel=${schoolLevel}&seq=${item.innovationSeq}">
                                                <div class="image-wrap">
                                                    <img src="/pages/api/file/view/${item.pcImageFileId}" alt="${item.title}">
                                                </div>
                                                <div class="split-container">
                                                    <div class="badges">
                                                        <span class="badge size-sm type-round-box\ttext-secondary">${item.year} ${item.seasonName}</span>
                                                        <span class="badge size-sm type-round-box\ttext-green">Vol.${item.vol}</span>
                                                    </div>
                                                    <strong class="text-black text-md">${item.title}</strong>
                                                </div>
                                            </a>
                                            <div class="buttons">
                                                <button class="${item.ebookLink != null && item.ebookLink != '' && item.ebookLink != 'null' ? 'button size-lg type-secondary' : 'button size-lg type-secondary display-hide'}"
                                                        name="btnEBook"
                                                        data-path="${item.ebookLink}"
                                                        data-target="${item.ebookLinkType}"
                                                        >
                                                    <svg>
                                                        <title>아이콘 E-Book 보기</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                                    </svg>
                                                    E-Book 보기
                                                </button>
                                                <button class="${item.pdfFileId != null && item.pdfFileId != '' && item.pdfFileId != 'null' ? 'button size-lg type-third' : 'button size-lg type-third display-hide'}"
                                                        name="btnPDFDownload"
                                                        data-path="/pages/api/file/down/${item.pdfFileId}"
                                                        >
                                                    <svg>
                                                        <title>아이콘 다운로드</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                    PDF 다운로드
                                                </button>
                                            </div>
                                        </div>
                                        `
                                } else {
                                    html = `
                                        <div class="item">
                                            <a href="${item.detailLink}" target="${item.detailLinkType == 'NEW' ? '_new' : '_self'}">
                                                <div class="image-wrap">
                                                    <img src="/pages/api/file/view/${item.pcImageFileId}" alt="${item.title}">
                                                </div>
                                                <div class="split-container">
                                                    <div class="badges">
                                                        <span class="badge size-sm type-round-box\ttext-secondary">${item.year} ${item.seasonName}</span>
                                                        <span class="badge size-sm type-round-box\ttext-green">Vol.${item.vol}</span>
                                                    </div>
                                                    <strong class="text-black text-md">${item.title}</strong>
                                                </div>
                                            </a>
                                            <div class="buttons">
                                                <button class="${item.ebookLink != null && item.ebookLink != '' && item.ebookLink != 'null' ? 'button size-lg type-secondary' : 'button size-lg type-secondary display-hide'}"
                                                        name="btnEBook"
                                                        data-path="${item.ebookLink}"
                                                        data-target="${item.ebookLinkType}"
                                                        >
                                                    <svg>
                                                        <title>아이콘 E-Book 보기</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                                                    </svg>
                                                    E-Book 보기
                                                </button>
                                                <button class="${item.pdfFileId != null && item.pdfFileId != '' && item.pdfFileId != 'null' ? 'button size-lg type-third' : 'button size-lg type-third display-hide'}"
                                                        name="btnPDFDownload"
                                                        data-path="/pages/api/file/down/${item.pdfFileId}"
                                                        >
                                                    <svg>
                                                        <title>아이콘 다운로드</title>
                                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                                                    </svg>
                                                    PDF 다운로드
                                                </button>
                                            </div>
                                        </div>`
                                }

                                $('.webzine-items').append(html)
                            })

                        } else {
                            let noDataWrap = `
                                <div id="tab3-2" class="pane display-show">
                                    <div class="box-no-data"> 등록된 자료가 없습니다.</div>
                                </div>`

                            $('#innovationDiv').append(noDataWrap);
                        }

                        screen.event();
                    }
                },
                error: function (error) {
                    console.log("Get years innovation error : " + error)
                }
            })
        },
    },

    event: function () {
        $('button[name=btnEBook]').off('click').on('click', function (e) {
            e.preventDefault();
            if ($isLogin) {
                let ebookPath = $(this).data('path');
                let ebookLinkType = $(this).data('target');
                window.open(ebookPath, ebookLinkType);
            } else {
                screen.f.loginAlert();
            }
        });

        $('button[name=btnPDFDownload]').off('click').on('click', function (e) {
            e.preventDefault();
            if ($isLogin) {
                let path = $(this).data('path');
                let link = document.createElement('a');
                link.target = '_blank';
                link.href = path;
                link.click();
                link.remove();
            } else {
                screen.f.loginAlert();
            }
        });

        $('button[name=btnSave]').off('click').on('click', function () {
            if ($isLogin) {
                let target = $('#selectTab .active a')[0].id

                if(target == 'review') {
                    screen.f.saveReview();
                } else if (target == 'people') {
                    screen.f.savePeople();
                } else if (target == 'suggest') {
                    screen.f.saveSuggest();
                }
            } else {
                screen.f.loginAlert();
            }
        })

        $('li[name=webzineYearList]').off('click').on('click', function () {
            let _el = $(this)

            screen.f.getYearsInnovation(_el.val());

        })

        $('button[name=btnLike]').off('click').on('click', function () {
            let $el = $(this)

            if ($isLogin) {
                let param = new FormData();

                param.append('referenceSeq', $el.val())
                param.append('scrapType', 'WEBZINE-LIKE')

                $.ajax({
                    type: "POST",
                    url: "/pages/api/live/innovation/setLike.ax",
                    data: param,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.resultCode == '0000') {
                            $el.find('.likeCnt').text(res.returnInt)

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
        })

        $('a[name=webzineLink]').off('click').on('click', function () {
            let $el = $(this)

            if ($isLogin) {
                let path = $el.data('path');
                let link = document.createElement('a');
                link.target = `_${$el.data('target')}`;
                link.href = path;
                link.click();
                link.remove();
            } else {
                screen.f.loginAlert();
            }
        })
    },

    init: function () {
        screen.f.getYearsInnovation($('li[name=webzineYearList]').val());

        screen.event();

        console.log('Main init!!')
    },
};

screen.init();


let $ttbdAjax = screen.c;
