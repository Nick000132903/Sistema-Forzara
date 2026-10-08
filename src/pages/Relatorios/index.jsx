import { useState } from "react";
import {
  SideBar,
  HeaderBar,
  FiltroRelatorio,
  GraficoBarras,
  GraficoPizza,
  TabelaRelatorio,
  FaturamentoMesCard,
  ReposicoesMesCard,
  TaxaSaidasMesCard,
  TotalClientesMesCard,
  PerdasMesCardRelatorio,
  EntradasMesCardRelatorio,
  Layout,
} from "../../components";
import {
  faturamentoMensal,
  cmvMensal,
  topProdutos,
} from "../../data/dataRelatorios";
import {
  filterByCategory,
  getUniqueCategories,
  getTopThree,
  sortData,
} from "../../utils";

export default function Relatorios() {
  const [dataSelecionada, setDataSelecionada] = useState("mar2026");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroOrdenacao, setFiltroOrdenacao] = useState("total_quantidade");

  const categorias = getUniqueCategories(topProdutos);
  const produtosFiltrados = sortData(
    filterByCategory(topProdutos, filtroCategoria),
    filtroOrdenacao,
    "desc",
  );
  const dadosPizza = getTopThree(topProdutos, "total_valor");

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Relatórios"
          desc="Relatórios detalhados do sistema em geral."
        />

        <FiltroRelatorio
          dataSelecionada={dataSelecionada}
          setDataSelecionada={setDataSelecionada}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          filtroOrdenacao={filtroOrdenacao}
          setFiltroOrdenacao={setFiltroOrdenacao}
          categorias={categorias}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mt-6">
          <FaturamentoMesCard valor="12000" variacao="18" />
          <ReposicoesMesCard valor="433" variacao="12" />
          <TaxaSaidasMesCard valor="7.2" variacao="2.1" />
          <TotalClientesMesCard valor="213" variacao="15" />
          <PerdasMesCardRelatorio valor="18" variacao="3" />
          <EntradasMesCardRelatorio valor="173" variacao="7" />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficoBarras
            titulo="Faturamento Mensal"
            dados={faturamentoMensal}
            cor="#8B5CF6"
          />
          <GraficoBarras titulo="CMV Mensal" dados={cmvMensal} cor="#5B21B6" />
        </div>

        <div className="mt-6 mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GraficoPizza titulo="Top 3 Produtos" dados={dadosPizza} />
          <TabelaRelatorio produtos={produtosFiltrados} />
        </div>
      </Layout>
    </>
  );
}
