// IE trimLeft(), trimRight();
if (typeof String.prototype.trimLeft !== 'function') {
    String.prototype.trimLeft = function () {
        return this.replace(/^\s+/, "");
    }
}

if (typeof String.prototype.trimRight !== 'function') {
    String.prototype.trimRight = function () {
        return this.replace(/\s+$/, "");
    }
}

var DrawingCanvas = (function DrawingCanvasClosure() {

    /**
     * Construct a DrawingCanvas instance for a given HTML element id.
     * @constructs DrawingCanvas
     * @param {string} options.container_id - id of container
     */
    function DrawingCanvas(options) {
        this.custom_data = options.custom_data;

        // container id
        this.container_id = options.container_id;
        if (this.container_id) {
            this.container = document.getElementById(this.container_id);
        }
        if (options.container) {
            this.container = options.container;
        }
        this.need_save_load = options.need_save_load;

        // method bindings
        this.activateBrush = this.activateBrush.bind(this);
        this.activateEraser = this.activateEraser.bind(this);
        this.deactivate = this.deactivate.bind(this);

        this._onclick = this._onclick.bind(this);
        this._ondblclick = this._ondblclick.bind(this);
        this._onmousedown = this._onmousedown.bind(this);
        this._onmousemove = this._onmousemove.bind(this);
        this._onmouseup = this._onmouseup.bind(this);

        // konva instances
        this.stage = null;
        this.drawingLayer = null;
        this.textLayer = null;
        this.imageLayer = null;
        this.mathToolLayer = null;
        this.transformer = null;

        // save on/off
        this.save_on = false;

        // annotation mode
        this.mode = undefined;
        this.node_id = undefined;

        // variables for drawing
        this.is_drawing = false;
        this.drawingLine = null;
        this.drawingLineNotAdded = null;  // 최초 mouse down에서는 그리지 않게 하려고 놨음

        this.stroke = '#ffffff';
        this.strokeWidth = 8;

        this.scale = 1;

        // variables for text
        this.textNode = null;
        this.first_make_textarea = true;
        this.fontFamily = '"NanumGothic"';
        this.fontSize = 93;
        this.fill = '#ffffff';

        // variables for image - arrow
        this.pointerWidth = 10;
        this.pointerLength = 10;
        this.pointerAtBeginning = false;
        this.drawarrowLine = null;
        this.arrow_strokewidth = 4;
        this.arrow_dash = [0, 0, 0, 0];
        this.arrow_fill = "#ffffff";
        this.arrow_stroke = "#ffffff";
        this.arrow_direction = 'forward';

        // variables for image - line
        this.drawstraightLine = null;
        this.line_points = undefined;
        this.straight_width = 4;
        this.straight_dash = [0, 0];
        this.straight_color = "#ffffff";

        // variables for image - hlighter
        this.drawHlighterLine = null;
        this.hlighter_color = '#ffffff'
        this.hlighter_width = 24;
        this.opacity = 0.5;

        // load or create
        this.type = 'DRAW';
        this.drawJson = null;

        // ruler
        this.tool_ratio = null; // 1mm 당 화면 비율 : 1mm = 10px (3cm 도형 제작 시 300px으로 만들었으면 300);
        this.ruler_index = 79; // 자의 최소 길이 : 30 = 3cm(30mm), 맨 앞,뒤에 1mm 여유를 위해 +2해줌
        // 자의 scale (화면 확대/축소 시 필요)
        this.ruler_scale_x = 1;
        this.ruler_scale_y = 1;
        this.ruler_group = null;

        this.createStage();

        // try {
        //     if (!this.need_save_load) {
        //         this.createStage();
        //     } else {
        //         var textbookLessonSeq = viewer._playlist_id;
        //         var textbookLessonSubjectSeq = $("#page_list .subject.active").attr('id');
        //         viewer.get_drawing_bookmark_data(textbookLessonSeq, textbookLessonSubjectSeq);
        //     }

        //     if (!this.stage) {
        //         this.createStage();
        //     }
        // } catch (error) {
        //     this.createStage();
        // }
    }

    DrawingCanvas.prototype = {
        // create konva stage
        createStage        : function DrawingCanvas_createStage() {
            // console.log("DrawingCanvas_createStage 1");
            if (this.stage) {
                return;
            }
            // console.log("DrawingCanvas_createStage 2");
            this.stage = new Konva.Stage({container: this.container, name: 'stage'});
            this.textLayer = new Konva.Layer({id: 'text', name: 'text_layer'});
            this.imageLayer = new Konva.Layer({id: 'image', name: 'image_layer'});
            this.drawingLayer = new Konva.Layer({id: 'drawing', name: 'drawing_layer'});
            this.mathToolLayer = new Konva.Layer({id: 'mathTool', name: 'mathTool_layer'});
            this.stage.add(this.textLayer);
            this.stage.add(this.imageLayer);
            this.stage.add(this.drawingLayer);
            this.stage.add(this.mathToolLayer);
            this.stage.listening(false);
            this.fitStage();
        },
        destroy            : function DrawingCanvas_destroy() {
            this.deactivate();

            if (this.transformer) {
                this.transformer.destroy();
                this.transformer = null;
            }
            if (this.mathToolLayer) {
                this.mathToolLayer.destroy();
                this.mathToolLayer = null;
            }
            if (this.drawingLayer) {
                this.drawingLayer.destroy();
                this.drawingLayer = null;
            }
            if (this.textLayer) {
                this.textLayer.destroy();
                this.textLayer = null;
            }
            if (this.imageLayer) {
                this.imageLayer.destroy();
                this.imageLayer = null;
            }
            if (this.stage) {
                this.stage.destroy();
                this.stage = null;
            }
        },
        transformer_destroy: function DrawingCanvas_transformer_destroy() {
            if (this.transformer) {
                this.transformer.destroy();
                this.transformer = null;
            }
            ;

            for (var t = 0; t <= this.textLayer.getChildren().length; t++) {
                if (this.textLayer.getChildren()[t] != undefined) {
                    this.textLayer.getChildren()[t].attrs.draggable = false;
                }
            }
            ;

            for (var i = 0; i <= this.imageLayer.getChildren().length; i++) {
                if (this.imageLayer.getChildren()[i] != undefined) {
                    this.imageLayer.getChildren()[i].attrs.draggable = false;
                }
            }
            ;

            for (var d = 0; d <= this.drawingLayer.getChildren().length; d++) {
                if (this.drawingLayer.getChildren()[d] != undefined) {
                    this.drawingLayer.getChildren()[d].attrs.draggable = false;
                }
            }
            ;

            for (var d = 0; d <= this.mathToolLayer.getChildren().length; d++) {
                if (this.mathToolLayer.getChildren()[d] != undefined) {
                    this.mathToolLayer.getChildren()[d].attrs.draggable = false;
                }
            }
            ;

            $('#board_container').click();
            $('.drawing-canvas').click();

            this.stage.find('.transforms').destroy();
            this.stage.draw();
        },
        // stage의 사이즈 등을 맞추기 위함. 외부에서 호출됨
        fitStage: function DrawingCanvas_fitStageIntoParentContainer() {
            // console.error("DrawingCanvas_fitStageIntoParentContainer");

            var pageW = this.container.offsetWidth;
            var pageH = this.container.offsetHeight;

            //this.scale = pdfScale;
            // console.log(this.container);
            this.stage.width(pageW);
            this.stage.height(pageH);
            this.stage.scale({x: this.scale, y: this.scale});
            this.stage.draw();


        },

        _activateCommon: function DrawingCanvas_activateCommon() {

            if (!this.active) {
                this.active = true;

                // this.stage.on('click singletap', this._onclick);
                // this.stage.on('dblclick doubletap', this._ondblclick);
                // this.stage.on('mouseup tapend', this._onmouseup);
                // this.stage.on('mousedown tapstart', this._onmousedown);
                // this.stage.on('mousemove tapmove', this._onmousemove);

                // this.stage.on('click tab', this._onclick);
                this.stage.on('click touchstart', this._onclick);
                this.stage.on('dblclick dbltap', this._ondblclick);
                this.stage.on('mouseup touchend', this._onmouseup);
                this.stage.on('mousedown touchstart', this._onmousedown);
                this.stage.on('mousemove touchmove', this._onmousemove);

                window.addEventListener('mouseup', this._onmouseup);
                window.addEventListener('touchend', this._onmouseup);

                this.stage.listening(true);

                this.container.classList.add('active');
            }
        },

        setMode: function DrawingCanvas_setMode(mode) {
            if (mode == null || mode == undefined) {
                this.deactivate();
                return;
            }

            this._activateCommon();
            this.mode = mode;
        },

        // activate for brush mode
        activateBrush: function DrawingCanvas_activateBrush() {
            this._activateCommon();
            this.mode = 'brush';
        },

        // activate for eraser mode
        activateEraser: function DrawingCanvas_activateEraser() {
            this._activateCommon();
            this.mode = 'eraser';
        },

        deactivate: function DrawingCanvas_deactivate() {

            if (this.active) {

                // this.stage.find('Transformer').destroy();
                // this.transformer = null;
                this.transformer_destroy();

                // this.layer.draw();
                this.stage.draw();

                this.stage.off('click touchstart');
                this.stage.off('dblclick dbltap');
                this.stage.off('mouseup touchend');
                this.stage.off('mousedown touchstart');
                this.stage.off('mousemove touchmove');

                window.removeEventListener('mouseup', this._onmouseup);
                window.removeEventListener('touchend', this._onmouseup);

                this.stage.listening(false);

                this.active = false;
                this.mode = undefined;
            }

            this.container.classList.remove('active');
        },

        // drawing clear
        clear       : function DrawingCanvas_clear() {
            this.clearDrawing();

            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "clearDrawing();"
            }));
        },
        clearDrawing: function DrawingCanvas_clearDrawing() {
            if (this.stage) {
                this.drawingLayer.destroyChildren();
                this.drawingLayer.draw();
                this.save_canvas();
            }
            this.transformer_destroy();

        },
        // text clear
        text_clear: function DrawingCanvas_text_clear() {
            this.clearText();

            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "clearText();"
            }));
        },
        clearText : function DrawingCanvas_clearText() {
            if (this.stage) {
                this.textLayer.destroyChildren();
                this.textLayer.draw();
                this.save_canvas();
            }
            this.transformer_destroy();
        },
        // image clear
        image_clear   : function DrawingCanvas_image_clear() {
            this.clearImage();

            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "clearImage();"
            }));
        },
        clearImage    : function DrawingCanvas_clearImage() {
            if (this.stage) {
                this.imageLayer.destroyChildren();
                this.imageLayer.draw();
                this.save_canvas();
            }
            this.transformer_destroy();
        },
        mathTool_clear: function DrawingCanvas_mathTool_clear() {
            this.clearMathtool();

            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "clearMathtool();"
            }));
        },
        clearMathtool : function DrawingCanvas_clearMathTool() {
            console.log('clearMathtool')
            if (this.stage) {
                this.mathToolLayer.destroyChildren();
                this.mathToolLayer.draw();
                this.save_canvas();
            }
            this.transformer_destroy();
        },
        // hide
        hide            : function DrawingCanvas_hide(layerName) {
            if (this.stage) {
                if (layerName == 'drawing_layer') {
                    this.drawingLayerHide();
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "drawingLayerHide();"
                    }));
                } else if (layerName == 'text_layer') {
                    this.textLayerHide();
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "textLayerHide();"
                    }));
                } else if (layerName == 'image_layer') {
                    this.imageLayerHide();
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "imageLayerHide();"
                    }));
                }
            }
        },
        drawingLayerHide: function DrawingCanvas_drawingLayerHide() {
            this.drawingLayer.hide();
            this.drawingLayer.draw();
        },
        textLayerHide   : function DrawingCanvas_textLayerHide() {
            this.textLayer.hide();
            this.textLayer.draw();
        },
        imageLayerHide  : function DrawingCanvas_imageLayerHide() {
            this.imageLayer.hide();
            this.imageLayer.draw();
        },
        // show
        show                      : function DrawingCanvas_show(layerName) {
            if (this.stage) {
                if (layerName == 'drawing_layer') {
                    this.drawingLayerShow();
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "drawingLayerShow();"
                    }));
                } else if (layerName == 'text_layer') {
                    this.textLayerShow();
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "textLayerShow();"
                    }));
                } else if (layerName == 'image_layer') {
                    this.imageLayerShow();
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "imageLayerShow();"
                    }));
                }
            }
        },
        drawingLayerShow          : function DrawingCanvas_drawingLayerShow() {
            this.drawingLayer.show();
            this.drawingLayer.draw();
        },
        textLayerShow             : function DrawingCanvas_textLayerShow() {
            this.textLayer.show();
            this.textLayer.draw();
        },
        imageLayerShow            : function DrawingCanvas_imageLayerShow() {
            this.imageLayer.show();
            this.imageLayer.draw();
        },
        drawline                  : function DrawingCanvas_drawline(x, y) {
            if (this.mode == 'brush' || this.mode == 'eraser') {
                if (this.drawingLineNotAdded) {
                    this.drawingLine = this.drawingLineNotAdded;
                    this.drawingLayer.add(this.drawingLine);
                    this.drawingLineNotAdded = null;
                }
                if (!this.drawingLine) {
                    this.drawingLine = new Konva.Line({
                        draggable               : false,
                        lineCap                 : 'round',
                        lineJoin                : 'round',
                        stroke                  : this.stroke,
                        strokeWidth             : this.strokeWidth,
                        globalCompositeOperation: this.mode === 'brush' ? 'source-over' : 'destination-out',
                        points                  : [x / this.scale, y / this.scale],
                        name                    : 'line'
                    });
                    this.drawingLayer.add(this.drawingLine);
                } else {
                    var konva_newPoints = this.drawingLine.points().concat([x / this.scale, y / this.scale]);
                    this.drawingLine.points(konva_newPoints);
                }
                this.drawingLayer.batchDraw();
            }
        },
        drawlineWithDetail        : function DrawingCanvas_drawlineWithDetail(x, y, mode, stroke, strokeWidth) {
            this.mode = mode;
            this.stroke = stroke;
            this.strokeWidth = strokeWidth;
            this.drawline(x, y);
        },
        drawLineStroke_change     : function DrawingCanvas_drawLineStroke_change(stroke) {
            this.stroke = stroke;
        },
        drawLineStrokeWidth_change: function DrawingCanvas_drawLineStrokeWidth_change(strokeWidth) {
            this.strokeWidth = strokeWidth;
        },
        stop_drawline             : function DrawingCanvas_stop_drawline() {
            if (this.is_drawing) {
                // this.saveData();
            }
            this.is_drawing = false;
            this.drawingLine = null;
        },

        stop_drawHlighter: function DrawingCanvas_stop_drawHlighter() {
            if (this.is_drawing) {
                //this.saveData();
            }
            this.is_drawing = false;
            this.drawHlighterLine = null;
            this.save_canvas();
        },

        stop_drawStraight: function DrawingCanvas_stop_drawStraight() {
            if (this.is_drawing) {
                //this.saveData();
            }
            this.is_drawing = false;
            this.drawstraightLine = null;
            this.save_canvas();
        },
        stop_drawArrow   : function DrawingCanvas_stop_drawArrow() {
            if (this.is_drawing) {
                //this.saveData();
            }
            this.is_drawing = false;
            this.drawarrowLine = null;
            this.save_canvas();
        },

        _setTransformer: function DrawingCanvas_setTransformer(e) {
            var self = this;

            if (e.target.attrs.name == 'line' && (this.mode == 'brush' || this.mode == 'eraser')) {
                if (this.transformer) {
                    this.transformer_destroy();
                    this.set_draggable_false();
                }
                return;
            }
            ;

            // transform destroy
            this.stage.find('.transforms').destroy();

            // target draggable true
            e.target.attrs.draggable = true;

            // create new transformer
            var _transformer;

            if (this.mode == 'text' && e.target.attrs.name == 'textNodes') {
                _transformer = new Konva.Transformer({
                    nodes         : [e.target],
                    rotateEnabled : false,
                    enabledAnchors: ['middle-right'],
                    anchorSize    : 14,
                    borderDash    : [5, 5],
                    padding       : 10,
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBox, newBox) {
                        var max_width = (e.target.parent.parent.attrs.width - newBox.x) * 0.9;
                        if (Math.abs(newBox.width) < 100 || Math.abs(newBox.width) > max_width) {
                            if (Math.abs(newBox.width) < 100) {
                                _transformer.stopTransform();
                            }
                            return oldBox;
                        }
                        return newBox;
                    }
                });
            } else if (this.mode == 'image' && e.target.attrs.name == 'imageNodes') {
                _transformer = new Konva.Transformer({
                    nodes         : [e.target],
                    rotateEnabled : false,
                    enabledAnchors: ['bottom-right'],
                    anchorSize    : 14,
                    borderDash    : [5, 5],
                    padding       : 10,
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBox, newBox) {
                        // var max_width = (e.target.parent.parent.attrs.width - newBox.x) * 0.9;
                        // if (Math.abs(newBox.width) < 100 || Math.abs(newBox.width) > max_width) {
                        if (Math.abs(newBox.width) <= 49 || Math.abs(newBox.width) >= 500) {
                            if (Math.abs(newBox.width) <= 49) {
                                _transformer.stopTransform();
                                e.target.attrs.width = 50;
                                e.target.attrs.height = 50;
                                e.target.attrs.scaleX = 1;
                                e.target.attrs.scaleY = 1;
                            } else if (Math.abs(newBox.width) >= 500) {
                                _transformer.stopTransform();
                                e.target.attrs.width = 490;
                                e.target.attrs.height = 490;
                                e.target.attrs.scaleX = 1;
                                e.target.attrs.scaleY = 1;
                            }

                            return oldBox;
                        }
                        e.target.attrs.width = parseInt(newBox.width);
                        e.target.attrs.height = parseInt(newBox.width);
                        e.target.attrs.scaleX = 1;
                        e.target.attrs.scaleY = 1;

                        // self.save_canvas();

                        return newBox;
                    }
                });

            } else if (this.mode == 'mathTool' && e.target.attrs.name == "setSquare") {
                _transformer = new Konva.Transformer({
                    rotationSnaps : [0, 90, 180, 270],
                    nodes         : [e.target],
                    rotateEnabled : true,
                    enabledAnchors: ['bottom-right'],
                    anchorSize    : 30,
                    borderDash    : [5, 5],
                    padding       : 10,
                    anchorFill    : 'rgba(255,255,255,0)',
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBox, newBox) {
                        if (Math.abs(newBox.width) <= 200 || Math.abs(newBox.width) >= 600) {

                            if (Math.abs(newBox.width) <= 200) {
                                _transformer.stopTransform();
                            } else if (Math.abs(newBox.width) >= 600) {
                                _transformer.stopTransform();
                            }
                            return oldBox;
                        }
                        return newBox;
                    }
                });
            } else if (this.mode == 'mathTool' && e.target.attrs.name == "protractor") {
                _transformer = new Konva.Transformer({
                    rotationSnaps : [0, 90, 180, 270],
                    nodes         : [e.target],
                    rotateEnabled : true,
                    enabledAnchors: ['bottom-right'],
                    anchorSize    : 30,
                    borderDash    : [5, 5],
                    padding       : 10,
                    // rotateAnchorOffset: 0,
                    anchorFill  : 'rgba(255,255,255,0)',
                    name        : 'transforms',
                    boundBoxFunc: function (oldBox, newBox) {
                        if (Math.abs(newBox.width) <= 200 || Math.abs(newBox.width) >= 600) {

                            if (Math.abs(newBox.width) <= 200) {
                                _transformer.stopTransform();
                            } else if (Math.abs(newBox.width) >= 600) {
                                _transformer.stopTransform();
                            }
                            return oldBox;
                        }

                        return newBox;
                    }
                });
            } else if (this.mode == 'mathTool' && e.target.attrs.name == "ruler") {
                e.target = this.ruler_group;

                self.stage.find('#ruler').draggable(true);
                self.stage.find('#grad_wrap').draggable(false);
                this.ruler_group.clearCache();

                // 맨 처음 자 생성되었을 때 눈금과 배경이 분리되는 현상 방지
                e.target.off('mousedown').on('mousedown', function (e) {
                    try {
                        if (e.target[0] != undefined) {
                            return;
                        }

                        if (e.target.attrs.id == "grad_wrap") {
                            e.target = self.stage.find('#ruler');
                        }
                    } catch (e) {
                        console.error(e)
                    }
                });

                // console.log(e.target)
                _transformer = new Konva.Transformer({
                    rotationSnaps : [0, 90, 180, 270],
                    nodes         : [this.ruler_group],
                    rotateEnabled : true,
                    enabledAnchors: ['middle-right'],
                    anchorSize    : 30,
                    borderDash    : [5, 5],
                    padding       : 10,
                    keepRatio     : true, // 비율 고정
                    anchorFill    : 'rgba(255,255,255,0)',
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBoundBox, newBoundBox) {
                        // rotate
                        if (newBoundBox.rotation != oldBoundBox.rotation) {
                            return newBoundBox;
                        }
                        ;

                        // group 유지하고 안에 눈금만 바꿔치기
                        // 오른쪽으로 이동

                        if (newBoundBox.width >= (self.tool_ratio * self.ruler_index) + 20) {
                            if (Math.abs(newBoundBox.width) > (self.stage.getWidth() - 100)) {
                                _transformer.stopTransform();
                                return oldBoundBox;
                            }

                            // self.ruler_group.destroyChildren();

                            // self.ruler_group.removeChildren();
                            // self.ruler_index += 1;
                            // self.create_ruler_box();
                            self.update_ruler('+');

                            var _width = e.target.width();
                            var _height = e.target.height();
                            var _x = e.target.attrs.x;
                            var _y = e.target.attrs.y;
                            var _scaleX = e.target.attrs.scaleX;
                            var _scaleY = e.target.attrs.scaleY;
                            var _rotation = e.target.attrs.rotation;

                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "mirroring_update_ruler('+', " + +_width + ", " + _height + ", " + _x + ", " + _y + "," + _scaleX + "," + _scaleY + "," + _rotation + ")"
                            }));
                        }
                        ;

                        // 왼쪽으로 이동
                        if (newBoundBox.width <= (self.tool_ratio * self.ruler_index)) {

                            // 최소 3cm로 고정
                            if (Math.abs(newBoundBox.width) < (self.tool_ratio * 32)) {
                                _transformer.stopTransform();
                                return oldBoundBox;
                            }
                            ;

                            // self.ruler_group.destroyChildren();

                            // self.ruler_group.removeChildren();
                            // self.ruler_index -= 1;
                            // self.create_ruler_box();

                            self.update_ruler('-');

                            var _width = e.target.width();
                            var _height = e.target.height();
                            var _x = e.target.attrs.x;
                            var _y = e.target.attrs.y;
                            var _scaleX = e.target.attrs.scaleX;
                            var _scaleY = e.target.attrs.scaleY;
                            var _rotation = e.target.attrs.rotation;

                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "mirroring_update_ruler('-', " + _width + ", " + _height + ", " + _x + ", " + _y + "," + _scaleX + "," + _scaleY + "," + _rotation + ")"
                            }));
                        }
                        ;

                        return oldBoundBox;
                    },
                });

            } else if (this.mode == 'arrow' && e.target.attrs.name == 'arrow') {
                _transformer = new Konva.Transformer({
                    nodes         : [e.target],
                    rotateEnabled : false,
                    enabledAnchors: ['top-left', 'top-center', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],
                    anchorSize    : 14,
                    borderDash    : [5, 5],
                    padding       : 7,
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBox, newBox) {
                        var max_width = (e.target.parent.parent.attrs.width - newBox.x) * 0.9;
                        if (Math.abs(newBox.width) < 14 || Math.abs(newBox.width) > max_width) {
                            if (Math.abs(newBox.width) < 14) {
                                _transformer.stopTransform();
                            }
                            return oldBox;
                        }
                        return newBox;
                    }
                });
            } else if (this.mode == 'straight' && e.target.attrs.name == 'straight') {
                _transformer = new Konva.Transformer({
                    nodes         : [e.target],
                    rotateEnabled : false,
                    enabledAnchors: ['top-left', 'top-center', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],
                    anchorSize    : 14,
                    borderDash    : [5, 5],
                    padding       : 7,
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBox, newBox) {
                        var max_width = (e.target.parent.parent.attrs.width - newBox.x) * 0.9;
                        if (Math.abs(newBox.width) < 1 || Math.abs(newBox.width) > max_width) {
                            if (Math.abs(newBox.width) < 1) {
                                _transformer.stopTransform();
                            }
                            return oldBox;
                        }
                        return newBox;
                    }
                });
            } else if (this.mode == 'hlighter' && e.target.attrs.name == 'hlighter') {
                _transformer = new Konva.Transformer({
                    nodes         : [e.target],
                    rotateEnabled : false,
                    enabledAnchors: ['top-left', 'top-center', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],
                    anchorSize    : 14,
                    borderDash    : [5, 5],
                    padding       : 7,
                    name          : 'transforms',
                    boundBoxFunc  : function (oldBox, newBox) {
                        var max_width = e.target.parent.parent.attrs.width - newBox.x;

                        if (Math.abs(newBox.width) < 1 || Math.abs(newBox.width) > max_width) {
                            return oldBox;
                        }
                        return newBox;
                    }
                });
            }
            // 텍스트 트랜스폼에 들어갈 버튼 생성
            var _deletebutton;
            if (!_deletebutton) {
                if (this.mode == 'text' && e.target.attrs.name == 'textNodes') {
                    _deletebutton = new Konva.Group({
                        x     : e.target.getWidth() + 3.5,
                        y     : -17,
                        width : 15,
                        height: 15,
                        name  : 'deletebutton',
                    });
                } else if (this.mode == 'image' && e.target.attrs.name == 'imageNodes') {
                    _deletebutton = new Konva.Group({
                        x     : e.target.getWidth() + 3.5,
                        y     : -17,
                        width : 15,
                        height: 15,
                        name  : 'deletebutton',
                    });
                } else if (this.mode == 'mathTool' && e.target.attrs.name == "setSquare") {
                    var get_width;
                    if (!e.target.attrs.width) {
                        get_width = e.target.getWidth() * e.target.scaleX();
                    } else {
                        get_width = e.target.attrs.width * e.target.scaleX();
                    }

                    _deletebutton = new Konva.Group({
                        x     : get_width + 9,
                        y     : -42,
                        width : 25,
                        height: 25,
                        name  : 'deletebutton',
                    });
                } else if (this.mode == 'mathTool' && e.target.attrs.name == "protractor") {
                    var get_width;
                    if (!e.target.attrs.width) {
                        get_width = e.target.getWidth() * e.target.scaleX();
                    } else {
                        get_width = e.target.attrs.width * e.target.scaleX();
                    }

                    _deletebutton = new Konva.Group({
                        x     : get_width + 9,
                        y     : -42,
                        width : 25,
                        height: 25,
                        name  : 'deletebutton',
                    });
                } else if (this.mode == 'mathTool' && e.target.attrs.name == "ruler") {
                    var get_width;
                    if (!e.target.attrs.width) {
                        get_width = e.target.getWidth() * e.target.scaleX();
                    } else {
                        get_width = e.target.attrs.width * e.target.scaleX();
                    }


                    _deletebutton = new Konva.Group({
                        y     : -42,
                        width : 25,
                        height: 25,
                        name  : 'deletebutton',
                    });

                    var node_width = (_transformer.width() + 10) * _transformer.scaleX();
                    _transformer.setAttrs({'width': node_width});
                    _deletebutton.x(node_width);

                } else if (this.mode == 'arrow' && e.target.attrs.name == 'arrow') {
                    var get_width;
                    if (!e.target.attrs.width) {
                        // get_width = e.target.getWidth() + (4 * e.target.scaleX());
                        get_width = e.target.getWidth() + (e.target.attrs.strokeWidth * e.target.scaleX());
                    } else {
                        // get_width = e.target.attrs.width + (4 * e.target.scaleX());
                        get_width = e.target.attrs.width + (e.target.attrs.strokeWidth * e.target.scaleX());
                    }

                    _deletebutton = new Konva.Group({
                        x     : get_width,
                        y     : -17,
                        width : 16,
                        height: 16,
                        name  : 'deletebutton',
                    });
                } else if (this.mode == 'straight' && e.target.attrs.name == 'straight') {
                    var get_width;
                    if (!e.target.attrs.width) {
                        // get_width = e.target.getWidth() + (4 * e.target.scaleX());
                        get_width = e.target.getWidth() + (e.target.attrs.strokeWidth * e.target.scaleX());
                    } else {
                        // get_width = e.target.attrs.width + (4 * e.target.scaleX());
                        get_width = e.target.attrs.width + (e.target.attrs.strokeWidth * e.target.scaleX());
                    }
                    _deletebutton = new Konva.Group({
                        x     : get_width,
                        y     : -17,
                        width : 16,
                        height: 16,
                        name  : 'deletebutton',
                    });
                } else if (this.mode == 'hlighter' && e.target.attrs.name == 'hlighter') {
                    var get_width;
                    if (!e.target.attrs.width) {
                        // get_width = e.target.getWidth() + (4 * e.target.scaleX());
                        get_width = e.target.getWidth() + (e.target.attrs.strokeWidth * e.target.scaleX());
                    } else {
                        // get_width = e.target.attrs.width + (4 * e.target.scaleX());
                        get_width = e.target.attrs.width + (e.target.attrs.strokeWidth * e.target.scaleX());
                    }
                    _deletebutton = new Konva.Group({
                        x     : get_width,
                        y     : -17,
                        width : 16,
                        height: 16,
                        name  : 'deletebutton',
                    });
                }
                ;

                var deleteicon = new Image();
                deleteicon.onload = function () {
                    _deletebutton.add(new Konva.Image({
                        width : 20,
                        height: 20,
                        image : deleteicon
                    }));
                    // 삭제 버튼 보이기
                    if (_deletebutton.parent != null) {
                        _deletebutton.draw();
                    }
                };

                // preview일때 경로 변경
                var _url = document.location.href.split('.html');
                var _target_url = _url[0].slice(-7);

                if (_target_url == 'preview' || $('#drawing-button').hasClass('active')) {
                    deleteicon.src = 'js/pc/ele/viewer/img/viewer/tr_delete.png';
                } else {
                    deleteicon.src = './images/tr_delete.png';
                }

                deleteicon.onload = function () {
                    _deletebutton.add(new Konva.Image({
                        width : 35,
                        height: 35,
                        image : deleteicon
                    }));
                    // 삭제 버튼 보이기
                    if (_deletebutton.parent != null) {
                        _deletebutton.draw();
                    }
                };
                deleteicon.src = 'http://localhost:8100/js/pc/ele/viewer/img/viewer/mathtool_delete.png';

                // 삭제 버튼 마우스 오버 시 포인터 변경
                _deletebutton.on('mouseenter', function () {
                    self.stage.container().style.cursor = 'pointer';
                });
                _deletebutton.on('mouseleave', function () {
                    self.stage.container().style.cursor = 'default';
                });

                _transformer.add(_deletebutton);

                // 오브젝트 삭제
                _deletebutton.on('click touchstart', function () {
                    // 삭제 시 마우스 커서가 포인터면 기본으로 변경
                    if (self.stage.container().style.cursor == 'pointer') {
                        self.stage.container().style.cursor = 'default';
                    }

                    var draw_target = e.target.parent;
                    _transformer.destroy();
                    e.target.destroy();
                    draw_target.draw();

                    // 텍스트 삭제 미러링
                    if (self.mode == 'text' && e.target.attrs.name == 'textNodes') {
                        var node_id = e.target.attrs.id;
                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDeleteNode('" + node_id + "' , '.textNodes');"
                        }));
                    }
                    ;

                    // 이미지 삭제 미러링  : 미러링으로 노드 전송 시 타겟팅 불가능하여 id 부여 후 해당 id 삭제
                    if (self.mode == 'image' && e.target.attrs.name == 'imageNodes') {
                        var node_id = e.target.attrs.id;
                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDeleteNode('" + node_id + "' , '.imageNodes');"
                        }));
                    }
                    ;

                    // 화살표 삭제 미러링
                    if (self.mode == 'arrow' && e.target.attrs.name == 'arrow') {
                        var node_id = e.target.attrs.id;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDeleteNode('" + node_id + "', '.arrow');"
                        }));
                    }
                    ;

                    // 직선 삭제 미러링
                    if (self.mode == 'straight' && e.target.attrs.name == 'straight') {
                        var node_id = e.target.attrs.id;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDeleteNode('" + node_id + "', '.straight');"
                        }));
                    }
                    ;

                    // 형광펜 삭제 미러링
                    if (self.mode == 'hlighter' && e.target.attrs.name == 'hlighter') {
                        var node_id = e.target.attrs.id;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDeleteNode('" + node_id + "', '.hlighter');"
                        }));
                    }
                    ;

                    // 수학교구 삭제 미러링
                    if (self.mode == 'mathTool' && (e.target.attrs.name == 'protractor' || e.target.attrs.name == 'setSquare' || e.target.attrs.name == 'ruler')) {
                        var node_id = e.target.attrs.id;

                        if (e.target.attrs.name == 'protractor') {
                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendDeleteNode('" + node_id + "', '.protractor');"
                            }));
                        } else if (e.target.attrs.name == 'setSquare') {
                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendDeleteNode('" + node_id + "', '.setSquare');"
                            }));
                        } else if (e.target.attrs.name == 'ruler') {
                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendDeleteNode('" + node_id + "', '.ruler');"
                            }));
                        }
                    }
                    ;


                    try {
                        // Node 삭제 시 save
                        self.drawJson = JSON.stringify(self.stage.toJSON());
                        self.save_canvas();
                    } catch (error) {

                    }
                });

                if (this.mode == 'text') {
                    // 텍스트 트랜스폼에 삭제 버튼 넣기
                    _transformer.on('transform', function () {
                        _deletebutton.x(_transformer.getWidth() + 3.5);
                    });
                    // 트랜스폼 움직일 때 버튼 맞추기
                    e.target.on('transform', function () {
                        var cavas_height = $('canvas').height() * 0.9;

                        if (e.target.height() > cavas_height) {
                            _transformer.stopTransform();
                            e.target.attrs.height = cavas_height;
                            e.target.attrs.width = $('canvas').width() * 0.8;
                        }

                        e.target.setAttrs({
                            width : e.target.width() * e.target.scaleX(),
                            scaleX: 1,
                            scaleY: 1,
                        });
                    });

                    e.target.on('dragend', function () {
                        self.save_canvas();

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.textNodes', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                        }));
                    });

                    _transformer.on('transformend', function () {
                        var _width = e.target.width();
                        var _height = e.target.height();
                        var _x = e.target.attrs.x;
                        var _y = e.target.attrs.y;
                        var _scaleX = e.target.attrs.scaleX;
                        var _scaleY = e.target.attrs.scaleY;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendTransformNode('" + e.target.attrs.id + "', '.textNodes', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + ");"
                        }));
                    });

                    this.textLayer.add(_transformer);
                    _transformer.nodes([e.target]);
                    _transformer.show();
                    this.textLayer.draw();

                } else if (this.mode == 'image') {
                    _transformer.on('transform', function () {
                        _deletebutton.x(_transformer.getWidth());

                    });

                    e.target.on('dragend', function () {
                        self.save_canvas();

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.imageNodes', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                        }));
                    });

                    _transformer.on('transformend', function () {
                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendTransformSticker('" + e.target.attrs.id + "', " + e.target.attrs.width + ");"
                        }));
                    });

                    this.imageLayer.add(_transformer);
                    _transformer.nodes([e.target]);
                    _transformer.show();
                    this.imageLayer.draw();

                } else if (this.mode == 'mathTool') {
                    _transformer.on('transform', function () {
                        _deletebutton.x(_transformer.getWidth() + 9);
                    });

                    if (e.target.attrs.name == 'ruler') {
                        // 삭제 버튼 같이 이동
                        _transformer.on('transform', function () {
                            var node_width = (_transformer.width() + 10) * _transformer.scaleX();
                            _transformer.setAttrs({'width': node_width});
                            _deletebutton.x(node_width);

                            // transform하는 동안 ruler_group x, y, scaleX, scaleY는 변하지 않음
                            self.ruler_group.attrs.scaleX = 1;
                            self.ruler_group.attrs.scaleY = 1;
                        })
                    }

                    e.target.on('dragend', function () {
                        // 앵커 위치 변경
                        // 자

                        if (e.target.attrs.name == 'ruler') {
                            if (_transformer.find('.middle-right').length != 0) {
                                _transformer.find('.middle-right')[0].setAttr('x', _transformer.find('.middle-right')[0].attrs.x + 17);
                                _transformer.find('.middle-right')[0].setAttr('y', _transformer.find('.middle-right')[0].attrs.y + 2);
                            }
                            // 자 미러링
                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.ruler', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                            }));
                        }

                        self.mathToolLayer.draw();

                        // 미러링
                        if (e.target.attrs.name == 'protractor') {
                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.protractor', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                            }));
                        }
                        if (e.target.attrs.name == 'setSquare') {
                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.setSquare', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                            }));
                        }
                    });

                    _transformer.on('transformend', function () {
                        var _width = e.target.width();
                        var _height = e.target.height();
                        var _x = e.target.attrs.x;
                        var _y = e.target.attrs.y;
                        var _scaleX = e.target.attrs.scaleX;
                        var _scaleY = e.target.attrs.scaleY;
                        var _rotation = e.target.attrs.rotation;

                        // 앵커 위치 변경
                        // 자
                        if (e.target.attrs.name == 'ruler') {
                            _transformer.find('.middle-right')[0].setAttr('x', _transformer.find('.middle-right')[0].attrs.x + 17);
                            _transformer.find('.middle-right')[0].setAttr('y', _transformer.find('.middle-right')[0].attrs.y + 2);

                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "sendTransformMathTools('" + e.target.attrs.id + "', '.ruler', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + "," + _rotation + " );"
                            }));
                        }

                        // 각도기, 삼각자
                        if (e.target.attrs.name == 'protractor' || e.target.attrs.name == 'setSquare') {
                            _transformer.find('.bottom-right')[0].setAttr('x', _transformer.find('.bottom-right')[0].attrs.x + 15);
                            _transformer.find('.bottom-right')[0].setAttr('y', _transformer.find('.bottom-right')[0].attrs.y + 15);

                            if (e.target.attrs.name == 'protractor') {
                                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                    type  : "script",
                                    detail: "sendTransformMathTools('" + e.target.attrs.id + "', '.protractor', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + "," + _rotation + " );"
                                }));
                            }

                            if (e.target.attrs.name == 'setSquare') {
                                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                    type  : "script",
                                    detail: "sendTransformMathTools('" + e.target.attrs.id + "', '.setSquare', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + "," + _rotation + " );"
                                }));
                            }
                        }

                        self.mathToolLayer.draw();
                    });

                    this.mathToolLayer.add(_transformer);
                    _transformer.nodes([e.target]);
                    _transformer.show();
                    // this.mathToolLayer.draw();
                    this.mathToolLayer.batchDraw();

                    // 앵커 위치 변경
                    // 자
                    _transformer.find('.middle-right')[0].setAttr('x', _transformer.find('.middle-right')[0].attrs.x + 17);
                    _transformer.find('.middle-right')[0].setAttr('y', _transformer.find('.middle-right')[0].attrs.y + 2);

                    // 각도기, 삼각자
                    _transformer.find('.bottom-right')[0].setAttr('x', _transformer.find('.bottom-right')[0].attrs.x + 15);
                    _transformer.find('.bottom-right')[0].setAttr('y', _transformer.find('.bottom-right')[0].attrs.y + 15);

                    this.mathToolLayer.draw();

                } else if (this.mode == 'arrow') {
                    e.target.on('transform', function () {
                        e.target.setAttrs({
                            width: e.target.width() * e.target.scaleX()
                        });
                    });

                    e.target.on('dragend', function () {
                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.arrow', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                        }));
                    });

                    _transformer.on('transform', function () {
                        _deletebutton.x(_transformer.getWidth());
                    });

                    _transformer.on('transformend', function () {
                        var _width = e.target.width();
                        var _height = e.target.height();
                        var _x = e.target.attrs.x;
                        var _y = e.target.attrs.y;
                        var _scaleX = e.target.attrs.scaleX;
                        var _scaleY = e.target.attrs.scaleY;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendTransformNode('" + e.target.attrs.id + "', '.arrow', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + ");"
                        }));
                    });

                    this.imageLayer.add(_transformer);
                    _transformer.nodes([e.target]);
                    _transformer.show();
                    this.imageLayer.draw();

                } else if (this.mode == 'straight') {
                    e.target.on('transform', function () {
                        e.target.setAttrs({
                            width: e.target.width() * e.target.scaleX()
                        });
                    });

                    e.target.on('dragend', function () {
                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.straight', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                        }));
                    });

                    _transformer.on('transform', function () {
                        _deletebutton.x(_transformer.getWidth());
                    });

                    _transformer.on('transformend', function () {
                        var _width = e.target.width();
                        var _height = e.target.height();
                        var _x = e.target.attrs.x;
                        var _y = e.target.attrs.y;
                        var _scaleX = e.target.attrs.scaleX;
                        var _scaleY = e.target.attrs.scaleY;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendTransformNode('" + e.target.attrs.id + "', '.straight', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + ");"
                        }));
                    });

                    this.imageLayer.add(_transformer);
                    _transformer.nodes([e.target]);
                    _transformer.show();
                    this.imageLayer.draw();

                } else if (this.mode == 'hlighter') {
                    e.target.on('transform', function () {
                        e.target.setAttrs({
                            width: e.target.width() * e.target.scaleX()
                        });
                    });

                    _transformer.on('transform', function () {
                        _deletebutton.x(_transformer.getWidth());
                    });

                    e.target.on('dragend', function () {
                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendDragMoveNode('" + e.target.attrs.id + "', '.hlighter', " + e.target.attrs.x + ", " + e.target.attrs.y + ");"
                        }));
                    });

                    _transformer.on('transformend', function () {
                        var _width = e.target.width();
                        var _height = e.target.height();
                        var _x = e.target.attrs.x;
                        var _y = e.target.attrs.y;
                        var _scaleX = e.target.attrs.scaleX;
                        var _scaleY = e.target.attrs.scaleY;

                        window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                            type  : "script",
                            detail: "sendTransformNode('" + e.target.attrs.id + "', '.hlighter', " + _width + ", " + _height + ", " + _x + ", " + _y + ", " + _scaleX + " ," + _scaleY + ");"
                        }));
                    });

                    this.imageLayer.add(_transformer);
                    _transformer.nodes([e.target]);
                    _transformer.show();
                    this.imageLayer.draw();
                }
                ;

                var _zoombutton;
                if (!_zoombutton) {
                    // if (e.target.attrs.name == "ruler") {
                    //     return false;
                    // }

                    // 삼각자, 각도기
                    if (this.mode == 'mathTool' && (e.target.attrs.name == "setSquare" || e.target.attrs.name == "protractor")) {
                        var get_width, get_height;
                        if (!e.target.attrs.width) {
                            get_width = e.target.getWidth() * e.target.scaleX();
                            get_height = e.target.getHeight() * e.target.scaleY();
                        } else {
                            get_width = e.target.attrs.width * e.target.scaleX();
                            get_height = e.target.attrs.height * e.target.scaleY();
                        }

                        _zoombutton = new Konva.Group({
                            x        : get_width + 10,
                            y        : get_height + 10,
                            width    : 35,
                            height   : 35,
                            listening: false,
                            name     : 'zoombutton',
                        });

                        var zoomicon = new Image();
                        zoomicon.onload = function () {
                            _zoombutton.add(new Konva.Image({
                                width : 35,
                                height: 35,
                                image : zoomicon
                            }));

                            if (_zoombutton.parent != null) {
                                _zoombutton.draw();
                            }
                        };
                        zoomicon.src = '/assets/viewer/img/viewer/mathtool_zoom.png';
                        _transformer.findOne('.bottom-right').strokeEnabled(false);


                        _transformer.add(_zoombutton);
                        _zoombutton.moveToBottom();

                        _transformer.on('transform', function () {
                            _zoombutton.x(_transformer.getWidth() + 10);
                            _zoombutton.y(_transformer.getHeight() + 10);
                            _transformer.findOne('.bottom-right').strokeEnabled(false);

                            _rotatebutton.x((_transformer.getWidth() / 2) - 9);
                            _rotatebutton.y(-80);
                            _transformer.findOne('.rotater').strokeEnabled(false);
                        });
                    } else if (this.mode == 'mathTool' && e.target.attrs.name == "ruler") {
                        // ruler zoom
                        var get_width, get_height;

                        if (!e.target.attrs.width) {
                            get_width = e.target.getWidth() * e.target.scaleX();
                            get_height = e.target.getHeight() * e.target.scaleY();
                        } else {
                            get_width = e.target.attrs.width * e.target.scaleX();
                            get_height = e.target.attrs.height * e.target.scaleY();
                        }

                        _zoombutton = new Konva.Group({
                            x        : _transformer.width() + 12,
                            y        : (get_height / 2) - 15,
                            width    : 35,
                            height   : 35,
                            listening: false,
                            name     : 'zoombutton',
                        });

                        var zoomicon = new Image();
                        zoomicon.onload = function () {
                            _zoombutton.add(new Konva.Image({
                                width : 35,
                                height: 35,
                                image : zoomicon
                            }));

                            if (_zoombutton.parent != null) {
                                _zoombutton.draw();
                            }
                        };
                        zoomicon.src = '/assets/viewer/img/viewer/mathtool_ruler_zoom.png';
                        _transformer.findOne('.middle-right').strokeEnabled(false);

                        _transformer.add(_zoombutton);

                        _zoombutton.moveToBottom();

                        _transformer.on('transform', function () {
                            _zoombutton.x(_transformer.getWidth() + 12);
                            _zoombutton.y((_transformer.getHeight() / 2) - 17);
                        });
                    }

                    // 확대 버튼 마우스 오버 시 포인터 변경
                    _transformer.findOne('.bottom-right').on('mouseenter', function (e) {
                        self.stage.container().style.cursor = 'pointer !important';
                    });
                    _transformer.findOne('.bottom-right').on('mouseleave', function (e) {
                        self.stage.container().style.cursor = 'default !important';
                    });
                    //
                }
                ;

                // var _rotatebutton;
                // if (!_rotatebutton) {
                //     if (this.mode == 'mathTool' && (e.target.attrs.name == "setSquare" || e.target.attrs.name == "protractor" || e.target.attrs.name == 'ruler')) {
                //         var get_width, get_height;
                //         if (!e.target.attrs.width) {
                //             get_width = e.target.getWidth() * e.target.scaleX();
                //             get_height = e.target.getHeight() * e.target.scaleY();
                //         } else {
                //             get_width = e.target.attrs.width * e.target.scaleX();
                //             get_height = e.target.attrs.height * e.target.scaleY();
                //         }
                //
                //         _rotatebutton = new Konva.Group({
                //             x        : -80,
                //             y        : -80,
                //             width    : 35,
                //             height   : 35,
                //             listening: false,
                //             name     : 'rotatebutton',
                //         });
                //
                //         var rotateicon = new Image();
                //         rotateicon.onload = function () {
                //             _rotatebutton.add(new Konva.Image({
                //                 width : 35,
                //                 height: 35,
                //                 image : rotateicon
                //             }));
                //
                //             _rotatebutton.x(-80);
                //             // !! 여기 바꿈. 원래 값은 -80
                //             _rotatebutton.y(-80);
                //             // _rotatebutton.y(210);
                //
                //             // console.log(_transformer)
                //
                //             // self.stage.find('.rotater')[0].setAttrs({
                //             //     'y': 230,
                //             // });
                //             // self.stage.batchDraw();
                //
                //
                //             if (_rotatebutton.parent != null) {
                //                 _rotatebutton.draw();
                //             }
                //         };
                //         rotateicon.src = '/assets/viewer/img/viewer/mathtool_rotate.png';
                //         self.stage.find('.rotater')[0].strokeEnabled(false);
                //
                //         _transformer.add(_rotatebutton);
                //         _rotatebutton.moveToTop();
                //
                //     }
                //
                //     _transformer.on('transform', function () {
                //         _rotatebutton.x(-80);
                //         _rotatebutton.y(-80);
                //         self.stage.find('.rotater')[0].strokeEnabled(false);
                //     });
                // };
                // 드래그 시 노드 이동
                e.target.on('touchstart mousedown', function (e) {
                    if (_transformer.parent != null) {
                        e.target.draggable(true);
                    }
                });

                // 드래그 끝나면 이동 멈춤
                e.target.on('dragend touchend', function (e) {
                    e.target.draggable(false);
                    e.target.attrs.draggable = true;
                });
            }
        },
        _onclick       : function DrawingCanvas_onclick(e) {
            var self = this;

            if (this.mode == 'text' && e.target.attrs.name == "textNodes") {

                this._setTransformer(e);
                this.save_canvas();

            } else if (this.mode == 'image' && e.target.attrs.name == "imageNodes") {

                this._setTransformer(e);
            } else if (this.mode == 'mathTool' && (e.target.attrs.name == "setSquare" || e.target.attrs.name == "protractor")) {
                this._setTransformer(e);

                this.node_keydown_event(e);

                // this.drawarrowLine 영역 밖으로 나가지 않도록 함
                e.target.off('dragmove touchmove transform').on('dragmove touchmove transform', function (e) {
                    var stage_width = $('.konvajs-content').width();
                    var stage_height = $('.konvajs-content').height();
                    var box = e.target.getClientRect();
                    var absPos = e.target.getAbsolutePosition();
                    var offsetX = box.x - absPos.x;
                    var offsetY = box.y - absPos.y;
                    var newAbsPos = absPos;

                    if (box.x < 0) {
                        newAbsPos.x = -(offsetX - 25);
                    }
                    if (box.y < 0) {
                        newAbsPos.y = -(offsetY - 25);
                    }
                    if (box.x + box.width > stage_width) {
                        newAbsPos.x = (stage_width - box.width - offsetX) - 25;
                    }
                    if (box.y + box.height > stage_height) {
                        newAbsPos.y = (stage_height - box.height - offsetY) - 25;
                    }
                    e.target.setAbsolutePosition(newAbsPos)
                });
            } else if (this.mode == 'mathTool' && e.target.attrs.name == "ruler") {
                e.target = self.stage.find('#ruler')[0];

                this._setTransformer(e);
                this.node_keydown_event(e);

                e.target.off('dragstart touchstart').on('dragstart touchstart', function (e) {

                    if (e.target.attrs.id == 'grad_wrap') {
                        self.stage.find('#ruler').fire('click');
                    }
                });

                e.target.off('dragmove touchmove transform').on('dragmove touchmove transform', function (e) {
                    var stage_width = $('.konvajs-content').width();
                    var stage_height = $('.konvajs-content').height();
                    var box = e.target.getClientRect();
                    var absPos = e.target.getAbsolutePosition();
                    var offsetX = box.x - absPos.x;
                    var offsetY = box.y - absPos.y;
                    var newAbsPos = absPos;

                    if (box.x < 0) {
                        newAbsPos.x = -(offsetX - 25);
                    }
                    if (box.y < 0) {
                        newAbsPos.y = -(offsetY - 25);
                    }
                    if (box.x + box.width > stage_width) {
                        newAbsPos.x = (stage_width - box.width - offsetX) - 25;
                    }
                    if (box.y + box.height > stage_height) {
                        newAbsPos.y = (stage_height - box.height - offsetY) - 25;
                    }
                    e.target.setAbsolutePosition(newAbsPos)
                });
            } else if (this.mode == 'arrow' && e.target.attrs.name == "arrow") {

                this._setTransformer(e);

                // this.drawarrowLine 영역 밖으로 나가지 않도록 함
                e.target.off('dragmove touchmove transform').on('dragmove touchmove transform', function (e) {
                    var stage_width = $('.konvajs-content').width();
                    var stage_height = $('.konvajs-content').height();
                    var box = e.target.getClientRect();
                    var absPos = e.target.getAbsolutePosition();
                    var offsetX = box.x - absPos.x;
                    var offsetY = box.y - absPos.y;
                    var newAbsPos = absPos;

                    if (box.x < 0) {
                        newAbsPos.x = -(offsetX - 25);
                    }
                    if (box.y < 0) {
                        newAbsPos.y = -(offsetY - 25);
                    }
                    if (box.x + box.width > stage_width) {
                        newAbsPos.x = (stage_width - box.width - offsetX) - 25;
                    }
                    if (box.y + box.height > stage_height) {
                        newAbsPos.y = (stage_height - box.height - offsetY) - 25;
                    }
                    e.target.setAbsolutePosition(newAbsPos)
                });
            } else if (this.mode == 'straight' && e.target.attrs.name == "straight") {

                this._setTransformer(e);

            } else if (this.mode == 'hlighter' && e.target.attrs.name == "hlighter") {

                this._setTransformer(e);

                // 형광펜 그리기 멈춤
                this.is_drawing = false;

            } else if (this.mode == 'brush' || this.mode == 'eraser') {
                self.transformer_destroy();
                this.set_draggable_false();
                return;
            } else if (e.target.attrs.name == 'stage') {
                self.transformer_destroy();
                this.set_draggable_false();
            } else {
                this.set_draggable_false();
            }
        },

        _ondblclick           : function DrawingCanvas_ondblclick(e) {
            if (this.mode == 'brush' || this.mode == 'eraser') {
                return;
            } else if (this.mode == 'text' && e.target.attrs.name == 'stage') {
                this.textwrite();
                var textNodes_length = this.stage.find('.textNodes').length - 1;
                this.stage.find('.textNodes')[textNodes_length].fire('dblclick');
                // this.stage.find('.textNodes')[textNodes_length].fire('dbltap');
                this.textLayer.draw();

            } else {

            }
        },
        _onmousedown          : function DrawingCanvas_onmousedown(e) {
            if (!this.active) {
                return;
            }
            ;

            if (this.mode == 'brush' || this.mode == 'eraser') {
                var pos = this.stage.getPointerPosition();
                this.drawlineWithDetail(pos.x, pos.y, this.mode, this.stroke, this.strokeWidth);
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "drawlineWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.stroke + "'," + this.strokeWidth + " );"
                }));
                this.is_drawing = true;
            }
            ;

            if ((this.mode == 'hlighter') && this.mode != 'image') {
                if (this.stage.find('.transforms').length > 0) {
                    return;
                } else {
                    this.is_drawing = true;
                }

                // 미러링을 위한id값 동일하게 생성
                this.node_id = undefined;
                this.make_uuid();
                // 미러링 서버로 id 전송
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "sendNodeId('" + this.node_id + "');"
                }));

                var pos = this.stage.getPointerPosition();
                this.drawHlighterWithDetail(pos.x, pos.y, this.mode, this.hlighter_color, this.hlighter_width, this.opacity);
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "drawHlighterWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.hlighter_color + "'," + this.hlighter_width + ", " + this.opacity + " );"
                }));
            }
            ;

            if ((this.mode == 'straight') && this.mode != 'image') {
                if (this.stage.find('.transforms').length > 0) {
                    return;
                } else {
                    this.is_drawing = true;
                }

                // 미러링을 위한id값 동일하게 생성
                this.node_id = undefined;
                this.make_uuid();
                // 미러링 서버로 id 전송
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "sendNodeId('" + this.node_id + "');"
                }));

                var pos = this.stage.getPointerPosition();

                this.make_lineWithDetail(pos.x, pos.y, this.mode, this.straight_color, this.straight_width, this.straight_dash, this.opacity);
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "make_lineWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.straight_color + "', " + this.straight_width + ", [" + this.straight_dash + "], " + this.opacity + ");"
                }));
            }
            ;

            if ((this.mode == 'arrow') && (this.mode != 'image') && e.target.attrs.name != 'arrow') {
                if (this.stage.find('.transforms').length > 0) {
                    return;
                } else {
                    this.is_drawing = true;
                }

                // 미러링을 위한id값 동일하게 생성
                this.node_id = undefined;
                this.make_uuid();
                // 미러링 서버로 id 전송
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "sendNodeId('" + this.node_id + "');"
                }));

                var pos = this.stage.getPointerPosition();
                this.make_default_arrowWithDetail(pos.x, pos.y, this.mode, this.arrow_fill, this.arrow_stroke, this.pointerAtBeginning, this.arrow_direction, this.arrow_strokewidth, this.arrow_dash);

                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "make_default_arrowWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.arrow_fill + "', '" + this.arrow_stroke + "', " + this.pointerAtBeginning + ", '" + this.arrow_direction + "', " + this.arrow_strokewidth + ", [" + this.arrow_dash + "]);"
                }));
            }
            ;
        },
        _onmousemove          : function DrawingCanvas_onmousemove(e) {
            if (!this.active) {
                return;
            }
            if (this.transformer) {
                return;
            }
            if (!this.is_drawing) {
                return;
            }
            ;

            if (this.mode == 'brush' || this.mode == 'eraser') {
                var pos = this.stage.getPointerPosition();
                this.drawlineWithDetail(pos.x, pos.y, this.mode, this.stroke, this.strokeWidth);
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "drawlineWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.stroke + "'," + this.strokeWidth + " );"
                }));
            }
            ;

            if (this.mode == 'hlighter') {
                var pos = this.stage.getPointerPosition();
                this.drawHlighterWithDetail(pos.x, pos.y, this.mode, this.hlighter_color, this.hlighter_width, this.opacity);
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "drawHlighterWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.hlighter_color + "'," + this.hlighter_width + ", " + this.opacity + " );"
                }));
            }
            ;

            if (this.mode == 'straight') {
                var pos = this.stage.getPointerPosition();
                this.make_lineWithDetail(pos.x, pos.y, this.mode, this.straight_color, this.straight_width, this.straight_dash, this.opacity);
                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "make_lineWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.straight_color + "', " + this.straight_width + ", [" + this.straight_dash + "], " + this.opacity + ");"
                }));
            }
            ;

            if (this.mode == 'arrow') {
                var pos = this.stage.getPointerPosition();

                this.make_default_arrowWithDetail(pos.x, pos.y, this.mode, this.arrow_fill, this.arrow_stroke, this.pointerAtBeginning, this.arrow_direction, this.arrow_strokewidth, this.arrow_dash);

                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "make_default_arrowWithDetail(" + pos.x + "," + pos.y + ", '" + this.mode + "', '" + this.arrow_fill + "', '" + this.arrow_stroke + "', " + this.pointerAtBeginning + ", '" + this.arrow_direction + "', " + this.arrow_strokewidth + ", [" + this.arrow_dash + "]);"
                }));
            }
            ;
        },
        _onmouseup            : function DrawingCanvas_onmouseup(e) {
            if (!this.active) {
                return;
            }
            if (this.transformer) {
                return;
            }
            if (e.target.tagName != 'CANVAS') {
                return;
            }

            if ((this.mode == 'brush' || this.mode == 'eraser') && this.is_drawing == true) {
                this.save_canvas();

                this.stop_drawline();

                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "stop_drawline();"
                }));
            }
            ;

            if (this.mode == 'hlighter') {
                this.stop_drawHlighter();

                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "stop_drawHlighter();"
                }));
            }
            ;

            if (this.mode == 'straight') {
                this.stop_drawStraight();

                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "stop_drawStraight();"
                }));
            }
            ;

            if (this.mode == 'arrow') {
                this.stop_drawArrow();

                window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                    type  : "script",
                    detail: "stop_drawArrow();"
                }));
            }
            ;
        },
        sendTransformSticker  : function DrawingCanvas_sendTransformSticker(id, width) {
            var self = this;
            var _id = id;
            var _width = width;

            self.stage.find('.imageNodes').each(function (i) {
                if (_id == i.attrs.id) {
                    var _clone = i.clone({
                        'width' : _width,
                        'height': _width
                    });

                    i.destroy();

                    self.imageLayer.add(_clone);
                    self.imageLayer.draw();
                }
                ;
            });
        },
        sendTransformNode     : function DrawingCanvas_sendTransformNode(id, type, width, height, x, y, scaleX, scaleY) {
            var self = this;
            var _id = id;
            var _type = type;
            var _width = width;
            var _height = height;
            var _x = x;
            var _y = y;
            var _scaleX = scaleX;
            var _scaleY = scaleY;

            self.stage.find(_type).each(function (i) {
                if (_id == i.attrs.id) {
                    var _clone = i.clone({
                        'width' : _width,
                        'height': _height,
                        'x'     : _x,
                        'y'     : _y,
                        'scaleX': _scaleX,
                        'scaleY': _scaleY
                    });

                    i.destroy();

                    if (_type == '.textNodes') {
                        self.textLayer.add(_clone);
                        self.textLayer.draw();
                    } else {
                        self.imageLayer.add(_clone);
                        self.imageLayer.draw();
                    }
                }
                ;
            });
        },
        sendTransformMathTools: function DrawingCanvas_sendTransformMathTools(id, type, width, height, x, y, scaleX, scaleY, rotation) {
            var self = this;
            var _id = id;
            var _type = type;
            var _width = width;
            var _height = height;
            var _x = x;
            var _y = y;
            var _scaleX = scaleX;
            var _scaleY = scaleY;
            var _rotation = rotation;

            self.stage.find(_type).each(function (i) {
                if (_id == i.attrs.id) {
                    console.log(i.attrs.id)
                    var _clone = i.clone({
                        'width'   : _width,
                        'height'  : _height,
                        'x'       : _x,
                        'y'       : _y,
                        'scaleX'  : _scaleX,
                        'scaleY'  : _scaleY,
                        'rotation': _rotation
                    });
                    i.destroy();

                    self.mathToolLayer.add(_clone);
                    self.mathToolLayer.draw();
                }
                ;
            });
        },
        sendDragMoveNode      : function DrawingCanvas_sendDragMoveNode(id, type, x, y) {
            var self = this;
            var _id = id;
            var _type = type;
            var _x = x;
            var _y = y;

            self.stage.find(_type).each(function (i) {
                if (_id == i.attrs.id) {
                    var _clone = i.clone({
                        x: _x,
                        y: _y
                    });

                    i.destroy();

                    if (_type == '.textNodes') {
                        self.textLayer.add(_clone);
                        self.textLayer.draw();
                    } else if (_type == '.protractor' || _type == '.setSquare' || _type == '.ruler') {
                        self.mathToolLayer.add(_clone);
                        self.mathToolLayer.draw();
                    } else {
                        self.imageLayer.add(_clone);
                        self.imageLayer.draw();
                    }
                }
                ;
            });
        },
        sendDeleteNode        : function DrawingCanvas_sendDeleteNode(id, type) {
            var self = this;
            var _id = id;
            var _type = type;

            self.stage.find(_type).each(function (i) {
                if (_id == i.attrs.id) {

                    i.destroy();

                    if (_type == '.textNodes') {
                        self.textLayer.draw();
                    } else if (_type == '.protractor' || _type == '.setSquare' || _type == '.ruler') {
                        self.mathToolLayer.draw();
                    } else {
                        self.imageLayer.draw();
                    }
                }
            });
        },
        _is_contains          : function (rect, point) {
            return rect.left <= point.x && point.x <= rect.left + rect.width && rect.top <= point.y && point.y <= rect.top + rect.height;
        },
        set_draggable_false   : function DrawingCanvas_set_draggable_false() {
            if (this.stage) {
                this.stage.find('.textNodes').draggable(false);
                this.stage.find('.imageNodes').draggable(false);
                this.stage.find('.arrow').draggable(false);
                this.stage.find('.straight').draggable(false);
                this.stage.find('.hlighter').draggable(false);
                this.stage.find('#ruler').draggable(false);
            }
        },
        // board start
        board_start   : function DrawingCanvas_board_start() {
            this._activateCommon();
            this.mode = 'text';

            var textNodes_length = this.stage.find('.textNodes').length;

            // 기존에 text가 있으면 textarea box 생성 안 함
            if (textNodes_length == 0) {
                this.first_make_textarea = true;
                this.textwrite();
                this.stage.find('.textNodes')[0].fire('dblclick');
                // this.stage.find('.textNodes')[0].fire('dbltap');
            } else {
                this.first_make_textarea = false;
            }
            this.textLayer.draw();
        },
        send_text_node: function DrawingCanvas_send_text_node(textNode) {
            var self = this;

            var text = Konva.Node.create(JSON.parse(textNode));

            if (text.attrs.hasOwnProperty('text')) {
                document.fonts.ready.then(function () {
                    self.textLayer.add(text);
                    self.textLayer.draw();
                });
            } else {
                text.destroy();
                return;
            }
        },
        // make text node
        textwrite                        : function DrawingCanvas_textwrite() {
            var self = this;
            if (this.is_drawing) {
                this.stop_drawline();
            }

            // 일정부분 범위 외 클릭 시 조금 더 안쪽에 textarea box 생성하도록 함
            var board_width = $('#board_container').width();
            var board_height = $('#board_container').height();

            if (!board_width) {
                board_width = $('.drawing-canvas').width();
                board_height = $('.drawing-canvas').height();
            }
            ;

            var _points = self.stage.getPointerPosition();
            var textarea_x = undefined;
            var textarea_y = undefined;

            if (this.first_make_textarea) {
                textarea_x = 50;
                textarea_y = 50;
                this.first_make_textarea = false;
            } else {
                if (_points.x > (board_width - (board_width * 0.2)) || _points.y > (board_height - (board_height * 0.2))) {
                    if (_points.x > (board_width - (board_width * 0.2)) && _points.y > (board_height - (board_height * 0.2))) {
                        textarea_x = board_width - (board_width * 0.2);
                        textarea_y = board_height - (board_height * 0.2);
                    } else if (_points.x > (board_width - (board_width * 0.2))) {
                        textarea_x = board_width - (board_width * 0.2);
                        textarea_y = _points.y;
                    } else if (_points.y > (board_height - (board_height * 0.2))) {
                        textarea_x = _points.x;
                        textarea_y = board_height - (board_height * 0.2);
                    }
                } else {
                    textarea_x = _points.x;
                    textarea_y = _points.y;
                }
            }
            ;

            // 미러링을 위한id값 동일하게 생성
            this.node_id = undefined;
            this.make_uuid();
            // 미러링 서버로 id 전송
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "sendNodeId('" + this.node_id + "');"
            }));
            // id를 uuid로 지정
            var node_id = this.node_id;

            // 노드 생성
            var textNode = new Konva.Text({
                text      : '',
                id        : node_id,
                x         : textarea_x,
                y         : textarea_y,
                fontFamily: this.fontFamily,
                fontSize  : this.fontSize,
                draggable : false,
                // width: board_width,
                width : board_width * 0.8,
                height: 'auto',
                fill  : this.fill,
                name  : 'textNodes',
            });

            this.textLayer.add(textNode);
            this.textLayer.draw();

            // textnode click
            textNode.on('click touchstart', function (e) {
                // textnode 바깥을 클릭 했을 때 선택 해제
                function textHandleOutsideClick(e) {
                    if (e.target != textNode) {
                        if (textNode.parent != null) {
                            textNode.parent.parent.find('.transforms').destroy();
                            textNode.parent.draw();
                            textNode.draggable(false);
                        }
                    }
                };

                setTimeout(function () {
                    window.addEventListener('dblclick', textHandleOutsideClick);
                    window.addEventListener('dbltap', textHandleOutsideClick);
                });

            });
            // textnode dblclick
            textNode.on('dblclick dbltap', function (e) {
                // textNode.on('dblclick', function (e) {
                var _target = e.target;
                if (self.mode != 'text') {
                    return;
                }

                // 트랜스폼 삭제
                textNode.parent.parent.find('.transforms').destroy();
                // draggable 해제
                e.target.parent.draggable(false);
                // 텍스트 영역 가리기
                e.target.hide();
                e.target.parent.draw();

                var textPosition = _target.absolutePosition();
                var stageBox = _target.parent.parent.container().getBoundingClientRect();

                // window board scale
                var matches;
                var iframe_matches;
                var _get_parent_scaleX = 1;
                var _get_parent_scaleY = 1;

                if (self.type == 'BOARD') {
                    var win_board_get_scale = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
                        matches = $('#board_wrap').css('transform').match(win_board_get_scale);
                    // matches = $('.konvajs-content').parent().css('transform').match(win_board_get_scale);
                } else {
                    var stage_parent = $('.konvajs-content').parent();

                    if (stage_parent.attr('id') == 'drawing-control') {
                        _get_parent_scaleX = 1;
                        _get_parent_scaleY = 1;
                    } else {
                        var iframe_get_scale = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
                            iframe_matches = stage_parent.parent().css('transform').match(iframe_get_scale);
                        // iframe_matches = $('.drawing-canvas-wrapper').css('transform').match(iframe_get_scale);
                        // iframe scale 정보
                        _get_parent_scaleX = iframe_matches[1];
                        _get_parent_scaleY = iframe_matches[2];
                    }
                }

                //
                var areaPosition;

                if (matches != null) {
                    var win_board_s_x = matches[1];
                    var win_board_s_y = matches[2];

                    areaPosition = {
                        x: (stageBox.left + textPosition.x) * win_board_s_x,
                        y: (stageBox.top + textPosition.y) * win_board_s_y,
                    }
                } else {
                    areaPosition = {
                        x: stageBox.left + textPosition.x,
                        y: stageBox.top + textPosition.y,
                    }
                }
                ;

                // var areaPosition = {
                //     x: stageBox.left + textPosition.x,
                //     y: stageBox.top + textPosition.y,
                // };

                var textarea = document.createElement('textarea');
                document.body.appendChild(textarea);

                textarea.value = _target.text();
                textarea.style.position = 'absolute';

                if (self.type == 'BOARD') {
                    textarea.style.top = areaPosition.y + 'px';
                    textarea.style.left = areaPosition.x + 'px';
                    textarea.style.width = _target.width() + 'px';
                    textarea.style.height = _target.height() + 'px';
                    textarea.style.maxWidth = (self.stage.attrs.width - areaPosition.x) + 'px';
                    textarea.style.maxheight = (self.stage.attrs.height - areaPosition.y) + 'px';
                } else {
                    textarea.style.top = (areaPosition.y * _get_parent_scaleY) + 'px';
                    textarea.style.left = (areaPosition.x * _get_parent_scaleX) + 'px';
                    textarea.style.width = (self.stage.attrs.width * _get_parent_scaleX) + 'px';
                    textarea.style.height = (_target.height() * _get_parent_scaleY) + 'px';
                    textarea.style.maxWidth = (self.stage.attrs.width - textPosition.x) * _get_parent_scaleX + 'px';
                    textarea.style.maxheight = ((self.stage.attrs.height - textPosition.y) * _get_parent_scaleY) + 'px';
                    // textarea.style.maxWidth = ((self.stage.attrs.width - areaPosition.x) * _get_parent_scaleX) + 'px';
                    // textarea.style.maxheight = ((self.stage.attrs.height - areaPosition.y) * _get_parent_scaleY) + 'px';
                }
                ;

                // 이미 textarea에 내용이 있는 경우 내용만큼 width 변경
                if (_target.text() != '') {
                    textarea.style.width = (_target.width() * _get_parent_scaleX) + 'px';
                }
                ;

                textarea.style.fontSize = _target.attrs.fontSize + 'px';
                textarea.style.border = '1px solid rbga(255, 255, 255, 0.1)';
                // textarea.style.border = 'none';
                textarea.style.padding = '0px';
                textarea.style.margin = '0px';
                textarea.style.overflow = 'hidden';
                textarea.style.background = 'none';
                textarea.style.outline = 'none';
                textarea.style.resize = 'none';
                textarea.style.fontWeight = 'normal';
                textarea.style.lineHeight = 1;
                textarea.style.fontFamily = _target.attrs.fontFamily;
                textarea.style.transformOrigin = 'left top';
                textarea.style.textAlign = _target.align();
                textarea.style.color = _target.attrs.fill;
                textarea.style.pointerEvents = 'none';
                textarea.style.zIndex = 1;
                // maxLength
                textarea.maxLength = 75;
                // maxRows
                textarea.rows = Math.floor(parseInt(_target.parent.parent.attrs.height) / parseInt(_target.attrs.fontSize));

                var transform = '';
                var px = 0;
                var isFirefox =
                    navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                if (isFirefox) {
                    px += 2 + Math.round(_target.fontSize() / 20);
                }
                transform += 'translateY(-' + px + 'px)';

                textarea.style.transform = transform;
                // textarea.style.height = 'auto';
                // textarea.style.height = textarea.scrollHeight + 3 + 'px';
                // textarea.style.maxheight = (_target.parent.parent.attrs.height - areaPosition.y) + 'px';

                textarea.focus();

                function removeTextarea() {
                    textarea.parentNode.removeChild(textarea);

                    window.removeEventListener('click', handleOutsideClick);
                    window.removeEventListener('touchstart', handleOutsideClick);

                    _target.show();
                    if (_target.parent)
                        _target.parent.draw();
                };

                function setTextareaWidth(newWidth) {
                    if (!newWidth) {
                        scale = _target.getAbsoluteScale().x;
                        newWidth = _target.width() * scale;
                    }
                    // if (!newWidth) {
                    //     newWidth = textarea.placeholder.length * _target.fontSize();
                    // }
                    var isSafari = /^((?!chrome|android).)*safari/i.test(
                        navigator.userAgent
                    );
                    var isFirefox =
                        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                    if (isSafari || isFirefox) {
                        newWidth = Math.ceil(newWidth);
                    }

                    var isEdge =
                        document.documentMode || /Edge/.test(navigator.userAgent);
                    if (isEdge) {
                        newWidth += 1;
                    }
                    textarea.style.width = newWidth + 'px';
                };

                textarea.addEventListener('keyup', function (e) {
                    scale = _target.getAbsoluteScale().x;
                    setTextareaWidth(_target.width() * scale);

                    // 무한 엔터 막기
                    var enterKey_length = (textarea.value.match(/\n/g) || []).length;
                    var numberOfLines = enterKey_length + 2;
                    var maxRow = textarea.rows;
                    var _canvas_height = $('.konvajs-content').height();
                    var _canvas_parent_top = $('.konvajs-content').parent().css('top');
                    var _cur_canvas_height = parseInt(_canvas_height) - parseInt(_canvas_parent_top)
                    var _textarea_top = textarea.style.top;
                    var _cur_height = parseInt(_textarea_top) + parseInt(textarea.style.height);

                    textarea.addEventListener("input", OnInput, false);

                    function OnInput() {
                        if (_cur_height >= _cur_canvas_height) {
                            textarea.maxLength = enterKey_length;
                        } else {
                            textarea.style.height = (textarea.scrollHeight) + 'px';
                            textarea.maxLength = 75;
                            return;
                        }
                    };

                    // 엔터 시 지정된 row보다 line수가 많을 때 false
                    if (e.keyCode === 13 && (numberOfLines >= maxRow || _cur_height >= _cur_canvas_height)) {
                        e.preventDefault();
                        return false;
                    }

                    // [2023.04.11] 텍스트박스 입력 시 캔버스 저장.
                    _target.text(textarea.value);
                    _target.fontFamily(textarea.style.fontFamily);
                    _target.fontSize(parseInt(textarea.style.fontSize));
                    _target.fill(textarea.style.color);
                    _target.show();
                    self.save_canvas();
                    _target.hide(); // 숨김처리 없을 시 화면에 겹쳐서 보임.
                });

                function handleOutsideClick(e) {
                    if ((e.target !== textarea)
                        && (e.target.getAttribute('id') != 'font_family')
                        && (e.target.getAttribute('class') != 'ff_text')
                        && (e.target.getAttribute('class') != 'select_f_fm')
                        && (e.target.getAttribute('class') != 'select_f_fs')
                        && (e.target.getAttribute('id') != 'font_size')
                        && (e.target.getAttribute('class') != 'icon-font-lg')
                        && (e.target.getAttribute('class') != 'icon-font-sm')
                        && (e.target.getAttribute('class') != 'icon-font-color')
                    ) {

                        _target.text(textarea.value);
                        _target.fontFamily(textarea.style.fontFamily);
                        _target.fontSize(parseInt(textarea.style.fontSize));
                        _target.fill(textarea.style.color);

                        // 가로 사이즈 맞추기
                        var char_length = textarea.value.split('\n');
                        var w = char_length[0];
                        for (var n = 0; n < char_length.length; n++) {
                            if (char_length[n].length > w.length) {
                                w = char_length[n]
                            }
                        }
                        ;

                        var f_s = parseInt(textarea.style.fontSize);
                        var w_l = parseInt(w.length);
                        var ta_w = f_s * w_l;


                        // 엔터없이 길게 문자열 입력 시 가로 길이 제한

                        if (ta_w > parseInt(textarea.style.width)) {
                            _target.width($('canvas').width() * 0.8);
                        } else {
                            _target.width(f_s * w_l);
                        }

                        // 작성 textarea 삭제
                        removeTextarea();

                        var target_parent = _target.parent;

                        if (_target.text() === '' || _target.attrs.hasOwnProperty('text') == false) {
                            _target.destroy();
                        }
                        ;

                        if (target_parent) {
                            target_parent.draw();
                            self.save_canvas();

                            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                type  : "script",
                                detail: "send_text_node(" + JSON.stringify(_target) + ");"
                            }));
                        }
                        ;
                    }
                };

                setTimeout(function () {
                    window.addEventListener('click', handleOutsideClick);
                    window.addEventListener('touchstart', handleOutsideClick);
                });

                // textNode 영역 밖으로 나가지 않도록 함
                textNode.on('dragmove transform', function () {
                    var stage_width = $('.konvajs-content').width();
                    var stage_height = $('.konvajs-content').height();
                    var box = textNode.getClientRect();
                    var absPos = textNode.getAbsolutePosition();
                    var offsetX = box.x - absPos.x;
                    var offsetY = box.y - absPos.y;
                    var newAbsPos = absPos;

                    if (box.x < 0) {
                        newAbsPos.x = -(offsetX - 25);
                    }
                    if (box.y < 0) {
                        newAbsPos.y = -(offsetY - 25);
                    }
                    if (box.x + box.width > stage_width) {
                        newAbsPos.x = (stage_width - box.width - offsetX) - 25;
                    }
                    if (box.y + box.height > stage_height) {
                        newAbsPos.y = (stage_height - box.height - offsetY) - 25;
                    }
                    textNode.setAbsolutePosition(newAbsPos)
                });

            });
        },
        send_text_fontFamily_change      : function DrawingCanvas_send_text_fontFamily_change(id, fontFamily) {
            var self = this;

            self.fontFamily = fontFamily;

            self.stage.find('.textNodes').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.fontFamily = fontFamily;

                    document.fonts.ready.then(function () {
                        self.textLayer.draw();
                    });
                }
                ;
            });
        },
        text_fontFamily_change           : function DrawingCanvas_text_fontFamily_change(change_fontFamily) {
            var self = this;
            var text_layer = this.textLayer;

            // console.log(change_fontFamily)
            var str_font_family = '"' + change_fontFamily + '"'
            this.fontFamily = str_font_family;
            // 클릭하여 선택한 textNode의 fontFamily 변경
            var textNode_langth = this.textLayer.find('.textNodes').length;
            for (var i = 0; i < textNode_langth; i++) {

                // console.log(this.textLayer.find('.textNodes')[i].attrs)
                if (this.textLayer.find('.textNodes')[i].attrs.draggable) {
                    this.textLayer.find('.textNodes')[i].attrs.fontFamily = str_font_family;

                    document.fonts.ready.then(function () {
                        text_layer.draw();

                        self.save_canvas();
                    });

                    this.textLayer.draw();
                    this.textLayer.find('.textNodes')[i].fire('click');

                    // send mirroring
                    var _id = this.textLayer.find('.textNodes')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_text_fontFamily_change('" + _id + "', '" + change_fontFamily + "');"
                    }));
                }
                ;
            }
            ;
            // textarea 바로 적용
            if (document.getElementsByTagName('textarea').length != 0) {
                var t_area = document.getElementsByTagName('textarea');
                t_area[0].style.fontFamily = str_font_family;

                document.fonts.ready.then(function () {
                    text_layer.draw();

                    self.save_canvas();
                });
            }
            ;
        },
        send_text_fontSize_change        : function DrawingCanvas_send_text_fontSize_change(id, fontSize) {
            var self = this;

            self.fontSize = fontSize;

            self.stage.find('.textNodes').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.fontSize = fontSize;

                    document.fonts.ready.then(function () {
                        self.textLayer.draw();
                    });
                }
                ;
            });
        },
        text_fontSize_change             : function DrawingCanvas_text_fontSize_change(change_fontSize) {
            var self = this;
            var text_layer = this.textLayer;
            this.fontSize = change_fontSize;
            // 클릭하여 선택한 textNode의 fontSize 변경
            var textNode_langth = this.textLayer.find('.textNodes').length;
            for (var i = 0; i < textNode_langth; i++) {
                if (this.textLayer.find('.textNodes')[i].attrs.draggable) {
                    this.textLayer.find('.textNodes')[i].attrs.fontSize = change_fontSize;
                    this.stage.find('.transforms').forceUpdate();

                    document.fonts.ready.then(function () {
                        text_layer.draw();

                        self.save_canvas();
                    });

                    this.textLayer.find('.textNodes')[i].fire('click');
                    this.textLayer.draw();

                    // send mirroring
                    var _id = this.textLayer.find('.textNodes')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_text_fontSize_change('" + _id + "', '" + change_fontSize + "');"
                    }));
                }
            }
            ;
            // textarea 바로 적용
            if (document.getElementsByTagName('textarea').length != 0) {
                var t_area = document.getElementsByTagName('textarea');
                t_area[0].style.fontSize = change_fontSize + 'px';

                document.fonts.ready.then(function () {
                    text_layer.draw();

                    self.save_canvas();
                });
            }
            ;
        },
        send_text_font_size_lg           : function DrawingCanvas_text_font_size_lg(id, fontSize) {
            var self = this;

            self.fontSize = fontSize;

            self.stage.find('.textNodes').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.fontSize = fontSize;

                    document.fonts.ready.then(function () {
                        self.textLayer.draw();
                    });
                }
            });
        },
        text_font_size_lg                : function DrawingCanvas_text_font_size_lg(change_fontSize) {
            var self = this;
            var text_layer = this.textLayer;
            this.fontSize = change_fontSize;
            // 클릭하여 선택한 textNode의 fontSize 변경
            var textNode_langth = this.textLayer.find('.textNodes').length;

            for (var i = 0; i < textNode_langth; i++) {

                if (this.textLayer.find('.textNodes')[i].attrs.draggable) {
                    this.textLayer.find('.textNodes')[i].attrs.fontSize = change_fontSize;

                    document.fonts.ready.then(function () {
                        text_layer.draw();

                        self.save_canvas();
                    });
                    this.textLayer.draw();
                    this.textLayer.find('.textNodes')[i].fire('click');

                    // send mirroring
                    var _id = this.textLayer.find('.textNodes')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_text_font_size_lg('" + _id + "', '" + change_fontSize + "');"
                    }));
                }
            }
            ;
            // textarea 바로 적용
            if (document.getElementsByTagName('textarea').length != 0) {
                var t_area = document.getElementsByTagName('textarea');
                t_area[0].style.fontSize = change_fontSize + 'px';

                document.fonts.ready.then(function () {
                    text_layer.draw();

                    self.save_canvas();
                });
            }
            ;
        },
        send_text_font_size_sm           : function DrawingCanvas_text_font_size_sm(id, fontSize) {
            var self = this;

            self.fontSize = fontSize;

            self.stage.find('.textNodes').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.fontSize = fontSize;

                    document.fonts.ready.then(function () {
                        self.textLayer.draw();
                    });
                }
                ;
            });
        },
        text_font_size_sm                : function DrawingCanvas_text_font_size_sm(change_fontSize) {
            var self = this;
            var text_layer = this.textLayer;
            this.fontSize = change_fontSize;
            // 클릭하여 선택한 textNode의 fontSize 변경
            var textNode_langth = this.textLayer.find('.textNodes').length;
            for (var i = 0; i < textNode_langth; i++) {
                if (this.textLayer.find('.textNodes')[i].attrs.draggable) {
                    this.textLayer.find('.textNodes')[i].attrs.fontSize = change_fontSize;

                    document.fonts.ready.then(function () {
                        text_layer.draw();

                        self.save_canvas();
                    });
                    this.textLayer.draw();
                    this.textLayer.find('.textNodes')[i].fire('click');

                    // send mirroring
                    var _id = this.textLayer.find('.textNodes')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_text_font_size_sm('" + _id + "', '" + change_fontSize + "');"
                    }));
                }
            }
            ;
            // textarea 바로 적용
            if (document.getElementsByTagName('textarea').length != 0) {
                var t_area = document.getElementsByTagName('textarea');
                t_area[0].style.fontSize = change_fontSize + 'px';

                document.fonts.ready.then(function () {
                    text_layer.draw();

                    self.save_canvas();
                });
            }
            ;
        },
        send_text_font_fill              : function DrawingCanvas_text_font_fill(id, fill) {
            var self = this;

            self.fill = fill;

            self.stage.find('.textNodes').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.fill = fill;

                    document.fonts.ready.then(function () {
                        self.textLayer.draw();
                    });
                }
                ;
            });
        },
        text_font_fill                   : function DrawingCanvas_text_font_fill(change_fill) {
            var self = this;
            var text_layer = this.textLayer;
            this.fill = change_fill;

            // 클릭하여 선택한 textNode의 fill 변경
            var textNode_langth = this.textLayer.find('.textNodes').length;
            for (var i = 0; i < textNode_langth; i++) {
                if (this.textLayer.find('.textNodes')[i].attrs.draggable) {
                    this.textLayer.find('.textNodes')[i].attrs.fill = change_fill;

                    document.fonts.ready.then(function () {
                        text_layer.draw();

                        self.save_canvas();
                    });

                    this.textLayer.draw();
                    this.textLayer.find('.textNodes')[i].fire('click');

                    // send mirroring
                    var _id = this.textLayer.find('.textNodes')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_text_font_fill('" + _id + "', '" + change_fill + "');"
                    }));

                }
            }
            ;
            // textarea 바로 적용
            if (document.getElementsByTagName('textarea').length != 0) {
                var t_area = document.getElementsByTagName('textarea');
                t_area[0].style.color = change_fill;

                document.fonts.ready.then(function () {
                    text_layer.draw();

                    self.save_canvas();
                });

            }
            ;
        },
        drawHlighter                     : function DrawingCanvas_drawHlighter(x, y) {
            var _stage = this.stage;
            var _imageLayer = this.imageLayer;

            // id를 uuid로 지정
            var node_id = this.node_id;

            if (this.mode == 'hlighter') {
                if (this.drawingLineNotAdded) {
                    this.drawHlighterLine = this.drawingLineNotAdded;
                    this.imageLayer.add(this.drawHlighterLine);
                    this.drawingLineNotAdded = null;
                }
                if (!this.drawHlighterLine) {
                    this.drawHlighterLine = new Konva.Line({
                        id       : node_id,
                        draggable: false,
                        lineCap  : 'round',
                        lineJoin : 'round',
                        // lineCap: 'butt',
                        // lineJoin: 'butt',
                        stroke     : this.hlighter_color,
                        strokeWidth: this.hlighter_width,
                        opacity    : this.opacity,
                        points     : [x / this.scale, y / this.scale],
                        name       : 'hlighter'
                    });
                    this.imageLayer.add(this.drawHlighterLine);
                } else {
                    var oldPoints = this.drawHlighterLine.points();
                    this.drawHlighterLine.points([oldPoints[0], oldPoints[1], x, y]);
                }
                ;

                this.imageLayer.batchDraw();

                function imageHandleOutsideClick(e) {
                    if (e.target !== this.drawHlighterLine) {
                        _stage.find('.textNodes').draggable(false);
                        _stage.find('.transforms').destroy();
                        _imageLayer.draw();
                    }
                }

                setTimeout(function () {
                    window.addEventListener('dblclick', imageHandleOutsideClick);
                });
            }
        },
        drawHlighterWithDetail           : function DrawingCanvas_drawHlighterWithDetail(x, y, mode, stroke, strokeWith, opacity) {
            this.mode = mode;
            this.hlighter_color = stroke;
            this.hlighter_width = strokeWith;
            this.opacity = opacity;
            this.drawHlighter(x, y);
        },
        select_change_hlighter_color     : function DrawingCanvas_select_change_hlighter_color(change_color) {
            this.hlighter_color = change_color;

            var hlighter_langth = this.stage.find('.hlighter').length;
            for (var i = 0; i < hlighter_langth; i++) {
                if (this.imageLayer.find('.hlighter')[i].attrs.draggable) {
                    this.imageLayer.find('.hlighter')[i].attrs.stroke = this.hlighter_color;

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.hlighter')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_select_change_hlighter_color('" + _id + "', '" + change_color + "');"
                    }));
                }
            }
            ;
        },
        send_select_change_hlighter_color: function DrawingCanvas_send_select_change_hlighter_color(id, color) {
            var self = this;

            self.hlighter_color = color;

            self.stage.find('.hlighter').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.stroke = color;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        select_change_hlighter_width     : function DrawingCanvas_select_change_hlighter_width(change_width) {
            this.hlighter_width = parseInt(change_width);

            var hlighter_langth = this.stage.find('.hlighter').length;
            for (var i = 0; i < hlighter_langth; i++) {
                if (this.imageLayer.find('.hlighter')[i].attrs.draggable) {
                    this.imageLayer.find('.hlighter')[i].attrs.strokeWidth = this.hlighter_width;

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.hlighter')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_select_change_hlighter_width('" + _id + "', " + this.hlighter_width + ");"
                    }));

                }
            }
            ;
        },
        send_select_change_hlighter_width: function send_select_change_hlighter_width(id, width) {
            var self = this;

            self.hlighter_width = width;

            self.stage.find('.hlighter').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.strokeWidth = width;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        drawImage                        : function DrawingCanvas_drawImage(url) {
            // 미러링을 위한id값 동일하게 생성
            this.make_uuid();
            // 미러링 서버로 id 전송
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "sendNodeId('" + this.node_id + "');"
            }));

            // viewer에 sticker생성
            this.make_sticker(url);

            // 미러링에 sticker생성
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "make_sticker('" + url + "');"
            }));
        },
        sendNodeId                       : function DrawingCanvas_sendNodeId(id) {
            this.node_id = id;
        },
        make_sticker                     : function DrawingCanvas_make_sticker(url) {
            var self = this;
            if (this.is_drawing) {
                this.stop_drawHlighter();
            }

            var _stage = this.stage;
            var _textLayer = this.textLayer;
            var _imageLayer = this.imageLayer;

            // id를 uuid로 지정
            var node_id = this.node_id;

            var imageObj = new Image();
            imageObj.onload = function () {
                var imageNode = new Konva.Image({
                    x        : 200,
                    y        : 200,
                    id       : node_id,
                    image    : imageObj,
                    draggable: false,
                    name     : 'imageNodes',
                    src      : url
                });
                _imageLayer.add(imageNode);
                _imageLayer.draw();

                self.save_canvas();

                // 이미지 클릭했을 때
                imageNode.on('click', function (e) {
                    function imageHandleOutsideClick(e) {
                        if (e.target !== imageNode) {
                            imageNode.draggable(false);
                            _textLayer.find('.textNodes').draggable(false);
                            _stage.find('.transforms').destroy();
                            _imageLayer.draw();
                        }
                    }

                    setTimeout(function () {
                        window.addEventListener('dblclick', imageHandleOutsideClick);
                    });
                });

                imageNode.fire('click');
            };
            imageObj.src = url;
        },
        arrow_color_change               : function DrawingCanvas_arrow_color_change(arrow_color) {
            this.arrow_fill = arrow_color;
            this.arrow_stroke = arrow_color;
            var arrow_langth = this.imageLayer.find('.arrow').length;
            for (var i = 0; i < arrow_langth; i++) {
                if (this.imageLayer.find('.arrow')[i].attrs.draggable) {
                    this.imageLayer.find('.arrow')[i].attrs.fill = arrow_color;
                    this.imageLayer.find('.arrow')[i].attrs.stroke = arrow_color;

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.arrow')[i].attrs.id;
                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_arrow_color_change('" + _id + "', '" + arrow_color + "');"
                    }));
                }
                ;
            }
            ;
        },
        send_arrow_color_change          : function DrawingCanvas_send_arrow_color_change(id, color) {
            var self = this;

            self.stage.find('.arrow').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.fill = color;
                    i.attrs.stroke = color;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        arrow_direction_change           : function DrawingCanvas_arrow_direction_change(direction) {
            this.arrow_direction = direction;

            if (direction == 'forward') {
                this.pointerAtBeginning = false;
            } else if (direction == 'reverse') {
                this.pointerAtBeginning = false;
            } else if (direction == 'bidirectional') {
                this.pointerAtBeginning = true;
            }
            ;

            var arrow_langth = this.imageLayer.find('.arrow').length;
            for (var i = 0; i < arrow_langth; i++) {
                var reverse_points = this.imageLayer.find('.arrow')[i].attrs.points;

                if (this.imageLayer.find('.arrow')[i].attrs.draggable) {

                    if (direction == 'bidirectional') {
                        this.imageLayer.find('.arrow')[i].attrs.points = reverse_points.concat([reverse_points[0], reverse_points[1], reverse_points[2], reverse_points[3]]);
                        this.imageLayer.find('.arrow')[i].attrs.pointerAtBeginning = this.pointerAtBeginning;
                    } else {
                        this.imageLayer.find('.arrow')[i].attrs.pointerAtBeginning = this.pointerAtBeginning;
                        // 역방향일 때 위치 변경
                        if (direction == 'reverse') {
                            this.imageLayer.find('.arrow')[i].attrs.points = reverse_points.concat([reverse_points[2], reverse_points[3], reverse_points[0], reverse_points[1]]);
                        } else {
                            this.imageLayer.find('.arrow')[i].attrs.points = reverse_points.concat([reverse_points[0], reverse_points[1], reverse_points[2], reverse_points[3]]);
                        }
                    }

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.arrow')[i].attrs.id;
                    var _points = this.imageLayer.find('.arrow')[i].attrs.points;
                    var _pointerAtBeginning = this.pointerAtBeginning;

                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_arrow_direction_change('" + _id + "', [" + _points + "], " + _pointerAtBeginning + ");"
                    }));
                }
                ;
            }
            ;
        },
        send_arrow_direction_change      : function DrawingCanvas_send_arrow_direction_change(id, points, pointerAtBeginning) {
            var self = this;

            self.stage.find('.arrow').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.pointerAtBeginning = pointerAtBeginning;
                    i.attrs.points = points;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        arrow_width_change               : function DrawingCanvas_arrow_width_change(arrow_width) {
            this.arrow_strokewidth = parseInt(arrow_width);
            var arrow_langth = this.imageLayer.find('.arrow').length;
            for (var i = 0; i < arrow_langth; i++) {
                if (this.imageLayer.find('.arrow')[i].attrs.draggable) {
                    this.imageLayer.find('.arrow')[i].attrs.strokeWidth = parseInt(arrow_width);

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.arrow')[i].attrs.id;

                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_arrow_width_change('" + _id + "'," + arrow_width + ");"
                    }));
                }
                ;
            }
            ;
        },
        send_arrow_width_change          : function DrawingCanvas_send_arrow_width_change(id, width) {
            var self = this;

            self.arrow_strokewidth = parseInt(width);

            self.stage.find('.arrow').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.strokeWidth = parseInt(width);
                    self.imageLayer.draw();
                }
                ;
            });
        },
        arrow_dash_change                : function DrawingCanvas_arrow_dash_change(arrow_dash) {
            var _arrow_dash;

            var get_arrow_width = this.arrow_strokewidth;

            if (arrow_dash == 'dash_1') {
                _arrow_dash = [0, 0, 0, 0];
            } else if (arrow_dash == 'dash_2') {
                _arrow_dash = [get_arrow_width, (get_arrow_width * 1.5), get_arrow_width, (get_arrow_width * 1.5)];
            } else if (arrow_dash == 'dash_3') {
                _arrow_dash = [(get_arrow_width * 3), (get_arrow_width * 2), (get_arrow_width * 3), (get_arrow_width * 2)];
            }
            ;

            this.arrow_dash = _arrow_dash;
            var arrow_langth = this.imageLayer.find('.arrow').length;
            for (var i = 0; i < arrow_langth; i++) {
                if (this.imageLayer.find('.arrow')[i].attrs.draggable) {
                    arrow_on = true;
                    this.imageLayer.find('.arrow')[i].attrs.dash = _arrow_dash;

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.arrow')[i].attrs.id;

                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_arrow_dash_change('" + _id + "',[" + _arrow_dash + "]);"
                    }));
                }
            }
            ;
        },
        send_arrow_dash_change           : function DrawingCanvas_send_arrow_dash_change(id, dash) {
            var self = this;

            self.arrow_dash = dash;

            self.stage.find('.arrow').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.dash = dash;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        drawArrow                        : function DrawingCanvas_drawArrow(x, y) {
            this.make_default_arrow(x, y);
            // 미러링에 arrow 생성
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "make_default_arrow(" + x + ", " + y + ");"
            }));
        },
        make_default_arrow               : function DrawingCanvas_make_default_arrow(x, y) {
            var self = this;
            var _stage = this.stage;
            var _imageLayer = this.imageLayer;

            // id를 uuid로 지정
            var node_id = this.node_id;

            if (this.mode == 'arrow') {
                if (this.drawingLineNotAdded) {
                    this.drawarrowLine = this.drawingLineNotAdded;
                    this.imageLayer.add(this.drawarrowLine);
                    this.drawingLineNotAdded = null;
                }

                if (!this.drawarrowLine) {
                    this.drawarrowLine = new Konva.Arrow({
                        id                : node_id,
                        pointerLength     : 20,
                        pointerWidth      : 20,
                        pointerAtBeginning: this.pointerAtBeginning,
                        fill              : this.arrow_fill,
                        stroke            : this.arrow_stroke,
                        strokeWidth       : this.arrow_strokewidth,
                        dash              : this.arrow_dash,
                        points            : [x / this.scale, y / this.scale, x / this.scale, y / this.scale],
                        name              : 'arrow',
                        draggable         : false,
                    });
                    this.imageLayer.add(this.drawarrowLine);
                } else {
                    var oldPoints = this.drawarrowLine.points();
                    this.drawarrowLine.points([oldPoints[0], oldPoints[1], x, y]);
                }

                if (this.arrow_direction == 'reverse') {
                    var reverse_points = this.drawarrowLine.points();
                    this.drawarrowLine.points(this.drawarrowLine.points().concat([x, y, reverse_points[0], reverse_points[1]]));
                }

                // self.save_canvas();

                this.imageLayer.batchDraw();

                // 화살표 클릭했을 때
                this.drawarrowLine.on('click', function (e) {
                    function imageHandleOutsideClick(e) {
                        if (e.target !== this.drawarrowLine) {
                            _stage.find('.textNodes').draggable(false);
                            _stage.find('.transforms').destroy();
                            _imageLayer.draw();
                        }
                    };
                    setTimeout(function () {
                        window.addEventListener('dblclick', imageHandleOutsideClick);
                    });
                });
            }
        },
        make_default_arrowWithDetail     : function DrawingCanvas_make_default_arrowWithDetail(x, y, mode, fill, stroke, pointerAtBeginning, direction, strokeWith, dash) {
            this.mode = mode;
            this.arrow_fill = fill;
            this.arrow_stroke = stroke;
            this.pointerAtBeginning = pointerAtBeginning;
            this.arrow_direction = direction;
            this.arrow_strokewidth = strokeWith;
            this.arrow_dash = dash;
            this.make_default_arrow(x, y);
        },
        make_line                        : function DrawingCanvas_make_line(x, y) {
            var self = this;
            var _stage = this.stage;
            var _imageLayer = this.imageLayer;
            // id를 uuid로 지정
            var node_id = this.node_id;

            if (this.mode == 'straight') {
                if (this.drawingLineNotAdded) {
                    this.drawstraightLine = this.drawingLineNotAdded;
                    this.imageLayer.add(this.drawstraightLine);
                    this.drawingLineNotAdded = null;
                }
                ;

                if (!this.drawstraightLine) {
                    this.drawstraightLine = new Konva.Line({
                        id         : node_id,
                        draggable  : false,
                        lineCap    : 'round',
                        lineJoin   : 'round',
                        stroke     : this.straight_color,
                        strokeWidth: this.straight_width,
                        dash       : this.straight_dash,
                        opacity    : 1,
                        points     : [x / this.scale, y / this.scale],
                        name       : 'straight'
                    });
                    this.imageLayer.add(this.drawstraightLine);
                } else {
                    var oldPoints = this.drawstraightLine.points();
                    this.drawstraightLine.points([oldPoints[0], oldPoints[1], x, y]);
                }

                this.imageLayer.batchDraw();

                // 직선 클릭했을 때
                this.drawstraightLine.on('click', function (e) {

                    function imageHandleOutsideClick(e) {
                        if (e.target !== this.drawstraightLine) {
                            _stage.find('.textNodes').draggable(false);
                            _stage.find('.transforms').destroy();
                            _imageLayer.draw();
                        }
                    }

                    setTimeout(function () {
                        window.addEventListener('dblclick', imageHandleOutsideClick);
                    });
                });
            }
        },
        make_lineWithDetail              : function DrawingCanvas_make_lineWithDetail(x, y, mode, stroke, strokeWith, dash, opacity) {
            this.mode = mode;
            this.straight_color = stroke;
            this.straight_width = strokeWith;
            this.straight_dash = dash;
            this.opacity = opacity;
            this.make_line(x, y);
        },
        line_color_change                : function DrawingCanvas_line_color_change(line_color) {
            this.straight_color = line_color;
            var line_langth = this.imageLayer.find('.straight').length;
            for (var i = 0; i < line_langth; i++) {
                if (this.imageLayer.find('.straight')[i].attrs.draggable) {
                    this.imageLayer.find('.straight')[i].attrs.stroke = this.straight_color;

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.straight')[i].attrs.id;

                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_line_color_change('" + _id + "', '" + line_color + "');"
                    }));
                }
                ;
            }
            ;
        },
        send_line_color_change           : function DrawingCanvas_send_line_color_change(id, color) {
            var self = this;

            self.straight_color = color;

            self.stage.find('.straight').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.stroke = color;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        line_width_change                : function DrawingCanvas_line_width_change(line_width) {
            this.straight_width = parseInt(line_width);
            var line_langth = this.imageLayer.find('.straight').length;
            for (var i = 0; i < line_langth; i++) {
                if (this.imageLayer.find('.straight')[i].attrs.draggable) {
                    this.imageLayer.find('.straight')[i].attrs.strokeWidth = this.straight_width;

                    this.save_canvas();

                    this.imageLayer.draw();
                    // send mirroring
                    var _id = this.imageLayer.find('.straight')[i].attrs.id;

                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_line_width_change('" + _id + "', '" + line_width + "');"
                    }));
                }
                ;
            }
            ;
        },
        send_line_width_change           : function DrawingCanvas_send_line_width_change(id, width) {
            var self = this;

            self.straight_width = parseInt(width);

            self.stage.find('.straight').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.strokeWidth = parseInt(width);
                    self.imageLayer.draw();
                }
                ;
            });
        },
        line_dash_change                 : function DrawingCanvas_line_dash_change(line_dash) {
            var _line_dash;
            var get_line_width = this.straight_width;

            if (line_dash == 'dash_1') {
                _line_dash = [0, 0, 0, 0];
            } else if (line_dash == 'dash_2') {
                _line_dash = [get_line_width, (get_line_width * 2), get_line_width, (get_line_width * 2)];
            } else if (line_dash == 'dash_3') {
                _line_dash = [(get_line_width * 3), (get_line_width * 2), (get_line_width * 3), (get_line_width * 2)];
            }
            ;

            this.straight_dash = _line_dash;
            var line_langth = this.imageLayer.find('.straight').length;
            for (var i = 0; i < line_langth; i++) {
                if (this.imageLayer.find('.straight')[i].attrs.draggable) {
                    this.imageLayer.find('.straight')[i].attrs.dash = this.straight_dash;

                    this.save_canvas();

                    this.imageLayer.draw();

                    // send mirroring
                    var _id = this.imageLayer.find('.straight')[i].attrs.id;

                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                        type  : "script",
                        detail: "send_line_dash_change('" + _id + "', [" + _line_dash + "]);"
                    }));

                }
            }
            ;
        },
        send_line_dash_change            : function DrawingCanvas_send_line_dash_change(id, dash) {
            var self = this;

            self.straight_dash = dash;

            self.stage.find('.straight').each(function (i) {
                if (id == i.attrs.id) {
                    i.attrs.dash = dash;
                    self.imageLayer.draw();
                }
                ;
            });
        },
        save_canvas                      : function DrawingCanvas_save_canvas() {
            if (this.save_on == false) {
                return;
            }
            ;


            var drawing_node_length = this.drawingLayer.getChildren().length;
            var text_node_length = this.textLayer.getChildren().length;
            var image_node_length = this.imageLayer.getChildren().length;
            // var type = this.type;

            try {
                if (drawing_node_length == 0 && text_node_length == 0 && image_node_length == 0) {
                    // 아무것도 없으면 삭제
                    canvas_save_load.canvas_data_delete(this.type);
                } else {
                    canvas_save_load.canvas_save();
                }
            } catch (error) {

            }
        },
        save_data                        : function DrawingCanvas_save_data() {
            var type = this.type;
            var drawJson = this.stage.toJSON();
            drawJson = JSON.stringify(drawJson);

            // console.log("drawJson size : ", drawJson.length)
            return {'json': drawJson, 'type': type};
        },
        load_canvas                      : function DrawingCanvas_load_canvas(json) {
            // console.error("load_canvas")
            var self = this;
            var getData = json;

            if (getData) {
                getData = '"' + getData + '"';

                var drawingData = JSON.parse(getData);

                // stage가 이미 있으면 삭제
                if (this.stage) {
                    this.stage.destroy();
                    this.stage = null;
                }
                ;

                // 가져온 정보로 stage 생성
                this.stage = Konva.Node.create(drawingData, this.container);
                this.textLayer = this.stage.getChildren()[0];
                this.imageLayer = this.stage.getChildren()[1];
                this.drawingLayer = this.stage.getChildren()[2];

                // 기존에 mathToolLayer가 있으면 기존 것으로, 없으면 생성
                if (this.stage.getChildren()[3]) {
                    this.mathToolLayer = this.stage.getChildren()[3];
                } else {
                    this.mathToolLayer = new Konva.Layer({id: 'mathTool', name: 'mathTool_layer'});
                }

                // setting stage
                this.stage.attrs.listening = true;

                var stage_width = this.stage.attrs.width;
                var stage_height = this.stage.attrs.height;

                this.textLayer.attrs.width = stage_width;
                this.imageLayer.attrs.width = stage_width;
                this.drawingLayer.attrs.width = stage_width;
                this.mathToolLayer.attrs.width = stage_width;
                this.textLayer.attrs.height = stage_height;
                this.imageLayer.attrs.height = stage_height;
                this.drawingLayer.attrs.height = stage_height;
                this.mathToolLayer.attrs.height = stage_height;

                this.stage.add(this.textLayer);
                this.stage.add(this.imageLayer);
                this.stage.add(this.drawingLayer);
                this.stage.add(this.mathToolLayer);

                // 수학 교구 흔적 삭제 필요
                if (this.stage.find('.setSquare').length != 0) {
                    this.stage.find('.setSquare').destroy();
                    this.mathToolLayer.draw();
                }
                if (this.stage.find('.protractor').length != 0) {
                    this.stage.find('.protractor').destroy();
                    this.mathToolLayer.draw();
                }

                // text node
                this.stage.find('.textNodes').forEach(function (textNode) {
                    // textnode click
                    textNode.on('click', function (e) {
                        // textnode 바깥을 클릭 했을 때 선택 해제
                        function textHandleOutsideClick(e) {
                            if (e.target != textNode) {
                                if (textNode.parent != null) {
                                    textNode.parent.parent.find('.transforms').destroy();
                                    textNode.parent.draw();
                                    textNode.draggable(false);
                                }
                            }
                        };

                        setTimeout(function () {
                            window.addEventListener('dblclick', textHandleOutsideClick);
                        });

                    });
                    // textnode dblclick
                    textNode.on('dblclick', function (e) {
                        if (self.mode != 'text') {
                            return;
                        }
                        ;

                        var _target = e.target;
                        // 트랜스폼 삭제
                        textNode.parent.parent.find('.transforms').destroy();
                        // draggable 해제
                        e.target.parent.draggable(false);
                        // 텍스트 영역 가리기
                        e.target.hide();
                        e.target.parent.draw();

                        var textPosition = _target.absolutePosition();
                        var stageBox = _target.parent.parent.container().getBoundingClientRect();

                        // window board scale
                        var matches;
                        var iframe_matches;
                        var _get_parent_scaleX = 1;
                        var _get_parent_scaleY = 1;

                        if (self.type == 'BOARD') {
                            var win_board_get_scale = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
                                matches = $('#board_wrap').css('transform').match(win_board_get_scale);
                            // matches = $('.konvajs-content').parent().css('transform').match(win_board_get_scale);
                        } else {
                            var stage_parent = $('.konvajs-content').parent();

                            if (stage_parent.attr('id') == 'drawing-control') {
                                _get_parent_scaleX = 1;
                                _get_parent_scaleY = 1;
                            } else {
                                var iframe_get_scale = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
                                    iframe_matches = stage_parent.parent().css('transform').match(iframe_get_scale);
                                // iframe_matches = $('.drawing-canvas-wrapper').css('transform').match(iframe_get_scale);
                                // iframe scale 정보
                                _get_parent_scaleX = iframe_matches[1];
                                _get_parent_scaleY = iframe_matches[2];
                            }
                        }

                        //
                        var areaPosition;

                        if (matches != null) {
                            var win_board_s_x = matches[1];
                            var win_board_s_y = matches[2];

                            areaPosition = {
                                x: (stageBox.left + textPosition.x) * win_board_s_x,
                                y: (stageBox.top + textPosition.y) * win_board_s_y,
                            }
                        } else {
                            areaPosition = {
                                x: stageBox.left + textPosition.x,
                                y: stageBox.top + textPosition.y,
                            }
                        }
                        ;

                        // var areaPosition = {
                        //     x: stageBox.left + textPosition.x,
                        //     y: stageBox.top + textPosition.y,
                        // };

                        var textarea = document.createElement('textarea');
                        document.body.appendChild(textarea);

                        textarea.value = _target.text();
                        textarea.style.position = 'absolute';

                        if (self.type == 'BOARD') {
                            textarea.style.top = areaPosition.y + 'px';
                            textarea.style.left = areaPosition.x + 'px';
                            textarea.style.width = _target.width() + 'px';
                            textarea.style.height = _target.height() + 'px';
                            textarea.style.maxWidth = (self.stage.attrs.width - areaPosition.x) + 'px';
                            textarea.style.maxheight = (self.stage.attrs.height - areaPosition.y) + 'px';
                        } else {
                            textarea.style.top = (areaPosition.y * _get_parent_scaleY) + 'px';
                            textarea.style.left = (areaPosition.x * _get_parent_scaleX) + 'px';
                            textarea.style.width = (self.stage.attrs.width * _get_parent_scaleX) + 'px';
                            textarea.style.height = (_target.height() * _get_parent_scaleY) + 'px';
                            textarea.style.maxWidth = (self.stage.attrs.width - textPosition.x) * _get_parent_scaleX + 'px';
                            textarea.style.maxheight = ((self.stage.attrs.height - textPosition.y) * _get_parent_scaleY) + 'px';
                            // textarea.style.maxWidth = ((self.stage.attrs.width - areaPosition.x) * _get_parent_scaleX) + 'px';
                            // textarea.style.maxheight = ((self.stage.attrs.height - areaPosition.y) * _get_parent_scaleY) + 'px';
                        }
                        ;

                        // 이미 textarea에 내용이 있는 경우 내용만큼 width 변경
                        if (_target.text() != '') {
                            textarea.style.width = (_target.width() * _get_parent_scaleX) + 'px';
                        }
                        ;

                        textarea.style.fontSize = _target.attrs.fontSize + 'px';
                        textarea.style.border = '1px solid rbga(255, 255, 255, 0.1)';
                        // textarea.style.border = 'none';
                        textarea.style.padding = '0px';
                        textarea.style.margin = '0px';
                        textarea.style.overflow = 'hidden';
                        textarea.style.background = 'none';
                        textarea.style.outline = 'none';
                        textarea.style.resize = 'none';
                        textarea.style.fontWeight = 'normal';
                        textarea.style.lineHeight = 1;
                        textarea.style.fontFamily = _target.attrs.fontFamily;
                        textarea.style.transformOrigin = 'left top';
                        textarea.style.textAlign = _target.align();
                        textarea.style.color = _target.attrs.fill;
                        textarea.style.pointerEvents = 'none';
                        textarea.style.zIndex = 1;
                        // maxLength
                        textarea.maxLength = 75;
                        // maxRows
                        textarea.rows = Math.floor(parseInt(_target.parent.parent.attrs.height) / parseInt(_target.attrs.fontSize));

                        var transform = '';
                        var px = 0;
                        var isFirefox =
                            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                        if (isFirefox) {
                            px += 2 + Math.round(_target.fontSize() / 20);
                        }
                        transform += 'translateY(-' + px + 'px)';

                        textarea.style.transform = transform;

                        textarea.focus();

                        function removeTextarea() {
                            textarea.parentNode.removeChild(textarea);

                            window.removeEventListener('click', handleOutsideClick);
                            window.removeEventListener('touchstart', handleOutsideClick);

                            _target.show();
                            if (_target.parent)
                                _target.parent.draw();
                        };

                        function setTextareaWidth(newWidth) {
                            if (!newWidth) {
                                scale = _target.getAbsoluteScale().x;
                                newWidth = _target.width() * scale;
                            }

                            var isSafari = /^((?!chrome|android).)*safari/i.test(
                                navigator.userAgent
                            );
                            var isFirefox =
                                navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                            if (isSafari || isFirefox) {
                                newWidth = Math.ceil(newWidth);
                            }

                            var isEdge =
                                document.documentMode || /Edge/.test(navigator.userAgent);
                            if (isEdge) {
                                newWidth += 1;
                            }
                            textarea.style.width = newWidth + 'px';
                        };

                        textarea.addEventListener('keydown', function (e) {
                            scale = _target.getAbsoluteScale().x;
                            setTextareaWidth(_target.width() * scale);

                            // 무한 엔터 막기
                            var enterKey_length = (textarea.value.match(/\n/g) || []).length;
                            var numberOfLines = enterKey_length + 2;
                            var maxRow = textarea.rows;
                            var _canvas_height = $('.konvajs-content').height();
                            var _canvas_parent_top = $('.konvajs-content').parent().css('top');
                            var _cur_canvas_height = parseInt(_canvas_height) - parseInt(_canvas_parent_top)
                            var _textarea_top = textarea.style.top;
                            var _cur_height = parseInt(_textarea_top) + parseInt(textarea.style.height);

                            textarea.addEventListener("input", OnInput, false);

                            function OnInput() {
                                if (_cur_height >= _cur_canvas_height) {
                                    textarea.maxLength = enterKey_length;
                                } else {
                                    textarea.style.height = (textarea.scrollHeight) + 'px';
                                    textarea.maxLength = 75;
                                    return;
                                }
                            };

                            // 엔터 시 지정된 row보다 line수가 많을 때 false
                            if (e.keyCode === 13 && (numberOfLines >= maxRow || _cur_height >= _cur_canvas_height)) {
                                e.preventDefault();
                                return false;
                            }

                            self.save_canvas();

                        });

                        function handleOutsideClick(e) {
                            if ((e.target !== textarea)
                                && (e.target.getAttribute('id') != 'font_family')
                                && (e.target.getAttribute('class') != 'ff_text')
                                && (e.target.getAttribute('class') != 'select_f_fm')
                                && (e.target.getAttribute('class') != 'select_f_fs')
                                && (e.target.getAttribute('id') != 'font_size')
                                && (e.target.getAttribute('class') != 'icon-font-lg')
                                && (e.target.getAttribute('class') != 'icon-font-sm')
                                && (e.target.getAttribute('class') != 'icon-font-color')
                            ) {

                                _target.text(textarea.value);
                                _target.fontFamily(textarea.style.fontFamily);
                                _target.fontSize(parseInt(textarea.style.fontSize));
                                _target.fill(textarea.style.color);

                                // 가로 사이즈 맞추기
                                var char_length = textarea.value.split('\n');
                                var w = char_length[0];
                                for (var n = 0; n < char_length.length; n++) {
                                    if (char_length[n].length > w.length) {
                                        w = char_length[n]
                                    }
                                }
                                ;

                                var f_s = parseInt(textarea.style.fontSize);
                                var w_l = parseInt(w.length);
                                var ta_w = f_s * w_l;


                                // 엔터없이 길게 문자열 입력 시 가로 길이 제한
                                if (ta_w > parseInt(textarea.style.width)) {
                                    _target.width($('canvas').width() * 0.8);
                                } else {
                                    _target.width(f_s * w_l);
                                }

                                // 작성 textarea 삭제
                                removeTextarea();

                                var target_parent = _target.parent;

                                if (_target.text() === '' || _target.attrs.hasOwnProperty('text') == false) {
                                    _target.destroy();
                                }
                                ;

                                if (target_parent) {
                                    target_parent.draw();

                                    window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                                        type  : "script",
                                        detail: "send_text_node(" + JSON.stringify(_target) + ");"
                                    }));
                                }
                                ;
                            }
                        };

                        setTimeout(function () {
                            window.addEventListener('click', handleOutsideClick);
                            window.addEventListener('touchstart', handleOutsideClick);
                        });

                        // textNode 영역 밖으로 나가지 않도록 함
                        textNode.on('dragmove transform', function () {
                            var stage_width = $('.konvajs-content').width();
                            var stage_height = $('.konvajs-content').height();
                            var box = textNode.getClientRect();
                            var absPos = textNode.getAbsolutePosition();
                            var offsetX = box.x - absPos.x;
                            var offsetY = box.y - absPos.y;
                            var newAbsPos = absPos;

                            if (box.x < 0) {
                                newAbsPos.x = -(offsetX - 25);
                            }
                            if (box.y < 0) {
                                newAbsPos.y = -(offsetY - 25);
                            }
                            if (box.x + box.width > stage_width) {
                                newAbsPos.x = (stage_width - box.width - offsetX) - 25;
                            }
                            if (box.y + box.height > stage_height) {
                                newAbsPos.y = (stage_height - box.height - offsetY) - 25;
                            }
                            textNode.setAbsolutePosition(newAbsPos)
                        });
                    });
                });

                // image node
                this.stage.find('.imageNodes').forEach(function (imageNode) {
                    var src = imageNode.getAttr('src');
                    var image = new Image();
                    image.onload = function () {
                        imageNode.image(image);
                        self.imageLayer.batchDraw()
                    }
                    image.src = src;
                });

                // stage draw
                // font loading 완료 후 drawing
                document.fonts.ready.then(function () {
                    self.stage.draw();
                });
                self.stage.draw();

            } else {
                this.createStage();
            }
            ;

            setTimeout(function () {
                self.set_draggable_false();
                // 2022.01.06 로드 후 canvas가 active 상태가 되어 콘텐츠 클릭 불가 현상
                // self._activateCommon();
            }, 500);
        },

        create_set_square     : function () {
            // 한개만 생성
            if (this.stage.find('.setSquare').length != 0) {
                return;
            }
            ;

            var self = this;
            var url = '/assets/viewer/img/viewer/tri-ruler-trans.png';

            if (this.is_drawing) {
                this.stop_drawHlighter();
                this.is_drawing = false;
            }

            // id를 uuid로 지정
            var node_id = this.node_id;

            var imageObj = new Image();
            imageObj.onload = function () {
                var imageNode_set_square = new Konva.Image({
                    x        : 200,
                    y        : 200,
                    width    : 300,
                    height   : 280,
                    opacity  : 1,
                    id       : node_id,
                    image    : imageObj,
                    draggable: false,
                    name     : 'setSquare',
                    id       : 'setSquare',
                    src      : url
                });
                self.mathToolLayer.add(imageNode_set_square);
                self.mathToolLayer.draw();

                // self.save_canvas();

                // 이미지 클릭했을 때
                imageNode_set_square.on('click', function (e) {
                    self._onclick(e);

                    function imageHandleOutsideClick(e) {
                        if (self.stage == null) {
                            return;
                        }

                        if (e.target !== imageNode_set_square) {
                            self.stage.find('.transforms').destroy();
                            self.mathToolLayer.draw();
                        }
                    }

                    setTimeout(function () {
                        window.addEventListener('dblclick', imageHandleOutsideClick);
                    });
                });

                imageNode_set_square.fire('click');
            };
            imageObj.src = url;

            // 미러링
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "create_set_square()"
            }));
        },
        create_protractor     : function () {
            if (this.stage.find('.protractor').length != 0) {
                return;
            }
            ;

            var self = this;
            var url = '/assets/viewer/img/viewer/protractor.png';

            if (this.is_drawing) {
                this.is_drawing = false;
                this.stop_drawHlighter();
            }

            // id를 uuid로 지정
            var node_id = this.node_id;

            var imageObj = new Image();
            imageObj.onload = function () {
                var imageNode_protractor = new Konva.Image({
                    x        : 200,
                    y        : 200,
                    opacity  : 1,
                    width    : 371,
                    height   : 200,
                    id       : node_id,
                    image    : imageObj,
                    draggable: false,
                    name     : 'protractor',
                    id       : 'protractor',
                    src      : url
                });

                self.mathToolLayer.add(imageNode_protractor);
                self.mathToolLayer.draw();

                // self.save_canvas();

                // 이미지 클릭했을 때
                imageNode_protractor.on('click', function (e) {
                    self._onclick(e);

                    function imageHandleOutsideClick(e) {
                        if (self.stage == null) {
                            return;
                        }

                        if (e.target !== imageNode_protractor) {
                            self.stage.find('.transforms').destroy();
                            self.mathToolLayer.draw();
                        }
                    }

                    setTimeout(function () {
                        window.addEventListener('dblclick', imageHandleOutsideClick);
                    });
                });

                imageNode_protractor.fire('click');
            };
            imageObj.src = url;

            // 미러링
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "create_protractor()"
            }));
        },
        create_ruler          : function (e) {
            // 기존의 자 삭제
            this.remove_ruler();
            // 맨 처음 생성 시 길이 초기화
            this.ruler_index = 79;
            this.tool_ratio = this.get_dataRatio();
            console.log('this.tool_ratio ===========', this.tool_ratio);

            if (this.stage.find('#ruler').length == 0) {
                this.create_ruler_group();

                if (this.is_drawing) {
                    this.is_drawing = false;
                    this.stop_drawHlighter();
                }

                // 자 생성 후 클릭된 상태에서 드래그하면 grad_wrap이 분리되어 나오는 현상이 있음
                this.ruler_group.fire('click');
                // this.stage.find('#ruler').fire('click');
            }

            // 미러링
            window.dispatchEvent(new CustomEvent('DrawingCanvasEvent', {
                type  : "script",
                detail: "mirroring_create_ruler()"
            }));
        },
        update_ruler          : function (symbol) {
            this.ruler_group.removeChildren();

            if (symbol == '+') {
                this.ruler_index += 1;
            } else {
                this.ruler_index -= 1;
            }

            this.create_ruler_box();
        },
        mirroring_update_ruler: function (symbol, width, height, x, y, scaleX, scaleY, rotation) {
            // 기존의 자 삭제
            this.remove_ruler();

            this.ruler_group.removeChildren();

            if (symbol == '+') {
                this.ruler_index += 1;
            } else {
                this.ruler_index -= 1;
            }

            this.create_ruler_box();

            this.ruler_group.setAttrs({
                width   : width,
                height  : height,
                x       : x,
                y       : y,
                scaleX  : scaleX,
                scaleY  : scaleY,
                rotarion: rotation
            });

            this.mathToolLayer.draw();
        },

        mirroring_create_ruler: function (e) {
            // 기존의 자 삭제
            this.remove_ruler();
            // 맨 처음 생성 시 길이 초기화
            this.ruler_index = 79;
            this.tool_ratio = this.get_dataRatio();

            if (this.stage.find('#ruler').length == 0) {
                this.create_ruler_group();

                if (this.is_drawing) {
                    this.is_drawing = false;
                    this.stop_drawHlighter();
                }
            }
        },
        remove_ruler          : function (e) {
            this.stage.find('#ruler').destroy();
            this.stage.draw();
        },
        get_dataRatio         : function () {
            var _ratio = null;
            var get_ratio = null;

            try {
                get_ratio = document.getElementById('iframe_content').contentWindow.mathTool_ruler_ratio();
            } catch (error) {
                get_ratio
            }

            if (get_ratio != null) {
                _ratio = get_ratio;
            } else {
                _ratio = 6.0;
            }

            return _ratio;
        },
        create_ruler_group    : function () {
            var _width = this.tool_ratio * this.ruler_index;
            this.ruler_group = new Konva.Group({
                x          : 100,
                y          : 100,
                width      : _width,
                height     : 100,
                name       : 'ruler',
                id         : 'ruler',
                scaleX     : this.ruler_scale_x,
                scaleY     : this.ruler_scale_y,
                pointEvents: 'auto',
                draggable  : false,
            });
            // add ruler
            this.create_ruler_box();
        },
        create_ruler_box      : function () {
            var self = this;
            var _num = -1;
            var ruler_number = null;
            var _grad = null;

            // 자 좌측 조금 길게.
            var grad_wrap = new Konva.Rect({
                x          : 90,
                y          : 100,
                width      : (this.tool_ratio * this.ruler_index) + 10,
                height     : 100,
                id         : 'grad_wrap',
                name       : 'ruler',
                scaleX     : this.ruler_scale_x,
                scaleY     : this.ruler_scale_y,
                fill       : 'rgba(238, 246, 250, 0.8)',
                stroke     : '#80b5cc',
                strokeWidth: 3,
                draggable  : false,
            })
            self.ruler_group.add(grad_wrap);

            // iframe에서 range 가지고 오기
            var get_range = document.getElementById('iframe_content').contentWindow.RULER_RANGE;
            var get_ratio = document.getElementById('iframe_content').contentWindow.RULER_RATIO;
            // var get_ratio = document.getElementById('iframe_content').contentWindow.mathTool_ruler_ratio();

            // fontsize
            var _fontSize = null;

            if (get_ratio >= 5) {
                _fontSize = 25;
            } else if (get_ratio <= 6) {
                _fontSize = 20;
            } else {
                get_ratio = 6.0;
                _fontSize = 20;
            }

            for (var i = 0; i <= this.ruler_index; i++) {
                // 눈금 표시 : 5mm, 10mm 길이 밎 위치 각각 다르게 표시
                var grad_height = null;

                if (get_range == undefined) {
                    get_range = 1;
                }

                if (i % 5 == 1 && i % 2 == 1) {
                    // create grad_3 : 10mm (1cm) 눈금
                    grad_height = 30;

                    _num = _num + 1;

                    var number_x = null;

                    // 한자리 숫자의 위치와 두자리 숫자의 위치 지정
                    // range 단위가 늘어나면 X값이 달라져야 함

                    if ((_num * get_range) <= 9) {
                        number_x = 95 + (i * this.tool_ratio);
                    } else if ((_num * get_range) <= 99) {
                        number_x = 90 + (i * this.tool_ratio);
                    } else if ((_num * get_range) <= 999) {
                        number_x = 85 + (i * this.tool_ratio);
                    } else if ((_num * get_range) <= 9999) {
                        number_x = 80 + (i * this.tool_ratio);
                    } else {
                        number_x = 95 + (i * this.tool_ratio);
                    }
                    // if (_num <= 9) {
                    //     number_x = 95 + (i * this.tool_ratio);
                    // } else {
                    //     number_x = 90 + (i * this.tool_ratio);
                    // };

                    // 맨 마지막 눈금에 숫자 표기하면 자 밖으로 글자가 나가는 현상 방지
                    if (this.ruler_index == i) {
                        return;
                    } else {
                        ruler_number = new Konva.Text({
                            x         : number_x,
                            y         : 140,
                            text      : _num * get_range,
                            fontSize  : _fontSize,
                            fontFamily: 'NotoSansBlack',
                            fill      : '#32829d',
                            id        : 'ruler_number',
                            name      : 'ruler',
                            listening : false,
                        });

                        this.ruler_group.add(ruler_number);
                    }
                } else if (i % 5 == 1 && i % 2 != 1) {
                    // create grad_2 : 5mm 눈금
                    grad_height = 20;
                } else {
                    // create grad_1 : 1mm 눈금
                    if (get_ratio >= 5 && i != 0) {
                        grad_height = 7;
                    } else {
                        grad_height = 0;
                    }
                }
                ;

                // 눈금 생성
                var grad_x = 100 + (i * this.tool_ratio);
                _grad = new Konva.Shape({
                    x        : grad_x,
                    y        : 100,
                    stroke   : '#80b5cc',
                    width    : 0.5,
                    height   : grad_height,
                    scaleX   : this.ruler_scale_x,
                    scaleY   : this.ruler_scale_y,
                    id       : 'grad',
                    name     : 'ruler',
                    draggable: false,
                    listening: false,
                    sceneFunc: function (context, shape) {
                        context.beginPath();
                        context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
                        context.fillStrokeShape(shape);
                    }
                });

                // 생성된 눈금들 ruler_group add
                this.ruler_group.add(_grad);
            }
            ;

            // this.mathToolLayer.add(this.ruler_group);
            // this.mathToolLayer.batchDraw();

            document.fonts.ready.then(function () {
                self.mathToolLayer.add(self.ruler_group);
                self.mathToolLayer.batchDraw();
            });

            this.ruler_group.off('click').on('click', function (e) {
                self._setTransformer(e);
            });
        },
        node_keydown_event    : function (e) {
            var _this_stage = this.stage;
            var container = _this_stage.container();
            var target = null;

            container.focus();

            container.addEventListener('keydown', function (e) {
                if (e.repeat) {
                    return
                }

                if (_this_stage.find('.transforms').length == 0) {
                    return;
                }
                ;

                target = _this_stage.find('.transforms')[0]._nodes[0];

                // 방향키 이동
                if (e.keyCode === 37) {
                    target.x(target.x() - 1);
                } else if (e.keyCode === 38) {
                    target.y(target.y() - 1);
                } else if (e.keyCode === 39) {
                    target.x(target.x() + 1);
                } else if (e.keyCode === 40) {
                    target.y(target.y() + 1);
                } else {
                    return;
                }


                e.preventDefault();
                e.stopImmediatePropagation()
            });
        },
        make_uuid             : function DrawingCanvas_make_uuid() {
            this.node_id = undefined;

            this.node_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
                return v.toString(16);
            });
        }
    };
    return DrawingCanvas;
})();