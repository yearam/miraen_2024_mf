
let ui = {

	/**
	 * 내부 전역변수
	 *
	 * @memberOf screen
	 */
	val: {
	},

	// 시간으로 로그아웃 처리
	sessionTimeout: function() {
		$.sessionTimeout({
			title: '세션 시간 초과 알림',
			message: '장시간 사용안해 로그아웃 합니다.',
			keepAliveUrl: contextPath + '/login_keep',
			redirUrl: contextPath + '/logout.do?p=' + encodeURIComponent($(location).attr('href')),
			logoutUrl: contextPath + '/logout',
			warnAfter: 1000 * 60 * 120, 			// 120분
			redirAfter: 1000 * 60 * 120 + 30000, // 30초 후에 로그아웃,
			ignoreUserActivity: true,
			countdownMessage: '남은시간 {timer}.',
			countdownBar: true
		});
	},

	// 달력
	datePicker: {

		/**
		 * $datePicker.date
		 * 날짜(단일)
		 *
		 * @param {String} el			업로드 el 	'#el'
		 * @param {String} d			날짜value	'2021-01-01'
		 * @param {Bool} autoUpdate 	자동완성	true, false
		 * @param {Function} callback 	콜백 함수	function
		 */
		date: (el, d, autoUpdate, callback) => {

			$(el).val(d).attr('maxlength', 10);

			// 클릭시 자동완성
			$(el).keyup(function(key) {
				let str = $(el).val().trim();
				$(el).val($text.autoDate(str));
				if ($(el).val().length > 7) {
					var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
					if (!regex.test($(el).val())) {
						$(el).val($date.getToday());
						$msg.toastr(lng.date.InvalelDateFormat, 'warning');
					}
				}
			});

			// 자동업데이트 기본 true
			autoUpdate = (autoUpdate == false) ? false : true;
			$(el).val(d);
			$(el).datepicker({
				autoclose: autoUpdate,
				language: lng.system,
				orientation: 'auto',
				format: "yyyy-mm-dd",
			}).on('changeDate', function(e) {
				if (callback != undefined) {
					return callback(moment(e.date).format('YYYY-MM-DD'));
				}
			});

		},

		/**
		 * $datePicker.setDate
		 * 날짜 값 넣기
		 *
		 * @param {String} el			업로드 el 	'#el'
		 * @param {String} d			날짜value		'2021-01-01'
		 */
		setDate: (el, d) => {
			$(el).datepicker('update', d);
		},

		/**
		 * $datePicker.setDates
		 * 기간 날짜 값 넣기
		 * $datePicker.setDates('#Date2_2', $date.getToday(), $date.getMonthEnd());
		 * @param {String} el			업로드 el 	'#el'
		 * @param {String} d			날짜value		'2021-01-01'
		 */
		setDates: (el, sDate, eDate) => {
			$(el).val(sDate + ' - ' + eDate);
			$(el).data('daterangepicker').setStartDate(sDate);
			$(el).data('daterangepicker').setEndDate(eDate);
		},

		/**
		 * 날짜 한개
		 * $datePicker.dates
		 *
		 * @param {String} el			업로드 el 	'#el'
		 * @param {String} sdate		날짜 value	'2021-01-01'
		 */
		singleDate: function(el, sdate) {
            ($date.isDate(sdate)) ? $(el).val(sdate) : $(el).val('');
			$(el).daterangepicker({
				singleDatePicker: true
				, autoApply: true
				, locale: lng.date.dateLocale
			} );
            ($date.isDate(sdate)) ? $(el).val(sdate) : $(el).val('');
		},

		/**
		 * 날짜(기간)
		 * $datePicker.dates
		 *
		 * @param {String} el			업로드 el 	'#el'
		 * @param {String} sdate		시작일 value	'2021-01-01'
		 * @param {String} edate		종료일 value	'2021-01-01'
		 */
		dates: function(el, sdate, edate) {

			if (sdate == '' || edate == '') {

				// 빈값이면
				$(el).val('');
				sdate = sdate == '' ? moment().subtract(29, 'days') : sdate;
				edate = edate == '' ? moment() : edate;
			} else {

				// 두개 날짜가 다 날짜 형식이면 값 넣고 아니면 ''
				($date.isDate(sdate) || $date.isDate(edate)) ? $(el).val(sdate + ' - ' + edate) : $(el).val('');
			}

			$(el).daterangepicker({
				autoUpdateInput: false
				, showDropdowns: true
				, alwaysShowCalendars: true
				, showCustomRangeLabel: false
				, startDate: sdate
				, endDate: edate
				, linkedCalendars: false
				, locale: lng.date.dateLocale
				, ranges: {
					'오늘': [moment(), moment()],
					'어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'최근한달': [moment().subtract(29, 'days'), moment()],
					'금월': [moment().startOf('month'), moment().endOf('month')],
					'전월': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
					'당해': [moment().startOf('year'), moment().endOf('year')],
				}
			}, function(start, end, label) {
				$(el).data('daterangepicker').setStartDate(start.format('YYYY-MM-DD'));
				$(el).data('daterangepicker').setEndDate(end.format('YYYY-MM-DD'));
			});

			// 확인
			$(el).on('apply.daterangepicker', function(ev, picker) {
				$(el).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD')).trigger('change');
				$(el).data('daterangepicker').setStartDate(picker.startDate.format('YYYY-MM-DD'));
				$(el).data('daterangepicker').setEndDate(picker.endDate.format('YYYY-MM-DD'));
			});

			// 취소
			$(el).on('cancel.daterangepicker', function(ev, picker) {
				$(this).val('').trigger('change');
			});

		},

		/**
		 * 날짜 시간 (기간)
		 * $datePicker.dates
		 *
		 * @param {String} el			업로드 el 	'#el'
		 * @param {String} sdate		시작일 value	'2021-01-01'
		 * @param {String} edate		종료일 value	'2021-01-01'
		 */
		datetimes: function(el, sdate, edate) {
			sdate = sdate == '' ? moment() : sdate;
			edate = edate == '' ? moment() : edate;

			//moment타입으로 치환
			sdate = moment(sdate)
			edate = moment(edate)

			$(el).daterangepicker({
				startDate: sdate
				, endDate: edate
				, timePicker24Hour: true
				, showDropdowns: true
				, alwaysShowCalendars: true
				, showCustomRangeLabel: false
				, timePicker: true
				, linkedCalendars: false
				, locale: lng.date.datetimeLocale
				, ranges: {
					'오늘': [moment(), moment()],
					'어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'최근한달': [moment().subtract(29, 'days'), moment()],
					'금월': [moment().startOf('month'), moment().endOf('month')],
					'전월': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
					'당해': [moment().startOf('year'), moment().endOf('year')],
				}
			});
		},

		/**
		 * $datePicker.month
		 * 월력
		 *
		 * @param {String} el			업로드 el 		'#el'
		 * @param {String} d			날짜value		'2021-01'
		 * @param {String} callback		콜백 함수
		 */
		month: function(el, d, callback) {

			$(el).val(d).attr('maxlength', 7);

			// 클릭시 자동완성
			$(el).keyup(function(key) {
				let str = $(el).val().trim();
				$(el).val($text.autoMonth(str));
				if ($(el).val().length > 5) {
					var regex = RegExp(/^\d{4}-(0[1-9]|1[012])$/);
					if (!regex.test($(el).val())) {
						$(el).val(moment().format('YYYY-MM'));
						$msg.toastr(lng.date.InvalelDateFormat, 'warning');
					}
				}
			});

			$(el).val(d);
			$(el).datepicker({
				startView: 1,
				minViewMode: 1,
				maxViewMode: 2,
				autoclose: true,
				language: lng.system,
				format: "yyyy-mm",
			}).on('changeDate', function(e) {
				if (callback != undefined) {
					return callback(moment(e.date).format('YYYY-MM'));
				}
			});
		},

		/**
		 * $datePicker.month
		 * 년력
		 *
		 * @param {String} el			업로드 el 		'#el'
		 * @param {String} d			날짜value		'2021-01'
		 * @param {String} callback		콜백 함수
		 */
		year: function(el, d, callback) {
			$(el).val(d);
			$(el).datepicker({
				startView: 2,
				minViewMode: 2,
				maxViewMode: 2,
				autoclose: true,
				language: lng.system,
				format: "yyyy",
			}).on('changeDate', function(e) {
				if (callback != undefined) {
					return callback(moment(e.date).format('YYYY'));
				}
			});
		},

		singleDateH: function(el, d, val, val2) {
			$(el).daterangepicker({
				singleDatePicker: true,
				timePicker: true,
				timePicker24Hour: true,
				timePickerSeconds: false,
				locale: {
					format: "YYYY-MM-DD HH:mm",
				},
				startDate: d,
				autoUpdateInput: false
			}, function(start, end, label) {
				const startTime = start.format('HH:mm');
				const endTime = '21:00';
				const startTimeValid = startTime >= '08:00' && startTime <= endTime;

				    // if (val === 'AD' && !startTimeValid && val2 === 'sendlater') {
				    //   // 광고용이 선택된 경우 21시 이후와 08시 이전에는 예약할 수 없습니다.
				    //   $(el).val('').trigger('cancel.daterangepicker');
				    //   alert('광고용이 선택된 경우 21시 이후와 08시 이전에는 예약할 수 없습니다.');
				    // } else if(val === 'sendlater' && !startTimeValid && val2 === 'AD'){
					// 	$(el).val('').trigger('cancel.daterangepicker');
					// 	alert('광고용이 선택된 경우 21시 이후와 08시 이전에는 예약할 수 없습니다.');
					// }else {
				    //   // 모든 시간에 대해 예약 가능하도록 처리합니다.
				    //   $(el).val(start.format('YYYY-MM-DD HH:mm')).trigger('change');
				    // }
			});

			// 확인
			$(el).on('apply.daterangepicker', function(ev, picker) {
				const startTime = picker.startDate.format('HH:mm');
				const endTime = '21:00';
				const startTimeValid = startTime >= '08:00' && startTime <= endTime;

				if (val === 'AD' && !startTimeValid && val2 === 'sendlater') {
					// 광고용이 선택된 경우 21시 이후와 08시 이전에는 예약할 수 없습니다.
					$(el).val('').trigger('cancel.daterangepicker');
					alert('광고용이 선택된 경우 21시 이후와 08시 이전에는 예약할 수 없습니다.');
				} else if(val === 'sendlater' && !startTimeValid && val2 === 'AD'){
					$(el).val('').trigger('cancel.daterangepicker');
					alert('광고용이 선택된 경우 21시 이후와 08시 이전에는 예약할 수 없습니다.');
				}else {
					// 모든 시간에 대해 예약 가능하도록 처리합니다.
					$(el).val(picker.startDate.format('YYYY-MM-DD HH:mm')).trigger('change');
				}
			});

			// 취소
			$(el).on('cancel.daterangepicker', function(ev, picker) {
				$(this).val('').trigger('change');
			});
		},


	},

	// 콤보
	combo: {
		/**
		 * 콤보 바인드
		 * $combo.bind
		 *
		 * @param {object} data			콤보 데이타
		 * @param {String} el			아이디 : '#id' , '.class', '[data-bind:asdasd]
		 * @param {String} addRowText	추가 생성(전체, 선택)
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} searchTF		select2 상단 검색 유무(true, false)
			 * @param {String} modalID		모달아이디
		 */
		bind: function(data, el, addRowText, val, nmColumn, valColumn, searchTF) {

			addRowText = addRowText == undefined ? '' : addRowText;
			val = val == undefined ? null : val.toString();
			nmColumn = nmColumn == undefined ? '' : nmColumn;
			valColumn = valColumn == undefined ? '' : valColumn;
			searchTF = searchTF == undefined ? '' : searchTF;

			let modalID = $($(el).parents('.modal')[0]).attr('el');
			modalID = modalID == undefined ? '' : '#' + modalID;

			// 기존 데이타 삭제
			$combo.optionRemove(el);

			// 콤보 값 CSeq, Nm, Val, Txt1, Txt2, Num1, Num2
			if (nmColumn == '') nmColumn = 'name';//'comCdNm';
			if (valColumn == '') valColumn = 'commonCode';//'comCd';

			// 1행에 추가할 내용, 전체, 선택하세요 (multiple select일경우 생성하지 않음.)

			/*if (!$(el)[0].multiple) {

			}*/
			if (addRowText.length > 0) {
				$(el).append('<option value="">' + addRowText + '</option>');
			}

			// 데이타 바인드
			$(el).data('data', data);
			$(el).data('valcolumn', valColumn);

			// 콤보에 값 넣기
			let $option;
			$.each(data, function(elx, item) {
				$option = $(document.createElement('option'));

				$option.data(item);
				$option.val($text.isEmpty(item[valColumn]) ? '' : item[valColumn]);
				$option.text(item[nmColumn]);
				$(el).append($option);
			});
			if (val != '') {
				$(el).val(val);
			} else {
				if (addRowText == '') {
					$(el).find('option').eq(0).prop('select', true);
				}
			}
			// 값 넣기
			// if (searchTF) {
			// 	(modalID == '') ? $(el).select2({}).maximizeSelect2Height() : $(el).select2({ dropdownParent: $(modalID) }).maximizeSelect2Height();
			// } else {
			// 	(modalID == '') ? $(el).select2({ minimumResultsForSearch: Infinity }).maximizeSelect2Height() : $(el).select2({ minimumResultsForSearch: Infinity, dropdownParent: $(modalID) }).maximizeSelect2Height();
			// }

			return { done: true, name: $(el).find('option:selected').text(), val: $(el).val() };
		},


		/**
		 * 콤보 공통코드 생성
		 * $combo.common
		 *
		 * @param {String} el			아이디('#el')
		 * @param {String} masterCode	코드 마스터 코드
		 * @param {String} addRowText	추가 생성(전체, 선택)
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} searchTF		select2 상단 검색 유무(true, false)
			 * @param {String} callback		콜백 함수
		 */
		common: function(el, masterCode, addRowText, val, nmColumn, valColumn, searchTF, callback) {

			$cmm.getCmmCd(masterCode).then((values) => {
				// result 값
				let rows = eval('values.' + masterCode);
				if (!$text.isEmpty(rows) && rows.length > 0) {
					if (callback == undefined) {
						$combo.bind(rows, el, addRowText, val, nmColumn, valColumn, searchTF);
					} else {
						return callback($combo.bind(rows, el, addRowText, val, nmColumn, valColumn, searchTF));
					}
				} else {
					$msg.alert(lng.date.noResults);
				}
			});
		},

		// 콤보 내용 삭제
		optionRemove: function(el, addRowText, val) {

			// 콤보 내용 삭제
			$(el).find('option').remove();

			// 추가할 항목 있으면 추가
			if (!$text.isEmpty(addRowText)) {

				val = $text.isEmpty(val) ? '' : val;
				$(el).append('<option value="' + val + '">' + addRowText + '</option>');
			}
		},

		/**
		 * 콤보에서 선택된 option의 값을 가져온다.
		 * $combo.common
		 *
		 * @param {String} el
		 */
		getSelectedOptionVal: function(el) {
			let data = el.data('data');						// 전체 data
			let valColumn = el.data('valcolumn');			// value 컴럼
			let selected = el.find(':selected');
			let result = null;

			// value 가 없으면 return null
			if ($text.isEmpty(selected.val())) {
				return result;
			}

			if (el[0].multiple) {
				// 멀티 select 이면
				$.each(selected, function(key, val) {

					/*let tempVal = val.dataset.val
					result.push(JSON.parse(tempVal));*/
				})
			} else {
				// single select 이면
				$.each(data, function(elx, row) {
					if (eval('row.' + valColumn) == selected.val()) result = row;
				})
			}
			return result;
		},

		/**TOBE사용
		 * 콤보박스에 공통코드 바인딩 세팅을 위한 함수
		 * cdList : 필수
		 * asyncYn : 선택 (디폴트 false)
		 * callback : 선택
		 */
		setCmmCd: function(cdList, asyncYn, callback) {

			if(_.isEmpty(cdList)) return;
			$cmm.getCmmCd(cdList, asyncYn).then((res) => {
				if (!_.isEmpty(res.row)) {
					for(const key in res.row) {		
						let defaultText = $(`select[name=combo-${key}]`).attr("data-default-text");
                        $combo.bind(res.row[key], `select[name=combo-${key}]`, !defaultText ? '' : defaultText, '', 'name', 'commonCode', 0);
					}

					if(!_.isNil(callback) && typeof callback === 'function') callback(res.row);
				}
				
			});
		},

	},


	// Radio
	radio: {
		/**
		 * radio 바인드
		 * $radio.bind
		 *
		 * @param {object} data			콤보 데이타
		 * @param {String} el			class(.radio_ + name) .radio_textbookCurriculumCd
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
			 * @param {String} modalID		모달아이디
		 */
		// bind: function(data, el, name, val, nmColumn, valColumn, id) {
		// 	val = val == undefined ? null : val.toString();
		// 	nmColumn = nmColumn == undefined ? '' : nmColumn;
		// 	valColumn = valColumn == undefined ? '' : valColumn;

		// 	let modalID = $($(el).parents('.modal')[0]).attr('el');
		// 	modalID = modalID == undefined ? '' : '#' + modalID;

		// 	// 기존 데이타 삭제
		// 	// $combo.optionRemove(el);

		// 	// 콤보 값 CSeq, Nm, Val, Txt1, Txt2, Num1, Num2
		// 	if (nmColumn == '') nmColumn = 'comCdNm';
		// 	if (valColumn == '') valColumn = 'comCd';

			
		// 	$.each(id, function(elx, idx) {
				
		// 		// 데이타 바인드
		// 		$(el).data('data', data);
		// 		$(el).data('valcolumn', valColumn);
		// 		$.each(data, function(elx, item) {
		// 			alert(JSON.stringify(data));
		// 			$(`${el},#radio-${idx}`).append(`<label class="form-check form-check-custom form-check-solid me-6">
		// 									<input class="form-check-input h-20px w-20px" type="radio" name="${name}-${idx}" data-bind="${name}" value="${item[valColumn]}" />
		// 									<span class="form-check-label fw-bold">${item[nmColumn]}</span>
		// 								</label>`);
		// 		});
				
		// 	});



		// 	return { done: true, name: $(el + ' option:selected').text(), val: $(el).val() };
		// },
		bind: function(data, el, name, val, nmCol, valCol, id) {
			if (nmCol == '') nmCol = 'name';
			if (valCol == '') valCol = 'commonCode';
			$.each(id, function(index, idVal) {
				let bind = $(`#radio-${idVal}`).data("bindRadio");
				$.each(data, function(idx, item) {
					if($(`#radio-${idVal}`).length > 0) {
						$(`#radio-${idVal}`).append(`
						<label class="form-check form-check-custom form-check-solid me-6">
							<input class="form-check-input h-20px w-20px" type="radio" name="${idVal}" ${_.isNil(bind)?'':'data-bind='+ '\"' + bind + '\"'} value="${item[valCol]}" />
							<span class="form-check-label fw-bold">${item[nmCol]}</span>
						</label>`);
					}
					
				});
				
				// 값 선택
				if ($text.isEmpty(val[index])) {
					$(`#radio-${idVal}` + ' input:first').prop("checked", true);
				} else {
					$(`#radio-${idVal}` + ' input[value="' + val[index] + '"]').prop("checked", true);
				}				
			});
		},


		/**
		 * 콤보 공통코드 생성
		 * $combo.common
		 *
		 * @param {String} el			아이디('#el')
		 * @param {String} masterCode	코드 마스터 코드
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} callback		콜백 함수
		 */
		common: function(el, masterCode, val, nmColumn, valColumn, callback) {

			$cmm.getCmmCd(masterCode).then((values) => {

				// result 값
				let rows = eval('values.' + masterCode);
				if (!$text.isEmpty(rows) && rows.length > 0) {
					if (callback == undefined) {
						$radio.bind(rows, el, val, nmColumn, valColumn);
					} else {
						return callback($radio.bind(rows, el, val, nmColumn, valColumn));
					}
				} else {
					$msg.alert(lng.date.noResults);
				}
			});
		},

		/**
		 * 라디오버튼에 공통코드 바인딩 세팅을 위한 함수
		 * cdList : 필수
		 * id : 필수
		 * callback : 선택 (해당 라디오버튼에 대한 이벤트는 콜백함수에서 처리해야함)
		 * ex)
		 * <div class="d-flex radio-C0020" id="radio-useYn" data-default-text="N"></div>
		 * <div class="d-flex radio-C0020" id="radio-postYn" data-default-text="N"></div>
		 * $radio.setCmmCd(['C0020'],{C0020:['useYn','postYn']},callbackFn);
		 */
		setCmmCd: function(cdList, id, callback) {
		
			if(_.isEmpty(cdList)) return;
			
			$cmm.getCmmCd(cdList).then((res) => {
				if (!_.isEmpty(res.row)) {
						
					for(const key in res.row) {		
						
						let defaultText = [];
						for(let i=0; i<id[key].length; i++) {
							//엘리먼트 초기화
							$(`#radio-${id[key][i]}`).empty();
							//data-default-text값 저장
							let dt = $(`#radio-${id[key][i]}`).data("defaultText");
							defaultText.push(dt);
						}
						$radio.bind(res.row[key], `.radio-${key}`, key, defaultText, "name", "commonCode", id[key]);
					}
					if(!_.isNil(callback) && typeof callback === 'function') callback(res.row);
					
				}
			});
			
			// const options = {
			// 	url: '/combo/getCommonComboList.ax',
			// 	method: 'GET',
			// 	data: {
			// 		codeGroup: cdList.join(',')
			// 	},
			// 	async: _.isNil(asyncYn)?false:asyncYn,
			// 	success: (res) => {
			// 		console.log("공통코드데이터(라디오)>>", res);
			// 		if (!_.isEmpty(res.row)) {
						
			// 			for(const key in res.row) {		
			// 				$radio.bind(res.row[key], `.radio-${key}`, key, "", "name", "commonCode");	
							
			// 			};
						
			// 		}
			// 	}
			// };
			// $cmm.ajax(options);
			
		},
	},

	// checkbox
	checkbox: {
		/**
		 * checkbox 바인드
		 * $checkbox.bind
		 *
		 * @param {object} data			콤보 데이타
		 * @param {String} el			아이디('#el')
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
			 * @param {String} modalID		모달아이디
		 */
		/*bind: function(data, el, val, nmColumn, valColumn) {
			val = val == undefined ? null : val.toString();
			nmColumn = nmColumn == undefined ? '' : nmColumn;
			valColumn = valColumn == undefined ? '' : valColumn;

			let modalID = $($(el).parents('.modal')[0]).attr('el');
			modalID = modalID == undefined ? '' : '#' + modalID;

			// 기존 데이타 삭제
			// $combo.optionRemove(el);

			// 콤보 값 CSeq, Nm, Val, Txt1, Txt2, Num1, Num2
			if (nmColumn == '') nmColumn = 'comCdNm';
			if (valColumn == '') valColumn = 'comCd';

			// 데이타 바인드
			$(el).data('data', data);
			$(el).data('valcolumn', valColumn);
			$.each(data, function(elx, item) {
				$(el).append(`<input type="checkbox" class="btn-check" name="${el.replace('#', '')}" el="${el.replace('#', '') + '_' + elx}" value="${item[valColumn]}" autocomplete="off">
								<label class="btn mtype line-blue" for="${el.replace('#', '') + '_' + elx}">
									<i class="bi bi-check2"></i>${item[nmColumn]}
								</label>`);
			});

			// 값 선택
			if ($text.isEmpty(val)) {
				$(el + ' input:first').attr("checked", true);
			} else {
				$(el + ' input[value="' + val + '"]').attr("checked", true);
			}

			return { done: true, name: $(el + ' option:selected').text(), val: $(el).val() };
		},*/


		/**
		 * 콤보 공통코드 생성
		 * $combo.common
		 *
		 * @param {String} el			아이디('#el')
		 * @param {String} masterCode	코드 마스터 코드
		 * @param {String} val			value
		 * @param {String} nmColumn		이름 컬럼(DB에서 가져올 필드)
		 * @param {String} valColumn	값 컬럼(DB에서 가져올 필드)
		 * @param {String} callback		콜백 함수
		 */
		common: function(el, masterCode, val, nmColumn, valColumn, callback) {

			$cmm.getCmmCd(masterCode).then((values) => {

				// result 값
				let rows = eval('values.' + masterCode);
				if (!$text.isEmpty(rows) && rows.length > 0) {
					if (callback == undefined) {
						$radio.bind(rows, el, val, nmColumn, valColumn);
					} else {
						return callback($radio.bind(rows, el, val, nmColumn, valColumn));
					}
				} else {
					$msg.alert(lng.date.noResults);
				}
			});
		},

		/**
		 * 체크박스에 공통코드 바인딩 세팅을 위한 함수
		 * cdList : 필수
		 * id : 필수
		 * ex)
		 * <div class="d-flex checkbox-C0020" id="checkbox-useYn" data-default-text="N"></div>
		 * <div class="d-flex checkbox-C0020" id="checkbox-postYn" data-default-text="N"></div>
		 * $checkbox.setCmmCd(['C0020'],['useYn','postYn']);
		 */
		setCmmCd: function(cdList, id, callback) {

			if(_.isEmpty(cdList)) return;
			$cmm.getCmmCd(cdList).then((res) => {
				if (!_.isEmpty(res.row)) {

					for(const key in res.row) {
						let defaultText = [];
						for(let i=0; i<id[key].length; i++) {
							let dt = $(`#checkbox-${id[i]}`).data("defaultText");
							defaultText.push(dt);
						}
						$checkbox.bind(res.row[key], `.checkbox-${key}`, key, defaultText, "name", "commonCode", id[key]);
					}
					if(!_.isNil(callback) && typeof callback === 'function') callback(res.row);

				}
			});
		},

		bind: function(data, el, name, val, nmCol, valCol, id) {
			if (nmCol == '') nmCol = 'name';
			if (valCol == '') valCol = 'commonCode';
			$.each(id, function(index, idVal) {

				$.each(data, function(idx, item) {
					if($(`#checkbox-${idVal}`).length > 0) {
						$(`#checkbox-${idVal}`).append(`
                  <label class="form-check form-check-custom form-check-solid me-6">
                     <input class="form-check-input h-20px w-20px" type="checkbox" name="${idVal}" data-bind="${name}" value="${item[valCol]}" />
                     <span class="form-check-label fw-bold" style="white-space: nowrap; margin: 0 0 0 0.55rem;">${item[nmCol]}</span>
                  </label>`);
					}

				});

				// 값 선택
				if ($text.isEmpty(val[index])) {
					$(`#checkbox-${idVal}` + ' input:first').prop("checked", true);
				} else {
					$(`#checkbox-${idVal}` + ' input[value="' + val[index] + '"]').prop("checked", true);
				}
			});
		},
	},

  /**TOBE사용
   * 프론트 페이징 처리
   */
  paging: {
    /**
     * 조회 ajax통신 후, 페이징 처리
     * @param {*} total 
     * @param {*} now 
     * @param {*} NUM BaseVO에서 가져온다.
     * @param {*} SIZE BaseVO에서 가져온다.
     */
    bindTotalboardPaging: (resObj)=> {
			const TOTAL = resObj.totalCnt;
			const NOW		= resObj.pagingNow;
			const NUM		= resObj.pagingNum;
			const SIZE	= resObj.pagingSize;
			const START = resObj.pagingStart;
			const END		= resObj.pagingEnd;
			const FIRST = resObj.pagingFirst;
			const PREV	= resObj.pagingPrev;
			const NEXT	= resObj.pagingNext;
			const LAST	= resObj.pagingLast;

			const $first = `
			<button type="button" name="pagingNow" value="${FIRST}" class="icon-button icon-first">
				<svg>
					<title>첫페이지 아이콘</title>
					<use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-double-left"></use>
				</svg>
			</button>
			`;
			const $prev = `
			<button type="button" name="pagingNow" value="${PREV}" class="icon-button icon-prev">
				<svg>
					<title>이전 아이콘</title>
					<use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-left"></use>
				</svg>
			</button>
			`;

			const $next = `
			<button type="button" name="pagingNow" value="${NEXT}" class="icon-button icon-next">
				<svg>
					<title>다음 아이콘</title>
					<use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-right"></use>
				</svg>
			</button>
			`;
			const $last = `
			<button type="button" name="pagingNow" value="${LAST}" class="icon-button icon-last">
				<svg>
					<title>마지막페이지 아이콘</title>
					<use xlink:href="/assets/images/svg-sprite-arrow.svg#icon-chevron-double-right"></use>
				</svg>
			</button>
			`;

			const $parentEl = $('.pagination');
			$parentEl.empty();
			if(TOTAL > 0) {
				$parentEl.append($first);
				$parentEl.append($prev);
				for(let i=START; i<=END; i++) {
					$parentEl.append(`<button type="button" name="pagingNow" value="${i}" class="${i==NOW?'current':''}">${i+1}</button>`);
				}
				$parentEl.append($next);
				$parentEl.append($last);

				$('.icon-first').prop('disabled', NOW==0);
				$('.icon-prev').prop('disabled', NOW==0);
				$('.icon-next').prop('disabled', Math.ceil(TOTAL/NUM)-1==NOW);
				$('.icon-last').prop('disabled', Math.ceil(TOTAL/NUM)-1==NOW);
			}
		},
  },

	/**
	 * TOBE사용
	 * 공통 alert
	 */
	alert: {
		callback: ()=>{},
		/**
		 * 확인버튼 클릭시 alert hide하고 호출되는 함수
		 * @param {*} commonCode site_message 공통코드 (필수) ${cmmMsg.commonCode}
		 * @param {*} callback 콜백 (생략가능)
		 */
		open: function(commonCode, callback) {
			let cmmMsg = JSON.parse($('[name=cmmMsg]').val());
      		let findCmmMsg = cmmMsg.find((data)=> data.commonCode === commonCode);
			let pnType = 'positive';
			if(!!findCmmMsg) {
				pnType = findCmmMsg.rem1
				$(`#msgContent-${findCmmMsg.rem1}`).html(findCmmMsg.codeName);
			}else {
				if(!!arguments[2]) {
					pnType = arguments[2];
					$(`#msgContent-${pnType}`).html(commonCode);
				}
			}
      
			//show
			// $(`#alert-${findCmmMsg.rem1}`).addClass('display-show');
			openPopup({id: `alert-${pnType}`});
			if(findCmmMsg?.rem2 === 'info' || arguments[3] === 'info') {
				$('[name=btnCancle]').addClass('display-hide');
			}else {
				$('[name=btnCancle]').removeClass('display-hide');
			}
			$('body').addClass('active-overlay');

			if(commonCode === 'MG00001') $alert.callback = $alert.goLogin;
			else $alert.callback = callback;
		},
		alert: function(cmmMsg, rem1, rem2, callback) {
			let pnType = !rem1?'negative':rem1;
			let arguments = !rem2?'info':rem2;
			$(`#msgContent-${pnType}`).html(cmmMsg);

			//show
			// $(`#alert-${findCmmMsg.rem1}`).addClass('display-show');
			openPopup({id: `alert-${pnType}`});
			if(arguments === 'info') {
				$('[name=btnCancle]').addClass('display-hide');
			}else {
				$('[name=btnCancle]').removeClass('display-hide');
			}
			$('body').addClass('active-overlay');

			$alert.callback = callback;
		},
		close: (e, type)=> {
			//hide
			//$(`[id^=alert-]`).removeClass('display-show');
			let alertId = $(e.currentTarget).parents('.popup-alert').attr('id');
			closePopup({id: alertId});
			$('body').removeClass('active-overlay');
			if(type) {
				if(!_.isNil($alert.callback) && typeof $alert.callback === 'function') $alert.callback();
			}
		},
		goLogin: () => {
      document.cookie = "loginUrl=" + $('#gHostCommon').val() + "/pages/common/User/Login.mrn?redirectURI=" + $('#gReturnURI').val();
			let url = '';
			let cookies = document.cookie.split(`; `).map((el) => el.split('='));
			for (let i = 0; i < cookies.length; i++) {
				if (cookies[i][0] === 'loginUrl') {
					url = cookies[i][1] + '=' + cookies[i][2];
					break;
				}
			}
			location.href = url;
		}
	},

	toast: {
		open: (selector, commonCode) => {
			const el = $(document).find(`[data-toast='${selector}']`);
			const delay = 2000; // ms

			const cmmMsg = JSON.parse($("[name=cmmMsg]").val());
			const findCmmMsg = cmmMsg.find((data)=> data.commonCode === commonCode);
			const content = findCmmMsg.codeName;

			el.webuiPopover("destroy");

			el.webuiPopover({
				multi: true,
				content,
				placement: "auto-top",
				trigger: "hover",
				style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
				delay: {
					show: null,
					hide: delay, // ms
				},
				container: $(el).is("[data-container]") ? $(`${$(el).attr("data-container")}`) : false,
				onShow: function () {
					if ($(el).is("[data-focus]")) {
						$(el).addClass('focus');
					}
				},
				// onHide: function () {
				// 	if ($(el).is("[data-focus]")) {
				// 		$(el).removeClass('focus');
				// 	}
				// },
			});

			WebuiPopovers.show(el);

			setTimeout(() => {
				// WebuiPopovers.hide(el);
				el.webuiPopover("destroy");
			}, delay);

		},

		openText: (selector, content) => {
			const el = $(document).find(`[data-toast='${selector}']`);

			el.webuiPopover("destroy");

			el.webuiPopover({
				multi: true,
				content,
				placement: "auto-top",
				trigger: "hover",
				style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,

				container: $(el).is("[data-container]") ? $(`${$(el).attr("data-container")}`) : false,
				onShow: function () {
					if ($(el).is("[data-focus]")) {
						$(el).addClass('focus');
					}
				},
			});

			WebuiPopovers.show(el);
		},
		close: (selector) =>{
			const el = $(document).find(`[data-toast='${selector}']`);
			const delay = 2000; // ms
			setTimeout(() => {
				el.webuiPopover("destroy");
			}, delay);
		}

	},



	/**
	 * TOBE사용
	 * raonk 멀티다운로드 팝업
	 */
	multidown: {
		open: (_params)=> {
			openPopup({id: 'download-file'});
			$("#downloadForm").empty();
			$("#downloadPopup").contents().find("body").html('');
			$.each(_params, function (i, v) {
					$("#downloadForm").append(
							$("<input/>").attr({
									"type": "hidden",
									"name": "params"
							}).val(v.params)
					)
			});
			$("#downloadForm").attr("action", "/pages/api/file/down/multi/fileDownload.mrn");
			$("#downloadForm").submit();
		}
	},



	// 파일 확장자를 아이콘 명으로 변환
	extension : {
		extensionToIcon : (_fileType)=> {
			let imageString;
			_fileType = !_.isNil(_fileType) ? _fileType.toLowerCase() : '';

			switch (_fileType) {
				case "pdf" :
					imageString = "icon-pdf.svg"
					break;
				case "youtube" :
					imageString = "icon-youtube.svg"
					break;
				case "link" :
					imageString = "icon-link.svg"
					break;
				case "hwp" :
				case "hwpx" :
				case "hwt" :
					imageString = "icon-hangul.svg"
					break;
				case "xlsx" :
				case "xls" :
				case "xlsm" :
					imageString = "icon-excel.svg"
					break;
				case "pptx" :
				case "ppt" :
				case "pptm" :
					imageString = "icon-ppt.svg"
					break;
				case "docx" :
				case "docm" :
					imageString = "icon-word.svg"
					break;
				case "zip" :
				case "z01" :
				case "z02" :
				case "z03" :
					imageString = "icon-zip.svg"
					break;
				case "txt" :
				case "webp" :
					imageString = "icon-text.svg"
					break;
				case "png" :
				case "jpg" :
				case "jpeg" :
				case "bmp" :
				case "tiff" :
				case "gif" :
					imageString = "icon-img.svg"
					break;
				case "asf" :
				case "avi" :
				case "flv" :
				case "mov" :
				case "mp4" :
				case "swf" :
				case "wmv" :
				case "mpeg" :
				case "webm" :
					imageString = "icon-media.svg"
					break;
				case "mp3" :
				case "wav" :
				case "wma" :
					imageString = "icon-music.svg"
					break;
				default :
					imageString = "icon-link.svg"
			}
			return imageString;
		},

		extensionToNoData : (_fileType)=> {
			let imageString;

			_fileType = _fileType.toLowerCase();

			switch (_fileType) {
				case "youtube" :
				case "link" :
				case "LINK" :
					imageString = "no-link"
					break;
				case "zip" :
				case "z01" :
				case "z02" :
				case "z03" :
					imageString = "no-zip"
					break;
				case "png" :
				case "jpg" :
				case "jpeg" :
				case "bmp" :
				case "tiff" :
				case "gif" :
					imageString = "no-image"
					break;
				case "asf" :
				case "avi" :
				case "flv" :
				case "mov" :
				case "mp4" :
				case "swf" :
				case "wmv" :
				case "mpeg" :
				case "webm" :
				case "mp3" :
				case "wav" :
				case "wma" :
				case "asf" :
				case "avi" :
				case "flv" :
				case "mov" :
				case "mp4" :
				case "swf" :
				case "wmv" :
				case "mpeg" :
				case "webm" :
					imageString = "no-video"
					break;
				default :
					imageString = ""
			}
			return imageString;
		}
	},

	init: function() {

		// 다국어 lang.js 연동(제목 지정으로 사용)
		$('[data-lang]').each(function() {
			let $this = $(this);
			$this.html($.lang[$val.lang][$this.data('lang')]);
		});

		// select2 기본 설정
		/*$('select.select2').each(function() {
			$('select').select2({ minimumResultsForSearch: Infinity });
		});*/

		//switch
		$('.switch button').click(function() {
			$(this).addClass('on').siblings().removeClass('on');
		});

		// 숫자
		$('input[inputmode=numeric]').each(function() {

			let digi = ($text.isEmpty($(this).data('digits'))) ? 0 : $(this).data('digits');
			let mx = ($text.isEmpty($(this).data('max'))) ? 99999999999999999999 : $num.unComma($(this).data('max'));

			// '-'삭제 버그 처리
			$(this).keydown(function(event) {
				// backspace '-' 삭제 처리
				(event.keyCode == 8 && $(this).val() == '-') ? $(this).val('') : $(this).val();

				// del '-' 삭제 처리
				(event.keyCode == 46 && $(this).val() == '-') ? $(this).val('') : $(this).val();
			});

			$(this).inputmask("numeric", {
				placeholder: '',
				// integerDigits: 2,       //자리수 설정
				digits: digi,				//소수점 자리수
				digitsOptional: true,
				groupSeparator: ",",    //separator 설정
				autoGroup: true,		//천단위 그룹
				allowPlus: true,		// 양수 허용
				allowMinus: true,		// 음수 허용
				// min: -1000,			// 최소값
				max: mx,				// 최대값
				// numericInput: true	// 소수점 미리 나옴
			});
		});

		// 날짜
		$('input[inputmode=date]').each(function() {
			let autoUpdate = $(this).data('autoupdate');
			autoUpdate = (autoUpdate == false) ? false : true;
			let el = '#' + $(this).attr('el');
			ui.datePicker.date(el, $(this).val(), autoUpdate);
		});

		// 날짜 기간
		$('input[inputmode=dates]').each(function() {
			let autoUpdate = $(this).data('autoupdate');
			autoUpdate = (autoUpdate == false) ? false : true;

			let el = '#' + $(this).attr('el');
			let sdate = $date.isDate($(this).data('sdate')) ? $(this).data('sdate') : '';
			let edate = $date.isDate($(this).data('edate')) ? $(this).data('edate') : '';
			ui.datePicker.dates(el, sdate, edate, autoUpdate);
		});

		// 날짜기간 시간
		$('input[inputmode=datetimes]').each(function() {
			let el = '#' + $(this).attr('el');
			let sdate = $date.isDate($(this).data('sdate')) ? $(this).data('sdate') : '';
			let edate = $date.isDate($(this).data('edate')) ? $(this).data('edate') : '';
			ui.datePicker.datetimes(el, sdate, edate);
		});

		// 날짜 월력
		$('input[inputmode=month]').each(function() {
			let el = '#' + $(this).attr('el');
			let d = $(el).val();
			ui.datePicker.month(el, d);
		});

		// 날짜 년력
		$('input[inputmode=year]').each(function() {
			let el = '#' + $(this).attr('el');
			let d = $(el).val();
			ui.datePicker.year(el, d);
		});


		// 콤보년도 기본 셋팅
		$('[data-comboYear]').each(function() {
			let comboyear = eval('(' + $(this).data('comboyear') + ')');
			let addRowText = comboyear.addrowtext;
			let toYear = new Date().getFullYear();
			let syear = comboyear.syear;
			let fyear = comboyear.fyear || toYear;
			let val = comboyear.val || 'now';

			if (comboyear.fyear === 'now') fyear = toYear;
			if (comboyear.fyear === 'last') fyear = toYear - 1;
			if (comboyear.fyear === 'next') fyear = toYear + 1;

			if (val === 'now') val = toYear;
			if (val === 'last') val = toYear - 1;
			if (val === 'next') val = toYear + 1;

			addRowText = addRowText === undefined ? '' : addRowText;
			val = val === undefined ? null : val;
			// 추가 문구 넣기
			if (addRowText.length > 0) {
				$(this).append("<option value=''>" + addRowText + "</option>");
			}
			// 콤보생성 (년도 동안 년도 생성)
			for (let i = fyear; i >= syear; i--) {
				$(this).append("<option value='" + i + "'>" + i + "년</option>");
			}
			$(this).val(val);
			$(this).select2({ minimumResultsForSearch: Infinity });
		});

		// 콤보년도 기본 셋팅
		$('[data-combo-num]').each(function() {
			let el = '#' + $(this).attr('el');
			let combo = eval('(' + $(this).data('combo-num') + ')');

			let sNum = combo.snum;
			let fNum = combo.fnum;
			let val = combo.val;
			let addtext = combo.addtext;
			let addRowText = combo.addrowtext;
			val = val === undefined ? null : val;
			addtext = addtext === undefined ? null : addtext;
			addRowText = addRowText === undefined ? '' : addRowText;
			// 추가 문구 넣기
			if (addRowText.length > 0) {
				$(el).append("<option value=''>" + addRowText + "</option>");
			}
			// 콤보생성 (년도 동안 년도 생성)
			for (let i = fNum; i >= sNum; i--) {
				$(el).append("<option value='" + i + "'>" + i + addtext + "</option>");
			}

			$(el).val(val || $date.getMM());
			$(el).select2({ minimumResultsForSearch: Infinity });
		});

		// 모달 2중 기능 버그 처리 디바운싱
		$(document).on({
			'show.bs.modal': function() {
				let zIndex = 40 + (10 * $('.modal:visible').length);
				$(this).css('z-index', zIndex);
				setTimeout(function() {
					$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
				}, 0);
			},
			'helden.bs.modal': function() {

				if ($('.modal:visible').length > 0) {
					setTimeout(function() {
						$(document.body).addClass('modal-open');
					}, 0);
				}
			}
		}, '.modal');
		// 로딩
		$('.main-contents').css('opacity', 0);
		$('.main-contents').removeClass('helden');
		$('.main-contents').animate({ opacity: 1 }, {
			duration: 400, complete: function() {
				$('.cloading').hele();
			}
		});
	}
}

$(function() {
	ui.init();					// 공통 적용
});

let $datePicker = ui.datePicker;
let $combo = ui.combo;
let $radio = ui.radio;
let $checkbox = ui.checkbox;
let $paging = ui.paging;
let $alert = ui.alert;
let $toast = ui.toast;
let $multidown = ui.multidown;
let $extension = ui.extension;
