(function() {
	return {
		IDS_CERT_SELECTION: 								"인증서 선택",
		IDS_CERT_SELECTION_PURPOSE_SIGN: 					"(전자서명)",
		IDS_CLOSE_CERT_SELECTION_CLOSE: 					"인증서 선택창 종료",
		IDS_LOGO: 											"한국전자인증 로고 이미지",
		IDS_STORAGE_SELECT: 								"저장매체선택",
		IDS_STORAGE_REMOVABLE: 								"이동식디스크",
		IDS_STORAGE_SECTOKEN: 								"보안토큰",
		IDS_STORAGE_SAVETOKEN: 								"저장토큰",
		IDS_STORAGE_MOBILEPHONE: 							"휴대폰",
		IDS_STORAGE_HARDDISK: 								"하드디스크",

		IDS_STORAGE_MOBILETOKEN: 							"스마트인증",
		IDS_STORAGE_SECUREDISK: 							"안전디스크",			
		//		
		IDS_STORAGE_LS:                                     "웹스토리지",
		IDS_STORAGE_SS:                                     "브라우저사인",		
		IDS_STORAGE_TOUCHSIGN :                             "터치싸인",
		IDS_STORAGE_SMARTSIGN :                             "스마트인증",
		IDS_STORAGE_WEBSECTOKEN :                           "웹보안토큰",
		IDS_STORAGE_WEBSOFTTOKEN :                          "소프트보안토큰",
		IDS_STORAGE_CLOUDSIGN :              				"클라우드사인",	
		IDS_STORAGE_CLOUD : 								"클라우드",		
		IDS_STORAGE_ETC :                                   "미지원매체",
		IDS_STORAGE_SELECTED :                              "선택 됨",
		IDS_H5_STORAGE:										"저장매체를 선택하세요",
		IDS_H5_LIST:										"사용할 인증서를 선택하세요",
		IDS_CERT_SELECTED: 									"인증서 선택됨",

		IDS_CERT_LIST_TABLE_SUMMARY: 						"인증서 선택 리스트입니다",
		IDS_CERT_LIST_CAPTION: 								"이 리스트는 상태, 구분, 사용자, 발급자, 만료일로 구성되어 있는 인증서 리스트 입니다",
		IDS_CERT_TYPE: 										"타입",
		IDS_CERT_SUBJECT: 									"발급 대상",
		IDS_CERT_ISSUER: 									"발급자",
		IDS_CERT_EXPIRATION_DATE: 							"만료 날짜",
		IDS_CERT_EXPIRATION_STATE: 							"만료 여부",
		IDS_CERT_GET: 										"인증서 가져오기",
		
		IDS_CERT_STATUS:                                    "상태",
		IDS_CERT_CLASSIFY:                                  "구분",
		IDS_CERT_USER:                                      "사용자",
		IDS_CERT_EXPIRATION_DAY:                            "만료일",
		
		IDS_CERT_GRID_VALID:								"유효한 인증서",
		IDS_CERT_GRID_INVALID:								"유효하지 않은 인증서",
		IDS_CERT_GRID_MONTH_EXPIER:							"인증서 만료 임박",

		IDS_BUTTON: 										"버튼",
		IDS_CERT_SEARCH: 									"인증서 찾기",
		IDS_PASSWORD: 										"인증서 비밀번호",
		IDS_PASSWORD_LABEL: 								"인증서 비밀번호를 입력하세요.",
		IDS_PASSWORD_DESCRIPTION:                           "(인증서 비밀번호는 대소문자를 구분합니다.)",
		IDS_PIN_DESCRIPTION:                          		" (스마트폰 화면에 출력된 PIN 번호를 입력하세요.)",
		IDS_PIN: 											"PIN",
		IDS_CONFIRM: 										"확인",
		IDS_CERT_VERIFY: 									"인증서 검증",
		IDS_CERT_VIEW: 										"인증서 보기",
		IDS_CERT_MANAGE:                                    "인증서 관리",		
		IDS_CERT_PROPOSAL: 									"비대면 인증서 신청",
		IDS_CLOSE: 											"취소",
		IDS_NOTICE: 										"",
		IDS_LINK_TITLE:										"새창열림",
		
		IDS_STORAGE_MORE_VIEW : "추가 저장매체 보기",
		IDS_STORAGE_MORE_VIEW_SHOW: "열기",
		IDS_STORAGE_MORE_VIEW_HIDDEN: "닫기",
		
		IDS_SAVETOKEN_SMART_CARD: 							"스마트카드",
		IDS_SAVETOKEN_USB_TOKEN: 							"USB 토큰",
		
		IDS_SENSE_READER_INTRO:                             "인증서 선택(전자서명) 레이어가 열렸습니다. 센스리더 사용자는 원활한 사용을 위해 가상커서를 해제해주시기 바랍니다. 가상커서는 현재 위치에서 엔터키를 입력하면 해제됩니다.",
		
		IDS_MSGBOX_NOT_INSTALL_VESTCERT:					"인증서 이용 프로그램(exe)의 설치가 되지 않았습니다.\n설치페이지로 이동합니다.",

		IDS_MSGBOX_NOT_INSTALL_SMARTCERT:					"스마트 인증 프로그램의 설치 및 업데이트가 필요합니다.설치페이지로 이동합니다.\n\n스마트 인증 프로그램의 설치가 완료되면 인증서 선택창에서 스마트인증을 선택 바랍니다.",
		
		IDS_MSGBOX_COMMON_ERROR_GET_CERT:					"인증서 획득에 실패하였습니다.",
		IDS_MSGBOX_COMMON_ERROR_NO_SELECTED_CERT: 			"선택된 인증서가 없습니다. 인증서를 선택하여 주십시오.",
		
		IDS_MSGBOX_PW_ERROR_INPUT_WRONG_SEC_TOKEN_PIN:      "보안토큰 PIN이 올바르지 않습니다.\n지문보안토큰은 초기비밀번호가 00000000 입니다.\n초기비밀번호 불일치 시 제조사 사이트 통해 PIN번호 초기화 후 복사하세요",
		IDS_MSGBOX_PW_ERROR_INPUT_WRONG_SAVE_TOKEN_PIN:     "저장토큰 PIN이 올바르지 않습니다.\n지문보안토큰은 초기비밀번호가 00000000 입니다.\n초기비밀번호 불일치 시 제조사 사이트 통해 PIN번호 초기화 후 복사하세요",
		IDS_MSGBOX_PW_ERROR_SEC_TOKEN_PIN_LOCKED:           "PIN 입력 오류 횟수 제한으로 보안토큰이 잠겼습니다.\n토큰 제조사에 문의하시기 바랍니다.",
		IDS_MSGBOX_PW_ERROR_SAVE_TOKEN_PIN_LOCKED:          "PIN 입력 오류 횟수 제한으로 저장토큰이 잠겼습니다.\n토큰 제조사에 문의하시기 바랍니다.",
		IDS_MSGBOX_PW_ERROR_PLEASE_INPUT_PASSWORD: 			"비밀번호를 입력 하십시오.",
		IDS_MSGBOX_PW_ERROR_PASSWORD_IS_NOT_MATCHED: 		"인증서 비밀번호가 올바르지 않습니다.",
		IDS_MSGBOX_PW_ERROR_OVER_NUMBER_OF_ALLOWED_BEFORE: 	"비밀번호 입력 허용횟수(",
		IDS_MSGBOX_PW_ERROR_OVER_NUMBER_OF_ALLOWED_AFTER: 	"회)를 초과하였습니다.",
		IDS_MSGBOX_FILE_ERROR_READ: 						"파일 읽기에 실패하였습니다.",
		IDS_MSGBOX_FILE_ERROR_NOT_PFX: 						"PFX 또는 P12 확장자를 가진 파일이 아닙니다.",
		IDS_MSGBOX_HSM_ERROR_CONNECTION: 					"보안토큰을 찾을 수 없습니다.\n 보안토큰을 PC와 다시 연결한 후 제품명을 올바르게 선택하세요.",
		IDS_MSGBOX_PLUGIN_ERROR_UNLOAD: 					"UniSignWeb Plug-In 이 장시간 미사용 등의 이유로 언로드 되었습니다.\n페이지 새로 고침을 하시거나 첫 페이지로 이동하셔서 재시도 해주십시오.",

		IDS_MSGBOX_NIM_ERROR_UNLOAD: 						"UniCRSLocalServer가  언로드 되었습니다.\n페이지 새로 고침을 하시거나 첫 페이지로 이동하셔서 재시도 해주십시오.",
		
		
		IDS_MSGBOX_SIGN_ERROR: 								"전자서명에 실패하였습니다.",
		IDS_MSGBOX_RENEW_ERROR: 							"인증서를 갱신 중 오류가 발생하였습니다.",
		IDS_MSGBOX_VID_SUCCESS_VERIFICATION: 				"인증서의 신원확인 검증에 성공하였습니다.",
		IDS_MSGBOX_VID_ERROR_VERIFICATION: 					"인증서의 신원확인 검증에 실패하였습니다. 인증서의 주민등록번호 또는 사업자번호와 일치하지 않습니다.",
		IDS_MSGBOX_SMART_CARD_UNCONNECTED:                  "스마트카드가 올바로 인식되지 않았습니다.\n"
		                                                    + "스마트카드 리더기의 드라이버가 정상적으로 설치되었는지\n"
		                                                    + "와 리더기가 올바로 꽂혀있는지 확인하십시오.",
		
		IDS_MSGBOX_SEARCH_CERT_GUIDE_FOR_SAFARI: 			"Safari 6.0 미만의 버전에서는 인증서 찾기 기능이 지원되지 않습니다.\n"
															+ "해당 기능을 사용하시기 위해서는 Safari 6.0 이상의 버전으로\n"
															+ "업데이트 하시거나 타브라우저로 접속하여 주시기 바랍니다.",
		
		IDS_MSGBOX_SEARCH_CERT_GUIDE_FOR_IE9: 				"인터넷 익스플로러의 보안 설정으로 파일 경로를 읽지 못하였습니다.\n"
															+ "인터넷 익스플로러 9.0에서 인증서 찾기 기능을 사용하기 위해서는\n"
															+ "보안 설정을 변경해 주시기 바랍니다.\n\n"
															+ "1. 인터넷 익스플로러 > [ 도구 ] > [ 인터넷 옵션 ]을 클릭합니다\n\n"
															+ "2. 인터넷 옵션 > [ 보안 ] > [ 사용자 지정 수준(C) ]버튼을 클릭합니다.\n\n"
															+ "3. 파일을 서버에 업로드할 때 로컬 디렉터리 경로 포함 -> 사용 으로 수정합니다.\n\n"
															+ "4. 인증서 찾기 기능을 재수행 해주시기 바랍니다.",

        IDS_MSGBOX_NOT_SUPPORTED_MEDIA: 			        "지원되지 않는 저장매체입니다.",
        IDS_MSGBOX_NOT_MORE_MEDIA: 			                "추가 저장매체 정보가 없습니다.",
        
		IDS_CONFIRMBOX_CERT_RENEWAL: 						"선택된 인증서를 갱신하시겠습니까?",
		IDS_CONFIRMBOX_KMCERT_ISSUE: 						"선택된 인증서의 암호화용 인증서를 발급하시겠습니까?",
															
		IDS_CONFIRMBOX_CERT_REVOCATION: 					"인증서를 폐지한 이후에는 다시 사용할 수 없습니다.\n"
															+ "폐지된 이후에 인증서가 필요하실 경우 신규로 신청 후\n"
															+ "수수료 결재 및 구비서류 제출절차를 진행해야 합니다.\n"
															+ "선택된 인증서를 폐지하시겠습니까?",
															
		IDS_CONFIRMBOX_CERT_SOE: 							"인증서를 효력정지한 이후에는 다시 사용할 수 없습니다.\n"
															+ "재사용을 위해서는 효력회복을 신청하셔야 하며 효력회복은\n"
															+ "구비서류 제출 및 신원확인절차를 진행해야 합니다.\n"
															+ "선택된 인증서를 효력정지 하시겠습니까?\n"
															+ "(효력정지는 최대 6개월까지 유효하며, 이후 신규처리 됩니다.)",
															
	    IDS_MSGBOX_PW_ERROR_PASSWORD_IS_NOT_MATCHED_URS:    "인증서 비밀번호가 맞지 않습니다. \n키보드 보안 프로그램 적용 체크 해제 후 재시도 해보십시오.",
	    IDS_MSGBOX_NOT_INSTALL_SD: 							"안전디스크 모듈이 설치되지 않았습니다.\n설치 후에 서비스 이용하시기 바랍니다.",
		IDS_CONFIRMBOX_NOT_INSTALL_SD: 							"안전디스크 모듈이 설치되지 않았습니다.\n안전디스크 모듈 설치 페이지로 이동하시겠습니까?",
		
        IDS_CANT_WORK_WITH_PFX:								"PFX 파일로 원하시는 작업 진행 불가합니다. \n인증서 가져오기를 진행 하신 후 저장된 인증서로 원하시는 작업 진행하시기 바랍니다.",
		IDS_CANT_ISSUECERT_BIOTOKEN:						"발급 및 갱신, 재발급시 지문보안토큰을 이용할 수 없습니다.\n다시 선택해 주시기 바랍니다.",
		
		IDS_MSGBOX_CAPSLOCK_ON: 							" 이 켜져있습니다.",
		
	    IDS_CONFIRMBOX_NOT_INSTALL_SMARTCERT: 				"스마트인증 모듈이 설치되지 않았습니다.\n스마트인증 모듈 설치 페이지로 이동하시겠습니까?",
	    
		IDS_MSGBOX_NOT_INSTALL_MOBILE:						"휴대폰 인증 서비스 모듈이  설치가 되지 않았습니다.\n설치 후에 서비스 이용하시기 바랍니다.",	    
	    IDS_MSGBOX_NOT_INSTALL_MOBILE_CFM:					"휴대폰 인증 서비스 모듈이  설치가 되지 않았습니다.\n설치페이지로 이동하시겠습니까?",
	    
	    IDS_MSGBOX_BLOCK_POPUP_WINDOW:						"설치페이지 open 실패했습니다.\n팝업이 차단되어 있는지 확인하시기 바랍니다.",	 	
		IDS_MSGBOX_DOUBLE: 		"클라우드인증서는 하나의 서비스만 이용 가능 합니다.",
		IDS_MSGBOX_JOIN: 		"클라우드인증서 서비스에 가입되어 있지 않습니다.\n서비스를 가입 후 이용하여 주시기 바랍니다.",
		IDS_LINK_RAADMIN:		"https://raadmin.crosscert.com/customer/tk/Main.jsp?"		    		
	}
})();
