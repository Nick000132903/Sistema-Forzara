import BaseCard from "../../BaseCard";

export default function ValorTotalEstoqueCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Valor Total em Estoque"
      valor={valor}
      descricao="Investimento atual"
      cor="border-purple-500"
      corBg="bg-purple-50"
      rota="/estoque"
      loading={loading}
      unidade="currency"
      icone={"./src/assets/icons/dollar-msg-roxo.svg"}
    />
  );
}
