$(function () {
  let screen = {
    v: {
      subjectLevelCode: null,
      tabIdx: null,
      levelCode: null, // 초 중 고
      typeCode: null, // 즐겨찾기 > 선택
      urlLevel: null, // 즐겨찾기 > 링크 > ele or mid or high
      scrapType: null, // 스크랩 > 옵션
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
    },

    f: {
      // 학급 선택 항목 disabled 설정
      setLevelDisabled: () => {
        if (!screen.v.subjectLevelCode) { // no level
          // $("#ox-class-1").prop("disabled", true); // 초등
          // $("#ox-class-3").prop("disabled", true); // 고등
          $("#ox-class-2").parents('li').addClass('active');
        } else {
          // $("input[type=radio][name=class]").prop("disabled", true);
          // $(`input[type=radio][data-id=${screen.v.subjectLevelCode}]`).prop("disabled", false);
          $(`a[data-id=${screen.v.subjectLevelCode}]`).parents('li').addClass('active');
        }
      },

      // 변수 초기화
      init: () => {
        screen.v.levelCode = screen.v.subjectLevelCode || "MIDDLE";
        screen.v.typeCode = "";

        screen.f.setFavoriteUrlLevel(screen.v.levelCode);

        screen.v.scrapType = "TEXTBOOK";

        screen.v.textbookOption = '';

        $(`a[id^=ox-class-][data-id="${screen.v.levelCode}"]`).get(0).click();
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

      // 탭 클릭
      clickTab: (e) => {
        screen.v.tabIdx = $(e.target).closest("a").attr("href").replace("#tab", "");

        screen.f.init();

        switch (screen.v.tabIdx) {
          case "1":
            screen.c.getFavoriteList();
            break;
          case "2":
            $(`a[id^=ox-category-][data-id="${screen.v.scrapType}"]`).get(0).click();
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
        // 교과 선택 영역 초기화
        screen.v.typeCode = "";
        $('select[name=textbook]').val("");

        screen.v.levelCode = $(e.currentTarget).data("id");

        screen.f.setFavoriteUrlLevel(screen.v.levelCode);

        screen.c.getFavoriteList();
      },

      setFavoriteUrlLevel: (level) => {
        switch (level) {
          case "ELEMENT":
            screen.v.urlLevel = "/ele/";
            break;
          case "MIDDLE":
            screen.v.urlLevel = "/mid/";
            break;
          case "HIGH":
            screen.v.urlLevel = "/high/";
            break;
        }
      },

      // 즐겨찾기 > 선택
      setFavoriteType: (e) => {
        screen.v.typeCode = e.currentTarget.value;

        screen.c.getFavoriteList();
      },

      //  즐겨찾기 > 데이터 없음
      noFavoriteList: () => {
        let section;

        if (screen.v.levelCode == 'ELEMENT') {
          section = $("#tab1-1 .myclass-data");
        } else if (screen.v.levelCode == 'MIDDLE') {
          section = $("#tab1-2 .myclass-data");
        } else {
          section = $("#tab1-3 .myclass-data");
        }

        section.empty();

        let html = `
          <div class="box-no-data">
            <strong class="title semi">자주 이용하는 교과서 및 서비스를<br />즐겨찾기 등록해 보세요.</strong>
            <p class="desc">수업 자료 이용이 더욱 편리해 집니다.</p>
          </div>  
        `;

        section.append(html);
      },

      // 즐겨찾기 데이터 바인드
      bindFavoriteList: (totalCnt, obj) => {
        let section;

        if (screen.v.levelCode == 'ELEMENT') {
          section = $("#tab1-1 .myclass-data");
        } else if (screen.v.levelCode == 'MIDDLE') {
          section = $("#tab1-2 .myclass-data");
        } else {
          section = $("#tab1-3 .myclass-data");
        }

        section.empty();

        const map = new Map();
        const objKeys = Object.keys(obj);

        if (objKeys.length !== 1) {
          if (obj["mrnList"].length) map.set("mrnList", obj["mrnList"]);
          if (obj["otherList"].length) map.set("otherList", obj["otherList"]);
          if (obj["mteacherList"].length) map.set("mteacherList", obj["mteacherList"]);
          if (obj["linkList"].length) map.set("linkList", obj["linkList"]);

        } else map.set(objKeys[0], obj[objKeys[0]]);

        for (const k of map.keys()) {
          let html = "";
          if ((screen.v.levelCode === "MIDDLE"
                  || screen.v.levelCode === "HIGH")
              && k === "otherList") continue;

          if (k === "mrnList") {
            html += `
            <div class="list-wrap">
              <div class="list-title">
                <h4>미래엔 교과서</h4>
                <strong class="semi badge size-md mix-round primary-lighten">${obj["mrnList"].length}</strong>
              </div>
              <div class="list-items type-box">
          `;
          } else if (k === "mteacherList") {
            html += `
            <div class="list-wrap">
              <div class="list-title">
                <h4>엠티처 서비스</h4>
                <strong class="semi badge size-md mix-round primary-lighten">${obj["mteacherList"].length}</strong>
              </div>
              <div class="list-items type-box">
          `;
          } else if (k === "otherList") {
            html += `
            <div class="list-wrap">
              <div class="list-title">
                <h4>타사 교과서</h4>
                <strong class="semi badge size-md mix-round primary-lighten">${obj["otherList"].length}</strong>
              </div>
              <div class="list-items type-box">
          `;
          } else {
            html += `
            <div class="list-wrap">
              <div class="list-title">
                <h4>링크 즐겨찾기</h4>
                <strong class="semi badge size-md mix-round primary-lighten">${obj["linkList"].length}</strong>
              </div>
              <div class="list-items type-box">
          `;
          }

          if (k === "linkList") {
            for (const row of map.get(k)) {
              html += `
               <div class="item" onclick="location.href='${row.link}'">
                  <span class="badge size-md type-rounded fill-light">${row.rowNum}</span>
                  <div>
                    <p class="text-xs">${row.typeName}</p>
                    <ul class="divider-group type-brace text-black">
                      <li>${row.name}</li>
                    </ul>
                  </div>
                </div>
            `;
            }
          } else {
            for (const row of map.get(k)) {
              html += `
               <div class="item" onclick="location.href='${row.link}'">
                  <span class="badge size-md type-rounded fill-light">${row.rowNum}</span>
                  <div>
                    ${row.publisherName ? `<p class="text-xs">${row.publisherName}</p>` : ''}
                    <ul class="divider-group type-brace text-black">
                      <li>${row.revision}</li>
                      ${row.grade ? `<li>${row.grade}</li>` : ''}
                      <li>${row.term}</li>
                      ${k !== "mteacherList" ? `<li>${row.name}</li>` : ''}
                    </ul>
                  </div>
                </div>
            `;
            }
          }

          html += `
                </div>
            </div>
          `;

          section.append(html);

        }

      },

      // 스크랩 > 데이터 없음
      noScrapList: () => {
        let section;

        if (screen.v.scrapType == 'TEXTBOOK') {
          section = $("#tab2-1 .myclass-data");

          section.empty();

          section.append(`
            <div class="box-caution">
              <i class="icon size-md">
                <img src="/assets/images/elementary/icon-caution-line.svg" alt="caution line 아이콘">
              </i>
              <p>자료 삭제는 PC에서만 가능합니다.</p>
            </div>
            <div class="box-no-data">
              <p class="title">자료가 없습니다.</p>
            </div>
        ` );
        } else {
          section = $("#tab2-2 .myclass-data");

          section.empty();

          section.append(`
            <section class="myclass-section fluid-vertical type-border">
              <div class="box-caution">
                <i class="icon size-md">
                  <img src="/assets/images/elementary/icon-caution-line.svg" alt="caution line 아이콘">
                </i>
                <p>자료 삭제는 PC에서만 가능합니다.</p>
              </div>
            </section>
            <div class="box-no-data">
              <p class="title">자료가 없습니다.</p>
            </div>
        ` );
        }



      },

      // 스크랩 데이터 바인드 (교과서 자료)
      bindScrapTextbookList: (list) => {
        let section = $("#tab2-1 .myclass-data");

        section.empty();

        let html = `
          <div class="box-caution">
            <i class="icon size-md">
              <img src="/assets/images/elementary/icon-caution-line.svg" alt="caution line 아이콘">
            </i>
            <p>자료 삭제는 PC에서만 가능합니다.</p>
          </div>
        `;

        for (const row of list) {
          let previewDisabled = "";
          let shareDisabled = "";

          if (row.preview === "N")
            previewDisabled = "disabled";

          if (row.share === "N")
            shareDisabled = " disabled";

          if (row.level === "ELEMEMT") {
            html += `
              <div class="list-items type-box">
                <div class="item">
                  <div class="info-wrap">
                    <p class="text-xs text-black">${row.type}</p>
                    <strong class="semi ellipsis-single text-black">${row.title}</strong>
                    <ul class="divider-group type-brace text-xs">
                      ${row.levelName ? `<li>${row.levelName}</li>` : ''}
                      ${row.revision ? `<li>${row.revision}</li>` : ''}
                      ${row.grade ? `<li>${row.grade}</li>` : ''}
                      ${row.term ? `<li>${row.term}</li>` : ''}
                      ${row.subName ? `<li>${row.subName}</li>` : ''}
                      ${row.textbookName ? `<li>${row.textbookName}</li>` : ''}
                      ${row.unitName ? `<li>${row.unitName}</li>` : ''}
                    </ul>
                  </div>
            `;
          } else {
            html += `
              <div class="list-items type-box">
                <div class="item">
                  <div class="info-wrap">
                    <p class="text-xs text-black">${row.type}</p>
                    <strong class="semi ellipsis-single text-black">${row.title}</strong>
                    <ul class="divider-group type-brace text-xs">
                      ${row.levelName ? `<li>${row.levelName}</li>` : ''}
                      ${row.revision ? `<li>${row.revision}</li>` : ''}
                      ${row.subName ? `<li>${row.subName}</li>` : ''}
                      ${row.textbookName ? `<li>${row.textbookName}</li>` : ''}
                      ${row.unitName ? `<li>${row.unitName}</li>` : ''}
                    </ul>
                  </div>
            `;
          }

          html += `
              <div class="buttons extra">
                <button type="button" class="button size-sm type-icon" name="preview" data-id="${row.fileId}" ${previewDisabled}>
                  <svg>
                    <use href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                  </svg>
                </button>
                <button class="button size-sm type-icon" name="share" data-id="${row.fileId}" ${shareDisabled}>
                  <svg>
                    <use href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
        }

        html += '<div class="pagination"></div>';

        section.append(html);

      },

      // 스크랩 데이터 바인드 (게시글)
      bindScrapBoardList: (list) => {
        let section = $("#tab2-2 .myclass-data");

        section.empty();

        let html = `
          <section class="myclass-section fluid-vertical type-border">
            <div class="box-caution">
              <i class="icon size-md">
                <img src="/assets/images/elementary/icon-caution-line.svg" alt="caution line 아이콘">
              </i>
              <p>자료 삭제는 PC에서만 가능합니다.</p>
            </div>
          </section>
          <div class="board-items scrap-post">
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
             <div class="item" onclick="location.href='${href}'">
          `;

          if (row.thumbnail) {
            html += `
                <div class="item-inner">
                  <div class="image-wrap">
                    <img src="${row.thumbnail}" alt="">
                  </div>
                </div>
            `;
          }

          html += `
                  <div class="inner-wrap">
                  <div class="text-wrap">
                    <p class="title">${row.title}</p>
                    <ul class="divider-group type-brace">
                      ${row.level ? `<li>${row.level}</li>` : ''}
                      ${path[0] ? `<li>${path[0]}</li>` : ''}
                      ${path[1] ? `<li>${path[1]}</li>` : ''}
                      ${path[2] ? `<li>${path[2]}</li>` : ''}
                      ${row.categoryGroupName2 ? `<li>${row.categoryGroupName2.replace(/^0+/, '')}월</li>` : ''}
                    </ul>
                  </div>
                  <!--<div class="buttons fluid">
                    <button type="button" class="button size-sm" onclick="window.open('#')">
                      <svg>
                        <title>아이콘 돋보기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-search"></use>
                      </svg> 미리보기 </button>
                    <button type="button" class="button size-sm">
                      <svg>
                        <title>아이콘 공유하기</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-share"></use>
                      </svg> 공유하기 </button>
                  </div>
                </div>-->
              </div>
            </div>
          `;
        }

        html += '</div><div class="pagination"></div>';

        section.append(html);

      },

      // 스크랩 > 유형
      setScrapType: (e) => {
        screen.v.scrapType = $(e.currentTarget).data("id");

        screen.c.getScrapList();
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
        let section = $("#tab3 .myclass-data");

        section.empty();

        section.append(`
          <div class="box-caution">
            <i class="icon size-md">
              <img src="/assets/images/elementary/icon-caution-line.svg" alt="caution line 아이콘">
            </i>
            <p>자료 삭제와 내 링크 등록은 PC에서만 가능합니다.</p>
          </div>
          <div class="box-no-data">
            <p class="title">등록된 내 자료가 없습니다.</p>
          </div>
        `);
      },

      // 내자료 > 데이터 바인드
      bindMydataList: (list) => {
        let section = $("#tab3 .myclass-data");

        section.empty();

        let html = "";

        html += `
          <div class="box-caution">
            <i class="icon size-md">
              <img src="/assets/images/elementary/icon-caution-line.svg" alt="caution line 아이콘">
            </i>
            <p>자료 삭제와 내 링크 등록은 PC에서만 가능합니다.</p>
          </div>
          <div class="list-items type-box">
        `;

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

          html += `
            <div class="item" onclick="location.href='${row.url}'">
              <div class="info-wrap">
                <span class="badge fill-${fillClass} type-round-box text-xxxs">${fillText}</span>
                <p class="text-black margin-top-sm"><strong class="semi">${row.title}</strong></p>
        `;

          if (row.isMapping === "Y") {
            html += `<ul class="divider-group type-brace text-xs margin-top-sm">`;

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
              </div>
            </div>
        `;

        }

        html += `
          </div>
          <div class="pagination"></div>
        `;

        section.append(html);

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

    },

    event: () => {
      // 탭 클릭
      $(".tab-top li").on("click", screen.f.clickTab);

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      // 즐겨찾기 > 학급
      $(document).on("click", "a[name=class]", screen.f.setFavoriteLevel);

      // 즐겨찾기 > 선택
      $(document).on("change", "select[name=textbook]", screen.f.setFavoriteType);

      // 스크랩 > 유형
      $(document).on("click", "a[name=category]", screen.f.setScrapType);

      // 스크랩 > 미리보기
      $(document).on("click", "button[name=preview]", screen.f.previewFile);

      // 스크랩 > 공유하기
      $(document).on("click", "button[name=share]", screen.f.shareFile);

      // 내자료 > 옵션 선택
      $("select[id^=option-]").on("change", screen.f.changeOption);

      // 내자료 > 검색 클릭
      $("button[name=btnSearch]").on("click", screen.f.search);
      $(document).on("keyup", screen.f.enterSearch);
    },

    init: () => {
      screen.v.subjectLevelCode = $("#subjectLevelCode").val();
      screen.v.tabIdx = "1";

      screen.v.domain["ele"] = $("#hostELE").val();
      screen.v.domain["mid"] = $("#hostMID").val();
      screen.v.domain["high"] = $("#hostHIGH").val();

      screen.event();

      screen.f.init();
      screen.c.getFavoriteList();

      screen.f.setCombo();
      screen.f.setLevelDisabled();
    },
  };
  screen.init();
});