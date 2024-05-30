'use strict';
let valid1 = $('#form1').validate();
let oTable1 = null;
let tempval = null;
var page = {
	// 변수 선언
	v : {
		selected_rows : null,
		col1 : [{
			data : "OrderNo", // NO
			sClass : "center"
		}, {
			data : "ApplyType", // 응모분야
			width : 40,
		}, {
			data : "OpenYN", // 공개여부
			sClass : "center",
			width : 50,
			"render" : function(data, type, full, meta) {
				return data + '<br>' + full.TeamYN;
			},
		}, {
			data : "RegDate", // 신청일
			width : 60,
			"render" : function(data, type, full, meta) {
				return data;
			},
		}, {
			data : "Subject", // 주제
		}, {
			data : "SubjectFileName", // 첨부파일
			"render" : function(data, type, full, meta) {
				// 앞뒤에 첨부파일이 있을경우에만 ,(쉼표)를 붙여줌.
				let v = '';
				if (data != '')
					v = '<a href="'+full.SubjectFilePath+'" class="link" target="_blank" download="'+data+'">'+data+'</a>';
				return v;
			},
		}, {
			data : "ETCFileName", // 기타파일
			"render" : function(data, type, full, meta) {
				// 앞뒤에 첨부파일이 있을경우에만 ,(쉼표)를 붙여줌.
				let v = '';
				if (full.ETCFileName != '')
					v = '<a href="'+full.ETCFilePath+'" class="link" target="_blank" download="'+data+'">'+data+'</a>';
				return v;
			}
		}, {
			data : "YoutubeLink1", // 동여상링크
			width : 40,
			"render" : function(data, type, full, meta) {
				let v = '';
				if (full.YoutubeLink1 != '')
					v = v + '<a href="' + full.YoutubeLink1 + '" class="link" target="_blank">Link1</a>';
				if (full.YoutubeLink2 != '')
					v = v + ', <a href="' + full.YoutubeLink2 + '" class="link" target="_blank">Link2</a>';
				if (full.YoutubeLink3 != '')
					v = v + ', <a href="' + full.YoutubeLink3 + '" class="link" target="_blank">Link3</a>';
				return v;
			},
		}, {
			data : "PointSum", // 점수 합계
			width : 50,
			sClass : "pointsum center",
		}, {
			data : "Point1", // 점수1
			width : 50,
			sClass : "pointsum center",
			visible: false
		}, {
			data : "Point2", // 점수1
			width : 50,
			sClass : "pointsum center",
			visible: false
		}, {
			data : "Point3", // 점수1
			width : 50,
			sClass : "pointsum center",
			visible: false
		}, {
			data : "Point4", // 점수1
			width : 50,
			sClass : "pointsum center",
			visible: false
		}, {
			data : "Point5", // 점수1
			visible: false
		}, {
			data : "Point6", // 점수1
			visible: false
		}, {
			data : "Point7", // 점수1
			visible: false
		}, {
			data : "Memo", // 점수1
			sClass : "",
			visible: false
		}

		],// col end
		Point : new Array(0, 0, 0, 0, 0, 0, 0),
		MJAIdx : null,
	},// page end

	// 서버 통신 관련 함수
	call : {

		// 점수저장버튼 클릭
		saveEventMJApplyReview : function() {
			let param = {
				MJIdx : $('#SMJIdx').val(),
				MJAIdx : page.v.MJAIdx,
				Point1 : $('#Point1').val(),
				Point2 : $('#Point2').val(),
				Point3 : $('#Point3').val(),
				Point4 : $('#Point4').val(),
				Point5 : $('#Point5').val(),
				Point6 : $('#Point6').val(),
				Point7 : $('#Point7').val(),
				Memo : $('#Memo').val(),
			}
			$.post('/award/admin/saveEventMJApplyReview.ax', param).done(function(data) {
				let result = JSON.parse(data);
				if(result['resultCode'] == 'success'){
					page.call.getEventMJApplySelectCnt();

					// 리로드 후해당 페이지 이동
					let p = oTable1.page();
					oTable1.ajax.reload(function(json) {
						oTable1.page(p).draw(false);
					});
					page.func.formInit();

					$.alert('점수가 저장되었습니다.', '알림');
				}else{
					$.alert('오류가 발생했습니다. 관리자에게 문의해주세요.', '알림');
				}
			});
		},
		// 선별 카운트 가져오기
		getEventMJApplySelectCnt : function(MJIdx) {
			$.post('/award/admin/getEventMJApplySelectCnt.ax', {
				'MJIdx' : $("#SMJIdx option:selected").val(),
				'ApplyType' : $('#SApplyType').val(),
				'TeamYN' : $('#STeamYN').val(),
				'OpenYN' : $('#SOpenYN').val(),
				'ApplyPathType' : $('#SApplyPathType').val(),
			}).done(function(data) {
				let result = JSON.parse(data);
				$('#SelectionCnt').text(result['totalCnt'] || 0);

			});
		},

		// 정보 가져오기
		getEventMJApplyList : function() {
			oTable1 = $('#DT_Grid1').DataTable({
				Processing : true,
				destroy : true,
				select : true,
				ordering : true,
				// paging : true,
				pageLength : 10,
				// info : true,
				// searching : true,
				// bLengthChange : false, // 디스플레이 개수 셀렉트박스 비활성\
				dom : 'Bfrtip',
				buttons : ['copy', 'print', 'excel'
				],
				ajax : {
					'url' : '/award/admin/getEventMJApplyReviewList.ax',
					'type' : 'POST',
					dataType : 'json',
					dataSrc : "rows",
					data : function(d) {
						d.MJIdx = $('#SMJIdx').val(), d.ApplyType = $('#SApplyType').val(), d.TeamYN = $('#STeamYN').val(), d.OpenYN = $('#SOpenYN').val(), d.ApplyPathType = $('#SApplyPathType').val()

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

			$('#DT_Grid1 tbody').unbind("click");
			$('#DT_Grid1 tbody').on('click', 'tr', function() {
				let data = oTable1.row(this).data();
				if ($(this).hasClass('selected')) {
					page.v.MJAIdx = null;
					oTable1.$('tr.selected').removeClass('selected');
					$('#form1')[0].reset();
				} else {
					page.v.MJAIdx = data.MJAIdx;
					oTable1.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');

					// 목록 선택시 폼에 값 넣기
					page.func.setForm(oTable1.row(this).data());
				}
			});
			oTable1.on('draw.dt', function () {
				 page.func.formInit();
				 SEMICOLON.documentOnResize.init();
			});
		},
	},
	// 이벤트 선언과, 이벤트 함수 목록
	func : {

		// 테이블 재조회
		initTable : function() {
			oTable1.ajax.reload(null);
			page.call.getEventMJApplySelectCnt();
		},
		// 리스트 선택시
		setForm : function(data) {
			// 널이면 초기화
			if (null == data) {
				page.func.formInit();
				return;
			}
			$.each(data, function(nm, val) {
				$("#form1 #" + nm).val(val);
			});
		},

		// 폼 초기화
		formInit : function(data) {
			valid1.resetForm();
			// 추가 사항 넣기
		},

		/***********************************************************************
		 * 저장 참고후 아래 필요 없는 부분은 삭제
		 **********************************************************************/

		// 점수저장버튼 이벤트
		savePoint : function() {
			if ($("tr.selected").length === 0) {
				$.alert('선택된 응모가 없습니다.');
				return;
			}

			page.call.saveEventMJApplyReview();
		},

		// 이벤트
		event : function() {
			// 조회조건 회차 변경
			$(document).on('change', '#SMJIdx', page.func.initTable);
			// 조회조건 응모분야 변경
			$(document).on('change', '#SApplyType', page.func.initTable);
			// 조회조건 공개여부 변경
			$(document).on('change', '#SOpenYN', page.func.initTable);
			// 조회조건 팀 변경
			$(document).on('change', '#STeamYN', page.func.initTable);
			// 조회조건 응모경로 변경
			$(document).on('change', '#SApplyPathType', page.func.initTable);
			// 조회조건 점수저장 버튼 클릭
			$(document).on('click', '#form1 .savepoint', page.func.savePoint);
		},

	},

	// 페이지 초기화
	init : function() {
		// 메뉴버튼 활성화
		$('.navReviewList').addClass('active')
		page.func.event(); // 이벤트 초기화
		page.call.getEventMJApplyList(); // 정보 추출
		page.call.getEventMJApplySelectCnt(); // 심사 응모갯수
		SEMICOLON.documentOnResize.init();
	}
};

$(function() {
	page.init();
});
