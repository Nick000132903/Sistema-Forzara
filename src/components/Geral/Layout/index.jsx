import { useSidebar } from "../../../contexts";

export default function Layout({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 bg-bg-light dark:bg-surface-dark p-3 sm:p-4 md:p-6 min-h-screen ${
        collapsed ? "lg:ml-16" : "lg:ml-64"
      }`}
    >
      <div className="pt-16">{children}</div>
    </div>
  );
}
