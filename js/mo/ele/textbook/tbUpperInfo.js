$(function () {
    let textbookDetailScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf textbookDetailScreen
         */
        v: {

        },

        /**
         * 통신 객체- call
         *
         * @memberOf textbookDetailScreen
         */
        c: {
            /**
             * 교과서 상세정보 조회
             *
             * @memberOf textbookDetailScreen.c
             */
            getTextbookDetail: () => {
                const options = {
                    url: '/pages/ele/textbook/textbookDetail.ax',
                    data: { masterSeq },
                    method: 'GET',
                    async: false,
                    success: function(res) {
                        console.log("textbookDetail response: ", res);

                        $.each(res, function (index, item) {
                            textbookDetailScreen.v.textbookListHtml = `
                              
                            `;
                        })
                    }
                };

                $.ajax(options);

            },



        },

        /**
         * 내부 함수
         *
         * @memberOf textbookDetailScreen
         */
        f: {


        },

        init: function () {
            textbookDetailScreen.event();
        },
        event: function () {

        }
    };
    textbookDetailScreen.init();
});