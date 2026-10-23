import { supabase } from "../lib/supabaseClient";

export const aprovacaoService = {
  async getUsuarioAtual(authId) {
    if (!authId) return null;
    const { data, error } = await supabase
      .from("usuario")
      .select("id_usuario, tipo_perfil, id_empresa")
      .eq("auth_id", authId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listar(status = "pendente", limit = 100) {
    const { data, error } = await supabase
      .from("vw_movimentacoes_aprovacao")
      .select("*")
      .eq("status_aprovacao", status)
      .order("hora_movimentacao", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async contar(status) {
    const { count, error } = await supabase
      .from("vw_movimentacoes_aprovacao")
      .select("*", { count: "exact", head: true })
      .eq("status_aprovacao", status);
    if (error) throw error;
    return count || 0;
  },

  async aprovar(id, idAprovador, justificativa = null) {
    const { error } = await supabase.rpc("aprovar_movimentacao", {
      p_id_movimentacao: id,
      p_id_aprovador: idAprovador,
      p_aprovado: true,
      p_justificativa: justificativa,
    });
    if (error) throw error;
  },

  async rejeitar(id, idAprovador, justificativa) {
    if (!justificativa || !justificativa.trim()) {
      throw new Error("Justificativa obrigatória para rejeitar.");
    }
    const { error } = await supabase.rpc("aprovar_movimentacao", {
      p_id_movimentacao: id,
      p_id_aprovador: idAprovador,
      p_aprovado: false,
      p_justificativa: justificativa,
    });
    if (error) throw error;
  },

  async aprovarLote(ids, idAprovador) {
    const results = await Promise.allSettled(
      ids.map((id) => this.aprovar(id, idAprovador)),
    );
    const falhas = results.filter((r) => r.status === "rejected").length;
    if (falhas > 0) {
      throw new Error(`${falhas} de ${ids.length} não puderam ser aprovadas.`);
    }
  },

  async rejeitarLote(ids, idAprovador, justificativa) {
    if (!justificativa || !justificativa.trim()) {
      throw new Error("Justificativa obrigatória para rejeitar.");
    }
    const results = await Promise.allSettled(
      ids.map((id) => this.rejeitar(id, idAprovador, justificativa)),
    );
    const falhas = results.filter((r) => r.status === "rejected").length;
    if (falhas > 0) {
      throw new Error(`${falhas} de ${ids.length} não puderam ser rejeitadas.`);
    }
  },
};
