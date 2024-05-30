$(function () {
    let screen = {
        v: {
            searchCondition: {},
            resultList: [],
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
                        $('strong[name=totalCnt]').text(res.totalCnt);
                        screen.f.bindDataList();
                        screen.f.bindTotalboardPaging(res);
                        toggleThis('.toggle-this');
                    }
                };

                $cmm.ajax(options);
            },

        },

        f: {
            displayData(data) {
                var unitDiv = document.querySelector('.unit-list');

                // 이전에 표시된 단원들 제거
                unitDiv.innerHTML = '';

                // 표시할 단원들 생성
                data.tableList.forEach(function(unit) {
                    var unitElement = document.createElement('div');
                    unitElement.classList.add('unit');
                    unitElement.innerHTML = `
            <h3>${unit.title}</h3>
            <table>
                <thead>
                    <tr>${unit.thead.map(head => `<th>${head}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${unit.tbody.map(row => `
                        <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
        `;
                    unitDiv.appendChild(unitElement);
                });
            },


            bindTotalboardPaging: (resObj)=> {
                console.log("로그으",resObj);
                const TOTAL = resObj.totalCnt;
                const NOW		= resObj.pagingNow;
                const NUM		= resObj.pagingNum;
                const SIZE	= resObj.pagingSize;
                const START = resObj.pagingStart;
                const END		= resObj.pagingEnd;
                const FIRST = resObj.pagingFirst;
                const PREV	= resObj.pagingPrev;
                const NEXT	= resObj.pagingNext;
                const LAST	= resObj.pagingLast;

                const $first = `
			<button type="button" name="plus" value="${NOW}" class="button size-xl moreBtn">
            <span>${'더보기' + (NOW+1) + '/' + (LAST+1)}</span>
            <svg>
                <title>더보기 아이콘</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
            </svg>
            </button>
			`;

                const $last = `
			<button type="button" name="plus" value="${NOW}" class="button size-xl moreBtn disabled">
            <span>${'더보기' + (NOW+1) + '/' + (LAST+1)}</span>
            <svg>
                <title>더보기 아이콘</title>
                <use xlink:href="/assets/images/svg-sprite-solid.svg#icon-plus"></use>
            </svg>
            </button>
			`;

                const $parentEl = $('.page-buttons');
                $parentEl.empty();

                    if(LAST === NOW){
                        $parentEl.append($last);
                    }else{
                        $parentEl.append($first);
                    }


                    /*$('.icon-button').prop('disabled', NOW+1);*/

                /*if(TOTAL/NUM eq NOW){
                    $('.moreBtn').prop('disabled', NOW+1);
                }*/
            },

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

            getCurrentLocationByName: () => {
                let concatenatedText = "";
                $(".breadcrumbs ul").find("li:not(.home)").each(function (index) {
                    let $this = $(this);
                    let text = $this[0].childNodes.length > 0 ? $this[0].childNodes[0].textContent : $this.text();
                    if (index !== 0) {
                        concatenatedText += " > ";
                    }
                    concatenatedText += text;
                });

                return concatenatedText;
            },

            setMyFavorite: () => {
                if(!$isLogin) {
                    $alert.open('MG00001');
                    $('#reg-favorite[type=checkbox]').prop("checked", false)
                    return;
                }

                const addFavorite = $('#reg-favorite[type=checkbox]').is(':checked');

                if (addFavorite) {
                    // 즐겨찾기 등록하는 경우
                    screen.f.addFavorite();
                } else {
                    // 즐겨찾기 해제하는 경우
                    screen.f.updateFavorite();
                }
            },

            updateFavorite: () => {
                let dataObj = {};
                // 즐겨찾기 해제 type을 delete로 사용
                const referenceSeq = window.location.pathname.split('/');

                dataObj = {
                    favoriteType: "MTEACHER",
                    referenceSeq: referenceSeq[referenceSeq.length - 1],
                }

                const options = {
                    url: '/pages/api/mypage/updateFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function (res) {
                        console.log(res);
                        // 해제 성공시 Toast Msg - MG00039
                        $toast.open("toast-favorite", "MG00039");
                        $quick.getFavorite();
                    },
                };

                $.ajax(options);
            },

            addFavorite: () => {
                let dataObj = {};

                const currentLocationName = screen.f.getCurrentLocationByName();
                const currentUrl = window.location.origin + window.location.pathname;
                const referenceSeq = window.location.pathname.split('/');

                dataObj = {
                    favoriteType: 'MTEACHER',
                    referenceSeq: referenceSeq[referenceSeq.length - 1],
                    favoriteName: currentLocationName, // 게시판명
                    favoriteUrl: currentUrl, // 게시판 url
                    useYn: 'Y',
                }

                const options = {
                    url: '/pages/api/mypage/addFavorite.ax',
                    data: dataObj,
                    method: 'POST',
                    async: false,
                    success: function (res) {
                        console.log(res)
                        // 40개 미만인 경우만 즐겨찾기 등록 성공
                        if (res.resultMsg === "exceed") {
                            $alert.open("MG00012");
                            $('#reg-favorite[type=checkbox]').prop("checked", false);
                        } else {
                            $toast.open("toast-favorite", "MG00038");
                            $quick.getFavorite();
                        }
                    },
                };

                $.ajax(options);
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
            <div class="image-wrap">
              <img src="${!(data?.thumbnailFilePath) ? '/assets/images/common/img-no-img.png' : data.thumbnailFilePath}" alt="" />
              <div class="info-media${data.fileYn === 'N' ? ' display-hide' : ''}">
                 <div class="info-media">
                    ${!$text.isEmpty(data?.videoPlayTime) ? '<span class="time">' + screen.f.getVideoTimeForm('min', data.videoPlayTime) + ':' + screen.f.getVideoTimeForm('sec', data.videoPlayTime) + '</span>' : ''}
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
                console.log(pagingNum)
                const pagingNow = parseInt(pagingNum) + 1;
                console.log(pagingNow)
                screen.c.getTotalboardSearchList(pagingNow);
            });

            /*$(document).on('click', 'a[name=detailLink]', screen.f.goDetail);*/

            /*if(!$isLogin) {
                $(document).on("click", ".text-wrap a", screen.f.loginCheck);
            }*/
            $(document).on('click', 'a[name=detailLink]', screen.f.goDetail);

            $(document).on("click", "#reg-favorite", screen.f.setMyFavorite);

            /*$(document).delegate('button.moreBtn','click',function (){
                screen.f.setPageNo(screen.v.getTabListOption.pageNo + 1); // 현재 페이지 +1
                screenRef.c.getReplenishDataList(screenRef.v.getTabListOption); // 목록에 데이터 추가

                // 버튼 화면단
                let moreBtn = $(`${screenRef.m.moreBtn()}`);
                $(this).parent().empty().append(moreBtn);
                screenRef.v.getTabListOption.pageNo === screenRef.v.totalPage ? moreBtn.prop('disabled', true) : moreBtn.prop('disabled', false);
            });*/
        },

        init: function () {
            console.log('init!');
            screen.f.setCombo();
            screen.event();


        },
    };
    screen.init();
});