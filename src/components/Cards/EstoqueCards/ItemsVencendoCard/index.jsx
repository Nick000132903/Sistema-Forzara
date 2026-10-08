import BaseCard from "../../BaseCard";

export default function ItemsVencendoCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Próximos ao Vencimento"
      valor={quantidade}
      descricao="Vencem nos próximos 7 dias"
      cor="border-amber-500"
      corBg="bg-amber-50"
      rota="/estoque"
      estado={{ filtroValidade: "proximo" }}
      loading={loading}
      unidade=""
      icone="./src/assets/icons/calendar-clock-laranja.svg"
    />
  );
}
