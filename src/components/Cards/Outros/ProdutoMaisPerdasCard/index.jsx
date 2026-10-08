import BaseCard from "../../BaseCard";

export default function ProdutoMaisPerdasCard({ produto, valor, loading }) {
  return (
    <BaseCard
      titulo="Produto com Maior Perda"
      valor={valor}
      descricao={produto}
      cor="border-red-500"
      corBg="bg-red-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
      icone={
        <svg
          className="w-5 h-5 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      }
    />
  );
}
