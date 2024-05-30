$(function () {
  let screen = {
    v: {
      categorySeq: $('[name=categorySeq]').val()
    },

    c: {
      getEleGnbList: function(){
        let categoryCode = $("input[name=gnbCateType]").val() || '';
        let key3 = document.location.pathname;
        console.log(categoryCode, key3)
        $cmm.ajax({
          url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
          method: 'GET',
          data: {
            pathname: key3,
            categoryType: categoryCode
          },
          success: function (res) {
            let list = res.rows || [];
            console.log(res)

            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              if(item.level == 2){
                let lv1_tmp = $("#sampleGnb_04 #sample_lv01").clone();
                let lv1_list_tmp = $("#sampleGnb_04 #sample_lv01_list").clone();
                lv1_tmp.find(".title").html(item.name)
                lv1_tmp.find("a").attr("href", item.pageUrl);
                lv1_tmp.find("a").prop("target", item.target);
                lv1_tmp.attr("id", item.seq);
                $("#cmmEleBoardGnbList").append(lv1_tmp);
              }else if(item.level == 3){
                let lv2_tmp = $("#sampleGnb_04 #sample_lv02").clone();
                lv2_tmp.attr("href", item.pageUrl);
                lv2_tmp.find("span").html(item.name);
                lv2_tmp.attr("id", item.seq);
                lv2_tmp.prop("target", item.target);
                $("#cmmEleBoardGnbList #" + item.parentSeq + " button").css("display", "block");
                $("#cmmEleBoardGnbList #" + item.parentSeq + " .level2List" ).append(lv2_tmp);
              }
              if(item.pageUrl == key3){
                $("#"+item.parentSeq ).addClass("active");
                $("#"+item.seq).addClass("active");
                if($("#" + item.parentSeq + " .pane .level2List").children().length > 0){
                  $("#"+item.parentSeq+' .pane').show();
                }
              }
            }
            let li_list = $("#cmmEleBoardGnbList").children("li");
            li_list.map(function(idx){ // 하위 메뉴 없는 경우 하위 영역 삭제
              let element = li_list[idx];
              if($(element).find('.pane .level2List').children().length < 1){
                $(element).find('.pane').remove();
              }
            });
          }
        });
      },
    },

    f: {

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

      // 즐겨찾기 추가
      addFavorite: () => {
        let dataObj = {};

        const currentLocationName = screen.f.getCurrentLocationByName();
        const currentUrl = window.location.origin + window.location.pathname;
        const referenceSeq = screen.v.categorySeq;

        dataObj = {
          favoriteType: 'MTEACHER',
          referenceSeq: referenceSeq,
          favoriteName: currentLocationName, // 게시판명
          favoriteUrl: currentUrl, // 게시판 url
          useYn: 'Y',
        }
        console.log(dataObj)

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

      // 즐겨찾기 해제
      updateFavorite: () => {
        let dataObj = {};
        // 즐겨찾기 해제 type을 delete로 사용
        const referenceSeq = screen.v.categorySeq;

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

      setMyFavorite: () => {
        if (!$isLogin) {
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
      }

    },

    event: function () {
      // 즐겨찾기 등록
      $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);

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