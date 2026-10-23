import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "../services";

const AuthContext = createContext();

const formatUser = (sessionUser) => {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    user_metadata: sessionUser.user_metadata || {},
    role: sessionUser.role || "authenticated",
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarUsuario = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("vincular_auth_usuario");
      if (error) throw error;
      setUsuario(data || null);
      return data || null;
    } catch (e) {
      console.error("Erro ao vincular usuário:", e);
      setUsuario(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      const u = formatUser(session?.user);
      setUser(u);
      if (u) await carregarUsuario();
      else setUsuario(null);
      setLoading(false);
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      const u = formatUser(session?.user);
      setUser(u);
      if (u) await carregarUsuario();
      setLoading(false);
    });
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [carregarUsuario]);

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await carregarUsuario();
      return data;
    },
    [carregarUsuario],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.sessionStorage.removeItem("supabase_remember_me");
    setUsuario(null);
  }, []);

  const updateUser = useCallback(async (metadata) => {
    const { data, error } = await supabase.auth.updateUser({ data: metadata });
    if (error) throw error;
    setUser((prev) =>
      prev
        ? { ...prev, user_metadata: { ...prev.user_metadata, ...metadata } }
        : prev,
    );
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      usuario,
      loading,
      signIn,
      signOut,
      updateUser,
      refreshUsuario: carregarUsuario,
    }),
    [user, usuario, loading, signIn, signOut, updateUser, carregarUsuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
