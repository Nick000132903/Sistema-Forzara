import { supabase } from "../lib/supabaseClient";

const DOC_FIELDS =
  "id_documento, nm_portador, numero_documento, cd_telefone, nm_email, tipo_documento";

export const fornecedorService = {
  async getAll() {
    const { data, error } = await supabase
      .from("fornecedor")
      .select("*")
      .order("id_fornecedor", { ascending: false });
    if (error) throw error;

    const fornecedores = data || [];
    if (fornecedores.length === 0) return [];

    const docIds = fornecedores.map((f) => f.id_documento).filter(Boolean);
    const idsForn = fornecedores.map((f) => f.id_fornecedor);

    const [docsRes, lotesRes] = await Promise.all([
      docIds.length > 0
        ? supabase
            .from("documento")
            .select(DOC_FIELDS)
            .in("id_documento", docIds)
        : Promise.resolve({ data: [] }),
      supabase
        .from("lote")
        .select("id_fornecedor, qt_inicial, vl_unitario, dt_recebimento")
        .in("id_fornecedor", idsForn),
    ]);

    const docsMap = Object.fromEntries(
      (docsRes.data || []).map((d) => [d.id_documento, d]),
    );

    const perfMap = {};
    (lotesRes.data || []).forEach((l) => {
      const id = l.id_fornecedor;
      if (!id) return;
      if (!perfMap[id]) {
        perfMap[id] = {
          total_lotes_comprados: 0,
          total_financeiro_comprado: 0,
          ultima_compra: null,
        };
      }
      perfMap[id].total_lotes_comprados += 1;
      perfMap[id].total_financeiro_comprado +=
        Number(l.qt_inicial || 0) * Number(l.vl_unitario || 0);
      const d = l.dt_recebimento;
      if (d && (!perfMap[id].ultima_compra || d > perfMap[id].ultima_compra)) {
        perfMap[id].ultima_compra = d;
      }
    });

    return fornecedores.map((f) => ({
      ...f,
      documento: f.id_documento ? docsMap[f.id_documento] || null : null,
      performance: perfMap[f.id_fornecedor] || {
        total_lotes_comprados: 0,
        total_financeiro_comprado: 0,
        ultima_compra: null,
      },
    }));
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("fornecedor")
      .select("*")
      .eq("id_fornecedor", id)
      .single();
    if (error) throw error;
    if (!data) return null;

    let documento = null;
    if (data.id_documento) {
      const { data: doc } = await supabase
        .from("documento")
        .select(DOC_FIELDS)
        .eq("id_documento", data.id_documento)
        .maybeSingle();
      documento = doc || null;
    }
    return { ...data, documento };
  },

  async getPerformance(idFornecedor) {
    const { data, error } = await supabase
      .from("lote")
      .select("qt_inicial, vl_unitario, dt_recebimento")
      .eq("id_fornecedor", idFornecedor);
    if (error) return null;
    const lotes = data || [];
    if (lotes.length === 0) {
      return {
        total_lotes_comprados: 0,
        total_financeiro_comprado: 0,
        ultima_compra: null,
      };
    }
    let ultima = null;
    let total = 0;
    lotes.forEach((l) => {
      total += Number(l.qt_inicial || 0) * Number(l.vl_unitario || 0);
      if (l.dt_recebimento && (!ultima || l.dt_recebimento > ultima)) {
        ultima = l.dt_recebimento;
      }
    });
    return {
      total_lotes_comprados: lotes.length,
      total_financeiro_comprado: total,
      ultima_compra: ultima,
    };
  },

  async getCompras(idFornecedor, limit = 20) {
    const { data, error } = await supabase
      .from("lote")
      .select(
        "id_lote, cd_numero_lote, qt_inicial, qt_atual, vl_unitario, dt_recebimento, dt_validade, ingrediente (nm_ingrediente, id_unidade, unidade_medida (sg_unidade))",
      )
      .eq("id_fornecedor", idFornecedor)
      .order("dt_recebimento", { ascending: false })
      .limit(limit);
    if (error) return [];
    return data || [];
  },

  async getInsumosFornecidos(idFornecedor) {
    const { data, error } = await supabase
      .from("fornecedor_ingrediente")
      .select(
        "id_fornecedor_ingrediente, ic_preferencial, ingrediente (id_ingrediente, nm_ingrediente, vl_unitario_atual, id_unidade, unidade_medida (sg_unidade))",
      )
      .eq("id_fornecedor", idFornecedor);
    if (error) return [];
    return data || [];
  },

  async create(payload) {
    const documentoPayload = {
      id_empresa: payload.id_empresa,
      tipo_documento: payload.tipo_documento || "cnpj",
      numero_documento: payload.numero_documento,
      nm_portador: payload.nm_portador,
      cd_telefone: payload.cd_telefone || null,
    };
    if (payload.nm_email) documentoPayload.nm_email = payload.nm_email;

    let doc;
    const first = await supabase
      .from("documento")
      .insert(documentoPayload)
      .select()
      .single();

    if (first.error) {
      if (first.error.code === "PGRST204" && payload.nm_email) {
        delete documentoPayload.nm_email;
        const retry = await supabase
          .from("documento")
          .insert(documentoPayload)
          .select()
          .single();
        if (retry.error) throw retry.error;
        doc = retry.data;
      } else {
        throw first.error;
      }
    } else {
      doc = first.data;
    }

    const { data: fornecedor, error: fornError } = await supabase
      .from("fornecedor")
      .insert({
        id_empresa: payload.id_empresa,
        id_documento: doc.id_documento,
        contato_principal: payload.contato_principal,
        prazo_entrega_padrao: payload.prazo_entrega_padrao ?? 2,
        condicao_pagamento: payload.condicao_pagamento || "À vista",
        ic_status: "ativo",
      })
      .select()
      .single();

    if (fornError) {
      await supabase
        .from("documento")
        .delete()
        .eq("id_documento", doc.id_documento);
      throw fornError;
    }

    if (payload.foto) {
      try {
        const url = await this.uploadFoto(
          payload.foto,
          fornecedor.id_fornecedor,
        );
        fornecedor.url_foto = url;
      } catch (e) {
        console.error("Upload de foto falhou:", e);
      }
    }

    return fornecedor;
  },

  async update(idFornecedor, idDocumento, payload) {
    if (idDocumento) {
      const docUpdate = {};
      if (payload.nm_portador) docUpdate.nm_portador = payload.nm_portador;
      if (payload.numero_documento)
        docUpdate.numero_documento = payload.numero_documento;
      if (payload.cd_telefone !== undefined)
        docUpdate.cd_telefone = payload.cd_telefone || null;
      if (payload.nm_email !== undefined)
        docUpdate.nm_email = payload.nm_email || null;

      if (Object.keys(docUpdate).length > 0) {
        const { error: docErr } = await supabase
          .from("documento")
          .update(docUpdate)
          .eq("id_documento", idDocumento);
        if (docErr && docErr.code !== "PGRST204") throw docErr;
      }
    }

    const { data: fornecedor, error: fornErr } = await supabase
      .from("fornecedor")
      .update({
        contato_principal: payload.contato_principal,
        prazo_entrega_padrao: payload.prazo_entrega_padrao,
        condicao_pagamento: payload.condicao_pagamento,
      })
      .eq("id_fornecedor", idFornecedor)
      .select()
      .single();
    if (fornErr) throw fornErr;

    if (payload.foto) {
      try {
        const url = await this.uploadFoto(payload.foto, idFornecedor);
        fornecedor.url_foto = url;
      } catch (e) {
        console.error("Upload de foto falhou:", e);
      }
    }

    return fornecedor;
  },

  async uploadFoto(file, idFornecedor) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `fornecedor-${idFornecedor}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("fornecedores")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (error) throw error;

    const { data } = supabase.storage.from("fornecedores").getPublicUrl(path);
    const url = data?.publicUrl;
    if (!url) throw new Error("Não foi possível gerar URL pública.");

    await supabase
      .from("fornecedor")
      .update({ url_foto: url })
      .eq("id_fornecedor", idFornecedor);

    return url;
  },

  async softDelete(idFornecedor) {
    const { error } = await supabase
      .from("fornecedor")
      .update({ ic_status: "inativo" })
      .eq("id_fornecedor", idFornecedor);
    if (error) throw error;
  },
};
