import BaseCard from "../../BaseCard";

export default function TaxaSaidasMesCard({ valor, variacao }) {
  return (
    <BaseCard
      titulo="Taxa de Saídas"
      valor={valor}
      variacao={variacao}
      cor="border-purple-500"
      corBg="bg-purple-50"
      icone="./src/assets/icons/arrow-right-left-roxo.svg"
    />
  );
}
