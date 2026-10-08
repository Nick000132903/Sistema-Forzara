import BaseCard from "../../BaseCard";

export default function ProdutoMaisVendidoCard({
  produto,
  quantidade,
  loading,
}) {
  return (
    <BaseCard
      titulo="Produto Mais Vendido"
      valor={quantidade}
      descricao={produto}
      cor="border-emerald-500"
      corBg="bg-emerald-50"
      rota="/relatorios"
      loading={loading}
      unidade=" unidades"
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      }
    />
  );
}
