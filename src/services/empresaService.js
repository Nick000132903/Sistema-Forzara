import { supabase } from "../lib/supabaseClient";

export const empresaService = {
  async getEmpresaByAuthId(authId) {
    const { data, error } = await supabase
      .from("usuario")
      .select("id_empresa, empresa(*)")
      .eq("auth_id", authId)
      .single();

    if (error) throw error;
    return data?.empresa || null;
  },

  async getEmpresaById(id) {
    const { data, error } = await supabase
      .from("empresa")
      .select("*")
      .eq("id_empresa", id)
      .single();

    if (error) throw error;
    return data;
  },
};
