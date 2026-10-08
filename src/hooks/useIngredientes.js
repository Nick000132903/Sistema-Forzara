import { useEffect, useState } from "react";

import { ingredienteService } from "../services";

export function useIngredientes(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const result = await ingredienteService.getAll(filters);
        setData(result || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [filters]);

  return { data, loading, error };
}
