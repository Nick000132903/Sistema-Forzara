export default function CardCompra({
  diaCompra,
  mesCompra,
  anoCompra,
  numPedido,
  status,
  desc,
  qtdItens,
  vlTotal,
  dtEntrega,
  hrEntrega,
}) {
  const vlTotalF = Number(vlTotal || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-slate-800">
      <div className="flex gap-4 items-center min-w-0">
        <div className="bg-purple-400/20 w-14 h-14 flex flex-col items-center justify-center rounded-lg shrink-0">
          <p className="text-lg font-bold text-purple-700 dark:text-purple-300 leading-none">
            {diaCompra}
          </p>
          <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-300">
            {mesCompra} {anoCompra}
          </p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
              Pedido #{numPedido}
            </p>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                status
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-700 dark:text-red-400"
              }`}
            >
              {status ? "Entregue" : "Pendente"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {desc}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            {qtdItens} {qtdItens === 1 ? "item" : "itens"} · Entrega:{" "}
            {dtEntrega} {hrEntrega}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {vlTotalF}
        </p>
      </div>
    </div>
  );
}
