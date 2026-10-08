import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import { empresaService } from "../services";

const EmpresaContext = createContext();

export function EmpresaProvider({ children }) {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEmpresa = async () => {
      if (!user) {
        setEmpresa(null);
        setLoading(false);
        return;
      }

      try {
        const data = await empresaService.getEmpresaByAuthId(user.id);
        setEmpresa(data);
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
        setEmpresa(null);
      } finally {
        setLoading(false);
      }
    };

    carregarEmpresa();
  }, [user]);

  return (
    <EmpresaContext.Provider value={{ empresa, loading }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error("useEmpresa must be used within an EmpresaProvider");
  }
  return context;
}
