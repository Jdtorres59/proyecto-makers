"""Piezas vectoriales de la dirección Semilla: wordmark y sistema de grabado.

  python3 vectores.py

Escribe en apps/mobile/assets/marca y apps/mobile/assets/grabado.
El wordmark sale de los contornos reales de Bricolage Grotesque Bold (pasa la ruta de la fuente con LUCA_FUENTE si cambia).
"""
import math, os, random, pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image

AQUI = pathlib.Path(__file__).resolve().parent
ASSETS = AQUI.parents[3] / 'apps/mobile/assets'
FUENTE = os.environ.get('LUCA_FUENTE', '/Users/juantorres/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/facb65b0-f7aa-49d8-9117-66e63f17fa73/34cc4e70-4ae5-48c2-8101-0e9ece000d76/skills/canvas-design/canvas-fonts/BricolageGrotesque-Bold.ttf')

TINTA, MAIZ, VERDE, SALVIA, PAPEL, CREMA = '#2A2219', '#D99A2B', '#3F6E40', '#9DBB8F', '#F6EEDC', '#FFFBF0'
# (letras y moneda, tajada) por fondo. Contrastes en DESIGN.md.
WORDMARK = {'claro': (TINTA, '#A8740A'), 'oscuro': (PAPEL, '#F2BE22'), 'maiz': ('#1F1A14', '#1F1A14')}


# ---------- Wordmark ----------
def pt(cx, cy, r, a):
    return cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))

def tajada(cx, cy, r, a1, a2):
    (x1, y1), (x2, y2) = pt(cx, cy, r, a1), pt(cx, cy, r, a2)
    grande = 1 if (a2 - a1) % 360 > 180 else 0
    return f'M{cx:.1f} {cy:.1f}L{x1:.1f} {y1:.1f}A{r:.1f} {r:.1f} 0 {grande} 1 {x2:.1f} {y2:.1f}Z'

def wordmark(cuerpo, taj):
    f = TTFont(FUENTE); gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f['hmtx']
    em, track = 1000, -50                       # letter-spacing -0,05 em
    asc = f['hhea'].ascent
    x, partes, ys = 0, [], []
    def letra(ch):
        nonlocal x
        g = cmap[ord(ch)]; pen = SVGPathPen(gs)
        b = BoundsPen(gs); gs[g].draw(b); ys.extend([b.bounds[1], b.bounds[3]])
        gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, asc)))
        partes.append(f'<path fill="{cuerpo}" d="{pen.getCommands()}"/>')
        x += hmtx[g][0] + track
    letra('l'); letra('u')
    # La moneda: 0,56 em, apoyada en la línea base, con la tajada separada hacia arriba a la derecha
    lado = 0.56 * em; x += 0.02 * em; s = lado / 100
    a, sep, base = 54, 10, asc
    a1, a2 = -40 - a / 2, -40 + a / 2
    dx, dy = sep * math.cos(math.radians(-40)), sep * math.sin(math.radians(-40))
    g = f'translate({x:.1f} {base - lado:.1f}) scale({s:.3f})'
    partes.append(f'<g transform="{g}"><path fill="{cuerpo}" d="{tajada(50, 50, 47, a2, a1 + 360)}"/>'
                  f'<path fill="{taj}" transform="translate({dx:.2f} {dy:.2f})" d="{tajada(50, 50, 47, a1, a2)}"/></g>')
    x += lado + 0.04 * em
    letra('a')
    ancho = x - track
    arriba, abajo = asc - max(ys), asc - min(ys)   # en coordenadas SVG
    pad = 12
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {arriba - pad:.0f} {ancho + 2 * pad:.0f} {abajo - arriba + 2 * pad:.0f}" '
            f'role="img" aria-label="Luca">{"".join(partes)}</svg>\n')


# ---------- Bordes de grabado ----------
def ruido(n, semilla, amp):
    random.seed(semilla); v = [random.uniform(-1, 1) for _ in range(n)]
    return [amp * (0.5 * v[i] + 0.25 * v[i - 1] + 0.25 * v[(i + 1) % n]) for i in range(n)]

def rect_irregular(w, h, amp, semilla, inset=0):
    pts, n = [], 28
    lados = [((inset, inset), (w - inset, inset)), ((w - inset, inset), (w - inset, h - inset)),
             ((w - inset, h - inset), (inset, h - inset)), ((inset, h - inset), (inset, inset))]
    r = ruido(4 * n, semilla, amp)
    for k, ((x0, y0), (x1, y1)) in enumerate(lados):
        nx, ny = (y1 - y0), -(x1 - x0); L = math.hypot(nx, ny); nx, ny = nx / L, ny / L
        for i in range(n):
            t = i / n; o = r[k * n + i]
            pts.append((x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o))
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'

def blob(cx, cy, r, amp, semilla, n=48, ry=None):
    rr = ruido(n, semilla, amp); ry = ry or r
    pts = [(cx + (r + rr[i]) * math.cos(2 * math.pi * i / n), cy + (ry + rr[i]) * math.sin(2 * math.pi * i / n)) for i in range(n)]
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'

def svg(vb, cuerpo):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{cuerpo}</svg>\n'


