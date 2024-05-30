$(function () {
  let screen = {
    v: {
      subjectLevelCode: null,
      tabIdx: null,
      levelCode: null, // 초 중 고
      boardGradeCode : 'MT0021',
      masterSeq: '',
      pagingNow: 0
    },

    c: {
      getCommentList: (pagingNow) => {

        screen.v.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
        console.log(screen.v)

        const option = {
          method: "POST",
          url: "/pages/common/mypage/getCommentList.ax",
          data: {
            boardGradeCode: screen.v.boardGradeCode,
            pagingNow : screen.v.pagingNow,
            masterSeq : screen.v.masterSeq
          },
          success: (res) => {
            console.log(res)
            screen.f.bindCommentList(res.rows);
            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(option);
      },

      getboardList: (pagingNow) => {

        screen.v.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
        console.log(screen.v)

        const option = {
          method: "POST",
          url: "/pages/common/mypage/getboardList.ax",
          data: {
            pagingNow : screen.v.pagingNow,
          },
          success: (res) => {
            console.log(res)
            screen.f.bindBoardList(res.rows);
            $paging.bindTotalboardPaging(res);
          }
        };

        $cmm.ajax(option);
      },

    },

    f: {

      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;

        if (screen.v.tabIdx === "2" || screen.v.tabIdx === "2-1")
          screen.c.getCommentList(pagingNow);
        else {
          screen.c.getboardList(pagingNow);
        }
      },


      bindCommentList: (list) => {
        const tableContainer = $("#commentList");

        tableContainer.empty();

        if (list && list.length > 0) {
          list.forEach((comment, idx) => {
            tableContainer.append(`
              <a href="${comment.linkUrl}" class="item comment">
                <div class="inner-wrap">
                  <div class="text-wrap">
                    <p class="desc">${comment.title}</p>
                  </div>
                </div>
                <div class="list-info">
                  <ul class="divider-group">
                    <li>${comment.createDate}</li>
                  </ul>
                </div>
                <div class="qna-comment">
                  <div class="comment-inner">
                    <ul class="divider-group type-brace">
                      <li>${comment.boardPath}</li>
                    </ul>
                    <p class="title">${comment.content}</p>
                  </div>
                  <span class="badge type-tail">${comment.commentcount}</span>
                </div>
              </a>
            `);
          });
        } else {
          tableContainer.append(`
            <div class="box-no-data">
              <p class="title">등록된 댓글이 없습니다.</p>
            </div>
        ` );
        }
      },

      bindBoardList: (list) => {
        const tableContainer = $("#boardList");

        tableContainer.empty();

        if (list && list.length > 0) {
          list.forEach((board, idx) => {
            let hrefValue = `/pages/live/${board.subjectLevelCode}/dataShare/detail.mrn?tab=${board.tabCategoryCode}&seq=${board.shareSeq}`;
            let imageValue = board.imageFileId ? `/pages/api/file/view/${board.imageFileId}` : "/assets/images/common/img-no-img.png";

            tableContainer.append(`
                <a href="${hrefValue}" target="_blank" class="item my-list">
                  <ul class="divider-group type-brace">
                    <li>티처 LIVE</li>
                    <li>자료나눔</li>
                    <li>${board.subjectCode}</li>
                    <li>${board.tabType}</li>
                  </ul>
                  <div class="item-inner">
                    <div class="image-wrap">
                      <img src="${imageValue}" alt="">
                    </div>
                  </div>
                  <div class="inner-wrap">
                    <div class="text-wrap">
                      <p class="desc">${board.title}</p>
                      <p class="date">${board.createDate}</p>
                    </div>
                  </div>
                </a>
            `);
          });
        } else {
          tableContainer.append(`
            <div class="box-no-data">
              <p class="title">등록된 게시글이 없습니다.</p>
            </div>
        `);
        }
      },

      clickTab: (e) => {
        screen.v.tabIdx = $(e.target).closest("a").attr("href").replace("#tab", "");

        /*screen.f.init();*/

        switch (screen.v.tabIdx) {
          case "1":
            screen.c.getboardList();
            break;
          case "2":
            screen.c.getCommentList();
            break;
        }
      },

      setOption: (e) => {
        const selected = $(e.currentTarget).attr('name');

        console.log("옵션",selected)

        screen.v.boardGradeCode = selected;
        /*screen.v.masterSeq =seq;*/
        screen.c.getCommentList();
      },


    },

    event: () => {
      // 탭 클릭
      $(".tab li").on("click", screen.f.clickTab);

      // 페이징
      $(document).on("click", "button[type=button][name=pagingNow]", screen.f.setPaging);

      $("a.grade").on("click", screen.f.setOption);

    },

    init: () => {
      screen.v.subjectLevelCode = $("#subjectLevelCode").val();
      screen.v.tabIdx = "1";

      screen.event();
    },
  };
  screen.init();
});