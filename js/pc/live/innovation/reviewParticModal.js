let screenReviewParticModal = {
    v: {

    },

    c: {

    },

    f: {
        saveReview: () => {
            let param = new FormData();

            param.append("contentSeq", $('select[name=webzineList]').val())
            param.append("reviewContent", $('textarea[name=reviewContent]').val())
            param.append("mobilePhone", $('input[name=mobilePhone]').val())
            param.append("schoolName", $('input[name=schoolName]').val())
            param.append("schoolSeq", $('input[name=schoolSeq]').val())
            param.append("agreeYn", $('#ox1').is(':checked') ? 'Y' : 'N')

            $.ajax({
                type: "POST",
                url: "/pages/api/live/innovation/saveReview.ax",
                data: param,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.resultCode == '0000') {
                        alert('후기 등록이 완료되었습니다.')
                        window.location.reload()
                    } else {
                        alert('서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.');
                    }
                },
                error: function () { //시스템에러
                    alert("오류발생");
                }
            });
        },

        open: (param) => {
            $('#popup-review').css('display', 'block');
        }
    },

    event: function() {
        $('button[name=btnModalClose]').on('click', function () {
            $('#popup-review').css('display', 'none');
        })

        $('button[name=btnModalSave]').on('click', function () {
            screenReviewParticModal.f.saveReview();
            $('#popup-review').css('display', 'none');
        })
    },

    init: function () {
        screenReviewParticModal.event();
        console.log('Modal init!!')
    }
}

screenReviewParticModal.init();

// 남은 태스크
// 독자후기 등록 시 휴대폰 변경, 학교 변경 기능 개발
