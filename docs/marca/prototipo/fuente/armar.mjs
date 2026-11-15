// Arma el prototipo: incrusta los módulos del currículo y los logos, y escribe la página completa.
// Uso: node docs/marca/prototipo/fuente/armar.mjs [carpeta-del-artifact]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const aqui = (p) => new URL(p, import.meta.url);
const leer = (p) => readFileSync(aqui(p), 'utf8');

// Los módulos salen de docs/ideas/10 (rama claude/curriculo-46e2b3), propuesta sin aprobar.
// Se quitan las notas de proceso entre paréntesis (verificado, por verificar, referencias a otros documentos).
const limpiar = (s) => s.replace(/\s*\([^()]*(verific|ver [A-Z]|documento|adelanta|C\d)[^()]*\)/g, '').replace(/\s+/g, ' ').trim();
const modulos = JSON.parse(leer('./modulos.json')).map((m) => ({
  id: m.id, nombre: m.nombre,
  lecciones: m.lecciones.map(([t, idea, regla]) => [t, limpiar(idea), regla]),
}));

const svg = (marca) => leer(`../../exploracion/fuente/iconos/${marca}.svg`).replace(/<title>.*?<\/title>/, '');
const uri = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

const [cabeza, cuerpo] = leer('./plantilla.html')
  .replace('%%MODULOS%%', JSON.stringify(modulos))
  .replace('%%GOOGLE%%', uri(svg('google')))
  .replace('%%APPLE%%', uri(svg('apple')))
  .split('<!--CUERPO-->');

if (/—/.test(cabeza + cuerpo)) throw new Error('Hay rayas largas en el texto');

const doc = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${cabeza.trim()}
</head>
<body>
${cuerpo.trim()}
</body>
</html>
`;
writeFileSync(aqui('../luca-prototipo.html'), doc);
console.log('escrito: docs/marca/prototipo/luca-prototipo.html');

if (process.argv[2]) {
  mkdirSync(process.argv[2], { recursive: true });
  const art = cabeza.trim().replace('</title>', '</title>\n<meta name="claude:viewport-fit-sides" content="cover">') + '\n' + cuerpo.trim() + '\n';
  writeFileSync(join(process.argv[2], 'luca-prototipo.html'), art);
  console.log(`artifact: ${join(process.argv[2], 'luca-prototipo.html')}`);
}
