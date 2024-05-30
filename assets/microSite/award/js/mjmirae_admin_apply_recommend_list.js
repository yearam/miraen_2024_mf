'use strict';
let valid1 = $('#form1').validate();
let oTable1 = null;
var page = {
	// 변수 선언
	v : {
		selected_rows : null,
		col1 : [{
			data : "Name", // NO
		},{
			data : "UserId", // NO
		},{
			data : "HP", // 연락처
			sClass : "center"
		}, {
			data : "RecommendCnt", // 분야
			sClass : "center"
		}, {
			data : "CommentCnt", // 공개여부
			sClass : "center"
		},],// col end
		oTable1 : {
			draw : 0,
			eventTF : false,
			indexRow : null
		},
	},// page end

	// 서버 통신 관련 함수
	call : {

		// 정보 가져오기
			getEventMJRecommendList : function(p) {
			page.v.oTable1.indexRow = null;
			oTable1 = $('#DT_Grid1').DataTable({
				Processing : true,
				// select : true,
				ordering : true,
				// paging : true,
				pageLength : 15,
				// info : true,
				// searching : true,
				// bLengthChange : false, // 디스플레이 개수 셀렉트박스 비활성\
				dom : 'Bfrtip',
				buttons : ['copy', 'print', 'excel'],
				ajax : {
					'url' : '/award/admin/getEventMJApplyRecommendList.ax',
					'type' : 'POST',
					dataType : 'json',
					dataSrc : "rows",
					data : function(d) {
						d.MJIdx = $('#SMJIdx').val();
					},
				},
				language : {
					"url" : "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Korean.json"
				},
				columns : page.v.col1,
				order : [[0, 'desc'	]],
			});

			oTable1.on('draw.dt', function () {
				 if (page.v.selected_rows != null) {
					SEMICOLON.documentOnResize.init();
				}
			});

		},

	},
	// 이벤트 선언과, 이벤트 함수 목록
	func : {

		// 테이블 재조회
		initTable : function() {
			oTable1.ajax.reload(null);
		},
		// 이벤트
		event : function() {
			// 조회조건 타입 변경
			$(document).on('change', '#SMJIdx', page.func.initTable);
		},

	},

	// 페이지 초기화
	init : function() {
		//메뉴버튼 활성화
		$('.navRecommendList').addClass('active')
		page.func.event(); // 이벤트 초기화
		page.call.getEventMJRecommendList(); // 정보 추출

	}
};

$(function() {
	page.init();

});
