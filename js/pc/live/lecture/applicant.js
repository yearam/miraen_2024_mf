let applicantScreen = {

    v: {

    },

    c: {

    },

    f: {
        checkValidation: () => {
            if ($('.lecture-section input[name=mobilePhone]').val() && $('.lecture-section input[name=schoolName]').val()) {
                if ($('input[name=inquiryYn]').val() == 'Y') {
                    if ($('input[name=ox-radio1]:checked').val()) {
                        if ($('input[name=ox-radio1]:checked').val() == 'etc') {
                            if ($('#etc').val()) {
                                return true;
                            } else {
                                $alert.open("MG00020", () => {})
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            $alert.open("MG00020", () => {});
            return false;
        },

        getParam: () => {
            let formData = new FormData();
            let lectureSeqArr = Array();
            lectureSeqArr.push($('input[name=lectureSeq]').val());
            $('input[name=otherLecture]:checked').each((index, el) => {
                lectureSeqArr.push(el.value);
            });
            formData.append('lectureSeqArr', lectureSeqArr);
            formData.append('programSeq', $('input[name=programSeq]').val());
            formData.append('mobilePhone', $('#applicantField input[name=mobilePhone]').val());
            formData.append('schoolSeq', $('#applicantField input[name=schoolSeq]').val());
            if ($('input[name=inquiryYn]').val() == 'Y') {
                formData.append('inquirySeq', $('input[name=ox-radio1]:checked').val());
                formData.append('inquiryAnswerEtc', $('input[name=inquiryAnswerEtc]').val());
            }
            formData.append('agreeYn', $('input[name=agreeYn]').val());
            return formData;
        },

        save: (e) => {
            e.preventDefault();
            if ($('input[id=policy-agreement]:checked').val() == null || $('input[id=policy-agreement]:checked').val() == '') {
                if (!$alert.open("MG00044", () => {}))  {
                    return;
                }
            }
            if (!applicantScreen.f.checkValidation()) {
                return;
            }

            $alert.open("MG00046", () => {
                applicantScreen.f.procApplicant(applicantScreen.f.procSchool);
            });
        },

        saveSchool: (e) => {
            e.preventDefault();
            $alert.open('MG00049', () => {
                $('#cancelSchoolBtn').click();
                $.each($('.table-items input[name=schoolName]'), function () {
                    $(this).val(school.schoolName);
                })
                $.each($('.table-items input[name=schoolSeq]'), function () {
                    $(this).val(school.schoolSeq);
                })
            });
        },

        procSchool: () => {
            if (school.totalCnt > 0 && school.schoolSeq) {
                let formData = new FormData();
                let data = {
                    schoolRequest: 'N',
                    selectSchoolYn: 'Y',
                    scIdx: school.schoolSeq,
                    schoolName: school.schoolName,
                    schoolLevel: school.schoolLevel,
                    memberPost: school.memberPost,
                    schoolAddress: school.schoolAddress,
                    schoolAddress2: school.schoolAddress2,
                }
                formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));
                modifySchool(formData);
            }
        },

        procApplicant: (callback) => {
            let param = applicantScreen.f.getParam();
            const options = {
                url: '/pages/api/live/lecture/procApplicant.ax',
                method: 'POST',
                contentType: false,
                processData: false,
                data: param,
                success: function (res) {
                    if (res.resultMsg === 'suc') {
                        $alert.open("MG00052", () => {
                            callback();
                            location.href = `./detail.mrn?lectureSeq=${$('input[name=lectureSeq]').val()}`;
                        });
                    } else {
                        $alert.open("MG00053", () => {
                            location.href = `./detail.mrn?lectureSeq=${$('input[name=lectureSeq]').val()}`
                        });
                    }
                }
            };

            $cmm.ajax(options);
        },

        cancelApplicant: (e) => {
            $alert.open("MG00045", () => {
                location.href = `./detail.mrn?lectureSeq=${$('input[name=lectureSeq]').val()}`;
            });
        },

        checkEtcInput: (e) => {
            $('input[id=ox-radio1-6][value=etc]').prop('checked', true);
        },
    },

    event: function () {

        $(document).on('click', '#bindSchoolBtn', applicantScreen.f.saveSchool);

        $(document).on('click', 'input[id=etc]', applicantScreen.f.checkEtcInput);

        $(document).on('click', 'button[id=procApplicantBtn]', applicantScreen.f.save);

        $(document).on('click', 'button[id=cancelApplicantBtn]', applicantScreen.f.cancelApplicant);

    },

    init: function () {
        $('#saveSchoolBtn').attr('id', 'bindSchoolBtn');
        applicantScreen.event();
    },

};

applicantScreen.init();