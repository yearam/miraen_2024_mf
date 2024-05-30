$(function () {
  let screen = {
    v: {
      pagingNow: 0,
      boardLevelCode: ''
    },

    c: {
      // 리스트 데이터
      getEventSearchList: (pagingNow) => {
        screen.v.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;

        const option = {
          method: "POST",
          url: "/pages/common/customer/getEventList.ax",
          data: {
            eventType: screen.v.boardLevelCode,
            showEventYn: "Y",
            exceptStatus: "SCHEDULDETOPROCEED",
            pagingNow: screen.v.pagingNow
          },
          success: (res) => {
            // console.log(res)
            screen.f.bindEventList(res.rows);
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
        screen.c.getEventSearchList(pagingNow);
      },

      // 이벤트 학교급 선택
      setBoardLevelCodeOption: (e) => {
        const selected = $(e.currentTarget).data('id');

        screen.v.pagingNow = 0;
        screen.v.boardLevelCode = selected;
        screen.c.getEventSearchList();
      },

      // 이벤트 학교급 선택
      openWinnerAnnounceLink: (e) => {
        const selected = $(e.currentTarget).data('id');

        if(selected) window.open(selected)
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
             <span class="badge text-elementary type-round-box size-sm"><strong>초등</strong></span>
             <span class="badge text-middle type-round-box size-sm"><strong>중등</strong></span>
            `
          } else if (eleIsFound && !midIsFound && highIsFound) {
            result = `
             <span class="badge text-elementary type-round-box size-sm"><strong>초등</strong></span>
             <span class="badge text-high type-round-box size-sm"><strong>고등</strong></span>
            `
          } else if (!eleIsFound && midIsFound && highIsFound) {
            result = `
             <span class="badge text-middle type-round-box size-sm"><strong>중등</strong></span>
             <span class="badge text-high type-round-box size-sm"><strong>고등</strong></span>
            `
          } else if (eleIsFound && midIsFound && highIsFound) {
            result = `<span class="badge text-skyblue type-round-box size-sm"><strong>공통</strong></span>`
          }
        } else {
          eleIsFound ?
            result = `<span class="badge text-elementary type-round-box size-sm"><strong>초등</strong></span>`
            : midIsFound
              ? result = `<span class="badge text-middle type-round-box size-sm"><strong>중등</strong></span>`
              : result = `<span class="badge text-high type-round-box size-sm"><strong>고등</strong></span>`
        }

        return result;
      },


      // 리스트 데이터 바인드
      bindEventList: (list) => {
        const eventItems = $(".event-items");

        eventItems.empty();

        list.forEach((row, idx) => {
          console.log(row.winnerAnnounceUrl)

          eventItems.append(`
           <div class="${row.status === 'END' ? 'item end' : 'item'}">
              <div class="image-wrap">
                <div class="overlay">
                  <span class="badge fill-black type-round-box size-sm"><strong>종료</strong></span>
                </div>
                <img src="${row.thumbnailFilePath.length > 0 ? row.thumbnailFilePath : '/assets/images/common/img-no-img.png'}" alt="이벤트 이미지">
              </div>
              <div class="inner-wrap">
              
                ${screen.f.setSchoolLevelItem(row.eventType)}
              
                <div class="text-wrap">
                
                  ${row.eventUrl ? `<a href="${row.eventUrl}" target="_blank">` : '<a>'}
                    <p class="title">${row.title}</p>
                    <p class="desc">${row.summary}</p>
                  </a>
                
                  <div class="info-date">
                    <p>이벤트 기간 : ${row.eventDate}</p>
                    
                    ${row.winnerAnnounceTime ? `<p class="winning">당첨자 발표 : ${row.winnerAnnounceTime}</p>` : ''}
                    
                  </div>
                </div>
                
                ${row.winnerAnnounceYn === "Y" && row.winnerAnnounceUrl
              ? `<button class="button fluid type-secondary size-md" name="winnerAnnounceBtn" data-id="${row.winnerAnnounceUrl}">
                    <svg>
                      <title>아이콘 반원 체크</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-check-half-rounded"></use>
                    </svg> 
                    당첨자 발표 
                 </button>`
              : ''}
             
              </div>
            </div>
          `);
        });
      },

      // 이벤트 url 상세 진입
      goToEventUrl: (e) => {
        e.preventDefault();

        const eventStatus = $(e.currentTarget).data('status');
        const eventUrl = $(e.currentTarget).data('url');

        if (eventStatus === "END") {
          $alert.open("MG00071");
          return;
        } else {
          window.open(eventUrl, "_blank");
        }

      },

    },

    event: () => {
      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);


      // 이벤트 학교급 선택
      $(".tab ul li a").on("click", screen.f.setBoardLevelCodeOption);

      // 당첨자 발표 버튼 클릭
      $(document).on("click", "button[name=winnerAnnounceBtn]", screen.f.openWinnerAnnounceLink);

      // 이벤트 url 상세 진입
      $(document).on('click', 'a[data-url]', screen.f.goToEventUrl);


    },

    init: () => {

      screen.event();

    },
  };
  screen.init();
});