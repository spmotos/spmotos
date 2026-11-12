import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/** Sem R2: o estoque é buscado no Click Garage a cada visita, sem cache entre requisições. */
export default defineCloudflareConfig({});
