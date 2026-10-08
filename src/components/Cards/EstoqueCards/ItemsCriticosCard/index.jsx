import BaseCard from "../../BaseCard";

export default function ItemsCriticosCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Itens Críticos"
      valor={quantidade}
      descricao="Abaixo do estoque mínimo"
      cor="bg-red-500"
      corBg="bg-red-50"
      rota="/estoque"
      estado={{ filtroStatus: "critico" }}
      loading={loading}
      unidade=""
      icone="./src/assets/icons/alert-circle-vermelho.svg"
    />
  );
}
