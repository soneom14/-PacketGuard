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

# Add project root to Python module search path
if BASE_DIR not in sys.path:
    sys.path.insert(
        0,
        BASE_DIR
    )


# ============================================================
# PACKET ENGINE IMPORTS
# ============================================================

from packet_engine.packet_generator import (
    generate_packet_stream
)

from packet_engine.packet_analyzer import (
    analyze_packets
)

from packet_engine.threat_detector import (
    detect_threats
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

        "engine": "Python Packet Engine",

        "analyzer": "ONLINE",

        "threat_detector": "ONLINE"

    })


# ============================================================
# PACKET SIMULATION API
# ============================================================

@app.route(
    "/api/simulate",
    methods=["POST"]
)
def simulate_packets():

    # --------------------------------------------------------
    # Get JSON sent by frontend
    # --------------------------------------------------------

    data = request.get_json(
        silent=True
    ) or {}


    # --------------------------------------------------------
    # Get requested packet count
    # --------------------------------------------------------

    count = data.get(
        "count",
        20
    )


    # --------------------------------------------------------
    # Make sure count is an integer
    # --------------------------------------------------------

    try:

        count = int(count)

    except (
        TypeError,
        ValueError
    ):

        count = 20


    # --------------------------------------------------------
    # Security / resource limit
    #
    # Minimum = 1 packet
    # Maximum = 100 packets
    # --------------------------------------------------------

    count = max(
        1,
        min(count, 100)
    )


    # ========================================================
    # 1. GENERATE SIMULATED PACKETS
    # ========================================================

    packets = generate_packet_stream(
        count,
        "mixed"
    )


    # ========================================================
    # 2. ANALYSE PACKETS
    # ========================================================

    analysis = analyze_packets(
        packets
    )


    # ========================================================
    # 3. DETECT POTENTIAL THREATS
    # ========================================================

    threats = detect_threats(
        packets,
        analysis
    )


    # ========================================================
    # 4. RETURN COMPLETE ANALYSIS
    # ========================================================

    return jsonify({

        "success": True,

        "count": len(packets),

        "packets": packets,

        "analysis": analysis,

        "threats": threats

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
# SERVER ERROR HANDLER - INTERNAL ERROR
# ============================================================

@app.errorhandler(500)
def internal_server_error(error):

    return jsonify({

        "success": False,

        "error": "Internal server error"

    }), 500


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
        "Packet Analyzer:      ONLINE"
    )

    print(
        "Threat Detector:      ONLINE"
    )

    print()

    print("=" * 60)

    print()


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )