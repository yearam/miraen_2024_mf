let personalGnbScreen

$(function () {
  personalGnbScreen = {
    /**
     * 내부 전역변수
     *
     * @memberOf personalGnbScreen
     */
    v: {
        subjectLevelCode: '',
        gnbData: [],
    },

    /**
     * 통신 객체- call
     *
     * @memberOf personalGnbScreen
     */
    c: {
      /**
       * 중등 개인화 Gnb 정보 호출
       *
       * @memberOf personalGnbScreen.c
       */

      getPersonalGnbList: () => {
        const currentSubjectCode = personalGnbScreen.v.subjectLevelCode;

        const options = {
          url: '/pages/api/textbook/gnbMyTextbookList.ax',
          method: 'GET',
          data: {subjectLevelCode : personalGnbScreen.v.subjectLevelCode},
          success: function(res) {
            // 교과서명: favoriteName
            // 스마트수업 path: smartPptPath
            // 링크형특화자료 path: specailPath
            // 중간/기말평가 다운로드 -> test_count !== 0 이면 교과서 상세페이지로 이동해서 멀티다운로드 열기

            personalGnbScreen.f.setGnbItems(res.rows);
          },
        };

        $.ajax(options);
      },

      /**
       * 중간기말평가 params 가져오기
       *
       * @memberOf personalGnbScreen.c
       */

      getTestParameterList: () => {
        const masterSeq = personalGnbScreen.v.masterSeq;

        const options = {
          url: '/pages/mid/textbook/reference/getReferenceParams.ax',
          method: 'GET',
          data: {
            masterSeq: masterSeq,
            dataType: 'testDownloadBtn',
          },
          success: function(res) {
            console.log("getTestParameterList succeeded")
            let paramsArray = [];

            for (let i = 0; i < res.rows.length; i++) {
              let currentItem = res.rows[i];

              if (currentItem !== null && currentItem !== undefined) {
                if (currentItem && currentItem.parameter) {
                  let newItem = {
                    params: currentItem.parameter
                  };
                  paramsArray.push(newItem);
                }
              }
            }

            $multidown.open(paramsArray);
          },
        };

        $.ajax(options);
      },
    },

    /**
     * 내부 함수
     *
     * @memberOf personalGnbScreen
     */
    f: {
      /**
       *
       *
       * @memberOf personalGnbScreen.f
       */
      getMidOrHigh: function () {
        let currentUrl = window.location.href;
        let pageType = currentUrl.match(/\/pages\/(mid|high)\//);

        if (pageType) {
          let extractedWord = pageType[1]; // "mid" 또는 "high"
          let subjectLevelCode= extractedWord === 'mid' ? 'MIDDLE' : 'HIGH';

          if (personalGnbScreen.v.subjectLevelCode !== subjectLevelCode) {
            personalGnbScreen.v.subjectLevelCode = subjectLevelCode;
            personalGnbScreen.c.getPersonalGnbList(); // 새로 불러오기 !
          }

        } else {
          console.log("mid or high 가져오기 실패");
        }
      },

      /**
       * 개인화 gnb의 각 아이템에 값 세팅 (메인 or 메인 이외 페이지)
       *
       * @memberOf personalGnbScreen.f
       */
      setGnbItems: function (res) {
        sessionStorage.setItem("gnbData", JSON.stringify(res));
        let gnbData = '';

        if (typeof res === 'string') {
          gnbData = JSON.parse(res);
        } else {
          gnbData = res;
        }

        const currentSubjectCode = personalGnbScreen.v.subjectLevelCode;

        // 개인화 gnb 데이터 존재함
        if (gnbData.length > 0) {

          // TODO: 메인메뉴에서 진입했을 때와 개인화 gnb에서 진입했을 경우를 구분하여 sessionStorage에 저장
          //    key: 'source'
          //    value: 메인 -> 'mainMenu'  / 개인화 gnb -> 'personalGnb'
          //      메인메뉴에서 진입했을 때는
          //         개인화 gnb 목록에 있는 교과서의 seq 중 일치하는 게 있다면 개인화 gnb에 해당 과목 정보 세팅
          //         일치하는 게 없다면 개인화 gnb 아이템 중 첫 번째 아이템 정보 세팅
          //      개인화 gnb 메뉴에서 진입했을 때는
          //         클릭된 아이템의 정보를 sessionStorage에 저장해두고 페이지 이동 후 각 정보 세팅

          // Main 페이지인지 아닌지 판단
          let currentURL = window.location.href;
          let targetMidURL = "/pages/mid/Main.mrn";
          let targetHighURL = "/pages/high/Main.mrn";
          let currentSuffix = currentURL.substr(currentURL.indexOf('/pages'));

          console.log("is Main page?: ", currentSuffix === targetMidURL || currentSuffix === targetHighURL);

          // 현재 메인페이지인 경우
          if (currentSuffix === targetMidURL || currentSuffix === targetHighURL) {
            // 메인에서는 source가 어디든 상관 없이 gnb 리스트의 첫 번째 아이템 active
            // 대표로 노출되는 교과서


            // $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown button').html(`
            //   ${gnbData[0].textbookName}${gnbData[0].leadAuthorName ? ` (${gnbData[0].leadAuthorName})` : ''}
            //   <svg>
            //     <title>아이콘 화살표</title>
            //     <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
            //   </svg>
            // `)
            //
            // // 버튼 디폴트 : 첫 번째 아이템의 링크 넣어두기
            // $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons').html(`
            //   ${gnbData[0].allSmartPptDisplayYn === 'Y' ? `
            //     <a class="button size-md" data-path="${gnbData[0].smartPptPath}" data-type="smart-ppt">
            //     스마트 수업
            //     <svg>
            //       <title>아이콘 책</title>
            //       <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
            //     </svg>
            //   </a>
            //   ` : ''}
            //   ${gnbData[0].testCount ? `
            //     <a class="button size-md" href="${gnbData[0].favoriteUrl}" data-type="test-data" data-masterseq="${gnbData[0].referenceSeq}">
            //       중간&#183;기말평가 다운로드
            //       <svg>
            //         <title>아이콘 다운로드</title>
            //         <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
            //       </svg>
            //     </a>` : ''
            //   }
            //   ${gnbData[0].specailPath ? `
            //     <a class="button size-md" data-path="${gnbData[0].specailPath}" data-type="special-data">
            //       특화자료링크형
            //       <svg>
            //         <title>아이콘 링크</title>
            //         <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-link"></use>
            //       </svg>
            //     </a>
            //   ` : ''}
            // `)
          } else {
            // 현재 메인페이지가 아닌 경우
            let source = localStorage.getItem('source');
            console.log("source: ", source)

            //      메인메뉴에서 진입했을 때
            if (source === 'mainMenu') {
              let currentURL = window.location.href;
              let urlParams = new URLSearchParams(currentURL.split('?')[1]);
              let masterSeq = urlParams.get('masterSeq');
              let foundObject = null;

              gnbData.forEach(function(item) {
                if (item.referenceSeq === masterSeq) {
                  foundObject = item;
                }
              });

              // if (foundObject !== null) {
              //   // 현재 페이지가 개인화 gnb 리스트에 존재하면 해당 과목 정보 세팅
              //   // 대표로 노출되는 교과서
              //   $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown button').html(`
              //     ${foundObject.textbookName}${foundObject.leadAuthorName ? ` (${foundObject.leadAuthorName})` : ''}
              //     <svg>
              //       <title>아이콘 화살표</title>
              //       <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
              //     </svg>
              //   `)
              //
              //   // 버튼 디폴트 : 첫 번째 아이템의 링크 넣어두기
              //   $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons').html(`
              //     ${foundObject.allSmartPptDisplayYn === 'Y' ? `
              //       <a class="button size-md" data-path="${foundObject.smartPptPath}" data-type="smart-ppt">
              //         스마트 수업
              //         <svg>
              //           <title>아이콘 책</title>
              //           <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
              //         </svg>
              //       </a>
              //     ` : ''}
              //     ${foundObject.testCount ? `
              //       <a class="button size-md" href="${foundObject.favoriteUrl}" data-type="test-data" data-masterseq="${foundObject.referenceSeq}">
              //         중간&#183;기말평가 다운로드
              //         <svg>
              //           <title>아이콘 다운로드</title>
              //           <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
              //         </svg>
              //       </a>` : ''
              //         }
              //     ${foundObject.specialPath ? `
              //       <a class="button size-md" data-path="${foundObject.specialPath}" data-type="special-data">
              //         특화자료링크형
              //         <svg>
              //           <title>아이콘 링크</title>
              //           <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-link"></use>
              //         </svg>
              //       </a>
              //     ` : ''}
              //   `)
              //
              // } else {
                console.log("gnbData[0].referenceSeq: ", gnbData[0].referenceSeq)
                // 개인화 gnb 아이템 중 첫 번째 아이템 정보 세팅
                // 대표로 노출되는 교과서 - 첫번째 교과서
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown button').html(`
                  ${gnbData[0].favoriteName}
                  <svg>
                    <title>아이콘 화살표</title>
                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
                  </svg>
                `)

                // 버튼 디폴트 : 첫 번째 아이템의 링크 넣어두기
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons').html(`
                  <a class="button size-md" data-path="${gnbData[0].smartPptPath}" data-type="smart-ppt"> 
                    스마트 수업 
                    <svg>
                      <title>아이콘 책</title>
                      <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                    </svg>
                  </a>
                  ${gnbData[0].testCount ? `
                    <a class="button size-md" href="${gnbData[0].favoriteUrl}" data-type="test-data" data-test-count="${gnbData[0].testCount}" data-masterseq="${gnbData[0].referenceSeq}"> 
                      중간&#183;기말평가 다운로드
                      <svg>
                        <title>아이콘 다운로드</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                      </svg>
                    </a>` : ''
                    }
                  ${gnbData[0].specialPath ? `
                    <a class="button size-md" data-path="${gnbData[0].specialPath}" data-type="special-data"> 
                      특화자료링크형 
                      <svg>
                        <title>아이콘 링크</title>
                        <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-link"></use>
                      </svg>
                    </a>
                  ` : ''}
                `)

            } else {
              //      개인화 gnb에서 진입했을 때 - sessionStorage에서 저장된 아이템 정보 get
              personalGnbScreen.f.setAttrAfterPageChange();

            }
          }

          // gnb 교과서 목록 - 메인인 경우 메인 아닌경우 공통
          let temp = `<h2>내 교과서</h2>`;
          $.each(gnbData, function (index, item) {
            temp += `
              <a class="button type-text" 
                  title="${item.textbookName}${item.leadAuthorName ? ` (${item.leadAuthorName})` : ''}" 
                  style="cursor: pointer"
                  data-smart-ppt-path="${item.smartPptPath}"
                  data-special-path="${item.specialPath}"
                  data-favorite-url="${item.favoriteUrl}"
                  data-test-count="${item.testCount}"
                  data-favorite-seq="${item.favoriteSeq}"
                  data-reference-seq="${item.referenceSeq}"
                  data-subject-name="${item.subjectName}"
              >
                ${item.textbookName}${gnbData[0].leadAuthorName ? ` (${item.leadAuthorName})` : ''}
                ${gnbData.length >= 2 ? `
                  <svg>
                    <title>아이콘 화살표</title>
                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
                  </svg>
                ` : ''}
              </a>
            `
            $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown .items').html('').append(temp);
          })

          personalGnbScreen.f.handleGnbButtons();
          personalGnbScreen.f.addEventOnItems();
        }

        if (gnbData.length === 0 || !gnbData) {
          // 개인화 gnb 데이터 없음 !!
          if (currentSubjectCode === "MIDDLE") {
            $('.theme-middle .wrapper').removeClass('personal-sticky');
          } else {
            $('.theme-high .wrapper').removeClass('personal-sticky');
          }
        }

        // 마우스 커서 포인터
        $('.button[data-type="smart-ppt"]').css('cursor', 'pointer');

        sessionStorage.setItem("isLoaded", "true");
      },

      /**
       * gnb 내 교과서명, 버튼들에 이벤트 추가
       *
       * @memberOf personalGnbScreen.f
       */
      addEventOnItems: function () {
        const currentSubjectCode = personalGnbScreen.v.subjectLevelCode;

        // 여기부터 세팅된 아이템의 클릭이벤트
        $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown a').on('click', function(e) {
          sessionStorage.setItem('favoriteItemClicked', "true");

          sessionStorage.setItem('favoriteName', $(this).attr('title'));
          sessionStorage.setItem('smartPptPath', $(this).data('smart-ppt-path'));
          sessionStorage.setItem('testDownloadPath', $(this).data('special-path'));
          sessionStorage.setItem('specialDataPath', $(this).data('specialpath'));
          sessionStorage.setItem('favoriteSeq', $(this).data('favorite-seq'));
          sessionStorage.setItem('referenceSeq', $(this).data('reference-seq'));
          sessionStorage.setItem('subjectName', $(this).data('subject-name'));

          // 개인화 gnb에서 진입 내용 저장
          localStorage.setItem('source', 'personalGnb');

          // 개인화 gnb 아이템 클릭 여부 저장
          sessionStorage.setItem('isPersonalGnbClicked', 'true');

          window.location.href = $(this).data('favoriteUrl');
        });

        personalGnbScreen.f.setAttrAfterPageChange();
      },

      /**
       * 페이지 이동 후 아이템에 path 할당
       *
       * @memberOf personalGnbScreen.f
       */
      setAttrAfterPageChange: function () {
        let currentSubjectCode = personalGnbScreen.v.subjectLevelCode;
        let storedData = sessionStorage.getItem("gnbData");

        let gnbData = '';

        if (typeof storedData === 'string') {
          gnbData = JSON.parse(storedData);
        } else {
          gnbData = storedData;
        }

          // 현재 페이지가 메인일 경우 - gnb 리스트의 첫 번째 아이템의 정보 할당
          // 메인이 아닐 경우 해당하는 아이템 정보 할당

          // Main 페이지인지 아닌지 판단
          let currentURL = window.location.href;
          let targetMidURL = "/pages/mid/Main.mrn";
          let targetHighURL = "/pages/high/Main.mrn";
          let currentSuffix = currentURL.substr(currentURL.indexOf('/pages'));
          let isPersonalGnbClicked = sessionStorage.getItem('isPersonalGnbClicked');
          const source = sessionStorage.getItem('source');
          let favoriteName
          let smartPptPath
          let testDownloadPath
          let specialDataPath
          let favoriteSeq
          let referenceSeq

          if ((currentSuffix === targetMidURL || currentSuffix === targetHighURL) && isPersonalGnbClicked !== 'true') {
            // 메인페이지인 경우
            // 개인화 gnb 아이템이 클릭된 내역이 없다면
            //     --- gnbData의 첫 번째 아이템 세팅
            //     --- 아니면 이미 클릭된 아이템 세팅


            $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown button').html(`
              ${gnbData[0].textbookName}${gnbData[0].leadAuthorName ? ` (${gnbData[0].leadAuthorName})` : ''}
              <svg>
                <title>아이콘 화살표</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
              </svg>
            `)

            // 버튼 디폴트 : 첫 번째 아이템의 링크 넣어두기
            $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons').html(`
              ${gnbData[0].allSmartPptDisplayYn === 'Y' ? `
                <a class="button size-md" data-path="${gnbData[0]?.smartPptPath}" data-type="smart-ppt"> 
                스마트 수업 
                  <svg>
                    <title>아이콘 책</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-book"></use>
                  </svg>
                </a>
              ` : ''}
              ${gnbData[0]?.testCount ? `
                <a class="button size-md" href="${gnbData[0]?.favoriteUrl}" data-type="test-data" data-masterseq="${gnbData[0]?.referenceSeq}"> 
                  중간&#183;기말평가 다운로드 
                  <svg>
                    <title>아이콘 다운로드</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                  </svg>
                </a>` : ''
            }
              ${gnbData[0]?.specialPath ? `
                <a class="button size-md" data-path="${gnbData[0]?.specialPath}" data-type="special-data"> 
                  특화자료링크형 
                  <svg>
                    <title>아이콘 링크</title>
                    <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-link"></use>
                  </svg>
                </a>
              ` : ''}
            `)

          } else if ((currentSuffix !== targetMidURL || currentSuffix !== targetHighURL) ||
              ((currentSuffix === targetMidURL || currentSuffix === targetHighURL) && isPersonalGnbClicked === 'true')) {

            // 메인페이지가 아닌 경우
              currentSubjectCode = personalGnbScreen.v.subjectLevelCode;
              favoriteName = sessionStorage.getItem('favoriteName');
              smartPptPath = sessionStorage.getItem('smartPptPath');
              testDownloadPath = sessionStorage.getItem('testDownloadPath');
              specialDataPath = sessionStorage.getItem('specialDataPath');
              favoriteSeq = parseInt(sessionStorage.getItem('favoriteSeq'));
              referenceSeq = parseInt(sessionStorage.getItem('referenceSeq'));

            // 세션 스토리지에서 데이터 가져오기
            let storedData = JSON.parse(sessionStorage.getItem('gnbData'));
            let foundObject = {};

            if (Array.isArray(storedData)) {
              // 배열 내에서 favoriteSeq와 일치하는 객체 찾기
              foundObject = storedData.find(function(obj) {
                return obj.favoriteSeq === favoriteSeq;
              });
            }

            // 대표로 노출되는 교과서
            $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown button').html(`
              ${favoriteName}
              <svg>
                <title>아이콘 화살표</title>
                <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
              </svg>
            `)

            if (!foundObject) {
              $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .dropdown button').html(`
                  ${gnbData[0].textbookName}${gnbData[0].leadAuthorName ? ` (${gnbData[0].leadAuthorName})` : ''}
                  <svg>
                    <title>아이콘 화살표</title>
                    <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-circle-line-chevron-down"></use>
                  </svg>
              `)

              // 현재 교과서에서 존재하지 않는 데이터 아이콘은 숨기기
              if (gnbData[0]?.allSmartPptDisplayYn !== 'Y' && !gnbData[0]?.smartPptPath) {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="smart-ppt"]').css('display', 'none');
              } else { $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="smart-ppt"]').css('display', 'inline-flex').attr('data-path', gnbData[0]?.smartPptPath); }

              if (gnbData[0]?.testCount < 1 || !gnbData[0]?.testCount) {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="test-data"]').css('display', 'none');
              } else {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="test-data"]').css('display', 'inline-flex').attr({
                  'data-test-count' : gnbData[0]?.testCount,
                  'data-path' : testDownloadPath,
                });

                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="test-data"]').each(function() {
                  if (source === 'personalGnb') {
                    $(this).attr('data-masterseq', referenceSeq);
                  } else {
                    $(this).attr('data-masterseq', gnbData[0].referenceSeq);
                  }
                });
              }

              if (!gnbData[0]?.specialPath) {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="special-data"]').css('display', 'none');
              } else {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="special-data"]').css('display', 'inline-flex').attr('data-path', gnbData[0]?.specialPath);
              }

            } else {
              // 현재 교과서에서 존재하지 않는 데이터 아이콘은 숨기기
              if (foundObject.allSmartPptDisplayYn !== 'Y' || !foundObject.smartPptPath) { // 사용여부 N 이거나 path 없는 경우
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="smart-ppt"]').css('display', 'none');
              } else { $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="smart-ppt"]').css('display', 'inline-flex').attr('data-path', foundObject.smartPptPath); }

              if (foundObject.testCount < 1 || !foundObject.testCount) { // count가 1보다 작거나 count가 없는경우
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="test-data"]').css('display', 'none');
              } else {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="test-data"]').css('display', 'inline-flex').attr({
                  'data-test-count' : foundObject?.testCount,
                  'data-path' : testDownloadPath,
                });

                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="test-data"]').each(function() {
                  if (source === 'personalGnb') {
                    $(this).attr('data-masterseq', referenceSeq);
                  } else {
                    $(this).attr('data-masterseq', foundObject.referenceSeq);
                  }
                });
              }

              if (!foundObject.specialPath) {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="special-data"]').css('display', 'none');
              } else {
                $('header[school-grade="' + currentSubjectCode + '"] .personal-wrap .buttons a[data-type="special-data"]').css('display', 'inline-flex').attr('data-path', foundObject.specialPath);
              }
            }
          }

        personalGnbScreen.f.handleGnbButtons();
      },

      // 로그인 안내 alert
      loginAlert: () => {
        $alert.open("MG00001");
      },

      // 정회원 교사만 사용 가능 alert
      needAuthAlert: () => {
        $alert.open("MG00011", () => {});
      },

      // 저작권 안내 alert
      copyrightAlert: (path) => {
        console.log("path: ", path)
        $alert.open("MG00010", () => {
          if (!path) {
            // alert("링크가 없습니다.")
          } else {
            window.open(path, '_blank');
          }
        });
      },

      handleGnbButtons: function () {
        // gnb의 각 버튼의 이벤트 등록
        $('.personal-wrap .buttons a[data-type="smart-ppt"], .personal-wrap .buttons a[data-type="special-data"]').off('click').on('click', function(event) {
          event.preventDefault();
          let path = $(this).data('path');

          if ($isLogin) {
            window.open(path, '_blank');
          } else {
            personalGnbScreen.f.loginAlert();
          }
        });

        $('.personal-wrap .buttons a[data-type="test-data"]').off('click').on('click', function(event) {
          event.preventDefault();
          let path = $(this).data('path');
          personalGnbScreen.v.masterSeq = $(this).data('masterseq');

          // $alert.open("MG00010", () => {
            if ($(this).data('test-count') === 1) {
              $alert.open("MG00010", () => {
                window.open(path, '_blank');
              })
            } else {
              if (multi_use_yn === true || multi_use_yn === 'true') {
                console.log("multi_use_yn: ", multi_use_yn);
                personalGnbScreen.c.getTestParameterList();
              } else {
                $alert.open('MG00060');
              }
            }
          // })

        });
      }
    },

    init: function (event) {
      console.log("personalGnb.js init!")
      let currentSubjectCode = personalGnbScreen.v.subjectLevelCode;
      personalGnbScreen.f.getMidOrHigh();

      console.log("isLogin: ", $isLogin);

      $(document).ready(function() {
        // school-grade 값을 가져와서 작업 수행
        let currentSchoolGrade = $('header').data('school-grade');

        // 이전에 저장된 값이 없으면 초기값을 저장
        if (!localStorage.getItem("previousSchoolGrade")) {
          localStorage.setItem("previousSchoolGrade", currentSchoolGrade);
        }

        let previousSchoolGrade = localStorage.getItem("previousSchoolGrade"); // 이전 값

        // 중등 -> 고등 or 고등 -> 중등 옮긴 경우
        if (previousSchoolGrade !== currentSchoolGrade) {

          if ($isLogin) {
            personalGnbScreen.c.getPersonalGnbList();
          } else {
            // 로그인 안되어있으면 개인화 gnb 숨김
            sessionStorage.clear();
            $('.theme-middle .wrapper').removeClass('personal-sticky');
          }

          // 변경된 값을 저장
          localStorage.setItem("previousSchoolGrade", currentSchoolGrade);
        } else {
          if ($isLogin) {
            let storedData = sessionStorage.getItem("gnbData");

            if (storedData) {
              // console.log("storedData check: ", storedData.length);
            }

            // 불러와진 개인화 gnb 데이터 X
            //     새로 불러오든, 이미 불러온 데이터가 있든 메인인지 아닌지 체크해서 각자 처리해야함
            //     --> setGnbItems에서 처리
            if (storedData === null) {
              // 새로 불러오기
              personalGnbScreen.c.getPersonalGnbList();
            } else {
              personalGnbScreen.f.setGnbItems(storedData);
            }
          } else {
            // 로그인 안되어있으면 개인화 gnb 숨김
            sessionStorage.clear();
            $('.theme-middle .wrapper').removeClass('personal-sticky');
          }
        }

      });


    },

    event: function () {

    }
  };

  if ($('header[school-grade="MIDDLE"], header[school-grade="HIGH"]').length) {
    personalGnbScreen.init();
  }
});