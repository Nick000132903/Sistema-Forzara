import BaseCard from "../../BaseCard";

export default function LucroBrutoMesAtualCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Lucro Bruto (Mês)"
      valor={valor}
      descricao="Faturamento - CMV"
      cor="bg-blue-500"
      corBg="bg-blue-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
      icone="./src/assets/icons/trending-up-azul.svg"
    />
  );
}
