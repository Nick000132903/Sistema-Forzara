import BaseCard from "../../BaseCard";

export default function ItemsFaltandoCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Itens em Falta"
      valor={quantidade}
      descricao="Sem estoque disponível"
      cor="bg-gray-500"
      corBg="bg-gray-50"
      rota="/estoque"
      estado={{ filtroStatus: "falta" }}
      loading={loading}
      unidade=""
      icone="/icons/minus-circle-cinza.svg"
    />
  );
}
