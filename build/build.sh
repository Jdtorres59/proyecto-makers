#!/bin/bash
# Genera los dos PDF del repo. Requiere Google Chrome y npx (Node).
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=build/out
mkdir -p "$OUT"

pdf() { "$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$2" "file://$PWD/$1" 2>/dev/null; }

# 1. Resumen de 4 páginas
pdf build/resumen.html "Resumen Proyecto Makers.pdf"

# 2. Consolidado completo a partir de docs/*.md
{
  printf '# Exploración: EdTech de finanzas AI First\n\nProyecto Makers · Consolidado de los documentos de la carpeta docs.\n\n## Contenido\n\n'
  for f in docs/0[1-9]*.md; do f=${f#docs/}; printf -- '- %s\n' "${f%.md}"; done
  for f in docs/0[1-9]*.md; do printf '\n<div class="pb"></div>\n\n'; cat "$f"; done
} > "$OUT/all.md"
{
  cat <<'EOF'
<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Exploración completa</title><style>
@page{size:Letter;margin:22mm 20mm}
body{font-family:Helvetica,Arial,sans-serif;font-size:10.5pt;line-height:1.45;color:#000}
h1{font-size:18pt;margin:0 0 8pt}h2{font-size:13pt;margin:16pt 0 6pt}h3{font-size:11pt;margin:12pt 0 4pt}
table{border-collapse:collapse;width:100%;margin:8pt 0;font-size:9pt}
th,td{border:1px solid #999;padding:4pt 5pt;vertical-align:top;text-align:left}th{background:#eee}
tr{page-break-inside:avoid}h2,h3{break-after:avoid}a{color:#000}.pb{page-break-before:always}
</style></head><body>
EOF
  npx -y marked --gfm -i "$OUT/all.md"
  echo '</body></html>'
} > "$OUT/all.html"
pdf "$OUT/all.html" "Exploracion completa.pdf"
echo "Listo: Resumen Proyecto Makers.pdf y Exploracion completa.pdf"
