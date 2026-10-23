import { supabase } from "../lib/supabaseClient";

export const categoriaService = {
  async getAllCategoriasIngrediente() {
    const { data, error } = await supabase
      .from("categoria")
      .select("*")
      .order("nm_categoria");
    if (error) throw error;
    return data;
  },

  async getAllCategoriasProduto() {
    const { data, error } = await supabase
      .from("categoria_produto")
      .select("*")
      .order("nm_categoria");
    if (error) throw error;
    return data;
  },

  async getUnidadesMedida() {
    const { data, error } = await supabase
      .from("unidade_medida")
      .select("*")
      .order("sg_unidade");
    if (error) throw error;
    return data;
  },

  async createCategoriaIngrediente(payload) {
    const { data, error } = await supabase
      .from("categoria")
      .insert({
        id_empresa: payload.id_empresa,
        nm_categoria: payload.nm_categoria,
        cor: payload.cor || "#8B5CF6",
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createCategoriaProduto(payload) {
    const { data, error } = await supabase
      .from("categoria_produto")
      .insert({
        id_empresa: payload.id_empresa,
        nm_categoria: payload.nm_categoria,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
