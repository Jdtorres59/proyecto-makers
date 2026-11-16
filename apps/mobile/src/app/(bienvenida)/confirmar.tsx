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

/** "Esto fue lo que leí": la persona revisa y corrige en el mismo lugar. Lo derivado se recalcula solo. */
export default function Confirmar() {
  const tema = useTema();
  const { perfil, eventos, hoy, actualizarPerfil } = useLuca();
  if (!perfil) return null;
  const { salario, diaDePago, empresa, fechaIngreso } = perfil;
  const prima = eventos.find((e) => e.tipo === 'prima');

  return (
    <Pantalla cabecera={<Cabecera />} pie={<Boton titulo="Está bien" onPress={() => router.push('/preguntas')} />}>
      <Entrada indice={0}>
        <Texto tipo="titulo">Esto fue lo que leí</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca texto="Revisa que esté bien. Si algo no cuadra, cámbialo." />
      </Entrada>
      <Entrada indice={2}>
        <View>
          <FilaEditable
            etiqueta="Empresa"
            valor={empresa ?? 'No lo encontré'}
            valorEditable={empresa ?? ''}
            alGuardar={(t) => (actualizarPerfil({ empresa: t }), true)}
          />
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
          <FilaEditable etiqueta="Te consignan cada mes" valor={salario !== null ? formatearCOP(netoDelMes(salario, hoy)) : 'Lo calculo con tu salario'} numerico />
          <FilaEditable
            etiqueta="Te pagan"
            valor={diaDePago ? `El ${diaDePago} de cada mes` : 'No lo encontré'}
            valorEditable={diaDePago ? String(diaDePago) : ''}
            numerico
            alGuardar={(t) => {
              const n = soloDigitos(t);
              if (n < 1 || n > 31) return false;
              actualizarPerfil({ diaDePago: n });
              return true;
            }}
          />
          <FilaEditable etiqueta="Entraste" valor={fechaIngreso ? fechaLarga(fechaIngreso, '0000-01-01') : 'No lo encontré'} />
        </View>
      </Entrada>

      {prima ? (
        <Entrada indice={3}>
          <Tarjeta variante="superficie" style={estilos.aha}>
            <Luca pose="celebra" tamano={64} gesto="quieto" />
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
