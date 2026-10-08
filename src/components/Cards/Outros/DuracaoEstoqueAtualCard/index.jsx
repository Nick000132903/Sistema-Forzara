import BaseCard from "../../BaseCard";

export default function DuracaoEstoqueAtualCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Duração do Estoque"
      valor={valor}
      descricao="Dias até zerar o estoque"
      cor="border-cyan-500"
      corBg="bg-cyan-50"
      rota="/relatorios"
      loading={loading}
      unidade=" dias"
      icone={
        <svg
          className="w-5 h-5 text-cyan-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}
