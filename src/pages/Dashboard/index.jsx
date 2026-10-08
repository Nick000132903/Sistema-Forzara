import { useEffect, useState } from "react";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ingredientes, setIngredientes] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("nm_ingrediente");
  const [sortDirection, setSortDirection] = useState("asc");
  const [financeiro, setFinanceiro] = useState({
    faturamento: 0,
    cmv: 0,
    lucro_bruto: 0,
    margem_lucro_percentual: 0,
  });

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const [estoque, grafico, top, fin] = await Promise.all([
          viewServices.getListagemIngredientes(),
          viewServices.getDadosGraficoFinanceiro(),
          viewServices.getTop10ProdutosMaisVendidos(),
          viewServices.getDadosFinanceiros(),
        ]);
        setIngredientes(
          (estoque || []).filter((i) => i.qt_atual > 0).slice(0, 25),
        );
        setDadosGrafico(grafico || []);
        setTopProdutos(top || []);
        setFinanceiro({
          faturamento: fin?.faturamento || 0,
          cmv: fin?.cmv || 0,
          lucro_bruto: fin?.lucro_bruto || 0,
          margem_lucro_percentual: fin?.margem_lucro_percentual || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const ingredientesOrdenados = sortData(
    filterBySearch(ingredientes, searchTerm, "nm_ingrediente"),
    sortField,
    sortDirection,
  );

  if (loading) {
    return (
      <>
        <SideBar />
        <main className="ml-0 lg:ml-60 p-4 sm:p-6 bg-[#F8FAFC] dark:bg-[#0B071E] min-h-screen">
          <HeaderBar onSearch={setSearchTerm} searchTerm={searchTerm} />
          <div className="flex justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Dashboard"
          desc="Dashboard executivo com métricas de performance."
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 md:mb-8">
          <FaturamentoMesAtualCard
            valor={financeiro.faturamento}
            loading={loading}
          />
          <CMVMesAtualCard valor={financeiro.cmv} loading={loading} />
          <LucroBrutoMesAtualCard
            valor={financeiro.lucro_bruto}
            loading={loading}
          />
          <MargemLucroMesAtualCard
            valor={financeiro.margem_lucro_percentual}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white dark:bg-[#0B071E] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center text-sm sm:text-base">
              Evolução Financeira - 6 Meses
            </h2>
            <div className="w-full overflow-x-auto">
              <div className="min-w-75">
                <GraficoMovimentacoes dados={dadosGrafico} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0B071E] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center text-sm sm:text-base">
              Top Produtos - Mais Vendidos
            </h2>
            <div className="w-full overflow-x-auto">
              <div className="min-w-75">
                <GraficoTopProdutos produtos={topProdutos} />
              </div>
            </div>
          </div>
        </div>

        <TabelaIngredientes
          ingredientes={ingredientesOrdenados}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(id) =>
            navigate("/estoque", { state: { ingredienteId: id } })
          }
        />
      </Layout>
    </>
  );
}
