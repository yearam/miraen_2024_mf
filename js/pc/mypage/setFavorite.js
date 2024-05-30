let setFavoriteScreen;
$(function () {
    setFavoriteScreen = {
        v: {
            subjectLevelCode: $('#hiddenSubjectLevel').val(), // 학교급 - 초중고
            urlLevel        : $('#hiddenUrlLevel').val(),
            callback        : null,
            tabCode         : null,
            gradeCode       : null, // 학년급
            termCode        : null, // 학기
            subjectCode     : null, // 과목
            locationName    : null, // 엠티처 서비스 1Depth
            myFavListLength : $('#bookmarkMrnList fieldset:not([disabled])').length + $('#bookmarkOtherList fieldset:not([disabled])').length + $('#bookmarkMteacherList fieldset:not([disabled])').length + $('#bookmarkLinkList fieldset:not([disabled])').length,
            initSaveList    : {
                bookmarkMrnList     : [],
                bookmarkOtherList   : [],
                bookmarkMteacherList: [],
                bookmarkLinkList    : []
            },
            saveList        : {
                bookmarkMrnList     : [],
                bookmarkOtherList   : [],
                bookmarkMteacherList: [],
                bookmarkLinkList    : []
            },
            delList         : [],
            bookmarkList    : ['bookmarkMrnList', 'bookmarkOtherList', 'bookmarkMteacherList', 'bookmarkLinkList'],
        },

        c: {
            // 즐겨찾기 데이터
            getContentsList: (type) => {
                switch (type) {
                    case "mrnList" :
                        if (setFavoriteScreen.v.subjectLevelCode === "ELEMENT") {
                            setFavoriteScreen.v.urlLevel = "/ele/"
                        } else if (setFavoriteScreen.v.subjectLevelCode === "MIDDLE") {
                            setFavoriteScreen.v.urlLevel = "/mid/"
                        } else if (setFavoriteScreen.v.subjectLevelCode === "HIGH") {
                            setFavoriteScreen.v.urlLevel = "/high/"
                        }

                        $.ajax({
                            method: "GET",
                            url   : "/pages" + setFavoriteScreen.v.urlLevel + "textbook/textbookList.ax",
                            data  : {
                                subjectLevelCode: setFavoriteScreen.v.subjectLevelCode,
                                gradeCode       : setFavoriteScreen.v.gradeCode,
                                termCode        : setFavoriteScreen.v.termCode,
                                subjectCode     : setFavoriteScreen.v.subjectCode
                            },
                            // beforeSend: () => {
                            //     $('#loading').addClass("display-show");
                            // },
                            success: (res) => {
                                if (res.length === 0) {
                                    const div = $("#tab2-1 .bookmark-contents");
                                    div.empty();
                                    $('#tabMrnCnt').text("(" + 0 + ")");
                                    $('#textbookTotalCnt').text(0);
                                } else {
                                    setFavoriteScreen.f.bindMrnList(res.length, res);
                                }
                            },
                            // complete: () => {
                            //     $('#loading').removeClass("display-show");
                            // }
                        });
                        break;
                    case "otherList" :
                        $.ajax({
                            method: "GET",
                            url   : "/pages/common/mypage/getOtherTextbookList.ax",
                            data  : {
                                subjectLevelCode: setFavoriteScreen.v.subjectLevelCode,
                                gradeCode       : setFavoriteScreen.v.gradeCode,
                                termCode        : setFavoriteScreen.v.termCode,
                                subjectCode     : setFavoriteScreen.v.subjectCode
                            },
                            // beforeSend: () => {
                            //     $('#loading').addClass("display-show");
                            // },
                            success: (res) => {
                                if (res.length === 0) {
                                    const div = $("#tab2-2 .bookmark-contents");
                                    div.empty();
                                    $('#tabOtherCnt').text("(" + 0 + ")");
                                    $('#otherTotalCnt').text(0);
                                } else {
                                    setFavoriteScreen.f.bindOtherList(res.length, res);
                                }
                            },
                            // complete: () => {
                            //     $('#loading').removeClass("display-show");
                            // }
                        });
                        break;
                    case "mteacherList" :
                        $.ajax({
                            method: "GET",
                            url   : "/pages/common/mypage/getFavoriteServiceList.ax",
                            data  : {
                                subjectLevelCode: setFavoriteScreen.v.subjectLevelCode,
                                locationName    : setFavoriteScreen.v.locationName
                            },
                            // beforeSend: () => {
                            //     $('#loading').addClass("display-show");
                            // },
                            success: (res) => {
                                if (res.length === 0) {
                                    const div = $("#tab2-3 .bookmark-contents");
                                    div.empty();
                                    $('#tabMteacherCntCnt').text("(" + 0 + ")");
                                    $('#mteacherTotalCnt').text(0);
                                } else {
                                    setFavoriteScreen.f.bindMteacherList(res.length, res);
                                }
                            },
                            // complete: () => {
                            //     $('#loading').removeClass("display-show");
                            // }
                        });
                        break;
                }
            },

            getMyFavData: () => {
                $.ajax({
                    method : "POST",
                    url    : "/pages/api/mypage/searchMyclassFavList.ax",
                    data : {
                        level: setFavoriteScreen.v.subjectLevelCode
                    },
                    beforeSend: () => {
                        $('#loading').addClass("display-show");
                    },
                    success: (res) => {
                        setFavoriteScreen.f.initSaveList();
                        if (res.row.length === 0) {
                            const div = $("#myFavorite");
                            div.empty();
                            $('#myFavoriteTotalCnt').text(0);
                            $('#myFavSelect option[value="ALL"]').text('전체 (0)');
                            $('#myFavSelect option[value="MRN"]').text('미래엔 교과서 (0)');
                            $('#myFavSelect option[value="OTHER"]').text('타사 교과서 (0)');
                            $('#myFavSelect option[value="MTEACHER"]').text('엠티처 서비스 (0)');
                            $('#myFavSelect option[value="LINK"]').text('링크 즐겨찾기 (0)');
                        } else {
                            setFavoriteScreen.f.bindMyfavData(res.totalCnt, res.row);
                        }
                    },
                    complete: () => {
                        $('#loading').removeClass("display-show");
                    }
                });
            }
        },

        f: {
            bindMrnList: (totalCnt, data) => {
                const tabMrnCnt = $('#tabMrnCnt')
                const countText = $('#textbookTotalCnt');
                const div = $('#mrnBookmark');

                div.empty();

                for (const row of data) {
                    let subjectName;
                    if (setFavoriteScreen.v.subjectLevelCode === 'ELEMENT') {
                        subjectName = "미래엔"
                    } else {
                        subjectName = row.subjectCodeName;
                    }

                    let html = `<button type="button" value="${row.masterSeq}" data-url="${row.linkUrl}" data-name="${row.textbookName}">
                        <span class="icon">
                            <svg>
                                <title>더하기 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                            </svg>
                        </span>
                        <ul class="divider-group">
                            <li>${subjectName}</li>
                            <li>[${row.subjectRevisionCode}] ${row.textbookName} ${row.leadAuthorName ? `(${row.leadAuthorName})` : ''}</li>
                        </ul>
                    </button>`;
                    div.append(html);
                }

                tabMrnCnt.text("(" + totalCnt + ")");
                countText.text(totalCnt);
            },

            bindOtherList: (totalCnt, data) => {
                const tabOtherCnt = $('#tabOtherCnt')
                const countText = $('#otherTotalCnt');
                const div = $('#otherBookmark');

                div.empty();

                for (const row of data) {
                    let html = `<button type="button" value="${row.otherSeq}" data-url="${row.linkUrl}" data-name="${row.name}">
                        <span class="icon">
                            <svg>
                                <title>더하기 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                            </svg>
                        </span>
                        <ul class="divider-group">
                            <li>${row.publisherName}</li>
                            <li>[${row.subjectRevisionCode}] ${row.name} ${row.authorName ? `(${row.authorName})` : ''}</li>
                        </ul>
                    </button>`;
                    div.append(html);
                }

                tabOtherCnt.text("(" + totalCnt + ")");
                countText.text(totalCnt);
            },

            bindMteacherList: (totalCnt, data) => {
                const tabMteacherCnt = $('#tabMteacherCnt')
                const countText = $('#mteacherTotalCnt');
                const div = $('#mteacherBookmark');

                div.empty();

                for (const row of data) {
                    let locationNames = row.locationName.split(';');
                    let html = `<button type="button" value="${row.serviceSeq}" data-url="${row.linkUrl}" data-name="${row.serviceName}">
                    <span class="icon">
                        <svg>
                            <title>더하기 아이콘</title>
                            <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
                        </svg>
                    </span>
                    <ul class="divider-group">`;
                    for (const name of locationNames) {
                        html += `<li>${name}</li>`;
                    }
                    html += `</ul></button>`;
                    div.append(html);
                }

                tabMteacherCnt.text("(" + totalCnt + ")");
                countText.text(totalCnt);
            },

            getMyFavData: () => {
                const lists = setFavoriteScreen.v.bookmarkList;
                lists.forEach(list => {
                    if ($(`#${list}`).length > 0) {
                        $(`#${list} fieldset.item:not(:disabled)`).each(function () {
                            const value = $(this).attr('value');
                            const dataSeq = $(this).data('seq') || null;
                            const dataUrl = $(this).data('url') || null;
                            const dataName = $(this).data('name') || null;
                            const item = {value, dataSeq, dataUrl, dataName};
                            setFavoriteScreen.v.saveList[list].push(item);
                        });
                    }
                });
            },

            updateButtonOrder: (bookmarkList) => {
                let items = $('#' + bookmarkList + ' .item');
                items.each(function (index) {
                    let upBtn = $(this).find('.button-wrap button:first');
                    let downBtn = $(this).find('.button-wrap button:last');
                    if (items.length === 1) { // 유일한 아이템
                        upBtn.attr('disabled', 'disabled');
                        downBtn.attr('disabled', 'disabled');
                    } else if (index === 0) { // 첫 번째 아이템
                        upBtn.attr('disabled', 'disabled');
                        downBtn.removeAttr('disabled');
                    } else if (index === items.length - 1) { // 마지막 아이템
                        upBtn.removeAttr('disabled');
                        downBtn.attr('disabled', 'disabled');
                    } else { // 중간 아이템
                        upBtn.removeAttr('disabled');
                        downBtn.removeAttr('disabled');
                    }
                });
            },

            initSaveList: () => {
                setFavoriteScreen.v.initSaveList.bookmarkMrnList = [];
                setFavoriteScreen.v.initSaveList.bookmarkOtherList = [];
                setFavoriteScreen.v.initSaveList.bookmarkMteacherList = [];
                setFavoriteScreen.v.initSaveList.bookmarkLinkList = [];
            },

            initMyfavData: () => {
                setFavoriteScreen.v.saveList.bookmarkMrnList = [];
                setFavoriteScreen.v.saveList.bookmarkOtherList = [];
                setFavoriteScreen.v.saveList.bookmarkMteacherList = [];
                setFavoriteScreen.v.saveList.bookmarkLinkList = [];
            },

            setEventListeners: (el, radioName, listType) => {
                $(`#${el}Grade input[name=${radioName}]`).off().on("click", (e) => {
                    setFavoriteScreen.v.gradeCode = e.target.value;
                    setFavoriteScreen.c.getContentsList(listType);
                });

                $(`#${el}TermCode`).change(function (e) {
                    setFavoriteScreen.v.termCode = e.target.value;
                    setFavoriteScreen.c.getContentsList(listType);
                })

                $(`#${el}SubjectCode`).change(function (e) {
                    setFavoriteScreen.v.subjectCode = e.target.value;
                    setFavoriteScreen.c.getContentsList(listType);
                })
            },

            bindMyfavData: (totalCnt, data) => {
                const div = $("#myFavorite");
                div.empty();

                console.log(totalCnt);
                console.log(data);

                // 미래엔 교과서 목록 업데이트
                let mrnList = data.mrnList;
                let mrnHTML = '';
                if (mrnList.length > 0) {
                    $("#myFavorite").append('<div id="bookmarkMrnList" class="bookmark-items"></div>');

                    console.log(setFavoriteScreen.v.subjectLevelCode);

                    for (let i = 0; i < mrnList.length; i++) {
                        let mrn = mrnList[i];
                        let subjectName = setFavoriteScreen.v.subjectLevelCode === 'ELEMENT' ? '미래엔' : mrn.subjectCodeName;
                        let authorName = mrn.authorName ? ' (' + mrn.authorName + ')' : '';
                        mrnHTML += `<fieldset class="item" data-seq="${mrn.favSeq}" value="${mrn.seq}">
                    <button type="button">
                        <span class="icon">
                            <svg>
                                <title>빼기 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-minus"></use>
                            </svg>
                        </span>
                        <ul class="divider-group">
                            <li>${subjectName}</li>
                            <li>[${mrn.revision}] ${mrn.name}${authorName}</li>
                        </ul>
                    </button>
                    <div class="button-wrap">
                        <button type="button" ${i === 0 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>위 아이콘 </title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-up"></use>
                            </svg>
                        </button>
                        <button type="button" ${i === mrnList.length - 1 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>아래 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-down"></use>
                            </svg>
                        </button>
                    </div>
                </fieldset>`;
                    }
                    $('#bookmarkMrnList').html(mrnHTML);
                }


                // 타사 교과서 목록 업데이트
                let otherList = data.otherList;
                let otherHTML = '';
                if (otherList.length > 0) {
                    $("#myFavorite").append('<div id="bookmarkOtherList" class="bookmark-items"></div>');

                    for (let i = 0; i < otherList.length; i++) {
                        let other = otherList[i];
                        let authorName = other.authorName ? ' (' + other.authorName + ')' : '';
                        otherHTML += `<fieldset class="item" data-seq="${other.favSeq}" value="${other.seq}">
                    <button type="button">
                        <span class="icon">
                            <svg>
                                <title>빼기 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-minus"></use>
                            </svg>
                        </span>
                        <ul class="divider-group">
                            <li>${other.publisherName}</li>
                            <li>[${other.revision}] ${other.name}${authorName}</li>
                        </ul>
                    </button>
                    <div class="button-wrap">
                        <button type="button" ${i === 0 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>위 아이콘 </title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-up"></use>
                            </svg>
                        </button>
                        <button type="button" ${i === otherList.length - 1 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>아래 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-down"></use>
                            </svg>
                        </button>
                    </div>
                </fieldset>`;
                    }
                    $('#bookmarkOtherList').html(otherHTML);
                }

                // 엠티처 서비스 목록 업데이트
                let mteacherList = data.mteacherList;
                let mteacherHTML = '';
                if (mteacherList.length > 0) {
                    $("#myFavorite").append('<div id="bookmarkMteacherList" class="bookmark-items"></div>');

                    for (let i = 0; i < mteacherList.length; i++) {
                        let mteacher = mteacherList[i];
                        let locations = mteacher.locationName.split(';');
                        let locationName = '';
                        for (let j = 0; j < locations.length; j++) {
                            locationName += `<li>${locations[j]}</li>`;
                        }
                        mteacherHTML += `<fieldset class="item" data-seq="${mteacher.favSeq}" value="${mteacher.seq}">
                    <button type="button">
                        <span class="icon">
                            <svg>
                                <title>빼기 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-minus"></use>
                            </svg>
                        </span>
                        <ul class="divider-group">
                            ${locationName}
                        </ul>
                    </button>
                    <div class="button-wrap">
                        <button type="button" ${i === 0 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>위 아이콘 </title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-up"></use>
                            </svg>
                        </button>
                        <button type="button" ${i === mteacherList.length - 1 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>아래 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-down"></use>
                            </svg>
                        </button>
                    </div>
                </fieldset>`;
                    }
                    $('#bookmarkMteacherList').html(mteacherHTML);
                }


                // 링크 즐겨찾기 목록 업데이트
                let linkList = data.linkList;
                let linkHTML = '';

                if (linkList.length > 0) {
                    $("#myFavorite").append('<div id="bookmarkLinkList" class="bookmark-items"></div>');

                    for (let i = 0; i < linkList.length; i++) {
                        let link = linkList[i]
                        linkHTML += `<fieldset class="item" data-seq="${link.favSeq}" value="${link.seq}">
                    <button type="button">
                        <span class="icon">
                            <svg>
                                <title>빼기 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-minus"></use>
                            </svg>
                        </span>
                        <ul class="divider-group">
                            <li>${link.name}</li>
                        </ul>
                    </button>
                    <div class="button-wrap">
                        <button type="button" ${i === 0 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>위 아이콘 </title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-up"></use>
                            </svg>
                        </button>
                        <button type="button" ${i === linkList.length - 1 ? 'disabled="disabled"' : ''}>
                            <svg>
                                <title>아래 아이콘</title>
                                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-down"></use>
                            </svg>
                        </button>
                    </div>
                </fieldset>`;
                    }
                    $('#bookmarkLinkList').html(linkHTML);
                }

                const lists = setFavoriteScreen.v.bookmarkList;
                lists.forEach(list => {
                    $(`#${list} fieldset.item:not(:disabled)`).each(function () {
                        const value = $(this).attr('value');
                        const dataSeq = $(this).data('seq') || null;
                        const dataUrl = $(this).data('url') || null;
                        const dataName = $(this).data('name') || null;
                        const item = {value, dataSeq, dataUrl, dataName};
                        setFavoriteScreen.v.initSaveList[list].push(item);
                    });
                });

                $('#setFavListCnt').text(totalCnt);
                $('#myFavoriteTotalCnt').text(totalCnt);
                $('#linkList').text("링크 즐겨찾기 (" + data.linkList.length + ")")

                let myFavSelect = $('#myFavSelect');
                myFavSelect.empty();

                myFavSelect.append(new Option('전체 (' + totalCnt + ')', 'ALL'));
                myFavSelect.append(new Option('미래엔 교과서 (' + data.mrnList.length + ')', 'MRN'));
                if (setFavoriteScreen.v.subjectLevelCode === "ELEMENT") myFavSelect.append(new Option('타사 교과서 (' + data.otherList.length + ')', 'OTHER'));
                myFavSelect.append(new Option('엠티처 서비스 (' + data.mteacherList.length + ')', 'MTEACHER'));
                myFavSelect.append(new Option('링크 즐겨찾기 (' + data.linkList.length + ')', 'LINK'));

                myFavSelect.trigger('change');
            }
        },

        event: () => {

            // 탭 클릭 이벤트
            $('.tab li').off().on("click", function () {
                setFavoriteScreen.v.tabCode = $(this).find('a').attr('id');
                setFavoriteScreen.v.gradeCode = $('#hiddenGrade').val();
                setFavoriteScreen.v.urlLevel = $('#hiddenUrlLevel').val();
                if ($(this).find('a').attr('id') === "mrnList" && setFavoriteScreen.v.subjectLevelCode === 'ELEMENT') {
                    $('input[name=radio1][value=' + setFavoriteScreen.v.gradeCode + ']').prop('checked', true);
                } else if ($(this).find('a').attr('id') === "otherList" && setFavoriteScreen.v.subjectLevelCode === 'ELEMENT') {
                    $('input[name=radio2][value=' + setFavoriteScreen.v.gradeCode + ']').prop('checked', true);
                }
                setFavoriteScreen.v.termCode = null;
                setFavoriteScreen.v.subjectCode = null;
                setFavoriteScreen.c.getContentsList(setFavoriteScreen.v.tabCode);
            })

            // 미래엔 교과서 리스트 이벤트
            setFavoriteScreen.f.setEventListeners('mrn', 'radio1', 'mrnList');

            // 타사 교과서 리스트 이벤트
            setFavoriteScreen.f.setEventListeners('other', 'radio2', 'otherList');

            // 엠티처 서비스 리스트 이벤트
            $('#mteacherService').off().on("change", (e) => {
                setFavoriteScreen.v.locationName = e.target.value;
                setFavoriteScreen.c.getContentsList("mteacherList");
            });

            let bookmarkTypes = {
                'mrnBookmark'     : 'bookmarkMrnList',
                'otherBookmark'   : 'bookmarkOtherList',
                'mteacherBookmark': 'bookmarkMteacherList',
                'linkBookmark'    : 'bookmarkLinkList'
            };

            let bookmarkOrder = setFavoriteScreen.v.bookmarkList;

            $.each(bookmarkTypes, function (bookmark, list) {
                let listObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.type === 'childList') {
                            // myFavListLength 업데이트
                            setFavoriteScreen.v.myFavListLength = $('#bookmarkMrnList fieldset:not([disabled])').length + $('#bookmarkOtherList fieldset:not([disabled])').length + $('#bookmarkMteacherList fieldset:not([disabled])').length + $('#bookmarkLinkList fieldset:not([disabled])').length;
                            console.log(setFavoriteScreen.v.myFavListLength);
                        }
                    });
                });

                $(document).off("click", '#' + bookmark + ' button').on("click", '#' + bookmark + ' button', function () {
                    if ($(this).hasClass("active")) return $alert.open("MG00013");
                    console.log(setFavoriteScreen.v.myFavListLength);
                    if (setFavoriteScreen.v.myFavListLength >= 40) {
                        return $alert.open("MG00012");
                    }
                    if ($('.box-no-data').length > 0) $('.box-no-data').remove();

                    let value = $(this).val();
                    let url = $(this).data('url');
                    let name = $(this).data('name');

                    let items = $(this).find('ul.divider-group li').map(function () {
                        return $(this).text();
                    }).get();

                    let fieldset = $('<fieldset>').addClass('item').attr('value', value).attr('data-url', url).attr('data-name', name);
                    let button = $('<button>').attr('type', 'button');
                    let icon = $('<span>').addClass('icon').append('<svg><title>빼기 아이콘</title><use xlink:href="/assets/images/svg-sprite-solid.svg#icon-minus"></use></svg>');
                    let ul = $('<ul>').addClass('divider-group');
                    items.forEach(function (item) {
                        ul.append($('<li>').text(item));
                    });
                    button.append(icon).append(ul);
                    fieldset.append(button);

                    let buttonWrap = $('<div>').addClass('button-wrap');
                    let upButton = $('<button>').attr('type', 'button').append('<svg><title>위 아이콘 </title><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-up"></use></svg>');
                    let downButton = $('<button>').attr('type', 'button').attr('disabled', 'disabled').append('<svg><title>아래 아이콘</title><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-down"></use></svg>');
                    buttonWrap.append(upButton).append(downButton);
                    fieldset.append(buttonWrap);

                    if ($(`#${list}`).length === 0) {
                        let index = bookmarkOrder.indexOf(list);
                        let insertAfterElement = null;
                        for (let i = index - 1; i >= 0; i--) {
                            if ($(`#${bookmarkOrder[i]}`).length > 0) {
                                insertAfterElement = $(`#${bookmarkOrder[i]}`);
                                break;
                            }
                        }
                        if (insertAfterElement) {
                            insertAfterElement.after(`<div id="${list}" class="bookmark-items"></div>`);
                        } else {
                            $('#myFavorite').prepend(`<div id="${list}" class="bookmark-items"></div>`);
                        }
                    }

                    let config = {childList: true, subtree: true, attributes: true};

                    // list에 대한 observer 설정
                    let listNode = $(`#${list}`)[0];
                    if (listNode) {
                        listObserver.observe(listNode, config);
                    }

                    $(this).addClass("active");
                    $('#' + list).append(fieldset);
                    setFavoriteScreen.f.updateButtonOrder(list);
                });

                $(document).off("click", `#${list} fieldset .icon`).on("click", `#${list} fieldset .icon`, function () {
                    $(this).closest("fieldset").attr("disabled", "disabled");
                    let dataSeq = $(this).closest("fieldset").attr("data-seq")
                    if (dataSeq) {
                        setFavoriteScreen.v.delList.push(dataSeq);
                    }
                    console.log(setFavoriteScreen.v.delList);

                    setFavoriteScreen.v.myFavListLength = $('#bookmarkMrnList fieldset:not([disabled])').length + $('#bookmarkOtherList fieldset:not([disabled])').length + $('#bookmarkMteacherList fieldset:not([disabled])').length + $('#bookmarkLinkList fieldset:not([disabled])').length;
                    console.log(setFavoriteScreen.v.myFavListLength);
                });

                $(document).off("click", `#${list} .button-wrap button:first-child`).on("click", `#${list} .button-wrap button:first-child`, function () {
                    let fieldset = $(this).closest('fieldset');
                    let prevFieldset = fieldset.prev('fieldset');
                    if (prevFieldset.length > 0) {
                        prevFieldset.before(fieldset);
                    }
                    setFavoriteScreen.f.updateButtonOrder(list);
                });

                $(document).off("click", `#${list} .button-wrap button:last-child`).on("click", `#${list} .button-wrap button:last-child`, function () {
                    let fieldset = $(this).closest('fieldset');
                    let nextFieldset = fieldset.next('fieldset');
                    if (nextFieldset.length > 0) {
                        nextFieldset.after(fieldset);
                    }
                    setFavoriteScreen.f.updateButtonOrder(list);
                });
            });


            // 저장 프로세스
            $('#saveBtn').off().on("click", () => {
                console.log(setFavoriteScreen.v.initSaveList);
                setFavoriteScreen.f.initMyfavData();
                setFavoriteScreen.f.getMyFavData();
                if (_.isEqual(setFavoriteScreen.v.saveList.bookmarkMrnList, setFavoriteScreen.v.initSaveList.bookmarkMrnList) &&
                    _.isEqual(setFavoriteScreen.v.saveList.bookmarkOtherList, setFavoriteScreen.v.initSaveList.bookmarkOtherList) &&
                    _.isEqual(setFavoriteScreen.v.saveList.bookmarkMteacherList, setFavoriteScreen.v.initSaveList.bookmarkMteacherList) &&
                    _.isEqual(setFavoriteScreen.v.saveList.bookmarkLinkList, setFavoriteScreen.v.initSaveList.bookmarkLinkList) &&
                    setFavoriteScreen.v.delList.length === 0) {
                    $alert.open("MG00018");
                    return;
                }
                console.log(setFavoriteScreen.v.saveList);
                $alert.open("MG00017", () => {
                    $.ajax({
                        method: "POST",
                        url   : "/pages/api/mypage/saveFavorite.ax",
                        data  : {
                            saveList: JSON.stringify(setFavoriteScreen.v.saveList),
                            delList: setFavoriteScreen.v.delList,
                            subjectLevelCode: setFavoriteScreen.v.subjectLevelCode
                        },
                        // beforeSend: () => {
                        //    $('#loading').addClass("display-show");
                        // },
                        success: () => {
                            if (!_.isNil(setFavoriteScreen.v.callback) && typeof setFavoriteScreen.v.callback === 'function') {
                                setFavoriteScreen.v.callback();
                            }

                            setFavoriteScreen.c.getMyFavData();
                            setFavoriteScreen.c.getContentsList("mrnList");
                            setFavoriteScreen.c.getContentsList("otherList");
                            setFavoriteScreen.c.getContentsList("mteacherList");

                        },
                        // complete: () => {
                        //     $('#loading').removeClass("display-show");
                        // }
                    });
                });
            })

            // 전체추가
            $('#addAll').off().on("click", () => {
                let activeTab = $(".tab ul li.active a").attr("id");
                let bookmarkId = activeTab.replace("List", "") + "Bookmark";
                let ableBtn = $(`#${bookmarkId} button:not(.active)`).length;
                if (setFavoriteScreen.v.myFavListLength + ableBtn <= 40) {
                    $alert.open("MG00014", () => {
                        $(`#${bookmarkId} button:not(.active)`).each(function () {
                            $(this).click();
                        });
                    })
                } else {
                    $alert.open("MG00012");
                }
            })

            // 전체 해제
            $('#delAll').off().on("click", () => {
                if ($("#myFavorite fieldset:not([disabled]) .icon").length === 0) {
                    $alert.open("MG00015");
                    return;
                }
                $("#myFavorite fieldset:not([disabled]) .icon").each(function () {
                    $(this).click();

                    setFavoriteScreen.v.myFavListLength = $('#bookmarkMrnList fieldset:not([disabled])').length + $('#bookmarkOtherList fieldset:not([disabled])').length + $('#bookmarkMteacherList fieldset:not([disabled])').length + $('#bookmarkLinkList fieldset:not([disabled])').length;
                    console.log(setFavoriteScreen.v.myFavListLength);
                });
            });

            // 링크 탭 폼 초기화
            $('#linkList').off().on("click", () => {
                $('#link-url').val("");
                $('#link-name').val("");
            })

            // 링크 즐겨찾기 추가
            $('#addLink').off().on("click", function () {
                let value = 0;
                let url = $('#link-url').val();
                let name = $('#link-name').val();

                // 값체크
                if (!name) {
                    $('#errLinkName').addClass('flag-error');
                    return;
                } else {
                    $('#errLinkName').removeClass('flag-error');
                }

                if (!url) {
                    $('#errLinkUrl').addClass('flag-error');
                    return;
                } else {
                    $('#errLinkUrl').removeClass('flag-error');
                }

                if (setFavoriteScreen.v.myFavListLength === 40) {
                    return $alert.open("MG00012");
                }

                if ($('.box-no-data').length > 0) $('.box-no-data').remove();

                let fieldset = $('<fieldset>').addClass('item').attr('value', value).attr('data-url', url).attr('data-name', name);
                let button = $('<button>').attr('type', 'button');
                let icon = $('<span>').addClass('icon').append('<svg><title>빼기 아이콘</title><use xlink:href="/assets/images/svg-sprite-solid.svg#icon-minus"></use></svg>');
                let ul = $('<ul>').addClass('divider-group');
                ul.append($('<li>').text(name));
                button.append(icon).append(ul);
                fieldset.append(button);

                let buttonWrap = $('<div>').addClass('button-wrap');
                let upButton = $('<button>').attr('type', 'button').append('<svg><title>위 아이콘 </title><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-up"></use></svg>');
                let downButton = $('<button>').attr('type', 'button').attr('disabled', 'disabled').append('<svg><title>아래 아이콘</title><use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-caret-radius-down"></use></svg>');
                buttonWrap.append(upButton).append(downButton);
                fieldset.append(buttonWrap);

                let list = 'bookmarkLinkList'; // 리스트 아이디 설정

                if ($(`#${list}`).length === 0) {
                    let index = bookmarkOrder.indexOf(list);
                    let insertAfterElement = null;
                    for (let i = index - 1; i >= 0; i--) {
                        if ($(`#${bookmarkOrder[i]}`).length > 0) {
                            insertAfterElement = $(`#${bookmarkOrder[i]}`);
                            break;
                        }
                    }
                    if (insertAfterElement) {
                        insertAfterElement.after(`<div id="${list}" class="bookmark-items"></div>`);
                    } else {
                        $('#myFavorite').prepend(`<div id="${list}" class="bookmark-items"></div>`);
                    }
                }

                $(this).addClass("active");
                $('#' + list).append(fieldset);
                setFavoriteScreen.f.updateButtonOrder(list);

                $alert.open("MG00021", () => {
                    $('#reg-add-link').removeClass("display-show");
                    $('a[href="#tab2-1"]').trigger("click");
                });
            });

            // 링크 즐겨찾기 취소
            $('#cancelLink').off().on("click", function () {
                $alert.open("MG00022", () => {
                    $('#reg-add-link').removeClass("display-show");
                    $('a[href="#tab2-1"]').trigger("click");
                })
            })
            $('#closeBtnLink').off().on("click", () => {
                $alert.open("MG00022", () => {
                    $('#reg-add-link').removeClass("display-show");
                    $('a[href="#tab2-1"]').trigger("click");
                })
            })

            // 나의 즐겨찾기 셀렉트 이벤트
            $('#myFavSelect').change(function (e) {
                let value = e.target.value.charAt(0) + e.target.value.slice(1).toLowerCase();

                $('#myFavorite .bookmark-items').removeClass('display-show').addClass('display-hide');

                if (e.target.value === 'ALL') {
                    $('#myFavorite .bookmark-items').addClass('display-show').removeClass('display-hide');
                } else {
                    $('#bookmark' + value + 'List').addClass('display-show').removeClass('display-hide');
                }

                console.log(value)
            })

            // 링크 즐겨찾기 등록 링크명 25자 제한
            $('#link-name').off().on("input", function() {
                if($(this).val().length > 25) {
                    $(this).val($(this).val().slice(0, 25));
                }
            });
        },

        init: () => {

            setFavoriteScreen.v.gradeCode = $('#hiddenGrade').val();

            let bookmarkTypes = {
                'mrnBookmark'     : 'bookmarkMrnList',
                'otherBookmark'   : 'bookmarkOtherList',
                'mteacherBookmark': 'bookmarkMteacherList',
                'linkBookmark'    : 'bookmarkLinkList'
            };

            $.each(bookmarkTypes, function (bookmark, list) {
                let bookmarkObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            setFavoriteScreen.v.myFavListLength = $('#bookmarkMrnList fieldset:not([disabled])').length + $('#bookmarkOtherList fieldset:not([disabled])').length + $('#bookmarkMteacherList fieldset:not([disabled])').length + $('#bookmarkLinkList fieldset:not([disabled])').length;
                            // 버튼상태 업데이트
                            $(`#${bookmark} button`).each(function () {
                                let value = $(this).val();
                                let matchingFieldset = $(`#${list} fieldset[value="${value}"]`);
                                if (matchingFieldset.length > 0) {
                                    $(this).addClass('active');
                                } else {
                                    $(this).removeClass('active');
                                }
                            });
                        }
                    });
                });

                let config = {childList: true, subtree: true};

                let bookmarkNode = $(`#${bookmark}`)[0];
                if (bookmarkNode) {
                    bookmarkObserver.observe(bookmarkNode, config);
                }
            });

            setFavoriteScreen.event();

            const lists = setFavoriteScreen.v.bookmarkList;
            lists.forEach(list => {
                $(`#${list} fieldset.item:not(:disabled)`).each(function () {
                    const value = $(this).attr('value');
                    const dataSeq = $(this).data('seq') || null;
                    const dataUrl = $(this).data('url') || null;
                    const dataName = $(this).data('name') || null;
                    const item = {value, dataSeq, dataUrl, dataName};
                    setFavoriteScreen.v.initSaveList[list].push(item);
                });
            });
        },
    };
    setFavoriteScreen.init()
});