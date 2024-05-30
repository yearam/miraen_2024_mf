
var extendWindowName = "extendWindow";
var extendWindow; //확장 윈도우
var connListWindow;
var roomsWin;
var userid;
var page_json;

var url = "http://localhost:8100/"
var socket;
var last_sync_data;


if(window.name != extendWindowName) {
    socket = io(url,{
        transports: ['websocket']
        , path: '/viewer/socket.io'
    });
}


var apiModule = (function () {

    return {
        //CMS통신API
        cmsApi :
            (function () {

                var defaultUrl = ""

                //CMS 로부터 GET
                function get (url) {
                    return new Promise(function(resolve,reject)  {
                        // $.getJSON(defaultUrl.concat(url), function (data) {
                        //     resolve(data)
                        // })
                        //     .fail(function (err) {
                        //         reject(err)
                        //     })

                        $.getJSON('data/page.json')
                            .done(function (res) {
                                resolve(res)
                            })
                            .fail(function( jqxhr, textStatus, error ) {
                                var err = textStatus + ", " + error;
                                console.log( "Request Failed: " + err );
                                reject(error)
                            });

                    })
                }

                return {
                    get: get
                }
            })(),

        //소켓통신API
        socketApi :
            (function () {

                function mutate (api, param) {

                    return new Promise( function (resolve, reject) {
                        socket.emit(api, param)
                        socket.on(api, function (res) {
                            if(res.code !== 200) {
                                reject(res.message)
                            }
                            resolve(res)
                        })
                    })

                }

                var sucessCode = 200;


                //소켓연결
                function apiConnect (param) {
                    console.log('start apiConnect')
                    return new Promise( function (resolve, reject) {
                        socket.emit('api-connect', param)
                        socket.on('api-connect', function (res) {
                            console.log('apiConnect res',res)
                            if(res.code !== sucessCode) {
                                reject(res)
                            }
                            console.log('resolve')
                            resolve(res)
                        })
                    })
                }

                function disconnect (param) {
                    console.log('start disconnect')
                    return new Promise(function (resolve, reject) {
                        socket.emit('api-disconnect', param)
                        socket.on('api-disconnect', function (res) {
                            // 네트워크 등에 의한 문제 (ping) 에 의한 disconnect 는 다시 접속한다.
                            // api-reconnect-join-room-user
                            console.log('res.code',res.code)
                            if(res.code !== sucessCode) {
                                reject(res)
                            }
                            console.log('resolve')
                            resolve(res)

                        })

                    })
                }


                function room (data) {
                    console.log('start create room')
                    return new Promise(function(resolve, reject) {
                        socket.emit('api-create-room', {lesson:'A'});
                        socket.on('api-create-room', function (res) {
                            if(res.code !== sucessCode) {
                                reject(res.message)
                            }
                            resolve(res)
                        })
                    })
                }

                    function roomList () {
                    console.log('start seatch roomList')
                    return new Promise(function(resolve, reject) {
                        socket.emit('api-room-list');
                        socket.on('api-room-list', function (res) {
                            if(res.code !== sucessCode) {
                                reject(res.message)
                            }
                            resolve(res)
                        })
                    })
                }

                function joinRoom (param) {
                    console.log('start join room')
                    return new Promise(function(resolve, reject) {
                        socket.emit('api-join-room', param);
                        socket.on('api-join-room', function (res) {

                            if(res.code !== sucessCode) {
                                reject(res.message)
                            }
                            resolve(res)
                        })
                    })
                }


                function leaveRoom (param) {
                    console.log('start leave room')
                    return new Promise (function (resolve, reject) {
                        socket.emit('api-leave-room', param)
                        socket.on('api-leave-room', function (res) {
                            if(res.code !== sucessCode) {
                                reject(res.message)
                            }
                            resolve(res)
                        })
                    })
                }

                function sync_init (data) {
                    return new Promise(function (resolve, reject) {
                        socket.emit('api-sync-init',data)
                        socket.on('api-sync-init', function(res) {
                            if(res.code !== sucessCode) {
                                reject(res.message)
                            }
                            resolve(res)
                        })
                    })
                }

                function sync (data) {
                    var json = JSON.parse(data);
                    syncdata = data;
                    json.pageId = pageId;

                    //console.log('syncdata',JSON.stringify(json))

                    socket.emit('api-sync',{data:JSON.stringify(json), includeme:true })
                }

                //api-reconnect-join-room-user
                function reconnectJoinRoomUser () {
                    console.log('start reconnectJoinRoomUser')
                    socket.emit('api-reconnect-join-room-user')
                }

                if(socket != null) {

                    socket.on('api-sync', function(res) {

                        var sync_data_json = JSON.parse(res.data);

                        console.log('sync result data',sync_data_json)


                        if(sync_data_json.pageId != pageId) {
                            movePage(sync_data_json.pageId)
                        }
                        selfSync(res.data);
                        console.log('extendWindow',extendWindow)
                        if(extendWindow != null) {
                            console.log('확장모니터로 데이터 전송')
                            extendWindow.selfSync(res.data)
                        }

                    })

                    //방 재접속 이벤트
                    //누군가가 재접속을 하였을때는 sync 를 다시 맞춰준다.
                    socket.on("api-reconnect-join-room-user", function(res) {
                        console.log("on.api-reconnect-join-room-user", res);
                        //var iframe = document.getElementById(iframeNm).contentWindow;
                        //iframe.dataWrite()
                    });
                }




                //현재 소켓연결된 리스트 (모바일에서 사용)
                function connectedList () {
                    return new Promise( function (resolve, reject) {
                        socket.emit('api-connected-list', {userid:'test_admin'})
                        socket.on('api-connected-list', function (res) {
                            if(res.code !== sucessCode ) {
                                reject(res.message)
                            }
                            console.log('res',res)
                            resolve(res)
                        })
                    })
                }

                //소켓으로부터 GET
                function get () {
                    return new Promise( function (resolve,reject) {

                    })
                }





                return {
                    mutate: mutate,
                    apiConnect: apiConnect,
                    disconnect: disconnect,
                    connectedList: connectedList,
                    room :room,
                    get : get,
                    sync : sync,
                    sync_init : sync_init,
                    roomList: roomList,
                    joinRoom : joinRoom,
                    reconnectJoinRoomUser: reconnectJoinRoomUser,
                }

            })()

    }



})();



