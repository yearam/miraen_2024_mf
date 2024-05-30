$(function () {
  let screen = {
    v: {

    },

    c: {

    },

    f: {


      parseHtmlContent: () => {
        $('.editor-area').html($('.editor-area').text());
      },


      // single file 다운로드
      downSingleFile: (e) => {
        const fileId = $(e.currentTarget).data('id');
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
        let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}`;
        mteacherViewer.get_file_info(fileId).then(res => {

          screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      },

      moveExternalContentUrl: (e) => {
        let link = document.createElement('a');
        if ($(e.currentTarget).data('method') === 'U0801') link.target = '_blank';
        link.href = $(e.currentTarget).data('url');
        link.click();
        link.remove();
      },

      //목록화면 이동
      moveList: (e) => {
        location.href = $cmm.getTotalboardUrlDelKey();
      }
    },

    event: function () {


      // single file 다운로드
      $(document).on('click', 'button[name=downloadBtn]', screen.f.downSingleFile);

      // 파일 미리보기
      $(document).on('click', 'button[name=previewBtn]', screen.f.previewFile);

      // 외부컨텐츠URL
      $(document).on('click', 'button[name=extContUrlBtn]', screen.f.moveExternalContentUrl);

      // 목록이동
      $(document).on('click', 'button[name=listBtn]', screen.f.moveList);

    },

    init: function () {
      console.log('init!');
      screen.event();
      screen.f.parseHtmlContent();


    },
  };
  screen.init();
});