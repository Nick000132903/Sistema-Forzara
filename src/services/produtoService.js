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

  async create(payload) {
    const { data, error } = await supabase
      .from("produto")
      .insert({
        id_empresa: payload.id_empresa,
        id_categoria_produto: payload.id_categoria_produto,
        nm_produto: payload.nm_produto,
        ds_produto: payload.ds_produto || null,
        vl_venda_produto: payload.vl_venda_produto,
        tempo_preparo: payload.tempo_preparo ?? 15,
        alergenicos: payload.alergenicos || "Nenhum",
        disponivel_delivery: payload.disponivel_delivery ?? true,
        ic_ativo: true,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("produto")
      .update(payload)
      .eq("id_produto", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("produto")
      .update({ ic_ativo: false })
      .eq("id_produto", id);
    if (error) throw error;
  },
};
