
const getDataByFileId = (videoFileId) => {
    mteacherViewer.get_file_info(videoFileId)
        .then(function (data) {
            // 파일 정보 가져오기 실패시
            return new Promise(function (resolve, reject) {
                if (data.status === false) {
                    $.LoadingOverlay("hide");
                    vex.dialog.confirm({
                        message: "파일 정보가 없습니다. 확인 후 이용해주세요.",
                        buttons: [
                            $.extend({}, vex.dialog.buttons.NO, { text: '닫기' })
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

                resolve(data);
            })
        })
        .then(function (data) {
            if (data) {
                playCmsVideo(data)
            }
        })

}


const playCmsVideo = (data) => {
    let video = document.getElementById('totalboardDetailVideo');

    if (Hls.isSupported()) {
        let hls = new Hls();
        hls.loadSource(data.pages[0].file);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    }
}



const getVideoType = () => {
    const videoUploadMethodSelector = document.querySelector('[name=videoUploadMethod]');
    const videoUploadMethod = videoUploadMethodSelector ? videoUploadMethodSelector.value : '';

    const videoFileIdSelector = document.querySelector('[name=videoFileId]');
    const videoFileId = videoFileIdSelector ? videoFileIdSelector.value : '';

    const videoBox = document.querySelector('.video-box')

    if (videoBox && videoUploadMethod === "CMS") {
        getDataByFileId(videoFileId)
    }

}

setTimeout(function () {
    getVideoType();
}, 500);

