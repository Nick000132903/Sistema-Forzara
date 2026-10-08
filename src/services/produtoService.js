import { supabase } from "../lib/supabaseClient";

export const produtoService = {
  async getTop10MaisVendidos() {
    const { data, error } = await supabase
      .from("vw_top_10_produtos_mais_vendidos")
      .select("*");

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("produto")
      .select("*, categoria_produto(*)")
      .eq("ic_ativo", true);

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("produto")
      .select("*, categoria_produto(*)")
      .eq("id_produto", id)
      .single();

    if (error) throw error;
    return data;
  },
};
