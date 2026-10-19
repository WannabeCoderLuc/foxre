#!/usr/bin/env python3
"""
FoxRe Interactive Documentation Portal - Local Preview Server
Serves the standalone hexagonal documentation web application on http://127.0.0.1:4000
"""

import http.server
import os
import socketserver
import sys
import threading
import time
import webbrowser

PORT = 4000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Format HTTP access logs cleanly
        sys.stderr.write(f"[{time.strftime('%H:%M:%S')}] {args[0]} - {args[1]} {args[2]}\n")

def open_browser(port):
    time.sleep(0.6)
    url = f"http://127.0.0.1:{port}/"
    print(f"\n[FoxRe] Opening browser: {url}\n")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"[FoxRe] Could not auto-open browser: {e}")

def run_server():
    port = PORT
    server = None
    for attempt in range(10):
        try:
            server = socketserver.TCPServer(("", port), Handler)
            break
        except OSError:
            port += 1

    if not server:
        print(f"[ERROR] Could not bind to port {PORT}-{port}. Port in use.")
        sys.exit(1)

    print("=" * 70)
    print("  FOXRE // OPEN FOX ENGINE INTERACTIVE DOCUMENTATION PORTAL")
    print("=" * 70)
    print(f"  Local URL:        http://127.0.0.1:{port}/")
    print(f"  Network URL:      http://localhost:{port}/")
    print(f"  Root Directory:   {DIRECTORY}")
    print("  Theme:            Interactive Hexagonal Honeycomb & Canvas Mind Maps")
    print("=" * 70)
    print("  Press Ctrl+C to terminate the local preview server.\n")

    threading.Thread(target=open_browser, args=(port,), daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[FoxRe] Shutting down preview server.")
        server.shutdown()

if __name__ == "__main__":
    run_server()