def main():
    marca, grab = ASSETS / 'marca', ASSETS / 'grabado'
    marca.mkdir(exist_ok=True); grab.mkdir(exist_ok=True)
    for fondo, (c, t) in WORDMARK.items():
        (marca / f'wordmark-{fondo}.svg').write_text(wordmark(c, t))

    for tema, (TINTA, VERDE) in {'': ('#2A2219', '#3F6E40'), '-oscuro': ('#F6EEDC', '#8CC08C')}.items():
        # Formas de fondo (un color; se recolorean con tintColor)
        (grab / f'forma-panel{tema}.svg').write_text(svg('0 0 300 200', f'<path fill="{SALVIA}" stroke="{TINTA}" stroke-width="3" d="{rect_irregular(300, 200, 2.6, 7, 4)}"/>'))
        (grab / f'forma-sol{tema}.svg').write_text(svg('0 0 200 200', f'<path fill="{MAIZ}" stroke="{TINTA}" stroke-width="3" d="{blob(100, 100, 92, 3.2, 11)}"/>'))
        (grab / f'forma-mancha{tema}.svg').write_text(svg('0 0 260 180', f'<path fill="{SALVIA}" d="{blob(130, 90, 120, 8, 23, ry=80)}"/>'))

        # Marco de portada 3:2: borde de tinta irregular, centro vacío
        (grab / f'marco-portada{tema}.svg').write_text(svg('0 0 300 200',
            f'<path fill="none" stroke="{TINTA}" stroke-width="4" stroke-linejoin="round" d="{rect_irregular(300, 200, 1.8, 31, 4)}"/>'))

        # Marco de medalla: sello con borde dentado de estampilla
        dientes, R, r = 28, 96, 86
        pts = []
        for i in range(dientes * 2):
            a = math.pi * i / dientes
            rad = R if i % 2 == 0 else r + 3
            pts.append((100 + rad * math.cos(a), 100 + rad * math.sin(a)))
        sello = 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'
        (grab / f'marco-medalla{tema}.svg').write_text(svg('0 0 200 200',
            f'<path fill="{MAIZ}" stroke="{TINTA}" stroke-width="3" stroke-linejoin="round" d="{sello}"/>'
            f'<path fill="{CREMA}" stroke="{TINTA}" stroke-width="3" d="{blob(100, 100, 68, 1.4, 5)}"/>'))
        (grab / f'medalla-bloqueada{tema}.svg').write_text(svg('0 0 200 200',
            f'<path fill="#E6D8BA" stroke="#8C7A5E" stroke-width="3" stroke-linejoin="round" d="{sello}"/>'
            f'<path fill="#F3EAD6" stroke="#8C7A5E" stroke-width="3" d="{blob(100, 100, 68, 1.4, 5)}"/>'
            f'<g fill="none" stroke="#8C7A5E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(64 62) scale(3)">'
            f'<rect x="5" y="10.5" width="14" height="10" rx="1.6"/><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/></g>'))

        # Confeti: piezas sueltas para animar y una composición
        piezas = {
            'confeti-hoja': f'<path fill="{VERDE}" d="M2 18C4 8 10 3 22 2c-1 11-7 18-20 16z"/><path fill="none" stroke="{TINTA}" stroke-width="1.6" d="M4 16 16 6"/>',
            'confeti-grano': f'<ellipse cx="12" cy="12" rx="7" ry="9.5" fill="{MAIZ}" stroke="{TINTA}" stroke-width="1.2"/>',
            'confeti-tira': f'<path fill="{TINTA}" d="M3 15c4-4 7 2 11-2s5-6 7-8l1 3c-2 2-3 4-7 8s-8-1-11 2z"/>',
            'confeti-punto': f'<circle cx="12" cy="12" r="5" fill="{MAIZ}"/>',
        }
        for n, d in piezas.items():
            (grab / f'{n}{tema}.svg').write_text(svg('0 0 24 24', d))
        random.seed(4); comp = []
        for i in range(26):
            n = list(piezas)[i % 4]; x, y, a, s = random.uniform(10, 290), random.uniform(10, 190), random.uniform(0, 360), random.uniform(.7, 1.3)
            comp.append(f'<g transform="translate({x:.0f} {y:.0f}) rotate({a:.0f}) scale({s:.2f}) translate(-12 -12)">{piezas[n]}</g>')
        (grab / f'confeti{tema}.svg').write_text(svg('0 0 300 200', ''.join(comp)))

    # Halo maíz detrás del personaje sobre oscuro
    (grab / 'halo.svg').write_text(svg('0 0 200 200',
        '<defs><radialGradient id="h"><stop offset="0" stop-color="#F2B33D" stop-opacity=".38"/><stop offset="1" stop-color="#F2B33D" stop-opacity="0"/></radialGradient></defs>'
        '<circle cx="100" cy="100" r="100" fill="url(#h)"/>'))

    # Grano: PNG que se repite (los filtros SVG no se dibujan en React Native)
    random.seed(9); W = 256
    for tema, color in {'': 0, '-oscuro': 255}.items():
        im = Image.effect_noise((W, W), 64).point(lambda v: 0 if v > 150 else 255 - v)
        tile = Image.new('LA', (W, W), color); tile.putalpha(im.point(lambda v: int(v * (.16 if color == 0 else .09))))
        tile.convert('RGBA').save(grab / f'grano{tema}.png')
    print('listo')


if __name__ == '__main__':
    main()
