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



    },


    f: {

      setFile: (file, no) => {
        console.log("파일",file)

        let maxSize = 10 * 1024 * 1024;

        let fileName = file.name

        console.log(fileName);

        let validExtensions = ['jpg', 'jpeg', 'png', 'bmp','mp4','mp3','hwp','doc','pptx','pdf','xls','zip'];  // 허용되는 확장자
        let fileExtension = fileName.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
          $("input[type=file][id=file-"+ no +"]").val('');
          $alert.open('MG00064');
          return
        }

        if (file.size > maxSize) {
          screen.v.files[no]=[];
          $("input[type=file][id=file-"+ no +"]").val('');
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

      setOption: (e) => {
        closePopup({id: 'popup-sheet-check'});

        $('input[name=division]').val($(e.currentTarget).attr('name'));

        $('.select.button').empty();
        $('.select.button').append(`
            ${$(e.currentTarget).html()}<svg>
              <title>아이콘 - icon-chevron-down</title>
              <use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-down"></use>
            </svg>
        `);
      },

      checkValidation: () => {

        var requiredFields = ['division', 'boardTitle', 'boardContent'];

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
        $("#"+'placeholder-'+no+"").text('파일을 첨부해 주세요.');
        $("input[type=file][id=file-"+ no +"]").val('');
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
        formData.append('boardFaqTypeCode', $('input[name=division]').val());
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
      $(".division-value").on("click", screen.f.setOption);

      $("input[type=checkbox][name=spec]").on("click", screen.f.setAgree);

      $('#form1').find('input[id^=file]').on('change',(e) =>{
        const file = e.target.files[0];
        const id = e.target.id;
        const no = id.split('-')[1];
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


    },

    init: () => {
      screen.event();
      screen.v.delInfo.deletedFiles=null;
    },
  };
  screen.init();
});