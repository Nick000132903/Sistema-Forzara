import BaseCard from "../../BaseCard";

export default function TotalEstoqueCard({ valor, quantidade, loading }) {
  return (
    <BaseCard
      titulo="Total em Estoque"
      valor={valor}
      descricao={`${quantidade || 0} unidades`}
      cor="border-purple-500"
      corBg="bg-purple-50"
      rota="/estoque"
      loading={loading}
      unidade="currency"
      icone="/icons/archive-roxo.svg"
    />
  );
}
