let USE_TOUCH_EVENT = true;

let MARGIN = 55;
MARGIN = 0;

var Module = Module || {};

Module.common = (function () {
	let _container;
	let _iframe_container_id = undefined;
	let _mouse_wheel_enabled = false;
	/* iframe */
	let _size = { w: 0, h: 0 };
	let _pos = { x: 0, y: 0 };
	let _zoom_target = { x: 0, y: 0 };
	let _zoom_point = { x: 0, y: 0 };
	let _scale = 1;
	let zoom_factor = 0.1;
	let _max_scale = 3;
	let _delta;
	let previous_mouse_move_event;
	let is_dragging;

	function _set_title(idx) {
		let obj = viewer._playlist_data.playlist[idx];
		let corner = obj.corner === null ? '' : obj.corner
		$('#module-title').html('<strong>' + corner + '</strong> ' + obj.title);
	};
	function _is_mouse_wheel_enabled(enabled) {
		_mouse_wheel_enabled = enabled;
	};
	function _is_samesize(container) {
		let width = 1364;
		let height = 952;

		let content_type = $("#content-scale").attr('type');
		if (content_type) {
			if (content_type == 'image') {
				let img = $("#content-scale .carousel-item.active").children("img").first();
				if (img && img.length >= 1) {
					if (img.get(0).naturalWidth > 0 && img.get(0).naturalHeight > 0) {
						width = img.get(0).naturalWidth;
						height = img.get(0).naturalHeight;
					} else {

					}
				}
			} else if (content_type == 'video' || content_type == 'audio') {
				if (Module.video_viewer.type() != 'audio') {
					if (Module.video_viewer.getVideoWidth() && Module.video_viewer.getVideoHeight()) {
						width = Module.video_viewer.getVideoWidth();
						height = Module.video_viewer.getVideoHeight();
						//console.log(width, height);
					} else {
						width = 931;
						height = 540;
					}
				} else {
					width = 1024;
					height = 100;
				}

			}
		}

		width -= MARGIN * 2;
		height -= MARGIN * 2;

		let old_w = container.width();
		let old_h = container.height();
		if (old_w == width && old_h == height) {
			return false;
		}
		return true;
	};
	function _fit(container) {
		let width = 1364;
		let height = 952;
		// if($("#content-body").width() && $("#content-body").height()) {
		// 	width = $("#content-body").width();
		// 	height = $("#content-body").height();
		// }
		let content_type = $("#content-scale").attr('type');
		if (content_type) {
			if (content_type == 'image') {
				let img = $("#content-scale .carousel-item.active").children("img").first();
				if (img && img.length >= 1) {
					// console.log(img.get(0));
					if (img.get(0).naturalWidth > 0 && img.get(0).naturalHeight > 0) {
						width = img.get(0).naturalWidth;
						height = img.get(0).naturalHeight;
					} else {

					}
				}
			} else if (content_type == 'video' || content_type == 'youtube' || content_type == 'audio') {
				if (Module.video_viewer.type() != 'audio') {
					// if(Module.video_viewer.getVideoWidth() && Module.video_viewer.getVideoHeight()) {
					// 	width = Module.video_viewer.getVideoWidth();
					// 	height = Module.video_viewer.getVideoHeight();
					// } else {
					// 	width = 931;
					// 	height = 540;
					// }
					// 간헐적으로 getVideoHeight값을 가져오지 못해 동영상 플레이어가 크게 보이는 현상이 있어서 수정(2021.04.29)
					width = 931;
					height = 540;
				} else {
					width = 1024;
					height = 100;
				}
			}
		} else {
			if ($("#pdf-iframe").length > 0) {
				// console.log($("#pdf-iframe"));
				try {
					let viewer = $("#pdf-iframe").get(0).contentWindow.pdfGetViewer();
					let pdfview = viewer.getPageView(0);
					let viewbox = pdfview.viewport.viewBox;
					// console.log(pdfview);
					if (pdfview && viewbox[2] > 0 && viewbox[3] > 0) {
						// let scale = pdfview.scale;
						width = viewbox[2];
						height = viewbox[3];
						// console.log(width, height);

						width += 20 * 2;
						height += 20 * 2;
					}
				} catch (error) {
					// console.error(error);
				}

			}
		}
		// console.log(width, height);
		width -= 20 * 2;
		height -= 20 * 2;

		// if ($("body").attr('theme') == 'theme-green') {
		// 	width = width - (15 + 30);
		// 	height = height - (15 + 30);
		// }
		//width = width * 0.78;
		//height = height * 0.78;
		//width = width.toFixed(3);
		//height = height.toFixed(3);

		let old_w = container.width();
		let old_h = container.height();

		// console.log(width, height, old_w, old_h);

		if (old_w == width && old_h == height) {
			return false;
		}
		container.attr('style', 'width:' + width + 'px;height:' + height + 'px;');
		if (Module.pdf_viewer.drawing() && IS_USING_PDF_MODULE) {
		} else {
			$("#drawing-control").attr('style', 'width:' + width + 'px;height:' + height + 'px;');
		}


		if (Module.image_viewer.drawing()) {
			Module.image_viewer.drawing().fitStage();
		}
		if (Module.video_viewer.drawing()) {
			Module.video_viewer.drawing().fitStage();
		}
		// if(Module.pdf_viewer.drawing()) {
		// 	Module.pdf_viewer.drawing().fitStage();
		// }
		// _fit_height();
		return true;
	};
	function _fit_height() {
		let target = $('#module-body');
		target.removeAttr('style');
		if (target.offset()) {
			let footerHeight = 38;
			let targetTop = target.offset().top;
			let obj = $('#viewer-hd');
			let targetHeight = obj.offset().top - (targetTop + (MARGIN * 2));
			if ($("#module-modal .modal-header").is(':visible') == false) {
				// targetHeight = obj.offset().top - (targetTop + MARGIN);
				targetHeight = targetHeight + 7;
			}
			target.height(targetHeight - footerHeight);
		}
	};
	function _adjustToContainer() {
		if (_container) {
			$(window).trigger("resize.smartZoom");
		}
	};
	function _destroy() {
		try {
			_container.smartZoom('destroy');
		} catch (error) {
			// console.log(error);
		}
	};
	function _zoom(container, max_scale, containerBackground) {
		setTimeout(function () {
			if (!containerBackground) {
				containerBackground = 'white'
			}
			_container = $('#' + container);
			_container.smartZoom({
				'containerBackground': containerBackground,
				'maxScale': max_scale,
				'scrollEnabled': _mouse_wheel_enabled,
				'dblClickEnabled': false
			});
		}, 200);
	};

	function _get_zoom() {
		if (_container) {
			let smartData = _container.data('smartZoomData');
			if (!smartData) return 1;
			let scale = smartData.adjustedPosInfos.scale;
			if (typeof (scale) == 'string') {
				scale = parseFloat(scale);
			}
			return scale;
		}
		return 1;
	};

	function _zoom_in() {
		if (_container) {
			_container.smartZoom('zoom', 0.1, true);
		}
	};
	function _zoom_out() {
		if (_container) {
			_container.smartZoom('zoom', -0.1, true);
		}
	};
	function _zoom_setting(params) {
		if (_container) {
			_container.smartZoom(params);
		}
	};

	/*
	 * iframe
	 */
	function _iframe_zoom(container, max_scale) {
		if (container) {
			_iframe_container_id = container;
			container = $('#' + container);
			_max_scale = max_scale;
			//_container = container.contents().find('#wrap');
			_container = container.contents().find('body');

			_subscribe_to_iframe_events();
			_scale = 1;
			_delta = 0;
			_iframe_current_position('zoom');
		}
	};
	function _iframe_current_position(type, e) {
		if (!_container) {
			return;
		}

		let offset = _container.offset();
		if (!offset) {
			return;
		}
		// console.log('offset', offset);

		_size.w = _container[0].clientWidth;
		_size.h = _container[0].clientHeight;

		if (e) {
			custom_prevent_event(e);
			e = convert_touch_event(e);
			_zoom_point.x = e.pageX;
			_zoom_point.y = e.pageY;
			_delta = e.delta || e.originalEvent.wheelDelta;
			if (_delta === undefined) {
				_delta = e.originalEvent.detail;
			}
		} else {
			_zoom_point.x = offset.left + (_size.w * _scale) / 2;
			_zoom_point.y = offset.top + (_size.h * _scale) / 2;
		}

		_zoom_target.x = (_zoom_point.x - _pos.x) / _scale;
		_zoom_target.y = (_zoom_point.y - _pos.y) / _scale;

		_delta = Math.max(-1, Math.min(1, _delta));
		if ('move' != type) {
			// _scale +=  _delta * zoom_factor * _scale;
			// _scale = _scale.toFixed(1);

			// _scale = 10 * _delta * zoom_factor * _scale;
			// _scale = Math.floor(_scale).toFixed(0) / 10;

			_scale += _delta * zoom_factor;
		}
		_scale = Math.max(1, Math.min(_max_scale, _scale));

		_pos.x = -_zoom_target.x * _scale + _zoom_point.x;
		_pos.y = -_zoom_target.y * _scale + _zoom_point.y;

		if (_pos.x > 0) {
			_pos.x = 0;
		}

		if (_pos.x + _size.w * _scale < _size.w) {
			_pos.x = -_size.w * (_scale - 1);
		}

		if (_pos.y > 0) {
			_pos.y = 0;
		}

		if (_pos.y + _size.h * _scale < _size.h) {
			_pos.y = -_size.h * (_scale - 1);
		}

		// let _style = _container.attr('style');
		// if(!_style && _scale == 1 && _pos.x == 0 && _pos.y == 0) {
		// } else {
		_container.css('-webkit-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
		_container.css('-webkit-transform-origin', '0 0');
		_container.css('-moz-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
		_container.css('-moz-transform-origin', '0 0');
		_container.css('-o-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
		_container.css('-o-transform-origin', '0 0');
		_container.css('-ms-transform', 'translate(' + _pos.x + 'px, ' + _pos.y + 'px) scale(' + (_scale) + ')');
		_container.css('-ms-transform-origin', '0 0');

		let eventTypeToDispatch = "iframe-zoom-event-" + type;
		window.dispatchEvent(new CustomEvent(eventTypeToDispatch, {
			detail: {
				"iframe_id": _iframe_container_id,
				"scale": _scale,
				"pos": _pos
			}
		}));
		// }

	};
	function _subscribe_to_iframe_events() {
		if (!_container) {
			return;
		}
		if (_mouse_wheel_enabled) {
			_container.bind('wheel', _on_iframe_mouse_wheel);
		}
		_container.bind('mousedown', _on_iframe_mouse_down);
		_container.bind('mouseup', _on_iframe_mouse_up);

		if (USE_TOUCH_EVENT) {
			_container.bind('touchstart', _on_iframe_mouse_down);
			_container.bind('touchend', _on_iframe_mouse_up);
		}

	};
	function _usibscribe_from_iframe_events() {
		if (!_container) {
			return;
		}
		if (_mouse_wheel_enabled) {
			_container.unbind('wheel', _on_iframe_mouse_wheel);
		}
		_container.unbind('mousedown', _on_iframe_mouse_down);
		_container.unbind('mouseup', _on_iframe_mouse_up);

		if (USE_TOUCH_EVENT) {
			_container.unbind('touchstart', _on_iframe_mouse_down);
			_container.unbind('touchend', _on_iframe_mouse_up);
		}

		if (is_dragging) {
			_unsubscribe_from_dragging_iframe_events();
		}
	};
	function _on_iframe_mouse_wheel(e) {
		custom_prevent_event(e);
		e = convert_touch_event(e);
		_iframe_current_position('wheel', e);
	};
	function _on_iframe_mouse_down(e) {
		custom_prevent_event(e);
		e = convert_touch_event(e);
		previous_mouse_move_event = e;
		is_dragging = true;
		_subscribe_to_dragging_iframe_events();
	};
	function _on_iframe_mouse_up(e) {
		custom_prevent_event(e);
		e = convert_touch_event(e);
		is_dragging = false;
		_unsubscribe_from_dragging_iframe_events();
	};
	function _subscribe_to_dragging_iframe_events() {
		if (!_container) {
			return;
		}
		_container.bind('mousemove', _on_iframe_mouse_move);
		if (USE_TOUCH_EVENT) {
			_container.bind('touchmove', _on_iframe_mouse_move);
		}
	};
	function _unsubscribe_from_dragging_iframe_events() {
		if (!_container) {
			return;
		}
		_container.unbind('mousemove', _on_iframe_mouse_move);
		if (USE_TOUCH_EVENT) {
			_container.unbind('touchmove', _on_iframe_mouse_move);
		}
	};

	function _on_iframe_mouse_move(e) {
		custom_prevent_event(e);
		e = convert_touch_event(e);

		_pos.x += e.pageX - previous_mouse_move_event.pageX;
		_pos.y += e.pageY - previous_mouse_move_event.pageY;

		previous_mouse_move_event = e;
		_iframe_current_position('move');
	};
	function _iframe_zoom_in() {
		_delta = 1;
		_iframe_current_position('zoom');
	};
	function _iframe_zoom_out() {
		_delta = -1;
		_iframe_current_position('zoom');
	};
	return {
		set_title: _set_title,
		is_mouse_wheel_enabled: _is_mouse_wheel_enabled,
		is_samesize: _is_samesize,
		fit: _fit,
		get_zoom: _get_zoom,
		zoom: _zoom,
		iframe_zoom: _iframe_zoom,
		zoom_in: _zoom_in,
		zoom_out: _zoom_out,
		iframe_zoom_in: _iframe_zoom_in,
		iframe_zoom_out: _iframe_zoom_out,
		adjustToContainer: _adjustToContainer,
		destroy: _destroy,
		zoom_setting: _zoom_setting
	};
}());

Module.image_viewer = (function () {
	let drawing_canvas = undefined;
	let _image_list = [];
	let _cur_idx = 0;
	function _drow_image(id, image_list, user_margin) {
		if (id && image_list) {
			_image_list = image_list;

			let body = $('#' + id);
			body.empty();
			$carousel_control = $('<div id="carousel-control" class="carousel slide" data-interval="false" data-ride="carousel" data-wrap="false"></div>');
			$carousel_inner = $('<div class="carousel-inner"></div>');
			$content_body = $('<div id="content-body"></div>');
			$content_scale = $('<div id="content-scale"></div>');
			$content_scale.attr("type", "image");
			// Module.common.fit($content_scale);

			$.each(image_list, function (index, item) {
				let $carousel_item = $('<div class="carousel-item align-items-center flex-column p-4"></div>');
				let $image = $('<img class="d-block">');
				$image.attr('src', item);

				if (index == 0) {
					$carousel_item.addClass('active');
				}
				$carousel_item.append($image);
				$content_scale.append($carousel_item);
			});

			$drawing_control = $('<div id="drawing-control"></div>');
			$content_scale.append($drawing_control);
			$content_body.append($content_scale);
			$carousel_inner.append($content_body);

			$carousel_control.append($carousel_inner);
			/*
			$carousel_control_prev = $('<a class="carousel-control-prev" href="#carousel-control" role="button" data-slide="prev"></a>');
			$carousel_control_prev.append($('<span class="carousel-control-prev-icon" aria-hidden="true"></span>'));
			$carousel_control_prev.append($('<span class="sr-only">Previous</span>'));

			$carousel_control_next = $('<a class="carousel-control-next" href="#carousel-control" role="button" data-slide="next"></a>');
			$carousel_control_next.append($('<span class="carousel-control-next-icon" aria-hidden="true"></span>'));
			$carousel_control_next.append($('<span class="sr-only">Next</span>'));

			$carousel_control.append($carousel_control_prev);
			$carousel_control.append($carousel_control_next);
			*/
			body.append($carousel_control);

			if (!user_margin) {
				user_margin = MARGIN + 'px';
			} else {
				user_margin = user_margin + 'px';
			}
			body.css('margin', user_margin);
			body.css('overflow', 'hidden');

			_cur_idx = 1;
			if (_cur_idx >= _image_list.length) {
				_cur_idx = _image_list.length;
			}

			let page = _paging(_image_list.length, _cur_idx);
			prev_img = _image_list[page.prev - 1];
			next_img = _image_list[page.next - 1];
			if (_cur_idx == 1) {
				prev_img = null;
				$('.carousel-control-prev').addClass("hidden");
			} else {
				$('.carousel-control-prev').removeClass("hidden");
			}
			if (_cur_idx == _image_list.length) {
				next_img = null;
				$('.carousel-control-next').addClass("hidden");
			} else {
				$('.carousel-control-next').removeClass("hidden");
			}
			$("#module-page").html(_cur_idx + " / " + _image_list.length);
			_prev_image(prev_img);
			_next_image(next_img);

			_popover_hover('prev');
			_popover_hover('next');

			drawing_canvas = new DrawingCanvas({ container_id: 'drawing-control' });

			// Module.common.fit($content_scale);
		}
	};
	function _popover_hover(type) {
		$('[data-toggle="' + type + '-popover-hover"]').popover({
			html: true,
			trigger: 'hover',
			placement: 'bottom',
			boundary: 'window',
			content: function () { return '<img src="' + $(this).data('img') + '" />'; }
		});
	}
	function _popover_hover_update(type, img) {
		// console.error(type, img);
		$('[data-toggle="' + type + '-popover-hover"]').attr('data-img', img);
		let popover = $('[data-toggle="' + type + '-popover-hover"]').data('bs.popover');
		if (popover) {
			popover.config.content = '<img src="' + img + '" />';
			popover.hide();
			popover.update();

			// console.log(popover);
		}
		// _popover_hover(type);
	};
	function _paging(total_count, cur_page) {
		// console.log(total_count, cur_page);
		let per_page = 1;
		let nav_page = 1;
		let total_page = Math.ceil(total_count / per_page);
		let page_group = Math.ceil(cur_page / nav_page);

		let last = (page_group * nav_page);
		if (last > total_page) {
			last = total_page;
		}

		let first = last - (nav_page - 1);

		let prev = first - 1;
		let next = last + 1;
		prev = prev == 0 ? first : prev;
		next = next > total_page ? last : next;
		let ret = { prev: prev, next: next };
		// console.log(ret);
		return ret;
	};
	function _control_prev() {
		_cur_idx--;
		if (_cur_idx < 1) {
			_cur_idx = 1;
		}

		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		if (_cur_idx == 1) {
			prev_img = null;
			$('.carousel-control-prev').addClass("hidden");
		} else {
			$('.carousel-control-prev').removeClass("hidden");
		}
		if (_cur_idx == _image_list.length) {
			next_img = null;
			$('.carousel-control-next').addClass("hidden");
		} else {
			$('.carousel-control-next').removeClass("hidden");
		}

		if (viewer._device_type == 'mobile' && $("#module-modal").hasClass('show') && _image_list.length > 0) {
			$("#current_page").html(_cur_idx);
			$("#current_page").attr("title", "현재 " + _cur_idx + "페이지");
			$("#total_page").html(_image_list.length);
			$("#total_page").attr("title", "총" + _image_list.length + "페이지");

			$("#quick .page .current").html(_cur_idx);
			$("#quick .page .current").attr("title", "현재 " + _cur_idx + "페이지");
			$("#quick .page .total").html(_image_list.length);
			$("#quick .page .total").attr("title", "총" + _image_list.length + "페이지");
		} else {
			$("#module-page").html(_cur_idx + " / " + _image_list.length);
		}

		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _control_next() {
		_cur_idx++;
		if (_cur_idx >= _image_list.length) {
			_cur_idx = _image_list.length;
		}

		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		if (_cur_idx == 1) {
			prev_img = null;
			$('.carousel-control-prev').addClass("hidden");
		} else {
			$('.carousel-control-prev').removeClass("hidden");
		}
		if (_cur_idx == _image_list.length) {
			next_img = null;
			$('.carousel-control-next').addClass("hidden");
		} else {
			$('.carousel-control-next').removeClass("hidden");
		}

		if (viewer._device_type == 'mobile' && $("#module-modal").hasClass('show') && _image_list.length > 0) {
			$("#current_page").html(_cur_idx);
			$("#current_page").attr("title", "현재 " + _cur_idx + "페이지");
			$("#total_page").html(_image_list.length);
			$("#total_page").attr("title", "총" + _image_list.length + "페이지");

			$("#quick .page .current").html(_cur_idx);
			$("#quick .page .current").attr("title", "현재 " + _cur_idx + "페이지");
			$("#quick .page .total").html(_image_list.length);
			$("#quick .page .total").attr("title", "총" + _image_list.length + "페이지");
		} else {
			$("#module-page").html(_cur_idx + " / " + _image_list.length);
		}

		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _prev_image(img) {
		let $carousel_control_prev = $('.carousel-control-prev').children(".carousel-control-prev-icon");
		$carousel_control_prev.attr("data-toggle", "prev-popover-hover");
		$carousel_control_prev.attr("data-img", img);

		_popover_hover_update('prev', img);
	};
	function _next_image(img) {
		let $carousel_control_next = $('.carousel-control-next').children(".carousel-control-next-icon");
		$carousel_control_next.attr("data-toggle", "next-popover-hover");
		$carousel_control_next.attr("data-img", img);

		_popover_hover_update('next', img);
	};
	function _update_image() {
		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _destroy_canvas() {
		if (drawing_canvas) {
			drawing_canvas.destroy();
			drawing_canvas = undefined;
		}
	};
	return {
		drow_image: _drow_image,
		control_prev: _control_prev,
		control_next: _control_next,
		update_image: _update_image,
		destroy_canvas: _destroy_canvas,
		drawing: function () { return drawing_canvas; }
	};
}());

Module.video_viewer = (function () {
	let player = null;
	let sources = [];
	let drawing_canvas = undefined;
	let player_type = 'video';

	function _drow_video(id, type, _cb) {
		if (id) {
			let body = $('#' + id);
			body.empty();
			if (type) {
				player_type = type;
			}

			$content_body = $('<div id="content-body"></div>');
			$content_scale = $('<div id="content-scale"></div>');
			$content_scale.attr("type", player_type);

			$video_player = $('<div class="video-player mt40"></div>');
			$video_player.addClass(player_type);

			if (player_type === 'audio') {
				$video = $('<audio class="video-js"></audio>');
			} else {
				$video = $('<video id="video" class="video-js" playsinline=""></video>');
			}

			$video_player.append($video);
			$content_scale.append($video_player);

			$drawing_control = $('<div id="drawing-control"></div>');
			$content_scale.append($drawing_control);

			$content_body.append($content_scale);
			body.append($content_body);
			body.css('margin', MARGIN + 'px');
			body.css('overflow', 'hidden');
			_video_control(_cb);

			drawing_canvas = new DrawingCanvas({ container_id: 'drawing-control' });

			// Module.common.fit($content_scale);
		}
	};
    function _video_control(_cb) {
        if ($('.video-js').length) {
            let Button = videojs.getComponent('Button');
            class stopButton extends Button {
                constructor(player, options) {
                    super(player, options);
                    this.controlText('정지');
                    this.addClass('vjs-stop-control');
                }
                handleClick() {
                    if (this.player_.currentTime() === 0) {
                        return;
                    }

                    this.player_.pause();
                    this.player_.currentTime(0);
                    this.player_.hasStarted(false);
                    YOUTUBEPLAYERTRIGGERSTOP = true;

                    if ($('.vjs-play-control').hasClass('vjs-playing')) {
                        $('.vjs-play-control').removeClass('vjs-playing');
                        $('.vjs-play-control').addClass('vjs-paused');
                    }
                }
            }
            videojs.registerComponent('stopButton', stopButton);

            // 토글버튼
            class controlToggle extends Button {
                constructor(player, options) {
                    super(player, options);
                    this.controlText('숨기기');
                    this.addClass('vjs-toggle-control');
                    this.showing = false;
                }

                handleClick() {
                    this.player_.toggleClass('vjs-toggle-inactive');
                    (!this.showing) ? this.controlText('펼치기') : this.controlText('숨기기');
                    this.showing = !this.showing;
                }
            }
            videojs.registerComponent('controlToggle', controlToggle);

            let videojs_control_bar_children = [
                'playToggle',
                'stopButton',
                'progressControl',
                'volumeMenuButton',
                'currentTimeDisplay',
                'durationDisplay',
                'volumePanel',
                'captionToggle',
                'fullscreenToggle',
                'controlToggle',
                'remainingTimeDisplay'
            ];

            if (player_type === 'audio') {
                videojs_control_bar_children = [
                    'playToggle',
                    'stopButton',
                    'progressControl',
                    'currentTimeDisplay',
                    'durationDisplay',
                    'remainingTimeDisplay'
                ];
            }
            videojs(document.querySelector('.video-js'), {
                controls: true,
                fluid: true,
                inactivityTimeout: 0,
                controlBar: {
                    volumePanel: { inline: false },
                    children: videojs_control_bar_children
                }
            }, function onPlayerReady() {
				//   console.log("onPlayerReady", this);
				let _player = this;
				player = this;
				let $video = $('.video-js');

				$video.append($video.next('.video-caption'));

				_cb && _cb();

				_player.on('timeupdate', function () {
					let time = _player.currentTime();
					$('[data-toggle=video-caption]').each(function () {
						let t = $(this);
						let pt = String($(this).attr('data-playtime'));
						let playtime = pt.split(',')[0];
						let endtime = pt.split(',')[1];
						if (playtime < time && time < endtime) {
							t.addClass('playing-video-script');
							return;
						} else {
							t.removeClass('playing-video-script');
						}
					});
				});

				_player.on("play", function (e) {
					try {
						if (MIRRORING_WINDOW && !MIRRORING_WINDOW.closed && MIRRORING_WINDOW.viewer.is_mirroring_started) {
							_player.muted(true);
						} else {
							_player.muted(false);
						}
					} catch (error) {

					}
					try {
						if (!YOUTUBEVIDEOPLAYERCHECK) {
							if (!IS_REMOTE_TRIGGER) {
								mirroring.api_sync_obj({
									target: "app",
									script: "Module.video_viewer.play();"
								});
							}
							IS_REMOTE_TRIGGER = false;
						} else {

							if (!IS_REMOTE_TRIGGER && YOUTUBEPLAYERTRIGGERPLAY == 'send') {
								mirroring.api_sync_obj({
									target: "app",
									script: "Module.video_viewer.play(); YOUTUBEPLAYERTRIGGERPLAY='recieve';"
								});
							}
							IS_REMOTE_TRIGGER = false;
							setTimeout(function () {
								YOUTUBEPLAYERTRIGGERPLAY = 'send';
							}, 300);
						}
					} catch (error) {
						// console.error(error);
					}
				});
				_player.on("pause", function (e) {

					try {

						if (!YOUTUBEVIDEOPLAYERCHECK) {
							if (!IS_REMOTE_TRIGGER) {
								mirroring.api_sync_obj({
									target: "app",
									script: "Module.video_viewer.pause();"
								});
							}
							IS_REMOTE_TRIGGER = false;
						} else {
							if (!IS_REMOTE_TRIGGER && YOUTUBEPLAYERTRIGGERPAUSE == 'send') {
								console.log("pause를 넘겨 줌", IS_REMOTE_TRIGGER);
								mirroring.api_sync_obj({
									target: "app",
									script: "Module.video_viewer.pause();YOUTUBEPLAYERTRIGGERPAUSE='recieve';"
								});
							}
							IS_REMOTE_TRIGGER = false;
							setTimeout(function () {
								YOUTUBEPLAYERTRIGGERPAUSE = 'send';
							}, 300);

						}
					} catch (error) {
						// console.error(error);
					}
				});
				// _player.on("playing", function (e) {
				// 	console.log("playing", e);
				// });
				// _player.on("ended", function (e) {
				// 	console.log("ended", e);
				// });
				_player.on("seeked", function (e) {

					if (!drawing_canvas) {
						return;
					}

					let currentTime = player.currentTime();

					try {
						if (!YOUTUBEVIDEOPLAYERCHECK) {
							if (!IS_REMOTE_TRIGGER) {
								mirroring.api_sync_obj({
									target: "app",
									script: "IS_REMOTE_TRIGGER=true;Module.video_viewer.currentTime(" + currentTime + ");"
								});
							}
							IS_REMOTE_TRIGGER = false;

						} else {
							if (!IS_REMOTE_TRIGGER && YOUTUBEPLAYERTRIGGERSEEKED == 'send') {
								console.log("seeked를 넘겨 줌", IS_REMOTE_TRIGGER, currentTime);
								mirroring.api_sync_obj({
									target: "app",
									script: "IS_REMOTE_TRIGGER=true;Module.video_viewer.currentTime(" + currentTime + ");YOUTUBEPLAYERTRIGGERSEEKED='recieve';"
								});
							}
							IS_REMOTE_TRIGGER = false;
							setTimeout(function () {
								YOUTUBEPLAYERTRIGGERSEEKED = 'send';
							}, 300);
						}
					} catch (error) {
						// console.error(error);
					}
				});
			});
		}
	};
	function _playlist(src, type) {
		if (player) {
			let source = [{ 'src': src, 'type': type }];
			sources.push({ 'sources': source });
			player.playlist(sources);
		}
	};
	function _clearPlaylist() {
		sources = [];
	};
	function _width(width) {
		if (player) {
			player.width(width);
			player.videoWidth(width);
		}
	};
	function _height(height) {
		if (player) {
			player.height(height);
			player.videoHeight(height);
		}
	};
	function _play() {
		if (player) {
			player.play();
		}
	};
	function _played(callback) {
		if (typeof callback == "function") {
			player.on("play", function (e) {
				callback();
			});
		}
	};
	function _pause() {
		if (player) {
			player.pause();
		}
	};
	function _muted() {
		if (player) {
			if (player.muted()) {
				player.muted(false);
			} else {
				player.muted(true);
			}
		}
	};
	function _prev() {
		if (player) {
			player.playlist.previous();
		}
	};
	function _next() {
		if (player) {
			player.playlist.next();
		}
	};
	function _currentTime(time) {
		if (player) {
			player.currentTime(time);
		}
	};
	function _seeked(callback) {
		if (typeof callback == "function") {
			player.on("seeked", function (e) {
				callback(player.currentTime());
			});
		}
	};
	function _fullscreen() {
		if (player) {
			if (player.isFullscreen()) {
				player.exitFullscreen();
			} else {
				player.requestFullscreen();
			}
		}
	};
	function _get_type() {
		return player_type;
	};
	function _getVideoWidth() {
		if (player) {
			return player.videoWidth();
		}
		return 0;
	};
	function _getVideoHeight() {
		if (player) {
			return player.videoHeight();
		}
		return 0;
	};
	function _destroy_canvas() {
		if (drawing_canvas) {
			drawing_canvas.destroy();
			drawing_canvas = undefined;
		}
	};
	return {
		drow_video: _drow_video,
		playlist: _playlist,
		clearPlaylist: _clearPlaylist,
		width: _width,
		height: _height,
		play: _play,
		played: _played,
		pause: _pause,
		muted: _muted,
		prev: _prev,
		next: _next,
		currentTime: _currentTime,
		seeked: _seeked,
		fullscreen: _fullscreen,
		type: _get_type,
		getVideoWidth: _getVideoWidth,
		getVideoHeight: _getVideoHeight,
		destroy_canvas: _destroy_canvas,
		drawing: function () { return drawing_canvas; }
	};
}());

Module.pdf_viewer = (function () {
	let drawing_canvas = undefined;
	let _image_list = []
	let _pdf_url = undefined;
	let _cur_idx = 0;
	function _drow_pdf(id, pdf_url, start_page, image_list) {
		if (id && image_list) {
			_image_list = image_list;
		}
		if (id && pdf_url) {
			_pdf_url = pdf_url;
			if (!start_page) {
				start_page = 1;
			}

			let body = $('#' + id);
			body.empty();

			$content_body = $('<div id="content-body"></div>');
			// $content_scale = $('<div id="content-scale"></div>');
			// $content_scale.attr("type", "pdf");
			// Module.common.fit($content_scale);

			// $pdf_iframe = $('<iframe id="pdf-iframe" src="pdf/web/pdf.html?file='+pdf_url+'&page='+start_page+'"></iframe>');
			$pdf_iframe = $('<iframe id="pdf-iframe"></iframe>');
			// $pdf_iframe.on('load', function (e) {
			// 	_set_drawing_canvas();
			// });
            let iframe_url;
            if (start_page === "link") {
                iframe_url = pdf_url
            } else {
                iframe_url = '/js/pc/ele/viewer/pdf/web/pdf.html?file=' + encodeURIComponent(pdf_url) + '&page=' + start_page;
            }
			console.log(iframe_url);
			$pdf_iframe.attr('src', iframe_url);

			$content_body.append($pdf_iframe);

			$drawing_control = $('<div id="drawing-control"></div>');
			$content_body.append($drawing_control);

			body.append($content_body);

			body.css('overflow', 'hidden');

			_cur_idx = 1;
			if (_cur_idx >= _image_list.length) {
				_cur_idx = _image_list.length;
			}

			let page = _paging(_image_list.length, _cur_idx);
			prev_img = _image_list[page.prev - 1];
			next_img = _image_list[page.next - 1];
			if (_cur_idx == 1) {
				prev_img = null;
				$('.carousel-control-prev').addClass("hidden");
			} else {
				$('.carousel-control-prev').removeClass("hidden");
			}
			if (_cur_idx == _image_list.length) {
				next_img = null;
				$('.carousel-control-next').addClass("hidden");
			} else {
				$('.carousel-control-next').removeClass("hidden");
			}
			// $("#module-page").html(_cur_idx + " / " + _image_list.length);
			_prev_image(prev_img);
			_next_image(next_img);

			_popover_hover('prev');
			_popover_hover('next');

			drawing_canvas = new DrawingCanvas({
				container_id: 'drawing-control',
				custom_data: 'pdf'
			});

			// Module.common.fit($content_scale);
		}
	};
	function _set_drawing_canvas_to_target_id(target_id) {
		let $drawing_control_parent = $("#pdf-iframe").contents().find("#" + target_id);
		if (!$drawing_control_parent || $drawing_control_parent.length < 1) {
			return;
		}

		let $drawing_control = $("#pdf-iframe").contents().find("#drawing-control");
		if ($drawing_control && $drawing_control.length >= 1) {
			$drawing_control.appendTo($drawing_control_parent);
		} else {
			$drawing_control = $('<div id="drawing-control"></div>');
			$drawing_control_parent.append($drawing_control);
		}
		if (!drawing_canvas) {
			let _container = $drawing_control.get(0);
			drawing_canvas = new DrawingCanvas({ container: _container });
			drawing_canvas.fitStage();
		}
	};
	function _popover_hover(type) {
		$('[data-toggle="' + type + '-popover-hover"]').popover({
			html: true,
			trigger: 'hover',
			placement: 'bottom',
			boundary: 'window',
			content: function () { return '<img src="' + $(this).data('img') + '" />'; }
		});
	};
	function _popover_hover_update(type, img) {
		// console.error(type, img);
		$('[data-toggle="' + type + '-popover-hover"]').attr('data-img', img);
		let popover = $('[data-toggle="' + type + '-popover-hover"]').data('bs.popover');
		if (popover) {
			popover.config.content = '<img src="' + img + '" />';
			popover.hide();
			popover.update();

			// console.log(popover);
		}
		// _popover_hover(type);
	};
	function _paging(total_count, cur_page) {
		// console.log(total_count, cur_page);
		let per_page = 1;
		let nav_page = 1;
		let total_page = Math.ceil(total_count / per_page);
		let page_group = Math.ceil(cur_page / nav_page);

		let last = (page_group * nav_page);
		if (last > total_page) {
			last = total_page;
		}

		let first = last - (nav_page - 1);

		let prev = first - 1;
		let next = last + 1;
		prev = prev == 0 ? first : prev;
		next = next > total_page ? last : next;
		let ret = { prev: prev, next: next };
		// console.log(ret);
		return ret;
	};
	function _control_prev() {
		_cur_idx--;
		if (_cur_idx < 1) {
			_cur_idx = 1;
		}

		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		if (_cur_idx == 1) {
			prev_img = null;
			$('.carousel-control-prev').addClass("hidden");
		} else {
			$('.carousel-control-prev').removeClass("hidden");
		}
		if (_cur_idx == _image_list.length) {
			next_img = null;
			$('.carousel-control-next').addClass("hidden");
		} else {
			$('.carousel-control-next').removeClass("hidden");
		}

		if (viewer._device_type == 'mobile' && $("#module-modal").hasClass('show') && _image_list.length > 0) {
			$("#current_page").html(_cur_idx);
			$("#current_page").attr("title", "현재 " + _cur_idx + "페이지");
			$("#total_page").html(_image_list.length);
			$("#total_page").attr("title", "총" + _image_list.length + "페이지");

			$("#quick .page .current").html(_cur_idx);
			$("#quick .page .current").attr("title", "현재 " + _cur_idx + "페이지");
			$("#quick .page .total").html(_image_list.length);
			$("#quick .page .total").attr("title", "총" + _image_list.length + "페이지");
		} else {
			$("#module-page").html(_cur_idx + " / " + _image_list.length);
		}

		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _control_next() {
		_cur_idx++;
		if (_cur_idx >= _image_list.length) {
			_cur_idx = _image_list.length;
		}

		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		if (_cur_idx == 1) {
			prev_img = null;
			$('.carousel-control-prev').addClass("hidden");
		} else {
			$('.carousel-control-prev').removeClass("hidden");
		}
		if (_cur_idx == _image_list.length) {
			next_img = null;
			$('.carousel-control-next').addClass("hidden");
		} else {
			$('.carousel-control-next').removeClass("hidden");
		}

		if (viewer._device_type == 'mobile' && $("#module-modal").hasClass('show') && _image_list.length > 0) {
			$("#current_page").html(_cur_idx);
			$("#current_page").attr("title", "현재 " + _cur_idx + "페이지");
			$("#total_page").html(_image_list.length);
			$("#total_page").attr("title", "총" + _image_list.length + "페이지");

			$("#quick .page .current").html(_cur_idx);
			$("#quick .page .current").attr("title", "현재 " + _cur_idx + "페이지");
			$("#quick .page .total").html(_image_list.length);
			$("#quick .page .total").attr("title", "총" + _image_list.length + "페이지");
		} else {
			$("#module-page").html(_cur_idx + " / " + _image_list.length);
		}

		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _prev_image(img) {
		let $carousel_control_prev = $('.carousel-control-prev').children(".carousel-control-prev-icon");
		$carousel_control_prev.attr("data-toggle", "prev-popover-hover");
		$carousel_control_prev.attr("data-img", img);

		_popover_hover_update('prev', img);
	};
	function _next_image(img) {
		let $carousel_control_next = $('.carousel-control-next').children(".carousel-control-next-icon");
		$carousel_control_next.attr("data-toggle", "next-popover-hover");
		$carousel_control_next.attr("data-img", img);

		_popover_hover_update('next', img);
	};
	function _update_image() {
		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _update_index(index) {
		_cur_idx = index;
		let page = _paging(_image_list.length, _cur_idx);
		prev_img = _image_list[page.prev - 1];
		next_img = _image_list[page.next - 1];
		if (_cur_idx == 1) {
			prev_img = null;
			$('.carousel-control-prev').addClass("hidden");
		} else {
			$('.carousel-control-prev').removeClass("hidden");
		}
		if (_cur_idx == _image_list.length) {
			next_img = null;
			$('.carousel-control-next').addClass("hidden");
		} else {
			$('.carousel-control-next').removeClass("hidden");
		}

		if (viewer._device_type == 'mobile' && $("#module-modal").hasClass('show') && _image_list.length > 0) {
			$("#current_page").html(_cur_idx);
			$("#current_page").attr("title", "현재 " + _cur_idx + "페이지");
			$("#total_page").html(_image_list.length);
			$("#total_page").attr("title", "총" + _image_list.length + "페이지");

			$("#quick .page .current").html(_cur_idx);
			$("#quick .page .current").attr("title", "현재 " + _cur_idx + "페이지");
			$("#quick .page .total").html(_image_list.length);
			$("#quick .page .total").attr("title", "총" + _image_list.length + "페이지");
		} else {
			$("#module-page").html(_cur_idx + " / " + _image_list.length);
		}
		_prev_image(prev_img);
		_next_image(next_img);
	};
	function _destroy_canvas() {
		if (drawing_canvas) {
			drawing_canvas.destroy();
			drawing_canvas = undefined;
		}
	};
	return {
		drow_pdf: _drow_pdf,
		control_prev: _control_prev,
		control_next: _control_next,
		update_image: _update_image,
		update_index: _update_index,
		destroy_canvas: _destroy_canvas,
		set_drawing_canvas_to_target_id: _set_drawing_canvas_to_target_id,
		set_drawing: function (canvas) {
			drawing_canvas = canvas;
		},
		drawing: function () {
			return drawing_canvas;
		}
	};
}());

Module.external_link_viewer = (function () {
	function _window_open(url) {
		window.open(url, 'link-popup', 'height=' + screen.height + ',width=' + screen.width + ',fullscreen=yes');
	};
	return {
		window_open: _window_open
	};
}());