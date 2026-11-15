"""Biblioteca de Luca 1.0 (dirección Semilla).

  python3 biblioteca.py generar <carpeta-crudo>   genera con Codex lo que falte (reanudable)
  python3 biblioteca.py procesar <carpeta-crudo>  recorta y copia a apps/mobile/assets

Las imágenes crudas (PNG grandes) no van al repo.
"""
import subprocess, sys, pathlib
from concurrent.futures import ThreadPoolExecutor

AQUI = pathlib.Path(__file__).resolve().parent
REPO = AQUI.parents[3]
ASSETS = REPO / 'apps/mobile/assets'

ESTILO = (AQUI / 'prompts.md').read_text().split('## Propuesta B')[1].split('##')[0].strip()
TRAZO = ('Estilo idéntico a la referencia: grabado en relieve tipo linóleo estampado a tres tintas planas '
         '(café tinta #2A2219, maíz tostado #D99A2B y verde #4F7D50) sobre papel, marcas de gubia talladas en blanco, '
         'contornos gruesos de corte nítido, pequeñas imperfecciones de estampado. Nada de crayón, degradados ni brillo.')
FONDO = ('Fondo blanco puro #FFFFFF liso y uniforme, sin sombra en el piso, sin elementos de fondo, '
         'centrado ocupando el 75% del cuadro, formato cuadrado.')
ESCENA = ('Formato horizontal 3:2, fondo liso de papel crema #F6EEDC con dos o tres formas simples estampadas en salvia #9DBB8F '
          'y maíz claro, composición con aire en la parte superior izquierda.')
POSE = f'{ESTILO} {FONDO}'

# (carpeta, nombre, transparente, referencia, prompt)
P = []
def pieza(carpeta, nombre, prompt, ref='saluda', transparente=True):
    P.append((carpeta, nombre, transparente, ref, prompt))

# Ícono de app
pieza('icono', 'icono', f'{TRAZO} Ícono de app cuadrado: la cara y la parte de arriba de Luca, la semilla con su brote de dos hojas, grande y centrada, mirando de frente con una sonrisa tranquila, sobre un fondo plano color maíz tostado #D99A2B que llena todo el cuadro hasta los bordes, sin marco ni esquinas redondeadas, formato cuadrado.', transparente=False)

# Portadas de los 12 módulos del núcleo
PORTADAS = [
    ('01-desprendible', 'Luca revisa con una lupa grande un desprendible de nómina de papel tan alto como él, con renglones abstractos.'),
    ('02-prima-cesantias', 'Luca sentado junto a un sobre crema grande y abierto del que asoman billetes estilizados, y un cofre pequeño al lado.'),
    ('03-plan-del-mes', 'Luca reparte monedas en tres tarros de vidrio marcados con dibujos simples de una casa, un plato y un bus.'),
    ('04-colchon', 'Luca descansa tranquilo sentado sobre un cojín grueso hecho de billetes apilados, bajo un paraguas abierto.'),
    ('05-costo-deuda', 'Luca observa una balanza: en un plato una moneda pequeña y en el otro un saco grande y pesado.'),
    ('06-tarjeta', 'Luca sostiene una tarjeta de crédito genérica grande, sin logos ni números, junto a una hoja de calendario.'),
    ('07-historial', 'Luca sube por una escalera de bloques mientras anota en una libreta, cada bloque con una marca de visto.'),
    ('08-si-no-puedo-pagar', 'Luca, sereno, ordena una pila de sobres de cuentas en filas sobre una mesa, con una lista a su lado.'),
    ('09-fraudes', 'Luca levanta un escudo frente a un anzuelo de pesca que cuelga de un hilo con una tarjeta enganchada.'),
    ('10-invertir-simple', 'Luca riega con una regadera una maceta de la que crece una planta con monedas redondas como hojas.'),
    ('11-primera-inversion', 'Luca, con una pala pequeña, planta una moneda en un surco de tierra.'),
    ('12-cripto', 'Luca mira con curiosidad y algo de cautela una moneda facetada que flota, con una montaña rusa estampada al fondo.'),
]
for n, d in PORTADAS:
    pieza('portadas', n, f'{ESTILO} Escena de portada de módulo: {d} {ESCENA} Mismo personaje que la referencia.', transparente=False)

