import BaseCard from "../../BaseCard";

export default function TotalMovimentacoesCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Total de Movimentações"
      valor={quantidade}
      descricao="No mês atual"
      cor="border-blue-500"
      corBg="bg-blue-50"
      rota="/movimentacoes"
      loading={loading}
      unidade=""
      icone={
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      }
    />
  );
}
