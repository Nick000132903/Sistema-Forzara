import { useCallback, useEffect, useMemo, useState } from "react";
import { HeaderBar, Layout, SideBar } from "../../components";
import DetalheAprovacao from "../../components/Especificos/Aprovacoes/DetalheAprovacao";
import { useAuth } from "../../contexts";
import { aprovacaoService } from "../../services/aprovacaoService";
import { formatCurrency, formatDate, formatQuantity } from "../../utils";

const ABAS = [
  { key: "pendente", label: "Pendentes" },
  { key: "aprovado", label: "Aprovadas" },
  { key: "rejeitado", label: "Rejeitadas" },
];

export default function Aprovacoes() {
  const { user } = useAuth();
  const [idUsuario, setIdUsuario] = useState(null);
  const [tipoPerfil, setTipoPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [aba, setAba] = useState("pendente");
  const [items, setItems] = useState([]);
  const [selecionados, setSelecionados] = useState(new Set());
  const [detalhe, setDetalhe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pendentes: 0, aprovadas: 0, rejeitadas: 0 });

  useEffect(() => {
    if (!user) return;
    aprovacaoService.getUsuarioAtual(user.id).then((u) => {
      setIdUsuario(u?.id_usuario || null);
      setTipoPerfil(u?.tipo_perfil || null);
    });
  }, [user]);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [lista, p, a, r] = await Promise.all([
        aprovacaoService.listar(aba),
        aprovacaoService.contar("pendente"),
        aprovacaoService.contar("aprovado"),
        aprovacaoService.contar("rejeitado"),
      ]);
      setItems(lista);
      setStats({ pendentes: p, aprovadas: a, rejeitadas: r });
      setSelecionados(new Set());
    } catch (e) {
      console.error(e);
      setErro(e?.message || "Erro ao carregar aprovações.");
    } finally {
      setLoading(false);
    }
  }, [aba]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const podeAprovar = useMemo(() => {
    if (!tipoPerfil) return false;
    return ["gerente", "admin", "administrador"].includes(tipoPerfil.toLowerCase());
  }, [tipoPerfil]);

  const filtrados = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (i) =>
        (i.nm_ingrediente || "").toLowerCase().includes(term) ||
        (i.motivo || "").toLowerCase().includes(term) ||
        (i.nm_solicitante || "").toLowerCase().includes(term),
    );
  }, [items, searchTerm]);

  const toggle = (id) => {
    const next = new Set(selecionados);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelecionados(next);
  };

  const toggleTodos = () => {
    if (selecionados.size === filtrados.length && filtrados.length > 0) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(filtrados.map((i) => i.id_movimentacao)));
    }
  };

  const handleAprovar = async (id, justificativa) => {
    if (!idUsuario) throw new Error("Usuário não identificado.");
    await aprovacaoService.aprovar(id, idUsuario, justificativa);
    await carregar();
  };

  const handleRejeitar = async (id, justificativa) => {
    if (!idUsuario) throw new Error("Usuário não identificado.");
    await aprovacaoService.rejeitar(id, idUsuario, justificativa);
    await carregar();
  };

  const handleAprovarLote = async () => {
    if (!idUsuario || selecionados.size === 0) return;
    try {
      await aprovacaoService.aprovarLote([...selecionados], idUsuario);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  const handleRejeitarLote = async () => {
    if (!idUsuario || selecionados.size === 0) return;
    const just = window.prompt("Justificativa para rejeitar em lote:");
    if (!just?.trim()) return;
    try {
      await aprovacaoService.rejeitarLote([...selecionados], idUsuario, just);
      await carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  if (loading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar page="Central de Aprovações" desc="Carregando..." />
          <div className="flex justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Central de Aprovações"
          desc="Revise perdas registradas acima do limite e mantenha o controle."
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />

        {!podeAprovar && tipoPerfil && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Você só pode visualizar. Apenas gerentes podem aprovar ou rejeitar movimentações.
            </p>
          </div>
        )}

        {erro && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-between gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
            <button
              onClick={carregar}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              Recarregar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Pendentes" valor={stats.pendentes} cor="orange" />
          <StatCard label="Aprovadas" valor={stats.aprovadas} cor="emerald" />
          <StatCard label="Rejeitadas" valor={stats.rejeitadas} cor="red" />
        </div>

        <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-slate-800 px-2 sm:px-4 overflow-x-auto">
            {ABAS.map((t) => (
              <button
                key={t.key}
                onClick={() => setAba(t.key)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  aba === t.key
                    ? "text-primary border-primary"
                    : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {aba === "pendente" && selecionados.size > 0 && podeAprovar && (
            <div className="px-4 py-3 bg-primary/5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {selecionados.size} selecionada{selecionados.size > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleRejeitarLote}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white"
                >
                  Rejeitar em lote
                </button>
                <button
                  onClick={handleAprovarLote}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Aprovar em lote
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-200">
              <thead className="bg-gray-50 dark:bg-surface-dark text-[10px] sm:text-xs uppercase text-gray-600 dark:text-gray-300 font-semibold">
                <tr>
                  {aba === "pendente" && podeAprovar && (
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={filtrados.length > 0 && selecionados.size === filtrados.length}
                        onChange={toggleTodos}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Insumo</th>
                  <th className="px-4 py-3">Motivo</th>
                  <th className="px-4 py-3 text-right">Qtd.</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                      {searchTerm
                        ? "Nenhum resultado para a busca."
                        : `Nenhuma movimentação ${aba === "pendente" ? "pendente" : aba === "aprovado" ? "aprovada" : "rejeitada"}.`}
                    </td>
                  </tr>
                ) : (
                  filtrados.map((it) => (
                    <tr
                      key={it.id_movimentacao}
                      className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-surface-dark-hover"
                    >
                      {aba === "pendente" && podeAprovar && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selecionados.has(it.id_movimentacao)}
                            onChange={() => toggle(it.id_movimentacao)}
                            className="w-4 h-4 accent-primary cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(it.hora_movimentacao)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                        {it.nm_ingrediente}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 truncate max-w-50">
                        {it.motivo}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 whitespace-nowrap">
                        {formatQuantity(it.quantidade, it.sg_unidade)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                        {formatCurrency(it.valor_total)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {it.nm_solicitante}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDetalhe(it)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>

      {detalhe && (
        <DetalheAprovacao
          item={detalhe}
          podeAgir={podeAprovar}
          onClose={() => setDetalhe(null)}
          onAprovar={handleAprovar}
          onRejeitar={handleRejeitar}
        />
      )}
    </>
  );
}

function StatCard({ label, valor, cor }) {
  const config = {
    orange: {
      bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      icon: "/icons/clock-laranja.svg",
    },
    emerald: {
      bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      icon: "/icons/check-circle-verde.svg",
    },
    red: {
      bg: "bg-red-500/10 text-red-600 dark:text-red-400",
      icon: "/icons/x-circle-vermelho.svg",
    },
  };
  const c = config[cor];
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-slate-800 p-5">
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>
          <img src={c.icon} alt="" className="w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{valor}</p>
      </div>
    </div>
  );
}