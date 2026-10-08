import { NavLink } from "react-router-dom";
import { useSidebar } from "../../../contexts";

const MenuItem = ({ to, icon, label, collapsed }) => (
  <NavLink
    to={to}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      `flex items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-2xl transition-all duration-150 ${
        isActive
          ? "bg-purple-100 text-purple-700 dark:bg-linear-to-r dark:from-[#6A1BFF]/90 dark:via-[#3C11B0]/90 dark:to-[#1A0A4E]/90 dark:backdrop-blur-md dark:text-white dark:border dark:border-[#9D66FF]/40 dark:shadow-[0_4px_15px_rgba(106,27,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#1a1534]"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <img
            src={icon}
            alt={label}
            className={`w-5 h-5 transition-all ${
              isActive ? "dark:brightness-0 dark:invert" : ""
            }`}
          />
        </div>
        {!collapsed && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </>
    )}
  </NavLink>
);

const menuItems = [
  {
    to: "/",
    icon: "/icons/layout-dashboard-roxo.svg",
    label: "Dashboard",
  },
  {
    to: "/estoque",
    icon: "/icons/package-roxo.svg",
    label: "Estoque",
  },
  {
    to: "/movimentacoes",
    icon: "/icons/arrow-right-left-roxo.svg",
    label: "Movimentações",
  },
  {
    to: "/fornecedores",
    icon: "/icons/truck-roxo.svg",
    label: "Fornecedores",
  },
  {
    to: "/relatorios",
    icon: "/icons/bar-chart-2-roxo.svg",
    label: "Relatórios",
  },
  {
    to: "/agenda",
    icon: "/icons/calendar-roxo.svg",
    label: "Agenda",
  },
  {
    to: "/configuracoes",
    icon: "/icons/settings-roxo.svg",
    label: "Configurações",
  },
];

export default function SideBar() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-white dark:bg-[#0B071E] border-r border-gray-200 dark:border-slate-800 fixed left-0 top-0 z-10 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center h-16.5 border-b border-gray-200 dark:border-slate-800 px-4">
        {collapsed ? (
          <>
            <img
              src="/images/logo-f-roxo.png"
              alt="Forzara"
              className="h-8 block dark:hidden"
            />
            <img
              src="/images/logo-f-branco.png"
              alt="Forzara"
              className="h-8 hidden dark:block"
            />
          </>
        ) : (
          <>
            <img
              src="/images/logo-roxo.png"
              alt="Forzara"
              className="h-8 block dark:hidden"
            />
            <img
              src="/images/logo-branco.png"
              alt="Forzara"
              className="h-8 hidden dark:block"
            />
          </>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-slate-800 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1534] text-gray-400 transition-colors cursor-pointer"
        >
          <img
            src="/icons/arrow-left-cinza.svg"
            alt="Toggle"
            className={`w-5 h-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
}
