import BaseCard from "../../BaseCard";

export default function TotalMovimentacoesCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="Total de Movimentações"
      valor={valor}
      descricao="No mês atual"
      cor="border-blue-500"
      corBg="bg-blue-50"
      rota="/movimentacoes"
      loading={loading}
      unidade=""
      icone="/icons/refresh-cw-azul.svg"
    />
  );
}
