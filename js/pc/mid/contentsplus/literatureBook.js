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
      pagingNum: 10, // 페이징 limit
      fileDownCount: 0, // 체크된 파일 개수
      fileDownList: [], // 체크된 파일 ID
      fileId: null,
      pageSeq: null,
    },

    c: {
      // 문학책방 데이터 리스트
      getLiteratureSearchList: (pagingNow) => {

        screen.v.searchCondition.searchType = $("#searchType").val() || "";
        screen.v.searchCondition.searchTxt = $("input[name=searchTxt]").val();
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

            $("strong[name=totalCnt]").text(res.totalCnt);

            screen.f.bindDataList();

            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(options);
      },

      // 즐겨찾기 등록
      addFavorite: (isChecked) => {
        let dataObj = {};

        const currentLocationName = screen.f.getCurrentLocationByName();
        const currentUrl = window.location.origin + window.location.pathname;

        dataObj = {
          favoriteType: "MTEACHER",
          referenceSeq: screen.v.pageSeq,
          favoriteName: currentLocationName, // 게시판명
          favoriteUrl: currentUrl, // 게시판 url
          useYn: "Y",
        }

        const options = {
          method: "POST",
          url: "/pages/api/mypage/addFavorite.ax",
          data: dataObj,
          async: false,
          success: function (res) {
            screen.f.toast(isChecked);
          },
        };

        $.ajax(options);
      },

      // 즐겨찾기 해제
      updateFavorite: (isChecked) => {
        let dataObj = {};

        dataObj = {
          favoriteType: "MTEACHER",
          referenceSeq: screen.v.pageSeq,
        };

        const options = {
          method: "POST",
          url: "/pages/api/mypage/updateFavorite.ax",
          data: dataObj,
          async: false,
          success: function (res) {
            screen.f.toast(isChecked);
          },
        };

        $.ajax(options);
      },

    },

    f: {
      initState: () => {
        screen.f.setCheckBox();
        screen.f.resetFileCheck();
        screen.f.setFileDownCount();

        //검색어
        $("input[name=searchTxt]").val("");
        //검색조건
        $("#searchType option:eq(0)").prop("selected", true);

        screen.v.searchCondition = {};
      },

      // 콤보박스
      setCombo: (tabIdx) => {
        const searchTypeBox = $("#searchType");

        $cmm.getCmmCd(["TB0350"]).then((res) => {
          const searchType = res.row["TB0350"];

          for (const obj of searchType) {
            if (tabIdx === "3") {
              if (obj.name === "전체") {
                searchTypeBox.append(`<option value="03">${obj.name}</option>`);
                continue;
              }

              if (obj.name === "작가 이름") {
                continue;
              }
            }

            searchTypeBox.append(`<option value="${obj.commonCode}">${obj.name}</option>`);
          }
        });

      },

      // 카테고리 검색 조건 설정 - html
      setCheckBox: () => {
        const filters = $(".filter-wrap");

        filters.empty();

        let sectionHtml = `<div class="filters">
                                   <strong class="title">영역</strong>
                                   <div class="ox-group">`;
        let periodHtml = `<div class="filters">
                                   <strong class="title">시기</strong>
                                   <div class="ox-group">`;
        let authorHtml = `<div class="filters">
                                   <strong class="title">작가 이름별</strong>
                                   <div class="ox-group">`;

        $cmm.getCmmCd(["TB0250", "TB0260", "TB0270"]).then((res) => {
          const sections = res.row["TB0250"];
          const periods = res.row["TB0260"];
          const authors = res.row["TB0270"];

          for (let i = 0; i < sections.length; i++) {
            sectionHtml += `
              <span class="ox">
                <input type="checkbox" id="ox-filter1-${i + 1}" 
                       value=${sections[i].commonCode} 
                       name="category-section"/>
                <label for="ox-filter1-${i + 1}">${sections[i].name}</label>
              </span>
            `;
          }

          for (let i = 0; i < periods.length; i++) {
            periodHtml += `
              <span class="ox">
                <input type="checkbox" id="ox-filter2-${i + 1}" 
                       value=${periods[i].commonCode} 
                       name="category-period"/>
                <label for="ox-filter2-${i + 1}">${periods[i].name}</label>
              </span>
            `;
          }

          for (let i = 0; i < authors.length; i++) {
            authorHtml += `
              <span class="ox">
                <input type="checkbox" 
                       id="ox-filter3-${i + 1}" 
                       value=${authors[i].commonCode} 
                       name="category-author"/>
                <label for="ox-filter3-${i + 1}">${authors[i].name}</label>
              </span>
            `;
          }

          sectionHtml += `</div></div>`;
          periodHtml += `</div></div>`;
          authorHtml += `</div></div>`;

          if (screen.v.mainId !== screen.v.defaultMainId) filters.append(authorHtml);
          else {
            filters.append(sectionHtml);
            filters.append(periodHtml);
            filters.append(authorHtml);
          }

          filters.append(`
          <div class="filter-items">
            <button type="button"
                    class="button size-md"
                    name="clearTagBtn">
              <svg>
                <title>아이콘 전체해제</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-reload"></use>
              </svg>
              전체해제
            </button>
            <div class="inner-wrap"
                 name="categoryTagArea">
            </div>
          </div>
        `);
        });
      },

      // 카테고리 검색 조건 설정 - sql
      setCategoryData: (e) => {
        // 체크여부
        const isChecked = $(e.currentTarget).is(":checked");
        // 카테고리 코드
        const categoryCode = e.currentTarget.value;
        // 카테고리명
        const categoryName = $(e.currentTarget).next("label").text();
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

        screen.f.bindCategoryTag(isChecked, type, categoryName, categoryCode);

        screen.c.getLiteratureSearchList();
      },

      // 카테고리 검색
      bindCategoryTag: (isChecked, type, categoryName, categoryValue) => {
        const parentSelector = "div[name=categoryTagArea]";
        const htmlTag = `
          <span class="item" name="${type}" value="${categoryValue}" data-title="${categoryName}">
            ${categoryName}
            <button type="button" class="button size-xs type-text type-icon" name="delTagBtn">
              <svg>
                <title>아이콘 삭제</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
              </svg>
            </button>
          </span>
        `;

        if (isChecked) {
          $(parentSelector).append(htmlTag);
        } else {
          $(parentSelector).find(`[data-title='${categoryName}']`).remove();
        }
      },

      // 카테고리 검색 해제
      removeTag: (e) => {
        // 카테고리 type
        const type = $(e.currentTarget).closest("span").attr("name");
        // 카테고리 value
        const categoryVal = $(e.currentTarget).closest("span").attr("value");
        // 카테고리명
        const categoryName = $(e.currentTarget).closest("span").attr("data-title");

        const searchValue = type === "author" ? categoryVal : categoryName;

        screen.v.searchCondition[type] = [...screen.v.searchCondition[type]].filter((data) => data !== searchValue);

        $("div[name=categoryTagArea]").find(`span[name=${type}][value='${categoryVal}']`).remove();
        $(`input[name=category-${type}][value='${categoryVal}']`).prop('checked', false).trigger('change');

        if (screen.v.searchCondition[type].length < 1) delete screen.v.searchCondition[type];
      },

      // 카테고리 검색 전체 해제
      disableAllCategory: () => {
        // 데이터 초기화
        screen.v.searchCondition = {};

        // 체크박스 초기화
        // $('input[name^=category]').prop("checked", false).trigger('change');
        // 전체 해제시에 체크박스 하나당 ajax호출되는 문제 방지, 마지막 체크박스 해제시에만 트리거 적용
        const $categoryList = $("input[name^=category]");

        for (let i = 0; i < $categoryList.length; i++) {
          $($categoryList[i]).prop("checked", false);
          if (i === $categoryList.length - 1) $($categoryList[i]).prop("checked", false).trigger("change");
        }

        // 태그 초기화
        $("div[name=categoryTagArea]").empty();
      },

      // 탭 변환
      clickTab: (e) => {

        screen.v.tabIdx = $(e.currentTarget).attr("href").replace("#tab1-", "");
        screen.v.mainId = $(e.currentTarget).attr("name");
        screen.v.mainInfo = screen.v.mainInfoList.filter((data) => data.mainId === screen.v.mainId)[0];

        $(".pane").attr("id", $(e.currentTarget).attr("href").replace("#", ""));

        screen.f.initState();
        screen.f.disableAllCategory();
        screen.f.bindSelectBox();
        screen.c.getLiteratureSearchList();
      },

      // 탭에 따라 검색 타입 변경
      bindSelectBox: () => {
        const div = $(".input-inner-extra");
        let html;

        div.empty();

        if (screen.v.tabIdx === "2") {
          html = `
            <input type="search"
                   name="searchTxt"
                   placeholder="검색어를 입력해 주세요">
              <button type="button"
                      name="searchBtn"
                      class="icon-button"
                      title="검색">
                <svg>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                </svg>
              </button>
          `;
        } else {
          html = `
            <select name="combo-TB0350"
                    id="searchType">
            </select>
            <input type="search"
                   name="searchTxt"
                   placeholder="검색어를 입력해 주세요">
              <button type="button"
                      name="searchBtn"
                      class="icon-button"
                      title="검색">
                <svg>
                  <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                </svg>
              </button>
          `;
        }

        div.append(html);
        screen.f.setCombo(screen.v.tabIdx);
      },

      // 검색 버튼
      clickSearchBtn: () => {
        screen.c.getLiteratureSearchList();
      },

      // 검색 엔터
      enterSearchBar: (e) => {
        if (e.keyCode === 13) screen.c.getLiteratureSearchList();
      },

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;

        screen.c.getLiteratureSearchList(pagingNow);
        screen.f.resetFileCheck();
      },

      // 검색 조건에 따라 표에 데이터 표출
      bindDataList: () => {
        const parentSelector = "tbody";

        $(parentSelector).empty();

        if (!screen.v.resultList) {
          $(parentSelector).append(`
            <div class="box-no-data">
              등록된 자료가 없습니다.
            </div>
          `);
        }

        screen.v.resultList.map((data, idx) => {
          const item = `
          <tr>
            <td>
              <span class="ox">
                <input type="checkbox" 
                       id="ox-table1-${idx + 2}" 
                       data-id="${data.fileId}" 
                       data-yn="${data.checkYn}"
                       ${data.checkYn !== 'Y' ? 'disabled' : ''}/>
                <label for="ox-table1-${idx + 2}"></label>
              </span>
            </td>
            <th>
              <div class="unit-item">
                <img src="${data.imgSrc}">
                <span>${data.title}</span>
              </div>
            </th>
            <td>
              <button class="icon-button"
                      name="previewBtn"
                      data-id="${data.fileId}"
                      ${data.previewYn !== 'Y' ? 'disabled' : ''}>
                <svg>
                  <use href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                </svg>
              </button>
            </td>
            <td>
              <button class="icon-button"
                      name="downloadBtn"
                      data-id="${data.fileId}"
                      data-method="${data.uploadMethod}"
                      data-param="${data.uploadMethod === 'CMS' ? data.parameter : ''}"
                      ${data.checkYn !== 'Y' ? 'disabled' : ''}>
                <svg>
                  <use href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                </svg>
              </button>
            </td>
          </tr>
          `

          $(parentSelector).append(item);
        });
      },

      // 파일 체크 전체 해제
      resetFileCheck: () => {
        $("input[type=checkbox][id^=ox-table1]").prop("checked", false).trigger("change");

        screen.v.fileDownCount = 0;
        screen.v.fileDownList = [];

        screen.f.setFileDownCount();
      },

      // 개별 또는 전체 파일 클릭
      clickFileDownCheck: (e) => {
        const idx = Number(e.target.id.replace("ox-table1-", ""));
        const fileId = e.target.getAttribute("data-id");
        const allCheckBox = $("input[type=checkbox][id^=ox-table1][data-yn=Y]");

        if (idx !== 1) { // 개별 선택

          if (e.target.checked) {
            screen.v.fileDownCount++;

            if (!screen.v.fileDownList.includes(fileId)) {
              screen.v.fileDownList.push(fileId);
            }
          } else {
            screen.v.fileDownCount = Math.max(0, screen.v.fileDownCount - 1);
            screen.v.fileDownList = [...screen.v.fileDownList].filter((id) => id !== fileId);
          }
        } else { // 전체 선택

          if (e.target.checked) {
            allCheckBox.prop("checked", true).trigger("change");

            screen.v.fileDownCount = Math.min(screen.v.pagingNum, allCheckBox.length);
            allCheckBox.map((idx, item) => screen.v.fileDownList.push(item.getAttribute("data-id")));

          } else screen.f.resetFileCheck();
        }

        screen.f.setFileDownCount();
      },

      // 체크된 파일 개수
      setFileDownCount: () => {
        $("button[name=fileDown] strong.text-primary").text(`(${screen.v.fileDownCount}건)`);
      },

      // 파일 다운로드
      downloadFile: (e) => {
        const isLogin = screen.f.checkLogin();
        const isRight = isLogin? screen.f.checkRight() : false;
        const name = e.currentTarget.name;
        let href;

        if (isLogin && isRight) {
          if (name === "fileDown")
            href = screen.f.downMultiFile();

          if (name === "downloadBtn")
            href = screen.f.downSingleFile(e);

          if (name === "fileDown" && !screen.v.fileDownList.length) {
            $alert.open("MG00030"); // sample
          } else {
            $alert.open("MG00010", () => {
              let link = document.createElement("a");

              link.target = "_blank";
              link.href = href;
              link.click();
              link.remove();

              screen.f.resetFileId();
            });
          }
        }
      },

      // multi file 다운로드
      downMultiFile: () => {
        let fileIdx = "";

        screen.v.fileDownList.map((item, idx) => {
          fileIdx += item;
          if (screen.v.fileDownList.length !== idx + 1) fileIdx += ",";
        });

        return `/pages/api/file/down/multi/${fileIdx}`;
      },

      // single file 다운로드
      downSingleFile: (e) => {
        const target = $(e.currentTarget);

        if(target.data("method") === "CMS") {
          const param = target.data("param");

          return `https://api-cms.mirae-n.com/down_content?service=mteacher&params=${param}`;

        } else {
          screen.v.fileId = target.data("id");

          return `/pages/api/file/down/${screen.v.fileId}`;
        }
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

      // file id 데이터 초기화
      resetFileId: () => {
        screen.v.fileDownList = [];
        screen.v.fileId = null;
        screen.v.fileDownCount = 0;

        screen.f.setFileDownCount();

        $("input[type=checkbox][id^=ox-table1-1]").prop("checked", false).trigger("change");
        $("input[type=checkbox][id^=ox-table1][data-yn=Y]").prop("checked", false).trigger("change");
      },

      // 로그인 확인
      checkLogin: () => {
        if (!screen.v.isLogin) {
          screen.f.resetFileId();

          $alert.open("MG00001");

          return false;
        }

        return true;
      },

      // 권한 확인
      checkRight: () => {
        if (screen.v.userRight !== "0010") {
          $alert.open("MG00003");

          screen.f.resetFileId();

          return false;
        }

        return true;
      },

      // 즐겨찾기 설정
      setMyFavorite: (e) => {
        if(!screen.v.isLogin) {
          $alert.open("MG00001");
          $("#reg-favorite[type=checkbox]").prop("checked", false);

          return;
        }

        const isChecked = $(e.currentTarget).is(":checked");

        if (isChecked) screen.c.addFavorite(isChecked);
        else screen.c.updateFavorite(isChecked);

      },

      toast: (isChecked) => {
        if (isChecked) $toast.open(toastScreen.v.favorite, "MG00038");
        else $toast.open(toastScreen.v.favorite, "MG00039");

        $quick.getFavorite();
      },

      getCurrentLocationByName: () => {
        let concatenatedText = "";
        $(".breadcrumbs ul").find("li:not(.home)").each(function (index) {
          let $this = $(this);
          let text = $this[0].childNodes.length제 > 0 ? $this[0].childNodes[0].textContent : $this.text();
          if (index !== 0) {
            concatenatedText += " > ";
          }
          concatenatedText += text;
        });

        return concatenatedText;
      },

    },

    event: function () {

      // 카테고리 체크박스
      $(document).on("change", "input[type=checkbox][name^=category]", screen.f.setCategoryData);

      // 태그삭제
      $(document).on("click", "button[name=delTagBtn]", screen.f.removeTag);

      // 카테고리 전체해제
      $(document).on("click", "button[name=clearTagBtn]", screen.f.disableAllCategory);

      // 탭 클릭
      $(".tab li a").on("click", screen.f.clickTab);

      // 검색
      $(document).on("click", "button[name=searchBtn]", screen.f.clickSearchBtn);
      $(document).on("keyup", "input[name=searchTxt]", screen.f.enterSearchBar);

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 체크 박스
      $(document).on("click", "input[type=checkbox][id^=ox-table1]", screen.f.clickFileDownCheck);

      // multi file 다운로드
      $(document).on("click", "button[name=fileDown]", screen.f.downloadFile);

      // single file 다운로드
      $(document).on("click", "button[name=downloadBtn]", screen.f.downloadFile);

      // 파일 미리보기
      $(document).on("click", "button[name=previewBtn]", screen.f.previewFile);

      // 즐겨찾기 등록
      $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);
    },

    init: function () {
      screen.v.isLogin = $("#isLogin").val() === "true";
      screen.v.userRight = $("#userRight").val();

      screen.v.pageSeq = location.pathname.includes("/mid/")? "901" : "902";
      screen.v.tabIdx = "1";
      screen.v.mainId = screen.v.defaultMainId;
      screen.v.mainInfo = screen.v.mainInfoList.filter((data) => data.mainId === screen.v.mainId)[0];

      screen.event();
      screen.f.initState();
      screen.f.setCombo(screen.v.tabIdx);
    },
  };
  screen.init();
});