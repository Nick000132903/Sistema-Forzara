import { supabase } from "../lib/supabaseClient";

export const notificacaoService = {
  async getAll() {
    const { data, error } = await supabase
      .from("notificacao")
      .select("*")
      .order("id_notificacao", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getNaoLidas() {
    const { data, error } = await supabase
      .from("notificacao")
      .select("*")
      .eq("ic_lida", false)
      .order("id_notificacao", { ascending: false });
    if (error) throw error;
    return data;
  },

  async marcarComoLida(id) {
    const { error } = await supabase
      .from("notificacao")
      .update({ ic_lida: true })
      .eq("id_notificacao", id);
    if (error) throw error;
  },

  async marcarTodasComoLidas() {
    const { error } = await supabase
      .from("notificacao")
      .update({ ic_lida: true })
      .eq("ic_lida", false);
    if (error) throw error;
  },
};
