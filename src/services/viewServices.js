import { supabase } from "../lib/supabaseClient";

export const viewServices = {
  async getDashboardCards() {
    const { data, error } = await supabase
      .from("vw_dashboard_cards")
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async getListagemIngredientes(filters = {}) {
    let query = supabase.from("vw_listagem_ingredientes").select("*");

    if (filters.search) {
      query = query.ilike("nm_ingrediente", `%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq("status_estoque", filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getMovimentacoesUltimos6Meses() {
    const { data, error } = await supabase
      .from("vw_movimentacoes_ultimos_6_meses")
      .select("*")
      .order("mes", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getNotificacoes(filters = {}) {
    let query = supabase.from("vw_notificacoes").select("*");

    if (filters.lida !== undefined) {
      query = query.eq("ic_lida", filters.lida);
    }

    const { data, error } = await query.order("dt_envio", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTop10ProdutosMaisVendidos() {
    const { data, error } = await supabase
      .from("vw_top_10_produtos_mais_vendidos")
      .select("*");

    if (error) throw error;
    return data;
  },

  async getDadosFinanceiros() {
    const { data, error } = await supabase
      .from("vw_dashboard_financeiro")
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async getDadosGraficoFinanceiro() {
    const { data, error } = await supabase
      .from("vw_grafico_financeiro_mensal")
      .select("*")
      .order("mes", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getDadosRelatorios() {
    const { data, error } = await supabase
      .from("vw_relatorios_dashboard")
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },
};
