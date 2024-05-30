$(function () {
  let screen = {
    v: {
      cityCode: null,
    },

    c: {
      // 리스트 데이터
      getSaleCompanyList: (pagingNow = 0) => {
        const option = {
          method: "POST",
          url: "/pages/common/customer/serviceinfo.ax",
          data: {
            cityCode: screen.v.cityCode,
            pagingNow
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

            screen.f.bindSaleCompanyList(res.rows);
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
        screen.c.getSaleCompanyList(pagingNow);
      },

      // 옵션(지역) 선택
      setOption: (e) => {
        let selected = e.currentTarget.id;

        $('button[name=location]').removeClass('active');
        $('.filter-list .extra').html($(e.currentTarget).html());

        if (e.currentTarget.id.indexOf('-popup') > -1) {
          $('#' + e.currentTarget.id.substring(0, 2)).addClass('active');
          selected = e.currentTarget.id.substring(0, 2);
        } else {
          $('#' + e.currentTarget.id + '-popup').addClass('active');
        }

        screen.v.cityCode = selected === "00"? "" : selected;
        screen.c.getSaleCompanyList();
      },

      // 리스트 데이터 바인드
      bindSaleCompanyList: (list) => {
        const table = $(".table-list");

        table.empty();

        list.forEach(row => {
          table.append(`
            <li>
              <a>
                <ul class="divider-group">
                  <li>${row.cityName}</li>
                  <li>${row.name}</li>
                  <li>${row.contactNumber}</li>
                </ul>
                <p class="text-black">${row.address}</p>
              </a>
             </li>
          `);
        });
      },

      clearOption: ()=> {
        $('button[id=00]').trigger('click');

        closePopup({id: 'popup-sheet'});
      },

    },

    event: () => {
      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 옵션(지역) 선택
      $("button[name=location]").on("click", screen.f.setOption);

      // 카테고리 초기화
      $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearOption);

      $(".wrapper").addClass("service-guide");
    },

    init: () => {
      screen.event();
    },
  };
  screen.init();
});