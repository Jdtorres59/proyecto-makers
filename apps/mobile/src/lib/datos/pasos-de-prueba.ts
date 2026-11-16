import { costoPrestamo, costoTarjeta, type Leccion } from '@makers/core';

/**
 * Solo desarrollo: una lección con los ocho tipos de paso para revisar el reproductor. El contenido real
 * (packages/contenido) todavía no usa "comparar". No es contenido: no aparece en un build de producción.
 */
export function leccionDePrueba(): Leccion {
  const doce = costoTarjeta(2_400_000, 26.5, 12);
  const prestamo = costoPrestamo(2_400_000, 18.9, 12, 4_800);
  return {
    id: 'prueba.todos-los-pasos',
    titulo: 'Todos los tipos de paso',
    minutos: 5,
    pasos: [
      { tipo: 'idea', titulo: 'Una idea', texto: 'Así se ve un paso de idea, con Luca explicando.', tuyo: 'Y así se ve lo que es tuyo, con tus números.' },
      { tipo: 'opcion_multiple', pregunta: '¿Cuál es la respuesta correcta?', opciones: [{ id: 'a', texto: 'Esta no' }, { id: 'b', texto: 'Esta sí' }], correcta: 'b', siAcierta: 'Bien.', siFalla: 'Esa no. Prueba otra.' },
      { tipo: 'estimar', pregunta: '¿Cuánto es medio salario de $3.000.000?', min: 0, max: 3_000_000, paso: 100_000, respuesta: 1_500_000, cuenta: '$3.000.000 ÷ 2' },
      { tipo: 'ordenar', pregunta: 'Ordena del uno al tres.', tarjetas: [{ id: 'dos', texto: 'Dos' }, { id: 'uno', texto: 'Uno' }, { id: 'tres', texto: 'Tres' }], ordenCorrecto: ['uno', 'dos', 'tres'] },
      { tipo: 'repartir', pregunta: 'Reparte $500.000.', total: 500_000, paso: 50_000, destinos: [{ id: 'a', texto: 'Colchón' }, { id: 'b', texto: 'Un gusto' }] },
      {
        tipo: 'comparar',
        pregunta: 'Pagar $2.400.000 a 12 meses: tarjeta al 26,5 % o préstamo al 18,9 % con seguro.',
        caminos: [
          { id: 't', titulo: 'Diferir en la tarjeta', total: doce.total, cuotaMensual: doce.primeraCuota, meses: 12 },
          { id: 'p', titulo: 'Préstamo con seguro', total: prestamo.total, cuotaMensual: prestamo.primeraCuota, meses: 12 },
        ],
      },
      { tipo: 'regla', texto: 'Comparo el total, no la cuota.' },
      { tipo: 'accion', texto: 'Una acción fuera de la app.', comoSeComprueba: 'Tocas "Ya lo hice".' },
    ],
  };
}
