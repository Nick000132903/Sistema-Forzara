import BaseCard from "../../BaseCard";

export default function SaidasMesCard({ valor, quantidade, loading }) {
  return (
    <BaseCard
      titulo="Saídas (Mês)"
      valor={valor}
      descricao={`${quantidade || 0} unidades`}
      cor="border-amber-500"
      corBg="bg-amber-50"
      rota="/movimentacoes"
      estado={{ filtroTipo: "saida" }}
      loading={loading}
      unidade="currency"
      icone="./src/assets/icons/arrow-up-circle-laranja.svg"
    />
  );
}
