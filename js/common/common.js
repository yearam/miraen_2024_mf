// common js
const ALERT_ERR_MSG = '잠시 후 다시 시도해 주세요.<br/>에러가 지속될 시 관리자에게 문의해주세요.';
var cjs = {
	// 기본 변수
	val: {
		lang: 'ko', 					// lanaguage
		imageMaxWidth: 1000,			// 업로드할 이미지 최대 width
		thumbnailWidth: 1920,			// 썸네일 width (full hd)
		thumbnailHeight: 1080,			// 썸네일 height (full hd)
		modalPopup: null,				// 모달 팝업 복사
		loadingCnt: 0,					// 로딩 갯수
		PAGING_PAGE_COUNT: 5,			// 페이지 개수
		PAGING_ROW_COUNT: 9,			// 한페이지 ROW 갯수
	},

	// 숫자 함수
	num: {

		// 반올림
		round: function(num, cipher) {
			let n = Math.round(num * Math.pow(10, cipher)) / Math.pow(10, cipher);
			return n;
		},

		// 내림
		floor: function(num, cipher) {
			let n = Math.floor(num * Math.pow(10, cipher)) / Math.pow(10, cipher);
			return n;
		},

		// 올림
		ceil: function(num, cipher) {
			let n = Math.ceil(num * Math.pow(10, cipher)) / Math.pow(10, cipher);
			return n;
		},

		// 컴마 제거
		unComma: function(n) {
			try {
				n = '' + n.replace(/,/gi, ''); // 콤마 제거
				n = n.replace(/(^\s*)|(\s*$)/g, ''); // trim()공백,문자열 제거
				return (new Number(str));//문자열을 숫자로 반환
			} catch (e) {
				n
			} finally {
				return n;
			}
		},

		// 컴마 생성
		comma: function(n) {
			n = String(n);
			var regx = new RegExp(/(-?\d+)(\d{3})/);
			var bExists = n.indexOf(".", 0);//0번째부터 .을 찾는다.
			var strArr = n.split('.');
			while (regx.test(strArr[0])) {//문자열에 정규식 특수문자가 포함되어 있는지 체크
				//정수 부분에만 콤마 달기
				strArr[0] = strArr[0].replace(regx, "$1,$2");//콤마추가하기
			}
			if (bExists > -1) {
				//. 소수점 문자열이 발견되지 않을 경우 -1 반환
				n = strArr[0] + "." + strArr[1];
			} else { //정수만 있을경우 //소수점 문자열 존재하면 양수 반환
				n = strArr[0];
			}
			return n;//문자열 반환
		},

		/**
		 * inputmask 숫자형
		 * @memberOf $num.numeric('#num03','0','9999')
		 * @param {String} id 아이디
		 * @param {String} digi 수수점 자리수
		 * @param {String} mx 최대값
		 */
		numeric: function(id, digi, mx) {
			digi = ($text.isEmpty(digi)) ? 0 : digi;
			mx = ($text.isEmpty(mx)) ? 99999999999999999999 : $num.unComma(mx);
			$(id).inputmask("numeric", {
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
		},

		/**
		 * 숫자 한글로
		 * @memberOf $num.toHan(12314532)
		 * @param {Number} num 숫자
		 */
		toHan: function(num) {

			let val = String(num).replace(/[^0-9]/g, '');

			var numKor = new Array('', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십');
			// 숫자 문자
			var danKor = new Array('', '십', '백', '천', '', '십', '백', '천', '', '십', '백', '천', '', '십', '백', '천');

			// 만위 문자열
			var result = '';
			if (!isNaN(val)) {

				// CASE: 금액이 공란/NULL/문자가 포함된 경우가 아닌 경우에만 처리
				for (i = 0; i < val.length; i++) {
					var str = '';
					var num = numKor[val.charAt(val.length - (i + 1))];

					if (num != '') str += num + danKor[i];

					// 숫자가 0인 경우 텍스트를 표현하지 않음
					switch (i) {
						case 4: str += '만'; break; // 4자리인 경우 '만'을 붙여줌 ex) 10000 -> 일만
						case 8: str += '억'; break; // 8자리인 경우 '억'을 붙여줌 ex) 100000000 -> 일억
						case 12: str += '조'; break; // 12자리인 경우 '조'를 붙여줌 ex) 1000000000000 -> 일조
					}
					result = str + result;
				}
				// result = result + '';
			}
			return result;
		}

	},

	// 문자 함수
	text: {

		// UUID v4 generator in JavaScript (RFC4122 compliant)
		getUUID: function() {
			return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
				return v.toString(16);
			});
		},

		/**
		 * 공백 체크
		 * @memberOf $text
		 * @param {String} val 공백체크할 문자열
		 */
		isEmpty: function(val) {
			if (typeof val === 'undefined' || val === null || val === '' || val === 'undefined')
				return true;
			else
				return false;
		},

		/**
		 * 값이 있으면 있는 것으로 없으면 기본값
		 * @memberOf $text
		 * @param {String} val 공백체크할 문자열
		 * @param {String} def 기본값
		 */
		setDefVal: function(val, def) {
			if (typeof val === 'undefined' || val === null || val === '' || val === 'undefined')
				return def;
			else
				return val;
		},

		/**
		 * 문자 왼쪽 으로 자르기
		 *$text.left('김갑수',2)
		 *result ==> "김갑"
		 * @memberOf $text
		 * @param {String} val 문자열
		 * @param {int} length 자를 문자열의 시작 위치
		 */
		left: function(val, length) {
			if (val.length <= length) {
				return val;
			} else {
				return val.substring(0, length);
			}
		},

		/**
		 * 문자 오른쪽 으로 자르기
		 *$text.right('김갑수',2)
		 *result ==> "갑수"
		 * @memberOf $text
		 * @param {String} val 문자열
		 * @param {int} length 자를 문자열의 시작 위치
		 */
		right: function(val, length) {
			if (val.length <= length) {
				return val;
			} else {
				return val.substring(val.length - length, val.length);
			}
		},


		/**
		 * 문자 치환
		 * @memberOf $text
		 * @param {String} val 문자열
		 * @param {String} search 기존 문자
		 * @param {String} replace 치환할 문자
		 */
		replace: function(val, search, replace) {
			if (typeof val !== 'string') return '';
			return val.replace(search, replace);
		},

		/**
		 * 문자열에 앞에 특정문자를 붙여 정해진 길이 문자열을 반환한다.
		 * <per>
		 * <br>
		 * String result = $text.lpad("123", 5, "#");
		 * <br>
		 * result == > ##123
		 * </per>
		 * @memberOf $text
		 * @param {String} str 변경할 문자
		 * @param {Number} len 새로 만들 문자열 길
		 * @param {String} padStr 문자열 길이만큼 채울 문자
		 * @return{String} 변환된 문자열
		 */
		lpad: function(str, len, padStr) {
			if (str == null) { return str; };

			str = String(str);

			if (str.length >= len) {
				return str;
			}

			let sb = [];
			for (let i = 0; i < len - str.length; i += padStr.length) {
				sb.push(padStr);
			}
			sb.push(str);
			return sb.join('');
		},

		/**
		 * 문자열에 뒤에 특정문자를 붙여 정해진 길이 문자열을 반환한다.
		 * <per>
		 * <br>
		 * String result =  $text.rpad("123", 5, "#");
		 * <br>
		 * result == > 123##
		 * </per>
		 * @memberOf $text
		 * @param {String} str 변경할 문자
		 * @param {Number} len 새로 만들 문자열 길
		 * @param {String} padStr 문자열 길이만큼 채울 문자
		 * @return{String} 변환된 문자열
		 */
		rpad: function(str, len, padStr) {
			if (str == null) { return str; };

			str = String(str);

			if (str.length >= len) {
				return str;
			}

			let sb = [];
			sb.push(str);
			for (let i = 0; i < len - str.length; i += padStr.length) {
				sb.push(padStr);
			}
			return sb.join('');
		},


		/**
		 * 전화번호 포맷팅
		 * @memberOf $str
		 * @param {String} str 포맷팅 할 문자
		 */
		autoHypenTel: function(str) {
			str = str.replace(/[^0-9]/g, '').substring(0, 11);
			let reg = /[^0-9]/g;
			if (!reg.test(str)) {
				return str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
			} else {
				return str;
			}
		},

		/**
		 * 날짜 - 자동"-"
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		autoHypenDate: function(str) {
			str = str.replace(/[^0-9]/g, '').substring(0, 8);
			let tmp = '';
			if (str.length < 5) {
				return str;
			} else if (str.length < 7) {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 2);
				return tmp;
			} else {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 2);
				tmp += '-';
				tmp += str.substr(6, 2);
				return tmp;
			}
			return str;
		},

		/**
		 * 사업자등록 번호
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		autoHypenBizNo: function(str) {
			// 999-99-99999
			str = str.replace(/[^0-9]/g, '').substring(0, 10);;
			return str.replace(/([0-9]{3})([0-9]{2})([0-9]{5})/, '$1-$2-$3');
		},

		/**
		 * 주민번호
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		autoHypenJumin: function(str) {
			str = str.replace(/[^0-9]/g, '').substring(0, 13);
			return str.replace(/([0-9]{6})([1-4][0-9]{6})/, '$1-$2');
		},

		/**
		 * 전화번호 유효성 체크
		 * @memberOf $str
		 * @param {String} str 변경 할 문자
		 */
		checkTel: function(str) {

	    	let regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
	    	return regExp.test(str);
		},

		/**
		 * escape => html으로 치환
		 */
		escapeHtml: function(str) {
			if (str == null) {
				return '';
			}
			return str
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/""/g, '&quot;')
				.replace(/'/g, "&#039;")
				.replace(/'/g, "&#39;");
		},

		/**
		 * escape => html으로 치환
		 */
		unescapeHtml: function(str) {
			if (str == null) {
				return '';
			}
			return str
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'")
				.replace(/&#39;/g, "'");
		},

	},

	// 데이타 가공 함수
	objData: {

		// json 행 선택 단일 행
		getRowFilter : function(data, key, value) {
			var returnObject = "";
			$.each(data, function() {
				if (this[key] == value) {
					returnObject = this;
				}
			});

			return returnObject;
		},

		// json 행선택 rows
		getListFilter : function(data, key, value) {
			var returnObject = "";
			var array = [];
			$.each(data, function() {
				if (this[key] == value) {
					array.push(this);
					// returnObject = this;
				}
			});

			return array;
		},

		// json 행선택 rows
		getListFilter2 : function(data, key1, value1, key2, value2) {
			var returnObject = "";
			var array = [];
			$.each(data, function() {
				if (this[key1] == value1 || this[key2] == value2) {
					array.push(this);
				}
			});

			return array;
		},

		// json 행선택 Set
		getSetFilter : function(data, key) {
			var returnObject = "";
			const set = new Set();
			$.each(data, function() {
			    set.add(this[key]);
			});

			return Array.from(set);
		},

		// json 행선택 rows
		getListArrayFilter : function(data, key, value) {
			var returnObject = "";
			var array = [];
			$.each(data, function(idx1, item1) {
				$.each(value, function(idx2, item2) {
					if (item1[key] == item2) {
						array.push(item1);
						// returnObject = this;
					}
				})
			});
			return array;
		},

		// json like rows
		getListLikeFilter : function(data, key, value) {
			var array = [];
			$.each(data, function() {
				if (this[key].includes(value)) {
					array.push(this);
				}
			});

			return array;
		},

	},

	date: {

		/**
		 * 날짜 - DB 서버 날짜
		 */
		getSysDate: function() {

			const options = {
				url: '/getSysDate.ax',
				async: false,
				success: function(res) {
					result = res.row.sysDatetime;
				}
			};
			$cmm.ajax(options)
			return result;
		},

		/**
		 * 날짜 유효성 체크
		 * @memberOf $date
		 * @param {String} value 변경 할 문자
		 */
		isDate: function(value) {
			let result = true;
			try {
				let date = value.split("-");
				let y = parseInt(date[0], 10),
					m = parseInt(date[1], 10),
					d = parseInt(date[2], 10);

				let dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
				result = dateRegex.test(d + '-' + m + '-' + y);
			} catch (err) {
				result = false;
			}
			return result;
		},



	},

	// 폼
	form: {

		reset: function(id) {

			if(typeof id === 'string') {

				// form reset
				$(id)[0].reset();

				// validate reset
				$(id).validate().resetForm();

				// select2 초기화
				$(id + ' select').trigger('change');
			} else {

				let $elet = id;
				// form reset
				$elet[0].reset();

				// validate reset
				$elet.validate().resetForm();

				// select2 초기화
				$elet.find('select').not('.notReset').trigger('change');
			}
		},

		/**
		 * Form validate
		 *  @memberOf $form.check
		 *  @param {String} id : disabled처리할 요소의 id 선택자
		 */
		check: function(formId, rulesObj, messagesObj) {

			return validate = $(formId).validate({
				// focusCleanup: true, //true이면 잘못된 필드에 포커스가 가면 에러를 지움
				// focusInvalid: false, //유효성 검사후 포커스를 무효필드에 둠 꺼놓음
				// onclick: false, //클릭시 발생됨 꺼놓음
				// onfocusout: false, //포커스가 아웃되면 발생됨 꺼놓음
				// onkeyup: false, //키보드 키가 올라가면 발생됨 꺼놓음

				rules: rulesObj,
				messages: messagesObj,

				/*rules: {
					e01: 'required',
					e02: 'required',
					e03: 'required',
					e04: 'required',
					e05: 'required',
					e06: 'required',
					e07: 'required'
				},
				messages: {
					e01: '텍스트 필수입력',
					e02: '구분 콤보 필수 입력',
					e03: '레디오 체크 필수 입력',
					e04: '체크 박스 필수 입력',
					e05: '년도 선택',
					e06: '일자 선택',
					e07: '기간 선택',
				},*/
				errorElement: 'em',
				errorPlacement: function(error, element) {

				},
			});
		},
	},


	msg: {

		/**
		  *  toastr 알림
		* ex) $msg.toastr('TOASTR','')
		*  @memberOf $msg
		*  @param {String} text : toastr에 표시할 내용
		*  @param {String} code : toastr 코드 (생략가능)
		  */
		toastr: function(text, code) {
			toastr.options = {
				"closeButton": true,
				"debug": false,
				"newestOnTop": false,
				"progressBar": false,
				"positionClass": "toast-top-right",
				"preventDuplicates": false,
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "1000",
				"timeOut": "5000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			};

			let rcode = $text.isEmpty(code) ? 'error' : code.replace('t_', '');

			switch (rcode) {
				case "success":
					top.toastr.success(text);
					break;
				case "info":
					top.toastr.info(text);
					break;
				case "error":
					top.toastr.error(text);
					break;

				default:
					top.toastr.warning(text);
					break;
			}

		},


		/**
		 * Alert - jquery confirm
		 * $msg.alert([내용], [확인 Handler], [타입])
		 *  @memberOf $msg
		 *  @param {String} text : 표시할 내용
		 *  @param {Function} closeFunc : 확인 후 이벤트(생략가능)
		 *  @param {String} type : type 코드(생략가능)
		   */
		alert: function(text, closeFunc, type) {
			type = ($text.isEmpty(type)) ? '안내' : type;
			$.alert({
			    title: type,
			    content: text,
			    theme: 'bootstrap',
				fadeSpeed: 'fast',
				transition: 'fadeIn',
				boxWidth: '340px',
				useBootstrap: true,
				buttons: {
					cancel: {
						text: '닫기',
						btnClass: 'btn-blue',
						action: function() {
							if(!!closeFunc) { closeFunc(); }
						}
					}
				}
			});
		},

		/**
		  * Confirm - jquery confirm
		* https://sweetalert2.github.io
		* $msg.confirm([내용], [확인 Handler], [취소 Handler], [타입], [버튼명])
		* @memberOf $msg
		* @param {String} text : 표시할 내용
		* @param {Function} confirmFunc : 확인 후 이벤트(생략가능)
		* @param {Function} cancelFunc : 취소 후 이벤트(생략가능)
		* @param {String} type : type 코드(생략가능)
		* @param {String} btnText : 버튼 텍스트
		* @param {String} cancelText : 취소 버튼 텍스트 (생략가능)
		  */
		confirm: function(text, confirmFunc, cancelFunc, type, btnText, cancelText) {
			type = ($text.isEmpty(type)) ? '안내' : type;
			btnText = !!btnText ? btnText : '확인';
			cancelText = !!cancelText ? cancelText : '닫기';

			$.confirm({
				title: type,
				content: text,
				theme: 'bootstrap',
				fadeSpeed: 'fast',
				transition: 'fadeIn',
				boxWidth: '340px',
				useBootstrap: true,
				buttons: {
					confirm: {
						text: btnText,
						btnClass: 'btn-blue',
						action: function() {
							if(!!confirmFunc) {confirmFunc();}
						}
					},
					cancel: {
						text: cancelText,
						action: function() {
							if(!!cancelFunc) {cancelFunc();}
						}
					}
				}
			});

		},

	},

	/**
	 * TOBE사용
	 * 인코딩 / 디코딩
	 */
	coding: {
		encodeUnicode: (str)=> {
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
					function toSolidBytes(match, p1) {
							return String.fromCharCode('0x' + p1);
			}));
		},
		decodeUnicode: (str)=> {
			return decodeURIComponent(atob(str).split('').map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
		}
		
	},

	/**
	 * 공통함수
	 */
	cmm: {

		/**
		 * 초기화
		 *
		 */
		init: function() {

	
		},

		/**
		 * URL의 파라미터를 객체로 변환하여 반환한다.
		 * @memberOf $ui
		 * @param {String} key 파라미터 키
		 */
		getUrlParams: function(key) {

			let params = {}, tempValue;
			window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {

				if (!params[key]) {

					params[key] = value;
				} else {

					if (typeof params[key] === 'string') {

						tempValue = params[key];
						params[key] = [tempValue];
					}

					params[key].push(value);
				}
			});

			return !!key ? params[key] : params;

		},

		/**TOBE사용
		 * 통합게시판 url mainId 및 masterSeq파싱
		 * @returns 
		 */
		getTotalboardkeyFromUrl: function() {
			const pathName = window.location.pathname;

			return pathName.substring(pathName.lastIndexOf('/') + 1);
			
		},
		getTotalboardUrlDelKey: function() {
			const pathName = window.location.pathname;

			return pathName.substring(0, pathName.lastIndexOf('/'));
		},

		/**
		 * url get방식 파라미터 값 취득
		 * @param {*} key 
		 * @returns 
		 */
		getQueryString: function(key) {
			return new URLSearchParams(location.search).get(key);
		},

		/**TOBE사용
		 * 
		 * @param {*} options 
		 * @returns 
		 */
		ajax: function(options) {
			let _options = {
				method: 'POST',
				loading: true,
				dataType: 'json',
				beforeSend: function() {$cmm.ui.loadingShow()},
				complete: function() {$cmm.ui.loadingHide()},
				error: function(res) {

					$cmm.ui.loadingHide();
					if (res.statusText == 'error') {
						$alert.open(ALERT_ERR_MSG, ()=>{}, 'negative', 'info');
					} else {
						// 에러시 메세지 확인
						let msg = $text.isEmpty(res.message) ? res.responseJSON.message : res.message;

						if (!!msg) {
							let sendTf = false;
							$alert.open(ALERT_ERR_MSG, ()=>{}, 'negative', 'info');
						}
					}
				}
			};

			// 기본 객체에 파라미터 객체를 추가.
			for (let val in options) {
				if (!$text.isEmpty(options[val])) {
					_options[val] = options[val];
				}
			}

			_options.url = options.url;
			// 로딩바를 보이고 싶지 않을 때
			if (!_options.loading) {
				_options.beforeSend = null;
				_options.complete = null;
			}

			_options.data = !!_options.data ? _options.data : {};

			if(!!options.queryId) {
				_options.data.queryId = options.queryId;
			}

			// form serialize 유무
			if (!!_options.form) {

				let formJson = $cmm.serializeJson(_options.form);
				for (let key in formJson) {
					_options.data[key] = formJson[key];
				}
			}
			// json 파라미터인 경우
			if (!!_options.isJsonParam) {
				let data = _options.data;
				if (Array.isArray(data)) {
					//STATUS -> flg , flg = I -> flg = C 로 변경
					// todo : 배열인지 체크 하여 작업
					data.forEach(function(value) {
						value.flg = value.STATUS;
						if (value.flg === 'I') {
							value.flg = 'C'
						}
					});
				}

				_options.data = JSON.stringify({ jsonParam: _options.data });
				_options.contentType = "application/json; charset=UTF-8";
			}

			// 성공 함수
			_options.success = function(res) {

				let resultCode = res.resultCode;
				let resultMsg = res.resultMsg;
				let resultStatus = res.status;

				// api 결과값 에러 코드 추가
				let errorCode = res.errorCode;

				// 정상 결과
				if (resultStatus || resultCode === "0000" || errorCode === "" || errorCode === "0") {

					options.success(res);
				// 결과코드(9990) : 세션 만료
				} else if (resultCode === "9990") {

					$alert.open('MG00001');
				// 결과코드(9980) :
				} else if (resultCode === "9980") {

					$alert.open('MG00004');

					if (!!options.error) {
						_options.error();
					}
				} else if (resultCode === "9999") {

					if (resultMsg === 'MG00001') {

						$alert.open(resultMsg);
					} else {
						$alert.open(ALERT_ERR_MSG, ()=>{}, 'negative', 'info');
					}

				} else {

					if (!!resultMsg) {

						$alert.open(resultMsg, ()=>{}, 'negative', 'info');
					} else {
						$alert.open(ALERT_ERR_MSG, ()=>{}, 'negative', 'info');
					}

					if (!!options.error) {
						_options.error(ALERT_ERR_MSG);
					}
				}
			};

			// data 초기화
			_options.data = _options.data || {};
			return $.ajax(_options);
		},

		/**
		 * Ajax Upload 통신
		 * @memberOf $cmm
		 * @param {Object} options ajax 옵션
		 */
		ajaxUpload: function(options) {

			let _options = {
				method: 'POST',
				loading: true,
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				beforeSend: function() {cjs.cmm.ui.loadingShow()},
				complete: function() {cjs.cmm.ui.loadingHide()},
				error: function(res) {
					$msg.alert(ALERT_ERR_MSG);
				}
			};

			// 기본 객체에 파라미터 객체를 추가.
			for (let val in options) {
				if (!$text.isEmpty(options[val])) {
					_options[val] = options[val];
				}
			}

			if (!!_options.form) {
				let formData = new FormData(_options.form[0]);
				if (!!_options.data) {
					for (let val in _options.data) {
						if (!$text.isEmpty(_options.data[val])) {
							formData.append(val, _options.data[val]);
						}
					}
				}

				_options.data = formData;
			}

			// 성공 함수
			_options.success = function(res) {

				let resultCode = res.resultCode;
				let resultMsg = res.resultMsg;

				// 정상 결과
				if (resultCode === "0000") {

					options.success(res);

					// 결과코드(9990) : 세션 만료
				} else if (resultCode === "9990") {

					$msg.alert('세션이 만료되었습니다.', function() {

						location.href = "/";
					});
					// 결과코드(9980) :
				} else if (resultCode === "9980") {

					$msg.alert('권한이 없는 서비스입니다.');

					if (!!options.error) {
						_options.error();
					}
				} else {

					if (!!resultMsg) {

						$msg.alert(resultMsg);
					} else {

						alert(ALERT_ERR_MSG);
					}

					if (!!options.error) {
						_options.error(ALERT_ERR_MSG);
					}
				}
			};
			_options.url =  _options.url
			return $.ajax(_options);
		},

		/**
		 * FORM 입력 데이터를 JSON으로 반환한다.
		 * @memberOf $cmm
		 * @param {Element} $frm form 객체
		 */
		serializeJson: function($frm) {

			if ($frm[0].tagName.toUpperCase() === "FORM") {
				let list = $frm.serializeArray();
				let jsonData = {}, arryValue;;
				$.each(list, function(idx) {

					if (!!list[idx].value) {

						// 배열일 경우
						if (!!jsonData[list[idx].name]) {

							if (typeof jsonData[list[idx].name] === "string") {

								arryValue = jsonData[list[idx].name];
								jsonData[list[idx].name] = [];
								jsonData[list[idx].name].push(arryValue);
							}

							jsonData[list[idx].name].push(list[idx].value);
						} else {

							jsonData[list[idx].name] = list[idx].value;
						}
					}
				});

				return jsonData;
			}
		},

		/**
		 * FORM 입력 데이터를 JSON으로 반환한다.
		 * @memberOf $cmm
		 * @param {Element} $frm form 객체
		 */
		serializeJsonAll: function($frm) {

			if ($frm[0].tagName.toUpperCase() === "FORM") {
				let list = $frm.serializeArray();
				let jsonData = {}, arryValue;;
				$.each(list, function(idx) {

					// 배열일 경우
					if (!!jsonData[list[idx].name]) {

						if (typeof jsonData[list[idx].name] === "string") {

							arryValue = jsonData[list[idx].name];
							jsonData[list[idx].name] = [];
							jsonData[list[idx].name].push(arryValue);
						}

						jsonData[list[idx].name].push(list[idx].value);
					} else {

						jsonData[list[idx].name] = list[idx].value;
					}
				});

				return jsonData;
			}
		},

		/**
		 * 데이터 바인딩
		 * @memberOf $cmm
		 * @param {Element} $el 객체
		 * @param {Object} item 데이터
		 */
		setDataBind: function($el, item) {

			$el.find('[data-bind]').each(function(elIdx, el) {
				let tagName = el.tagName.toUpperCase();
				let type = !!$(el).prop("type") ? $(el).prop("type").toUpperCase() : '';
				let val = $text.isEmpty(item) ? '' : item[$(el).attr('data-bind')];

				// 값 넣기
				if (tagName === 'INPUT' && (type == "CHECKBOX" || type == "RADIO")) {
					if ($(el).val() == val) {
						$(el).prop("checked", true);
					} else {
						$(el).prop("checked", false);
					}
				} else if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
					$(el).val(val);
				} else if (tagName === 'SELECT') {
					$(el).val(val);
					if(!$(el).hasClass('notReset')) {
						$(el).trigger('change');
					}
				} else {
					$(el).text(val);
				}

			});
		},

		/** TOBE사용
		 * 공통 코드 조회
		 * @memberOf $cmm
		 * @param {Array} clCdList 코드 리스트
		 */
		getCmmCd: (cdList, asyncYn) => {

			return new Promise((resolve, reject) => {

				let ajaxOtp = {
					// url: '/al/com/getCommonCode',
					url: '/pages/api/combo/getCommonComboList.ax',
					method: 'GET',
					data: {
						// clCd: clCdList.join(',')
						codeGroup: cdList.join(',')
					},
					async: !(asyncYn)?false:asyncYn,
					success: (res) => {

						resolve(res);
					},
					error: (errTxt) => {

						if (errTxt.statusText == 'error') {

							// 시스템 에러
							$alert.open(errTxt.responseJSON.message, ()=>{}, 'negative', 'info');

						} else if (!!errTxt) {

							$alert.open(errTxt, ()=>{}, 'negative', 'info');
						}

						resolve();
					}
				};

				$cmm.ajax(ajaxOtp);
			});
		},

		/**
		 * 페이징 처리를 한다.
		 *
		 * @memberOf $cmm
		 * @param {Object} $page 페이징 객체
		 * @param {Object} data 데이터
		 * @param {function} pagingFunc 페이징 선택 이벤트
		 */
		setPaging : function($paging, data, pagingFunc) {

			if(data.totalCnt === 0) {

				$paging.addClass("d-none hidden");
				return;
			}

			$paging.removeClass("d-none hidden");

			// 초기화.
			$paging.find("a").addClass("d-none hidden");

			// 페이징 갯수.
			let pageCnt = (Math.floor((data.page - 1) / cjs.val.PAGING_PAGE_COUNT) + 1) * cjs.val.PAGING_PAGE_COUNT;
			let pageStart = (pageCnt - cjs.val.PAGING_PAGE_COUNT) + 1;
			// 전체 페이징 갯수.
			let totalPageCnt = Math.ceil(data.totalCnt / cjs.val.PAGING_ROW_COUNT);

			pageCnt = pageCnt > totalPageCnt ? totalPageCnt : pageCnt;

			let pageIdx = 2;
			// 페이징 갯수 설정.
			for(let i = pageStart; i <= pageCnt; i++) {

				$paging.find("a").eq(pageIdx).removeClass("d-none hidden on bg-info bg-opacity-25");
				$paging.find("a").eq(pageIdx).html(i);

				// 선택 된 페이지 표시.
				if(i === Number(data.page)) {

					$paging.find("a").eq(pageIdx).addClass("on bg-info bg-opacity-25");
				}

				// 페이지 이동
				$paging.find("a").eq(pageIdx++).off().on("click", function() {

					if(!!pagingFunc) {

						pagingFunc($(this).html());
					}
				});
			}

			// 현재 페이징이 처음일 경우
			if(data.page > cjs.val.PAGING_PAGE_COUNT) {

				$paging.find("a").eq(0).removeClass("d-none hidden");
				$paging.find("a").eq(1).removeClass("d-none hidden");

				// 첫 페이지로 이동
				$paging.find("a").eq(0).off().on("click", function() {

					if(!!pagingFunc) {

						pagingFunc(1);
					}
				});

				// 이전 페이지로 이동
				$paging.find("a").eq(1).off().on("click", function() {

					if(!!pagingFunc) {

						pagingFunc(Number($paging.find("a").eq(2).html()) - cjs.val.PAGING_PAGE_COUNT);
					}
				});
			}

			// 현재 페이징이 마지막일 경우
			if(pageCnt != totalPageCnt) {

				$paging.find("a").eq(cjs.val.PAGING_PAGE_COUNT + 2).removeClass("d-none hidden");
				$paging.find("a").eq(cjs.val.PAGING_PAGE_COUNT + 3).removeClass("d-none hidden");

				// 마지막 페이지로 이동
				$paging.find("a").eq(cjs.val.PAGING_PAGE_COUNT + 2).off().on("click", function() {

					if(!!pagingFunc) {

						pagingFunc(Number($paging.find("a").eq(2).html()) + cjs.val.PAGING_PAGE_COUNT);
					}
				});

				// 다음 페이지로 이동
				$paging.find("a").eq(cjs.val.PAGING_PAGE_COUNT + 3).off().on("click", function() {

					if(!!pagingFunc) {

						pagingFunc(totalPageCnt);
					}
				});
			}

		},

		setHistoryCookie: function(expiredays, cookieName, cookieValue, path) {
			let todayDate = new Date();
			todayDate.setDate( todayDate.getDate() + expiredays );

			if ($cmm.getCookie(cookieName) != null && $cmm.getCookie(cookieName) != '') {
				let arr = $cmm.getCookie(cookieName).split(',');

				let filtered = arr.filter((element) => element !== cookieValue);

				if (filtered.length >= 23) {
					filtered.shift();
				}

				cookieValue = filtered.join(',') + ',' + cookieValue
			}

			document.cookie = `${cookieName}=${escape(cookieValue)}; path=${path}; expires=${todayDate.toGMTString()};`;
		},

		getCookie: function(cookieName) {
			let result = '';

			document.cookie.split(';').map((item) => {

				const cookieItem = item.trim();

				if (item.includes(cookieName)) {
					result = cookieItem.split('=')[1];
				}
			});
			return unescape(result);
		},



		/**
		 * 화면 공통함수
		 */
		ui: {
			/**
			 * 로딩바 show
			 * @memberOf $ui
			 */
			loadingShow: function() {
				cjs.val.loadingCnt = cjs.val.loadingCnt + 1;
				if ($('body').find('.loadingDiv').length === 0) {
					$('body').append('<div class="loadingDiv"><div class="loadingAni"><div></div><div></div><div></div></div></div>');
				}


			},

			/**
			 * 로딩바 hide
			 * @memberOf $ui
			 */
			loadingHide: function() {
				cjs.val.loadingCnt = cjs.val.loadingCnt - 1;
				if (cjs.val.loadingCnt <= 0) {
					$('body').find('.loadingDiv').remove();
				}
				cjs.val.loadingCnt = cjs.val.loadingCnt < 0 ? 0 : cjs.val.loadingCnt;
			},
		},

		/**
		 * 엑셀 읽기
		 * 유효성 체크 빠짐
		 *
		 * @memberOf screen.f.excelRead
		 */
		excelRead: function (formId, type, column) {
			$('#resultContent').empty();

			let frmData = new FormData($('#'+formId)[0]);
			frmData.append('type', type);
			frmData.append('column', column);

			const options = {
				method: 'POST',
				loading: true,
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				url: '/excel/saveExcelData.ax',
				data: frmData,

				success: function (res) {
					//엑셀 파일업로드 후 undefined / null 체크
					if (typeof res.row.excelItemString == "undefined" || res.row.excelItemString == null || res.row.excelItemString == "") {
						alert('선택 된 파일이 없거나 파일이 업로드 되지 않았습니다. ');
						return false;
					} else {
						const arr = res.row.excelItemString.split(",");  // 엑셀 성공 데이터

						let scnt = 0;
						let fcnt = 0;
						var html = "";

						for (let i = 0; i < arr.length; i++) {
							var no = i + 1;
							var result = arr[i];
							var value = '';

							if (result === '성공') {
								scnt++;
							} else {
								fcnt++;
							}
							html += '<p>' + no + '번 항목 등록 ' + result + '</p>'

						}
						if (fcnt > 0) {
							alert("작성 내용이 올바르지 않습니다.");
						}

						$('#resultContent').append(html);
						$('#sfcnt').empty();
						$('#sfcnt').append("총 " + arr.length + "건 중 등록완료 : " + scnt + "건 / 미등록 : " + fcnt + "건");

					}
				}
			}
			$.ajax(options);
		},

    /**
     * 엑셀 다운로드를 한다.
     *
     * @memberOf $cmm
     * @param {String} url 엑셀 다운로드 url.
     * @param {Object} param 파라미터.
     */
    excelDownload: function (url, param) {

      if ($("#excelFrm").length === 0) {
        $("body").append("<form id='excelFrm'></form>");
      }

      if (!!param) {
        $("#excelFrm").empty();

        if (typeof param === "string") {
          var paramList = param.split("&");
          var paramListLen = paramList.length;
          var items;

          for (var i = 0; i < paramListLen; i++) {

            items = paramList[i].split("=");

            $("#excelFrm").append("<input type='hidden' name='" + items[0] + "' value='" + items[1] + "' />");
          }
        } else {

          // 기본 객체에 파라미터 객체를 추가.
          for (var val in param) {
            if (typeof param[val] === "object") {
              param[val] = JSON.stringify(param[val]);
            }

            $("#excelFrm").append("<input type='hidden' name='" + val + "' value='" + param[val] + "' />");
          }
        }
      }

      $("#excelFrm").attr("method", "post");
      $("#excelFrm").attr("action", url);

      $cmm.ui.loadingShow();

      $.fileDownload($("#excelFrm").prop('action'), {
        httpMethod: "POST",
        data: $("#excelFrm").serialize(),
        // successCallback: function (url) {
        //   console.log("file download success");
        //   // $cmm.ui.loadingHide();
        // },
        // failCallback: function (responseHtml, url) {
        //   console.log("file download fail");
        //   // $cmm.ui.loadingHide();
        // }
      });

      $cmm.ui.loadingHide();
    },
  },

	init: function() {
		// 공통 초기화 호출
		$cmm.init();



	}
};

var $val = cjs.val;				// 공통변수
var $text = cjs.text;			// 문자함수
var $num = cjs.num;				// 숫자함수
var $objData = cjs.objData;		// 오브젝 데이타
var $date = cjs.date;			// 날짜
var $form = cjs.form;			// 폼
var $msg = cjs.msg;				// 메세지(notify, alert, confirm)
var $cmm = cjs.cmm;				// 공토함수
let $coding = cjs.coding;
let $isLogin = $("#isLogin").val() === "true" ? true : false;
// 공통 초기화 호출
cjs.init();