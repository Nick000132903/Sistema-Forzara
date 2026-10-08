import BaseCard from "../../BaseCard";

export default function MovimentacoesPendentesCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Movimentações Pendentes"
      valor={quantidade}
      descricao="Aguardando sincronização"
      cor="border-yellow-500"
      corBg="bg-yellow-50"
      rota="/movimentacoes"
      loading={loading}
      unidade=""
      icone={
        <svg
          className="w-5 h-5 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      }
    />
  );
}
