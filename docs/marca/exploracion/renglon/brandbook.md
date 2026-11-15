# Brand book · Renglón (nombre de trabajo)

*Dirección 3 de tres. Exploración, no decisión: el nombre "Renglón" es una propuesta de trabajo y nada de esto está aprobado por el equipo. Eje: **densidad y precisión (instrumento)**. Maquetas: [maquetas.html](maquetas.html). Versión navegable: [brandbook.html](brandbook.html).*

## 1. Esencia

| | |
|---|---|
| **Qué es** | Una app que lee tus documentos de plata renglón por renglón y te muestra las cuentas y las fechas que vienen |
| **A quién** | Jóvenes de 21 a 27 años con empleo formal que quieren ver los números completos |
| **Promesa** | Ver las cuentas completas de tu plata, con la fórmula a la vista, para decidir con datos |
| **Por qué el nombre** | Un desprendible, un extracto y un contrato se leen renglón por renglón. Y "llevar las cuentas en renglón" es tenerlas en orden |
| **Personalidad** | Precisa, honesta, sobria, transparente, sin adornos |
| **Lo que no somos** | Plataforma de trading, hoja de cálculo intimidante, banco, app de presupuesto que obliga a anotar todo |

**La idea en una frase.** Tu plata como un buen instrumento: cada renglón de tus documentos, numerado, medido y explicado. Cifras en monoespaciada, reglas finas, un solo azul cobalto.

## 2. Logo

- **Marca denominativa:** `renglón` en Instrument Sans 600 condensada al 85 %, sobre una regla de 2 px que termina en una marca cobalto, como el último renglón de una cuenta.
- **Símbolo:** tres renglones dentro de un cuadrado; el primero en cobalto. Ícono de app y avatar.
- **Área de respeto:** la altura de la "r". **Tamaño mínimo:** 96 px de ancho; símbolo de 20 px.

| Versión | Texto | Detalle | Fondo |
|---|---|---|---|
| Positivo | Grafito `#14171B` | Marca cobalto `#2443D0` | Hueso y claros |
| Negativo | Niebla `#E8EBEE` | Marca cobalto claro `#8DA2FF` | Grafito y oscuros |
| Símbolo | n/a | Primer renglón en cobalto | Ícono de app, avatar |

- **Usos incorrectos:** quitar la regla, mover la marca cobalto al inicio, usar la palabra sin tilde, mayúsculas.
- **Archivos:** el SVG vive dentro de `brandbook.html`. Si se elige esta dirección, se convierte a trazos y se exporta en SVG y PNG.

## 3. Color

| Hex | Nombre | Uso |
|---|---|---|
| `#2443D0` | Cobalto | Acento: botón principal, renglón activo, enlaces y la marca del logo |
| `#F4F5F1` | Hueso | Fondo claro, gris con un punto de verde, como papel de cuenta |
| `#E8EAE5` | Hueso 2 | Superficies y renglón abierto |
| `#14171B` | Grafito | Texto en claro y fondo del símbolo |
| `#111417` | Grafito noche | Fondo oscuro |
| `#8DA2FF` | Cobalto claro | Acento en oscuro |
| `#BE2519` | Señal | Alarma, solo para lo que cuesta plata: intereses, mora, cobros extra. En oscuro: `#FF7A6B` |

- Reglas finas de 1 px en lugar de tarjetas con sombra. La jerarquía la dan el tamaño y el espacio.
- El cobalto marca lo que se puede tocar o lo que está activo; no colorea cifras.
- Grises de una sola familia, fríos con un punto de verde. Nada de gris cálido mezclado.

**Contraste medido** (WCAG 2.2; texto exige 4,5:1, elementos de interfaz 3:1):

| Tema | Par | Frente | Fondo | Contraste | Mínimo | Resultado |
|---|---|---|---|---|---|---|
| claro | Texto sobre fondo | `#14171B` | `#F4F5F1` | 16,42:1 | 4,50:1 | Pasa |
| claro | Texto suave sobre fondo | `#545A62` | `#F4F5F1` | 6,36:1 | 4,50:1 | Pasa |
| claro | Texto sobre superficie | `#14171B` | `#E8EAE5` | 14,84:1 | 4,50:1 | Pasa |
| claro | Texto suave sobre superficie | `#545A62` | `#E8EAE5` | 5,75:1 | 4,50:1 | Pasa |
| claro | Texto del botón sobre acento | `#FFFFFF` | `#2443D0` | 7,53:1 | 4,50:1 | Pasa |
| claro | Acento como texto sobre fondo | `#2443D0` | `#F4F5F1` | 6,88:1 | 4,50:1 | Pasa |
| claro | Alarma sobre fondo | `#BE2519` | `#F4F5F1` | 5,53:1 | 4,50:1 | Pasa |
| claro | Alarma sobre superficie | `#BE2519` | `#E8EAE5` | 5,00:1 | 4,50:1 | Pasa |
| claro | Anillo de foco sobre fondo | `#2443D0` | `#F4F5F1` | 6,88:1 | 3,00:1 | Pasa |
| claro | Borde de control sobre fondo | `#80868D` | `#F4F5F1` | 3,36:1 | 3,00:1 | Pasa |
| oscuro | Texto sobre fondo | `#E8EBEE` | `#111417` | 15,44:1 | 4,50:1 | Pasa |
| oscuro | Texto suave sobre fondo | `#9BA3AC` | `#111417` | 7,24:1 | 4,50:1 | Pasa |
| oscuro | Texto sobre superficie | `#E8EBEE` | `#1A1F24` | 13,87:1 | 4,50:1 | Pasa |
| oscuro | Texto suave sobre superficie | `#9BA3AC` | `#1A1F24` | 6,50:1 | 4,50:1 | Pasa |
| oscuro | Texto del botón sobre acento | `#0E1116` | `#8DA2FF` | 7,87:1 | 4,50:1 | Pasa |
| oscuro | Acento como texto sobre fondo | `#8DA2FF` | `#111417` | 7,70:1 | 4,50:1 | Pasa |
| oscuro | Alarma sobre fondo | `#FF7A6B` | `#111417` | 7,26:1 | 4,50:1 | Pasa |
| oscuro | Alarma sobre superficie | `#FF7A6B` | `#1A1F24` | 6,52:1 | 4,50:1 | Pasa |
| oscuro | Anillo de foco sobre fondo | `#8DA2FF` | `#111417` | 7,70:1 | 3,00:1 | Pasa |
| oscuro | Borde de control sobre fondo | `#6A727C` | `#111417` | 3,79:1 | 3,00:1 | Pasa |

