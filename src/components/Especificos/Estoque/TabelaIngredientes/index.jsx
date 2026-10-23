import {
  formatCurrency,
  formatQuantity,
  formatDate,
  getSortIcon,
} from "../../../../utils";

const STATUS_STYLE = {
  Normal: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Baixo: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  Crítico: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  "Em Falta": "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function TabelaIngredientesEstoque({
  ingredientes,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) {
  const colunas = [
    { key: "nm_ingrediente", label: "Nome", hide: "" },
    { key: "nm_categoria", label: "Categoria", hide: "hidden sm:table-cell" },
    { key: "status_estoque", label: "Status", hide: "" },
    { key: "qt_atual", label: "Qtd. Atual", hide: "" },
    { key: "qt_minima", label: "Qtd. Mínima", hide: "hidden md:table-cell" },
    {
      key: "vl_custo_medio",
      label: "Custo Médio",
      hide: "hidden md:table-cell",
    },
    {
      key: "valor_total_estoque",
      label: "Val. Total",
      hide: "hidden lg:table-cell",
    },
    {
      key: "fornecedor_preferencial",
      label: "Fornecedor",
      hide: "hidden xl:table-cell",
    },
    {
      key: "ultima_movimentacao",
      label: "Últ. Mov.",
      hide: "hidden xl:table-cell",
    },
    { key: "ic_ativo", label: "Situação", hide: "hidden sm:table-cell" },
  ];

  return (
    <div className="bg-white dark:bg-surface-dark-elevated rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden mb-4 sm:mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-gray-600 dark:text-gray-300 min-w-[700px]">
          <thead className="bg-gray-50 dark:bg-surface-dark text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs uppercase font-semibold tracking-wide">
            <tr>
              {colunas.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer hover:text-primary whitespace-nowrap transition-colors select-none ${col.hide}`}
                  onClick={() => onSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {getSortIcon(col.key, sortField, sortDirection)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ingredientes.length > 0 ? (
              ingredientes.map((item) => (
                <tr
                  key={item.id_ingrediente}
                  className="border-b border-gray-100 dark:border-slate-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-surface-dark-hover cursor-pointer transition-colors"
                  onClick={() => onRowClick(item.id_ingrediente)}
                >
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                    {item.nm_ingrediente || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:table-cell">
                    {item.nm_categoria || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                        STATUS_STYLE[item.status_estoque] ||
                        "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {item.status_estoque || "-"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-800 dark:text-gray-100 font-medium whitespace-nowrap">
                    {formatQuantity(item.qt_atual || 0, item.sg_unidade || "")}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">
                    {formatQuantity(item.qt_minima || 0, item.sg_unidade || "")}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-800 dark:text-gray-100 whitespace-nowrap hidden md:table-cell">
                    {formatCurrency(item.vl_custo_medio || 0)}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap hidden lg:table-cell">
                    {formatCurrency(item.valor_total_estoque || 0)}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap hidden xl:table-cell">
                    {item.fornecedor_preferencial || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap hidden xl:table-cell">
                    {item.ultima_movimentacao
                      ? formatDate(item.ultima_movimentacao)
                      : "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        item.ic_ativo
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {item.ic_ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colunas.length}
                  className="px-3 sm:px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-xs sm:text-sm"
                >
                  Nenhum ingrediente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
