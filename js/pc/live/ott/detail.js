let contentScreen = {
    v: {
        masterSeq: $('input[name=masterSeq]').val(),
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
        scrapTarget: null
    },

    c: {
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
                    if (res.resultMsg == 'add') {
                        contentScreen.v.scrapTarget.addClass('active');
                    } else {
                        contentScreen.v.scrapTarget.removeClass('active');
                    }
                    if(type === 'likeBtn') callback(masterSeq, res);
                }
            };

            $cmm.ajax(options);
        },
    },

    f: {

        parseHtmlContent: () => {
            const content = $('.editor-area').text();
            const modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
            $('.editor-area').html(modifiedContent);
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
            contentScreen.v.scrapTarget = $(e.currentTarget);
            const type = $(e.currentTarget).attr('name');
            const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();

            contentScreen.c.procOttScrap(type, masterSeq, contentScreen.f.syncLikeCount);
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
            if (contentScreen.f.checkLogin()) {
                const fileId = $(e.currentTarget).data('id');
                let link = document.createElement("a");

                link.target = "_blank";
                link.href = `/pages/api/file/down/${fileId}`;
                link.click();
                link.remove();
            }
        },

        // 정회원 체크
        checkUserGrade: () => {
            if ($('#userGrade').val() === '001') {
                $alert.open("MG00011", () => {});
                return false;
            }
            return true;
        },

        // 파일 미리보기
        previewFile: (e) => {
            if (contentScreen.f.checkLogin()) {
                const fileId = $(e.currentTarget).data('id');
                let fileType = $(e.currentTarget).data('type');
                if (fileType === 'CMS' && $(e.currentTarget).data('cmstype') === 'video') {
                    fileType = 'HLS';
                }
                let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}`;
                mteacherViewer.get_file_info(fileId).then(res => {

                    screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
                }).catch(err => {
                    console.error(err);
                    alert("서버 에러");
                });
            }
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
            if (!contentScreen.f.checkLogin()) return;
            openPopup({id: 'popup-share-sns'});
            let href = window.document.location.href;
            $('input[name=hrefName]').val(href);
        },

    },

    event: function () {

        $(document).on('click', '[name=shareCloseBtn]', (e)=> {
            closePopup({id: 'popup-share-sns'});
        });

        //스크랩, 좋아요
        $(document).on('click', '[name=likeBtn],[name=scrapBtn]', contentScreen.f.toggleScrap);

        //공유하기
        $(document).on('click', '[name=liveShareBtn]', contentScreen.f.openShare);

        // single file 다운로드
        $(document).on("click", "button[name=downloadBtn]", contentScreen.f.downSingleFile);

        // 파일 미리보기
        $(document).on("click", "button[name=previewBtn]", contentScreen.f.previewFile);

    },

    init: function () {
        contentScreen.event();
        contentScreen.f.parseHtmlContent();
    },

};
contentScreen.init();


let $ttbdAjax = contentScreen.c;
