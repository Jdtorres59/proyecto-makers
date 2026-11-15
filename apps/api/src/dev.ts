import { serve } from "@hono/node-server";
import app from "./index";

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => console.log(`API en http://localhost:${port}`));
