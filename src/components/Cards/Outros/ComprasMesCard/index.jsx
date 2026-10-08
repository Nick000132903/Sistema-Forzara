import BaseCard from "../../BaseCard";

export default function ComprasMesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Compras no Mês"
      valor={valor}
      descricao="Total de compras realizadas"
      cor="border-emerald-500"
      corBg="bg-emerald-50"
      rota="/fornecedores"
      loading={loading}
      unidade="currency"
      icone={
        <svg
          className="w-5 h-5 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      }
    />
  );
}
