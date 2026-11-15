# Arma index.html (documento completo) y, si se da una carpeta, la copia para el artifact.
import sys, pathlib, shutil
aqui = pathlib.Path(__file__).parent
frag = (aqui / 'pagina.html').read_text()
assert '—' not in frag, 'raya larga en el texto'
cab, cuerpo = frag.split('<!--CUERPO-->')
doc = f'<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n{cab}</head>\n<body>\n{cuerpo}</body>\n</html>\n'
(aqui.parent / 'index.html').write_text(doc)
if len(sys.argv) > 1:
    d = pathlib.Path(sys.argv[1]); d.mkdir(parents=True, exist_ok=True)
    (d / 'luca-direcciones.html').write_text(frag.replace('<!--CUERPO-->', ''))
    shutil.copytree(aqui.parent / 'img', d / 'img', dirs_exist_ok=True)
print('ok')
