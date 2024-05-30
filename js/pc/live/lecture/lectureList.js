let programScreen = {
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

        /**
         * 목록 조회
         * @param {*} pagingNow
         */
        getProgramCommentList: (pagingNow) => {

            programScreen.f.setSearchCondition(pagingNow);
            const options = {
                url: '/pages/api/live/lecture/getProgramCommentList.ax',
                method: 'GET',
                contentType: 'application/json',
                data: programScreen.v.searchCondition,
                success: function (res) {
                    programScreen.v.resultList = res.rows;
                    programScreen.v.totalCnt = res.totalCnt;

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
                    programScreen.f.bindDataList();
                    $paging.bindTotalboardPaging(res);
                    toggleThis('.toggle-this');
                    $('.dropdown').dropdown();
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

            programScreen.v.searchCondition = {};
        },

        /**
         * 검색조건 세팅
         * @param {*} pagingNow
         */
        setSearchCondition: (pagingNow) => {
            programScreen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
            programScreen.v.searchCondition.mainId = programScreen.v.mainId;
        },

        /**
         * 목록 바인딩
         * item list 구조
         * image-wrap
         *  (썸네일)
         */
        bindDataList: () => {
            const $boardItem = $('div[class=comments] ul');

            $boardItem.empty();
            $('.pagination').removeClass("hidden");
            if (programScreen.v.totalCnt > 0) {
                programScreen.v.resultList.map((data, idx) => {
                    let $parentDiv = $(`<li ${data.createLoginId == $('#loginId').val() ? 'class="flag-my"' : ''} id="${data.liveCommentSeq}-comment"></li>`);
                    let $info = $(`<div class="block-wrap">
                                      <ul class="divider-group">
                                        <li>
                                          <p class="user-id">${data.loginId}</p>
                                        </li>
                                        <li>
                                          <p class="user-job">${data.schoolLevel == 'HIGH' ? '고등학교' : data.schoolLevel == 'MIDDLE' ? '중학교' : '초등학교'} 선생님</p>
                                        </li>
                                      </ul>
                                      <!-- !NOTE : 공유 여부에 따라 노출 or 비노출 -->
                                      ${data.didShareEvent > 0 ? '<span class="badge fill-elementary type-rounded">공유완료</span>' : ''}
                                    </div>
                                    <p class="comment-text">${programScreen.f.enterScript(data.content)}</p>
                                    <span class="date">${data.date}</span>`);
                    let $dropdownDiv = $(`<div class="dropdown"></div>`);
                    let $dropdownIcon = $(`<button class="icon-button">
                                            <svg>
                                              <use href="/assets/images/svg-sprite-solid.svg#icon-kebab" />
                                            </svg>
                                          </button>`);
                    let $dropdownItem = $(`<ul class="items">
                                            <li><a id="${data.liveCommentSeq}-modifyFormBtn" onclick="programScreen.f.changeModifyForm(event)">수정</a></li>
                                            <li><a id="${data.liveCommentSeq}-deleteBtn" onclick="programScreen.f.deleteComment(event)">삭제</a></li>
                                          </ul>`);
                    $dropdownDiv.append($dropdownIcon).append($dropdownItem);
                    $parentDiv.append($info).append($dropdownDiv);
                    $boardItem.append($parentDiv);
                });
            } else {
                if (programScreen.v.totalCnt < 1) {
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

            programScreen.c.doTotalboardScrap(type, scrapYn, masterSeq, programScreen.f.syncLikeCount);
        },

        changeModifyForm: (e) => {
            e.preventDefault();
            let commentSeq = e.currentTarget.id.replace('-modifyFormBtn', '');
            $('[class=flag-modify]').addClass('flag-my').removeClass('flag-modify');

            $(`#${commentSeq}-comment`).removeClass('flag-my');
            $(`#${commentSeq}-comment`).addClass('flag-modify');
            let content = $(`#${commentSeq}-comment [class=comment-text]`).text();
            $(`#${commentSeq}-comment span[class=date]`).after($(`<div class="comment-modify">
                                                                  <textarea name="" id="contentModifyArea" rows="5" placeholder="${content}">${content}</textarea>
                                                                  <div class="buttons align-right">
                                                                    <button class="button size-md type-white" id="${commentSeq}-cancelBtn">취소</button>
                                                                    <button class="button size-md type-primary-light" id="${commentSeq}-modifyBtn">저장</button>
                                                                  </div>
                                                                </div>`));

        },

        cancelModifyForm: (e) => {
            let commentSeq = e.currentTarget.id.replace('-cancelBtn', '');
            $(`#${commentSeq}-comment`).removeClass('flag-modify');
            $(`#${commentSeq}-comment`).addClass('flag-my');
            $(`#${commentSeq}-comment div[class=comment-modify]`).remove();
        },

        deleteComment: (e) => {
            let commentSeq = e.currentTarget.id.replace('-deleteBtn', '');
            $alert.open("MG00008", () => {
                const options = {
                    url: '/pages/api/live/lecture/deleteComment.ax',
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: programScreen.f.getParam(commentSeq),
                    success: function (res) {
                        programScreen.c.getProgramCommentList();
                    }
                };

                $cmm.ajax(options);
            });
        },

        procModifyComment: (e) => {
            if (programScreen.f.checkLogin() && programScreen.f.checkEmptyTextarea('modify') && programScreen.f.checkUserGrade()) {
                let commentSeq = e.currentTarget.id.replace('-modifyBtn', '');
                $alert.open("MG00009", () => {
                    const options = {
                        url: '/pages/api/live/lecture/procModifyComment.ax',
                        method: 'POST',
                        contentType: false,
                        processData: false,
                        data: programScreen.f.getParam(commentSeq),
                        success: function (res) {
                            programScreen.c.getProgramCommentList();
                        }
                    };

                    $cmm.ajax(options);
                });
            }
        },

        goApplicant: (e) => {
            e.preventDefault();
            if (e.currentTarget.className.indexOf('active') > -1) {
                if (!$isLogin) {
                    $alert.open('MG00001');
                    return;
                }

                location.href = `./applicant.mrn?lectureSeq=${e.currentTarget.id.replace('goApplicantBtn', '')}`;
            }
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

            link.currentTarget = "_blank";
            link.href = `/pages/api/file/down/${fileId}`;
            link.click();
            link.remove();
        },

        // 페이징
        setPaging: (e) => {
            const pagingNow = e.currentTarget.value;
            programScreen.c.getProgramCommentList(pagingNow);
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

                programScreenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
            }).catch(err => {
                alert("서버 에러");
            });
        },

        waitAlert: (e) => {
            e.preventDefault();
            $alert.open('MG00062', () => {});
        },

        endLecture: (e) => {
            e.preventDefault();
            $alert.open('MG00075', () => {});
        },

        // textarea 글자 입력 시 글자 수 감지
        changeCommentSize: (e) => {
            if (programScreen.f.checkLogin()) {
                $('#contentSize').text(e.currentTarget.value.length);
            }
        },

        openEventPopup: () => {
            // BIND
            $('input[name=userName]').val($('#userName').val());
            $('input[name=email]').val($('#email').val());
            $('input[name=mobilePhone]').val($('#mobilePhone').val());
            $('input[name=schoolName]').val($('#schoolName').val());
            $('input[name=schoolSeq]').val($('#schoolSeq').val());
        },

        // 로그인 체크
        checkLogin: () => {
            if (!$isLogin) {
                $alert.open("MG00001");
                return false;
            }
            return true;
        },

        // textarea 공백 체크
        checkEmptyTextarea: (type) => {
            if (type == 'add') {
                if ($('#commentArea').val().trim().length < 20) {
                    $alert.open("MG00043", () => {});
                    return false;
                }
            } else {
                if ($('#contentModifyArea').val().trim().length < 20) {
                    $alert.open("MG00043", () => {});
                    return false;
                }
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

        getParam: (commentSeq) => {
            let formData = new FormData();
            if ($('#commentArea').val() == null || $('#commentArea').val().trim().length < 1) {
                formData.append('content', $('#contentModifyArea').val());
            } else {
                formData.append('content', $('#commentArea').val());
            }
            formData.append('liveCommentSeq', _.isNil(commentSeq) ? 0 : commentSeq);
            formData.append('programSeq', $('#seq').val());
            return formData;
        },

        procComment: (e) => {
            if (programScreen.f.checkLogin() && programScreen.f.checkEmptyTextarea('add') && programScreen.f.checkUserGrade()) {
                if (!$('#didEvent').val()){
                    $('#didEvent').attr('target-obj', 'join-event');
                    $('#didEvent').click();
                } else {
                    $('#didEvent').removeAttr('target-obj');
                }
                if (!$('#didEvent').attr('target-obj')) {
                    // 댓글 등록
                    !$alert.open("MG00007", () => {
                        const options = {
                            url: '/pages/api/live/lecture/procComment.ax',
                            method: 'POST',
                            contentType: false,
                            processData: false,
                            data: programScreen.f.getParam(),
                            success: function (res) {
                                if (res.resultMsg === 'suc') {
                                    $('#commentArea').val('');
                                    programScreen.c.getProgramCommentList();
                                } else if (res.resultMsg === 'dup') {
                                    $alert.open("MG00067", () => {$('#cancelEventBtn').click();});
                                } else {
                                    $alert.open("MG00068", () => {$('#cancelEventBtn').click();});
                                }
                            }
                        };

                        $cmm.ajax(options);
                    }) ;
                }
                programScreen.f.openEventPopup();
            }
        },

        openShare: (e) => {
            let type = e.currentTarget.id;
            if (!programScreen.f.checkLogin()) return;
            let val = e.currentTarget.value;
            let href = window.document.location.href;
            let formData = new FormData();
            openPopup({id: 'popup-share-sns'});
            if (val) {
                href = href.substring(0, (href.lastIndexOf('/') + 1));
                $('input[name=hrefName]').val(href + `detail.mrn?lectureSeq=${val}`);
                formData.append('lectureSeq', val);
            } else {
                $('input[name=hrefName]').val(href);
            }
            formData.append('programSeq', $('#seq').val());
            formData.append('type', type);

            const options = {
                url: '/pages/api/live/lecture/procProgramShare.ax',
                method: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                success: function (res) {
                    programScreen.c.getProgramCommentList();
                }
            };

            $cmm.ajax(options);
        },

        enterScript(str){
            str = str.replace(/\n/ig, '<br>');
            str = str.replace(/\\n/ig, '<br>');
            str = str.replace(/\n/ig, '<br>');
            return str;
        },

    },

    event: function () {

        $(document).on('click', '[name=shareCloseBtn]', (e)=> {
            closePopup({id: 'popup-share-sns'});
        });

        $(document).on('click', 'button[id$=goApplicantBtn]', programScreen.f.goApplicant);

        $(document).on('click', 'button[id$=cancelBtn]', programScreen.f.cancelModifyForm);

        $(document).on('click', 'button[id$=modifyBtn]', programScreen.f.procModifyComment);

        $(document).on('click', 'button[id=procCommentBtn]', programScreen.f.procComment);

        $(document).on('input', 'textarea[id=commentArea]', programScreen.f.changeCommentSize);

        $(document).on('click', 'textarea[id=commentArea]', programScreen.f.checkLogin);

        //스크랩, 좋아요
        $(document).on('click', '[name=likeBtn],[name=scrapBtn]', programScreen.f.toggleScrap);

        $(document).on("click", "[name=liveShareBtn]", programScreen.f.openShare);

        //페이징
        $(document).on("click", "button[type=button][name=pagingNow]", programScreen.f.setPaging);

        // single file 다운로드
        $(document).on("click", "button[name=downloadBtn]", programScreen.f.downSingleFile);

        // 파일 미리보기
        $(document).on("click", "button[name=previewBtn]", programScreen.f.previewFile);

        $(document).on("click", "a[id=btnWait]", programScreen.f.waitAlert);

        $(document).on("click", "a[id=endLectureBtn]", programScreen.f.endLecture);

        $(document).on("click", "[name=checkLogin]", programScreen.f.checkLogin);

    },

    init: function () {
        programScreen.c.getProgramCommentList();
        programScreen.event();

        if (programScreen.v.totalCnt > 0) {
            $('.pagination').removeClass('display-hide');
            $('.pagination').addClass('display-show-flex');
        } else {
            $('.pagination').removeClass('display-show-flex');
            $('.pagination').addClass('display-hide');
        }
    },
};
programScreen.init();


let $ttbdAjax = programScreen.c;
