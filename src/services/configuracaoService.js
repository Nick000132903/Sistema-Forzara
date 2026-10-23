import { supabase } from "../lib/supabaseClient";

export const configuracaoService = {
  async getAll(idEmpresa) {
    const { data, error } = await supabase.rpc("get_configuracoes", {
      p_id_empresa: idEmpresa,
    });
    if (error) throw error;
    return data || {};
  },

  async set(idEmpresa, chave, valor) {
    const { error } = await supabase.rpc("set_configuracao", {
      p_id_empresa: idEmpresa,
      p_chave: chave,
      p_valor: String(valor),
    });
    if (error) throw error;
  },

  async setMany(idEmpresa, obj) {
    await Promise.all(
      Object.entries(obj).map(([k, v]) => this.set(idEmpresa, k, v)),
    );
  },
};
