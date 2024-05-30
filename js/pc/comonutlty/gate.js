$(function () {
  let screen = {
    v: {
      boardFaqTypeCode: '',  // 유형
      boardFaqSearch: '',   // 공지사항 검색어
      pagingNow: 0,
      boardContentYn : 'Y',
      boardTopYn: 'N',
      boardSeq: {},
      detailData: {},
      /*valid1: $form.check('#faqDetailForm'),*/
      modalParam : null,
      boardContent: {},
      eleHost : $('[name=host_ele]').val(),
      midHost : $('[name=host_mid]').val(),
      highHost : $('[name=host_high]').val(),
    },

    c: {

    },

    f: {

      setCookie(name, value, days) {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
      },

      eleLink: () => {
        /*if(!$isLogin){
          console.log("로그인 팝업");
          screen.f.okLogin();
        }else {*/
        screen.f.setCookie('MT-GATE-TOKEN', 'ele', 90);
        location.href = screen.v.eleHost;
        console.log(location.href);
        /* }*/

        // /pages/common/customer/submit?faq=&searchTxt=&qnaLink=
      },
      midLink: () => {
        screen.f.setCookie('MT-GATE-TOKEN', 'mid', 90);
        location.href = screen.v.midHost;
        console.log(location.href);
      },

      highLink: () => {
        screen.f.setCookie('MT-GATE-TOKEN', 'high', 90);
        location.href = screen.v.highHost;
        console.log(location.href);
        /*$.cookie('MT-GATE-TOKEN', 'high', { expires: 90, path: '/' });*/
      },

      faqDetail:(e) =>{
        screen.v.boardSeq = e.target.id;
        console.log(screen.v.boardSeq)
        screen.c.Detail();
      },

      bindfaqList: (list) => {
        const liste = $("#jestboard");
        liste.empty();
        console.log("리스트",list)
        $.each(list, function(idx, faqboardItem) {
          liste.append(`
            <li class="${idx === 0 ? 'active' : ''}">
                <!-- 나머지 HTML 코드는 그대로 사용 -->
                <a class="action">
                    <div class="header-wrap">
                        <i class="icon size-lg type-rounded">
                            <svg>
                                <title>Q 아이콘</title>
                                <use href="/assets/images/svg-sprite-solid.svg#icon-question"></use>
                            </svg>
                        </i>
                        <span>${faqboardItem.boardFaqTypeNm}</span>
                        <p class="title">${faqboardItem.boardTitle}</p>
                    </div>
                </a>
                <div class="pane">
                    <div class="answer-wrap">${faqboardItem.boardContent}</div>
                    <div class="split-container-info">
                        <p>원하시는 정보를 찾지 못하셨나요? 1:1 문의를 넘겨주시거나<br />고객센터(1800-8890)로 문의해 주시면 친절히 안내해 드리겠습니다.</p>
                        <div class="extra">
                            <button class="button size-md type-secondary" name="qnaLink">1:1 문의</button>
                        </div>
                    </div>
                </div>
            </li>
        `);

        });
        $("button[name=qnaLink]").on("click", function() {
          // 클릭 이벤트 발생 시 실행할 코드 작성
          console.log("버튼이 클릭되었습니다.");
          screen.f.setLink();
        });
// 생성된 HTML 코드를 부모 요소에 추가
      },

    },

    event: () => {

      document.addEventListener('DOMContentLoaded', function() {
        // 쿠키에서 최근 방문 페이지 정보를 가져오는 로직
        var recentPage = getCookie("recentPage");

        // 최근 방문 페이지 정보가 있으면 해당 페이지로 리다이렉션
        if (recentPage) {
          window.location.href = recentPage;
        } else {
          // 쿠키가 없으면 Gate.mrn 페이지로 리다이렉션
          window.location.href = '/pages/common/Gate.mrn';
        }
      });

     // 쿠키에서 값을 가져오는 함수
      function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");

        if (parts.length == 2) {
          return parts.pop().split(";").shift();
        }
      }

      // 페이지 이동
      $("button[name=ele]").on("click", screen.f.eleLink);
      $("button[name=mid]").on("click", screen.f.midLink);
      $("button[name=high]").on("click", screen.f.highLink);


      // 옵션(지역) 선택
      $("input[type=radio][name=faq]").on("click", screen.f.setOption);

      $('input[name=searchTxt]').on('keyup', (e) => {
        if (e.keyCode === 13) screen.c.getfaqList();
      });

      $('#faqDetailForm').find('[data-id=close]').on('click', () => {
        $('div[id=popup-search-school]').hide();

      });

      $('#faqDetailForm').find('[data-id=qnaLink]').on('click', () => {
        screen.f.setLink();
      });

    },

    /*open: (params) =>{
      screen.f.initModal(params);
    },*/

    init: () => {
      console.log('header init!');
      screen.event();
      // screen.f.setContentValue();
      // screen.f.setAnswer();
    },
  };
  screen.init();
});