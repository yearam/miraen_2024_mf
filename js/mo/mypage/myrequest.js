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
            screen.f.setLink();
          }
        };
        $cmm.ajax(option);
      },



    },


    f: {

      setLink: () => {
        if(!$isLogin){
          console.log("로그인 팝업");
          screen.f.okLogin();
        }else {
          window.location.href = '/pages/common/mypage/myquest.mrn'
        }

        // /pages/common/customer/submit?faq=&searchTxt=&qnaLink=
      },

      correctionLink: () => {
        boardSeq = screen.v.boardSeq;
        location.href = "/pages/common/mypage/myRequestcorrectionDetail.mrn/"+boardSeq;
      },

      resetCheck: () => {
        screen.v.fileList = [];
        screen.v.fileId = null;
        screen.v.seqList = [];

      },

      downloadFile: (e) => {
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

    },

    event: () => {

      $('a[id=edButton]').on('click', () => {
        var isConfirmed = confirm('문의하신 글을 수정하겠습니까?');
        screen.v.boardSeq = $('#edButton').attr('name');
        console.log(screen.v.boardSeq)
            if (isConfirmed) {
              screen.f.correctionLink(screen.v.boardSeq);
            }
            else{
              alert('수정이 취소되었습니다');
            }
      });

      $('a[id=deleteButton]').on('click', () => {

        var isConfirmed = confirm('문의하신 글을 삭제하겠습니까?');
        screen.v.boardSeq = $('#deleteButton').attr('name');
        console.log(screen.v.boardSeq)
        if (isConfirmed) {
          screen.c.getdeleteList();
        } else {
          // 사용자가 취소를 눌렀을 때
          alert('삭제가 취소되었습니다.');
        }

      });

      $(document).on("click", "button[name=downbtn]", screen.f.downloadFile);
    },

    init: () => {
      screen.event();
    },
  };
  screen.init();
});