import { formatCurrency } from "../../../../utils";

export default function TabelaRelatorio({ produtos }) {
  return (
    <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 lg:col-span-2 overflow-hidden">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-base">
        Relatório de produtos
      </h2>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                Produto
              </th>
              <th className="text-left py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                Categoria
              </th>
              <th className="text-center py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                Saídas
              </th>
              <th className="text-center py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                Faturamento
              </th>
              <th className="text-center py-3 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                Pedidos
              </th>
            </tr>
          </thead>
          <tbody>
            {produtos.length > 0 ? (
              produtos.map((item) => (
                <tr
                  key={item.id_produto || item.nm_produto}
                  className="border-b border-gray-100 dark:border-slate-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                >
                  <td className="py-3 text-gray-800 dark:text-gray-100 font-medium">
                    {item.nm_produto || "-"}
                  </td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {item.nm_categoria || "-"}
                  </td>
                  <td className="py-3 text-center text-gray-800 dark:text-gray-100 font-medium">
                    {Number(item.total_quantidade || 0).toFixed(0)}
                  </td>
                  <td className="py-3 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatCurrency(item.total_valor || 0)}
                  </td>
                  <td className="py-3 text-center text-gray-800 dark:text-gray-100">
                    {item.total_pedidos || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm"
                >
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
