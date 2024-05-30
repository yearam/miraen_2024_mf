var __w = console.log;
var vol = 20;
var loginTF = (username.length > 0 ? true : false);
var votingTF = false;
var page = 1;
var pageCount = 10;
var totalPage = 0;
var typeNo = 1;
var BookApplicationTF;
var EventCommentWriteTF;
var varCardNo;
let _TYPE = $("#type").val();

$(function() {
    var page = {
        v: {
            type: 'ele',
            isLogin: false,
            deviceType: '',
            username: '',
            useremail: '',
            usermobile: '',
        },
        f: {
            logoFun: function(){
                if($(this).scrollTop() <= 0 && $('body').width() >= 990){
                    $('.standard-logo img').attr("src", $('.standard-logo img').attr("src").replace("bi_ele_125_c.png","bi_ele_125_w.png"));
                }else{
                    $('.standard-logo img').attr("src", $('.standard-logo img').attr("src").replace("bi_ele_125_w.png","bi_ele_125_c.png"));
                }
            },
        },
        c: {
            getGoodSum: function(){ // 개발 전
                /*
                $.post("/event/getEventIV_GoodSum.mrn", {
                    VOL: vol
                }).done(function(data) {
                    // console.log(data);
                    $('.form-voting div.box').removeClass('active');
                    $('a.btn_heart').removeClass('active');
                    $('div.box .btn_openpage').removeClass('active');
                    $('a.btn_heart span.num').text('0');
                    if (data.rows.length > 0) {
                        $.each(data.rows, function(index, item) {
                            let noInt = Number(item.No);
                            let noTxt = (noInt < 10)?'0'+noInt:noInt;
                            if (item.ActiveTF) {
                                $('.form-voting div.box.VnoInt' + noTxt).addClass('active');
                                $('a.btn_heart.V' + noTxt).addClass('active');
                                $('div.box.V' + noTxt + ' .btn_openpage').addClass('active');
                            }
                            $('a.btn_heart.V' + noTxt + ' span.num').text(item.Cnt);
                        });
                    }
                });
                 */
            },
            viewHit: function(cateCd, hitCd){ // 개발전
                /*
                $.ajax({
                    url: '/member/mtCommonHit.mrn',
                    type: 'post',
                    data: {
                        cateCd: cateCd,
                        hitCd: hitCd
                    },
                    success: function(data) {
                    }
                });
                 */
            },
            saveGood: function (no){ // 개발전
                /*
                var param = [];
                param.push({
                    name: 'NO',
                    value: no
                }, {
                    name: 'VOL',
                    value: vol
                });
                $.post('/event/saveEventIV_Good.mrn', param).done(function(data) {
                    getGoodSum();
                });
                 */
            }
        },
        event: function () {
            $(document).on('click', 'a.loginCheck', function(){
                $alert.open("MG00011", () => {});
            });

            // 로그인
            $(document).on('click', '.btnLogin', function(){
                $alert.open("MG00011", () => {});
            });

            /*
            // 회원가입
            $(document).on('click', '.btnJoin', function() {
                location.href = '/pages/common/User/Join.mrn?redirectURI=' + encodeURIComponent(location.href);
            });

            // 마이페이지
            $(document).on('click', '.btnMypage', function() {
                window.open('/pages/common/mypage/myinfo.mrn','_blank');
            });

            // footer 패밀리 사이트
            $(document).on('click', '.family_tit', function() {
                family_site();
            });
            */

            // WEBZINE View
            $("#"+ page.v.type +"Voting").show();

            // 스크롤 헤더 이벤트
            page.f.logoFun();
            $(window).on('scroll , resize', function() {
                page.f.logoFun();
            });

            //slider
            $('.item-slider').slick({
                dots: true,
                slidesToScroll: 1,
                appendDots: $('.ntab'),
                customPaging: function(slider, index) {
                    var title = $(slider.$slides[index]).attr('data-title');
                    return '<button>' + title + '</button>';
                }
            });

            //video
            var video = document.getElementById('video-js');
            video.addEventListener('click', function(){
                video.controls = true;
            }, false);

            // 좋아요 총 수 가져오기
            // page.c.getGoodSum();

            // 모달 상단으로 이동
            $('.modalgotoTop').click(function() {
                $('.modal.page_content.show').animate({
                    scrollTop: 0
                }, 'slow');
            });

            // 이벤트로 바로가기
            $('.btn_go_section_event').click(function() {
                $('#btn_go_section_event').trigger('click');
            });

            // 독자후기 이벤트로 바로가기
            $('.btn_go_section_review').click(function() {
                $('#btn_go_section_review').trigger('click');
            });

            // EBook 보기, PDF 다운로드
            $('.btnOpenEBook, .btn_openpage').click(function() {
                var url = $(this).data("url");
                var type = 'N';
                var cateCd = 'INO';
                var hitCd = 'EBK';

                if (hitCd == 'EBK' || hitCd == 'SPE') {
                    // !isLogin
                    $alert.open("MG00011", () => {});
                    return;
                }
                if (type == 'N') {
                    if (hitCd == 'EBK' || hitCd == 'SPE') {
                        window.open(url, 'open_EBook', 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
                    } else {
                        window.open(url, '_blank');
                    }
                } else {
                    location.href = url;
                }
                page.c.viewHit(cateCd, hitCd);
            });

            // 투표 클릭
            $('a.btn_heart').click(function() {
                page.c.saveGood($(this).data('val'));
            });
        },
        init: function () {
            page.v.type = $('#wrapper').data('type');
            page.v.isLogin = ($("#isLogin").val() == 'true');
            page.v.deviceType =  $("#deviceTag").val();
            page.v.username =  $("#username").val();
            page.v.useremail = $("#useremail").val();
            page.v.usermobile =  $("#usermobile").val();

            page.event();
        }
    }

    page.init();

});

