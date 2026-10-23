import { supabase } from "../lib/supabaseClient";

export const usuarioService = {
  async listar(idEmpresa) {
    const { data, error } = await supabase
      .from("usuario")
      .select(
        "id_usuario, nm_usuario, nm_email, tipo_perfil, cargo, ativo, auth_id",
      )
      .eq("id_empresa", idEmpresa)
      .order("nm_usuario");
    if (error) throw error;
    return data || [];
  },

  async criar(payload) {
    const { data, error } = await supabase
      .from("usuario")
      .insert({
        id_empresa: payload.id_empresa,
        nm_usuario: payload.nm_usuario,
        nm_email: payload.nm_email.toLowerCase().trim(),
        tipo_perfil: payload.tipo_perfil,
        cargo: payload.cargo || null,
        ativo: true,
        senha_hash: "auth-externo",
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async alternarAtivo(id, ativo) {
    const { error } = await supabase
      .from("usuario")
      .update({ ativo })
      .eq("id_usuario", id);
    if (error) throw error;
  },
};
