$(function () {
    let screen = {
        v: {
            data03: [],
            data04: [],
            data05: [],
            data06: [],
            textEbookgrade:'',
            textEbooktrem:'',
        },

        c: {
            getEbookList: ()=> {

                // screen.v.textEbookgrade = document.querySelector('input[name="ox-filter8"]:checked').value;
                // screen.v.textEbooktrem = document.querySelector('input[name="ox-filter9"]:checked').value;
                screen.v.textEbookgrade = $('button[name=gradeBtn].active').data('value');
                screen.v.textEbooktrem = $('button[name=semesterBtn].active').data('value');
                console.log(screen.v.textEbookgrade);
                console.log(screen.v.textEbooktrem);

                const options = {
                    url: '/pages/ele/board/basiclearning/textEbook.ax',
                    method: 'GET',
                    data: {
                        gradeCode : screen.v.textEbookgrade,
                        termCode : screen.v.textEbooktrem,
                    },
                    success: function (res) {
                        console.log(res);

                        // h3태그에 학년, 학기 출력
                        const gradeText = $('.board-section button[name=gradeBtn].active').text();
                        const semesterText = $('.board-section button[name=semesterBtn].active').text();
                        $('div.board-list h3').text(gradeText + ' ' + semesterText);

                        screen.f.bindDataList(res.rows);
                    }
                };

                $cmm.ajax(options);
            },

        },

        f: {

            setOption: () => {
                const selectedGrade = $('button[name=gradeBtn].active').data('value');
                const selectedSemester = $('button[name=semesterBtn].active').data('value');

                console.log("옵션",selectedGrade)
                console.log("옵션",selectedSemester)

                screen.v.textEbookgrade = selectedGrade;
                screen.v.textEbooktrem = selectedSemester;
                screen.c.getEbookList();
            },
            bindDataList : (data) => {
                // 바인딩할 부모 요소 선택
                const parentElement = document.querySelector('.board-items');
                console.log("데이터",data);

                // 부모 요소 내용 초기화
                parentElement.innerHTML = '';

                data.forEach((item,index) => {
                    // 각 아이템에 대한 HTML 생성
                    const html = `
                        <div class="ebook">
                            <div class="inner-wrap">
                                <p class="title">${item.textbookName}</p>
                                <div class="image-wrap">
                                    <img src="${item.parameter}" alt="">
                                </div>
                            </div>
                            <div class="buttons">
                                <button class="button size-sm fluid" name="previewBtn" target="_blank" id="${item.path}">
                                    <svg>
                                        <title>아이콘 돋보기</title>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                    </svg> 미리보기
                                </button>
                                <input id="${'ebookPathInput-'+ (index+1)}"  type="hidden" value="${item.path}">
                                <button type="button" class="button size-sm fluid ebookcopy" id="${'ebookcopy-'+ (index+1)}" data-toast="${'toast-copy-'+ (index+1)}" data-clipboard-target="${'#ebookPathInput-'+ (index+1)}" data-copyval="${item.path}">
                                    <svg>
                                        <title>아이콘 링크 복사</title>
                                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-copy"></use>
                                    </svg> 링크복사
                                </button>
                            </div>
                        </div>
                    `;

                    // HTML을 부모 요소에 추가
                    parentElement.insertAdjacentHTML('beforeend', html);

                });
                $(document).off("click", "button[name=previewBtn]").on("click", "button[name=previewBtn]", screen.f.openPreview);

                $(document).off('click', '[id^="ebookcopy-"]').on('click', '[id^="ebookcopy-"]', function (event) {
                    event.preventDefault();
                    var isLogin = screen.f.checkLogin();
                    if (!isLogin) {
                        event.preventDefault();
                        return;
                    }else {
                        // 반환값이 false이면 링크 이동을 취소합니다.

                        let targetId = this.id;
                        let toastIndex = targetId.split('-')[1];
                        let combinedString = 'toast-copy-' + toastIndex;

                        let copyval = $(this).attr('data-copyval');

                        window.navigator.clipboard.writeText(copyval);
                        $toast.open(combinedString, "MG00040");
                    }
                });
            },

            checkLogin: () => {
                console.log('$isLogin:: ', $isLogin);
                if (!$isLogin) {
                    $alert.open("MG00001");
                    return false;
                }
                return true;
            },

            openPreview:(event)=>{
                event.preventDefault(); // 기본 동작 중지
                const isLogin = screen.f.checkLogin();
                if (!isLogin) {
                    // 반환값이 false이면 링크 이동을 취소합니다.
                    event.preventDefault();
                    return;
                } // 새 창에서 URL 열기
                console.log('!!!');
                const url = event.target.id; // 버튼의 id 속성값을 URL로 사용// 버튼의 id 속성값을 URL로 사용
                window.open(url, '_blank');
            },

            clearCategory: (e)=> {

                $('button[name=gradeBtn]').removeClass('active');
                $('button[name=semesterBtn]').removeClass('active');

                // 학년, 학기 필터 라디오버튼 초기 active(학년 - 3학년, 학기 - 1학기)
                $('button[name=gradeBtn][data-name=' + '3' + ']').addClass('active');
                $('button[name=semesterBtn][data-name=' + '1' + ']').addClass('active');

                closePopup({id: 'popup-sheet'});

                screen.f.setOption();
            },

        },

        event: function () {
            $(document).on("click", "button[name=previewBtn]", screen.f.openPreview);

            $(document).off('click', '[id^="ebookcopy-"]').on('click', '[id^="ebookcopy-"]', function (event) {
                /*event.preventDefault();*/
                var isLogin = screen.f.checkLogin();
                if (!isLogin) {
                    return;
                }else {
                    // 반환값이 false이면 링크 이동을 취소합니다.

                    let targetId = this.id;
                    let toastIndex = targetId.split('-')[1];
                    let combinedString = 'toast-copy-' + toastIndex;

                    let copyval = $(this).attr('data-copyval');

                    window.navigator.clipboard.writeText(copyval);
                    //$toast.open(combinedString, "MG00040");
                    $alert.open('MG00040');
                }
            });

            // N학년 필터 클릭(아코디언)
            $(document).on('click', 'button[name=gradeCategoryBtn]', function () {
                $('.filter-wrap .filter-items').removeClass('display-show');
                $('.filter-wrap .filter-items').addClass('display-hide');

                if($(this).hasClass('active')) $('#grade-category-filter').addClass('display-show');
            });

            // N학기 필터 클릭(아코디언)
            $(document).on('click', 'button[name=semesterCategoryBtn]', function () {
                $('.filter-wrap .filter-items').removeClass('display-show');
                $('.filter-wrap .filter-items').addClass('display-hide');

                if($(this).hasClass('active')) $('#semester-category-filter').addClass('display-show');
            });

            // N학년 클릭
            $(document).on('click', 'button[name=gradeBtn]', function() {
                $('button[name=gradeBtn]').removeClass('active');
                let data = $(this).data('name');

                if($(this).hasClass('active')) {
                    $('button[name=gradeBtn][data-name=' + data + ']').removeClass('active');
                } else {
                    $('button[name=gradeBtn][data-name=' + data + ']').addClass('active');
                }

                screen.f.setOption();
            });

            // N학기 클릭
            $(document).on('click', 'button[name=semesterBtn]', function() {
                $('button[name=semesterBtn]').removeClass('active');
                let data = $(this).data('name');

                if ($(this).hasClass('active')) {
                    $('button[name=semesterBtn][data-name=' + data + ']').removeClass('active');
                } else {
                    $('button[name=semesterBtn][data-name=' + data + ']').addClass('active');
                }

                screen.f.setOption();
            });

            // 태그 전체 삭제 (카테고리 전체 해제)
            $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearCategory);

            // 학년, 학기 필터 라디오버튼 초기 active(학년 - 3학년, 학기 - 1학기)
            $('button[name=gradeBtn][data-name=' + '3' + ']').addClass('active');
            $('button[name=semesterBtn][data-name=' + '1' + ']').addClass('active');
        },

        init: function () {
            console.log('스마트 수업 - init!');
            screen.event();
        },
    };
    screen.init();
});