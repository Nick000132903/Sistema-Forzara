import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HeaderBar, Layout, SideBar } from "../../components";
import ModalPerfil from "../../components/Especificos/Configuracoes/ModalPerfil";
import ModalPreferencias from "../../components/Especificos/Configuracoes/ModalPreferencias";
import ModalSobre from "../../components/Especificos/Configuracoes/ModalSobre";
import ModalUsuarios from "../../components/Especificos/Configuracoes/ModalUsuarios";
import { useAuth, useEmpresa, useTheme } from "../../contexts";
import { configuracaoService } from "../../services/configuracaoService";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { usuario, user } = useAuth();
  const { empresa } = useEmpresa();
  const { theme, setTheme } = useTheme();

  const [configs, setConfigs] = useState({});
  const [modal, setModal] = useState(null);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  const isGerente = ["gerente", "admin", "administrador"].includes(
    usuario?.tipo_perfil?.toLowerCase() || "",
  );

  const carregarConfigs = useCallback(async () => {
    if (!empresa?.id_empresa) return;
    try {
      const data = await configuracaoService.getAll(empresa.id_empresa);
      setConfigs(data || {});
      setNotificacoesAtivas(data?.notificacoes_ativas !== "false");
    } catch (e) {
      console.error(e);
    }
  }, [empresa?.id_empresa]);

  useEffect(() => {
    carregarConfigs();
  }, [carregarConfigs]);

  const toggleNotificacoes = async () => {
    if (!empresa?.id_empresa) return;
    const novo = !notificacoesAtivas;
    setNotificacoesAtivas(novo);
    try {
      await configuracaoService.set(
        empresa.id_empresa,
        "notificacoes_ativas",
        novo ? "true" : "false",
      );
    } catch (e) {
      console.error(e);
      setNotificacoesAtivas(!novo);
    }
  };

  const alterarTema = (valor) => {
    if (valor === "claro") setTheme("light");
    else if (valor === "escuro") setTheme("dark");
    else {
      const prefereEscuro = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefereEscuro ? "dark" : "light");
    }
  };

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Configurações"
          desc="Gerenciamento das preferências e dados do sistema."
        />

        {!usuario && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Sua conta ainda não está vinculada a uma empresa. Peça ao
              administrador para criar seu registro em <code>usuario</code> com
              o e-mail <strong>{user?.email}</strong>.
            </p>
          </div>
        )}

        <div className="max-w-5xl mx-auto mt-6 space-y-3">
          <CardSecao
            titulo="Perfil da conta"
            descricao="Atualize suas informações pessoais"
            icone={IconPerfil}
            acao={
              <button
                onClick={() => setModal("perfil")}
                className="cursor-pointer w-auto px-3 h-8 bg-primary hover:bg-primary-hover text-white text-xs rounded-md flex items-center gap-1.5 active:scale-95"
              >
                Editar
              </button>
            }
          />

          <CardSecao
            titulo="Preferências"
            descricao="Metas de CMV, alertas de validade e aprovações"
            icone={IconEscudo}
            acao={
              <button
                onClick={() => setModal("preferencias")}
                disabled={!empresa}
                className="cursor-pointer px-3 h-8 bg-gray-300/40 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-md flex items-center gap-1.5 disabled:opacity-40 active:scale-95"
              >
                Configurar
              </button>
            }
          />

          <CardSecao
            titulo="Segurança"
            descricao="Altere sua senha de acesso"
            icone={IconCadeado}
            acao={
              <button
                onClick={() => navigate("/atualizar-senha")}
                className="cursor-pointer px-3 h-8 bg-gray-300/40 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-md flex items-center gap-1.5 active:scale-95"
              >
                Alterar senha
              </button>
            }
          />

          <CardSecao
            titulo="Notificações"
            descricao="Ligue ou desligue os alertas do sistema"
            icone={IconSino}
            acao={
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificacoesAtivas}
                  onChange={toggleNotificacoes}
                  className="sr-only peer"
                  disabled={!empresa}
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 peer-checked:bg-primary rounded-full peer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5" />
              </label>
            }
          />

          <CardSecao
            titulo="Aparência"
            descricao="Escolha o tema da interface"
            icone={IconPincel}
            acao={
              <select
                value={theme === "dark" ? "escuro" : "claro"}
                onChange={(e) => alterarTema(e.target.value)}
                className="w-32 p-1.5 h-8 bg-gray-300/40 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                <option value="claro">Tema claro</option>
                <option value="escuro">Tema escuro</option>
              </select>
            }
          />

          {isGerente && (
            <CardSecao
              titulo="Usuários"
              descricao="Cadastre e gerencie usuários da empresa"
              icone={IconUsuarios}
              acao={
                <button
                  onClick={() => setModal("usuarios")}
                  disabled={!empresa}
                  className="cursor-pointer px-3 h-8 bg-gray-300/40 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-md flex items-center gap-1.5 disabled:opacity-40 active:scale-95"
                >
                  Gerenciar
                </button>
              }
            />
          )}

          <CardSecao
            titulo="Sobre o sistema"
            descricao="Informações da versão e licenças"
            icone={IconInfo}
            acao={
              <button
                onClick={() => setModal("sobre")}
                className="cursor-pointer px-3 h-8 bg-gray-300/40 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs rounded-md flex items-center gap-1.5 active:scale-95"
              >
                Ver informações
              </button>
            }
          />
        </div>
      </Layout>

      {modal === "perfil" && <ModalPerfil onClose={() => setModal(null)} />}
      {modal === "preferencias" && (
        <ModalPreferencias
          configs={configs}
          onClose={() => setModal(null)}
          onSaved={(novos) => setConfigs({ ...configs, ...novos })}
        />
      )}
      {modal === "usuarios" && <ModalUsuarios onClose={() => setModal(null)} />}
      {modal === "sobre" && <ModalSobre onClose={() => setModal(null)} />}
    </>
  );
}

