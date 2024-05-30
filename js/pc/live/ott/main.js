let mainScreen = {
    v: {
        totalCnt: $('[name=totalCnt]').text(),
        textbookInfoUseYn: $('[name=textbookInfoUseYn]').val() ? $('[name=textbookInfoUseYn]').val() : 'N',
        thumbnailLongYn: $('[name=thumbnailLongYn]').val() ? $('[name=thumbnailLongYn]').val() : 'N',
        schoolLevelForItem: $('[name=schoolLevelForItem]').val() ? $('[name=schoolLevelForItem]').val() : '',
        mainId: '',
        mainInfo: {},
        pagingNow: 0,
        tabType: 'tab1',
        tabTypeList: ['tab1', 'tab2', 'tab3'],
        searchCondition: {},
        resultList: [],
        totalCnt: 0,
    },

    c: {

        /**
         * 인기 콘텐츠 조회
         * @param {*} pagingNow
         */
        getPopularContentList: () => {

            const options = {
                url: '/pages/api/live/ott/getPopularContentList.ax',
                method: 'GET',
                contentType: 'application/json',
                success: function (res) {
                    mainScreen.v.resultList = res.rows;
                    mainScreen.v.totalCnt = res.totalCnt;
                    mainScreen.f.bindPopularDataList();
                    toggleThis('.toggle-this');
                }
            };

            $cmm.ajax(options);
        },

        /**
         * 전체 콘텐츠 조회
         * @param {*} pagingNow
         */
        getContentList: (pagingNow) => {

            mainScreen.f.setSearchCondition(pagingNow);
            const options = {
                url: '/pages/api/live/ott/getContentList.ax',
                method: 'GET',
                contentType: 'application/json',
                data: mainScreen.v.searchCondition,
                success: function (res) {
                    mainScreen.v.resultList = res.rows;
                    mainScreen.v.totalCnt = res.totalCnt;
                    mainScreen.f.bindUnPopularDataList();
                    $paging.bindTotalboardPaging(res);
                    toggleThis('.toggle-this');
                }
            };

            $cmm.ajax(options);
        },

        /**
         * 스크랩, 좋아요
         * @param {*} type scrapBtn: 스크랩 / likeBtn: 좋아요
         * @param {*} scrapYn Y: 활성화 / N: 비활성화(취소)
         * @param {*} masterSeq
         * @param {*} callback
         */
        procOttScrap: (type, masterSeq, callback)=> {
            let form = new FormData();
            form.append('referenceSeq', masterSeq);
            form.append('scrapType', type === 'scrapBtn' ? 'OTT' : 'OTT-LIKE');
            const options = {
                url: '/pages/api/live/ott/procOttScrap.ax',
                method: 'POST',
                contentType: false,
                processData: false,
                data: form,
                success: function (res) {
                    let $btn = $(`[name=masterSeq][value=${masterSeq}]`);
                    if (type === 'scrapBtn') {
                        $btn = $btn.siblings('div[class=buttons]').find(`button[name=${type}]`);
                    } else {
                        $btn = $btn.siblings(`button[name=${type}]`);
                    }
                    if (res.resultMsg == 'add') {
                        $.each($btn, function (i, v) {
                            $(this).addClass('active');
                        })
                    } else {
                        $.each($btn, function (i, v) {
                            $(this).removeClass('active');
                        })
                    }
                    if(type === 'likeBtn') callback(masterSeq, res);
                }
            };

            $cmm.ajax(options);
        }
    },

    f: {
        /**
         * 상태 초기화
         */
        initState: () => {
            //검색어
            $('input[name=searchTxt]').val('');

            mainScreen.v.searchCondition = {};
        },


        /**
         * 검색조건 세팅
         * @param {*} pagingNow
         */
        setSearchCondition: (pagingNow) => {
            mainScreen.v.searchCondition.searchTxt = $('input[name=searchTxt]').val();
            mainScreen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
        },

        /**
         * 인기 콘텐츠 목록 바인딩
         * item list 구조
         * image-wrap
         */
        bindPopularDataList: () => {
            let $boardItems = $('#popularItems');
            $('#popularList .box-no-data').addClass("hidden");
            $boardItems.empty();

            if (mainScreen.v.totalCnt > 0) {
                mainScreen.v.resultList.map((data, idx) => {
                    mainScreen.f.makeContentsComponents($boardItems, data);
                });
            } else {
                $boardItems.addClass("hidden");
                $('#popularList .box-no-data').removeClass("hidden");
            }
        },

        bindUnPopularDataList: () => {
            let $boardList = $('#unPopularList');
            let $boardItems = $('#unPopularItems');
            $('.pagination').removeClass("hidden");
            $('#unPopularList .box-no-data').addClass("hidden");
            $boardItems.empty();
            $boardList.addClass("hidden");

            if (mainScreen.v.totalCnt > 0) {
                mainScreen.v.resultList.map((data, idx) => {
                    mainScreen.f.makeContentsComponents($boardItems, data);
                    $boardItems.removeClass("hidden");
                });
            } else {
                $('.pagination').addClass("hidden");
                $boardItems.addClass("hidden");
                $boardList.removeClass("hidden");
                $('#unPopularList .box-no-data').removeClass("hidden");
            }
        },

        makeContentsComponents: (wrap, data) => {
            let $parentDiv = $(`<div class="item ${data.isRecently == 1 ? 'new-channel' : ''}"></div>`);
            let $imgWrap = $(`<div class="image-wrap">
                                    <img src="${data.thumbUploadMethod == 'URL' ? data.thumbLink : data.thumbUploadMethod == 'CMS' ? data.thumbParameter : data.thumbImageFileId}" alt="" />
                                    <div class="info-media">
                                        ${data.attahcFileCnt > 0 ? '<img src="/assets/images/common/icon-clip-elementary.svg" alt="clip-elementary 아이콘" />' : ''}
                                        ${data.duration != '' ? '<span class="time">' + mainScreen.f.getVideoTimeForm('min', data.duration) + ':' + mainScreen.f.getVideoTimeForm('sec', data.duration) + '</span>' : ''}
                                    </div>
                                </div>`);
            let $innerWrap = $(`<div class="inner-wrap"></div>`);
            let $textWrap = $(`<div class="text-wrap">
                                  <ul class="divider-group">
                                    <li>${data.channelName}</li>
                                  </ul>
                                  <a href="./detail.mrn?contentSeq=${data.contentSeq}">
                                    <p class="title">${data.contentName}</p>
                                    <p class="desc">${data.contentSummary}</p>
                                  </a>
                                </div>`);
            let $buttonWrap = $(`<div class="board-buttons"></div>`);
                                  // <button type="button" name="scrapBtn" class="button type-icon size-sm toggle-this ${data.scrapSeq != null && data.scrapSeq != '' ? 'active' : ''}">
                                  //   <svg>
                                  //     <title>아이콘 스크랩</title>
                                  //     <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-pin-diagonal"></use>
                                  //   </svg>
                                  // </button>
            let $buttons = $(`<div class="buttons">
                                  <button type="button" class="button type-icon size-sm" name="liveShareBtn" value="${data.contentSeq}">
                                    <svg>
                                      <title>아이콘 공유</title>
                                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                                    </svg>
                                  </button>
                                </div>`);
            let $button = $(`<button type="button" name="likeBtn" class="like size-sm toggle-this ${data.likeSeq != null && data.likeSeq != '' ? 'active' : ''}">
                                <svg>
                                    <title>아이콘 좋아요</title>
                                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-like"></use>
                                </svg> <span>${data.likeCount}</span>
                              </button>`);
            let $masterInput = $(`<input type="hidden" name="masterSeq" value="${data.contentSeq}">`);
            $innerWrap.append($textWrap).append($buttonWrap.append($buttons).append($masterInput).append($button));
            $parentDiv.append($imgWrap).append($innerWrap);
            wrap.append($parentDiv);
        },

        /**
         * 스크랩, 좋아요 toggle
         * @param {*} e
         * @returns
         */
        toggleScrap: (e) => {
            if (!$isLogin) {
                $alert.open('MG00001');
                $(e.currentTarget).removeClass('active');
                return;
            }
            mainScreen.v.scrapTarget = $(e.currentTarget);
            const type = $(e.currentTarget).attr('name');
            const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();

            mainScreen.c.procOttScrap(type, masterSeq, mainScreen.f.syncLikeCount);
        },

        moveHref: (e) => {
            e.preventDefault();
            let href = e.currentTarget.href;
            if (href.indexOf('contentSeq') > -1) {
                if (!mainScreen.f.checkLogin() || !mainScreen.f.checkUserGrade()) return;
            }
            location.href = href;
        },

        /**
         * 좋아요 count
         * @param {*} masterSeq
         * @param {*} likeYn
         */
        syncLikeCount: (masterSeq, data) => {

            let $btn = $(`[name=masterSeq][value=${masterSeq}]`).siblings('button[name=likeBtn]');
            if ($btn.length > 1) {
                $.each($btn, function (i, v) {
                    const $count = $(this).find('span');
                    $count.text(parseInt(data.totalCnt));
                })
            } else {
                const $count = $btn.find('span');
                $count.text(parseInt(data.totalCnt));
            }
        },


        // single file 다운로드
        downSingleFile: (e) => {
            const fileId = $(e.currentTarget).data('id');
            let link = document.createElement("a");

            link.target = "_blank";
            link.href = `/pages/api/file/down/${fileId}`;
            link.click();
            link.remove();
        },

        // 페이징
        setPaging: (e) => {
            const pagingNow = e.currentTarget.value;
            mainScreen.c.getContentList(pagingNow);
        },

        // 파일 미리보기
        previewFile: (e) => {
            const fileId = $(e.currentTarget).data('id');
            let fileType = $(e.currentTarget).data('type');
            if (fileType === 'CMS' && $(e.currentTarget).data('cmstype') === 'video') {
                fileType = 'HLS';
            }
            let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}`;
            mteacherViewer.get_file_info(fileId).then(res => {

                mainScreenUI.f.winOpen(previewUrl, 800, 1000, null, 'preview');
            }).catch(err => {
                console.error(err);
                alert("서버 에러");
            });
        },


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

            return String(result).padStart(2, '0');
        },

        // 로그인 체크
        checkLogin: () => {
            if (!$isLogin) {
                $alert.open("MG00001");
                return false;
            }
            return true;
        },

        // 정회원 체크
        checkUserGrade: () => {
            if ($('#userGrade').val() !== '002') {
                $alert.open("MG00011", () => {});
                return false;
            }
            return true;
        },

        openShare: (e) => {
            if (!mainScreen.f.checkLogin()) return;
            openPopup({id: 'popup-share-sns'});
            let href = window.document.location.href;
            href = href.replace('Main.mrn', `detail.mrn?contentSeq=${e.currentTarget.value}`);
            $('input[name=hrefName]').val(href);
        }
    },

    event: function () {
        $(document).on('click', '[name=shareCloseBtn]', (e)=> {
            closePopup({id: 'popup-share-sns'});
        });

        //검색
        $('button[name=searchBtn]').on('click', () => {
            mainScreen.c.getContentList();
        });

        $('input[name=searchTxt]').on('keyup', (e) => {
            if (e.keyCode === 13) mainScreen.c.getContentList();
        });

        //스크랩, 좋아요
        $(document).on('click', '[name=likeBtn],[name=scrapBtn]', mainScreen.f.toggleScrap);

        //공유하기
        $(document).on('click', '[name=liveShareBtn]', mainScreen.f.openShare);

        //페이징
        $(document).on("click", "button[type=button][name=pagingNow]", mainScreen.f.setPaging);

        // single file 다운로드
        $(document).on("click", "button[name=downloadBtn]", mainScreen.f.downSingleFile);

        // 파일 미리보기
        $(document).on("click", "button[name=previewBtn]", mainScreen.f.previewFile);

        $(document).on("click", "#main-contents a", mainScreen.f.moveHref);
    },

    init: function () {
        mainScreen.c.getPopularContentList();
        mainScreen.c.getContentList();
        mainScreen.event();

    },
};
mainScreen.init();


let $ttbdAjax = mainScreen.c;
