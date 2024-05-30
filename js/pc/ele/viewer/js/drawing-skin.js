$(document).on("SmartZoom_ZOOM_END", "#content-scale", function(e) {
    let scale = e.scale;
    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0)+"%");
    // $("#zoom-level").html("X "+scale.toFixed(1));
});
// $(document).on("SmartZoom_ZOOM_START", "#content-scale", function(e) {
//     console.log(e);
// });

let drawing_canvas = undefined;
$(window).on('beforeunload', function() {
    if(drawing_canvas) {
        drawing_canvas.destroy();
        drawing_canvas = undefined;
    }
});
$(document).on("shown.bs.modal", "#module-modal", function(e) {
    // Module.common.fit($("#content-scale"));
    if(Module.image_viewer.drawing()) {
        Module.image_viewer.drawing().fitStage();
    }
    if(Module.video_viewer.drawing()) {
        Module.video_viewer.drawing().fitStage();
    }

    Module.common.adjustToContainer();
    let smartData = $("#content-scale").data('smartZoomData');
    if(!smartData) return;
    let scale = smartData.adjustedPosInfos.scale;
    if(typeof(scale) == 'string') {
        scale = parseFloat(scale);
    }
    scale = scale * 100;
    $("#zoom-level").html(scale.toFixed(0)+"%");
    // $("#zoom-level").html("X "+scale.toFixed(1));
});
$(document).on("click", ".icon-drawing7", function(e) {
    $("#drawing-button").removeClass('active');
    if(drawing_canvas) {
        drawing_canvas.deactivate();
    }
    Module.common.zoom_setting('bind_mouse_event');
});
let first_drawing_check = false;
$(document).on("click", "#drawing-button", function (e) {
    if (!drawing_canvas) {
        if (viewer.file_type != 'video' && viewer.file_type != 'audio') {
            if(IS_USING_PDF_MODULE) {
                drawing_canvas = Module.pdf_viewer.drawing();
            } else {
                drawing_canvas = Module.image_viewer.drawing();
            }
        } else {
            drawing_canvas = Module.video_viewer.drawing();
        }
    }

    if (!drawing_canvas) {
        show_alert('아직 그리기를 지원하지 않습니다.');
        return;
    }

    if ($("#drawing-button").hasClass('active')) {
        $("#drawing-button").removeClass('active');
        $("#drawing").removeClass('active');
        if(drawing_canvas) {
            drawing_canvas.deactivate();
        }
        Module.common.zoom_setting('bind_mouse_event');
    } else {
        $("#drawing-button").addClass('active');
        $("#drawing").addClass('active');
        Module.common.zoom_setting('unbind_mouse_event');

        // 그리기 바로 적용
        $('.icon-drawing').click();
        
        // 처음에 붉은색으로 색상 변경
            if (!first_drawing_check) {
                viewer.select_stroke_color('#f24545');
                first_drawing_check = true;
            }
    }
});

