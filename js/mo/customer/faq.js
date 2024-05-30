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
        console.log("Wkwks",screen.v);

        const option = {
          method: "POST",
          url: "/pages/common/customer/getSiteBoardList.ax",
          data: {
            boardCategoryCode: 'FAQ',
            boardFaqTypeCode: screen.v.boardFaqTypeCode,
            boardContentYn:screen.v.boardContentYn,
            pagingNow : screen.v.pagingNow,
            boardTopYn : screen.v.boardTopYn,
          },
          success: (res) => {
            if(res.totalCnt > 0){
              $("[data-name='noDataBox']").addClass("display-hide");
              $("[data-name='noDataBox']").removeClass("display-show");

              $('.pagination').removeClass('display-hide');
              $('.pagination').addClass('display-show-flex');
            } else {
              $("[data-name='noDataBox']").removeClass("display-hide");
              $("[data-name='noDataBox']").addClass("display-show");

              $('.pagination').removeClass('display-show-flex');
              $('.pagination').addClass('display-hide');
            }
            /*const listMap = res.rows[0];
            const targetObj = listMap.isLogin? "alert-notice" : "alert-login";*/
            console.log(res)
            screen.f.bindfaqList(res.rows);
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
            boardCategoryCode: 'FAQ',
            boardFaqTypeCode: screen.v.boardFaqTypeCode,
            boardContentYn:screen.v.boardContentYn,
            pagingNow : screen.v.pagingNow,
            codeGroup : "B02",
            boardTopYn : 'Y',
            boardSeq: screen.v.boardSeq
          },
          success: (res) => {
            console.log("성공",res)
            console.log("seq",res.row.boardSeq)
            screen.open(res.row);
            /*screen.f.initModal(res.row);*/
            // 텍스트 수정 후 팝업이 열리게 하기 위해서
            // target-obj로 제어하는 팝업 open/close 이벤트를 직접 제어하도록 수정
            $('#faq-answer').css('display', 'block');
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

        // html 태그인지 아닌지 체크
        const doc = new DOMParser().parseFromString(screen.v.modalParam.boardContent, "text/html");
        let isHtml = Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
        console.log('isHtml : ' + isHtml);

        /*$form.reset($bbs('#faqDetailForm'));*/
        // html 태그가 있으면 text로 파싱. 없으면 파싱 X.
        if (Boolean(isHtml)) {
          console.log($(screen.v.modalParam.boardContent).text());
          screen.v.modalParam.boardContent = $(screen.v.modalParam.boardContent).text();
        }

        console.log("모달",screen.v.modalParam);

        $cmm.setDataBind($('#faqDetailForm'),screen.v.modalParam);

        // faq > "자료의 내용 중 문의할 사항이 있는..." 팝업에서 &nbsp 노출되는 case 수정
        const $faqDetailFormBoardContent = $('#faqDetailForm div.body > div[data-bind=boardContent]');
        $faqDetailFormBoardContent.html($faqDetailFormBoardContent.text());

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
        const content = ($(".answer-wrap[data-id='" + boardSeq + "']").text());
        const modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
        $(".answer-wrap[data-id='" + boardSeq + "']").html(modifiedContent);
      },

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;
        console.log(pagingNow)
        screen.c.getfaqList(pagingNow);
      },

      setOption: (e) => {
        $('button[name=faq]').removeClass('active');
        $('.filter-list .extra').html($(e.currentTarget).html());

        if (e.currentTarget.id.indexOf('-popup') > -1) {
          $('#' + e.currentTarget.id.substring(0, 5)).addClass('active');
        } else {
          $('#' + e.currentTarget.id + '-popup').addClass('active');
        }

        const selected = e.currentTarget.value;

        screen.v.boardFaqTypeCode = selected;
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
        // screen.v.boardSeq = e.target.id;
        screen.v.boardSeq = e.currentTarget.id;
        console.log(screen.v.boardSeq)
        /*$(".answer-wrap[data-id='" + screen.v.boardSeq + "']").html($(".answer-wrap[data-id='" + screen.v.boardSeq + "']").text());*/
        screen.c.Detail();
      },

// 생성된 HTML을 원하는 요소에 추가합니다.

      bindfaqList: (list) => {
        const liste = $("#jestboard");
        liste.empty();

        $.each(list, function(idx, faqboardItem) {
          const modifiedContent = faqboardItem.boardContent.replace(/\/api\/file\/view\//g, "/pages/api/file/view/");
          liste.append(`
            <li>
                <!-- 나머지 HTML 코드는 그대로 사용 -->
                <a class="action">
                    <div class="header-wrap">
                        <i class="icon type-rounded">
                            <svg>
                                <title>Q 아이콘</title>
                                <use href="/assets/images/svg-sprite-solid.svg#icon-question"></use>
                            </svg>
                        </i>
                        <div>
                          <span>${faqboardItem.boardFaqTypeNm}</span>
                          <p class="title">${faqboardItem.boardTitle}</p>
                        </div>
                    </div>
                </a>
                <div class="pane">
                    <div class="answer-wrap">${modifiedContent}</div>
                    <div class="split-container-info">
                        <p>원하시는 정보를 찾지 못하셨나요? 1:1 문의를 넘겨주시거나<br />고객센터(1800-8890)로 문의해 주시면 친절히 안내해 드리겠습니다.</p>
                        <div class="extra">
                            <button class="button size-sm type-secondary" name="qnaLink">1:1 문의</button>
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

      clearOption: ()=> {
        $('#faq-1').trigger('click');

        closePopup({id: 'popup-sheet'});
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
      $("button[name=faq]").on("click", screen.f.setOption);

      // 카테고리 초기화
      $("button[name=clearTagBtn]").on("click", screen.f.clearOption);

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

      // faq 팝업을 닫을 때 팝업 내용 초기화 이벤트
      $('#faq-answer div.footer > button.close-btn-mobile').on('click', () => {
        // faq 팝업 카테고리, 타이틀, 컨텐츠 텍스트 초기화
        $('#faq-answer').find('[data-bind=boardFaqTypeNm], [data-bind=boardTitle], [data-bind=boardContent]').empty();
        // 텍스트 수정 후 팝업이 열리게 하기 위해서
        // target-obj로 제어하는 팝업 open/close 이벤트를 직접 제어하도록 수정
        $('#faq-answer').css('display', 'none');
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