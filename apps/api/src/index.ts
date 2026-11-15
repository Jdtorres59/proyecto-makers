import { type Adjunto, crearProveedor } from "@makers/ai";
import { hoyEnColombia } from "@makers/conocimiento";
import { type Decision, type DocumentoLeido, Renglon } from "@makers/core";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { crearApp, type Datos } from "./app";

const { SUPABASE_URL, SUPABASE_SECRET_KEY, TOPE_DIARIO_USD } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY (ver .env.example)");

// La llave secreta salta RLS: este cliente solo existe en el servidor. Por eso cada consulta filtra por user_id.
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

/** Lanza el error de Supabase si lo hay; si no, devuelve los datos (null solo en consultas de una fila que puede no existir). */
function o<T>({ data, error }: { data: T; error: unknown }): T {
  if (error) throw error;
  return data;
}
const lista = <T>(r: { data: T[] | null; error: unknown }): T[] => o(r) ?? [];

// Postgres devuelve "2026-11-15 15:00:00.123+00"; el contrato pide ISO con Z.
const iso = (fecha: string) => new Date(fecha).toISOString();
const MIMES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;

type FilaDecision = { id: string; question: string; document_ids: string[]; chosen_path: string | null; reasons: string[]; note: string | null; created_at: string };
const decision = (f: FilaDecision): Decision => ({
  id: f.id,
  pregunta: f.question,
  documentos: f.document_ids,
  caminoElegido: f.chosen_path,
  motivos: f.reasons,
  nota: f.note,
  creadaEn: iso(f.created_at),
});

