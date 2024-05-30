$(function () {
  let screen = {
    v: {
      pathname: null,
    },

    c: {
      getFamilySite: () => {
        const options = {
          method: "POST",
          url: "/pages/api/familySite.ax",
          data: {
            pathname: screen.v.pathname
          },
          success: (res) => {
            screen.f.bindFamilySite(res?.rows);
          },
        };

        $cmm.ajax(options);
      },

    },

    f: {
      bindFamilySite: (list) => {
        const ul = $("#family-site ul");
        let html = "";

        ul.empty();

        for (const upMenu of list) {
          let newIcon = "";

          if (upMenu.level === 1) {

            if (upMenu.newIcon === "Y") newIcon = "<span class='new'>N</span>";

            html += `
              <li>
                <h4><strong>${upMenu.name}</strong>${newIcon}</h4>
                <ul class="ul-dot size-sm">
            `;

            for (const subMenu of list) {
              newIcon = "";

              if (subMenu.newIcon === "Y") newIcon = "<span class='new'>N</span>";

              if (subMenu.level === 2 && subMenu.pSeq === upMenu.seq) {
                html += `
                  <li>
                    <a href="${subMenu.url}" 
                       target="${subMenu.method}" 
                       title="${subMenu.name}">
                      ${subMenu.name}
                      ${newIcon}
                    </a>
                  </li>
                `;
              }
            }

            html += `
               </ul>
             </li>
            `;
          }
        }

        ul.append(html);
      },

    },

    event: () => {},

    init: () => {
      screen.v.pathname = location.pathname;

      screen.c.getFamilySite();
    },
  };

  screen.init();
});