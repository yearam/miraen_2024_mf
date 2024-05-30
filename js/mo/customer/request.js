$(function () {
  let screen = {
    v: {
      cityCode: null,
      Param:null,
      editor: [],
      searchCondition :{},
      boardtitle:'',
      boardContent:'',
      boardFaqTypeCode:'',
      boardFileGroupId: null,
      boarAgreeYn:'',
      files: {
        q1: [],
        q2: [],
        q3: [],
      },
      file:{
        Date:[],
      },
    },

    c: {
      // 리스트 데이터
      getrequestList: () => {
        // Serialize form data
        let param = screen.f.getBoardParam();
        console.log("pa",param)

        /*for (let [key, value] of param) {
        	console.log(key, value);
        }*/

        // Make the AJAX request
        const option = {
          method: "POST",
          contentType: false,
          processData: false,
          url: "/pages/common/customer/insertRequest.ax",
          data: param,
          success: function (res) {
            // Handle the response from the server
            alert("등록완료");
            screen.f.setLink();
            /*location.reload();*/
          }
        };
        $cmm.ajax(option);
      },



    },


    f: {

      setFile: (file, no) => {
        console.log("파일",file)

        // 파일 배열에 담기
        let reader = new FileReader();
        console.log(screen.v.files[no].length);
        reader.onload = function () {
          if(screen.v.files[no].length > 0){
            screen.v.files[no] = [];
          }
          screen.v.files[no].push(file);
        };
        reader.readAsDataURL(file)
      },

      setLink: () => {
        if(!$isLogin){
          console.log("로그인 팝업");
          screen.f.okLogin();
        }else {
          window.location.href = '/pages/common/mypage/myquest.mrn'
        }

        // /pages/common/customer/submit?faq=&searchTxt=&qnaLink=
      },

      setOption: (e) => {
        $('.request-division a').removeClass('active');

        $(e.currentTarget).addClass('active');

        $('input[name=division]').val(e.currentTarget.name);
        $('#division-name').html($(e.currentTarget).html())

        closePopup({id: 'popup-sheet-request'});

        console.log("옵션",e.currentTarget.name);
        /*screen.c.getrequestList();*/
      },

      clearOption: () => {
        if ($('input[name=division]').val() == '') {
          $('.request-division a').removeClass('active');
        }
      },

      checkValidation: () => {

        var requiredFields = ['division', 'boardTitle', 'boardContent'];

        var isValid = true;

        // 각 필드를 순회하면서 값이 비어있는지 확인
        for (var i = 0; i < requiredFields.length; i++) {
          var fieldId = requiredFields[i];
          console.log(fieldId)
          console.log(document.getElementById(fieldId).value)
          var fieldValue = document.getElementById(fieldId).value.trim();

          if (fieldValue === '') {
            alert('필수 입력 항목을 모두 작성해주세요.');
            isValid = false;
            break; // 하나라도 비어있으면 더 이상 검증하지 않고 종료
          }
        }
        /*let isValid = true;
        $('input[required]:not(:disabled)').each(function() {
          if ($(this).val() === '' || !$(this).val()) {
            $msg.alert('필수 입력 항목을 확인해주세요.', null, '경고');
            isValid = false;
            return false;
          }

        });*/
        return isValid;
      },
      displayFileSize(input) {
      if (input.files && input.files[0]) {
        var fileSize = input.files[0].size; // 파일 크기 (바이트)
        var fileSizeKB = fileSize / 1024; // 바이트를 킬로바이트로 변환
        document.getElementById("file-size-q1").innerText = "파일 크기: " + fileSizeKB.toFixed(2) + " KB";
        }
      },

      deleteFile: (no) => {
        // 파일 배열에서 해당 인덱스의 파일 제거
        console.log(screen.v.files[no].length);
        screen.v.files[no] = [];
        console.log("파일 삭제 후", no);
        console.log("파일 삭제 후", screen.v.files[no]);

        $("input[type=file][id=file-"+ no +"]").val('');
      },

      setAgree: () => {
        let selected = $('input:checkbox[name=spec]').is(':checked');

        console.log("옵션",selected)

        screen.v.boarAgreeYn = selected;
        /*screen.v. = selected;
        screen.c.getrequestList();*/
      },


      generateTemporaryKey() {
        const randomString = Math.random().toString(36).substring(2); // 무작위 문자열 생성
        return randomString;
      },

      getBoardParam: () => {

        // 내용
        /*const formData = new FormData($("#form1")[0]);*/
        const formData = new FormData($('#form1')[0]);
        console.log("폼 데이타",formData);

        // const boardFileGroupId = !!screen.v.data ? screen.v.data.boardFileGroupId : '';
        //
        // const data = {
        //   boardFileGroupId: !!screen.v.data&& screen.v.boardFileGroupId != null ? screen.v.boardFileGroupId : '',
        //   delInfo: screen.v.delInfo,
        // };
        const fileList = [].concat(screen.v.files.q1, screen.v.files.q2, screen.v.files.q3);

        fileList.forEach((v) => {
          if (v instanceof File) {
            formData.append('files', v);
          }
        });
        /*if (!screen.f.checkValidation()) {
          return;
        }*/
        let checkedYn = $('input:checkbox[name=spec]').is(':checked');
        if(checkedYn){
          formData.append('boardPcInfoAgreeYn','Y');
          var sBrsInf = "";
          sBrsInf  = "- 브라우저 헤더정보 : " + navigator.userAgent;
          sBrsInf += "\n- 브라우저 코드네임 : " + navigator.appCodeName;
          sBrsInf += "\n- 브라우저 이름 : " + navigator.appName;
          sBrsInf += "\n- 브라우저 버전 : " + navigator.appVersion;
          sBrsInf += "\n- PC플랫폼 : " + navigator.platform;

          formData.append('boardPcInfo', sBrsInf);
        }else{
          formData.append('boardPcInfoAgreeYn','N');
        }
        /*formData.append('deletedFiles', screen.v.delInfo.deletedFiles);*/
        // formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append('boardCategoryCode', 'QNA');
        formData.append('directoryCode', 'QNA');
        formData.append('boardUseYn', 'Y');
        formData.append('boardDisplayYn', 'Y');
        formData.append('fileType', 'original');
        formData.append('uploadMethod', 'DIRECT');
        formData.append('boardFaqTypeCode', $('input[name=division]').val());

        return formData;
      },



    },

    event: () => {

      $('button[name=save]').on('click', () => {
        if (!screen.f.checkValidation()) {
          return;
        }

        screen.c.getrequestList();
      });

      // 옵션 선택
      $(".request-division a").on("click", screen.f.setOption);

      $("#division-name").parents('button').on("click", screen.f.clearOption);

      $("input[type=checkbox][name=spec]").on("click", screen.f.setAgree);

      $('#form1').find('input[id^=file]').on('change',(e) =>{
        const file = e.target.files[0];
        const id = e.target.id;
        const no = id.split('-')[1];
        screen.f.setFile(file, no);
      });

      $('#form1').find('button[id^=del]').on('click',(e) =>{
        const id = e.target.id;
        const no = id.split('-')[1];
        screen.f.deleteFile(no);
      });
    },

    init: () => {
      screen.event();
    },
  };
  screen.init();
});