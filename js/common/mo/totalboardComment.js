//js 임포트 시점이 어떻게 되는지.. 파악해야할듯 임시로 바닐라js로 대체
let ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
}

ready(function() {
  let screen = {
    v: {
      userInfo: {},
      masterSeq: -1,
      resultList: [],
    },

    c: {
      /**
       * 댓글 목록 조회
       * @param {*} param 
       * @returns 
       */
      getCommentList: (param)=> {
        if(screen.v.masterSeq < 0) return;
        const options = {
					url: '/pages/api/totalboard/common/getCommentList.ax',
					method: 'GET',
					data: param,
					success: function (res) {
            screen.v.resultList = res.rows;
            screen.f.bindCommentList();
            $('[name=commentTotalCount]').text(res.totalCnt);
            $paging.bindTotalboardPaging(res);
            if($('.dropdown').length != 0) $('.dropdown').dropdown();
            $('button[name=modBtn]').off('click').on('click', screen.f.appendCommentInputBox);
            $('button[name=delCommentBtn]').off('click').on('click', screen.c.deleteComment);
          }
				};

				$cmm.ajax(options);
      },
      /**
       * 댓글 등록
       * @param {*} e 
       * @returns 
       */
      insertComment: (e)=> {
        if(!$isLogin) {
          $alert.open('MG00001');
          $(e.currentTarget).removeClass('active');
          return;
        }
        const content = $('textarea[name=insCommentContent]').val();
        if(!content) {
          $alert.open('MG00006');
          return;
        }
        if(screen.v.masterSeq < 0) {
          $alert.open('MG00033');
          return;
        }
        $alert.open('MG00007', ()=> {
          const options = {
            url: '/pages/api/totalboard/common/insertComment.ax',
            method: 'POST',
            data: {
              masterSeq: screen.v.masterSeq,
              content: content,
              linkUrl: location.pathname
            },
            success: function (res) {
              screen.c.getCommentList({masterSeq: screen.v.masterSeq});
              $('textarea[name=insCommentContent]').val('');
              $('.digits').text('0/200');
            }
          };
  
          $cmm.ajax(options);
        });
        
      },
      /**
       * 댓글 수정
       * @param {*} e 
       * @returns 
       */
      updateComment: (e)=> {
        const commentSeq = $(e.currentTarget).closest('li').find('input[name=commentSeq]').val();
        const content = $('textarea[name=modCommentContent]').val();
        if(!content) {
          $alert.open('MG00006');
          return;
        }
        if(screen.v.masterSeq < 0) {
          $alert.open('MG00033');
          return;
        }
        $alert.open('MG00009', ()=> {
          const options = {
            url: '/pages/api/totalboard/common/updateComment.ax',
            method: 'PUT',
            data: {
              commentSeq: commentSeq,
              content: content
            },
            success: function (res) {
              screen.c.getCommentList({masterSeq: screen.v.masterSeq});
              
            }
          };

          $cmm.ajax(options);
        });
      },
      /**
       * 댓글 삭제(display_yn=n업데이트)
       * @param {*} e 
       * @returns 
       */
      deleteComment: (e)=> {
        
        if(screen.v.masterSeq < 0) {
          $alert.open('MG00033');
          return;
        }
        $alert.open('MG00008', ()=> {
          const commentSeq = $(e.currentTarget).closest('li').find('input[name=commentSeq]').val();
          const options = {
            url: '/pages/api/totalboard/common/deleteComment.ax',
            method: 'PUT',
            data: {
              commentSeq: commentSeq
            },
            success: function (res) {
              screen.c.getCommentList({masterSeq: screen.v.masterSeq});
              // 댓글영역 세팅
            }
          };

          $cmm.ajax(options);
        });
      }
    },

    f: {

      /**
       * 댓글 목록 바인딩
       */
      bindCommentList: ()=> {
        const parentSelector = 'ul[name=commentList]';
        $(parentSelector).empty();
        screen.v.resultList.map((data, idx)=> {
          
          const htmlItem = `
            <li class="${data.createLoginId===screen.v.userInfo.loginId ? 'flag-my': ''}">
              <input type="hidden" name="commentSeq" value="${data.commentSeq}"/>
              <div class="split-container">
                <p class="user-id">${data.createLoginId.replace(data.createLoginId.substring(data.createLoginId.length-6), '******')}</p>
                <span class="date">${data.createDateToYMD}</span>
              </div>
              <p class="comment-text">${data.content}</p>
              
              <div class="buttons align-right">
                <button class="${data.createLoginId===screen.v.userInfo.loginId ? 'button size-sm type-light': 'button size-sm type-light display-hide'}" name="delCommentBtn">삭제</button>
                <button class="${data.createLoginId===screen.v.userInfo.loginId ? 'button size-sm type-light': 'button size-sm type-light display-hide'}" name="modBtn">수정</button>
              </div>
            </li>  
          `;
          
          $(parentSelector).append(htmlItem);
        });
        if(screen.v.resultList.length === 0) {
          const htmlItem = `
            <li>
              <div class="box-no-data"> 등록된 댓글이 없습니다. </div>
            </li>
          `;
          $(parentSelector).append(htmlItem);
        }
        
      },
      /**
       * 수정입력박스 append
       * @param {*} e 
       */
      appendCommentInputBox: (e)=> {
        e.stopImmediatePropagation();
        console.log('appendCommentInputBox');
        const commentText = $(e.currentTarget).closest('li').find('.comment-text').text();
        const htmlInputBox = `
          <div class="comment-modify textarea">
            <textarea name="modCommentContent" id="" rows="3" maxlength="200">${commentText}</textarea>
            <div class="buttons align-right">
              <button class="button size-md type-white" name="cancelCommentInputBtn">취소</button>
              <button class="button size-md type-primary-light" name="modCommentBtn">저장</button>
            </div>
          </div>
        `;
        $(e.currentTarget).closest('div.buttons').before(htmlInputBox);
        $(e.currentTarget).closest('div.buttons').addClass('display-hide');
        $(e.currentTarget).closest('li').find('.comment-text').addClass('display-hide');
        $(e.currentTarget).closest('li').removeClass();
        $(e.currentTarget).closest('li').addClass('flag-modify');
        
      },
      /**
       * 수정입력박스 remove
       * @param {*} e 
       */
      removeCommentInupBox: (e)=> {
        console.log('removeCommentInputBox');
        
        $(e.currentTarget).closest('li').removeClass();
        $(e.currentTarget).closest('li').addClass('flag-my');
        $(e.currentTarget).closest('li').children('div.buttons').removeClass('display-hide');
        $(e.currentTarget).closest('li').find('.comment-text').removeClass('display-hide');
        $('.comment-modify').remove();

      },
      
    
    },

    event: function () {

      //내가 작성한 댓글
      $('input[name=getMyCommentChk]').on('change', (e)=> {
        if(!$isLogin) {
          $alert.open('MG00001', ()=> {
            location.href = "/pages/common/User/Login.mrn";
          });
          $(e.currentTarget).prop('checked', false);
          return;
        }
        const isChecked = $(e.currentTarget).is(':checked');
        let param = { masterSeq: screen.v.masterSeq };
        if(isChecked) Object.assign(param, {createLoginId: screen.v.userInfo.loginId});
        screen.c.getCommentList(param);
      });

      //댓글 글자수 체크
      $('textarea[name=insCommentContent]').on('keyup', (e)=> $('.digits').text(`${e.currentTarget.value.length}/200`));
      //댓글 등록
      $('button[name=insCommentBtn]').on('click', screen.c.insertComment);
      //댓글 삭제
      $('button[name=delCommentBtn]').on('click', screen.c.deleteComment);
      //댓글 수정 입력박스 append
      $('button[name=modBtn]').on('click', screen.f.appendCommentInputBox);
      //댓글 수정 취소
      $(document).on('click', 'button[name=cancelCommentInputBtn]', screen.f.removeCommentInupBox);
      //댓글 수정
      $(document).on('click', 'button[name=modCommentBtn]', screen.c.updateComment);

      //페이징 이동
      $(document).on('click', 'button[type=button][name=pagingNow]', (e)=> {
        const pagingNow = e.currentTarget.value;
        let param = { masterSeq: screen.v.masterSeq };
        Object.assign(param, {pagingNow: pagingNow});
        screen.c.getCommentList(param);
      });
    },

    init: function () {
      console.log('init!', screen.v.userInfo);
      screen.v.userInfo = _.isEmpty($('[name=userInfo]').val()) ? '' : JSON.parse($('[name=userInfo]').val());
      let pathName = window.location.pathname;
      screen.v.masterSeq = parseInt(pathName.substring(pathName.lastIndexOf('/') + 1));
      screen.event();
		},
  };
  screen.init();
});