# Medallas: la primera fija el formato y las demás la toman de referencia
MEDALLAS = [
    ('01-desprendible', 'una lupa sobre una hoja con renglones'), ('02-prima-cesantias', 'un sobre abierto con una hoja que brota'),
    ('03-plan-del-mes', 'tres tarros pequeños'), ('04-colchon', 'un paraguas sobre una pila de monedas'),
    ('05-costo-deuda', 'una balanza'), ('06-tarjeta', 'una tarjeta con un visto'), ('07-historial', 'una libreta con un visto'),
    ('08-si-no-puedo-pagar', 'un nudo que se desata'), ('09-fraudes', 'un escudo'), ('10-invertir-simple', 'una maceta con monedas como hojas'),
    ('11-primera-inversion', 'una moneda plantada que brota'), ('12-cripto', 'una moneda facetada'),
]
for i, (n, d) in enumerate(MEDALLAS):
    base = (f'{TRAZO} Medalla circular de logro con forma de sello de grabado, borde dentado como una estampilla, anillo exterior maíz tostado, '
            f'centro crema con {d} estampado en tinta café y verde, sin texto. {FONDO}')
    pieza('medallas', n, base if i == 0 else base + ' Mismo formato de medalla que la referencia; solo cambia el dibujo del centro.',
          ref='objeto' if i == 0 else 'medallas/01-desprendible')

# Poses adicionales (las tres base ya existen)
for n, d in [('piensa', 'piensa con una mano en el mentón, mirando hacia arriba'),
             ('lee', 'lee con atención una hoja de papel que sostiene con las dos manos'),
             ('atento', 'escucha serio pero cálido, con las manos juntas, para acompañar una mala noticia'),
             ('sorprendido', 'se sorprende con los ojos muy abiertos y las manos a los lados'),
             ('muestra', 'muestra algo que está arriba de él con las dos manos abiertas, como presentándolo'),
             ('pulgar', 'levanta un pulgar, satisfecho'),
             ('guarda', 'guarda una moneda en un tarro de vidrio pequeño'),
             ('espera', 'espera sentado tranquilo, con las piernas cruzadas'),
             ('despide', 'se despide agitando la mano, de lado, a punto de irse')]:
    pieza('luca', f'luca-{n}', f'{POSE} Pose: {d}.')

# Etapas de crecimiento (el progreso del núcleo)
for n, d in [('0-semilla', 'todavía es solo la semilla, sin brote, con la grieta cerrada'),
             ('1-brote', 'tiene su brote de dos hojas, igual que la referencia'),
             ('2-plantula', 'el brote creció a un tallo corto con cuatro hojas'),
             ('3-arbolito', 'del brote salió un arbolito pequeño con tronco delgado y una copa redonda de hojas'),
             ('4-arbol', 'del brote creció un árbol con copa grande y algunos frutos dorados como mazorcas pequeñas')]:
    pieza('crecimiento', n, f'{POSE} Luca de pie de frente, contento; {d}. El cuerpo de semilla y la cara no cambian.')

# Objetos
for n, d in [('extracto', 'un extracto de tarjeta: hoja con una tabla de renglones abstractos y una tarjeta genérica encima'),
             ('sobre-prima', 'un sobre crema abierto con billetes estilizados asomando'),
             ('tarjeta', 'una tarjeta de crédito genérica sin logos ni números, ligeramente inclinada'),
             ('calendario', 'una hoja de calendario de pared con un día marcado con un círculo'),
             ('tarro', 'un tarro de vidrio con algunas monedas adentro'),
             ('lupa', 'una lupa de mango de madera')]:
    pieza('objetos', n, f'{TRAZO} Objeto solo, sin personaje: {d}, sin texto ni números. {FONDO}', ref='objeto')

