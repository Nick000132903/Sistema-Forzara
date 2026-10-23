import { supabase } from "../lib/supabaseClient";

export const cmvService = {
  async getResumo() {
    const { data, error } = await supabase
      .from("vw_dashboard_financeiro")
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data || {};
  },

  async getEvolucao(dataInicio) {
    let query = supabase
      .from("vw_grafico_financeiro_mensal")
      .select("*")
      .order("mes", { ascending: true });
    if (dataInicio) query = query.gte("mes", dataInicio.toISOString());
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getComposicao(dataInicio, dataFim) {
    let query = supabase
      .from("movimentacao")
      .select(
        "tipo_movimentacao, quantidade, vl_unitario_momento, hora_movimentacao",
      )
      .gte("hora_movimentacao", dataInicio.toISOString())
      .lte("hora_movimentacao", dataFim.toISOString());

    const { data, error } = await query;
    if (error) throw error;

    const porMes = {};
    (data || []).forEach((m) => {
      const d = new Date(m.hora_movimentacao);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!porMes[key]) {
        porMes[key] = {
          mes: key,
          mesLabel: d
            .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
            .replace(".", ""),
          entradas: 0,
          saidas: 0,
          perdas: 0,
          ajustes: 0,
        };
      }
      const valor =
        (Number(m.quantidade) || 0) * (Number(m.vl_unitario_momento) || 0);
      const t = m.tipo_movimentacao;
      if (t === "entrada") porMes[key].entradas += valor;
      else if (t === "saida") porMes[key].saidas += valor;
      else if (t === "perda") porMes[key].perdas += valor;
      else if (t === "ajuste") porMes[key].ajustes += valor;
    });

    return Object.values(porMes).sort((a, b) => a.mes.localeCompare(b.mes));
  },

  async getTopInsumos(dataInicio, dataFim, limit = 10) {
    const { data, error } = await supabase
      .from("movimentacao")
      .select(
        "quantidade, vl_unitario_momento, tipo_movimentacao, lote (id_ingrediente, ingrediente (nm_ingrediente, unidade_medida (sg_unidade)))",
      )
      .eq("tipo_movimentacao", "saida")
      .gte("hora_movimentacao", dataInicio.toISOString())
      .lte("hora_movimentacao", dataFim.toISOString());
    if (error) throw error;

    const mapa = {};
    (data || []).forEach((m) => {
      const id = m.lote?.id_ingrediente;
      if (!id) return;
      if (!mapa[id]) {
        mapa[id] = {
          id_ingrediente: id,
          nm_ingrediente: m.lote?.ingrediente?.nm_ingrediente || "—",
          sg_unidade: m.lote?.ingrediente?.unidade_medida?.sg_unidade || "",
          quantidade: 0,
          valor: 0,
        };
      }
      mapa[id].quantidade += Number(m.quantidade) || 0;
      mapa[id].valor +=
        (Number(m.quantidade) || 0) * (Number(m.vl_unitario_momento) || 0);
    });

    const lista = Object.values(mapa).sort((a, b) => b.valor - a.valor);
    const totalGeral = lista.reduce((s, i) => s + i.valor, 0);
    return lista.slice(0, limit).map((i) => ({
      ...i,
      percentual: totalGeral > 0 ? (i.valor / totalGeral) * 100 : 0,
    }));
  },

  async getMeta(idEmpresa) {
    const { data, error } = await supabase
      .from("configuracao_geral")
      .select("valor")
      .eq("id_empresa", idEmpresa)
      .eq("chave", "cmv_meta_percentual")
      .maybeSingle();
    if (error) throw error;
    return data ? Number(data.valor) : 30;
  },
};
