import {
  formatCurrency,
  formatQuantity,
  formatDate,
  getSortIcon,
} from "../../../../utils";

export default function TabelaIngredientes({
  ingredientes,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) {
  const colunas = [
    { key: "nm_ingrediente", label: "Ingrediente", hide: "" },
    { key: "nm_categoria", label: "Categoria", hide: "" },
    { key: "qt_atual", label: "Quantidade", hide: "" },
    {
      key: "vl_custo_medio",
      label: "Custo Médio",
      hide: "hidden sm:table-cell",
    },
    {
      key: "fornecedor_preferencial",
      label: "Fornecedor",
      hide: "hidden md:table-cell",
    },
    {
      key: "dt_atualizacao",
      label: "Atualização",
      hide: "hidden lg:table-cell",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#181330] rounded-xl sm:rounded-2xl shadow-sm overflow-hidden mb-4 sm:mb-6">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <img
            src="./src/assets/icons/package-black.svg"
            alt="Ícone de estoque"
            className="w-5 h-5 sm:w-5 sm:h-5 dark:invert"
          />
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
            Estoque Atual
          </h2>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#0B071E] px-2 py-1 rounded-full">
          {ingredientes.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-150">
          <table className="w-full text-xs sm:text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-[#0B071E] text-gray-700 dark:text-gray-200 text-[10px] sm:text-xs uppercase font-medium">
              <tr>
                {colunas.map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 sm:px-6 py-2 sm:py-3 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 whitespace-nowrap transition-colors ${col.hide}`}
                    onClick={() => onSort(col.key)}
                  >
                    {col.label} {getSortIcon(col.key, sortField, sortDirection)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ingredientes.length > 0 ? (
                ingredientes.map((item) => (
                  <tr
                    key={item.id_ingrediente}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#1a1534] cursor-pointer transition-colors"
                    onClick={() => onRowClick(item.id_ingrediente)}
                  >
                    <td className="px-3 sm:px-6 py-2 sm:py-4 font-medium text-gray-800 dark:text-gray-100 text-xs sm:text-sm">
                      {item.nm_ingrediente || "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {item.nm_categoria || "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      {formatQuantity(
                        item.qt_atual || 0,
                        item.sg_unidade || "",
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden sm:table-cell text-gray-700 dark:text-gray-200">
                      {formatCurrency(item.vl_custo_medio || 0)}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden md:table-cell text-gray-600 dark:text-gray-300">
                      {item.fornecedor_preferencial || "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden lg:table-cell text-gray-500 dark:text-gray-400">
                      {formatDate(item.dt_atualizacao)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
                  >
                    Nenhum ingrediente cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}