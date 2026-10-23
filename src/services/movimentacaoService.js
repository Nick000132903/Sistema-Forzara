import { supabase } from "../lib/supabaseClient";

export const movimentacaoService = {
  async getAll(filters = {}) {
    let query = supabase.from("movimentacao").select(`
      id_movimentacao,
      tipo_movimentacao,
      motivo,
      quantidade,
      vl_unitario_momento,
      hora_movimentacao,
      id_usuario,
      id_aprovador,
      status_aprovacao,
      lote (
        cd_numero_lote,
        ingrediente (
          nm_ingrediente,
          unidade_medida (sg_unidade),
          categoria (nm_categoria)
        )
      ),
      solicitante:usuario!movimentacao_id_usuario_fkey (nm_usuario),
      aprovador:usuario!movimentacao_id_aprovador_fkey (nm_usuario),
      venda (canal_venda)
    `);

    if (filters.tipo) query = query.eq("tipo_movimentacao", filters.tipo);
    if (filters.dataInicio)
      query = query.gte("hora_movimentacao", filters.dataInicio);
    if (filters.dataFim)
      query = query.lte("hora_movimentacao", filters.dataFim);
    if (filters.idUsuario) query = query.eq("id_usuario", filters.idUsuario);

    const { data, error } = await query
      .order("hora_movimentacao", { ascending: false })
      .limit(filters.limit || 200);
    if (error) throw error;
    return data;
  },

  async registrar(payload) {
    const { data, error } = await supabase.rpc("registrar_movimentacao", {
      p_id_ingrediente: payload.id_ingrediente,
      p_id_usuario: payload.id_usuario,
      p_tipo: payload.tipo,
      p_motivo: payload.motivo,
      p_quantidade: payload.quantidade,
      p_id_venda: payload.id_venda || null,
      p_id_lote_especifico: payload.id_lote || null,
      p_vl_unitario: payload.vl_unitario || null,
      p_dt_validade: payload.dt_validade || null,
      p_id_fornecedor: payload.id_fornecedor || null,
    });
    if (error) throw error;
    return data;
  },
};
