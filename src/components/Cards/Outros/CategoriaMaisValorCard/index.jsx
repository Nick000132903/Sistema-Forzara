import BaseCard from "../../BaseCard";

export default function CategoriaMaisValorCard({ categoria, valor, loading }) {
  return (
    <BaseCard
      titulo="Categoria com Maior Estoque"
      valor={valor}
      descricao={categoria}
      cor="border-indigo-500"
      corBg="bg-indigo-50"
      rota="/estoque"
      loading={loading}
      unidade="currency"
      icone={
        <svg
          className="w-5 h-5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      }
    />
  );
}
