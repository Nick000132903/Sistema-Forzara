import BaseCard from "../../BaseCard";

export default function PerdasMesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Perdas (Mês)"
      valor={valor}
      descricao="Valor no mês atual"
      cor="border-orange-500"
      corBg="bg-orange-50"
      rota="/movimentacoes"
      estado={{ filtroTipo: "perda" }}
      loading={loading}
      unidade="currency"
      icone="/icons/alert-triangle-vermelho.svg"
    />
  );
}
