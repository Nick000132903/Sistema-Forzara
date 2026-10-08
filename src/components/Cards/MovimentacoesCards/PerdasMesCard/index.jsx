import BaseCard from "../../BaseCard";

export default function PerdasMesCard({ valor, quantidade, loading }) {
  return (
    <BaseCard
      titulo="Perdas (Mês)"
      valor={valor}
      descricao={`${quantidade || 0} unidades`}
      cor="border-red-500"
      corBg="bg-red-50"
      rota="/movimentacoes"
      estado={{ filtroTipo: "perda" }}
      loading={loading}
      unidade="currency"
      icone="./src/assets/icons/alert-triangle-vermelho.svg"
    />
  );
}
