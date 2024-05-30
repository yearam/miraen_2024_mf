$(function () {
  let screen = {
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
    },

    c: {
 
    },

    f: {

      setValue: ()=> {
        $('.th-value').each(function() {
          let value = $(this).val();
          let key = $(this).attr('key');
          screen.v[key] = value;
        });
      },

      setCookie: ()=> {
        let expiredays = 0;
        if ($('#save-id').prop('checked')) expiredays = 30;

        let name = 'mtLoginId';
        let value = $('#user-id').val();
        let todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) + "; path=/; expires="
            + todayDate.toGMTString() + ";"
      },

      getCookie: ()=> {
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

      keyPress: (e) => {
        if (e.keyCode == 13) {
          screen.f.login();
        }
      },

      login: ()=> {
        // [1] 필수값 체크
        let confirmFlag = true;
        if ($('#user-id').val() == "") {
          $alert.alert('아이디 또는 이메일 주소를 입력해주세요.')
          confirmFlag = false;
        }

        if (confirmFlag && $('#user-pw').val() == "") {
          $alert.alert('비밀번호를 입력해 주세요.')
          confirmFlag = false;
        }

        // [2] 로그인
        if (confirmFlag == false) {
          console.log('validation chk')
        } else {
          // 쿠키
          screen.f.setCookie()

          $.ajax({
            type:"POST",
            data:$("#form").serialize(),
            url:"/User/LoginProc.ax",

            /* 전송 후 세팅 */
            success: function(res) {
              console.log(res)
              if (res.resultCode == '0000') {
                const redirectUrl = screen.v.serviceDomain + '/' + screen.v.redirectUri;
                
                if(_.isEmpty(res.row)) {
                  location.href = redirectUrl;
                }else {
                  screen.f.goSsoLogin(res.row);
                }
              } else {
                  $alert.alert(res.resultMsg);
              }
            },
            error: function() { //시스템에러
              alert("오류발생");
            }
          });
        }
      },

      goSsoLogin: (data)=> {
        console.log(data);
        
        let $newForm = $(`<form name="register2" method="POST" action="${data.ssodmain}/register2.mrn"></form>`);

        let param = {};
        param.user_id = data.userId;
        param.return_url = location.origin + data.ssoLResult;
        param.go_url = $coding.encodeUnicode(screen.v.serviceDomain + '/' + screen.v.redirectUri);

        for(const key in param) {
          let $newInput = $(`<input type="hidden" name="${key}" value="${param[key]}" />`);
          $newForm.append($newInput);
          
        }

        // $('form[name=register2]').serialize();
        $(document).find('body').append($newForm);
        $newForm.submit();
      },

      snsLogin: (sns)=> {
        let state = '';

          $.ajax({
              url:'/User/SaveAgreeStateSession',
              type : "post",
              cache : false,
              dataType : "json",
              data : {"state":'LOGIN:'+state, "snsCd" : sns, "redirectUrl" : screen.v.redirectUrl, "redirectUri" : screen.v.redirectUri},
              success:function(result){
                  console.log(result)
                  if (result.status == 'succ') {
                      let redirectUrl = screen.v.serviceDomain + '/User/SnsJoin.mrn';
                      if (sns == 'kakao') {
                          let url = 'https://kauth.kakao.com/oauth/authorize?client_id='+screen.v.kakaoId+'&redirect_uri='+redirectUrl+'&response_type=code';
                          location.href = url;
                      } else if (sns == 'facebook') {
                          let url = 'https://www.facebook.com/v3.2/dialog/oauth?client_id='+screen.v.facebookId+'&redirect_uri='+redirectUrl;
                          location.href = url;
                      } else if (sns == 'naver') {
                          let url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id='+screen.v.naverId+'&state=STRING&redirect_uri='+redirectUrl;
                          location.href = url;
                      } else if (sns == 'google') {
                          let url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+screen.v.googleId+'&redirect_uri='+redirectUrl+'&response_type=code&scope=email profile';
                          location.href = url
                      } else if (sns == 'iamteacher') {
                          let encoRedirect = encodeURIComponent(redirectUrl);
                          let encoState = encodeURIComponent(state)
                          let url = screen.v.nhnServerDomain+'/oauth/authorize?client_id='+screen.v.nhnId+'&scope=teacher.profile+teacher.school&response_type=code&redirect_uri='+encoRedirect+'&state='+encoState;
                          location.href = url;
                      } else if (sns == 'whale') {
                          let url = 'https://auth.whalespace.io/oauth2/v1.1/authorize?client_id='+screen.v.whalespaceId+'&response_type=code&redirect_uri='+redirectUrl;
                          location.href = url
                      } else {
                          $alert.alert('Faild Your Login Type ::: ' + sns);
                      }
                  } else {
                      alert(result.dispMessage)
                  }
              },
              error:function(result){
                  alert("실패하였습니다.");
              }
          });


      },

      goSignUpPage: ()=> {
        location.href = '/pages/common/User/Join.mrn?redirectURI=' + encodeURIComponent(screen.v.serviceDomain + '/' + screen.v.redirectUri);
      },

    },

    event: function () {
      // 변수 값 할당
      screen.f.setValue();
      // 쿠키에서 아이디 불러오기
      screen.f.getCookie();

      // 로그인 버튼 클릭
      $(document).on('keypress', '#user-id, #user-pw', screen.f.keyPress);
      // 스페이스 입력 차단
      $(document).on('keyup', '#user-id, #user-pw', function(e){
        let value = $(e.target).val();
        value = value.replace(/\ /gi, '');
        $(e.target).val(value);
      });
      $(document).on('click', '#btn-login', screen.f.login);
      $(document).on('click', '.btn-sns-login', function (e) {
        let sns = e.target.dataset.snsType;
        screen.f.snsLogin(sns);
      });

      // 회원가입 페이지로 이동
      $(document).on('click', '#go-signup-page', screen.f.goSignUpPage);

    },

    init: function () {
      console.log('login js init!');
      screen.event();
      },
    };
  screen.init();
});