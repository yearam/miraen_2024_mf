(function() {
	return {
		IDS_TITLE: 								"인증서 가져오기",
		IDS_CONTENT_NOTICE_UL : [
			"이곳을 클릭하거나 끌어다 놓기를 이용하여",
			"*.pfx,    *.p12 파일 또는",
			"인증서 파일(signCert.der, signPri.key) 1쌍을",
			"가져와서 사용하실 수 있습니다.",
			"※ 인증서 파일(signCert.der, signPri.key) 선택 시",
			"같은 위치에 kmCert.der, kmPri.key도 있으면",
			"같이 가져와서 사용할 수 있습니다."
		],
		IDS_CONTENT_DROP_UL:					[
			"여기에 놓아 주세요."
		],
		IDS_CERT_INFO:							{
			name: '이름',
			expire: '만료일',
			issuer: '발급자',
			password: '인증서 비밀번호'
		},
		IDS_ERROR:								{
			'INPUT_PASSWORD':		"인증서 비밀번호를 입력하세요.",
			'NO_MATCH_PASSWORD':		"인증서 비밀번호가 올바르지 않습니다.",
			'INVALID_FILE_COUNT':	"잘못된 파일 개수 입니다.",
			'NO_P12_FILE':			"단일 파일로는 *.pfx 또는 *.p12 파일만 지원합니다.",
			'UNSUPPORT_FILE':		"지원하지 않는 파일입니다.",
			
			'NO_SIGNCERT':			"signCert 파일이 선택되지 않았습니다.",
			'NO_SIGNPRIKEY':			"signPri.key 파일이 선택되지 않았습니다.",
			'NO_KMCERT':			"kmCert 파일이 선택되지 않았습니다.",
			'NO_KMPRIKEY':			"kmPri.key 파일이 선택되지 않았습니다."
		},
		IDS_PFX_DOWNLOAD: 						"PFX 파일 다운로드 하기",
		IDS_PFX_SAVETO: 						"저장매체에 저장 하기",
		IDS_CERT_IMPORT:						"이 인증서 가져오기",
		IDS_RE_TRY:								"다시하기",
		
		IDS_CONFIRM: 							"확인",
		IDS_CLOSE: 								"닫기",
		IDS_CANCEL: 							"취소",
		IDS_MSGBOX_CAPSLOCK_ON: 							" 이 켜져있습니다."		
	}
})();
