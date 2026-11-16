import { formatearCOP, netoDelMes } from '@makers/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { FilaEditable } from '@/components/documento';
import { Entrada } from '@/components/entrada';
import { BurbujaLuca, Luca } from '@/components/luca';
import { Cabecera, Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio, Fuente, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { fechaLarga } from '@/lib/fechas';

const soloDigitos = (t: string) => Number(t.replace(/\D/g, ''));

/** "1/10/2026" o "01-10-2026" a "2026-10-01"; null si no es una fecha válida o es futura. */
function aFecha(texto: string, hoy: string): string | null {
  const m = texto.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!m) return null;
  const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const fecha = new Date(Date.UTC(a, mes - 1, d));
  if (fecha.getUTCMonth() !== mes - 1 || fecha.getUTCDate() !== d || a < 1950) return null;
  const iso = `${a}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return iso > hoy ? null : iso;
}

/** "Esto fue lo que leí": la persona revisa y corrige en el mismo lugar. Lo derivado se recalcula solo. */
export default function Confirmar() {
  const tema = useTema();
  const { perfil, eventos, hoy, actualizarPerfil, documento, corregirRenglon } = useLuca();
  if (!perfil) return null;
  const { salario, diaDePago, empresa, fechaIngreso } = perfil;
  const renglonSalario = documento?.renglones.find((r) => r.clave === 'salario_basico' || r.clave === 'salario');
  const prima = eventos.find((e) => e.tipo === 'prima');

  return (
    <Pantalla cabecera={<Cabecera />} pie={<Boton titulo="Está bien" onPress={() => router.push('/preguntas')} />}>
      <Entrada indice={0}>
        <Texto tipo="titulo">Esto fue lo que leí</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca texto="Revisa que esté bien. Si algo no cuadra, cámbialo." />
      </Entrada>
      {documento ? (
        <Entrada indice={2}>
          <Texto tipo="titulo3" role="heading">
            En tu documento
          </Texto>
          <View>
            {documento.renglones.map((r) => (
              <FilaEditable
                key={r.clave}
                etiqueta={r.etiqueta}
                valor={r.monto !== null ? formatearCOP(r.monto) : r.texto}
                valorEditable={r.monto !== null ? String(r.monto) : r.texto}
                numerico={r.monto !== null}
                revisar={r.confianza === 'alta' ? undefined : r.confianza}
                alGuardar={
                  r.monto === null
                    ? undefined
                    : (t) => {
                        const n = soloDigitos(t);
                        if (!Number.isSafeInteger(n) || n <= 0) return false;
                        corregirRenglon(documento.id, r.clave, n);
                        return true;
                      }
                }
              />
            ))}
          </View>
        </Entrada>
      ) : null}

      <Entrada indice={3}>
        <Texto tipo="titulo3" role="heading">
          Para calcular tus fechas
        </Texto>
        <View>
          <FilaEditable
            etiqueta="Empresa"
            valor={empresa ?? 'Cuéntame dónde trabajas'}
            valorEditable={empresa ?? ''}
            alGuardar={(t) => (actualizarPerfil({ empresa: t }), true)}
          />
          {!renglonSalario ? (
            <FilaEditable
              etiqueta="Salario básico"
              valor={salario !== null ? formatearCOP(salario) : 'No lo encontré'}
              valorEditable={salario !== null ? String(salario) : ''}
              numerico
              alGuardar={(t) => {
                const n = soloDigitos(t);
                if (!Number.isSafeInteger(n) || n < 100_000) return false;
                actualizarPerfil({ salario: n });
                return true;
              }}
            />
          ) : null}
          <FilaEditable etiqueta="Te consignan cada mes" valor={salario !== null ? formatearCOP(netoDelMes(salario, hoy)) : 'Lo calculo con tu salario'} numerico />
          <FilaEditable
            etiqueta="Te pagan"
            valor={diaDePago ? `El ${diaDePago} de cada mes` : 'Dime qué día del mes'}
            valorEditable={diaDePago ? String(diaDePago) : ''}
            numerico
            alGuardar={(t) => {
              const n = soloDigitos(t);
              if (n < 1 || n > 31) return false;
              actualizarPerfil({ diaDePago: n });
              return true;
            }}
          />
          <FilaEditable
            etiqueta="Entraste a trabajar (día/mes/año)"
            valor={fechaIngreso ? fechaLarga(fechaIngreso, '0000-01-01') : 'Dime cuándo entraste'}
            valorEditable={fechaIngreso ? fechaIngreso.split('-').reverse().join('/') : ''}
            alGuardar={(t) => {
              const f = aFecha(t, hoy);
              if (!f) return false;
              actualizarPerfil({ fechaIngreso: f });
              return true;
            }}
          />
        </View>
      </Entrada>

      {prima ? (
        <Entrada indice={4}>
          <Tarjeta variante="superficie" style={estilos.aha}>
            <Luca pose="sorprendido" tamano={64} gesto="quieto" />
            <Texto style={{ flex: 1 }}>
              Con esto ya sé algo más: el <Texto style={{ fontFamily: Fuente.negrita }}>{fechaLarga(prima.fecha)}</Texto> te llega tu primera prima,{' '}
              <Texto esCifra style={{ fontFamily: Fuente.titular, color: tema.texto }}>
                {prima.monto !== null ? formatearCOP(prima.monto) : 'que todavía no sé calcular'}
              </Texto>
              .
            </Texto>
          </Tarjeta>
        </Entrada>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  aha: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
});
