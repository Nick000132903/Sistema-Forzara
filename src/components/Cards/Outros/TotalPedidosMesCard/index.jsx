import BaseCard from "../../BaseCard";

export default function TotalPedidosMesCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Total de Pedidos"
      valor={quantidade}
      descricao="No mês atual"
      cor="border-emerald-500"
      corBg="bg-emerald-50"
      rota="/relatorios"
      loading={loading}
      unidade=""
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
    />
  );
}
