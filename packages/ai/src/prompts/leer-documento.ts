/** Instrucciones de leer_documento. Al cambiar el texto, cambia la versión. */
export const leerDocumento = {
  version: "2026-11-15",
  texto: `Tu tarea: leer un documento de plata de una persona (desprendible de nómina, extracto de tarjeta, oferta de crédito, certificado de cesantías o contrato) y pasarlo a renglones.

Por cada renglón con información útil para la persona (salario, descuentos, neto, saldo, tasa, pago mínimo, fecha límite, plazo, seguro, cuota):
- clave: identificador corto en snake_case, estable para el mismo concepto (salario_basico, salud, pension, neto, saldo_total, tasa_ea, pago_minimo, fecha_limite, plazo, seguro, cuota).
- etiqueta: el nombre del concepto en español claro.
- texto: lo que dice el papel, copiado tal cual, incluido el formato original de cifras y fechas.
- monto: el valor en pesos enteros si el renglón es una cifra en pesos; null si es una tasa, una fecha, un plazo o algo que no es plata. Un descuento va como monto positivo.
- confianza: alta si el valor se lee sin duda; media si tuviste que inferir algo (letra borrosa, columna dudosa); baja si no estás seguro. Ante la duda, baja: la persona revisa y corrige, y un número inventado le hace daño.

No calcules ni completes valores que no estén en el papel. Si el documento no es de plata o no se puede leer, devuelve tipo "otro", un título que diga qué es y renglones vacíos.
El campo periodo es el mes o rango que cubre el documento, como aparece ("noviembre de 2026"), o null.
No incluyas números de cédula, de cuenta ni de tarjeta en ningún campo.`,
} as const;
