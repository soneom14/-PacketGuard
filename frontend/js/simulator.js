let packets = [];
let score = 0;
let analysisResult = null;
let threatResult = null;


// =========================================
// GENERATE SIMULATED PACKETS
// =========================================

async function generatePackets() {

    packets = [];
    score = 0;
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