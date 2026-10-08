import BaseCard from "../../BaseCard";

export default function MediaDiariaMovimentacoesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Média Diária"
      valor={valor}
      descricao="Movimentações por dia"
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      }
    />
  );
}
