import BaseCard from "../../BaseCard";

export default function FaturamentoMesCard({ valor, variacao }) {
  return (
    <BaseCard
      titulo="Faturamento"
      valor={valor}
      variacao={variacao}
      cor="border-emerald-500"
      corBg="bg-emerald-50"
      unidade="currency"
      icone="/icons/dollar-verde.svg"
    />
  );
}
