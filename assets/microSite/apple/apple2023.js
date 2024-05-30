'use strict';
var os = '';
$(function() {
	var page = {
		// 변수 선언
		v: {
			$isLogin: false,
			$userGrade: ''

		},

		// 서버 통신 관련 함수
		call: {

		},
		// 이벤트 선언과, 이벤트 함수 목록
		func: {

			// 로그인 클릭
			loginClick: function() {
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
			// 이벤트
			event: function() {
				/* 23ver 수정// */
				$(document).on('click', '.btnTab01', function(event) {
					event.preventDefault();
					$('.tab-cont.textbook').removeClass('section-mid section-high');
					$('.tab-cont.textbook').addClass('section-ele');
					// $('html,body').animate({
					// 	scrollTop: $('.section-ele').offset().top
					// }, 500);
				});

				$(document).on('click', '.btnTab02', function(event) {
					event.preventDefault();
					$('.tab-cont.textbook').removeClass('section-ele section-high');
					$('.tab-cont.textbook').addClass('section-mid');
					// $('html,body').animate({
					// 	scrollTop: $('.section-mid').offset().top
					// }, 500);
				});

				$(document).on('click', '.btnTab03', function(event) {
					event.preventDefault();
					$('.tab-cont.textbook').removeClass('section-ele section-mid');
					$('.tab-cont.textbook').addClass('section-high');
					// $('html,body').animate({
					// 	scrollTop: $('.section-high').offset().top
					// }, 500);
				});

				// 엠티처 바로접속
				$(document).on('click', '#mteacherDirect', function (e) {
					$('#mteacher-shortcut').show();
				});
				$(document).on('click', '#mteacher-shortcut .close-button', function (e) {
					$('#mteacher-shortcut').hide();
				});
				$(document).on('click', '#mteacher-shortcut .footer [close-obj=mteacher-shortcut]', function() {
					$('#mteacher-shortcut .close-button').trigger('click');
				});
				$(document).on('click', '#mteacher-shortcut .dimd', function() {
					$('#mteacher-shortcut .close-button').trigger('click');
				});

				/* //23ver 수정 */

				$(document).on('click', '.btnLogin', page.func.loginClick);

				if(page.v.$isLogin){
					if(page.v.$userGrade != '002'){
						$alert.open("MG00011", () => {});
						return;
					}

					$(document).on('click', '.books a.btn_list', function(event) {
						let url = $(this).data('url');
						// 링크가 없으면
						if (url == '') {
							$alert.alert('준비중입니다.');
						} else {
							if (os.indexOf('iOS') > -1 || os.indexOf('Mac') > -1) {
								// 통계
								let fmIdx = $(this).data('fmIdx');
								checkStatistic(fmIdx);
								window.open('https://download.mirae-n.com/apple' + url); // http://textbook-miraen.cdn.x-cdn.com
							} else {
								let fmIdx = $(this).data('fmIdx');
								checkStatistic(fmIdx);
								$alert.alert('Numbers 교과서는 iOS 환경에서 확인 가능 합니다.');
							}
						}
					});

					function checkStatistic(fmIdx){ // 다운로드 통계
						$.post('/pages/api/apple/saveStatisticAppleNumbers.ax', {
							fmSeq: fmIdx,
							test:1
							// userInfo: JSON.parse($('[name=userInfo]').val())
						}).done(function(data) {
							// console.log(data);
						});
					}

					$(document).on('click', '.part01 a.btn_list', function(event) {
						let url = $(this).data('url');
						// 링크가 없으면
						if (url == '') {
							$alert.alert('준비중입니다.');
							return;
						} else {
							if (os.indexOf('iOS') > -1 || os.indexOf('Mac') > -1) {
								let fmIdx = $(this).data('fmIdx');
								checkStatistic(fmIdx);
								window.open('https://download.mirae-n.com/apple/2022' + url); // http://textbook-miraen.cdn.x-cdn.com
							} else {
								$alert.alert('Numbers 교과서는 iOS 환경에서 확인 가능 합니다.');
								return;
							}
						}
					})
				}else{
					$(document).on('click', 'a.btn_list', function() {
						$alert.open("MG00001");
					});
				}
			}
		},

		// 페이지 초기화
		init: function() {
			// new WOW().init();
			page.v.$isLogin = $("#isLogin").val() === "true" ? true : false;
			page.v.$userGrade = $("#userGrade").val() || '';

			page.func.event();

			// os 선택
			os = findBrowserDetails();

		}
	};

	page.init();
});

var user = {}
user.device = {};
function findBrowserDetails() {
	user.device = {};
	var unknown = '-';
	// screen
	var screenSize = '';
	/*if (screen.width) {
		width = (screen.width) ? screen.width : '';
		height = (screen.height) ? screen.height : '';
		screenSize += '' + width + " x " + height;
	}*/

	// console.log("What i get from above link is--", navigator);

	// browser
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent || navigator.vendor || window.opera;
	var browser = navigator.appName;
	var version = '' + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;
	// Opera
	if ((verOffset = nAgt.indexOf('Opera')) != -1) {
		browser = 'Opera';
		version = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf('Version')) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Opera Next
	if ((verOffset = nAgt.indexOf('OPR')) != -1) {
		browser = 'Opera';
		version = nAgt.substring(verOffset + 4);
	}
	// Edge
	else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
		browser = 'Microsoft Edge';
		version = nAgt.substring(verOffset + 5);
	}
	// MSIE
	else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(verOffset + 5);
	}
	// Chrome
	else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
		browser = 'Chrome';
		version = nAgt.substring(verOffset + 7);
	}
	// Safari
	else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
		browser = 'Safari';
		version = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf('Version')) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Firefox
	else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
		browser = 'Firefox';
		version = nAgt.substring(verOffset + 8);
	}
	// MSIE 11+
	else if (nAgt.indexOf('Trident/') != -1) {
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(nAgt.indexOf('rv:') + 3);
	}
	// Other browsers
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
		browser = nAgt.substring(nameOffset, verOffset);
		version = nAgt.substring(verOffset + 1);
		if (browser.toLowerCase() == browser.toUpperCase()) {
			browser = navigator.appName;
		}
	}
	// trim the version string
	if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);


	if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);
	majorVersion = parseInt('' + version, 10);
	if (isNaN(majorVersion)) {
		version = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}
	// mobile version
	var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
	// system
	var os = unknown;
	var clientStrings = [{
		s: 'Windows 10',
		r: /(Windows 10.0|Windows NT 10.0)/
	}, {
		s: 'Windows 8.1',
		r: /(Windows 8.1|Windows NT 6.3)/
	}, {
		s: 'Windows 8',
		r: /(Windows 8|Windows NT 6.2)/
	}, {
		s: 'Windows 7',
		r: /(Windows 7|Windows NT 6.1)/
	}, {
		s: 'Windows Vista',
		r: /Windows NT 6.0/
	}, {
		s: 'Windows Server 2003',
		r: /Windows NT 5.2/
	}, {
		s: 'Windows XP',
		r: /(Windows NT 5.1|Windows XP)/
	}, {
		s: 'Windows 2000',
		r: /(Windows NT 5.0|Windows 2000)/
	}, {
		s: 'Windows ME',
		r: /(Win 9x 4.90|Windows ME)/
	}, {
		s: 'Windows 98',
		r: /(Windows 98|Win98)/
	}, {
		s: 'Windows 95',
		r: /(Windows 95|Win95|Windows_95)/
	}, {
		s: 'Windows NT 4.0',
		r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
	}, {
		s: 'Windows CE',
		r: /Windows CE/
	}, {
		s: 'Windows 3.11',
		r: /Win16/
	}, {
		s: 'Android',
		r: /Android/
	}, {
		s: 'Open BSD',
		r: /OpenBSD/
	}, {
		s: 'Sun OS',
		r: /SunOS/
	}, {
		s: 'Linux',
		r: /(Linux|X11)/
	}, {
		s: 'iOS',
		r: /(iPhone|iPad|iPod)/
	}, {
		s: 'Mac OS X',
		r: /Mac OS X/
	}, {
		s: 'Mac OS',
		r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
	}, {
		s: 'QNX',
		r: /QNX/
	}, {
		s: 'UNIX',
		r: /UNIX/
	}, {
		s: 'BeOS',
		r: /BeOS/
	}, {
		s: 'OS/2',
		r: /OS\/2/
	}, {
		s: 'Search Bot',
		r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
	}];
	for (var id in clientStrings) {
		var cs = clientStrings[id];
		if (cs.r.test(nAgt)) {
			os = cs.s;
			break;
		}
	}
	/*var osVersion = unknown;
	if (/Windows/.test(os)) {
		osVersion = /Windows (.*)/.exec(os)[1];
		os = 'Windows';
	}
	switch (os) {
		case 'Mac OS X':
			osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt);
			break;
		case 'Android':
			osVersion = /Android ([\.\_\d]+)/.exec(nAgt);
			break;
		case 'iOS':
			osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
			osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
			break;
	}*/
	window.jscd = {
		screen: screenSize,
		browser: browser,
		browserVersion: version,
		browserMajorVersion: majorVersion,
		mobile: mobile,
		os: os,
	//	osVersion: osVersion,
	};
	user.device = window.jscd;
	//detect device type
	if (/windows phone/i.test(nAgt)) {
		user.device.deviceType = "Windows Phone";
	} else if (/android/i.test(nAgt)) {
		user.device.deviceType = "Android";
	} else if (/iPad|iPhone|iPod/.test(nAgt) && !window.MSStream) {
		user.device.deviceType = "iOS";
	} else {
		user.device.deviceType = "web";
	}
	// console.log("This is what so far i fetched", user.device)

	return user.device.os;
}







