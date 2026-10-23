import { useState } from "react";
import { formatDate, formatQuantity } from "../../../../utils";

const TIPO_LABEL = {
  reposicao: "Reposição",
  entrega: "Entrega",
  contagem_fisica: "Contagem Física",
  manutencao: "Manutenção",
};

const STATUS_LABEL = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  atrasado: "Atrasado",
  cancelado: "Cancelado",
};

const RECORRENCIA_LABEL = {
  nenhuma: "Não recorrente",
  semanal: "Semanal",
  quinzenal: "Quinzenal",
  mensal: "Mensal",
};

export default function DetalheEvento({
  evento,
  onClose,
  onConcluir,
  onCancelar,
  onExcluir,
}) {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  if (!evento) return null;
  const jaFinalizado = ["concluido", "cancelado"].includes(evento.status);

  const handle = async (fn, ...args) => {
    setLoading(true);
    try {
      await fn(...args);
      onClose();
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
        <div className="sticky top-0 bg-white dark:bg-surface-dark-elevated border-b border-gray-100 dark:border-slate-800 px-5 py-4 flex items-start justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {evento.titulo}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {TIPO_LABEL[evento.tipo] || evento.tipo} ·{" "}
              {STATUS_LABEL[evento.status] || evento.status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer shrink-0 ml-2"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Data" valor={formatDate(evento.data_evento)} />
            <Campo
              label="Hora"
              valor={evento.hora_evento?.slice(0, 5) || "—"}
            />
            <Campo label="Insumo" valor={evento.nm_ingrediente || "—"} />
            <Campo
              label="Quantidade"
              valor={
                evento.quantidade
                  ? formatQuantity(
                      evento.quantidade,
                      evento.sg_unidade || evento.unidade || "",
                    )
                  : "—"
              }
            />
            <Campo label="Fornecedor" valor={evento.nm_fornecedor || "—"} />
            <Campo label="Responsável" valor={evento.nm_usuario || "—"} />
            <Campo
              label="Recorrência"
              valor={RECORRENCIA_LABEL[evento.recorrencia] || "Não recorrente"}
            />
            {evento.data_conclusao && (
              <Campo
                label="Concluído em"
                valor={formatDate(evento.data_conclusao)}
              />
            )}
          </div>

          {evento.descricao && (
            <Campo label="Descrição" valor={evento.descricao} />
          )}
          {evento.observacoes && (
            <Campo label="Observações" valor={evento.observacoes} />
          )}

          {!jaFinalizado && (
            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
              <button
                onClick={() => handle(onConcluir, evento)}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium text-sm active:scale-95"
              >
                {loading ? "Processando..." : "Marcar como concluído"}
              </button>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Motivo (obrigatório para cancelar)
                </label>
                <textarea
                  rows={2}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 resize-none"
                  placeholder="Por que está cancelando?"
                />
              </div>

              <button
                onClick={() => handle(onCancelar, evento, motivo)}
                disabled={loading || !motivo.trim()}
                className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium text-sm"
              >
                Cancelar evento
              </button>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
            <button
              onClick={() => {
                if (window.confirm("Excluir permanentemente este evento?")) {
                  handle(onExcluir, evento);
                }
              }}
              disabled={loading}
              className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Excluir evento
            </button>
          </div>
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
    <p className="text-sm text-gray-800 dark:text-gray-100">{valor || "—"}</p>
  </div>
);
