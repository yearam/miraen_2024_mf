$(function () {
  let screen = {
    v: {
      boardNoticeTypeCode: '',  // 공지사항 유형
      boardLevelCode: '',     // 공지사항 - 초중고
      pagingNow: 0
    },

    c: {
      // 리스트 데이터
      getNoticeSearchList: (pagingNow) => {
        screen.f.setSearchCondition(pagingNow);

        console.log(screen.v)

        const option = {
          method: "POST",
          url: "/pages/common/customer/getSiteBoardList.ax",
          data: {
            boardCategoryCode: 'NOTICE',
            boardNoticeTypeCode: screen.v.boardNoticeTypeCode,
            boardLevelCode: screen.v.boardLevelCode,
            pagingNow: screen.v.pagingNow
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
      setOption: (e) => {
        $('button[name=notice]').removeClass('active');
        $('.filter-list .extra').html($(e.currentTarget).html());

        if (e.currentTarget.id.indexOf('-popup') > -1) {
          $('#' + e.currentTarget.id.substring(0, 8)).addClass('active');
        } else {
          $('#' + e.currentTarget.id + '-popup').addClass('active');
        }

        const selected = e.currentTarget.value;

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

      setBoardLevelCodeOptionForInit: (schoolType) => {
        // const selected = $(e.currentTarget).data('id');
        const selected = schoolType; // 쿼리스트링으로 넘긴 값

        if (!!selected) {
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
             <li>초등/중학</li>
            `
          } else if (eleIsFound && !midIsFound && highIsFound) {
            result = `
             <li>초등/고등</li>
            `
          } else if (!eleIsFound && midIsFound && highIsFound) {
            result = `
             <li>중학/고등</li>
            `
          } else if (eleIsFound && midIsFound && highIsFound) {
            result = `<li>공통</li>`
          }
        } else {
          eleIsFound ?
            result = `<li>초등</li>`
            : midIsFound
              ? result = `<li>중학</li>`
              : result = `<li>고등</li>`
        }

        return result;
      },



      // 리스트 데이터 바인드
      bindNoticeList: (list) => {
        const table = $(".list-table");

        table.empty();

        list.forEach((row, idx) => {
          table.append(`
            <li class="${row.boardTopYn === 'Y' ? 'notice' : ''}">
              
            ${row.boardTopYn === 'Y'
              ? '<td><i class="icon notice"><img src="/assets/images/common/icon-megaphone.svg" alt="공지사항 아이콘 이미지"></i></td>'
              : `<div class="index">${row.rowNum}</div>`}
            
              <div class="info">
                <ul class="divider-group">
                    ${screen.f.setSchoolLevelItem(row.boardLevelCode)}
                    
                    <li>${row.boardNoticeTypeNm}</li>
                    <li>${row.createDate}</li>
                </ul>
                <a href="${'/pages/common/customer/notice.mrn/' + row.boardSeq}" class="title">${row.boardTitle}</a>
              </div>
              
            </li>
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

      },

      clearOption: ()=> {
        $('#notice-1').trigger('click');

        closePopup({id: 'popup-sheet'});
      },

    },

    event: () => {
      // 학교급 타입 체크
      screen.f.checkSchoolLevel();

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 옵션(공지사항 유형)선택
      $("button[name=notice]").on("click", screen.f.setOption);

      // 공지사항 학교급 선택
      $(".tab ul li a").on("click", screen.f.setBoardLevelCodeOption);

      // 카테고리 초기화
      $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearOption);
    },

    init: () => {
      screen.f.setCombo();

      screen.event();

      // 쿼리스트링으로 ?schoolType=ELEMENT || MIDDLE || HIGH을 받았을 경우 초/중/고 탭이 선택되도록 추가
      $(document).ready(() => {
        const queryString = window.location.search;
        const schoolType = new URLSearchParams(queryString).get('schoolType');

        if (!!schoolType) {
          $('.tab > ul > li').removeClass('active');
          $('.tab > ul > li > a[data-id=' + schoolType + ']').parent('li').addClass('active');
          screen.f.setBoardLevelCodeOptionForInit(schoolType);
        }
      })
    },
  };
  screen.init();

});