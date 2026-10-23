import { supabase } from "../lib/supabaseClient";

export const agendaService = {
  async listar(idEmpresa, { inicio, fim, status } = {}) {
    let q = supabase
      .from("vw_agenda")
      .select("*")
      .eq("id_empresa", idEmpresa)
      .order("data_evento", { ascending: true })
      .order("hora_evento", { ascending: true });

    if (inicio) q = q.gte("data_evento", inicio);
    if (fim) q = q.lte("data_evento", fim);
    if (status) q = q.eq("status", status);

    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async criar(payload) {
    const { data, error } = await supabase
      .from("agenda")
      .insert({
        id_empresa: payload.id_empresa,
        id_ingrediente: payload.id_ingrediente || null,
        id_fornecedor: payload.id_fornecedor || null,
        id_usuario_responsavel: payload.id_usuario || null,
        tipo_evento: payload.tipo,
        status: "pendente",
        ds_titulo: payload.titulo,
        ds_observacao: payload.descricao || payload.observacoes || null,
        qt_prevista: payload.quantidade ?? null,
        vl_previsto: payload.valor_previsto ?? null,
        dt_agendada: payload.data_evento,
        hr_agendada: payload.hora_evento || null,
        recorrencia: payload.recorrencia || "nenhuma",
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async atualizar(idEvento, payload) {
    const map = {
      ds_titulo: payload.titulo,
      ds_observacao: payload.observacoes ?? payload.descricao,
      qt_prevista: payload.quantidade,
      dt_agendada: payload.data_evento,
      hr_agendada: payload.hora_evento,
      recorrencia: payload.recorrencia,
      status: payload.status,
    };
    Object.keys(map).forEach((k) => map[k] === undefined && delete map[k]);

    const { data, error } = await supabase
      .from("agenda")
      .update(map)
      .eq("id_agendamento", idEvento)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async concluir(idEvento) {
    const { data, error } = await supabase
      .from("agenda")
      .update({
        status: "concluido",
        data_conclusao: new Date().toISOString(),
      })
      .eq("id_agendamento", idEvento)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async cancelar(idEvento, motivo) {
    const { data, error } = await supabase
      .from("agenda")
      .update({
        status: "cancelado",
        ds_observacao: motivo || null,
      })
      .eq("id_agendamento", idEvento)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async excluir(idEvento) {
    const { error } = await supabase
      .from("agenda")
      .delete()
      .eq("id_agendamento", idEvento);
    if (error) throw error;
  },

  async gerarProximaOcorrencia(evento) {
    const mapa = { semanal: 7, quinzenal: 14, mensal: 30 };
    const add = mapa[evento.recorrencia];
    if (!add) return null;

    const base = new Date(
      `${evento.data_evento}T${evento.hora_evento || "00:00"}`,
    );
    base.setDate(base.getDate() + add);

    return this.criar({
      id_empresa: evento.id_empresa,
      id_ingrediente: evento.id_ingrediente,
      id_fornecedor: evento.id_fornecedor,
      id_usuario: evento.id_usuario,
      tipo: evento.tipo,
      titulo: evento.titulo,
      descricao: evento.descricao,
      quantidade: evento.quantidade,
      valor_previsto: evento.valor_previsto,
      data_evento: base.toISOString().slice(0, 10),
      hora_evento: evento.hora_evento,
      recorrencia: evento.recorrencia,
    });
  },
};
