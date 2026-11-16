import { formatearCOP } from '@makers/core';
import { View } from 'react-native';

import { Boton } from '@/components/boton';
import { FilaEditable } from '@/components/documento';
import { Entrada } from '@/components/entrada';
import { BurbujaLuca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { useLuca } from '@/lib/datos/contexto';
import { fechaLarga } from '@/lib/fechas';
import { useSesion } from '@/lib/sesion';

const VIVIENDA = { familia: 'Con mi familia', arriendo: 'En arriendo', propia: 'En vivienda propia', otra: 'Otra' } as const;

/** Segunda tanda: editar y borrar. Hoy muestra lo que Luca sabe, tal cual, y permite salir. */
export default function SobreMi() {
  const { perfil } = useLuca();
  const { salir } = useSesion();
  if (!perfil) return null;
  const filas: [string, string | null][] = [
    ['Nombre', perfil.nombre],
    ['Empresa', perfil.empresa],
    ['Cargo', perfil.cargo],
    ['Salario básico', perfil.salario !== null ? formatearCOP(perfil.salario) : null],
    ['Te pagan', perfil.diaDePago ? `El ${perfil.diaDePago} de cada mes` : null],
    ['Entraste', perfil.fechaIngreso ? fechaLarga(perfil.fechaIngreso, '0000-01-01') : null],
    ['Deudas', perfil.deudas.length ? perfil.deudas.map((d) => d.nombre).join(', ') : 'Ninguna'],
    ['Meta', perfil.meta],
    ['Dónde vives', perfil.vivienda ? VIVIENDA[perfil.vivienda] : null],
  ];
  return (
    <Pantalla conPestanas>
      <Entrada indice={0}>
        <Texto tipo="titulo">Lo que sé de ti</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca texto="Esto es todo lo que sé. Pronto vas a poder cambiarlo y borrarlo desde aquí." />
      </Entrada>
      <Entrada indice={2}>
        <View>
          {filas.map(([etiqueta, valor]) => (
            <FilaEditable key={etiqueta} etiqueta={etiqueta} valor={valor ?? 'No lo sé todavía'} />
          ))}
        </View>
      </Entrada>
      <Entrada indice={3}>
        <Boton titulo="Cerrar sesión" variante="texto" onPress={salir} />
      </Entrada>
    </Pantalla>
  );
}
