let categoryPopupScreen

$(function(){
  categoryPopupScreen= {
    v :{

    },
    c:{

      // 카테고리 목록 가져오기
      getReferenceCategoryList: (classGubun) => {
        const options = {
          url: '/pages/api/textbook-refer/referenceCategoryList.ax',
          data: {
            masterSeq: textbookDetailScreen.v.masterSeq,
            unitSeq: 0,
            classGubun: classGubun,
          },
          method: 'GET',
          async: false,
          success: function (res) {
            console.log("getReferenceCategoryList result: ", res);

            categoryPopupScreen.f.setCategoryList(res.rows, classGubun);

          }
        };
        $.ajax(options);
      },

      // 카테고리별 자료 가져오기
      getReferenceDataListByCategory: (classGubun, categorySeqList) => {
        const options = {
          url: '/pages/api/textbook-refer/referenceDataListByCategory.ax',
          data: {
            masterSeq: textbookDetailScreen.v.masterSeq,
            unitSeq: 0,
            classGubun: classGubun,
            categorySeq: categorySeqList.toString(),
            pageType: 'LIST',
            pageNo: 1,
            pageCount: 1000
          },
          method: 'GET',
          async: false,
          success: function (res) {
            console.log("getReferenceDataListByCategory result: ", res);

            // 멀티 다운로드 연결
            let paramsArray = [];

            for (let i = 0; i < res.rows.length; i++) {
              let currentItem = res.rows[i];

              if (currentItem !== null && currentItem !== undefined) {
                if (currentItem && currentItem.params) {
                  let newItem = {
                    params: currentItem.params
                  };
                  paramsArray.push(newItem);
                }
              }
            }

            console.log("paramsArray: ", paramsArray)

            $multidown.open(paramsArray);

          }
        };
        $.ajax(options);
      },


    },

    f:{
      setCategoryList: function (list, category) {
        $('table[table-type=' + category + '] tbody').html(''); // 초기화

        if (list.length === 0) {
          if (category === '001') {
            $('#popup-type-data .block-wrap .table-items:nth-child(1)').css('display', 'none');
          } else if (category === '002') {
            $('#popup-type-data .block-wrap .table-items:nth-child(2)').css('display', 'none');
          } else if (category === '003') {
            $('#popup-type-data .block-wrap .table-items:nth-child(3)').css('display', 'none');
          } else if (category === '004') {
            $('#popup-type-data .block-wrap .table-items:nth-child(4)').css('display', 'none');
          }
        }

        $.each(list, function(index, item){
            let htmlElement = `
              <tr>
                  <th scope="row"><a href="">${item.name}</a></th>
                  <td>
                      <button 
                        class="button size-sm type-icon" 
                        btn-type="download-btn" 
                        data-seq1="${item.seq1}" 
                        data-seq2="${item.seq2}"
                        data-class-gubun="${category}"
                      >
                        <svg>
                            <use href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                        </svg>
                      </button>
                  </td>
              </tr>
            `

          $('table[table-type=' + category + '] tbody').append(htmlElement);
        });

        $('tr a').on('click', function (e) {
          e.preventDefault();
        })

        // 다운로드 버튼
        $('#popup-type-data button[btn-type="download-btn"]').off('click').on('click', function () {
          let categorySeqList = [];
          const classGubun = $(this).data('class-gubun');
          categorySeqList.push($(this).data('seq1'));
          categorySeqList.push($(this).data('seq2'));

          categoryPopupScreen.c.getReferenceDataListByCategory(classGubun, categorySeqList)
        })
      },
    },

    event : function() {
      $('#popup-type-data .footer button, #popup-type-data .close-button').on('click', function () {
        $('#popup-type-data').css('display', 'none');
      })
    },

    init : async function (){
      console.log('유형별 다운로드 팝업 init');

      categoryPopupScreen.event();
    }
  };

  // 팝업 열었을 때에만 호출
  categoryPopupScreen.init();
})


