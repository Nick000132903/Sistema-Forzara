import { useState } from "react";
import {
  CardCompra,
  CardFornecedores,
  InfoFornecedores,
  ModalFornecedores,
  HeaderBar,
  SideBar,
  Layout,
} from "../../components";

export default function Fornecedores() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("historico");

  const fornecedores = [
    { id: 1, name: "Casa de Carnes Vitória", category: "Carnes", prazo: 48 },
    { id: 2, name: "Laticínios Silva e Cia", category: "Laticínios", prazo: 24 },
    { id: 3, name: "Hortifruti Oliveira ME", category: "Hortaliças", prazo: 12 },
    { id: 4, name: "Frutas Frescas LTDA", category: "Frutas", prazo: 24 },
    { id: 5, name: "Grãos e Cereais SA", category: "Grãos", prazo: 72 },
    { id: 6, name: "Temperos e Especiarias ME", category: "Temperos", prazo: 48 },
    { id: 7, name: "Bebidas Nacionais LTDA", category: "Bebidas", prazo: 24 },
    { id: 8, name: "Mercearia e Cia LTDA", category: "Mercearia", prazo: 48 },
  ];

  const fornecedoresFiltrados = fornecedores.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const abas = [
    {
      key: "historico",
      label: "Histórico de Compras",
      icon: "./src/assets/icons/shopping-cart-roxo.svg",
      inactiveIcon: "./src/assets/icons/shopping-cart-black.svg",
    },
    {
      key: "produtos",
      label: "Produtos Fornecidos",
      icon: "./src/assets/icons/package-roxo.svg",
      inactiveIcon: "./src/assets/icons/package-black.svg",
    },
    {
      key: "avaliacoes",
      label: "Avaliações",
      icon: "./src/assets/icons/star-roxo.svg",
      inactiveIcon: "./src/assets/icons/star-black.svg",
    },
  ];

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Fornecedores"
          desc="Cadastro e gerenciamento dos fornecedores."
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6 mb-6">
          <button className="flex gap-2 bg-white border border-gray-200 py-2.5 px-4 rounded-xl items-center cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
            <img
              src="./src/assets/icons/upload-preto.svg"
              alt="Upload"
              className="w-4 h-4"
            />
            Upload de Documentos
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors text-white items-center py-2.5 px-4 rounded-xl cursor-pointer text-sm font-medium shadow-sm"
          >
            <img
              src="./src/assets/icons/plus-circle-branco.svg"
              alt="Novo"
              className="w-4 h-4"
            />
            Novo Fornecedor
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 items-start">
          <div className="lg:col-span-1 w-full flex flex-col h-full min-h-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar fornecedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-shadow"
              />
              <img
                src="./src/assets/icons/search-cinza.svg"
                alt="Buscar"
                className="absolute left-3 top-3 w-4 h-4"
              />
            </div>

            <div className="flex flex-col gap-2 mt-4 overflow-y-auto pr-1 flex-1 min-h-0 pb-4">
              {fornecedoresFiltrados.length > 0 ? (
                fornecedoresFiltrados.map((f) => (
                  <CardFornecedores
                    key={f.id}
                    name={f.name}
                    category={f.category}
                    prazo={f.prazo}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  Nenhum fornecedor encontrado
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl flex flex-col overflow-hidden h-full min-h-0 bg-white shadow-sm border border-gray-100">
            <InfoFornecedores
              name="Casa de Carnes Vitória"
              cnpj="12.345.678/0001-90"
              telefone="(11) 99999-9999"
              category="Carnes"
              email="contato@carnesvitoria.com"
              status={true}
              qtdPedidos={45}
              qtdEntregas={12}
              dtParceria="29/03/2022"
              dtUltimoPedido="23/05/2026"
              vlUltimoPedido={1250.5}
              nota={4.8}
              prazo={24}
              vlTotalCompras={15780.3}
            />

            <div className="flex border-b border-gray-100 px-2 sm:px-4 overflow-x-auto">
              {abas.map((aba) => {
                const ativa = abaAtiva === aba.key;
                return (
                  <button
                    key={aba.key}
                    onClick={() => setAbaAtiva(aba.key)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                      ativa
                        ? "text-[#8B5CF6] border-[#8B5CF6]"
                        : "text-gray-400 border-transparent hover:text-gray-600"
                    }`}
                  >
                    <img
                      src={ativa ? aba.icon : aba.inactiveIcon}
                      alt={aba.label}
                      className={`w-4 h-4 ${ativa ? "" : "opacity-50"}`}
                    />
                    {aba.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 p-4 sm:p-6 overflow-y-auto">
              {abaAtiva === "historico" && (
                <>
                  <CardCompra
                    diaCompra={23}
                    mesCompra="MAI"
                    anoCompra={2026}
                    numPedido={1256}
                    status={true}
                    desc="Pedido de carnes para o final de semana."
                    qtdItens={8}
                    vlTotal={1250.5}
                    dtEntrega="24/05/2026"
                    hrEntrega="08:30"
                  />
                  <CardCompra
                    diaCompra={15}
                    mesCompra="MAI"
                    anoCompra={2026}
                    numPedido={1198}
                    status={true}
                    desc="Reposição de picanha e alcatra."
                    qtdItens={5}
                    vlTotal={890.0}
                    dtEntrega="16/05/2026"
                    hrEntrega="09:00"
                  />
                  <CardCompra
                    diaCompra={2}
                    mesCompra="MAI"
                    anoCompra={2026}
                    numPedido={1132}
                    status={false}
                    desc="Pedido cancelado pelo fornecedor."
                    qtdItens={3}
                    vlTotal={450.0}
                    dtEntrega="03/05/2026"
                    hrEntrega="10:30"
                  />
                </>
              )}

              {abaAtiva === "produtos" && (
                <p className="text-sm text-gray-400 text-center py-8">
                  Nenhum produto cadastrado para este fornecedor.
                </p>
              )}

              {abaAtiva === "avaliacoes" && (
                <p className="text-sm text-gray-400 text-center py-8">
                  Nenhuma avaliação registrada.
                </p>
              )}
            </div>
          </div>
        </div>

        {modalOpen && <ModalFornecedores onClose={() => setModalOpen(false)} />}
      </Layout>
    </>
  );
}