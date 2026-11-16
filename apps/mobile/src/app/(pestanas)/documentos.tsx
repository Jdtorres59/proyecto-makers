import { RenglonDocumento } from '@/components/documento';
import { Entrada } from '@/components/entrada';
import { BurbujaLuca } from '@/components/luca';
import { Pantalla } from '@/components/pantalla';
import { Tarjeta } from '@/components/tarjeta';
import { Texto } from '@/components/texto';
import { Espacio } from '@/constants/tema';
import { useLuca } from '@/lib/datos/contexto';

/** Segunda tanda: explicar línea por línea y subir más. Hoy muestra lo que ya se leyó, nada inventado. */
export default function Documentos() {
  const { documento } = useLuca();
  return (
    <Pantalla conPestanas>
      <Entrada indice={0}>
        <Texto tipo="titulo">Mis documentos</Texto>
      </Entrada>
      <Entrada indice={1}>
        <BurbujaLuca
          texto={
            documento
              ? 'Este es el desprendible que leímos. Pronto te lo voy a explicar línea por línea, y vas a poder subir otros papeles.'
              : 'Todavía no me has mostrado ningún documento. Pronto vas a poder subirlos aquí.'
          }
        />
      </Entrada>
      {documento ? (
        <Entrada indice={2}>
          <Tarjeta style={{ gap: Espacio.s }}>
            <Texto tipo="titulo3">{documento.titulo}</Texto>
            <Texto tipo="pequeno" suave>
              Desprendible · {documento.periodo}
            </Texto>
            {documento.renglones.map((r) => (
              <RenglonDocumento key={r.clave} renglon={r} total={r.clave === 'neto'} />
            ))}
          </Tarjeta>
        </Entrada>
      ) : null}
    </Pantalla>
  );
}
