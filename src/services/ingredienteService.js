import { supabase } from "../lib/supabaseClient";

export const ingredienteService = {
  async getAll(filters = {}) {
    let query = supabase.from("vw_listagem_ingredientes").select("*");

    if (filters.search) {
      query = query.ilike("nm_ingrediente", `%${filters.search}%`);
    }

    if (filters.status) {
      query = query.eq("status_estoque", filters.status);
    }

    if (filters.categoria) {
      query = query.eq("id_categoria", filters.categoria);
    }

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
};
