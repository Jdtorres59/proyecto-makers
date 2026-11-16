import { formatearCOP, netoDelMes, type PerfilFinanciero } from '@makers/core';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Campo } from '@/components/campo';
import { Chip } from '@/components/chip';
import { Entrada } from '@/components/entrada';
import { Hoja } from '@/components/hoja';
import { Icono } from '@/components/icono';
import { BurbujaLuca, Luca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Texto } from '@/components/texto';
import { Espacio, Forma, useTema } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';
import { fechaLarga } from '@/lib/fechas';
import { haptica } from '@/lib/haptica';
import { useSesion } from '@/lib/sesion';

type Editable = 'empresa' | 'salario' | 'diaDePago' | 'celular' | 'meta' | 'vivienda';
type Fila = { etiqueta: string; valor: string; editar?: Editable };

const VIVIENDAS: { texto: string; valor: NonNullable<PerfilFinanciero['vivienda']> }[] = [
  { texto: 'Con mi familia', valor: 'familia' },
  { texto: 'En arriendo', valor: 'arriendo' },
  { texto: 'En vivienda propia', valor: 'propia' },
  { texto: 'Otra', valor: 'otra' },
];
const numero = (t: string) => Number(t.replace(/\D/g, '')) || 0;

/** "Lo que Luca sabe de ti": todo lo que sabe, agrupado, editable y borrable. */
export default function SobreMi() {
  const tema = useTema();
  const { perfil, hoy, actualizarPerfil, borrarTodo } = useLuca();
  const { salir } = useSesion();
  const [editando, setEditando] = useState<Editable | null>(null);
  const [borrador, setBorrador] = useState({ a: '', b: '' });
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [cambiadas, setCambiadas] = useState<Editable[]>([]);
  const [error, setError] = useState(false);
  if (!perfil) return null;

  const celular = perfil.deudas.find((d) => d.tipo === 'celular');
  const grupos: { titulo: string; fuente: string; filas: Fila[] }[] = [
    {
      titulo: 'Tu trabajo',
      fuente: 'De tu desprendible',
      filas: [
        { etiqueta: 'Empresa', valor: perfil.empresa ?? 'No lo sé todavía', editar: 'empresa' },
        { etiqueta: 'Salario básico', valor: perfil.salario !== null ? formatearCOP(perfil.salario) : 'No lo sé todavía', editar: 'salario' },
        { etiqueta: 'Te consignan', valor: perfil.salario !== null ? formatearCOP(netoDelMes(perfil.salario, hoy)) : 'Lo calculo con tu salario' },
        { etiqueta: 'Día de pago', valor: perfil.diaDePago ? `El ${perfil.diaDePago} de cada mes` : 'No lo sé todavía', editar: 'diaDePago' },
        { etiqueta: 'Entraste', valor: perfil.fechaIngreso ? fechaLarga(perfil.fechaIngreso, '0000-01-01') : 'No lo sé todavía' },
      ],
    },
    {
      titulo: 'Lo que debes',
      fuente: 'Me lo contaste',
      filas: perfil.deudas.length
        ? perfil.deudas.map((d) =>
            d.tipo === 'celular' && d.cuotaMensual !== null
              ? { etiqueta: 'Celular a cuotas', valor: `${formatearCOP(d.cuotaMensual)} al mes · quedan ${d.cuotasRestantes ?? '?'}`, editar: 'celular' as const }
              : { etiqueta: d.nombre, valor: 'Sin detalles todavía' },
          )
        : [{ etiqueta: 'Deudas', valor: 'No tienes' }],
    },
    { titulo: 'Lo que quieres', fuente: 'Me lo contaste', filas: [{ etiqueta: 'Tu meta', valor: perfil.meta ?? 'Todavía no sé', editar: 'meta' }] },
    {
      titulo: 'Dónde vives',
      fuente: 'Me lo contaste',
      filas: [{ etiqueta: 'Vives', valor: VIVIENDAS.find((v) => v.valor === perfil.vivienda)?.texto ?? 'Sin contarme', editar: 'vivienda' }],
    },
  ];

  const abrir = (e: Editable) => {
    setError(false);
    setBorrador({
      a: e === 'empresa' ? (perfil.empresa ?? '') : e === 'salario' ? String(perfil.salario ?? '') : e === 'diaDePago' ? String(perfil.diaDePago ?? '') : e === 'celular' ? String(celular?.cuotaMensual ?? '') : (perfil.meta ?? ''),
      b: e === 'celular' ? String(celular?.cuotasRestantes ?? '') : '',
    });
    setEditando(e);
  };
  const marcar = (e: Editable) => setCambiadas((c) => (c.includes(e) ? c : [...c, e]));
  const guardar = () => {
    if (!editando) return;
    const a = borrador.a.trim();
    if (editando === 'empresa' || editando === 'meta') {
      if (!a) return setError(true);
      actualizarPerfil(editando === 'empresa' ? { empresa: a } : { meta: a });
    } else if (editando === 'salario') {
      if (numero(a) < 100_000) return setError(true);
      actualizarPerfil({ salario: numero(a) });
    } else if (editando === 'diaDePago') {
      const n = numero(a);
      if (n < 1 || n > 31) return setError(true);
      actualizarPerfil({ diaDePago: n });
    } else if (editando === 'celular' && celular) {
      if (!numero(a)) return setError(true);
      actualizarPerfil({ deudas: perfil.deudas.map((d) => (d.id === celular.id ? { ...d, cuotaMensual: numero(a), cuotasRestantes: numero(borrador.b) || d.cuotasRestantes } : d)) });
    }
    haptica.toque();
    marcar(editando);
    setEditando(null);
  };

  const TITULOS: Record<Editable, string> = { empresa: 'Empresa', salario: 'Salario básico', diaDePago: 'Día de pago', celular: 'Celular a cuotas', meta: 'Tu meta', vivienda: '¿Dónde vives hoy?' };

  return (
    <Pantalla conPestanas>
      <Entrada indice={0}>
        <Texto tipo="titulo">Lo que sé de ti</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca texto="Esto es todo lo que sé. Si algo está mal o cambió, tócalo y lo corriges." />
      </Entrada>

      {grupos.map((g, i) => (
        <Entrada key={g.titulo} indice={2 + i} style={{ gap: Espacio.xs }}>
          <View style={estilos.grupoCabeza}>
            <Texto tipo="titulo3" role="heading">
              {g.titulo}
            </Texto>
            <Texto tipo="pequeno" suave>
              {g.fuente}
            </Texto>
          </View>
          <View style={[estilos.grupo, { borderColor: tema.linea, backgroundColor: tema.papel }]}>
            {g.filas.map((f, j) => {
              const contenido = (
                <>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Texto tipo="pequeno" suave>
                      {f.etiqueta}
                    </Texto>
                    <Texto tipo="cuerpoFuerte" esCifra>
                      {f.valor}
                    </Texto>
                    {f.editar && cambiadas.includes(f.editar) ? (
                      <Animated.View entering={FadeIn} style={estilos.cambiada}>
                        <Icono nombre="check" tamano={14} color={tema.verde} />
                        <Texto tipo="pequeno" color={tema.verde}>
                          Cambiado por ti
                        </Texto>
                      </Animated.View>
                    ) : null}
                  </View>
                  {f.editar ? <Icono nombre="editar" tamano={20} color={tema.textoSuave} /> : null}
                </>
              );
              const estilo = [estilos.fila, j > 0 && { borderTopWidth: 1, borderTopColor: tema.lineaSuave }];
              return f.editar ? (
                <Pressable
                  key={f.etiqueta}
                  onPress={() => abrir(f.editar!)}
                  accessibilityRole="button"
                  accessibilityLabel={`${f.etiqueta}: ${f.valor}. Cambiar`}
                  style={({ pressed }) => [...estilo, pressed && { backgroundColor: tema.superficie }]}>
                  {contenido}
                </Pressable>
              ) : (
                <View key={f.etiqueta} style={estilo} accessible accessibilityLabel={`${f.etiqueta}: ${f.valor}`}>
                  {contenido}
                </View>
              );
            })}
          </View>
        </Entrada>
      ))}

      <Entrada indice={6}>
        <View style={[estilos.pronto, { borderColor: tema.lineaSuave }]}>
          <Icono nombre="candado" tamano={22} color={tema.textoSuave} />
          <View style={{ flex: 1 }}>
            <Texto tipo="cuerpoFuerte">Conectar tu banco</Texto>
            <Texto tipo="pequeno" suave>
              Próximamente
            </Texto>
          </View>
        </View>
      </Entrada>
      <Entrada indice={7} style={{ gap: Espacio.xs }}>
        <Boton titulo="Borrar todo lo que sé" variante="texto" onPress={() => setConfirmarBorrar(true)} />
        <Boton titulo="Cerrar sesión" variante="texto" onPress={salir} />
      </Entrada>

      <Hoja visible={editando !== null} alCerrar={() => setEditando(null)} titulo={editando ? TITULOS[editando] : ''}>
        {editando === 'vivienda' ? (
          <View style={estilos.chips}>
            {VIVIENDAS.map((v) => (
              <Chip
                key={v.valor}
                texto={v.texto}
                elegido={perfil.vivienda === v.valor}
                onPress={() => {
                  actualizarPerfil({ vivienda: v.valor });
                  marcar('vivienda');
                  setEditando(null);
                }}
              />
            ))}
          </View>
        ) : editando ? (
          <>
            <Texto suave>{editando === 'salario' || editando === 'celular' ? 'Si cambia, recalculo tu prima, tus fechas y tus planes.' : 'Lo cambio en todo lo que te muestro.'}</Texto>
            <Campo
              etiqueta={editando === 'celular' ? 'Cuota al mes' : editando === 'diaDePago' ? 'Día de pago (1 a 31)' : TITULOS[editando]}
              value={borrador.a}
              onChangeText={(t) => (setBorrador((b) => ({ ...b, a: t })), setError(false))}
              keyboardType={['salario', 'diaDePago', 'celular'].includes(editando) ? 'number-pad' : 'default'}
              esCifra={['salario', 'diaDePago', 'celular'].includes(editando)}
              autoFocus
              onSubmitEditing={guardar}
            />
            {editando === 'celular' ? (
              <Campo etiqueta="Cuotas que faltan" value={borrador.b} onChangeText={(t) => setBorrador((b) => ({ ...b, b: t }))} keyboardType="number-pad" esCifra />
            ) : null}
            {error ? (
              <Texto tipo="pequeno" accessibilityRole="alert">
                Revisa ese dato, no lo pude usar.
              </Texto>
            ) : null}
            <Boton titulo="Guardar" onPress={guardar} />
          </>
        ) : null}
      </Hoja>

      <Hoja visible={confirmarBorrar} alCerrar={() => setConfirmarBorrar(false)} titulo="¿Borro todo lo que sé?">
        <View style={estilos.aviso}>
          <Luca pose="atento" tamano={72} gesto="quieto" />
          <Texto style={{ flex: 1 }}>Tus documentos, tus respuestas, tus lecciones y tus planes. No se puede deshacer. Tu cuenta se queda.</Texto>
        </View>
        <Boton titulo="Mejor no" onPress={() => setConfirmarBorrar(false)} />
        <Boton
          titulo="Sí, borrar todo"
          variante="texto"
          onPress={async () => {
            haptica.firme();
            setConfirmarBorrar(false);
            await borrarTodo();
          }}
        />
      </Hoja>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  grupoCabeza: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: Espacio.m, flexWrap: 'wrap' },
  grupo: { borderWidth: Forma.contorno, borderRadius: Forma.radio, overflow: 'hidden' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, paddingHorizontal: Espacio.l, paddingVertical: Espacio.m, minHeight: 64 },
  cambiada: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pronto: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: Forma.radio, padding: Espacio.m },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.s },
  aviso: { flexDirection: 'row', alignItems: 'center', gap: Espacio.m },
});
