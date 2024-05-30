let _login_once = true;
function gologout() {
    if (_login_once) {
        _login_once = false; // 1회 들어오고 그 다음은 막는다.
        location.href='/User/Logout.ax'; // 최초 1회 return 은 true

        // gate cookie null값으로 세팅
        var name = 'MT-GATE-TOKEN';
        var expires = "";
        if (1) {
            var date = new Date();
            date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (null || "") + expires + "; path=/";
    } else {
        return false; // 2회 부터 false
    }
}