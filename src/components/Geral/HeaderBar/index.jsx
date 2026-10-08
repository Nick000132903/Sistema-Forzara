import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useEmpresa, useSidebar, useTheme } from "../../../contexts";
import NotificacoesBar from "../NotificacoesBar";
import { viewServices } from "../../../services";

export default function HeaderBar({ onSearch, searchTerm }) {
  const [aberto, setAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const { user, signOut } = useAuth();
  const { empresa } = useEmpresa();
  const { collapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const nomeUsuario =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const perfilS = user?.user_metadata?.role || "Funcionário";
  const perfil =
    perfilS.charAt(0).toUpperCase() + perfilS.slice(1).toLowerCase();

  const iniciais = nomeUsuario
    .split(" ")
    .map((p) => p[0])
    .slice(0, 1)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const carregar = async () => {
      if (!user) return;
      try {
        const data = await viewServices.getNotificacoes({ lida: false });
        setNotificacoesNaoLidas(data?.length || 0);
      } catch (e) {
        console.error(e);
      }
    };
    carregar();
    const interval = setInterval(carregar, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickFora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm?.trim()) {
      onSearch?.(searchTerm.trim());
      navigate("/estoque", { state: { searchTerm: searchTerm.trim() } });
    }
  };

  const handleLogout = async () => {
    setMenuAberto(false);
    await signOut();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 bg-white dark:bg-[#0B071E] border-b border-gray-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-all duration-300 left-0 ${
        collapsed ? "lg:left-16" : "lg:left-64"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar ingredientes, fornecedores..."
            value={searchTerm || ""}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#1a1534] border border-transparent dark:border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          />
          <img
            src="/icons/search-cinza.svg"
            alt="Buscar"
            className="absolute left-3.5 top-3 w-4 h-4"
          />
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full cursor-pointer bg-gray-100 dark:bg-[#1a1534] hover:bg-gray-200 dark:hover:bg-[#241b42] transition-colors"
          >
            <img
              src={
                theme === "dark"
                  ? "/icons/sun-amarelo.svg"
                  : "/icons/moon-cinza.svg"
              }
              alt="Tema"
              className="w-4 h-4"
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setAberto(!aberto)}
              className="p-2.5 rounded-full cursor-pointer bg-gray-100 dark:bg-[#1a1534] hover:bg-gray-200 dark:hover:bg-[#241b42] transition-colors relative"
            >
              <img
                src="/icons/bell-cinza.svg"
                alt="Notificações"
                className="w-4 h-4"
              />
              {notificacoesNaoLidas > 0 && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#8B5CF6] rounded-full" />
              )}
            </button>
            {aberto && (
              <NotificacoesBar
                onClose={() => {
                  setAberto(false);
                  setNotificacoesNaoLidas(0);
                }}
              />
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="flex items-center gap-3 pl-3 ml-1 border-l border-gray-200 dark:border-slate-800 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#3B0FBF] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {iniciais}
              </div>
              <div className="hidden sm:flex flex-col leading-tight text-left">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {nomeUsuario}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {perfil}
                </span>
              </div>
              <img
                src="/icons/arrow-down-cinza.svg"
                alt="Menu"
                className={`w-3.5 h-3.5 hidden sm:block transition-transform duration-200 ${
                  menuAberto ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuAberto && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#0B071E] border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#3B0FBF] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {iniciais}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {nomeUsuario}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-purple-50 dark:bg-[#1e1538] text-[#8B5CF6]">
                      {perfil}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">
                      {empresa?.nm_empresa || "Empresa"}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setMenuAberto(false);
                      navigate("/configuracoes");
                    }}
                    className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1534] transition-colors"
                  >
                    <img
                      src="/icons/user-cinza.svg"
                      alt="Perfil"
                      className="w-4 h-4"
                    />
                    Meu Perfil
                  </button>

                  <button
                    onClick={() => {
                      setMenuAberto(false);
                      navigate("/configuracoes");
                    }}
                    className="w-full flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1534] transition-colors"
                  >
                    <img
                      src="/icons/settings-cinza.svg"
                      alt="Configurações"
                      className="w-4 h-4"
                    />
                    Configurações
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <img
                      src="/icons/log-out-vermelho.svg"
                      alt="Sair"
                      className="w-4 h-4"
                    />
                    Sair da Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
