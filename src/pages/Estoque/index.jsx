import { useEffect, useState } from "react";
import {
  HeaderBar,
  ItemsCriticosCard,
  ItemsFaltandoCard,
  Layout,
  SideBar,
  TotalItensEstoqueCard,
  ValorTotalEstoqueCard,
  TabelaIngredientesEstoque,
} from "../../components";
import { viewServices } from "../../services";
import { sortData } from "../../utils";

export default function Estoque() {
  const [loading, setLoading] = useState(true);
  const [ingredientes, setIngredientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("nm_ingrediente");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroClassificacao, setFiltroClassificacao] = useState("todas");
  const [numerario, setNumerario] = useState({
    total_itens_estoque: 0,
    itens_criticos: 0,
    itens_falta: 0,
    total_estoque_valor: 0,
  });

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        const [cards, estoque] = await Promise.all([
          viewServices.getDashboardCards(),
          viewServices.getListagemIngredientes(),
        ]);
        setIngredientes(estoque || []);
        const c = Array.isArray(cards) ? cards[0] : cards;
        setNumerario({
          total_itens_estoque: c?.total_itens_estoque || 0,
          itens_criticos: c?.itens_criticos || 0,
          itens_falta: c?.itens_falta || 0,
          total_estoque_valor: c?.total_estoque_valor || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const categoriasUnicas = [
    ...new Set(ingredientes.map((i) => i.nm_categoria).filter(Boolean)),
  ];
  const classificacoesUnicas = [
    ...new Set(ingredientes.map((i) => i.classificacao).filter(Boolean)),
  ];

  const handleSort = (field) => {
    if (field === sortField)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filtrados = ingredientes.filter((i) => {
    const okBusca =
      !searchTerm ||
      i.nm_ingrediente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.nm_categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.fornecedor_preferencial
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const okStatus =
      filtroStatus === "todos" ||
      i.status_estoque?.toLowerCase() === filtroStatus.toLowerCase();

    const okCat =
      filtroCategoria === "todas" || i.nm_categoria === filtroCategoria;

    const okClass =
      filtroClassificacao === "todas" ||
      i.classificacao === filtroClassificacao;

    return okBusca && okStatus && okCat && okClass;
  });

  const ordenados = sortData(filtrados, sortField, sortDirection);

  const limparFiltros = () => {
    setFiltroStatus("todos");
    setFiltroCategoria("todas");
    setFiltroClassificacao("todas");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <>
        <SideBar />
        <main className="ml-0 lg:ml-60 p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
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
          page="Estoque"
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          desc="Controle total sobre o seu inventário em tempo real."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 mt-6">
          <TotalItensEstoqueCard
            quantidade={numerario.total_itens_estoque}
            loading={loading}
          />
          <ItemsCriticosCard
            quantidade={numerario.itens_criticos}
            loading={loading}
          />
          <ItemsFaltandoCard
            quantidade={numerario.itens_falta}
            loading={loading}
          />
          <ValorTotalEstoqueCard
            valor={numerario.total_estoque_valor}
            loading={loading}
          />
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative w-5/12">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-[#0B071E] dark:text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
            />
            <img
              src="/icons/search-cinza.svg"
              alt="Buscar"
              className="absolute left-3 top-3 w-4 h-4"
            />
          </div>

          <button
            onClick={limparFiltros}
            className="bg-white cursor-pointer dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1534] transition-colors"
          >
            Todos
          </button>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-purple-500"
          >
            <option value="todos">Status: Todos</option>
            <option value="Normal">Normal</option>
            <option value="Baixo">Baixo</option>
            <option value="Crítico">Crítico</option>
            <option value="Em Falta">Em Falta</option>
          </select>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-purple-500"
          >
            <option value="todas">Categoria: Todas</option>
            {categoriasUnicas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filtroClassificacao}
            onChange={(e) => setFiltroClassificacao(e.target.value)}
            className="bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-purple-500"
          >
            <option value="todas">Classificação: Todas</option>
            {classificacoesUnicas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm cursor-pointer">
            <img
              src="/icons/plus-circle-branco.svg"
              alt="Novo"
              className="w-5 h-5"
            />
            Novo Item
          </button>
        </div>

        <TabelaIngredientesEstoque
          ingredientes={ordenados}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(id) => console.log("Ingrediente:", id)}
        />
      </Layout>
    </>
  );
}