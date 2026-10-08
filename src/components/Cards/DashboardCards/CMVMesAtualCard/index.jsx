import BaseCard from "../../BaseCard";

export default function CMVMesAtualCard({ valor, loading }) {
  return (
    <BaseCard
      titulo="CMV (Mês)"
      valor={valor}
      descricao="Custo de mercadoria vendida"
      cor="bg-orange-500"
      corBg="bg-orange-50"
      rota="/relatorios"
      loading={loading}
      unidade="currency"
      icone="/icons/package-laranja.svg"
    />
  );
}
