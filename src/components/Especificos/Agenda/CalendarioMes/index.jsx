const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const STATUS_DOT = {
  pendente: "bg-yellow-500",
  confirmado: "bg-emerald-500",
  concluido: "bg-blue-500",
  atrasado: "bg-red-500",
  cancelado: "bg-gray-400",
};

export default function CalendarioMes({
  mesRef,
  eventos = [],
  onDiaClick,
  onEventoClick,
}) {
  const ano = mesRef.getFullYear();
  const mes = mesRef.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const inicioGrid = new Date(primeiroDia);
  inicioGrid.setDate(inicioGrid.getDate() - primeiroDia.getDay());

  const dias = [];
  const cursor = new Date(inicioGrid);
  for (let i = 0; i < 42; i++) {
    dias.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const porDia = {};
  eventos.forEach((ev) => {
    if (!porDia[ev.data_evento]) porDia[ev.data_evento] = [];
    porDia[ev.data_evento].push(ev);
  });

  return (
    <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {MESES[mes]} {ano}
        </h2>
      </div>

      <div className="grid grid-cols-7 bg-gray-50 dark:bg-surface-dark text-[10px] uppercase text-gray-500 dark:text-gray-400 font-semibold">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="px-2 py-2 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {dias.map((d, idx) => {
          const iso = d.toISOString().slice(0, 10);
          const isMesAtual = d.getMonth() === mes;
          const isHoje = d.getTime() === hoje.getTime();
          const eventosDia = porDia[iso] || [];
          return (
            <button
              key={idx}
              onClick={() => onDiaClick?.(d)}
              className={`min-h-20 sm:min-h-25 border-b border-r border-gray-100 dark:border-slate-800 p-1.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-surface-dark-hover ${
                !isMesAtual ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-medium ${
                    isHoje
                      ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {d.getDate()}
                </span>
                {eventosDia.length > 0 && (
                  <span className="text-[9px] text-gray-400">
                    {eventosDia.length}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                {eventosDia.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id_evento}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventoClick?.(ev);
                    }}
                    className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-300 truncate hover:text-primary cursor-pointer"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        STATUS_DOT[ev.status] || "bg-gray-400"
                      }`}
                    />
                    <span className="truncate">
                      {ev.hora_evento?.slice(0, 5)} {ev.titulo}
                    </span>
                  </div>
                ))}
                {eventosDia.length > 2 && (
                  <div className="text-[10px] text-gray-400">
                    +{eventosDia.length - 2}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
