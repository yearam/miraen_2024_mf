$(function () {
  let screen = {
    v: {
      totalCnt: $('[name=totalCnt]').text(),
      boardNoticeTypeCode: '',  // 공지사항 유형
      noticeSearchType: '',   // 공지사항 검색어
      boardNoticeSearch: '',   // 공지사항 검색어
      boardLevelCode: '',     // 공지사항 - 초중고
      pagingNow: 0
    },

    c: {
      // 리스트 데이터
      getNoticeSearchList: (pagingNow) => {
        screen.f.setSearchCondition(pagingNow);

        const option = {
          method: "POST",
          url: "/pages/common/customer/getSiteBoardList.ax",
          data: {
            boardCategoryCode: 'NOTICE',
            boardNoticeTypeCode: screen.v.boardNoticeTypeCode,
            noticeSearchType: screen.v.noticeSearchType,
            boardNoticeSearch: screen.v.boardNoticeSearch,
            boardLevelCode: screen.v.boardLevelCode,
            pagingNow: screen.v.pagingNow
          },
          success: (res) => {
            console.log(res)
            screen.v.totalCnt = res.totalCnt;
            $('strong[name=totalCnt]').text(res.totalCnt);
            screen.f.bindNoticeList(res.rows);
            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(option);
      },


    },

    f: {
      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;
        console.log(pagingNow)
        screen.c.getNoticeSearchList(pagingNow);
      },

      // 옵션(공지사항 유형)선택
      setOption: () => {
        const selected = $('input[name=notice]:checked').val();

        screen.v.boardNoticeTypeCode = selected;
        screen.c.getNoticeSearchList();
      },

      // 공지사항 학교급 선택
      setBoardLevelCodeOption: (e) => {
        const selected = $(e.currentTarget).data('id');

        if (typeof (history.pushState) != "undefined") {
          let schoolLevel = '';
          if (selected === 'ELEMENT') {
            schoolLevel = 'ele';
          } else if (selected === 'MIDDLE') {
            schoolLevel = 'mid';
          } else if (selected === 'HIGH') {
            schoolLevel = 'high';
          }
          history.pushState(null, null, `?type=${schoolLevel}`);
        }

        screen.v.pagingNow = 0;
        screen.v.boardLevelCode = selected;
        screen.c.getNoticeSearchList();
      },

      /**
       * 검색조건 세팅
       * @param {*} pagingNow
       */
      setSearchCondition: (pagingNow) => {
        screen.v.noticeSearchType = $('#noticeSearchType').val();
        screen.v.boardNoticeSearch = $('input[name=searchTxt]').val();
        screen.v.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
      },

      setSchoolLevelItem: (levelCode) => {
        const levels = levelCode?.split(';');

        let result = '';

        levels?.sort((a, b) => {
          const order = { 'ELEMENT': 1, 'MIDDLE': 2, 'HIGH': 3 };
          return order[a] - order[b];
        });

        const eleIsFound = levels.includes('ELEMENT');
        const midIsFound = levels.includes('MIDDLE');
        const highIsFound = levels.includes('HIGH');

        if (levels.length > 1) {
          if (eleIsFound && midIsFound && !highIsFound) {

            result = `
             <td>
               <span class="badge size-sm type-round-box fill-elementary"><strong>초등</strong></span>
               <span class="badge size-sm type-round-box fill-middle"><strong>중학</strong></span>
             </td>
            `
          } else if (eleIsFound && !midIsFound && highIsFound) {
            result = `
             <td>
               <span class="badge size-sm type-round-box fill-elementary"><strong>초등</strong></span>
               <span class="badge size-sm type-round-box fill-high"><strong>고등</strong></span>
             </td>
            `
          } else if (!eleIsFound && midIsFound && highIsFound) {
            result = `
             <td>
               <span class="badge size-sm type-round-box fill-middle"><strong>중학</strong></span>
               <span class="badge size-sm type-round-box fill-high"><strong>고등</strong></span>
             </td>
            `
          } else if (eleIsFound && midIsFound && highIsFound) {
            result = `<td><span class="badge size-sm type-round-box fill-all-grade"><strong>공통</strong></span></td>`
          }
        } else {
          eleIsFound ?
            result = `<td><span class="badge size-sm type-round-box fill-elementary"><strong>초등</strong></span></td>`
            : midIsFound
              ? result = `<td><span class="badge size-sm type-round-box fill-middle"><strong>중학</strong></span></td>`
              : result = `<td><span class="badge size-sm type-round-box fill-high"><strong>고등</strong></span></td>`
        }

        return result;
      },



      // 리스트 데이터 바인드
      bindNoticeList: (list) => {
        const tbody = $("tbody");

        tbody.empty();

        list.forEach((row, idx) => {
          tbody.append(`
            <tr class="${row.boardTopYn === 'Y' ? 'notice' : ''}">
              
            ${row.boardTopYn === 'Y'
              ? '<td><i class="icon type-rounded size-lg"><img src="/assets/images/common/icon-megaphone.svg" alt="공지사항 아이콘 이미지"></i></td>'
              : `<td>${row.rowNum}</td>`}

              ${screen.f.setSchoolLevelItem(row.boardLevelCode)}
              
              <td>${row.boardNoticeTypeNm}</td>
              <td class="text-left">
                <a href="${'/pages/common/customer/notice.mrn/' + row.boardSeq}" class="title ellipsis-single">${row.boardTitle}</a>
              </td>
              <td>${row.createDate}</td>
            </tr>
          `);
        });
      },

      /**
       * 공통코드 콤보박스 바인딩
       */
      setCombo: () => {
        $combo.setCmmCd(['FC0010']);
      },


      /**
       * 학교급 체크 후 맞는 탭으로 이동
       */

      setSchoolLevelWithData: (schoolLevel, number) => {
        screen.v.boardLevelCode = schoolLevel;
        screen.c.getNoticeSearchList();
        $('.tab ul li').removeClass('active');
        $(`.tab ul li:nth-child(${number})`).addClass('active');
      },

      checkSchoolLevel: () => {
        const type = window.location.search;

        if (!type) return;

        if (type.includes("ele")) {
          screen.f.setSchoolLevelWithData("ELEMENT", 2);
        } else if (type.includes("mid")) {
          screen.f.setSchoolLevelWithData("MIDDLE", 3);
        } else if (type.includes("high")) {
          screen.f.setSchoolLevelWithData("HIGH", 4);
        } else {
          screen.f.setSchoolLevelWithData("", 1);
        }

      }

    },

    event: () => {
      // 학교급 타입 체크
      screen.f.checkSchoolLevel();

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 옵션(공지사항 유형)선택
      $("input[type=radio][name=notice]").on("click", screen.f.setOption);

      // 공지사항 학교급 선택
      $(".tab ul li a").on("click", screen.f.setBoardLevelCodeOption);


      //검색
      // $('button[name=searchBtn]').on('click', (e) => {
      //   e.preventDefault();
      //   screen.c.getNoticeSearchList();
      // });

      $('input[name=searchTxt]').on('keyup', (e) => {
        if (e.keyCode === 13) screen.c.getNoticeSearchList();
      });
    },

    init: () => {
      screen.f.setCombo();

      screen.event();

    },
  };
  screen.init();
});