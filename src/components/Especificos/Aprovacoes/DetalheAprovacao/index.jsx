import { useState } from "react";
import { formatCurrency, formatDate, formatQuantity } from "../../../../utils";

const TIPO_LABEL = {
  entrada: "Entrada",
  saida: "Saída",
  perda: "Perda",
  ajuste: "Ajuste",
};

const STATUS_LABEL = {
  pendente: {
    label: "Aguardando aprovação",
    cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  aprovado: {
    label: "Aprovada",
    cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  rejeitado: {
    label: "Rejeitada",
    cls: "bg-red-500/15 text-red-700 dark:text-red-400",
  },
  nao_requer: {
    label: "Não requer aprovação",
    cls: "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300",
  },
};

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return `${formatDate(value)} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export default function DetalheAprovacao({
  item,
  podeAgir = false,
  onClose,
  onAprovar,
  onRejeitar,
}) {
  const [justificativa, setJustificativa] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  if (!item) return null;

  const status = item.status_aprovacao || "pendente";
  const somenteLeitura = status !== "pendente" || !podeAgir;
  const statusInfo = STATUS_LABEL[status] || STATUS_LABEL.pendente;

  const handle = async (acao) => {
    setErro(null);
    setLoading(true);
    try {
      if (acao === "aprovar")
        await onAprovar(item.id_movimentacao, justificativa);
      else await onRejeitar(item.id_movimentacao, justificativa);
      onClose();
    } catch (e) {
      setErro(e?.message || "Erro ao processar decisão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-surface-dark-elevated w-full max-w-md h-full shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-surface-dark-elevated border-b border-gray-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Detalhes da movimentação
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              #{item.id_movimentacao}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${statusInfo.cls}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(item.hora_movimentacao)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-orange-500/15 text-orange-700 dark:text-orange-400 text-xs font-semibold">
              {TIPO_LABEL[item.tipo_movimentacao] || item.tipo_movimentacao}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Insumo" valor={item.nm_ingrediente} />
            <Campo label="Categoria" valor={item.nm_categoria} />
            <Campo
              label="Quantidade"
              valor={formatQuantity(item.quantidade, item.sg_unidade)}
            />
            <Campo
              label="Valor total"
              valor={formatCurrency(item.valor_total)}
            />
            <Campo label="Lote" valor={item.cd_numero_lote || "—"} />
            <Campo label="Solicitante" valor={item.nm_solicitante || "—"} />
          </div>

          <Campo label="Motivo" valor={item.motivo || "—"} />

          {somenteLeitura && status !== "pendente" && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark border border-gray-100 dark:border-slate-800 space-y-3">
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
                Decisão registrada
              </p>
              <Campo label="Aprovador" valor={item.nm_aprovador || "—"} />
              <Campo
                label="Data da decisão"
                valor={formatDateTime(item.dt_aprovacao)}
              />
              <Campo label="Justificativa" valor={item.ds_aprovacao || "—"} />
            </div>
          )}

          {!somenteLeitura && (
            <>
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Justificativa (obrigatória para rejeitar)
                </label>
                <textarea
                  rows={3}
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  className="w-full mt-2 px-3 py-2.5 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-100 resize-none"
                  placeholder="Motivo da decisão..."
                />
              </div>

              {erro && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
                  {erro}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handle("rejeitar")}
                  disabled={loading || !justificativa.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-medium text-sm active:scale-95"
                >
                  Rejeitar
                </button>
                <button
                  onClick={() => handle("aprovar")}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-medium text-sm active:scale-95"
                >
                  {loading ? "Processando..." : "Aprovar"}
                </button>
              </div>
            </>
          )}

          {!podeAgir && status === "pendente" && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs text-center">
              Apenas gerentes podem aprovar ou rejeitar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Campo = ({ label, valor }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-semibold mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-800 dark:text-gray-100 wrap-break-word">
      {valor || "—"}
    </p>
  </div>
);