//전역변수
var code = "";
var message = "";
var userid = "";
var uid ="";
var roomid = "";


var iframeNm = "iframe_content";
var pageId;
var courseId;
var mirroring_uid_key = "mirroring_uid";
var os = "";
var USE_COOKIE = true;
var mirroring_uid = null;
var currentRoomData = null;

var clients = [];
var rooms = [];

var isConnect = false;

$(document).ready(function () {

    try {
        var iever = get_version_of_IE();
        if(iever != -1 && iever < 9) {
            alert('지원하지 않는 브라우저입니다.(IE'+iever+')\nIE 9 이상을 사용해주세요.');
        } else {
            $(function(){
                init(iever);
            });
        }
    } catch (error) {
        alert('지원하지 않는 브라우저입니다.\n'+error);
    }




})

/*
    name : init
    description : 페이지 로드시 실행되는 초기화 함수
 */
function init (_iever) {

    userid = localStorage['id']

    //페이지정보
    courseId = getParamter('courseId');
    pageId = getParamter('pageId');
    if(courseId == undefined || courseId == null || courseId == '') {
        alert('과목정보를 확인하세요')
        return;
    }

    //set iframe src
    if(pageId != null && pageId != '' && pageId != undefined) {

        $("#"+iframeNm).off('load');
        $("#"+iframeNm).on('load', function (e) {
            $("#"+iframeNm).off('load');

            var $iframe = $(this);
            viewer_content_sizing_auto();
        });

        $("#"+iframeNm).attr('src', "pages/"+pageId +".html")
    } else {
        alert('수업정보를 확인하세요')
        return;
    }

    //페이지 오픈시 CMS로부터 컨텐츠 정보룰 재공받는다.
    apiModule.cmsApi.get('/')
        .then(function (res) {

            var index = res.findIndex( function (item) {
                return item.course_id == courseId;
            })

            if( index > -1) {

                //과목명
                $("#course_name").html(res[index]['course_name'])

                var el = ""
                //해당 과목의 수업리스트
                page_json = res[index]
                res[index]['pages'].forEach( function (subitem) {
                    el += "<li><a href=\"javascript:movePage('"+subitem.page_id+"')\">"+subitem.page_name+"</a></li>"
                })

                $("#page_list").html(el)

            }




        })
        .catch()

    //event handler
    $("#btn_open").on('click', openMirroringPage)
    $("#btn_close").on('click', closeMirroringPage)
    $("#btn_roomList").on('click', roomList);
    $("#btnNext").on('click', nextPage)
    $("#btnPrev").on('click', prevPage)


    createSocket();


    if(USE_COOKIE) {
        mirroring_uid = getCookie(mirroring_uid_key);
    }


    //iframe로부터 메시지 받는 이벤트 리스너
    //ifrmae에서 전송한 데이터를 소켓서버로 전송
    window.addEventListener("message", function (e) {

        //컨텐츠에서 alert 이 발생해도 부모한테 메세지를 전달하기 때문에 reutrn 처리
        if(e.data.recordedType == 'alert') return;

        last_sync_data = e.data

        //현재 창이 자식 창일 경우 iframe 으로 부터 받은 데이터를 부모창에게 전달한다. socket X
        if(window.name === extendWindowName) {
            selfSync(e.data)
            parent.opener.sync(e.data)
        }else {
            sync(e.data)
            selfSync(e.data);

        }

    })
}

