let packets = [];
let score = 0;


// =========================================
// GENERATE SIMULATED PACKETS
// =========================================

function generatePackets() {

    packets = [];
    score = 0;

    const statuses = [
        "NORMAL",
        "NORMAL",
        "NORMAL",
        "NORMAL",
        "NORMAL",
        "NORMAL",
        "PACKET LOSS",
        "DUPLICATE",
        "REORDERED",
        "TAMPERED"
    ];


    // Generate 20 packets

    for (let i = 1; i <= 20; i++) {

        const status =
            statuses[
            Math.floor(
                Math.random() * statuses.length
            )
            ];


        const sourceNumber =
            Math.floor(Math.random() * 3) + 10;


        const destinationNumber =
            Math.floor(Math.random() * 2) + 20;


        const packet = {

            id: i,

            source:
                `192.168.1.${sourceNumber}`,

            destination:
                `192.168.1.${destinationNumber}`,

            protocol:
                Math.random() > 0.5
                    ? "TCP"
                    : "UDP",

            sequence:
                1000 + i,

            size:
                Math.floor(
                    Math.random() * 1437
                ) + 64,

            status: status

        };


        packets.push(packet);

    }


    displayPackets();

    updateStats();


    document.getElementById(
        "packetStatus"
    ).textContent =
        "● LIVE TRAFFIC GENERATED";

}


// =========================================
// DISPLAY PACKETS
// =========================================

function displayPackets() {

    const table =
        document.getElementById(
            "packetTable"
        );


    table.innerHTML = "";


    packets.forEach(packet => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                #${packet.id}
            </td>

            <td>
                ${packet.source}
            </td>

            <td>
                ${packet.destination}
            </td>

            <td>
                ${packet.protocol}
            </td>

            <td>
                ${packet.sequence}
            </td>

            <td>
                ${packet.size} B
            </td>

            <td>

                <span class="packet-status">
                    ${packet.status}
                </span>

            </td>

            <td>

                <button
                    class="analyse-button"
                    onclick="analyzePacket(${packet.id})">

                    ANALYSE

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// =========================================
// ANALYSE PACKET
// =========================================

function analyzePacket(id) {

    const packet =
        packets.find(
            p => p.id === id
        );


    if (!packet) {
        return;
    }


    let message = "";


    switch (packet.status) {

        case "NORMAL":

            message =
                "✓ Packet behaviour appears normal.";

            break;


        case "PACKET LOSS":

            message =
                "⚠ Possible packet loss detected.";

            break;


        case "DUPLICATE":

            message =
                "⚠ Duplicate packet detected.";

            break;


        case "REORDERED":

            message =
                "⚠ Packet sequence appears out of order.";

            break;


        case "TAMPERED":

            message =
                "🚨 Possible packet tampering detected.";

            break;

    }


    // Increase score for detecting an anomaly

    if (packet.status !== "NORMAL") {

        score += 10;

    }


    document.getElementById(
        "score"
    ).textContent = score;


    alert(

        "PACKET #" + packet.id +

        "\n\nSource: " +
        packet.source +

        "\nDestination: " +
        packet.destination +

        "\nProtocol: " +
        packet.protocol +

        "\nSequence: " +
        packet.sequence +

        "\nSize: " +
        packet.size +
        " bytes\n\n" +

        message

    );

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStats() {

    const total =
        packets.length;


    const normal =
        packets.filter(
            p => p.status === "NORMAL"
        ).length;


    const anomalies =
        total - normal;


    document.getElementById(
        "totalPackets"
    ).textContent = total;


    document.getElementById(
        "normalPackets"
    ).textContent = normal;


    document.getElementById(
        "anomalyPackets"
    ).textContent = anomalies;


    document.getElementById(
        "score"
    ).textContent = score;

}


// =========================================
// RETURN TO DASHBOARD
// =========================================

function goDashboard() {

    window.location.href =
        "dashboard.html";

}