// 그리기
$(document).on('click', '.icon-drawing', function () {
    $('#palette').css('display', 'inline-flex');
    $('#font_select').css('display', 'none');
    $('#image_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'inline-block');

    $('.icon-drawing').addClass('active');
    $('.icon-drawing2').removeClass('active');
    $('.icon-drawing3').removeClass('active');
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing5').removeClass('active');
    $('.icon-drawing6').removeClass('active');

    if (drawing_canvas.drawingLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        drawing_layer_hide = false;
    } else if (drawing_canvas.drawingLayer.attrs.visible == true || drawing_canvas.drawingLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        drawing_layer_hide = true;
    };

    viewer.drawing_mode_change('brush');
});
// 텍스트
let first_text_check = false;
$(document).on('click', '.icon-drawing2', function () {
    $('#font_select').css('display', 'flex');
    $('#palette').css('display', 'none');
    $('#image_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'none');

    $('.icon-drawing2').addClass('active');
    $('.icon-drawing').removeClass('active');
    $('.icon-drawing3').removeClass('active');
    $('.icon-drawing6').removeClass('active');

    if (drawing_canvas.textLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        text_layer_hide = true;
    } else if (drawing_canvas.textLayer.attrs.visible == true || drawing_canvas.textLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        text_layer_hide = false;
    };

    // 그리기 모드 해제
    viewer.mode_change('text');

    // 처음에 검은색으로 색상 변경
    if(!first_text_check) {
        viewer.text_font_fill('#000000');
        first_text_check = true;
    }
});
// 도형
$(document).on('click', '.icon-drawing3', function () {
    $('#image_select').css('display', 'inline-flex');
    $('#palette').css('display', 'none');
    $('#font_select').css('display', 'none');
    $('.icon-drawing4').css('display', 'none');
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing3').addClass('active');
    $('.icon-drawing2').removeClass('active');
    $('.icon-drawing').removeClass('active');
    $('.icon-drawing6').removeClass('active');

    if ($('.icon-hlighter').hasClass('active')) {
        $('.icon-drawing4').css('display', 'inline-block');
    } else {
        $('.icon-drawing4').css('display', 'none');
    };

    if (drawing_canvas.imageLayer.attrs.visible == false) {
        $('.icon-drawing6').addClass('active');
        image_layer_hide = true;
    } else if (drawing_canvas.imageLayer.attrs.visible == true || drawing_canvas.imageLayer.attrs.visible == undefined) {
        $('.icon-drawing6').removeClass('active');
        image_layer_hide = false;
    };

    // 그리기 모드 해제
    viewer.mode_change('image');
});
// 도형 - 화살표
let first_arrow_check = false;
$(document).on('click', '.icon-arrow', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-arrow').addClass('active');
    $('.icon-line').removeClass('active');
    $('.icon-hlighter').removeClass('active');
    $('.icon-sticker').removeClass('active');

    $('.arrow_wrap').css('display', 'inline-flex');
    $('.line_wrap').css('display', 'none');
    $('.hlighter_wrap').css('display', 'none');
    $('.sticker_wrap').css('display', 'none');

    viewer.stop_drawHlighter();
    viewer.mode_change('arrow');

    // 처음에 붉은색으로 색상 변경
    if (!first_arrow_check) {
        viewer.select_arrow_color('#f24545');
        first_arrow_check = true;
    }
});
// 도형 - 화살표 컬러
let select_arrow_color_off = true;
$(document).on('click', '.icon-arrow-color', function () {
    if (select_arrow_color_off) {
        $('.arrow_color_wrap').css('display', 'inline-flex');
        $('.icon-arrow-color .caret').addClass('caret_change');
        $('.icon-arrow-color .caret_change').removeClass('caret');
        select_arrow_color_off = false;

        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;

        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;

        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    } else {
        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;
    }
});
// 화살표 색상 클릭
$(document).on('click', '.arrow_palette', function () {
    let arrow_color = $(this).attr('data-arrowcolor');
    $('.icon-arrow-color').click();

    viewer.select_arrow_color(arrow_color);
});
// 도형 - 화살표 방향
let select_arrow_direction_off = true;
$(document).on('click', '.icon-arrow-direction', function () {
    if (select_arrow_direction_off) {
        $('.select_arrow_direction_wrap').css('display', 'inline-flex');
        $('.icon-arrow-direction .caret').addClass('caret_change');
        $('.icon-arrow-direction .caret_change').removeClass('caret');
        select_arrow_direction_off = false;

        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;

        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;

        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    } else {
        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;
    }
});
// 화살표 방향 클릭
$(document).on('click', '.select_a_d', function () {
    $('.icon-arrow-direction').click();
    let direction = $(this).attr('data-direction');

    //  background img change 
    if (direction == 'forward') {
        $('.select_arrow_direction_1').css('background-image', 'url("./img//viewer-skin/icon/white/arrow-direction-1.svg")');
        $('.select_arrow_direction_2').css('background-image', 'url("./img//viewer-skin/icon/default/arrow-direction-1.svg")');
        $('.select_arrow_direction_3').css('background-image', 'url("./img//viewer-skin/icon/default/arrow-direction-1.svg")');
    } else if (direction == 'reverse') {
        $('.select_arrow_direction_1').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-direction-1.svg")');
        $('.select_arrow_direction_2').css('background-image', 'url("./img/viewer-skin/icon/white/arrow-direction-1.svg")');
        $('.select_arrow_direction_3').css('background-image', 'url("./img//viewer-skin/icon/default/arrow-direction-1.svg")');
    } else if (direction == 'bidirectional') {
        $('.select_arrow_direction_1').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-direction-1.svg")');
        $('.select_arrow_direction_2').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-direction-1.svg")');
        $('.select_arrow_direction_3').css('background-image', 'url("./img/viewer-skin/icon/white/arrow-direction-1.svg")');
    };

    viewer.select_arrow_direction(direction);
});
// 도형 - 화살표 선두께 선택
let select_arrow_width_off = true;
$(document).on('click', '.icon-arrow-width', function () {
    if (select_arrow_width_off) {
        $('.select_arrow_width_wrap').css('display', 'inline-flex');
        $('.icon-arrow-width .caret').addClass('caret_change');
        $('.icon-arrow-width .caret_change').removeClass('caret');
        select_arrow_width_off = false;

        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;

        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;

        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    } else {
        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;
    }
});
// 화살표 선두께 클릭
$(document).on('click', '.select_a_w', function () {
    $('.icon-arrow-width').click();
    let width = $(this).attr('data-arrow_width');

    //  background img change 
    if (width == 2) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 4) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 6) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 8) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 10) {
        $('.select_arrow_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_arrow_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_arrow_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_arrow_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_arrow_width_5').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-5.png")');
    }

    viewer.select_arrow_width(width);
});
// 도형 - 화살표 대시 선택
let select_arrow_dash_off = true;
$(document).on('click', '.icon-arrow-dash', function () {
    if (select_arrow_dash_off) {
        $('.select_arrow_dash_wrap').css('display', 'inline-flex');
        $('.icon-arrow-dash .caret').addClass('caret_change');
        $('.icon-arrow-dash .caret_change').removeClass('caret');
        select_arrow_dash_off = false;

        $('.arrow_color_wrap').css('display', 'none');
        $('.icon-arrow-color .caret_change').addClass('caret');
        $('.icon-arrow-color .caret').removeClass('caret_change');
        select_arrow_color_off = true;

        $('.select_arrow_direction_wrap').css('display', 'none');
        $('.icon-arrow-direction .caret_change').addClass('caret');
        $('.icon-arrow-direction .caret').removeClass('caret_change');
        select_arrow_direction_off = true;

        $('.select_arrow_width_wrap').css('display', 'none');
        $('.icon-arrow-width .caret_change').addClass('caret');
        $('.icon-arrow-width .caret').removeClass('caret_change');
        select_arrow_width_off = true;
    } else {
        $('.select_arrow_dash_wrap').css('display', 'none');
        $('.icon-arrow-dash .caret_change').addClass('caret');
        $('.icon-arrow-dash .caret').removeClass('caret_change');
        select_arrow_dash_off = true;
    }
});
// 화살표 대시 클릭
$(document).on('click', '.select_a_ds', function () {
    $('.icon-arrow-dash').click();
    let dash = $(this).attr('data-arrow_dash');

    //  background img change 
    if (dash == 'dash_1') {
        $('.select_arrow_dash_1').css('background-image', 'url(".viewer-skin/icon/white/arrow-dash-1.png")');
        $('.select_arrow_dash_2').css('background-image', 'url(".viewer-skin/icon/default/arrow-dash-2.png")');
        $('.select_arrow_dash_3').css('background-image', 'url(".viewer-skin/icon/default/arrow-dash-3.png")');
    } else if (dash == 'dash_2') {
        $('.select_arrow_dash_1').css('background-image', 'url(".viewer-skin/icon/default/arrow-dash-1.png');
        $('.select_arrow_dash_2').css('background-image', 'url(".viewer-skin/icon/white/arrow-dash-2.png');
        $('.select_arrow_dash_3').css('background-image', 'url(".viewer-skin/icon/default/arrow-dash-3.png');
    } else if (dash == 'dash_3') {
        $('.select_arrow_dash_1').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-1.png');
        $('.select_arrow_dash_2').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-2.png');
        $('.select_arrow_dash_3').css('background-image', 'url("./img/viewer-skin/icon/white/arrow-dash-3.png');
    };

    viewer.select_arrow_dash(dash);
});
// 도형 - 직선
let first_line_check = false;
$(document).on('click', '.icon-line', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-line').addClass('active');
    $('.icon-arrow').removeClass('active');
    $('.icon-hlighter').removeClass('active');
    $('.icon-sticker').removeClass('active');

    $('.line_wrap').css('display', 'inline-flex');
    $('.arrow_wrap').css('display', 'none');
    $('.hlighter_wrap').css('display', 'none');
    $('.sticker_wrap').css('display', 'none');

    viewer.stop_drawHlighter();
    viewer.mode_change('straight');
    
    // 처음에 붉은색으로 색상 변경
    if (!first_line_check) {
        viewer.select_line_color('#f24545');;
        first_line_check = true;
    }
});
// 도형 - 직선 컬러
let select_line_color_off = true;
$(document).on('click', '.icon-line-color', function () {
    if (select_line_color_off) {
        $('.line_color_wrap').css('display', 'inline-flex');
        $('.icon-line-color .caret').addClass('caret_change');
        $('.icon-line-color .caret_change').removeClass('caret');
        select_line_color_off = false;

        $('.select_line_width_wrap').css('display', 'none');
        $('.icon-line-width .caret_change').addClass('caret');
        $('.icon-line-width .caret').removeClass('caret_change');
        select_line_width_off = true;

        $('.select_line_dash_wrap').css('display', 'none');
        $('.icon-line-dash .caret_change').addClass('caret');
        $('.icon-line-dash .caret').removeClass('caret_change');
        select_line_dash_off = true;
    } else {
        $('.line_color_wrap').css('display', 'none');
        $('.icon-line-color .caret_change').addClass('caret');
        $('.icon-line-color .caret').removeClass('caret_change');
        select_line_color_off = true;
    }
});
// 직선 색상 클릭
$(document).on('click', '.line_palette', function () {
    let line_color = $(this).attr('data-linecolor');
    $('.icon-line-color').click();

    viewer.select_line_color(line_color);
});
// 도형 - 직선 선두께 선택
let select_line_width_off = true;
$(document).on('click', '.icon-line-width', function () {
    if (select_line_width_off) {
        $('.select_line_width_wrap').css('display', 'inline-flex');
        $('.icon-line-width .caret').addClass('caret_change');
        $('.icon-line-width .caret_change').removeClass('caret');
        select_line_width_off = false;

        $('.line_color_wrap').css('display', 'none');
        $('.icon-line-color .caret_change').addClass('caret');
        $('.icon-line-color .caret').removeClass('caret_change');
        select_line_color_off = true;

        $('.select_line_dash_wrap').css('display', 'none');
        $('.icon-line-dash .caret_change').addClass('caret');
        $('.icon-line-dash .caret').removeClass('caret_change');
        select_line_dash_off = true;
    } else {
        $('.select_line_width_wrap').css('display', 'none');
        $('.icon-line-width .caret_change').addClass('caret');
        $('.icon-line-width .caret').removeClass('caret_change');
        select_line_width_off = true;
    }
});
// 직선 선두께 클릭
$(document).on('click', '.select_l_w', function () {
    $('.icon-line-width').click();
    let width = $(this).attr('data-line_width');

    //  background img change 
    if (width == 2) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 4) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 6) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 8) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-5.png")');
    } else if (width == 10) {
        $('.select_line_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_line_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_line_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
        $('.select_line_width_4').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-4.png")');
        $('.select_line_width_5').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-5.png")');
    }

    viewer.select_line_width(width);
});
// 도형 - 직선 대시 선택
let select_line_dash_off = true;
$(document).on('click', '.icon-line-dash', function () {
    if (select_line_dash_off) {
        $('.select_line_dash_wrap').css('display', 'inline-flex');
        $('.icon-line-dash .caret').addClass('caret_change');
        $('.icon-line-dash .caret_change').removeClass('caret');
        select_line_dash_off = false;

        $('.line_color_wrap').css('display', 'none');
        $('.icon-line-color .caret_change').addClass('caret');
        $('.icon-line-color .caret').removeClass('caret_change');
        select_line_color_off = true;

        $('.select_line_width_wrap').css('display', 'none');
        $('.icon-line-width .caret_change').addClass('caret');
        $('.icon-line-width .caret').removeClass('caret_change');
        select_line_width_off = true;
    } else {
        $('.select_line_dash_wrap').css('display', 'none');
        $('.icon-line-dash .caret_change').addClass('caret');
        $('.icon-line-dash .caret').removeClass('caret_change');
        select_line_dash_off = true;
    }
});
// 직선 대시 클릭
$(document).on('click', '.select_l_ds', function () {
    $('.icon-line-dash').click();
    let dash = $(this).attr('data-line_dash');

    //  background img change 
    if (dash == 'dash_1') {
        $('.select_line_dash_1').css('background-image', 'url("./img/viewer-skin/icon/white/arrow-dash-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-3.png")');
    } else if (dash == 'dash_2') {
        $('.select_line_dash_1').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./img/viewer-skin/icon/white/arrow-dash-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-3.png")');
    } else if (dash == 'dash_3') {
        $('.select_line_dash_1').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-1.png")');
        $('.select_line_dash_2').css('background-image', 'url("./img/viewer-skin/icon/default/arrow-dash-2.png")');
        $('.select_line_dash_3').css('background-image', 'url("./img/viewer-skin/icon/white/arrow-dash-3.png")');
    };

    viewer.select_line_dash(dash);
});
// 도형 - 형광펜
let first_hlighter_check = false;
$(document).on('click', '.icon-hlighter', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-hlighter').addClass('active');
    $('.icon-arrow').removeClass('active');
    $('.icon-line').removeClass('active');
    $('.icon-sticker').removeClass('active');
    $('.icon-drawing4').removeClass('active');

    $('.hlighter_wrap').css('display', 'inline-flex');
    $('.arrow_wrap').css('display', 'none');
    $('.line_wrap').css('display', 'none');
    $('.sticker_wrap').css('display', 'none');

    viewer.drawing_hlighter_mode_change('hlighter');
    // 처음에 붉은색으로 색상 변경
    if (!first_hlighter_check) {
        viewer.select_hlighter_color('#f24545');
        first_hlighter_check = true;
    }
});
// 도형 - 형광펜 색상 선택창 클릭
let select_hlighter_color_off = true;
$(document).on('click', '.icon-hlighter-color', function () {
    $('.icon-drawing4').removeClass('active');

    if (select_hlighter_color_off) {
        $('.select_hlighter_color_wrap').css('display', 'inline-flex');
        $('.icon-hlighter-color .caret').addClass('caret_change');
        $('.icon-hlighter-color .caret_change').removeClass('caret');
        select_hlighter_color_off = false;

        $('.select_hlighter_width_wrap').css('display', 'none');
        $('.icon-hlighter-width .caret_change').addClass('caret');
        $('.icon-hlighter-width .caret').removeClass('caret_change');
        select_hlighter_width_off = true;
    } else {
        $('.select_hlighter_color_wrap').css('display', 'none');
        $('.icon-hlighter-color .caret_change').addClass('caret');
        $('.icon-hlighter-color .caret').removeClass('caret_change');
        select_hlighter_color_off = true;
    };
});
// 도형 - 형광펜 색상 클릭
$(document).on('click', '.hlighter_palette', function () {
    let hlighter_color = $(this).attr('data-hlightercolor');
    $('.icon-hlighter-color').click();

    viewer.select_hlighter_color(hlighter_color);
});
// 도형 - 형광펜 두께 선택
let select_hlighter_width_off = true;
$(document).on('click', '.icon-hlighter-width', function () {
    $('.icon-drawing4').removeClass('active');

    if (select_hlighter_width_off) {
        $('.select_hlighter_width_wrap').css('display', 'inline-flex');
        $('.icon-hlighter-width .caret').addClass('caret_change');
        $('.icon-hlighter-width .caret_change').removeClass('caret');
        select_hlighter_width_off = false;

        $('.select_hlighter_color_wrap').css('display', 'none');
        $('.icon-hlighter-color .caret_change').addClass('caret');
        $('.icon-hlighter-color .caret').removeClass('caret_change');
        select_hlighter_color_off = true;

    } else {
        $('.select_hlighter_width_wrap').css('display', 'none');
        $('.icon-hlighter-width .caret_change').addClass('caret');
        $('.icon-hlighter-width .caret').removeClass('caret_change');
        select_hlighter_width_off = true;
    };
});
// 도형 - 형광펜 두께 선택
$(document).on('click', '.select_h_w', function () {
    let hlighter_width = $(this).attr('data-hlighterWidth');
    $('.icon-hlighter-width').click();

    //  background img change 
    if (hlighter_width == '12') {
        $('.select_hlighter_width_1').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
    } else if (hlighter_width == '18') {
        $('.select_hlighter_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-3.png")');
    } else if (hlighter_width == '24') {
        $('.select_hlighter_width_1').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-1.png")');
        $('.select_hlighter_width_2').css('background-image', 'url("./img/viewer-skin/icon/default/line-width-2.png")');
        $('.select_hlighter_width_3').css('background-image', 'url("./img/viewer-skin/icon/white/line-width-3.png")');
    };

    viewer.select_hlighter_width(hlighter_width);
});
// 도형 - 스티커
$(document).on('click', '.icon-sticker', function () {
    $('.icon-drawing4').css('display', 'none');

    $('.icon-sticker').addClass('active');
    $('.icon-arrow').removeClass('active');
    $('.icon-line').removeClass('active');
    $('.icon-hlighter').removeClass('active');

    $('.sticker_wrap').css('display', 'inline-flex');
    $('.hlighter_wrap').css('display', 'none');
    $('.arrow_wrap').css('display', 'none');
    $('.line_wrap').css('display', 'none');

    viewer.mode_change('image');

    viewer.stop_drawHlighter();

});
// 도형 - 스티커 선택
$(document).on('click', '.sticker_select', function () {
    let select_sticker = $(this).attr('data-sticker');
    let _url = "http://localhost:8100/js/pc/ele/viewer/img/viewer-skin/icon/default/icon-" + select_sticker + ".png";

    viewer.mode_change('image');

    viewer.make_sticker(_url);
});
// 선 굵기
let stroke_width_select_open = false;
$(document).on('click', '.stroke_width', function () {
    if (!stroke_width_select_open) {
        $('.stroke_width_wrap').css('display', 'flex');
        $('.palette .caret').addClass('caret_change');
        $('.palette .caret_change').removeClass('caret');
        stroke_width_select_open = true;
    } else {
        $('.stroke_width_wrap').css('display', 'none');
        $('.palette .caret_change').addClass('caret');
        $('.palette .caret').removeClass('caret_change');
        stroke_width_select_open = false;
    }
});
// 폰트 색상
let font_color_select_open = false;
$(document).on('click', '.icon-font-color', function () {
    if (!font_color_select_open) {
        $('.font_color_wrap').css('display', 'flex');
        $('.icon-font-color .caret').addClass('caret_change');
        $('.icon-font-color .caret_change').removeClass('caret');
        font_color_select_open = true;
    } else {
        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
    }
});
// 지우개
$(document).on('click', '.icon-drawing4', function () {
    $('.icon-drawing4').addClass('active');
    viewer.drawing_mode_change('eraser');
});

