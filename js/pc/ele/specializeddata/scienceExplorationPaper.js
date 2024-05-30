$(function () {
  let screen = {
    v: {
      // file_group_id = FILEGR-ls14z7sk-aouwM0lM3e
      // 나중에 CMS 파일 어드민에서 업로드하고 파일 아이디 바꿔주고 (전체파일, CMS 미리보기)
      scienceExplorationFileId: 'FILE-SCIEXP-', // 학년 학기별 전체 파일
      unitFileId: 'FILE-SCIEXP-UNIT-', // 미리보기 - CMS
      grade: '3',    // 학년
      semester: '1'  // 학기
    },

    c: {

    },

    f: {

      // single file 다운로드
      downSingleFile: (downloadLink) => {
        let link = document.createElement("a");

        link.target = "_blank";
        link.href = `${downloadLink}`;
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
      gradeSemesterFileDownload: () => {
        const fileId = screen.v.scienceExplorationFileId + screen.v.grade.padStart(2, '0') + screen.v.semester.padStart(2, '0');
        screen.f.downSingleFile(fileId);
      },

      // N학년 N학기 설정
      showGradeSemesterTable: () => {
        const currentGradeSemester = `${screen.v.grade}-${screen.v.semester}`

        $(".table-wrap[data-id='" + currentGradeSemester + "']").removeClass("display-hide");
        $(".table-wrap:not([data-id='" + currentGradeSemester + "'])").addClass("display-hide");

      },

      checkRight: () => {
        let isRight = false;

        /*
        * 정회원 0010
          준회원 0020
          일반회원 0030
          예비교사 회원 0040
          학원 강사 회원 0050
        * */

        if ($('#boardRight').val() === "0010") {
          isRight = true;
        }

        return isRight
      },

      // 권한 체크 후 다운로드
      fileDownloadAfterRightCheck: (e) => {
        e.preventDefault();

        const link = $(e.currentTarget).attr('href');

        console.log(link)

        if (!$isLogin) {
          $alert.open('MG00001');
          return;
        }

        const isRight = screen.f.checkRight();

        if (isRight) {
          screen.f.downSingleFile(link);
        } else {
          $alert.open('MG00047');
          return;
        }

      },



    },

    event: function () {

      /**
       * 지역별 카드
       * */

      // 지역별 카드 > 선택된 지역
      $(document).on('click', '.area-selector input[name=area]', function () {
        const areaId = $(this).attr('id');
        screen.v.areaIdNum = areaId.split('-')[1].padStart(2, '0');
      });

      // N학년 N학기 > 학기 자료 전체 다운로드
      $(document).on('click', '.table-wrap .inner-header .extra a', screen.f.fileDownloadAfterRightCheck);


      // N학년 클릭
      $(document).on('click', '.filters input[name=ox-filter1]', function () {
        const gradeId = $(this).attr('id');
        screen.v.grade = (parseInt(gradeId.split('-')[2]) + 2).toString();

        screen.f.showGradeSemesterTable();
      });

      // N학기 클릭
      $(document).on('click', '.filters input[name=ox-filter2]', function () {
        const semesterId = $(this).attr('id');
        screen.v.semester = semesterId.split('-')[2];

        screen.f.showGradeSemesterTable();
      });


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