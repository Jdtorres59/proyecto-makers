import { crearProveedor } from "@makers/ai";
import { createClient } from "@supabase/supabase-js";
import { crearApp } from "./app";

const { SUPABASE_URL, SUPABASE_SECRET_KEY, TOPE_DIARIO_USD } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY (ver .env.example)");

// La llave secreta salta RLS: este cliente solo existe en el servidor.
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

export default crearApp({
  proveedor: crearProveedor(),
  topeDiarioUsd: Number(TOPE_DIARIO_USD ?? 0.5),

  // shortcut: una ida a Supabase por petición. Si pesa, validar el JWT localmente con las llaves públicas del proyecto.
  async verificarToken(token) {
    const { data } = await supabase.auth.getUser(token);
    return data.user?.id ?? null;
  },

  async gastoDeHoyUsd(usuarioId) {
    const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
    const { data, error } = await supabase
      .from("ai_runs")
      .select("cost_usd")
      .eq("user_id", usuarioId)
      .gte("created_at", `${hoy}T00:00:00-05:00`);
    if (error) throw error;
    return data.reduce((total, fila) => total + Number(fila.cost_usd), 0);
  },

  async registrar(registro) {
    const { data, error } = await supabase.from("ai_runs").insert(registro).select("id").single();
    if (error) throw error;
    return data.id;
  },
});
