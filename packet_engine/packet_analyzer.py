"""
PacketGuard - Packet Analyzer

Analyzes simulated network packets and identifies
packet-level anomalies such as:

- Packet loss
- Duplicate packets
- Packet reordering
- Integrity problems
"""

from typing import Any, Dict, List


def analyze_packets(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyze a list of simulated packets.

    Parameters:
        packets: List of packet dictionaries.

    Returns:
        Dictionary containing analysis results.
    """

    if not packets:
        return {
            "total_packets": 0,
            "status": "NO_DATA",
            "anomalies": [],
            "summary": {
                "packet_loss": 0,
                "duplicates": 0,
                "reordered": 0,
                "integrity_errors": 0
            }
        }

    sequences = []

    for packet in packets:
        sequence = packet.get("sequence")

        if isinstance(sequence, int):
            sequences.append(sequence)

    anomalies = []

    # -------------------------------------------------
    # 1. Duplicate Packet Detection
    # -------------------------------------------------

    seen_sequences = set()
    duplicate_sequences = set()

    for sequence in sequences:
        if sequence in seen_sequences:
            duplicate_sequences.add(sequence)
        else:
            seen_sequences.add(sequence)

    if duplicate_sequences:
        anomalies.append({
            "type": "DUPLICATE_PACKET",
            "severity": "MEDIUM",
            "description": "Duplicate packet sequence numbers detected.",
            "sequences": sorted(duplicate_sequences)
        })

    # -------------------------------------------------
    # 2. Packet Loss Detection
    # -------------------------------------------------

    packet_loss = 0
    missing_sequences = []

    if sequences:
        unique_sequences = sorted(set(sequences))

        expected_start = unique_sequences[0]
        expected_end = unique_sequences[-1]

        expected_sequences = set(
            range(expected_start, expected_end + 1)
        )

        missing_sequences = sorted(
            expected_sequences - set(unique_sequences)
        )

        packet_loss = len(missing_sequences)

    if packet_loss > 0:
        anomalies.append({
            "type": "PACKET_LOSS",
            "severity": "MEDIUM",
            "description": "Missing sequence numbers detected.",
            "missing_sequences": missing_sequences,
            "count": packet_loss
        })

    # -------------------------------------------------
    # 3. Packet Reordering Detection
    # -------------------------------------------------

    reordered = False

    for index in range(1, len(sequences)):
        if sequences[index] < sequences[index - 1]:
            reordered = True
            break

    if reordered:
        anomalies.append({
            "type": "PACKET_REORDERING",
            "severity": "MEDIUM",
            "description": "Packets are not in sequential order."
        })

    # -------------------------------------------------
    # 4. Integrity Detection
    # -------------------------------------------------

    integrity_errors = 0

    for packet in packets:
        integrity = packet.get("integrity")

        if integrity is not None:
            if str(integrity).upper() not in {
                "VALID",
                "OK",
                "TRUE",
                "PASS",
                "PASSED"
            }:
                integrity_errors += 1

    if integrity_errors > 0:
        anomalies.append({
            "type": "INTEGRITY_ERROR",
            "severity": "HIGH",
            "description": "One or more packets failed integrity verification.",
            "count": integrity_errors
        })

    # -------------------------------------------------
    # 5. Overall Status
    # -------------------------------------------------

    if not anomalies:
        status = "NORMAL"
    else:
        status = "ANOMALY_DETECTED"

    # -------------------------------------------------
    # Final Analysis Result
    # -------------------------------------------------

    return {
        "total_packets": len(packets),
        "status": status,
        "anomalies": anomalies,
        "summary": {
            "packet_loss": packet_loss,
            "duplicates": len(duplicate_sequences),
            "reordered": int(reordered),
            "integrity_errors": integrity_errors
        }
    }