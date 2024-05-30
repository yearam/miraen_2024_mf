let mainScreen = {
    v: {
        mainInfoList: JSON.parse($('[name=mainInfoList]').val()),
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
         * 목록 조회
         * @param {*} pagingNow
         */
        getProgramSearchList: (pagingNow) => {

            mainScreen.f.setSearchCondition(pagingNow);
            const options = {
                url: '/pages/api/live/lecture/getProgramSearchList.ax',
                method: 'GET',
                contentType: 'application/json',
                data: mainScreen.v.searchCondition,
                success: function (res) {
                    mainScreen.v.resultList = res.rows;

                    if (res.totalCnt > 0) {
                        $('div[name=box-no-data]').hide();

                        $('.pagination').removeClass('display-hide');
                        $('.pagination').addClass('display-show-flex');
                    } else {
                        $('div[name=box-no-data]').show();

                        $('.pagination').removeClass('display-show-flex');
                        $('.pagination').addClass('display-hide');
                    }

                    $('strong[name=totalCnt]').text(res.totalCnt);
                    mainScreen.f.bindDataList();
                    $paging.bindTotalboardPaging(res);
                    toggleThis('.toggle-this');
                }
            };

            $cmm.ajax(options);
        },
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
         * 탭 전환
         * @param {*} e
         */
        changeTab: (e) => {
            //초기화
            mainScreen.f.initState();
            //탭 타입으로 조건
            mainScreen.v.searchCondition.tabType = e.currentTarget.id;
            mainScreen.v.tabTypeList.map(value => {
                if (e.currentTarget.href.toString().indexOf(value) > -1) {
                    mainScreen.v.tabType = value;
                }
            })
            //영역 id 재설정
            $('#main-contents .pane').attr('id', $(e.currentTarget).attr('href').replace('#', ''));

            mainScreen.c.getProgramSearchList();
        },

        /**
         * 검색조건 세팅
         * @param {*} pagingNow
         */
        setSearchCondition: (pagingNow) => {
            mainScreen.v.searchCondition.searchTxt = $('input[name=searchTxt]').val();
            mainScreen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
            mainScreen.v.searchCondition.sortType = 'times';
        },

        /**
         * 목록 바인딩
         * item list 구조
         * image-wrap
         *  (썸네일)
         */
        bindDataList: () => {
            const $boardItem = $('div[class=lecture-list]');

            $boardItem.empty();
            $('.pagination').removeClass("hidden");
            if ($('strong[name=totalCnt]').text() > 0) {
                mainScreen.v.resultList.map((data, idx) => {
                    let $parentDiv = $(`<div class="item ${data.isEndProgram == 1 ? 'end' : ''}"></div>`);
                    let $imgWrap = $(`<a href="./list.mrn?programSeq=${data.programSeq}" class="img-wrap">
                                            <div class="overlay"><strong class="badge type-round-box size-sm fill-black">종료</strong></div>
                                            <img src="${data.thumbImageFileId}" alt="리스트 이미지">
                                        </a>`);
                    let $info = $(`<div class="info-wrap">
                                        <a href="./list.mrn?programSeq=${data.programSeq}" class="title-wrap">
                                            <p class="title">${data.programName}</p>
                                            <p class="desc">${data.programContent}</p>
                                        </a>
                                    </div>`);
                    let $itemsParentDiv = $('<div class="time-table"></div>');
                    data.lectureList.map((item, idx) => {
                        $itemsParentDiv.append($(`<a href="./detail.mrn?lectureSeq=${item.lectureSeq}">
                                        <p class="round">${item.times}회차</p>
                                        <p class="time">${item.lectureStartDay} ${item.lectureStartTime}</p>
                                        ${item.status == 1 ? '<span class="badge type-rounded fill-elementary">진행중</span>' : 
                                            item.status == 2 ? '<span class="badge type-rounded fill-secondary-elementary">사전신청</span>' : 
                                            item.status == 3 ? '<span class="badge type-rounded">진행예정</span>' : 
                                            item.status == 4 ?( (
                                                item.replayYn == 'Y')?'<span class="badge type-rounded fill-green">다시보기</span>':'<span class="badge type-rounded fill-gray-100">종료</span>' )
                                                : ''}
                                    </a>`));
                    });
                    $info.append($itemsParentDiv);
                    $parentDiv.append($imgWrap).append($info);
                    $boardItem.append($parentDiv);
                });
            } else {
                if ($('strong[name=totalCnt]').text() < 1) {
                    $('.pagination').addClass("hidden");
                    $boardItem.append($('<div class="box-no-data"> 등록된 데이터가 없습니다. </div>'));
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
            const type = $(e.currentTarget).attr('name');
            let scrapYn = $(e.currentTarget).attr('class').indexOf('active');
            if (scrapYn > -1) scrapYn = 'Y';
            else scrapYn = 'N';
            const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();

            mainScreen.c.doTotalboardScrap(type, scrapYn, masterSeq, mainScreen.f.syncLikeCount);
        },

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
            mainScreen.c.getProgramSearchList(pagingNow);
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

                mainScreenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
            }).catch(err => {
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


    },

    event: function () {

        //탭전환
        $('.tab li a').on('click', mainScreen.f.changeTab);

        //검색
        $('button[name=searchBtn]').on('click', () => {
            mainScreen.c.getProgramSearchList();
        });
        $('input[name=searchTxt]').on('keyup', (e) => {
            if (e.keyCode === 13) mainScreen.c.getProgramSearchList();
        });

        //스크랩, 좋아요
        $(document).on('click', '[name=likeBtn],[name=scrapBtn]', mainScreen.f.toggleScrap);

        //공유하기
        // $(document).on('click', '[name=shareBtn]', mainScreen.f.openShare);

        //페이징
        $(document).on("click", "button[type=button][name=pagingNow]", mainScreen.f.setPaging);

        // single file 다운로드
        $(document).on("click", "button[name=downloadBtn]", mainScreen.f.downSingleFile);

        // 파일 미리보기
        $(document).on("click", "button[name=previewBtn]", mainScreen.f.previewFile);

    },

    init: function () {
        mainScreen.c.getProgramSearchList();
        mainScreen.event();

        if (mainScreen.v.totalCnt > 0) {
            $('.pagination').removeClass('display-hide');
            $('.pagination').addClass('display-show-flex');
        } else {
            $('.pagination').removeClass('display-show-flex');
            $('.pagination').addClass('display-hide');
        }
    },
};
mainScreen.init();


let $ttbdAjax = mainScreen.c;
