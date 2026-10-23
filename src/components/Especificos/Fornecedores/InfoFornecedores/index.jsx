import { formatCurrency } from "../../../../utils";
import { formatCNPJ } from "../../../../utils/validators";

export default function InfoFornecedores({
  foto,
  name,
  cnpj,
  condicaoPagamento,
  telefone,
  email,
  status,
  qtdPedidos,
  qtdEntregas,
  dtParceria,
  dtUltimoPedido,
  vlUltimoPedido,
  prazo,
  vlTotalCompras,
  onEdit,
}) {
  const getLabelPrazo = (p) => {
    if (p > 0 && p <= 24) return "Entrega Rápida";
    if (p <= 48) return "Entrega Mediana";
    if (p <= 72) return "Entrega Demorada";
    return "Sem Dados";
  };

  const semHistorico = qtdPedidos === 0 && qtdEntregas === 0;

  return (
    <>
      <div className="bg-white dark:bg-surface-dark-elevated border-b border-gray-100 dark:border-slate-800 flex flex-col lg:flex-row gap-6 p-6 items-start lg:items-center justify-between">
        <div className="flex gap-5 items-start min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-400/20 flex items-center justify-center overflow-hidden shrink-0 border-2 border-purple-200 dark:border-purple-800">
            {foto ? (
              <img
                src={foto}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/icons/user-branco.svg"
                alt=""
                className="w-8 sm:w-10 opacity-60"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                {name || "—"}
              </p>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  title="Editar fornecedor"
                >
                  <img
                    src="/icons/settings-roxo.svg"
                    alt=""
                    className="w-3.5 h-3.5"
                  />
                  Editar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium text-gray-400">CNPJ:</span>{" "}
                {cnpj && cnpj !== "—" ? formatCNPJ(cnpj) : "—"}
              </p>
              <p>
                <span className="font-medium text-gray-400">Telefone:</span>{" "}
                {telefone}
              </p>
              <p>
                <span className="font-medium text-gray-400">
                  Cond. Pagamento:
                </span>{" "}
                {condicaoPagamento}
              </p>
              <p>
                <span className="font-medium text-gray-400">E-mail:</span>{" "}
                {email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
              <div
                className={`py-1 px-3 rounded-lg ${
                  status
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-500/15 text-red-700 dark:text-red-400"
                }`}
              >
                {status ? "Fornecedor Ativo" : "Fornecedor Inativo"}
              </div>
              <div className="bg-orange-500/15 text-orange-600 dark:text-orange-400 py-1 px-3 rounded-lg">
                {getLabelPrazo(prazo)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 sm:gap-8 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex flex-col items-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
              {qtdPedidos}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Pedidos
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
              {qtdEntregas}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Entregas
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              {dtParceria || "—"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Data de Início
            </p>
          </div>
        </div>
      </div>

      {semHistorico && (
        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            🌱 <strong>Fornecedor novo.</strong> Ainda não há compras
            registradas. Quando você registrar uma entrada vinculada a este
            fornecedor, os dados abaixo vão sendo preenchidos automaticamente.
          </p>
        </div>
      )}

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <MiniKPI
          icon="shopping-cart-roxo"
          titulo="Último Pedido"
          valor={dtUltimoPedido || "—"}
          sub={
            vlUltimoPedido ? formatCurrency(vlUltimoPedido) : "Sem histórico"
          }
        />
        <MiniKPI
          icon="delivery-roxo"
          titulo="Prazo Padrão"
          valor={prazo > 0 ? `${prazo}h` : "—"}
          sub={getLabelPrazo(prazo)}
        />
        <MiniKPI
          icon="dollar-rounded-roxo"
          titulo="Total Comprado"
          valor={formatCurrency(vlTotalCompras || 0)}
          sub="Histórico completo"
        />
      </div>
    </>
  );
}

function MiniKPI({ icon, titulo, valor, sub }) {
  return (
    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl flex items-center gap-3 border border-gray-100 dark:border-slate-800">
      <div className="bg-purple-400/20 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
        <img src={`/icons/${icon}.svg`} alt="" className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-0.5 text-left min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{titulo}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
          {valor}
        </p>
        <p className="text-xs font-bold text-emerald-500 truncate">{sub}</p>
      </div>
    </div>
  );
}