// 초기화
$(document).on('click', '.icon-drawing5', function () {
    let _target;
    let target_layer;

    if ($('.icon-drawing').hasClass('active')) {
        _target = '그리기';
        target_layer = 'drawing'
    } else if ($('.icon-drawing2').hasClass('active')) {
        _target = '텍스트';
        target_layer = 'text'
    } else if ($('.icon-drawing3').hasClass('active')) {
        _target = '이미지';
        target_layer = 'image'
    }

    let _result = confirm(_target + '를 모두 삭제하시겠습니까?');
    if (_result) {
        viewer.delete_drawing(target_layer);
    }
});

// 가리기
let drawing_layer_hide = true;
let text_layer_hide = true;
let image_layer_hide = true;
$(document).on('click', '.icon-drawing6', function () {
    $('.icon-drawing4').removeClass('active');
    $('.icon-drawing5').removeClass('active');

    let target_layer;
    if ($('.icon-drawing').hasClass('active')) {
        target_layer = 'drawing_layer'
    } else if ($('.icon-drawing2').hasClass('active')) {
        target_layer = 'text_layer'
    } else if ($('.icon-drawing3').hasClass('active')) {
        target_layer = 'image_layer'
    };

    if (!drawing_layer_hide) {
        $('.icon-drawing6').addClass('active');
        viewer.hide_drawing(target_layer);
        drawing_layer_hide = true;
    } else {
        $('.icon-drawing6').removeClass('active');
        viewer.show_drawing(target_layer);
        drawing_layer_hide = false;
    };

    if (!text_layer_hide) {
        $('.icon-drawing6').addClass('active');
        viewer.hide_drawing(target_layer);
        text_layer_hide = true;
    } else {
        $('.icon-drawing6').removeClass('active');
        viewer.show_drawing(target_layer);
        text_layer_hide = false;
    };

    if (!image_layer_hide) {
        $('.icon-drawing6').addClass('active');
        viewer.hide_drawing(target_layer);
        image_layer_hide = true;
    } else {
        $('.icon-drawing6').removeClass('active');
        viewer.show_drawing(target_layer);
        image_layer_hide = false;
    }
});

