import random
import time


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


def generate_packet(packet_id, sequence_number):

    packet = {
        "id": packet_id,

        "source": random.choice(SOURCE_IPS),

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

        "status": "NORMAL"
    }

    return packet


def generate_packet_stream(count=20):

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


if __name__ == "__main__":

    packets = generate_packet_stream(10)

    for packet in packets:

        print(packet)