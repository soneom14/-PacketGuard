const loginForm = document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;


    if (!username || !password) {

        loginMessage.textContent =
            "Please enter username and password.";

        return;
    }


    /*
     * Phase 1 uses a simple local login.
     * Real authentication will be added later.
     */

    localStorage.setItem(
        "packetguardUser",
        username
    );


    loginMessage.textContent =
        "✓ Access granted. Entering Security Lab...";


    setTimeout(function () {

        window.location.href =
            "dashboard.html";

    }, 800);

});