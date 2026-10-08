import BaseCard from "../../BaseCard";

export default function LucroBrutoMesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Lucro Bruto"
      valor={valor}
      descricao="Entradas - Saídas - Perdas"
      cor="border-blue-500"
      corBg="bg-blue-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
      icone="./src/assets/icons/trending-up-azul.svg"
    />
  );
}
