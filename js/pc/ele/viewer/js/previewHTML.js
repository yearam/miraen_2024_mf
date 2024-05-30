    function mobileDeviceGetHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');

    portraitElementHeight();
    hidePageMoveBtn();
};

    function hidePageMoveBtn() {
    $('.icon-prev-content').css('display', 'none');
    $('.icon-next-content').css('display', 'none');
};

    function portraitElementHeight() {
    let ua = window.navigator.userAgent;
    let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    let webkit = !!ua.match(/WebKit/i);
    let whale = !!ua.match(/Whale/i);
    let iOSSafari = iOS && webkit && !whale && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);

    let getOrientation = $('body').attr('orientation');
    let _vh = $('html').css('--vh');

    if (getOrientation == 'portrait') {
    let target_height = parseFloat(_vh) * 100;
    let calc_height = target_height - 100;

    $("#viewer-content").css('height', calc_height + 'px');
    $("#viewer-aside").css('height', calc_height + 'px');
    $("#viewer-hd").css('top', calc_height + 'px');

} else {
    let target_height = parseFloat(_vh) * 100;
    let calc_height = target_height - 50;

    $("#viewer-content").css('height', calc_height + 'px');
    $("#viewer-aside").css('height', calc_height + 'px');
    $("#viewer-hd").css('top', calc_height + 'px');
}
};

    function set_current_orientation() {
    switch (window.orientation) {
    case 0:
    $('body').attr('orientation', 'portrait');
    break;
    case -90:
    $('body').attr('orientation', 'landscape');
    break;
    case 90:
    $('body').attr('orientation', 'landscape');
    break;
    case 180:
    $('body').attr('orientation', 'portrait');
    break;
}

    mobileDeviceGetHeight();
};

    let PleaseRotateOptions = {
    forcePortrait: false,
    message: "기기를 가로로 돌려주세요.",
    subMessage: "모바일에서는 가로모드만 지원합니다.",
    allowClickBypass: false,
    onlyMobile: false
};

    // let DEVICE_TYPE = null;
    // function detect_mobile_device_type() {
    //     let md = new MobileDetect(window.navigator.userAgent);
    //     if (md.tablet()) {
    //         DEVICE_TYPE = 'tablet';
    //     } else if (md.mobile()) {
    //         DEVICE_TYPE = 'mobile';
    //     }
    //     return DEVICE_TYPE;
    // }

    $(document).ready(function () {
        $.LoadingOverlaySetup({
            image: "/js/pc/ele/viewer/img/viewer/loading.svg",
            imageAnimation: false,
            imageAutoResize: true,
            imageResizeFactor: 1,
            textColor: "#006c45",
        });
        // $.LoadingOverlay("show");

        set_current_orientation();
        detect_mobile_device_type();

        if (DEVICE_TYPE == 'mobile' && DEVICE_TYPE != 'tablet') {
            // let pathname = window.location.pathname;
            // pathname = pathname.replace("v.html", "mv.html");
            // location.href = pathname + window.location.hash + "?" + queryString;
            // return;
        }
        $('body').attr('device', DEVICE_TYPE);

        if (navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("Linux") != -1) {
            addEventListener("load", function () {
                // setTimeout(scrollTo, 0, 0, 1)
                setTimeout(window.scrollTo(0, 1))
            }, false);
            //  addEventListener("orientationchange", function(){
            //       setTimeout(scrollTo, 0, 0, 1)
            //  }, false);
        }
        addEventListener("orientationchange", function () {
            set_current_orientation();
            setTimeout(window.scrollTo(0, 1))
            // setTimeout(scrollTo, 0, 0, 1)
        }, false);

        // setTimeout(function () {
        //     viewer.ready(DEVICE_TYPE);
        // }, 200);

        // let theme = "default";
        // let cookie_theme = getCookie('theme');
        // if (["default", "theme-dark-2", "theme-green"].includes(cookie_theme)) {
        //     theme = cookie_theme;
        // }
        // $('body').attr('theme', theme);

        setTimeout(function () {
            viewer.ready(function (res) {
                if (res == "close") {
                    window.close();
                    return;
                }
                if (viewer.file_type != 'video' && viewer.file_type != 'audio') {
                    if (IS_USING_PDF_MODULE) {
                        drawing_canvas = Module.pdf_viewer.drawing();
                    } else {
                        drawing_canvas = Module.image_viewer.drawing();
                    }
                } else {
                    drawing_canvas = Module.video_viewer.drawing();
                }

                // 2022.02.09 모바일 대응
                if (DEVICE_TYPE == "mobile") {
                    set_current_orientation();
                    $('#viewer-wrap').addClass('aside-close');
                }
            });

        }, 500);

        // preview에서 file값, source값, user값만 있을 때는 tool 숨김
        let getParameters = function (paramName) {
            let returnValue;
            let url = location.href;
            let parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

            for (let i = 0; i < parameters.length; i++) {
                let varName = parameters[i].split('=')[0];
                if (varName.toUpperCase() == paramName.toUpperCase()) {
                    returnValue = parameters[i].split('=')[1];
                    return decodeURIComponent(returnValue);
                }
            }
        };

        // parameter중 file명이 있고 source가 AMIND-PREVIEW이고 user정보만 있을 때 숨김
        if (getParameters('file') != undefined &&
            getParameters('contentsTextbookPeriodScrapYn') == undefined &&
            getParameters('contentsTextbookPeriodSeq') == undefined &&
            getParameters('source') == 'AMIND-PREVIEW') {
            $('#viewer-tool').hide();
        } else {
            $('#viewer-tool').show();
        }

        // let isMobile = false; //initiate as false
        // // device detection
        // if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        //     || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        //     isMobile = true;
        // }

        // if (isMobile) {
        //     $('#download').html('<i class="icon-download"></i>');
        //     $('#scrap').html('<i class="icon-scrap"></i>');
        // } else {
        //     $('#download').html('<i class="icon-download"></i>다운로드');
        //     $('#scrap').html('<i class="icon-scrap"></i>스크랩');
        // }
    });

    $(window).on("resize", function (e) {
        if (IS_USING_PDF_MODULE) {
            try {
                $("#pdf-iframe").get(0).contentWindow.pdfFit();
                // 2022.02.09 모바일 대응
                if (DEVICE_TYPE == "mobile") {
                    set_current_orientation();
                    $('#viewer-wrap').addClass('aside-close');
                }
            } catch (error) {
                console.error(error);
            }
        }

        setTimeout(function () {
            let smartData = $("#content-scale").data('smartZoomData');
            if (!smartData) return;
            let scale = smartData.adjustedPosInfos.scale;
            if (typeof (scale) == 'string') {
                scale = parseFloat(scale);
            }
            scale = scale * 100;
            $("#zoom-level").html(scale.toFixed(0) + "%");
            // $("#zoom-level").html("X "+scale.toFixed(1));
        }, 500);

        mobileDeviceGetHeight();
    });
    $(document).on("click", ".icon-aside-open-txt", function (e) {

    if (!$("#viewer-wrap").hasClass("aside-close")) {
    $(this).attr("title", "크게보기");
    $(".icon-aside-open-txt > h3").html("크게보기");
} else {
    $(this).attr("title", "작게보기");
    $(".icon-aside-open-txt > h3").html("작게보기");
}

    if (DEVICE_TYPE == 'mobile') {
    return;
}

    setTimeout(function () {
    if (IS_USING_PDF_MODULE) {
    try {
    $("#pdf-iframe").get(0).contentWindow.pdfFit();
} catch (error) {
    console.error(error);
}
}
    Module.common.adjustToContainer();

    let smartData = $("#content-scale").data('smartZoomData');
    if (!smartData) return;
    let scale = smartData.adjustedPosInfos.scale;
    if (typeof (scale) == 'string') {
    scale = parseFloat(scale);
}
    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0) + "%");
    // $("#zoom-level").html("X "+scale.toFixed(1));
}, 500);
});

    $(document).on("click", "#page > button.icon-prev, .icon-prev-content", function (e) {
    viewer.select_prev();
});
    $(document).on("click", "#page > button.icon-next, .icon-next-content", function (e) {
    viewer.select_next();
});
    $(document).on("click", "#page_list .span4", function (e) {
    let index = $(this).attr('index');
    if (viewer.playlist) {
        viewer.playlist_select_index(index)
    } else {
        viewer.select_index(index);
    }
});
    $(document).on("click", ".icon-tool-account", function (e) {
    if ($("#module-modal").hasClass('show')) {
    if (IS_USING_PDF_MODULE) {
    $("#pdf-iframe").get(0).contentWindow.pdfZoomIn();
} else {
    Module.common.zoom_in();
}

} else {
    Module.common.iframe_zoom_in();
}
});
    $(document).on("click", ".icon-tool-account2", function (e) {
    if ($("#module-modal").hasClass('show')) {
    if (IS_USING_PDF_MODULE) {
    $("#pdf-iframe").get(0).contentWindow.pdfZoomOut();
} else {
    Module.common.zoom_out();
}
} else {
    Module.common.iframe_zoom_out();
}
});

