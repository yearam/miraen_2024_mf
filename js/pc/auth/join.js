$(function () {
  let screen = {
    v: {
      agreeArr: [],
      validaionArr: ['user-name', 'user-id', 'user-email', 'user-password', 'user-password-confirm', 'yy', 'mm', 'dd'],
      pattern1: /[0-9]/, //숫자
      pattern2: /[a-zA-Z]/, //영어
      pattern3: /[`~!@#$%^&*|\\\'\";:\/(){}?]/gi, //특수문자
      pattern4: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, //한글
      timer: null,
      redirectHost: null,
      serviceDomain: null,
      redirectUrl: null,
      redirectUri: null,
      kakaoId: null,
      facebookId: null,
      naverId: null,
      nhnId: null,
      nhnServerDomain: null,
      whalespaceId: null,
      googleId: null,
      schoolSeq: '',
      schoolName: '',
      teacherLevel: 'member', // 교사: member, 예비교사: pre
      schoolLevel: '',
      schoolType: '',
      schoolLevelName: '',
      schoolRequest: 'N',
      selectSchoolYn: false, // 학교 정보 선택 여부 값
      schoolAddress: '',
      detailAddressYn: 'N',
      textbookArr: [],
      fileInfo: [],
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

      /*공통*/
      // 단계 이동 버튼 제어
      stepBtn: (e)=> {
        let step = $(e.target).data('step');        // 현재 단계
        let btnStep = $(e.target).data('btn-step'); // 작동할 단계
        let openId = 'step' + btnStep;

        // validation step 1
        if (step === 1) {
          if (!screen.v.agreeArr.includes(1) || !screen.v.agreeArr.includes(2)) {
            $alert.alert('필수 동의 항목을 확인해 주세요.')
            return false;
          }
        }

        screen.f.setStep(openId);
        screen.f.setChapter(btnStep);

        $( 'html, body' ).animate( { scrollTop : 0 }, 400 );
      },

      backBtnMobile: (e) => {
        let btnStep = '';
        $('.signin-chapter').find('div.chapter').each(function() {
          if ($(this).hasClass('active') === true) { // 1 ~ 4 step 표시창 중 active된 것
            btnStep = $(this).data('step');
            if (btnStep === 2) { // 1, 2 step -> 1 step back
              btnStep = 1;
            } else if (btnStep >= 3) { // 3, 4 step -> 2 step back
              btnStep = 2;
            }
          }
        });
        if (btnStep) {
          btnStep = parseInt('-' + btnStep.toString());
          window.history.go(btnStep);
        }
      },

      setStep: (openId)=> {
        $('.step').each(function() {
          $(this).addClass('display-hide');

          let id = $(this).attr('id');
          if (id === openId) {
            $(this).removeClass('display-hide');

            if (openId == 'step1') {
              $('.wrapper.members').removeClass('size-narrow');
            } else {
              $('.wrapper.members').addClass('size-narrow');
            }
          }
        });
      },

      setChapter: (btnStep)=> {
        $('.chapter').each(function() {
          $(this).removeClass('active');

          let step = $(this).data('step');
          if (step === btnStep) {
            $(this).addClass('active');
          }
        });
      },

      // 인증 초기화
      setCertInit: (type) => {
        $('#certType').val('');
        $('#codeCertify').val('');
        $('#mailCertify').val('');
        $('#certNo').val('');
        $('.teacher-cert-method').removeClass('active');

        if (type != 'file') {
          $('input[name=fileNm]').val('');
          screen.v.fileInfo = [];
        }
      },

      // 인증 나중에하기 체크박스 클릭 시
      certLater: (e)=> {
        let id = e.target.id;
        if ($('#'+id).prop('checked')) {
          $alert.alert('교사인증이 완료되지 않으면 사이트 이용이 제한 될 수 있습니다.')
        }

        screen.f.setCertInit();
      },

      // 로그인페이지로 이동(리다이렉트 정보)
      goRedirect: ()=> {
        if (screen.v.redirectUri == null) {
          location.href='/pages/common/User/Login.mrn';
        } else {
          location.href='/pages/common/User/Login.mrn?redirectURI='+ encodeURIComponent(screen.v.serviceDomain + '/' + screen.v.redirectUri);
        }
      },

      // 해당 홈으로 이동
      goHome: ()=> {
        location.href = screen.v.redirectHost;
      },

      /*약관 체크박스 제어*/
      // 전체 동의하기 클릭 시
      checkAgreeAll: (e)=> {
        screen.v.agreeArr = [];
        if ($('#agree-all').is(':checked')) {
          $('.tm-cb').each(function() {
            let thisAgreeNo = $(this).data('agree-no');
            screen.v.agreeArr.push(thisAgreeNo);
            $(this).prop('checked', true);
          });
        } else {
          $('.tm-cb').prop('checked', false);
        }
      },

      // 각 체크박스 클릭 시
      checkAgree: (e)=> {
        screen.v.agreeArr = [];

        $('.tm-cb').each(function() {
          let thisAgreeNo = $(this).data('agree-no');
          if ($(this).prop("checked")) {
            screen.v.agreeArr.push(thisAgreeNo);
          }
        });

        if (screen.v.agreeArr.length == $('.tm-cb').length) {
          $('#agree-all').prop('checked', true);
        } else {
          $('#agree-all').prop('checked', false);
        }
      },
    },

    event: function () {
      // 변수 값 할당
      screen.f.setValue();

      /*공통*/
      // 단계 이동 버튼 제어
      $(document).on('click', '.step-button', screen.f.stepBtn);
      // 모바일 뒤로가기 버튼 제어
      $(document).on('click', '.back-button-mobile', screen.f.backBtnMobile);
      $(document).on('click', '.go-login', screen.f.goRedirect);
      $(document).on('click', '.go-home', screen.f.goHome);

      // 인증 나중에하기 체크박스 클릭 시
      $(document).on('click', '#certTeacherLaterYn, #certLaterYn', screen.f.certLater);


      /*약관 체크박스 제어*/
      // 전체 동의하기 클릭 시
      $(document).on('click', '#agree-all', screen.f.checkAgreeAll);
      // 각 체크박스 클릭 시
      $(document).on('click', '.tm-cb', screen.f.checkAgree);

      $(document).on('keypress', '#joinName, #user-name', function (){
        let kcode = event.keyCode;
        if (kcode == 32) event.returnValue = false;
      });
    },

    init: function () {
      console.log('join js init!');
      $('.button-clear').trigger('click'); // 초기화
      screen.event();
		},
    };
  screen.init();
});