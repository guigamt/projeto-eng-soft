#!/usr/bin/env python
"""
Helper script to boot every backend microservice in parallel for local development.

Usage:
    python backend/run_all_services.py            # inicia com auto-reload (default)
    python backend/run_all_services.py --no-reload
"""

from __future__ import annotations

import argparse
import os
import signal
import subprocess
import sys
import time
from pathlib import Path
from typing import Dict, List

BASE_DIR = Path(__file__).resolve().parent

SERVICES: List[Dict[str, str | int]] = [
    {"name": "auth_svc", "port": 8001, "description": "Auth (registro/login/JWT)"},
    {"name": "profiles_svc", "port": 8002, "description": "Perfis de colaboradores"},
    {"name": "projects_svc", "port": 8003, "description": "Projetos e vagas"},
    {"name": "applications_svc", "port": 8004, "description": "Candidaturas/convites"},
    {"name": "match_svc", "port": 8005, "description": "Recomendacoes mockadas"},
    {"name": "notifications_svc", "port": 8006, "description": "Notificacoes mockadas"},
    {"name": "api_gateway", "port": 8000, "description": "Gateway estatico"},
]


def build_command(port: int, reload: bool) -> List[str]:
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--port",
        str(port),
        "--log-level",
        "info",
    ]
    if reload:
        cmd.append("--reload")
    return cmd


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Inicia todos os microsservicos FastAPI em paralelo."
    )
    parser.add_argument(
        "--no-reload",
        action="store_true",
        help="Desativa o modo --reload do Uvicorn (padrao é ligado).",
    )
    args = parser.parse_args()

    reload_enabled = not args.no_reload
    processes: List[subprocess.Popen] = []

    print("Iniciando microsservicos...")
    try:
        for service in SERVICES:
            name = service["name"]
            port = service["port"]
            description = service["description"]
            service_dir = BASE_DIR / name

            if not service_dir.exists():
                print(f"[WARN] Pasta {service_dir} nao encontrada; pulando {name}.")
                continue

            env = os.environ.copy()
            existing_path = env.get("PYTHONPATH", "")
            env["PYTHONPATH"] = str(service_dir) + (
                os.pathsep + existing_path if existing_path else ""
            )

            cmd = build_command(int(port), reload_enabled)
            proc = subprocess.Popen(cmd, cwd=service_dir, env=env)
            processes.append(proc)

            reload_flag = "--reload" if reload_enabled else ""
            print(f"[OK] {name} ({description}) rodando em http://127.0.0.1:{port} {reload_flag}")

        print("\nTodos os serviços foram inicializados. Pressione CTRL+C para encerrar.\n")

        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nEncerrando serviços...")
    finally:
        for proc in processes:
            if proc.poll() is None:
                try:
                    proc.send_signal(signal.SIGINT)
                    proc.wait(timeout=5)
                except Exception:
                    proc.kill()


if __name__ == "__main__":
    main()

