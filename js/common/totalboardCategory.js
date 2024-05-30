$(function () {
  let screen = {
    v: {

    },

    c: {
      
    },

    f: {

      /**
       * 카테고리 change
       * @param {*} e 
       */
      setCategoryData: (e)=> {
        console.log('setCategoryData');
        //체크여부
        const isChecked = $(e.currentTarget).is(':checked');
        //카테고리코드        
        const categoryCode = e.currentTarget.value;
        //카테고리명
        const categoryName = $(e.currentTarget).next('label').text();
        //카테고리 type(학년:01, 학기:02, 과목:03, 그룹:9991 ~ 9999)
        const type = e.currentTarget.name;

        const selectedLevel = $(e.currentTarget).data('level');

        screen.f.bindCategoryTag(isChecked, type, categoryName, categoryCode, selectedLevel);

        $ttbdAjax.getTotalboardSearchList(0,true, selectedLevel);
        

      },

      /**
       * 카테고리 체크박스 데이터 Tag영역 바인딩
       * @param {*} isChecked 
       * @param {*} type 
       * @param {*} categoryName 
       * @param {*} categoryValue 
       */
      bindCategoryTag: (isChecked, type, categoryName, categoryValue, level)=> {
        console.log('bindCategoryTag');
        const parentSelector = 'div[name=categoryTagArea]';
        const tempUUID = Math.random().toString(36).substring(2);
        const htmlTag = `
          <span class="item" name="${type}" value="${categoryValue}" id="${tempUUID}" data-level="${level}">
            ${categoryName}
            <button type="button" class="button size-xs type-text type-icon" name="delTagBtn">
              <svg>
                <title>아이콘 삭제</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
              </svg>
            </button>
          </span>
        `;
        if(isChecked){
          $(parentSelector).append(htmlTag);
        }else {
          $(parentSelector).find(`[name='${type}'][value='${categoryValue}']`).remove();
        }

        if($ttbdVar.totalboardFilterReloadYn === 'Y') {
          $(parentSelector).find('span').each(function() {
            const dataLevel = parseInt($(this).attr('data-level'));

            if (dataLevel > level) {
              $(parentSelector).find(`span[data-level=${dataLevel}]`).remove();
            }
          });
        }

      },

      /**
       * 태그 개별 해제
       * @param {*} e 
       */
      deleteTag: (e)=> {
        //카테고리 type
        const type = $(e.currentTarget).closest('span').attr('name');
        //카테고리 value
        const categoryVal = $(e.currentTarget).closest('span').attr('value');

        const tempUUID = $(e.currentTarget).closest('span').attr('id');

        console.log("!@#!@#!@#" + JSON.stringify($('div[name=categoryTagArea]').find(`#${tempUUID}`)));
        
        // $('div[name=categoryTagArea]').find(`span[name=${type}][value='${categoryVal}']`).remove();
        $(`div[name=categoryTagArea] #${tempUUID}`).remove();
        console.log(type, categoryVal);
        $(`input[name=${type}][value='${categoryVal}']`).prop('checked', false).trigger('change');

        if($ttbdVar.totalboardFilterReloadYn === 'Y') {
          const selectedLevel = $(e.currentTarget).data('level');
          $ttbdAjax.getTotalboardSearchList(0,true, selectedLevel);
        }
      },

      /**
       * 태그 전체 해제
       * @param {*} e 
       */
      clearCategory: (e)=> {

        //태그 초기화
        $('div[name=categoryTagArea]').empty();
        //체크박스 초기화
        $('input[name^=category]').prop('checked', false);

        if($ttbdVar.totalboardFilterReloadYn === 'Y') {
          const categoryList = $(`div.filters div.ox-group span.ox`);
          categoryList.removeClass('display-hide');
        }
        $ttbdAjax.getTotalboardSearchList();
      },


    },

    event: function () {

      //카테고리 체크박스
      $(document).on('change', 'input[type=checkbox][name^=category]', screen.f.setCategoryData);

      //태그 개별 삭제
      $(document).on('click', 'button[name=delTagBtn]', screen.f.deleteTag);
      
      //태그 전체 삭제 (카테고리 전체 해제)
      $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearCategory);

    },

    init: function () {
      console.log('totalboard category init!');
      screen.event();
		},
  };
  screen.init();
});