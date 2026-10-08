import { useEffect, useState } from "react";

import { viewServices } from "../services";

export function useProdutos() {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const result = await viewServices.getTop10ProdutosMaisVendidos();
        setTop10(result || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  return { top10, loading, error };
}
