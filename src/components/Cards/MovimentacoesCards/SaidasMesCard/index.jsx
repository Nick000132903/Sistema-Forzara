import BaseCard from "../../BaseCard";

export default function SaidasMesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Saídas (Mês)"
      valor={valor}
      descricao="Valor no mês atual"
      cor="border-red-500"
      corBg="bg-red-50"
      rota="/movimentacoes"
      estado={{ filtroTipo: "saida" }}
      loading={loading}
      unidade="currency"
      icone="/icons/arrow-up-circle-laranja.svg"
    />
  );
}
