'use strict';
let valid1 = $('#form1').validate();
let oTable1 = null;
let tempVal = null;
var page = {
	// 변수 선언
	v : {
		selected_rows : null,
		col1 : [{
			data : "CREATE_DT", // 덧글 작성일
			 width : 60,
		}, {
			data : "CreaterID", // 덧글작성자
			"render" : function(data, type, full, meta) {
				return data + '<br>' + full.CreaterNM
			},
		}, {
			data : "Memo", // 덧글
			width : 300,
		}, {
			data : "ApplyType",
			sClass : "center"
		}, {
			data : "ApplyTeacher", // 신청자
		}, {
			data : "Subject", // 응모작 주재
		}, {
			data : "MJACIdx", // 삭제
			width : 50,
			sClass : "center",
			"render" : function(data, type, full, meta) {

				let activeTF = full.AdminDelTF ? 'active' : '';

				return '<a href="javascript:;" data-MJACIdx="' + data + '" class="DelCommentBtn ' + activeTF + ' btn">삭제</a>';
			}
		},
		],// col end
		oTable1 : {
			draw : 0,
			eventTF : false,
			indexRow : null
		},
	},// page end

	// 서버 통신 관련 함수
	call : {
		// 정보 가져오기
		getEventMJApplyCommentList : function(p) {
			page.v.oTable1.indexRow = null;
			oTable1 = $('#DT_Grid1').DataTable({
				Processing : true,
				ordering : true,
				pageLength : 10,
				dom : 'Bfrtip',
				buttons : ['copy', 'print', 'excel'
				],
				ajax : {
					'url' : '/award/admin/getEventMJApplyCommentList.ax',
					'type' : 'POST',
					dataType : 'json',
					dataSrc : "rows",
					data : function(d) {
						d.MJIdx = $('#SMJIdx').val(), d.ApplyType = $('#SApplyType').val()
					},
				},
				language : {
					"url" : "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Korean.json"
				},
				columns : page.v.col1,
				order : [[0, 'desc'
				]
				],
			});

			oTable1.on('draw.dt', function () {
				SEMICOLON.documentOnResize.init();
			});
		},

		// 댓글삭제
		saveEventMJAdminComment : function(vMJACIdx) {
			let param = {
				MJACIdx : vMJACIdx,
			}
			$.post('/award/admin/removeEventMJAdminComment.ax', param).done(function(data) {
				$.alert("삭제 완료되었습니다.", '알림');
			});
		},
	},
	// 이벤트 선언과, 이벤트 함수 목록
	func : {
		initTable : function() {
			oTable1.ajax.reload(null);
		},
		deleteCommentBtn : function() {
			let _this = $(this);
			let msg = "댓글을 삭제하시겠습니까?";
			let btnName = "삭제";
			if(_this.hasClass("active")){
				msg = "삭제한 댓글을 복구하시겠습니까?";
				btnName = "복구";
			}
			$.confirm({
				title : '알림!',
				content : msg,
				animation : 'scale',
				closeAnimation : 'scale',
				boxWidth : '340px',
				useBootstrap : false,
				buttons : {
					confirm : {
						text : btnName,
						btnClass : 'btn-blue',
						action : function() {
							page.call.saveEventMJAdminComment(_this.data('mjacidx'))
							tempVal = _this;
							_this.toggleClass('active');
						}
					},
					cancel : {
						text : '닫기'
					}
				}
			});
		},

		// 이벤트
		event : function() {
			// 삭제버튼
			$(document).on('click', '.DelCommentBtn', page.func.deleteCommentBtn);
			// 조회조건 회차 변경
			$(document).on('change', '#SMJIdx', page.func.initTable);
			// 조회조건 응모분야 변경
			$(document).on('change', '#SApplyType', page.func.initTable);
		},

	},

	// 페이지 초기화
	init : function() {
		//메뉴버튼 활성화
		$('.navCommentList').addClass('active')
		page.func.event(); // 이벤트 초기화
		page.call.getEventMJApplyCommentList(); // 정보 추출
		SEMICOLON.documentOnResize.init();
	}
};

$(function() {
	page.init();
});
