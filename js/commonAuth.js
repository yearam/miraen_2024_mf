$(function () {
  let screen = {
    v: {
      agreeArr: [],
      validaionArr: ['user-name', 'user-id', 'user-email', 'user-password', 'user-password-confirm', 'yy', 'mm', 'dd'],
      pattern1: /[0-9]/, //숫자
      pattern2: /[a-zA-Z]/, //영어
      pattern3: /[`~!@#$%^&*|\\\'\";:\/(){}?]/i, //특수문자
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
      schoolTypeName: '',
      schoolRequest: 'N',
      selectSchoolYn: false, // 학교 정보 선택 여부 값
      schoolAddress: '',
      detailAddressYn: 'N',
      textbookArr: [],
      fileInfo: [],
      smsCertProgress: false,
      mailCertProgress: false
    },

    c: {
      /*모달*/
      searchSchool: (e)=> {
        if ($('#searchKeyword').val() == '') {
          $alert.alert('검색어를 입력해주세요.');
          return;
        }

        // 로딩바
        $('#loading').addClass("display-show");

        // 초기화
        $('#school-list').empty();

        $('.tab-btn').each(function () {
          if ($(this).hasClass('active') && !$(this).hasClass('display-hide')) {
            let idx = $(this).index();
            if (idx == 0) screen.v.teacherLevel = 'member';
            if (idx == 1) screen.v.teacherLevel = 'pre';
          }
        });

        $.ajax({
          type : 'post',
          url : '/User/SearchSchool.ax',
          data : {"searchKeyword" : $('#searchKeyword').val(), "teacherLevel":screen.v.teacherLevel},
          success: function(result) {
            if (result.status == 'succ') {
              console.log(result)
              let list = result.schoolList;
              let html = '';
              if (list.length == 0) {
                screen.v.schoolRequest = 'Y';
                html += '<div class="box-no-data">';
                html += '<p class="text-black">검색 결과가 없습니다.</p>';
                html += '<p class="margin-top-md"> 학교 검색이 안되는 경우 학교명과 주소를 입력해주세요.<br /> 담당자 확인 후 학교 등록을 해드립니다. </p>';
                html += '</div>';
                html += '<hr class="no-margin" />';
                html += '<div class="forms margin-top-xl">';
                html += '<label for="school-name" class="text-black">학교명</label>';
                html += '<fieldset>';
                html += '<input class="size-xl" type="text" title="학교명 입력란" name="" id="school-name" placeholder="학교명을 입력해 주세요." />';
                html += '<span class="caution">오류 메시지 나타납니다.</span>';
                html += '</fieldset>';
                html += '</div>';
                html += '<div class="forms">';
                html += '<label for="school-address" class="text-black">학교 주소</label>';
                html += '<fieldset>';
                html += '<button type="button" class="button size-xl type-gray" onclick="findAddr(\'1\')">주소검색</button>';
                html += '<input class="size-xl" type="hidden" title="우편번호" name="" id="member_post-1" disabled/>';
                html += '<input class="size-xl" type="text" title="학교 주소 입력란" name="" id="address1-1" placeholder="주소를 검색해 주세요." disabled/>';
                html += '</fieldset>';
                html += '<fieldset>';
                html += '<input class="size-xl" type="text" title="상세 주소 입력란" name="" id="address2-1" placeholder="상세 주소를 입력해 주세요." />';
                html += '</fieldset>';
                html += '<span class="ox margin-top-md">';
                html += '<input type="checkbox" id="detail-address-yn"/>';
                html += '<label for="detail-address-yn" class="no-margin">상세 주소 없음</label>';
                html += '</span>';
                html += '</div>';
              } else {
                screen.v.schoolRequest = 'N';
                html += '<p class="margin-top-xl">등록을 원하시는 학교를 선택해주세요.</p>';
                html += '<div class="buttons gutter-md margin-top-md">';
                for (let i=0; i<list.length; i++) {
                  let item = list[i];
                  html += '<button type="button" class="block-button school-select" data-type-name="'+item.schoolTypeName+'" data-type="'+item.schoolType+'" data-seq="'+item.schoolSeq+'" data-name="'+item.name+'" data-level="'+item.schoolLevel+'" data-level-name="'+item.schoolLevelName+'" data-address="'+item.address+'">';
                  html += '<ul class="divider-group text-black">';
                  html += '<li>'+item.name+'</li>';
                  if (item.schoolLevelName == '기타') {
                    html += '';
                  } else {
                    html += '<li>'+item.schoolLevelName+'</li>';
                  }
                  html += '</ul>';
                  html += '<span class="margin-top-xs">'+item.address+'</span>'
                  html += '</button>';
                }
                html += '</div>';
              }
              $('#school-list').append(html);
              $('#loading').removeClass("display-show");
            } else {
              alert(result.dispMessage)
            }
          },
          error: function(result) {
            console.log('오류 발생')
          }
        })
      },
      getTextbook: (e)=> {
        if (e.target.classList.contains('T04-textbook')) {
          return false;
        }

        // 초기화
        $('.T04-textbook').empty();
        $('.T04-textbook').attr('disabled', true);

        let subjectCd = e.target.value;
        if (subjectCd != '' && subjectCd != null) {
          $.ajax({
            type : 'post',
            url : '/User/GetTextbook.ax',
            data : {"subjectCd" : subjectCd, "schoolLevel" : screen.v.schoolLevel},
            success: function(result) {
              if (result.status == 'succ') {
                console.log(subjectCd)
                console.log(result.textbookList)
                let list = result.textbookList;
                let html = '';
                for (let i=0; i<list.length; i++) {
                  let textbookSeq = list[i].masterSeq;
                  if (screen.v.textbookArr.includes(String(textbookSeq))) {
                    html += '<option disabled value='+textbookSeq+'>'+list[i].textbookName+'('+list[i].leadAuthorName+')</option>';
                  } else {
                    html += '<option value='+textbookSeq+'>'+list[i].textbookName+'('+list[i].leadAuthorName+')</option>';
                  }

                }

                let reqClassNm = 'school-request-'+screen.v.schoolRequest;
                let levelClassNm = 'school-mid';
                if (screen.v.schoolLevel == 'HIGH') levelClassNm = 'school-high';
                if (screen.v.schoolType == 'ETC') {
                  $('.'+reqClassNm+' .school-etc .'+levelClassNm+' .T04-textbook').append(html);
                  $('.'+reqClassNm+' .school-etc .'+levelClassNm+' .T04-textbook').attr('disabled', false);
                } else {
                  $('.'+reqClassNm+' .'+levelClassNm+' .T04-textbook').append(html);
                  $('.'+reqClassNm+' .'+levelClassNm+' .T04-textbook').attr('disabled', false);
                }

              } else {
                alert(result.dispMessage)
              }
            },
            error: function(result) {
              console.log('오류 발생')
            }
          })
        }
      },


      /*회원가입*/
      // 일반
      signUp: ()=> {
        let confirmFlag = true;
        let certTeacherYn = false;

        // 초기화
        $('fieldset').each(function () {
          $(this).removeClass('flag-error');
        });

        // [1] 필수값 체크
        // [1-1] 전체 입력란 기입 여부 chk
        for (let i=0; i<screen.v.validaionArr.length; i++) {
          let ele = $("#step3 input[id=" + screen.v.validaionArr[i] + "]");
          let val = ele.val();
          let id = ele.attr('id');

          if (val == "") {
            screen.f.setErrorMsg(id, 0, 400, '필수 입력 사항입니다.', true)
            confirmFlag = false;
            return;
          }
        }
        // [1-2] 입력란 형식 chk
        if (confirmFlag) {
          // 이름 chk
          if (!screen.f.nameLengthChk(true)) {
            confirmFlag = false;
            return;
          }

          // 아이디/이메일 형식 chk
          if (!screen.f.idEmailFormChk('user-id', true)) {
            confirmFlag = false;
            return;
          }

          // 이메일 형식 chk
          if (screen.f.emailAtChk(true)) {
            if (!screen.f.idEmailFormChk('user-email', true)) {
              confirmFlag = false;
              return;
            }
          }

          // 비밀번호 형식 chk
          if (!screen.f.passwordFormChk(true)) {
            confirmFlag = false;
            return;
          }

          // 비밀번호 일치여부 확인
          if (!screen.f.passwordMatchChk(true)) {
            confirmFlag = false;
            return;
          }

          // 휴대폰 인증 chk
          if ($('#step3 #certHpYn').val() == 'N') {
            $( 'html, body' ).animate( { scrollTop : 400 }, 400 );
            $('#step3 #Mobile1').parents('fieldset').addClass('flag-error');
            confirmFlag = false;
            return;
          }
        }

        // [2] 교사인증 여부 체크
        if (screen.v.teacherLevel == 'member') {
          if ($('#certTeacherLaterYn').prop('checked')) {
            certTeacherYn = true;
            $('#step3 input[name=certTeacherLaterYn]').val('Y');
          } else {
            let activeCnt = 0;
            $('.teacher-cert-method').each(function() {
              if ($(this).hasClass('active')) {
                activeCnt++;
              }
            });
            if (activeCnt > 0 && $('#certType').val() != '') {
              certTeacherYn = true;
            }
          }
        } else {
          if ($('#certLaterYn').prop('checked')) {
            certTeacherYn = true;
            $('#step3 input[name=certTeacherLaterYn]').val('Y');
          } else {
            if ($('#step3 input[name=fileNm]').val() != '') {
              certTeacherYn = true;
            }
          }
        }
        if (!certTeacherYn) {
          $alert.alert('필수 입력 항목을 확인해 주세요.')
          $( 'html, body' ).animate( { scrollTop : 1200 }, 400 );
          confirmFlag = false;
          return;
        }

        // [3] 학교정보 입력 여부 체크(필수값 아님) 및 입력값 데이터 세팅
        // [3-1] 학교정보 선택/입력 시 담임/과목/직위 필수값 체크
        if (screen.v.selectSchoolYn) {
          // 학교 정보 선택 여부 -> 선택함
          $('#step3 input[name=selectSchoolYn]').val('Y');

          if (screen.v.teacherLevel == 'member') {
            let reqClassNm = 'school-request-'+screen.v.schoolRequest;
            let levelClassNm = 'school-mid';
            if (screen.v.schoolLevel == 'HIGH') levelClassNm = 'school-high';
            let typeClassNm = 'school-ele';
            if (screen.v.schoolType == 'ETC') {
              typeClassNm = 'school-etc'
            }
            let t05 = $('.'+reqClassNm+' .'+typeClassNm+' [name="regRadio"][value="T05"]').prop('checked');
            let t04 = $('.'+reqClassNm+' .'+typeClassNm+' [name="regRadio"][value="T04"]').prop('checked');
            let u04 = $('.'+reqClassNm+' .'+typeClassNm+' [name="regRadio"][value="U04"]').prop('checked');
            if (screen.v.schoolLevel == 'ELEMENT') {
              if (!t05 && !t04 && !u04) {
                $alert.alert('학교급 구분을 선택해 주세요.')
                confirmFlag = false;
                return;
              }
            }

            // [3-2] 학교 정보 입력값 데이터 세팅
            // 검색 시 학교 있을 경우 -> schoolSeq에 seq 담아서 감
            // 검색 시 학교 없을 경우 초/중/고(school level)값 별도 세팅
            if ($('#step3 input[name=schoolSeq]').val() == "") {
              $('#step3 input[name=schoolLevel]').val(screen.v.schoolLevel)
            }

            // 초/중고등 담임/과목/직위 or 교과서 정보 세팅
            if (screen.v.schoolLevel == 'ELEMENT') { // 초등
              if (t05) {
                $('#step3 [name=homeroomTeacherGrade]').val($('.'+reqClassNm+' .'+typeClassNm+' [name="T05"]').val());
              } else if (t04) {
                $('#step3 [name=dedicatedTeacherSubject]').val($('.'+reqClassNm+' .'+typeClassNm+' [name="T04"]').val());
              } else if (u04) {
                $('#step3 [name=etcTeacherType]').val($('.'+reqClassNm+' .'+typeClassNm+' [name="U04"]').val());
              } else {
                $alert.alert('학교급 구분을 선택해 주세요.')
                confirmFlag = false;
              }
            } else { // 중고등
              let textbookSeq = '';
              $.each($('.'+reqClassNm+' .'+levelClassNm+' [id^="tbs"]'), function() {
                let seq = $(this).attr('id').split('-')[1];
                if (textbookSeq == '') {
                  textbookSeq = seq;
                } else {
                  textbookSeq = textbookSeq + ',' + seq;
                }
              });
              if (levelClassNm == 'school-mid') {
                $('#step3 [name=midTextbookSeq]').val(textbookSeq);
              } else {
                $('#step3 [name=highTextbookSeq]').val(textbookSeq);
              }

              // 교과서 등록 없을 시에도 가입 되도록 함
              /*if (textbookSeq == '') {
                confirmFlag = false;
              }*/
            }
          }
        }

        // [4] 가입진행
        if (confirmFlag != false) {
          // [3-1] 파라미터 세팅
          $('input[id="birth').val($('select[id="yy').val()+$('select[id="mm').val()+$('select[id="dd').val());
          $('input[name=schoolRequest]').val(screen.v.schoolRequest)
          $('input[name=schoolLevel]').val(screen.v.schoolLevel)
          $('input[name=teacherLevel]').val(screen.v.teacherLevel)

          // 동의 항목 세팅
          $('.tm-cb').each(function() {
            let thisAgreeNo = $(this).data('agree-no');
            if ($(this).prop("checked")) {
              screen.v.agreeArr.push(thisAgreeNo);
            }
          });

          $('input[name=agreeSel]').val(screen.v.agreeArr.includes(3) ? 'Y':'N')
          $('input[name=emailReceiveFlag]').val(screen.v.agreeArr.includes(4) ? 'Y':'N')
          $('input[name=smsReceiveFlag]').val(screen.v.agreeArr.includes(5) ? 'Y':'N')

          // [3-2] 파라미터 데이터 세팅
          let data = $cmm.serializeJsonAll($('#step3'));
          let formData = new FormData();
          formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));
          if (screen.v.fileInfo.length > 0) {
            let list = screen.v.fileInfo;
            list.map((v) => {
              formData.append('file', v);
            })

            formData.append('directoryCode', 'USER');
            formData.append('fileType', '');
            formData.append('uploadMethod', '');
            formData.append('displayName', '');
          }

          // [3-3] 가입 진행
          $.ajax({
            type:"POST",
            data:formData,
            contentType: false,
            processData: false,
            url:"/User/JoinProc.ax",

            /* 전송 후 세팅 */
            success: function(res) {
              if(res.status == "succ"){
                screen.f.setStep('step4');
                screen.f.setChapter(4);
                $('#step4 .name').text(res.name);
              } else {
                alert(res.dispMessage);
              }
            },
            error: function() { //시스템에러
              alert("오류발생");
            }
          });
        }
      },

      // sns
      signUpSns: (e)=> {
        let sns = e.target.dataset.sns;

        $('#joinMethodCd').val(sns);
        let joinName = $('#joinName').val();
        if (joinName.length < 2) {
          $('#joinName').parents('fieldset').addClass('flag-error');
          $('#joinName').parents('fieldset').children('caution').text('* 최소 2자 이상 입력 해주세요.');
          return ;
        } else
        if (joinName == '') {
          $('#joinName').parents('fieldset').addClass('flag-error');
          $('#joinName').parents('fieldset').children('caution').text('* 필수 입력 사항입니다.');
          return ;
        }

        let certHpYn = $('#step2 #certHpYn').val();
        if (certHpYn == 'N') {
          $('#step2 #Mobile1').parents('fieldset').addClass('flag-error');
          return ;
        }

        // 동의 항목 세팅
        $('.tm-cb').each(function() {
          let thisAgreeNo = $(this).data('agree-no');
          if ($(this).prop("checked")) {
            screen.v.agreeArr.push(thisAgreeNo);
          }
        });

        let agreePolicy = screen.v.agreeArr.includes(3) ? 'Y':'N';
        let agreeMail = screen.v.agreeArr.includes(4) ? 'Y':'N';
        let agreeMsg = screen.v.agreeArr.includes(5) ? 'Y':'N';
        let state = 'YY'+agreePolicy+agreeMail+agreeMsg;
        state += ":" + joinName;

        $.ajax({
          url:'/User/SaveAgreeStateSession',
          type : "post",
          cache : false,
          dataType : "json",
          data : {"state":'JOIN:'+state, "snsCd" : sns, "redirectUrl" : screen.v.redirectUrl, "redirectUri" : screen.v.redirectUri},
          success:function(result){
            console.log(result)
            if (result.status == 'succ') {
              // step1 초기화
              $('.wrapper.members').removeClass('size-narrow');
              screen.v.agreeArr = [];
              $('#step1 input[type=checkbox]').each(function () {
                if ($(this).prop('checked')) {
                  $(this).prop('checked', false);
                }
              });

              // step2 초기화
              $('#step2 #joinName').val('');
              $('#step2 #Mobile1').val('');
              $('#step2 #smsCertNum').val('');
              $('#step2 #certHpYn').val('N');

              let redirectUrl = screen.v.serviceDomain + '/User/SnsJoin.mrn';
              if (sns == 'kakao') {
                let url = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+screen.v.kakaoId+'&redirect_uri='+redirectUrl;
                location.href = url;
              } else if (sns == 'facebook') {
                let url = 'https://www.facebook.com/v3.2/dialog/oauth?client_id='+screen.v.facebookId+'&redirect_uri='+redirectUrl;
                location.href = url;
              } else if (sns == 'naver') {
                let url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id='+screen.v.naverId+'&state=STRING&redirect_uri='+redirectUrl;
                location.href = url;
              } else if (sns == 'google') {
                let url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+screen.v.googleId+'&redirect_uri='+redirectUrl+'&response_type=code&scope=email profile';
                location.href = url;
              } else if (sns == 'iamteacher') {
                let encoRedirect = encodeURIComponent(redirectUrl);
                let url = screen.v.nhnServerDomain+'/oauth/authorize?client_id='+screen.v.nhnId+'&scope=teacher.profile+teacher.school&response_type=code&redirect_uri='+encoRedirect;
                location.href = url;
              } else if (sns == 'whale') {
                let url = 'https://auth.whalespace.io/oauth2/v1.1/authorize?client_id='+screen.v.whalespaceId+'&response_type=code&redirect_uri='+redirectUrl+'&state=JOIN:'+state;
                location.href = url
              } else {
                $alert.alert('Faild Your Join Type. ['+$('#joinMethodCd').val()+ ']');
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

      /*인증 관련*/
      // GPKI/EPKI 인증
      gpkiCert: (e)=> {
        let signedText = document.frm.signedText.value;
        $.post("/pages/api/sendCert.ax", {
          signedText : signedText
        }, function(jsonObj) {
          if (jsonObj.resultCode == '0000') {
            alert("정상적으로 인증되었습니다.");
            screen.f.setCertBlock('key');
            $('#certNo').val(jsonObj.certNo);
            $('#certType').val("1");
          } else {
            alert("인증 오류 입니다.");
          }
        }, "json");
      },

      // 메일 인증요청 버튼 클릭
      callMailiCert: (e)=> {
        if (screen.v.smsCertProgress) {
          $alert.alert('진행 중인 인증이 있습니다. 인증 완료 혹은 시간만료 후에 다른 인증이 가능 합니다.');
          return;
        }

        // 초기화
        $('#popup-authentication-mail .cert-area').addClass('display-hide');
        $('#popup-authentication-mail .cert-area input').val('');
        $('#popup-authentication-mail .cert-area button').attr('disabled', false);
        $('#popup-authentication-mail .cert-area input').attr('readonly', false);

        let email1 = $("#forms1");
        let email2 = $("#forms2");

        if (!$.trim(email1.val())) {
          alert("메일 주소를 입력하세요.");
          email1.focus();
          return false;
        }

        if (!$.trim(email2.val())) {
          alert("메일 주소를 입력하세요.");
          email2.focus();
          return false;
        }

        var email = email1.val() + '@' + email2.val();

        $.post("/pages/api/sendMail.ax", {
          email : email
        }, function(jsonObj) {
          if (jsonObj.result == 'OK') {
            alert("인증코드가 발송 되었습니다.");
            screen.f.countdown("timeout", 5, 0, 4);
            $('#popup-authentication-mail .message-info').removeClass('display-hide');
            $('#popup-authentication-mail .cert-area').removeClass('display-hide');
            $('#popup-authentication-mail .cert-req-area button').text('재요청');
            screen.v.mailCertProgress = true;
          } else {
            alert("인증코드 발송오류!");
          }
        }, "json");
      },

      // 휴대폰 인증번호 요청
      callMobileCert: (e)=> {
        if (screen.v.mailCertProgress) {
          $alert.alert('진행 중인 인증이 있습니다. 인증 완료 혹은 시간만료 후에 다른 인증이 가능 합니다.');
          return;
        }

        let errorMag = '휴대전화번호가 유효하지 않습니다.';
        let stepNo = e.target.dataset.paramNo;
        $('#step'+stepNo+' #certHpYn').val("N");

        if($('#step'+stepNo+' #Mobile1').val() == '') {
          $alert.alert(errorMag);
          return;
        } else if($('#step'+stepNo+' #Mobile1').val().length <= 10) {
          $alert.alert(errorMag);
          return;
        }
        var secMobile = $('#step'+stepNo+' #Mobile1').val();

        $.ajax({
          url:"/User/GetPhoneCertNum_Json.ax",
          type : "post",
          cache : false,
          dataType : "json",
          data : {"secMobile":secMobile},
          success:function(jsonObj){

            if (jsonObj.result == 'OK') {
              $alert.alert('인증번호를 발송했습니다.');
              $('#step'+stepNo+' .smsCertNumFieldset').removeClass('display-hide');
              screen.f.dispMessageBox($('#'+stepNo+' #Mobile1'), "");
              screen.f.countdown( 'timeout', 3, 0, stepNo);
              $('#step'+stepNo+' .message-info').removeClass('display-hide');
              $('#step'+stepNo+' #smsCertNum').val('');
              $('#step'+stepNo+' #smsCertNum').parents('fieldset').removeClass('flag-error');
              $('#step'+stepNo+' .certBtn').text('재요청');
              $('#smsCertNum').attr('placeholder', '인증번호를 입력해 주세요');
              $('#certMailNum').attr('placeholder', '인증번호를 입력해 주세요');
              screen.v.smsCertProgress = true;

              // 시간이 만료 되어 있을수도 있음
              $('.smsCertNumFieldset #smsCertNum').attr('disabled', false);
              $('.smsCertNumFieldset .button').attr('disabled', false);
              $('.smsCertNumFieldset #smsCertNum').attr('readonly', false);
            } else {
              $alert.alert(jsonObj.dispMessage);
            }

          },
          error:function(json){
            alert("실패하였습니다.");
          }
        });
      },

      // 인증번호 확인 - certType: 휴대폰(sms), 이메일(email)
      checkCertAjax: (certType, certNum)=> {
        let result = '';
        $.ajax({
          url:"/User/CheckCertNum_Json.ax",
          type : "post",
          async: false,
          cache : false,
          dataType : "json",
          data : {"certNum":certNum, "certType":certType},
          success:function(jsonObj){
            result = jsonObj.result;
          },
          error:function(json){
            alert("실패하였습니다.");
          }
        });
        return result;
      },

      // 코드 인증요청 버튼 클릭
      checkCodeCert: (e)=> {
        let code = $("#certCode").val();

        if (!$.trim(code)) {
          $alert.alert("코드를 입력하세요..");
          code.focus();
          return false;
        }

        $.ajax({
          url:"/User/CheckCertCode_Json.ax",
          type : "post",
          cache : false,
          dataType : "json",
          data : {"code":code},
          success:function(jsonObj){
            if (jsonObj.result == 'OK') {
              $alert.alert('정상적으로 인증되었습니다.');
              screen.f.setCertBlock('code');
              $('#certType').val('C');
              $('#codeCertify').val(code);
              $('#popup-authentication-code .close-button').trigger('click');
            } else {
              $alert.alert('인증코드가 유효하지 않습니다.');
            }
          },
          error:function(json){
            alert("실패하였습니다.");
          }
        });
      },

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

      // 휴대폰 인증번호 확인
      checkMobileCert: (e)=> {
        let errorMag = '인증번호가 유효하지 않습니다.';
        let stepNo = e.target.dataset.paramNo;
        if($('#step'+stepNo+' #smsCertNum').val() == '') {
          $alert.alert(errorMag);
          $('#step'+stepNo+' #smsCertNum').focus();
          return;
        }
        var certNum = $('#step'+stepNo+' #smsCertNum').val();

        let result = screen.c.checkCertAjax('sms', certNum);
        if (result == 'OK') {
          $('#step'+stepNo+' #certHpYn').val("Y");

          // $('#step'+stepNo+' #Mobile1').attr("readonly", true);
          clearTimeout(screen.v.timer);
          $alert.alert("정상적으로 인증되었습니다.");
          $('.smsCertNumFieldset').addClass('display-hide');
          screen.f.dispMessageBoxSuccess($('#step'+stepNo+' #Mobile1'), "휴대폰 인증이 완료되었습니다.");
          $('#step'+stepNo+' #timeout').html("");
          $('#step'+stepNo+' .message-info').addClass('display-hide');
          $('#step'+stepNo+' #Mobile1').parents('fieldset').removeClass('flag-error');
          $('#step'+stepNo+' .succ-box').removeClass('flag-error');
          screen.v.smsCertProgress = false;
        } else {
          $('#step'+stepNo+' #certHpYn').val("N");
          $alert.alert(errorMag);
        }
      },

      // 이메일 인증번호 확인
      checkEmailiCert: (e)=> {
        let errorMag = '인증번호가 유효하지 않습니다.';
        if($('#popup-authentication-mail #certMailNum').val() == '') {
          $alert.alert(errorMag);
          $('#popup-authentication-mail #certMailNum').focus();
          return;
        }
        var certNum = $('#popup-authentication-mail #certMailNum').val();

        let result = screen.c.checkCertAjax('email', certNum);
        if (result == 'OK') {
          $alert.alert("정상적으로 인증되었습니다.");
          screen.f.setCertBlock('mail');
          $('#certType').val('E');
          $('#mailCertify').val(certNum); // certEmail hidden 생성 후 값 넣기
          $('#popup-authentication-mail .close-button').trigger('click');
          $('#popup-authentication-mail .cert-area button').removeClass('display-hide');
          screen.v.mailCertProgress = false;
        } else {
          $alert.alert(errorMag);
        }
      },

      // 서류 첨부 시 저장
      saveCertFile: (e)=> {
        let file = e.currentTarget.files[0];
        let fileNm = e.currentTarget.files[0].name;
        // type 확인
        let fileDot = fileNm.lastIndexOf('.');
        let fileType = fileNm.substring(fileDot+1, fileNm.length).toLowerCase();
        if($.inArray(fileType, ['hwp' , 'pdf', 'jpg']) == -1) {
          $alert.alert(fileType+' 파일은 업로드 하실 수 없습니다. 첨부 가능한 확장자를 확인해 주세요.');
          $('.file-del-btn').trigger('click');
          return;
        } else {
          // 초기화
          screen.v.fileInfo = [];

          // 파일 배열에 담기
          $('input[type=hidden][name=fileNm]').val(fileNm);

          let reader = new FileReader();
          reader.onload = function () {
            screen.v.fileInfo.push(file);
            $('#certType').val('2');
            if (screen.v.teacherLevel == 'pre') $('#certType').val('P');
          };
          reader.readAsDataURL(file);
        }

      },

      // 첨부파일 삭제
      delCertFile: (e)=> {
        screen.v.fileInfo = [];
        e.target.previousElementSibling.value = '';
        $('#certType').val('');
        $('.teacher-cert-method.cert-file').removeClass('active');
      }, 
      
      // 서류 첨부 후 확인 버튼 클릭 - 교사
      setFileView: (e)=> {
        if (screen.v.fileInfo.length == 0) {
          $alert.alert('첨부된 파일이 없습니다.')
        } else {
          if (screen.v.teacherLevel) { // 교사회원의 경우만
            screen.f.setCertBlock('file')
            $('#certType').val('2');
            $('#popup-certify-papers .close-button').trigger('click');
          }
        }
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

      // 인증성공 시 화면제어
      setCertBlock: (type)=> {
        // 초기화
        screen.f.setCertInit(type);
        
        // 해당 인증건 처리
        let activeClass = '.teacher-cert-method.cert-'+type;
        $(activeClass).addClass('active');
      },

      // 인증 화면제어 관련 함수
      dispMessageBox: (obj, message)=> {
        if (message == '') {
          $(obj).parent().removeClass("succ-box");
          $(obj).parent().removeClass("warn-box");
          $(obj).parent().find("p").html(message);
        } else {
          $(obj).parent().removeClass("succ-box");
          $(obj).parent().addClass("warn-box");
          $(obj).parent().find("p").html(message);
        }
      },
      dispMessageBoxSuccess: (obj, message)=> {
        if (message == '') {
          $(obj).parent().removeClass("succ-box");
          $(obj).parent().removeClass("warn-box");
          $(obj).parent().find("p").html(message);
        } else {
          $(obj).parent().removeClass("warn-box");
          $(obj).parent().addClass("succ-box");
          $(obj).parent().find("p").html(message);
        }
      },
      countdown: (elementName, minutes, seconds, no)=> {
        var element, endTime, hours, mins, msLeft, time;
        elementName = elementName+no;

        clearTimeout(screen.v.timer);

        function twoDigits( n )
        {
          return (n <= 9 ? "0" + n : n);
        }

        function updateTimer()
        {
          msLeft = endTime - (+new Date);
          if ( msLeft < 1000 ) {
            element.innerHTML = "입력시간이 초과되었습니다.";
            if (no == 4) {
              $('#popup-authentication-mail .cert-area button').attr('disabled', true);
              $('#popup-authentication-mail .cert-area input').attr('readonly', true);

              $('.mailCertNumFieldset').addClass('flag-error');
              $('#certMailNum').attr('placeholder', '');
              screen.v.mailCertProgress = false;
            } else {
              $('#step'+no+' .smsCertNumFieldset .button').attr('disabled', true);
              $('#step'+no+' .smsCertNumFieldset #smsCertNum').attr('readonly', true);

              screen.f.dispMessageBox($("#step"+no+" #Mobile1"), "입력시간이 초과되었습니다.");
              $('#step'+no+' .smsCertNumFieldset').addClass('flag-error');
              $('#step'+no+' #smsCertNum').attr('placeholder', '');
              screen.v.smsCertProgress = false;
            }
            //$("#timeout").addClass("txt_time");

            clearTimeout(screen.v.timer);
          } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = '<span class="text-error">'+(hours ? hours + ':' + twoDigits( mins ) : mins) + '</span>분 <span class="text-error">' + twoDigits( time.getUTCSeconds() ) + "</span>초 이내 인증번호를 입력하세요";
            screen.v.timer = setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
          }
        }

        element = document.getElementById( elementName );
        endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
        updateTimer();
      },

      /*모달*/
      // 학교 검색 모달창 오픈 시 초기화 작업
      initSchoolModal: (e)=> {
        let teacherLevel = screen.v.teacherLevel;
        if (teacherLevel == 'member') {
          $('#school-list').empty();
          $('#searchKeyword').val('');
          $('#popup-search-school .header .title').text('학교 검색')
        } else if (teacherLevel == 'pre') {
          $('#school-list').empty();
          $('#searchKeyword').val('');
          $('#popup-search-school .header .title').text('재학중 학교 검색')
        }

      },

      setSchoolData: (e)=> {
        screen.v.schoolSeq = e.currentTarget.dataset.seq;
        screen.v.schoolName = e.currentTarget.dataset.name;
        screen.v.schoolLevel = e.currentTarget.dataset.level;
        screen.v.schoolLevelName = e.currentTarget.dataset.levelName;
        screen.v.schoolTypeName = e.currentTarget.dataset.typeName;
        screen.v.schoolAddress = e.currentTarget.dataset.address;

        // active 클래스 정리
        $('.school-select').each(function () {
          if ($(this).has('active')) {
            $(this).removeClass('active');
          }
        });
        e.currentTarget.className += ' active';
      },
      detailAddressYn: (e)=> {
        if ($(this).prop('checked')) {
          $('#address2').attr('disabled', true);
          screen.v.detailAddressYn = 'N';
        } else {
          $('#address2').attr('disabled', false);
          screen.v.detailAddressYn = 'Y';
        }
      },
      tabInit: (e)=> {
        $('[name="preTeacherDepartment"]').val('');
        $('[name="regRadio"]').prop('checked', false);
        $('.block-top-line select').val('').trigger("change");
        $('.T04-textbook').attr('disabled', true);
        $('.buttons.margin-top-md.textbook-add-area').empty();
        screen.v.textbookArr = [];
      },

      searchSchoolKeyPress: (e) => {
        if (e.keyCode == 13) {
          screen.c.searchSchool();
        }
      },

      selectSchool: (e)=> {
        let validation = true;
        screen.v.selectSchoolYn = false; // 학교 정보 선택 여부 값 초기화

        // 초기화
        $('[id^="step"] input[name=selectSchoolYn]').val('');
        $('[id^="step"] input[name=schoolSeq]').val('');
        $('[id^="step"] input[name=schoolLevel]').val('');
        $('[id^="step"] input[name=schoolName]').val('');
        $('[id^="step"] input[name=schoolAddress]').val('');
        $('[id^="step"] input[name=memberPost]').val(''); // 우편번호
        $('.school-data .school-name').text('');
        $('.school-data .schoolLA').text('');
        $('.school-data .school-level').text('');
        $('.school-data .school-address').text('');
        $('.school-request-Y').addClass('display-hide');
        $('.school-request-N').addClass('display-hide');
        $('.box-school-data').addClass('display-hide');
        // 탭 내용 전체 초기화
        screen.f.tabInit()

        if (screen.v.schoolRequest == 'Y') { // 검색결과 없음
          screen.v.schoolLevel = 'ETC'; // 학교급 초기화

          // validation
          if ($('#school-name').val() == '') {
            $alert.alert('학교 정보를 입력해 주세요.')
            validation = false;
            return false;
          }
          if ($('#address1-1').val() == '') {
            $alert.alert('학교, 학교 주소 정보를 입력해 주세요.')
            validation = false;
            return false;
          }
          if (!$('#detail-address-yn').prop('checked')) {
            if ($('#address2-1').val() == '') {
              $alert.alert('학교, 학교 주소 정보를 입력해 주세요.')
              validation = false;
              return false;
            }
          }

          // 등록대기중 버튼 세팅
          $('.reg-yn-btn').removeClass('display-hide');
          $('[id^="step"] input[name=schoolRequest]').val(screen.v.schoolRequest);
          $('[id^="step"] input[name=schoolSeq]').val(0);
          $('[id^="step"] input[name=schoolName]').val($('#school-name').val());
          $('[id^="step"] input[name=schoolLevel]').val('');
          $('[id^="step"] input[name=memberPost]').val($('#member_post-1').val());
          $('[id^="step"] input[name=schoolAddress]').val($('#address1-1').val());
          $('[id^="step"] input[name=schoolAddress2]').val($('#address2-1').val());
          $('[id^="step"] input[name=detailAddressYn]').val(screen.v.detailAddressYn);
          $('.school-data .school-name').text($('#school-name').val());
          $('.school-data .school-level').text('-');
          $('.school-data .school-address').text($('#address1-1').val() + ' ' + $('#address2-1').val());

          // schoolType
          screen.v.schoolType = 'NONE';
          $alert.alert('학교 등록 요청이 완료되었습니다. 학교 등록이 완료될 때까지 2~3일 정도 소요됩니다. ');
        } else { // 검색결과 있음
          // validation
          let activeCnt = 0;
          $('.school-select').each(function () {
            if ($(this).hasClass('active')) {
              activeCnt++;
            }
          });
          if (activeCnt < 1) {
            $alert.alert('학교를 선택 해 주세요.')
            validation = false;
            return false;
          }

          // 등록대기중 버튼 세팅
          $('.reg-yn-btn').addClass('display-hide');
          // 학교 정보 세팅
          $('[id^="step"] input[name=schoolSeq]').val(screen.v.schoolSeq);
          $('[id^="step"] input[name=schoolName]').val(screen.v.schoolName);
          $('[id^="step"] input[name=schoolLevel]').val(screen.v.schoolLevel);
          $('[id^="step"] input[name=schoolAddress]').val(screen.v.schoolAddress);
          // 가입페이지 화면제어
          $('.school-data .school-name').text(screen.v.schoolName);
          $('.school-data .school-level').text(screen.v.schoolLevelName);
          $('.school-data .school-address').text(screen.v.schoolAddress);
          // 마이페이지 화면제어
          let schoolLA = '';
          let schoolArea = screen.v.schoolAddress.split(' ')[0];
          if (screen.v.schoolLevel == 'ELEMENT') {
            schoolLA = '[초등학교] ['+schoolArea+'] ';
          } else if (screen.v.schoolLevel == 'MIDDLE') {
            schoolLA = '[중학교] ['+schoolArea+'] ';
          } else if (screen.v.schoolLevel == 'HIGH') {
            schoolLA = '[고등학교] ['+schoolArea+'] ';
          } else if (screen.v.schoolLevel == 'UNI') {
            schoolLA = '[' + screen.v.schoolTypeName + '] ['+schoolArea+'] ';
          } else {
            schoolLA = '['+schoolArea+'] ';
          }
          $('.school-data .school-name').text(screen.v.schoolName);
          $('.school-data .schoolLA').text(schoolLA);
        }

        // 교사/예비교사 선택에 따른 초/중고등 화면 제어
        // 초기화
        $('.pre-teacher-department').addClass('display-hide')
        $('.school-grade-box').addClass('display-hide');
        $('.school-level').removeClass('display-hide');
        // 화면제어
        if (screen.v.teacherLevel=='member') {
          if (screen.v.schoolLevel == 'ELEMENT') {
            $('.school-grade-box.school-ele').removeClass('display-hide');
          } else if (screen.v.schoolLevel == 'ETC') {
            $('.school-grade-box.school-etc').removeClass('display-hide');
            $('.school-level').addClass('display-hide');
          } else if (screen.v.schoolLevel == 'MIDDLE') {
            $('.school-grade-box.school-mid').removeClass('display-hide');
          } else if (screen.v.schoolLevel == 'HIGH') {
            $('.school-grade-box.school-high').removeClass('display-hide');
          } else {
            // 마이페이지 화면 제어 - 등록x 학교
            $('.school-grade-box.school-etc').removeClass('display-hide');
          }
        } else {
          $('.pre-teacher-department').removeClass('display-hide')
        }

        screen.v.schoolType = screen.v.schoolLevel; // 특수 학교의 경우 초/중/고 탭 선택 시 schoolLevel이 변경 되므로

        // 학교 등록 여부에 따른 담임/과목/직위 화면 제어
        let classNm = 'school-request-'+screen.v.schoolRequest;
        $('.'+classNm).removeClass('display-hide');

        // 화면 제어 및 학교 정보 세팅 여부
        if (validation) {
          $('.box-school-data').removeClass('display-hide');
          document.getElementById('popup-search-school-close-button').click();
          screen.v.selectSchoolYn = true;
        }

        // 학교 등록 여부에 따른 schoolLevel 값 세팅-등록안된 학교 혹은 기타급의 학교 일 경우 초등 기본값으로 세팅
        if (screen.v.schoolRequest == 'Y' || screen.v.schoolLevel == 'ETC') {
          screen.v.schoolLevel = 'ELEMENT'
        }

        $('[id^="step"] input[name=selectSchoolYn]').val(screen.v.selectSchoolYn);
      },
      selectEleRadio: (e)=> {
        let code = $(e.target).data('code');
        $('.s-box').addClass('display-hide');
        $('.s-'+code).removeClass('display-hide');
      },
      addTextbook: (e)=> {
        let textbook = e.target.previousElementSibling.textContent;
        let textbookSeq = e.target.previousElementSibling.previousElementSibling.value;
        if (textbookSeq == "") {
          return;
        }
        if (screen.v.textbookArr.length > 39) {
          $alert.alert('40개 까지만 추가 가능 합니다.')
          return;
        }
        if (screen.v.textbookArr.includes(textbookSeq)) {
          $alert.alert('이미 추가 되어있습니다.')
          console.log('추가 할 것 : '+textbookSeq)
          console.log('기존 arr : '+screen.v.textbookArr)
        } else {
          let html = '';
          html += '<span class="alert-button type-primary-light" id="tbs-'+textbookSeq+'">';
          html += '<a>'+textbook+'</a>';
          html += '<input type="hidden" value="'+textbookSeq+'">';
          html += '<input type="hidden" value="'+textbookSeq+'">';
          html += '<button type="button" class="icon-button textbook-del-btn" data-seq='+textbookSeq+' title="삭제">';
          html += '<svg data-seq='+textbookSeq+'>';
          html += '<title>버튼 제거</title>';
          html += '<use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>';
          html += '</svg>';
          html += '</button>';
          html += '</span>';

          let reqClassNm = 'school-request-'+screen.v.schoolRequest;
          let levelClassNm = 'school-mid';
          if (screen.v.schoolLevel == 'HIGH') levelClassNm = 'school-high';
          let classNm = '';
          if (screen.v.schoolType == 'ETC') {
            classNm = '.'+reqClassNm+' .school-grade-box.school-etc .' + levelClassNm + ' .buttons.margin-top-md.textbook-add-area';
          } else {
            classNm = '.'+reqClassNm+' .school-grade-box.' + levelClassNm + ' .buttons.margin-top-md.textbook-add-area';
          }
          $(classNm).append(html);
          screen.v.textbookArr.push(textbookSeq)
          $('option[value='+textbookSeq+']').attr('disabled',true);
        }
      },
      delTextbook: (e)=> {
        let seq = $(e.target).data('seq');
        let ele = document.getElementById('tbs-'+seq);
        ele.parentNode.removeChild(ele);
        for(var i = 0; i < screen.v.textbookArr.length; i++){
          if (parseInt(screen.v.textbookArr[i]) === seq) {
            screen.v.textbookArr.splice(i, 1);
            i--;
          }
        }
        console.log(screen.v.textbookArr)
      },
      clickSubTab: (e)=> {
        screen.v.schoolLevel = $(e.target).data('school-level');
        // 탭 내용 전체 초기화
        screen.f.tabInit()
      },
      clickTab: (e)=> {
        screen.v.teacherLevel = $(e.target).data('teacher-level');
        $('.box-school-data').addClass('display-hide');
      },


      /*유효성검사*/
      // 에러메시지 세팅
      setErrorMsg: (id, scroll1, scroll2, msg, alertYn)=> {
        if (alertYn) {
          $alert.alert('필수 입력 항목을 확인해 주세요.')
        }
        $( 'html, body' ).animate( { scrollTop : scroll1 }, scroll2 );
        $('#'+id).parents('fieldset').addClass('flag-error');

        if ($('#'+id).val() == '') msg = '필수 입력 사항입니다.';
        $('#'+id).parent().parent().children('span').text('* '+msg)
      },

      nameLengthChk: (alertYn)=> {
        let returnFlag = true;
        if ($('#step3 #user-name').val().length < 2 || $('#step3 #user-name').val().length > 17) {
          screen.f.setErrorMsg('user-name', 200, 400, '한글, 영문 2~ 17자 이내로 입력해 주세요.', alertYn)
          returnFlag = false;
        }
        return returnFlag;
      },

      idEmailFormChk: (id, alertYn)=> {
        let returnFlag = false;
        let val = $('#step3 #'+id).val();

        if (id == 'user-id' && val.length < 6) {
          screen.f.setErrorMsg(id, 200, 400, '최소 6자 이상 입력해 주세요.', alertYn)
          returnFlag = false;
        } else {
          if (val.includes('@')) { // email
            returnFlag = screen.f.emailFormChk(val, id, alertYn);
          } else { // id
            returnFlag = screen.f.idFormChk(val, id, alertYn);
          }
        }

        return returnFlag;
      },

      emailAtChk: (alertYn)=> {
        let returnFlag = true;
        if (!$('#step3 #user-email').val().includes('@')) {
          screen.f.setErrorMsg('user-email', 200, 400, '유효하지 않은 이메일 형식입니다.', alertYn)
          returnFlag = false;
        }
        return returnFlag;
      },

      emailFormChk: (val, id, alertYn)=> {
        let returnFlag = false;

        // email 총 최대 길이 50
        if (val.length < 51) {
          let beforeAt = val.split('@')[0];
          let afterAt = val.split('@')[1];
          let last = beforeAt.charAt(beforeAt.length-1);
          let afterAtBeforeDot = afterAt.split('.')[0];
          let afterAtAterDot = afterAt.split('.')[1];

          // @이전의 값: 길이 1~20
          if (beforeAt.length > 0 && beforeAt.length < 21) {
            // @이전의 값: 형식 only 영문+숫자+특수문자(-,. 두개만 허용) -> 한글, 특수문자(하이픈,마침표 제외) 미유효
            if(screen.v.pattern3.test(beforeAt) != true && screen.v.pattern4.test(beforeAt) != true) {
              // @이전의 값: 마지막값이 마침표(.)일 경우 미유효
              if (last != '.') {
                if (afterAt.includes('.')) {
                  // @이후의 값-닷(.)이전: 최소 길이 1
                  if (afterAtBeforeDot.length > 0) {
                    // @이후의 값-닷(.)이후: 길이 2~6
                    if (afterAtAterDot.length > 1 && afterAtAterDot.length < 7) {
                      // @이후의 값-닷(.)이후: 형식 only 영문
                      if(screen.v.pattern2.test(afterAtAterDot)){
                        returnFlag = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (!returnFlag) {
          screen.f.setErrorMsg(id, 200, 400, '유효하지 않은 이메일 형식입니다.', alertYn)
        } else {
          if ($('#user-id').val().includes('@') && id == 'user-id') {
            $('#user-email').val($('#user-id').val());
          }
        }

        return returnFlag;
      },

      idFormChk: (val, id, alertYn)=> {
        let returnFlag = false;

        // id: 형식 only 영문+숫자 / 길이 6~12
        if (val.length > 5 && val.length < 12) {
          if(screen.v.pattern1.test(val) && screen.v.pattern2.test(val)){
            returnFlag = true;
          }
        }

        if (!returnFlag) {
          screen.f.setErrorMsg(id, 200, 400, '유효하지 않은 아이디/이메일 형식입니다. 6~12자 이내의 영문+숫자 조합의 아이디만 가능 합니다.', alertYn)
        }

        return returnFlag;
      },

      passwordFormChk: (alertYn)=> {
        let returnFlag = false;
        let val = $('#step3 #user-password').val();

        if (val.length > 7 && val.length < 13) {
          if(screen.v.pattern1.test(val) && screen.v.pattern2.test(val) && screen.v.pattern3.test(val)){
            returnFlag = true;
          }
        }

        if (!returnFlag) {
          screen.f.setErrorMsg('user-password', 200, 400, '영문, 숫자, 특수문자를 조합하여 8 ~12자의 비밀번호를 입력해 주세요.', alertYn)
        }

        return returnFlag;
      },

      passwordMatchChk: (alertYn)=> {
        let returnFlag = true;
        if ($('#user-password').val() != $('#user-password-confirm').val()) {
          screen.f.setErrorMsg('user-password-confirm', 200, 400, '비밀번호가 일치하지 않습니다.', alertYn)
          returnFlag = false;
        }
        return returnFlag;
      },

      initChik: (id)=> {
        if (id == '') return;
        $('#'+id).parents('fieldset').removeClass('flag-error');
      },

      focusout1: ()=> {
        screen.f.initChik('joinName');
        if ($('#joinName').val() == '') {
          screen.f.setErrorMsg('joinName', 200, 400, '필수 입력 사항입니다.', false)
        }
      },

      focusout2: (e)=> {
        let id = e.target.id;
        screen.f.initChik(id);

        if (id == 'user-name') {
          screen.f.nameLengthChk(false);
        } else if (id == 'user-id') {
          screen.f.idEmailFormChk(id, false)
        } else if (id == 'user-email') {
          if (screen.f.emailAtChk(false)) {
            screen.f.idEmailFormChk(id, false)
          }
        } else if (id == 'user-password') {
          screen.f.passwordFormChk(false);
        } else if (id == 'user-password-confirm') {
          screen.f.passwordMatchChk(false);
        }
      },

      keypress1: (e)=> {
        let value = e.target.value;
        if (!value.includes('@') && value.length > 12) {
          e.target.value = value.substring(0, 12);
        }
      },
    },

    event: function () {
      // 변수 값 할당
      screen.f.setValue();

      /*인증 관련*/
      // 휴대폰 인증요청 버튼 클릭
      $(document).on('click', '.certBtn', screen.c.callMobileCert);
      // 휴대폰 인증하기 버튼 클릭
      $(document).on('click', '.smsCertNumFieldset .cert-btn', screen.f.checkMobileCert);
      // GPKI/EPKI 인증하기 버튼 클릭
      $(document).on('click', '#gpkiCert', screen.c.gpkiCert);
      // 메일 인증요청 버튼 클릭
      $(document).on('click', '#popup-authentication-mail .cert-req-area button.type-gray', screen.c.callMailiCert);
      // 메일 인증하기 버튼 클릭
      $(document).on('click', '#popup-authentication-mail .cert-area button.type-gray', screen.f.checkEmailiCert);
      // 코드 인증하기 버튼 클릭
      $(document).on('click', '#popup-authentication-code .cert-area button.type-gray', screen.c.checkCodeCert);
      // 서류 첨부 시 저장 - 교사/예비교사
      $(document).on('change', 'input[type=file][name=cert-file]', screen.f.saveCertFile);
      // 서류 첨부 삭제
      $(document).on('click', '.file-del-btn', screen.f.delCertFile);
      // 서류 첨부 후 확인 버튼 클릭 - 교사
      $(document).on('click', '#popup-certify-papers .footer button.type-primary', screen.f.setFileView);

      /*학교&모달*/
      // 학교 검색 모달창 오픈 시 초기화 작업
      $(document).on('click', '.search-school-btn', screen.f.initSchoolModal);
      $(document).on('click', '#searchSchool', screen.c.searchSchool);
      $(document).on('click', '.school-select', screen.f.setSchoolData);
      $(document).on('click', '#detail-address-yn', screen.f.detailAddressYn);
      $(document).on('keypress', '#schoolFrm #searchKeyword', screen.f.searchSchoolKeyPress);
      $(document).on('click', '#selectSchool', screen.f.selectSchool);
      // [초등] 담임/과목/직위 라디오 버튼 세팅에 따른 셀렉박스 변동
      $(document).on('click', '[name="regRadio"]', screen.f.selectEleRadio);
      // [중/고등] 과목 선택에 따른 교과서 셀렉박스 가져옴
      $(document).on('change', '.school-mid .size-xl.fluid.select2-hidden-accessible, .school-high .size-xl.fluid.select2-hidden-accessible', screen.c.getTextbook);
      // [중고등] 교과서 추가 버튼 클릭 시 하단에 리스트 추가
      $(document).on('click', '#step3 .textbook-add-btn', screen.f.addTextbook);
      // [중/고등] 추가 된 교과서 삭제 시
      $(document).on('click', '#step3 .textbook-del-btn, #step3 .textbook-del-btn svg', screen.f.delTextbook);
      $(document).on('click', '.tab-sub-btn', screen.f.clickSubTab);
      $(document).on('click', '.tab-btn', screen.f.clickTab);

      /*회원가입*/
      // 일반
      $(document).on('click', '.sign-up', screen.c.signUp);
      // sns
      $(document).on('click', '.sign-up-sns', screen.c.signUpSns);


      /*EventListener*/
      // step2 Focus Out
      $(document).on('focusout', '#joinName', screen.f.focusout1);
      // step 3 Focus Out 시 입력값 유효 여부 체크 후 Error MSG 출력
      $(document).on('focusout', '#step3', screen.f.focusout2);
      $(document).on('keypress', '#user-id', screen.f.keypress1);
    },

    init: function () {
      console.log('common auth js init!');
      screen.event();
		},
    };
  screen.init();
});