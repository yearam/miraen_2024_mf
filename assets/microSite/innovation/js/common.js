var __w = function(text) {
    console.log(text)
};
var __a = function(text) {
    alert(text)
};

//device 종류를 가져온다.
var getDeviceType = function() {
    var isMobile = isMobileDevice();
    var isTablet = isTabletDevice();

    if (isMobile == true && isTablet == false) {
        return "mobile";
    } else {
        return "pc";
    }
};

function isMobileDevice() {
    var phoneArray = new Array('samsung-', 'sch-', 'shw-', 'sph-', 'sgh-', 'lg-', 'canu', 'im-', 'ev-', 'iphone', 'nokia', 'blackberry', 'lgtelecom', 'natebrowser', 'sonyericsson', 'mobile', 'android', 'ipad');
    for (i = 0; i < phoneArray.length; i++) {
        if (navigator.userAgent.toLowerCase().indexOf(phoneArray[i]) > -1) {
            return true;
        }
    }

    return false;
}

function isTabletDevice() {
    if (!isMobileDevice()) {
        return false;
    } // 태블릿검사
    if (navigator.userAgent.toLowerCase().indexOf('ipad') > -1 || (navigator.userAgent.toLowerCase().indexOf('android') > -1 && navigator.userAgent.toLowerCase().indexOf('mobile') == -1)) {
        return true;
    } // 갤럭시 탭
    var galaxyTabModel = new Array('shw-');
    for (i = 0; i < galaxyTabModel.length; i++) {
        if (navigator.userAgent.toLowerCase().indexOf(galaxyTabModel[i]) > -1) {
            return true;
        }
    }

    return false;
}

//전화번호 - 자동
var autoHypenPhone = function(str) {
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }
    return str;
}


function IosCheck(){

    var rtnStr ="NOT IOS";

    if(navigator.userAgent.match(/(iphone)|(mac os)|(ipod)|(ipad)/i)){
        rtnStr = "IOS";
        //alert('IOS');
        //return true;
    }
    return rtnStr;
}

