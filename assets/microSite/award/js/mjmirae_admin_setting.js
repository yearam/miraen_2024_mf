'use strict';
let valid1 = $('#form1').validate();


var page = {
	// 변수 선언
	v : {
		liTemp : null,
	},

	// 서버 통신 관련 함수
	call : {
		// 기본 정보 가져오기
	    getEventMJMaster : function() {
			valid1.resetForm()
			$.post('/award/admin/getEventMJMaster.ax',{
				MJIdx : $("#SMJIdx option:selected").val(),
			}).done(function(data) {
				let jsonData = JSON.parse(data);
				let result = jsonData['resultData'] || {};
				$.each(result, function(key, val) {
					let item = $text.isEmpty(val) ? '' : val;
					$('#form1 textarea#' + key).val(item);
					$('#form1 input#' + key).val(val);
				});
				$('#form0 textarea#AdminIDs').val(result['AdminIDs'] || '');
			});
		},


		// 기본정보 저장.
		FormEventMJMasterSave : function() {
			$.confirm({
				title : '알림!',
				content : '변경된 내용을 저장하시겠습니까?',
				animation : 'scale',
				closeAnimation : 'scale',
				boxWidth : '340px',
				useBootstrap : false,
				buttons : {
					confirm : {
						text : '저장',
						btnClass : 'btn-blue',
						action : function() {
							if (valid1.form()) {
								let param = $('#form1').serializeObject();
								param.MJIdx = $("#SMJIdx option:selected").val();
								param.AdminIDs = $("#form0 #AdminIDs").val();
								$.post('/award/admin/saveEventMJMaster.ax', param).done(function(data) {
									let result = JSON.parse(data);
									if(result.totalCnt > 0){
										$.alert("기본정보가 저장 되었습니다.");
									}else{
										$.alert('오류가 발생했습니다. 관리자에게 문의해주세요.');
									}
								});
							}
						}
					},
					cancel : {
						text : '닫기'
					}
				}
			});
		},

		//이전차수 정보 가져오기.
		FormEventMJMasterBeforeSave : function() {
			let param = {
				MJIdx : $("#SMJIdx option:selected").val(),
			}
			if(Number(param.MJIdx) < 103){
				$.alert("전년도 자료가 존재 하지 않습니다.");
				return;
			}
			$.confirm({
				title : '알림!',
				content : '전년도 내용을 복사하시겠습니까?',
				animation : 'scale',
				closeAnimation : 'scale',
				boxWidth : '340px',
				useBootstrap : false,
				buttons : {
					confirm : {
						text : '저장',
						btnClass : 'btn-blue',
						action : function() {
							$.post('/award/admin/saveEventMJMasterBefore.ax', param).done(function(data) {
								$.alert("기본정보가 저장 되었습니다.");
								page.call.getEventMJMaster();
							});
						}
					},
					cancel : {
						text : '닫기'
					}
				}
			});

		},

	},
	// 이벤트 선언과, 이벤트 함수 목록
	func : {
		// 이벤트
		event : function() {
		    $(document).on('click', '#btnSave1', page.call.FormEventMJMasterSave);
			$(document).on('click', '#btnBeforeSave', page.call.FormEventMJMasterBeforeSave);
			$(document).on('change', '#SMJIdx', page.call.getEventMJMaster);
		}
	},

	// 페이지 초기화
	init : function() {
		//메뉴버튼 활성화
		$('.navSetting').addClass('active')
		page.func.event(); // 이벤트 초기화
		page.call.getEventMJMaster(); // 정보 추출
		SEMICOLON.documentOnResize.init();
		// $.datepicker.setDefaults($.datepicker.regional['ko']); // datepicker 한국어로 사용하기 위한 언어설정
		// $('#ScheduledDate').datepicker();
	}
};

$(function() {
	page.init();
});
