$(function () {
    let screen = {
        v: {
            right: $('#boardRight').val(),
            contentsTabCategoryType: 'todayClass',
            contentsTabCategoryList: [],
            mainFavoriteList: []
        },

        c: {
            /**
             *  관리자 추천 Tab 별 게시글 목록 가져오기
             *
             * @memberOf getContentsTabDisplayList
             */
            getContentsTabDisplayList: () => {
                const options = {
                    method: 'GET',
                    url: '/pages/ele/main/getContentsTabDisplayList.ax',
                    data: {
                        subjectLevelCode: 'ELEMENT',
                        contentsTabCategoryType: screen.v.contentsTabCategoryType,
                    },
                    success: function (res) {
                        console.log(res);
                        screen.v.contentsTabCategoryList = res?.rows;
                        screen.f.setContentsTabDisplayList();
                    }
                };

                $.ajax(options);
            },


            getKoreaBasicOrKoreaMusicList: () => {
                const options = {
                    method: 'GET',
                    url: '/pages/ele/main/getKoreaBasicOrKoreaMusicList.ax',
                    data: {
                        subjectLevelCode: 'ELEMENT',
                        contentsTabCategoryType: screen.v.contentsTabCategoryType,
                    },
                    success: function (res) {
                        // console.log(res.rows);
                        screen.v.contentsTabCategoryList = res?.rows;
                        screen.f.setKoreaBasicOrKoreaMusicList();

                    }
                };

                $.ajax(options);
            },

            /**
             *  나의 즐겨찾기 목록 가져오기
             *
             * @memberOf getMainFavoriteList
             */
            getMainFavoriteList: () => {
                const options = {
                    method: 'GET',
                    url: '/pages/ele/main/getMainFavoriteList.ax',
                    data: {
                        subjectLevelCode: 'ELEMENT',
                    },
                    success: function (res) {
                        console.log(res);
                        screen.v.mainFavoriteList = res?.rows;
                        screen.f.setMainFavoriteList();
                    }
                };

                $.ajax(options);
            },

        },

        f: {

            /**
             * 영상길이 form
             * @param {*} type 분/초
             * @returns
             */
            getVideoTimeForm: (type, duration) => {
                let result = '';

                type === 'min' ?
                    result = parseInt(!duration ? 0 : duration / 60)
                    : result = parseInt(!duration ? 0 : duration % 60);


                return String(result).padStart(2, "0");
            },

            /**
             *  관리자 추천 Tab 별 게시글 목록 가져오기
             *
             * @memberOf getContentsTabDisplayList
             */
            setContentsTabDisplayList: () => {
                const $boardItem = $('.grid-items')
                $boardItem.empty();

                screen.v.contentsTabCategoryList.map((data, k) => {
                    let res = `
                        <a href="${data?.viewPageYn === 'Y' ? data.pageUrl + '/' + data.masterSeq : data.pageUrl}" data-contents="tab" data-rightyn="${data?.listPageUseYn}" data-rights="${data?.listPageRight}">
                            <div class="image-wrap">
                                <span class="badge type-rounded" title="사회 3-1">${data.name}</span>
                                <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
                                ${!$text.isEmpty(data?.videoPlayTime) && data?.videoPlayTime > 0 ? '<span class="badge type-round-box">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
                            </div>
                            <div class="inner-wrap">
                                <ul class="divider-group">
                                    <li>${data?.name}</li>
                                </ul>
                                <p class="title">${data.title}</p>
                            </div>
                        </a>
                    `
                    $boardItem.append(res);
                })
            },

            setKoreaBasicOrKoreaMusicList: () => {
                const $boardItem = $('.grid-items')
                $boardItem.empty();

                screen.v.contentsTabCategoryList.map((data, k) => {
                    let res = `
                        <a href="javascript:void(0);" data-name="${screen.v.contentsTabCategoryType}" data-id="${data?.referenceFileId}" data-seq="${data.referenceSeq}" data-type="${data?.referenceFileUploadMethod}" data-cmstype="${data?.duration ? 'Y' : 'N'}">
                            <div class="image-wrap">
                                <span class="badge type-rounded" title="${data?.textbookName}">${data?.textbookName}</span>
                                <img src="${!(data?.thumbnailPath) ? '/assets/images/common/img-no-img.png' : data.thumbnailPath}" alt="" />
                                ${!$text.isEmpty(data?.duration) ? '<span class="badge type-round-box">' + screen.f.getVideoTimeForm('min', data.duration) + ':' + screen.f.getVideoTimeForm('sec', data.duration) + '</span>' : ''}
                            </div>
                            <div class="inner-wrap">
                                <ul class="divider-group">
                                 ${!$text.isEmpty(data?.unitName) ? ('<li>' + data?.unitName + '</li>') : ''}
                                 ${!$text.isEmpty(data?.chasiName) ? ('<li>' + data?.chasiName + '</li>') : ''}
                                </ul>
                                <p class="title">${data?.referenceName}</p>
                            </div>
                        </a>
                    `
                    $boardItem.append(res);
                })
            },

            // 나의 즐겨찾기 리스트 뿌려주기
            setMainFavoriteList: () => {
                const $favoriteList = $('#mainFavoriteListWrap');
                const $favoriteItem = $('#mainFavoriteList');

                $favoriteList.empty();
                $favoriteItem.empty();

                screen.v.mainFavoriteList.map((data, k) => {
                    let res = '';

                    if (data.favoriteType === "MRN" || data.favoriteType === "VIEW") {
                        // 미래엔 교과서
                        res = `
                            <div class="swiper-slide" tabindex="0">
                                <img src="/assets/images/elementary/icon-main-world.svg" alt="평가 자료실 아이콘" />

                                <div class="item-inner">
                                    <p class="title">${data?.textbookName}</p>
                                    <p> ${data?.publisherName}</p>
                                    <p> ${'(' + data?.leadAuthorName + ')'}</p>
                                </div>
                                <img src="${data?.coverImagePath}" alt="" class="${data.coverImagePath ? 'cover' : 'display-hide'}" />
                                <div class="overlay">
                                    <a href="${data.favoriteUrl + '&tabType=classTab'}"
                                        class="button type-third size-md">수업하기</a>
                                    <a href="${data.favoriteUrl + '&tabType=referenceTab'}"
                                        class="button type-third size-md">평가자료</a>
                                </div>
                            </div>
                        `
                    } else if (data.favoriteType === "OTHER") {
                        // 타사교과서
                        res = `
                            <div class="swiper-slide" tabindex="0"
                                style="background-color: ${data?.bgRgbCode ? ('#' + data.bgRgbCode) : '#fae9d9'}">
                                <img src="${data?.iconImagePath ? data.iconImagePath : '/assets/images/elementary/icon-main-test-reference.svg'}" alt="평가 자료실 아이콘" />
                                <div class="item-inner">
                                    <p class="title">${data.textbookName}</p>
                                    <p>${data?.publisherName}</p>
                                    <p>${'(' + data?.leadAuthorName + ')'}</p>
                                </div>
                                <div class="overlay">
                                    <a href="${data?.favoriteUrl}" class="button type-third size-md">바로가기</a>
                                </div>
                            </div>
                        `
                    } else if (data.favoriteType === "MTEACHER" || data.favoriteType === "LINK") {
                        res = `
                            <div class="swiper-slide" tabindex="0">
                                <img src="/assets/images/common/logo-alclass.svg" alt="우리 반 학습관리 솔루션 아이콘" />
                                <div class="item-inner text-dark">${data.favoriteName}</div>
                                <div class="overlay">
                                    <a href="${data.favoriteUrl}" class="button type-third size-md">바로가기</a>
                                </div>
                            </div>
                        `
                    }

                    $favoriteItem.append(res);
                })

                $favoriteList.append($favoriteItem);
                $favoriteList.append(`<button class="swiper-button-prev"></button>`);
                $favoriteList.append(`<button class="swiper-button-next"></button>`);

            },


            // 현재창 링크 이동
            moveLink: (link) => {
                location.href = link;
            },


            /**
             * 가이드 부분 링크 이동
             * */

            // 로그인 체크 후 새창 이동
            checkLoginBeforeMoveLink: (url) => {
                if (!$isLogin) {
                    $alert.open('MG00001');
                    return;
                } else {
                    window.open(url, "_blank");
                }
            },


            /**
             * 오늘의 수업 뷰어 열기
             * */

            // 파일 미리보기
            previewFile: (e) => {
                const fileId = $(e.currentTarget).data('id');
                const seq = $(e.currentTarget).data('seq');
                let fileType = $(e.currentTarget).data('type');

                let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&referenceSeq=${seq}&type=TEXTBOOK`;
                mteacherViewer.get_file_info(fileId).then(res => {

                    screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
                }).catch(err => {
                    console.error(err);
                    alert("서버 에러");
                });
            },

            openSetFavorite: (e) => {
                if (!$isLogin) {
                    $(e.currentTarget).removeClass('active');
                    $alert.open('MG00001');
                    return;
                } else {
                    $('button[name=setFavEle]').attr("target-obj", "popupBookMark");
                    $('#setFavoriteForm').append($('<input>', {
                        type: "hidden",
                        name: "subjectLevelCode",
                        value: "ELEMENT"
                    }));
                    $('#setFavoriteForm').append($('<input>', {
                        type: 'hidden',
                        name: 'urlLevel',
                        value: '/ele/'
                    }));
                    $('#setFavoritePopup').removeAttr("src");
                    // $('#popupBookMark').addClass("display-show");
                    $('#setFavoriteForm').submit();
                    $('#loading').addClass("display-show");
                }
            },

            relaodScreen: () => {
                window.scrollTo(0, 0);
                location.reload();
            },

            getMainRecommendData: (e) => {

                const contentsTabCategoryType = e.target.getAttribute("data-id");

                screen.v.contentsTabCategoryType = contentsTabCategoryType;

                if (contentsTabCategoryType === "koreanBasic" || contentsTabCategoryType === "koreaMusic" || contentsTabCategoryType === "todayClass") {
                    screen.c.getKoreaBasicOrKoreaMusicList();
                } else {
                    screen.c.getContentsTabDisplayList();
                }
            },

            getCheckRightMainRecommendData: (e) => {
                e.preventDefault();

                // 비로그인 체크
                if (!$isLogin) {
                    $alert.open('MG00001');
                    return;
                }

                // 정회원 외 등급(학원/강사, 준회원, 예비교사) - 오늘의 수업, 음악 제재곡 듣기
                if (screen.v.right !== "0010" && (screen.v.contentsTabCategoryType === "koreanBasic" || screen.v.contentsTabCategoryType === "koreaMusic" || screen.v.contentsTabCategoryType === "todayClass")) {
                    $alert.open('MG00047');
                    return;
                }

                if (screen.v.right === "0010" && (screen.v.contentsTabCategoryType === "koreanBasic" || screen.v.contentsTabCategoryType === "koreaMusic" || screen.v.contentsTabCategoryType === "todayClass")) {
                    screen.f.previewFile(e);
                }

            },




            // 초등 메인 - 계기교육 상세 페이지 이동
            checkChacneEducationRight: (e) => {

                e.preventDefault();

                const link = $(e.currentTarget).attr('href');

                // 비로그인 체크
                if (!$isLogin) {
                    $alert.open('MG00001');
                    return;
                }

                let isRight = false;

                if ($('#userGrade').val() === "002") {
                    isRight = true;
                }

                if (isRight) {
                    screen.f.moveLink(link);
                } else {
                    $alert.open('MG00047');
                    return;
                }
            },


            // 초등 메인 - 컨텐츠 탭의 상세보기 들어갈때 권한 체크
            checkContentsTabRight: (e) => {

                e.preventDefault();

                const link = $(e.currentTarget).attr('href');

                const readUseYn = $(e.currentTarget).data('rightyn');
                const readRight = $(e.currentTarget).data('rights');

                if (readUseYn === 'N' || !readRight) {
                    location.href = link;
                } else {
                    const arrRight = readRight.split(';');
                    let isRight = false;
                    for (let i = 0; i < arrRight.length; i++) {
                        if (arrRight[i] === $('#boardRight').val()) {
                            isRight = true;
                            break;
                        }
                    }
                    if (!$isLogin) {
                        $alert.open('MG00001');
                        return;
                    }
                    if (isRight) {
                        location.href = link;
                    } else {
                        $alert.open('MG00004');
                        return;
                    }
                }
            }


        },

        event: function () {

            $(document).on("click", "input[name=grid-selection]", screen.f.getMainRecommendData);
            $(document).on("click", ".grid-items a", screen.f.getCheckRightMainRecommendData);

            $('#chanceEducationList a').on('click', screen.f.checkChacneEducationRight);

            $('#chanceEducationLinkBtn').off('click').on('click', () => {
                screen.f.moveLink("/pages/ele/board/creativexp/chanceEducation.mrn/1067")
            });

            /**
             * 가이드 부분 링크 이동
             * */
            // 미래엔 도서몰 (Vol.321)
            $('#mainAppleNumbersMoveButton').off('click').on('click', () => {
                // screen.f.checkLoginBeforeMoveLink("https://mall.mirae-n.com/main/index.do");
                window.open("https://mall.mirae-n.com/main/index.do", "_blank");
            });
            // 미래교육상
            $('#mainTeacherAuthInfoButton').off('click').on('click', () => {
                // screen.f.checkLoginBeforeMoveLink("https://ele.m-teacher.co.kr/award/mjmirae10.mrn");
                window.open("https://e.m-teacher.co.kr/pages/award/mjmirae10.mrn", "_blank");
            });
            // 교과서 박물관
            $('#mainClassroomDataInfoButton').off('click').on('click', () => {
                // screen.f.moveLink("https://www.textbookmuseum.co.kr/index.mrn");
                window.open("https://www.textbookmuseum.co.kr/index.mrn", "_blank");
            });


            // $(document).on('click', '[data-name]', screen.f.previewFile);
            $(document).on('click', '[data-contents]', screen.f.checkContentsTabRight);

            // 즐겨찾기 > 설정
            $("button[name=setFavEle]").off("click").on("click", screen.f.openSetFavorite);

            // 즐겨찾기 설정 이벤트
            $('#setFavoritePopup').on('load', function () {
                $(this).contents().find('#cancelBtn').off().on("click", () => {
                    $alert.open("MG00019", () => {
                        $('#popupBookMark').removeClass('display-show');
                        $('#setFavoritePopup').attr('src', 'about:blank');
                        // screen.c.getMainFavoriteList();
                        screen.f.relaodScreen();
                    })
                })

                $(this).contents().find('#closeBtn').off().on("click", () => {
                    $('#popupBookMark').removeClass('display-show');
                    $('#setFavoritePopup').attr('src', 'about:blank');
                    $('body').removeClass('active-overlay');
                    // screen.c.getMainFavoriteList();
                    screen.f.relaodScreen();
                })
                $('#loading').removeClass("display-show");
            })
        },

        init: function () {
            console.log('초등 메인 init!');
            screen.event();
        },
    };
    screen.init();
});