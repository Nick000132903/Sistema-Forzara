import { formatCurrency } from "../../../../utils";

export default function TabelaRelatorio({ produtos }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 overflow-hidden">
      <h2 className="font-semibold text-gray-800 mb-4 text-base">
        Relatório de Saídas
      </h2>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm min-w-140">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                Produto
              </th>
              <th className="text-left py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                Categoria
              </th>
              <th className="text-center py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                Saídas
              </th>
              <th className="text-center py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                Faturamento
              </th>
              <th className="text-center py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                Pedidos
              </th>
            </tr>
          </thead>
          <tbody>
            {produtos.length > 0 ? (
              produtos.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors"
                >
                  <td className="py-3 text-gray-800 font-medium">
                    {item.nm_produto || "-"}
                  </td>
                  <td className="py-3 text-gray-500 text-xs">
                    {item.nm_categoria || "-"}
                  </td>
                  <td className="py-3 text-center text-gray-800 font-medium">
                    {(item.total_quantidade || 0).toFixed(0)}
                  </td>
                  <td className="py-3 text-center text-emerald-600 font-semibold">
                    {formatCurrency(item.total_valor)}
                  </td>
                  <td className="py-3 text-center text-gray-800">
                    {item.total_pedidos || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-gray-400 text-sm"
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
