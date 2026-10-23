import { formatDate } from "../../../../utils";
import ProfileIcon from "/icons/profile-roxo.svg";

const STATUS_STYLE = {
  pendente: "bg-yellow-300/15 text-yellow-600 dark:text-yellow-400",
  confirmado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  concluido: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  atrasado: "bg-red-500/15 text-red-700 dark:text-red-400",
  cancelado: "bg-gray-400/15 text-gray-500 dark:text-gray-400",
};

const STATUS_LABEL = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  atrasado: "Atrasado",
  cancelado: "Cancelado",
};

const TIPO_LABEL = {
  reposicao: "Reposição",
  entrega: "Entrega",
  contagem_fisica: "Contagem Física",
  manutencao: "Manutenção",
};

export default function ListaEventos({
  eventos,
  onEventoClick,
  agrupadoPorDia = true,
}) {
  if (!eventos?.length) {
    return (
      <div className="bg-white dark:bg-surface-dark-elevated rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-10 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Nenhum evento no período.
        </p>
      </div>
    );
  }

  const grupos = {};
  eventos.forEach((ev) => {
    if (!grupos[ev.data_evento]) grupos[ev.data_evento] = [];
    grupos[ev.data_evento].push(ev);
  });

  const diasOrdenados = Object.keys(grupos).sort();
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      {diasOrdenados.map((dia) => (
        <div
          key={dia}
          className="bg-white dark:bg-surface-dark-elevated rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
        >
          {agrupadoPorDia && (
            <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-surface-dark flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {formatDate(dia)}
              </h3>
              {dia === hoje && (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  Hoje
                </span>
              )}
            </div>
          )}
          {grupos[dia].map((ev) => (
            <button
              key={ev.id_evento}
              onClick={() => onEventoClick?.(ev)}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800 last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-surface-dark-hover transition-colors text-left"
            >
              <div className="flex items-center gap-5 min-w-0">
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 w-14 shrink-0">
                  {ev.hora_evento?.slice(0, 5) || "—"}
                </span>
                <span className="w-px h-10 bg-gray-200 dark:bg-slate-700 shrink-0" />
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex justify-center items-center shrink-0">
                  <img src={ProfileIcon} alt="" className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                    {ev.titulo}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">
                    {TIPO_LABEL[ev.tipo] || ev.tipo}
                    {ev.nm_ingrediente ? ` · ${ev.nm_ingrediente}` : ""}
                    {ev.quantidade
                      ? ` (${Number(ev.quantidade)} ${
                          ev.sg_unidade || ev.unidade || ""
                        })`
                      : ""}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center justify-center px-3 h-7 rounded-lg text-xs font-semibold shrink-0 ${
                  STATUS_STYLE[ev.status] || STATUS_STYLE.pendente
                }`}
              >
                {STATUS_LABEL[ev.status] || ev.status}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
