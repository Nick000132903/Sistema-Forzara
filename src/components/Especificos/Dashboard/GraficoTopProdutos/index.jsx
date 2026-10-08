import { formatCurrency, formatQuantity } from "../../../../utils";

export default function GraficoTopProdutos({ produtos }) {
  if (!produtos || produtos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200 dark:border-slate-700">
            <th className="text-center p-2.5 text-xs text-gray-500 dark:text-gray-400 font-normal">
              #
            </th>
            <th className="text-center p-2.5 text-xs text-gray-500 dark:text-gray-400 font-normal">
              Produto
            </th>
            <th className="text-center p-2.5 text-xs text-gray-500 dark:text-gray-400 font-normal">
              Saídas
            </th>
            <th className="text-center p-2.5 text-xs text-gray-500 dark:text-gray-400 font-normal">
              Valor Total
            </th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p, i) => (
            <tr
              key={p.id_produto || i}
              className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-[#1a1534] transition-colors"
            >
              <td className="text-center p-2.5 text-sm text-gray-600 dark:text-gray-300">
                {i + 1}
              </td>
              <td className="text-center p-2.5 text-sm font-medium text-gray-800 dark:text-gray-100">
                {p.nm_produto || "-"}
              </td>
              <td className="text-center p-2.5 text-sm text-gray-700 dark:text-gray-200">
                {formatQuantity(p.total_quantidade || 0)}
              </td>
              <td className="text-center p-2.5 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                {formatCurrency(p.total_valor || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}