import BaseCard from "../../BaseCard";

export default function MargemLucroMesAtualCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Margem de Lucro (Mês)"
      valor={valor}
      descricao="% do faturamento"
      cor="border-purple-500"
      corBg="bg-purple-50"
      rota="/relatorios"
      loading={loading}
      unidade="percentage"
      icone="./src/assets/icons/percent-roxo.svg"
    />
  );
}
