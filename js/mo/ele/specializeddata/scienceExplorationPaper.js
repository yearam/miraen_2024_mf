$(function () {
  let screen = {
    v: {
      // file_group_id = FILEGR-ls14z7sk-aouwM0lM3e
      // 나중에 CMS 파일 어드민에서 업로드하고 파일 아이디 바꿔주고 (전체파일, CMS 미리보기)
      scienceExplorationFileId: 'FILE-SCIEXP-', // 학년 학기별 전체 파일
      unitFileId: 'FILE-SCIEXP-UNIT-' // 미리보기 - CMS
    },

    c: {

    },

    f: {

      // single file 다운로드
      downSingleFile: (fileId) => {
        let link = document.createElement("a");

        link.target = "_blank";
        link.href = `/pages/api/file/down/${fileId}`;
        link.click();
        link.remove();
      },

      // 파일 미리보기
      previewFile: (e) => {
        const fileId = $(e.currentTarget).data('id');
        let fileType = $(e.currentTarget).data('type');
        if (fileType === 'CMS' && $(e.currentTarget).data('cmstype') === 'video') {
          fileType = 'HLS';
        }
        let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${screen.v.unitFileId}${fileId}`;
        mteacherViewer.get_file_info(fileId).then(res => {

          screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      },

      // N학년 N학기 > 학기 자료 전체 다운로드
      gradeSemesterFileDownload: (grade, semester) => {
        const fileId = screen.v.scienceExplorationFileId + grade.toString().padStart(2, '0') + semester.toString().padStart(2, '0');
        screen.f.downSingleFile(fileId);
      },

      // N학년 N학기 설정
      showGradeSemesterTable: () => {
        let gradeArr = [];
        let semesterArr = [];
        let gradeHtmlArr = [];
        let semesterHtmlArr = [];

        $.each($('.filter-wrap button[name=gradeBtn]'), function (index, item) {
          if ($(this).hasClass('active')) {
            gradeArr.push($(this).data('name'));
            if (index > 0) gradeHtmlArr.push(' ');
            gradeHtmlArr.push($(this).html());
          }
        });

        $.each($('.filter-wrap button[name=semesterBtn]'), function (index, item) {
          if ($(this).hasClass('active')) {
            semesterArr.push($(this).data('name'));
            if (index > 0) semesterHtmlArr.push(' ');
            semesterHtmlArr.push($(this).html());
          }
        });

        $('.table-wrap').addClass('display-hide');

        if (gradeArr.length == 0 && semesterArr.length == 0) {

          $('.table-wrap').removeClass('display-hide');

        } else if (gradeArr.length > 0 && semesterArr.length > 0) {

          if (semesterArr.length > gradeArr.length) {
            for (let semester of semesterArr) {
              for (let grade of gradeArr) {
                $('.table-wrap[data-grade=' + grade + '][data-semester=' + semester + ']').removeClass('display-hide');
              }
            }
          } else {
            for (let grade of gradeArr) {
              for (let semester of semesterArr) {
                $('.table-wrap[data-grade=' + grade + '][data-semester=' + semester + ']').removeClass('display-hide');
              }
            }
          }

        } else {

          for (let grade of gradeArr) {
            $('.table-wrap[data-grade=' + grade + ']').removeClass('display-hide');
          }

          for (let semester of semesterArr) {
            $('.table-wrap[data-semester=' + semester + ']').removeClass('display-hide');
          }

        }

        // 필터 팝업 텍스트 영역 추가
        $($('.filter-list > li')[0]).find('.extra').html(gradeHtmlArr);
        $($('.filter-list > li')[1]).find('.extra').html(semesterHtmlArr);

      },

      clearCategory: (e)=> {

        $('button[name=gradeBtn]').removeClass('active');
        $('button[name=semesterBtn]').removeClass('active');

        closePopup({id: 'popup-sheet'});

        screen.f.showGradeSemesterTable();
      },

    },

    event: function () {

      // N학년 N학기 > 학기 자료 전체 다운로드
      $(document).on('click', '.table-wrap .inner-header button',
        function (e) {
          e.preventDefault();

          const grade = $(e.currentTarget).parents('.table-wrap').data('grade');
          const semester = $(e.currentTarget).parents('.table-wrap').data('semester');
          screen.f.gradeSemesterFileDownload(grade, semester);
        }
      );

      // N학년 필터 클릭
      $(document).on('click', 'button[name=gradeCategoryBtn]', function () {
        $('.filter-wrap .filter-items').removeClass('display-show');
        $('.filter-wrap .filter-items').addClass('display-hide');

        if($(this).hasClass('active')) $('#grade-category-filter').addClass('display-show');
      });

      // N학기 필터 클릭
      $(document).on('click', 'button[name=semesterCategoryBtn]', function () {
        $('.filter-wrap .filter-items').removeClass('display-show');
        $('.filter-wrap .filter-items').addClass('display-hide');

        if($(this).hasClass('active')) $('#semester-category-filter').addClass('display-show');
      });

      // N학년 클릭
      $(document).on('click', 'button[name=gradeBtn]', function () {
        let data = $(this).data('name');

        if($(this).hasClass('active')) {
          $('button[name=gradeBtn][data-name=' + data + ']').addClass('active');
        } else {
          $('button[name=gradeBtn][data-name=' + data + ']').removeClass('active');
        }

        screen.f.showGradeSemesterTable();
      });

      // N학기 클릭
      $(document).on('click', 'button[name=semesterBtn]', function () {
        let data = $(this).data('name');

        if($(this).hasClass('active')) {
          $('button[name=semesterBtn][data-name=' + data + ']').addClass('active');
        } else {
          $('button[name=semesterBtn][data-name=' + data + ']').removeClass('active');
        }

        screen.f.showGradeSemesterTable();
      });

      //태그 전체 삭제 (카테고리 전체 해제)
      $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearCategory);


      // 파일 미리보기
      $(document).on('click', 'button[name=previewBtn]',
        function (e) {
          e.preventDefault();
          screen.f.previewFile(e);
        }
      );

    },

    init: function () {
      console.log('과학 다른 탐구 활동지 - init!');
      screen.event();
    },
  };
  screen.init();
});