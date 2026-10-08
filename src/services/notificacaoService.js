import { supabase } from "../lib/supabaseClient";

export const notificacaoService = {
  async getAll() {
    const { data, error } = await supabase
      .from("vw_notificacoes")
      .select("*")
      .order("dt_envio", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getNaoLidas() {
    const { data, error } = await supabase
      .from("vw_notificacoes")
      .select("*")
      .eq("ic_lida", false)
      .order("dt_envio", { ascending: false });

    if (error) throw error;
    return data;
  },

  async marcarComoLida(id) {
    const { error } = await supabase
      .from("notificacao")
      .update({ ic_lida: true, dt_lida: new Date().toISOString() })
      .eq("id_notificacao", id);

    if (error) throw error;
    return true;
  },

  async marcarTodasComoLidas(idUsuario) {
    const { error } = await supabase
      .from("notificacao")
      .update({ ic_lida: true, dt_lida: new Date().toISOString() })
      .eq("id_usuario_destino", idUsuario)
      .eq("ic_lida", false);

    if (error) throw error;
    return true;
  },
};
