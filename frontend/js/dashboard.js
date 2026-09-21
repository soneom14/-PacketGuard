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


    // -----------------------------
    // LEVEL THRESHOLDS
    // -----------------------------

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


    // -----------------------------
    // NEXT XP
    // -----------------------------

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


    // -----------------------------
    // PROFILE PROGRESS
    // -----------------------------

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
// DASHBOARD COMPLETION RATE
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
                localStorage.getItem(
                    mission
                ) === "completed"
            ) {

                completedCount++;

            }

        }
    );


    // -----------------------------------------
    // Calculate mission completion percentage
    // -----------------------------------------

    const accuracy =
        missions.length > 0
            ? Math.round(
                (
                    completedCount /
                    missions.length
                ) * 100
            )
            : 0;


    // -----------------------------------------
    // Original statistics card
    // -----------------------------------------

    const accuracyElement =
        document.getElementById(
            "accuracyValue"
        );


    if (accuracyElement) {

        accuracyElement.textContent =
            accuracy + "%";

    }


    // -----------------------------------------
    // Security Analytics card
    // -----------------------------------------

    const analyticsAccuracyElement =
        document.getElementById(
            "analyticsAccuracyValue"
        );


    if (analyticsAccuracyElement) {

        analyticsAccuracyElement.textContent =
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


    // -----------------------------------------
    // Level card
    // -----------------------------------------

    const levelElement =
        document.getElementById(
            "dashboardLevelValue"
        );


    if (levelElement) {

        levelElement.textContent =
            String(level).padStart(
                2,
                "0"
            );

    }


    // -----------------------------------------
    // Original XP card
    // -----------------------------------------

    const xpElement =
        document.getElementById(
            "xpValue"
        );


    if (xpElement) {

        xpElement.textContent =
            xp;

    }


    // -----------------------------------------
    // Security Analytics XP card
    // -----------------------------------------

    const analyticsXPElement =
        document.getElementById(
            "analyticsXPValue"
        );


    if (analyticsXPElement) {

        analyticsXPElement.textContent =
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


    // -----------------------------------------
    // Determine level range
    // -----------------------------------------

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


    // -----------------------------------------
    // Profile progress
    // -----------------------------------------

    const profileProgressFill =
        document.getElementById(
            "profileProgressFill"
        );


    const profileCurrentXP =
        document.getElementById(
            "profileXP"
        );


    const profileNextXP =
        document.getElementById(
            "profileNextXP"
        );


    // -----------------------------------------
    // Dashboard statistics progress
    // -----------------------------------------

    const dashboardProgressFill =
        document.getElementById(
            "dashboardLevelProgress"
        );


    const dashboardXPProgress =
        document.getElementById(
            "dashboardXPProgress"
        );


    // -----------------------------------------
    // Calculate progress
    // -----------------------------------------

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


    // -----------------------------------------
    // Update profile progress
    // -----------------------------------------

    if (profileProgressFill) {

        profileProgressFill.style.width =
            progress + "%";

    }


    if (profileCurrentXP) {

        profileCurrentXP.textContent =
            xp + " XP";

    }


    if (profileNextXP) {

        profileNextXP.textContent =
            xp >= 350
                ? "MAX LEVEL"
                : nextThreshold + " XP";

    }


    // -----------------------------------------
    // Update dashboard statistics progress
    // -----------------------------------------

    if (dashboardProgressFill) {

        dashboardProgressFill.style.width =
            progress + "%";

    }


    if (dashboardXPProgress) {

        if (xp >= 350) {

            dashboardXPProgress.textContent =
                "MAX LEVEL";

        }

        else {

            dashboardXPProgress.textContent =
                xp +
                " / " +
                nextThreshold +
                " XP";

        }

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


    // -----------------------------------------
    // Mission count
    // -----------------------------------------

    const countElement =
        document.getElementById(
            "dashboardMissionCount"
        );


    if (countElement) {

        countElement.textContent =
            completedCount +
            " / 6 COMPLETED";

    }


    // -----------------------------------------
    // Original mission statistic
    // -----------------------------------------

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


    // -----------------------------------------
    // Count completed missions
    // -----------------------------------------

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


    // -----------------------------------------
    // Investigations
    // -----------------------------------------

    const investigations =
        completedMissions;


    // -----------------------------------------
    // Count anomaly missions
    //
    // Missions 02-05 represent:
    // 02 = Packet Loss
    // 03 = Duplicate
    // 04 = Reordering
    // 05 = Tampering
    // -----------------------------------------

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


    // -----------------------------------------
    // Security Analytics elements
    // -----------------------------------------

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


    // -----------------------------------------
    // Investigation Overview elements
    // -----------------------------------------

    const overviewInvestigationElement =
        document.getElementById(
            "overviewInvestigationValue"
        );


    const overviewAnomalyElement =
        document.getElementById(
            "overviewAnomalyValue"
        );


    if (overviewInvestigationElement) {

        overviewInvestigationElement.textContent =
            investigations;

    }


    if (overviewAnomalyElement) {

        overviewAnomalyElement.textContent =
            anomaliesDetected;

    }

}


// =========================================
// UPDATE USERNAME
// =========================================

function updateDashboardUsername() {

    const username =
        localStorage.getItem(
            "packetguardUsername"
        ) || "Defender";


    const dashboardUsername =
        document.getElementById(
            "dashboardUsername"
        );


    const welcomeUsername =
        document.getElementById(
            "welcomeUsername"
        );


    if (dashboardUsername) {

        dashboardUsername.textContent =
            username;

    }


    if (welcomeUsername) {

        welcomeUsername.textContent =
            username;

    }

}


// =========================================
// INITIALIZE DASHBOARD
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboardUsername();

        updatePlayerProfile();

        updateDashboardAccuracy();

        updateDashboardStats();

        updateXPProgress();

        updateMissionProgress();

        updateSecurityAnalytics();

    }
);