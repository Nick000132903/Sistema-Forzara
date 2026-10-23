import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HeaderBar,
  Layout,
  SideBar,
  ModalNovaMovimentacao,
  EntradasMesCard,
  SaidasMesCard,
  PerdasMesCard,
  TotalMovimentacoesCard,
} from "../../components";
import { useEmpresa } from "../../contexts";
import { viewServices } from "../../services";
import { movimentacaoService } from "../../services/movimentacaoService";
import { formatCurrency, formatDate, formatQuantity } from "../../utils";

const PERIODOS = [
  { label: "Hoje", value: "hoje" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "90 dias", value: "90d" },
];

const TIPOS = [
  { label: "Todos", value: "" },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
  { label: "Perdas", value: "perda" },
  { label: "Ajustes", value: "ajuste" },
];

const TIPO_STYLE = {
  entrada: { bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400", label: "Entrada" },
  saida: { bg: "bg-red-500/15", text: "text-red-700 dark:text-red-400", label: "Saída" },
  perda: { bg: "bg-orange-500/15", text: "text-orange-700 dark:text-orange-400", label: "Perda" },
  ajuste: { bg: "bg-purple-500/15", text: "text-purple-700 dark:text-purple-400", label: "Ajuste" },
};

function calcularIntervalo(periodo) {
  const fim = new Date();
  const inicio = new Date();
  if (periodo === "hoje") inicio.setHours(0, 0, 0, 0);
  else if (periodo === "7d") inicio.setDate(inicio.getDate() - 7);
  else if (periodo === "30d") inicio.setDate(inicio.getDate() - 30);
  else if (periodo === "90d") inicio.setDate(inicio.getDate() - 90);
  return { inicio, fim };
}

export default function Movimentacoes() {
  const { empresa } = useEmpresa();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [cards, setCards] = useState({
    entradas_valor: 0,
    saidas_valor: 0,
    perdas_valor: 0,
    total_movimentacoes: 0,
  });
  const [periodo, setPeriodo] = useState("30d");
  const [tipo, setTipo] = useState("");
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const idEmpresa = empresa?.id_empresa;

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const { inicio, fim } = calcularIntervalo(periodo);
      const [dash, lista] = await Promise.all([
        viewServices.getDashboardCards(idEmpresa),
        movimentacaoService.getAll({
          tipo: tipo || undefined,
          dataInicio: inicio.toISOString(),
          dataFim: fim.toISOString(),
        }),
      ]);
      const c = Array.isArray(dash) ? dash[0] : dash;
      setCards({
        entradas_valor: Number(c?.entradas_valor) || 0,
        saidas_valor: Number(c?.saidas_valor) || 0,
        perdas_valor: Number(c?.perdas_valor) || 0,
        total_movimentacoes: Number(c?.total_movimentacoes) || 0,
      });
      setMovimentacoes(lista || []);
    } catch (e) {
      console.error(e);
      setErro(e?.message || "Erro ao carregar movimentações.");
    } finally {
      setLoading(false);
    }
  }, [periodo, tipo, idEmpresa]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtradas = useMemo(() => {
    if (!busca.trim()) return movimentacoes;
    const term = busca.toLowerCase();
    return movimentacoes.filter((m) => {
      const nome = m.lote?.ingrediente?.nm_ingrediente?.toLowerCase() || "";
      const cat = m.lote?.ingrediente?.categoria?.nm_categoria?.toLowerCase() || "";
      const motivo = m.motivo?.toLowerCase() || "";
      return nome.includes(term) || cat.includes(term) || motivo.includes(term);
    });
  }, [movimentacoes, busca]);

  const topCategorias = useMemo(() => {
    const mapa = {};
    movimentacoes
      .filter((m) => m.tipo_movimentacao === "saida")
      .forEach((m) => {
        const cat = m.lote?.ingrediente?.categoria?.nm_categoria || "Sem categoria";
        const valor = (Number(m.quantidade) || 0) * (Number(m.vl_unitario_momento) || 0);
        mapa[cat] = (mapa[cat] || 0) + valor;
      });
    return Object.entries(mapa)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 4);
  }, [movimentacoes]);

  const limparFiltros = () => {
    setPeriodo("30d");
    setTipo("");
    setBusca("");
  };

  if (loading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar page="Movimentações" desc="Carregando..." />
          <div className="flex justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]" />
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
          page="Movimentações"
          desc="Registro de entradas, saídas e alterações no estoque."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 md:mb-8">
          <EntradasMesCard valor={cards.entradas_valor} loading={false} />
          <SaidasMesCard valor={cards.saidas_valor} loading={false} />
          <PerdasMesCard valor={cards.perdas_valor} loading={false} />
          <TotalMovimentacoesCard valor={cards.total_movimentacoes} loading={false} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3 bg-white dark:bg-[#181330] rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Movimentações recentes
                </h2>
                <button
                  onClick={() => setModalAberto(true)}
                  className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm cursor-pointer active:scale-95 transition-all"
                >
                  <img src="/icons/plus-circle-branco.svg" alt="" className="w-4 h-4" />
                  Nova movimentação
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <input
                    type="text"
                    placeholder="Buscar por ingrediente, categoria ou motivo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full border border-gray-200 dark:border-slate-700 dark:bg-[#0B071E] dark:text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm"
                  />
                  <img
                    src="/icons/search-cinza.svg"
                    alt="Buscar"
                    className="absolute left-3 top-3 w-4 h-4"
                  />
                </div>

                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#8B5CF6]"
                >
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>

                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#8B5CF6]"
                >
                  {PERIODOS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>

                <button
                  onClick={limparFiltros}
                  className="text-xs font-medium text-gray-500 hover:text-[#8B5CF6] px-2 py-2.5 transition-colors"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left text-gray-600 dark:text-gray-300 min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-[#0B071E] text-[10px] sm:text-xs uppercase font-semibold tracking-wide text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Data/Hora</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Ingrediente</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Motivo</th>
                    <th className="px-4 py-3 text-right">Qtd.</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                    <th className="px-4 py-3">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                        Nenhuma movimentação encontrada no período.
                      </td>
                    </tr>
                  ) : (
                    filtradas.map((m) => {
                      const tipoInfo = TIPO_STYLE[m.tipo_movimentacao] || TIPO_STYLE.saida;
                      const valor = (Number(m.quantidade) || 0) * (Number(m.vl_unitario_momento) || 0);
                      return (
                        <tr
                          key={m.id_movimentacao}
                          className="border-b border-gray-100 dark:border-slate-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-[#1a1534] transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatDate(m.hora_movimentacao)}
                            <span className="ml-1 text-[11px]">
                              {m.hora_movimentacao
                                ? new Date(m.hora_movimentacao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                                : ""}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ${tipoInfo.bg} ${tipoInfo.text}`}>
                              {tipoInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                            {m.lote?.ingrediente?.nm_ingrediente || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {m.lote?.ingrediente?.categoria?.nm_categoria || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 truncate max-w-[180px]">
                            {m.motivo || "-"}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            {formatQuantity(
                              m.quantidade || 0,
                              m.lote?.ingrediente?.unidade_medida?.sg_unidade || "",
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                            {formatCurrency(valor)}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {m.solicitante?.nm_usuario || "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-[#181330] rounded-xl sm:rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Top categorias em saídas
              </h3>
              {topCategorias.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Nenhuma saída no período.
                </p>
              ) : (
                <div className="space-y-2">
                  {topCategorias.map((c) => (
                    <div key={c.nome} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {c.nome}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(c.valor)}
                        </p>
                      </div>
                      <img src="/icons/arrow-down-circle-verde.svg" alt="" className="w-5 h-5 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>

      {modalAberto && (
        <ModalNovaMovimentacao
          onClose={() => setModalAberto(false)}
          onSuccess={carregar}
        />
      )}
    </>
  );
}