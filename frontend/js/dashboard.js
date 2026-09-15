const username =
    localStorage.getItem("packetguardUser");


const usernameDisplay =
    document.getElementById(
        "usernameDisplay"
    );


const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );


/*
 * Protect dashboard from
 * users who have not logged in.
 */

if (!username) {

    window.location.href =
        "index.html";

}


/*
 * Display username
 */

if (username) {

    usernameDisplay.textContent =
        username;

    welcomeUser.textContent =
        username;

}


/*
 * Start Packet Simulation
 */

function startSimulation() {

    window.location.href =
        "simulator.html";

}


/*
 * Logout
 */

function logout() {

    localStorage.removeItem(
        "packetguardUser"
    );

    window.location.href =
        "index.html";

}