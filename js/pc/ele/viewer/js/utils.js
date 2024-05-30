(function () {
    if (typeof window.CustomEvent === "function") return false; //If not IE

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

let IS_IE = undefined;
function detect_is_msie() {
    if(IS_IE != undefined) {
        return IS_IE;
    }1
    let agent = navigator.userAgent.toLowerCase();
     if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
        // ie일 경우
        IS_IE = true;
    }else{
        // ie가 아닐 경우
        IS_IE = false;
    }
    return IS_IE;
}
function toggleFullScreen() {
    let doc = window.document;
    let docEl = doc.documentElement;
  
    let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}

function document_cancelFullScreen() {
    let doc = window.document;
    let docEl = doc.documentElement;
  
    let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      //requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}

let DEVICE_TYPE = null;
function detect_mobile_device_type() {
    try {
        let md = new MobileDetect(window.navigator.userAgent);
        if (md.tablet()) {
            DEVICE_TYPE = 'tablet';
        } else if (md.mobile()) {
            DEVICE_TYPE = 'mobile';
        }    
    } catch (error) {
    }
    
    return DEVICE_TYPE;
}
function get_device_type() {
	if(typeof(DEVICE_TYPE) === 'undefined' || window.DEVICE_TYPE == undefined) {
		try {
			window.DEVICE_TYPE = viewer._device_type;
		} catch (error) {	
            window.DEVICE_TYPE = detect_mobile_device_type();
		}
	}
	return window.DEVICE_TYPE;
}
function custom_prevent_event(e) {
	try {
		if(get_device_type() == '') {
			e.preventDefault();	
		}
	} catch (error) {
		e.preventDefault();
	}
}
function convert_touch_event(e) {
    let touches = undefined;
    if(e.touches) {
        touches = e.touches;
    } else if(e.originalEvent && e.originalEvent.touches) {
        touches = e.originalEvent.touches;
    }
	if(touches && touches.length > 0) {
        let touch = touches[0];
        try {
            e.pageX = touch.pageX;
            e.pageY = touch.pageY;
            e.clientX = touch.clientX;
            e.clientY = touch.clientY;
        } catch (error) {
        }		
	}
	return e;
}

function parseQueryString(query) {
    let parts = query.split('&');
    let params = {};
    for (let i = 0, ii = parts.length; i < ii; ++i) {
        let param = parts[i].split('=');
        let key = param[0].toLowerCase();
        let value = param.length > 1 ? param[1] : null;
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return params;
}

function get_version_of_IE() {
    let word;
    let agent = navigator.userAgent.toLowerCase();
    // IE old version ( IE 10 or Lower ) 
    if (navigator.appName == "Microsoft Internet Explorer") word = "msie ";
    // IE 11 
    else if (agent.search("trident") > -1) word = "trident/.*rv:";
    // Microsoft Edge  
    else if (agent.search("edge/") > -1) word = "edge/";
    // 그외, IE가 아니라면 ( If it's not IE or Edge )  
    else return -1;

    let reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
    if (reg.exec(agent) != null) return parseFloat(RegExp.$1 + RegExp.$2);
    return -1;
}
let setCookie = function (name, value, day) {
    let date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};
let getCookie = function (name) {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
};
let deleteCookie = function (name) {
    let date = new Date();
    document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}


function is_mobile() {
    let filter = "win16/win32/win64/mac/macintel";
    if (navigator.platform) {
        return filter.indexOf(navigator.platform.toLowerCase()) < 0;
    }
    return false;
}

// 작동되는 진동 메소드가 다르므로 통합
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

function vibrate(ms) {
    if (navigator.vibrate) {
        if (!ms) {
            ms = 100;
        }
        navigator.vibrate(ms); // 진동을 울리게 한다. 1000ms = 1초
    } else {
        // alert("진동을 지원하지 않는 기종 입니다.");
    }
}

function mute_all_media($iframeele, muted) {
    try {
        let avs = $iframeele.contents().find("audio, video");
        for (let index = 0; index < avs.length; index++) {
            avs[index].muted = muted;
        }
    } catch (error) {
        console.log(error);
    }
}

function stop_all_media($iframeele) {
    try {
        let avs = $iframeele.contents().find("audio, video");
        for (let index = 0; index < avs.length; index++) {
            avs[index].pause();
        }
    } catch (error) {
        console.log(error);
    }
}

function download_file(url, file_title) {
    let link = document.createElement('a');
    link.href= url;
    link.click();
    link.remove();
}

function get_error_message(err) {
    console.error(err);
    let err_msg = err;
    if (typeof (err) === 'string') {
        err_msg = err;
    } else {
        if (typeof (err) === 'object') {
            if (err["message"]) {
                err_msg = err["message"];
            } else if(err["errorMessage"]) {
                err_msg = '에러가 발생했습니다.';
            } else if (err["statusText"]) {
                err_msg = err["statusText"];
                if (err_msg == 'timeout') {
                    err_msg = '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.';
                } else if (err_msg == 'error') {
                    err_msg = '서버에서 오류가 발생했습니다. 계속 발생되면 자세한 사항을 관리자에게 문의부탁드립니다.';
                }
            } else {
                err_msg = err.toString();
            }
        } else {
            err_msg = err.toString();
        }
    }
    return err_msg;
}

function show_error_message(err, _cb) {
    let err_msg = get_error_message(err);
    // console.log(err_msg);
    show_alert(err_msg, _cb);
}

function show_alert(message, _cb) {
    if (!vex) {
        alert(message);
        _cb && _cb();
        return;
    }

    vex.dialog.alert({
        message: message,
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: '확인' })
        ],
        callback: function () {
            _cb && _cb();
        }
    });
}

function guid() {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};