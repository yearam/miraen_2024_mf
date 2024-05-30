let valid1 = $('#form1').validate();
let valid2 = $('#form2').validate();
let $list = null;
var username = $('body').data('username') || '';
var useremail = $('body').data('useremail') || '';
var usermobile = $('body').data('usermobile') || '';
var loginTF = (username.length > 0 ? true : false);

var page = {
	// 변수 선언
	v: {
		$isLogin: false,
		$userGrade: '',

		openTF: false,
		saveClick: false,
		selected_rows: null,
		isApplyDate: false,

		MJIdx: 105,				// 10회
		MJAIdx: 1,

		$li: null,
		$liMy: null,
		$liShare: null,
		filesTemp: null,
		thumnailFileTemp: null,
		UUID: null,
		cpage: 1,
		cpageCount: 5,
		ctotalPage: 0,
		ApplyType: '전체',
		ApplyDateTF: false, // 접수가능여부(일자초과체크)
	},// page end

	// 서버 통신 관련 함수
	call: {
		// 나의 신청 목록 가져오기
		getEventMJCApplyMyList: function() {
			let $Block = null;
			$('#block-myform').addClass('hidden');
			$.post('/award/getEventMJCApplyMyList.mrn', {
				MJIdx: page.v.MJIdx,
				ShareUUID: $('body').data('uuid'),
			}).done(function(data) {

				// 기존 목록 삭제
				$('.block-myform .ShareBlock,.MyBlock').remove();

				if (data.rows.length > 0) {
					$.each(data.rows, function(i, item) {
						if (item.MyApplyTF === 'Y') {
							$Block = page.v.$liMy.clone();
						} else {
							$Block = page.v.$liShare.clone();
						}
						$Block.find('.btnModalUpt').data('mjaidx', item.MJAIdx);
						$Block.find('.item').addClass(item.ApplyTypeClass);
						$Block.find('.ApplyType').text(item.ApplyType);
						$Block.find('.btnListShare').data('shareuuid', item.ShareUUID);
						$Block.find('.Subject').text(item.Subject);
						$Block.find('.Teacher').text(item.Teacher);

						if (item.SchoolNm.indexOf(' (') > -1) {
							let scNm = item.SchoolNm.substring(0, item.SchoolNm.indexOf(' ('));
							let addr = item.SchoolNm.substring(item.SchoolNm.indexOf(' (') + 2, 100).replace(')', '');
							$Block.find('.SchoolNm').html(scNm + '<br>' + addr);
						} else {
							$Block.find('.SchoolNm').text(item.SchoolNm);
						}

						$Block.find('.CommentCnt').text(item.CommentCnt);
						$Block.find('.CommentCnt').data('mjaidx', item.MJAIdx);
						$Block.find('.RecommendCnt').text(item.RecommendCnt);
						$Block.find('.RecommendCnt').addClass("RecommendCnt" + item.MJAIdx);
						$Block.find('.btnOpenDetail').data('mjaidx', item.MJAIdx);
						$Block.find('.HeartIMG').attr("src", item.HeartYN == "Y" ? "/static/award/images/icons/icon_heart_gr.png" : "/static/award/images/icons/icon_heart.png");
						$Block.find('.HeartIMG').addClass("HeartIMG" + item.MJAIdx);
						$Block.find('.HeartIMG').data('mjaidx', item.MJAIdx);
						$Block.find('.CommentCnt').attr('class', 'CommentCnt CommentCnt' + item.MJAIdx);
						$Block.find('.CommentIMG').attr('class', 'CommentIMG CommentIMG' + item.MJAIdx);
						$Block.find('.CommentIMG').attr("src", parseInt(item.CommentCnt) > 0 ? "/static/award/images/icons/icon_comment_gr.png" : "/static/award/images/icons/icon_comment.png");
						$Block.find('.btnOpenDetail').data('shareuuid', item.ShareUUID);
						$Block.find('.btnOpenDetail').data('applytype', item.ApplyType);
						$Block.find('.btnOpenDetail').data('teacher', item.Teacher);
						$Block.find('.btnOpenDetail').data('schoolnm', item.SchoolNm);
						$Block.find('.btnOpenDetail').data('subject', item.Subject);
						$Block.find('.btnOpenDetail').data('YoutubeLink1', item.YoutubeLink1);
						$Block.find('.btnOpenDetail').data('YoutubeLink2', item.YoutubeLink2);
						$Block.find('.btnOpenDetail').data('YoutubeLink3', item.YoutubeLink3);
						$Block.find('.btnOpenDetail').data('ETCFileName', item.ETCFileName);
						$Block.find('.btnOpenDetail').data('ETCFilePath', item.ETCFilePath);
						$Block.find('.btnOpenDetail').data('SubjectFileName', item.SubjectFileName);
						$Block.find('.btnOpenDetail').data('SubjectFilePath', item.SubjectFilePath);

						$Block.find('.btnOpenDetail').data('applyThumnailIMG', item.IMGPath); // 원본
						$Block.find('.btnOpenDetail').data('applyThumnail200IMG', item.IMG200Path); // 썸네일
						$Block.find('.btnOpenDetail').data('applyThumnail800IMG', item.IMG800Path); // 썸네일
						if (item.IMGPath !== '') {

							// $Block.find('.applyThumnailIMG').attr('src', item.IMG200Path).css('opacity', '0.3');
							$Block.find('.bgApplyThumnailIMG').css({'background' : 'url('+item.IMG200Path+')', 'background-size': 'cover', 'background-position': 'center'});

						}
						// 화면에 append
						$('#block-myform').append($Block);
						// 공유 있으면 열기
						if (($('body').data('uuid') != '') && (item.ShareUUID == $('body').data('uuid'))) {
							$Block.find('.btnOpenDetail').trigger('click');
						}
					});

					$('#block-myform').removeClass('hidden');
				} else {
					// 등록된 자료가 없습니다.
				}
			})
		},

		// 신청 목록 가져오기
		getEventMJCApplyList: function() {
			let SearchHeartYN = $('.btnSearchHeart').hasClass('active') ? 'Y' : 'N';
			let SearchCommentYN = $('.btnSearchComment').hasClass('active') ? 'Y' : 'N';
// 			let orderby = $('.btnSearchOrderby.active').data('orderby');

			let $BlockT = null;

			let param = {
				MJIdx: page.v.MJIdx,
				SearchCommentYN: 'N',
				SearchHeartYN: 'N',
				OrderBy: 'date',
				ApplyType: page.v.ApplyType,
				Search: $('#Search').val()
			}
		},

		// 폼 상세 가져오기
		getEventMJApply: function() {
			// 수정폼 이면
			$.post('/award/getEventMJApply.mrn', {
				MJIdx: page.v.MJIdx,
				MJAIdx: page.v.MJAIdx
			}).done(function(data) {

			});
		},

		// 내 신청 정보 가져오기(등록, 수정 통합)
		getEventMJApplyMy: function() {
			let formtype = $('#FormType').val();
			// 폼 초기화
			page.func.initForm();

			if (formtype == 'Ins') {
				// 등록폼 이면

			} else {
				// 수정폼 이면
				$.post('/award/getEventMJApplyMy.mrn', {
					MJIdx: page.v.MJIdx,
					MJAIdx: page.v.MJAIdx
				}).done(function(data) {
					// 값이 있으면
					if (data.rows != null) {
						let item = data.rows[0];

						$('#fileUploader1').data('fileName', item.SubjectFileName);
						$('#fileUploader1').data('filePath', item.SubjectFilePath);
						$('#fileUploader2').data('fileName', item.ETCFileName);
						$('#fileUploader2').data('filePath', item.ETCFilePath);
						$('#FileNote').data('filePath', item.IMGThumnailPath);
						$('#FileNote').data('filePath200', item.IMGThumnail200Path);
						$('#FileNote').data('filePath800', item.IMGThumnail800Path);
						$('#lbfileUploader1').text(item.SubjectFileName === '' ? '선택된 파일이 없습니다.' : item.SubjectFileName);
						$('#lbfileUploader2').text(item.ETCFileName === '' ? '선택된 파일이 없습니다.' : item.ETCFileName);


						if (item.IMGThumnail200Path !== '') {
							$('#modal_apply_form .select-file').addClass("hidden")
							$('#modal_apply_form').find('.thumb-list .select-file').before('<li class="img"><span class="thumb"></span><a href="javascript:;" class="btnImageDel">삭제</a></li>');
							$('#modal_apply_form').find('.thumb').last().css('background-image', 'url(' + item.IMGThumnail200Path.replace('\\', '/') + ')');
						}


						$.each(item, function(key, val) {
							let item = $text.isEmpty(val) ? '' : val;
							$('#modal_apply_form input#' + key).val(val);
							$('#modal_apply_form select#' + key).val(val);
							$('#modal_apply_form textarea#' + key).val(val);
							$('#modal_apply_form input:radio[name="' + key + '"]:radio[value="' + val + '"]').prop('checked', true);
						});

						let arrApplyPathType = item.ApplyPathType.split('|');

						// 테스트 해야함.
						arrApplyPathType.forEach(function(item, index) {
							$('#modal_apply_form input:checkbox[name="ApplyPathType"]:input:checkbox[value="' + item + '"]').prop('checked', true);
						});
						// 개인 팀
						if (item.TeamYN == 'Y') {
							$($('.btnTeamYN')[1]).trigger('click');
						} else {
							$($('.btnTeamYN')[0]).trigger('click');
						}

						// 수정시 약관 동의 필수 체크 되어 있음
						$('#agreed_check_userinfo').prop('checked', true);

						// 분야 선택
						let ApplyTypeIdx = (item.ApplyType == '미래교육연구') ? 0 : (item.ApplyType == '인성교육혁신') ? 1 : 2;
						$('.btnApplyType').removeClass('active');
						$($('.btnApplyType')[ApplyTypeIdx]).addClass('active');

					} else {
						$.alert('등록된 데이타가 없습니다.', '안내');
					}
				});
			}
		},

		// 응모폼 저장
		saveApplyForm: function() {
			if (page.v.saveClick) {
				$.alert('저장 또는 접수 중에는 클릭 할 수 없습니다.', '안내');
				return;
			}

			if (valid2.form()) {
				// form1 값 가져오기
				$('#form2 input[name=FormType]').val( $("#FormType").val());
				$('#form2 input[name=SchoolNm]').val( $("#SchoolNm").val());
				$('#form2 input[name=SchoolIdx]').val( $("#SchoolIdx").val());
				$('#form2 input[name=UserHP]').val( $("#UserHP").val());
				$('#form2 input[name=UserEmail]').val( $("#UserEmail").val());
				$('#form2 input[name=TeamYN]').val( $('.btnTeamYN.active').data('teamyn') );
				$('#form2 input[name=ApplyTeacher1]').val( $("#form1 #ApplyTeacher1").val());
				$('#form2 input[name=ApplyTeacher2]').val( $("#form1 #ApplyTeacher2").val());
				$('#form2 input[name=ApplyTeacher3]').val( $("#form1 #ApplyTeacher3").val());
				$('#form2 input[name=ApplyTeacher4]').val( $("#form1 #ApplyTeacher4").val());
				$('#form2 input[name=ApplyTeacher5]').val( $("#form1 #ApplyTeacher5").val());
				$('#form2 input[name=TeacherSchool1]').val( $("#form1 #TeacherSchool1").val());
				$('#form2 input[name=TeacherSchool2]').val( $("#form1 #TeacherSchool2").val());
				$('#form2 input[name=TeacherSchool3]').val( $("#form1 #TeacherSchool3").val());
				$('#form2 input[name=TeacherSchool4]').val( $("#form1 #TeacherSchool4").val());
				$('#form2 input[name=TeacherSchool5]').val( $("#form1 #TeacherSchool5").val());

				let ApplyPathType = '';
				$('.ApplyPathTypeCheck').each(function() {
					if ($(this).is(':checked'))
						ApplyPathType += ($(this).val()) + "|";
				});
				if(ApplyPathType == ''){
					$.alert('응모 경로는 필수 항목입니다.', '안내');
					return;
				}
				$('#ApplyPathTypeVal').val(ApplyPathType);

				// 응모작 pdf 를 등록해 주세요
				if ($("#fileUploader1").val() == '') {
					$.alert('응모작 파일은 필수 항목입니다.', '안내');
					return;
				}

				$cmm.ajaxUpload({
					url: '/award/saveEventMJApply.ax',
					form: $('#form2'),
					success: function(res) {
						$.alert('응모 완료되었습니다.', '알림');
						$('#modal_apply_form').modal('hide');
						$('body').find('.loadingDiv').remove();
					},
				});
			}
		},
		// 추천 저장
		saveEventMJApplyRecommend: function(pMJAIdx, pRecommendTF) {
			// 회원이 아니면 실행 안함
			if (!page.func.loginClick()) {
				return;
			}

			let param = {
				MJAIdx: pMJAIdx,
				RecommendTF: pRecommendTF,
			}

			$.post('/award/saveEventMJApplyRecommend.mrn', param).done(function(data) {
				let msg = data.strmsg.split('_/')[0];
				if (msg != '' && data.strmsg.split('_/')[1].indexOf('성공') > -1) {
					// 응모 화면 초기화
					$.alert(msg, '알림');
					if (!pRecommendTF) {
						// 모달의 하트 아이콘 변경
						$('.xi-heart').attr('class', 'xi-heart-o');
						$('.HeartIMG' + pMJAIdx).attr('src', '/static/award/images/icons/icon_heart.png');
						$('.RecommendCnt' + pMJAIdx).text(parseInt($('.RecommendCnt' + pMJAIdx).first().text()) - 1);
					} else {
						$('.xi-heart-o').attr('class', 'xi-heart');
						$('.HeartIMG' + pMJAIdx).attr('src', '/static/award/images/icons/icon_heart_gr.png');
						$('.RecommendCnt' + pMJAIdx).text(parseInt($('.RecommendCnt' + pMJAIdx).first().text()) + 1);
					}

					return true;
				} else {
					if (msg !== '') {
						$.alert(msg, '안내');
					} else {
						$.alert('오류가 발생하였습니다. 관리자에게 문의해주세요.', '안내');
					}
					return false;
				}
			});

		},

		// 댓글 목록
		getCommentList: function(cpage) {
			$.post('/award/getEventMJCApplyCommentList.mrn', {
				MJAIdx: page.v.MJAIdx,
				PageCount: page.v.cpageCount,
				Page: cpage,
			}).done(function(data) {

				$('.comment-list li').remove();
				var TCnt = 0;
				$.each(data.rows, function(idx, item) {
					var $li = $list.clone();
					$li.data('mjacidx', item.MJACIdx);
					if (item.Re > 0) {
						$li.addClass('Re');
					}
					$li.find('.txtNAME').text(item.viewName);
					$li.find('.memo').html(item.Memo.replace(/(?:\r\n|\r|\n)/g, '<br />'));

					$li.find('.txtDate').text(item.DT);
					$li.find('.btnDel, .btnChange, .btnReAdd').addClass('hidden');
					if (item.LoginYN == 'Y') {
						// 로그인 되어 있고 내꺼이거나 관리자일경우
						if (item.MYYN == 'Y') {
							$li.find('.btnDel, .btnChange').removeClass('hidden');
						}

						if (item.AdminYN == 'Y') {
							$li.find('.btnDel').removeClass('hidden');
						}
						// 로그인 된 사용자
						if (item.Re == 0) {
							// $li.find('.btnReAdd').removeClass('hidden');
						}
					}

					if (item.AdminDelYN == 'Y' || item.UserDelYN == 'Y') {
						$li.find('.memo').addClass('txtGray');
						$li.find('.btnDel, .btnChange, .btnReAdd').addClass('hidden');
					}

					$('.comment-list').append($li);
					TCnt = item.TCnt
				});

				$('.txtCount').text('댓글 ' + TCnt);

				page.v.ctotalPage = data.totalPage;
				page.func.setPagination(page.v.cpage, page.v.ctotalPage);
			});
		},

	},

	// 이벤트 선언과, 이벤트 함수 목록
	func: {
		loginClick: function(){
			if(page.v.$isLogin){
				if(page.v.$userGrade != '002'){
					$alert.open("MG00011", () => {});
					return false;
				}
				return true;
			}else{
				$alert.open("MG00001");
				return false;
			}
		},
		/**
		 * Blob으로 변환 후 반환
		 *
		 * @memberOf screen.f
		 */
		toBlob: function(dataURL) {

			let byteString = atob(dataURL.split(',')[1]);
			let mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
			let ab = new ArrayBuffer(byteString.length);
			let ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ab], { "type": mimeString });
		},
		// 상세 열기
		openModalDetail: function() {
			// 선택된 응모건의 하트 이미지에 따라서 모달의하트도 채우거나 비움
			page.v.MJAIdx = $(this).data('mjaidx');
			if ($('.HeartIMG' + page.v.MJAIdx).attr('src').indexOf('icon_heart_gr.png') > -1) {
				$('.xi-heart, .xi-heart-o ').attr('class', 'xi-heart')
			} else {
				$('.xi-heart, .xi-heart-o ').attr('class', 'xi-heart-o')
			}
			// 나중에 src걷어내야 함. 현재 src사용안함.
			$('#modal_detail .HeartIMG').attr('src', $('.HeartIMG' + page.v.MJAIdx).attr('src'));
			$('#modal_detail .RecommendCnt').text($('.RecommendCnt' + page.v.MJAIdx).first().text());
			$('#modal_detail .RecommendCnt').attr('class', 'RecommendCnt RecommendCnt' + page.v.MJAIdx);
			$('#modal_detail .HeartIMG').data('mjaidx', page.v.MJAIdx);

			$('#modal_detail .HeartIMG').attr('class', 'HeartIMG HeartIMG' + page.v.MJAIdx);
			$('#modal_detail .txtApplyType').text($(this).data('applytype'));
			$('#modal_detail .txtTeacher').text($(this).data('teacher'));
			$('#modal_detail .txtSchoolNm').text($(this).data('schoolnm'));
			$('#modal_detail .txtSubject').text($(this).data('subject'));
			$('#modal_detail .applyThumnailIMG').attr('src', $(this).data('applyThumnail800IMG'));
			$('#modal_detail .btnFileDownload1').attr('href', $(this).data('SubjectFilePath'));
			$('#modal_detail .btnFileDownload1').attr('download', $(this).data('SubjectFileName'));
			$('#modal_detail .btnShare').data('shareuuid', $(this).data('shareuuid'));
			// 첨부파일 버튼 링크가 있을때만 활성화
			$('#modal_detail .btnFileDownload2').addClass('hidden');
			$('#modal_detail .btnFileDownload22').addClass('hidden');
			if ($(this).data('ETCFilePath') !== "") {
				$('#modal_detail .btnFileDownload2').attr('href', $(this).data('ETCFilePath'));
				$('#modal_detail .btnFileDownload2').attr('download', $(this).data('ETCFileName'));
				$('#modal_detail .btnFileDownload2').removeClass('hidden')
				$('#modal_detail .btnFileDownload22').removeClass('hidden')
			}
			// 팀구분이 Y일때 팀이름 보이도록함.
			$('#modal_detail .header_block .txtTeamNm').addClass('hidden')
			if ($(this).data('TeamYN') === 'Y') {
				$('#modal_detail .header_block .txtTeamNm').removeClass('hidden')
			}
			// 유튜브버튼 1,2,3 중 유투브 링크가 있는 버튼만 활성화
			for (let i = 1; i <= 3; i++) {
				$('.btnYoutubeLink' + i).addClass('hidden')
				$('#modal_detail .btnYoutubeLink' + i).attr('href', '')
				if ($(this).data('YoutubeLink' + i) !== "") {
					$('.btnYoutubeLink' + i).removeClass('hidden')
					$('#modal_detail .btnYoutubeLink' + i).attr('href', $(this).data('YoutubeLink' + i));
				}
			}

			// 댓글 열기
			$('#modal_detail #Memo').val('');
			page.call.getCommentList(1);

			// 상세 열기
			$('#modal_detail').modal('show');
		},

		// 신청서 등록
		openModalApplyInsForm: function() {
			if(!page.v.isApplyDate){
				$.alert('참여기간이 아닙니다.', '안내');
				// $.alert('응모가 마감되었습니다.<br>수상작 발표는 2/28(화) 입니다.', '알림');
				return;
			}

			// 선생님이 아니면 실행 안함
			if (!page.func.loginClick()) return;
			$('#FormType').val('Ins');
			$('#modal_apply_form').modal('show');
		},

		// 접수 정보 확인 모달 (신청서)
		openModalApplyInsCheck: function(){
			if(!page.v.isApplyDate){
				$.alert('참여기간이 아닙니다.', '안내');
				// $.alert('응모가 마감되었습니다.<br>수상작 발표는 2/28(화) 입니다.', '알림');
				return;
			}
			if (!page.func.loginClick()) return; // 선생님이 아니면 실행 안함
			$("#checkForm")[0].reset(); // 초기화
			$('#modal_apply_check').modal('show');
		},
		// 접수 정보 확인 조회
		openModalApplyInsChecking: function(){
			if (!page.func.loginClick()) return; // 선생님이 아니면 실행 안함

			let param = new FormData($("#checkForm")[0]);
			$.post('/award/api/mjmirae_Reg_Check.mrn', {
				MJIdx: page.v.MJIdx,
				applyType: param.get('applyType'),
				userName: param.get('userName'),
				userMobile: param.get('userMobile')
			}).done(function(res) {
				let data = JSON.parse(res);
				let rows = data['resultData'] || 0;
				if(rows < 1){
					$.alert('응모내역이 없습니다.<br/>정보를 다시 확인해주세요.', '안내');
				}else{
					$.alert('응모작이 정상적으로 접수되었습니다.<br/>응모해주셔서 감사합니다.', '안내');
				}
				return false;
			});
		},

		// 신청서 수정
		openModalApplyUptForm: function() {

/*			$.alert('접수 마감되었습니다.', '알림');
			return;
*/
			// 선생님이 아니면 실행 안함
			if (!page.func.loginClick()) {
				return;
			}
			page.v.MJAIdx = $(this).data('mjaidx');
			$('#FormType').val('Upt');
			$('#modal_apply_form').modal('show');
			page.call.getEventMJApplyMy();
		},

		// 폼 step1으로 이동
		goStep1: function() {
			$('.cloading').hide();
			$('form .block-step1').removeClass('hidden');
			$('form .block-step2').addClass('hidden');
			$('#modal_apply_form').modal('handleUpdate')
		},

		// 폼 step2으로 이동
		goStep2: function() {
			// 구분이 team일경우 팀원이 한명이상 등록되어있는지 체크하는 변수
			let isError = true;

			// Step1에서 Step2로 이동 저장처리 해야함
			if (!$('.block-step1').hasClass('hidden')) {
				if (valid1.form()) {
					// 오류 없으면 from1 저장
					$('form .block-step1').addClass('hidden');
					$('form .block-step2').removeClass('hidden');
				} else {
					// 오류 있으면 알림 후 완료
					return;
				}
			} else {
				$('form .block-step1').addClass('hidden');
				$('form .block-step2').removeClass('hidden');
			}
			$('#modal_apply_form').modal('handleUpdate')
		},

		// 개인/ 팀 클릭시
		clickTeamYN: function() {
			$('.btnTeamYN').removeClass('active');
			$(this).addClass('active');
			if ($(this).data('teamyn') == 'Y') {
				// 팀이면
				$("#form1 #ApplyTeacher2").attr("required", true);
				$("#form1 #TeacherSchool2").attr("required", true);
				$("#form1 #agree1").attr("required", true);

				$('.isTeam').removeClass('hidden');

				// 약관 체크박스 초기화
				$('#agreed_check_userinfo').prop('checked', false);

				// 약관 나오고 안나오고
				$('#pop_agree .block-team').removeClass('hidden');

				$('.txtTeamYNTitle1').html('동의서 및<br>개인정보 수집 동의 <span>*</span>');
				$('.txtTeamYNTitle2').html('동의서 및 개인정보 수집 및 활용 동의');

			} else {
				// 개인이면
				$("#form1 #ApplyTeacher2").attr("required", false);
				$("#form1 #TeacherSchool2").attr("required", false);

				$("#form1 #agree1").attr("required", false);
				$('.isTeam').addClass('hidden');

				// 약관 체크박스 초기화
				$('#agreed_check_userinfo').prop('checked', false);

				// 약관 나오고 안나오고
				$('#pop_agree .block-team').addClass('hidden');

				$('.txtTeamYNTitle1').html('동의서  동의 <span>*</span>');
				$('.txtTeamYNTitle2').html('동의서  동의');
			}
		},

		// 분야 클릭시
		clickApplyType: function() {
			$('.btnApplyType').removeClass('active');
			$(this).addClass('active');
			let _applytype = $(this).data('applytype');
			$("#ApplyTypeVal").val(_applytype);
		},

		// 상단 응모 목록 탭 클릭시
		clickApplyTab: function() {// xxx
			page.v.ApplyType = $(this).children('.ApplyType').data('applytype');
			$('.block-apply-tab li a').parent().removeClass();
			$(this).parent().addClass('ui-tabs-tab ui-corner-top ui-state-default ui-tab ui-tabs-active ui-state-active');
		},

		// 공유 URL 셋팅
		setShareURL: function(URLKey) {
			var url = 'https://www.m-teacher.co.kr:444/award/mjmirae10.mrn?id=' + URLKey;
			$('#urlAddress').val(url);
		},

		// 썸네일 존재여부 체크 , retrun 원본이미지경로 또는 썸네일 이미지경로
		getExistThumnail: function(CutIMG, OrinigalIMG) {
			// 초기화
			page.v.ExistImgTF = true;
			// 섬네일 이미지 삽입 -> onload,onerror 둘중 하나 이벤트발생->ExistImgTF 상태변경
			page.v.img.src = CutIMG

			// 이미지 존재하면
			if (page.v.ExistImgTF) {
				// 초기화
				page.v.ExistImgTF = true;
				// 썸네일 이미지경로 반환
				return CutIMG;
			} else {
				// 초기화
				page.v.ExistImgTF = true;
				// 원본이미지 경로 반환
				return OrinigalIMG;
			}
		},

		/***********************************************************************
		 * 댓글 처리
		 **********************************************************************/
		// 페이지 셋팅
		setPagination: function(cpage, ctotalPage) {
			var startPage = Math.floor((page.v.cpage - 1) / 5) * 5 + 1;
			var endPage = startPage + 4;

			$('.block-page .page-link.next').data('page', endPage + 1);
			$('.block-page .page-link.prev').data('page', startPage - 5);

			// 이전 상태 처리
			if (cpage > 5) {
				$('.block-page .page-link.prev').parent().removeClass('disabled');
			} else {
				$('.block-page .page-link.prev').parent().addClass('disabled');
			}

			// 다음 상태 처리
			if (ctotalPage > endPage) {
				$('.block-page .page-link.next').parent().removeClass('disabled');
			} else {
				$('.block-page .page-link.next').parent().addClass('disabled');
			}

			var p = startPage;
			$('.block-page a.page-link.no').parent().removeClass('disabled');
			$('.block-page a.page-link.no').each(function() {
				if (p > ctotalPage) {
					$(this).parent().addClass('disabled');
				}
				if (p == page) {
					$(this).parent().addClass('active');
				} else {
					$(this).parent().removeClass('active');
				}
				$(this).text(p++);
			});
		},

		getToday: function() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1; // 1월이 0으로 되기때문에 +1을 함.
			var date = now.getDate();

			if ((month + "").length < 2) { // 2자리가 아니면 0을 붙여줌.
				month = "0" + month;
			} else {
				// ""을 빼면 year + month (숫자+숫자) 됨.. ex) 2018 + 12 = 2030이 리턴됨.
				month = "" + month;
			}
			return year + month + date;
		},

		// 명예의 전당 탭
		clickBeforeTab: function() {
			$('.block-before-tab li a').parent().removeClass();
			$(this).parent().addClass('ui-tabs-tab ui-corner-top ui-state-default ui-tab ui-tabs-active ui-state-active');
			$('.block-before-tab .tab').addClass('hidden');
			$('#tab_year_' + $(this).data('year')).removeClass('hidden');
		},

		// 이벤트
		event: function() {
			// 명예의 전당 탭 클릭
			$(document).on('click', '.block-before-tab li a', page.func.clickBeforeTab);
			// 상세 열기
			$(document).on('click', '.btnOpenDetail', page.func.openModalDetail);
			// 신청폼 열기
			$(document).on('click', '.btnModalReg', page.func.openModalApplyInsForm);
			// 접수확인
			$(document).on('click', '.btnModalRegCheck', page.func.openModalApplyInsCheck);
			// 접수확인 조회
			$(document).on('click', '.btnModalRegChecking', page.func.openModalApplyInsChecking);

			// 수정폼 열기
			$(document).on('click', '.btnModalUpt', page.func.openModalApplyUptForm);
			// 저장
			$(document).on('click', '#btnModalSave1', page.call.saveApplyForm);
			// 신청폼 1번쩨
			$(document).on('click', '.btnGoStep1', page.func.goStep1);
			// 신청폼 2번쩨
			$(document).on('click', '.btnGoStep2', page.func.goStep2);

			// 로그인
			$(document).on('click', '.btnLogin', page.func.loginClick);

			// 응모하기 이동
			$(document).on('click', '.btnGoApply', function() {
				$('#btn_go_section_guide').trigger('click');
			});

			// 신청폼 열리면
			$('#modal_apply_form').on('show.bs.modal', function() {
				// 폼 초기화
				page.func.initForm();
			});

			// 상세 열리면
			$('#modal_detail').on('show.bs.modal', function() {
			});

			/*******************************************************************
			 * From 처리
			 ******************************************************************/

			// ===============================
			// 01. 핸드폰번호 연동
			// ===============================
			// 핸드폰번호를 클릭하면
			$(document).on('click', '#UserHP', function() {
				$('#pop_hp_authentication').data('from', 'UserHP');
				$('#pop_hp_authentication').modal('show');
			});

			// Form HP 변경
			$('#HPA').keyup(function(key) {
				var hp = $(this).val().trim();
				$(this).val($text.autoHypenPhone(hp));
			});
			$('input[name=userMobile]').keyup(function(key) {
				var hp = $(this).val().trim();
				$(this).val($text.autoHypenPhone(hp));
			});

			// 휴대폰번호 인증 닫기(취소)
			$('.btnHPACancel').click(function() {
				$('#pop_hp_authentication').modal('hide');
			});

			// 인증번호 요청 모달이 열리면
			$('#pop_hp_authentication').on('show.bs.modal', function(e) {
				$('#btn_AuthCall').attr('disable', false);
				$('#btn_AuthConfirm').attr('disable', true);
				$('#HPA').val('');
				$('#HPACODE').val('');
				$('#HPA').attr('readonly', false);
				$('#HPACODE').attr('readonly', true);
			});

			// 인증번호 요청
			$('#btn_AuthCall').on('click', function(event) {
				let secMobile = $('#HPA').val();
				$.ajax({
					url : "/User/getPhoneCertNum_Json.mrn",
					type : "post",
					cache : false,
					dataType : "json",
					data : {"secMobile":secMobile},
					success:function(jsonObj){
						if (jsonObj.result == 'OK') {
							$('#HPA').attr('readonly', true);
							$('#HPACODE').attr('readonly', false);
							$('#btn_AuthCall').attr('disable', true);
							$('#btn_AuthConfirm').attr('disable', false);
							$.alert('인증번호를 발송했습니다.', '알림');
						} else {
							$.alert('오류가 발생하였습니다.<br/>관리자에게 문의해주시기 바랍니다.', '알림');
							$('#btn_AuthCall').attr('disable', false);
							$('#btn_AuthConfirm').attr('disable', true);
							$('#HPA').attr('readonly', false);
							$('#HPACODE').attr('readonly', true);
						}
					},
					error:function(json){
						$.alert("실패하였습니다.");
					},
				});
				event.preventDefault();
			});

			// 인증번호 확인
			$('#btn_AuthConfirm').on('click', function(event) {
				if($('#HPACODE').val() == '') {
					$.alert("인증번호를 입력해주세요.", "알림");
					$('#HPACODE').focus();
					return;
				}
				var smsCertNum = $("#HPACODE").val();

				$.ajax({
					url : "/User/checkPhoneCertNum_Json.mrn",
					type : "post",
					cache : false,
					dataType : "json",
					data : {"smsCertNum":smsCertNum},
					success:function(jsonObj){
						if (jsonObj.result == 'OK') {
							// 모달 닫고, 앞에 전화번호 수정
							$('#pop_hp_authentication').modal('hide');
							var tID = $('#pop_hp_authentication').data('from');
							$('#' + tID).val($('#HPA').val());
						} else {
							$.alert('인증번호가 잘못되었습니다.\n\n다시 입력해 주세요!', '알림');
							return;
						}
					},
					error:function(json){
						$.alert("실패하였습니다.");
					}
				});
				event.preventDefault();
			});

			// ===============================
			// 02. 학교 변경
			// ===============================

			// 학교명 input에 클릭하면 조회 모달 열리게
			$(document).on('click', '#SchoolNm', function() {
				$('#modal_search_school').data('form', $(this).attr('id'));
				$("#modal_search_school").modal('show');
			});

			// 학교명 인풋에 엔터시
			$('#schoolTxt').keydown(function(key) {
				if (key.keyCode == 13) {
					$('#btnSearchSchool').trigger('click');
				}
			});

			// 학교 검색
			$(document).on('click', '#btnSearchSchool', function() {
				if ($('#schoolTxt').val() == '') {
					$.alert('학교명을 넣어주세요.', '알림');
					return;
				} else {
					$.post("/School/SchoolListAll_Json.mrn", {
						searchWord: $('#searchWord').val()
					}).done(function(res) {
						let data = JSON.parse(res);
						console.log(data);
						var html = '<dd>';
						if (data.resultList.length > 0) {
							$.each(data.resultList, function(index, item) {
								html = html + '<a href="javascript:void(0);" class="btnGetSchool" data-scnm="' + item.scNmKr + '" data-scidx="' + item.scIdx + '" data-city="' + item.siNm + '" data-addr="' + item.scAddress1 + '">';
								html = html + '<ul>';
								html = html + '<li>' + item.scNmKr + '<br />' + item.scAddress1 + '</li>';
								html = html + '<li>' + item.siNm + '</li>';
								html = html + '<li>' + item.scGradeNm + '</li>';
								html = html + '</ul>';
								html = html + '</a>';
							});
							html = html + '</dd>';
						} else {
							html = '<dd class="none">검색 결과가 없습니다.</dd>';
						}
						$('.search_sh dd').remove();
						$('.search_sh').append(html);
					});
				}
			});

			// 학교 검색결과 클릭시
			$(document).on('click', '.btnGetSchool', function() {
				var school = $(this).data('scnm'); //+ ' (' + $(this).data('addr') + ')';
				$('#SchoolNm').val(school);
				$('#TeacherSchool1').val(school);
				$('#SchoolIdx').val($(this).data('scidx'));
				$('#modal_search_school').modal('hide');
			});

			// ===============================
			// 03. 동의서 체크
			// ===============================

			// 동의서 체크 클릭(모달 열림)
			$('#agreed_check_userinfo').click(function() {
				// 체크 되어 있지 않으면 모달 나오게
				if ($(this).is(":checked")) {
					$(this).prop("checked", false);
					$('#pop_agree').data('ck_id', $(this).attr('id'));
					$('#pop_agree').modal('show');
				}
			});

			// 약관동의 모달이 열리면
			$('#pop_agree').on('show.bs.modal', function(e) {
				$('#pop_agree #allCheck').prop('checked', false);
				$('#pop_agree #lblTotAgree1').prop('checked', false);
				$('#pop_agree #lblTotAgree2').prop('checked', false);
				$('#pop_agree #lblTotAgree3').prop('checked', false);
				$('#pop_agree #lblTotAgree4').prop('checked', false);
				$('#pop_agree #lblTotAgree5').prop('checked', false);
				$('#pop_agree #lblTotAgree6').prop('checked', false);
				$('#pop_agree #lblTotAgree7').prop('checked', false);
				$('#pop_agree #lblTotAgree8').prop('checked', false);
			});

			// 약관 전체 동의
			$('#allCheck').click(function() {
				var chk = $(this).is(':checked');
				if (chk)
					$('#pop_agree .form-check-input').prop('checked', true);
				else
					$('#pop_agree .form-check-input').prop('checked', false);
			});

			// 약관동의 닫기(확인)
			$('.btnAgreeOK').click(function() {
				let tf = true;
				$.each($('#pop_agree .popAgree_checkbox'), function() {
					if (tf) {
						// 숨김 아닌것만
						if (!$(this).hasClass('hidden')) {
							if (!$(this).is(':checked')) {
								$.alert('동의서 및 개인정보 수집 및 활용에 동의해주세요.', '알림');
								tf = false;
								return false;
							}
						}
					}
				});
				if (tf) {
					var ck_id = '#' + $('#pop_agree').data('ck_id');
					$(ck_id).prop('checked', true);
					$('#pop_agree').modal('hide');
				}
			});

			// 약관동의 닫기(취소)
			$('.btnAgreeCancel').click(function() {
				$('#pop_agree #allCheck').prop('checked', false);
				$('#pop_agree #lblTotAgree1').prop('checked', false);
				$('#pop_agree #lblTotAgree2').prop('checked', false);
				$('#pop_agree #lblTotAgree3').prop('checked', false);
				$('#pop_agree #lblTotAgree4').prop('checked', false);
				$('#pop_agree #lblTotAgree5').prop('checked', false);
				$('#pop_agree #lblTotAgree6').prop('checked', false);
				$('#pop_agree #lblTotAgree7').prop('checked', false);
				$('#pop_agree #lblTotAgree8').prop('checked', false);
				var ck_id = '#' + $('#pop_agree').data('ck_id');
				$(ck_id).prop('checked', false);
				$('#pop_agree').modal('hide');
			});

			// From 개인 / 팀 클릭시
			$(document).on('click', '.btnTeamYN', page.func.clickTeamYN);

			// From 분야 클릭시
			$(document).on('click', '.btnApplyType', page.func.clickApplyType);

			// ===============================
			// 04. 파일업로드
			// ===============================

			// 파일 추가
			$('#fileUploader1, #fileUploader2').on('change', function(e) {
				let files = e.target.files;
				let filesArr = Array.prototype.slice.call(files);
				let totalSize = 0;
				let maxSize = 1024 * 1024 * 50; // 50mb
				let errorTF = false;
				let id = '';
				id = $(this).attr('ID')

				// 파일 등록안하고 종료했을경우 아무행위도 안함.
				if (filesArr.length < 1) {
					errorTF = true;
				}

				// 파일 개수 체크
				if (filesArr.length > 1) {
					$.alert('파일 개수는 1개만 등록 가능합니다.');
					errorTF = true;
				}

				for (var i = 0; i < filesArr.length; i++) {
					// 파일 용량 체크
					if (filesArr[i].size > maxSize) {
						$.alert("파일 용량은 파일당 50MB를 넘을 수 없습니다.", '안내');
						errorTF = true;
					}
					// 파일확장자 체크
					if ($(this).attr('ID') === 'fileUploader1') {
						if (!(filesArr[i].name.toLowerCase().indexOf(".pdf") > -1)) {
							$.alert("파일 등록이 불가한 확장자입니다.", '안내');
							errorTF = true;
						}
					} else {
						let arrSplitFileName = filesArr[0].name.split('.')
						let extension = arrSplitFileName[arrSplitFileName.length - 1];
						if (!('zip, hwp, docx, doc, ppt, pptx, pdf, jpeg, jpg, png'.indexOf(extension) > -1)) {
							$.alert("파일 등록이 불가한 확장자입니다.", '안내');
							errorTF = true;
						}
					}
				}

				// 에러체크.
				if (errorTF === true) {
					$(this).data('fileName', '');
					$(this).data('filePath', '');
					$(this).val('');
					$('#lb' + id).text('선택된 파일이 없습니다.');
					page.v.filesTemp = null;
					return;
				}

				page.v.filesTemp = filesArr[0]
				let UUID = uuidv4();
				// 사용자에게 보여줄 파일 이름
				$(this).data('fileName', page.v.filesTemp.name);
				$('#lb' + id).text(page.v.filesTemp.name);
			});

			// 응모작 파일등록
			$(document).on('click', '#btnFileUpload1', function() {
				$('#fileUploader1').trigger('click')
			});
			// 응모작 파일삭제
			$(document).on('click', '#btnFileuDelete1', function() {
				$('#fileUploader1').data('fileName', '');
				$('#fileUploader1').data('filePath', '');
				$('#fileUploader1').val('');
				$('#lbfileUploader1').text('선택된 파일이 없습니다.');
				page.v.filesTemp = null;
			});
			// 기타파일 파일등록
			$(document).on('click', '#btnFileUpload2', function() {
				$('#fileUploader2').trigger('click')
			});
			// 기타파일 파일삭제
			$(document).on('click', '#btnFileuDelete2', function() {
				$('#fileUploader2').data('fileName', '');
				$('#fileUploader2').data('filePath', '');
				$('#fileUploader2').val('');
				$('#lbfileUploader2').text('선택된 파일이 없습니다.');
				page.v.filesTemp = null;
			});

			// ===============================
			// 05. 공유
			// ===============================
			// 모달 공유 클릭시
			$(document).on('click', '.btnShare', function() {
				var urlAddress = $('#urlAddressModal');
				var url = $(location).attr('href');
				if (url.indexOf('?') > -1) {
					url = url.substring(0, url.indexOf('?'));
				}
				url = url.replace('#', '') + '?uuid=' + $(this).data('shareuuid');
				urlAddress.val(url);
				urlAddress.css('display', 'block').select();
				document.execCommand("Copy");
				urlAddress.css('display', 'none');
				$.alert('공유 링크가 복사되었습니다. 동료 선생님들께 응원을 부탁하세요!', '알림');
				return false;
			});

			// 목록 공유 클릭시
			$(document).on('click', '.btnListShare', function() {
				var urlAddress = $('#urlAddress');
				var url = $(location).attr('href');
				if (url.indexOf('?') > -1) {
					url = url.substring(0, url.indexOf('?'));
				}
				url = url.replace('#', '') + '?uuid=' + $(this).data('shareuuid');
				urlAddress.val(url);
				urlAddress.css('display', 'block').select();
				document.execCommand("Copy");
				urlAddress.css('display', 'none');
				$.alert('공유 링크가 복사되었습니다. 동료 선생님들께 응원을 부탁하세요!', '알림');
				return false;
			});


			// 페이지 클릭시
			$('.block-page .page-link.no').click(function() {
				$('.block-page .page-item').removeClass('active');
				$(this).parent().addClass('active');

				page.v.cpage = $(this).text();
				page.call.getCommentList($(this).text());
				$("html, body").animate({
					scrollTop: $('#formComment').offset().top - 100
				}, 500);
			});

			// 다음, 이전 페이지 블럭 클릭시
			$('.block-page .page-link.next, .block-page .page-link.prev').click(function() {
				page.call.getCommentList($(this).data('page'));
			});

			// 수상작 다운로드 클릭
			$(".btnDownloadAward").on('click', function(){
				// 선생님_정회원이 아니면 실행 안함
				if (!page.func.loginClick()) return;
				let downPath = "https://download.mirae-n.com"+$(this).data("url");
				$("#downHelpBtn").attr("href", downPath);
				$("#downHelpBtn")[0].click();
			});

			// 수상작 미리보기 클릭
			$(".btnPdfViewOpen").on('click', function(){
				// 선생님_정회원이 아니면 실행 안함
				if (!page.func.loginClick()) return;
				let viewPath = "https://ebook.mirae-n.com/"+$(this).data("name");
				$("#viewHelpBtn").attr("href", viewPath);
				$("#viewHelpBtn")[0].click();
			})

			// ===============================
			// 07. 수상자 검색
			// ===============================
			// 다음, 이전 페이지 블럭 클릭시
			$('.search-header .btn-search').click(function() {
				let search = $('.search-header #search2').val();
				let cnt = 0;
				let top = null;
				if (search.length == 0) {
					$.alert('검색에 수상자를 넣어주세요.<br>전체 이름을 넣어주세요', '안내');
					return;
				}

				$('#section-announcement .tbl_type tbody tr td span').removeClass('active');
				$.each($('#section-announcement .tbl_type tbody tr td span'), function(i, val) {
					if ($(val).text() == search) {
						cnt++;
						$(val).addClass('active');
						top = $(val).offset().top;
						return false;
					}
				});

				// 검색된 자료가 없으면
				if (cnt == 0) {
					$.alert('검색 하신 이름은 수상자 명단에 없습니다.', '안내');
					return;
				}

				// 위치로 이동
				if (top > 300) {
					$('html').animate({ scrollTop: top - 300 }, 400);
					return;
				}
			});

			$('.search-header #search2').keydown(function(key) {
				if (key.keyCode == 13) {
					$('.search-header .btn-search').trigger('click');
				}
			});
		},
		initForm: function() {
			valid1.resetForm()
			valid2.resetForm()
			$('#UserName').val(username);
			$('#ApplyTeacher1').val(username);
			$('#UserHP').val(usermobile);
			$('#UserEmail').val(useremail);
			$("#OpenY").prop("checked", true).change();
			$($('.btnTeamYN')[0]).trigger('click');
			$($('.btnApplyType')[0]).trigger('click');
			$($('.btnGoStep1')).trigger('click');
			$($('.btnImageDel')).trigger('click');
			$('#fileUploader1, #fileUploader2').data('fileName', '');
			$('#fileUploader1, #fileUploader2').data('filePath', '');
			$('#fileUploader1, #fileUploader2').val('');
			$('#lbfileUploader1').text('선택된 파일이 없습니다.');
			$('#lbfileUploader2').text('선택된 파일이 없습니다.');
			page.v.filesTemp = null;
		},
	},
	// A3 B4 C10 D 12 E11 A1 F6

	// 페이지 초기화
	init: function() {
		page.v.$isLogin = $("#isLogin").val() === "true" ? true : false;
		page.v.$userGrade = $("#userGrade").val() || '';

		// let today = cjs.num.getTodayText();
		// 응모기간 확인
		let applySDate = $("body").data("applysdate");
		let applyFDate = $("body").data("applyfdate");
		// console.log(today, applySDate, applyFDate);
		page.v.isApplyDate = !(today < applySDate || today > applyFDate );

		page.func.event(); // 이벤트 초기화

		$('input:radio[name=OpenYN]:input[value="Y"]').attr("checked", true);
		$($('.btnTeamYN')[0]).trigger('click');

		let jsUserInfo = $("input[name=userInfo]").val() || '{}';
		let userInfo  = JSON.parse(jsUserInfo);
		console.log(userInfo);

		$('#UserName').val(username);
		$('#ApplyTeacher1').val(username);
		$('#UserHP').val(usermobile);
		$('#UserEmail').val(useremail);
		$('.btnDownload[href*=".pdf"]').attr('download', '');

		$(document).on('click', '.block-btn a.btn', function(event) {
			let url = $(this).data('url');
			// 링크가 없으면
			if (url == '') {
				$msg.alert('안내', '준비중입니다.');
				return;
			} else {
				window.open('https://download.mirae-n.com' + url); // http://textbook-miraen.cdn.x-cdn.com
			}
		});
	},
};

$(function() {
	// page.init(); // 응모 기간에만

	// 명예의 전당 탭 클릭
	$(document).on('click', '.block-before-tab li a', page.func.clickBeforeTab);

	// 로그인
	$(document).on('click', '.btnLogin', function(){
		$alert.open("MG00011", () => {});
	});

	// 회원가입
	$(document).on('click', '.btnJoin', function() {
		location.href = '/pages/common/User/Join.mrn?redirectURI=' + encodeURIComponent(location.href);
	});

	// 마이페이지
	$(document).on('click', '.btnMypage', function() {
		window.open('/pages/common/mypage/myinfo.mrn','_blank');
	});

	// footer 패밀리 사이트
	$(document).on('click', '.family_tit', function() {
		family_site();
	});
});

function family_site() { // 패밀리 사이트
	if (!$('.family_tit').hasClass('on')) {
		$(this).addClass('on');
		$('.family_list').fadeIn();
		$('.family_list .family_close').click(function(e) {
			e.preventDefault();
			$('.family_tit').removeClass('on');
			$('.family_list').fadeOut();
		});
	} else {
		$(this).removeClass('on');
		$('.family_list').fadeOut();
	}
}