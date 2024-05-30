let setFavoritePopup

$(function(){
  setFavoritePopup = {
    v :{
      subjectLevelCode : '',
      urlLevel : '',
      callback        : null,
      tabCode         : 'mrnList',
      gradeCode       : null, // 학년급
      termCode        : null, // 학기
      subjectCode     : null, // 과목
      locationName    : null, // 엠티처 서비스 1Depth
      myFavListLength : $('#bookmarkMrnList fieldset:not([disabled])').length + $('#bookmarkOtherList fieldset:not([disabled])').length + $('#bookmarkMteacherList fieldset:not([disabled])').length + $('#bookmarkLinkList fieldset:not([disabled])').length,
      initSaveList    : {
        bookmarkMrnList     : [],
        bookmarkOtherList   : [],
        bookmarkMteacherList: [],
        bookmarkLinkList    : []
      },
      initFavoriteList    : {
        bookmarkMrnList     : [],
        bookmarkOtherList   : [],
        bookmarkMteacherList: [],
        bookmarkLinkList    : []
      },
      saveList        : {
        bookmarkMrnList     : [],
        bookmarkOtherList   : [],
        bookmarkMteacherList: [],
        bookmarkLinkList    : []
      },
      codeList        : {
        subject             : [],
        grade               : [],
        term                : [],
        mteacherService     : []
      },
      delList         : [],
      bookmarkList    : ['bookmarkMrnList', 'bookmarkOtherList', 'bookmarkMteacherList', 'bookmarkLinkList'],
    },
    c:{

      getFavoriteList: function () {
        const option = {
          method: "POST",
          url: "/pages/common/mypage/getFavorite.ax",
          data: {
            subjectLevelCode: setFavoritePopup.v.subjectLevelCode,
            urlLevel: setFavoritePopup.v.urlLevel,
          },
          success: (res) => {
            // 공통 코드 값 세팅
            setFavoritePopup.v.codeList.subject = res.T04;
            setFavoritePopup.v.codeList.grade = res.T05;
            setFavoritePopup.v.codeList.term = res.T06;
            setFavoritePopup.v.codeList.mteacherService = res.mteacherServiceSelect;

            setFavoritePopup.v.gradeCode = res.gradeCode;

            if (res.mrnList != null) {
              res.mrnList.forEach((row, idx) => {
                const favSeq = row.favSeq;
                const seq = row.seq;
                const myItem = {favSeq, seq};
                setFavoritePopup.v.initFavoriteList.bookmarkMrnList.push(myItem);

                setFavoritePopup.v.initSaveList.bookmarkMrnList.push(row.seq);

                const value = row.seq;
                const dataSeq = null;
                const dataUrl = row.link || null;
                const dataName = row.name || null;
                const item = {value, dataSeq, dataUrl, dataName};
                setFavoritePopup.v.saveList.bookmarkMrnList.push(item);
              });
            }

            if (res.otherList != null) {
              res.otherList.forEach((row, idx) => {
                const favSeq = row.favSeq;
                const seq = row.seq;
                const myItem = {favSeq, seq};
                setFavoritePopup.v.initFavoriteList.bookmarkOtherList.push(myItem);

                setFavoritePopup.v.initSaveList.bookmarkOtherList.push(row.seq);

                const value = row.seq;
                const dataSeq = null;
                const dataUrl = row.link || null;
                const dataName = row.name || null;
                const item = {value, dataSeq, dataUrl, dataName};
                setFavoritePopup.v.saveList.bookmarkOtherList.push(item);
              });
            }

            if (res.mteacherList != null) {
              res.mteacherList.forEach((row, idx) => {
                const favSeq = row.favSeq;
                const seq = row.seq;
                const myItem = {favSeq, seq};
                setFavoritePopup.v.initFavoriteList.bookmarkMteacherList.push(myItem);

                setFavoritePopup.v.initSaveList.bookmarkMteacherList.push(row.seq);

                const value = row.seq;
                const dataSeq = null;
                const dataUrl = row.link || null;
                const dataName = row.name || null;
                const item = {value, dataSeq, dataUrl, dataName};
                setFavoritePopup.v.saveList.bookmarkMteacherList.push(item);
              });
            }

            if (res.linkList != null) {
              res.linkList.forEach((row, idx) => {
                const favSeq = row.favSeq;
                const seq = row.seq;
                const myItem = {favSeq, seq};
                setFavoritePopup.v.initFavoriteList.bookmarkLinkList.push(myItem);

                setFavoritePopup.v.initSaveList.bookmarkLinkList.push(row.seq);

                const value = row.seq;
                const dataSeq = null;
                const dataUrl = row.link || null;
                const dataName = row.name || null;
                const item = {value, dataSeq, dataUrl, dataName};
                setFavoritePopup.v.saveList.bookmarkLinkList.push(item);
              });
            }

            setFavoritePopup.f.bindFilter();

            setFavoritePopup.f.setData(res.textbookList);
          },
        };

        $cmm.ajax(option);
      },

      getData: function () {

        if (setFavoritePopup.v.tabCode == 'mrnList') {
          $.ajax({
            method: "GET",
            url   : "/pages" + setFavoritePopup.v.urlLevel + "textbook/textbookList.ax",
            data  : {
              subjectLevelCode: setFavoritePopup.v.subjectLevelCode,
              gradeCode       : setFavoritePopup.v.gradeCode,
              termCode        : setFavoritePopup.v.termCode,
              subjectCode     : setFavoritePopup.v.subjectCode
            },
            success: (res) => {
              setFavoritePopup.f.bindFilter();
              
              setFavoritePopup.f.setData(res);
            },
          });
        }

        if (setFavoritePopup.v.tabCode == 'otherList') {
          $.ajax({
            method: "GET",
            url   : "/pages/common/mypage/getOtherTextbookList.ax",
            data: {
              subjectLevelCode: setFavoritePopup.v.subjectLevelCode,
              gradeCode: setFavoritePopup.v.gradeCode,
              termCode: setFavoritePopup.v.termCode,
              subjectCode: setFavoritePopup.v.subjectCode
            },
            success: (res) => {
              setFavoritePopup.f.bindFilter();

              setFavoritePopup.f.setData(res);
            },
          });
        }

        if (setFavoritePopup.v.tabCode == 'mteacherList') {
          $.ajax({
            method: "GET",
            url   : "/pages/common/mypage/getFavoriteServiceList.ax",
            data  : {
              subjectLevelCode: setFavoritePopup.v.subjectLevelCode,
              locationName    : setFavoritePopup.v.locationName
            },
            success: (res) => {
              setFavoritePopup.f.bindFilter();

              setFavoritePopup.f.setData(res);
            },
          });
        }

        if (setFavoritePopup.v.tabCode == 'linkList') {
          $.ajax({
            method: "POST",
            url: "/pages/api/mypage/searchMyclassFavList.ax",
            data: {
              typeCode: 'LINK',
            },
            success: (res) => {
              setFavoritePopup.f.bindFilter();

              setFavoritePopup.f.setData(res.row.linkList);
            },
          });
        }

      },

      saveBookmark: () => {
        const lists = setFavoritePopup.v.bookmarkList;
        lists.forEach(listType => {
          setFavoritePopup.v.saveList[listType].filter((v1, k2) => {
            setFavoritePopup.v.initFavoriteList[listType].filter((v2, k2) => {
              if (v1.value == v2.seq) {
                v1.dataSeq = v2.favSeq;
              }
            });
          });
        });

        $alert.open("MG00017", () => {
          $.ajax({
            method: "POST",
            url   : "/pages/api/mypage/saveFavorite.ax",
            data  : {
              saveList: JSON.stringify(setFavoritePopup.v.saveList),
              delListMap : JSON.stringify(setFavoritePopup.v.delList),
              subjectLevelCode: setFavoritePopup.v.subjectLevelCode
            },
            success: () => {
              //if (!_.isNil(setFavoritePopup.v.callback) && typeof setFavoritePopup.v.callback === 'function') {
              //  setFavoritePopup.v.callback();
              //}

              //setFavoritePopup.c.getMyFavData();
              //setFavoritePopup.c.getContentsList("mrnList");
              //setFavoritePopup.c.getContentsList("otherList");
              //setFavoritePopup.c.getContentsList("mteacherList");

              closePopup({id: 'set-favorites'});

              location.reload();
            },

          });
        });
      },

    },

    f:{
      bindFilter: () => {
        // 초등만 타사 교과서,학기 탭 노출
        if (setFavoritePopup.v.subjectLevelCode != 'ELEMENT') {
          $('#otherList').addClass('display-hide');
        }

        $('#term-tab').empty();
        $('#grade-tab').empty();

        // 미래엔 교과서, 타사 교과서
        if (setFavoritePopup.v.tabCode == 'mrnList' || setFavoritePopup.v.tabCode == 'otherList') {
          if (setFavoritePopup.v.subjectLevelCode == 'ELEMENT') {
            setFavoritePopup.v.codeList.grade.forEach((row, idx) => {
              $('#grade-tab').append(`
                  <li class="${row.commonCode == setFavoritePopup.v.gradeCode ? 'active' : ''}" name="${row.commonCode}"><a href="javascript:void(0)">${row.codeName}</a></li>
              `);
            });

            $('#grade-tab li').off("click").on("click", setFavoritePopup.f.selectGradeOption);

            // 학기 select box
            let mrnTermSelect = `<select id="mrnTermCode" class="size-xl" title="학기 전체">`;
            mrnTermSelect += '<option value="">학기 전체</option>';

            setFavoritePopup.v.codeList.term.forEach((row, idx) => {
              mrnTermSelect += `<option value="${row.commonCode}" ${row.commonCode == setFavoritePopup.v.termCode ? "selected" : ""}>${row.codeName}</option>`;
            });

            mrnTermSelect += '</select>';

            $('#term-tab').append(mrnTermSelect);
          }

          // 과목 select box
          let mrnSubjectSelect = `<select id="mrnSubjectCode" class="size-xl" title="과목 전체">`;
          mrnSubjectSelect += ' <option value="">과목 전체</option>';

          setFavoritePopup.v.codeList.subject.forEach((row, idx) => {
            mrnSubjectSelect += `<option value="${row.commonCode}" ${row.commonCode == setFavoritePopup.v.subjectCode ? "selected" : ""}>${row.codeName}</option>`;
          });

          mrnSubjectSelect +=  '</select>';

          $('#term-tab').append(mrnSubjectSelect);
        }

        // 엠티처 서비스
        if (setFavoritePopup.v.tabCode == 'mteacherList') {
          // 엠티처 서비스 select box
          let mrnServiceSelect = `<select id="mteacherService" class="size-xl" title="전체 서비스">`;
          mrnServiceSelect += ' <option value="">전체 서비스</option>';

          setFavoritePopup.v.codeList.mteacherService.forEach((row, idx) => {
            mrnServiceSelect += `<option value="${row.locationName}" ${row.locationName == setFavoritePopup.v.locationName ? "selected" : ""}>${row.locationName}</option>`;
          });

          mrnServiceSelect +=  '</select>';

          $('#term-tab').append(mrnServiceSelect);
        }

        // 링크 즐겨찾기
        if (setFavoritePopup.v.tabCode == 'linkList') {
          $('.forms.selects.no-margin').addClass('display-hide');
        } else {
          $('.forms.selects.no-margin').removeClass('display-hide');
        }

        $('#term-tab select').off("change").on("change", setFavoritePopup.f.selectSelectOption);

        renderSelect2();

        //setFavoritePopup.f.setData(data);
      },

      setData: (list) => {
        if (setFavoritePopup.v.tabCode == 'mrnList') {
          let mrnBookmark = $('#mrnBookmark');
          mrnBookmark.empty();

          if (list.length > 0) {
            list.forEach((row, idx) => {
              mrnBookmark.append(`
                <button type="button" class="${setFavoritePopup.v.initSaveList.bookmarkMrnList.indexOf(row.masterSeq) >= 0 ? 'item toggle-this active' : 'item toggle-this'}" value="${row.masterSeq}" data-url="${row.linkUrl}" data-name="${row.textbookName}">
                    <div class="info-wrap">
                        <p>${setFavoritePopup.v.subjectLevelCode == 'ELEMENT' ? '미래엔' : row.subjectCodeName}</p>
                        <p class="book-info">[${row.subjectRevisionCode}] ${row.textbookName} ${row.leadAuthorName != null && row.leadAuthorName != '' ? `(${row.leadAuthorName})` : ''}</p>
                    </div>
                    <div class="extra"></div>
                </button>
            `);
            });
          } else {
            mrnBookmark.append(`
              <div class="box-no-data">
                  <p class="title">즐겨찾기가 없습니다.</p>
              </div>
          `);
          }
        }

        if (setFavoritePopup.v.tabCode == 'otherList') {
          let mrnBookmark = $('#mrnBookmark');
          mrnBookmark.empty();

          if (list.length > 0) {
            list.forEach((row, idx) => {
              mrnBookmark.append(`
                <button type="button" class="${setFavoritePopup.v.initSaveList.bookmarkOtherList.indexOf(row.otherSeq) >= 0 ? 'item toggle-this active' : 'item toggle-this'}" value="${row.otherSeq}" data-url="${row.linkUrl}" data-name="${row.name}">
                    <div class="info-wrap">
                        <p>${row.publisherName}</p>
                        <p class="book-info">[${row.subjectRevisionCode}] ${row.name} ${row.authorName ? `(${row.authorName})` : ''}</p>
                    </div>
                    <div class="extra"></div>
                </button>
            `);
            });
          } else {
            mrnBookmark.append(`
              <div class="box-no-data">
                  <p class="title">즐겨찾기가 없습니다.</p>
              </div>
          `);
          }
        }

        if (setFavoritePopup.v.tabCode == 'mteacherList') {
          let mrnBookmark = $('#mrnBookmark');
          mrnBookmark.empty();

          if (list.length > 0) {
            list.forEach((row, idx) => {
              let locationNames = row.locationName.split(';');
              let html = `
                <button type="button" class="${setFavoritePopup.v.initSaveList.bookmarkMteacherList.indexOf(row.serviceSeq) >= 0 ? 'item toggle-this active' : 'item toggle-this'}" value="${row.serviceSeq}" data-url="${row.linkUrl}" data-name="${row.serviceName}">
                    <div class="info-wrap">`;

              for (let i = 0; i < locationNames.length; i++) {
                html += `<p>${i == 0 ? '[' + locationNames[i] + ']' : locationNames[i]}</p>`;
              }

              html += `
                    </div>
                    <div class="extra"></div>
                </button>
              `;

              mrnBookmark.append(html);
            });
          } else {
            mrnBookmark.append(`
              <div class="box-no-data">
                  <p class="title">즐겨찾기가 없습니다.</p>
              </div>
          `);
          }
        }

        if (setFavoritePopup.v.tabCode == 'linkList') {
          let mrnBookmark = $('#mrnBookmark');
          mrnBookmark.empty();

          if (list.length > 0) {
            list.forEach((row, idx) => {
              mrnBookmark.append(`
                <button type="button" class="item toggle-this active" value="${row.favSeq}" data-url="${row.link}" data-name="${row.name}">
                    <div class="info-wrap">
                        <p>${row.name}</p>
                        <p class="book-info">${row.link}</p>
                    </div>
                    <div class="extra"></div>
                </button>
            `);
            });
          } else {
            mrnBookmark.append(`
              <div class="box-no-data">
                  <p class="title">즐겨찾기가 없습니다.</p>
              </div>
          `);
          }
        }

        $('#mrnBookmark button').off("click").on("click", setFavoritePopup.f.clickBookmark);

        toggleThis('.toggle-this');
      },

      openSetFavorite: (e) => {
        if (!$isLogin) {
          $(e.currentTarget).removeClass('active');
          $alert.open('MG00001');
          return;
        } else {
          openPopup({id: 'set-favorites'});

          setFavoritePopup.f.initSaveList();
          setFavoritePopup.f.initMyfavData();

          $('.tabs .tab li').removeClass('active');
          $('#mrnList').addClass('active');
          $('#tab-type-text').html('미래엔 교과서');

          setFavoritePopup.v.tabCode = 'mrnList';
          setFavoritePopup.v.termCode = null;
          setFavoritePopup.v.subjectCode = null;
          setFavoritePopup.v.locationName = null;

          setFavoritePopup.v.delList = [];

          setFavoritePopup.v.subjectLevelCode = $(e.currentTarget).find('input[name=subjectLevelCode]').val();
          setFavoritePopup.v.urlLevel = $(e.currentTarget).find('input[name=urlLevel]').val();
          setFavoritePopup.c.getFavoriteList();
        }
      },

      changeTab: (e) => {
        setFavoritePopup.v.tabCode = $(e.currentTarget).attr('id');
        setFavoritePopup.v.termCode = null;
        setFavoritePopup.v.subjectCode = null;
        setFavoritePopup.v.locationName = null;

        $('#tab-type-text').html($(e.currentTarget).text());

        setFavoritePopup.c.getData();
      },

      initSaveList: () => {
        setFavoritePopup.v.initSaveList.bookmarkMrnList = [];
        setFavoritePopup.v.initSaveList.bookmarkOtherList = [];
        setFavoritePopup.v.initSaveList.bookmarkMteacherList = [];
        setFavoritePopup.v.initSaveList.bookmarkLinkList = [];
      },

      initMyfavData: () => {
        setFavoritePopup.v.saveList.bookmarkMrnList = [];
        setFavoritePopup.v.saveList.bookmarkOtherList = [];
        setFavoritePopup.v.saveList.bookmarkMteacherList = [];
        setFavoritePopup.v.saveList.bookmarkLinkList = [];
      },

      selectGradeOption: (e) => {
        setFavoritePopup.v.gradeCode = $(e.currentTarget).attr('name');
        setFavoritePopup.c.getData();
      },

      selectSelectOption: (e) => {
        let eleId = $(e.currentTarget).attr('id');

        if (eleId == 'mrnTermCode') {
          // 학기
          setFavoritePopup.v.termCode = e.currentTarget.value;
        }
        if (eleId == 'mrnSubjectCode') {
          // 과목
          setFavoritePopup.v.subjectCode = e.currentTarget.value;
        }
        if (eleId == 'mteacherService') {
          // 서비스
          setFavoritePopup.v.locationName = e.currentTarget.value;
        }

        setFavoritePopup.c.getData();
      },

      clickBookmark: (e) => {
        let tabCode = setFavoritePopup.v.tabCode;
        let listType;
        let listDelType;

        switch (tabCode) {
          case "mrnList" :
            listType = 'bookmarkMrnList';
            listDelType = 'MRN';
            break;
          case "otherList" :
            listType = 'bookmarkOtherList';
            listDelType = 'OTHER';
            break;
          case "mteacherList" :
            listType = 'bookmarkMteacherList';
            listDelType = 'MTEACHER';
            break;
          case "linkList" :
            listType = 'bookmarkLinkList';
            listDelType = 'LINK';
            break;
        }

        setFavoritePopup.v.initSaveList[listType].filter((v, k) => {
          if (v == e.currentTarget.value) {
            setFavoritePopup.v.initSaveList[listType].splice(k, 1);
          }
        });

        if (!$(e.currentTarget).hasClass('active')) {

          // 추가
          setFavoritePopup.v.delList.filter((v, k) => {
            if (v.value == e.currentTarget.value && v.type == listDelType) {
              setFavoritePopup.v.delList.splice(k, 1);
            }
          });

          const value = e.currentTarget.value;
          const dataSeq = null;
          const dataUrl = $(e.currentTarget).data('url') || null;
          const dataName = $(e.currentTarget).data('name') || null;
          const item = {value, dataSeq, dataUrl, dataName};
          setFavoritePopup.v.saveList[listType].push(item);

          setFavoritePopup.v.initSaveList[listType].push(parseInt(e.currentTarget.value));

        } else {

          // 삭제
          setFavoritePopup.v.saveList[listType].filter((v, k) => {
            if (v.value == e.currentTarget.value) {
              setFavoritePopup.v.saveList[listType].splice(k, 1);
            }
          });

          const value = e.currentTarget.value;
          const type = listDelType;
          const item = {value, type};
          setFavoritePopup.v.delList.push(item);

        }

      },

    },

    event : function() {
      // 즐겨찾기 > 설정하기 클릭 이벤트
      $("div[name=setFav]").off("click").on("click", setFavoritePopup.f.openSetFavorite);

      // 탭 클릭 이벤트
      $('.tab li').off().on("click", setFavoritePopup.f.changeTab);

      // 학년 탭 클릭 이벤트
      $('#grade-tab li').off("click").on("click", setFavoritePopup.f.selectGradeOption);

      // 학기, 과목, 서비스 select 변경 이벤트
      $('#term-tab select').off("change").on("change", setFavoritePopup.f.selectSelectOption);

      // 북마크 추가,삭제 클릭 이벤트
      $('#mrnBookmark button').off("click").on("click", setFavoritePopup.f.clickBookmark);

      // 저장 클릭 이벤트
      $('#saveBtn').on("click", setFavoritePopup.c.saveBookmark);
    },

    init : async function (){
      console.log('setFavoritePopup init');

      setFavoritePopup.event();
    }
  };

  setFavoritePopup.init();
})