/*
    name : sync
    description : 소켓통신을 통한 sync
 */
function sync (data) {
    //룸이 생성되어 있는지 확인
    if(currentRoomData != null) {
        apiModule.socketApi.sync(data)
    }

}



/*
    name : selfSync
    description : 변경된 내용을 iframe 에 전달
 */
function selfSync (data) {

    //iframe 에 데이터 전달할때 룸 생성 여부 같이 전달
    var json = JSON.parse(data);
    json.isExistroom = (currentRoomData != null && currentRoomData != undefined) ?  true : false;
    json = JSON.stringify(json);

    (currentRoomData != null && currentRoomData != undefined) ?  true : false

    if(data != null) {
        var iframe = document.getElementById(iframeNm).contentWindow;
        if(iframe != undefined && iframe != null) {
            iframe.postMessage(json, "*")
        }

    }

}

/*
    name : createRoom
    description : 룸 생성
 */

function createRoom () {
    apiModule.socketApi.room()
        .then (function (res) {
            currentRoomData = res.data;
            $("#roomid").val(currentRoomData.roomid)
            //룸생성 후 확장윈도우의 화면 전환 & 싱크
            extendWindow.open()

            //룸생성후 sync
            // console.log('last_sync_data',last_sync_data)
            // sync(last_sync_data)

            //window.frames[iframeNm].window.callSync();
            document.getElementById(iframeNm).contentWindow.callSync();

        })

        .catch( function (error) {
            console.log(error)
            alert('Room 생성 실패')
        })
}
/*
    name : createSocket
    description : 소켓 생성
 */
function createSocket () {


    if(socket == null) return;

    var param = {
        userid: userid,
        os: os,
        uid: mirroring_uid,
        roomid: roomid,
    }

    apiModule.socketApi.apiConnect(param)
        .then(function (res) {
             isConnect = true;
            //
             //$("#uid").val(res.data.uid)
            // code = res.code;
            // message = res.message;
            // userid = res.data.userid;
            // uid = res.data.uid;
            // roomid = res.data.roomid;

            if(res.code === 200) {
                if(USE_COOKIE) {
                    setCookie(mirroring_uid_key, res.data.uid, 365);
                }
            } else if (res.code === 429) {
                //같은 아이디로 접속할 수 있는 수를 초과
                //connect-list 출력

            }
        })
        .catch (function (res) {

            if(res.code == 429) { //
                if(confirm("같은 아이디로 접속할 수 있는 수를 초과하였습니다.\n기존 연결을 제거하겠습니까?")) {
                    connListWindow = window.open('/assets/viewer/connectedList.html', 'connWin', '_blank');
                } else {
                    windowClose();
                }
            }
        })

}

function getConnectedList () {
    apiModule.socketApi.connectedList()
        .then( function (res) {
            connListWindow.showConnectedList(res.data)
        })
}

/*
    name : startMirroring
    description : 확장 윈도우에서 실행되는 함수 ( 수업시작 => 룸생성 )
 */
function startMirroring () {
    parent.opener.createRoom();

    window.moveTo(0,0); //창위치
    window.resizeTo(screen.availWidth, screen.availHeight); //창크기 최대화

    openFullscreen();

    //viewer_content_sizing_force(screen.availWidth,screen.availHeight);
    viewer_content_sizing_auto();


}

/*
    name : openMirroringPage
    description : host 윈도우에서 미러링 버튼 클릭시 실행
 */
function openMirroringPage () {

    //미러링페이지 오픈
    extendWindow = window.open('iframe_window.html?courseId='+courseId+'&pageId='+pageId,extendWindowName,'_blank');

    extendWindow.onload = function () {
        viewer_content_sizing_auto();
    }

    buttonToggle();


}

/*
    name : closeMirroringPage
    description : host 윈도우에서 미러링 종료
 */
function closeMirroringPage () {

    if(extendWindow != null){
        extendWindow.close();
        extendWindow = undefined
        currentRoomData = undefined
    }
    buttonToggle();
}

