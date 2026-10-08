import BaseCard from "../../BaseCard";

export default function LotesVencidosCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Lotes Vencidos"
      valor={quantidade}
      descricao="Necessitam baixa"
      cor="border-red-500"
      corBg="bg-red-50"
      rota="/estoque"
      estado={{ filtroValidade: "vencido" }}
      loading={loading}
      unidade=""
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      }
    />
  );
}