function CardSecao({ titulo, descricao, icone: Icone, acao }) {
  return (
    <div className="bg-white dark:bg-surface-dark-elevated rounded-xl p-5 flex items-center justify-between gap-4 border border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex justify-center items-center shrink-0">
          <Icone />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 truncate">
            {titulo}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {descricao}
          </p>
        </div>
      </div>
      <div className="shrink-0">{acao}</div>
    </div>
  );
}

// ============ Ícones (identidade preservada) ============
const IconPerfil = () => (
  <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
    <g transform="translate(-180 -2159)" fill="#7b2cbf">
      <g transform="translate(56 160)">
        <path d="M134,2008.99998 C131.783496,2008.99998 129.980955,2007.20598 129.980955,2004.99998 C129.980955,2002.79398 131.783496,2000.99998 134,2000.99998 C136.216504,2000.99998 138.019045,2002.79398 138.019045,2004.99998 C138.019045,2007.20598 136.216504,2008.99998 134,2008.99998 M137.775893,2009.67298 C139.370449,2008.39598 140.299854,2006.33098 139.958235,2004.06998 C139.561354,2001.44698 137.368965,1999.34798 134.722423,1999.04198 C131.070116,1998.61898 127.971432,2001.44898 127.971432,2004.99998 C127.971432,2006.88998 128.851603,2008.57398 130.224107,2009.67298 C126.852128,2010.93398 124.390463,2013.89498 124.004634,2017.89098 C123.948368,2018.48198 124.411563,2018.99998 125.008391,2018.99998 C125.519814,2018.99998 125.955881,2018.61598 126.001095,2018.10898 C126.404004,2013.64598 129.837274,2010.99998 134,2010.99998 C138.162726,2010.99998 141.595996,2013.64598 141.998905,2018.10898 C142.044119,2018.61598 142.480186,2018.99998 142.991609,2018.99998 C143.588437,2018.99998 144.051632,2018.48198 143.995366,2017.89098 C143.609537,2013.89498 141.147872,2010.93398 137.775893,2009.67298" />
      </g>
    </g>
  </svg>
);

