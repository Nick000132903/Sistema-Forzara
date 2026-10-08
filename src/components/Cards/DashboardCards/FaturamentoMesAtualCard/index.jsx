import BaseCard from "../../BaseCard";

export default function FaturamentoMesAtualCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Faturamento (Mês)"
      valor={valor}
      descricao="Vendas do mês atual"
      cor="bg-emerald-500"
      corBg="bg-emerald-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
      icone="/icons/dollar-verde.svg"
    />
  );
}
