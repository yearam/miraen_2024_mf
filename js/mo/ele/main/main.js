$(function () {
    let screen = {
        v: {
            right: $('#boardRight').val(),
            contentsTabCategoryType: 'todayClass',
            contentsTabCategoryList: [],
            mainFavoriteList: [],
            // 모바일 초등 메인은 더보기 기능 추가
            pageNo: 1,
            pageCount: 4,
            totalPage: 3,
            moEleMainYn: true,
            moreBtnYn: 'N',
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
                        // 모바일 더보기 추가(pageNo, moEleMainYn)
                        pageNo: screen.v.pageNo, // 현재 페이지 번호
                        moEleMainYn: screen.v.moEleMainYn, // 모바일 초등 메인 유무 FLAG
                    },
                    success: function (res) {
                        console.log(res);
                        screen.v.contentsTabCategoryList = res?.rows;
                        screen.v.moreBtnYn = res?.rows[0].moreBtnYn; // 더보기 버튼 유무 FLAG
                        screen.v.totalPage = res?.rows[0].totalPage; // 총 페이지 수 체크
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
                        // 모바일 더보기 추가(pageNo, moEleMainYn)
                        pageNo: screen.v.pageNo, // 현재 페이지 번호
                        moEleMainYn: screen.v.moEleMainYn, // 모바일 초등 메인 유무 FLAG
                    },
                    success: function (res) {
                        // console.log(res.rows);
                        screen.v.contentsTabCategoryList = res?.rows;
                        screen.v.moreBtnYn = res?.rows[0].moreBtnYn; // 더보기 버튼 유무 FLAG
                        screen.v.totalPage = res?.rows[0].totalPage; // 총 페이지 수 체크
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
                const $boardItem = $('.board-items')
                // 현재 페이지가 1이면 루프를 제거. 아니면 현재 더보기 버튼만 제거.
                screen.v.pageNo === 1 ? $boardItem.empty() : $('button.moreBtn').remove();

                screen.v.contentsTabCategoryList.map((data, k) => {
                    let res = `
                        <a href="${data?.viewPageYn === 'Y' ? data.pageUrl + '/' + data.masterSeq : data.pageUrl}" class="item" data-contents="tab" data-rightyn="${data?.listPageUseYn}" data-rights="${data?.listPageRight}">
                            <div class="image-wrap">
                                <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
                                ${!$text.isEmpty(data?.videoPlayTime) && data?.videoPlayTime > 0 ? '<span class="badge type-round-box">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
                            </div>
                            <div class="inner-wrap">
                                <span class="badge text-elementary size-md" title="사회 3-1">${data.name}</span>
                                <ul class="divider-group">
                                    <li>${data?.name}</li>
                                </ul>
                                <p class="title">${data.title}</p>
                            </div>
                        </a>
                    `
                    $boardItem.append(res);
                })
                $boardItem.append(screen.f.moreBtnHtml);
            },

            setKoreaBasicOrKoreaMusicList: () => {
                const $boardItem = $('.board-items')
                // 현재 페이지가 1이면 루프를 제거. 아니면 현재 더보기 버튼만 제거.
                screen.v.pageNo === 1 ? $boardItem.empty() : $('button.moreBtn').remove();

                screen.v.contentsTabCategoryList.map((data, k) => {
                    let res = `
                        <a href="javascript:void(0);" class="item" data-name="${screen.v.contentsTabCategoryType}" data-id="${data?.referenceFileId}" data-seq="${data.referenceSeq}" data-type="${data?.referenceFileUploadMethod}" data-cmstype="${data?.duration ? 'Y' : 'N'}">
                            <div class="image-wrap">
                                <img src="${!(data?.thumbnailPath) ? '/assets/images/common/img-no-img.png' : data.thumbnailPath}" alt="" />
                                ${!$text.isEmpty(data?.duration) ? '<span class="badge type-round-box">' + screen.f.getVideoTimeForm('min', data.duration) + ':' + screen.f.getVideoTimeForm('sec', data.duration) + '</span>' : ''}
                            </div>
                            <div class="inner-wrap">
                                <span class="badge text-elementary size-md" title="${data?.textbookName}">${data?.textbookName}</span>
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
                $boardItem.append(screen.f.moreBtnHtml);
            },

            moreBtnHtml: () => {
                return `
                    <button class="more-button button moreBtn ${screen.v.moreBtnYn !== 'Y' ? 'display-hide' : ''}">
                        <svg>
                            <title>아이콘 - icon-reload</title>
                            <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-reload"></use>
                        </svg> 다음 컨텐츠 보기 <span>${screen.v.pageNo}<em>/${screen.v.totalPage}</em></span>
                    </button>
                `
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
                console.log(fileId + ',' + seq + ',' + fileType)

                let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&referenceSeq=${seq}&type=TEXTBOOK`;
                mteacherViewer.get_file_info(fileId).then(res => {

                    screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
                }).catch(err => {
                    console.error(err);
                    alert("서버 에러");
                });
            },

            getMainRecommendData: (e) => {

                // 필터 클릭이 아닌 더보기 버튼 클릭 일 때를 위해 수정
                const contentsTabCategoryType = e.target.getAttribute("data-id") !== null ? e.target.getAttribute("data-id") : screen.v.contentsTabCategoryType;

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
            // 메인 > 필터 클릭 이벤트
            $(document).on("click", "button[name=grid-selection]", function(e) {
                const $filterBtn = $('button[name=grid-selection]')
                $filterBtn.addClass('active');
                $filterBtn.removeClass('active');
                $(e.currentTarget).addClass('active');
                // 모바일 더보기 추가
                screen.v.pageNo = 1;

                screen.f.getMainRecommendData(e);
            });

            // 오늘의 수업 등 리스트(루프) 하단 > 더보기 클릭 이벤트
            $(document).on("click", "button.moreBtn", function(e) {
                screen.v.pageNo += 1;

                screen.f.getMainRecommendData(e);
            });

            // 메인 > 필터 > 오늘의수업 등 리스트(루프) 클릭 이벤트
            $(document).on("click", ".board-items a", screen.f.getCheckRightMainRecommendData);

            // 메인 > 계기교육 클릭 이벤트
            $('#chanceEducationList a').on('click', screen.f.checkChacneEducationRight);

            // 메인 > 계기교육 > 더보기 클릭 이벤트
            $('#chanceEducationLinkBtn').off('click').on('click', () => {
                screen.f.moveLink("/pages/ele/board/creativexp/chanceEducation.mrn/1067")
            });

            // 메인 > 필터 > 관리자추천 필터(학급경영/쉬는시간) > 리스트(루프) 클릭 이벤트
            $(document).on('click', '[data-contents]', screen.f.checkContentsTabRight);

            // 고객 안내 영역 > 원격 지원 요청
            $('#remote').on('click', () => {
                alert("원격 지원 요청은 PC에서 사용 가능합니다.")
            });

            // 고객 안내 영역 > 카카오톡 상담
            $('#kakao').on('click', () => {
               alert("카카오톡에서 \'엠티처\' 검색을 해주세요.");
            });
        },

        init: function () {
            console.log('초등 메인 init!');
            screen.event();
        },
    };
    screen.init();
});