$(function () {
  let screen = {
    v: {
      isLogin: null,
      userRight: null,
      mainInfoList: JSON.parse($('[name=mainInfoList]').val()),
      mainId: '',
      tabIdx: null,
      mainInfo: {},
      searchCondition: {},
      resultList: [],
      defaultMainId: "TBM-lpq9vavh-pewoi126Dt", // 기본 탭
      fileId: null,
    },

    c: {
      // 문학책방 데이터 리스트
      getLiteratureSearchList: (pagingNow) => {

        screen.v.searchCondition.searchType = $("#searchType").val() || "";
        screen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;

        const options = {
          method: "GET",
          url: "/pages/mid/board/contentsplus/getLiteratureBookSearchList.ax",
          data: {
            searchCondition: JSON.stringify(screen.v.searchCondition),
            mainId: screen.v.mainId
          },
          success: (res) => {
            screen.v.resultList = res.rows;

            screen.f.bindDataList();

            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(options);
      },
    },

    f: {
      initState: () => {
        screen.f.setCheckBox();
        screen.v.searchCondition = {};
      },

      // 탭 별 카테고리 검색 조건 세팅
      setCheckBox: () => {
        if (screen.v.mainId !== screen.v.defaultMainId) {
          $('.filter-items-section').addClass('display-hide');
          $('.filter-items-period').addClass('display-hide');
          $('.filter-items-author').removeClass('display-hide');

          $('#section-button').addClass('display-hide');
          $('#period-button').addClass('display-hide');
          $('#author-button').removeClass('display-hide');

          $('.filter-group-section').addClass('display-hide');
          $('.filter-group-period').addClass('display-hide');
          $('.filter-group-author').removeClass('display-hide');
        } else {
          $('.filter-items-section').removeClass('display-hide');
          $('.filter-items-period').removeClass('display-hide');
          $('.filter-items-author').removeClass('display-hide');

          $('#section-button').removeClass('display-hide');
          $('#period-button').removeClass('display-hide');
          $('#author-button').removeClass('display-hide');

          $('.filter-group-section').removeClass('display-hide');
          $('.filter-group-period').removeClass('display-hide');
          $('.filter-group-author').removeClass('display-hide');
        }
      },

      // 초기 카테고리 검색 조건 불러오기
      getCheckBox: () => {
        $cmm.getCmmCd(["TB0250", "TB0260", "TB0270"]).then((res) => {
          const sections = res.row["TB0250"];
          const periods = res.row["TB0260"];
          const authors = res.row["TB0270"];

          for (let i = 0; i < sections.length; i++) {
            $('#section-swiper').append(`
              <div class="swiper-slide">
                <button type="button" value=${sections[i].commonCode} name="filterSet" data-name="category-section"/>${sections[i].name}</button>
              </div>
            `);

            $('.filter-category-section').append(`
                <button type="button" value=${sections[i].commonCode} name="category-section"/>${sections[i].name}</button>
            `);
          }

          for (let i = 0; i < periods.length; i++) {
            $('#period-swiper').append(`
              <div class="swiper-slide">
                <button type="button" value=${periods[i].commonCode} name="filterSet" data-name="category-period"/>${periods[i].name}</button>
              </div>
            `);

            $('.filter-category-period').append(`
                <button type="button" value=${periods[i].commonCode} name="category-period"/>${periods[i].name}</button>
            `);
          }

          for (let i = 0; i < authors.length; i++) {
            $('#author-swiper').append(`
              <div class="swiper-slide">
                <button type="button" value=${authors[i].commonCode} name="filterSet" data-name="category-author"/>${authors[i].name}</button>
              </div>
            `);

            $('.filter-category-author').append(`
                <button type="button" value=${authors[i].commonCode} name="category-author"/>${authors[i].name}</button>
            `);
          }

        });

      },

      // 카테고리 검색 조건 설정 - sql
      setCategoryData: (e) => {
        const $extra = $(e.currentTarget).parents('.filter-group').find('.extra');

        const $filterItem = $(e.currentTarget).parents('.filter-items');

        let nameList = [];
        let typeList = [];
        let valueList = [];

        // .active 버튼만 세팅
        $.each($filterItem.children('button[name^=category]'), function (index, item) {
          if ($(this).hasClass('active')) {
            nameList.push($(this).html());
            typeList.push(this.name);
            valueList.push(this.value);

            // 상단 카테고리 탭 영역 활성화
            $('[data-name=' + this.name + '][value="' + this.value + '"]').addClass('active');
          } else {
            // 상단 카테고리 탭 영역 비활성화
            $('[data-name=' + this.name + '][value="' + this.value + '"]').removeClass('active');
          }
        });

        $extra.empty();

        $.each(nameList, function (index, item) {
          if (index > 0) {
            $extra.append('&nbsp;');
          }
          $extra.append(item);
        });

        const isChecked = $(e.currentTarget).hasClass('active');
        // 카테고리 코드
        const categoryCode = e.currentTarget.value;
        // 카테고리명
        const categoryName = $(e.currentTarget).html();
        // 카테고리
        const type = (e.currentTarget.name).replace("category-", "");

        const searchValue = type === "author" ? categoryCode : categoryName;

        if (!screen.v.searchCondition[type]) screen.v.searchCondition[type] = new Array();

        if (isChecked) {
          screen.v.searchCondition[type].push(searchValue);
        } else {
          screen.v.searchCondition[type] = [...screen.v.searchCondition[type]].filter((data) => data !== searchValue);
          if (screen.v.searchCondition[type].length === 0) delete screen.v.searchCondition[type];
        }

        screen.c.getLiteratureSearchList();
      },

      setCategoryTrigger: (e)=> {
        let name = $(e.currentTarget).data('name');
        let value = e.currentTarget.value
        $('button[name=' + name + '][value="' + value + '"]').trigger('click');
      },

      clearCategory: (e)=> {

        screen.v.searchCondition = {};
        $('.filters .buttons button').removeClass('active');
        $('.filter-wrap .filter-items').removeClass('display-show');
        $('.filter-wrap .filter-items').addClass('display-hide');

        //버튼 초기화
        $('button[name^=category]').removeClass('active');
        // 텍스트 초기화
        $('.filter-group .extra').empty();
        // 상단 카테고리 탭 영역 비활성화
        $('button[name=filterSet]').removeClass('active');

        closePopup({id: 'popup-sheet'});

        screen.c.getLiteratureSearchList();
      },

      // 탭 변환
      clickTab: (e) => {

        screen.v.tabIdx = $(e.currentTarget).attr("href").replace("#tab1-", "");
        screen.v.mainId = $(e.currentTarget).attr("name");
        screen.v.mainInfo = screen.v.mainInfoList.filter((data) => data.mainId === screen.v.mainId)[0];

        $(".pane").attr("id", $(e.currentTarget).attr("href").replace("#", ""));

        screen.f.initState();
        screen.f.clearCategory();
        screen.c.getLiteratureSearchList();

      },

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;

        screen.c.getLiteratureSearchList(pagingNow);
      },

      // 검색 조건에 따라 표에 데이터 표출
      bindDataList: () => {
        const parentSelector = "tbody";

        $(parentSelector).empty();

        if (screen.v.resultList.length > 0) {
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

        screen.v.resultList.map((data, idx) => {
          const item = `
          <tr>
            <th>
              <div class="unit-item multi-line">
                <img src="${data.imgSrc}">
                <p>${data.title}</p>
              </div>
            </th>
            <td>
              <button class="button size-sm type-icon"
                      name="previewBtn"
                      data-id="${data.fileId}"
                      ${data.previewYn !== 'Y' ? 'disabled' : ''}>
                <svg> 미리보기 <use href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                </svg>
              </button>
            </td>
          </tr>
          `

          $(parentSelector).append(item);
        });
      },

      // 파일 미리보기
      previewFile: (e) => {
        const isLogin = screen.f.checkLogin();
        const isRight = isLogin? screen.f.checkRight() : false;
        const fileId = $(e.currentTarget).data("id");

        if (isLogin && isRight) {
          mteacherViewer.get_file_info(fileId).then(res => {
            let previewUrl;

            if (res.upload_method === "CMS" && res.type === "video") {
              previewUrl = `/pages/api/preview/viewer.mrn?source=HLS&file=${fileId}`;
            } else previewUrl = `/pages/api/preview/viewer.mrn?source=${res.upload_method}&file=${fileId}`;

            screenUI.f.winOpen(previewUrl, 1100, 1000, null, "preview");
          }).catch(err => {
            console.error(err);
            alert("서버 에러");
          });
        }
      },

      // 로그인 확인
      checkLogin: () => {
        if (!screen.v.isLogin) {

          $alert.open("MG00001");

          return false;
        }

        return true;
      },

      // 권한 확인
      checkRight: () => {
        if (screen.v.userRight !== "0010") {
          $alert.open("MG00003");


          return false;
        }

        return true;
      },

    },

    event: function () {

      // 카테고리 선택
      $(document).on('click', 'button[name^=category]', screen.f.setCategoryData);

      // 카테고리 세팅 (탭 영역)
      $(document).on('click', 'button[name=filterSet]', screen.f.setCategoryTrigger);

      //태그 전체 삭제 (카테고리 전체 해제)
      $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearCategory);

      // 탭 클릭
      $(".tab li a").on("click", screen.f.clickTab);

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 파일 미리보기
      $(document).on("click", "button[name=previewBtn]", screen.f.previewFile);

    },

    init: function () {
      screen.v.isLogin = $("#isLogin").val() === "true";
      screen.v.userRight = $("#userRight").val();

      screen.v.tabIdx = "1";
      screen.v.mainId = screen.v.defaultMainId;
      screen.v.mainInfo = screen.v.mainInfoList.filter((data) => data.mainId === screen.v.mainId)[0];

      screen.event();
      screen.f.initState();
      screen.f.getCheckBox();
      screen.f.setCheckBox();
    },
  };
  screen.init();
});