"""Arma biblioteca.html con lo que haya en apps/mobile/assets.

  python3 armar_biblioteca.py [carpeta-del-artifact]

El HTML del repo apunta a ../../../apps/mobile/assets; la copia del artifact lleva los archivos al lado.
"""
import sys, shutil, pathlib, html

AQUI = pathlib.Path(__file__).resolve().parent
ASSETS = AQUI.parents[3] / 'apps/mobile/assets'
SECCIONES = [
    ('icono', 'Ícono de app', 'icono'), ('marca', 'Wordmark', 'marca'), ('luca', 'Luca', 'pose'), ('crecimiento', 'Crecimiento', 'pose'),
    ('portadas', 'Portadas de módulo', 'portada'), ('medallas', 'Medallas', 'pose'), ('objetos', 'Objetos', 'pose'),
    ('escenas', 'Escenas de estado', 'pose'), ('grabado', 'Sistema de grabado', 'pose'), ('iconos', 'Íconos de interfaz', 'ui'),
]
ORDEN_LUCA = ['saluda', 'explica', 'celebra', 'piensa', 'lee', 'atento', 'sorprendido', 'muestra', 'pulgar', 'guarda', 'espera', 'despide']

CSS = """
:root{--bg:#F6EEDC;--papel:#FFFBF0;--tx:#2A2219;--sx:#5E4E3A;--ln:#2A2219;--ln2:#D9C8A6;--plato:#FFFBF0;--f:'Bricolage Grotesque',ui-rounded,system-ui,sans-serif;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#1D1812;--papel:#2A2219;--tx:#F6EEDC;--sx:#C8B99C;--ln:#F6EEDC;--ln2:#45392A;--plato:#F3E7CF;color-scheme:dark}}
:root[data-theme=dark]{--bg:#1D1812;--papel:#2A2219;--tx:#F6EEDC;--sx:#C8B99C;--ln:#F6EEDC;--ln2:#45392A;--plato:#F3E7CF;color-scheme:dark}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font:400 16px/1.5 var(--f);-webkit-font-smoothing:antialiased;overflow-x:hidden}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
:focus-visible{outline:3px solid var(--tx);outline-offset:3px;border-radius:6px}
header,section{max-width:1240px;margin:0 auto;padding:0 16px}
header{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding-top:28px;padding-bottom:12px}
header h1{font:800 clamp(30px,6vw,52px)/1 var(--f);letter-spacing:-.04em;flex:1;min-width:220px;font-variation-settings:'opsz' 96}
header p{width:100%;color:var(--sx);max-width:62ch}
.tema{display:flex;border:2.5px solid var(--ln);border-radius:8px;padding:2px}
.tema button{padding:6px 12px;border-radius:5px;font-size:14px;font-weight:700;min-height:36px}
.tema button[aria-pressed=true]{background:var(--tx);color:var(--bg)}
section{padding-top:36px}
h2{font:800 26px/1.1 var(--f);letter-spacing:-.03em;margin-bottom:14px;display:flex;align-items:baseline;gap:10px}
h2 small{font-size:14px;font-weight:600;color:var(--sx);letter-spacing:0}
.grilla{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.grilla.portada{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.grilla.ui{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}
figure{border:2.5px solid var(--ln);border-radius:10px;overflow:hidden;background:var(--papel);display:flex;flex-direction:column}
figure>div{flex:1;display:grid;place-items:center;padding:12px;aspect-ratio:1;background:var(--plato)}
.portada figure>div{padding:0;aspect-ratio:3/2}
.portada img{width:100%;height:100%;object-fit:cover}
figure img{max-width:100%;max-height:100%;object-fit:contain}
.ui figure>div{background:var(--papel);padding:24px}
.ui img{width:32px;height:32px}
:root[data-theme=dark] .ui img{filter:invert(1) sepia(.2)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .ui img{filter:invert(1) sepia(.2)}}
.marca figure>div{aspect-ratio:auto;padding:28px 18px}.marca img{height:56px}
.marca figure:nth-child(1)>div{background:#F6EEDC}.marca figure:nth-child(2)>div{background:#D99A2B}.marca figure:nth-child(3)>div{background:#1D1812}
.grilla.marca{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.icono figure>div{padding:18px}
.icono img{border-radius:22%}
figcaption{font-size:12.5px;font-weight:600;padding:7px 10px 8px;border-top:2px solid var(--ln2);color:var(--sx);word-break:break-word}
footer{max-width:1240px;margin:0 auto;padding:40px 16px 60px;color:var(--sx);font-size:13px}
@media (max-width:520px){.grilla{grid-template-columns:repeat(2,1fr)}.grilla.ui{grid-template-columns:repeat(4,1fr)}.grilla.portada{grid-template-columns:1fr}}
"""