## 4. Tipografía

| Rol | Familia | Pesos | Carácter |
|---|---|---|---|
| Cifras | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400, 500, 700 | Monoespaciada de alta legibilidad: los ceros, los ochos y los puntos de miles no se confunden. Todas las columnas de plata quedan alineadas. |
| Titulares e interfaz | [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) | 400, 500, 600; ancho 85 a 100 | Grotesca precisa con eje de ancho. Condensada en titulares para que quepa más en una pantalla; normal en texto. |
| Notas y fórmulas | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400 | La fórmula visible: así se ve de dónde sale cada cifra. |

- Las dos son gratuitas (SIL Open Font) y están en Google Fonts.
- Las cifras de plata van siempre en monoespaciada, alineadas a la derecha, con formato $1.234.567.
- Texto base de 15 px, más denso que las otras dos direcciones. Etiquetas y fechas en monoespaciada de 12 px; nada por debajo de eso.

## 5. Imagen

- **Fotografía:** casi no hay. Cuando aparece, es el documento real de la persona (su foto del desprendible) o un detalle de objeto en luz neutra. Nada de gente posando.
- **Ilustración:** no se usa. Los gráficos son datos reales: barras de la quincena, línea de tiempo.
- **Iconografía:** Phosphor Regular de 1,5 px, en grafito.
- **Movimiento:** funcional y rápido (menos de 200 ms): el renglón que se abre, la cifra que cambia con el deslizador.

## 6. Voz y tono

Hablamos de **tú**, con frases cortas y exactas. Primero el dato, después la explicación. Siempre decimos de dónde sale la cifra. Sin adjetivos que no midan nada.

| Sí lo decimos | No lo decimos |
|---|---|
| Te llegan $900.000 antes del 20 de diciembre | Te va a llegar una buena platica |
| 3.600.000 × 90 ÷ 360 = 900.000 | Calculamos tu prima con nuestra tecnología |
| Tú decides el reparto; aquí ves el efecto de cada opción | Te recomendamos este fondo |
| Diferencia: $400.000 | Fallaste por mucho |
| Intereses de este mes: $86.400 | Estás perdiendo plata |

**Frases reales de la app:**

| Dónde | Frase |
|---|---|
| Entrada | Cada renglón de tu plata, explicado. |
| Inicio | Prima estimada: $900.000. Faltan 35 días. |
| Lección | Apuesta: ¿cuánto te llega de prima? |
| Revelación | Te llegan $900.000. Diferencia con tu apuesta: $400.000. |
| Desprendible | Renglón 02. Salud, 4 % de tu salario. Va a tu EPS. |
| Error de lectura | Renglón 05 ilegible: fecha de ingreso. Escríbela para seguir. |

**Palabras que evitamos:** inteligente, revolucionario, increíble, genial, ¡ups!, mágico.

## 7. Mensajes clave

- **Taglines (propuesta):** *Cada renglón, claro.* · *Tus cuentas, completas.*
- **Propuesta de valor:** Lee tus documentos de plata renglón por renglón, te muestra la cuenta detrás de cada cifra y las fechas que vienen.
- **Mensajes de apoyo:**
  - Siempre ves la fórmula: nada sale de una caja negra.
  - Tus números, con la norma y la fecha de donde salen.
  - No vende productos ni entidades.
  - Lo que subes es tuyo y lo puedes borrar.
- **Llamado a la acción principal:** Escanea tu desprendible.
- **Promesas que no hacemos:** rentabilidades, puntajes de crédito, recomendaciones de inversión.

## 8. A quién le habla mejor y riesgo

- **Le habla mejor a:** Valentina en su versión analítica y quien estudia ingeniería o administración: quiere ver la cuenta, no que se la cuenten.
- **Riesgo:** Puede sentirse fría o intimidante para Santiago, que ya está angustiado con su deuda, y acercarse a una app de trading. La densidad choca con "una idea por pantalla" si no se cuida.
- **Costo de llevarla a la app:** Bajo en estilo, medio en componentes: tablas alineadas, deslizador con regla y renglones numerados necesitan cuidado en React Native.
