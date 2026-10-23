import { formatCurrency, formatQuantity, formatDate } from "../../../../utils";

const STATUS_STYLE = {
  Normal: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Baixo: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  Crítico: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  "Em Falta": "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function DetalheIngrediente({
  ingrediente,
  onClose,
  onMovimentar,
}) {
  if (!ingrediente) return null;

  const Campo = ({ label, valor }) => (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-800 dark:text-gray-100">{valor ?? "-"}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-surface-dark-elevated w-full max-w-md h-full shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-surface-dark-elevated border-b border-gray-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {ingrediente.nm_ingrediente || "Ingrediente"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {ingrediente.nm_categoria || "Sem categoria"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer transition-colors active:scale-90 ml-2"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                STATUS_STYLE[ingrediente.status_estoque] ||
                "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {ingrediente.status_estoque || "Status desconhecido"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo
              label="Qtd. Atual"
              valor={formatQuantity(
                ingrediente.qt_atual || 0,
                ingrediente.sg_unidade || "",
              )}
            />
            <Campo
              label="Qtd. Mínima"
              valor={formatQuantity(
                ingrediente.qt_minima || 0,
                ingrediente.sg_unidade || "",
              )}
            />
            <Campo
              label="Custo Médio"
              valor={formatCurrency(ingrediente.vl_custo_medio || 0)}
            />
            <Campo
              label="Valor Total"
              valor={formatCurrency(ingrediente.valor_total_estoque || 0)}
            />
            <Campo
              label="Fornecedor"
              valor={ingrediente.fornecedor_preferencial}
            />
            <Campo label="Localização" valor={ingrediente.localizacao_fisica} />
            <Campo
              label="Última Mov."
              valor={
                ingrediente.ultima_movimentacao
                  ? formatDate(ingrediente.ultima_movimentacao)
                  : "-"
              }
            />
            <Campo
              label="Situação"
              valor={ingrediente.ic_ativo ? "Ativo" : "Inativo"}
            />
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
            <button
              onClick={() => {
                onMovimentar?.(ingrediente.id_ingrediente);
                onClose();
              }}
              className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors active:scale-95"
            >
              Registrar Movimentação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
