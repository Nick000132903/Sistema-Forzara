import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EntradasMesCardRelatorio,
  FaturamentoMesCard,
  GraficoBarras,
  GraficoPizza,
  HeaderBar,
  Layout,
  PerdasMesCardRelatorio,
  ReposicoesMesCard,
  SideBar,
  TaxaSaidasMesCard,
  TabelaRelatorio,
  TotalClientesMesCard,
} from "../../components";
import FiltroRelatorio from "../../components/Especificos/Relatorios/FiltroRelatorio";
import { viewServices } from "../../services";
import {
  filterByCategory,
  getUniqueCategories,
  getTopThree,
  sortData,
  downloadCSV,
  printReport,
  buildFilename,
} from "../../utils";

const PERIODOS = [
  { value: "30d", label: "30 dias", dias: 30 },
  { value: "90d", label: "90 dias", dias: 90 },
  { value: "180d", label: "6 meses", dias: 180 },
  { value: "365d", label: "12 meses", dias: 365 },
];

export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [periodo, setPeriodo] = useState("90d");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroOrdenacao, setFiltroOrdenacao] = useState("total_quantidade");

  const [resumo, setResumo] = useState({});
  const [serieMensal, setSerieMensal] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [variacoes, setVariacoes] = useState({});

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [r, serie, prods] = await Promise.all([
        viewServices.getDadosRelatorios(),
        viewServices.getDadosGraficoFinanceiro(),
        viewServices.getTop10ProdutosMaisVendidos(),
      ]);
      setResumo(r || {});
      setSerieMensal(serie || []);
      setTopProdutos(prods || []);

      if (serie?.length >= 2) {
        const atual = serie[serie.length - 1];
        const ant = serie[serie.length - 2];
        setVariacoes({
          faturamento: calcVar(atual.faturamento, ant.faturamento),
          cmv: calcVar(atual.cmv, ant.cmv),
          lucro: calcVar(atual.lucro_bruto, ant.lucro_bruto),
          pedidos: calcVar(atual.faturamento, ant.faturamento),
        });
      }
    } catch (e) {
      console.error(e);
      setErro(e?.message || "Erro ao carregar relatórios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const serieFiltrada = useMemo(() => {
    const config = PERIODOS.find((p) => p.value === periodo) || PERIODOS[1];
    const corte = new Date();
    corte.setMonth(corte.getMonth() - Math.ceil(config.dias / 30));
    return serieMensal.filter((m) => m.mes && new Date(m.mes) >= corte);
  }, [serieMensal, periodo]);

  const dadosFaturamento = useMemo(
    () =>
      serieFiltrada.map((m) => ({
        mes: m.mes_abreviado || m.mes_formatado || "",
        valor: Number(m.faturamento || 0),
      })),
    [serieFiltrada],
  );

  const dadosCMV = useMemo(
    () =>
      serieFiltrada.map((m) => ({
        mes: m.mes_abreviado || m.mes_formatado || "",
        valor: Number(m.cmv || 0),
      })),
    [serieFiltrada],
  );

  const categorias = useMemo(
    () => getUniqueCategories(topProdutos),
    [topProdutos],
  );

  const produtosFiltrados = useMemo(
    () =>
      sortData(
        filterByCategory(topProdutos, filtroCategoria),
        filtroOrdenacao,
        "desc",
      ),
    [topProdutos, filtroCategoria, filtroOrdenacao],
  );

  const dadosPizza = useMemo(
    () => getTopThree(topProdutos, "total_valor"),
    [topProdutos],
  );

  const taxaSaidas = useMemo(() => {
    const fat = Number(resumo.faturamento || 0);
    const sai = Number(resumo.saidas_valor || 0);
    if (!fat) return 0;
    return ((sai / fat) * 100).toFixed(1);
  }, [resumo]);

  const exportarPDF = () => printReport();

  const exportarCSV = (tipo) => {
    const hoje = new Date().toISOString().slice(0, 10);

    if (tipo === "resumo") {
      const rows = [
        ["Indicador", "Valor"],
        ["Faturamento", resumo.faturamento || 0],
        ["Lucro bruto", resumo.lucro_bruto || 0],
        ["Margem de lucro (%)", resumo.margem_lucro || 0],
        ["Total de pedidos", resumo.total_pedidos || 0],
        ["Ticket médio", resumo.ticket_medio || 0],
        ["Entradas (R$)", resumo.entradas_valor || 0],
        ["Saídas (R$)", resumo.saidas_valor || 0],
        ["Perdas (R$)", resumo.perdas_valor || 0],
        ["Clientes únicos", resumo.total_clientes || 0],
        ["Taxa de saídas (%)", taxaSaidas],
      ];
      downloadCSV(buildFilename("relatorio-resumo", periodo, hoje), rows);
      return;
    }

    if (tipo === "mensal") {
      const rows = [
        ["Mês", "Faturamento", "CMV", "Lucro bruto", "Margem (%)"],
        ...serieFiltrada.map((m) => [
          m.mes_formatado || m.mes_abreviado || "",
          m.faturamento || 0,
          m.cmv || 0,
          m.lucro_bruto || 0,
          m.margem_lucro || 0,
        ]),
      ];
      downloadCSV(buildFilename("relatorio-mensal", periodo, hoje), rows);
      return;
    }

    if (tipo === "produtos") {
      const rows = [
        [
          "Produto",
          "Categoria",
          "Quantidade vendida",
          "Faturamento (R$)",
          "Pedidos",
        ],
        ...produtosFiltrados.map((p) => [
          p.nm_produto || "",
          p.nm_categoria || "",
          p.total_quantidade || 0,
          p.total_valor || 0,
          p.total_pedidos || 0,
        ]),
      ];
      downloadCSV(buildFilename("relatorio-produtos", periodo, hoje), rows);
    }
  };

  if (loading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar page="Relatórios" desc="Carregando..." />
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
          page="Relatórios"
          desc="Relatórios detalhados do sistema em geral."
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

        <FiltroRelatorio
          periodo={periodo}
          setPeriodo={setPeriodo}
          periodos={PERIODOS}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          filtroOrdenacao={filtroOrdenacao}
          setFiltroOrdenacao={setFiltroOrdenacao}
          categorias={categorias}
          onExportPDF={exportarPDF}
          onExportCSV={exportarCSV}
        />

        <div id="print-area">
          <h1 className="hidden print:block text-xl font-bold mb-4">
            Relatório — Período:{" "}
            {PERIODOS.find((p) => p.value === periodo)?.label}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mt-2">
            <FaturamentoMesCard
              valor={resumo.faturamento || 0}
              variacao={variacoes.faturamento || 0}
            />
            <ReposicoesMesCard
              valor={resumo.total_pedidos || 0}
              variacao={variacoes.pedidos || 0}
            />
            <TaxaSaidasMesCard valor={taxaSaidas} variacao={0} />
            <TotalClientesMesCard
              valor={resumo.total_clientes || 0}
              variacao={0}
            />
            <PerdasMesCardRelatorio
              valor={resumo.perdas_valor || 0}
              variacao={0}
            />
            <EntradasMesCardRelatorio
              valor={resumo.entradas_valor || 0}
              variacao={0}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 avoid-break">
            <GraficoBarras
              titulo="Faturamento mensal"
              dados={dadosFaturamento}
              cor="#8B5CF6"
            />
            <GraficoBarras titulo="CMV mensal" dados={dadosCMV} cor="#5B21B6" />
          </div>

          <div className="mt-6 mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 avoid-break">
            <GraficoPizza titulo="Top 3 produtos" dados={dadosPizza} />
            <TabelaRelatorio produtos={produtosFiltrados} />
          </div>
        </div>
      </Layout>
    </>
  );
}

function calcVar(atual, anterior) {
  const a = Number(atual || 0);
  const b = Number(anterior || 0);
  if (!b) return 0;
  return ((a - b) / b) * 100;
}
