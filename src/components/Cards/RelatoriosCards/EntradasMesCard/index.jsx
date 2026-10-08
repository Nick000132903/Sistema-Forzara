import BaseCard from "../../BaseCard";

export default function EntradasMesCard({ valor, variacao }) {
  return (
    <BaseCard
      titulo="Entradas"
      valor={valor}
      variacao={variacao}
      cor="bg-teal-500"
      corBg="bg-teal-50"
      icone="/icons/log-in-teal.svg"
    />
  );
}