const IconEscudo = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path
      fill="none"
      stroke="#77008f"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24,12.41a7.26,7.26,0,0,0-7.26,7.26h0c0,5.68,5.56,12.53,7,14.21a.43.43,0,0,0,.62,0l.05,0c1.41-1.68,6.85-8.52,6.85-14.2A7.26,7.26,0,0,0,24,12.41Zm0,10a2.72,2.72,0,1,1,2.71-2.73v0A2.71,2.71,0,0,1,24,22.38Z"
    />
    <path
      fill="none"
      stroke="#77008f"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22.2,4.86,6.69,11.25V27C6.69,35.44,24,43.5,24,43.5S41.31,35.44,41.31,27V11.25L25.8,4.86A4.68,4.68,0,0,0,22.2,4.86Z"
    />
  </svg>
);

const IconCadeado = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <path
      fill="none"
      stroke="#77008f"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M25,6.7c-3.4,0-6.6-1.4-9-3.7c-2.4,2.3-5.6,3.7-9,3.7C5.6,6.7,4.3,6.4,3,6c0,14,5.5,19.6,13,23c7.5-3.4,13-9,13-23C27.7,6.4,26.4,6.7,25,6.7z"
    />
    <path
      fill="none"
      stroke="#77008f"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19,22h-6c-1.1,0-2-0.9-2-2v-4c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2v4C21,21.1,20.1,22,19,22z"
    />
    <path
      fill="none"
      stroke="#77008f"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20,14h-8v-2c0-2.2,1.8-4,4-4h0c2.2,0,4,1.8,4,4V14z"
    />
    <line
      fill="none"
      stroke="#77008f"
      strokeWidth="2"
      strokeLinecap="round"
      x1="16"
      y1="17"
      x2="16"
      y2="19"
    />
  </svg>
);

const IconSino = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.04283 5.1757C8.59546 4.75121 9.24946 4.43224 10.0136 4.23441C10.0046 4.15752 10 4.0793 10 4C10 2.89543 10.8955 2 12 2C13.1046 2 14 2.89543 14 4C14 4.0793 13.9954 4.15752 13.9864 4.23441C14.7506 4.43224 15.4046 4.75121 15.9572 5.1757C16.933 5.92519 17.4981 6.93095 17.8325 7.93362C18.1644 8.92891 18.2842 9.96595 18.3426 10.8395C18.3663 11.1941 18.3806 11.5351 18.3932 11.8357L18.4018 12.0385C18.4175 12.3994 18.433 12.6684 18.4596 12.8673C18.6553 14.329 18.8982 15.3543 19.2438 16.1741C19.5816 16.9754 20.0345 17.6202 20.7071 18.2929C20.9931 18.5789 21.0787 19.009 20.9239 19.3827C20.7691 19.7564 20.4045 20 20 20H13.7325C13.9026 20.2942 14 20.6357 14 21C14 22.1046 13.1046 23 12 23C10.8955 23 10 22.1046 10 21C10 20.6357 10.0974 20.2942 10.2676 20H4.00003C3.59557 20 3.23093 19.7564 3.07615 19.3827C2.92137 19.009 3.00692 18.5789 3.29292 18.2929C3.96694 17.6189 4.4186 16.9787 4.75553 16.1809C5.1004 15.3642 5.3434 14.3395 5.54043 12.8673C5.56706 12.6684 5.58255 12.3994 5.59827 12.0385L5.60687 11.8357C5.61945 11.5351 5.63371 11.1941 5.65744 10.8395C5.7159 9.96595 5.83561 8.92891 6.16756 7.93362C6.50196 6.93095 7.06705 5.92519 8.04283 5.1757Z"
      fill="#77008f"
    />
  </svg>
);

const IconPincel = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      stroke="#77008f"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10l5 5 5-5M12 15V3"
      stroke="#77008f"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconUsuarios = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke="#77008f"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconInfo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#77008f" strokeWidth="2.5" />
    <rect
      x="12"
      y="8"
      width="0.01"
      height="0.01"
      stroke="#77008f"
      strokeWidth="3.75"
    />
    <path
      d="M12 12V16"
      stroke="#77008f"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
