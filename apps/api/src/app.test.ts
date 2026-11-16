import { proveedorSimulado, type RegistroIA } from "@makers/ai";
import type { Decision, DocumentoLeido, PerfilFinanciero, Progreso } from "@makers/core";
import { expect, test } from "vitest";
import { crearApp, type Datos } from "./app";

const DOC = "11111111-1111-4111-8111-111111111111";
const AJENO = "22222222-2222-4222-8222-222222222222";

/** Datos en memoria con dos usuarios: u1 tiene un PDF subido; el documento AJENO es de u2. */
function memoria() {
  const perfiles = new Map<string, PerfilFinanciero>();
  const lecturas = new Map<string, DocumentoLeido & { usuario: string }>();
  const progreso = new Map<string, Progreso>();
  const decisiones = new Map<string, Decision & { usuario: string }>();
  const archivos = new Map([
    [DOC, { usuario: "u1", adjunto: { mediaType: "application/pdf" as const, datos: Buffer.from("%PDF ficticio").toString("base64") }, subidoEn: "2026-11-15T15:00:00.000Z" }],
    [AJENO, { usuario: "u2", adjunto: { mediaType: "application/pdf" as const, datos: "" }, subidoEn: "2026-11-15T15:00:00.000Z" }],
  ]);
  const datos: Datos = {
    leerPerfil: async (u) => perfiles.get(u) ?? null,
    guardarPerfil: async (u, p) => void perfiles.set(u, p),
    leerArchivo: async (u, id) => {
      const a = archivos.get(id);
      return a?.usuario === u ? { adjunto: a.adjunto, subidoEn: a.subidoEn } : null;
    },
    leerLectura: async (u, id) => {
      const l = lecturas.get(id);
      if (l?.usuario !== u) return null;
      const { usuario, ...doc } = l;
      return doc;
    },
    guardarLectura: async (u, doc) => void lecturas.set(doc.id, { ...doc, usuario: u }),
    leerProgreso: async (u) => progreso.get(u) ?? { leccionesTerminadas: [], medallas: [] },
    sumarProgreso: async (u, p) => {
      const antes = progreso.get(u) ?? { leccionesTerminadas: [], medallas: [] };
      progreso.set(u, {
        leccionesTerminadas: [...new Set([...antes.leccionesTerminadas, ...p.leccionesTerminadas])],
        medallas: [...new Set([...antes.medallas, ...p.medallas])],
      });
    },
    crearDecision: async (u, { pregunta, documentos }) => {
      const decision: Decision = { id: crypto.randomUUID(), pregunta, documentos, caminoElegido: null, motivos: [], nota: null, creadaEn: "2026-11-15T15:00:00.000Z" };
      decisiones.set(decision.id, { ...decision, usuario: u });
      return decision;
    },
    leerDecision: async (u, id) => {
      const x = decisiones.get(id);
      if (x?.usuario !== u) return null;
      const { usuario, ...decision } = x;
      return decision;
    },
    cerrarDecision: async (u, id, { caminoElegido, motivos, nota, documentos }) => {
      const x = decisiones.get(id);
      if (x?.usuario !== u) return null;
      const { usuario, ...decision } = x;
      const cerrada = { ...decision, caminoElegido, motivos, nota, documentos: [...new Set([...decision.documentos, ...documentos])] };
      decisiones.set(id, { ...cerrada, usuario });
      return cerrada;
    },
    borrarTodo: async (u) => {
      perfiles.delete(u);
      progreso.delete(u);
      for (const [id, l] of lecturas) if (l.usuario === u) lecturas.delete(id);
      for (const [id, x] of decisiones) if (x.usuario === u) decisiones.delete(id);
    },
  };
  return { datos, perfiles, lecturas };
}

function preparar(gastado = 0) {
  const registros: RegistroIA[] = [];
  const mem = memoria();
  const app = crearApp({
    proveedor: proveedorSimulado(),
    topeDiarioUsd: 0.5,
    verificarToken: async (token) => ({ bueno: "u1", otro: "u2" })[token] ?? null,
    gastoDeHoyUsd: async () => gastado,
    registrar: async (r) => `run_${registros.push(r)}`,
    datos: mem.datos,
    hoy: () => "2026-11-15",
  });
  const pedir = (ruta: string, metodo = "GET", cuerpo?: unknown, token = "bueno") =>
    app.request(ruta, {
      method: metodo,
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      ...(cuerpo !== undefined && { body: JSON.stringify(cuerpo) }),
    });
  return { app, pedir, registros, ...mem };
}

const ndjson = async (r: Response) => (await r.text()).trim().split("\n").map((linea) => JSON.parse(linea));

const valentina: PerfilFinanciero = {
  nombre: "Valentina", empresa: "Logística Andina S.A.S.", cargo: "Analista de compras", salario: 3_600_000, diaDePago: 30, fechaIngreso: "2026-10-01",
  deudas: [{ id: "celular", tipo: "celular", nombre: "Celular", cuotaMensual: 186_000, cuotasRestantes: 3, saldo: null, tasaEA: null, diaDePago: 5 }],
  meta: "Irme a vivir sola", vivienda: "familia",
};

