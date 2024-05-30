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

      getrequestList: (pagingNow) => {

        screen.v.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
        console.log(screen.v)

        const option = {
          method: "POST",
          url: "/pages/common/mypage/getSiteBoardPageList.ax",
          data: {
            boardCategoryCode: 'QNA',
            pagingNow : screen.v.pagingNow,
          },
          success: (res) => {
            console.log(res)
            screen.f.bindrequestList(res.rows);
            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(option);
      },
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
        console.log("자",pagingNow);
        screen.c.getrequestList(pagingNow);
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

      bindrequestList: (list) => {
        const tableContainer = $(".board-items.qna");

        tableContainer.empty();

        if (list && list.length > 0) {
          list.forEach((requestItem, idx) => {
            const value ="/pages/common/mypage/myquest.mrn/"

            tableContainer.append(`
              <a class="item" href="${value}${requestItem.boardSeq}">
                <div class="list-info">
                  <ul class="divider-group">
                    <li>${requestItem.boardFaqTypeNm}</li>
                    <li>${requestItem.createDate}</li>
                  </ul>
                  <span class="${requestItem.boardReplyYn === '답변완료' ? 'badge type-round-box fill-primary' : 'badge type-round-box fill-gray-100'}">${requestItem.boardReplyYn}</span>
                </div>
                <div class="inner-wrap">
                  <div class="text-wrap">
                    <p class="desc">${requestItem.boardTitle}</p>
                  </div>
                </div>
               </a>
            `);
          });
        } else {
          tableContainer.append(`
            <div class="box-no-data"> 등록된 문의 내역이 없습니다. </div>
          `);
        }
      },


    },

    event: () => {

      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

    },

    init: () => {
      screen.event();
    },
  };
  screen.init();
});