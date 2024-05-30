let screen = {
    v: {
        searchSelf: null,
        shareSeq: null,
        tab: null,
        pagingNum: 10, // 페이징 limit
        searchCondition: {},
    },

    c: {
        getDataShareCommentList: () => {
            screen.v.searchSelf = $('#my-comments').is(':checked') ? 'Y' : 'N';

            $.ajax({
                method: "GET",
                url: `/pages/api/live/dataShare/getCommentList.ax`,
                data: {
                    searchSelf: screen.v.searchSelf,
                    shareSeq: screen.v.shareSeq,
                    pagingNow: screen.v.searchCondition.pagingNow,
                },
                dataType: 'html',
                success: (res) => {
                    $('.comment').html(res);
                    $('.dropdown').dropdown()
                },
                error: (e) => {
                    console.log(e)
                }
            })

        },
    },

    f: {
        toggleActive: (el, isActive) => {
            if (isActive) {
                el.removeClass('active')
            } else {
                el.addClass('active')
            }
        },

        clickLikeBtn: (e) => {
            let $el = $(e.currentTarget)
            let isActive = $el.hasClass('active')
            console.log(isActive)
            let targetSeq = screen.v.shareSeq

            let param = new FormData();

            param.append('referenceSeq', targetSeq)
            param.append('scrapType', "DATASHARE-LIKE")

            if ($isLogin) {
                $.ajax({
                    type: "POST",
                    url: "/pages/api/live/dataShare/setLike.ax",
                    data: param,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.resultCode == '0000') {
                            $el.find('#likeCnt').text(res.returnInt)
                            if(res.resultMsg == 'D') {
                                $alert.open('MG00056')
                            } else if (res.resultMsg == 'A') {
                                $alert.open('MG00055')
                            }
                        } else {
                            screen.f.toggleActive($el, isActive)
                            alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                        }
                    },
                    error: function () { //시스템에러
                        screen.f.toggleActive($el, isActive)

                        alert("오류발생");
                    }
                });
            } else {
                screen.f.toggleActive($el, isActive)
                screen.f.loginAlert();
            }
        },

        clickScrapBtn: ($el, isActive) => {
            let targetSeq = screen.v.shareSeq

            let param = new FormData();

            param.append('referenceSeq', targetSeq)
            param.append('scrapType', "DATASHARE")

            $.ajax({
                type: "POST",
                url: "/pages/api/live/dataShare/setLike.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {
                        if(res.resultMsg == 'D') {
                            $alert.open('MG00042')
                        } else if (res.resultMsg == 'A') {
                            $alert.open('MG00041')
                        }
                    } else {
                        screen.f.toggleActive($el, isActive)
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    screen.f.toggleActive($el, isActive)
                    alert("오류발생");
                }
            });
        },

        /**
         * 공유하기
         * @param {*} e
         * @returns
         */
        shareCheck: (e) => {
            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                $alert.open('MG00001');
                $('#popup-share-sns').css('display', 'none');
                return;
            }

            if (isRight) {
                $('input[name=hrefName]').val(location.href)
                $('#popup-share-sns').css('display', 'block');
            } else {
                $alert.open('MG00047');
                $('#popup-share-sns').css('display', 'none');
                return;
            }
        },

        scrapCheck: (e) => {
            let $el = $(e.currentTarget)

            const isRight = screen.f.checkRight();
            let isActive = $el.hasClass('active')

            if (!$isLogin) {
                screen.f.toggleActive($el, isActive)

                $alert.open('MG00001');
                return;
            }

            if (isRight) {
                screen.f.clickScrapBtn($el, isActive)
            } else {
                screen.f.toggleActive($el, isActive)

                $alert.open('MG00047');
                $('#popup-share-sns').css('display', 'none');
                return;
            }
        },

        checkRight: () => {
            let isRight = false;

            if ($('#userGrade').val() === "002") {
                isRight = true;
            }

            return isRight
        },

        goDetailPage: (e) => {
            let seq = $(e.currentTarget).children('input').val()
            let tab = screen.v.tab;

            if(seq == null || seq === '') {
                return;
            }

            let param = new FormData();
            param.append("shareSeq", seq)

            $.ajax({
                type: "POST",
                url: "/pages/api/live/dataShare/updateHitCnt.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {

                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
            window.location.href = `./detail.mrn?tab=${tab}&seq=${seq}`
        },

        popupDelete: () => {
            $alert.open('MG00061', screen.f.deleteDataShare)
        },

        goModifyPage: () => {
            location.href = `./modify.mrn?tab=${screen.v.tab}&seq=${screen.v.shareSeq}`
        },

        deleteDataShare: () => {
            let seq = screen.v.shareSeq

            let param = new FormData();
            param.append("shareSeq", seq)

            $.ajax({
                type: "POST",
                url: "/pages/api/live/dataShare/deleteDataShare.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {
                        alert('삭제되었습니다.')
                        screen.f.goList()
                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
        },

        fileDownload: (e) => {
            let $el = $(e.currentTarget)
            let fileId = $el.closest('li').children('input[name=fileId]').val()

            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                $alert.open('MG00001');
                return;
            }

            if (isRight) {
                let link = document.createElement('a');
                link.target = '_blank';
                link.href = `/pages/api/file/down/${fileId}`;
                link.click();
                link.remove();
            } else {
                $alert.open('MG00047');
                $('#popup-share-sns').css('display', 'none');
                return;
            }
        },

        goList: () => {
            window.location.href = './Main.mrn'
        },

        // 페이징
        setPaging: (e) => {
            const pagingNow = e.currentTarget.value;

            screen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;

            screen.c.getDataShareCommentList();
        },

        checkContentLength: (e) => {
            $('.digits').text(`${$('#commentArea').val().length} / 200`)
        },

        saveCommentCheck: () => {
            const isRight = screen.f.checkRight();

            if (!$isLogin) {
                $alert.open('MG00001');
                return;
            }

            // if (isRight) {
                if($('#commentArea').val() == '') {
                    $alert.open('MG00006');
                } else {
                    $alert.open('MG00007', screen.f.saveComment);
                }
            // } else {
            //     $alert.open('MG00047');
            //     $('#popup-share-sns').css('display', 'none');
            //     return;
            // }
        },

        saveComment: () => {
            let param = new FormData();

            param.append('shareSeq', screen.v.shareSeq)
            param.append('content', $('#commentArea').val())

            $.ajax({
                type: "POST",
                url: "/pages/api/live/dataShare/saveComment.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {
                        screen.c.getDataShareCommentList();
                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });

        },

        deleteComment: (e) => {
            let commentSeq = $(e.currentTarget).closest('li[name=item]').find('input[name=shareCommentSeq]').val()

            let param = new FormData();

            param.append('shareCommentSeq', commentSeq);

            $alert.open("MG00008", () => {
                const options = {
                    url: '/pages/api/live/dataShare/deleteComment.ax',
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: param,
                    success: function (res) {
                        screen.c.getDataShareCommentList();
                    }
                };

                $cmm.ajax(options);
            });
        },

        openModForm: (e) => {
            $(e.currentTarget).closest('li[name=item]').find('.comment-text').addClass('hidden')
            $(e.currentTarget).closest('li[name=item]').find('#commentContent').addClass('hidden')
            $(e.currentTarget).closest('li[name=item]').find('.comment-modify').removeClass('hidden')
        },

        closeModForm: (e) => {
            $(e.currentTarget).closest('li[name=item]').find('.comment-text').removeClass('hidden')
            $(e.currentTarget).closest('li[name=item]').find('#commentContent').removeClass('hidden')
            $(e.currentTarget).closest('li[name=item]').find('.comment-modify').addClass('hidden')
        },

        modifyComment: (e) => {
            let commentSeq = $(e.currentTarget).closest('li[name=item]').children('input[name=shareCommentSeq]').val()
            let content = $(e.currentTarget).closest('li[name=item]').find('textarea[name=modCommentArea]').val()
            let param = new FormData();

            param.append('shareCommentSeq', commentSeq);
            param.append('content', content);

            $alert.open("MG00009", () => {
                const options = {
                    url: '/pages/api/live/dataShare/modifyComment.ax',
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: param,
                    success: function (res) {
                        screen.c.getDataShareCommentList();
                    }
                };

                $cmm.ajax(options);
            });
        },

        getMyComment: () => {
            screen.v.searchCondition.pagingNow = 0;

            screen.c.getDataShareCommentList();
        },

        parseHtmlContent: () => {
            const content = $('.editor-area').html();
            const modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
            $('.editor-area').html(modifiedContent);
        },
    },

    event: function () {
        $(document).on("click", 'button[name=btnScrap]', screen.f.scrapCheck);

        $(document).on("click", 'button[name=btnShare]', screen.f.shareCheck);

        $(document).on("click", 'button[name=btnLike]', screen.f.clickLikeBtn);

        $(document).on("click", '.pageBtn', screen.f.goDetailPage);

        $(document).on("click", '.delete-button', screen.f.popupDelete);

        $(document).on("click", '.modify-button', screen.f.goModifyPage);

        $(document).on("click", 'button[name=fileDownBtn]', screen.f.fileDownload);

        $(document).on("click", 'button[name=saveCommentBtn]', screen.f.saveCommentCheck);

        $(document).on("keyup", '#commentArea', screen.f.checkContentLength);

        $(document).on("keyup", '#modCommentArea', screen.f.checkContentLength);

        // $(document).on("click", 'li[name=delCommentBtn]', screen.f.deleteComment);

        // $(document).on("click", 'li[name=modCommentBtn]', screen.f.openModForm);

        // $(document).on("click", '.modCancelBtn', screen.f.closeModForm);

        // $(document).on("click", '.modCommentSaveBtn', screen.f.modifyComment);

        $(document).on("click", '#my-comments', screen.f.getMyComment);

        $(document).on("click", 'button[name=pagingNow]', screen.f.setPaging);
    },

    init: function () {
        screen.v.shareSeq = $('input[name=shareSeq]').val()
        screen.v.tab = $('#tab').val()

        screen.c.getDataShareCommentList()

        screen.event();

        screen.f.parseHtmlContent()
        console.log('Main init!!')
    },

}

screen.init();