test("health es público; lo demás exige sesión", async () => {
  const { app, pedir } = preparar();
  expect((await app.request("/health")).status).toBe(200);
  for (const [ruta, metodo] of [["/me", "GET"], ["/perfil", "GET"], ["/eventos", "GET"], ["/yo", "DELETE"], [`/documentos/${DOC}/leer`, "POST"]] as const) {
    expect((await pedir(ruta, metodo, undefined, "")).status, ruta).toBe(401);
  }
  expect((await pedir("/ai/run", "POST", { agente: "base", mensaje: "hola" }, "malo")).status).toBe(401);
});

test("valida la solicitud y el agente", async () => {
  const { pedir } = preparar();
  expect((await pedir("/ai/run", "POST", { agente: "base", mensaje: "" })).status).toBe(400);
  expect((await pedir("/ai/run", "POST", { agente: "no_existe", mensaje: "hola" })).status).toBe(404);
  // Los agentes con salida estructurada solo se usan desde su ruta.
  expect((await pedir("/ai/run", "POST", { agente: "leer_documento", mensaje: "hola" })).status).toBe(404);
});

test("corta cuando el usuario llegó al tope de gasto del día, en todas las rutas con IA", async () => {
  const { pedir, registros } = preparar(0.5);
  expect((await pedir("/ai/run", "POST", { agente: "base", mensaje: "hola" })).status).toBe(429);
  expect((await pedir(`/documentos/${DOC}/leer`, "POST")).status).toBe(429);
  expect((await pedir(`/documentos/${DOC}/explicar`, "POST")).status).toBe(429);
  expect(registros).toHaveLength(0);
});

test("responde en streaming y registra la ejecución a nombre del usuario", async () => {
  const { pedir, registros } = preparar();
  const respuesta = await pedir("/ai/run", "POST", { agente: "base", mensaje: "¿Cuánto es el 4% de $3.600.000?" });
  expect(respuesta.status).toBe(200);
  const eventos = await ndjson(respuesta);
  expect(eventos.at(-1)).toEqual({ tipo: "fin", runId: "run_1", estado: "ok" });
  expect(eventos).toContainEqual({ tipo: "herramienta", nombre: "calcular_porcentaje" });
  expect(eventos.filter((e) => e.tipo === "texto").map((e) => e.delta).join("")).toContain("$144.000");
  expect(registros[0]).toMatchObject({ user_id: "u1", agent: "base", status: "ok" });
});

test("perfil: vacío al empezar, se guarda validado y alimenta lo que viene", async () => {
  const { pedir } = preparar();
  expect(await (await pedir("/perfil")).json()).toMatchObject({ salario: null, deudas: [] });
  expect((await pedir("/perfil", "PUT", { ...valentina, salario: 3_600_000.5 })).status).toBe(400);
  expect((await pedir("/perfil", "PUT", valentina)).status).toBe(200);
  expect(await (await pedir("/perfil")).json()).toEqual(valentina);
  const eventos = await (await pedir("/eventos")).json();
  expect(eventos.map((e: { tipo: string; fecha: string }) => `${e.fecha} ${e.tipo}`)).toEqual([
    "2026-11-30 sueldo", "2026-12-05 cuota", "2026-12-20 prima", "2027-01-31 intereses_cesantias", "2027-02-14 cesantias",
  ]);
  // Otro usuario no ve el perfil de u1.
  expect(await (await pedir("/perfil", "GET", undefined, "otro")).json()).toMatchObject({ salario: null });
});

test("leer y explicar un documento ya subido", async () => {
  const { pedir, registros } = preparar();
  expect((await pedir("/documentos/no-es-uuid/leer", "POST")).status).toBe(400);
  expect((await pedir(`/documentos/${AJENO}/leer`, "POST")).status).toBe(404);
  expect((await pedir(`/documentos/${DOC}/explicar`, "POST")).status).toBe(404);

  const leido = await (await pedir(`/documentos/${DOC}/leer`, "POST")).json();
  expect(leido).toMatchObject({ id: DOC, tipo: "desprendible", subidoEn: "2026-11-15T15:00:00.000Z" });
  expect(leido.renglones.every((r: { explicacion: unknown }) => r.explicacion === null)).toBe(true);
  expect(await (await pedir(`/documentos/${DOC}`)).json()).toEqual(leido);

  const explicado = await (await pedir(`/documentos/${DOC}/explicar`, "POST")).json();
  expect(explicado.renglones.find((r: { clave: string }) => r.clave === "salud").explicacion).toContain("3312000");
  expect(registros.map((r) => r.agent)).toEqual(["leer_documento", "explicar_documento"]);
  // El otro usuario no lo ve.
  expect((await pedir(`/documentos/${DOC}`, "GET", undefined, "otro")).status).toBe(404);
});

