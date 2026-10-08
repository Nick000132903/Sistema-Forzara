import { useNavigate } from "react-router-dom";
import {
  formatCurrency,
  formatQuantity,
  formatDate,
  formatPercent,
} from "../../../utils";

export default function BaseCard({
  titulo,
  valor,
  valorAntigo,
  variacao,
  descricao,
  icone,
  cor,
  corBg,
  rota,
  estado,
  loading,
  unidade,
  dataAtualizacao,
  children,
}) {
  const navigate = useNavigate();

  const handleClick = () =>
    rota && navigate(rota, { state: { filtro: estado } });

  const corVariacao =
    variacao > 0
      ? "text-emerald-700"
      : variacao < 0
        ? "text-red-700"
        : "text-gray-400";
  const bgVariacao =
    variacao > 0 ? "bg-emerald-50" : variacao < 0 ? "bg-red-50" : "bg-gray-50";

  const formatar = (v) => {
    if (loading) return "...";
    if (v === undefined || v === null) return "0";
    if (unidade === "currency") return formatCurrency(v);
    if (unidade === "percentage") return formatPercent(v);
    if (unidade === "date") return formatDate(v);
    return formatQuantity(v, unidade || "");
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-[#0B071E] rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden ${rota ? "cursor-pointer hover:shadow-sm transition-shadow duration-150" : ""}`}
    >
      <div
        className={`h-1 ${cor?.replace("border-", "bg-") || "bg-purple-500"}`}
      />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {icone && (
              <div className={`p-2 rounded-lg ${corBg || "bg-purple-50"}`}>
                <img src={icone} alt={titulo} className="w-5 h-5" />
              </div>
            )}
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              {titulo}
            </p>
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatar(valor)}
        </p>
        {descricao && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {descricao}
          </p>
        )}
        {variacao !== undefined && variacao !== null && (
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-semibold ${bgVariacao} ${corVariacao}`}
            >
              {variacao > 0 ? "+" : ""}
              {formatPercent(variacao)}
            </span>
            {valorAntigo !== undefined && valorAntigo !== null && (
              <span className="text-xs text-gray-400">
                vs {formatar(valorAntigo)}
              </span>
            )}
          </div>
        )}
        {dataAtualizacao && (
          <p className="text-xs text-gray-400 mt-3">
            Atualizado em {formatDate(dataAtualizacao)}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
