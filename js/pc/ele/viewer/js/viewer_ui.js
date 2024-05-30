/*UI js*/
let screenUI;
$(function() {

	screenUI = {

		/**
		 * 내부 전역변수
		 *
		 * @memberOf screenUI
		 */
		v: {
			screenWidth: 0
			, screenHeight: 0
		},

		/**
		 * 내부 함수
		 *
		 * @memberOf screenUI
		 */
		f: {
            isEmpty: function(val) {
                try {
                    if (typeof val === 'undefined' || val === null || val === '' || val === 'undefined')
                        return true;
                    else
                        return false;
                } catch (error) {
                    return false;
                }
            },

			// 윈도우 오픈
			winOpen: function(url, w, h, param, nm) {
				var curX = window.screenLeft;
				var curY = window.screenTop;
				var curWidth = document.body.clientWidth;
				var curHeight = document.body.clientHeight;
				var xPos = curX + (curWidth / 2) - (w / 2);
				var yPos = curY + (curHeight / 2) - (h / 2);
				url = (screenUI.f.isEmpty(param)) ? url : url + '?' + param;
				let win = top.window.open(url, nm, 'width=' + w + ', height=' + h + ', left=' + xPos + ', top=' + yPos + ', menubar=no, status=no, titlebar=no, resizable=no');
			},
		},

		/**
		 * Event 정의 객체.
		 *
		 * @memberOf screenUI
		 */
		event: function() {

		},

		/**
		 * Init 최초 실행.
		 *
		 * @memberOf screenUI
		 */
		init: function() {

			// Event 정의 실행
			screenUI.event();

			// 크기 넣기
			screenUI.v.screenWidth = window.screen.width;
			screenUI.v.screenHeight = window.screen.height;

		}
	};

	screenUI.init();
	window.screenUI = screenUI;

});