const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const partes = (fecha: string) => fecha.split('-').map(Number) as [number, number, number];

/** "20 de diciembre" (con año si no es el de `hoy`). */
export function fechaLarga(fecha: string, hoy?: string) {
  const [a, m, d] = partes(fecha);
  const conAño = hoy && partes(hoy)[0] !== a ? ` de ${a}` : '';
  return `${d} de ${MESES[m - 1]}${conAño}`;
}

/** { dia: "20", mes: "dic" } para la línea de tiempo. */
export function fechaCorta(fecha: string) {
  const [, m, d] = partes(fecha);
  return { dia: String(d), mes: MESES[m - 1].slice(0, 3) };
}

/** Días calendario entre hoy y la fecha. */
export function diasHasta(fecha: string, hoy: string) {
  const utc = (f: string) => {
    const [a, m, d] = partes(f);
    return Date.UTC(a, m - 1, d);
  };
  return Math.round((utc(fecha) - utc(hoy)) / 86_400_000);
}
