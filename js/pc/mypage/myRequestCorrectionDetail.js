$(function () {
  let screen = {
    v: {
      cityCode: null,
      Param:null,
      editor: [],
      fileList: [],
      fileId: null,
      searchCondition :{},
      boardtitle:'',
      boardSeq:'',
      boardContent:'',
      boardFaqTypeCode:'',
      boardFileGroupId: null,
      delInfo: {
        refDatm: [],		// 첨부 파일
        deletedFiles: []// 삭제된 첨부파일 fileId
      },
      boarAgreeYn:'',
      files: {
        q1: [],
        q2: [],
        q3: [],
      },
      deletedFiles: [],
      file:{
        Date:[],
      },
    },

    c: {
      // 리스트 데이터
      getupdateList: () => {
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
          url: "/pages/common/mypage/updateRequest.ax",
          data: param,
          success: function (res) {
            // Handle the response from the server
            alert("수정완료");
            screen.f.setLink();
          }
        };
        $cmm.ajax(option);
      },


      getdeleteList: () => {
        console.log('seq', screen.v.boardSeq);
        let boardSeq = screen.v.boardSeq;
        // Make the AJAX request
        const option = {
          method: "DELETE",
          url: "/pages/common/mypage/requestListdelete.ax",
          data : {
            boardSeq: boardSeq,
          },
          success: function (res) {
            // Handle the response from the server
            alert('삭제되었습니다.');
            /*$msg.toastr(msg, msgType);*/
            screen.f.setLink();
          }
        };
        $cmm.ajax(option);
      },



    },


    f: {

      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;
        console.log(pagingNow)
        screen.c.getfaqList(pagingNow);
      },

      setFile: (file, no) => {
        console.log("파일",file)

        let maxSize = 10 * 1024 * 1024;

        let fileName = file.name

        console.log(fileName);

        let validExtensions = ['jpg', 'jpeg', 'png', 'bmp','mp4','mp3','hwp','doc','pptx','pdf','xls','zip'];  // 허용되는 확장자
        let fileExtension = fileName.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
          $("input[type=file][id=file-"+ no +"]").val('');
          document.getElementById("file-size-"+no).innerText = '';
          $alert.open('MG00064');
          return
        }

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

      setOption: () => {
        const selected = $('input[name=division]:checked').val();

        console.log("옵션",selected)
        /*screen.c.getrequestList();*/
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

      setfiletex(input,no) {
        const fileInput = document.querySelector('input[type="file"][id="file-' + no + '"]');

        // Create a new File object
        const myFile = new File(['Hello World!'], input.name, {
          type: 'text/plain',
          lastModified: new Date(),
        });
        console.log(myFile);
        // Now let's create a DataTransfer to get a FileList
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(myFile);
        fileInput.file = dataTransfer.files;

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
        return isValid;
      },
      deleteFile: (no, fileId) => {
        // 파일 배열에서 해당 인덱스의 파일 제거
        console.log(screen.v.files[no].length);
        console.log(screen.v.delInfo.deletedFiles);
        screen.v.files[no] = [];
        screen.v.deletedFiles.push(fileId);

        console.log()
        /*screen.v.delInfo.deletedFiles[no] = [];*/
        console.log("파일 삭제 후", no);
        console.log("파일 삭제 후", screen.v.files[no]);
        console.log("파일 삭제 후", screen.v.deletedFiles);

        /*screen.v.deletedFiles[no] = screen.v.delInfo.deletedFiles;
        console.log(screen.v.deletedFiles[no]);*/
        var fileInput = document.getElementById('file-'+no);
        console.log(fileInput)
        fileInput.removeAttribute('disabled');
        // 파일 선택 라벨의 disabled 속성 제거
        var label = document.querySelector('label[for="file-' + no + '"]');
        label.removeAttribute('disabled');
        $("#"+'placeholder-'+no+"").text('파일을 첨부해 주세요.');
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

      setLink: () => {
        if(!$isLogin){
          console.log("로그인 팝업");
          screen.f.okLogin();
        }else {
          window.location.href = '/pages/common/mypage/myquest.mrn'
        }

        // /pages/common/customer/submit?faq=&searchTxt=&qnaLink=
      },

      /* setLink: () => {
         location.href = "/pages/common/customer/faq.mrn";
       },*/

      generateTemporaryKey() {
        const randomString = Math.random().toString(36).substring(2); // 무작위 문자열 생성
        return randomString;
      },

      getBoardParam: () => {

        // 내용
        /*const formData = new FormData($("#form1")[0]);*/
        const formData = new FormData($('#form1')[0]);
        console.log("폼 데이타",formData);

        /*const boardFileGroupId = !!screen.v.data ? screen.v.data.boardFileGroupId : '';
        */

        const fileList = [].concat(screen.v.files.q1, screen.v.files.q2, screen.v.files.q3);

        /*const delList = [].concat(screen.v.deletedFiles.q1, screen.v.deletedFiles.q2, screen.v.deletedFiles.q3);*/

        fileList.forEach((v) => {
          if (v instanceof File) {
            formData.append('files', v);
          }
        });

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
          var sBinf ="";
          formData.append('boardPcInfo', sBinf);
        }
        /*formData.append('deletedFiles', screen.v.delInfo.deletedFiles);*/
        /*formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));*/
        formData.append('boardCategoryCode', 'QNA');
        formData.append('directoryCode', 'QNA');
        formData.append('boardUseYn', 'Y');
        formData.append('boardDisplayYn', 'Y');
        formData.append('boardSeq',screen.v.boardSeq);
        formData.append('fileType', 'original');
        formData.append('uploadMethod', 'DIRECT');
        formData.append('boardFaqTypeCode', $('input[name=division]:checked').val());
        formData.append('boardFileGroupId', screen.v.boardFileGroupId);
        formData.append('delList', screen.v.deletedFiles);

        return formData;
      },

      resetCheck: () => {
        screen.v.fileList = [];
        screen.v.seqList = [];

      },

      returnLink: () => {
        boardSeq = screen.v.boardSeq;
        location.href = "/pages/common/mypage/myquest.mrn/"+boardSeq;
      },

    },

    event: () => {

      $('button[id=confirmButton]').on('click', () => {
        if (!screen.f.checkValidation()) {
          return;
        }
        var isConfirmed = confirm('수정을 하겠습니까?');
        screen.v.boardSeq = $('#confirmButton').val();
        screen.v.boardFileGroupId = $('#confirmButton').data('id');
        console.log(screen.v.boardFileGroupId);
        if (isConfirmed) {
          screen.c.getupdateList();
        }
      })

      $('button[id=cancelEditButton]').on('click', () => {

        var isConfirmed = confirm('수정을 취소하겠습니까?');
        screen.v.boardSeq = $('#cancelEditButton').val();

        console.log(screen.v.boardSeq)
        if (isConfirmed) {
          screen.f.returnLink();
        }
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
        const fileId = e.target.dataset.id;
        /*screen.v.delInfo.deletedFiles = $(e.currentTarget).data("id");
        console.log("로그",screen.v.delInfo.deletedFiles )*/
        const no = id.split('-')[1];
        screen.f.deleteFile(no, fileId);
      });


      document.getElementById('cancelEditButton').addEventListener('click', function() {
        // 수정, 삭제 버튼 보이기
        document.getElementById('editButton').style.display = 'inline-block';
        document.getElementById('deleteButton').style.display = 'inline-block';

        // 목록 버튼 보이기
        document.getElementById('cancelButton').style.display = 'inline-block';

        // 수정 불가능하도록 필드들 비활성화
        document.getElementById('form1').classList.add('form-disabled');
        var inputs = document.querySelectorAll('#form1 input:not([type="radio"]), #form1 textarea');
        inputs.forEach(function (input) {
          input.setAttribute('disabled', 'true');
        });

        // radio 버튼 처리
        var radioInputs = document.querySelectorAll('#form1 input[type="radio"]');
        radioInputs.forEach(function (input) {
          input.setAttribute('disabled', 'true');
        });
        document.getElementById('ox-spec').setAttribute('disabled', 'true');
        // 확인, 취소 버튼 숨기기
        document.getElementById('confirmButton').style.display = 'none';
        document.getElementById('cancelEditButton').style.display = 'none';

      });
    },

    init: () => {
      screen.event();
      screen.v.delInfo.deletedFiles=null;
    },
  };
  screen.init();
});