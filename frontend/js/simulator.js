let packets = [];

let score =
    Number(
        localStorage.getItem(
            "packetguardXP"
        )
    ) || 0;

let analysisResult = null;

let threatResult = null;


// =========================================
// GENERATE SIMULATED PACKETS 
// =========================================

async function generatePackets() {

    packets = [];
    analysisResult = null;
    threatResult = null;

    const packetStatus =
        document.getElementById("packetStatus");

    if (packetStatus) {
        packetStatus.textContent =
            "● GENERATING TRAFFIC...";
    }

    try {

        // Send request to Flask backend
        const response = await fetch(
            "/api/simulate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    count: 20
                })
            }
        );


        if (!response.ok) {
            throw new Error(
                "Server returned " + response.status
            );
        }


        // Convert response to JSON
        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Packet simulation failed."
            );

        }


        // =========================================
        // STORE GENERATED PACKETS
        // =========================================

        packets =
            data.packets || [];


        // =========================================
        // STORE BACKEND ANALYSIS
        // =========================================

        analysisResult =
            data.analysis || null;


        // =========================================
        // STORE THREAT DETECTION RESULT
        // =========================================

        threatResult =
            data.threats || null;


        // =========================================
        // DISPLAY PACKETS
        // =========================================

        displayPackets();


        // =========================================
        // UPDATE STATISTICS
        // =========================================

        updateStats();


        // =========================================
        // DISPLAY PACKET ANALYSIS
        // =========================================

        displayAnalysis();


        // =========================================
        // DISPLAY THREAT DETECTION
        // =========================================

        displayThreats();


        if (packetStatus) {

            packetStatus.textContent =
                "● LIVE TRAFFIC ANALYSED";

        }

    }

    catch (error) {

        console.error(
            "Packet simulation error:",
            error
        );


        if (packetStatus) {

            packetStatus.textContent =
                "● SIMULATION ERROR";

        }


        alert(
            "Unable to connect to PacketGuard backend.\n\n" +
            "Make sure Flask is running on http://127.0.0.1:5000"
        );

    }

}


// =========================================
// DISPLAY PACKETS
// =========================================