/*
    name : buttonToggle
    description : 버튼toggle
 */
function buttonToggle() {

    if($("#btn_open").css('display') == 'none') {
        $("#btn_open").show();
        $("#btn_close").hide();
    } else {
        $("#btn_open").hide();
        $("#btn_close").show();
    }
}

/*
    name : movePage
    param : param(이동되는 페이지아이디)
    description : 페에지 이동 (실동작은 iframe 영역만 수정)
 */
function movePage (param) {

    console.log('movePage')

    pageId = param;
    var pages = page_json['pages'];

    var index = pages.findIndex( function (item) {
        return item.page_id == param;
    })

    var $iframe_content = $("#iframe_content");
    $iframe_content.off('load');
    $iframe_content.on('load', function (e) {
        $iframe_content.off('load');

        var $iframe = $(this);
        viewer_content_sizing_auto();
    });
    $("#iframe_content").attr('src', pages[index].page_path)


    if(extendWindow != null) {
        extendWindow.movePage(pageId);
    }


}


function get_version_of_IE () {
    var word;
    var agent = navigator.userAgent.toLowerCase();
    // IE old version ( IE 10 or Lower )
    if ( navigator.appName == "Microsoft Internet Explorer" ) word = "msie ";
    // IE 11
    else if ( agent.search( "trident" ) > -1 ) word = "trident/.*rv:";
    // Microsoft Edge
    else if ( agent.search( "edge/" ) > -1 ) word = "edge/";
    // 그외, IE가 아니라면 ( If it's not IE or Edge )
    else return -1;

    var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );
    if (  reg.exec( agent ) != null  ) return parseFloat( RegExp.$1 + RegExp.$2 );
    return -1;
}

var setCookie = function(name, value, day) {
    var date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};
var getCookie = function(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};
var deleteCookie = function(name) {
    var date = new Date();
    document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}


var getParamter = function (param) {

    var returnValue;
    var url = location.href;
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split("&")


    for(var i=0; parameters.length; i++) {
        // if(parameters[i] != null && parameters[i] != undefined) {
        var varName = parameters[i].split('=')[0];

        if(varName.toUpperCase() == param.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
        // }

    }


}

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}


window.addEventListener('beforeunload', function (event) {

    //페이지이동(iframe source 변경) 일 경우 disconnect 하지 않는다.
    if(event.target.activeElement.className == 'pageLink') {
        return;
    } else {
        deleteCookie(mirroring_uid_key)
        apiModule.socketApi.disconnect()

        //미러링 페이지 닫음
        extendWindow.closeWindow();
    }
})


function disconnect (param) {


    apiModule.socketApi.disconnect({uid:param})
        .then( function (res) {
            if(param != null) {
                //parameter 가 있을 경우에는 다른 uid 를 disconnect 한것으로 새로운 connection 을 실행한다.
                createSocket()
                connListWindow.close()
            }
        })
        .catch( function (res) {
        })
}

/*
    name : roomList
    param :
    description : 룸목록
 */
function roomList () {
    apiModule.socketApi.roomList()
        .then( function (res) {
            console.log('roomList . ',res)
            if(res.data.length > 0) {
                roomsWin = window.open('roomList.html','roomList','_blank')
                roomsWin.onload = function () {
                    roomsWin.showRoomList(res.data)
                }
            }
        })

}
/*
    name : roomList
    param : String (roomid)
    description : 룸선택팝업에서 룸을 선택하고 확인클릭시 호출
 */
function joinRoom (param) {
    apiModule.socketApi.joinRoom({roomid:param})
        .then(function (res) {

            currentRoomData = param;
            if(roomsWin != null) {
                roomsWin.close();
                apiModule.socketApi.reconnectJoinRoomUser()

            }

        })
        .catch (function (msg) {
            alert(msg)
        })
}

function closeExtendWindow () {
    extendWindow.close();
}

function windowClose()
{
    window.open('','_self').close();
}


/* 모바일 다음, 이전 버튼 처리 */
function nextPage () {

    var pages = page_json['pages'];

    var index = pages.findIndex( function (item) {
        console.log(item.page_id)
        console.log(pageId)
        return item.page_id == pageId;
    });


    if((index + 1) < pages.length) {
        movePage(page_json['pages'][index + 1].page_id);
    }


}

function prevPage () {
    var pages = page_json['pages'];

    var index = pages.findIndex( function (item) {
        console.log(item.page_id)
        console.log(pageId)
        return item.page_id == pageId;
    });

    console.log(index)


    if((index - 1) > -1) {
        movePage(page_json['pages'][index - 1].page_id);
    }

}



var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}