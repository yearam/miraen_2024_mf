//show
$('[data-toggle=show]').click(function(){
	var $t = $(this),
		target = $t.data('target');
	$('[data-toggle=show][data-target="'+target+'"]').toggleClass('active');
	$($t.data('target')).toggleClass('active');
});
$('[data-toggle=accordion]').click(function(){
	var $t = $(this),
		target = $t.data('target'),
		group = $t.data('group');
	$('[data-toggle=accordion][data-group="'+group+'"]').removeClass('active');
	$t.addClass('active');
	$('[data-target-group="'+group+'"]').removeClass('active');
	$(target).toggleClass('active');
});
//show
$('[data-toggle=aside]').click(function(){
	$('#viewer-wrap').toggleClass('aside-close');
});
/* 리사이즈 임시 */
// $(window).resize(function(){
// 	var ratio = $('#viewer-content').height()/952;
// 	$('#iframe_content').contents().find('#wrap').css({
// 		'transform':'scale('+ratio+')',
// 		'transform-origin':'top'
// 	})
// 	//viewer_content_sizing_auto();
// }).resize();

// $(document).ready(function () {
// 	$(window).resize(function(){
// 		viewer_content_sizing_auto();
// 	}).resize();
// })




var ZOOM_FACTOR = 1.0;
var SCREEN_RATIO = "fill"; // "fit, fill"

function viewer_content_sizing_auto () {


	var $main_container = $("#viewer_content");
	// var $main_container = $('#viewer-wrap article');

	var parent_w = $main_container.width();
	var parent_h = $main_container.height();

	console.log('auto sizeing : ', parent_w + "," + parent_h);

	viewer_content_set_css(parent_w,parent_h)

}


function viewer_content_sizing_force (parent_w, parent_h) {



	setTimeout( function () {
		console.log('force sizeing : ', parent_w + "," + parent_h);
		viewer_content_set_css(parent_w,parent_h)
	},50)


}

function viewer_content_set_css (parent_w,parent_h) {

	var $targetEle = $("#iframe_content");

	var frame = $targetEle.get(0);
	var doc = (frame.contentDocument) ? frame.contentDocument : frame.contentWindow.document;
	var this_h = doc.body.scrollHeight;
	var this_w = doc.body.scrollWidth;

	var ratio_x = parent_w / this_w * ZOOM_FACTOR;
	var ratio_y = parent_h / this_h * ZOOM_FACTOR;
	var scale = ratio_x;
	if (ratio_x > ratio_y) {
		scale = ratio_y;
	}

	var top = "0px";
	var left = "0px";
	if (SCREEN_RATIO == "fit") {
		ratio_x = scale;
		ratio_y = scale;
		left = (parent_w - this_w * ratio_x) / 2 + "px";
	}

	$targetEle.css({
		'position': 'relative',
		'top': top, 'left': left,
		'width': this_w, 'height': this_h,
		'-webkit-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
		'-moz-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
		'-ms-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
		'-o-transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
		'transform': 'scale(' + ratio_x + ',' + ratio_y + ')',
		"-webkit-transform-origin": "0px 0px",
		"transform-origin": "0px 0px 0px"
	});

}
