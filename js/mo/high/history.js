let history

$(function(){
    history = {
        f:{
            getHistorydata: () => {
                let $div = $('.history-body .list-items');
                $div.empty();

                let result = $cmm.getCookie('history-high');
                let resultArr = result.split(',');

                resultArr.reverse();

                for (let i = 0; i < resultArr.length; i++) {
                    let dataArr = resultArr[i].split(':');

                    if (dataArr[1] == null || dataArr[1] == 'undefined') {
                        break;
                    }

                    if (decodeURIComponent(dataArr[3]).indexOf('pages/high/board') >= 0 || decodeURIComponent(dataArr[3]).indexOf('pages/high/bbs') >= 0) {
                        // 공통 게시판
                        $div.append(`
                            <a href="${decodeURIComponent(dataArr[3])}">
                                <span class="badge mix-round size-md primary">${dataArr[0]}</span>
                                <ul class="depth">
                                  ${dataArr[1] != null && dataArr[1] != 'undefined' ? '<li>' + dataArr[1] + '</li>' : ''}
                                  ${dataArr[2] != null && dataArr[2] != 'undefined' ? '<li>' + dataArr[2] + '</li>' : ''}
                                </ul>
                            </a>
                        `);
                    } else if (decodeURIComponent(dataArr[3]).indexOf('pages/high/textbook') >= 0) {
                        // 교과
                        $div.append(`
                            <a href="${decodeURIComponent(dataArr[3])}">
                                <span class="badge mix-round size-md gray">${dataArr[0]}</span>
                                <p class="title">[${dataArr[1] != null && dataArr[1] != 'undefined' ? dataArr[1] : ''}] ${dataArr[2] != null && dataArr[2] != 'undefined' ? dataArr[2] : ''}</p>
                            </a>
                        `);
                    }
                }
            }
        },

        event : function() {
            $('#mo_history').on("click", history.f.getHistorydata);
        },

        init : async function (){
            console.log('history init');

            history.event();
        }
    };

    history.init();
})


