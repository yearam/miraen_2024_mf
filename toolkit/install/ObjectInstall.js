

var UniCRSInstall = function(customObj){
	var isInstall = {unicrs:false};
	// OS
	var OSTYPE_WIN32					= "Win32";
	var OSTYPE_WIN64					= "Win64";
	var OSTYPE_MAC						= "MAC";
	var OSTYPE_UNKNOWN                  = "Unknown";
	var Client_OS						= "Win32";

	if(navigator.platform == OSTYPE_WIN32) Client_OS = OSTYPE_WIN32;
	else if(navigator.platform == OSTYPE_WIN64) Client_OS = OSTYPE_WIN64;
	else if(navigator.platform == "MacIntel") Client_OS = OSTYPE_MAC;
	else Client_OS = OSTYPE_UNKNOWN;

	var unicrsVersion = "2.0.17.0";
	var unicrsSrc = "https://127.0.0.1:15018";

	var mainPageUrl = "../unisignweb_document/index.html";
	var chkCount = 0;
	var versionCheck = false;
	var cntAdd = 0;
	var sessionID = Math.random();
	
	function parseInt(s){
		var ver = s.replace(/\./g, "");
		return ver * 1;
	}
	
	function fnInstallOKGo(){
		if(isInstall.unicrs == true){
			setTimeout(function(){document.location.href = mainPageUrl;}, 500);
		}else{
			setTimeout(fnInstallOKGo, 1000);
		}
	}
	
	function statusMsg(txt, cnt){
		if(cnt) for(var i=0; i<cnt; i++) txt += ".";
		customObj.progress( txt );
	}
	
	function isUpdate(ver){
		var lastestVersion = unicrsVersion;
		var l = lastestVersion.split('.'), 
		c = ver.split('.'), len = Math.max(l.length, c.length);
		
		for(var i=0; i<len; i++){
			if ((l[i] && !c[i] && parseInt(l[i]) > 0) || (parseInt(l[i]) > parseInt(c[i]))) {
	            return true;
	        } else if ((c[i] && !l[i] && parseInt(c[i]) > 0) || (parseInt(l[i]) < parseInt(c[i]))) {
	        	return false;
	        }
		}
		return false;
	}
	
	var UniCRSChecker = function(){
		var isFirst = true;
		var fnResult2 = function(obj, r){
			if(obj && obj.parentNode) obj.parentNode.removeChild(obj);
			var fnlogic = function(){				
				if(isFirst){
					//isFirst = false;
					if(r){
						statusMsg("설치된 인증서 관리프로그램 버전 확인중", chkCount);
						
						var j = document.createElement('script');
						var url = unicrsSrc + "/VER?" + customObj.options.callerName + ".UniCRSVersion";
						
						j.setAttribute('src', url);
						j.setAttribute('type', 'text/javascript');
						
						document.getElementsByTagName('body')[0].appendChild(j);
					}else{
						if(navigator.userAgent.indexOf("Firefox") > -1){
							customObj.fail(-99, '설치안됨', "인증서 관리 프로그램이 설치되어있지 않거나 실행중이 아닙니다<br>FireFox 브라우져일 경우 설치후 브라우져를 재시작 하셔야 합니다.");
						}else if (navigator.userAgent.indexOf("MSIE 7.0") > -1 && navigator.userAgent.indexOf("compatible") < 0) {
							customObj.fail(-98, '설치안됨', "사용중인 IE7 브라우져에서는 동작하지 않습니다. 타 브라우져 또는 IE버전을 업데이트 하시길 바랍니다.");
						} else {
							customObj.fail(-90, '설치안됨', "인증서 관리 프로그램이 설치되어있지 않거나 실행중이 아닙니다<br><br>실행하시기 바랍니다.");
						}
						setTimeout(UniCRSChecker, 1000);
					}
				}
			}
			setTimeout(fnlogic, 200);
		}

		var chkImg;
		if (navigator.userAgent.indexOf("MSIE 7.0") != -1) {
			chkImg = document.createElement("<img id='uniImg' src='"+unicrsSrc + '/CRS?cd=' + Math.random() + "' onload='fnResult2(this, true)' onerror='fnResult2(this, false)' />");
			chkImg.onerror = function() {fnResult2(chkImg, false);};
			chkImg.onload = function() {fnResult2(chkImg, true);};
			chkImg.style.display = "none";
		} else {
			chkImg = document.createElement('img');
			chkImg.setAttribute('id', "uniImg");
			chkImg.setAttribute('src', unicrsSrc + '/CRS?cd=' + Math.random());
			chkImg.onerror = function() {fnResult2(chkImg, false);};
			chkImg.onload = function() {fnResult2(chkImg, true);};
			chkImg.style.display = "none";
		}
		document.body.appendChild(chkImg);
		setTimeout(function(){}, 200);
	}
	
	UniCRSChecker();
	
	return {
		info:{
			version: unicrsVersion
		},
		UniCRSVersion : function(data){
			var currentVersion = data.split(":")[1];
			var cv = currentVersion.split('.');
			currentVersion = cv[0] + '.' + cv[1] + '.' + cv[2] + '.' + cv[3];
			
			if( isUpdate(currentVersion) ){
				customObj.fail(-80, '업데이트 필요('+currentVersion+')', "인증서 관리 프로그램이 최신버전이 아닙니다.<br>최신버전으로 설치해주시기바랍니다.<br><br>");
				setTimeout(UniCRSChecker, 2000);
			}else{
				isInstall.unicrs = true;
				customObj.success();
			}
		}
	}
};