// common js
let cjs = {
    // 기본 변수
    val : {
        today : null, // 현재일
        lang : 'ko', // lanaguage
    },
    num : {
        Comma : function(n) {
            let parts = String(n).toString().split('.');
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
        },
        UnComma : function(n) {
            if (typeof n == 'undefined') {
                return '';
            } else {
                return n.toString().replace(/,/g, '');
            }
        }
    },
    text : {
        // 오른쪽 자리로 가져오기
        right : function(str, length) {
            if (str.length <= length) {
                return str;
            } else {
                return str.substring(str.length - length, str.length);
            }
        },
        // 공백 체크
        isEmpty : function(val) {
            if (typeof val == 'undefined' || val == null || val == "" || val == 'undefined')
                return true;
            else
                return false;
        },
        // DB엔터처리
        replaceEnter : function(val) {
            if ($text.isEmpty(val)) {
                val = '';
            } else {
                val = val.toString();
            }
            return val.replace(/(?:\r\n|\r|\n)/g, '<br />')
        },
        // 무자 변환
        replace : function(val, search, replace) {
            if (typeof val !== 'string')
                return '';
            return val.replace(search, replace);
        },

        // 전화번호 - 자동"-"
        autoHypenPhone : function(str) {
            str = str.replace(/[^0-9]/g, '');
            var tmp = '';
            if (str.length < 4) {
                return str;
            } else if (str.length < 7) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3);
                return tmp;
            } else if (str.length < 11) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 3);
                tmp += '-';
                tmp += str.substr(6);
                return tmp;
            } else {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 4);
                tmp += '-';
                tmp += str.substr(7);
                return tmp;
            }
            return str;
        },
    },
    date : {
        // yyyy
        getYYYY : function() {
            let d = new Date();
            return d.getFullYear();
        },
        getMM : function() {
            let d = new Date();
            return d.getMonth() + 1;
        },
        getDD : function() {
            let d = new Date();
            return d.getDate();
        },
        today : function() {
            let d = new Date();
            return $date.getDateStr(d);
        },
        next7Day : function() {
            let d = new Date();
            let dayOfDay = d.getDate();
            d.setDate(dayOfDay + 7);
            return $date.getDateStr(d);
        },
        next30Day : function() {
            let d = new Date();
            let dayOfDay = d.getDate();
            d.setDate(dayOfDay + 30);
            return $date.getDateStr(d);
        },
        last7Day : function() {
            let d = new Date();
            let dayOfDay = d.getDate();
            d.setDate(dayOfDay - 7);
            return $date.getDateStr(d);
        },
        last30Day : function() {
            let d = new Date();
            let dayOfDay = d.getDate();
            d.setDate(dayOfDay - 30);
            return $date.getDateStr(d);
        },
        lastWeek : function() {
            let d = new Date();
            let dayOfMonth = d.getDate();
            d.setDate(dayOfMonth - 7);
            return $date.getDateStr(d);
        },
        lastMonth : function() {
            let d = new Date();
            let dayOfMonth = d.getDate();
            d.setMonth(monthOfYear - 1);
            return $date.getDateStr(d);
        },
        ProjectStartDay : function() {
            return '01/01/2019';
        },
        // yyyy.mm.dd
        getDateTimeStr : function(d) {
            return ($date.getDateStr(d) + ' ' + $date.getTimeStr(d));
        },
        // yyyy.mm.dd
        getDateStr : function(d) {
            return ($text.right(('0' + (d.getMonth() + 1)), 2) + '/' + $text.right(('0' + d.getDate()), 2) + '/' + d.getFullYear());
        },
        // hh.mm.ss
        getTimeStr : function(d) {
            return ($text.right(('0' + d.getHours()), 2) + '.' + $text.right(('0' + d.getMinutes()), 2) + '.' + $text.right(('0' + d.getSeconds()), 2));
        },
    },
    msg : {
        // 얼랏
        alert : function(Title, Content) {
            $.alert({
                title : icon + Title,
                content : Content,
                icon : 'fa fa-rocket',
                animation : 'scale',
                closeAnimation : 'scale',
                boxWidth : '300px',
                useBootstrap : false,
                buttons : {
                    okay : {
                        text : '닫기',
                        btnClass : 'btn-blue'
                    }
                }
            });
        },

        // Class123 로그인 연동 종료 얼럿용 - 20231128(조성준)
        alert2 : function(Title, Content, class123Url, go) {
            $.alert({
                title : Title,
                content : Content,
                //icon : 'info-circle',
                animation : 'scale',
                closeAnimation : 'scale',
                animateFromElement: false,
                boxWidth : '400px',
                useBootstrap : false,
                buttons : {
                    okay : {
                        text : '확인',
                        btnClass : 'btn-blue',
                        action : function() {
                            location.href = class123Url;
                        }
                    },
                    okay2 : {
                        text : '회원가입',
                        btnClass : 'btn-gray',
                        action : function(){
                            location.href = go;
                        }
                    }
                }
            });
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

        // json 행선택 Set
        getSetFilter2 : function(data, key1, key2) {
            const set = new Set();
            $.each(data, function() {
                set.add(this[key1], this[key2]);
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

    /**
     * 공통함수
     */
    cmm: {

        /**
         * 브라우저 주소창 변경
         * @memberOf $cmm.changeBrowserAddressBarUrl(changeUrl)
         * @param {String} url get 방식
         * ex) $cmm.changeBrowserAddressBarUrl('/Search/Search.mrn?searchTxt=마음')
         */
        changeBrowserAddressBarUrl: function(changeUrl) {

            if (typeof (history.pushState) != "undefined") {
                // 주소 변경
                window.history.pushState(null, null, changeUrl);
            } else {
                __w('지원하지 않는 브라우저');
            }
        },
    },

};
let $text = cjs.text; // 문자함수
let $num = cjs.num; // 숫자함수
let $date = cjs.date; // 날짜
let $msg = cjs.msg; // 메세지(notify, alert, confirm)
let $objData = cjs.objData; // 데이터 핸들링
let $cmm = cjs.cmm; // 공통함수