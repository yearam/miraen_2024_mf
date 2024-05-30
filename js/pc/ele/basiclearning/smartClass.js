$(function () {
  let screen = {
    v: {
      data03: [],
      data04: [],
      data05: [],
      data06: [],
      copy: "toast-copy",
    },

    c: {

    },

    f: {

      setOption: () => {

        /*screen.c.getrequestList();*/
        var selectedGrade = document.querySelector('input[name="ox-filter1"]:checked').value;
        var selectedSemester = document.querySelector('input[name="ox-filter2"]:checked').value;
        var selectedSubject = document.querySelector('input[name="ox-filter3"]:checked').value;
        var selectedunit = document.querySelector('input[name="checkbox1"]:checked').value;

        /*console.log('선택된 학년:', selectedGrade);
        console.log('선택된 학기:', selectedSemester);
        console.log('선택된 과목:', selectedSubject);*/
        /*console.log('선택된 단원:', selectedunit);*/
        var unitid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject
        /*var valueid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject+"-"+selectedunit*/
        /*var jsonlink ='/js/pc/ele/basiclearning/'+selectedGrade+'.json'
        console.log("링크",jsonlink);*/
        screen.f.getTitleBySection(unitid,selectedGrade);
        /*console.log("id예상값",valueid);*/

        var radioGroup = document.querySelector('.buttons.type-rounded.type-primary');

        // 이전에 그려진 라디오 버튼 제거
        radioGroup.innerHTML = '';

        // 선택된 과목에 해당하는 단원 목록 가져오기
        var unitList = screen.f.getTitleBySection(unitid,selectedGrade);
        console.log(unitList)
        // 각 단원에 대한 라디오 버튼 생성 및 추가
        unitList.forEach((unit, index) => {
          var radioButton = document.createElement('input');
          radioButton.type = 'radio';
          radioButton.name = 'checkbox1';
          radioButton.id = 'filter7-' + (index + 1);
          const num = index + 1;
          const paddedNum = num.toString().padStart(2, '0');
          radioButton.value = paddedNum;
          console.log(radioButton.value);
          if (index === 0) {
            radioButton.checked = true; // 첫 번째 단원을 기본으로 선택
          }

          var label = document.createElement('label');
          label.htmlFor = 'filter7-' + (index + 1);
          label.textContent = unit;

          var span = document.createElement('span');
          span.appendChild(radioButton);
          span.appendChild(label);

          radioGroup.appendChild(span);
          screen.f.setList();
        });
        $("input[type=radio][name=checkbox1]").on("click", function() {
          // 클릭 이벤트 발생 시 실행할 코드 작성
          screen.f.setList();
        });
        $("input[type=radio][name=ox-filter1]").on("click", function() {
          // 클릭 이벤트 발생 시 실행할 코드 작성
          screen.f.setList();
        });
        $("input[type=radio][name=ox-filter2]").on("click", function() {
          // 클릭 이벤트 발생 시 실행할 코드 작성
          screen.f.setList();
        });
        $("input[type=radio][name=ox-filter3]").on("click", function() {
          // 클릭 이벤트 발생 시 실행할 코드 작성
          screen.f.setList();
        });

      },

      checkLogin: () => {
        console.log('$isLogin:: ', $isLogin);
        if (!$isLogin) {
          $alert.open("MG00001");
          return false;
        }
        return true;
      },

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

      setMyFavorite: () => {
        if(!$isLogin) {
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
      },

      addFavorite: () => {
        let dataObj = {};

        const currentLocationName = screen.f.getCurrentLocationByName();
        const currentUrl = window.location.origin + window.location.pathname;
        const referenceSeq = '2025'

        dataObj = {
          favoriteType: 'MTEACHER',
          referenceSeq: referenceSeq,
          favoriteName: currentLocationName, // 게시판명
          favoriteUrl: currentUrl, // 게시판 url
          useYn: 'Y',
        }

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

      updateFavorite: () => {
        let dataObj = {};
        // 즐겨찾기 해제 type을 delete로 사용
        const referenceSeq = '2025'

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

      // 테이블 바인딩
      setList: () => {

        /*screen.c.getrequestList();*/
        var selectedGrade = document.querySelector('input[name="ox-filter1"]:checked').value;
        var selectedSemester = document.querySelector('input[name="ox-filter2"]:checked').value;
        var selectedSubject = document.querySelector('input[name="ox-filter3"]:checked').value;
        var selectedunit = document.querySelector('input[name="checkbox1"]:checked').value;

        // console.log('선택된 학년:', selectedGrade);
        // console.log('선택된 학기:', selectedSemester);
        // console.log('선택된 과목:', selectedSubject);
        // console.log('선택된 단원:', selectedunit);
        var unitid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject
        var valueid = selectedGrade+"-"+selectedSemester+"-"+selectedSubject+"-"+selectedunit
        screen.f.getTitleBySection(unitid,selectedGrade);
        // console.log("id예상값",valueid);
        // console.log("단원",selectedunit);
        if (selectedGrade == null){
          selectedGrade = '03';
        }
        if (selectedSemester == null){
          selectedSemester = '01';
        }
        if (selectedSemester == null){
          selectedSubject = 'KOA';
        }
        if (selectedunit == null){
          selectedunit = '01';
        }
        console.log("id예상값",valueid)
        var datenum = "data"+selectedGrade;
        console.log(selectedGrade)
        var tableData = screen.v[datenum];
        console.log("로그으",tableData)
        var tableBody = document.querySelector('.table-wrap');


        // 이전에 그려진 라디오 버튼 제거
        tableBody.innerHTML = '';

        var targetItem = screen.v[datenum].find(function(item) {
          return item.id === valueid;
        });
            console.log(targetItem);

        if(targetItem.id.includes("SO")){

          /*targetItem.tableList.forEach(function(hederData) {
            var innerHeader = document.createElement('div');
            innerHeader.classList.add('inner-header');
            var title = document.createElement('h3');
            title.textContent = hederData.subTitle;
            innerHeader.appendChild(title);
            tableBody.appendChild(innerHeader);
          });*/
          var innerHeader = document.createElement('div');
          innerHeader.classList.add('inner-header');
          var title = document.createElement('h3');
          title.textContent = targetItem.title;
          innerHeader.appendChild(title);
          tableBody.appendChild(innerHeader);
          // 테이블 생성
          targetItem.tableList.forEach(function(tableData) {
            var innerHeader = document.createElement('div');
            innerHeader.classList.add('inner-header');
            var title = document.createElement('h4');
            title.textContent = tableData.subTitle;
            innerHeader.appendChild(title);
            tableBody.appendChild(innerHeader);
            var tableItems = document.createElement('div');
            tableItems.classList.add('table-items');
            var table = document.createElement('table');
            var caption = document.createElement('caption');
            caption.textContent = tableData.subTitle;
            table.appendChild(caption);
            var colgroup = document.createElement('colgroup');
            var col1 = document.createElement('col');
            var col2 = document.createElement('col');
            table.appendChild(colgroup);
            colgroup.appendChild(col1);
            colgroup.appendChild(col2);
            col1.width="*";
            col2.width="140px";
            col2.span="3";
            // 테이블 헤더 생성
            var thead = document.createElement('thead');
            var theadRow = document.createElement('tr');
            tableData.thead.forEach(function(heading) {
              var th = document.createElement('th');
              th.textContent = heading;
              th.scope = "col";
              theadRow.appendChild(th);
            });
            thead.appendChild(theadRow);
            table.appendChild(thead);

            // 테이블 바디 생성
            var tbody = document.createElement('tbody');
            tableData.tbody.forEach(function(rowData,index2) {
              console.log("사회",tableData.tbody.length);
              var last = tableData.tbody.length;
              var tr = document.createElement('tr');
              rowData = ['['+rowData[0]+'] '+rowData[1], rowData[2], rowData[3], rowData[4]];
              rowData.forEach(function(cellData, index) {
                var cell = document.createElement(index === 0 ? 'th' : 'td');
                var thno = document.createElement('th');
                if (index === 0) {
                  cell.textContent = rowData[0]// [9~10차시] 등에서 링크 추출
                  cell.scope = "row"
                  /*cell.appendChild(thno);*/
                  /*cell.appendChild(thno);*/
                } else if (index === 2) {
                  var a = document.createElement('a');
                  $(a).data('url', rowData[rowData.length - 1]);
                  a.classList.add('icon-button-link');
                  // a.target = "_blank"
                  // var svg1 = document.createElement('svg');
                  // var use1 = document.createElement('use');
                  // use1.setAttribute('href', '/assets/images/svg-sprite-solid.svg#icon-search');
                  // svg1.appendChild(use1);
                  // a.appendChild(svg1);
                  cell.appendChild(a);
                } else if (index === 3){
                  var a1 = document.createElement('a');
                  var inpu = document.createElement('input');
                  inpu.value = rowData[rowData.length - 1];
                  inpu.type="hidden"
                  inpu.id ="ebookPathInput-"+(index2+1);
                  a1.classList.add('icon-button-copy');
                  a1.setAttribute('data-toast', 'toast-copy-'+(index2 + 1));
                  a1.setAttribute('data-copyval', rowData[rowData.length - 1]);
                  a1.id = "ebookLinkCopyBtn-"+(index2+1);
                  a1.setAttribute('data-clipboard-target', '#ebookPathInput-' + (index2 + 1));
                  // var svg2 = document.createElement('svg');
                  // var use2 = document.createElement('use');
                  // use2.setAttribute('href', '/assets/images/svg-sprite-solid.svg#icon-link');
                  // svg2.appendChild(use2);
                  // a1.appendChild(svg2);
                  cell.appendChild(inpu);
                  cell.appendChild(a1);
                } else {
                  cell.textContent = rowData[index];
                }
                tr.appendChild(cell);
              });
              tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // 테이블 추가
            tableItems.appendChild(table);
            tableBody.appendChild(tableItems);
          });


        }else{
          var innerHeader = document.createElement('div');
          innerHeader.classList.add('inner-header');
          var title = document.createElement('h3');
          title.textContent = targetItem.title;
          innerHeader.appendChild(title);
          tableBody.appendChild(innerHeader);

          // 테이블 생성
          targetItem.tableList.forEach(function(tableData) {
            var tableItems = document.createElement('div');
            tableItems.classList.add('table-items');
            var table = document.createElement('table');
            var caption = document.createElement('caption');
            caption.textContent = targetItem.title;
            table.appendChild(caption);
            var colgroup = document.createElement('colgroup');
            var col1 = document.createElement('col');
            var col2 = document.createElement('col');
            table.appendChild(colgroup);
            colgroup.appendChild(col1);
            colgroup.appendChild(col2);
            col1.width="*";
            col2.width="140px";
            col2.span="4";
            // 테이블 헤더 생성
            var thead = document.createElement('thead');
            var theadRow = document.createElement('tr');
            tableData.thead.forEach(function(heading) {
              var th = document.createElement('th');
              th.textContent = heading;
              th.scope = "col";
              theadRow.appendChild(th);
            });
            thead.appendChild(theadRow);
            table.appendChild(thead);

            // 테이블 바디 생성
            var tbody = document.createElement('tbody');
            // console.log(tableData);
            tableData.tbody.forEach(function(rowData,index2) {
              var last = tableData.tbody.length;
              var tr = document.createElement('tr');
              rowData = ['['+rowData[0]+'] '+rowData[1], rowData[2], rowData[3], rowData[4], rowData[5]];
              rowData.forEach(function(cellData, index) {
                var cell = document.createElement(index === 0 ? 'th' : 'td');
                var thno = document.createElement('th');
                if (index === 0) {
                  cell.textContent = rowData[0]// [9~10차시] 등에서 링크 추출
                  cell.scope = "row"
                  /*cell.appendChild(thno);*/
                } else if (index === 3) {
                  var a = document.createElement('a');
                  $(a).data('url', rowData[rowData.length - 1]);
                  // a.text = "바로보기";
                  a.classList.add('icon-button-link');
                  // a.target = "_blank";
                  // var svg1 = document.createElement('svg');
                  // var use1 = document.createElement('use');
                  // use1.setAttribute('href', '/assets/images/svg-sprite-solid.svg#icon-search');
                  // svg1.appendChild(use1);
                  // a.appendChild(svg1);
                  cell.appendChild(a);
                } else if (index === 4){
                  console.log("들어왔다")
                  var a1 = document.createElement('a');
                  var inpu = document.createElement('input');
                  inpu.value = rowData[rowData.length - 1];
                  inpu.type="hidden"
                  inpu.id ="ebookPathInput-"+(index2+1);
                  a1.classList.add('icon-button-copy');
                  a1.setAttribute('data-clipboard-target', '#ebookPathInput-' + (index2 + 1));
                  a1.setAttribute('data-toast', 'toast-copy-'+(index2 + 1));
                  a1.id = "ebookLinkCopyBtn-"+(index2+1);
                  a1.setAttribute('data-copyval', rowData[rowData.length - 1]);
                  // var svg2 = document.createElement('svg');
                  // var use2 = document.createElement('use');
                  // use2.setAttribute('href', '/assets/images/svg-sprite-solid.svg#icon-link');
                  // svg2.appendChild(use2);
                  // a1.appendChild(svg2);
                  cell.appendChild(inpu);
                  cell.appendChild(a1);
                } else {
                  cell.textContent = rowData[index];
                }
                tr.appendChild(cell);
              });
              tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // 테이블 추가
            tableItems.appendChild(table);
            tableBody.appendChild(tableItems);
          });
        }

        // 테이블 제목

        $(document).off('click', '.icon-button-link');
        $(document).on('click', '.icon-button-link', function(e){
              var isLogin = screen.f.checkLogin();

              // checkLogin()의 반환값에 따라 동작을 결정합니다.
              if (isLogin) {
                let url = $(event.target).data('url');
                window.open(url, "_blank");
              }
              return;
        });

        var iconButtonscopy = document.querySelectorAll('.icon-button-copy');

        iconButtonscopy.forEach(function(button) {
          button.addEventListener('click', function(event) {
            // checkLogin() 함수를 호출하여 로그인 상태를 확인합니다.
            var isLogin = screen.f.checkLogin();

            // checkLogin()의 반환값에 따라 동작을 결정합니다.
            if (!isLogin) {
              // 반환값이 false이면 링크 이동을 취소합니다.
              event.preventDefault();
              return;
            }

            // 로그인 상태가 확인되었으므로, 링크 이동을 계속합니다.
          });
        });

        $(document).off('click', '[id^="ebookLinkCopyBtn-"]').on('click', '[id^="ebookLinkCopyBtn-"]', function (event) {

          var isLogin = screen.f.checkLogin();
          if (!isLogin) {
            event.preventDefault();
            return;
          }else {
            // 반환값이 false이면 링크 이동을 취소합니다.

            let targetId = this.id;
            let toastIndex = targetId.split('-')[1];
            let combinedString = 'toast-copy-' + toastIndex;
            console.log(combinedString)

            let copyval = $(this).attr('data-copyval');

            window.navigator.clipboard.writeText(copyval);
            $toast.open(combinedString, "MG00040");
          }
        });
      },



      getTitleBySection(sectionId,no) {
        // console.log("학년",no);
        // console.log("id체크",sectionId);
        var titleunit = [];
        var datenum = "data"+no;
        // console.log(datenum);
        // console.log(screen.v[datenum].length);
        for (var i = 0; i < screen.v[datenum].length; i++) {
          if (screen.v[datenum][i].id.startsWith(sectionId)) {
            titleunit.push(screen.v[datenum][i].title);
          }
        }
        // console.log(titleunit);
        return titleunit;
      },


      // 파일 미리보기
      previewFile: (e) => {
        const fileId = $(e.currentTarget).data('id');
        let fileType = $(e.currentTarget).data('type');
        if (fileType === 'CMS' && $(e.currentTarget).data('cmstype') === 'video') {
          fileType = 'HLS';
        }
        let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${screen.v.unitFileId}${fileId}`;
        mteacherViewer.get_file_info(fileId).then(res => {

          screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      },

      copyToClipboard(text) {
        const input = document.createElement('textarea');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      },

      copyLink: (e) => {
        $toast.open(screen.v.copy, "MG00040");
      },


    },

    event: function () {

      screen.v.data03 = data03;
      screen.v.data04 = data04;
      screen.v.data05 = data05;
      screen.v.data06 = data06;

      // console.log("3학년",screen.v.data03)
      // console.log("4학년",screen.v.data04)
      // console.log("5학년",screen.v.data05)
      // console.log("6학년",screen.v.data06)
      // 파일 미리보기
      // $(document).on("click", "button[name=previewBtn]", screen.f.previewFile);
      $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);

      // 바로보기
      $(document).off('click', '.icon-button-link');
      $(document).on('click', '.icon-button-link', function(e){
            var isLogin = screen.f.checkLogin();

            if (isLogin) {
              let url = $(event.target).data('url');
              window.open(url, "_blank");
            }
      });


      document.addEventListener('DOMContentLoaded', function() {
        fetch('your_json_file.json')
            .then(response => response.json())
            .then(data => {
              // 데이터를 이용하여 원하는 작업을 수행합니다.
              console.log(data); // 예시: JSON 데이터를 콘솔에 출력합니다.
            })
            .catch(error => {
              console.error('Error fetching JSON:', error);
            });
      });
      $(document).on("click", "#ebookLinkCopyBtn", screen.f.checkLogin);

      $("input[type=radio][name=ox-filter1]").on("click", screen.f.setOption);
      $("input[type=radio][name=ox-filter2]").on("click", screen.f.setOption);
      $("input[type=radio][name=ox-filter3]").on("click", screen.f.setOption);
      $("input[type=radio][name=checkbox1]").on("click", screen.f.setList);

      var iconButtons = document.querySelectorAll('.icon-button');

      iconButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
          // checkLogin() 함수를 호출하여 로그인 상태를 확인합니다.
          var isLogin = screen.f.checkLogin();

          // checkLogin()의 반환값에 따라 동작을 결정합니다.
          if (!isLogin) {
            // 반환값이 false이면 링크 이동을 취소합니다.
            event.preventDefault();
            return;
          }

          // 로그인 상태가 확인되었으므로, 링크 이동을 계속합니다.
        });
      });

      $(document).off('click', '[id^="ebookLinkCopyBtn-"]').on('click', '[id^="ebookLinkCopyBtn-"]', function (event) {

            event.preventDefault();
            var isLogin = screen.f.checkLogin();
            if (!isLogin) {
              event.preventDefault();
              return;
            }else {
              // 반환값이 false이면 링크 이동을 취소합니다.

              let targetId = this.id;
              let toastIndex = targetId.split('-')[1];
              let combinedString = 'toast-copy-' + toastIndex;

              let copyval = $(this).attr('data-copyval');

              window.navigator.clipboard.writeText(copyval);
              $toast.open(combinedString, "MG00040");
            }
      });
    },

    init: function () {
      // console.log('스마트 수업 - init!');
      screen.event();
    },
  };
  screen.init();
});