import BaseCard from "../../BaseCard";

export default function PerdasMesCard({ valor, variacao }) {
  return (
    <BaseCard
      titulo="Perdas"
      valor={valor}
      variacao={variacao}
      cor="border-red-500"
      corBg="bg-red-50"
      icone="./src/assets/icons/alert-triangle-vermelho.svg"
    />
  );
}
