$(function () {
  let screen = {
    c: {
      getEleGnbList: function(){
        let categoryCode = $("input[name=gnbCateType]").val() || '';
        let key3 = document.location.pathname;
        $cmm.ajax({
          url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
          method: 'GET',
          data: {
            pathname: key3,
            categoryType: categoryCode
          },
          success: function (res) {
            let list = res.rows || [];

            let parentSortCode = '';
            list.filter((v) => {
              if (v.webName1.indexOf(window.location.pathname) > -1) {
                parentSortCode = v.sortCode.substr(0,6);
              }
            });

            let lv1_section = $("#sample_lv01");
            lv1_section.empty();

            let lv2_section = $("#sample_lv02");
            lv2_section.empty();

            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              if(item.level == 2){
                lv1_section.append(`
                <a href="${item.webName1}" class="${parentSortCode === item.sortCode ? 'active history-depth-1' : 'history-depth-1'}">${item.name}</a>
              `);
              }else if(item.level == 3){
                if (item.sortCode.indexOf(parentSortCode) > -1) {
                  lv2_section.append(`
                    <a href="${item.webName1}" class="${item.webName1.indexOf(window.location.pathname) > -1 ? 'active history-depth-2' : 'history-depth-2'}">${item.name}</a>
                `);
                }
              }
            }

          }
        });
      },
    },

    event: function () {
      if(document.getElementById('cmmEleBoardGnbList') != null){
        screen.c.getEleGnbList();
      }

    },

    init: function () {
      console.log('하드코딩 페이지 - init!');
      screen.event();
    },
  };
  screen.init();
});