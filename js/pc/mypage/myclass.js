$(function () {
  let screen = {
    v: {
      subjectLevelCode: null,
      tabIdx: null,
      levelCode: null, // 초 중 고
      typeCode: null, // 즐겨찾기 > 선택
      urlLevel: null, // 즐겨찾기 > 링크 > ele or mid or high
      scrapType: null, // 스크랩 > 옵션
      fileList: [], // 체크된 row의 file ld list
      seqList: [], // 체크된 row의 seq
      textbookOption: null, // 내자료 > 교과서
      mylinkInfo: {},
      domain: {},
    },

    c: {
      // 즐겨찾기 데이터
      getFavoriteList: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/searchMyclassFavList.ax",
          data: {
            level: screen.v.levelCode,
            typeCode: screen.v.typeCode,
            urlLevel: screen.v.urlLevel,
          },
          success: (res) => {
            if (res.totalCnt === 0) {
              screen.f.noFavoriteList();
            } else screen.f.bindFavoriteList(res.totalCnt, res.row);
          }
        };

        $cmm.ajax(option);
      },

      // 스크랩 데이터
      getScrapList: (pagingNow = 0) => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/getMyclassScrapList.ax",
          data: {
            type: screen.v.scrapType,
            pagingNow
          },
          success: (res) => {
            screen.f.resetCheck();

            if (res.totalCnt === 0)
              screen.f.noScrapList();
            else if (screen.v.scrapType === "TEXTBOOK")
              screen.f.bindScrapTextbookList(res.rows);
            else
              screen.f.bindScrapBoardList(res.rows);

            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(option);
      },

      // 내 자료 '과목' 옵션
      getMydataSelectOption: () => {
        const subjectCode = $("#option-subject").val();

        if (subjectCode) {
          const option = {
            method: "POST",
            url: "/pages/api/mypage/getMydataTextbookOptionList.ax",
            data: {
              revisionCode: $("#option-revision").val(),
              gradeCode: $("#option-grade").val(),
              subjectCode,
            },
            success: (res) => {
              screen.f.bindMydataSelectOption(res.rows);
            }
          };

          $cmm.ajax(option);
        } else screen.f.bindMydataSelectOption([]);
      },

      // 내 자료 데이터
      getMydataList: (pagingNow = 0) => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/getMydataList.ax",
          data: {
            revisionCode: $("#option-revision").val(),
            gradeCode: $("#option-grade").val(),
            subjectCode: $("#option-subject").val(),
            textName: screen.v.textbookOption,
            search: $("#search").val(),
            pagingNow,
          },
          success: (res) => {
            screen.f.resetCheck();

            if (res.totalCnt === 0)
              screen.f.noMydataList();
            else
              screen.f.bindMydataList(res.rows);

            $paging.bindTotalboardPaging(res);
          },
          error: (err) => {
            console.error(err);
          }
        };

        $cmm.ajax(option);
      },

      // 스크랩 > 선택 삭제
      deleteScrap: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/updateScrap.ax",
          data: {
            scrapType: screen.v.scrapType,
            referenceSeqList: JSON.stringify(screen.v.seqList),
          },
          success: (res) => {
            screen.c.getScrapList();
          }
        };

        $cmm.ajax(option);
      },

      // 내자료 > 선텍 삭제
      deleteMydata: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/deleteMydata.ax",
          data: {
            seqList: JSON.stringify(screen.v.seqList),
          },
          success: (res) => {
            screen.c.getMydataList();
          }
        };

        $cmm.ajax(option);
      },

      // 내자료 > 내링크 등록 > 교과 정보 선택 > 단원
      getTexbookList: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/getTexbookList.ax",
          data: {
            grade: $(".popup #grade").val(),
            term: $(".popup #semester").val(),
            subject: $(".popup #subject").val()
          },
          success: (res) => {
            const select = $(".popup #chapter01"); // 단원
            const select2 = $(".popup #chapter02"); // 단원
            const ul = $(".options ul"); // 차시
            const button = $("button[name=selectedOp]");

            select.empty();
            select2.empty();
            ul.empty();
            button.empty();

            select.append("<option value='' selected>선택해 주세요.</option>");
            select2.append("<option value='' selected>선택해 주세요.</option>");
            button.append("<span>선택해 주세요.</span>");

            for (const item of res.rows) {
              const author = item.author ? `(${item.author})` : "";
              select.append(`<option value="${item.seq}" data-id="${item.revision}">[${item.revision}] ${item.textbook} ${author}</option>`);
            }
          }
        };

        $cmm.ajax(option);
      },

      // 내자료 > 내링크 등록 > 교과 정보 선택 > 단원 세부
      getTextbookUnitList: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/getTextbookUnitList.ax",
          data: {
            masterSeq: $(".popup #chapter01").val(),
          },
          success: (res) => {
            const select = $(".popup #chapter02"); // 단원 세부
            const ul = $(".options ul"); // 차시
            const button = $("button[name=selectedOp]");

            select.empty();
            ul.empty();
            button.empty();

            select.append("<option value='' selected>선택해 주세요.</option>");
            button.append("<span>선택해 주세요.</span>");

            for (const item of res.rows) {
              select.append(`<option value="${item.seq}">${item.num}. ${item.name}</option>`);
            }
          }
        };

        $cmm.ajax(option);
      },

      // 내자료 > 내링크 등록 > 교과 정보 선택 > 차시
      getTextbookSubList: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/getTextbookSubList.ax",
          data: {
            unitSeq: $(".popup #chapter02").val(),
          },
          success: (res) => {
            const subjectName = $(".popup #subject option:selected").text();
            const ul = $(".options ul");
            const button = $("button[name=selectedOp]");

            ul.empty();
            button.empty();

            button.append("<span>선택해 주세요.</span>");

            for (const item of res.rows) {
              const subNum = item.eSub ? `${item.sSub}~${item.eSub}` : item.sSub;

              ul.append(`
                <li>
                  <button type="button">
                    <span data-id="${item.seq}" data-name="subName">[${subNum}차시] ${item.name}</span>
                    <span class="badge type-rounded fill-light" data-name="subPage">${subjectName} ${item.sPage}~${item.ePage}쪽</span>
                  </button>
                </li>
              `);
            }
          }
        };

        $cmm.ajax(option);
      },

      // 내자료 > 내링크 등록 > 데이터 저장
      saveMydata: () => {
        const option = {
          method: "POST",
          url: "/pages/api/mypage/addMydata.ax",
          data: screen.v.mylinkInfo,
          success: (res) => {
            // reset variable
            screen.v.mylinkInfo = {};

            // close popup
            closePopup({id: "reg-my-link"});

            // reload list
            screen.c.getMydataList();
          }
        };

        $cmm.ajax(option);
      },
    },

    f: {
      // 학급 선택 항목 disabled 설정
      setLevelDisabled: () => {
        if (!screen.v.subjectLevelCode) { // no level
          // $("#ox-class-1").prop("disabled", true); // 초등
          // $("#ox-class-3").prop("disabled", true); // 고등

          $("#ox-class-2").prop("checked", true).trigger("click"); // 중등
        } else {
          // $("input[type=radio][name=class]").prop("disabled", true);
          // $(`input[type=radio][data-id=${screen.v.subjectLevelCode}]`).prop("disabled", false);

          $(`input[type=radio][data-id=${screen.v.subjectLevelCode}]`).prop("checked", true).trigger("click");
        }
      },

      // 맨 처음 탭 활성화
      tabClickTrigger: () => {
        screen.v.tabIdx = $("#tabIdx").val();

        if (screen.v.tabIdx !== "1")
          $(`.tab li a[href='#tab${screen.v.tabIdx}']`).trigger("click");
      },

      // 변수 초기화
      init: () => {
        screen.v.levelCode = screen.v.subjectLevelCode || "MIDDLE";
        screen.v.typeCode = "";

        screen.f.setFavoriteUrlLevel(screen.v.levelCode);

        screen.v.scrapType = "TEXTBOOK";

        screen.v.textbookOption = '';

        $(`input[id^=ox-class-][data-id="${screen.v.levelCode}"]`).prop("checked", true).trigger("click");
        $("#ox-category-1").prop("checked", true).trigger("click");

        screen.f.resetCheck();
      },

      // 내자료 > 공통코드
      setCombo: () => {
        const list = ["T02", "T04", "T05"];

        $cmm.getCmmCd(list).then((res) => {
          for (const code of list) {
            const select = $(`select[name=combo-${code}]`);
            let defaultOption;

            switch (code) {
              case "T02":
                defaultOption = "개정";
                break;
              case "T04":
                defaultOption = "과목";
                break;
              case "T05":
                defaultOption = "학년";
                break;
            }

            select.append(`<option value="" selected>${defaultOption} 전체</option>`);

            for (const item of res.row[code]) {
              select.append(`<option value="${item.commonCode}">${item.name}</option>`);
            }
          }

        });
      },

      // 내자료 > 팝업 공통 코드
      setPopupCombo: (list) => {
        $cmm.getCmmCd(list).then((res) => {
          for (const code of list) {
            const select = $(`select[name=combo-pp-${code}]`);

            select.empty();
            select.append("<option value='' selected>선택해 주세요.</option>");

            for (const item of res.row[code]) {
              select.append(`<option value="${item.commonCode}">${item.name}</option>`);
            }
          }
        });

      },

      // 파일 선택 초기화
      resetCheck: () => {
        screen.v.fileList = [];
        screen.v.seqList = [];

        $(`#tab${screen.v.tabIdx} input[type=checkbox][id^=check-]:not(:disabled)`)
            .prop("checked", false).trigger("change");
      },

      // 탭 클릭
      clickTab: (e) => {
        screen.v.tabIdx = $(e.target).closest("a").attr("href").replace("#tab", "");

        screen.f.init();

        switch (screen.v.tabIdx) {
          case "1":
            screen.c.getFavoriteList();
            break;
          case "2":
            screen.c.getScrapList();
            break;
          case "3":
            screen.c.getMydataSelectOption();
            screen.c.getMydataList();
            break;
        }
      },

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;

        if (screen.v.tabIdx === "2")
          screen.c.getScrapList(pagingNow);
        else if (screen.v.tabIdx === "3")
          screen.c.getMydataList(pagingNow);
      },

      // 즐겨찾기 > 학급
      setFavoriteLevel: (e) => {
        screen.v.levelCode = $(e.currentTarget).data("id");

        screen.f.setFavoriteUrlLevel(screen.v.levelCode);

        $("#ox-textbook-1").prop("checked", true).trigger("click");
      },

      setFavoriteUrlLevel: (level) => {
        switch (level) {
          case "ELEMENT":
            screen.v.urlLevel = "/ele/";
            $("#ox-textbook-3").closest("span").show();
            break;
          case "MIDDLE":
            screen.v.urlLevel = "/mid/";
            $("#ox-textbook-3").closest("span").hide();
            break;
          case "HIGH":
            screen.v.urlLevel = "/high/";
            $("#ox-textbook-3").closest("span").hide();
            break;
        }
      },

      // 즐겨찾기 > 선택
      setFavoriteType: (e) => {
        screen.v.typeCode = $(e.currentTarget).data("id");
        screen.c.getFavoriteList();
      },

      //  즐겨찾기 > 데이터 없음
      noFavoriteList: () => {
        const div = $("#tab1 .table-items");
        const html = `
          <table>
            <caption> 등록된 즐겨찾기</caption>
            <colgroup>
              <col width="13%">
              <col width="13%">
              <col width="*">
              <col width="13%">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">유형</th>
                <th scope="col">NO</th>
                <th scope="col">즐겨찾기</th>
                <th scope="col">등록일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4" class="no-hover">
                  <div class="box-no-data"> 자주 사용하는 교과서 및 서비스를 즐겨찾기 등록해 보세요.
                    <br/>수업 자료 이용이 더욱 편리해 집니다.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        `;

        $("strong[name=totalCnt]").text(0);
        div.empty();
        div.append(html);
      },

      // 즐겨찾기 데이터 바인드
      bindFavoriteList: (totalCnt, obj) => {
        const div = $("#tab1 .table-items");
        const map = new Map();
        const objKeys = Object.keys(obj);
        let html = "";

        if (objKeys.length !== 1) {
          if (obj["mrnList"].length) map.set("mrnList", obj["mrnList"]);
          if (obj["otherList"].length) map.set("otherList", obj["otherList"]);
          if (obj["mteacherList"].length) map.set("mteacherList", obj["mteacherList"]);
          if (obj["linkList"].length) map.set("linkList", obj["linkList"]);

        } else map.set(objKeys[0], obj[objKeys[0]]);

        const firstKey = [...map.keys()][0];

        for (const k of map.keys()) {
          if ((screen.v.levelCode === "MIDDLE"
                  || screen.v.levelCode === "HIGH")
              && k === "otherList") continue;

          html += "<table>";

          html += `
            <caption> 등록된 즐겨찾기</caption>
            <colgroup>
              <col width="13%">
              <col width="13%">
              <col width="*">
              <col width="13%">
            </colgroup>`;

          if (k === firstKey) {
            html += `
              <thead>
                  <tr>
                  <th scope="col">유형</th>
                  <th scope="col">NO</th>
                  <th scope="col">즐겨찾기</th>
                  <th scope="col">등록일</th>
                </tr>
              </thead>
            `;
          }

          html += "<tbody>";

          if (k === "linkList") {
            for (const row of map.get(k)) {
              html += `
              <tr>
                <td>${row.typeName}</td>
                <td>${row.rowNum}</td>
                <td class="text-left">
                  <a href="${row.link}" class="title">
                    <ul class="divider-group type-brace">
                      <li>${row.name}</li>
                    </ul>
                  </a>
                </td>
                <td>${row.createDate}</td>
              </tr>
            `;
            }
          } else {
            for (const row of map.get(k)) {
              html += `
              <tr>
                <td>${row.typeName}</td>
                <td>${row.rowNum}</td>
                <td class="text-left">
                  <a href="${row.link}" class="title">
                    <ul class="divider-group type-brace">
                      <li>${row.revision}</li>
                      ${row.grade ? `<li>${row.grade}</li>` : ''}
                      <li>${row.term}</li>
              `;

              if (k !== "mteacherList") html += `<li>${row.name}</li>`;

              html += `
                    </ul>
                  </a>
                </td>
                <td>${row.createDate}</td>
              </tr>
            `;
            }
          }

          html += "</tbody></table>";
        }


        $("strong[name=totalCnt]").text(totalCnt);
        div.empty();
        div.append(html);
      },

      // 스크랩 > 데이터 없음
      noScrapList: () => {
        const div = $("#tab2 .table-items");
        let html;

        div.empty();

        if (screen.v.scrapType === 'TEXTBOOK') {
          $("button[name=multiDownload]").show();

          html = `
            <table>
              <caption> 스크랩 리스트 테이블</caption>
              <colgroup>
                <col width="7%">
                <col width="10%">
                <col width="10%">
                <col width="*">
                <col width="13%">
                <col width="13%">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span class="ox">
                      <input type="checkbox" id="all-check" disabled>
                      <label for="all-check"></label>
                    </span>
                  </th>
                  <th scope="col">자료유형</th>
                  <th scope="col">NO</th>
                  <th scope="col" colspan="2">자료명</th>
                  <th scope="col">등록일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" class="no-hover">
                    <div class="box-no-data"> 등록된 스크랩이 없습니다.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
        `;
        } else {
          $("button[name=multiDownload]").hide();

          html = `
            <table>
              <caption> 스크랩 리스트 테이블</caption>
              <colgroup>
                <col width="7%">
                <col width="10%">
                <col width="*">
                <col width="13%">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span class="ox">
                      <input type="checkbox" id="all-check" disabled>
                      <label for="all-check"></label>
                    </span>
                  </th>
                  <th scope="col">NO</th>
                  <th scope="col">제목</th>
                  <th scope="col">등록일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="4" class="no-hover">
                    <div class="box-no-data"> 등록된 스크랩이 없습니다.</div>
                  </td>
                </tr>
              </tbody>
            </table>
        `;
        }

        div.append(html);
      },

      // 스크랩 데이터 바인드 (교과서 자료)
      bindScrapTextbookList: (list) => {
        const div = $("#tab2 .table-items");

        div.empty();
        $("button[name=multiDownload]").show();

        let html = `
          <table>
            <caption> 스크랩 리스트 테이블</caption>
            <colgroup>
              <col width="7%">
              <col width="10%">
              <col width="10%">
              <col width="*">
              <col width="13%">
              <col width="13%">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  <span class="ox">
                    <input type="checkbox" id="all-check">
                    <label for="all-check"></label>
                  </span>
                </th>
                <th scope="col">자료유형</th>
                <th scope="col">NO</th>
                <th scope="col" colspan="2">자료명</th>
                <th scope="col">등록일</th>
              </tr>
            </thead>
            <tbody>
        `;

        for (const row of list) {
          let previewDisabled = "";
          let downloadDisabled = "";
          let shareDisabled = "";

          if (row.preview === "N")
            previewDisabled = "disabled";

          if (row.download === "N")
            downloadDisabled = " disabled";

          if (row.share === "N")
            shareDisabled = " disabled";


          html += `
            <tr>
              <td>
                <span class="ox">
                  <input type="checkbox" 
                         id="check-${row.rowNum}" 
                         data-id="${row.referenceSeq}" 
                         data-file="${row.fileId}"
                         data-yn="${row.download}">
                  <label for="check-${row.rowNum}"></label>
                </span>
              </td>
              <td>${row.type}</td>
              <td>${row.rowNum}</td>
          `;

          if (row.level === "ELEMEMT") {
            html += `
              <td>
                <p class="title">${row.title}</p>
                <ul class="divider-group type-brace">
                  [${row.levelName ? `<li>${row.levelName}</li>` : ''}
                  ${row.revision ? `<li>${row.revision}</li>` : ''}
                  ${row.grade ? `<li>${row.grade}</li>` : ''}
                  ${row.term ? `<li>${row.term}</li>` : ''}
                  ${row.subName ? `<li>${row.subName}</li>` : ''}
                  ${row.textbookName ? `<li>${row.textbookName}</li>` : ''}
                  ${row.unitName ? `<li>${row.unitName}</li>` : ''}]
                </ul>
              </td>
            `;
          } else {
            html += `
              <td>
                <p class="title">${row.title}</p>
                <ul class="divider-group type-brace">
                  [${row.levelName ? (row.levelName === '중등'? '<li>중학</li>' : `<li>${row.levelName}</li>`) : ''}
                  ${row.revision ? `<li>${row.revision}</li>` : ''}
                  ${row.subName ? `<li>${row.subName}</li>` : ''}
                  ${row.textbookName ? `<li>${row.textbookName}</li>` : ''}
                  ${row.unitName ? `<li>${row.unitName}</li>` : ''}]
                </ul>
              </td>
            `;
          }

          html += `
              <td>
                <div class="buttons align-center">
                  <a class="button type-icon size-sm ${previewDisabled}" 
                     title="미리보기" 
                     name="preview"
                     data-id="${row.fileId}">
                    <svg>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                    </svg>
                  </a>
                  <button class="button type-icon size-sm ${downloadDisabled}" 
                          title="다운로드" 
                          name="download"
                          data-id="${row.fileId}">
                    <svg>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                    </svg>
                  </button>
                  <button class="button type-icon size-sm ${shareDisabled}" 
                          title="공유하기" 
                          name="share"
                          data-id="${row.fileId}">
                    <svg>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                    </svg>
                  </button>
                </div>
              </td>
              <td>${row.createDate}</td>
            </tr>
        `;
        }

        html += `
            </tbody>
          </table>
        `;

        div.append(html);
      },

      // 스크랩 데이터 바인드 (게시글)
      bindScrapBoardList: (list) => {
        const div = $("#tab2 .table-items");

        div.empty();
        $("button[name=multiDownload]").hide();

        let html = `
          <table>
            <caption> 스크랩 리스트 테이블</caption>
            <colgroup>
              <col width="7%">
              <col width="10%">
              <col width="*">
              <col width="13%">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  <span class="ox">
                    <input type="checkbox" id="all-check">
                    <label for="all-check"></label>
                  </span>
                </th>
                <th scope="col">NO</th>
                <th scope="col">제목</th>
                <th scope="col">등록일</th>
              </tr>
            </thead>
            <tbody>
        `;

        for (const row of list) {
          const path = row.menuPath.split(">");
          const pathname = row.url;
          let href = "";

          if (!pathname) href = "#";
          else {
            if (pathname.includes("/ele/")) href = screen.v.domain["ele"] + pathname;
            if (pathname.includes("/mid/")) href = screen.v.domain["mid"] + pathname;
            if (pathname.includes("/high/")) href = screen.v.domain["high"] + pathname;
          }

          html += `
              <tr>
                <td>
                  <span class="ox">
                    <input type="checkbox" 
                           id="check-${row.rowNum}" 
                           data-id="${row.referenceSeq}" >
                    <label for="check-${row.rowNum}"></label>
                  </span>
                </td>
                <td>${row.rowNum}</td>
                <td>
                  <a href="${href}" class="block-wrap">
          `;

          if (row.thumbnail) {
            html += `
                    <div class="img-wrap">
                      <img src="${row.thumbnail}" alt="">
                    </div>
            `;
          }

          html += `
                    <div>
                      <p class="ellipsis-single title">${row.title}</p>
                      <ul class="divider-group type-brace">
                        [ ${row.level ? (row.level === '중등'? '<li>중학</li>' : `<li>${row.level}</li>`) : ''}
                        ${path[0] ? `<li>${path[0]}</li>` : ''}
                        ${path[1] ? `<li>${path[1]}</li>` : ''}
                        ${path[2] ? `<li>${path[2]}</li>` : ''} ]
                      </ul>
                    </div>
                  </a>
                </td>
                <td>${row.createDate}</td>
              </tr>
          `;
        }

        html += `
            </tbody>
          </table>
        `;

        div.append(html);
      },

      // 스크랩 > 유형
      setScrapType: (e) => {
        screen.v.scrapType = $(e.currentTarget).data("id");

        screen.c.getScrapList();
      },

      // 스크랩/내자료 > 자료 선택
      clickFileCheckbox: (e) => {
        const target = e.currentTarget;
        const allCheckBox = $(`#tab${screen.v.tabIdx} input[type=checkbox][id^=check-]:not(:disabled)`);

        if (target.id === "all-check" || target.id === "all-check-0") {
          screen.f.resetCheck();

          if (target.checked) {
            allCheckBox.prop("checked", true).trigger("change");
            allCheckBox.map((idx, item) => {
              screen.v.seqList.push($(item).data("id"));

              if (screen.v.tabIdx === "2" && $(item).data("yn") === "Y") {
                screen.v.fileList.push($(item).data("file"));
              }
            });
          }

        } else {
          const seq = $(target).data("id");
          const fileId = $(target).data("file");
          const downloadYn = $(target).data("yn");

          if (target.checked) {
            screen.v.seqList.push(seq); // for delete

            if (screen.v.tabIdx === "2" && downloadYn === "Y")
              screen.v.fileList.push(fileId); // for download

            if (screen.v.seqList.length === allCheckBox.length)
              $("input[type=checkbox][id^=all-check]").prop("checked", true);
          } else {
            screen.v.seqList = [...screen.v.seqList].filter(data => data !== seq);

            if (screen.v.tabIdx === "2" && downloadYn === "Y")
              screen.v.fileList = [...screen.v.fileList].filter(data => data !== fileId);

            if (!screen.v.seqList.length)
              $("input[type=checkbox][id^=all-check]").prop("checked", false);
          }
        }
      },

      // 선택된 항목 개수 확인
      checkFileCount: (type) => {
        let isLength;

        if (type === "download")
          isLength = screen.v.fileList.length !== 0;

        if (type === "delete")
          isLength = screen.v.seqList.length !== 0;

        if (!isLength)
          $alert.open("MG00030");

        return isLength;
      },

      // 스크랩 > 미리보기
      previewFile: (e) => {
        const fileId = $(e.currentTarget).data("id");

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
      },

      // 스크랩 > 공유하기
      shareFile: (e) => {
        const fileId = $(e.currentTarget).data("id");

        $alert.open('MG00054', function () {
          const url = 'https://ele.m-teacher.co.kr/mevent/aiClass/';
          window.open(url,"_blank");
        });
      },

      // 파일 다운로드
      downloadFile: (href) => {
        $alert.open("MG00010", () => {
          let link = document.createElement("a");

          link.target = "_blank";
          link.href = href;
          link.click();
          link.remove();

          screen.f.resetCheck();
        });
      },

      // 스크랩 > 개별 다운로드
      downSingleFile: (e) => {
        screen.f.downloadFile(`/pages/api/file/down/${$(e.currentTarget).data("id")}`);
      },

      // 스크랩 > 선택 다운로드
      downMultiFile: () => {
        if (screen.f.checkFileCount("download")) {
          let fileIdx = "";

          screen.v.fileList.map((item, idx) => {
            fileIdx += item;
            if (screen.v.fileList.length !== idx + 1) fileIdx += ",";
          });

          screen.f.downloadFile(`/pages/api/file/down/multi/${fileIdx}`);
        }
      },

      // 선택 삭제
      delete: () => {
        console.log("delete");
        if (screen.f.checkFileCount("delete")) {
          $alert.open("MG00031", () => {
            if (screen.v.tabIdx === "2")
              screen.c.deleteScrap();
            else screen.c.deleteMydata();
          });
        }
      },

      // 내자료 > selectbox 변경
      changeOption: (e) => {
        const id = (e.currentTarget.id).replace("option-", "");

        if (id !== "textbook") {
          screen.v.textbookOption = '';

          screen.c.getMydataSelectOption();
          screen.c.getMydataList();
        } else {
          screen.v.textbookOption = $("#option-textbook").val();

          screen.c.getMydataList();
        }
      },

      // 내자료 > selectbox 옵션
      bindMydataSelectOption: (options) => {
        const select = $("#option-textbook");

        select.empty();
        select.append("<option value='' selected>교과서 전체</option>");

        if (options.length) {
          for (const item of options) {
            select.append(`<option value="${item.name}" data-id="${item.seq}">${item.name}</option>`);
          }
        }
      },

      // 내자료 > 데이터 없음
      noMydataList: () => {
        const div = $("#tab3 .table-items tbody");

        div.empty();

        div.append(`
          <tr>
            <td colspan="5" class="no-hover">
              <div class="box-no-data"> 등록된 내 자료가 없습니다.</div>
            </td>
        </tr>
        `);
      },

      // 내자료 > 데이터 바인드
      bindMydataList: (list) => {
        const div = $("#tab3 .table-items tbody");

        div.empty();

        for (const row of list) {
          let fillClass;
          let fillText;

          if (row.category === "ONLYFORME") {
            fillClass = "secondary";
            fillText = "나만보기";
          } else {
            fillClass = "green";
            fillText = "함께보기";
          }

          let html = `
            <tr>
              <td>
                <span class="ox">
                  <input type="checkbox" id="check-${row.rowNum}-0" data-id="${row.seq}">
                  <label for="check-${row.rowNum}-0"></label>
                </span>
              </td>
              <td>${row.rowNum}</td>
              <td>
                <span class="badge type-round-box size-sm fill-${fillClass}">
                  ${fillText}
                </span>
              </td>
              <td class="text-left">
                <a href="${row.url}" target="_blank">
                  <div class="inline-wrap">
                    <p class="title">
                      ${row.title}
                    </p>
                    <svg class="icon-size-sm">
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-new-windows-single"></use>
                    </svg>
                  </div>
          `;

          if (row.isMapping === "Y") {
            html += `<ul class="divider-group type-brace">`;

            if (row.revision) {
              html += `<li>${row.revision}</li>`;
            }

            html += `
              <li>${row.grade}</li>
              <li>${row.term}</li>
              <li>${row.subject}</li>
            `;

            if (row.subName) {
              html += `<li>${row.subName}</li>`;
            }

            html += `</ul>`;
          }

          html += `
                </a>
              </td>
              <td>${row.createDate}</td>
            </tr>
          `;

          div.append(html);
        }
      },

      // 내자료 > 검색
      search: () => {
        screen.c.getMydataList();
      },

      // 내자료 > 엔터 겁색
      enterSearch: (e) => {
        if (screen.v.tabIdx === "3" && e.keyCode === 13)
          screen.f.search();
      },

      // 내자료 > 공통콤보 초기화
      resetComboOption: (e) => {
        const name = (e.currentTarget.name).replace("combo-pp-", "");

        switch (name) {
          case "T05":
            screen.f.setPopupCombo(["T04", "T06"]);
            screen.f.setTextbookOption();
            break;
          case "T06":
            screen.f.setPopupCombo(["T04"]);
            screen.f.setTextbookOption();
            break;
        }
      },

      // 내자료 > 교과 정보 선택 > 단원 select option 설정
      setTextbookOption: () => {
        screen.c.getTexbookList();
      },

      // 내자료 > 교과 정보 선택 > 단원 세부 select option 설정
      setTextbookUnitOption: () => {
        screen.c.getTextbookUnitList();
      },

      // 내자료 > 교과 정보 선택 > 차시 select option 설정
      setTextbookSubOption: () => {
        screen.c.getTextbookSubList();
      },

      // 내 링크 등록 기본값
      resetMylink: () => {
        screen.v.mylinkInfo = {};

        $("#link-name").val(""); // 링크명
        $("#link-url").val(""); // 링크 url

        $("#selectTextInfo").show();
        $("#selectedTextInfo").hide();

        $("#ox-data-2").prop("checked", true).trigger("change"); // 함께보기
        $("input[name=agree]").prop("checked", false).trigger("change"); // 동의 해제
      },

      // 교과 정보 기본값
      resetTextbook: () => {
        screen.v.mylinkInfo = {};

        screen.f.setPopupCombo(["T04", "T05", "T06"]);
        screen.f.setTextbookOption();
      },

      // url protocol 확인
      checkLinkUrl: (e) => {
        const protocol = "https://";
        const value = e.currentTarget.value;

        if (value) {
          const isProtocol = value.includes(protocol);

          if (!isProtocol) $(e.currentTarget).val(protocol + value);
        }
      },

      // 내 링크 등록 반영
      saveMylink: () => {
        const linkName = $("#link-name").val();
        const linkUrl = $("#link-url").val();
        const category = $("input[type=radio][name=data]:checked").val();
        const isAgree = category === "TOGETHER"? $("input[name=agree]").is(":checked") : true;

        const isRequire = !!linkName && !!linkUrl && !!category && isAgree;

        if (isRequire) {
          $alert.open("MG00026", () => { // 등록 confirm
            const isCurriculum = !!Object.keys(screen.v.mylinkInfo).length;

            screen.v.mylinkInfo["dataType"] = "MYDATA";
            screen.v.mylinkInfo["curriculumInfoUseYn"] = isCurriculum? "Y" : "N";
            screen.v.mylinkInfo["useYn"] = "Y";

            screen.v.mylinkInfo["linkName"] = linkName;
            screen.v.mylinkInfo["linkUrl"] = linkUrl;
            screen.v.mylinkInfo["dataGubun"] = category;

            // save DB
            screen.c.saveMydata();
          });

        } else { // 필수값 확인 바람
          $alert.open("MG00020");
        }
      },

      // 정보 제공 동의 show & hide
      setAgreeDiv: (e) => {
        const id = e.currentTarget.value;
        const div = $("#agree");

        if (id === "ONLYFORME") div.hide();
        if (id === "TOGETHER") div.show();
      },

      // 교과 정보 선택 반영
      setTextbook: () => {
        const div = $(".section");
        const grade = $(".popup #grade option:selected").text(); // 학년 텍스트 (필수)
        const term = $(".popup #semester option:selected").text(); // 학기 텍스트 (필수)
        const subject = $(".popup #subject option:selected").text(); // 과목 텍스트 (필수)
        const text = $("button[name=selectedOp] span").text(); // 차시 텍스트

        const gradeCode = $(".popup #grade").val(); // 학년 코드 (필수)
        const termCode = $(".popup #semester").val(); // 학기 코드 (필수)
        const subjectCode = $(".popup #subject").val(); // 과목 코드 (필수)

        const isText = text !== "선택해 주세요."
        let subName; // 차시 숫자 및 이름
        let subPage; // 차시 과목 및 페이지

        if (isText) {
          subName = $("button[name=selectedOp] span[data-name=subName]").text();
          subPage = $("button[name=selectedOp] span[data-name=subPage]").text();
        }

        if (gradeCode && termCode && subjectCode) { // 필수값이 충족됐을 때만 반영
          $alert.open("MG00026", () => { // 등록 confirm
            closePopup({id: "select-tex-info"});

            $("#selectTextInfo").hide();
            $("#selectedTextInfo").show();

            div.empty();

            let html = `
            <ul class="divider-group type-brace">
              <li>${grade}</li>
              <li>${term}</li>
              <li>${subject}</li>
            </ul>
          `;

            if (isText) {
              html += `
              <p class="text-xs text-black ellipsis-multi">
                <strong class="semi">${subName}</strong>
              </p>
              <span class="badge type-rounded fill-light"> ${subPage} </span>
            `;
            }

            div.append(html);

            screen.v.mylinkInfo["mappingType"] = "MYDATA";
            screen.v.mylinkInfo["subjectLevelCode"] = "ELEMENT";
            // screen.v.mylinkInfo["subjectTypeCode"] = "";

            screen.v.mylinkInfo["gradeCode"] = gradeCode; // 학년 (필수)
            screen.v.mylinkInfo["termCode"] = termCode; // 학기 (필수)
            screen.v.mylinkInfo["subjectCode"] = subjectCode; // 과목 (필수)
            screen.v.mylinkInfo["subjectRevisionCode"] = $(".popup #chapter01 option:selected").data("id") || "";
            screen.v.mylinkInfo["textbookSeq"] = $(".popup #chapter01").val() || "";
            screen.v.mylinkInfo["textbookUnit1Seq"] = $(".popup #chapter02").val() || "";
            screen.v.mylinkInfo["textbookSubjectSeq"] = $("button[name=selectedOp] span").data("id") || "";
          });

        } else { // 필수값 확인 바람
          $alert.open("MG00020");
        }
      },

      // 팝업 닫기
      closePopup: (e) => {
        const name = (e.currentTarget.name).replace("close-", "");

        $alert.open("MG00034", () => {
          if (name === "myLink") {
            screen.f.resetMylink();
            closePopup({id: "reg-my-link"});
          }

          if (name === "texInfo") {
            screen.f.resetTextbook();
            closePopup({id: "select-tex-info"});
          }
        });
      },

      openSetFavorite: () => {
          $('button[name=setFavMyClass]').attr("target-obj", "popupBookMark");
          $('#setFavoriteForm').empty();
          $('#setFavoriteForm').append($('<input>', {
              type: 'hidden',
              name: 'subjectLevelCode',
              value: $("input[name='class']:checked").data('id')
          }));
          $('#setFavoriteForm').append($('<input>', {
              type: 'hidden',
              name: 'urlLevel',
              value: '/ele/'
          }));
          $('#setFavoriteForm').append($('<input>', {
              type: 'hidden',
              name: 'commonYn',
              value: 'Y'
          }));
          $('#setFavoritePopup').removeAttr("src");
          $('#setFavoriteForm').submit();
          $('#loading').addClass("display-show");
      },

    },

    event: () => {
      // 탭 클릭
      $(".tab li").on("click", screen.f.clickTab);

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 즐겨찾기 > 학급
      $(document).on("click", "input[type=radio][name=class]", screen.f.setFavoriteLevel);

      // 즐겨찾기 > 선택
      $(document).on("click", "input[type=radio][name=textbook]", screen.f.setFavoriteType);

      // 즐겨찾기 > 설정
      $("button[name=setFavMyClass]").off("click").on("click", screen.f.openSetFavorite);

      // 스크랩 > 유형
      $("input[type=radio][name=category]").on("click", screen.f.setScrapType);

      // 스크랩 > 자료 선택
      $(document).on("click", "input[type=checkbox][id^=all-check]", screen.f.clickFileCheckbox);
      $(document).on("click", "input[type=checkbox][id^=check-]", screen.f.clickFileCheckbox);

      // 스크랩 > 미리보기
      $(document).on("click", "a[name=preview]", screen.f.previewFile);

      // 스크랩 > 공유하기
      $(document).on("click", "button[name=share]", screen.f.shareFile);

      // 스크랩 > 개별 다운로드
      $(document).on("click", "button[name=download]", screen.f.downSingleFile);

      // 스크랩 > 선택 다운로드
      $("button[name=multiDownload]").on("click", screen.f.downMultiFile);

      // 스크랩 > 선택 삭제
      $("button[name=delete]").on("click", screen.f.delete);

      // 내자료 > 옵션 선택
      $("select[id^=option-]").on("change", screen.f.changeOption);

      // 내자료 > 검색 클릭
      $("button[name=btnSearch]").on("click", screen.f.search);
      $(document).on("keyup", screen.f.enterSearch);

      // 내자료 > 교과 정보 선택 > selectbox option
      $(".popup #subject").on("change", screen.f.setTextbookOption);
      $(".popup #chapter01").on("change", screen.f.setTextbookUnitOption);
      $(".popup #chapter02").on("change", screen.f.setTextbookSubOption);

      // 내자료 > 교과 정보 선택 > 공통콤보 초기화
      $("select[name^=combo-pp-]").on("change", screen.f.resetComboOption);

      // 내 링크 등록 버튼
      $("button[name=btnMylink]").on("click", screen.f.resetMylink);

      // 교과 정보 버튼
      $("button[name=setTextbook]").on("click", screen.f.resetTextbook);

      // 내 링크 등록 (등록)
      $("button[name=ok-myLink]").on("click", screen.f.saveMylink);

      // 교과 정보 선택 (등록)
      $("button[name=ok-texInfo]").on("click", screen.f.setTextbook);

      // 팝업 닫기
      $("button[name^=close-]").on("click", screen.f.closePopup);

      // 정보 제공 동의 Show & hide
      $("input[type=radio][name=data]").on("change", screen.f.setAgreeDiv);

      // 내 링크 등록 url 입력값 확인
      $("#link-url").on("focusout", screen.f.checkLinkUrl);

      // 즐겨찾기 설정 이벤트
      $('#setFavoritePopup').on('load', function() {
          $(this).contents().find('#cancelBtn').off().on("click", () => {
              $alert.open("MG00019", () => {
                  $('#popupBookMark').removeClass('display-show');
                  $('#setFavoritePopup').attr('src', 'about:blank');
                  screen.c.getFavoriteList();
              })
          })

          $(this).contents().find('#closeBtn').off().on("click", () => {
              $('#popupBookMark').removeClass('display-show');
              $('#setFavoritePopup').attr('src', 'about:blank');
              $('body').removeClass('active-overlay');
              screen.c.getFavoriteList();
          })
          $('#loading').removeClass("display-show");
      })
    },

    init: () => {
      screen.v.subjectLevelCode = $("#subjectLevelCode").val();
      screen.v.tabIdx = "1";

      screen.v.domain["ele"] = $("#hostELE").val();
      screen.v.domain["mid"] = $("#hostMID").val();
      screen.v.domain["high"] = $("#hostHIGH").val();

      screen.event();

      screen.f.init();
      screen.f.setCombo();
      screen.f.setPopupCombo(["T04", "T05", "T06"]);
      screen.f.setLevelDisabled();
      screen.f.tabClickTrigger();

    },
  };
  screen.init();
});