const datos: Datos = {
  async leerPerfil(usuarioId) {
    const fila = o(await supabase.from("financial_profiles").select("*").eq("user_id", usuarioId).maybeSingle());
    const deudas = lista(await supabase.from("debts").select("*").eq("user_id", usuarioId).order("created_at"));
    if (!fila && deudas.length === 0) return null;
    return {
      nombre: fila?.name ?? null,
      empresa: fila?.company ?? null,
      cargo: fila?.job_title ?? null,
      salario: fila?.salary ?? null,
      diaDePago: fila?.pay_day ?? null,
      fechaIngreso: fila?.start_date ?? null,
      meta: fila?.goal ?? null,
      vivienda: fila?.housing ?? null,
      deudas: deudas.map((d) => ({
        id: d.id,
        tipo: d.kind,
        nombre: d.name,
        cuotaMensual: d.monthly_payment,
        cuotasRestantes: d.remaining_payments,
        saldo: d.balance,
        tasaEA: d.annual_rate === null ? null : Number(d.annual_rate),
        diaDePago: d.pay_day,
      })),
    };
  },

  // shortcut: tres llamadas sin transacción; si falla a mitad, la app reintenta el PUT completo. Pasar a una función SQL si molesta.
  async guardarPerfil(usuarioId, p) {
    o(
      await supabase.from("financial_profiles").upsert({
        user_id: usuarioId,
        name: p.nombre,
        company: p.empresa,
        job_title: p.cargo,
        salary: p.salario,
        pay_day: p.diaDePago,
        start_date: p.fechaIngreso,
        goal: p.meta,
        housing: p.vivienda,
        updated_at: new Date().toISOString(),
      }),
    );
    o(await supabase.from("debts").delete().eq("user_id", usuarioId));
    if (p.deudas.length) {
      o(
        await supabase.from("debts").insert(
          p.deudas.map((d) => ({
            user_id: usuarioId,
            id: d.id,
            kind: d.tipo,
            name: d.nombre,
            monthly_payment: d.cuotaMensual,
            remaining_payments: d.cuotasRestantes,
            balance: d.saldo,
            annual_rate: d.tasaEA,
            pay_day: d.diaDePago ?? null,
          })),
        ),
      );
    }
  },

  async leerArchivo(usuarioId, documentoId) {
    const fila = o(await supabase.from("documents").select("storage_path, mime_type, created_at").eq("id", documentoId).eq("user_id", usuarioId).maybeSingle());
    if (!fila) return null;
    const mediaType = MIMES.find((m) => m === fila.mime_type);
    if (!mediaType) return null; // Solo PDF e imágenes: es lo que el modelo sabe leer.
    const archivo = o(await supabase.storage.from("documentos").download(fila.storage_path));
    if (!archivo) return null;
    const adjunto: Adjunto = { mediaType, datos: Buffer.from(await archivo.arrayBuffer()).toString("base64") };
    return { adjunto, subidoEn: iso(fila.created_at) };
  },

  async leerLectura(usuarioId, documentoId) {
    const fila = o(
      await supabase.from("document_readings").select("*, documents(created_at)").eq("document_id", documentoId).eq("user_id", usuarioId).maybeSingle(),
    );
    if (!fila) return null;
    const documento: DocumentoLeido = {
      id: fila.document_id,
      tipo: fila.kind,
      titulo: fila.title,
      periodo: fila.period,
      subidoEn: iso(fila.documents.created_at),
      renglones: z.array(Renglon).parse(fila.lines),
    };
    return documento;
  },

  async guardarLectura(usuarioId, d, runId) {
    o(
      await supabase.from("document_readings").upsert({
        document_id: d.id,
        user_id: usuarioId,
        kind: d.tipo,
        title: d.titulo,
        period: d.periodo,
        lines: d.renglones,
        ai_run_id: runId,
        updated_at: new Date().toISOString(),
      }),
    );
  },

  async leerProgreso(usuarioId) {
    const lecciones = lista(await supabase.from("lesson_progress").select("lesson_id").eq("user_id", usuarioId).order("completed_at"));
    const medallas = lista(await supabase.from("medals").select("module_id").eq("user_id", usuarioId).order("earned_at"));
    return { leccionesTerminadas: lecciones.map((f) => f.lesson_id), medallas: medallas.map((f) => f.module_id) };
  },

  async sumarProgreso(usuarioId, p) {
    const sinRepetir = { onConflict: "user_id,lesson_id", ignoreDuplicates: true };
    if (p.leccionesTerminadas.length) {
      o(await supabase.from("lesson_progress").upsert(p.leccionesTerminadas.map((lesson_id) => ({ user_id: usuarioId, lesson_id })), sinRepetir));
    }
    if (p.medallas.length) {
      o(
        await supabase
          .from("medals")
          .upsert(p.medallas.map((module_id) => ({ user_id: usuarioId, module_id })), { onConflict: "user_id,module_id", ignoreDuplicates: true }),
      );
    }
  },

  async crearDecision(usuarioId, { pregunta, documentos }) {
    const fila = o(await supabase.from("decisions").insert({ user_id: usuarioId, question: pregunta, document_ids: documentos }).select().single());
    if (!fila) throw new Error("Supabase no devolvió la decisión creada");
    return decision(fila);
  },

  async leerDecision(usuarioId, id) {
    const fila = o(await supabase.from("decisions").select().eq("id", id).eq("user_id", usuarioId).maybeSingle());
    return fila ? decision(fila) : null;
  },

  async cerrarDecision(usuarioId, id, { caminoElegido, motivos, nota, documentos }) {
    const antes = await datos.leerDecision(usuarioId, id);
    if (!antes) return null;
    const fila = o(
      await supabase
        .from("decisions")
        .update({
          chosen_path: caminoElegido,
          reasons: motivos,
          note: nota,
          document_ids: [...new Set([...antes.documentos, ...documentos])],
          closed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", usuarioId)
        .select()
        .single(),
    );
    return fila ? decision(fila) : null;
  },

  async borrarTodo(usuarioId) {
    // Primero los archivos: si se borrara antes la fila de documents, se perdería la ruta del archivo.
    const archivos = lista(await supabase.from("documents").select("storage_path").eq("user_id", usuarioId));
    if (archivos.length) o(await supabase.storage.from("documentos").remove(archivos.map((a) => a.storage_path)));
    // documents arrastra document_readings; ai_runs arrastra ai_feedback. Se conservan la cuenta y las autorizaciones (consents).
    for (const tabla of ["documents", "debts", "financial_profiles", "lesson_progress", "medals", "decisions", "ai_runs", "events"]) {
      o(await supabase.from(tabla).delete().eq("user_id", usuarioId));
    }
  },
};

export default crearApp({
  proveedor: crearProveedor(),
  topeDiarioUsd: Number(TOPE_DIARIO_USD ?? 0.5),
  datos,
  hoy: hoyEnColombia,

  // shortcut: una ida a Supabase por petición. Si pesa, validar el JWT localmente con las llaves públicas del proyecto.
  async verificarToken(token) {
    const { data } = await supabase.auth.getUser(token);
    return data.user?.id ?? null;
  },

  async gastoDeHoyUsd(usuarioId) {
    const { data, error } = await supabase
      .from("ai_runs")
      .select("cost_usd")
      .eq("user_id", usuarioId)
      .gte("created_at", `${hoyEnColombia()}T00:00:00-05:00`);
    if (error) throw error;
    return data.reduce((total, fila) => total + Number(fila.cost_usd), 0);
  },

  async registrar(registro) {
    const { data, error } = await supabase.from("ai_runs").insert(registro).select("id").single();
    if (error) throw error;
    return data.id;
  },
});
