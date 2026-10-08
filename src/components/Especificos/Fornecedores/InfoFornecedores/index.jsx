import { formatCurrency } from "../../../../utils";

export default function InfoFornecedores({
  name,
  cnpj,
  category,
  telefone,
  email,
  status,
  qtdPedidos,
  qtdEntregas,
  dtParceria,
  dtUltimoPedido,
  vlUltimoPedido,
  nota,
  prazo,
  vlTotalCompras,
}) {
  const vlUltimoPedidoF = formatCurrency(vlUltimoPedido);
  const vlTotalComprasF = formatCurrency(vlTotalCompras);

  const getLabelPrazo = (p) => {
    if (p >= 0 && p <= 24) return "Entrega Rápida";
    if (p <= 48) return "Entrega Mediana";
    if (p <= 72) return "Entrega Demorada";
    return "Sem Dados";
  };

  const getLabelNota = (n) => {
    if (n >= 0 && n <= 2) return "Péssimo Fornecedor";
    if (n <= 3) return "Fornecedor Mediano";
    if (n <= 4) return "Bom Fornecedor";
    if (n <= 5) return "Ótimo Fornecedor";
    return "Não Avaliado";
  };

  return (
    <>
      <div className="bg-white border-b border-gray-100 flex flex-col lg:flex-row gap-6 p-6 items-start lg:items-center justify-between">
        <div className="flex gap-5 items-start">
          <div className="bg-purple-400/20 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full shrink-0">
            <img
              src="./src/assets/icons/user-branco.svg"
              alt="Fornecedor"
              className="w-8 sm:w-10"
            />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-gray-800">
              {name || "..."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-400">CNPJ:</span>{" "}
                {cnpj || "..."}
              </p>
              <p>
                <span className="font-medium text-gray-400">Telefone:</span>{" "}
                {telefone || "..."}
              </p>
              <p>
                <span className="font-medium text-gray-400">Categoria:</span>{" "}
                {category || "..."}
              </p>
              <p>
                <span className="font-medium text-gray-400">Email:</span>{" "}
                {email || "..."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
              <div
                className={`py-1 px-3 rounded-lg ${
                  status
                    ? "bg-green-500/15 text-green-700"
                    : "bg-red-500/15 text-red-700"
                }`}
              >
                {status ? "Fornecedor Ativo" : "Fornecedor Inativo"}
              </div>
              <div className="bg-orange-500/15 text-orange-600 py-1 px-3 rounded-lg">
                {getLabelPrazo(prazo)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 sm:gap-8 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex flex-col items-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              {qtdPedidos || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Pedidos</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              {qtdEntregas || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Entregas</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm sm:text-base font-semibold text-gray-800 whitespace-nowrap">
              {dtParceria || "-"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Data de Início</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100">
          <div className="bg-purple-400/20 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
            <img
              src="./src/assets/icons/shopping-cart-roxo.svg"
              alt="Último Pedido"
              className="w-5 h-5"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <p className="text-xs text-gray-500">Último Pedido</p>
            <p className="text-sm font-semibold text-gray-800">
              {dtUltimoPedido || "Sem Dados"}
            </p>
            <p className="text-xs font-bold text-emerald-500">
              {vlUltimoPedido ? vlUltimoPedidoF : "Sem Dados"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100">
          <div className="bg-purple-400/20 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
            <img
              src="./src/assets/icons/star-roxo.svg"
              alt="Avaliação"
              className="w-5 h-5"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <p className="text-xs text-gray-500">Avaliação</p>
            <p className="text-sm font-semibold text-gray-800">
              {nota >= 0 ? `${nota} / 5.0` : "Não Avaliado"}
            </p>
            <p className="text-xs font-bold text-emerald-500">
              {getLabelNota(nota)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100">
          <div className="bg-purple-400/20 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
            <img
              src="./src/assets/icons/delivery-roxo.svg"
              alt="Prazo"
              className="w-5 h-5"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <p className="text-xs text-gray-500">Prazo Médio</p>
            <p className="text-sm font-semibold text-gray-800">
              {prazo >= 0 ? `${prazo}h` : "Sem Dados"}
            </p>
            <p className="text-xs font-bold text-emerald-500">
              {getLabelPrazo(prazo)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100">
          <div className="bg-purple-400/20 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
            <img
              src="./src/assets/icons/dollar-rounded-roxo.svg"
              alt="Total"
              className="w-5 h-5"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <p className="text-xs text-gray-500">Valor Total Compras</p>
            <p className="text-sm font-semibold text-gray-800">
              {vlTotalCompras ? vlTotalComprasF : 0}
            </p>
            <p className="text-xs font-bold text-emerald-500">
              Últimos 12 Meses
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
