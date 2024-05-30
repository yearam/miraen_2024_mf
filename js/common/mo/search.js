$(function () {
  let screen = {
    v: {

    },

    c: {

    },

    f: {
      moveTotalSearch: function (e) {
        if (!$('header[data-type="totalsearch-header"]').length) {
          let totalSearchUrl = '/pages/common/totalsearch/totalSearch.mrn'
          let searchVal = '';
          const headerSchoolGrade = $(e.currentTarget).closest('header').attr('school-grade');
          let schoolLevel = headerSchoolGrade === 'MIDDLE' ? 'mid' : headerSchoolGrade === 'HIGH' ? 'high' : 'ele';

          if ($('.search-inner > input').length || $('.search-box > input[type="search"]').length) {
            if ($('.search-inner > input').val()) {
              searchVal = $('.search-inner > input').val();
            } else {
              searchVal = $('.search-box > input[type="search"]').val();
            }

            const totalSearchUrlWithParam = totalSearchUrl + `?searchTxt=${searchVal}&schoolLevel=${schoolLevel}`

            console.log("searchVal", searchVal)

            location.href = totalSearchUrlWithParam;
          }
        }
      },
    },

    event: function () {
      $('#mo_search').on('click', () => {
        console.log("totalsearchYn: ", $('#totalsearchYn').val());
        if ($('#totalsearchYn').val() === 'true') {
          location.href = '/pages/common/totalsearch/totalSearch.mrn';
        } else {
          $alert.open("MG00059");
        }
      })
      //$('#mo_search').on("click", (e) => {
      //  console.log("totalsearchYn: ", $('#totalsearchYn').val());
      //  if ($('#totalsearchYn').val() === 'true') {
      //    screen.f.moveTotalSearch(e);
      //  } else {
      //    $alert.open("MG00059");
      //  }
      //});
    },

    init: function () {
      console.log('search.js init');
      screen.event();
    },
  };
  screen.init();
});