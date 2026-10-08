import { supabase } from "../lib/supabaseClient";

export const movimentacaoService = {
  async getDadosGraficoLinhas() {
    const { data, error } = await supabase
      .from("vw_movimentacoes_ultimos_6_meses")
      .select("*")
      .order("mes", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAll(filters = {}) {
    let query = supabase.from("vw_movimentacoes_detalhadas").select("*");

    if (filters.tipo) {
      query = query.eq("tipo_movimentacao", filters.tipo);
    }

    if (filters.dataInicio) {
      query = query.gte("hora_movimentacao", filters.dataInicio);
    }

    if (filters.dataFim) {
      query = query.lte("hora_movimentacao", filters.dataFim);
    }

    const { data, error } = await query.order("hora_movimentacao", {
      ascending: false,
    });
    if (error) throw error;
    return data;
  },
};
