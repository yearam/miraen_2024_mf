let unitPopupScreen

$(function(){
  unitPopupScreen= {
    v :{

    },
    c:{

      // 교과서 차시, 수업 정보
      getUnitList: (subjectSeq) => {
        const options = {
          url: '/pages/api/textbook-unit/unitListTo2Depth.ax',
          data: {
            masterSeq: textbookDetailScreen.v.masterSeq,
          },
          method: 'GET',
          async: false,
          success: function (res) {
            console.log("getUnitList result: ", res);

            unitPopupScreen.f.setUnitList(res.rows);

          }
        };
        $.ajax(options);
      },


      getParameterList: (unitSeq) => {
        let bodyClasses = $('body').attr('class').split(' ');
        let currentLevel = 'mid';

        if ($.inArray('theme-high', bodyClasses) !== -1) {
          currentLevel = 'high';
        }

        const options = {
          url: `/pages/${currentLevel}/textbook/reference/getParameterList.ax`,
          data: {
            masterSeq: textbookDetailScreen.v.masterSeq,
            unitSeq
          },
          method: 'GET',
          async: false,
          success: function (res) {
            console.log("getParameterList result: ", res.rows);

            if (res.rows.length === 0) {
              $alert.open('MG00058');
            } else {
              let paramsArray = [];

              for (let i = 0; i < res.rows.length; i++) {
                let currentItem = res.rows[i];

                if (currentItem !== null && currentItem !== undefined) {
                  if (currentItem && (currentItem.parameter || currentItem.params)) {
                    let newItem = {
                      params: currentItem.parameter || currentItem.params
                    };
                    paramsArray.push(newItem);
                  }
                }
              }

              $multidown.open(paramsArray);
            }

          }
        };
        $.ajax(options);
      },


    },

    f:{
      setUnitList: function (list) {
        $('#popup-chapter .table-items tbody').html('') // 단원리스트 초기화
        $.each(list, function(index, item) {
          if (item.depth === 1) {
            // HTML 엘리먼트 생성 예시 (이 부분을 실제로 필요한 형태로 수정해주세요)
            let htmlElement = `
              <tr>
                  <th scope="row">
                  <a href="" class="ellipsis-single" data-type="unitName" data-unitseq="${item.unitSeq}">
                    ${item.unitNumberName ? (item.unitNumberName.includes('.') ? item.unitNumberName : item.unitNumberName + '.') : ''}
                    ${item.unitName}
                  </a>
                  <td>
                      <button data-btn-type="download" data-unitseq="${item.unitSeq}" class="button size-sm type-icon">
                          <svg>
                              <use href="/assets/images/svg-sprite-solid.svg#icon-download"></use>
                          </svg>
                      </button>
                  </td>
              </tr>
            `

            // 여기에서 생성한 엘리먼트를 필요한 곳에 추가하거나 다른 작업을 수행할 수 있습니다.
            // 예시로 body에 추가하는 코드
            $('#popup-chapter .table-items tbody').append(htmlElement);
          }
        });

        $('button[data-btn-type="download"], a[data-type="unitName"]').on('click', function(e) {
          const unitSeq = $(this).data('unitseq');
          console.log("unitseq: ", unitSeq)

          unitPopupScreen.c.getParameterList(unitSeq);
        })
      },


    },

    event : function() {
      $('#popup-chapter .footer button, #popup-chapter .close-button').on('click', function () {
        $('#popup-chapter').css('display', 'none');
      })

      $('tr a').on('click', function (e) {
        e.preventDefault();
      })
    },

    init : async function (){
      console.log('단원별 다운로드 팝업 init');

      unitPopupScreen.c.getUnitList();

      unitPopupScreen.event();
    }
  };

  // 팝업 열었을 때에만 호출
  unitPopupScreen.init();
})


