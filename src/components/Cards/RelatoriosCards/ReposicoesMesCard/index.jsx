import BaseCard from "../../BaseCard";

export default function ReposicoesMesCard({ valor, variacao }) {
  return (
    <BaseCard
      titulo="Reposições/mês"
      valor={valor}
      variacao={variacao}
      cor="border-blue-500"
      corBg="bg-blue-50"
      icone="/icons/refresh-cw-azul.svg"
    />
  );
}
