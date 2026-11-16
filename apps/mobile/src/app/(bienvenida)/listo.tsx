import { netoDelMes } from '@makers/core';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Celebracion } from '@/components/celebracion';
import { Cifra } from '@/components/cifra';
import { Entrada } from '@/components/entrada';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espacio, Forma, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { fechaCorta } from '@/lib/fechas';

/** Resumen de lo que Luca ya sabe, con celebración. "Ver mi inicio" abre las pestañas. */
export default function Listo() {
  const { perfil, eventos, hoy, terminarBienvenida } = useLuca();
  if (!perfil) return null;
  const prima = eventos.find((e) => e.tipo === 'prima');
  const hechos: { bola: string; principal: ReactNode; detalle: string }[] = [];

  if (perfil.salario !== null && perfil.diaDePago) {
    const neto = netoDelMes(perfil.salario, hoy);
    hechos.push({ bola: String(perfil.diaDePago), principal: <Cifra valor={neto} tamano={22} demora={500} />, detalle: 'te llegan cada mes' });
  }
  if (prima) {
    const { dia, mes } = fechaCorta(prima.fecha);
    hechos.push({
      bola: `${dia} ${mes}`,
      principal: prima.monto !== null ? <Cifra valor={prima.monto} tamano={22} demora={700} /> : <Texto tipo="titulo3">Tu primera prima</Texto>,
      detalle: prima.monto !== null ? 'tu primera prima' : 'todavía no sé cuánto es',
    });
  }
  hechos.push({
    bola: 'Meta',
    principal: <Texto tipo="titulo3">{!perfil.meta || perfil.meta === 'Todavía no sé' ? 'La vamos a encontrar' : perfil.meta}</Texto>,
    detalle: 'para lo que quieres ahorrar',
  });

  return (
    <Pantalla pie={<Boton titulo="Ver mi inicio" onPress={terminarBienvenida} />}>
      <Entrada indice={0} style={{ marginTop: Espacio.l }}>
        <Celebracion tamano={150} />
      </Entrada>
      <Entrada indice={1}>
        <Texto tipo="titulo" style={{ textAlign: 'center' }}>
          Listo, ya te conozco un poco.
        </Texto>
      </Entrada>
      <View style={{ gap: Espacio.m }}>
        {hechos.map((h, i) => (
          <Entrada key={h.bola} indice={2 + i}>
            <Hecho {...h} />
          </Entrada>
        ))}
      </View>
    </Pantalla>
  );
}

function Hecho({ bola, principal, detalle }: { bola: string; principal: ReactNode; detalle: string }) {
  const tema = useTema();
  return (
    <View style={[estilos.hecho, { backgroundColor: tema.papel, borderColor: tema.linea }]}>
      <View style={[estilos.bola, { backgroundColor: tema.maiz, borderColor: tema.linea }]}>
        <Texto tipo="pequeno" esCifra color={tema.sobreMaiz} style={{ fontFamily: 'BricolageGrotesque_800ExtraBold', textAlign: 'center' }}>
          {bola}
        </Texto>
      </View>
      <View style={{ flex: 1 }}>
        {principal}
        <Texto tipo="pequeno" suave>
          {detalle}
        </Texto>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  hecho: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: Forma.contorno, borderRadius: Forma.radio, padding: Espacio.m },
  bola: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center', padding: 4 },
});
