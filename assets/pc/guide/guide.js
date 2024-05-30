function contentAside() {
  $('.button-snb').on('click', function () {
    $('.guide-aside').toggleClass('show');
  });
}
function projectName() {
  $('.guide > .wrap').prepend(html);
  $('.footer').append('<p>2023 엠티처 퍼블리싱 가이드</p>');
}

function guideList() {
  $('.ia .page-code').each(function (i, e) {
    var current = $(e);
    var depth = current.closest('main').prop('id');
    var baseUrl = '../../html/' + depth + '/';
    var wrapAnchor = $('<a>')
      .attr('href', baseUrl + current.text().toLowerCase() + '.html')
      .text(e.textContent);
    // console.log(current.next());
    if ($(this).next().text() != '') {
      current.html(wrapAnchor);
    }
  });
}

const guideQuickMenu = function () {
  let ia = [];
  var idx = 0;

  for (var i = 0; i < $('[id]').length; i++) {
    if ($('[id]').eq(i).attr('id').includes('menu')) {
      ia[idx] = $('[id]').eq(i);
      idx++;
    }
  }

  for (var i = 0; i < ia.length; i++) {
    var quickMenuTitle = ia[i].find('h2').text();
    var num = 0;
    var finishLength = ia[i].find('tr:not(.exception) td.finish').length;

    // console.log(`${quickMenuTitle} = ${finishLength}`);

    for (var j = 0; j < finishLength; j++) {
      if (ia[i].find('tr:not(.exception) td.finish').eq(j).text() !== '') {
        num++;
      }
    }


    $('.quick_menu').append(`
      <li>
        <a href="#${ia[i].attr("id")}">${quickMenuTitle}<span class="ing">${parseInt((num / finishLength) * 100)}%</span></a>
      </li>`);
  }
};

$(document).ready(function () {
  // projectName();
  contentAside();
  guideList();
  guideQuickMenu();
});
