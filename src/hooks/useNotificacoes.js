import { useCallback, useEffect, useState } from "react";
import { viewServices } from "../services/viewServices";

export function useNotificacoes(filtro = "todas") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (filtro === "nao_lidas") filters.lida = false;
      if (filtro === "lidas") filters.lida = true;
      const result = await viewServices.getNotificacoes(filters);
      setData(result || []);
    } catch (e) {
      console.error("Erro ao carregar notificações:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const marcarComoLida = useCallback(async (id) => {
    const { supabase } = await import("../lib/supabaseClient");
    const { error } = await supabase
      .from("notificacao")
      .update({ ic_lida: true })
      .eq("id_notificacao", id);
    if (error) {
      console.error(error);
      return;
    }
    setData((prev) =>
      prev.map((n) => (n.id_notificacao === id ? { ...n, ic_lida: true } : n)),
    );
  }, []);

  const marcarTodasComoLidas = useCallback(async () => {
    const { supabase } = await import("../lib/supabaseClient");
    const ids = data.filter((n) => !n.ic_lida).map((n) => n.id_notificacao);
    if (ids.length === 0) return;
    const { error } = await supabase
      .from("notificacao")
      .update({ ic_lida: true })
      .in("id_notificacao", ids);
    if (error) {
      console.error(error);
      return;
    }
    setData((prev) => prev.map((n) => ({ ...n, ic_lida: true })));
  }, [data]);

  return {
    data,
    loading,
    error,
    recarregar: carregar,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
