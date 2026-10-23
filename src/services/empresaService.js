import { supabase } from "../lib/supabaseClient";

export const empresaService = {
  async getEmpresaByAuthId(authId) {
    if (!authId) return null;

    const { data: usuario, error: errUsuario } = await supabase
      .from("usuario")
      .select("id_usuario, id_empresa, nm_email")
      .eq("auth_id", authId)
      .maybeSingle();

    if (errUsuario) throw errUsuario;

    if (!usuario) {
      console.warn(
        "[empresaService] Nenhum usuario encontrado para auth_id:",
        authId,
      );
      return null;
    }

    if (usuario.id_empresa === null || usuario.id_empresa === undefined) {
      console.warn("[empresaService] usuario.id_empresa está vazio:", usuario);
      return null;
    }

    if (typeof usuario.id_empresa !== "number") {
      console.error(
        "[empresaService] usuario.id_empresa NÃO é number. Tipo:",
        typeof usuario.id_empresa,
        "Valor:",
        usuario.id_empresa,
        "→ O schema do banco está inconsistente. usuario.id_empresa deveria ser integer.",
      );
      throw new Error(
        `Vínculo inconsistente: usuario.id_empresa="${usuario.id_empresa}" (${typeof usuario.id_empresa}). ` +
          `Verifique se a coluna usuario.id_empresa no Supabase é do tipo integer.`,
      );
    }

    const { data: empresa, error: errEmpresa } = await supabase
      .from("empresa")
      .select("*")
      .eq("id_empresa", usuario.id_empresa)
      .maybeSingle();

    if (errEmpresa) throw errEmpresa;

    if (!empresa) {
      console.warn(
        "[empresaService] Empresa não encontrada para id_empresa:",
        usuario.id_empresa,
      );
    }

    return empresa || null;
  },
};
