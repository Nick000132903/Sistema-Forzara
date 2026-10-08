export default function FiltroRelatorio({
  dataSelecionada,
  setDataSelecionada,
  filtroCategoria,
  setFiltroCategoria,
  filtroOrdenacao,
  setFiltroOrdenacao,
  categorias,
}) {
  const selectClass =
    "bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3 h-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-shadow hover:border-gray-300 shadow-sm";

  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mt-6 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className={selectClass}
        >
          <option value="mar2026">Março 2026</option>
          <option value="fev2026">Fevereiro 2026</option>
          <option value="jan2026">Janeiro 2026</option>
          <option value="dez2025">Dezembro 2025</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className={selectClass}
        >
          <option value="todas">Todas categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filtroOrdenacao}
          onChange={(e) => setFiltroOrdenacao(e.target.value)}
          className={selectClass}
        >
          <option value="total_quantidade">Mais Saídas</option>
          <option value="total_valor">Maior Faturamento</option>
          <option value="nm_produto">Nome (A-Z)</option>
        </select>
      </div>

      <button className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition-colors text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md px-4 h-10 rounded-lg text-sm font-medium shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 13V17.5C20 20.5577 16 20.5 12 20.5C8 20.5 4 20.5577 4 17.5V13M12 3L12 15M12 3L16 7M12 3L8 7"
            stroke="#FFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Exportar PDF
      </button>
    </div>
  );
}