test("si la lectura falla, responde 502 y no guarda nada", async () => {
  const { datos, lecturas } = memoria();
  const roto = crearApp({
    proveedor: { ...proveedorSimulado(), turno: () => Promise.reject(new Error("sin red")) },
    topeDiarioUsd: 0.5, verificarToken: async () => "u1", gastoDeHoyUsd: async () => 0, registrar: async () => null, hoy: () => "2026-11-15",
    datos,
  });
  expect((await roto.request(`/documentos/${DOC}/leer`, { method: "POST", headers: { Authorization: "Bearer x" } })).status).toBe(502);
  expect(lecturas.size).toBe(0);
});

test("progreso y medallas se suman sin perder lo anterior", async () => {
  const { pedir } = preparar();
  await pedir("/progreso", "POST", { leccionesTerminadas: ["E1-1"], medallas: [] });
  const progreso = await (await pedir("/progreso", "POST", { leccionesTerminadas: ["E1-2", "E1-1"], medallas: ["E1"] })).json();
  expect(progreso).toEqual({ leccionesTerminadas: ["E1-1", "E1-2"], medallas: ["E1"] });
  expect((await pedir("/progreso", "POST", { leccionesTerminadas: "E1" })).status).toBe(400);
});

test("una decisión: se crea, se conversa con contexto y la cierra la persona", async () => {
  const { pedir, registros } = preparar();
  await pedir("/perfil", "PUT", valentina);
  await pedir(`/documentos/${DOC}/leer`, "POST");
  const creada = await pedir("/decisiones", "POST", { pregunta: "¿Pago el mínimo o pido un préstamo?" });
  expect(creada.status).toBe(201);
  const decision = await creada.json();

  const eventos = await ndjson(
    await pedir(`/decisiones/${decision.id}/conversar`, "POST", {
      mensaje: "Debo $2.400.000 en la tarjeta al 26,5% y me ofrecen un préstamo al 18,9%.",
      documentos: [DOC],
    }),
  );
  expect(eventos.at(-1)).toMatchObject({ tipo: "fin", estado: "ok" });
  expect(eventos.filter((e) => e.tipo === "herramienta").map((e) => e.nombre)).toEqual(["costo_tarjeta", "costo_pago_minimo", "costo_prestamo"]);
  expect(registros.at(-1)).toMatchObject({ agent: "acompanar_decision", user_id: "u1" });

  expect((await pedir(`/decisiones/${decision.id}/cerrar`, "POST", { caminoElegido: "prestamo", motivos: [], nota: null }, "otro")).status).toBe(404);
  const cerrada = await (await pedir(`/decisiones/${decision.id}/cerrar`, "POST", { caminoElegido: "prestamo", motivos: ["Comparo el total"], nota: null, documentos: [DOC] })).json();
  expect(cerrada).toMatchObject({ caminoElegido: "prestamo", motivos: ["Comparo el total"], documentos: [DOC] });
  expect((await pedir(`/decisiones/${decision.id}/conversar`, "POST", { mensaje: "¿y ahora?" })).status).toBe(409);
});

test("borrar todo deja a Luca sin saber nada de la persona", async () => {
  const { pedir } = preparar();
  await pedir("/perfil", "PUT", valentina);
  await pedir(`/documentos/${DOC}/leer`, "POST");
  await pedir("/progreso", "POST", { leccionesTerminadas: ["E1-1"], medallas: ["E1"] });
  expect((await pedir("/yo", "DELETE")).status).toBe(204);
  expect(await (await pedir("/perfil")).json()).toMatchObject({ salario: null });
  expect(await (await pedir("/eventos")).json()).toEqual([]);
  expect(await (await pedir("/progreso")).json()).toEqual({ leccionesTerminadas: [], medallas: [] });
  expect((await pedir(`/documentos/${DOC}`)).status).toBe(404);
});

test("CORS: solo los orígenes permitidos, y la consulta previa no exige sesión", async () => {
  const { app } = preparar();
  const previa = (origen: string, a = app) =>
    a.request("/perfil", { method: "OPTIONS", headers: { Origin: origen, "Access-Control-Request-Method": "PUT", "Access-Control-Request-Headers": "authorization,content-type" } });
  const local = await previa("http://localhost:8081");
  expect(local.status).toBe(204);
  expect(local.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:8081");
  expect(local.headers.get("Access-Control-Allow-Headers")?.toLowerCase()).toContain("authorization");
  expect((await previa("https://intruso.example")).headers.get("Access-Control-Allow-Origin")).toBeNull();

  const web = crearApp({
    proveedor: proveedorSimulado(), topeDiarioUsd: 0.5, verificarToken: async () => "u1", gastoDeHoyUsd: async () => 0, registrar: async () => null,
    hoy: () => "2026-11-15", datos: memoria().datos, origenesPermitidos: ["https://luca.example"],
  });
  expect((await previa("https://luca.example", web)).headers.get("Access-Control-Allow-Origin")).toBe("https://luca.example");
  expect((await previa("http://localhost:8081", web)).headers.get("Access-Control-Allow-Origin")).toBeNull();
  // Las respuestas reales también llevan el encabezado, incluido un 401.
  const r = await web.request("/me", { headers: { Origin: "https://luca.example" } });
  expect(r.status).toBe(401);
  expect(r.headers.get("Access-Control-Allow-Origin")).toBe("https://luca.example");
});
