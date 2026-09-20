// =========================================
// PACKETGUARD DASHBOARD
// =========================================


// =========================================
// UPDATE PLAYER PROFILE
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

    }

    else if (xp >= 200) {

        level = 4;
        rank = "THREAT HUNTER";

    }

    else if (xp >= 100) {

        level = 3;
        rank = "DEFENDER";

    }

    else if (xp >= 50) {

        level = 2;
        rank = "ANALYST";

    }


    const username =
        localStorage.getItem(
            "packetguardUsername"
        ) || "Defender";


    const usernameElement =
        document.getElementById(
            "profileUsername"
        );

    const rankElement =
        document.getElementById(
            "profileRank"
        );

    const levelElement =
        document.getElementById(
            "profileLevel"
        );

    const xpElement =
        document.getElementById(
            "profileXP"
        );

    const nextXPElement =
        document.getElementById(
            "profileNextXP"
        );

    const progressElement =
        document.getElementById(
            "profileProgressFill"
        );


    if (usernameElement) {

        usernameElement.textContent =
            username;

    }


    if (rankElement) {

        rankElement.textContent =
            rank;

    }


    if (levelElement) {

        levelElement.textContent =
            "LEVEL " + level;

    }


    if (xpElement) {

        xpElement.textContent =
            xp + " XP";

    }


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

        }

        else {

            nextXPElement.textContent =
                nextThreshold + " XP";

        }

    }


    if (progressElement) {

        let progress = 100;


        if (level < 5) {

            progress =
                (
                    (xp - currentThreshold) /
                    (nextThreshold - currentThreshold)
                ) * 100;


            progress =
                Math.max(
                    0,
                    Math.min(
                        progress,
                        100
                    )
                );

        }


        progressElement.style.width =
            progress + "%";

    }

}


// =========================================
// DASHBOARD ACCURACY
// =========================================

function updateDashboardAccuracy() {

    const missions = [

        "packetguardMission01",
        "packetguardMission02",
        "packetguardMission03",
        "packetguardMission04",
        "packetguardMission05",
        "packetguardMission06"

    ];


    let completedCount = 0;


    missions.forEach(
        function (mission) {

            if (
                localStorage.getItem(mission)
                === "completed"
            ) {

                completedCount++;

            }

        }
    );


    const accuracy =
        missions.length > 0
            ? Math.round(
                (
                    completedCount /
                    missions.length
                ) * 100
            )
            : 0;


    const accuracyElement =
        document.getElementById(
            "accuracyValue"
        );


    if (accuracyElement) {

        accuracyElement.textContent =
            accuracy + "%";

    }

}


// =========================================
// DASHBOARD XP & LEVEL STATISTICS
// =========================================

function updateDashboardStats() {

    const xp =
        Number(
            localStorage.getItem(
                "packetguardXP"
            )
        ) || 0;


    let level = 1;


    if (xp >= 350) {

        level = 5;

    }

    else if (xp >= 200) {

        level = 4;

    }

    else if (xp >= 100) {

        level = 3;

    }

    else if (xp >= 50) {

        level = 2;

    }


    /*
        Find the level stat card.

        We also update the XP card using
        its existing ID.
    */

    const levelElement =
        document.querySelector(
            ".stat-card:first-child .stat-value"
        );


    const xpElement =
        document.getElementById(
            "xpValue"
        );


    if (levelElement) {

        levelElement.textContent =
            String(level).padStart(
                2,
                "0"
            );

    }


    if (xpElement) {

        xpElement.textContent =
            xp;

    }

}


// =========================================
// DYNAMIC XP PROGRESS
// =========================================

function updateXPProgress() {

    const xp =
        Number(
            localStorage.getItem(
                "packetguardXP"
            )
        ) || 0;


    let currentThreshold = 0;
    let nextThreshold = 50;


    if (xp >= 350) {

        currentThreshold = 350;
        nextThreshold = 350;

    }

    else if (xp >= 200) {

        currentThreshold = 200;
        nextThreshold = 350;

    }

    else if (xp >= 100) {

        currentThreshold = 100;
        nextThreshold = 200;

    }

    else if (xp >= 50) {

        currentThreshold = 50;
        nextThreshold = 100;

    }


    const progressFill =
        document.getElementById(
            "profileProgressFill"
        );


    const currentXP =
        document.getElementById(
            "profileXP"
        );


    const nextXP =
        document.getElementById(
            "profileNextXP"
        );


    let progress = 100;


    if (xp < 350) {

        progress =
            (
                (xp - currentThreshold) /
                (nextThreshold - currentThreshold)
            ) * 100;


        progress =
            Math.max(
                0,
                Math.min(
                    progress,
                    100
                )
            );

    }


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }


    if (currentXP) {

        currentXP.textContent =
            xp + " XP";

    }


    if (nextXP) {

        nextXP.textContent =
            xp >= 350
                ? "MAX LEVEL"
                : nextThreshold + " XP";

    }

}


// =========================================
// MISSION PROGRESS
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


    missions.forEach(
        function (mission, index) {

            const missionNumber =
                index + 1;


            const missionCard =
                document.getElementById(
                    "dashboardMission0" +
                    missionNumber
                );


            if (!missionCard) {

                return;

            }


            const status =
                missionCard.querySelector(
                    ".dashboard-mission-status"
                );


            const completed =
                localStorage.getItem(
                    mission
                ) === "completed";


            if (completed) {

                completedCount++;


                missionCard.classList.add(
                    "completed"
                );


                if (status) {

                    status.textContent =
                        "✅";

                }

            }

            else {

                missionCard.classList.remove(
                    "completed"
                );


                if (status) {

                    status.textContent =
                        "🔒";

                }

            }

        }
    );


    const countElement =
        document.getElementById(
            "dashboardMissionCount"
        );


    if (countElement) {

        countElement.textContent =
            completedCount +
            " / 6 COMPLETED";

    }


    const missionValue =
        document.getElementById(
            "missionValue"
        );


    if (missionValue) {

        missionValue.textContent =
            completedCount;

    }

}


// =========================================
// SECURITY ANALYTICS
// =========================================

function updateSecurityAnalytics() {

    const missions = [

        "packetguardMission01",
        "packetguardMission02",
        "packetguardMission03",
        "packetguardMission04",
        "packetguardMission05",
        "packetguardMission06"

    ];


    let completedMissions = 0;


    missions.forEach(
        function (mission) {

            if (
                localStorage.getItem(
                    mission
                ) === "completed"
            ) {

                completedMissions++;

            }

        }
    );


    /*
        Every completed mission represents
        one completed investigation.
    */

    const investigations =
        completedMissions;


    /*
        Missions 02-05 correspond to
        the four network anomaly types.
    */

    let anomaliesDetected = 0;


    for (
        let i = 2;
        i <= 5;
        i++
    ) {

        if (
            localStorage.getItem(
                "packetguardMission0" + i
            ) === "completed"
        ) {

            anomaliesDetected++;

        }

    }


    const investigationElement =
        document.getElementById(
            "investigationValue"
        );


    const anomalyElement =
        document.getElementById(
            "anomalyValue"
        );


    if (investigationElement) {

        investigationElement.textContent =
            investigations;

    }


    if (anomalyElement) {

        anomalyElement.textContent =
            anomaliesDetected;

    }

}


// =========================================
// INITIALIZE DASHBOARD
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updatePlayerProfile();

        updateDashboardAccuracy();

        updateDashboardStats();

        updateXPProgress();

        updateMissionProgress();

        updateSecurityAnalytics();

    }
);