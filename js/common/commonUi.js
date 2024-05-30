/*UI js*/


let cujs = {

    /**
     * 내부 전역변수
     *
     * @memberOf screenUI
     */
    v: {},

    /**
     * 통신 객체- call
     *
     * @memberOf screenUI
     */
    c: {},

    /**
     * 내부 함수
     *
     * @memberOf screenUI
     */
    f: {},

    /**
     * Event 정의 객체.
     *
     * @memberOf screenUI
     */
    event: function () {
        // 갤러리 / 리스트 타입
        $('.toggle-group button[name=listType]').on('click', (e) => {
            const type = $(e.currentTarget).data('id');
            console.log(type);
            if (type === 'list-type') $('.board-items').addClass('type-vertical');
            else $('.board-items').removeClass('type-vertical');
        });

        $('.toggle-group-mobile button[name=listType]').on('click', (e) => {
            const type = $(e.currentTarget).data('id');
            console.log(type);
            $('.toggle-group-mobile button[name=listType]').toggleClass('display-hide');
            if (type === 'list-type') $('.board-items').removeClass('type-gallery');
            else $('.board-items').addClass('type-gallery');

            $('.board-buttons').toggleClass('display-hide');
        });

        $(document).on('click', '#shareCopyBtn', (e) => {
            let copyText = document.getElementById('user-pnum');
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand('Copy');
            $toast.open('toast-sns-copy', 'MG00040');
        });

    //공유하기 팝업
    $(document).on('click', '[name=shareBtn]', (e)=> {
      if(!$isLogin) {
        $alert.open('MG00001');
        return;
      }
      
      openPopup({id: 'popup-share-sns'});
        let masterSeq = '';
        if($('.board-list').length > 0) {
            masterSeq = '/' + $(e.currentTarget).closest('div.buttons').siblings('input[name=masterSeq]').val();

            // 모바일에서 사용
            if (masterSeq == '/undefined') {
                masterSeq = '/' + $(e.currentTarget).closest('div.board-buttons').children('input[name=masterSeq]').val();
            }
        }
      $('#user-pnum').val(location.origin + location.pathname + masterSeq);
    });
    $(document).on('click', '[name=shareCloseBtn]', (e)=> {
      closePopup({id: 'popup-share-sns'});
    });

        //lnb active처리
        // $('aside[name=type1]').on('click', 'ul.subject-items li.chapter', (e)=> {
        //   $('li.chapter').removeClass('active');
        //   $(e.currentTarget).addClass('active');
        // });
        // $('aside[name=type1]').on('click', 'ul.subject-items li.chapter .chapter-items a', (e)=> {
        //   $('li.chapter').removeClass('active');
        //   $(e.currentTarget).closest('li.chapter').addClass('active');
        // });
        $("#siteMapList .depth-2 a[href*='request.mrn'], #siteMapList .depth-2 a[href*='/mypage/']").off().on("click", (e) => {
                event.preventDefault();
                if(!$isLogin) {
                    $alert.open("MG00001");
                } else {
                    location.href = e.target.href;
                }
        });

        // header 영역의 마이페이지 아이콘 클릭 이벤트
        $('.mypage-btn-mobile').on('click', (e) => {
            if(!$isLogin) {
                $alert.open('MG00001');
                return;
            } else {
                window.open('/pages/common/mypage/myclass.mrn')
            }
        });


    },

    /**
     * Init 최초 실행.
     *
     * @memberOf screenUI
     */
    init: function () {
        console.log('commonUi.js');

        // lnb active
        if ($('aside[name=type1]').length > 0) {
            $('li.chapter').each((idx, el) => {

                if (location.pathname === $(el).find('a').attr('href')) {
                    $(el).addClass('active');
                } else {
                    $(el).removeClass('active');
                }

            });
        }

        // Event 정의 실행
        cujs.event();

    }
};
$(function () {
    cujs.init();					// 공통 적용
});


