let toastScreen
$(function () {
  toastScreen = {
    v: {
      isLogin: null,
      favorite: "toast-favorite",
      copy: "toast-copy",
      scrap: "",
    },

    c: {},

    f: {
      // 즐겨찾기
      favorite: (e) => {
        if (toastScreen.v.isLogin) {
          const isChecked = $(e.currentTarget).is(":checked");

          if (isChecked) $toast.open(toastScreen.v.favorite, "MG00038");
          else $toast.open(toastScreen.v.favorite, "MG00039");

          $quick.getFavorite();
        }
      },

      // 교과서 링크 복사
      copyLink: (e) => {
        if (toastScreen.v.isLogin && $('#userGrade').val() === '002') {
          $toast.open(toastScreen.v.copy, "MG00066");
        }
      },

      // 스크랩
      scrapTextbook: (e) => {
        const isAdd = $(e.currentTarget).hasClass('active');
        // console.log("isAdd : ",isAdd)
        const isTotal = $(e.currentTarget).hasClass('total-scrap');
        const hasInputs = $(e.currentTarget).attr("hasInputs");

        if (toastScreen.v.isLogin && $('#userGrade').val() === '002') {
          const placement = $(e.currentTarget).data("toast");

          // 스크랩 on off
          if(isTotal){
            hasInputs === "true" ? $toast.open(placement, "MG00041") : "";
          }else{
            isAdd ? $toast.open(placement, "MG00041") : $toast.open(placement, "MG00042");
          }
        }
      },
    },

    event: () => {
      // 즐겨찾기
      // $(document).on("click", "#reg-favorite", toastScreen.f.favorite);

      // 교과서 링크 복사
      $(document).on("click", "#ebookLinkCopyBtn", toastScreen.f.copyLink);

      $('[id^="ebookcopy-"]').on("click", toastScreen.f.copyLink);

      /*$('.ebookcopy').on("click", toastScreen.f.copyLink);*/
      $('[id^="ebookLinkCopyBtn-"]').on("click", toastScreen.f.copyLink);



        // 여기서 모든 ebookcopy 버튼에 대한 동작을 수행

      // 스크랩 -교과서 자료
      $(".categoryDataList .chapter-items, .categoryDataList, #commonItemList, #commonRefContainer").on("click", ".scrap", (e)=> {
        toastScreen.f.scrapTextbook(e)
      })
    },

    init: () => {
      toastScreen.v.isLogin = $("#isLogin").val() === "true";

      toastScreen.event();
    },
  };

  toastScreen.init();
});