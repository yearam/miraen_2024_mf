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
			width : 40
		}, {
			data : "ApplyType", // 응모분야
			width : 40 ,
		}, {
			data : "OpenYN", // 공개여부
			sClass : "center",
			width : 60,
			"render" : function(data, type, full, meta) {
				return data + '<br>'+full.TeamYN;
			},
		}, {
			data : "RegDate", // 신청일
			 width : 60,
			"render" : function(data, type, full, meta) {
				return data;
			},
		}, {
			data : "RecommendCnt",// 추천수
			sClass : 'center',
			width : 40,
		}, {
			data : "CommentCnt",// 덧글 수
			sClass : 'center',
			width : 40,
		}
		, {
			data : null,// 팀원
			width : 80,
			"render" : function(data, type, full, meta) {
				return full.Teacher1 + full.Teacher2 + full.Teacher3 + full.Teacher4 + full.Teacher5 ;
			},
		}
		, {
			data : null,// 학교명
			width : 150,
			"render" : function(data, type, full, meta) {
				return full.School1 + full.School2 + full.School3 + full.School4 + full.School5 ;
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
			data : "SubjectFileName", // 응모작
			"render" : function(data, type, full, meta) {
				// 앞뒤에 첨부파일이 있을경우에만 ,(쉼표)를 붙여줌.
				let v = '';
				if (data != '')
					v = '<a href="'+apiHostCms+'/cms/files/view/' + full.SubjectFileID + '" class="link" target="_blank" download="' + data + '">' + data + '</a>';
				return v;
			},
		}, {
			data : "ETCFileName", // 기타파일
			"render" : function(data, type, full, meta) {
				// 앞뒤에 첨부파일이 있을경우에만 ,(쉼표)를 붙여줌.
				let v = '';
				if (full.ETCFileName != '')
					v = '<a href="'+apiHostCms+'/cms/files/view/' + full.ETCFileId + '" class="link" target="_blank" download="' + data + '">' + data + '</a>';
				return v;
			},
		}, {
			data : "YoutubeLink1", // 동여상링크
			width: 60,
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
            data : "SelectionYN",  //선별여부 버튼
			width : 30,
			orderable : false,
			"render" : function(data, type, full, meta) {
			    data = data == 'Y' ? "Y" : "N";
				let active = data == 'Y' ? "active" : "";
				return  '<span class="hidden">'+data+'</span><a href="javascript:;" data-MJAIdx="'+full.MJAIdx+'" class="btn selectBtn '+active+'">선별</a>';
			},
        }],// col end
        oTable1 : {
            draw : 0,
            eventTF : false,
            indexRow : null
        },
    },// page end

    // 서버 통신 관련 함수
    call : {
	   // 선별 저장.
		saveEventMJApplySelect : function(vMJAIdx,vSelectionYN) {
			let param ={
				MJAIdx : vMJAIdx,
				SelectionYN : vSelectionYN
			}
			$.post('/award/admin/saveEventMJApplySelect.ax', param).done(function(data) {
				let msg = (vSelectionYN == 'Y')?'선별이 완료되었습니다.':'선별이 취소되었습니다.';
				$.alert(msg,'알림');
				page.call.getEventMJApplySelectCnt();

			});
		},
	    // 선별 카운트 가져오기
	    getEventMJApplySelectCnt : function(MJIdx) {
			$.post('/award/admin/getEventMJApplySelectCnt.ax',{
				MJIdx : $("#SMJIdx option:selected").val(),
				ApplyType : $('#SApplyType').val(),
                TeamYN : $('#STeamYN').val(),
                OpenYN : $('#SOpenYN').val(),
                ApplyPathType : $('#SApplyPathType').val(),
				SelectionYN :$('#SSelectionYN').val(),
				FormName : 'select'

			}).done(function(data) {
				let result = JSON.parse(data);
				$('#SelectionCnt').text(result['totalCnt'] || 0);
			});
		},

        // 정보 가져오기
        getEventMJApplyList : function (p) {
            page.v.oTable1.indexRow = null;
            oTable1 = $('#DT_Grid1').DataTable({
                Processing : true,
                //select : true,
                ordering : true,
                //paging : true,
                pageLength : 15,
                //info : true,
                //searching : true,
                //bLengthChange : false, // 디스플레이 개수 셀렉트박스 비활성\
                dom: 'Bfrtip',
                buttons: ['copy', 'print', 'excel'],
				//serverSide : true,
                /*buttons: [
                    'copy', 'excel', 'csv', 'pdf', 'print'
                ],*/
                ajax : {
                    'url' : '/award/admin/getEventMJApplySelectList.ax',
                    'type' : 'POST',
                    dataType : 'json',
                    dataSrc: "rows",
                    data : function (d) {
                        d.MJIdx = $('#SMJIdx').val()
						, d.SelectionYN = $('#SSelectionYN').val()
                        , d.ApplyType = $('#SApplyType').val()
                        , d.TeamYN = $('#STeamYN').val()
                        , d.OpenYN = $('#SOpenYN').val()
                        , d.ApplyPathType = $('#SApplyPathType').val()
                    },
                },
                language: {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Korean.json"
                },
                columns : page.v.col1,
                order : [ [ 0, 'desc' ] ],
            });

            oTable1.on('draw.dt', function () {
				SEMICOLON.documentOnResize.init();
			});

        },

    },
    // 이벤트 선언과, 이벤트 함수 목록
    func : {

		//테이블 재조회
		initTable : function(){
			oTable1.ajax.reload(null);
			page.call.getEventMJApplySelectCnt();
		},

		//선정버튼 클릭
		selectBtnClick: function(){
			//선별여부
			let SelectionYN = '';


        	if($(this).hasClass('active')){
				$(this).removeClass('active');
				SelectionYN = 'N';

				$(this).parent().find('.hidden').text('N');


			}else{
				$(this).addClass('active');
				SelectionYN = 'Y';
				$(this).parent().find('.hidden').text('Y');

			}
			page.call.saveEventMJApplySelect($(this).data('mjaidx'),SelectionYN);
    	},


        // 이벤트
        event : function () {
            $(document).on('change', '#SMJIdx',page.func.initTable);
			$(document).on('change', '#SApplyType',page.func.initTable );
			$(document).on('change', '#SOpenYN', page.func.initTable);
			$(document).on('change', '#STeamYN',page.func.initTable );
			$(document).on('change', '#SApplyPathType',page.func.initTable );
			$(document).on('change', '#SSelectionYN',page.func.initTable );
			$(document).on('click', '.selectBtn',page.func.selectBtnClick );
        },






    },

    // 페이지 초기화
    init : function () {
		//메뉴버튼 활성화
		$('.navSelectList').addClass('active')
        page.func.event(); // 이벤트 초기화
        page.call.getEventMJApplyList(); // 정보 추출
		page.call.getEventMJApplySelectCnt();
		SEMICOLON.documentOnResize.init();
    }
};

$(function () {
    page.init();
});
