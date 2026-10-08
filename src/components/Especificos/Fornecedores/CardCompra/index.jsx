import { formatCurrency } from "../../../../utils";

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
  const vlTotalF = formatCurrency(vlTotal);

  return (
    <div className="p-5 rounded-xl bg-white border border-gray-100 flex flex-col lg:flex-row justify-between gap-4 hover:border-purple-200 transition-colors">
      <div className="flex gap-4">
        <div className="flex flex-col border-r border-gray-200 font-semibold text-center pr-5 shrink-0">
          <p className="text-2xl text-gray-800">
            {diaCompra ? diaCompra : "-"}
          </p>
          <p className="text-xs text-gray-500 uppercase">
            {mesCompra ? mesCompra : "-"}
          </p>
          <p className="text-xs text-gray-500">{anoCompra ? anoCompra : "-"}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <p className="text-xs font-semibold bg-green-500/15 text-green-700 py-1 px-2.5 rounded-md">
              Pedido {numPedido ? `#${numPedido}` : "Indefinido"}
            </p>
            <p
              className={`text-xs font-semibold py-1 px-2.5 rounded-md ${
                status
                  ? "bg-blue-500/15 text-blue-700"
                  : "bg-red-500/15 text-red-700"
              }`}
            >
              {status ? "Entregue" : "Não Entregue"}
            </p>
          </div>
          <p className="font-semibold text-gray-800 text-sm">{desc || "..."}</p>
          <p className="text-gray-600 text-xs">
            Itens: {qtdItens || "..."} · Total: {vlTotal ? vlTotalF : "..."}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 lg:gap-10">
        <div className="text-gray-700 text-xs leading-relaxed text-left sm:text-right">
          <p className="text-gray-400">Entregue em:</p>
          <p className="font-medium">
            {dtEntrega || "..."} · {hrEntrega || "..."}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <p className="text-base text-emerald-500 font-semibold">
            {vlTotal ? vlTotalF : "..."}
          </p>
          <img
            src="./src/assets/icons/arrow-down-cinza.svg"
            alt="Ver"
            className="w-5 -rotate-90"
          />
        </div>
      </div>
    </div>
  );
}
