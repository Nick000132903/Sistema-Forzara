import BaseCard from "../../BaseCard";

export default function TotalItensEstoqueCard({ quantidade, loading }) {
  return (
    <BaseCard
      titulo="Total de Itens"
      valor={quantidade}
      descricao="Ingredientes cadastrados"
      cor="border-purple-500"
      corBg="bg-purple-50"
      rota="/estoque"
      loading={loading}
      unidade=""
      icone={"./src/assets/icons/bars-roxo.svg"}
    />
  );
}
