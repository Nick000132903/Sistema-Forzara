import BaseCard from "../../BaseCard";

export default function QuantidadeTotalEstoqueCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Quantidade em Estoque"
      valor={quantidade}
      descricao="Total de unidades"
      cor="border-purple-500"
      corBg="bg-purple-50"
      rota="/estoque"
      loading={loading}
      unidade=" unidades"
      icone={
        <svg
          className="w-5 h-5 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
          />
        </svg>
      }
    />
  );
}
