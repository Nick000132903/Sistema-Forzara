import { supabase } from "../lib/supabaseClient";

export const ingredienteService = {
  async getAll(filters = {}) {
    let query = supabase.from("vw_listagem_ingredientes").select("*");
    if (filters.search)
      query = query.ilike("nm_ingrediente", `%${filters.search}%`);
    if (filters.status) query = query.eq("status_estoque", filters.status);
    if (filters.categoria) query = query.eq("id_categoria", filters.categoria);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("vw_listagem_ingredientes")
      .select("*")
      .eq("id_ingrediente", id)
      .single();
    if (error) throw error;
    return data;
  },

  async getEstoqueCritico() {
    const { data, error } = await supabase
      .from("vw_listagem_ingredientes")
      .select("*")
      .eq("status_estoque", "Crítico");
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("ingrediente")
      .insert({
        id_empresa: payload.id_empresa,
        id_categoria: payload.id_categoria,
        id_unidade: payload.id_unidade,
        nm_ingrediente: payload.nm_ingrediente,
        qt_minima: payload.qt_minima,
        vl_unitario_atual: payload.vl_unitario_atual ?? 0,
        localizacao_fisica: payload.localizacao_fisica || "Despensa",
        ic_ativo: true,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("ingrediente")
      .update(payload)
      .eq("id_ingrediente", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("ingrediente")
      .update({ ic_ativo: false })
      .eq("id_ingrediente", id);
    if (error) throw error;
  },
};
