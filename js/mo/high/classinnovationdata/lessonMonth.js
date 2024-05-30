$(function () {
    let screen = {
        v: {
            searchCondition: {},
            resultList: [],
            totalCnt: $('[name=totalCnt]').val(),
        },

        c: {
            getTotalboardSearchList: (pagingNow) => {

                screen.v.searchCondition.searchType = $('#searchType').val();
                screen.v.searchCondition.sortType = $('#sortType').val();
                screen.v.searchCondition.searchTxt = $('input[name=searchTxt]').val();
                screen.v.searchCondition.pagingNow = _.isNil(pagingNow) ? 0 : pagingNow;
                console.log(screen.v.searchCondition);

                const options = {
                    url: '/pages/high/board/classinnovationdata/getTotalboardSearchList.ax',
                    method: 'GET',
                    data: {
                        searchCondition: JSON.stringify(screen.v.searchCondition),
                        /*mainId: $cmm.getTotalboardkeyFromUrl()*/
                    },
                    success: function (res) {
                        console.log(res);
                        screen.v.resultList = res.rows;

                        if(res.totalCnt > 0){
                            $("[data-name='noDataBox']").addClass("display-hide");
                            $("[data-name='noDataBox']").removeClass("display-show");

                            if(res.totalCnt > 12) {
                                $('.pagination').removeClass('display-hide');
                                $('.pagination').addClass('display-show-flex');
                            } else {
                                $('.pagination').removeClass('display-show-flex');
                                $('.pagination').addClass('display-hide');
                            }

                        } else {
                            $("[data-name='noDataBox']").removeClass("display-hide");
                            $("[data-name='noDataBox']").addClass("display-show");

                            $('.pagination').removeClass('display-show-flex');
                            $('.pagination').addClass('display-hide');
                        }

                        screen.f.bindDataList();
                        $paging.bindTotalboardPaging(res);
                        toggleThis('.toggle-this');
                    }
                };

                $cmm.ajax(options);
            },

        },

        f: {
            setPageNo: function (pageNo) {
                pageNo ? screenRef.v.getTabListOption.pageNo = pageNo : "";
            },

            goDetail: (e)=> {
                const isRight = screen.f.checkRight();

                if (!$isLogin) {
                    $alert.open('MG00001');
                    return;
                }
                if(isRight) {
                    console.log(">>>>>>",$(e.currentTarget));
                    // $(e.currentTarget).attr('href', location.pathname + '/' + $(e.currentTarget).data('seq'));
                    location.href = location.pathname + '/' + $(e.currentTarget).data('seq');
                }else {
                    $alert.open('MG00004');
                    return;
                }
            },

            checkRight: () => {
                let isRight = false;

                if ($('#userGrade').val() === "002") {
                    isRight = true;
                }

                return isRight
            },

            setCombo: () => {
                $combo.setCmmCd(['TB0310', 'TB0340']);
            },

            loginCheck: (e) => {
                e.preventDefault();
                $alert.open('MG00001');
                return;
            },

            setCategoryData: (e) => {
                console.log('setCategoryData');

                if (!screen.v.searchCondition[type]) screen.v.searchCondition[type] = new Array();
                if (isChecked) {
                    screen.v.searchCondition[type].push(categoryCode);
                } else {
                    screen.v.searchCondition[type] = [...screen.v.searchCondition[type]].filter((data) => data !== categoryCode);
                    if (screen.v.searchCondition[type].length === 0) delete screen.v.searchCondition[type];
                }

                /*screen.f.bindCategoryTag(isChecked, type, categoryName, categoryCode);*/

                screen.c.getTotalboardSearchList();

            },


            getVideoTimeForm: (type, duration) => {
                let result = '';

                type === 'min' ?
                    result = parseInt(!duration ? 0 : duration / 60)
                    : result = parseInt(!duration ? 0 : duration % 60);

                return result;
            },

            bindCategoryTag: (isChecked, type, categoryName, categoryValue) => {
                console.log('bindCategoryTag');
                const parentSelector = 'div[name=categoryTagArea]';
                const htmlTag = `
          <span class="item" name="${type}" value="${categoryValue}">
            ${categoryName}
            <button type="button" class="button size-xs type-text type-icon" name="delTagBtn">
              <svg>
                <title>아이콘 삭제</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-close"></use>
              </svg>
            </button>
          </span>
        `;
                if (isChecked) {
                    $(parentSelector).append(htmlTag);
                } else {
                    $(parentSelector).find(`[value='${categoryValue}']`).remove();
                }

            },

            bindDataList: () => {

                /*const scrapHide = screen.v.mainInfo.scrapUseYn === 'Y' ? '' : ' display-hide';
                const shareHide = screen.v.mainInfo.shareUseYn === 'Y' ? '' : ' display-hide';*/
                const parentSelector = $('#boardjest');
                $(parentSelector).empty();
                screen.v.resultList.map((data, idx) => {
                    const $item = $('<div class="item "></div>');
                    const htmlItem1 = `
            <div class="item-inner">
              <div class="image-wrap">
                <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
                <div class="info-media${data.fileYn === 'N' ? ' display-hide' : ''}">
                   <div class="info-media">
                      ${!$text.isEmpty(data?.videoPlayTime) ? '<span class="time">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
                   </div>
                </div>
              </div>
            </div>
          `;
                    const htmlItem2 = `
            <div class="inner-wrap" xmlns="http://www.w3.org/1999/html">
              <div class="text-wrap">
                  <ul class="divider-group">
                     <li>${data.name}</li>
                  </ul>
                    ${'<a name="detailLink" href="javascript:void(0);" data-seq="' + data.masterSeq + '"' + '>'}
                      <p class="title">${data.title}</p>
                      ${!$text.isEmpty(data?.summary) ? '<p class="desc">' + data.summary + '</p>' : ''}
                    ${'</a>'}
              </div>
               
            </div>
            
          `;
                    $item.append(htmlItem1);
                    $item.append(htmlItem2);
                    $(parentSelector).append($item);
                });
            },


        },

        event: function () {

            //검색
            $('button[name=searchBtn]').on('click', () => {
                screen.c.getTotalboardSearchList();
            });
            $('input[name=searchTxt]').on('keyup', (e) => {
                if (e.keyCode === 13) screen.c.getTotalboardSearchList();
            });

            $(document).on('change', '#searchType', (e) => {
                screen.c.getTotalboardSearchList();
            });

            //정렬방식 변경
            $(document).on('change', '#sortType', (e) => {
                screen.c.getTotalboardSearchList();
            });

            //페이징
            $(document).on('click', 'button[type=button][name=pagingNow]', (e)=> {
                const pagingNow = e.currentTarget.value;

                screen.c.getTotalboardSearchList(pagingNow);
            });
            $(document).on('click', 'button[type=button][name=plus]', (e) => {
                const pagingNum = e.currentTarget.value;
                screen.c.getTotalboardSearchList(pagingNum);
            });

            /*$(document).on('click', 'a[name=detailLink]', screen.f.goDetail);*/

            /*if(!$isLogin) {
                $(document).on("click", ".text-wrap a", screen.f.loginCheck);
            }*/
            $(document).on('click', 'a[name=detailLink]', screen.f.goDetail);

            /*$(document).delegate('button.moreBtn','click',function (){
                screen.f.setPageNo(screen.v.getTabListOption.pageNo + 1); // 현재 페이지 +1
                screenRef.c.getReplenishDataList(screenRef.v.getTabListOption); // 목록에 데이터 추가

                // 버튼 화면단
                let moreBtn = $(`${screenRef.m.moreBtn()}`);
                $(this).parent().empty().append(moreBtn);
                screenRef.v.getTabListOption.pageNo === screenRef.v.totalPage ? moreBtn.prop('disabled', true) : moreBtn.prop('disabled', false);
            });*/

            if(!$isLogin) {
                $(document).on("click", ".text-wrap a", screen.f.loginCheck);
            }
        },

        init: function () {
            console.log('init!');
            screen.f.setCombo();
            screen.event();

            if(screen.v.totalCnt > 12){
                $('.pagination').removeClass('display-hide');
                $('.pagination').addClass('display-show-flex');
            } else {
                $('.pagination').removeClass('display-show-flex');
                $('.pagination').addClass('display-hide');
            }
        },
    };
    screen.init();
});