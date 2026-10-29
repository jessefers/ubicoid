#!/usr/bin/env python3
"""Hook ECOSYS (piloto UbicoID): impede que segredo ou conteudo em claro entre no repositorio.

PreToolUse:
- Write/Edit: bloqueia criar .env, chaves e midia/PDF em claro dentro de data/.
- Bash com "git commit": confere os arquivos preparados (staged) antes do commit.
Saida 2 bloqueia a acao e devolve o motivo ao Claude.
"""
import json
import re
import subprocess
import sys

NOMES_PROIBIDOS = re.compile(
    r"(^|/)(\.env(\..*)?|.*\.pem|.*\.key|id_rsa.*|senha.*|credencia.*|passphrase.*)$",
    re.IGNORECASE,
)
# Em data/ so pode entrar conteudo cifrado (.bin) e o meta.json.
CLARO_EM_DATA = re.compile(r"^data/(?!.*\.bin$)(?!meta\.json$).+", re.IGNORECASE)
MIDIA_EM_CLARO = re.compile(r"\.(pdf|mp4|mov|docx|xlsx)$", re.IGNORECASE)
PADROES_SEGREDO = [
    re.compile(r"sk-ant-[A-Za-z0-9_-]{20,}"),
    re.compile(r"ghp_[A-Za-z0-9]{30,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{30,}"),
    re.compile(r"eyJhbGciOi[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}"),  # JWT (ex.: chave service_role)
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"(?i)(password|senha|passphrase)\s*[:=]\s*['\"][^'\"]{6,}['\"]"),
]


def problema_no_caminho(caminho: str) -> str | None:
    caminho = caminho.replace("\\", "/")
    rel = caminho.split("/ubicoid/", 1)[-1]
    if NOMES_PROIBIDOS.search(rel):
        return f"arquivo sensivel ({rel})"
    if CLARO_EM_DATA.match(rel):
        return f"conteudo em claro dentro de data/ ({rel}); ali so entra .bin cifrado"
    if MIDIA_EM_CLARO.search(rel):
        return f"midia ou documento em claro ({rel}); publique apenas a versao cifrada"
    return None


def problema_no_texto(texto: str) -> str | None:
    for padrao in PADROES_SEGREDO:
        if padrao.search(texto or ""):
            return "texto com padrao de chave, token ou senha"
    return None


def bloquear(motivo: str) -> None:
    print(f"[guarda-segredos ECOSYS] Bloqueado: {motivo}.", file=sys.stderr)
    sys.exit(2)


def main() -> None:
    try:
        dados = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)
    ferramenta = dados.get("tool_name", "")
    entrada = dados.get("tool_input", {}) or {}

    if ferramenta in ("Write", "Edit", "MultiEdit"):
        motivo = problema_no_caminho(entrada.get("file_path", ""))
        motivo = motivo or problema_no_texto(entrada.get("content") or entrada.get("new_string") or "")
        if motivo:
            bloquear(motivo)

    elif ferramenta == "Bash" and re.search(r"\bgit\b.*\bcommit\b", entrada.get("command", "")):
        preparados = subprocess.run(
            ["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
            capture_output=True, text=True,
        ).stdout.split()
        for arquivo in preparados:
            motivo = problema_no_caminho(arquivo)
            if motivo:
                bloquear(motivo)
        diff = subprocess.run(
            ["git", "diff", "--cached", "-U0", "--", ".", ":(exclude)*.bin", ":(exclude)*.jpg",
             ":(exclude)*.woff2", ":(exclude).claude/hooks/*"],
            capture_output=True, text=True,
        ).stdout
        adicionadas = "\n".join(l for l in diff.splitlines() if l.startswith("+"))
        motivo = problema_no_texto(adicionadas)
        if motivo:
            bloquear(motivo + " no commit")

    sys.exit(0)


if __name__ == "__main__":
    main()
