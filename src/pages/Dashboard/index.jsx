import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SideBar,
  HeaderBar,
  FaturamentoMesAtualCard,
  CMVMesAtualCard,
  LucroBrutoMesAtualCard,
  MargemLucroMesAtualCard,
  GraficoMovimentacoes,
  GraficoTopProdutos,
  TabelaIngredientes,
  Layout,
} from "../../components";
import { viewServices } from "../../services";
import { filterBySearch, sortData } from "../../utils";

const LIMITE_TABELA = 25;
const INTERVALO_TV = 30000;

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("nm_ingrediente");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modoTv, setModoTv] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [financeiro, setFinanceiro] = useState({
    faturamento: 0,
    cmv: 0,
    lucro_bruto: 0,
    margem_lucro_percentual: 0,
  });

  const carregarDados = useCallback(async () => {
    setErro(null);
    try {
      const [estoque, grafico, top, fin] = await Promise.all([
        viewServices.getListagemIngredientes(),
        viewServices.getDadosGraficoFinanceiro(),
        viewServices.getTop10ProdutosMaisVendidos(),
        viewServices.getDadosFinanceiros(),
      ]);
      setIngredientes((estoque || []).filter((i) => i.qt_atual > 0));
      setDadosGrafico(grafico || []);
      setTopProdutos(top || []);
      setFinanceiro({
        faturamento: fin?.faturamento || 0,
        cmv: fin?.cmv || 0,
        lucro_bruto: fin?.lucro_bruto || 0,
        margem_lucro_percentual: fin?.margem_lucro_percentual || 0,
      });
      setUltimaAtualizacao(new Date());
    } catch (e) {
      console.error("Erro ao carregar dashboard:", e);
      setErro(e?.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (!modoTv) return;
    const id = setInterval(carregarDados, INTERVALO_TV);
    return () => clearInterval(id);
  }, [modoTv, carregarDados]);

  useEffect(() => {
    const sync = async () => {
      try {
        if (modoTv && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (!modoTv && document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        /* fullscreen requer gesto do usuário — ignorável */
      }
    };
    sync();
  }, [modoTv]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filtrados = filterBySearch(ingredientes, searchTerm, "nm_ingrediente");
  const ingredientesOrdenados = sortData(filtrados, sortField, sortDirection);
  const visiveis = modoTv
    ? ingredientesOrdenados
    : ingredientesOrdenados.slice(0, LIMITE_TABELA);
  const temMais = ingredientesOrdenados.length > LIMITE_TABELA;

  const exportarCsv = () => {
    const linhas = [
      [
        "Ingrediente",
        "Categoria",
        "Quantidade",
        "Unidade",
        "Custo Médio (R$)",
        "Fornecedor",
        "Última Movimentação",
      ],
      ...ingredientesOrdenados.map((i) => [
        i.nm_ingrediente || "",
        i.nm_categoria || "",
        i.qt_atual ?? "",
        i.sg_unidade || "",
        i.vl_custo_medio ?? "",
        i.fornecedor_preferencial || "",
        i.ultima_movimentacao || "",
      ]),
    ];
    const csv = linhas
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-estoque-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar
            page="Dashboard"
            desc="Carregando..."
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
          />
          <div className="flex justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </Layout>
      </>
    );
  }

  if (erro) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar
            page="Dashboard"
            desc="Erro ao carregar dados."
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
          />
          <div className="max-w-md mx-auto mt-16 p-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {erro}
            </p>
            <button
              onClick={carregarDados}
              className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      {!modoTv && <SideBar />}
      <Layout>
        {!modoTv && (
          <HeaderBar
            page="Dashboard"
            desc="Dashboard executivo com métricas de performance."
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 min-w-0">
            {modoTv && (
              <span className="px-3 py-1.5 rounded-full bg-primary text-white text-[11px] font-bold tracking-wide animate-pulse-fast shrink-0">
                ● MODO TV
              </span>
            )}
            {ultimaAtualizacao && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Atualizado às{" "}
                {ultimaAtualizacao.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModoTv((v) => !v)}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-surface-dark-hover hover:bg-gray-200 dark:hover:bg-[#241b42] text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium transition-colors active:scale-95"
            >
              {modoTv ? "Sair do Modo TV" : "Modo TV"}
            </button>
            <button
              onClick={exportarCsv}
              className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium transition-colors active:scale-95"
            >
              Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 md:mb-8">
          <FaturamentoMesAtualCard
            valor={financeiro.faturamento}
            loading={false}
          />
          <CMVMesAtualCard valor={financeiro.cmv} loading={false} />
          <LucroBrutoMesAtualCard
            valor={financeiro.lucro_bruto}
            loading={false}
          />
          <MargemLucroMesAtualCard
            valor={financeiro.margem_lucro_percentual}
            loading={false}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white dark:bg-surface-dark p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center text-sm sm:text-base">
              Evolução Financeira — 6 Meses
            </h2>
            <GraficoMovimentacoes dados={dadosGrafico} />
          </div>
          <div className="bg-white dark:bg-surface-dark p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center text-sm sm:text-base">
              Top Produtos — Mais Vendidos
            </h2>
            <GraficoTopProdutos produtos={topProdutos} />
          </div>
        </div>

        <TabelaIngredientes
          ingredientes={visiveis}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(id) =>
            navigate("/estoque", { state: { ingredienteId: id } })
          }
        />

        {temMais && !modoTv && (
          <div className="text-center pb-6">
            <button
              onClick={() => navigate("/estoque")}
              className="text-sm text-primary hover:underline"
            >
              Ver todos os {ingredientesOrdenados.length} ingredientes →
            </button>
          </div>
        )}
      </Layout>
    </>
  );
}
