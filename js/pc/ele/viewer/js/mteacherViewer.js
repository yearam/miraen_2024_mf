let mteacherViewer = {
    get_file_info: function (file_id) {
        return new Promise(function (resolve, reject) {
            if (!file_id) {
                reject(
                    vex.dialog.confirm({
                        message : "파일 정보가 없습니다. 확인 후 이용해주세요.",
                        buttons : [
                            $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                        ],
                        callback: function (value) {
                            window.close();
                        }
                    })
                );
                return;
            }
            $.ajax({
                method: "GET",
                url: '/pages/api/preview/previewItem.ax',
                data: { fileId: file_id },
                success: function (data) {
                    console.log(data);
                    resolve(data);

                    if (data.download_yn == 'N') $('#download').addClass('display-hide');
                },
                error: function (error) {
                    reject(
                        vex.dialog.confirm({
                            message : "에러가 발생하였습니다. 파일 정보를 확인해주세요.",
                            buttons : [
                                $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                            ],
                            callback: function () {
                                window.close();
                            }
                        })
                    )
                    console.log("get_file_info error : " + error)
                }
            })
        });
    },

    get_file_down_direct: function (file_id) {
        if (!file_id) {
            vex.dialog.confirm({
                message : "파일 정보가 없습니다. 확인 후 이용해주세요.",
                buttons : [
                    $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                ],
                callback: function (value) {
                    if (_cb) {
                        _cb("close");
                    } else {
                        window.close();
                    }
                }
            });
            return;
        }
        $.ajax({
            method: "GET",
            url: "/pages/api/file/down/" + file_id,
            success: function (data) {
                console.log(data);
                let link = document.createElement('a');
                link.href= data.down_url;
                link.target = '_blank'
                link.click();
                link.remove();
            },
            error: function (error) {
                console.log("get_file_down_direct error : " + error);
                vex.dialog.confirm({
                    message : "에러가 발생하였습니다. 파일 정보를 확인해주세요.",
                    buttons : [
                        $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                    ],
                    callback: function (value) {
                        if (_cb) {
                            _cb("close");
                        } else {
                            window.close();
                        }
                    }
                })
            }
        })
    },

    get_play_list_info: function (playlist) {
        // 다운로드 버튼 숨김 처리
        $('#download').addClass('display-hide');

        return new Promise(function (resolve, reject) {
            if (!playlist) {
                reject(
                    vex.dialog.confirm({
                        message : "플레이리스트 정보가 없습니다. 확인 후 이용해주세요.",
                        buttons : [
                            $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                        ],
                        callback: function (value) {
                            window.close();
                        }
                    })
                );
                return;
            }
            $.ajax({
                method: "GET",
                url: '/pages/api/preview/playlistItem.ax',
                data: { playGroupId: playlist },
                success: function (data) {
                    console.log(data);
                    resolve(data);
                },
                error: function (error) {
                    reject(
                        vex.dialog.confirm({
                            message : "에러가 발생하였습니다. 플레이리스트 정보를 확인해주세요.",
                            buttons : [
                                $.extend({}, vex.dialog.buttons.NO, {text: '닫기'})
                            ],
                            callback: function () {
                                window.close();
                            }
                        })
                    )
                    console.log("get_play_list_info : " + error)
                }
            })
        });
    }
}