// drawing stroke color change
$(document).on('click', '.palette', function () {
    if ($(this).hasClass('stroke_width')) {
        return;
    };
    $('.icon-drawing').addClass('active');
    $('.icon-drawing4').removeClass('active');
    let stroke_color = $(this).attr('data-color');

    viewer.drawing_mode_change('brush');
    viewer.select_stroke_color(stroke_color);
});

// drawing stroke width change
$(document).on('click', '.drawing_stroke_width', function () {
    if ($(this).hasClass('palette')) {
        return;
    };

    let stroke_width = $(this).attr('data-strokewidth');
    $('.stroke_width i').css({'width':stroke_width, 'height':stroke_width});
    $('.stroke_width').click();

    viewer.select_stroke_width(stroke_width);
});
// 폰트 패밀리 선택
let board_font_family_change = false;
$(document).on('click', '#font_family', function () {
    if(!board_font_family_change) {
        $('.font_family_wrap').css('display', "inline-block");
        $('#font_family .caret').addClass('caret_change');
        $('#font_family .caret_change').removeClass('caret');
        board_font_family_change = true;

        $('.font_size_wrap').css('display', "none");
        $('#font_size .caret_change').addClass('caret');
        $('#font_size .caret').removeClass('caret_change');
        board_font_size_change = false;

        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
    } else {
        $('.font_family_wrap').css('display', "none");
        $('#font_family .caret_change').addClass('caret');
        $('#font_family .caret').removeClass('caret_change');
        board_font_family_change = false;
    }
});
// 폰트 패밀리 변경
$(document).on('click', '.select_f_fm', function () {
    let _fontFamily = $(this).attr('data-font_family');
    viewer.text_fontFamily_change(_fontFamily);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "viewer.text_fontFamily_change('"+_fontFamily+"');"
    }));

    let change_text;
    if(_fontFamily == 'NanumGothic') {
        change_text = '나눔고딕';
    } else if(_fontFamily == 'NanumSquare') {
        change_text = '나눔스퀘어';
    } else if(_fontFamily == 'NanumSquare_bold') {
        change_text = '나눔스퀘어 Bold';
    } else if(_fontFamily == 'NanumMyeongjo') {
        change_text = '나눔명조';
    }

    $('.ff_text').text(change_text);
    $('#font_family').css('font-family',_fontFamily);

    // 선택 후 닫기
    $('#font_family').click();
});

