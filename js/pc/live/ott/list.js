let channelScreen = {
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
    },

    c: {

        /**
         * 스크랩, 좋아요
         * @param {*} type scrapBtn: 스크랩 / likeBtn: 좋아요
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
                    if (res.resultMsg == 'add') {
                        channelScreen.v.scrapTarget.addClass('active');
                    } else {
                        channelScreen.v.scrapTarget.removeClass('active');
                    }
                    if(type === 'likeBtn') callback(masterSeq, res);
                }
            };


            $cmm.ajax(options);
        },

        /**
         * 목록 조회
         * @param {*} pagingNow
         */
        getContentSearchList: (pagingNow) => {

            channelScreen.f.setSearchCondition(pagingNow);
            const options = {
                url: '/pages/api/live/ott/getContentList.ax',
                method: 'GET',
                contentType: 'application/json',
                data: channelScreen.v.searchCondition,
                success: function (res) {
                    channelScreen.v.resultList = res.rows;

                    if (res.totalCnt > 0) {
                        $('.pagination').removeClass('display-hide');
                        $('.pagination').addClass('display-show-flex');
                    } else {
                        $('.pagination').removeClass('display-show-flex');
                        $('.pagination').addClass('display-hide');
                    }

                    $('strong[name=totalCnt]').text(res.totalCnt);
                    channelScreen.f.bindDataList();
                    $paging.bindTotalboardPaging(res);
                    toggleThis('.toggle-this');
                }
            };

            $cmm.ajax(options);
        },
    },

    f: {

        moveHref: (e) => {
            e.preventDefault();
            let href = e.currentTarget.href;
            if (href.indexOf('contentSeq') > -1) {
                if (!channelScreen.f.checkLogin() || !channelScreen.f.checkUserGrade()) return;
            }
            location.href = href;
        },

        checkUserGrade: () => {
            if ($('#userGrade').val() !== '002') {
                $alert.open("MG00011", () => {});
                return false;
            }
            return true;
        },

        /**
         * 검색조건 세팅
         * @param {*} pagingNow
         */
        setSearchCondition: (pagingNow) => {
            channelScreen.v.searchCondition.searchTxt = $('input[name=searchTxt]').val();
            channelScreen.v.searchCondition.channelSeq = $('input[name=channelSeq]').val();
            channelScreen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
        },

        /**
         * 목록 바인딩
         * item list 구조
         * image-wrap
         *  (썸네일)
         */
        bindDataList: () => {
            let $boardItems = $('#boardItems');

            $boardItems.empty();
            $('.box-no-data').addClass("hidden");
            $('.pagination').removeClass("hidden");

            if ($('strong[name=totalCnt]').text() > 0) {
                channelScreen.v.resultList.map((data, idx) => {
                    let $item = $(`<div class="item"></div>`);
                    let $imageWrap = $(`<div class="image-wrap">
                                          <img src="${data.thumbUploadMethod == 'URL' ? data.thumbLink : data.thumbUploadMethod == 'CMS' ? data.thumbParameter : data.thumbImageFileId}" alt="" />
                                          <div class="info-media">
                                            ${data.attahcFileCnt > 0 ? '<img src="/assets/images/common/icon-clip-elementary.svg" alt="clip-elementary 아이콘" />' : ''}
                                            ${data.duration != '' ? '<span class="time">' + channelScreen.f.getVideoTimeForm('min', data.duration) + ':' + channelScreen.f.getVideoTimeForm('sec', data.duration) + '</span>' : ''}
                                          </div>
                                        </div>`);
                    let $innerWrap = $(`<div class="inner-wrap"></div>`);
                    let $textWrap = $(`<div class="text-wrap">
                                          <a href="./detail.mrn?contentSeq=${data.contentSeq}">
                                            <p class="title">${data.contentName}</p>
                                            <p class="desc">${data.contentSummary}</p>
                                          </a>
                                        </div>`);
                    let $boardButtons = $(`<div class="board-buttons"></div>`);
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
                    $boardButtons.append($buttons).append($masterInput).append($button);
                    $innerWrap.append($textWrap).append($boardButtons)
                    $boardItems.append($item.append($imageWrap).append($innerWrap));
                });
            } else {
                if ($('strong[name=totalCnt]').text() < 1) {
                    if ($('#searchTxt').val()) {
                        $('div[id=no-search-data]').removeClass("hidden");
                    } else {
                        $('div[id=no-saved-data]').removeClass("hidden");
                    }
                    $('.pagination').addClass("hidden");
                }
            }
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
            channelScreen.v.scrapTarget = $(e.currentTarget);
            const type = $(e.currentTarget).attr('name');
            const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();
            channelScreen.c.procOttScrap(type, masterSeq, channelScreen.f.syncLikeCount);
        },

        /**
         * 좋아요 count
         * @param {*} masterSeq
         * @param {*} likeYn
         */
        syncLikeCount: (masterSeq, data) => {

            const $count = $(`[name=masterSeq][value=${masterSeq}]`).siblings('button[name=likeBtn]').find('span');
            $count.text(parseInt(data.totalCnt));
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
            channelScreen.c.getContentSearchList(pagingNow);
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

                channelScreenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
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

        openShare: (e) => {
            if (!channelScreen.f.checkLogin()) return;
            openPopup({id: 'popup-share-sns'});
            let href = window.document.location.href;
            href = href.substring(0, href.indexOf('list'));
            href += `detail.mrn?contentSeq=${e.currentTarget.value}`;
            $('input[name=hrefName]').val(href);
        }
    },

    event: function () {
        $(document).on('click', '[name=shareCloseBtn]', (e)=> {
            closePopup({id: 'popup-share-sns'});
        });

        //검색
        $('button[name=searchBtn]').on('click', () => {
            channelScreen.c.getContentSearchList();
        });
        $('input[name=searchTxt]').on('keyup', (e) => {
            if (e.keyCode === 13) channelScreen.c.getContentSearchList();
        });

        //스크랩, 좋아요
        $(document).on('click', '[name=likeBtn],[name=scrapBtn]', channelScreen.f.toggleScrap);

        //공유하기
        $(document).on('click', '[name=liveShareBtn]', channelScreen.f.openShare);

        //페이징
        $(document).on("click", "button[type=button][name=pagingNow]", channelScreen.f.setPaging);

        $(document).on("click", "#main-contents a", channelScreen.f.moveHref);
    },

    init: function () {
        channelScreen.c.getContentSearchList();
        channelScreen.event();

        if (channelScreen.v.totalCnt > 0) {
            $('.pagination').removeClass('display-hide');
            $('.pagination').addClass('display-show-flex');
        } else {
            $('.pagination').removeClass('display-show-flex');
            $('.pagination').addClass('display-hide');
        }
    },
};
channelScreen.init();


let $ttbdAjax = channelScreen.c;
