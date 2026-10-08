import BaseCard from "../../BaseCard";

export default function CMVMesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="CMV (Mês)"
      valor={valor}
      descricao="Custo de mercadoria vendida"
      cor="border-orange-500"
      corBg="bg-orange-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
      icone={
        <svg
          className="w-5 h-5 text-orange-600"
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
