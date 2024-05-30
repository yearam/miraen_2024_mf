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
        screen.v.cityCode = e.currentTarget.id === "00"? "" : e.currentTarget.id;
        screen.c.getSaleCompanyList();
      },

      // 리스트 데이터 바인드
      bindSaleCompanyList: (list) => {
        const tbody = $("tbody");

        tbody.empty();

        list.forEach(row => {
          tbody.append(`
            <tr>
              <td>${row.cityName}</td>
              <td>${row.name}</td>
              <td>${row.contactNumber}</td>
              <td class="text-left">${row.address}</td>
            </tr>
          `);
        });
      },
    },

    event: () => {
      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 옵션(지역) 선택
      $("input[type=radio][name=location]").on("click", screen.f.setOption);
    },

    init: () => {
      screen.event();
    },
  };
  screen.init();
});