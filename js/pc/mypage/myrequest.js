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
        deletedFiles: [],	// 삭제된 첨부파일 fileId
      },
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
            alert("등록완료");
            location.reload();
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
      /*deleteFile: (no) => {
        // 파일 배열에서 해당 인덱스의 파일 제거
        console.log(screen.v.files[no].length);
        screen.v.files[no] = [];
        console.log("파일 삭제 후", no);
        console.log("파일 삭제 후", screen.v.files[no]);

        $("input[type=file][id=file-"+ no +"]").val('');
      },*/

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

      checkLogin: () => {
        /*if (!screen.v.isLogin) {
          screen.f.resetCheck();

          $alert.open("MG00001");

          return false;
        }*/

        return true;
      },

      correctionLink: () => {
        boardSeq = screen.v.boardSeq;
        location.href = "/pages/common/mypage/myRequestcorrectionDetail.mrn/"+boardSeq;
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
          var sBinf ="";
          formData.append('boardPcInfo', sBinf);
        }
        /*formData.append('deletedFiles', screen.v.delInfo.deletedFiles);*/
        // formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append('boardCategoryCode', 'QNA');
        formData.append('directoryCode', 'QNA');
        formData.append('boardUseYn', 'Y');
        formData.append('boardDisplayYn', 'Y');
        formData.append('boardSeq',screen.v.boardSeq);
        formData.append('fileType', 'original');
        formData.append('uploadMethod', 'DIRECT');
        formData.append('boardFaqTypeCode', $('input[name=division]:checked').val());

        return formData;
      },

      resetCheck: () => {
        screen.v.fileList = [];
        screen.v.fileId = null;
        screen.v.seqList = [];

      },

      parseHtmlContent: (boardSeq)=> {
        dataIdValue = $("#content").data("content");
        const modifiedContent = dataIdValue.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
        $('.editor-area').html(modifiedContent);
        /*console.log("값!",boardSeq);
        console.log($(".text-black[data-id='" + boardSeq + "']"))
        $(".text-black[data-id='" + boardSeq + "']").html($(".text-black[data-id='" + boardSeq + "']").text());*/
      },

      downloadFile: (e) => {
        const isLogin = screen.f.checkLogin();
        /*const isRight = isLogin? screen.f.checkRight() : false;*/
        const name = e.currentTarget.name;
        let href;

        /*if (isLogin) {*/
          href = screen.f.downSingleFile(e);

          console.log(href);

            let link = document.createElement("a");

            link.target = "_blank";
            link.href = href;
            link.click();
            link.remove();

            screen.f.resetCheck();

      },

      downSingleFile: (e) => {
        console.log($(e.currentTarget).data("id"))
        screen.v.fileId = $(e.currentTarget).data("id");

        console.log(screen.v.fileId);

        return `/pages/api/file/down/${screen.v.fileId}`;
      },


      /*downloadFile: (href) => {
        $alert.open("MG00010", () => {
          let link = document.createElement("a");

          link.target = "_blank";
          link.href = href;
          link.click();
          link.remove();

          screen.f.resetCheck();
        });
      },*/

    },

    event: () => {

      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      $('button[id=edButton]').on('click', () => {
        var isConfirmed = confirm('문의하신 글을 수정하겠습니까?');
        screen.v.boardSeq = $('#edButton').val();
        console.log(screen.v.boardSeq)
            if (isConfirmed) {
              screen.f.correctionLink(screen.v.boardSeq);
            }
            else{
              alert('수정이 취소되었습니다');
            }
      });

      $('button[id=deleteButton]').on('click', () => {

        var isConfirmed = confirm('문의하신 글을 삭제하겠습니까?');
        screen.v.boardSeq = $('#deleteButton').val();
        console.log(screen.v.boardSeq)
        if (isConfirmed) {
          screen.c.getdeleteList();
        } else {
          // 사용자가 취소를 눌렀을 때
          alert('삭제가 취소되었습니다.');
        }

      });

      // 옵션(지역) 선택
      $("input[type=radio][name=division]").on("click", screen.f.setOption);

      $("input[type=checkbox][name=spec]").on("click", screen.f.setAgree);

      $('#form1').find('input[id^=file]').on('change',(e) =>{
        const file = e.target.files[0];
        const id = e.target.id;
        const no = id.split('-')[1];
        screen.f.setFile(file, no);
      });

      $(document).ready(function() {
        // data-id 속성을 갖는 요소를 선택하고 해당 속성값을 가져옵니다.
        let dataIdValue = $("#content").data("content");
        const modifiedContent = dataIdValue.replace(/src="\/api\/file\/view\//g, 'src="/pages/api/file/view/');
        screen.f.parseHtmlContent(modifiedContent)
      });

      $(document).on("click", "button[name=downbtn]", screen.f.downloadFile);
      /*document.getElementById('edButton').addEventListener('click', function() {
        // 수정, 삭제 버튼 숨기기
        var isConfirmed = confirm('수정하시겠습니까?');

        if(isConfirmed){
        document.getElementById('edButton').style.display = 'none';
        document.getElementById('deleteButton').style.display = 'none';
        screen.f.correctionLink();
        // 목록 버튼 숨기기
        document.getElementById('cancelButton').style.display = 'none';

        document.getElementById('form1').classList.add('form-disabled');
        var inputs = document.querySelectorAll('#form1 input:not([type="radio"]), #form1 textarea');
        inputs.forEach(function (input) {
          input.removeAttribute('disabled');
        });
        document.getElementById('ox-spec').removeAttribute('disabled');

        // radio 버튼 처리
        var radioInputs = document.querySelectorAll('#form1 input[type="radio"]');
        radioInputs.forEach(function (input) {
          input.removeAttribute('disabled')
        });

        // 확인, 취소 버튼 보이기
        document.getElementById('confirmButton').style.display = 'inline-block';
        document.getElementById('cancelEditButton').style.display = 'inline-block';
        }else {
          // 사용자가 취소를 눌렀을 때
          alert('수정이 취소되었습니다.');
        }
      });*/

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
      console.log("re")
      screen.event();
    },
  };
  screen.init();
});