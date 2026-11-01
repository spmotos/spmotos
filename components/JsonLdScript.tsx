import { serializeJsonLd } from "@/lib/structured-data";

interface JsonLdScriptProps {
  data: Record<string, unknown>;
}

/** JSON-LD é dado, não código executável: `<script>` nativo, não `next/script`. */
export const JsonLdScript: React.FC<JsonLdScriptProps> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
  />
);
