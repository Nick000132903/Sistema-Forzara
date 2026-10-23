import { useEffect, useRef, useState } from "react";

export default function FiltroRelatorio({
  periodo,
  setPeriodo,
  periodos,
  filtroCategoria,
  setFiltroCategoria,
  filtroOrdenacao,
  setFiltroOrdenacao,
  categorias,
  onExportPDF,
  onExportCSV,
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectClass =
    "bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg py-2 px-3 h-10 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] cursor-pointer shadow-sm";

  return (
    <div className="sticky top-16 z-10 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 py-3 mb-4 bg-white/95 dark:bg-surface-dark/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 no-print">
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
        {/* Período — chips */}
        <div className="flex flex-wrap items-center gap-2">
          {periodos.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                periodo === p.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 dark:bg-surface-dark-hover text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#241b42]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className={selectClass}
          >
            <option value="todas">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filtroOrdenacao}
            onChange={(e) => setFiltroOrdenacao(e.target.value)}
            className={selectClass}
          >
            <option value="total_quantidade">Mais vendidos</option>
            <option value="total_valor">Maior faturamento</option>
            <option value="nm_produto">Nome (A-Z)</option>
          </select>

          <button
            onClick={onExportPDF}
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition-colors text-white flex items-center justify-center gap-2 shadow-sm hover:shadow-md px-4 h-10 rounded-lg text-sm font-medium"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
            </svg>
            PDF
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuAberto((v) => !v)}
              className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 shadow-sm px-4 h-10 rounded-lg text-sm font-medium transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5M12 15V3" />
              </svg>
              CSV
            </button>
            {menuAberto && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-30">
                <button
                  onClick={() => {
                    onExportCSV("resumo");
                    setMenuAberto(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                >
                  Resumo (KPIs)
                </button>
                <button
                  onClick={() => {
                    onExportCSV("mensal");
                    setMenuAberto(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                >
                  Série mensal
                </button>
                <button
                  onClick={() => {
                    onExportCSV("produtos");
                    setMenuAberto(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                >
                  Top produtos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
