import {
  formatCurrency,
  formatQuantity,
  formatDate,
  getSortIcon,
} from "../../../../utils";

export default function TabelaIngredientesEstoque({
  ingredientes,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
}) {
  const colunas = [
    { key: "nm_ingrediente", label: "Nome" },
    { key: "nm_categoria", label: "Categoria" },
    { key: "status_estoque", label: "Status" },
    { key: "qt_atual", label: "Qtd. Atual" },
    { key: "sg_unidade", label: "Un." },
    { key: "qt_minima", label: "Qtd. Mínima" },
    { key: "qt_ideal", label: "Meta" },
    { key: "vl_custo_medio", label: "Custo Médio" },
    { key: "valor_total_estoque", label: "Val. Total" },
    { key: "classificacao", label: "Classificação" },
    { key: "fornecedor_preferencial", label: "Fornecedor" },
    { key: "ultima_movimentacao", label: "Últ. Movimentação" },
    { key: "dt_atualizacao", label: "Atualização" },
    { key: "ic_ativo", label: "Ativo" },
  ];

  const statusStyle = {
    Normal: "bg-green-500/15 text-green-700",
    Baixo: "bg-yellow-500/15 text-yellow-700",
    Crítico: "bg-orange-500/15 text-orange-700",
    "Em Falta": "bg-red-500/15 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-gray-600 min-w-275">
          <thead className="bg-gray-50 text-gray-600 text-[10px] sm:text-xs uppercase font-semibold tracking-wide">
            <tr>
              {colunas.map((col) => (
                <th
                  key={col.key}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer hover:text-purple-600 whitespace-nowrap transition-colors select-none"
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
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 cursor-pointer transition-colors"
                  onClick={() => onRowClick(item.id_ingrediente)}
                >
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-gray-800 whitespace-nowrap">
                    {item.nm_ingrediente || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 whitespace-nowrap">
                    {item.nm_categoria || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                        statusStyle[item.status_estoque] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status_estoque || "-"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-800 font-medium whitespace-nowrap">
                    {formatQuantity(item.qt_atual || 0, item.sg_unidade || "")}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500">
                    {item.sg_unidade || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 whitespace-nowrap">
                    {formatQuantity(item.qt_minima || 0, item.sg_unidade || "")}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 whitespace-nowrap">
                    {formatQuantity(item.qt_ideal || 0, item.sg_unidade || "")}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-800 whitespace-nowrap">
                    {formatCurrency(item.vl_custo_medio || 0)}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-emerald-600 font-semibold whitespace-nowrap">
                    {formatCurrency(item.valor_total_estoque || 0)}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 whitespace-nowrap">
                    {item.classificacao || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 whitespace-nowrap">
                    {item.fornecedor_preferencial || "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 whitespace-nowrap">
                    {item.ultima_movimentacao
                      ? formatDate(item.ultima_movimentacao)
                      : "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 whitespace-nowrap">
                    {item.dt_atualizacao
                      ? formatDate(item.dt_atualizacao)
                      : "-"}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        item.ic_ativo
                          ? "bg-green-500/15 text-green-700"
                          : "bg-gray-200 text-gray-600"
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
                  className="px-3 sm:px-4 py-8 text-center text-gray-400 text-xs sm:text-sm"
                >
                  Nenhum ingrediente cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
