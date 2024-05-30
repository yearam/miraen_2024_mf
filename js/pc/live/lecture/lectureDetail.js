let lectureScreen = {
    v: {
        totalCnt: $('[name=totalCnt]').text(),
        textbookInfoUseYn: $('[name=textbookInfoUseYn]').val() ? $('[name=textbookInfoUseYn]').val() : 'N',
        thumbnailLongYn: $('[name=thumbnailLongYn]').val() ? $('[name=thumbnailLongYn]').val() : 'N',
        schoolLevelForItem: $('[name=schoolLevelForItem]').val() ? $('[name=schoolLevelForItem]').val() : '',
        mainId: new URLSearchParams(location.search).get('programSeq'),
        mainInfo: {},
        pagingNow: 0,
        searchCondition: {},
        resultList: [],
    },

    c: {

    },

    f: {

        /**
         * 좋아요 count
         * @param {*} masterSeq
         * @param {*} likeYn
         */
        syncLikeCount: (masterSeq, likeYn) => {

            const $count = $(`[name=masterSeq][value=${masterSeq}]`).siblings('button[name=likeBtn]').find('span');
            const originCnt = $count.text();
            if (likeYn === 'Y') {
                $count.text(parseInt(originCnt) + 1);
            } else {

                $count.text(parseInt(originCnt) - 1);
            }
        },

        waitAlert: (e) => {
            e.preventDefault();
            $alert.open('MG00062', () => {});
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

                lectureScreenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
            }).catch(err => {
                alert("서버 에러");
            });
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
            if ($('#userGrade').val() === '001') {
                $alert.open("MG00011", () => {
                });
                return false;
            }
            return true;
        },

        goApplicant: (e) => {
            e.preventDefault();
            if (lectureScreen.f.checkLogin()) {
                location.href = e.currentTarget.href;
            }
        },

        openShare: (e) => {
            if (lectureScreen.f.checkLogin()) {
                let formData = new FormData();
                $('input[name=hrefName]').val(window.document.location.href);
                formData.append('programSeq', $('#seq').val());
                openPopup({id: 'popup-share-sns'});

                const options = {
                    url: '/pages/api/live/lecture/procProgramShare.ax',
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (res) {
                    }
                };

                $cmm.ajax(options);
            }
            $('body').removeClass('active-overlay');
        },

        parseHtmlContent: () => {
            let content = $('.lecture-list .desc').html();
            let modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
            $('.lecture-list .desc').html(modifiedContent);

            content = $('.box-info').html();
            modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
            $('.box-info').html(modifiedContent);
        },
    },

    event: function () {

        $(document).on('click', '[name=shareCloseBtn]', (e)=> {
            closePopup({id: 'popup-share-sns'});
        });

        $(document).on('click', 'textarea[id=commentArea]', lectureScreen.f.checkLogin);

        $(document).on('click', 'a[id=applicantBtn]', lectureScreen.f.goApplicant);

        //공유하기
        $(document).on("click", "[name=liveShareBtn]", lectureScreen.f.openShare);

        // 파일 미리보기
        $(document).on("click", "button[name=previewBtn]", lectureScreen.f.previewFile);

        $(document).on("click", "a[id=btnWait]", lectureScreen.f.waitAlert);

        $(document).on("click", "[name=checkLogin]", lectureScreen.f.checkLogin);
    },

    init: function () {
        lectureScreen.event();
        lectureScreen.f.parseHtmlContent();

        if (lectureScreen.v.totalCnt > 0) {
            $('.pagination').removeClass('display-hide');
            $('.pagination').addClass('display-show-flex');
        } else {
            $('.pagination').removeClass('display-show-flex');
            $('.pagination').addClass('display-hide');
        }
    },
};
lectureScreen.init();


let $ttbdAjax = lectureScreen.c;