// 폰트 사이즈 선택
let board_font_size_change = false;
$(document).on('click', '#font_size', function () {
    if(!board_font_size_change) {
        $('.font_size_wrap').css('display', "inline-block");
        $('#font_size .caret').addClass('caret_change');
        $('#font_size .caret_change').removeClass('caret');
        board_font_size_change = true;

        $('.font_family_wrap').css('display', "none");
        $('#font_family .caret_change').addClass('caret');
        $('#font_family .caret').removeClass('caret_change');
        board_font_family_change = false;

        $('.font_color_wrap').css('display', 'none');
        $('.icon-font-color .caret_change').addClass('caret');
        $('.icon-font-color .caret').removeClass('caret_change');
        font_color_select_open = false;
    } else {
        $('.font_size_wrap').css('display', "none");
        $('#font_size .caret_change').addClass('caret');
        $('#font_size .caret').removeClass('caret_change');
        board_font_size_change = false;
    }
});
// 폰트 사이즈 변경
$(document).on('click', '.select_f_fs', function () {
    let _fontSize = $(this).attr('data-font_size');

    let fs;
    if(_fontSize == '50'){
        fs = 67
    } else if(_fontSize == '60') {
        fs = 80
    } else if(_fontSize == '70') {
        fs = 93
    } else if(_fontSize == '80') {
        fs = 107
    } else if(_fontSize == '90') {
        fs = 120
    } else if(_fontSize == '100') {
        fs = 133
    };

    viewer.text_font_size_change(fs);

    window.dispatchEvent(new CustomEvent('send_to_mirror', {
        type: "script",
        detail: "viewer.text_font_size_change('"+fs+"');"
    }));

    $('.fs_text').text(_fontSize + 'pt');

    // 선택 후 닫기
    $('#font_size').click();
});
// 폰트 사이즈 크게
$(document).on('click', '.icon-font-lg', function () {
    let _fontSize = $('.fs_text').text().split('pt');

    let setFontSize = parseInt(_fontSize[0]) + 10;
    if (setFontSize > 100) {
        show_alert("가장 큰 폰트 사이즈는 100pt입니다.");
        return;
    } else {
        $('.fs_text').text(parseInt(setFontSize) + 'pt');

        let fs;
        if(setFontSize == '50'){
            fs = 67
        } else if(setFontSize == '60') {
            fs = 80
        } else if(setFontSize == '70') {
            fs = 93
        } else if(setFontSize == '80') {
            fs = 107
        } else if(setFontSize == '90') {
            fs = 120
        } else if(setFontSize == '100') {
            fs = 133
        };

        viewer.text_font_size_lg(fs);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "viewer.text_font_size_lg('"+fs+"');"
        }));
    }
});

