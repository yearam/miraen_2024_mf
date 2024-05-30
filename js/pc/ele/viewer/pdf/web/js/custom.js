function pdfGetViewer() {
	return PDFViewerApplication.pdfViewer;
}
function pdfPage(pdfNum) {
	PDFViewerApplication.page = pdfNum;
	$('#viewer').addClass('start');
	$('.page').eq(pdfNum - 1).addClass('active').siblings().removeClass('active');
}

// 이전
function pdfPrev() {
    var pdfNum = PDFViewerApplication.page,
        pdfCount = PDFViewerApplication.pagesCount;
    if (Number(pdfNum) < 2) {
        return;
    }
    pdfNum--;
    PDFViewerApplication.page = pdfNum;
    $('#viewer').addClass('start');
    $('.page').eq(pdfNum - 1).addClass('active').siblings().removeClass('active');
}
// 다음
function pdfNext() {
    var pdfNum = PDFViewerApplication.page,
        pdfCount = PDFViewerApplication.pagesCount;
    if (Number(pdfNum) + 1 > pdfCount) {
        return;
    }
    pdfNum++;
    PDFViewerApplication.page = pdfNum;
    $('#viewer').addClass('start');
    $('.page').eq(pdfNum - 1).addClass('active').siblings().removeClass('active');
}

// 줌인
function pdfZoomIn() {
	PDFViewerApplication.zoomIn();
}
// 줌아웃
function pdfZoomOut() {
	PDFViewerApplication.zoomOut();
}
// fit
function pdfFit() {
	// var pdfNum = PDFViewerApplication.page,
	// pdfCount = PDFViewerApplication.pagesCount;
	$('#viewerContainer').toggleClass('mode-onepage');
	PDFViewerApplication.pdfViewer.currentScaleValue = 'page-fit';
	//PDFViewerApplication.page = pdfNum;
};

function pdfScaleChangeEvent(e) {
	parent && parent.pdfScaleChangeEvent(e);
	// console.log(e);
	//e.scale
}
// 페이지 렌더링 이벤트, 처리 안해도 됨.
function pdfPageRenderedEvent(e) {
	parent && parent.pdfPageRenderedEvent(e);
	// console.log(e);
}
function pdfPageChangeEvent(e) {
	parent && parent.pdfPageChangeEvent(e);
	// 	var page = evt.pageNumber;
	//   if (evt.previousPageNumber !== page) {
	//     document.getElementById('pageNumber').value = page;
	//     if (PDFViewerApplication.sidebarOpen) {
	//       PDFViewerApplication.pdfThumbnailViewer.scrollThumbnailIntoView(page);
	//     }
	//   }
	//   var numPages = PDFViewerApplication.pagesCount;
}
function pdfUpdateViewAreaEvent(e) {
	var pageContainer1 = $('#pageContainer1'),
		viewerContainer = $('#viewerContainer');
	if (pageContainer1.height() > viewerContainer.height()) {
		viewerContainer.addClass('grab-mode');
	} else {
		viewerContainer.removeClass('grab-mode');
	}
	parent && parent.pdfUpdateViewAreaEvent(e);
	// console.log(e);
	// var location = evt.location;

	// PDFViewerApplication.store.initializedPromise.then(function() {
	// 	PDFViewerApplication.store.setMultiple({
	// 	'exists': true,
	// 	'page': location.pageNumber,
	// 	'zoom': location.scale,
	// 	'scrollLeft': location.left,
	// 	'scrollTop': location.top
	// 	}).catch(function() {
	// 	// unable to write to storage
	// 	});
	// });
}

// document.addEventListener('updateviewarea',function(){
// 	if(PDFViewerApplication.url.split('page=')[1]){
// 		var num = PDFViewerApplication.url.split('page=')[1];
// 		PDFViewerApplication.page = num;
// 		$('#viewer').addClass('start');
// 		$('.page').eq(num-1).addClass('active').siblings().removeClass('active');
// 	}
// }, true);

// 링크 클릭 시 정보
$('#viewer').on('click touchend', 'a', function () {
	var $t = $(this),
		title = $t.attr('title'),
		link = $t.attr('href');
	//alert('title : '+$t.attr('title')+' href : '+$t.attr('href'));
	parent && parent.pdfLink(title, link);
	return false;
});

