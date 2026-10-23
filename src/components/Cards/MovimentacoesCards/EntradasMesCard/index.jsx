import BaseCard from "../../BaseCard";

export default function EntradasMesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Entradas (Mês)"
      valor={valor}
      descricao="Valor no mês atual"
      cor="border-emerald-500"
      corBg="bg-emerald-50"
      rota="/movimentacoes"
      estado={{ filtroTipo: "entrada" }}
      loading={loading}
      unidade="currency"
      icone="/icons/arrow-down-circle-verde.svg"
    />
  );
}