JS = """
const r=document.documentElement,b=[...document.querySelectorAll('.tema button')];
const pon=t=>{t==='auto'?r.removeAttribute('data-theme'):r.dataset.theme=t;b.forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.t===t)));try{localStorage.setItem('luca-tema',t)}catch(e){}};
b.forEach(x=>x.addEventListener('click',()=>pon(x.dataset.t)));try{const t=localStorage.getItem('luca-tema');if(t)pon(t)}catch(e){}
"""


def archivos(carpeta):
    d = ASSETS / carpeta
    fs = sorted([*d.glob('*.webp'), *d.glob('*.svg'), *d.glob('*.png')]) if d.exists() else []
    if carpeta != 'marca': fs = [f for f in fs if '-oscuro' not in f.stem]
    if carpeta == 'marca': fs = [f for f in fs if f.suffix == '.svg']
    if carpeta == 'luca':
        clave = lambda f: ORDEN_LUCA.index(f.stem[5:]) if f.stem[5:] in ORDEN_LUCA else 99
        fs.sort(key=clave)
    return fs


def armar(prefijo):
    total, partes = 0, []
    for carpeta, titulo, tipo in SECCIONES:
        fs = archivos(carpeta)
        if not fs: continue
        total += len(fs)
        figs = ''.join(f'<figure><div><img src="{prefijo}{carpeta}/{f.name}" alt="" loading="lazy"></div><figcaption>{html.escape(f.stem)}</figcaption></figure>' for f in fs)
        partes.append(f'<section aria-labelledby="s-{carpeta}"><h2 id="s-{carpeta}">{titulo}<small>{len(fs)}</small></h2><div class="grilla {tipo}">{figs}</div></section>')
    cuerpo = (f'<header><h1>Biblioteca de Luca</h1><div class="tema" role="group" aria-label="Tema">'
              '<button type="button" data-t="auto" aria-pressed="true">Auto</button><button type="button" data-t="light" aria-pressed="false">Claro</button>'
              '<button type="button" data-t="dark" aria-pressed="false">Oscuro</button></div>'
              f'<p>Dirección Semilla en grabado. {total} piezas listas para la app, con los nombres con que se usan desde <code>apps/mobile/assets</code>.</p></header>'
              + ''.join(partes) + '<footer>Ilustraciones generadas para Luca 1.0. Datos y documentos de ejemplo ficticios.</footer>')
    cab = ('<title>Biblioteca de Luca</title>\n<meta name="description" content="Personaje, crecimiento, portadas, medallas, objetos, escenas e íconos de Luca 1.0.">\n'
           '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
           '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap">\n'
           f'<style>{CSS}</style>\n')
    assert '—' not in cab + cuerpo
    return cab, cuerpo + f'<script>{JS}</script>\n', total


cab, cuerpo, total = armar('../../../apps/mobile/assets/')
(AQUI.parent / 'biblioteca.html').write_text(f'<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n{cab}</head>\n<body>\n{cuerpo}</body>\n</html>\n')
if len(sys.argv) > 1:
    d = pathlib.Path(sys.argv[1]); d.mkdir(parents=True, exist_ok=True)
    c2, b2, _ = armar('')
    (d / 'biblioteca.html').write_text(c2 + b2)
    for carpeta, _, _ in SECCIONES:
        for f in archivos(carpeta):
            (d / carpeta).mkdir(exist_ok=True); shutil.copy(f, d / carpeta / f.name)
print(total, 'piezas')
