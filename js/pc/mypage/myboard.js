$(function () {
  let screen = {
    v: {
      subjectLevelCode: null,
      tabIdx: null,
      levelCode: null, // 초 중 고
      typeCode: null, // 즐겨찾기 > 선택
      urlLevel: null, // 즐겨찾기 > 링크 > ele or mid or high
      scrapType: null, // 스크랩 > 옵션
      fileList: [], // 체크된 row의 file ld list
      seqList: [], // 체크된 row의 seq
      textbookOption: null, // 내자료 > 교과서
      boardGradeCode : '',
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
      // 학급 선택 항목 disabled 설정

      // 변수 초기화



      // 페이징
      setPaging: (e) => {
        const pagingNow = e.currentTarget.value;

        if (screen.v.tabIdx === "2")
          screen.c.getCommentList(pagingNow);
        else {
          screen.c.getboardList(pagingNow);
        }
      },


      bindCommentList: (list) => {
        const tableContainer = $("#commentList");

        tableContainer.empty();

        if (list && list.length > 0) {
          // Table
          const table = $('<table>').appendTo(tableContainer);

          // Caption
          $('<caption>').text('나의 댓글 테이블').appendTo(table);

          // Colgroup
          const colgroup = $('<colgroup>').appendTo(table);
          $('<col>').attr('width', '7%').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '10%').appendTo(colgroup);

          // Thead
          const thead = $('<thead>').appendTo(table);
          const trHead = $('<tr>').appendTo(thead);
          $('<th>').attr('scope', 'col').text('NO').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시판').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시글 제목').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('댓글 내용').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('등록일').appendTo(trHead);

          // Table Body
          const tbody = $('<tbody>').appendTo(table);

          list.forEach((comment, idx) => {
            // Row
            const tr = $('<tr>').appendTo(tbody);

            // Columns
            $('<td>').text(comment.rowNum).appendTo(tr);
            $('<td>').addClass('text-left').append(
                $('<ul>').addClass('divider-group type-brace').append(
                    $('<li>').text(comment.boardPath)
                )
            ).appendTo(tr);
            $('<td>').addClass('text-left').append(
                $('<div>').addClass('inline-wrap gutter-md').append(
                    $('<a>').attr('href', comment.linkUrl).addClass('title ellipsis-multi').text(comment.title),
                    $('<span>').addClass('badge type-tail').text(comment.commentcount)
                )
            ).appendTo(tr);
            $('<td>').addClass('text-left').append(
                $('<p>').addClass('title').text(comment.content)
            ).appendTo(tr);
            $('<td>').text(comment.createDate).appendTo(tr);
          });
        } else {
          // No Data Message
          const table = $('<table>').appendTo(tableContainer);

          // Caption
          $('<caption>').text('나의 댓글 테이블').appendTo(table);

          // Colgroup
          const colgroup = $('<colgroup>').appendTo(table);
          $('<col>').attr('width', '7%').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '10%').appendTo(colgroup);

          // Thead
          const thead = $('<thead>').appendTo(table);
          const trHead = $('<tr>').appendTo(thead);
          $('<th>').attr('scope', 'col').text('NO').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시판').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시글 제목').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('댓글 내용').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('등록일').appendTo(trHead);
          tableContainer.append(`
            <div class="box-no-data">등록한 댓글이 없습니다.</div>
        `);
        }
      },

      bindBoardList: (list) => {
        const tableContainer = $("#boardList");

        tableContainer.empty();

        if (list && list.length > 0) {
          // Table
          const table = $('<table>').appendTo(tableContainer);

          // Caption
          $('<caption>').text('나의 게시글 테이블').appendTo(table);

          // Colgroup
          const colgroup = $('<colgroup>').appendTo(table);
          $('<col>').attr('width', '7%').appendTo(colgroup);
          $('<col>').attr('width', '20%').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '10%').appendTo(colgroup);

          // Thead
          const thead = $('<thead>').appendTo(table);
          const trHead = $('<tr>').appendTo(thead);
          $('<th>').attr('scope', 'col').text('NO').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시판').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시글 제목').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('등록일').appendTo(trHead);

          // Table Body
          const tbody = $('<tbody>').appendTo(table);

          list.forEach((board, idx) => {
            // Row
            const tr = $('<tr>').appendTo(tbody);
            let hrefValue = `/pages/live/${board.subjectLevelCode}/dataShare/detail.mrn?tab=${board.tabCategoryCode}&seq=${board.shareSeq}`;
            let imageValue = board.imageFileId ? `/pages/api/file/view/${board.imageFileId}` : "/assets/images/common/img-no-img.png";
            console.log(imageValue)
            // Columns
            $('<td>').text(board.rowNum).appendTo(tr);
            $('<td>').addClass('text-left').append(
                $('<ul>').addClass('divider-group type-brace').append(
                    $('<li>').text("티처 LIVE"),
                    $('<li>').text("자료나눔"),
                    $('<li>').text(board.subjectCode),
                    $('<li>').text(board.tabType),
                )
            ).appendTo(tr);
            $('<td>').addClass('text-left').append(
                $('<a>').attr('href', hrefValue).attr('target', '_blank').addClass('block-wrap').append(
                    $('<div>').addClass('img-wrap').append(
                        $('<img>').attr('src', imageValue).attr('alt', '')
                    ),
                    $('<p>').addClass('ellipsis-multi title').text(board.title)
                )
            ).appendTo(tr);
            $('<td>').text(board.createDate).appendTo(tr);
          });
        } else {
          const table = $('<table>').appendTo(tableContainer);

          // Caption
          $('<caption>').text('나의 게시글 테이블').appendTo(table);

          // Colgroup
          const colgroup = $('<colgroup>').appendTo(table);
          $('<col>').attr('width', '7%').appendTo(colgroup);
          $('<col>').attr('width', '20%').appendTo(colgroup);
          $('<col>').attr('width', '*').appendTo(colgroup);
          $('<col>').attr('width', '10%').appendTo(colgroup);

          // Thead
          const thead = $('<thead>').appendTo(table);
          const trHead = $('<tr>').appendTo(thead);
          $('<th>').attr('scope', 'col').text('NO').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시판').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('게시글 제목').appendTo(trHead);
          $('<th>').attr('scope', 'col').text('등록일').appendTo(trHead);
          // No Data Message
          tableContainer.append(`
            <div class="box-no-data">등록한 게시글이 없습니다.</div>
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

      // 스크랩 > 데이터 없음

      setOption: () => {
        const selected = $('input[name=grade]:checked').val();

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

      $("input[type=radio][name=grade]").on("click", screen.f.setOption);

    },

    init: () => {
      screen.v.subjectLevelCode = $("#subjectLevelCode").val();
      screen.v.tabIdx = "1";

      screen.event();
    },
  };
  screen.init();
});