$(function () {
    let textbookListScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf textbookListScreen
         */
        v: {
            textbookListHtml: '',
            snbTextbookListHtml: '',
            subjectRevisionCode: "2022",
            gradeCode: "01",
            gradeCodeNoZero: "1",
            termCode: "01",
            subjectTypeCode: '', // 선택값: GOV, APPRV, AUTH
            textbookNameList: [],
            activeMenu: '',
            sortCode: '',
            bannerLocation: ''
        },

        /**
         * 통신 객체- call
         *
         * @memberOf textbookListScreen
         */
        c: {
            /**
             * 교과서 리스트 조회
             *
             * @memberOf textbookListScreen.c
             */
            getTextbookList0314: () => {
                const options = {
                    url: '/pages/ele/textbook/textbookListGnb.ax',
                    data: {
                        subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                        termCode: textbookListScreen.v.termCode,
                        sortCode: 'ELEMENT-' + textbookListScreen.v.sortCode
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookList response: ", res);

                        textbookListScreen.v.textbookNameList = []; // 초기화

                        $.each(res, function (index, item) {
                            // 메뉴 아래 교과서 리스트 렌더링
                            textbookListScreen.v.textbookListHtml = `
                              <a href="#">
                                <div class="thumb">
                                  <img src="${item.coverImagePath}" data-masterSeq=${item.masterSeq} alt=${item.textbookName} />
                                </div>
                                <div class="badges">
                                  <span class="badge">${item.subjectRevisionCode}</span>
                                  ${item.subjectTypeCode === "GOV" 
                                    ? `<span class="text-data">${item.textbookName}</span>` 
                                    : `<span class="text-data">${item.textbookName}${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</span>`}
                                </div>
                              </a>
                            `;

                            textbookListScreen.v.gradeCodeNoZero = (textbookListScreen.v.gradeCode).replace(/^0+/, "");
                            $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).append(textbookListScreen.v.textbookListHtml);

                            textbookListScreen.v.textbookNameList.push(item.textbookName);

                        })

                        // 교과서 썸네일 클릭시 교과서 상세페이지로 이동
                        $('.thumb').on('click', function(event) {

                            const targetPage = '/pages/ele/textbook/textbookDetail.mrn';
                            let masterSeq = $(this).find('img').data('masterseq');
                            let menuText = textbookListScreen.v.activeMenu;

                            const gradeCode = textbookListScreen.v.gradeCode;
                            const termCode = textbookListScreen.v.termCode;
                            const revisionCode = textbookListScreen.v.subjectRevisionCode
                            let tabType = '';

                            console.log("activeMenu: ", menuText)

                            if (menuText === 'menu1') {
                                tabType = 'referenceTab'
                            } else if (menuText === 'menu0') {
                                tabType = 'classTab'
                            }
                            const queryString = `?masterSeq=${masterSeq}&gradeCode=${gradeCode}&termCode=${termCode}&revisionCode=${revisionCode}&tabType=${tabType}`;

                            window.location.href = targetPage + queryString;
                        })


                    }
                };

                $.ajax(options);

            },

            getTextbookList: () => {
                const options = {
                    url: '/pages/ele/textbook/textbookList.ax',
                    data: {
                        subjectRevisionCode: textbookListScreen.v.subjectRevisionCode,
                        gradeCode: textbookListScreen.v.gradeCode,
                        termCode: textbookListScreen.v.termCode,
                        subjectTypeCode: textbookListScreen.v.subjectTypeCode,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookList response: ", res);

                        textbookListScreen.v.textbookNameList = []; // 초기화

                        $.each(res, function (index, item) {
                            // 메뉴 아래 교과서 리스트 렌더링
                            textbookListScreen.v.textbookListHtml = `
                              <a href="#">
                                <div class="thumb">
                                  <img src="${item.coverImagePath}" data-masterSeq=${item.masterSeq} alt=${item.textbookName} />
                                </div>
                                <div class="badges">
                                  <span class="badge">${item.subjectRevisionCode}</span>
                                  ${item.subjectTypeCode === "GOV"
                                ? `<span class="text-data">${item.textbookName}</span>`
                                : `<span class="text-data">${item.textbookName}${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}</span>`}
                                </div>
                              </a>
                            `;

                            textbookListScreen.v.gradeCodeNoZero = (textbookListScreen.v.gradeCode).replace(/^0+/, "");
                            $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).append(textbookListScreen.v.textbookListHtml);

                            textbookListScreen.v.textbookNameList.push(item.textbookName);

                        })

                        // 6학년인 경우 사회과부도 추가
                        if (textbookListScreen.v.gradeCode === "06") {
                            let addItem = `
                                    <a href="#">
                                        <div class="thumb">
                                          <img src="https://api-cms.mirae-n.com/view_content?service=mteacher&amp;params=2ZHcZSc%2FqbtQfzG1o8iEXr9ISWmrEL0tqwMkk3b0FjfdyXgKjkosl7%2Bi%2FFEo2L06KyAsg1o3hOE%2B64cegbOpoEDsv%2FdqbT%2BH4XsJuQIFdrxgpGk1HGJHEtS4xgkJkgB8WhhJD4IHpurY%2BY5jhsSPYg%3D%3D" data-masterseq="111" alt="사회과" 부도="" 5~6="">
                                        </div>
                                        <div class="badges">
                                          <span class="badge">2015</span>
                                          <span class="text-data">사회과 부도 5~6 (전종한)</span>
                                        </div>
                                    </a>
                                `

                            $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).append(addItem)
                        }


                        // 교과서 썸네일 클릭시 교과서 상세페이지로 이동
                        $('.thumb').on('click', function(event) {

                            const targetPage = '/pages/ele/textbook/textbookDetail.mrn';
                            let masterSeq = $(this).find('img').data('masterseq');
                            let menuText = textbookListScreen.v.activeMenu;

                            const gradeCode = textbookListScreen.v.gradeCode;
                            const termCode = textbookListScreen.v.termCode;
                            const revisionCode = textbookListScreen.v.subjectRevisionCode
                            let tabType = '';

                            console.log("activeMenu: ", menuText)

                            if (menuText === 'menu7') {
                                tabType = 'referenceTab'
                            } else if (menuText === 'menu0') {
                                tabType = 'classTab'
                            }
                            const queryString = `?masterSeq=${masterSeq}&gradeCode=${gradeCode}&termCode=${termCode}&revisionCode=${revisionCode}&tabType=${tabType}`;

                            window.location.href = targetPage + queryString;
                        })


                    }
                };

                $.ajax(options);

            },

            getGnbBanner: (menuCode) => {
                const options = {
                    url: '/pages/ele/gnbBanner.ax',
                    data: {
                        bannerLocation: 'ELEMENT-' + textbookListScreen.v.bannerLocation,
                    },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("banner response: ", res.rows[0]);
                        if (res.rows.length > 0) {
                            $('.gnb li[data-sort=' + menuCode + '] .banners a').attr('href', res.rows[0].pcImageLink);
                            $('.gnb li[data-sort=' + menuCode + '] .banners a img').attr('src', res.rows[0].pcImageFileId);
                        }
                    }
                };

                $.ajax(options);
            }

        },

        /**
         * 내부 함수
         *
         * @memberOf textbookListScreen
         */
        f: {
            setRevisionYear: function (revisionValue) {
                textbookListScreen.v.subjectRevisionCode = revisionValue;

                console.log("revision value: ", textbookListScreen.v.subjectRevisionCode)

                $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove(); // 초기화
                textbookListScreen.c.getTextbookList0314();
            },

            setInitHtml: function () {
                console.log("setInitHtml!")


                for (let i = 1; i <=6; i++) {
                    let gradeCode;
                    let menuText = textbookListScreen.v.activeMenu;

                    if ( i === 1) {
                        gradeCode = '01';
                        $(`#${menuText}-grade-1 .lnb-header`).html(`
                            <div class="buttons type-rounded">
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2015" data-revision="2015" />
                                    <label for="${menuText}-revision-${gradeCode}-2015">2015 개정</label>
                                </span>
                                    <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2022" data-revision="2022" checked />
                                    <label for="${menuText}-revision-${gradeCode}-2022">2022 개정</label>
                                </span>
                            </div>
                            <div class="sort">
                              <button type="button" class="active" data-semester="01">1학기</button>
                              <button type="button" data-semester="02">2학기</button>
                            </div>
                        `);
                    } else if ( i === 2) {
                        gradeCode = '02';
                        $(`#${menuText}-grade-2 .lnb-header`).html(`
                            <div class="buttons type-rounded">
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2015" data-revision="2015" />
                                    <label for="${menuText}-revision-${gradeCode}-2015">2015 개정</label>
                                </span>
                                    <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2022" data-revision="2022" checked />
                                    <label for="${menuText}-revision-${gradeCode}-2022">2022 개정</label>
                                </span>
                            </div>
                            <div class="sort">
                              <button type="button" class="active" data-semester="01">1학기</button>
                              <button type="button" data-semester="02">2학기</button>
                            </div>
                        `);
                    } else if ( i === 3) {
                        gradeCode = '03';
                        $(`#${menuText}-grade-3 .lnb-header`).html(`
                            <div class="buttons type-rounded">
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2015" data-revision="2015" checked />
                                    <label for="${menuText}-revision-${gradeCode}-2015">2015 개정</label>
                                </span>
                                <!--
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2022" data-revision="2022" />
                                    <label for="${menuText}-revision-${gradeCode}-2022">2022 개정</label>
                                </span>
                                -->
                            </div>
                            <div class="sort">
                              <button type="button" class="active" data-semester="01">1학기</button>
                              <button type="button" data-semester="02">2학기</button>
                            </div>
                        `);
                    } else if ( i === 4) {
                        gradeCode = '04';
                        $(`#${menuText}-grade-4 .lnb-header`).html(`
                            <div class="buttons type-rounded">
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2015" data-revision="2015" checked />
                                    <label for="${menuText}-revision-${gradeCode}-2015">2015 개정</label>
                                </span>
                                <!--
                                    <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2022" data-revision="2022" />
                                    <label for="${menuText}-revision-${gradeCode}-2022">2022 개정</label>
                                </span>
                                -->
                            </div>
                            <div class="sort">
                              <button type="button" class="active" data-semester="01">1학기</button>
                              <button type="button" data-semester="02">2학기</button>
                            </div>
                        `);
                    } else if ( i === 5) {
                        gradeCode = '05';
                        $(`#${menuText}-grade-5 .lnb-header`).html(`
                            <div class="buttons type-rounded">
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2015" data-revision="2015" checked />
                                    <label for="${menuText}-revision-${gradeCode}-2015">2015 개정</label>
                                </span>
                                <!--
                                    <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2022" data-revision="2022" />
                                    <label for="${menuText}-revision-${gradeCode}-2022">2022 개정</label>
                                </span>
                                -->
                            </div>
                            <div class="sort">
                              <button type="button" class="active" data-semester="01">1학기</button>
                              <button type="button" data-semester="02">2학기</button>
                            </div>
                        `);
                    } else if ( i === 6) {
                        gradeCode = '06';
                        $(`#${menuText}-grade-6 .lnb-header`).html(`
                            <div class="buttons type-rounded">
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2015" data-revision="2015" checked />
                                    <label for="${menuText}-revision-${gradeCode}-2015">2015 개정</label>
                                </span>
                                <!--
                                <span>
                                    <input type="radio" name="${menuText}-revision-${gradeCode}" id="${menuText}-revision-${gradeCode}-2022" data-revision="2022" />
                                    <label for="${menuText}-revision-${gradeCode}-2022">2022 개정</label>
                                </span>
                                -->
                            </div>
                            <div class="sort">
                              <button type="button" class="active" data-semester="01">1학기</button>
                              <button type="button" data-semester="02">2학기</button>
                            </div>
                        `);
                    }
                }

                // init call
                textbookListScreen.c.getTextbookList0314();


                // 개정 년도 변경 2015 or 2022
                $('input[name="' + textbookListScreen.v.activeMenu + '-revision-01"]').on('change', function() {
                    textbookListScreen.f.setRevisionYear($(this).data('revision'));
                });

                $('input[name="' + textbookListScreen.v.activeMenu + '-revision-02"]').on('change', function() {
                    textbookListScreen.f.setRevisionYear($(this).data('revision'));
                });

                $('input[name="' + textbookListScreen.v.activeMenu + '-revision-03"]').on('change', function() {
                    textbookListScreen.f.setRevisionYear($(this).data('revision'));
                });

                $('input[name="' + textbookListScreen.v.activeMenu + '-revision-04"]').on('change', function() {
                    textbookListScreen.f.setRevisionYear($(this).data('revision'));
                });

                $('input[name="' + textbookListScreen.v.activeMenu + '-revision-05"]').on('change', function() {
                    textbookListScreen.f.setRevisionYear($(this).data('revision'));
                });

                $('input[name="' + textbookListScreen.v.activeMenu + '-revision-06"]').on('change', function() {
                    textbookListScreen.f.setRevisionYear($(this).data('revision'));
                });

                $('.gnb .lnb-contents > a').on('click', function(event) {
                    event.stopPropagation();
                })

                // 1학년에 active 클래스 추가
                $(`#${textbookListScreen.v.activeMenu} .grade-lnb > ul > li:first`).addClass("active");
                $(`#${textbookListScreen.v.activeMenu} .grade-lnb > ul > li:first`).click();


                // 학기 클릭시 교과서 목록 새로 가져오기
                $(".lnb-header .sort button").on("click", function () {
                    let semester = $(this).data("semester");

                    textbookListScreen.v.termCode = semester;

                    // 다른 학기 active 클래스 제거
                    $(".lnb-header .sort button").not(this).removeClass("active");

                    // 현재 학기에 active 클래스 추가 또는 제거
                    $(this).toggleClass("active");

                    // 초기화
                    $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove();
                    textbookListScreen.c.getTextbookList0314();
                })

                // 학년 클릭시 교과서 목록 새로 가져오기
                $(".grade-lnb > ul > li").off("click");
                $(".grade-lnb > ul > li").on("click", function () {
                    let sortCode = $(this).data("sort")
                    textbookListScreen.v.sortCode = sortCode;
                    console.log(textbookListScreen.v.sortCode);

                    let gradeCode = $(this).data("grade");
                    textbookListScreen.v.gradeCodeNoZero = $(this).data("grade").replace(/^0+/, "");
                    textbookListScreen.v.gradeCode = gradeCode;

                    let revisionYearText = $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} span input:checked`).siblings('label').text();

                    let revisionYear = revisionYearText.match(/\d+/)[0]
                    let revisionInputName = `${textbookListScreen.v.activeMenu}-revision-${gradeCode}-${revisionYear}`
                    console.log("revisionInputName: ", revisionInputName)

                    textbookListScreen.v.termCode = '01'; // 학기 1학기로 초기화
                    $(`input[id=${revisionInputName}]`).prop('checked', true); // 개정년도 버튼 초기화
                    $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-header .sort button:first`).addClass("active");
                    $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-header .sort button:nth-child(2)`).removeClass("active");


                    // 현재 클릭된 학년에 active 클래스 추가
                    $(this).addClass("active");
                    $(".grade-lnb li").not(this).removeClass("active");


                    // 교과서 리스트 초기화 후 새로 불러오기
                    $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove();
                    textbookListScreen.v.subjectRevisionCode = revisionYear;
                    textbookListScreen.c.getTextbookList0314();

                })
            },

            menuChangeHandler: function (clickedAnchor) {
                let menuText = clickedAnchor.text();

                // 다른 로직에 따라 menuText 변경
                menuText.includes('교과활동') ? (menuText = 'menu0') : (menuText = 'menu1');

                return menuText;
            },
        },

        init: function (event) {
            $('header[school-grade="ELEMENT"] .gnb > ul > li > a').on('click', function (event) {
                event.preventDefault();

                // ~~~~~~ new code ~~~~~~~
                // getMenuText 함수에 클릭된 a 태그를 전달
                let menuText = textbookListScreen.f.menuChangeHandler($(this));
                console.log("menuText: ", menuText);

                let menuCode = $(this).parent().data('sort');

                // 현재 활성 메뉴 업데이트
                textbookListScreen.v.activeMenu = menuText;

                // 초기 lnb-header html 세팅
                if (menuCode === '001' || menuCode === '002') {
                    if (menuCode === '001') textbookListScreen.v.sortCode = "001001";
                    if (menuCode === '002') textbookListScreen.v.sortCode = "002001";
                    textbookListScreen.f.setInitHtml();
                }

                textbookListScreen.v.bannerLocation = menuCode;
                textbookListScreen.c.getGnbBanner(menuCode);
            })


            textbookListScreen.event();


            // (function() {
            //     if ($(this).hasClass("active")) {
            //         if ($(event.target).is('img')) {
            //             console.log("img clicked");
            //             return;
            //         }
            //
            //         console.log("Menu 1 is opened!");
            //         $(`#${textbookListScreen.v.activeMenu}-grade-${textbookListScreen.v.gradeCodeNoZero} .lnb-contents`).find("*").remove(); // 초기화
            //         textbookListScreen.c.getTextbookList();
            //     }
            // })();
        },

        event: function () {


        }
    };
    textbookListScreen.init();
});