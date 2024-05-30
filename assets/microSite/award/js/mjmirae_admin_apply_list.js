'use strict';
let valid1 = $('#form1').validate();
let oTable1 = null;

var page = {
	// 변수 선언
	v : {
		selected_rows : null,
		col1 : [{
			data : "OrderNo", // NO
			sClass : "center",
			width : 40,
		}, {
			data : "ApplyType", // 응모분야
			width : 40,
		}, {
			data : "OpenYN", // 공개여부
			sClass : "center",
			width : 60,
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
			data : null,// 추천수
			sClass : 'center',
			width : 40,
			"render": function(){return 0;}
		}, {
			data : null,// 덧글 수
			sClass : 'center',
			width : 40,
			"render": function(){return 0;}
		}
		, {
			data : null,// 팀원
			width : 80,
			"render" : function(data, type, full, meta) {
				return full.ApplyTeacher1 + full.ApplyTeacher2 + full.ApplyTeacher3 + full.ApplyTeacher4 + full.ApplyTeacher5 ;
			},
		}
		, {
			data : null,// 학교명
			width : 150,
			"render" : function(data, type, full, meta) {
				return full.TeacherSchool1 + full.TeacherSchool2 + full.TeacherSchool3 + full.TeacherSchool4 + full.TeacherSchool5 ;
			},
		}
		, {
			data : "HP",// 연락처 / 이메일
			width : 100,
		}
		, {
			data : "Email",// 연락처 / 이메일
			width : 100,
		}
		, {
			data : "Subject", // 주제
			"render" : function(data, type, full, meta) {
				return '<a href="/award/mjmirae10.mrn?uuid=' + full.ShareUUID + '" class="link" target="_blank">' + data + '</a>';
			},
		}, {
			data : "SubjectFileName", // 첨부파일
			"render" : function(data, type, full, meta) {
				// 앞뒤에 첨부파일이 있을경우에만 ,(쉼표)를 붙여줌.
				let v = '';
				if (data != null && data != '')
					v = '<a href="'+apiHostCms+'/cms/files/view/' + full.SubjectFileID + '" class="link" target="_blank" download="' + data + '">' + data + '</a>';
				return v;
			},
		}, {
			data : "ETCFileName", // 기타파일
			"render" : function(data, type, full, meta) {
				// 앞뒤에 첨부파일이 있을경우에만 ,(쉼표)를 붙여줌.
				let v = '';
				if (data != null && data != '')
					v = '<a href="'+apiHostCms+'/cms/files/view/' + full.ETCFileId + '" class="link" target="_blank" download="' + data + '">' + data + '</a>';
				return v;
			},
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
			data : "ApplyPathType", // 응모경로
			width : 100,
			"render" : function(data, type, full, meta) {
				if (data != '') {
					data = data.substring(0, data.length - 1);
				}
				return data
			},
		}
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
		getEventMJApplyList : function(p) {
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
				buttons : ['copy', 'print', 'excel'
				],
				// serverSide : true,
				/*
				 * buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
				 */
				ajax : {
					'url' : '/award/admin/getEventMJApplyList.ax',
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
			// Draw조회후
			oTable1.on('draw.dt', function() {
				SEMICOLON.documentOnResize.init();
			});

		},

	},
	// 이벤트 선언과, 이벤트 함수 목록
	func : {
		initTable : function() {
			oTable1.ajax.reload(null);
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
		},

	},

	// 페이지 초기화
	init: function() {
		// 메뉴버튼 활성화
		let menuKey = $("body").data('menukey');
		$('#'+menuKey).addClass('active');
		console.log(menuKey)

		page.func.event(); // 이벤트 초기화
		page.call.getEventMJApplyList(); // 정보 추출

	}
};

$(function() {
	page.init();

});
