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

      /**
       * 차시, 수업의 상세 정보 및 현재 수업중인 아이템 정보
       *
       * @memberOf classLayerScreen.c
       */
      getClassList: (chashiNumber) => {
        const options = {
          url: '/pages/api/textbook-class/classList.ax',
          data: {
            subjectSeq: chashiNumber
          },
          method: 'GET',
          async: false,
          success: function (res) {
            const { depth1UnitName, depth2UnitName, depth3UnitName, gradeCode, termCode, textbookName, subjectName, startSubject, endSubject } = res.row.subjectInfo;

            // N학년 > N학기 > 과목이름 > 대분류명 > 중분류명 > 소분류명
            let chasiDetail = '';
            if (gradeCode) chasiDetail += `${Number(gradeCode)}학년 `;
            if (termCode) chasiDetail += `> ${Number(termCode)}학기 `;
            if (textbookName) chasiDetail += `> ${textbookName}`;
            if (depth1UnitName) chasiDetail += `> ${depth1UnitName}`;
            if (depth2UnitName) chasiDetail += `> ${depth2UnitName}`;
            if (depth3UnitName) chasiDetail += `> ${depth3UnitName}`;


            // 차시 번호
            let subjectNumber = '';
            if (startSubject) {
              subjectNumber = `[${startSubject}`;
              if (endSubject) {
                subjectNumber += `~${endSubject}`;
              }
              subjectNumber += ' 차시] ';
            }

            const chasiContent = chasiDetail + '\n' + subjectNumber + subjectName;

            $('#boardContent').val(chasiContent);

          }
        }
        $.ajax(options);
      },



    },


    f: {

      setFile: (file, no) => {
        console.log("파일",file)
        let maxSize = 10 * 1024 * 1024;

        let fileName = file.name

        let filesize = file.size


        let validExtensions = ['jpg', 'jpeg', 'png', 'bmp','mp4','mp3','hwp','doc','pptx','pdf','xls','zip'];  // 허용되는 확장자
        let fileExtension = fileName.split('.').pop().toLowerCase();
        console.log(fileExtension)
        if (!validExtensions.includes(fileExtension)) {
          screen.v.files[no]=[];
          $("input[type=file][id=file-"+ no +"]").val('');
          document.getElementById("file-size-"+no).innerText = '';
          $alert.open('MG00064');
          return;

        }
        console.log(filesize);
        console.log(maxSize);
        if (file.size > maxSize) {
          screen.v.files[no]=[];
          $("input[type=file][id=file-"+ no +"]").val('');
          document.getElementById("file-size-"+no).innerText = '';
          $alert.open('MG00070');
          return;

        }

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

      setOption: () => {
        const selected = $('input[name=division]:checked').val();

        console.log("옵션",selected)
        /*screen.c.getrequestList();*/
      },

      checkValidation: () => {

        var requiredFields = ['ox-division-1', 'boardTitle', 'boardContent'];

        var isValid = true;

        // 각 필드를 순회하면서 값이 비어있는지 확인
        for (var i = 0; i < requiredFields.length; i++) {
          var fieldId = requiredFields[i];
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
      displayFileSize(input,no) {
        console.log("자",input)
        console.log("숫자",no)
        var fileSize = input.size; // 파일 크기 (바이트)
        console.log(fileSize);
        var fileSizeKB = fileSize / (1024*1024); // 바이트를 킬로바이트로 변환
        console.log(fileSizeKB)
        document.getElementById("file-size-"+no).innerText = fileSizeKB.toFixed(3)+'Mb';

      },

      deleteFile: (no) => {
        // 파일 배열에서 해당 인덱스의 파일 제거
        console.log(screen.v.files[no].length);
        screen.v.files[no] = [];
        console.log("파일 삭제 후", no);
        console.log("파일 삭제 후", screen.v.files[no]);

        $("input[type=file][id=file-"+ no +"]").val('');
        document.getElementById("file-size-"+no).innerText = '';
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
        formData.append('boardFaqTypeCode', $('input[name=division]:checked').val());

        return formData;
      },


      // 차시창에서 넘어온 경우
      getChasiParam: () => {
        const queryString = window.location.search;
        if (!queryString) return;

        const chasiNumber = new URLSearchParams(queryString).get('chasi');

        if (!chasiNumber) return;

        // "차시창 이용" 라디오 버튼 자동 선택
        $('input[name="division"]').not('#ox-division-4').prop('disabled', true);
        $('#ox-division-4').prop('checked', true);

        // 내용칸에 차시정보 출력
        screen.c.getClassList(chasiNumber);

      }




    },

    event: () => {


      $('button[name=save]').on('click', () => {
        if (!screen.f.checkValidation()) {
          return;
        }

        screen.c.getrequestList();
      });

      // 옵션(지역) 선택
      $("input[type=radio][name=division]").on("click", screen.f.setOption);

      $("input[type=checkbox][name=spec]").on("click", screen.f.setAgree);

      $('#form1').find('input[id^=file]').on('change',(e) =>{
        const file = e.target.files[0];
        const id = e.target.id;
        const no = id.split('-')[1];
        screen.f.displayFileSize(file,no);
        screen.f.setFile(file, no);
      });

      $('#form1').find('button[id^=del]').on('click',(e) =>{
        const id = e.target.id;
        const no = id.split('-')[1];
        screen.f.deleteFile(no);
      });


      /*$('.button.type-gray').click(function() {

        $("#" + tempUUID).remove();

        let result = [...screen.v.delInfo.refDatm].filter((v, i, arr) => {
          if (v.tempUUID === tempUUID && v?.fileId) {
            screen.v.delInfo.deletedFiles.push(v.fileId);
          }
          return v.tempUUID !== tempUUID
        });

        screen.v.delInfo.refDatm = result;
      });*/
    },

    init: () => {
      // 차시창에서 1:1문의로 넘어온 경우
      screen.f.getChasiParam();

      screen.event();
    },
  };
  screen.init();
});