$(function () {
  let screen = {
    v: {
      isLogin: null,
      userRight: null,
      seq: {},
      fileList: [],
      fileId: null,
      tabIdx: null,
      tabAlt: null,
      type: '.koreanArea'
    },

    c: {
      // 데이터 리스트 불러오기
      getSpecialKoreanList: () => {
        const option = {
          method: "GET",
          url: "/pages/mid/board/contentsplus/getSpecialKoreanList.ax",
          data: screen.v.seq,
          success: (res) => {
            const listMap = res.rows[0];

            if ("subjectList" in listMap) { // 탭 클릭
              screen.f.bindSubjectList(listMap.subjectList);
              screen.f.bindUnitList(listMap.unitList);
            }

            if ("subjectSeq" in screen.v.seq) { // 주제 클릭
              screen.f.bindUnitList(listMap.unitList);
            }

            // 단원 클릭
            screen.f.bindSectionList(listMap.unitList, listMap.sectionList);
          }
        };

        $cmm.ajax(option);
      },
    },

    f: {
      // 배너 클릭
      clickBanner: (e) => {
        const isLogin = screen.f.checkLogin();
        const level = location.pathname.split("/")[2];
        let href;

        if (isLogin) {
          switch (level) {
            case "ele":
              if (screen.v.tabIdx === "1") href = "https://download.mirae-n.com/primary_withplay/listenspeak/[%EC%B4%88%EB%93%B1%ED%95%99%EA%B5%90]%20%EA%B5%AD%EC%96%B4(%EB%93%A3%EA%B8%B0%20%EB%A7%90%ED%95%98%EA%B8%B0%20%EC%98%81%EC%97%AD)%20%EA%B5%90%EC%88%98%20%ED%95%99%EC%8A%B5%20%EC%A7%80%EC%9B%90%20%EC%9E%90%EB%A3%8C%20%EC%95%88%EB%82%B4.pdf";
              if (screen.v.tabIdx === "2") href = "https://download.mirae-n.com/primary_withplay/writing/[%EC%B4%88%EB%93%B1%ED%95%99%EA%B5%90]%EA%B5%AD%EC%96%B4(%EC%93%B0%EA%B8%B0%EC%98%81%EC%97%AD)%EA%B5%90%EC%88%98%ED%95%99%EC%8A%B5%EC%A7%80%EC%9B%90%EC%9E%90%EB%A3%8C%EC%95%88%EB%82%B4.pdf";
              if (screen.v.tabIdx === "3") href = "https://download.mirae-n.com/primary_withplay/grammar/[%EC%B4%88%EB%93%B1%ED%95%99%EA%B5%90]%EA%B5%AD%EC%96%B4(%EB%AC%B8%EB%B2%95%EC%98%81%EC%97%AD)%EA%B5%90%EC%88%98%ED%95%99%EC%8A%B5%EC%A7%80%EC%9B%90%EC%9E%90%EB%A3%8C%EC%95%88%EB%82%B4.pdf";
              break;
            case "mid":
              href = "https://download.mirae-n.com/listenspeak/mid/[%EC%A4%91%EB%93%B1]%20%EA%B5%AD%EC%96%B4%20%EB%93%A3%EA%B8%B0%20%EB%A7%90%ED%95%98%EA%B8%B0%20%EC%98%81%EC%97%AD%20%EA%B5%90%EC%88%98%20%ED%95%99%EC%8A%B5%20%EC%A7%80%EC%9B%90%20%EC%9E%90%EB%A3%8C%20%EC%95%88%EB%82%B4.pdf";
              break;
            case "high":
              href = "https://download.mirae-n.com/listenspeak/high/[%EA%B3%A0%EB%93%B1]%20%EA%B5%AD%EC%96%B4%20%EB%93%A3%EA%B8%B0%20%EB%A7%90%ED%95%98%EA%B8%B0%20%EC%98%81%EC%97%AD%20%EA%B5%90%EC%88%98%20%ED%95%99%EC%8A%B5%20%EC%A7%80%EC%9B%90%20%EC%9E%90%EB%A3%8C%20%EC%95%88%EB%82%B4.pdf";
              break;
          }

          window.open(href);
        }
      },
      // 과목 클릭
      clickTextBook: (e) =>{
        screen.v.type =  "." + $(e.target).attr("id") + 'Area';
        $(".textbookBtns a").removeClass("active");
        $(e.target).addClass("active");
        $("#main-contents section.education-contents, .result.type-thick").hide();
        $(screen.v.type).show();

        if(screen.v.type == '.socialArea'){
          $(".koreanPop").hide();
          $(".socialPop").show();
        }else{
          $(".socialPop").hide();
          $(".koreanPop").show();
        }
      },

      // 탭 클릭
      clickTab: (e) => {
        e.preventDefault();

        $(screen.v.type + " .tab li[class=active]").removeClass("active");
        $(e.target).addClass("active");

        screen.v.seq = {};
        screen.v.seq["tabSeq"] = $(e.target).closest("a").attr("data-id");
        screen.v.tabIdx = $(e.target).closest("a").attr("href").replace("#tab1-", "");

        switch (screen.v.tabIdx) {
          case "1":
            screen.v.tabAlt = "듣기·말하기";
            break;
          case "2":
            screen.v.tabAlt = "쓰기";
            break;
          case "3":
            screen.v.tabAlt = "문법";
            break;
        }

        screen.c.getSpecialKoreanList();
      },

      // 주제 클릭
      clickSubject: (e) => {
        e.preventDefault();

        // $(screen.v.type + " button[data-id^=subject-][class=active]").removeClass("active"); // .button 클래스 추가로 선택안됨
        $(screen.v.type + " button[data-id^=subject-]").removeClass("active");
        $(e.target).addClass("active");

        screen.v.seq = {};
        screen.v.seq["subjectSeq"] = e.currentTarget.getAttribute("data-id").replace("subject-", "");

        screen.c.getSpecialKoreanList();
      },

      // 단원 클릭
      clickUnit: (e) => {
        closePopup({id: 'popup1'});

        const unitTextBtn = $(screen.v.type + " button[name=unitTextBtn]");
        unitTextBtn.empty();

        const selectedUnitText = `
            ${e.currentTarget.text}<svg>
            <title>아이콘 - icon-chevron-down</title>
            <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
            </svg>
          `;

        unitTextBtn.append(selectedUnitText);

        e.preventDefault();

        $(screen.v.type + " a[data-id^=unit-][class=active]").removeClass("active");
        $(e.target).addClass("active");

        screen.v.seq = {};
        screen.v.seq["unitSeq"] = e.currentTarget.getAttribute("data-id").replace("unit-", "");
        screen.v.seq["unitParentSeq"] = e.currentTarget.getAttribute("data-parent");

        screen.c.getSpecialKoreanList();
      },

      // 주제 리스트 바인드
      bindSubjectList: (list) => {
        const div = $(screen.v.type + " div[aria-label=subject]");
        const banners = $(screen.v.type + " .tab-info img");

        div.empty();

        banners.attr("src", `/assets/images/elementary/img-prd-banner14-0${screen.v.tabIdx}@x2.png`);
        banners.attr("alt", screen.v.tabAlt);

        for (const obj of list) {
          div.append(`
            <button type="button" data-id="subject-${obj.seq}">
                ${obj.name}
            </button>
          `);
        }

        $(screen.v.type + " div[aria-label=subject] button:first").addClass("active");

        const inner = $(screen.v.type + " .tab-info .inner-txt");

        inner.empty();

        if (screen.v.tabIdx == 1) {
          inner.append(`
            <h3>듣기 • 말하기</h3>
            <p>국어과 듣기 • 말하기 영역 성취기준을 바탕으로, 주제 중심으로 재구성한 활동지입니다. 생활속에서 접할 수 있는 실제적인 듣기 • 말하기 상황을 익히고 연습하는 보충 자료로 활용해 보세요.</p>
            <button class="button size-sm"> 자료안내 <svg>
              <title>아이콘 - icon-chevron-right</title>
              <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
            </svg>
            </button>
          `);
        } else if (screen.v.tabIdx == 2) {
          inner.append(`
            <h3>쓰기</h3>
            <p>국어과 쓰기 영역 성취기준을 바탕으로, 주제 중심으로 재구성한 활동지입니다. 생활 속에서 접할 수 있는 실제적인 상황을 익히고 연습하는 보충자료로 활용해 보세요.</p>
            <button class="button size-sm"> 자료안내 <svg>
                <title>아이콘 - icon-chevron-right</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
              </svg>
            </button>
          `);
        } else {
          inner.append(`
            <h3>문법</h3>
            <p>국어과 문법 영역 성취기준을 바탕으로 재구성한 활동지입니다. 생활 속에서 접할 수 있는 실제적인 상황을 익히고 연습하는 보충자료로 활용해 보세요.</p>
            <button class="button size-sm"> 자료안내 <svg>
                <title>아이콘 - icon-chevron-right</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
              </svg>
            </button>
          `);
        }

        $(".tab-info button").on("click", screen.f.clickBanner);
      },

      // 단원 리스트 바인드
      bindUnitList: (list) => {
        const div = $(screen.v.type+ " div[aria-label=unit]");
        div.empty();

        for (const obj of list) {
          div.append(`
            <a data-id="unit-${obj.seq}" 
               data-parent="${obj.parentSeq}">
              ${obj.name}
            </a>
          `);
        }

        $(screen.v.type+ " div[aria-label=unit] a:first").addClass("active");

        const unitTextBtn = $("button[name=unitTextBtn]");
        unitTextBtn.empty();

        const selectedUnitText = `
            ${list[0].name}<svg>
            <title>아이콘 - icon-chevron-down</title>
            <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
            </svg>
          `;

        unitTextBtn.append(selectedUnitText);
      },

      // 차시 테이블 바인드
      bindSectionList: (unitList, sectionList) => {
        const subjectName = $(screen.v.type+ " button[data-id^=subject-].active").text();
        const unitName = $(screen.v.type+ " a[data-id^=unit-].active").text();
        const sectionTitle = $("ul[aria-label=title]");
        const tbody = $(screen.v.type+ " tbody");

        let fullFile = unitList[0].fullFile;
        let actionFile = unitList[0].actionFile;
        let listenFile = unitList[0].listenFile;
        let teacherFile = unitList[0].teacherFile;

        if ("unitSeq" in screen.v.seq) {
          for (const obj of unitList) {
            if ((obj.seq).toString() === screen.v.seq.unitSeq) {
              fullFile = obj.fullFile;
              actionFile = obj.actionFile;
              listenFile = obj.listenFile;
              teacherFile = obj.teacherFile;
            }
          }
        }

        tbody.empty();
        sectionTitle.empty();

        $(screen.v.type+ " table caption").text(unitName);

        sectionTitle.append(`
          <li>
            <h3>${subjectName}</h3>
          </li>
          <li>
            <h3>${unitName}</h3>
          </li>
        `);

        for (const obj of sectionList) {
          tbody.append(`
            <tr>
              <td>${obj.name}</td>
              <td>${obj.studyPurpose}</td>
              <td rowspan="${sectionList.length}">
                <div class="buttons">
                  <button class="icon-button size-md" 
                          name="file-full"
                          data="${fullFile}"
                          ${fullFile === 'nothing' ? 'disabled' : ''}>
                    <img src="/assets/images/common/icon-pdf.svg" alt="pdf">
                  </button>
                  <button class="icon-button size-md" 
                          name="file-action"
                          data="${actionFile}"
                          ${actionFile === 'nothing' ? 'disabled' : ''}>
                    <img src="/assets/images/common/icon-hangul.svg" alt="한글">
                  </button>
                </div>
              </td>
              <td rowspan="${sectionList.length}">
                <div class="buttons">
                  <button class="icon-button size-md" 
                          name="file-listen" 
                          data="${screen.v.tabIdx === '3'? 'nothing' : listenFile}"
                          ${(listenFile === 'nothing' || screen.v.tabIdx === '3') ? 'disabled' : ''}>
                    <img src="/assets/images/common/icon-zip.svg" alt="zip">
                  </button>
                </div>
              </td>
              <td rowspan="${sectionList.length}">
                <div class="buttons">
                  <button class="icon-button size-md" 
                          name="file-teacher"
                          data="${teacherFile}"
                          ${teacherFile === 'nothing' ? 'disabled' : ''}>
                    <img src="/assets/images/common/icon-pdf.svg" alt="pdf">
                  </button>
                </div>
              </td>
            </tr>
        `);
        }

        screen.f.switchTotalDownBtn();
      },

      // file id 데이터 초기화
      resetFileId: () => {
        screen.v.fileList = [];
        screen.v.fileId = null;
      },

      // 전체 다운로드 버튼 switch
      switchTotalDownBtn: () => {
        const fullFile = $("button[name='file-full']").first().attr("data") === "nothing";
        const actionFile = $("button[name='file-action']").first().attr("data") === "nothing";
        const listenFile = $("button[name='file-listen']").first().attr("data") === "nothing";
        const teacherFile = $("button[name='file-teacher']").first().attr("data") === "nothing";

        if (fullFile && actionFile && listenFile && teacherFile)
          $(screen.v.type+ " button[name=totalDown]").prop("disabled", true);
        else
          $(screen.v.type+ " button[name=totalDown]").prop("disabled", false);
      },

      // multi file 다운로드
      downMultiFile: () => {
        let fileIdx = "";

        const fileId = {
          fullFile: $("button[name='file-full']").first().attr("data"),
          actionFile: $("button[name='file-action']").first().attr("data"),
          listenFile: $("button[name='file-listen']").first().attr("data"),
          teacherFile: $("button[name='file-teacher']").first().attr("data")
        };

        for (const key in fileId) {
          if (fileId[key] !== "nothing") screen.v.fileList.push(fileId[key]);
        }

        screen.v.fileList.map((item, idx) => {
          fileIdx += item;
          if (screen.v.fileList.length !== idx + 1) fileIdx += ",";
        });

        let zipFileName = '미래엔_';
        if((location.href).indexOf('/ele/') > -1) {
          zipFileName += '초등특수_';
        }else if((location.href).indexOf('/mid/') > -1){
          zipFileName += '중학특수_';
        }else{
          zipFileName += '고등특수_';
        }
        let uniEle = $(".type-thick:visible button[name=unitTextBtn]").clone();
        uniEle.find("svg").remove();
        let unitText = (uniEle.html()).replace(/\n\ */gi,'');
        let unitNum = unitText.substring(0,1);
        let subjectText = $('.type-thick:visible .table-wrap .inner-header .divider-group h3').html();
        if((location.href).indexOf('/ele/') > -1 && $('.education-contents:visible').hasClass('koreanArea')){
          let tabName = $('.tab .active a').html();
          if(tabName == '듣기·말하기'){
            tabName = '듣말'
          }
          zipFileName += unitNum + '단원_' + tabName + '활동지_' + subjectText +'_전체.zip';
        }else{
          zipFileName += unitNum + '단원_' + subjectText +'_전체.zip';
        }

        return `/pages/api/file/down/multi/set/${fileIdx}?fileName=${zipFileName}`;
      },

      // single file 다운로드
      downSingleFile: (target) => {
        screen.v.fileId = $(target).closest("button").attr("data");

        return `/pages/api/file/down/${screen.v.fileId}`;
      },

      downloadFile: (e) => {
        const isLogin = screen.f.checkLogin();
        const isRight = isLogin? screen.f.checkRight() : false;
        const name = e.currentTarget.name;
        let href;

        if (isLogin && isRight) {
          if (name === "totalDown") href = screen.f.downMultiFile()
          else href = screen.f.downSingleFile(e.target);

          $alert.open("MG00010", () => {
            let link = document.createElement("a");

            link.target = "_blank";
            link.href = href;
            link.click();
            link.remove();

            screen.f.resetFileId();
          });
        }
      },

      // 로그인 확인
      checkLogin: () => {
        if (!screen.v.isLogin) {
          screen.f.login();
          screen.f.resetFileId();

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

      // 로그인 알림창
      login: () => {
        $alert.open("MG00001");
      },

      // 로그아웃 알림창
      logout: () => {
        $alert.open("MG00002", () => {
          location.href = "/User/Logout.ax";
        });
      },
    },

    event: function () {
      let type = $(".textbookBtns a.active").attr("id") || 'korean'
      screen.v.type =  '.' + type + 'Area';
      if(screen.v.type == '.socialArea'){
        $(".koreanPop").hide();
      }else{
        $(".socialPop").hide();
      }
      // 과목 클릭
      $(".textbookBtns a").on("click", screen.f.clickTextBook);

      // 탭 클릭
      $(".tab li").on("click", screen.f.clickTab);

      // 배너 클릭
      $(".tab-info button").on("click", screen.f.clickBanner);

      // 주제 클릭
      $(document).on("click", "button[data-id^=subject-]", screen.f.clickSubject);

      // 단원 클릭
      $(document).on("click", "a[data-id^=unit-]", screen.f.clickUnit);

      // 전체 다운로드
      $("button[name=totalDown]").on("click", screen.f.downloadFile);

      // 개별 다운로드
      $(document).on("click", "button[name^=file-]", screen.f.downloadFile);

      // 로그인 알림창
      $("button[name=login]").on("click", () => location.href = "/pages/common/User/Login.mrn");

      // 로그아웃 알림창
      $("button[name=logout]").on("click", screen.f.logout);
    },

    init: function () {
      screen.v.isLogin = $("#isLogin").val() === "true";
      screen.v.userRight = $("#userRight").val();
      screen.v.tabIdx = "1";

      screen.event();
      screen.f.switchTotalDownBtn();
    },
  };
  screen.init();
});