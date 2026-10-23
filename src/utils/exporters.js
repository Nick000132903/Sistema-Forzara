
const escapeCell = (v) => {
  if (v === null || v === undefined) return "";
  return `"${String(v).replace(/"/g, '""')}"`;
};

/**
 * Gera e baixa um CSV compatível com Excel pt-BR (separador ; e BOM UTF-8).
 * @param {string} filename - ex: "relatorio-cmv-2026-10-22.csv"
 * @param {Array<Array<any>>} rows - primeira linha é o cabeçalho
 */
export function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map(escapeCell).join(";")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Abre o diálogo de impressão do navegador.
 * O CSS de @media print (src/index.css) já esconde tudo exceto `#print-area`.
 */
export function printReport() {
  window.print();
}

/**
 * Monta nome de arquivo padronizado.
 * @example buildFilename("cmv", "2026-01-01", "2026-10-22")
 * // "cmv-2026-01-01_a_2026-10-22.csv"
 */
export function buildFilename(base, inicio, fim, ext = "csv") {
  const ini = inicio ? String(inicio).slice(0, 10) : "inicio";
  const f = fim ? String(fim).slice(0, 10) : "hoje";
  return `${base}-${ini}_a_${f}.${ext}`;
}