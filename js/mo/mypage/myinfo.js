$(function () {
  let myScreen = {
    v: {
      host_common: '',
      host_ele: '',
      host_mid: '',
      host_high: '',
      snsCd: '',
      userId: '',
      schoolLevel: '',
      etcSchoolLevel: '',
      textbookArr: [],
      pattern1: /[0-9]/, //숫자
      pattern2: /[a-zA-Z]/, //영어
      pattern3: /[`~!@#$%^&*|\\\'\";:\/(){}?]/gi, //특수문자
      pattern4: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, //한글
      validaionArr: ['user-email', 'yy', 'mm', 'dd'],
      fileInfo: [],
      redirectURI: '',
    },

    c: {
      chkPw: (e)=> {
        console.log(e)
        $.ajax({
          type:"POST",
          data:$("#chkFrm").serialize(),
          url:"/pages/api/mypage/checkPasswrod.ax",

          /* 전송 후 세팅 */
          success: function(res) {
            console.log(res)
            if (res.resultCode == '0000') {
              let url = myScreen.v.host_common+'/pages/common/mypage/myinfoModify.mrn';
              if (myScreen.v.redirectURI !== '') url = url + '?redirectURI=' + myScreen.v.redirectURI;
              location.href = url;
            } else {
              alert('아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인하신 후 입력해주세요');
            }
          },
          error: function() { //시스템에러
            alert("오류발생");
          }
        });
      },

      getTextbokList: (e) => {
        if (e.target.classList.contains('T04-textbook')) {
          return false;
        }
        $('.T04-textbook').empty();
        $('.textbook-add-btn').addClass('display-hide');
        let subjectCd = e.target.value;
        if (subjectCd != '' && subjectCd != null) {
          $.ajax({
            type : 'post',
            url : '/User/GetTextbook.ax',
            data : {"subjectCd" : subjectCd, "schoolLevel" : (($('#schoolLevel').val() == 'ETC' || $('#schoolLevel').val() == '')?$('#etcSchoolLevel').val():$('#schoolLevel').val())},
            success: function(result) {
              if (result.status == 'succ') {
                console.log(subjectCd)
                console.log(result.textbookList)
                let list = result.textbookList;
                if (list.length > 0) {
                  let html = '';
                  for (let i=0; i<list.length; i++) {
                    html += '<option value='+list[i].masterSeq+'>'+list[i].textbookName+'('+list[i].leadAuthorName+')</option>';
                  }
                  $('.T04-textbook').append(html);
                  $('.T04-textbook').attr('disabled', false);
                  $('.textbook-add-btn').removeClass('display-hide');
                } else {
                  console.log('해당 과목 교과서 정보 없음')
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

      myinfoModify: ()=> {
        // [1] validation
        let confirmFlag = true;

        // 휴대폰 인증 chk
        if ($('#certHpYn').val() == 'N' && $('#step5 [name=secMobile]').val() != $('#originData [name=secMobile]').val()) {
          $( 'html, body' ).animate( { scrollTop : 400 }, 400 );
          $('#Mobile1').parents('fieldset').addClass('flag-error');
          confirmFlag = false;
          return;
        }

        // 휴대폰 인증 chk-2 인증 한 경우
        if ($('#certHpYn').val() == 'N' && $('#certType').val() != '') {
          $( 'html, body' ).animate( { scrollTop : 200 }, 400 );
          alert('인증 시에는 휴대폰 인증 필수 입니다.')
          confirmFlag = false;
          return;
        }

        // 전체 입력란 기입 여부 chk
        for (let i=0; i<myScreen.v.validaionArr.length; i++) {
          let ele = $("#step5 input[id=" + myScreen.v.validaionArr[i] + "]");
          let val = ele.val();
          let id = ele.attr('id');

          if (val == "") {
            myScreen.f.setErrorMsg(id, 0, 400, '필수 입력 사항입니다.', true)
            confirmFlag = false;
            return;
          }
        }

        // 이메일 형식 chk
        if (myScreen.f.emailAtChk(true)) {
          if (!myScreen.f.idEmailFormChk('user-email', true)) {
            confirmFlag = false;
            return;
          }
        }

        // 비밀번호 형식 chk
        if (myScreen.v.snsCd == '' && $('#user-password').val() != '') {
          if (!myScreen.f.passwordFormChk(true)) {
            confirmFlag = false;
            return;
          }

          // 비밀번호 일치여부 확인
          if (!myScreen.f.passwordMatchChk(true)) {
            confirmFlag = false;
            return;
          }
        }

        // 학교 정보 validaion & set param
        let schoolSeq = $('#schoolSeq').val();
        let schoolLevel = $('#schoolLevel').val();
        let etcSchoolLevel = $('#etcSchoolLevel').val();
        let memberType = $('#memberType').val();

        $('#scIdx').val(schoolSeq);
        if (schoolSeq == 0) schoolLevel = 'ETC';
        let scLevel = schoolLevel == 'ETC' || schoolLevel == ''? etcSchoolLevel : schoolLevel;

        /*if (memberType != '401') {*/
        if (scLevel == 'ELEMENT' && schoolSeq != '' && schoolSeq != null && schoolSeq != 0) {
            let cnt = 0;
            if (schoolLevel == 'ETC') cnt = 1;

            let t05 = $('[name="regRadio"][value="T05"]')[cnt].checked;
            let t04 = $('[name="regRadio"][value="T04"]')[cnt].checked;
            let u04 = $('[name="regRadio"][value="U04"]')[cnt].checked;

            if (t05) {
              $('#step5 [name=homeroomTeacherGrade]').val($('[name^="T05"]')[cnt].value);
            } else if (t04) {
              $('#step5 [name=dedicatedTeacherSubject]').val($('[name$="T04ele"]')[cnt].value);
            } else if (u04) {
              $('#step5 [name=etcTeacherType]').val($('[name^="U04"]')[cnt].value);
            } else {
              alert('학교정보 담임/과목/직위 값 오류.');
              confirmFlag = false;
              return;
            }
          } else if (scLevel == 'MIDDLE' || scLevel == 'HIGH') {
            // todo seq 두개씩 담김
            let textbookSeq = '';
            $.each($('[id^="tbs"]'), function() {
              let seq = $(this).attr('id').split('-')[1];
              if (textbookSeq == '') {
                textbookSeq = seq;
              } else {
                textbookSeq = textbookSeq + ',' + seq;
              }
            });
            let name = scLevel == 'MIDDLE'?'midTextbookSeq':'highTextbookSeq';
            $('#step5 [name='+name+']').val(textbookSeq);
          }
        /*}*/

        // [2] 정보 수정 ajax
        if (confirmFlag) {
          $.ajax({
            type: "POST",
            data: myScreen.f.setParamData(),
            contentType: false,
            processData: false,
            url:"/pages/api/mypage/myinfoModify.ax",

            /* 전송 후 세팅 */
            success: function(res) {
              console.log(res)
              let certYn = res.certYn;

              if(res.result){
                // 알림 정보 수정api 호출
                const options = {
                  url: '/pages/api/apiCallPost.ax',
                  data: {
                    apiUrl: '/api/updatePromoUserInfo.mrn'
                    , userId: myScreen.v.userId

                    , miraenSmsFlag : $('.tab-content .promotionData').find('[name=miraenSmsFlag]').prop('checked') == true ? 'Y' : 'N'
                    , miraenEmailFlag : $('.tab-content .promotionData').find('[name=miraenEmailFlag]').prop('checked') == true ? 'Y' : 'N'
                    , printSmsFlag : $('.tab-content .promotionData').find('[name=printSmsFlag]').prop('checked') == true ? 'Y' : 'N'
                    , printEmailFlag : $('.tab-content .promotionData').find('[name=printEmailFlag]').prop('checked') == true ? 'Y' : 'N'
                    , textbookmallSmsFlag : $('.tab-content .promotionData').find('[name=textbookmallSmsFlag]').prop('checked') == true ? 'Y' : 'N'
                    , textbookmallEmailFlag : $('.tab-content .promotionData').find('[name=textbookmallEmailFlag]').prop('checked') == true ? 'Y' : 'N'
                    , mteacherSmsFlag : $('.tab-content .promotionData').find('[name=mteacherSmsFlag]').prop('checked') == true ? 'Y' : 'N'
                    , mteacherEmailFlag : $('.tab-content .promotionData').find('[name=mteacherEmailFlag]').prop('checked') == true ? 'Y' : 'N'
                    , hgSmsFlag : $('.tab-content .promotionData').find('[name=hgSmsFlag]').prop('checked') == true ? 'Y' : 'N'
                    , hgEmailFlag : $('.tab-content .promotionData').find('[name=hgEmailFlag]').prop('checked') == true ? 'Y' : 'N'

                    , UpdateID: myScreen.v.userId
                  },
                  success: function(res) {
                    if(res.successYN === 'Y') {
                      let url = myScreen.v.redirectURI;

                      if (url === '') {
                        url = '/pages/common/mypage/myinfo.mrn';
                      }

                      // 인증 여부에 따라 알람 다르게 띄움
                      if (certYn) {
                        $alert.open('MG00072', ()=> {
                          location.href = url;
                        });
                      } else {
                        $alert.open('MG00035', ()=> {
                          location.href = url;
                        });
                      }
                    }

                  }
                };
                $cmm.ajax(options);
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

      searchPoint: ()=> {
        // 초기화
        $('#tab-sub-1').empty();
        $('#tab-sub-2').empty();
        $('#tab-sub-3').empty();

        $.ajax({
          type: "POST",
          data: { startDate: $('#startDate').val(), endDate: $('#endDate').val()},
          url:"/pages/api/mypage/getPointList.ax",

          /* 전송 후 세팅 */
          success: function(res) {
            console.log(res)
            if(res.result){
              myScreen.f.setPointList(res.allPoint, res.allPoint.rows, 'tab-sub-1');
              myScreen.f.setPointList(res.addPoint, res.addPoint.rows, 'tab-sub-2');
              myScreen.f.setPointList(res.usePoint, res.usePoint.rows, 'tab-sub-3');
            } else {
              alert(res.dispMessage);
            }
          },
          error: function() { //시스템에러
            alert("오류발생");
          }
        });

      },
    },

    f: {

      initChik: (id)=> {
        if (id == '') return;
        $('#'+id).parents('fieldset').removeClass('flag-error');
      },

      nameLengthChk: (alertYn)=> {
        let returnFlag = true;
        if ($('#step3 #user-name').val().length < 2 || $('#step3 #user-name').val().length > 17) {
          screen.f.setErrorMsg('user-name', 200, 400, '한글, 영문 2~ 17자 이내로 입력해 주세요.', alertYn)
          returnFlag = false;
        }
        return returnFlag;
      },

      focusout2: (e)=> {
        let id = e.target.id;
        myScreen.f.initChik(id);

        if (id == 'user-name') {
          myScreen.f.nameLengthChk(false);
        } else if (id == 'user-id') {
          myScreen.f.idEmailFormChk(id, false)
        } else if (id == 'user-email') {
          if (myScreen.f.emailAtChk(false)) {
            myScreen.f.idEmailFormChk(id, false)
          }
        } else if (id == 'user-password') {
          myScreen.f.passwordFormChk(false);
        } else if (id == 'user-password-confirm') {
          myScreen.f.passwordMatchChk(false);
        }
      },

      setDefaultDate: () => {
        let minDatetime = new Date();
        let maxDatetime = new Date();

        minDatetime.setMonth(minDatetime.getMonth() - 12); // 12개월 이전

        const minDate = minDatetime.toISOString().split('T')[0]; // YYYY-MM-DD
        const maxDate = maxDatetime.toISOString().split('T')[0];

        $("#startDate")
            .val(minDate)
            .prop("max", maxDate)
            .attr("disabled", false);

        $("#endDate")
            .val(maxDate)
            .prop("max", maxDate)
            .prop("min", minDate)
            .attr("disabled", false);
      },

      setValue: ()=> {
        $('.th-value').each(function() {
          let value = $(this).val();
          let key = $(this).attr('key');
          myScreen.v[key] = value;
        });
      },

      setEleSelebox: (e)=> {
        let pEle = $(e.target).parents('.roundbox-outlined');
        pEle.find('select').attr('disabled', true);

        let id = e.target.id;
        $('select[name='+id+']').attr('disabled', false);
      },

      addTextbook: (e) => {
        // 초기 정보 저장
        if (myScreen.v.textbookArr.length == 0) {
          $(`[id^=tbs-]`).each(function () {
            let seq = $(this).attr('id').split("-")[1];
            myScreen.v.textbookArr.push(parseInt(seq));
          });
        }

        let schoolLevel = $('#schoolLevel').val();
        let etcSchoolLevel = $('#etcSchoolLevel').val();

        let schoolClass = schoolLevel=='ELEMENT'?'ele':schoolLevel=='MIDDLE'?'mid':'high';
        let etcSchoolClass = etcSchoolLevel=='ELEMENT'?'ele':etcSchoolLevel=='MIDDLE'?'mid':'high';
        let classNm = '.school-grade-box.school-' + (schoolLevel=='ETC' || schoolLevel==''?'etc .school-'+etcSchoolClass:schoolClass);

        console.log(classNm)
        console.log($(classNm+' .T04-textbook').find('option:selected'))
        let textbook = $(classNm+' .T04-textbook').find('option:selected').text();console.log(textbook)
        let textbookSeq = parseInt($(classNm+' .T04-textbook').find('option:selected').val());console.log(textbookSeq)
        if (textbookSeq == '') {
          return;
        }
        if (myScreen.v.textbookArr.includes(textbookSeq)) {
          alert('이미 추가 되어있습니다.')
          console.log('추가 할 것 : '+textbookSeq, textbook)
          console.log('기존 arr : '+myScreen.v.textbookArr)
        } else {
          let html = '';
          html += '<span class="alert-button type-primary-light" id="tbs-'+textbookSeq+'">';
          html += '<a>'+textbook+'</a>';
          html += '<input type="hidden" value="'+textbookSeq+'">';
          html += '<button type="button" class="icon-button textbook-del-btn" data-seq='+textbookSeq+' title="삭제">';
          html += '<svg data-seq='+textbookSeq+'>';
          html += '<title>버튼 제거</title>';
          html += '<use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>';
          html += '</svg>';
          html += '</button>';
          html += '</span>';

          $('.buttons.buttons-textbook').append(html);
          myScreen.v.textbookArr.push(textbookSeq)
        }
      },

      delTextbook: (e) => {
        let seq = $(e.target).data('seq');
        let ele = document.getElementById('tbs-'+seq);
        ele.parentNode.removeChild(ele);
        for(var i = 0; i < myScreen.v.textbookArr.length; i++){
          if (parseInt(myScreen.v.textbookArr[i]) === seq) {
            myScreen.v.textbookArr.splice(i, 1);
            i--;
          }
        }
        console.log(myScreen.v.textbookArr)
      },

      checkAgreeAll: (e)=> {
        let check = false;
        if ($('#ox1').prop('checked')) check = true;
        $('[id^="ox"]').prop('checked', check);
      },

      checkAgree: (e)=> {
        let cnt = 0;
        $('table [id^="ox"]').each(function() {
          if ($(this).prop('checked')) {
            cnt++;
          }
        });
        if (cnt == 10) {
          $('#ox1').prop('checked', true);
        } else {
          $('#ox1').prop('checked', false);
        }
      },

      myinfoBack: (e)=> {
        let _result = confirm('회원정보를 수정하지 않겠습니까?');
        if (_result) {
          location.href='/pages/common/mypage/myinfo.mrn';
        }
      },

      goTextbook: (e)=> {
        let level = $(e.target).data('level');
        let uri = $(e.target).data('uri');
        let url = '';

        if (level == 'ELEMENT') {
          url = myScreen.v.host_ele + '/pages/ele' + uri;
        } else if (level == 'MIDDLE') {
          url = myScreen.v.host_mid + '/pages/mid' + uri;
        } else if (level == 'HIGH') {
          url = myScreen.v.host_high + '/pages/high' + uri;
        }

        location.href = url;
      },

      setBirth: (e)=> {
        let yy = $('#yy').val();
        let dd = $('#dd').val();
        let mm = $('#mm').val();
        let birth = yy+mm+dd;
        $('#birth').val(birth)
      },

      setParamData: ()=> {
        let data = {};
        let originData = $cmm.serializeJsonAll($('#originData'));
        let newData = $('#step5').serializeArray();
        for (var i = 0; i < newData.length; i++) {
          const name = newData[i].name;
          const value = newData[i].value;
          const originValue = originData[name];

          // 변동 있는 정보만 가져감
          if (originValue != undefined && value != originValue) {
            console.log('### NAME : '+name + ', ORIGIN : '+originValue + ', NEW : '+value)
            data[name] = value;
          }
        }

        // 필요 정보 추가로 가져감
        $('.required-value').each(function () {
          let key = $(this).attr('name');
          let value = $(this).val();
          data[key] = value;
        });

        // 비번
        data['usrPw'] = $('#step5 #user-password').val();

        let formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));

        // 파일 정보
        if (myScreen.v.fileInfo.length > 0) {
          let list = myScreen.v.fileInfo;
          list.map((v) => {
            formData.append('file', v);
          })

          formData.append('directoryCode', 'USER');
          formData.append('fileType', '');
          formData.append('uploadMethod', '');
          formData.append('displayName', '');
        }

        return formData
      },

      setErrorMsg: (id, scroll1, scroll2, msg, alertYn)=> {
        if (alertYn) {
          alert('필수 입력 항목을 확인해 주세요.')
        }
        $( 'html, body' ).animate( { scrollTop : scroll1 }, scroll2 );
        $('#'+id).parents('fieldset').addClass('flag-error');
        $('#'+id).parent().next().text('* '+msg)
      },

      emailAtChk: (alertYn)=> {
        let returnFlag = true;
        if (!$('#step5 #user-email').val().includes('@')) {
          myScreen.f.setErrorMsg('user-email', 200, 400, '유효하지 않은 이메일 형식입니다.', alertYn)
          returnFlag = false;
        }
        return returnFlag;
      },

      idEmailFormChk: (id, alertYn)=> {
        let returnFlag = false;
        let val = $('#step5 #'+id).val();

        // id는 수정이 없어 분기 처리 삭제
        returnFlag = myScreen.f.emailFormChk(val, id, alertYn);

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
            if(myScreen.v.pattern3.test(beforeAt) != true && myScreen.v.pattern4.test(beforeAt) != true) {
              // @이전의 값: 마지막값이 마침표(.)일 경우 미유효
              if (last != '.') {
                if (afterAt.includes('.')) {
                  // @이후의 값-닷(.)이전: 최소 길이 1
                  if (afterAtBeforeDot.length > 0) {
                    // @이후의 값-닷(.)이후: 길이 2~6
                    if (afterAtAterDot.length > 1 && afterAtAterDot.length < 7) {
                      // @이후의 값-닷(.)이후: 형식 only 영문
                      if(myScreen.v.pattern2.test(afterAtAterDot)){
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
          myScreen.f.setErrorMsg(id, 200, 400, '유효하지 않은 이메일 형식입니다.', alertYn)
        }

        return returnFlag;
      },

      passwordFormChk: (alertYn)=> {
        let returnFlag = false;
        let val = $('#step5 #user-password').val();

        if (val.length > 7 && val.length < 13) {
          if(myScreen.v.pattern1.test(val) && myScreen.v.pattern2.test(val) && myScreen.v.pattern3.test(val)){
            returnFlag = true;
          }
        }

        if (!returnFlag) {
          myScreen.f.setErrorMsg('user-password', 200, 400, '영문, 숫자, 특수문자를 조합하여 8 ~12자의 비밀번호를 입력해 주세요.', alertYn)
        }

        return returnFlag;
      },

      passwordMatchChk: (alertYn)=> {
        let returnFlag = true;
        if ($('#user-password').val() != $('#user-password-confirm').val()) {
          myScreen.f.setErrorMsg('user-password-confirm', 200, 400, '비밀번호가 일치하지 않습니다.', alertYn)
          returnFlag = false;
        }
        return returnFlag;
      },

      setPointList: (res, list, id) => {
        let html = '';
        if (list.length > 0 || list != null) {
          html += '<ul class="point-details scrollable">';
          for (let i=0; i<list.length; i++) {
            let item = list[i];
            let status = item.status;
            html += '<li>';
            if (status == '1') {
              html += '<span class="badge size-sm type-round-box fill-green">적립</span>'
              html += '<span class="date">'+item.date+'</span>'
              html += '<strong class="title">'+item.myPointTitle+'</strong>'
              html += '<div class="point">'
              html += '<span class="badge size-md type-round-box fill-green">+ '+item.point+'</span>'
            } else if (status == '2') {
              html += '<span class="badge size-sm type-round-box fill-primary">사용</span>'
              html += '<span class="date">'+item.date+'</span>'
              html += '<strong class="title">'+item.myPointTitle+'</strong>'
              html += '<div class="point">'
              html += '<span class="badge size-md type-round-box fill-gray-500">- '+item.point+'</span>'
            } else if (status == '3') {
              html += '<span class="badge size-sm type-round-box fill-secondary">차감</span>'
              html += '<span class="date">'+item.date+'</span>'
              html += '<strong class="title">'+item.myPointTitle+'</strong>'
              html += '<div class="point">'
              html += '<span class="badge size-md type-round-box fill-gray-500">- '+item.point+'</span>'
            } else if (status == '4') {
              html += '<span class="badge size-sm type-round-box fill-gray-100">소멸</span>'
              html += '<span class="date">'+item.date+'</span>'
              html += '<strong class="title">'+item.myPointTitle+'</strong>'
              html += '<div class="point">'
              html += '<span class="badge size-md type-round-box fill-gray-500">- '+item.point+'</span>'
            }
            html += '</div></li>'
          }
          html += '</ul>'
          html += '<div class="pagination"></div>'
          $paging.bindTotalboardPaging(res);
        } else {
          html += '<div class="point-details scrollable box-no-data"> 등록된 포인트가 없습니다. </div>'
        }
        $('#'+id).append(html);
      },

      // 서류 첨부 시 저장
      saveCertFile: (e)=> {
        // type 확인 todo
        // 초기화
        myScreen.v.fileInfo = [];

        // 파일 배열에 담기
        let file = e.currentTarget.files[0];
        let fileNm = e.currentTarget.files[0].name;
        $('input[type=hidden][name=fileNm]').val(fileNm);

        let reader = new FileReader();
        reader.onload = function () {
          myScreen.v.fileInfo.push(file);
          $('#certType').val('2');
        };
        reader.readAsDataURL(file);
      },

    },

    event: () => {
      // 비번 확인
      $(document).on('click', '#chkPw', myScreen.c.chkPw);
      // [초등] 담임/과목/직위 라디오 선택에 따른 우측 셀박 활성화여부 세팅
      $(document).on('click', 'input[type=radio][name=regRadio]', myScreen.f.setEleSelebox);
      // [중/고등] 과목 선택에 따른 교과서 셀렉박스 가져옴
      $(document).on('change', 'select[name^=T04]', myScreen.c.getTextbokList);
      // [중/고등] 교과서 추가 버튼 클릭 시 하단에 리스트 추가
      $(document).on('click', '#step5 .textbook-add-btn', myScreen.f.addTextbook);
      // [중/고등] 추가 된 교과서 삭제 시
      $(document).on('click', '#step5 .textbook-del-btn, #step5 .textbook-del-btn svg', myScreen.f.delTextbook);
      // 프로모션 전체 동의하기 클릭 시
      $(document).on('click', '#ox1', myScreen.f.checkAgreeAll);
      // 프로모션 각 체크박스 클릭 시
      $(document).on('click', 'table [id^="ox"]', myScreen.f.checkAgree);
      // 정보수정 클릭 시
      $(document).on('click', '#myinfoModify', myScreen.c.myinfoModify);
      // 취소 버튼 클릭 시
      $(document).on('click', '#myinfoBack', myScreen.f.myinfoBack);
      // 생년월일 값 세팅
      $(document).on('change', '.birth-sel', myScreen.f.setBirth);
      // 포인트 검색
      $(document).on('click', '#searchPoint svg', myScreen.c.searchPoint);
      // 교과서 클릭 시
      $(document).on('click', '.go-textbook', myScreen.f.goTextbook);
      // 서류 첨부 시 저장 - 교사/예비교사(파일정보 저장을 위해 함수 가져옴)
      $(document).on('change', 'input[type=file][name=cert-file]', myScreen.f.saveCertFile);

      /*EventListener*/
      $(document).on('focusout', '#step5', myScreen.f.focusout2);
    },

    init: () => {
      myScreen.event();
      // 포인트 날짜 세팅 및 조회
      myScreen.f.setDefaultDate();
      myScreen.c.searchPoint();
      // 변수 세팅
      myScreen.f.setValue();
    },
  };
  myScreen.init();
});