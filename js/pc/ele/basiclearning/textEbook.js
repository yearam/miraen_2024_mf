$(function () {
  let screen = {
    v: {
      data03: [],
      data04: [],
      data05: [],
      data06: [],
      textEbookgrade:'',
      textEbooktrem:'',
    },

    c: {
      getEbookList: ()=> {

        screen.v.textEbookgrade = document.querySelector('input[name="ox-filter8"]:checked').value;
        screen.v.textEbooktrem = document.querySelector('input[name="ox-filter9"]:checked').value;
        console.log(screen.v.textEbookgrade);
        console.log(screen.v.textEbooktrem);

        const options = {
          url: '/pages/ele/board/basiclearning/textEbook.ax',
          method: 'GET',
          data: {
            gradeCode : screen.v.textEbookgrade,
            termCode : screen.v.textEbooktrem,
          },
          success: function (res) {
            console.log(res);
            /*screen.v.resultList = res.rows;*/
            screen.f.bindDataList(res.rows);
            /*screen.f.bindTotalboardPaging(res);*/
            toggleThis('.toggle-this');
          }
        };

        $cmm.ajax(options);
      },

    },

    f: {

      setOption: () => {

        /*screen.c.getrequestList();*/
        var selectedGrade = document.querySelector('input[name="ox-filter8"]:checked').value;
        var selectedSemester = document.querySelector('input[name="ox-filter9"]:checked').value;

        console.log("옵션",selectedGrade)
        console.log("옵션",selectedSemester)

        screen.v.textEbookgrade = selectedGrade;
        screen.v.textEbooktrem = selectedSemester;
        screen.c.getEbookList();

      },
      bindDataList : (data) => {
        // 바인딩할 부모 요소 선택
        const parentElement = document.querySelector('.board-items');
        console.log("데이터",data);

// 부모 요소 내용 초기화
        parentElement.innerHTML = '';

        data.forEach((item,index) => {
          // 각 아이템에 대한 HTML 생성
          const html = `
        <div class="ebook">
            <p class="title">${item.textbookName}</p>
            <div class="image-wrap">
                <img src="${item.parameter}" alt="">
            </div>
            <div class="divider-group fluid">
                <button class="button" name="previewBtn" target="_blank" id="${item.path}">
                    <svg>
                        <title>아이콘 돋보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                    </svg> 미리보기
                </button>
                <input id="${'ebookPathInput-'+ (index+1)}"  type="hidden" value="${item.path}">
                <button type="button" class="button" id="${'ebookcopy-'+ (index+1)}" data-toast="${'toast-copy-'+ (index+1)}" data-clipboard-target="${'#ebookPathInput-'+ (index+1)}" data-copyval="${item.path}">
                    <svg>
                        <title>아이콘 링크 복사</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-copy"></use>
                    </svg> 링크복사
                </button>
            </div>
        </div>
    `;

          // HTML을 부모 요소에 추가
          parentElement.insertAdjacentHTML('beforeend', html);

        });
        $(document).off().on("click", "button[name=previewBtn]", screen.f.openPreview);

        $(document).off('click', '[id^="ebookcopy-"]').on('click', '[id^="ebookcopy-"]', function (event) {
          event.preventDefault();
          var isLogin = screen.f.checkLogin();
          if (!isLogin) {
            event.preventDefault();
            return;
          }else {
            // 반환값이 false이면 링크 이동을 취소합니다.

            let targetId = this.id;
            let toastIndex = targetId.split('-')[1];
            let combinedString = 'toast-copy-' + toastIndex;

            let copyval = $(this).attr('data-copyval');

            window.navigator.clipboard.writeText(copyval);
            $toast.open(combinedString, "MG00040");
          }
        });
      },

      // 테이블 바인딩

      getTitleBySection(sectionId,no) {
        console.log("학년",no);
        console.log("id체크",sectionId);
        var titleunit = [];
        var datenum = "data"+no;
        console.log(datenum);
        console.log(screen.v[datenum].length);
        for (var i = 0; i < screen.v[datenum].length; i++) {
          if (screen.v[datenum][i].id.startsWith(sectionId)) {
            titleunit.push(screen.v[datenum][i].title);
          }
        }
        console.log(titleunit);
        return titleunit;
      },


      setMyFavorite: () => {
        if(!$isLogin) {
          $alert.open('MG00001');
          $('#reg-favorite[type=checkbox]').prop("checked", false)
          return;
        }

        const addFavorite = $('#reg-favorite[type=checkbox]').is(':checked');

        if (addFavorite) {
          // 즐겨찾기 등록하는 경우
          screen.f.addFavorite();
        } else {
          // 즐겨찾기 해제하는 경우
          screen.f.updateFavorite();
        }
      },

      getCurrentLocationByName: () => {
        let concatenatedText = "";
        $(".breadcrumbs ul").find("li:not(.home)").each(function (index) {
          let $this = $(this);
          let text = $this[0].childNodes.length > 0 ? $this[0].childNodes[0].textContent : $this.text();
          if (index !== 0) {
            concatenatedText += " > ";
          }
          concatenatedText += text;
        });

        return concatenatedText;
      },




      addFavorite: () => {
        let dataObj = {};

        const currentLocationName = screen.f.getCurrentLocationByName();
        const currentUrl = window.location.origin + window.location.pathname;
        const referenceSeq = '2024'

        dataObj = {
          favoriteType: 'MTEACHER',
          referenceSeq: referenceSeq,
          favoriteName: currentLocationName, // 게시판명
          favoriteUrl: currentUrl, // 게시판 url
          useYn: 'Y',
        }

        const options = {
          url: '/pages/api/mypage/addFavorite.ax',
          data: dataObj,
          method: 'POST',
          async: false,
          success: function (res) {
            console.log(res)
            // 40개 미만인 경우만 즐겨찾기 등록 성공
            if (res.resultMsg === "exceed") {
              $alert.open("MG00012");
              $('#reg-favorite[type=checkbox]').prop("checked", false);
            } else {
              $toast.open("toast-favorite", "MG00038");
              $quick.getFavorite();
            }
          },
        };

        $.ajax(options);
      },

      updateFavorite: () => {
        let dataObj = {};
        // 즐겨찾기 해제 type을 delete로 사용
        const referenceSeq = '2024'

        dataObj = {
          favoriteType: "MTEACHER",
          referenceSeq: referenceSeq,
        }

        const options = {
          url: '/pages/api/mypage/updateFavorite.ax',
          data: dataObj,
          method: 'POST',
          async: false,
          success: function (res) {
            console.log(res);
            // 해제 성공시 Toast Msg - MG00039
            $toast.open("toast-favorite", "MG00039");
            $quick.getFavorite();
          },
        };

        $.ajax(options);
      },

      checkLogin: () => {
        console.log('$isLogin:: ', $isLogin);
        if (!$isLogin) {
          $alert.open("MG00001");
          return false;
        }
        return true;
      },

      openPreview:(event)=>{
        event.preventDefault(); // 기본 동작 중지
        const isLogin = screen.f.checkLogin();
        if (!isLogin) {
          // 반환값이 false이면 링크 이동을 취소합니다.
          event.preventDefault();
          return;
        } // 새 창에서 URL 열기
        console.log('!!!');
        const url = event.target.id; // 버튼의 id 속성값을 URL로 사용// 버튼의 id 속성값을 URL로 사용
        window.open(url, '_blank');
      }

    },

    event: function () {

      $("input[type=radio][name=ox-filter8]").on("click", screen.f.setOption);
      $("input[type=radio][name=ox-filter9]").on("click", screen.f.setOption);

      // document.querySelectorAll('button[name="previewBtn"]').forEach(button => {
      //   button.addEventListener('click', (event) => {
      //     event.preventDefault(); // 기본 동작 중지
      //     var isLogin = screen.f.checkLogin();
      //     if (!isLogin) {
      //       // 반환값이 false이면 링크 이동을 취소합니다.
      //       event.preventDefault();
      //       return;
      //     }// 새 창에서 URL 열기
      //     console.log('!!!');
      //     const url = event.target.id; // 버튼의 id 속성값을 URL로 사용// 버튼의 id 속성값을 URL로 사용
      //     window.open(url, '_blank');
      //   });
      // });

      $(document).on("click", "button[name=previewBtn]", screen.f.openPreview);

      $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);

      $(document).off('click', '[id^="ebookcopy-"]').on('click', '[id^="ebookcopy-"]', function (event) {
        /*event.preventDefault();*/
        var isLogin = screen.f.checkLogin();
        if (!isLogin) {
          return;
        }else {
          // 반환값이 false이면 링크 이동을 취소합니다.

          let targetId = this.id;
          let toastIndex = targetId.split('-')[1];
          let combinedString = 'toast-copy-' + toastIndex;

          let copyval = $(this).attr('data-copyval');

          window.navigator.clipboard.writeText(copyval);
          $toast.open(combinedString, "MG00040");
        }
      });


    },

    init: function () {
      console.log('스마트 수업 - init!');
      screen.event();
    },
  };
  screen.init();
});