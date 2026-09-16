from flask import Flask, jsonify, send_from_directory, request

import os
import sys


# ============================================================
# PROJECT PATHS
# ============================================================

# Get the root PacketGuard directory
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

# Frontend directory
FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)


# ============================================================
# PYTHON IMPORT PATH
# ============================================================

# Add the project root to Python's module search path.
if BASE_DIR not in sys.path:
    sys.path.insert(
        0,
        BASE_DIR
    )


# ============================================================
# PACKET ENGINE IMPORT
# ============================================================

from packet_engine.packet_generator import (
    generate_packet_stream
)

from packet_engine.packet_analyzer import (
    analyze_packets
)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# ============================================================
# FRONTEND FILES
# ============================================================

@app.route("/<path:filename>")
def frontend_files(filename):

    return send_from_directory(
        FRONTEND_DIR,
        filename
    )


# ============================================================
# API HEALTH CHECK
# ============================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    return jsonify({
        "status": "online",
        "service": "PacketGuard API",
        "engine": "Python Packet Engine"
    })


# ============================================================
# PACKET SIMULATION API
# ============================================================

@app.route(
    "/api/simulate",
    methods=["POST"]
)
def simulate_packets():

    # Get JSON sent by the frontend
    data = request.get_json(
        silent=True
    ) or {}

    # Get requested packet count
    count = data.get(
        "count",
        20
    )

    # Make sure count is an integer
    try:
        count = int(count)

    except (
        TypeError,
        ValueError
    ):
        count = 20

    # Security / resource limit
    #
    # Minimum = 1 packet
    # Maximum = 100 packets

    count = max(
        1,
        min(count, 100)
    )

    # --------------------------------------------------------
    # Generate simulated packets
    # --------------------------------------------------------

    packets = generate_packet_stream(
        count
    )

    # --------------------------------------------------------
    # Analyse generated packets
    # --------------------------------------------------------

    analysis = analyze_packets(
        packets
    )

    # --------------------------------------------------------
    # Send packets + analysis back to browser
    # --------------------------------------------------------

    return jsonify({

        "success": True,

        "count": len(packets),

        "packets": packets,

        "analysis": analysis

    })


# ============================================================
# SERVER ERROR HANDLER
# ============================================================

@app.errorhandler(404)
def page_not_found(error):

    return jsonify({

        "success": False,

        "error": "Resource not found"

    }), 404


# ============================================================
# START APPLICATION
# ============================================================

if __name__ == "__main__":

    print()

    print("=" * 60)

    print(
        "        PACKETGUARD SECURITY LAB"
    )

    print("=" * 60)

    print()

    print(
        "Server: http://127.0.0.1:5000"
    )

    print(
        "Health: http://127.0.0.1:5000/api/health"
    )

    print(
        "API:    POST /api/simulate"
    )

    print()

    print(
        "Python Packet Engine: ONLINE"
    )

    print(
        "Packet Analyzer: ONLINE"
    )

    print("=" * 60)

    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )