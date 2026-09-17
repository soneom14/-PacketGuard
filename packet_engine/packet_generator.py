import random
import time


# ============================================================
# PACKET DATA
# ============================================================

SOURCE_IPS = [
    "192.168.1.10",
    "192.168.1.11",
    "192.168.1.12"
]

DESTINATION_IPS = [
    "192.168.1.20",
    "192.168.1.21"
]

PROTOCOLS = [
    "TCP",
    "UDP"
]

PORTS = [
    80,
    443,
    22,
    53,
    8080
]


# ============================================================
# GENERATE SINGLE PACKET
# ============================================================

def generate_packet(packet_id, sequence_number):

    packet = {

        "id": packet_id,

        "source": random.choice(
            SOURCE_IPS
        ),

        "destination": random.choice(
            DESTINATION_IPS
        ),

        "source_port": random.randint(
            1024,
            65535
        ),

        "destination_port": random.choice(
            PORTS
        ),

        "protocol": random.choice(
            PROTOCOLS
        ),

        "sequence": sequence_number,

        "timestamp": time.time(),

        "size": random.randint(
            64,
            1500
        ),

        "integrity": "VALID",

        "status": "NORMAL"
    }

    return packet


# ============================================================
# GENERATE NORMAL PACKET STREAM
# ============================================================

def generate_normal_stream(count):

    packets = []

    sequence_number = 1000

    for packet_id in range(1, count + 1):

        packet = generate_packet(
            packet_id,
            sequence_number
        )

        packets.append(packet)

        sequence_number += 1

    return packets


# ============================================================
# PACKET LOSS
# ============================================================

def inject_packet_loss(packets):

    if len(packets) < 5:
        return

    # Remove one packet from the middle
    removed_packet = packets.pop(
        len(packets) // 2
    )

    print(
        f"[ANOMALY] Packet loss: "
        f"sequence {removed_packet['sequence']}"
    )


# ============================================================
# DUPLICATE PACKET
# ============================================================

def inject_duplicate(packets):

    if len(packets) < 4:
        return

    index = len(packets) // 3

    original = packets[index]

    duplicate = original.copy()

    duplicate["id"] = max(
        packet["id"]
        for packet in packets
    ) + 1

    duplicate["status"] = "DUPLICATE"

    packets.insert(
        index + 1,
        duplicate
    )

    print(
        f"[ANOMALY] Duplicate packet: "
        f"sequence {duplicate['sequence']}"
    )


# ============================================================
# PACKET REORDERING
# ============================================================

def inject_reordering(packets):

    if len(packets) < 6:
        return

    first_index = len(packets) // 3

    second_index = first_index + 1

    packets[first_index]["status"] = "REORDERED"
    packets[second_index]["status"] = "REORDERED"

    # Swap sequence numbers
    first_sequence = packets[first_index]["sequence"]

    packets[first_index]["sequence"] = (
        packets[second_index]["sequence"]
    )

    packets[second_index]["sequence"] = (
        first_sequence
    )

    print(
        "[ANOMALY] Packet reordering detected"
    )


# ============================================================
# PACKET TAMPERING
# ============================================================

def inject_tampering(packets):

    if len(packets) < 3:
        return

    index = len(packets) - 2

    packets[index]["integrity"] = "INVALID"

    packets[index]["status"] = "TAMPERED"

    print(
        f"[ANOMALY] Packet tampering: "
        f"sequence {packets[index]['sequence']}"
    )


# ============================================================
# GENERATE PACKET STREAM
# ============================================================

def generate_packet_stream(
    count=20,
    scenario="mixed"
):

    packets = generate_normal_stream(
        count
    )

    # --------------------------------------------------------
    # Normal traffic
    # --------------------------------------------------------

    if scenario == "normal":
        return packets


    # --------------------------------------------------------
    # Individual anomaly scenarios
    # --------------------------------------------------------

    if scenario == "loss":

        inject_packet_loss(
            packets
        )

        return packets


    if scenario == "duplicate":

        inject_duplicate(
            packets
        )

        return packets


    if scenario == "reordered":

        inject_reordering(
            packets
        )

        return packets


    if scenario == "tampered":

        inject_tampering(
            packets
        )

        return packets


    # --------------------------------------------------------
    # Mixed cybersecurity scenario
    # --------------------------------------------------------

    if scenario == "mixed":

        inject_packet_loss(
            packets
        )

        inject_duplicate(
            packets
        )

        inject_reordering(
            packets
        )

        inject_tampering(
            packets
        )

        return packets


    # Unknown scenario → normal traffic
    return packets


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    packets = generate_packet_stream(
        20,
        "mixed"
    )

    for packet in packets:

        print(packet)