import { useEffect, useState } from "react";
import { ingredienteService } from "../services";

export function useIngredientes(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchKey = filters?.search ?? "";
  const statusKey = filters?.status ?? "";

  useEffect(() => {
    let cancelled = false;

    const carregar = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await ingredienteService.getAll({
          search: searchKey,
          status: statusKey,
        });
        if (!cancelled) setData(result || []);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    carregar();
    return () => {
      cancelled = true;
    };
  }, [searchKey, statusKey]);

  return { data, loading, error };
}
