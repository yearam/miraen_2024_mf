$(function () {
  let screen = {
    v: {
      mainInfo: JSON.parse($('[name=mainInfo]').val())
    },

    c: {
      getGnbList: function (categoryCode){ // 현재 1depth 만 작업됨.
        let mainId = $("input[name=mainId]").val();
        $cmm.ajax({
          url: '/pages/api/totalboard/common/getTotalboardGnbList.ax',
          method: 'GET',
          data: {
            mainId: mainId,
            categoryType: categoryCode
          },
          success: function (res) {
            let list = res.rows || [];
            for(let i=0; i<list.length; i++){
              let item = list[i];
              let element = $("#sampleGnb").clone();
              element.html(item.name).attr('href', item.pageUrl).attr('target', item.target);
              if(item.key3 == mainId){
                element.addClass('active');
              }
              $("#cmmBoardGnbList").append(element);
            }
          }
        });
      },

      doTotalboardScrap: (type, scrapYn, masterSeq, callback)=> {
        let url = '';
        let method = '';
        if(scrapYn === 'Y') {
          method = 'POST';
          url = '/pages/api/totalboard/common/insertTotalboardScrap.ax';
        }else {
          method = 'PUT';
          url = '/pages/api/totalboard/common/deleteTotalboardScrap.ax';
        }
        const options = {
					url: url,
					method: method,
					data: {
						masterSeq: masterSeq,
                        scrapType: type === 'scrapBtn' ? 'TOTALBOARD' : 'TOTALBOARD-LIKE',
                        scrapUrl: type === 'scrapBtn' ? location.pathname + '/' + masterSeq : null
					},
					success: function (res) {
						if(type === 'likeBtn') callback(masterSeq, scrapYn);
                    }
				};

				$cmm.ajax(options);
      }
    },

    f: {


      parseHtmlContent: ()=> {
        $('.editor-area').html($('.editor-area').text());
      },
      
      toggleScrap: (e)=> {
        let scrapYn = $(e.currentTarget).attr('class').indexOf('active');
        if(scrapYn > -1) {
          $(e.currentTarget).addClass('active');
          scrapYn = 'Y';
        }else {
          $(e.currentTarget).removeClass('active');
          scrapYn = 'N';
        }

        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');
          return;
        }

        const type = $(e.currentTarget).attr('name');

        if(type === 'scrapBtn' && $('#boardGrade').val() !== '002') {
          $alert.open('MG00011');
          $(e.currentTarget).removeClass('active');
          return;
        }

        // let scrapYn = $(e.currentTarget).attr('class').indexOf('active');
        // if(scrapYn > -1) scrapYn = 'Y';
        // else scrapYn = 'N';
        console.log("toggleScrap>>", scrapYn);
        const masterSeq = $(e.currentTarget).closest('div.board-buttons').find('[name=masterSeq]').val();

        screen.c.doTotalboardScrap(type, scrapYn, masterSeq, screen.f.syncLikeCount);
      },

      syncLikeCount: (masterSeq, likeYn)=> {
        
        const $count = $(`[name=masterSeq][value=${masterSeq}]`).siblings('.buttons').find('button[name=likeBtn]').find('span');
        const originCnt = $count.text();
        console.log("기존좋아요수", originCnt);
        if(likeYn === 'Y') {
          $count.text(parseInt(originCnt) + 1);
          $toast.open(`toast-like`, 'MG00055');
        }else {
          $count.text(parseInt(originCnt) - 1);
          $toast.open(`toast-like`, 'MG00056');
        }
      },

      // single file 다운로드
      downSingleFile: (e)=> {
        const type = $(e.currentTarget).data('type');
        const fileId = $(e.currentTarget).data('id');
        const linkPath = $(e.currentTarget).data('path');
        let link = document.createElement("a");

        link.target = "_blank";
        if(type === 'LINK') {
          link.href = linkPath;
        }else {
          link.href = `/pages/api/file/down/${fileId}`;  
        }
        
        link.click();
        link.remove();
      },

      // 파일 미리보기
      previewFile: (e)=> {
        const masterSeq = $(e.currentTarget).data('seq');
        const fileId = $(e.currentTarget).data('id');
        let fileType = $(e.currentTarget).data('type');
        //if(fileType === 'CMS' && $(e.currentTarget).data('cmstype') === 'video') {
        //   fileType = 'HLS';
        //}

        let previewUrl = `/pages/api/preview/viewer.mrn?source=${fileType}&file=${fileId}&referenceSeq=${masterSeq}&type=TOTALBOARD`;
        mteacherViewer.get_file_info(fileId).then(res => {
          
          screenUI.f.winOpen(previewUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      },

      //수업하기 뷰어
      playViewer: (e)=> {
        const playId = $(e.currentTarget).data('id');
        const playName = $(e.currentTarget).text();
        let playUrl = `/pages/api/preview/viewer.mrn?playlist=${playId}&playname=${playName}`;
        mteacherViewer.get_play_list_info(playId).then(res => {
          
          screenUI.f.winOpen(playUrl, 1100, 1000, null, 'preview');
        }).catch(err => {
          console.error(err);
          alert("서버 에러");
        });
      },     

      moveExternalContentUrl: (e)=> {
        let link = document.createElement('a');
        if($(e.currentTarget).data('method') === 'U0801') link.target = '_blank';
        link.href = $(e.currentTarget).data('url');
        link.click();
        link.remove();
      },

      //목록화면 이동
      moveList: (e)=> {
        let listPath = $cmm.getTotalboardUrlDelKey();
        let tabSeq = $("input[name=tabSeq]").val() || "";
        if(tabSeq != ""){
          listPath += "?tabSeq="+tabSeq;
        }
        location.href = listPath;
      },

      playCmsVideo: ()=> {
        let video = document.getElementById('video');
        if(Hls.isSupported()) {
            let hls = new Hls();
            Module.video_viewer.playlist(data.pages[0].file, 'application/x-mpegURL')
            console.log('application/x-mpegURL')
            hls.loadSource(data.pages[0].file);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
      },

      moveToMainPage: () => {
        const currentPath = window.location.pathname;

        if(currentPath.includes("ele")){
          location.replace($('[name=hostEle]').val());
        } else if(currentPath.includes("mid")) {
          location.replace($('[name=hostMid]').val());
        } else if(currentPath.includes("high")) {
          location.replace($('[name=hostHigh]').val());
        }

      }
    },

    event: function () {

 
      //스크랩, 좋아요
      $(document).on('click', '[name=likeBtn],[name=scrapBtn]', screen.f.toggleScrap);

      //공유하기
      // $(document).on('click', '[name=shareBtn]', )

      // single file 다운로드
      $(document).on('click', 'button[name=downloadBtn]', screen.f.downSingleFile);

      // 파일 미리보기
      $(document).on('click', 'button[name=previewBtn]', screen.f.previewFile);

      // 수업하기
      $(document).on('click', 'button[name=play1Btn],button[name=play2Btn]', screen.f.playViewer);

      // 외부컨텐츠URL
      $(document).on('click', 'button[name=extContUrlBtn]', screen.f.moveExternalContentUrl);

      // 목록이동
      $(document).on('click', 'button[name=listBtn]', screen.f.moveList);

    },

    init: function () {
      console.log('init!');

      // GNB 코드 정보 가져오기
      let categoryCode = $("input[name=gnbCateType]").val() || '';
      if(categoryCode != '' && $("#cmmBoardGnbList")){
        screen.c.getGnbList(categoryCode);
      }

      const readUseYn = screen.v.mainInfo?.listPageUseYn;
      const readRight = screen.v.mainInfo?.listPageRight;
      if(readUseYn === 'Y' && !!readRight) {
        
        const arrRight = readRight.split(';');
        let isRight = false;
        for(let i=0; i<arrRight.length; i++) {
          if(arrRight[i] === $('#boardRight').val()) {
            isRight = true;
            break;
          }
        }

        if(!$isLogin) {
          $alert.open('MG00004', ()=> {
            location.href = location.pathname.substring(0,location.pathname.lastIndexOf('/'));
            //$alert.open('MG00001');
          });
          return;
        }

        if(!isRight) {
          $alert.open('MG00004', ()=> {
            screen.f.moveToMainPage();
          });
          
        }
      }

      screen.event();
      screen.f.parseHtmlContent();

    },
  };
  screen.init();
});