function displayPackets() {

    const table =
        document.getElementById(
            "packetTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    packets.forEach(packet => {

        const row =
            document.createElement("tr");


        const packetId =
            packet.id ??
            packet.packet_id ??
            "-";


        const source =
            packet.source ??
            packet.source_ip ??
            "-";


        const destination =
            packet.destination ??
            packet.destination_ip ??
            "-";


        const protocol =
            packet.protocol ??
            "-";


        const sequence =
            packet.sequence ??
            "-";


        const size =
            packet.size ??
            packet.length ??
            packet.packet_size ??
            "-";


        let status =
            packet.status ??
            "NORMAL";


        // If backend uses integrity instead of status
        if (
            status === "NORMAL" &&
            packet.integrity &&
            String(packet.integrity).toUpperCase() === "INVALID"
        ) {

            status = "TAMPERED";

        }


        row.innerHTML = `

            <td>
                #${packetId}
            </td>

            <td>
                ${source}
            </td>

            <td>
                ${destination}
            </td>

            <td>
                ${protocol}
            </td>

            <td>
                ${sequence}
            </td>

            <td>
                ${size} B
            </td>

            <td>

                <span class="packet-status">
                    ${status}
                </span>

            </td>

            <td>

                <button
                    class="analyse-button"
                    onclick="analyzePacket('${packetId}')">

                    ANALYSE

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// =========================================
// ANALYSE INDIVIDUAL PACKET
// =========================================

function analyzePacket(id) {

    const packet =
        packets.find(
            p =>
                String(
                    p.id ??
                    p.packet_id
                ) === String(id)
        );


    if (!packet) {
        return;
    }


    const packetId =
        packet.id ??
        packet.packet_id ??
        "-";


    const source =
        packet.source ??
        packet.source_ip ??
        "-";


    const destination =
        packet.destination ??
        packet.destination_ip ??
        "-";


    const protocol =
        packet.protocol ??
        "-";


    const sequence =
        packet.sequence ??
        "-";


    const size =
        packet.size ??
        packet.length ??
        packet.packet_size ??
        "-";


    const integrity =
        packet.integrity ??
        "N/A";


    let message =
        "✓ Packet behaviour appears normal.";


    if (
        String(integrity).toUpperCase() ===
        "INVALID"
    ) {

        message =
            "🚨 Possible packet integrity problem detected.";

    }


    // Increase score for analysing a packet
    score += 5;


    const scoreElement =
        document.getElementById("score");


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    alert(

        "PACKET #" +
        packetId +

        "\n\nSource: " +
        source +

        "\nDestination: " +
        destination +

        "\nProtocol: " +
        protocol +

        "\nSequence: " +
        sequence +

        "\nSize: " +
        size +
        " bytes" +

        "\nIntegrity: " +
        integrity +

        "\n\n" +
        message

    );

}


// =========================================
// DISPLAY BACKEND ANALYSIS
// =========================================

function displayAnalysis() {

    if (!analysisResult) {
        return;
    }


    let analysisPanel =
        document.getElementById(
            "packetAnalysisPanel"
        );


    // Create panel if it doesn't exist
    if (!analysisPanel) {

        analysisPanel =
            document.createElement("div");


        analysisPanel.id =
            "packetAnalysisPanel";


        analysisPanel.style.margin =
            "20px 0";


        analysisPanel.style.padding =
            "20px";


        analysisPanel.style.border =
            "1px solid rgba(0, 191, 255, 0.35)";


        analysisPanel.style.borderRadius =
            "12px";


        analysisPanel.style.background =
            "rgba(0, 0, 0, 0.25)";


        analysisPanel.style.color =
            "#ffffff";


        const table =
            document.getElementById(
                "packetTable"
            );


        if (
            table &&
            table.parentElement
        ) {

            table.parentElement
                .parentElement
                .insertBefore(
                    analysisPanel,
                    table.parentElement
                );

        }

        else {

            document.body.prepend(
                analysisPanel
            );

        }

    }


    const summary =
        analysisResult.summary || {};


    const anomalies =
        analysisResult.anomalies || [];


    let anomalyHTML =
        "";


    if (anomalies.length === 0) {

        anomalyHTML = `

            <p>
                ✓ No packet anomalies detected.
            </p>

        `;

    }

    else {

        anomalyHTML =
            anomalies.map(
                anomaly => `

                    <div
                        style="
                            margin-top:10px;
                            padding:10px;
                            border-radius:8px;
                            background:rgba(255,255,255,0.06);
                        "
                    >

                        <strong>
                            ${anomaly.type}
                        </strong>

                        <br>

                        Severity:
                        ${anomaly.severity}

                        <br>

                        ${anomaly.description}

                    </div>

                `
            ).join("");

    }


    analysisPanel.innerHTML = `

        <h2>
            🛡️ Packet Analysis
        </h2>

        <p>
            <strong>Status:</strong>
            ${analysisResult.status}
        </p>

        <p>
            <strong>Total Packets:</strong>
            ${analysisResult.total_packets}
        </p>

        <hr>

        <h3>
            Analysis Summary
        </h3>

        <p>
            📉 Packet Loss:
            ${summary.packet_loss ?? 0}
        </p>

        <p>
            🔁 Duplicates:
            ${summary.duplicates ?? 0}
        </p>

        <p>
            🔀 Reordered:
            ${summary.reordered ?? 0}
        </p>

        <p>
            🔐 Integrity Errors:
            ${summary.integrity_errors ?? 0}
        </p>

        <hr>

        <h3>
            Detected Anomalies
        </h3>

        ${anomalyHTML}

    `;

}


// =========================================
// DISPLAY THREAT DETECTION
// =========================================

// =========================================
// DISPLAY THREAT DETECTION
// =========================================

function displayThreats() {

    if (!threatResult) {
        return;
    }

    let threatPanel =
        document.getElementById(
            "threatDetectionPanel"
        );

    // Create panel if it doesn't exist
    if (!threatPanel) {

        threatPanel =
            document.createElement("div");

        threatPanel.id =
            "threatDetectionPanel";

        const analysisPanel =
            document.getElementById(
                "packetAnalysisPanel"
            );

        if (analysisPanel) {

            analysisPanel.parentElement.insertBefore(
                threatPanel,
                analysisPanel.nextSibling
            );

        } else {

            document.body.prepend(
                threatPanel
            );

        }

    }

    const threats =
        threatResult.threats || [];

    const riskScore =
        Number(threatResult.risk_score || 0);

    const riskLevel =
        threatResult.risk_level || "LOW";

    let riskColor = "#00ff88";

    if (riskLevel === "MEDIUM") {
        riskColor = "#ffaa00";
    }

    if (riskLevel === "HIGH") {
        riskColor = "#ff4444";
    }

    let threatHTML = "";

    if (threats.length === 0) {

        threatHTML = `
            <div class="threat-empty">
                ✓ No potential threats detected.
            </div>
        `;

    } else {

        threatHTML =
            threats.map(
                threat => `

                    <div
                        class="threat-item"
                    >

                        <div class="threat-title">
                            🚨 ${threat.type}
                        </div>

                        <div class="threat-details">

                            <span>
                                Severity:
                                <strong>
                                    ${threat.severity}
                                </strong>
                            </span>

                            <span>
                                Risk Score:
                                <strong>
                                    ${threat.risk_score}
                                </strong>
                            </span>

                        </div>

                        <div class="threat-description">
                            ${threat.description}
                        </div>

                    </div>

                `
            ).join("");

    }

    threatPanel.innerHTML = `

        <div class="threat-header">

            <div>

                <div class="threat-label">
                    SECURITY ASSESSMENT
                </div>

                <h2>
                    🚨 Threat Detection
                </h2>

            </div>

            <div
                class="risk-badge"
                style="
                    border-color:${riskColor};
                    color:${riskColor};
                "
            >
                ${riskLevel} RISK
            </div>

        </div>


        <div class="risk-section">

            <div class="risk-score">

                <div
                    class="risk-number"
                    style="color:${riskColor};"
                >
                    ${riskScore}
                </div>

                <div class="risk-out-of">
                    / 100
                </div>

            </div>

            <div class="risk-text">
                CURRENT RISK SCORE
            </div>


            <div class="risk-bar">

                <div
                    class="risk-fill"
                    style="
                        width:${Math.min(
        riskScore,
        100
    )}%;
                        background:${riskColor};
                        box-shadow:
                            0 0 12px ${riskColor};
                    "
                ></div>

            </div>

        </div>


        <div class="threat-summary">

            <div>
                <span>Status</span>
                <strong>
                    ${threatResult.status}
                </strong>
            </div>

            <div>
                <span>Risk Level</span>
                <strong style="color:${riskColor};">
                    ${riskLevel}
                </strong>
            </div>

            <div>
                <span>Threats Detected</span>
                <strong>
                    ${threatResult.threat_count}
                </strong>
            </div>

        </div>


        <hr>


        <h3>
            Detected Threats
        </h3>


        <div class="threat-list">

            ${threatHTML}

        </div>

    `;

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStats() {

    const total =
        packets.length;


    let normal =
        total;


    // Use backend analysis when available
    if (analysisResult) {

        const summary =
            analysisResult.summary || {};


        const anomalyCount =
            (summary.packet_loss || 0) +
            (summary.duplicates || 0) +
            (summary.reordered || 0) +
            (summary.integrity_errors || 0);


        normal =
            Math.max(
                0,
                total - anomalyCount
            );

    }


    const anomalies =
        total - normal;


    const totalElement =
        document.getElementById(
            "totalPackets"
        );


    const normalElement =
        document.getElementById(
            "normalPackets"
        );


    const anomalyElement =
        document.getElementById(
            "anomalyPackets"
        );


    const scoreElement =
        document.getElementById(
            "score"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (normalElement) {

        normalElement.textContent =
            normal;

    }


    if (anomalyElement) {

        anomalyElement.textContent =
            anomalies;

    }


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }

}


// =========================================
// RETURN TO DASHBOARD
// =========================================

function goDashboard() {

    window.location.href =
        "dashboard.html";

}

// =========================================
// MISSION 01 - ANSWER HANDLER
// =========================================

function answerMission(answer) {

    // Make sure traffic has been generated
    if (!threatResult) {

        alert(
            "Generate traffic first before attempting the mission."
        );

        return;
    }


    const feedback =
        document.getElementById(
            "missionFeedback"
        );


    if (!feedback) {
        return;
    }


    // =========================================
    // DETERMINE CORRECT ANSWER
    // =========================================

    let correctAnswer = "NORMAL";


    const threats =
        threatResult.threats || [];


    const hasTampering =
        threats.some(
            threat =>
                threat.type ===
                "POSSIBLE_TAMPERING"
        );


    const hasReplay =
        threats.some(
            threat =>
                threat.type ===
                "POSSIBLE_REPLAY_ACTIVITY"
        );


    const packetLoss =
        analysisResult &&
            analysisResult.summary
            ? analysisResult.summary.packet_loss || 0
            : 0;


    // Tampering has highest priority
    if (hasTampering) {

        correctAnswer =
            "TAMPERING";

    }

    else if (hasReplay) {

        correctAnswer =
            "REPLAY";

    }

    else if (packetLoss > 0) {

        correctAnswer =
            "PACKET_LOSS";

    }


    // =========================================
    // CHECK ANSWER
    // =========================================

    if (answer === correctAnswer) {

        // Prevent repeatedly earning points
        if (
            feedback.dataset.completed ===
            "true"
        ) {
            return;
        }


        feedback.dataset.completed =
            "true";

        localStorage.setItem(
            "packetguardMission01",
            "completed"
        );

        unlockMission02();


        // Award mission points
        score += 50;

        localStorage.setItem(
            "packetguardXP",
            score
        );

        updateLevel();


        const scoreElement =
            document.getElementById(
                "score"
            );


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        // Disable all mission buttons
        const mission01Panel =
            document.getElementById("missionPanel");

        const buttons =
            mission01Panel
                ? mission01Panel.querySelectorAll(".mission-option")
                : [];


        buttons.forEach(button => {

            button.disabled =
                true;

            button.style.cursor =
                "default";

        });


        feedback.innerHTML = `

            <strong>
                ✅ MISSION COMPLETE
            </strong>

            <br>

            Correct identification:
            <strong>
                ${answer === "TAMPERING"
                ? "Possible Tampering"
                : answer === "REPLAY"
                    ? "Replay Activity"
                    : answer === "PACKET_LOSS"
                        ? "Packet Loss"
                        : "Normal Network Behaviour"}
            </strong>

            <br>

            🎯 +50 XP awarded.

        `;


        feedback.style.border =
            "1px solid rgba(0, 255, 136, 0.4)";


        feedback.style.background =
            "rgba(0, 255, 136, 0.08)";


        feedback.style.color =
            "#00ff88";

    }

    else {

        feedback.innerHTML = `

            <strong>
                ❌ INCORRECT
            </strong>

            <br>

            Analyse the packet evidence
            and threat detection results
            and try again.

        `;


        feedback.style.border =
            "1px solid rgba(255, 70, 70, 0.4)";


        feedback.style.background =
            "rgba(255, 70, 70, 0.08)";


        feedback.style.color =
            "#ff6666";

    }

}

// =========================================
// PACKETGUARD XP & LEVEL SYSTEM
// =========================================

function updateLevel() {

    let level = 1;
    let title = "Recruit";


    if (score >= 350) {

        level = 5;
        title = "Security Specialist";

    }

    else if (score >= 200) {

        level = 4;
        title = "Threat Hunter";

    }

    else if (score >= 100) {

        level = 3;
        title = "Defender";

    }

    else if (score >= 50) {

        level = 2;
        title = "Analyst";

    }


    const levelElement =
        document.getElementById(
            "playerLevel"
        );


    const titleElement =
        document.getElementById(
            "levelTitle"
        );


    const scoreElement =
        document.getElementById(
            "score"
        );


    if (levelElement) {

        levelElement.textContent =
            level;

    }


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }

}

// =========================================
// INITIALIZE PLAYER PROGRESS
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateLevel();

    }
);

// =========================================
// MISSION 02 - PACKET LOSS INVESTIGATION
// =========================================

let mission02Result = null;
let mission02Completed = false;


// =========================================
// UNLOCK MISSION 02
// =========================================

function unlockMission02() {

    const panel =
        document.getElementById("mission02Panel");

    const status =
        document.getElementById("mission02Status");

    const startButton =
        document.getElementById("mission02StartButton");

    if (!panel || !status || !startButton) {
        return;
    }

    panel.classList.remove("mission-locked");

    status.textContent =
        "Mission unlocked. Start the investigation.";

    status.style.color = "#00c8ff";

    startButton.disabled = false;
}


// =========================================
// START MISSION 02
// =========================================

async function startMission02() {

    const status =
        document.getElementById("mission02Status");

    const question =
        document.getElementById("mission02Question");

    const options =
        document.getElementById("mission02Options");

    const startButton =
        document.getElementById("mission02StartButton");


    if (status) {
        status.textContent =
            "Generating packet-loss investigation...";
    }


    if (startButton) {
        startButton.disabled = true;
    }


    try {

        const response =
            await fetch(
                "/api/simulate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        count: 10,
                        scenario: "loss"
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Mission 02 simulation failed."
            );

        }


        mission02Result = data;


        // Show the question
        if (question) {
            question.style.display = "block";
        }


        // Show answer options
        if (options) {
            options.style.display = "grid";
        }


        if (status) {

            const loss =
                data.analysis &&
                    data.analysis.summary
                    ? data.analysis.summary.packet_loss || 0
                    : 0;

            status.innerHTML = `
                🔎 Investigation started.<br>
                <strong>${data.count}</strong>
                packets received.
                <br>
                Analyse the sequence and identify
                what happened.
            `;

        }


    }
    catch (error) {

        console.error(
            "Mission 02 error:",
            error
        );


        if (status) {

            status.textContent =
                "Unable to start Mission 02. Make sure the Flask backend is running.";

        }


        if (startButton) {
            startButton.disabled = false;
        }

    }

}


// =========================================
// MISSION 02 - ANSWER HANDLER
// =========================================

function answerMission02(answer) {

    if (!mission02Result) {

        alert(
            "Start Mission 02 first."
        );

        return;
    }


    const status =
        document.getElementById(
            "mission02Status"
        );


    const options =
        document.getElementById(
            "mission02Options"
        );


    const analysis =
        mission02Result.analysis || {};


    const summary =
        analysis.summary || {};


    const packetLoss =
        summary.packet_loss || 0;


    // =========================================
    // CORRECT ANSWER
    // =========================================

    if (
        answer === "PACKET_LOSS" &&
        packetLoss > 0
    ) {

        if (mission02Completed) {
            return;
        }


        mission02Completed = true;


        // Award 50 XP
        score += 50;


        localStorage.setItem(
            "packetguardXP",
            score
        );


        localStorage.setItem(
            "packetguardMission02",
            "completed"
        );


        updateLevel();


        const scoreElement =
            document.getElementById(
                "score"
            );


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        if (options) {

            const buttons =
                options.querySelectorAll(
                    "button"
                );


            buttons.forEach(button => {

                button.disabled = true;

            });

        }


        if (status) {

            status.innerHTML = `

                <strong>
                    ✅ MISSION 02 COMPLETE
                </strong>

                <br><br>

                Correct identification:
                <strong>Packet Loss</strong>

                <br>

                Missing sequence numbers were detected
                in the network stream.

                <br><br>

                🎯 +50 XP awarded.

                <br><br>

                🔓 Mission 03 unlocked.

            `;


            status.style.border =
                "1px solid rgba(0, 255, 136, 0.4)";


            status.style.background =
                "rgba(0, 255, 136, 0.08)";


            status.style.color =
                "#00ff88";

        }


        // Prepare Mission 03 unlock state
        localStorage.setItem(
            "packetguardMission03Unlocked",
            "true"
        );


    }

    // =========================================
    // INCORRECT ANSWER
    // =========================================

    else {

        if (status) {

            status.innerHTML = `

                <strong>
                    ❌ INCORRECT
                </strong>

                <br><br>

                Look at the packet sequence numbers.

                <br>

                Some expected sequence numbers
                are missing from the stream.

                <br>

                Try again.

            `;


            status.style.border =
                "1px solid rgba(255, 70, 70, 0.4)";


            status.style.background =
                "rgba(255, 70, 70, 0.08)";


            status.style.color =
                "#ff6666";

        }

    }

}


// =========================================
// CHECK MISSION 02 UNLOCK STATUS
// =========================================

function checkMission02Unlock() {

    const mission01Completed =
        localStorage.getItem(
            "packetguardMission01"
        ) === "completed";


    /*
     * Also unlock if the player already has
     * 50+ XP from the existing Mission 01.
     *
     * This makes your current progress safer
     * if Mission 01 was completed before we added
     * the dedicated mission flag.
     */

    if (
        mission01Completed ||
        score >= 50
    ) {

        unlockMission02();

    }

}


// =========================================
// INITIALIZE MISSION SYSTEM
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkMission02Unlock();

    }
);