$(document).on("click", "#download", function () {
    if (viewer.playlist) {
        // download_multi_file(viewer.file_info.downloads, viewer.file_info.title);
    } else {
        download_file(viewer.file_info.down_url, viewer.file_info.title);
    }
});

    $(document).on("click", "#scrap", function (e) {

    let promise = undefined;
    if ($("#scrap").hasClass("scrapped")) {
    // promise = tms.delete_period_contents_scrap(viewer.contentsTextbookPeriodSeq);
} else {
    // promise = tms.create_period_contents_scrap(viewer.contentsTextbookPeriodSeq);
}
    promise.then(function (res) {
    console.log(res);
    if (res && res.resultCode == "success") {
    if (res.resultData == "create") {
    $("#scrap").addClass("scrapped");

    $.Toast.showToast({
    title: "스크랩을 추가했습니다.",
    duration: 1000,
    icon: "",
    image: ''
});
} else if (res.resultData == "delete") {
    $("#scrap").removeClass("scrapped");

    $.Toast.showToast({
    title: "스크랩을 제거했습니다.",
    duration: 1000,
    icon: "",
    image: ''
});
}
}
})
    .catch(function (err) {
    console.log(err);
});
});
    $(document).on("click", "#fullscreen", function (e) {
    toggleFullScreen();
});

    $("#mteacher-button").on('click', function() {
        let domain = "https://ele.m-teacher.co.kr/Main/Main.mrn";
        window.open(domain, "_blank");
    });