import { useEffect, useState } from "react";

import { viewServices, ingredienteService } from "../services";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardCards, setDashboardCards] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cards, estoque, movimentos, top] = await Promise.all([
          viewServices.getDashboardCards(),
          ingredienteService.getAll({ search: searchTerm }),
          viewServices.getMovimentacoesUltimos6Meses(),
          viewServices.getTop10ProdutosMaisVendidos(),
        ]);

        setDashboardCards(cards || {});
        setIngredientes(estoque || []);
        setMovimentacoes(movimentos || []);
        setTopProdutos(top || []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [searchTerm]);

  return {
    dashboardCards,
    ingredientes,
    movimentacoes,
    topProdutos,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  };
}
