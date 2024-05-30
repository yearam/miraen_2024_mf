$(function () {
    let screen = {
        v: {
            data03: [],
            data04: [],
            data05: [],
            data06: [],
            copy: "toast-copy",
        },

        c: {

        },

        f: {

            setOption: () => {

                var selectedGrade = $('section.board-section button[name=gradeBtn].active').data('value');
                var selectedSemester = $('section.board-section button[name=semesterBtn].active').data('value');
                var selectedSubject = $('section.board-section button[name=subjectBtn].active').data('value');
                var selectedunit = $('section.board-section button[name=chapterBtn].active').data('value');

                var unitid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject

                screen.f.getTitleBySection(unitid,selectedGrade);

                var radioGroup = $('.board-section .chapter-filter-mobile')
                var popupRadioGroup = $('#popup-sheet .chapter-filter-mobile')

                // 이전에 그려진 라디오 버튼 제거
                radioGroup.empty();
                popupRadioGroup.empty();

                // 선택된 과목에 해당하는 단원 목록 가져오기
                var unitList = screen.f.getTitleBySection(unitid,selectedGrade);
                console.log(unitList)
                // 각 단원에 대한 라디오 버튼 생성 및 추가
                unitList.forEach((unit, index) => {
                    const dataValue = (index + 1).toString().padStart(2, '0');
                    const filterHtml = `<div class="swiper-slide"><button type="button" name="chapterBtn" data-name="${index + 1}" data-value="${dataValue}">${unit}</button></div>`;
                    const popupFilterHtml = `<button type="button" name="chapterBtn" data-name="${index + 1}">${unit}</button>`;

                    radioGroup.append(filterHtml);
                    popupRadioGroup.append(popupFilterHtml);

                    if(index === 0) {
                        radioGroup.find('button[name=chapterBtn][data-name=1]').addClass('active');
                        popupRadioGroup.find('button[name=chapterBtn][data-name=1]').addClass('active');
                    }

                    screen.f.setList();
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

            getCurrentLocationByName: () => {
                let concatenatedText = "";
                $(".breadcrumbs ul").find("li:not(.home)").each(function (index) {
                    let $this = $(this);
                    let text = $this[0].childNodes.length > 0 ? $this[0].childNodes[0].textContent : $this.text();
                    if (index !== 0) {
                        concatenatedText += " > ";
                    }
                    concatenatedText += text;
                });

                return concatenatedText;
            },

            // 테이블 바인딩
            setList: () => {
                var selectedGrade = $('section.board-section button[name=gradeBtn].active').data('value');
                var selectedSemester = $('section.board-section button[name=semesterBtn].active').data('value');
                var selectedSubject = $('section.board-section button[name=subjectBtn].active').data('value');
                var selectedunit = $('section.board-section button[name=chapterBtn].active').data('value');

                var unitid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject
                var valueid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject+"-"+selectedunit
                screen.f.getTitleBySection(unitid,selectedGrade);
                console.log("id예상값 : " + valueid);
                console.log("단원 : " + selectedunit);
                if (selectedGrade == null){
                    selectedGrade = '03';
                }
                if (selectedSemester == null){
                    selectedSemester = '01';
                }
                if (selectedSemester == null){
                    selectedSubject = 'KOA';
                }
                if (selectedunit == null){
                    selectedunit = '01';
                }

                var datenum = "data" + selectedGrade;
                var tableData = screen.v[datenum];
                var tableBody = $('ul.gray-depth-items');


                // 이전에 그려진 라디오 버튼 제거
                tableBody.empty();

                var targetItem = screen.v[datenum].find(function(item) {
                    return item.id === valueid;
                });
                console.log(targetItem);

                if(targetItem.id.includes("SO")){
                    // h3 태그 타이틀
                    const title = targetItem.title;
                    let titleHtml = '';

                    // 테이블 생성
                    targetItem.tableList.forEach(function(tableData, tableIndex) {
                        titleHtml = `
                            <li>
                                <div class="text-wrap">
                                    <h3>${title}</h3>
                                    <p>${tableData.subTitle}</p>
                                </div>
                                <ul class="list-wrap tableIndex${tableIndex}">
                                </ul>
                            </li>`
                        let totalLoopHtml = '';
                        tableData.tbody.forEach(function(rowData, index) {

                            console.log("자자자자",tableData.tbody.length);
                            var last = tableData.tbody.length;

                            // 주교과서 데이터
                            const textbookPlusPage = tableData.thead[1] + ' ' +  rowData[2];

                            const innerLoopHtml = `
                                    <li>
                                        <span class="hour">${rowData[0]}</span>
                                        <div class="inner-wrap">
                                            <strong class="title semi text-black">${rowData[1]}</strong>
                                            <div class="buttons">
                                                <a href="/pages/api/preview/viewer.mrn?source=LINK&file=${rowData[3]}" target="_blank" class="button size-sm type-icon">
                                                    <svg>
                                                        <use href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                                    </svg>
                                                </a>
                                                <input id="ebookPathInput-${index + 1}"  type="hidden" value="${rowData[4]}">
                                                <a href="javascript:void(0);" data-toast="toast-copy-${index + 1}" id="ebookLinkCopyBtn-${index + 1}" class="button size-sm type-icon" data-clipboard-target="#ebookPathInput-${index + 1}" data-copyval="${rowData[4]}">
                                                    <svg>
                                                        <use href="/assets/images/svg-sprite-solid.svg#icon-copy"></use>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="number-pages">
                                            <span>${textbookPlusPage}</span>
                                        </div>
                                    </li>`

                            totalLoopHtml += innerLoopHtml;
                        });
                        tableBody.append(titleHtml).find(`ul.tableIndex${tableIndex}`).append(totalLoopHtml);
                    });
                }else{
                    const titleHtml = `
                        <li>
                            <div class="text-wrap">
                                <h3>${targetItem.title}</h3>
                            </div>
                            <ul class="list-wrap">
                            </ul>
                        </li>`

                    let totalInnerLoopHtml = '';
                    // 테이블 생성
                    targetItem.tableList.forEach(function(tableData) {
                        tableData.tbody.forEach(function(rowData, index) {

                            console.log("자자자자",tableData.tbody.length);
                            var last = tableData.tbody.length;

                            // 주교과서 데이터
                            const textbookPlusPage = tableData.thead[1] + ' ' +  rowData[2];

                            // 서브교과서 데이터
                            const subTextbookPlusPage = tableData.thead[2] + ' ' + rowData[3];
                            // 서브교과서 출력 YN
                            const subTextbookPlusPageYn = subTextbookPlusPage.indexOf('-') === -1;

                            const innerLoopHtml = `
                                    <li>
                                        <span class="hour">${rowData[0]}</span>
                                        <div class="inner-wrap">
                                            <strong class="title semi text-black">${rowData[1]}</strong>
                                            <div class="buttons">
                                                <a href="/pages/api/preview/viewer.mrn?source=LINK&file=${rowData[4]}" target="_blank" class="button size-sm type-icon">
                                                    <svg>
                                                        <use href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                                                    </svg>
                                                </a>
                                                <input id="ebookPathInput-${index + 1}"  type="hidden" value="${rowData[5]}">
                                                <a href="javascript:void(0);" data-toast="toast-copy-${index + 1}" id="ebookLinkCopyBtn-${index + 1}" class="button size-sm type-icon" data-clipboard-target="#ebookPathInput-${index + 1}" data-copyval="${rowData[5]}">
                                                    <svg>
                                                        <use href="/assets/images/svg-sprite-solid.svg#icon-copy"></use>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="number-pages">
                                            <span>${textbookPlusPage}</span>
                                            ${subTextbookPlusPageYn ? `<span>${subTextbookPlusPage}</span>` : ''}
                                        </div>
                                    </li>`

                            totalInnerLoopHtml += innerLoopHtml;
                        });
                    });

                    tableBody.append(titleHtml);
                    tableBody.find('ul.list-wrap').append(totalInnerLoopHtml);
                }

                // 테이블 제목

                var iconButtonslink = document.querySelectorAll('.icon-button-link');

                var iconButtonscopy = document.querySelectorAll('.icon-button-copy');

                iconButtonslink.forEach(function(button) {
                    button.addEventListener('click', function(event) {
                        // checkLogin() 함수를 호출하여 로그인 상태를 확인합니다.
                        var isLogin = screen.f.checkLogin();

                        // checkLogin()의 반환값에 따라 동작을 결정합니다.
                        if (!isLogin) {
                            // 반환값이 false이면 링크 이동을 취소합니다.
                            event.preventDefault();
                            return;
                        }

                        // 로그인 상태가 확인되었으므로, 링크 이동을 계속합니다.
                    });
                });
                iconButtonscopy.forEach(function(button) {
                    button.addEventListener('click', function(event) {
                        // checkLogin() 함수를 호출하여 로그인 상태를 확인합니다.
                        var isLogin = screen.f.checkLogin();

                        // checkLogin()의 반환값에 따라 동작을 결정합니다.
                        if (!isLogin) {
                            // 반환값이 false이면 링크 이동을 취소합니다.
                            event.preventDefault();
                            return;
                        }

                        // 로그인 상태가 확인되었으므로, 링크 이동을 계속합니다.
                    });
                });

                $('.type-icon').on('click', function(event) {
                    // checkLogin() 함수를 호출하여 로그인 상태를 확인합니다.
                    var isLogin = screen.f.checkLogin();

                    // checkLogin()의 반환값에 따라 동작을 결정합니다.
                    if (!isLogin) {
                        // 반환값이 false이면 링크 이동을 취소합니다.
                        event.preventDefault();
                        return;
                    }

                    // 로그인 상태가 확인되었으므로, 링크 이동을 계속합니다.
                });

            },

            getTitleBySection(sectionId,no) {
                console.log("학년",no);
                console.log("id체크",sectionId);
                var titleunit = [];
                var datenum = "data"+no;
                console.log(datenum);
                console.log(screen.v[datenum].length);
                for (var i = 0; i < screen.v[datenum].length; i++) {
                    if (screen.v[datenum][i].id.startsWith(sectionId)) {
                        titleunit.push(screen.v[datenum][i].title);
                    }
                }
                console.log(titleunit);
                return titleunit;
            },

            clearCategory: (e)=> {

                $('button[name=gradeBtn]').removeClass('active');
                $('button[name=semesterBtn]').removeClass('active');
                $('button[name=subjectBtn]').removeClass('active');
                $('button[name=chapterBtn]').removeClass('active');

                // 학년, 학기 필터 라디오버튼 초기 active(학년 - 3학년, 학기 - 1학기)
                $('button[name=gradeBtn][data-name=' + '3' + ']').addClass('active');
                $('button[name=semesterBtn][data-name=' + '1' + ']').addClass('active');
                $('button[name=subjectBtn][data-name=' + '1' + ']').addClass('active');
                $('button[name=chapterBtn][data-name=' + '1' + ']').addClass('active');

                closePopup({id: 'popup-sheet'});

                screen.f.setOption();
            },

        },

        event: function () {

            screen.v.data03 = data03;
            screen.v.data04 = data04;
            screen.v.data05 = data05;
            screen.v.data06 = data06;

            console.log("3학년",screen.v.data03)
            console.log("4학년",screen.v.data04)
            console.log("5학년",screen.v.data05)
            console.log("6학년",screen.v.data06)

            // 파일 미리보기
            // $(document).on("click", "button[name=previewBtn]", screen.f.previewFile);

            document.addEventListener('DOMContentLoaded', function() {
                fetch('your_json_file.json')
                    .then(response => response.json())
                    .then(data => {
                        // 데이터를 이용하여 원하는 작업을 수행합니다.
                        console.log(data); // 예시: JSON 데이터를 콘솔에 출력합니다.
                    })
                    .catch(error => {
                        console.error('Error fetching JSON:', error);
                    });
            });
            // $(document).on("click", "#ebookLinkCopyBtn", screen.f.checkLogin);

            var iconButtons = document.querySelectorAll('.type-icon');

            iconButtons.forEach(function(button) {
                button.addEventListener('click', function(event) {
                    // checkLogin() 함수를 호출하여 로그인 상태를 확인합니다.
                    var isLogin = screen.f.checkLogin();

                    // checkLogin()의 반환값에 따라 동작을 결정합니다.
                    if (!isLogin) {
                        // 반환값이 false이면 링크 이동을 취소합니다.
                        event.preventDefault();
                        return;
                    }

                    // 로그인 상태가 확인되었으므로, 링크 이동을 계속합니다.
                });
            });

            $(document).off('click', '[id^="ebookLinkCopyBtn-"]').on('click', '[id^="ebookLinkCopyBtn-"]', function (event) {

                event.preventDefault();
                var isLogin = screen.f.checkLogin();
                if (!isLogin) {
                    event.preventDefault();
                    return;
                }else {
                    // 반환값이 false이면 링크 이동을 취소합니다.

                    // let targetId = this.id;
                    // let toastIndex = targetId.split('-')[1];
                    // let combinedString = 'toast-copy-' + toastIndex;

                    const $regFavoriteMsgMobile =  $('.reg-favorite-msg-mobile');
                    let copyval = $(this).attr('data-copyval');

                    window.navigator.clipboard.writeText(copyval);
                    // $toast.open(combinedString, "MG00040");

                    $regFavoriteMsgMobile.removeClass('display-hide');
                    $regFavoriteMsgMobile.find('p.toast-message').text('링크가 복사되었습니다.');
                    setTimeout(() => { $regFavoriteMsgMobile.addClass('display-hide'); }, 1500);
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

            // N과목 필터 클릭(아코디언)
            $(document).on('click', 'button[name=subjectCategoryBtn]', function () {
                $('.filter-wrap .filter-items').removeClass('display-show');
                $('.filter-wrap .filter-items').addClass('display-hide');

                if($(this).hasClass('active')) $('#subject-category-filter').addClass('display-show');
            });

            // N단원 필터 클릭(아코디언)
            $(document).on('click', 'button[name=chapterCategoryBtn]', function () {
                $('.filter-wrap .filter-items').removeClass('display-show');
                $('.filter-wrap .filter-items').addClass('display-hide');

                if($(this).hasClass('active')) $('#chapter-category-filter').addClass('display-show');
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

            // N과목 클릭
            $(document).on('click', 'button[name=subjectBtn]', function() {
                $('button[name=subjectBtn]').removeClass('active');
                let data = $(this).data('name');

                if ($(this).hasClass('active')) {
                    $('button[name=subjectBtn][data-name=' + data + ']').removeClass('active');
                } else {
                    $('button[name=subjectBtn][data-name=' + data + ']').addClass('active');
                }

                screen.f.setOption();
            });

            // N단원 클릭
            $(document).on('click', 'button[name=chapterBtn]', function() {
                $('button[name=chapterBtn]').removeClass('active');
                let data = $(this).data('name');

                if ($(this).hasClass('active')) {
                    $('button[name=chapterBtn][data-name=' + data + ']').removeClass('active');
                } else {
                    $('button[name=chapterBtn][data-name=' + data + ']').addClass('active');
                }

                screen.f.setList();
            });

            // 태그 전체 삭제 (카테고리 전체 해제)
            $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearCategory);

            // 학년, 학기 필터 라디오버튼 초기 active(학년 - 3학년, 학기 - 1학기)
            $('button[name=gradeBtn][data-name=' + '3' + ']').addClass('active');
            $('button[name=semesterBtn][data-name=' + '1' + ']').addClass('active');
            $('button[name=subjectBtn][data-name=' + '1' + ']').addClass('active');
            $('button[name=chapterBtn][data-name=' + '1' + ']').addClass('active');
        },

        init: function () {
            console.log('스마트 수업 - init!');
            screen.event();
        },
    };
    screen.init();
});