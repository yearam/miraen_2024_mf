$(function () {
    let screen = {
        v: {
            commonDomain: null,
            isLogin: false,
            userRight: null,

        },

        c: {
            // 교과서 바로가기 > 셀렉트박스 option
            getTextbookListForHighSiteMap: (data) => {
                const options = {
                    url: '/pages/api/textbook/highGnbMenuList.ax',
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("HighSiteMap 교과서 리스트 : ", res);

                        const $selectSubject = $('#optionList select[name=selectSubject]');
                        const $selectTextbook = $('#optionList select[name=selectTextbook]');

                        $selectSubject.each(function() {
                            let liId = $(this).find('option:selected').attr('id').split('|');

                            if(Boolean(data) && data !== 'init') {
                                liId = data;
                            }

                            let matchingData = $.grep(res.rows, function(item) {
                                return liId.includes(item.subjectCode);
                            });

                            console.log(matchingData)

                            let newData = $.map(matchingData, function (item) {
                                return `<option class="display-hide" data-name="${item.subjectCode}" data-masterseq="${item.masterSeq}" data-revisioncode="${item.subjectRevisionCode}">${item.textbookName}${item.leadAuthorName ? `(${item.leadAuthorName})` : ''}</option>`;
                            }).join('');

                            $('#optionList select[name=selectTextbook]').empty().append(newData);
                        });
                    }
                };
                $.ajax(options);
            }
        },

        f: {
            // openSetFavorite: (e) => {
            //     if (!$isLogin) {
            //         $(e.currentTarget).removeClass('active');
            //         $alert.open('MG00001');
            //         return;
            //     } else {
            //         $('button[name=setFavHigh]').attr("target-obj", "popupBookMark");
            //         $('#setFavoriteForm').append($('<input>', {
            //             type: "hidden",
            //             name: "subjectLevelCode",
            //             value: "HIGH"
            //         }));
            //         $('#setFavoriteForm').append($('<input>', {
            //             type: 'hidden',
            //             name: 'urlLevel',
            //             value: '/high/'
            //         }));
            //         $('#setFavoritePopup').removeAttr("src");
            //         // $('#popupBookMark').addClass("display-show");
            //         $('#setFavoriteForm').submit();
            //         $('#loading').addClass("display-show");
            //     }
            // },

            goSmartPpt: (e) => {
                e.preventDefault();
                console.log(screen.v.userRight)

                if (screen.v.userRight !== "0010") $alert.open("MG00003");
                else window.open(e.currentTarget.href);
            },

            noMybook: () => {
                if (screen.v.isLogin) $("button[name=setFavHigh]").trigger("click");
                else $alert.open("MG00001");
            },

            // 교과서 상세 페이지로 이동
            showDetailPage: function (masterSeq, revisionCode) {
                // textbookDetail에서 호출할 때는 textbookDetail.mrn로 이동, 아니면 textbook/textbookDetail.mrn로 이동
                const currentPath = window.location.pathname;
                const isCurrentPathDetailPage = currentPath.includes('/textbook/textbookDetail.mrn');

                // 페이지 경로와 쿼리스트링을 조합하여 URL 생성
                let targetPage = 'textbook/textbookDetail.mrn'; // 대상 페이지
                let queryString = `?masterSeq=${masterSeq}&revisionCode=${revisionCode}`; // 쿼리스트링

                if (!isCurrentPathDetailPage) {
                    targetPage = 'textbook/textbookDetail.mrn'
                }

                // 메인메뉴에서 진입 내용 저장
                localStorage.setItem('source', 'mainMenu');

                const protocol = location.protocol;
                const host = location.host;
                const pathNameSplit = currentPath.split("/");
                const textbookHref = `${protocol}//${host}/${pathNameSplit[1]}/${pathNameSplit[2]}/${targetPage + queryString}`

                // window.location.href에 URL 설정
                // window.location.href = targetPage + queryString;
                window.location.href = textbookHref;
            },

        },

        event: () => {

            // 내 교과서 > 스마트 수업
            $("a[name=smartPpt]").off("click").on("click", screen.f.goSmartPpt);

            // 내 교과서 > 즐겨찾기 없을 때 이미지 클릭
            $("#no-mybook").off("click").on("click", screen.f.noMybook);

            // TODO - 즐겨찾기 설정하기
            // 즐겨찾기 > 설정
            // $("button[name=setFavHigh]").off("click").on("click", screen.f.openSetFavorite);

            // 즐겨찾기 설정 이벤트
            // $('#setFavoritePopup').on('load', function () {
            //     // 취소 버튼
            //     $(this).contents().find('#cancelBtn').off().on("click", () => {
            //         $alert.open("MG00019", () => {
            //             $('#popupBookMark').removeClass('display-show');
            //             $('#setFavoritePopup').attr('src', 'about:blank');
            //             window.scrollTo(0, 0);
            //             location.reload();
            //         });
            //     });
            //
            //     // 닫기 버튼
            //     $(this).contents().find('#closeBtn').off().on("click", () => {
            //         $('#popupBookMark').removeClass('display-show');
            //         $('#setFavoritePopup').attr('src', 'about:blank');
            //         $('body').removeClass('active-overlay');
            //
            //         window.scrollTo(0, 0);
            //         location.reload();
            //     });
            //
            //     $('#loading').removeClass("display-show");
            // });

            // 고객 안내 영역 > 원격 지원 요청
            $('#remote').off('click').on('click', () => {
                alert("원격 지원 요청은 PC에서 사용 가능합니다.")
            });

            // 고객 안내 영역 > 카카오톡 상담
            $('#kakao').off('click').on('click', () => {
                console.log(23232323)
                alert("카카오톡에서 \'엠티처\' 검색을 해주세요.");
            });

            $('#optionList select[name=selectSubject]').on('change', function (event) {
                const subjectId = $(this).find('option:selected').attr('id');

                screen.c.getTextbookListForHighSiteMap(subjectId);
            });

            $('#optionList button.goToTextbook').on('click', function() {
                const $selectTextbook = $('#optionList select[name=selectTextbook]');
                const masterseq = $selectTextbook.find('option:selected').data('masterseq');
                const revisioncode = $selectTextbook.find('option:selected').data('revisioncode');
                screen.f.showDetailPage(masterseq, revisioncode);
            });

        },


        init: () => {
            screen.v.commonDomain = $("#gHostCommon").val();
            screen.v.isLogin = $("#isLogin").val() === "true";
            screen.v.userRight = $("#userRight").val();

            screen.event();
            screen.c.getTextbookListForHighSiteMap('init');
        },
    };
    screen.init();
});