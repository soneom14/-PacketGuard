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

// =========================================
// PLAYER PROFILE - LIVE XP & LEVEL
// =========================================

function updatePlayerProfile() {

    const xp =
        Number(
            localStorage.getItem("packetguardXP")
        ) || 0;

    let level = 1;
    let rank = "RECRUIT";

    if (xp >= 350) {
        level = 5;
        rank = "SECURITY SPECIALIST";
    } else if (xp >= 200) {
        level = 4;
        rank = "THREAT HUNTER";
    } else if (xp >= 100) {
        level = 3;
        rank = "DEFENDER";
    } else if (xp >= 50) {
        level = 2;
        rank = "ANALYST";
    }

    const username =
        localStorage.getItem("packetguardUsername")
        || "Defender";

    const usernameElement =
        document.getElementById("profileUsername");

    const rankElement =
        document.getElementById("profileRank");

    const levelElement =
        document.getElementById("profileLevel");

    const xpElement =
        document.getElementById("profileXP");

    const nextXPElement =
        document.getElementById("profileNextXP");

    const progressElement =
        document.getElementById("profileProgressFill");


    if (usernameElement) {
        usernameElement.textContent = username;
    }

    if (rankElement) {
        rankElement.textContent = rank;
    }

    if (levelElement) {
        levelElement.textContent =
            "LEVEL " + level;
    }

    if (xpElement) {
        xpElement.textContent =
            xp + " XP";
    }


    // Calculate progress toward next level

    let currentThreshold = 0;
    let nextThreshold = 50;

    if (level === 2) {
        currentThreshold = 50;
        nextThreshold = 100;
    }

    else if (level === 3) {
        currentThreshold = 100;
        nextThreshold = 200;
    }

    else if (level === 4) {
        currentThreshold = 200;
        nextThreshold = 350;
    }

    else if (level === 5) {
        currentThreshold = 350;
        nextThreshold = 350;
    }


    if (nextXPElement) {

        if (level === 5) {
            nextXPElement.textContent =
                "MAX LEVEL";
        } else {
            nextXPElement.textContent =
                nextThreshold + " XP";
        }

    }


    if (progressElement) {

        let progress = 100;

        if (level < 5) {

            progress =
                ((xp - currentThreshold) /
                    (nextThreshold - currentThreshold)) * 100;

            progress =
                Math.max(0, Math.min(progress, 100));
        }

        progressElement.style.width =
            progress + "%";
    }
}


// =========================================
// PLAYER PROFILE INITIALIZATION
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updatePlayerProfile();

    }
);

// =========================================
// DASHBOARD MISSION PROGRESS
// =========================================

function updateMissionProgress() {

    const missions = [
        "packetguardMission01",
        "packetguardMission02",
        "packetguardMission03",
        "packetguardMission04",
        "packetguardMission05",
        "packetguardMission06"
    ];

    let completedCount = 0;

    missions.forEach(function (mission, index) {

        const missionNumber = index + 1;

        const missionCard =
            document.getElementById(
                "dashboardMission0" + missionNumber
            );

        if (!missionCard) return;

        const status =
            missionCard.querySelector(
                ".dashboard-mission-status"
            );

        const completed =
            localStorage.getItem(mission) === "completed";

        if (completed) {

            completedCount++;

            missionCard.classList.add("completed");

            if (status) {
                status.textContent = "✅";
            }

        } else {

            missionCard.classList.remove("completed");

            if (status) {
                status.textContent = "🔒";
            }
        }
    });


    const countElement =
        document.getElementById(
            "dashboardMissionCount"
        );

    if (countElement) {

        countElement.textContent =
            completedCount + " / 6 COMPLETED";
    }


    // Update dashboard mission statistic

    const missionValue =
        document.getElementById("missionValue");

    if (missionValue) {
        missionValue.textContent =
            completedCount;
    }
}


// =========================================
// MISSION PROGRESS INITIALIZATION
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateMissionProgress();

    }
);