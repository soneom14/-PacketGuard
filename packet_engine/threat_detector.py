"""
PacketGuard - Threat Detector

Uses rule-based analysis to identify potentially
suspicious network behaviour from packet analysis results.
"""

from typing import Any, Dict, List


def detect_threats(
    packets: List[Dict[str, Any]],
    analysis: Dict[str, Any]
) -> Dict[str, Any]:

    threats = []

    # -------------------------------------------------
    # 1. Integrity Attack Detection
    # -------------------------------------------------

    integrity_errors = analysis.get(
        "summary", {}
    ).get("integrity_errors", 0)

    if integrity_errors > 0:
        threats.append({
            "type": "POSSIBLE_TAMPERING",
            "severity": "HIGH",
            "risk_score": 80,
            "description":
                "Packet integrity verification failed."
        })

    # -------------------------------------------------
    # 2. Duplicate Packet Detection
    # -------------------------------------------------

    duplicates = analysis.get(
        "summary", {}
    ).get("duplicates", 0)

    if duplicates > 0:
        threats.append({
            "type": "POSSIBLE_REPLAY_ACTIVITY",
            "severity": "MEDIUM",
            "risk_score": 60,
            "description":
                "Repeated packet sequence numbers may indicate replay activity."
        })

    # -------------------------------------------------
    # 3. Packet Reordering
    # -------------------------------------------------

    reordered = analysis.get(
        "summary", {}
    ).get("reordered", 0)

    if reordered > 0:
        threats.append({
            "type": "SUSPICIOUS_PACKET_ORDER",
            "severity": "MEDIUM",
            "risk_score": 50,
            "description":
                "Packets were observed outside their expected sequence."
        })

    # -------------------------------------------------
    # 4. Excessive Packet Loss
    # -------------------------------------------------

    packet_loss = analysis.get(
        "summary", {}
    ).get("packet_loss", 0)

    if packet_loss >= 3:
        threats.append({
            "type": "EXCESSIVE_PACKET_LOSS",
            "severity": "MEDIUM",
            "risk_score": 40,
            "description":
                "Multiple missing packet sequences were detected."
        })

    # -------------------------------------------------
    # 5. Suspicious Destination Ports
    # -------------------------------------------------

    suspicious_ports = {
        22,
        23,
        445,
        3389
    }

    suspicious_port_packets = []

    for packet in packets:
        destination_port = packet.get(
            "destination_port"
        )

        if destination_port in suspicious_ports:
            suspicious_port_packets.append(
                destination_port
            )

    if suspicious_port_packets:
        threats.append({
            "type": "SUSPICIOUS_PORT_ACTIVITY",
            "severity": "MEDIUM",
            "risk_score": 50,
            "description":
                "Traffic was observed on ports commonly associated with remote access or network services.",
            "ports": sorted(
                set(suspicious_port_packets)
            )
        })

    # -------------------------------------------------
    # Overall Risk
    # -------------------------------------------------

    if not threats:
        risk_level = "LOW"
        risk_score = 0
        status = "NO_THREATS_DETECTED"

    else:
        risk_score = max(
            threat["risk_score"]
            for threat in threats
        )

        if risk_score >= 80:
            risk_level = "HIGH"
        elif risk_score >= 50:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        status = "POTENTIAL_THREAT_DETECTED"

    return {
        "status": status,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "threat_count": len(threats),
        "threats": threats
    }