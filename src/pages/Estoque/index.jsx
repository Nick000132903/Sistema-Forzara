import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HeaderBar,
  ItemsCriticosCard,
  ItemsFaltandoCard,
  Layout,
  SideBar,
  TotalItensEstoqueCard,
  ValorTotalEstoqueCard,
  TabelaIngredientesEstoque,
  ModalNovoIngrediente,
  ModalNovoProduto,
  DetalheIngrediente,
} from "../../components";
import { useEmpresa } from "../../contexts";
import { viewServices } from "../../services";
import { sortData } from "../../utils";

export default function Estoque() {
  const { empresa } = useEmpresa();
  const navigate = useNavigate();
  const location = useLocation();
  const menuNovoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("nm_ingrediente");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [menuNovoAberto, setMenuNovoAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(null); // 'ingrediente' | 'produto' | null
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState(null);
  const [numerario, setNumerario] = useState({
    total_itens_estoque: 0,
    itens_criticos: 0,
    itens_falta: 0,
    total_estoque_valor: 0,
  });

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [cards, estoque] = await Promise.all([
        viewServices.getDashboardCards(empresa?.id_empresa),
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
      setErro(e?.message || "Erro ao carregar estoque.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const st = location.state;
    if (!st) return;
    if (st.searchTerm) setSearchTerm(st.searchTerm);
    if (st.ingredienteId) {
      setIngredienteSelecionado({ id_ingrediente: st.ingredienteId });
    }
  }, [location.state]);

  useEffect(() => {
    const handler = (e) => {
      if (menuNovoRef.current && !menuNovoRef.current.contains(e.target)) {
        setMenuNovoAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categoriasUnicas = [
    ...new Set(ingredientes.map((i) => i.nm_categoria).filter(Boolean)),
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
    const term = searchTerm.toLowerCase();
    const okBusca =
      !term ||
      i.nm_ingrediente?.toLowerCase().includes(term) ||
      i.nm_categoria?.toLowerCase().includes(term) ||
      i.fornecedor_preferencial?.toLowerCase().includes(term);

    const okStatus =
      filtroStatus === "todos" ||
      i.status_estoque?.toLowerCase() === filtroStatus.toLowerCase();

    const okCat =
      filtroCategoria === "todas" || i.nm_categoria === filtroCategoria;

    const okAtivo =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativo" && i.ic_ativo === true) ||
      (filtroAtivo === "inativo" && i.ic_ativo === false);

    return okBusca && okStatus && okCat && okAtivo;
  });

  const ordenados = sortData(filtrados, sortField, sortDirection);

  const limparFiltros = () => {
    setFiltroStatus("todos");
    setFiltroCategoria("todas");
    setFiltroAtivo("todos");
    setSearchTerm("");
  };

  const abrirDetalhe = (id) => {
    const item = ingredientes.find((i) => i.id_ingrediente === id);
    if (item) setIngredienteSelecionado(item);
  };

  const abrirNovo = (tipo) => {
    setMenuNovoAberto(false);
    setModalAberto(tipo);
  };

  if (loading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar
            page="Estoque"
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
            page="Estoque"
            desc="Erro ao carregar."
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
          />
          <div className="max-w-md mx-auto mt-16 p-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {erro}
            </p>
            <button
              onClick={carregar}
              className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium"
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
      <SideBar />
      <Layout>
        <HeaderBar
          page="Estoque"
          desc="Controle total sobre o seu inventário em tempo real."
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 mt-6">
          <TotalItensEstoqueCard
            quantidade={numerario.total_itens_estoque}
            loading={false}
          />
          <ItemsCriticosCard
            quantidade={numerario.itens_criticos}
            loading={false}
          />
          <ItemsFaltandoCard
            quantidade={numerario.itens_falta}
            loading={false}
          />
          <ValorTotalEstoqueCard
            valor={numerario.total_estoque_valor}
            loading={false}
          />
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-md">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-surface-dark dark:text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] shadow-sm text-sm"
            />
            <img
              src="/icons/search-cinza.svg"
              alt="Buscar"
              className="absolute left-3 top-3 w-4 h-4"
            />
          </div>

          <button
            onClick={limparFiltros}
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
          >
            Limpar
          </button>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#8B5CF6]"
          >
            <option value="todos">Status: Todos</option>
            <option value="normal">Normal</option>
            <option value="baixo">Baixo</option>
            <option value="crítico">Crítico</option>
            <option value="em falta">Em Falta</option>
          </select>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#8B5CF6]"
          >
            <option value="todas">Categoria: Todas</option>
            {categoriasUnicas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filtroAtivo}
            onChange={(e) => setFiltroAtivo(e.target.value)}
            className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#8B5CF6]"
          >
            <option value="todos">Situação: Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>

          <div className="relative" ref={menuNovoRef}>
            <button
              onClick={() => setMenuNovoAberto((v) => !v)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover transition-colors text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm cursor-pointer active:scale-95"
            >
              <img
                src="/icons/plus-circle-branco.svg"
                alt="Novo"
                className="w-5 h-5"
              />
              Novo Item
            </button>
            {menuNovoAberto && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-30">
                <button
                  onClick={() => abrirNovo("ingrediente")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                >
                  <img
                    src="/icons/package-roxo.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                  Novo Ingrediente
                </button>
                <button
                  onClick={() => abrirNovo("produto")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                >
                  <img
                    src="/icons/shopping-bag-verde.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                  Novo Produto
                </button>
              </div>
            )}
          </div>
        </div>

        <TabelaIngredientesEstoque
          ingredientes={ordenados}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={abrirDetalhe}
        />
      </Layout>

      {modalAberto === "ingrediente" && (
        <ModalNovoIngrediente
          onClose={() => setModalAberto(null)}
          onSuccess={carregar}
        />
      )}

      {modalAberto === "produto" && (
        <ModalNovoProduto
          onClose={() => setModalAberto(null)}
          onSuccess={carregar}
        />
      )}

      {ingredienteSelecionado && (
        <DetalheIngrediente
          ingrediente={ingredienteSelecionado}
          onClose={() => setIngredienteSelecionado(null)}
          onMovimentar={(id) =>
            navigate("/movimentacoes", { state: { ingredienteId: id } })
          }
        />
      )}
    </>
  );
}
