export default function CardFornecedores({
  foto,
  name,
  category,
  prazo,
  ativo = true,
  selecionado = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex justify-between items-center text-left p-4 rounded-xl border transition-all cursor-pointer active:scale-[0.99] w-full ${
        selecionado
          ? "bg-purple-50 dark:bg-[#1e1538] border-purple-300 dark:border-[#9D66FF]/40 shadow-sm"
          : "bg-white dark:bg-surface-dark border-gray-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-[#9D66FF]/30 hover:bg-purple-50/40 dark:hover:bg-surface-dark-hover"
      }`}
    >
      <div className="flex gap-4 items-center min-w-0">
        <div className="w-11 h-11 rounded-full bg-purple-400/20 flex items-center justify-center shrink-0 overflow-hidden">
          {foto ? (
            <img src={foto} alt="" className="w-full h-full object-cover" />
          ) : (
            <img
              src="/icons/user-branco.svg"
              alt=""
              className="w-5 h-5 opacity-60"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
            {name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {category} · Entrega: {prazo}h
            {!ativo && <span className="ml-2 text-red-500">• Inativo</span>}
          </p>
        </div>
      </div>
      <img
        src="/icons/arrow-down-cinza.svg"
        alt=""
        className="w-4 -rotate-90 opacity-50 shrink-0"
      />
    </button>
  );
}
