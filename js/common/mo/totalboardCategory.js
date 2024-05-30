$(function () {
  let screen = {
    f: {

      /**
       * 카테고리 change
       * @param {*} e 
       */
      setCategoryData: (e)=> {
        console.log('setCategoryData');

        const $extra = $(e.currentTarget).parents('.filter-group').find('.extra');
        const $filterItem = $(e.currentTarget).parents('.filter-items');

        let nameList = [];
        let typeList = [];
        let valueList = [];

        // .active 버튼만 세팅
        $.each($filterItem.children('button[name^=category]'), function (index, item) {
          if ($(this).hasClass('active')) {
            nameList.push($(this).html());
            typeList.push(this.name);
            valueList.push(this.value);

            // 상단 카테고리 탭 영역 활성화
            $('[data-name=' + this.name + '][value="' + this.value + '"]').addClass('active');
          } else {
            // 상단 카테고리 탭 영역 비활성화
            $('[data-name=' + this.name + '][value="' + this.value + '"]').removeClass('active');
          }
        });

        $extra.empty();

        $.each(nameList, function (index, item) {
          if (index > 0) {
            $extra.append('&nbsp;');
          }
          $extra.append(item);
        });

        $.each(valueList, function (index, item) {
          $.each(typeList, function (index2, item2) {
            if (index == index2) {
              $extra.append('<input type="hidden" name="' + item2 + '" value="' + item + '">');
            }
          });
        });

        $ttbdAjax.getTotalboardSearchList();

      },

      /**
       * 태그 전체 해제
       * @param {*} e 
       */
      clearCategory: (e)=> {

        //태그 초기화
        $('input:hidden[name^=category]').remove();
        //버튼 초기화
        $('button[name^=category]').removeClass('active');
        // 텍스트 초기화
        $('.category-text').empty();
        // 상단 카테고리 탭 영역 비활성화
        $('button[name=filterSet]').removeClass('active');

        closePopup({id: 'popup-sheet'});

        $ttbdAjax.getTotalboardSearchList();
      },

      setCategoryTrigger: (e)=> {
        let name = $(e.currentTarget).data('name').trim();
        let value = e.currentTarget.value.trim();
        $('button[name=' + name + '][value="' + value + '"]').trigger('click');
      },


    },

    event: function () {

      //태그 전체 삭제 (카테고리 전체 해제)
      $(document).on('click', 'button[name=clearTagBtn]', screen.f.clearCategory);

      // 카테고리 선택
      $(document).on('click', 'button[name^=category]', screen.f.setCategoryData);

      // 카테고리 세팅 (탭 영역)
      $(document).on('click', 'button[name=filterSet]', screen.f.setCategoryTrigger);

    },

    init: function () {
      console.log('totalboard category init!');
      screen.event();
		},
  };
  screen.init();
});