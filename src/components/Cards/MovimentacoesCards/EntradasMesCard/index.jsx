import BaseCard from "../../BaseCard";

export default function EntradasMesCard({ valor, quantidade, loading }) {
  return (
    <BaseCard
      titulo="Entradas (Mês)"
      valor={valor}
      descricao={`${quantidade || 0} unidades`}
      cor="border-emerald-500"
      corBg="bg-emerald-50"
      rota="/movimentacoes"
      estado={{ filtroTipo: "entrada" }}
      loading={loading}
      unidade="currency"
      icone="./src/assets/icons/arrow-down-circle-verde.svg"
    />
  );
}
