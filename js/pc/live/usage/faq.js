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
      boardContent: {}
    },

    c: {
      // 리스트 데이터
      getfaqList: (pagingNow) => {

        screen.v.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
        screen.v.boardFaqSearch = $('input[name=searchTxt]').val();
        console.log(screen.v)

        const option = {
          method: "POST",
          url: "/pages/common/customer/getSiteBoardList.ax",
          data: {
            boardCategoryCode: 'USAGE_FAQ',
            boardFaqTypeCode: screen.v.boardFaqTypeCode,
            search: screen.v.boardFaqSearch,
            boardContentYn:screen.v.boardContentYn,
            pagingNow : screen.v.pagingNow,
            boardTopYn : screen.v.boardTopYn,
          },
          success: (res) => {
            /*const listMap = res.rows[0];
            const targetObj = listMap.isLogin? "alert-notice" : "alert-login";*/
            console.log(res)
            screen.f.bindfaqList(res.rows);
            $('strong[name=totalCnt]').text(res.totalCnt)
            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(option);
      },
      Detail:() =>{

        const option = {
          method: "POST",
          url: "/pages/common/customer/getFaqDetailBoardList.ax",
          data: {
            boardCategoryCode: 'USAGE_FAQ',
            boardFaqTypeCode: screen.v.boardFaqTypeCode,
            search: screen.v.boardFaqSearch,
            boardContentYn:screen.v.boardContentYn,
            pagingNow : screen.v.pagingNow,
            codeGroup : "F100",
            boardTopYn : 'Y',
            boardSeq: screen.v.boardSeq
          },
          success: (res) => {
            console.log("성공",res)
            console.log("seq",res.row.boardSeq)
            screen.open(res.row);
            /*screen.f.initModal(res.row);*/
          }
        };
        $cmm.ajax(option);
      },
    },

    f: {
      // todo 보류
      setContentValue: ()=> {
        $('.th-value').each(function() {
          let value = $(this).val();
          let seq = $(this).attr('name');
          screen.v.boardContent.push = {seq: value};
        });
      },

      setAnswer: () => {
        let answerList = screen.v.boardContent
        document.getElementById('answerText').innerText = answer;
      },

      initModal:(params) => {
        console.log("파람",params);

        screen.v.modalParam = params

        /*screen.v.parseHtmlContentde(params.boardSeq);*/
        console.log($(screen.v.modalParam.boardContent).text());
        /*$form.reset($bbs('#faqDetailForm'));*/
        screen.v.modalParam.boardContent = $(screen.v.modalParam.boardContent).text();
        console.log("모달",screen.v.modalParam);

        $cmm.setDataBind($('#faqDetailForm'),screen.v.modalParam);


        /*document.querySelector('[data-id=close]').addEventListener('click', function () {
          document.getElementById('faqDetailForm').style.display = 'none';
        });

        document.querySelector('[data-id=qnaLink]').addEventListener('click', function () {
          // 원하는 동작 추가
          window.location.href = '/pages/common/customer/request.mrn';
        });*/


      },

      parseHtmlContentde: (boardSeq)=> {
        $(".body answer-wrap").html($(".body answer-wrap").text());
      },

      parseHtmlContent: (boardSeq)=> {
        $(".answer-wrap[data-id='" + boardSeq + "']").html($(".answer-wrap[data-id='" + boardSeq + "']").text());
      },

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;
        console.log(pagingNow)
        screen.c.getfaqList(pagingNow);
      },

      setOption: (e) => {
        const selected = $('input[name=faq]:checked').val();

        console.log("옵션",selected)

        screen.v.boardFaqTypeCode = selected;
        $('#faqTypeText').text($(e.currentTarget).next().text())
        screen.c.getfaqList();
      },


      setLink: () => {
        if(!$isLogin){
          console.log("로그인 팝업");
          screen.f.okLogin();
        }else {
          window.location.href = '/pages/common/customer/request.mrn'
        }

        // /pages/common/customer/submit?faq=&searchTxt=&qnaLink=
      },

      okLogin: () => {
        location.href = "/pages/common/User/Login.mrn";
      },
      faqDetail:(e) =>{
        screen.v.boardSeq = e.target.id;
        console.log(screen.v.boardSeq)
        /*$(".answer-wrap[data-id='" + screen.v.boardSeq + "']").html($(".answer-wrap[data-id='" + screen.v.boardSeq + "']").text());*/
        screen.c.Detail();
      },

      bindfaqList: (list) => {
        const liste = $("#jestboard");
        liste.empty();
        console.log("리스트",list)
        $.each(list, function(idx, faqboardItem) {
          liste.append(`
            <li>
                <!-- 나머지 HTML 코드는 그대로 사용 -->
                <a class="action">
                    <div class="header-wrap">
                        <i class="icon size-lg type-rounded">
                            <svg>
                                <title>Q 아이콘</title>
                                <use href="/assets/images/svg-sprite-solid.svg#icon-question"></use>
                            </svg>
                        </i>
                        <span>${faqboardItem.boardLiveFaqTypeNm}</span>
                        <p class="title">${faqboardItem.boardTitle}</p>
                    </div>
                </a>
                <div class="pane">
                    <div class="answer-wrap" data-id="${faqboardItem.boardSeq}">${faqboardItem.boardContent}</div>
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

        if (liste.find('li').length > 0) {
          liste.find('.action')[0].click()
          $('#noResultDiv').addClass('hidden')
          $('#pagingDiv').removeClass('hidden')
          $('#jestboard').removeClass('hidden')
        } else {
          $('#noResultDiv').removeClass('hidden')
          $('#pagingDiv').addClass('hidden')
          $('#jestboard').addClass('hidden')
        }

        $("button[name=qnaLink]").on("click", function() {
          // 클릭 이벤트 발생 시 실행할 코드 작성
          console.log("버튼이 클릭되었습니다.");
          screen.f.setLink();
        });
// 생성된 HTML 코드를 부모 요소에 추가
      },

    },

    event: () => {
      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);
      /*$(document).on("click", "button[type=button][name=topbutton]", screen.f.detailPaging);*/

      // 페이지 이동
      $("button[name=qnaLink]").on("click", screen.f.setLink);
      $("button[name=login]").on("click", screen.f.okLogin);
      $("button[name=topbutton]").on("click", screen.f.faqDetail);


      // 옵션(지역) 선택
      $("input[type=radio][name=faq]").on("click", screen.f.setOption);

      $('input[name=searchTxt]').on('keyup', (e) => {
        if (e.keyCode === 13) screen.c.getfaqList();
      });

      $('button[name=searchBtn]').on('click', (e) => {
        screen.c.getfaqList();
      })

      $('#faqDetailForm').find('[data-id=close]').on('click', () => {
        $('div[id=popup-search-school]').hide();

      });

      $('#faqDetailForm').find('[data-id=qnaLink]').on('click', () => {
        screen.f.setLink();
      });

      $('.action').on('click', function() {
        // 이벤트 발생 시 수행할 동작을 여기에 작성합니다.
        // 해당 요소의 데이터 속성인 data-id를 가져옵니다
        console.log("클릭 이벤트")
        let boardSeq = $(this).data('id');
        console.log('클릭된 요소의 data-id:', boardSeq);
        screen.f.parseHtmlContent(boardSeq);
        // 이후 추가적인 작업을 수행하면 됩니다.
      });
      $(document).ready(function() {
        // 초기에 active 클래스가 추가된 첫 번째 li 요소를 선택합니다.
        let initialActiveLi = $('li.active').first();
        // 해당 요소의 데이터 속성인 data-id 값을 가져옵니다.
        let boardSeq = initialActiveLi.find('.action').data('id');
        console.log('초기 시퀀스:', boardSeq);
        screen.f.parseHtmlContent(boardSeq);
      });

    },

    open: (params) =>{
      screen.f.initModal(params);
    },

    init: () => {
      /*screen.f.parseHtmlContent();*/
      screen.event();
      // screen.f.setContentValue();
      // screen.f.setAnswer();
    },
  };
  screen.init();
});
