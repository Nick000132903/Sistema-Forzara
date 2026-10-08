import BaseCard from "../../BaseCard";

export default function TicketMedioCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Ticket Médio"
      valor={valor}
      descricao="Valor médio por cliente"
      cor="border-blue-500"
      corBg="bg-blue-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
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
            d="M9 7h6m0 10v-3m-6 3v-3m-6 3h18M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
          />
        </svg>
      }
    />
  );
}