# Escenas de estado
for n, d in [('subir-documento', 'Luca empuja una hoja de papel grande hacia una bandeja, con esfuerzo alegre'),
             ('leyendo', 'Luca escanea una hoja con una lupa, concentrado'),
             ('vacio', 'Luca riega una maceta de la que todavía no sale nada, paciente'),
             ('sin-conexion', 'Luca sostiene un cable desconectado con cara de duda')]:
    pieza('escenas', n, f'{POSE} {d}.')


def ref_png(ref, crudo):
    if ref == 'saluda': return crudo / 'b-saluda.png'
    if ref == 'objeto': return crudo / 'b-objeto.png'
    return crudo / f'{ref}.png'


def generar(crudo, paralelo=4):
    def uno(p):
        carpeta, nombre, _, ref, prompt = p
        out = crudo / carpeta / f'{nombre}.png'
        if out.exists(): return f'ya estaba {out.name}'
        out.parent.mkdir(parents=True, exist_ok=True)
        r = ref_png(ref, crudo)
        orden = (f'Usa tu herramienta de generación de imágenes para crear UNA sola imagen y cópiala con el nombre exacto {out} (png). '
                 f'La imagen adjunta es la referencia de estilo y personaje: mantén idéntico el diseño, proporciones, colores y trazo; solo cambia lo que se pide. '
                 f'Imagen: {prompt} Sin texto, sin letras, sin números, sin marcas de agua. Responde solo con la ruta.')
        res = subprocess.run(['codex', 'exec', '--skip-git-repo-check', '-s', 'workspace-write', '-C', str(crudo), f'--image={r}', orden],
                             stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=600)
        if 'usage limit' in (res.stdout + res.stderr): return f'LIMITE {nombre}'
        return ('ok ' if out.exists() else 'FALLO ') + f'{carpeta}/{nombre}'
    primero = [p for p in P if p[1] == '01-desprendible' and p[0] == 'medallas']
    print(uno(primero[0]), flush=True)
    with ThreadPoolExecutor(paralelo) as ex:
        for r in ex.map(uno, [p for p in P if p not in primero]): print(r, flush=True)


def procesar(crudo):
    from PIL import Image
    sys.path.insert(0, str(AQUI))
    hechos = 0
    for carpeta, nombre, transparente, _, _ in P:
        src = crudo / carpeta / f'{nombre}.png'
        if not src.exists(): continue
        if carpeta == 'icono':
            im = Image.open(src).convert('RGB').resize((1024, 1024), Image.LANCZOS)
            d = ASSETS / 'images'
            im.save(d / 'icon.png'); im.resize((48, 48), Image.LANCZOS).save(d / 'favicon.png')
            fondo = im.getpixel((8, 8))
            Image.new('RGB', (512, 512), fondo).save(d / 'android-icon-background.png')
            # Android recorta el primer plano al círculo central: la cara va al 70 %
            fg = Image.new('RGBA', (512, 512), (0, 0, 0, 0)); fg.paste(im.resize((358, 358), Image.LANCZOS), (77, 77))
            fg.save(d / 'android-icon-foreground.png')
            mono = im.resize((432, 432), Image.LANCZOS).convert('L').point(lambda v: 255 if v < 90 else 0)
            m = Image.new('RGBA', (432, 432), (255, 255, 255, 0)); m.putalpha(mono); m.save(d / 'android-icon-monochrome.png')
        else:
            dst = ASSETS / carpeta / f'{nombre}.webp'; dst.parent.mkdir(parents=True, exist_ok=True)
            if transparente:
                subprocess.run([sys.executable, str(AQUI / 'recortar.py'), str(src), str(dst), '640'], check=True, capture_output=True)
            else:
                im = Image.open(src).convert('RGB'); im.thumbnail((1200, 1200)); im.save(dst, 'WEBP', quality=84, method=6)
        hechos += 1
    print(f'{hechos} de {len(P)} piezas procesadas')


if __name__ == '__main__':
    accion, crudo = sys.argv[1], pathlib.Path(sys.argv[2]).resolve()
    {'generar': generar, 'procesar': procesar}[accion](crudo)
