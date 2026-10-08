import { useEffect, useState } from "react";

import { viewServices, notificacaoService } from "../services";

export function useNotificacoes(filtro = "todas") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        let result;
        if (filtro === "nao_lidas") {
          result = await viewServices.getNotificacoes({ lida: false });
        } else {
          result = await viewServices.getNotificacoes();
        }
        setData(result || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [filtro]);

  const marcarComoLida = async (id) => {
    try {
      await notificacaoService.marcarComoLida(id);
      setData(data.filter((n) => n.id_notificacao !== id));
    } catch (err) {
      setError(err);
    }
  };

  const marcarTodasComoLidas = async (idUsuario) => {
    try {
      await notificacaoService.marcarTodasComoLidas(idUsuario);
      setData([]);
    } catch (err) {
      setError(err);
    }
  };

  return { data, loading, error, marcarComoLida, marcarTodasComoLidas };
}
