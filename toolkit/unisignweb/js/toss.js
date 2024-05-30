/**
 * @author crosscert
 * @version 1.0.1
 * @update 2020.10.12
 * @description
 * [2020.10.12] Toss 인증 및 본인확인 및 전자서명을 위한 라이브러리
 */
var __crosscerttoss = function( __SANDBOX ) {

	var crosscert =  __SANDBOX.usWebToolkit;
	var SANDBOX = __SANDBOX;
	var clientID = "4611ea0a9f78781b68e2208e371ce355";
	var clientSecret = "d56cb9c26f1f24e51dda2bc8aa7c4ab74bb1dae1260134813c23a3e30b3cdf95";

	var tossURL = __SANDBOX.ESVS.tossURL?__SANDBOX.ESVS.tossURL:"https://cert-alpha.toss.im";
	
	var errormsg = "일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.";
	var esdownmsg = "[이지싸인] 앱 다운로드 링크를 문자로 발송했습니다.\n휴대폰에서 확인해 주세요.";
	var csdownmsg = "[클라우드사인] 앱 다운로드 링크를 문자로 발송했습니다.\n휴대폰에서 확인해 주세요.";

	function doXHRObject(url, req, callbackFUNC) {
		var myRep = {};
		// TODO: DELETE LATER
		// --------------------------------------- /
		// document.getElementById('reqData').value = '';
		// document.getElementById('resData').value = '';
		// document.getElementById('reqData').value = req;
		// --------------------------------------- /
		var originalReq = JSON.parse(req);
		if (url == undefined) {
			myRep.operation = originalReq.operation;
			myRep.messageNumber = originalReq.messageNumber;
			myRep.resultCode = '0051';
			myRep.resultMessage = 'Initialization failed, please check server url.';
			// TODO: DELETE LATER
			// --------------------------------------- /
			// document.getElementById('resData').value = JSON.stringify(myRep);
			// --------------------------------------- /
			callbackFUNC(JSON.stringify(myRep));
			return;
		}
		var xhr = createCORSRequest('POST', url);
		if (!xhr) {
			throw new Error('CORS not supported');
		}
		;
		xhr.onload = function() {
			// TODO: DELETE LATER
			// --------------------------------------- /
			// document.getElementById('resData').value = xhr.responseText;
			// --------------------------------------- /
			callbackFUNC(xhr.responseText);
		};
		xhr.onerror = function() {
			myRep.operation = originalReq.operation;
			myRep.messageNumber = originalReq.messageNumber;
			myRep.resultCode = '0052';
			myRep.resultMessage = 'unexpected answer from Security Server :'
					+ xhr.status;
			// TODO: DELETE LATER
			// --------------------------------------- /
			document.getElementById('resData').value = JSON.stringify(myRep);
			// --------------------------------------- /
			callbackFUNC(JSON.stringify(myRep));
		};
		xhr.send(req);
	};

	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ('withCredentials' in xhr) {
			xhr.open(method, url, true); // async(option) : true/false
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		} else if (typeof XDomainRequest != 'undefined') {
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		}
		return xhr;
	};


	return {
		reqGetAccessToken : function() {
			/* Auth token 을 이용한 Access Token 획득
			 /api/auth/token
			 Header 
				Authorization : Basic + " " + Base64(clientID:clientSecret)
				Content-Type : application/x-www-form-urlencoded
			 Body
				grant_type=client_credentials
			 response
				{
					"access_token":"a4821aad-6b07-468a-9cf3-66602e5146e1",
					"token_type":"bearer",
					"scope":"read write"
				}
			
			*/
		},
		reqLogin : function(accessToken) {
			/*  간편 로그인 진행
			 /api/v1/sign/login/request
			 Header 
				Authorization : Bearer + " " + Base64(accessToken)
				Content-Type : application/json
			 Body
				{ "serviceName" : "간편로그인 테스트",	"triggerType" : "PUSH"}
			
			 response
				{
					"resultType": "SUCCESS",
					"success": {
						"txId": "ee86e2d0-a22c-411b-a4a3-6d7a2e4f373e",
						"requestedDt": "2020-05-27T12:10:47+09:00"
					}
				}

			*/
		},
		reqCheck : function(accessToken, txId) {
			/*  간편 로그인 상태 체크
			 /api/v1/sign/login/check
			 Header 
				Authorization : Bearer + " " + Base64(accessToken)
				Content-Type : application/json
			 Body
				{ "txId" : txId}
			 response
				status : REQUESTED, IN_PROGRESS, COMPLETED, EXPIRED
				{
					"resultType": "SUCCESS",
					"success": {
						"txId": "06b589da-cbdb-45aa-ad67-2826361ac8c2",
						"status": "IN_PROGRESS",
						"requestedDt": "2020-05-27T12:15:23+09:00"
					}
				}
			*/
		},
		reqResult : function(accessToken,txId) {
			/*  간편 로그인 결과
			 /api/v1/sign/login/result
			 Header 
				Authorization : Bearer + " " + Base64(accessToken)
				Content-Type : application/json
			 Body
				{ "txId" : txId}
			 response
				{
					"resultType": "SUCCESS",
					"success": {
						"txId": "06b589da-cbdb-45aa-ad67-2826361ac8c2",
						"status": "COMPLETED",
						"name": "김토스",
						"phone": "01012345678",
						"birthday": "19910301",
						"gender": "MALE",
						“authorizationCode”: “......”,
						"identifier": "50066179726…...",
						"completedDt": "2020-05-27T12:19:58+09:00",
						"requestedDt": "2020-05-27T12:15:23+09:00"
					}
				}
			*/
		
		}
		
	}
};