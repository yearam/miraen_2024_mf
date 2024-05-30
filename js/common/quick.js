let quickScreen = {
  v: {
    kakaoId: null,
    facebookId: null,
    naverId: null,
    nhnId: null,
    nhnServerDomain: null,
    whalespaceId: null,
    googleId: null,
    serviceDomain: null,
    redirectUrl: null,
    redirectUri: null,
    hostCommon: null,
    currentSiteLevel: null,
    userRight: null,
  },

  msg: {
    favorite_h4: "즐겨찾기 된<br/>교과서가 없습니다.",
    favorite_p: "내가 수업하는<br/> 미래엔 교과서를 등록해<br/> 보세요",
    service_h4: "즐겨찾기 된<br/>서비스가 없습니다.",
    service_p: "엠티처의 서비스를<br/> 즐겨찾기하여 사용하세요.",
  },

  c: {
    getFavorite: () => {
      const options = {
        method: "POST",
        url: "/pages/api/quick.ax",
        data: {siteSubjectLevel: quickScreen.v.currentSiteLevel},
        success: (res) => {
          const row = res.row;

          quickScreen.f.bindFavTextbook(row["textbook"]);
          quickScreen.f.bindFavService(row["service"]);
          // quickScreen.f.bindScrap(row["scrap"]);
          // quickScreen.f.bindMydata(row["mydata"]);
        }
      };

      $cmm.ajax(options);
    },

  },

  f: {
    // create tooltip
    tooltip: () => {
      $("[data-name=quick-tool]").each(function (idx, el) {
        $(el).webuiPopover({
          multi: true,
          backdrop: $(el).is("[data-backdrop]"),
          closeable: $(el).is("[data-closeable]"),
          style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
          container: $(el).is("[data-container]") ? $(`${$(el).attr("data-container")}`) : false,
          onShow: function () {
            if ($(el).is("[data-focus]")) {
              $(el).addClass('focus');
            }
          },
          onHide: function () {
            if ($(el).is("[data-focus]")) {
              $(el).removeClass('focus');
            }
          }
        });
      });

    },

    // 현재 접속한 사이트 학교급 (초/중/고)
    getSiteLevel: () => {
      const pathname = location.pathname;

      if (!!pathname) {
        if (pathname.includes("/ele/")) quickScreen.v.currentSiteLevel = "/ele/";
        else if (pathname.includes("/mid/")) quickScreen.v.currentSiteLevel = "/mid/";
        else if (pathname.includes("/high/")) quickScreen.v.currentSiteLevel = "/high/";
      }
    },

    // 즐겨찾기 > 교과서
    bindFavTextbook: (list) => {
      const div = $("#mytextbook .webui-popover-content");

      if (!list.length) quickScreen.f.bindNoFavorite(div, "favorite");
      else quickScreen.f.bindFavorite(div, list);
    },

    // 즐겨찾기 > 서비스
    bindFavService: (list) => {
      const div = $("#myservice .webui-popover-content");

      if (!list.length) quickScreen.f.bindNoFavorite(div, "service");
      else quickScreen.f.bindFavorite(div, list);
    },

    /*
    * 스크랩, 내자료 리스트 가져오기
    // 스크랩
    bindScrap: (list) => {
      const div = $("#myscrap .webui-popover-content");

      if (!list.length) quickScreen.f.bindNoFavorite(div, "scrap");
      else quickScreen.f.bindFavorite(div, list);
    },

    // 내자료
    bindMydata: (list) => {
      const div = $("#mydata .webui-popover-content");

      if (!list.length) quickScreen.f.bindNoFavorite(div, "mydata");
      else quickScreen.f.bindFavorite(div, list);
    },

    */

    bindFavorite: (div, list) => {
      let html = "";

      html += "<ul class='ul-dot size-sm'>";

      for (const item of list) {
        let name = item.name;

        if (name.includes(">")) {
          name = name.replaceAll(" ", "");
          name = name.substring(name.lastIndexOf(">") + 1);
        }

        if (name.length > 12) name = name.substring(0, 12) + "..."

        html += `
              <li>
                <a href="${item.url}">
                  ${name}
                </a>
              </li>
            `;
      }

      html += "</ul>";

      div.empty();
      div.append(html);
    },

    bindNoFavorite: (div, type) => {
      const html = `
          <h4 class="text-primary"> ${quickScreen.msg[`${type}_h4`]} </h4>
          <hr class="no-margin margin-top-lg">
          <p class="margin-top-md"> ${quickScreen.msg[`${type}_p`]} </p>
          <button type="button"
                  class="button type-secondary size-md margin-top-md"
                  onclick="location.href='${quickScreen.v.hostCommon}/pages/common/mypage/myclass.mrn'"> 
            서비스 즐겨찾기
            <svg>
              <title>아이콘 - icon-plus</title>
              <use href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
            </svg>
          </button>
        `;

      div.empty();
      div.append(html);
    },

    setValue: () => {
      $('.th-value').each(function () {
        let value = $(this).val();
        let key = $(this).attr('key');

        quickScreen.v[key] = value;
      });
    },

    setCookie: () => {
      let expiredays = 0;
      if ($('#save-id').prop('checked')) expiredays = 30;

      let name = 'mtLoginId';
      let value = $('#user-id').val();
      let todayDate = new Date();

      todayDate.setDate(todayDate.getDate() + expiredays);

      document.cookie = name + "=" + escape(value) + "; path=/; expires="
          + todayDate.toGMTString() + ";"
    },

    getCookie: () => {
      let id = '';
      let name = 'mtLoginId';
      var search = name + "=";

      if (document.cookie.length > 0) { // 어떤 쿠키라도 있다면
        offset = document.cookie.indexOf(search);

        if (offset != -1) { // 쿠키 존재 시
          $('#save-id').prop('checked', true);

          offset += search.length; // 첫번째 값의 인덱스 셋팅
          end = document.cookie.indexOf(";", offset); // 마지막 쿠키 값의 인덱스 셋팅

          if (end == -1)
            end = document.cookie.length;

          id = unescape(document.cookie.substring(offset, end));
        }
      }

      $('#user-id').val(id);
    },

    login: () => {

      // [1] 필수값 체크
      let confirmFlag = true;

      if ($('#user-id').val() == "") {
        alert('아이디 또는 이메일 주소를 입력해주세요.')
        confirmFlag = false;
      }

      if ($('#user-pw').val() == "") {
        alert('비밀번호를 입력해 주세요.')
        confirmFlag = false;
      }

      // [2] 로그인
      if (confirmFlag == false) {
        console.log('validation chk');
      } else {
        // 쿠키
        quickScreen.f.setCookie()

        $.ajax({
          type: "POST",
          data: $("#form").serialize(),
          url: "/User/LoginProc.ax",

          /* 전송 후 세팅 */
          success: function (res) { // todo
            if (res.resultCode == '0000') {
              // const redirectUrl = quickScreen.v.serviceDomain + quickScreen.v.redirectUri;
              const redirectUrl = location.search ? location.origin + location.pathname + location.search : location.origin + location.pathname;

              if (_.isEmpty(res.row)) {
                location.href = redirectUrl;
              } else {
                quickScreen.f.goSsoLogin(res.row);
              }
            } else {
              alert('아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인하신 후 입력해주세요');
            }
          },
          error: function () { //시스템에러
            alert("오류발생");
          }
        });
      }
    },

    goSsoLogin: (data) => {
      const redirectUrl = location.search ? location.origin + location.pathname + location.search : location.origin + location.pathname;

      let $newForm = $(`<form name="register2" method="POST" action="${data.ssodmain}/register2.mrn"></form>`);

      let param = {};
      param.user_id = data.userId;
      param.return_url = location.origin + data.ssoLResult;
      param.go_url = $coding.encodeUnicode(redirectUrl);

      for (const key in param) {
        let $newInput = $(`<input type="hidden" name="${key}" value="${param[key]}" />`);

        $newForm.append($newInput);
      }

      // $('form[name=register2]').serialize();
      $(document).find('body').append($newForm);
      $newForm.submit();
    },

    snsLogin: (sns) => {
      const quickRedirect = window.location.href.replaceAll("&", "%5E"); // & -> ^
      location.href = `${quickScreen.v.hostCommon}/pages/common/User/QuickLogin.mrn/${sns}?quickRedirect=` + quickRedirect;
    },

    goSignUpPage: () => {
      location.href = quickScreen.v.hostCommon
          + '/pages/common/User/Join.mrn?redirectURI='
          + encodeURIComponent(location.href);
    },

    openQuick: () => {
      $(".toggle-button").trigger("click");
    },

    eleContent: (e) => {
      if (quickScreen.v.currentSiteLevel === "/ele/") {
        if (!$isLogin) {
          $alert.open("MG00001");
          return;
        }

        if (quickScreen.v.userRight !== "0010") {
          $alert.open("MG00003");
          return;
        }

        const url = $(e.currentTarget).data("href");
        const options = "width=1500, height=800";

        window.open(url, "_blank", options);
      }
    },

    logout: () => {
      $alert.open("MG00002", () => {
        location.href = "/User/Logout.ax";
      });
    },

  },

  event: function () {
    // 변수 값 할당
    quickScreen.f.setValue();
    // 쿠키에서 아이디 불러오기
    quickScreen.f.getCookie();

    // 로그인 버튼 클릭
    $(document).on('click', '#btn-login', quickScreen.f.login);
    $(document).on('click', '.btn-sns-login', function (e) {
      let sns = e.target.dataset.snsType;
      quickScreen.f.snsLogin(sns);
    });

    // 스페이스 입력 차단
    $(document).on('keyup', '#user-id', function(e){
      let value = $(e.target).val();
      value = value.replace(/\ /gi, '');
      $(e.target).val(value);
    });

    // 회원가입 페이지로 이동
    $(document).on('click', '#go-signup-page', quickScreen.f.goSignUpPage);

      $(".menu-list li").each(function (index) {
          if (index >= 4) {
              $(this).on("click", quickScreen.f.eleContent);
          }
      });

    $("#logout").on("click", quickScreen.f.logout);

    $(document).on('click', '.quick-menu', () => {
        if ($('.quick-menu').hasClass('on')) {
            sessionStorage.setItem('quickMenuStatus', 'on');
        } else {
            sessionStorage.setItem('quickMenuStatus', 'off');
        }
    })

  },

  init: function () {
    quickScreen.f.tooltip();
    quickScreen.f.getSiteLevel();

    quickScreen.event();

    quickScreen.c.getFavorite();

    let quickStatus = sessionStorage.getItem("quickMenuStatus");

    // !NOTE : 기본 퀵메뉴==접힘상태 / .init-show==초기 펼침상태 / .on 메뉴 클릭시 펼침 조절 입니다.
    if (quickStatus === 'off') {
       // quickScreen.f.openQuick();  
       //$('.quick-menu').removeClass('on');
    } else {	   	   
       $('.quick-menu').addClass('init-show');       
    }
  },
};

$(function () {
  quickScreen.init();
});

const $quick = quickScreen.c;