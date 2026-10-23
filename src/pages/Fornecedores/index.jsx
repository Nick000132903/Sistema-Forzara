import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CardFornecedores,
  CardCompra,
  HeaderBar,
  InfoFornecedores,
  Layout,
  ModalFornecedores,
  SideBar,
} from "../../components";
import { useEmpresa } from "../../contexts";
import { fornecedorService } from "../../services/fornecedorService";
import { formatCurrency, formatDate, formatQuantity } from "../../utils";

const ABAS = [
  {
    key: "historico",
    label: "Histórico de Compras",
    icon: "/icons/shopping-cart-roxo.svg",
    inactiveIcon: "/icons/shopping-cart-black.svg",
  },
  {
    key: "produtos",
    label: "Insumos Fornecidos",
    icon: "/icons/package-roxo.svg",
    inactiveIcon: "/icons/package-black.svg",
  },
];

export default function Fornecedores() {
  const { empresa, loading: empresaLoading } = useEmpresa();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [compras, setCompras] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("historico");

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const lista = await fornecedorService.getAll();
      setFornecedores(lista || []);
      if (!selecionadoId && lista?.length > 0) {
        setSelecionadoId(lista[0].id_fornecedor);
      }
    } catch (e) {
      console.error(e);
      setErro(e?.message || "Erro ao carregar fornecedores.");
    } finally {
      setLoading(false);
    }
  }, [selecionadoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    if (!selecionadoId) return;
    const carregarDetalhes = async () => {
      try {
        const [perf, comprasData, insumosData] = await Promise.all([
          fornecedorService.getPerformance(selecionadoId),
          fornecedorService.getCompras(selecionadoId, 30),
          fornecedorService.getInsumosFornecidos(selecionadoId),
        ]);
        setPerformance(perf);
        setCompras(comprasData);
        setInsumos(insumosData);
      } catch (e) {
        console.error("Erro nos detalhes do fornecedor:", e);
      }
    };
    carregarDetalhes();
  }, [selecionadoId]);

  const fornecedoresFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return fornecedores;
    const term = searchTerm.toLowerCase();
    return fornecedores.filter((f) => {
      const nome = f.documento?.nm_portador?.toLowerCase() || "";
      const cnpj = f.documento?.numero_documento?.toLowerCase() || "";
      const contato = f.contato_principal?.toLowerCase() || "";
      return (
        nome.includes(term) || cnpj.includes(term) || contato.includes(term)
      );
    });
  }, [fornecedores, searchTerm]);

  const totalCompras = useMemo(
    () =>
      fornecedores.reduce(
        (s, f) => s + (Number(f.performance?.total_financeiro_comprado) || 0),
        0,
      ),
    [fornecedores],
  );

  const prazoMedio = useMemo(() => {
    const validos = fornecedores.filter((f) => f.prazo_entrega_padrao > 0);
    if (!validos.length) return 0;
    return Math.round(
      validos.reduce((s, f) => s + Number(f.prazo_entrega_padrao), 0) /
        validos.length,
    );
  }, [fornecedores]);

  const ultimaCompraGeral = useMemo(() => {
    const datas = fornecedores
      .map((f) => f.performance?.ultima_compra)
      .filter(Boolean)
      .sort();
    if (!datas.length) return "—";
    return formatDate(datas[datas.length - 1]);
  }, [fornecedores]);

  const selecionado = fornecedores.find(
    (f) => f.id_fornecedor === selecionadoId,
  );

  if (loading || empresaLoading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar page="Fornecedores" desc="Carregando..." />
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
          page="Fornecedores"
          desc="Cadastro e gerenciamento dos fornecedores."
        />

        {erro && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-between gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
            <button
              onClick={carregar}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {!empresa && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              ⚠️ Sua conta não está vinculada a uma empresa. Cadastros estão
              bloqueados.
            </p>
          </div>
        )}

        {/* Cabeçalho: título + botão (preenche o espaço vazio) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Fornecedores
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Gerencie parceiros comerciais, compras e insumos vinculados.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            disabled={!empresa}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white py-2.5 px-5 rounded-xl text-sm font-medium shadow-sm active:scale-95 shrink-0"
            title={
              !empresa
                ? "Vincule seu usuário a uma empresa primeiro"
                : undefined
            }
          >
            <img
              src="/icons/plus-circle-branco.svg"
              alt=""
              className="w-4 h-4"
            />
            Novo Fornecedor
          </button>
        </div>

        {fornecedores.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <ResumoCard
              icon="truck-roxo"
              titulo="Fornecedores"
              valor={fornecedores.length}
              sub={`${fornecedores.filter((f) => f.ic_status === "ativo").length} ativos`}
              cor="purple"
            />
            <ResumoCard
              icon="dollar-verde"
              titulo="Compras no total"
              valor={totalCompras}
              sub="Histórico completo"
              cor="emerald"
              isCurrency
            />
            <ResumoCard
              icon="clock-laranja"
              titulo="Prazo médio"
              valor={prazoMedio}
              sub="Horas em média"
              cor="orange"
              sufixo="h"
            />
            <ResumoCard
              icon="receipt-azul"
              titulo="Última compra"
              valor={ultimaCompraGeral}
              sub="Em qualquer fornecedor"
              cor="blue"
            />
          </div>
        )}

        {fornecedores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <img src="/icons/truck-roxo.svg" alt="" className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Nenhum fornecedor cadastrado
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              Cadastre seu primeiro fornecedor para começar a gerenciar compras,
              insumos e histórico.
            </p>
            {empresa && (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-5 flex items-center gap-2 bg-primary hover:bg-primary-hover text-white py-2.5 px-5 rounded-xl text-sm font-medium shadow-sm active:scale-95"
              >
                <img
                  src="/icons/plus-circle-branco.svg"
                  alt=""
                  className="w-4 h-4"
                />
                Cadastrar primeiro fornecedor
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 w-full flex flex-col">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] shadow-sm"
                />
                <img
                  src="/icons/search-cinza.svg"
                  alt="Buscar"
                  className="absolute left-3 top-3 w-4 h-4"
                />
              </div>

              <div className="flex flex-col gap-2 mt-4 overflow-y-auto pr-1 pb-4 max-h-[calc(100vh-320px)]">
                {fornecedoresFiltrados.length > 0 ? (
                  fornecedoresFiltrados.map((f) => (
                    <CardFornecedores
                      key={f.id_fornecedor}
                      foto={f.url_foto}
                      name={f.documento?.nm_portador || "Fornecedor"}
                      category={f.condicao_pagamento || "—"}
                      prazo={f.prazo_entrega_padrao ?? 0}
                      ativo={f.ic_status === "ativo"}
                      selecionado={f.id_fornecedor === selecionadoId}
                      onClick={() => setSelecionadoId(f.id_fornecedor)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">
                    Nenhum fornecedor encontrado
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 rounded-2xl flex flex-col overflow-hidden bg-white dark:bg-surface-dark-elevated shadow-sm border border-gray-100 dark:border-slate-800">
              {selecionado ? (
                <>
                  <InfoFornecedores
                    foto={selecionado.url_foto}
                    name={selecionado.documento?.nm_portador || "Fornecedor"}
                    cnpj={selecionado.documento?.numero_documento || "—"}
                    condicaoPagamento={selecionado.condicao_pagamento || "—"}
                    telefone={selecionado.documento?.cd_telefone || "—"}
                    email={selecionado.documento?.nm_email || "—"}
                    status={selecionado.ic_status === "ativo"}
                    qtdPedidos={performance?.total_lotes_comprados ?? 0}
                    qtdEntregas={compras.length}
                    dtParceria={
                      compras.length
                        ? formatDate(
                            compras[compras.length - 1]?.dt_recebimento,
                          )
                        : "—"
                    }
                    dtUltimoPedido={
                      performance?.ultima_compra
                        ? formatDate(performance.ultima_compra)
                        : "—"
                    }
                    vlUltimoPedido={
                      compras[0]
                        ? Number(compras[0].qt_inicial) *
                          Number(compras[0].vl_unitario)
                        : 0
                    }
                    prazo={selecionado.prazo_entrega_padrao ?? 0}
                    vlTotalCompras={performance?.total_financeiro_comprado ?? 0}
                    onEdit={() => setEditando(selecionado)}
                  />

                  <div className="flex border-b border-gray-100 dark:border-slate-800 px-2 sm:px-4 overflow-x-auto">
                    {ABAS.map((aba) => {
                      const ativa = abaAtiva === aba.key;
                      return (
                        <button
                          key={aba.key}
                          onClick={() => setAbaAtiva(aba.key)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                            ativa
                              ? "text-primary border-primary"
                              : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
                          }`}
                        >
                          <img
                            src={ativa ? aba.icon : aba.inactiveIcon}
                            alt=""
                            className={`w-4 h-4 ${ativa ? "" : "opacity-50"}`}
                          />
                          {aba.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 p-4 sm:p-6 overflow-y-auto max-h-150">
                    {abaAtiva === "historico" &&
                      (compras.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                          Nenhuma compra registrada para este fornecedor.
                        </p>
                      ) : (
                        compras.map((c) => {
                          const dt = c.dt_recebimento
                            ? new Date(`${c.dt_recebimento}T12:00:00`)
                            : null;
                          return (
                            <CardCompra
                              key={c.id_lote}
                              diaCompra={dt ? dt.getDate() : "—"}
                              mesCompra={
                                dt
                                  ? dt
                                      .toLocaleDateString("pt-BR", {
                                        month: "short",
                                      })
                                      .toUpperCase()
                                      .replace(".", "")
                                  : "—"
                              }
                              anoCompra={dt ? dt.getFullYear() : ""}
                              numPedido={c.cd_numero_lote || "—"}
                              status={Number(c.qt_atual) > 0}
                              desc={`${c.ingrediente?.nm_ingrediente || "Item"} — ${formatQuantity(
                                c.qt_inicial,
                                c.ingrediente?.unidade_medida?.sg_unidade || "",
                              )}`}
                              qtdItens={1}
                              vlTotal={
                                Number(c.qt_inicial) * Number(c.vl_unitario)
                              }
                              dtEntrega={formatDate(c.dt_recebimento)}
                              hrEntrega="—"
                            />
                          );
                        })
                      ))}

                    {abaAtiva === "produtos" &&
                      (insumos.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                          Nenhum insumo vinculado a este fornecedor.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-surface-dark text-[10px] uppercase text-gray-500 dark:text-gray-400">
                              <tr>
                                <th className="text-left px-4 py-2">Insumo</th>
                                <th className="text-left px-4 py-2">
                                  Custo Unit.
                                </th>
                                <th className="text-center px-4 py-2">
                                  Preferencial
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {insumos.map((i) => (
                                <tr
                                  key={i.id_fornecedor_ingrediente}
                                  className="border-b border-gray-100 dark:border-slate-800 last:border-0"
                                >
                                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                                    {i.ingrediente?.nm_ingrediente || "—"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                    {formatCurrency(
                                      i.ingrediente?.vl_unitario_atual || 0,
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {i.ic_preferencial ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                                        Sim
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-400">
                                        —
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm">
                  Selecione um fornecedor na lista à esquerda.
                </div>
              )}
            </div>
          </div>
        )}

        {modalOpen && (
          <ModalFornecedores
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              carregar();
            }}
          />
        )}

        {editando && (
          <ModalFornecedores
            fornecedor={editando}
            onClose={() => setEditando(null)}
            onSuccess={() => {
              setEditando(null);
              carregar();
            }}
          />
        )}
      </Layout>
    </>
  );
}

function ResumoCard({ icon, titulo, valor, sub, cor, isCurrency, sufixo }) {
  const mapa = {
    purple: "bg-purple-500/10",
    emerald: "bg-emerald-500/10",
    orange: "bg-orange-500/10",
    blue: "bg-blue-500/10",
  };

  const formatado = isCurrency
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(valor) || 0)
    : `${valor}${sufixo || ""}`;

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-slate-800 p-4">
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
        {titulo}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${mapa[cor]}`}
        >
          <img src={`/icons/${icon}.svg`} alt="" className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {formatado}
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
