import { useNavigate } from "react-router-dom";
import { useNotificacoes } from "../../../hooks";
import { formatDate } from "../../../utils";

const iconMap = {
  estoque_baixo: "./src/assets/icons/alert-triangle-amarelo.svg",
  validade_proxima: "./src/assets/icons/clock-laranja.svg",
  reposicao_aprovacao: "./src/assets/icons/refresh-cw-verde.svg",
  perda_excedida: "./src/assets/icons/x-circle-vermelho.svg",
  sistema: "./src/assets/icons/bell-cinza.svg",
};

export default function NotificacoesBar({ onClose }) {
  const {
    data: notificacoes,
    loading,
    marcarComoLida,
  } = useNotificacoes("nao_lidas");
  const navigate = useNavigate();

  const handleClick = async (n) => {
    await marcarComoLida(n.id_notificacao);
    if (n.id_ingrediente) {
      navigate("/estoque", { state: { ingredienteId: n.id_ingrediente } });
    } else {
      navigate("/estoque");
    }
    onClose?.();
  };

  if (loading) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 p-4">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-500 text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 p-4">
      {notificacoes && notificacoes.length > 0 ? (
        notificacoes.map((n, i) => (
          <div key={n.id_notificacao}>
            <div
              className="flex items-center gap-3 py-2 hover:bg-gray-50 dark:hover:bg-[#1a1534] rounded-lg cursor-pointer"
              onClick={() => handleClick(n)}
            >
              <img
                src={
                  iconMap[n.tipo_notificacao] ||
                  "./src/assets/icons/bell-cinza.svg"
                }
                alt={n.tipo_notificacao}
                className="w-8 h-8 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {n.tipo_notificacao
                    .split("_")
                    .map((p) => p[0].toUpperCase() + p.slice(1))
                    .join(" ")}
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  {n.ds_mensagem}
                </p>
                <span className="text-xs text-gray-400">
                  {formatDate(n.dt_envio)}
                </span>
              </div>
            </div>
            {i < notificacoes.length - 1 && (
              <hr className="border-gray-100 dark:border-slate-800" />
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          Nenhuma notificação disponível.
        </div>
      )}
    </div>
  );
}