// 폰트 사이즈 작게
$(document).on('click', '.icon-font-sm', function () {
    let _fontSize = $('.fs_text').text().split('pt');

    let setFontSize = parseInt(_fontSize[0]) - 10;
    if (setFontSize < 50) {
        show_alert("가장 작은 폰트 사이즈는 50pt입니다.");
        return;
    } else {
        $('.fs_text').text(parseInt(setFontSize) + 'pt');

        let fs;
        if(setFontSize == '50'){
            fs = 67
        } else if(setFontSize == '60') {
            fs = 80
        } else if(setFontSize == '70') {
            fs = 93
        } else if(setFontSize == '80') {
            fs = 107
        } else if(setFontSize == '90') {
            fs = 120
        } else if(setFontSize == '100') {
            fs = 133
        };

        viewer.text_font_size_sm(fs);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "viewer.text_font_size_sm('"+fs+"');"
        }));
    }
});

// 폰트 컬러 변경
$(document).on('click', '.font_palette', function () {
    let font_color = $(this).attr('data-fontcolor');
    $('.icon-font-color').click();
    $('.font_color_wrap').children('.font_palette').removeClass('active');
    $('.font_color_wrap button[data-fontcolor="' + font_color + '"]').addClass('active');
    $('.fc_change').css('background-color', font_color);
		if (font_color == '#ffffff') {
            $('.fc_change').css('border', '1px solid #666');
		} else {
            $('.fc_change').css('border', 'none');
		};
        viewer.text_font_fill(font_color);

        window.dispatchEvent(new CustomEvent('send_to_mirror', {
            type: "script",
            detail: "viewer.text_font_fill('"+font_color+"');"
        }));
});