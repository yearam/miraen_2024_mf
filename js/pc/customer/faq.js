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
        console.log("Wkwks",screen.v);

        const option = {
          method: "POST",
          url: "/pages/common/customer/getSiteBoardList.ax",
          data: {
            boardCategoryCode: 'FAQ',
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
            screen.f.bindfaqcount(res);
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
            search: screen.v.boardFaqSearch,
            boardContentYn:screen.v.boardContentYn,
            pagingNow : screen.v.pagingNow,
            codeGroup : "B02",
            boardTopYn : 'Y',
            boardSeq: screen.v.boardSeq
          },
          success: (res) => {
            console.log("성공",res)
            console.log("seq",res.row.boardSeq)
            screen.f.parseHtmlContent(res.row.boardSeq);

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
        /*console.log($(screen.v.modalParam.boardContent).text());*/
        /*$form.reset($bbs('#faqDetailForm'));*/

        // screen.v.modalParam.boardContent = $(screen.v.modalParam.boardContent).text();
        console.log("모달",screen.v.modalParam);
        $('#faqDetailForm .body.answer-wrap').attr('data-id', screen.v.modalParam.boardSeq);
        $cmm.setDataBind($('#faqDetailForm'),screen.v.modalParam);

        screen.f.parseHtmlContent(screen.v.modalParam.boardSeq);
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
        console.log(boardSeq)
        console.log($(".answer-wrap[data-id='" + boardSeq + "']"))
        const content = ($(".answer-wrap[data-id='" + boardSeq + "']").text());
        console.log(content);

        const modifiedContent = content.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
        console.log(modifiedContent);
        $(".answer-wrap[data-id='" + boardSeq + "']").html(modifiedContent);
        /*$(".answer-wrap[data-id='" + boardSeq + "']").html($(".answer-wrap[data-id='" + boardSeq + "']").text());*/
      },

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;
        console.log(pagingNow)
        screen.c.getfaqList(pagingNow);
      },

      setOption: () => {
        const selected = $('input[name=faq]:checked').val();

        console.log("옵션",selected)

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
        screen.v.boardSeq = e.target.id;
        console.log(screen.v.boardSeq)
        /*$(".answer-wrap[data-id='" + screen.v.boardSeq + "']").html($(".answer-wrap[data-id='" + screen.v.boardSeq + "']").text());*/
        screen.c.Detail();
      },
      bindfaqcount: (list) => {
        const liste = $(".divider-group");

        if (list.length === 0) {
          liste.empty();
          liste.append(`
            <ul class="divider-group">
                <li>
                    <h3><span class="text-primary">등록된 자료가 없습니다.</span></h3>
                </li>
                <li>
                    <div class="box-gray">
                        <ul class="ul-dot">
                            <li>검색어가 올바르게 입력되었는지 확인 해주세요.</li>
                            <li>다른 검색어로 검색해주세요.</li>
                            <li>특수문자는 제외하는 것이 좋습니다.</li>
                            <li>검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해 보세요.</li>
                            <li>두 단어 이상의 검색어인 경우, 띄어쓰기를 확인해 보세요.</li>
                        </ul>
                    </div>
                </li>
            </ul>
        `);
          return;
        }

        // 라디오 버튼이 선택되지 않았을 때의 처리
        if (screen.v.boardFaqTypeCode=='') {
          liste.empty();
          liste.append(`
            <ul class="divider-group">
                <li>
                    <h3><span class="text-primary">전체</span> 에 대한 질문</h3>
                </li>
                <li><span class="total"> 총 <strong name="totalCnt" class="text-primary">${list.totalCnt}</strong>건</span></li>
            </ul>
        `);
          return;
        }

        // 라디오 버튼이 선택되었을 때의 처리
        liste.empty();
        liste.append(`
        <ul class="divider-group">
            <li>
                <h3><span class="text-primary">${list.rows[0].boardFaqType}</span> 에 대한 질문</h3>
            </li>
            <li><span class="total"> 총 <strong name="totalCnt" class="text-primary">${list.totalCnt}</strong>건</span></li>
        </ul>
    `);
      },

// 생성된 HTML을 원하는 요소에 추가합니다.

      bindfaqList: (list) => {
        const liste = $("#jestboard");
        liste.empty();
        console.log("리스트",list)
        if (list.length === 0) {
          liste.append(`
            <div class="box-no-data">
                등록된 자료가 없습니다.
            </div>
            <div class="box-gray">
                <ul class="ul-dot">
                    <li>검색어가 올바르게 입력되었는지 확인 해주세요.</li>
                    <li>다른 검색어로 검색해주세요.</li>
                    <li>특수문자는 제외하는 것이 좋습니다.</li>
                    <li>검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해 보세요.</li>
                    <li>두 단어 이상의 검색어인 경우, 띄어쓰기를 확인해 보세요.</li>
                </ul>
            </div>
        `);
          return;
        }

        $.each(list, function(idx, faqboardItem) {
          const modifiedContent = faqboardItem.boardContent.replace(/\/api\/file\/view\//g, "/pages/api/file/view/");
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
                        <span>${faqboardItem.boardFaqType}</span>
                        <p class="title">${faqboardItem.boardTitle}</p>
                    </div>
                </a>
                <div class="pane">
                    <div class="answer-wrap">${modifiedContent}</div>
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
        let boardSeq = $('a.action').first().data('id');
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