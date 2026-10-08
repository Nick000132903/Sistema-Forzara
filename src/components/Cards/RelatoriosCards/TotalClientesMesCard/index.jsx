import BaseCard from "../../BaseCard";

export default function TotalClientesMesCard({ valor, variacao }) {
  return (
    <BaseCard
      titulo="Clientes"
      valor={valor}
      variacao={variacao}
      cor="bg-indigo-500"
      corBg="bg-indigo-50"
      icone="/icons/users-indigo.svg"
    />
  );
}
