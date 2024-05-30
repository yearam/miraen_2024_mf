$(function () {
  let screen = {
    v: {
      mainId: window.location.href?.split('/').pop(),
      downloadData: [
        {
          type: 'before',
          pdf: 'https://download.mirae-n.com/primary_all%20reading/%EB%8F%85%EC%84%9C%ED%99%9C%EB%8F%99%EC%A7%80(%EC%A0%84).pdf',
          hwp: 'FILE-lqyq23qh-lkjew0EbjF'
        },
        {
          type: 'doing',
          pdf: 'https://download.mirae-n.com/primary_all%20reading/%EB%8F%85%EC%84%9C%ED%99%9C%EB%8F%99%EC%A7%80(%EC%A4%91).pdf',
          hwp: 'FILE-lqyq23s0-76B1PsiVxO'
        },
        {
          type: 'after',
          pdf: 'https://download.mirae-n.com/primary_all%20reading/%EB%8F%85%EC%84%9C%ED%99%9C%EB%8F%99%EC%A7%80(%ED%9B%84).pdf',
          hwp: 'FILE-lqyq23tn-3i696vhjwX'
        }
      ]
    },

    c: {

    },

    f: {

      openWindow: () => {
        const options = 'width=800, height=720, top=50, left=50, scrollbars=yes'
        window.open('/pages/ele/board/specializeddata/readAllContentsModal.mrn', '_blank', options);
        options.focus();
      },

      // 초등 > 특화자료실 > 국어 > 온 작품 읽기 - 배너 클릭
      bannerClickPopUp: (e) => {
        e.preventDefault();

        screen.f.openWindow();
      },

      // (모바일) 초등 > 특화자료실 > 국어 > 온 작품 읽기 - 배너 클릭
      bannerClickPopupMobile: (e) => {
        openPopup({id: 'worksheet-download'});
      },

    },

    event: function () {

      // 배너 클릭시 - 팝업
      $('.filter-wrap .banner').on('click', screen.f.bannerClickPopUp);

      // (모바일) 배너 클릭시 - 팝업
      $('section .banner').on('click', screen.f.bannerClickPopupMobile);

      // PDF 새창
      $('button[name=pdfOpenLink]').off('click').on('click', function () {
        const type = $(this).data('type');
        const foundObject = [...screen.v.downloadData].find(item => item.type === type);
        window.open(foundObject.pdf);
      })

      // HWP 로컬 다운로드
      $('button[name=hwpFileDownload]').off('click').on('click', function () {
        const type = $(this).data('type');
        const foundObject = [...screen.v.downloadData].find(item => item.type === type);

        let link = document.createElement('a');
        link.target = '_blank';
        link.href = `/pages/api/file/down/${foundObject.hwp}`;
        link.click();
        link.remove();
      })

    },

    init: function () {
      console.log('init!');
      screen.event();
    },
  };
  screen.init();
});