(function() {
	return {
		IDS_TITLE: 								"Import Certificate",
		IDS_CONTENT_NOTICE_UL: 					[
			"Click here to select a certificate file ,",
			"drag and drop a certificate file to save and use the certificate in your browser.",
			"",
			"※Supportable certificate files※",
			"⑴ *.pfx file or *.p12 file (1 file)",
			"⑵ signCert.cer and signPri.key files (2 files)",
			"⑶ kmCert.cer and kmPri.key files (2 files)",
			"§ Both * .cer files and * .der files are available"
		],
		IDS_CONTENT_DROP_UL:					[
			"Please leave it here."
		],
		IDS_CERT_INFO:							{
			name: 'name',
			expire: 'Expiration date',
			issuer: 'Issuer',
			password: 'Certificate password'
		},
		IDS_ERROR:								{
			'INPUT_PASSWORD':		"Please enter your certificate password.",
			'NO_MATCH_PASSWORD':		"Certificate password is invalid.",
			'INVALID_FILE_COUNT':	"Invalid number of files.",
			'NO_P12_FILE':			"Only single files * .pfx or * .p12 files are supported.",
			'UNSUPPORT_FILE':		"This file is not supported.",
			
			'NO_SIGNCERT':			"SignCert file is not selected.",
			'NO_SIGNPRIKEY':			"signPri.key file is not selected.",
			'NO_KMCERT':			"kmCert file is not selected.",
			'NO_KMPRIKEY':			"kmPri.key file is not selected."
		},
		IDS_PFX_DOWNLOAD: 						"PFX file download",
		IDS_CERT_IMPORT:						"Get this certificate",
		IDS_RE_TRY:								"Retry",
		
		IDS_CONFIRM: 							"confirm",
		IDS_CLOSE: 								"close",
		IDS_CANCEL: 							"cancel",
		IDS_MSGBOX_CAPSLOCK_ON: 							" is turned on"		
	}
})();
